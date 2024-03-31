// Load data and populate dropdown
d3.csv("https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv").then(function(data) {
    const countries = Array.from(new Set(data.map(d => d.location)));
    const dropdown = d3.select("#country-select");
    dropdown.selectAll("option")
        .data(countries)
        .enter().append("option")
        .text(d => d)
        .attr("value", d => d);
});

// Function to create stacked bar chart
function createStackedBarChart(selectedCountry) {
    // Clear previous chart
    d3.select("#chart-container").html("");

    // Filter data for the selected country
    const countryData = data.filter(d => d.location === selectedCountry);

    // Extract necessary data for the chart
    const casesPerMillion = +countryData[0].total_cases_per_million;
    const totalCases = +countryData[0].total_cases;
    const population = +countryData[0].population;

    // Create stacked bar chart data
    const stackedData = [
        { name: "COVID Cases", value: casesPerMillion },
        { name: "Non-COVID Cases", value: population - casesPerMillion }
    ];

    // Set up dimensions for the chart
    const width = 600;
    const height = 400;

    // Create SVG element
    const svg = d3.select("#chart-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Set up scales for x and y axes
    const xScale = d3.scaleBand()
        .domain(stackedData.map(d => d.name))
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, population])
        .range([height, 0]);

    // Create color scale
    const color = d3.scaleOrdinal()
        .domain(stackedData.map(d => d.name))
        .range(["#98abc5", "#8a89a6"]);

    // Add bars to the chart
    svg.selectAll(".bar")
        .data(stackedData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.name)) // x position based on category name
        .attr("y", d => yScale(d.value)) // y position based on value
        .attr("width", xScale.bandwidth()) // width of the bars
        .attr("height", d => height - yScale(d.value)) // height of the bars
        .style("fill", d => color(d.name)); // color based on category name

    // Add y-axis
    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale));

    // Add x-axis
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

    // Add chart title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .text("Cases per Million compared to Total Population");
}

// Event handler for dropdown change
d3.select("#country-select").on("change", function() {
    const selectedCountry = d3.select(this).property("value");
    createStackedBarChart(selectedCountry);
});
