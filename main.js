/*global THREE*/
var sceneWidth;
var sceneHeight;
var camera;
var scene;
var renderer;
var dom;
var hero;
var sun;
var ground;
var orbitControl;
var analyser;

init();
function init() {
	createScene(); //set up the scene
	update(); //call game loop
}

function createScene() {
    sceneWidth = window.innerWidth;
    sceneHeight = window.innerHeight;
    scene = new THREE.Scene();//the 3d scene
    //scene.fog = new THREE.Fog(0x00ff00, 50, 800);//enable fog
    camera = new THREE.PerspectiveCamera( 60, sceneWidth / sceneHeight, 0.1, 1000 );//perspective camera
    renderer = new THREE.WebGLRenderer({alpha:true});//renderer with transparent backdrop
    renderer.shadowMap.enabled = true;//enable shadow
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize( sceneWidth, sceneHeight );
    dom = document.getElementById('canvas');
	dom.appendChild(renderer.domElement);

	analyser = setupAudio(camera);
	
	//add items to scene
	var heroGeometry = new THREE.BoxGeometry(1, 1, 1);//cube
	var heroMaterial = new THREE.MeshStandardMaterial({ color: 0x883333 });
	hero = new THREE.Mesh(heroGeometry, heroMaterial);
	hero.castShadow = true;
	hero.receiveShadow = false;
	hero.position.y = 2;
	scene.add(hero);

	var planeGeometry = new THREE.PlaneGeometry(5, 5, 4, 4);
	var planeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
	ground = new THREE.Mesh(planeGeometry, planeMaterial);
	ground.receiveShadow = true;
	ground.castShadow = false;
	ground.rotation.x = -Math.PI/2;
	scene.add(ground);

	camera.position.z = 5;
	camera.position.y = 3;
	
	sun = new THREE.DirectionalLight(0xffffff, 0.8);
	sun.position.set( 0,4,1 );
	sun.castShadow = true;
	scene.add(sun);
	//Set up shadow properties for the sun light
	sun.shadow.mapSize.width = 256;
	sun.shadow.mapSize.height = 256;
	sun.shadow.camera.near = 0.5;
	sun.shadow.camera.far = 50 ;
	
	orbitControl = new THREE.OrbitControls(camera, renderer.domElement);//helper to rotate around in scene
	orbitControl.addEventListener('change', render);
	// orbitControl.enableDamping = true;
	// orbitControl.dampingFactor = 0.8;
	// orbitControl.enableZoom = false;
	
	// var lightHelper = new THREE.CameraHelper( sun.shadow.camera );
	// scene.add(lightHelper);// enable to see the light cone
	var worldFrame = new THREE.AxesHelper(5);
	scene.add(worldFrame);

	window.addEventListener('resize', onWindowResize, false);//resize callback
}

function update(){//animate
    hero.rotation.x += 0.01;
    hero.rotation.y += 0.01;
    var avgFrequency = analyser.getAverageFrequency()*0.01;
    console.log(avgFrequency);
    console.log(analyser.getFrequencyData())
    if(avgFrequency > 0) {
	    hero.scale.set(avgFrequency,avgFrequency,avgFrequency);
    }
    render();
	requestAnimationFrame(update);//request next update
}
function render(){
    renderer.render(scene, camera);//draw
}
function onWindowResize() {//resize & align
	sceneHeight = window.innerHeight;
	sceneWidth = window.innerWidth;
	renderer.setSize(sceneWidth, sceneHeight);
	camera.aspect = sceneWidth/sceneHeight;
	camera.updateProjectionMatrix();
}

function setupAudio(camera) {
	var audioListener = new THREE.AudioListener();
	camera.add(audioListener);

	var sound = new THREE.Audio(audioListener); //audio source
	// load a sound and set it as the Audio object's buffer
	var audioLoader = new THREE.AudioLoader();
	audioLoader.load('sounds/2u.mp3', function(buffer){
		sound.setBuffer(buffer);
		sound.setLoop(true);
		sound.setVolume(0.5);
		sound.play();
	});

	// create an AudioAnalyser, passing in the sound and desired fftSize
	return analyser = new THREE.AudioAnalyser(sound, 32);

	// get the average frequency of the sound
	// var data = analyser.getAverageFrequency();
	// 					   getFrequencyData()
}