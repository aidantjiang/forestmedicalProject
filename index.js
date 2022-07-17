const width = 1500;
const height = 1200;
let currentYear = "Forest2000";

//color setters
let min = Number.MAX_VALUE;
let max = Number.MIN_VALUE;
let pseudoMax = Number.MIN_VALUE;
let avg = 0;

let canvas = d3.select("#canvas").attr('width', width).attr('height', height);
let indicator = d3.select("#indicator");
const projection = d3.geoMercator().scale(200).translate([width / 2, height / 1.8]);
const path = d3.geoPath(projection);

//datasets filled inside bottom async function
let countries;
let deforestation;

const drawMap = () => {
    canvas.selectAll('path')
        .data(countries)
        .enter()
        .append('path')
            .attr('d', path)
            .attr('class', 'country')
            .attr('fill', (country) => {
                let name = country.properties.name;
                //links two databases for each path of the svg
                let indivPath = deforestation.find((indivPath) => {
                    return indivPath.properties.geounit === name
                })

                //some countries are not in both databases, skips those
                if (indivPath) {
                    //selects data to display
                    let percentage = indivPath.properties[currentYear];

                    //takes gradient and assigns color based on how far away from the average it is
                    
                    if (percentage) {
                        //If value exists…
                        const setColor = d3.scaleQuantile()
                            .domain([min, max])
                            // .range(['#D2222D', '#ffffff', '#000000', '#007000']);
                            .range(["#d22222", "#ca2f12", "#c23a00", "#b94300", "#af4b00", "#a55200", "#9a5700", "#8f5c00", "#846000", "#786400", "#6c6700", "#606a00", "#536c00", "#456d00", "#366e00", "#246f00", "#007000",])

                        // const setColor = d3sB.scaleLinear.bind(d3sB)()
                        //     .domain([ [min, pseudoMax], [pseudoMax, max] ])
                        //     .scope([ [0, 0.9], [0.9, 1] ])
                        //     .range(['#D2222D', '#007000']);

                        return setColor(percentage);
                      } else {
                        return "black";
                      } 
                }
            })
        
        //animations
        .on('mouseover', (country) => {
            indicator.transition()
                .style('visibility', 'visible')
            let name = country.properties.name;
            let indivPath = deforestation.find((indivPath) => {
                return indivPath.properties.geounit === name
            })

            //some countries are not in both databases, skips those
            if (indivPath) {
                //selects data to display
                let percentage = indivPath.properties[currentYear];
                indicator.text(name + " " + percentage);
            }
            // indicator.text(name);
        })

        .on('mouseout', (country) => {
            indicator.transition()
                .style('visibility', 'hidden')
        })
}

d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
    .then((data, err) => {
        if (err) {
            console.log(err);
        }
        else {
            //remove later
            countries = topojson.feature(data, data.objects.countries).features;  

            d3.json('assets/geoData.json')
                .then((data, err) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        deforestation = data.features;

                        //set min and max using data
                        let counter = 0;
                        for (let i = 0; i < deforestation.length; i++) {
                            if (deforestation[i].properties[currentYear] !== null) {
                                if (pseudoMax && deforestation[i].properties.geounit !== "Russia" && deforestation[i].properties.geounit !== "Brazil") {
                                    avg += deforestation[i].properties[currentYear];
                                    counter++;
                                }
                                if (deforestation[i].properties[currentYear] < min) {
                                    min = deforestation[i].properties[currentYear];
                                }
                                if (deforestation[i].properties[currentYear] > max) {
                                    max = deforestation[i].properties[currentYear];
                                }
                                if (deforestation[i].properties[currentYear] > pseudoMax && deforestation[i].properties.geounit !== "Russia" && deforestation[i].properties.geounit !== "Brazil") {
                                    pseudoMax = deforestation[i].properties[currentYear];
                                }
                            }
                        }

                        console.log(min);
                        console.log(max);
                        console.log(pseudoMax);
                        console.log(avg);

                        drawMap();
                    }
                }
            );
        }
    }
);

// const width = 1500;
// const height = 1200;
// let currentYear = "Forest2000";

// //color setters
// let min = Number.MAX_VALUE;
// let max = Number.MIN_VALUE;
// let pseudoMax = Number.MIN_VALUE;

// let canvas = d3.select("#canvas").attr('width', width).attr('height', height);
// let indicator = d3.select("#indicator");
// const projection = d3.geoMercator().scale(200).translate([width / 2, height / 1.8]);
// const path = d3.geoPath(projection);

// //datasets filled inside bottom async function
// let countries;
// let deforestation;

// const drawMap = () => {
//     canvas.selectAll('path')
//         .data(countries)
//         .enter()
//         .append('path')
//             .attr('d', path)
//             .attr('class', 'country')
//             .attr('fill', (country) => {
//                 let name = country.properties.name;
//                 //links two databases for each path of the svg
//                 let indivPath = deforestation.find((indivPath) => {
//                     return indivPath.properties.geounit === name
//                 })

//                 //some countries are not in both databases, skips those
//                 if (indivPath) {
//                     //selects data to display
//                     let percentage = indivPath.properties[currentYear];

//                     //takes gradient and assigns color based on how far away from the average it is
                    
//                     if (percentage) {
//                         //If value exists…
//                         // const setColor = d3sB.scaleLinear()
//                         //     .domain([ [min, pseudoMax], [pseudoMax, max] ])
//                         //     .scope([ [0, 0.9], [0.9, 1] ])
//                         //     .range(['#D2222D', '#007000']);
                            
//                         const setColor = d3.scaleLinear()
//                             .domain([ [min, max] ])
//                             .range(['#D2222D', '#007000']);
                            
//                         console.log(setColor(percentage));
//                         return setColor(percentage);
//                       } else {
//                         //If value is undefined…
//                         return "black";
//                       } 
//                 }
//             })
        
//         //animations
//         .on('mouseover', (country) => {
//             indicator.transition()
//                 .style('visibility', 'visible')
//             let name = country.properties.name;
//             let indivPath = deforestation.find((indivPath) => {
//                 return indivPath.properties.geounit === name
//             })

//             //some countries are not in both databases, skips those
//             if (indivPath) {
//                 //selects data to display
//                 let percentage = indivPath.properties[currentYear];
//                 indicator.text(name + " " + percentage);
//             }
//             // indicator.text(name);
//         })

//         .on('mouseout', (country) => {
//             indicator.transition()
//                 .style('visibility', 'hidden')
//         })
// }

// d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
//     .then((data, err) => {
//         if (err) {
//             console.log(err);
//         }
//         else {
//             //remove later
//             countries = topojson.feature(data, data.objects.countries).features;  

//             d3.json('assets/geoData.json')
//                 .then((data, err) => {
//                     if (err) {
//                         console.log(err);
//                     }
//                     else {
//                         deforestation = data.features;

//                         //set min and max using data
//                         for (let i = 0; i < deforestation.length; i++) {
//                             if (deforestation[i].properties[currentYear] !== null) {
//                                     min = deforestation[i].properties[currentYear];
//                                 if (deforestation[i].properties[currentYear] > max)
//                                     max = deforestation[i].properties[currentYear];
//                                 if (deforestation[i].properties[currentYear] > pseudoMax && deforestation[i].properties.geounit !== "Russia" && deforestation[i].properties.geounit !== "Brazil")
//                                     pseudoMax = deforestation[i].properties[currentYear];
//                             }
//                         }

//                         console.log(min);
//                         console.log(max);
//                         console.log(pseudoMax);

//                         drawMap();
//                     }
//                 }
//             );
//         }
//     }
// );