# flipping-cards

Flipping Cards Carousel

### [Demo and usage]

**Supports:**

- Forward / backward flip
- Number of cards per row or column
- Custom items sizes
- Custom animation delays
- Simultaneous and  sequential rotation mode
- Automatic flip mode

## Usage

For using Flipping Cards Carousel on a web page use linking to the library and the styles:

```html
    <link rel="stylesheet" href="/path/to/styles/flipping.css"/>
    <script src='/path/to/flipping.js'></script>
```

On the page put the code for the carousel. For example:

```html
<div id="flipping_cards" class="flipping">

            <div>
                <button>&#9668;</button>
            </div>

            <div class="slides">

                <div class="deck">
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
                </div>

            </div>

            <div>
                <button>&#9658;</button>
            </div>

        </div>
```

The block `<div class="card-deck">` is a deck of cards. You can add multiple decks. Inside it, each card is a `div` element with your custom html content.

## Initialization

Initialize the component by calling `flipping.init('flipping_cards', options)` where the first parameter corresponds to the `id` of the html-tag of the carousel.

```javascript
document.addEventListener("DOMContentLoaded", function () {

    var options = {
        "autoflip-mode": false,
        "autoflip-delay": 1500,
        "shadow": true,
        "transition-duration": 700,
        "rotation-mode": "sequential",
        "sequential-delay": 600,
        "card-width": 150,
        "card-height": 180,
        "cards-per-row": 3
    };

    flipping.init('flipping_cards', options);

});
```

## Options

- `autoflip-mode` : [true | false] - start flipping in automatic mode
- `autoflip-delay` : [ms] - delay before the next set of cards in automatic mode [ms]
- `shadow` : [true | false] - on/off shadow
- `transition-duration` : [ms] - card flip transition duration
- `rotation-mode` : [simultaneous | sequential] - simultaneous or sequential mode
- `sequential-delay` : [ms] - sequential delay before neighboring cards flip
- `cards-per-row` : [num] - Number of cards per row
- `number-of-rows` : [num] - Number of rows
- `card-width` : [num] - Card width
- `card-height` : [num] - Card height



## Demo

**To run demo locally:**


```sh
$ git clone https://github.com/mad48/flipping-cards.git
```


Then open .../flipping-cards/demo/index.html as local file in your browser.

License
----

MIT

[//]: #

[Demo and usage]: <https://mad48.github.io/flipping-cards/demo/index.html>

