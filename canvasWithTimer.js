
//Use javascript array of objects to represent words and their locations
//default song: "PEACEFUL EASY FEELING"
var words = [];

var users=[];





//indended for keyboard control



var timer;

var wordBeingMoved;
var songTitle;
var rect;
var canvasX;
var canvasY;

var deltaX, deltaY; //location where mouse is pressed
var canvas = document.getElementById('canvas1'); //our drawing canvas
var canvas2 = document.getElementById('canvas2'); //display active users

function getWordAtLocation(aCanvasX, aCanvasY){

	// get user word
	var context= canvas.getContext('2d');

		for(var i=0; i<words.length; i++){
		 if(aCanvasX> words[i].x && aCanvasX< (words[i].x+ context.measureText(words[i].word).width)&&
				Math.abs(words[i].y - aCanvasY) < 15) return words[i];
		}
	  return null;
    }

var drawCanvas = function(){


	/*TESTING PLACEHOLDER*/
	//drawCanvas2();

	var context = canvas.getContext('2d');

    context.fillStyle = 'white';
    context.fillRect(0,0,canvas.width,canvas.height); //erase canvas

    context.font = '30pt Arial';
    context.fillStyle = 'cornflowerblue';
    context.strokeStyle = 'blue';

    //wordbank
    context.fillStyle = 'red';
    context.fillRect(300,0,10,300);

    context.fillRect(0,30,300,10);

    context.fillStyle= 'black';
    context.fillText("Words bank", 50,30);


    var line_y_position=50;
    for (let i =0; i<5; i++){

      context.fillRect(310,30+line_y_position,700,10);

      line_y_position+=50;

    }

		for(var i=0; i<words.length; i++){  //note i declared as var

			var data = words[i];
			context.fillText(data.word, data.x, data.y);
            context.strokeText(data.word, data.x, data.y);

	}

	/*TESTING*/
	drawCanvas2();

}

var drawCanvas2 = function(){

		var context = canvas2.getContext('2d');
		context.font = '30pt Arial';
		context.fillStyle= 'black';
	    context.fillText("Active users", 50, 30);
			console.log("this is the usersLoginArray in drawCanvas2"+ users); //note i declared as var


			for(var i=0; i<users.length; i++){

				var data = users[i];

				context.fillText(data.word, data.x, data.y);
	            context.strokeText(data.word, data.x, data.y);
 
		}

}
function handleMouseDown(e){

	//get mouse location relative to canvas top left
	rect = canvas.getBoundingClientRect();
    //var canvasX = e.clientX - rect.left;
    //var canvasY = e.clientY - rect.top;
    canvasX = e.pageX - rect.left; //use jQuery event object pageX and pageY
    canvasY = e.pageY - rect.top;
	console.log("mouse down:" + canvasX + ", " + canvasY);

	wordBeingMoved = getWordAtLocation(canvasX, canvasY);
	//console.log(wordBeingMoved.word);
	if(wordBeingMoved != null ){
	   deltaX = wordBeingMoved.x - canvasX;
	   deltaY = wordBeingMoved.y - canvasY;
	   //document.addEventListener("mousemove", handleMouseMove, true);
       //document.addEventListener("mouseup", handleMouseUp, true);
	$("#canvas1").mousemove(handleMouseMove);
	$("#canvas1").mouseup(handleMouseUp);

	}

    // Stop propagation of the event and stop any default
    //  browser action

    e.stopPropagation();
    e.preventDefault();

	drawCanvas();
	}

function handleMouseMove(e){

	console.log("mouse move");

	//get mouse location relative to canvas top left
	rect = canvas.getBoundingClientRect();
    canvasX = e.pageX - rect.left;
    canvasY = e.pageY - rect.top;

	wordBeingMoved.x = canvasX + deltaX;
	wordBeingMoved.y = canvasY + deltaY;

	var dataObj = {text: wordBeingMoved, x: wordBeingMoved.x, y: wordBeingMoved.y};
	
	var jsonString = JSON.stringify(dataObj);

	$.post("word", jsonString, function(data, status){
	console.log("data: " + data);
	console.log("typeof: " + typeof data);	
	var responseObj = JSON.parse(data);
	if(responseObj.wordArray) words = responseObj.wordArray;

	} );
	e.stopPropagation();

	drawCanvas();
	}

function handleMouseUp(e){
	console.log("mouse up");

	e.stopPropagation();
	

    //$("#canvas1").off(); //remove all event handlers from canvas
    //$("#canvas1").mousedown(handleMouseDown); //add mouse down handler

	//remove mouse move and mouse up handlers but leave mouse down handler
    $("#canvas1").off("mousemove", handleMouseMove); //remove mouse move handler
    $("#canvas1").off("mouseup", handleMouseUp); //remove mouse up handler

	drawCanvas(); //redraw the canvas
	}

//JQuery Ready function -called when HTML has been parsed and DOM
//created
//can also be just $(function(){...});
//much JQuery code will go in here because the DOM will have been loaded by the time
//this runs



    //KEY CODES
	//should clean up these hard coded key codes
	var ENTER = 13;
	var RIGHT_ARROW = 39;
	var LEFT_ARROW = 37;
	var UP_ARROW = 38;
	var DOWN_ARROW = 40;


function handleKeyDown(e){

	console.log("keydown code = " + e.which );

	var dXY = 5; //amount to move in both X and Y direction
	if(e.which == UP_ARROW && movingBox.y >= dXY)
	   movingBox.y -= dXY;  //up arrow
	if(e.which == RIGHT_ARROW && movingBox.x + movingBox.width + dXY <= canvas.width)
	   movingBox.x += dXY;  //right arrow
	if(e.which == LEFT_ARROW && movingBox.x >= dXY)
	   movingBox.x -= dXY;  //left arrow
	if(e.which == DOWN_ARROW && movingBox.y + movingBox.height + dXY <= canvas.height)
	   movingBox.y += dXY;  //down arrow

    var keyCode = e.which;
    if(keyCode == UP_ARROW | keyCode == DOWN_ARROW){
       //prevent browser from using these with text input drop downs
       e.stopPropagation();
       e.preventDefault();
	}

}

