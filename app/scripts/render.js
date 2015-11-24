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
    model.variable = 'bl';

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
        .domain([ _.min(model.vars[model.variable]), _.max(model.vars[model.variable])])
        .range(['red', 'green']);
  console.log(_.min(model.vars[model.variable]), _.max(model.vars[model.variable]));

  d3.selectAll('#grid path')
    .style('fill', function(feature){
      if (!_.has(feature, 'id') || ! _.has(model, 'vars.' + model.variable)) {
        return 'blue';
      }
      var value = model.vars[model.variable][feature.id];
      return color(value);
    });
};

function animate(){
  console.log('animating');
  update.dflowfm();
  window.requestAnimationFrame(animate);
}
