// Set dimensions and margins
const stackedBarMargin = {top: 50, right: 70, bottom: 45, left: 70};
const stackedBarWidth = 700 - stackedBarMargin.left - stackedBarMargin.right;
const stackedBarHeight = 400 - stackedBarMargin.top - stackedBarMargin.bottom;

function stackBarGraph(data) {
    // Append SVG container
    const stackedBarSVG = d3.select("#chart-container")
        .append("svg")
        .attr("width", stackedBarWidth + stackedBarMargin.left + stackedBarMargin.right)
        .attr("height", stackedBarHeight + stackedBarMargin.top + stackedBarMargin.bottom)
        .append("g")
        .attr("transform", "translate(" + stackedBarMargin.left + "," + stackedBarMargin.top + ")");

        
    // d3.csv("https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv").then(data => {
        
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
            .attr("fill", "#FDD4A9")
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
            .attr("fill", "#CF5F00")
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
            .text("Country");

        // Add X axis labels
        stackedBarSVG.append("text")
            .attr("transform", "translate(" + (stackedBarWidth / 2) + "," + (stackedBarHeight + stackedBarMargin.bottom) + ")")
            .style("text-anchor", "middle")
            .text("Total cases per million");

        // stackedBarSVG.append("text")
        //     .attr("transform", "translate(" + (stackedBarWidth / 2) + "," + (stackedBarHeight + stackedBarMargin.bottom + 20) + ")")
        //     .style("text-anchor", "middle")
        //     .text("Total Cases per Million");

        stackedBarSVG.append("text")
            .attr("transform", "translate(" + (stackedBarWidth / 2 ) + "," + (stackedBarMargin.top - 80) + ")")
            .style("text-anchor", "middle")
            .text("Total population density");
        // });
    }

    // Function to update stacked bar chart with selected countries
    function updateStackedBarChart(selectedCountries) {
        // Filter data for selected countries
        const filteredData = data.filter(d => selectedCountries.includes(d.location));

        // Update stacked bar chart with filtered data
        stackBarGraph(filteredData);   

    }


    // // Sample data (replace with your actual data)
    // const data = [
    //     { location: "Country A", population_density: 100, total_deaths_per_million: 500 },
    //     { location: "Country B", population_density: 200, total_deaths_per_million: 700 },
    //     { location: "Country C", population_density: 150, total_deaths_per_million: 600 },
    //     { location: "Country D", population_density: 300, total_deaths_per_million: 800 },
    //     { location: "Country E", population_density: 250, total_deaths_per_million: 900 }
    // ];

    // Call the initial stacked bar chart function with sample data
    stackBarGraph(filteredData);

