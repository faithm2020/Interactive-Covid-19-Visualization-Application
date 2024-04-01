// Dimensions of graph
const lineMargin = { top: 35, right: 30, bottom: 80, left: 80 };
const lineWidth = 620 - lineMargin.left - lineMargin.right;
const lineHeight = 400 - lineMargin.top - lineMargin.bottom;

function lineGraph(data) {
    d3.select(".line-svg").remove();

    const lineMargin = { top: 35, right: 80, bottom: 80, left: 80 };
    const lineWidth = 620 - lineMargin.left - lineMargin.right;
    const lineHeight = 400 - lineMargin.top - lineMargin.bottom;

    const timeStamps = data.map(d => d3.timeParse("%Y-%m-%d")(d.date));
    const domain = d3.extent(timeStamps);

    // filter the latest data out as it has bugs
    data = data.filter(d => d3.timeParse("%Y-%m-%d")(d.date) < d3.timeParse("%Y-%m-%d")("2024-03-03"));

    const x = d3.scaleTime().domain(domain).range([0, lineWidth]);

    // Y-scale for total cases
    const yTotalCases = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d.total_cases * 1.1)]) // Add 10% padding
        .range([lineHeight, 0]);

    // Y-scale for total deaths
    const yTotalDeaths = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d.total_deaths * 1.1)]) // Add 10% padding
        .range([lineHeight, 0]);

    // append the svg object to the body of the page using line-viz ID.
    const lineSvg = d3.select("#line-viz")
        .append("svg")
        .attr("width", lineWidth + lineMargin.left + lineMargin.right)
        .attr("height", lineHeight + lineMargin.top + lineMargin.bottom)
        .attr("class", "line-svg")
        .append("g")
        .attr("transform", `translate(${lineMargin.left},${lineMargin.top})`);

    // X-axis
    lineSvg.append("g")
        .attr("transform", `translate(0, ${lineHeight})`)
        .call(d3.axisBottom(x))
        .call(g => g.append("text")
            .attr("x", lineWidth)
            .attr("y", lineMargin.bottom - 50)
            .attr("fill", "#98C1D9")
            .attr("text-anchor", "end")
            .text("Timeline →"));

    // Left Y-axis for total cases
    lineSvg.append("g")
        .call(d3.axisLeft(yTotalCases))
        .call(g => g.append("text")
            .attr("x", -lineMargin.left)
            .attr("y", -15)
            .attr("fill", "#98C1D9")
            .attr("text-anchor", "start")
            .text("↑ Total Covid-19 Cases"));

    // Right Y-axis for total deaths
    lineSvg.append("g")
        .attr("transform", `translate(${lineWidth}, 0)`)
        .call(d3.axisRight(yTotalDeaths))
        .call(g => g.append("text")
            .attr("x", 0)
            .attr("y", -15)
            .attr("fill", "red")
            .attr("text-anchor", "end")
            .text("↑ Total Covid-19 Deaths"));

    // Line for total cases
    lineSvg.selectAll(".line-total-cases")
        .data(d3.group(data, d => d.location))
        .enter()
        .append("path")
        .attr("class", "line-total-cases")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("d", d => d3.line()
            .x(d => x(d3.timeParse("%Y-%m-%d")(d.date)))
            .y(yTotalCases(0)) // Start from 0
            .curve(d3.curveMonotoneX)(d[1])
        )
        .transition()
        .duration(1500) // Animation duration
        .attr("d", d => d3.line()
            .x(d => x(d3.timeParse("%Y-%m-%d")(d.date)))
            .y(d => yTotalCases(+d.total_cases))
            .curve(d3.curveMonotoneX)(d[1])
        );

    // Line for total deaths
    lineSvg.selectAll(".line-total-deaths")
        .data(d3.group(data, d => d.location))
        .enter()
        .append("path")
        .attr("class", "line-total-deaths")
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("d", d => d3.line()
            .x(d => x(d3.timeParse("%Y-%m-%d")(d.date)))
            .y(yTotalDeaths(0)) // Start from 0
            .curve(d3.curveMonotoneX)(d[1])
        )
        .transition()
        .duration(1500) // Animation duration
        .attr("d", d => d3.line()
            .x(d => x(d3.timeParse("%Y-%m-%d")(d.date)))
            .y(d => yTotalDeaths(+d.total_deaths))
            .curve(d3.curveMonotoneX)(d[1])
        );

    // Title
    lineSvg.append('text')
        .attr("x", lineWidth / 2)
        .attr("y", lineHeight + 45)
        .attr("text-anchor", "middle")
        .attr("stroke", 1)
        .style("font-size", "0.95em")
        .style("fill", "black")
        .text(() => {
            return "Growth of Covid-19 cases & deaths overtime: " + data[0].location;
        });

    //Country search 
    // const searchContainer = d3.select("#line-viz")
    // .append("div")
    // .attr("class", "search-container");

    // searchContainer.append("input")
    //     .attr("type", "text")
    //     .attr("placeholder", "Enter country name...")
    //     .attr("id", "country-input");

    // searchContainer.append("button")
    //     .text("Search")
    //     .on("click", function() {
    //         const countryName = d3.select("#country-input").property("value").toLowerCase();
    //         const filteredData = mainData.filter(d => d.location.toLowerCase() === countryName);
    //         lineGraph(filteredData);
    //     });
}
// Initial call for world data
//const worldData = mainData.filter(d => d.location === 'World');
//lineGraph(worldData);

document.getElementById("search-btn").addEventListener("click", function() {
    // Get the input value
    let countryName = document.getElementById("country-input").value;
    const filteredData = mainData.filter(d => d.location.toLowerCase() === countryName.toLowerCase());
    // Call the lineGraph function with the entered country name
    lineGraph(filteredData);
});
  