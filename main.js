import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'

const KEYS = {
    'a': 65,
    's': 83,
    'w': 87,
    'd': 68,
  };
  
  function clamp(x, a, b) {
    return Math.min(Math.max(x, a), b);
  }
  
  class InputController {
    constructor(target) {
      this.target_ = target || document;
      this.initialize_();    
    }
  
    initialize_() {
      this.current_ = {
        leftButton: false,
        rightButton: false,
        mouseXDelta: 0,
        mouseYDelta: 0,
        mouseX: 0,
        mouseY: 0,
      };
      this.previous_ = null;
      this.keys_ = {};
      this.previousKeys_ = {};
      this.target_.addEventListener('mousedown', (e) => this.onMouseDown_(e), false);
      this.target_.addEventListener('mousemove', (e) => this.onMouseMove_(e), false);
      this.target_.addEventListener('mouseup', (e) => this.onMouseUp_(e), false);
      this.target_.addEventListener('keydown', (e) => this.onKeyDown_(e), false);
      this.target_.addEventListener('keyup', (e) => this.onKeyUp_(e), false);
    }
  
    onMouseMove_(e) {
      this.current_.mouseX = e.pageX - window.innerWidth / 2;
      this.current_.mouseY = e.pageY - window.innerHeight / 2;
  
      if (this.previous_ === null) {
        this.previous_ = {...this.current_};
      }
  
      this.current_.mouseXDelta = this.current_.mouseX - this.previous_.mouseX;
      this.current_.mouseYDelta = this.current_.mouseY - this.previous_.mouseY;
    }
  
    onMouseDown_(e) {
      this.onMouseMove_(e);
  
      switch (e.button) {
        case 0: {
          this.current_.leftButton = true;
          break;
        }
        case 2: {
          this.current_.rightButton = true;
          break;
        }
      }
    }
  
    onMouseUp_(e) {
      this.onMouseMove_(e);
  
      switch (e.button) {
        case 0: {
          this.current_.leftButton = false;
          break;
        }
        case 2: {
          this.current_.rightButton = false;
          break;
        }
      }
    }
  
    onKeyDown_(e) {
      this.keys_[e.keyCode] = true;

      console.log(e.keyCode)

      if (e.keyCode === 87){
        document.getElementById('wKey').classList.add('active')
      }
      if (e.keyCode === 83){
        document.getElementById('sKey').classList.add('active')
      }
      if (e.keyCode === 65){
        document.getElementById('aKey').classList.add('active')
      }
      if (e.keyCode === 68){
        document.getElementById('dKey').classList.add('active')
      }
      
    }
  
    onKeyUp_(e) {
      this.keys_[e.keyCode] = false;
      
      if (e.keyCode === 87){
        document.getElementById('wKey').classList.remove('active')
      }
      if (e.keyCode === 83){
        document.getElementById('sKey').classList.remove('active')
      }
      if (e.keyCode === 65){
        document.getElementById('aKey').classList.remove('active')
      }
      if (e.keyCode === 68){
        document.getElementById('dKey').classList.remove('active')
      }
    }
  
    key(keyCode) {
      return !!this.keys_[keyCode];
    }
  
    isReady() {
      return this.previous_ !== null;a
    }
  
    update(_) {
      if (this.previous_ !== null) {
        this.current_.mouseXDelta = this.current_.mouseX - this.previous_.mouseX;
        this.current_.mouseYDelta = this.current_.mouseY - this.previous_.mouseY;
  
        this.previous_ = {...this.current_};
      }
    }
  };
  
  
  class FirstPersonCamera {
    constructor(camera, objects) {
      this.camera_ = camera;
      this.input_ = new InputController();
      this.rotation_ = new THREE.Quaternion();
      this.translation_ = new THREE.Vector3(0, 2, 0);
      this.phi_ = 0;
      this.phiSpeed_ = 8;
      this.theta_ = 0;
      this.thetaSpeed_ = 5;
      this.headBobActive_ = false;
      this.headBobTimer_ = 0;
      this.objects_ = objects;
    }
  
    update(timeElapsedS) {
      this.updateRotation_(timeElapsedS);
      this.updateCamera_(timeElapsedS);
      this.updateTranslation_(timeElapsedS);
      this.input_.update(timeElapsedS);
    }
  
    updateCamera_(_) {
      this.camera_.quaternion.copy(this.rotation_);
      this.camera_.position.copy(this.translation_);
      this.camera_.position.y += Math.sin(this.headBobTimer_ * 10) * 1.5;
  
      const forward = new THREE.Vector3(0, 0, -1);
      forward.applyQuaternion(this.rotation_);
  
      const dir = forward.clone();
  
      forward.multiplyScalar(100);
      forward.add(this.translation_);


      
  
      let closest = forward;
      const result = new THREE.Vector3();
      const ray = new THREE.Ray(this.translation_, dir);
      for (let i = 0; i < this.objects_.length; ++i) {
        if (ray.intersectBox(this.objects_[i], result)) {
          if (result.distanceTo(ray.origin) < closest.distanceTo(ray.origin)) {
            closest = result.clone();
          }
        }
      }
  
      this.camera_.lookAt(closest);
    }
  
    updateTranslation_(timeElapsedS) {
      const forwardVelocity = (this.input_.key(KEYS.w) ? 1 : 0) + (this.input_.key(KEYS.s) ? -1 : 0)
      const strafeVelocity = (this.input_.key(KEYS.a) ? 1 : 0) + (this.input_.key(KEYS.d) ? -1 : 0)
  
      const qx = new THREE.Quaternion();
      qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi_);
  
      const forward = new THREE.Vector3(0, 0, -1);
      forward.applyQuaternion(qx);
      forward.multiplyScalar(forwardVelocity * timeElapsedS * 10);
  
      const left = new THREE.Vector3(-1, 0, 0);
      left.applyQuaternion(qx);
      left.multiplyScalar(strafeVelocity * timeElapsedS * 10);
  
      this.translation_.add(forward);
      this.translation_.add(left);
  
      if (forwardVelocity != 0 || strafeVelocity != 0) {
        this.headBobActive_ = true;
      }
    }
  
    updateRotation_(timeElapsedS) {
      const xh = this.input_.current_.mouseXDelta / window.innerWidth;
      const yh = this.input_.current_.mouseYDelta / window.innerHeight;
  
      this.phi_ += -xh * this.phiSpeed_;
      this.theta_ = clamp(this.theta_ + -yh * this.thetaSpeed_, -Math.PI / 3, Math.PI / 3);
  
      const qx = new THREE.Quaternion();
      qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi_);
      const qz = new THREE.Quaternion();
      qz.setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.theta_);
  
      const q = new THREE.Quaternion();
      q.multiply(qx);
      q.multiply(qz);
  
      this.rotation_.copy(q);
    }
  }
  

  class FirstPersonCameraDemo {
    constructor() {
      this.initialize_();
    }
  
    initialize_() {
      this.initializeRenderer_();
      this.initializeLights_();
      this.initializeScene_();
      this.initializeDemo_();
      this.onWindowResize_();
      this.raf_();
      this.previousRAF_ = null;
    }
  
    initializeDemo_() {
      this.fpsCamera_ = new FirstPersonCamera(this.camera_, this.objects_);
    }
  
    initializeRenderer_() {
      this.threejs_ = new THREE.WebGLRenderer({
        antialias: false,
      });
      this.threejs_.shadowMap.enabled = true;
      this.threejs_.shadowMap.type = THREE.PCFSoftShadowMap;
      this.threejs_.setPixelRatio(window.devicePixelRatio);
      this.threejs_.setSize(window.innerWidth, window.innerHeight);
      this.threejs_.physicallyCorrectLights = true;
      this.threejs_.outputEncoding = THREE.sRGBEncoding;
  
      document.body.appendChild(this.threejs_.domElement);
  
      window.addEventListener('resize', () => {
        this.onWindowResize_();
      }, false);
  
      const fov = 60;
      const aspect = 1920 / 1080;
      const near = 1.0;
      const far = 1000.0;
      this.camera_ = new THREE.PerspectiveCamera(fov, aspect, near, far);
      this.camera_.position.set(0, 0, 0);
  
      this.scene_ = new THREE.Scene();
  
      this.uiCamera_ = new THREE.OrthographicCamera(
          -1, 1, 1 * aspect, -1 * aspect, 1, 1000);
      this.uiScene_ = new THREE.Scene();
    }
  
    initializeScene_() {
        const loader = new GLTFLoader();
        loader.load('/assets/mapModel/SiteModelv1.glb', (gltf) => {
            this.scene_.add(gltf.scene)
        })

      this.objects_ = [];
    }
  
    initializeLights_() {
        let light = new THREE.DirectionalLight(0xFFFFFF,1.0);
        light.lookAt(0,0,0)
        light.position.set(100,100,100);
        light.target.position.set(0,0,0);
        light.castShadow = true;
        light.shadow.bias =  -0.01;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        light.shadow.camera.near = 1.0;
        light.shadow.camera.far = 500;
        light.shadow.camera.left = 200;
        light.shadow.camera.right = -200;
        light.shadow.camera.top = 200;
        light.shadow.camera.bottom = -200;
        this.scene_.add(light)

        light = new THREE.AmbientLight(0x404040);
        this.scene_.add(light)

    }
  
  
    onWindowResize_() {
      this.camera_.aspect = window.innerWidth / window.innerHeight;
      this.camera_.updateProjectionMatrix();
      this.uiCamera_.left = -this.camera_.aspect;
      this.uiCamera_.right = this.camera_.aspect;
      this.uiCamera_.updateProjectionMatrix();
      this.threejs_.setSize(window.innerWidth, window.innerHeight);
    }
    
  
    raf_() {
      requestAnimationFrame((t) => {
        if (this.previousRAF_ === null) {
          this.previousRAF_ = t;
        }
  
        this.step_(t - this.previousRAF_);
        this.threejs_.autoClear = true;
        this.threejs_.render(this.scene_, this.camera_);
        this.threejs_.autoClear = false;
        this.threejs_.render(this.uiScene_, this.uiCamera_);
        this.previousRAF_ = t;
        this.raf_();
      });
    }
  
    step_(timeElapsed) {
      const timeElapsedS = timeElapsed * 0.001;
      this.fpsCamera_.update(timeElapsedS);
    }
  }
  
  let _APP = null;
  
  window.addEventListener('DOMContentLoaded', () => {
    _APP = new FirstPersonCameraDemo();
  });