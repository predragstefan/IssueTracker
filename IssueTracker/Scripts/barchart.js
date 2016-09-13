var w = 920;
var h = 540;
var margin = {
    top: 30,
    bottom: 70,
    left: 50,
    right: 20
}

var boje = ["#4dd0e1", "#4db6ac", "#81c784", "#aed581", "#dce775", "#fff176"];

var chartWidth = w - margin.left - margin.right;
var chartHeight = h - margin.top - margin.bottom;

var usersData = [];
var problemsData = [];

var svg = d3.select('#container').append('svg').attr("id", 'chart').attr("width", w).attr("height", h);

var chart = svg.append('g').classed('display', true).attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var linearColorScale = d3.scale.linear().domain([0, usersData.length]).range(['#2255a9', '#cc89d3']);
var ordinalColorScale = d3.scale.category20();

function removeBarTitles() {
    $('.bar-title').fadeOut();
}

var timeout = setTimeout(removeBarTitles, 4000);

function tweenText(newValue, idx) {
    console.log(newValue);

    return function () {
        var currentValue = +idx.textContent;

        var i = d3.interpolateRound(currentValue, newValue);

        return function (t) {
            idx.textContent = i(t);
        };
    }
}

var formatPercent = d3.format("20");

function displayData(d, i) {
    d3.select(this).classed('hover', true);
    $('.bar-title').eq(i).fadeIn();

    if (d.Ime) {
        $('#info').addClass('active').find('img').attr('src', d.Fotografija).next('.ime').text('Ime: ' + d.Ime)
			.next('.user-problems').text('Broj Dodeljenih Problema: ' + d.BrojProblema).next('.role').text('Uloga u Organizaciji: ' + d.Uloga);
    }
    else {
        console.log(d);
        $('#info').addClass('active').find('img').hide().next('.ime').text('Status: ' + d.status)
			.next('.user-problems').text('Broj Problema: ' + d.brojProblema).next('.role').hide();
    }
}
function removeData(d, i) {
    d3.select(this).classed('hover', false);
    $('.bar-title').eq(i).hide();
    $('#info').removeClass('active').find('img').show().siblings('.role').show();
}

function displayPos(d, i) {
    if (d.Ime) {
        $('#info').css({
            left: event.pageX + 25,
            top: event.pageY - 130
        });
    }
    else {
        $('#info').css({
            left: event.pageX + 25,
            top: event.pageY - 55
        });
    }
}

function plot(params) {
    this.selectAll("*").remove();

    var x = d3.scale.ordinal().domain(params.data.map(function (entry) {
        return entry[params.key];
    })).rangeBands([0, chartWidth]);

    var y = d3.scale.linear().domain([0, d3.max(params.data, function (d) {
        return d[params.value];
    })]).range([chartHeight, 0]);

    var xAxis = d3.svg.axis().scale(x).orient('bottom');
    var yAxis = d3.svg.axis().scale(y).orient('left');
    var yGridlines = d3.svg.axis().scale(y).tickSize(-chartWidth, 0, 0).tickFormat("").orient('left');

    this.append('g').call(yGridlines).classed('gridline', true).attr('transform', 'translate(0,0)');

    this.selectAll('.bar')
				.data(params.data)
					.enter()
						.append('rect').classed('bar', true).on('mouseover', displayData).on('mousemove', displayPos).on('mouseout', removeData).attr('height', 0).attr('y', function (d, i) {
						    return y(0);
						}).transition().ease('ease-in').duration(800).attr('y', function (d, i) {
						    return y(d[params.value]);
						}).attr('x', function (d, i) {
						    return x(d[params.key]);
						}).attr('height', function (d, i) {
						    return chartHeight - y(d[params.value]);
						}).attr('width', function (d, i) {
						    return x.rangeBand();
						}).style('fill', function (d, i) {
						    return params.colorScheme[i];
						    //return linearColorScale(i);
						});

    this.selectAll('.bar-title').data(params.data)
				.enter().append('text').text(0)
					.classed('bar-title', true).attr('y', function (d, i) {
					    return y(0);
					}).transition().duration(1500).delay(100).ease('ease-in').attr('x', function (d, i) {
					    return x(d[params.key]) + x.rangeBand() / 2;
					}).attr('y', function (d, i) {
					    return y(d[params.value]);
					}).attr("dy", -6).tween("text", function (d) {
					    var i = d3.interpolate(0, d[params.value]);
					    return function (t) {
					        d3.select(this).text(parseInt(formatPercent(i(t))));
					    };
					}).attr('dx', 0);
    //text(function(d,i){
    //return d[params.value];
    //})

    this.append('g').classed('x osa', true).attr('transform', 'translate(' + 0 + ',' + chartHeight + ')').call(xAxis)
		.selectAll('text').style('text-anchor', 'middle').attr('dx', 0).attr('dy', 8).attr('transform', 'translate(0,0) rotate(0)');

    this.append('g').classed('y osa', true).attr('transform', 'translate(0,0)').call(yAxis);

    this.select('.y.osa').append('text').attr('x', 0).attr('y', 0).style('text-anchor', 'middle')
				.attr('transform', 'translate(' + -35 + ',' + chartHeight / 2 + ') rotate(-90)').text(params.nazivOsa.y);
    this.select('.x.osa').append('text').attr('x', 0).attr('y', 0).style('text-anchor', 'middle')
				.attr('transform', 'translate(' + chartWidth / 2 + ',60) rotate(0)').text(params.nazivOsa.x);
}// End Plot

