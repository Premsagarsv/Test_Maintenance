jQuery.VegamSignalRNamespace = jQuery.VegamSignalRNamespace || {};
jQuery.VegamSignalRNamespace.SignalRConnections = [];

//*********** Sample to call the subcribe function Start **************

//var UUID = [];
//UUID.push("1");
//UUID.push("2");
//var connectionDetails = {};
//connectionDetails.SignalRPath = "http://localhost:21343";
//connectionDetails.HubName = "vegamsignals";
//connectionDetails.UUIDList = UUID;
//connectionDetails.CallbackFunction = SignalRCallBack;
//SubscribeForSignalR(connectionDetails);

//*********** Sample to call the subcribe function End **************

function SubscribeForSignalR(signalRInfo) {
    if (signalRInfo.UUIDList != undefined && signalRInfo.UUIDList != null && signalRInfo.UUIDList.length > 0) {
        var currentConnector = jQuery.grep(jQuery.VegamSignalRNamespace.SignalRConnections, function (object) {
            return (object.SignalRPath == signalRInfo.SignalRPath);
        })[0];
        if (!currentConnector) {
            // Create new signalR Connection
            var connection = jQuery.hubConnection(signalRInfo.SignalRPath);
            var signalRHub = connection.createHubProxy(signalRInfo.HubName);

            //On New signal/data below block will be executed
            signalRHub.on('NewSignal', function (index, record) {
                if (typeof (signalRInfo.CallbackFunction) === "function") {
                    signalRInfo.CallbackFunction(record);
                }
            });

            //Creating array of subcribe connection
            var connectionDetails = {};
            connectionDetails.SignalRPath = signalRInfo.SignalRPath;
            connectionDetails.Hub = signalRHub;
            connectionDetails.UUIDList = signalRInfo.UUIDList;
            jQuery.VegamSignalRNamespace.SignalRConnections.push(connectionDetails);

            connection.disconnected(function () {
                setTimeout(function () {
                    ReconnectedToHub(connectionDetails);
                }, 5000); // Restart connection after 5 seconds.
            });

            connection.start({ waitForPageLoad: false, jsonp: true, transport: ['webSockets', 'longPolling', 'foreverFrame', 'serverSentEvents'] }).done(function () {
                InvokeSubscribe(connectionDetails)
            }).fail(function () {
                //alert("Failed in connecting to the signalr server. Please contact administrator");
            });
        } else {
            // Get existing signalR connection hub
            var signalRHub = currentConnector.Hub;
            if (signalRHub.connection.state === jQuery.signalR.connectionState.connected) {
                var tempUUIDList = jQuery.extend(true, [], signalRInfo.UUIDList);
                while (tempUUIDList.length > 0) {
                    signalRHub.invoke('Subscribe', tempUUIDList.splice(0, 15));
                };                
            }

            //get UUIDs which are not present in currentConnector.UUIDList and add  
            var addUUIDList = GetArrayDifference(signalRInfo.UUIDList, currentConnector.UUIDList);
            if (addUUIDList.length > 0) {
                currentConnector.UUIDList = currentConnector.UUIDList.concat(addUUIDList);
            }
        }
    }
}

function InvokeSubscribe(signalRInfo) {
    var tempUUIDList = jQuery.extend(true, [], signalRInfo.UUIDList);
    while (tempUUIDList.length > 0) {
        signalRInfo.Hub.invoke('Subscribe', tempUUIDList.splice(0, 15));
    };    
}

function UnSubscribeFromData(uuidList) {
    jQuery.each(jQuery.VegamSignalRNamespace.SignalRConnections, function (index, obj) {
        //Get un subscribe UUIDList from All Subscribed UUID List for each connection
        var unSubscribeUUIDList = uuidList.filter(function (obj1) { return obj.UUIDList.indexOf(obj1) !== -1; });

        //get UUIDs which are not present in obj.UUIDList and update the existing UUIDList for connector object 
        obj.UUIDList = GetArrayDifference(obj.UUIDList, unSubscribeUUIDList);

        if (unSubscribeUUIDList.length > 0) {
            var signalRHub = obj.Hub;
            if (signalRHub.connection.state === jQuery.signalR.connectionState.connected) {
                var tempUUIDList = jQuery.extend(true, [], unSubscribeUUIDList);
                while (tempUUIDList.length > 0) {
                    signalRHub.invoke('Unsubscribe', tempUUIDList.splice(0, 15));
                };               
            }
        }

    });
}

function ReconnectedToHub(disconnectHubInfo) {
    if (disconnectHubInfo.Hub.connection.state === jQuery.signalR.connectionState.disconnected) {
        disconnectHubInfo.Hub.connection.start({ waitForPageLoad: false, jsonp: true, transport: ['webSockets', 'longPolling', 'foreverFrame', 'serverSentEvents'] }).done(function () {
            InvokeSubscribe(disconnectHubInfo)
        }).fail(function () {
            //alert("failed in connecting to the signalr server");
        });
    }    
}

function GetArrayDifference(arr1, arr2) {
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