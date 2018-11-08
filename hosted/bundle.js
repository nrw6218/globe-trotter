"use strict";

var handleTrip = function handleTrip(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#tripTitle").val() == '' || $("#tripLocation").val() == '' || $("#tripDate").val() == '') {
        handleError("All fields are required!");
        return false;
    }

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
        loadTripsFromServer($('token').val());
    });

    return false;
};

var handleDelete = function handleDelete(e) {
    e.preventDefault();

    sendAjax('POST', '/deleteTrip', $('#deleteTrip').serialize(), function () {
        loadTripsFromServer($('token').val());
    });

    return false;
};

var TripForm = function TripForm(props) {
    return React.createElement(
        "form",
        { id: "domoForm",
            onSubmit: handleTrip,
            name: "tripForm",
            action: "/maker",
            method: "POST",
            className: "domoForm"
        },
        React.createElement(
            "label",
            { htmlFor: "title" },
            "Name: "
        ),
        React.createElement("input", { id: "tripTitle", type: "text", name: "title", placeholder: "Title" }),
        React.createElement(
            "label",
            { htmlFor: "title" },
            "Location: "
        ),
        React.createElement("input", { id: "tripLocation", type: "text", name: "location", placeholder: "Location" }),
        React.createElement(
            "label",
            { htmlFor: "title" },
            "Details: "
        ),
        React.createElement("input", { id: "tripDetails", type: "text", name: "details", placeholder: "Details" }),
        React.createElement(
            "label",
            { htmlFor: "startDate" },
            "Date: "
        ),
        React.createElement("input", { id: "tripDate", type: "date", name: "startDate" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeDomoSubmit", type: "submit", value: "Make Trip" })
    );
};

var TripList = function TripList(props) {
    if (props.trips.length === 0) {
        return React.createElement(
            "div",
            { className: "domoList" },
            React.createElement(
                "h3",
                { className: "emptyDomo" },
                "No Trips yet"
            )
        );
    }

    var tripNodes = props.trips.map(function (trip) {
        console.dir(trip);
        return React.createElement(
            "div",
            { key: trip._id, className: "domo" },
            React.createElement("img", { src: "/assets/img/domoface.jpeg", alt: "domo face", className: "domoFace" }),
            React.createElement(
                "h3",
                { className: "domoName" },
                "Title: ",
                trip.title
            ),
            React.createElement(
                "h3",
                { className: "domoAge" },
                "Location: ",
                trip.location
            ),
            React.createElement(
                "h3",
                { className: "domoAge" },
                "Details: ",
                trip.details
            ),
            React.createElement(
                "form",
                { className: "delete", id: "deleteDomo", onSubmit: handleDelete },
                React.createElement("input", { type: "hidden", name: "_id", value: trip._id }),
                React.createElement("input", { id: "token", type: "hidden", name: "_csrf", value: props.csrf }),
                React.createElement("input", { style: { height: "20px" }, type: "image", src: "/assets/img/deleteButton.png", border: "0", alt: "Submit" })
            )
        );
    });

    return React.createElement(
        "div",
        { className: "domoList" },
        tripNodes
    );
};

var loadTripsFromServer = function loadTripsFromServer(csrf) {
    sendAjax('GET', '/getTrips', null, function (data) {
        console.dir(data);
        ReactDOM.render(React.createElement(TripList, { trips: data.trips, csrf: csrf }), document.querySelector("#domos"));
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(TripForm, { csrf: csrf }), document.querySelector("#makeDomo"));

    ReactDOM.render(React.createElement(TripList, { trips: [], csrf: csrf }), document.querySelector("#domos"));

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
    $("#domoMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
    $("#domoMessage").animate({ width: 'hide' }, 350);
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
