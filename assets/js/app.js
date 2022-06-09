function makeResponsive() {

  var svgArea = d3.select("body").select("svg");

  if (!svgArea.empty()) {
    svgArea.remove();
  }

  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight;

  var margin = {
    top: 50,
    bottom: 50,
    right: 50,
    left: 50
  };

  var height = svgHeight - margin.top - margin.bottom;
  var width = svgWidth - margin.left - margin.right;

  var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  d3.csv("assets/data/data.csv").then(function(trendData) {

    trendData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });

    var x = d3.scaleLinear()
      .domain(d3.extent(trendData, d => d.poverty))
      .range([0, width]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    var y = d3.scaleLinear()
      .domain(d3.extent(trendData, d => d.healthcare))
      .range([height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));
    
    svg.append('g')
      .selectAll("dot")
      .data(trendData)
      .enter()
      .append("circle")
      .attr("cx", function (d) {return x(d.poverty);})
      .attr("cy", function (d) {return y(d.healthcare);})
      .attr("r", "15")
      .attr("fill", "red")
      .attr("opacity", "0.5")

      svg.append('g')
      .selectAll("dot")
      .data(trendData)
      .enter()
      .append("text")
      .attr("x", function (d) {return x(d.poverty);})
      .attr("y", function (d) {return y(d.healthcare);})
      .attr("fill", "black")
      .attr("opacity", "0.75")
      .text(function (d) {return d.abbr})
      .attr("dx", -10)
      .attr("dy", 7)

    chartGroup.append("text")
    .attr("class", "y label")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left - 20)
    .attr("x", 0 - (height / 2))
    .text("Healthcare");

    chartGroup.append("text")
      .attr("class", "x label")
      .attr("transform", `translate(${width / 2}, ${height + margin.top - 70})`)
      .text("Poverty");
  
  }).catch(function(error) {
    console.log(error);
  });
}

makeResponsive();

d3.select(window).on("resize", makeResponsive);

