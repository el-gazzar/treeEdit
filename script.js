var myEditor = {};

myEditor.field = new SquidexFormField();

myEditor.defaultData = {
    "id": 1,
    "text": "New Node"
};

// update tree value
myEditor.field.onValueChanged(function (value) {
    if (value) {
        var jstree = myEditor.apiObjToTreeObj(value, []);
        myEditor.createJstree(jstree);
    } else {
        $("#createTree").show();
        $("#createTree").click(function () {
            myEditor.createJstree(myEditor.defaultData);

            // edit root node after tree created
            $('#jstree').on('ready.jstree', function () {
                var rootNode = $('#jstree').jstree(true).get_node('1', true);
                $('#jstree').jstree(true).edit(rootNode);
            });
        });
    }
});

// update field value
myEditor.updateFieldValue = function (e, data) {
    var jstreeJson = $("#jstree").jstree(true).get_json('#');;
    if (jstreeJson && jstreeJson !== myEditor.defaultData) {
        var json = myEditor.treeObjToApiObj(jstreeJson, {});
        myEditor.field.valueChanged(json);
    }
}

myEditor.createJstree = function (data) {
    $("#createTree").hide();
    $('#jstree').jstree({
        "core": {
            "animation": 200,
            "check_callback": true,
            'data': data
        },
        "plugins": [
            "contextmenu", "wholerow", "state"
        ]
    });

    $("#jstree").show();
    $('#jstree').on("set_text.jstree", myEditor.updateFieldValue);
    $('#jstree').on("changed.jstree", myEditor.updateFieldValue);
}

myEditor.treeObjToApiObj = function (treeObj, apiObj) {
    for (const key in treeObj) {
        var isValueString = typeof treeObj[key.toString()] === 'string';

        var jstreeNode = {
            Text: treeObj[key.toString()]
        };

        if (!isValueString) {
            jstreeNode.Children = [];
        }

        apiObj.push(jstreeNode);

        if (!isValueString) {
            myEditor.treeObjToApiObj(treeObj[key.toString()], apiObj[apiObj.length - 1].children);
        }
    }
    return apiObj;
}

myEditor.apiObjToTreeObj = function (apiObj, treeObj) {
    for (const key in apiObj) {
        var isValueString = typeof apiObj[key.toString()] === 'string';

        var jstreeNode = {
            text: apiObj[key.toString()]
        };

        if (!isValueString) {
            jstreeNode.children = [];
        }

        treeObj.push(jstreeNode);

        if (!isValueString) {
            myEditor.apiObjToTreeObj(apiObj[key.toString()], treeObj[treeObj.length - 1].children);
        }
    }

    return treeObj;
}