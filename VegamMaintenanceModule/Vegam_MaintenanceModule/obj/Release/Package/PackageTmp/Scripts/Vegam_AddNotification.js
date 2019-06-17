jQuery.AddNotificationNamespace = jQuery.AddNotificationNamespace || {};
jQuery.AddNotificationNamespace.BasicParam = jQuery.AddNotificationNamespace.BasicParam || {};
jQuery.AddNotificationNamespace.PagerData = jQuery.AddNotificationNamespace.PagerData || {};
jQuery.AddNotificationNamespace.MaintTypePagerData = jQuery.AddNotificationNamespace.MaintTypePagerData || {};
jQuery.AddNotificationNamespace.BasePath = "";
jQuery.AddNotificationNamespace.WebServicePath = "";
jQuery.AddNotificationNamespace.LoadControlID = "";
jQuery.AddNotificationNamespace.IsMaintTypeSearch = false;
jQuery.AddNotificationNamespace.MaintMasterInfoType = { Equipment: 'E' };
jQuery.AddNotificationNamespace.MaintMasterDataType = { EquipmentType: "TYPE", NotificationType: "NOTIFICATION_TYPE" };
jQuery.AddNotificationNamespace.NotificationStatus = { 'CREATED': 1, 'ASSIGNED': 2, 'REJECTED': 3, 'COMPLETED': 4, 'INPROGRESS': 5, 'ACCEPTED':6, 'CLOSED':7 };
jQuery.AddNotificationNamespace.DocumentInfoType = { 'NotificationAttachment': 'T' };
jQuery.AddNotificationNamespace.DocumentType = { "DOCUMENT": "D", "IMAGE": "I", "VIDEO": "V" };
jQuery.AddNotificationNamespace.UploaderPath = "";
jQuery.AddNotificationNamespace.NotificationAttachmentPath = "";
jQuery.AddNotificationNamespace.ImagePath = "";
jQuery.AddNotificationNamespace.DynamicPageSize = 0;
jQuery.AddNotificationNamespace.DatePickerFormat = '';
jQuery.AddNotificationNamespace.PlantDateFormat = '';
jQuery.AddNotificationNamespace.PlantTimeFormat = '';
jQuery.AddNotificationNamespace.UnitOfTime = { "Hours": 'H', "Minutes": 'M'};

var notificationViewModel = {
    HasEditAccess: false,
    HasDeleteAccess: false,
    WorkOrderHasFullAccess: false,
    NotificationList: ko.observableArray([]),
    FunctionalLocationFilterList: ko.observableArray([]),
    EquipmentFilterList: ko.observableArray([]),
    SelectFunctionalLocationFilter: ko.observable(0),
    SelectEquipmentFilter: ko.observable(0),
    PagerContent: ko.observable(),
    NotificationID: ko.observable(0),
    NotificationName: ko.observable(''),
    NotificationTypeList: ko.observableArray([]),
    PriorityList: ko.observableArray([]),
    FlocationID: ko.observable(0),
    EquipmentID: ko.observable(0),
    SelectedNotificationType: ko.observable(0),
    SelectedPriority: ko.observable(''),
    Description: ko.observable(''),
    NotificationStatus: ko.observable(''),
    RejectReason: ko.observable(''),
    WorkOrderNumber: ko.observable(''),
    AttachedSchedlueID: ko.observable(0),
    CreatedOn: ko.observable(''),
    CreatedBy: ko.observable(''),
    ModelErrorMsg: ko.observable(''),
    ModelErrorCss: ko.observable(''),
    IsNotificationListEmpty: ko.observable(false),
    IsNotificationStatusCreate: ko.observable(false),
    DropdownNotificationFlag: false,
    WorkOrderHasNoAccess: false,

    AttachmentList: ko.observableArray([]),
    DefaultUploadIconPath: ko.observable(''),
    HasDocumentChanged: ko.observable(false),
    SequenceID: ko.observable(0),
    
    RequestedEndDate: ko.observable(0),
    IsNotificationAcceptVisible: ko.observable(false),
    IsNotificationRejectVisible: ko.observable(false),
    IsNotificationCloseVisible: ko.observable(false),
    IsNotificationCreateWOVisible: ko.observable(false),

    ClosedOn: ko.observable(''),
    ClosedBy: ko.observable(''),
    TimeSpent: ko.observable(''),
    StartTime: ko.observable(''),
    EndTime: ko.observable(''),
    CloseRemark: ko.observable('')
};

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

var maintenanceTypeUpdateViewModel = {
    LoadErrorMessageVisible: ko.observable(false),
    LoadErrorMessage: ko.observable(''),
    LoadErrorMessageClass: ko.observable(''),
    MaintTypePagerData: ko.observable(''),
    DefaultMaintenanceTypesArray: ko.observableArray([]),
    HasMaintTypeAccess: false,
    HasDeleteMaintTypeAccess: false
};

var closeNotificationViewModel = {
    UnitOfTimeList: ko.observableArray([]),
    TimeSpent: ko.observable(''),
    Remark: ko.observable(''),
    WorkStartDate: ko.observable(),
    WorkStartTime: ko.observable(),
    WorkEndDate: ko.observable(),
    WorkEndTime: ko.observable()
};

function NotificationBasicLoadInfo(basicParam, pagerData, equipmentPagerData, maintTypePagerData, basePath, webServicePath, notificationID, hasEditAccess, hasDeleteAccess, workOrderHasFullAccess, uploaderPath, notificationAttachmentPath, imagePath, datePickerFormat, plantDateFormat, plantTimeFormat) {
    jQuery.AddNotificationNamespace.BasicParam = basicParam;
    jQuery.AddNotificationNamespace.PagerData = pagerData;
    jQuery.AddNotificationNamespace.EquipmentPagerData = equipmentPagerData;
    jQuery.AddNotificationNamespace.MaintTypePagerData = maintTypePagerData;
    jQuery.AddNotificationNamespace.BasePath = basePath;
    jQuery.AddNotificationNamespace.WebServicePath = webServicePath;
    jQuery.AddNotificationNamespace.LoadControlID = pagerData.LoadControlID;
    jQuery.AddNotificationNamespace.UploaderPath = uploaderPath;
    jQuery.AddNotificationNamespace.NotificationAttachmentPath = notificationAttachmentPath;
    jQuery.AddNotificationNamespace.ImagePath = imagePath;
    jQuery.AddNotificationNamespace.DatePickerFormat = datePickerFormat;
    jQuery.AddNotificationNamespace.PlantDateFormat = plantDateFormat;
    jQuery.AddNotificationNamespace.PlantTimeFormat = plantTimeFormat;

    notificationViewModel.HasEditAccess = hasEditAccess.toLowerCase() === "true" ? true : false;
    notificationViewModel.HasDeleteAccess = hasDeleteAccess.toLowerCase() === "true" ? true : false;
    notificationViewModel.WorkOrderHasFullAccess = workOrderHasFullAccess.toLowerCase() === "full_access" ? true : false;
    notificationViewModel.WorkOrderHasNoAccess = workOrderHasFullAccess.toLowerCase() === "no_access" ? true : false;

    ManageSiteMapUrl();
    GetEnumTypeInfo("MAINT_PRIORITY_TYPE");
    LoadMaintMasterData(jQuery.AddNotificationNamespace.MaintMasterDataType.EquipmentType);
    LoadMaintMasterData(jQuery.AddNotificationNamespace.MaintMasterDataType.NotificationType);

    if (notificationID == 0) {
        jQuery("#" + jQuery.AddNotificationNamespace.LoadControlID).html(languageResource.resMsg_SaveandAddMore);
        jQuery("#fileUpload").removeAttr("onclick");
        jQuery("#fileUpload").prop("onclick", null);
        jQuery("#fileUpload").unbind('click');
        jQuery("#fileUpload").bind("click", function () { GetSequenceID(); return false; });
    }
    else {
        jQuery("#" + jQuery.AddNotificationNamespace.LoadControlID).html(languageResource.resMsg_Update);
        notificationViewModel.NotificationID(notificationID);
        LoadSelectedNotification(notificationID);
    }

    if (!notificationViewModel.HasEditAccess && !notificationViewModel.HasDeleteAccess) {
        jQuery("#" + jQuery.AddNotificationNamespace.LoadControlID).addClass('disabled');
        jQuery("#btnReject").addClass('disabled');
        jQuery("#btnAccept").addClass('disabled');
        jQuery("#btnCloseNotificationInfo").addClass('disabled');
        //jQuery("#btnCreateWorkOrder").addClass('disabled');
    }
    else if (notificationViewModel.HasEditAccess && !notificationViewModel.HasDeleteAccess) {
        jQuery("#btnReject").addClass('disabled');
        jQuery("#btnAccept").addClass('disabled');
        jQuery("#btnCloseNotificationInfo").addClass('disabled');
        //jQuery("#btnCreateWorkOrder").addClass('disabled');
        if (notificationID == 0)
        jQuery("#" + jQuery.AddNotificationNamespace.LoadControlID).addClass('disabled');
    }

    jQuery('.selectDropDown').select2();
    ko.applyBindings(notificationViewModel, document.getElementById("divManageNotification"));
    ko.applyBindings(locationEquipmentViewModel, document.getElementById("divSelectEquipmentFLocationModal"));
    ko.applyBindings(maintenanceTypeUpdateViewModel, document.getElementById("divAddMaintenanceTypeModal"));
    ko.applyBindings(closeNotificationViewModel, document.getElementById("closeNotificationModal"));
    notificationViewModel.DefaultUploadIconPath(jQuery.AddNotificationNamespace.ImagePath + '/Styles/Images/upload_icon.png');

    BindDropdownFunctionalLocationFilter();
    BindDropdownEquipmentFilter();
    initiateDatePicker();
    bindDatePickerAndSelectDefaultDate();

    LoadNotificationList(pagerData);
    notificationViewModel.DropdownNotificationFlag = true;
    LoadUnitOfTime();
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
        dateFormat: jQuery.AddNotificationNamespace.DatePickerFormat
    });
}

