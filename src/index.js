//Create scene
var scene = new THREE.Scene();

//Top renderer
var renderer1 = new THREE.WebGLRenderer();
renderer1.setSize(window.innerWidth, window.innerHeight / 2);
document.body.appendChild(renderer1.domElement);

//Bottom renderer
var renderer2 = new THREE.WebGLRenderer();
renderer2.setSize(window.innerWidth, window.innerHeight / 2);
document.body.appendChild(renderer2.domElement);

//Box
var boxgeom = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
var fakeCamera = new THREE.Mesh(boxgeom, material);
scene.add(fakeCamera);
fakeCamera.position.set(0, 1, -1);

//Camera on top
var camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / (window.innerHeight / 2),
  0.1,
  1000,
);
camera.position.set(-70, 40, 30);
camera.up = new THREE.Vector3(0, 1, 0);
camera.lookAt(new THREE.Vector3(0, 0, 20));
controls = new THREE.OrbitControls(camera, renderer1.domElement);

//Grass
var planeW = 200;
var planeH = 200;
var geometry = new THREE.PlaneGeometry(planeW, planeH);
var pmaterial = new THREE.MeshPhongMaterial({
  color: 0x00ff00,
  side: THREE.DoubleSide,
});
var plane = new THREE.Mesh(geometry, pmaterial);
plane.lookAt(new THREE.Vector3(0, 1, 0));
var planeZ = planeH / 2 + 1;
plane.position.set(0, 0, planeZ);
scene.add(plane);

//Rendered camera
var r_camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / (window.innerHeight / 2),
  0.1,
  1000,
);
r_camera.position.set(0, 1, -1);
r_camera.up = new THREE.Vector3(0, 1, 0);
r_camera.lookAt(new THREE.Vector3(0, 1, planeZ));

//Hemisphere light
hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 2);
hemiLight.color.setHSL(0.6, 1, 0.6);
hemiLight.groundColor.setHSL(0.095, 1, 0.75);
hemiLight.position.set(0, 50, 0);
scene.add(hemiLight);

//Pointlight and geometry
var slight = new THREE.SphereGeometry(0.5, 16, 8);
var light = new THREE.PointLight(0xffffff, 2, 150, 2);
light.add(
  new THREE.Mesh(slight, new THREE.MeshBasicMaterial({ color: 0xffff00 })),
);
light.position.set(0, 100, planeZ - planeZ / 2);
light.intensity = 5;
scene.add(light);

//Blue sphere
var sgeom = new THREE.SphereGeometry(0.5, 16, 8);
var smat = new THREE.MeshPhongMaterial({ color: 0x0000ff });
sphere = new THREE.Mesh(sgeom, smat);
sphere.position.set(0, 1, planeZ / 4);
scene.add(sphere);

//Mountains
var radius = 10;
var height = 20;
var rSegments = 100;
var conemat = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
cylinderCone1 = new THREE.Mesh(
  (function() {
    var geom = new THREE.CylinderBufferGeometry(
      0,
      radius,
      height,
      rSegments,
      1,
      true,
    );
    geom.translate(0, height / 2, 0);
    return geom;
  })(),
  conemat,
);
cylinderCone1.position.set(-15, 0, 49);
scene.add(cylinderCone1);
radius = 30;
height = 50;
cylinderCone2 = new THREE.Mesh(
  (function() {
    var geom = new THREE.CylinderBufferGeometry(
      0,
      radius,
      height,
      rSegments,
      1,
      true,
    );
    geom.translate(0, height / 2, 0);
    return geom;
  })(),
  conemat,
);
cylinderCone2.position.set(20, 0, 80);
scene.add(cylinderCone2);
radius = 60;
height = 75;
cylinderCone3 = new THREE.Mesh(
  (function() {
    var geom = new THREE.CylinderBufferGeometry(
      0,
      radius,
      height,
      rSegments,
      1,
      true,
    );
    geom.translate(0, height / 2, 0);
    return geom;
  })(),
  conemat,
);
cylinderCone3.position.set(-40, 0, 120);
scene.add(cylinderCone3);

//Camera controls
var camcont = new function() {
  this.fov = 75;
}();

var gui = new dat.GUI();
gui.add(camcont, 'fov', 5, 200);

function setFov(fov) {
  camcont.fov = fov;
  gui.__controllers[0].updateDisplay();
  r_camera.fov = fov;
  r_camera.updateProjectionMatrix();
}

var render = function() {
  requestAnimationFrame(render, { antialias: true });

  fakeCamera.rotation.x += 0.1;
  fakeCamera.rotation.y += 0.1;

  setFov(camcont.fov);

  renderer1.render(scene, camera);
  renderer2.render(scene, r_camera);
};

render();
