var getData = function (url, delimiter = ';', mimeType = "text/csv") {
  return new Promise((resolve, reject) => {

    var t = Plotly.d3.dsv(delimiter, mimeType);

    t(url, function (err, rows) {
      if (err) {
        return reject(rows)
      }
      resolve(rows);
    })
  })
}

getData("./copy_number_legend_data(BRCA+BLCA)2.csv")
  .then(rows => {

    render(rows)

  })
  .catch(err => {
    console.error(err)
  })

var render = function (data) {
  //debugger
  var yValues = [];
  var xValues = [];

  //var sort = {}

  for (var i = 0, n = data.length; i < n; i++) {
    if (!yValues.find(e => e === data[i]['Gene'])) {
      yValues.push(data[i]['Gene']);
      //sort[data[i]['Gene']] = parseFloat(data[i]['Max. Gene Sort Value']) 
    }
    if (!xValues.find(e => e === data[i]['Tumor Sample Barcode'])) {
      xValues.push(data[i]['Tumor Sample Barcode']);
    }
  }
  var zValues = [];

  yValues = yValues.sort((a, b) => a >= b ? -1 : 1);

  for ( var i = 0, n = yValues.length; i < n; i++ ) {
    zValues[i] = [];
    for ( var j = 0, m = yValues.length; j < m; j++ ) {
      zValues[i][j] = 5;
    }
  }

  var color = {
    "CN amplification (CN >= 0.6)": 15,
    "CN gain (0.2 <= CN < 0.6)": 25,
    "No change (-0.2 < CN < 0.2)": 35,
    "CN loss (-0.6 < CN <= -0.2)": 45,
    "CN deletion (CN <= -0.6)": 55,
    "NA": 65
  }

  data.map(row => {

    let y = yValues.findIndex(e => e === row['Gene']);
    let x = xValues.findIndex(e => e === row['Tumor Sample Barcode']);
    if (color[row['Cn Gene Value calculated']]) {
      zValues[y][x] = color[row['Cn Gene Value calculated']];
    }

  });

  console.log('xValues', xValues);
  console.log('yValues', yValues);
  console.log('zValues', zValues);
  //debugger

var colorStyle = [
    [0, "#ffffff"],
    [10, "#ff0825"],
    [20, "#ff5468"],
    [30, "#ececec"],
    [40, "#68aeff"],
    [50, "#2b69ca"],
    [60, "#d62728"],
    [70, "#1f77b4"],
    [80, "#8c564b"]
]

  var data = [{
    x: xValues,
    y: yValues,
    z: zValues,
    type: 'heatmap',
    colorscale: [

// Let first 10% (0.1) of the values have color rgb(0, 0, 0)

        [0, '#ffffff'],
        [0.1, '#ffffff'],

// Let values between 10-20% of the min and max of z
// have color rgb(20, 20, 20)

        [0.1, '#ff0825'],
        [0.2, '#ff0825'],

// Values between 20-30% of the min and max of z
//have color rgb(40, 40, 40)

        [0.2, '#ff5468'],
        [0.3, '#ff5468'],

        [0.3, '#9E9E9E'],
        [0.4, '#9E9E9E'],

        [0.4, '#68aeff'],
        [0.5, '#68aeff'],

        [0.5, '#2b69ca'],
        [0.6, '#2b69ca'],

        [0.6, '#ffffff'],
        [1.0, '#ffffff']
    ],
    type: 'heatmap',
    colorbar:{
      autotick: false,
      tick0: 0,
      dtick: 1
    },
    showscale: true
  }];

  var layout = {
    title: 'Annotated Heatmap',
    annotations: [],
    xaxis: {
      ticks: '',
      side: 'top'
    },
    yaxis: {
      ticks: '',
      ticksuffix: ' ',
      width: 1000,
      height: 1000,
      autosize: false
    }
  };

  /*for ( var i = 0; i < yValues.length; i++ ) {
    for ( var j = 0; j < xValues.length; j++ ) {
      var currentValue = zValues[i][j];
      if (currentValue != 0.0) {
        var textColor = 'white';
      }else{
        var textColor = 'black';
      }
      var result = {
        xref: 'x1',
        yref: 'y1',
        x: xValues[j],
        y: yValues[i],
        text: zValues[i][j],
        font: {
          family: 'Arial',
          size: 12,
          color: 'rgb(50, 171, 96)'
        },
        showarrow: false,
        font: {
          color: textColor
        }
      };
      layout.annotations.push(result);
    }
  }*/

  Plotly.newPlot('root', data, layout, {scrollZoom: true});

}
