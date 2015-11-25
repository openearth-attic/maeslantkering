/* global map */

var profile;
function renderModel(json) {
  "use strict";
  console.log(map);


  var svg = d3.select(map.getPanes().overlayPane).append('svg');
  var g = svg.append('g')
        .attr('class', 'leaflet-zoom-hide')
        .attr('id', 'grid');

  function projectPoint(x, y) {
    var point = map.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
  }

  var transform = d3.geo.transform({point: projectPoint});
  var path = d3.geo.path().projection(transform);

  var color = d3.scale.linear()
        .range(["#bdd", "#57d"]);

  var subset = _.slice(json.features, 0, 100);
  console.log(subset, path(subset[0]));
  var features = g.selectAll('path')
  // .data(subset)
        .data(json.features)
        .enter()
        .append('path')
        .attr({d: path,
               id: function(d, i){return 'c' + json.features[i].id;}})
        .style('fill', function(d, i){return color(i / 10000); });

  // Reposition the SVG to cover the features.
  function reset() {
    var bounds = path.bounds(json),
        topLeft = bounds[0],
        bottomRight = bounds[1];
    svg
      .attr('width', bottomRight[0] - topLeft[0])
      .attr('height', bottomRight[1] - topLeft[1])
      .style('left', topLeft[0] + 'px')
      .style('top', topLeft[1] + 'px');

    g
      .attr('transform', 'translate(' + -topLeft[0] + ',' + -topLeft[1] + ')');

    features
      .attr('d', path);

  }

  map.on('viewreset', reset);
  reset();
}

function callbackf(data){
  var rho =  data.rho.data[0][0][0];

}

function renderProfile(json) {
  "use strict";
  console.log(map);


  var svg = d3.select(map.getPanes().overlayPane).append('svg');
  var g = svg.append('g')
        .attr('class', 'leaflet-zoom-hide')
        .attr('id', 'profilegrid');

  function projectPoint(x, y) {
    var point = map.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
  }

  var transform = d3.geo.transform({point: projectPoint});
  var path = d3.geo.path().projection(transform);

  var color = d3.scale.linear()
        .range(["#bdd", "#57d"]);

  var features = g.selectAll('path')
        .data(json.features)
        .enter()
        .append('path')
        .attr({
          d: path,
          id: function(d, i){return 'p' + d.id;}
        });


  // Reposition the SVG to cover the features.
  function reset() {
    var bounds = path.bounds(json),
        topLeft = bounds[0],
        bottomRight = bounds[1];
    svg
      .attr('width', bottomRight[0] - topLeft[0])
      .attr('height', bottomRight[1] - topLeft[1])
      .style('left', topLeft[0] + 'px')
      .style('top', topLeft[1] + 'px');

    g
      .attr('transform', 'translate(' + -topLeft[0] + ',' + -topLeft[1] + ')');

    features
      .attr('d', path);

  }

  map.on('viewreset', reset);
  reset();
}


(function(){
  "use strict";
  fetch('models/salinity.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(json){
      console.log('grid', json);
      renderModel(json);
      //loadData("http://192.168.120.134:8001/FlowFM_map.nc.dods?rho[1][5][0:10]", callbackf);

    });
  fetch('models/profile.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(json){
      console.log('profile', json);
      profile = json;
      renderProfile(json);
      //loadData("http://192.168.120.134:8001/FlowFM_map.nc.dods?rho[1][5][0:10]", callbackf);
    });

})();
