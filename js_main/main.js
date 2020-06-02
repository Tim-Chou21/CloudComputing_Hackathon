
var bucketRegion = 'us-east-1';
var IdentityPoolId = "us-east-1:778b69d4-459a-4d99-b208-d49f5b46a70f";

AWS.config.region = 'us-east-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
IdentityPoolId: 'us-east-1:778b69d4-459a-4d99-b208-d49f5b46a70f',
});


$(document).ready(function(){
    $("#create-user-condition").click(function(){
      $("#create-user-condition-show").show();
      $("#speech_recognition").hide();
    });
  });

$(document).ready(function(){
    $("#create-speech").click(function(){
      $("#speech_recognition").show();
      $("#create-user-condition-show").hide();
    });
  });

function StoreCondition(){
    console.log($('#checkBox').prop("checked"));
    if($('#checkBox').prop("checked") == false){
      alert("請先上傳體溫");
      return;
    }
      var data = { 
        UserPoolId : _config.cognito.userPoolId,
          ClientId : _config.cognito.clientId
      };
      var userPool = new AmazonCognitoIdentity.CognitoUserPool(data);
      var cognitoUser = userPool.getCurrentUser();
      if (cognitoUser != null) {
        cognitoUser.getSession(function(err, session) {
            if (err) {
                alert(err);
                return;
            }
            //console.log('session validity: ' + session.isValid());
   //Set the profile info
        cognitoUser.getUserAttributes(function(err, result) {
          if (err) {
          console.log(err);
          return;
          }
          console.log(result);
          console.log("fuckkkkkk");
          console.log(result[2].getValue());
          console.log(document.getElementById("Health_condition_type").value)
          var d = new Date(); 
          var month = d.getMonth()+1; 
          var day = d.getDate(); 

          var outputtime = d.getFullYear()  +
          (month<10 ? '0' : '') + month  +
          (day<10 ? '0' : '') + day +':';
        

          
          AWS.config.region = 'us-east-1'; // Region
          AWS.config.credentials = new AWS.CognitoIdentityCredentials({
              IdentityPoolId: 'us-east-1:778b69d4-459a-4d99-b208-d49f5b46a70f',
          });

          var db = new AWS.DynamoDB({apiVersion: '2012-08-10', params: {TableName: "health_condition"}});
          
          var old_params = {
            TableName: 'health_condition',
            Key: {
              'email': {S: result[2].getValue()}
            }
          };
          
          // Call DynamoDB to read the item from the table
          db.getItem(old_params, function(err, data) {
            if (err) {
              console.log("Error", err);
            } else {
              //console.log("Success", data.Item['health']);
              // console.log(data.Item['health']["S"])
              var formData;
              if(data.Item['health'] == undefined){
                var params = {
                  ExpressionAttributeNames: {
                   "#AT": "health", 
                  }, 
                  ExpressionAttributeValues: {
                   ":t": {
                     S: outputtime + document.getElementById("Health_condition_type").value + '/'
                    }, 
                  }, 
                  Key: {
                   "email": {
                     S: result[2].getValue()
                    }
                  }, 
                  ReturnValues: "ALL_NEW", 
                  TableName: "health_condition", 
                  UpdateExpression: "SET #AT = :t"
                 };
              }
              else{
                var params = {
                  ExpressionAttributeNames: {
                   "#AT": "health", 
                  }, 
                  ExpressionAttributeValues: {
                   ":t": {
                     S: data.Item['health']["S"]+ outputtime + document.getElementById("Health_condition_type").value + '/'
                    }, 
                  }, 
                  Key: {
                   "email": {
                     S: result[2].getValue()
                    }
                  }, 
                  ReturnValues: "ALL_NEW", 
                  TableName: "health_condition", 
                  UpdateExpression: "SET #AT = :t"
                 };
                
              }
              
              db.updateItem(params, function(err, data) {
                if (err) {
                  console.log('Error adding item to database: ', err);
                } else {
                  console.log('Form data added to database.');
                  $('#Health_condition_type').val("");
                   
                }
              });
            }
          });
          
          
        });   
        
              });
        }
        alert("upload success!");
}
