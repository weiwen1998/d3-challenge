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

  // var chartGroup = svg.append("g")
  //   .attr("transform", `translate(${margin.left}, ${margin.top})`);

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
      .domain([0, d3.max(trendData, d => d.healthcare)])
      .range([height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));
    
    // var xAxis = d3.axisBottom(xLinearScale);
    // var yAxis = d3.axisLeft(yLinearScale).ticks(6);

    // chartGroup.append("g")
    //   .attr("transform", `translate(0, ${height})`)
    //   .call(xAxis);

    // chartGroup.append("g")
    //   .call(yAxis);

    // var scatter = d3.scaleLinear()
    //   .x(d => x(d.poverty))
    //   .y(d => y(d.healthcare));

    // chartGroup.append("path")
    //   .data([trendData])
    //   .attr("d", scatter)
    //   .attr("fill", "none")
    //   .attr("stroke", "red");

    // var circlesGroup = 
    svg.append('g')
      .selectAll("dot")
      .data(trendData)
      .enter()
      .append("circle")
      .attr("cx", function (d) {return x(d.poverty);})
      .attr("cy", function (d) {return y(d.healthcare);})
      .attr("r", "1.5")
      .attr("fill", "pink")
      .style("fill", "#69b3a2")


    // var toolTip = d3.select("body")
    //   .append("div")
    //   .classed("tooltip", true);

    // circlesGroup.on("mouseover", function(d) {
    //   toolTip.style("display", "block")
    //       .html(
    //         `<strong>${d.poverty}<strong><hr>${d.healthare}
    //     medal(s) won`)
    //       .style("left", d3.event.pageX + "px")
    //       .style("top", d3.event.pageY + "px");
    // })
    //   .on("mouseout", function() {
    //     toolTip.style("display", "none");
    //   });

  }).catch(function(error) {
    console.log(error);
  });
}

makeResponsive();

d3.select(window).on("resize", makeResponsive);

