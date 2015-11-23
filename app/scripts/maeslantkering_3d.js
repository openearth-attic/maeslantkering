/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//// Script to visualize the Maeslantkering with THREEJS
//container = document.createElement( 'div' );
//document.body.appendChild( container );
container = $('#threed')[0];

var renderer = new THREE.WebGLRenderer();
renderer.autoClear = false;
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( container.clientWidth, container.clientHeight );
container.appendChild( renderer.domElement );

var scene = new THREE.Scene();
var scene_2 = new THREE.Scene(); //for bathymetry, otherwise shadow on water

var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 1, 3000000 );
camera.position.set( 20000, 10000, 200 );

controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.enablePan = false;
controls.minDistance = 5000.0;
controls.maxDistance = 5000.0;
controls.minPolarAngle = Math.PI * 0.45;
controls.maxPolarAngle = Math.PI * 0.45;
      controls.minAzimuthAngle = -0.1 * Math.PI; // radians
      controls.maxAzimuthAngle = 0.1 * Math.PI; // radians

controls.center.set( 0, 500, 0 );

// SKYBOX
var cubeMap = new THREE.CubeTexture( [] );
cubeMap.format = THREE.RGBFormat;

var loader = new THREE.ImageLoader();
loader.load( 'textures/cloudy_skybox2.png', function ( image ) {
    var getSide = function ( x, y ) {
            var size = 1022;
            var canvas = document.createElement( 'canvas' );
            canvas.width = size;
            canvas.height = size;
            var context = canvas.getContext( '2d' );
            context.drawImage( image, - x * size, - y * size );
            return canvas;
    };
    cubeMap.images[ 0 ] = getSide( 2, 1 ); // px
    cubeMap.images[ 1 ] = getSide( 0, 1 ); // nx
    cubeMap.images[ 2 ] = getSide( 1, 0 ); // py
    cubeMap.images[ 3 ] = getSide( 1, 2 ); // ny
    cubeMap.images[ 4 ] = getSide( 1, 1 ); // pz
    cubeMap.images[ 5 ] = getSide( 3, 1 ); // nz
    cubeMap.needsUpdate = true;
} );

var cubeShader = THREE.ShaderLib[ 'cube' ];
cubeShader.uniforms[ 'tCube' ].value = cubeMap;

var skyBoxMaterial = new THREE.ShaderMaterial( {
    fragmentShader: cubeShader.fragmentShader,
    vertexShader: cubeShader.vertexShader,
    uniforms: cubeShader.uniforms,
    depthWrite: false,
    side: THREE.BackSide
} );

var skyBox = new THREE.Mesh(new THREE.BoxGeometry( 1000000, 1000000, 1000000 ), skyBoxMaterial);
scene.add( skyBox );

var directionalLight = new THREE.DirectionalLight( 0xffeedd );
directionalLight.position.set( 0, 1000, 0 );
scene.add(directionalLight);
scene_2.add( directionalLight );

//water  
waterNormals = new THREE.ImageUtils.loadTexture( 'textures/waternormals.jpg' );
waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

water = new THREE.Water( renderer, camera, scene, {
        textureWidth: 1024,
        textureHeight: 1024,
        waterNormals: waterNormals,
        alpha: 	1.0,
        sunDirection: directionalLight.position.clone().normalize(),
        sunColor: 0xffffff,
        waterColor: 0x36484A,
        distortionScale: 50.0
} );

mirrorMesh = new THREE.Mesh(
        new THREE.PlaneBufferGeometry( 200000 , 60000  ),
        water.material
);

mirrorMesh.add( water );
mirrorMesh.rotation.x = - Math.PI * 0.5;
mirrorMesh.rotation.z = -0.20 * Math.PI;
mirrorMesh.position.set(6500,-70,-6000); //y to prevent z-fighting
scene.add( mirrorMesh );

var manager = new THREE.LoadingManager();
manager.onProgress = function ( item, loaded, total ) {
    console.log( item, loaded, total );
};

var kering_south;
var kering_north;
var batymetry;

var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log( Math.round(percentComplete, 2) + '% downloaded' );
        }
};

var onError = function ( xhr ) {};

var material = new THREE.MeshBasicMaterial({color: 'white', side: THREE.DoubleSide});

//object loader for south
var loader = new THREE.OBJLoader( manager );
    loader.load( 'objects/Maeslantkering_south.obj', function ( object ) {
        object.traverse( function ( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.material = material;
                }
        } );

        kering_south = object;
        kering_south.children[0].geometry.translate(6000,0,-9300);
        kering_south.position.set(-6000, 0, 9300 );
        scene.add( kering_south );

}, onProgress, onError );

//object loader for north
var loader = new THREE.OBJLoader( manager );
    loader.load( 'objects/Maeslantkering_north.obj', function ( object ) {
        object.traverse( function ( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.material = material;
                }
        } );
        kering_north = object;
        kering_north.children[0].geometry.translate(-18400,0,20500);
        kering_north.position.set(18400, 0, -20500 );
        scene.add( kering_north );
}, onProgress, onError );         

// load a texture, set wrap mode to repeat
var texture = THREE.ImageUtils.loadTexture( "textures/aerial_photo.jpg" );
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;

//object loader for bathymetry
var loader = new THREE.OBJLoader( manager );
    loader.load( 'objects/bathymetry.obj', function ( object ) {
        object.traverse( function ( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.material.map = texture;
                }
        } );

        batymetry = object;
        batymetry.scale.set(100,100,100); //maeslantkering is in cm, surrounding in m
        scene_2.add( batymetry );                       
}, onProgress, onError );

var factor = 500; //factor between real movement and animation
var max_rotation_y = 0.295*Math.PI; //rotation once closed
var percentage_closed = 0.0;
var closing = false;

var render = function () {
    requestAnimationFrame( render );

    if (kering_north!= null){
        
        //opening rotation of Maeslantkering
        current_angle = kering_north.rotation.y;    
        if (Math.abs(current_angle - percentage_closed*max_rotation_y) < 0.01){a = 0;} //do nothing
        else if (current_angle<=percentage_closed*max_rotation_y){a = 1;} //closing
        else{a = -1;} //opening

        kering_south.rotation.y += factor * a * -0.29 * Math.PI/216000.0;
        kering_north.rotation.y += factor * a * 0.29 * Math.PI/216000.0;
    }

    //Water
    water.material.uniforms.time.value += 1.0 / 10.0;
    water.render();

    //ThreeJS rendering
    controls.update();
    renderer.render(scene, camera);
    renderer.render(scene_2,camera);

};

render();

function change_open(percentage){
    percentage_closed = percentage;
} 
