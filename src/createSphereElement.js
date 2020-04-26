
var  shpereLines = [];

function  initCreateSphereElement(scene) {
	///  记录绘制盒子
	var tempSphereParent = new BABYLON.AbstractMesh();
	/// tempParent.addChild();
	tempSphereParent.visibility = false;
	var sphereCenter = BABYLON.Vector3.Zero();
	var sphereSecondPoint = BABYLON.Vector3.Zero();
	var tempCirclePoints = [
	];
	for (let i=0;i<=36;i++)
		tempCirclePoints.push(BABYLON.Vector3.Zero());

	var tempRadiuLine = [
		BABYLON.Vector3.Zero(),
		BABYLON.Vector3.Zero()
	];

	var sphereLineColor = new BABYLON.Color4(1,0,0,0.8);
	var colorSphere = [];
	for (i=0;i<=36;i++)  colorSphere.push(sphereLineColor);
	shpereLines.push(BABYLON.MeshBuilder.CreateLines("xAxisSphere",{points:tempCirclePoints,updatable:true,colors:colorSphere},scene));
	sphereLineColor.set(0,1,0,0.8);
	for (i=0;i<=36;i++)  colorSphere.push(sphereLineColor);
	shpereLines.push(BABYLON.MeshBuilder.CreateLines("yAxisSphere",{points:tempCirclePoints,updatable:true,colors:colorSphere},scene));
	sphereLineColor.set(0,0,1,0.8);
	for (i=0;i<=36;i++)  colorSphere.push(sphereLineColor);
	shpereLines.push(BABYLON.MeshBuilder.CreateLines("zAxisSphere",{points:tempCirclePoints,updatable:true,colors:colorSphere},scene));
	sphereLineColor.set(1,0,1,0.8);
	var sphereTwoColor = [sphereLineColor,sphereLineColor];
	shpereLines.push(BABYLON.MeshBuilder.CreateLines("radiuLine",{points:tempRadiuLine,updatable:true,colors:sphereTwoColor},scene));
	shpereLines.forEach(function (l) {
		l.isPickable = false;
		tempSphereParent.addChild(l);
	});

	function setLineSphereVisible(value)
	{
		shpereLines.forEach(function (l) {
			l.visibility = value;
		})
	}
	setLineSphereVisible(0);

	scene.onPointerObservable.add((pointerInfo) => {
		switch (pointerInfo.type) {
			case BABYLON.PointerEventTypes.POINTERMOVE:
			{
				if (createSphereState == 1)
				{
					var resultPosition = getHeightPoint(scene,sphereCenter,BABYLON.Vector3.Right());
					updateSphereLines(sphereCenter,resultPosition);
				}

				break;
			}
			case BABYLON.PointerEventTypes.POINTERUP:
			{
				if (createSphereState == 0)
				{
					var resultPosition = getMousePos(scene,0);
					if (resultPosition == null)
						break;

					tempSphereParent.visibility = true;
					setLineSphereVisible(1);
					sphereCenter = resultPosition;
					updateSphereLines(sphereCenter,sphereCenter);
					createSphereState = 1;
				}
				else if (tempSphereParent.isVisible)
				{
					if (createSphereState == 1)
					{
						var resultPosition = getHeightPoint(scene,sphereCenter,BABYLON.Vector3.Right());
						updateSphereLines(sphereCenter,resultPosition);
						var radiusValue = resultPosition.subtract(sphereCenter).length();
						var sphereElement = BABYLON.MeshBuilder.CreateSphere('sphereElement' + sphereElementindex,{segments:16,diameter:radiusValue*2},scene);
						sphereElement.position = sphereCenter;
						var sphereMat = new BABYLON.StandardMaterial("sphereElementMat", scene);
						sphereMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
						sphereMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
						sphereMat.emissiveColor = BABYLON.Color3.Purple();
						sphereElement.material = sphereMat;
						sphereElementindex++;

						tempSphereParent.visibility = false;
						setLineSphereVisible(0);
						createSphereState = -1;
					}
				}
			}

		}
	});
}

function updateSphereLines(firstPoint,secondPoint) {
	var radius = firstPoint.subtract(secondPoint).length();
	var circlePoints = [];
	for (let i=0;i<=36;i++)
	{
		circlePoints.push(firstPoint.add(new BABYLON.Vector3(0,Math.sin(i/18*Math.PI),Math.cos(i/18*Math.PI)).scale(radius)));
	}

	BABYLON.MeshBuilder.CreateLines("xAxisSphere",{points:circlePoints,instance:shpereLines[0]});

	for (let i=0;i<=36;i++)
	{
		circlePoints[i] = firstPoint.add(new BABYLON.Vector3(Math.sin(i/18*Math.PI),0,Math.cos(i/18*Math.PI)).scale(radius));
	}

	BABYLON.MeshBuilder.CreateLines("yAxisSphere",{points:circlePoints,instance:shpereLines[1]});

	for (let i=0;i<=36;i++)
		circlePoints[i] = firstPoint.add(new BABYLON.Vector3(Math.sin(i/18*Math.PI),Math.cos(i/18*Math.PI),0).scale(radius));

	BABYLON.MeshBuilder.CreateLines("zAxisSphere",{points:circlePoints,instance:shpereLines[2]});

	var radiuLine = [
		firstPoint,
		secondPoint
	];
	BABYLON.MeshBuilder.CreateLines("radiuLine",{points:radiuLine,instance:shpereLines[3]});

}

