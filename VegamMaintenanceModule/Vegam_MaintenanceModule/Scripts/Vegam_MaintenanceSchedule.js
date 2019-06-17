jQuery.MaintenanceScheduleNamespace = jQuery.MaintenanceScheduleNamespace || {};
jQuery.MaintenanceScheduleNamespace.BasicParam = jQuery.MaintenanceScheduleNamespace.BasicParam || {};
jQuery.MaintenanceScheduleNamespace.MaintTypePagerData = jQuery.MaintenanceScheduleNamespace.MaintTypePagerData || {};
jQuery.MaintenanceScheduleNamespace.BasePath = "";
jQuery.MaintenanceScheduleNamespace.ScheduleAccess = "";
jQuery.MaintenanceScheduleNamespace.PagesList = { 'Maintenance': 'M', 'WorkInstruction': 'W', 'SpareParts': 'P', 'Attachments': 'A', 'Schedule': 'S' };
jQuery.MaintenanceScheduleNamespace.ScheduleTypeList = { 'Schedule': 'S', 'WorkOrder': 'W', 'Inspection': 'I' };
jQuery.MaintenanceScheduleNamespace.ScheduleStatus = { 'Created': 'CREATED', 'Released': 'RELEASED', 'Cancelled': 'CANCELLED', 'Scheduling': 'SCHEDULING' };
jQuery.MaintenanceScheduleNamespace.ScheduleType = "";
jQuery.MaintenanceScheduleNamespace.DatePickerFormat = "";
jQuery.MaintenanceScheduleNamespace.DefaultImage = "";
jQuery.MaintenanceScheduleNamespace.MaintScheduleID = 0;
jQuery.MaintenanceScheduleNamespace.IsMaintTypeSearch = false;
jQuery.MaintenanceScheduleNamespace.NewMaintScheduleID = 0;
jQuery.MaintenanceScheduleNamespace.MaintMasterDataType = { MaintenanceType: "MAINT_TYPE", WorkGroup: "WORKGROUP", TaskGroupType: "TASKGRP_TYPE", EquipmentType: "TYPE" };
jQuery.MaintenanceScheduleNamespace.CurrentPage = jQuery.MaintenanceScheduleNamespace.PagesList.Maintenance;
jQuery.MaintenanceScheduleNamespace.FLocationID = 0;
jQuery.MaintenanceScheduleNamespace.EquipmentID = 0;
jQuery.MaintenanceScheduleNamespace.TaskGroupInfo = {};
jQuery.MaintenanceScheduleNamespace.IsSelectedPPE = true;
jQuery.MaintenanceScheduleNamespace.UnitOfTime = { "Hours": 'H', "Minutes": 'M', "Seconds": 'S' };
jQuery.MaintenanceScheduleNamespace.ParameterType = { "SingleLineText": 'S', "MultiLineText": 'M', "Numeric": 'N', "Decimal": "D", "SelectionCode": "C" };
jQuery.MaintenanceScheduleNamespace.DocumentType = { "DOCUMENT": "D", "IMAGE": "I", "VIDEO": "V", "NONE": "N", "SDOCUMENT": "S" };
jQuery.MaintenanceScheduleNamespace.MasterDataType = { "Manufacturer": "MANUFACTURER", "EquipmentType": "TYPE", "EquipmentClass": "CLASS", "MeasuringPointCategory": "MP_CATEGORY", "MPSelectionGroupCode": "GROUPCODE", "TaskGroupType": "TASKGRP_TYPE" };
jQuery.MaintenanceScheduleNamespace.ImagePath = "";
jQuery.MaintenanceScheduleNamespace.UploaderPath = "";
jQuery.MaintenanceScheduleNamespace.TaskGroupIdentifier = 0;
jQuery.MaintenanceScheduleNamespace.TaskGroupID = 0;
jQuery.MaintenanceScheduleNamespace.TaskID = 0;
jQuery.MaintenanceScheduleNamespace.TaskGroupVersionNumber = 0;
jQuery.MaintenanceScheduleNamespace.IsEquipmentSearch = false;
jQuery.MaintenanceScheduleNamespace.EquipmentPagerData = jQuery.MaintenanceScheduleNamespace.EquipmentPagerData || {};
jQuery.MaintenanceScheduleNamespace.NotificationID = 0;
jQuery.MaintenanceScheduleNamespace.WorkGroupInfo = jQuery.MaintenanceScheduleNamespace.WorkGroupInfo || {};
jQuery.MaintenanceScheduleNamespace.WorkOrderID = "";
jQuery.MaintenanceScheduleNamespace.DocumentInfoType = { 'MaintenanceAttachment': 'A' };
jQuery.MaintenanceScheduleNamespace.WorkOrderStatusInfo = { Created: "CREATED", Scheduled: "SCHEDULED", Inprogress: "INPROGRESS", Completed: "COMPLETED", Overdue: "OVERDUE", Cancelled: "CANCELLED", Closed: "CLOSED" };
jQuery.MaintenanceScheduleNamespace.IsFromManageNotify = true;
jQuery.MaintenanceScheduleNamespace.ReleaseAccess = "";

var maintenanceScheduleViewModel = {
    MaintenanceTypeList: ko.observableArray([]),
    MaintenancePriorityList: ko.observableArray([]),
    WorkGroupTypeList: ko.observableArray([]),
    ModelErrorVisible: ko.observable(false),
    ModelErrorMsg: ko.observable(''),
    ModelErrorCss: ko.observable(''),
    IsDirectWorkOrder: ko.observable(false),
    ScheduleDate: ko.observable(),
    ScheduleTime: ko.observable(),
    ShowActivateSchedule: ko.observable(true),
    SelectedLocationOrEquipment: ko.observable(''),
    IsDefaultImage: ko.observable(true),
    IsCanceledWorkOrder: ko.observable(false),
    IsNotificationDetails: ko.observable(false),
    NotificationDetails: ko.observable(),
    IsUserHasSavingPermission: ko.observable(false),
    WorkOrderNumber: ko.observable('')
};

var maintenanceTypeUpdateViewModel = {
    LoadErrorMessageVisible: ko.observable(false),
    LoadErrorMessage: ko.observable(''),
    LoadErrorMessageClass: ko.observable(''),
    MaintTypePagerData: ko.observable(''),
    DefaultMaintenanceTypesArray: ko.observableArray([]),
    HasMaintTypeAccess: false,
    HasDeleteMaintTypeAccess: false
}

var workInstructionViewModel = {
    ModelErrorVisible: ko.observable(false),
    ModelErrorMsg: ko.observable(''),
    ModelErrorCss: ko.observable(''),
    TaskInfoList: ko.observableArray([]),
    IsImportTaskGroup: ko.observable(false),
    TaskGroupList: ko.observableArray([]),
    SelectedTaskGroupInfo: ko.observable(),
    ShowCompleteTaskDetails: ko.observable(false),
    TaskGroupTypeList: ko.observableArray([]),

    TaskName: ko.observable(''),
    EstimatedTime: ko.observable(0),
    UnitOfTimeList: ko.observableArray([]),
    UnitOfTimeSelectedValue: ko.observable(''),
    TaskDescription: ko.observable(''),
    SafetyInstruction: ko.observable(''),

    IsUserHasSavingPermission: ko.observable(false),
    HasDeleteAccess: ko.observable(false),
    IsProgressing: ko.observable(false),

    TaskPPEList: ko.observableArray([]),
    IsTaskPPElistEmpty: ko.observable(true),

    TaskToolsList: ko.observableArray([]),
    IsTaskToolslistEmpty: ko.observable(true),

    DocumentOrImageList: ko.observableArray([]),
    DefaultUploadIconPath: ko.observable(''),

    IsEnabledEnterRemark: ko.observable(false),
    IsEnabledEnterRemarkMandatory: ko.observable(false),

    IsEnterRemarkVisible: ko.observable(false),
    IsEnabledTakePicture: ko.observable(false),
    IsEnabledTakePictureMandatory: ko.observable(false),
    IsTakePictureVisible: ko.observable(false),

    ParameterInfoList: ko.observableArray([]),
    ParameterTypeList: ko.observableArray([]),
    SelectionGroupList: ko.observableArray([]),

    ModelErrorMsg: ko.observable(''),
    ModelErrorCss: ko.observable(''),
    IsSOPImportAccess: ko.observable(false),

    ParameterTypeChanged: function (obj, event) {
        if (obj.ParameterType() === jQuery.MaintenanceScheduleNamespace.ParameterType.SelectionCode) {
            obj.isSelectionEnabled(true);
        }
        else {
            obj.isSelectionEnabled(false);
        }
    }

}

var instructionSelectionViewModel = {
    PopupModelName: ko.observable(''),
    InstructionSelectionList: ko.observableArray([]),
    SelectedInstrution: ko.observableArray([]),
    IsPopupProgressing: ko.observable(false),
    IsEmptyInstructionlist: ko.observable(false),
    InstructionSeleErrorMsg: ko.observable('')
};

var newParameterRow = function () {
    return {
        ParameterID: ko.observable(0),
        ParameterName: ko.observable(''),
        IsParameterMandatory: ko.observable(false),
        ParameterType: ko.observable(''),
        SelectedParameterType: ko.observable(''),
        SelectionCode: ko.observable(''),
        SelectedSelectionGroup: ko.observable(''),
        isSelectionEnabled: ko.observable(false),
        isDeleteEnabled: ko.observable(false)
    }
}

workInstructionViewModel.ShowCompleteTaskDetails.subscribe(function (newValue) {
    if (newValue) {
        jQuery("#btnShowCompleteTaskDetails").text(languageResource.resMsg_HideCompleteTaskDetails);
    }
    else {
        jQuery("#btnShowCompleteTaskDetails").text(languageResource.resMsg_ShowCompleteTaskDetails);
    }
});

var locationEquipmentViewModel = {
    FLocationOrEquipmentList: ko.observableArray([]),
    IsEquipemntSelected: ko.observable(true),
    LoadErrorMessageVisible: ko.observable(false),
    LoadErrorMessage: ko.observable(''),
    LoadErrorMessageClass: ko.observable(''),
    PagerData: ko.observable(''),
    EquipmentTypeArray: ko.observableArray([]),
    SelectedCategoryFilterArray: ko.observableArray([]),
};

var sparePartsViewModel = {
    SparePartInfoList: ko.observableArray([]),
    SparePartMaterialList: ko.observableArray([]),
    IsUserHasSavingPermission: ko.observable(false),
    HasDeleteAccess: ko.observable(false),
    ModelErrorVisible: ko.observable(false),
    ModelErrorMsg: ko.observable(''),
    ModelErrorCss: ko.observable('')
};

var attachmentViewModel = {
    AttachmentList: ko.observableArray([]),
    DefaultUploadIconPath: ko.observable(),
    IsUserHasSavingPermission: ko.observable(false),
    HasDeleteAccess: ko.observable(false),
    ModelErrorVisible: ko.observable(false),
    ModelErrorMsg: ko.observable(''),
    ModelErrorCss: ko.observable('')
};

function InitMaintenanceScheduleInfo(maintTypePagerData, equipmentPagerData, basepath, datePickerFormat, plantDateFormat, plantTimeFormat, defaultImage, scheduleType, maintScheduleID, imagePath, taskDocumentPath, uploaderPath, scheduleAccess, maintScheduleAttachmentPath, notificationID, workOrderID, isFromManageNotify, maintReleaseAccess) {
    jQuery.MaintenanceScheduleNamespace.MaintTypePagerData = maintTypePagerData;
    jQuery.MaintenanceScheduleNamespace.EquipmentPagerData = equipmentPagerData;
    jQuery.MaintenanceScheduleNamespace.BasicParam.SiteID = maintTypePagerData.SiteID;
    jQuery.MaintenanceScheduleNamespace.BasicParam.UserID = maintTypePagerData.UserID;
    jQuery.MaintenanceScheduleNamespace.ScheduleAccess = scheduleAccess;
    jQuery.MaintenanceScheduleNamespace.BasePath = basepath;
    jQuery.MaintenanceScheduleNamespace.DatePickerFormat = datePickerFormat;
    jQuery.MaintenanceScheduleNamespace.PlantDateFormat = plantDateFormat;
    jQuery.MaintenanceScheduleNamespace.PlantTimeFormat = plantTimeFormat;
    jQuery.MaintenanceScheduleNamespace.DefaultImage = defaultImage;
    jQuery.MaintenanceScheduleNamespace.ScheduleType = scheduleType;
    jQuery.MaintenanceScheduleNamespace.MaintScheduleID = maintScheduleID;
    jQuery.MaintenanceScheduleNamespace.ImagePath = imagePath;
    jQuery.MaintenanceScheduleNamespace.TaskDocumentPath = taskDocumentPath;
    jQuery.MaintenanceScheduleNamespace.UploaderPath = uploaderPath;
    jQuery.MaintenanceScheduleNamespace.MaintScheduleAttachmentPath = maintScheduleAttachmentPath;
    jQuery("#imgFLocationOrEquipmentImage").attr("src", jQuery.MaintenanceScheduleNamespace.DefaultImage);
    jQuery.MaintenanceScheduleNamespace.NotificationID = notificationID;
    jQuery.MaintenanceScheduleNamespace.WorkOrderID = workOrderID;
    jQuery.MaintenanceScheduleNamespace.IsFromManageNotify = isFromManageNotify.toLowerCase() == "true";
    jQuery.MaintenanceScheduleNamespace.ReleaseAccess = maintReleaseAccess;

    if (workOrderID != "") {
        maintenanceScheduleViewModel.WorkOrderNumber(workOrderID);
    }

    if (jQuery.MaintenanceScheduleNamespace.ScheduleAccess.toLowerCase() === "full_access") {
        workInstructionViewModel.HasDeleteAccess(true);
        workInstructionViewModel.IsUserHasSavingPermission(true);
        workInstructionViewModel.IsSOPImportAccess(true);
        sparePartsViewModel.HasDeleteAccess(true);
        sparePartsViewModel.IsUserHasSavingPermission(true);
        attachmentViewModel.HasDeleteAccess(true);
        attachmentViewModel.IsUserHasSavingPermission(true);
        maintenanceScheduleViewModel.IsUserHasSavingPermission(true);
    }
    else if (jQuery.MaintenanceScheduleNamespace.ScheduleAccess.toLowerCase() === "edit_only") {
        workInstructionViewModel.IsUserHasSavingPermission(true);
        workInstructionViewModel.IsSOPImportAccess(true);
        sparePartsViewModel.IsUserHasSavingPermission(true);
        sparePartsViewModel.HasDeleteAccess(true);
        attachmentViewModel.IsUserHasSavingPermission(true);
        maintenanceScheduleViewModel.IsUserHasSavingPermission(true);
    }
    if (jQuery.MaintenanceScheduleNamespace.ReleaseAccess.toLowerCase() !== "full_access") {
        var btnActivateSchedule = jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.LoadControlID.replace("btnSaveMaintInfo", "btnActivateSchedule");
        jQuery("#" + btnActivateSchedule).addClass("li-disabled");
    }

    workInstructionViewModel.DefaultUploadIconPath(jQuery.MaintenanceScheduleNamespace.ImagePath + '/Styles/Images/upload_icon.png');
    attachmentViewModel.DefaultUploadIconPath(jQuery.MaintenanceScheduleNamespace.ImagePath + '/Styles/Images/upload_icon.png');

    ko.applyBindings(maintenanceTypeUpdateViewModel, document.getElementById("divAddMaintenanceTypeModal"));
    ko.applyBindings(maintenanceScheduleViewModel, document.getElementById("divMaintenanceInfo"));
    ko.applyBindings(workInstructionViewModel, document.getElementById("divWorkInstructionInfo"));
    ko.applyBindings(instructionSelectionViewModel, document.getElementById("divSelectInstructionModal"));
    ko.applyBindings(locationEquipmentViewModel, document.getElementById("divSelectEquipmentFLocationModal"));
    ko.applyBindings(sparePartsViewModel, document.getElementById("divSparePartInfo"));
    ko.applyBindings(attachmentViewModel, document.getElementById("divAttachmentInfo"));

    if (jQuery.MaintenanceScheduleNamespace.MaintScheduleID == 0) {
        var btnActivateSchedule = jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.LoadControlID.replace("btnSaveMaintInfo", "btnActivateSchedule");
        jQuery("#" + btnActivateSchedule).attr("disabled", "disabled").addClass("li-disabled");
    }
    else {
        jQuery('#divTabInfo a').attr('style', 'color:black');
        jQuery(".tab-icon-disabled").removeClass('tab-icon-disabled');
    }

    if (scheduleType == jQuery.MaintenanceScheduleNamespace.ScheduleTypeList.WorkOrder) {
        maintenanceScheduleViewModel.IsDirectWorkOrder(true);
        jQuery("#divScheduleTab").css("visibility", "hidden");
        var btnActivateSchedule = jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.LoadControlID.replace("btnSaveMaintInfo", "btnActivateSchedule");
        jQuery("#" + btnActivateSchedule).text(languageResource.resMsg_ReleaseWorkOrder);
    }

    ManageSiteMapUrl();
    GetEnumTypeInfo("MAINT_PRIORITY_TYPE");
    LoadMaintMasterDataForDropDown();
    GetUserWorkGroupInfo();
    initiateDatePicker();
    bindDatePickerAndSelectDefaultDate();
    LoadUnitOfTime();
    LoadParameterType();
    LoadMasterDataDropDown();
    LoadSparePartMaterialList();
    LoadMaintenanceSchedulePage(jQuery.MaintenanceScheduleNamespace.PagesList.Maintenance);
}

function LoadUnitOfTime() {
    workInstructionViewModel.UnitOfTimeList.removeAll();
    jQuery.each(jQuery.MaintenanceScheduleNamespace.UnitOfTime, function (value, key) {
        var unitOfTimeObj = {};
        unitOfTimeObj.TypeValue = key;
        unitOfTimeObj.DisplayName = value;
        workInstructionViewModel.UnitOfTimeList.push(unitOfTimeObj);
    });
}

function LoadParameterType() {
    workInstructionViewModel.ParameterTypeList.removeAll();
    jQuery.each(jQuery.MaintenanceScheduleNamespace.ParameterType, function (value, key) {
        var parameterType = {};
        parameterType.TypeValue = key;
        parameterType.DisplayName = value;
        workInstructionViewModel.ParameterTypeList.push(parameterType);
    });
}

function LoadMasterDataDropDown() {
    var masterDataInfo = {};
    masterDataInfo.TypeValue = -1;
    masterDataInfo.DisplayName = languageResource.resMsg_PleaseSelect;
    workInstructionViewModel.SelectionGroupList.removeAll();
    workInstructionViewModel.SelectionGroupList.push(masterDataInfo);



    var masterDataDropDownListFilterInfo = {}
    masterDataDropDownListFilterInfo.MasterDataTypeList = [];
    masterDataDropDownListFilterInfo.MasterDataTypeList.push(jQuery.MaintenanceScheduleNamespace.MasterDataType.MPSelectionGroupCode);

    jQuery.ajax({
        type: "POST",
        url: jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetAllMaintMasterDropDownDataInfo",
        data: JSON.stringify({ basicParam: jQuery.MaintenanceScheduleNamespace.BasicParam, masterDataDropDownListFilterInfo: masterDataDropDownListFilterInfo }),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (data) {
            if (data.d != undefined) {
                var masterDataDropDownList = data.d;
                jQuery.each(masterDataDropDownList.MPGroupList, function (i, object) {
                    workInstructionViewModel.SelectionGroupList.push(object);
                });
            }
        },
        beforeSend: function () {
            workInstructionViewModel.IsProgressing(true);
        },
        complete: function () {
            workInstructionViewModel.IsProgressing(false);
        },
        error: function (request, error) {
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                    ShowMessage(errorMsg.Message, "error");
                else {
                    ShowMessage(languageResource.resMsg_FailedToLoadDropdown, "error");
                }
            }
            else {
                ShowMessage(languageResource.resMsg_FailedToLoadDropdown, "error");

            }
        }
    });
}

function LoadMaintenanceSchedulePage(tabType) {
    jQuery("#divMaintenanceInfo").removeClass('active in');
    jQuery("#divWorkInstructionInfo").removeClass('active in');
    jQuery("#divScheduleInfo").removeClass('active in');
    jQuery("#divSparePartInfo").removeClass('active in');
    jQuery("#divAttachmentInfo").removeClass('active in');
    jQuery('.btn-circle.btn-info').removeClass('btn-info').addClass('btn-default');
    jQuery.MaintenanceScheduleNamespace.CurrentPage = tabType;

    if (tabType == jQuery.MaintenanceScheduleNamespace.PagesList.Maintenance) {
        jQuery("#divMaintenanceInfo").addClass('active in');
        jQuery("#btnMaintInfo").addClass('btn-info').removeClass('btn-default').blur();
        jQuery("#btnMaintInfo").parent().find("a").removeAttr('style');
        if (jQuery.MaintenanceScheduleNamespace.MaintScheduleID > 0 || jQuery.MaintenanceScheduleNamespace.NotificationID > 0)
            LoadMaintenanceInfoForEdit();
        if (jQuery.MaintenanceScheduleNamespace.NotificationID > 0)
            LoadNotificationDetails();
    }
    else if (tabType == jQuery.MaintenanceScheduleNamespace.PagesList.WorkInstruction) {
        jQuery("#divWorkInstructionInfo").addClass('active in');
        jQuery("#btnWorkInstruction").addClass('btn-info').removeClass('btn-default').blur();
        jQuery("#btnWorkInstruction").parent().find("a").removeAttr('style');
        LoadWorkInsructionInfo();
    }
    else if (tabType == jQuery.MaintenanceScheduleNamespace.PagesList.Schedule) {
        jQuery("#divScheduleInfo").addClass('active in');
        jQuery("#btnScheduleInfo").addClass('btn-info').removeClass('btn-default').blur();
        jQuery("#btnScheduleInfo").parent().find("a").removeAttr('style');
        LoadIframe(jQuery.MaintenanceScheduleNamespace.BasePath + "/Preventive/CreateSchedule.aspx?id=" + jQuery.MaintenanceScheduleNamespace.BasicParam.SiteID + "&ismaintenance=true&maintscheduleid=" + jQuery.MaintenanceScheduleNamespace.MaintScheduleID);
    }
    else if (tabType == jQuery.MaintenanceScheduleNamespace.PagesList.SpareParts) {
        jQuery("#divSparePartInfo").addClass('active in');
        jQuery("#btnSpareParts").addClass('btn-info').removeClass('btn-default').blur();
        jQuery("#btnSpareParts").parent().find("a").removeAttr('style');
        LoadMaintSparePartsInformation();
    }
    else if (tabType == jQuery.MaintenanceScheduleNamespace.PagesList.Attachments) {
        jQuery("#divAttachmentInfo").addClass('active in');
        jQuery("#btnAttachments").addClass('btn-info').removeClass('btn-default').blur();
        jQuery("#btnAttachments").parent().find("a").removeAttr('style');
        LoadAttachmentInfo();
    }
}

