var cenX, cenY;

var amp = 20; 				//amplitude of the wave 
var period = 300; 		//period of the wave 
var theta = 0; 				//angle 
var waveX; 						//x value
var waveYs = []; 			//y values 

var shipX, shipY; 
var sunX, sunY;
var moonX, moonY;

var monX, monY;
var monster; 		//monster object variable 

var counter1, counter2, counter3, counter4, counter5, counter6; //Counters for each of the 6 clouds 

var cannonX, cannonY; 
var cannons = []; 						//array of cannon ball objects 
var cannonCount = 0; 					//maintaining a certain number of cannon balls 

var user; 										//user object variable

var strikeTimer = 0; 					//timing the monster's attacks

var starX = []; 			//x positions of the stars
var starY = []; 			//y positions of the stars
var starSize = []; 		//sizes of the stars 
var starOp = []; 			//opacities of the stars 
var starNum = 100; 		//# of stars

var running = true;		//boolean to signify that the game is still going


function preload() {
	//Images and sounds 
	skull = loadImage('skull.png');
	cannon = loadImage('cannon.png');
	fire = loadImage('fire.png');
	song = loadSound('Pirates_Of_The_Caribbean_Theme_Song.mp3');
	tada = loadSound('tada.mp3');
	splat = loadSound('splat.mp3');
	lose = loadSound('Sad_Trombone.mp3');
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(143, 243, 255);
	cenX = windowWidth/2;
	cenY = windowHeight/2;
	
	//x and y positions of elements 
	shipX = windowWidth-500;
	shipY = (windowHeight*2)/3;
	sunX = 150;
	sunY = 150;
	moonX = 150;
	moonY = 150;
	monX = 300;
	monY = shipY-25;
	cannonX = shipX-30;
	cannonY = shipY-60;
	waveX = TWO_PI/period; 	//TWO_PI - built-in constant
	
	//Instantiating the monster objects 
	monster = new monsterObject(monX, monY);
	
	//Instantiating the user object 
	user = new userObject();
	
	//Initializing the counters at the clouds' starting points	
	counter1 = windowWidth; 
	counter2 = cenX;
	counter3 = 0;
	counter4 = (cenX*3)/2;
	counter5 = cenX/2;
	counter6 = -cenX/2;
	
	//Resizing images 
	skull.resize(50, 0);
	cannon.resize(120, 0);
	fire.resize(100, 0);
	
	//Playing the song in a loop
	song.loop();
	
	//Setting up the stars 
	for (var i=0; i<starNum; i++) {
		starX[i] = random(windowWidth); 
		starY[i] = random(windowHeight);
		starSize[i] = random(10);
		starOp[i] = random(255);
	}
	
	//Slider 
	slider = createSlider(0, 300, 0);
	slider.position(cenX-150, 20);
	slider.size(300, 10);
}

