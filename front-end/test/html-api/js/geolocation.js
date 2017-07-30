var target = document.getElementById('target');

function appendLocation(location, verb) {
    verb = verb || 'updated';
    var newLocation = document.createElement('p');
    newLocation.innerHTML = 'Location ' + verb + ': <a href="https://maps.google.com/maps?&z=15&q=' + location.coords.latitude + '+' + location.coords.longitude + '&ll=' + location.coords.latitude + '+' + location.coords.longitude + '" target="_blank">' + location.coords.latitude + ', ' + location.coords.longitude + '</a>';
    target.appendChild(newLocation);
}

if ('geolocation' in navigator) {
    document.getElementById('askButton').addEventListener('click', function() {
        navigator.geolocation.getCurrentPosition(function(location) {
            console.log(location);
            appendLocation(location, 'fetched');
        });
        navigator.geolocation.watchPosition(appendLocation);
    });
} else {
    alert('Geolocation API not supported.');
}