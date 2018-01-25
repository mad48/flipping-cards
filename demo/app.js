import React from 'react';
import ReactDOM from 'react-dom';

import FlippingCards from "../src/js/flipping-react";

require('../src/css/flipping.scss');
require('../src/css/card.scss');


var configuration = {
    autoFlipMode: false,
    autoFlipDelay: 1500,
    pauseMouseOver: true,

    displayShadow: true,
    transitionDuration: 700,

    rotationMode: "simultaneous",
    sequentialDelay: 600,

    cardWidth: 150,
    cardHeight: 180,

    spacingHorizontal: 15,
    spacingVertical: 15,

    cardsToShow: 3,
    cardsPerRow: 3,

    startFromIndex: 1
};

var content = [
    '<div><h2>Lorem ipsum<br>1</h2><span class="readmore"><a href="#"  onclick=" alert(\'More about -1- Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span><img src="../demo/images/1.jpg"/></div>',
    '<div><h2>Lorem ipsum<br>2</h2><span class="readmore"><a href="#"  onclick="alert(\'More about -2- Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span><img src="../demo/images/2.jpg"/></div>',
    '<div><h2>Lorem ipsum<br>3</h2><span class="readmore"><a href="#"  onclick="alert(\'More about -3- Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span><img src="../demo/images/3.jpg"/></div>',
    '<div><h2>Lorem ipsum<br>4</h2><span class="readmore"><a href="#"  onclick="alert(\'More about -4- Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span><img src="../demo/images/4.jpg"/></div>',
    '<div><h2>Lorem ipsum<br>5</h2><span class="readmore"><a href="#"  onclick="alert(\'More about -5- Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span><img src="../demo/images/5.jpg"/></div>',
    '<div><h2>Lorem ipsum<br>6</h2><span class="readmore"><a href="#"  onclick="alert(\'More about -6- Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span><img src="../demo/images/6.jpg"/></div>',
    '<div><h2>Lorem ipsum<br>7</h2><span class="readmore"><a href="#"  onclick="alert(\'More about -7- Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span><img src="../demo/images/7.jpg"/></div>',
    '<div><h2>Lorem ipsum<br>8</h2><span class="readmore"><a href="#"  onclick="alert(\'More about -8- Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span><img src="../demo/images/8.jpg"/></div>',
    '<div><h2>Lorem ipsum<br>9</h2><span class="readmore"><a href="#"  onclick="alert(\'More about -9- Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span><img src="../demo/images/9.jpg"/></div>',
    '<div><h2>Lorem ipsum<br>10</h2><span class="readmore"><a href="#"  onclick="alert(\'More about -10- Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span><img src="../demo/images/10.jpg"/></div>',
    '<div><h2>Lorem ipsum<br>11</h2><span class="readmore"><a href="#"  onclick="alert(\'More about -11- Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span><img src="../demo/images/11.jpg"/></div>',
    '<div><h2>Lorem ipsum<br>12</h2><span class="readmore"><a href="#"  onclick="alert(\'More about -12- Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span><img src="../demo/images/12.jpg"/></div>',
    '<div><h2>Lorem ipsum<br>13</h2><span class="readmore"><a href="#"  onclick="alert(\'More about -13- Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span><img src="../demo/images/13.jpg"/></div>',
    '<div><h2>Lorem ipsum<br>14</h2><span class="readmore"><a href="#"  onclick="alert(\'More about -14- Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span><img src="../demo/images/14.jpg"/></div>',
    '<div><h2>Lorem ipsum<br>15</h2><span class="readmore"><a href="#"  onclick="alert(\'More about -15- Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span><img src="../demo/images/15.jpg"/></div>',
];



class App extends React.Component {

    render() {
        return (
            <FlippingCards
                id="flipping_cards"
                configuration={configuration}
                content={content}
            />
        )

    }
}

ReactDOM.render(<App/>, document.getElementById("app"));
