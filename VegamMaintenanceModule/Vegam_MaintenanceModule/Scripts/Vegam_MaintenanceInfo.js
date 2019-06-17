//#region Global Variables
jQuery.ViewMaintenanceInfoNamespace = jQuery.ViewMaintenanceInfoNamespace || {};
jQuery.ViewMaintenanceInfoNamespace.AccessInfo = jQuery.ViewMaintenanceInfoNamespace.AccessInfo || {};
jQuery.ViewMaintenanceInfoNamespace.FeatureInfoList = jQuery.ViewMaintenanceInfoNamespace.FeatureInfoList || {};
jQuery.ViewMaintenanceInfoNamespace.ManageFeatureInfoList = "";
jQuery.ViewMaintenanceInfoNamespace.MaintBasePath = "";
jQuery.ViewMaintenanceInfoNamespace.CoreBasePath = "";
jQuery.ViewMaintenanceInfoNamespace.MaintWebServicePath = "";
jQuery.ViewMaintenanceInfoNamespace.ShowTabIFrame = true;

//#region View Model
var viewMaintenanceDetailsModel =
    {
        IsTabIFrameVisible: ko.observable(false),
        IsErrorInfoVisible: ko.observable(false),
        FeatureTabList: ko.observableArray([])
    };

function LoadMaintenanceInfo(basicParam, manageFeatureInfoList, maintBasePath, coreBasePath, maintWebServicePath) {
    jQuery.ViewMaintenanceInfoNamespace.AccessInfo = basicParam;
    jQuery.ViewMaintenanceInfoNamespace.MaintBasePath = maintBasePath;
    jQuery.ViewMaintenanceInfoNamespace.CoreBasePath = coreBasePath;
    jQuery.ViewMaintenanceInfoNamespace.ManageFeatureInfoList = manageFeatureInfoList;
    jQuery.ViewMaintenanceInfoNamespace.MaintWebServicePath = maintWebServicePath;

    ko.applyBindings(viewMaintenanceDetailsModel, document.getElementById('divMaintenanceInfoContent'));

    //Bind Feature Info for Maintenance module
    GetMaintenanceFeatureInfo();
}

function GetMaintenanceFeatureInfo() {
    var featureName = "MAINTENANCE_INFO";
    jQuery.ajax({
        type: "POST",
        url: jQuery.ViewMaintenanceInfoNamespace.MaintWebServicePath + "/Vegam_MaintenanceService.asmx/GetMaintenanceFeatureInfo",
        data: JSON.stringify({ basicParam: jQuery.ViewMaintenanceInfoNamespace.AccessInfo, featureName: featureName }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (json) {
            if (json != null && json != undefined && json.d != undefined && json.d != null) {
                // ClearErrorMessage();
                jQuery.ViewMaintenanceInfoNamespace.FeatureInfoList = json.d;
                jQuery.ViewMaintenanceInfoNamespace.ShowTabIFrame = true;

                //Bind Tabs
                BindMaintenanceTabs();
            }
            else {
                jQuery.ViewMaintenanceInfoNamespace.ShowTabIFrame = false;
                ShowErrorInfoDiv(languageResource.resMsg_MaintenanceFeatureInformationNoFound, false);
            }
            ShowHideSpinner(false);
        },
        beforeSend: function () {
            jQuery("#divProgress").show();
        },
        complete: function () {
            jQuery("#divProgress").hide();
        },
        error: function (request, error) {
            ShowHideSpinner(false);
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null) {
                    ShowErrorInfoDiv(languageResource.resMsg_Error + errorMsg.Message, true);
                }
                else {
                    ShowErrorInfoDiv(languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadMaintenanceFeatureInfo, true);
                }
            }
            else {
                ShowErrorInfoDiv(languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadMaintenanceFeatureInfo, true);
            }
        }
    });
}

function ShowHideSpinner(shouldDisplaySpinner) {
    if (shouldDisplaySpinner) {
        jQuery(".spinner-circle-big").removeClass("hide")
    }
    else {
        jQuery(".spinner-circle-big").addClass("hide")
    }
}

