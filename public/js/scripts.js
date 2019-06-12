var scene, camera, renderer;
var cubeTexture;

var mouseX = 0;
var mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

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

    cubeTexture = new THREE.CubeTextureLoader().load( urls );
    scene.background = cubeTexture;
}

// Add new objects to the scene
function createObjects() {
    // Create spheres
    var geometry = new THREE.SphereBufferGeometry( 0.1, 32, 16 );
    var material = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: cubeTexture } );

    for ( var i = 0; i < 500; i ++ ) {
        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.x = Math.random() * 10 - 5;
        mesh.position.y = Math.random() * 10 - 5;
        mesh.position.z = Math.random() * 10 - 5;

        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;

        scene.add( mesh );
        spheres.push( mesh );
    }
}

// Render in each frame
function render() {
    // Update camera position
    camera.position.x += ( mouseX - camera.position.x ) * .05;
    camera.position.y += ( - mouseY - camera.position.y ) * .05;
    camera.lookAt( scene.position );

    // Update sphere movements
    var timer = 0.0001 * Date.now();
    for ( var i = 0, il = spheres.length; i < il; i ++ ) {
        var sphere = spheres[ i ];
        sphere.position.x = 5 * Math.cos( timer + i );
        sphere.position.y = 5 * Math.sin( timer + i * 1.1 );
    }
};

function onDocumentMouseMove( event ) {
    mouseX = ( event.clientX - windowHalfX ) / 100;
    mouseY = ( event.clientY - windowHalfY ) / 100;
}