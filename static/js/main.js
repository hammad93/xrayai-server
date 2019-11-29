// https://stackoverflow.com/questions/40367076/how-does-one-add-data-to-a-chart-in-an-ajax-call

$(document).ready(function () {
    // Init
    $('.image-section').hide();
    $('.loader').hide();
    $('#result').hide();

    // Upload Preview
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
                $('#imagePreview').hide();
                $('#imagePreview').fadeIn(650);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
    $("#imageUpload").change(function () {
        $('.image-section').show();
        $('#btn-predict').show();
        $('#result').text('');
        $('#result').hide();
        readURL(this);
    });

    // Predict
    $('#btn-predict').click(function () {
        var form_data = new FormData($('#upload-file')[0]);

        // Show loading animation
        $(this).hide();
        $('.loader').show();

        // Make prediction by calling api /predict
        $.ajax({
            type: 'POST',
            url: '/predict',
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            async: true,
            success: function (response) {
                // Get and display the result
                $('.loader').hide();
                $('#result').fadeIn(600);
                $('#result').text(' Diagnosis results: ');
                console.log('Success!');
                console.log(response);
                var ctx = document.getElementById("chart");
                var myBarChart = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: response.data.labels,
                        datasets: [{
                            data: response.data.chartData,
                            backgroundColor: ["#FE2712", "#FC600A", "#2ECC40", "#FB9902", "#FCCC1A", "#FEFE33", "#B2D732", "#66B032", "#347C98", "#0247FE", "#4424D6", "#F012BE", "#8601AF", "#C21460", "#AAAAAA"],
                            borderWidth: 1
                        }]
                    }
                });
            },
        });
    });

});
