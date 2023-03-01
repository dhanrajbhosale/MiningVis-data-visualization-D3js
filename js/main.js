window.onload = function() {
    // on load values
    startYear = document.getElementById("startYear").value;
    endYear = document.getElementById("endYear").value;
    selectTimeline();
    drawLegend();
    drawSankeyChart("1Hash",startYear,endYear)
    document.getElementById("selectall").checked = true;
    drawRibbonChart();
    drawChordChart();
    drawStackedBarChart(startYear, endYear);
    drawBarChart('1Hash',startYear,endYear);
    drawBeeSwarmChart();

};

let pools = []
let globalPoolNames = ["1Hash", "AntPool", "BitFury", "BTC.com", "BW.COM", "DeepBit", "GBMiners", "KanoPool", "Poolin", "ViaBTC"]
let globalPoolColors = ["rgb(78, 121, 167)", "rgb(242, 142, 44)", "rgb(225, 87, 89)", "rgb(118, 183, 178)", "rgb(89, 161, 79)", "rgb(237, 201, 73)", "rgb(175, 122, 161)", "rgb(255, 157, 167)", "rgb(156, 117, 95)", "rgb(186, 176, 171)"]
let colors = ["Hash", "AntPool", "BitFury", "BTC", "BW", "DeepBit", "GBMiners", "KanoPool", "Poolin", "ViaBTC"]

let color = d3.scaleOrdinal()
        .domain(colors)
        .range(globalPoolColors);

function toggle(source) {
    if (source.checked) {
        d3.selectAll(".mydots").style("opacity", 1);
        d3.selectAll(".ribbon_div").selectAll("path").style("opacity", 1)
    } else {
        d3.selectAll(".mydots").style("opacity", 0.2);
        d3.selectAll(".ribbon_div").selectAll("path").style("opacity", .2)
        pools = [];
    }
};

function selectTimeline() {

let pools = []
function toggle(source) {
    var checkboxes = document.querySelectorAll('input[class="pool-selected"]');
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i] != source)
            checkboxes[i].checked = source.checked;
    }
    if (source.checked) {
        checkboxes.forEach(e => {
            pools.push(e.id)
        })
    } else {
        pools = []
    }
    //drawribbonchart()
};

    // set the dimensions and margins of the graph
    document.getElementById("timeline_svg").innerHTML = " ";

    timeLineMargin = {
            top: 10,
            right: 30,
            bottom: 30,
            left: 60
        },
        timeLineWidth = 1510 - timeLineMargin.left - timeLineMargin.right,
        timeLineHeight = 100 - timeLineMargin.top - timeLineMargin.bottom;

    // append the svg object to the body of the page
    timeLineSvg = d3.select("#timeline_svg")
        .attr("width", timeLineWidth + timeLineMargin.left + timeLineMargin.right)
        .attr("height", timeLineHeight + timeLineMargin.top + timeLineMargin.bottom)
        .append("g")
        .attr("transform", `translate(${timeLineMargin.left},${timeLineMargin.top})`);

    // Add X axis --> it is a date format
    timeLineX = d3.scaleTime();
    timeLineXControl = timeLineSvg.append("g")
        .attr("class", "myTimeLineX");
    // Add Y axis --> it is a date format
    timeLineY = d3.scaleLinear();
    timeLineYControl = timeLineSvg.append("g")
        .attr("class", "myTimeLineY");

    reDrawSelectTimeline();
}

function reDrawSelectTimeline() {
//Read the data
d3.csv("/data/stats.csv",

  // When reading the csv, I must format variables:
  function(d){
    dt = d3.timeParse("%Y-%m-%d")(d.date)
    d.date = dt
    return d
  }).then(

  // Now I can use this dataset:
  function(timeLineDataInput) {

    const timeLineData = timeLineDataInput.filter(date => endYear >= date.date.getFullYear() && date.date.getFullYear()>= startYear);

    
var attr = document.getElementById('Stats').value;  

    timeLineX.domain(d3.extent(timeLineData, function(d) { return d.date; }))
      .range([ 0, timeLineWidth ]);

      timeLineXControl
      .attr("transform", `translate(0, ${timeLineHeight})`)
      .transition().duration(1000)
      .call(d3.axisBottom(timeLineX));

    timeLineY
      .domain([0, d3.max(timeLineData, function(d) { return +d[attr]; })])
      .range([timeLineHeight,0]);

    timeLineYControl
      .call(d3.axisLeft(timeLineY).ticks(4,'.2s'));

      timeLineSvg.selectAll(".myTimeLinePath").remove();
    // Add the line
    timeLineSvg
      .datum(timeLineData)
      .append("path")
      .attr("class", "myTimeLinePath")
      .transition()
      .duration(2000)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return timeLineX(d.date) })
        .y(function(d) { return timeLineY(+d[attr]) })
        );
        });

}

function myYearRange() {
    startYear = document.getElementById("startYear").value;
    endYear = document.getElementById("endYear").value;
    reDrawSelectTimeline();
    document.getElementById("selectall").checked = true;
    d3.selectAll(".mydots").style("opacity", 1);
    d3.selectAll(".ribbon_div").selectAll("path").style("opacity", 1)
    drawChordChart();
    drawRibbonChart();
    drawSankeyChart("1Hash",startYear,endYear)
    drawStackedBarChart(startYear, endYear);

}

