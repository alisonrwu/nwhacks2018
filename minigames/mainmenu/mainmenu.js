var initWidgets = function () {
	window.widgets = new LeapWidgets(window.scene);
	widgets.initLeapHand();

  var wall = widgets.createWall(new THREE.Vector3(0, 0, -300), new THREE.Vector3(500, 300, 100));
	widgets.createLabel("Main Menu", new THREE.Vector3(0, wall.position.y, wall.position.z + 100), 20, 0xffffff);

  // SETUP SPOTLIGHT
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

  // SETUP CAMERA
  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.z = 500;
 	scene.add(camera);

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
  requestAnimationFrame(update);
  renderer.render(scene, camera);
}

initScene();