function GetSiteCurrentDateTime() {
    var currentDateTime;
    jQuery.ajax({
        type: "POST",
        url: jQuery.AddNotificationNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/GetSiteCurrentDateTime",
        data: JSON.stringify({ siteID: jQuery.AddNotificationNamespace.BasicParam.SiteID }),
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

function bindDatePickerAndSelectDefaultDate() {
    var currentDateTimeInfo = GetSiteCurrentDateTime();
    var currentDate = new Date();
    if (currentDateTimeInfo != undefined && currentDateTimeInfo != null && currentDateTimeInfo.CurrentDate != undefined && currentDateTimeInfo.CurrentDate != 0) {
        currentDate = ConvertIntToDate(currentDateTimeInfo.CurrentDate, currentDateTimeInfo.CurrentTime);
    }

    jQuery("#txtRequestedEndDate").datepicker({
        minDate: currentDate,
        changeMonth: true,
        changeYear: true,
        onSelect: function () {
            notificationViewModel.RequestedEndDate(ConvertDatePickerFormatToInt(jQuery.trim(jQuery("#txtRequestedEndDate").val())));
        }
    });
    
    jQuery("#txtWorkStartDate").datepicker({
        minDate: currentDate,
        changeMonth: true,
        changeYear: true,
        onSelect: function () {
            closeNotificationViewModel.WorkStartDate(ConvertDatePickerFormatToInt(jQuery.trim(jQuery("#txtWorkStartDate").val())));
        }
    });

    jQuery("#txtWorkStartDate").datepicker('option', 'defaultDate', currentDate);
    jQuery("#txtWorkStartDate").datepicker('setDate', currentDate);
    
    if (jQuery.AddNotificationNamespace.PlantTimeFormat.indexOf('tt') !== -1) {
        jQuery("#txtWorkStartTime").timepicker({
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
                closeNotificationViewModel.WorkStartTime(ConvertTimePickerFormatToInt(time));
            }
        });
    }
    else {
        jQuery("#txtWorkStartTime").timepicker({
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
                closeNotificationViewModel.WorkStartTime(ConvertTimePickerFormatToInt(time));
            }
        });
    }

    jQuery("#txtWorkEndDate").datepicker({
        minDate: currentDate,
        changeMonth: true,
        changeYear: true,
        onSelect: function () {
            closeNotificationViewModel.WorkEndDate(ConvertDatePickerFormatToInt(jQuery.trim(jQuery("#txtWorkEndDate").val())));
        }
    });

    jQuery("#txtWorkEndDate").datepicker('option', 'defaultDate', currentDate);
    jQuery("#txtWorkEndDate").datepicker('setDate', currentDate);

    if (jQuery.AddNotificationNamespace.PlantTimeFormat.indexOf('tt') !== -1) {
        jQuery("#txtWorkEndTime").timepicker({
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
                closeNotificationViewModel.WorkEndTime(ConvertTimePickerFormatToInt(time));
            }
        });
    }
    else {
        jQuery("#txtWorkEndTime").timepicker({
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
                closeNotificationViewModel.WorkEndTime(ConvertTimePickerFormatToInt(time));
            }
        });
    }

    jQuery("#txtRequestedEndDate,#txtWorkStartDate,#txtWorkStartTime,#txtWorkEndDate,#txtWorkEndTime").keydown(function () {
        return false;
    });
}

function ConvertDatePickerFormatToInt(dateString) {
    if (dateString != undefined && dateString != "")
        return jQuery.datepicker.formatDate('yymmdd', jQuery.datepicker.parseDate(jQuery.AddNotificationNamespace.DatePickerFormat, dateString));
    else
        return 0;
}

