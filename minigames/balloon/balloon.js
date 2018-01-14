var camera;
var controls;
var balloon;

var initWidgets = function () {
	window.widgets = new LeapWidgets(window.scene);
	widgets.initLeapHand();

	var wall = widgets.createWall(new THREE.Vector3(0, 0, -300), new THREE.Vector3(500, 300, 100));
	widgets.createLabel("Pop the balloon", new THREE.Vector3(0, wall.position.y, wall.position.z + 100), 20, 0xffffff);

	var pumpButton = widgets.createButton("Pump", new THREE.Vector3(100, 0, -110), new THREE.Vector3(100, 70, 50));
	pumpButton.addEventListener('press', function(evt) {
		balloon.scale.addScalar(1);
		console.log(balloon.scale);
	});

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

	window.renderer = new THREE.WebGLRenderer({alpha: true});
	window.renderer.setSize(window.innerWidth, window.innerHeight);
	window.renderer.setClearColor(0xd0e0f0);
	document.body.appendChild(window.renderer.domElement);

	initWidgets();

	var sphereGeometry = new THREE.SphereGeometry(10, 32, 32);
	var sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xdd55ff });
	balloon = new THREE.Mesh(sphereGeometry, sphereMaterial);
	balloon.position.y = 200;
	scene.add(balloon);

	var cylinderGeometry = new THREE.CylinderGeometry(1,1,300);
	var stringMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
	string = new THREE.Mesh(cylinderGeometry, stringMaterial);
	string.position.y = 50
	scene.add(string);
};

function update() {
	requestAnimationFrame(update);
	renderer.render(scene, camera);
}

initScene();