function LoadMaintMasterDataForDropDown() {
    LoadMaintMasterData(jQuery.MaintenanceScheduleNamespace.MaintMasterDataType.MaintenanceType);
    LoadMaintMasterData(jQuery.MaintenanceScheduleNamespace.MaintMasterDataType.EquipmentType);
    jQuery("#ddlSelectMaintenanceType").select2({ width: '50%' });
}

function LoadMaintMasterData(masterDataType) {
    var masterDataFilterInfo = {};
    masterDataFilterInfo.MasterDataType = masterDataType;

    jQuery.ajax({
        type: "POST",
        url: jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetMaintMasterData",
        data: JSON.stringify({ basicParam: jQuery.MaintenanceScheduleNamespace.BasicParam, masterDataFilterInfo: masterDataFilterInfo }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        async: false,
        success: function (json) {
            if (json != undefined && json.d != undefined) {
                if (masterDataType == jQuery.MaintenanceScheduleNamespace.MaintMasterDataType.MaintenanceType) {
                    maintenanceScheduleViewModel.MaintenanceTypeList([]);
                    ko.utils.arrayForEach(json.d.MasterDataInfoList, function (item) {
                        item.MasterDataName = item.MasterDataName + (item.Description.length == 0 ? "" : " - " + item.Description);
                        maintenanceScheduleViewModel.MaintenanceTypeList.push(item);
                    });
                }
                else if (masterDataType == jQuery.MaintenanceScheduleNamespace.MaintMasterDataType.TaskGroupType)
                    workInstructionViewModel.TaskGroupTypeList(json.d.MasterDataInfoList);
                else if (masterDataType == jQuery.MaintenanceScheduleNamespace.MaintMasterDataType.EquipmentType) {
                    var masterDataList = json.d.MasterDataInfoList
                    jQuery.each(masterDataList, function (i, itemInfo) {
                        var categoryInfo = {};
                        categoryInfo.TypeValue = itemInfo.MasterDataID;
                        categoryInfo.DisplayName = itemInfo.MasterDataName;
                        categoryInfo.IsSelected = ko.observable(false);
                        locationEquipmentViewModel.EquipmentTypeArray.push(categoryInfo);
                    });
                }
            }
        },
        error: function (request, error) {
            var errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadDataForDropdown;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    errorMessage = languageResource.resMsg_Error + errorMsg.Message;
            }
            ShowErrorMessagePopUp(errorMessage, true);
        }
    });
}

function GetUserWorkGroupInfo() {
    jQuery.ajax({
        type: "POST",
        url: jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetUserWorkGroups",
        data: JSON.stringify({ basicParam: jQuery.MaintenanceScheduleNamespace.BasicParam }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        async: false,
        success: function (json) {
            if (json != undefined && json.d != undefined) {
                jQuery.MaintenanceScheduleNamespace.WorkGroupInfo = json.d;
                if (jQuery.MaintenanceScheduleNamespace.MaintScheduleID == 0)
                    maintenanceScheduleViewModel.WorkGroupTypeList(jQuery.MaintenanceScheduleNamespace.WorkGroupInfo);
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
            ShowErrorMessagePopUp(msg, true);
        }
    });
    jQuery("#ddlSelectWorkGroupType").select2({ width: '50%' });
}

function LoadEquipmentOrLocationWorkGroup() {
    var filterInfo = {};
    filterInfo.UserID = jQuery.MaintenanceScheduleNamespace.BasicParam.UserID;
    filterInfo.SiteID = jQuery.MaintenanceScheduleNamespace.BasicParam.SiteID;
    if (jQuery.MaintenanceScheduleNamespace.EquipmentID > 0) {
        filterInfo.ReferenceID = jQuery.MaintenanceScheduleNamespace.EquipmentID;
        filterInfo.ReferenceType = "EQUIPMENT";
    }
    if (jQuery.MaintenanceScheduleNamespace.FLocationID > 0) {
        filterInfo.ReferenceID = jQuery.MaintenanceScheduleNamespace.FLocationID;
        filterInfo.ReferenceType = "LOCATION";
    }
    jQuery.ajax({
        type: "POST",
        url: jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetWorkGroupOfEquipemntOrLocation",
        data: JSON.stringify({ filterInfo: filterInfo }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        async: false,
        success: function (json) {
            if (json != undefined && json.d != undefined && json.d.length > 0) {
                maintenanceScheduleViewModel.WorkGroupTypeList(json.d);
            }
            else {
                maintenanceScheduleViewModel.WorkGroupTypeList(jQuery.MaintenanceScheduleNamespace.WorkGroupInfo);
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
            ShowErrorMessagePopUp(msg, true);
        }
    });
    jQuery("#ddlSelectWorkGroupType").select2({ width: '50%' });
}

function initiateDatePicker() {
    jQuery.datepicker.setDefaults({
        closeText: calendarLanguageResource.resMsg_CloseText,
        prevText: calendarLanguageResource.resMsg_PrevText,
        nextText: calendarLanguageResource.resMsg_NextText,
        currentText: calendarLanguageResource.resMsg_CurrentText,
        monthNames: calendarLanguageResource.resMsg_MonthNames,
        monthNamesShort: calendarLanguageResource.resMsg_MonthNamesShort,
        dayNames: calendarLanguageResource.resMsg_DayNames,
        dayNamesShort: calendarLanguageResource.resMsg_DayNamesShort,
        dayNamesMin: calendarLanguageResource.resMsg_DayNamesMin,
        weekHeader: calendarLanguageResource.resMsg_WeekHeader,
        firstDay: calendarLanguageResource.resMsg_FirstDay,
        yearSuffix: '',
        changeMonth: true,
        changeYear: true,
        dateFormat: jQuery.MaintenanceScheduleNamespace.DatePickerFormat
    });
}

function GetSiteCurrentDateTime() {
    var currentDateTime;
    jQuery.ajax({
        type: "POST",
        url: jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetSiteCurrentDateTime",
        data: JSON.stringify({ siteID: jQuery.MaintenanceScheduleNamespace.BasicParam.SiteID }),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (data) {
            if (data.d !== null) {
                currentDateTime = data.d;
            }
            else {
                ShowErrorMessagePopUp(languageResource.resMsg_FailedToLoadCurrentSiteDateTime, true);
            }
        },
        error: function (request, error) {
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                    ShowErrorMessagePopUp(languageResource.resMsg_Error + errorMsg.Message, true);
                else
                    ShowErrorMessagePopUp(languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadCurrentSiteDateTime, true);
            }
            else {
                ShowErrorMessagePopUp(languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadCurrentSiteDateTime, true);
            }
        }
    });
    return currentDateTime;
}

function bindDatePickerAndSelectDefaultDate() {
    var currentDateTimeInfo = GetSiteCurrentDateTime();
    var currentDate = new Date();
    if (currentDateTimeInfo != undefined && currentDateTimeInfo != null && currentDateTimeInfo.CurrentDate != undefined && currentDateTimeInfo.CurrentDate != 0) {
        currentDate = ConvertIntToDate(currentDateTimeInfo.CurrentDate, currentDateTimeInfo.CurrentTime);
    }

    jQuery("#txtScheduleDate").datepicker({
        minDate: currentDate,
        changeMonth: true,
        changeYear: true,
        onSelect: function () {
            maintenanceScheduleViewModel.ScheduleDate(ConvertDatePickerFormatToInt(jQuery.trim(jQuery("#txtScheduleDate").val())));
        }
    });

    jQuery("#txtScheduleDate").datepicker('option', 'defaultDate', currentDate);
    jQuery("#txtScheduleDate").datepicker('setDate', currentDate);

    jQuery('.ui-datepicker-current-day').click();

    if (jQuery.MaintenanceScheduleNamespace.PlantTimeFormat.indexOf('tt') !== -1) {
        jQuery("#txtScheduleTime").timepicker({
            minutes: {
                starts: 0,
                ends: 59,
                interval: 1
            },
            amPmText: ['AM', 'PM'],
            defaultTime: "00:00",
            showPeriod: true,
            showPeriodLabels: true,
            showMinutesLeadingZero: false,
            onSelect: function (time, inst) {
                maintenanceScheduleViewModel.ScheduleTime(ConvertTimePickerFormatToInt(time));
            }
        });
    }
    else {
        jQuery("#txtScheduleTime").timepicker({
            hours: {
                starts: 0,
                ends: 23
            },
            minutes: {
                starts: 0,
                ends: 59,
                interval: 1
            },

            defaultTime: "00:00",
            showPeriodLabels: false,
            showMinutesLeadingZero: false,
            onSelect: function (time, inst) {
                maintenanceScheduleViewModel.ScheduleTime(ConvertTimePickerFormatToInt(time));
            }
        });
    }

    jQuery("#txtScheduleDate,#txtScheduleTime").keydown(function () {
        return false;
    });
}

function ConvertIntToDate(dateItem, timeItem) {
    dateItem += "";
    timeItem += "";

    var yearVal = dateItem.substring(0, 4);
    var monthVal = dateItem.substring(4, 6);
    var dateVal = dateItem.substring(6);

    var padString = "000000";
    timeItem = padString.substring(0, padString.length - timeItem.toString().length) + timeItem.toString();

    var hours = timeItem.substring(0, 2);
    var mins = timeItem.substring(2, 4);
    var secs = timeItem.substring(4);

    return new Date(parseInt(yearVal, 10), parseInt(monthVal, 10) - 1, parseInt(dateVal, 10), hours, mins, secs);
}

function ConvertDatePickerFormatToInt(dateString) {
    if (dateString != undefined && dateString != "")
        return jQuery.datepicker.formatDate('yymmdd', jQuery.datepicker.parseDate(jQuery.MaintenanceScheduleNamespace.DatePickerFormat, dateString));
    else
        return 0;
}

function ConvertTimePickerFormatToInt(timeString) {
    if (timeString != undefined && timeString != "") {
        var hour = parseInt(timeString.substr(0, 2));
        var minute = timeString.substr(3, 2);
        if (jQuery.MaintenanceScheduleNamespace.PlantTimeFormat.indexOf('tt') !== -1) {
            var amPMText = timeString.substr(timeString.indexOf(' ') + 1, 2);
            if (amPMText == "AM") {
                if (hour == 12) hour = 0;
                return hour + "" + minute + "00";
            }
            else {
                if (hour < 12) hour += 12;
                return hour + "" + minute + "00";
            }
        }
        else {
            return hour + "" + minute + "00";
        }
    }
    else
        return 0;
}

function ConvertIntToDateTimeString(dateInt, timeInt) {
    return dateInt + "000000".substring(0, 6 - timeInt.toString().length) + timeInt.toString();
}

function ConvertSiteDateTimeToDatePickerFormat(dateTimeInt) {
    if (dateTimeInt > 0) {
        var dateString = dateTimeInt.toString().substr(0, 8);
        return jQuery.datepicker.formatDate(jQuery.MaintenanceScheduleNamespace.DatePickerFormat, jQuery.datepicker.parseDate("yymmdd", dateString));
    }
    else
        return "";
}

function ConvertSiteDateTimeToTimePickerFormat(dateTimeInt) {
    if (dateTimeInt > 0) {
        var timeString = dateTimeInt.toString().substr(8, 6);
        var hour = parseInt(timeString.substr(0, 2));
        var minute = timeString.substr(2, 2);
        if (jQuery.MaintenanceScheduleNamespace.PlantTimeFormat.indexOf('tt') !== -1) {
            if (hour >= 12) {
                if (hour > 12) hour -= 12;
                if (hour < 10) hour = "0" + hour;
                return hour + ":" + minute + " PM";
            }
            else {
                if (hour == 0) hour = 12;
                if (hour < 10) hour = "0" + hour;
                return hour + ":" + minute + " AM";
            }
        }
        else {
            if (hour < 10) hour = "0" + hour;
            return hour + ":" + minute;
        }
    }
    else
        return "";
}

function GetEnumTypeInfo(enumType) {
    var basicParam = {};
    basicParam.SiteID = jQuery.MaintenanceScheduleNamespace.BasicParam.SiteID;
    basicParam.UserID = jQuery.MaintenanceScheduleNamespace.BasicParam.UserID;

    jQuery.ajax({
        type: "POST",
        url: jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetEnumInfoList",
        data: JSON.stringify({ basicParam: basicParam, EnumType: enumType }),
        dataType: 'json',
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data.d !== null) {
                maintenanceScheduleViewModel.MaintenancePriorityList(data.d);
            }
        },
        error: function (request, error) {
            var errorMessage = languageResource.resMsg_FailedToLoadDropdown;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                    errorMessage = errorMsg;
            }
            ShowErrorMessage(languageResource.resMsg_Error + errorMessage, "error");
        }
    });
    jQuery("#ddlSelectPriority").select2({ width: '50%' });
}

//add maintenance information
function AddNewMaintenance() {
    var isValid = true;
    var message = "";
    if (jQuery.trim(jQuery("#txtMaintenanceName").val()).length == 0) {
        isValid = false;
        message = message + languageResource.resMsg_EnterMaintenanceName + "</br>";
    }
    if (jQuery.MaintenanceScheduleNamespace.FLocationID == 0 && jQuery.MaintenanceScheduleNamespace.EquipmentID == 0) {
        isValid = false;
        message = message + languageResource.resMsg_SelectFLocationOrEquipment + "</br>";
    }
    if (jQuery("#ddlSelectMaintenanceType").val() == undefined || jQuery.trim(jQuery("#ddlSelectMaintenanceType").val()).length == 0 || jQuery.trim(jQuery("#ddlSelectMaintenanceType").val()) == 0) {
        isValid = false;
        message = message + languageResource.resMsg_SelectMaintenanceType + "</br>";
    }
    if (jQuery("#ddlSelectPriority").val() == undefined || jQuery.trim(jQuery("#ddlSelectPriority").val()).length == 0) {
        isValid = false;
        message = message + languageResource.resMsg_SelectPriorityType + "</br>";
    }
    if (jQuery("#ddlSelectWorkGroupType").val() == undefined || jQuery.trim(jQuery("#ddlSelectWorkGroupType").val()).length == 0 || jQuery.trim(jQuery("#ddlSelectWorkGroupType").val()) == 0) {
        isValid = false;
        message = message + languageResource.resMsg_SelectAssigneeWorkGroup + "</br>";
    }
    if (jQuery.MaintenanceScheduleNamespace.ScheduleType == jQuery.MaintenanceScheduleNamespace.ScheduleTypeList.WorkOrder) {
        if (maintenanceScheduleViewModel.ScheduleDate() == undefined || jQuery.trim(maintenanceScheduleViewModel.ScheduleDate()).length == 0 || maintenanceScheduleViewModel.ScheduleDate() == 0) {
            isValid = false;
            message = message + languageResource.resMsg_SelectScheduleDate + "</br>";
        }
    }
    if (!isValid) {
        ShowErrorMessage(message, 'error');
    }
    else {
        var scheduleType = "";
        switch (jQuery.MaintenanceScheduleNamespace.ScheduleType) {
            case jQuery.MaintenanceScheduleNamespace.ScheduleTypeList.Schedule: scheduleType = "Schedule";
                break;
            case jQuery.MaintenanceScheduleNamespace.ScheduleTypeList.WorkOrder: scheduleType = "WorkOrder";
                break;
            case jQuery.MaintenanceScheduleNamespace.ScheduleTypeList.Inspection: scheduleType = "Inspection";
                break;
        }
        var maintenanceInfo = {};
        maintenanceInfo.SiteID = jQuery.MaintenanceScheduleNamespace.BasicParam.SiteID;
        maintenanceInfo.UserID = jQuery.MaintenanceScheduleNamespace.BasicParam.UserID;
        maintenanceInfo.MaintScheduleID = jQuery.MaintenanceScheduleNamespace.MaintScheduleID;
        maintenanceInfo.MaintenanceName = jQuery.trim(jQuery("#txtMaintenanceName").val());
        maintenanceInfo.FLocationID = jQuery.MaintenanceScheduleNamespace.FLocationID;
        maintenanceInfo.EquipmentID = jQuery.MaintenanceScheduleNamespace.EquipmentID;
        maintenanceInfo.MaintenanceDesc = jQuery.trim(jQuery("#txtMaintenanceDesc").val());
        maintenanceInfo.MaintenanceTypeID = jQuery.trim(jQuery("#ddlSelectMaintenanceType").val());
        maintenanceInfo.MaintenancePriorityType = jQuery.trim(jQuery("#ddlSelectPriority").val());
        maintenanceInfo.ScheduleDate = maintenanceScheduleViewModel.ScheduleDate();
        maintenanceInfo.ScheduleTime = maintenanceScheduleViewModel.ScheduleTime();
        maintenanceInfo.WorkGroupID = jQuery.trim(jQuery("#ddlSelectWorkGroupType").val());
        maintenanceInfo.MaintScheduleType = scheduleType;
        maintenanceInfo.NotificationID = jQuery.MaintenanceScheduleNamespace.NotificationID;

        jQuery.ajax({
            type: "POST",
            url: jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/InsertUpdateMaintenanceInfo",
            data: JSON.stringify({ maintenanceInfo: maintenanceInfo }),
            contentType: "application/json; charset=utf-8",
            datatype: 'json',
            async: false,
            success: function (json) {
                if (json != undefined && json.d != undefined) {
                    var maintenanceIdentityInfo = json.d;
                    //if (result == -1) {//Already exist
                    //    ShowErrorMessage(languageResource.resMsg_AlreadyExistsMaintenanceName, 'error');
                    //}
                    //else

                    if (maintenanceIdentityInfo.WorkOrderID == -2) {
                        //work order is started, update is not possible
                        ShowErrorMessage(languageResource.resMsg_WorkOrderStartedUpdateNotPossible, 'error');
                    }
                    else if (maintenanceIdentityInfo.MaintScheduleID == jQuery.MaintenanceScheduleNamespace.MaintScheduleID) {
                        //successfully updated
                        jQuery.MaintenanceScheduleNamespace.NewMaintScheduleID = jQuery.MaintenanceScheduleNamespace.MaintScheduleID;
                        ShowErrorMessage(languageResource.resMsg_SuccessfullyUpdatedMaintenanceInfo, 'info');
                        jQuery(".tab-icon-disabled").removeClass('tab-icon-disabled');
                        $('#divTabInfo a').attr('style', 'color:black');
                    }
                    else if (maintenanceIdentityInfo.MaintScheduleID > 0) {
                        //successfully inserted
                        jQuery.MaintenanceScheduleNamespace.MaintScheduleID = maintenanceIdentityInfo.MaintScheduleID;
                        maintenanceScheduleViewModel.WorkOrderNumber(parseInt(maintenanceIdentityInfo.WorkOrderID));
                        LoadMaintenanceSchedulePage(jQuery.MaintenanceScheduleNamespace.PagesList.WorkInstruction);
                        jQuery("#" + jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.LoadControlID).text(languageResource.resMsg_Update);

                        var btnCancelSchedule = jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.LoadControlID.replace("btnSaveMaintInfo", "btnCancelWorkOrder");
                        jQuery("#" + btnCancelSchedule).removeAttr('disabled');
                        jQuery("#" + btnCancelSchedule).prop("onclick", null);
                        jQuery("#" + btnCancelSchedule).unbind('click');
                        jQuery("#" + btnCancelSchedule).bind("click", function () { CancelWorkOrderConfirm(0); return false; });
                        jQuery(".tab-icon-disabled").removeClass('tab-icon-disabled');
                        $('#divTabInfo a').attr('style', 'color:black');
                    }
                }
                else {
                    ShowErrorMessage(languageResource.resMsg_FailedToUpdateMaintenanceInfo, 'error');
                }
            },
            beforeSend: function () {
                jQuery("#divMaintProgress").show();
                maintenanceScheduleViewModel.ModelErrorVisible(false);
            },
            complete: function () {
                jQuery("#divMaintProgress").hide();
            },
            error: function (request, error) {
                jQuery("#divMaintProgress").hide();
                var errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToUpdateMaintenanceInfo;
                if (request.responseText != "") {
                    var errorMsg = jQuery.parseJSON(request.responseText);
                    if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                        errorMessage = languageResource.resMsg_Error + errorMsg.Message;
                }
                ShowErrorMessage(errorMessage, 'error');
            }
        });
    }
}

