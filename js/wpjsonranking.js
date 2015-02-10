var root = 'http://' + location.hostname + '/wp-json/';

(function($){

// Ranking Posts
window.wpjsonRanking = function( type ) {

	if ( typeof type === 'undefined' ) {
		type = 'simple';
	}

	var RankingArea = $('#ranking-box');
	$.ajax({
		type: 'GET',
		url:  root + 'mak_ranking/'
	}).done(function(data, status, xhr) {
		if ( data.content.length === 0 ) {
			RankingArea.remove();
			return;
		}
		RankingArea.html(data.content);

	}).fail(function(xhr, status, error) {
		RankingArea.remove();
	});

	return;
};
wpjsonRanking();

})(jQuery);
