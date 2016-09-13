//var chartWidth=w-margin.left-margin.right;
//var chartHeight=h-margin.top-margin.bottom;
var brojac = 0;
var boje = ["#4dd0e1", "#4db6ac", "#81c784", "#aed581", "#dce775", "#fff176"];

var colors = [{
    line: '#ff1744',
    dots: '#ff8a80'
}, {
    line: '#d500f9',
    dots: '#ea80fc'
}, {
    line: '#2979ff',
    dots: '#82b1ff'
}, {
    line: '#00e5ff',
    dots: '#84ffff'
},
{
    line: '#76ff03',
    dots: '#ccff90'
}];

var lineStyle = "monotone";

var ponovljeniChart = 0;

//var svg=d3.select('#container').append('svg').attr("id",'chart').attr("width",w).attr("height",h);

function createG(svg) {
    var chart = svg.append('g').classed('display', true).classed('lineCharts', true).attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    return chart;
}

var dateParser = d3.time.format('%d/%m/%Y').parse;
var xLine;
var yLine;
var xAxisLine;
var yAxisLine;
var dataProblems = [];

function ose(data) {
    xLine = d3.time.scale()
           .domain(d3.extent(data, function (d) {
               var date = dateParser(d.datumKreiranja);
               return date;
           }))
           .range([0, chartWidth]);
    yLine = d3.scale.linear()
           .domain([0, d3.max(data, function (d) {
               return d.brojProblema;
           })])
           .range([chartHeight, 0]);

    xAxisLine = d3.svg.axis().scale(xLine).orient('bottom').ticks(d3.time.days, 1).tickFormat(d3.time.format('%d/%m'));
    yAxisLine = d3.svg.axis().scale(yLine).orient('left').ticks(10);
}
var line;
var area;

function linesAreas() {
    line = d3.svg.line().x(function (d) {
        var date = dateParser(d.datumKreiranja);
        return xLine(date);
    }).y(function (d) {
        return yLine(d.brojProblema);
    }).interpolate(lineStyle);

    area = d3.svg.area().x(function (d) {
        var date = dateParser(d.datumKreiranja);
        return xLine(date);
    }).y0(chartHeight).y1(function (d) {
        return yLine(d.brojProblema);
    }).interpolate(lineStyle);
}//End lineAreas

function draw(params) {
    if (!brojac) {
        this.append('g').classed('x osa', true).attr('transform', 'translate(0,' + chartHeight + ')').call(xAxisLine);
        this.append('g').classed('y osa', true).attr('transform', 'translate(0,0)').call(yAxisLine);
        this.select('.y.osa').append('text').attr('x', 0).attr('y', 0).style('text-anchor', 'middle')
				.attr('transform', 'translate(' + -35 + ',' + chartHeight / 2 + ') rotate(-90)').text("Tip Problema");
        this.select('.x.osa').append('text').attr('x', 0).attr('y', 0).style('text-anchor', 'middle')
				.attr('transform', 'translate(' + chartWidth / 2 + ',60) rotate(0)').text("Datum Kreiranja");
        var yGridlines = d3.svg.axis().scale(yLine).tickSize(-chartWidth, 0, 0).tickFormat("").orient('left');

        this.append('g').call(yGridlines).classed('gridline', true).attr('transform', 'translate(0,0)');
    }
    //enter

    this.selectAll('.area').data([params.data]).enter().append('path').classed('area', true).classed('area' + brojac, true);

    this.selectAll('.line').data([params.data]).enter().append('path').classed('line', true).on('mouseover', displayLineData)
    .on('mouseout', removeLineData)
    .style('stroke', params.colors.line).attr("id", "path-" + brojac);

    this.selectAll('.point').data(params.data).enter()
                        .append('circle').classed('point', true).on('mouseover', displayPointData)
    .on('mouseout', removePointData).attr('r', 5).style('fill', params.colors.dots).attr("id", "point-" + brojac);;

    //update
    this.selectAll('.area').attr('d', function (d) {
        return area(d);
    }).classed('visible', true);

    var points = $('.point');
    points.delay(5000).fadeOut(2000);
    $('.area').hide().delay(5000).fadeIn(6000);
    $('.line').delay(5000).addClass('finished');

    this.selectAll('.line').attr('d', function (d) {
        return line(d);
    });

    var lastPath = document.querySelector('#path-' + brojac);
    //=document.querySelectorAll('.line')[document.querySelectorAll('.line').length-1];
    var length = lastPath.getTotalLength();

    d3.select(lastPath).attr("stroke-dasharray", length + " " + length).classed('visible', true)
    .attr("stroke-dashoffset", length).transition().duration(3000).delay(function () {
        return 1000 * brojac;
    }).ease('ease-in').attr("stroke-dashoffset", 0);

    var pointsNo = params.data.length;
    this.selectAll('.point').classed('point-' + brojac, true).transition().duration(3000).delay(function (d, i) {
        return 1000 * brojac + i * 2600 / pointsNo;
    }).ease('ease-in').attr('cx', function (d) {
        var date = dateParser(d.datumKreiranja);
        return xLine(date);
    }).attr('cy', function (d) {
        return yLine(d.brojProblema);
    });

    //exit

    this.selectAll('.point').data(params.data).exit().remove();
    this.selectAll('.line').data([params.data]).exit().remove();
    brojac++;
}//End Draw

