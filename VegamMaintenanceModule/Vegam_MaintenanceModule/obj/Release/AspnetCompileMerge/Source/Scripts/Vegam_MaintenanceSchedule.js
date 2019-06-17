jQuery.MaintenanceScheduleNamespace = jQuery.MaintenanceScheduleNamespace || {};
jQuery.MaintenanceScheduleNamespace.BasicParam = jQuery.MaintenanceScheduleNamespace.BasicParam || {};
jQuery.MaintenanceScheduleNamespace.MaintTypePagerData = jQuery.MaintenanceScheduleNamespace.MaintTypePagerData || {};
jQuery.MaintenanceScheduleNamespace.BasePath = "";
jQuery.MaintenanceScheduleNamespace.PagesList = { 'Maintenance': 'M', 'WorkInstruction': 'W', 'Schedule': 'S' };
jQuery.MaintenanceScheduleNamespace.ScheduleTypeList = { 'Schedule': 'S', 'WorkOrder': 'W', 'Inspection': 'I' };
jQuery.MaintenanceScheduleNamespace.ScheduleStatus = { 'Active': 'A', 'InActive': 'I', 'SchedulingInProgress': 'P' };
jQuery.MaintenanceScheduleNamespace.ScheduleType = "";
jQuery.MaintenanceScheduleNamespace.DatePickerFormat = "";
jQuery.MaintenanceScheduleNamespace.DefaultImage = "";
jQuery.MaintenanceScheduleNamespace.MaintScheduleID = 0;
jQuery.MaintenanceScheduleNamespace.IsMaintTypeSearch = false;
jQuery.MaintenanceScheduleNamespace.NewMaintScheduleID = 0;
jQuery.MaintenanceScheduleNamespace.MaintMasterDataType = { MaintenanceType: "A", Priority: "R", WorkGroup: "W" };
jQuery.MaintenanceScheduleNamespace.CurrentPage = jQuery.MaintenanceScheduleNamespace.PagesList.Maintenance;
jQuery.MaintenanceScheduleNamespace.FloactionID = 0;
jQuery.MaintenanceScheduleNamespace.EquipmentID = 0;
jQuery.MaintenanceScheduleNamespace.TaskGroupInfo = {};
jQuery.MaintenanceScheduleNamespace.IsSelectedPPE = true;
jQuery.MaintenanceScheduleNamespace.UnitOfTime = { "Hours": 'H', "Minutes": 'M', "Seconds": 'S' };
jQuery.MaintenanceScheduleNamespace.ParameterType = { "SingleLineText": 'S', "MultiLineText": 'M', "Numeric": 'N', "Decimal": "D", "SelectionCode": "C" };
jQuery.MaintenanceScheduleNamespace.DocumentType = { "DOCUMENT": "D", "IMAGE": "I", "VIDEO": "V", "NONE": "N", "SDOCUMENT": "S" };
jQuery.MaintenanceScheduleNamespace.MasterDataType = { "Manufacturer": "M", "EquipmentType": "T", "EquipmentClass": "C", "MeasuringPointCategory": "P", "MPSelectionGroupCode": "G", "TaskGroupType": "S" };
jQuery.MaintenanceScheduleNamespace.ImagePath = "";
jQuery.MaintenanceScheduleNamespace.UploaderPath = "";
jQuery.MaintenanceScheduleNamespace.TaskGroupIdentifier = 0;
jQuery.MaintenanceScheduleNamespace.TaskGroupID = 0;
jQuery.MaintenanceScheduleNamespace.TaskID = 0;
jQuery.MaintenanceScheduleNamespace.TaskGroupVersionNumber = 0;

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
    IsFLocationDisabled: ko.observable(true),
    ShowActivateSchedule: ko.observable(true),
    SelectedLocationOrEquipment: ko.observable(""),
    IsDefaultImage: ko.observable(true)
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

