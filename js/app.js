// This is the main js file for the app
// It contains the view, model & viewModel
// for the app
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'),{
        zoom: 8,        
        center: { lat: 12.9716, lng: 77.5946}
    });

    var geocoder = new google.maps.Geocoder();
    var markers = ['Bengaluru', 'Tumakuru', 'Hosur', 'Mysuru', 'Ooty', 'Coonoor', 'Puducherry', 'Srirangapatna'];
    var marker;
    getAddressCoordinatesAndSetMarker(geocoder, map, markers);       
}

function getAddressCoordinatesAndSetMarker(geocoder, map, markers) {
    for (var i = 0; i < markers.length; ++i) {
        geocoder.geocode({'address' : markers[i]}, function(results, status) {
            if (status === 'OK') {
                marker = new google.maps.Marker({
                    map: map,
                    animation: google.maps.Animation.DROP,
                    position: results[0].geometry.location
                });
                marker.addListener('click', function(){
                    toggleBounce(this);
                });
            } else {
                alert('Can\'t put marker for the following reason: ' + status);
            }
        });
    }    

    displayListOfLocations(markers);
}

function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}

function displayListOfLocations(markers) {
    markers.forEach(function(item, index){
        var loc = document.createElement("LI");
        var text = document.createTextNode(item);
        loc.appendChild(text);
        document.getElementById('locationsUL').appendChild(text);
        document.getElementById('locationsUL').appendChild(document.createElement("br"));
    });    
}
