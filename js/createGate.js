module.exports = function () {
		// var plane1 = new THREE.PlaneBufferGeometry(60, 20, 6, 2);
		var plane1 = new THREE.PlaneGeometry(60, 20, 3, 1);
		plane1.applyMatrix(new THREE.Matrix4().makeTranslation(0, -10, 0));
		// var material = new THREE.MeshDepthMaterial();
		var material = new THREE.MeshNormalMaterial();
		material.side = THREE.DoubleSide;
		//var plane1 = new THREE.Mesh(geo, material);
		//plane1.doubleSided = true;
		var plane2 = plane1.clone();
		plane2.applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI / 2));
		//plane2.rotation.z = Math.PI / 2;
		plane2.applyMatrix(new THREE.Matrix4().makeTranslation(10, 10, 0));
		// plane2.position.x += 20;
		// plane2.position.y += 20;
		var plane3 = plane2.clone();
		plane3.applyMatrix(new THREE.Matrix4().makeTranslation(-40, 0, 0));
		//plane3.position.x -= 40;
		var plane4 = plane1.clone();
		plane4.applyMatrix(new THREE.Matrix4().makeTranslation(0, 40, 0));
		//plane4.position.y += 40;
		//var plane2 = new
		//plane.lookAt(splineCamera.position);
		planeParent = new THREE.Geometry();
		// new THREE.GeometryUtils.merge(planeParent, plane1);
		// new THREE.GeometryUtils.merge(planeParent, plane2);
		// new THREE.GeometryUtils.merge(planeParent, plane3);
		// new THREE.GeometryUtils.merge(planeParent, plane4);
		planeParent.merge(plane1);
		planeParent.merge(plane2);
		planeParent.merge(plane3);
		planeParent.merge(plane4);

		planePP = new THREE.Mesh(planeParent, material);
		//planePP.doubleSided = true;
		//scene.add(planePP);
		return planePP;
		// scene.add(plane1);
		// scene.add(plane2);
		// scene.add(plane3);
		// scene.add(plane4);
}