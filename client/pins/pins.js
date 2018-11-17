
let map, geocoder, infoWindow;
const initMap = () => {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 10
      });
      infoWindow = new google.maps.InfoWindow;

      // Try HTML5 geolocation.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent('Your Location');
          infoWindow.open(map);
          map.setCenter(pos);
        }, () => {
          handleLocationError(true, infoWindow, map.getCenter());
        });
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
      }
}

const handleLocationError = (browserHasGeolocation, infoWindow, pos) => {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
  }

const TripMap = function(props) {
    var mapOptions = {
        center: {lat: 39.828127,lng: -98.579404},
        zoom: 4,
        streetViewControl:false,
        mapTypeControl:false
    };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    if(props.trips.length === 0) {
        return (
            <div className="tripList">
                <h3 className="emptytrip">No Trips yet</h3>
            </div>
        );
    }

    const tripNodes = props.trips.map(function(trip) {
        return (
            <div key={trip._id} className="trip">
                <CircularProgressBar sqSize={200} strokeWidth={15} start={trip.startDate} total={trip.totalDays} title={trip.title}/>
                <h3 className="tripTitle">{trip.title? trip.title : 'New Trip'}</h3>
                <h3 className="tripLocation">{trip.location? trip.location : 'Orlando, Florida'}</h3>
                <h3 className="tripDetails">{trip.details}</h3>
                <form className="delete"
                    id="deleteTrip"
                    onSubmit={handleDelete}
                    name="deleteTrip"
                    action="/deleteTrip"
                    method="DELETE"
                >
                    <input type="hidden" name="_id" value={trip._id}/>
                    <input type="hidden" id="token" name="_csrf" value={props.csrf}/>
                    <input style={{height: "20px"}} type="image" src="/assets/img/deleteButton.png" border="0" alt="Submit" />
                </form>
            </div>
        );
    });

    return (
        <div className="tripList">
            {tripNodes}
        </div>
    );
};

const loadTripsFromServer = (csrf) => {
    const iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
    const icons = {
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

    sendAjax('GET', '/getTrips', null, (data) => {
        geocoder =  new google.maps.Geocoder();
        for(let i = 0; i < data.trips.length; i++) {
            geocoder.geocode( { 'address': data.trips[i].location }, function(results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    let marker = new google.maps.Marker({
                        position: results[0].geometry.location,
                        map: map,
                        title: data.trips[i].title,
                        icon: `/assets/img/pin${(i%3) + 1}.png`,
                    });
                    marker.addListener('click', function() {
                        infoWindow.open(map, marker);
                        infoWindow.setContent(`<h1>${data.trips[i].title}</h1><p>${data.trips[i].details}</p>`);
                    });
                } else {
                    console.dir("Something got wrong " + status);
                }
            });
        }
    });
};

const setup = function(csrf) {
    loadTripsFromServer(csrf);
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});