var flipping = {

    page: 0,
    i: 0,
    j: 0,

    imgfr: "",
    imgbk: "",

    images: [],

    flipping_cards: "",
    cards: "",

    options: {
        auto: true,
        time: 1000,
        shadow: true
    },
    direction: 0,

    init: function (elem, opt) {


        this.flipping_cards = document.getElementById(elem);
        this.flipping_cards.style.display = 'flex';

        this.cards = this.flipping_cards.getElementsByClassName('card');

        this.flipping_cards.onmouseover = function () {
            flipping.options.auto = false;
        };

        this.flipping_cards.onmouseout = function () {
            flipping.options.auto = true;

        };


        this.flipping_cards.querySelectorAll('button')[0].onclick = function () {
            flipping.backward();
            return true;
        };

        this.flipping_cards.querySelectorAll('button')[1].onclick = function () {
            flipping.forward();
            return true;
        };


        for (var i = 0; i < this.cards.length; i++) {

            this.images[i] = [];
            var divs = this.cards[i].children;

            for (j = 0; j < divs.length; j++) {
                this.images[i][j] = divs[j].innerHTML;//.getElementsByTagName('img')[0].src //.getElementsByTagName('div')
            }

            this.cards[i].innerHTML = '<div class="front"></div><div class="back"></div>';

        }


        // prepare cards
        for (i = 0; i < this.cards.length; i++) {

            var fr = this.cards[i].getElementsByClassName('front')[0];
            var bk = this.cards[i].getElementsByClassName('back')[0];

            bk.style.display = 'block';
            fr.innerHTML = this.images[i][0];
            //fr.style.backgroundImage = 'url(' + images[i][0] + ')';
            bk.style.transform = 'rotateY(180deg)';

        }

        /* options */
        if (opt.auto === false) this.options.auto = false;
        if (opt.time !== null) this.options.time = opt.time;
        if (opt.shadow === false) this.options.shadow = false;


        /* shadow */
        if (this.options.shadow === false) {

            [].forEach.call(this.flipping_cards.querySelectorAll('button'), function (el) {
                el.style.textShadow = "none";
            });
            this.flipping_cards.querySelectorAll('.front, .back').forEach(function (el) {
                el.style.boxShadow = "none";
            });
        }

        /* auto scroll */
        if (this.options.auto === true) {

            setTimeout(function go() {

                if (flipping.options.auto) {
                    if (flipping.page == 0) flipping.direction = 1;
                    if (flipping.page == flipping.images[0].length - 1) flipping.direction = -1;

                    if (flipping.direction == 1) {
                        flipping.forward();
                    } else {
                        flipping.backward();
                    }
                }
                setTimeout(go, flipping.options.time);

            }, flipping.options.time);


        }
    },


    backward: function () {

        for (var i = 0; i < this.cards.length; i++) {

            var fr = this.cards[i].getElementsByClassName('front')[0];
            var bk = this.cards[i].getElementsByClassName('back')[0];

            // if first
            if (this.page <= 0) {
                this.page = 0;
                return;
            }

            if (this.page % 2) {
                this.imgfr = this.page - 1;
                this.imgbk = this.page;
            }
            else {
                this.imgfr = this.page;
                this.imgbk = this.page - 1;
            }

            fr.innerHTML = this.images[i][this.imgfr];
            bk.innerHTML = this.images[i][this.imgbk];

            fr.style.transform = 'rotateY(' + (-180 * (this.page - 1)) + 'deg)';
            if (this.page > 1) {
                bk.style.transform = 'rotateY(' + (-180 * (this.page - 2)) + 'deg)';
            }
            else {
                bk.style.transform = 'rotateY(' + 180 + 'deg)';
            }

        }
        this.page = this.page - 1;
    }
    ,


    forward: function () {

        for (var i = 0; i < this.cards.length; i++) {

            var fr = this.cards[i].getElementsByClassName('front')[0];
            var bk = this.cards[i].getElementsByClassName('back')[0];

            // if last
            if (this.page >= this.images[i].length - 1) {
                this.page = this.images[i].length - 1;
                return;
            }

            if (this.page % 2) {
                this.imgfr = this.page + 1;
                this.imgbk = this.page;
            }
            else {
                this.imgfr = this.page;
                this.imgbk = this.page + 1;
            }

            fr.innerHTML = this.images[i][this.imgfr];
            bk.innerHTML = this.images[i][this.imgbk];

            fr.style.transform = 'rotateY(' + (-180 * (this.page + 1)) + 'deg)';
            bk.style.transform = 'rotateY(' + (-180 * this.page) + 'deg)';

        }

        this.page = this.page + 1;
    }
};

/*
 (function () {
 })(this); // }).call(this);
 */

/*    
 document.addEventListener("DOMContentLoaded", function () {
 });
 */

//export default flipping;

if (typeof module === 'object') {
    module.exports.flipping = flipping;
}
