"use strict";

function addNewPers (oFormElement) {

  var oReq = new XMLHttpRequest();
  var data = new FormData(oFormElement)
  
  oReq.onload = {}
    oReq.onreadystatechange = function() {
    if (oReq.readyState == XMLHttpRequest.DONE) {
      var result = oReq.responseText;
     /*var div = document.getElementById('personAdded');*/
     $("#personAdded").html("<h3>" + result + "</h3>").show().delay(5000).fadeOut('slow');
    }
    }
  oReq.open("post", oFormElement.action, true);
  oReq.send(data);
  $('#addPersonForm')[0].reset();
  $('#addPerson').modal('hide');

}

"use strict";

function addNewPlace (oFormElement) {

  var oReq = new XMLHttpRequest();
  var data = new FormData(oFormElement)
  
  oReq.onload = {}
    oReq.onreadystatechange = function() {
    if (oReq.readyState == XMLHttpRequest.DONE) {
      var result = oReq.responseText;
     /*var div = document.getElementById('personAdded');*/
     $("#placeAdded").html("<h3>" + result + "</h3>").show().delay(5000).fadeOut('slow');
    }
    }
  oReq.open("post", oFormElement.action, true);
  oReq.send(data);
  $('#addPlaceForm')[0].reset();
  $('#addPlace').modal('hide');

}
