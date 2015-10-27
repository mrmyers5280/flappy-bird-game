var browserify = require('browserify');
var gulp = require('gulp');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var minifyHTML = require('gulp-minify-html');
var uglify = require('gulp-uglify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');

// JavaScript linting task
gulp.task('jshint', function() {
	return gulp.src('js/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

// Minify index
gulp.task('html', function() {
	return gulp.src('index.html')
		.pipe(minifyHTML())
		.pipe(gulp.dest('build/'))
		.pipe(connect.reload());
});

// JavaScript build task, removes whitespace and concatenates all files
gulp.task('scripts', function() {
	return browserify('js/main.js')
		.bundle()
		.pipe(source('app.js'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(gulp.dest('build/js'));
});

gulp.task('connect', function() {
	connect.server({
		root: 'build',
		livereload: true
	});
});

// Watch task
gulp.task('watch', function() {
	gulp.watch('site/js/*.js', ['jshint', 'scripts']);
	gulp.watch('site/index.html', ['html']);
	console.log('Gulp is running...');
});

// Default task
gulp.task('default', ['jshint', 'scripts', 'connect', 'watch']);

// Build task
gulp.task('build', ['jshint', 'html', 'scripts', 'images']);
