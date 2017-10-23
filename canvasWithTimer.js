

//Use javascript array of objects to represent words and their locations
//default song: "PEACEFUL EASY FEELING"
var words = [];

var userRequestObj = {

text: "",

title: "",

type: "",

wordArray: []}; //make object to send to server

var movingString = {word: "Moving",
                    x: 100,
					y:100,
					xDirection: 1, //+1 for leftwards, -1 for rightwards
					yDirection: 1, //+1 for downwards, -1 for upwards
					stringWidth: 50, //will be updated when drawn
					stringHeight: 24}; //assumed height based on drawing point size

//indended for keyboard control
var movingBox = {x: 50,
                 y: 50,
				 width: 100,
				 height: 100};

var wayPoints = []; //locations where the moving box has been

var timer;

var wordBeingMoved;
var songTitle;

var deltaX, deltaY; //location where mouse is pressed
var canvas = document.getElementById('canvas1'); //our drawing canvas

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

    var context = canvas.getContext('2d');

    context.fillStyle = 'white';
    context.fillRect(0,0,canvas.width,canvas.height); //erase canvas

    context.font = '10pt Arial';
    context.fillStyle = 'cornflowerblue';
    context.strokeStyle = 'blue';

    for(var i=0; i<words.length; i++){  //note i declared as var

			var data = words[i];
			//console.log("str: ", String(data.word).charAt(0));
			//if (String(data.word).charAt(0) == "["){

			var raw_chord = "";
			var chord = "";
			var temp = "";
			var edited = "";
			var flag = 0;

			var o_flag = 0;
			for(let j = 0; j < String(data.word).length;j++){
 				if(String(data.word).charAt(j) == "["){
					console.log("j: ", j);

					flag = 1;
					if(j > 0){

						o_flag = 1;
						console.log("o_flag: ", o_flag);
					}

			for(let k = j; k < String(data.word).length; k++){
				if(data.word.charAt(k) == "]"){

					raw_chord = data.word;
					chord = raw_chord.substring(j+1, k);
					//console.log("chord: ", chord);
					temp = data.word;
					temp = temp.slice(j, k);
					edited = temp.replace(temp, '');
					//console.log("temp: ", temp);
				}
			}

				var opening = -1;
				var closing = -1;
				//var temp = "";

				context.fillText(chord, data.x, data.y-15);
				context.strokeText(chord, data.x, data.y-15);
				context.fillText(edited, data.x, data.y);
				context.strokeText(edited, data.x, data.y);

				}
			/*	if(o_flag == 1){
					context.fillText(data.word, data.x, data.y);
					context.strokeText(data.word, data.x, data.y);
					o_flag = 0;
				}*/

			}

			if(o_flag == 1 || flag == 0){
					context.fillText(data.word, data.x, data.y);
            context.strokeText(data.word, data.x, data.y);
			o_flag = 0;
			}
	}

//    movingString.stringWidth = context.measureText(	movingString.word).width;
	//console.log(movingString.stringWidth);
  //  context.fillText(movingString.word, movingString.x, movingString.y);

    //draw moving box
	/*context.fillRect(movingBox.x,
	                 movingBox.y,
					 movingBox.width,
					 movingBox.height);*/

	//draw moving box way points
	for(i in wayPoints){
		context.strokeRect(wayPoints[i].x,
		             wayPoints[i].y,
					 movingBox.width,
					 movingBox.height);
	}
	//draw circle
    context.beginPath();
    context.arc(canvas.width/2, //x co-ord
            canvas.height/2, //y co-ord
			canvas.height/2 - 5, //radius
			0, //start angle
			2*Math.PI //end angle
			);
    context.stroke();
}

function handleMouseDown(e){

	//get mouse location relative to canvas top left
	var rect = canvas.getBoundingClientRect();
    //var canvasX = e.clientX - rect.left;
    //var canvasY = e.clientY - rect.top;
    var canvasX = e.pageX - rect.left; //use jQuery event object pageX and pageY
    var canvasY = e.pageY - rect.top;
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
	var rect = canvas.getBoundingClientRect();
    var canvasX = e.pageX - rect.left;
    var canvasY = e.pageY - rect.top;

	wordBeingMoved.x = canvasX + deltaX;
	wordBeingMoved.y = canvasY + deltaY;

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

function handleTimer(){
	movingString.x = (movingString.x + 5*movingString.xDirection);
	movingString.y = (movingString.y + 5*movingString.yDirection);

	//keep inbounds of canvas
	if(movingString.x + movingString.stringWidth > canvas.width) movingString.xDirection = -1;
	if(movingString.x < 0) movingString.xDirection = 1;
	if(movingString.y > canvas.height) movingString.yDirection = -1;
	if(movingString.y - movingString.stringHeight < 0) movingString.yDirection = 1;

	drawCanvas()
}

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
	//   var userRequestObj = {text: userText}; //make object to send to server
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
			movingString.word = responseObj.text;
			userRequestObj.title = songTitle;
			//songTitle = responseObj.text;
			//replace word array with new words if there are any
			if(responseObj.wordArray) words = responseObj.wordArray;
			});
	}

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

	timer = setInterval(handleTimer, 100);
    //timer.clearInterval(); //to stop

	drawCanvas();
});
