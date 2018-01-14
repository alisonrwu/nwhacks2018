
var xDistance = 75;
var yDistance = 50;
var buttons = [];
var x = [-xDistance, -xDistance, xDistance, xDistance];
var y = [-yDistance, yDistance, -yDistance, yDistance];
var colors = [0xffcc66, 0xcc3399, 0x00cc99, 0x3399ff];
var buttonSequence = [];
var NUM_SEQUENCE = 4;
var currentSequence = 0;
var progress = 0;
var success = false;
var fail = false;
var gameStart = false;

var initWidgets = function () {
	window.widgets = new LeapWidgets(window.scene);
	widgets.initLeapHand();
	widgets.createLabel("Simon Says", new THREE.Vector3(0, 110, -110), 16, 0xffffff);
	var wall = widgets.createWall(new THREE.Vector3(0, 0, -200), new THREE.Vector3(500, 300, 10));
	
	for (var i = 0; i < 4; i++) {
		buttons.push(widgets.createButton("", new THREE.Vector3(x[i], y[i], -100), new THREE.Vector3(100, 70, 30), colors[i]));
	}
	buttons[0].addEventListener('press', function(evt) {
		pressButton(0);
	});
	buttons[1].addEventListener('press', function(evt) {
		pressButton(1);
	});buttons[2].addEventListener('press', function(evt) {
		pressButton(2);
	});
	buttons[3].addEventListener('press', function(evt) {
		pressButton(3);
	});
	var spotLight = new THREE.SpotLight(0xffffff, 1);
	spotLight.shadowCameraVisible = true;
	spotLight.castShadow = true;
	spotLight.shadowMapWidth = 6048;
	spotLight.shadowMapHeight = 6048;
	spotLight.shadowCameraFar = 1000;
	spotLight.shadowDarkness = 0.5;
	spotLight.position.fromArray([wall.position.x, wall.position.y, wall.position.z + 1000]);
	spotLight.target.position.copy(wall.position);
	scene.add(spotLight);
	window.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
	window.camera.position.fromArray([0, 0, 300]);
	window.camera.lookAt(new THREE.Vector3(0, 0, 0));
	window.addEventListener('resize', function () {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.render(scene, camera);
	}, false);
	scene.add(camera);
	playSequence();
	requestAnimationFrame(update);
}

var update = function () {
	renderer.render(scene, camera);
	requestAnimationFrame(update);
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

var playSequence = function() {
	curButton = buttons[buttonSequence[currentSequence]]
	curButton.position.set(curButton.position.x, curButton.position.y, curButton.position.z - 50);
	curButton.__dirtyPosition = true;
	currentSequence++;
	if (currentSequence < NUM_SEQUENCE) {
		setTimeout(playSequence, 300);
	} else {
		setTimeout(function () { gameStart = true; }, 500);
	}
}

var initScene = function () {
	for (var i = 0; i < NUM_SEQUENCE; i++) {
		buttonSequence.push(Math.floor(Math.random() * NUM_SEQUENCE));
		console.log(buttonSequence[i]);
	}
	
  Physijs.scripts.worker = '../../js/lib/physijs_worker.js';
  window.scene = new Physijs.Scene();
  window.scene.addEventListener('update', function() {
    scene.simulate( undefined, 2 );
  });
  window.scene.setGravity({x:0,y:0,z:0});
  window.renderer = new THREE.WebGLRenderer({
    alpha: true
  });
  window.renderer.shadowMapEnabled = true;
  window.renderer.shadowMapType = THREE.BasicShadowMap;
  window.renderer.setClearColor(0x000000, 0);
  window.renderer.setSize(window.innerWidth, window.innerHeight);
  window.renderer.domElement.style.position = 'fixed';
  window.renderer.domElement.style.top = 0;
  window.renderer.domElement.style.left = 0;
  window.renderer.domElement.style.width = '100%';
  window.renderer.domElement.style.height = '100%';
  document.body.appendChild(window.renderer.domElement);

	initWidgets();
};
initScene();
