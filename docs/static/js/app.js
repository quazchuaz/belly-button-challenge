// Set url as constant variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

//set initial dashboard graphs
function init(){

    //Select menu dropdown with D3
    let menuitems = d3.select("#selDataset")

    //extract data and then perform operations
    d3.json(url).then((data) => {

        //set names variable for sample names
        let names = data.names;

        //iterate through all names and add to dropdown menu items
        names.forEach((name) => {
            menuitems.append("option")
            .text(name)
            .property("value",name);
        });
        
        //set the first name from samples
        first_name = names[0];
        console.log(first_name)

        //call functions to initialise graphs
        Demographics(first_name);
        Bar_Chart(first_name);
        Bubble_Chart(first_name);
    });
}

//create function to show demographic info
function Demographics(sample) {
    // Retrieve Data
    d3.json(url).then((data) => {

        let metadata = data.metadata;
        
        // Filter based on sample
        let sample_value = metadata.filter((value) => value.id == sample);

        console.log(sample_value)
      
        // Retrieve value at index 0
        let first_sample_value = sample_value[0]
        
        // Clear out the sample metadata
        d3.select("#sample-metadata").html("");
  
        // populate key-value pairs to the dashboard 
        Object.entries(first_sample_value).forEach(([key,value]) => {
            console.log(key,value);
            
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });
};

//create function to show bar chart
function Bar_Chart(sample) {
    // Retrieve data
    d3.json(url).then((data) => {

        //Get sample data
        let sample_objects = data.samples;

        // Filter based on sample 
        let sample_value = sample_objects.filter((value) => value.id == sample);

        // Retrieve value at index 0
        let first_sample_value = sample_value[0];
        
        // Set variables to be plot
        let sample_values = first_sample_value.sample_values;
        let otu_ids = first_sample_value.otu_ids;
        let otu_labels = first_sample_value.otu_labels;
        
        console.log(otu_ids,otu_labels,sample_values);

        // Trace bar chart for top 10 results
        let trace = [{
            x: sample_values.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).map((otu_id) => `OTU ${otu_id}`).reverse(),
            text: otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"
        }];
        
        // Call Bar Chart with Plotly
        Plotly.newPlot("bar", trace);
    });
};

//create function to show bubble chart
function Bubble_Chart(sample) {
    // Retrieve data
    d3.json(url).then((data) => {

        //Get sample data
        let sample_objects = data.samples;

        // Filter based on sample 
        let sample_value = sample_objects.filter((value) => value.id == sample);

        // Retrieve value at index 0
        let first_sample_value = sample_value[0];
        
        // Set variables to be plot
        let sample_values = first_sample_value.sample_values;
        let otu_ids = first_sample_value.otu_ids;
        let otu_labels = first_sample_value.otu_labels;
        
        console.log(otu_ids,otu_labels,sample_values);

        // Trace bar chart for top 10 results
        let trace2 = [{
            x: otu_ids,
            y:sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Sunset"
            }
        }];

        //Plot with plotly

        let layout = {
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        Plotly.newPlot("bubble", trace2, layout);
    });
};

    //Set function to update dashboard as we cycle through samples
    function optionChanged(sample_value) {
        console.log(sample_value);

        Demographics(sample_value);
        Bar_Chart(sample_value);
        Bubble_Chart(sample_value);
    };
    
    init();