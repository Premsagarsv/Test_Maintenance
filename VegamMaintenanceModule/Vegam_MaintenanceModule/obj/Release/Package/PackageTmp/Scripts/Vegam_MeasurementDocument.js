﻿jQuery.MeasurementDocumentNamespace = jQuery.MeasurementDocumentNamespace || {};
jQuery.MeasurementDocumentNamespace.BasicParam = jQuery.MeasurementDocumentNamespace.BasicParam || {};
jQuery.MeasurementDocumentNamespace.AvailMeasPointPagerData = jQuery.MeasurementDocumentNamespace.AvailMeasPointPagerData || {};
jQuery.MeasurementDocumentNamespace.BasePath = "";
jQuery.MeasurementDocumentNamespace.PagesList = { 'MeasurementDocument': 'M', 'Schedule': 'S' };
jQuery.MeasurementDocumentNamespace.MaintMasterDataType = { Category: "MP_CATEGORY", WorkGroup: "WORKGROUP" };
jQuery.MeasurementDocumentNamespace.ScheduleStatus = { 'Created': 'CREATED', 'Released': 'RELEASED', 'Cancelled': 'CANCELLED', 'Scheduling': 'SCHEDULING' };
jQuery.MeasurementDocumentNamespace.MaintScheduleID = 0;
jQuery.MeasurementDocumentNamespace.IsAMSearch = false;
jQuery.MeasurementDocumentNamespace.IsSMSearch = false;
jQuery.MeasurementDocumentNamespace.CheckedMeasuringPoints = [];
jQuery.MeasurementDocumentNamespace.ScheduleDetailID = 0;
jQuery.MeasurementDocumentNamespace.SelectedWorkGroupID = 0;
jQuery.MeasurementDocumentNamespace.CurrentWorkGroupID = 0;

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
    AvailEquipmentList: ko.observableArray([]),
    SelectedEquipmentList: ko.observableArray([]),
    IsMeasPointSelectable: ko.observable(false),
    FilterAvailLocationList: ko.observableArray([]),
    AvailEquipmentFilterArray: ko.observableArray([]),
    FilterSelectedLocationList: ko.observableArray([]),
    SelectedEquipmentFilterArray: ko.observableArray([])
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

    GetUserWorkGroupInfo();
    LoadMaintMasterData(jQuery.MeasurementDocumentNamespace.MaintMasterDataType.Category);

    if (jQuery.MeasurementDocumentNamespace.AvailMeasPointPagerData.PageAccessRights.toUpperCase() !== "FULL_ACCESS") {
        var btnActivateSchedule = jQuery.MeasurementDocumentNamespace.AvailMeasPointPagerData.LoadControlID.replace("btnAdd", "btnActivateSchedule");
        jQuery("#" + btnActivateSchedule).addClass("li-disabled");
    }

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
        jQuery("#btnChecklist").parent().find("a").removeAttr('style');
        if (measurementDocumentViewModel.SelectedMeasuringPointList().length > 0) {
            jQuery("#btnScheduleInfo").parent().find("a").attr('style', 'color:black');
            jQuery("#btnScheduleInfo").removeClass('tab-icon-disabled');
        }
        else {
            jQuery("#btnScheduleInfo").parent().find("a").attr('style', 'color:grey');
            jQuery("#btnScheduleInfo").addClass('tab-icon-disabled');
        }
        jQuery("#divMeasurementInfo").show();
        jQuery("#divScheduleInfo").hide();
        if (jQuery.MeasurementDocumentNamespace.MaintScheduleID > 0)
            LoadMeasurementDocumentInfo();
    }
    else if (tabType == jQuery.MeasurementDocumentNamespace.PagesList.Schedule) {
        jQuery("#divScheduleTab").addClass('active in');
        jQuery("#btnScheduleInfo").addClass('btn-info').removeClass('btn-default').blur();
        jQuery("#btnScheduleInfo").parent().find("a").removeAttr('style');
        jQuery("#btnChecklist").parent().find("a").attr('style', 'color:black');
        jQuery("#btnScheduleInfo").removeClass('tab-icon-disabled');
        jQuery("#divMeasurementInfo").hide();
        jQuery("#divScheduleInfo").show();
        LoadIframe(jQuery.MeasurementDocumentNamespace.BasePath + "/Preventive/CreateSchedule.aspx?id=" + jQuery.MeasurementDocumentNamespace.BasicParam.SiteID + "&ischecklist=true&maintscheduleid=" + jQuery.MeasurementDocumentNamespace.MaintScheduleID);
    }    
}

