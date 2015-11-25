var config = {
  tracker: 'http://localhost:22222'
};
var model;
fetch(config.tracker + '/models')
  .then(function(x){
    return x.json();
  })
  .then(function(models){
    console.log('models', models);
    model = _.last(models);
    model.variable = 'sa1';

    connect(model);
    setTimeout(function(){
      console.log('play')
      model.ws.send(JSON.stringify({"remote": "play"}));
      // _.each(_.range(10),function(i){
      //   model.ws.send(JSON.stringify({
      //     'set_var_index': model.variable,
      //     'index': [100 + i],
      //     'dtype': 'double',
      //     'shape': [1]
      //   }));
      //   model.ws.send(new Float64Array([i / 10.0]));
      // });
    }, 1000);
    // setTimeout(function(){
    //   console.log('pause');
    //   model.ws.send(JSON.stringify({"remote": "pause"}));

    // }, 5000);

  });

var update = {};
update.profile = function() {
  if (! _.has(model, 'vars')){
    return;
  };
  if (! _.has(model, 'vars.s1')){
    return;
  };
  if (! _.has(model, 'vars.bl')){
    return;
  };
  if (! _.has(model, 'vars.sa1')){
    return;
  };


  var svg = d3.select("#profile svg");


  var n = 10, // number of layers
      m = profile.features.length; // number of samples per layer
  var stack = d3.layout.stack()
        .values(function(d){
          return d.values;
        }); // .offset("wiggle"),



  var cells = [];
  _.each(
    profile.features,
    function(feature, i){
      _.each(_.range(n), function(k){
        var s1 = model.vars['s1'][feature.id];
        var bl = model.vars['bl'][feature.id];
        var idx = 4855 * 1 + feature.id*11 + k ;

        var sa1 = model.vars['sa1'][idx];
        var bottom = bl + k/n * (s1 - bl);
        var top = bl + (k+1)/n * (s1 - bl);
        var cell = {
          type: "Feature",
          id: feature.id + "_" + k,
          properties: {
            idx: idx
          },
          geometry: {
            "type": "Polygon",
            "coordinates": [[
              [i, bottom],
              [i+1, bottom],
              [i+1, top],
              [i, top],
              [i, bottom]
            ]]
          }
        };
        cells.push(cell);
      });
    }
  );

  var width = 300,
      height = 100;

  var x = d3.scale.linear()
        .domain([0, m - 1])
        .range([0, width]);

  var domain = [ -10, 3];
  var y = d3.scale.linear()
        .domain(domain)
        .range([height, 0]);

  function projectPoint(x_, y_) {
    // project to svg height, width
    this.stream.point(x(x_), y(y_));
  }

  var transform = d3.geo.transform({point: projectPoint});
  var path = d3.geo.path().projection(transform);

  var domain = [23.0, 25, 27.0];

  var color = d3.scale.linear()
        .domain(domain)
        .range(['blue', 'white', 'red']);
  var opacity = d3.scale.linear()
        .domain(domain)
        .range([1.0, 0.2, 1.0]);

  svg.selectAll('path')
    .remove();

  svg.selectAll('path')
    .data(cells)
    .enter()
    .append('path')
    .attr("d", function(d) {return path(d);})
    .attr("id", function(d) {return "cs" + d.id;})
    .style("fill", function(d) {
      return color(model.vars['sa1'][d.properties.idx]);
    })
    .style('fill-opacity', function(d){
      return opacity(model.vars['sa1'][d.properties.idx]);
    });



}
update.dflowfm = function() {
  if (! _.has(model, 'vars')){
    return;
  };
  var domain = [ _.min(model.vars[model.variable]),
                 _.max(model.vars[model.variable])];
  if (model.variable == 'sa1') {
    domain = [23.0, 25, 27.0];
  }

  var color = d3.scale.linear()
        .domain(domain)
        .range(['blue', 'white', 'red']);

  var opacity = d3.scale.linear()
        .domain(domain)
        .range([1.0, 0.2, 1.0]);

  d3.selectAll('#grid path')
    .style('fill', function(feature){
      if (!_.has(feature, 'id') || ! _.has(model, 'vars.' + model.variable)) {
        return 'blue';
      }
      // compute id for top layer
      // skip cells, 11 layers, select layer 10
      var idx = 4855 * 1 + feature.id*11 + 10 ;
      var value = model.vars[model.variable][idx];
      return color(value);
    })
    .style('opacity', function(feature){
      if (!_.has(feature, 'id') || ! _.has(model, 'vars.' + model.variable)) {
        return 0.0;
      }
      // compute id for top layer
      // skip cells, 11 layers, select layer 10
      var idx = 4855 * 1 + feature.id*11 + 10 ;
      var value = model.vars[model.variable][idx];
      return opacity(value);
    });
};


function closeKering(percentage) {
  // these are the cells that we'll close
  var ids = [2043, 2072, 2045, 2019, 1992, 1965, 1938, 1916, 1896];

  // depending on the %
  var levels = [1, 25, 50, 75, 100, 75, 50, 25, 1];

  // loop over all cells
  _.each(ids, function(d, i){
    // lookup bottom level
    var bl = model.vars['bl'][d];
    if (bl > 5) {
      // it was raised
      bl -= 20;
    };
    if (percentage >= levels[i] ){
      // we're raising it
      bl += 20;
      console.log('raising cell', d, 'to', bl);
    } else {
      console.log('setting cell', d, 'to', bl);
    }
    model.ws.send(JSON.stringify({
      'set_var_index': 'bl',
      'index': [d],
      'dtype': 'double',
      'shape': [1]
    }));
    model.ws.send(new Float64Array([bl]));

  });

};

function animate(){
  update.dflowfm();
  update.profile();
  window.requestAnimationFrame(animate);
}
animate();