function ConvertTimePickerFormatToInt(timeString) {
    if (timeString != undefined && timeString != "") {
        var hour = parseInt(timeString.substr(0, 2));
        var minute = timeString.substr(3, 2);
        if (jQuery.AddNotificationNamespace.PlantTimeFormat.indexOf('tt') !== -1) {
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

function ConvertSiteDateTimeToDatePickerFormat(dateTimeInt) {
    if (dateTimeInt > 0) {
        var dateString = dateTimeInt.toString().substr(0, 8);
        return jQuery.datepicker.formatDate(jQuery.AddNotificationNamespace.DatePickerFormat, jQuery.datepicker.parseDate("yymmdd", dateString));
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
            return hour + ":" + minute;
        }
    }
    else
        return "";
}

function ConvertIntToDateTimeString(dateInt, timeInt) {
    return dateInt + "000000".substring(0, 6 - timeInt.toString().length) + timeInt.toString();
}

function GetEnumTypeInfo(enumType) {
    jQuery.ajax({
        type: "POST",
        url: jQuery.AddNotificationNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/GetEnumInfoList",
        data: JSON.stringify({ basicParam: jQuery.AddNotificationNamespace.BasicParam, EnumType: enumType }),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (data) {
            if (data.d !== null) {
                var enumInfo = {};
                enumInfo.TypeValue = 0;
                enumInfo.DisplayName = languageResource.resMsg_SelectPriority;
                notificationViewModel.PriorityList.push(enumInfo);
                jQuery.each(data.d, function (i, item) {
                    var enumInfo = {};
                    enumInfo.TypeValue = item.TypeValue;
                    enumInfo.DisplayName = item.DisplayName;
                    notificationViewModel.PriorityList.push(enumInfo);
                });
                jQuery("#drpPriority").select2({ width: '50%' });
            } else {
                var errorMessage = languageResource.resMsg_FailedToBindEnumTypeInfoList;
                ShowErrorMessagePopUp(languageResource.resMsg_Error + errorMessage, true);
            }
        },
        error: function (request, error) {
            var errorMessage = languageResource.resMsg_FailedToBindEnumTypeInfoList;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                    errorMessage = errorMsg;
            }
            ShowErrorMessagePopUp(languageResource.resMsg_Error + errorMessage, true);
        }
    });
}

function BindDropdownFunctionalLocationFilter() {
    var locationFilterInfo = {};
    locationFilterInfo.SiteID = jQuery.AddNotificationNamespace.BasicParam.SiteID;
    locationFilterInfo.UserID = jQuery.AddNotificationNamespace.BasicParam.UserID;
    jQuery.ajax({
        type: "POST",
        url: jQuery.AddNotificationNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/GetAllFunctionalLocInfo",
        data: JSON.stringify({ pagerData: null, locationFilterInfo: locationFilterInfo }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        async: false,
        success: function (json) {
            if (json != undefined && json.d != null) {
                var locationInfo = {};
                locationInfo.TypeValue = 0;
                locationInfo.DisplayName = languageResource.resMsg_PleaseSelect;
                notificationViewModel.FunctionalLocationFilterList.push(locationInfo);
                jQuery.each(json.d.FunctionalLocationList, function (i, fLocation) {
                    var fLocationInfo = {};
                    fLocationInfo.TypeValue = fLocation.FunctionalLocationID;
                    fLocationInfo.DisplayName = fLocation.FunctionalLocationName;
                    notificationViewModel.FunctionalLocationFilterList.push(fLocationInfo);
                });
                if (!notificationViewModel.DropdownNotificationFlag && notificationViewModel.FlocationID() > 0)
                    notificationViewModel.SelectFunctionalLocationFilter(notificationViewModel.FlocationID());
                jQuery("#drpFilterFuncLoc").select2();
            }
            else {
                var errorMsg = languageResource.resMsg_Error + languageResource.resMsg_FailedToBindFunctionalLocationList;
                ShowErrorMessagePopUp(errorMsg, true);
            }
        },
        beforeSend: function () {
            notificationViewModel.FunctionalLocationFilterList.removeAll();
        },
        complete: function () {
        },
        error: function (request, error) {
            var msg;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    msg = languageResource.resMsg_Error + errorMsg.Message;
                else
                    msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToBindFunctionalLocationList;
            }
            else {
                msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToBindFunctionalLocationList;
            }
            ShowErrorMessagePopUp(msg, true);
        }
    });
}

function BindDropdownEquipmentFilter() {
    var equipmentFilterInfo = {};
    equipmentFilterInfo.SiteID = jQuery.AddNotificationNamespace.BasicParam.SiteID;
    equipmentFilterInfo.UserID = jQuery.AddNotificationNamespace.BasicParam.UserID;
    equipmentFilterInfo.InfoType = jQuery.AddNotificationNamespace.MaintMasterInfoType.Equipment.charCodeAt(0);
    if (notificationViewModel.SelectFunctionalLocationFilter() > 0)
        equipmentFilterInfo.SearchLocationIDs = notificationViewModel.SelectFunctionalLocationFilter();

    jQuery.ajax({
        type: "POST",
        url: jQuery.AddNotificationNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/GetEquipmentListForDropDown",
        data: JSON.stringify({ equipmentFilterInfo: equipmentFilterInfo }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (json) {
            if (json != undefined && json.d != null) {
                var indexInfo = {};
                indexInfo.TypeValue = 0;
                indexInfo.DisplayName = languageResource.resMsg_PleaseSelect;
                var equipmentList = [];
                equipmentList.push(indexInfo);
                jQuery.each(json.d, function (i, equipmentData) {
                    var equipmentInfo = {};
                    equipmentInfo.TypeValue = equipmentData.TypeValue;
                    equipmentInfo.DisplayName = equipmentData.DisplayName;
                    equipmentList.push(equipmentInfo);
                });
                notificationViewModel.EquipmentFilterList(equipmentList);
                if (!notificationViewModel.DropdownNotificationFlag && notificationViewModel.EquipmentID() > 0)
                    notificationViewModel.SelectEquipmentFilter(notificationViewModel.EquipmentID());
                jQuery("#drpFilterEquipment").select2();
            }
            else {
                var errorMsg = languageResource.resMsg_Error + languageResource.resMsg_FailedToBindEquipmentList;
                ShowErrorMessagePopUp(errorMsg, true);
            }
        },
        beforeSend: function () {
            notificationViewModel.EquipmentFilterList.removeAll();
        },
        complete: function () {
        },
        error: function (request, error) {
            var msg;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    msg = languageResource.resMsg_Error + errorMsg.Message;
                else
                    msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToBindEquipmentList;
            }
            else {
                msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToBindEquipmentList;
            }
            ShowErrorMessagePopUp(msg, true);
        }
    });
}

function LoadMaintMasterData(masterDataType) {
    var masterDataFilterInfo = {};
    masterDataFilterInfo.MasterDataType = masterDataType;

    jQuery.ajax({
        type: "POST",
        url: jQuery.AddNotificationNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetMaintMasterData",
        data: JSON.stringify({ basicParam: jQuery.AddNotificationNamespace.BasicParam, masterDataFilterInfo: masterDataFilterInfo }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        async: false,
        success: function (json) {
            if (json != undefined && json.d != undefined) {
                if (masterDataType == jQuery.AddNotificationNamespace.MaintMasterDataType.EquipmentType) {
                    locationEquipmentViewModel.EquipmentTypeArray.removeAll();
                    var masterDataList = json.d.MasterDataInfoList;
                    jQuery.each(masterDataList, function (i, itemInfo) {
                        var categoryInfo = {};
                        categoryInfo.TypeValue = itemInfo.MasterDataID;
                        categoryInfo.DisplayName = itemInfo.MasterDataName;
                        categoryInfo.IsSelected = ko.observable(false);
                        locationEquipmentViewModel.EquipmentTypeArray.push(categoryInfo);
                    });
                }
                else if (masterDataType == jQuery.AddNotificationNamespace.MaintMasterDataType.NotificationType) {
                    notificationViewModel.NotificationTypeList.removeAll();
                    var indexInfo = {};
                    indexInfo.TypeValue = 0;
                    indexInfo.DisplayName = languageResource.resMsg_SelectNotificationType;
                    notificationViewModel.NotificationTypeList.push(indexInfo);
                    jQuery.each(json.d.MasterDataInfoList, function (i, item) {
                        var notificationTypeInfo = {};
                        notificationTypeInfo.TypeValue = item.MasterDataID;
                        if (item.Description != undefined && item.Description != null && jQuery.trim(item.Description).length != 0) {
                            notificationTypeInfo.DisplayName = item.MasterDataName + '-' + item.Description;
                        }
                        else {
                            notificationTypeInfo.DisplayName = item.MasterDataName;
                        }
                        notificationViewModel.NotificationTypeList.push(notificationTypeInfo);
                    });
                    jQuery("#drpNotificationType").select2();
                }
            }
            else {
                ShowErrorMessagePopUp(languageResource.resMsg_FailedToBindMasterDataForDropdown, true);
            }
        },
        error: function (request, error) {
            var errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToBindMasterDataForDropdown;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    errorMessage = languageResource.resMsg_Error + errorMsg.Message;
            }
            ShowErrorMessagePopUp(errorMessage, true);
        }
    });
}

function ClearNotificationInfo() {
    ko.utils.arrayForEach(notificationViewModel.NotificationList(), function (item) {
        item.SelectedClass('');
    });
    notificationViewModel.NotificationID(0);
    jQuery("#txtFLocationOrEquipmentName").val('');
    notificationViewModel.FlocationID(0);
    notificationViewModel.EquipmentID(0);
    notificationViewModel.NotificationName('');
    notificationViewModel.SelectedNotificationType(0);
    notificationViewModel.SelectedPriority('');
    notificationViewModel.Description('');
    notificationViewModel.NotificationStatus('');
    notificationViewModel.RejectReason('');
    notificationViewModel.AttachedSchedlueID(0);
    notificationViewModel.CreatedOn(''),
        notificationViewModel.CreatedBy(''),
        notificationViewModel.ModelErrorMsg('');
    autoheight("#txtDescription");
    jQuery("#drpNotificationType").select2();
    jQuery("#drpPriority").select2();
    notificationViewModel.AttachmentList.removeAll();
    notificationViewModel.SequenceID(0);
    jQuery("#" + jQuery.AddNotificationNamespace.LoadControlID).removeClass('disabled');
    jQuery("#" + jQuery.AddNotificationNamespace.LoadControlID).html(languageResource.resMsg_SaveandAddMore);
    if ((notificationViewModel.HasEditAccess && !notificationViewModel.HasDeleteAccess) || !notificationViewModel.HasEditAccess)
        jQuery("#" + jQuery.AddNotificationNamespace.LoadControlID).addClass('disabled');

    jQuery("#fileUpload").removeAttr("onclick");
    jQuery("#fileUpload").prop("onclick", null);
    jQuery("#fileUpload").unbind('click');
    jQuery("#fileUpload").bind("click", function () { GetSequenceID(); return false; });
}

//Notification list
function LoadNotificationList(pagerData) {

    if (notificationViewModel.SelectFunctionalLocationFilter() > 0 || notificationViewModel.SelectEquipmentFilter() > 0) {
    var isValid = true;
    var notificationFilter = {};
    notificationFilter.SelectionID = 0;
    notificationFilter.FLocationID = notificationViewModel.SelectFunctionalLocationFilter();
    notificationFilter.EquipmentID = notificationViewModel.SelectEquipmentFilter();
    notificationFilter.SearchString = "";
    notificationFilter.PageIndex = pagerData.PageIndex;
    notificationFilter.PageSize = pagerData.PageSize;
    notificationFilter.SortType = "";

    if (isValid) {
        var searchString = jQuery("#txtSearchNotification").val();
        if (searchString != "") {
            notificationFilter.SearchString = searchString;
        }

        if (jQuery("#hdnSortbyNameValue").val() != "") {
            notificationFilter.SortType = jQuery("#hdnSortbyNameValue").val();
        }


        //Dynamic pagerdata
        var totPageHeight = jQuery(window.parent.document).height();
        var notificationListPos = jQuery("#divNotificationList").offset().top;
        var notificationMaxHeight = totPageHeight - notificationListPos;
        if (jQuery(window).width() < 768)
            notificationMaxHeight = 500;
        if (true) {
            jQuery.AddNotificationNamespace.DynamicPageSize = jQuery.AddNotificationNamespace.DynamicPageSize || Math.floor(notificationMaxHeight / 75);
            notificationFilter.PageSize = jQuery.AddNotificationNamespace.DynamicPageSize;
            pagerData.PageSize = jQuery.AddNotificationNamespace.DynamicPageSize;
        }


        jQuery.ajax({
            type: "POST",
            url: jQuery.AddNotificationNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/GetNotificationList",
            data: JSON.stringify({ pagerData: pagerData, notificationFilter: notificationFilter }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (json) {
                jQuery("#divLoadProgressVisible").addClass('hide');
                if (json.d != null) {
                    notificationViewModel.NotificationList.removeAll();
                    if (json.d.NotificationInfoList.length > 0) {
                        var notificationList = json.d.NotificationInfoList;
                        ko.utils.arrayForEach(notificationList, function (item) {
                            item.SelectedClass = ko.observable('');
                            item.LabelStatus = ko.observable('');
                            item.StatusCreated = ko.observable(false);
                            item.LabelStatus(SetNotificationStatus(item.NotificationStatus));
                            if (item.NotificationStatus == jQuery.AddNotificationNamespace.NotificationStatus.CREATED || item.NotificationStatus == jQuery.AddNotificationNamespace.NotificationStatus.ACCEPTED)
                                item.StatusCreated(true);
                            if (notificationViewModel.NotificationID() == item.NotificationID)
                                item.SelectedClass('bg-info');
                        });
                        notificationViewModel.NotificationList(notificationList);
                        notificationViewModel.PagerContent(json.d.HTMLPager);
                    }
                    else {
                        notificationViewModel.IsNotificationListEmpty(true);
                    }
                }
                else {
                    var errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadNotificationList;
                    ShowErrorMessagePopUp(errorMessage, true);
                }
            },
            beforeSend: function () {
                jQuery("#divLoadProgressVisible").show();
                notificationViewModel.IsNotificationListEmpty(false);
                notificationViewModel.PagerContent('');
            },
            complete: function () {
                jQuery("#divLoadProgressVisible").hide();
            },
            error: function (request, error) {
                jQuery("#divLoadProgressVisible").hide();
                var errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadMeasuringPointList;
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
    else {
        notificationViewModel.NotificationList.removeAll();
        notificationViewModel.IsNotificationListEmpty(true);
        notificationViewModel.PagerContent('');
    }
}

function LoadSelectedNotification(notificationID) {
    notificationViewModel.SequenceID(0);
    jQuery("#fileUpload").removeAttr("onclick");
    jQuery("#fileUpload").prop("onclick", null);
    jQuery("#fileUpload").unbind('click');
    jQuery("#fileUpload").bind("click", '');
    notificationViewModel.NotificationID(notificationID);
    notificationViewModel.ModelErrorMsg('');
    ko.utils.arrayForEach(notificationViewModel.NotificationList(), function (item) {
        item.SelectedClass('');
        if (item.NotificationID == notificationID) {
            item.SelectedClass('bg-info');
        }
    });

    jQuery.ajax({
        type: "POST",
        url: jQuery.AddNotificationNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/GetNotificationInfo",
        data: JSON.stringify({ basicParam: jQuery.AddNotificationNamespace.BasicParam, notificationID: notificationViewModel.NotificationID() }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (json) {
            if (json.d != null || json.d != undefined) {
                var notificationInfo = json.d;
                LoadAttachmentInfo();
                notificationViewModel.NotificationName(notificationInfo.NotificationName);
                notificationViewModel.NotificationStatus(SetNotificationStatus(notificationInfo.NotificationStatus));
                if (notificationInfo.NotificationStatus == jQuery.AddNotificationNamespace.NotificationStatus.CREATED) {
                    notificationViewModel.IsNotificationStatusCreate(true);
                    notificationViewModel.IsNotificationAcceptVisible(true);
                    notificationViewModel.IsNotificationRejectVisible(true);
                    if (notificationViewModel.HasEditAccess)
                        jQuery("#" + jQuery.AddNotificationNamespace.LoadControlID).removeClass('disabled');
                }
                if (notificationInfo.NotificationStatus == jQuery.AddNotificationNamespace.NotificationStatus.ACCEPTED) {
                    notificationViewModel.IsNotificationStatusCreate(true);
                    notificationViewModel.IsNotificationRejectVisible(true);
                    notificationViewModel.IsNotificationCloseVisible(true);
                    notificationViewModel.IsNotificationCreateWOVisible(true);
                    if (notificationViewModel.HasEditAccess)
                        jQuery("#" + jQuery.AddNotificationNamespace.LoadControlID).removeClass('disabled');
                }
                if (!notificationViewModel.IsNotificationStatusCreate())
                    jQuery("#fileUpload").attr('disabled', 'disabled');
                else
                    jQuery("#fileUpload").removeAttr('disabled');

                if (notificationInfo.NotificationStatus == jQuery.AddNotificationNamespace.NotificationStatus.REJECTED) {
                    notificationViewModel.RejectReason(notificationInfo.RejectedReason);
                }
                else {
                    notificationViewModel.RejectReason('');
                }
                if (notificationInfo.FLocationID > 0) {
                    notificationViewModel.FlocationID(notificationInfo.FLocationID);
                    notificationViewModel.EquipmentID(0);
                }
                else if (notificationInfo.EquipmentID > 0) {
                    notificationViewModel.FlocationID(0);
                    notificationViewModel.EquipmentID(notificationInfo.EquipmentID);
                }
                notificationViewModel.SelectedNotificationType(notificationInfo.NotificationTypeID);
                notificationViewModel.SelectedPriority(notificationInfo.Priority);
                notificationViewModel.Description(notificationInfo.Description);
                autoheight("#txtDescription");
                notificationViewModel.WorkOrderNumber(notificationInfo.WorkOrderNumber);
                notificationViewModel.AttachedSchedlueID(notificationInfo.AttachedSchedlueID);
                notificationViewModel.CreatedOn(notificationInfo.CreatedOn);
                notificationViewModel.CreatedBy(notificationInfo.CreatedBy);
                notificationViewModel.RequestedEndDate(notificationInfo.RequestedEndDate);

                notificationViewModel.ClosedOn(notificationInfo.ClosedOn);
                notificationViewModel.ClosedBy(notificationInfo.ClosedBy);
                notificationViewModel.TimeSpent(notificationInfo.TimeTaken + ' ' + GetUnitOfTime(notificationInfo.TimeTakenUnit));
                notificationViewModel.StartTime(notificationInfo.StartTime);
                notificationViewModel.EndTime(notificationInfo.EndTime);
                notificationViewModel.CloseRemark(notificationInfo.Remark);

                if (notificationInfo.RequestedEndDate > 0) {
                    jQuery("#txtRequestedEndDate").val(ConvertSiteDateTimeToDatePickerFormat(notificationInfo.RequestedEndDate));
                }

                jQuery("#drpNotificationType").select2();
                jQuery("#drpPriority").select2();

                if (notificationViewModel.FlocationID() > 0) {
                    locationEquipmentViewModel.IsEquipemntSelected(false);
                    jQuery("#rdbLocation").prop("checked", true);
                    jQuery("#txtFLocationOrEquipmentName").val(notificationInfo.FLocationName);
                }
                else {
                    locationEquipmentViewModel.IsEquipemntSelected(true);
                    $("#rdbEquipment").prop("checked", true);
                    jQuery("#txtFLocationOrEquipmentName").val(notificationInfo.EquipmentName);
                }

                jQuery("#" + jQuery.AddNotificationNamespace.LoadControlID).html(languageResource.resMsg_Update);
                if (notificationViewModel.HasEditAccess == true) {
                    jQuery("#" + jQuery.AddNotificationNamespace.LoadControlID).removeAttr("disabled");
                    jQuery("#btnReject").removeAttr("disabled");
                    jQuery("#btnAccept").removeAttr("disabled");
                    jQuery("#btnCloseNotificationInfo").removeAttr("disabled");
                }
                else {
                    jQuery("#btnReject").attr("disabled");
                    jQuery("#btnAccept").attr("disabled");
                    jQuery("#btnCloseNotificationInfo").attr("disabled");
                }
            }
            else {
                ShowMessage(languageResource.resMsg_FailedToLoadNotificationInfo, "error");
            }
        },
        beforeSend: function () {
            notificationViewModel.IsNotificationStatusCreate(false);
            notificationViewModel.IsNotificationAcceptVisible(false);
            notificationViewModel.IsNotificationRejectVisible(false);
            notificationViewModel.IsNotificationCloseVisible(false);
            notificationViewModel.IsNotificationCreateWOVisible(false);
            jQuery("#" + jQuery.AddNotificationNamespace.LoadControlID).addClass('disabled');
        },
        complete: function () {
        },
        error: function (request, error) {
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                    ShowMessage(languageResource.resMsg_FailedToLoadNotificationInfo, "error");
                else
                    ShowMessage(languageResource.resMsg_FailedToLoadNotificationInfo, "error");
            }
            else {
                ShowMessage(languageResource.resMsg_FailedToLoadNotificationInfo, "error");
            }
        },
    });
}

function AddUpdateNotification(isRejectStatus) {
    var notificationInfo = {};

    notificationInfo.NotificationID = notificationViewModel.NotificationID();
    if (notificationViewModel.NotificationID() == 0 && notificationViewModel.SequenceID() > 0)
        notificationInfo.SequenceID = notificationViewModel.SequenceID();
    notificationInfo.NotificationName = notificationViewModel.NotificationName();
    notificationInfo.FLocationID = notificationViewModel.FlocationID();
    notificationInfo.EquipmentID = notificationViewModel.EquipmentID();
    notificationInfo.NotificationTypeID = notificationViewModel.SelectedNotificationType();
    notificationInfo.Priority = notificationViewModel.SelectedPriority();
    notificationInfo.Description = notificationViewModel.Description();
    notificationInfo.WorkOrderNumber = notificationViewModel.WorkOrderNumber();
    notificationInfo.RejectedReason = jQuery.trim(jQuery("#txtRejectReason").val());
    notificationInfo.RequestedEndDate = notificationViewModel.RequestedEndDate();
    notificationInfo.TimeTakenUnit = jQuery.AddNotificationNamespace.UnitOfTime.Minutes.charCodeAt();

    var isValid = true;
    var errorMessage = "";
    if (notificationInfo.FLocationID == 0 && notificationInfo.EquipmentID == 0) {
        errorMessage = errorMessage + languageResource.resMsg_SelectEquipmentOrFunctionalLocation + "<br/>";
        isValid = false;
    }
    if (notificationInfo.NotificationName == "") {
        errorMessage = errorMessage + languageResource.resMsg_EnterNotificationName + "<br/>";
        isValid = false;
    }
    if (notificationInfo.NotificationTypeID <= 0) {
        errorMessage = errorMessage + languageResource.resMsg_PleaseSelectNotificationType + "<br/>";
        isValid = false;
    }

    if (notificationInfo.Priority == "") {
        errorMessage = errorMessage + languageResource.resMsg_PleaseSelectPriority + "<br/>";
        isValid = false;
    }

    if (isRejectStatus && notificationInfo.RejectedReason.length == 0) {
        errorMessage = errorMessage + languageResource.resMsg_PleaseEnterRejectReason + "<br/>";
        jQuery("#saveReasonMessage").html(errorMessage);
        return false;
    }

    if (isValid == false) {
        ShowMessage(errorMessage, "error");
    }

    if (isValid == true) {

        jQuery.ajax({
            type: "POST",
            url: jQuery.AddNotificationNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/InsertUpdateNotificationInfo",
            data: JSON.stringify({ basicParam: jQuery.AddNotificationNamespace.BasicParam, notificationInfo: notificationInfo }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (json) {
                if (json.d != null && json.d != undefined) {

                    switch (json.d) {
                        case -1: ShowMessage(languageResource.resMsg_EnterNotificationName, "error");
                            break;
                        case -2: ShowMessage(languageResource.resMsg_SelectEquipmentOrFunctionalLocation, "error");
                            break;
                        case -3: ShowMessage(languageResource.resMsg_PleaseSelectNotificationType, "error");
                            break;
                        case -4: ShowMessage(languageResource.resMsg_PleaseSelectPriority, "error");
                            break;
                        default:
                            {
                                if (isRejectStatus)
                                    ClearRejectReasonInfo();
                                ClearNotificationInfo();

                                if (notificationInfo.NotificationID == json.d) {
                                    ShowMessage(languageResource.resMsg_UpdatedSuccessfully, "info");
                                } else {
                                    ShowMessage(languageResource.resMsg_AddedSuccessfully, "info");
                                }
                                LoadNotificationList(jQuery.AddNotificationNamespace.PagerData);
                                ko.utils.arrayForEach(notificationViewModel.NotificationList(), function (item) {
                                    item.SelectedClass('');
                                    if (item.NotificationID == json.d) {
                                        item.SelectedClass('bg-info');
                                    }
                                });
                                break;
                            }
                    }
                }
                else {
                    if (isRejectStatus)
                        ShowMessage(languageResource.resMsg_FailedToRejectNotificationInfo, "error");
                    else
                        ShowMessage(languageResource.resMsg_FailedToAddNotificationInfo, "error");
                }
            },
            error: function (request, error) {
                if (request.responseText != "") {
                    var errorMsg = jQuery.parseJSON(request.responseText);
                    if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null) {
                        errorMessage = languageResource.resMsg_Error + errorMsg.Message;
                        ShowMessage(errorMessage, "error");
                    }
                    else {
                        if (isRejectStatus)
                            errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToRejectNotificationInfo;
                        else
                            errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToAddNotificationInfo;
                        ShowMessage(errorMessage, "error");
                    }
                }
                else {
                    if (isRejectStatus)
                        errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToRejectNotificationInfo;
                    else
                        errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToAddNotificationInfo;
                    ShowMessage(errorMessage, "error");
                }
            }
        });
    }
}

function SortByNotificationName(thValue, value) {
    var thClass = "";
    var hasSortUpClassExist = jQuery("#" + thValue + " i").hasClass('fa fa-long-arrow-up');
    var hasSortDownExist = jQuery("#" + thValue + " i").hasClass('fa fa-long-arrow-down');

    if (hasSortUpClassExist == false && hasSortDownExist == false) {
        jQuery(".fa-long-arrow-down").removeClass('fa fa-long-arrow-down');
        jQuery(".fa-long-arrow-up").removeClass('fa fa-long-arrow-up');

        jQuery("#" + thValue + " i").addClass('fa fa-long-arrow-up');
        thClass = value + "_asc";
        jQuery("#hdnSortbyNameValue").val(thClass);
        LoadNotificationList(jQuery.AddNotificationNamespace.PagerData);

        return false;
    }
    if (jQuery("#" + thValue + " i").hasClass('fa fa-long-arrow-up')) {
        jQuery(".fa-long-arrow-down").removeClass('fa fa-long-arrow-down');
        jQuery(".fa-long-arrow-up").removeClass('fa fa-long-arrow-up');

        jQuery("#" + thValue + " i").addClass('fa fa-long-arrow-down');
        thClass = value + "_desc";
        jQuery("#hdnSortbyNameValue").val(thClass);
        LoadNotificationList(jQuery.AddNotificationNamespace.PagerData);

        return false;
    }
    if (jQuery("#" + thValue + " i").hasClass('fa-long-arrow-down')) {
        jQuery(".fa-long-arrow-down").removeClass('fa fa-long-arrow-down');
        jQuery(".fa-long-arrow-up").removeClass('fa fa-long-arrow-up');

        jQuery("#" + thValue + " i").addClass('fa fa-long-arrow-up');
        thClass = value + "_asc";
        jQuery("#hdnSortbyNameValue").val(thClass);
        LoadNotificationList(jQuery.AddNotificationNamespace.PagerData);

        return false;
    }
}

function SetNotificationStatus(status) {
    var notificationStatus = "";

    switch (parseInt(status)) {
        case 1:
            notificationStatus = "Created";
            break;
        case 2:
            notificationStatus = "Assigned";
            break;
        case 3:
            notificationStatus = "Rejected";
            break;
        case 4:
            notificationStatus = "Completed";
            break;
        case 5:
            notificationStatus = "In-progress";
            break;
        case 6:
            notificationStatus = "Accepted";
            break;
        case 7:
            notificationStatus = "Closed";
            break;
    }
    return notificationStatus;
}

function CreateWorkOrder(isAssigned) {
    var query = "?id=" + jQuery.AddNotificationNamespace.BasicParam.SiteID + "&isworkorder=true&notificationid=" + notificationViewModel.NotificationID();
    if (isAssigned)
        query = query + "&maintscheduleid=" + notificationViewModel.AttachedSchedlueID();
    window.location.href = jQuery.AddNotificationNamespace.BasePath + "/Preventive/MaintenanceSchedule.aspx" + query;
}

function DeleteNotificationClick(notificationID) {
    jQuery("#alertMessage").removeClass("text-info");
    jQuery("#alertMessage").removeClass("text-danger");
    jQuery("#alertMessage").html(languageResource.resMsg_AreYouSureYouWantToDeleteNotification);
    jQuery("#confirmModal").dialog({
        modal: true,
        buttons: [
            {
                text: languageResource.resMsg_BtnConfirm,
                click: function () {
                    jQuery("#confirmModal").dialog("close");
                    DeleteConfirmedNotification(notificationID);
                }
            },
            {
                text: languageResource.resMsg_BtnCancel,
                click: function () {
                    jQuery("#confirmModal").dialog("close");
                    isTrue = false;
                }
            }
        ]
    });
}

function DeleteConfirmedNotification(notificationID) {
    jQuery.ajax({
        type: "POST",
        url: jQuery.AddNotificationNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/DeleteNotificationInfo",
        data: JSON.stringify({ basicParam: jQuery.AddNotificationNamespace.BasicParam, notificationID: notificationID }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (json) {
            if (json.d != null || json.d != undefined) {
                if (json.d === 1) { //successfully deleted notification information
                    ClearNotificationInfo();
                    LoadNotificationList(jQuery.AddNotificationNamespace.PagerData);
                }
                else if (json.d === -1) {
                    ShowErrorMessagePopUp(languageResource.resMsg_CantDeleteNotificationWorkOrderAssigned, true);
                }
                else {
                    var errorMsg =
                        ShowErrorMessagePopUp(languageResource.resMsg_NotificationDeleteFailure, "error");
                }
            }
        },
        error: function (request, error) {
            var errorMessage = "";
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    errorMessage = languageResource.resMsg_Error + errorMsg.Message;
                else
                    errorMessage = languageResource.resMsg_NotificationDeleteFailure;
            }
            else {
                errorMessage = languageResource.resMsg_Error + languageResource.resMsg_NotificationDeleteFailure;
            }
            ShowErrorMessagePopUp(errorMessage, true);
        }
    });
}

function RejectNotificationClick() {
    jQuery("#saveReasonMessage").html('');
    jQuery("#txtRejectReason").val('');
    jQuery("#rejectReasonModal").modal("show");
}

function ClearRejectReasonInfo() {
    jQuery("#txtRejectReason").html('');
    jQuery("#rejectReasonModal").modal("hide");
}

//FLocation or Equipment selection
function ShowFLocationEquipmentModal() {
    ClearEquipmentFLocationInfo();
    if (jQuery("input[name='rdbFloactionOrEquipment']:checked").val().toLowerCase() == "flocation") {
        jQuery("#divModalEquipmentOrLocation").removeClass("modal-lg");
        jQuery("#label").removeClass("col-lg-5").addClass("col-lg-6");
    }
    else {
        jQuery("#divModalEquipmentOrLocation").addClass("modal-lg");
        jQuery("#label").addClass("col-lg-5").removeClass("col-lg-6");
    }
    jQuery("#divSelectEquipmentFLocationModal").modal("show");
    LoadAllEquipmentFLoaction(jQuery.AddNotificationNamespace.EquipmentPagerData);
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
        jQuery.AddNotificationNamespace.IsMaintTypeSearch = true;
        jQuery("#spnEquipmentFLocationSearchError").text('');
        jQuery("#btnShowAllEquipment").show();
        LoadAllEquipmentFLoaction(jQuery.AddNotificationNamespace.EquipmentPagerData);
    }
    else {
        jQuery.AddNotificationNamespace.IsMaintTypeSearch = false;
        jQuery("#spnEquipmentFLocationSearchError").text(msg);
    }
}

function ShowAllEquipmentFLoaction() {
    ClearEquipmentFLocationInfo();
    LoadAllEquipmentFLoaction(jQuery.AddNotificationNamespace.EquipmentPagerData);
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
        LoadAllEquipmentFLoaction(jQuery.AddNotificationNamespace.EquipmentPagerData);
        return false;
    }
    if (jQuery("#" + thValue + " i").hasClass('fa-sort-up')) {
        jQuery(".fa-sort-down").removeClass('fa fa-sort-down');
        jQuery(".fa-sort-up").removeClass('fa fa-sort-up');

        jQuery("#" + thValue + " i").addClass('fa fa-sort-down');
        thClass = value + "_desc";
        jQuery("#hdfEquipmentSortValue").val(thClass);
        LoadAllEquipmentFLoaction(jQuery.AddNotificationNamespace.EquipmentPagerData);
        return false;
    }
    if (jQuery("#" + thValue + " i").hasClass('fa-sort-down')) {
        jQuery(".fa-sort-down").removeClass('fa fa-sort-down');
        jQuery(".fa-sort-up").removeClass('fa fa-sort-up');

        jQuery("#" + thValue + " i").addClass('fa fa-sort-up');
        thClass = value + "_asc";
        jQuery("#hdfEquipmentSortValue").val(thClass);
        LoadAllEquipmentFLoaction(jQuery.AddNotificationNamespace.EquipmentPagerData);
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

    if (jQuery.AddNotificationNamespace.IsMaintTypeSearch)
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
                            if (value.FunctionalLocationID == notificationViewModel.FlocationID())
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
                        locationEquipmentViewModel.LoadErrorMessage(languageResource.resMsg_NoRecordsFound);
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
    equipmentFilterInfo.InfoType = jQuery.AddNotificationNamespace.MaintMasterInfoType.Equipment.charCodeAt(0);

    if (jQuery.AddNotificationNamespace.IsMaintTypeSearch) {
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
                            if (value.EquipmentID == notificationViewModel.EquipmentID())
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
                        locationEquipmentViewModel.LoadErrorMessage(languageResource.resMsg_NoRecordsFound);
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
    notificationViewModel.DropdownNotificationFlag = false;

    if (locationEquipmentViewModel.IsEquipemntSelected()) {
        notificationViewModel.FlocationID(0);
        notificationViewModel.EquipmentID(rowInfo.EquipmentID);
        jQuery("#txtFLocationOrEquipmentName").val(rowInfo.EquipmentName);
        notificationViewModel.SelectFunctionalLocationFilter(0);
        jQuery("#drpFilterFuncLoc").select2();
        BindDropdownEquipmentFilter();
    }
    else {
        notificationViewModel.EquipmentID(0);
        notificationViewModel.FlocationID(rowInfo.FLocationID);
        jQuery("#txtFLocationOrEquipmentName").val(rowInfo.FLocationName);
        notificationViewModel.SelectFunctionalLocationFilter(notificationViewModel.FlocationID());
        jQuery("#drpFilterFuncLoc").select2();
        BindDropdownEquipmentFilter();
        jQuery("#drpFilterEquipment").select2();
    }
    notificationViewModel.DropdownNotificationFlag = true;
    LoadNotificationList(jQuery.AddNotificationNamespace.PagerData);

    jQuery(ctrl).siblings().removeClass('bg-info');
    jQuery(ctrl).siblings().find('.fa-hand-o-right').removeClass('fa-hand-o-right');
    jQuery(ctrl).find('i').addClass('fa-hand-o-right');
    jQuery(ctrl).addClass('bg-info');
    if (isClose)
        jQuery("#divSelectEquipmentFLocationModal").modal("hide");
}

function ClearEquipmentFLocationInfo() {
    jQuery.AddNotificationNamespace.IsMaintTypeSearch = false;
    jQuery("#txtSearchLocation").val('');
    jQuery("#txtSearchEquipment").val('');
    jQuery("#spnEquipmentFLocationSearchError").text('');
    jQuery("#btnShowAllEquipment").hide();
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

//add Notification type modal
function ShowAddMaintenanceTypeModal() {
    ClearMaintenanceTypeInfo();
    var btnAddMaintType = jQuery.AddNotificationNamespace.LoadControlID.replace("btnSaveNotification", "btnAddMaintType");
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
    jQuery("#divAddMaintenanceTypeModal").modal("show");
}

function SearchMaintTypes() {
    var btnSave = jQuery.AddNotificationNamespace.LoadControlID;
    jQuery.AddNotificationNamespace.IsMaintTypeSearch = true;

    if (jQuery.AddNotificationNamespace.IsMaintTypeSearch == true) {
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
    jQuery("#txtNotificationTypeCode").val("");
    var btnAddMaintType = btnSave.replace("btnSaveNotification", "btnAddMaintType");
    jQuery("#" + btnAddMaintType).val("");
    jQuery("#" + btnAddMaintType).val(languageResource.resMsg_Add);

    var thMaintTypes = jQuery.AddNotificationNamespace.LoadControlID.replace("btnSaveNotification", "thMaintTypes");
    jQuery("#" + thMaintTypes + " i").removeClass('fa-sort-up');
    jQuery("#" + thMaintTypes + " i").removeClass('fa-sort-down');
    jQuery("#hdfNotificationTypeSortValue").val('');
    jQuery("#divMaintTypes").removeClass("hide");
    jQuery("#iconViewMaintTypes").removeClass("fa fa-plus-circle");
    jQuery("#iconViewMaintTypes").addClass("fa fa-minus-circle");

    var maintTypeAccess = jQuery.AddNotificationNamespace.MaintTypePagerData.PageAccessRights.toLowerCase();
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

    LoadMaintTypesInfo(jQuery.AddNotificationNamespace.MaintTypePagerData);
}

function ShowAllMaintTypes() {
    jQuery.AddNotificationNamespace.IsMaintTypeSearch = false;
    ClearMaintenanceTypeInfo();
    jQuery("#btnShowAll").addClass('hide');

    var thMaintTypes = jQuery.AddNotificationNamespace.LoadControlID.replace("btnSaveNotification", "thMaintTypes");
    jQuery("#" + thMaintTypes + " i").removeClass('fa-sort-up');
    jQuery("#" + thMaintTypes + " i").removeClass('fa-sort-down');
    jQuery("#hdfNotificationTypeSortValue").val('');
    jQuery("#divMaintTypes").removeClass("hide");
    jQuery("#iconViewMaintTypes").removeClass("fa fa-plus-circle");
    jQuery("#iconViewMaintTypes").addClass("fa fa-minus-circle");

    var btnAddMaintType = jQuery.AddNotificationNamespace.LoadControlID.replace("btnSaveNotification", "btnAddMaintType");
    jQuery("#" + btnAddMaintType).val("");
    jQuery("#" + btnAddMaintType).val(languageResource.resMsg_Add);

    var maintTypeAccess = jQuery.AddNotificationNamespace.MaintTypePagerData.PageAccessRights.toLowerCase();
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

    LoadMaintTypesInfo(jQuery.AddNotificationNamespace.MaintTypePagerData);
}

function ClearMaintenanceTypeInfo() {
    jQuery("#spnSearchError").html("");
    jQuery("#spnAddMaintTypeError").html("");
    var btnAddMaintType = jQuery.AddNotificationNamespace.LoadControlID.replace("btnSaveNotification", "btnAddMaintType");
    jQuery("#" + btnAddMaintType).val("");
    jQuery("#" + btnAddMaintType).val(languageResource.resMsg_Add);
    if (jQuery.AddNotificationNamespace.MaintTypePagerData.PageAccessRights.toLowerCase() == "full_access") {
        jQuery("#" + btnAddMaintType).removeAttr('disabled');
        jQuery("#" + btnAddMaintType).prop("onclick", null);
        jQuery("#" + btnAddMaintType).unbind('click');
        jQuery("#" + btnAddMaintType).bind("click", function () { InsertOrUpdateMaintType(0); return false; });
    }
    else {
        jQuery("#" + btnAddMaintType).attr('disabled', 'disabled');
    }

    if (jQuery.AddNotificationNamespace.MaintTypePagerData.PageAccessRights.toLowerCase() != "full_access") {
        jQuery("#" + btnAddMaintType).attr("disabled", "disabled");
    }
    var btnShowAll = "btnShowAll";
    if (jQuery.trim(jQuery("#txtNewMaintType").val()) == "" && jQuery.trim(jQuery("#txtNotificationTypeCode").val()) == "" && jQuery.trim(jQuery("#txtSearchMaintType").val()) == "" && (jQuery("#" + btnShowAll).is(':visible') == false))
        jQuery("#divAddMaintenanceTypeModal").modal("hide");
    else {
        jQuery("#txtNewMaintType").val("");
        jQuery("#txtNotificationTypeCode").val("");
        jQuery("#txtSearchMaintType").val("");
        if (jQuery("#" + btnShowAll).is(':visible')) {
            jQuery("#" + btnShowAll).addClass('hide');
            LoadMaintTypesInfo(jQuery.AddNotificationNamespace.MaintTypePagerData);
        }
    }

    if (jQuery("#divAddMaintenanceTypeModal").hasClass('ui-dialog-content')) {
        jQuery("#divAddMaintenanceTypeModal").dialog("close");
    }
}

function ShowHideMaintTypesInfo() {
    if (jQuery("#iconViewMaintTypes").hasClass("fa-plus-circle")) {
        var thMaintTypes = jQuery.AddNotificationNamespace.LoadControlID.replace("btnSaveNotification", "thMaintTypes");
        jQuery("#" + thMaintTypes + " i").removeClass('fa-sort-up');
        jQuery("#" + thMaintTypes + " i").removeClass('fa-sort-down');
        jQuery("#hdfNotificationTypeSortValue").val('');
        jQuery("#divMaintTypes").removeClass("hide");
        jQuery("#iconViewMaintTypes").removeClass("fa fa-plus-circle");
        jQuery("#iconViewMaintTypes").addClass("fa fa-minus-circle");

        var maintTypeAccess = jQuery.AddNotificationNamespace.MaintTypePagerData.PageAccessRights.toLowerCase();
        if (maintTypeAccess == "full_access" || maintTypeAccess == "edit_only")
            maintenanceTypeUpdateViewModel.HasMaintTypeAccess = true;
        if (maintTypeAccess == "full_access") {
            maintenanceTypeUpdateViewModel.HasDeleteMaintTypeAccess = true;
        }
        LoadMaintTypesInfo(jQuery.AddNotificationNamespace.MaintTypePagerData);
    }
    else {
        jQuery("#iconViewMaintTypes").removeClass("fa fa-minus-circle");
        jQuery("#iconViewMaintTypes").addClass("fa fa-plus-circle");
        jQuery("#divMaintTypes").addClass("hide");
    }
}

function LoadMaintTypesInfo(pagerData) {
    var masterDataFilterInfo = {};
    masterDataFilterInfo.PageIndex = pagerData.PageIndex;
    masterDataFilterInfo.PageSize = pagerData.PageSize;
    masterDataFilterInfo.MasterDataType = jQuery.AddNotificationNamespace.MaintMasterDataType.NotificationType;

    if (jQuery.AddNotificationNamespace.IsMaintTypeSearch == true) {
        if (jQuery.trim(jQuery("#txtSearchMaintType").val()) != "") {
            masterDataFilterInfo.SearchString = jQuery.trim(jQuery("#txtSearchMaintType").val());
        }
    }

    if (jQuery("#hdfNotificationTypeSortValue").val() != "") {
        masterDataFilterInfo.SortType = jQuery("#hdfNotificationTypeSortValue").val();
    }

    jQuery.ajax({
        type: "POST",
        url: jQuery.AddNotificationNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/GetMaintMasterDataWithPager",
        data: JSON.stringify({ pagerData: pagerData, basicParam: jQuery.AddNotificationNamespace.BasicParam, masterDataFilterInfo: masterDataFilterInfo }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        success: function (json) {
            maintenanceTypeUpdateViewModel.DefaultMaintenanceTypesArray([]);
            if (json != undefined && json.d != undefined) {
                if (json.d.MasterDataInfoList.length == 0) {
                    maintenanceTypeUpdateViewModel.LoadErrorMessage(languageResource.resMsg_NoRecordsFound);
                    maintenanceTypeUpdateViewModel.LoadErrorMessageClass('');
                    maintenanceTypeUpdateViewModel.LoadErrorMessageVisible(true);
                }
                else {
                    var masterDataInfoList = json.d.MasterDataInfoList;
                    maintenanceTypeUpdateViewModel.DefaultMaintenanceTypesArray(masterDataInfoList);
                    maintenanceTypeUpdateViewModel.MaintTypePagerData(json.d.HTMLPager);
                }
            }
            else {
                maintenanceTypeUpdateViewModel.LoadErrorMessage(languageResource.resMsg_FailedToLoadNotificationTypeInfo);
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
            var errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadNotificationTypeInfo;
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
    jQuery("#txtNotificationTypeCode").val(maintCode);
    var btnAddMaintType = jQuery.AddNotificationNamespace.LoadControlID.replace("btnSaveNotification", "btnAddMaintType");
    jQuery("#" + btnAddMaintType).val("");
    jQuery("#" + btnAddMaintType).val(languageResource.resMsg_Update);
    if (jQuery.AddNotificationNamespace.MaintTypePagerData.PageAccessRights.toLowerCase() == "full_access" || jQuery.AddNotificationNamespace.MaintTypePagerData.PageAccessRights.toLowerCase() == "edit_only") {
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
    jQuery("#alertMessage").html(languageResource.resMsg_DeleteNotificationTypeConfirm);
    jQuery("#confirmModal").dialog({
        zIndex: 99999,
        closeOnEscape: false,
        open: function (event, ui) {
            jQuery(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
            jQuery(".ui-widget-overlay").css('z-index', '10043');
        },
        modal: true,
        buttons: [
            {
                text: languageResource.resMsg_BtnConfirm,
                click: function () {
                    jQuery("#confirmModal").dialog("close");
                    DeleteMaintTypeInfo(maintTypeID);
                }
            },
            {
                text: languageResource.resMsg_BtnCancel,
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
    var btnAddMaintType = jQuery.AddNotificationNamespace.LoadControlID.replace("btnSaveNotification", "btnAddMaintType");
    jQuery("#" + btnAddMaintType).val("");
    jQuery("#" + btnAddMaintType).val(languageResource.resMsg_Add);
    if (jQuery.AddNotificationNamespace.MaintTypePagerData.PageAccessRights.toLowerCase() == "full_access") {
        jQuery("#" + btnAddMaintType).removeAttr('disabled');
        jQuery("#" + btnAddMaintType).prop("onclick", null);
        jQuery("#" + btnAddMaintType).unbind('click');
        jQuery("#" + btnAddMaintType).bind("click", function () { InsertOrUpdateMaintType(0); return false; });
    }
    else {
        jQuery("#" + btnAddMaintType).attr('disabled', 'disabled');
    }

    if (jQuery.AddNotificationNamespace.MaintTypePagerData.PageAccessRights.toLowerCase() != "full_access") {
        jQuery("#" + btnAddMaintType).attr("disabled", "disabled");
    }
    var btnShowAll = "btnShowAll";
    jQuery("#txtNewMaintType").val("");
    jQuery("#txtNotificationTypeCode").val("");
    jQuery("#txtSearchMaintType").val("");
    jQuery("#" + btnShowAll).addClass('hide');

    var masterDataInfo = {};
    masterDataInfo.MasterDataID = maintTypeID;
    masterDataInfo.MasterDataType = jQuery.AddNotificationNamespace.MaintMasterDataType.NotificationType;
    jQuery.ajax({
        type: "POST",
        url: jQuery.AddNotificationNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/DeleteMasterData",
        data: JSON.stringify({ basicParam: jQuery.AddNotificationNamespace.BasicParam, masterDataInfo: masterDataInfo }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if (json.d != undefined && json.d != null) {
                if (json.d == 1)
                    ShowErrorMessagePopUp(languageResource.resMsg_NotificationTypeInfoAlreadyInUse, true);
                else {
                    LoadMaintTypesInfo(jQuery.AddNotificationNamespace.MaintTypePagerData);
                }

                LoadMaintMasterData(jQuery.AddNotificationNamespace.MaintMasterDataType.NotificationType);
                jQuery("#ddlSelectMaintenanceType").select2({ width: '50%' });
                jQuery("#txtNewMaintType").val('');
                jQuery("#txtNotificationTypeCode").val("");
            }
            else {
                var msg = languageResource.resMsg_FailedToDeleteNotificationTypeInfo;
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
                    msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToDeleteNotificationTypeInfo;
            }
            else {
                msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToDeleteNotificationTypeInfo;
            }
            ShowErrorMessagePopUp(msg, true);
        },
    });
}

function InsertOrUpdateMaintType(maintTypeID) {
    jQuery("#spnAddMaintTypeError").removeClass('text-danger');
    jQuery("#spnAddMaintTypeError").text('');
    if (jQuery.trim(jQuery("#txtNewMaintType").val()).length == 0) {
        jQuery("#spnAddMaintTypeError").addClass('text-danger');
        jQuery("#spnAddMaintTypeError").text(languageResource.resMsg_EnterMaintType);
    }
    else {
        var masterDataInfo = {};
        masterDataInfo.MasterDataID = maintTypeID;
        masterDataInfo.MasterDataName = jQuery.trim(jQuery("#txtNewMaintType").val());
        masterDataInfo.Description = jQuery.trim(jQuery("#txtNotificationTypeCode").val());
        masterDataInfo.MasterDataType = jQuery.AddNotificationNamespace.MaintMasterDataType.NotificationType;
        jQuery.ajax({
            type: "POST",
            url: jQuery.AddNotificationNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/InsertUpdateMasterData",
            data: JSON.stringify({ basicParam: jQuery.AddNotificationNamespace.BasicParam, masterDataInfo: masterDataInfo }),
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
                    var btnAddMaintType = jQuery.AddNotificationNamespace.MaintTypePagerData.LoadControlID.replace("btnSaveNotification", "btnAddMaintType");
                    jQuery("#" + btnAddMaintType).val(languageResource.resMsg_Add);
                    if (jQuery.AddNotificationNamespace.MaintTypePagerData.PageAccessRights.toLowerCase() == "full_access") {
                        jQuery("#" + btnAddMaintType).removeAttr('disabled');
                        jQuery("#" + btnAddMaintType).prop("onclick", null);
                        jQuery("#" + btnAddMaintType).unbind('click');
                        jQuery("#" + btnAddMaintType).bind("click", function () { InsertOrUpdateMaintType(0); return false; });
                    }
                    else {
                        jQuery("#" + btnAddMaintType).attr('disabled', 'disabled');
                    }
                    LoadMaintMasterData(jQuery.AddNotificationNamespace.MaintMasterDataType.NotificationType);
                    //update dropdown
                    notificationViewModel.SelectedNotificationType(json.d);
                    jQuery("#drpNotificationType").select2();
                    jQuery("#ddlSelectMaintenanceType").select2({ width: '50%' });
                    jQuery("#txtNewMaintType").val('');
                    jQuery("#txtNotificationTypeCode").val("");
                    LoadMaintTypesInfo(jQuery.AddNotificationNamespace.MaintTypePagerData);
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
        jQuery("#hdfNotificationTypeSortValue").val(thClass);
        LoadMaintTypesInfo(jQuery.AddNotificationNamespace.MaintTypePagerData);
        return false;
    }
    if (jQuery("#" + thValue + " i").hasClass('fa-sort-up')) {
        jQuery(".fa-sort-down").removeClass('fa fa-sort-down');
        jQuery(".fa-sort-up").removeClass('fa fa-sort-up');

        jQuery("#" + thValue + " i").addClass('fa fa-sort-down');
        thClass = value + "_desc";
        jQuery("#hdfNotificationTypeSortValue").val(thClass);
        LoadMaintTypesInfo(jQuery.AddNotificationNamespace.MaintTypePagerData);
        return false;
    }
    if (jQuery("#" + thValue + " i").hasClass('fa-sort-down')) {
        jQuery(".fa-sort-down").removeClass('fa fa-sort-down');
        jQuery(".fa-sort-up").removeClass('fa fa-sort-up');

        jQuery("#" + thValue + " i").addClass('fa fa-sort-up');
        thClass = value + "_asc";
        jQuery("#hdfNotificationTypeSortValue").val(thClass);
        LoadMaintTypesInfo(jQuery.AddNotificationNamespace.MaintTypePagerData);
        return false;
    }
}

//Attachments 
function LoadAttachmentInfo() {
    if (notificationViewModel.NotificationID() > 0) {

        jQuery.ajax({
            type: "POST",
            url: jQuery.AddNotificationNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/GetAttachmentDetailsForNotification",
            data: JSON.stringify({ basicParam: jQuery.AddNotificationNamespace.BasicParam, notificationID: notificationViewModel.NotificationID() }),
            contentType: "application/json; charset=utf-8",
            datatype: 'json',
            success: function (json) {
                if (json != undefined && json.d != undefined && json.d != null) {
                    if (json.d.length > 0) {
                        notificationViewModel.AttachmentList.removeAll();
                        ko.utils.arrayForEach(json.d, function (item) {
                            var ext = item.DocumentName.substring(item.DocumentName.lastIndexOf('.') + 1).toLowerCase();
                            var type = GetAttachmentType(ext);
                            if (type == jQuery.AddNotificationNamespace.DocumentType.DOCUMENT) {
                                item.ThumbnailPath = jQuery.AddNotificationNamespace.ImagePath + '/Styles/Images/' + ext + '.png';
                            }
                            else if (type == jQuery.AddNotificationNamespace.DocumentType.VIDEO) {
                                item.ThumbnailPath = jQuery.AddNotificationNamespace.ImagePath + '/Styles/Images/video.png';
                            }
                            notificationViewModel.AttachmentList.push(item);
                        });
                    }
                }
                else {
                    ShowErrorMessagePopUp(languageResource.resMsg_FailedToLoadAttachmentInfo, true);
                }
            },
            beforeSend: function () {
                jQuery("#divAttachmentProgress").removeClass("hide");
                notificationViewModel.AttachmentList.removeAll();
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
                ShowErrorMessagePopUp(errorMessage, true);
            }
        });
    }
}

function GetAttachmentType(ext) {
    if (ext == "pdf" || ext == "xls" || ext == "xlsx" || ext == "doc" || ext == "docx" || ext == "txt" || ext == "xps" || ext == "ppt" || ext == "pptx") {
        return jQuery.AddNotificationNamespace.DocumentType.DOCUMENT;

    } else if (ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg") {
        return jQuery.AddNotificationNamespace.DocumentType.IMAGE;
    }
    else if (ext == "ogg" || ext == "ogv" || ext == "avi" || ext == "mpeg" || ext == "mov" || ext == "wmv" || ext == "flv" || ext == "mp4" || ext == "mpg") {
        return jQuery.AddNotificationNamespace.DocumentType.VIDEO;
    }
    return 'INVALID_FORMAT';
}

function UploadAttachment() {
    var capturedFile = jQuery("#fileUpload").val();
    var notificationID = notificationViewModel.NotificationID() == 0 ? notificationViewModel.SequenceID() : notificationViewModel.NotificationID();
    var downloadPath = jQuery.AddNotificationNamespace.NotificationAttachmentPath + "/" + jQuery.AddNotificationNamespace.BasicParam.SiteID + "/" + notificationID;
    var isValid = false;
    var errorMessage = "";
    var fileUploadedICon = "";

    var fileName = capturedFile.substring(capturedFile.lastIndexOf('\\') + 1);
    var ext = capturedFile.substring(capturedFile.lastIndexOf('.') + 1).toLowerCase();
    var type = GetAttachmentType(ext);
    if (type == jQuery.AddNotificationNamespace.DocumentType.DOCUMENT) {
        fileUploadedICon = jQuery.AddNotificationNamespace.ImagePath + '/Styles/Images/' + ext + '.png';
        isValid = true;

    } else if (type == jQuery.AddNotificationNamespace.DocumentType.IMAGE) {
        fileUploadedICon = downloadPath + "/Thumbnail/" + fileName;
        isValid = true;
    }
    else if (type == jQuery.AddNotificationNamespace.DocumentType.VIDEO) {
        fileUploadedICon = jQuery.AddNotificationNamespace.ImagePath + '/Styles/Images/video.png';
        isValid = true;
    }
    else {
        errorMessage = languageResource.resMsg_InvalidUploadingFormat;
    }

    if (isValid) {
        var urlString = jQuery.AddNotificationNamespace.UploaderPath + '?uid=' + jQuery.AddNotificationNamespace.BasicParam.UserID + '&sid=' + jQuery.AddNotificationNamespace.BasicParam.SiteID + '&notificationid=' + notificationID + '&fileName=' + fileName + '&notificationAttachment=true';

        jQuery.ajaxFileUpload({
            type: "POST",
            url: urlString,
            fileElementId: 'fileUpload',
            processData: false,
            success: function (data, status) {
                jQuery("#fileUpload").attr("value", '');
                if (data.documentElement.innerText != "true") {
                    ShowErrorMessagePopUp(languageResource.resMsg_FaliedToUpload, true);
                }
                else {
                    var attachmentInfo = {};
                    attachmentInfo.DocumentID = 0;
                    attachmentInfo.DocumentName = fileName;
                    attachmentInfo.DocumentType = type;
                    attachmentInfo.ThumbnailPath = fileUploadedICon;
                    attachmentInfo.DownloadPath = downloadPath + "/" + fileName;
                    SaveAttachmentInfo(fileName, attachmentInfo, notificationID);
                }
            },
            error: function (request, error) {
                jQuery("#fileUpload").attr("value", '');
                var errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FaliedToUpload;
                if (request.responseText != "") {
                    var errorMsg = jQuery.parseJSON(request.responseText);
                    if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                        errorMessage = languageResource.resMsg_Error + errorMsg.Message;
                }
                ShowErrorMessagePopUp(errorMessage, true);
            }
        });
    }
    else {
        ShowErrorMessagePopUp(errorMessage, true);
    }
}

function SaveAttachmentInfo(fileName, attachmentInfo, notificationID) {
    var documentFilterInfo = {};
    documentFilterInfo.SiteID = jQuery.AddNotificationNamespace.BasicParam.SiteID;
    documentFilterInfo.UserID = jQuery.AddNotificationNamespace.BasicParam.UserID;
    documentFilterInfo.ReferenceID = notificationID;
    documentFilterInfo.DocumentName = fileName;
    documentFilterInfo.DocumentType = attachmentInfo.DocumentType.charCodeAt();
    documentFilterInfo.InfoType = jQuery.AddNotificationNamespace.DocumentInfoType.NotificationAttachment.charCodeAt();

    jQuery.ajax({
        type: "POST",
        url: jQuery.AddNotificationNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/InsertDocumentsAndImagesInfo",
        data: JSON.stringify({ filterInfo: documentFilterInfo }),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data.d !== null && data.d != undefined) {
                if (data.d > 0) {
                    attachmentInfo.DocumentID = data.d;
                    notificationViewModel.AttachmentList.push(attachmentInfo);
                }
                else if (data.d == -2) {
                    ShowErrorMessagePopUp(languageResource.resMsg_AttachmentNameAlreadyExists, true);
                }
                else {
                    ShowErrorMessagePopUp(languageResource.resMsg_FailedToUpdateAttachmentInfo, true);
                }
            }
            else {
                ShowErrorMessagePopUp(languageResource.resMsg_FailedToUpdateAttachmentInfo, true);
            }
        },
        error: function (request, error) {
            var errorMessage = languageResource.resMsg_FailedToUpdateAttachmentInfo;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                    errorMessage = errorMsg.Message;
            }
            ShowErrorMessagePopUp(languageResource.resMsg_Error + errorMessage, true);
        }
    });
}

function DownloadAttachment(data) {
    var fileName = data.DocumentName;
    var filePath = data.DownloadPath;
    var ext = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
    var type = GetAttachmentType(ext);

    if (type == jQuery.AddNotificationNamespace.DocumentType.VIDEO && (ext == "mp4" || ext == "ogg")) {
        jQuery("#divLoadMediaContent").html("<video id='videoCtrl' width='98%' height='98%' autoplay controls><source src='" + filePath + "' type='video/" + ext + "'></video>");
        jQuery("#divVideoPhotoModal").modal('show');
        var videoCtrl = document.getElementById('videoCtrl');
        jQuery("#divVideoPhotoModal").on('hide.bs.modal', function () {
            videoCtrl.pause();
            videoCtrl.removeAttribute('src');
        });
    }
    else if (type == jQuery.AddNotificationNamespace.DocumentType.IMAGE) {
        jQuery("#divLoadMediaContent").html("<img style='width:98%;height:98%;' src='" + filePath + "' />");
        jQuery("#divLoadMediaContent>img").css("height", "");
        jQuery("#divVideoPhotoModal").modal('show');
    }
    else {
        window.location = jQuery.AddNotificationNamespace.BasePath + "/HandlerFiles/DownloadHandler.ashx?MaintenanceDocsName=" + fileName + "&MaintenanceDocsPath=" + filePath;
    }
}

function DeleteAttachment(data) {
    jQuery("#alertMessage").removeClass("text-danger");
    jQuery("#alertMessage").html(languageResource.resMsg_AreYouSureWantToDeleteAttachment);
    jQuery("#confirmModal").dialog({
        modal: true,
        buttons: [
            {
                text: languageResource.resMsg_BtnConfirm,
                click: function () {
                    jQuery("#confirmModal").dialog("close");
                    DeleteAttachmentInfo(data);
                }
            },
            {
                text: languageResource.resMsg_BtnCancel,
                click: function () {
                    jQuery("#confirmModal").dialog("close");
                }
            }
        ]
    });
}

function DeleteAttachmentInfo(item) {

    jQuery.ajax({
        type: "POST",
        url: jQuery.AddNotificationNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/DeleteDocumentsAndImagesInfo",
        data: JSON.stringify({ basicParam: jQuery.AddNotificationNamespace.BasicParam, documentID: item.DocumentID }),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data.d !== null && data.d != undefined && data.d == true) {
                notificationViewModel.AttachmentList.remove(item);
            }
            else {
                ShowErrorMessagePopUp(languageResource.resMsg_FailedToDeleteAttachmentInfo, true);
            }
        },
        error: function (request, error) {
            var errorMessage = languageResource.resMsg_FailedToDeleteAttachmentInfo;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                    errorMessage = errorMsg.Message;
            }
            ShowErrorMessagePopUp(languageResource.resMsg_Error + errorMessage, true);
        }
    });
}

function GetSequenceID() {
    var isValid = true;
    var errorMessage = "";
    if (notificationViewModel.FlocationID() == 0 && notificationViewModel.EquipmentID() == 0) {
        errorMessage = errorMessage + languageResource.resMsg_SelectEquipmentOrFunctionalLocation + "<br/>";
        isValid = false;
    }
    if (notificationViewModel.NotificationName() == "") {
        errorMessage = errorMessage + languageResource.resMsg_EnterNotificationName + "<br/>";
        isValid = false;
    }
    if (notificationViewModel.SelectedNotificationType() <= 0) {
        errorMessage = errorMessage + languageResource.resMsg_PleaseSelectNotificationType + "<br/>";
        isValid = false;
    }

    if (notificationViewModel.SelectedPriority() == "") {
        errorMessage = errorMessage + languageResource.resMsg_PleaseSelectPriority + "<br/>";
        isValid = false;
    }
    if (isValid == false) {
        ShowMessage(errorMessage, "error");
    }
    else {
        notificationViewModel.ModelErrorMsg('');
        jQuery.ajax({
            type: "POST",
            url: jQuery.AddNotificationNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/GetNextNotificationSequenceID",
            data: JSON.stringify({ basicParam: jQuery.AddNotificationNamespace.BasicParam }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (json) {
                if (json.d != null && json.d != undefined) {
                    if (json.d > 0) {
                        notificationViewModel.SequenceID(json.d);
                        jQuery("#fileUpload").removeAttr("onclick");
                        jQuery("#fileUpload").prop("onclick", null);
                        jQuery("#fileUpload").unbind('click');
                        jQuery("#fileUpload").bind("click", '');   

                        var isIE = /MSIE|Trident/.test(window.navigator.userAgent); //based on browser
                        if (isIE) {
                            setTimeout(function () {
                                jQuery("#fileUpload").trigger("click");
                            }, 1);
                        }
                        else
                            jQuery("#fileUpload").trigger("click");
                    }
                    else
                        ShowMessage(languageResource.resMsg_FailedToGetNotificationSequence, "error");
                }
                else {
                    ShowMessage(languageResource.resMsg_FailedToGetNotificationSequence, "error");
                }
            },
            error: function (request, error) {
                if (request.responseText != "") {
                    var errorMsg = jQuery.parseJSON(request.responseText);
                    if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null) {
                        errorMessage = languageResource.resMsg_Error + errorMsg.Message;
                        ShowMessage(errorMessage, "error");
                    }
                    else {
                        errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToGetNotificationSequence;
                        ShowMessage(errorMessage, "error");
                    }
                }
                else {
                    errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToGetNotificationSequence;
                    ShowMessage(errorMessage, "error");
                }
            }
        });
    }

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
                text: languageResource.resMsg_BtnOK,
                click: function () {
                    jQuery("#confirmModal").dialog("close");
                }
            }
        ]
    });
}

function ShowMessage(message, messageType) {
    switch (messageType.toLowerCase()) {
        case 'info':
            notificationViewModel.ModelErrorCss("text-info");
            notificationViewModel.ModelErrorMsg(message);
            break;
        case 'error':
            notificationViewModel.ModelErrorCss("text-danger");
            notificationViewModel.ModelErrorMsg(message);
            break;
    }
}

function BindIconAttributes(hasAccess) {
    var iconAttributes = {};
    if (!hasAccess) {
        iconAttributes.disabled = "disabled";
    }
    return iconAttributes;
}

function BindDocumentIconAttributes(element) {
    if (notificationViewModel.HasEditAccess && (notificationViewModel.IsNotificationStatusCreate() || notificationViewModel.SequenceID() > 0))
        jQuery(element).removeClass("icon-muted");
    else
        jQuery(element).addClass("icon-muted");
}

function ManageSiteMapUrl() {
    var manageNotificationURL = jQuery.AddNotificationNamespace.BasePath + "/Preventive/ManageNotification.aspx?id=" + jQuery.AddNotificationNamespace.PagerData.SiteID;

    jQuery("#lnkAdminTab,#A1").attr("isSetDefault", "false");
    jQuery("#lnkAdminTab").attr("href", manageNotificationURL); // Set herf value
    jQuery("#A1").attr("href", manageNotificationURL); // Set herf value
}

jQuery(document).ready(function () {
    jQuery("input[type='radio']").click(function () {
        notificationViewModel.FlocationID(0);
        notificationViewModel.EquipmentID(0);
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

    jQuery("textarea").addClass("font-small");
    jQuery("textarea").css({ "resize": "none", "overflow": "hidden" });
    jQuery("textarea").keyup(function (e) {
        autoheight(this);
    });
    jQuery('#txtSearchEquipment').on('keypress', function (e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode === 13) {
            e.preventDefault();
            return false;
        }
    });
});

function Toggle(elm) {
    var toggleDiv = jQuery(elm).parent('div').next('div');
    if (jQuery(elm).hasClass('fa-plus-circle')) {
        jQuery(elm).removeClass('fa-plus-circle').addClass('fa-minus-circle');
        jQuery(elm).parent('div').css({ "border-bottom": "" })
    } else {
        jQuery(elm).removeClass('fa-minus-circle').addClass('fa-plus-circle');
        jQuery(elm).parent('div').css({ "border-bottom": "1px solid #c1c1c1" })
    }
    if (jQuery(toggleDiv).hasClass('show')) {
        jQuery(toggleDiv).removeClass('show').addClass('hide');
    } else {
        jQuery(toggleDiv).removeClass('hide').addClass('show');
    }
}

function autoheight(a) {
    if (!jQuery(a).prop('scrollTop')) {
        do {
            var b = $(a).prop('scrollHeight');
            var h = $(a).height();
            jQuery(a).height(h - 5);
        }
        while (b && (b != jQuery(a).prop('scrollHeight')));
    };
    jQuery(a).height(jQuery(a).prop('scrollHeight') + 5);
}

function AcceptNotificationClick() {
    jQuery("#alertMessage").removeClass("text-info");
    jQuery("#alertMessage").removeClass("text-danger");
    jQuery("#alertMessage").html(languageResource.resMsg_AreYouSureYouWantToAcceptNotification);
    jQuery("#confirmModal").dialog({
        modal: true,
        buttons: [
            {
                text: languageResource.resMsg_BtnConfirm,
                click: function () {
                    jQuery("#confirmModal").dialog("close");
                    AcceptNotification();
                }
            },
            {
                text: languageResource.resMsg_BtnCancel,
                click: function () {
                    jQuery("#confirmModal").dialog("close");
                    isTrue = false;
                }
            }
        ]
    });
}

function AcceptNotification() {
    jQuery.ajax({
        type: "POST",
        url: jQuery.AddNotificationNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/AcceptNotificationInfo",
        data: JSON.stringify({ basicParam: jQuery.AddNotificationNamespace.BasicParam, notificationID: notificationViewModel.NotificationID() }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (json) {
            if (json.d != undefined && json.d != null && json.d > 0) {
                notificationViewModel.NotificationStatus(SetNotificationStatus(6));
                notificationViewModel.IsNotificationAcceptVisible(false);
                notificationViewModel.IsNotificationCloseVisible(true);
                notificationViewModel.IsNotificationCreateWOVisible(true);
                LoadNotificationList(jQuery.AddNotificationNamespace.PagerData);
                ko.utils.arrayForEach(notificationViewModel.NotificationList(), function (item) {
                    item.SelectedClass('');
                    if (item.NotificationID == json.d) {
                        item.SelectedClass('bg-info');
                    }
                });
            }
            else {
                  ShowErrorMessagePopUp(languageResource.resMsg_NotificationAcceptFailure, "error");
            }
        },
        error: function (request, error) {
            var errorMessage = "";
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    errorMessage = languageResource.resMsg_Error + errorMsg.Message;
                else
                    errorMessage = languageResource.resMsg_NotificationAcceptFailure;
            }
            else {
                errorMessage = languageResource.resMsg_Error + languageResource.resMsg_NotificationAcceptFailure;
            }
            ShowErrorMessagePopUp(errorMessage, true);
        }
    });
}

function CloseNotificationClick() {
    ClearNotificationClosingInfo();
    jQuery("#closeNotificationModal").modal("show");
}

function LoadUnitOfTime() {
    closeNotificationViewModel.UnitOfTimeList.removeAll();
    jQuery.each(jQuery.AddNotificationNamespace.UnitOfTime, function (value, key) {
        var unitOfTimeObj = {};
        unitOfTimeObj.TypeValue = key;
        unitOfTimeObj.DisplayName = value;
        closeNotificationViewModel.UnitOfTimeList.push(unitOfTimeObj);
    });
}

function ClearNotificationClosingInfo() {
    closeNotificationViewModel.TimeSpent('');
    closeNotificationViewModel.Remark('');
    closeNotificationViewModel.WorkStartDate(0);
    closeNotificationViewModel.WorkStartTime(0);
    closeNotificationViewModel.WorkEndDate(0);
    closeNotificationViewModel.WorkEndTime(0);
    jQuery("#ddlTimeUnit").val(jQuery.AddNotificationNamespace.UnitOfTime.Minutes);
    var currentDateTimeInfo = GetSiteCurrentDateTime();
    var currentDate = new Date();
    if (currentDateTimeInfo != undefined && currentDateTimeInfo != null && currentDateTimeInfo.CurrentDate != undefined && currentDateTimeInfo.CurrentDate != 0) {
        currentDate = ConvertIntToDate(currentDateTimeInfo.CurrentDate, currentDateTimeInfo.CurrentTime);
    }
    jQuery("#txtWorkStartDate,#txtWorkEndDate").datepicker('setDate', currentDate);
    closeNotificationViewModel.WorkStartDate(ConvertDatePickerFormatToInt(jQuery.trim(jQuery("#txtWorkStartDate").val())));
    closeNotificationViewModel.WorkEndDate(ConvertDatePickerFormatToInt(jQuery.trim(jQuery("#txtWorkEndDate").val())));

    jQuery("#txtWorkStartTime,#txtWorkEndTime").val('');
}

function CloseNotificationInfo() {
    jQuery("#saveCloseNotificationMessage").html('');
    var notificationInfo = {};
    notificationInfo.NotificationID = notificationViewModel.NotificationID();
    notificationInfo.WorkStartDate = closeNotificationViewModel.WorkStartDate();
    notificationInfo.WorkStartTime = closeNotificationViewModel.WorkStartTime();
    notificationInfo.WorkEndDate = closeNotificationViewModel.WorkEndDate();
    notificationInfo.WorkEndTime = closeNotificationViewModel.WorkEndTime();
    notificationInfo.TimeTaken = closeNotificationViewModel.TimeSpent();
    notificationInfo.TimeTakenUnit = jQuery("#ddlTimeUnit").val().charCodeAt();
    notificationInfo.Remark = closeNotificationViewModel.Remark();

    var isValid = true;
    var errorMessage = "";
    if (notificationInfo.TimeTaken == "") {
        errorMessage = errorMessage + languageResource.resMsg_EnterTimeSpent + "<br/>";
        isValid = false;
    }
    if (notificationInfo.WorkStartDate == 0) {
        errorMessage = errorMessage + languageResource.resMsg_SelectWorkStartDate + "<br/>";
        isValid = false;
    }
    if (notificationInfo.WorkEndDate == 0) {
        errorMessage = errorMessage + languageResource.resMsg_SelectWorkEndDate + "<br/>";
        isValid = false;
    }
    if (jQuery.trim(notificationInfo.Remark).length == 0) {
        errorMessage = errorMessage + languageResource.resMsg_EnterRemark + "<br/>";
        isValid = false;
    }
    if (notificationInfo.WorkStartDate > notificationInfo.WorkEndDate) {
        errorMessage = errorMessage + languageResource.resMsg_SelectProperDateRange + "<br/>";
        isValid = false;
    }
    else if (notificationInfo.WorkStartDate == notificationInfo.WorkEndDate && notificationInfo.WorkStartTime > notificationInfo.WorkEndTime) {
        errorMessage = errorMessage + languageResource.resMsg_SelectProperDateRange + "<br/>";
        isValid = false;
    }

    if (isValid == false) {
        jQuery("#saveCloseNotificationMessage").html(errorMessage);
    }

    if (isValid == true) {
        jQuery.ajax({
            type: "POST",
            url: jQuery.AddNotificationNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/CloseNotificationInfo",
            data: JSON.stringify({ basicParam: jQuery.AddNotificationNamespace.BasicParam, notificationInfo: notificationInfo }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (json) {
                if (json.d != null && json.d != undefined) {
                    switch (json.d) {
                        case -1: jQuery("#saveCloseNotificationMessage").html(languageResource.resMsg_EnterTimeSpent);
                            break;
                        case -2: jQuery("#saveCloseNotificationMessage").html(languageResource.resMsg_SelectWorkStartDate);
                            break;
                        case -3: jQuery("#saveCloseNotificationMessage").html(languageResource.resMsg_SelectWorkEndDate);
                            break;
                        default:
                            {
                                jQuery("#closeNotificationModal").modal("hide");
                                ClearNotificationInfo();
                                LoadNotificationList(jQuery.AddNotificationNamespace.PagerData);
                                ko.utils.arrayForEach(notificationViewModel.NotificationList(), function (item) {
                                    item.SelectedClass('');
                                    if (item.NotificationID == json.d) {
                                        item.SelectedClass('bg-info');
                                    }
                                });

                                LoadSelectedNotification(json.d);
                                ShowMessage(languageResource.resMsg_SavedSuccessfully, "info");
                                break;
                            }
                    }
                }
                else {
                    jQuery("#saveCloseNotificationMessage").html(languageResource.resMsg_FailedToCloseNotificationInfo);
                }
            },
            error: function (request, error) {
                if (request.responseText != "") {
                    var errorMsg = jQuery.parseJSON(request.responseText);
                    if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null) {
                        errorMessage = languageResource.resMsg_Error + errorMsg.Message;
                        ShowMessage(errorMessage, "error");
                    }
                    else {
                        errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToCloseNotificationInfo;
                        jQuery("#saveCloseNotificationMessage").html(errorMessage);
                    }
                }
                else {
                    errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToCloseNotificationInfo;
                    jQuery("#saveCloseNotificationMessage").html(errorMessage);
                }
            }
        });
    }
}

function GetUnitOfTime(unit) {
    switch (unit) {
        case jQuery.AddNotificationNamespace.UnitOfTime.Hours.charCodeAt(): return "Hours";
        case jQuery.AddNotificationNamespace.UnitOfTime.Minutes.charCodeAt(): return "Minutes";
    }
}