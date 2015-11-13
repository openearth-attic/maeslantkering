// TO DO:
// - positioning of the whole thingie, relative to lower div.
// - better colouring, maybe layout with image 
// - use the image of the handle for "handle"
// - Get the percentages from the functions "on click"


var svg = d3.select("#control").append('svg')
        .attr({width: 200, height: 200, transform: "translate(50,50)"});

//Variables for system within circle
var w = 120,
    h = 120,
    Y = w / 2,
    X = h / 2,
    c =  X + " , " + Y ,
    p1 = 0.9756 * w + "," + 0.3455 * h,
    p2 = 0.7939 * w + "," + 0.9055 * h,
    p3 = 0.2061 * w + "," + 0.9055 * h,
    p4 = 0.0244 * w + "," + 0.3455 * h,
    p5 = 0.5 * w + "," + 0 * h,
    p6 = 0.5 * w + "," + -0.3*h,
    r =  0.5 * h,
    t = 0.25 * w + "," + 0.25 * h;
    
var handle1 = svg.append("path")
        .attr({rx: 10, id: "handle1", d: "M " + p5 + "L" + p6 + "z", stroke: "black", "stroke-width": 10});
handle1.attr({ transform: "rotate (36 " + w/2 + " " + h/2 + ")"});

var path1 = svg.append("path")
    .attr({id: "area1", d: "M " + c + " L " + p5 + " A "+ r + " , "+ r + " 0 0, 1 " + p1 + " z",stroke: "none", fill: "MintCream"});
var t1 = svg.append("text")
        .attr({x : 0.40*w, y:  0.25*h, transform: "rotate(36 " + c + ")"})
        .text("0%");

var path2 = svg.append("path")
    .attr({id: "area2", d: "M " + c + " L " + p1 + " A "+ r + " , "+ r + " 0 0, 1 " + p2 + " z",stroke: "none", fill: "MintCream"});
var t2 = svg.append("text")
        .attr({x : 0.4*w, y:  0.25*h, transform: "rotate(108 " + c + ")"})
        .text("25%"); 

var path3 = svg.append("path")
    .attr({id: "area3", d: "M " + c + " L " + p2 + " A "+ r + " , "+ r + " 0 0, 1 " + p3 +" z",stroke: "none", fill: "MintCream"});
var t3 = svg.append("text")
        .attr({x : 0.42*w, y:  0.25*h, transform: "rotate(180 " + c + ")"})
        .text("50%");

var path4 = svg.append("path")
    .attr({id: "area4", d: "M " + c + " L " + p3 + " A "+ r + " , "+ r + " 0 0, 1 "+ p4 +" z",stroke: "none", fill: "MintCream"});
var t4 = svg.append("text")
        .attr({x : 0.40*w, y:  0.25*h, transform: "rotate(252 " + c + ")"})
        .text("75%");

var path5 = svg.append("path")
    .attr({id: "area5", d: "M " + c + " L " + p4 + " A "+ r + " , "+ r + " 0 0, 1 "+ p5 + " z", stroke: "none", fill: "MintCream"});
var t5 = svg.append("text")
        .attr({x : 0.40*w, y:  0.25*h, transform: "rotate(324 " + c + ")"})
        .text("100%");
var ellipse = svg.append("ellipse")
    .attr({rx: r , ry: r , cy: Y, cx: X, stroke: "DarkGoldenRod", "stroke-width": 4, fill: "none"} );

var handle = svg.append("path")
    .attr({id: "handle", transform: "rotate(0, " + c + ")",d: "M " + c + " L " + p5 + " A " + r + "," + r + " 0 0, 1 " + p1 +" z", fill: "none", stroke:"DarkGoldenRod", "stroke-width": 5});

var handle = Snap("#handle");
var handle1 = Snap("#handle1");
var area = 1;

d3.select("#area1").on("click", function(){console.log("area1");
    var factor = 0;
    if((area === 5) || (area === 2)){factor = 1;};
    if((area === 4) || (area === 3)){factor = 2;};
    area = 1;
    handle.animate({transform: "rotate(0, " + c + ")"}, factor * 1000);
    handle1.animate({transform: "rotate(36, " + c + ")"}, factor * 1000);
    });
    
d3.select("#area2").on("click", function(){console.log("area25");
    var factor = 0;
    if((area === 1) || (area === 3)){factor = 1;};
    if((area === 4) || (area === 5)){factor = 2;};
    area = 2;
    handle.animate({transform: "rotate(72, " + c + ")"}, factor*1000);
    handle1.animate({transform: "rotate(108, " + c + ")"}, factor * 1000);
    });

d3.select("#area3").on("click", function(){console.log("area50");
    var factor = 0;
    if((area === 2) || (area === 4)){factor = 1;};
    if((area === 1) || (area === 5)){factor = 2;};
    area = 3;
    handle.animate({transform: "rotate(144, " + c + ")"}, factor*1000);
    handle1.animate({transform: "rotate(180, " + c + ")"}, factor * 1000);
    });
 
d3.select("#area4").on("click", function(){console.log("area75");
    var factor = 0;
    if((area === 3) || (area === 5)){factor = 1;};
    if((area === 2) || (area === 1)){factor = 2;};
    area = 4;
    handle.animate({transform: "rotate(216, " + c + ")"}, factor*1000);
    handle1.animate({transform: "rotate(252, " + c + ")"}, factor * 1000);
    });

d3.select("#area5").on("click", function(){console.log("area100");
    var factor = 0;
    if((area === 1) || (area === 4)){factor = 1;};
    if((area === 2) || (area === 3)){factor = 2;};
    area = 5;
    handle.animate({transform: "rotate(288, " + c + ")"}, factor*1000);
    handle1.animate({transform: "rotate(324, " + c + ")"}, factor * 1000);
    });
