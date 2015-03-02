module.exports = {
  zoomIn: function (value) {
    //camera.lookAt(new THREE.Vector3());
    setTimeout(function () {
      //move the camera
    }, 1000);
  },

  changeValue: function (value) {

  },

  zoomOut: function () {

  }
}

require('./vendor/CurveExtras.js');
//require('./vendor/stats.js');
var createGate = require('./createGate.js');

var camera, splineCamera, cameraHelper, cameraEye, binormal, normal, scene, scale,
  parent, splines, tube, material, tubeMesh,
  renderer, rollercoaster, splineIndex, targetRotation;
var cube;
var plane;
var planeParent, planePP;
var lookAt;
var stats;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var targetRotation = 0;
var targetRotationOnMouseDown = 0;

var mouseX = 0;
var mouseXOnMouseDown = 0;

function init() {

  rollercoaster = false;
  splineIndex = 0;
  targetRotation = 0;
  scale = 1;
  var container = document.createElement('div');
  document.body.appendChild(container);

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xefd1b5, 0.25, 1);
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
  //camera.position.z = 100;
  camera.position.set(0, 20, 200);

  parent = new THREE.Object3D();
  parent.position.y = 10;
  scene.add(parent);

  splineCamera = new THREE.PerspectiveCamera(84, window.innerWidth / window.innerHeight, 0.01, 1000);
  parent.add(splineCamera);
  var light6 = new THREE.DirectionalLight(0xeeeeff, .8);
  //in case you move the camera
  //i still think that the camera should move freely
  splineCamera.add(light6);

  cameraHelper = new THREE.CameraHelper(splineCamera);
  scene.add(cameraHelper);

  cameraEye = new THREE.Mesh(new THREE.SphereGeometry(2), new THREE.MeshBasicMaterial({
    color: 0xdddddd
  }));
  parent.add(cameraEye);

  cameraHelper.visible = true;
  cameraEye.visible = true;

  var ambientLight = new THREE.AmbientLight(0x000000);
  scene.add(ambientLight);

  // var lights = [];
  // lights[0] = new THREE.PointLight(0xffffff, 1, 0);
  // lights[1] = new THREE.PointLight(0xffffff, 1, 0);
  // lights[2] = new THREE.PointLight(0xffffff, 1, 0);

  // lights[0].position.set(0, 200, 0);
  // lights[1].position.set(100, 200, 100);
  // lights[2].position.set(-100, -200, -100);

  // scene.add(lights[0]);
  // scene.add(lights[1]);
  // scene.add(lights[2]);

  splines = require('./splines.js');

  tube = new THREE.TubeGeometry(splines[splineIndex], 100, 2, 4, true);
  //var geometry = new THREE.TorusKnotGeometry(0.5 - 0.12, 0.12);
  material = new THREE.MeshNormalMaterial();
  //material = new THREE.MeshDepthMaterial();
  // material = new THREE.MeshPhongMaterial({
  //   color: 0xeeff77,
  //   emissive: 0xeeff77
  // });
  tubeMesh = new THREE.Mesh(tube, material);
  tubeMesh.scale.set(scale, scale, scale);
  //scene.add(tubeMesh);
  parent.add(tubeMesh);

  var bgTube = new THREE.TubeGeometry(splines[4], 100, 2, 4, true);
  var mesh = new THREE.Mesh(bgTube, material);
  //parent.add(mesh);

  planePP = createGate();
  scene.add(planePP);

  // window.addEventListener('resize', onWindowResize, false);
  binormal = new THREE.Vector3();
  normal = new THREE.Vector3();

  /*testing*/

  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setClearColor(0xfafaff);
  //renderer.setClearColor(0x2cc8ff);
  renderer.setSize(window.innerWidth, window.innerHeight);

  container.appendChild(renderer.domElement);

  stats = new Stats();
  console.log(stats)
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  container.appendChild(stats.domElement);

  window.addEventListener('resize', onWindowResize, false);
  renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
  renderer.domElement.addEventListener('touchstart', onDocumentTouchStart, false);
  renderer.domElement.addEventListener('touchmove', onDocumentTouchMove, false);

  window.onkeydown = function (e) {
    //space
    if (e.which === 32) {
      e.preventDefault();
      switchCamera();
    }
    //s
    if (e.which === 83) {
      e.preventDefault();
      switchSpline();
    }
    //a
    if (e.which === 65) {
      e.preventDefault();
      addGate();
    }
    //b
    if (e.which === 66) {
      e.preventDefault();
      addGate1();
    }
  }

}

