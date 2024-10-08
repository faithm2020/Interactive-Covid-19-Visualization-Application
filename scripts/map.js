// Define the dimensions of the map visualization
const mapWidth = 52;
const mapHeight = 80;

// Create an SVG element for the map visualization
const mapSvg = d3.select("#map-viz")
            .append("svg")
            .attr("class", "map-svg")
            .attr("width", `${mapWidth}vw`)
            .attr("height",`${mapHeight}vh`);

//Different map projections- 
// geoEquirectangular()
// geoMercerator()
// geoEqualEarth()

// Define initial variables
let mainData;
let countryData;

// Load dataset from the provided URL
d3.csv("https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv").then(data => {

    // Store the loaded data    
    mainData = data;
    // Filter data based on specific date and countries
    countryData = data.filter(d => d.date === "2023-03-07" && ['AFG','ALB','DZA','ASM','CAN'].includes(d.iso_code));

    // Initial call for world data
    const worldData = mainData.filter(d => d.location === 'World');
    // Call the lineGraph function with worldData
    lineGraph(worldData);
});

// Define map projection and path
const mapPath = d3.geoPath();
const projection = d3.geoMercator()
  .scale(100)
  .center([0,20])
  .translate([ window.innerWidth * mapWidth / 200 , window.innerHeight * mapHeight / 200]);

// Define data and color scale
const data = new Map();
const colorScale = d3.scaleThreshold()
  .domain([0, 1000, 10000, 50000, 100000, 200000, 300000, 500000])
  .range(d3.schemeOranges[9]);

const selectedData = 'cases';

let arr = [];

// Function to update the map based on selected data
function updateMap(selectedData){
    // Define domain and range values based on selected data
    let domainValues;
    let rangeValues;
    switch(selectedData) {
    case 'cases':
        domainValues = [0, 1000, 10000, 50000, 100000, 200000, 300000, 500000];
        rangeValues = d3.schemeOranges[9]
        break;
    case 'deaths':
        domainValues = [0,100,200,500,1000,2000,3000,5000];
        rangeValues = d3.schemeReds[9]
        break;
    default:
        domainValues = [0, 1000, 10000, 50000, 100000, 200000, 300000, 500000];
        rangeValues = d3.schemeOranges[9]
    }

    // Set the domain and range of the color scale
    colorScale.domain(domainValues);
    colorScale.range(rangeValues);

    // Load external JSON and CSV data
    Promise.all([
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
    d3.csv("https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv",function (d) {
        if (d.date === "2024-03-03") {
            switch(selectedData) {
            case 'cases':
                data.set(d.iso_code, d.total_cases_per_million);
                arr.push(d.total_cases_per_million);
                break;
            case 'deaths':
                data.set(d.iso_code, d.total_deaths_per_million);
                arr.push(d.total_deaths_per_million);
                break;
            default:
                data.set(d.iso_code, d.total_cases_per_million); // Default to cases
                arr.push(d.total_cases_per_million); // Push data to arr based on the default selection
            }
        };
    })])
    .then(function(loadData) {
        let topo = loadData[0];

        // Define mouse event handlers
        let mouseOver = function(event, d) {
            mapTooltip.style("opacity", 1);
            d3.selectAll(".Country")
            .transition()
            .duration(200)
            .style("opacity", .5);
            d3.selectAll(`.${event.target.classList[1]}`)        
            .transition()
            .duration(200)
            .style("opacity", 1);
        }

        const mouseMove = (event, d) => {
        mapTooltip
            .html('<u>' + d.properties.name + '</u>' + "<br>" + parseInt(d.total) + " "+selectedData+" per million")
            .style("position", "fixed")
            .style("left", (event.x + 15) + "px")
            .style("top", (event.y - (scrollY/5)) + "px");
    };

        let mouseLeave = function(event, d) {
            mapTooltip.style("opacity", 0);
            d3.selectAll(".Country")
            .transition()
            .duration(200)
            .style("opacity", 1);
        }
        
        let mouseClick = function(event, d) {
            console.log("Mouse clicked on a country:", d); // Add this log message
            if(d.id !== 'ATA' )
                lineGraph(mainData.filter(datum => datum.iso_code === d.id))
            else
                lineGraph(mainData.filter(datum => datum.location === 'World'))
                d3.select(`.${event.target.classList[1]}-gdp`)
                .transition()
                .delay(1000)
                .duration(800)
                .attr("stroke", "white")
                .attr("stroke-width", 3)
                .transition()
                .delay(3000)
                .duration(600)
                .attr("stroke", "black")
                .attr("stroke-width", );
        }
        
        // create a tooltip
        const mapTooltip = d3.select("#map-viz")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "0.3em");

        // Draw the map
        mapSvg.append("g")
        .selectAll("path")
        .data(topo.features)
        .enter()
        .append("path")
        // draw each country
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        // set the color of each country
        .attr("fill", function (d) {
            d.total = data.get(d.id) || 0;
            return colorScale(d.total);
        })
        .style("stroke", "black")
        .attr("class", function(d){ return `Country ${d.id}` } )
        .style("opacity", .8)
        .on("mouseover", mouseOver )
        .on("mousemove", mouseMove)
        .on("click", mouseClick)
        .on("mouseleave", mouseLeave );

    });
}

// Initial call to update the map with selected data
updateMap(selectedData);

// Event listener for selecting different data
document.getElementById("data-select").addEventListener("change", function() {
    let selectedData = this.value;
    // Call the loadData function with the newly selected data
    updateMap(selectedData);
  });

  