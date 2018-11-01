$('form[id=f]').submit(function (event) {
    
    if (request) {
        request.abort();
    }
    
    var $form = $(this);
    
    var $inputs = $form.find("input, select, button, textarea");
    
    var serializedData = $form.serialize();
    
    var request = $.ajax({
        url: "../modules/handler.xq",
        type: "post",
        cache: false,
        data: serializedData
    });
    
    request.done(function (response, textStatus, jqXHR) {
        
        $("html, body").animate({
            scrollTop: 0
        },
        "slow");
        
        /* delete extra person and place fields and reset the fields */
        
        $('[id^=personInput]').val('');
        $('[id^=placeInput]').val('');
        $('[id=inputGroupSelect01]').val('no');
        $('[id=inputGroupSelect02]').val('yes');
        $('[id^=id-holder]').val('');
        $('[id^=plid-holder]').val('');
        $('[id=manuscriptPage]').val('');
        $('[id=when]').val('');
        $('[id=datepicker]').val('');
        $('div.note-editable').text('');
        
        
        $("#serverResponse").html("<h3>" + response + "</h3>").show().delay(5000).fadeOut('slow');
        $('[data-duplicatepl="place"]').not(':first').remove();
        $('[data-duplicate="person"]').not(':first').remove();
        
    });

    
    request.fail(function (jqXHR, textStatus, errorThrown) {
    });
    
    request.always(function () {
    });
    
    event.preventDefault();
            
});



/* Pure JavaScript

            document.querySelector('form#f').addEventListener('submit', function (event) { 
            event.preventDefault()
            var form = document.querySelector('form#f');
            var data = new FormData(form);
            var xhr = new XMLHttpRequest();
            var url = "../modules/handler.xq";
            
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            
            xhr.send(data.entries())
            
            xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE) {
            console.log(xhr.responseText);
            }
            }
            
            for (var [key, value] of data.entries()) { 
            console.log(key, value);
            };
            
            })*/
