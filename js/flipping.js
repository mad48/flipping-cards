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
        shadow: true,
        sequential: 0
    },

    k: 0,
    imnum: 0,
    krug: [],
    krugfr: 0,
    krugbk: 1,

    init: function (elem, opt) {

        var self = this;
        var divs = null;

        self.flipping_cards = document.getElementById(elem);
        self.flipping_cards.style.display = 'flex';

        self.deck = self.flipping_cards.getElementsByClassName('card');


        /* options */
        if (opt.auto === false) self.options.auto = false;
        if (opt.auto === true) self.options.auto = true;

        if (opt.time !== null) self.options.time = opt.time;

        if (opt.shadow === false) self.options.shadow = false;
        if (opt.shadow === true) self.options.shadow = true;

        if (opt.sequent !== null) self.options.sequent = opt.sequent;

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
            // self.backward();
        };
        buttons[1].onclick = function () {
            self.forward();
        };


        for (var i = 0; i < self.deck.length; i++) {

            self.images[i] = [];
            divs = self.deck[i].children;

            for (var j = 0; j < divs.length; j++) {
                self.images[i][j] = divs[j].innerHTML;
            }

            self.deck[i].innerHTML = '<div class="front"></div><div class="back"></div>';

        }


        // prepare cards
        for (i = 0; i < self.deck.length; i++) {

            var fr = self.deck[i].getElementsByClassName('front')[0];
            var bk = self.deck[i].getElementsByClassName('back')[0];

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
                    // if (self.page == self.images[0].length - 1) self.direction = -1;

                    if (self.direction == 1) {
                        self.forward();
                    } else {
                        // self.backward();
                    }
                }
                setTimeout(go, self.options.time);

            }, self.options.time);

        }
    },

    matrix: function (len) {

        var m = 0;
        var n = 0;

        var j;

        var mas1 = [];
        var mas2 = [];

        if (len % 2 != 0) {

            for (j = 1; j < len; j++) {
                if (j % 2 === 0) {
                    mas1[m++] = j;
                    mas1[m++] = j;
                } else {
                    mas2[n++] = j;
                    mas2[n++] = j;
                }

            }
            mas1.unshift(0);
            mas2.push(0);

            /*            console.log(mas1);
             console.log(mas2);*/
        }


        if (len % 2 == 0) {


            for (j = 1; j < len; j++) {
                if (j % 2 === 0) {
                    mas1[m++] = j;
                    mas1[m++] = j;
                } else {
                    mas2[n++] = j;
                    mas2[n++] = j;
                }

            }
            mas1.unshift(0);
            mas1.push(0);


            /*            console.log(mas1);
             console.log(mas2);*/
        }

        return [mas1, mas2];


    },


    backward: function () {

        for (var i = 0; i < this.deck.length; i++) {

            var fr = this.deck[i].getElementsByClassName('front')[0];
            var bk = this.deck[i].getElementsByClassName('back')[0];

            // if first
            if (this.page <= 0) {
                //console.log(this.page);
                //  this.page = 0;
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

            fr.style.transform = 'rotateY(' + (-180 * (this.k - 1)) + 'deg)';
            if (this.page > 1) {
                bk.style.transform = 'rotateY(' + (-180 * (this.k - 2)) + 'deg)';
            }
            else {
                bk.style.transform = 'rotateY(' + 180 + 'deg)';
            }

        }

        this.k--;
        this.page = this.page - 1;

    },


    forward: function () {

        var self = this;
        var buttons = null;
        var i = 0;
        var f = function () {
            // if (self.paused === false)
            self.forwardflip(i);

            if (i == 0) {
                buttons = self.flipping_cards.querySelectorAll('button');
                buttons[0].onclick = function () {
                };
                buttons[1].onclick = function () {
                };
            }

            i = i + 1;
            
            if (i == self.deck.length) {

                /* console.log("this.k " + self.k);*/
                self.k++;
                self.imnum++;
                self.page = self.page + 1;

                buttons = self.flipping_cards.querySelectorAll('button');
                buttons[0].onclick = function () {
                    // self.backward();
                };
                buttons[1].onclick = function () {
                    self.forward();
                };

            }

            if (i < self.deck.length) setTimeout(f, self.options.sequent);

        };

        f();
    },


    forwardflip: function (i) {


        var fr = this.deck[i].getElementsByClassName('front')[0];
        var bk = this.deck[i].getElementsByClassName('back')[0];


        if (this.imnum >= this.images[i].length) {
            this.imnum = 0;
            if (this.images[i].length % 2 != 0) {
                this.krugfr = ~~!this.krugfr;
                this.krugbk = ~~!this.krugfr;
            }
        }

        this.krug = this.matrix(this.images[i].length);


        this.imgfr = this.krug[this.krugfr][this.imnum];
        this.imgbk = this.krug[this.krugbk][this.imnum];


        /*        console.log("this.krugfr " + this.krugfr);
         console.log("this.krugbk " + this.krugbk);*/


        fr.innerHTML = this.images[i][this.imgfr];
        bk.innerHTML = this.images[i][this.imgbk];
        fr.style.transform = 'rotateY(' + (-180 * (this.k + 1)) + 'deg)';
        bk.style.transform = 'rotateY(' + (-180 * this.k) + 'deg)';

        //console.log("k " + this.k + "   imnum " + this.imnum + "   imgfr " + this.imgfr + "   imgbk " + this.imgbk);
    }
};


//export default flipping;
if (typeof module === 'object') {
    module.exports.flipping = flipping;
}
