// This is the main js file for the app
// It contains the view, model & viewModel
// for the app

var map;
var marker;

function DisplayLocation(loc) {
    var self = this;
    self.name = loc.name;
    self.lat = loc.lat;
    self.long = loc.long;
    
    self.visible = ko.observable(true);

    self.infoWindow = new google.maps.InfoWindow({
        content: self.name
    });    

    self.marker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: new google.maps.LatLng(self.lat, self.long)
    });

    self.marker.addListener('click', function(){
        if (self.marker.getAnimation() !== null) {
            self.marker.setAnimation(null);
        } else {
            self.marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                self.marker.setAnimation(null);
            }, 2000);
        }
    });

    google.maps.event.addListener(self.marker, 'click', function(){
        self.infoWindow.open(map, self.marker);
    });    
}

function MapViewModel() {
    var self = this;

    self.locations = ko.observableArray([]);

    map = new google.maps.Map(document.getElementById('map'),{
        zoom: 8,
        center: { lat: 12.9716, lng: 77.5946}
    });

    for (var loc = 0; loc < initialLocations.length; ++loc) {
        self.locations.push(new DisplayLocation(initialLocations[loc]));
    }

    // for (var i = 0; i < self.locations().length; ++i) {
    //     marker = new google.maps.Marker({
    //         map: map,
    //         animation: google.maps.Animation.DROP,
    //         position: new google.maps.LatLng(self.locations()[i].lat, self.locations()[i].long)
    //     });
    // }
}

function initMap() {
    ko.applyBindings(new MapViewModel());
}