function drawLegend() {
    uniLegend = document.getElementById("unilegend");
    var SVG = d3.select("#unilegend")
    var size = 20
    SVG.selectAll("mydots")
        .data(colors)
        .enter()
        .append("rect")
        .attr("class", function(d) {
            return "mydots " + d
        })
        .attr("x", 10)
        .attr("y", function(d, i) {
            return 20 + i * (size + 5)
        }) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("width", size)
        .attr("height", size)
        .style("fill", function(d) {
            return color(d)
        })
        .on('click', (d, i, n) => {
            index = pools.indexOf(i);
            document.getElementById("selectall").checked = false;
            if (index > -1) { // only splice array when item is found
                pools.splice(index, 1); // 2nd parameter means remove one item only
                d3.selectAll("." + i).style("opacity", 0.2)
                fillcheck = d3.selectAll("." + i)._groups[0][0].attributes['style'].value;
                d3.selectAll(".ribbon_div").selectAll("path").filter(function(d,i,n) {
                                for(i in n){
                                    if(n[i].attributes && fillcheck.includes(n[i].attributes['fill'].value)){
                                                                                         n[i].setAttribute("style", "opacity: 0.2");
                                                                                         }
                                }
                                })

            } else {
                pools.push(i);
                d3.selectAll(".mydots").style("opacity", 0.2);
                d3.selectAll(".ribbon_div").selectAll("path").style("opacity", 0.2);
                d3.selectAll(".ribbon_div").selectAll("path").filter(function(d,i,n) {
                for(i in n){
                                for (p in pools){
                                                 d3.selectAll("." + pools[p])
                                                     .style("opacity", 1)
                                                     fillcheck = d3.selectAll("." + pools[p])._groups[0][0].attributes['style'].value;
                                                     if(n[i].attributes && fillcheck.includes(n[i].attributes['fill'].value)){
                                                     n[i].setAttribute("style", "opacity: 1")
                                                     }
                                                }
                }
                 });
                groups = (d3.selectAll(".ribbon_div").selectAll("path"))._groups[0];
            }
        })

    // Add one dot in the legend for each name.
    SVG.selectAll("mylabels")
        .data(globalPoolNames)
        .enter()
        .append("text")
        .attr("x", 10 + size * 1.2)
        .attr("y", function(d, i) {
            return 25 + i * (size + 5) + (size / 2)
        }) // 100 is where the first dot appears. 25 is the distance between dots
        .text(function(d) {
            return d
        })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .on('click', (d, i, n) => {
            index = pools.indexOf(i);
//            d3.selectAll(document.getElementById("ribbon_div")).selectAll("path").style("opacity", .2)
//            if (index > -1) { // only splice array when item is found
//                pools.splice(index, 1); // 2nd parameter means remove one item only
//                d3.select(this).style("opacity", 0.2)
//            } else {
//                pools.push(i);
//                d3.select(this).style("opacity", 1)
//            }
        })

}

var margin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
},
width = 780 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;

// Set the sankey diagram properties
var sankeyChart = d3.sankey()
    .nodeWidth(36)
    .nodePadding(40)
    .size([width, height]);