var idx;
var pts;
function displayLineData(d, i) {
    var _this = $(this);
    var e = event;
    if (_this.hasClass('line-data-enabled')) {
        idx = $('.line').index($(this));
        $('#line-info').addClass('active').find('.problem-type').text(function () {
            switch (_this.attr('id').split('-')[1]) {
                case "0": return " Svi Problemi ";
                    break;
                case "1": return " Logisticki ";
                    break;
                case "2": return " Operativni ";
                    break;
                case "3": return " Sistemski ";
                    break;
                case "4": return " Tehnicki ";
                    break;
                default:
                    break;
            }
        }).closest('#line-info').css({
            left: e.pageX + 25,
            top: e.pageY - 25
        });
    }
}

function displayPointData(d, i) {
    var _this = $(this);
    var e = event;
    $('#point-info').addClass('active').find('.problem-type').text(function () {
        switch (_this.attr('id').split('-')[1]) {
            case "0": return "Vrsta Problema: Svi Problemi ";
                break;
            case "1": return "Vrsta Problema: Logisticki ";
                break;
            case "2": return "Vrsta Problema: Operativni ";
                break;
            case "3": return "Vrsta Problema: Sistemski ";
                break;
            case "4": return "Vrsta Problema: Tehnicki ";
                break;
            default:
                break;
        }
    })
		.next('.problem-date').text('Datum: ' + d.datumKreiranja).next('.problem-number').text('Broj Problema: ' + d.brojProblema)
		.closest('#point-info').css({
		    left: e.pageX + 25,
		    top: e.pageY - 25
		});
}
function removePointData(d, i) {
    $('#point-info').removeClass('active');
}

function removeLineData(d, i) {
    idx = $('.line').index($(this));
    $('#line-info').removeClass('active')
}

Array.prototype.AkoJeDatum = function (propName, value) {
    for (var i = 0; i < this.length; i++) {
        var propObj = this[i];
        if (propObj[propName] === value) {
            return i;
        }
    }
    return -1;
}

var sviProblemi = [];
var problemi = [];
var problemi1 = [];
var problemi2 = [];
var problemi3 = [];
var problemi4 = [];

