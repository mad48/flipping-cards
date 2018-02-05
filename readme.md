[![npm][npm]][npm-url]
[![node][node]][node-url]
# flipping-cards

> Flipping Cards Carousel

### [Demo and usage]

## Usage

For using Flipping Cards Carousel on a web page use linking to the library and the styles:

```html
<link rel="stylesheet" href="/path/to/styles/flipping.css" />
<script src="/path/to/flipping.js"></script>
```

On the page put the code for the carousel. For example:

```html
<div id="flipping_cards" class="flipping">

            <div class="btn-backward"></div>

            <div class="cards">
                <div>
                    <h2>Custom text 1</h2>
                    <img src="images/pic1.jpg"/>
                </div>
                <div>
                    <span>Custom text 2</span>
                    <img src="images/pic2.jpg"/>
                </div>
                <div>
                    <b>Custom text 3</b>
                    <img src="images/pic3.jpg"/>
                </div>
                ...

            </div>

            <div class="btn-forward"></div>

        </div>
```

Each `<div>` item inside the element`<div class="cards">` is a card with your custom html content.

## Initialization

Initialize the component by calling `flipping.init('flipping_cards', configuration)` where the first parameter corresponds to the `id` of the html-tag of the carousel.

```javascript
document.addEventListener("DOMContentLoaded", function () {

    var configuration = {
        autoFlipMode: false,
        autoFlipDelay: 1500,
        pauseMouseOver: true,
        cardsShadow: true,
        buttonShadow: true,
        transitionDuration: 700,
        rotationMode: "sequential",
        sequentialDelay: 600,
        cardWidth: 150,
        cardHeight: 180,
        spacingHorizontal: 15,
        spacingVertical: 15,
        cardsToShow: 3,
        cardsPerRow: 3,
        startFromIndex: 1,
        buttonBackwardHtml: "&#9668;",
        buttonForwardHtml: "&#9658;"
    };

    flipping.init('flipping_cards', configuration);

});
```

## Installation

First, install the package using npm:
```sh
npm install flipping-cards --save
```
Then, require the package and use it like so:
```javascript
import flipping from "flipping-cards";
import "flipping-cards/dist/css/flipping.css";
```

## Options

- `autoFlipMode` : [true | false] - start flipping in automatic mode
- `autoFlipDelay` : [ms] - delay before the next set of cards in automatic mode
- `cardsShadow` : [true | false] - on/off cards shadow
- `buttonsShadow` : [true | false] - on/off buttons shadow
- `transitionDuration` : [ms] - card flip transition duration
- `rotationMode` : [simultaneous | sequential] - simultaneous or sequential mode
- `sequentialDelay` : [ms] - sequential delay before neighboring cards flip
- `cardWidth` : [px] - card width
- `cardHeight` : [px] - card height
- `spacingHorizontal` : [px] - horizontal cards spacing
- `spacingVertical` : [px] - vertical cards spacing
- `cardsToShow` : [num] - number of cards to show
- `cardsPerRow` : [num] - number of cards per row
- `startFromIndex` : [num] - starter set of cards
- `buttonBackwardHtml` : [html] - backward button html code
- `buttonForwardHtml` : [html] - forward button html code

**Supports:**

- Forward / backward flip
- Number of cards per row or column
- Custom items sizes
- Custom animation delays
- Simultaneous and  sequential rotation mode
- Automatic flip mode

**Browser Support:**
- Google Chrome 36+
- Mozilla Firefox 16+
- Internet Explorer 10+
- Apple Safari 9+
- Opera 23+

## Demo

**To run demo locally:**


```sh
$ git clone https://github.com/mad48/flipping-cards.git
```


Then open .../flipping-cards/demo/index.html as local file in your browser.

License
----

[MIT](http://www.opensource.org/licenses/mit-license.php)

[//]: #

[Demo and usage]: <https://mad48.github.io/flipping-cards/demo/index.html>

[npm]: https://img.shields.io/npm/v/flipping-cards.svg
[npm-stats]: https://img.shields.io/npm/dm/flipping-cards.svg
[npm-url]: https://npmjs.com/package/flipping-cards

[node]: https://img.shields.io/node/v/flipping-cards.svg
[node-url]: https://nodejs.org