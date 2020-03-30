function generateRandomColors(nbColors) {
    let backgroundColors = [];
    let borderColors = [];
    for (let i = 0; i < nbColors; i++) {
        let sb = 'rgba(';
        for (let j = 0; j < 3; j++) {
            sb += Math.round(Math.random(1)*235).toString() + ', ';
        }
        backgroundColors.push(sb + 0.2 + ')');
        borderColors.push(sb + 1 + ')');
    }
    return {backgroundColors: backgroundColors, borderColors: borderColors};
}

function generateLabelsAndValues(data, entryNames) {
    let labels = [];
    let values = [];
    let otherInfo = [];
    data.forEach(element => {
        labels.push(element[entryNames[0]]);
        values.push(element.value);
        let infos = "";
        for(let i=1; i<length-2; i++) {
          infos += element[entryNames[i]];
        }
        otherInfo.push(infos);
    });
    return {labels: labels, values: values, otherInfo: otherInfo};
}

function displayChart(ctx, label, labels, values, type) {
    let colors = generateRandomColors(labels.length);
    if(type === "") {
      type = "bar";
    }
    type = (type || "bar");
    let chart = new Chart(ctx, {
      type: type,
      data: {
        labels: labels,
        datasets: [{
          label: label,
          data: values,
          backgroundColor: colors.backgroundColors,
          borderColor: colors.borderColors,
          borderWidth: 0.5
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
    return chart;
}

function updateType(chart, type) {
  console.log(chart);
  if (chart && chart.type && type) {
    chart.type = type;
  }
  chart.update();
}

function removeData(chart) {
  console.log(chart);
  if (chart.data) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
  }
}

function printFileAttributes(file, contents) {
  console.log( "Got the file" + "\n" +
    "name: " + file.name + "\n" +
    "type: " + file.type + "\n" +
    "size: " + file.size + " bytesn" + "\n" +
    "starts with: " + contents.substr(1, contents.indexOf("n"))
  );
}

/**
 * 
 * CSVToArray() function thanks to Ben NAdel
 * https://www.bennadel.com/blog/1504-ask-ben-parsing-csv-strings-with-javascript-exec-regular-expression-command.htm
 * This will parse a delimited string into an array of
 * arrays. The default delimiter is the comma, but this
 * can be overriden in the second argument.
 * 
 **/ 
function CSVToArray( strData, strDelimiter ){
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");
    let strMatchedValue;

    // Create a regular expression to parse the CSV values.
    let objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
        );

    // Create an array to hold our data. Give the array
    // a default empty first row.
    let arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    let arrMatches = null;

    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec( strData )){

        // Get the delimiter that was found.
        let strMatchedDelimiter = arrMatches[ 1 ];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            (strMatchedDelimiter != strDelimiter)
            ){

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push( [] );

        }

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[ 2 ]){

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( "\"\"", "g" ),
                "\""
                );

        } else {

            // We found a non-quoted value.
            strMatchedValue = arrMatches[ 3 ];

        }

        // Now that we have our value string, let's add
        // it to the data array.
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }

    // Return the parsed data.
    return( arrData );
}

export default {generateRandomColors, generateLabelsAndValues, displayChart, printFileAttributes, removeData, updateType, CSVToArray};
