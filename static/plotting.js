var etfSymbols = [
  "dia",
  "eem",
  "efa",
  "ewj",
  "qqq",
  "ewz",
  "fez",
  "xle",
  "fxi",
  "gdx",
  "gdxj",
  "gld",
  "slv",
  "gld",
  "ief",
  "spy"
];

var modulesElements = [
  document.getElementById("dash-grid-1"),
  document.getElementById("dash-grid-2"),
  document.getElementById("dash-grid-3"),
  document.getElementById("dash-grid-4"),
  document.getElementById("dash-grid-5"),
  document.getElementById("dash-grid-6"),
  document.getElementById("dash-grid-7"),
  document.getElementById("dash-grid-8"),
  document.getElementById("dash-grid-9"),
  document.getElementById("dash-grid-10"),
  document.getElementById("dash-grid-11"),
  document.getElementById("dash-grid-12"),
  document.getElementById("dash-grid-13"),
  document.getElementById("dash-grid-14"),
  document.getElementById("dash-grid-15"),
  document.getElementById("dash-grid-16")
];

var moduleSymbolMapping = [
  {target: modulesElements[0], symbol: etfSymbols[0]},
  {target: modulesElements[1], symbol: etfSymbols[1]},
  {target: modulesElements[2], symbol: etfSymbols[2]},
  {target: modulesElements[3], symbol: etfSymbols[3]},
  {target: modulesElements[4], symbol: etfSymbols[4]},
  {target: modulesElements[5], symbol: etfSymbols[5]},
  {target: modulesElements[6], symbol: etfSymbols[6]},
  {target: modulesElements[7], symbol: etfSymbols[7]},
  {target: modulesElements[8], symbol: etfSymbols[8]},
  {target: modulesElements[9], symbol: etfSymbols[9]},
  {target: modulesElements[10], symbol: etfSymbols[10]},
  {target: modulesElements[11], symbol: etfSymbols[11]},
  {target: modulesElements[12], symbol: etfSymbols[12]},
  {target: modulesElements[13], symbol: etfSymbols[13]},
  {target: modulesElements[14], symbol: etfSymbols[14]},
  {target: modulesElements[15], symbol: etfSymbols[15]},
]

function loadAuthHeader(){
  return JSON.parse(
    document.getElementById(
      "client-auth-header"
    ).textContent.replace(
      /(\r\n|\n|\r)/gm, "")
      .trim()
  )
}

function tmIvolQueryParams(symbol){
  var params = new URLSearchParams()
  params.append("symbol", symbol);
  params.append("tte", "1m");
  params.append("dminus", 365);
  return params.toString()
}
// Get the data from the API
var baseUrl = "https://api.volsurf.com/";
var heartbeatUri = "heartbeat"
var atmIvolUri = "ivol/atm";
var authHeader = loadAuthHeader()

function atmIvolXhrQuery(symbolAndTarget) {
  // unpack input object
  var symbol = symbolAndTarget.symbol
  var target = symbolAndTarget.target

  // remote query
  var xhr = new XMLHttpRequest();
  var url = baseUrl + atmIvolUri + "?" + tmIvolQueryParams(symbol);
  xhr.open('GET', url);
  xhr.setRequestHeader(authHeader.name, authHeader.value)
  xhr.send();
  var data = [{}];
  xhr.onload = function () {
    if (xhr.status !== 200) {
      console.log('could ot fetch' + url)
      target.textContent = "XHR failed"
    } else {
      // processing (aka callback hell)
      data = JSON.parse(xhr.responseText);
      atmIvolChartactory(symbol, data, target);
    }
  }
}

function simpleXhrFactory(target) {
  var xhr = new XMLHttpRequest();
  var url = baseUrl + heartbeatUri
  xhr.open('GET', url);
  xhr.send();
  xhr.onload = function () {
    if (xhr.status !== 200) {
      console.log('could ot fetch' + url)
      target.textContent = "XHR failed"
    } else {
      data = xhr.responseText;
      target.textContent = data
    }
  }
}

var defaultImpliedVolatlityData = [
  {
    "dt": "2020-11-30",
    "value": 0.173243970128056
  },
  {
    "dt": "2020-12-01",
    "value": 0.174087290502077
  },
  {
    "dt": "2020-12-02",
    "value": 0.170085741484049
  },
  {
    "dt": "2020-12-03",
    "value": 0.168794126979577
  },
  {
    "dt": "2020-12-04",
    "value": 0.153877620534567
  },
  {
    "dt": "2020-12-07",
    "value": 0.162508141717327
  },
  {
    "dt": "2020-12-08",
    "value": 0.155979307738347
  },
  {
    "dt": "2020-12-09",
    "value": 0.171631901764618
  },
  {
    "dt": "2020-12-10",
    "value": 0.168564879983046
  },
  {
    "dt": "2020-12-11",
    "value": 0.171534692385804
  },
  {
    "dt": "2020-12-14",
    "value": 0.192823964008308
  },
  {
    "dt": "2020-12-15",
    "value": 0.168494229578856
  },
  {
    "dt": "2020-12-16",
    "value": 0.162972372560976
  },
  {
    "dt": "2020-12-17",
    "value": 0.156798168948195
  },
  {
    "dt": "2020-12-18",
    "value": 0.157628327761397
  },
  {
    "dt": "2020-12-21",
    "value": 0.19040652746625
  },
  {
    "dt": "2020-12-22",
    "value": 0.179764166650674
  },
  {
    "dt": "2020-12-24",
    "value": 0.152150380490322
  }
]

function prepareTimeSeries(timeSeries, xKey = 'dt', yKey = 'value') {
  var idx = 0;
  var formatted = {};
  formatted[xKey] = [];
  formatted[yKey] = [];
  for (idx = 0; idx < timeSeries.length; idx++) {
    formatted[xKey].push(timeSeries[idx][xKey]);
    formatted[yKey].push(timeSeries[idx][yKey]);
  }
  return formatted
}

function defaultLayout() {
  return {
    'autosize': true,
    'font': {'size': 12},
    'margin': {
      'pad': 0,
      'r': 40,
      't': 30,
      'b': 42,
      'l': 30
    },
    'showlegend': false,
    'titlefont': {'size': 12},
    'xaxis': {
      'autorange': true,
      'showline': true,
      'type': 'date',
      'showgrid': false,
      'zeroline': false,
      'ticklen': 3,
    },
    'yaxis': {
      'autorange': true,
      'showline': true,
      'type': 'linear',
      'zeroline': false,
      'hoverformat': '.2f',
      'domain': [0.05, 0.98]
    }
  }
}

function atmIvolChartactory(symbol, data, target) {
  var formatted = prepareTimeSeries(data)
  var xValues = formatted.dt;
  var yValues = formatted.value;
  var trace = [{
    x: xValues,
    y: yValues,
    line: {
      'color': 'rgb(53, 83, 255)',
      'width': 0.5,
    },
    mode: 'lines',
  }];

  var layout = defaultLayout();
  layout['height'] = 170;
  layout['width'] = 260;
  layout['title'] = {text: symbol.toUpperCase()}
  layout['tickvals'] = xValues;
  //layout['yaxis']['title'] = {text: '% p.a.'};

  var config = {displayModeBar: false};

  target.textContent = "";

  Plotly.plot(
    target,
    trace,
    layout,
    config
  );
}
function setCurrentDate() {
  const today = new Date();
  const options = {year: 'numeric', month: 'numeric', day: 'numeric' };
  document.getElementById("date-header").textContent = today.toLocaleDateString('de-CH', options);
}


moduleSymbolMapping.map(atmIvolXhrQuery);
setCurrentDate()
