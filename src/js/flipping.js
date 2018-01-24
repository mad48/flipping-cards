// /*##REVIEW: FOLLOWING COMMENTED OUT BECAUSE COMMENTS ISIDE OF JSON OBJECT LITERALS ARE NOT ALLOWED IN ES-5

// var flipping = {/**##REVIEW: flipping seems to be declared as a global variable.
//   Recommended to check if this identifier is already taken before assignment.
//
//     options: { /*##REVIEW: "options" is a misleading name, consider renaming it to
//     'settings' or 'configuration'. Reason: the word "option" suppose a choice of one criteria,
//     e.g. for autoFlipMode options are false and true, for rotationMode options will be
//     'SIMULTANEOUS' and 'SEQUENTIAL', for cardsToShow options will be any numeric value
//     between 0 and Number.MAX_VALUE. */
//         autoFlipMode: false,
//         autoFlipDelay: 1500,
//         pauseMouseOver: true,
//
//         cardsShadow: true,
//         buttonsShadow: true,
//
//         transitionDuration: 700,
//
//         rotationMode: "simultaneous", /*##REVIEW: "simultaneous" should be uppercase, because
//         it is constant value, per standard. */
//         sequentialDelay: 600,
//
//         cardWidth: 150,
//         cardHeight: 180,
//
//         spacingHorizontal: 15,
//         spacingVertical: 15,
//
//         cardsToShow: 1,
//         cardsPerRow: 1,
//
//         startFromIndex: 1,
//
//         buttonBackwardHtml: "&#9668;",
//         buttonForwardHtml: "&#9658;"
//     },
//
//     flipping_cards: null, /*##REVIEW: property names should be camelCased per standard. */
//     buttons: [],
//     box: null,
//
//     cards_count: 0, /*##REVIEW: property names should be camelCased per standard. */
//
//     content: [],
//     last_index: -1, /*##REVIEW: property names should be camelCased per standard. */
//     start_index: -1, /*##REVIEW: property names should be camelCased per standard. */
//     direction: 1, /*##REVIEW: the values of -1 and 1 are not descriptive, recommended to consider
//     use options 'ltr' and 'rtl'; 'left' and 'right';
//     The 'back' and 'forward' not so recommended because of how different human languages matching
//     left and right to back and forward. */
//
//     browser: null,
//     touch_position: null, /*##REVIEW: property names should be camelCased per standard. */
//     flip_disabled: false, /*##REVIEW: property names should be camelCased per standard. */
//     timeout: 0,


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
    flip_disabled: false,
    timeout: 0,
