function card() {
    var dom = document.getElementById("card");
    var myChart = echarts.init(dom);
    var app = {};
    option = null;
    let cid = location.search.slice(location.search.indexOf('=') + 1);

    var myDate = new Date();
    //获取当前年
    var year = myDate.getFullYear();
    //获取当前月
    var month = myDate.getMonth() + 1;
    //获取当前日
    var now = year + '-' + month;
    $.ajax({
        url: '/card_data',
        data: { cid },
        success: (data) => {
            var dateList = data;
            var heatmapData = [];
            var lunarData = [];
            for (var i = 0; i < dateList.length; i++) {
                heatmapData.push([
                    dateList[i][0],
                    Math.random() * 300
                ]);
                lunarData.push([
                    dateList[i][0],
                    1,
                    dateList[i][1],
                    dateList[i][2]
                ]);
            }
            option = {
                tooltip: {
                    formatter: function (params) {
                        return '课程:' + now;
                    }
                },

                visualMap: {
                    show: false,
                    min: 0,
                    max: 300,
                    calculable: true,
                    seriesIndex: [2],
                    orient: 'horizontal',
                    left: 'center',
                    bottom: 20,
                    inRange: {
                        color: ['#e0ffff', '#006edd'],
                        opacity: 0.3
                    },
                    controller: {
                        inRange: {
                            opacity: 0.5
                        }
                    }
                },

                calendar: [{
                    left: 'center',
                    top: 'middle',
                    cellSize: [70, 70],
                    yearLabel: { show: false },
                    orient: 'vertical',
                    dayLabel: {
                        firstDay: 1,
                        nameMap: 'cn'
                    },
                    monthLabel: {
                        show: true,
                        align: 'left',
                        nameMap: 'cn',
                        position: 'start',
                        fontSize: 24,
                        fontStyle: 'normal',
                        verticalAlign: 'bottom',
                        color: 'keyblue',
                        padding: [140, 40, 0, 0],

                    },
                    range: now   //范围
                }],

                series: [{
                    type: 'scatter',
                    coordinateSystem: 'calendar',
                    symbolSize: 1,
                    label: {
                        normal: {
                            show: true,
                            formatter: function (params) {
                                var d = echarts.number.parseDate(params.value[0]);
                                return d.getDate() + '\n\n' + params.value[2] + '\n\n';
                            },
                            textStyle: {
                                color: '#000'
                            }
                        }
                    },
                    data: lunarData
                }, {
                    type: 'scatter',
                    coordinateSystem: 'calendar',
                    symbolSize: 1,
                    label: {
                        normal: {
                            show: true,
                            formatter: function (params) {
                                return '\n\n\n' + (params.value[3] || '');
                            },
                            textStyle: {
                                fontSize: 14,
                                fontWeight: 700,
                                color: '#a00'
                            }
                        }
                    },
                    data: lunarData
                }, {
                    name: '课程表',
                    type: 'heatmap',
                    coordinateSystem: 'calendar',
                    data: heatmapData
                }]
            };

            myChart.setOption(option, true);
        }
    })
}
card()