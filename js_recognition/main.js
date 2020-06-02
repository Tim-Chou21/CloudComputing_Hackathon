var langs =
[['Afrikaans',       ['af-ZA']],
 ['Bahasa Indonesia',['id-ID']],
 ['Bahasa Melayu',   ['ms-MY']],
 ['Català',          ['ca-ES']],
 ['Čeština',         ['cs-CZ']],
 ['Deutsch',         ['de-DE']],
 ['English',         ['en-AU', 'Australia'],
                     ['en-CA', 'Canada'],
                     ['en-IN', 'India'],
                     ['en-NZ', 'New Zealand'],
                     ['en-ZA', 'South Africa'],
                     ['en-GB', 'United Kingdom'],
                     ['en-US', 'United States']],
 ['Español',         ['es-AR', 'Argentina'],
                     ['es-BO', 'Bolivia'],
                     ['es-CL', 'Chile'],
                     ['es-CO', 'Colombia'],
                     ['es-CR', 'Costa Rica'],
                     ['es-EC', 'Ecuador'],
                     ['es-SV', 'El Salvador'],
                     ['es-ES', 'España'],
                     ['es-US', 'Estados Unidos'],
                     ['es-GT', 'Guatemala'],
                     ['es-HN', 'Honduras'],
                     ['es-MX', 'México'],
                     ['es-NI', 'Nicaragua'],
                     ['es-PA', 'Panamá'],
                     ['es-PY', 'Paraguay'],
                     ['es-PE', 'Perú'],
                     ['es-PR', 'Puerto Rico'],
                     ['es-DO', 'República Dominicana'],
                     ['es-UY', 'Uruguay'],
                     ['es-VE', 'Venezuela']],
 ['Euskara',         ['eu-ES']],
 ['Français',        ['fr-FR']],
 ['Galego',          ['gl-ES']],
 ['Hrvatski',        ['hr_HR']],
 ['IsiZulu',         ['zu-ZA']],
 ['Íslenska',        ['is-IS']],
 ['Italiano',        ['it-IT', 'Italia'],
                     ['it-CH', 'Svizzera']],
 ['Magyar',          ['hu-HU']],
 ['Nederlands',      ['nl-NL']],
 ['Norsk bokmål',    ['nb-NO']],
 ['Polski',          ['pl-PL']],
 ['Português',       ['pt-BR', 'Brasil'],
                     ['pt-PT', 'Portugal']],
 ['Română',          ['ro-RO']],
 ['Slovenčina',      ['sk-SK']],
 ['Suomi',           ['fi-FI']],
 ['Svenska',         ['sv-SE']],
 ['Türkçe',          ['tr-TR']],
 ['български',       ['bg-BG']],
 ['Pусский',         ['ru-RU']],
 ['Српски',          ['sr-RS']],
 ['한국어',            ['ko-KR']],
 ['中文',             ['cmn-Hans-CN', '普通话 (中国大陆)'],
                     ['cmn-Hans-HK', '普通话 (香港)'],
                     ['cmn-Hant-TW', '中文 (台灣)'],
                     ['yue-Hant-HK', '粵語 (香港)']],
 ['日本語',           ['ja-JP']],
 ['Lingua latīna',   ['la']]];

for (var i = 0; i < langs.length; i++) {
  select_language.options[i] = new Option(langs[i][0], i);
}
select_language.selectedIndex = 29;
updateCountry();
select_dialect.selectedIndex = 2;

function updateCountry() {
  for (var i = select_dialect.options.length - 1; i >= 0; i--) {
    select_dialect.remove(i);
  }
  var list = langs[select_language.selectedIndex];
  for (var i = 1; i < list.length; i++) {
    select_dialect.options.add(new Option(list[i][1], list[i][0]));
  }
  select_dialect.style.visibility = list[1].length == 1 ? 'hidden' : 'hidden';
}

