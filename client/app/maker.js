const handleTrip = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'},350);

    if($("#tripTitle").val() == '' || $("#tripLocation").val() == '' || $("#tripDate").val() == '') {
        handleError("All fields are required!");
        return false;
    }

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
        loadTripsFromServer($('token').val());
    });

    return false;
};

const handleDelete = (e) => {
    e.preventDefault();

    sendAjax('POST', '/deleteTrip', $('#deleteTrip').serialize(), () => {
        loadTripsFromServer($('token').val());
    });

    return false;
};

const TripForm = (props) => {
    return (
        <form id="domoForm"
            onSubmit={handleTrip}
            name="tripForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="title">Name: </label>
            <input id="tripTitle" type="text" name="title" placeholder="Title"/>
            <label htmlFor="title">Location: </label>
            <input id="tripLocation" type="text" name="location" placeholder="Location"/>
            <label htmlFor="title">Details: </label>
            <input id="tripDetails" type="text" name="details" placeholder="Details"/>
            <label htmlFor="startDate">Date: </label>
            <input id="tripDate" type="date" name="startDate"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="makeDomoSubmit" type="submit" value="Make Trip"/>
        </form>
    );
};

const TripList = function(props) {
    if(props.trips.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Trips yet</h3>
            </div>
        );
    }

    const tripNodes = props.trips.map(function(trip) {
        console.dir(trip);
        return (
            <div key={trip._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace"/>
                <h3 className="domoName">Title: {trip.title}</h3>
                <h3 className="domoAge">Location: {trip.location}</h3>
                <h3 className="domoAge">Details: {trip.details}</h3>
                <form className="delete" id="deleteDomo" onSubmit={handleDelete}>
                    <input type="hidden" name="_id" value={trip._id} />
                    <input id="token" type="hidden" name="_csrf" value={props.csrf} />
                    <input style={{height: "20px"}} type="image" src="/assets/img/deleteButton.png" border="0" alt="Submit" />
                </form>
            </div>
        );
    });

    return (
        <div className="domoList">
            {tripNodes}
        </div>
    );
};

const loadTripsFromServer = (csrf) => {
    sendAjax('GET', '/getTrips', null, (data) => {
        console.dir(data);
        ReactDOM.render(
            <TripList trips={data.trips} csrf={csrf} />,
            document.querySelector("#domos")
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <TripForm csrf={csrf} />,
        document.querySelector("#makeDomo")
    );

    ReactDOM.render(
        <TripList trips={[]} csrf={csrf}/>,
        document.querySelector("#domos")
    );

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