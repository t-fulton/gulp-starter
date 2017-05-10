var gulp = require('gulp'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync').create(),
	useref = require('gulp-useref'),
	uglify = require('gulp-uglify'),
	gulpIf = require('gulp-if'),
	cssnano = require('gulp-cssnano'),
	imagemin = require('gulp-imagemin'),
	cache = require('gulp-cache'),
	del = require('del'),
	runSequence = require('run-sequence');

// Sass
gulp.task('sass', function() {
	return gulp.src('app/scss/**/*.scss')
	.pipe(sass())
	.pipe(gulp.dest('app/css/'))
	.pipe(browserSync.reload({
		stream: true
	}))
});

// BrowserSync
gulp.task('browserSync',function() {
	browserSync.init({
		server: {
			baseDir: 'app'
		}
	})
});

// JS, Concat, minify and put in dist folder
gulp.task('useref', function() {
	return gulp.src('app/*.html')
		.pipe(useref())
		// Minifies only if it's a JS file
		.pipe(gulpIf('*.js', uglify()))
		// Minifies only if it's a CSS file
		.pipe(gulpIf('*.css', cssnano()))
		.pipe(gulp.dest('dist'))
});

// Minify Images
gulp.task('images', function() {
	return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
		.pipe(cache(imagemin()))
		.pipe(gulp.dest('dist/images'))
});	

// Move fonts to dist
gulp.task('fonts', function() {
	return gulp.src('app/fonts/**/*')
		.pipe(gulp.dest('dist/fonts'))
});

// Da cleaner
gulp.task('clean:dist', function() {
	return del.sync('dist');
});

// Clear cache off local system (images)
gulp.task('cache:clear', function(cb) {
	return cache.clearAll(cb)
});

// Watch
gulp.task('watch', ['browserSync', 'sass'], function() {
	gulp.watch('app/scss/**/*.scss', ['sass']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
});

// Build
gulp.task('build', function(cb) {
	runSequence('clean:dist',
		[ 'sass', 'useref', 'images', 'fonts' ],
		cb
	)
});

// Default
gulp.task('default', function(cb) {
	runSequence(['sass', 'browserSync', 'watch'],
	cb
	)
});
