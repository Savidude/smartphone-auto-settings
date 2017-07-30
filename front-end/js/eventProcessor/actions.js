function executeActions(event) {
    var action = event.actions;
    console.log(JSON.stringify(action, null, 2));
    for (var i = 0; i < Object.keys(action).length; i++) {
        var actionKey = Object.keys(action)[i];
        switch (actionKey) {
            case 'geolocation':
                if (action.geolocation !== undefined && action.geolocation === true) {
                    getGeolocationData();
                }
        }
    }
}

function getGeolocationData() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function(location) {
            displayGeolocationData(location, 'fetched');
        });
        navigator.geolocation.watchPosition(displayGeolocationData);
    } else {
        alert('Geolocation API not supported.');
    }
}

function displayGeolocationData(location) {
    $(".geolocation-hidden").fadeIn("Slow");
    document.getElementById('geo-latitude').innerHTML = location.coords.latitude;
    document.getElementById('geo-longitude').innerHTML = location.coords.longitude;
    document.getElementById('geo-heading').innerHTML = location.coords.heading;
    document.getElementById('geo-accuracy').innerHTML = location.coords.accuracy + ' meters';
    document.getElementById('geo-altitude').innerHTML = location.coords.altitude + ' meters';
    document.getElementById('geo-altitude-accuracy').innerHTML = location.coords.altitudeAccuracy + ' meters';
    document.getElementById('geo-speed').innerHTML = location.coords.speed + ' km/h';

    document.getElementById('geo-map').setAttribute('latitude', location.coords.latitude);
    document.getElementById('geo-map').setAttribute('longitude', location.coords.longitude);

    document.getElementById('geo-marker').setAttribute('latitude', location.coords.latitude);
    document.getElementById('geo-marker').setAttribute('longitude', location.coords.longitude);
}