function drawSankeyChart(curr_pool,startYear,endYear) {

    var margin = {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        },
        width = 900 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // format variables
    var formatNumber = d3.format(",.0f"), // zero decimal places
        format = function(d) {
            return formatNumber(d);
        };

document.getElementById("sankey_svg").innerHTML = " "
  // append the svg object to the body of the page
  var svg = d3.select("#sankey_svg").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
          "translate(" + 40 + "," + margin.top + ")");

  d3.csv("data/pool_hopping.csv",  function(d){
    dt = d3.timeParse("%Y-%m-%d")(d.date)
    d.date = dt
    return d
  }).then(dat => {

    let data = dat.filter(date => endYear >= date.date.getFullYear() && date.date.getFullYear()>= startYear);
    var sv = curr_pool

    to_data = data.filter(d=>d.type==="after" && d.miner===sv);
    to_counts = {}
    to_data.forEach(d => {
        to_counts[d.to_miner] = (to_counts[d.to_miner] || 0) + 1
    })

    from_data = data.filter(d=>d.type==="after" && d.to_miner===sv);
    from_counts = {}
    from_data.forEach(d => {
        from_counts[d.miner] = (from_counts[d.miner] || 0) + 1
    })

    nodes = []
    links = []

    ind = 0
    nodes.push({name:sv, node:ind, color: color(sv.split('.')[0])})

    Object.entries(to_counts).forEach(([key, value]) => {
        ind++;
        nodes.push({name:key, node:ind, color: color(key.split('.')[0])})
        links.push({source:ind, target:0, value:value, color: color(key.split('.')[0])})
    })

    Object.entries(from_counts).forEach(([key, value]) => {
        ind++;
        nodes.push({name:key, node:ind, color: color(key.split('.')[0])})
        links.push({source:0, target:ind, value:value, color: color(key.split('.')[0])})
    })

    sankeydata = {
        nodes: nodes,
        links: links
    }

    graph = sankeyChart(sankeydata);

    let tooltip = d3
    .select("#sankey_tooltip")
    // .append("div")
    .attr("class", "sankey_tooltip")
    .style("opacity", 0)
    .style("border", "solid")
       .style("border-width", "1px")
       .style("border-radius", "5px")
       .style("padding", "5px");

const mouseover = function(i,d) {
        // for tooltip
        d3.select('#sankey_tooltip')
        .style('left', i.pageX + 'px')
        .style('top', i.pageY + 'px')
      d3.select('#sankey_tooltip').classed('hidden', false);

      tooltip
          .html(`<p>${(d.source.name)} &#8594 ${d.target.name} | <b>${d.value}</b></p>`)
          .style("color",d3.rgb(d.color))
          .style("opacity", 1);

      // For Path
        d3.select(this.parentElement).selectAll("path").style("opacity", .2)
        d3.select(this)
          .style("opacity", 1)
      }

      const mousemove = function(i, d) {
          // for tooltip
          d3.select('#sankey_tooltip')
              .style('left', (i.pageX) + 'px')
              .style('top', (i.pageY) - 40 + 'px')
          d3.select('#sankey_tooltip').classed('hidden', false);
      }
      
      const mouseleave = function(event,d) {
           // For Tooltip
           tooltip
           .style("opacity", 0);
           // for path
          d3.select(this.parentElement).selectAll("path").style("opacity", 0.85)
         }    

const mouseonnode = function(i,d) {
    d3.select('#sankey_tooltip')
        .style('left', i.pageX + 'px')
        .style('top', i.pageY + 'px')
      d3.select('#sankey_tooltip').classed('hidden', false);

      tooltip
          .html(`<p>${(d.name)} ${':'} ${d.value}</p>`)
          .style("color",d3.rgb(d.color))
          .style("opacity", 1);

}
    // add in the nodes
    var link = svg.append("g").selectAll(".link")
        .data(graph.links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", d3.sankeyLinkHorizontal())
        .attr("stroke-width", function(d) {
            return d.width;
        })
        .style("stroke", function(d) {
            return d3.rgb(d.color)
        }).on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

    var node = svg.append("g").selectAll(".node")
        .data(graph.nodes)
        .enter().append("g").on("mouseover",  mouseonnode) 
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)


    // add the rectangles for the nodes
    node.append("rect")
        .attr("x", function(d) {
            return d.x0;
        })
        .attr("y", function(d) {
            return d.y0;
        })
        .attr("height", function(d) {
            return d.y1 - d.y0;
        })
        .attr("width", sankeyChart.nodeWidth())
        .style("fill", function(d) {
            return d3.rgb(d.color)
        })
        .append("title")
        

    // add in the title for the nodes
    node.append("text")
        .attr("x", function(d) {
            return d.x0 + 40;
        })
        .attr("y", function(d) {
            return (d.y1 + d.y0) / 2;
        })
        .attr("dy", "0.35em")
        .attr("text-anchor", "left")
        .text(function(d) {
            return d.name;
        })
        .filter(function(d) {
            return d.x0 < width / 2;
        })
        .attr("x", function(d) {
            return d.x1 + 6;
        })
        .attr("text-anchor", "left");

  });
  
  d3.sankey = function() {
      var sankey = {},
          nodeWidth = 24,
          nodePadding = 8,
          size = [1, 1],
          nodes = [],
          links = [];

      sankey.nodeWidth = function(_) {
          if (!arguments.length) return nodeWidth;
          nodeWidth = +_;
          return sankey;
      };

      sankey.nodePadding = function(_) {
          if (!arguments.length) return nodePadding;
          nodePadding = +_;
          return sankey;
      };

      sankey.nodes = function(_) {
          if (!arguments.length) return nodes;
          nodes = _;
          return sankey;
      };

      sankey.links = function(_) {
          if (!arguments.length) return links;
          links = _;
          return sankey;
      };

      sankey.size = function(_) {
          if (!arguments.length) return size;
          size = _;
          return sankey;
      };

      sankey.layout = function(iterations) {
          computeNodeLinks();
          computeNodeValues();
          computeNodeBreadths();
          computeNodeDepths(iterations);
          computeLinkDepths();
          return sankey;
      };

      sankey.relayout = function() {
          computeLinkDepths();
          return sankey;
      };

      sankey.link = function() {
          var curvature = .5;

          function link(d) {
              var x0 = d.source.x + d.source.dx,
                  x1 = d.target.x,
                  xi = d3.interpolateNumber(x0, x1),
                  x2 = xi(curvature),
                  x3 = xi(1 - curvature),
                  y0 = d.source.y + d.sy + d.dy / 2,
                  y1 = d.target.y + d.ty + d.dy / 2;
              return "M" + x0 + "," + y0 +
                  "C" + x2 + "," + y0 +
                  " " + x3 + "," + y1 +
                  " " + x1 + "," + y1;
          }

          link.curvature = function(_) {
              if (!arguments.length) return curvature;
              curvature = +_;
              return link;
          };

          return link;
      };

      // Populate the sourceLinks and targetLinks for each node.
      // Also, if the source and target are not objects, assume they are indices.
      function computeNodeLinks() {
          nodes.forEach(function(node) {
              node.sourceLinks = [];
              node.targetLinks = [];
          });
          links.forEach(function(link) {
              var source = link.source,
                  target = link.target;
              if (typeof source === "number") source = link.source = nodes[link.source];
              if (typeof target === "number") target = link.target = nodes[link.target];
              source.sourceLinks.push(link);
              target.targetLinks.push(link);
          });
      }

      // Compute the value (size) of each node by summing the associated links.
      function computeNodeValues() {
          nodes.forEach(function(node) {
              node.value = Math.max(
                  d3.sum(node.sourceLinks, value),
                  d3.sum(node.targetLinks, value)
              );
          });
      }

      // Iteratively assign the breadth (x-position) for each node.
      // Nodes are assigned the maximum breadth of incoming neighbors plus one;
      // nodes with no incoming links are assigned breadth zero, while
      // nodes with no outgoing links are assigned the maximum breadth.
      function computeNodeBreadths() {
          var remainingNodes = nodes,
              nextNodes,
              x = 0;

          while (remainingNodes.length) {
              nextNodes = [];
              remainingNodes.forEach(function(node) {
                  node.x = x;
                  node.dx = nodeWidth;
                  node.sourceLinks.forEach(function(link) {
                      if (nextNodes.indexOf(link.target) < 0) {
                          nextNodes.push(link.target);
                      }
                  });
              });
              remainingNodes = nextNodes;
              ++x;
          }

          //
          moveSinksRight(x);
          scaleNodeBreadths((size[0] - nodeWidth) / (x - 1));
      }

      function moveSourcesRight() {
          nodes.forEach(function(node) {
              if (!node.targetLinks.length) {
                  node.x = d3.min(node.sourceLinks, function(d) {
                      return d.target.x;
                  }) - 1;
              }
          });
      }

      function moveSinksRight(x) {
          nodes.forEach(function(node) {
              if (!node.sourceLinks.length) {
                  node.x = x - 1;
              }
          });
      }

      function scaleNodeBreadths(kx) {
          nodes.forEach(function(node) {
              node.x *= kx;
          });
      }

      function computeNodeDepths(iterations) {
          var nodesByBreadth = d3.nest()
              .key(function(d) {
                  return d.x;
              })
              .sortKeys(d3.ascending)
              .entries(nodes)
              .map(function(d) {
                  return d.values;
              });

          //
          initializeNodeDepth();
          resolveCollisions();
          for (var alpha = 1; iterations > 0; --iterations) {
              relaxRightToLeft(alpha *= .99);
              resolveCollisions();
              relaxLeftToRight(alpha);
              resolveCollisions();
          }

          function initializeNodeDepth() {
              var ky = d3.min(nodesByBreadth, function(nodes) {
                  return (size[1] - (nodes.length - 1) * nodePadding) / d3.sum(nodes, value);
              });

              nodesByBreadth.forEach(function(nodes) {
                  nodes.forEach(function(node, i) {
                      node.y = i;
                      node.dy = node.value * ky;
                  });
              });

              links.forEach(function(link) {
                  link.dy = link.value * ky;
              });
          }

          function relaxLeftToRight(alpha) {
              nodesByBreadth.forEach(function(nodes, breadth) {
                  nodes.forEach(function(node) {
                      if (node.targetLinks.length) {
                          var y = d3.sum(node.targetLinks, weightedSource) / d3.sum(node.targetLinks, value);
                          node.y += (y - center(node)) * alpha;
                      }
                  });
              });

              function weightedSource(link) {
                  return center(link.source) * link.value;
              }
          }

          function relaxRightToLeft(alpha) {
              nodesByBreadth.slice().reverse().forEach(function(nodes) {
                  nodes.forEach(function(node) {
                      if (node.sourceLinks.length) {
                          var y = d3.sum(node.sourceLinks, weightedTarget) / d3.sum(node.sourceLinks, value);
                          node.y += (y - center(node)) * alpha;
                      }
                  });
              });

              function weightedTarget(link) {
                  return center(link.target) * link.value;
              }
          }

          function resolveCollisions() {
              nodesByBreadth.forEach(function(nodes) {
                  var node,
                      dy,
                      y0 = 0,
                      n = nodes.length,
                      i;

                  // Push any overlapping nodes down.
                  nodes.sort(ascendingDepth);
                  for (i = 0; i < n; ++i) {
                      node = nodes[i];
                      dy = y0 - node.y;
                      if (dy > 0) node.y += dy;
                      y0 = node.y + node.dy + nodePadding;
                  }

                  // If the bottommost node goes outside the bounds, push it back up.
                  dy = y0 - nodePadding - size[1];
                  if (dy > 0) {
                      y0 = node.y -= dy;

                      // Push any overlapping nodes back up.
                      for (i = n - 2; i >= 0; --i) {
                          node = nodes[i];
                          dy = node.y + node.dy + nodePadding - y0;
                          if (dy > 0) node.y -= dy;
                          y0 = node.y;
                      }
                  }
              });
          }

          function ascendingDepth(a, b) {
              return a.y - b.y;
          }
      }

      function computeLinkDepths() {
          nodes.forEach(function(node) {
              node.sourceLinks.sort(ascendingTargetDepth);
              node.targetLinks.sort(ascendingSourceDepth);
          });
          nodes.forEach(function(node) {
              var sy = 0,
                  ty = 0;
              node.sourceLinks.forEach(function(link) {
                  link.sy = sy;
                  sy += link.dy;
              });
              node.targetLinks.forEach(function(link) {
                  link.ty = ty;
                  ty += link.dy;
              });
          });

          function ascendingSourceDepth(a, b) {
              return a.source.y - b.source.y;
          }

          function ascendingTargetDepth(a, b) {
              return a.target.y - b.target.y;
          }
      }

      function center(node) {
          return node.y + node.dy / 2;
      }

      function value(link) {
          return link.value;
      }

      return sankey;
  };
}

