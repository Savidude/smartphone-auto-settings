$(document).ready(function() {
    if (storageAvailable('localStorage')) {
        var localStorage = window['localStorage'];
        var token = localStorage.getItem('token');
        if (token) {
            console.log('token found');
            console.log(token);
        } else {
            getToken(function (result) {
                token = result['token'];
                localStorage.setItem('token', token);
                console.log(token);
            })
        }
    }
    else {
        alert('Your browser does not support LocalStorage');
    }
});

function getToken(handleData) {
    $.ajax({
        url: 'http://localhost:3000/api/token',
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
        },
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            handleData(result);
        },
        error: function (error) {
            console.log(error);
        }
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