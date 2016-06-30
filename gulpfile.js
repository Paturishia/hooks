'use strict';

const gulp = require('gulp');
const taskListing = require('gulp-task-listing');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync');
const del = require('del');
const runSequence = require('run-sequence');
const eslint = require('gulp-eslint');

// Check for --production flag
const isProduction = false; // TODO: !!(argv.production);

// Port to use for the development server.
const PORT = 8000;

// Browsers to target when prefixing CSS.
// With these selectors, we match Bootstrap's level of browser compatibility
const COMPATIBILITY = [
  "Android 2.3",
  "Android >= 4",
  "Chrome >= 20",
  "Firefox >= 24",
  "Explorer >= 8",
  "iOS >= 6",
  "Opera >= 12",
  "Safari >= 6"
];

// File paths to various assets are defined here.
const PATHS = {
  javascript : [
    'src/assets/javascripts/app.js',
  ],
  stylesheet : [
    'src/assets/stylesheets/app.scss'
  ],
  html: [
    'src/**/*.html'
  ],
  dist: 'dist/'
};

// Add a task to render a help page that lists all available tasks
gulp.task('help', taskListing);

// Clean the dist dir (except for the file .gitkeep and storybook/.gitkeep)
gulp.task('clean', () => {
  return del.sync();
});

// Bundle the app JS by using browserify + babelify
gulp.task('javascripts', () => {
  return gulp.src(PATHS.javascript)
    // Start piping stream to tasks!
    .pipe(gulp.dest(PATHS.dist + 'javascripts'));
});

// Compile Sass into CSS
gulp.task('stylesheets', () => {
  return gulp.src(PATHS.stylesheet)
    .pipe(sass({
      precision: 8, // Minimum Sass number precision required by bootstrap-sass
      outputStyle: isProduction ? 'compressed' : 'nested'
    }))
    .pipe(autoprefixer({
      browsers: COMPATIBILITY
    }))
    .pipe(gulp.dest(PATHS.dist + 'stylesheets'));
});

// Simply move html files from src to dist
gulp.task('html', () => {
  return gulp.src(PATHS.html)
    .pipe(gulp.dest(PATHS.dist));
});

gulp.task('lint', () => {
  return gulp.src(PATHS.javascript)
    .pipe(eslint())
    // Use the default "stylish" ESLint formatter
    .pipe(eslint.format())
    // Stop a task/stream if an ESLint error has been reported for any file, but wait for all of them to be processed first.
    .pipe(eslint.failAfterError());
});

// Build the site
gulp.task('build', (callback) => {
  return runSequence(
    'clean',
    [
      'lint',
      'javascripts',
      'stylesheets',
      'html'
    ],
    callback
  );
});

// Start a server with LiveReload to preview the site in
gulp.task('server', ['build'], () => {
  browserSync.init({
    server: 'dist', port: PORT
  });
});

// Build the site, run the server
gulp.task('default', ['build', 'server']);

// Build the site, run the server, and watch for file changes
gulp.task('dev', ['build', 'server'], () => {
  gulp.watch(PATHS.javascript, ['lint', 'javascripts', browserSync.reload]);
  gulp.watch(PATHS.stylesheet, ['stylesheets', browserSync.reload]);
  gulp.watch(PATHS.html, ['html', browserSync.reload]);
});
