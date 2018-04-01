(function () {
  var dom = document.getElementById("expect_city");
  var myChart = echarts.init(dom);
  let cid = location.search.slice(location.search.indexOf('=') + 1);
  $.ajax({
    url: '/expect_city_data',
    data: {cid},
    success: (data) => {
      // console.log(data)
      myChart.setOption({
        tooltip: {
          show:false,
        },
        // legend: [{
        //   // selectedMode: 'single',
        //   data: categories.map(function (a) {
        //     return a.name;
        //   })
        // }],
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
          {
            legendHoverLink:true,
            type: 'graph',
            layout: 'circular',
            focusNodeAdjacency:true,
            symbolSize:(value)=>value,
            // edgeSymbol: ['circle', 'arrow'],
            circular: {
              rotateLabel: true
            },
            edgeLabel:{
              formatter:''
            },
            nodes: data.nodes,
            edges:  data.edges,
            categories: [],
            roam: true,
            label: {
              normal: {
                position: 'right',
                formatter: '{b}'
              }
            },
            lineStyle: {
              normal: {
                color: 'source',
                curveness: 0.3
              }
            }
          }
        ]
      })
    }
  })
})();