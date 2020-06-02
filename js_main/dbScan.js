var count = 0;
AWS.config.region = 'us-east-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
IdentityPoolId: 'us-east-1:778b69d4-459a-4d99-b208-d49f5b46a70f',
});

var db = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
  var params = {
    TableName : "health_condition",
  };
function dbConsumer() {
    db.scan(params).eachPage((err, data, done) => {
        if (data != null) {
            var btns = new Array();
            $('#patients').html("");
            for (let index = 0; index < data.Items.length; index++) {
                const element = data.Items[index];
                var str = JSON.stringify(element)
                // console.log(str);
                var btn = $('<div class=patientList>' + '</div>').attr('health',element.health); 
                if(element.face == 1)
                  btn.html(element.email + '<img src='+'img/greendot.png'+'>'+'</img>'); 
                else
                  btn.html(element.email + '<img src='+'img/reddot.png'+'>'+'</img>');
                $('#patients').append(btn); 
                btns.push(btn); 
                
                // btn.click(function(){ 
                //         var modal = document.getElementById("myModal");
                //         document.getElementById("modal_condition").innerHTML=element.health;
                //         modal.style.display = "block";
                // });
                btn.click(function(){ 
                      var modal = document.getElementById("myModal");
                      var html = "";
                      $('.patientContent').html(html);
                      var span = document.getElementsByClassName("close")[0];
                      var x = element.health;
                      var voice = element.health_voice;
                      if(x == undefined){
                        alert("尚未上傳病況");
                      }
                      var Arr = x.split("/");
                      if(element.temperature == undefined){
                        for(i = 0;i < Arr.length - 1;i++){
                          console.log(i);
                          console.log(Arr[i]);
                          var format = Arr[i].split(':');
                          html += '<pre style="text-align: left;">' + format[0] + ': ' + format[1] + '<div>temparature: </div></pre>';
                        }
                      }
                      else{
                        var tempArray = element.temperature.split('/');
                        for(i = 0;i < Arr.length-1;i++){
                          console.log(i);
                          console.log(Arr[i]);
                          var format = Arr[i].split(':');
                          var temp;
                          if(tempArray[i] != undefined){
                            temp = tempArray[i].split(':')[1];
                            if(temp == undefined)
                              temp = "";
                          }
                          else{
                            temp = "";
                          }
                          html += '<pre style="text-align: left;">' + format[0] + ': ' + format[1] + '<div>temparature: ' + temp + '</div></pre>';
                        }
                      }
                      if(voice != undefined){
                        html += '<pre style="text-align: left;">' + voice + '</pre>';
                      }
                      
                      $('.patientContent').html(html);
                      modal.style.display = "block";

              });
            }
        }
        done();
    });
    setTimeout("dbConsumer()", 1000);
}
dbConsumer();

$(document).ready(function(){
  $("#close").click(function(){
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
  });
});


