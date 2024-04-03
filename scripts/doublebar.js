//to set the dimensions and margins of the graph
const doubleBarMargin = {top: 25, right: 70, bottom: 40, left: 50};
const doubleBarWidth = 600 - doubleBarMargin.left - doubleBarMargin.right;
const doubleBarHeight = 400 - doubleBarMargin.top - doubleBarMargin.bottom;

//function createDoubleBarChart(data){


//to load the dataset from the provided document
d3.csv("https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv").then(data => {

    const uniqueLocations = Array.from(new Set(data.map(d => d.location))).slice(0, 7);
    uniqueLocations.splice(1, 1); // Remove the second element
    uniqueLocations.splice(3, 1); // Remove the fifth element
    const limitedData = data.filter(d => uniqueLocations.includes(d.location));
    
    // Append the SVG object to the HTML element with id 'line-vaccine-viz'
    const doubleBarSVG = d3.select("#double-bar")
        .append("svg")
        .attr("width", doubleBarWidth + doubleBarMargin.left + doubleBarMargin.right)
        .attr("height", doubleBarHeight + doubleBarMargin.top + doubleBarMargin.bottom)
        .append("g")
        .attr("transform", "translate(" + doubleBarMargin.left + "," + doubleBarMargin.top + ")");
    
    //add x-axis for location(countries)
    const xAxis = d3.scaleBand()
        .domain(limitedData.map(d => d.location))
        .range([0, doubleBarWidth])
        .padding(0.1);

    //add the y-axis on the left side for population density
    const yAxisLeft = d3.scaleLinear()
        .domain([0, d3.max(limitedData, d => d.population_density)])
        .range([doubleBarHeight, 0]);
    
    //add the y-axis on the right side for total cases
    const yAxisRight = d3.scaleLinear()
        .domain([0, d3.max(limitedData, d => d.people_fully_vaccinated)])
        .range([doubleBarHeight, 0]);
    
    // Create bars for population density
    doubleBarSVG.selectAll(".bar1")
        .data(limitedData)
        .enter().append("rect")
        .attr("class", "bar1")
        .attr("x", d => xAxis(d.location))
        .attr("width", xAxis.bandwidth() / 2)
        .attr("y", d => yAxisLeft(d.population_density))
        .attr("height", d => doubleBarHeight - yAxisLeft(d.population_density))
        .attr("fill", "steelblue");

    //Create bars for total cases
    doubleBarSVG.selectAll(".bar2")
        .data(limitedData)
        .enter().append("rect")
        .attr("class", "bar2")
        .attr("x", d => xAxis(d.location) + xAxis.bandwidth() / 2 )
        .attr("width", xAxis.bandwidth() / 2)
        .attr("y", d => yAxisRight(d.people_fully_vaccinated))
        .attr("height", d => doubleBarHeight - yAxisRight(d.people_fully_vaccinated))
        .attr("fill", "orange");
    
    // Add the X Axis
    doubleBarSVG.append("g")
        .attr("transform", "translate(0," + doubleBarHeight + ")")
        .call(d3.axisBottom(xAxis));

    // Add the left Y Axis
    doubleBarSVG.append("g")
        .call(d3.axisLeft(yAxisLeft));

    // Add the right Y Axis
    doubleBarSVG.append("g")
        .attr("transform", "translate(" + doubleBarWidth + ", 0)")
        .call(d3.axisRight(yAxisRight));


    // Add X axis label
    doubleBarSVG.append("text")
        .attr("transform", "translate(" + (doubleBarWidth / 2) + "," + (doubleBarHeight + doubleBarMargin.bottom) + ")")
        .style("text-anchor", "middle")
        .text("Countries");

    // Add left Y axis label
    doubleBarSVG.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - doubleBarMargin.left)
        .attr("x",0 - (doubleBarHeight / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Population Density (%)");

    // Add right Y axis label
    doubleBarSVG.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", doubleBarWidth + doubleBarMargin.right - 20)
        .attr("x",0 - (doubleBarHeight / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("People Fully Vaccinated");
     
})

