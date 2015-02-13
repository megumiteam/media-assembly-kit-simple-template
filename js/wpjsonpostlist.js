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

// posts
window.wpjsonPosts = function( tax, slug, pagenum ) {

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

	var apiurl  = root + 'posts/';
	var postBox = $('#post-box');
	var moreBox = $('#more-entry');

	// archive
	if ( archive === true ) {
		if ( pagenum === "" ) { // 1page only
			if ( postBox.has( '.loading' ).length < 1 ) {
				postBox.html( '<div class="loading"><i class="fa fa-refresh fa-5x fa-spin"></i><br><span>loading</span></div>' );
			}
			
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
				
				$.ajax({
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

	var pagefilter = '';
	if ( pagenum !== '' ) {
		pagefilter = '?page=' + pagenum;
		if ( apiurl.indexOf('filter') !== -1 ) {
			pagefilter = '&page=' + pagenum;
		}
	}

	$.ajax({
		type: 'GET',
		url:  apiurl + pagefilter
	}).done(function(data, status, xhr) {

		var items = [];
		// posts list
		if ( data.length < 1 ) {
			postBox.html( 'Not Found' );
			return;
		}

		$.each(data, function() {
			date       = this.date;
			date       = date.substr(0,19) + '+09:00';
			dateja     = post_date_format( date );
			link       = 'http://' + location.hostname + '/post/#!/' + this.ID;

			//thumbnail  = 'http://placehold.it/100x70&amp;text=noimage';
			thumbnail  = '';
			if ( this.featured_image !== null && this.featured_image.source !== undefined ) {
				thumbnail = this.featured_image.source;
				if ( this.featured_image.attachment_meta.sizes !== undefined && this.featured_image.attachment_meta.sizes['square-100-image'] !== undefined ) {
					thumbnail = this.featured_image.attachment_meta.sizes['square-100-image'].url;
				}
			}
			if ( thumbnail !== '' ) {
				thumbnail = '<div class="thumbnail"><a href="' + link + '" title="' +  this.title + '" rel="bookmark"><img src="' + thumbnail + '" alt="*"></a></div>';
			}

			categoryArray = '';
			if ( this.terms.category !== undefined ) {
				categoryArray = this.terms.category;
				$.each(categoryArray, function( i ) {
					catlink = 'http://' + location.hostname + '/category/#!/' + this.slug;
					categoryArray[i] = '<a href="' + catlink + '">' + this.name + '</a>';
				});
				categoryArray = categoryArray.join("\n");
			}

			// output
			items.push(
				'<article id="post-' + this.ID + '" class="post hentry has-thumbnail">' +
					thumbnail +
					'<header class="entry-header">' +
						'<h1 class="entry-title"><a href="' + link + '" title="' +  this.title + '" rel="bookmark">' + this.title + '</a></h1>' +
						'<div class="entry-meta">' +
							'<div class="entry-date"><i class="fa fa-calendar"></i><time datetime="' + date + '"><a href="' + link + '">' + dateja + '</a></time></div>' +
							'<div class="posted-in-category"><i class="fa fa-folder-open"></i>' + categoryArray + '</div>' +
						'</div>' +
					'</header>' +
				'</article>'
			);

		});

		items = items.join("\n");
		if ( pagenum === "" ) {
			postBox.html(items);
		} else {
			postBox.children( '.loading' ).remove();
			postBox.append(items);
		}

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
			moreBox.html( '<a href="#" data-tax="' + tax + '" data-slug="' + slug + '" data-pagenum="' + nextpagenum + '">Show More</a>' );
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

	var postBox = $('#post-box');
	postBox.append('<div class="loading"><i class="fa fa-refresh fa-5x fa-spin"></i><br><span>loading</span></div>');
	wpjsonPosts( tax, slug, num );
});


})(jQuery);
