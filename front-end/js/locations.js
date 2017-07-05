document.querySelector('#create').addEventListener('click', function (e) {
    //Getting the name of the location
    var name = document.getElementById('location-name').value;
    addLocation(name);
});

document.querySelector('#copy').addEventListener('click', function (e) {
    var broadcastUrl = document.getElementById('url');
    broadcastUrl.focus();
    // broadcastUrl.select();
    document.execCommand('copy');
});

function addLocation(name) {
    var locationData = {};
    locationData['name'] = name;

    //Get the API endpoint from conf.json
    $.getJSON('../config/conf.json', function (data) {
        var apiEndpointUrl = data.apiEndpointUrl;
        var locationEndpoint = apiEndpointUrl + '/api/location';
        // console.log(JSON.stringify(locationData, null, 2));

        $.ajax({
            type: "POST",
            contentType: 'application/json',
            dataType: "json",
            url: locationEndpoint,
            data: JSON.stringify(locationData),
            success: function (result) {
                var id = result['id'];
                var locationUrl = data.clientEndpointUrl + '/location.html?id=' + id;
                changeElements(locationUrl);
            }
        });
    });
}

function changeElements(url) {
    $("#location-name").fadeOut("Slow");
    $("#create").fadeOut("Slow");

    document.getElementById('url').value = url;
    $(".hidden").fadeIn("Slow");
}