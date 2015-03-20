require('./vendor/CurveExtras.js');
var createGate = require('./createGate.js')
var createText = require('./createText.js')

var splineCamera, forward, inBetweenLove,
  splines, tube, material, tubeMesh, raycaster;

var rollercoaster = false
var splineIndex = 3

var visible = false
var magicNum = 1

var speed = 1
var speedRecord = speed
var cameraCounter = 0

var loopTime = 10000
var aheadOfTime = 800
var aheadOfLove = 200

var collisionPoints = []
var scaleControllers = []
var gateLayers = 6
  // var texts = []
  // var gates = []
  // var gates = []
var ball = null
var scalar = 1
var expo = 1

var Widget = require('./event.js')
var w = Widget()

// var lookAt = new THREE.Vector3()
// var lookForward = new THREE.Vector3()
// var idonu = new THREE.Vector3()
// var lookForwardForLove = new THREE.Vector3()
//var lookAt;
var lookForward;
var idonu = new THREE.Vector3()
var lookForwardForLove;

module.exports = {
  init: function (scene) {

    raycaster = new THREE.Raycaster()

    splineCamera = new THREE.PerspectiveCamera(84, window.innerWidth / window.innerHeight, 0.01, 1000)
    scene.add(splineCamera)

    forward = new THREE.Mesh(new THREE.SphereGeometry(0.2), new THREE.MeshBasicMaterial({
      color: 0xffffff
    }));
    forward.position.copy(splineCamera.position)
    scene.add(forward)

    inBetweenLove = new THREE.Object3D()
    inBetweenLove.position.copy(splineCamera.position)

    var test = new THREE.Mesh(new THREE.SphereGeometry(0.2), new THREE.MeshBasicMaterial({
      color: 0xffffff
    }));
    test.position.copy(splineCamera.position)
    inBetweenLove.add(test)
    scene.add(inBetweenLove)

    splines = require('./splines.js');

    tube = new THREE.TubeGeometry(splines[splineIndex], 100, 1, 4, true)
    material = new THREE.MeshNormalMaterial()
    tubeMesh = new THREE.Mesh(tube, material)
    scene.add(tubeMesh)

    /*testing*/
    ball = new THREE.Mesh(new THREE.SphereGeometry(20, 20, 20), new THREE.MeshNormalMaterial)
    scene.add(ball)

  },

  render: function (scene, camera, renderer) {

    this.updateTime()
    this.updateForward()
    this.updateLove()

    if (collisionPoints.length > 0) {
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

    // if (scaleControllers.length) {
    //   console.log(scaleControllers[scaleControllers.length - 1].children.length)
    // }

    renderer.render(scene, rollercoaster ? splineCamera : camera);
  },

  addGate: function (scene, index) {

    //scaleControllers[index].add(gate)
  },

  addText: function (_text, tag, scene, _destoried) {

    //add collistionPoint
    var collisionPoint = new THREE.Mesh(new THREE.SphereGeometry(0.2), new THREE.MeshNormalMaterial())
    collisionPoint.name = tag
    collisionPoint.visible = false
    collisionPoint.destoryable = _destoried
    this.getPositionAtTheMoment(collisionPoint, 'child')
    scene.add(collisionPoint)
    collisionPoints.push(collisionPoint)

    //add text and gates for every ctrl
    var ctrl = new THREE.Object3D()
      //var ctrl = new THREE.Mesh(new THREE.SphereGeometry(0.2), new THREE.MeshNormalMaterial())
    scaleControllers.push(ctrl)
    this.getPositionAtTheMoment(ctrl, 'parent')

    var text = createText(_text, tag)
    this.getPositionAtTheMoment(text, 'child')
    text.position.copy(new THREE.Vector3())
    ctrl.add(text)

    var lastPosition = new THREE.Vector3()
    lastPosition.copy(this.getPositionAtTheMoment(lastPosition, 'copy'))

    var beginTime;
    if (speed === 1) {
      beginTime = 0;
    } else {
      beginTime = 1000;
    }

    for (var i = 0; i < gateLayers; i++) {
      var self = this;

      setTimeout(function () {
        //self.addGate(scene, scaleControllers.length - 1);
        var gate = createGate()
        self.getPositionAtTheMoment(gate, 'child')

        var tempPosition = new THREE.Vector3()
        tempPosition.copy(self.getPositionAtTheMoment(tempPosition, 'copy'))
          //lastPosition = tempPosition.sub(lastPosition)

        // var test = new THREE.Geometry()
        // test.vertices.push(lastPosition)
        // test.vertices.push(tempPosition)

        // console.log('last ' + lastPosition.x)
        // console.log('temp ' + tempPosition.x)

        // var line = new THREE.Line(test, new THREE.LineBasicMaterial({
        //   color: 0xffffff
        // }))
        // scene.add(line)

        gate.position.copy(new THREE.Vector3())
        var location = new THREE.Vector3()
        location.subVectors(tempPosition, lastPosition)
          //console.log(location)
        gate.position.copy(location)
        ctrl.add(gate)

        lastPosition.copy(tempPosition)
          //console.log('yeah')
      }, i * 200 + beginTime)

    }

    scene.add(ctrl)

  },

  getPositionAtTheMoment: function (objName, hierarchy) {
    switch (hierarchy) {

    case 'child':
      if (speed === 1) {
        objName.position.copy(forward.position)
        objName.matrix.lookAt(objName.position, lookForward, new THREE.Vector3(0, 0, 0))
      } else {
        objName.position.copy(inBetweenLove.position)
        objName.matrix.lookAt(objName.position, lookForwardForLove, new THREE.Vector3(0, 0, 0))
      }

      objName.rotation.setFromRotationMatrix(objName.matrix, objName.rotation.order)

      break

    case 'parent':
      if (speed === 1) {
        objName.position.copy(forward.position)
          //objName.matrix.lookAt(objName.position, lookForward, new THREE.Vector3(0, 0, 0))
      } else {
        objName.position.copy(inBetweenLove.position)
          //objName.matrix.lookAt(objName.position, lookForwardForLove, new THREE.Vector3(0, 0, 0))
      }
      break

      //objName.rotation.setFromRotationMatrix(objName.matrix, objName.rotation.order)
      // if (speed === 1) {
      //   objName.position.copy(forward.position)
      //   objName.matrix.lookAt(objName.position, lookForward, new THREE.Vector3(0, 0, 0))
      // } else {
      //   objName.position.copy(inBetweenLove.position)
      //   objName.matrix.lookAt(objName.position, lookForwardForLove, new THREE.Vector3(0, 0, 0))
      // }
      // objName.rotation.setFromRotationMatrix(objName.matrix, objName.rotation.order)
    case 'copy':
      return speed === 1 ? forward.position : inBetweenLove.position
      break
    }
  },

  destoryText: function (_id, scene) {
    var obj = scene.getObjectById(_id)
      //console.log(obj)
      //console.log(obj.name)
    this.destorySomething(obj, scene)

    var indexToDestory = null
    for (var i = 0; i < collisionPoints.length; i++) {
      if (collisionPoints[i].id === obj.id) {
        collisionPoints.splice(i, 1)
        indexToDestory = i
        break
      }
    }

    var ctrl = scaleControllers[indexToDestory]
    this.destorySomething(ctrl, scene)
    scaleControllers.splice(indexToDestory, 1)
  },

  destorySomething: function (obj, scene) {
    //console.log(obj)
    scene.remove(obj)
      //if (obj.children !== undefined) {
    obj.traverse(function (item) {
        if (item instanceof THREE.Mesh) {
          item.geometry.dispose()
          item.material.dispose()
        }
        item = null
      })
      //}
  },

  changeText: function (_text, tag, id, scene, destoried) {
    this.destoryText(id, scene)
    this.addText(_text, tag, scene, destoried)
  },

  isHit: function () {
    var ray = idonu
    var obj = collisionPoints

    raycaster.ray.set(inBetweenLove.position, ray)

    var intersects = raycaster.intersectObjects(obj, true)

    if (intersects.length > 0 && intersects[0].distance <= 100) {
      return intersects[0].object
    }
    return null
  },

  updateForward: function () {

    //this.updateCamera(forward, cameraCounter, aheadOfTime, lookForward)
    var t = ((cameraCounter + aheadOfTime) % loopTime) / loopTime;
    var pos = tube.parameters.path.getPointAt(t);

    forward.position.copy(pos);

    lookForward = tube.parameters.path.getPointAt((t + magicNum / tube.parameters.path.getLength()) % 1)

    forward.matrix.lookAt(forward.position, lookForward, new THREE.Vector3());
    forward.rotation.setFromRotationMatrix(forward.matrix, forward.rotation.order);
  },

  updateLove: function () {

    //this.updateCamera(inBetweenLove, cameraCounter, aheadOfLove, lookForwardForLove, idonu)
    var t = ((cameraCounter + aheadOfLove) % loopTime) / loopTime;
    var pos = tube.parameters.path.getPointAt(t);

    idonu = tube.parameters.path.getTangentAt(t);

    inBetweenLove.position.copy(pos);

    lookForwardForLove = tube.parameters.path.getPointAt((t + magicNum / tube.parameters.path.getLength()) % 1)

    inBetweenLove.matrix.lookAt(inBetweenLove.position, lookForwardForLove, new THREE.Vector3());
    inBetweenLove.rotation.setFromRotationMatrix(inBetweenLove.matrix, inBetweenLove.rotation.order);
  },

  updateTime: function () {
    if (speed === 1) {
      cameraCounter += 10
      speedRecord = speed
    } else if (speed === -1) {
      cameraCounter -= 10;
      speedRecord = speed;
    }

    if (cameraCounter <= 0) {
      cameraCounter = loopTime
    }

    // this.updateCamera(splineCamera, cameraCounter, 0, lookAt)
    var t = (cameraCounter % loopTime) / loopTime;
    var pos = tube.parameters.path.getPointAt(t);

    splineCamera.position.copy(pos);
    var lookAt = tube.parameters.path.getPointAt((t + magicNum / tube.parameters.path.getLength()) % 1)

    splineCamera.matrix.lookAt(splineCamera.position, lookAt, new THREE.Vector3());
    splineCamera.rotation.setFromRotationMatrix(splineCamera.matrix, splineCamera.rotation.order);

  },

  // i guess it's the problem of passing by reference?
  updateCamera: function (objName, timer, aheadAmount, getPointAtName, getTangentAtName) {
    var t = ((timer + aheadAmount) % loopTime) / loopTime
    var pos = tube.parameters.path.getPointAt(t)

    if (getPointAtName) {
      getTangentAtName = tube.parameters.path.getTangentAt(t)
    }

    objName.position.copy(pos)

    getPointAtName = tube.parameters.path.getPointAt((t + magicNum / tube.parameters.path.getLength()) % 1)

    objName.matrix.lookAt(objName.position, getPointAtName, new THREE.Vector3())
    objName.rotation.setFromRotationMatrix(objName.matrix, objName.rotation.order)
  },

  goForward: function () {
    speed = 1
  },

  goBackward: function () {
    speed = -1
  },

  pause: function () {
    speed = 0
  },

  switchCamera: function () {
    rollercoaster = !rollercoaster
  },

  hideTrack: function () {
    visible = !visible
  },

  switchSpline: function (scene) {
    this.destorySomething(tubeMesh, scene)
    splineIndex++
    if (splineIndex > splines.length - 1) splineIndex = 0
    tube = new THREE.TubeGeometry(splines[splineIndex], 100, 2, 4, true)
    tubeMesh = new THREE.Mesh(tube, material)
    scene.add(tubeMesh)
  },

  onWindowResize: function (camera, renderer) {
    camera.aspect = window.innerWidth / window.innerHeight
      //camera.updateProjectionMatrix();
    splineCamera.aspect = window.innerWidth / window.innerHeight
    splineCamera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  },

  splineCamera: splineCamera,
  w: w,
  tubeMesh: tubeMesh,
  gateLayers: gateLayers,
  scaleControllers: scaleControllers
}