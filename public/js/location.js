(function () {
  var dom = document.getElementById("map");
  // dom.onmousewheel = (e)=>e.stopPropagation();
  var myChart = echarts.init(dom);
  mapboxgl.accessToken = 'pk.eyJ1IjoibmF0ZS1yaXZlciIsImEiOiJjamU2dmZ2azUwMm9hMzJtc2J4MnI2eTl0In0.qU_rZzNNAMIhxx98zs1d0Q';
  let cid = location.search.slice(location.search.indexOf('=') + 1);
  $.ajax({
    url: '/location_data',
    data: { cid },
    success: (data) => {
      // console.log(data);
      myChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: "{b}",
          backgroundColor: 'rgb(0,0,0)'
      },
        visualMap: {
          show: false,
          calculable: true,
          realtime: false,
          inRange: {
            color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
          },
          outOfRange: {
            colorAlpha: 0
          },
          min: 3,
          max: 14
        },
        mapbox: {
          center: [112.33, 37.54],
          zoom: 5,
          pitch: 90,
          bearing: 0,
          style: 'mapbox://styles/mapbox/light-v9',
          boxHeight: 9,
          postEffect: {
            enable: true,
            SSAO: {
              enable: true,
              radius: 2,
              intensity: 1.5
            }
          },
          light: {
            main: {
              intensity: 1,
              shadow: true,
              shadowQuality: 'high'
            },
            ambient: {
              intensity: 0.,
            },
            ambientCubemap: {
              texture: '/data-1491896094618-H1DmP-5px.hdr',
              exposure: 1,
              diffuseIntensity: 0.5
            }
          }
        },
        series: [{
          type: 'bar3D',
          shading: 'realistic',
          coordinateSystem: 'mapbox',
          minHeight:1.2,
          barSize: 0.2,
          // silent: true,
          data: data
        }]
      });
    }
  })
})();