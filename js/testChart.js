import Utils from './Utils.js';

let ctx;
let type = "";
let chartObj;

$(document).ready(function() {
  ctx = $("#chart");
  $('#fileinput').change(readSingleFile);
  $('#type').change(function() {
    type = $(this).children("option:selected").val();
    console.log($(this).children);
    console.log(type);
    // Doesn't work !
    Utils.updateType(chartObj, type);
  });
});

function readSingleFile(evt) {
  //Retrieve the first (and only!) File from the FileList object
  let file = evt.target.files[0];

  // Make it a class !
  let dataToDisplay = [];
  let label = "";
  let values = [];
  let labels = [];

  if (file) {
    let reader = new FileReader();
    reader.onload = function(e) {
      let contents = e.target.result;
      file = evt.target.files[0];
      chartObj = "";
      dataToDisplay = [];
      label = "";
      values = [];
      labels = [];
      // Utils.printFileAttributes(file, contents);
    };
    reader.readAsText(file);

    reader.onloadend = function(e) {
      return new Promise((resolve, reject) => {
        try {
          let headers = [];
          let allData = reader.result;
          let lines = allData.split('\n');
          let firstLine = lines[0];

          lines.splice(0, 1);
          let content = lines.join('\n');
          console.log('firstLine : ' + firstLine);
          if (firstLine.includes('"')) {
            let tmp = firstLine.split('"');
            headers = tmp[0].split(',');
            headers.push(tmp[1]);
          } else {
            headers = firstLine.split(',');
          }

          label = headers[headers.length - 1];
          headers.splice(headers.length - 1, 1);

          let entryNames = headers;
          entryNames.push("value");
          entryNames = entryNames.filter(Boolean);
          console.log(entryNames);
          let formattedData = [];
          let dataArray = Utils.CSVToArray(content);
          dataArray.forEach((element, i) => {
            if (element.length > 0) {
              formattedData[i] = {};
              entryNames.forEach((entry, j) => {
                formattedData[i][entry] = element[j];
              });
            }
          });
          console.log(formattedData);
          dataToDisplay = Utils.generateLabelsAndValues(formattedData, entryNames);
          labels = dataToDisplay.labels;
          values = dataToDisplay.values;
          resolve("OK!");
        } catch (error) {
          console.log(error);
          reject("Nope!");
        }
      }).then((resolve, reject) => {
        if (resolve) {
          Utils.removeData(chartObj);
          chartObj = Utils.displayChart(ctx, label, labels, values, type);
          console.log(resolve);
        } else if (reject) {
          console.log(reject);
        }
      });
    };
  } else {
    alert("Failed to load file");
  }
}
