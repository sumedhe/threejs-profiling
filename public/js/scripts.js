var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var DIST_FRONT = 1000;
var DIST_BACK  = 0.01;
var DIST_UP    = 500;
var DIST_DOWN  = 250;
var DIST_LEFT  = 2000;
var DIST_RIGHT = 2000;

var NO_OF_PARROTS = 50;
var FLY_SPEED     = 4;
var FLY_DURATION  = 0.7;

var scene, camera, renderer;
var cubeTexture, gltfLoader, stats;

var mouseX = 0;
var mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var spheres, mixer, morphs = [];

var modelSelection = [
    { name: "Flamingo", count: 20 },
    { name: "Parrot", count: 20 },
    { name: "Horse", count: 10, onGround: true },
]

var clock = new THREE.Clock();

init();
animate();

// Initialize environment
function init() {
    createScene();
    createBackground();
    createObjects();
};

// Animate function
function animate() {
    requestAnimationFrame( animate );
    render();
    stats.update();
};

function createScene(){
    scene              = new THREE.Scene();
    camera             = new THREE.PerspectiveCamera( 60, SCREEN_WIDTH / SCREEN_HEIGHT, DIST_BACK, DIST_FRONT + 1000 );
    camera.position.z  = 3;
    camera.focalLength = 3;

    // Setup renderer
    renderer             = new THREE.WebGLRenderer();
    renderer.gammaOutput = true;
    renderer.gammaFactor = 1.5;
    renderer.autoClear   = false;
    renderer.setSize( window.innerWidth, window.innerHeight );

    container = document.createElement( 'div' );
    document.body.appendChild( container );
    container.appendChild( renderer.domElement );

    // Add lights
    var ambient = new THREE.AmbientLight( 0x444444 );
    scene.add( ambient );
    
    var light = new THREE.SpotLight( 0xffffff, 1, 0, Math.PI / 2 );
    light.position.set( 0, 1500, 1000 );
    light.target.position.set( 0, 0, 0 );
    scene.add( light );


    // Animation
    mixer = new THREE.AnimationMixer( scene );

    stats = new Stats();
    container.appendChild( stats.dom );

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
}

// Crate background environment
function createBackground() {
    var path   = "textures/cube/park2/";
    var format = '.jpg';
    var urls   = [
        path + 'px' + format, path + 'nx' + format,
        path + 'py' + format, path + 'ny' + format,
        path + 'pz' + format, path + 'nz' + format
    ];

    cubeTexture = new THREE.CubeTextureLoader().load( urls );
    scene.background = cubeTexture;
}

// Add new objects to the scene
function createObjects() {
    // Create Parrot
    gltfLoader = new THREE.GLTFLoader();

    modelSelection.forEach((item) => {
        console.log(item);
        gltfLoader.load( "models/gltf/" + item.name + ".glb", function ( gltf ) {
            var mesh = gltf.scene.children[ 0 ];
            var clip = gltf.animations[ 0 ];
    
            for ( var i = 0; i <= item.count; ++i ) {
                var x = Math.random() * (DIST_RIGHT + DIST_LEFT) - DIST_LEFT;
                var y = Math.random() * DIST_UP - 100;
                var z = - Math.random() * (DIST_FRONT - DIST_BACK) - DIST_BACK;
    
                if (item.onGround) {
                    y = -DIST_DOWN;
                }

                addMorph( mesh, clip, 145, FLY_DURATION, x, y, z);
            }
        } );
    })
}

// Render in each frame
function render() {
    // Update camera position
    camera.position.x += ( mouseX - camera.position.x ) * .05;
    camera.position.y += ( - mouseY - camera.position.y ) * .05;
    camera.lookAt( scene.position );

    // Update Parrot
    var delta = clock.getDelta();
    mixer.update( delta );
    for ( var i = 0; i < morphs.length; i ++ ) {
        var morph = morphs[ i ];
        morph.translateZ(FLY_SPEED);
        if (morph.position.x > DIST_RIGHT) {
            morph.position.x = -1 * DIST_LEFT;
        }
    }

    renderer.render(scene, camera);
};

// Add morphs
function addMorph( mesh, clip, speed, duration, x, y, z ) {
    mesh          = mesh.clone();
    mesh.material = mesh.material.clone();
    mesh.speed    = speed;

    mixer.clipAction( clip, mesh ).
        setDuration( duration ).
        startAt( - duration * Math.random() ).
        play();

    mesh.position.set( x, y, z );
    mesh.rotation.y    = Math.PI / 2;
    mesh.castShadow    = true;
    mesh.receiveShadow = true;
    scene.add( mesh );

    morphs.push( mesh );
}

function onDocumentMouseMove( event ) {
    mouseX = ( event.clientX - windowHalfX ) / 100;
    mouseY = ( event.clientY - windowHalfY ) / 100;
}