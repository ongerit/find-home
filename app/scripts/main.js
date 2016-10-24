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

function XML2jsobj(node) {

	var	data = {};

	// append a value
	function Add(name, value) {
		if (data[name]) {
			if (data[name].constructor != Array) {
				data[name] = [data[name]];
			}
			data[name][data[name].length] = value;
		}
		else {
			data[name] = value;
		}
	};

	// element attributes
	var c, cn;
	for (c = 0; cn = node.attributes[c]; c++) {
		Add(cn.name, cn.value);
	}

	// child elements
	for (c = 0; cn = node.childNodes[c]; c++) {
		if (cn.nodeType == 1) {
			if (cn.childNodes.length == 1 && cn.firstChild.nodeType == 3) {
				// text value
				Add(cn.nodeName, cn.firstChild.nodeValue);
			}
			else {
				// sub-object
				Add(cn.nodeName, XML2jsobj(cn));
			}
		}
	}

	return data;

}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function sendFormData() {
  //stop the form from submitting normally
  event.preventDefault();
  //send the data using post with element values
  var formAddress = $('.address').val(); // jshint ignore:line
  var cityAddress = $('.city').val(); // jshint ignore:line
  var stateAddress = $('.state').val(); // jshint ignore:line
  var zipAddress = $('.zip').val(); // jshint ignore:line

  var ADDRESS= $('input[name*="address"]').val();
  var CITY= $('input[name*="city"]').val();
  var STATE= $('input[name*="state"]').val();
  var ZIP= $('input[name*="zip"]').val();

  var VARS = 'address='+ADDRESS+'&city='+CITY+'&state='+STATE+'&zip='+ZIP;

  var settings = {
    async: true,
    crossDomain: true,
    type: 'POST',
    url: '/p.php',
    data: VARS,
    cache: false
  };

  $.ajax(settings).done(function (response) {
  console.log(response);
  console.log(typeof response);

  var xmlString = response;
  var parser = new DOMParser();
  var obj = parser.parseFromString(xmlString, "text/xml");
  var jsonData = xmlToJson(obj);

  // var xml = response, // jshint ignore:line
  // xmlDoc = $.parseXML(response),
  // $xml = $( xmlDoc ); // jshint ignore:line

  console.log(jsonData);
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
