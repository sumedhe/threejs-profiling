var scene, camera, renderer;
var cube;

init();
animate();


// Initialize environment
function init() {
    scene             = new THREE.Scene();
    camera            = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    camera.position.z = 5;
    renderer          = new THREE.WebGLRenderer();

    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    createObjects();
};

// Animate function
function animate() {
    requestAnimationFrame( animate );
    render();
	renderer.render(scene, camera);
};

// Add new objects to the scene
function createObjects() {
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

    cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
}

// Render in each frame
function render() {
	cube.rotation.x += 0.1;
	cube.rotation.y += 0.1;
};
