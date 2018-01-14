var camera;
var controls;
var balloon;

var init = function () {
	var sphereGeometry = new THREE.SphereGeometry(10, 32, 32);
	var sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xdd55ff });
	balloon = new THREE.Mesh(sphereGeometry, sphereMaterial);
	balloon.inflated = 0;
	balloon.position.y = 200;
	scene.add(balloon);

	var cylinderGeometry = new THREE.CylinderGeometry(1,1,300);
	var stringMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
	string = new THREE.Mesh(cylinderGeometry, stringMaterial);
	string.position.y = 50
	scene.add(string);

	var wall = widgets.createWall(new THREE.Vector3(0, 0, -300), new THREE.Vector3(500, 300, 100));
	widgets.createLabel("Pop the balloon", new THREE.Vector3(0, wall.position.y, wall.position.z + 100), 20, 0xffffff);

	var pumpButton = widgets.createButton("Pump", new THREE.Vector3(100, 0, -110), new THREE.Vector3(100, 70, 50));
	pumpButton.addEventListener('press', function(evt) {
		balloon.scale.addScalar(1);
		balloon.inflated++;
		console.log(balloon.inflated);

		console.log(balloon.scale);
	});
};

var tearDown = function () {
	scene.remove(balloon);
	scene.remove(string);
	scene.remove(wall);
	scene.remove(pumpButton);
};

var update = function () {
	if (balloon.inflated === 3) {
		balloonMiniGame.success = true;
	};
}

balloonMiniGame = new MiniGame(init, tearDown, update);