function InitMaintenanceScheduleInfo(maintTypePagerData, basepath, datePickerFormat, plantDateFormat, plantTimeFormat, defaultImage, scheduleType, maintScheduleID, taskAccessRights, imagePath, taskDocumentPath, uploaderPath) {
    jQuery.MaintenanceScheduleNamespace.MaintTypePagerData = maintTypePagerData;
    jQuery.MaintenanceScheduleNamespace.BasicParam.SiteID = maintTypePagerData.SiteID;
    jQuery.MaintenanceScheduleNamespace.BasicParam.UserID = maintTypePagerData.UserID;
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
    jQuery("#imgFLocationOrEquipmentImage").attr("src", jQuery.MaintenanceScheduleNamespace.DefaultImage);

    if (taskAccessRights === "FULL_ACCESS") {
        workInstructionViewModel.HasDeleteAccess(true);
        workInstructionViewModel.IsUserHasSavingPermission(true);
    } else if (taskAccessRights === "EDIT_ONLY") {
        workInstructionViewModel.IsUserHasSavingPermission(true);
    }

    workInstructionViewModel.DefaultUploadIconPath(jQuery.MaintenanceScheduleNamespace.ImagePath + '/Styles/Images/upload_icon.png');

    ko.applyBindings(maintenanceTypeUpdateViewModel, document.getElementById("divAddMaintenanceTypeModal"));
    ko.applyBindings(maintenanceScheduleViewModel, document.getElementById("divMaintenanceInfo"));
    ko.applyBindings(workInstructionViewModel, document.getElementById("divWorkInstructionInfo"));
    ko.applyBindings(instructionSelectionViewModel, document.getElementById("divSelectInstructionModal"));

    if (scheduleType == jQuery.MaintenanceScheduleNamespace.ScheduleTypeList.WorkOrder) {
        maintenanceScheduleViewModel.IsDirectWorkOrder(true);
        jQuery("#divScheduleTab").css("visibility","hidden");
    }

    ManageSiteMapUrl();
    LoadMaintMasterDataForDropDown();
    LoadMaintenanceSchedulePage(jQuery.MaintenanceScheduleNamespace.PagesList.Maintenance);
    initiateDatePicker();
    bindDatePickerAndSelectDefaultDate();
    LoadUnitOfTime();
    LoadParameterType();
    LoadMasterDataDropDown();

    if (jQuery.MaintenanceScheduleNamespace.MaintScheduleID == 0) {
        var btnActivateSchedule = jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.LoadControlID.replace("btnSaveMaintInfo", "btnActivateSchedule");
        jQuery("#" + btnActivateSchedule).attr("disabled", "disabled");
    }
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
    masterDataDropDownListFilterInfo.MasterDataTypeList.push(jQuery.MaintenanceScheduleNamespace.MasterDataType.MPSelectionGroupCode.charCodeAt());
    
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
    jQuery("#divActivateInfo").removeClass('active in');
    $('.btn-circle.btn-info').removeClass('btn-info').addClass('btn-default');
    jQuery.MaintenanceScheduleNamespace.CurrentPage = tabType;

    if (tabType == jQuery.MaintenanceScheduleNamespace.PagesList.Maintenance) {
        jQuery("#divMaintenanceInfo").addClass('active in');
        $("#btnMaintInfo").addClass('btn-info').removeClass('btn-default').blur();
        if (jQuery.MaintenanceScheduleNamespace.MaintScheduleID > 0)
            LoadMaintenanceInfoForEdit();
    }
    else if (tabType == jQuery.MaintenanceScheduleNamespace.PagesList.WorkInstruction) {
        jQuery("#divWorkInstructionInfo").addClass('active in');
        $("#btnWorkInstruction").addClass('btn-info').removeClass('btn-default').blur();
        LoadWorkInsructionInfo();
    }
    else if (tabType == jQuery.MaintenanceScheduleNamespace.PagesList.Schedule) {
        jQuery("#divScheduleInfo").addClass('active in');
        $("#btnScheduleInfo").addClass('btn-info').removeClass('btn-default').blur();
        LoadIframe(jQuery.MaintenanceScheduleNamespace.BasePath + "/Preventive/CreateSchedule.aspx?id=" + jQuery.MaintenanceScheduleNamespace.BasicParam.SiteID + "&ismaintenance=true&maintscheduleid=" + jQuery.MaintenanceScheduleNamespace.MaintScheduleID);
    }
}

function LoadMaintMasterDataForDropDown() {
    LoadMaintMasterData(jQuery.MaintenanceScheduleNamespace.MaintMasterDataType.MaintenanceType);
    LoadMaintMasterData(jQuery.MaintenanceScheduleNamespace.MaintMasterDataType.Priority);
    LoadMaintMasterData(jQuery.MaintenanceScheduleNamespace.MaintMasterDataType.WorkGroup);
    jQuery("#ddlSelectMaintenanceType").select2({ width: '50%' });
    jQuery("#ddlSelectPriority").select2({ width: '50%' });
    jQuery("#ddlSelectWorkGroupType").select2({ width: '50%' });
}