function MaintenanceInfoFrameLoaded(obj) {
    jQuery('#MaintenanceInfoFrame').show();
    var src = document.getElementById("MaintenanceInfoFrame").contentWindow.location.href;
    if (src != undefined) {
        if (src.indexOf("Login.aspx") != -1 || src.indexOf("?url=") != -1) {
            window.location.href = jQuery.ViewMaintenanceInfoNamespace.CoreBasePath + "/Login.aspx?Logout=true";
        }
        else {
            //testing purpose, to check whether it reloads back to login page
            // window.location.href = "/Login.aspx?Logout=true";
        }
    }
    //jQuery('iframe').contents().find("html").css("border", "1px solid rgb(220, 215, 215)");
    obj.style.height = (obj.contentWindow.document.body.scrollHeight + 50) + 'px';
    jQuery("iframe").contents().find("th.underline").click(function () {
        tableHeight();
    });
    tableHeight();
    function tableHeight(){
    setTimeout(function () {
        obj.style.height = (obj.contentWindow.document.body.scrollHeight + 50) + 'px';
        }, 2000)
    }
}


function BindMaintenanceTabs() {
    if (jQuery.ViewMaintenanceInfoNamespace.ShowTabIFrame == true) {
        var queryString = "?id=" + jQuery.ViewMaintenanceInfoNamespace.AccessInfo.SiteID;
        var tabCount = 0;

        viewMaintenanceDetailsModel.FeatureTabList.removeAll();
        var functionalLocationTabInfo = {};
        var equipmentsTabInfo = {};
        var equipmentModelsTabInfo = {};
        var measuringPointsTabInfo = {};

        var featureList = [];
        ko.utils.arrayForEach(jQuery.ViewMaintenanceInfoNamespace.FeatureInfoList, function (tabInfo) {
            var tabData = {};
            tabData.TabName = GetTabName(tabInfo.TabName);
            tabData.TabPath = jQuery.ViewMaintenanceInfoNamespace.MaintBasePath + tabInfo.TabPath + queryString;

            if (tabData.TabName == languageResource.resMsg_FunctionalLocation) {
                functionalLocationTabInfo = tabData;
            }
            else if (tabData.TabName == languageResource.resMsg_EquipmentModels) {
                equipmentModelsTabInfo  = tabData;
            }
            else if (tabData.TabName == languageResource.resMsg_Equipments) {
                equipmentsTabInfo = tabData;
            }
            else if (tabData.TabName == languageResource.resMsg_MeasuringPoints) {
                measuringPointsTabInfo = tabData;
            }

            //viewProcessOrderDetailsModel.PhaseTabList.push(tabData);
            //if (tabCount === 0) {
            //    LoadIframe(tabData.TabPath);
            //}
            //tabCount++;
        });

        var isEnableFunctionalLocationTab = false;
        var isEnableEquipmentModelsTab = false;
        var isEnableEquipmentsTab = false;
        var isEnableMeasuringPointsTab = false;

        jQuery.each(jQuery.ViewMaintenanceInfoNamespace.ManageFeatureInfoList, function (index, featureInfo) {
            if (featureInfo.Item1.toString().toUpperCase() == "FUNCTIONAL_LOCATION" && featureInfo.Item2.toString().toUpperCase() == "TRUE") {
                isEnableFunctionalLocationTab = true;
            }
            else if (featureInfo.Item1.toString().toUpperCase() == "EQUIPMENT_MODELS" && featureInfo.Item2.toString().toUpperCase() == "TRUE") {
                isEnableEquipmentModelsTab = true;
            }
            else if (featureInfo.Item1.toString().toUpperCase() == "EQUIPMENTS" && featureInfo.Item2.toString().toUpperCase() == "TRUE") {
                isEnableEquipmentsTab = true;
            }
            else if (featureInfo.Item1.toString().toUpperCase() == "MEASURING_POINTS" && featureInfo.Item2.toString().toUpperCase() == "TRUE") {
                isEnableMeasuringPointsTab = true;
            }
        });

        if ((functionalLocationTabInfo.TabPath != null || functionalLocationTabInfo.TabPath != undefined) && isEnableFunctionalLocationTab == true) {
            featureList.push(functionalLocationTabInfo);
        }
        if ((equipmentModelsTabInfo.TabPath != null || equipmentModelsTabInfo.TabPath != undefined) && isEnableEquipmentModelsTab == true) {
            featureList.push(equipmentModelsTabInfo);
        }
        if ((equipmentsTabInfo.TabPath != null || equipmentsTabInfo.TabPath != undefined) && isEnableEquipmentsTab == true) {
            featureList.push(equipmentsTabInfo);
        }
        if ((measuringPointsTabInfo.TabPath != null || measuringPointsTabInfo.TabPath != undefined) && isEnableMeasuringPointsTab == true) {
            featureList.push(measuringPointsTabInfo);
        }

        jQuery.each(featureList, function (key, data) {
            //if (data.TabName.toUpperCase() == languageResource.resMsg_FunctionalLocation.toString().toUpperCase() && isEnableFunctionalLocationTab == true) {
            //    viewMaintenanceDetailsModel.FeatureTabList.push(data);
            //}
            //else if (data.TabName.toUpperCase() == languageResource.resMsg_EquipmentModals.toString().toUpperCase() && isEnableEquipmentModalsTab == true) {
            //    viewMaintenanceDetailsModel.FeatureTabList.push(data);
            //}
            //else if (data.TabName.toUpperCase() == languageResource.resMsg_Equipments.toString().toUpperCase() && isEnableEquipmentsTab == true) {
            //    viewMaintenanceDetailsModel.FeatureTabList.push(data);
            //}
            //else if (data.TabName.toUpperCase() == languageResource.resMsg_MeasuringPoints.toString().toUpperCase() && isEnableMeasuringPointsTab == true) {

            //}

            viewMaintenanceDetailsModel.FeatureTabList.push(data);

            if (tabCount === 0) {
                LoadIframe(data.TabPath);
            }
            tabCount++;
        });

        if (tabCount > 0) {
            viewMaintenanceDetailsModel.IsTabIFrameVisible(true);
        }

        jQuery(".nav-item:first").children(".nav-link").addClass("active");
        jQuery(".nav-item").click(function () {
            jQuery(".nav-link").removeClass("active");
            jQuery(this).children(".nav-link").addClass("active");
            jQuery("#MaintenanceInfoFrame").css({ "border": "1px solid #dcd7d7" });

        });


    }
}

