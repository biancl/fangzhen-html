
var lines = [];

function  initCreateBoxElement(scene) {

	///  记录绘制盒子
	var tempParent = new BABYLON.AbstractMesh();
	/// tempParent.addChild();
	tempParent.visibility = false;
	var recordFirstPoint = BABYLON.Vector3.Zero();
	var recordSecondPoint = BABYLON.Vector3.Zero();
	var tempFourPoint = [
		recordFirstPoint,
		recordFirstPoint,
		recordFirstPoint,
		recordFirstPoint,
		recordFirstPoint
	];
	var tempTwoPoint = [
		recordFirstPoint,
		recordFirstPoint
	];

	var boxLineColor = new BABYLON.Color4(0,1,0,0.8);
	var colorFour = [];
	for (i=0;i<=4;i++)  colorFour.push(boxLineColor);
	var colorTwo = [];
	colorTwo.push(boxLineColor);
	colorTwo.push(boxLineColor);
	lines.push(BABYLON.MeshBuilder.CreateLines("bottomLine",{points:tempFourPoint,updatable:true,colors:colorFour},scene));
	lines.push(BABYLON.MeshBuilder.CreateLines("sideLine1",{points:tempTwoPoint,updatable:true,colors:colorTwo},scene));
	lines.push(BABYLON.MeshBuilder.CreateLines("sideLine2",{points:tempTwoPoint,updatable:true,colors:colorTwo},scene));
	lines.push(BABYLON.MeshBuilder.CreateLines("sideLine3",{points:tempTwoPoint,updatable:true,colors:colorTwo},scene));
	lines.push(BABYLON.MeshBuilder.CreateLines("sideLine4",{points:tempTwoPoint,updatable:true,colors:colorTwo},scene));
	lines.push(BABYLON.MeshBuilder.CreateLines("topLine",{points:tempFourPoint,updatable:true,colors:colorFour},scene));
	lines.forEach(function (l) {
		l.isPickable = false;
		tempParent.addChild(l);
	});

	function setLineBoxVisible(value)
	{
		lines.forEach(function (l) {
			l.visibility = value;
		})
	}

	setLineBoxVisible(0);

	scene.onPointerObservable.add((pointerInfo) => {
		switch (pointerInfo.type) {
			case BABYLON.PointerEventTypes.POINTERMOVE:
			{
				if (tempParent.isVisible)
				{
					if (createBoxState == 1)
					{
						var resultPosition = getMousePos(scene,0);
						updateBoxLine(recordFirstPoint,resultPosition);
					}

					if (createBoxState == 2)
					{
						var resultPosition = getHeightPoint(scene,recordSecondPoint,BABYLON.Vector3.Up());
						updateBoxLine(recordFirstPoint,resultPosition);
					}
				}

				break;
			}
			case BABYLON.PointerEventTypes.POINTERUP:
			{
				if (createBoxState == 0)
				{
					var resultPosition = getMousePos(scene,0);
					if (resultPosition == null)
						break;

					tempParent.visibility = true;
					setLineBoxVisible(1);
					recordFirstPoint = resultPosition;
					updateBoxLine(resultPosition,resultPosition);
					createBoxState = 1;
				}
				else if (tempParent.isVisible)
				{
					if (createBoxState == 1)
					{
						var resultPosition = getMousePos(scene,0);
						recordSecondPoint = resultPosition;
						updateBoxLine(recordFirstPoint,recordSecondPoint);
						createBoxState = 2;
					}
					else if (createBoxState == 2)
					{
						var resultPosition = getHeightPoint(scene,recordSecondPoint,BABYLON.Vector3.Up());
						updateBoxLine(recordFirstPoint,resultPosition);

						var heightValue = resultPosition.y - recordFirstPoint.y;
						var widthValue = resultPosition.x - recordFirstPoint.x;
						var depthValue = resultPosition.z - recordFirstPoint.z;
						var recordFlag = 1;
						recordFlag = heightValue < 0 ? -recordFlag : recordFlag;
						heightValue = heightValue < 0 ? -heightValue : heightValue;
						widthValue = widthValue < 0 ? -widthValue : widthValue;
						depthValue = depthValue < 0 ? -depthValue : depthValue;
						console.log(resultPosition.y + '  ' + recordFirstPoint.y );
						var boxElement = BABYLON.MeshBuilder.CreateBox('boxElement'+boxElementindex,{height:heightValue, width:widthValue , depth:depthValue},scene);
						var boxMat = new BABYLON.StandardMaterial("boxElementMat", scene);
						boxMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
						boxMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
						boxMat.emissiveColor = new BABYLON.Color3(0.8,0.8,0);
						boxElement.material = boxMat;
						boxElement.position = BABYLON.Vector3.Center(recordFirstPoint,resultPosition);
						boxElementindex++;

						tempParent.visibility = false;
						setLineBoxVisible(0);
						createBoxState = -1;
					}
				}
			}

		}
	});

}