function LoadMaintMasterData(masterDataType) {
    var masterDataFilterInfo = {};
    masterDataFilterInfo.MasterDataType = masterDataType.charCodeAt();

    jQuery.ajax({
        type: "POST",
        url: jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetMaintMasterData",
        data: JSON.stringify({ basicParam: jQuery.MaintenanceScheduleNamespace.BasicParam, masterDataFilterInfo: masterDataFilterInfo }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        async: false,
        success: function (json) {
            if (json != undefined && json.d != undefined) {
                if (masterDataType == jQuery.MaintenanceScheduleNamespace.MaintMasterDataType.MaintenanceType)
                    maintenanceScheduleViewModel.MaintenanceTypeList(json.d.MasterDataInfoList);
                else if (masterDataType == jQuery.MaintenanceScheduleNamespace.MaintMasterDataType.Priority)
                    maintenanceScheduleViewModel.MaintenancePriorityList(json.d.MasterDataInfoList);
                else if (masterDataType == jQuery.MaintenanceScheduleNamespace.MaintMasterDataType.WorkGroup)
                    maintenanceScheduleViewModel.WorkGroupTypeList(json.d.MasterDataInfoList);
            }
            else {
                ShowErrorMessagePopUp(languageResource.resMsg_FailedToLoadDataForDropdown, true);
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

function AutoCompleteEquipmentName(controlID) {
    jQuery.MaintenanceScheduleNamespace.EquipmentID = 0;
    var pagerData = {};
    pagerData.PageSize = 0;
    var equipmentFilterInfo = {};
    equipmentFilterInfo.SiteID = jQuery.MaintenanceScheduleNamespace.BasicParam.SiteID;
    equipmentFilterInfo.UserID = jQuery.MaintenanceScheduleNamespace.BasicParam.UserID;
    equipmentFilterInfo.InfoType = "Equipment";
    jQuery(controlID).autocomplete({
        minLength: 2,
        source: function (request, response) {
            equipmentFilterInfo.SerachNameOrCode = request.term;

            jQuery.ajax(
                {
                    type: "POST",
                    url: jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetAllEquipmentInfo",
                    data: JSON.stringify({ pagerData: pagerData, equipmentFilterInfo: equipmentFilterInfo }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (json) {
                        var returnList = json.d.EquipmentList;
                        if (returnList != null && returnList.length > 0) {
                            response(jQuery.map(returnList, function (item) {
                                return {
                                    equipmentnum: jQuery.trim(item.EquipmentID),
                                    equipmentimg: jQuery.trim(item.EquipmentImagePath),
                                    value: jQuery.trim(item.EquipmentName),
                                };
                            }));
                        }
                        else {
                            response(jQuery.map(returnList, function (item) {
                                return null;
                            }));
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        if (XMLHttpRequest.responseText != "") {
                            var errorMsg = jQuery.parseJSON(XMLHttpRequest.responseText);
                            if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                                msg = languageResource.resMsg_Error + errorMsg.Message;
                            else
                                msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToFetchDataForAutoCompleteText;
                        }
                        else {
                            msg = languageResource.resMsg_FailedToFetchDataForAutoCompleteText;
                        }
                        ShowErrorMessagePopUp(msg, true);
                    }
                });
        },
        change: function (event, ui) {
            if (!ui.item) {
                jQuery(this).val('');
                jQuery(this).autocomplete("destroy");
                jQuery(controlID).removeAttr("equipmentnum");
                if (ui.item != null) {
                    CreateSelectedItem(ui.item, controlID);
                }
            }
        },
        select: function (event, ui) {
            event.preventDefault();
            jQuery.MaintenanceScheduleNamespace.FloactionID = 0;
            jQuery("#txtFLoactionName").val("");
            jQuery(controlID).val(ui.item.value);
            jQuery.MaintenanceScheduleNamespace.EquipmentID = ui.item.equipmentnum;
            maintenanceScheduleViewModel.SelectedLocationOrEquipment("Equipment: " + ui.item.value);
            maintenanceScheduleViewModel.IsDefaultImage(true);
            if (jQuery.trim(ui.item.equipmentimg).length != 0) {
                jQuery("#imgFLocationOrEquipmentImage").attr("src", ui.item.equipmentimg.replace('Thumbnail/', ''));
                maintenanceScheduleViewModel.IsDefaultImage(false);
            }
            else
                jQuery("#imgFLocationOrEquipmentImage").attr("src", jQuery.MaintenanceScheduleNamespace.DefaultImage);
        }
    });
}

function AutoCompleteFLocationName(controlID) {
    jQuery.MaintenanceScheduleNamespace.FloactionID = 0;

    var locationFilterInfo = {};
    locationFilterInfo.SiteID = jQuery.MaintenanceScheduleNamespace.BasicParam.SiteID;
    locationFilterInfo.UserID = jQuery.MaintenanceScheduleNamespace.BasicParam.UserID;

    jQuery(controlID).autocomplete({
        minLength: 2,
        source: function (request, response) {
            locationFilterInfo.SearchFLocationName = request.term;

            jQuery.ajax(
                {
                    type: "POST",
                    url: jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetAllFunctionalLocInfo",
                    data: JSON.stringify({ pagerData: null, locationFilterInfo: locationFilterInfo }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (json) {
                        var returnList = json.d.FunctionalLocationList;
                        if (returnList != null && returnList.length > 0) {
                            response(jQuery.map(returnList, function (item) {
                                return {
                                    flocationnum: jQuery.trim(item.FunctionalLocationID),
                                    flocationimg: jQuery.trim(item.FunctionalLocationImagePath),
                                    value: jQuery.trim(item.FunctionalLocationName),
                                };
                            }));
                        }
                        else {
                            response(jQuery.map(returnList, function (item) {
                                return null;
                            }));
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        if (XMLHttpRequest.responseText != "") {
                            var errorMsg = jQuery.parseJSON(XMLHttpRequest.responseText);
                            if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                                msg = languageResource.resMsg_Error + errorMsg.Message;
                            else
                                msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToFetchDataForAutoCompleteText;
                        }
                        else {
                            msg = languageResource.resMsg_FailedToFetchDataForAutoCompleteText;
                        }
                        ShowErrorMessagePopUp(msg, true);
                    }
                });
        },
        change: function (event, ui) {
            if (!ui.item) {
                jQuery(this).val('');
                jQuery(this).autocomplete("destroy");
                jQuery(controlID).removeAttr("equipmentnum");
                if (ui.item != null) {
                    CreateSelectedItem(ui.item, controlID);
                }
            }
        },
        select: function (event, ui) {
            event.preventDefault();
            jQuery.MaintenanceScheduleNamespace.EquipmentID = 0;
            jQuery("#txtEquipmentName").val("");
            jQuery(controlID).val(ui.item.value);
            maintenanceScheduleViewModel.SelectedLocationOrEquipment("Functional Location: " + ui.item.value);
            jQuery.MaintenanceScheduleNamespace.FloactionID = ui.item.flocationnum;
            maintenanceScheduleViewModel.IsDefaultImage(true);
            if (jQuery.trim(ui.item.flocationimg).length != 0) {
                jQuery("#imgFLocationOrEquipmentImage").attr("src", ui.item.flocationimg.replace('Thumbnail/', ''));
                maintenanceScheduleViewModel.IsDefaultImage(false);
            }
            else
                jQuery("#imgFLocationOrEquipmentImage").attr("src", jQuery.MaintenanceScheduleNamespace.DefaultImage);
        }
    });
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
            showMinutesLeadingZero: false
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
            return hour + ":" + minute;
        }
    }
    else
        return "";
}


//add maintenance information
function AddNewMaintenance() {
    var isValid = true;
    var message = "";
    if (jQuery.trim(jQuery("#txtMaintenanceName").val()).length == 0) {
        isValid = false;
        message = message + languageResource.resMsg_EnterMaintenanceName + "</br>";
    }
    if (jQuery.MaintenanceScheduleNamespace.FloactionID == 0 && jQuery.MaintenanceScheduleNamespace.EquipmentID == 0) {
        isValid = false;
        message = message + languageResource.resMsg_SelectFLocationOrEquipment + "</br>";
    }
    if (jQuery("#ddlSelectMaintenanceType").val() == undefined || jQuery.trim(jQuery("#ddlSelectMaintenanceType").val()).length == 0 || jQuery.trim(jQuery("#ddlSelectMaintenanceType").val()) == 0) {
        isValid = false;
        message = message + languageResource.resMsg_SelectMaintenanceType + "</br>";
    }
    if (jQuery("#ddlSelectPriority").val() == undefined || jQuery.trim(jQuery("#ddlSelectPriority").val()).length == 0 || jQuery.trim(jQuery("#ddlSelectPriority").val()) == 0) {
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
        maintenanceInfo.FLocationID = jQuery.MaintenanceScheduleNamespace.FloactionID;
        maintenanceInfo.EquipmentID = jQuery.MaintenanceScheduleNamespace.EquipmentID;
        maintenanceInfo.MaintenanceDesc = jQuery.trim(jQuery("#txtMaintenanceDesc").val());
        maintenanceInfo.MaintenanceTypeID = jQuery.trim(jQuery("#ddlSelectMaintenanceType").val());
        maintenanceInfo.MaintenancePriorityID = jQuery.trim(jQuery("#ddlSelectPriority").val());
        maintenanceInfo.ScheduleDate = maintenanceScheduleViewModel.ScheduleDate();
        maintenanceInfo.ScheduleTime = maintenanceScheduleViewModel.ScheduleTime();
        maintenanceInfo.WorkGroupID = jQuery.trim(jQuery("#ddlSelectWorkGroupType").val());
        maintenanceInfo.MaintScheduleType = scheduleType;

        jQuery.ajax({
            type: "POST",
            url: jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/InsertUpdateMaintenanceInfo",
            data: JSON.stringify({ maintenanceInfo: maintenanceInfo }),
            contentType: "application/json; charset=utf-8",
            datatype: 'json',
            async: false,
            success: function (json) {
                if (json != undefined && json.d != undefined) {
                    var result = json.d;
                    if (result == -1) {//Already exist
                        ShowErrorMessage(languageResource.resMsg_AlreadyExistsMaintenanceName, 'error');
                    }
                    else if (result == -2) {
                        //work order is started, update is not possible
                        ShowErrorMessage(languageResource.resMsg_WorkOrderStartedUpdateNotPossible, 'error');
                    }
                    else if (result == jQuery.MaintenanceScheduleNamespace.MaintScheduleID) {
                        //successfully updated
                        jQuery.MaintenanceScheduleNamespace.NewMaintScheduleID = jQuery.MaintenanceScheduleNamespace.MaintScheduleID;
                        ShowErrorMessage(languageResource.resMsg_SuccessfullyUpdatedMaintenanceInfo, 'info');
                    }
                    else if (result > 0) {
                        //successfully inserted
                        jQuery.MaintenanceScheduleNamespace.MaintScheduleID = result;
                        LoadMaintenanceSchedulePage(jQuery.MaintenanceScheduleNamespace.PagesList.WorkInstruction);
                        jQuery("#" + jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.LoadControlID).text(languageResource.resMsg_Update);
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
                jQuery("#" + jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.LoadControlID).text(languageResource.resMsg_Update);

                var result = json.d;
                jQuery("#txtMaintenanceName").val(result.MaintenanceName);
                jQuery.MaintenanceScheduleNamespace.FloactionID = result.FLocationID;
                jQuery.MaintenanceScheduleNamespace.EquipmentID = result.EquipmentID;
                jQuery("#txtFLoactionName").val(result.FLocationName);
                jQuery("#txtEquipmentName").val(result.EquipmentName);
                jQuery("#txtMaintenanceDesc").val(result.MaintenanceDesc);
                jQuery("#ddlSelectMaintenanceType").val(result.MaintenanceTypeID.toString());
                jQuery("#ddlSelectMaintenanceType").trigger('change');
                jQuery("#ddlSelectPriority").val(result.MaintenancePriorityID);
                jQuery("#ddlSelectPriority").trigger('change');
                maintenanceScheduleViewModel.ScheduleDate(result.ScheduleDate);
                jQuery("#ddlSelectWorkGroupType").val(result.WorkGroupID);
                jQuery("#ddlSelectWorkGroupType").trigger('change');

                if (jQuery.trim(result.FLocationOrEquipmentImg).length > 0)
                    jQuery("#imgFLocationOrEquipmentImage").attr("src", result.FLocationOrEquipmentImg);
                else
                    jQuery("#imgFLocationOrEquipmentImage").attr("src", jQuery.MaintenanceScheduleNamespace.DefaultImage);

                if (result.ScheduleDate > 0) {
                    var dateTimeString = ConvertIntToDateTimeString(result.ScheduleDate, result.ScheduleTime);
                    jQuery("#txtScheduleDate").val(ConvertSiteDateTimeToDatePickerFormat(dateTimeString));
                    jQuery("#txtScheduleTime").val(ConvertSiteDateTimeToTimePickerFormat(dateTimeString));
                }

                if (result.TaskGroupID > 0) {
                    if (result.TaskGroupRefType == "Schedule") {
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
                        workInstructionViewModel.SelectedTaskGroupInfo(jQuery.MaintenanceScheduleNamespace.TaskGroupInfo);
                        jQuery("#divSelectTaskGroup span").text(result.TaskGroupName);
                        OnChangeBindInstruction(jQuery("#btnImportInstrTaskGroup"));

                        var btnSaveWorkInstruction = jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.LoadControlID.replace("btnSaveMaintInfo", "btnSaveWorkInstruction");
                        jQuery("#" + btnSaveWorkInstruction).text(languageResource.resMsg_Update);
                    }
                }

                result.ScheduleStatus = String.fromCharCode(result.ScheduleStatus);

                //activate button setting
                var btnActivateSchedule = jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.LoadControlID.replace("btnSaveMaintInfo", "btnActivateSchedule");
                if (result.ScheduleDetailID > 0) {
                    if (result.ScheduleStatus == jQuery.MaintenanceScheduleNamespace.ScheduleStatus.Active) {
                        maintenanceScheduleViewModel.ShowActivateSchedule(true);
                        jQuery("#" + btnActivateSchedule).text(languageResource.resMsg_InActivate);
                        jQuery("#" + btnActivateSchedule).removeAttr("disabled");
                    }
                    else if (result.ScheduleStatus == jQuery.MaintenanceScheduleNamespace.ScheduleStatus.InActive) {
                        maintenanceScheduleViewModel.ShowActivateSchedule(true);
                        jQuery("#" + btnActivateSchedule).text(languageResource.resMsg_Activate);
                        jQuery("#" + btnActivateSchedule).removeAttr("disabled");
                    }
                    else if (result.ScheduleStatus == jQuery.MaintenanceScheduleNamespace.ScheduleStatus.SchedulingInProgress) {
                        maintenanceScheduleViewModel.ShowActivateSchedule(false);
                    }
                }
                else {
                    maintenanceScheduleViewModel.ShowActivateSchedule(true);
                    jQuery("#" + btnActivateSchedule).attr("disabled", "disabled");
                }
            }
            else {
                jQuery.MaintenanceScheduleNamespace.MaintScheduleID = 0;
                ShowErrorMessage(languageResource.resMsg_Error + languageResource.resMsg_FailedGetMaintenanceEditInfo, 'error');
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
    jQuery("#divAddMaintenanceTypeModal").modal("show");
}

function SearchMaintTypes() {
    var btnSave = jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.LoadControlID;
    jQuery.MaintenanceScheduleNamespace.IsMaintTypeSearch = true;

    if (jQuery.MaintenanceScheduleNamespace.IsCategorySearch == true) {
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
    masterDataFilterInfo.MasterDataType = jQuery.MaintenanceScheduleNamespace.MaintMasterDataType.MaintenanceType.charCodeAt();

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
        data: JSON.stringify({ pagerData: pagerData, basicParam: jQuery.MaintenanceScheduleNamespace.BasicParam, masterDataFilterInfo: masterDataFilterInfo}),
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

function ShowEditMaintTypes(maintTypeID,maintType) {
    jQuery("#txtNewMaintType").val(maintType);
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
    jQuery("#txtSearchMaintType").val("");
    jQuery("#" + btnShowAll).addClass('hide');

    var masterDataInfo = {};
    masterDataInfo.MasterDataID = maintTypeID;
    masterDataInfo.MasterDataType = jQuery.MaintenanceScheduleNamespace.MaintMasterDataType.MaintenanceType.charCodeAt();
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
            }
            else {
                var msg = languageResource.resMsg_FailedToDeleteMaintTypeInfo;
                ShowErrorMessagePopUp(msg,true);
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
            ShowErrorMessagePopUp(msg,true);
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
        masterDataInfo.MasterDataType = jQuery.MaintenanceScheduleNamespace.MaintMasterDataType.MaintenanceType.charCodeAt();
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
                    else{
                    jQuery("#spnAddMaintTypeError").addClass('text-info');
                    jQuery("#spnAddMaintTypeError").text(languageResource.resMsg_InsertedMaintType);
                    }
                    LoadMaintMasterData(jQuery.MaintenanceScheduleNamespace.MaintMasterDataType.MaintenanceType);
                    jQuery("#ddlSelectMaintenanceType").select2({ width: '50%' });
                    jQuery("#txtNewMaintType").val('');
                    LoadMaintTypesInfo(jQuery.MaintenanceScheduleNamespace.MaintTypePagerData);
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
    if (workInstructionViewModel.IsImportTaskGroup() == true) {
        if (jQuery.MaintenanceScheduleNamespace.TaskGroupInfo.TaskGroupID != undefined && jQuery.MaintenanceScheduleNamespace.TaskGroupInfo.TaskGroupID > 0) {
            LoadTaskInfoListForTaskGroup(jQuery.MaintenanceScheduleNamespace.TaskGroupInfo.TaskGroupID);
        }
    }
    else {
        LoadManualTaskIDForTaskGroup();
    }
}

function LoadTaskGroupList(searchTaskGroupName) {
    var filterInfo = {};
    filterInfo.SiteID = jQuery.MaintenanceScheduleNamespace.BasicParam.SiteID;
    filterInfo.UserID = jQuery.MaintenanceScheduleNamespace.BasicParam.UserID;

    filterInfo.SearchTaskGroupName = "";
    if (searchTaskGroupName != undefined)
        filterInfo.SearchTaskGroupName = searchTaskGroupName;

    jQuery.ajax({
        type: "POST",
        url: jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetTaskGroupList",
        data: JSON.stringify({ filterInfo: filterInfo }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        success: function (json) {
            if (json != undefined && json.d != undefined) {
                workInstructionViewModel.TaskGroupList(json.d);

                var selItem = ko.utils.arrayFirst(json.d, function (item) { return item.TaskGroupID == jQuery.MaintenanceScheduleNamespace.TaskGroupInfo.TaskGroupID; });
                if (selItem != undefined && selItem != null) {
                    jQuery("#btnTaskGroup_" + jQuery.MaintenanceScheduleNamespace.TaskGroupInfo.TaskGroupID).removeClass("btn-primary").addClass("btn-success").find("i").show();
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
    LoadTaskGroupList();
    jQuery("#txtSearchTaskGroup").val("");
    jQuery("#divSelectTaskGroupModal").modal("show");
}

function SearchTaskGroup(ctrl) {
    var searchText = jQuery.trim(jQuery(ctrl).val());
    if (searchText != undefined && searchText != "") {
        LoadTaskGroupList(searchText);
    }
    else {
        LoadTaskGroupList();
    }
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
    //if selected option is not active
    if (!jQuery(ctrl).hasClass("btn-primary")) {
        jQuery("#btnAddInstrManual,#btnImportInstrTaskGroup").removeClass("btn-primary").removeClass("btn-normal").find("i").hide();
        jQuery(ctrl).addClass("btn-primary").find("i").show();

        if (jQuery(ctrl).attr("id") == "btnImportInstrTaskGroup") {
            importInstructionFromTaskGroup = true;
            jQuery("#btnAddInstrManual").addClass("btn-normal");
            jQuery("#divAddTaskDetails").hide();
            jQuery("#divSelectTaskGroup").show();
        }
        else {
            jQuery("#btnImportInstrTaskGroup").addClass("btn-normal");
            jQuery("#divAddTaskDetails").show();
            jQuery("#divSelectTaskGroup").hide();
            if (workInstructionViewModel.ParameterInfoList().length == 0)
                AddMoreParameter();
        }
    }
    else {
        //if selected option is active and it is import from task group
        if (jQuery(ctrl).attr("id") == "btnImportInstrTaskGroup") {
            importInstructionFromTaskGroup = true;
        }
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

                    var btnSaveWorkInstruction = jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.LoadControlID.replace("btnSaveMaintInfo", "btnSaveWorkInstruction");
                    jQuery("#" + btnSaveWorkInstruction).text(languageResource.resMsg_Update);

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
            item.isDeleteEnabled(enableDeleteIcon);

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
    jQuery("#alertMessage").html(languageResource.resMsg_AreYouSureYouWantToDeleteParameter);
    jQuery("#alertModal").dialog({
        zIndex: 1060,
        modal: true,
        buttons: [
            {
                text: languageResource.resMsg_Confirm,
                click: function () {
                    jQuery("#alertModal").dialog("close");
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
                    jQuery("#alertModal").dialog("close");
                    isTrue = false;
                }
            }
        ]
    });
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
            fileUploadedThumbnailICon = jQuery.MaintenanceScheduleNamespace.ImagePath + '/' + ext + '.png';
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
            fileUploadedICon = jQuery.MaintenanceScheduleNamespace.ImagePath + '/video.png';
            isValid = true;
            fileType = jQuery.MaintenanceScheduleNamespace.DocumentType.VIDEO;
        }
        else {
            errorMessage = languageResource.resMsg_InvalidUploadingFormat;
        }
    }

    if (!isValid) {
        ShowMessage(errorMessage, "error");
    }
    else {
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

    var filterInfo = {};
    filterInfo.SiteID = jQuery.MaintenanceScheduleNamespace.BasicParam.SiteID;
    filterInfo.UserID = jQuery.MaintenanceScheduleNamespace.BasicParam.UserID;
    filterInfo.ScheduleID = jQuery.MaintenanceScheduleNamespace.MaintScheduleID;
    filterInfo.TaskGroupID = jQuery.MaintenanceScheduleNamespace.TaskGroupID;
    filterInfo.Identifier = jQuery.MaintenanceScheduleNamespace.TaskGroupIdentifier;
    
    var taskInfo = {};
    taskInfo.TaskID = jQuery.MaintenanceScheduleNamespace.TaskID;
    taskInfo.TaskName = workInstructionViewModel.TaskName();
    taskInfo.SequenceNum = 1;
    taskInfo.Description = workInstructionViewModel.TaskDescription();
    taskInfo.SafetyDescription = workInstructionViewModel.SafetyInstruction();
    taskInfo.EstimatedTime = workInstructionViewModel.EstimatedTime();
    taskInfo.UnitOfTime = workInstructionViewModel.UnitOfTimeSelectedValue().charCodeAt();
    taskInfo.RemarkEnabled = workInstructionViewModel.IsEnabledEnterRemark();
    taskInfo.RemarkMandatory = workInstructionViewModel.IsEnabledEnterRemarkMandatory();
    taskInfo.PictureEnabled = workInstructionViewModel.IsEnabledTakePicture();
    taskInfo.PictureMandatory = workInstructionViewModel.IsEnabledTakePictureMandatory();

    var ppeInfoList = [];
    ko.utils.arrayForEach(workInstructionViewModel.TaskPPEList(), function (item, index) {
        var ppeInfo = {};
        ppeInfo.TaskPPEID = item.ID;
        ppeInfo.PPEID = item.InstructionID;
        ppeInfoList.push(ppeInfo);
    });
    taskInfo.PPEInfoList = ppeInfoList;

    var toolsInfoList = [];
    ko.utils.arrayForEach(workInstructionViewModel.TaskToolsList(), function (item, index) {
        var toolsInfo = {};
        toolsInfo.TaskToolsID = item.ID;
        toolsInfo.ToolsID = item.InstructionID;
        toolsInfoList.push(toolsInfo);
    });

    taskInfo.ToolsInfoList = toolsInfoList;

    var parameterInfoList = [];
    ko.utils.arrayForEach(workInstructionViewModel.ParameterInfoList(), function (item, index) {
        var parameterInfo = {};
        parameterInfo.ParameterID = item.ParameterID();
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
        documentInfo.DocumentID = item.DocumentID;
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

    if (taskInfo.EstimatedTime === 0) {
        errorMsg += languageResource.resMsg_PleaseEnterEstimatedTime + "</br>";
        isValid = false;
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

function ClearImportWorkInstruction(){
    jQuery.MaintenanceScheduleNamespace.TaskGroupInfo = {};
    workInstructionViewModel.SelectedTaskGroupInfo(jQuery.MaintenanceScheduleNamespace.TaskGroupInfo);
    workInstructionViewModel.TaskInfoList.removeAll();
    jQuery("#divSelectTaskGroup span").text("No Task Group Selected");

    var btnSaveWorkInstruction = jQuery.MaintenanceScheduleNamespace.MaintTypePagerData.LoadControlID.replace("btnSaveMaintInfo", "btnSaveWorkInstruction");
    jQuery("#" + btnSaveWorkInstruction).text(languageResource.resMsg_Add);
}

function ClearManualWorkInstruction() {
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
                if (json != undefined && json.d != undefined && json.d.length>0) {
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
                                obj.ThumbnailPath = jQuery.MaintenanceScheduleNamespace.ImagePath + '/video.png';
                            }
                            else if (String.fromCharCode(obj.DocumentType) != jQuery.MaintenanceScheduleNamespace.DocumentType.IMAGE) {
                                var ext = obj.DocumentName.substring(obj.DocumentName.lastIndexOf('.') + 1).toLowerCase();
                                obj.ThumbnailPath = jQuery.MaintenanceScheduleNamespace.ImagePath + '/' + ext + '.png';
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
                            newParameterObj.isDeleteEnabled(index>0);
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
        if (jQuery("#" + btnActivateSchedule).text() == languageResource.resMsg_Activate)
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
                }
                else {
                    jQuery("#" + btnActivateSchedule).text(languageResource.resMsg_Activate);
                    ShowErrorMessagePopUp(languageResource.resMsg_SuccessfullyInActivatedSchedule, false);
                }
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
    jQuery(document).on('keypress', '#txtEquipmentName', function () {
        AutoCompleteEquipmentName('#txtEquipmentName');
    });

    jQuery(document).on('paste', '#txtEquipmentName', function () {
        AutoCompleteEquipmentName('#txtEquipmentName');
    });

    jQuery(document).on('keypress', '#txtFLoactionName', function () {
        AutoCompleteFLocationName('#txtFLoactionName');
    });

    jQuery(document).on('paste', '#txtFLoactionName', function () {
        AutoCompleteFLocationName('#txtFLoactionName');
    });

    jQuery("input[type='radio']").click(function () {
        var radioValue = jQuery("input[name='rdbFloactionOrEquipment']:checked").val();
        if (radioValue == "flocation") {
            maintenanceScheduleViewModel.IsFLocationDisabled(false);
        }
        else {
            maintenanceScheduleViewModel.IsFLocationDisabled(true);
        }
    });
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
            LoadMaintenanceSchedulePage(jQuery.MaintenanceScheduleNamespace.PagesList.Maintenance);
        }
        else {
            //enable below buttons only if maintenance information exists
            if (jQuery.MaintenanceScheduleNamespace.MaintScheduleID > 0) {
                if (name == "btnWorkInstruction") {
                    LoadMaintenanceSchedulePage(jQuery.MaintenanceScheduleNamespace.PagesList.WorkInstruction);
                }
                else if (name == "btnScheduleInfo") {
                    LoadMaintenanceSchedulePage(jQuery.MaintenanceScheduleNamespace.PagesList.Schedule);
                }
            }
        }
    });

    $('#divTabInfo a').on('click', function () {
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
        jQuery("#SiteMap1>span>a[href*='ManageWorkOrder.aspx']").html(languageResource.resMsg_ManageSchedule).attr('href', scheduleURL).attr('title', languageResource.resMsg_ManageSchedule);

        jQuery("#lnkAdminTab,#A1").attr("isSetDefault", "false");
        jQuery("#lnkAdminTab").attr("href", scheduleURL); // Set herf value
        jQuery("#A1").attr("href", scheduleURL); // Set herf value
    }
    else if (jQuery.MaintenanceScheduleNamespace.ScheduleType == jQuery.MaintenanceScheduleNamespace.ScheduleTypeList.WorkOrder) {
        var workOrderURL = jQuery.MaintenanceScheduleNamespace.BasePath + "/SMS/ManageWorkOrder.aspx?id=" + jQuery.MaintenanceScheduleNamespace.BasicParam.SiteID;
        jQuery("#SiteMap1>span>a[href*='ManageSchedule.aspx']").html(languageResource.resMsg_ManageWorkOrder).attr('href', workOrderURL).attr('title', languageResource.resMsg_ManageWorkOrder);

        jQuery("#lnkAdminTab,#A1").attr("isSetDefault", "false");
        jQuery("#lnkAdminTab").attr("href", workOrderURL); // Set herf value
        jQuery("#A1").attr("href", workOrderURL); // Set herf value
    }
}