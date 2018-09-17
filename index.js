const width = 550;
const height = width;
const margin = { top: 20, right: 20, bottom: 20, left: 20 },
    innerWidth = width - margin.left - margin.right,
    innerHeight = height - margin.top - margin.bottom,
    radius = innerWidth / 2,
    cornerRadius = 19,
    padAngle = 0;

var colorValue = d => d.Name;

var arc = d3.arc()
    .outerRadius(radius)
    .innerRadius(0)
    .cornerRadius(cornerRadius);

var labelArc = d3.arc()
    .outerRadius(radius / 3 * 2)
    .innerRadius(radius / 3 * 2);

var color = d3.scaleOrdinal(d3.schemeCategory10);



var hover = d3.select("body").append("div")
    .style("position", "absolute")
    .style("background", "#b3e7ff")
    .style("padding", "5 15px")
    .style("border", "1px #333 solid")
    .style("border-radius", "5px")
    .style("opacity", "0")
    .style("z-index", 1);



function render(data, sliceValue, title) {

    var pie = d3.pie()
        .value(sliceValue)
        .padAngle(padAngle);

    var div = d3.select("body")
        .append("div")
        .attr("class", "pie")
        .attr("width", window.screen.availWidth)
        .attr("height", window.screen.availwidth);

    div.append("h2")
        .text(title);

    var svg = div.append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    d3.select(".Explanations").selectAll("h3")
        .data(data)
        .enter()
        .append("h3")
        .text(d => colorValue(d))
        .append("svg")
        .attr("width", "20")
        .attr("height", "20")
        .attr("transform", "translate(5,5)")
        .append("circle")
        .attr("r", 10)
        .attr("fill", d => color(colorValue(d)))
        .attr("transform", "translate(10,10)")
        .attr("display", "block")
        .attr("opacity",0.75);


    //group arcs
    var g = svg.selectAll("arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "arc");

    //append path of arcs
    g.append("path")
        .attr("d", arc)
        .style("fill", d => color(colorValue(d.data)))
        .on("mouseover", function (d) {
            hover.transition()
                .style("opacity", 1);
            hover.html(colorValue(d.data))
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY) + "px");
            d3.select(this)
                .style("opacity", 0.5)
                .style("stroke-width", "8px")
        })
        .on("mouseout", function () {
            hover.transition()
                .style("opacity", 0);
            d3.select(this)
                .style("opacity", 1)
                .style("stroke-width", "4px");
        })
        .transition()
        .ease(d3.easeQuad)
        .duration("1300")
        .attrTween("d", pieTween);

    //append labels
    g.append("text")
        .style("opacity", 0)
        .attr("font-size",14)
        .transition()
        .ease(d3.easeQuad)
        .duration("1800")
        .style("opacity",1)
        .attr("transform", d => "translate(" + labelArc.centroid(d) + ")")
        .attr("font-size", 18)
        .text(function (d) {
            if (sliceValue(d.data) != 0)
                return sliceValue(d.data);
            else
                return null;
        });

}

d3.json("developers.json").then(function (data) {
    var sliceValue = d => d.Defects;
    render(data, sliceValue, "Defects assigned");
    sliceValue = d => d.UserStories;
    render(data, sliceValue, "User Stories assigned");
    sliceValue = d => d.DefectsDone;
    render(data, sliceValue, "Defects finished");
    sliceValue = d => d.USDone;
    render(data, sliceValue, "User Stories finished");
    sliceValue = d => d.DefectsToDo;
    render(data, sliceValue, "Remaining Defects");
    sliceValue = d => d.USToDo;
    render(data, sliceValue, "Remaining User Stories");
    sliceValue = d => d.Effort;
    render(data, sliceValue, "Effort done");
});


function pieTween(b) {
    b.innerRadius = 0;
    var i = d3.interpolate({ startAngle: 0, endAngle: 0 }, b);
    return function (t) { return arc(i(t)); };
}