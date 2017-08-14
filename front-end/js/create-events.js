var loc_id;
var batteryConfirmed = false;
var geolocationConfirmed = false;
var videoConfirmed = false;
var photoConfirmed = false;
var vibrationConfirmed = false;
var vibrationPattern;

document.querySelector('#back').addEventListener('click', function (e) {
    location.href = 'locations.html';
});

document.querySelector('#confirm-battery').addEventListener('click', function (e) {
    batteryConfirmed = true;
});

document.querySelector('#cancel-battery').addEventListener('click', function (e) {
    batteryConfirmed = false;
});

document.querySelector('#geolocation-button').addEventListener('click', function (e) {
    geolocationConfirmed = !geolocationConfirmed;
    if (geolocationConfirmed) {
        document.getElementById('geolocation-button').style.backgroundColor = '#9FA8DA';
    } else {
        document.getElementById('geolocation-button').style.backgroundColor = 'white';
    }
});

document.querySelector('#video-button').addEventListener('click', function (e) {
    videoConfirmed = !videoConfirmed;
    if (videoConfirmed) {
        document.getElementById('video-button').style.backgroundColor = '#9FA8DA';
    } else {
        document.getElementById('video-button').style.backgroundColor = 'white';
    }
});

document.querySelector('#photo-button').addEventListener('click', function (e) {
    photoConfirmed = !photoConfirmed;
    if (photoConfirmed) {
        document.getElementById('photo-button').style.backgroundColor = '#9FA8DA';
    } else {
        document.getElementById('photo-button').style.backgroundColor = 'white';
    }
});

document.querySelector('#preset-list').addEventListener('click', function (e) {
    var item = document.querySelector('#preset-list').selectedItem;
    var value = item.getAttribute('value');

    switch (value) {
        case 'short':
            document.getElementById('vibrate-pattern').value = '250';
            break;
        case 'multiple-short':
            document.getElementById('vibrate-pattern').value = '250,250,250,250,250';
            break;
        case 'long':
            document.getElementById('vibrate-pattern').value = '750';
            break;
        case 'multiple-long':
            document.getElementById('vibrate-pattern').value = '750,500,750,500,750';
            break;
    }
});

//Preventing the user from entering non-numeric characters in the vibration pattern
document.querySelector("#vibrate-pattern").addEventListener("keypress", function (evt) {
    if (evt.which < 48 || evt.which > 57)
    {
        if (evt.which != 44) {
            evt.preventDefault();
        }
    }
});

document.querySelector('#vibrate-test').addEventListener('click', function (e) {
    var pattern = document.getElementById('vibrate-pattern').value;
    var patternArray = pattern.split(',');
    navigator.vibrate(patternArray);
});

document.querySelector('#vibrate-reset').addEventListener('click', function (e) {
    document.getElementById('vibrate-pattern').value = '';
});

document.querySelector('#confirm-vibrate').addEventListener('click', function (e) {
    var pattern = document.getElementById('vibrate-pattern').value;
    vibrationPattern = pattern.split(',');
    vibrationConfirmed = true;

    document.getElementById('vibrate-button').style.backgroundColor = '#9FA8DA';
});

document.querySelector('#cancel-vibrate').addEventListener('click', function (e) {
    vibrationConfirmed = false;
    document.getElementById('vibrate-button').style.backgroundColor = 'white';
});

$( document ).ready(function() {
    //Getting the userID from localStorage
    var localStorage = window['localStorage'];
    var uid = localStorage.getItem('uid');

    //Getting location data from URL
    var eventUrl = window.location.href;
    let url = new URL(eventUrl);
    let params = new URLSearchParams(url.search.slice(1));

    var locationId = params.get('locationId');
    var locationName = params.get('locationName');

    if (locationId != undefined && locationName != undefined) {
        document.getElementById('location').value = locationName;
        document.getElementById('location').setAttribute('readonly', 'true');
        document.getElementById('location').setAttribute('label', 'Location');
        loc_id = locationId;
    } else {
        //Getting the list of locations visited by the user
        // $.getJSON('../config/conf.json', function (data) {
        //     var apiEndpointUrl = data.apiEndpointUrl;
        //     var userDataEndpoint = apiEndpointUrl + '/api/user/' + uid + '/locations';
        //
        //     $.ajax({
        //         url: userDataEndpoint,
        //         type: 'GET',
        //         contentType: 'application/json',
        //         success: function (IDs) {
        //             // var locationList = document.getElementById('location-list');
        //
        //             IDs.forEach(function (id) {
        //                 var locationId = id['id'];
        //                 var locationDataEndpoint = apiEndpointUrl + '/api/location/' + locationId;
        //                 $.ajax({
        //                     url: locationDataEndpoint,
        //                     type: 'GET',
        //                     contentType: 'application/json',
        //                     success: function (location) {
        //                         var locationName = location['name'];
        //                         console.log(locationId + ' - ' + locationName)
        //
        //                         var locationItem = document.createElement('paper-item');
        //                         locationItem.setAttribute('value', locationId);
        //                         var text = document.createElement('text');
        //                         text.textContent = locationName;
        //                         locationItem.appendChild(text);
        //                         // locationList.appendChild(locationItem);
        //                     },
        //                     error: function (error) {
        //                         console.log(error);
        //                     }
        //                 });
        //             });
        //         },
        //         error: function (error) {
        //             console.log(error);
        //         }
        //     });
        // });
    }
});

