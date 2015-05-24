// var keysPressed =

var chartProperties = {
  width: 800,
  height: 800,
  radius: 300,
  transitionDuration: 500
};
var data = [];
// var data = [{letter: 'A', count: 1},
//     {letter: 'B', count: 2},
//     {letter: 'C', count: 3}];
// var data = [1, 2, 3];

var color = d3.scale.category20();

var pie = d3.layout.pie()
  .value(function(d){ return d.count; })
  .sort(null);

var arc = d3.svg.arc()
    .innerRadius(chartProperties.radius - 100)
    .outerRadius(chartProperties.radius);

var chart = d3.select('body')
              .append('svg')
              .attr('height', chartProperties.height)
              .attr('width', chartProperties.width)
              .append("g")
              .attr("transform", "translate(" +
              chartProperties.width / 2 +
              "," + chartProperties.height / 2 + ")");

d3.select('body').on('keydown', function(d) {
  // bind data and append
  var character = String.fromCharCode(d3.event.keyCode);
  var exists = false;
  data.forEach(function(item) {
    if (item.letter === character) {
      item.count++;
      update(data);
      exists = true;
    }
  });

  if (!exists) {
    data.push({
      letter: character,
      count: 1
    });
    var path = chart.selectAll("path")
        .data(pie(data));
    path.transition().duration(chartProperties.transitionDuration)
      .attrTween("d", arcTween);
    path.enter().append("path")
        .attr("fill", function(d, i) { return color(i); })
        .attr("d", arc)
        .each(function(d){ this._current = d; })
        .append('text')
        .text(function(d) {return d.letter;});
  }

  //update(data);

});

var update = function(data) {
    var path = chart.selectAll("path")
        .data(pie(data));
    path.transition().duration(chartProperties.transitionDuration)
      .attrTween("d", arcTween);
    path.attr("fill", function(d, i) { return color(i); })
        .attr("d", arc)
        // .each(function(d){ this._current = d; })
        // .transition(1000)
        .attrTween("d", arcTween)
        .append('text')
        .text(function(d) {return d.letter;});
};

function arcTween(a) {
  var i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function(t) {
  return arc(i(t));
  };
}

