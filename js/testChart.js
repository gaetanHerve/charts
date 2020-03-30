import Utils from './Utils.js';


// Make it a class !


let ctx = document.getElementById('chart').getContext('2d');

let fileToRead = 'data/total-alcohol-consumption-per-capita-litres-of-pure-alcohol.CSV';

function readSingleFile(evt) {
  let chartObj;
  let dataToDisplay = [];
  let label = "";
  let values = [];
  let labels = [];
  //Retrieve the first (and only!) File from the FileList object
  let file = evt.target.files[0]; 
  if (file) {
    let reader = new FileReader();
    reader.onload = function(e) { 
      let contents = e.target.result;
      // Utils.printFileAttributes(file, contents);
    };
    reader.readAsText(file);

    reader.onloadend = function (e) {
      return new Promise((resolve, reject) => {
        try {
          let headers = [];
          let allData = reader.result;
          let lines = allData.split('\n');
          let firstLine = lines[0];

          lines.splice(0, 1);
          let content = lines.join('\n');



          let splitData = allData.split('"');

          console.log('firstLine : ' + firstLine);
          if (firstLine.includes('"')) {
            let tmp = firstLine.split('"');
            headers = tmp[0].split(',');
            headers.push(tmp[1]);
          } else {
            headers = firstLine.split(',');
          }

          label = headers[headers.length-1];
          headers.splice(headers.length-1, 1);

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
          chartObj = Utils.displayChart(ctx, label, labels, values);
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

document.getElementById('fileinput').addEventListener('change', readSingleFile, false);
