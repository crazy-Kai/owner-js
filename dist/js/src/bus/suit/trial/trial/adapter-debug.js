define("src/bus/suit/trial/trial/adapter-debug", [], function(require, exports, module) {
    function maybeFixConfiguration(pcConfig) {
        if (pcConfig)
            for (var i = 0; i < pcConfig.iceServers.length; i++) pcConfig.iceServers[i].hasOwnProperty("urls") && (pcConfig.iceServers[i].url = pcConfig.iceServers[i].urls, delete pcConfig.iceServers[i].urls)
    }
    var RTCPeerConnection = null,
        getUserMedia = null,
        attachMediaStream = null,
        reattachMediaStream = null,
        webrtcDetectedBrowser = null,
        webrtcDetectedVersion = null;
    if (navigator.mozGetUserMedia) webrtcDetectedBrowser = "firefox", webrtcDetectedVersion = parseInt(navigator.userAgent.match(/Firefox\/([0-9]+)\./)[1], 10), RTCPeerConnection = function(pcConfig, pcConstraints) {
        return maybeFixConfiguration(pcConfig), new mozRTCPeerConnection(pcConfig, pcConstraints)
    }, window.RTCSessionDescription = mozRTCSessionDescription, window.RTCIceCandidate = mozRTCIceCandidate, getUserMedia = navigator.mozGetUserMedia.bind(navigator), navigator.getUserMedia = getUserMedia, MediaStreamTrack.getSources = function(successCb) {
        setTimeout(function() {
            var infos = [{
                kind: "audio",
                id: "default",
                label: "",
                facing: ""
            }, {
                kind: "video",
                id: "default",
                label: "",
                facing: ""
            }];
            successCb(infos)
        }, 0)
    }, window.createIceServer = function(url, username, password) {
        var iceServer = null,
            urlParts = url.split(":");
        if (0 === urlParts[0].indexOf("stun")) iceServer = {
            url: url
        };
        else if (0 === urlParts[0].indexOf("turn"))
            if (webrtcDetectedVersion < 27) {
                var turnUrlParts = url.split("?");
                1 !== turnUrlParts.length && 0 !== turnUrlParts[1].indexOf("transport=udp") || (iceServer = {
                    url: turnUrlParts[0],
                    credential: password,
                    username: username
                })
            } else iceServer = {
                url: url,
                credential: password,
                username: username
            };
        return iceServer
    }, window.createIceServers = function(urls, username, password) {
        for (var iceServers = [], i = 0; i < urls.length; i++) {
            var iceServer = window.createIceServer(urls[i], username, password);
            null !== iceServer && iceServers.push(iceServer)
        }
        return iceServers
    }, attachMediaStream = function(element, stream) {
        element.mozSrcObject = stream
    }, reattachMediaStream = function(to, from) {
        to.mozSrcObject = from.mozSrcObject
    };
    else if (navigator.webkitGetUserMedia) {
        webrtcDetectedBrowser = "chrome";
        var result = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
        webrtcDetectedVersion = null !== result ? parseInt(result[2], 10) : 999, window.createIceServer = function(url, username, password) {
            var iceServer = null,
                urlParts = url.split(":");
            return 0 === urlParts[0].indexOf("stun") ? iceServer = {
                url: url
            } : 0 === urlParts[0].indexOf("turn") && (iceServer = {
                url: url,
                credential: password,
                username: username
            }), iceServer
        }, window.createIceServers = function(urls, username, password) {
            return {
                urls: urls,
                credential: password,
                username: username
            }
        }, RTCPeerConnection = function(pcConfig, pcConstraints) {
            return new webkitRTCPeerConnection(pcConfig, pcConstraints)
        }, getUserMedia = navigator.webkitGetUserMedia.bind(navigator), navigator.getUserMedia = getUserMedia, attachMediaStream = function(element, stream) {
            "undefined" != typeof element.srcObject ? element.srcObject = stream : "undefined" != typeof element.mozSrcObject ? element.mozSrcObject = stream : "undefined" != typeof element.src && (element.src = URL.createObjectURL(stream))
        }, reattachMediaStream = function(to, from) {
            to.src = from.src
        }
    }
    return {
        RTCPeerConnection: RTCPeerConnection,
        getUserMedia: getUserMedia,
        attachMediaStream: attachMediaStream,
        reattachMediaStream: reattachMediaStream,
        webrtcDetectedBrowser: webrtcDetectedBrowser,
        webrtcDetectedVersion: webrtcDetectedVersion
    }
});