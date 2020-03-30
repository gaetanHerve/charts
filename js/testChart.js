import Utils from './Utils.js';


// Make it a class !
let chartObj;
let dataToDisplay = [];
let label = "";
let values = [];
let labels = [];
let colors = [];

let ctx = document.getElementById('chart').getContext('2d');

let fileToRead = 'data/total-alcohol-consumption-per-capita-litres-of-pure-alcohol.CSV';

function readSingleFile(evt) {
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
            let allData = reader.result;
            let splitData = allData.split('"');
            label = splitData[1];
            
            let headers = [];

            for(let i=0; i<(splitData.length-1); i++) {
              headers.push(splitData[i]);
            }
            console.log(headers);
            // let headers = splitData[0] + splitData[1];
            let content = splitData[splitData.length-1];
            let dataArray = [];
            let formattedData = [];

            dataArray = Utils.CSVToArray(content);
            dataArray.forEach(element => {
              if (element.length > 0) {
                // replace property names by properties found in header !
                formattedData.push({label: element[0], year: element[2], value: element[element.length-1]});
              }
            });
            console.log(formattedData);
            dataToDisplay = Utils.generateLabelsAndValues(formattedData);
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



function testCSVToArray(strData) {
  // console.log(strData);
  let testCSVToArray = Utils.CSVToArray(strData);
  console.log(testCSVToArray);
}

