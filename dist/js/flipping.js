var flipping = {

    options: {
        autoFlipMode: false,
        autoFlipDelay: 1500,
        pauseMouseOver: true,

        cardsShadow: true,
        buttonsShadow: true,

        transitionDuration: 700,

        rotationMode: "simultaneous",
        sequentialDelay: 600,

        cardWidth: 150,
        cardHeight: 180,

        spacingHorizontal: 15,
        spacingVertical: 15,

        cardsToShow: 1,
        cardsPerRow: 1,

        startFromIndex: 1,

        buttonBackwardHtml: "&#9668;",
        buttonForwardHtml: "&#9658;"
    },

    flipping_cards: null,
    buttons: [],
    box: null,

    cards_count: 0,

    content: [],
    last_index: -1,
    start_index: -1,
    direction: 1,

    browser: null,
    touch_position: null,
    timeout: 0,

// ---------------------------------------------------------------------------------------------
    setConfiguration: function (opt) {
        /* options */
        var self = this;

        // disable drags
        self.box.ondragstart = function () {
            return false;
        };


        if (opt.autoFlipMode == false) {
            self.options.autoFlipMode = false;
            self.buttons[0].style.visibility = "visible";
            self.buttons[1].style.visibility = "visible";
            self.autoFlip(false);
        }

        if (opt.autoFlipMode == true) {
            if (self.options.autoFlipMode == false) self.autoFlip(true);
            self.options.autoFlipMode = true;
            self.buttons[0].style.visibility = "hidden";
            self.buttons[1].style.visibility = "hidden";

        }

        // delay for next flip in auto mode
        if (self.options.autoFlipDelay != opt.autoFlipDelay && self.options.autoFlipMode) {
            self.autoFlip(false);
            self.options.autoFlipDelay = parseInt(opt.autoFlipDelay);
            self.autoFlip(true);
        }


        // startFromIndex
        if (opt.startFromIndex > 0) {
            if (opt.startFromIndex > self.content.length) opt.startFromIndex = self.content.length;
            self.options.startFromIndex = opt.startFromIndex - 1;
        }


        // transition for transition
        if (opt.transitionDuration > 0) {
            self.options.transitionDuration = opt.transitionDuration;
        }


        if (opt.pauseMouseOver == false || opt.pauseMouseOver == true) {
            self.options.pauseMouseOver = opt.pauseMouseOver;
        }

        // add suspend actions if automatic flipping is enabled
        if (self.options.pauseMouseOver == true || self.options.pauseMouseOver == false) {

            self.flipping_cards.onmouseover = function () {
                if (self.options.autoFlipMode == true && self.options.pauseMouseOver == true) {
                    self.autoFlip(false);
                }
            };

            self.flipping_cards.onmouseout = function () {
                if (self.options.autoFlipMode == true && self.options.pauseMouseOver == true) {
                    self.autoFlip(true);
                }
            };

        }

        // card size
        if (opt.cardWidth > 0) self.options.cardWidth = parseInt(opt.cardWidth);
        if (opt.cardHeight > 0) self.options.cardHeight = parseInt(opt.cardHeight);

        // card spacing
        if (opt.spacingVertical > 0) self.options.spacingVertical = parseInt(opt.spacingVertical);
        if (opt.spacingHorizontal > 0) self.options.spacingHorizontal = parseInt(opt.spacingHorizontal);

        // card shadow
        if (opt.cardsShadow == false) {
            self.options.cardsShadow = false;
        }

        if (opt.cardsShadow == true) {
            self.options.cardsShadow = true;
        }

        // sequentialDelay
        if (opt.sequentialDelay > 0) self.options.sequentialDelay = opt.sequentialDelay;

        // rotationMode
        if (opt.rotationMode == "simultaneous" || opt.rotationMode == "sequential") {
            if (opt.rotationMode == "simultaneous") {
                self.options.rotationMode = "simultaneous";
                self.options.sequentialDelay = 0;
            }
            else {
                self.options.rotationMode = "sequential";
            }
        }

        // cardsToShow
        if (opt.cardsToShow > 0) {
            self.options.cardsToShow = opt.cardsToShow;
        }


        // cardsPerRow
        if (opt.cardsPerRow > 0) {
            if (opt.cardsPerRow > opt.cardsToShow) opt.cardsPerRow = opt.cardsToShow;
            self.options.cardsPerRow = opt.cardsPerRow;
        }


        // width of cards container
        self.box.style.width = self.options.cardWidth * self.options.cardsPerRow +
            2 * self.options.spacingHorizontal * self.options.cardsPerRow + "px";


        // on deactivate window
        window.onblur = function () {
            if (self.options.autoFlipMode) self.autoFlip(false);
        };
        window.onfocus = function () {
            if (self.options.autoFlipMode) self.autoFlip(true);
        };


        // buttons shadow
        if (opt.buttonsShadow == false) {
            self.options.buttonsShadow = false;
            self.buttons[0].classList.remove("shadowon");
            self.buttons[0].classList.add("shadowoff");
            self.buttons[1].classList.remove("shadowon");
            self.buttons[1].classList.add("shadowoff");
        }

        if (opt.buttonsShadow == true || opt.buttonsShadow == undefined) {
            self.options.buttonsShadow = true;
            self.buttons[0].classList.remove("shadowoff");
            self.buttons[0].classList.add("shadowon");
            self.buttons[1].classList.remove("shadowoff");
            self.buttons[1].classList.add("shadowon");
        }

        // set buttons html
        if (self.buttons[0].innerHTML.trim() !== "") {
            self.options.buttonBackwardHtml = self.buttons[0].innerHTML;
        }
        if (opt.buttonBackwardHtml != undefined) {
            self.options.buttonBackwardHtml = opt.buttonBackwardHtml;
        }
        self.buttons[0].innerHTML = self.options.buttonBackwardHtml;


        if (self.buttons[1].innerHTML.trim() !== "") {
            self.options.buttonForwardHtml = self.buttons[1].innerHTML;
        }
        if (opt.buttonForwardHtml != undefined) {
            self.options.buttonForwardHtml = opt.buttonForwardHtml;
        }
        self.buttons[1].innerHTML = self.options.buttonForwardHtml;


        // buttons click
        self.disableButtons(false);
    },


// ---------------------------------------------------------------------------------------------
    setNextContentIndex: function (direction, step) {
        var self = this;
        var len = self.content.length;
        var ind = 0;

        if (step == null) step = 1;

        if (direction == 1) {
            ind = self.last_index + step;
            if (ind > len - 1) ind = self.last_index + step - len;
            self.last_index = ind;
            return ind;
        }

        if (direction == -1) {
            ind = self.last_index - step;
            if (ind < 0) ind = self.last_index - step + len;
            self.last_index = ind;
            return ind;
        }
    },


// ---------------------------------------------------------------------------------------------
    getCardFrontBackHTML: function () {
        var self = this;

        return "<div style='" +
            "width: " + self.options.cardWidth + "px; " +
            "height: " + self.options.cardHeight + "px; " +
            "transitionDuration:  " + self.options.transitionDuration + "ms' " +
            "class='front  " + (self.options.cardsShadow ? 'shadowon' : 'shadowoff') + "'></div>" +
            "<div  style='" +
            "width: " + self.options.cardWidth + "px; " +
            "height: " + self.options.cardHeight + "px' " +
            "transitionDuration:  " + self.options.transitionDuration + "ms' " +
            "class='back back" + self.direction + " " + (self.options.cardsShadow ? 'shadowon' : 'shadowoff') + "'></div>";

    },

// ---------------------------------------------------------------------------------------------
    setCardFrontContent: function (stack_index, direction) {
        var self = this;

        var front = self.box.children[stack_index].getElementsByClassName('front')[0];
        front.innerHTML = self.content[self.setNextContentIndex(direction)];

        if (stack_index == 0) self.start_index = self.last_index - 1;
    },


// ---------------------------------------------------------------------------------------------
    setCardBackContent: function (stack_index, direction) {
        var self = this;
        var back = self.box.children[stack_index].getElementsByClassName('back')[0];
        back.classList.remove("back1");
        back.classList.remove("back-1");
        back.classList.add("back" + direction);
        back.innerHTML = self.content[self.setNextContentIndex(1)];
    },


// ---------------------------------------------------------------------------------------------
    setCardStacksHTML: function () {
        var self = this;
        self.box.innerHTML = "";
        for (var i = 0; i < self.options.cardsToShow; i++) {
            self.box.innerHTML = self.box.innerHTML +
                '<div class="card-stack">' + self.getCardFrontBackHTML() + '</div>';
        }

        // vertical and horizontal spacings
        [].forEach.call(self.box.children, function (el) {
            el.style.marginLeft = self.options.spacingHorizontal + "px";
            el.style.marginRight = self.options.spacingHorizontal + "px";
            el.style.marginTop = self.options.spacingVertical + "px";
            el.style.marginBottom = self.options.spacingVertical + "px";
        });

    },

// ---------------------------------------------------------------------------------------------
    getCardsContentArray: function (node) {
        var arr = [];
        for (var i = 0; i < node.children.length; i++) {
            arr[i] = node.children[i].innerHTML.trim();
        }
        return arr;
    },

// ---------------------------------------------------------------------------------------------
    init: function (elem, opt) {
        var self = this;

        if (self.start_index == -1) self.start_index = self.options.startFromIndex;
        else  self.last_index = self.start_index;

        self.browser = self.getBrowser();

        self.flipping_cards = document.getElementById(elem);

        var cards_container = flipping_cards.getElementsByClassName('cards')[0];

        self.buttons[0] = flipping_cards.getElementsByClassName('btn-backward')[0];
        self.buttons[1] = flipping_cards.getElementsByClassName('btn-forward')[0];

        if (self.box == null) {
            var cards = document.createElement('div');
            cards.classList.add("card-box");
            self.box = cards_container.parentNode.insertBefore(cards, cards_container.nextSibling);
        }

        self.content = self.getCardsContentArray(cards_container);

        // configure
        self.setConfiguration(opt);

        self.setCardStacksHTML();

        self.cards_count = self.box.children.length;

        for (var i = 0; i < self.cards_count; i++) {
            self.setCardFrontContent(i, 1);
        }
        for (i = 0; i < self.cards_count; i++) {
            self.setCardBackContent(i, 1);
        }

        self.flipping_cards.style.visibility = 'visible';

        if ('ontouchstart' in document.documentElement) {
            self.flipping_cards.addEventListener('touchstart', function (event) {
                self.touchBackward(event);
            }, false);
            self.flipping_cards.addEventListener('touchend', function (event) {
                self.touchForward(event);
            }, false);
        }

    },

// ---------------------------------------------------------------------------------------------
    arrowClick: function (direction) {
        var self = this;

        if (self.direction != direction) {

            self.direction = direction;

            self.setCardStacksHTML();

            if (direction == -1) self.setNextContentIndex(-1, self.cards_count * 2);

            for (i = 0; i < self.cards_count; i++) {
                self.setCardFrontContent(i, 1);
            }

            if (direction == -1) self.setNextContentIndex(-1, self.cards_count * 2);

            for (i = 0; i < self.cards_count; i++) {
                self.setCardBackContent(i, direction);
            }

        }
        self.direction = direction;
        self.flipAllCards(direction);
    },


// ---------------------------------------------------------------------------------------------
    touchBackward: function (event) {
        var self = this;
        self.touch_position = event.touches[0].pageX;
    },


// ---------------------------------------------------------------------------------------------
    touchForward: function (event) {
        var self = this;

        var touches = event.changedTouches;

        var move = self.touch_position - touches[touches.length - 1].pageX;

        if (Math.abs(move) < 10) {
            return false;
        }
        if (move < 0) {
            self.arrowClick(1);
        }
        else {
            self.arrowClick(-1);
        }
    },


// ---------------------------------------------------------------------------------------------
    flipAllCards: function (direction) {

        var self = this;
        var i = 0;

        self.disableButtons(true);

        var full_flip_time = self.options.rotationMode == "sequential" ?
        self.options.sequentialDelay * self.cards_count :
            self.options.transitionDuration;

        for (i = 0; i < self.cards_count; i++) {
            (function (stack_index) {
                setTimeout(function () {
                    self.flipCard(stack_index, direction);
                }, self.options.sequentialDelay * stack_index);
            })(i);
        }

        setTimeout(function () {
            self.setCardStacksHTML();

            self.setNextContentIndex(-1, self.cards_count);

            for (var i = 0; i < self.cards_count; i++) {
                self.setCardFrontContent(i, 1);
            }

            if (direction == -1) {
                self.setNextContentIndex(-1, self.cards_count * 2);
            }

            for (i = 0; i < self.cards_count; i++) {
                self.setCardBackContent(i, direction);
            }

            self.disableButtons(false);

        }, full_flip_time);
    },


// ---------------------------------------------------------------------------------------------
    flipCard: function (stack_index, direction) {
        var self = this;

        var stack = self.box.children[stack_index];

        var front = stack.getElementsByClassName('front')[0];
        var back = stack.getElementsByClassName('back')[0];

        front.style.transitionDuration = self.options.transitionDuration + "ms";
        back.style.transitionDuration = self.options.transitionDuration + "ms";

        if (self.browser == "safari") {
            front.style.webkitTransform = 'rotateY(' + (-1 * direction * 180) + 'deg)';
            back.style.webkitTransform = 'rotateY(' + 0 + 'deg)';
        } else {
            front.style.transform = 'rotateY(' + (-1 * direction * 180) + 'deg)';
            back.style.transform = 'rotateY(' + 0 + 'deg)';
        }
    },


//----------------------------------------------------------------------------------------------
    disableButtons: function (state) {
        var self = this;
        /*        var val = state ? "none" : "auto";
         self.buttons[0].style.pointerEvents = val;
         self.buttons[1].style.pointerEvents = val;*/

        if (state) {
            self.buttons[0].onclick = function () {
                return false;
            };
            self.buttons[1].onclick = function () {
                return false;
            };
        } else {
            self.buttons[0].onclick = function () {
                self.arrowClick(-1);
            };
            self.buttons[1].onclick = function () {
                self.arrowClick(1);
            };
        }
    },


//----------------------------------------------------------------------------------------------
    autoFlip: function (state, direction) {
        var self = this;
        if (direction == null) direction = 1;
        if (state) {
            self.timeout = setInterval(function () {
                self.arrowClick(direction);
            }, self.options.autoFlipDelay);
        } else {
            clearInterval(self.timeout);
        }
    },


// ---------------------------------------------------------------------------------------------
    getBrowser: function () {
        if (navigator.userAgent.search(/Safari/) > -1) return "safari";
        else return "";
    }

};


//export default flipping
if (typeof module === 'object') {
    module.exports = flipping;
}



