var flipping = {

    imgfr: null,
    imgbk: null,

    slides: null,
    images: [],


    flipping_cards: null,
    cards: null,

    paused: false,

    options: {
        auto: true,
        time: 1500,
        shadow: true,
        sequential: 0,
        start: 0
    },

    imnum: 0,
    krug: [],
    krugfr: 0,
    krugbk: 1,

    direction: 0,
    directionprev: 0,
    timer: 0,
    timeout: null,

    elem: null,

    init: function (elem, opt) {
        var self = this;
        self.elem = elem;
        self.slides = document.getElementById(elem).getElementsByClassName('slides')[0].innerHTML;

        self.prepare(elem);
        self.configure(opt);

    },

    prepare: function () {
        var self = this;

        self.paused = false;
        self.k = 0;
        self.krug = [];
        /*        self.krugfr = 0;
         self.krugbk = 1;*/
        self.imgfr = null;
        self.imgbk = null;


        //self.imnum = 0;

        self.timer = null;


        self.flipping_cards = document.getElementById(self.elem);
        self.flipping_cards.style.display = 'flex';

        self.flipping_cards.getElementsByClassName('slides')[0].innerHTML = self.slides;

        self.deck = self.flipping_cards.getElementsByClassName('deck');

        var divs = null;
        // get content
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
            console.log("init imnum = " + self.imnum);

            var fr = self.deck[i].getElementsByClassName('front')[0];
            var bk = self.deck[i].getElementsByClassName('back')[0];

            fr.innerHTML = self.images[i][self.imnum];

            fr.style.transform = "none";
            bk.style.transform = "none";

            //console.log("fr.style.transform " + fr.style.transform);

            if (self.direction == 1) {
                bk.style.display = 'block';
                bk.style.transform = 'rotateY(180deg)';
            }
            if (self.direction == -1) {
                bk.style.display = 'block';
                bk.style.transform = 'rotateY(-180deg)';
            }

            if (self.imnum % 2 != 0) {
                self.krugfr = ~~!self.krugfr;
                self.krugbk = ~~!self.krugfr;
            }
        }

        // on deactivate window
        window.onblur = function () {
            self.paused = true;
        };
        window.onfocus = function () {
            self.paused = false;
        };

        // add suspend actions if automatic flipping is enabled
        if (self.options.auto == true) {
            self.flipping_cards.onmouseover = function () {
                self.paused = true;
            };

            self.flipping_cards.onmouseout = function () {
                self.paused = false;
            }
        }


        //-------------------------------------------------------------------------------------------
        // button backward
        var buttons = self.flipping_cards.querySelectorAll('button');

        buttons[0].onclick = function () {

            self.directionprev = self.direction;

            if (self.directionprev == 1 || self.directionprev == 0) {
                self.direction = -1;
                self.prepare();
            }
            self.backward();
        };

        //forward
        buttons[1].onclick = function () {
            self.directionprev = self.direction;

            if (self.directionprev == -1 || self.directionprev == 0) {
                self.direction = 1;
                self.prepare();

            }
            self.forward();
        };

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


            if (self.timeout) clearTimeout(self.timeout);
            self.timeout = setTimeout(function go() {

                if (self.options.auto && self.paused === false) {

                    self.flipping_cards.querySelectorAll('button')[1].click();

                }
                self.timeout = setTimeout(go, self.options.time);

            }, self.options.time);


        }
    },

    // ------------------------------------------------------------------------------------------
    configure: function (opt) {
        /* options */
        var self = this;
        if (opt.auto === false) {
            self.options.auto = false;
            self.flipping_cards.querySelectorAll('button')[1].style.visibility="visible";
        }

        if (opt.auto === true) {
            self.options.auto = true;
            self.flipping_cards.querySelectorAll('button')[1].style.visibility="hidden";
        }

        if (opt.time != null) self.options.time = opt.time;

        if (opt.shadow == false) self.options.shadow = false;
        if (opt.shadow == true) self.options.shadow = true;

        if (opt.sequent != null) self.options.sequent = opt.sequent;

        if (opt.start != null) self.options.start = opt.start;


    },

    //-------------------------------------------------------------------------------------------
    matrix: function (direction, len) {

        var m = 0;
        var n = 0;

        var mas1 = [];
        var mas2 = [];

        var j;

        for (j = 1; j < len; j++) {
            if (j % 2 === 0) {
                mas1[m++] = j;
                mas1[m++] = j;
            } else {
                mas2[n++] = j;
                mas2[n++] = j;
            }
        }

        if (len % 2 != 0) {
            mas1.unshift(0);
            mas2.push(0);
        }

        if (len % 2 == 0) {
            mas1.unshift(0);
            mas1.push(0);
        }
        if (direction == "backward") {
            return [mas2.reverse(), mas1.reverse()];//.reverse()
        }
        if (direction == "forward") {
            return [mas1, mas2];
        }

    },


    backward: function () {
        var self = this;
        var buttons = null;
        var i = 0;

        buttons = self.flipping_cards.querySelectorAll('button');
        buttons[0].disabled = true;//console.log("start " + buttons[1].disabled);

        self.timer = setInterval(function () {
            self.backwardflip(i);
            i++;

            if (i == self.deck.length) {
                clearInterval(self.timer);
                self.k++;
                self.imnum++;
                buttons = self.flipping_cards.querySelectorAll('button');
                buttons[0].disabled = false;// console.log("end " + buttons[1].disabled);
            }
        }, self.options.sequent);
    },


    forward: function () {

        var self = this;
        var buttons = null;
        var i = 0;

        buttons = self.flipping_cards.querySelectorAll('button');
        buttons[1].disabled = true;//console.log("start " + buttons[1].disabled);


        self.timer = setInterval(function () {
            self.forwardflip(i);
            i++;

            if (i == self.deck.length) {
                clearInterval(self.timer);
                self.k++;
                self.imnum++;
                buttons = self.flipping_cards.querySelectorAll('button');
                buttons[1].disabled = false;// console.log("end " + buttons[1].disabled);
            }
        }, self.options.sequent);

    },


    backwardflip: function (i) {

        var fr = this.deck[i].getElementsByClassName('front')[0];
        var bk = this.deck[i].getElementsByClassName('back')[0];


        if (this.imnum >= this.images[i].length) {
            this.imnum = 0;
            if (this.images[i].length % 2 != 0) {
                this.krugfr = ~~!this.krugfr;
                this.krugbk = ~~!this.krugfr;
            }
        }

        /*        this.krug[0] = [0, 3, 3, 1, 1];
         this.krug[1] = [4, 4, 2, 2, 0];*/

        this.krug = this.matrix("backward", this.images[i].length);


        console.log(this.krug);
        /*       this.krug[0] = [1, 1, 3, 3, 0];
         this.krug[1] = [0, 2, 2, 4, 4];
         */
        /*
         this.krug[0] = [0, 2, 2, 4, 4];
         this.krug[1] = [1, 1, 3, 3, 0];*/


        this.imgfr = this.krug[this.krugfr][this.imnum];
        this.imgbk = this.krug[this.krugbk][this.imnum];


        fr.innerHTML = this.images[i][this.imgfr];
        bk.innerHTML = this.images[i][this.imgbk];
        fr.style.transform = 'rotateY(' + (180 * (this.k + 1)) + 'deg)';
        bk.style.transform = 'rotateY(' + (180 * this.k ) + 'deg)';


        console.log("k " + this.k + "   imnum " + this.imnum + "   imgfr " + this.imgfr + "   imgbk " + this.imgbk + "  fr.style.transform " + fr.style.transform + "  bk.style.transform " + bk.style.transform);

        this.imnum++;
        console.log("imnum  " + this.imnum);
    },


    forwardflip: function (i) {
        var self = this;

        var fr = this.deck[i].getElementsByClassName('front')[0];
        var bk = this.deck[i].getElementsByClassName('back')[0];


        if (this.imnum >= this.images[i].length) {
            this.imnum = 0;
            if (this.images[i].length % 2 != 0) {
                this.krugfr = ~~!this.krugfr;
                this.krugbk = ~~!this.krugfr;
            }
        }

        this.krug = this.matrix("forward", this.images[i].length);

        console.log(this.krug);

        this.imgfr = this.krug[this.krugfr][this.imnum];
        this.imgbk = this.krug[this.krugbk][this.imnum];


        fr.innerHTML = this.images[i][this.imgfr];
        bk.innerHTML = this.images[i][this.imgbk];
        fr.style.transform = 'rotateY(' + (-180 * (this.k + 1)) + 'deg)';
        bk.style.transform = 'rotateY(' + (-180 * this.k) + 'deg)';


        console.log("k " + this.k + "   imnum " + this.imnum + "   imgfr " + this.imgfr + "   imgbk " + this.imgbk + "  fr.style.transform " + fr.style.transform + "  bk.style.transform " + bk.style.transform);


        console.log("imnum  " + this.imnum);

        //    console.log("end forwardflip(" + i + ")");
    }
};


//export default flipping;
if (typeof module === 'object') {
    module.exports.flipping = flipping;
}
