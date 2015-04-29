var region_chart            = dc.rowChart("#region");
var categories_pie          = dc.pieChart("#categories");
var vulnerability_series    = dc.barChart("#vulnerability");
var adm4_map                = dc.geoChoroplethChart("#map");

var cf = crossfilter(data);
var center_points = [85.3, 28];
var map_scale = 5000;

// Defining the cross-filter dimensions.
cf.pcode = cf.dimension(function(d){ return d.P_CODE });
cf.severity = cf.dimension(function(d){ return d.Severity });
cf.region = cf.dimension(function(d){ return d.REGION });
cf.population = cf.dimension(function(d){ return d.POP_2011 });
cf.category = cf.dimension(function(d){ return d["Severity category"]; });

// Organizing the cross-filter groups.
var all = cf.groupAll();
var pcode = cf.pcode.group();
var region = cf.region.group();
var category = cf.category.group();
var severity = cf.severity.group();
var population = cf.population.group();


vulnerability_series.width(400).height(300)
        .x(d3.scale.linear().domain([0,10]))
        .brushOn(false)
        .dimension(cf.severity)
        .elasticY(true)
        .centerBar(true)
        .gap(10)
        .group(severity);

region_chart.width(400).height(300)
        .margins({top: 20, left: 3, right: 10, bottom: 20})
        .dimension(cf.region)
        .group(region)
        .colors(['#2c3e50'])
        .colorDomain([0,1])
        // .filter('Central')
        .colorAccessor(function(d, i){return i%1;});

categories_pie.width(260).height(200)
        .dimension(cf.category)
        .group(category)
        .colors([
                 '#c0392b',
                 '#16a085',
                 '#f1c40f'
            ])
        .colorDomain([1,3])
        .innerRadius(50)
        .colorAccessor(function(d, i){return i%3+1;});

dc.dataCount("#count-info")
    .dimension(cf)
    .group(all);

// Map
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
