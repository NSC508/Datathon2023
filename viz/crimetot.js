const margin = { top: 20, right: 20, bottom: 30, left: 40 };
const width = 500 - margin.left - margin.right;
const height = 300 - margin.top - margin.bottom;

var crimeTotalSvg = d3.select("#crime-tot")
  .append('svg')
  .attr('width', 500)
  .attr('height', 300);

var crimePackSvg = d3.select("#crime-pack")
  .append('svg')
  .attr('width', 500)
  .attr('height', 300);

const parseYear = d3.timeParse("%Y");

d3.csv("https://raw.githubusercontent.com/NSC508/Datathon2023/main/data/neighborsum.csv").then(function (data) {
  const groups = d3.group(data, d => d.MCPP);

  const xScale = d3.scaleLinear()
    // .domain([new Date("2008"), new Date("2023")])
    .domain([2008, 2023])
    .range([10, width]);

  const yScale = d3.scaleLinear()
    .domain([0, 7036])
    .range([height, 0]);

  const xAxis = d3.axisBottom(xScale)
    // .tickFormat(d3.timeFormat("%Y"))
    .tickSizeInner(-height)
    .tickSizeOuter(0)
    .tickPadding(10);

  const yAxis = d3.axisLeft(yScale)
    .tickSizeInner(-width)
    .tickSizeOuter(0)
    .tickPadding(10);

  crimeTotalSvg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("line")
    .attr("stroke", "lightgrey");;

  crimeTotalSvg.append("g")
    .call(yAxis)
    .selectAll("line")
    .attr("stroke", "lightgrey");;

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
    .style('opactiy', 0.2)
    .on("mouseover", (d) => {
      d3.select(this)
        .style('opacity', 1)
    })
    .on("mouseout", (d) => {
      d3.select(this)
        .style('opacity', 0.2)
    });
})

d3.json("https://raw.githubusercontent.com/NSC508/Datathon2023/main/data/neighboryearoffensesum.json").then(function (data) {
  
  const hierarchy = d3.hierarchy(data)
    .sum(d => d.n);

  const pack = d3.pack()
    .size([svg.attr("width"), svg.attr("height")])
    .padding(5);

  const nodes = svg.selectAll("circle")
    .data(rootNode.descendants())
    .join("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", d => d.r)
    .attr("fill", "steelblue")
    .attr("cursor", "pointer")
    .on("click", d => console.log("Clicked", d.data.name));
})