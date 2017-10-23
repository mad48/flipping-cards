var flipping = {

    page: 0,
    imgfr: null,
    imgbk: null,

    images: [],
    direction: null,

    flipping_cards: null,
    cards: null,

    paused: false,

    options: {
        auto: true,
        time: 1500,
        shadow: true
    },


    init: function (elem, opt) {

        var self = this;
        var divs = null;

        self.flipping_cards = document.getElementById(elem);
        self.flipping_cards.style.display = 'flex';

        self.cards = self.flipping_cards.getElementsByClassName('card');


        /* options */
        if (opt.auto === false) self.options.auto = false;
        if (opt.auto === true) self.options.auto = true;

        if (opt.time !== null) self.options.time = opt.time;

        if (opt.shadow === false) self.options.shadow = false;
        if (opt.shadow === true) self.options.shadow = true;

        // add suspend actions if automatic flipping is enabled
        if (self.options.auto == true) {
            self.flipping_cards.onmouseover = function () {
                self.paused = true;
            };

            self.flipping_cards.onmouseout = function () {
                self.paused = false;
            }
        }

        // on deactivate window
        window.onblur = function () {
            self.paused = true;
        };
        window.onfocus = function () {
            self.paused = false;
        };


        var buttons = self.flipping_cards.querySelectorAll('button');
        buttons[0].onclick = function () {
            self.backward();
        };
        buttons[1].onclick = function () {
            self.forward();
        };


        for (var i = 0; i < self.cards.length; i++) {

            self.images[i] = [];
            divs = self.cards[i].children;

            for (var j = 0; j < divs.length; j++) {
                self.images[i][j] = divs[j].innerHTML;
            }

            self.cards[i].innerHTML = '<div class="front"></div><div class="back"></div>';

        }


        // prepare cards
        for (i = 0; i < self.cards.length; i++) {

            var fr = self.cards[i].getElementsByClassName('front')[0];
            var bk = self.cards[i].getElementsByClassName('back')[0];

            bk.style.display = 'block';
            fr.innerHTML = this.images[i][0];
            bk.style.transform = 'rotateY(180deg)';

        }


        /* shadow */
        if (self.options.shadow === false) {

            [].forEach.call(self.flipping_cards.querySelectorAll('button'), function (el) {
                el.style.textShadow = "none";
            });
            self.flipping_cards.querySelectorAll('.front, .back').forEach(function (el) {
                el.style.boxShadow = "none";
            });
        }

        /* auto scroll */
        if (self.options.auto === true) {

            setTimeout(function go() {

                if (self.options.auto && self.paused === false) {
                    //console.log("do auto");
                    if (self.page == 0) self.direction = 1;
                    if (self.page == self.images[0].length - 1) self.direction = -1;

                    if (self.direction == 1) {
                        self.forward();
                    } else {
                        self.backward();
                    }
                }
                setTimeout(go, self.options.time);

            }, self.options.time);

        }
    },


    backward: function () {

        for (var i = 0; i < this.cards.length; i++) {

            var fr = this.cards[i].getElementsByClassName('front')[0];
            var bk = this.cards[i].getElementsByClassName('back')[0];

            // if first
            if (this.page == 0) {
                console.log(this.page);
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
    },


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
