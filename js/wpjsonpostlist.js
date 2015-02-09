var root = 'http://' + location.hostname + '/wp-json/';
/**
 * ハッシュ監視クラス(static class)
 */
var HashObserve = {
	funcList: [],   // ハッシュ変更時に実行する関数リスト
	prevHash: "",   // 前回のハッシュ
	
	/**
	 * 監視
	 */
	observe: function() {
		// 前回のハッシュと比較
		if (HashObserve.prevHash!==window.location.hash) {
			// 登録されている関数を実行
			for (var i=0; i<HashObserve.funcList.length; ++i) {
				HashObserve.funcList[i](window.location.hash, HashObserve.prevHash);
			}
			// 前回のハッシュを更新
			HashObserve.prevHash=window.location.hash;
		}
	},
	
	/**
	 * ハッシュ変更時に実行する関数を登録
	 * @param {Object} fn
	 */
	addFunc: function(fn) {
		HashObserve.funcList.push(fn);
	}
};

(function($){

var ThemeOption = wpjsonThemeOption();

// Date Format
function post_date_format( date ) {
	var toDoubleDigits = function(num) {
		num += "";
		if (num.length === 1) {
			num = "0" + num;
		}
		return num;
	};

	var jdate = date.substr(0,19);
	    jdate = jdate + '+09:00';

	var post_date = new Date( jdate );
	var yyyy = post_date.getFullYear();
	var mm   = toDoubleDigits(post_date.getMonth() + 1);
	var dd   = toDoubleDigits(post_date.getDate());
	var hh   = toDoubleDigits(post_date.getHours());
	var mi   = toDoubleDigits(post_date.getMinutes());

	post_date =  yyyy + '.' + mm + "." + dd + " " + hh + ":" + mi;

	return post_date;
}

// posts
window.wpjsonPosts = function( tax, slug, pagenum, home ) {

	var archive = true;
	if ( typeof tax === 'undefined' || tax === '' ) {
		tax = '';
		archive = false;
	}
	if ( typeof slug === 'undefined' || slug === '' ) {
		slug = '';
		archive = false;
	}

	if ( typeof pagenum === 'undefined' || page === '' ) {
		pagenum = '';
	}

	if ( typeof home === 'undefined' ) {
		home = false;
	}
	var home_posts_per_page = '';
	if ( home === true ) {
		home_posts_per_page = '?filter[posts_per_page]=' + ThemeOption.home_posts_per_page;
	}
	var apiurl = root + 'posts/' + home_posts_per_page;

	// archive
	if ( archive === true ) {
		if ( pagenum === "" ) { // 1page only
			if ( tax === 's' ) {
				var stitle = decodeURIComponent( slug );
					stitle = stitle.replace( /\+/g, ' ' );
				$('title').each(function(){
					var txt = $(this).html();
					$(this).html( txt.replace( /Search/g, stitle + 'の検索結果' ) );
				});
				$('#primary .page-header .page-title').html( stitle + 'の検索結果' );
			} else {
				var taxonomy = tax;
				if ( tax === 'tag' ) {
					taxonomy = 'post_tag';
				}
				
				var wpjsonTaxObj = $.ajax({
					type: 'GET',
					url:  root + 'taxonomies/' + taxonomy + '/terms/'
				}).done(function(data, status, xhr) {
	
					// posts list
					if ( data.length === 0 ) {
						console.log( 'wpjsonTaxObj length 0' );
						return;
					}
	
					var categoryID   = '';
					var categoryName = '';
					var categoryDesc = '';
	
					$.each(data, function() {
	
						if ( slug === this.slug ) {
							categoryID   = this.ID;
							categoryName = this.name;
							categoryDesc = this.description;
						} else {
							return;
						}
	
						// output
						if ( categoryName !== '' ) {
							$('title').each(function(){
								var txt = $(this).html();
								$(this).html( txt.replace( /[^\s|\s]+(\s\|\s)+(.+)/g, categoryName + " | $2" ) );
							});
							$('#primary .page-header .page-title').html( categoryName );
						}
						if ( categoryDesc !== '' ) {
							categoryDesc = categoryDesc.replace(/(\r\n|\r|\n)/g, "<br>");
							$('#primary .page-header .page-description p').html( categoryDesc );
						}
	
					});
	
				}).fail(function(xhr, status, error) {
					console.log( 'wpjsonTaxObj fail' );
					return;
				});
			}
		}

		// next api
		if ( tax === 'category' ) {
			tax = 'category_name';
		}
		apiurl = root + 'posts?filter[' + tax + ']=' + slug;
	}

	var postBox = $('#post-box');
	var moreBox = $('#more-entry');

	var pagefilter = '';
	if ( pagenum !== '' ) {
		pagefilter = '?page=' + pagenum;
		if ( apiurl.indexOf('filter') !== -1 ) {
			pagefilter = '&page=' + pagenum;
		}
	}

	var wpjsonObj = $.ajax({
		type: 'GET',
		url:  apiurl + pagefilter
	}).done(function(data, status, xhr) {

		var items = [];
		// posts list
		if ( data.length < 1 ) {
			postBox.html( 'Not Found' );
			return;
		}

		$.each(data, function( i ) {
			date       = this.date;
			date       = date.substr(0,19) + '+09:00';
			dateja     = post_date_format( date );
			//thumbnail  = 'http://placehold.it/100x70&amp;text=noimage';
			thumbnail  = '';
			if ( this.featured_image !== null && this.featured_image.source !== undefined ) {
				thumbnail = this.featured_image.source;
				if ( this.featured_image.attachment_meta.sizes !== undefined && this.featured_image.attachment_meta.sizes['square-100-image'] !== undefined ) {
					thumbnail = this.featured_image.attachment_meta.sizes['square-100-image'].url;
				}
			}
			if ( thumbnail !== '' ) {
				thumbnail = '<div class="thumbnail"><a href="' + this.link + '" title="' +  this.title + '" rel="bookmark"><img src="' + thumbnail + '" alt="*"></a></div>';
			}
			categoryArray = '';
			if ( this.terms.category !== undefined ) {
				categoryArray = this.terms.category;
				$.each(categoryArray, function( i ) {
					categoryArray[i] = '<a href="' + this.link + '">' + this.name + '</a>';
				});
				categoryArray = categoryArray.join("\n");
			}

			// output
			items.push(
				'<div id="post-' + this.ID + '" class="post hentry has-thumbnail">' +
					thumbnail +
					'<div class="entry-header">' +
						'<h1 class="entry-title"><a href="' + this.link + '" title="' +  this.title + '" rel="bookmark">' + this.title + '</a></h1>' +
						'<div class="entry-meta">' +
							'<div class="entry-date"><i class="fa fa-calendar"></i><time datetime="' + date + '"><a href="' + this.link + '">' + dateja + '</a></time></div>' +
							'<div class="posted-in-category"><i class="fa fa-folder-open"></i>' + categoryArray + '</div>' +
						'</div>' +
					'</div>' +
				'</div>'
			);

		});

		items = items.join("\n");
		postBox.children( '.loading' ).remove();
		postBox.append(items);

		// page link
		var nextpagenum = "";
		var TotalPages  = xhr.getResponseHeader('X-WP-TotalPages');
		if ( pagenum === '' ) {
			pagenum = 1;
		}
		if ( TotalPages > 1 && pagenum < TotalPages ) {
			nextpagenum = parseInt(pagenum) + 1;
			if ( tax === 'category_name' ) {
				tax = 'category';
			}
			moreBox.html( '<a href="#" data-tax="' + tax + '" data-slug="' + slug + '" data-pagenum="' + nextpagenum + '" data-home="' + home + '">Show More</a>' );
		} else {
			moreBox.remove();
		}

		// after
		//$( "html,body" ).scrollTop(0);

	}).fail(function(xhr, status, error) {
		postBox.children('.loading').html( 'error' );
	});

	return;
	
};

// more
$( '#more-entry' ).on('click', 'a', function(e) {
	e.preventDefault();

	var tax  = $(this).attr('data-tax');
	var slug = $(this).attr('data-slug');
	var num  = $(this).attr('data-pagenum');
	var home = $(this).attr('data-slug');

	var postBox = $('#post-box');
	postBox.append('<div class="loading"><i class="fa fa-refresh fa-5x fa-spin"></i><br><span>loading</span></div>');
	wpjsonPosts( tax, slug, num, home );
});


})(jQuery);
