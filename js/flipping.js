var flipping = {

    last_dir: [],

    flipping_cards: null,
    buttons: null,
    decks: null,

    content: [],
    content_index: [],

    timeout: null,
    paused: false,

    options: {
        auto: true,
        time: 1500,
        shadow: true,
        sequent: 0,
        flow: "row",
        width: 250,
        height: 280
    },


    init: function (elem, opt) {
        var self = this;
        var i = 0;

        self.flipping_cards = document.getElementById(elem);
        self.flipping_cards.style.display = 'flex';
        self.buttons = self.flipping_cards.querySelectorAll('button');
        self.decks = self.flipping_cards.getElementsByClassName('deck');

        self.configure(opt);


        //get content
        var divs = null;
        for (i = 0; i < self.decks.length; i++) {

            self.content[i] = [];
            self.content_index[i] = 0;
            self.last_dir[i] = 1;

            divs = self.decks[i].children;

            for (var j = 0; j < divs.length; j++) {
                self.content[i][j] = divs[j].innerHTML;

            }

            self.decks[i].innerHTML = '<div class="front"></div><div class="back"></div>';

            self.decks[i].onclick = function (i) {
                return function () {
                    self.clickOnDeck(self.decks[i]);
                }
            }(i);
        }


        // prepare cards
        for (i = 0; i < self.decks.length; i++) {
            var front = self.decks[i].getElementsByClassName('front')[0];
            var back = self.decks[i].getElementsByClassName('back')[0];
            front.innerHTML = self.content[i][0];
            back.innerHTML = self.content[i][1];
            back.style.transform = 'rotateY(' + (180) + 'deg)';
        }


        // on deactivate window
        window.onblur = function () {
            self.autoflip(false);
            //self.paused = true;
        };
        window.onfocus = function () {
            self.autoflip(true);
            //self.paused = false;
        };

        // add suspend actions if automatic flipping is enabled

        self.flipping_cards.onmouseover = function () {
            self.autoflip(false);
            //self.paused = true;
        };
        self.flipping_cards.onmouseout = function () {
            //self.paused = false;
            self.autoflip(true);
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

        self.buttons[0].addEventListener('touchend', function (event) {
            self.sequential(-1);
        }, false);


        self.buttons[0].onclick = function () {
            self.sequential(-1);
        };
        self.buttons[1].onclick = function () {
            self.sequential(1);
        };


    },


    //-------------------------------------------------------------------------------------------
    clickOnDeck: function (el) {
        var self = this;

        var x = 0;
        var y = 0;

        var event = event || window.event;

        if (document.attachEvent != null) { // Internet Explorer & Opera
            x = window.event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
            y = window.event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
        } else if (!document.attachEvent && document.addEventListener) { // Gecko
            x = event.clientX + window.scrollX;
            y = event.clientY + window.scrollY;
        }

        x = x - el.offsetLeft;
        y = y - el.offsetTop;

        if (x < self.options.width / 2) self.buttons[0].click();
        if (x >= self.options.width / 2) self.buttons[1].click();
    },

    //-------------------------------------------------------------------------------------------
    sequential_old: function (dir) {
        var self = this;
        var i = 0;

        self.buttonsoff(true);

        self.timer = setInterval(function () {
            self.flip(i, dir);
            i++;
            if (i == self.decks.length) {
                clearInterval(self.timer);
                self.buttonsoff(false);
            }
        }, self.options.sequent);
    },

    //-------------------------------------------------------------------------------------------
    buttonsoff: function (state) {
        var self = this;
        self.buttons[0].disabled = state;
        self.buttons[1].disabled = state;
    },

    //-------------------------------------------------------------------------------------------
    sequential: function (dir) {
        var self = this;
        var i = 0;

        self.buttonsoff(true);

        setTimeout(function () {
            self.buttonsoff(false);
        }, self.options.sequent * self.decks.length);


        for (i = 0; i < self.decks.length; i++) {
            (function (index) {
                setTimeout(function () {
                    self.flip(index, dir);
                }, self.options.sequent * index);
            })(i);
        }

    },

//----------------------------------------------------------------------------------------------
    autoflip_old: function () {
        var self = this;
        if (self.options.auto === true) {
            self.timeout = setTimeout(function go() {
                if (self.options.auto && self.paused == false) {
                    self.buttons[1].click();
                    //self.sequential(1);
                    if (self.paused == false) clearTimeout(self.timeout);
                }
                self.timeout = setTimeout(go, self.options.time);
            }, self.options.time);
        }
    },

    //----------------------------------------------------------------------------------------------
    autoflip: function (state) {
        var self = this;
        if (state && self.options.auto) {
            self.timeout = setInterval(function go() {
                self.buttons[1].click();
            }, self.options.time);
        } else {
            clearInterval(self.timeout);
        }
    },

    //-------------------------------------------------------------------------------------------
    flip: function (num, dir) {
        var self = this;

        var i_front = self.content_index[num];
        var i_back = self.next(self.content_index[num], self.content[num].length, dir);

        //console.log("i_front " + i_front + " i_back" + i_back);

        var deck = self.decks[num];
        var front = deck.getElementsByTagName('div')[0];
        var back = deck.getElementsByTagName('div')[1];

        front.innerHTML = self.content[num][i_front];
        back.innerHTML = self.content[num][i_back];

        front.style.transform = 'rotateY(' + (-1 * dir * 180) + 'deg)';
        back.style.transform = 'rotateY(' + 0 + 'deg)';

        back.addEventListener('transitionend', function (event) {
            if (event.propertyName == 'transform') {

                var deck = self.decks[num];
                deck.innerHTML = "<div class='front'>" + self.content[num][i_back] + "</div><div class='back'></div>";

                var front = deck.getElementsByTagName('div')[0];
                var back = deck.getElementsByTagName('div')[1];

                back.style.transform = 'rotateY(' + (1 * dir * 180) + 'deg)';

            }
            self.content_index[num] = i_back;
            self.last_dir[num] = dir;
        });


    },

// ---------------------------------------------------------------------------------------------
    next: function (i, len, dir) {
        if (dir == 1) {
            if (i >= len - 1) return 0;
            return ++i;
        }
        if (dir == -1) {
            i = i - 1;
            if (i < 0) return len - 1;
            return i;
        }
    },

// ---------------------------------------------------------------------------------------------
    configure: function (opt) {
        /* options */
        var self = this;

        if (opt.auto == false) {
            self.options.auto = false;
            self.buttons[0].style.visibility = "visible";
            self.buttons[1].style.visibility = "visible";
            self.autoflip(false);
        }

        if (opt.auto === true) {
            self.options.auto = true;
            self.buttons[0].style.visibility = "hidden";
            self.buttons[1].style.visibility = "hidden";
            self.autoflip(true);
        }

        if (opt.time != null) self.options.time = opt.time;

        if (opt.shadow == false) self.options.shadow = false;
        if (opt.shadow == true) self.options.shadow = true;

        if (opt.sequent != null) self.options.sequent = opt.sequent;

        if (opt.flow == "row" || opt.flow == "column") {
            self.flipping_cards.style.flexFlow = opt.flow + ' wrap';
        }

    }


};


//export default flipping;
if (typeof module === 'object') {
    module.exports.flipping = flipping;
}
