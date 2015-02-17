/*!
 * mak-simple - v0.1.0
 *
 * https://www.digitalcube.jp/
 *
 * Copyright 2014, DigitalCube Co.,Ltd (https://www.digitalcube.jp/)
 * Released under the GNU General Public License v2 or later
 */

/**
 * URL base
 */
var apiroot  = 'http://' + location.hostname + '/wp-json/';
var siteroot = 'http://' + location.hostname + '/mak-simple/';

/**
 * HashMonitor
 */
var HashMonitor = {
	functions: [],
	prevHash:  "",
	
	// Monitoring
	monitoring: function() {
		if ( HashMonitor.prevHash !== window.location.hash ) {
			for ( var i=0; i < HashMonitor.functions.length; ++i ) {
				HashMonitor.functions[i]( window.location.hash, HashMonitor.prevHash );
			}
			HashMonitor.prevHash = window.location.hash;
		}
	},
	
	// function
	addFunctions: function(fn) {
		HashMonitor.functions.push(fn);
	}
};

(function($){

// escapeHTMLjs
window.escapeHTMLjs = function(val) {
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
		type:  'GET',
		url:   apiroot,
		async: false
	}).done(function(data, status, xhr) {
		if ( data.length === 0 || data === false ) {
			return;
		}
		ThemeOption['site_name']        = data.name;
		ThemeOption['site_description'] = data.description;

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

// Global Menu
var GlobalMenuBox = $('#site-navigation-menu');
var GlobalMenu = [];
var wpjsonGlobalMenuObj = $.ajax({
	type: 'GET',
	url:  apiroot + 'taxonomies/category/terms'
}).done(function(data, status, xhr) {
	if ( data.length === 0 ) {
		return;
	}

	$.each(data, function() {
		catlink = siteroot + 'category/#!/' + this.slug;
		GlobalMenu.push(
			'<li><a href="' + catlink + '">' + this.name + '</a></li>'
		);
	});
	// output
	GlobalMenu = GlobalMenu.join("\n");
	GlobalMenuBox.html( '<ul>' + GlobalMenu + "</ul>\n" );
});

})(jQuery);
