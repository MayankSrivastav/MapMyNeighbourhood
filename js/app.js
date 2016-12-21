// This is the main js file for the app
// It contains the view, model & viewModel
// for the app

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'),{
        zoom: 8,
        center: { lat: 12.9716, lng: 77.5946}
    });

    var geocoder = new google.maps.Geocoder();
    getAddressCoordinatesAndSetMarker(geocoder, map);    
}

var markers = ['Bengaluru', 'Tumakuru', 'Hosur', 'Mysuru'];

function getAddressCoordinatesAndSetMarker(geocoder, map) {
    for (var i = 0; i < markers.length; ++i) {
        geocoder.geocode({'address' : markers[i]}, function(results, status) {
            if (status === 'OK') {
                var marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
                });
            } else {
                alert('Can\'t put marker for the following reason: ' + status);
            }
        });
    }    

    displayListOfLocations();
}

function displayListOfLocations() {
    markers.forEach(function(item, index){
        var loc = document.createElement("LI");
        var text = document.createTextNode(item);
        loc.appendChild(text);
        document.getElementById('locationsUL').appendChild(text);
        document.getElementById('locationsUL').appendChild(document.createElement("br"));
    });    
}