function updateBoxLine(firstPoint,secondPoint) {
	var fourPoint = [
		new BABYLON.Vector3(firstPoint.x,firstPoint.y,firstPoint.z),
		new BABYLON.Vector3(firstPoint.x,firstPoint.y,secondPoint.z),
		new BABYLON.Vector3(secondPoint.x,firstPoint.y,secondPoint.z),
		new BABYLON.Vector3(secondPoint.x,firstPoint.y,firstPoint.z),
		new BABYLON.Vector3(firstPoint.x,firstPoint.y,firstPoint.z)
	];
	var twoPoint = [
		new BABYLON.Vector3(firstPoint.x,firstPoint.y,firstPoint.z),
		new BABYLON.Vector3(firstPoint.x,secondPoint.y,firstPoint.z)
	];
	var pointWithHight = twoPoint[1];
	BABYLON.MeshBuilder.CreateLines("bottomLine",{points:fourPoint,instance:lines[0]});
	BABYLON.MeshBuilder.CreateLines("sideLine1",{points:twoPoint,instance:lines[1]});
	twoPoint[0] = new BABYLON.Vector3(firstPoint.x,firstPoint.y,secondPoint.z);
	pointWithHight = fourPoint[1];
	pointWithHight.y = secondPoint.y;
	twoPoint[1] = pointWithHight;
	BABYLON.MeshBuilder.CreateLines("sideLine2",{points:twoPoint,instance:lines[2]});
	pointWithHight = fourPoint[2];
	twoPoint[0] = new BABYLON.Vector3(secondPoint.x,firstPoint.y,secondPoint.z);
	pointWithHight.y = secondPoint.y;
	twoPoint[1] = pointWithHight;
	BABYLON.MeshBuilder.CreateLines("sideLine3",{points:twoPoint,instance:lines[3]});
	pointWithHight = fourPoint[3];
	twoPoint[0] = new BABYLON.Vector3(secondPoint.x,firstPoint.y,firstPoint.z);
	pointWithHight.y = secondPoint.y;
	twoPoint[1] = pointWithHight;
	BABYLON.MeshBuilder.CreateLines("sideLine4",{points:twoPoint,instance:lines[4]});
	fourPoint[0].y = secondPoint.y;
	fourPoint[1].y = secondPoint.y;
	fourPoint[2].y = secondPoint.y;
	fourPoint[3].y = secondPoint.y;
	fourPoint[4].y = secondPoint.y;
	BABYLON.MeshBuilder.CreateLines("bottomLine",{points:fourPoint,instance:lines[5]});
}

function getMousePos(scene,height)
{
	//var pickinfo = scene.pick(scene.pointerX, scene.pointerY);

	//if (!pickinfo.hit)
	//    return null;

	var pickRay = scene.createPickingRay(scene.pointerX, scene.pointerY);
	var tempPlane = new BABYLON.Plane(0,1,0,height);
	var resultPosition = BABYLON.Vector3.Zero();
	resultPosition = pickRay.origin.add(pickRay.direction.scale(pickRay.intersectsPlane(tempPlane))) ;

	return resultPosition;
}

function getHeightPoint(scene,point,Vecdirection)
{
	var pickRay = scene.createPickingRay(scene.pointerX, scene.pointerY);
	var parameterValue = NaN;
	if (BABYLON.Vector3.Dot(Vecdirection,pickRay.direction) == 0)
	{
		parameterValue = BABYLON.Vector3.Dot(pickRay.origin.subtract(point),Vecdirection) / BABYLON.Vector3.Dot(Vecdirection,pickRay.direction);
	}
	else if (BABYLON.Vector3.Dot(Vecdirection,pickRay.direction)*BABYLON.Vector3.Dot(Vecdirection,pickRay.direction) == BABYLON.Vector3.Dot(Vecdirection,Vecdirection)*BABYLON.Vector3.Dot(pickRay.direction,pickRay.direction))
	{
		return parameterValue;
	}
	else
	{
		parameterValue = (BABYLON.Vector3.Dot(Vecdirection,pickRay.direction)*BABYLON.Vector3.Dot(pickRay.origin.subtract(point),pickRay.direction) - BABYLON.Vector3.Dot(pickRay.direction,pickRay.direction)*BABYLON.Vector3.Dot(pickRay.origin.subtract(point),Vecdirection)) / (BABYLON.Vector3.Dot(Vecdirection,pickRay.direction)*BABYLON.Vector3.Dot(Vecdirection,pickRay.direction) - BABYLON.Vector3.Dot(Vecdirection,Vecdirection)*BABYLON.Vector3.Dot(pickRay.direction,pickRay.direction));
	}

	return  point.add(Vecdirection.scale(parameterValue));
}