document.querySelector('#create').addEventListener('click', function (e) {
    //Getting condition data
    var batteryCondition = getBatteryCondition();
    var chargingStatusCondition = getChargingStatusCondition();
    var daysCondition = getDaysOfWeekCondition();

    //Creating conditions object
    var conditions = {};
    conditions['battery'] = batteryCondition;
    conditions['charging'] = chargingStatusCondition;
    conditions['days'] = daysCondition;

    //Getting action data
    var geolocationAction = getGeolocationAction();
    var videoAction = getVideoAction();
    var photoAction = getPhotoAction();
    var vibrationAction = getVibrationAction();

    //Creating actions object
    var actions = {};
    actions['geolocation'] = geolocationAction;
    actions['video'] = videoAction;
    actions['photo'] = photoAction;
    actions['vibration'] = vibrationAction;

    //Creating event object
    var event = {};
    event['name'] = document.getElementById('event-name').value;
    if (loc_id == undefined) {
        event['location'] = document.getElementById('location').value;
    } else {
        event['location'] = loc_id;
    }
    event['conditions'] = conditions;
    event['actions'] = actions;

    //Getting the userID from localStorage
    var localStorage = window['localStorage'];
    var uid = localStorage.getItem('uid');

    if (JSON.stringify(conditions) === '{}') {
        alert('No conditions selected.');
    } else if (JSON.stringify(actions) === '{}'){
        alert('No actions selected.');
    }else {
        addEvent(uid, event);
    }
});

/*
---------------------------------------Getting conditions----------------------------------------
 */
function getBatteryCondition() {
    if (batteryConfirmed) {
        var item = document.querySelector('#battery-list').selectedItem;
        var passingCondition = item.getAttribute('value');
        var batteryLevel = document.getElementById("battery-slider").value;

        var conditionData = {};
        conditionData['passingCondition'] = passingCondition;
        conditionData['batteryLevel'] = batteryLevel;
        return conditionData;
    }
}

function getChargingStatusCondition() {
    var chargingState = document.getElementsByName('charging-state');
    for (var i = 0; i < chargingState.length; i++) {
        if (chargingState[i].checked) {
            return chargingState[i].value;
            break;
        }
    }
}

function getDaysOfWeekCondition() {
    var days = document.getElementsByName('day-check');
    var checkedDays = [];
    for (var i = 0; i < days.length; i++) {
        if (days[i].checked) {
            checkedDays.push(days[i].value);
        }
    }
    if (checkedDays.length > 0) {
        return checkedDays;
    }
}

/*
 ---------------------------------------Getting actions----------------------------------------
 */
function getGeolocationAction() {
    return geolocationConfirmed;
}

function getVideoAction() {
    return videoConfirmed;
}

function getVibrationAction() {
    if (vibrationConfirmed) {
        return vibrationPattern;
    }
}

function getPhotoAction() {
    return photoConfirmed;
}

function addEvent(uid, event) {
    var eventData = {};
    eventData['uid'] = uid;
    eventData['event'] = event;

    //Get the API endpoint from conf.json
    $.getJSON('../config/conf.json', function (data) {
        var apiEndpointUrl = data.apiEndpointUrl;
        var eventEndpoint = apiEndpointUrl + '/api/event';

        $.ajax({
            type: "POST",
            contentType: 'application/json',
            dataType: "json",
            url: eventEndpoint,
            data: JSON.stringify(eventData),
            success: function (result) {
                console.log(JSON.stringify(result, null, 2));
                location.href = 'events.html';
            }
        });
    });
}