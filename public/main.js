import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { Octree } from 'three/addons/math/Octree.js';

import { Capsule } from 'three/addons/math/Capsule.js';


const clock = new THREE.Clock();

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x88ccee );
scene.fog = new THREE.Fog( 0x88ccee, 0, 50 );

const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.rotation.order = 'YXZ';

const fillLight1 = new THREE.HemisphereLight( 0x8dc1de, 0x00668d, 1.5 );
fillLight1.position.set( 2, 1, 1 );
scene.add( fillLight1 );

const directionalLight = new THREE.DirectionalLight( 0xffffff, 2.5 );
directionalLight.position.set( - 5, 25, - 1 );
directionalLight.castShadow = true;
directionalLight.shadow.camera.near = 0.01;
directionalLight.shadow.camera.far = 500;
directionalLight.shadow.camera.right = 30;
directionalLight.shadow.camera.left = - 30;
directionalLight.shadow.camera.top	= 30;
directionalLight.shadow.camera.bottom = - 30;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.radius = 4;
directionalLight.shadow.bias = - 0.00006;
scene.add( directionalLight );

const container = document.getElementById( 'container' );

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.useLegacyLights = false;
container.appendChild( renderer.domElement );

const stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0px';
container.appendChild( stats.domElement );

const GRAVITY = 30;


const STEPS_PER_FRAME = 5;

const worldOctree = new Octree();

const playerCollider = new Capsule( new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( 0, 2, 0 ), 1 );

const playerVelocity = new THREE.Vector3();
const playerDirection = new THREE.Vector3();

let playerOnFloor = false;
let mouseTime = 0;

const keyStates = {};

const vector1 = new THREE.Vector3();
const vector2 = new THREE.Vector3();
const vector3 = new THREE.Vector3();


const geometry = new THREE.PlaneGeometry(7,7);
const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( geometry, material );
plane.name = 'Board'
plane.position.set(0,6.2,-0.2)
scene.add( plane );
playerCollider.start.set(0,3,-3)

// const geometry3 = new THREE.CapsuleGeometry( 1, 1, 2, 4 ); 
// const material3 = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
// const capsule = new THREE.Mesh( geometry3, material3 ); 
// capsule.position.set(0,2.5,-2)
// scene.add( capsule );




// const geometry2 = new THREE.PlaneGeometry(40,40);
// const material2 = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
// const plane2 = new THREE.Mesh( geometry2, material2 );
// plane2.rotation.x = Math.PI / 2
// plane2.position.set(0,-0,0)


document.addEventListener( 'keydown', ( event ) => {

  keyStates[ event.code ] = true;

  if (event.code === 'KeyW'){
    document.getElementById('wKey').classList.add('active')
  }
  if (event.code === 'KeyS'){
    document.getElementById('sKey').classList.add('active')
  }
  if (event.code === 'KeyA'){
    document.getElementById('aKey').classList.add('active')
  }
  if (event.code === 'KeyD'){
    document.getElementById('dKey').classList.add('active')
  }
  
})

document.addEventListener( 'keyup', ( event ) => {

  keyStates[ event.code ] = false;


  if (event.code === 'KeyW'){
    document.getElementById('wKey').classList.remove('active')
  }
  if (event.code === 'KeyS'){
    document.getElementById('sKey').classList.remove('active')
  }
  if (event.code === 'KeyA'){
    document.getElementById('aKey').classList.remove('active')
  }
  if (event.code === 'KeyD'){
    document.getElementById('dKey').classList.remove('active')
  }

} );

container.addEventListener( 'mousedown', () => {

  document.body.requestPointerLock();

  mouseTime = performance.now();
} );

document.addEventListener( 'mouseup', () => {

  //Hello

} );

function triggerObjectEvent() {
  console.log('hello')
}

document.body.addEventListener( 'mousemove', ( event ) => {
  
  const pointer = new THREE.Vector2();

  if ( document.pointerLockElement === document.body ) {

    camera.rotation.y -= event.movementX / 500;
    camera.rotation.x -= event.movementY / 500;
    
    pointer.y -= event.movementX / 500;
    pointer.x -= event.movementY / 500;

  }

  const rayCaster = new THREE.Raycaster();

  rayCaster.setFromCamera(pointer,camera)

  

  

  // const intersects = rayCaster.intersectObject(scene.children[3])
  const intersects2 = rayCaster.intersectObject(scene.children[2])
  // console.log(scene.children)

  if (intersects2.length > 0){

    document.body.addEventListener('mousedown', () => {
      let run = true

      if (run) {
        triggerObjectEvent()
        run = false
      }
      
    }, {once:true})
  }

  // function applyOpac (){

  //   if (intersects2.length > 0){
  //     intersects2[0].object.material.transparent = true;
  //     intersects2[0].object.material.opacity = 0.5;s
  //   }
  //   console.log(intersects2)

  //   document.addEventListener('mousedown', () => {

  //     if (intersects2.length > 0 && intersects2.object.name === 'Board') {
  //       document.getElementsByClassName('examplePopup')[0].classList.add('activePopup')
  //       document.exitPointerLock()
  //     }

  //     document.getElementById('buttonExit').addEventListener('click', function(){
  //       document.getElementsByClassName('examplePopup')[0].classList.remove('activePopup')
  //       console.log('kjn')
  //       document.body.requestPointerLock() 
  //     })
  //   },{useCapture: true})

    

    



  //   // if (intersects2.length > 0){

  //   //   intersects2[0].object.material.transparent = true;
  //   //   intersects2[0].object.material.opacity = 0.5;
      
  //   //   if (intersects2[0].object.name === 'Board'){
  //   //     document.addEventListener('mousedown', function test() {
  //         // document.getElementsByClassName('examplePopup')[0].classList.add('activePopup')
  //         // document.exitPointerLock()
  //   //     })
  //       // document.getElementById('buttonExit').addEventListener('click', function(){
  //       //   document.getElementsByClassName('examplePopup')[0].classList.remove('activePopup')
  //       //   document.body.requestPointerLock()
  //   //     })
  //   //   }
  //   // }
  // }


    function removeOpac (){
      for (let i = 0; i < scene.children.length; i++){
        if (scene.children[i].material) {
          scene.children[i].material.opacity = 1.0;
            
        } else if (scene.children[i].children[0]){
          scene.children[i].children[0].material.opacity = 1.0;
        }
      }
    }
  
  // removeOpac()
  // applyOpac()
  

});

