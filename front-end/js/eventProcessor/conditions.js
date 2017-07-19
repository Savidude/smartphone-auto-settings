function validateConditions(event) {
    var isValid = true;
    for (var i = 0; i < event.length; i++) {
        var condition = event[i].conditions;
        console.log(JSON.stringify(condition, null, 2));
        //Validating the day of the week
        if (condition.days != undefined) {
            isValid = validateDayOfWeek(condition.days);
        }

        //Break out of loop and ignore the other conditions if the current condition holds true
        if (isValid) {
            break;
        }
    }

    if (isValid) {
        $('.pass').fadeIn('slow');
    } else {
        $('.fail').fadeIn('slow');
    }
}

function validateDayOfWeek(days) {
    var date = new Date();
    var today = date.getDay() - 1;

    for (var i = 0; i < days.length; i++) {
        console.log('Today: ' + today + ' day: ' + days[i]);
        if (days[i] == today) {
            return true;
        }
    }
    // days.forEach(function (day) {
    //     console.log('Today: ' + today + ' day: ' + day)
    //     if (day == today) {
    //         isValid = true;
    //     }
    // });
    return false;
}