// Require gulp
var gulp = require('gulp');

// Load plug-ins from package.json
var $ = require('gulp-load-plugins')();

/*
	Implements 'connect' task
	Starts a web server using grunt‐contrib‐connect plug‐in.
*/
gulp.task('connect', function() {
	var connect = require('connect');
	var serveStatic = require('serve-static');
	var serveIndex = require('serve-index');
	
	var app = connect()
		.use(require('connect-livereload')({ port: 35729 }))
		.use(serveStatic('app'))
		.use(serveIndex('app'));
	
	require('http')
		.createServer(app)
		.listen(9000)
		.on('listening', function() {
			console.log('Started connect web server on http://localhost:9000');
		});
});

/*
	Implements 'less' task.
	Compiles Less files into CSS styles using gulp-less plug-in.
	- gulp.src returns file structure stream to be piped to less and dest
	- process file stream with gulp‐less plug‐in, namespaced under $ variable
	- writes file stream into a file, creates missing folders, if any
*/
gulp.task('less', function() {
	return gulp.src('app/*.less')
		.pipe($.less({ paths: 'app'}))
		.pipe(gulp.dest('app'));
});

/*
	'jshint' task for linting JS files
*/
gulp.task('jshint', function() {
	return gulp.src('app/*.js')
		.pipe($.jshint())
		.pipe($.jshint.reporter(require('jshint-stylish')));
});

/*
	'watch' task for responding to file modifications
*/
gulp.task('watch', function() {
	// Start a livereload server on default port 35729
	$.livereload.listen();

	// Watch for changes and notify LR server
	gulp.watch([
		'app/*.html',
		'app/*.css',
		'app/*.js']
	).on('change', function(file) {
		$.livereload.changed(file.path);
	});

	// Run gulp tasks on specified file changes
	gulp.watch('app/*.js', ['jshint']);
	gulp.watch('app/*.less', ['less']);
});

// Default task - run with 'gulp'
gulp.task('default', ['connect', 'watch'], function() {
	require('opn')('http://localhost:9000');
});