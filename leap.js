MIDI.loadPlugin({
	soundfontUrl: "soundfont/",
	instrument: "acoustic_grand_piano", // or multiple instruments
	onprogress: function(state, progress) {
		console.log(state, progress);
	},
	onsuccess: function () {
		delay = 0; // play one note every quarter second
		note = 50; // the MIDI note
		velocity = 127; // how hard the note hits
		MIDI.setVolume(0, 30);
	}
});

var initScene = function () {
  Physijs.scripts.worker = 'js/lib/physijs_worker.js';
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
  window.widgets = new LeapWidgets(window.scene);
  widgets.initLeapHand();
  widgets.createLabel("LeapJS Widgets - Buttons", new THREE.Vector3(0, 120, -110), 16, 0xffffff);
  var counterLabel = widgets.createLabel("0", new THREE.Vector3(0, 0, -110), 16, 0xffffff);
  var wall = widgets.createWall(new THREE.Vector3(0, 0, -200), new THREE.Vector3(500, 300, 100));
  var decreaseButton = widgets.createButton("Decrease", new THREE.Vector3(-100, 0, -110), new THREE.Vector3(100, 70, 30));
  var increaseButton = widgets.createButton("Increase", new THREE.Vector3(100, 0, -110), new THREE.Vector3(100, 70, 30));
  decreaseButton.addEventListener('press', function(evt) {
    counterLabel.setText(parseInt(counterLabel.getText())-1);
    MIDI.noteOn(0, 30, 127, 0);
  });
  increaseButton.addEventListener('press', function(evt) {
    counterLabel.setText(parseInt(counterLabel.getText())+1);
    MIDI.noteOn(0, 60, 127, 0);
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
  window.camera.lookAt(new THREE.Vector3(0, decreaseButton.position.y, decreaseButton.position.z));
  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }, false);
  scene.add(camera);
};
initScene();