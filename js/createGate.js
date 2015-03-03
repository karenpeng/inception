module.exports = function () {
		// var plane1 = new THREE.PlaneBufferGeometry(60, 20, 6, 2);
		//var center = new THREE.SphereGeometry(2, 2, 2);

		var plane1 = new THREE.PlaneGeometry(60, 20, 3, 1);
		plane1.applyMatrix(new THREE.Matrix4().makeTranslation(0, -20, 0));
		// var material = new THREE.MeshDepthMaterial();
		var material = new THREE.MeshNormalMaterial();
		material.side = THREE.DoubleSide;

		var plane2 = plane1.clone();
		plane2.applyMatrix(new THREE.Matrix4().makeTranslation(0, 40, 0));

		var plane3 = plane1.clone();
		plane3.applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI / 2));

		var plane4 = plane3.clone();
		plane4.applyMatrix(new THREE.Matrix4().makeTranslation(-40, 0, 0));

		planeParent = new THREE.Geometry();

		//planeParent.merge(center);
		planeParent.merge(plane1);
		planeParent.merge(plane2);
		planeParent.merge(plane3);
		planeParent.merge(plane4);

		planePP = new THREE.Mesh(planeParent, material);
		return planePP;
}