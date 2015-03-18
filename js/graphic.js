require('./vendor/CurveExtras.js');
//require('./vendor/stats.js');
var createGate = require('./createGate.js');
var createText = require('./createText.js');

var scale, splineCamera, inBetweenLove,
  splines, tube, material, tubeMesh,
  lookForward, lookForwardForLove,
  forward, raycaster,
  rollercoaster, splineIndex;
var visible = false;
var magicNum = 1;
var speed = 1;
var speedRecord = speed;
var cameraCounter = 0;
var loopTime = 10000;
var ctrls = [];
var texts = []
  //var dir;
var ball = null;
var gates = [];
var scalar = 1;
var expo = 1;
var Widget = require('./event.js');
var w = Widget();
var aheadOfTime = 800;
var aheadOfLove = 200;
var idonu = new THREE.Vector3(0, 0, 0);

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

    inBetweenLove = new THREE.Object3D()
    inBetweenLove.position.copy(splineCamera.position)

    var test = new THREE.Mesh(new THREE.SphereGeometry(2), new THREE.MeshBasicMaterial({
      color: 0xffffff
    }));
    test.position.copy(splineCamera.position)
    test.scale.set(0.1, 0.1, 0.1)
    inBetweenLove.add(test)
    scene.add(inBetweenLove)

    splines = require('./splines.js');

    tube = new THREE.TubeGeometry(splines[splineIndex], 100, 1, 4, true);
    material = new THREE.MeshNormalMaterial();
    tubeMesh = new THREE.Mesh(tube, material);
    tubeMesh.scale.set(scale, scale, scale);
    scene.add(tubeMesh);

    /*testing*/
    ball = new THREE.Mesh(new THREE.SphereGeometry(20, 20, 20), new THREE.MeshNormalMaterial)
    scene.add(ball)

  },

  render: function (scene, camera, renderer) {

    var time = Date.now()
    this.updateCamera();
    this.updateForward();
    this.updateLove();
    if (ctrls.length > 0) {
      w.detect(this.isHit());
    }
    tubeMesh.visible = visible;

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

  // addGate: function (scene) {
  //   var gate = createGate();
  //   //gate.lookAt(splineCamera.position);
  //   gate.position.copy(forward.position);
  //   gate.matrix.lookAt(gate.position, lookForward, new THREE.Vector3(0, 0, 0));
  //   gate.rotation.setFromRotationMatrix(gate.matrix, gate.rotation.order);
  //   scene.add(gate);
  //   gates.push(gate);
  // },

  addText: function (_text, tag, scene, _destoried) {

    var ctrl = new THREE.Mesh(new THREE.SphereGeometry(0.2), new THREE.MeshNormalMaterial())
    ctrl.name = tag
    ctrl.destoried = _destoried
    ctrl.visible = false
      //text.visible = true

    if (speed === 1) {
      ctrl.position.copy(forward.position);
    } else {
      ctrl.position.copy(inBetweenLove.position);
    }
    ctrl.matrix.lookAt(ctrl.position, lookForward, new THREE.Vector3(0, 0, 0));
    ctrl.rotation.setFromRotationMatrix(ctrl.matrix, ctrl.rotation.order);

    //ctrl.add(text);

    ctrl.destoryable = _destoried;
    scene.add(ctrl)
    ctrls.push(ctrl)

    var text = createText(_text, tag);
    if (speed === 1) {
      text.position.copy(forward.position);
    } else {
      text.position.copy(inBetweenLove.position);
    }
    text.matrix.lookAt(text.position, lookForward, new THREE.Vector3(0, 0, 0));
    text.rotation.setFromRotationMatrix(text.matrix, text.rotation.order);

    scene.add(text);
    texts.push(text);

    // for (var i = 0; i < 6; i++) {
    //   // setTimeout(function () {
    //   //   var gate = createGate();
    //   //   text.add(gate)
    //   // }, i * 300)
    //   addGate(i)
    // }

    function addGate(num) {
      setTimeout(function () {
        var gate = createGate()
        text.add(gate)
      }, i * num)
    }
  },

  destoryText: function (_id, scene) {
    var obj = scene.getObjectById(_id)
      //console.log(obj.name)
    this.destorySomething(obj, scene)

    var idToDestory = null;
    for (var i = 0; i < ctrls.length; i++) {
      if (ctrls[i].id === obj.id) {
        ctrls.splice(i, 1)
        idToDestory = i;
        break
      }
    }

    var text = texts[idToDestory];
    this.destorySomething(text, scene);
    texts.splice(idToDestory, 1);

  },

  destorySomething: function (obj, scene) {
    scene.remove(obj)
    obj.traverse(function (item) {
      if (item instanceof THREE.Mesh) {
        item.geometry.dispose()
        item.material.dispose()
      }
      item = null
    })
  },

  changeText: function (_text, tag, id, scene, destoried) {
    this.destoryText(id, scene);
    this.addText(_text, tag, scene, destoried);
  },

  isHit: function () {
    var ray = idonu;
    var obj = ctrls;

    raycaster.ray.set(inBetweenLove.position, ray);

    var intersects = raycaster.intersectObjects(obj, true);

    if (intersects.length > 0 && intersects[0].distance <= 100) {
      return intersects[0].object;
    }
    return null;
  },

  updateForward: function () {
    var tForward = ((cameraCounter + aheadOfTime) % loopTime) / loopTime;
    var pos = tube.parameters.path.getPointAt(tForward);
    pos.multiplyScalar(scale);

    forward.position.copy(pos);

    lookForward = tube.parameters.path.getPointAt((tForward + magicNum / tube.parameters.path.getLength()) % 1).multiplyScalar(scale);

    forward.matrix.lookAt(forward.position, lookForward, new THREE.Vector3());
    forward.rotation.setFromRotationMatrix(forward.matrix, forward.rotation.order);

  },

  updateLove: function () {
    var tForward = ((cameraCounter + aheadOfLove) % loopTime) / loopTime;
    var pos = tube.parameters.path.getPointAt(tForward);
    pos.multiplyScalar(scale);

    idonu = tube.parameters.path.getTangentAt(tForward);

    inBetweenLove.position.copy(pos);

    lookForwardForLove = tube.parameters.path.getPointAt((tForward + magicNum / tube.parameters.path.getLength()) % 1).multiplyScalar(scale);

    inBetweenLove.matrix.lookAt(inBetweenLove.position, lookForwardForLove, new THREE.Vector3());
    inBetweenLove.rotation.setFromRotationMatrix(inBetweenLove.matrix, inBetweenLove.rotation.order);
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

    splineCamera.position.copy(pos);
    var lookAt = tube.parameters.path.getPointAt((t + magicNum / tube.parameters.path.getLength()) % 1).multiplyScalar(scale);

    splineCamera.matrix.lookAt(splineCamera.position, lookAt, new THREE.Vector3());
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

  goForward: function () {
    speed = 1;
  },

  goBackward: function () {
    speed = -1;
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
    //camera.updateProjectionMatrix();
    splineCamera.aspect = window.innerWidth / window.innerHeight;
    splineCamera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  },
  splineCamera: splineCamera,
  w: w
}