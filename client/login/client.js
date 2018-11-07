const handleLogin = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:"hide"},350);

    if($("#user").val() == '' || $("#pass").val() == '') {
        handleError("RAWR! Username or password is empty");
        return false;
    }

    console.log($("input[name=_csrf]").val());
    
    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
}

const handleSignup = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'},350);

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
            <input id="user" type="text" name="username" placeholder="Username"/>
            <input id="pass" type="password" name="pass" placeholder="Password"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="formSubmit" type="submit" value="Log in"/>
            <p className="signUpPrint">Don't have an account? <a id="signupButton" href="/signup" onClick={e => setUpSignupWindow(e, props.csrf)}>Sign up</a>!</p>
        </form>
    );
};

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
            <input id="user" type="text" name="username" placeholder="Username"/>
            <input id="pass" type="password" name="pass" placeholder="Password"/>
            <input id="pass2" type="password" name="pass2" placeholder="Retype Password"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="formSubmit" type="submit" value="Sign Up"/>
            <p className="signUpPrint">Already have an account? <a id="loginButton" href="/login" onClick={e => setUpLoginWindow(e, props.csrf)}>Log in</a>!</p>
        </form>
    );
};

const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

const setUpSignupWindow = (e, csrf) => {
    e.preventDefault();
    createSignupWindow(csrf);
}

const setUpLoginWindow = (e, csrf) => {
    e.preventDefault();
    createLoginWindow(csrf);
}

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        createLoginWindow(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});
