var gulp = require('gulp'),
  ccat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  shell = require('gulp-shell'),
  rename = require('gulp-rename'),
  spritesmith = require('gulp.spritesmith');
const { series } = require('gulp');

function concatJs() {
  return gulp.src([
    'js/tween.min.js',
    'bower_components/fastclick/lib/fastclick.js',
    'bower_components/pixi.js/bin/pixi.js',
    'node_modules/sprintf-js/dist/sprintf.min.js',
    'w-type/game.js',
    'w-type/gameElement.js',
    'w-type/scoreBoard.js',
    'w-type/topScores.js',
    'w-type/lifeBar.js',
    'w-type/mech.js',
    'w-type/baddy.js',
    'w-type/baddyTweened.js',
    'w-type/bullet.js',
    'w-type/star.js',
    'w-type/title.js',
    'w-type/touchControl.js',
    'w-type/keyboardControl.js',
    'js/w-type.js'])
    .pipe(ccat('w-type.js'))
    //.pipe(uglify())
    .pipe(gulp.dest('dist'))
    .pipe(gulp.dest('cordova/www/'));
}

gulp.task('prep-html', function(){
  return gulp.src('base_html.html')
    .pipe(rename('index.html'))
    .pipe(gulp.dest('dist'));
});

gulp.task('copy-sprite', function(){
  return gulp.src(['img/SpriteSheet.json', 'img/SpriteSheet.png', 'img/page.jpg'])
  .pipe(gulp.dest('dist/img/'))
  .pipe(gulp.dest('dist-android/img/'));
});

gulp.task('prep-sprite', function () {
  return gulp.src('assets/sprite/*.png')
    .pipe(spritesmith({
      imgName: "SpriteSheet.png",
      cssName: "SpriteSheet.json",
      algorithm: 'diagonal',
        cssTemplate: require('spritesmith-texturepacker') // <-- this right here
      }))
    .pipe(gulp.dest('./img/'));
});

gulp.task('copy-style', function(){
  return gulp.src(['assets/misaki/**/*'], {base: 'assets'})
    .pipe(gulp.dest('style'));
});

gulp.task('copy-fonts', function(){
  return gulp.src(['assets/misaki/**/*'], {base: 'assets'})
  .pipe(gulp.dest('dist/style'))
  .pipe(gulp.dest('dist-android/style'));
});


const x = 1+1;
gulp.task(
  'prep-cordova',
  function(){
    console.log('prep cordova', ['prep-js', 'copy-sprite', 'copy-fonts', 'copy-cordova-index', 'copy-cordova-js']);
  }
);

gulp.task('copy-cordova-index', function(){
  return gulp.src(['index-cordova.html'])
    .pipe(rename('index.html'))
    .pipe(gulp.dest('dist-android'));
});

gulp.task('copy-cordova-js', function(){
  return gulp.src(['index-cordova.js'])
    .pipe(gulp.dest('dist-android'));
});

gulp.task('default', function() {
  const runme = [
    'prep-js',
    'prep-html',
    'prep-sprite',
    'prep-cordova',
    'copy-sprite',
    'copy-style',
    'build-style'
  ];
  console.log(gulp.task);
  gulp.series()
});

function xx(){return console.log('derpo')};

function defaultTask() {
  console.log("i am derp");
  
  return gulp.series(xx);
}

exports.default = concatJs;