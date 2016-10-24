'use strict';

// Changes XML to JSON
function xmlToJson(xml) {
	// Create the return object
	var obj = {};
	if (xml.nodeType === 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj['@attributes'] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType === 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) === 'undefined') {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) === 'undefined') {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// function sendData() {

//   var ADDRESS= $('input[name*="address"]').val();
//   var CITY= $('input[name*="city"]').val();
//   var STATE= $('input[name*="state"]').val();
//   var ZIP= $('textarea[name*="zip"]').val();
//   var VARS = 'address='+ADDRESS+'&city='+CITY+'&state='+STATE+'&zip='+ZIP;
//
//   //stop the form from submitting normally
//   event.preventDefault();
//
//   //send the data using post with element values
//
//   $.ajax({
//     type: 'POST',
//     url: 'p.php',
//     data: VARS,
//     cache: false,
//     success: function() {
//       return;
//     }
//   });
// }

function sendFormData() {
  //stop the form from submitting normally
  event.preventDefault();
  //send the data using post with element values
  // var formAddress = $('.address').val(); // jshint ignore:line
  // var cityAddress = $('.city').val(); // jshint ignore:line
  // var stateAddress = $('.state').val(); // jshint ignore:line
  // var zipAddress = $('.zip').val(); // jshint ignore:line

  var ADDRESS= $('input[name*="address"]').val();
  var CITY= $('input[name*="city"]').val();
  var STATE= $('input[name*="state"]').val();
  var ZIP= $('textarea[name*="zip"]').val();

  var VARS = 'address='+ADDRESS+'&city='+CITY+'&state='+STATE+'&zip='+ZIP;

  var settings = {
    async: true,
    crossDomain: true,
    type: 'POST',
    url: '/p.php',
    data: VARS,
    cache: false,
    success: function() {
      return;
    }
    // 'async': true,
    // 'crossDomain': true,
    // 'url': 'http://www.zillow.com/webservice/GetSearchResults.htm?zws-id=X1-ZWz19ktrnf9pmz_64j9s&address='+formAddress+'&citystatezip='+cityAddress+'%20'+stateAddress+'%20'+zipAddress+'&rentzestimate=true',
    // 'method': 'POST',
    // 'headers': {
    // 'content-type': 'application/json',
    // 'cache-control': 'no-cache',
  };

  $.ajax(settings).done(function (response) {

  console.log(response);

  var jsonData = xmlToJson(response);
  var xml = response, // jshint ignore:line
  xmlDoc = $.parseXML(response),
  $xml = $( xmlDoc ); // jshint ignore:line

  console.log(xmlDoc);
  var result = jsonData['SearchResults:searchresults'].response.results.result;
  var street = result.address.street['#text'];
  var price = parseFloat(result.zestimate.amount['#text']);
  var high = parseFloat(result.rentzestimate.valuationRange.high['#text']);
  var low = parseFloat(result.rentzestimate.valuationRange.low['#text']);

  // for google maps
  var longitude = parseFloat(result.address.longitude['#text']); // jshint ignore:line
  var latitude = parseFloat(result.address.latitude['#text']); // jshint ignore:line

    console.log(result);

  $('.output').text(JSON.stringify(street)).fadeIn();
  $('.price').text('$' + numberWithCommas(price)).fadeIn();
  $('.high').text('$' + numberWithCommas(high)).fadeIn();
  $('.low').text('$' + numberWithCommas(low)).fadeIn();
  $('h3').fadeIn();

  var map;
  function initMap(longitude,latitude,formAddress) {

    var myLatLng = {lat: latitude, lng: longitude};

    map = new google.maps.Map(document.getElementById('map'), { // jshint ignore:line
      center: myLatLng, // jshint ignore:line
      zoom: 16,
      styles: [{'featureType':'administrative','elementType':'labels.text.fill','stylers':[{'color':'#444444'}]},{'featureType':'landscape','elementType':'all','stylers':[{'color':'#f2f2f2'}]},{'featureType':'poi','elementType':'all','stylers':[{'visibility':'off'}]},{'featureType':'road','elementType':'all','stylers':[{'saturation':-100},{'lightness':45}]},{'featureType':'road.highway','elementType':'all','stylers':[{'visibility':'simplified'}]},{'featureType':'road.arterial','elementType':'labels.icon','stylers':[{'visibility':'off'}]},{'featureType':'transit','elementType':'all','stylers':[{'visibility':'off'}]},{'featureType':'water','elementType':'all','stylers':[{'color':'#fdcb08'},{'visibility':'on'}]}],
      label: formAddress
    });

  var marker = new google.maps.Marker({  // jshint ignore:line
      position: myLatLng,  // jshint ignore:line
      map: map,  // jshint ignore:line
      title: formAddress  // jshint ignore:line
    });
  }
  initMap(longitude,latitude,formAddress); // jshint ignore:line
  }).fail(
    function(res) {
      console.log(res);
      if(res === 'undefined') {
        $('.error').text('Sorry we can not  find this address').fadeIn();
        return false;
      }
    }
  );
}

$('form').bind('submit', sendFormData);
// $('form').bind('submit', sendData);