$('.gen').on('change', function () {
    clearTimeout(timeout);
    $.getJSON("/Manage/Statistika",
		{
		    parametar: "korisnici"
		}).done(function (d) {
		    usersData = d;

		    plot.call(chart, {
		        data: usersData,
		        key: 'Ime',
		        value: 'BrojProblema',
		        colorScheme: boje,
		        nazivOsa: {
		            x: "Korisnik",
		            y: "Problemi"
		        }
		    });

		    timeout = setTimeout(removeBarTitles, 4000);
		});
});

$('.gen2').on('change', function () {
    clearTimeout(timeout);

    $.getJSON("/Manage/Statistika", { parametar: "problemi" }).done(function (d) {
        data = d;
        var problemiNesortirano = [];

        for (var i = 0; i < data.length; i++) {
            var idx = problemiNesortirano.AkoJeDatum('status', data[i].Status);
            if (idx > -1) {
                problemiNesortirano[idx].brojProblema++;
            }
            else {
                var statusProblema;
                switch (data[i].Status) {
                    case "Otvoren":
                        statusProblema = "Otvoreni";
                        break;
                    case "Zavrsen":
                        statusProblema = "Zavrseni";
                        break;
                    case "Aktivan":
                        statusProblema = "Aktivni";
                        break;
                    case "Neaktivan":
                        statusProblema = "Neaktivni";
                        break;
                    case "Suspendovan":
                        statusProblema = "Suspendovani";
                        break;
                    case "Trijaza":
                        statusProblema = "Trijaza";
                        break;
                    default:
                        break;
                }

                var obj = {
                    brojProblema: 1,
                    status: data[i].Status,
                    nazivStatusa: statusProblema
                }
                problemiNesortirano.push(obj);
            }
        }

        problemsData = problemiNesortirano;

        plot.call(chart, {
            data: problemsData,
            colorScheme: boje,
            key: 'nazivStatusa',
            value: 'brojProblema',
            nazivOsa: {
                x: "Status Problema",
                y: "Problemi"
            }
        });

        timeout = setTimeout(removeBarTitles, 4000);
    });
});

$('.sort').on('click', { ascDesc: 0 }, function (e) {
    e.data.ascDesc++;
    clearTimeout(timeout);
    var tempData = [];
    var keys = {}
    if ($('.filter :radio:checked').val() == 'users') {
        keys.data = usersData;
        keys.value = 'BrojProblema';
        keys.key = 'Ime';
        keys.x = 'Korisnik';
        keys.y = 'Problemi';
    }
    else {
        keys.data = problemsData;
        keys.value = 'brojProblema';
        keys.key = 'nazivStatusa';
        keys.x = 'Status Problema';
        keys.y = 'Problemi';
    }

    if (e.data.ascDesc % 2 == 0) {
        $(this).text('Sort Desc');

        plot.call(chart, {
            data: keys.data.sort(function (a, b) {
                return a[keys.value] - b[keys.value];
            }),
            colorScheme: boje,
            nazivOsa: {
                x: keys.x,
                y: keys.y
            },
            key: keys.key,
            value: keys.value
        });
    }
    else {
        $(this).text('Sort Asc');
        plot.call(chart, {
            data: keys.data.sort(function (a, b) {
                return b[keys.value] - a[keys.value];
            }),
            colorScheme: boje,
            nazivOsa: {
                x: keys.x,
                y: keys.y
            },
            key: keys.key,
            value: keys.value
        });
    }

    timeout = setTimeout(removeBarTitles, 4000);
});//End sort

function drawChartBar() {
    $.getJSON("/Manage/Statistika", { parametar: "korisnici" }).done(function (d) {
        data = d;
        usersData = data;

        plot.call(chart, {
            data: data,
            key: 'Ime',
            value: 'BrojProblema',
            colorScheme: boje,
            nazivOsa: {
                x: "Korisnik",
                y: "Problemi"
            }
        });

        timeout = setTimeout(removeBarTitles, 4000);
    });
};
drawChartBar();

//PROTOTYPED

Array.prototype.AkoJeDatum = function (propName, value) {
    for (var i = 0; i < this.length; i++) {
        var propObj = this[i];
        if (propObj[propName] === value) {
            return i;
        }
    }
    return -1;
}