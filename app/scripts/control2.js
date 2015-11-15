(function () {
    "use strict";
    var width = 100,
        height = 100,
        radius = Math.min(width, height) / 2;

    var svg = d3.select("#control").append('svg')
            .attr({
                viewBox: "0 0 100 100",
                id: "engineorder"
            });

    // define an arc function
    var arc = d3.svg.arc()
            .outerRadius(radius - 10)
            .innerRadius(0);

    // create a pie layout
    var pie = d3.layout.pie()
            .value(function(x){ return x.value; });

    var data = [
        {
            label: "0%",
            value: 1
        },
        {
            label: "25%",
            value: 1
        },
        {
            label: "50%",
            value: 1
        },
        {
            label: "75%",
            value: 1
        },
        {
            label: "100%",
            value: 1
        }
    ];
    var g = svg.selectAll(".arc")
            .data(pie(data))
            .enter()
            .append("g")
            .classed({arc: true})
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    g.
        append("path")
        .attr("d", arc);

    g.append("text")
        .attr("transform", function(d) {
            return "translate(" + arc.centroid(d) + ")";
        })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .text(function(d) {
            console.log(d);
            return d.data.label;
        });

}());
