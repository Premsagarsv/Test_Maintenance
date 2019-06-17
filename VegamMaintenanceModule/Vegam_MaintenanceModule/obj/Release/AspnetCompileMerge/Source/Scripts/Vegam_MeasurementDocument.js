﻿jQuery.MeasurementDocumentNamespace = jQuery.MeasurementDocumentNamespace || {};
jQuery.MeasurementDocumentNamespace.BasicParam = jQuery.MeasurementDocumentNamespace.BasicParam || {};
jQuery.MeasurementDocumentNamespace.AvailMeasPointPagerData = jQuery.MeasurementDocumentNamespace.AvailMeasPointPagerData || {};
jQuery.MeasurementDocumentNamespace.BasePath = "";
jQuery.MeasurementDocumentNamespace.PagesList = { 'MeasurementDocument': 'M', 'Schedule': 'S' };
jQuery.MeasurementDocumentNamespace.MaintMasterDataType = { Category: "P", WorkGroup: "W" };
jQuery.MeasurementDocumentNamespace.ScheduleStatus = { 'Active': 'A', 'InActive': 'I', 'SchedulingInProgress': 'P' };
jQuery.MeasurementDocumentNamespace.MaintScheduleID = 0;
jQuery.MeasurementDocumentNamespace.IsAMSearch = false;
jQuery.MeasurementDocumentNamespace.IsSMSearch = false;
jQuery.MeasurementDocumentNamespace.CheckedMeasuringPoints = [];
jQuery.MeasurementDocumentNamespace.ScheduleDetailID = 0;

var measurementDocumentViewModel = {
    HasEditAccess: false,
    HasDeleteAccess: false,
    MeasurementDocName: ko.observable(''),
    WorkGroupList: ko.observableArray([]),
    AvailableMeasuringPointList: ko.observableArray([]),
    LoadAMErrorMessageVisible: ko.observable(false),
    LoadAMErrorMessage: ko.observable(''),
    LoadAMErrorMessageClass: ko.observable(''),
    PagerContent: ko.observable(),
    SelectedMeasuringPointList: ko.observableArray([]),
    LoadSMErrorMessageVisible: ko.observable(false),
    LoadSMErrorMessage: ko.observable(''),
    LoadSMErrorMessageClass: ko.observable(''),
    FLocationList: ko.observableArray([]),
    CategoryList: ko.observableArray([]),
    EquipmentList: ko.observableArray([]),
    IsMeasPointSelectable: ko.observable(false)
};

function InitMeasurementDocumentInfo(availableMeasPointPagerData, basePath, maintScheduleID, hasDeleteAccess, hasEditAccess) {
    jQuery.MeasurementDocumentNamespace.BasicParam.SiteID = availableMeasPointPagerData.SiteID;
    jQuery.MeasurementDocumentNamespace.BasicParam.UserID = availableMeasPointPagerData.UserID;
    jQuery.MeasurementDocumentNamespace.AvailMeasPointPagerData = availableMeasPointPagerData;
    jQuery.MeasurementDocumentNamespace.BasePath = basePath;
    jQuery.MeasurementDocumentNamespace.MaintScheduleID = maintScheduleID;
    measurementDocumentViewModel.HasDeleteAccess = hasDeleteAccess.toString().toUpperCase() == "TRUE" ? true : false;
    measurementDocumentViewModel.HasEditAccess = hasEditAccess.toString().toUpperCase() == "TRUE" ? true : false;

    ko.applyBindings(measurementDocumentViewModel, document.getElementById("divMeasurementDocument"));

    LoadMaintMasterData(jQuery.MeasurementDocumentNamespace.MaintMasterDataType.WorkGroup);
    LoadMaintMasterData(jQuery.MeasurementDocumentNamespace.MaintMasterDataType.Category);

    LoadFLocationList();
    LoadEquipmentList();

    if (maintScheduleID > 0) {
        LoadMeasurementDocumentInfo();
    }
    else {
        var btnActivateSchedule = jQuery.MeasurementDocumentNamespace.AvailMeasPointPagerData.LoadControlID.replace("btnAdd", "btnActivateSchedule");
        jQuery("#" + btnActivateSchedule).attr("disabled", "disabled");
    }

    LoadAvailableMeasuringPoints(jQuery.MeasurementDocumentNamespace.AvailMeasPointPagerData);
}

function LoadMeasurementDocument(tabType) {
    jQuery("#divChecklistTab").removeClass('active in');
    jQuery("#divScheduleTab").removeClass('active in');
    jQuery('.btn-circle.btn-info').removeClass('btn-info').addClass('btn-default');

    if (tabType == jQuery.MeasurementDocumentNamespace.PagesList.MeasurementDocument) {
        jQuery("#divChecklistTab").addClass('active in');
        jQuery("#btnChecklist").addClass('btn-info').removeClass('btn-default').blur();
        jQuery("#divMeasurementInfo").show();
        jQuery("#divScheduleInfo").hide();
        if (jQuery.MeasurementDocumentNamespace.MaintScheduleID > 0)
            LoadMeasurementDocumentInfo();
    }
    else if (tabType == jQuery.MeasurementDocumentNamespace.PagesList.Schedule) {
        jQuery("#divScheduleTab").addClass('active in');
        jQuery("#btnScheduleInfo").addClass('btn-info').removeClass('btn-default').blur();
        jQuery("#divMeasurementInfo").hide();
        jQuery("#divScheduleInfo").show();
        LoadIframe(jQuery.MeasurementDocumentNamespace.BasePath + "/Preventive/CreateSchedule.aspx?id=" + jQuery.MeasurementDocumentNamespace.BasicParam.SiteID + "&ischecklist=true&maintscheduleid=" + jQuery.MeasurementDocumentNamespace.MaintScheduleID);
    }    
}

