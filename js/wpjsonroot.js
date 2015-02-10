var root = 'http://' + location.hostname + '/wp-json/';
(function($){

// escapeHTML
window.escapeHTML = function(val) {
	return $('<div>').html(val).text();
};

// ThemeOption
window.wpjsonThemeOption = function() {
	var ThemeOption = {};
	$.ajax({
		type:  "GET",
		url:   root + 'mak_themeoption/',
		async: false
	}).done(function(data, status, xhr) {
		if ( data.length === 0 || data === false ) {
			return;
		}
		$.each(data, function() {
			if ( this.value === false ) {
				ThemeOption[this.name] = '';
			} else {
				ThemeOption[this.name] = this.value;
			}
			if ( this.name === 'background_image' ) {
				ThemeOption['background_image_url'] = '';
				if ( this.value !== false ) {
					if ( this.value !== '0' && this.value !== '' ) {
						$.ajax({
							type:  "GET",
							url:   root + 'media/' + this.value,
							async: false
						}).done(function(data, status, xhr) {
							ThemeOption['background_image_url'] = data.source;
						});
					}
				}
			}
			if ( this.name === 'background_image_mobile' ) {
				ThemeOption['background_image_url_mobile'] = '';
				if ( this.value !== false ) {
					if ( this.value !== '0' && this.value !== '' ) {
						$.ajax({
							type:  "GET",
							url:   root + 'media/' + this.value,
							async: false
						}).done(function(data, status, xhr) {
							ThemeOption['background_image_url_mobile'] = data.source;
						});
					}
				}
			}
			if ( this.name === 'ogp_image' ) {
				ThemeOption['ogp_image_url'] = '';
				if ( this.value !== false ) {
					if ( this.value !== '0' && this.value !== '' ) {
						$.ajax({
							type:  "GET",
							url:   root + 'media/' + this.value,
							async: false
						}).done(function(data, status, xhr) {
							ThemeOption['ogp_image_url'] = data.source;
						});
					}
				}
			}
			if ( this.name === 'favicon_image' ) {
				ThemeOption['favicon_image_url'] = '';
				if ( this.value !== false ) {
					if ( this.value !== '0' && this.value !== '' ) {
						$.ajax({
							type:  "GET",
							url:   root + 'media/' + this.value,
							async: false
						}).done(function(data, status, xhr) {
							ThemeOption['favicon_image_url'] = data.source;
						});
					}
				}
			}
			if ( this.name === 'apple_touch_icon_image' ) {
				ThemeOption['apple_touch_icon_image_url'] = '';
				if ( this.value !== false ) {
					if ( this.value !== '0' && this.value !== '' ) {
						$.ajax({
							type:  "GET",
							url:   root + 'media/' + this.value,
							async: false
						}).done(function(data, status, xhr) {
							ThemeOption['apple_touch_icon_image_url'] = data.source;
						});
					}
				}
			}
		});
	});

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

// favicon
if ( ThemeOption.favicon_image_url !== '' ) {
	$('#shortcut-icon').attr( 'href', ThemeOption.favicon_image_url );
}
// apple-touch-icon
if ( ThemeOption.apple_touch_icon_image_url !== '' ) {
	$('#apple-touch-icon').attr( 'href', ThemeOption.apple_touch_icon_image_url );
}

// Google Analytics
if ( ThemeOption.google_analytics_code !== '' ) {
	$('head').append( ThemeOption.google_analytics_code );
}

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
		GlobalMenu.push(
			'<li><a href="' + this.link + '">' + this.name + '</a></li>'
		);
	});
	// output
	GlobalMenu = GlobalMenu.join("\n");
	GlobalMenuBox.html( '<ul>' + GlobalMenu + "</ul>\n" );
});

})(jQuery);
