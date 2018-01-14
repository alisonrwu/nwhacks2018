var startGame = function () {
  closeDoors();
}

var animateMesh = function(mesh, target, options){
    options = options || {};
    // get targets from options or set to defaults
    var to = target || THREE.Vector3(),
        easing = options.easing || TWEEN.Easing.Quadratic.In,
        duration = options.duration || 2000;

    var update = function() {
      mesh.__dirtyPosition = true;
    }

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
}

var closeDoors = function () {
  DOOR_WIDTH = window.innerWidth / 2;
  DOOR_HEIGHT = window.innerHeight;
  DOOR_DEPTH = 100;

  LEFT_DOOR_X = camera.position.x - DOOR_WIDTH;
  LEFT_DOOR_Y = camera.position.y;
  LEFT_DOOR_Z = camera.position.z - DOOR_DEPTH;
  leftDoorVector = new THREE.Vector3(LEFT_DOOR_X, LEFT_DOOR_Y, LEFT_DOOR_Z)
  leftDoor = widgets.createWall(leftDoorVector, new THREE.Vector3(DOOR_WIDTH, DOOR_HEIGHT, DOOR_DEPTH));
  var leftDoorTarget = new THREE.Vector3(LEFT_DOOR_X + DOOR_WIDTH, LEFT_DOOR_Y, LEFT_DOOR_Z);
  animateMesh(leftDoor, leftDoorTarget);

  RIGHT_DOOR_X = camera.position.x + DOOR_WIDTH;
  RIGHT_DOOR_Y = 0;
  RIGHT_DOOR_Z = camera.position.z - DOOR_DEPTH;
  rightDoorVector = new THREE.Vector3(RIGHT_DOOR_X + DOOR_WIDTH, RIGHT_DOOR_Y, RIGHT_DOOR_Z)
  rightDoor = widgets.createWall(rightDoorVector, new THREE.Vector3(DOOR_WIDTH, DOOR_HEIGHT, DOOR_DEPTH));

  var rightDoorTarget = new THREE.Vector3(0, RIGHT_DOOR_Y, RIGHT_DOOR_Z);
  animateMesh(rightDoor, rightDoorTarget);
}

var initWidgets = function () {
	window.widgets = new LeapWidgets(window.scene);
	widgets.initLeapHand();

  // SETUP DOORS

  var BUTTON_DEPTH = 30;
  var startButton = widgets.createButton("Start", new THREE.Vector3(0, 0, 0 - (BUTTON_DEPTH * 2)), new THREE.Vector3(200, 100, BUTTON_DEPTH));
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
}

var initScene = function () {
  Physijs.scripts.worker = '../../js/lib/physijs_worker.js';
  window.scene = new Physijs.Scene();
  window.scene.addEventListener('update', function() {
    scene.simulate( undefined, 2 );
  });
  // window.scene.setGravity({x:0,y:0,z:0});

  window.renderer = new THREE.WebGLRenderer({
    alpha: true
  });
  window.renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(window.renderer.domElement);

	initWidgets();
};

function update() {
  renderer.render(scene, camera);
  requestAnimationFrame(update);
  TWEEN.update();
}

initScene();
update();
