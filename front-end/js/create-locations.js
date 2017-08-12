document.querySelector('#back').addEventListener('click', function (e) {
    location.href = 'locations.html';
});

document.querySelector('#create').addEventListener('click', function (e) {
    //Getting the name of the location
    var name = document.getElementById('location-name').value;
    addLocation(name);
});

document.querySelector('#copy').addEventListener('click', function (e) {
    var broadcastUrl = document.getElementById('url');
    broadcastUrl.focus();
    broadcastUrl.select();
    document.execCommand('copy');
});

function addLocation(name) {
    var locationData = {};
    locationData['location'] = {};
    locationData['location']['name'] = name;

    //Getting the userID from localStorage
    var localStorage = window['localStorage'];
    var uid = localStorage.getItem('uid');
    locationData['user'] = {};
    locationData['user']['id'] = uid;

    //Get the API endpoint from conf.json
    $.getJSON('../config/conf.json', function (data) {
        var apiEndpointUrl = data.apiEndpointUrl;
        var locationEndpoint = apiEndpointUrl + '/api/location';

        $.ajax({
            type: "POST",
            contentType: 'application/json',
            dataType: "json",
            url: locationEndpoint,
            data: JSON.stringify(locationData),
            success: function (result) {
                var locationUrl = result['url'];
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