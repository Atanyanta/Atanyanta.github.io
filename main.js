var test, json, resultbox, ignored, keys, teststring, result;

function dothething() {
    test = document.getElementById("test").value;
    json = JSON.parse(test);
    resultbox = document.getElementById("results");
    ignored = document.getElementById("ignored").value.split(" ");

    resultbox.value = "";
    resultbox.value +=
        'tests["Status code is 200"] = responseCode.code === 200;\n';
    resultbox.value += "var jsonData = JSON.parse(responseBody);\n";
    if (json.length != undefined) {
        resultbox.value +=
            'tests["Data has correct length"] = jsonData.length = ' + json.length + ";\n\n";
    }
    else resultbox.value += "\n";

    parse(json, "jsonData");
}

function schemagen(blob) {
    
}

//much better recursive parsing function
function parse(blob, locstring) {
    keys = Object.keys(blob);
    keys.forEach(function (element, idx) {
        if (typeof (blob[element]) == "object" && !!blob[element]) {
            parse(blob[element], locstring + (isNaN(element) ? "." : "[") + element + (isNaN(element) ? "" : "]"));
        } else if (Array.isArray(blob[element])) {
            parse(blob[element], locstring + (isNaN(element) ? "." : "[") + element + (isNaN(element) ? "" : "]"));
        } else if (!ignored.includes(element)) {
            if (blob[element] == null) {
                result = "null";
            } else if (typeof (blob[element]) == "boolean") {
                result = blob[element];
            } else if (typeof (blob[element]) == "string") {
                result = '"' + blob[element] + '"';
            } else result = blob[element];

            teststring =
                'tests["Correct ' +
                element +
                ' in ' +
                locstring +
                '"] = ' +
                locstring +
                (isNaN(element) ? "." : "[") +
                element +
                (isNaN(element) ? "" : "]") +
                " === " +
                result +
                ";";
            resultbox.value += teststring + "\n";
            if (idx == keys.length - 1) {
                resultbox.value += "\n";
            }
        }
    });
}