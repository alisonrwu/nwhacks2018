var bark_sounds = new Audio("../../sounds/box-bark.mp3");
var pant_sounds = new Audio("../../sounds/box-pant.mp3");

var bark = function() {
  if (bark_sounds.paused) {
    if (!pant_sounds.paused) {
      pant_sounds.pause();
      pant_sounds.currentTime = 0;
    }
    bark_sounds.play();
    setTimeout(function(){
      bark_sounds.pause();
      bark_sounds.currentTime = 0;
      pant_sounds.play()
    }, 12000);
  }
};

var initWidgets = function () {
	window.widgets = new LeapWidgets(window.scene);
	widgets.initLeapHand();
  widgets.changeButtonPressedColor("0xff69b4");
	var instructions = widgets.createLabel("Give your pet box a rub!", new THREE.Vector3(0, 120, -110), 16, 0x0);
	var buttons_pressed = widgets.createLabel("Happiness: ", new THREE.Vector3(170, -100, -110), 12, 0xff69b4);
  var counterLabel = widgets.createLabel("0", new THREE.Vector3(235, -100, -110), 12, 0x0);
  var goal = 1000;
  var goal_label = widgets.createLabel("/ " + goal, new THREE.Vector3(275, -100, -110), 12, 0xff69b4);

	// create buttons
  // for (var i = 0; i < 10; i++) {
  //   buttons[i] = widgets.createButton("", new THREE.Vector3(0, 0, -110), new THREE.Vector3(100,50,30));
  // }
	var pet = widgets.createButton("(●´ω｀●)", new THREE.Vector3(0, 0, -110), new THREE.Vector3(90,90,90), "0x8B4513");

  pet.addEventListener('press', function(evt) {
    if (parseInt(counterLabel.getText()) < goal) {
  	   counterLabel.setText(parseInt(counterLabel.getText())+1);
       bark();
     }

    if (parseInt(counterLabel.getText()) === goal) {
      instructions.setText("Hooray, your pet box is happy!", "0xff69b4");
      setTimeout(function () {
        window.location.replace("../mainmenu/mainmenu.html");
      }, 3000);
    }
  });

	var spotLight = new THREE.SpotLight(0xffffff, 1);
	spotLight.shadowCameraVisible = true;
	spotLight.castShadow = true;
	spotLight.shadowMapWidth = 6048;
	spotLight.shadowMapHeight = 6048;
	spotLight.shadowCameraFar = 1000;
	spotLight.shadowDarkness = 0.5;
	spotLight.position.fromArray([0, 0, 1000]);
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
