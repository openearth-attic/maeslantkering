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
    connect(model);
    setTimeout(function(){
      console.log('play')
      model.ws.send(JSON.stringify({"remote": "play"}));
      model.ws.send(JSON.stringify({
        'set_var_index': 'sa1',
        'index': [50],
        'dtype': 'double',
        'shape': [1]
      }));
      model.ws.send(new Float64Array([22]));
    }, 1000);
    setTimeout(function(){
      console.log('pause');
      model.ws.send(JSON.stringify({"remote": "pause"}));

    }, 5000);

  });

var update = {};
update.dflowfm = function() {
  if (! _.has(model, 'vars')){
    return;
  };
  var color = d3.scale.linear()
        .domain([ _.min(model.vars.sa1), _.max(model.vars.sa1)])
        .range(['red', 'green']);
  console.log(_.min(model.vars.sa1), _.max(model.vars.sa1));

  d3.selectAll('#grid path')
    .style('fill', function(feature){
      if (!_.has(feature, 'id') || ! _.has(model, 'vars.sa1')) {
        return 'blue';
      }
      var value = model.vars.sa1[feature.id];
      return color(value);
    });
};

function animate(){
  console.log('animating');
  update.dflowfm();
  window.requestAnimationFrame(animate);
}
