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

var camera, scene, stats, splineCamera, cameraHelper, cameraEye, scale,
  splines, tube, material, tubeMesh,
  binormal, normal, lookAt,
  forward, backward,
  renderer, rollercoaster, splineIndex;
var planePP;
var visible = true;
var magicNum = 1;

function init() {

  rollercoaster = false;
  splineIndex = 3;
  targetRotation = 0;
  scale = 1;
  var container = document.createElement('div');
  document.body.appendChild(container);

  scene = new THREE.Scene();
  //scene.fog = new THREE.FogExp2(0xefd1b5, 1, 1);
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
  //camera.position.z = 100;
  camera.position.set(0, 20, 200);

  splineCamera = new THREE.PerspectiveCamera(84, window.innerWidth / window.innerHeight, 0.01, 1000);

  scene.add(splineCamera);

  //var light6 = new THREE.DirectionalLight(0xeeeeff, .8);
  //in case you move the camera
  //i still think that the camera should move freely
  //splineCamera.add(light6);
  //
  forward = new THREE.Mesh(new THREE.SphereGeometry(4), material);
  forward.position.copy(splineCamera.position);
  scene.add(forward);

  backward = forward.clone();
  scene.add(backward);

  cameraHelper = new THREE.CameraHelper(splineCamera);
  scene.add(cameraHelper);

  cameraEye = new THREE.Mesh(new THREE.SphereGeometry(2), new THREE.MeshBasicMaterial({
    color: 0xdddddd
  }));
  scene.add(cameraEye);

  cameraHelper.visible = true;
  cameraEye.visible = true;

  // var ambientLight = new THREE.AmbientLight(0x000000);
  // scene.add(ambientLight);

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

  tube = new THREE.TubeGeometry(splines[splineIndex], 100, 1, 4, true);
  //var geometry = new THREE.TorusKnotGeometry(0.5 - 0.12, 0.12);
  material = new THREE.MeshNormalMaterial();
  //material = new THREE.MeshDepthMaterial();
  // material = new THREE.MeshPhongMaterial({
  //   color: 0xeeff77,
  //   emissive: 0xeeff77
  // });
  tubeMesh = new THREE.Mesh(tube, material);
  tubeMesh.scale.set(scale, scale, scale);
  scene.add(tubeMesh);

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
  //renderer.setClearColor(0xfafaff);
  //renderer.setClearColor(0x2cc8ff);
  renderer.setSize(window.innerWidth, window.innerHeight);

  container.appendChild(renderer.domElement);

  stats = new Stats();
  console.log(stats)
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  container.appendChild(stats.domElement);

  window.addEventListener('resize', onWindowResize, false);

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
      visible = !visible;
    }
  }

}

//module.exports = {
//  addGate: function () {
function addGate() {
    var gate = createGate();
    //gate.lookAt(splineCamera.position);
    gate.position.copy(splineCamera.position);
    gate.matrix.lookAt(gate.position, lookAt, normal);
    gate.rotation.setFromRotationMatrix(gate.matrix, gate.rotation.order);
    scene.add(gate);
  }
  //}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function switchCamera() {
  rollercoaster = !rollercoaster;
}

function switchSpline() {
  scene.remove(tubeMesh);
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
  scene.add(tubeMesh);
}

function render() {
  var time = Date.now();
  //if (rollercoaster) {
  updateCamera(time);
  updateForward(time);
  //TODO: right at that moment, start going backward
  //how???
  updateBackward(time);
  //}
  tubeMesh.visible = visible;
  stats.update();
  renderer.render(scene, rollercoaster ? splineCamera : camera);

  //console.log(splineCamera.position);
}

function updateBackward(time) {
  var loopTime = 20000;
  var tBackward = 1 - (time % loopTime) / loopTime;
  var pos = tube.parameters.path.getPointAt(tBackward);
  pos.multiplyScalar(scale);

  backward.position.copy(pos);

  var lookBackward = tube.parameters.path.getPointAt((tBackward + magicNum / tube.parameters.path.getLength()) % 1).multiplyScalar(scale);

  backward.matrix.lookAt(backward.position, lookBackward, normal);
  backward.rotation.setFromRotationMatrix(backward.matrix, backward.rotation.order);

}

function updateForward(time) {
  var loopTime = 20000;
  var tForward = ((time + 2000) % loopTime) / loopTime;
  var pos = tube.parameters.path.getPointAt(tForward);
  pos.multiplyScalar(scale);

  forward.position.copy(pos);

  var lookForward = tube.parameters.path.getPointAt((tForward + magicNum / tube.parameters.path.getLength()) % 1).multiplyScalar(scale);

  forward.matrix.lookAt(forward.position, lookForward, normal);
  forward.rotation.setFromRotationMatrix(forward.matrix, forward.rotation.order);

}

function updateCamera(time) {
  //console.log(time);
  var loopTime = 20000;
  var t = (time % loopTime) / loopTime;

  var pos = tube.parameters.path.getPointAt(t);
  pos.multiplyScalar(scale);

  // var segments = tube.tangents.length;
  // var pickt = t * segments;
  // var pick = Math.floor(pickt);
  // var pickNext = (pick + 1) % segments;

  // binormal.subVectors(tube.binormals[pickNext], tube.binormals[pick]);
  // binormal.multiplyScalar(pickt - pick).add(tube.binormals[pick]);

  //var dir = tube.parameters.path.getTangentAt(t);

  //var offset = 15;

  //normal.copy(binormal).cross(dir);

  // We move on a offset on its binormal
  //pos.add(normal.clone().multiplyScalar(offset));

  splineCamera.position.copy(pos);

  cameraEye.position.copy(pos);

  lookAt = tube.parameters.path.getPointAt((t + magicNum / tube.parameters.path.getLength()) % 1).multiplyScalar(scale);

  //this is called look ahead, not sure what it means
  //lookAt.copy(pos).add(dir);
  splineCamera.matrix.lookAt(splineCamera.position, lookAt, normal);
  splineCamera.rotation.setFromRotationMatrix(splineCamera.matrix, splineCamera.rotation.order);
  cameraHelper.update();
}

function animate() {
  requestAnimationFrame(animate);
  planePP.lookAt(splineCamera.position);
  planePP.position.copy(splineCamera.position);
  render();
}

init();
animate();