function drawBeeSwarmChart() 
{
  //const timeLineData = timeLineDataInput.filter(date => endYear >= date.date.getFullYear() && date.date.getFullYear()>= startYear);
  let height = 250;
  let width = 840;
  let margin = { top: 0, right: 40, bottom: 34, left: 40 };

  // Data structure describing chart scales
  let Scales = {
    lin: "scaleLinear",
    log: "scaleLog",
  };

  // Data structure describing volume of displayed data
  let Count = {
    year: "year", //Changes
    ranking: "ranking",
  };

  // Data structure describing legend fields value
  let Legend = {
    year: "year", //Changes
    ranking: "ranking",
  };

  let chartState = {};

  chartState.measure = Count.year;
  chartState.scale = Scales.lin; //Changes
  chartState.legend = Legend.year;

  let colors = d3
    .scaleOrdinal()
    .domain(["Miner", "Bitcoin", "Crypto", "Invest", "Bank"])
    .range(["#050ce6", "#1976D2", "#388E3C", "#FBC02D", "#E64A19"]); //Changes

  d3.select("#Miner").style("color", colors("Miner"));
  d3.select("#Bitcoin").style("color", colors("Bitcoin"));
  d3.select("#Crypto").style("color", colors("Crypto"));
  d3.select("#Invest").style("color", colors("Invest"));
  d3.select("#Bank").style("color", colors("Bank")); //Changes

  let svg = d3
    .select("#beeswarm_div")
    .append("svg")
    .attr("width", 840)
    .attr("height", 255)
    .attr("id","bee_svg");

  //let years = [2014, 2015, 2016,2017,2018,2019,2020];

  var dateWithYear = function (year) {
    return new Date().setFullYear(year);
  };

  const yearStart = 2014;
  const yearEnd = 2019;
  const leftMargin = 40;
  const yearDiff = yearEnd - yearStart + 1;
  const xAxisRangeStart = margin.left;
  const xAxisRangeEnd = width - margin.right;

  const xScaleFactor = (xAxisRangeEnd - xAxisRangeStart) / yearDiff;

  let xScale = d3
    .scaleTime()
    .domain([dateWithYear(yearStart), dateWithYear(yearEnd)])
    .range([xAxisRangeStart, xAxisRangeEnd])
    .nice(); //Changes
  //let xScale = d3.scaleTime().domain([dateWithYear(2014), dateWithYear(2019)]).nice();
  let xAxis = d3.axisBottom().scale(xScale);
  svg
    .append("g")
    .call(xAxis)
    .attr("transform", "translate(0," + (height - margin.bottom) + ")");

  let tooltip = d3
    .select("#tooltip")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("border", "solid")
       .style("border-width", "1px")
       .style("border-radius", "5px")
       .style("padding", "5px");

    /*const tooltip = d3.select("#beeswarm_div")
       .append("div")
       .style("opacity", 0)
       .attr("class", "tooltip")
       .style("background-color", "white")
       .style("border", "solid")
       .style("border-width", "1px")
       .style("border-radius", "5px")
       .style("padding", "5px")*/

  // Load and process data
  d3.csv("/data/News_data_Naya.csv")
    .then(function (data) {
      let dataSet = data;
      redrawBeeswarm();
      d3.selectAll("input").on("change", filter);

      function redrawBeeswarm() {
        
       /*d3.select("svg").selectAll('*').remove();
        xScale.domain(
          d3.extent(dataSet, function (d) {
            return +d[chartState.measure];
          })
        ); *///Isko dekh yeha pe Xaxis ka domain
        //let xAxis;
        xScale = d3
          .scaleTime()
          .domain([yearStart, yearEnd])
          // .domain([dateWithYear(yearStart), dateWithYear(yearEnd)])
          //.range([margin.left, width - margin.right])
          .range([xAxisRangeStart, xAxisRangeEnd])
          .nice();
        xAxis = d3.axisBottom().scale(xScale); 
       /* svg
          .append("g")
          .call(xAxis)
          .attr("transform", "translate(0," + (height - margin.bottom) + ")");*/

        d3.transition(svg)
          .select(".x.axis")
          .transition()
          .duration(1000)
          .call(xAxis);
        let simulation = d3
          .forceSimulation(dataSet)
          .force("x",
            d3
              .forceX(function (d) {
                
                return +xScale(d.year);
              })
              .strength(2)
          )
          .force("y", d3.forceY(height / 2 - margin.bottom / 2)) // // Apply positioning force to push nodes towards center along Y axis
          /* .force("y", d3.forceY().y(function(d){
                  return 0;
            }))*/
          .force("collide", d3.forceCollide(9)) // Apply collision force with radius of 9 - keeps nodes centers 9 pixels apart
          .stop(); // Stop simulation from starting automatically
        // Manually run simulation
        for (let i = 0; i < dataSet.length; ++i) {
          simulation.tick(10);
        }

        // Create country circles
        let countriesCircles = svg
          .selectAll(".countries")
          .data(dataSet, function (d) {
            return d.Keywords;
          });

        // countriesCircles
        //   .exit()
        //   .transition()
        //   .duration(1000)
        //   .attr("cx", 100)
        //   .attr("cy", 100)
        //   .remove();

        countriesCircles
          .exit()
          .transition()
          .duration(1000)
          .attr("cx", leftMargin)
          .attr("cy", height / 2 - margin.bottom / 2)
          .remove();

        countriesCircles
          .enter()
          .append("circle")
          .attr("class", "countries")
          .attr("cx", leftMargin)
          .attr("cy", height / 2 - margin.bottom / 2)
          .attr("r", function(d){
            return 4+(0.6*(d.ranking));
          })
          .attr("fill", function (d) {
            return colors(d.Keywords);
          })
          .merge(countriesCircles)
          .transition()
          .duration(2000)
          .attr("cx", function (d) {
            const a = d.year - 2014;
            const b = xScale(d.year - 2014);

            return a * xScaleFactor + leftMargin;
          })
          .attr("cy", function (d) 
          {
            return +d.y;
          });

        // Show tooltip when hovering over circle (data for respective country)
        d3.selectAll(".countries")
          .on("mousemove", function (event,d) {
            d3.select('#tooltip')
          .style('left', (event.pageX + 25) + 'px')
          .style('top', (event.pageY - 12) + 'px')
          d3.select('#tooltip').classed('hidden', false);

            tooltip
              .html(
                `Terms: <strong>${d.Keywords}</strong><br> Years: <strong>${d.year}</strong>`
              )
              .style("color", "#0d090b")
              .style("opacity", 0.9);

             d3.select(this).transition()
                .duration('100')
                .attr("r", 4+(0.6*(d.ranking))+5);
          })
          .on("mouseout", function (event,d) {
            tooltip.style("opacity", 0);
            //xLine.attr("opacity", 0)

            d3.select(this).transition()
                .duration('100')
                .attr("r", 4+(0.6*(d.ranking)));
          })
          .on("click", function(event,d)
          {
            window.open(d.link,'_blank');
          });
      }

      // Filter data based on which checkboxes are ticked
      function filter() {
        function getCheckedBoxes(checkboxName) {
          let checkboxes = d3.selectAll(checkboxName).nodes();
          let checkboxesChecked = [];
          for (let i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].checked) {
              checkboxesChecked.push(checkboxes[i].defaultValue);
            }
          }
          return checkboxesChecked.length > 0 ? checkboxesChecked : null;
        }

        let checkedBoxes = getCheckedBoxes(".continent");

        let newData = [];

        if (checkedBoxes == null) {
          dataSet = newData;
          redrawBeeswarm();
          return;
        }

        for (let i = 0; i < checkedBoxes.length; i++) {
          let newArray = data.filter(function (d) {
            return (d.Keywords === checkedBoxes[i]) ;
          });
          Array.prototype.push.apply(newData, newArray);
        }
        dataSet = newData;
        redrawBeeswarm();
      }
    })
    .catch(function (error) {
      if (error) throw error;
    });
   
}