function GetTabName(name) {
    if (name == "FUNCTIONAL_LOCATION") {
        return languageResource.resMsg_FunctionalLocation;
    }
    else if (name == "EQUIPMENT_MODELS") {
        return languageResource.resMsg_EquipmentModels;
    }
    else if (name == "EQUIPMENTS") {
        return languageResource.resMsg_Equipments;
    }
    else if (name == "MEASURING_POINTS") {
        return languageResource.resMsg_MeasuringPoints;
    }
    else {
        return name;
    }

}

function LoadIframe(urlPath) {
    jQuery('#MaintenanceInfoFrame').attr('src', urlPath);
    IframeHide();
}

function ShowErrorInfoDiv(errorMessage, isErrorMsg) {
    if (isErrorMsg == true) {
        jQuery("#spnMaintenanceErrorMsg").removeClass("blue");
        jQuery("#spnMaintenanceErrorMsg").addClass("red");
        jQuery("#spnMaintenanceErrorMsg").html(errorMessage);
    }
    else {
        jQuery("#spnMaintenanceInfoMsg").removeClass("red");
        jQuery("#spnMaintenanceInfoMsg").addClass("blue");
        jQuery("#spnMaintenanceInfoMsg").html(errorMessage);
    }

    viewMaintenanceDetailsModel.IsTabIFrameVisible(false);
    viewMaintenanceDetailsModel.IsErrorInfoVisible(true);
    jQuery("#divNoErrorInfo").removeClass("hide");
}

function ClearErrorMessage() {
    viewMaintenanceDetailsModel.IsTabIFrameVisible(false);
    viewMaintenanceDetailsModel.IsErrorInfoVisible(false);
    jQuery("#spnMaintenanceErrorMsg").html('');
    jQuery("#spnMaintenanceInfoMsg").html('');

    jQuery("#divNoErrorInfo").addClass("hide");
}

function IframeHide() {
    //harish working on
}


