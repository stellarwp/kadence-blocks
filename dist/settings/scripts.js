jQuery(document).ready(function ($) {
	$('.kad-panel-left .nav-tab-link').click(function (event) {
			event.preventDefault();
			var contain = $(this).closest('.kad-panel-left')
			var panel = contain.find('.nav-tab-wrapper');
			var active = panel.find('.nav-tab-active');
			var opencontent = $(this).closest('.kad-panel-contain').find('.nav-tab-content.panel_open');
			var contentid = $(this).data('tab-id');
			var tab = panel.find('a[data-tab-id="'+contentid+'"]');
			if (active.data('tab-id') == contentid ) {
				//leave
			} else {
				tab.addClass('nav-tab-active');
				active.removeClass('nav-tab-active');
				opencontent.removeClass('panel_open');
				$('#'+contentid).addClass('panel_open');	
			}
	
			return false;
	
		});
	});