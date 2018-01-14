var bark_sounds = new Audio("../../sounds/box-bark.mp3");
var pant_sounds = new Audio("../../sounds/box-pant.mp3");
var instructions, buttons_pressed, counterLabel, goal, goal_label, wall, pet;

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
      setTimeout(function () {
        window.location.replace("../mainmenu/mainmenu.html");
      }, 3000);
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
