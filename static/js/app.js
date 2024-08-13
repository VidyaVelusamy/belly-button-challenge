// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    
    console.log("Data Promise: ", data);
    let Metadata = data.metadata;
    // Filter the metadata for the object with the desired sample number
    function selectsample(metadata) {
      return metadata.id == sample;
    }
    let metadata_samp = Metadata.filter(selectsample);

    console.log(metadata_samp);
    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    
        panel.append("p").text(`AGE: ${metadata_samp[0].age}`);
        panel.append("p").text(`BB TYPE: ${metadata_samp[0].bbtype}`);
        panel.append("p").text(`ETHINICITY: ${metadata_samp[0].ethnicity}`);
        panel.append("p").text(`GENDER: ${metadata_samp[0].gender}`);
        panel.append("p").text(`ID: ${metadata_samp[0].id}`);
        panel.append("p").text(`LOCATION: ${metadata_samp[0].location}`);
        panel.append("p").text(`WFREQ: ${metadata_samp[0].wfreq}`);
  
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
  
    console.log("Data Promise: ", data);
    let samples = data.samples;
    // Filter the samples for the object with the desired sample number
    function selectsample(samples) {
      return samples.id == sample;
    }
    let samples_sel = samples.filter(selectsample);

    // Get the otu_ids, otu_labels, and sample_values

    let otu_ids = samples_sel.map(function(otuid) {
      return otuid.otu_ids;});
      
    let otu_labels = samples_sel.map(function(otulable) {
      return otulable.otu_labels;});

    let sample_values = samples_sel.map(function(sampval) {
      return sampval.sample_values;});
    
    // Build a Bubble Chart

    let trace = {
      x: otu_ids[0],
      y: sample_values[0],
      mode: 'markers',
      marker: {
        size: sample_values[0],
        color: otu_ids[0],
        colorscale: 'Earth'
      },
      type: 'bubble'
    };
    // Data Array
   let data1 = [trace]
  
    // Layout object
    let layout = {
      title: "Bacteria Cultures per sample",
      xaxis: {
        title: "OTU ID"
        
    },
    yaxis: {
      title: "Number of Bacteria"
      
  }
   };
   // Render the Bubble Chart

    Plotly.newPlot("bubble", data1, layout);
    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let otu_ids_new = otu_ids.sort(function compareFunction(first, Second) {

      return Second.otu_ids - first.otu_ids;
    });
    let otu_label_new = otu_labels.sort(function compareFunction(first, Second) {

      return Second.otu_labels - first.otu_labels;
    });
    let samp_val_new = sample_values.sort(function compareFunction(first, Second) {

      return Second.sample_values - first.sample_values;
    });
    let sliceotuid = otu_ids_new[0].slice(0,10);
    let sliceotulable = otu_label_new[0].slice(0,10);
    let slicesampval = samp_val_new[0].slice(0,10);
    // Reverse the array to accommodate Plotly's defaults
    let revotuid = sliceotuid.reverse();
    let revoutlabel = sliceotulable.reverse();
    let revsampval = slicesampval.reverse();
    let yticks = revotuid.map(id => `OTU ${id}`);
    console.log(revsampval)
    let trace2 = {
      x: revsampval,
      y: yticks,
      type : 'bar',
      orientation: 'h'
    };

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let data2 = [trace2]
    let layout2 = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {
        title: "Number of Bacteria"
        
    }
  
    };
    // Render the Bar Chart
    Plotly.newPlot("bar", data2, layout2);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    console.log("Data received: ", data);
    
    // Access the 'names' field from the data object
    let names = data.names;
    
    // Log the names to the console
    console.log("Names: ", names);

    // Use d3 to select the dropdown with id of `#selDataset`

    let dropdownMenu = d3.select("#selDataset");
    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
// Create a new element
      for (let i=0;i<names.length;i++)
      {
        dropdownMenu.append("option").text(names[i]).attr("value", names[i]);
      }
     

    // Get the first sample from the list
    let firstsample = dropdownMenu.property("value");

    // Build charts and metadata panel with the first sample
    
    buildMetadata(firstsample);
    buildCharts(firstsample);
  
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  let dropdownMenu = d3.select("#selDataset");
  let dataset = dropdownMenu.property("value");
  buildMetadata(dataset);
  buildCharts(dataset);
}

// Initialize the dashboard
init();
