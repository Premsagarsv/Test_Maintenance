jQuery.WorkOrderCalendarNamespace = jQuery.WorkOrderCalendarNamespace || {};
jQuery.WorkOrderCalendarNamespace.BasicParam = jQuery.WorkOrderCalendarNamespace.BasicParam || {};
jQuery.WorkOrderCalendarNamespace.FeatureInfoList = jQuery.WorkOrderCalendarNamespace.FeatureInfoList || {};
jQuery.WorkOrderCalendarNamespace.ServicePath = '';
jQuery.WorkOrderCalendarNamespace.MaintenanceBasePath = '';
jQuery.WorkOrderCalendarNamespace.CoreBasePath = '';

jQuery.WorkOrderCalendarNamespace.DayViewFeaturePath = '';
jQuery.WorkOrderCalendarNamespace.OrderViewFeaturePath = '';
jQuery.WorkOrderCalendarNamespace.ResourceViewFeaturePath = '';

function LoadCalendarBasicInfo(basicParam, servicePath, maintenanceBasePath, coreBasePath) {
    jQuery.WorkOrderCalendarNamespace.BasicParam = basicParam;
    jQuery.WorkOrderCalendarNamespace.ServicePath = servicePath;
    jQuery.WorkOrderCalendarNamespace.MaintenanceBasePath = maintenanceBasePath;
    jQuery.WorkOrderCalendarNamespace.CoreBasePath = coreBasePath;

    GetMaintenanceFeatureInfo();   
}

function GetMaintenanceFeatureInfo() {
    var featureName = "MAINTENANCE_CALENDAR";
    jQuery.ajax({
        type: "POST",
        url: jQuery.WorkOrderCalendarNamespace.ServicePath + "/Vegam_MaintenanceService.asmx/GetMaintenanceFeatureInfo",
        data: JSON.stringify({ basicParam: jQuery.WorkOrderCalendarNamespace.BasicParam, featureName: featureName }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (json) {
            if (json != null && json != undefined && json.d != undefined && json.d != null) {
                BindCalendarTabs(json.d);
            }
            else {
                ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_FeatureIsNotConfigured);
            }
        },
        error: function (request, error) {
            var errorMessage = LanguageResource.resMsg_Error + LanguageResource.resMsg_FeatureIsNotConfigured;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null) {
                    errorMessage = LanguageResource.resMsg_Error + errorMsg.Message;
                }
            }
            ShowErrorMessage(errorMessage);
        }
    });
}

function BindCalendarTabs(featureInfoList) {
    var queryString = "?id=" + jQuery.WorkOrderCalendarNamespace.BasicParam.SiteID;
    ko.utils.arrayForEach(featureInfoList, function (featureInfo, itemIndex) {
        if (featureInfo.TabName == "WORKORDER_DAYVIEW") {
            jQuery("#lnkDayView").removeClass("hide");
            jQuery.WorkOrderCalendarNamespace.DayViewFeaturePath = jQuery.WorkOrderCalendarNamespace.MaintenanceBasePath + featureInfo.TabPath + queryString;
        }
        else if (featureInfo.TabName == "WORKORDER_ORDERVIEW") {
            jQuery("#lnkOrderView").removeClass("hide");
            jQuery.WorkOrderCalendarNamespace.OrderViewFeaturePath = jQuery.WorkOrderCalendarNamespace.MaintenanceBasePath + featureInfo.TabPath + queryString;
        }
        else if (featureInfo.TabName == "WORKORDER_RESOURCEVIEW") {
            jQuery("#lnkResourceView").removeClass("hide");
            jQuery.WorkOrderCalendarNamespace.ResourceViewFeaturePath = jQuery.WorkOrderCalendarNamespace.MaintenanceBasePath + featureInfo.TabPath + queryString;
        }
    });

    if (jQuery.WorkOrderCalendarNamespace.DayViewFeaturePath.length > 0) {
        LoadIFrame(document.getElementById("lnkDayView"))
    }
    else if (jQuery.WorkOrderCalendarNamespace.OrderViewFeaturePath.length > 0) {
        LoadIFrame(document.getElementById("lnkOrderView"))
    }
    else if (jQuery.WorkOrderCalendarNamespace.ResourceViewFeaturePath.length > 0) {
        LoadIFrame(document.getElementById("lnkResourceView"))
    }
}

function LoadIFrame(lnkFeature) {
    var urlPath = '';
    jQuery("#ulPhaseTab a").removeClass("active");
    if (lnkFeature.id == "lnkDayView") {
        jQuery("#lnkDayView a").addClass("active");
        urlPath = jQuery.WorkOrderCalendarNamespace.DayViewFeaturePath;
    }
    else if (lnkFeature.id == "lnkOrderView") {
        jQuery("#lnkOrderView a").addClass("active");
        urlPath = jQuery.WorkOrderCalendarNamespace.OrderViewFeaturePath;
    }
    else if (lnkFeature.id == "lnkResourceView") {
        jQuery("#lnkResourceView a").addClass("active");
        urlPath = jQuery.WorkOrderCalendarNamespace.ResourceViewFeaturePath;
    }

    if (urlPath.length > 0)
        jQuery('#iFrameWorkOrder').attr('src', urlPath);
}

function WorkOrderCalendarIFrameLoad(obj) {
    jQuery('#iFrameWorkOrder').show();
    var src = document.getElementById("iFrameWorkOrder").contentWindow.location.href;
    if (src != undefined) {
        if (src.indexOf("Login.aspx") != -1 || src.indexOf("?url=") != -1) {
            window.location.href = jQuery.WorkOrderCalendarNamespace.CoreBasePath + "/Login.aspx?Logout=true";
        }        
    }    
    obj.style.height = (obj.contentWindow.document.body.scrollHeight + 100) + 'px';
}

function ShowWorkOrderInfo(URLToRedirect) {
    window.location.href = URLToRedirect;
}

function ShowErrorMessage(message) {
    jQuery("#errorMessageText").html(message).removeClass('blue').addClass("red");
    jQuery("#divErrorModal").dialog({
        zIndex: 999999,
        buttons: [
            {
                text: LanguageResource.resMsg_Ok,
                click: function () {
                    jQuery("#divErrorModal").dialog("close");
                }
            }
        ]
    });
}

