var controls;
var balloon;
var string;
var wall;
var pumpButton;
var popped = false;

var movementSpeed = 80;
var totalParticles = 1800;
var particleSize = 10;
var dirs = [];
var parts = [];
var colors = [0x550555, 0x335500, 0x550005, 0x332200];

var init = function () {
	balloonMiniGame.success = false;
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

	wall = widgets.createWall(new THREE.Vector3(0, 0, -300), new THREE.Vector3(500, 300, 100));
	widgets.createLabel("Pop the balloon", new THREE.Vector3(0, wall.position.y, wall.position.z + 100), 20, 0xffffff);

	pumpButton = widgets.createButton("Pump", new THREE.Vector3(100, 0, -110), new THREE.Vector3(100, 70, 50));
	pumpButton.addEventListener('press', function(evt) {
		scaleUp(balloon);
		balloon.inflated++;
		if(balloon.inflated >= 3) {
			popped = true;
			balloon.visible = false;
			parts.push(new ExplodeAnimation(0,balloon.position.y,0,scene));
			balloonMiniGame.success = true;
		}
	});
};

var tearDown = function () {
	scene.remove(balloon);
	scene.remove(string);
	scene.remove(wall);
	scene.remove(pumpButton);
};

var update = function () {
	var pCount = parts.length;
	while(pCount--) {
		parts[pCount].update();
	}
	if(popped) {
		string.position.y -= 5;
	}
};

balloonMiniGame = new MiniGame(init, tearDown, update);

function scaleUp(mesh) {
	var incremented = mesh.scale.x+1;
	// create the tween
	var tweenVector3 = new TWEEN.Tween(mesh.scale)
		.to({ x: incremented, y: incremented, z: incremented }, 300)
		.easing(TWEEN.Easing.Elastic.InOut);
	// start the tween
	tweenVector3.start();
}

function ExplodeAnimation(x,y,z,scene) {
	var geometry = new THREE.Geometry();
  
	for (i=0; i<1800; i++) {
		var vertex = new THREE.Vector3(x, y, z);
		geometry.vertices.push(vertex);
		dirs.push({
			x:(Math.random() * movementSpeed)-(movementSpeed/2),
			y:(Math.random() * movementSpeed)-(movementSpeed/2),
			z:(Math.random() * movementSpeed)-(movementSpeed/2)}
		);
	}
	var material = new THREE.PointsMaterial({ size: particleSize,  color: colors[Math.round(Math.random() * colors.length)] });
	var particles = new THREE.Points(geometry, material);
  
	this.object = particles;
	console.log(this);
	this.status = true;
  
	this.xDir = (Math.random() * movementSpeed)-(movementSpeed/2);
	this.yDir = (Math.random() * movementSpeed)-(movementSpeed/2);
	this.zDir = (Math.random() * movementSpeed)-(movementSpeed/2);
  
	scene.add(this.object); 
  
	this.update = function(){
		if (this.status == true){
			var pCount = totalParticles;
			while(pCount--) {
				var particle =  this.object.geometry.vertices[pCount]
				particle.y += dirs[pCount].y;
				particle.x += dirs[pCount].x;
				particle.z += dirs[pCount].z;
			}
			this.object.geometry.verticesNeedUpdate = true;
		}
	};
};