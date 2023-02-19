const margin = { top: 20, right: 20, bottom: 30, left: 40 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

var crimeTotalSvg = d3.select("#crime-tot")
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .attr("class", "svg-style");

var crimePackSvg = d3.select("#crime-pack")
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .attr("class", "svg-style");

var crimeCriclesSvg = d3.select("#crime-circle")
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .attr("class", "svg-style");

var neighborPick = "ALASKA JUNCTION";
var yearPick = 2008;

const parseYear = d3.timeParse("%Y");

d3.csv("https://raw.githubusercontent.com/NSC508/Datathon2023/main/data/neighborsum.csv").then(function (data) {
  const groups = d3.group(data, d => d.MCPP);

  const xScale = d3.scaleLinear()
    // .domain([new Date("2008"), new Date("2023")])
    .domain(d3.extent(data, function (d) { if (d.year >= 2008) { return d.year; } }))
    .range([10, width]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return +d.n; })])
    .range([height, 0]);

  const xAxis = d3.axisBottom(xScale)
    .tickFormat(d => d)
    .tickSizeInner(-height)
    .tickSizeOuter(0)
    .tickPadding(10);

  const yAxis = d3.axisLeft(yScale)
    .tickSizeInner(-width)
    .tickSizeOuter(0)
    .tickPadding(10);

  crimeTotalSvg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis)
    .selectAll("line")
    .attr("stroke", "lightgrey");

  crimeTotalSvg.append("g")
    // .attr("transform", "translate(0,0)")
    .call(yAxis)
    .selectAll("line")
    .attr("stroke", "lightgrey");

  const line = d3.line()
    // .x(d => xScale(parseYear(d.year)))
    .x(d => xScale(d.year))
    .y(d => yScale(d.n));

  crimeTotalSvg.selectAll('path')
    .data(groups)
    .enter()
    .append('path')
    .attr('d', d => line(d[1]))
    .attr('fill', 'none')
    .attr('stroke', (d, i) => d3.schemeCategory10[i])
    .attr('stroke-width', 2)
    .attr('class', (d) => {
      return d[0];
    })
    .style('opactiy', 0.2)
    .on("mouseover", (d) => {
      d3.select(this.parentNode).selectAll("path").style("opacity", 1);
    })
    .on("mouseout", (d) => {
      d3.select(this.parentNode).selectAll("path").style("opacity", 1);
    });
})

// d3.json("https://raw.githubusercontent.com/NSC508/Datathon2023/main/data/neighboryearoffensesum.json").then(function (data) {

//   const color = d3.scaleOrdinal(d3.schemeCategory10);

//   // Set up the pack layout
//   const pack = data => d3.pack()
//     .size([width - margin, height - margin])
//     .padding(3)
//     (d3.hierarchy(data)
//       .sum(d => d.value)
//       .sort((a, b) => b.value - a.value))

//   const root = d3.hierarchy({ children: data })
//     .sum(function (d) { return d.value; })
//     .sort(function (a, b) { return b.value - a.value; });

//   // Add the circles to the chart
//   const node = crimePackSvg.selectAll("circle")
//     .data(pack(root).descendants())
//     .enter()
//     .append("circle")
//     .attr("class", function (d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
//     .attr("fill", function (d) { return d.children ? color(d.depth) : null; })
//     .attr("stroke", "#000")
//     .attr("stroke-width", "1px")
//     .attr("cx", function (d) { return d.x; })
//     .attr("cy", function (d) { return d.y; })
//     .attr("r", function (d) { return d.r; })
//     .on("click", function (d) { return zoom(d, crimePackSvg); });

//   // Add the text labels to the chart
//   const label = crimePackSvg.selectAll("text")
//     .data(pack(root).descendants())
//     .enter()
//     .append("text")
//     .attr("class", "label")
//     .style("text-anchor", "middle")
//     .style("alignment-baseline", "middle")
//     .style("font-size", "12px")
//     .style("font-family", "sans-serif")
//     .text(function (d) { return d.data.name; })
//     .attr("x", function (d) { return d.x; })
//     .attr("y", function (d) { return d.y; });

