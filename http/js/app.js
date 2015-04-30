// Dev-helper
function print_filter(filter){
    var f=eval(filter);
    if (typeof(f.length) != "undefined") {}else{}
    if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
    if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
    console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
};

// Defining the chart elements.
var categories_pie          = dc.rowChart("#categories");

// Histograms
var severity_bar            = dc.barChart("#severity");
var exposure_bar            = dc.barChart("#exposure");
var hazard_bar              = dc.barChart("#hazard");
var poverty_bar             = dc.barChart("#poverty");

// Map
var adm4_map                = dc.geoChoroplethChart("#map");

// Indexing data.
var cf = crossfilter(data);

// Defining the cross-filter dimensions.
cf.pcode = cf.dimension(function(d){ return d.P_CODE });
cf.category = cf.dimension(function(d){ return d["Severity category"]; });

// Defining the histogram bins.
cf.severity = cf.dimension(function(d) {
    d.Bin = Math.round(d.Severity);
    return d.Bin;
});
cf.exposure = cf.dimension(function(d) {
    d.Bin = Math.round(d.Exposure_Population);
    return d.Bin;
});
cf.hazard = cf.dimension(function(d) {
    d.Bin = Math.round(d.Hazard_Intensity);
    return d.Bin;
});
cf.poverty = cf.dimension(function(d) {
    d.Bin = Math.round(d.Vulnerability_Poverty);
    return d.Bin;
});


// Organizing the cross-filter groups.
var all = cf.groupAll();
var pcode = cf.pcode.group();
var category = cf.category.group();
var severity = cf.severity.group();
var exposure = cf.exposure.group();
var hazard = cf.hazard.group();
var poverty = cf.poverty.group();

severity_bar.width(200).height(100)
        .x(d3.scale.linear().domain([0,10]))
        .margins({top: 20, left: -20, right: 30, bottom: 20})
        .brushOn(true)
        .dimension(cf.severity)
        .group(severity)
        .elasticY(true)
        .renderVerticalGridLines(true)
        .centerBar(true);

exposure_bar.width(200).height(100)
        .x(d3.scale.linear().domain([0,10]))
        .margins({top: 20, left: -20, right: 10, bottom: 20})
        .brushOn(true)
        .dimension(cf.exposure)
        .group(exposure)
        .elasticY(true)
        .renderVerticalGridLines(true)
        .centerBar(true);

hazard_bar.width(200).height(100)
        .x(d3.scale.linear().domain([0,10]))
        .margins({top: 20, left: -20, right: 10, bottom: 20})
        .brushOn(true)
        .dimension(cf.hazard)
        .group(hazard)
        .elasticY(true)
        .elasticX(false)
        .renderVerticalGridLines(true)
        .centerBar(true);

poverty_bar.width(200).height(100)
        .x(d3.scale.linear().domain([0,10]))
        .margins({top: 20, left: -20, right: 10, bottom: 20})
        .brushOn(true)
        .dimension(cf.hazard)
        .group(hazard)
        .renderVerticalGridLines(true)
        .elasticY(true)
        .centerBar(true);

categories_pie.width(400).height(300)
        .margins({top: 0, left: 3, right: 10, bottom: 55})
        .dimension(cf.category)
        .group(category)
        .colors(['#de2d26', '#a50f15', '#fee5d9','#fcbba1','#fc9272','#fb6a4a'])
        .colorDomain([0,5])
        .filter('Highest')
        .colorAccessor(function(d, i){return i%5;});

dc.dataCount("#count-info")
    .dimension(cf)
    .group(all);

// Map properties.
var center_points = [85.3, 28];
var map_scale = 5000;

// Adm4 map.
adm4_map.width(800).height(450)
        .dimension(cf.pcode)
        .group(pcode)
        .colors(['#ecf0f1', '#16a085'])
        .colorDomain([0, 1])
        .colorAccessor(function (d) {
            if(d>0){
                return 1;
            } else {
                return 0;
            }
        })
        .overlayGeoJson(adm4.features, "OCHA_PCODE", function (d) {
            return d.properties.OCHA_PCODE;
        })
        .projection(d3.geo.mercator()
            .center(center_points)
            .scale(map_scale))
        .title(function(d){
            return d.VDC_NAME;
        });
        
dc.renderAll();

var projection = d3.geo.mercator()
    .center(center_points)
    .scale(map_scale);

var path = d3.geo.path()
    .projection(projection);

var g = d3.selectAll("#map")
    .select("svg")
    .append("g");

// Adm0 map.     
g.selectAll("path")
    .data(adm0.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("stroke",'#2c3e50')
    .attr("stroke-width",'2px')
    .attr("fill",'none')
    .attr("class","macroregiao");
    
var mapLabels = d3.selectAll("#map")
    .select("svg")
    .append("g");



// mapLabels.selectAll('text')
//     .data(macroregioes.features)
//     .enter()
//     .append("text")
//     .attr("x", function(d,i){
//                 return path.centroid(d)[0]-20;})
//     .attr("y", function(d,i){
//                 return path.centroid(d)[1];})
//     .attr("dy", ".55em")
//     .attr("class","nome-macroregiao")
//     .style("font-size","12px")
//     .attr("opacity",0.4)
//     .text(function(d,i){
//         return d.properties.NM_MICRO;
//     });
