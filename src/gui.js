document.write("<script language=javascript src='babylonJS/gui/babylon.gui.js'></script>");
document.write("<script language=javascript src='babylonJS/gui/babylon.gui.min.js'></script>");

var advancedTexture = null;
var panelRect = null;
var inputinfo = null;
var formulecb = null;
var formuleRect = null;
var idLabel = null;
var inputRect = null;
var outputRect = null;
var ainput = null;
var binput = null;
var cinput = null;
var linkidText = null;
var inputcb = null;

function GenerateGUI()
{
	if(advancedTexture == null)
		advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
	
	var input = new BABYLON.GUI.InputText();
    input.width = 0.2;
    input.maxWidth = 0.2;
	input.width = "150px";
    input.height = "25px";
    input.text = "Input obj Path";
    input.color = "white";
    input.background = "green";
	input.left = "10px";
	input.top = "10px";
	input.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
	input.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    advancedTexture.addControl(input); 
	
	var importbutton = BABYLON.GUI.Button.CreateSimpleButton("importbutton", "import");
	importbutton.width = "80px";
	importbutton.height = "25px";
	importbutton.color = "white";
	importbutton.cornerRadius = 20;
	importbutton.background = "green";
	importbutton.left = "170px";
	importbutton.top = "10px";
	importbutton.onPointerUpObservable.add(function() {
		onLoadObj(input.text);
	});
	importbutton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
	importbutton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
	advancedTexture.addControl(importbutton);

	createEditPanel();
}

