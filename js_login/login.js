AWS.config.region = 'us-east-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
IdentityPoolId: 'us-east-1:778b69d4-459a-4d99-b208-d49f5b46a70f',
});
function signInButton() {

    var authenticationData = {
        Username : $('#email_type').val(),
        Password : $("#password_type").val(),
    };

    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

    var poolData = {
        UserPoolId : _config.cognito.userPoolId, // Your user pool id here
        ClientId : _config.cognito.clientId, // Your client id here
    };

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    var userData = {
        Username : $('#email_type').val(),
        Pool : userPool,
    };

    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            var accessToken = result.getAccessToken().getJwtToken();

            console.log(accessToken);	
            console.log("login success");
            if($('#dOrp').val() == "d")
                location.replace("main_doc.html");
            else if($('#dOrp').val() == "p")
                location.replace("main.html");
            else
                location.replace("main.html");
        },

        onFailure: function(err) {
            alert(err.message || JSON.stringify(err));
        },
    });
}

