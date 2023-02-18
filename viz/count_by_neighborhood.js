const margin = { top: 20, right: 20, bottom: 30, left: 40 };
const width = 500 - margin.left - margin.right;
const height = 300 - margin.top - margin.bottom;

var svg = d3.select("#count-by-neighbor")
  .append('svg')
  .attr('width', 500)
  .attr('height', 300);

d3.csv("../data/neighborsum.csv").then(function (data) {
  const groups = d3.group(data, d => d.MCPP);

  const xScale = d3.scaleLinear()
    .domain([2008, 2023])
    .range([50, 250]);

  const yScale = d3.scaleLinear()
    .domain([0, 7036])
    .range([150, 50]);

  const line = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.n));

  svg.selectAll('path')
    .data(groups)
    .enter()
    .append('path')
    .attr('d', d => line(d[1]))
    .attr('fill', 'none')
    .attr('stroke', (d, i) => d3.schemeCategory10[i])
    .attr('stroke-width', 2);
})