var gulp           = require('gulp');
var $              = require('gulp-load-plugins')();

// default task
gulp.task( 'default', ['compass', 'js', 'jade'] );

// javascript
gulp.task( 'js', function() {
	// wpjsonroot
	gulp.src( 'js/*.js' )
		.pipe($.jshint())
		.pipe($.jshint.reporter('default'))
});

// compass(sass)
gulp.task( 'compass', function() {
	gulp.src( 'sass/{,*/}{,*/}*.scss' )
		.pipe($.compass({
			sass:      'sass',
			css:       'css',
			image:     'images',
			style:     'expanded',
			relative:  true,
			sourcemap: true,
			comments:  false
		}))
});

// jade
gulp.task('jade', function() {
	gulp.src(['json-template/{,*/}{,*/}*.jade', '!json-template/{,*/}{,*/}_*.jade'])
		.pipe($.jade({
			'pretty': true
		}))
		.pipe(gulp.dest('./'))
});

// watch
gulp.task( 'watch', function () {
	gulp.watch( 'js/{,*/}{,*/}*.js', ['js'] );
	gulp.watch( 'sass/{,*/}{,*/}*.scss', ['compass'] );
	gulp.watch( 'json-template/{,*/}{,*/}*.jade', ['jade'] );
});

