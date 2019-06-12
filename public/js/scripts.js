var scene, camera, renderer;


var mouseX = 0;
var mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var cube;
var spheres = [];

init();
animate();


// Initialize environment
function init() {
    scene              = new THREE.Scene();
    camera             = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.01, 100 );
    camera.position.z  = 3;
    camera.focalLength = 3;
    renderer           = new THREE.WebGLRenderer();

    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );

    createBackground();
    createObjects();
};

// Animate function
function animate() {
    requestAnimationFrame( animate );
    render();
	renderer.render(scene, camera);
};

// Crate background environment
function createBackground() {
    var path = "textures/cube/park2/";
    var format = '.jpg';
    var urls = [
        path + 'px' + format, path + 'nx' + format,
        path + 'py' + format, path + 'ny' + format,
        path + 'pz' + format, path + 'nz' + format
    ];

    var textureCube = new THREE.CubeTextureLoader().load( urls );
    scene.background = textureCube;
}

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
    
    // Update camera position
    camera.position.x += ( mouseX - camera.position.x ) * .05;
    camera.position.y += ( - mouseY - camera.position.y ) * .05;
    camera.lookAt( scene.position );
};

function onDocumentMouseMove( event ) {
    mouseX = ( event.clientX - windowHalfX ) / 100;
    mouseY = ( event.clientY - windowHalfY ) / 100;
}