/*
    Handles user login
*/
const handleLogin = (e) => {
    e.preventDefault();

    $("#tripMessage").animate({width:"hide"},350);

    if($("#user").val() == '' || $("#pass").val() == '') {
        handleError("RAWR! Username or password is empty");
        return false;
    }

    console.log($("input[name=_csrf]").val());
    
    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
}

/*
    Handles user signup
*/
const handleSignup = (e) => {
    e.preventDefault();

    $("#tripMessage").animate({width:'hide'},350);

    if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("RAWR! All fields are required!");
        return false;
    }

    if($("#pass").val() !== $("#pass2").val()) {
        handleError("RAWR! Passwords do not match!");
        return false;
    }

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

    return false;
};

/*
    Generates the login form
*/
const LoginWindow = (props) => {
    return (
        <form id="loginForm" 
            name="loginForm" 
            onSubmit={handleLogin} 
            action="/login" 
            method="POST" 
            className="mainForm"
        >
            <h1 className="logo">Globe-Trotter</h1>
            <p>
                Start charting your next adventure!
            </p>
            <input className="formInput" id="user" type="text" name="username" placeholder="Username"/>
            <input className="formInput" id="pass" type="password" name="pass" placeholder="Password"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="formSubmit" type="submit" value="Log in"/>
            <span id="errorMessage"></span>
            <p className="signUpPrint">Don't have an account? <a id="signupButton" href="/signup" onClick={e => setUpSignupWindow(e, props.csrf)}>Sign up</a>!</p>
        </form>
    );
};

/*
    Generates the signup form
*/
const SignupWindow = (props) => {
    return (
        <form id="signupForm" 
            name="signupForm" 
            onSubmit={handleSignup} 
            action="/signup" 
            method="POST" 
            className="mainForm"
        >
            <h1 className="logo">Globe-Trotter</h1>
            <p>
                Start charting your next adventure!
            </p>
            <input className="formInput" id="user" type="text" name="username" placeholder="Username"/>
            <input className="formInput" id="pass" type="password" name="pass" placeholder="Password"/>
            <input className="formInput" id="pass2" type="password" name="pass2" placeholder="Retype Password"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="formSubmit" type="submit" value="Sign Up"/>
            <span id="errorMessage"></span>
            <p className="signUpPrint">Already have an account? <a id="loginButton" href="/login" onClick={e => setUpLoginWindow(e, props.csrf)}>Log in</a>!</p>
        </form>
    );
};

/*
    Renders the login form to the screen
*/
const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

/*
    Renders the signup form to the screen
*/
const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

/*
    Initial setup of signup window
*/
const setUpSignupWindow = (e, csrf) => {
    e.preventDefault();
    createSignupWindow(csrf);
}

/*
    Initial setup of login window
*/
const setUpLoginWindow = (e, csrf) => {
    e.preventDefault();
    createLoginWindow(csrf);
}

/*
    Gets the token for the current user
*/
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        createLoginWindow(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});
