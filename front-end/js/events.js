document.querySelector('#back').addEventListener('click', function (e) {
    location.href = '/';
});

$(document).ready(function() {
    //Checking if the browser supports LocalStorage
    if (storageAvailable('localStorage')) {
        var localStorage = window['localStorage'];
        var uid = localStorage.getItem('uid');

        $.getJSON('../config/conf.json', function (data) {
            var apiEndpointUrl = data.apiEndpointUrl;
            var userDataEndpoint = apiEndpointUrl + '/api/user/' + uid + '/events';

            $.ajax({
                url: userDataEndpoint,
                type: 'GET',
                contentType: 'application/json',
                success: function (IDs) {
                    IDs.forEach(function (id) {
                        var eventId = id['id'];
                        var locationDataEndpoint = apiEndpointUrl + '/api/event/' + eventId;
                        $.ajax({
                            url: locationDataEndpoint,
                            type: 'GET',
                            contentType: 'application/json',
                            success: function (eventData) {
                                var locationId = eventData.event.location;
                                var locationDataEndpoint = apiEndpointUrl + '/api/location/' + locationId;
                                $.ajax({
                                    url: locationDataEndpoint,
                                    type: 'GET',
                                    contentType: 'application/json',
                                    success: function (location) {
                                        var locationName = location.name;
                                        createEventCard(eventData.event, locationName);
                                    },
                                    error: function (error) {
                                        console.log(error);
                                    }
                                });
                            },
                            error: function (error) {
                                console.log(error);
                            }
                        });
                    });
                },
                error: function (error) {
                    console.log(error);
                }
            });
        });

        //If there is no user ID in LocalStorage, get a token from the API
        if (!uid) {
            getToken(function (result) {
                uid = result['id'];
                localStorage.setItem('uid', uid);
            });
        }
    }
    else {
        alert('Your browser does not support LocalStorage');
    }
});