function draw() {
	//Changes from sky blue to black depending on the value of the slider
	background(143-slider.value(), 243-slider.value(), 255-slider.value());

	//Stars 
	for (var j=0; j<starNum; j++) {
		noStroke();
		//Opacity of the stars depends on the random value and the value of the slider 
		fill(255, slider.value()-starOp[j]);
		ellipse(starX[j], starY[j], starSize[j], starSize[j]); 
	}	
	
	//Clouds
	counter1 += .8; //Making the clouds move over time 
	counter2 += .8;
	counter3 += .8;
	counter4 += .8;
	counter5 += .8;
	counter6 += .8;
	if (counter1 > windowWidth+(cenX/2)) { counter1 = -cenX/2; } //Once they reach a certain point they start back at the left
	if (counter2 > windowWidth+(cenX/2)) { counter2 = -cenX/2; }
	if (counter3 > windowWidth+(cenX/2)) { counter3 = -cenX/2; }
	if (counter4 > windowWidth+(cenX/2)) { counter4 = -cenX/2; }
	if (counter5 > windowWidth+(cenX/2)) { counter5 = -cenX/2; }
	if (counter6 > windowWidth+(cenX/2)) { counter6 = -cenX/2; }
	cloud(counter1, cenY/6);
	cloud(counter2, cenY/6);
	cloud(counter3, cenY/6);
	cloud(counter4, (cenY*3)/4);
	cloud(counter5, (cenY*3)/4);
	cloud(counter6, (cenY*3)/4);
	
	//Sun/Moon and Ship
	sunMoon();
	ship();
	
	//MONSTER 
	if (slider.value() < 150) {
		//Daytime color
		monster.Display(10, 232, 60); 
	}
	else {
		//Nighttime color 
		monster.Display(0, 126, 65);
	}
	monster.UpdatePupil();
	//When the monster is defeated 
	if (monster.health <= 0) {
		song.stop();
		//Color of the text depends on the value of the slider 
		fill(slider.value());
		textSize(90);
		textFont('Fantasy');
		text("You Win!", cenX-200, 200);
	}
	
	if (user.health <= 0) {
		song.stop();
		//Color of the text depends on the value of the slider 
		fill(slider.value());
		textSize(90);
		textFont('Fantasy');
		text("You Lose!", cenX-200, 200);
	}
	
	wave();
	
	//If the game is going, then the user and monster can attack 
	if (running) {
		
		//CANNONS - drawing, updating, and stopping them 
		for (var i=0; i<cannons.length; i++) {
			cannons[i].Display();
			cannons[i].UpdatePosition();
			cannons[i].Stop();
		}
		
		//Times when the monster strikes the user 
		strikeTimer += 1;
		if (strikeTimer%2000 >= 0 && strikeTimer%100 <= 5) {
			monster.Attack();
		}
	}
}

//Drawing the cloud 
function cloud(x, y) {
	noStroke();
	//Color changes from white to grey depending on the value of the slider 
	fill(255-slider.value()+150); 
	ellipse(x, y, 65, 65);
	ellipse(x-60, y, 65, 65);
	ellipse(x+60, y, 65, 65);
	ellipse(x+30, y-30, 65, 65);
	ellipse(x-30, y-30, 65, 65);
	ellipse(x-30, y+30, 65, 65);
	ellipse(x+30, y+30, 65, 65);
	ellipse(x, y-50, 30, 30);
	ellipse(x, y+50, 30, 30);
	ellipse(x-60, y-30, 30, 30);
	ellipse(x+60, y+30, 30, 30);	
}

//Drawing the sun and moon
function sunMoon() {
	//As the sun sets, the moon rises, and vice versa
	
	noStroke();	
	
	//Sun 
	fill(255, 233, 60);
	ellipse(sunX, sunY+(slider.value()*2), 150, 150);
	
	//Moon
	fill(194, 236, 255);
	ellipse(moonX, (moonY+windowHeight)-(slider.value()*2), 150, 150);
}

//Drawing the ship 
function ship() {
	
	//Base
	noStroke();
	fill(87, 34, 0);
	beginShape();
	vertex(shipX, shipY);
	bezierVertex(shipX, shipY, shipX+150, shipY+250, shipX+300, shipY);
	vertex(shipX+300, shipY);
	endShape();
	
	//Mast
	stroke(0);
	strokeWeight(5);
	line(shipX+150, shipY, shipX+150, shipY-300);
	
	//Sails
	fill(255);
	beginShape();
	vertex(shipX+150, shipY-50);
	bezierVertex(shipX+150, shipY-50, shipX-60, shipY-150, shipX+150, shipY-250);
	bezierVertex(shipX+150, shipY-250, shipX+90, shipY-150, shipX+150, shipY-50);
	vertex(shipX+150, shipY-250);
	endShape();
	
	beginShape();
	vertex(shipX+150, shipY-50);
	bezierVertex(shipX+150, shipY-50, shipX+30, shipY-150, shipX+150, shipY-250);
	bezierVertex(shipX+150, shipY-250, shipX+120, shipY-150, shipX+150, shipY-50);
	vertex(shipX+150, shipY-250);
	endShape();
	
	//Flag 
	fill(0);
	rect(shipX+150, shipY-300, 70, 50);
	image(skull, shipX+160, shipY-300);
	
	//Cannon 
	image(cannon, shipX-30, shipY-90);
}