//module.exports = {
//  addGate: function () {
function addGate() {
    var gate = createGate();
    gate.lookAt(splineCamera.position);
    //gate.matrix.lookAt(gate.position, lookAt, normal);
    gate.position.copy(splineCamera.position);
    //splineCamera.add(gate);
    parent.add(gate);
  }
  //}
function addGate1() {
  var gate = createGate();
  gate.lookAt(splineCamera.position);
  //gate.matrix.lookAt(gate.position, lookAt, normal);
  gate.position.copy(splineCamera.position);
  splineCamera.add(gate);
  //parent.add(gate);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function switchCamera() {
  rollercoaster = !rollercoaster;
}

function switchSpline() {
  parent.remove(tubeMesh);
  //TODO: find out how to dispose geometry and material
  tubeMesh.children.forEach(function (item) {
      item.dispose();
    })
    //tubeMesh.dispose();
  tubeMesh = null;
  splineIndex++;
  if (splineIndex > splines.length - 1) splineIndex = 0;
  tube = new THREE.TubeGeometry(splines[splineIndex], 100, 2, 4, true);
  tubeMesh = new THREE.Mesh(tube, material);
  tubeMesh.scale.set(scale, scale, scale);
  parent.add(tubeMesh);
}

function render() {

  //if (rollercoaster) {
  updateCamera();
  //}
  stats.update();
  renderer.render(scene, rollercoaster ? splineCamera : camera);

  //console.log(splineCamera.position);
}

function updateCamera() {
  var time = Date.now();
  var loopTime = 20000;
  var t = (time % loopTime) / loopTime;

  var pos = tube.parameters.path.getPointAt(t);
  pos.multiplyScalar(scale);

  var segments = tube.tangents.length;
  var pickt = t * segments;
  var pick = Math.floor(pickt);
  var pickNext = (pick + 1) % segments;

  // binormal.subVectors(tube.binormals[pickNext], tube.binormals[pick]);
  // binormal.multiplyScalar(pickt - pick).add(tube.binormals[pick]);

  var dir = tube.parameters.path.getTangentAt(t);

  var offset = 15;

  normal.copy(binormal).cross(dir);

  // We move on a offset on its binormal
  pos.add(normal.clone().multiplyScalar(offset));

  splineCamera.position.copy(pos);

  cameraEye.position.copy(pos);

  lookAt = tube.parameters.path.getPointAt((t + 30 / tube.parameters.path.getLength()) % 1).multiplyScalar(scale);

  //this is called look ahead, not sure what it means
  //lookAt.copy(pos).add(dir);
  splineCamera.matrix.lookAt(splineCamera.position, lookAt, normal);
  splineCamera.rotation.setFromRotationMatrix(splineCamera.matrix, splineCamera.rotation.order);
  cameraHelper.update();
  parent.rotation.y += (targetRotation - parent.rotation.y) * 0.05;
}

function animate() {
  requestAnimationFrame(animate);
  planePP.lookAt(splineCamera.position);
  planePP.position.copy(splineCamera.position);
  render();
}

init();
animate();

//mouse!

function onDocumentMouseDown(event) {

  event.preventDefault();

  renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
  renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false);
  renderer.domElement.addEventListener('mouseout', onDocumentMouseOut, false);

  mouseXOnMouseDown = event.clientX - windowHalfX;
  targetRotationOnMouseDown = targetRotation;

}

function onDocumentMouseMove(event) {

  mouseX = event.clientX - windowHalfX;

  targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.02;

}

function onDocumentMouseUp(event) {

  renderer.domElement.removeEventListener('mousemove', onDocumentMouseMove, false);
  renderer.domElement.removeEventListener('mouseup', onDocumentMouseUp, false);
  renderer.domElement.removeEventListener('mouseout', onDocumentMouseOut, false);

}

function onDocumentMouseOut(event) {

  renderer.domElement.removeEventListener('mousemove', onDocumentMouseMove, false);
  renderer.domElement.removeEventListener('mouseup', onDocumentMouseUp, false);
  renderer.domElement.removeEventListener('mouseout', onDocumentMouseOut, false);

}

function onDocumentTouchStart(event) {

  if (event.touches.length == 1) {

    event.preventDefault();

    mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
    targetRotationOnMouseDown = targetRotation;

  }

}

function onDocumentTouchMove(event) {

  if (event.touches.length == 1) {

    event.preventDefault();

    mouseX = event.touches[0].pageX - windowHalfX;
    targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.05;

  }

}