function createEditPanel()
{
	if(advancedTexture == null)
		advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

	panelRect = new BABYLON.GUI.Rectangle();
	panelRect.clipChildren = true;
	panelRect.width = "300px";
	panelRect.height = "500px";
	panelRect.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
	panelRect.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
	panelRect.right = "10px";
	panelRect.top = "10px";
	panelRect.cornerRadius = 20;
	panelRect.background = "#363636";

	var label = new BABYLON.GUI.TextBlock();
	label.text = "点位信息";
	label.color = "white";
	label.fontSize = 20;
	label.left = "-90px";
	label.top = "-220px";
	panelRect.addControl(label);

	idLabel = new BABYLON.GUI.TextBlock();
	idLabel.text = "ID: ";
	idLabel.color = "white";
	idLabel.fontSize = 15;
	idLabel.left = "10px";
	idLabel.top = "-180px";
	idLabel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
	panelRect.addControl(idLabel);

	var closebutton = BABYLON.GUI.Button.CreateImageOnlyButton("closebutton","resources/close.png");
	closebutton.widthInPixels = 20;
	closebutton.heightInPixels = 20;
	closebutton.left = "120px";
	closebutton.top = "-220px";
	closebutton.thickness = 0;
	panelRect.addControl(closebutton);
	closebutton.onPointerUpObservable.add(function() {
		panelRect.isVisible = false;
	});

	inputinfo = new BABYLON.GUI.InputText();
	inputinfo.width = "250px";
	inputinfo.height = "25px";
	inputinfo.color = "white";
	inputinfo.background = "#363636";
    inputinfo.left = "10px";
    inputinfo.top = "-140px";
	inputinfo.onTextChangedObservable.add((input) => {
		var pointid = idLabel.text.replace("ID: ","");
		onChangeInfo(pointid,inputinfo.text);
	});
	panelRect.addControl(inputinfo);

    formulecb = new BABYLON.GUI.Checkbox();
    formulecb.width = "20px";
    formulecb.height = "20px";
    formulecb.left = "30px";
    formulecb.top = "-100px";
    formulecb.marginLeft = "5px";
    formulecb.isChecked = false;
    formulecb.color = "green";
    formulecb.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    formulecb.onIsCheckedChangedObservable.add(function(value) {
		if(value)	formuleRect.isVisible = true;
		else formuleRect.isVisible = false;

		var pointid = idLabel.text.replace("ID: ","");
		var result = onGetDataByID(pointid);
		if(value) result.enableformule = 1;
		else result.enableformule = 0;
    });
    panelRect.addControl(formulecb);

	var formuletext = new BABYLON.GUI.TextBlock();
	formuletext.text = "公式";
	formuletext.width = "80px";
	formuletext.marginLeft = "5px";
	formuletext.left = "50px";
	formuletext.top = "-100px";
	formuletext.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
	formuletext.color = "white";
	panelRect.addControl(formuletext);

	inputcb = new BABYLON.GUI.Checkbox();
	inputcb.width = "20px";
	inputcb.height = "20px";
	inputcb.left = "150px";
	inputcb.top = "-100px";
	inputcb.marginLeft = "5px";
	inputcb.isChecked = false;
	inputcb.color = "green";
	inputcb.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
	inputcb.onIsCheckedChangedObservable.add(function(value) {

		var pointid = idLabel.text.replace("ID: ","");
		var result = onGetDataByID(pointid);
		if(value)
		{
			result.isin = false;
			inputRect.isVisible = false;
			outputRect.isVisible = true;
			linkidText.text = result.linkid.toString();
			var linkresult = onGetDataByID(result.linkid);
			if(linkresult)
			{
				var value = parseFloat(linkresult.valueb) + parseFloat(linkresult.valuec);
				ainput.text = value.toString();

				if(value > 20)
				{
					var tempMesh = scene.getMeshByName(result.pid.toString());
					tempMesh.material.diffuseColor = BABYLON.Color3.Red();
					ainput.color = "red";
				}
				else ainput.color = "white";
			}
			else ainput.text = "";
		}
		else
		{
			result.isin = true;
			inputRect.isVisible = true;
			outputRect.isVisible = false;
			binput.text = result.valueb;
			cinput.text = result.valuec;
		}
	});
	panelRect.addControl(inputcb);

	var inputtext = new BABYLON.GUI.TextBlock();
	inputtext.text = "输出";
	inputtext.width = "80px";
	inputtext.marginLeft = "5px";
	inputtext.left = "180px";
	inputtext.top = "-100px";
	inputtext.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
	inputtext.color = "white";
	panelRect.addControl(inputtext);


    formuleRect = new BABYLON.GUI.Rectangle();
    formuleRect.clipChildren = true;
    formuleRect.width = "250px";
    formuleRect.height = "280px";
    formuleRect.left = "15px";
    formuleRect.top = "180px";
    formuleRect.cornerRadius = 20;
    formuleRect.background = "#363636";
    formuleRect.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    panelRect.addControl(formuleRect);

    var formule = new BABYLON.GUI.TextBlock();
    formule.text = "A = B + C";
    formule.width = "100px";
    formule.left = "10px";
    formule.top = "-110px";
    formule.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    formule.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    formule.color = "white";
    formuleRect.addControl(formule);

	inputRect = new BABYLON.GUI.Rectangle();
	inputRect.clipChildren = true;
	inputRect.width = "200px";
	inputRect.height = "100px";
	inputRect.top = "50px";
	inputRect.cornerRadius = 20;
	inputRect.background = "#363636";
	inputRect.thickness = 0;
	inputRect.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
	formuleRect.addControl(inputRect);

	var inputText = new BABYLON.GUI.TextBlock();
	inputText.text = "输入：";
	inputText.width = "100px";
	inputText.left = "0px";
	inputText.top = "-30px";
	inputText.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
	inputText.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
	inputText.color = "white";
	inputRect.addControl(inputText);

	var btext = new BABYLON.GUI.TextBlock();
	btext.text = "B = ";
	btext.width = "50px";
	btext.left = "10px";
	btext.top = "0px";
	btext.color = "white";
	btext.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
	btext.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
	inputRect.addControl(btext);

	binput = new BABYLON.GUI.InputText();
	binput.width = "100px";
	binput.height = "25px";
	binput.color = "white";
	binput.background = "#363636";
	binput.left = "60px";
	binput.top = "35px";
	binput.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
	binput.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
	binput.onTextChangedObservable.add((input) => {
		var value = parseFloat(binput.text);
		if(isNaN(value) == false)
		{
			var pointid = idLabel.text.replace("ID: ","");
			onChangeBValue(parseInt(pointid),binput.text);
		}
	});
	inputRect.addControl(binput);

	var ctext = new BABYLON.GUI.TextBlock();
	ctext.text = "C = ";
	ctext.width = "50px";
	ctext.left = "10px";
	ctext.top = "30px";
	ctext.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
	ctext.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
	ctext.color = "white";
	inputRect.addControl(ctext);

	cinput = new BABYLON.GUI.InputText();
	cinput.width = "100px";
	cinput.height = "25px";
	cinput.color = "white";
	cinput.background = "#363636";
	cinput.left = "60px";
	cinput.top = "65px";
	cinput.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
	cinput.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
	cinput.onTextChangedObservable.add((input) => {
		var value = parseFloat(cinput.text);
		if(isNaN(value) == false)
		{
			var pointid = idLabel.text.replace("ID: ","");
			onChangeCValue(pointid,cinput.text);
		}
	});
	inputRect.addControl(cinput);

	outputRect = new BABYLON.GUI.Rectangle();
	outputRect.clipChildren = true;
	outputRect.width = "200px";
	outputRect.height = "100px";
	outputRect.top = "160px";
	outputRect.cornerRadius = 20;
	outputRect.background = "#363636";
	outputRect.thickness = 0;
	outputRect.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
	formuleRect.addControl(outputRect);

	var outText = new BABYLON.GUI.TextBlock();
	outText.text = "输出：";
	outText.width = "100px";
	outText.left = "0px";
	outText.top = "-30px";
	outText.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
	outText.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
	outText.color = "white";
	outputRect.addControl(outText);

	var linkText = new BABYLON.GUI.TextBlock();
	linkText.text = "LinkID：";
	linkText.width = "100px";
	linkText.left = "0px";
	linkText.top = "0px";
	linkText.color = "white";
	linkText.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
	linkText.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
	outputRect.addControl(linkText);

	linkidText = new BABYLON.GUI.InputText();
	linkidText.width = "100px";
	linkidText.height = "25px";
	linkidText.color = "white";
	linkidText.background = "#363636";
	linkidText.left = "80px";
	linkidText.top = "35px";
	linkidText.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
	linkidText.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
	linkidText.onTextChangedObservable.add((input) => {
		var t = 1;
		var pointid= parseInt(linkidText.text);
		if(isNaN(pointid) == false)
		{
			var result = onGetDataByID(pointid);
			if(result)
			{
				if(result.isin)
				{
					var value = parseFloat(result.valueb) + parseFloat(result.valuec);
					ainput.text = value.toString();
					if(value > 20)
					{
						var tempMesh = scene.getMeshByName(result.pid.toString());
						tempMesh.material.diffuseColor = BABYLON.Color3.Red();
						ainput.color = "red";
					}
					else ainput.color = "white";

					var pointid2 = idLabel.text.replace("ID: ","");
					var result2 = onGetDataByID(pointid2);
					if(value) result2.linkid = pointid;

				}else t = 0;
			}else t = 0;
		}
		else t = 0;

		if(t == 0)
		{
			ainput.text= "";
		}

	});
	outputRect.addControl(linkidText);

	var atext = new BABYLON.GUI.TextBlock();
	atext.text = "A = ";
	atext.width = "50px";
	atext.left = "10px";
	atext.top = "30px";
	atext.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
	atext.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
	atext.color = "white";
	outputRect.addControl(atext);

	ainput = new BABYLON.GUI.TextBlock();
	ainput.width = "100px";
	ainput.height = "25px";
	ainput.color = "white";
	ainput.background = "#363636";
	ainput.left = "80px";
	ainput.top = "70px";
	ainput.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
	ainput.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
	outputRect.addControl(ainput);

	panelRect.isVisible = false;
	advancedTexture.addControl(panelRect);
}

