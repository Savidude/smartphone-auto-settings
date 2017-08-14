function executeActions(event) {
    var action = event.actions;
    console.log(JSON.stringify(action, null, 2));
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
            case 'photo':
                if (action.photo !== undefined && action.photo === true) {
                    displayPhotoControls();
                }
                break;
            case 'vibration':
                if (action.vibration !== undefined) {
                    vibratePattern(action.vibration);
                }
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
            var mediaControl = document.querySelector('#record-stream');
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

function displayPhotoControls() {
    $(".photo-hidden").fadeIn("Slow");

    var video = document.querySelector('#camera-stream'),
        snap = document.querySelector('#snap'),
        image = document.querySelector('#snap'),
        controls = document.querySelector('.controls'),
        take_photo_btn = document.querySelector('#take-photo'),
        delete_photo_btn = document.querySelector('#delete-photo'),
        download_photo_btn = document.querySelector('#download-photo'),
        error_message = document.querySelector('#error-message');

    // The getUserMedia interface is used for handling camera input.
    // Some browsers need a prefix so here we're covering all the options
    navigator.getMedia = ( navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

    if(!navigator.getMedia){
        displayErrorMessage("Your browser doesn't have support for the navigator.getUserMedia interface.");
    }
    else{
        // Request the camera.
        navigator.getMedia(
            {
                video: true
            },
            // Success Callback
            function(stream){
                // Create an object URL for the video stream and
                // set it as src of our HTLM video element.
                video.src = window.URL.createObjectURL(stream);

                // Play the video element to start the stream.
                video.play();
                video.onplay = function() {
                    showVideo();
                };

            },
            // Error Callback
            function(err){
                displayErrorMessage("There was an error with accessing the camera stream: " + err.name, err);
            }
        );
    }

    take_photo_btn.addEventListener("click", function(e){

        e.preventDefault();

        var snap = takeSnapshot();

        // Show image.
        image.setAttribute('src', snap);
        image.classList.add("visible");

        // Enable delete and save buttons
        delete_photo_btn.classList.remove("disabled");
        download_photo_btn.classList.remove("disabled");

        // Set the href attribute of the download button to the snap url.
        download_photo_btn.href = snap;

        // Pause video playback of stream.
        video.pause();

    });


    delete_photo_btn.addEventListener("click", function(e){

        e.preventDefault();

        // Hide image.
        image.setAttribute('src', "");
        image.classList.remove("visible");

        // Disable delete and save buttons
        delete_photo_btn.classList.add("disabled");
        download_photo_btn.classList.add("disabled");

        // Resume playback of stream.
        video.play();

    });

    function displayErrorMessage(error_msg, error){
        error = error || "";
        if(error){
            console.error(error);
        }

        error_message.innerText = error_msg;

        hideUI();
        error_message.classList.add("visible");
    }

    function showVideo(){
        // Display the video stream and the controls.

        hideUI();
        video.classList.add("visible");
        controls.classList.add("visible");
    }

    function hideUI(){
        // Helper function for clearing the app UI.

        controls.classList.remove("visible");
        video.classList.remove("visible");
        snap.classList.remove("visible");
        error_message.classList.remove("visible");
    }

    function takeSnapshot(){
        // Here we're using a trick that involves a hidden canvas element.

        var hidden_canvas = document.querySelector('canvas'),
            context = hidden_canvas.getContext('2d');

        var width = video.videoWidth,
            height = video.videoHeight;

        if (width && height) {

            // Setup a canvas with the same dimensions as the video.
            hidden_canvas.width = width;
            hidden_canvas.height = height;

            // Make a copy of the current frame in the video on the canvas.
            context.drawImage(video, 0, 0, width, height);

            // Turn the canvas image into a dataURL that can be used as a src for our photo.
            return hidden_canvas.toDataURL('image/png');
        }
    }
}

/*
 ---------------------------Vibration Actions-----------------------------------
 */
function vibratePattern(pattern) {
    navigator.vibrate(pattern);
}