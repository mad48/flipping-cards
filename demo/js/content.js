var content = [];

/*        var carddecks = document.getElementsByClassName("card-deck");
 for (i = 0; i < carddecks.length; i++) {
 content[i] = carddecks[i].innerHTML;
 }*/

content = [
    '<div class="card-deck"> <div><h2>Deep Blue <br>Sea<br>1</h2> <div class="readmore"><a href="#" onclick="alert(\'More about -1- Lorem ipsum el dolor sit amet...\'); return false">Read More</a></div> <h3>0</h3><img src="../demo/images/1.jpg"/> </div> <div> <h2>Lorem ipsum<br>4</h2> <span class="readmore"><a href="#" onclick="alert(\'More about -4- Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span> <h3>1</h3><img src="../demo/images/4.jpg"/></div> <div> <h2>Lorem ipsum<br>7</h2> <span class="readmore"><a href="#" onclick="alert(\'More about -7- Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span> <h3>2</h3><img src="../demo/images/7.jpg"/></div> <div> <h2>Lorem ipsum<br>10</h2> <span class="readmore"><a href="#" onclick="alert(\'More about -10- Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span> <h3>3</h3><img src="../demo/images/10.jpg"/></div> <div> <h2>Lorem ipsum<br>13</h2> <span class="readmore"><a href="#" onclick="alert(\'More about -13- Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span> <h3>4</h3><img src="../demo/images/13.jpg"/></div> </div>',

    '<div class="card-deck"> <div> <h2>Northern <br>Lights<br>2</h2> <span class="readmore"><a href="#" onclick="alert(\'More about -2- Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span> <img src="../demo/images/2.jpg"/> </div> <div> <h2>Lorem ipsum<br>5</h2> <span class="readmore"><a href="#" onclick="alert(\'More about -5- Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span><img src="../demo/images/5.jpg"/></div> <div> <h2>Lorem ipsum<br>8</h2> <span class="readmore"><a href="#" onclick="alert(\'More about -8- Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span><img src="../demo/images/8.jpg"/></div> <div> <h2>Lorem ipsum<br>11</h2> <span class="readmore"><a href="#" onclick="alert(\'More about -11- Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span><img src="../demo/images/11.jpg"/></div> <div> <h2>Lorem ipsum<br>14</h2> <span class="readmore"><a href="#" onclick="alert(\'More about -14- Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span><img src="../demo/images/14.jpg"/></div> </div>',

    '<div class="card-deck"> <div> <h2>Over The <br>Mountains<br>3</h2> <span class="readmore"><a href="#" onclick="alert(\'More about -3- Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span> <img src="../demo/images/3.jpg"/> </div> <div> <h2>Lorem ipsum<br>6</h2> <span class="readmore"><a href="#" onclick="alert(\'More about -6- Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span><img src="../demo/images/6.jpg"/></div> <div> <h2>Lorem ipsum<br>9</h2> <span class="readmore"><a href="#" onclick="alert(\'More about -9- Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span><img src="../demo/images/9.jpg"/></div> <div> <h2>Lorem ipsum<br>12</h2> <span class="readmore"><a href="#" onclick="alert(\'More about -12- Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span><img src="../demo/images/12.jpg"/></div> <div> <h2>Lorem ipsum<br>15</h2> <span class="readmore"><a href="#" onclick="alert(\'More about -15- Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span><img src="../demo/images/15.jpg"/></div> </div>',

    '<div class="card-deck"> <div> <h2>Lorem ipsum<br></h2> <span class="readmore"><a href="#" onclick="alert(\'More about Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span> <img src="../demo/images/13.jpg"/></div> <div> <h2>Lorem ipsum<br></h2> <span class="readmore"><a href="#" onclick="alert(\'More about Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span> <img src="../demo/images/10.jpg"/></div> <div> <h2>Lorem ipsum<br></h2> <span class="readmore"><a href="#" onclick="alert(\'More about Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span> <img src="../demo/images/4.jpg"/></div> <div> <h2>Lorem ipsum<br></h2> <span class="readmore"><a href="#" onclick="alert(\'More about Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span> <img src="../demo/images/7.jpg"/></div> <div> <h2>Lorem ipsum<br></h2> <span class="readmore"><a href="#" onclick="alert(\'More about Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span> <img src="../demo/images/1.jpg"/></div> </div>',

    '<div class="card-deck"> <div> <h2>Lorem ipsum<br></h2> <span class="readmore"><a href="#" onclick="alert(\'More about Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span> <img src="../demo/images/8.jpg"/></div> <div> <h2>Lorem ipsum<br></h2> <span class="readmore"><a href="#" onclick="alert(\'More about Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span><img src="../demo/images/1.jpg"/></div> <div> <h2>Lorem ipsum<br></h2> <span class="readmore"><a href="#" onclick="alert(\'More about Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span><img src="../demo/images/14.jpg"/></div> <div> <h2>Lorem ipsum<br></h2> <span class="readmore"><a href="#" onclick="alert(\'More about Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span><img src="../demo/images/5.jpg"/></div> <div> <h2>Lorem ipsum<br></h2> <span class="readmore"><a href="#" onclick="alert(\'More about Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span><img src="../demo/images/2.jpg"/></div> </div>',

    '<div class="card-deck"> <div> <h2>Lorem ipsum<br></h2> <span class="readmore"><a href="#" onclick="alert(\'More about Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span> <img src="../demo/images/15.jpg"/></div> <div> <h2>Lorem ipsum<br></h2> <span class="readmore"><a href="#" onclick="alert(\'More about Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span><img src="../demo/images/12.jpg"/></div> <div> <h2>Lorem ipsum<br></h2> <span class="readmore"><a href="#" onclick="alert(\'More about Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span><img src="../demo/images/6.jpg"/></div> <div> <h2>Lorem ipsum<br></h2> <span class="readmore"><a href="#" onclick="alert(\'More about Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span><img src="../demo/images/9.jpg"/></div> <div> <h2>Lorem ipsum<br></h2> <span class="readmore"><a href="#" onclick="alert(\'More about Lorem ipsum el dolor sit amet...\'); return false">Read More</a></span><img src="../demo/images/3.jpg"/></div> </div>'

];