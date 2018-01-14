var buttons = [];

var update = function() {
  this.counterLabel = counterLabel.setText(parseInt(counterLabel.getText()));
}

var initWidgets = function () {
	window.widgets = new LeapWidgets(window.scene);
	widgets.initLeapHand();
	widgets.createLabel("Press all the buttons", new THREE.Vector3(0, 120, -110), 16, 0x0);
	var pressed = 0;
	var buttons_pressed = widgets.createLabel("Buttons Pressed: ", new THREE.Vector3(150, -100, -110), 16, 0x0);
  var counterLabel = widgets.createLabel("0", new THREE.Vector3(250, -100, -110), 16, 0x0);

	// create buttons
  for (var i = 0; i < 10; i++ {
    buttons[i] = createButton("", new THREE.Vector3(0, 0, -110), new THREE.Vector3(100,50,30));
  })
	// var button1 = createButton("", new THREE.Vector3(0, -75, -110), new THREE.Vector3(100, 50, 30));
	var button = createButton("", new THREE.Vector3(0, 0, -110), new THREE.Vector3(100,50,30));
	// var button3 = createButton("", new THREE.Vector3(0, 75, -110), new THREE.Vector3(100, 50, 30));

	// button1.addEventListener('press', function(evt) {
	// 	pressed++;
	// 	counterLabel.getText;
	// });
	button2.addEventListener('press', function(evt) {
		counterLabel.setText(parseInt(counterLabel.getText())+1);
	});
	// button3.addEventListener('press', function(evt) {
	// 	pressed++;
	// });
	// increaseButton.addEventListener('press', function(evt) {
	// 	counterLabel.setText(parseInt(counterLabel.getText())+1);
	// });
	var spotLight = new THREE.SpotLight(0xffffff, 1);
	spotLight.shadowCameraVisible = true;
	spotLight.castShadow = true;
	spotLight.shadowMapWidth = 6048;
	spotLight.shadowMapHeight = 6048;
	spotLight.shadowCameraFar = 1000;
	spotLight.shadowDarkness = 0.5;
	// spotLight.position.fromArray([wall.position.x, wall.position.y, wall.position.z + 1000]);
	// spotLight.target.position.copy(wall.position);
	scene.add(spotLight);
	window.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
	window.camera.position.fromArray([0, 0, 300]);
	// window.camera.lookAt(new THREE.Vector3(0, decreaseButton.position.y, decreaseButton.position.z));
	window.addEventListener('resize', function () {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.render(scene, camera);
	}, false);
	scene.add(camera);
}

var initScene = function () {
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
