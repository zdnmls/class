$(function () {
  function display_seat(row = 7) {
    let cid = location.search.slice(location.search.indexOf('=') + 1);
    $.ajax({
      url: '/seat_data',
      data: { cid },
      success: function (data) {
        // console.log(data)
        for (let i = 0; i < row; i++) {
          for (let j = 0; j < row; j++) {
            let w = ($('.seat .left').width() - 28) / 7;
            let h = ($('.seat .left').height() - 28) / 7;
            $('<div>')
              .width(w)
              .height(h)
              .attr('id', `l-${i}-${j}`)
              .addClass('seat-block')
              .appendTo('.seat .left');
            $('<div>')
              .width(w)
              .height(h)
              .attr('id', `r-${i}-${j}`)
              .addClass('seat-block')
              .appendTo('.seat .right');
          }
        }
        for (let n in data) {
          $('#' + n)
            .addClass('active')
            .html(data[n]);
        }
      }
    });
  }
  display_seat()
});