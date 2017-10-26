dataObj);

          if (dataObj.text){ 
		 var flag = 0;
		for(i in wordArray){
			if(wordArray[i] == dataObj.text){//word is already in array
				wordArray[i].x = dataObj.x;
				wordArray[i].y = dataObj.y;
				flag = 1;
			}
		}
		if(flag == 0){//word not already in array
		  wordArray.push({word:dataObj.text,x:dataObj.x,y:dataObj.y});}
		  }
          if(dataObj.text2) userLoginArray.push({word:dataObj.text2,x:50,y:50})
           returnObj = {};
           returnObj.wordArray =wordArray;
           returnObj.userLoginArray=userLoginArray;





		   //object to return to client
          response.writeHead(200, {'Content-Type': MIME_TYPES['text']});  //does not work with application/json MIME
           response.end(JSON.stringify(returnObj)); //send just the JSON object
		}
     });

     if(request.method == "GET"){
	 //handle GET requests as static file requests
	 var filePath = ROOT_DIR + urlObj.pathname;
	 if(urlObj.pathname === '/') filePath = ROOT_DIR + '/assignment2.html';

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
