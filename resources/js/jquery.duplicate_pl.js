var options = {
    theme: "square", cssClasses: 'col',
    url: "../data/indices/pldb.xml", dataType: "xml",
    xmlElementName: "place", getValue: function (element) {
        var $geogname = $(element).find("geogName").text();
        var
        $plid = $(element).attr("xml:id");
        return $geogname;
    },
    list: {
        maxNumberOfElements: 1000, match: {
            enabled:
            true
        },
        showAnimation: {
            type: "fade", time: 400,
            callback: function () {
            }
        },
        hideAnimation: {
            type:
            "slide", time: 400, callback: function () {
            }
        },
        onClickEvent: function () {
            var value =
            $("#placeInput").getSelectedItemData().attributes[ "xml:id"].value;
            $("#plid-holder").val(value).trigger("change");
        }
    }
};
$("#placeInput").easyAutocomplete(options);


/** https://github.com/ReallyGood/jQuery.duplicate */
$.duplicate = function () {
    
    var body = $('body');
    body.off('duplicatepl-');
    var templates = {
    };
    var settings = {
    };
    var init = function () {
        $('[data-duplicatepl]').each(function () {
            var name = $(this).data('duplicatepl');
            var template = $('<div>').html($(this).clone(true)).html();
            var options = {
            };
            var min = + $(this).data('duplicatepl-min');
            options.minimum = isNaN(min) ? 1: min;
            options.maximum = + $(this).data('duplicatepl-max') || Infinity;
            options.parent = $(this).parent();
            
            settings[name] = options;
            templates[name] = template;
        });
        
        body.on('click.duplicate', '[data-duplicatepl-add]', add);
        body.on('click.duplicate', '[data-duplicatepl-remove]', remove);
    };
    
    function add() {
        var next = $('[id^=placeInput]').length;
        var targetName = $(this).data('duplicatepl-add');
        var selector = $('[data-duplicatepl=' + targetName + ']');
        var target = $(selector).last();
        if (! target.length) target = $(settings[targetName].parent);
        var newElement = '<div data-duplicatepl="place" class="input-group mb-3"> <button class="btn btn-outline-warning" type="button" data-duplicatepl-remove="place">-</button> <div class="input-group-prepend"><label class="input-group-text" for="inputGroupSelect02">Host?</label></div><select name="host" class="custom-select" id="inputGroupSelect02"><option value="no">No</option><option value="yes" selected="selected">Yes</option></select><input type="text" class="form-control" id="placeInput' + next + '" placeholder="enter a place" required="required"/> <input name="plid" id="plid-holder' + next + '" readonly="readonly"/> </div><script>var options={theme: "square", cssClasses: "col", url: "../data/indices/pldb.xml", dataType: "xml", xmlElementName: "place", getValue: function(element){var $geogname=$(element).find("geogName").text(); var $plid=$(element).attr("xml:id"); return $geogname; }, list:{maxNumberOfElements: 1000, match:{enabled: true}, showAnimation:{type: "fade", time: 400, callback: function(){}}, hideAnimation:{type: "slide", time: 400, callback: function(){}}, onClickEvent: function(){var value=$("#placeInput' + next + '").getSelectedItemData().attributes["xml:id"].value; $("#plid-holder' + next + '").val(value).trigger("change");}}}; $("#placeInput' + next + '").easyAutocomplete(options);</script>';
        /*    var newElement = $(templates[targetName]).clone(true);*/
        
        if ($(selector).length >= settings[targetName].maximum) {
            $(this).trigger('duplicate.error');
            return;
        }
        target.after(newElement);
        $(this).trigger('duplicate.add');
        next = next + 1;
        console.log(next);
    }
    
    function remove() {
        var targetName = $(this).data('duplicatepl-remove');
        var selector = '[data-duplicatepl=' + targetName + ']';
        var target = $(this).closest(selector);
        if (! target.length) target = $(this).siblings(selector).eq(0);
        if (! target.length) target = $(selector).last();
        
        if ($(selector).length <= settings[targetName].minimum) {
            $(this).trigger('duplicate.error');
            return;
        }
        target.remove();
        $(this).trigger('duplicate.remove');
    }
    
    $(init);
};

$.duplicate();