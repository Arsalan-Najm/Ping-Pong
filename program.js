// all context and structure of the game
const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');
const winningMessage = document.querySelector('.winner'); 
const LosingMessage =  document.querySelector('.loser');
const pongBox = document.querySelector('.box');

//user paddle
const user = {
	x : 0,
	y : canvas.height/2 - 100/2,
	width : 10,
	height : 100,
	color : "WHITE",
	score : 0
}
//computer paddle
const com = {
	x : canvas.width - 10,
	y : canvas.height/2 - 100/2,
	width : 10,
	height : 100,
	color : "WHITE",
	score : 0
}
//ball of the game
const ball = {
	x : canvas.width/2,
	y : canvas.height/2,
	radius : 10,
	speed : 5,
	velocityX : 5,
	velocityY : 5,
	color : "WHITE"
}
//net of the game (straight line)
const net = {
	x : canvas.width/2 - 1,
	y : 0,
	width : 5,
	height : 600,
	color : "WHITE"
}
//draw the ball in canvas
function drawCircle(x,y,r,color) {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(x,y,r,0,Math.PI*2,false);
	ctx.closePath();
	ctx.fill();
}
//draw net (straight line) in the canvas
function drawNet() {
	drawRect(net.x,net.y,net.width,net.height,"#7f6d50");
}
//draw score of user and computer in the canvas
function drawScore(text,x,y,color) {
	ctx.fillStyle = color;
	ctx.font = "45px georgia";
	ctx.fillText(text,x,y);
}
//draw the table of the game
function drawRect(x,y,w,h,color) {
	ctx.fillStyle = color;
	ctx.fillRect(x,y,w,h);
}
//structure and elements of the game which can be used in other functions
function render() {
	drawRect(0,0,canvas.width,canvas.height,"BLACK");
	drawNet();
	drawScore(user.score,canvas.width/4,canvas.height/5,"#2196f3");
	drawScore(com.score,3*canvas.width/4,canvas.height/5,"#dc143c");
	drawRect(user.x,user.y,user.width,user.height,"#2196f3");
	drawRect(com.x,com.y,com.width,com.height,"#dc143c");
	drawCircle(ball.x,ball.y,ball.radius,"#f9f9f9");
}
//structure which the ball hits the table of the game
function collision(theBall,thePlayer) {
	theBall.top = theBall.y - ball.radius;
	theBall.bottom = theBall.y + ball.radius;
	theBall.left = theBall.x - ball.radius;
	theBall.right = theBall.x + ball.radius;
	thePlayer.top = thePlayer.y;
	thePlayer.bottom = thePlayer.y + thePlayer.height;
	thePlayer.left = thePlayer.x;
	thePlayer.right = thePlayer.x + thePlayer.width;
	return theBall.right > thePlayer.left && theBall.bottom > thePlayer.top && theBall.left < thePlayer.right && theBall.top < thePlayer.bottom;
}
//control the user paddle
canvas.addEventListener("mousemove",movePaddle);
//function of controlling user paddle
function movePaddle(evt) {
	let rect = canvas.getBoundingClientRect();
	user.y = evt.clientY - rect.top - user.height/2;
}
//function of updating the game (ball movement,user and computer score increases etc)
function update() {
	ball.x += ball.velocityX;
	ball.y += ball.velocityY;
	if(ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
		ball.velocityY = -ball.velocityY;
	}
	//function which resets the ball after winning and losing or scrore
	function resetBall() {
		ball.x = canvas.width/2;
		ball.y = canvas.height/2;
		ball.speed = 5;
		ball.velocityX = -ball.velocityX;
	}
	//simple AI of computer paddle
	let computerLevel = 0.1;
	com.y += (ball.y - (com.y + com.height/2)) * computerLevel;
	//direction and speed of the ball which every time hits by the table and paddles
	let player = (ball.x < canvas.width/2) ? user : com;
	if(collision(ball,player)) {
		let collidePoint = ball.y - (player.y + player.height/2);
		collidePoint = collidePoint/(player.height/2);
		let direction = (ball.x < canvas.width/2) ? 1 : -1;
		let angleRad = collidePoint * Math.PI/4;
		ball.velocityX = direction * ball.speed * Math.cos(angleRad);
		ball.velocityY = ball.speed * Math.sin(angleRad);
		ball.speed += 0.5;
	}
	//increase the user and computer score 
	if(ball.x - ball.radius < 0) {
		com.score++;
		resetBall();
	}else if(ball.x + ball.radius > canvas.width) {
		user.score++;
		resetBall();
	}
	//reset the ball when computer scores.
	if(com.score == 1 || com.score == 3 || com.score == 5 || com.score == 7 || com.score == 9) {
		ball.x = user.x - 50;
		ball.speed = 0;
		ball.velocityX = 0;
		ball.velocityY = 0;
	}
	//reset the ball when user scores.
	if(user.score == 1 || user.score == 3 || user.score == 5 || user.score == 7 || user.score == 9) {
		ball.x = com.x + 50;
		ball.speed = 0;
		ball.velocityX = 0;
		ball.velocityY = 0;
	}
	//function which reset the ball's speed when both side scores.
	canvas.addEventListener("dblclick",reset);
	function reset() {
		ball.speed = 5;
		ball.velocityX = 5;
		ball.velocityY = 5;
	}
	//winning and lossing message  
	if(com.score == 10) {
		winningMessage.classList.add("win2");
		LosingMessage.classList.add("lose2");
		pongBox.classList.add("show");
		resetBall();
	}else if(user.score == 10) {
		winningMessage.classList.add("win");
		LosingMessage.classList.add("lose");
		pongBox.classList.add("show");
		resetBall();
	}
}

//functions which runs the game
function game() {
	update();
	render();
}
//the speed of frame in the game
const framePerSecond = 50;
setInterval(game,1000/framePerSecond);