var create_email = false;
var create_txt = false;
var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;
if (!('webkitSpeechRecognition' in window)) {
  upgrade();
} else {
  start_button.style.display = 'inline-block';
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = function() {
    recognizing = true;
    start_img.src = 'img/mic-animate.gif';
  };

  recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
      start_img.src = 'img/mic.png';

      ignore_onend = true;
    }
    if (event.error == 'audio-capture') {
      start_img.src = 'img/mic.png';

      ignore_onend = true;
    }
    if (event.error == 'not-allowed') {
      if (event.timeStamp - start_timestamp < 100) {

      } else {

      }
      ignore_onend = true;
    }
  };

  recognition.onend = function() {
    recognizing = false;
    if (ignore_onend) {
      return;
    }
    start_img.src = 'img/mic.png';
    if (!final_transcript) {
      showInfo('info_start');
      return;
    }
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
      var range = document.createRange();
      range.selectNode(document.getElementById('final_span'));
      window.getSelection().addRange(range);
    }
    if (create_email) {
      create_email = false;
      createEmail();
    }
    if(create_txt) {
      create_txt = false;
      GenerateTxt();
    }
  };

  recognition.onresult = function(event) {
    var d = new Date(); 
          var month = d.getMonth()+1; 
          var day = d.getDate(); 

          var time = d.getFullYear()  +
          (month<10 ? '0' : '') + month  +
          (day<10 ? '0' : '') + day +':';
    

    var interim_transcript = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
     
        final_transcript += time + event.results[i][0].transcript + "\n";
        //firebase.database().ref('kevin').push(event.results[i][0].transcript);
        var postData = {
          name :'Tim',
          content: event.results[i][0].transcript,
          time: time
        };
                    
        
      } else {
        interim_transcript += event.results[i][0].transcript; 
      }
    }
    final_transcript = capitalize(final_transcript);
    final_span.innerHTML = linebreak(final_transcript);
    interim_span.innerHTML = linebreak(interim_transcript);
    if (final_transcript || interim_transcript) {
      showButtons('inline-block');
    }

  };
}

