// padding function for having two digit in months and days

function leftPad(num, length) {
    var result = '' + num;
    while (result.length < length) {
        result = '0' + result;
    }
    return result;
}

$.ajaxSetup({
  // Disable caching of AJAX responses
  cache: false
});

$(function () {
    $("#datepicker").datepicker({
        dateFormat: "d MM yy",
        changeMonth: true,
        changeYear: true,
        yearRange: '1799:1810',
        defaultDate: '01 January 1799',
        altField: "#when",
        altFormat: "yy-mm-dd",
        
        onSelect: function () {
            var fullDate = '';
            console.log(fullDate + ' before')
            // constructs the select date in the format we want it to check it against @when attribute
            var day = leftPad($("#datepicker").datepicker('getDate').getDate(), 2);
            var month = leftPad($("#datepicker").datepicker('getDate').getMonth() + 1, 2);
            var year = $("#datepicker").datepicker('getDate').getFullYear();
            var fullDate = year + "-" + month + "-" + day;
            
            // opens xml file
            $.ajax({
                type: "GET",
                url: "../data/cards/1799.xml",
                dataType: "xml",
                cache: false,
                success: function (xml) {
                    // for each <date> element, if its @when attribute equals to the date selected
                    $(xml).find('div').each(function () {
                        if (($(this).find("ab > date").attr("when") == fullDate)) {
                            // alert the user
                            $(function () {
                                
                                $('#dateExists').modal('show');
                                
                                // change the date
                                
                                $('#change').click(function () {
                                    $("#datepicker").val('');
                                    $("#dateExists .close").click()
                                });
                                
                                // edit the entry
                                // the unbind method prevents the ajax for pe and pl to be called twice (not sure why they do so)
                                $('#edit').unbind('click').bind('click', function () {
                                    
                                    var facs = $(xml).find('div > ab > date[when="' + fullDate + '"]').parent().siblings("pb").attr('facs');
                                    
                                    $("#manuscriptPage").val(facs);
                                    
                                    var transcriptionText = $(xml).find('div > ab > date[when="' + fullDate + '"]').parent().siblings('ab[type="transcription"]').html()
                                    var transcription = transcriptionText.slice(4, transcriptionText.length -3)
                                    $('div.note-editable').html($.parseHTML(transcription));
                                    
                                    // persons
                                    var numberPe = $(xml).find('div > ab > date[when="' + fullDate + '"]').siblings("persName").length;

                                    $("#persons").empty()
                                    
                                    
                                    $.ajax({
                                        type: "GET",
                                        url: "../data/indices/pedb.xml",
                                        dataType: "xml",
                                        cache: false,
                                        success: function (xmlpe) {
                                            var counterPe = undefined
                                            for (var counterPe = 0; counterPe < numberPe; counterPe++) {
                                                
                                                var peid = $(xml).find('div > ab > date[when="' + fullDate + '"]').siblings("persName").eq(counterPe).attr("ref");
                                                var slept = $(xml).find('div > ab > date[when="' + fullDate + '"]').siblings("persName").eq(counterPe).attr("slept");
                                                if(slept == 'no')
                                                {var optSlept = '<select name="slept" class="custom-select" id="inputGroupSelect01"><option value="no" selected="selected">No</option><option value="yes">Yes</option></select>'}
                                                else {var optSlept = '<select name="slept" class="custom-select" id="inputGroupSelect01"><option value="no">No</option><option value="yes" selected="selected">Yes</option></select>'};
                                                
                                                var surname = $(xmlpe).find('person[xml\\:id="' + peid + '"] > persName > surname').text();
                                                var forename = $(xmlpe).find('person[xml\\:id="' + peid + '"] > persName > forename').text();
                                                var rolename = $(xmlpe).find('person[xml\\:id="' + peid + '"] > persName > roleName').text();
                                                
                                                if(forename == '')
                                                {var fullName = surname + ' (' + rolename + ')'}
                                                else {var fullName = surname + ' (' + forename + ', ' + rolename + ')'};
                                                
                                                
                                                var newElementPe = '<div data-duplicate="person" class="input-group mb-3"> <button class="btn btn-outline-warning" type="button" data-duplicate-remove="person">-</button> <div class="input-group-prepend"><label class="input-group-text" for="inputGroupSelect01">Slept?</label></div>' + optSlept + '<input type="text" class="form-control" id="personInput' + counterPe + '" placeholder="enter a person" value="' + fullName + '" required="required"/> <input name="peid" id="id-holder' + counterPe + '" value="' + peid + '" readonly="readonly"/></div><script>var options={theme: "square", cssClasses: "col", url: "../data/indices/pedb.xml", dataType: "xml", xmlElementName: "person", getValue: function(element){var $surname=$(element).find("surname").text(); var $forename=$(element).find("forename").text(); var $rolename=$(element).find("roleName").text(); var $peid=$(element).attr("xml:id"); if ($forename){return $surname + " (" + $forename + ", " + $rolename + ")"}else{return $surname + " (" + $rolename + ")"}; ;}, list:{maxNumberOfElements: 1000, match:{enabled: true}, showAnimation:{type: "fade", time: 400, callback: function(){}}, hideAnimation:{type: "slide", time: 400, callback: function(){}}, onClickEvent: function(){var value=$("#personInput' + counterPe + '").getSelectedItemData().attributes["xml:id"].value; $("#id-holder' + counterPe + '").val(value).trigger("change");}}}; $("#personInput' + counterPe + '").easyAutocomplete(options);</script>';
                                                
                                                $("#persons").append(newElementPe);
                                            } // end for (persons)
                                        } // success: function (xmlpe)
                                    }); // open pedb/
                                    
                                    
                                    // places
                                    $("#places").empty()
                                    
                                    $.ajax({
                                        type: "GET",
                                        url: "../data/indices/pldb.xml",
                                        dataType: "xml",
                                        cache: false,
                                        success: function (xmlpl) {
                                    
                                    var numberPl = $(xml).find('div > ab > date[when="' + fullDate + '"]').siblings("placeName").length;
                                    var counter = undefined
                                    for (var counter = 0; counter < numberPl; counter++) {
                                        
                                        var plid = $(xml).find('div > ab > date[when="' + fullDate + '"]').siblings("placeName").eq(counter).attr("ref");
                                        var host = $(xml).find('div > ab > date[when="' + fullDate + '"]').siblings("placeName").eq(counter).attr("host");
                                        
                                        if(host == 'no')
                                        {var optHost = '<select name="host" class="custom-select" id="inputGroupSelect02"><option value="no" selected="selected">No</option><option value="yes">Yes</option></select>'}
                                        else {var optHost = '<select name="host" class="custom-select" id="inputGroupSelect02"><option value="no">No</option><option value="yes" selected="selected">Yes</option></select>'};
                                        
                                        var geogname = $(xmlpl).find('place[xml\\:id="' + plid + '"] > placeName > geogName').text();
                                        
                                        console.log(geogname + plid);
                                        var newElementPl = '<div data-duplicatepl="place" class="input-group mb-3"> <button class="btn btn-outline-warning" type="button" data-duplicatepl-remove="place">-</button> <div class="input-group-prepend"><label class="input-group-text" for="inputGroupSelect02">Host?</label></div>' + optHost + '<input type="text" class="form-control" id="placeInput' + counter + '" placeholder="enter a place" value="' + geogname + '" required="required"/> <input name="plid" id="plid-holder' + counter + '" value="' + plid + '" readonly="readonly"/></div><script>var options={theme: "square", cssClasses: "col", url: "../data/indices/pldb.xml", dataType: "xml", xmlElementName: "place", getValue: function(element){var $geogname=$(element).find("geogName").text(); var $plid=$(element).attr("xml:id"); return $geogname; }, list:{maxNumberOfElements: 1000, match:{enabled: true}, showAnimation:{type: "fade", time: 400, callback: function(){}}, hideAnimation:{type: "slide", time: 400, callback: function(){}}, onClickEvent: function(){var value=$("#placeInput' + counter + '").getSelectedItemData().attributes["xml:id"].value; $("#plid-holder' + counter + '").val(value).trigger("change");}}}; $("#placeInput' + counter + '").easyAutocomplete(options);</script>';
                                        
                                        $("#places").append(newElementPl);
                                    }
                                    // end for (places)
                                    
                                    } // success: function (xmlpl)
                                    }); // open pldb/
                                    
                                    
                                    // close the modal pop up
                                    $("#dateExists .close").click()
                                });
                                // $('#edit').click(function
                            });;
                        }
                    });
                }
            });
            // $.ajax for 1799.xml file
        }
        // onSelect date
    });
});



/*
$.ajax({
type: "GET",
url: "../data/indices/pedb.xml",
dataType: "xml",
success: function (xmlpe) {


console.log(peid + ' (from loop)');

$("#id-holder").val('')
$("#id-holder").val(peid);
}
}) // open pedb*/