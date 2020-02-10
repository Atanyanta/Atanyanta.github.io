var test, json, resultbox, keyid, paramlookup, keys, teststring, result;

function targetgen() {
    test = document.getElementById("target").value;
    json = JSON.parse(test);
    resultbox = document.getElementById("targetresults");
    keyid = document.getElementById("keyid").value;
    paramlookup = document.getElementById("paramlookup").value;

    if (!Array.isArray(json) && paramlookup == "") {
        resultbox.value = "Response is not a valid array of objects.";
        return 0;
    }

    resultbox.value = "";
    resultbox.value += 'let utils = eval(environment.utils)();\n';
    resultbox.value += "var jsonData = JSON.parse(responseBody);\n";
    if (paramlookup == "") {
        for (var i = 0; i < json.length; i++) {
            if (Object.values(json[i]).includes(keyid)) {
                resultbox.value += "var keyid = '" + keyid + "';\n";
                resultbox.value += "var expected = " + JSON.stringify(json[i]) + ";\n";
                resultbox.value += "postman.setEnvironmentVariable('found',false);\n";
                resultbox.value += "utils.utils.parseSpecific(jsonData, '', expected, keyid);\n";
                resultbox.value += "var found = pm.environment.get('found');\n";
                resultbox.value += "if (!(found === 'true')) {\n";
                resultbox.value += "pm.test('Specific item was not found', function() {throw new Error('" + keyid + " not found in returned object.');});\n"
                resultbox.value += "}\n";
                break;
            }
        }
    }
    else {
        for (var i = 0; i < json[paramlookup].length; i++) {
            if (Object.values(json[paramlookup][i]).includes(keyid)) {
                resultbox.value += "var keyid = '" + keyid + "';\n";
                resultbox.value += "var expected = " + JSON.stringify(json[paramlookup][i]) + ";\n";
                resultbox.value += "postman.setEnvironmentVariable('found',false);\n";
                resultbox.value += "utils.utils.parseSpecific(jsonData, '', expected, keyid);\n";
                resultbox.value += "var found = pm.environment.get('found');\n";
                resultbox.value += "if (!(found === 'true')) {\n";
                resultbox.value += "pm.test('Specific item was not found', function() {throw new Error('" + keyid + " not found in returned object.');});\n"
                resultbox.value += "}\n";
                break;
            }
        }
    }
}