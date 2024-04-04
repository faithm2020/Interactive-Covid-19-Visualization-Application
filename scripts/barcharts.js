//to set the dimensions and margins of the graph
const doubleBarMargin = {top: 25, right: 85, bottom: 45, left: 70};
const doubleBarWidth = 700 - doubleBarMargin.left - doubleBarMargin.right;
const doubleBarHeight = 350 - doubleBarMargin.top - doubleBarMargin.bottom;

const stackedBarMargin = {top: 50, right: 70, bottom: 45, left: 90};
const stackedBarWidth = 700 - stackedBarMargin.left - stackedBarMargin.right;
const stackedBarHeight = 350 - stackedBarMargin.top - stackedBarMargin.bottom;


const defaultSelectedCountries = ["United States", "Belgium", "Brazil","United Kingdom"];

function barCharts(){
    //to load the dataset from the provided document
    d3.csv("https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv").then(data => {

    // Check box connected to both of the graphs

    const uniqueLocations = Array.from(new Set(data.map(d => d.location)));
        //uniqueLocations.splice(1, 1); // Remove the second element
        //uniqueLocations.splice(3, 1); // Remove the fifth element
        //const limitedData = data.filter(d => uniqueLocations.includes(d.location));
    
    // Create checkboxes for each country
    const checkboxesDiv = d3.select("#countryCheckboxes");
    uniqueLocations.forEach(location => {
        const checkbox = checkboxesDiv.append("div").attr("class", "checkbox");
        checkbox.append("input")
            .attr("type", "checkbox")
            .attr("id", location)
            .attr("value", location)
            .property("checked", defaultSelectedCountries.includes(location));
        checkbox.append("label")
            .attr("for", location)
            .text(location);
    });
  
    //
    //
    // ------- CODE FOR THE DOUBLE BAR CHART
    //
    //
    // Append tooltip div
    const doubleBarTooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("pointer-events", "none")
        .style("background-color", "white")
        .style("padding", "5px")
        .style("border", "1px solid #ddd")
        .style("box-shadow", "0 0 5px rgba(0, 0, 0, 0.1)");

    // Function to show tooltip
    function showTooltipDoubleBar(event, d) {
        const tooltipWidth = parseFloat(doubleBarTooltip.style("width"));
        const tooltipHeight = parseFloat(doubleBarTooltip.style("height"));
        const mouseX = event.pageX;
        const mouseY = event.pageY;

        doubleBarTooltip.transition()
            .duration(200)
            .style("opacity", .9)
            .style("left", (mouseX + 10) + "px")
            .style("top", (mouseY - tooltipHeight - 10) + "px");

        doubleBarTooltip.html(`Location: ${d.location}<br>Population Density: ${d.population_density}<br>People Fully Vaccinated: ${d.people_fully_vaccinated}`);
    }

    // Function to hide tooltip
    function hideTooltipDoubleBar() {
        doubleBarTooltip.transition()
            .duration(500)
            .style("opacity", 0);
    }

    function updateDoubleBarChart() {
        const selectedCountries = [];
        d3.selectAll("input[type=checkbox]:checked").each(function() {
            selectedCountries.push(this.value);
        });
    
        const filteredData = data.filter(d => selectedCountries.includes(d.location));
    
        // Clear the existing graph
        d3.select("#double-bar").selectAll("*").remove();
    
        // Append the SVG object to the HTML element with id 'line-vaccine-viz'
        const doubleBarSVG = d3.select("#double-bar")
            .append("svg")
            .attr("width", doubleBarWidth + doubleBarMargin.left + doubleBarMargin.right)
            .attr("height", doubleBarHeight + doubleBarMargin.top + doubleBarMargin.bottom)
            .append("g")
            .attr("transform", "translate(" + doubleBarMargin.left + "," + doubleBarMargin.top + ")");
    
        //add x-axis for location(countries)
        const xAxis = d3.scaleBand()
            .domain(filteredData.map(d => d.location))
            .range([0, doubleBarWidth])
            .padding(0.1);
    
        //add the y-axis on the left side for population density
        const yAxisLeft = d3.scaleLinear()
            .domain([0, d3.max(filteredData, d => d.population_density)])
            .range([doubleBarHeight, 0]);
    
        //add the y-axis on the right side for total cases
        const yAxisRight = d3.scaleLinear()
            .domain([0, d3.max(filteredData, d => d.people_fully_vaccinated)])
            .range([doubleBarHeight, 0]);
    
        // Create bars for population density
        doubleBarSVG.selectAll(".bar1")
            .data(filteredData)
            .enter().append("rect")
            .attr("class", "bar1")
            .attr("x", d => xAxis(d.location))
            .attr("width", xAxis.bandwidth() / 2)
            .attr("y", doubleBarHeight) // Initial position at the bottom
            .attr("height", 0) // Initial height of 0
            .attr("fill", "#FDD4A9")
            .on("mouseover", showTooltipDoubleBar)
            .on("mouseout", hideTooltipDoubleBar)
            .merge(doubleBarSVG.selectAll(".bar1")) // Merge new and existing elements
            .transition() // Apply transition
            .duration(500) // Animation duration
            .attr("y", d => yAxisLeft(d.population_density))
            .attr("height", d => doubleBarHeight - yAxisLeft(d.population_density))
            .select("title")
            .text(d => `Location: ${d.location}\nPopulation_density: ${d.population_density}`);
    
        // Create bars for total cases
        doubleBarSVG.selectAll(".bar2")
            .data(filteredData)
            .enter().append("rect")
            .attr("class", "bar2")
            .attr("x", d => xAxis(d.location) + xAxis.bandwidth() / 2)
            .attr("width", xAxis.bandwidth() / 2)
            .attr("y", doubleBarHeight) // Initial position at the bottom
            .attr("height", 0) // Initial height of 0
            .attr("fill", "#CF5F00")
            .on("mouseover", showTooltipDoubleBar)
            .on("mouseout", hideTooltipDoubleBar)
            .merge(doubleBarSVG.selectAll(".bar2")) // Merge new and existing elements
            .transition() // Apply transition
            .duration(500) // Animation duration
            .attr("y", d => yAxisRight(d.people_fully_vaccinated))
            .attr("height", d => doubleBarHeight - yAxisRight(d.people_fully_vaccinated))
            .select("title")
            .text(d => `Location: ${d.location}\nPeople_Fully_Vaccinated: ${d.people_fully_vaccinated}`);
    
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
            .attr("transform", "translate(" + (doubleBarWidth / 2) + "," + (doubleBarHeight + doubleBarMargin.bottom - 5) + ")")
            .style("text-anchor", "middle")
            .text("Countries");
    
        // Add left Y axis label
        doubleBarSVG.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - doubleBarMargin.left)
            .attr("x", 0 - (doubleBarHeight / 2))
            .attr("dy", "1em")
            .attr("fill", "#CFAE8A")
            .style("text-anchor", "middle")
            .text("Total Population Density →");
    
        // Add right Y axis label
        doubleBarSVG.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", doubleBarWidth + doubleBarMargin.right - 20)
            .attr("x", 0 - (doubleBarHeight / 2))
            .attr("dy", "1em")
            .attr("fill", "#CF5F00")
            .style("text-anchor", "middle")
            .text("People Fully Vaccinated →");
    }
    
    //
    //
    // ------- CODE FOR THE STACKED BAR CHART
    //
    //
    
    // Append tooltip div
    const stackedBarTooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("pointer-events", "none")
        .style("background-color", "white")
        .style("padding", "5px")
        .style("border", "1px solid #ddd")
        .style("box-shadow", "0 0 5px rgba(0, 0, 0, 0.1)");

    // Function to show tooltip
    function showTooltipStackedBar(event, d) {
        const tooltipWidth = parseFloat(stackedBarTooltip.style("width"));
        const tooltipHeight = parseFloat(stackedBarTooltip.style("height"));
        const mouseX = event.pageX;
        const mouseY = event.pageY;
    
        stackedBarTooltip.transition()
            .duration(200)
            .style("opacity", .9)
            .style("left", (mouseX + 10) + "px")
            .style("top", (mouseY - tooltipHeight - 10) + "px");
    
        stackedBarTooltip.html(`Location: ${d.location}<br>Population Density: ${d.population_density}<br>Total Cases per Million: ${d.total_cases_per_million}`);
    }

    // Function to hide tooltip
    function hideTooltipStackedBar() {
        stackedBarTooltip.transition()
            .duration(500)
            .style("opacity", 0);
    }

    function updateStackedBarChart() {

        const selectedCountries = [];
        d3.selectAll("input[type=checkbox]:checked").each(function() {
            selectedCountries.push(this.value);
        });
        
        const filteredData = data.filter(d => selectedCountries.includes(d.location));

        // Clear the existing graph
        d3.select("#chart-container").selectAll("*").remove();
        // Append SVG container
        const stackedBarSVG = d3.select("#chart-container")
            .append("svg")
            .attr("width", stackedBarWidth + stackedBarMargin.left + stackedBarMargin.right)
            .attr("height", stackedBarHeight + stackedBarMargin.top + stackedBarMargin.bottom)
            .append("g")
            .attr("transform", "translate(" + stackedBarMargin.left + "," + stackedBarMargin.top + ")");
        
        // Define scales
        const yScale = d3.scaleBand()
            .domain(filteredData.map(d => d.location))
            .range([0, stackedBarHeight])
            .padding(0.1);

        const xAxisTop = d3.scaleLinear()
            .domain([0, d3.max(filteredData, d => d.population_density)])
            .range([0, stackedBarWidth]);

        const xAxisBottom = d3.scaleLinear()
            .domain([0, d3.max(filteredData, d => d.total_cases_per_million)])
            .range([0, stackedBarWidth]);
            
        // Create stacked bars
        stackedBarSVG.selectAll(".stacked-bar-total-cases-per-million")
            .data(filteredData)
            .enter().append("rect")
            .attr("class", "stacked-bar-total-cases-per-million")
            .attr("x", 0)
            .attr("y", d => stackedBarHeight) // Initial position at the bottom
            .attr("width", 0) // Initial width of 0
            .attr("height", yScale.bandwidth())
            .attr("fill", "#CF5F00")
            .on("mouseover", showTooltipStackedBar)
            .on("mouseout", hideTooltipStackedBar)
            .merge(stackedBarSVG.selectAll(".stacked-bar-total-cases-per-million")) // Merge new and existing elements
            .transition() // Apply transition
            .duration(500) // Animation duration
            .attr("x", 0)
            .attr("width", d => xAxisBottom(d.total_cases_per_million))
            .attr("y", d => yScale(d.location))
            .select("title")
            .text(d => `Location: ${d.location}\nTotal population_density: ${d.population_density}\nTotal Cases per Million: ${d.total_cases_per_million}`);

        stackedBarSVG.selectAll(".stacked-bar-total-population_density")
            .data(filteredData)
            .enter().append("rect")
            .attr("class", "stacked-bar-total-population_density")
            .attr("x", 0)
            .attr("y", d => stackedBarHeight) // Initial position at the bottom
            .attr("width", 0) // Initial width of 0
            .attr("height", yScale.bandwidth())
            .attr("fill", "#FDD4A9")
            .on("mouseover", showTooltipStackedBar)
            .on("mouseout", hideTooltipStackedBar)
            .merge(stackedBarSVG.selectAll(".stacked-bar-total-population_density")) // Merge new and existing elements
            .transition() // Apply transition
            .duration(500) // Animation duration
            .attr("x", 0)
            .attr("width", d => xAxisTop(d.population_density))
            .attr("y", d => yScale(d.location))
            .select("title")
            .text(d => `Location: ${d.location}\nTotal population_density: ${d.population_density}\nTotal Cases per Million: ${d.total_cases_per_million}`);

        

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
            .attr("x",0 - (stackedBarHeight / 2 - 20))
            .attr("dy", "1em")
            
            .style("text-anchor", "middle")
            .text("Countries");

        // Add X axis labels
        stackedBarSVG.append("text")
            .attr("transform", "translate(" + (stackedBarWidth / 2) + "," + (stackedBarHeight + stackedBarMargin.bottom - 5) + ")")
            .attr("fill", "#CFAE8A0")
            .style("text-anchor", "middle")
            .text("Total cases per million");

        stackedBarSVG.append("text")
            .attr("transform", "translate(" + (stackedBarWidth / 2 ) + "," + (stackedBarMargin.top - 80) + ")")
            .attr("fill", "#DBB892")
            .style("text-anchor", "middle")
            .text("Total population density");
    }

    
    // Define a function that updates both the double bar chart and the stacked bar chart
    function updateCharts() {
        updateDoubleBarChart();
        updateStackedBarChart();

        const checkboxesDiv = d3.select("#countryCheckboxes");
        const checkedCountries = [];
        d3.selectAll("input[type=checkbox]:checked").each(function() {
            checkedCountries.push(this.parentNode); // Get the parent node (checkbox div)
        });
    
        // Move checked countries to the top
        checkedCountries.forEach(node => checkboxesDiv.node().prepend(node));
    }

    // Assign the updateCharts function to the click event handler of the button
    d3.select("#find-Btn").on("click", updateCharts);

    d3.select("#find-Btn").dispatch("click");

    })

}

barCharts(); 


