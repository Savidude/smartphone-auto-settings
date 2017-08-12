document.querySelector('#create-locations').addEventListener('click', function (e) {
    location.href = 'create-locations.html';
});

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
            var userDataEndpoint = apiEndpointUrl + '/api/user/' + uid + '/locations';

            $.ajax({
                url: userDataEndpoint,
                type: 'GET',
                contentType: 'application/json',
                success: function (IDs) {
                    IDs.forEach(function (id) {
                        var locationId = id['id'];
                        var locationDataEndpoint = apiEndpointUrl + '/api/location/' + locationId;
                        $.ajax({
                            url: locationDataEndpoint,
                            type: 'GET',
                            contentType: 'application/json',
                            success: function (location) {
                                // console.log(JSON.stringify(location, null, 2));
                                createLocationCard(location);
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

function createLocationCard(locationData) {
    var card = document.createElement('paper-card');

    var content = document.createElement('div');
    content.className = 'card-content';
    card.appendChild(content);

    var header = document.createElement('div');
    header.className = 'card-header';
    header.innerHTML = '<i class="fa fa-map-marker" aria-hidden="true"></i>' +
                        '<span>' + locationData.name + '</span>';
    content.appendChild(header);

    var description = document.createElement('div');
    description.className = 'card-description';
    description.innerHTML = '<i class="fa fa-link" aria-hidden="true"></i>' +
                            '<span><a href="' + locationData.url + '">' + locationData.url + '</a></span>';
    content.appendChild(description);

    var actions = document.createElement('div');
    actions.className = 'card-actions justified';
    var deleteButton = document.createElement('paper-button');
    deleteButton.innerHTML = '<i class="fa fa-trash-o" aria-hidden="true"></i>' +
                            '<span>Delete</span>';
    actions.appendChild(deleteButton);
    var eventButton = document.createElement('paper-button');
    eventButton.innerHTML = '<i class="fa fa-calendar" aria-hidden="true"></i>' +
        '<span>Create Event</span>';
    eventButton.addEventListener('click', function () {
        location.href = 'create-events.html?locationId=' + locationData.id + '&locationName=' + encodeURI(locationData.name);
    });
    actions.appendChild(eventButton);
    content.appendChild(actions);

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