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

var camera, splineCamera, binormal, normal, scene, scale,
  parent, splines, tube, material, tubeMesh,
  renderer, rollercoaster, splineIndex, targetRotation;
var cube;

function init() {
  rollercoaster = false;
  splineIndex = 0;
  targetRotation = 0;
  scale = 2;
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

  splines = require('./splines.js');

  tube = new THREE.TubeGeometry(splines[splineIndex], 100, 2, 4, true);
  //var geometry = new THREE.TorusKnotGeometry(0.5 - 0.12, 0.12);
  material = new THREE.MeshNormalMaterial();
  tubeMesh = new THREE.Mesh(tube, material);
  tubeMesh.scale.set(scale, scale, scale);
  //scene.add(tubeMesh);
  parent.add(tubeMesh);

  var bgTube = new THREE.TubeGeometry(splines[4], 100, 2, 4, true);
  var mesh = new THREE.Mesh(bgTube, material);
  //parent.add(mesh);

  // window.addEventListener('resize', onWindowResize, false);
  binormal = new THREE.Vector3();
  normal = new THREE.Vector3();

  /*testing*/
  var geometry = new THREE.BoxGeometry(10, 10, 10);
  cube = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
    color: 0xddaa00
  }));
  splineCamera.add(cube);

  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setClearColor(0xfafaff);
  //renderer.setClearColor(0x2cc8ff);
  renderer.setSize(window.innerWidth, window.innerHeight);

  container.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize, false);

  window.onkeydown = function (e) {
    if (e.which === 32) {
      e.preventDefault();
      switchCamera();
    }
    if (e.which === 83) {
      e.preventDefault();
      switchSpline();
    }
  }

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
  tubeMesh = null;
  splineIndex++;
  if (splineIndex > splines.length - 1) splineIndex = 0;
  tube = new THREE.TubeGeometry(splines[splineIndex], 100, 2, 4, true);
  tubeMesh = new THREE.Mesh(tube, material);
  tubeMesh.scale.set(scale, scale, scale);
  parent.add(tubeMesh);
}

function render() {

  updateCamera();
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

  binormal.subVectors(tube.binormals[pickNext], tube.binormals[pick]);
  binormal.multiplyScalar(pickt - pick).add(tube.binormals[pick]);

  var dir = tube.parameters.path.getTangentAt(t);

  var offset = 15;

  normal.copy(binormal).cross(dir);

  // We move on a offset on its binormal
  pos.add(normal.clone().multiplyScalar(offset));

  splineCamera.position.copy(pos);

  var lookAt = tube.parameters.path.getPointAt((t + 30 / tube.parameters.path.getLength()) % 1).multiplyScalar(scale);

  //this is called look ahead, not sure what it means
  //lookAt.copy(pos).add(dir);
  splineCamera.matrix.lookAt(splineCamera.position, lookAt, normal);
  splineCamera.rotation.setFromRotationMatrix(splineCamera.matrix, splineCamera.rotation.order);

  //parent.rotation.y += (targetRotation - parent.rotation.y) * 0.05;
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

init();
animate();