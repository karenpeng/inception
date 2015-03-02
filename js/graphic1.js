module.exports = {
  // makeCubes: function (number) {

  // },

  zoomIn: function () {
    //put text here maybe?
  },

  zoomOut: function () {

  },

  changeValue: function () {

  }
}

require('./vendor/OrbitControls.js');
var Status = require('./vendor/stats.js');

var camera, splineCamera, scene, controls, stats, parent, cubes, lights, renderer;

function init() {
  var container = document.createElement('div');
  document.body.appendChild(container);

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xefd1b5, 0.0025);

  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
  //camera.position.z = 100;
  camera.position.set(10, 20, 200);

  controls = new THREE.OrbitControls(camera);
  controls.damping = 0.2;
  controls.addEventListener('change', render);

  // stats = new Stats();
  // stats.domElement.style.position = 'absolute';
  // stats.domElement.style.top = '0px';
  // stats.domElement.style.zIndex = 100;
  // container.appendChild(stats.domElement);

  var light6 = new THREE.DirectionalLight(0xeeeeff, .2);
  //in case you move the camera
  //i still think that the camera should move freely
  camera.add(light6);

  parent = new THREE.Object3D();
  scene.add(parent);

  cubes = new THREE.Object3D();
  cubes.position.y = -50;
  scene.add(cubes);

  splineCamera = new THREE.PerspectiveCamera(84, window.innerWidth / window.innerHeight, 0.01, 1000);
  parent.add(splineCamera);

  var cube = makeCube();
  cubes.add(cube)

  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setClearColor(0xfafaff);
  renderer.setSize(window.innerWidth, window.innerHeight);

  container.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize, false);
}

function makeCube() {
  var geometry = new THREE.BoxGeometry(10, 10, 10);
  var material = new THREE.MeshBasicMaterial({
    color: 0xddaa00,
    transparent: true,
    opacity: 0.5
  });
  var cube = new THREE.Mesh(geometry, material);
  return cube;
}

module.exports.makeCubes = function (num) {
  console.log(num);
  for (var i = 1; i < num + 1; i++) {
    var cube = makeCube();
    cube.position.y += (10 * i / 2);
    cube.scale.set(i / 2, i / 2, i / 2);

    cubes.add(cube);
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
  renderer.render(scene, camera);
  controls.update();
  //stats.update();
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

init();
animate();