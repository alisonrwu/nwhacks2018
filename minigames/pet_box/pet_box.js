var bark_sounds = new Audio("../../sounds/box-bark.mp3");
var pant_sounds = new Audio("../../sounds/box-pant.mp3");
var instructions, buttons_pressed, counterLabel, goal, goal_label, wall, pet;

var position = { x : 0, y: 300 };
var target = { x : 400, y: 50 };
var tween = new TWEEN.Tween(position).to(target, 2000);

tween.onUpdate(function(){
    mesh.position.x = position.x;
    mesh.position.y = position.y;
});

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

var bark = function() {
  counterLabel.setText(parseInt(counterLabel.getText())+1);
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

var init = function () {
  widgets.changeButtonPressedColor("0xff69b4");
	instructions = widgets.createLabel("Give your pet box a rub!", new THREE.Vector3(0, 120, -110), 16, 0x0);
	buttons_pressed = widgets.createLabel("Happiness: ", new THREE.Vector3(170, -100, -110), 12, 0xff69b4);
  counterLabel = widgets.createLabel("0", new THREE.Vector3(235, -100, -110), 12, 0x0);
  goal = 10;
  goal_label = widgets.createLabel("/ " + goal, new THREE.Vector3(275, -100, -110), 12, 0xff69b4);
  wall = widgets.createWall(new THREE.Vector3(0, 0, -200), new THREE.Vector3(800, 300, 10), 0x228B22);
	pet = widgets.createButton("(●´ω｀●)", new THREE.Vector3(0, 0, 0), new THREE.Vector3(90,90,90), 0x8B4513);

  pet.addEventListener('press', function(evt) {
    if (parseInt(counterLabel.getText()) < goal) {
       bark();
     }

    if (parseInt(counterLabel.getText()) === goal) {
      instructions.setText("Hooray, your pet box is happy!", "0xff69b4");
      this.success = true;
    }
  });

  console.log(scene);
}

var tearDown = function(){
  scene.remove(instructions);
  scene.remove(buttons_pressed);
  scene.remove(counterLabel);
  scene.remove(goal_label);
  scene.remove(wall);
  scene.remove(pet);
};

var update = function() {

};

petBoxMiniGame = new MiniGame(init, tearDown, update);
