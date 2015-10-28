var browserify = require('browserify');
var gulp = require('gulp');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var minifyHTML = require('gulp-minify-html');
var uglify = require('gulp-uglify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');

// Styles build task, concatenates all the files
gulp.task('styles', function() {
	return gulp.src('css/*.css')
		.pipe(concat('styles.css'))
		.pipe(gulp.dest('build/css'));
});

// JavaScript linting task
gulp.task('jshint', function() {
	return gulp.src('js/**/*.js')
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
	return browserify('js/main.js', {debug: true})
		.bundle()
		.pipe(source('app.js'))
		.pipe(buffer())
		// .pipe(uglify())
		.pipe(gulp.dest('build/js'));
});

// Task to run a live reload server
gulp.task('connect', function() {
	connect.server({
		root: 'build',
		livereload: true
	});
});

// Watch task
gulp.task('watch', function() {
	gulp.watch('js/**/*.js', ['jshint', 'scripts']);
	gulp.watch('index.html', ['html']);
	gulp.watch('css/*.css', ['styles']);
	console.log('Gulp is running...');
});

// Default task
gulp.task('default', ['jshint', 'scripts', 'connect', 'watch']);

// Build task
gulp.task('build', ['styles', 'jshint', 'html', 'scripts']);
