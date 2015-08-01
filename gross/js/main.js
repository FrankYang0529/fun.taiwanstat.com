var margin = {top: 100, right: 100, bottom: 100, left: 30},
	width = 1200 - margin.left - margin.right,
	height = 1600 - margin.top - margin.bottom;

var parseDate = d3.time.format("%b %d, %Y").parse;

var x = d3.time.scale()
				.range([0, width])

var xAxis = d3.svg.axis()
				.scale(x)
				.tickSize(20)
				.orient("bottom")

var svg = d3.select("body").append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
			.append('g')
				.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

d3.range(2001, 2015).forEach(function(year, i) {
	year_data(year, i);
})



function year_data(year, i) {


	d3.csv("./year_gross/" + year + "_result.csv", function(err, data) {

		if(err) throw err;

		data.forEach(function(d) {
			d['release date'] = parseDate(d['release date']);
			d['total gross'] = +(d['total gross'].replace(/\$/g,'').replace(/,/g,''))
		})


		var radis = d3.scale.linear()
					.domain(d3.extent(data, function(d) {return d['total gross'] }))
					.range([5, 60])


		var circles = svg.append('g')
			.attr('transform', 'translate(' + margin.left + ',' + i * 100 + ')');

		var start = new Date(year, 0, 1);
		var end = new Date(year, 11, 31);

		// find the date extent (earliest date & latest date), and set x domain
		x.domain([start, end])

		circles.selectAll('.circ')
				.data(data)
				.enter()
			.append('circle')
				.attr('class', 'circ')
				.attr('cx', function(d) {
					return x(d['release date']);
				})
				.attr('r', function(d) { 
					console.log(d['total gross'])
					console.log(radis(d['total gross'])); 
					return radis(d['total gross'])
				})
				.on('click', function(d) {
					console.log(d)
				})

		svg.append('g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(0,' + i * 100 + ')')
			.call(xAxis)
	})
}
