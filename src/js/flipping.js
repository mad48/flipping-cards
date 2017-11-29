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

            "cards-per-row": 0,
            "number-of-rows": 0
        },


        init: function (elem, opt) {
            var self = this;
            self.browser = self.getBrowser();

            var i = 0;

            self.flipping_cards = document.getElementById(elem);
            self.box = flipping_cards.getElementsByClassName('card-box')[0];
            self.flipping_cards.style.visibility = 'visible';
            self.buttons = self.flipping_cards.getElementsByTagName('button');
            self.decks = self.flipping_cards.getElementsByClassName('card-deck');


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
            }

            self.configure(opt);

            //put content
            for (i = 0; i < self.decks.length; i++) {

                self.decks[i].innerHTML = self.card_html;

                /*            self.decks[i].onclick = function (i) {
                 return function () {
                 self.clickOnDeck(self.decks[i]);
                 }
                 }(i);*/

            }


            // prepare cards
            for (i = 0; i < self.decks.length; i++) {
                var front = self.decks[i].getElementsByClassName('front')[0];
                var back = self.decks[i].getElementsByClassName('back')[0];
                front.innerHTML = self.content[i][0];
                back.innerHTML = self.content[i][1];
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


        //-------------------------------------------------------------------------------------------
        clickOnDeck: function (el, event) {
            var self = this;

            var x = 0;
            var y = 0;

            var ev = event || window.event;
            //alert(ev.target.tagName);
            if (typeof ev == "undefined") return;

            if (document.attachEvent != null) { // Internet Explorer & Opera
                x = window.event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
                y = window.event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
            } else if (!document.attachEvent && document.addEventListener) { // Gecko
                x = ev.clientX + window.scrollX;
                y = ev.clientY + window.scrollY;
            }

            x = x - el.offsetLeft;
            y = y - el.offsetTop;

            if (x < self.options["card-width"] / 2) self.buttons[0].click();
            if (x >= self.options["card-width"] / 2) self.buttons[1].click();
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

            var deck = self.decks[num];

            var front = deck.getElementsByClassName('front')[0];
            var back = deck.getElementsByClassName('back')[0];


            front.innerHTML = self.content[num][i_front];
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
                self.options["cards-per-row"] = opt["cards-per-row"];
                self.options["number-of-rows"] = Math.round(self.decks.length / self.options["cards-per-row"]);
            }

            if (opt["number-of-rows"] > 0) {
                self.options["number-of-rows"] = opt["number-of-rows"];
                self.options["cards-per-row"] = Math.round(self.decks.length / self.options["number-of-rows"]);
            }

            // width of cards container
            self.box.style.width = ( self.options["card-width"] + 30) * self.options["cards-per-row"] + "px";

            // clear previous clear="right"
            [].forEach.call(self.flipping_cards.querySelectorAll('.card-deck'), function (el) {
                el.style.clear = "none";
            });

            var child = self.flipping_cards.querySelectorAll('div.card-deck:nth-child(' + ( 1 + self.options["cards-per-row"] ) + 'n)');
            for (var i = 0; i < child.length; i++) {
                child[i].style.clear = "right";
            }


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


    }
    ;


//export default flipping;
if (typeof module === 'object') {
    module.exports.flipping = flipping;
}
