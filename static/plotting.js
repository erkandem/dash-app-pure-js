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

// Get the data from the API
var baseUrl = "https://api.volsurf.com/";
var heartbeatUri = "heartbeat"
var atmIvolUri = "ivol/atm";
var calendarIvolUri = "ivol/calendar";
var riskReversalIvolUri = "ivol/risk-reversal";
var pricesIntradayUri = 'prices/intraday';
var authHeader = loadAuthHeader()


var plotConfigs = [
  {
    target: document.getElementById("dash-grid-0"),
    plotter: atmIvolPlotter,
    query: {
      uri: atmIvolUri,
      params: {
        symbol: 'spy',
        tte: '1m',
        dminus: 365
      },
      symbol: 'spy'
    }
  },
  {
    target: document.getElementById("dash-grid-1"),
    plotter: riskReversalPlotter,
    query: {
      uri: riskReversalIvolUri,
      params: {
        symbol: 'spy',
        tte: '1m',
        dminus: 365
      },
      symbol: 'spy'
    }
  },
  {
    target: document.getElementById("dash-grid-2"),
    plotter: calendarPlotter,
    query: {
      uri: calendarIvolUri,
      params: {
        symbol: 'spy',
        tte: '1m',
        dminus: 365
      },
      symbol: 'spy'
    }
  },
  {
    target: document.getElementById("dash-grid-3"),
    plotter: priceEodPlotter,
    query: {
      uri: pricesIntradayUri,
      params: {
        symbol: 'spy',
        iunit: 'day',
        interval: 1,
        dminus: 365
      },
      symbol: 'spy'
    }
  }
]

function loadAuthHeader() {
  return JSON.parse(
    document.getElementById(
      "client-auth-header"
    ).textContent.replace(
      /(\r\n|\n|\r)/gm, "")
      .trim()
  )
}

function composeQueryFromParams(queryParams) {
  var params = new URLSearchParams()
  var keys = Object.keys(queryParams);
  var i = 0;
  for (i = 0; i < keys.length; i++) {
    params.append(keys[i], queryParams[keys[i]]);
  }
  return params.toString()
}


function plotController(queryObject) {
  // remote query
  var xhr = new XMLHttpRequest();
  var url = baseUrl + queryObject.query.uri + "?" + composeQueryFromParams(queryObject.query.params);
  xhr.open('GET', url);
  xhr.setRequestHeader(authHeader.name, authHeader.value)
  xhr.send();
  var data = [{}];
  xhr.onload = function () {
    if (xhr.status !== 200) {
      console.log('could ot fetch' + url);
      target.textContent = "XHR failed";
    } else {
      data = JSON.parse(xhr.responseText);
      queryObject.plotter(queryObject.query.params.symbol, data, queryObject.target);
    }
  }
}


var defaultImpliedVolatilityData = [
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

function defaultConfig() {
  return {
    displayModeBar: false,
    dragMode: false,
    scrollZoom: false,
  };
}

function defaultLayout() {
  return {
    'height': 170,
    'width': 260,
    'autosize': true,
    'font': {'size': 12},
    'margin': {
      'pad': 0,
      'r': 30,
      't': 30,
      'b': 42,
      'l': 40
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
      'fixedrange': true
    },
    'yaxis': {
      'autorange': true,
      'showline': true,
      'type': 'linear',
      'zeroline': false,
      'domain': [0.05, 0.98],
      'fixedrange': true
    }
  }
}

function atmIvolPlotter(symbol, data, target) {
  var formatted = prepareTimeSeries(data)
  var trace = [{
    x: formatted.dt,
    y: formatted.value,
    line: {
      'color': 'rgb(53, 83, 255)',
      'width': 0.5,
    },
    mode: 'lines',
  }];
  var layout = defaultLayout();
  layout['title'] = {text: symbol.toUpperCase() + ' atm'}
  layout['yaxis']['tickformat'] = '.0%';

  target.textContent = "";
  Plotly.plot(
    target,
    trace,
    layout,
    defaultConfig()
  );
}

function riskReversalPlotter(symbol, data, target) {
  var formatted = prepareTimeSeries(data)
  var range = getNormalizedRange(formatted.value);
  console.log(range)
  var trace = [{
    x: formatted.dt,
    y: formatted.value,
    line: {
      'color': 'rgb(53, 83, 255)',
      'width': 0.5,
    },
    mode: 'lines',
  }];
  var layout = defaultLayout();
  layout['title'] = {text: symbol.toUpperCase() + ' riskreversal'}
  layout['yaxis']['range'] = range;
  layout['yaxis']['autorange'] = false;
  layout['yaxis']['tickformat'] = '.0%';

  target.textContent = "";
  Plotly.plot(
    target,
    trace,
    layout,
    defaultConfig()
  );
}

function calendarPlotter(symbol, data, target) {
  var formatted = prepareTimeSeries(data)
  var range = getNormalizedRange(formatted.value);
  console.log(range)

  var trace = [{
    x: formatted.dt,
    y: formatted.value,
    line: {
      'color': 'rgb(53, 83, 255)',
      'width': 0.5,
    },
    mode: 'lines',
  }];
  var layout = defaultLayout();
  layout['title'] = {text: symbol.toUpperCase() + ' calendar'}
  layout['yaxis']['range'] = range;
  layout['yaxis']['autorange'] = false;
  layout['yaxis']['tickformat'] = '.0%';

  console.log(layout.yaxis)
  target.textContent = "";
  Plotly.plot(
    target,
    trace,
    layout,
    defaultConfig()
  );
}


function priceEodPlotter(symbol, data, target) {
  var slimData = data.map(function (row) {
    return {dt: row.dt, value: row.close}
  });
  var formatted = prepareTimeSeries(slimData)
  var trace = [{
    x: formatted.dt,
    y: formatted.value,
    line: {
      'color': 'rgb(53, 83, 255)',
      'width': 0.5,
    },
    mode: 'lines',
  }];
  var layout = defaultLayout();
  layout['title'] = {text: symbol.toUpperCase() + ' close'}
  target.textContent = "";
  Plotly.plot(
    target,
    trace,
    layout,
    defaultConfig()
  );
}

function getMax(array) {
  return Math.max(...array)
}

function getMin(array) {
  return Math.min(...array)
}

function getMinMax(array) {
  return {
    minValue: getMin(array),
    maxValue: getMax(array)
  }
}

function getNormalizedRange(array) {
  var minMaxObject = getMinMax(array);
  var absMax = Math.max(
    Math.abs(minMaxObject.minValue),
    Math.abs(minMaxObject.maxValue)
  );
  return [-1 * absMax, absMax]
}

function setCurrentDate() {
  const today = new Date();
  const options = {year: 'numeric', month: 'numeric', day: 'numeric'};
  document.getElementById("date-header").textContent = today.toLocaleDateString('de-CH', options);
}

plotConfigs.map(plotController);
setCurrentDate()
