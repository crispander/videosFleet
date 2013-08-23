/* Load this script using conditional IE comments if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'cristian\'">' + entity + '</span>' + html;
	}
	var icons = {
			'icon-music' : '&#xe000;',
			'icon-play' : '&#xe001;',
			'icon-camera' : '&#xe002;',
			'icon-film' : '&#xe003;',
			'icon-camera-2' : '&#xe004;',
			'icon-user' : '&#xe005;',
			'icon-users' : '&#xe006;',
			'icon-bubble' : '&#xe007;',
			'icon-bubbles' : '&#xe008;',
			'icon-bubbles-2' : '&#xe009;',
			'icon-busy' : '&#xe00a;',
			'icon-cogs' : '&#xe00b;',
			'icon-wrench' : '&#xe00c;',
			'icon-folder' : '&#xe00d;',
			'icon-folder-open' : '&#xe00e;',
			'icon-undo' : '&#xe00f;',
			'icon-redo' : '&#xe010;',
			'icon-earth' : '&#xe011;',
			'icon-globe' : '&#xe012;',
			'icon-thumbs-up' : '&#xe013;',
			'icon-thumbs-up-2' : '&#xe014;',
			'icon-cancel-circle' : '&#xe015;',
			'icon-checkmark-circle' : '&#xe016;',
			'icon-exit' : '&#xe017;',
			'icon-enter' : '&#xe018;',
			'icon-google' : '&#xe019;',
			'icon-google-plus' : '&#xe01a;',
			'icon-facebook' : '&#xe01b;',
			'icon-twitter' : '&#xe01c;',
			'icon-feed' : '&#xe01d;',
			'icon-vimeo' : '&#xe01e;',
			'icon-youtube' : '&#xe01f;',
			'icon-picture' : '&#xe020;',
			'icon-info' : '&#xe021;',
			'icon-camera-3' : '&#xe022;',
			'icon-headphones' : '&#xe023;',
			'icon-left-quote' : '&#xe024;',
			'icon-right-quote' : '&#xe025;',
			'icon-steering-wheel' : '&#xe026;',
			'icon-home' : '&#xe027;',
			'icon-plus' : '&#xe028;',
			'icon-minus' : '&#xe029;',
			'icon-office' : '&#xe02a;',
			'icon-pencil' : '&#xe02f;',
			'icon-droplet' : '&#xe02b;',
			'icon-image' : '&#xe030;',
			'icon-headphones-2' : '&#xe031;',
			'icon-file' : '&#xe032;',
			'icon-file-2' : '&#xe02c;',
			'icon-feed-2' : '&#xe033;',
			'icon-copy' : '&#xe02d;',
			'icon-stack' : '&#xe02e;',
			'icon-location' : '&#xe034;',
			'icon-location-2' : '&#xe035;',
			'icon-box-remove' : '&#xe039;',
			'icon-box-add' : '&#xe038;',
			'icon-download' : '&#xe03a;',
			'icon-upload' : '&#xe03b;',
			'icon-user-2' : '&#xe03c;',
			'icon-stats' : '&#xe037;',
			'icon-menu' : '&#xe03d;',
			'icon-tree' : '&#xe036;',
			'icon-cloud' : '&#xe03e;',
			'icon-bookmark' : '&#xe041;',
			'icon-eye-blocked' : '&#xe03f;',
			'icon-eye' : '&#xe040;',
			'icon-download-2' : '&#xe042;',
			'icon-upload-2' : '&#xe043;',
			'icon-facebook-2' : '&#xe047;',
			'icon-facebook-3' : '&#xe046;',
			'icon-vimeo-2' : '&#xe044;',
			'icon-tag' : '&#xe045;',
			'icon-grid' : '&#xe04d;',
			'icon-map-pin-alt' : '&#xe058;',
			'icon-layers-alt' : '&#xe048;',
			'icon-layers' : '&#xe049;',
			'icon-move-alt2' : '&#xe04a;',
			'icon-cog' : '&#xe04b;',
			'icon-soundcloud' : '&#xe04c;',
			'icon-soundcloud-2' : '&#xe04e;',
			'icon-pushpin' : '&#xe04f;',
			'icon-equalizer' : '&#xe050;',
			'icon-contract' : '&#xe051;',
			'icon-play-2' : '&#xe052;',
			'icon-pause' : '&#xe053;',
			'icon-stop' : '&#xe054;',
			'icon-backward' : '&#xe055;',
			'icon-forward' : '&#xe056;',
			'icon-volume-mute' : '&#xe057;',
			'icon-volume-decrease' : '&#xe059;',
			'icon-volume-increase' : '&#xe05a;',
			'icon-volume-mute-2' : '&#xe05b;',
			'icon-loop' : '&#xe05c;',
			'icon-shuffle' : '&#xe05d;',
			'icon-key' : '&#xe05e;',
			'icon-floppy' : '&#xe05f;',
			'icon-database' : '&#xe060;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, html, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};