module.exports = function (text) {

  require('./vendor/helvetiker_regular.js');

  textGeo = new THREE.TextGeometry(text, {

    size: 0.5,
    height: 0.1,
    curveSegments: 4,

    font: 'helvetiker',
    weight: 'normal',
    style: 'normal',

    bevelThickness: .01,
    bevelSize: .01,
    bevelEnabled: false,

    material: 0,
    extrudeMaterial: 0.1

  });

  textGeo.computeBoundingBox();

  var centerOffset = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
  textGeo.applyMatrix(new THREE.Matrix4().makeTranslation(centerOffset, 0, 0));
  textGeo.computeVertexNormals();
  // "fix" side normals by removing z-component of normals for side faces
  // (this doesn't work well for beveled geometry as then we lose nice curvature around z-axis)

  // if (!bevelEnabled) {

  //   var triangleAreaHeuristics = 0.1 * (height * size);

  //   for (var i = 0; i < textGeo.faces.length; i++) {

  //     var face = textGeo.faces[i];

  //     if (face.materialIndex == 1) {

  //       for (var j = 0; j < face.vertexNormals.length; j++) {

  //         face.vertexNormals[j].z = 0;
  //         face.vertexNormals[j].normalize();

  //       }

  //       var va = textGeo.vertices[face.a];
  //       var vb = textGeo.vertices[face.b];
  //       var vc = textGeo.vertices[face.c];

  //       var s = THREE.GeometryUtils.triangleArea(va, vb, vc);

  //       if (s > triangleAreaHeuristics) {

  //         for (var j = 0; j < face.vertexNormals.length; j++) {

  //           face.vertexNormals[j].copy(face.normal);

  //         }

  //       }

  //     }

  //   }

  // }

  textMesh1 = new THREE.Mesh(textGeo,
    new THREE.MeshBasicMaterial({
      color: 0xffffff
    })
    //new THREE.MeshNormalMaterial
  );
  textMesh1.name = tag;

  return textMesh1;

}