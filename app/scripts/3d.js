(function(){
    var container, stats;
    var camera, scene, renderer;
    var water, controls;
    var parameters = {
        width: 2000,
        height: 2000,
        widthSegments: 250,
        heightSegments: 250,
        depth: 1500,
        param: 4,
        filterparam: 1
    };

    var waterNormals;

    function init() {

        // Lookup threed element
        container = $('#threed')[0];
        // Set renderer
        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( container.clientWidth, container.clientHeight );
        container.appendChild( renderer.domElement );

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 0.5, 3000000 );
        camera.position.set( 2000, 750, 2000 );

        controls = new THREE.OrbitControls( camera, renderer.domElement );
        controls.enablePan = false;
        controls.minDistance = 1000.0;
        controls.maxDistance = 5000.0;
        controls.maxPolarAngle = Math.PI * 0.495;
        controls.center.set( 0, 500, 0 );

        scene.add( new THREE.AmbientLight( 0x444444 ) );

        var light = new THREE.DirectionalLight( 0xffffbb, 1 );
        light.position.set( - 1, 1, - 1 );
        scene.add( light );


        waterNormals = new THREE.ImageUtils.loadTexture( 'textures/waternormals.jpg' );
        waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

        water = new THREE.Water( renderer, camera, scene, {
	    textureWidth: 512,
	    textureHeight: 512,
	    waterNormals: waterNormals,
	    alpha: 	1.0,
	    sunDirection: light.position.clone().normalize(),
	    sunColor: 0xffffff,
	    waterColor: 0x001e0f,
	    distortionScale: 50.0
        } );


        var mirrorMesh = new THREE.Mesh(
	    new THREE.PlaneBufferGeometry( parameters.width * 500, parameters.height * 500 ),
	    water.material
        );

        mirrorMesh.add( water );
        mirrorMesh.rotation.x = - Math.PI * 0.5;
        scene.add( mirrorMesh );


        // load skybox

        var cubeMap = new THREE.CubeTexture( [] );
        cubeMap.format = THREE.RGBFormat;

        var loader = new THREE.ImageLoader();
        loader.load( 'textures/skyboxsun25degtest.png', function ( image ) {

	    var getSide = function ( x, y ) {

	        var size = 1024;

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

        var skyBox = new THREE.Mesh(
	    new THREE.BoxGeometry( 1000000, 1000000, 1000000 ),
	    skyBoxMaterial
        );

        scene.add( skyBox );


    }

    //

    function animate() {

        requestAnimationFrame( animate );
        render();

    }

    function render() {

        var time = performance.now() * 0.001;
        renderer.setSize( container.clientWidth, container.clientHeight );

        water.material.uniforms.time.value += 1.0 / 60.0;
        controls.update();
        water.render();
        renderer.render( scene, camera );

    }

    init();
    animate();


})();