function LoadMaintMasterData(masterDataType) {
    var masterDataFilterInfo = {};
    masterDataFilterInfo.MasterDataType = masterDataType.charCodeAt();

    jQuery.ajax({
        type: "POST",
        url: jQuery.MeasurementDocumentNamespace.AvailMeasPointPagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetMaintMasterData",
        data: JSON.stringify({ basicParam: jQuery.MeasurementDocumentNamespace.BasicParam, masterDataFilterInfo: masterDataFilterInfo }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        async: false,
        success: function (json) {
            if (json != undefined && json.d != undefined) {
                if (masterDataType == jQuery.MeasurementDocumentNamespace.MaintMasterDataType.WorkGroup) {
                    measurementDocumentViewModel.WorkGroupList(json.d.MasterDataInfoList);
                    jQuery("#ddlWorkGroup").select2({ width: '50%' });
                }
                else if (masterDataType == jQuery.MeasurementDocumentNamespace.MaintMasterDataType.Category) {
                    measurementDocumentViewModel.CategoryList(json.d.MasterDataInfoList);
                    jQuery("#ddlAMCategory").select2({ width: '50%' });
                    jQuery("#ddlSMCategory").select2({ width: '50%' });
                }
            }
            else {
                ShowErrorMessage(languageResource.resMsg_FailedToLoadDataForDropdown, true);
            }
        },
        error: function (request, error) {
            var errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadDataForDropdown;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    errorMessage = languageResource.resMsg_Error + errorMsg.Message;
            }
            ShowErrorMessage(errorMessage, true);
        }
    });
}

