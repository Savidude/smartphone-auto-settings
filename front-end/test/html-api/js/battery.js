if ('getBattery' in navigator || ('battery' in navigator && 'Promise' in window)) {
    var target = document.getElementById('target');

    function handleChange(change) {
        var timeBadge = new Date().toTimeString().split(' ')[0];
        var newState = document.createElement('p');
        newState.innerHTML = '<span class="badge">' + timeBadge + '</span> ' + change + '.';
        target.appendChild(newState);
    }

    var batteryPromise;

    if ('getBattery' in navigator) {
        batteryPromise = navigator.getBattery();
    } else {
        batteryPromise = Promise.resolve(navigator.battery);
    }

    batteryPromise.then(function(battery) {
        document.getElementById('charging').innerHTML = battery.charging ? 'charging' : 'discharging';
        document.getElementById('chargingTime').innerHTML = battery.chargingTime + ' s';
        document.getElementById('dischargingTime').innerHTML = battery.dischargingTime + ' s';
        document.getElementById('level').innerHTML = battery.level;

        battery.addEventListener('chargingchange', function() {
            handleChange('Battery charging changed to <b>' + (battery.charging ? 'charging' : 'discharging') + '</b>')
        });

        battery.addEventListener('chargingtimechange', function() {
            handleChange('Battery charging time changed to <b>' + battery.chargingTime + ' s</b>');
        });

        battery.addEventListener('dischargingtimechange', function() {
            handleChange('Battery discharging time changed to <b>' + battery.dischargingTime + ' s</b>');
        });

        battery.addEventListener('levelchange', function() {
            handleChange('Battery level changed to <b>' + battery.level + '</b>');
        });
    });
}