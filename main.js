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

    //loop through all keys
    keys.forEach(function (element, idx) {
        //if it's an array, recursively call the function on all array elements
        if (Array.isArray(blob[element])) {
            if (blob[element].length != 0 || document.getElementById("ignoreemptyarrays").checked) {
                parse(blob[element], locstring + (isNaN(element) ? "." : "[") + element + (isNaN(element) ? "" : "]"));
                return;
            }
        }
        //same if it's an object (array is parsed first because an array is an object and will trigger this)
        else if (typeof (blob[element]) == "object" && !!blob[element]) {
            if (Object.keys(blob[element]) != 0 || document.getElementById("ignoreemptyarrays").checked){
                console.log(blob[element]);
                parse(blob[element], locstring + (isNaN(element) ? "." : "[") + element + (isNaN(element) ? "" : "]"));
                return;
            }
        //if it's neither then we must be at an individual key:value pair
        }  if (!ignored.includes(element)) {
            if (blob[element] == null) {
                result = "null";
            } else if (typeof (blob[element]) == "boolean") {
                result = blob[element];
            } else if (typeof (blob[element]) == "string") {
                result = '"' + blob[element] + '"';
            }
            else result = blob[element];

            if (typeof (blob[element]) == "object" && !!blob[element]){
                teststring =
                'tests["Empty Array/Object ' +
                element +
                ' at ' +
                locstring +
                '"] = ' +
                (Array.isArray(blob[element]) ? "" : "Object.keys(") +
                locstring +
                (isNaN(element) ? "." : "[") +
                element +
                (isNaN(element) ? "" : "]") +
                (Array.isArray(blob[element]) ? ".length" : ").length") +
                " === 0;";
            }

            else {
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
            }
            resultbox.value += teststring + "\n";
            if (idx == keys.length - 1) {
                resultbox.value += "\n";
            }
        }
    });
}