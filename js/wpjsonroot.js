var root = 'http://' + location.hostname + '/wp-json/';
(function($){

// escapeHTML
window.escapeHTML = function(val) {
	return $('<div>').html(val).text();
};

// Date Format
window.post_date_format = function( date ) {
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
};

// ThemeOption
window.wpjsonThemeOption = function() {
	var ThemeOption = {};

	// RootObj
	var wpjsonRootObj = $.ajax({
		type:    'GET',
		url:     root,
		async: false
	}).done(function(data, status, xhr) {
		if ( data.length === 0 || data === false ) {
			return;
		}
		ThemeOption['site_name']        = data.name;
		ThemeOption['site_description'] = data.description;
		ThemeOption['site_url']         = data.URL + '/';

	});

	return ThemeOption;
};

var ThemeOption = wpjsonThemeOption();

// site
$('title').each(function(){
	var a = ["sitename", "description"];
	var b = [ThemeOption.site_name, ThemeOption.site_description];
	var txt = $(this).html();
	for(var i=0, len=a.length; i<len; i++){
		txt = txt.replace(a[i], b[i], "g");
		$(this).html( txt.replace(a[i], b[i], "g") );
	}
});
$('a.homelink').attr( 'href', ThemeOption.site_url );

// Global Menu
var GlobalMenuBox = $('#site-navigation-menu');
var GlobalMenu = [];
var wpjsonGlobalMenuObj = $.ajax({
	type: 'GET',
	url:  root + 'taxonomies/category/terms'
}).done(function(data, status, xhr) {
	if ( data.length === 0 ) {
		return;
	}

	$.each(data, function() {
		catlink = 'http://' + location.hostname + '/category/#!/' + this.slug;
		GlobalMenu.push(
			'<li><a href="' + catlink + '">' + this.name + '</a></li>'
		);
	});
	// output
	GlobalMenu = GlobalMenu.join("\n");
	GlobalMenuBox.html( '<ul>' + GlobalMenu + "</ul>\n" );
});

})(jQuery);
