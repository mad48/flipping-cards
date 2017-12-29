var flipping = {

    flipping_cards: null,
    box: null,
    decks: null,
    buttons: null,
    browser: null,

    direction: 1,
    last_dir: [],
    card_html: null,

    content: [],
    content_index: [],

    current_card_number: 0,

    timeout: 0,
    paused: false,

    options: {
        "autoflip-mode": false,
        "autoflip-delay": 1500,

        "shadow": true,
        "transition-duration": 700,
        "mouseover-pause": true,

        "rotation-mode": "simultaneous",
        "sequential-delay": 600,

        "card-width": 200,
        "card-height": 200,

        "spacing-vertical": 15,
        "spacing-horizontal": 15,

        "cards-per-row": 0,
        "number-of-rows": 0,

        "starter-set": 0
    },


    init: function (elem, opt) {
        var self = this;
        self.browser = self.getBrowser();

        var i = 0;

        self.flipping_cards = document.getElementById(elem);
        self.box = flipping_cards.getElementsByClassName('card-box')[0];
        self.flipping_cards.style.visibility = 'visible';
        self.buttons = self.flipping_cards.getElementsByTagName('button');
        self.decks = self.flipping_cards.getElementsByClassName('card-stack');


        //get content
        var divs = null;
        for (i = 0; i < self.decks.length; i++) {
            self.content[i] = [];
            self.content_index[i] = self.options["starter-set"];
            self.last_dir[i] = 1;

            divs = self.decks[i].children;

            for (var j = 0; j < divs.length; j++) {
                self.content[i][j] = divs[j].innerHTML;
            }
        }

        self.configure(opt);

        //put content
        for (i = 0; i < self.decks.length; i++) {
            self.decks[i].innerHTML = self.card_html;
        }


        // prepare cards
        for (i = 0; i < self.decks.length; i++) {
            var front = self.decks[i].getElementsByClassName('front')[0];
            var back = self.decks[i].getElementsByClassName('back')[0];
            front.innerHTML = self.content[i][self.options["starter-set"]];
            back.innerHTML = self.content[i][self.next(self.options["starter-set"], self.content[i].length, 1)];
            self.content_index[i] = self.options["starter-set"];
            back.classList.add("back1");
        }


        /*        self.buttons[0].addEventListener('touchend', function (event) {
         self.sequential(-1);
         }, false);
         self.buttons[1].addEventListener('touchend', function (event) {
         self.sequential(1);
         }, false);*/


        self.buttons[0].onclick = function () {

            if (self.direction != -1) {

                var backs = self.flipping_cards.getElementsByClassName('back');
                for (i = 0; i < backs.length; i++) {
                    backs[i].style.display = "none";
                    backs[i].classList.remove('back1');
                    backs[i].classList.add("back-1");
                }
                setTimeout(function () {
                    for (i = 0; i < backs.length; i++) {
                        backs[i].style.display = "block";
                    }
                    self.sequential(-1);

                }, 100);
            }
            else self.sequential(-1);
        };


        self.buttons[1].onclick = function () {

            if (self.direction != 1) {

                var backs = self.flipping_cards.getElementsByClassName('back');
                for (i = 0; i < backs.length; i++) {
                    backs[i].style.display = "none";
                    backs[i].classList.remove('back-1');
                    backs[i].classList.add("back1");
                }
                setTimeout(function () {
                    for (i = 0; i < backs.length; i++) {
                        backs[i].style.display = "block";
                    }
                    self.sequential(1);

                }, 100);

            }
            else self.sequential(1);
        };

    },


//----------------------------------------------------------------------------------------------
    buttonsoff: function (state) {
        var self = this;
        self.buttons[0].disabled = state;
        self.buttons[1].disabled = state;
    },

//----------------------------------------------------------------------------------------------
    sequential: function (dir) {
        var self = this;
        var i = 0;

        self.buttonsoff(true);
        var paus_ = self.options["rotation-mode"] == "sequential" ? self.options["sequential-delay"] * self.decks.length : self.options["transition-duration"];
        setTimeout(function () {
            self.buttonsoff(false);
        }, paus_);


        for (i = 0; i < self.decks.length; i++) {
            (function (index) {
                setTimeout(function () {
                    self.flip(index, dir);
                }, self.options["sequential-delay"] * index);
            })(i);
        }

    },


//----------------------------------------------------------------------------------------------
    autoflip: function (state) {
        var self = this;

        if (state) {// && self.options["autoflip-mode"]
            self.timeout = setInterval(function go() {
                self.buttons[1].click();
            }, self.options["autoflip-delay"]);
        } else {
            clearInterval(self.timeout);
        }
    },

//----------------------------------------------------------------------------------------------
    flip: function (num, dir) {
        var self = this;

        var i_front = self.content_index[num];
        var i_back = self.next(self.content_index[num], self.content[num].length, dir);

        self.current_card_number = i_back;

        var deck = self.decks[num];

        var front = deck.getElementsByClassName('front')[0];
        var back = deck.getElementsByClassName('back')[0];


        // front.innerHTML = self.content[num][i_front];
        back.innerHTML = self.content[num][i_back];

        front.style.transitionDuration = self.options["transition-duration"] + "ms";
        back.style.transitionDuration = self.options["transition-duration"] + "ms";

        if (self.browser == "safari") {
            front.style.webkitTransform = 'rotateY(' + (-1 * dir * 180) + 'deg)';
            back.style.webkitTransform = 'rotateY(' + 0 + 'deg)';
        } else {
            front.style.transform = 'rotateY(' + (-1 * dir * 180) + 'deg)';
            back.style.transform = 'rotateY(' + 0 + 'deg)';
        }

        back.addEventListener(self.browser == "safari" ? 'webkitTransitionEnd' : 'transitionend', function (event) {

            if (event.propertyName == 'transform' || event.propertyName == "-webkit-transform") {

                var deck = self.decks[num];

                // especially for safari
                self.card_html = "<div style='width: " + self.options["card-width"] + "px; height: " + self.options["card-height"] + "px' class='front " + (self.options['shadow'] == true ? 'shadowon' : 'shadowoff') + "' style='transition-duration:  " + self.options["transition-duration"] + "ms'></div><div  style='width: " + self.options["card-width"] + "px; height: " + self.options["card-height"] + "px' class='back back" + dir + " " + (self.options['shadow'] == true ? 'shadowon' : 'shadowoff') + "' style='transition-duration:  " + self.options["transition-duration"] + "ms'></div>";

                deck.innerHTML = self.card_html;

                var front = deck.getElementsByClassName('front')[0];
                //var back = deck.getElementsByTagName('div')[1];
                front.innerHTML = self.content[num][i_back];

            }

            self.content_index[num] = i_back;
            self.last_dir[num] = dir;
            self.direction = dir;
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

    getBrowser: function () {
        if (navigator.userAgent.search(/Safari/) > -1) return "safari";
        else return "";
    },
// ---------------------------------------------------------------------------------------------
    configure: function (opt) {
        /* options */
        var self = this;

        // disable drags
        self.flipping_cards.ondragstart = function () {
            return false
        };

        //console.log("configure");

        if (opt["autoflip-mode"] == false) {
            self.options["autoflip-mode"] = false;
            self.buttons[0].style.visibility = "visible";
            self.buttons[1].style.visibility = "visible";
            self.autoflip(false);
        }

        if (opt["autoflip-mode"] == true) {
            if (self.options["autoflip-mode"] == false) self.autoflip(true);
            self.options["autoflip-mode"] = true;
            self.buttons[0].style.visibility = "hidden";
            self.buttons[1].style.visibility = "hidden";

        }

        // delay for next flip in auto mode
        if (self.options["autoflip-delay"] != opt["autoflip-delay"] && self.options["autoflip-mode"]) {
            self.autoflip(false);
            self.options["autoflip-delay"] = parseInt(opt["autoflip-delay"]);
            self.autoflip(true);
        }

        if (opt["shadow"] == false) {
            self.options["shadow"] = false;
            self.buttons[0].classList.remove("shadowon");
            self.buttons[0].classList.add("shadowoff");
            self.buttons[1].classList.remove("shadowon");
            self.buttons[1].classList.add("shadowoff");
        }

        if (opt["shadow"] == true) {
            self.options["shadow"] = true;
            self.buttons[0].classList.remove("shadowoff");
            self.buttons[0].classList.add("shadowon");
            self.buttons[1].classList.remove("shadowoff");
            self.buttons[1].classList.add("shadowon");
        }

        // starter-set
        if (opt["starter-set"] > 0) {
            if (opt["starter-set"] > self.content[0].length) opt["starter-set"] = self.content[0].length;
            self.options["starter-set"] = opt["starter-set"] - 1;
        }


        // transition for transition
        if (opt["transition-duration"] > 0) {
            self.options["transition-duration"] = opt["transition-duration"];
        }


        if (opt["mouseover-pause"] == false || opt["mouseover-pause"] == true) {
            self.options["mouseover-pause"] = opt["mouseover-pause"];
        }

        // add suspend actions if automatic flipping is enabled
        if (self.options["mouseover-pause"] == true || self.options["mouseover-pause"] == false) {

            self.flipping_cards.onmouseover = function () {
                if (self.options["autoflip-mode"] == true && self.options["mouseover-pause"] == true) {
                    self.autoflip(false);
                }
            };

            self.flipping_cards.onmouseout = function () {
                if (self.options["autoflip-mode"] == true && self.options["mouseover-pause"] == true) {
                    self.autoflip(true);
                }
            };

        }


        // on deactivate window
        window.onblur = function () {
            if (self.options["autoflip-mode"]) self.autoflip(false);
        };
        window.onfocus = function () {
            if (self.options["autoflip-mode"]) self.autoflip(true);
        };


        // card size
        if (opt["card-width"] > 0) self.options["card-width"] = parseInt(opt["card-width"]);
        if (opt["card-height"] > 0) self.options["card-height"] = parseInt(opt["card-height"]);

        // card spacing
        if (opt["spacing-vertical"] > 0) self.options["spacing-vertical"] = parseInt(opt["spacing-vertical"]);
        if (opt["spacing-horizontal"] > 0) self.options["spacing-horizontal"] = parseInt(opt["spacing-horizontal"]);

        // sequential-delay
        if (opt["sequential-delay"] > 0) self.options["sequential-delay"] = opt["sequential-delay"];

        // rotation-mode
        if (opt["rotation-mode"] == "simultaneous" || opt["rotation-mode"] == "sequential") {
            if (opt["rotation-mode"] == "simultaneous") {
                self.options["rotation-mode"] = "simultaneous";
                self.options["sequential-delay"] = 0;
            }
            else {
                self.options["rotation-mode"] = "sequential";
            }
        }


        // cards-per-row or number-of-rows calculation
        if (opt["cards-per-row"] > 0) {
            if (opt["cards-per-row"] > self.decks.length) opt["cards-per-row"] = self.decks.length;
            self.options["cards-per-row"] = opt["cards-per-row"];
            self.options["number-of-rows"] = Math.round(self.decks.length / self.options["cards-per-row"]);
        }

        if (opt["number-of-rows"] > 0) {
            if (opt["number-of-rows"] > self.decks.length) opt["number-of-rows"] = self.decks.length;
            self.options["number-of-rows"] = opt["number-of-rows"];
            self.options["cards-per-row"] = Math.round(self.decks.length / self.options["number-of-rows"]);
        }

        // width of cards container
        self.box.style.width = self.options["card-width"] * self.options["cards-per-row"] + 2 * self.options["spacing-horizontal"] * self.options["cards-per-row"] + "px";


        // clearing
        [].forEach.call(self.flipping_cards.querySelectorAll('.card-stack'), function (el) {
            el.style.clear = "none";
        });


        // line breaks
        var child = self.flipping_cards.querySelectorAll('div.card-stack');

        for (var i = 0; i < child.length; i++) {
            if (i % self.options["cards-per-row"] == 0) {
                if (i == 1 && self.decks.length % self.options["number-of-rows"] == 1) {
                    child[i].style.clear = "none";
                }
                else child[i].style.clear = "left";
            }
        }
        if (self.decks.length / self.options["number-of-rows"] > 1 && self.options["number-of-rows"] != 1 && self.decks.length % self.options["number-of-rows"] != 0 && self.decks.length % self.options["number-of-rows"] != 1 && opt["number-of-rows"] > 0) {
            child[child.length - 1].style.clear = "left";
        }

        /* //old line breaks
         var child = self.flipping_cards.querySelectorAll('div.card-stack:nth-child(' + ( 1 + self.options["cards-per-row"] ) + 'n)');
         for (var i = 0; i < child.length; i++) {
         child[i].style.clear = "right";
         }
         */

        // vertical and horizontal spacings
        [].forEach.call(self.flipping_cards.querySelectorAll('.card-stack'), function (el) {
            el.style.marginLeft = self.options["spacing-horizontal"] + "px";
            el.style.marginRight = self.options["spacing-horizontal"] + "px";
            el.style.marginTop = self.options["spacing-vertical"] + "px";
            el.style.marginBottom = self.options["spacing-vertical"] + "px";
        });


        // sizes and shadows of cards content (after generation of .front, .back)
        for (i = 0; i < self.decks.length; i++) {
            var el = self.decks[i].children;
            for (var j = 0; j < 2; j++) {
                el[j].style.width = self.options["card-width"] + "px";
                el[j].style.height = self.options["card-height"] + "px";
                el[j].classList.remove('shadowon');
                el[j].classList.remove('shadowoff');
                el[j].classList.add(self.options['shadow'] ? 'shadowon' : 'shadowoff');
            }
        }

        self.card_html = "<div style='width: " + self.options["card-width"] + "px; height: " + self.options["card-height"] + "px' class='front  " + (self.options['shadow'] ? 'shadowon' : 'shadowoff') + "' style='transition-duration:  " + self.options["transition-duration"] + "ms'></div><div  style='width: " + self.options["card-width"] + "px; height: " + self.options["card-height"] + "px' class='back  " + (self.options['shadow'] ? 'shadowon' : 'shadowoff') + "' style='transition-duration:  " + self.options["transition-duration"] + "ms'></div>";

    }


};


//export default flipping;
if (typeof module === 'object') {
    module.exports = flipping;
}



