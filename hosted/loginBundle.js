"use strict";

var handleLogin = function handleLogin(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: "hide" }, 350);

    if ($("#user").val() == '' || $("#pass").val() == '') {
        handleError("RAWR! Username or password is empty");
        return false;
    }

    console.log($("input[name=_csrf]").val());

    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
};

var handleSignup = function handleSignup(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("RAWR! All fields are required!");
        return false;
    }

    if ($("#pass").val() !== $("#pass2").val()) {
        handleError("RAWR! Passwords do not match!");
        return false;
    }

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

    return false;
};

var LoginWindow = function LoginWindow(props) {
    return React.createElement(
        "form",
        { id: "loginForm",
            name: "loginForm",
            onSubmit: handleLogin,
            action: "/login",
            method: "POST",
            className: "mainForm"
        },
        React.createElement(
            "h1",
            { className: "logo" },
            "Globe-Trotter"
        ),
        React.createElement(
            "p",
            null,
            "Start charting your next adventure!"
        ),
        React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "Username" }),
        React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "Password" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "formSubmit", type: "submit", value: "Log in" }),
        React.createElement(
            "p",
            { className: "signUpPrint" },
            "Don't have an account? ",
            React.createElement(
                "a",
                { id: "signupButton", href: "/signup", onClick: function onClick(e) {
                        return setUpSignupWindow(e, props.csrf);
                    } },
                "Sign up"
            ),
            "!"
        )
    );
};

var SignupWindow = function SignupWindow(props) {
    return React.createElement(
        "form",
        { id: "signupForm",
            name: "signupForm",
            onSubmit: handleSignup,
            action: "/signup",
            method: "POST",
            className: "mainForm"
        },
        React.createElement(
            "h1",
            { className: "logo" },
            "Globe-Trotter"
        ),
        React.createElement(
            "p",
            null,
            "Start charting your next adventure!"
        ),
        React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "Username" }),
        React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "Password" }),
        React.createElement("input", { id: "pass2", type: "password", name: "pass2", placeholder: "Retype Password" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "formSubmit", type: "submit", value: "Sign Up" }),
        React.createElement(
            "p",
            { className: "signUpPrint" },
            "Already have an account? ",
            React.createElement(
                "a",
                { id: "loginButton", href: "/login", onClick: function onClick(e) {
                        return setUpLoginWindow(e, props.csrf);
                    } },
                "Log in"
            ),
            "!"
        )
    );
};

var createLoginWindow = function createLoginWindow(csrf) {
    ReactDOM.render(React.createElement(LoginWindow, { csrf: csrf }), document.querySelector("#content"));
};

var createSignupWindow = function createSignupWindow(csrf) {
    ReactDOM.render(React.createElement(SignupWindow, { csrf: csrf }), document.querySelector("#content"));
};

var setUpSignupWindow = function setUpSignupWindow(e, csrf) {
    e.preventDefault();
    createSignupWindow(csrf);
};

var setUpLoginWindow = function setUpLoginWindow(e, csrf) {
    e.preventDefault();
    createLoginWindow(csrf);
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        createLoginWindow(result.csrfToken);
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
