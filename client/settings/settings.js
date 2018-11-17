const handlePasswordUpdate = (e) => {
    e.preventDefault();

    $("#tripMessage").animate({width:"hide"},350);

    if($("#pass").val() == '' || $("#newpass").val() == '' || $("#newpass2").val() == '') {
        handleError("You must fill out all required fields!");
        return false;
    }

    sendAjax($("#passwordForm").attr("method"), $("#passwordForm").attr("action"), $("#passwordForm").serialize(), redirect);

    return false;
}

const SettingsWindow = (props) => {
    const currentHour = new Date().getHours();
    let greeting = 'Good evening';

    if (currentHour < 12) {
        greeting = 'Good morning';
    } else if (currentHour < 18) {
        greeting = 'Good afternoon';
    }

    return (
        <div className="settings">
            <h1>Account Settings</h1>
            <h3>{greeting} {props.username}</h3>
            <form id="passwordForm" 
                name="passwordForm" 
                onSubmit={handlePasswordUpdate}
                action="/password" 
                method="PUT" 
                className="passwordForm"
            >
                <h2>Update Password</h2>
                <input className="formInput" id="pass" type="password" name="pass" placeholder="Current Password"/>
                <input className="formInput" id="newpass" type="password" name="newpass" placeholder="New Password"/>
                <input className="formInput" id="newpass2" type="password" name="newpass2" placeholder="Retype New Password"/>
                <input type="hidden" name="_csrf" value={props.csrf}/>
                <input className="formSubmit" type="submit" value="Change Password"/>
                <span id="errorMessage"></span>
            </form>
        </div>
    );
};

const setup = function(csrf, user) {
    ReactDOM.render(
        <SettingsWindow csrf={csrf} username={user.username} />,
        document.querySelector("#settings")
    );
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken, result.user);
    });
};

$(document).ready(function() {
    getToken();
});