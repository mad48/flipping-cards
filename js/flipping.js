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
    h: 0,
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
            self.backward();
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

        /*        document.addEventListener('transitionend', function (event) {
         if (event.propertyName == 'transform') {
         console.log(event.type + " " + new Date().getTime() + " " + event.propertyName);
         }

         });*/

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
            return [mas1, mas2];//.reverse()
        }
        if (direction == "forward") {
            return [mas1, mas2];
        }

    },


    backward: function () {
        var self = this;
        var buttons = null;
        var i = 0;

        for (i = 0; i < 1; i++) {
            self.backwardflip(i);
        }
        self.k--;
        self.imnum++;
        self.page = self.page - 1;

        return;
        var f = function () {
            // if (self.paused === false)
            self.backwardflip(i);

            if (i == 0) {
                /*               buttons = self.flipping_cards.querySelectorAll('button');
                 buttons[0].onclick = function () {
                 };
                 buttons[1].onclick = function () {
                 };*/
            }

            i = i + 1;

            if (i == self.deck.length) {

                /* console.log("this.k " + self.k);*/
                self.k++;
                self.imnum++;
                self.page = self.page + 1;

                /*                buttons = self.flipping_cards.querySelectorAll('button');
                 buttons[0].onclick = function () {
                 // self.backward();
                 };
                 buttons[1].onclick = function () {
                 self.forward();
                 };*/

            }

            if (i < self.deck.length) setTimeout(f, self.options.sequent);

        };

        f();
    },


    forward: function () {

        var self = this;
        /*  self.forwardflip(0);

//        var fr = this.deck[i].getElementsByClassName('front')[0];
        self.deck[0].addEventListener('transitionend', function () {
            console.log("bk.addEventListener('transitionend' ");
            if (i == self.deck.length) {

                self.k++;
                self.imnum++;
                self.page = self.page + 1;
            }else
                self.forwardflip(++self.h);
        });

        return;*/
        /*        self.forwardflip(i);
         self.deck[0].getElementsByClassName('front')[0].addEventListener('transitionend', function() {
         self.forwardflip(i++);
         });
         return;*/
        buttons = self.flipping_cards.querySelectorAll('button');
        buttons[1].disabled = true;
        console.log("start " + buttons[1].disabled);

        var buttons = null;
        var i = 0;

        var timer;

        timer = setInterval(function () {
            self.forwardflip(i);
            i++;
            if (i == self.deck.length) {
                clearInterval(timer);
                self.k++;
                self.imnum++;
                self.page = self.page + 1;

                buttons = self.flipping_cards.querySelectorAll('button');
                buttons[1].disabled = false;
                console.log("end " + buttons[1].disabled);
            }
        }, 300);


        return;
        /*        for (i = 0; i < 1; i++) {
         self.forwardflip(i);
         }
         self.k++;
         self.imnum++;
         self.page = self.page + 1;

         return;*/
        var f = function () {
            // if (self.paused === false)
            self.forwardflip(i);

            if (i == 0) {
                /*               buttons = self.flipping_cards.querySelectorAll('button');
                 buttons[0].onclick = function () {
                 };
                 buttons[1].onclick = function () {
                 };*/
            }

            i = i + 1;

            if (i == self.deck.length) {

                /* console.log("this.k " + self.k);*/
                self.k++;
                self.imnum++;
                self.page = self.page + 1;

                /*                buttons = self.flipping_cards.querySelectorAll('button');
                 buttons[0].onclick = function () {
                 // self.backward();
                 };
                 buttons[1].onclick = function () {
                 self.forward();
                 };*/

            }

            if (i < self.deck.length) setTimeout(f, self.options.sequent);

        };

        f();
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

        //this.krug = this.matrix("backward", this.images[i].length);

        /*        function reverse(arr) {
         return arr.slice().reverse();
         }

         var array = [0, 1, 2];

         // alert(this.krug[0].reverse().join(','));
         */
        this.krug[1] = [4, 4, 2, 2, 0];
        this.krug[0] = [0, 3, 3, 1, 1];

        this.imgfr = this.krug[this.krugfr][this.imnum];
        this.imgbk = this.krug[this.krugbk][this.imnum];


        fr.innerHTML = this.images[i][this.imgfr];
        bk.innerHTML = this.images[i][this.imgbk];
        fr.style.transform = 'rotateY(' + (-180 * (this.k - 1)) + 'deg)';
        bk.style.transform = 'rotateY(' + (-180 * this.k  ) + 'deg)';

        //console.log("k " + this.k + "   imnum " + this.imnum + "   imgfr " + this.imgfr + "   imgbk " + this.imgbk);
    },

    forwardflip: function (i) {
        var self = this;
        var fr = this.deck[i].getElementsByClassName('front')[0];
        var bk = this.deck[i].getElementsByClassName('back')[0];
        /* var tt = 0;

               fr.addEventListener('transitionend', function () {
         console.log("fr.addEventListener('transitionend' ");
         tt++;
         });*/

        /*        bk.addEventListener('transitionend', function () {
         console.log("bk.addEventListener('transitionend' ");
         tt++;
         self.forwardflip(++self.h);
         });*/

        if (this.imnum >= this.images[i].length) {
            this.imnum = 0;
            if (this.images[i].length % 2 != 0) {
                this.krugfr = ~~!this.krugfr;
                this.krugbk = ~~!this.krugfr;
            }
        }

        this.krug = this.matrix("forward", this.images[i].length);


        this.imgfr = this.krug[this.krugfr][this.imnum];
        this.imgbk = this.krug[this.krugbk][this.imnum];


        fr.innerHTML = this.images[i][this.imgfr];
        bk.innerHTML = this.images[i][this.imgbk];
        fr.style.transform = 'rotateY(' + (-180 * (this.k + 1)) + 'deg)';
        bk.style.transform = 'rotateY(' + (-180 * this.k) + 'deg)';

        //console.log("k " + this.k + "   imnum " + this.imnum + "   imgfr " + this.imgfr + "   imgbk " + this.imgbk);


        console.log("end forwardflip(" + i + ")");
    }
};


//export default flipping;
if (typeof module === 'object') {
    module.exports.flipping = flipping;
}
