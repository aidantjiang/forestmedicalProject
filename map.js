const width = 1500;
const height = 1200;
let canvas = d3.select("#canvas").attr('width', width).attr('height', height);
let indicator = d3.select("#indicator");
const projection = d3.geoMercator().scale(200).translate([width / 2, height / 1.8]);
const path = d3.geoPath(projection);
let countries;

const drawMap = () => {
    console.log(countries);

    canvas.selectAll('path')
        .data(countries)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('class', 'country')
        
        .on('mouseover', (country) => {
            indicator.transition()
                .duration(2000)
                .style('visibility', 'visible')
            let name = country.properties.name
            indicator.text(name);
        })

        .on('mouseout', (country) => {
            indicator.transition()
                .duration(2000)
                .style('visibility', 'hidden')
        })
}

d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
    .then((data, err) => {
        if (err) {
            console.log(err);
        }
        else {
            countries = topojson.feature(data, data.objects.countries).features;
            drawMap();
        }
    }
);