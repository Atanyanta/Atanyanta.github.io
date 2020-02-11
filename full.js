var test, json, resultbox, ignoredfields, keys, teststring, result;

function fullgen() {
    test = document.getElementById("fulltest").value;
    json = JSON.parse(test);
    resultbox = document.getElementById("fullresults");
    ignoredfields = document.getElementById("fullignored").value;

    resultbox.value = '';
    resultbox.value += 'let utils = eval(environment.utils)();\n';
    resultbox.value += 'var jsonData = JSON.parse(responseBody);\n';
    resultbox.value += 'var expected = ' + JSON.stringify(json) + '\n\n';

    resultbox.value += 'if (JSON.stringify(jsonData) == JSON.stringify(expected)) {\n';
    resultbox.value += '    pm.test("Full response is correct", function() {pm.expect(jsonData).to.eql(expected)});\n';
    resultbox.value += '}\n';
    resultbox.value += 'else {\n';
    resultbox.value += '    utils.utils.parseFull(jsonData, "", expected, "' + ignoredfields + '");\n';
    resultbox.value += '}';
}