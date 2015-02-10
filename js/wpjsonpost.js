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

// post
window.wpjsonPost = function( objtype, endpoint, filter ) {

	if ( typeof objtype === 'undefined' ) {
		objtype = 'post';
	}
	if ( typeof endpoint === 'undefined' ) {
		endpoint = '';
	}
	if ( typeof filter === 'undefined' ) {
		filter = '';
	}

	var apiurl = root + endpoint + filter;

	var thumbnailBox   = $('#thumbnail-box');
	var entryTitleBox  = $('#primary .entry-header .entry-title');
	var entryBox       = $('#entry-box');
	var entrySNSBox    = $('#primary .sns-btn');
	var entryDateBox   = $('#primary .entry-date time');
	var entryCatsBox   = $('#primary .posted-in-category');
	var entryTagsBox   = $('#primary .posted-in-tags');
	var entryAuthorBox = $('#primary .posted-author');
	var entryFormtBox  = $('#primary .posted-in-post-format');

	var wpjsonObj = $.ajax({
		type: 'GET',
		url:  apiurl
	}).done(function(data, status, xhr) {

		if ( data.length === 0 || data === undefined ) {
			entryBox.children('.loading').html( 'error' );
			location.href = ThemeOption.site_url+ '404';
			return;
		}

		var items = [];

		ID           = data.ID;
		title        = data.title;
		date         = data.date;
		date         = date.substr(0,19) + '+09:00';
		dateja       = post_date_format( date );
		link         = 'http://' + location.hostname + '/post/#!/' + ID;
		content      = data.content;
		thumbnail    = '';
		if ( data.featured_image !== null ) {
			thumbnail = data.featured_image.source;
		}

		// output
		$('title').each(function(){
			var txt = $(this).html();
			$(this).html( txt.replace( /title/g, data.title ) );
		});
		entryTitleBox.html( title );

		if ( thumbnail !== '' ) {
			thumbnailBox.html( '<div class="thumbnail"><img src="'+ thumbnail +'" alt="' + title + '"></div>' );
		} else {
			thumbnailBox.remove();
		}

		entryBox.html( content );

		if ( objtype === 'post' ) {
			// sns entrySNSBox
			var snstitle = data.title + ' | ' + ThemeOption.site_name;
			var snsurl   = link;
			
			entrySNSBox.children('.twitter').attr( 'href', 'http://twitter.com/share?url=' + encodeURI( snsurl ).replace('#', '%23') + '&text=' + encodeURI( snstitle ) );
	
			entrySNSBox.children('.facebook').attr( 'href', 'http://www.facebook.com/share.php?u=' + encodeURI( snsurl ).replace('#', '%23') + '&t=' + snstitle );
	
			// entry date
			entryDateBox.html( dateja );
			entryDateBox.attr( "datetime", date );
	
			// entry categories
			var catitems = [];
			categories   = "";
			if ( data.terms.category !== undefined ) {
				categories = data.terms.category;
			}
			if ( categories ) {
				$.each( categories, function() {
					catlink = 'http://' + location.hostname + '/category/#!/' + this.slug;
					catitems.push( '<a href="' + catlink + '">' + this.name + '</a>' );
				});
				catitems = catitems.join(", ");
				entryCatsBox.children( 'span.cats' ).html( catitems );
			} else {
				entryCatsBox.remove();
			}
	
			// entry tags
			var tagitems = [];
			tags         = '';
			if ( data.terms.post_tag !== undefined ) {
				tags = data.terms.post_tag;
			}
			if ( tags ) {
				$.each( tags, function() {
					taglink = 'http://' + location.hostname + '/tag/#!/' + this.slug;
					tagitems.push( '<a href="' + taglink + '">' + this.name + '</a>' );
				});
				tagitems = tagitems.join(", ");
				entryTagsBox.children( 'span.tags' ).html( tagitems );
			} else {
				entryTagsBox.remove();
			}
	
			// entry author
			authorName = data.author.name;
			entryAuthorBox.children( 'span.author' ).html( authorName );
	
			// post-format //entryFormtBox
			postFormat = data.format;
			postFormathtml = '';
			switch ( postFormat ) {
				case 'aside':
					postFormathtml = '<i class="fa fa-file-text"></i> Aside';
					break;
				case 'gallery':
					postFormathtml = '<i class="fa fa-link"></i> Gallery';
					break;
				case 'link':
					postFormathtml = '<i class="fa fa-link"></i> Link';
					break;
				case 'image':
					postFormathtml = '<i class="fa fa-picture-o"></i> Image';
					break;
				case 'quote':
					postFormathtml = '<i class="fa fa-quote-left"></i> Quote';
					break;
				case 'status':
					postFormathtml = '<i class="fa fa-info"></i> Status';
					break;
				case 'video':
					postFormathtml = '<i class="fa fa-video-camera"></i> Video';
					break;
				case 'audio':
					postFormathtml = '<i class="fa fa-music"></i> Audio';
					break;
				case 'chat':
					postFormathtml = 'i class="fa fa-comments-o"></i> Chat';
					break;
				default:
					postFormathtml = '';
					break;
			}
			if ( postFormathtml ) {
				entryFormtBox.html( postFormathtml );
			} else {
				entryFormtBox.remove();
			}
		}

		// scrollTop
		$('body').scrollTop(0);

	}).fail(function(xhr, status, error) {
		entryBox.children('.loading').html( 'error' );
	});

	return;
};

// Related Posts
window.wpjsonRelated = function( id ) {

	var RelatedArea = $('#related-box');

	if ( typeof id === 'undefined' ) {
		RelatedArea.remove();
		return;
	}

	$.ajax({
		type: 'GET',
		url:  root + 'mak_related/' + id
	}).done(function(data, status, xhr) {
		if ( data.content.length === 0 ) {
			RelatedArea.remove();
			return;
		}
		RelatedArea.html(data.content);

	}).fail(function(xhr, status, error) {
		RelatedArea.remove();
	});

	return;
};
})(jQuery);
