var flipping = {

    flipping_cards: null,
    slides: null,
    decks: null,
    buttons: null,
    browser: null,

    last_dir: [],
    card_html: null,

    content: [],
    content_index: [],

    timeout: 0,
    paused: false,

    options: {
        "autoflip-mode": true,
        "autoflip-delay": 1500,

        "shadow": true,

        "rotation-mode": "simultaneous",
        "sequential-delay": 0,

        "card-width": 200,
        "card-height": 200,

        "cards-per-row": 0,
        "number-of-rows": 0
    },


    init: function (elem, opt) {
        var self = this;

        self.browser = getBrowser().browser;
        var i = 0;

        self.flipping_cards = document.getElementById(elem);
        self.slides = flipping_cards.getElementsByClassName('slides')[0];
        self.flipping_cards.style.visibility = 'visible';
        self.buttons = self.flipping_cards.getElementsByTagName('button');
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

            self.decks[i].innerHTML = self.card_html;

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

            back.classList.add("back1");
            /*
             if (self.browser == 'safari') {

             back.style.webkitTransform = 'rotateY(' + (180) + 'deg)';

             }
             else {
             back.style.transform = 'rotateY(' + (180) + 'deg)';
             }*/
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

        /*
         self.flipping_cards.onmouseover = function () {
         self.autoflip(false);
         //self.paused = true;
         };
         self.flipping_cards.onmouseout = function () {
         //self.paused = false;
         self.autoflip(true);
         };
         */


        /* shadow */

        if (self.options["shadow"] === false) {
            [].forEach.call(self.flipping_cards.getElementsByTagName('button'), function (el) {
                el.style.textShadow = "none";
            });
            self.flipping_cards.querySelectorAll('.front, .back').forEach(function (el) {
                el.style.boxShadow = "none";
            });
        }

        self.buttons[0].addEventListener('touchend', function (event) {
            self.sequential(-1);
        }, false);
        self.buttons[1].addEventListener('touchend', function (event) {
            self.sequential(1);
        }, false);

        self.buttons[0].onclick = function () {
            self.sequential(-1);
        };
        self.buttons[1].onclick = function () {
            self.sequential(1);
        };


    },


    //-------------------------------------------------------------------------------------------
    clickOnDeck: function (el, event) {
        var self = this;

        var x = 0;
        var y = 0;

        var event = event || window.event;

        if (typeof event == "undefined") return;

        if (document.attachEvent != null) { // Internet Explorer & Opera
            x = window.event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
            y = window.event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
        } else if (!document.attachEvent && document.addEventListener) { // Gecko
            x = event.clientX + window.scrollX;
            y = event.clientY + window.scrollY;
        }

        x = x - el.offsetLeft;
        y = y - el.offsetTop;

        if (x < self.options["card-width"] / 2) self.buttons[0].click();
        if (x >= self.options["card-width"] / 2) self.buttons[1].click();
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
        }, self.options["sequential-delay"] * self.decks.length);


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
        if (state && self.options["autoflip-mode"]) {
            self.timeout = setInterval(function go() {
                self.buttons[1].click();
            }, self.options["autoflip-delay"]);
        } else {
            clearInterval(self.timeout);
        }
    },

    //-------------------------------------------------------------------------------------------
    flip: function (num, dir) {
        var self = this;

        var i_front = self.content_index[num];
        var i_back = self.next(self.content_index[num], self.content[num].length, dir);

        var deck = self.decks[num];
        var front = deck.getElementsByTagName('div')[0];
        var back = deck.getElementsByTagName('div')[1];

        front.innerHTML = self.content[num][i_front];
        back.innerHTML = self.content[num][i_back];

        front.style.transitionDuration = self.options["transition-duration"] ;
        back.style.transitionDuration = self.options["transition-duration"] ;

        if (self.browser == 'safari') {
            front.style.webkitTransform = 'rotateY(' + (-1 * dir * 180) + 'deg)';
            back.style.webkitTransform = 'rotateY(' + 0 + 'deg)';
        } else {
            front.style.transform = 'rotateY(' + (-1 * dir * 180) + 'deg)';
            back.style.transform = 'rotateY(' + 0 + 'deg)';
        }

        back.addEventListener(self.browser == 'safari' ? 'webkitTransitionEnd' : 'transitionend', function (event) {

            if (event.propertyName == 'transform' || event.propertyName == "-webkit-transform") {

                var deck = self.decks[num];

// especially for safari
                self.card_html = "<div style='width: " + self.options["card-width"] + "px; height: " + self.options["card-height"] + "px' class='front' style='transition-duration:  " + self.options["transition-duration"] + "'></div><div  style='width: " + self.options["card-width"] + "px; height: " + self.options["card-height"] + "px' class='back back" + dir + "' style='transition-duration:  " + self.options["transition-duration"] + "'></div>";

                deck.innerHTML = self.card_html;

                var front = deck.getElementsByTagName('div')[0];
                var back = deck.getElementsByTagName('div')[1];
                front.innerHTML = self.content[num][i_back];

                //back.classList.add("back"+dir);

                /*               if (self.browser == 'safari') {
                 back.style.webkitTransform = 'rotateY(' + (1 * dir * 180) + 'deg)';
                 }
                 else {
                 back.style.transform = 'rotateY(' + (1 * dir * 180) + 'deg)';
                 }
                 */
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

        console.log("configure");

        if (opt["autoflip-mode"] == false) {
            self.options["autoflip-mode"] = false;
            self.buttons[0].style.visibility = "visible";
            self.buttons[1].style.visibility = "visible";
            self.autoflip(false);
        }

        if (opt["autoflip-mode"] == true) {
            self.options["autoflip-mode"] = true;
            self.buttons[0].style.visibility = "hidden";
            self.buttons[1].style.visibility = "hidden";
            self.autoflip(true);
        }

        // delay for next flip in auto mode
        if (opt["autoflip-delay"] != 0) self.options["autoflip-delay"] = opt["autoflip-delay"];

        if (opt["shadow"] == false) self.options["shadow"] = false;
        if (opt["shadow"] == true) self.options["shadow"] = true;

        // transition for transition
        if (opt["transition-duration"] > 0) {
            self.options["transition-duration"] = opt["transition-duration"] / 1000 + "s";
            console.log(self.options["transition-duration"] );
        }

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
        self.slides.style.width = ( self.options["card-width"] + 30) * self.options["cards-per-row"] + "px";

        // clear previous clear="right"
        [].forEach.call(self.flipping_cards.querySelectorAll('.deck'), function (el) {
            el.style.clear = "none";
        });

        var child = self.flipping_cards.querySelectorAll('div.deck:nth-child(' + ( 1 + self.options["cards-per-row"] ) + 'n)');
        for (var i = 0; i < child.length; i++) {
            child[i].style.clear = "right";
        }


        /*        // sizes of cards content
         for (i = 0; i < self.decks.length; i++) {
         var el = self.decks[i].getElementsByTagName("div");
         for (var j = 0; j < 2; j++) {
         el[j].style.width = self.options["card-width"] + "px";
         el[j].style.height = self.options["card-height"] + "px";
         }
         }*/

        [].forEach.call(self.flipping_cards.querySelectorAll('.deck *'), function (el) {
            el.style.width = self.options["card-width"] + "px";
            el.style.height = self.options["card-height"] + "px";

        });


        self.card_html = "<div style='width: " + self.options["card-width"] + "px; height: " + self.options["card-height"] + "px' class='front' style='transition-duration:  " + self.options["transition-duration"] + "'></div><div  style='width: " + self.options["card-width"] + "px; height: " + self.options["card-height"] + "px' class='back' style='transition-duration:  " + self.options["transition-duration"] + "'></div>";

    }


};


//export default flipping;
if (typeof module === 'object') {
    module.exports.flipping = flipping;
}


function getBrowser() {
    var ua = navigator.userAgent;

    var bName = function () {
        if (ua.search(/Edge/) > -1) return "edge";
        if (ua.search(/MSIE/) > -1) return "ie";
        if (ua.search(/Trident/) > -1) return "ie11";
        if (ua.search(/Firefox/) > -1) return "firefox";
        if (ua.search(/Opera/) > -1) return "opera";
        if (ua.search(/OPR/) > -1) return "operaWebkit";
        if (ua.search(/YaBrowser/) > -1) return "yabrowser";
        if (ua.search(/Chrome/) > -1) return "chrome";
        if (ua.search(/Safari/) > -1) return "safari";
        if (ua.search(/Maxthon/) > -1) return "maxthon";
    }();

    var version;
    switch (bName) {
        case "edge":
            version = (ua.split("Edge")[1]).split("/")[1];
            break;
        case "ie":
            version = (ua.split("MSIE ")[1]).split(";")[0];
            break;
        case "ie11":
            bName = "ie";
            version = (ua.split("; rv:")[1]).split(")")[0];
            break;
        case "firefox":
            version = ua.split("Firefox/")[1];
            break;
        case "opera":
            version = ua.split("Version/")[1];
            break;
        case "operaWebkit":
            bName = "opera";
            version = ua.split("OPR/")[1];
            break;
        case "yabrowser":
            version = (ua.split("YaBrowser/")[1]).split(" ")[0];
            break;
        case "chrome":
            version = (ua.split("Chrome/")[1]).split(" ")[0];
            break;
        case "safari":
            version = (ua.split("Version/")[1]).split(" ")[0];
            break;
        case "maxthon":
            version = ua.split("Maxthon/")[1];
            break;
    }

    var platform = 'desktop';
    if (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase())) platform = 'mobile';

    var browsrObj;

    try {
        browsrObj = {
            platform: platform,
            browser: bName,
            versionFull: version,
            versionShort: version.split(".")[0]
        };
    } catch (err) {
        browsrObj = {
            platform: platform,
            browser: 'unknown',
            versionFull: 'unknown',
            versionShort: 'unknown'
        };
    }

    return browsrObj;
}

