$(function () {
    function create_seat(row = 7) {
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < row; j++) {
                let w = ($('.seat .left').width() - 28) / 7;
                let h = ($('.seat .left').height() - 28) / 7;
                $('<div>')
                    .width(w)
                    .height(h)
                    .attr('id', `l-${i}-${j}`)
                    .addClass('seat-block')
                    .appendTo('.seat .left')
                $('<div>')
                    .width(w)
                    .height(h)
                    .attr('id', `r-${i}-${j}`)
                    .addClass('seat-block')
                    .appendTo('.seat .right')
            }
        }
    }

    $('.seat').on('click', '.seat-block', function () {
        $(this).toggleClass('active');
        let t = $(this).attr('id').split('-')
        // console.log(t)
        $('#seat').val(JSON.stringify({
            d: t[0],
            x: t[1],
            y: t[2]
        }));
    });
    create_seat()
});