function drawRibbonChart() {

var attr = document.getElementById('groups').value;
    svg = document.getElementById("ribbon_div");
    filename = "data/totalreward.csv"
    if(attr == "size" || attr == "reward"){
    filename = "data/total"+attr+".csv"
    }
    d3.selectAll(".mydots").style("opacity", 1);
    pools = [];
    svg.removeChild(svg.lastChild);

    d3.csv(filename, function(d) {
            dt = d3.timeParse("%Y-%m")(d.Time)
        d.date = dt
        return d
    }).then(

        // Now I can use this dataset:
        function(ribbonDataInput) {

            const timeLineData = ribbonDataInput.filter(date => endYear >= date.date.getFullYear() && date.date.getFullYear() >= startYear);
            svg.removeChild(svg.lastChild);
            p = Plot.plot({
                //height: 300,
                x: {
                    label: "Years",
                    nice: true
                },
                y: {
                    grid: true,
                    label: "rank (thousands)"
                },
                marks: [
                    Plot.areaY(timeLineData, Plot.stackY({
                        class: "ribbon_chart",
                        offset: "expand",
                        x: "date",
                        y: attr,
                        curve: "catmull-rom",
                        fill: "Relayed By",
                        order: "value"
                    })),
                    Plot.ruleY([0])
                ],
                color: {
                    type: "categorical",
                    domain: globalPoolNames,
                    range: globalPoolColors
                }
            })
            svg.appendChild(p);

            const mouseover = function(event, d) {
                d3.select(this.parentElement).selectAll("path").style("opacity", .2)
                pools = [];
                d3.select(this).style("opacity", 1)
            }
            const mouseout = function(event, d) {
                d3.selectAll("path").style("opacity", 1)
                d3.select(this)
                    .style("stroke", "black")
                    .style("opacity", 1)

            }
            const mousemove = function(event, d, i) {
                grp = d.key
            }
            const mouseleave = function(event, d) {
                d3.select(this.parentElement).selectAll("path").style("opacity", 1)
                document.getElementById("selectall").checked = true;
                pools = [];
                toggle(document.getElementById("selectall"));
            }

            annotations = d3.select(p).selectAll("g").selectAll("path").on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave);
        })
}