function LoadMaintenanceInfoForEdit() {
    var filterInfo = {};
    filterInfo.SiteID = jQuery.MaintenanceScheduleNamespace.BasicParam.SiteID;
    filterInfo.UserID = jQuery.MaintenanceScheduleNamespace.BasicParam.UserID;
    filterInfo.WorkOrderID = jQuery.MaintenanceScheduleNamespace.WorkOrderID;
    var scheduleType = "";
    if (jQuery.MaintenanceScheduleNamespace.MaintScheduleID > 0) {
        filterInfo.MaintScheduleID = jQuery.MaintenanceScheduleNamespace.MaintScheduleID;
        switch (jQuery.MaintenanceScheduleNamespace.ScheduleType) {
            case jQuery.MaintenanceScheduleNamespace.ScheduleTypeList.Schedule: scheduleType = "Schedule";
                break;
            case jQuery.MaintenanceScheduleNamespace.ScheduleTypeList.WorkOrder: scheduleType = "WorkOrder";
                break;
            case jQuery.MaintenanceScheduleNamespace.ScheduleTypeList.Inspection: scheduleType = "Inspection";
                break;
        }
    }
    else {
        filterInfo.MaintScheduleID = jQuery.MaintenanceScheduleNamespace.NotificationID;
        scheduleType = "Notification";
    }

    filterInfo.MaintScheduleType = scheduleType;

    jQuery.ajax({
        type: "POST",
        url: jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetMaintenanceInfo",
        data: JSON.stringify({ filterInfo: filterInfo }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        async: false,
        success: function (json) {
            if (json != undefined && json.d != undefined && json.d != null) {
                if (jQuery.MaintenanceScheduleNamespace.MaintScheduleID > 0) {
                    jQuery("#" + jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.LoadControlID).text(languageResource.resMsg_Update);

                    var result = json.d;
                    jQuery("#txtMaintenanceName").val(result.MaintenanceName);
                    jQuery.MaintenanceScheduleNamespace.FLocationID = result.FLocationID;
                    jQuery.MaintenanceScheduleNamespace.EquipmentID = result.EquipmentID;
                    LoadEquipmentOrLocationWorkGroup();
                    jQuery("#txtMaintenanceDesc").val(result.MaintenanceDesc);
                    jQuery("#ddlSelectMaintenanceType").val(result.MaintenanceTypeID.toString());
                    jQuery("#ddlSelectMaintenanceType").trigger('change');
                    jQuery("#ddlSelectPriority").val(result.MaintenancePriorityType.toString().toUpperCase());
                    jQuery("#ddlSelectPriority").trigger('change');
                    maintenanceScheduleViewModel.ScheduleDate(result.ScheduleDate);
                    maintenanceScheduleViewModel.ScheduleTime(result.ScheduleTime);
                    var workGroupInfo = ko.utils.arrayFirst(maintenanceScheduleViewModel.WorkGroupTypeList(), function (item) { return item.TypeValue == result.WorkGroupID; });
                    if (workGroupInfo != null && workGroupInfo != undefined) {
                        jQuery("#ddlSelectWorkGroupType").val(result.WorkGroupID);
                        jQuery("#ddlSelectWorkGroupType").trigger('change');
                    }
                    else {
                        jQuery("#ddlSelectWorkGroupType").val(result.WorkGroupID);
                        jQuery("#select2-ddlSelectWorkGroupType-container").html(result.WorkGroupName);
                        if (result.IsWorkGroupAvailable == false)
                            ShowErrorMessage(languageResource.resMsg_WorkGroupRemovedFromSystem, 'error');
                        else
                            ShowErrorMessage(languageResource.resMsg_WorkGroupRemovedFromEquipment, 'error');
                    }

                    jQuery.MaintenanceScheduleNamespace.NotificationID = result.NotificationID;

                    maintenanceScheduleViewModel.IsCanceledWorkOrder(false);
                    if (result.WorkOrderStatus.toUpperCase() == jQuery.MaintenanceScheduleNamespace.WorkOrderStatusInfo.Cancelled && jQuery.MaintenanceScheduleNamespace.ScheduleType == jQuery.MaintenanceScheduleNamespace.ScheduleTypeList.WorkOrder) {
                        maintenanceScheduleViewModel.IsCanceledWorkOrder(true);
                    }
                    else if (result.WorkOrderStatus.toUpperCase() != jQuery.MaintenanceScheduleNamespace.WorkOrderStatusInfo.Scheduled &&
                        result.WorkOrderStatus.toUpperCase() != jQuery.MaintenanceScheduleNamespace.WorkOrderStatusInfo.Overdue &&
                        result.WorkOrderStatus.toUpperCase() != jQuery.MaintenanceScheduleNamespace.WorkOrderStatusInfo.Created &&
                        jQuery.MaintenanceScheduleNamespace.ScheduleType == jQuery.MaintenanceScheduleNamespace.ScheduleTypeList.WorkOrder) {
                        workInstructionViewModel.HasDeleteAccess(false);
                        workInstructionViewModel.IsUserHasSavingPermission(false);
                        workInstructionViewModel.IsSOPImportAccess(false);
                        sparePartsViewModel.HasDeleteAccess(false);
                        sparePartsViewModel.IsUserHasSavingPermission(false);
                        attachmentViewModel.HasDeleteAccess(false);
                        attachmentViewModel.IsUserHasSavingPermission(false);
                        maintenanceScheduleViewModel.IsUserHasSavingPermission(false);
                        jQuery("#btnImportInstrTaskGroup").attr("disabled", "disabled");
                        jQuery("#btnAddInstrManual").attr("disabled", "disabled");
                    }

                    if (jQuery.MaintenanceScheduleNamespace.FLocationID > 0) {
                        locationEquipmentViewModel.IsEquipemntSelected(false);
                        jQuery("#rdbLocation").prop("checked", true);
                        jQuery("#txtFLocationOrEquipmentName").val(result.FLocationName);
                    }
                    else {
                        locationEquipmentViewModel.IsEquipemntSelected(true);
                        $("#rdbEquipment").prop("checked", true);
                        jQuery("#txtFLocationOrEquipmentName").val(result.EquipmentName);
                    }

                    if (result.ScheduleDate > 0) {
                        var dateTimeString = ConvertIntToDateTimeString(result.ScheduleDate, result.ScheduleTime);
                        jQuery("#txtScheduleDate").val(ConvertSiteDateTimeToDatePickerFormat(dateTimeString));
                        jQuery("#txtScheduleTime").val(ConvertSiteDateTimeToTimePickerFormat(dateTimeString));
                    }

                    if (result.TaskGroupID > 0) {
                        if (result.ManualTaskGroupID > 0) {
                            jQuery.MaintenanceScheduleNamespace.TaskGroupIdentifier = result.TaskGroupIdentifier;
                            jQuery.MaintenanceScheduleNamespace.TaskGroupID = result.TaskGroupID;
                            jQuery.MaintenanceScheduleNamespace.TaskGroupVersionNumber = result.TaskGroupVersion;
                            OnChangeBindInstruction(jQuery("#btnAddInstrManual"));
                        }
                        else {
                            jQuery.MaintenanceScheduleNamespace.TaskGroupInfo = {};
                            jQuery.MaintenanceScheduleNamespace.TaskGroupInfo.TaskGroupID = result.TaskGroupID;
                            jQuery.MaintenanceScheduleNamespace.TaskGroupInfo.TaskGroupName = result.TaskGroupName;
                            jQuery.MaintenanceScheduleNamespace.TaskGroupInfo.Identifier = result.TaskGroupIdentifier;
                            jQuery.MaintenanceScheduleNamespace.TaskGroupInfo.VersionNumber = result.TaskGroupVersion;
                            jQuery.MaintenanceScheduleNamespace.TaskGroupInfo.IsTaskGroupSOPRemoved = result.IsTaskGroupSOPRemoved;
                            workInstructionViewModel.SelectedTaskGroupInfo(jQuery.MaintenanceScheduleNamespace.TaskGroupInfo);
                            jQuery("#divSelectTaskGroup span").text(result.TaskGroupName);
                            OnChangeBindInstruction(jQuery("#btnImportInstrTaskGroup"));

                            //var btnSaveWorkInstruction = jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.LoadControlID.replace("btnSaveMaintInfo", "btnSaveWorkInstruction");
                            //jQuery("#" + btnSaveWorkInstruction).text(languageResource.resMsg_Update);
                        }
                    }

                    result.ScheduleStatus = result.ScheduleStatus;

                    //activate button setting
                    var btnActivateSchedule = jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.LoadControlID.replace("btnSaveMaintInfo", "btnActivateSchedule");
                    if (result.ScheduleDetailID > 0 || jQuery.MaintenanceScheduleNamespace.ScheduleType == jQuery.MaintenanceScheduleNamespace.ScheduleTypeList.WorkOrder) {
                        if (result.ScheduleStatus == jQuery.MaintenanceScheduleNamespace.ScheduleStatus.Released) {
                            maintenanceScheduleViewModel.ShowActivateSchedule(true);
                            jQuery("#" + btnActivateSchedule).text(languageResource.resMsg_InActivate);
                            if (jQuery.MaintenanceScheduleNamespace.ReleaseAccess.toLowerCase() === "full_access")
                                jQuery("#" + btnActivateSchedule).removeAttr("disabled").removeClass("li-disabled");
                        }
                        else if (result.ScheduleStatus == jQuery.MaintenanceScheduleNamespace.ScheduleStatus.Created || result.ScheduleStatus == jQuery.MaintenanceScheduleNamespace.ScheduleStatus.Cancelled) {
                            maintenanceScheduleViewModel.ShowActivateSchedule(true);
                            var btnActiveText = jQuery.MaintenanceScheduleNamespace.ScheduleType == jQuery.MaintenanceScheduleNamespace.ScheduleTypeList.WorkOrder ? languageResource.resMsg_ReleaseWorkOrder : languageResource.resMsg_Activate;
                            jQuery("#" + btnActivateSchedule).text(btnActiveText);
                            if (jQuery.MaintenanceScheduleNamespace.ReleaseAccess.toLowerCase() === "full_access")
                                jQuery("#" + btnActivateSchedule).removeAttr("disabled").removeClass("li-disabled");
                        }
                        else if (result.ScheduleStatus == jQuery.MaintenanceScheduleNamespace.ScheduleStatus.Scheduling) {
                            maintenanceScheduleViewModel.ShowActivateSchedule(false);
                        }
                    }
                    else {
                        maintenanceScheduleViewModel.ShowActivateSchedule(true);
                        jQuery("#" + btnActivateSchedule).attr("disabled", "disabled").addClass("li-disabled");
                    }
                    if (result.WorkOrderStatus.toUpperCase() != jQuery.MaintenanceScheduleNamespace.WorkOrderStatusInfo.Scheduled &&
                        result.WorkOrderStatus.toUpperCase() != jQuery.MaintenanceScheduleNamespace.WorkOrderStatusInfo.Overdue &&
                        result.WorkOrderStatus.toUpperCase() != jQuery.MaintenanceScheduleNamespace.WorkOrderStatusInfo.Created &&
                        jQuery.MaintenanceScheduleNamespace.ScheduleType == jQuery.MaintenanceScheduleNamespace.ScheduleTypeList.WorkOrder) {
                        maintenanceScheduleViewModel.ShowActivateSchedule(true);
                        jQuery("#" + btnActivateSchedule).attr("disabled", "disabled").addClass("li-disabled");
                    }
                }
                else {
                    var result = json.d;
                    jQuery.MaintenanceScheduleNamespace.FLocationID = result.FLocationID;
                    jQuery.MaintenanceScheduleNamespace.EquipmentID = result.EquipmentID;
                    if (jQuery.MaintenanceScheduleNamespace.FLocationID > 0) {
                        locationEquipmentViewModel.IsEquipemntSelected(false);
                        jQuery("#rdbLocation").prop("checked", true);
                        jQuery("#txtFLocationOrEquipmentName").val(result.FLocationName);
                    }
                    else {
                        locationEquipmentViewModel.IsEquipemntSelected(true);
                        $("#rdbEquipment").prop("checked", true);
                        jQuery("#txtFLocationOrEquipmentName").val(result.EquipmentName);
                    }
                    LoadEquipmentOrLocationWorkGroup();
                }
            }
            else {
                jQuery.MaintenanceScheduleNamespace.MaintScheduleID = 0;
                ShowErrorMessage(languageResource.resMsg_Error + languageResource.resMsg_FailedGetMaintenanceEditInfo, 'error');
            }
        },
        beforeSend: function () {
            jQuery("#divMaintProgress").removeClass("hide");
            maintenanceScheduleViewModel.ModelErrorVisible(false);
        },
        complete: function () {
            jQuery("#divMaintProgress").addClass("hide");
        },
        error: function (request, error) {
            jQuery.MaintenanceScheduleNamespace.MaintScheduleID = 0;
            jQuery("#divMaintProgress").hide();
            var errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedGetMaintenanceEditInfo;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    errorMessage = languageResource.resMsg_Error + errorMsg.Message;
            }
            ShowErrorMessage(errorMessage, 'error');
        }
    });
}

//add maintenance type modal
function ShowAddMaintenanceTypeModal() {
    ClearMaintenanceTypeInfo();
    var btnAddMaintType = jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.LoadControlID.replace("btnSaveMaintInfo", "btnAddMaintType");
    jQuery("#" + btnAddMaintType).val("");
    jQuery("#" + btnAddMaintType).val(languageResource.resMsg_Add);
    if (jQuery("#iconViewintTypes").hasClass("fa fa-minus-circle")) {
        jQuery("#iconViewintTypes").removeClass("fa fa-minus-circle");
        jQuery("#iconViewintTypes").addClass("fa fa-plus-circle");
    }
    var btnShowAll = "btnShowAll";
    jQuery("#" + btnShowAll).addClass('hide');
    jQuery("#iconViewMaintTypes").removeClass("fa fa-minus-circle");
    jQuery("#iconViewMaintTypes").addClass("fa fa-plus-circle");
    jQuery("#divMaintTypes").addClass("hide");
    jQuery("#hdfSortValue").val("");
    jQuery(".fa-sort-down").removeClass('fa fa-sort-down');
    jQuery(".fa-sort-up").removeClass('fa fa-sort-up');
    jQuery("#divAddMaintenanceTypeModal").modal("show");
}

function SearchMaintTypes() {
    var btnSave = jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.LoadControlID;
    jQuery.MaintenanceScheduleNamespace.IsMaintTypeSearch = true;

    if (jQuery.MaintenanceScheduleNamespace.IsMaintTypeSearch == true) {
        if (jQuery.trim(jQuery("#txtSearchMaintType").val()) == "") {
            jQuery("#spnSearchError").html(languageResource.resMsg_SearchCriteria);
            return false;
        }
    }
    var btnShowAll = "btnShowAll";
    jQuery("#" + btnShowAll).html("Show All");
    jQuery("#" + btnShowAll).removeClass('hide');
    jQuery("#spnSearchError").empty();
    jQuery("#spnAddMaintTypeError").html("");
    jQuery("#txtNewMaintType").val("");
    jQuery("#txtNewMaintCode").val("");
    var btnAddMaintType = btnSave.replace("btnSaveMaintInfo", "btnAddMaintType");
    jQuery("#" + btnAddMaintType).val("");
    jQuery("#" + btnAddMaintType).val(languageResource.resMsg_Add);

    var thMaintTypes = jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.LoadControlID.replace("btnSaveMaintInfo", "thMaintTypes");
    jQuery("#" + thMaintTypes + " i").removeClass('fa-sort-up');
    jQuery("#" + thMaintTypes + " i").removeClass('fa-sort-down');
    jQuery("#hdfSortValue").val('');
    jQuery("#divMaintTypes").removeClass("hide");
    jQuery("#iconViewMaintTypes").removeClass("fa fa-plus-circle");
    jQuery("#iconViewMaintTypes").addClass("fa fa-minus-circle");

    var maintTypeAccess = jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.PageAccessRights.toLowerCase();
    if (maintTypeAccess == "full_access" || maintTypeAccess == "edit_only")
        maintenanceTypeUpdateViewModel.HasMaintTypeAccess = true;
    if (maintTypeAccess == "full_access") {
        maintenanceTypeUpdateViewModel.HasDeleteMaintTypeAccess = true;
        jQuery("#" + btnAddMaintType).removeAttr('disabled');
        jQuery("#" + btnAddMaintType).prop("onclick", null);
        jQuery("#" + btnAddMaintType).unbind('click');
        jQuery("#" + btnAddMaintType).bind("click", function () { InsertOrUpdateMaintType(0); return false; });
    }
    else {
        jQuery("#" + btnAddMaintType).attr('disabled', 'disabled');
    }

    LoadMaintTypesInfo(jQuery.MaintenanceScheduleNamespace.MaintTypePagerData);
}

function ShowAllMaintTypes() {
    jQuery.MaintenanceScheduleNamespace.IsMaintTypeSearch = false;
    ClearMaintenanceTypeInfo();
    jQuery("#btnShowAll").addClass('hide');

    var thMaintTypes = jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.LoadControlID.replace("btnSaveMaintInfo", "thMaintTypes");
    jQuery("#" + thMaintTypes + " i").removeClass('fa-sort-up');
    jQuery("#" + thMaintTypes + " i").removeClass('fa-sort-down');
    jQuery("#hdfSortValue").val('');
    jQuery("#divMaintTypes").removeClass("hide");
    jQuery("#iconViewMaintTypes").removeClass("fa fa-plus-circle");
    jQuery("#iconViewMaintTypes").addClass("fa fa-minus-circle");

    var btnAddMaintType = jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.LoadControlID.replace("btnSaveMaintInfo", "btnAddMaintType");
    jQuery("#" + btnAddMaintType).val("");
    jQuery("#" + btnAddMaintType).val(languageResource.resMsg_Add);

    var maintTypeAccess = jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.PageAccessRights.toLowerCase();
    if (maintTypeAccess == "full_access" || maintTypeAccess == "edit_only")
        maintenanceTypeUpdateViewModel.HasMaintTypeAccess = true;
    if (maintTypeAccess == "full_access") {
        maintenanceTypeUpdateViewModel.HasDeleteMaintTypeAccess = true;
        jQuery("#" + btnAddMaintType).removeAttr('disabled');
        jQuery("#" + btnAddMaintType).prop("onclick", null);
        jQuery("#" + btnAddMaintType).unbind('click');
        jQuery("#" + btnAddMaintType).bind("click", function () { InsertOrUpdateMaintType(0); return false; });
    }
    else {
        jQuery("#" + btnAddMaintType).attr('disabled', 'disabled');
    }

    LoadMaintTypesInfo(jQuery.MaintenanceScheduleNamespace.MaintTypePagerData);
}

function ClearMaintenanceTypeInfo() {
    jQuery("#spnSearchError").html("");
    jQuery("#spnAddMaintTypeError").html("");
    var btnAddMaintType = jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.LoadControlID.replace("btnSaveMaintInfo", "btnAddMaintType");
    jQuery("#" + btnAddMaintType).val("");
    jQuery("#" + btnAddMaintType).val(languageResource.resMsg_Add);
    if (jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.PageAccessRights.toLowerCase() == "full_access") {
        jQuery("#" + btnAddMaintType).removeAttr('disabled');
        jQuery("#" + btnAddMaintType).prop("onclick", null);
        jQuery("#" + btnAddMaintType).unbind('click');
        jQuery("#" + btnAddMaintType).bind("click", function () { InsertOrUpdateMaintType(0); return false; });
    }
    else {
        jQuery("#" + btnAddMaintType).attr('disabled', 'disabled');
    }

    if (jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.PageAccessRights.toLowerCase() != "full_access") {
        jQuery("#" + btnAddMaintType).attr("disabled", "disabled");
    }
    var btnShowAll = "btnShowAll";
    if (jQuery.trim(jQuery("#txtNewMaintType").val()) == "" && jQuery.trim(jQuery("#txtSearchMaintType").val()) == "" && (jQuery("#" + btnShowAll).is(':visible') == false))
        jQuery("#divAddMaintenanceTypeModal").modal("hide");
    else {
        jQuery("#txtNewMaintType").val("");
        jQuery("#txtNewMaintCode").val("");
        jQuery("#txtSearchMaintType").val("");
        if (jQuery("#" + btnShowAll).is(':visible')) {
            jQuery("#" + btnShowAll).addClass('hide');
            LoadMaintTypesInfo(jQuery.MaintenanceScheduleNamespace.MaintTypePagerData);
        }
    }

    if (jQuery("#divAddMaintenanceTypeModal").hasClass('ui-dialog-content')) {
        jQuery("#divAddMaintenanceTypeModal").dialog("close");
    }
}

function ShowHideMaintTypesInfo() {
    if (jQuery("#iconViewMaintTypes").hasClass("fa-plus-circle")) {
        var thMaintTypes = jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.LoadControlID.replace("btnSaveMaintInfo", "thMaintTypes");
        jQuery("#" + thMaintTypes + " i").removeClass('fa-sort-up');
        jQuery("#" + thMaintTypes + " i").removeClass('fa-sort-down');
        jQuery("#hdfSortValue").val('');
        jQuery("#divMaintTypes").removeClass("hide");
        jQuery("#iconViewMaintTypes").removeClass("fa fa-plus-circle");
        jQuery("#iconViewMaintTypes").addClass("fa fa-minus-circle");

        var maintTypeAccess = jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.PageAccessRights.toLowerCase();
        if (maintTypeAccess == "full_access" || maintTypeAccess == "edit_only")
            maintenanceTypeUpdateViewModel.HasMaintTypeAccess = true;
        if (maintTypeAccess == "full_access") {
            maintenanceTypeUpdateViewModel.HasDeleteMaintTypeAccess = true;
        }
        LoadMaintTypesInfo(jQuery.MaintenanceScheduleNamespace.MaintTypePagerData);
    }
    else {
        jQuery("#iconViewMaintTypes").removeClass("fa fa-minus-circle");
        jQuery("#iconViewMaintTypes").addClass("fa fa-plus-circle");
        jQuery("#divMaintTypes").addClass("hide");
    }
}

function BindIconAttributes(hasAccess) {
    var iconAttributes = {};
    if (!hasAccess) {
        iconAttributes.disabled = "disabled";
    }
    return iconAttributes;
}

function LoadMaintTypesInfo(pagerData) {
    var masterDataFilterInfo = {};
    masterDataFilterInfo.PageIndex = pagerData.PageIndex;
    masterDataFilterInfo.PageSize = pagerData.PageSize;
    masterDataFilterInfo.MasterDataType = jQuery.MaintenanceScheduleNamespace.MaintMasterDataType.MaintenanceType;

    if (jQuery.MaintenanceScheduleNamespace.IsMaintTypeSearch == true) {
        if (jQuery.trim(jQuery("#txtSearchMaintType").val()) != "") {
            masterDataFilterInfo.SearchString = jQuery.trim(jQuery("#txtSearchMaintType").val());
        }
    }

    if (jQuery("#hdfSortValue").val() != "") {
        masterDataFilterInfo.SortType = jQuery("#hdfSortValue").val();
    }

    jQuery.ajax({
        type: "POST",
        url: jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetMaintMasterDataWithPager",
        data: JSON.stringify({ pagerData: pagerData, basicParam: jQuery.MaintenanceScheduleNamespace.BasicParam, masterDataFilterInfo: masterDataFilterInfo }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        success: function (json) {
            maintenanceTypeUpdateViewModel.DefaultMaintenanceTypesArray([]);
            if (json != undefined && json.d != undefined) {
                if (json.d.MasterDataInfoList.length == 0) {
                    maintenanceTypeUpdateViewModel.LoadErrorMessage(languageResource.resMsg_NoRecordFound);
                    maintenanceTypeUpdateViewModel.LoadErrorMessageClass('');
                    maintenanceTypeUpdateViewModel.LoadErrorMessageVisible(true);
                }
                else {
                    maintenanceTypeUpdateViewModel.MaintTypePagerData(json.d.HTMLPager);
                    maintenanceTypeUpdateViewModel.DefaultMaintenanceTypesArray(json.d.MasterDataInfoList);
                }
            }
            else {
                maintenanceTypeUpdateViewModel.LoadErrorMessage(languageResource.resMsg_FailedToLoadMaintTypeInfo);
                maintenanceTypeUpdateViewModel.LoadErrorMessageClass('red');
                maintenanceTypeUpdateViewModel.LoadErrorMessageVisible(true);
            }
        },
        beforeSend: function () {
            maintenanceTypeUpdateViewModel.LoadErrorMessageVisible(false);
            maintenanceTypeUpdateViewModel.MaintTypePagerData('');
            jQuery("#divMaintTypesProgress").show();
        },
        complete: function () {
            jQuery("#divMaintTypesProgress").hide();
        },
        error: function (request, error) {
            maintenanceTypeUpdateViewModel.LoadErrorMessageClass('red');
            maintenanceTypeUpdateViewModel.LoadErrorMessageVisible(true);
            var errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadMaintTypeInfo;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    errorMessage = languageResource.resMsg_Error + errorMsg.Message;
            }
            maintenanceTypeUpdateViewModel.LoadErrorMessage(errorMessage);
        }
    });
}

