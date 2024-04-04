# F20DV GROUP 12 COVID-19 DATA VISUALIZATION PROJECT

This project aims to visualize COVID-19 data using D3.js library. It includes visualizations such as a line graph, double bar chart, stacked bar chart, and a world map, showcasing various COVID-19 statistics. This data visualization aims to provide comprehensive information about covid-19, to support further research, and to update the public. 

## Features

- World map visualization showing COVID-19 cases and deaths per million population
- Line graph visualization of COVID-19 data over time
- Double chart displaying data on population density and fully vaccinated people for selected countries
- Stacked bar chart displaying data on population density and cases per million for selected countries
- Data filtering for countries based on selected criteria
- Data searching for countries using a search bar
- Hover feature to view detailed information in the tooltip

## Installation

1. Clone the repository: `git clone <https://gitlab-student.macs.hw.ac.uk/fso2000/f20dv-group-project>`
2. Navigate to the project directory: `cd f20dv-group-project`
3. Open `index.html` in your web browser to view the visualizations.

## Usage

- Use the dropdown menu to select between Covid-19 cases and deaths for visualization on the world map.
- Click on a country on the map to view the Growth of Covid-19 cases & deaths overtime in the line graph.
- Hover over a country on the map to view detailed information in the tooltip.
- Use the search bar to search for countries to view the Growth of Covid-19 cases & deaths overtime in the line graph.
- Country Checkbox allows for the selection of specific countries to display data for on both bar charts.
- Hover over any bar on both barcharts to view detailed information in the tooltip.

## Overview of Scripts
- main.js
Purpose: This script serves as the entry point for the application. When executed, it logs the version of D3.js that is currently loaded. It provides a simple confirmation that D3.js has been successfully imported and is ready for use within the application.

- map.js
Purpose: Defines the map visualization, including map dimensions, projections, and color scales.

Key Features:
Loads and displays a world map using D3.js.
Colors countries based on COVID-19 data.
Provides interactivity through mouse events like hover and click.

- barcharts.js
Purpose: Generates double and stacked bar charts based on COVID-19 data for selected countries.

Key Features:
Loads COVID-19 data from a CSV file.
Creates checkboxes for selecting countries.
Dynamically updates both bar charts based on selected countries.

- line.js
Purpose: Creates a line graph showing the growth of COVID-19 cases and deaths over time for a specific country.

Key Features:
Loads COVID-19 data from a CSV file.
Generates a line graph using D3.js to visualize case and death trends over time.
Provides interactivity for searching and displaying data for a specific country.

- index.html
Purpose: This HTML file defines the structure and content of a web page for visualizing COVID-19 data. It consists of two main sections: the first section displays a map visualization and a line chart, while the second section contains checkboxes for filtering data and the bar charts.

- main.css
Purpose: This CSS file provides styling rules for the HTML elements used in the web page. It defines global styles such as font family and text color, as well as specific styles for various sections and components of the page:

## Data Sources

- COVID-19 data is sourced from [Our World in Data](https://ourworldindata.org/coronavirus).

## Contributors

- [Favour Ozogbu](https://gitlab-student.macs.hw.ac.uk/fso2000) (https://github.com/favourozogbu)
- [Artho Das](https://gitlab-student.macs.hw.ac.uk/and2002)
- [Faith Muraino](https://gitlab-student.macs.hw.ac.uk/fm2020)
- [Sheikh Mohammed](https://gitlab-student.macs.hw.ac.uk/sm2207)

## License

View License File