function getAndDraw() {
    sviProblemi = [];
    problemi = [];
    problemi1 = [];
    problemi2 = [];
    problemi3 = [];
    problemi4 = [];

    $.getJSON("/Manage/Statistika", { parametar: "problemi" }).done(function (data) {
        problemi = data;

        for (var i = 0; i < problemi.length; i++) {
            var idx = sviProblemi.AkoJeDatum('datumKreiranja', problemi[i].DatumKreiranja);
            if (idx > -1) {
                sviProblemi[idx].brojProblema++;
            }
            else {
                var obj = {
                    datumKreiranja: problemi[i].DatumKreiranja,
                    brojProblema: 1,
                    status: problemi[i].Status
                }
                sviProblemi.push(obj);
            }
        }

        for (var i = 0; i < problemi.length; i++) {
            switch (problemi[i].VrstaProblemaId) {
                case 1:
                    var idx = problemi1.AkoJeDatum('datumKreiranja', problemi[i].DatumKreiranja);
                    if (idx > -1) {
                        problemi1[idx].brojProblema++;
                    }
                    else {
                        var obj = {
                            datumKreiranja: problemi[i].DatumKreiranja,
                            brojProblema: 1,
                            status: problemi[i].Status,
                            idProblema: problemi[i].VrstaProblemaId
                        }
                        problemi1.push(obj);
                    }
                    break;
                case 2:
                    var idx = problemi2.AkoJeDatum('datumKreiranja', problemi[i].DatumKreiranja);
                    if (idx > -1) {
                        problemi2[idx].brojProblema++;
                    }
                    else {
                        var obj = {
                            datumKreiranja: problemi[i].DatumKreiranja,
                            brojProblema: 1,
                            status: problemi[i].Status,
                            idProblema: problemi[i].VrstaProblemaId
                        }
                        problemi2.push(obj);
                    }
                    break;
                case 3:
                    var idx = problemi3.AkoJeDatum('datumKreiranja', problemi[i].DatumKreiranja);
                    if (idx > -1) {
                        problemi3[idx].brojProblema++;
                    }
                    else {
                        var obj = {
                            datumKreiranja: problemi[i].DatumKreiranja,
                            brojProblema: 1,
                            status: problemi[i].Status,
                            idProblema: problemi[i].VrstaProblemaId
                        }
                        problemi3.push(obj);
                    }
                    break;
                case 4:
                    var idx = problemi4.AkoJeDatum('datumKreiranja', problemi[i].DatumKreiranja);
                    if (idx > -1) {
                        problemi4[idx].brojProblema++;
                    }
                    else {
                        var obj = {
                            datumKreiranja: problemi[i].DatumKreiranja,
                            brojProblema: 1,
                            status: problemi[i].Status,
                            idProblema: problemi[i].VrstaProblemaId
                        }
                        problemi4.push(obj);
                    }
                    break;
                default:
                    break;
            }
        }
        linesAreas();
        chart.selectAll("*").remove();

        if (ponovljeniChart == 0) {
            ose(sviProblemi);
        }
        else {
            svg.selectAll('*').remove();
        }
        ponovljeniChart++;

        draw.call(createG(svg), {
            data: sviProblemi,
            colors: colors[brojac]
        });

        draw.call(createG(svg), {
            data: problemi1,
            colors: colors[brojac]
        });
        draw.call(createG(svg), {
            data: problemi2,
            colors: colors[brojac]
        });

        draw.call(createG(svg), {
            data: problemi3,
            colors: colors[brojac]
        });

        draw.call(createG(svg), {
            data: problemi4,
            colors: colors[brojac]
        });
    });
}// Emd GetAndDraw

// FILTER

$('.showFilter').on('click', function (e) {
    $('.showFilter').removeClass('active');
    $(this).addClass('active');
    var idx = $(this).index();
    $('.filter').removeClass('visible-filter');
    $('.filter').eq(idx).addClass('visible-filter');

    if (idx == 1) {
        brojac = 0;
        getAndDraw();
    }
    else {
        brojac = 0;
        svg.selectAll("*").remove();
        svg.selectAll('.lineCharts').remove();
        $('.filter :radio:first').prop('checked', true);
        chart = svg.append('g').classed('display', true).attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
        drawChartBar();
    }
});

$('.showLine').on('click', function () {
    $('.line').addClass('line-data-enabled');
    $('.point').stop(true, true).show();
    $('.area').hide().css('visibility', 'hidden');
});

$('.showArea').on('click', function () {
    $('.line').removeClass('line-data-enabled');
    $('.point').hide();
    $('.area').show().css('visibility', 'visible');
});

$('.lineStyle').on('change', function () {
    brojac = 0;
    lineStyle = $(this).val();
    getAndDraw();
});