//   // Set up the zoom behavior
//   function zoom(d, crimePackSvg) {
//     const focus0 = focus === d ? root : d;
//     const transition = svg.transition()
//       .duration(750)
//       .tween("zoom", function (d) {
//         const i = d3.interpolateZoom(view, [focus0.x, focus0.y, focus0.r * 2 + margin]);
//         return function (t) { zoomTo(i(t), crimePackSvg); };
//       });

//     label
//       .filter(function (d) { return d.parent === focus || this.style.display === "inline"; })
//       .transition(transition)
//       .style("opacity", function (d) {
//         return d.parent === focus
//           ? 1 : 0
//       })
//       .on("start", function (d) { if (d.parent === focus) this.style.display = "inline"; })
//       .on("end", function (d) { if (d.parent !== focus) this.style.display = "none"; });
//   }

//   // Zoom to a given view
//   function zoomTo(v, crimePackSvg) {
//     const k = width / v[2];
//     view = v;

//     node
//       .attr("cx", function (d) { return (d.x - v[0]) * k; })
//       .attr("cy", function (d) { return (d.y - v[1]) * k; })
//       .attr("r", function (d) { return d.r * k; });

//     label
//       .attr("x", function (d) { return (d.x - v[0]) * k; })
//       .attr("y", function (d) { return (d.y - v[1]) * k; })
//       .style("font-size", 12 * k + "px");

//     crimePackSvg.attr("transform", "translate(" + (-v[0] + margin) + "," + (-v[1] + margin) + ") scale(" + k + ")");
//   }

//   // Initialize the view
//   let focus = root;
//   let view;

//   // Zoom to the root node
//   zoomTo([root.x, root.y, root.r * 2 + margin], crimePackSvg);
// });

// d3.json("https://raw.githubusercontent.com/NSC508/Datathon2023/main/data/neighboryearoffensesum.json").then(function (data) {
//   const tooltip = d3.select("#plot2")
//     .append("div")
//     .style("opacity", 0)
//     .attr("class", "tooltip")
//     .style("background-color", "white")
//     .style("border", "solid")
//     .style("position", "absolute")
//     .style("border-width", "2px")
//     .style("border-radius", "5px")
//     .style("padding", "5px")
//     .style("width", "auto")

//   createPoints(data, yearPick, neighborPick)

//   var years = data.children
//   var neighborhoods = data.children.filter(function (d) { return d.name == 2008 })[0].children

//   var yearSelect = d3.select("#year-select")

//   yearSelect
//     .on("change", function (d) {
//       crimeCriclesSvg.html("")
//       var yearPick = d3.select(this).property("value");
//       createPoints(data, yearPick, neighborPick)
//     });


//   var yearSelect = d3.select("#year-select")
//     .selectAll("option")
//     .data(years)
//     .enter()
//     .append("option")
//     .attr("value", function (d) { return d.name; })
//     .text(function (d) { return d.name; });

//   var neighborSelect = d3.select("#neighbor-select")

//   neighborSelect
//     .on("change", function (d) {
//       crimeCriclesSvg.html("")
//       var neighborPick = d3.select(this).property("value");
//       createPoints(data, yearPick, neighborPick)
//     });

//   neighborSelect.selectAll("option")
//     .data(neighborhoods)
//     .enter()
//     .append("option")
//     .attr("value", function (d) { return d.name; })
//     .text(function (d) { return d.name; });

//   const xScale = d3.scaleLinear()
//     // .domain([new Date("2008"), new Date("2023")])
//     .domain([0, 2023])
//     .range([10, width]);

//   var size = d3.scaleLinear()
//     .domain([0, 200])
//     .range([7, 55])  // circle will be between 7 and 55 px wide

//   function createPoints(data, yearPick, neighborPick) {
//     const mouseover = function (event, d) {
//       tooltip
//         .style("visibility", "visible")
//         .style("opacity", 1)
//     }
//     const mousemove = function (event, d) {
//       const x = event.pageX;
//       const y = event.pageY;