function ShowEditMaintTypes(maintTypeID, maintType, maintCode) {
    jQuery("#txtNewMaintType").val(maintType);
    jQuery("#txtNewMaintCode").val(maintCode);
    var btnAddMaintType = jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.LoadControlID.replace("btnSaveMaintInfo", "btnAddMaintType");
    jQuery("#" + btnAddMaintType).val("");
    jQuery("#" + btnAddMaintType).val(languageResource.resMsg_Update);
    if (jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.PageAccessRights.toLowerCase() == "full_access" || jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.PageAccessRights.toLowerCase() == "edit_only") {
        jQuery("#" + btnAddMaintType).removeAttr('disabled');
        jQuery("#" + btnAddMaintType).prop("onclick", null);
        jQuery("#" + btnAddMaintType).unbind('click');
        jQuery("#" + btnAddMaintType).bind("click", function () { InsertOrUpdateMaintType(maintTypeID); return false; });
    }
    else {
        jQuery("#" + btnAddMaintType).attr('disabled', 'disabled');
    }
}

function DeleteMaintTypeClick(maintTypeID) {
    jQuery("#alertMessage").removeClass("text-danger");
    jQuery("#alertMessage").html(languageResource.resMsg_DeleteMaintTypeConfirm);
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
                    DeleteMaintTypeInfo(maintTypeID);
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

function DeleteMaintTypeInfo(maintTypeID) {
    jQuery("#spnSearchError").html("");
    jQuery("#spnAddMaintTypeError").html("");
    var btnAddMaintType = jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.LoadControlID.replace("btnSaveMaintInfo", "btnAddMaintType");
    jQuery("#" + btnAddMaintType).val("");
    jQuery("#" + btnAddMaintType).val(languageResource.resMsg_Add);
    if (jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.PageAccessRights.toLowerCase() == "full_access") {
        jQuery("#" + btnAddMaintType).removeAttr('disabled');
        jQuery("#" + btnAddMaintType).prop("onclick", null);
        jQuery("#" + btnAddMaintType).unbind('click');
        jQuery("#" + btnAddMaintType).bind("click", function () { InsertOrUpdateMaintType(0); return false; });
    }
    else {
        jQuery("#" + btnAddMaintType).attr('disabled', 'disabled');
    }

    if (jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.PageAccessRights.toLowerCase() != "full_access") {
        jQuery("#" + btnAddMaintType).attr("disabled", "disabled");
    }
    var btnShowAll = "btnShowAll";
    jQuery("#txtNewMaintType").val("");
    jQuery("#txtNewMaintCode").val("");
    jQuery("#txtSearchMaintType").val("");
    jQuery("#" + btnShowAll).addClass('hide');

    var masterDataInfo = {};
    masterDataInfo.MasterDataID = maintTypeID;
    masterDataInfo.MasterDataType = jQuery.MaintenanceScheduleNamespace.MaintMasterDataType.MaintenanceType;
    jQuery.ajax({
        type: "POST",
        url: jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/DeleteMasterData",
        data: JSON.stringify({ basicParam: jQuery.MaintenanceScheduleNamespace.BasicParam, masterDataInfo: masterDataInfo }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if (json.d != undefined && json.d != null) {
                if (json.d == 1)
                    ShowErrorMessagePopUp(languageResource.resMsg_MaintTypeInfoAlreadyInUse, true);
                else {
                    LoadMaintTypesInfo(jQuery.MaintenanceScheduleNamespace.MaintTypePagerData);
                }

                LoadMaintMasterData(jQuery.MaintenanceScheduleNamespace.MaintMasterDataType.MaintenanceType);
                jQuery("#ddlSelectMaintenanceType").select2({ width: '50%' });
                jQuery("#txtNewMaintType").val('');
                jQuery("#txtNewMaintCode").val("");
            }
            else {
                var msg = languageResource.resMsg_FailedToDeleteMaintTypeInfo;
                ShowErrorMessagePopUp(msg, true);
            }
        },
        error: function (request, error) {
            var msg;
            if (request.responseText != "") {
                var errorMsg = request.responseText;//jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    msg = languageResource.resMsg_Error + errorMsg.Message;
                else
                    msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToDeleteMaintTypeInfo;
            }
            else {
                msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToDeleteMaintTypeInfo;
            }
            ShowErrorMessagePopUp(msg, true);
        },
    });
}

function InsertOrUpdateMaintType(maintTypeID) {
    jQuery("#spnAddMaintTypeError").removeClass('text-info').addClass('text-danger');
    jQuery("#spnAddMaintTypeError").text('');
    if (jQuery.trim(jQuery("#txtNewMaintType").val()).length == 0) {
        jQuery("#spnAddMaintTypeError").addClass('text-danger');
        jQuery("#spnAddMaintTypeError").text(languageResource.resMsg_EnterMaintType);
    }
    else {
        var masterDataInfo = {};
        masterDataInfo.MasterDataID = maintTypeID;
        masterDataInfo.MasterDataName = jQuery.trim(jQuery("#txtNewMaintType").val());
        masterDataInfo.Description = jQuery.trim(jQuery("#txtNewMaintCode").val());
        masterDataInfo.MasterDataType = jQuery.MaintenanceScheduleNamespace.MaintMasterDataType.MaintenanceType;
        jQuery.ajax({
            type: "POST",
            url: jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/InsertUpdateMasterData",
            data: JSON.stringify({ basicParam: jQuery.MaintenanceScheduleNamespace.BasicParam, masterDataInfo: masterDataInfo }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                jQuery("#spnAddMaintTypeError").removeClass('text-danger').removeClass('text-info');
                if (json.d != undefined && json.d != null && json.d > 0) {
                    if (json.d == maintTypeID) {
                        jQuery("#spnAddMaintTypeError").addClass('text-info');
                        jQuery("#spnAddMaintTypeError").text(languageResource.resMsg_UpdatedMaintType);
                    }
                    else {
                        jQuery("#spnAddMaintTypeError").addClass('text-info');
                        jQuery("#spnAddMaintTypeError").text(languageResource.resMsg_InsertedMaintType);
                    }
                    var btnAddMaintType = jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.LoadControlID.replace("btnSaveMaintInfo", "btnAddMaintType");
                    jQuery("#" + btnAddMaintType).val(languageResource.resMsg_Add);
                    if (jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.PageAccessRights.toLowerCase() == "full_access") {
                        jQuery("#" + btnAddMaintType).removeAttr('disabled');
                        jQuery("#" + btnAddMaintType).prop("onclick", null);
                        jQuery("#" + btnAddMaintType).unbind('click');
                        jQuery("#" + btnAddMaintType).bind("click", function () { InsertOrUpdateMaintType(0); return false; });
                    }
                    else {
                        jQuery("#" + btnAddMaintType).attr('disabled', 'disabled');
                    }
                    LoadMaintMasterData(jQuery.MaintenanceScheduleNamespace.MaintMasterDataType.MaintenanceType);
                    jQuery("#ddlSelectMaintenanceType").select2({ width: '50%' });
                    jQuery("#txtNewMaintType").val('');
                    jQuery("#txtNewMaintCode").val("");
                    LoadMaintTypesInfo(jQuery.MaintenanceScheduleNamespace.MaintTypePagerData);
                    jQuery("#ddlSelectMaintenanceType").val(json.d);
                    jQuery("#ddlSelectMaintenanceType").trigger('change');
                }
                else {
                    if (json.d == -3) {
                        jQuery("#spnAddMaintTypeError").addClass('text-danger');
                        jQuery("#spnAddMaintTypeError").text(languageResource.resMsg_MaintenanceTypeAlreadyExists);
                    }
                    else {
                        var msg = languageResource.resMsg_FailedToInsertMaintTypeInfo;
                        jQuery("#spnAddMaintTypeError").addClass('text-danger');
                        jQuery("#spnAddMaintTypeError").text(msg);
                    }
                }
            },
            error: function (request, error) {
                var msg;
                if (request.responseText != "") {
                    var errorMsg = request.responseText;//jQuery.parseJSON(request.responseText);
                    if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                        msg = languageResource.resMsg_Error + errorMsg.Message;
                    else
                        msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToInsertMaintTypeInfo;
                }
                else {
                    msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToInsertMaintTypeInfo;
                }
                jQuery("#spnAddMaintTypeError").removeClass("text-info").addClass('text-danger');
                jQuery("#spnAddMaintTypeError").text(msg);
            },
        });
    }
}

function SortMaintTypesTabs(thValue, value) {
    var thClass = "";
    var hasSortUpClassExist = jQuery("#" + thValue + " i").hasClass('fa-sort-up');
    var hasSortDownExist = jQuery("#" + thValue + " i").hasClass('fa-sort-down');

    if (hasSortUpClassExist == false && hasSortDownExist == false) {
        jQuery(".fa-sort-down").removeClass('fa fa-sort-down');
        jQuery(".fa-sort-up").removeClass('fa fa-sort-up');

        jQuery("#" + thValue + " i").addClass('fa fa-sort-up');
        thClass = value + "_asc";
        jQuery("#hdfSortValue").val(thClass);
        LoadMaintTypesInfo(jQuery.MaintenanceScheduleNamespace.MaintTypePagerData);
        return false;
    }
    if (jQuery("#" + thValue + " i").hasClass('fa-sort-up')) {
        jQuery(".fa-sort-down").removeClass('fa fa-sort-down');
        jQuery(".fa-sort-up").removeClass('fa fa-sort-up');

        jQuery("#" + thValue + " i").addClass('fa fa-sort-down');
        thClass = value + "_desc";
        jQuery("#hdfSortValue").val(thClass);
        LoadMaintTypesInfo(jQuery.MaintenanceScheduleNamespace.MaintTypePagerData);
        return false;
    }
    if (jQuery("#" + thValue + " i").hasClass('fa-sort-down')) {
        jQuery(".fa-sort-down").removeClass('fa fa-sort-down');
        jQuery(".fa-sort-up").removeClass('fa fa-sort-up');

        jQuery("#" + thValue + " i").addClass('fa fa-sort-up');
        thClass = value + "_asc";
        jQuery("#hdfSortValue").val(thClass);
        LoadMaintTypesInfo(jQuery.MaintenanceScheduleNamespace.MaintTypePagerData);
        return false;
    }
}

//add work instruction details
function LoadWorkInsructionInfo() {
    workInstructionViewModel.ModelErrorMsg('');
    if (workInstructionViewModel.IsImportTaskGroup() == true) {
        if (jQuery.MaintenanceScheduleNamespace.TaskGroupInfo.TaskGroupID != undefined && jQuery.MaintenanceScheduleNamespace.TaskGroupInfo.TaskGroupID > 0) {
            LoadTaskInfoListForTaskGroup(jQuery.MaintenanceScheduleNamespace.TaskGroupInfo.TaskGroupID);
            if (jQuery.MaintenanceScheduleNamespace.TaskGroupInfo.IsTaskGroupSOPRemoved == true) {
                ShowErrorMessage(languageResource.resMsg_TaskGroupSOPIsRemovedFromSystem, "error");
            }
        }
    }
    else {
        LoadManualTaskIDForTaskGroup();
    }
}

function LoadTaskGroupList(searchTaskGroupName, taskGroupType) {
    jQuery("#spnNoRecordFound").text("");
    workInstructionViewModel.SelectedTaskGroupInfo({});
    var filterInfo = {};
    filterInfo.SiteID = jQuery.MaintenanceScheduleNamespace.BasicParam.SiteID;
    filterInfo.UserID = jQuery.MaintenanceScheduleNamespace.BasicParam.UserID;

    filterInfo.SearchTaskGroupName = "";
    if (searchTaskGroupName != undefined && searchTaskGroupName != "")
        filterInfo.SearchTaskGroupName = searchTaskGroupName;

    filterInfo.TaskGroupTypeID = 0;
    if (taskGroupType != undefined && taskGroupType != "" && taskGroupType != "0")
        filterInfo.TaskGroupTypeID = taskGroupType;

    jQuery.ajax({
        type: "POST",
        url: jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetTaskGroupList",
        data: JSON.stringify({ filterInfo: filterInfo }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        success: function (json) {
            if (json != undefined && json.d != undefined) {
                workInstructionViewModel.TaskGroupList(json.d);

                if (json.d.length > 0) {
                    var selItem = ko.utils.arrayFirst(json.d, function (item) { return item.TaskGroupID == jQuery.MaintenanceScheduleNamespace.TaskGroupInfo.TaskGroupID; });
                    if (selItem != undefined && selItem != null) {
                        jQuery("#btnTaskGroup_" + jQuery.MaintenanceScheduleNamespace.TaskGroupInfo.TaskGroupID).removeClass("btn-primary").addClass("btn-success").find("i").show();
                        OnSelectTaskGroup(selItem);
                    }
                }
                else {
                    jQuery("#spnNoRecordFound").text(languageResource.resMsg_NoRecordFound);
                }
            }
            else {
                ShowErrorMessagePopUp(languageResource.resMsg_FailedToLoadTaskGroupInfo, true);
            }
        },
        error: function (request, error) {
            var errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadTaskGroupInfo;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    errorMessage = languageResource.resMsg_Error + errorMsg.Message;
            }
            ShowErrorMessagePopUp(errorMessage, true);
        }
    });
}

function EditTaskGroupModal(ctrl) {
    jQuery("#spnSelectTaskGroupErrorMessage").text("");
    LoadTaskGroupList();
    jQuery("#txtSearchTaskGroup").val("");
    jQuery("#ddlSelectTaskGroupType").val("");
    jQuery("#ddlSelectTaskGroupType").trigger('change');

    //re-load taskgrouptype maint-master details
    LoadMaintMasterData(jQuery.MaintenanceScheduleNamespace.MaintMasterDataType.TaskGroupType);
    jQuery("#ddlSelectTaskGroupType").select2({ width: '50%' });

    //display popup
    jQuery("#divSelectTaskGroupModal").modal("show");
}

function SearchTaskGroup(ctrl) {
    jQuery("#spnSearchErrorTaskGroup").text("");
    var searchText = jQuery.trim(jQuery("#txtSearchTaskGroup").val());
    var taskGroupType = jQuery("#ddlSelectTaskGroupType").val();

    //var isValid = false;
    //if (searchText != undefined && searchText != "")
    //    isValid = true;
    //if (taskGroupType != undefined && taskGroupType != "" && taskGroupType != "0")
    //    isValid = true;

    //if (isValid) {
    jQuery("#btnShowAllTaskGroup").removeClass('hide');
    LoadTaskGroupList(searchText, taskGroupType);
    //}
    //else {
    //    jQuery("#spnSearchErrorTaskGroup").text(languageResource.resMsg_SearchCriteria);
    //    jQuery("#btnShowAllTaskGroup").addClass('hide');
    //}
}

function ShowAllTaskGroup() {
    jQuery("#btnShowAllTaskGroup").addClass('hide');
    jQuery("#txtSearchTaskGroup").val("");
    jQuery("#ddlSelectTaskGroupType").val("");
    jQuery("#ddlSelectTaskGroupType").trigger('change');
    LoadTaskGroupList();
}

function OnSelectTaskGroup(taskInfo) {
    jQuery("#divTaskGroupList button.btn-success").removeClass("btn-success").addClass("btn-primary").find("i").hide();
    jQuery("#btnTaskGroup_" + taskInfo.TaskGroupID).removeClass("btn-primary").addClass("btn-success").find("i").show();
    workInstructionViewModel.SelectedTaskGroupInfo(taskInfo);
}

function LoadTaskInfoListForTaskGroup(taskGroupID) {
    var filterInfo = {};
    filterInfo.SiteID = jQuery.MaintenanceScheduleNamespace.BasicParam.SiteID;
    filterInfo.UserID = jQuery.MaintenanceScheduleNamespace.BasicParam.UserID;
    filterInfo.TaskGroupID = taskGroupID;

    if (filterInfo.TaskGroupID != undefined && filterInfo.TaskGroupID != "") {
        jQuery.ajax({
            type: "POST",
            url: jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetTaskDetailsForTaskGroup",
            data: JSON.stringify({ filterInfo: filterInfo }),
            contentType: "application/json; charset=utf-8",
            datatype: 'json',
            success: function (json) {
                if (json != undefined && json.d != undefined) {
                    workInstructionViewModel.TaskInfoList(json.d);
                }
                else {
                    ShowErrorMessagePopUp(languageResource.resMsg_FailedToLoadTaskDetailsForTaskGroup, true);
                }
            },
            error: function (request, error) {
                var errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadTaskDetailsForTaskGroup;
                if (request.responseText != "") {
                    var errorMsg = jQuery.parseJSON(request.responseText);
                    if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                        errorMessage = languageResource.resMsg_Error + errorMsg.Message;
                }
                ShowErrorMessagePopUp(errorMessage, true);
            }
        });
    }
}

function OnChangeBindInstruction(ctrl) {
    workInstructionViewModel.ModelErrorMsg('');
    var importInstructionFromTaskGroup = false;

    jQuery("#btnAddInstrManual,#btnImportInstrTaskGroup").removeClass("btn-primary").removeClass("btn-normal").find("i").hide();
    jQuery(ctrl).addClass("btn-primary").find("i").show();

    if (jQuery(ctrl).attr("id") == "btnImportInstrTaskGroup") {
        importInstructionFromTaskGroup = true;
        jQuery("#btnAddInstrManual").addClass("btn-normal");
        jQuery("#divAddTaskDetails").hide();
        jQuery("#divSelectTaskGroup").show();
        if (jQuery.MaintenanceScheduleNamespace.TaskGroupInfo == undefined || jQuery.MaintenanceScheduleNamespace.TaskGroupInfo.TaskGroupID == undefined || jQuery.MaintenanceScheduleNamespace.TaskGroupInfo.TaskGroupID == 0) {
            EditTaskGroupModal();
        }
        else {
            if (jQuery.MaintenanceScheduleNamespace.TaskGroupInfo.IsTaskGroupSOPRemoved == true && jQuery.MaintenanceScheduleNamespace.CurrentPage == jQuery.MaintenanceScheduleNamespace.PagesList.WorkInstruction) {
                ShowErrorMessage(languageResource.resMsg_TaskGroupSOPIsRemovedFromSystem, "error");
            }
        }
    }
    else {
        workInstructionViewModel.SelectedTaskGroupInfo({});
        jQuery("#btnImportInstrTaskGroup").addClass("btn-normal");
        jQuery("#divAddTaskDetails").show();
        jQuery("#divSelectTaskGroup").hide();
        if (workInstructionViewModel.ParameterInfoList().length == 0)
            AddMoreParameter();
    }

    workInstructionViewModel.IsImportTaskGroup(importInstructionFromTaskGroup);
}

function SaveWorkInstructionInfo() {
    if (jQuery.MaintenanceScheduleNamespace.MaintScheduleID > 0) {
        if (workInstructionViewModel.IsImportTaskGroup()) {
            UpdateMaintTaskGroupInfo();
        }
    }
}

function UpdateMaintTaskGroupInfo() {
    var filterInfo = {};
    filterInfo.SiteID = jQuery.MaintenanceScheduleNamespace.BasicParam.SiteID;
    filterInfo.UserID = jQuery.MaintenanceScheduleNamespace.BasicParam.UserID;
    filterInfo.ScheduleID = jQuery.MaintenanceScheduleNamespace.MaintScheduleID;
    filterInfo.TaskGroupID = workInstructionViewModel.SelectedTaskGroupInfo().TaskGroupID;
    filterInfo.Identifier = workInstructionViewModel.SelectedTaskGroupInfo().Identifier;

    var errorMessage = "";
    var isValid = true;
    if (filterInfo.TaskGroupID == 0 || filterInfo.TaskGroupID == undefined || filterInfo.TaskGroupID == "") {
        errorMessage += languageResource.resMsg_PleaseSelectTaskGroup;
        isValid = false;
    }

    if (isValid) {
        jQuery.ajax({
            type: "POST",
            url: jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/UpdateMaintenanceTaskGroupInfo",
            data: JSON.stringify({ filterInfo: filterInfo }),
            contentType: "application/json; charset=utf-8",
            datatype: 'json',
            success: function (json) {
                if (json != undefined && json.d != undefined && json.d == true) {
                    jQuery.MaintenanceScheduleNamespace.TaskGroupInfo = workInstructionViewModel.SelectedTaskGroupInfo();
                    jQuery("#divSelectTaskGroup span").text(jQuery.MaintenanceScheduleNamespace.TaskGroupInfo.TaskGroupName);


                    workInstructionViewModel.ShowCompleteTaskDetails(false);
                    LoadTaskInfoListForTaskGroup(filterInfo.TaskGroupID);
                    jQuery("#divSelectTaskGroupModal").modal("hide");
                    ClearManualWorkInstruction();
                    ////if direct work order, then just display success message
                    //if (jQuery.MaintenanceScheduleNamespace.ScheduleType == jQuery.MaintenanceScheduleNamespace.ScheduleTypeList.WorkOrder) {
                    //    ShowErrorMessage(languageResource.resMsg_SuccessfullyUpdatedWorkInstruction, "info");
                    //    jQuery("#" + btnSaveWorkInstruction).text(languageResource.resMsg_Update);
                    //}
                    //else {
                    //    if (jQuery.MaintenanceScheduleNamespace.NewMaintScheduleID == 0 && jQuery("#" + btnSaveWorkInstruction).text() != languageResource.resMsg_Update) {
                    //        LoadMaintenanceSchedulePage(jQuery.MaintenanceScheduleNamespace.PagesList.Schedule);
                    //        jQuery("#" + btnSaveWorkInstruction).text(languageResource.resMsg_Update);
                    //    }
                    //    else {
                    //        ShowErrorMessage(languageResource.resMsg_SuccessfullyUpdatedWorkInstruction, "info");
                    //    }
                    //}
                }
                else {
                    jQuery("#spnSelectTaskGroupErrorMessage").text(languageResource.resMsg_FailedToUpdateWorkInstructionDetails);
                }
            },
            error: function (request, error) {
                var errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToUpdateWorkInstructionDetails;
                if (request.responseText != "") {
                    var errorMsg = jQuery.parseJSON(request.responseText);
                    if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                        errorMessage = languageResource.resMsg_Error + errorMsg.Message;
                }
                jQuery("#spnSelectTaskGroupErrorMessage").text(errorMessage);
            }
        });
    }
    else {
        jQuery("#spnSelectTaskGroupErrorMessage").text(errorMessage);
    }
}

function ShowCompleteTaskDetails() {
    if (workInstructionViewModel.ShowCompleteTaskDetails() == false) {
        workInstructionViewModel.ShowCompleteTaskDetails(true);
        LoadShowCompleteTaskIframe(jQuery.MaintenanceScheduleNamespace.BasePath + "/Preventive/TaskGroupInfo.aspx?id=" + jQuery.MaintenanceScheduleNamespace.BasicParam.SiteID + "&gid=" + jQuery.MaintenanceScheduleNamespace.TaskGroupInfo.Identifier + "&v=" + jQuery.MaintenanceScheduleNamespace.TaskGroupInfo.VersionNumber + "&maintscheduleid=" + jQuery.MaintenanceScheduleNamespace.MaintScheduleID + "&showall=true");
    }
    else {
        workInstructionViewModel.ShowCompleteTaskDetails(false);
    }
}

//region Showing Message
function ShowMessage(message, messageType) {
    workInstructionViewModel.ModelErrorVisible(true);
    switch (messageType.toLowerCase()) {
        case 'info':
            workInstructionViewModel.ModelErrorCss("text-info");
            workInstructionViewModel.ModelErrorMsg(message);
            break;
        case 'error':
            workInstructionViewModel.ModelErrorCss("text-danger");
            workInstructionViewModel.ModelErrorMsg(message);
            break;
    }
}
//endregion Showing Message

//region PPE method
function ShowPPEInfo() {
    workInstructionViewModel.ModelErrorMsg('');
    jQuery.MaintenanceScheduleNamespace.IsSelectedPPE = true;
    instructionSelectionViewModel.PopupModelName(languageResource.resMsg_PPEImage);
    instructionSelectionViewModel.InstructionSelectionList.removeAll();
    jQuery("#divSelectInstructionModal").modal("show");
    jQuery.ajax({
        type: "POST",
        url: jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetPPIDetails",
        data: JSON.stringify({ basicParam: jQuery.MaintenanceScheduleNamespace.BasicParam }),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data.d != undefined || data.d != null) {
                var instructionSelectionInfoList = data.d;
                BindInstructionImages(instructionSelectionInfoList);
            }
            else {
                ShowMessage(languageResource.resMsg_FailedToLoadPPEInfo, "error");
            }
        },
        beforeSend: function () {
            instructionSelectionViewModel.IsPopupProgressing(true);
        },
        complete: function () {
            instructionSelectionViewModel.IsPopupProgressing(false);
        },
        error: function (request, error) {
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                    ShowMessage(errorMsg.Message, "error");
                else {
                    ShowMessage(languageResource.resMsg_FailedToLoadPPEInfo, "error");

                }
            }
            else {
                ShowMessage(languageResource.resMsg_FailedToLoadPPEInfo, "error");
            }
        }
    });
}
function RemovePPIImage(instructionID) {
    workInstructionViewModel.ModelErrorMsg('');
    jQuery.each(workInstructionViewModel.TaskPPEList(), function (index, item) {
        if (item.InstructionID === instructionID) {
            workInstructionViewModel.TaskPPEList.splice(index, 1);
            return false;
        }
    });

    if (workInstructionViewModel.TaskPPEList().length == 0) {
        workInstructionViewModel.IsTaskPPElistEmpty(true);
    }
}
//endregion PPE method

