const width = window.innerWidth * 0.9;
const height = window.innerHeight * 0.9;

const canvas = document.querySelector('svg');
canvas.style.height = height;

fetch(
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
)
  .then(res => res.json())
  .then(data => render(data));

const render = data => {
  console.log(data);
  const margin = { top: 40, right: 20, bottom: 30, left: 50 };
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;
  const yTime = d => new Date(d.Seconds * 1000);

  const svg = d3.select('svg');

  const xScale = d3
    .scaleLinear()
    .domain([d3.min(data, d => d.Year - 1), d3.max(data, d => d.Year + 1)])
    .range([0, graphWidth]);

  const yScale = d3
    .scaleTime()
    .domain([d3.min(data, yTime), d3.max(data, yTime)])
    .range([0, graphHeight])
    .nice();

  const graph = svg.append('g').attr('id', 'graph');
  graph.attr('transform', `translate(${margin.left}, ${margin.top})`);

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format(''));
  graph
    .append('g')
    .call(xAxis)
    .attr('id', 'x-axis')
    .attr('transform', `translate(0, ${graphHeight})`);

  const yAxis = d3
    .axisLeft(yScale)
    .tickFormat(
      date =>
        `${date.getMinutes()}:${
          date.getSeconds() < 10 ? date.getSeconds() + '0' : date.getSeconds()
        }`
    );
  graph
    .append('g')
    .call(yAxis)
    .attr('id', 'y-axis');

  graph
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('data-xvalue', d => d.Year)
    .attr('data-yvalue', d => yTime(d))
    .attr('cx', d => xScale(d.Year))
    .attr('cy', d => yScale(yTime(d)))
    .attr('r', 5)
    .attr('fill', d => (d.Doping != '' ? 'red' : 'green'))
    .on('mouseover', d => showTooltip(d, xScale(d.Year)))
    .on('mouseout', d => hideTooltip(d));

  graph
    .append('text')
    .text('Doping in Professional Bicycle Racing')
    .attr('id', 'title')
    .attr('x', graphWidth / 2)
    .attr('text-anchor', 'middle');

  const legend = graph
    .append('g')
    .attr('id', 'legend')
    .attr('transform', `translate(${graphWidth * 0.75}, ${graphHeight / 4})`);

  legend.append('text').text('LEGEND:');

  legend
    .append('text')
    .text('No doping allegations')
    .attr('fill', 'green')
    .attr('y', 20);

  legend
    .append('text')
    .text('Riders with doping allegations')
    .attr('fill', 'red')
    .attr('y', 40);
};

const showTooltip = (d, x) => {
  const tooltip = document.querySelector('#tooltip');
  tooltip.style.background = d.Doping != '' ? 'red' : 'green';
  tooltip.setAttribute('data-year', d.Year);
  tooltip.innerHTML =
    `${d.Name}: ${d.Nationality.toUpperCase()}` +
    '<br />' +
    `Year: ${d.Year}, Time: ${d.Time}` +
    '<br />' +
    '<br />' +
    d.Doping;
  tooltip.style.display = 'block';
};

const hideTooltip = () => {
  const tooltip = document.querySelector('#tooltip');
  tooltip.style.display = 'none';
};
