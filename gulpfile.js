var gulp = require('gulp');
var cp = require('child_process');
var runSequence = require('run-sequence').use(gulp);
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var babel = require('gulp-babel');

/* ------------------------------------------------------------------------------
   -------------------------- Copy tasks ----------------------------------------
   ----------------------------------------------------------------------------*/

// Copy from the .tmp to _site directory.
// To reduce build times the assets are compiles at the same time as jekyll
// renders the site. Once the rendering has finished the assets are copied.
gulp.task('copy:assets', function (done) {
  return gulp.src('.tmp/assets/**')
    .pipe(gulp.dest('_site/assets'));
});

/* ------------------------------------------------------------------------------
   --------------------------- Assets tasks -------------------------------------
   ----------------------------------------------------------------------------*/

   var sassInput = 'app/assets/styles/*.scss';
   var sassOptions = {
     includePaths: ['node_modules/foundation-sites/scss','node_modules/font-awesome/scss','.tmp/assets/styles' ],
     errLogToConsole: true,
     outputStyle: 'expanded'
   };
   var autoprefixerOptions = {
     browsers: ['last 2 versions', 'ie >= 9', 'and_chr >= 2.3']
   };

   gulp.task('sass', function() {
     return gulp.src(sassInput)
       .pipe(plumber())
       .pipe(sourcemaps.init())
       .pipe(sass(sassOptions).on('error', sass.logError))
       .pipe(autoprefixer(autoprefixerOptions))
       .pipe(sourcemaps.write('.'))
       .pipe(browserSync.reload({stream:true}))
       .pipe(gulp.dest('.tmp/assets/styles'));
   });

gulp.task('compress:main', function () {
  // main.min.js
  var task = gulp.src([
    'app/assets/scripts/*.js'
  ])
  .pipe(babel({
    presets: ['es2015']
  }))
  .pipe(concat('main.min.js')); //hotfix

  // if (environment === 'development') {
  //   task = task.pipe(concat('main.min.js'));
  // } else {
  //   task = task.pipe(uglify('main.min.js', {
  //     outSourceMap: true,
  //     mangle: false
  //   }));
  // }

  return task.pipe(gulp.dest('.tmp/assets/scripts'));
});

gulp.task('compress:vendor', function () {
  // vendor.min.js
  var task = gulp.src([
    'app/assets/scripts/vendor/*.js'
  ])
  .pipe(concat('vendor.min.js')); //hotfix

  // if (environment === 'development') {
  //   task = task.pipe(concat('vendor.min.js'));
  // } else {
  //   task = task.pipe(uglify('vendor.min.js', {
  //     outSourceMap: true,
  //     mangle: false
  //   }));
  // }

  return task.pipe(gulp.dest('.tmp/assets/scripts'));
});

// Build the jekyll website.
gulp.task('jekyll', function (done) {
  var args = ['exec', 'jekyll', 'build'];

  switch (environment) {
    case 'development':
      args.push('--config=_config.yml,_config-dev.yml');
      break;
    case 'stage':
      args.push('--config=_config.yml,_config-stage.yml');
      break;
    case 'production':
      args.push('--config=_config.yml');
      break;
  }

  return cp.spawn('bundle', args, {stdio: 'inherit'})
    .on('close', done);
});

// Copies fonts
gulp.task('fonts', function () {
  return gulp.src('app/assets/fonts/**/*')
    .pipe(gulp.dest('.tmp/assets/styles/fonts'));
});

// Build the jekyll website.
// Reload all the browsers.
gulp.task('jekyll:rebuild', ['jekyll'], function () {
  browserSync.reload();
});

// Main build task
// Builds the site. Destination --> _site
gulp.task('build', function (done) {
  runSequence(['jekyll', 'compress:main', 'compress:vendor', 'sass', 'fonts'], ['copy:assets'], done);
});

// Default task.
gulp.task('default', function (done) {
  runSequence('build', done);
});

gulp.task('serve', ['build'], function () {
  browserSync({
    port: 3000,
    server: {
      baseDir: ['.tmp', '_site']
    }
  });

  gulp.watch(['./app/assets/fonts/**/*', './app/assets/images/**/*'], function () {
    runSequence('jekyll', 'build', browserReload);
  });

  gulp.watch('app/assets/styles/**/*.scss', function () {
    runSequence('sass');
  });

  gulp.watch(['./app/assets/scripts/**/*.js', '!./app/assets/scripts/vendor/**/*'], function () {
    runSequence('compress:main', 'compress:vendor', browserReload);
  });

  gulp.watch(['app/**/*.html', 'app/**/*.md', 'app/**/*.json', 'app/**/*.geojson', '_config*'], function () {
    runSequence('jekyll', browserReload);
  });
});

var shouldReload = true;
gulp.task('no-reload', function (done) {
  shouldReload = false;
  runSequence('serve', done);
});

var environment = 'development';
gulp.task('prod', function (done) {
  environment = 'production';
  runSequence('clean', 'build', done);
});
gulp.task('stage', function (done) {
  environment = 'stage';
  runSequence('clean', 'build', done);
});

// Removes jekyll's _site folder
gulp.task('clean', function () {
  return gulp.src(['_site', '.tmp'], {read: false})
    .pipe(clean());
});

/* ------------------------------------------------------------------------------
   --------------------------- Helper functions ---------------------------------
   ----------------------------------------------------------------------------*/

function browserReload () {
  if (shouldReload) {
    browserSync.reload();
  }
}
