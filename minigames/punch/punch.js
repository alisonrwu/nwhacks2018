var hp;

var init = function () {
	var wall = widgets.createWall(new THREE.Vector3(0, 0, -200), new THREE.Vector3(500, 300, 100));
	var base = widgets.createWall(new THREE.Vector3(0, -100, -100), new THREE.Vector3(200, 30, 300));
	var text = widgets.createLabel("LeapJS Widgets - Knob", new THREE.Vector3(0, wall.position.y+wall.geometry.parameters.height/2-16, wall.position.z+wall.geometry.parameters.depth/2+1), 16, 0xffffff);
	var knob = widgets.createSwitch("Knob", new THREE.Vector3(base.position.x, base.position.y+base.geometry.parameters.height/2 + 50, base.position.z+80), 32, 100);
	// var angleLabel = widgets.createLabel("Up", new THREE.Vector3(-60, base.position.y, base.position.z+base.geometry.parameters.depth/2+1), 16, 0xffffff);
	// var impactLabel = widgets.createLabel("0", new THREE.Vector3(60, base.position.y, base.position.z+base.geometry.parameters.depth/2+1), 16, 0xffffff);
	var healthLabel = widgets.createLabel("HP", new THREE.Vector3(0, base.position.y, base.position.z+base.geometry.parameters.depth/2+1), 16, 0xffffff);
	hp = 100;
	knob.addEventListener('control', function(evt) {
		// angleLabel.setText(Math.round(evt.angle*180/Math.PI) + '°');
		// impactLabel.setText(Math.round(evt.impact));
		hp = hp-Math.round(evt.impact*.0001);
		healthLabel.setText(hp+'%');
		// console.log(hp);
		if(hp <= 0) {
			this.success = true; //TODO?
		}
	});
	healthLabel.setText('100%');
};

var tearDown = function(){

};

var update = function() {

};

punchingMiniGame = new MiniGame(init, tearDown, update);