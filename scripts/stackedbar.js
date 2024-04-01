// Set dimensions and margins
const stackedBarMargin = {top: 25, right: 70, bottom: 40, left: 50};
const stackedBarWidth = 600 - stackedBarMargin.left - stackedBarMargin.right;
const stackedBarHeight = 400 - stackedBarMargin.top - stackedBarMargin.bottom;

function stackBarGraph(data) {
    // Append SVG container
    const stackedBarSVG = d3.select("#chart-container")
        .append("svg")
        .attr("width", stackedBarWidth + stackedBarMargin.left + stackedBarMargin.right)
        .attr("height", stackedBarHeight + stackedBarMargin.top + stackedBarMargin.bottom)
        .append("g")
        .attr("transform", "translate(" + stackedBarMargin.left + "," + stackedBarMargin.top + ")");

    // Define scales
    const yScale = d3.scaleBand()
        .domain(data.map(d => d.location))
        .range([0, stackedBarHeight])
        .padding(0.1);

    const xAxisTop = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.population_density)])
        .range([0, stackedBarWidth]);

    const xAxisBottom = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.total_deaths_per_million)])
        .range([0, stackedBarWidth]);
    
    // Create stacked bars
    stackedBarSVG.selectAll(".stacked-bar-total-population_density")
        .data(data)
        .enter().append("rect")
        .attr("class", "stacked-bar-total-population_density")
        .attr("x", 0)
        .attr("y", d => yScale(d.location))
        .attr("width", d => xAxisTop(d.population_density))
        .attr("height", yScale.bandwidth())
        .attr("fill", "steelblue")
        .append("title")
        .text(d => `Location: ${d.location}\nTotal population_density: ${d.population_density}\nTotal Cases per Million: ${d.total_deaths_per_million}`);

    stackedBarSVG.selectAll(".stacked-bar-total-cases-per-million")
        .data(data)
        .enter().append("rect")
        .attr("class", "stacked-bar-total-cases-per-million")
        .attr("x", 0)
        .attr("y", d => yScale(d.location))
        .attr("width", d => xAxisBottom(d.total_deaths_per_million))
        .attr("height", yScale.bandwidth())
        .attr("fill", "orange")
        .append("title")
        .text(d => `Location: ${d.location}\nTotal population_density: ${d.population_density}\nTotal Cases per Million: ${d.total_deaths_per_million}`);

    // Add axes and labels
    stackedBarSVG.append("g")
        .call(d3.axisLeft(yScale));

    const xAxisTopGroup = stackedBarSVG.append("g")
        .attr("transform", "translate(0, 0)")
        .call(d3.axisTop(xAxisTop));

    const xAxisBottomGroup = stackedBarSVG.append("g")
        .attr("transform", "translate(0," + stackedBarHeight + ")")
        .call(d3.axisBottom(xAxisBottom));

    // Add Y axis label
    stackedBarSVG.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - stackedBarMargin.left)
        .attr("x",0 - (stackedBarHeight / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Location");

    // Add X axis labels
    stackedBarSVG.append("text")
        .attr("transform", "translate(" + (stackedBarWidth / 2) + "," + (stackedBarHeight + stackedBarMargin.bottom) + ")")
        .style("text-anchor", "middle")
        .text("Value");

    stackedBarSVG.append("text")
        .attr("transform", "translate(" + (stackedBarWidth / 2) + "," + (stackedBarHeight + stackedBarMargin.bottom + 20) + ")")
        .style("text-anchor", "middle")
        .text("Total Cases per Million");

    stackedBarSVG.append("text")
        .attr("transform", "translate(" + (stackedBarWidth / 2) + "," + (stackedBarHeight + stackedBarMargin.bottom + 40) + ")")
        .style("text-anchor", "middle")
        .text("Total population_density");
};
