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
    .attr("width", svgWidth);

  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  d3.csv("assets/data/data.csv").then(function(trendData) {

    trendData.forEach(function(data) {
      data.healthcare = +data.healthcare;
      data.poverty = +data.poverty;
    });

    var xLinearScale = d3.scaleLinear()
      .domain(d3.extent(trendData, d => d.healthcare))
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(trendData, d => d.poverty)])
      .range([height, 0]);

    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale).ticks(6);

    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    chartGroup.append("g")
      .call(yAxis);

    var line = d3.line()
      .x(d => xTimeScale(d.healthcare))
      .y(d => yLinearScale(d.poverty));

    chartGroup.append("path")
      .data([trendData])
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "red");

    var circlesGroup = chartGroup.selectAll("circle")
      .data(medalData)
      .enter()
      .append("circle")
      .attr("cx", d => xTimeScale(d.healthcare))
      .attr("cy", d => yLinearScale(d.poverty))
      .attr("r", "10")
      .attr("fill", "gold")
      .attr("stroke-width", "1")
      .attr("stroke", "black");

    var toolTip = d3.select("body")
      .append("div")
      .classed("tooltip", true);

    circlesGroup.on("mouseover", function(d) {
      toolTip.style("display", "block")
          .html(
            `<strong>${d.healthcare}<strong><hr>${d.poverty}
        medal(s) won`)
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY + "px");
    })
      .on("mouseout", function() {
        toolTip.style("display", "none");
      });

  }).catch(function(error) {
    console.log(error);
  });
}

makeResponsive();

d3.select(window).on("resize", makeResponsive);
