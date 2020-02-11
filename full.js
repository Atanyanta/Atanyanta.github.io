var test, json, resultbox, ignoredfields, keys, teststring, result;

function fullgen() {
    test = document.getElementById("fulltest").value;
    json = JSON.parse(test);
    resultbox = document.getElementById("fullresults");
    ignoredfields = document.getElementById("fullignored").value;

    resultbox.value = '';
    resultbox.value += "postman.setEnvironmentVariable('testStatus','fail');\n";
    resultbox.value += 'let utils = eval(environment.utils)();\n';
    resultbox.value += 'var jsonData = JSON.parse(responseBody);\n';
    resultbox.value += 'var expected = ' + JSON.stringify(json) + '\n\n';

    resultbox.value += 'pm.test("Full response is correct", function() {pm.expect(jsonData).to.eql(expected); postman.setEnvironmentVariable("testStatus","pass");});\n';
    resultbox.value += 'var testStatus = pm.environment.get("testStatus");\n';
    resultbox.value += 'if (testStatus === "fail") {\n';
    resultbox.value += '    utils.utils.parseFull(jsonData, "", expected, "' + ignoredfields + '");\n';
    resultbox.value += '}';
}