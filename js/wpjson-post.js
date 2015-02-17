/*!
 * mak-simple - v0.1.0
 *
 * https://www.digitalcube.jp/
 *
 * Copyright 2014, DigitalCube Co.,Ltd (https://www.digitalcube.jp/)
 * Released under the GNU General Public License v2 or later
 */

(function($){
var ThemeOption = wpjsonThemeOption();

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

	var apiurl = apiroot + endpoint + filter;

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
		link         = siteroot + 'post/#!/' + ID;
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
					catlink = siteroot + 'category/#!/' + this.slug;
					catitems.push( '<a href="' + catlink + '">' + this.name + '</a>' );
				});
				catitems = catitems.join(", ");
				entryCatsBox.children( 'span.cats' ).html( catitems );
			}
	
			// entry tags
			var tagitems = [];
			tags         = '';
			if ( data.terms.post_tag !== undefined ) {
				tags = data.terms.post_tag;
			}
			if ( tags ) {
				$.each( tags, function() {
					taglink = siteroot + 'tag/#!/' + this.slug;
					tagitems.push( '<a href="' + taglink + '">' + this.name + '</a>' );
				});
				tagitems = tagitems.join(", ");
				entryTagsBox.children( 'span.tags' ).html( tagitems );
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
					postFormathtml = '<i class="fa fa-picture-o"></i> Gallery';
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

	if ( typeof id === 'undefined' ) {
		return;
	}

	var RelatedArea = $('#related-box');
	var items = [];
	$.ajax({
		type: 'GET',
		url:  apiroot + 'sirp_related/' + id
	}).done(function(data, status, xhr) {
		if ( data.length === 0 ) {
			return;
		}
		$.each(data, function() {
			
			date          = this.date;
			date          = date.substr(0,19) + '+09:00';
			dateja        = post_date_format( date );
			link          = siteroot + 'post/#!/' + this.ID;

			thumbnail  = 'http://placehold.it/320x200&amp;text=noimage';
			if ( this.featured_image !== null && this.featured_image.source !== undefined ) {
				thumbnail = this.featured_image.source;
				if ( this.featured_image.attachment_meta.sizes !== undefined && this.featured_image.attachment_meta.sizes['square-320-image'] !== undefined ) {
					thumbnail = this.featured_image.attachment_meta.sizes['square-320-image'].url;
				}
			}
			if ( thumbnail !== '' ) {
				thumbnail = '<div class="thumbnail"><img src="' + thumbnail + '" alt="*"></div>';
			}

			// output
			items.push(
				'<li id="post-' + this.ID + '" class="post hentry thumbnail-true">' +
					'<a href="' + link + '" title="' +  this.title + '" rel="bookmark">' +
						thumbnail +
						'<div class="entry-title">' + this.title + '</div>' +
					'</div>' +
					'</a>' +
				'</li>'
			);
		});

		items = items.join("\n");
		RelatedArea.html( '<h1 class="widget-title">Related posts</h1><ul class="post-list">' + items + '</ul>');

	});

	return;
};
})(jQuery);
