document.querySelector('#create').addEventListener('click', function (e) {
    //Getting condition data
    var airplaneModeCondition = getAirplanemodeCondition();
    var batteryCondition = getBatteryCondition();
    var chargingStatusCondition = getChargingStatusCondition();
    var daysCondition = getDaysOfWeekCondition();
    var headsetCondition = getHeadsetCondition();

    //Creating conditions object
    var conditions = {};
    conditions['airplaneMode'] = airplaneModeCondition;
    conditions['battery'] = batteryCondition;
    conditions['charging'] = chargingStatusCondition;
    conditions['days'] = daysCondition;
    conditions['headset'] = headsetCondition;

    //Getting action data
    var airplaneModeAction = getAirplanemodeAction();
    var mediaPlayerAction = getMediaPlayerAction();
    var brightnessAction = getBrightnessAction();
    var timeoutAction = getTimeoutAction();
    var screenRotationAction = getScreenRotationAction();

    //Creating actions object
    var actions = {};
    actions['airplaneMode'] = airplaneModeAction;
    actions['media'] = mediaPlayerAction;
    actions['brightness'] = brightnessAction;
    actions['timeout'] = timeoutAction;
    actions['rotation'] = screenRotationAction;

    //Creating event object
    var event = {};
    event['name'] = document.getElementById('event-name').value;
    event['conditions'] = conditions;
    event['actions'] = actions;

    //Getting the userID from localStorage
    var localStorage = window['localStorage'];
    var uid = localStorage.getItem('uid');

    addEvent(uid, event);
});

function getAirplanemodeCondition() {
    var airplaneMode = document.getElementsByName('airplane-mode');
    for (var i = 0; i <airplaneMode.length; i++) {
        if (airplaneMode[i].checked) {
            return airplaneMode[i].value;
            break;
        }
    }
}

function getBatteryCondition() {
    var item = document.querySelector('#battery-list').selectedItem;
    var passingCondition = item.getAttribute('value');
    var batteryLevel = document.getElementById("battery-slider").value;

    var conditionData = {};
    conditionData['passingCondition'] = passingCondition;
    conditionData['batteryLevel'] = batteryLevel;
    return conditionData;
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
    return checkedDays;
}

function getHeadsetCondition() {
    var headsetCondition = document.getElementsByName('headset-condition');
    for (var i = 0; i < headsetCondition.length; i++) {
        if (headsetCondition[i].checked) {
            return headsetCondition[i].value;
            break;
        }
    }
}

function getAirplanemodeAction() {
    var airplaneAction = document.getElementsByName('airplane-action');
    for (var i = 0; i < airplaneAction.length; i++) {
        if (airplaneAction[i].checked) {
            return airplaneAction[i].value;
            break;
        }
    }
}

function getMediaPlayerAction() {
    var mediaAction = document.getElementsByName('media-action');
    for (var i = 0; i < mediaAction.length; i++) {
        if (mediaAction[i].checked) {
            return mediaAction[i].value;
            break;
        }
    }
}

function getBrightnessAction() {
    var brightnessLevel = document.getElementById("brightness-slider").value;
    return brightnessLevel;
}

function getTimeoutAction() {
    var timeoutAction = document.getElementsByName('timeout-action');
    for (var i = 0; i < timeoutAction.length; i++) {
        if (timeoutAction[i].checked) {
            return timeoutAction[i].value;
            break;
        }
    }
}

function getScreenRotationAction() {
    var rotationAction = document.getElementsByName('rotation-action');
    for (var i = 0; i < rotationAction.length; i++) {
        if (rotationAction[i].checked) {
            return rotationAction[i].value;
            break;
        }
    }
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
                console.log(result);
            }
        });
    });
}