window.addEventListener( 'resize', onWindowResize );

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function playerCollisions() {

  const result = worldOctree.capsuleIntersect( playerCollider );

  playerOnFloor = false;

  if ( result ) {

    playerOnFloor = result.normal.y > 0;

    if ( ! playerOnFloor ) {

      playerVelocity.addScaledVector( result.normal, - result.normal.dot( playerVelocity ) );

    }

    playerCollider.translate( result.normal.multiplyScalar( result.depth ) );

  }

}

function updatePlayer( deltaTime ) {

  let damping = Math.exp( - 4 * deltaTime ) - 1;

  if ( ! playerOnFloor ) {

    playerVelocity.y -= GRAVITY * deltaTime;

    // small air resistance
    damping *= 0.1;

  }

  playerVelocity.addScaledVector( playerVelocity, damping );

  const deltaPosition = playerVelocity.clone().multiplyScalar( deltaTime );
  playerCollider.translate( deltaPosition );

  playerCollisions();

  camera.position.copy( playerCollider.end );

}

function getForwardVector() {

  camera.getWorldDirection( playerDirection );
  playerDirection.y = 0;
  playerDirection.normalize();

  return playerDirection;

}

function getSideVector() {

  camera.getWorldDirection( playerDirection );
  playerDirection.y = 0;
  playerDirection.normalize();
  playerDirection.cross( camera.up );

  return playerDirection;

}

function controls( deltaTime ) {

  // gives a bit of air control
  const speedDelta = deltaTime * ( playerOnFloor ? 25 : 8 );

  if ( keyStates[ 'KeyW' ] ) {

    playerVelocity.add( getForwardVector().multiplyScalar( speedDelta ) );

  }

  if ( keyStates[ 'KeyS' ] ) {

    playerVelocity.add( getForwardVector().multiplyScalar( - speedDelta ) );

  }

  if ( keyStates[ 'KeyA' ] ) {

    playerVelocity.add( getSideVector().multiplyScalar( - speedDelta ) );

  }

  if ( keyStates[ 'KeyD' ] ) {

    playerVelocity.add( getSideVector().multiplyScalar( speedDelta ) );

  }

  if ( playerOnFloor ) {

    if ( keyStates[ 'Space' ] ) {

      playerVelocity.y = 15;

    }

  }

}

const loader = new GLTFLoader();

loader.load( '/assets/models/signTest.glb', ( gltf ) => {

  gltf.scene.name = 'Sign'

  scene.add( gltf.scene );

  worldOctree.fromGraphNode( gltf.scene );

  gltf.scene.traverse( child => {

    if ( child.isMesh ) {

      child.castShadow = true;
      child.receiveShadow = true;

      if ( child.material.map ) {

        child.material.map.anisotropy = 4;

      }

    }

  } );

  loader.load('/assets/models/plane.glb', (gltf) => {

    gltf.scene.name = 'Ground'

    scene.add (gltf.scene);

    worldOctree.fromGraphNode(gltf.scene)
  })

  animate();

} );

function teleportPlayerIfOob() {

  if ( camera.position.y <= - 25 ) {

    // playerCollider.start.set( 0, .35, 0 );
    // playerCollider.end.set( 0, 5, 0 );
    playerCollider.start.set(0,3,-3)
    playerCollider.end.set(0,3,-3)
    playerCollider.radius = 1;
    camera.position.copy( playerCollider.end );
    camera.rotation.set( 0, 0, 0 );

  }

}


function animate() {

  const deltaTime = Math.min( 0.05, clock.getDelta() ) / STEPS_PER_FRAME;

  // we look for collisions in substeps to mitigate the risk of
  // an object traversing another too quickly for detection.

  for ( let i = 0; i < STEPS_PER_FRAME; i ++ ) {

    controls( deltaTime );

    updatePlayer( deltaTime );

    teleportPlayerIfOob();

  }

  renderer.render( scene, camera );

  stats.update();

  requestAnimationFrame( animate );

}