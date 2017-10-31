var flipping = {

    last_dir: 0,

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
        sequent: 0
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

            divs = self.decks[i].children;

            for (var j = 0; j < divs.length; j++) {
                self.content[i][j] = divs[j].innerHTML;
            }

            self.decks[i].innerHTML = '<div class="front"></div><div class="back"></div>';
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


        /* shadow */
        if (self.options.shadow === false) {
            [].forEach.call(self.flipping_cards.querySelectorAll('button'), function (el) {
                el.style.textShadow = "none";
            });
            self.flipping_cards.querySelectorAll('.front, .back').forEach(function (el) {
                el.style.boxShadow = "none";
            });
        }


        self.buttons[0].onclick = function () {
            self.sequential(-1);
        };
        self.buttons[1].onclick = function () {
            self.sequential(1);
        };
    },

    //-------------------------------------------------------------------------------------------
    sequential: function (dir) {
        var self = this;
        var i = 0;

        self.buttons[0].disabled = true;
        self.buttons[1].disabled = true;

        self.timer = setInterval(function () {
            self.flip(i, dir);
            i++;
            if (i == self.decks.length) {
                clearInterval(self.timer);
                self.buttons[0].disabled = false;
                self.buttons[1].disabled = false;
            }
        }, self.options.sequent);
    },

//----------------------------------------------------------------------------------------------
    autoflip: function () {
        var self = this;
        if (self.options.auto === true) {

            // if (self.timeout) clearTimeout(self.timeout);
            self.timeout = setTimeout(function go() {
                //console.log("self.options.auto " + self.options.auto);
                if (self.options.auto && self.paused === false) {

                    self.buttons[1].click();

                }
                self.timeout = setTimeout(go, self.options.time);

            }, self.options.time);
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

                //front.innerHTML = self.content[num][i_back];

                front.style.transform = "none";
                back.style.transform = 'rotateY(' + (1 * dir * 180) + 'deg)';
            }

        });

        self.content_index[num] = i_back;
        self.last_dir = dir;
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
        if (opt.auto === false) {
            self.options.auto = false;
            self.buttons[0].style.visibility = "visible";
            self.buttons[1].style.visibility = "visible";
            self.autoflip();
        }

        if (opt.auto === true) {
            self.options.auto = true;
            self.buttons[0].style.visibility = "hidden";
            self.buttons[1].style.visibility = "hidden";
            self.autoflip();
        }

        if (opt.time != null) self.options.time = opt.time;

        if (opt.shadow == false) self.options.shadow = false;
        if (opt.shadow == true) self.options.shadow = true;

        if (opt.sequent != null) self.options.sequent = opt.sequent;

        //if (opt.start != null) self.options.start = opt.start;
    }


};


//export default flipping;
if (typeof module === 'object') {
    module.exports.flipping = flipping;
}
