/* eslint-disable no-unused-vars, new-cap */
(function () {
    "use strict";
    // TO DO:
    // - positioning of the whole thingie, relative to lower div.
    // - better colouring, maybe layout with image
    // - use the image of the handle for "handle"
    // - Get the percentages from the functions "on click"


    var svg = d3.select("#control").append('svg')
            .attr({
                viewBox: "-50 -50 200 200",
                id: "engineorder"
            });

    //Variables for system within circle
    var w = 120,
        h = 120,
        Y = w / 2,
        X = h / 2,
        c = X + " , " + Y,
        p1 = 0.9756 * w + "," + 0.3455 * h,
        p2 = 0.7939 * w + "," + 0.9055 * h,
        p3 = 0.2061 * w + "," + 0.9055 * h,
        p4 = 0.0244 * w + "," + 0.3455 * h,
        p5 = 0.5 * w + "," + 0 * h,
        p71 = 0.45 * w + "," + -0.25 * h,
        p72 = 0.55 * w + "," + -0.25 * h,
        p81 = 0.45 * w + "," + 0 * h,
        p82 = 0.55 * w + "," + 0 * h,
        p8 = 0.5 * w + "," + 0.1 * h,
        r = 0.5 * h;

        // t = 0.25 * w + "," + 0.25 * h;


    var labels = svg.append("g");

    labels
        .classed({labels: true});

    var path1 = labels
            .append("path")
            .attr({id: "area1", d: "M " + c + " L " + p5 + " A " + r + " , " + r + " 0 0, 1 " + p1 + " z"});
    var t1 = labels.append("text")
            .attr({x: 0.40 * w, y: 0.25 * h, transform: "rotate(36 " + c + ")"})
            .text("0%");

    var path2 = labels.append("path")
            .attr({id: "area2", d: "M " + c + " L " + p1 + " A " + r + " , " + r + " 0 0, 1 " + p2 + " z"});
    var t2 = labels.append("text")
            .attr({x: 0.4 * w, y: 0.25 * h, transform: "rotate(108 " + c + ")"})
            .text("25%");

    var path3 = labels.append("path")
            .attr({id: "area3", d: "M " + c + " L " + p2 + " A " + r + " , " + r + " 0 0, 1 " + p3 + " z"});
    var t3 = labels.append("text")
            .attr({x: 0.42 * w, y: 0.25 * h, transform: "rotate(180 " + c + ")"})
            .text("50%");

    var path4 = labels.append("path")
            .attr({id: "area4", d: "M " + c + " L " + p3 + " A " + r + " , " + r + " 0 0, 1 " + p4 + " z"});
    var t4 = labels.append("text")
            .attr({x: 0.40 * w, y: 0.25 * h, transform: "rotate(252 " + c + ")"})
            .text("75%");

    var path5 = labels.append("path")
            .attr({id: "area5", d: "M " + c + " L " + p4 + " A " + r + " , " + r + " 0 0, 1 " + p5 + " z"});
    var t5 = labels.append("text")
            .attr({x: 0.36 * w, y: 0.25 * h, transform: "rotate(324 " + c + ")"})
            .text("100%");

    var ellipse1 = svg.append("ellipse")
            .attr({rx: r, ry: r, cy: Y, cx: X, stroke: "DarkGoldenRod", "stroke-width": 4, fill: "none"} );

    var ellipse2 = svg.append("ellipse")
            .attr({rx: 5, ry: 6, cy: Y, cx: X, stroke: "DarkGoldenRod", "stroke-width": 4, fill: "black"} );

    var handlepath1 = svg.append("path")
            .attr({id: "handle1", d: "M " + p8 + "L" + p81 + "L" + p71 + "L" + p72 + "L" + p82 + " z", transform: "rotate (36 " + w / 2 + " " + h / 2 + ")", fill: "black", "stroke-width": 3 });
    handlepath1.attr({ transform: "rotate (36 " + w / 2 + " " + h / 2 + ")"});

    var handlepath = svg.append("path")
            .attr({id: "handle", transform: "rotate(0, " + c + ")", d: "M " + c + " L " + p5 + " A " + r + "," + r + " 0 0, 1 " + p1 + " z", fill: "none", stroke: "DarkGoldenRod", "stroke-width": 5});

    var handle = Snap("#handle");
    var handle1 = Snap("#handle1");
    var area = 1;

    d3.select("#area1").on("click", function(){console.log("area1");
                                               var factor = 0;
                                               if((area === 5) || (area === 2)){factor = 1; }
                                               if((area === 4) || (area === 3)){factor = 2; }
                                               area = 1;
                                               handle.animate({transform: "rotate(0, " + c + ")"}, factor * 1000, mina.bounce);
                                               handle1.animate({transform: "rotate(36, " + c + ")"}, factor * 1000, mina.bounce);
                                              });

    d3.select("#area2").on("click", function(){console.log("area25");
                                               var factor = 0;
                                               if((area === 1) || (area === 3)){factor = 1; }
                                               if((area === 4) || (area === 5)){factor = 2; }
                                               area = 2;
                                               handle.animate({transform: "rotate(72, " + c + ")"}, factor * 1000, mina.bounce);
                                               handle1.animate({transform: "rotate(108, " + c + ")"}, factor * 1000, mina.bounce);
                                              });

    d3.select("#area3").on("click", function(){console.log("area50");
                                               var factor = 0;
                                               if((area === 2) || (area === 4)){factor = 1; }
                                               if((area === 1) || (area === 5)){factor = 2; }
                                               area = 3;
                                               handle.animate({transform: "rotate(144, " + c + ")"}, factor * 1000, mina.bounce);
                                               handle1.animate({transform: "rotate(180, " + c + ")"}, factor * 1000, mina.bounce);
                                              });

    d3.select("#area4").on("click", function(){console.log("area75");
                                               var factor = 0;
                                               if((area === 3) || (area === 5)){factor = 1; }
                                               if((area === 2) || (area === 1)){factor = 2; }
                                               area = 4;
                                               handle.animate({transform: "rotate(216, " + c + ")"}, factor * 1000, mina.bounce);
                                               handle1.animate({transform: "rotate(252, " + c + ")"}, factor * 1000, mina.bounce);
                                              });

    d3.select("#area5").on("click", function(){console.log("area100");
                                               var factor = 0;
                                               if((area === 1) || (area === 4)){factor = 1; }
                                               if((area === 2) || (area === 3)){factor = 2; }
                                               area = 5;
                                               handle.animate({transform: "rotate(288, " + c + ")"}, factor * 1000, mina.bounce);
                                               handle1.animate({transform: "rotate(324, " + c + ")"}, factor * 1000, mina.bounce);
                                              });

}());
