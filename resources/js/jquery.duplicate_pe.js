var options = {
    theme: "square",
    cssClasses: 'col',
    url: "../data/indices/pedb.xml",
    dataType: "xml",
    xmlElementName: "person",
    getValue: function (element) {
        var $surname = $(element).find("surname").text();
        var $forename = $(element).find("forename").text();
        var $rolename = $(element).find("roleName").text();
        var $peid = $(element).attr("xml:id");
        if ($forename) {
            return $surname + ' (' + $forename + ', ' + $rolename + ')'
        } else {
            return $surname + ' (' + $rolename + ')'
        };;
    },
    list: {
        maxNumberOfElements: 1000,
        match: {
            enabled: true
        },
        showAnimation: {
            type: "fade",
            time: 400,
            callback: function () {
            }
        },
        hideAnimation: {
            type: "slide",
            time: 400,
            callback: function () {
            }
        },
        onClickEvent: function () {
            var value = $("#personInput0").getSelectedItemData().attributes[ "xml:id"].value;
            $("#id-holder").val(value).trigger("change");
        }
    }
};
$("#personInput0").easyAutocomplete(options);



/** https://github.com/ReallyGood/jQuery.duplicate */
$.duplicate = function () {
    
    var body = $('body');
    body.off('duplicate');
    var templates = {
    };
    var settings = {
    };
    var init = function () {
        $('[data-duplicate]').each(function () {
            var name = $(this).data('duplicate');
            var template = $('<div>').html($(this).clone(true)).html();
            var options = {
            };
            var min = + $(this).data('duplicate-min');
            options.minimum = isNaN(min) ? 1: min;
            options.maximum = + $(this).data('duplicate-max') || Infinity;
            options.parent = $(this).parent();
            
            settings[name] = options;
            templates[name] = template;
        });
        
        body.on('click.duplicate', '[data-duplicate-add]', add);
        body.on('click.duplicate', '[data-duplicate-remove]', remove);
    };
    
    function add() {
        var next = $('[id^=personInput]').length;
        var targetName = $(this).data('duplicate-add');
        var selector = $('[data-duplicate=' + targetName + ']');
        var target = $(selector).last();
        if (! target.length) target = $(settings[targetName].parent);
        var newElement = '<div data-duplicate="person" class="input-group mb-3"> <button class="btn btn-outline-warning" type="button" data-duplicate-remove="person">-</button> <div class="input-group-prepend"><label class="input-group-text" for="inputGroupSelect01">Slept?</label></div><select name="slept" class="custom-select" id="inputGroupSelect01"><option value="no" selected="selected">No</option><option value="yes">Yes</option></select><input type="text" class="form-control" id="personInput' + next + '" placeholder="enter a person" required="required"/> <input name="peid" id="id-holder' + next + '" readonly="readonly"/> </div><script>var options={theme: "square", cssClasses: "col", url: "../data/indices/pedb.xml", dataType: "xml", xmlElementName: "person", getValue: function(element){var $surname=$(element).find("surname").text(); var $forename=$(element).find("forename").text(); var $rolename=$(element).find("roleName").text(); var $peid=$(element).attr("xml:id"); if ($forename){return $surname + " (" + $forename + ", " + $rolename + ")"}else{return $surname + " (" + $rolename + ")"}; ;}, list:{maxNumberOfElements: 1000, match:{enabled: true}, showAnimation:{type: "fade", time: 400, callback: function(){}}, hideAnimation:{type: "slide", time: 400, callback: function(){}}, onClickEvent: function(){var value=$("#personInput' + next + '").getSelectedItemData().attributes["xml:id"].value; $("#id-holder' + next + '").val(value).trigger("change");}}}; $("#personInput' + next + '").easyAutocomplete(options);</script>';
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
        var targetName = $(this).data('duplicate-remove');
        var selector = '[data-duplicate=' + targetName + ']';
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