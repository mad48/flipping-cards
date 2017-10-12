window.onload = function () {

    var a = document.getElementById('left');
    a.onclick = function () {
        backward();
        return true;
    }

    var a = document.getElementById('right');
    a.onclick = function () {
        forward();
        return true;
    }


    var page = 0;

    var imgfr;
    var imgbk;

    var images = [];

    images[0] = ["images/1.jpg", "images/4.jpg", "images/7.jpg", "images/10.jpg", "images/13.jpg"];
    images[1] = ["images/2.jpg", "images/5.jpg", "images/8.jpg", "images/11.jpg", "images/14.jpg"];
    images[2] = ["images/3.jpg", "images/6.jpg", "images/9.jpg", "images/12.jpg", "images/15.jpg"];


    var flipping_cards = document.getElementById('flipping_cards');
    var cards = flipping_cards.getElementsByClassName('card');

    // prepare cards
    for (var i = 0; i < cards.length; i++) {

        var fr = cards[i].getElementsByClassName('front')[0].style;
        var bk = cards[i].getElementsByClassName('back')[0].style;

        bk.display = 'block';
        fr.backgroundImage = 'url(' + images[i][0] + ')';
        bk.transform = 'rotateY(180deg)';

    }


    // next
    function forward() {

        for (var i = 0; i < cards.length; i++) {

            var fr = cards[i].getElementsByClassName('front')[0].style;
            var bk = cards[i].getElementsByClassName('back')[0].style;

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


            fr.backgroundImage = 'url(' + images[i][imgfr] + ')';
            bk.backgroundImage = 'url(' + images[i][imgbk] + ')';
            fr.transform = 'rotateY(' + (-180 * (page + 1)) + 'deg)';
            bk.transform = 'rotateY(' + (-180 * page) + 'deg)';

        }

        page = page + 1;
    }

    // prev
    function backward() {

        for (var i = 0; i < cards.length; i++) {

            var fr = cards[i].getElementsByClassName('front')[0].style;
            var bk = cards[i].getElementsByClassName('back')[0].style;

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


            fr.backgroundImage = 'url(' + images[i][imgfr] + ')';
            bk.backgroundImage = 'url(' + images[i][imgbk] + ')';
            fr.transform = 'rotateY(' + (-180 * (page - 1)) + 'deg)';
            if (page > 1) {
                bk.transform = 'rotateY(' + (-180 * (page - 2)) + 'deg)';
            }
            else {
                bk.transform = 'rotateY(' + 180 + 'deg)';
            }

        }
        page = page - 1;
    }

}