//region Tools method
function ShowToolsInfo() {
    workInstructionViewModel.ModelErrorMsg('');
    jQuery.MaintenanceScheduleNamespace.IsSelectedPPE = false;
    instructionSelectionViewModel.PopupModelName(languageResource.resMsg_ToolsImage);
    instructionSelectionViewModel.InstructionSelectionList.removeAll();
    jQuery("#divSelectInstructionModal").modal("show");
    jQuery.ajax({
        type: "POST",
        url: jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetToolsDetails",
        data: JSON.stringify({ basicParam: jQuery.MaintenanceScheduleNamespace.BasicParam }),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data.d != undefined || data.d != null) {
                var instructionSelectionInfoList = data.d;
                BindInstructionImages(instructionSelectionInfoList);
            }
            else {
                ShowMessage(languageResource.resMsg_FailedToLoadToolsInfo, "error");
            }
        },
        beforeSend: function () {
            instructionSelectionViewModel.IsPopupProgressing(true);
        },
        complete: function () {
            instructionSelectionViewModel.IsPopupProgressing(false);
        },
        error: function (request, error) {
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                    ShowMessage(errorMsg.Message, "error");
                else {
                    ShowMessage(languageResource.resMsg_FailedToLoadToolsInfo, "error");

                }
            }
            else {
                ShowMessage(languageResource.resMsg_FailedToLoadToolsInfo, "error");
            }
        }
    });
}
function RemoveToolsImage(instructionID) {
    workInstructionViewModel.ModelErrorMsg('');
    jQuery.each(workInstructionViewModel.TaskToolsList(), function (index, item) {
        if (item.InstructionID === instructionID) {
            workInstructionViewModel.TaskToolsList.splice(index, 1);
            return false;
        }
    });

    if (workInstructionViewModel.TaskToolsList().length == 0) {
        workInstructionViewModel.IsTaskToolslistEmpty(true);
    }
}
//endregion Tools method

//region PPE&Tools [POPUP] method
function BindInstructionImages(instructionSelectionInfoList) {
    var selectedList = null;
    if (jQuery.MaintenanceScheduleNamespace.IsSelectedPPE) {
        selectedList = workInstructionViewModel.TaskPPEList();
    }
    else {
        selectedList = workInstructionViewModel.TaskToolsList();
    }

    instructionSelectionViewModel.SelectedInstrution.removeAll();
    if (instructionSelectionInfoList.length > 0) {
        instructionSelectionViewModel.IsEmptyInstructionlist(false);
        jQuery.each(instructionSelectionInfoList, function (index, obj) {
            instructionSelectionViewModel.InstructionSelectionList.push(obj);
            jQuery.each(selectedList, function (i, selectedObj) {
                if (obj.InstructionID === selectedObj.InstructionID) {
                    instructionSelectionViewModel.SelectedInstrution.push(obj.InstructionID);
                }
            });
        });
    } else {
        instructionSelectionViewModel.IsEmptyInstructionlist(true);
    }
}
function AddInstructionInfo() {
    workInstructionViewModel.ModelErrorMsg('');
    instructionSelectionViewModel.InstructionSeleErrorMsg('');
    if (instructionSelectionViewModel.SelectedInstrution().length > 0) {
        var selectedList = null;
        if (jQuery.MaintenanceScheduleNamespace.IsSelectedPPE) {
            selectedList = workInstructionViewModel.TaskPPEList;
            workInstructionViewModel.IsTaskPPElistEmpty(false);
        }
        else {
            selectedList = workInstructionViewModel.TaskToolsList;
            workInstructionViewModel.IsTaskToolslistEmpty(false);
        }

        //selectedList.removeAll();
        ko.utils.arrayForEach(instructionSelectionViewModel.InstructionSelectionList(), function (item) {
            ko.utils.arrayForEach(instructionSelectionViewModel.SelectedInstrution(), function (selectedInstructionID) {
                if (item.InstructionID === selectedInstructionID) {
                    //Add into the array
                    var isListExist = false;
                    jQuery.each(selectedList(), function (index, obj) {
                        if (obj.InstructionID === selectedInstructionID) {
                            isListExist = true;
                        }
                    });
                    if (!isListExist) {
                        item.ID = 0;
                        selectedList.push(item);
                    }

                }
            });
        });
        jQuery("#divSelectInstructionModal").modal("hide");
    }
    else {
        instructionSelectionViewModel.InstructionSeleErrorMsg(languageResource.resMsg_PleaseSelectCheckbox);
    }

}
function ClearInstructionCheked() {
    workInstructionViewModel.ModelErrorMsg('');
    instructionSelectionViewModel.InstructionSeleErrorMsg('');
    instructionSelectionViewModel.SelectedInstrution.removeAll();
}
//endregion PPE&Tools method

