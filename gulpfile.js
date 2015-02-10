var gulp           = require('gulp');
var $              = require('gulp-load-plugins')();

// default task
gulp.task( 'default', ['compass', 'js', 'jade'] );

// javascript
gulp.task( 'js', function() {
	// wpjsonroot
	gulp.src( 'js/wpjsonroot.js' )
		.pipe($.jshint())
		.pipe($.jshint.reporter('default'))
		.pipe($.concat('wpjsonroot.min.js'))
		.pipe($.uglify())
		.pipe(gulp.dest('../../../assets/js'))
	// wpjsonpostlist
	gulp.src( 'js/wpjsonpostlist.js' )
		.pipe($.jshint())
		.pipe($.jshint.reporter('default'))
		.pipe($.concat('wpjsonpostlist.min.js'))
		.pipe($.uglify())
		.pipe(gulp.dest('../../../assets/js'))
	// wpjsonpost
	gulp.src( 'js/wpjsonpost.js' )
		.pipe($.jshint())
		.pipe($.jshint.reporter('default'))
		.pipe($.concat('wpjsonpost.min.js'))
		.pipe($.uglify())
		.pipe(gulp.dest('../../../assets/js'))
	// wpjsonranking
	gulp.src( 'js/wpjsonranking.js' )
		.pipe($.jshint())
		.pipe($.jshint.reporter('default'))
		.pipe($.concat('wpjsonranking.min.js'))
		.pipe($.uglify())
		.pipe(gulp.dest('../../../assets/js'))
	// app
	gulp.src( 'js/app.js' )
		.pipe($.jshint())
		.pipe($.jshint.reporter('default'))
		.pipe($.concat('app.min.js'))
		.pipe($.uglify())
		.pipe(gulp.dest('../../../assets/js'))

});

// compass(sass)
gulp.task( 'compass', function() {
	gulp.src( 'sass/{,*/}{,*/}*.scss' )
		.pipe($.compass({
			sass:      'sass',
			css:       '../../../assets/css',
			image:     '../../../assets/images',
			style:     'expanded',//compressed
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
		.pipe(gulp.dest('../../../json-template/'))
});

// watch
gulp.task( 'watch', function () {
	gulp.watch( 'js/{,*/}{,*/}*.js', ['js'] );
	gulp.watch( 'sass/{,*/}{,*/}*.scss', ['compass'] );
	gulp.watch( 'json-template/{,*/}{,*/}*.jade', ['jade'] );
});


// Test
gulp.task('test', function() {
  // PC
  gulp.src(['../../../json-template/search.html', '../../../json-template/404.html'])
    .pipe(gulp.dest('../../../test/'))
  gulp.src('../../../json-template/index.html')
    .pipe(gulp.dest('../../../test/'))
  gulp.src('../../../json-template/category.html')
    .pipe($.concat('index.html'))
    .pipe(gulp.dest('../../../test/category/'))
  gulp.src('../../../json-template/tag.html')
    .pipe($.concat('index.html'))
    .pipe(gulp.dest('../../../test/tag/'))
  gulp.src('../../../json-template/post.html')
    .pipe($.concat('index.html'))
    .pipe(gulp.dest('../../../test/post/'))
  gulp.src('../../../json-template/page.html')
    .pipe($.concat('index.html'))
    .pipe(gulp.dest('../../../test/page/'))
});