var two_line = /\n\n/g;
//var one_line = /\n\n/g;
//var two_line = /\n/g;
var one_line = /\n/g;
function linebreak(s) {
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

var first_char = /\S/;
function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

function createEmail() {
  //var n = final_transcript.indexOf('\n');
  var n = final_transcript;
  var Today=new Date();
  var day = Today.getDay()
  var h=Today.getHours();
　var m=Today.getMinutes();
  var s=Today.getSeconds();
  if (day == 0) 
    day = "Sun"
  else if (day == 1) 
    day = "Mon"
  else if (day == 2) 
    day = "Tue"
  else if (day == 3) 
    day = "Wed"
  else if (day == 4) 
    day = "Thur"
  else if (day == 5) 
    day = "Fri"
  else if (day == 6) 
    day = "Sat"

  if (n < 0 || n >= 80) {
    n = 40 + final_transcript.substring(40).indexOf(' ');
  }
  //var subject = encodeURI(final_transcript.substring(0, n));
  
  var subject = "Speech Recognition"
  var Da = day+", "+Today.getFullYear()+ "/" + (Today.getMonth()+1)+"/" + Today.getDate()+"\n"+"----------------------";
  var body = encodeURI(Da+"\n"+final_transcript.substr(0));
  window.location.href = 'mailto:?subject=' + subject + '&body=' +body;
}

function GenerateTxt() {
  //var n = final_transcript.indexOf('\n');
  var n = final_transcript;
  var Today=new Date();
  var day = Today.getDay()
  var h=Today.getHours();
　var m=Today.getMinutes();
  var s=Today.getSeconds();
  if (day == 0) 
    day = "Sun"
  else if (day == 1) 
    day = "Mon"
  else if (day == 2) 
    day = "Tue"
  else if (day == 3) 
    day = "Wed"
  else if (day == 4) 
    day = "Thur"
  else if (day == 5) 
    day = "Fri"
  else if (day == 6) 
    day = "Sat"

  
  var Da = day+", "+Today.getFullYear()+ "/" + (Today.getMonth()+1)+"/" + Today.getDate()+"\n"+"----------------------";

  exportRaw('Speech_Recognition.txt',Da+"\n"+final_transcript.substr(0))
}


function sendButton(){
  if (recognizing) {
    create_txt = true;
    recognizing = false;
    recognition.stop();
  } else {
    sendtoDB()
  }
}

function sendtoDB() {
  var data = { 
    UserPoolId : _config.cognito.userPoolId,
      ClientId : _config.cognito.clientId
  };

  var userPool = new AmazonCognitoIdentity.CognitoUserPool(data);
  var cognitoUser = userPool.getCurrentUser();
  cognitoUser.getSession(function(err, session) {
    cognitoUser.getUserAttributes(function(err, result) {
      if (err) {
        console.log(err);
        return;
        }
        AWS.config.region = 'us-east-1'; // Region
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: 'us-east-1:778b69d4-459a-4d99-b208-d49f5b46a70f',
        });
        var db = new AWS.DynamoDB({apiVersion: '2012-08-10', params: {TableName: "health_condition"}});

        var params = {
          ExpressionAttributeNames: {
           "#AT": "health_voice", 
          }, 
          ExpressionAttributeValues: {
           ":t": {
             S: final_transcript.substr(0)
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
         
        db.updateItem(params, function(err, data) {
          if (err) {
            console.log('Error adding item to database: ', err);
          } else {
            console.log('Form data added to database.');
            alert("success!!")
          }
        });
    });
  })
  
}




function copyButton() {
  if (recognizing) {
    create_txt = true;
    recognizing = false;
    recognition.stop();
  } else {
    GenerateTxt()
  }
  //copy_button.style.display = 'none';
  //copy_info.style.display = 'inline-block';
  //showInfo('');
}

function emailButton() {
  if (recognizing) {
    create_email = true;
    recognizing = false;
    recognition.stop();
  } else {
    createEmail();
  }
  //email_button.style.display = 'none';
  //email_info.style.display = 'inline-block';
  //showInfo('');
}


function startButton(event) {

  if (recognizing) {
    recognition.stop();
    return;
  }
  final_transcript = '';
  recognition.lang = select_dialect.value;
  recognition.start();
  ignore_onend = false;
  final_span.innerHTML = '';
  interim_span.innerHTML = '';
  start_img.src = 'img/mic-slash.png';
  showButtons('none');

  //start_timestamp = event.timeStamp;
}


var current_style;
function showButtons(style) {
  if (style == current_style) {
    return;
  }
  current_style = style;
  copy_button.style.display = style;
  email_button.style.display = style;
  //copy_info.style.display = 'none';
  //email_info.style.display = 'none';
}
function fakeClick(obj) {
   var ev = document.createEvent("MouseEvents");
   ev.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
   obj.dispatchEvent(ev);
}

function exportRaw(name, data) {
     var urlObject = window.URL || window.webkitURL || window;
     var export_blob = new Blob([data]);
     var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
     save_link.href = urlObject.createObjectURL(export_blob);
     save_link.download = name;
     fakeClick(save_link);
   } 

function showDate() {
 
  var Today=new Date();
  var day = Today.getDay()
  var h=Today.getHours();
　var m=Today.getMinutes();
  var s=Today.getSeconds();
  if (day == 0) 
    day = "Sun"
  else if (day == 1) 
    day = "Mon"
  else if (day == 2) 
    day = "Tue"
  else if (day == 3) 
    day = "Wed"
  else if (day == 4) 
    day = "Thur"
  else if (day == 5) 
    day = "Fri"
  else if (day == 6) 
    day = "Sat"

  if (m<10) m = "0"+m;
  if (s<10) s = "0"+s;

  document.getElementById('showdate').innerHTML = day +", "+Today.getFullYear()+ "/" + (Today.getMonth()+1) + "/" + Today.getDate()+" - "+h+":"+m+":"+s
  setTimeout('showDate()',1000);
}

$('#btn').click(function(){
    var url = "https://hooks.slack.com/services/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";
    var text1 = final_transcript.substr(0);
    var payload={"text": text1,"username": "Speech Recognition","icon_emoji": ":loudspeaker:","channel": "#general"};
    //var icon_url = "https://slack.com/img/icons/app-57.png";
    //var username =  "fuckkk";

    $.post(url,JSON.stringify(payload),function(data){

    })
    var Today=new Date();
    var day = Today.getDay()
    var h=Today.getHours();
　  var m=Today.getMinutes();
    var s=Today.getSeconds();
    if (day == 0) 
    day = "Sun"
  else if (day == 1) 
    day = "Mon"
  else if (day == 2) 
    day = "Tue"
  else if (day == 3) 
    day = "Wed"
  else if (day == 4) 
    day = "Thur"
  else if (day == 5) 
    day = "Fri"
  else if (day == 6) 
    day = "Sat"

  if (m<10) m = "0"+m;
  if (s<10) s = "0"+s;
    //firebase.database().ref('/').set({text:text1});
})

