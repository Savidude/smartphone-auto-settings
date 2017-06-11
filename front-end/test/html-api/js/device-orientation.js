var $ = document.getElementById.bind(document);

if (location.href.indexOf('debug') !== -1) {
    $('alert').style.display = 'none';
}

var orientKey = 'orientation';
if ('mozOrientation' in screen) {
    orientKey = 'mozOrientation';
} else if ('msOrientation' in screen) {
    orientKey = 'msOrientation';
}

var target = $('logTarget');
var device = $('device');
var orientationTypeLabel = $('orientationType');

function logChange(event) {
    var timeBadge = new Date().toTimeString().split(' ')[0];
    var newState = document.createElement('p');
    newState.innerHTML = '<span class="badge">' + timeBadge + '</span> ' + event + '.';
    target.appendChild(newState);
}

if (screen[orientKey]) {
    function update() {
        //Getting the screen orientation type
        var type = screen[orientKey].type || screen[orientKey];
        orientationTypeLabel.innerHTML = type;

        var landscape = type.indexOf('landscape') !== -1;

        if (landscape) { //If the device orientation is landscape, change the styling of the 'device' div to make it look landscape
            device.style.width = '180px';
            device.style.height = '100px';
        } else { //If the device orientation is portrait, change the styling of the 'device' div to make it look portrait
            device.style.width = '100px';
            device.style.height = '180px';
        }

        var rotate = type.indexOf('secondary') === -1 ? 0 : 180;
        var rotateStr = 'rotate(' + rotate + 'deg)';

        device.style.webkitTransform = rotateStr;
        device.style.MozTransform = rotateStr;
        device.style.transform = rotateStr;
    }

    update();

    if ('onchange' in screen[orientKey]) { // newer API
        screen[orientKey].addEventListener('change', function() {
            logChange('Orientation changed to <b>' + screen[orientKey].type + '</b>');
            update();
        });
    } else if ('onorientationchange' in screen) { // older API
        screen.addEventListener('orientationchange', function() {
            logChange('Orientation changed to <b>' + screen[orientKey] + '</b>');
            update();
        });
    }

    // browsers require full screen mode in order to obtain the orientation lock
    var goFullScreen = null;
    var exitFullScreen = null;
    if ('requestFullscreen' in document.documentElement) {
        goFullScreen = 'requestFullscreen';
        exitFullScreen = 'exitFullscreen';
    } else if ('mozRequestFullScreen' in document.documentElement) {
        goFullScreen = 'mozRequestFullScreen';
        exitFullScreen = 'mozCancelFullScreen';
    } else if ('webkitRequestFullscreen' in document.documentElement) {
        goFullScreen = 'webkitRequestFullscreen';
        exitFullScreen = 'webkitExitFullscreen';
    } else if ('msRequestFullscreen') {
        goFullScreen = 'msRequestFullscreen';
        exitFullScreen = 'msExitFullscreen';
    }

    $('lock').addEventListener('click', function() {
        document.documentElement[goFullScreen] && document.documentElement[goFullScreen]();

        var promise = null;
        if (screen[orientKey].lock) {
            promise = screen[orientKey].lock(screen[orientKey].type);
        } else {
            promise = screen.orientationLock(screen[orientKey]);
        }

        promise
            .then(function() {
                logChange('Screen lock acquired');
                $('unlock').style.display = 'block';
                $('lock').style.display = 'none';
            })
            .catch(function(err) {
                logChange('Cannot acquire orientation lock: ' + err);
                document[exitFullScreen] && document[exitFullScreen]();
            });
    });

    $('unlock').addEventListener('click', function() {
        document[exitFullScreen] && document[exitFullScreen]();

        if (screen[orientKey].unlock) {
            screen[orientKey].unlock();
        } else {
            screen.orientationUnlock();
        }

        logChange('Screen lock removed.');
        $('unlock').style.display = 'none';
        $('lock').style.display = 'block';
    });
}

document.getElementById('alert').hidden = window.self === window.top;