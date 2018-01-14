
var xDistance = 100;
var yDistance = 75;
var buttons = [];
var wall;
var label;
var x = [-xDistance, -xDistance, xDistance, xDistance];
var y = [-yDistance, yDistance, -yDistance, yDistance];
var colors = [0xffcc66, 0xcc3399, 0x00cc99, 0x3399ff];
var buttonSequence = [];
var NUM_SEQUENCE = 4;
var currentSequence;
var progress;
var success;
var fail;
var gameStart;

var init = function () {
	currentSequence = 0;
	success = false;
	fail = false;
	gameStart = false;
	progress = 0;
	label = widgets.createLabel("Simon Says", new THREE.Vector3(0, 20, -110), 16, 0xffffff);
	wall = widgets.createWall(new THREE.Vector3(0, 0, -200), new THREE.Vector3(500, 300, 10));

	for (var i = 0; i < 4; i++) {
		buttons.push(widgets.createButton("", new THREE.Vector3(x[i], y[i], -100), new THREE.Vector3(100, 70, 30), colors[i]));
	}
	buttons[0].addEventListener('press', function(evt) {
		pressButton(0);
	})
	buttons[1].addEventListener('press', function(evt) {
		pressButton(1);
	})
	buttons[2].addEventListener('press', function(evt) {
		pressButton(2);
	})
	buttons[3].addEventListener('press', function(evt) {
		pressButton(3);
	})
	for (var i = 0; i < NUM_SEQUENCE; i++) {
		buttonSequence.push(Math.floor(Math.random() * NUM_SEQUENCE));
	}
	setTimeout(playSequence, 5000);
}

var update = function () {
}

function pressButton(id) {
	if (gameStart == false) return;
	console.log(buttonSequence[progress]);
	console.log(id);
	if (id == buttonSequence[progress] && fail == false) progress++;
	else {
		fail = true;
		console.log("You lose!");
	}
	if (progress == 4) {
		successs = true;
		console.log("You won!");
	}
}

var tearDown = function() {

	console.log(scene);
	scene.prototype.remove(wall);
	scene.remove(wall);
	for (var i = 0; i < 4; i++) {
		scene.remove(buttons[i]);
	}
	scene.remove(label);
	console.log("label doesn't remove");
}

var playSequence = function() {
	var curButton = buttons[buttonSequence[currentSequence]];
	curButton.position.set(curButton.position.x, curButton.position.y, curButton.position.z - 50);
	curButton.__dirtyPosition = true;
	currentSequence++;
	if (currentSequence < NUM_SEQUENCE) {
		setTimeout(playSequence, 600);
	} else {
		setTimeout(function () { gameStart = true; }, 1000);
	}
}

simonSaysMiniGame = new MiniGame(init, tearDown, update);
