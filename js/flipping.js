var flipping = {

    page: 0,
    i: 0,
    j: 0,

    imgfr: null,
    imgbk: null,

    images: [],
    direction: null,

    flipping_cards: null,
    cards: null,

    options: {
        auto: true,
        time: 1000,
        shadow: true
    },


    init: function (elem, opt) {

        var self = this;

        self.flipping_cards = document.getElementById(elem);
        self.flipping_cards.style.display = 'flex';

        self.cards = self.flipping_cards.getElementsByClassName('card');


        this.flipping_cards.onmouseover = (function () {
            this.options.auto = false;
        }).bind(this);


        self.flipping_cards.onmouseout = function () {
            self.options.auto = true;
        };

        self.flipping_cards.querySelectorAll('button')[0].addEventListener('click', self.backward(), false);

        self.flipping_cards.querySelectorAll('button')[1].onclick = function () {
            self.forward();
        };


        for (var i = 0; i < this.cards.length; i++) {

            self.images[i] = [];
            var divs = self.cards[i].children;

            for (j = 0; j < divs.length; j++) {
                self.images[i][j] = divs[j].innerHTML;//.getElementsByTagName('img')[0].src //.getElementsByTagName('div')
            }

            self.cards[i].innerHTML = '<div class="front"></div><div class="back"></div>';

        }


        // prepare cards
        for (i = 0; i < self.cards.length; i++) {

            var fr = self.cards[i].getElementsByClassName('front')[0];
            var bk = self.cards[i].getElementsByClassName('back')[0];

            bk.style.display = 'block';
            fr.innerHTML = this.images[i][0];
            //fr.style.backgroundImage = 'url(' + images[i][0] + ')';
            bk.style.transform = 'rotateY(180deg)';

        }

        /* options */
        if (opt.auto === false) self.options.auto = false;
        if (opt.time !== null) self.options.time = opt.time;
        if (opt.shadow === false) self.options.shadow = false;


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

                if (self.options.auto) {
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
