/* eslint-disable no-shadow */
// we want to reuse vars in a function..
(function(){
  "use strict";
  // Inspired by Lee Byron's test data generator.
  var width = 300,
      height = 100;


  var svg = d3.select("#profile").append("svg")
        .attr("preserveAspectRatio", "none")
        .attr("viewBox", "0 0 " + width + " " + height);


})();
