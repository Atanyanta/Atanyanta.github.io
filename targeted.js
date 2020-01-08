var test, json, resultbox, keyid, keys, teststring, result;

function targetgen() {
    test = document.getElementById("target").value;
    json = JSON.parse(test);
    resultbox = document.getElementById("targetresults");
    keyid = document.getElementById("keyid").value;

    if (!Array.isArray(json)) {
        resultbox.value = "Response is not a valid array of objects.";
        return 0;
    }

    resultbox.value = "";
    resultbox.value += 'const utils = eval(globals.loadUtils);\n';
    for (var i = 0; i < json.length; i++) {
        if (Object.values(json[i]).includes(keyid)) {
            resultbox.value += "var props = " + JSON.stringify(Object.keys(json[i])) + ";\n";
            resultbox.value += "var expected = " + JSON.stringify(Object.values(json[i])) + ";\n";
            resultbox.value += "utils.arrayCompareTest(null,null,props,expected);\n";
            break;
        }
    }
}