//       tooltip
//         .html('<u>' + d.name + '</u>' + "<br>" + d.value + " counts")
//         .style("left", (x + 20) + "px")
//         .style("top", (y - 30) + "px")
//     }
//     var mouseleave = function (event, d) {
//       tooltip
//         .style("visibility", "hidden")
//         .style("opacity", 0)
//     }
//     var dataFilter = data.children.filter(function (d) { return d.name == yearPick })[0].children.filter(function (d) { return d.name == neighborPick })[0].children;

//     const size = d3.scaleLinear()
//       .domain([0, d3.max(dataFilter, d => d.value)])
//       .range([7, 55])  // circle will be between 7 and 55 px wide

//     var node = crimeCriclesSvg.append("g")
//       .selectAll("circle")
//       .data(dataFilter)
//       .enter()
//       .append("circle")
//       .attr("class", "node")
//       .attr("r", function (d) { return size(d.value) })
//       .attr("cx", width / 2)
//       .attr("cy", height / 2)
//       .style("fill", "#679f51")
//       .style("fill-opacity", 0.8)
//       .attr("stroke", "black")
//       .style("stroke-width", 1)
//       .on("mouseover", mouseover) // What to do when hovered
//       .on("mousemove", mousemove)
//       .on("mouseleave", mouseleave)
//       .call(d3.drag() // call specific function when circle is dragged
//         .on("start", dragstarted)
//         .on("drag", dragged)
//         .on("end", dragended));

//     const simulation = d3.forceSimulation()
//       .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
//       .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
//       .force("collide", d3.forceCollide().strength(.2).radius(function (d) { return (size(d.value) + 3) }).iterations(1)) // Force that avoids circle overlapping

//     // Apply these forces to the nodes and update their positions.
//     // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
//     simulation
//       .nodes(dataFilter)
//       .on("tick", function (d) {
//         node
//           .attr("cx", d => d.x)
//           .attr("cy", d => d.y)
//       });

//     // What happens when a circle is dragged?
//     function dragstarted(event, d) {
//       if (!event.active) simulation.alphaTarget(.03).restart();
//       d.fx = d.x;
//       d.fy = d.y;
//     }
//     function dragged(event, d) {
//       d.fx = event.x;
//       d.fy = event.y;
//     }
//     function dragended(event, d) {
//       if (!event.active) simulation.alphaTarget(.03);
//       d.fx = null;
//       d.fy = null;
//     }
//   }

// });

d3.csv("https://raw.githubusercontent.com/NSC508/Datathon2023/main/data/offensesum.csv").then(function (data) {
  const mouseover = function (event, d) {
    tooltip
      .style("visibility", "visible")
      .style("opacity", 1)
  }
  const mousemove = function (event, d) {
    const x = event.pageX;
    const y = event.pageY;

    tooltip
      .html('<u>' + d.name + '</u>' + "<br>" + d.value + " counts")
      .style("left", (x + 20) + "px")
      .style("top", (y - 30) + "px")
  }
  var mouseleave = function (event, d) {
    tooltip
      .style("visibility", "hidden")
      .style("opacity", 0)
  }
  const size = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.n)])
    .range([10, 13])  // circle will be between 7 and 55 px wide

  var node = crimePackSvg.append("g")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "node")
    .attr("r", function (d) { return size(d.n) })
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .style("fill", "#679f51")
    .style("fill-opacity", 0.8)
    .attr("stroke", "black")
    .style("stroke-width", 1)
    .on("mouseover", mouseover) // What to do when hovered
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
    .call(d3.drag() // call specific function when circle is dragged
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

  const simulation = d3.forceSimulation()
    .force("center", d3.forceCenter().x((width + margin.left + margin.right) / 2).y((height + margin.top + margin.bottom) / 1.6)) // Attraction to the center of the svg area
    .force("charge", d3.forceManyBody().strength(.4)) // Nodes are attracted one each other of value is > 0
    .force("collide", d3.forceCollide().strength(.2).radius(function (d) { return (size(d.n) + 2) }).iterations(1)) // Force that avoids circle overlapping

  // Apply these forces to the nodes and update their positions.
  // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
  simulation
    .nodes(data)
    .on("tick", function (d) {
      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
    });

  // What happens when a circle is dragged?
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(.03).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }
  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(.03);
    d.fx = null;
    d.fy = null;
  }
});