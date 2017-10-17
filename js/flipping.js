(function () {

    window.onload = function () {


        document.getElementById('left').onclick = function () {
            backward();
            return true;
        };

        document.getElementById('right').onclick = function () {
            forward();
            return true;
        };


        var page = 0;
        var i;
        var j;

        var imgfr;
        var imgbk;

        var images = [];

        var flipping_cards = document.getElementById('flipping_cards');
        var cards = flipping_cards.getElementsByClassName('card');


        for (i = 0; i < cards.length; i++) {

            images[i] = [];
            var divs = cards[i].children;

            for (j = 0; j < divs.length; j++) {
                images[i][j] = divs[j].innerHTML;//.getElementsByTagName('img')[0].src //.getElementsByTagName('div')
            }

            cards[i].innerHTML = '<div class="front"></div><div class="back"></div>';

        }


        // prepare cards
        for (i = 0; i < cards.length; i++) {

            var fr = cards[i].getElementsByClassName('front')[0];
            var bk = cards[i].getElementsByClassName('back')[0];

            bk.style.display = 'block';
            fr.innerHTML = images[i][0];
            //fr.style.backgroundImage = 'url(' + images[i][0] + ')';
            bk.style.transform = 'rotateY(180deg)';

        }


        // next
        function forward() {

            for (var i = 0; i < cards.length; i++) {

                var fr = cards[i].getElementsByClassName('front')[0];
                var bk = cards[i].getElementsByClassName('back')[0];

                // if last
                if (page >= images[i].length - 1) {
                    page = images[i].length - 1;
                    return;
                }

                if (page % 2) {
                    imgfr = page + 1;
                    imgbk = page;
                }
                else {
                    imgfr = page;
                    imgbk = page + 1;
                }

                fr.innerHTML = images[i][imgfr];
                bk.innerHTML = images[i][imgbk];
                /*fr.style.backgroundImage = 'url(' + images[i][imgfr] + ')';
                 bk.style.backgroundImage = 'url(' + images[i][imgbk] + ')';*/
                fr.style.transform = 'rotateY(' + (-180 * (page + 1)) + 'deg)';
                bk.style.transform = 'rotateY(' + (-180 * page) + 'deg)';

            }

            page = page + 1;
        }

        // prev
        function backward() {

            for (var i = 0; i < cards.length; i++) {

                var fr = cards[i].getElementsByClassName('front')[0];
                var bk = cards[i].getElementsByClassName('back')[0];

                // if first
                if (page <= 0) {
                    page = 0;
                    return;
                }

                if (page % 2) {
                    imgfr = page - 1;
                    imgbk = page;
                }
                else {
                    imgfr = page;
                    imgbk = page - 1;
                }

                fr.innerHTML = images[i][imgfr];
                bk.innerHTML = images[i][imgbk];
                /* fr.style.backgroundImage = 'url(' + images[i][imgfr] + ')';
                 bk.style.backgroundImage = 'url(' + images[i][imgbk] + ')';*/
                fr.style.transform = 'rotateY(' + (-180 * (page - 1)) + 'deg)';
                if (page > 1) {
                    bk.style.transform = 'rotateY(' + (-180 * (page - 2)) + 'deg)';
                }
                else {
                    bk.style.transform = 'rotateY(' + 180 + 'deg)';
                }

            }
            page = page - 1;
        }

    }


})(this);



