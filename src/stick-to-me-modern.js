class StickToMe {
  constructor(configs) {
    this.settings = { ...this.getDefaults(), ...configs };
    this.init();
  }

  getDefaults() {
    return {
      layer: "",
      fadespeed: 400,
      trigger: ['top'],
      maxtime: 0,
      mintime: 0,
      delay: 0,
      interval: 0,
      maxamount: 0,
      cookie: false,
      bgclickclose: true,
      escclose: true,
      cookieExpiration: 7 * 24 * 60 * 60, // 7 days in seconds
      onleave: () => {},
      disableleftscroll: true,
      onshow: () => {}, // New callback
      onclose: () => {}, // New callback
      mobileDisable: false, // New option to disable on mobile devices
      customTrigger: null, // New option for custom trigger function
    };
  }

  init() {
    this.layer = document.querySelector(this.settings.layer);
    if (this.layer) this.layer.style.display = 'none';

    this.startuptime = Date.now();
    this.updateWindowDimensions();
    this.resetState();
    if (this.settings.mobileDisable && this.isMobileDevice()) {
      return; // Don't set up event listeners on mobile devices if mobileDisable is true
    }
    this.setupEventListeners();
  }

  resetState() {
    this.offsetbind = false;
    this.howmanytimes = 0;
    this.lasttime = 0;
    this.lastx = 0;
    this.lasty = 0;
    this.boxShown = false;
  }

  setupEventListeners() {
    if (this.settings.customTrigger) {
      this.settings.customTrigger(this.handleCustomTrigger);
    } else {
      document.addEventListener('mousemove', this.handleMouseMove, { passive: true });
      document.addEventListener('mouseleave', this.handleMouseLeave);
      window.addEventListener('resize', this.debounce(this.updateWindowDimensions, 250), { passive: true });
    }
  }

  handleMouseMove = (e) => {
    this.lastx = e.pageX;
    this.lasty = e.pageY;
  }

  handleMouseLeave = (e) => {
    if (this.settings.delay > 0) {
      setTimeout(() => this.onTheLeave(e), this.settings.delay);
    } else {
      this.onTheLeave(e);
    }
  }

  updateWindowDimensions = () => {
    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth;
  }

  handleCustomTrigger = () => {
    if (this.canShowPopup()) {
      this.showBox();
    }
  }

  onTheLeave(e) {
    const leaveSide = this.calculateLeaveSide(e);
    if (this.shouldShowPopup(leaveSide) && this.canShowPopup()) {
      this.settings.onleave.call(this, leaveSide);
      this.showBox();
      this.updatePopupState();
    }
  }

  showBox() {
    if (!this.boxShown) {
      this.boxShown = true;
      const { blockLayer, container } = this.createPopupElements();
      this.setupPopupEventListeners(blockLayer);
      this.fadeIn(blockLayer);
      this.fadeIn(container, () => {
        this.settings.onshow.call(this); // Call onshow callback
      });
    }
  }

  close = () => {
    const container = document.querySelector('.stick-container');
    const blockLayer = document.querySelector('.stick-block-layer');

    if (container && blockLayer) {
      this.fadeOut(container, () => {
        container.remove();
        this.fadeOut(blockLayer, () => {
          blockLayer.remove();
          this.boxShown = false;
          this.settings.onclose.call(this); // Call onclose callback
        });
      });
    }

    // Remove event listeners
    if (this.settings.bgclickclose) {
      document.removeEventListener('click', this.handleOutsideClick);
    }
    if (this.settings.escclose) {
      document.removeEventListener('keyup', this.handleEscKey);
    }
  }

  fadeIn = (element, callback) => {
    element.style.opacity = '0';
    element.style.display = 'block';

    const fade = () => {
      let opacity = parseFloat(element.style.opacity);
      if (opacity < 1) {
        opacity += 0.1;
        element.style.opacity = opacity.toString();
        requestAnimationFrame(fade);
      } else if (callback) {
        callback();
      }
    };

    requestAnimationFrame(fade);
  }

  fadeOut(element, callback) {
    const fade = () => {
      let opacity = parseFloat(element.style.opacity);
      if (opacity > 0) {
        opacity -= 0.1;
        element.style.opacity = opacity;
        requestAnimationFrame(fade);
      } else {
        element.style.display = 'none';
        if (callback) callback();
      }
    };

    requestAnimationFrame(fade);
  }

  getCookieAmount = () => {
    const name = 'ck_stick_visit=';
    const cookieArray = document.cookie.split(';');

    for (const cookie of cookieArray) {
      const trimmedCookie = cookie.trim();
      if (trimmedCookie.startsWith(name)) {
        return parseInt(trimmedCookie.substring(name.length), 10);
      }
    }
    return 0;
  }

  setCookie(amount) {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + (this.settings.cookieExpiration * 1000));
    const expires = this.settings.cookieExpiration > 0 ? `expires=${expirationDate.toUTCString()};` : '';
    document.cookie = `ck_stick_visit=${amount};${expires}path=/`;
  }

  calculateLeaveSide(e) {
    const scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
    const scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);

    let clientY, clientX;
    if (e.clientY < 0 || e.clientX < 0) {
      clientY = -this.lasty + scrollTop;
      clientX = this.lastx - scrollLeft;
    } else {
      clientY = -e.clientY + scrollTop;
      clientX = e.clientX - scrollLeft;
    }

    const ey1 = (-this.windowHeight / this.windowWidth) * clientX;
    const ey2 = ((this.windowHeight / this.windowWidth) * clientX) - this.windowHeight;

    if (clientY >= ey1) {
      return clientY >= ey2 ? "top" : "right";
    } else {
      return clientY >= ey2 ? "left" : "bottom";
    }
  }

  shouldShowPopup(leaveSide) {
    return this.settings.trigger.includes(leaveSide) || this.settings.trigger.includes('all');
  }

  canShowPopup() {
    const now = Date.now();
    const timeSinceStartup = now - this.startuptime;
    const cookieAmount = this.getCookieAmount();

    return timeSinceStartup >= this.settings.mintime &&
           (this.settings.maxtime === 0 || timeSinceStartup <= this.settings.maxtime) &&
           (this.settings.maxamount === 0 || this.howmanytimes < this.settings.maxamount) &&
           (this.settings.interval === 0 || now - this.lasttime >= this.settings.interval) &&
           (!this.settings.cookie || cookieAmount < this.settings.maxamount);
  }

  updatePopupState() {
    this.howmanytimes++;
    if (this.settings.cookie) {
      this.setCookie(this.getCookieAmount() + 1);
    }
    this.lasttime = Date.now();
  }

  createPopupElements() {
    const blockLayer = document.createElement('div');
    blockLayer.className = 'stick-block-layer';
    Object.assign(blockLayer.style, this.settings.backgroundcss);
    document.body.appendChild(blockLayer);

    const container = document.createElement('div');
    container.className = 'stick-container';
    document.body.appendChild(container);

    const popupContent = this.layer.cloneNode(true);
    Object.assign(popupContent.style, this.settings.boxcss);
    container.appendChild(popupContent);

    return { blockLayer, container };
  }

  setupPopupEventListeners(blockLayer) {
    if (this.settings.bgclickclose) {
      document.addEventListener('click', this.handleOutsideClick);
    }

    if (this.settings.escclose) {
      document.addEventListener('keyup', this.handleEscKey);
    }
  }

  handleOutsideClick = (e) => {
    if (this.layer && !this.layer.contains(e.target)) {
      this.close();
    }
  }

  handleEscKey = (e) => {
    if (e.key === 'Escape') {
      this.close();
    }
  }

  isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
}

export default StickToMe;
