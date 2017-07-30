function validateConditions(events) {
    return new Promise(function (resolve, reject) {
        for (var i = 0; i < events.length; i++) {
            var conditionPromises = [];
            var conditions = events[i].conditions;

            for (var j = 0; j < Object.keys(conditions).length; j++) {
                var conditionKey = Object.keys(conditions)[j];
                switch (conditionKey) {
                    case 'days':
                        if (conditions.days.length > 0) {
                            conditionPromises[j] = validateDayOfWeek(conditions.days);
                        }
                        break;
                    case 'battery':
                        if (conditions.battery !== undefined) {
                            conditionPromises[j] = validateBatteryLevel(conditions.battery);
                        }
                        break;
                    case 'charging':
                        if (conditions.charging !== undefined) {
                            conditionPromises[j] = validateChargingStatus(conditions.charging);
                        }
                }
            }

            validateConditionPromises(i, events.length, conditionPromises).then(function (index) {
                resolve(index);
            });
        }
    });
}

function validateConditionPromises(index, size, conditionPromises) {
    return new Promise(function (resolve, reject) {
        Promise.all(conditionPromises).then(function (values) {
            var isValid = true;
            for(var k = 0; k < values.length; k++) {
                if (!values[k]) {
                    isValid = false;
                    break;
                }
            }

            if (isValid) {
                resolve(index);
            } else if (index === (size - 1)) {
                resolve(-1);
            }
        });
    });
}

function validateDayOfWeek(days) {
    return new Promise(function (resolve, reject) {
        var date = new Date();
        var today = date.getDay() - 1;
        var isValid = false;

        for (var i = 0; i < days.length; i++) {
            if (days[i] == today) {
                isValid = true;
            }
        }
        resolve(isValid);
    });
}

function validateBatteryLevel(batteryCondition) {
    return new Promise(function (resolve, reject) {
        if ('getBattery' in navigator || ('battery' in navigator && 'Promise' in window)) {
            var batteryPromise;

            if ('getBattery' in navigator) {
                batteryPromise = navigator.getBattery();
            } else {
                batteryPromise = Promise.resolve(navigator.battery);
            }

            batteryPromise.then(function(battery) {
                var isValid = false;
                var level = battery.level * 100;

                var levelCondition = batteryCondition.batteryLevel;
                var passingCondition = batteryCondition.passingCondition;

                if (passingCondition === 'above' && level > levelCondition) {
                    isValid = true;
                } else if (passingCondition === 'below' && level < levelCondition) {
                    isValid = true;
                }
                resolve(isValid);
            });
        }
    });
}

function validateChargingStatus(chargingCondition, callback) {
    return new Promise(function (resolve, reject) {
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

                if (chargingCondition === 'charging' && isCharging) {
                    isValid = true;
                } else if (chargingCondition === 'discharging' && !isCharging) {
                    isValid = true;
                }
                resolve(isValid);
            });
        }
    })
}