//Drawing the wave
function wave() {	
	noStroke();
	
	//3 waves 
	for (var i=0; i<2; i++) {
		theta += .02; //increasing the angle 
		var x = theta; //temporary value
		
		//Drawing across the entire window
		for (var j=0; j<windowWidth; j++) {
			waveYs[j] = sin(x) * amp; //setting up the y values with the sin() function and the amplitude
			x += waveX; //incrementing the x value 
		}
		
		//Color of the wave changes depending on the value of the slider
		stroke(0, 74-(slider.value()/2), 255-(slider.value()/2));
		for (var k=0; k<windowWidth; k++) {
			line(k, waveYs[k]+(((windowHeight*2)/3)+90), k, windowHeight);
		}
	}
}

function monsterObject(X, Y) {
	this.x = X; 
	this.y = Y; 
	this.eyeX = this.x;
	this.eyeY = this.y;
	this.health = 1000;
	this.r = 0;
	this.g = 0; 
	this.b = 0;
	
	//Drawing the monster 
	this.Display = function(r, g, b) {
		this.r = r; 
		this.g = g; 
		this.b = b;
		noStroke();
		fill(this.r, this.g, this.b);
		ellipse(this.x, this.y, 250, 250);
		triangle(this.x-400, this.y+400, this.x, this.y-50, this.x+400, this.y+400);
		fill(255);
		ellipse(this.x, this.y, 200, 200);
		
		fill(0);
		ellipse(this.eyeX, this.eyeY, 100, 100);
	}
	
	//Updating the pupil's position based on the mouse position 
	this.UpdatePupil = function() {
		this.eyeX = (this.x-30) + mouseX * 50/windowHeight;
		this.eyeY = (this.y-30) + mouseY * 50/windowHeight;
	}
	
	//When the monster gets hit 
	this.Hit = function() {
		this.health -= random(0, 5);
		image(fire, this.x-50, this.y-100);
		if (this.health <= 0) {
			this.Sink();	
		}
	}
	
	//When the monster dies
	this.Sink = function() {
		this.y += 200;
		
		//Stop the game 
		running = !running;
		
		//Playing the victory sound
		tada.playMode('untilDone');
		tada.play();
	} 
	
	//When the monster attacks 
	this.Attack = function() {
		noStroke();
		fill(this.r, this.g, this.b);
		triangle(this.x+100, this.y+100, cenX, cenY, windowWidth-500, (windowHeight*2)/3)
		user.Hit();
	}
}

function userObject() {
	this.health = 1000;
	
	//When the user gets hit 
	this.Hit = function() {
		this.health -= random(0, 5);
		image(fire, shipX+100, shipY-100);
		
		if (this.health <= 0) {
			this.Sink();	
		}
	}
	
	//When the user dies
	this.Sink = function() {
		shipY += 200;
		
		//Stop the game 
		running = !running; 
		
		//Playing the victory sound
		lose.playMode('untilDone');
		lose.play();
	} 
}
	
//Controls the cannons 
function mousePressed() {
	cannons[cannons.length] = new cannonBallObject(cannonX, cannonY);
	cannons.push(new cannonBallObject(cannonX, cannonY));
	splat.play();
}

function cannonBallObject(X, Y) {
	this.x = X;
	this.y = Y;
	
	//Drawing the cannon ball
	this.Display = function() {
		noStroke();
		//Color of the cannon ball depends on the value of the slider 
		fill(slider.value()-150); 
		ellipse(this.x, this.y, 25, 25);
	}
	
	//Changing the x position over time
	this.UpdatePosition = function() {
		this.x -= 5;
	}
	
	//When the cannon ball reaches the monster, it gets popped off from the array and the monster takes damage
	this.Stop = function() {
		if (this.x == monX) {
			cannons.splice(0, 1);
			monster.Hit();
		}
	}
}


/* References: 
https://www.openprocessing.org/sketch/626042
https://www.openprocessing.org/sketch/637500
*/
