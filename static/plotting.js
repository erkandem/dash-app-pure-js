var storage = {
  rawdata: {},
  formatted: {}
}
var xhrCounter = 0;

// Get the data from the API
var baseUrl = "https://api.volsurf.com/";
var heartbeatUri = "heartbeat"
var atmIvolUri = "ivol/atm";
var calendarIvolUri = "ivol/calendar";
var riskReversalIvolUri = "ivol/risk-reversal";
var pricesIntradayUri = 'prices/intraday';
var pricesEodContiUri = 'prices/eod/conti';
var authHeader = loadAuthHeader()


var rowFirst = [
  {
    target: document.getElementById("dash-grid-0"),
    plotter: atmIvolPlotter,
    query: {
      uri: atmIvolUri,
      params: {
        symbol: 'cl',
        tte: '1m',
        dminus: 365
      },
    }
  },
  {
    target: document.getElementById("dash-grid-1"),
    plotter: riskReversalPlotter,
    query: {
      uri: riskReversalIvolUri,
      params: {
        symbol: 'cl',
        tte: '1m',
        dminus: 365
      },
    }
  },
  {
    target: document.getElementById("dash-grid-2"),
    plotter: calendarPlotter,
    query: {
      uri: calendarIvolUri,
      params: {
        symbol: 'cl',
        tte: '1m',
        dminus: 365
      },
    }
  },
  {
    target: document.getElementById("dash-grid-3"),
    plotter: pricesEodContiPlotter,
    query: {
      uri: pricesEodContiUri,
      params: {
        symbol: 'cl',
        iunit: 'day',
        interval: 1,
        dminus: 365
      },
    }
  }
]
var rowSecond = [
  {
    target: document.getElementById("dash-grid-4"),
    plotter: atmIvolPlotter,
    query: {
      uri: atmIvolUri,
      params: {
        symbol: 'b',
        ust: 'fut',
        tte: '1m',
        dminus: 365
      },
    }
  },
  {
    target: document.getElementById("dash-grid-5"),
    plotter: riskReversalPlotter,
    query: {
      uri: riskReversalIvolUri,
      params: {
        symbol: 'b',
                ust: 'fut',

        tte: '1m',
        dminus: 365
      },
    }
  },
  {
    target: document.getElementById("dash-grid-6"),
    plotter: calendarPlotter,
    query: {
      uri: calendarIvolUri,
      params: {
        symbol: 'b',
                ust: 'fut',
        tte: '1m',
        dminus: 365
      }
    }
  },
  {
    target: document.getElementById("dash-grid-7"),
    plotter: pricesEodContiPlotter,
    query: {
      uri: pricesEodContiUri,
      params: {
        symbol: 'b',
        iunit: 'day',
        interval: 1,
        dminus: 365
      }
    }
  }
]
var rowThird = [
  {
    target: document.getElementById("dash-grid-8"),
    plotter: atmIvolPlotter,
    query: {
      uri: atmIvolUri,
      params: {
        symbol: 'ho',
        tte: '1m',
        dminus: 365
      },
    }
  },
  {
    target: document.getElementById("dash-grid-9"),
    plotter: riskReversalPlotter,
    query: {
      uri: riskReversalIvolUri,
      params: {
        symbol: 'ho',
        tte: '1m',
        dminus: 365
      },
    }
  },
  {
    target: document.getElementById("dash-grid-10"),
    plotter: calendarPlotter,
    query: {
      uri: calendarIvolUri,
      params: {
        symbol: 'ho',
        tte: '1m',
        dminus: 365
      },
    }
  },
  {
    target: document.getElementById("dash-grid-11"),
    plotter: pricesEodContiPlotter,
    query: {
      uri: pricesEodContiUri,
      params: {
        symbol: 'ho',
        iunit: 'day',
        interval: 1,
        dminus: 365
      },
    }
  }
]
var rowFourth = [
  {
    target: document.getElementById("dash-grid-12"),
    plotter: atmIvolPlotter,
    query: {
      uri: atmIvolUri,
      params: {
        symbol: 'rb',
        ust: 'fut',
        tte: '1m',
        dminus: 365
      },
    }
  },
  {
    target: document.getElementById("dash-grid-13"),
    plotter: riskReversalPlotter,
    query: {
      uri: riskReversalIvolUri,
      params: {
        symbol: 'rb',
        ust: 'fut',
        tte: '1m',
        dminus: 365
      },
    }
  },
  {
    target: document.getElementById("dash-grid-14"),
    plotter: calendarPlotter,
    query: {
      uri: calendarIvolUri,
      params: {
        symbol: 'rb',
        ust: 'fut',
        tte: '1m',
        dminus: 365
      },
    }
  },
  {
    target: document.getElementById("dash-grid-15"),
    plotter: pricesEodContiPlotter,
    query: {
      uri: pricesEodContiUri,
      params: {
        symbol: 'rb',
        ust: 'fut',
        iunit: 'day',
        interval: 1,
        dminus: 365
      }
    }
  }
]

var plotConfigs = [
  ...rowFirst,
  ...rowSecond,
  ...rowThird,
  ...rowFourth
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

function isDocumentReady () {
  if (xhrCounter === 15) {
      window.status = 'ready';
    console.log('is ready (' + xhrCounter.toString() + ')')
  } else {
    console.log('not ready (' + xhrCounter.toString() + ')')
  }

}
function plotController(queryObject) {
  // remote query
  var xhr = new XMLHttpRequest();
  var url = baseUrl + queryObject.query.uri + "?" + composeQueryFromParams(queryObject.query.params);
  xhr.open('GET', url);
  xhr.setRequestHeader(authHeader.name, authHeader.value)
  xhr.send();
  var data = [{}];
  xhrCounter = xhrCounter + 1;
  xhr.onload = function () {
    if (xhr.status !== 200) {
      console.log('could not fetch ' + url);
    } else {
      data = JSON.parse(xhr.responseText);
      storage.rawdata[url] = data;
      queryObject.plotter(queryObject.query.params.symbol, data, queryObject.target);
    }
    isDocumentReady()
  }
}


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

function defaultPlotOptions() {
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
  layout['yaxis']['hoverformat'] = '.2f';

  target.textContent = "";
  Plotly.plot(
    target,
    trace,
    layout,
    defaultPlotOptions()
  );
}

function riskReversalPlotter(symbol, data, target) {
  var formatted = prepareTimeSeries(data)
  var range = getNormalizedRange(formatted.value);
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
  layout['yaxis']['hoverformat'] = '.2f';

  target.textContent = "";
  Plotly.plot(
    target,
    trace,
    layout,
    defaultPlotOptions()
  );
}

function calendarPlotter(symbol, data, target) {
  var formatted = prepareTimeSeries(data)
  var range = getNormalizedRange(formatted.value);

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
  layout['yaxis']['hoverformat'] = '.2f';

  target.textContent = "";
  Plotly.plot(
    target,
    trace,
    layout,
    defaultPlotOptions()
  );
}


function pricesEodPlotter(symbol, data, target) {
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
    defaultPlotOptions()
  );
}
function pricesEodContiPlotter(symbol, data, target) {
  pricesEodPlotter(symbol, data, target)
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
