var spawn = require('child_process').spawn;

var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');

var node;
var paths = {
  scripts: ['main.js', 'src/**/*.js'],
};

/**
 * $ gulp scripts
 * description: transpiles ES6 files into ES5 using Babel and create sourcemaps.
 */
gulp.task('scripts', function() {
  return gulp.src('src/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
});

/**
 * $ gulp server
 * description: launch the server. If there's a server already running, kill it.
 */
gulp.task('server', function() {
  if (node) node.kill();

  node = spawn('node', ['./bin/www'], {stdio: 'inherit'});

  node.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
});

/**
 * $ gulp
 * description: start the development environment
 */
gulp.task('default', function() {
  gulp.run('server');
  gulp.watch(paths.scripts, ['scripts', 'server']);
});

// clean up if an error goes unhandled.
process.on('exit', function() {
  if (node) {
    node.kill();
  }
});