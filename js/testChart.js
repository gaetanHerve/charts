import Utils from './Utils.js';

let chart;
let dataToDisplay = [];
let label = "";
let values = [];
let labels = [];
let colors = [];

let ctx = document.getElementById('myChart').getContext('2d');

let fileToRead = 'data/total-alcohol-consumption-per-capita-litres-of-pure-alcohol.CSV';

function readSingleFile(evt) {
    //Retrieve the first (and only!) File from the FileList object
    let file = evt.target.files[0]; 
    if (file) {
      let reader = new FileReader();
      reader.onload = function(e) { 
        let contents = e.target.result;
        console.log( "Got the file" + "\n" +
            "name: " + file.name + "\n" +
            "type: " + file.type + "\n" +
            "size: " + file.size + " bytesn" + "\n" +
            "starts with: " + contents.substr(1, contents.indexOf("n"))
        );  
      };
      reader.readAsText(file);

      reader.onloadend = function (e) {
        return new Promise((resolve, reject) => {
          let allData = reader.result;
          let splitData = allData.split('"');
          let headers = splitData[0] + splitData[1];
          let content = splitData[2];
          let formattedData = [];
          let splitContent = [];
          splitContent = content.split('\n');
          splitContent.shift();
          splitContent.forEach(element => {
            let elemPart = element.split(',');
            formattedData.push({label: elemPart[0], year: elemPart[2], value: elemPart[3]});
          });
          dataToDisplay = Utils.generateLabelsAndValues(formattedData);
          console.log('dataToDisplay : ' + dataToDisplay);
          label = splitData[1];
          labels = dataToDisplay.labels;
          values = dataToDisplay.values;
          console.log(colors);
          console.log("headers : " + headers);
          resolve();
        }).then(() => {
          chart = Utils.displayChart(ctx, label, labels, values);
        });
      };
      console.log(file);
    } else { 
      alert("Failed to load file");
    }
}

document.getElementById('fileinput').addEventListener('change', readSingleFile, false);
