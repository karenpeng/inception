var graphic = require('./graphic.js')

var scene, camera, stats, renderer, cameraEye, cameraHelper;

function init() {
  var container = document.createElement('div');
  document.body.appendChild(container);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.set(0, 20, 200);

  //cameraHelper = new THREE.CameraHelper(graphic.splineCamera);
  //scene.add(cameraHelper);

  // cameraEye = new THREE.Mesh(new THREE.SphereGeometry(2), new THREE.MeshBasicMaterial({
  //   color: 0xdddddd
  // }));
  // scene.add(cameraEye);

  //cameraHelper.visible = true;
  //cameraEye.visible = true;

  renderer = new THREE.WebGLRenderer({
    antialias: true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);

  container.appendChild(renderer.domElement);

  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  stats.domElement.style.right = '0px';
  container.appendChild(stats.domElement);
  window.addEventListener('resize', function () {
    graphic.onWindowResize(scene, renderer);
  }, false);

  graphic.init(scene);
  //console.log(graphic.pos)

}

function render() {
  //cameraEye.position.copy(graphic.pos);
  //cameraHelper.update();
  stats.update();
}

function animate() {
  requestAnimationFrame(animate)
  render()
  graphic.render(scene, camera, renderer)
}

init()
animate()

exports.scene = scene