"use strict";

var handlePasswordUpdate = function handlePasswordUpdate(e) {
    e.preventDefault();

    $("#tripMessage").animate({ width: "hide" }, 350);

    if ($("#pass").val() == '' || $("#newpass").val() == '' || $("#newpass2").val() == '') {
        handleError("You must fill out all required fields!");
        return false;
    }

    sendAjax($("#passwordForm").attr("method"), $("#passwordForm").attr("action"), $("#passwordForm").serialize(), redirect);

    return false;
};

var SettingsWindow = function SettingsWindow(props) {
    var currentHour = new Date().getHours();
    var greeting = 'Good evening';

    if (currentHour < 12) {
        greeting = 'Good morning';
    } else if (currentHour < 18) {
        greeting = 'Good afternoon';
    }

    return React.createElement(
        "div",
        { className: "settings" },
        React.createElement(
            "h1",
            null,
            "Account Settings"
        ),
        React.createElement(
            "h3",
            null,
            greeting,
            " ",
            props.username
        ),
        React.createElement(
            "form",
            { id: "passwordForm",
                name: "passwordForm",
                onSubmit: handlePasswordUpdate,
                action: "/password",
                method: "PUT",
                className: "passwordForm"
            },
            React.createElement(
                "h2",
                null,
                "Update Password"
            ),
            React.createElement("input", { className: "formInput", id: "pass", type: "password", name: "pass", placeholder: "Current Password" }),
            React.createElement("input", { className: "formInput", id: "newpass", type: "password", name: "newpass", placeholder: "New Password" }),
            React.createElement("input", { className: "formInput", id: "newpass2", type: "password", name: "newpass2", placeholder: "Retype New Password" }),
            React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
            React.createElement("input", { className: "formSubmit", type: "submit", value: "Change Password" }),
            React.createElement("span", { id: "errorMessage" })
        )
    );
};

var setup = function setup(csrf, user) {
    ReactDOM.render(React.createElement(SettingsWindow, { csrf: csrf, username: user.username }), document.querySelector("#settings"));
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken, result.user);
    });
};

$(document).ready(function () {
    getToken();
});
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
};

var redirect = function redirect(response) {
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
