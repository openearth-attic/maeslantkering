/* global map */
function renderModel(json) {
  "use strict";
  console.log(map);
  

  var svg = d3.select(map.getPanes().overlayPane).append('svg');
  var g = svg.append('g').attr('class', 'leaflet-zoom-hide');

  function projectPoint(x, y) {
    var point = map.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
  }

  var transform = d3.geo.transform({point: projectPoint});
  var path = d3.geo.path().projection(transform);

  var color = d3.scale.linear()
        .range(["#bdd", "#57d"]);

  var features = g.selectAll('path')
//        .data(_.slice(json.features, 80000, 99000))
        .data(json.features)
        .enter()
        .append('path')
        .attr({d: path, id: function(d, i){return json.features[i].id;}})
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

(function(){
  "use strict";
  fetch('models/gridTest3.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(json){
//      console.log(json);
      renderModel(json);
      //loadData("http://192.168.120.134:8001/FlowFM_map.nc.dods?rho[1][5][0:10]", callbackf);
    });
})();
