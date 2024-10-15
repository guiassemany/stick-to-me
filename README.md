# StickToMe

StickToMe is a lightweight, customizable exit-intent popup plugin for modern web applications. It's designed to capture user attention just before they leave your website, making it perfect for newsletter signups, special offers, or important messages.

## Features

- No jQuery dependency - pure JavaScript implementation
- Customizable trigger conditions (top, left, right, bottom, or all)
- Mobile-friendly with option to disable on mobile devices
- Customizable delay before showing the popup
- Interval setting to control popup appearance frequency
- Maximum number of popup displays
- Cookie-based tracking for cross-session popup limiting
- Background click and ESC key closure options
- Fade in/out animations
- Custom trigger support for advanced use cases
- Callback functions for show and close events

## Installation

```bash
npm install stick-to-me
```

Or include it directly in your HTML:

```html
<script src="path/to/stick-to-me-modern.js"></script>
```

## Usage

```javascript
import StickToMe from 'stick-to-me';

const popup = new StickToMe({
  layer: '#myPopup',
  trigger: ['top', 'left'],
  delay: 1000,
  maxamount: 5,
  cookie: true,
  cookieExpiration: 7 * 24 * 60 * 60, // 7 days
  onshow: () => console.log('Popup shown'),
  onclose: () => console.log('Popup closed'),
  mobileDisable: true,
  customTrigger: null
});
```

## Options

- `layer` (string): Selector for your popup element
- `fadespeed` (number): Speed of fade animation in milliseconds (default: 400)
- `trigger` (array): Array of trigger positions ('top', 'left', 'right', 'bottom', 'all')
- `maxtime` (number): Maximum time before popup appears (in milliseconds, 0 for no limit)
- `mintime` (number): Minimum time before popup can appear (in milliseconds)
- `delay` (number): Delay before showing popup after trigger (in milliseconds)
- `interval` (number): Interval between popup appearances (in milliseconds, 0 for no interval)
- `maxamount` (number): Maximum number of times to show popup (0 for unlimited)
- `cookie` (boolean): Use cookies to track popup displays across sessions
- `cookieExpiration` (number): Cookie expiration time in seconds
- `bgclickclose` (boolean): Close popup when clicking outside
- `escclose` (boolean): Close popup when pressing ESC key
- `onshow` (function): Callback function when popup is shown
- `onclose` (function): Callback function when popup is closed
- `mobileDisable` (boolean): Disable popup on mobile devices
- `customTrigger` (function): Custom function to trigger the popup

## Browser Support

StickToMe is compatible with all modern browsers including Chrome, Firefox, Safari, and Edge.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
