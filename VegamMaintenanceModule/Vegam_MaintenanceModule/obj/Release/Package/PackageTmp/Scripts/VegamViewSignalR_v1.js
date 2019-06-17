jQuery.VegamViewSignalR = jQuery.VegamViewSignalR || {};
//jQuery.VegamViewSignalR.VegamViewRestServicePath = "http://localhost:12375/VegamViewRestService.svc";  
//jQuery.VegamViewSignalR.VegamViewRestServicePath ="http://192.168.1.210:80/iPAS_VegamViewService/VegamViewRestService.svc"; 
//jQuery.VegamViewSignalR.SignalRConnections = jQuery.VegamViewSignalR.SignalRConnections || {};
jQuery.VegamViewSignalR.SignalRConnections = [];
jQuery.support.cors = true;

function SubscribeForData(uuidList, vegamViewRestServicePath, dataReceiveCallbackMethod) {
       if (uuidList != undefined && uuidList != null && uuidList.length > 0) {
           GetLiveConnectionDetails(uuidList, vegamViewRestServicePath).done(function (json) {
            if (json != null && json.length > 0) {
                jQuery.each(json, function (index, obj) {
                    if (obj.ConnectionInfo != null && jQuery.trim(obj.ConnectionInfo.IPAddress).length > 0) {
                        var currentConnector = jQuery.grep(jQuery.VegamViewSignalR.SignalRConnections, function (object) {
                            return (object.IPAddress == obj.ConnectionInfo.IPAddress && object.Port == obj.ConnectionInfo.Port);
                        })[0];
                        if (!currentConnector) {
                        // Create new signalR Connection
                        var connection = jQuery.hubConnection("http://" + obj.ConnectionInfo.IPAddress + ":" + obj.ConnectionInfo.Port);

                        var signalRHub = connection.createHubProxy(obj.ConnectionInfo.HubName);

                        signalRHub.on('NewSignal', function (index, record) {
                            if (typeof (dataReceiveCallbackMethod) === "function") {
                                dataReceiveCallbackMethod(record);
                            }
                        });

                        var connectionDetails = {};
                        connectionDetails.IPAddress = obj.ConnectionInfo.IPAddress;
                        connectionDetails.Port = obj.ConnectionInfo.Port;
                        connectionDetails.Hub = signalRHub;
                        connectionDetails.UUIDList = obj.UUIDList;
                        jQuery.VegamViewSignalR.SignalRConnections.push(connectionDetails);


                        connection.stateChanged(function (change) {
                            if ($.signalR.connectionState["connected"] === change.newState) {
                                var signalRConnectionInfo = jQuery.grep(jQuery.VegamViewSignalR.SignalRConnections, function (object) {
                                    return (object.IPAddress == obj.ConnectionInfo.IPAddress && object.Port == obj.ConnectionInfo.Port);
                                })[0];
                                signalRHub.invoke('Subscribe', signalRConnectionInfo.UUIDList);
                            }
                            else {
                             
                            }
                        });


                        connection.start({ waitForPageLoad: false, jsonp: true }).done(function () {
//                            var signalRConnectionInfo = jQuery.grep(jQuery.VegamViewSignalR.SignalRConnections, function (object) {
//                                return (object.IPAddress == obj.ConnectionInfo.IPAddress && object.Port == obj.ConnectionInfo.Port);
//                            })[0];
//                            signalRHub.invoke('Subscribe', signalRConnectionInfo.UUIDList);
                        }).fail(function (request, error) {

                            jQuery.VegamViewSignalR.SignalRConnections = jQuery.grep(jQuery.VegamViewSignalR.SignalRConnections, function (object) {
                                return !(object.IPAddress == obj.ConnectionInfo.IPAddress && object.Port == obj.ConnectionInfo.Port);
                            });

                            if (obj.AlternateConnectionInfo != null && jQuery.trim(obj.AlternateConnectionInfo.IPAddress).length > 0) {
                                var currentAlternateConnector = jQuery.grep(jQuery.VegamViewSignalR.SignalRConnections, function (object) {
                                    return (object.IPAddress == obj.AlternateConnectionInfo.IPAddress && object.Port == obj.AlternateConnectionInfo.Port);
                                })[0];

                                if (!currentAlternateConnector) {
                                    // Create new signalR Connection
                                    var alternateConnection = jQuery.hubConnection("http://" + obj.AlternateConnectionInfo.IPAddress + ":" + obj.AlternateConnectionInfo.Port);

                                    var alternateSignalRHub = alternateConnection.createHubProxy(obj.AlternateConnectionInfo.HubName);

                                    alternateSignalRHub.on('NewSignal', function (index, record) {
                                        if (typeof (dataReceiveCallbackMethod) === "function") {
                                            dataReceiveCallbackMethod(record);
                                        }
                                    });

                                    var alternateConnectionDetails = {};
                                    alternateConnectionDetails.IPAddress = obj.AlternateConnectionInfo.IPAddress;
                                    alternateConnectionDetails.Port = obj.AlternateConnectionInfo.Port;
                                    alternateConnectionDetails.Hub = alternateSignalRHub;
                                    alternateConnectionDetails.UUIDList = obj.UUIDList;
                                    jQuery.VegamViewSignalR.SignalRConnections.push(alternateConnectionDetails);


                                    alternateConnection.stateChanged(function (change) {
                                        if ($.signalR.connectionState["connected"] === change.newState) {
                                         
                                            var signalRAlternateConnectionInfo = jQuery.grep(jQuery.VegamViewSignalR.SignalRConnections, function (object) {
                                                return (object.IPAddress == obj.ConnectionInfo.IPAddress && object.Port == obj.ConnectionInfo.Port);
                                            })[0];
                                            alternateSignalRHub.invoke('Subscribe', signalRAlternateConnectionInfo.UUIDList);
                                         
                                        }
                                        else {
                                          
                                        }
                                    });

                                    alternateConnection.start({ waitForPageLoad: false, jsonp: true }).done(function () {
//                                        var signalRAlternateConnectionInfo = jQuery.grep(jQuery.VegamViewSignalR.SignalRConnections, function (object) {
//                                            return (object.IPAddress == obj.ConnectionInfo.IPAddress && object.Port == obj.ConnectionInfo.Port);
//                                        })[0];
//                                        alternateSignalRHub.invoke('Subscribe', signalRAlternateConnectionInfo.UUIDList);

                                    }).fail(function (request, error) {
                                        jQuery.VegamViewSignalR.SignalRConnections = jQuery.grep(jQuery.VegamViewSignalR.SignalRConnections, function (object) {
                                            return !(object.IPAddress == obj.AlternateConnectionInfo.IPAddress && object.Port == obj.AlternateConnectionInfo.Port);
                                        });
                                    });
                                }
                                else {
                                    var alternateSignalRHub = currentAlternateConnector.Hub;
                                    if (alternateSignalRHub.connection.state === jQuery.signalR.connectionState.connected)
                                        alternateSignalRHub.invoke('Subscribe', obj.UUIDList);

                                    //get UUIDs which are not present in currentAlternateConnector.UUIDList and add  
                                    var addUUIDList = getArrayDiff(obj.UUIDList, currentAlternateConnector.UUIDList);
                                    if (addUUIDList.length > 0) {
                                        currentAlternateConnector.UUIDList = currentAlternateConnector.UUIDList.concat(addUUIDList);
                                    }
                                }
                            }
                        });
                    }
                        else {
                        // Get existing signalR connection hub
                        var signalRHub = currentConnector.Hub;
                        if (signalRHub.connection.state === jQuery.signalR.connectionState.connected)
                            signalRHub.invoke('Subscribe', obj.UUIDList);

                        //get UUIDs which are not present in currentConnector.UUIDList and add  
                        var addUUIDList = getArrayDiff(obj.UUIDList, currentConnector.UUIDList);
                        if (addUUIDList.length > 0) {
                            currentConnector.UUIDList = currentConnector.UUIDList.concat(addUUIDList);
                        }
                    }
                   }
                });
            }
            else {
            }
        }).fail(function (request, error) {
            var i = 0;
        });
    }
}

