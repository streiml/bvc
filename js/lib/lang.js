define([
	'zepto',
	'i18n!nls/messages'
], function($, messages) {
    return function ($html) {
        $("[data-lang]", $html).each(function(index,  el) {
                    var item = $(this),
                        id = item.data("lang");
                    item.html(messages[id]);
        });
        $("[data-lang-placeholder]", $html).each(function(index,  el) {
            var item = $(this),
                id = item.data("lang-placeholder");
            item.attr("placeholder", messages[id]);
        });
        $("[data-lang-label]", $html).each(function(index,  el) {
            var item = $(this),
                id = item.data("lang-label");
            item.attr("label", messages[id]);
        });
    };
    
});