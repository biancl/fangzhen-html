document.write("<script language=javascript src='babylonJS/loaders/babylonjs.loaders.min.js'></script>");
document.write("<script language=javascript src='jquery/jquery.js'></script>");

var datamap = new Map();

function loadData(fileName,name) {
    var xml;
    $.ajax({
        type: "GET",
        url: fileName,
        dataType: "xml",
        success: function(data, textStatus, jqXHR){//读取成功
            if (typeof data == "string") {
                xml = new ActiveXObject("Microsoft.XMLDOM");
                xml.async = false;
                xml.loadXML(data);
            } else {
                xml = data;
            }

            var pointArray = new Array();

            $(xml).find("point").each(function(){
                var objectData = {
                    pid : Number,
                    parent: String,
                    pos : BABYLON.Vector3.Zero(),
                    info : String,
                    enableformule : Number,
                    isin : Number,
                    valuea : Number,
                    valueb : Number,
                    valuec : Number,
                    linkid : Number,
                };
                objectData.pid = parseInt($(this).attr("id"));
                objectData.parent = $(this).attr("parent");
                objectData.pos.x = parseFloat($(this).find("posx").text());
                objectData.pos.y = parseFloat($(this).find("posy").text());
                objectData.pos.z = parseFloat($(this).find("posz").text());
                objectData.info = $(this).find("info").text();
                objectData.enableformule = parseInt($(this).find("formule").attr("enable"));
                objectData.isin = parseInt($(this).find("formule").attr("type"));
                if(objectData.isin)
                {
                    objectData.valueb = parseFloat($(this).find("formule").find("b").text());
                    objectData.valuec = parseFloat($(this).find("formule").find("c").text());
                }
                else objectData.linkid = parseInt($(this).find("formule").attr("link"));
                pointArray.push(objectData);
            })
            datamap.set(name,pointArray);
        },
        error: function(jqXHR, textStatus, errorThrown) {

        }
    });
    return true;
}

function onLoadObj(file)
{

	var index = file.lastIndexOf('/');
	var index2 = file.lastIndexOf('\\');
	if(index2 > index) index = index2;
	var path = file.substr(0,index+1);
	var name = file.substr(index + 1);
	var tempArray = new Array();
	var newMesh = BABYLON.SceneLoader.ImportMesh("","./model/", "E019BAN1.obj", scene,function (newMeshes,particleSystem,skeletons) {
        i = 0;
	    while (newMeshes[i])
        {
            console.log(newMeshes[i].name);
            tempArray.push(newMeshes[i]);
            i++;
        }
    });


    var r = loadData("./model/E019BAN1.xml","E019BAN1");
    var interval = setInterval(function()
    {
        if(r == true)
        {
            var pointsNum = getNumPoint("E019BAN1");
            for (i=0;i<pointsNum;i++)
            {
                var tempPos = getPointPos("E019BAN1",i);
                var tempMeshName = "E019BAN1";

                for (j=0;j<tempArray.length;j++)
                {
                    if (tempMeshName == tempArray[j].name)
                    {
                        var pointarray = datamap.get("E019BAN1");
                        var pointid = pointarray[i].pid;
                        createAreaBox(pointid, scene,tempArray[j],tempPos);
                        break;
                    }
                }
            }
            clearInterval(interval);
        }

    },1000)

}


function getNumPoint(name)
{
    var pointArray = datamap.get(name);
    return pointArray.length;
}

function getPointPos(name,index)
{
    return (datamap.get(name))[index].pos;
}

function getPointInfo(name,index)
{
    return (datamap.get(name))[index].info;
}

function onGetDataByID(pointid)
{
    var result;
    datamap.forEach(function(value,key)
    {
        result = value.find((item,index) => {
            return item.pid == pointid;
        })
    });
    return result;
}

function onChangeBValue(pointid,value)
{
    console.log(pointid);
    var result = onGetDataByID(pointid);
    result.valueb = value;
}

function onChangeCValue(pointid,value)
{
    var result = onGetDataByID(pointid);
    result.valuec = value;
}

function onChangeInfo(pointid,value)
{
    var result = onGetDataByID(pointid);
    result.info = value.toString();
}

function onAddPoint(name,pointid,pos)
{
    var pointArray = datamap.get(name);
    console.log(datamap);
    console.log(pointArray);
    var objectData = {
        pid : Number,
        parent: String,
        pos : BABYLON.Vector3.Zero(),
        info : String,
        enableformule : Number,
        isin : Number,
        valuea : Number,
        valueb : Number,
        valuec : Number,
        linkid : Number,
    };
    objectData.pid = pointid;
    objectData.parent = name;
    objectData.pos.x = pos.x;
    objectData.pos.y = pos.y;
    objectData.pos.z = pos.z;
    objectData.info = "";
    objectData.enableformule = 0;
    objectData.isin = 1;
    objectData.valuea = 0;
    objectData.valueb = 0;
    objectData.valuec = 0;
    objectData.linkid = 0;
    pointArray.push(objectData);
}