function UnSubscribe(uuidList) {
 
    jQuery.each(jQuery.VegamViewSignalR.SignalRConnections, function (index, obj) {
        //Get un subscribe UUIDList from All Subscribed UUID List for each connection
        var unSubscribeUUIDList = uuidList.filter(function (obj1) { return obj.UUIDList.indexOf(obj1) !== -1; });
       
        //get UUIDs which are not present in obj.UUIDList and update the existing UUIDList for connector object 
        obj.UUIDList = getArrayDiff(obj.UUIDList, unSubscribeUUIDList);

        if (unSubscribeUUIDList.length > 0) {
            var signalRHub = obj.Hub;
            if (signalRHub.connection.state === jQuery.signalR.connectionState.connected) {
                signalRHub.invoke('Unsubscribe', unSubscribeUUIDList);
            }
        }

        //If UUIDList is empty then remove that connection from jQuery.VegamViewSignalR.SignalRConnections
        //        if (obj.UUIDList.length === 0) {
        //            jQuery.VegamViewSignalR.SignalRConnections = jQuery.grep(jQuery.VegamViewSignalR.SignalRConnections, function (object) {
        //                return (object.IPAddress != obj.IPAddress && object.Port != obj.Port);
        //            });
        //        }
    });
}

function GetLiveConnectionDetails(uuidList, vegamViewRestServicePath) {
    return jQuery.ajax({
        type: "POST",
        crossDomain: true,
        processData: true,
        url: vegamViewRestServicePath + "/GetLiveDataConnectionDetails",
        data: JSON.stringify({ uuidList: uuidList }),
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    });
}

//This method will return dif­fer­ence between two arrays
//i.e.,it will return the elemnts which are present in arr1 but not in arr2
function getArrayDiff(arr1, arr2) {
    var ret = [];
    if (!(Array.isArray(arr1) && Array.isArray(arr2))) {
        return ret;
    }
    var i;
    var key;

    for (i = arr1.length - 1; i >= 0; i--) {
        key = arr1[i];
        if (-1 === arr2.indexOf(key)) {
            ret.push(key);
        }
    }
    return ret;
}

