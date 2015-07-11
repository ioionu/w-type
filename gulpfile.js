var gulp = require('gulp'), ccat = require('gulp-concat'), uglify = require('gulp-uglify');


gulp.task('prep-js', function(){
  return gulp.src([
    'js/tween.min.js',
    'bower_components/fastclick/lib/fastclick.js',
    'bower_components/pixi.js/bin/pixi.js',
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
    .pipe(ccat('concat.js'))
    //.pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('prep-html', function(){
  return gulp.src('base_html.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['prep-js', 'prep-html'], function() {});
