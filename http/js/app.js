var respostas_pie        = dc.pieChart("#respostas");
var semanas_series       = dc.rowChart("#semanas");
var mapa_municipios      = dc.geoChoroplethChart("#mapa");

var cf = crossfilter(data);
var center_points = [0, 0];
var map_scale = 800;

// Defining the cross-filter dimensions.
cf.variable = cf.dimension(function(d){ return d.variable; });
cf.codigo = cf.dimension(function(d){ return d.codigo; });
cf.value = cf.dimension(function(d){ return d.value; });
cf.semana = cf.dimension(function(d){ return d.semana; });

// Organizing the cross-filter groups.
var all = cf.groupAll();
var value = cf.value.group();
var semana = cf.semana.group();
var codigo = cf.codigo.group();
var variable = cf.variable.group();

semanas_series.width(260).height(220)
        .margins({top: 20, left: 3, right: 10, bottom: 20})
        .dimension(cf.semana)
        .group(semana)
        .colors(['#2c3e50'])
        .colorDomain([0,1])
        .elasticX(true)
        // .filter("Semana 6")
        .colorAccessor(function(d, i){return i%1;});

respostas_pie.width(260).height(200)
        .dimension(cf.variable)
        .group(variable)
        .colors([
                 '#c0392b',
                 '#16a085',
                 '#f1c40f'
            ])
        .colorDomain([1,3])
        .innerRadius(50)
        .filter("Abaixo")
        .colorAccessor(function(d, i){return i%3+1;});

dc.dataCount("#count-info")
    .dimension(cf)
    .group(all);
        
mapa_municipios.width(800).height(800)
        .dimension(cf.codigo)
        .group(codigo)
        .colors(['#ecf0f1', '#16a085'])
        .colorDomain([0, 1])
        .colorAccessor(function (d) {
            if(d>0){
                return 1;
            } else {
                return 0;
            }
        })
        .overlayGeoJson(municipios.features, "municipios", function (d) {
            return d.properties.CD_GEOCODM;
        })
        .projection(d3.geo.mercator()
            .center(center_points)
            .scale(map_scale))
        .title(function(d){
            return d.key;
        });
        
dc.renderAll();  

var projection = d3.geo.mercator()
    .center(center_points)
    .scale(map_scale);

var path = d3.geo.path()
    .projection(projection);

var g = d3.selectAll("#mapa")
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
    
var mapLabels = d3.selectAll("#mapa")
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
