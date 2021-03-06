// https://stackoverflow.com/questions/40367076/how-does-one-add-data-to-a-chart-in-an-ajax-call

$(document).ready(function () {
    // Init
    $('.image-section').hide();
    $('.loader').hide();
    $('#result1').hide();
    $('#result2').hide();
    $('#result3').hide();

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
        $('#result1').text('');
        $('#result1').hide();
        $('#result2').text('');
        $('#result2').hide();
        $('#result3').text('');
        $('#result3').hide();
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
                $('#result1').fadeIn(600);
                $('#result2').fadeIn(600);
                $('#result3').fadeIn(600);
                $('#result1').text(' Diagnosis result: '+response.data.labels[0]);
                $('#result2').text(' Diagnosis probability: '+response.data.chartData[0]+'%');
                $('#result3').text(' Physician comment: Agree or Not agree ');
                console.log('Success!');
                console.log(response);
                var ctx = document.getElementById("chart");
                var myBarChart = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: response.data.labels,
                        datasets: [{
                            data: response.data.chartData,
                            backgroundColor: ["#ff9999", "#ffb399", "#ffcc99", "#b3ff99", "#99ff99", "#99ffb3", "#99ffcc", "#99ffe6", "#99ffff", "#99e6ff", "#99ccff", "#99b3ff", "#9999ff", "#b399ff", "cc99ff"],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        legend: {
                            labels: {
                                fontColor: "white"
                            }
                        },
                        title: {
                            display: true,
                            text: 'Prediction results: ',
                            fontColor: "white"
                        }
                    }
                });
            },
        });
    });

});