// ---------------------------------------------------------------------------------------------
    setConfiguration: function (opt) { /*##REVIEW: 'opt' is not descriptive name, recommended to be
    renamed to something more descriptive, e.g. nextConfiguration, nextConfig, 'nextParams', 'config',
    'settings', 'nextSettings'. */
        /* options */
        var self = this; /*##REVIEW: "self" is non-descriptive name, should be renamed to something more
        descriptive e.g. "carousel" or "carouselDom" or "carouselInstance" depending where it points to. */

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


        // transition for transition /*##REVIEW: misleading comment, recommended correct to 'duration of transition'. */
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
            self.buttons[0].classList.remove("shadowon"); /*##REVIEW: recommended
            to modify css class names to use "-" as word separator, per standard.
            Recommended to apply for all css class names below. */
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
        var self = this;  /*##REVIEW: "self" is non-descriptive name, should be renamed to something more
        descriptive e.g. "carousel" or "carouselDom" or "carouselInstance" depending where it points to. */
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
        var self = this; /*##REVIEW: "self" is non-descriptive name, should be renamed to something more
        descriptive e.g. "carousel" or "carouselDom" or "carouselInstance" depending where it points to. */

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
    setCardFrontContent: function (stack_index, direction) { /*##REVIEW: "stack_index" should be camelCased per standard*/
        var self = this; /*##REVIEW: "self" is non-descriptive name, should be renamed to something more
        descriptive e.g. "carousel" or "carouselDom" or "carouselInstance" depending where it points to. */

        var front = self.box.children[stack_index].getElementsByClassName('front')[0];
        front.innerHTML = self.content[self.setNextContentIndex(direction)];

        if (stack_index == 0) self.start_index = self.last_index - 1;
    },


// ---------------------------------------------------------------------------------------------
    setCardBackContent: function (stack_index, direction) { /*##REVIEW: "stack_index" should be camelCased per standard. */
        var self = this;  /*##REVIEW: "self" is non-descriptive name, should be renamed to something more
        descriptive e.g. "carousel" or "carouselDom" or "carouselInstance" depending where it points to. */
        var back = self.box.children[stack_index].getElementsByClassName('back')[0];
        back.classList.remove("back1");
        back.classList.remove("back-1");
        back.classList.add("back" + direction);
        back.innerHTML = self.content[self.setNextContentIndex(1)];
    },


// ---------------------------------------------------------------------------------------------
    setCardStacksHTML: function () {
        var self = this; /*##REVIEW: "self" is non-descriptive name, should be renamed to something more
        descriptive e.g. "carousel" or "carouselDom" or "carouselInstance" depending where it points to. */
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
    init: function (elem, opt) { /*##REVIEW: parameter names are not descriptive
      elem seems to be not element, but ruther an id of a DOM element from which carousel should be built.
      'opt' is not descriptive name, recommended to be renamed to something more descriptive, e.g.
      'config', 'settings', 'params'. */
        var self = this; /*##REVIEW: "self" is non-descriptive name, should be renamed to something more
        descriptive e.g. "carousel" or "carouselDom" or "carouselInstance" depending where it points to. */

        if (self.start_index == -1) self.start_index = self.options.startFromIndex;
        else  self.last_index = self.start_index;

        self.browser = self.getBrowser();

        self.flipping_cards = document.getElementById(elem);

        var cards_container = flipping_cards.getElementsByClassName('cards')[0]; /*##REVIEW:
        variable names should be camelCased for words separation per standard. */

        /*##REVIEW: WHY IS THIS:
        console.log('is flipping_cards === self.flipping_cards ? ', flipping_cards === self.flipping_cards)
        */

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
        var self = this;  /*##REVIEW: "self" is non-descriptive name, should be renamed to something more
        descriptive e.g. "carousel" or "carouselDom" or "carouselInstance" depending where it points to. */

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
        var self = this;  /*##REVIEW: "self" is non-descriptive name, should be renamed to something more
        descriptive e.g. "carousel" or "carouselDom" or "carouselInstance" depending where it points to. */
        self.touch_position = event.touches[0].pageX;
    },


// ---------------------------------------------------------------------------------------------
    touchForward: function (event) {
        var self = this;  /*##REVIEW: "self" is non-descriptive name, should be renamed to something more
        descriptive e.g. "carousel" or "carouselDom" or "carouselInstance" depending where it points to. */

        var touches = event.changedTouches;

        var move = self.touch_position - touches[touches.length - 1].pageX;

        if (Math.abs(move) < 10 || self.flip_disabled == true) {
            return false;
        }
        if (move < 0) {
            self.arrowClick(-1);
        }
        else {
            self.arrowClick(1);
        }
    },


// ---------------------------------------------------------------------------------------------
    flipAllCards: function (direction) {

        var self = this; /*##REVIEW: "self" is non-descriptive name, should be renamed to something more
        descriptive e.g. "carousel" or "carouselDom" or "carouselInstance" depending where it points to. */
        var i = 0;

        self.disableButtons(true);
        self.flip_disabled = true;

        var full_flip_time = self.options.rotationMode == "sequential" ? /*##REVIEW: "full_flip_time" should be camelCased per standard. */
        self.options.sequentialDelay * self.cards_count :
            self.options.transitionDuration;

        for (i = 0; i < self.cards_count; i++) {
            (function (stack_index) { /*##REVIEW: "stack_index" should be camelCased per standard. */
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
            self.flip_disabled = false;

        }, full_flip_time);
    },


// ---------------------------------------------------------------------------------------------
    flipCard: function (stack_index, direction) {
        var self = this; /*##REVIEW: "self" is non-descriptive name, should be renamed to something more
        descriptive e.g. "carousel" or "carouselDom" or "carouselInstance" depending where it points to. */

        var stack = self.box.children[stack_index];

        var front = stack.getElementsByClassName('front')[0];
        var back = stack.getElementsByClassName('back')[0];

        front.style.transitionDuration = self.options.transitionDuration + "ms";
        back.style.transitionDuration = self.options.transitionDuration + "ms";

        var trans = self.browser == "safari" ? "webkitTransform" : "transform";

        front.style[trans] = 'rotateY(' + (-1 * direction * 180) + 'deg)';
        back.style[trans] = 'rotateY(' + 0 + 'deg)';
    },


//----------------------------------------------------------------------------------------------
    disableButtons: function (state) { /*##REVIEW: violation of single responsibility principal of OOD,
      recommended either to rename method to 'setButtonsDisabledState' or converted into two
      methods: "disableButtons" and "enableButtons". */
        var self = this; /*##REVIEW: "self" is non-descriptive name, should be renamed to something more
        descriptive e.g. "carousel" or "carouselDom" or "carouselInstance" depending where it points to. */

        /*        var val = state ? "none" : "auto";
         self.buttons[0].style.pointerEvents = val;
         self.buttons[1].style.pointerEvents = val;*/ /*##REVIEW: recommended to provide reason why
         the code block is commented out. */

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
    autoFlip: function (state, direction) { /*##REVIEW: this function seems to be used only for
      setting mode and never getting. This is why recommended to rename it to setAutoFlip per standard. */
        var self = this;  /*##REVIEW: "self" is non-descriptive name, should be renamed to something more
        descriptive e.g. "carousel" or "carouselDom" or "carouselInstance" depending where it points to. */
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
