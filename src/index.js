import * as THREE from 'three';
import dat from './lib/dat.gui.min';

import OrbitControlsInit from 'three-orbit-controls';
const OrbitControls = OrbitControlsInit(THREE);


/********************************************
 * Initialize scene
 ********************************************/
const scene = new THREE.Scene();


/********************************************
 * Main and static renderers
 ********************************************/
const mainRenderer = new THREE.WebGLRenderer();
mainRenderer.setSize(window.innerWidth, window.innerHeight / 2);
document.body.appendChild(mainRenderer.domElement);

const staticRenderer = new THREE.WebGLRenderer();
staticRenderer.setSize(window.innerWidth, window.innerHeight / 2);
document.body.appendChild(staticRenderer.domElement);


/********************************************
 * Camera set up
 ********************************************/
const sceneCamera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / (window.innerHeight / 2),
  0.1,
  1000
);
sceneCamera.position.set(-70, 40, 30);
sceneCamera.up = new THREE.Vector3(0, 1, 0);
sceneCamera.lookAt(new THREE.Vector3(0, 0, 200));
controls = new OrbitControls(sceneCamera, mainRenderer.domElement);

// Camera for static rendering
const renderingCamera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / (window.innerHeight / 2),
  0.1,
  1000
);
renderingCamera.position.set(0, 1, -1);
renderingCamera.up = new THREE.Vector3(0, 1, 0);

renderingCamera.lookAt(new THREE.Vector3(0, 1, 1));

/********************************************
 * Camera controls
 ********************************************/
var controls = new function() {
  this.fov = 75;
}();

const gui = new dat.GUI();
gui.add(controls, 'fov', 5, 200);

function setFov(fov) {
  controls.fov = fov;
  gui.__controllers[0].updateDisplay();
  renderingCamera.fov = fov;
  renderingCamera.updateProjectionMatrix();
}


/********************************************
 * Scene elements
 ********************************************/
// Box that represents scene camera
const boxgeom = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
const box = new THREE.Mesh(boxgeom, material);
scene.add(box);
box.position.set(0, 1, -1);

// Grass
const planeW = 200;
const planeH = 200;
const planeZ = planeH / 2 + 1;

const geometry = new THREE.PlaneGeometry(planeW, planeH);
const pmaterial = new THREE.MeshPhongMaterial({
  color: 0x00ff00,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(geometry, pmaterial);
plane.lookAt(new THREE.Vector3(0, 1, 0));
plane.position.set(0, 0, planeZ);
scene.add(plane);

//Hemisphere light
const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 2);
hemiLight.color.setHSL(0.6, 1, 0.6);
hemiLight.groundColor.setHSL(0.095, 1, 0.75);
hemiLight.position.set(0, 50, 0);
scene.add(hemiLight);

//Pointlight and geometry
const slight = new THREE.SphereGeometry(0.5, 16, 8);
const light = new THREE.PointLight(0xffffff, 2, 150, 2);
light.add(
  new THREE.Mesh(slight, new THREE.MeshBasicMaterial({ color: 0xffff00 }))
);
light.position.set(0, 100, planeZ - planeZ / 2);
light.intensity = 5;
scene.add(light);

//Blue sphere
const sgeom = new THREE.SphereGeometry(0.5, 16, 8);
const smat = new THREE.MeshPhongMaterial({ color: 0x0000ff });
const sphere = new THREE.Mesh(sgeom, smat);
sphere.position.set(0, 1, planeZ / 4);
scene.add(sphere);

//Mountains
let radius = 10;
let height = 20;
const rSegments = 100;
const conemat = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
const cylinderCone1 = new THREE.Mesh(
  ((() => {
    const geom = new THREE.CylinderBufferGeometry(
      0,
      radius,
      height,
      rSegments,
      1,
      true
    );
    geom.translate(0, height / 2, 0);
    return geom;
  }))(),
  conemat
);
cylinderCone1.position.set(-15, 0, 49);
scene.add(cylinderCone1);
radius = 30;
height = 50;
const cylinderCone2 = new THREE.Mesh(
  ((() => {
    const geom = new THREE.CylinderBufferGeometry(
      0,
      radius,
      height,
      rSegments,
      1,
      true
    );
    geom.translate(0, height / 2, 0);
    return geom;
  }))(),
  conemat
);
cylinderCone2.position.set(20, 0, 80);
scene.add(cylinderCone2);
radius = 60;
height = 75;
const cylinderCone3 = new THREE.Mesh(
  ((() => {
    const geom = new THREE.CylinderBufferGeometry(
      0,
      radius,
      height,
      rSegments,
      1,
      true
    );
    geom.translate(0, height / 2, 0);
    return geom;
  }))(),
  conemat
);
cylinderCone3.position.set(-40, 0, 120);
scene.add(cylinderCone3);


/********************************************
 * Rendering
 ********************************************/
const render = () => {
  requestAnimationFrame(render, { antialias: true });

  box.rotation.x += 0.1;
  box.rotation.y += 0.1;

  setFov(controls.fov);

  mainRenderer.render(scene, sceneCamera);
  staticRenderer.render(scene, renderingCamera);
};

render();