//region ParameterInfo method
function AddMoreParameter() {
    workInstructionViewModel.ModelErrorMsg('');
    var newParameterObj = new newParameterRow();
    if (workInstructionViewModel.ParameterInfoList().length > 0) {
        var isParameterEmpty = false;
        var isSelectionCodeEmpty = false;
        ko.utils.arrayForEach(workInstructionViewModel.ParameterInfoList(), function (item) {
            var enableDeleteIcon = true;
            if (item.ParameterName() === "") {
                isParameterEmpty = true;
                enableDeleteIcon = false;
            } else if (item.ParameterType() == jQuery.MaintenanceScheduleNamespace.ParameterType.SelectionCode) {
                if (item.SelectionCode() == -1) {
                    isSelectionCodeEmpty = true;
                    enableDeleteIcon = false;
                }
            }
        });
        if (isParameterEmpty) {
            ShowMessage(languageResource.resMsg_PleaseEnterParameterName, "error");
        } else if (isSelectionCodeEmpty) {
            ShowMessage(languageResource.resMsg_PleaseSelectSelectionCode, "error");
        }
        else {
            workInstructionViewModel.ParameterInfoList.push(newParameterObj);
        }

    } else {
        workInstructionViewModel.ParameterInfoList.push(newParameterObj);
    }
}
function DeleteParameterInfo(parameterInfo) {
    workInstructionViewModel.ModelErrorMsg('');
    jQuery("#alertMessage").removeClass("text-danger");
    if (parameterInfo == undefined || parameterInfo.ParameterName() == undefined || parameterInfo.ParameterName() == "") {
        workInstructionViewModel.ParameterInfoList.remove(parameterInfo);
        if (workInstructionViewModel.ParameterInfoList().length == 0) {
            var newParameterObj = new newParameterRow();
            workInstructionViewModel.ParameterInfoList.push(newParameterObj);
        }
    }
    else {
        jQuery("#alertMessage").html(languageResource.resMsg_AreYouSureYouWantToDeleteParameter);
        jQuery("#confirmModal").dialog({
            zIndex: 1060,
            modal: true,
            buttons: [
                {
                    text: languageResource.resMsg_Confirm,
                    click: function () {
                        jQuery("#confirmModal").dialog("close");
                        workInstructionViewModel.ParameterInfoList.remove(parameterInfo);
                        if (workInstructionViewModel.ParameterInfoList().length == 0) {
                            var newParameterObj = new newParameterRow();
                            workInstructionViewModel.ParameterInfoList.push(newParameterObj);
                        }
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
}
//endregion ParameterInfo method

//region Upload Doc/Image
function AddDocumentOrImageOrVideoInfo() {
    workInstructionViewModel.ModelErrorMsg('');
    if (jQuery.MaintenanceScheduleNamespace.TaskGroupIdentifier == 0)
        GetTaskGroupIdentifier();

    var fileName = ""; var isValid = false; var errorMessage = '';
    var fileUploadedThumbnailICon = "";
    var capturedImage = jQuery("#instructionFileUpload").val();
    var downloadPath = jQuery.MaintenanceScheduleNamespace.TaskDocumentPath + "/" + jQuery.MaintenanceScheduleNamespace.BasicParam.SiteID + "/" + jQuery.MaintenanceScheduleNamespace.TaskGroupIdentifier;
    if (capturedImage == 'undefined' || capturedImage == "") {
        errorMessage = languageResource.resMsg_FaliedToUpload;
    }
    else {
        var ext = capturedImage.substring(capturedImage.lastIndexOf('.') + 1).toLowerCase();
        if ((ext == "pdf" || ext == "xls" || ext == "xlsx" || ext == "doc" || ext == "docx" || ext == "txt" || ext == "xps" || ext == "ppt" || ext == "pptx")) {
            var currentDate = new Date();
            currentDateAndTime = currentDate.format("yyyyMMddhhmmss");
            fileName = "Doc_" + currentDateAndTime + "." + ext;
            fileUploadedThumbnailICon = jQuery.MaintenanceScheduleNamespace.ImagePath + "/Styles/Images" + '/' + ext + '.png';
            isValid = true;
            fileType = jQuery.MaintenanceScheduleNamespace.DocumentType.DOCUMENT;

        } else if ((ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg")) {
            var currentDate = new Date();
            currentDateAndTime = currentDate.format("yyyyMMddhhmmss");
            fileName = "Img_" + currentDateAndTime + "." + ext;
            fileUploadedThumbnailICon = downloadPath + "/Thumbnail/" + fileName;
            isValid = true;
            fileType = jQuery.MaintenanceScheduleNamespace.DocumentType.IMAGE;
        }
        else if (ext == "ogg" || ext == "ogv" || ext == "avi" || ext == "mpeg" || ext == "mov" || ext == "wmv" || ext == "flv" || ext == "mp4" || ext == "mpg") {
            var currentDate = new Date();
            currentDateAndTime = currentDate.format("yyyyMMddhhmmss");
            fileName = "Vid_" + currentDateAndTime + "." + ext;
            fileUploadedThumbnailICon = jQuery.MaintenanceScheduleNamespace.ImagePath + "/Styles/Images" + '/video.png';
            isValid = true;
            fileType = jQuery.MaintenanceScheduleNamespace.DocumentType.VIDEO;
        }
        else {
            errorMessage = languageResource.resMsg_InvalidUploadingFormat;
        }
    }

    if (isValid) {
        var urlString = jQuery.MaintenanceScheduleNamespace.UploaderPath + '?uid=' + jQuery.MaintenanceScheduleNamespace.BasicParam.UserID + '&sid=' + jQuery.MaintenanceScheduleNamespace.BasicParam.SiteID + '&tid=' + jQuery.MaintenanceScheduleNamespace.TaskGroupIdentifier + '&fileName=' + fileName + '&taskGroupDoc=true';

        jQuery.ajaxFileUpload({
            type: "POST",
            url: urlString,
            fileElementId: 'instructionFileUpload',
            processData: false,
            success: function (data, status) {
                jQuery("#instructionFileUpload").val('');
                if (data.documentElement.innerText != "true") {
                    ShowMessage(languageResource.resMsg_FaliedToUpload, "error");
                    fileName = '';
                }
                else {
                    var documentInfo = {};
                    documentInfo.DocumentID = 0;
                    documentInfo.DocumentName = fileName;
                    documentInfo.DocumentType = fileType.charCodeAt(0);
                    documentInfo.ThumbnailPath = fileUploadedThumbnailICon;
                    documentInfo.DownloadPath = downloadPath + "/" + fileName;
                    workInstructionViewModel.DocumentOrImageList.push(documentInfo);
                }
            },
            error: function (request, error) {
                jQuery("#instructionFileUpload").val('');
                var errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FaliedToUpload;
                if (request.responseText != "") {
                    var errorMsg = jQuery.parseJSON(request.responseText);
                    if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                        errorMessage = languageResource.resMsg_Error + errorMsg.Message;
                }
                fileName = '';
            }
        });
    }
    else {
        jQuery("#spnIntructionAttachmentError").text(errorMessage);
    }
}
function DownloadDocumentOrImageOrVideoInfo(item) {
    workInstructionViewModel.ModelErrorMsg('');
    if (item.DownloadPath.length > 0 && item.DocumentName.length > 0) {
        var fileName = item.DocumentName;
        var filePath = item.DownloadPath;
        window.location = jQuery.MaintenanceScheduleNamespace.BasePath + "/HandlerFiles/DownloadHandler.ashx?MaintenanceDocsName=" + fileName + "&MaintenanceDocsPath=" + filePath;

    }
    else {
        var errorMessage = '';
        if (item.DocumentType == 'I' || item.DocumentType == 'V') {
            errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToDownloadImageOrVideo;
        }
        else if (item.DocumentType == 'D') {
            errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToDownloadDocument;
        }
        ShowMessage(errorMessage, "error");
    }
}
function DeleteDocumentOrImageOrVideoInfo(documentInfo) {
    workInstructionViewModel.ModelErrorMsg('');
    workInstructionViewModel.DocumentOrImageList.remove(documentInfo);
}

//region CheckBox change event for Remark & TakePicture
function ChkTakePictureChanged(ctrl) {
    var isChecked = jQuery(ctrl).prop("checked"); //Fixing because of IE is not triggering

    if (isChecked) {
        workInstructionViewModel.IsTakePictureVisible(true);
    } else {
        workInstructionViewModel.IsTakePictureVisible(false);
        workInstructionViewModel.IsEnabledTakePictureMandatory(false);
    }
}
function ChkEnterRemarkChanged(ctrl) {
    var isChecked = jQuery(ctrl).prop("checked"); //Fixing because of IE is not triggering

    if (isChecked) {
        workInstructionViewModel.IsEnterRemarkVisible(true);
    } else {
        workInstructionViewModel.IsEnterRemarkVisible(false);
        workInstructionViewModel.IsEnabledEnterRemarkMandatory(false);
    }
}

//creating maintenace group identifier if its not there for manual instruction
function GetTaskGroupIdentifier() {
    workInstructionViewModel.ModelErrorMsg('');
    if (jQuery.MaintenanceScheduleNamespace.MaintScheduleID > 0) {
        var filterInfo = {};
        filterInfo.SiteID = jQuery.MaintenanceScheduleNamespace.BasicParam.SiteID;
        filterInfo.UserID = jQuery.MaintenanceScheduleNamespace.BasicParam.UserID;
        filterInfo.ScheduleID = jQuery.MaintenanceScheduleNamespace.MaintScheduleID;

        jQuery.ajax({
            type: "POST",
            url: jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetTaskGroupIdentifier",
            data: JSON.stringify({ filterInfo: filterInfo }),
            contentType: "application/json; charset=utf-8",
            datatype: 'json',
            async: false,
            success: function (json) {
                if (json != undefined && json.d != undefined && json.d > 0) {
                    jQuery.MaintenanceScheduleNamespace.TaskGroupIdentifier = json.d;
                }
                else {
                    ShowMessage(languageResource.resMsg_FailedToGetWorkInstructionGroupDetails, "error");
                }
            },
            error: function (request, error) {
                var errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToUpdateWorkInstructionDetails;
                if (request.responseText != "") {
                    var errorMsg = jQuery.parseJSON(request.responseText);
                    if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                        errorMessage = languageResource.resMsg_Error + errorMsg.Message;
                }
                ShowMessage(errorMessage, "error");
            }
        });
    }
}

//save work instruction manual task Info
function SaveTaskInformation() {
    var isValid = true;
    if (jQuery.MaintenanceScheduleNamespace.TaskGroupIdentifier == 0)
        GetTaskGroupIdentifier();

    var filterInfo = {};
    filterInfo.SiteID = jQuery.MaintenanceScheduleNamespace.BasicParam.SiteID;
    filterInfo.UserID = jQuery.MaintenanceScheduleNamespace.BasicParam.UserID;
    filterInfo.ScheduleID = jQuery.MaintenanceScheduleNamespace.MaintScheduleID;
    filterInfo.TaskGroupID = jQuery.MaintenanceScheduleNamespace.TaskGroupID;
    filterInfo.Identifier = jQuery.MaintenanceScheduleNamespace.TaskGroupIdentifier;

    var taskInfo = {};
    taskInfo.TaskID = 0; //always create new task //jQuery.MaintenanceScheduleNamespace.TaskID;
    taskInfo.TaskName = workInstructionViewModel.TaskName();
    taskInfo.SequenceNum = 1;
    taskInfo.Description = workInstructionViewModel.TaskDescription();
    taskInfo.SafetyDescription = workInstructionViewModel.SafetyInstruction();
    taskInfo.EstimatedTime = workInstructionViewModel.EstimatedTime().length == 0 ? 0 : workInstructionViewModel.EstimatedTime();
    taskInfo.UnitOfTime = workInstructionViewModel.UnitOfTimeSelectedValue().charCodeAt();
    taskInfo.RemarkEnabled = workInstructionViewModel.IsEnabledEnterRemark();
    taskInfo.RemarkMandatory = workInstructionViewModel.IsEnabledEnterRemarkMandatory();
    taskInfo.PictureEnabled = workInstructionViewModel.IsEnabledTakePicture();
    taskInfo.PictureMandatory = workInstructionViewModel.IsEnabledTakePictureMandatory();

    var ppeInfoList = [];
    ko.utils.arrayForEach(workInstructionViewModel.TaskPPEList(), function (item, index) {
        var ppeInfo = {};
        ppeInfo.TaskPPEID = 0;
        ppeInfo.PPEID = item.InstructionID;
        ppeInfoList.push(ppeInfo);
    });
    taskInfo.PPEInfoList = ppeInfoList;

    var toolsInfoList = [];
    ko.utils.arrayForEach(workInstructionViewModel.TaskToolsList(), function (item, index) {
        var toolsInfo = {};
        toolsInfo.TaskToolsID = 0;
        toolsInfo.ToolsID = item.InstructionID;
        toolsInfoList.push(toolsInfo);
    });

    taskInfo.ToolsInfoList = toolsInfoList;

    var parameterInfoList = [];
    ko.utils.arrayForEach(workInstructionViewModel.ParameterInfoList(), function (item, index) {
        var parameterInfo = {};
        parameterInfo.ParameterID = 0;
        parameterInfo.ParameterName = item.ParameterName();
        parameterInfo.IsMandatory = item.IsParameterMandatory();
        parameterInfo.ParameterType = item.ParameterType().charCodeAt();
        parameterInfo.SelectionGroupID = item.SelectionCode();
        if (parameterInfo.ParameterName != "") {
            parameterInfoList.push(parameterInfo);
        }
    });

    taskInfo.ParameterInfoList = parameterInfoList;

    var documentInfoList = [];
    ko.utils.arrayForEach(workInstructionViewModel.DocumentOrImageList(), function (item, index) {
        var documentInfo = {};
        documentInfo.DocumentID = 0;
        documentInfo.DocumentName = item.DocumentName;
        documentInfo.DocumentType = item.DocumentType;
        documentInfo.ThumbnailPath = item.ThumbnailPath;
        documentInfo.DownloadPath = item.DownloadPath;
        documentInfoList.push(documentInfo);
    });
    taskInfo.DocumentInfoList = documentInfoList;

    var errorMsg = "";
    workInstructionViewModel.ModelErrorMsg('');

    if (taskInfo.TaskName === "") {
        errorMsg += languageResource.resMsg_EnterTaskName + "</br>";
        isValid = false;
    }

    //if (taskInfo.EstimatedTime === 0) {
    //    errorMsg += languageResource.resMsg_PleaseEnterEstimatedTime + "</br>";
    //    isValid = false;
    //}
    if (isNaN(taskInfo.EstimatedTime)) {
        errorMsg += languageResource.resMsg_EstimatedTimeIncorrect + "</br>";
        isValid = false;
    }

    var isSelectionCodeEmpty = false;
    if (taskInfo.ParameterInfoList.length > 0) {
        jQuery.each(taskInfo.ParameterInfoList, function (index, item) {
            if (item.ParameterType == jQuery.MaintenanceScheduleNamespace.ParameterType.SelectionCode.charCodeAt()) {
                if (item.SelectionGroupID == -1) {
                    isSelectionCodeEmpty = true;
                }
            }
        });
        if (isSelectionCodeEmpty) {
            isValid = false;
            errorMsg += languageResource.resMsg_PleaseSelectSelectionCode + "</br>";
        }
    }

    if (!isValid) {
        ShowMessage(errorMsg, "error");
    }
    else {
        jQuery.ajax({
            type: "POST",
            url: jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/UpdateMaintenanceTaskInfo",
            data: JSON.stringify({ filterInfo: filterInfo, taskInfo: taskInfo }),
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data.d != undefined) {
                    var taskGroupIdentifier = data.d;
                    jQuery.MaintenanceScheduleNamespace.TaskGroupID = taskGroupIdentifier.VersionNumber;
                    switch (taskGroupIdentifier.IdentifierID) {
                        case -7:
                            ShowMessage(languageResource.resMsg_TaskParameterNameAlreadyExist, "error");
                            break;
                        default:
                            ShowMessage(languageResource.resMsg_SuccessfullyInsertUpdatedTask, "info");
                            jQuery.MaintenanceScheduleNamespace.TaskID = taskGroupIdentifier.IdentifierID;
                            ClearImportWorkInstruction();
                            break;
                    }
                    LoadManualTaskDetails();
                }
            },
            beforeSend: function () {
                workInstructionViewModel.IsProgressing(true);
            },
            complete: function () {
                workInstructionViewModel.IsProgressing(false);
            },
            error: function (request, error) {
                if (request.responseText != "") {
                    var errorMsg = jQuery.parseJSON(request.responseText);
                    if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                        ShowMessage(errorMsg.Message, "error");
                    else {
                        ShowMessage(languageResource.resMsg_FailedToSaveWorkInstructionInfo, "error");

                    }
                }
                else {
                    ShowMessage(languageResource.resMsg_FailedToSaveWorkInstructionInfo, "error");

                }
            }
        });
    }
}

function ClearImportWorkInstruction() {
    jQuery.MaintenanceScheduleNamespace.TaskGroupInfo = {};
    workInstructionViewModel.SelectedTaskGroupInfo(jQuery.MaintenanceScheduleNamespace.TaskGroupInfo);
    workInstructionViewModel.TaskInfoList.removeAll();
    jQuery("#divSelectTaskGroup span").text("No Task Group Selected");
}

function ClearManualWorkInstruction() {
    workInstructionViewModel.ModelErrorMsg('');
    jQuery.MaintenanceScheduleNamespace.TaskGroupID = 0;
    jQuery.MaintenanceScheduleNamespace.TaskGroupIdentifier = 0;
    jQuery.MaintenanceScheduleNamespace.TaskGroupVersionNumber = 0;
    workInstructionViewModel.TaskName('');
    workInstructionViewModel.TaskDescription('');
    workInstructionViewModel.SafetyInstruction('');
    workInstructionViewModel.EstimatedTime(0);
    workInstructionViewModel.UnitOfTimeSelectedValue('');
    workInstructionViewModel.IsEnabledEnterRemark(false);
    workInstructionViewModel.IsEnabledEnterRemarkMandatory(false);
    workInstructionViewModel.IsEnabledTakePicture(false);
    workInstructionViewModel.IsEnabledTakePictureMandatory(false);
    workInstructionViewModel.TaskPPEList.removeAll();
    workInstructionViewModel.TaskToolsList.removeAll();
    workInstructionViewModel.ParameterInfoList.removeAll();
    workInstructionViewModel.DocumentOrImageList.removeAll();
}
//Load task information
function LoadManualTaskIDForTaskGroup() {
    var filterInfo = {};
    filterInfo.SiteID = jQuery.MaintenanceScheduleNamespace.BasicParam.SiteID;
    filterInfo.UserID = jQuery.MaintenanceScheduleNamespace.BasicParam.UserID;
    filterInfo.TaskGroupID = jQuery.MaintenanceScheduleNamespace.TaskGroupID;

    if (filterInfo.TaskGroupID != undefined && filterInfo.TaskGroupID != "") {
        jQuery.ajax({
            type: "POST",
            url: jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetTaskDetailsForTaskGroup",
            data: JSON.stringify({ filterInfo: filterInfo }),
            contentType: "application/json; charset=utf-8",
            datatype: 'json',
            success: function (json) {
                if (json != undefined && json.d != undefined && json.d.length > 0) {
                    jQuery.MaintenanceScheduleNamespace.TaskID = json.d[0].TaskID;
                    LoadManualTaskDetails();
                }
                else {
                    workInstructionViewModel.TaskName('');
                    workInstructionViewModel.TaskDescription('');
                    workInstructionViewModel.SafetyInstruction('');
                    workInstructionViewModel.EstimatedTime(0);
                    workInstructionViewModel.UnitOfTimeSelectedValue('');
                    workInstructionViewModel.IsEnabledEnterRemark(false);
                    workInstructionViewModel.IsEnabledEnterRemarkMandatory(false);
                    workInstructionViewModel.IsEnabledTakePicture(false);
                    workInstructionViewModel.IsEnabledTakePictureMandatory(false);
                    workInstructionViewModel.TaskPPEList.removeAll();
                    workInstructionViewModel.TaskToolsList.removeAll();
                    workInstructionViewModel.ParameterInfoList.removeAll();
                    workInstructionViewModel.DocumentOrImageList.removeAll();
                    ShowErrorMessagePopUp(languageResource.resMsg_FailedToLoadTaskDetailsForTaskGroup, true);
                }
            },
            error: function (request, error) {
                var errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadTaskDetailsForTaskGroup;
                if (request.responseText != "") {
                    var errorMsg = jQuery.parseJSON(request.responseText);
                    if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                        errorMessage = languageResource.resMsg_Error + errorMsg.Message;
                }
                ShowErrorMessagePopUp(errorMessage, true);
            }
        });
    }
    else
        if (workInstructionViewModel.ParameterInfoList().length == 0)
            AddMoreParameter();
}

function LoadManualTaskDetails() {
    var taskGroupFilterInfo = {};
    taskGroupFilterInfo.IdentifierID = jQuery.MaintenanceScheduleNamespace.TaskGroupIdentifier;
    taskGroupFilterInfo.TaskID = jQuery.MaintenanceScheduleNamespace.TaskID;
    taskGroupFilterInfo.VersionNumber = jQuery.MaintenanceScheduleNamespace.TaskGroupVersionNumber;

    jQuery.ajax({
        type: "POST",
        url: jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetTaskInfo",
        data: JSON.stringify({ basicParam: jQuery.MaintenanceScheduleNamespace.BasicParam, taskFilterInfo: taskGroupFilterInfo }),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data.d != undefined && data.d != null) {
                var taskInfoList = data.d;
                var taskInfo = taskInfoList[0];
                jQuery.each(taskInfoList, function (index, taskInfo) {
                    workInstructionViewModel.TaskName(taskInfo.TaskName);
                    workInstructionViewModel.EstimatedTime(taskInfo.EstimatedTime);
                    workInstructionViewModel.TaskDescription(taskInfo.Description);
                    workInstructionViewModel.SafetyInstruction(taskInfo.SafetyDescription);
                    workInstructionViewModel.UnitOfTimeSelectedValue(String.fromCharCode(taskInfo.UnitOfTime));

                    workInstructionViewModel.TaskPPEList.removeAll();
                    if (taskInfo.PPEInfoList.length > 0) {
                        workInstructionViewModel.IsTaskPPElistEmpty(false);
                        jQuery.each(taskInfo.PPEInfoList, function (index, obj) {
                            var instructions = {};
                            instructions.ID = obj.TaskPPEID;
                            instructions.InstructionID = obj.PPEID;
                            instructions.InstructionName = obj.PPEDescription;
                            instructions.ImagePath = obj.PPEImagePath;
                            workInstructionViewModel.TaskPPEList.push(instructions);
                        });
                    }
                    else {
                        workInstructionViewModel.IsTaskPPElistEmpty(true);
                    }


                    workInstructionViewModel.TaskToolsList.removeAll();
                    if (taskInfo.ToolsInfoList.length > 0) {
                        workInstructionViewModel.IsTaskToolslistEmpty(false);
                        jQuery.each(taskInfo.ToolsInfoList, function (index, obj) {
                            var instructions = {};
                            instructions.ID = obj.TaskToolsID;
                            instructions.InstructionID = obj.ToolsID;
                            instructions.InstructionName = obj.ToolsDescription;
                            instructions.ImagePath = obj.ToolsImagePath;
                            workInstructionViewModel.TaskToolsList.push(instructions);
                        });
                    }
                    else {
                        workInstructionViewModel.IsTaskToolslistEmpty(true);
                    }


                    workInstructionViewModel.IsEnabledEnterRemark(taskInfo.RemarkEnabled);
                    if (taskInfo.RemarkEnabled) {
                        workInstructionViewModel.IsEnterRemarkVisible(true);
                    } else { workInstructionViewModel.IsEnterRemarkVisible(false); }
                    workInstructionViewModel.IsEnabledEnterRemarkMandatory(taskInfo.RemarkMandatory);
                    workInstructionViewModel.IsEnabledTakePicture(taskInfo.PictureEnabled);
                    if (taskInfo.PictureEnabled) {
                        workInstructionViewModel.IsTakePictureVisible(true);
                    }
                    else { workInstructionViewModel.IsTakePictureVisible(false); }
                    workInstructionViewModel.IsEnabledTakePictureMandatory(taskInfo.PictureMandatory);

                    //documents
                    workInstructionViewModel.DocumentOrImageList.removeAll();
                    if (taskInfo.DocumentInfoList.length > 0) {
                        jQuery.each(taskInfo.DocumentInfoList, function (index, obj) {
                            if (String.fromCharCode(obj.DocumentType) == jQuery.MaintenanceScheduleNamespace.DocumentType.VIDEO) {
                                obj.ThumbnailPath = jQuery.MaintenanceScheduleNamespace.ImagePath + "/Styles/Images" + '/video.png';
                            }
                            else if (String.fromCharCode(obj.DocumentType) != jQuery.MaintenanceScheduleNamespace.DocumentType.IMAGE) {
                                var ext = obj.DocumentName.substring(obj.DocumentName.lastIndexOf('.') + 1).toLowerCase();
                                obj.ThumbnailPath = jQuery.MaintenanceScheduleNamespace.ImagePath + "/Styles/Images" + '/' + ext + '.png';
                            }

                            workInstructionViewModel.DocumentOrImageList.push(obj);
                        });
                    }
                    //Only for Show all
                    //if (!taskGroupViewModel.EnableEdit()) {
                    //    for (var key in jQuery.MaintenanceScheduleNamespace.UnitOfTime) {
                    //        if (jQuery.MaintenanceScheduleNamespace.UnitOfTime[key] == String.fromCharCode(taskInfo.UnitOfTime)) {
                    //            workInstructionViewModel.SelectedEstimatedTime(key);
                    //        }
                    //    }
                    //}

                    //Parameter list
                    workInstructionViewModel.ParameterInfoList.removeAll();
                    if (taskInfo.ParameterInfoList.length > 0) {
                        jQuery.each(taskInfo.ParameterInfoList, function (index, obj) {
                            var newParameterObj = new newParameterRow();
                            newParameterObj.ParameterID(obj.ParameterID);
                            newParameterObj.ParameterName(obj.ParameterName);
                            newParameterObj.IsParameterMandatory(obj.IsMandatory);
                            newParameterObj.ParameterType(String.fromCharCode(obj.ParameterType));
                            newParameterObj.isDeleteEnabled(index > 0);
                            if (obj.SelectionGroupID > 0) {
                                newParameterObj.SelectionCode(obj.SelectionGroupID);
                            }
                            if (String.fromCharCode(obj.ParameterType) == jQuery.MaintenanceScheduleNamespace.ParameterType.SelectionCode) {
                                newParameterObj.isSelectionEnabled(true);
                            }
                            //Only for Show all
                            //if (!taskGroupViewModel.EnableEdit()) {
                            //    for (var key in jQuery.MaintenanceScheduleNamespace.ParameterType) {
                            //        if (jQuery.MaintenanceScheduleNamespace.ParameterType[key] == String.fromCharCode(obj.ParameterType)) {
                            //            newParameterObj.SelectedParameterType(key);
                            //        }
                            //    }
                            //    jQuery.each(taskGroupViewModel.SelectionGroupList(), function (i, groupObj) {
                            //        if (groupObj.TypeValue == obj.SelectionGroupID) {
                            //            newParameterObj.SelectedSelectionGroup(groupObj.DisplayName);
                            //        }
                            //    });
                            //}

                            workInstructionViewModel.ParameterInfoList.push(newParameterObj);
                        });

                    }
                    else {
                        var newParameterObj = new newParameterRow();
                        workInstructionViewModel.ParameterInfoList.push(newParameterObj);
                    }
                });
            }
            else {
                ShowMessage(languageResource.resMsg_FailedToLoadTaskInfo, "error");
            }
        },
        beforeSend: function () {
            workInstructionViewModel.IsProgressing(true);
        },
        complete: function () {
            workInstructionViewModel.IsProgressing(false);

        },
        error: function (request, error) {
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                    ShowMessage(errorMsg.Message, "error");
                else {
                    ShowMessage(languageResource.resMsg_FailedToLoadTaskInfo, "error");

                }
            }
            else {
                ShowMessage(languageResource.resMsg_FailedToLoadTaskInfo, "error");
            }
        }
    });

}

//activate or inactivate schedule
function ActivateScheduleConfirm() {
    if (jQuery.MaintenanceScheduleNamespace.MaintScheduleID > 0) {
        jQuery("#alertMessage").removeClass("text-danger");

        var btnActivateSchedule = jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.LoadControlID.replace("btnSaveMaintInfo", "btnActivateSchedule");

        if (jQuery("#" + btnActivateSchedule).text() == languageResource.resMsg_Activate || jQuery("#" + btnActivateSchedule).text() == languageResource.resMsg_ReleaseWorkOrder)
            jQuery("#alertMessage").html(languageResource.resMsg_AreYouSureWantToActivateSchedule);
        else
            jQuery("#alertMessage").html(languageResource.resMsg_AreYouSureWantToInActivateSchedule);

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
                    }
                }
            ]
        });
    }
}

function ActivateSchedule() {
    var filterInfo = {};
    filterInfo.SiteID = jQuery.MaintenanceScheduleNamespace.BasicParam.SiteID;
    filterInfo.UserID = jQuery.MaintenanceScheduleNamespace.BasicParam.UserID;
    filterInfo.MaintScheduleID = jQuery.MaintenanceScheduleNamespace.MaintScheduleID;
    var scheduleType = "";
    switch (jQuery.MaintenanceScheduleNamespace.ScheduleType) {
        case jQuery.MaintenanceScheduleNamespace.ScheduleTypeList.Schedule: scheduleType = "Schedule";
            break;
        case jQuery.MaintenanceScheduleNamespace.ScheduleTypeList.WorkOrder: scheduleType = "WorkOrder";
            break;
        case jQuery.MaintenanceScheduleNamespace.ScheduleTypeList.Inspection: scheduleType = "Inspection";
            break;
    }
    filterInfo.ScheduleType = scheduleType;

    var btnActivateSchedule = jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.LoadControlID.replace("btnSaveMaintInfo", "btnActivateSchedule");
    var serviceMethod = "ActivateMaintenanceSchedule";
    var activate = true;
    if (jQuery("#" + btnActivateSchedule).text() == languageResource.resMsg_InActivate) {
        serviceMethod = "InActivateMaintenanceSchedule";
        activate = false;
    }

    jQuery.ajax({
        type: "POST",
        url: jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/" + serviceMethod,
        data: JSON.stringify({ filterInfo: filterInfo }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        success: function (json) {
            if (json != undefined && json.d != undefined && json.d == true) {
                if (activate) {
                    maintenanceScheduleViewModel.ShowActivateSchedule(false);
                    ShowErrorMessagePopUp(languageResource.resMsg_SuccessfullyActivatedSchedule, false);
                    if (jQuery.MaintenanceScheduleNamespace.ScheduleType == jQuery.MaintenanceScheduleNamespace.ScheduleTypeList.WorkOrder) {
                        maintenanceScheduleViewModel.ShowActivateSchedule(true);
                        jQuery("#" + btnActivateSchedule).text(languageResource.resMsg_InActivate);
                        if (jQuery.MaintenanceScheduleNamespace.ReleaseAccess.toLowerCase() === "full_access")
                            jQuery("#" + btnActivateSchedule).removeAttr("disabled").removeClass("li-disabled");
                    }
                }
                else {
                    var btnActiveText = jQuery.MaintenanceScheduleNamespace.ScheduleType == jQuery.MaintenanceScheduleNamespace.ScheduleTypeList.WorkOrder ? languageResource.resMsg_ReleaseWorkOrder : languageResource.resMsg_Activate;
                    jQuery("#" + btnActivateSchedule).text(btnActiveText);
                    ShowErrorMessagePopUp(languageResource.resMsg_SuccessfullyInActivatedSchedule, false);
                }
                LoadMaintenanceInfoForEdit();
            }
            else {
                if (activate)
                    ShowErrorMessagePopUp(languageResource.resMsg_FailedToActivateSchedule, true);
                else
                    ShowErrorMessagePopUp(languageResource.resMsg_FailedToInActivateSchedule, true);
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
            ShowErrorMessagePopUp(errorMessage, true);
        }
    });
}


//Spare parts
function LoadMaintSparePartsInformation() {
    sparePartsViewModel.ModelErrorMsg('');
    if (jQuery.MaintenanceScheduleNamespace.MaintScheduleID > 0) {
        var filterInfo = {};
        filterInfo.SiteID = jQuery.MaintenanceScheduleNamespace.BasicParam.SiteID;
        filterInfo.UserID = jQuery.MaintenanceScheduleNamespace.BasicParam.UserID;
        filterInfo.MaintScheduleID = jQuery.MaintenanceScheduleNamespace.MaintScheduleID;

        jQuery.ajax({
            type: "POST",
            url: jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetMaintSparePartDetails",
            data: JSON.stringify({ filterInfo: filterInfo }),
            contentType: "application/json; charset=utf-8",
            datatype: 'json',
            success: function (json) {
                if (json != undefined && json.d != undefined && json.d != null) {
                    var length = json.d.length > 0 ? json.d.length : 1;
                    sparePartsViewModel.SparePartInfoList([]);
                    for (var i = 0; i < length; i++) {
                        var sparePartInfo = {};
                        sparePartInfo.MaterialNumber = ko.observable('');
                        sparePartInfo.MaterialDesc = ko.observable('');
                        sparePartInfo.Quantity = ko.observable();
                        sparePartInfo.UOM = ko.observable('');
                        sparePartInfo.IsSOPSparePart = ko.observable(false);
                        sparePartsViewModel.SparePartInfoList.push(sparePartInfo);
                    }

                    jQuery("#tbodySparePartInfoList select").each(function (i, ctrl) {
                        jQuery(ctrl).select2({ width: '50%' });
                        if (json.d.length > 0) {
                            jQuery(ctrl).val(json.d[i].MaterialNumber);
                            jQuery(ctrl).trigger("change");

                            var item = sparePartsViewModel.SparePartInfoList()[i];
                            item.MaterialNumber(json.d[i].MaterialNumber);
                            item.MaterialDesc(json.d[i].MaterialDesc);
                            item.Quantity(json.d[i].Quantity);
                            item.UOM(json.d[i].UOM);
                            item.IsSOPSparePart(json.d[i].IsSOPSparePart);
                        }
                    });

                    if (json.d.length > 0) {
                        var btnSaveSparePartInfo = jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.LoadControlID.replace("btnSaveMaintInfo", "btnSaveSparePartInfo");
                        jQuery("#" + btnSaveSparePartInfo).text(languageResource.resMsg_Update);
                    }
                }
                else {
                    ShowErrorMessage(languageResource.resMsg_FailedToLoadSparePartInfo, "error");
                }
            },
            beforeSend: function () {
                jQuery("#divSparePartProgress").removeClass("hide");
            },
            complete: function () {
                jQuery("#divSparePartProgress").addClass("hide");
            },
            error: function (request, error) {
                var msg = languageResource.resMsg_FailedToLoadSparePartInfo;
                var errorMessage = languageResource.resMsg_Error + msg;
                if (request.responseText != "") {
                    var errorMsg = jQuery.parseJSON(request.responseText);
                    if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                        errorMessage = languageResource.resMsg_Error + errorMsg.Message;
                }
                ShowErrorMessage(errorMessage, "error");
            }
        });
    }
}

function AddMoreSparePartRow() {
    sparePartsViewModel.ModelErrorMsg('');
    var sparePartInfo = {};
    sparePartInfo.MaterialNumber = ko.observable('');
    sparePartInfo.MaterialDesc = ko.observable('');
    sparePartInfo.Quantity = ko.observable();
    sparePartInfo.UOM = ko.observable('');
    sparePartInfo.IsSOPSparePart = ko.observable(false);
    var isParameterEmpty = false;
    var errorMessage = "";

    ko.utils.arrayForEach(sparePartsViewModel.SparePartInfoList(), function (item) {
        if (item.MaterialNumber() === "") {
            isParameterEmpty = true;
            errorMessage += languageResource.resMsg_PleaseSelectSpareParts + "<br/>";
        }
        else if (item.Quantity() == undefined || item.Quantity() === "") {
            isParameterEmpty = true;
            errorMessage += languageResource.resMsg_PleaseEnterQuantity + "<br/>";
        }
    });

    if (isParameterEmpty) {
        ShowErrorMessage(errorMessage, "error");
    }
    else {
        sparePartsViewModel.SparePartInfoList.push(sparePartInfo);
    }

    jQuery("#tbodySparePartInfoList select:last").each(function () {
        jQuery(this).select2({ width: '50%' });
    });
}

function DeleteSparePartRow(data, index) {
    sparePartsViewModel.ModelErrorMsg('');
    if (data.MaterialNumber() == undefined || data.MaterialNumber() == "") {
        sparePartsViewModel.SparePartInfoList.splice(index(), 1);
        if (sparePartsViewModel.SparePartInfoList().length == 0)
            AddMoreSparePartRow();
    }
    else {
        jQuery("#alertMessage").removeClass("text-danger");
        jQuery("#alertMessage").html(languageResource.resMsg_AreYouSureWantToDeleteSparePart);
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
                        DeleteMaintSparePartInfo(index(), data.MaterialNumber());
                    }
                },
                {
                    text: languageResource.resMsg_Cancel,
                    click: function () {
                        jQuery("#confirmModal").dialog("close");
                    }
                }
            ]
        });
    }
}