function showObjectData(pointid)
{
	var result = onGetDataByID(pointid);
	idLabel.text = "ID: " + result.pid.toString();
	inputinfo.text = result.info;
	if(result.enableformule)
	{
		formulecb.isChecked = true;
		formuleRect.isVisible = true;
	}
	else
	{
		formulecb.isChecked = false;
		formuleRect.isVisible = false;
	}

	var isInput = result.isin;
	if(isInput)
	{
		inputcb.isChecked = false;
		inputRect.isVisible = true;
		outputRect.isVisible = false;
		binput.text = result.valueb.toString();
		cinput.text = result.valuec.toString();
	}
	else
	{
		inputcb.isChecked = true;
		outputRect.isVisible = true;
		inputRect.isVisible = false;
		var linkid = result.linkid.toString();
		linkidText.text = linkid.toString();

		var inputResult = onGetDataByID(linkid);
		var value = parseFloat(inputResult.valueb) + parseFloat(inputResult.valuec);
		ainput.text = value.toString();

		if(value > 20)
		{
			var tempMesh = scene.getMeshByName(result.pid.toString());
			tempMesh.material.diffuseColor = BABYLON.Color3.Red();
			ainput.color = "red";
		}
		else ainput.color = "white";
		if (value > 20)
		{
			var tempMesh = scene.getMeshByName(result.pid);
			tempMesh.material.diffuseColor = BABYLON.Color3.Red();
			tempMesh.alpha = 0.3;
		}
	}

	panelRect.isVisible = true;
}
