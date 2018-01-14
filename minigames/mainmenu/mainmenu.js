var possibleGames = [];
var currentGame = null;

var startGame = function () {
  scene.remove(startButton);
  nextMiniGame();
};

var setUpMiniGame = function () {
  if (currentGame != null) {
    currentGame.tearDown();
  }

  selectRandomMiniGame();
  currentGame.init();
  startTimer();
}

var selectRandomMiniGame = function() {
  var select = Math.floor((Math.random() * possibleGames.length));
  console.log(possibleGames);
  currentGame = possibleGames[select];
};

var startTimer = function () {
  TIMER_START = 5;
  var currentTime = TIMER_START;
  timer.setText("Time: " + parseInt(currentTime));

  var timerUpdate = setInterval(function() {
    currentTime--;
    timer.setText("Time: " + parseInt(currentTime));
    if (currentTime === 0) {
      clearInterval(timerUpdate);

      if (currentGame.success === true) {
        gameSucceed();
      } else {
        gameOver();
      }
    }
  }, 1000);
}

var gameSucceed = function () {
  console.log("Success!");
  nextMiniGame();
};

var gameOver = function () {
  console.log("Fail!");
};

var animateMesh = function(mesh, target, options){
    options = options || {};
    // get targets from options or set to defaults
    var to = target || THREE.Vector3(),
        easing = options.easing || TWEEN.Easing.Quadratic.In,
        duration = options.duration || 2000;

    var update = function() {
      mesh.__dirtyPosition = true;
    };

    // create the tween
    var tweenVector3 = new TWEEN.Tween(mesh.position)
        .to({ x: to.x, y: to.y, z: to.z, }, duration)
        .easing(easing)
        .onUpdate(function(d) {
            if(options.update){
                options.update(d);
            }
            update();
         })
        .onComplete(function(){
          if(options.callback) options.callback();
        });
    // start the tween
    tweenVector3.start();
    // return the tween in case we want to manipulate it later on
    return tweenVector3;
};

var nextMiniGame = function () {
  DOOR_WIDTH = window.innerWidth / 2;
  DOOR_HEIGHT = window.innerHeight;
  DOOR_DEPTH = 100;
  DOOR_Y = camera.position.y;
  DOOR_Z = camera.position.z- DOOR_DEPTH;

  LEFT_DOOR_X = camera.position.x - DOOR_WIDTH;
  leftDoor = widgets.createWall(new THREE.Vector3(LEFT_DOOR_X, DOOR_Y, DOOR_Z), new THREE.Vector3(DOOR_WIDTH, DOOR_HEIGHT, DOOR_DEPTH));

  RIGHT_DOOR_X = camera.position.x + DOOR_WIDTH;
  rightDoor = widgets.createWall(new THREE.Vector3(RIGHT_DOOR_X, DOOR_Y, DOOR_Z), new THREE.Vector3(DOOR_WIDTH, DOOR_HEIGHT, DOOR_DEPTH));

  animateMesh(leftDoor, new THREE.Vector3(camera.position.x, DOOR_Y, DOOR_Z));
  animateMesh(rightDoor, new THREE.Vector3(camera.position.x, DOOR_Y, DOOR_Z), {
    callback: function() {
      setUpMiniGame();

      animateMesh(leftDoor, new THREE.Vector3(LEFT_DOOR_X, DOOR_Y, DOOR_Z), {
        callback: function() {
          scene.remove(leftDoor);
        }});
      animateMesh(rightDoor, new THREE.Vector3(RIGHT_DOOR_X, DOOR_Y, DOOR_Z), {
        callback: function() {
          scene.remove(rightDoor);
        }
      });
    }
  });
};

var initMiniGames = function () {
  //possibleGames.push(balloonMiniGame);
  possibleGames.push(simonSaysMiniGame);
}

var initWidgets = function () {
	window.widgets = new LeapWidgets(window.scene);
	widgets.initLeapHand();

  // SETUP START BUTTON
  var BUTTON_DEPTH = 30;
  startButton = widgets.createButton("Start", new THREE.Vector3(0, 0, -150), new THREE.Vector3(200, 100, BUTTON_DEPTH));
    startButton.addEventListener('press', function(evt) {
      console.log("Start button pressed");
      startGame();
    });

  // SETUP CAMERA
  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.z = 500;
 	scene.add(camera);

  // SETUP SPOTLIGHT
  var spotLight = new THREE.SpotLight(0xffffff, 1);
  spotLight.shadowCameraVisible = true;
  spotLight.castShadow = true;
  spotLight.shadowMapWidth = 6048;
  spotLight.shadowMapHeight = 6048;
  spotLight.shadowCameraFar = 1000;
  spotLight.shadowDarkness = 0.5;
  spotLight.position.fromArray([camera.position.x, camera.position.y, camera.position.z + 1000]);
  spotLight.target.position.copy(camera.position);
  scene.add(spotLight);

  // SETUP ORBIT CONTROLS OF THE CAMERA
  controls = new THREE.OrbitControls(camera);
  controls.keyPanSpeed = 1;
  controls.update();

	window.addEventListener('resize', function () {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.render(scene, camera);
	}, false);

  // SETUP TIMER
  timer = widgets.createLabel("Time: ", new THREE.Vector3(camera.position.x - 120, camera.position.y - 120, camera.position.z - 300), 15, 0x000000);
};

var initScene = function () {
  Physijs.scripts.worker = '../../js/lib/physijs_worker.js';
  window.scene = new Physijs.Scene();

  window.renderer = new THREE.WebGLRenderer({
    alpha: true
  });
  window.renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(window.renderer.domElement);
};

var init = function () {
  initScene();
  initWidgets();
  initMiniGames();
};

function update() {
  if (currentGame != null) {
    currentGame.update();
  }
  scene.simulate();
  renderer.render(scene, camera);
  TWEEN.update();
  requestAnimationFrame(update);
}

init();
update();
