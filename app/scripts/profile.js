var n = 5, // number of layers
    m = 200, // number of samples per layer
    stack = d3.layout.stack(), // .offset("wiggle"),
    layers = stack(d3.range(n).map(function() { return bumpLayer(m); }));

var width = 300,
    height = 100;

var x = d3.scale.linear()
        .domain([0, m - 1])
        .range([0, width]);

var y = d3.scale.linear()
        .domain([
            d3.max(
                layers, function(layer) {
                    return d3.max(layer, function(d) { return d.y + d.y0; });
                }) * 1.5,
            0
        ])
        .range([height, 0]);

var color = d3.scale.linear()
        .range(["#bdd", "#57d"]);

var area = d3.svg.area()
        .x(function(d) { return x(d.x); })
        .y0(function(d) { return y(d.y0); })
        .y1(function(d) { return y(d.y + d.y0); });

var svg = d3.select("#profile").append("svg")
        .attr("preserveAspectRatio", "none")
        .attr("viewBox", "0 0 " + width + " " + height);

svg.selectAll("path")
    .data(layers)
    .enter().append("path")
    .attr("d", area)
    .style("fill", function(d, i) { return color(i/5); });

function transition() {
    var layers = stack(d3.range(n).map(function() {
        var layer = bumpLayer(m);
        return layer;
    }));
    d3.selectAll("#profile path")
        .data(layers)
        .transition()
        .duration(5000)
        .attr("d", area);
}

// Inspired by Lee Byron's test data generator.
function bumpLayer(n) {

    function bump(a) {
        var x = 1 / (.1 + Math.random()),
            y = 2 * Math.random() - 0.5,
            z = 3 / (.1 + Math.random());
        for (var i = 0; i < n; i++) {
            var w = (i / n - y) * z;
            a[i] += x * Math.exp(-w * w);
        }
    }

    var a = [], i;
    for (i = 0; i < n; ++i) a[i] = 0;
    for (i = 0; i < 5; ++i) bump(a);

    return a.map(function(d, i) { return {x: i, y: Math.max(0, d)}; });
}

setInterval(transition, 5000);
