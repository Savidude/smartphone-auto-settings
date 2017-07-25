function validateConditions(event) {
    for (var i = 0; i < event.length; i++) {
        var validConditions = [];
        var conditions = event[i].conditions;

        for (var j = 0; j < Object.keys(conditions).length; j++) {
            var conditionKey = Object.keys(conditions)[j];
            switch (conditionKey) {
                case 'days':
                    if (conditions.days.length > 0) {
                        validConditions[j] = validateDayOfWeek(conditions.days);
                    }
                    break;
                case 'battery':
                    if (conditions.battery !== undefined) {
                        var index = j;
                        validateBatteryLevel(conditions.battery, function (result) {
                            validConditions[index] = result;
                        });
                    }
                    break;
                case 'charging':
                    if (conditions.charging !== undefined) {
                        var index = j;
                        validateChargingStatus(conditions.charging, function (result) {
                            validConditions[index] = result;
                        });
                    }
            }
        }

        // var isValid = true;
        // for (var k = 0; k < Object.keys(conditions).length; k++) {
        //     if (validConditions[k] === undefined) {
        //         while (validConditions[k] === undefined) {
        //             setTimeout(function () {
        //                 console.log('validConditions[' + k + ']: ' + validConditions[k]);
        //             }, 100);
        //         }
        //     }
        //     if (!validConditions[k]) {
        //         isValid = false;
        //         break;
        //     }
        // }
    }
}

function validateDayOfWeek(days) {
    var date = new Date();
    var today = date.getDay() - 1;

    for (var i = 0; i < days.length; i++) {
        if (days[i] == today) {
            return true;
        }
    }
    return false;
}

function validateBatteryLevel(batteryCondition, callback) {
    if ('getBattery' in navigator || ('battery' in navigator && 'Promise' in window)) {
        var batteryPromise;

        if ('getBattery' in navigator) {
            batteryPromise = navigator.getBattery();
        } else {
            batteryPromise = Promise.resolve(navigator.battery);
        }

        batteryPromise.then(function(battery) {
            var isValid = false;
            // var isCharging = battery.charging;
            var level = battery.level * 100;

            var levelCondition = batteryCondition.batteryLevel;
            var passingCondition = batteryCondition.passingCondition;

            if (passingCondition == 'above' && level > levelCondition) {
                isValid = true;
            } else if (passingCondition == 'below' && level < levelCondition) {
                isValid = true;
            }

            callback(isValid);
        });
    }
}

function validateChargingStatus(chargingCondition, callback) {
    if ('getBattery' in navigator || ('battery' in navigator && 'Promise' in window)) {
        var batteryPromise;

        if ('getBattery' in navigator) {
            batteryPromise = navigator.getBattery();
        } else {
            batteryPromise = Promise.resolve(navigator.battery);
        }

        batteryPromise.then(function(battery) {
            var isValid = false;
            var isCharging = battery.charging;

            if (isCharging == chargingCondition) {
                isValid = true;
            } else {
                isValid = false;
            }

            callback(isValid);
        });
    }
}