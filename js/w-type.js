function game(){
 var g = new GAME.game({
   width: 800,
   height: 600,
   firerate: 10,
   baddie_rate: 0,
   baddie_rate_accel: 10,
   baddie_rate_min: 50
 });
}

if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}