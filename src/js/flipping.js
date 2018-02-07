(function () {
    var flipping = {

        configuration: {
            autoFlipMode: false,
            autoFlipDelay: 1500,
            pauseMouseOver: true,

            cardsShadow: true,
            buttonsShadow: true,

            transitionDuration: 700,

            rotationMode: "SIMULTANEOUS",
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

        flippingCards: null,
        buttons: [],
        box: null,

        cardsCount: 0,

        content: [],
        lastIndex: -1,
        startIndex: -1,
        direction: 1,

        browser: null,
        touchPosition: null,
        flipDisabled: false,
        timeout: 0,

// ---------------------------------------------------------------------------------------------
        setConfiguration: function (config) {

            /* configuration */
            var carousel = this;

            // disable drags
            carousel.box.ondragstart = function () {
                return false;
            };

            // auto flipping mode
            if (config.autoFlipMode == false) {
                carousel.configuration.autoFlipMode = false;
                carousel.buttons[0].style.visibility = "visible";
                carousel.buttons[1].style.visibility = "visible";
                carousel.setAutoFlip(false);
            }

            if (config.autoFlipMode == true) {
                if (carousel.configuration.autoFlipMode == false) {
                    carousel.setAutoFlip(true);
                }
                carousel.configuration.autoFlipMode = true;
                carousel.buttons[0].style.visibility = "hidden";
                carousel.buttons[1].style.visibility = "hidden";

            }

            // delay for next flip in auto mode
            if (carousel.configuration.autoFlipDelay != config.autoFlipDelay && carousel.configuration.autoFlipMode) {
                carousel.setAutoFlip(false);
                carousel.configuration.autoFlipDelay = parseInt(config.autoFlipDelay);
                carousel.setAutoFlip(true);
            }


            // starting card index
            if (config.startFromIndex > 0) {
                if (config.startFromIndex > carousel.content.length) {
                    config.startFromIndex = carousel.content.length;
                }
                carousel.configuration.startFromIndex = parseInt(config.startFromIndex) - 1;
            }


            // duration of transition
            if (config.transitionDuration > 0) {
                carousel.configuration.transitionDuration = parseInt(config.transitionDuration);
            }

            // mouse over carousel
            if (config.pauseMouseOver == false || config.pauseMouseOver == true) {
                carousel.configuration.pauseMouseOver = config.pauseMouseOver;
            }

            // add suspend actions if automatic flipping is enabled
            if (carousel.configuration.pauseMouseOver == true || carousel.configuration.pauseMouseOver == false) {

                carousel.flippingCards.onmouseover = function () {
                    if (carousel.configuration.autoFlipMode == true && carousel.configuration.pauseMouseOver == true) {
                        carousel.setAutoFlip(false);
                    }
                };

                carousel.flippingCards.onmouseout = function () {
                    if (carousel.configuration.autoFlipMode == true && carousel.configuration.pauseMouseOver == true) {
                        carousel.setAutoFlip(true);
                    }
                };

            }

            // card size
            if (config.cardWidth > 0) {
                carousel.configuration.cardWidth = parseInt(config.cardWidth);
            }
            if (config.cardHeight > 0) {
                carousel.configuration.cardHeight = parseInt(config.cardHeight);
            }

            // card spacing
            if (config.spacingVertical > 0) {
                carousel.configuration.spacingVertical = parseInt(config.spacingVertical);
            }
            if (config.spacingHorizontal > 0) {
                carousel.configuration.spacingHorizontal = parseInt(config.spacingHorizontal);
            }

            // card shadow
            if (config.cardsShadow == false) {
                carousel.configuration.cardsShadow = false;
            }
            if (config.cardsShadow == true) {
                carousel.configuration.cardsShadow = true;
            }

            // sequential delay
            if (config.sequentialDelay > 0) {
                carousel.configuration.sequentialDelay = parseInt(config.sequentialDelay);
            }

            // simultaneous or sequential rotation mode
            if (config.rotationMode && (
                config.rotationMode.toLowerCase() == "simultaneous" ||
                config.rotationMode.toLowerCase() == "sequential")) {
                if (config.rotationMode.toLowerCase() == "simultaneous") {
                    carousel.configuration.rotationMode = "simultaneous";
                    carousel.configuration.sequentialDelay = 0;
                }
                else {
                    carousel.configuration.rotationMode = "sequential";
                }
            }

            // number of cards to show
            if (config.cardsToShow >= 0) {
                if (config.cardsToShow > carousel.content.length) {
                    config.cardsToShow = carousel.content.length;
                }
                carousel.configuration.cardsToShow = parseInt(config.cardsToShow);
            }

            // number of cards per row
            if (config.cardsPerRow > 0) {
                if (config.cardsPerRow > carousel.content.length) {
                    config.cardsPerRow = carousel.content.length;
                }
                if (config.cardsPerRow > carousel.configuration.cardsToShow) {
                    config.cardsPerRow = carousel.configuration.cardsToShow;
                }
                carousel.configuration.cardsPerRow = parseInt(config.cardsPerRow);
            }

            // width of cards container
            carousel.box.style.width = carousel.configuration.cardWidth * carousel.configuration.cardsPerRow +
                2 * carousel.configuration.spacingHorizontal * carousel.configuration.cardsPerRow + "px";

            // on deactivate window
            window.onblur = function () {
                if (carousel.configuration.autoFlipMode) {
                    carousel.setAutoFlip(false);
                }
            };
            window.onfocus = function () {
                if (carousel.configuration.autoFlipMode) {
                    carousel.setAutoFlip(true);
                }
            };

            // hide buttons if no cards
            if (config.cardsToShow == 0) {
                carousel.buttons[0].style.visibility = "hidden";
                carousel.buttons[1].style.visibility = "hidden";
            }
            else {
                carousel.buttons[0].style.visibility = "visible";
                carousel.buttons[1].style.visibility = "visible";
            }

            // buttons shadow
            if (config.buttonsShadow === false) {
                carousel.configuration.buttonsShadow = false;
                carousel.buttons[0].classList.remove("shadow-on");
                carousel.buttons[0].classList.add("shadow-off");
                carousel.buttons[1].classList.remove("shadow-on");
                carousel.buttons[1].classList.add("shadow-off");
            }
            if (config.buttonsShadow === true || typeof config.buttonsShadow === "undefined") {
                carousel.configuration.buttonsShadow = true;
                carousel.buttons[0].classList.remove("shadow-off");
                carousel.buttons[0].classList.add("shadow-on");
                carousel.buttons[1].classList.remove("shadow-off");
                carousel.buttons[1].classList.add("shadow-on");
            }

            // set buttons html
            if (carousel.buttons[0].innerHTML.trim() !== "") {
                carousel.configuration.buttonBackwardHtml = carousel.buttons[0].innerHTML;
            }
            if (typeof config.buttonBackwardHtm !== "undefined") {
                carousel.configuration.buttonBackwardHtml = config.buttonBackwardHtml;
            }
            carousel.buttons[0].innerHTML = carousel.configuration.buttonBackwardHtml;

            if (carousel.buttons[1].innerHTML.trim() !== "") {
                carousel.configuration.buttonForwardHtml = carousel.buttons[1].innerHTML;
            }
            if (typeof config.buttonForwardHtml !== "undefined") {
                carousel.configuration.buttonForwardHtml = config.buttonForwardHtml;
            }
            carousel.buttons[1].innerHTML = carousel.configuration.buttonForwardHtml;


            // buttons state
            carousel.setButtonsDisabledState(false);
        },


// ---------------------------------------------------------------------------------------------
        setNextContentIndex: function (direction, step) {
            var carousel = this;
            var len = carousel.content.length;
            var ind = 0;

            if (step == null) {
                step = 1;
            }

            if (direction == 1) {
                ind = carousel.lastIndex + step;
                if (ind > len - 1) {
                    ind = carousel.lastIndex + step - len;
                }
                carousel.lastIndex = ind;
                return ind;
            }

            if (direction == -1) {
                ind = carousel.lastIndex - step;
                if (ind < 0) {
                    ind = carousel.lastIndex - step + len;
                }
                carousel.lastIndex = ind;
                return ind;
            }
        },


// ---------------------------------------------------------------------------------------------
        getCardFrontBackHTML: function () {
            var carousel = this;

            return "<div style='" +
                "width: " + carousel.configuration.cardWidth + "px; " +
                "height: " + carousel.configuration.cardHeight + "px; " +
                "transitionDuration:  " + carousel.configuration.transitionDuration + "ms' " +
                "class='front  " + (carousel.configuration.cardsShadow ? "shadow-on" : "'shadow-off") + "'></div>" +
                "<div  style='" +
                "width: " + carousel.configuration.cardWidth + "px; " +
                "height: " + carousel.configuration.cardHeight + "px' " +
                "transitionDuration:  " + carousel.configuration.transitionDuration + "ms' " +
                "class='back back" + carousel.direction + " " + (carousel.configuration.cardsShadow ? "shadow-on" : "'shadow-off") + "'></div>";

        },

// ---------------------------------------------------------------------------------------------
        setCardFrontContent: function (stackIndex, direction) {
            var carousel = this;

            var front = carousel.box.children[stackIndex].getElementsByClassName("front")[0];
            front.innerHTML = carousel.content[carousel.setNextContentIndex(direction)];

            if (stackIndex == 0) {
                carousel.startIndex = carousel.lastIndex - 1;
            }
        },


// ---------------------------------------------------------------------------------------------
        setCardBackContent: function (stackIndex, direction) {
            var carousel = this;
            var back = carousel.box.children[stackIndex].getElementsByClassName("back")[0];
            back.classList.remove("back1");
            back.classList.remove("back-1");
            back.classList.add("back" + direction);
            back.innerHTML = carousel.content[carousel.setNextContentIndex(1)];
        },


// ---------------------------------------------------------------------------------------------
        setCardStacksHTML: function () {
            var carousel = this;
            carousel.box.innerHTML = "";
            for (var i = 0; i < carousel.configuration.cardsToShow; i++) {
                carousel.box.innerHTML = carousel.box.innerHTML +
                    "<div class='card-stack'>" + carousel.getCardFrontBackHTML() + "</div>";
            }

            // vertical and horizontal spacings
            [].forEach.call(carousel.box.children, function (el) {
                el.style.marginLeft = carousel.configuration.spacingHorizontal + "px";
                el.style.marginRight = carousel.configuration.spacingHorizontal + "px";
                el.style.marginTop = carousel.configuration.spacingVertical + "px";
                el.style.marginBottom = carousel.configuration.spacingVertical + "px";
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
        init: function (carouselDomElementId, config) {
            var carousel = this;

            if (carousel.startIndex == -1) {
                carousel.startIndex = carousel.configuration.startFromIndex;
            }
            else {
                carousel.lastIndex = carousel.startIndex;
            }

            carousel.browser = carousel.getBrowser();

            carousel.flippingCards = document.getElementById(carouselDomElementId);

            var cardsContainer = carousel.flippingCards.getElementsByClassName("cards")[0];

            carousel.buttons[0] = carousel.flippingCards.getElementsByClassName("btn-backward")[0];
            carousel.buttons[1] = carousel.flippingCards.getElementsByClassName("btn-forward")[0];

            if (carousel.box == null) {
                var cards = document.createElement("div");
                cards.classList.add("card-box");
                carousel.box = cardsContainer.parentNode.insertBefore(cards, cardsContainer.nextSibling);
            }

            carousel.content = carousel.getCardsContentArray(cardsContainer);

            // configure
            carousel.setConfiguration(config);

            carousel.setCardStacksHTML();

            carousel.cardsCount = carousel.box.children.length;

            for (var i = 0; i < carousel.cardsCount; i++) {
                carousel.setCardFrontContent(i, 1);
            }
            for (var j = 0; j < carousel.cardsCount; j++) {
                carousel.setCardBackContent(j, 1);
            }

            carousel.flippingCards.style.visibility = "visible";

            if ("ontouchstart" in document.documentElement) {
                carousel.flippingCards.addEventListener("touchstart", function (event) {
                    carousel.touchActionStart(event);
                }, false);
                carousel.flippingCards.addEventListener("touchend", function (event) {
                    carousel.touchActionEnd(event);
                }, false);
            }

        },

// ---------------------------------------------------------------------------------------------
        arrowClick: function (direction) {
            var carousel = this;

            if (carousel.direction != direction) {

                carousel.direction = direction;

                carousel.setCardStacksHTML();

                if (direction == -1) {
                    carousel.setNextContentIndex(-1, carousel.cardsCount * 2);
                }

                for (var i = 0; i < carousel.cardsCount; i++) {
                    carousel.setCardFrontContent(i, 1);
                }

                if (direction == -1) {
                    carousel.setNextContentIndex(-1, carousel.cardsCount * 2);
                }

                for (var j = 0; j < carousel.cardsCount; j++) {
                    carousel.setCardBackContent(j, direction);
                }

            }
            carousel.direction = direction;
            carousel.flipAllCards(direction);
        },


// ---------------------------------------------------------------------------------------------
        touchActionStart: function (event) {
            var carousel = this;
            carousel.touchPosition = event.touches[0].pageX;
        },


// ---------------------------------------------------------------------------------------------
        touchActionEnd: function (event) {
            var carousel = this;

            var touches = event.changedTouches;

            var move = carousel.touchPosition - touches[touches.length - 1].pageX;

            if (Math.abs(move) < 10 || carousel.flipDisabled == true) {
                return false;
            }
            if (move < 0) {
                carousel.arrowClick(-1);
            }
            else {
                carousel.arrowClick(1);
            }
        },


// ---------------------------------------------------------------------------------------------
        flipAllCards: function (direction) {

            var carousel = this;
            var i = 0;

            carousel.setButtonsDisabledState(true);
            carousel.flipDisabled = true;

            var fullFlipTime = carousel.configuration.rotationMode == "sequential" ? carousel.configuration.sequentialDelay * carousel.cardsCount : carousel.configuration.transitionDuration;

            for (i = 0; i < carousel.cardsCount; i++) {
                (function (stackIndex) {
                    setTimeout(function () {
                        carousel.flipCard(stackIndex, direction);
                    }, carousel.configuration.sequentialDelay * stackIndex);
                })(i);
            }

            setTimeout(function () {
                carousel.setCardStacksHTML();

                carousel.setNextContentIndex(-1, carousel.cardsCount);

                for (var i = 0; i < carousel.cardsCount; i++) {
                    carousel.setCardFrontContent(i, 1);
                }

                if (direction == -1) {
                    carousel.setNextContentIndex(-1, carousel.cardsCount * 2);
                }

                for (var j = 0; j < carousel.cardsCount; j++) {
                    carousel.setCardBackContent(j, direction);
                }

                carousel.setButtonsDisabledState(false);
                carousel.flipDisabled = false;

            }, fullFlipTime);
        },


// ---------------------------------------------------------------------------------------------
        flipCard: function (stackIndex, direction) {
            var carousel = this;

            var stack = carousel.box.children[stackIndex];

            var front = stack.getElementsByClassName("front")[0];
            var back = stack.getElementsByClassName("back")[0];

            front.style.transitionDuration = carousel.configuration.transitionDuration + "ms";
            back.style.transitionDuration = carousel.configuration.transitionDuration + "ms";

            var trans = carousel.browser == "safari" ? "webkitTransform" : "transform";

            front.style[trans] = "rotateY(" + (-1 * direction * 180) + "deg)";
            back.style[trans] = "rotateY(" + 0 + "deg)";
        },


//----------------------------------------------------------------------------------------------
        setButtonsDisabledState: function (state) {
            var carousel = this;

            if (state) {
                carousel.buttons[0].onclick = function () {
                    return false;
                };
                carousel.buttons[1].onclick = function () {
                    return false;
                };
            }
            else {
                carousel.buttons[0].onclick = function () {
                    carousel.arrowClick(-1);
                };
                carousel.buttons[1].onclick = function () {
                    carousel.arrowClick(1);
                };
            }
        },


//----------------------------------------------------------------------------------------------
        setAutoFlip: function (state, direction) {
            var carousel = this;
            if (direction == null) {
                direction = 1;
            }
            if (state) {
                carousel.timeout = setInterval(function () {
                    carousel.arrowClick(direction);
                }, carousel.configuration.autoFlipDelay);
            }
            else {
                clearInterval(carousel.timeout);
            }
        },


// ---------------------------------------------------------------------------------------------
        getBrowser: function () {
            if (navigator.userAgent.search(/Safari/) > -1) {
                return "safari";
            }
            else {
                return "";
            }
        }


    };


    if (typeof window.flipping !== "undefined") {
        console.error("The global scope name 'flipping' for flipping-cards-carousel already taken. " +
            "Try to set 'flippingCardsCarousel'");
        window.flippingCardsCarousel = flipping;
    }
    else {
        window.flipping = flipping;
    }

    // export flipping
    if (typeof module === "object") {
        module.exports = flipping;
    }

})();