function LoadSparePartMaterialList() {
    var basicParam = {};
    basicParam.SiteID = jQuery.MaintenanceScheduleNamespace.BasicParam.SiteID;
    basicParam.UserID = jQuery.MaintenanceScheduleNamespace.BasicParam.UserID;

    jQuery.ajax({
        type: "POST",
        url: jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetSparePartMaterialDetails",
        data: JSON.stringify({ basicParam: basicParam }),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data.d !== null) {
                var material = {};
                jQuery.each(data.d, function (index, value) {
                    material.MaterialNumber = value.MaterialNumber;
                    material.MaterialDesc = value.MaterialDesc;
                    material.UOM = value.UOM;
                    material.DisplayName = value.MaterialNumber + ' - ' + value.MaterialDesc;

                    sparePartsViewModel.SparePartMaterialList.push(material);
                    material = {};
                });
            } else {
                ShowErrorMessage(languageResource.resMsg_FailedToLoadDropdown, "error");
            }
        },
        error: function (request, error) {
            var errorMessage = languageResource.resMsg_FailedToLoadDropdown;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                    errorMessage = errorMsg;
            }
            ShowErrorMessage(languageResource.resMsg_Error + errorMessage, "error");
        }
    });
}

function OnSparePartChange(data, event) {
    var selectedMaterial = jQuery(event.target).val();
    if (selectedMaterial != "") {
        var itemExists = ko.utils.arrayFirst(sparePartsViewModel.SparePartInfoList(), function (item) { return item.MaterialNumber() == selectedMaterial; });
        if (itemExists) {
            ShowErrorMessagePopUp(languageResource.resMsg_MaterialIsAlreadySelected);
            jQuery(event.target).val("");
            jQuery(event.target).trigger("change");
        }
        else {
            var selectedItem = ko.utils.arrayFirst(sparePartsViewModel.SparePartMaterialList(), function (item) { return item.MaterialNumber == selectedMaterial; });
            if (selectedItem != undefined && selectedItem != null) {
                data.MaterialNumber(selectedItem.MaterialNumber);
                data.MaterialDesc(selectedItem.MaterialDesc);
                data.UOM(selectedItem.UOM);
            }
        }
    }
    else {
        data.MaterialNumber('');
        data.MaterialDesc('');
        data.UOM('');
    }
}

function SaveSparePartInformation() {
    var isValid = true;
    var errorMessage = "";
    sparePartsViewModel.ModelErrorMsg("");

    if (sparePartsViewModel.SparePartInfoList().length > 0) {
        var hasItem = ko.utils.arrayFirst(sparePartsViewModel.SparePartInfoList(), function (item) { return item.MaterialNumber().length > 0; });
        if (hasItem == undefined || hasItem == null) {
            isValid = false;
            errorMessage += languageResource.resMsg_PleaseSelectSpareParts + "<br/>";
        }

        if (isValid) {
            var selectedSparePartList = ko.utils.arrayFilter(sparePartsViewModel.SparePartInfoList(), function (item) { return item.MaterialNumber().length > 0; });
            var quantityNotExists = ko.utils.arrayFirst(selectedSparePartList, function (item) { return item.Quantity() == undefined || item.Quantity() == "" || isNaN(item.Quantity()) || item.Quantity().length > 10 });
            if (quantityNotExists) {
                isValid = false;
                errorMessage += languageResource.resMsg_PleaseEnterQuantity + "<br/>";
            }
        }
    }

    if (isValid) {
        var sparePartDetails = {};
        sparePartDetails.SiteID = jQuery.MaintenanceScheduleNamespace.BasicParam.SiteID;
        sparePartDetails.UserID = jQuery.MaintenanceScheduleNamespace.BasicParam.UserID;
        sparePartDetails.ScheduleID = jQuery.MaintenanceScheduleNamespace.MaintScheduleID;
        sparePartDetails.SparePartList = [];
        ko.utils.arrayForEach(sparePartsViewModel.SparePartInfoList(), function (item) {
            if (item.MaterialNumber().length > 0 && item.IsSOPSparePart() == false) {
                var sparePartInfo = {};
                sparePartInfo.MaterialNumber = item.MaterialNumber();
                sparePartInfo.MaterialDesc = item.MaterialDesc();
                sparePartInfo.Quantity = item.Quantity();
                sparePartInfo.UOM = item.UOM();
                sparePartDetails.SparePartList.push(sparePartInfo);
            }
        });

        jQuery.ajax({
            type: "POST",
            url: jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/SaveMaintSparePartInfo",
            data: JSON.stringify({ maintSparePartDetails: sparePartDetails }),
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data.d !== null && data.d == true) {
                    var btnSaveSparePartInfo = jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.LoadControlID.replace("btnSaveMaintInfo", "btnSaveSparePartInfo");
                    jQuery("#" + btnSaveSparePartInfo).text(languageResource.resMsg_Update);
                    ShowErrorMessage(languageResource.resMsg_SuccessfullyUpdatedSparePartInfo, "info");
                }
                else {
                    ShowErrorMessage(languageResource.resMsg_FailedToUpdateSparePartInfo, "error");
                }
            },
            error: function (request, error) {
                var errorMessage = languageResource.resMsg_FailedToUpdateSparePartInfo;
                if (request.responseText != "") {
                    var errorMsg = jQuery.parseJSON(request.responseText);
                    if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                        errorMessage = errorMsg.Message;
                }
                ShowErrorMessage(languageResource.resMsg_Error + errorMessage, "error");
            }
        });
    }
    else {
        ShowErrorMessage(errorMessage, "error");
    }
}

function DeleteMaintSparePartInfo(index, sparPartID) {
    var filterInfo = {};
    filterInfo.SiteID = jQuery.MaintenanceScheduleNamespace.BasicParam.SiteID;
    filterInfo.UserID = jQuery.MaintenanceScheduleNamespace.BasicParam.UserID;
    filterInfo.ScheduleID = jQuery.MaintenanceScheduleNamespace.MaintScheduleID;
    filterInfo.SparePartID = sparPartID;

    jQuery.ajax({
        type: "POST",
        url: jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/DeleteMaintSparePartInfo",
        data: JSON.stringify({ filterInfo: filterInfo }),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data.d !== null && data.d == true) {
                sparePartsViewModel.SparePartInfoList.splice(index, 1);
                if (sparePartsViewModel.SparePartInfoList().length == 0)
                    AddMoreSparePartRow();
            }
            else {
                ShowErrorMessage(languageResource.resMsg_FailedToDeleteSparePartInfo, "error");
            }
        },
        error: function (request, error) {
            var errorMessage = languageResource.resMsg_FailedToDeleteSparePartInfo;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                    errorMessage = errorMsg.Message;
            }
            ShowErrorMessage(languageResource.resMsg_Error + errorMessage, "error");
        }
    });
}

//Attachments
function LoadAttachmentInfo() {
    attachmentViewModel.ModelErrorMsg('');
    if (jQuery.MaintenanceScheduleNamespace.MaintScheduleID > 0) {
        var filterInfo = {};
        filterInfo.SiteID = jQuery.MaintenanceScheduleNamespace.BasicParam.SiteID;
        filterInfo.UserID = jQuery.MaintenanceScheduleNamespace.BasicParam.UserID;
        filterInfo.MaintScheduleID = jQuery.MaintenanceScheduleNamespace.MaintScheduleID;

        jQuery.ajax({
            type: "POST",
            url: jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetAttachmentDetailsForSchedule",
            data: JSON.stringify({ filterInfo: filterInfo }),
            contentType: "application/json; charset=utf-8",
            datatype: 'json',
            success: function (json) {
                if (json != undefined && json.d != undefined && json.d != null) {
                    if (json.d.length > 0) {
                        attachmentViewModel.AttachmentList([]);
                        ko.utils.arrayForEach(json.d, function (item) {
                            var ext = item.DocumentName.substring(item.DocumentName.lastIndexOf('.') + 1).toLowerCase();
                            var type = GetAttachmentType(ext);
                            if (type == jQuery.MaintenanceScheduleNamespace.DocumentType.DOCUMENT) {
                                item.ThumbnailPath = jQuery.MaintenanceScheduleNamespace.ImagePath + '/Styles/Images/' + ext + '.png';
                            }
                            else if (type == jQuery.MaintenanceScheduleNamespace.DocumentType.VIDEO) {
                                item.ThumbnailPath = jQuery.MaintenanceScheduleNamespace.ImagePath + '/Styles/Images/video.png';
                            }
                            attachmentViewModel.AttachmentList.push(item);
                        });
                    }
                }
                else {
                    ShowErrorMessage(languageResource.resMsg_FailedToLoadAttachmentInfo, "error");
                }
            },
            beforeSend: function () {
                jQuery("#divAttachmentProgress").removeClass("hide");
            },
            complete: function () {
                jQuery("#divAttachmentProgress").addClass("hide");
            },
            error: function (request, error) {
                var msg = languageResource.resMsg_FailedToLoadAttachmentInfo;
                var errorMessage = languageResource.resMsg_Error + msg;
                if (request.responseText != "") {
                    var errorMsg = jQuery.parseJSON(request.responseText);
                    if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                        errorMessage = languageResource.resMsg_Error + errorMsg.Message;
                }
                ShowErrorMessage(errorMessage, "error");
            }
        });
    }
}

function GetAttachmentType(ext) {
    if (ext == "pdf" || ext == "xls" || ext == "xlsx" || ext == "doc" || ext == "docx" || ext == "txt" || ext == "xps" || ext == "ppt" || ext == "pptx") {
        return jQuery.MaintenanceScheduleNamespace.DocumentType.DOCUMENT;

    } else if (ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg") {
        return jQuery.MaintenanceScheduleNamespace.DocumentType.IMAGE;
    }
    else if (ext == "ogg" || ext == "ogv" || ext == "avi" || ext == "mpeg" || ext == "mov" || ext == "wmv" || ext == "flv" || ext == "mp4" || ext == "mpg") {
        return jQuery.MaintenanceScheduleNamespace.DocumentType.VIDEO;
    }
    return 'INVALID_FORMAT';
}

function UploadAttachment() {
    attachmentViewModel.ModelErrorMsg('');
    var capturedFile = jQuery("#fileUpload").val();
    var downloadPath = jQuery.MaintenanceScheduleNamespace.MaintScheduleAttachmentPath + "/" + jQuery.MaintenanceScheduleNamespace.BasicParam.SiteID + "/" + jQuery.MaintenanceScheduleNamespace.MaintScheduleID;
    var isValid = false;
    var errorMessage = "";
    var fileUploadedICon = "";

    var fileName = capturedFile.substring(capturedFile.lastIndexOf('\\') + 1);
    var ext = capturedFile.substring(capturedFile.lastIndexOf('.') + 1).toLowerCase();
    var type = GetAttachmentType(ext);
    if (type == jQuery.MaintenanceScheduleNamespace.DocumentType.DOCUMENT) {
        fileUploadedICon = jQuery.MaintenanceScheduleNamespace.ImagePath + '/Styles/Images/' + ext + '.png';
        isValid = true;

    } else if (type == jQuery.MaintenanceScheduleNamespace.DocumentType.IMAGE) {
        fileUploadedICon = downloadPath + "/Thumbnail/" + fileName;
        isValid = true;
    }
    else if (type == jQuery.MaintenanceScheduleNamespace.DocumentType.VIDEO) {
        fileUploadedICon = jQuery.MaintenanceScheduleNamespace.ImagePath + '/Styles/Images/video.png';
        isValid = true;
    }
    else {
        errorMessage = languageResource.resMsg_InvalidUploadingFormat;
    }

    if (isValid) {
        var urlString = jQuery.MaintenanceScheduleNamespace.UploaderPath + '?uid=' + jQuery.MaintenanceScheduleNamespace.BasicParam.UserID + '&sid=' + jQuery.MaintenanceScheduleNamespace.BasicParam.SiteID + '&msid=' + jQuery.MaintenanceScheduleNamespace.MaintScheduleID + '&fileName=' + fileName + '&maintSchdAttachment=true';

        jQuery.ajaxFileUpload({
            type: "POST",
            url: urlString,
            fileElementId: 'fileUpload',
            processData: false,
            success: function (data, status) {
                jQuery("#fileUpload").val('');
                if (data.documentElement.innerText != "true") {
                    ShowErrorMessage(languageResource.resMsg_FaliedToUpload, "error");
                }
                else {
                    var attachmentInfo = {};
                    attachmentInfo.DocumentID = 0;
                    attachmentInfo.DocumentName = fileName;
                    attachmentInfo.DocumentType = type;
                    attachmentInfo.ThumbnailPath = fileUploadedICon;
                    attachmentInfo.DownloadPath = downloadPath + "/" + fileName;
                    SaveAttachmentInfo(fileName, attachmentInfo);
                }
            },
            error: function (request, error) {
                jQuery("#fileUpload").val('');
                var errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FaliedToUpload;
                if (request.responseText != "") {
                    var errorMsg = jQuery.parseJSON(request.responseText);
                    if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                        errorMessage = languageResource.resMsg_Error + errorMsg.Message;
                }
                ShowErrorMessage(errorMessage, "error");
            }
        });
    }
    else {
        ShowErrorMessage(errorMessage, "error");
    }
}

function SaveAttachmentInfo(fileName, attachmentInfo) {
    attachmentViewModel.ModelErrorMsg('');
    var documentFilterInfo = {};
    documentFilterInfo.SiteID = jQuery.MaintenanceScheduleNamespace.BasicParam.SiteID;
    documentFilterInfo.UserID = jQuery.MaintenanceScheduleNamespace.BasicParam.UserID;
    documentFilterInfo.ReferenceID = jQuery.MaintenanceScheduleNamespace.MaintScheduleID;
    documentFilterInfo.DocumentName = fileName;
    documentFilterInfo.DocumentType = attachmentInfo.DocumentType.charCodeAt();
    documentFilterInfo.InfoType = jQuery.MaintenanceScheduleNamespace.DocumentInfoType.MaintenanceAttachment.charCodeAt();

    jQuery.ajax({
        type: "POST",
        url: jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/InsertDocumentsAndImagesInfo",
        data: JSON.stringify({ filterInfo: documentFilterInfo }),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data.d !== null && data.d != undefined) {
                if (data.d > 0) {
                    attachmentInfo.DocumentID = data.d;
                    attachmentViewModel.AttachmentList.push(attachmentInfo);
                }
                else if (data.d == -2) {
                    ShowErrorMessage(languageResource.resMsg_AttachmentNameAlreadyExists, "error");
                }
                else {
                    ShowErrorMessage(languageResource.resMsg_FailedToUpdateAttachmentInfo, "error");
                }
            }
            else {
                ShowErrorMessage(languageResource.resMsg_FailedToUpdateAttachmentInfo, "error");
            }
        },
        error: function (request, error) {
            var errorMessage = languageResource.resMsg_FailedToUpdateAttachmentInfo;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                    errorMessage = errorMsg.Message;
            }
            ShowErrorMessage(languageResource.resMsg_Error + errorMessage, "error");
        }
    });
}

function DownloadAttachment(data) {
    attachmentViewModel.ModelErrorMsg('');
    var fileName = data.DocumentName;
    var filePath = data.DownloadPath;
    var ext = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
    var type = GetAttachmentType(ext);

    if (type == jQuery.MaintenanceScheduleNamespace.DocumentType.VIDEO && (ext == "mp4" || ext == "ogg")) {
        jQuery("#divLoadMediaContent").html("<video id='videoCtrl' width='98%' height='98%' autoplay controls><source src='" + filePath + "' type='video/" + ext + "'></video>");
        jQuery("#divVideoPhotoModal").modal('show');
        var videoCtrl = document.getElementById('videoCtrl');
        jQuery("#divVideoPhotoModal").on('hide.bs.modal', function () {
            videoCtrl.pause();
            videoCtrl.removeAttribute('src');
        });
    }
    else if (type == jQuery.MaintenanceScheduleNamespace.DocumentType.IMAGE) {
        jQuery("#divLoadMediaContent").html("<img style='width:98%;height:98%;' src='" + filePath + "' />");
        jQuery("#divLoadMediaContent>img").css("height", "");
        jQuery("#divVideoPhotoModal").modal('show');
    }
    else {
        window.location = jQuery.MaintenanceScheduleNamespace.BasePath + "/HandlerFiles/DownloadHandler.ashx?MaintenanceDocsName=" + fileName + "&MaintenanceDocsPath=" + filePath;
    }
}

function DeleteAttachment(data, index) {
    attachmentViewModel.ModelErrorMsg('');
    jQuery("#alertMessage").removeClass("text-danger");
    jQuery("#alertMessage").html(languageResource.resMsg_AreYouSureWantToDeleteAttachment);
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
                    DeleteAttachmentInfo(data, index);
                }
            },
            {
                text: languageResource.resMsg_Cancel,
                click: function () {
                    jQuery("#confirmModal").dialog("close");
                }
            }
        ]
    });
}

function DeleteAttachmentInfo(data, index) {
    var basicParam = {};
    basicParam.SiteID = jQuery.MaintenanceScheduleNamespace.BasicParam.SiteID;
    basicParam.UserID = jQuery.MaintenanceScheduleNamespace.BasicParam.UserID;

    jQuery.ajax({
        type: "POST",
        url: jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/DeleteDocumentsAndImagesInfo",
        data: JSON.stringify({ basicParam: basicParam, documentID: data.DocumentID }),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data.d !== null && data.d != undefined && data.d == true) {
                attachmentViewModel.AttachmentList.splice(index(), 1);
            }
            else {
                ShowErrorMessage(languageResource.resMsg_FailedToDeleteAttachmentInfo, "error");
            }
        },
        error: function (request, error) {
            var errorMessage = languageResource.resMsg_FailedToDeleteAttachmentInfo;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                    errorMessage = errorMsg.Message;
            }
            ShowErrorMessage(languageResource.resMsg_Error + errorMessage, "error");
        }
    });
}

