/*!
 * mak-simple - v0.1.0
 *
 * https://www.digitalcube.jp/
 *
 * Copyright 2014, DigitalCube Co.,Ltd (https://www.digitalcube.jp/)
 * Released under the GNU General Public License v2 or later
 */

(function($){


// Ranking Posts
window.wpjsonRanking = function() {

	var RankingArea = $('#ranking-box');
	var items = [];
	$.ajax({
		type: 'GET',
		url:  apiroot + 'ranking'
	}).done(function(data, status, xhr) {

		if ( data.length === 0 ) {
			RankingArea.html('');
			return;
		}

		$.each(data, function( i ) {
			date          = this.date;
			date          = date.substr(0,19) + '+09:00';
			dateja        = post_date_format( date );
			link          = siteroot + 'post/#!/' + this.ID;
			rank          = parseInt(i + 1);

			categoryArray = '';
			if ( this.terms.category !== undefined ) {
				categoryArray = this.terms.category;
				$.each(categoryArray, function( i ) {
					catlink = siteroot + 'category/#!/' + this.slug;
					categoryArray[i] = '<a href="' + catlink + '">' + this.name + '</a>';
				});
				categoryArray = categoryArray.join("\n");
			}

			// output
			items.push(
				'<article id="post-' + this.ID + '" class="post hentry">' +
					'<div class="entry-rank">' + rank + '.</div>' +
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

		items = items.join( "\n" );
		RankingArea.html( '<h1 class="widget-title">Ranking</h1>' + items );

	}).fail(function(xhr, status, error) {
		RankingArea.html('');
	});

	return;
};

wpjsonRanking();

})(jQuery);