function createEventCard(event, locationName) {
    var card = document.createElement('paper-card');

    var content = document.createElement('div');
    content.className = 'card-content';
    card.appendChild(content);

    var header = document.createElement('div');
    header.className = 'card-header';
    header.innerHTML = '<i class="fa fa-calendar" aria-hidden="true"></i>' +
                        '<span>' + event.name + '</span>';
    content.appendChild(header);

    var description = document.createElement('div');
    description.className = 'card-description';
    description.innerHTML = '<i class="fa fa-map-marker" aria-hidden="true"></i>' +
                            '<span>' + locationName + '</span>';
    content.appendChild(description);

    var info = document.createElement('div');
    info.className = 'card-info';
    content.appendChild(info);

        var conditions = document.createElement('div');
        conditions.className = 'conditions';
        info.appendChild(conditions);

            var conditionsLabel = document.createElement('span');
            conditionsLabel.innerHTML = 'CONDITIONS';
            conditions.appendChild(conditionsLabel);

            var conditionsTable = document.createElement('table');
            conditions.appendChild(conditionsTable);
            var conditionsRow = document.createElement('tr');
            conditionsTable.appendChild(conditionsRow);

                var conditionsData = event.conditions;
                for (var i = 0; i < Object.keys(conditionsData).length; i++) {
                    var conditionTableData = document.createElement('td');
                    conditionTableData.className = 'event-item';

                    var conditionKey = Object.keys(conditionsData)[i];
                    switch (conditionKey) {
                        case 'days':
                            if (conditionsData.days.length > 0) {
                                var days = '';
                                conditionsData.days.forEach(function (value) {
                                    switch (value) {
                                        case '0': days += 'Mon '; break;
                                        case '1': days += 'Tue '; break;
                                        case '2': days += 'Wed '; break;
                                        case '3': days += 'Thu '; break;
                                        case '4': days += 'Fri '; break;
                                        case '5': days += 'Sat '; break;
                                        case '6': days += 'Sun '; break;
                                    }
                                });
                                conditionTableData.innerHTML = '<i class="fa fa-calendar fa-2x" aria-hidden="true"></i><br>' +
                                                                '<span>' + days + '</span>';
                                conditionsRow.appendChild(conditionTableData);
                            }
                            break;
                        case 'battery':
                            if (conditionsData.battery !== undefined) {
                                var passingCondition = conditionsData.battery.passingCondition;
                                var level = conditionsData.battery.batteryLevel;
                                var value;
                                switch (passingCondition) {
                                    case 'above':
                                        value = 'Above ' + level + '%';
                                        break;
                                    case 'below':
                                        value = 'Below ' + level + '%';
                                        break;
                                }
                                conditionTableData.innerHTML = '<i class="fa fa-battery-three-quarters fa-2x" aria-hidden="true"></i><br>' +
                                                                '<span>' + value + '</span>';
                                conditionsRow.appendChild(conditionTableData);
                            }
                            break;
                        case 'charging':
                            if (conditionsData.charging !== undefined) {
                                var chargingStatus = conditionsData.charging;
                                if (chargingStatus === 'charging') {
                                    chargingStatus = 'Charging';
                                } else if (chargingStatus === 'discharging') {
                                    chargingStatus = 'Discharging';
                                }
                                conditionTableData.innerHTML = '<i class="fa fa-plug fa-2x" aria-hidden="true"></i><br>' +
                                    '<span>' + chargingStatus + '</span>';
                                conditionsRow.appendChild(conditionTableData);
                            }
                            break;
                        case 'time':
                            if (conditionsData.time !== undefined) {
                                var timeRange = conditionsData.time.start.time + ' - ' + conditionsData.time.end.time;
                                conditionTableData.innerHTML = '<i class="fa fa-clock-o fa-2x" aria-hidden="true"></i><br>' +
                                    '<span>' + timeRange + '</span>';
                                conditionsRow.appendChild(conditionTableData);
                            }
                            break;
                    }
                }

        var actions = document.createElement('div');
        actions.className = 'actions';
        info.appendChild(actions);

            var actionsLabel = document.createElement('span');
            actionsLabel.innerHTML = 'ACTIONS';
            actions.appendChild(actionsLabel);

            var actionsTable = document.createElement('table');
            actions.appendChild(actionsTable);
            var actionsRow = document.createElement('tr');
            actionsTable.appendChild(actionsRow);

            var actionsData = event.actions;
            for (var i = 0; i < Object.keys(actionsData).length; i++) {
                var actionTableData = document.createElement('td');
                actionTableData.className = 'event-item';

                var actionKey = Object.keys(actionsData)[i];
                switch (actionKey) {
                    case 'geolocation':
                        if (actionsData.geolocation) {
                            actionTableData.innerHTML = '<i class="fa fa-map-marker fa-2x" aria-hidden="true"></i><br>' +
                                                        '<span>Geolocation data</span>';
                            actionsRow.appendChild(actionTableData);
                        }
                        break;
                    case 'video':
                        if (actionsData.video) {
                            actionTableData.innerHTML = '<i class="fa fa-video-camera fa-2x" aria-hidden="true"></i><br>' +
                                '<span>Record video</span>';
                            actionsRow.appendChild(actionTableData);
                        }
                        break;
                    case 'photo':
                        if (actionsData.photo) {
                            actionTableData.innerHTML = '<i class="fa fa-camera fa-2x" aria-hidden="true"></i><br>' +
                                '<span>Take photo</span>';
                            actionsRow.appendChild(actionTableData);
                        }
                        break;
                    case 'vibration':
                        var pattern = actionsData.vibration;
                        var patternString = '';
                        pattern.forEach(function (value) {
                            patternString += value + ' ';
                        });
                        actionTableData.innerHTML = '<i class="fa fa-mobile fa-2x" aria-hidden="true"></i><br>' +
                            '<span><b>Vibrate</b><br>' + patternString + '</span>';
                        actionsRow.appendChild(actionTableData);
                        break;
                }
            }

    document.getElementById('container').appendChild(card);
}

function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
}