function gender() {
    var dom = document.getElementById("gender");
    var myChart = echarts.init(dom);
    option = {
        // backgroundColor: 'rgba(128, 128, 128, 0.5)',

        title: {
            show: true,
            left: 'center',
            top: 5,
            textStyle: {
                color: '#666'
            }
        },

        tooltip: {
            trigger: 'item',
            formatter: "{a} <br />{b} : {c} ({d}%)"
        },
        legend: {
            show: true,
            orient: 'vertical',
            left: 10,
            bottom: 20,
            data: ['男生', '女生']
        },
        series: [
            {
                name: '访问来源',
                type: 'pie',
                radius: '55%',
                center: ['50%', '50%'],
                //ECharts 中每个扇形颜色的可以通过分别设置 data 下的数据项实现。
                data: [
                    // {value: 5, name: '女生' },
                    // {value: 30, name: '男生' },
                ].sort(function (a, b) { return a.value - b.value; }),
                // roseType: 'radius',  //形状
                label: {
                    formatter: {

                    },
                    normal: {
                        textStyle: {
                            // color: 'rgb(0,0,0)'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        lineStyle: {
                            color: 'rgb(0,0,0)'
                        },
                        smooth: 0,
                        length: 10,
                        length2: 20
                    }
                },
                itemStyle: {
                    normal: {
                        shadowBlur: 200,
                        shadowColor: 'rgba(0, 0, 0, 0)'
                    }
                },
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function (idx) {
                    return Math.random() * 200;
                }
            }
        ],
        color: ['#1890ff', 'red'],
    };

    myChart.setOption(option, true);
    let cid = location.search.slice(location.search.indexOf('=') + 1);
    // console.log(cid)
    $.ajax({
        url: '/gender_data',
        data: { cid },
        success: (data) => {
            let count = 0;
            $(data).each((i, v) => {
                count = count + v.value;
            })
            myChart.setOption({
                series: {
                    data: data,
                    label: {
                        formatter: function (o) {
                            if (o.name == '男生') {
                                return '{a|帅气的}' + o.name

                                    + o.value + '人';
                            } else {
                                return '{a|漂亮的}' + o.name

                                    + o.value + '人';
                            }
                        },
                        rich: {
                            a: {
                                fontSize: 16,
                                color: 'red'
                            }
                        }
                    }
                },
                title: {
                    text: '班级人数共:' + count + '人',
                }
            })
        }
    })
}
gender();
