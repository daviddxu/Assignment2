
//Server Code
//import fs  to read and writeTOFile
var fs = require('fs');

var http = require('http'); //need to http
var url = require('url');  //to parse url strings

var counter = 1000; //to count invocations of function(req,res)


var ROOT_DIR = 'html'; //dir to serve static files from

var MIME_TYPES = {
    'css': 'text/css',
    'gif': 'image/gif',
    'htm': 'text/html',
    'html': 'text/html',
    'ico': 'image/x-icon',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpeg',
    'js': 'text/javascript', //should really be application/javascript
    'json': 'application/json',
    'png': 'image/png',
    'txt': 'text/plain'
};

var get_mime = function(filename) {
    var ext, type;
    for (ext in MIME_TYPES) {
        type = MIME_TYPES[ext];
        if (filename.indexOf(ext, filename.length - ext.length) !== -1) {
            return type;
        }
    }
    return MIME_TYPES['txt'];
};

// get user song title
function get_song( title){

 	console.log("getting song");
	var song_title = title;

	for(song_title in songs){

		if(song_title == title){
			for(let i = 0; i < songs[title].length; i++){
			//	console.log("this ran");
				array[i] = songs[title][i];
			}
		}


	}


	return array;
}

function update_file(updated_array){


}

//creating th server
http.createServer(function (request,response){
     var urlObj = url.parse(request.url, true, false);
     console.log('\n============================');
	 console.log("PATHNAME: " + urlObj.pathname);
     console.log("REQUEST: " + ROOT_DIR + urlObj.pathname);
     console.log("METHOD: " + request.method);

     var receivedData = '';

     //attached event handlers to collect the message data
     request.on('data', function(chunk) {
        receivedData += chunk;
     });

	 //event handler for the end of the message
     request.on('end', function(){
        console.log('received data: ', receivedData);
        console.log('type: ', typeof receivedData);

		//if it is a POST request then echo back the data.
		if(request.method == "POST"){
		   var dataObj = JSON.parse(receivedData);
           console.log('received data object: ', dataObj);
           console.log('type: ', typeof dataObj);
		   //Here we can decide how to process the data object and what
		   //object to send back to client.
		   //FOR NOW EITHER JUST PASS BACK AN OBJECT
		   //WITH "text" PROPERTY

		   /*
			if return object is empty, return "NOT FOUND" to client
		   */

			if(dataObj.text == "Sister Golden Hair"){
				dataObj.title = "Sister Golden Hair";
			}
			if(dataObj.text == "Brown Eyed Girl"){
				dataObj.title = "Brown Eyed Girl";
			}
			if(dataObj.text == "Peaceful Easy Feeling"){
				dataObj.title = "Peaceful Easy Feeling";
			}

			if(dataObj.title == "Sister Golden Hair"){

				if(dataObj.type == "update"){
 					//(1) update sisterGoldenHair array (2) "Sister Golden Hair.txt";
					array = dataObj.wordArray;
					for(let i = 0; i < array; i++){
						console.log(array.word, array.x, array.y);
					}
					sisterGoldenHair = [];
					for(let i = 0; i < array.length; i++){
						sisterGoldenHair[i] = array[i];
					}

					//file write

				var a_str = "";

				for(let i = 0; i < sisterGoldenHair.length; i++){
					a_str+=sisterGoldenHair[i];
				}

				}

				var returnObj = {};

				returnObj.wordArray = sisterGoldenHair;

        fs.writeFile('songs/Sister Golden Hair.txt', dataObj.stringText, function(err) {
          if(err) throw err;

        });






				response.writeHead(200, {'Content-Type': MIME_TYPES["text"]});  //does not work with application/json MIME
					response.end(JSON.stringify(returnObj)); //send just the JSON object



				}

	 	if(dataObj.title == "Brown Eyed Girl"){
				if(dataObj.type == "update"){
 					//(1) update brownEyedGirl array (2) "Brown Eyed Girl.txt";
					array = dataObj.wordArray;
					for(let i = 0; i < array; i++){
						console.log(array.word, array.x, array.y);
					}
					brownEyedGirl = [];
					for(let i = 0; i < array.length; i++){
						brownEyedGirl[i] = array[i];
					}

				var a_str = "";

				for(let i = 0; i < brownEyedGirl.length; i++){
					a_str+=brownEyedGirl[i];
				}

				}

				var returnObj = {};

						returnObj.wordArray = brownEyedGirl;
            fs.writeFile('songs/Brown Eyed Girl.txt', dataObj.stringText, function(err) {
              if(err) throw err;

            });

						response.writeHead(200, {'Content-Type': MIME_TYPES["text"]});  //does not work with application/json MIME
						response.end(JSON.stringify(returnObj)); //send just the JSON object


			}

	 	if(dataObj.title == "Peaceful Easy Feeling"){

		if(dataObj.type == "update"){
 					//(1) update peacefulEasyFeeling array (2) "Peaceful Easy Feeling.txt";
					array = dataObj.wordArray;
					for(let i = 0; i < array; i++){
						console.log(array.word, array.x, array.y);
					}
					peacefulEasyFeeling = [];
					for(let i = 0; i < array.length; i++){
						peacefulEasyFeeling[i] = array[i];
					}

				var a_str = "";

				for(let i = 0; i < peacefulEasyFeeling.length; i++){
					a_str+=peacefulEasyFeeling[i];
				}
				}

				var returnObj = {};

				returnObj.wordArray = peacefulEasyFeeling;
				response.writeHead(200, {'Content-Type': MIME_TYPES["text"]});  //does not work with application/json MIME
				response.end(JSON.stringify(returnObj)); //send just the JSON object


			}
		   //TO DO: return the words array that the client requested
		   //if it exists

		   else{console.log("USER REQUEST: " + dataObj.text );
		   var returnObj = {};
		   returnObj.title = dataObj.title;
		   returnObj.text = 'NOT FOUND: ' + dataObj.text;
		   }

       //file write to


       fs.writeFile('songs/Peaceful Easy Feeling.txt', dataObj.stringText, function(err) {
         if(err) throw err;

       });
		   //object to return to client
          response.writeHead(200, {'Content-Type': MIME_TYPES["text"]});  //does not work with application/json MIME
           response.end(JSON.stringify(returnObj)); //send just the JSON object
		}
     });

     if(request.method == "GET"){
	 //handle GET requests as static file requests
	 var filePath = ROOT_DIR + urlObj.pathname;
	 if(urlObj.pathname === '/') filePath = ROOT_DIR + '/assign1.html';

     fs.readFile(filePath, function(err,data){
       if(err){
		  //report error to console
          console.log('ERROR: ' + JSON.stringify(err));
		  //respond with not found 404 to client
          response.writeHead(404);
          response.end(JSON.stringify(err));
          return;
         }
         response.writeHead(200, {'Content-Type': get_mime(filePath)});
         response.end(data);
       });
	 }


 }).listen(3000);

console.log('Server Running at http://127.0.0.1:3000  CNTL-C to quit');
