var username;
var password;
var personalname;
var poolData;			
function registerButton() {
    personalname = $('#username_type').val();
    username = $('#email_type').val();
    password =  document.getElementById("password_type").value;	

poolData = {
        UserPoolId : _config.cognito.userPoolId, // Your user pool id here
        ClientId : _config.cognito.clientId // Your client id here
    };		
var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

var attributeList = [];

var dataEmail = {
    Name : 'email', 
    Value : username, //get from form field
};

var dataPersonalName = {
    Name : 'name', 
    Value : personalname, //get from form field
};

var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
var attributePersonalName = new AmazonCognitoIdentity.CognitoUserAttribute(dataPersonalName);


attributeList.push(attributeEmail);
attributeList.push(attributePersonalName);

userPool.signUp(username, password, attributeList, null, function(err, result){
        if (err) {
            alert(err.message || JSON.stringify(err));
            return;
        }
        cognitoUser = result.user;
        console.log('user name is ' + cognitoUser.getUsername());
        //change elements of page
        

        var email = cognitoUser.getUsername();
        AWS.config.region = 'us-east-1'; // Region
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: 'us-east-1:778b69d4-459a-4d99-b208-d49f5b46a70f',
        });
        
        var formData = {
            Item: {
                "email" : {'S':email},
                "health": {'S': ""},
                "face": {"N": '1'},
                "temperature": {"S": ""}
            }
        };

        // var inRoomData = {
        //     Item: {
        //         "email": {"S": email},
        //         "face": {"N": '1'}
        //     }
        // }

        // var dbUserInRoom = new AWS.DynamoDB({apiVersion:'2012-08-10', params:{TableName:"inRoom"}});
        // dbUserInRoom.putItem(inRoomData, function(err, data) {
        //     if (err) console.log(err);
        //     else console.log(data);
        // });

        var dbUserHealth = new AWS.DynamoDB({apiVersion:'2012-08-10', params:{TableName:"health_condition"}});
        dbUserHealth.putItem(formData, function(err, data) {
            if (err) console.log(err);
            else console.log(data);
        });
        
        
        // location.replace("login.html");
    });
}