
var  cylinderLines = [];

function  initCreateCylinderElement(scene) {
	///  记录绘制盒子
	var tempCylinderParent = new BABYLON.AbstractMesh();
	tempCylinderParent.visibility = false;
	var bottomCenter = BABYLON.Vector3.Zero();
	var bottomSecondPoint = BABYLON.Vector3.Zero();
	var tempCylinderSpherePoints = [
	];
	for (let i=0;i<=36;i++)
		tempCylinderSpherePoints.push(BABYLON.Vector3.Zero());

	var tempSideLine = [
		BABYLON.Vector3.Zero(),
		BABYLON.Vector3.Zero()
	];

	var cylinderLineColor = new BABYLON.Color4(0,1,0,0.8);
	var colorCylinder = [];
	for (i=0;i<=36;i++)  colorCylinder.push(cylinderLineColor);
	var twoCylinderColor = [cylinderLineColor,cylinderLineColor];

	cylinderLines.push(BABYLON.MeshBuilder.CreateLines("bottomSphere",{points:tempCylinderSpherePoints,updatable:true,colors:colorCylinder},scene));
	cylinderLines.push(BABYLON.MeshBuilder.CreateLines("topSphere",{points:tempCylinderSpherePoints,updatable:true,colors:colorCylinder},scene));
	cylinderLines.push(BABYLON.MeshBuilder.CreateLines("cylinderLine1",{points:tempSideLine,updatable:true,colors:twoCylinderColor},scene));
	cylinderLines.push(BABYLON.MeshBuilder.CreateLines("cylinderLine2",{points:tempSideLine,updatable:true,colors:twoCylinderColor},scene));
	cylinderLines.push(BABYLON.MeshBuilder.CreateLines("cylinderLine3",{points:tempSideLine,updatable:true,colors:twoCylinderColor},scene));
	cylinderLines.push(BABYLON.MeshBuilder.CreateLines("cylinderLine4",{points:tempSideLine,updatable:true,colors:twoCylinderColor},scene));
	cylinderLines.forEach(function (l) {
		l.isPickable = false;
		tempCylinderParent.addChild(l);
	});

	function setLineCylinderVisible(value)
	{
		cylinderLines.forEach(function (l) {
			l.visibility = value;
		})
	}
	setLineCylinderVisible(0);

	scene.onPointerObservable.add((pointerInfo) => {
		switch (pointerInfo.type) {
			case BABYLON.PointerEventTypes.POINTERMOVE:
			{
				if (createCylinderState == 1)
				{
					var resultPosition = getHeightPoint(scene,bottomCenter,BABYLON.Vector3.Right());
					updateCylinderLines(bottomCenter,resultPosition,0);
				}
				else if (createCylinderState == 2)
				{
					var resultPosition = getHeightPoint(scene,bottomSecondPoint,BABYLON.Vector3.Up());
					updateCylinderLines(bottomCenter,bottomSecondPoint,resultPosition.y - bottomSecondPoint.y);

				}

				break;
			}
			case BABYLON.PointerEventTypes.POINTERUP:
			{
				if (createCylinderState == 0)
				{
					var resultPosition = getMousePos(scene,0);
					if (resultPosition == null)
						break;

					tempCylinderParent.visibility = true;
					setLineCylinderVisible(1);
					bottomCenter = resultPosition;
					updateCylinderLines(bottomCenter,bottomCenter,0);
					createCylinderState = 1;
				}
				else if (tempCylinderParent.isVisible)
				{
					if (createCylinderState == 1)
					{
						var resultPosition = getHeightPoint(scene,bottomCenter,BABYLON.Vector3.Right());
						updateCylinderLines(bottomCenter,resultPosition,0);
						bottomSecondPoint = resultPosition;
						createCylinderState = 2;
					}
					else if(createCylinderState == 2)
					{
						var resultPosition = getHeightPoint(scene,bottomSecondPoint,BABYLON.Vector3.Up());
						updateCylinderLines(bottomCenter,bottomSecondPoint,resultPosition.y - bottomSecondPoint.y);
						var cylinderHeight = resultPosition.subtract(bottomSecondPoint).length();
						var bottomSphereRadius = bottomCenter.subtract(bottomSecondPoint).length();
						var cylinderElement = BABYLON.MeshBuilder.CreateCylinder('cylinderElement'+cylinderElementindex,{height:cylinderHeight,diameter:2*bottomSphereRadius,tessellation:24,subdivisions:1},scene);
						var cylinderMat = new BABYLON.StandardMaterial("cylinderElementMat", scene);
						cylinderMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
						cylinderMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
						cylinderMat.emissiveColor = BABYLON.Color3.Blue();
						cylinderElement.material = cylinderMat;
						cylinderElement.position = bottomCenter.add(BABYLON.Vector3.Up().scale(cylinderHeight/2));

						cylinderElementindex++;
						tempCylinderParent.visibility = false;
						setLineCylinderVisible(0);
						createCylinderState = -1;
					}
				}
			}

		}
	});
}

function updateCylinderLines(firstPoint,secondPoint,height) {
	var radius = firstPoint.subtract(secondPoint).length();
	var circlePoints = [];
	for (let i=0;i<=36;i++)
	{
		circlePoints.push(firstPoint.add(new BABYLON.Vector3(Math.sin(i/18*Math.PI),0,Math.cos(i/18*Math.PI)).scale(radius)));
	}

	if (height == 0)
	{
		BABYLON.MeshBuilder.CreateLines("bottomSphere",{points:circlePoints,instance:cylinderLines[0]});
		return;
	}

	var sideLine = [
	];
	sideLine.push(new BABYLON.Vector3(circlePoints[0].x,circlePoints[0].y,circlePoints[0].z));
	sideLine.push(new BABYLON.Vector3(circlePoints[0].x,circlePoints[0].y+height,circlePoints[0].z));
	BABYLON.MeshBuilder.CreateLines("cylinderLine1",{points:sideLine,instance:cylinderLines[2]});

	sideLine[0].set(circlePoints[9].x,circlePoints[9].y,circlePoints[9].z);
	sideLine[1].set(circlePoints[9].x,circlePoints[9].y+height,circlePoints[9].z);
	BABYLON.MeshBuilder.CreateLines("cylinderLine2",{points:sideLine,instance:cylinderLines[3]});

	sideLine[0].set(circlePoints[18].x,circlePoints[18].y,circlePoints[18].z);
	sideLine[1].set(circlePoints[18].x,circlePoints[18].y+height,circlePoints[18].z);
	BABYLON.MeshBuilder.CreateLines("cylinderLine3",{points:sideLine,instance:cylinderLines[4]});

	sideLine[0].set(circlePoints[27].x,circlePoints[27].y,circlePoints[27].z);
	sideLine[1].set(circlePoints[27].x,circlePoints[27].y+height,circlePoints[27].z);
	BABYLON.MeshBuilder.CreateLines("cylinderLine4",{points:sideLine,instance:cylinderLines[5]});

	for (let i=0;i<=36;i++)
	{
		circlePoints[i].y += height;
	}

	BABYLON.MeshBuilder.CreateLines("topSphere",{points:circlePoints,instance:cylinderLines[1]});
}

