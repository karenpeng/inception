module.exports = {
  zoomIn: function (value) {
    camera.lookAt(new THREE.Vector3());
  },

  changeValue: function (value) {

  },

  zoomOut: function () {

  }
}

var camera, scene, renderer;

function init() {
  var container = document.createElement('div');
  document.body.appendChild(container);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 2;

  var CustomSinCurve = THREE.Curve.create(
    function (scale) { //custom curve constructor
      this.scale = (scale === undefined) ? 1 : scale;
    },

    function (t) { //getPoint: t is between 0-1
      var tx = t * 3 - 1.5,
        ty = Math.sin(2 * Math.PI * t),
        tz = 0;

      return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
    }
  );

  var path = new CustomSinCurve(10);

  var geometry = new THREE.TubeGeometry(
    path, //path
    20, //segments
    2, //radius
    8, //radiusSegments
    false //closed
  );
  var material = new THREE.MeshNormalMaterial();
  var mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setClearColor(0xfafaff);
  //renderer.setClearColor(0x2cc8ff);
  renderer.setSize(window.innerWidth, window.innerHeight);

  container.appendChild(renderer.domElement);

  // window.addEventListener('resize', onWindowResize, false);

  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

init();
animate();