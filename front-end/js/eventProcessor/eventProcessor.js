$(document).ready(function() {
    //Hiding HTML elements
    $('.location-create').hide();
    $('.pass').hide();
    $('.fail').hide();

    //Checking if the browser supports LocalStorage
    if (storageAvailable('localStorage')) {
        var localStorage = window['localStorage'];
        var uid = localStorage.getItem('uid');
        //If there is no user ID in LocalStorage, get a token from the API
        if (!uid) {
            getToken(function (result) {
                uid = result['id'];
                localStorage.setItem('uid', uid);
            });
        }
        executeEvent(uid);
    }
    else {
        alert('Your browser does not support LocalStorage');
    }
});

function executeEvent(uid) {
    var locationUrl = window.location.href;
    let url = new URL(locationUrl);
    let params = new URLSearchParams(url.search.slice(1));
    for (let p of params) {
        var locationId = p[1];

        $.getJSON('../config/conf.json', function (data) {
            var apiEndpointUrl = data.apiEndpointUrl;
            var eventEndpoint = apiEndpointUrl + '/api/event/user/' + uid + '/location/' + locationId;

            getLocation(data, locationId);

            $.ajax({
                url: eventEndpoint,
                type: 'GET',
                contentType: 'application/json',
                success: function (result) {
                    // console.log(JSON.stringify(result, null, 2));
                    if (result.length != 0) {
                        $.getScript('/js/eventProcessor/conditions.js', function () {
                            validateConditions(result);
                        });
                    } else {
                        $('.location-create').fadeIn('slow');
                    }
                },
                error: function (error) {
                    console.log(error);
                }
            });
        });
        break;
    }
}

function getLocation(confData, locationId) {
    var apiEndpointUrl = confData.apiEndpointUrl;
    var locationEndpointUrl = apiEndpointUrl + '/api/location/' + locationId;

    $.ajax({
        url: locationEndpointUrl,
        type: 'GET',
        contentType: 'application/json',
        success: function (location) {
            var locationName = location['name'];
            if (locationName != undefined) {
                document.getElementById('location').innerHTML = locationName;
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function getToken(handleData) {
    //Get the API endpoint from conf.json
    $.getJSON('../config/conf.json', function (data) {
        var apiEndpointUrl = data.apiEndpointUrl;
        var tokenEndpoint = apiEndpointUrl + '/api/user';

        $.ajax({
            url: tokenEndpoint,
            type: 'GET',
            contentType: 'application/json',
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                handleData(result);
            },
            error: function (error) {
                console.log(error);
            }
        });
    });
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