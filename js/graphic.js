require('./vendor/CurveExtras.js');
//require('./vendor/stats.js');
var createGate = require('./createGate.js');
var createText = require('./createText.js');

var scale, splineCamera,
  splines, tube, material, tubeMesh,
  binormal, normal, lookForward,
  forward, raycaster,
  rollercoaster, splineIndex;
var planePP;
var visible = false;
var magicNum = 1;
var speed = 1;
var speedRecord = speed;
var cameraCounter = 0;
var loopTime = 10000;
var texts = [];
var dir;
var ball = null;
var gates = [];
var scalar = 1;
var expo = 1;
var Widget = require('./event.js');
var w = Widget();

module.exports = {
  init: function (scene) {

    rollercoaster = false;
    splineIndex = 3;
    targetRotation = 0;
    scale = 1;
    raycaster = new THREE.Raycaster();

    splineCamera = new THREE.PerspectiveCamera(84, window.innerWidth / window.innerHeight, 0.01, 1000);
    scene.add(splineCamera);

    forward = new THREE.Mesh(new THREE.SphereGeometry(2), new THREE.MeshBasicMaterial({
      color: 0xffffff
    }));
    forward.position.copy(splineCamera.position);
    scene.add(forward);

    splines = require('./splines.js');

    tube = new THREE.TubeGeometry(splines[splineIndex], 100, 1, 4, true);
    material = new THREE.MeshNormalMaterial();
    tubeMesh = new THREE.Mesh(tube, material);
    tubeMesh.scale.set(scale, scale, scale);
    scene.add(tubeMesh);

    planePP = createGate();
    scene.add(planePP);

    binormal = new THREE.Vector3();
    normal = new THREE.Vector3();

    /*testing*/
    ball = new THREE.Mesh(new THREE.SphereGeometry(20, 20, 20), new THREE.MeshNormalMaterial)
    scene.add(ball)

  },

  render: function (scene, camera, renderer) {
    //var time = Date.now();
    //if (rollercoaster) {
    var time = Date.now()
    this.updateCamera();
    this.updateForward();
    if (texts.length > 0) {
      w.detect(this.isHit());
    }
    tubeMesh.visible = visible;
    forward.visible = visible;

    planePP.lookAt(splineCamera.position);
    planePP.position.copy(splineCamera.position);

    //expo *= 1.00000000000000000000000000000000000000000000001
    //scalar += expo
    scalar += 0.1
      // ball.scale = new THREE.Vector3(scalar, scalar, scalar)
    if (ball !== null) {
      ball.scale.set(scalar, scalar, scalar)
        //console.log(ball.matrixWorld.elements[0])
      if (ball.matrixWorld.elements[0] > 10) {
        console.log('by-bye ball')
        scene.remove(ball)
        ball.traverse(function (item) {
          if (item instanceof THREE.Mesh) {
            item.geometry.dispose()
            item.material.dispose()
          }
        })
        ball = null
      }
    }

    if (gates.length > 0) {
      //   console.log('sss')
      gates.forEach(function (gate, index) {

        //console.log(gate instanceof THREE.Mesh)
        //console.log(gate instanceof THREE.Object3D)
        //mat4 = new THREE.Matrix4()
        //gate.applyMatrix(mat4)
        //console.log(gate.matrixWorld.elements[0])
        //     if (gate.matrixWorld.elements[0] > 4) {
        //       // scene.remove(gate)
        //       // gate.forEach(function (child) {
        //       //   child.dispose()
        //       // })
        //       // gate = null
        //       // gates.splice(index, 1)
        //     }
      });
    }

    renderer.render(scene, rollercoaster ? splineCamera : camera);
  },

  addGate: function (scene) {
    var gate = createGate();
    //gate.lookAt(splineCamera.position);
    gate.position.copy(forward.position);
    gate.matrix.lookAt(gate.position, lookForward, new THREE.Vector3(0, 0, 0));
    gate.rotation.setFromRotationMatrix(gate.matrix, gate.rotation.order);
    scene.add(gate);
    gates.push(gate);
  },

  addText: function (_text, _tag, scene) {
    var text = createText(_text, _tag);
    text.position.copy(forward.position);
    text.matrix.lookAt(text.position, lookForward, new THREE.Vector3(0, 0, 0));
    text.rotation.setFromRotationMatrix(text.matrix, text.rotation.order);
    texts.push(text);
    scene.add(text);
  },

  destoryText: function (scene) {
    scene.remove(texts[texts.length - 1]);
    texts[texts.length - 1].children.forEach(function (item) {
      item.dispose();
    })
    texts[texts.length - 1] = null;
  },

  changeText: function (_text, _tag, scene) {
    this.destoryText(scene);
    this.addText(_text, _tag, scene);
  },

  isHit: function () {
    var ray = dir;
    //console.log(texts[texts.length - 1] instanceof THREE.Mesh)
    var obj = [texts[texts.length - 1], texts[texts.length - 1]];
    raycaster.ray.set(splineCamera.position, ray);
    var intersects = raycaster.intersectObjects(obj, true);
    console.log
    if (intersects.length > 0 && intersects[0].distance <= 10) {
      return intersects[0].object.name;
    }
    return null;
  },

  updateForward: function () {
    var tForward = ((cameraCounter + 500) % loopTime) / loopTime;
    var pos = tube.parameters.path.getPointAt(tForward);
    pos.multiplyScalar(scale);

    forward.position.copy(pos);

    lookForward = tube.parameters.path.getPointAt((tForward + magicNum / tube.parameters.path.getLength()) % 1).multiplyScalar(scale);

    forward.matrix.lookAt(forward.position, lookForward, normal);
    forward.rotation.setFromRotationMatrix(forward.matrix, forward.rotation.order);

  },

  updateCamera: function () {
    if (speed === 1) {
      cameraCounter += 10;
      speedRecord = speed;
    } else if (speed === -1) {
      cameraCounter -= 10;
      speedRecord = speed;
    }

    if (cameraCounter <= 0) {
      cameraCounter = loopTime;
    }
    var t = (cameraCounter % loopTime) / loopTime;
    var pos = tube.parameters.path.getPointAt(t);
    pos.multiplyScalar(scale);

    dir = tube.parameters.path.getTangent(t);

    splineCamera.position.copy(pos);
    var lookAt = tube.parameters.path.getPointAt((t + magicNum / tube.parameters.path.getLength()) % 1).multiplyScalar(scale);

    splineCamera.matrix.lookAt(splineCamera.position, lookAt, normal);
    splineCamera.rotation.setFromRotationMatrix(splineCamera.matrix, splineCamera.rotation.order);

  },

  switchCamera: function () {
    rollercoaster = !rollercoaster;
  },

  swtichDirection: function () {
    if (speed === 1) speed = -1;
    else if (speed === -1) speed = 1;
    else if (speed === 0) speed = speedRecord;
  },

  pause: function () {
    speed = 0;
  },

  hideTrack: function () {
    visible = !visible;
  },

  switchSpline: function (scene) {
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
  },

  onWindowResize: function (camera, renderer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    splineCamera.aspect = window.innerWidth / window.innerHeight;
    splineCamera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  },
  splineCamera: splineCamera,
  w: w
}