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

  parse(json, "jsonData");
}

//much better recursive parsing function
function parse(blob, locstring) {
  keys = Object.keys(blob);
  keys.forEach(function(element) {
    if (typeof(blob[element]) == "object" && !!blob[element]) {
      resultbox.value += "\n";
      parse(blob[element], locstring + "['" + element + "']");
    } else if (Array.isArray(blob[element])) {
      resultbox.value += "\n";
      parse(blob[element], locstring + "['" + element + "']");
    } else if (!ignored.includes(element)) {
      if (blob[element] == null) {
        result = "null";
      } else if (typeof(blob[element]) == "boolean") {
        result = blob[element];
      } else if (typeof(blob[element]) == "string") {
        result = '"' + blob[element] + '"';
      } else result = blob[element];

      teststring =
        'tests["Correct ' +
        element +
        " in " +
        locstring +
        '"] = ' +
        locstring +
        "['" +
        element +
        "'] === " +
        result +
        ";";
      resultbox.value += teststring + "\n";
    }
  });
}