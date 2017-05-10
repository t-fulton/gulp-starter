'use strict';

var gulp         = require('gulp'),
	concat       = require('gulp-concat'),
	uglify       = require('gulp-uglify'),
	rename       = require('gulp-rename'),
	sass         = require('gulp-sass'),
	sourcemaps   = require('gulp-sourcemaps'),
	autoprefixer = require('gulp-autoprefixer'),
	cssnano      = require('gulp-cssnano'),
	del          = require('del'),
	runSequence  = require('run-sequence');

// Concat scripts and create sourcemap
gulp.task('concatScripts', function() {
	return gulp.src([
			'src/js/jquery.js',
			'src/js/main.js'
		])
		.pipe(sourcemaps.init())
		.pipe(concat('app.js'))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('src/js'));
});

// Minify scripts
gulp.task('minifyScripts', ['concatScripts'], function() {
	return gulp.src('src/js/app.js')
		.pipe(uglify())
		.pipe(rename('app.min.js'))
		.pipe(gulp.dest('src/js'));
});

// Compile sass, autoprefix, minify and create sourcemap
gulp.task('compileSass', function() {
	return gulp.src('src/scss/app.scss')
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cssnano())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('src/css'));
});

// Watch files
gulp.task('watchFiles', function() {
	gulp.watch('src/scss/**/*.scss', ['compileSass']);
	gulp.watch('src/js/**/*.js', ['minifyScripts']);
});

// Clean out the dist folder
gulp.task('clean', function() {
	del(['dist', 'css/app.css', 'css/app.css.map', 'js/app.min.js', 'js/app*.map']);
});

// Build out to dist folder
gulp.task('build', [ 'clean', 'minifyScripts', 'compileSass' ], function() {
	return gulp.src([
		'src/js/app.min.js',
		'src/css/app.css',
		'src/index.html',
		'src/img/**'], { base: 'src/'} )
		.pipe(gulp.dest('dist'));
});

// Default dev mode
gulp.task('default', ['watchFiles'])

