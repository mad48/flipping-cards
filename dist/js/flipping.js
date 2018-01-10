var flipping = {

    flipping_cards: null,
    box: null,
    decks: null,
    buttons: null,
    browser: null,

    direction: 1,
    last_dir: [],
    card_html: null,
    cards_count: 0,

    content: [],
    content_index: [],

    current_card_number: 0,

    timeout: 0,
    paused: false,

    options: {
        "autoFlipMode": false,
        "autoFlipDelay": 1500,

        "displayShadow": true,
        "transitionDuration": 700,
        "pauseMouseOver": true,

        "rotationMode": "simultaneous",
        "sequentialDelay": 600,

        "cardWidth": 200,
        "cardHeight": 200,

        "spacingVertical": 15,
        "spacingHorizontal": 15,

        "cardsToShow": 3,
        "cardsPerRow": 0,

        "startFromIndex": 1
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

        self.cards = self.box.children;

        self.cards_count = self.box.children.length;

        //old get content
        /*
         var divs = null;
         for (i = 0; i < self.decks.length; i++) {
         self.content[i] = [];
         self.content_index[i] = self.options["startFromIndex"];
         self.last_dir[i] = 1;

         divs = self.decks[i].children;

         for (var j = 0; j < divs.length; j++) {
         self.content[i][j] = divs[j].innerHTML;
         }
         }
         */


        //new get content


        // startFromIndex
        if (opt["startFromIndex"] > 0) {
            if (opt["startFromIndex"] > self.box.children.length) opt["startFromIndex"] = self.box.children.length;
            self.options["startFromIndex"] = opt["startFromIndex"] - 1;
        }

        var content_before_sort = [];
        for (i = 0; i < self.box.children.length; i++) {
            content_before_sort[i] = self.box.children[i].outerHTML;
        }

        var start_part = content_before_sort.slice(0, self.options["startFromIndex"]);
        var end_part = content_before_sort.slice(self.options["startFromIndex"]);
        self.box.innerHTML = end_part.concat(start_part).join('');


        var divs = null;
        divs = self.box.children;

        if (opt["cardsToShow"] > 0) {
            if (opt["cardsToShow"] > self.box.children.length) opt["cardsToShow"] = self.box.children.length;
            self.options["cardsToShow"] = opt["cardsToShow"];
        }


        for (i = 0; i < self.options["cardsToShow"]; i++) {
            self.content[i] = [];
            self.content_index[i] = self.options["startFromIndex"];
            self.last_dir[i] = 1;

            for (var j = 0; j < Math.floor(self.box.children.length / self.options["cardsToShow"]); j++) {
                self.content[i][j] = divs[j * self.options["cardsToShow"] + i].innerHTML;
            }
        }


        self.box.innerHTML = "";
        for (i = 0; i < self.options["cardsToShow"]; i++) {
            self.box.innerHTML = self.box.innerHTML + '<div class="card-stack">' + self.content[i][0] + '</div>';
        }
        self.decks = self.flipping_cards.getElementsByClassName('card-stack');


        self.configure(opt);


        //put content
        for (i = 0; i < self.decks.length; i++) {
            self.decks[i].innerHTML = self.card_html;
        }


        // prepare cards
        for (i = 0; i < self.decks.length; i++) {
            var front = self.decks[i].getElementsByClassName('front')[0];
            var back = self.decks[i].getElementsByClassName('back')[0];
            //front.innerHTML = self.content[i][self.options["startFromIndex"]];
            //back.innerHTML = self.content[i][self.next(self.options["startFromIndex"], self.content[i].length, 1)];
            self.content_index[i] = 0;//self.options["startFromIndex"];

            front.innerHTML = self.content[i][0];
            back.innerHTML = self.content[i][1];

            back.classList.add("back1");
        }


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
        var paus_ = self.options["rotationMode"] == "sequential" ? self.options["sequentialDelay"] * self.decks.length : self.options["transitionDuration"];
        setTimeout(function () {
            self.buttonsoff(false);
        }, paus_);


        self.current_card_number = self.current_card_number + self.options["cardsToShow"] * dir;
        if (self.current_card_number < 0) self.current_card_number = self.cards_count - self.options["cardsToShow"];
        else if (self.current_card_number > self.cards_count - 1) self.current_card_number = 0;

        //console.log(self.current_card_number);

        for (i = 0; i < self.decks.length; i++) {
            (function (index) {
                setTimeout(function () {
                    self.flip(index, dir);
                }, self.options["sequentialDelay"] * index);
            })(i);
        }

    },


//----------------------------------------------------------------------------------------------
    autoflip: function (state) {
        var self = this;

        if (state) {// && self.options["autoFlipMode"]
            self.timeout = setInterval(function go() {
                self.buttons[1].click();
            }, self.options["autoFlipDelay"]);
        } else {
            clearInterval(self.timeout);
        }
    },

//----------------------------------------------------------------------------------------------
    flip: function (num, dir) {
        var self = this;

        var i_front = self.content_index[num];
        var i_back = self.next(self.content_index[num], self.content[num].length, dir);

        //self.current_card_number = i_back;

        var deck = self.decks[num];

        var front = deck.getElementsByClassName('front')[0];
        var back = deck.getElementsByClassName('back')[0];


        // front.innerHTML = self.content[num][i_front];
        back.innerHTML = self.content[num][i_back];

        front.style.transitionDuration = self.options["transitionDuration"] + "ms";
        back.style.transitionDuration = self.options["transitionDuration"] + "ms";

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
                self.card_html = "<div style='width: " + self.options["cardWidth"] + "px; height: " + self.options["cardHeight"] + "px' class='front " + (self.options['displayShadow'] == true ? 'shadowon' : 'shadowoff') + "' style='transitionDuration:  " + self.options["transitionDuration"] + "ms'></div><div  style='width: " + self.options["cardWidth"] + "px; height: " + self.options["cardHeight"] + "px' class='back back" + dir + " " + (self.options['displayShadow'] == true ? 'shadowon' : 'shadowoff') + "' style='transitionDuration:  " + self.options["transitionDuration"] + "ms'></div>";

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
            return false;
        };

        //console.log("configure");

        if (opt["autoFlipMode"] == false) {
            self.options["autoFlipMode"] = false;
            self.buttons[0].style.visibility = "visible";
            self.buttons[1].style.visibility = "visible";
            self.autoflip(false);
        }

        if (opt["autoFlipMode"] == true) {
            if (self.options["autoFlipMode"] == false) self.autoflip(true);
            self.options["autoFlipMode"] = true;
            self.buttons[0].style.visibility = "hidden";
            self.buttons[1].style.visibility = "hidden";

        }

        // delay for next flip in auto mode
        if (self.options["autoFlipDelay"] != opt["autoFlipDelay"] && self.options["autoFlipMode"]) {
            self.autoflip(false);
            self.options["autoFlipDelay"] = parseInt(opt["autoFlipDelay"]);
            self.autoflip(true);
        }

        if (opt["displayShadow"] == false) {
            self.options["displayShadow"] = false;
            self.buttons[0].classList.remove("shadowon");
            self.buttons[0].classList.add("shadowoff");
            self.buttons[1].classList.remove("shadowon");
            self.buttons[1].classList.add("shadowoff");
        }

        if (opt["displayShadow"] == true) {
            self.options["displayShadow"] = true;
            self.buttons[0].classList.remove("shadowoff");
            self.buttons[0].classList.add("shadowon");
            self.buttons[1].classList.remove("shadowoff");
            self.buttons[1].classList.add("shadowon");
        }

        // startFromIndex
        if (opt["startFromIndex"] > 0) {
            if (opt["startFromIndex"] > self.box.children.length) opt["startFromIndex"] = self.box.children.length;
            self.options["startFromIndex"] = opt["startFromIndex"] - 1;
        }


        // transition for transition
        if (opt["transitionDuration"] > 0) {
            self.options["transitionDuration"] = opt["transitionDuration"];
        }


        if (opt["pauseMouseOver"] == false || opt["pauseMouseOver"] == true) {
            self.options["pauseMouseOver"] = opt["pauseMouseOver"];
        }

        // add suspend actions if automatic flipping is enabled
        if (self.options["pauseMouseOver"] == true || self.options["pauseMouseOver"] == false) {

            self.flipping_cards.onmouseover = function () {
                if (self.options["autoFlipMode"] == true && self.options["pauseMouseOver"] == true) {
                    self.autoflip(false);
                }
            };

            self.flipping_cards.onmouseout = function () {
                if (self.options["autoFlipMode"] == true && self.options["pauseMouseOver"] == true) {
                    self.autoflip(true);
                }
            };

        }


        // on deactivate window
        window.onblur = function () {
            if (self.options["autoFlipMode"]) self.autoflip(false);
        };
        window.onfocus = function () {
            if (self.options["autoFlipMode"]) self.autoflip(true);
        };


        // card size
        if (opt["cardWidth"] > 0) self.options["cardWidth"] = parseInt(opt["cardWidth"]);
        if (opt["cardHeight"] > 0) self.options["cardHeight"] = parseInt(opt["cardHeight"]);

        // card spacing
        if (opt["spacingVertical"] > 0) self.options["spacingVertical"] = parseInt(opt["spacingVertical"]);
        if (opt["spacingHorizontal"] > 0) self.options["spacingHorizontal"] = parseInt(opt["spacingHorizontal"]);

        // sequentialDelay
        if (opt["sequentialDelay"] > 0) self.options["sequentialDelay"] = opt["sequentialDelay"];

        // rotationMode
        if (opt["rotationMode"] == "simultaneous" || opt["rotationMode"] == "sequential") {
            if (opt["rotationMode"] == "simultaneous") {
                self.options["rotationMode"] = "simultaneous";
                self.options["sequentialDelay"] = 0;
            }
            else {
                self.options["rotationMode"] = "sequential";
            }
        }


        // cardsPerRow or number-of-rows calculation
        if (opt["cardsPerRow"] > 0) {
            if (opt["cardsPerRow"] > self.decks.length) opt["cardsPerRow"] = self.decks.length;
            self.options["cardsPerRow"] = opt["cardsPerRow"];
            self.options["number-of-rows"] = Math.round(self.decks.length / self.options["cardsPerRow"]);
        }

        /*
         if (opt["number-of-rows"] > 0) {
         if (opt["number-of-rows"] > self.decks.length) opt["number-of-rows"] = self.decks.length;
         self.options["number-of-rows"] = opt["number-of-rows"];
         self.options["cardsPerRow"] = Math.round(self.decks.length / self.options["number-of-rows"]);
         }
         */

        // width of cards container
        self.box.style.width = self.options["cardWidth"] * self.options["cardsPerRow"] + 2 * self.options["spacingHorizontal"] * self.options["cardsPerRow"] + "px";


        // clearing
        [].forEach.call(self.flipping_cards.querySelectorAll('.card-stack'), function (el) {
            el.style.clear = "none";
        });


        // line breaks
        var child = self.flipping_cards.querySelectorAll('div.card-stack');

        for (var i = 0; i < child.length; i++) {
            if (i % self.options["cardsPerRow"] == 0) {
                /*                if (i == 1 && self.decks.length % self.options["number-of-rows"] == 1) {
                 child[i].style.clear = "none";
                 }
                 else*/
                child[i].style.clear = "left";
            }
        }
        /*        if (self.decks.length / self.options["number-of-rows"] > 1 && self.options["number-of-rows"] != 1 && self.decks.length % self.options["number-of-rows"] != 0 && self.decks.length % self.options["number-of-rows"] != 1 && opt["number-of-rows"] > 0) {
         child[child.length - 1].style.clear = "left";
         }*/

        /* //old line breaks
         var child = self.flipping_cards.querySelectorAll('div.card-stack:nth-child(' + ( 1 + self.options["cardsPerRow"] ) + 'n)');
         for (var i = 0; i < child.length; i++) {
         child[i].style.clear = "right";
         }
         */

        // vertical and horizontal spacings
        [].forEach.call(self.flipping_cards.querySelectorAll('.card-stack'), function (el) {
            el.style.marginLeft = self.options["spacingHorizontal"] + "px";
            el.style.marginRight = self.options["spacingHorizontal"] + "px";
            el.style.marginTop = self.options["spacingVertical"] + "px";
            el.style.marginBottom = self.options["spacingVertical"] + "px";
        });

        //self.flipping_cards.getElementsByClassName('card-stack')


        // sizes and shadows of cards content (after generation of .front, .back)
        /*
         for (i = 0; i < self.decks.length; i++) {
         var el = self.decks[i].children;

         for (var j = 0; j < 2; j++) {
         el[j].style.width = self.options["cardWidth"] + "px";
         el[j].style.height = self.options["cardHeight"] + "px";
         el[j].classList.remove('shadowon');
         el[j].classList.remove('shadowoff');
         el[j].classList.add(self.options['displayShadow'] ? 'shadowon' : 'shadowoff');
         }
         }
         */

        self.card_html = "<div style='width: " + self.options["cardWidth"] + "px; height: " + self.options["cardHeight"] + "px' class='front  " + (self.options['displayShadow'] ? 'shadowon' : 'shadowoff') + "' style='transitionDuration:  " + self.options["transitionDuration"] + "ms'></div><div  style='width: " + self.options["cardWidth"] + "px; height: " + self.options["cardHeight"] + "px' class='back  " + (self.options['displayShadow'] ? 'shadowon' : 'shadowoff') + "' style='transitionDuration:  " + self.options["transitionDuration"] + "ms'></div>";

    }


};


//export default flipping;
if (typeof module === 'object') {
    module.exports = flipping;
}



