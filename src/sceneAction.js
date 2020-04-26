
var areaBoxCount = 0;

var createBoxState = -1;
var createSphereState = -1;
var createCylinderState = -1;
var boxElementindex = 0;
var sphereElementindex = 0;
var cylinderElementindex = 0;

/*function InitProductAction(scene11,mesh) {
	mesh.actionManager = new BABYLON.ActionManager(scene11);
	mesh.actionManager.registerAction(
		new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnDoublePickTrigger, function () {
			var areaBox = BABYLON.MeshBuilder.CreateSphere("actionArea" + areaBoxCount, {diameter:0.5}, scene11);
			var boxIndex = areaBoxCount;
			areaBoxCount++;
			console.log(boxIndex);
			var boxMat = new BABYLON.StandardMaterial("sphereMat", scene11);
			//boxMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
			//boxMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
			boxMat.emissiveColor = BABYLON.Color3.Blue();
			boxMat.alpha = 0.3;
			areaBox.material = boxMat;
			areaBox.parent = mesh;
			var pickinfo = scene11.pick(scene11.pointerX, scene11.pointerY);
			var temppos = new BABYLON.Vector3(pickinfo.pickedPoint.x - mesh.position.x,pickinfo.pickedPoint.y - mesh.position.y,pickinfo.pickedPoint.z - mesh.position.z);
			areaBox.position = temppos;
			console.log(pickinfo.pickedPoint.x + "  " + pickinfo.pickedPoint.y + "  " + pickinfo.pickedPoint.z );
            console.log(mesh.rotation.x + "  " + mesh.rotation.y + "  " + mesh.rotation.z );

			areaBox.actionManager = new BABYLON.ActionManager(scene11);
			areaBox.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function () {
				///console.log(boxIndex);  显示
			}));
			areaBox.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, boxMat,'alpha',0.3));
			areaBox.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, boxMat,'alpha',0.001));
		})
	);
}*/

function createAreaBox(pointid, scene11,mesh,position) {
	console.log(pointid);
	var areaBox = BABYLON.MeshBuilder.CreateSphere(pointid.toString(), {diameter:0.2}, scene11);
	var boxIndex = areaBoxCount;
	areaBoxCount++;
	var boxMat = new BABYLON.StandardMaterial("sphereMat", scene11);
	boxMat.diffuseColor = BABYLON.Color3.Blue(); //new BABYLON.Color3(0.4, 0.4, 0.4);
	boxMat.specularColor = BABYLON.Color3.Black();
	boxMat.specularPower = 1;
	//boxMat.emissiveColor = BABYLON.Color3.Blue();
	boxMat.alpha = 0.3;
	areaBox.material = boxMat;
	//areaBox.position = position;
	//areaBox.parent = mesh;
	areaBox.setParent(mesh);
	areaBox.setPositionWithLocalVector(position);
	console.log(position.x +'  ' + position.y + '  ' + position.z);

	areaBox.actionManager = new BABYLON.ActionManager(scene11);
	areaBox.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function () {
		showObjectData(pointid);
	}));
	areaBox.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, boxMat,'alpha',0.3));
	areaBox.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, boxMat,'alpha',0.05));

}

function InitSceneAction(scene11) {

	scene11.onPointerObservable.add((pointerInfo) => {
		switch (pointerInfo.type) {
			case BABYLON.PointerEventTypes.POINTERDOUBLETAP:
			{
				var pickinfo = scene11.pick(scene11.pointerX, scene11.pointerY);

				if (!pickinfo.hit)
					break;

				var temppos = new BABYLON.Vector3(pickinfo.pickedPoint.x - pickinfo.pickedMesh.position.x,pickinfo.pickedPoint.y - pickinfo.pickedMesh.position.y,pickinfo.pickedPoint.z - pickinfo.pickedMesh.position.z)
				var pointid = Math.ceil(Math.random()*999999999);
				createAreaBox(pointid,scene11,pickinfo.pickedMesh,temppos);
				onAddPoint(pickinfo.pickedMesh.name,pointid,temppos);
				break;
			}

		}
	});

}

function InitManipulatAction(scene11) {

	// Initialize GizmoManager
	var gizmoManager = new BABYLON.GizmoManager(scene11);

	// Initialize all gizmos
	gizmoManager.boundingBoxGizmoEnabled=true;
	gizmoManager.positionGizmoEnabled = true;
	gizmoManager.rotationGizmoEnabled = true;
	gizmoManager.scaleGizmoEnabled = true;

	// Modify gizmos based on keypress
	document.onkeydown = (e)=> {

		if (createBoxState == -1 && createSphereState == -1 && createCylinderState == -1)
		{
			console.log('create element');
			if (e.key == 'b') {
				createBoxState = 0;
			}
			else if (e.key == 'n')
			{
				createSphereState = 0;
			}
			else if (e.key == 'm')
			{
				createCylinderState = 0;
			}
		}

		if (e.key == 'w' || e.key == 'e' || e.key == 'r' || e.key == 'q') {
			// Switch gizmo type
			gizmoManager.positionGizmoEnabled = false;
			gizmoManager.rotationGizmoEnabled = false;
			gizmoManager.scaleGizmoEnabled = false;
			gizmoManager.boundingBoxGizmoEnabled = false;
			if (e.key == 'w') {
				gizmoManager.positionGizmoEnabled = true;
			}
			if (e.key == 'e') {
				gizmoManager.rotationGizmoEnabled = true;
			}
			if (e.key == 'r') {
				gizmoManager.scaleGizmoEnabled = true;
			}
			if (e.key == 'q') {
				gizmoManager.boundingBoxGizmoEnabled = true;
			}
		}
		if (e.key == 'y') {
			// hide the gizmo
			gizmoManager.positionGizmoEnabled = false;
			gizmoManager.rotationGizmoEnabled = false;
			gizmoManager.scaleGizmoEnabled = false;
			gizmoManager.boundingBoxGizmoEnabled = false;
			gizmoManager.attachToMesh(null);
		}
	}

	// Start by only enabling position control
	document.onkeydown({key: "y"})
}