function LoadMaintMasterData(masterDataType) {
    var masterDataFilterInfo = {};
    masterDataFilterInfo.MasterDataType = masterDataType;

    jQuery.ajax({
        type: "POST",
        url: jQuery.MeasurementDocumentNamespace.AvailMeasPointPagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetMaintMasterData",
        data: JSON.stringify({ basicParam: jQuery.MeasurementDocumentNamespace.BasicParam, masterDataFilterInfo: masterDataFilterInfo }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        async: false,
        success: function (json) {
            if (json != undefined && json.d != undefined) {
                if (masterDataType == jQuery.MeasurementDocumentNamespace.MaintMasterDataType.Category) {
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

function GetUserWorkGroupInfo() {
    jQuery.ajax({
        type: "POST",
        url: jQuery.MeasurementDocumentNamespace.AvailMeasPointPagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetUserWorkGroups",
        data: JSON.stringify({ basicParam: jQuery.MeasurementDocumentNamespace.BasicParam }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        async: false,
        success: function (json) {
            if (json != undefined && json.d != undefined) {
                measurementDocumentViewModel.WorkGroupList(json.d);
            }
        },
        error: function (request, error) {
            var msg;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    msg = languageResource.resMsg_Error + errorMsg.Message;
                else
                    msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadUserWorkGroup;
            }
            else {
                msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadUserWorkGroup;
            }
            ShowErrorMessage(msg, true);
        }
    });
    jQuery("#ddlWorkGroup").select2({ width: '50%' });
}

function LoadFLocationList() {    
    var fLocationFilterInfo = {};
    fLocationFilterInfo.SiteID = jQuery.MeasurementDocumentNamespace.BasicParam.SiteID;
    fLocationFilterInfo.UserID = jQuery.MeasurementDocumentNamespace.BasicParam.UserID;
    fLocationFilterInfo.FLocationID = 0;
    fLocationFilterInfo.ConsiderFLoc = true;
    jQuery.ajax({
        type: "POST",
        url: jQuery.MeasurementDocumentNamespace.AvailMeasPointPagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetFunctionalLocListForHierarchicalDropDown",
        data: JSON.stringify({ fLocationFilterInfo: fLocationFilterInfo }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        async: false,
        success: function (json) {
            if (json != undefined || json.d != null) {
                measurementDocumentViewModel.FLocationList(json.d);
            }
            else {
                var errorMsg = languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadDataForDropdown;
                ShowErrorMessage(errorMsg, true);
            }
        },
        beforeSend: function () {
            measurementDocumentViewModel.FLocationList.removeAll();
        },
        error: function (request, error) {
            functionalLocationViewModel.LoadErrorMessageClass('red');
            functionalLocationViewModel.LoadErrorMessageVisible(true);
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
                    jQuery.each(returnList, function (i, itemInfo) {
                        var equipmentInfo = {};
                        equipmentInfo.TypeValue = itemInfo.EquipmentID;
                        equipmentInfo.DisplayName = itemInfo.EquipmentName;
                        equipmentInfo.IsSelected = ko.observable(false);
                        measurementDocumentViewModel.AvailEquipmentList.push(equipmentInfo);
                        measurementDocumentViewModel.SelectedEquipmentList.push(equipmentInfo); 
                    });
                }
            },
            beforeSend: function () {
                measurementDocumentViewModel.AvailEquipmentList.removeAll();
                measurementDocumentViewModel.SelectedEquipmentList.removeAll();
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

function SelectEquipmentInfo(equipmentInfo,isAvail) {
    var isSelected = false;

    if (equipmentInfo.IsSelected() == true) {
        equipmentInfo.IsSelected(false);
    }
    else {
        equipmentInfo.IsSelected(true);
        isSelected = true;
    }

    if (isSelected) {
        if (isAvail)
            measurementDocumentViewModel.AvailEquipmentFilterArray.push(equipmentInfo);
        else
            measurementDocumentViewModel.SelectedEquipmentFilterArray.push(equipmentInfo);
    }
    else {
        if (isAvail)
            measurementDocumentViewModel.AvailEquipmentFilterArray.remove(equipmentInfo);
        else
            measurementDocumentViewModel.SelectedEquipmentFilterArray.remove(equipmentInfo);
    }
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
                        jQuery.MeasurementDocumentNamespace.CurrentWorkGroupID = json.d.WorkGroupID;
                    }

                    if (measurementDocumentViewModel.SelectedMeasuringPointList().length > 0) {
                        jQuery("#btnScheduleInfo").parent().find("a").attr('style', 'color:black');
                        jQuery("#btnScheduleInfo").removeClass('tab-icon-disabled');
                    }
                    else {
                        jQuery("#btnScheduleInfo").parent().find("a").attr('style', 'color:grey');
                        jQuery("#btnScheduleInfo").addClass('tab-icon-disabled');
                    }
                    json.d.ScheduleStatus = json.d.ScheduleStatus;
                    if (json.d.ScheduleDetailID > 0) {
                        jQuery.MeasurementDocumentNamespace.ScheduleDetailID = json.d.ScheduleDetailID;
                        if (json.d.ScheduleStatus == jQuery.MeasurementDocumentNamespace.ScheduleStatus.Released) {
                            jQuery("#" + btnActivateSchedule).text(languageResource.resMsg_InActivate);
                            if (jQuery.MeasurementDocumentNamespace.AvailMeasPointPagerData.PageAccessRights.toUpperCase() === "FULL_ACCESS")
                                jQuery("#" + btnActivateSchedule).removeAttr("disabled").removeClass("li-disabled");
                            jQuery("#spnScheduleInProgress").hide();
                            jQuery("#" + btnActivateSchedule).show();
                        }
                        else if (json.d.ScheduleStatus == jQuery.MeasurementDocumentNamespace.ScheduleStatus.Created || json.d.ScheduleStatus == jQuery.MeasurementDocumentNamespace.ScheduleStatus.Cancelled) {
                            jQuery("#" + btnActivateSchedule).text(languageResource.resMsg_Activate);
                            if (jQuery.MeasurementDocumentNamespace.AvailMeasPointPagerData.PageAccessRights.toUpperCase() === "FULL_ACCESS")
                                jQuery("#" + btnActivateSchedule).removeAttr("disabled").removeClass("li-disabled");
                            jQuery("#spnScheduleInProgress").hide();
                            jQuery("#" + btnActivateSchedule).show();
                        }
                        else if (json.d.ScheduleStatus == jQuery.MeasurementDocumentNamespace.ScheduleStatus.Scheduling) {
                            jQuery("#" + btnActivateSchedule).hide();
                            jQuery("#spnScheduleInProgress").show();
                        }
                    }
                    else {
                        jQuery("#" + btnActivateSchedule).attr("disabled", "disabled").addClass("li-disabled");
                        jQuery("#spnScheduleInProgress").hide();
                    }
                    if (measurementDocumentViewModel.SelectedMeasuringPointList().length == 0)
                        jQuery("#" + btnActivateSchedule).attr("disabled", "disabled").addClass("li-disabled");;
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
    filterInfo.WorkGroupID = jQuery.MeasurementDocumentNamespace.SelectedWorkGroupID;

    if (jQuery.MeasurementDocumentNamespace.IsAMSearch) {
        if (measurementDocumentViewModel.FilterAvailLocationList().length > 0) {
            filterInfo.FLocationIDs = "";
            ko.utils.arrayForEach(measurementDocumentViewModel.FilterAvailLocationList(), function (locationID) {
                filterInfo.FLocationIDs = filterInfo.FLocationIDs + locationID + ",";
            });
            filterInfo.FLocationIDs = filterInfo.FLocationIDs.slice(0, -1);
        }
        if (measurementDocumentViewModel.AvailEquipmentFilterArray().length > 0) {
            filterInfo.EquipmentIDs = "";
            ko.utils.arrayForEach(measurementDocumentViewModel.AvailEquipmentFilterArray(), function (equipmentInfo) {
                filterInfo.EquipmentIDs = filterInfo.EquipmentIDs + equipmentInfo.TypeValue + ",";
            });
            filterInfo.EquipmentIDs = filterInfo.EquipmentIDs.slice(0, -1);
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
        if (measurementDocumentViewModel.FilterSelectedLocationList().length > 0) {
            filterInfo.FLocationIDs = "";
            ko.utils.arrayForEach(measurementDocumentViewModel.FilterSelectedLocationList(), function (locationID) {
                filterInfo.FLocationIDs = filterInfo.FLocationIDs + locationID + ",";
            });
            filterInfo.FLocationIDs = filterInfo.FLocationIDs.slice(0, -1);
        }
        if (measurementDocumentViewModel.SelectedEquipmentFilterArray().length > 0) {
            filterInfo.EquipmentIDs = "";
            ko.utils.arrayForEach(measurementDocumentViewModel.SelectedEquipmentFilterArray(), function (equipmentInfo) {
                filterInfo.EquipmentIDs = filterInfo.EquipmentIDs + equipmentInfo.TypeValue + ",";
            });
            filterInfo.EquipmentIDs = filterInfo.EquipmentIDs.slice(0, -1);
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
    measurementDocumentViewModel.FilterAvailLocationList.removeAll();
    jQuery('#ulAvailFLoctionMultiSelect').find('.selectedCheckbox').each(function () {
        measurementDocumentViewModel.FilterAvailLocationList.push(jQuery(this).val());
    });
    if (measurementDocumentViewModel.FilterAvailLocationList().length > 0 || measurementDocumentViewModel.AvailEquipmentFilterArray().length > 0 || (!!jQuery("#ddlAMCategory").val() && jQuery("#ddlAMCategory").val() > 0) || (!!jQuery("#txtAMMeasPoint").val() && jQuery.trim(jQuery("#txtAMMeasPoint").val()).length > 0)) {
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
    measurementDocumentViewModel.FilterAvailLocationList.removeAll();
    measurementDocumentViewModel.AvailEquipmentFilterArray.removeAll();
    AppendElements();
    jQuery("#ulAvailFLoctionMultiSelect li").find('span').removeClass('selectedlist selectedParentlist').find('input').prop('checked', false).removeClass('selectedCheckbox');
    jQuery("#ulAvailFLoctionMultiSelect").closest(".drpdownbody").find(".searchField").val('').trigger('keyup');
    jQuery("#ulAvailEquipmentMultiSelect li").find('span').removeClass('selectedlist selectedParentlist').find('input').prop('checked', false);
    jQuery("#ulAvailEquipmentMultiSelect").closest(".drpdownbody").find(".searchField").val('').trigger('keyup');
    ko.utils.arrayForEach(measurementDocumentViewModel.AvailEquipmentList(), function (equipmentInfo) {
        equipmentInfo.IsSelected(false);
    });

    jQuery("#ddlAMCategory").val('');
    jQuery("#ddlAMCategory").select2({ width: '50%' });
    jQuery("#txtAMMeasPoint").val('');
    jQuery.MeasurementDocumentNamespace.IsAMSearch = false;
    jQuery("#btnShowAllAvailMeasuringPoints").hide();
    LoadAvailableMeasuringPoints(jQuery.MeasurementDocumentNamespace.AvailMeasPointPagerData);
    ResetDropdownCss();
}

function SearchSelectedMeasuringPoints() {
    jQuery("#spnSelectedMeasuringPointsSearchError").text('');
    measurementDocumentViewModel.FilterSelectedLocationList.removeAll();
    jQuery('#ulSelectFLoctionMultiSelect').find('.selectedCheckbox').each(function () {
        measurementDocumentViewModel.FilterSelectedLocationList.push(jQuery(this).val());
    });
    if (measurementDocumentViewModel.FilterSelectedLocationList().length > 0 || measurementDocumentViewModel.SelectedEquipmentFilterArray().length > 0 || (!!jQuery("#ddlSMCategory").val() && jQuery("#ddlSMCategory").val() > 0) || (!!jQuery("#txtSMMeasPoint").val() && jQuery.trim(jQuery("#txtSMMeasPoint").val()).length > 0)) {
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
    measurementDocumentViewModel.FilterSelectedLocationList.removeAll();
    measurementDocumentViewModel.SelectedEquipmentFilterArray.removeAll();
    AppendElements();
    jQuery("#ulSelectFLoctionMultiSelect li").find('span').removeClass('selectedlist selectedParentlist').find('input').prop('checked', false).removeClass('selectedCheckbox');
    jQuery("#ulSelectFLoctionMultiSelect").closest(".drpdownbody").find(".searchField").val('').trigger('keyup');
    jQuery("#ulSelectEquipmentMultiSelect li").find('span').removeClass('selectedlist selectedParentlist').find('input').prop('checked', false);
    jQuery("#ulSelectEquipmentMultiSelect").closest(".drpdownbody").find(".searchField").val('').trigger('keyup');
    ko.utils.arrayForEach(measurementDocumentViewModel.SelectedEquipmentList(), function (equipmentInfo) {
        equipmentInfo.IsSelected(false);
    });

    jQuery("#ddlSMCategory").val('');
    jQuery("#ddlSMCategory").select2({ width: '50%' });
    jQuery("#txtSMMeasPoint").val('');
    jQuery.MeasurementDocumentNamespace.IsSMSearch = false;
    jQuery("#btnShowAllSelectedMeasuringPoints").hide();
    LoadSelectedMeasuringPoints();
    ResetDropdownCss();
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
    if (jQuery.MeasurementDocumentNamespace.CurrentWorkGroupID == jQuery.MeasurementDocumentNamespace.SelectedWorkGroupID) {
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
                        jQuery("#btnScheduleInfo").parent().find("a").attr('style', 'color:black');
                        jQuery(".tab-icon-disabled").removeClass('tab-icon-disabled');
                        if (jQuery.MeasurementDocumentNamespace.ScheduleDetailID > 0) {
                            var btnActivateSchedule = jQuery.MeasurementDocumentNamespace.AvailMeasPointPagerData.LoadControlID.replace("btnAdd", "btnActivateSchedule");
                            if (jQuery.MeasurementDocumentNamespace.AvailMeasPointPagerData.PageAccessRights.toUpperCase() === "FULL_ACCESS")
                                jQuery("#" + btnActivateSchedule).removeAttr("disabled").removeClass("li-disabled");
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
    else {
        ShowErrorMessage(languageResource.resMsg_UpdateInfoBeforeSelectingMP, false);
    }
}

function AddUpdateMeasurementDocument() {
    jQuery("#txtMeasDocName").removeClass('border-red');
    jQuery(".select2-selection--single").removeClass('border-red');
    jQuery("#spnAddUpdateError").addClass('text-danger').removeClass('text-info');
    jQuery("#spnAddUpdateError").html('');
    var isValid = true;
    var message = '';
    if (jQuery.trim(jQuery("#txtMeasDocName").val()).length == 0) {
        isValid = false;
        message = languageResource.resMsg_EnterRequiredField;
        jQuery("#txtMeasDocName").addClass('border-red');
    }
    if (jQuery("#ddlWorkGroup").val() == undefined || jQuery("#ddlWorkGroup").val() == null || jQuery("#ddlWorkGroup").val() == 0 || jQuery.trim(jQuery("#ddlWorkGroup").val()).length==0) {
        if (isValid) {
            isValid = false;
            message = message + languageResource.resMsg_EnterRequiredField;
        }
        jQuery("#ddlWorkGroup").next().find(".select2-selection--single").addClass('border-red');
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
                    var maintenanceIdentityInfo = json.d;
                    //if (result == -1) {//Already exist
                    //    jQuery("#spnAddUpdateError").html(languageResource.resMsg_AlreadyExist);
                   // }
                    //else
                        if (maintenanceIdentityInfo.WorkOrderID == -2) {
                        //work order is started, update is not possible
                        jQuery("#spnAddUpdateError").html(languageResource.resMsg_WorkOrderStartedUpdateNotPossible);
                    }
                        else if (maintenanceIdentityInfo.MaintScheduleID == jQuery.MeasurementDocumentNamespace.MaintScheduleID) {
                        //successfully updated
                        jQuery.MeasurementDocumentNamespace.NewMaintScheduleID = jQuery.MeasurementDocumentNamespace.MaintScheduleID;
                        jQuery("#spnAddUpdateError").removeClass('text-danger').addClass('text-info');
                        jQuery("#spnAddUpdateError").html(languageResource.resMsg_SuccessfullyUpdatedDocInfo);
                        jQuery.MeasurementDocumentNamespace.CurrentWorkGroupID = jQuery("#ddlWorkGroup").val();
                    }
                        else if (maintenanceIdentityInfo.MaintScheduleID > 0) {
                        //successfully inserted
                            jQuery.MeasurementDocumentNamespace.MaintScheduleID = maintenanceIdentityInfo.MaintScheduleID;
                        jQuery("#" + jQuery.MeasurementDocumentNamespace.AvailMeasPointPagerData.LoadControlID).val(languageResource.resMsg_Update);
                        measurementDocumentViewModel.IsMeasPointSelectable(true);
                        jQuery("#spnAddUpdateError").removeClass('text-danger').addClass('text-info');
                        jQuery("#spnAddUpdateError").html(languageResource.resMsg_SuccessfullyInsertedDocInfo);
                        jQuery.MeasurementDocumentNamespace.CurrentWorkGroupID = jQuery("#ddlWorkGroup").val();
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
                jQuery("#txtMeasDocName").removeClass('border-red');
                jQuery(".select2-selection--single").removeClass('border-red');
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
                    jQuery("#" + btnActivateSchedule).attr("disabled", "disabled").addClass("li-disabled");
                    jQuery("#btnScheduleInfo").parent().find("a").attr('style', 'color:grey');
                    jQuery("#btnScheduleInfo").addClass('tab-icon-disabled');
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
            jQuery('#divTabInfo a').attr('style', 'color:black');
            LoadMeasurementDocument(jQuery.MeasurementDocumentNamespace.PagesList.MeasurementDocument);
        }
        else {
            //enable below buttons only if maintenance information exists
            if (jQuery.MeasurementDocumentNamespace.MaintScheduleID > 0 && measurementDocumentViewModel.SelectedMeasuringPointList().length > 0) {
                jQuery('#divTabInfo a').attr('style', 'color:black');
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

function ReloadMeasuringPoints() {
    if (jQuery("#ddlWorkGroup").val() != jQuery.MeasurementDocumentNamespace.SelectedWorkGroupID) {
        if (jQuery.MeasurementDocumentNamespace.SelectedWorkGroupID == 0) {
            jQuery.MeasurementDocumentNamespace.SelectedWorkGroupID = jQuery.trim(jQuery("#ddlWorkGroup").val()).length == 0 ? 0 : jQuery("#ddlWorkGroup").val();
            LoadAvailableMeasuringPoints(jQuery.MeasurementDocumentNamespace.AvailMeasPointPagerData);
        }
        else {
            if (measurementDocumentViewModel.SelectedMeasuringPointList().length > 0) {
                jQuery("#ddlWorkGroup").val(jQuery.MeasurementDocumentNamespace.SelectedWorkGroupID);
                jQuery("#ddlWorkGroup").trigger('change');
                ShowErrorMessage(languageResource.resMsg_RemoveSelectedMeasuringPoints, false);
            }
            else {
                jQuery.MeasurementDocumentNamespace.SelectedWorkGroupID = jQuery.trim(jQuery("#ddlWorkGroup").val()).length == 0 ? 0 : jQuery("#ddlWorkGroup").val();
                LoadAvailableMeasuringPoints(jQuery.MeasurementDocumentNamespace.AvailMeasPointPagerData);
            }
        }
    }
}
