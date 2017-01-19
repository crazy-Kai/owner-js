define("src/bus/suit/trial/trial/janus-debug", ["src/bus/suit/trial/trial/adapter-debug"], function(require, exports, module) {
    function Janus(gatewayCallbacks) {
        function randomString(len) {
            for (var charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", randomString = "", i = 0; i < len; i++) {
                var randomPoz = Math.floor(Math.random() * charSet.length);
                randomString += charSet.substring(randomPoz, randomPoz + 1)
            }
            return randomString
        }

        function eventHandler() {
            if (null != sessionId) {
                if (Janus.log("Long poll..."), !connected) return void Janus.log("Is the gateway down? (connected=false)");
                var longpoll = server + "/" + sessionId + "?rid=" + (new Date).getTime();
                void 0 !== maxev && null !== maxev && (longpoll = longpoll + "&maxev=" + maxev), $.ajax({
                    type: "GET",
                    url: longpoll,
                    cache: !1,
                    timeout: 6e4,
                    success: handleEvent,
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        return Janus.log(textStatus + ": " + errorThrown), retries++, retries > 3 ? (connected = !1, void gatewayCallbacks.error("Lost connection to the gateway (is it down?)")) : void eventHandler()
                    },
                    dataType: "json"
                })
            }
        }

        function handleEvent(json) {
            if (retries = 0, websockets || void 0 === sessionId || null === sessionId || setTimeout(eventHandler, 200), Janus.log("Got event on session " + sessionId), Janus.log(json), websockets || !$.isArray(json)) {
                if ("keepalive" !== json.janus)
                    if ("ack" !== json.janus)
                        if ("success" !== json.janus) {
                            if ("webrtcup" !== json.janus)
                                if ("hangup" === json.janus) {
                                    var sender = json.sender;
                                    if (void 0 === sender || null === sender) return void Janus.log("Missing sender...");
                                    var pluginHandle = pluginHandles[sender];
                                    if (void 0 === pluginHandle || null === pluginHandle) return void Janus.log("This handle is not attached to this session");
                                    pluginHandle.hangup()
                                } else if ("detached" === json.janus) {
                                var sender = json.sender;
                                if (void 0 === sender || null === sender) return void Janus.log("Missing sender...");
                                var pluginHandle = pluginHandles[sender];
                                if (void 0 === pluginHandle || null === pluginHandle) return void Janus.log("This handle is not attached to this session");
                                pluginHandle.ondetached(), pluginHandle.detach()
                            } else {
                                if ("error" === json.janus) {
                                    Janus.log("Ooops: " + json.error.code + " " + json.error.reason);
                                    var transaction = json.transaction;
                                    if (null !== transaction && void 0 !== transaction) {
                                        var reportSuccess = transactions[transaction];
                                        null !== reportSuccess && void 0 !== reportSuccess && reportSuccess(json), delete transactions[transaction]
                                    }
                                    return
                                }
                                if ("event" === json.janus) {
                                    var sender = json.sender;
                                    if (void 0 === sender || null === sender) return void Janus.log("Missing sender...");
                                    var plugindata = json.plugindata;
                                    if (void 0 === plugindata || null === plugindata) return void Janus.log("Missing plugindata...");
                                    Janus.log("  -- Event is coming from " + sender + " (" + plugindata.plugin + ")");
                                    var data = plugindata.data;
                                    Janus.log(data);
                                    var pluginHandle = pluginHandles[sender];
                                    if (void 0 === pluginHandle || null === pluginHandle) return void Janus.log("This handle is not attached to this session");
                                    var jsep = json.jsep;
                                    void 0 !== jsep && null !== jsep && (Janus.log("Handling SDP as well..."), Janus.log(jsep));
                                    var callback = pluginHandle.onmessage;
                                    null !== callback && void 0 !== callback ? (Janus.log("Notifying application..."), callback(data, jsep)) : Janus.log("No provided notification callback")
                                } else Janus.log("Unknown message '" + json.janus + "'")
                            }
                        } else {
                            var transaction = json.transaction;
                            if (null !== transaction && void 0 !== transaction) {
                                var reportSuccess = transactions[transaction];
                                null !== reportSuccess && void 0 !== reportSuccess && reportSuccess(json), delete transactions[transaction]
                            }
                        }
                else {
                    var transaction = json.transaction;
                    if (null !== transaction && void 0 !== transaction) {
                        var reportSuccess = transactions[transaction];
                        null !== reportSuccess && void 0 !== reportSuccess && reportSuccess(json), delete transactions[transaction]
                    }
                }
            } else
                for (var i = 0; i < json.length; i++) handleEvent(json[i])
        }

        function keepAlive() {
            if (null !== server && websockets && connected) {
                setTimeout(keepAlive, 3e4);
                var request = {
                    janus: "keepalive",
                    session_id: sessionId,
                    transaction: randomString(12)
                };
                ws.send(JSON.stringify(request))
            }
        }

        function createSession(callbacks) {
            var transaction = randomString(12),
                request = {
                    janus: "create",
                    transaction: transaction
                };
            return null === server && $.isArray(servers) && (server = servers[serversIndex], 0 === server.indexOf("ws") ? (websockets = !0, Janus.log("Server #" + (serversIndex + 1) + ": trying WebSockets to contact Janus")) : (websockets = !1, Janus.log("Server #" + (serversIndex + 1) + ": trying REST API to contact Janus")), Janus.log(server)), websockets ? (ws = new WebSocket(server, "janus-protocol"), ws.onerror = function() {
                return Janus.log("Error connecting to the Janus WebSockets server..."), $.isArray(servers) ? (serversIndex++, serversIndex == servers.length ? void callbacks.error("Error connecting to any of the provided Janus servers: Is the gateway down?") : (server = null, void setTimeout(function() {
                    createSession(callbacks)
                }, 200))) : void callbacks.error("Error connecting to the Janus WebSockets server: Is the gateway down?")
            }, ws.onopen = function() {
                transactions[transaction] = function(json) {
                    return Janus.log("Create session:"), Janus.log(json), "success" !== json.janus ? (Janus.log("Ooops: " + json.error.code + " " + json.error.reason), void callbacks.error(json.error.reason)) : (setTimeout(keepAlive, 3e4), connected = !0, sessionId = json.data.id, Janus.log("Created session: " + sessionId), Janus.sessions[sessionId] = that, void callbacks.success())
                }, ws.send(JSON.stringify(request))
            }, ws.onmessage = function(event) {
                handleEvent(JSON.parse(event.data))
            }, void(ws.onclose = function() {
                null !== server && connected && (connected = !1, gatewayCallbacks.error("Lost connection to the gateway (is it down?)"))
            })) : void $.ajax({
                type: "POST",
                url: server,
                cache: !1,
                contentType: "application/json",
                data: JSON.stringify(request),
                success: function(json) {
                    return Janus.log("Create session:"), Janus.log(json), "success" !== json.janus ? (Janus.log("Ooops: " + json.error.code + " " + json.error.reason), void callbacks.error(json.error.reason)) : (connected = !0, sessionId = json.data.id, Janus.log("Created session: " + sessionId), Janus.sessions[sessionId] = that, eventHandler(), void callbacks.success())
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    return Janus.log(textStatus + ": " + errorThrown), $.isArray(servers) ? (serversIndex++, serversIndex == servers.length ? void callbacks.error("Error connecting to any of the provided Janus servers: Is the gateway down?") : (server = null, void setTimeout(function() {
                        createSession(callbacks)
                    }, 200))) : void("" === errorThrown ? callbacks.error(textStatus + ": Is the gateway down?") : callbacks.error(textStatus + ": " + errorThrown))
                },
                dataType: "json"
            })
        }

        function destroySession(callbacks, syncRequest) {
            if (syncRequest = syncRequest === !0, Janus.log("Destroying session " + sessionId + " (sync=" + syncRequest + ")"), callbacks = callbacks || {}, callbacks.success = "function" == typeof callbacks.success ? callbacks.success : jQuery.noop, !connected) return Janus.log("Is the gateway down? (connected=false)"), void callbacks.success();
            if (void 0 === sessionId || null === sessionId) return Janus.log("No session to destroy"), callbacks.success(), void gatewayCallbacks.destroyed();
            delete Janus.sessions[sessionId];
            for (ph in pluginHandles) {
                var phv = pluginHandles[ph];
                Janus.log("Destroying handle " + phv.id + " (" + phv.plugin + ")"), destroyHandle(phv.id, null, syncRequest)
            }
            var request = {
                janus: "destroy",
                transaction: randomString(12)
            };
            return websockets ? (request.session_id = sessionId, ws.send(JSON.stringify(request)), callbacks.success(), void gatewayCallbacks.destroyed()) : void $.ajax({
                type: "POST",
                url: server + "/" + sessionId,
                async: syncRequest,
                cache: !1,
                contentType: "application/json",
                data: JSON.stringify(request),
                success: function(json) {
                    Janus.log("Destroyed session:"), Janus.log(json), sessionId = null, connected = !1, "success" !== json.janus && Janus.log("Ooops: " + json.error.code + " " + json.error.reason), callbacks.success(), gatewayCallbacks.destroyed()
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    Janus.log(textStatus + ": " + errorThrown), sessionId = null, connected = !1, callbacks.success(), gatewayCallbacks.destroyed()
                },
                dataType: "json"
            })
        }

        function createHandle(callbacks) {
            if (callbacks = callbacks || {}, callbacks.success = "function" == typeof callbacks.success ? callbacks.success : jQuery.noop, callbacks.error = "function" == typeof callbacks.error ? callbacks.error : jQuery.noop, callbacks.consentDialog = "function" == typeof callbacks.consentDialog ? callbacks.consentDialog : jQuery.noop, callbacks.onmessage = "function" == typeof callbacks.onmessage ? callbacks.onmessage : jQuery.noop, callbacks.onlocalstream = "function" == typeof callbacks.onlocalstream ? callbacks.onlocalstream : jQuery.noop, callbacks.onremotestream = "function" == typeof callbacks.onremotestream ? callbacks.onremotestream : jQuery.noop, callbacks.ondata = "function" == typeof callbacks.ondata ? callbacks.ondata : jQuery.noop, callbacks.ondataopen = "function" == typeof callbacks.ondataopen ? callbacks.ondataopen : jQuery.noop, callbacks.oncleanup = "function" == typeof callbacks.oncleanup ? callbacks.oncleanup : jQuery.noop, callbacks.ondetached = "function" == typeof callbacks.ondetached ? callbacks.ondetached : jQuery.noop, !connected) return Janus.log("Is the gateway down? (connected=false)"), void callbacks.error("Is the gateway down? (connected=false)");
            var plugin = callbacks.plugin;
            if (void 0 === plugin || null === plugin) return Janus.log("Invalid plugin"), void callbacks.error("Invalid plugin");
            var transaction = randomString(12),
                request = {
                    janus: "attach",
                    plugin: plugin,
                    transaction: transaction
                };
            return websockets ? (transactions[transaction] = function(json) {
                if (Janus.log("Create handle:"), Janus.log(json), "success" !== json.janus) return Janus.log("Ooops: " + json.error.code + " " + json.error.reason), void callbacks.error("Ooops: " + json.error.code + " " + json.error.reason);
                var handleId = json.data.id;
                Janus.log("Created handle: " + handleId);
                var pluginHandle = {
                    session: that,
                    plugin: plugin,
                    id: handleId,
                    webrtcStuff: {
                        started: !1,
                        myStream: null,
                        mySdp: null,
                        pc: null,
                        dataChannel: null,
                        dtmfSender: null,
                        trickle: !0,
                        iceDone: !1,
                        sdpSent: !1,
                        bitrate: {
                            value: null,
                            bsnow: null,
                            bsbefore: null,
                            tsnow: null,
                            tsbefore: null,
                            timer: null
                        }
                    },
                    getId: function() {
                        return handleId
                    },
                    getPlugin: function() {
                        return plugin
                    },
                    getBitrate: function() {
                        return getBitrate(handleId)
                    },
                    send: function(callbacks) {
                        sendMessage(handleId, callbacks)
                    },
                    data: function(callbacks) {
                        sendData(handleId, callbacks)
                    },
                    dtmf: function(callbacks) {
                        sendDtmf(handleId, callbacks)
                    },
                    consentDialog: callbacks.consentDialog,
                    onmessage: callbacks.onmessage,
                    createOffer: function(callbacks) {
                        prepareWebrtc(handleId, callbacks)
                    },
                    createAnswer: function(callbacks) {
                        prepareWebrtc(handleId, callbacks)
                    },
                    handleRemoteJsep: function(callbacks) {
                        prepareWebrtcPeer(handleId, callbacks)
                    },
                    onlocalstream: callbacks.onlocalstream,
                    onremotestream: callbacks.onremotestream,
                    ondata: callbacks.ondata,
                    ondataopen: callbacks.ondataopen,
                    oncleanup: callbacks.oncleanup,
                    ondetached: callbacks.ondetached,
                    hangup: function() {
                        cleanupWebrtc(handleId)
                    },
                    detach: function(callbacks) {
                        destroyHandle(handleId, callbacks)
                    }
                };
                pluginHandles[handleId] = pluginHandle, callbacks.success(pluginHandle)
            }, request.session_id = sessionId, void ws.send(JSON.stringify(request))) : void $.ajax({
                type: "POST",
                url: server + "/" + sessionId,
                cache: !1,
                contentType: "application/json",
                data: JSON.stringify(request),
                success: function(json) {
                    if (Janus.log("Create handle:"), Janus.log(json), "success" !== json.janus) return Janus.log("Ooops: " + json.error.code + " " + json.error.reason), void callbacks.error("Ooops: " + json.error.code + " " + json.error.reason);
                    var handleId = json.data.id;
                    Janus.log("Created handle: " + handleId);
                    var pluginHandle = {
                        session: that,
                        plugin: plugin,
                        id: handleId,
                        webrtcStuff: {
                            started: !1,
                            myStream: null,
                            mySdp: null,
                            pc: null,
                            dataChannel: null,
                            dtmfSender: null,
                            trickle: !0,
                            iceDone: !1,
                            sdpSent: !1,
                            bitrate: {
                                value: null,
                                bsnow: null,
                                bsbefore: null,
                                tsnow: null,
                                tsbefore: null,
                                timer: null
                            }
                        },
                        getId: function() {
                            return handleId
                        },
                        getPlugin: function() {
                            return plugin
                        },
                        getBitrate: function() {
                            return getBitrate(handleId)
                        },
                        send: function(callbacks) {
                            sendMessage(handleId, callbacks)
                        },
                        data: function(callbacks) {
                            sendData(handleId, callbacks)
                        },
                        dtmf: function(callbacks) {
                            sendDtmf(handleId, callbacks)
                        },
                        consentDialog: callbacks.consentDialog,
                        onmessage: callbacks.onmessage,
                        createOffer: function(callbacks) {
                            prepareWebrtc(handleId, callbacks)
                        },
                        createAnswer: function(callbacks) {
                            prepareWebrtc(handleId, callbacks)
                        },
                        handleRemoteJsep: function(callbacks) {
                            prepareWebrtcPeer(handleId, callbacks)
                        },
                        onlocalstream: callbacks.onlocalstream,
                        onremotestream: callbacks.onremotestream,
                        ondata: callbacks.ondata,
                        ondataopen: callbacks.ondataopen,
                        oncleanup: callbacks.oncleanup,
                        ondetached: callbacks.ondetached,
                        hangup: function() {
                            cleanupWebrtc(handleId)
                        },
                        detach: function(callbacks) {
                            destroyHandle(handleId, callbacks)
                        }
                    };
                    pluginHandles[handleId] = pluginHandle, callbacks.success(pluginHandle)
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    Janus.log(textStatus + ": " + errorThrown)
                },
                dataType: "json"
            })
        }

        function sendMessage(handleId, callbacks) {
            if (callbacks = callbacks || {}, callbacks.success = "function" == typeof callbacks.success ? callbacks.success : jQuery.noop, callbacks.error = "function" == typeof callbacks.error ? callbacks.error : jQuery.noop, !connected) return Janus.log("Is the gateway down? (connected=false)"), void callbacks.error("Is the gateway down? (connected=false)");
            var message = callbacks.message,
                jsep = callbacks.jsep,
                transaction = randomString(12),
                request = {
                    janus: "message",
                    body: message,
                    transaction: transaction
                };
            return null !== jsep && void 0 !== jsep && (request.jsep = jsep), Janus.log("Sending message to plugin (handle=" + handleId + "):"), Janus.log(request), websockets ? (request.session_id = sessionId, request.handle_id = handleId, transactions[transaction] = function(json) {
                if (Janus.log(json), Janus.log("Message sent!"), "success" === json.janus) {
                    var plugindata = json.plugindata;
                    if (void 0 === plugindata || null === plugindata) return Janus.log("Request succeeded, but missing plugindata..."), void callbacks.success();
                    Janus.log("Synchronous transaction successful (" + plugindata.plugin + ")");
                    var data = plugindata.data;
                    return Janus.log(data), void callbacks.success(data)
                }
                return "ack" !== json.janus ? void(void 0 !== json.error && null !== json.error ? (Janus.log("Ooops: " + json.error.code + " " + json.error.reason), callbacks.error(json.error.code + " " + json.error.reason)) : (Janus.log("Unknown error"), callbacks.error("Unknown error"))) : void callbacks.success()
            }, void ws.send(JSON.stringify(request))) : void $.ajax({
                type: "POST",
                url: server + "/" + sessionId + "/" + handleId,
                cache: !1,
                contentType: "application/json",
                data: JSON.stringify(request),
                success: function(json) {
                    if (Janus.log(json), Janus.log("Message sent!"), "success" === json.janus) {
                        var plugindata = json.plugindata;
                        if (void 0 === plugindata || null === plugindata) return Janus.log("Request succeeded, but missing plugindata..."), void callbacks.success();
                        Janus.log("Synchronous transaction successful (" + plugindata.plugin + ")");
                        var data = plugindata.data;
                        return Janus.log(data), void callbacks.success(data)
                    }
                    return "ack" !== json.janus ? void(void 0 !== json.error && null !== json.error ? (Janus.log("Ooops: " + json.error.code + " " + json.error.reason), callbacks.error(json.error.code + " " + json.error.reason)) : (Janus.log("Unknown error"), callbacks.error("Unknown error"))) : void callbacks.success()
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    Janus.log(textStatus + ": " + errorThrown), callbacks.error(textStatus + ": " + errorThrown)
                },
                dataType: "json"
            })
        }

        function sendTrickleCandidate(handleId, candidate) {
            if (!connected) return void Janus.log("Is the gateway down? (connected=false)");
            var request = {
                janus: "trickle",
                candidate: candidate,
                transaction: randomString(12)
            };
            return Janus.log("Sending trickle candidate (handle=" + handleId + "):"), Janus.log(request), websockets ? (request.session_id = sessionId, request.handle_id = handleId, void ws.send(JSON.stringify(request))) : void $.ajax({
                type: "POST",
                url: server + "/" + sessionId + "/" + handleId,
                cache: !1,
                contentType: "application/json",
                data: JSON.stringify(request),
                success: function(json) {
                    if (Janus.log(json), Janus.log("Candidate sent!"), "ack" !== json.janus) return void Janus.log("Ooops: " + json.error.code + " " + json.error.reason)
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    Janus.log(textStatus + ": " + errorThrown)
                },
                dataType: "json"
            })
        }

        function sendData(handleId, callbacks) {
            callbacks = callbacks || {}, callbacks.success = "function" == typeof callbacks.success ? callbacks.success : jQuery.noop, callbacks.error = "function" == typeof callbacks.error ? callbacks.error : jQuery.noop;
            var pluginHandle = pluginHandles[handleId],
                config = pluginHandle.webrtcStuff;
            if (null === config.dataChannel || void 0 === config.dataChannel) return Janus.log("Invalid data channel"), void callbacks.error("Invalid data channel");
            var text = callbacks.text;
            return null === text || void 0 === text ? (Janus.log("Invalid text"), void callbacks.error("Invalid text")) : (Janus.log("Sending string on data channel: " + text), config.dataChannel.send(text), void callbacks.success())
        }

        function sendDtmf(handleId, callbacks) {
            callbacks = callbacks || {}, callbacks.success = "function" == typeof callbacks.success ? callbacks.success : jQuery.noop, callbacks.error = "function" == typeof callbacks.error ? callbacks.error : jQuery.noop;
            var pluginHandle = pluginHandles[handleId],
                config = pluginHandle.webrtcStuff;
            if (null === config.dtmfSender || void 0 === config.dtmfSender) {
                if (void 0 !== config.myStream && null !== config.myStream) {
                    var tracks = config.myStream.getAudioTracks();
                    if (null !== tracks && void 0 !== tracks && tracks.length > 0) {
                        var local_audio_track = tracks[0];
                        config.dtmfSender = config.pc.createDTMFSender(local_audio_track), Janus.log("Created DTMF Sender"), config.dtmfSender.ontonechange = function(tone) {
                            Janus.log("Sent DTMF tone: " + tone.tone)
                        }
                    }
                }
                if (null === config.dtmfSender || void 0 === config.dtmfSender) return Janus.log("Invalid DTMF configuration"), void callbacks.error("Invalid DTMF configuration")
            }
            var dtmf = callbacks.dtmf;
            if (null === dtmf || void 0 === dtmf) return Janus.log("Invalid DTMF parameters"), void callbacks.error("Invalid DTMF parameters");
            var tones = dtmf.tones;
            if (null === tones || void 0 === tones) return Janus.log("Invalid DTMF string"), void callbacks.error("Invalid DTMF string");
            var duration = dtmf.duration;
            null !== duration && void 0 !== duration || (duration = 500);
            var gap = dtmf.gap;
            null !== gap && void 0 !== gap || (gap = 50), Janus.log("Sending DTMF string " + tones + " (duration " + duration + "ms, gap " + gap + "ms"), config.dtmfSender.insertDTMF(tones, duration, gap)
        }

        function destroyHandle(handleId, callbacks, syncRequest) {
            if (syncRequest = syncRequest === !0, Janus.log("Destroying handle " + handleId + " (sync=" + syncRequest + ")"), callbacks = callbacks || {}, callbacks.success = "function" == typeof callbacks.success ? callbacks.success : jQuery.noop, callbacks.error = "function" == typeof callbacks.error ? callbacks.error : jQuery.noop, cleanupWebrtc(handleId), !connected) return Janus.log("Is the gateway down? (connected=false)"), void callbacks.error("Is the gateway down? (connected=false)");
            var request = {
                janus: "detach",
                transaction: randomString(12)
            };
            if (websockets) {
                request.session_id = sessionId, request.handle_id = handleId, ws.send(JSON.stringify(request));
                pluginHandles[handleId];
                return delete pluginHandles[handleId], void callbacks.success()
            }
            $.ajax({
                type: "POST",
                url: server + "/" + sessionId + "/" + handleId,
                async: syncRequest,
                cache: !1,
                contentType: "application/json",
                data: JSON.stringify(request),
                success: function(json) {
                    Janus.log("Destroyed handle:"), Janus.log(json), "success" !== json.janus && Janus.log("Ooops: " + json.error.code + " " + json.error.reason);
                    pluginHandles[handleId];
                    delete pluginHandles[handleId], callbacks.success()
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    Janus.log(textStatus + ": " + errorThrown);
                    pluginHandles[handleId];
                    delete pluginHandles[handleId], callbacks.success()
                },
                dataType: "json"
            })
        }

        function streamsDone(handleId, jsep, media, callbacks, stream) {
            var pluginHandle = pluginHandles[handleId];
            if (pluginHandle) {
                var config = pluginHandle.webrtcStuff;
                null !== stream && void 0 !== stream && Janus.log(stream), config.myStream = stream, Janus.log("streamsDone:"), null !== stream && void 0 !== stream && Janus.log(stream);
                var pc_config = {
                        iceServers: iceServers
                    },
                    pc_constraints = {
                        optional: [{
                            DtlsSrtpKeyAgreement: !0
                        }]
                    };
                if (ipv6Support === !0 && pc_constraints.optional.push({
                        googIPv6: !0
                    }), Janus.log("Creating PeerConnection:"), Janus.log(pc_constraints), config.pc = new RTCPeerConnection(pc_config, pc_constraints), Janus.log(config.pc), config.pc.getStats && "chrome" == webrtcDetectedBrowser && (config.bitrate.value = "0 kbps"), Janus.log("Preparing local SDP and gathering candidates (trickle=" + config.trickle + ")"), config.pc.onicecandidate = function(event) {
                        if (null == event.candidate) Janus.log("End of candidates."), config.iceDone = !0, config.trickle === !0 ? sendTrickleCandidate(handleId, {
                            completed: !0
                        }) : sendSDP(handleId, callbacks);
                        else {
                            var candidate = {
                                candidate: event.candidate.candidate,
                                sdpMid: event.candidate.sdpMid,
                                sdpMLineIndex: event.candidate.sdpMLineIndex
                            };
                            Janus.log("candidates: " + JSON.stringify(candidate)), config.trickle === !0 && sendTrickleCandidate(handleId, candidate)
                        }
                    }, null !== stream && void 0 !== stream && (Janus.log("Adding local stream"), config.pc.addStream(stream), pluginHandle.onlocalstream(stream)), config.pc.onaddstream = function(remoteStream) {
                        Janus.log("Handling Remote Stream:"), Janus.log(remoteStream), config.pc.getStats && "chrome" == webrtcDetectedBrowser && (Janus.log("Starting bitrate monitor"), config.bitrate.timer = setInterval(function() {
                            config.pc.getStats(function(stats) {
                                for (var results = stats.result(), i = 0; i < results.length; i++) {
                                    var res = results[i];
                                    if ("ssrc" == res.type && res.stat("googFrameHeightReceived"))
                                        if (config.bitrate.bsnow = res.stat("bytesReceived"), config.bitrate.tsnow = res.timestamp, null === config.bitrate.bsbefore || null === config.bitrate.tsbefore) config.bitrate.bsbefore = config.bitrate.bsnow, config.bitrate.tsbefore = config.bitrate.tsnow;
                                        else {
                                            var bitRate = Math.round(8 * (config.bitrate.bsnow - config.bitrate.bsbefore) / (config.bitrate.tsnow - config.bitrate.tsbefore));
                                            config.bitrate.value = bitRate + " kbits/sec", config.bitrate.bsbefore = config.bitrate.bsnow, config.bitrate.tsbefore = config.bitrate.tsnow
                                        }
                                }
                            })
                        }, 1e3)), pluginHandle.onremotestream(remoteStream.stream)
                    }, isDataEnabled(media)) {
                    Janus.log("Creating data channel");
                    var onDataChannelMessage = function(event) {
                            pluginHandle.ondata(event.data)
                        },
                        onDataChannelStateChange = function() {
                            var dcState = null !== config.dataChannel ? config.dataChannel.readyState : "null";
                            Janus.log("State change on data channel: " + dcState), "open" === dcState && pluginHandle.ondataopen()
                        },
                        onDataChannelError = function(error) {
                            Janus.log("Got error on data channel:"), Janus.log(error)
                        };
                    config.dataChannel = config.pc.createDataChannel("JanusDataChannel", {
                        ordered: !1
                    }), config.dataChannel.onmessage = onDataChannelMessage, config.dataChannel.onopen = onDataChannelStateChange, config.dataChannel.onclose = onDataChannelStateChange, config.dataChannel.onerror = onDataChannelError
                }
                null === jsep || void 0 === jsep ? createOffer(handleId, media, callbacks) : config.pc.setRemoteDescription(new RTCSessionDescription(jsep), function() {
                    Janus.log("Remote description accepted!"), createAnswer(handleId, media, callbacks)
                }, callbacks.error)
            }
        }

        function prepareWebrtc(handleId, callbacks) {
            function callbackUserMedia(error, stream) {
                pluginHandle.consentDialog(!1), error ? callbacks.error(error) : streamsDone(handleId, jsep, media, callbacks, stream)
            }

            function getScreenMedia(constraints, gsmCallback) {
                Janus.log("Adding media constraint (screen capture)"), Janus.log(constraints), getUserMedia(constraints, function(stream) {
                    gsmCallback(null, stream)
                }, function(error) {
                    pluginHandle.consentDialog(!1), gsmCallback(error)
                })
            }
            callbacks = callbacks || {}, callbacks.success = "function" == typeof callbacks.success ? callbacks.success : jQuery.noop, callbacks.error = "function" == typeof callbacks.error ? callbacks.error : webrtcError;
            var jsep = callbacks.jsep,
                media = callbacks.media,
                pluginHandle = pluginHandles[handleId],
                config = pluginHandle.webrtcStuff;
            if (void 0 !== config.pc && null !== config.pc) return Janus.log("Updating existing media session"), void(null === jsep || void 0 === jsep ? createOffer(handleId, media, callbacks) : config.pc.setRemoteDescription(new RTCSessionDescription(jsep), function() {
                Janus.log("Remote description accepted!"), createAnswer(handleId, media, callbacks)
            }, callbacks.error));
            if (config.trickle = isTrickleEnabled(callbacks.trickle), isAudioSendEnabled(media) || isVideoSendEnabled(media)) {
                var constraints = {
                    mandatory: {},
                    optional: []
                };
                pluginHandle.consentDialog(!0);
                var videoSupport = isVideoSendEnabled(media);
                if (videoSupport === !0 && void 0 != media && null != media)
                    if (media.video && "screen" != media.video) {
                        var width = 0,
                            height = 0,
                            maxHeight = 0;
                        "lowres" === media.video ? (height = 240, maxHeight = 240, width = 320) : "lowres-16:9" === media.video ? (height = 180, maxHeight = 240, width = 320) : "hires" === media.video || "hires-16:9" === media.video ? (height = 720, maxHeight = 720, width = 1280, navigator.mozGetUserMedia && (Janus.log(media.video + " unsupported, falling back to stdres (Firefox)"), height = 480, maxHeight = 480, width = 640)) : "stdres" === media.video ? (height = 480, maxHeight = 480, width = 640) : "stdres-16:9" === media.video ? (height = 360, maxHeight = 480, width = 640) : (Janus.log("Default video setting (" + media.video + ") is stdres 4:3"), height = 480, maxHeight = 480, width = 640), Janus.log("Adding media constraint " + media.video), videoSupport = navigator.mozGetUserMedia ? {
                            require: ["height", "width"],
                            height: {
                                max: maxHeight,
                                min: height
                            },
                            width: {
                                max: width,
                                min: width
                            }
                        } : {
                            mandatory: {
                                maxHeight: maxHeight,
                                minHeight: height,
                                maxWidth: width,
                                minWidth: width
                            },
                            optional: []
                        }, Janus.log(videoSupport)
                    } else if ("screen" === media.video) {
                    if ("https:" !== window.location.protocol) return Janus.log("Screen sharing only works on HTTPS, try the https:// version of this page"), pluginHandle.consentDialog(!1), void callbacks.error("Screen sharing only works on HTTPS, try the https:// version of this page");
                    var cache = {};
                    if (window.navigator.userAgent.match("Chrome")) {
                        var chromever = parseInt(window.navigator.userAgent.match(/Chrome\/(.*) /)[1], 10),
                            maxver = 33;
                        if (window.navigator.userAgent.match("Linux") && (maxver = 35), chromever >= 26 && chromever <= maxver) constraints = {
                            video: {
                                mandatory: {
                                    googLeakyBucket: !0,
                                    maxWidth: window.screen.width,
                                    maxHeight: window.screen.height,
                                    maxFrameRate: 3,
                                    chromeMediaSource: "screen"
                                }
                            },
                            audio: isAudioSendEnabled(media)
                        }, getScreenMedia(constraints, callbackUserMedia);
                        else {
                            var pending = window.setTimeout(function() {
                                return error = new Error("NavigatorUserMediaError"), error.name = 'The required Chrome extension is not installed: click <a href="#">here</a> to install it. (NOTE: this will need you to refresh the page)', pluginHandle.consentDialog(!1), callbacks.error(error)
                            }, 1e3);
                            cache[pending] = [callbackUserMedia, null], window.postMessage({
                                type: "janusGetScreen",
                                id: pending
                            }, "*")
                        }
                    } else if (window.navigator.userAgent.match("Firefox")) {
                        var ffver = parseInt(window.navigator.userAgent.match(/Firefox\/(.*)/)[1], 10);
                        if (!(ffver >= 33)) {
                            var error = new Error("NavigatorUserMediaError");
                            return error.name = "Your version of Firefox does not support screen sharing, please install Firefox 33 (or more recent versions)", pluginHandle.consentDialog(!1), void callbacks.error(error)
                        }
                        constraints = {
                            video: {
                                mozMediaSource: "window",
                                mediaSource: "window"
                            },
                            audio: isAudioSendEnabled(media)
                        }, getScreenMedia(constraints, function(err, stream) {
                            if (callbackUserMedia(err, stream), !err) var lastTime = stream.currentTime,
                                polly = window.setInterval(function() {
                                    stream || window.clearInterval(polly), stream.currentTime == lastTime && (window.clearInterval(polly), stream.onended && stream.onended()), lastTime = stream.currentTime
                                }, 500)
                        })
                    }
                    window.addEventListener("message", function(event) {
                        if (event.origin == window.location.origin)
                            if ("janusGotScreen" == event.data.type && cache[event.data.id]) {
                                var data = cache[event.data.id],
                                    callback = data[0];
                                if (delete cache[event.data.id], "" === event.data.sourceId) {
                                    var error = new Error("NavigatorUserMediaError");
                                    error.name = "You cancelled the request for permission, giving up...", pluginHandle.consentDialog(!1), callbacks.error(error)
                                } else constraints = {
                                    audio: isAudioSendEnabled(media),
                                    video: {
                                        mandatory: {
                                            chromeMediaSource: "desktop",
                                            maxWidth: window.screen.width,
                                            maxHeight: window.screen.height,
                                            maxFrameRate: 3
                                        },
                                        optional: [{
                                            googLeakyBucket: !0
                                        }, {
                                            googTemporalLayeredScreencast: !0
                                        }]
                                    }
                                }, constraints.video.mandatory.chromeMediaSourceId = event.data.sourceId, getScreenMedia(constraints, callback)
                            } else "janusGetScreenPending" == event.data.type && window.clearTimeout(event.data.id)
                    })
                }
                null !== media && void 0 !== media && "screen" === media.video || MediaStreamTrack.getSources(function(sources) {
                    var audioExist = sources.some(function(source) {
                            return "audio" === source.kind
                        }),
                        videoExist = sources.some(function(source) {
                            return "video" === source.kind
                        });
                    return audioExist || videoExist ? void getUserMedia({
                        audio: audioExist && isAudioSendEnabled(media),
                        video: videoExist && videoSupport
                    }, function(stream) {
                        pluginHandle.consentDialog(!1), streamsDone(handleId, jsep, media, callbacks, stream)
                    }, function(error) {
                        pluginHandle.consentDialog(!1), callbacks.error(error)
                    }) : (pluginHandle.consentDialog(!1), callbacks.error("No capture device found"), !1)
                })
            } else streamsDone(handleId, jsep, media, callbacks)
        }

        function prepareWebrtcPeer(handleId, callbacks) {
            callbacks = callbacks || {}, callbacks.success = "function" == typeof callbacks.success ? callbacks.success : jQuery.noop, callbacks.error = "function" == typeof callbacks.error ? callbacks.error : webrtcError;
            var jsep = callbacks.jsep,
                pluginHandle = pluginHandles[handleId],
                config = pluginHandle.webrtcStuff;
            if (void 0 !== jsep && null !== jsep) {
                if (null === config.pc) return Janus.log("Wait, no PeerConnection?? if this is an answer, use createAnswer and not handleRemoteJsep"), void callbacks.error("No PeerConnection: if this is an answer, use createAnswer and not handleRemoteJsep");
                config.pc.setRemoteDescription(new RTCSessionDescription(jsep), function() {
                    Janus.log("Remote description accepted!"), callbacks.success()
                }, callbacks.error)
            } else callbacks.error("Invalid JSEP")
        }

        function createOffer(handleId, media, callbacks) {
            callbacks = callbacks || {}, callbacks.success = "function" == typeof callbacks.success ? callbacks.success : jQuery.noop, callbacks.error = "function" == typeof callbacks.error ? callbacks.error : jQuery.noop;
            var pluginHandle = pluginHandles[handleId],
                config = pluginHandle.webrtcStuff;
            Janus.log("Creating offer (iceDone=" + config.iceDone + ")");
            var mediaConstraints = {
                mandatory: {
                    OfferToReceiveAudio: isAudioRecvEnabled(media) || isAudioSendEnabled(media),
                    OfferToReceiveVideo: isVideoRecvEnabled(media) || isVideoSendEnabled(media)
                }
            };
            Janus.log(mediaConstraints), config.pc.createOffer(function(offer) {
                if (Janus.log(offer), null !== config.mySdp && void 0 !== config.mySdp || (Janus.log("Setting local description"), config.mySdp = offer.sdp, config.pc.setLocalDescription(offer)), !config.iceDone && !config.trickle) return void Janus.log("Waiting for all candidates...");
                if (config.sdpSent) return void Janus.log("Offer already sent, not sending it again");
                Janus.log("Offer ready"), Janus.log(callbacks), config.sdpSent = !0;
                var jsep = {
                    type: offer.type,
                    sdp: offer.sdp
                };
                callbacks.success(jsep)
            }, callbacks.error, mediaConstraints)
        }

        function createAnswer(handleId, media, callbacks) {
            callbacks = callbacks || {}, callbacks.success = "function" == typeof callbacks.success ? callbacks.success : jQuery.noop, callbacks.error = "function" == typeof callbacks.error ? callbacks.error : jQuery.noop;
            var pluginHandle = pluginHandles[handleId],
                config = pluginHandle.webrtcStuff;
            Janus.log("Creating answer (iceDone=" + config.iceDone + ")");
            var mediaConstraints = {
                mandatory: {
                    OfferToReceiveAudio: isAudioRecvEnabled(media),
                    OfferToReceiveVideo: isVideoRecvEnabled(media)
                }
            };
            Janus.log(mediaConstraints), config.pc.createAnswer(function(answer) {
                if (Janus.log(answer), null !== config.mySdp && void 0 !== config.mySdp || (Janus.log("Setting local description"), config.mySdp = answer.sdp, config.pc.setLocalDescription(answer)), !config.iceDone && !config.trickle) return void Janus.log("Waiting for all candidates...");
                if (config.sdpSent) return void Janus.log("Answer already sent, not sending it again");
                config.sdpSent = !0;
                var jsep = {
                    type: answer.type,
                    sdp: answer.sdp
                };
                callbacks.success(jsep)
            }, callbacks.error, mediaConstraints)
        }

        function sendSDP(handleId, callbacks) {
            callbacks = callbacks || {}, callbacks.success = "function" == typeof callbacks.success ? callbacks.success : jQuery.noop, callbacks.error = "function" == typeof callbacks.error ? callbacks.error : jQuery.noop;
            var pluginHandle = pluginHandles[handleId],
                config = pluginHandle.webrtcStuff;
            return Janus.log("Sending offer/answer SDP..."), null === config.mySdp || void 0 === config.mySdp ? void Janus.log("Local SDP instance is invalid, not sending anything...") : (config.mySdp = config.pc.localDescription, config.sdpSent ? void Janus.log("Offer/Answer SDP already sent, not sending it again") : (Janus.log(callbacks), config.sdpSent = !0, void callbacks.success(config.mySdp)))
        }

        function getBitrate(handleId) {
            var pluginHandle = pluginHandles[handleId],
                config = pluginHandle.webrtcStuff;
            return void 0 === config.bitrate.value || null === config.bitrate.value ? "Feature unsupported by browser" : config.bitrate.value
        }

        function webrtcError(error) {
            Janus.log("WebRTC error:"),
                Janus.log(error)
        }

        function cleanupWebrtc(handleId) {
            if (Janus.log("Cleaning WebRTC stuff"), pluginHandles && pluginHandles[handleId]) {
                var pluginHandle = pluginHandles[handleId],
                    config = pluginHandle.webrtcStuff;
                config.bitrate.timer && clearInterval(config.bitrate.timer), config.bitrate.timer = null, config.bitrate.bsnow = null, config.bitrate.bsbefore = null, config.bitrate.tsnow = null, config.bitrate.tsbefore = null, config.bitrate.value = null, null !== config.myStream && void 0 !== config.myStream && (Janus.log("Stopping local stream"), config.myStream.stop()), config.myStream = null;
                try {
                    config.pc.close()
                } catch (e) {}
                config.pc = null, config.mySdp = null, config.iceDone = !1, config.sdpSent = !1, config.dataChannel = null, config.dtmfSender = null, pluginHandle.oncleanup()
            }
        }

        function isAudioSendEnabled(media) {
            return Janus.log("isAudioSendEnabled:"), Janus.log(media), void 0 === media || null === media || media.audio !== !1 && (void 0 === media.audioSend || null === media.audioSend || media.audioSend === !0)
        }

        function isAudioRecvEnabled(media) {
            return Janus.log("isAudioRecvEnabled:"), Janus.log(media), void 0 === media || null === media || media.audio !== !1 && (void 0 === media.audioRecv || null === media.audioRecv || media.audioRecv === !0)
        }

        function isVideoSendEnabled(media) {
            return Janus.log("isVideoSendEnabled:"), Janus.log(media), void 0 === media || null === media || media.video !== !1 && (void 0 === media.videoSend || null === media.videoSend || media.videoSend === !0)
        }

        function isVideoRecvEnabled(media) {
            return Janus.log("isVideoRecvEnabled:"), Janus.log(media), void 0 === media || null === media || media.video !== !1 && (void 0 === media.videoRecv || null === media.videoRecv || media.videoRecv === !0)
        }

        function isDataEnabled(media) {
            return Janus.log("isDataEnabled:"), Janus.log(media), void 0 !== media && null !== media && media.data === !0
        }

        function isTrickleEnabled(trickle) {
            return Janus.log("isTrickleEnabled:"), Janus.log(trickle), void 0 === trickle || null === trickle || trickle === !0
        }
        if (void 0 === Janus.initDone) return gatewayCallbacks.error("Library not initialized"), {};
        if (!Janus.isWebrtcSupported()) return gatewayCallbacks.error("WebRTC not supported by this browser"), {};
        if (Janus.log("Library initialized: " + Janus.initDone), gatewayCallbacks = gatewayCallbacks || {}, gatewayCallbacks.success = "function" == typeof gatewayCallbacks.success ? gatewayCallbacks.success : jQuery.noop, gatewayCallbacks.error = "function" == typeof gatewayCallbacks.error ? gatewayCallbacks.error : jQuery.noop, gatewayCallbacks.destroyed = "function" == typeof gatewayCallbacks.destroyed ? gatewayCallbacks.destroyed : jQuery.noop, null === gatewayCallbacks.server || void 0 === gatewayCallbacks.server) return gatewayCallbacks.error("Invalid gateway url"), {};
        var websockets = !1,
            ws = null,
            servers = null,
            serversIndex = 0,
            server = gatewayCallbacks.server;
        $.isArray(server) ? (Janus.log("Multiple servers provided (" + server.length + "), will use the first that works"), server = null, servers = gatewayCallbacks.server, Janus.log(servers)) : (0 === server.indexOf("ws") ? (websockets = !0, Janus.log("Using WebSockets to contact Janus")) : (websockets = !1, Janus.log("Using REST API to contact Janus")), Janus.log(server));
        var iceServers = gatewayCallbacks.iceServers;
        void 0 !== iceServers && null !== iceServers || (iceServers = [{
            url: "turn:140.205.203.7:55000?transport=udp",
            username: "1742463734:facetalk",
            credential: "jOBp5ds/vPDwqU+5Tu3vpVFvC24="
        }]);
        var ipv6Support = gatewayCallbacks.ipv6;
        void 0 !== ipv6Support && null !== ipv6Support || (ipv6Support = !1);
        var maxev = null;
        void 0 !== gatewayCallbacks.max_poll_events && null !== gatewayCallbacks.max_poll_events && (maxev = gatewayCallbacks.max_poll_events), maxev < 1 && (maxev = 1);
        var connected = !1,
            sessionId = null,
            pluginHandles = {},
            that = this,
            retries = 0,
            transactions = {};
        createSession(gatewayCallbacks), this.getServer = function() {
            return server
        }, this.isConnected = function() {
            return connected
        }, this.getSessionId = function() {
            return sessionId
        }, this.destroy = function(callbacks) {
            destroySession(callbacks)
        }, this.attach = function(callbacks) {
            createHandle(callbacks)
        }
    }
    var adapter = require("src/bus/suit/trial/trial/adapter-debug"),
        RTCPeerConnection = adapter.RTCPeerConnection,
        getUserMedia = adapter.getUserMedia,
        webrtcDetectedBrowser = (adapter.attachMediaStream, adapter.reattachMediaStream, adapter.webrtcDetectedBrowser);
    adapter.webrtcDetectedVersion;
    return Janus.sessions = {}, Janus.extensionId = "hapfgfdkleiggjjpfpenajgdnfckjpaj", Janus.isExtensionEnabled = function() {
        if (window.navigator.userAgent.match("Chrome")) {
            var chromever = parseInt(window.navigator.userAgent.match(/Chrome\/(.*) /)[1], 10),
                maxver = 33;
            return window.navigator.userAgent.match("Linux") && (maxver = 35), chromever >= 26 && chromever <= maxver || $("#janus-extension-installed").length > 0
        }
        return !0
    }, Janus.noop = function() {}, Janus.init = function(options) {
        options = options || {}, options.callback = "function" == typeof options.callback ? options.callback : Janus.noop, Janus.initDone === !0 ? options.callback() : ("undefined" != typeof console && "undefined" != typeof console.log || (console = {
            log: function() {}
        }), Janus.log = Janus.noop, Janus.log("Initializing library"), Janus.initDone = !0, window.onbeforeunload = function() {
            Janus.log("Closing window");
            for (var s in Janus.sessions) Janus.log("Destroying session " + s), Janus.sessions[s].destroy()
        }, options.callback())
    }, Janus.isWebrtcSupported = function() {
        return null !== RTCPeerConnection && null !== getUserMedia
    }, Janus
});
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