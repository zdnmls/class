$(function () {
    (function () {
        $('#first').on('change', function () {
            let ParentCode = $(this).val();
            // console.log(ParentCode);
            $.ajax({
                url: '/change_date',
                data: { ParentCode },
                success: function (res) {
                    $('#second option').each(function (index) {
                        if (index !== 0) {
                            $(this).remove()
                        }
                    })
                    $('#third option').each(function (index) {
                        if (index !== 0) {
                            $(this).remove()
                        }
                    })
                    res.forEach(v => {
                        $(`<option value="${v.RegionCode}">${v.RegionName}</option>`).appendTo('#second')
                    })
                }
            })
        })
        $('#second').on('change', function () {
            let ParentCode = $(this).val()
            // console.log(ParentCode);            
            $.ajax({
                url: '/change_date',
                data: { ParentCode },
                success: function (res) {
                    // console.log(res);
                    $('#third option').each(function (index) {
                        if (index !== 0) {
                            $(this).remove()
                        }
                    })
                    res.forEach(v => {
                        $(`<option value="${v.Id}">${v.RegionName}</option>`).appendTo('#third')
                    })
                }
            })
        })
    })();
})

