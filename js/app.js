// This is the main js file for the app
// It contains the view, model & viewModel
// for the app

// Global variables for map & marker
var map;
var marker;

// This constructor function initializes
// and displays all the locations initially
// Depending on the user input (filter or
// a list view click) it will display the
// currect subset of locations
function DisplayLocation(loc) {
    var self = this;
    self.name = loc.name;
    self.lat = loc.lat;
    self.long = loc.long;
    self.info = ""; 
    self.isVisible = ko.observable(false);

    // Create the actual marker with animation
    // and position properties
    self.marker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: new google.maps.LatLng(self.lat, self.long)
    });

    // This event listener listens to the click
    // click events on the marker and responds
    // by animating the marker if not already
    // animated
    self.marker.addListener('click', function(){
        if (self.marker.getAnimation() !== null) {
            self.marker.setAnimation(null);
        } else {
            self.marker.setAnimation(google.maps.Animation.BOUNCE);

            // stop the animation of marker after
            // 2 seconds. This is so that marker
            // doesn't keep on bouncing
            setTimeout(function() {
                self.marker.setAnimation(null);
            }, 1400);
        }

        // Url for wikipedia API request
        var url = 'https://en.wikipedia.org/w/api.php?format=json&action=query&' +
                  'generator=search&gsrnamespace=0&gsrlimit=1&prop=pageimages|extracts&' +
                  'pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=' +
                  self.name;

        // Call the ajax request on wikipedia API
        // This returns the first entry of the searchKey
        // that is matched in wikipedia database
        $.ajax({
            url: url,
            dataType: 'jsonp',
            success: function(data) {
                var res = data.query.pages;
                var html = "";

                // Build the html that will be displayed
                // in the marker info window
                $.each(res, function(k, v) {
                    html = '<p class="extract">'+ v.extract + '</p>' +
                           '<a href="' + "https://en.wikipedia.org/?curid=" + v.pageid +
                           '"target="_blank">More on Wikipedia</a>';
                });
                self.info = html;

                // Create the maps InfoWindow object &
                // assign the content with the html
                self.infoWindow = new google.maps.InfoWindow({
                    content: self.info
                });

                // Open the info window
                self.infoWindow.open(map, self.marker);
            },
            error: function(err) {                             
                alert("Sorry, we can't get data right now. Please try again later.'");
            }
        });
    });

    // Trigger the already attached event for
    // animating and displaying infoWindow
    self.animateMarker = function() {
        google.maps.event.trigger(self.marker, 'click');
    };

    // Hide and Display markers based on the
    // list view searchKey
    self.showHideMarker = ko.computed(function() {
        if (!self.isVisible()) {
            self.marker.setMap(null);
            return self.marker;
        } else {
            self.marker.setMap(map);
            return self.marker;
        }
    });
}

// Main view model for Knockout App
function MapViewModel() {
    var self = this;

    // observableArray to observe the locations
    self.locations = ko.observableArray([]);

    // Instantiate the map object and display map
    // on screen
    map = new google.maps.Map(document.getElementById('map'),{
        zoom: 8,
        center: { lat: 12.9716, lng: 77.5946}
    });

    window.mapBounds = new google.maps.LatLngBounds();
    window.addEventListener('resize', function(e) {
        // Make sure the map bounds get updated on page resize
        map.fitBounds(mapBounds);
    });

    // Instantiate all the locations & Push all the
    // initialLocations in the locations array
    for (var loc = 0; loc < initialLocations.length; ++loc) {
        self.locations.push(new DisplayLocation(initialLocations[loc]));

        // All all the marker positions to bounds.extend()
        window.mapBounds.extend(new google.maps.LatLng(initialLocations[loc].lat,
                                                       initialLocations[loc].long));
    }

    // fit the map to the new marker
    map.fitBounds(window.mapBounds);
    // center the map
    map.setCenter(window.mapBounds.getCenter());

    // observable string for search filter
    // in list view
    self.searchKey = ko.observable("");

    // computed array that will display & Hide
    // locations in the list view
    // Initially all the locations are isVisible
    // as the searchKey is empty
    self.listViewFilter = ko.computed(function(){
        if (self.searchKey() === "") {
            self.locations().forEach(function(v, k) {
                self.locations()[k].isVisible(true);
            });
            return self.locations();
        } else{
            self.locations().forEach(function(v, k){
                if (v.name.toLowerCase().search(self.searchKey()) === -1) {
                    self.locations()[k].isVisible(false);
                } else {
                    self.locations()[k].isVisible(true);
                }
            });
            return self.locations();
        }
    }, this);
}

function googleMapsLoadError() {
    alert("Sorry, google maps couldn't load. Please refresh & try again.");
}

// Initialize the map with ko bindings
function initMap() {
    ko.applyBindings(new MapViewModel());
}
