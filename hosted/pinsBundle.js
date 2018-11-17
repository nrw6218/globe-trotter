'use strict';

var map = void 0,
    geocoder = void 0,
    infoWindow = void 0;
var initMap = function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 10
    });
    infoWindow = new google.maps.InfoWindow();

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Your Location');
            infoWindow.open(map);
            map.setCenter(pos);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
};

var handleLocationError = function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ? 'Error: The Geolocation service failed.' : 'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
};

var TripMap = function TripMap(props) {
    var mapOptions = {
        center: { lat: 39.828127, lng: -98.579404 },
        zoom: 4,
        streetViewControl: false,
        mapTypeControl: false
    };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    if (props.trips.length === 0) {
        return React.createElement(
            'div',
            { className: 'tripList' },
            React.createElement(
                'h3',
                { className: 'emptytrip' },
                'No Trips yet'
            )
        );
    }

    var tripNodes = props.trips.map(function (trip) {
        console.dir(trip._id);
        return React.createElement(
            'div',
            { key: trip._id, className: 'trip' },
            React.createElement(CircularProgressBar, { sqSize: 200, strokeWidth: 15, start: trip.startDate, total: trip.totalDays, title: trip.title }),
            React.createElement(
                'h3',
                { className: 'tripTitle' },
                trip.title ? trip.title : 'New Trip'
            ),
            React.createElement(
                'h3',
                { className: 'tripLocation' },
                trip.location ? trip.location : 'Orlando, Florida'
            ),
            React.createElement(
                'h3',
                { className: 'tripDetails' },
                trip.details
            ),
            React.createElement(
                'form',
                { className: 'delete',
                    id: 'deleteTrip',
                    onSubmit: handleDelete,
                    name: 'deleteTrip',
                    action: '/deleteTrip',
                    method: 'DELETE'
                },
                React.createElement('input', { type: 'hidden', name: '_id', value: trip._id }),
                React.createElement('input', { type: 'hidden', id: 'token', name: '_csrf', value: props.csrf }),
                React.createElement('input', { style: { height: "20px" }, type: 'image', src: '/assets/img/deleteButton.png', border: '0', alt: 'Submit' })
            )
        );
    });

    return React.createElement(
        'div',
        { className: 'tripList' },
        tripNodes
    );
};

var loadTripsFromServer = function loadTripsFromServer(csrf) {
    var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
    var icons = {
        upcoming: {
            icon: iconBase + 'pin1.png'
        },
        complete: {
            icon: iconBase + 'pin2.png'
        },
        today: {
            icon: iconBase + 'pin3.png'
        }
    };

    sendAjax('GET', '/getTrips', null, function (data) {
        geocoder = new google.maps.Geocoder();

        var _loop = function _loop(i) {
            geocoder.geocode({ 'address': data.trips[i].location }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    console.dir(results);
                    var marker = new google.maps.Marker({
                        position: results[0].geometry.location,
                        map: map,
                        title: data.trips[i].title,
                        icon: '/assets/img/pin' + (i % 3 + 1) + '.png'
                    });
                    marker.addListener('click', function () {
                        infoWindow.open(map, marker);
                        infoWindow.setContent('<h1>' + data.trips[i].title + '</h1><p>' + data.trips[i].details + '</p>');
                    });
                } else {
                    console.dir("Something got wrong " + status);
                }
            });
        };

        for (var i = 0; i < data.trips.length; i++) {
            _loop(i);
        }
    });
};

var setup = function setup(csrf) {
    loadTripsFromServer(csrf);
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
    $("#tripMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
    $("#tripMessage").animate({ width: 'hide' }, 350);
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
