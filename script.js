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

getData("./mutation_legend_data (1).csv")
  .then(rows => {

    rows = rows.map(row => {
      row['Gene Sort Value'] = parseFloat(row['Gene Sort Value']);
      row['Age'] = parseInt(row['Age']);
      row['Variant type mutations quantity'] = parseInt(row['Variant type mutations quantity']);
      return row;
    })

    render(rows)

  })
  .catch(err => {
    console.error(err)
  })

var render = function (data) {
  
  var yValues = [];
  var xValues = [];

  for (var i = 0, n = data.length; i < n; i++) {
    if (!yValues.find(e => e === data[i]['Gene'])) {
      yValues.push(data[i]['Gene']);
    }
    if (!xValues.find(e => e === data[i]['Tumor Sample Barcode'])) {
      xValues.push(data[i]['Tumor Sample Barcode']);
    }
  }

  yValues = yValues.sort((a, b) => a >= b ? -1 : 1); 

  var zValues = [];

  for ( var i = 0; i < yValues.length; i++ ) {
    zValues[i] = [];
    for ( var j = 0; j < xValues.length; j++ ) {
      zValues[i][j] = 0;
    }
  }

  var color = {
    "Silent": 10,
    "Missense_Mutation": 20,
    "Splice_Site": 30,
    "Frame_Shift_Ins": 40,
    "In_Frame_Del": 50,
    "In_Frame_Ins": 60,
    "Frame_Shift_Del": 70,
    "Nonsense_Mutation": 80,
    "5'Flank": 90,

  }

  data.map(row => {
    let y = yValues.findIndex(e => e === row['Gene']);
    let x = xValues.findIndex(e => e === row['Tumor Sample Barcode']);
    if (color[row['Variant Classification']]) {
      zValues[y][x] = color[row['Variant Classification']] - 10;
    }
    
  });

  console.log('xValues', xValues.length);
  console.log('yValues', yValues.length);
  // console.log('zValues', zValues);
var colorStyle = [
    [0, "#ffffff"],
    [10, "#e377c2"],
    [20, "#9467bd"],
    [30, "#837f7f"],
    [40, "#ff7f0e"],
    [50, "#2ca02c"],
    [60, "#d62728"],
    [70, "#1f77b4"],
    [80, "#8c564b"],
    [90, "#ffbb78"]
]

  var data = [{
    x: xValues,
    y: yValues,
    z: zValues,
    type: 'heatmap',
    colorscale: [

// Let first 10% (0.1) of the values have color rgb(0, 0, 0)

        [0, '#ffffff'],
        [0.1, '#e377c2'],

// Let values between 10-20% of the min and max of z
// have color rgb(20, 20, 20)

        [0.1, '#9467bd'],
        [0.2, '#9467bd'],

// Values between 20-30% of the min and max of z
//have color rgb(40, 40, 40)

        [0.2, '#837f7f'],
        [0.3, '#837f7f'],

        [0.3, '#ff7f0e'],
        [0.4, '#ff7f0e'],

        [0.4, '#2ca02c'],
        [0.5, '#2ca02c'],

        [0.5, '#1f77b4'],
        [0.6, '#1f77b4'],

        [0.6, '#d62728'],
        [0.7, '#d62728'],

        [0.7, '#1f77b4'],
        [0.8, '#1f77b4'],

        [0.8, '#8c564b'],
        [0.9, '#8c564b'],

        [0.9, '#ffbb78'],
        [1.0, '#ffbb78']
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
      width: 543,
      height: 292,
      autosize: true
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
