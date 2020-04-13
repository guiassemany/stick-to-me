
<a href="https://assemany.com">

<p align="center">
  <img width="250"  src="https://res.cloudinary.com/assemany/image/upload/v1576176260/RGB_AI-min_thy8ta.png">
</p>
</a>



> 🦉The jQuery plugin "Stick to me" allows you to create exit-popups on your web page, so you can capture visitors just as they are about to leave.

# How it Works

Stick-to-me tracks the user mouse movement and detects when to trigger the popup. See it in action on gif below.

<p align="center">
  <img src="https://res.cloudinary.com/assemany/image/upload/v1576177281/ezgif.com-optimize_pliyms.gif">
</p>

---


## Table of Contents 

- [Installation](#installation)
- [Usage](#usage)
- [Customisation](#customisation)
- [Support](#support)
- [Contributing](#contributing)
- [Donations](#contributing)
- [License](#license)
- [Credits](#credits)



## Installation

You can install this package through npm

`npm install stick-to-me`  

**-- OR --**

Just download the zip file and extract on your assets folder.


## Usage

1 - Include CSS and JS files on your project

```html
	<!-- stick-to-me -->
	<link rel="stylesheet" type="text/css" href="path/to/stick-to-me.css">
	<script src="path/to/stick-to-me.js"></script>
```
2 - Write your popup markup
```html
<div id="stickLayer" style="display:none;" class="stick_popup">
	<div class="stick_close" onclick="$.stick_close()">X</div>
	<div class="stick_content">
	    <h1>Hello! I got your attention!</h1>
	</div>
</div>
```
 
3 - Tell stick-to-me the id of your popup 
```js
<script>
	$(document).ready(function(){
		$.stickToMe({
			layer: '#stickLayer'			
		});
	});
</script>
```


## Customisation
Stick to me allows a few customisations. See options below.


| Property | Description | default |
|---|---|---|
| layer | jQuery select of your popup html | empty |
| fadespeed |Controls the speed of the fade animation | 400 |
| trigger | Where detection of exit intent takes place | top |
| delay | Delay before showing popup when exit intent is detected | 0 |
| interval | Interval between popups | 0 |
| maxamount | Maximum times the popup will be triggered | 0 = unlimited |
| cookie | Set cookie to prevent opening again on the same browser | false |
| bgclickclose | Clicking on background closes the popup | true |
| escclose | pressing ESC closes the popup | true |
| onleave | function to be called when popup closes | empty fn |

## Support

If you need help, reach out to me at one of the following places!

- Website at <a href="https://assemany.com" target="_blank">`assemany.com`</a>
- E-mail guilherme@assemany.com

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Postcardware
You're free to use this package, but if it makes it to your production environment we highly appreciate you sending us a postcard from your hometown, mentioning which of our package(s) you are using.

Our address is: Rua Dias de Toledo, 91, Vila da saúde, São Paulo / SP - Brazil.

## Donations


<a href="https://www.buymeacoffee.com/assemany" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-green.png" alt="Buy Me A Coffee" style="height: 20px !important; width: 150px !important;" ></a>


## License

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)
- **[MIT license](http://opensource.org/licenses/mit-license.php)**

## Credits
- GIF Landing Page template - https://onepagelove.com/evolo