//some common page methods
function ShowErrorMessagePopUp(msg, isError) {
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

function ShowErrorMessage(message, messageType) {
    var messageModel = maintenanceScheduleViewModel;
    if (jQuery.MaintenanceScheduleNamespace.CurrentPage == jQuery.MaintenanceScheduleNamespace.PagesList.Maintenance)
        messageModel = maintenanceScheduleViewModel;
    else if (jQuery.MaintenanceScheduleNamespace.CurrentPage == jQuery.MaintenanceScheduleNamespace.PagesList.WorkInstruction)
        messageModel = workInstructionViewModel;
    else if (jQuery.MaintenanceScheduleNamespace.CurrentPage == jQuery.MaintenanceScheduleNamespace.PagesList.SpareParts)
        messageModel = sparePartsViewModel;
    else if (jQuery.MaintenanceScheduleNamespace.CurrentPage == jQuery.MaintenanceScheduleNamespace.PagesList.Attachments)
        messageModel = attachmentViewModel;

    messageModel.ModelErrorVisible(true);
    switch (messageType.toLowerCase()) {
        case 'info':
            messageModel.ModelErrorCss("text-info");
            messageModel.ModelErrorMsg(message);
            break;
        case 'error':
            messageModel.ModelErrorCss("text-danger");
            messageModel.ModelErrorMsg(message);
            break;
    }
}

jQuery(document).ready(function () {
    jQuery("input[type='radio']").click(function () {
        jQuery.MaintenanceScheduleNamespace.FLocationID = 0;
        jQuery.MaintenanceScheduleNamespace.EquipmentID = 0;
        jQuery("#txtFLocationOrEquipmentName").val('');
        var radioValue = jQuery("input[name='rdbFloactionOrEquipment']:checked").val();
        if (radioValue == "flocation") {
            locationEquipmentViewModel.IsEquipemntSelected(false);
        }
        else {
            locationEquipmentViewModel.IsEquipemntSelected(true);
        }
    });

    jQuery("#lblRdbEquipment").on('click', function () {
        jQuery("#rdbEquipment").prop("checked", true).trigger('click');
    });
    jQuery("#lblRdbLocation").on('click', function () {
        jQuery("#rdbLocation").prop("checked", true).trigger('click');
    });

    document.onkeydown = function (evt) {
        evt = evt || window.event;
        var isEscape = false;
        if ("key" in evt) {
            isEscape = (evt.key === "Escape" || evt.key === "Esc");
        } else {
            isEscape = (evt.keyCode === 27);
        }
        if (isEscape && jQuery('#divSelectTaskGroupModal').hasClass('in')) {
            jQuery("#divSelectTaskGroupModal").modal("hide");
        }
    };
});

function AutosizeTextArea(textArea) {
    setTimeout(function () {
        textArea.style.cssText = 'height:auto; padding:0';
        textArea.style.cssText = 'height:' + textArea.scrollHeight + 'px; min-height: 85px;';
    }, 0);
}

$(function () {
    $('.btn-circle').on('click', function () {
        maintenanceScheduleViewModel.ModelErrorMsg("");
        workInstructionViewModel.ModelErrorMsg("");

        var name = jQuery(this).attr("id");
        if (name == "btnMaintInfo") {
            jQuery('#divTabInfo a').attr('style', 'color:black');
            LoadMaintenanceSchedulePage(jQuery.MaintenanceScheduleNamespace.PagesList.Maintenance);
        }
        else {
            //enable below buttons only if maintenance information exists
            if (jQuery.MaintenanceScheduleNamespace.MaintScheduleID > 0) {
                jQuery('#divTabInfo a').attr('style', 'color:black');
                if (name == "btnWorkInstruction") {
                    LoadMaintenanceSchedulePage(jQuery.MaintenanceScheduleNamespace.PagesList.WorkInstruction);
                }
                else if (name == "btnScheduleInfo") {
                    LoadMaintenanceSchedulePage(jQuery.MaintenanceScheduleNamespace.PagesList.Schedule);
                }
                else if (name == "btnSpareParts") {
                    LoadMaintenanceSchedulePage(jQuery.MaintenanceScheduleNamespace.PagesList.SpareParts);
                }
                else if (name == "btnAttachments") {
                    LoadMaintenanceSchedulePage(jQuery.MaintenanceScheduleNamespace.PagesList.Attachments);
                }
            }
        }
    });

    jQuery('#divTabInfo a').on('click', function () {
        jQuery(this).closest('.process-step').find('.btn-circle').triggerHandler('click');
    });
});

function ConvertObjectToKeyValuePair(obj) {
    var arr = [];
    for (let key in obj) {
        arr.push({ "Key": key, "Value": obj[key] });
    }
    return arr;
}

function LoadIframe(urlPath) {
    jQuery('#iFrameScheduleInfo').attr('src', urlPath);
}

function LoadShowCompleteTaskIframe(urlPath) {
    jQuery('#iFrameCompleteTaskDetail').attr('src', urlPath);
}

function ManageSiteMapUrl() {
    if (jQuery.MaintenanceScheduleNamespace.ScheduleType == jQuery.MaintenanceScheduleNamespace.ScheduleTypeList.Schedule) {
        var scheduleURL = jQuery.MaintenanceScheduleNamespace.BasePath + "/Preventive/ManageSchedule.aspx?id=" + jQuery.MaintenanceScheduleNamespace.BasicParam.SiteID;
        jQuery("#SiteMap1_SkipLink").prev().prev().append("<span><a title='" + languageResource.resMsg_ManageSchedule + "' href='" + scheduleURL + "'>" + languageResource.resMsg_ManageSchedule + "</a></span><span> > </span>");

        jQuery("#lnkAdminTab,#A1").attr("isSetDefault", "false");
        jQuery("#lnkAdminTab").attr("href", scheduleURL); // Set herf value
        jQuery("#A1").attr("href", scheduleURL); // Set herf value
    }
    else if (jQuery.MaintenanceScheduleNamespace.ScheduleType == jQuery.MaintenanceScheduleNamespace.ScheduleTypeList.WorkOrder) {
        if (jQuery.MaintenanceScheduleNamespace.NotificationID > 0) {
            if (jQuery.MaintenanceScheduleNamespace.IsFromManageNotify) {
                var workOrderURL = jQuery.MaintenanceScheduleNamespace.BasePath + "/Preventive/ManageNotification.aspx?id=" + jQuery.MaintenanceScheduleNamespace.BasicParam.SiteID;
                jQuery("#SiteMap1_SkipLink").prev().prev().append("<span><a title='" + languageResource.resMsg_ManageNotification + "' href='" + workOrderURL + "'>" + languageResource.resMsg_ManageNotification + "</a></span><span> > </span>");
            }
            else {
                var workOrderURL = jQuery.MaintenanceScheduleNamespace.BasePath + "/Preventive/AddNotificationInfo.aspx?id=" + jQuery.MaintenanceScheduleNamespace.BasicParam.SiteID + "&nid=" + jQuery.MaintenanceScheduleNamespace.NotificationID;
                jQuery("#SiteMap1_SkipLink").prev().prev().append("<span><a title='" + languageResource.resMsg_NotificationInfo + "' href='" + workOrderURL + "'>" + languageResource.resMsg_NotificationInfo + "</a></span><span> > </span>");
            }
        }
        else {
            var workOrderURL = jQuery.MaintenanceScheduleNamespace.BasePath + "/Preventive/ManageWorkOrder.aspx?id=" + jQuery.MaintenanceScheduleNamespace.BasicParam.SiteID;
            jQuery("#SiteMap1_SkipLink").prev().prev().append("<span><a title='" + languageResource.resMsg_ManageWorkOrder + "' href='" + workOrderURL + "'>" + languageResource.resMsg_ManageWorkOrder + "</a></span><span> > </span>");
        }

        jQuery("#lnkAdminTab,#A1").attr("isSetDefault", "false");
        jQuery("#lnkAdminTab").attr("href", workOrderURL); // Set herf value
        jQuery("#A1").attr("href", workOrderURL); // Set herf value
    }
}

//FLocation or Equipment selection
function ShowFLocationEquipmentModal() {
    ClearEquipmentFLocationInfo();
    jQuery("#divSelectEquipmentFLocationModal").modal("show");
    jQuery("#hdfEquipmentSortValue").val("");
    jQuery(".fa-sort-down").removeClass('fa fa-sort-down');
    jQuery(".fa-sort-up").removeClass('fa fa-sort-up');
    LoadAllEquipmentFLoaction(jQuery.MaintenanceScheduleNamespace.EquipmentPagerData);
}

function SearchEquipmentFLoaction() {
    var isSearch = true;
    var msg = "";
    if (!locationEquipmentViewModel.IsEquipemntSelected() && jQuery.trim(jQuery("#txtSearchLocation").val()).length == 0) {
        isSearch = false;
        msg = languageResource.resMsg_SearchCriteria;
    }
    else if (jQuery.trim(jQuery("#txtSearchLocation").val()).length == 0 && locationEquipmentViewModel.SelectedCategoryFilterArray().length == 0) {
        isSearch = false;
        msg = languageResource.resMsg_SearchCriteria;
    }
    if (isSearch) {
        jQuery.MaintenanceScheduleNamespace.IsMaintTypeSearch = true;
        jQuery("#spnEquipmentFLocationSearchError").text('');
        jQuery("#btnShowAllEquipment").show();
        LoadAllEquipmentFLoaction(jQuery.MaintenanceScheduleNamespace.EquipmentPagerData);
    }
    else {
        jQuery.MaintenanceScheduleNamespace.IsMaintTypeSearch = false;
        jQuery("#spnEquipmentFLocationSearchError").text(msg);
    }
}

function ShowAllEquipmentFLoaction() {
    ClearEquipmentFLocationInfo();
    LoadAllEquipmentFLoaction(jQuery.MaintenanceScheduleNamespace.EquipmentPagerData);
}

function SortEquipmentTabs(thValue, value) {
    var thClass = "";
    var hasSortUpClassExist = jQuery("#" + thValue + " i").hasClass('fa-sort-up');
    var hasSortDownExist = jQuery("#" + thValue + " i").hasClass('fa-sort-down');

    if (hasSortUpClassExist == false && hasSortDownExist == false) {
        jQuery(".fa-sort-down").removeClass('fa fa-sort-down');
        jQuery(".fa-sort-up").removeClass('fa fa-sort-up');

        jQuery("#" + thValue + " i").addClass('fa fa-sort-up');
        thClass = value + "_asc";
        jQuery("#hdfEquipmentSortValue").val(thClass);
        LoadAllEquipmentFLoaction(jQuery.MaintenanceScheduleNamespace.EquipmentPagerData);
        return false;
    }
    if (jQuery("#" + thValue + " i").hasClass('fa-sort-up')) {
        jQuery(".fa-sort-down").removeClass('fa fa-sort-down');
        jQuery(".fa-sort-up").removeClass('fa fa-sort-up');

        jQuery("#" + thValue + " i").addClass('fa fa-sort-down');
        thClass = value + "_desc";
        jQuery("#hdfEquipmentSortValue").val(thClass);
        LoadAllEquipmentFLoaction(jQuery.MaintenanceScheduleNamespace.EquipmentPagerData);
        return false;
    }
    if (jQuery("#" + thValue + " i").hasClass('fa-sort-down')) {
        jQuery(".fa-sort-down").removeClass('fa fa-sort-down');
        jQuery(".fa-sort-up").removeClass('fa fa-sort-up');

        jQuery("#" + thValue + " i").addClass('fa fa-sort-up');
        thClass = value + "_asc";
        jQuery("#hdfEquipmentSortValue").val(thClass);
        LoadAllEquipmentFLoaction(jQuery.MaintenanceScheduleNamespace.EquipmentPagerData);
        return false;
    }
}

function LoadAllEquipmentFLoaction(pagerData) {
    if (locationEquipmentViewModel.IsEquipemntSelected()) {
        LoadEquipmentList(pagerData);
    }
    else {
        LoadFLocationList(pagerData);
    }
}

function LoadFLocationList(pagerData) {
    var filterFLocationInfo = {};
    filterFLocationInfo.SiteID = pagerData.SiteID;
    filterFLocationInfo.UserID = pagerData.UserID;
    filterFLocationInfo.PageIndex = pagerData.PageIndex;
    filterFLocationInfo.PageSize = pagerData.PageSize;
    filterFLocationInfo.FLocationID = jQuery.MaintenanceScheduleNamespace.FLocationID;

    if (jQuery.MaintenanceScheduleNamespace.IsMaintTypeSearch)
        filterFLocationInfo.FLocationNameSearch = jQuery.trim(jQuery("#txtSearchLocation").val());

    if (jQuery("#hdfEquipmentSortValue").val() != "") {
        filterFLocationInfo.SortType = jQuery("#hdfEquipmentSortValue").val();
    }

    jQuery.ajax(
        {
            type: "POST",
            url: pagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetAllFuncLocForSchedule",
            data: JSON.stringify({ pagerData: pagerData, filterFLocationInfo: filterFLocationInfo }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                if (json.d != undefined && json.d != null) {
                    if (json.d.FunctionalLocationList.length > 0) {
                        var fLocaction = {};
                        jQuery.each(json.d.FunctionalLocationList, function (index, value) {
                            fLocaction.IsSelected = false;
                            if (value.FunctionalLocationID == jQuery.MaintenanceScheduleNamespace.FLocationID)
                                fLocaction.IsSelected = true;

                            fLocaction.FLocationID = value.FunctionalLocationID;
                            fLocaction.FLocationName = value.FunctionalLocationName;
                            fLocaction.EquipmentName = "";
                            fLocaction.EquipmentType = "";
                            locationEquipmentViewModel.FLocationOrEquipmentList.push(fLocaction);
                            fLocaction = {};
                        });
                        locationEquipmentViewModel.PagerData(json.d.HTMLPager);
                    }
                    else {
                        locationEquipmentViewModel.LoadErrorMessageVisible(true);
                        locationEquipmentViewModel.LoadErrorMessage(languageResource.resMsg_NoRecordFound);
                        locationEquipmentViewModel.LoadErrorMessageClass('');
                    }
                }
                else {
                    locationEquipmentViewModel.LoadErrorMessageVisible(true);
                    locationEquipmentViewModel.LoadErrorMessage(languageResource.resMsg_FailedToLoadFunctionalLoactions);
                    locationEquipmentViewModel.LoadErrorMessageClass('red');
                }
            },
            beforeSend: function () {
                jQuery("#divEuipmqntProgress").show();
                locationEquipmentViewModel.PagerData('');
                locationEquipmentViewModel.FLocationOrEquipmentList.removeAll();
                locationEquipmentViewModel.LoadErrorMessageVisible(false);
                locationEquipmentViewModel.LoadErrorMessage('');
                locationEquipmentViewModel.LoadErrorMessageClass('');
            },
            complete: function () {
                jQuery("#divEuipmqntProgress").hide();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                if (XMLHttpRequest.responseText != "") {
                    var errorMsg = jQuery.parseJSON(XMLHttpRequest.responseText);
                    if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                        msg = languageResource.resMsg_Error + errorMsg.Message;
                    else
                        msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadFunctionalLoactions;
                }
                else {
                    msg = languageResource.resMsg_FailedToLoadFunctionalLoactions;
                }
                locationEquipmentViewModel.LoadErrorMessageVisible(true);
                locationEquipmentViewModel.LoadErrorMessage(msg);
                locationEquipmentViewModel.LoadErrorMessageClass('red');
            }
        });
}

function LoadEquipmentList(pagerData) {
    var equipmentFilterInfo = {};
    equipmentFilterInfo.SiteID = pagerData.SiteID;
    equipmentFilterInfo.UserID = pagerData.UserID;
    equipmentFilterInfo.PageIndex = pagerData.PageIndex;
    equipmentFilterInfo.PageSize = pagerData.PageSize;
    equipmentFilterInfo.InfoType = 'E'.charCodeAt(0);
    equipmentFilterInfo.EquipmentID = jQuery.MaintenanceScheduleNamespace.EquipmentID

    if (jQuery.MaintenanceScheduleNamespace.IsMaintTypeSearch) {
        if (jQuery.trim(jQuery("#txtSearchLocation").val()).length > 0) {
            equipmentFilterInfo.SerachNameOrCode = jQuery.trim(jQuery("#txtSearchLocation").val());
        }
        if (locationEquipmentViewModel.SelectedCategoryFilterArray().length > 0) {
            equipmentFilterInfo.SearchCategoryIDs = "";
            ko.utils.arrayForEach(locationEquipmentViewModel.SelectedCategoryFilterArray(), function (categoryInfo) {
                equipmentFilterInfo.SearchCategoryIDs = equipmentFilterInfo.SearchCategoryIDs + categoryInfo.TypeValue + ",";
            });
            equipmentFilterInfo.SearchCategoryIDs = equipmentFilterInfo.SearchCategoryIDs.slice(0, -1);
        }
    }

    if (jQuery("#hdfEquipmentSortValue").val() != "") {
        equipmentFilterInfo.SortType = jQuery("#hdfEquipmentSortValue").val();
    }

    jQuery.ajax(
        {
            type: "POST",
            url: pagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetAllEquipmentLocationInfoSchedule",
            data: JSON.stringify({ pagerData: pagerData, equipmentFilterInfo: equipmentFilterInfo }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                if (json.d != undefined && json.d != null) {
                    if (json.d.EquipmentList.length > 0) {
                        var fLocaction = {};
                        jQuery.each(json.d.EquipmentList, function (index, value) {
                            fLocaction.IsSelected = false;
                            if (value.EquipmentID == jQuery.MaintenanceScheduleNamespace.EquipmentID)
                                fLocaction.IsSelected = true;

                            fLocaction.FLocationID = value.FunctionalLocationID;
                            fLocaction.FLocationName = value.FunctionalLocationName;
                            fLocaction.EquipmentID = value.EquipmentID;
                            fLocaction.EquipmentName = value.EquipmentName;
                            fLocaction.EquipmentType = value.CategoryName;
                            locationEquipmentViewModel.FLocationOrEquipmentList.push(fLocaction);
                            fLocaction = {};
                        });
                        locationEquipmentViewModel.PagerData(json.d.HTMLPager);
                    }
                    else {
                        locationEquipmentViewModel.LoadErrorMessageVisible(true);
                        locationEquipmentViewModel.LoadErrorMessage(languageResource.resMsg_NoRecordFound);
                        locationEquipmentViewModel.LoadErrorMessageClass('');
                    }
                }
                else {
                    locationEquipmentViewModel.LoadErrorMessageVisible(true);
                    locationEquipmentViewModel.LoadErrorMessage(languageResource.resMsg_FailedToLoadEquipments);
                    locationEquipmentViewModel.LoadErrorMessageClass('red');
                }
            },
            beforeSend: function () {
                jQuery("#divEuipmqntProgress").show();
                locationEquipmentViewModel.PagerData('');
                locationEquipmentViewModel.FLocationOrEquipmentList.removeAll();
                locationEquipmentViewModel.LoadErrorMessageVisible(false);
                locationEquipmentViewModel.LoadErrorMessage('');
                locationEquipmentViewModel.LoadErrorMessageClass('');
            },
            complete: function () {
                jQuery("#divEuipmqntProgress").hide();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                if (XMLHttpRequest.responseText != "") {
                    var errorMsg = jQuery.parseJSON(XMLHttpRequest.responseText);
                    if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                        msg = languageResource.resMsg_Error + errorMsg.Message;
                    else
                        msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadEquipments;
                }
                else {
                    msg = languageResource.resMsg_FailedToLoadEquipments;
                }
                locationEquipmentViewModel.LoadErrorMessageVisible(true);
                locationEquipmentViewModel.LoadErrorMessage(msg);
                locationEquipmentViewModel.LoadErrorMessageClass('red');
            }
        });
}

function SelectFlocationOrEquipment(ctrl, isClose) {
    var rowInfo = ko.dataFor(ctrl);

    if (locationEquipmentViewModel.IsEquipemntSelected()) {
        jQuery.MaintenanceScheduleNamespace.FLocationID = 0;
        jQuery.MaintenanceScheduleNamespace.EquipmentID = rowInfo.EquipmentID;
        jQuery("#txtFLocationOrEquipmentName").val(rowInfo.EquipmentName);
        LoadEquipmentOrLocationWorkGroup();
    }
    else {
        jQuery.MaintenanceScheduleNamespace.EquipmentID = 0;
        jQuery.MaintenanceScheduleNamespace.FLocationID = rowInfo.FLocationID;
        jQuery("#txtFLocationOrEquipmentName").val(rowInfo.FLocationName);
        LoadEquipmentOrLocationWorkGroup();
    }

    jQuery(ctrl).siblings().removeClass('bg-info');
    jQuery(ctrl).siblings().find('.fa-hand-o-right').removeClass('fa-hand-o-right');
    jQuery(ctrl).find('i').addClass('fa-hand-o-right');
    jQuery(ctrl).addClass('bg-info');
    if (isClose)
        jQuery("#divSelectEquipmentFLocationModal").modal("hide");
}

function ClearEquipmentFLocationInfo() {
    jQuery.MaintenanceScheduleNamespace.IsMaintTypeSearch = false;
    jQuery("#txtSearchLocation").val('');
    jQuery("#txtSearchEquipment").val('');
    jQuery("#spnEquipmentFLocationSearchError").text('');
    jQuery("#btnShowAllEquipment").hide();
    jQuery(".searchField").val('').trigger('keyup');
    locationEquipmentViewModel.SelectedCategoryFilterArray.removeAll();
    AppendElements();
    jQuery("#ulEquipmentTypeMultiSelect li").find('span').removeClass('selectedlist selectedParentlist').find('input').prop('checked', false);
    ko.utils.arrayForEach(locationEquipmentViewModel.EquipmentTypeArray(), function (categoryInfo) {
        categoryInfo.IsSelected(false);
    });
    ResetDropdownCss();
}

function SelectCategoryInfo(categoryInfo) {
    var isSelected = false;

    if (categoryInfo.IsSelected() == true) {
        categoryInfo.IsSelected(false);
    }
    else {
        categoryInfo.IsSelected(true);
        isSelected = true;
    }

    if (isSelected) {
        locationEquipmentViewModel.SelectedCategoryFilterArray.push(categoryInfo);
    }
    else {
        locationEquipmentViewModel.SelectedCategoryFilterArray.remove(categoryInfo);
    }
}

function ValidateDecimalValueForInput(ctrl, event, maxLength, maxPrecision) {
    var value = jQuery(ctrl).val().trim();
    var indexOfDecimal = value.indexOf('.');
    if (indexOfDecimal != -1)
        maxLength = maxLength - (value.length - indexOfDecimal);

    var s = "^((?=.*\\d)\\d{1," + maxLength + "}(\\.\\d{0," + maxPrecision + "}?)?)$";
    var regex = new RegExp(s);
    var key = String.fromCharCode(event.charCode);
    var init = value.substring(0, event.target.selectionStart);
    var substr = value.substring(event.target.selectionStart);
    var final = init + key + substr;
    if (!regex.test(final)) {
        event.preventDefault();
        return false;
    }
}

function OnValuePaste(ctrl, event, maxLength, maxPrecision) {
    setTimeout(function () {
        if (isNaN(jQuery(ctrl).val())) {
            jQuery(ctrl).val("");
            event.preventDefault();
            return false;
        }
        else {
            var value = jQuery(ctrl).val().trim();
            var indexOfDecimal = value.indexOf('.');
            if (indexOfDecimal != -1)
                maxLength = maxLength - (value.length - indexOfDecimal);
            if (value.length > maxLength) {
                jQuery(ctrl).val("");
                event.preventDefault();
                return false;
            }
        }
    }, 100);
}

function CancelWorkOrderConfirm() {
    jQuery("#alertMessage").removeClass("text-danger");
    jQuery("#alertMessage").html(languageResource.resMsg_CancelWorkOrderConfirm);
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
                    CancelWorkOrder();
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

function CancelWorkOrder() {
    var filterInfo = {};
    filterInfo.SiteID = jQuery.MaintenanceScheduleNamespace.BasicParam.SiteID;
    filterInfo.UserID = jQuery.MaintenanceScheduleNamespace.BasicParam.UserID;
    filterInfo.WorkOrderID = jQuery.MaintenanceScheduleNamespace.WorkOrderID;

    jQuery.ajax({
        type: "POST",
        url: jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/CancelmaintenanceWorkOrder",
        data: JSON.stringify({ filterInfo: filterInfo }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        success: function (json) {
            if (json != undefined && json.d != undefined && json.d == true) {
                maintenanceScheduleViewModel.IsCanceledWorkOrder(true);
            }
            else {
                ShowErrorMessagePopUp(languageResource.resMsg_FailedToCancelWorkOrder, true);
            }
        },
        error: function (request, error) {
            var msg = languageResource.resMsg_FailedToCancelWorkOrder;
            var errorMessage = languageResource.resMsg_Error + msg;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    errorMessage = languageResource.resMsg_Error + errorMsg.Message;
            }
            ShowErrorMessagePopUp(errorMessage, true);
        }
    });
}

function LoadNotificationDetails() {
    jQuery.ajax({
        type: "POST",
        url: jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetNotificationInfo",
        data: JSON.stringify({ basicParam: jQuery.MaintenanceScheduleNamespace.BasicParam, notificationID: jQuery.MaintenanceScheduleNamespace.NotificationID }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        success: function (json) {
            if (json != undefined && json.d != undefined && json.d != null) {
                maintenanceScheduleViewModel.NotificationDetails(json.d);
                maintenanceScheduleViewModel.IsNotificationDetails(true);
            }
            else {
                ShowErrorMessagePopUp(languageResource.resMsg_FailedToLoadNotificationDetails, true);
            }
        },
        error: function (request, error) {
            var msg = languageResource.resMsg_FailedToLoadNotificationDetails;
            var errorMessage = languageResource.resMsg_Error + msg;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    errorMessage = languageResource.resMsg_Error + errorMsg.Message;
            }
            ShowErrorMessagePopUp(errorMessage, true);
        }
    });
}