function drawChordChart() {
     chordWidth = 450
     chordHeight = 450 
     chordTickStep = 0.01

     chordOuterRadius = Math.min(chordWidth, chordHeight) * 0.5 - 60
     chordInnerRadius = chordOuterRadius - 10
    
     var myDiv = document.getElementById("chord_div");
     myDiv.removeChild( myDiv.lastChild);

     // create the svg area
    chordSvg = d3.select("#chord_div").append("svg")
    .attr("width", chordWidth)
    .attr("height", chordHeight)
    .attr("id","chord_svg")
    .append("g")
    .attr("transform", "translate(220,220)")

    //   create ribbon
    chordRibbon = d3.ribbon()
    .radius(chordInnerRadius - 1)
    .padAngle(1 / chordInnerRadius)
    // create arc
    chordArc = d3.arc()
    .innerRadius(chordInnerRadius)
    .outerRadius(chordOuterRadius)
    //   create chord
    chord = d3.chord()
    .padAngle(10 / chordInnerRadius)
    .sortSubgroups(d3.descending)
    .sortChords(d3.descending)
     reDrawChordChart();
}

function chordDataMapper(data){
    const minersList = {"1Hash":0, "AntPool":1, "BitFury":2, "BTC.com":3, "BW.COM":4, "DeepBit":5, "GBMiners":6, "KanoPool":7, "Poolin":8, "ViaBTC":9};
    const matrixLength = Object.keys(minersList).length;
    var matrix = new Array(matrixLength);
    for (var i = 0; i < matrixLength; i++) {
        matrix[i] = new Array(10).fill(0);
    }

    for (let d of data) {
        if (d.type=="cross" && d.to_miner=="CROSS"){
            matrix [minersList[d.miner]][minersList[d.miner]] += d.address;
        }else if (d.type=="cross" && minersList[d.to_miner] !== undefined){
            matrix [minersList[d.miner]][minersList[d.to_miner]] += d.address;
        }
      }
      return matrix;
}

