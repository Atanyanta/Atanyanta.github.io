var test, json, resultbox, ignored, keys, teststring, result;

function testgen() {
    test = document.getElementById("chunktest").value;
    json = JSON.parse(test);
    resultbox = document.getElementById("chunkresults");
    ignored = document.getElementById("ignored").value.split(" ");

    resultbox.value = "";
    resultbox.value +=
        'pm.test("Status code is 200", function () {pm.response.to.have.status(200);});\n';
    resultbox.value += "var jsonData = JSON.parse(responseBody);\n";
    if (json.length != undefined) {
        resultbox.value +=
            'pm.test("Data has correct length", function() {pm.expect(jsonData.length).to.eql(' + json.length + ")});\n\n";
    }
    else resultbox.value += "\n\n";

    parse(json, "jsonData");
}

function schemagen(blob) {

}

function openTab(evt, TabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(TabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function copyToClipboard(elem) {
    const el = document.createElement('textarea');
    el.value = document.getElementById(elem).value;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
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
            if (Object.keys(blob[element]) != 0 || document.getElementById("ignoreemptyarrays").checked) {
                parse(blob[element], locstring + (isNaN(element) ? "." : "[") + element + (isNaN(element) ? "" : "]"));
                return;
            }
            //if it's neither then we must be at an individual key:value pair
        } if (!ignored.includes(element)) {
            if (blob[element] == null) {
                result = "null";
            } else if (typeof (blob[element]) == "boolean") {
                result = blob[element];
            } else if (typeof (blob[element]) == "string") {
                result = '"' + blob[element] + '"';
            }
            else result = blob[element];

            if (typeof (blob[element]) == "object" && !!blob[element]) {
                teststring =
                    'pm.test("Empty Array/Object ' +
                    element +
                    ' at ' +
                    locstring +
                    '", function() {pm.expect(' +
                    (Array.isArray(blob[element]) ? "" : "Object.keys(") +
                    locstring +
                    (isNaN(element) ? "." : "[") +
                    element +
                    (isNaN(element) ? "" : "]") +
                    (Array.isArray(blob[element]) ? ".length" : ").length") +
                    ").to.eql(0)});";
            }

            else {
                teststring =
                    'pm.test("Correct ' +
                    element +
                    ' in ' +
                    locstring +
                    '", function() {pm.expect(' +
                    locstring +
                    (isNaN(element) ? "." : "[") +
                    element +
                    (isNaN(element) ? "" : "]") +
                    ").to.eql(" +
                    result +
                    ")});";
            }
            resultbox.value += teststring + "\n";
            if (idx == keys.length - 1) {
                resultbox.value += "\n";
            }
        }
    });
}