module.exports = function () {
		var plane1 = new THREE.PlaneBufferGeometry(30, 10, 3, 1);
		//var center = new THREE.SphereGeometry(2, 2, 2);

		//var plane1 = new THREE.PlaneGeometry(30, 10, 3, 1);
		plane1.applyMatrix(new THREE.Matrix4().makeTranslation(0, -10, 0));
		// var material = new THREE.MeshDepthMaterial();
		var material = new THREE.MeshNormalMaterial();
		material.side = THREE.DoubleSide;

		var plane2 = plane1.clone();
		plane2.applyMatrix(new THREE.Matrix4().makeTranslation(0, 20, 0));

		var plane3 = plane1.clone();
		plane3.applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI / 2));

		var plane4 = plane3.clone();
		plane4.applyMatrix(new THREE.Matrix4().makeTranslation(-20, 0, 0));

		// var planeParent = new THREE.Geometry();

		// //planeParent.merge(center);
		// planeParent.merge(plane1);
		// planeParent.merge(plane2);
		// planeParent.merge(plane3);
		// planeParent.merge(plane4);

		// var planePP = new THREE.Mesh(planeParent, material);
		// return planePP;
		var plane1Mesh = new THREE.Mesh(plane1, material);
		var plane2Mesh = new THREE.Mesh(plane2, material);
		var plane3Mesh = new THREE.Mesh(plane3, material);
		var plane4Mesh = new THREE.Mesh(plane4, material);
		var planeParent = new THREE.Object3D();
		planeParent.add(plane1Mesh);
		planeParent.add(plane2Mesh);
		planeParent.add(plane3Mesh);
		planeParent.add(plane4Mesh);

		return planeParent;

}