function reDrawChordChart() {
    d3.csv("data/03_pool_hopping_month_address.csv", 
    function(d){
        d.date = d3.timeParse("%m/%d/%Y %H:%M")(d.date);
        d.address = parseInt(d.address);
        return d
      }).then(function(poolHoppingDataInput) {

        const poolHoppingData = poolHoppingDataInput.filter(data => endYear >= data.date.getFullYear() && data.date.getFullYear() >= startYear);
    // set const
    let chorDataMapped = chordDataMapper(poolHoppingData);

    chordDataWrapped = Object.assign(chorDataMapped, {
      names: globalPoolNames,
      colors: globalPoolColors
    })

    formatValue = d3.format(".1~%")

    chordColors = chordDataWrapped.colors === undefined ? d3.quantize(d3.interpolateRainbow, names.length) : chordDataWrapped.colors
    names = chordDataWrapped.names === undefined ? d3.range(chordDataWrapped.length) : chordDataWrapped.names

    const chords = chord(chordDataWrapped);

    const chordGroup = chordSvg.append("g")
    .attr("font-size", 10)
    .attr("font-family", "sans-serif")
    .selectAll("g")
    .data(chords.groups)
    .join("g");

    /////////////// Create the gradient fills //////////////////
    //Function to create the unique id for each chord gradient
    function getGradID(d){ return "linkGrad-" + d.source.index + "-" + d.target.index; }

    //Create the gradients definitions for each chord
    var grads = chordSvg.append("defs").selectAll("linearGradient")
	.data(chords)
   .enter().append("linearGradient")
    //Create the unique ID for this specific source-target pairing
	.attr("id", getGradID)
	.attr("gradientUnits", "userSpaceOnUse")
	//Find the location where the source chord starts
	.attr("x1", function(d,i) { return chordInnerRadius * Math.cos((d.source.endAngle-d.source.startAngle)/2 + d.source.startAngle - Math.PI/2); })
	.attr("y1", function(d,i) { return chordInnerRadius * Math.sin((d.source.endAngle-d.source.startAngle)/2 + d.source.startAngle - Math.PI/2); })
	//Find the location where the target chord starts
	.attr("x2", function(d,i) { return chordInnerRadius * Math.cos((d.target.endAngle-d.target.startAngle)/2 + d.target.startAngle - Math.PI/2); })
	.attr("y2", function(d,i) { return chordInnerRadius * Math.sin((d.target.endAngle-d.target.startAngle)/2 + d.target.startAngle - Math.PI/2); })

    //Set the starting color (at 0%)
    grads.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", function(d){ return chordColors[d.source.index]; });

    //Set the ending color (at 100%)
    grads.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", function(d){ return chordColors[d.target.index]; });

    // Draw Arc
    chordGroup.append("path")
    .style("fill", function(d) { return chordColors[d.index]; })
    .attr("d", chordArc);

    chordGroup.append("title")
    .text(d => `${names[d.index]}

    ${formatValue(d.value)}`);

    //  Ticks Section
    chordTickStep = d3.tickStep(0, d3.sum(chordDataWrapped.flat()), 20);
    function ticks({startAngle, endAngle, value}) {
        const k = (endAngle - startAngle) / value;
        return d3.range(0, value, chordTickStep).map(value => {
          return {value, angle: value * k + startAngle};
        });
      }

    const chordGroupTick = chordGroup.append("g")
    .selectAll("g")
    .data(ticks)
    .join("g")
      .attr("transform", d => `rotate(${d.angle * 180 / Math.PI - 90}) translate(${chordOuterRadius},0)`);

  chordGroupTick.append("line")
      .attr("stroke", "currentColor")
      .attr("x2", 6);

  chordGroupTick.append("text")
      .attr("x", 8)
      .attr("dy", "0.35em")
      .attr("transform", d => d.angle > Math.PI ? "rotate(180) translate(-16)" : null)
      .attr("text-anchor", d => d.angle > Math.PI ? "end" : null)
      .text(d => formatValue(d.value/100000));

  chordGroup.select("text")
      .attr("font-weight", "bold")
      .text(function(d) {return `${names[d.index]}`;
      });


       // Create a tooltip
       const tooltip = d3.select("#chord_tooltip")
    //    .append("div")
       .style("opacity", 0)
       .attr("class", "chord_tooltip")
       .style("background-color", "white")
       .style("border", "solid")
       .style("border-width", "1px")
       .style("border-radius", "5px")
       .style("padding", "5px")

      const mouseover = function(i,d) {
          // for tooltip
          d3.select('#chord_tooltip')
          .style('left', i.pageX + 'px')
          .style('top', i.pageY + 'px')
        d3.select('#chord_tooltip').classed('hidden', false);

        tooltip
            .html(`<p><b>${formatValue(d.source.value/100000)}</b> | ${names[d.target.index]}${d.source.index === d.target.index ? "" : ` &#8596 ${names[d.source.index]}`}</p>`)
            .style("color",chordColors[d.source.index])
            .style("opacity", 1);

        // For Path
          d3.select(this.parentElement).selectAll("path").style("opacity", .2)
          d3.select(this)
            .style("opacity", 1)
        }

        const mousemove = function(i, d) {
            // for tooltip
            d3.select('#chord_tooltip')
                .style('left', (i.pageX) + 'px')
                .style('top', (i.pageY) - 40 + 'px')
            d3.select('#chord_tooltip').classed('hidden', false);
        }
        
        const mouseleave = function(event,d) {
             // For Tooltip
             tooltip
             .style("opacity", 0);
             // for path
            d3.select(this.parentElement).selectAll("path").style("opacity", 0.85)
           }
          
        const onclick = function(event,d) {
            var curr_pool = names[d.source.index];
            drawSankeyChart(curr_pool,startYear,endYear)
        }

    //   Draw Ribbon
    chordSvg.append("g")
    .attr("fill-opacity", 0.85)
    .selectAll("path")
    .data(chords)
    .join("path")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
    .on("click", onclick)
    .style("mix-blend-mode", "multiply")
    .style("fill", function(d){ return "url(#" + getGradID(d) + ")"; })
    .attr("d", chordRibbon)
    .append("title");
})
}

function drawStackedBarChart(startYear, endYear) {
  // set the dimensions and margins of the graph
  const margin = { top: 20, right: 30, bottom: 20, left: 50 },
    width = 460 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg = d3
    .select("#stacked_bar_svg")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Parse the Data
  d3.csv("data/data2.csv", function(d) {
                dt = d3.timeParse("%Y")(d.year)
            d.date = dt
            return d
        }).then(

            // Now I can use this dataset:
            function(data) {

                const timeLineData = data.filter(date => endYear >= date.date.getFullYear() && date.date.getFullYear() >= startYear);
    const subgroups = globalPoolNames;

    d3.selectAll(".stackbar").remove()
    d3.selectAll(".classx").remove()
    d3.selectAll(".classy").remove()

    const firstFilteredData = timeLineData.filter((item) => {
      return subgroups.includes(item["Relayed By"]);
    });
    const filteredData2 = firstFilteredData.map((item) => {
      return {
        ...item,
        year: item.year,
        ...subgroups.reduce((a, i) => {
          return {
            ...a,
            [i]: 0,
          };
        }, {}),
        [item["Relayed By"]]: parseInt(item["Reward (BTC)"], 10),
      };
    });

      const filteredData3 = filteredData2.reduce((a, item) => {
      const existingItem = a[item.year] ?? item;

      existingItem[item["Relayed By"]] = item[item["Relayed By"]];

      return {
        ...a,
        [item.year]: existingItem,
        // [item["Relayed By"]]: item["Reward (BTC)"],
      };
    }, {});

    const filteredData = Object.values(filteredData3);

    //    const subgroups = ["Reward (BTC)", "Average Tx Fees (BTC)", "Fees (BTC)"]
    //    const subgroups = [ "BTC Guild", "BitMinter"] // , "AntPool", "BitFury", "BTC.com", "BW.COM", "DeepBit", "GBMiners", "KanoPool", "Poolin", "ViaBTC"]

    // List of groups = species here = value of the first column called group -> I show them on the X axis
    const groups = filteredData.map((d) => d.year);

    const a = height;
    // Add X axis
    const x = d3.scaleBand().domain(groups).range([height, 0]).padding([0.4]);
    svg
      .append("g")
      .attr("class", "classx")
      .attr("transform", `translate(0, 0)`)
      // .attr("transform", `translate(0, ${height})`)
      .call(d3.axisLeft(x).tickSizeOuter(0));

    // Add Y axis
    const y = d3.scaleLinear().domain([200, 0]).range([400, 0]);
    // svg.append("g").call(d3.axisLeft(y));
    svg
      .append("g")
      .attr("class", "classy")
      .call(d3.axisBottom(y))
      .attr("transform", `translate(0,${height})`);

    // color palette = one color per subgroup
    var color = d3
      .scaleOrdinal()
      .domain(subgroups)
      .range(globalPoolColors);

    // stack the data? --> stack per subgroup
    var stackedData = d3.stack().keys(subgroups)(filteredData);


        // Create a tooltip
               const tooltip = d3.select("#bar_tooltip")
            //    .append("div")
               .style("opacity", 0)
               .attr("class", "bar_tooltip")
               .style("background-color", "white")
               .style("border", "solid")
               .style("border-width", "1px")
               .style("border-radius", "5px")
               .style("padding", "5px")

              const mouseover = function(i,d) {
                  // for tooltip
                  d3.select('#bar_tooltip')
                  .style('left', i.pageX + 'px')
                  .style('top', i.pageY + 'px')
                d3.select('#bar_tooltip').classed('hidden', false);

                tooltip
                    .html(`<p>${[d.key]}</p>`)
                    .style("color",color(d.key))
                    .style("opacity", 1);

                // For Path
                  d3.selectAll(".stackbar").style("opacity", 0.2)
                  d3.select(this)
                    .style("opacity", 1)
                }
                        const mouseleave = function(event,d) {
                             // For Tooltip
                             tooltip
                             .style("opacity", 0);
                             d3.selectAll(".stackbar").style("opacity", 1)
                           }


    const mouseout = function(event, d) {
        // d3.selectAll(this.element).selectAll("rect").style("opacity", 0.5);
        // d3.select(this)
        //     .style("opacity", 0.5)

        svg.selectAll(".stackbar")
                .style("opacity", 1);
            d3.select(this)
                .style("opacity", 1)
    }

    const onclick = function(d,i,n) {
                var curr_pool = i.key;
        drawBarChart(curr_pool,startYear,endYear);
    }

    // Show the bars
    svg
      .append("g")
      .attr("transform", "translate(0,0)")
      .selectAll(".stackbar")
      // Enter in the stack data = loop key per key = group per group
      .data(stackedData)
      .join("g")
      .style("opacity", 1)
      .attr("fill", (d) => color(d.key))
      .attr("class", "stackbar")
      .on("mouseover", mouseover)
      .on("mouseleave", mouseleave)
      .on("click", onclick)
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data((d, d2, d3) => {
        const a = stackedData;
        return d;
      })
      .join("rect")
      .attr("y", function (d) {
        return x(d.data.year);
      })
      .attr("x", (d) => y(d[0]))
      // .attr("y", (d) => y(d[0]))
      .attr("width", (d) => {
        window.AZ = y;
        return y(d[1]) - y(d[0]);
        // return y(d[1]) - y(d[0]);
        // return y(d[0]) - y(d[1]);
      })
      .attr("height", x.bandwidth())

//    const annotations = d3.selectAll("g").selectAll("rect").
//        on("click", onclick);

  });
}

function drawBarChart(curr_pool, startYear, endYear) {
 
    const margin = {
        top: 20,
        right: 30,
        bottom: 30,
        left: 40
    },
    width = 400 - margin.left - margin.right,
    height = 275 - margin.top - margin.bottom;

    const subgroups = globalPoolNames;

    var color = d3
    .scaleOrdinal()
    .domain(subgroups)
    .range(globalPoolColors);

// append the svg object to the body of the page
document.getElementById("bar_svg").innerHTML = " "
const svg = d3.select("#bar_svg")
    .append("svg")
    .attr("width", width + margin.left + margin.right + 60)
    .attr("height", height + margin.left + margin.right)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Parse the Data
d3.csv("data/data2.csv")
    .then(function(dat) {

        data = dat.filter( function (d){
            
            if(d["Relayed By"] == curr_pool)
                {
                    return d;
                }});

        // X axis
        const x = d3.scaleBand()
            .range([0, width + 100])
            .domain(data.map(d => d.year))
            .padding(0.3);
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        // Add Y axis
        const y = d3.scaleLinear()
            .domain([0, 51])
            .range([height, 0]);
            
        svg.append("g")
            .call(d3.axisLeft(y))
            .attr("text", "Reward (BTC)");
            
        // Bars
        svg.selectAll("mybar")
            .data(data)
            .join("rect")
            .style("opacity", 1)
            .attr("x", d => x(d.year))
            .attr("y", d => y(d["Reward (BTC)"]))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d["Reward (BTC)"]))
            .attr("fill", color(curr_pool));

        // text label for the y axis
        svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .attr("font-size", "11px")
        .style("text-anchor", "middle")
        .text("Reward (BTC) USD");  
//
//        var mouseover = function(event, d) {
//            d3.select(this.parentElement).selectAll("rect").style("opacity", 0.2)
//            d3.select(this)
//                .style("opacity", 1)
//        }
//
//        var mouseout = function(event, d) {
//            d3.select(this.parentElement).selectAll("rect").style("opacity", 0.7);
//            d3.select(this)
//                .style("opacity", 0.7)
//
//        }
//
//        var mouseleave = function(event, d) {
//            d3.select(this.parentElement).selectAll("rect").style("opacity", 0.7);
//            d3.select(this)
//                .style("opacity", 0.7)
//
//        }
//
//        annotations = d3.selectAll("g").selectAll("rect").on("mouseover", mouseover)
//                .on("mouseout", mouseout)
//                .on("mouseleave", mouseleave);
    })
}