function handleKeyUp(e){
	console.log("key UP: " + e.which);
	if(e.which == RIGHT_ARROW | e.which == LEFT_ARROW | e.which == UP_ARROW | e.which == DOWN_ARROW){
	var dataObj = {x: movingBox.x, y: movingBox.y};
	//create a JSON string representation of the data object
	var jsonString = JSON.stringify(dataObj);


	$.post("positionData", jsonString, function(data, status){
			console.log("data: " + data);
			console.log("typeof: " + typeof data);
			var wayPoint = JSON.parse(data);
			wayPoints.push(wayPoint);
			for(i in wayPoints) console.log(wayPoints[i]);
			});
	}

	if(e.which == ENTER){
	   handleSubmitButton(); //treat ENTER key like you would a submit
	   $('#userTextField').val(''); //clear the user text field
	}

	e.stopPropagation();
    e.preventDefault();


}

function handleSubmitButton() {

    var userText = $('#userTextField').val(); //get text from user text input field
	if(userText && userText != ''){
	   //user text was not empty
		var userRequestObj = {text: userText, x:Math.round(Math.random()*150),y:Math.round(Math.random()*150)}; //make object to send to server
		userRequestObj.text = userText;
		userRequestObj.type = "submit";
		var userRequestJSON = JSON.stringify(userRequestObj); //make json string
	   $('#userTextField').val(''); //clear the user text field

	   //Prepare a POST message for the server and a call back function
	   //to catch the server repsonse.
       //alert ("You typed: " + userText);
	   $.post("userText", userRequestJSON, function(data, status){
			console.log("data: " + data);
			console.log("typeof: " + typeof data);
			var responseObj = JSON.parse(data);
			songTitle = responseObj.title;
			console.log("Song title: " + songTitle);

			//songTitle = responseObj.text;
			//replace word array with new words if there are any
			if(responseObj.wordArray) words = responseObj.wordArray;
			drawCanvas();
			drawCanvas2();
			});

	}

}


function handleLoginButton() {
	// the next word user choose

  var loginName = document.getElementById('loginTextField').value;
  var loginTestField = document.getElementById('loginTextField');
  if(loginTestField &&loginName !=""){
    var userRequestObj = {text2: loginName};
		       var userRequestJSON = JSON.stringify(userRequestObj);
		       document.getElementById('loginTextField').value = "";
		       console.log(loginName);}
  var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://127.0.0.1:3000');
    xhr.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    console.log(this);
    var responseObj= JSON.parse(xhr.responseText);
		console.log(responseObj.wordArray);
 
    if ((responseObj.userLoginArray)) users = responseObj.userLoginArray;
		drawCanvas2();


  }
};
    xhr.withCredentials = true;
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(userRequestJSON);
		drawCanvas2();
	}







    function getWordPreciseLocater(aCanvasX, aCanvasY){


    	  //locate the word near aCanvasX,aCanvasY
    	  //Just use crude region for now.
    	  //should be improved to using lenght of word etc.

    	  //note you will have to click near the start of the word
    	  //as it is implemented now
    	  for(var i=0; i<words.length; i++){
    		 if((words[i].x == aCanvasX)  &&
    		    (words[i].y == aCanvasY)) return words[i];
    	  }

    	  return null;
      }
// This function get the position of the words from the smalllest to the biggest
// then add to an empty string
function songToBeReturn(){
      var songToBeReturn = "";
      for (let i = 0; i< canvas.height; i++){
        for(let j =0; j< canvas.width; j++){
          if (getWordPreciseLocater(j,i)) {
            songToBeReturn+=getWordPreciseLocater(j,i).word;
            songToBeReturn+= " ";}
          if (i == canvas.width-1)
            songToBeReturn+="\n";
        }
      }

      return songToBeReturn;

    }

function update(){

	/*
		add an update button to send back word coordinates to the server
		on refresh the server sends back these coordinates overwriting the defaults in the array
		all the coordinates are sent through an array
	*/

//	console.log("update button pressed");
	var array = [];
	for(let i = 0; i < words.length; i++){
		console.log("adding to array");
		array[i] = words[i];
	}

	userRequestObj.type = "update";
	userRequestObj.wordArray = array;
	userRequestObj.title = songTitle;
	userRequestObj.stringText = songToBeReturn();
	var userRequestJSON = JSON.stringify(userRequestObj);

//	console.log("wordArray.length: " + wordArray.length);

	/*for(let i = 0; i < wordArray.length; i++){
		console.log("this ran");
		console.log("wordArray[i].x: " + wordArray[i].x);
		console.log("wordArray[i].y: " + wordArray[i].y);
	}*/
	 $.post("userText", userRequestJSON, function(data, status){
			console.log("data: " + data);
			console.log("typeof: " + typeof data);
			var responseObj = JSON.parse(data);
			movingString.word = responseObj.text;
		//	songTitle = responseObj.text;
			//replace word array with new words if there are any
		//	if(responseObj.wordArray) words = responseObj.wordArray;
			});





}

$(document).ready(function(){
	//This is called after the broswer has loaded the web page

	//add mouse down listener to our canvas object
	$("#canvas1").mousedown(handleMouseDown);

	//add key handler for the document as a whole, not separate elements.
	$(document).keydown(handleKeyDown);
	$(document).keyup(handleKeyUp);


    //timer.clearInterval(); //to stop

	drawCanvas();
});