function LoadFLocationList() {
    var locationFilterInfo = {};
    locationFilterInfo.SiteID = jQuery.MeasurementDocumentNamespace.BasicParam.SiteID;
    locationFilterInfo.UserID = jQuery.MeasurementDocumentNamespace.BasicParam.UserID;
    jQuery.ajax({
        type: "POST",
        url: jQuery.MeasurementDocumentNamespace.AvailMeasPointPagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetAllFunctionalLocInfo",
        data: JSON.stringify({ pagerData: null, locationFilterInfo: locationFilterInfo }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            var returnList = json.d.FunctionalLocationList;
            if (returnList != null && returnList.length > 0) {
                measurementDocumentViewModel.FLocationList(returnList);
                jQuery("#ddlAMFLocation").select2({ width: '50%' });
                jQuery("#ddlSMFLocation").select2({ width: '50%' });
            }
            else {
                ShowErrorMessage(languageResource.resMsg_FailedToLoadDataForDropdown, true);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (XMLHttpRequest.responseText != "") {
                var errorMsg = jQuery.parseJSON(XMLHttpRequest.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    msg = languageResource.resMsg_Error + errorMsg.Message;
                else
                    msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadDataForDropdown;
            }
            else {
                msg = languageResource.resMsg_FailedToLoadDataForDropdown;
            }
            ShowErrorMessage(msg, true);
        }
    });
}

function LoadEquipmentList() {
    var pagerData = {};
    pagerData.PageSize = 0;
    var equipmentFilterInfo = {};
    equipmentFilterInfo.SiteID = jQuery.MeasurementDocumentNamespace.BasicParam.SiteID;
    equipmentFilterInfo.UserID = jQuery.MeasurementDocumentNamespace.BasicParam.UserID;
    equipmentFilterInfo.InfoType = "Equipment";

    jQuery.ajax(
        {
            type: "POST",
            url: jQuery.MeasurementDocumentNamespace.AvailMeasPointPagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetAllEquipmentInfo",
            data: JSON.stringify({ pagerData: pagerData, equipmentFilterInfo: equipmentFilterInfo }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                var returnList = json.d.EquipmentList;
                if (returnList != null && returnList.length > 0) {
                    measurementDocumentViewModel.EquipmentList(returnList);
                    jQuery("#ddlAMEquipment").select2({ width: '50%' });
                    jQuery("#ddlSMEquipment").select2({ width: '50%' });
                }
                else {
                    ShowErrorMessage(languageResource.resMsg_FailedToLoadDataForDropdown, true);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                if (XMLHttpRequest.responseText != "") {
                    var errorMsg = jQuery.parseJSON(XMLHttpRequest.responseText);
                    if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                        msg = languageResource.resMsg_Error + errorMsg.Message;
                    else
                        msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadDataForDropdown;
                }
                else {
                    msg = languageResource.resMsg_FailedToLoadDataForDropdown;
                }
                ShowErrorMessage(msg, true);
            }
        });
}

function LoadMeasurementDocumentInfo() {
    var filterInfo = {};
    filterInfo.SiteID = jQuery.MeasurementDocumentNamespace.BasicParam.SiteID;
    filterInfo.UserID = jQuery.MeasurementDocumentNamespace.BasicParam.UserID;
    filterInfo.ScheduleID = jQuery.MeasurementDocumentNamespace.MaintScheduleID;

    var btnActivateSchedule = jQuery.MeasurementDocumentNamespace.AvailMeasPointPagerData.LoadControlID.replace("btnAdd", "btnActivateSchedule");

    jQuery.ajax({
        type: "POST",
        url: jQuery.MeasurementDocumentNamespace.AvailMeasPointPagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetMeasurementDocumentInfo",
        data: JSON.stringify({ filterInfo: filterInfo }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        async: false,
        success: function (json) {
            if (json.d != null && json.d != undefined) {
                if (jQuery.trim(json.d.MeasurementDocName).length == 0) {
                    jQuery.MeasurementDocumentNamespace.MaintScheduleID = 0;
                    jQuery("#" + jQuery.MeasurementDocumentNamespace.AvailMeasPointPagerData.LoadControlID).val(languageResource.resMsg_Add);
                    ShowErrorMessage(languageResource.resMsg_FailedToLoadSchedule, true);
                }
                else {
                    if (json.d.MeasuringPointList.length == 0) {
                        measurementDocumentViewModel.LoadSMErrorMessage(languageResource.resMsg_NoRecordsFound);
                        measurementDocumentViewModel.LoadSMErrorMessageClass('');
                        measurementDocumentViewModel.LoadSMErrorMessageVisible(true);
                    }
                    else {
                        measurementDocumentViewModel.SelectedMeasuringPointList(json.d.MeasuringPointList);
                    }
                    measurementDocumentViewModel.MeasurementDocName(json.d.MeasurementDocName);
                    if (json.d.WorkGroupID > 0) {
                        jQuery("#ddlWorkGroup").val(json.d.WorkGroupID);
                        jQuery("#ddlWorkGroup").trigger('change');
                    }
                    json.d.ScheduleStatus = String.fromCharCode(json.d.ScheduleStatus);
                    if (json.d.ScheduleDetailID > 0) {
                        jQuery.MeasurementDocumentNamespace.ScheduleDetailID = json.d.ScheduleDetailID;
                        if (json.d.ScheduleStatus == jQuery.MeasurementDocumentNamespace.ScheduleStatus.Active) {
                            jQuery("#" + btnActivateSchedule).text(languageResource.resMsg_InActivate);
                            jQuery("#" + btnActivateSchedule).removeAttr("disabled");
                            jQuery("#spnScheduleInProgress").hide();
                            jQuery("#" + btnActivateSchedule).show();
                        }
                        else if (json.d.ScheduleStatus == jQuery.MeasurementDocumentNamespace.ScheduleStatus.InActive) {
                            jQuery("#" + btnActivateSchedule).text(languageResource.resMsg_Activate);
                            jQuery("#" + btnActivateSchedule).removeAttr("disabled");
                            jQuery("#spnScheduleInProgress").hide();
                            jQuery("#" + btnActivateSchedule).show();
                        }
                        else if (json.d.ScheduleStatus == jQuery.MeasurementDocumentNamespace.ScheduleStatus.SchedulingInProgress) {
                            jQuery("#" + btnActivateSchedule).hide();
                            jQuery("#spnScheduleInProgress").show();
                        }
                    }
                    else {
                        jQuery("#" + btnActivateSchedule).attr("disabled", "disabled");
                        jQuery("#spnScheduleInProgress").hide();
                    }
                    if (measurementDocumentViewModel.SelectedMeasuringPointList().length == 0)
                        jQuery("#" + btnActivateSchedule).attr("disabled", "disabled");
                    measurementDocumentViewModel.IsMeasPointSelectable(true);
                }
            }
            else {
                ShowErrorMessage(languageResource.resMsg_FailedToLoadAMeasuringPointInfo, true);
            }
        },
        beforeSend: function () {
            measurementDocumentViewModel.MeasurementDocName('');
            measurementDocumentViewModel.SelectedMeasuringPointList.removeAll();
            measurementDocumentViewModel.LoadSMErrorMessageVisible(false);
            measurementDocumentViewModel.PagerContent('');
            jQuery("#divLoadSMProgressVisible").show();
            jQuery("#" + btnActivateSchedule).attr("disabled", "disabled");
            jQuery("#spnScheduleInProgress").hide();
        },
        complete: function () {
            jQuery("#divLoadSMProgressVisible").hide();
            //jQuery("#tblBody").css("maxHeight", fLocationMaxHeight);
            var totPageHeight = jQuery(window).height();
            var fLocationStartPos = jQuery(".tbodypositionfixed").offset().top;
            var fLocationMaxHeight = totPageHeight - fLocationStartPos - 62;
            var orgHeight = jQuery("#tblBody table").height();
            if (orgHeight >= fLocationMaxHeight) {
                jQuery("#tblHead").css("width", "97.4%");
                jQuery("#tblBody").css("max-height", fLocationMaxHeight);
            }
            else
                jQuery("#tblHead").css("width", "100%");
        },
        error: function (request, error) {
            measurementDocumentViewModel.LoadAMErrorMessageClass('red');
            measurementDocumentViewModel.LoadAMErrorMessageVisible(true);
            var errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadSchedule;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    errorMessage = languageResource.resMsg_Error + errorMsg.Message;
            }

            ShowErrorMessage(errorMessage, true);
        }
    });
}

function LoadAvailableMeasuringPoints(pagerData) {
    var filterInfo = {};
    filterInfo.SiteID = jQuery.MeasurementDocumentNamespace.BasicParam.SiteID;
    filterInfo.UserID = jQuery.MeasurementDocumentNamespace.BasicParam.UserID;
    filterInfo.PageSize = pagerData.PageSize;
    filterInfo.PageIndex = pagerData.PageIndex;
    filterInfo.ScheduleID = jQuery.MeasurementDocumentNamespace.MaintScheduleID;

    if (jQuery.MeasurementDocumentNamespace.IsAMSearch) {
        if (!!jQuery("#ddlAMFLocation").val() && jQuery("#ddlAMFLocation").val() > 0) {
            filterInfo.FLocationIDs = jQuery("#ddlAMFLocation").val();
        }
        if (!!jQuery("#ddlAMEquipment").val() && jQuery("#ddlAMEquipment").val() > 0) {
            filterInfo.EquipmentIDs = jQuery("#ddlAMEquipment").val();
        }
        if (!!jQuery("#ddlAMCategory").val() && jQuery("#ddlAMCategory").val() > 0) {
            filterInfo.CategoryIDs = jQuery("#ddlAMCategory").val();
        }
        if (!!jQuery("#txtAMMeasPoint").val() && jQuery.trim(jQuery("#txtAMMeasPoint").val()).length > 0) {
            filterInfo.MeasuringPoint = jQuery.trim(jQuery("#txtAMMeasPoint").val());
        }
    }

    if (jQuery("#hdfAMSortValue").val() != "") {
        filterInfo.SortType = jQuery("#hdfAMSortValue").val();
    }

    var totPageHeight = jQuery(window).height();
    var availMeasPointStartPos = jQuery(".tbodypositionfixed").offset().top;
    var availMeasPointMaxHeight = totPageHeight - availMeasPointStartPos - 62;
    if (jQuery(window).width() < 768)
        availMeasPointMaxHeight = 500;
    if (Math.floor(availMeasPointMaxHeight / 30) > 2) {
        filterInfo.PageSize = Math.floor(availMeasPointMaxHeight / 30) % 2 == 0 ? Math.floor(availMeasPointMaxHeight / 30) : Math.floor(availMeasPointMaxHeight / 30) + 1;
        pagerData.PageSize = Math.floor(availMeasPointMaxHeight / 30) % 2 == 0 ? Math.floor(availMeasPointMaxHeight / 30) : Math.floor(availMeasPointMaxHeight / 30) + 1;
    }

    jQuery.ajax({
        type: "POST",
        url: jQuery.MeasurementDocumentNamespace.AvailMeasPointPagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetMeasDocMeasuringPoints",
        data: JSON.stringify({ filterInfo: filterInfo, pagerData: pagerData }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        async: false,
        success: function (json) {
            if (json.d != null && json.d != undefined) {
                if (json.d.MeasuringPointList.length == 0) {
                    measurementDocumentViewModel.LoadAMErrorMessage(languageResource.resMsg_NoRecordsFound);
                    measurementDocumentViewModel.LoadAMErrorMessageClass('');
                    measurementDocumentViewModel.LoadAMErrorMessageVisible(true);
                }
                else {
                    BindAvailableMeasuringPoints(json.d.MeasuringPointList);
                    measurementDocumentViewModel.PagerContent(json.d.HTMLPager);
                }
            }
            else {
                measurementDocumentViewModel.LoadAMErrorMessage(languageResource.resMsg_FailedToLoadAMeasuringPointInfo);
                measurementDocumentViewModel.LoadAMErrorMessageClass('red');
                measurementDocumentViewModel.LoadAMErrorMessageVisible(true);
            }
        },
        beforeSend: function () {
            jQuery.MeasurementDocumentNamespace.CheckedMeasuringPoints = [];
            measurementDocumentViewModel.AvailableMeasuringPointList.removeAll();
            measurementDocumentViewModel.LoadAMErrorMessageVisible(false);
            measurementDocumentViewModel.PagerContent('');
            jQuery("#divLoadAMProgressVisible").show();
        },
        complete: function () {
            jQuery("#divLoadAMProgressVisible").hide();
        },
        error: function (request, error) {
            measurementDocumentViewModel.LoadAMErrorMessageClass('red');
            measurementDocumentViewModel.LoadAMErrorMessageVisible(true);
            var errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadAMeasuringPointInfo;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    errorMessage = languageResource.resMsg_Error + errorMsg.Message;
            }
            measurementDocumentViewModel.LoadAMErrorMessage(errorMessage);
        }
    });
}

function LoadSelectedMeasuringPoints() {
    var filterInfo = {};
    filterInfo.SiteID = jQuery.MeasurementDocumentNamespace.BasicParam.SiteID;
    filterInfo.UserID = jQuery.MeasurementDocumentNamespace.BasicParam.UserID;
    filterInfo.ScheduleID = jQuery.MeasurementDocumentNamespace.MaintScheduleID;

    if (jQuery.MeasurementDocumentNamespace.IsSMSearch) {
        if (!!jQuery("#ddlSMFLocation").val() && jQuery("#ddlSMFLocation").val() > 0) {
            filterInfo.FLocationIDs = jQuery("#ddlSMFLocation").val();
        }
        if (!!jQuery("#ddlSMEquipment").val() && jQuery("#ddlSMEquipment").val() > 0) {
            filterInfo.EquipmentIDs = jQuery("#ddlSMEquipment").val();
        }
        if (!!jQuery("#ddlSMCategory").val() && jQuery("#ddlSMCategory").val() > 0) {
            filterInfo.CategoryIDs = jQuery("#ddlSMCategory").val();
        }
        if (!!jQuery("#txtSMMeasPoint").val() && jQuery.trim(jQuery("#txtSMMeasPoint").val()).length > 0) {
            filterInfo.MeasuringPoint = jQuery.trim(jQuery("#txtSMMeasPoint").val());
        }
    }

    if (jQuery("#hdfSMSortValue").val() != "") {
        filterInfo.SortType = jQuery("#hdfSMSortValue").val();
    }

    jQuery.ajax({
        type: "POST",
        url: jQuery.MeasurementDocumentNamespace.AvailMeasPointPagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetMeasDocMeasuringPoints",
        data: JSON.stringify({ filterInfo: filterInfo, pagerData: null }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        async: false,
        success: function (json) {
            if (json.d != null && json.d != undefined) {
                if (json.d.MeasuringPointList.length == 0) {
                    measurementDocumentViewModel.LoadSMErrorMessage(languageResource.resMsg_NoRecordsFound);
                    measurementDocumentViewModel.LoadSMErrorMessageClass('');
                    measurementDocumentViewModel.LoadSMErrorMessageVisible(true);
                }
                else {
                    measurementDocumentViewModel.SelectedMeasuringPointList(json.d.MeasuringPointList);
                }
            }
            else {
                measurementDocumentViewModel.LoadSMErrorMessage(languageResource.resMsg_FailedToLoadSMeasuringPointInfo);
                measurementDocumentViewModel.LoadSMErrorMessageClass('red');
                measurementDocumentViewModel.LoadSMErrorMessageVisible(true);
            }
        },
        beforeSend: function () {
            measurementDocumentViewModel.SelectedMeasuringPointList.removeAll();
            measurementDocumentViewModel.LoadSMErrorMessageVisible(false);
            jQuery("#divLoadSMProgressVisible").show();
        },
        complete: function () {
            jQuery("#divLoadSMProgressVisible").hide();
            var totPageHeight = jQuery(window).height();
            var fLocationStartPos = jQuery(".tbodypositionfixed").offset().top;
            var fLocationMaxHeight = totPageHeight - fLocationStartPos - 62;
            var orgHeight = jQuery("#tblBody table").height();
            if (orgHeight >= fLocationMaxHeight) {
                jQuery("#tblHead").css("width", "97.4%");
                jQuery("#tblBody").css("max-height", fLocationMaxHeight);
            }
            else
                jQuery("#tblHead").css("width", "100%");
        },
        error: function (request, error) {
            measurementDocumentViewModel.LoadSMErrorMessageClass('red');
            measurementDocumentViewModel.LoadSMErrorMessageVisible(true);
            var errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadSMeasuringPointInfo;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    errorMessage = languageResource.resMsg_Error + errorMsg.Message;
            }
            measurementDocumentViewModel.LoadSMErrorMessage(errorMessage);
        }
    });
}

function BindAvailableMeasuringPoints(availableMeasPoints) {
    var measPoint = {};
    measurementDocumentViewModel.AvailableMeasuringPointList.removeAll();
    jQuery.each(availableMeasPoints, function (index, value) {
        if (jQuery.grep(measurementDocumentViewModel.SelectedMeasuringPointList(), function (v) {
            return v.MeasuringPointID == value.MeasuringPointID;
        }).length > 0 || !measurementDocumentViewModel.HasEditAccess) {
            measPoint.IsDisabled = true;
        }
        else {
            measPoint.IsDisabled = false;
        }
        measPoint.MeasuringPointID = value.MeasuringPointID;
        measPoint.FunctionalLocation = value.FunctionalLocation;
        measPoint.Equipment = value.Equipment;
        measPoint.MeasuringPointName = value.MeasuringPointName;
        measPoint.Category = value.Category;
        measurementDocumentViewModel.AvailableMeasuringPointList.push(measPoint);
        measPoint = {};
    });
}

function SortMeasuringPointsTabs(thValue, value, isAvailMeasPoint) {
    var thClass = "";
    var hasSortUpClassExist = jQuery("#" + thValue + " i").hasClass('fa-sort-up');
    var hasSortDownExist = jQuery("#" + thValue + " i").hasClass('fa-sort-down');

    if (hasSortUpClassExist == false && hasSortDownExist == false) {
        jQuery(".fa-sort-down").removeClass('fa fa-sort-down');
        jQuery(".fa-sort-up").removeClass('fa fa-sort-up');

        jQuery("#" + thValue + " i").addClass('fa fa-sort-up');
        thClass = value + "_asc";
        if (isAvailMeasPoint) {
            jQuery("#hdfAMSortValue").val(thClass);
            LoadAvailableMeasuringPoints(jQuery.MeasurementDocumentNamespace.AvailMeasPointPagerData);
        }
        else {
            jQuery("#hdfSMSortValue").val(thClass);
            LoadSelectedMeasuringPoints();
        }
        return false;
    }
    if (jQuery("#" + thValue + " i").hasClass('fa-sort-up')) {
        jQuery(".fa-sort-down").removeClass('fa fa-sort-down');
        jQuery(".fa-sort-up").removeClass('fa fa-sort-up');

        jQuery("#" + thValue + " i").addClass('fa fa-sort-down');
        thClass = value + "_desc";
        if (isAvailMeasPoint) {
            jQuery("#hdfAMSortValue").val(thClass);
            LoadAvailableMeasuringPoints(jQuery.MeasurementDocumentNamespace.AvailMeasPointPagerData);
        }
        else {
            jQuery("#hdfSMSortValue").val(thClass);
            LoadSelectedMeasuringPoints();
        }
        return false;
    }
    if (jQuery("#" + thValue + " i").hasClass('fa-sort-down')) {
        jQuery(".fa-sort-down").removeClass('fa fa-sort-down');
        jQuery(".fa-sort-up").removeClass('fa fa-sort-up');

        jQuery("#" + thValue + " i").addClass('fa fa-sort-up');
        thClass = value + "_asc";
        if (isAvailMeasPoint) {
            jQuery("#hdfAMSortValue").val(thClass);
            LoadAvailableMeasuringPoints(jQuery.MeasurementDocumentNamespace.AvailMeasPointPagerData);
        }
        else {
            jQuery("#hdfSMSortValue").val(thClass);
            LoadSelectedMeasuringPoints();
        }
        return false;
    }
}

function SearchAvailMeasuringPoints() {
    jQuery("#spnAvailMeasuringPointsSearchError").text('');
    if ((!!jQuery("#ddlAMFLocation").val() && jQuery("#ddlAMFLocation").val() > 0) || (!!jQuery("#ddlAMEquipment").val() && jQuery("#ddlAMEquipment").val() > 0) || (!!jQuery("#ddlAMCategory").val() && jQuery("#ddlAMCategory").val() > 0) || (!!jQuery("#txtAMMeasPoint").val() && jQuery.trim(jQuery("#txtAMMeasPoint").val()).length > 0)) {
        jQuery.MeasurementDocumentNamespace.IsAMSearch = true;
        jQuery("#btnShowAllAvailMeasuringPoints").show();
        LoadAvailableMeasuringPoints(jQuery.MeasurementDocumentNamespace.AvailMeasPointPagerData);
    }
    else {
        jQuery("#spnAvailMeasuringPointsSearchError").text(languageResource.resMsg_EnterSearchCriteria);
        jQuery.MeasurementDocumentNamespace.IsAMSearch = false;
    }
}

function ShowAllAvailMeasuringPoints() {
    jQuery("#spnAvailMeasuringPointsSearchError").text('');
    jQuery("#ddlAMFLocation").val('');
    jQuery("#ddlAMFLocation").select2({ width: '50%' });
    jQuery("#ddlAMEquipment").val('');
    jQuery("#ddlAMEquipment").select2({ width: '50%' });
    jQuery("#ddlAMCategory").val('');
    jQuery("#ddlAMCategory").select2({ width: '50%' });
    jQuery("#txtAMMeasPoint").val('');
    jQuery.MeasurementDocumentNamespace.IsAMSearch = false;
    jQuery("#btnShowAllAvailMeasuringPoints").hide();
    LoadAvailableMeasuringPoints(jQuery.MeasurementDocumentNamespace.AvailMeasPointPagerData);
}

function SearchSelectedMeasuringPoints() {
    jQuery("#spnSelectedMeasuringPointsSearchError").text('');
    if ((!!jQuery("#ddlSMFLocation").val() && jQuery("#ddlSMFLocation").val() > 0) || (!!jQuery("#ddlSMEquipment").val() && jQuery("#ddlSMEquipment").val() > 0) || (!!jQuery("#ddlSMCategory").val() && jQuery("#ddlSMCategory").val() > 0) || (!!jQuery("#txtSMMeasPoint").val() && jQuery.trim(jQuery("#txtSMMeasPoint").val()).length > 0)) {
        jQuery.MeasurementDocumentNamespace.IsSMSearch = true;
        jQuery("#btnShowAllSelectedMeasuringPoints").show();
        LoadSelectedMeasuringPoints();
    }
    else {
        jQuery("#spnSelectedMeasuringPointsSearchError").text(languageResource.resMsg_EnterSearchCriteria);
        jQuery.MeasurementDocumentNamespace.IsAMSearch = false;
    }
}

function ShowAllSelectedMeasuringPoints() {
    jQuery("#spnSelectedMeasuringPointsSearchError").text('');
    jQuery("#ddlSMFLocation").val('');
    jQuery("#ddlSMFLocation").select2({ width: '50%' });
    jQuery("#ddlSMEquipment").val('');
    jQuery("#ddlSMEquipment").select2({ width: '50%' });
    jQuery("#ddlSMCategory").val('');
    jQuery("#ddlSMCategory").select2({ width: '50%' });
    jQuery("#txtSMMeasPoint").val('');
    jQuery.MeasurementDocumentNamespace.IsSMSearch = false;
    jQuery("#btnShowAllSelectedMeasuringPoints").hide();
    LoadSelectedMeasuringPoints();
}

function SelectAvailableMeasuringPoint(measuringPoint) {
    var rowInfo = ko.dataFor(measuringPoint)
    if (jQuery(measuringPoint).is(':checked')) {
        jQuery.MeasurementDocumentNamespace.CheckedMeasuringPoints.push(rowInfo.MeasuringPointID);
    }
    else {
        jQuery.MeasurementDocumentNamespace.CheckedMeasuringPoints = jQuery.grep(jQuery.MeasurementDocumentNamespace.CheckedMeasuringPoints, function (value) {
            return value != rowInfo.MeasuringPointID;
        });
    }
}

function PushAvailMeasInSelectedMeasPoints() {
    var measurementDocInfo = {};
    measurementDocInfo.SiteID = jQuery.MeasurementDocumentNamespace.BasicParam.SiteID;
    measurementDocInfo.UserID = jQuery.MeasurementDocumentNamespace.BasicParam.UserID;
    measurementDocInfo.ScheduleID = jQuery.MeasurementDocumentNamespace.MaintScheduleID;
    measurementDocInfo.SelectedMeasuringPoints = [];
    jQuery.each(measurementDocumentViewModel.SelectedMeasuringPointList(), function (index, value) {
        measurementDocInfo.SelectedMeasuringPoints.push(value.MeasuringPointID);
    });
    jQuery.each(jQuery.MeasurementDocumentNamespace.CheckedMeasuringPoints, function (index, value) {
        measurementDocInfo.SelectedMeasuringPoints.push(value);
    });

    jQuery.ajax({
        type: "POST",
        url: jQuery.MeasurementDocumentNamespace.AvailMeasPointPagerData.ServicePath + "/Vegam_MaintenanceService.asmx/InsertSelectedMeasuringPoint",
        data: JSON.stringify({ measurementDocInfo: measurementDocInfo }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        async: false,
        success: function (json) {
            if (json.d != undefined && json.d != null && json.d == true) {
                ShowAllSelectedMeasuringPoints();
                if (measurementDocumentViewModel.SelectedMeasuringPointList().length > 0) {
                    measurementDocumentViewModel.LoadSMErrorMessageVisible(false);
                    if (jQuery.MeasurementDocumentNamespace.ScheduleDetailID > 0) {
                        var btnActivateSchedule = jQuery.MeasurementDocumentNamespace.AvailMeasPointPagerData.LoadControlID.replace("btnAdd", "btnActivateSchedule");
                        jQuery("#" + btnActivateSchedule).removeAttr("disabled");
                    }
                }
                BindAvailableMeasuringPoints(measurementDocumentViewModel.AvailableMeasuringPointList().slice());
                jQuery.MeasurementDocumentNamespace.CheckedMeasuringPoints = [];
            }
            else {
                measurementDocumentViewModel.LoadSMErrorMessage(languageResource.resMsg_FailedToInsertSelectedMeasPoint);
                measurementDocumentViewModel.LoadSMErrorMessageClass('red');
                measurementDocumentViewModel.LoadSMErrorMessageVisible(true);
            }
        },
        beforeSend: function () {
            measurementDocumentViewModel.LoadSMErrorMessage('');
            measurementDocumentViewModel.LoadSMErrorMessageClass('');
            measurementDocumentViewModel.LoadSMErrorMessageVisible(false);
        },
        error: function (request, error) {
            var errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToInsertSelectedMeasPoint;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    errorMessage = languageResource.resMsg_Error + errorMsg.Message;
            }
            measurementDocumentViewModel.LoadSMErrorMessage(errorMessage);
            measurementDocumentViewModel.LoadSMErrorMessageClass('red');
            measurementDocumentViewModel.LoadSMErrorMessageVisible(true);
        }
    });
}

function AddUpdateMeasurementDocument() {
    jQuery("#spnAddUpdateError").html('');
    var isValid = true;
    var message = '';
    if (jQuery.trim(jQuery("#txtMeasDocName").val()).length == 0) {
        isValid = false;
        message = languageResource.resMsg_EnterDocumentName + "</br>";
    }
    if (jQuery("#ddlWorkGroup").val() == undefined || jQuery("#ddlWorkGroup").val() == null || jQuery("#ddlWorkGroup").val() == 0) {
        isValid = false;
        message = message + languageResource.resMsg_SelectWorkGroup + "</br>";
    }

    if (isValid) {
        var maintenanceInfo = {};
        maintenanceInfo.SiteID = jQuery.MeasurementDocumentNamespace.BasicParam.SiteID;
        maintenanceInfo.UserID = jQuery.MeasurementDocumentNamespace.BasicParam.UserID;
        maintenanceInfo.MaintScheduleID = jQuery.MeasurementDocumentNamespace.MaintScheduleID;
        maintenanceInfo.MaintenanceName = jQuery.trim(jQuery("#txtMeasDocName").val());
        maintenanceInfo.MaintenanceDesc = "";
        maintenanceInfo.WorkGroupID = jQuery("#ddlWorkGroup").val();
        maintenanceInfo.MaintScheduleType = "Inspection";

        jQuery.ajax({
            type: "POST",
            url: jQuery.MeasurementDocumentNamespace.AvailMeasPointPagerData.ServicePath + "/Vegam_MaintenanceService.asmx/InsertUpdateMaintenanceInfo",
            data: JSON.stringify({ maintenanceInfo: maintenanceInfo }),
            contentType: "application/json; charset=utf-8",
            datatype: 'json',
            async: false,
            success: function (json) {
                if (json.d != null && json.d != undefined) {
                    var result = json.d;
                    if (result == -1) {//Already exist
                        jQuery("#spnAddUpdateError").html(languageResource.resMsg_AlreadyExist);
                    }
                    else if (result == -2) {
                        //work order is started, update is not possible
                        jQuery("#spnAddUpdateError").html(languageResource.resMsg_WorkOrderStartedUpdateNotPossible);
                    }
                    else if (result == jQuery.MeasurementDocumentNamespace.MaintScheduleID) {
                        //successfully updated
                        jQuery.MeasurementDocumentNamespace.NewMaintScheduleID = jQuery.MeasurementDocumentNamespace.MaintScheduleID;
                        jQuery("#spnAddUpdateError").removeClass('text-danger').addClass('text-info');
                        jQuery("#spnAddUpdateError").html(languageResource.resMsg_SuccessfullyUpdatedDocInfo);
                    }
                    else if (result > 0) {
                        //successfully inserted
                        jQuery.MeasurementDocumentNamespace.MaintScheduleID = json.d;
                        jQuery("#" + jQuery.MeasurementDocumentNamespace.AvailMeasPointPagerData.LoadControlID).val(languageResource.resMsg_Update);
                        measurementDocumentViewModel.IsMeasPointSelectable(true);
                        jQuery("#spnAddUpdateError").removeClass('text-danger').addClass('text-info');
                        jQuery("#spnAddUpdateError").html(languageResource.resMsg_SuccessfullyInsertedDocInfo);
                    }
                }
                else {
                    jQuery("#spnAddUpdateError").html(languageResource.resMsg_FailedToInsertUpdate);
                }
            },
            beforeSend: function () {
                jQuery("#spnAddUpdateError").removeClass('text-info').addClass('text-danger');
                jQuery("#spnAddUpdateError").html('');
                jQuery("#divProgress").show();
            },
            complete: function () {
                jQuery("#divProgress").hide();
            },
            error: function (request, error) {
                var errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToInsertUpdate;
                if (request.responseText != "") {
                    var errorMsg = jQuery.parseJSON(request.responseText);
                    if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                        errorMessage = languageResource.resMsg_Error + errorMsg.Message;
                }
                jQuery("#spnAddUpdateError").html(errorMessage);
            }
        });
    }
    else {
        jQuery("#spnAddUpdateError").html(message);
    }
}

function DeleteSelectedMeasuringPointClick(measuringPointID) {
    jQuery("#alertMessage").removeClass("text-danger");
    jQuery("#alertMessage").html(languageResource.resMsg_DeleteSelectedMeasPointConfirm);
    jQuery("#confirmModal").dialog({
        zIndex: 1060,
        closeOnEscape: false,
        open: function (event, ui) {
            jQuery(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
        },
        modal: true,
        buttons: [
            {
                text: languageResource.resMsg_Confirm,
                click: function () {
                    jQuery("#confirmModal").dialog("close");
                    DeleteSelectedMeasuringPoint(measuringPointID);
                }
            },
            {
                text: languageResource.resMsg_Cancel,
                click: function () {

                    jQuery("#confirmModal").dialog("close");
                    isTrue = false;
                }
            }
        ]
    });
}

function DeleteSelectedMeasuringPoint(measuringPointID) {
    var filterInfo = {};
    filterInfo.SiteID = jQuery.MeasurementDocumentNamespace.BasicParam.SiteID;
    filterInfo.UserID = jQuery.MeasurementDocumentNamespace.BasicParam.UserID;
    filterInfo.MeasuringPointID = measuringPointID;
    filterInfo.ScheduleID = jQuery.MeasurementDocumentNamespace.MaintScheduleID;

    jQuery.ajax({
        type: "POST",
        url: jQuery.MeasurementDocumentNamespace.AvailMeasPointPagerData.ServicePath + "/Vegam_MaintenanceService.asmx/DeleteSelectedMeasuringPoint",
        data: JSON.stringify({ filterInfo: filterInfo }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if (json.d != undefined && json.d != null && json.d == true) {
                ShowAllSelectedMeasuringPoints();
                BindAvailableMeasuringPoints(measurementDocumentViewModel.AvailableMeasuringPointList().slice());
                if (measurementDocumentViewModel.SelectedMeasuringPointList().length == 0) {
                    var btnActivateSchedule = jQuery.MeasurementDocumentNamespace.AvailMeasPointPagerData.LoadControlID.replace("btnAdd", "btnActivateSchedule");
                    jQuery("#" + btnActivateSchedule).attr("disabled", "disabled");
                }
            }
            else {
                var msg = languageResource.resMsg_FailedToDeleteSelectedMeasPoint;
                jQuery("#alertMessage").addClass("text-danger");
                ShowErrorMessage(msg, true);
            }
        },
        error: function (request, error) {
            var msg;
            if (request.responseText != "") {
                var errorMsg = request.responseText;//jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    msg = languageResource.resMsg_Error + errorMsg.Message;
                else
                    msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToDeleteSelectedMeasPoint;
            }
            else {
                msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToDeleteSelectedMeasPoint;
            }
            ShowErrorMessage(msg, true);
        },
    });
}

function ShowErrorMessage(msg, isError) {
    if (isError == true || isError == undefined)
        jQuery("#alertMessage").addClass("text-danger")
    else
        jQuery("#alertMessage").removeClass("text-danger")
    jQuery("#alertMessage").html(msg);
    jQuery("#confirmModal").dialog({
        modal: true,
        buttons: [
            {
                text: languageResource.resMsg_Ok,
                click: function () {
                    jQuery("#confirmModal").dialog("close");
                }
            }
        ]
    });
}

function BindIconAttributes(hasAccess) {
    var iconAttributes = {};
    if (!hasAccess) {
        iconAttributes.disabled = "disabled";
    }
    return iconAttributes;
}

function ActivateScheduleInfoCinfirm() {
    var btnActivateSchedule = jQuery.MeasurementDocumentNamespace.AvailMeasPointPagerData.LoadControlID.replace("btnAdd", "btnActivateSchedule");
    jQuery("#alertMessage").removeClass("text-danger");
    if (jQuery("#" + btnActivateSchedule).text() == languageResource.resMsg_InActivate)
        jQuery("#alertMessage").html(languageResource.resMsg_UpdateScheduleStatusInActiveConfirm);
    else
        jQuery("#alertMessage").html(languageResource.resMsg_UpdateScheduleStatusActiveConfirm);
    jQuery("#confirmModal").dialog({
        zIndex: 1060,
        closeOnEscape: false,
        open: function (event, ui) {
            jQuery(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
            jQuery(".ui-widget-overlay").css('z-index', '10043');
        },
        modal: true,
        buttons: [
            {
                text: languageResource.resMsg_Confirm,
                click: function () {
                    jQuery("#confirmModal").dialog("close");
                    ActivateSchedule();
                }
            },
            {
                text: languageResource.resMsg_Cancel,
                click: function () {

                    jQuery("#confirmModal").dialog("close");
                    isTrue = false;
                }
            }
        ]
    });
}

function ActivateSchedule() {
    var filterInfo = {};
    filterInfo.SiteID = jQuery.MeasurementDocumentNamespace.BasicParam.SiteID;
    filterInfo.UserID = jQuery.MeasurementDocumentNamespace.BasicParam.UserID;
    filterInfo.MaintScheduleID = jQuery.MeasurementDocumentNamespace.MaintScheduleID;

    var btnActivateSchedule = jQuery.MeasurementDocumentNamespace.AvailMeasPointPagerData.LoadControlID.replace("btnAdd", "btnActivateSchedule");
    var serviceMethod = "ActivateMaintenanceSchedule";
    var activate = true;
    if (jQuery("#" + btnActivateSchedule).text() == languageResource.resMsg_InActivate) {
        serviceMethod = "InActivateMaintenanceSchedule";
        activate = false;
    }

    jQuery.ajax({
        type: "POST",
        url: jQuery.MeasurementDocumentNamespace.AvailMeasPointPagerData.ServicePath + "/Vegam_MaintenanceService.asmx/" + serviceMethod,
        data: JSON.stringify({ filterInfo: filterInfo }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        success: function (json) {
            if (json != undefined && json.d != undefined && json.d == true) {
                if (activate) {
                    jQuery("#" + btnActivateSchedule).text(languageResource.resMsg_InActivate);
                    jQuery("#" + btnActivateSchedule).hide();
                    jQuery("#spnScheduleInProgress").show();
                    ShowErrorMessage(languageResource.resMsg_SuccessfullyActivatedSchedule, false);
                }
                else {
                    jQuery("#" + btnActivateSchedule).text(languageResource.resMsg_Activate);
                    ShowErrorMessage(languageResource.resMsg_SuccessfullyInActivatedSchedule, false);
                }
            }
            else {
                if (activate)
                    ShowErrorMessage(languageResource.resMsg_FailedToActivateSchedule, true);
                else
                    ShowErrorMessage(languageResource.resMsg_FailedToInActivateSchedule, true);
            }
        },
        error: function (request, error) {
            var msg = languageResource.resMsg_FailedToInActivateSchedule;
            if (activate)
                msg = languageResource.resMsg_FailedToActivateSchedule;
            var errorMessage = languageResource.resMsg_Error + msg;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    errorMessage = languageResource.resMsg_Error + errorMsg.Message;
            }
            ShowErrorMessage(errorMessage, true);
        }
    });
}

function LoadIframe(urlPath) {
    jQuery('#iFrameScheduleInfo').attr('src', urlPath);
}

jQuery(function () {
    jQuery('.btn-circle').on('click', function () {
        var name = jQuery(this).attr("id");
        if (name == "btnChecklist") {
            LoadMeasurementDocument(jQuery.MeasurementDocumentNamespace.PagesList.MeasurementDocument);
        }
        else {
            //enable below buttons only if maintenance information exists
            if (jQuery.MeasurementDocumentNamespace.MaintScheduleID > 0 && measurementDocumentViewModel.SelectedMeasuringPointList().length>0) {
                if (name == "btnScheduleInfo") {
                    LoadMeasurementDocument(jQuery.MeasurementDocumentNamespace.PagesList.Schedule);
                }
            }
        }
    });

    jQuery('#divTabInfo a').on('click', function () {
        jQuery(this).closest('.process-step').find('.btn-circle').triggerHandler('click');
    });
});
