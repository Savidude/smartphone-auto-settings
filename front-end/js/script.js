document.querySelector('#locations-btn').addEventListener('click', function (e) {
    location.href = 'locations.html'
});

document.querySelector('#events-btn').addEventListener('click', function (e) {
    console.log('-------------')
    location.href = 'events.html'
});

$(document).ready(function() {
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
    }
    else {
        alert('Your browser does not support LocalStorage');
    }
});

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
                console.log(JSON.stringify(error, null, 2));
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