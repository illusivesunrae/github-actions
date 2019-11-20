const { dest, series, src, watch } = require('gulp');
const { eslint } = require('rollup-plugin-eslint');
const autoprefixer = require('autoprefixer');
const babel = require('rollup-plugin-babel');
const browserSync = require('browser-sync').create();
const commonJS = require('rollup-plugin-commonjs');
const cp = require('child_process');
const cssnano = require('gulp-cssnano');
const gutil = require('gulp-util');
const header = require('gulp-header');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const rollup = require('rollup');
const sass = require('gulp-sass');
const stylelint = require("gulp-stylelint");
const uglify = require('gulp-uglify');
const package = require('./package.json');

// Create the string for the verion number banner.
const banner = `/*!
* ${package.name} - @version ${package.version}

* Copyright (C) 2019 Rachel O'Connor
* SPDX-License-Identifier: BSD-3-Clause
*/

`;

// Development server
function watchFiles(callback) {
  browserSync.init(['docs/css/**/*.css', 'docs/js/**/*.js', 'docs/**/*.html'], {
    server: {
      baseDir: './docs'
    }
  });
  watch('src/sass/**/*.scss', { ignoreInitial: false }, series(lintSassWatch, compileSass));
  watch('src/js/**/*.js', { ignoreInitial: false }, compileJSDev);

  callback();
}

/**
 * Using Eleventy static site generator to compile Markdown docs
 * into HTML for testing/demo purposes. Uses the Nunjuck templates
 * inside './src/_includes` for layout.
 *
 * More about Eleventy here:
 * https://www.11ty.io/docs/
 *
 * More about Nunjucks here:
 * https://mozilla.github.io/nunjucks/
 */
function compileHTML(callback) {
  cp.exec('npx eleventy', function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    callback(err);
  });
}

function watchHTML(callback) {
  const eleventy = cp.spawn('npx', ['eleventy', '--watch']);

  const eleventyLogger = function(buffer) {
    buffer
      .toString()
      .split(/\n/)
      .forEach(message => gutil.log('Eleventy: ' + message));
  };
  eleventy.stdout.on('data', eleventyLogger);
  eleventy.stderr.on('data', eleventyLogger);

  callback();
}

function compileSass() {
  return src('src/sass/**/*.scss')
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(dest('docs/css/'));
}

function lintSassWatch() {
  return src("src/sass/**/*.scss")
  .pipe(stylelint({
    failAfterError: false,
    reporters: [
      {formatter: 'string', console: true}
    ]
  }));
}

function lintSassBuild() {
  return src("src/sass/**/*.scss")
  .pipe(stylelint({
    reporters: [
      {formatter: 'string', console: true}
    ]
  }));
}

/**
 * Uses Rollup to compile ES6 down to browser JS with a UMD wrapper.
 * See more here:
 * https://rollupjs.org/guide/en#gulp
 */
function compileJSDev() {
  return rollup
    .rollup({
      input: './src/js/index.js',
      plugins: [eslint({ throwOnError: false }), commonJS(), babel({ runtimeHelpers: true })]
    })
    .then(bundle => {
      return bundle.write({
        file: './docs/js/' + package.name + '-iife.js',
        format: 'iife',
        name: package.addOnName,
      });
    });
}

async function compileJSBuild() {
  const bundle = await rollup.rollup({
    input: './src/js/index.js',
    plugins: [eslint({ throwOnError: true }), commonJS(), babel({ runtimeHelpers: true })]
  });

  await bundle.write({
    file: './docs/js/' + package.name + '-iife.js',
    format: 'iife',
    name: package.addOnName
  });
  
  await bundle.write({
    file: './docs/js/' + package.name + '-esm.js',
    format: 'es',
    name: package.addOnName
  });
};

function copyJS() {
  return src('./docs/js/**/*.js').pipe(dest('./dist/js/'));
}

function headerJS(callback) {
  src('./dist/js/' + package.name + '-iife.js')
    .pipe(header(banner, { package: package }))
    .pipe(dest('./dist/js/'));

  src('./dist/js/' + package.name + '-esm.js')
    .pipe(header(banner, { package: package }))
    .pipe(dest('./dist/js/'));

  src('./dist/js/' + package.name + '.min.js')
    .pipe(header(banner, { package: package }))
    .pipe(dest('./dist/js/'));

  callback();
}

function minifyJS() {
  return src('dist/js/' + package.name + '-iife.js')
    .pipe(uglify())
    .pipe(rename({ basename: package.name, suffix: '.min' }))
    .pipe(dest('dist/js'));
}

function copyCSS() {
  return src('./docs/css/**/*.css').pipe(dest('./dist/css/'));
}

function minifyCSS() {
  return src('dist/css/' + package.name + '.css')
    .pipe(cssnano())
    .pipe(
      rename({
        suffix: '.min'
      })
    )
    .pipe(dest('dist/css/'));
}

function prefixCSS() {
  return src('dist/css/' + package.name + '.css')
    .pipe(postcss([autoprefixer()]))
    .pipe(dest('dist/css/'));
}

function headerCSS(callback) {
  src('dist/css/' + package.name + '.css')
    .pipe(header(banner, { package: package }))
    .pipe(dest('dist/css/'));

  src('dist/css/' + package.name + '.min.css')
    .pipe(header(banner, { package: package }))
    .pipe(dest('dist/css/'));

  callback();
}

// Builds the "dist" folder with compiled and minified CSS & JS
exports.release = series(
  compileJSBuild,
  copyJS,
  minifyJS,
  headerJS,
  lintSassBuild,
  compileSass,
  copyCSS,
  prefixCSS,
  minifyCSS,
  headerCSS
);

exports.buildDocs = series(compileHTML, compileSass, compileJSDev);

// Default development task
exports.default = series(watchFiles, watchHTML);
