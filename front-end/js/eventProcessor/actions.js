function executeActions(event) {
    var action = event.actions;
    for (var i = 0; i < Object.keys(action).length; i++) {
        var actionKey = Object.keys(action)[i];
        switch (actionKey) {
            case 'geolocation':
                if (action.geolocation !== undefined && action.geolocation === true) {
                    getGeolocationData();
                }
                break;
            case 'video':
                if (action.video !== undefined && action.video === true) {
                    displayVideoControls();
                }
                break;
        }
    }
}

/*
---------------------------Geolocation Actions-----------------------------------
 */
function getGeolocationData() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function(location) {
            displayGeolocationData(location, 'fetched');
        });
        navigator.geolocation.watchPosition(displayGeolocationData);
    } else {
        alert('Geolocation API not supported.');
    }
}

function displayGeolocationData(location) {
    $(".geolocation-hidden").fadeIn("Slow");
    document.getElementById('geo-latitude').innerHTML = location.coords.latitude;
    document.getElementById('geo-longitude').innerHTML = location.coords.longitude;
    document.getElementById('geo-heading').innerHTML = location.coords.heading;
    document.getElementById('geo-accuracy').innerHTML = location.coords.accuracy + ' meters';
    document.getElementById('geo-altitude').innerHTML = location.coords.altitude + ' meters';
    document.getElementById('geo-altitude-accuracy').innerHTML = location.coords.altitudeAccuracy + ' meters';
    document.getElementById('geo-speed').innerHTML = location.coords.speed + ' km/h';

    document.getElementById('geo-map').setAttribute('latitude', location.coords.latitude);
    document.getElementById('geo-map').setAttribute('longitude', location.coords.longitude);

    document.getElementById('geo-marker').setAttribute('latitude', location.coords.latitude);
    document.getElementById('geo-marker').setAttribute('longitude', location.coords.longitude);
}

/*
 ---------------------------Video Actions-----------------------------------
 */
function getUserMedia(options, successCallback, failureCallback) {
    var api = navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia;
    if (api) {
        return api.bind(navigator)(options, successCallback, failureCallback);
    }
    alert('User Media API not supported.');
}

var theStream;
var theRecorder;
var recordedChunks = [];

function recorderOnDataAvailable (event) {
    if (event.data.size == 0) return;
    recordedChunks.push(event.data);
}

function displayVideoControls() {
    $(".video-hidden").fadeIn("Slow");

    document.querySelector('#video-record').addEventListener('click', function (e) {
        var constraints = {video: true, audio: true};
        getUserMedia(constraints, function (stream) {
            var mediaControl = document.querySelector('video');
            if (navigator.mozGetUserMedia) {
                mediaControl.mozSrcObject = stream;
            } else {
                mediaControl.srcObject = stream;
                mediaControl.src = (window.URL || window.webkitURL).createObjectURL(stream);
            }

            theStream = stream;
            try {
                recorder = new MediaRecorder(stream, {mimeType : "video/webm"});
            } catch (e) {
                console.error('Exception while creating MediaRecorder: ' + e);
                return;
            }
            theRecorder = recorder;
            console.log('MediaRecorder created');
            recorder.ondataavailable = recorderOnDataAvailable;
            recorder.start(100);
        }, function (err) {
            alert('Error: ' + err);
        });
    });

    document.querySelector('#video-download').addEventListener('click', function (e) {
        console.log('Saving data');
        theRecorder.stop();
        theStream.getTracks()[0].stop();

        var blob = new Blob(recordedChunks, {type: "video/webm"});
        var url = (window.URL || window.webkitURL).createObjectURL(blob);
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = url;
        a.download = 'video.webm';
        a.click();

        // setTimeout() here is needed for Firefox.
        setTimeout(function () {
            (window.URL || window.webkitURL).revokeObjectURL(url);
        }, 100);
    });
}