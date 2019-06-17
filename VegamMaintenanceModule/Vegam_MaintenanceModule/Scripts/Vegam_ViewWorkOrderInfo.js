jQuery.WorkOrderNamespace = jQuery.WorkOrderNamespace || {};
jQuery.WorkOrderNamespace.BasicParam = jQuery.WorkOrderNamespace.BasicParam || {};
jQuery.WorkOrderNamespace.WorkOrderStatusInfo = {};
jQuery.WorkOrderNamespace.WorkOrderTaskStatusInfo = {};
jQuery.WorkOrderNamespace.DocumentType = { "DOCUMENT": 68, "IMAGE": 73, "VIDEO": 86, "NONE": 78, "SDOCUMENT": 83 };
jQuery.WorkOrderNamespace.ImagePath = '';
jQuery.WorkOrderNamespace.ServicePath = '';
jQuery.WorkOrderNamespace.WorkOrder = '';
jQuery.WorkOrderNamespace.WorkOrderStatus = '';
jQuery.WorkOrderNamespace.BasePath = '';
jQuery.WorkOrderNamespace.UploaderPath = '';
jQuery.WorkOrderNamespace.MaintScheduleAttachmentPath = '';
jQuery.WorkOrderNamespace.EquipmentID = 0;
jQuery.WorkOrderNamespace.PagerData = {};
jQuery.WorkOrderNamespace.DateFormat = '';
jQuery.WorkOrderNamespace.IsSearchEquipmentHistory = false;
jQuery.WorkOrderNamespace.WorkOrderPriority = { Lowest: "LOWEST", Low: "LOW", Medium: "MEDIUM", High: "HIGH", Highest: "HIGHEST" };
jQuery.WorkOrderNamespace.WorkOrderEnumStatus = { "SCHEDULED": 1, "INPROGRESS": 2, "COMPLETED": 3, "OVERDUE": 4, "CANCELLED": 5, "CLOSED": 6,"CREATED":7 };
jQuery.WorkOrderNamespace.DynamicGridProp = {};
jQuery.WorkOrderNamespace.MPIsLoadingFirstTime = true;
jQuery.WorkOrderNamespace.WorkOrderStatusList = { 'Created':'CREATED','Scheduled': 'SCHEDULED', 'InProgress': 'INPROGRESS', 'Completed': 'COMPLETED', 'OverDue': 'OVERDUE', 'Cancelled': 'CANCELLED', 'Closed': 'CLOSED' };

jQuery.WorkOrderNamespace.PlantDateFormat = '';
jQuery.WorkOrderNamespace.PlantTimeFormat = '';
jQuery.WorkOrderNamespace.UnitOfTime = { "Hours": 'H', "Minutes": 'M' };
jQuery.WorkOrderNamespace.DefaultLaborTime = false;
jQuery.WorkOrderNamespace.DefaultTimeSpent = false;
jQuery.WorkOrderNamespace.UnitOfTimeResource = { "H": LanguageResource.resMsg_Hours, "M": LanguageResource.resMsg_Minutes };
jQuery.WorkOrderNamespace.PageType = '';

var workOrderViewModal = {
    MaintenanceName: ko.observable(''),
    Description: ko.observable(''),
    MaintenanceType: ko.observable(''),
    Priority: ko.observable(''),
    StatusText: ko.observable(''),
    StatusImage: ko.observable(''),
    ScheduledDate: ko.observable(''),
    StartDate: ko.observable(''),
    ActualStartDate: ko.observable(''),
    ActualEndDate: ko.observable(''),
    EstimatedTime: ko.observable(''),
    ActualTime: ko.observable(''),
    AssignedTo: ko.observable(''),
    ReportedTo: ko.observable(''),
    EquipmentImagePath: ko.observable(''),
    EquipmentName: ko.observable(''),
    EquipmentType: ko.observable(''),
    IsLocationInfo: ko.observable(''),
    WorkOrderNum: ko.observable(''),


    Location: ko.observable(''),
    EquipmentClass: ko.observable(''),
    ModelNumber: ko.observable(''),
    ModelName: ko.observable(''),
    Manufacturer: ko.observable(''),
    SerialNumber: ko.observable(''),
    WarrentyNo: ko.observable(''),
    WarrentyStatus: ko.observable(''),
    WarrentyExpiry: ko.observable(''),
    PurchaseDate: ko.observable(''),
    InstalledDate: ko.observable(''),
    ImagesAndVideosList: ko.observableArray([]),
    ManualDocumentsList: ko.observableArray([]),
    SpecificationDocumentsList: ko.observableArray([]),
    EquipmentHistoryList: ko.observableArray([]),
    EquipmentPagerContent: ko.observable(),
    IsEmptyEquipmentHistorylist: ko.observable(false),

    HasTaskAccess: ko.observable(false),
    HasEditAccess: ko.observable(false),
    taskInfoList: ko.observableArray([]),
    parameterTypeInfo: { "SingleLineText": 83, "MultiLineText": 77, "Numeric": 78, "Decimal": 68, "SelectionCode": 67 },
    CaptureDefaultImagePath: '',
    ShowLoadProgress: ko.observable(false),
    TaskGroupNotFoundMessage: ko.observable(false),
    ShowImageUploadProgress: ko.observable(false),

    AttachmentList: ko.observableArray([]),
    ModelErrorVisible: ko.observable(false),
    ModelErrorMsg: ko.observable(''),
    ModelErrorCss: ko.observable(''),
    SparePartInfoList: ko.observableArray([]),
    IsQuantityEditable: ko.observable(false),
    IsErrorVisible: ko.observable(false),
    ErrorMessage: ko.observable(''),
    ErrorClass: ko.observable(''),
    IsEquipmentView: ko.observable(false),
    IsStartWorkOrderAccess: ko.observable(true),

    UnitOfTimeList: ko.observableArray([]),
    WorkStartDate: ko.observable(0),
    WorkStartTime: ko.observable(0),
    WorkEndDate: ko.observable(0),
    WorkEndTime: ko.observable(0),
    LaborTime: ko.observable(0),
    LaborTimeTakenUnit: ko.observable(''),
    TimeSpent: ko.observable(0),
    TimeSpentUnit: ko.observable(''),
    //IsTimeSpentInfoExists: ko.observable(false),

    BreakdownStartDate: ko.observable(0),
    BreakdownStartTime: ko.observable(0),
    BreakdownEndDate: ko.observable(0),
    BreakdownEndTime: ko.observable(0),
    BreakdownDuration: ko.observable(0),
    BreakdownDurationUnit: ko.observable(''),
    IsBreakDownInfoExists: ko.observable(false),

    IsWorkOrderClosed: ko.observable(false),
    WorkStartDateTime: ko.observable(''),
    WorkEndDateTime: ko.observable(''),
    BreakDownStartDateTime: ko.observable(''),
    BreakDownEndDateTime: ko.observable(''),
    TimeSpentUnitResource: ko.observable(''),
    LaborTimeUnitResource: ko.observable(''),
    BreakDownDurationUnitResource: ko.observable(''),
    ClosedBy: ko.observable(''),
    ClosedOn: ko.observable(''),
    IsBreakDownInfoExists: ko.observable(false)
};

var startTaskViewModal = {
    TaskID: '',
    SafetyInstruction: ko.observable(),
    PPEList: ko.observableArray([]),
    ShowSafetyInstruction: ko.observable(false),
    ShowPPEInfo: ko.observable(false),
    IsSafetyConfirmed: ko.observable(false),
    IsPPEConfirmed: ko.observable(false),
    StartTaskConfirmError: ko.observable('')
};

workOrderViewModal.EquipmentName.subscribe(function (newValue) {
    if (newValue.length > 0 && jQuery.WorkOrderNamespace.EquipmentID > 0) jQuery("#liEquipment").removeClass("hide");
    else jQuery("#liEquipment").addClass("hide");
});

function LoadWorkOrderBasicInfo(basicParam, pagerData, gridProperties, servicePath, workOrder, imagePath, basePath, uploaderPath, maintScheduleAttachmentPath, pageAccess, hdfDateFormat, equipmentID, plantDateFormat, plantTimeFormat, pType) {
    jQuery.WorkOrderNamespace.BasicParam = basicParam;
    jQuery.WorkOrderNamespace.ServicePath = servicePath;
    jQuery.WorkOrderNamespace.WorkOrder = workOrder;
    jQuery.WorkOrderNamespace.ImagePath = imagePath;
    jQuery.WorkOrderNamespace.BasePath = basePath;
    jQuery.WorkOrderNamespace.UploaderPath = uploaderPath;
    jQuery.WorkOrderNamespace.MaintScheduleAttachmentPath = maintScheduleAttachmentPath;
    jQuery.WorkOrderNamespace.PagerData = pagerData;
    jQuery.WorkOrderNamespace.DynamicGridProp = gridProperties;
    jQuery.WorkOrderNamespace.EquipmentID = equipmentID;
    jQuery.WorkOrderNamespace.DateFormat = hdfDateFormat;
    jQuery.WorkOrderNamespace.PlantDateFormat = plantDateFormat;
    jQuery.WorkOrderNamespace.PlantTimeFormat = plantTimeFormat;
    jQuery.WorkOrderNamespace.PageType = pType;

    InitiateDatePicker();

    workOrderViewModal.CaptureDefaultImagePath = imagePath + '/upload_icon.png';

    if (pageAccess.toLowerCase() == 'full_access') {
        workOrderViewModal.HasTaskAccess(true);
        workOrderViewModal.HasEditAccess(true);
    }
    else if (pageAccess.toLowerCase() == 'edit_only') {
        workOrderViewModal.HasEditAccess(true);
    }

    ko.applyBindings(workOrderViewModal, document.getElementById("divWorkOrderInfo"));
    ko.applyBindings(startTaskViewModal, document.getElementById("divStartTaskModalBody"));

    GetEnumTypeInfo("MAINT_WORKORDERSTATUS");

    BindDatePickerAndSelectDefaultDate();
    Datepicker();
    LoadUnitOfTime();

    if (jQuery.WorkOrderNamespace.EquipmentID > 0) {
        ManageSiteMapUrl(true);
        workOrderViewModal.IsEquipmentView(true);
        jQuery("#liEquipment").removeClass("hide");
        LoadWorkOrderInfo('lnkEquipment');
    }
    else {
        ManageSiteMapUrl(false);
        LoadWorkOrderInfo("lnkGeneral");
    }
    GetEnumTypeInfo("MAINT_WORKORDER_TASK_STATUS");
}

function BindDatePickerAndSelectDefaultDate() {
    jQuery('.ui-datepicker-current-day').click();
    jQuery("#txtWorkStartDate").datepicker({
        // minDate: currentDate,
        changeMonth: true,
        changeYear: true,
        onSelect: function () {
            workOrderViewModal.WorkStartDate(ConvertDatePickerFormatToInt(jQuery.trim(jQuery("#txtWorkStartDate").val())));
            CalcuteLaborTime();
            jQuery.WorkOrderNamespace.DefaultLaborTime = true;
            jQuery.WorkOrderNamespace.DefaulttTimeSpent = true;
        }
    });

    if (jQuery.WorkOrderNamespace.PlantTimeFormat.indexOf('tt') !== -1) {
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
                workOrderViewModal.WorkStartTime(ConvertTimePickerFormatToInt(time));
                CalcuteLaborTime();
                jQuery.WorkOrderNamespace.DefaultLaborTime = true;
                jQuery.WorkOrderNamespace.DefaulttTimeSpent = true;
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
                workOrderViewModal.WorkStartTime(ConvertTimePickerFormatToInt(time));
                CalcuteLaborTime(true);
                jQuery.WorkOrderNamespace.DefaultLaborTime = true;
                jQuery.WorkOrderNamespace.DefaulttTimeSpent = true;
            }
        });
    }

    jQuery("#txtWorkEndDate").datepicker({
        //minDate: currentDate,
        changeMonth: true,
        changeYear: true,
        onSelect: function () {
            workOrderViewModal.WorkEndDate(ConvertDatePickerFormatToInt(jQuery.trim(jQuery("#txtWorkEndDate").val())));
            CalcuteLaborTime();
            jQuery.WorkOrderNamespace.DefaultLaborTime = true;
            jQuery.WorkOrderNamespace.DefaulttTimeSpent = true;
        }
    });
    if (jQuery.WorkOrderNamespace.PlantTimeFormat.indexOf('tt') !== -1) {
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
                workOrderViewModal.WorkEndTime(ConvertTimePickerFormatToInt(time));
                CalcuteLaborTime();
                jQuery.WorkOrderNamespace.DefaultLaborTime = true;
                jQuery.WorkOrderNamespace.DefaulttTimeSpent = true;
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
                workOrderViewModal.WorkEndTime(ConvertTimePickerFormatToInt(time));
                CalcuteLaborTime();
            }
        });
    }

    jQuery("#txtBreakdownStartDate").datepicker({
        // minDate: currentDate,
        changeMonth: true,
        changeYear: true,
        onSelect: function () {
            workOrderViewModal.BreakdownStartDate(ConvertDatePickerFormatToInt(jQuery.trim(jQuery("#txtBreakdownStartDate").val())));
        }
    });
    workOrderViewModal.BreakdownStartDate(ConvertDatePickerFormatToInt(jQuery.trim(jQuery("#txtBreakdownStartDate").val())));

    if (jQuery.WorkOrderNamespace.PlantTimeFormat.indexOf('tt') !== -1) {
        jQuery("#txtBreakdownStartTime").timepicker({
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
                workOrderViewModal.BreakdownStartTime(ConvertTimePickerFormatToInt(time));
            }
        });
    }
    else {
        jQuery("#txtBreakdownStartTime").timepicker({
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
                workOrderViewModal.BreakdownStartTime(ConvertTimePickerFormatToInt(time));
            }
        });
    }

    jQuery("#txtBreakdownEndDate").datepicker({
        //  minDate: currentDate,
        changeMonth: true,
        changeYear: true,
        onSelect: function () {
            workOrderViewModal.BreakdownEndDate(ConvertDatePickerFormatToInt(jQuery.trim(jQuery("#txtBreakdownEndDate").val())));
        }
    });
    workOrderViewModal.BreakdownEndDate(ConvertDatePickerFormatToInt(jQuery.trim(jQuery("#txtBreakdownEndDate").val())));

    if (jQuery.WorkOrderNamespace.PlantTimeFormat.indexOf('tt') !== -1) {
        jQuery("#txtBreakdownEndTime").timepicker({
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
                workOrderViewModal.BreakdownEndTime(ConvertTimePickerFormatToInt(time));
            }
        });
    }
    else {
        jQuery("#txtBreakdownEndTime").timepicker({
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
                workOrderViewModal.BreakdownEndTime(ConvertTimePickerFormatToInt(time));
            }
        });
    }
    jQuery("#txtWorkStartDate,#txtWorkStartTime,#txtWorkEndDate,#txtWorkEndTime,#txtBreakdownStartDate,#txtBreakdownStartTime,#txtBreakdownEndDate,#txtBreakdownEndTime").keydown(function () {
        return false;
    });
}

function Datepicker(Inputelement) {
    if (Inputelement) {
        var dateleft = jQuery('#ui-timepicker-div').offset().left;
        var datedivWidth = jQuery('.ui-timepicker-table').width();
        var windowWidth = jQuery(window).width();
        var thisInputleft = jQuery(Inputelement).offset().left;
        var thisInputwidth = jQuery(Inputelement).width();
        jQuery('#ui-timepicker-div').css({
            'left': thisInputleft - datedivWidth + thisInputwidth + 10
        })
    }
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
        return jQuery.datepicker.formatDate('yymmdd', jQuery.datepicker.parseDate(jQuery.WorkOrderNamespace.DateFormat, dateString));
    else
        return 0;
}

function ConvertTimePickerFormatToInt(timeString) {
    if (timeString != undefined && timeString != "") {
        var hour = parseInt(timeString.substr(0, 2));
        var minute = timeString.substr(3, 2);
        if (jQuery.WorkOrderNamespace.PlantTimeFormat.indexOf('tt') !== -1) {
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

function ConvertDateFormat(dateFormat) {
    switch (dateFormat) {
        case "MM/dd/yyyy": return "MM/DD/YYYY";
            break;
        case "MM-dd-yyyy": return "MM-DD-YYYY";
            break;
        case "dd/MM/yyyy": return "DD/MM/YYYY";
            break;
        case "dd-MM-yyyy": return "DD-MM-YYYY";
            break;
        case "yyyy/MM/dd": return "YYYY/MM/DD";
            break;
        case "yyyy-MM-dd": return "YYYY-MM-DD";
            break;
        default: return "YYYY-MM-DD";

    }
}

function ConvertTimeFormat(timeFormat) {
    switch (timeFormat) {
        case "hh:mm tt": return "hh:mm A";
            break;
        case "HH:mm": return "HH:mm";
            break;
        case "hh:mm:ss tt": return "hh:mm:ss A";
        case "HH:mm:ss": return "HH:mm:ss";
        default: return "HH:mm";
    }
}

function ConvertIntToSiteDateTimeFormat(dateInt, timeInt) {
    if (dateInt > 0) {
        var siteDateTimeFormat = ConvertDateFormat(jQuery.WorkOrderNamespace.PlantDateFormat) + " " + ConvertTimeFormat(jQuery.WorkOrderNamespace.PlantTimeFormat);
        return moment(ConvertIntToDate(dateInt, timeInt)).format(siteDateTimeFormat);
    }
    else
        return "";
}

function ShowCloseWorkOrderDiv() {
    event.preventDefault();
    $('.flipdiv1').css("height", "0px");
    var flipDv = $('.flipdiv1').height();
    //if (jQuery('#fdBreakdown:visible') == true) {
    //    $('.flipdiv2, .flipdiv1').css({
    //        'height': '263px'
    //    });
    //} else {
    //    $('.flipdiv2, .flipdiv1').css({
    //        'height': '160px'
    //    });

    //}
    if (jQuery('#fdBreakdown').is(':hidden') == false) {
        $('.flipdiv2, .flipdiv1').css({
            'height': '160px'
        });
    } else if (jQuery('#fdNormaldown').is(":visible") == true) {
        $('.flipdiv2, .flipdiv1').css({
            'height': '160px'
        });
    } else {
        $('.flipdiv2, .flipdiv1').css({
            'height': '263px'
        });
    }
    jQuery('.flipdiv1').toggleClass('flipdiv1animate');
    jQuery('.flipdiv2').toggleClass('flipdiv2animate');
    if (jQuery('.flipdiv1').hasClass('flipdiv1animate') == false) {
        jQuery('.flipdiv1, .flipdiv2').removeAttr('style');
    }
    if (flipDv == 0)
    BindCloseWorkOrderInfo();
}

function ShowBreakdowndiv() {
    var divHeight = jQuery('.flipdiv1').height();
    jQuery("#spnCloseWorkOrderError").html("");
    jQuery("#txtBreakdownStartDate").val("");
    jQuery("#txtBreakdownStartTime").val("");
    jQuery("#txtBreakdownEndDate").val("");
    jQuery("#txtBreakdownEndTime").val("");

    workOrderViewModal.BreakdownStartDate(0);
    workOrderViewModal.BreakdownStartTime(0);
    workOrderViewModal.BreakdownEndDate(0);
    workOrderViewModal.BreakdownEndTime(0);
    workOrderViewModal.BreakdownDuration('');

    if (jQuery('#chkbreakdown').is(":checked") == true) {
        jQuery("#ddlTimeUnitForBreakdown").val(jQuery.WorkOrderNamespace.UnitOfTime.Minutes);
       
        jQuery("#fdBreakdown").removeClass("hide");
        var secondHeight = jQuery('#fdBreakdown').height();
        jQuery('.flipdiv1').css('height', divHeight + secondHeight + 'px');
    }
    else if (jQuery('#chkbreakdown').is(":checked") == false) {
        jQuery("#fdBreakdown").addClass("hide");
        var secondHeight = jQuery('#fdBreakdown').height();
        jQuery('.flipdiv1').css('height', divHeight - secondHeight + 'px');
    }
}

function LoadUnitOfTime() {
    workOrderViewModal.UnitOfTimeList.removeAll();
    jQuery.each(jQuery.WorkOrderNamespace.UnitOfTime, function (value, key) {
        var unitOfTimeObj = {};
        unitOfTimeObj.TypeValue = key;
        unitOfTimeObj.DisplayName = jQuery.WorkOrderNamespace.UnitOfTimeResource[key];
        workOrderViewModal.UnitOfTimeList.push(unitOfTimeObj);
    });
}

function BindCloseWorkOrderInfo() {

    jQuery("#ddlTimeUnitForlaborTime").val(workOrderViewModal.LaborTimeTakenUnit());
    jQuery("#ddlTimeUnitForTimeSpent").val(workOrderViewModal.TimeSpentUnit());

    jQuery("#spnCloseWorkOrderError").html("");
    var workstartDateTime = new Date();
    var workendDateTime = new Date();
    var breakdownStartDateTime = new Date();
    var breakdownEndDateTime = new Date();

    workstartDateTime = ConvertIntToDate(workOrderViewModal.WorkStartDate(), workOrderViewModal.WorkStartTime());
    workendDateTime = ConvertIntToDate(workOrderViewModal.WorkEndDate(), workOrderViewModal.WorkEndTime());

    jQuery("#txtWorkStartDate").datepicker('setDate', workstartDateTime);
    jQuery.WorkOrderNamespace.DefaultLaborTime = false;
    jQuery.WorkOrderNamespace.DefaulttTimeSpent = false;

    jQuery("#txtWorkStartTime").timepicker('setTime', workstartDateTime);
    jQuery("#txtWorkEndDate").datepicker('setDate', workendDateTime);
    jQuery.WorkOrderNamespace.DefaultLaborTime = false;
    jQuery.WorkOrderNamespace.DefaulttTimeSpent = false;
    jQuery("#txtWorkEndTime").timepicker('setTime', workendDateTime);

    if (workOrderViewModal.BreakdownDuration() > 0) {
        jQuery('.flipdiv1').css('height', '263px');
        jQuery("#chkbreakdown").prop('checked', true);
        jQuery("#fdBreakdown").removeClass("hide");
        breakdownStartDateTime = ConvertIntToDate(workOrderViewModal.BreakdownStartDate(), workOrderViewModal.BreakdownStartTime());
        breakdownEndDateTime = ConvertIntToDate(workOrderViewModal.BreakdownEndDate(), workOrderViewModal.BreakdownEndTime());

        jQuery("#txtBreakdownStartDate").datepicker('setDate', breakdownStartDateTime);
        jQuery("#txtBreakdownStartTime").timepicker('setTime', breakdownStartDateTime);
        jQuery("#txtBreakdownEndDate").datepicker('setDate', breakdownEndDateTime);
        jQuery("#txtBreakdownEndTime").timepicker('setTime', breakdownEndDateTime);
        jQuery("#ddlTimeUnitForBreakdown").val(workOrderViewModal.BreakdownDurationUnit());

    }
    else {
        jQuery("#chkbreakdown").prop('checked', false);
        jQuery("#fdBreakdown").addClass("hide");
    }
}

function CalcuteLaborTime() {
    if (workOrderViewModal.LaborTime() == 0 || jQuery.WorkOrderNamespace.DefaultLaborTime || jQuery.WorkOrderNamespace.DefaulttTimeSpent) {
        var workStartDate = workOrderViewModal.WorkStartDate();
        var workStartTime = workOrderViewModal.WorkStartTime();
        var workEndDate = workOrderViewModal.WorkEndDate();
        var workEndTime = workOrderViewModal.WorkEndTime();
        var isValid = true;
        jQuery("#spnCloseWorkOrderError").html('');
        jQuery("#ddlTimeUnitForlaborTime").val(jQuery.WorkOrderNamespace.UnitOfTime.Minutes);
        jQuery("#ddlTimeUnitForTimeSpent").val(jQuery.WorkOrderNamespace.UnitOfTime.Minutes);

        if (parseInt(workStartDate) > parseInt(workEndDate)) {
            errorMessage = LanguageResource.resMsg_StartDateGreater;
            isValid = false;
        }
        if (parseInt(workStartTime) > parseInt(workEndTime)) {
            errorMessage = LanguageResource.resMsg_StartTimeShouldBeGreater;
            isValid = false;
        }
        if (isValid) {
            var workStartDateTime = ConvertIntToDate(workStartDate, workStartTime);
            var workEndDateTime = ConvertIntToDate(workEndDate, workEndTime);
            var hourDifference = (workEndDateTime - workStartDateTime) / 60000;
            
            var timeDifference = parseFloat(hourDifference);
            var workTimeDifference= timeDifference.toFixed(2);
            workOrderViewModal.LaborTime(workTimeDifference);
            workOrderViewModal.TimeSpent(workTimeDifference);
        }
        else {
            jQuery("#spnCloseWorkOrderError").removeClass("text-info");
            jQuery("#spnCloseWorkOrderError").addClass("text-danger");
            jQuery("#spnCloseWorkOrderError").html(errorMessage);
        }
    }
}

function CloseOrSaveWorkOrderInfo(isClose) {
    jQuery("#spnCloseWorkOrderError").html('');
    var workOrderCloseFilter = {};
    workOrderCloseFilter.WorkOrderID = jQuery.WorkOrderNamespace.WorkOrder;
    workOrderCloseFilter.WorkStartDate = workOrderViewModal.WorkStartDate();
    workOrderCloseFilter.WorkStartTime = workOrderViewModal.WorkStartTime();
    workOrderCloseFilter.WorkEndDate = workOrderViewModal.WorkEndDate();
    workOrderCloseFilter.WorkEndTime = workOrderViewModal.WorkEndTime();
    workOrderCloseFilter.LaborTime = workOrderViewModal.LaborTime();
    workOrderCloseFilter.LaborTimeTakenUnit = jQuery("#ddlTimeUnitForlaborTime").val().charCodeAt();
    workOrderCloseFilter.TimeSpent = workOrderViewModal.TimeSpent();
    workOrderCloseFilter.TimeSpentUnit = jQuery("#ddlTimeUnitForTimeSpent").val().charCodeAt();
    workOrderCloseFilter.IsWorkOrderClose = isClose;
    jQuery.extend(workOrderCloseFilter, jQuery.WorkOrderNamespace.BasicParam);

    var isValid = true;
    var errorMessage = "";
    var workOrderStartDateTime = ConvertIntToSiteDateTimeFormat(workOrderCloseFilter.WorkStartDate, workOrderCloseFilter.WorkStartTime);
    var workOrderEndDateTime = ConvertIntToSiteDateTimeFormat(workOrderCloseFilter.WorkEndDate, workOrderCloseFilter.WorkEndTime);

    if (workOrderCloseFilter.LaborTime == "") {
        errorMessage = errorMessage + LanguageResource.resMsg_PleaseEnterLaborTime + "<br/>";
        isValid = false;
    }
    if (workOrderCloseFilter.TimeSpent == "") {
        errorMessage = errorMessage + LanguageResource.resMsg_PleaseEnterTimeSpent + "<br/>";
        isValid = false;
    }
    if (workOrderStartDateTime == "") {
         errorMessage = errorMessage + LanguageResource.resMsg_PleaseEnterWorkStartDate + "<br/>";
         isValid = false;        
    }
    if (workOrderEndDateTime == "") {
        errorMessage = errorMessage + LanguageResource.resMsg_PleaseEnterWorkEndDate + "<br/>";
        isValid = false;
    }
    if (workOrderStartDateTime > workOrderEndDateTime) {
        errorMessage = errorMessage + LanguageResource.resMsg_StartDateGreater + "<br/>";
        isValid = false;

    }
    if (jQuery('#chkbreakdown').is(":checked") == true) {

        workOrderCloseFilter.BreakdownStartDate = workOrderViewModal.BreakdownStartDate();
        workOrderCloseFilter.BreakdownStartTime = workOrderViewModal.BreakdownStartTime();
        workOrderCloseFilter.BreakdownEndDate = workOrderViewModal.BreakdownEndDate();
        workOrderCloseFilter.BreakdownEndTime = workOrderViewModal.BreakdownEndTime();
        workOrderCloseFilter.BreakdownDuration = workOrderViewModal.BreakdownDuration();
        workOrderCloseFilter.BreakdownDurationUnit = jQuery("#ddlTimeUnitForBreakdown").val().charCodeAt();

        var breakdoneStartDateTime = ConvertIntToSiteDateTimeFormat(workOrderCloseFilter.BreakdownStartDate, workOrderCloseFilter.BreakdownStartTime);
        var breakdoneEndDateTime = ConvertIntToSiteDateTimeFormat(workOrderCloseFilter.BreakdownEndDate, workOrderCloseFilter.BreakdownEndTime);

        if (breakdoneStartDateTime == "") {
            errorMessage = errorMessage + LanguageResource.resMsg_PleaseEnterBreakdownStartdate + "<br/>";
            isValid = false;
        }
        if (breakdoneEndDateTime == "") {
            errorMessage = errorMessage + LanguageResource.resMsg_PleaseEnterBreakdownEnddate + "<br/>";
            isValid = false;
        }
        else if (breakdoneStartDateTime > workOrderEndDateTime) {
            errorMessage = errorMessage + LanguageResource.resMsg_InvalidBreakdowntime + "<br/>";
            isValid = false;
        } 
        else if (breakdoneStartDateTime > breakdoneEndDateTime) {
            errorMessage = errorMessage + LanguageResource.resMsg_BreakdownStartDateGreater + "<br/>";
            isValid = false;
        }       
        else if (workOrderCloseFilter.BreakdownDuration == "") {
            errorMessage = errorMessage + LanguageResource.resMsg_PleaseEnterBreakdownDuration + "<br/>";
            isValid = false;
        }       
    }
    else
        workOrderCloseFilter.BreakdownDurationUnit = jQuery.WorkOrderNamespace.UnitOfTime.Minutes.charCodeAt();
    var divHeight = 0;
    var errorHeight = 0;
    if (isValid == false) {
        jQuery("#spnCloseWorkOrderError").html(errorMessage);
        jQuery("#spnCloseWorkOrderError").removeClass("text-info");
        jQuery("#spnCloseWorkOrderError").addClass("text-danger");
        var errorHeight = jQuery("#spnCloseWorkOrderError").height();
        var errorOffsetHeight = jQuery("#spnCloseWorkOrderError").offset().top;
        var errorHeightDiv = errorHeight + errorOffsetHeight;
        var divHeight = jQuery('.flipdiv1').height();
        var divOffsetHeight = jQuery('.flipdiv1').offset().top;
        var divContainHeight = divHeight + divOffsetHeight;
        if (errorHeightDiv > divContainHeight) {
            jQuery('.flipdiv1').css('height', divHeight + 35 + 'px');
        } 
        else {
            jQuery('.flipdiv1').css('height', divHeight - (divContainHeight - errorHeightDiv) + 10 + 'px');
        }
    } 

    if (isValid == true) {
        jQuery.ajax({
            type: "POST",
            url: jQuery.WorkOrderNamespace.ServicePath + "/Vegam_MaintenanceService.asmx/CloseWorkOrderInfo",
            data: JSON.stringify({ workOrderCloseFilter: workOrderCloseFilter }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (json) {
                if (json.d != null && json.d != undefined) {
                    LoadWorkOrderGeneralInfo();
                    jQuery("#spnCloseWorkOrderError").removeClass("text-danger");
                    jQuery("#spnCloseWorkOrderError").addClass("text-info");
                    if (jQuery('#chkbreakdown').is(":checked") == true) {
                        jQuery('.flipdiv1').css('height', '263px');
                    }
                    else
                        jQuery('.flipdiv1').css('height', '160px');

                    if (!isClose)
                        jQuery("#spnCloseWorkOrderError").html(LanguageResource.resMsg_SavedWorkOrderCloseDetails);
                    else
                        jQuery("#spnCloseWorkOrderError").html(LanguageResource.resMsg_SuccessfullyClosedWorkOrder);
                }

                else {
                    jQuery("#spnCloseWorkOrderError").html(LanguageResource.resMsg_FailedToCloseWorkOrder);
                }
            },
            error: function (request, error) {
                jQuery("#spnCloseWorkOrderError").removeClass("text-info");
                jQuery("#spnCloseWorkOrderError").addClass("text-danger");
                if (request.responseText != "") {
                    var errorMsg = jQuery.parseJSON(request.responseText);
                    if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null) {
                        errorMessage = languageResource.resMsg_Error + errorMsg.Message;
                        jQuery("#spnCloseWorkOrderError").html(errorMessage);
                    }
                    else {
                        errorMessage = languageResource.resMsg_Error + LanguageResource.resMsg_FailedToCloseWorkOrder;
                        jQuery("#spnCloseWorkOrderError").html(errorMessage);
                    }
                }
                else {
                    errorMessage = languageResource.resMsg_Error + LanguageResource.resMsg_FailedToCloseWorkOrder;
                    jQuery("#spnCloseWorkOrderError").html(errorMessage);
                }
            }
        });
    } 
}

function LoadWorkOrderGeneralInfo() {
    workOrderViewModal.TaskGroupNotFoundMessage(false);
    LoadAttachmentInfo();
    var filter = {};
    filter.WorkOrderID = jQuery.WorkOrderNamespace.WorkOrder;
    jQuery.extend(filter, jQuery.WorkOrderNamespace.BasicParam);

    jQuery.ajax({
        type: "POST",
        url: jQuery.WorkOrderNamespace.ServicePath + "/Vegam_MaintenanceService.asmx/GetWorkOrderBasicInfo",
        data: JSON.stringify({ filter: filter }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if (json.d != null && json.d != undefined) {
                workOrderViewModal.WorkOrderNum(parseInt(jQuery.WorkOrderNamespace.WorkOrder));
                jQuery.WorkOrderNamespace.WorkOrderStatus = json.d.Status;
                workOrderViewModal.MaintenanceName(json.d.MaintenanceName);
                workOrderViewModal.Description(json.d.Description);
                workOrderViewModal.MaintenanceType(json.d.MaintenanceType);
                workOrderViewModal.Priority(json.d.Priority);
                workOrderViewModal.ScheduledDate(json.d.ScheduledDateTime);
                workOrderViewModal.StartDate(json.d.StartDateTime);
                workOrderViewModal.ActualStartDate(json.d.ActualStartDateTime);
                workOrderViewModal.ActualEndDate(json.d.CompletedDateTime);
                workOrderViewModal.EstimatedTime(json.d.EstimatedTime);
                workOrderViewModal.ActualTime(json.d.ActualTime);
                workOrderViewModal.AssignedTo(json.d.AssignedTo);
                workOrderViewModal.ReportedTo(json.d.ReportedTo);
                if (json.d.EquipmentID) {
                    workOrderViewModal.IsLocationInfo(false);
                    if (json.d.EquipmentImagePath.length > 0) {
                        workOrderViewModal.EquipmentImagePath(json.d.EquipmentOrgImagePath);
                    }
                    else {
                        workOrderViewModal.EquipmentImagePath(jQuery.WorkOrderNamespace.ImagePath + "Equipments.png");
                    }
                    jQuery.WorkOrderNamespace.EquipmentID = json.d.EquipmentID;
                    workOrderViewModal.EquipmentName(json.d.EquipmentName);
                    workOrderViewModal.EquipmentType(json.d.EquipmentType);
                }
                else {
                    workOrderViewModal.IsLocationInfo(true);
                    workOrderViewModal.EquipmentName(json.d.LocationName);
                    if (json.d.LocationImagePath.length > 0) {
                        workOrderViewModal.EquipmentImagePath(json.d.LocationOrgImagePath);
                    }
                    else {
                        workOrderViewModal.EquipmentImagePath(jQuery.WorkOrderNamespace.ImagePath + "FLocation.png");
                    }
                }
                var statusInfo = GetStatusInfo(json.d.Status, true);
                if (json.d.Status == jQuery.WorkOrderNamespace.WorkOrderStatusList.Created || json.d.Status == jQuery.WorkOrderNamespace.WorkOrderStatusList.Cancelled)
                    workOrderViewModal.IsStartWorkOrderAccess(false);
                workOrderViewModal.StatusText(statusInfo.DisplayName);
                workOrderViewModal.StatusImage(jQuery.WorkOrderNamespace.ImagePath + "/" + statusInfo.ImageName);

                workOrderViewModal.WorkStartDate(json.d.WorkStartDate);
                workOrderViewModal.WorkStartTime(json.d.WorkStartTime);
                workOrderViewModal.WorkEndDate(json.d.WorkEndDate);
                workOrderViewModal.WorkEndTime(json.d.WorkEndTime);
                workOrderViewModal.LaborTime(json.d.LaborTime);
                if (json.d.LaborTimeTakenUnit > 0) {
                    workOrderViewModal.LaborTimeTakenUnit(String.fromCharCode(json.d.LaborTimeTakenUnit));
                }
                workOrderViewModal.TimeSpent(json.d.TimeSpent);
                if (json.d.TimeSpentUnit > 0) {
                    workOrderViewModal.TimeSpentUnit(String.fromCharCode(json.d.TimeSpentUnit));
                }
                workOrderViewModal.BreakdownStartDate(json.d.BreakdownStartDate);
                workOrderViewModal.BreakdownStartTime(json.d.BreakdownStartTime);
                workOrderViewModal.BreakdownEndDate(json.d.BreakdownEndDate);
                workOrderViewModal.BreakdownEndTime(json.d.BreakdownEndTime);
                workOrderViewModal.BreakdownDuration(json.d.BreakdownDuration);
                if (json.d.BreakdownDurationUnit > 0) {
                    workOrderViewModal.BreakdownDurationUnit(String.fromCharCode(json.d.BreakdownDurationUnit));
                }
                if (json.d.LaborTime > 0)
                    jQuery.WorkOrderNamespace.DefaultLaborTime = true;
                if (json.d.TimeSpent > 0)
                    jQuery.WorkOrderNamespace.DefaultTimeSpent = true;

                if (json.d.Status == jQuery.WorkOrderNamespace.WorkOrderStatusList.Closed) {
                    workOrderViewModal.IsWorkOrderClosed(true);
                    workOrderViewModal.WorkStartDateTime(ConvertIntToSiteDateTimeFormat(json.d.WorkStartDate, json.d.WorkStartTime));
                    workOrderViewModal.WorkEndDateTime(ConvertIntToSiteDateTimeFormat(json.d.WorkEndDate, json.d.WorkEndTime));
                    workOrderViewModal.ClosedBy(json.d.ClosedBy);
                    workOrderViewModal.ClosedOn(json.d.ClosedOn);
                    workOrderViewModal.BreakDownStartDateTime(ConvertIntToSiteDateTimeFormat(json.d.BreakdownStartDate, json.d.BreakdownStartTime));
                    workOrderViewModal.BreakDownEndDateTime(ConvertIntToSiteDateTimeFormat(json.d.BreakdownEndDate, json.d.BreakdownEndTime));
                    workOrderViewModal.TimeSpentUnitResource(jQuery.WorkOrderNamespace.UnitOfTimeResource[String.fromCharCode(json.d.TimeSpentUnit)]);
                    workOrderViewModal.LaborTimeUnitResource(jQuery.WorkOrderNamespace.UnitOfTimeResource[String.fromCharCode(json.d.LaborTimeTakenUnit)]);
                    workOrderViewModal.BreakDownDurationUnitResource(jQuery.WorkOrderNamespace.UnitOfTimeResource[String.fromCharCode(json.d.BreakdownDurationUnit)]);
                    if (json.d.BreakdownStartDate > 0)
                        workOrderViewModal.IsBreakDownInfoExists(true);
                }
            }
        },
        beforeSend: function () {
        },
        complete: function () {
            var desc = jQuery(".desc").text().length;
            if (desc > 0) {
                jQuery('.desc').addClass('desc_scroll');
            }
        },
        error: function (request, error) {
            var errorMessage = LanguageResource.resMsg_Error + LanguageResource.resMsg_FailedToLoadWorkOrderInformation;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    errorMessage = LanguageResource.resMsg_Error + errorMsg.Message;
            }
            ShowErrorMessage(errorMessage,true);
        }
    });
}

function LoadEquipmentInfo() {
    workOrderViewModal.TaskGroupNotFoundMessage(false);
    jQuery("#txtToDate").datepicker({ dateFormat: jQuery.WorkOrderNamespace.DateFormat }).datepicker("setDate", new Date());
    var prevDate = jQuery("#txtToDate").datepicker('getDate');
    prevDate.setMonth(prevDate.getMonth() - 1);
    jQuery("#txtFromDate").datepicker({ dateFormat: jQuery.WorkOrderNamespace.DateFormat }).datepicker("setDate", prevDate);

    var filter = {};
    filter.WorkOrderID = jQuery.WorkOrderNamespace.WorkOrder;
    filter.EquipmentId = jQuery.WorkOrderNamespace.EquipmentID;
    jQuery.extend(filter, jQuery.WorkOrderNamespace.BasicParam);

    jQuery.ajax({
        type: "POST",
        url: jQuery.WorkOrderNamespace.ServicePath + "/Vegam_MaintenanceService.asmx/GetWorkOrderEquipmentInfo",
        data: JSON.stringify({ filter: filter }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if (json.d != null && json.d != undefined) {
                workOrderViewModal.EquipmentName(json.d.EquipmentName);
                workOrderViewModal.Description(json.d.Description);
                workOrderViewModal.Location(json.d.Location);
                workOrderViewModal.EquipmentType(json.d.Type);
                workOrderViewModal.EquipmentClass(json.d.Class);
                workOrderViewModal.ModelNumber(json.d.ModelNumber);
                workOrderViewModal.ModelName(json.d.ModelName);
                workOrderViewModal.Manufacturer(json.d.Manufacturer);
                workOrderViewModal.SerialNumber(json.d.SerialNumber);
                workOrderViewModal.WarrentyNo(json.d.WarrentyNo);
                if (json.d.WarretyStatus.length > 0) {
                    if (json.d.WarretyStatus == "0")
                        workOrderViewModal.WarrentyStatus(LanguageResource.resMsg_Expired);
                    else if (json.d.WarretyStatus == "1")
                        workOrderViewModal.WarrentyStatus(LanguageResource.resMsg_InWarrenty);
                }
                workOrderViewModal.WarrentyExpiry(json.d.WarrentyExpiryDate);
                workOrderViewModal.PurchaseDate(json.d.PurchaseDate);
                workOrderViewModal.InstalledDate(json.d.InstalledDate);
                if (json.d.EquipmentImagePath.length > 0) {
                    workOrderViewModal.EquipmentImagePath(json.d.EquipmentOrgImagePath);
                }
                else {
                    workOrderViewModal.EquipmentImagePath(jQuery.WorkOrderNamespace.ImagePath + "Equipments.png");
                }
                workOrderViewModal.ManualDocumentsList.removeAll();
                workOrderViewModal.ImagesAndVideosList.removeAll();
                workOrderViewModal.SpecificationDocumentsList.removeAll();

                ko.utils.arrayForEach(json.d.DocumentInfoList, function (docItem) {
                    var docInfo = {};
                    docInfo.DocumentID = docItem.DocumentID;
                    docInfo.DocumentType = String.fromCharCode(docItem.DocumentType);;
                    docInfo.DocumentName = docItem.DocumentName;//split('_', 1)[2].split('.')[0];value.DocumentName.split('.')[0].toString();//split(new [] { '_' }, 3).Last().ToString();
                    docInfo.DocumentDisplayName = docItem.DocumentName.split('.')[0].substring(docItem.DocumentName.lastIndexOf('_') + 1);
                    docInfo.DownloadPath = docItem.DownloadPath;
                    //if (jQuery.DocumnetsAndImagesNamespace.Type != 'M')
                    //    docInfo.IsModelDocument = value.IsModelDocument;
                    //else
                    docInfo.IsModelDocument = false;
                    docInfo.ThumbnailPath = '';
                    docInfo.ShowOnHover = ko.observable(false);

                    if (String.fromCharCode(docItem.DocumentType) == 'I' || String.fromCharCode(docItem.DocumentType) == 'V') {

                        if (String.fromCharCode(docItem.DocumentType) == 'I') {
                            docInfo.ShowOnHover(true);
                            docInfo.ThumbnailPath = docItem.ThumbnailPath;
                        }
                        else if (String.fromCharCode(docItem.DocumentType) == 'V') {
                            docInfo.ThumbnailPath = jQuery.WorkOrderNamespace.ImagePath + 'video.png';
                        }
                        workOrderViewModal.ImagesAndVideosList.push(docInfo);
                    }
                    else if (String.fromCharCode(docItem.DocumentType) == 'D') {
                        var ext = docItem.DocumentName.substring(docItem.DocumentName.lastIndexOf('.') + 1).toLowerCase();
                        if (ext == "png" || ext == "jpeg" || ext == "jpg") {
                            docInfo.ThumbnailPath = docItem.ThumbnailPath;
                        }
                        else {
                            docInfo.ThumbnailPath = jQuery.WorkOrderNamespace.ImagePath + ext + '.png';
                        }
                        workOrderViewModal.ManualDocumentsList.push(docInfo);
                    }
                    else if (String.fromCharCode(docItem.DocumentType) == 'S') {
                        var ext = docItem.DocumentName.substring(docItem.DocumentName.lastIndexOf('.') + 1).toLowerCase();
                        if (ext == "png" || ext == "jpeg" || ext == "jpg") {
                            docInfo.ThumbnailPath = docItem.ThumbnailPath;
                        }
                        else {
                            docInfo.ThumbnailPath = jQuery.WorkOrderNamespace.ImagePath + ext + '.png';
                        }
                        workOrderViewModal.SpecificationDocumentsList.push(docInfo);
                    }
                });
            }
        },
        beforeSend: function () {
        },
        complete: function () {
        },
        error: function (request, error) {
            var errorMessage = LanguageResource.resMsg_Error + LanguageResource.resMsg_FailedToLoadEquipmentInfo;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    errorMessage = LanguageResource.resMsg_Error + errorMsg.Message;
            }
            ShowErrorMessage(errorMessage,true);
        }
    });
}

function LoadWorkInstructionInfo() {
    var filter = {};
    filter.WorkOrderID = jQuery.WorkOrderNamespace.WorkOrder;
    jQuery.extend(filter, jQuery.WorkOrderNamespace.BasicParam);

    jQuery.ajax({
        type: "POST",
        url: jQuery.WorkOrderNamespace.ServicePath + "/Vegam_MaintenanceService.asmx/GetWorkOrderTaskInfo",
        data: JSON.stringify({ filter: filter }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if (json.d != null && json.d != undefined) {
                if (json.d.TaskInfoList.length > 0) {
                    BindWorkInstructionsViewModal(json.d);
                    workOrderViewModal.TaskGroupNotFoundMessage(false);
                }
                else {
                    workOrderViewModal.TaskGroupNotFoundMessage(true);
                }
            }
        },
        beforeSend: function () {
            workOrderViewModal.ShowLoadProgress(true);
        },
        complete: function () {
            workOrderViewModal.ShowLoadProgress(false);
        },
        error: function (request, error) {
            var errorMessage = LanguageResource.resMsg_Error + LanguageResource.resMsg_FailedToLoadWorkInstructions;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    errorMessage = LanguageResource.resMsg_Error + errorMsg.Message;
            }
            ShowErrorMessage(errorMessage,true);
        }
    });
}


function StartTask(taskInfo, selectedPPEImageIDList, isSafetyConfirmed, isPPEConfirmed) {
    var startTaskInfo = {};
    startTaskInfo.TaskID = taskInfo.TaskID;
    startTaskInfo.WorkOrderID = jQuery.WorkOrderNamespace.WorkOrder;
    startTaskInfo.TaskPPEIDList = selectedPPEImageIDList;
    startTaskInfo.IsSafetyConfirmed = isSafetyConfirmed;
    startTaskInfo.IsPPEConfirmed = isPPEConfirmed;
    jQuery.extend(startTaskInfo, jQuery.WorkOrderNamespace.BasicParam);

    jQuery.ajax({
        type: "POST",
        url: jQuery.WorkOrderNamespace.ServicePath + "/Vegam_MaintenanceService.asmx/StartWorkOrderTask",
        data: JSON.stringify({ startTaskInfo: startTaskInfo }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if (json.d.ReturnValue == 1) {                //Task Started Successfully.                
                taskInfo.TaskIsInProgress(true);
                taskInfo.ShowStartTask(false);
                taskInfo.ShowEndTask(true);
                var statusInfo = GetStatusInfo("P", false);
                taskInfo.Status(statusInfo.DisplayName);
                taskInfo.StatusImage(jQuery.WorkOrderNamespace.ImagePath + "/" + statusInfo.ImageName);
                taskInfo.StartedBy(json.d.UserName);
                taskInfo.StartedDateTime(json.d.CurrentDateTime);
                LoadWorkOrderGeneralInfo();
                //ko.utils.arrayFirst(selectedPPEImageIDList, function (ppeImageID) {
                //    ko.utils.arrayFirst(taskInfo.PPEList, function (ppeInfo) {
                //        if (ppeImageID == ppeInfo.ImageID) {
                //            ppeInfo.IsConfirmed(true);
                //            return ppeInfo
                //        }
                //    });
                //});
            }
            else if (json.d.ReturnValue == 0) {
                ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_TaskDoesNotExistsInTaskGroup,true);
            }
            else if (json.d.ReturnValue == -1) {
                ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_NoPermission,true);
            }
            else if (json.d.ReturnValue == -2) {
                ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_TaskAlreadyStarted,true);
            }
            else if (json.d.ReturnValue == -3) {
                ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_TaskGroupIsNotExists,true);
            }
        },
        beforeSend: function () {
            taskInfo.DisableTaskStartEnd(true);
            taskInfo.ShowTaskStartEndProgress(true);
        },
        complete: function () {
            taskInfo.DisableTaskStartEnd(false);
            taskInfo.ShowTaskStartEndProgress(false);
        },
        error: function (request, error) {
            var errorMessage = LanguageResource.resMsg_Error + LanguageResource.resMsg_FailedToStartTask;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    errorMessage = LanguageResource.resMsg_Error + errorMsg.Message;
            }
            ShowErrorMessage(errorMessage,true);
        }
    });
}

function EndTask(taskInfo) {
    taskInfo.RemarksMissing(false);
    ko.utils.arrayForEach(taskInfo.ParameterList, function (parameterInfo) {
        parameterInfo.ValueMissing(false);
    });

    var endTaskInfo = {};
    endTaskInfo.TaskID = taskInfo.TaskID;
    endTaskInfo.WorkOrderID = jQuery.WorkOrderNamespace.WorkOrder;
    jQuery.extend(endTaskInfo, jQuery.WorkOrderNamespace.BasicParam);

    jQuery.ajax({
        type: "POST",
        url: jQuery.WorkOrderNamespace.ServicePath + "/Vegam_MaintenanceService.asmx/EndWorkOrderTask",
        data: JSON.stringify({ endTaskInfo: endTaskInfo }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if (json.d.ReturnValue == 1) {
                taskInfo.TaskIsInProgress(false);
                taskInfo.ShowStartTask(false);
                taskInfo.ShowEndTask(false);
                var statusInfo = GetStatusInfo("C", false);
                taskInfo.Status(statusInfo.DisplayName);
                taskInfo.StatusImage(jQuery.WorkOrderNamespace.ImagePath + "/" + statusInfo.ImageName);
                taskInfo.EndedBy(json.d.UserName);
                taskInfo.EndDateTime(json.d.CurrentDateTime);
                LoadWorkOrderGeneralInfo();                
            }
            else if (json.d.ReturnValue == 0) {
                ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_TaskDoesNotExistsInTaskGroup,true);
            }
            else if (json.d.ReturnValue == -1) {
                ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_NoPermission,true);
            }
            else if (json.d.ReturnValue == -2) {
                ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_TaskIsAlreadyCompleted,true);
            }
            else if (json.d.ReturnValue == -3) {
                ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_TaskIsNotStarted,true);
            }
            else if (json.d.ReturnValue == -4) {
                taskInfo.RemarksMissing(true);
                ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_RemarksAreMissing,true);
            }
            else if (json.d.ReturnValue == -5) {
                ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_ImagesAreMissing,true);
            }
            else if (json.d.ReturnValue == -6) {
                ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_ParametersAreMissing,true);

                ko.utils.arrayForEach(taskInfo.ParameterList, function (parameterInfo) {
                    if (json.d.MissingParameterIDList.indexOf(parameterInfo.ParameterID) > -1)
                        parameterInfo.ValueMissing(true);
                });
            }
        },
        beforeSend: function () {
            taskInfo.DisableTaskStartEnd(true);
            taskInfo.ShowTaskStartEndProgress(true);
        },
        complete: function () {
            taskInfo.DisableTaskStartEnd(false);
            taskInfo.ShowTaskStartEndProgress(false);
        },
        error: function (request, error) {
            var errorMessage = LanguageResource.resMsg_Error + LanguageResource.resMsg_FaileToEndTask;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    errorMessage = LanguageResource.resMsg_Error + errorMsg.Message;
            }
            ShowErrorMessage(errorMessage,true);
        }
    });
}

function SaveTaskParameterValue(taskInfo) {
    taskInfo.DisableSaveParameter(true);
    taskInfo.ShowSaveParameterProgress(true);
    taskInfo.RemarksMissing(false);
    ko.utils.arrayForEach(taskInfo.ParameterList, function (parameterInfo) {
        parameterInfo.ValueMissing(false);
    });

    var remarks = '';
    if (taskInfo.RemarkEnabled) {
        remarks = jQuery.trim(taskInfo.Remarks);
    }

    var parameterList = [];
    ko.utils.arrayForEach(taskInfo.ParameterList, function (paramInfo) {
        var selectCodeItem = 0;
        var paramValue = jQuery.trim(paramInfo.Value());
        if (paramInfo.Type == workOrderViewModal.parameterTypeInfo.Numeric) {
            paramValue = parseInt(paramValue);
        }
        else if (paramInfo.Type == workOrderViewModal.parameterTypeInfo.Numeric) {
            paramValue = parseFloat(paramValue);
        }
        else if (paramInfo.Type == workOrderViewModal.parameterTypeInfo.SelectionCode && paramValue == "0") {
            selectCodeItem = paramValue;
            paramValue = '';
        }

        if (paramValue.length > 0 || paramValue > 0) {
            var parameterInfo = {};
            parameterInfo.ParameterID = paramInfo.ParameterID;
            parameterInfo.ParameterValue = paramValue;
            parameterInfo.SelectCodeItem = selectCodeItem;
            parameterList.push(parameterInfo);
        }
    });

    var taskParameter = {};
    taskParameter.WorkOrderID = jQuery.WorkOrderNamespace.WorkOrder;
    taskParameter.TaskID = taskInfo.TaskID;
    taskParameter.Remarks = remarks;
    taskParameter.ParameterList = [];
    taskParameter.ParameterList = parameterList;
    jQuery.extend(taskParameter, jQuery.WorkOrderNamespace.BasicParam);

    jQuery.ajax({
        type: "POST",
        url: jQuery.WorkOrderNamespace.ServicePath + "/Vegam_MaintenanceService.asmx/SaveTaskParameterValue",
        data: JSON.stringify({ taskParameter: taskParameter }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if (json.d == 1) {
                taskInfo.ParameterSaveMessage(LanguageResource.resMsg_ParameterInfoSavedSuccessfully);
            }
            else if (json.d == -1) {
                ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_NoPermission,true);
            }
            else if (json.d == -2) {
                ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_TaskIsAlreadyCompleted,true);
            }
            else if (json.d == -3) {
                ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_TaskIsNotStarted,true);
            }
        },
        complete: function () {
            taskInfo.DisableSaveParameter(false);
            taskInfo.ShowSaveParameterProgress(false);
        },
        error: function (request, error) {
            var errorMessage = LanguageResource.resMsg_Error + LanguageResource.resMsg_FailedToSaveParameterInfo;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    errorMessage = LanguageResource.resMsg_Error + errorMsg.Message;
            }
            ShowErrorMessage(errorMessage,true);
        }
    });
}

function TaskImageUpload(fileUploadCtl) {
    var errorMessage = ''; var isValid = false; var ext = '';
    var capturedImage = jQuery(fileUploadCtl).val();
    if (capturedImage != 'undefined' && capturedImage.length > 0) {
        //errorMessage = LanguageResource.resMsg_FailedToUploadImage;
        ext = capturedImage.substring(capturedImage.lastIndexOf('.') + 1).toLowerCase();
        if ((ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg")) {
            isValid = true;
        }
        else {
            errorMessage = LanguageResource.resMsg_InvalidFileFormat;
        }

        if (!isValid) {
            ShowErrorMessage(errorMessage,true);
            jQuery(fileUploadCtl).val('');
            return;
        }

        var currentDate = new Date();
        var currentDateAndTime = currentDate.format("yyyyMMddhhmmss");
        var fileName = "Img_" + currentDateAndTime + "." + ext;
        var urlString = jQuery.WorkOrderNamespace.UploaderPath + '?uid=' + jQuery.WorkOrderNamespace.BasicParam.UserID + '&sid=' + jQuery.WorkOrderNamespace.BasicParam.SiteID + '&workorder=' + jQuery.WorkOrderNamespace.WorkOrder + '&fileName=' + fileName + '&workordertaskimage=true';

        var taskID = jQuery(fileUploadCtl).attr("taskID");
        var fileUploadCtlID = "fleTaskImageUpload" + taskID;

        jQuery.ajaxFileUpload({
            type: "POST",
            url: urlString,
            fileElementId: fileUploadCtlID,
            success: function (data, status) {
                jQuery(fileUploadCtl).val('');
                if (data.documentElement.innerText != "true") {
                    ShowErrorMessage(LanguageResource.resMsg_FailedToUploadImage,true);
                }
                else {
                    InsertWorkOrderTaskImage(taskID, fileName);
                }
            },
            beforeSend: function () {
                workOrderViewModal.ShowImageUploadProgress(true);
            },
            error: function (request, error) {
                workOrderViewModal.ShowImageUploadProgress(false);
                jQuery(fileUploadCtl).val('');
                var errorMessage = LanguageResource.resMsg_Error + LanguageResource.resMsg_FailedToUploadImage;
                if (request.responseText != "") {
                    var errorMsg = jQuery.parseJSON(request.responseText);
                    if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                        errorMessage = LanguageResource.resMsg_Error + errorMsg.Message;
                }
                ShowErrorMessage(errorMessage,true);
            }
        });
    }
}

function InsertWorkOrderTaskImage(taskID, fileName) {
    var imageUploadInfo = {};
    imageUploadInfo.TaskID = taskID;
    imageUploadInfo.WorkOrderID = jQuery.WorkOrderNamespace.WorkOrder;
    imageUploadInfo.ImageName = fileName;
    jQuery.extend(imageUploadInfo, jQuery.WorkOrderNamespace.BasicParam);

    jQuery.ajax({
        type: "POST",
        url: jQuery.WorkOrderNamespace.ServicePath + "/Vegam_MaintenanceService.asmx/InsertWorkOrderTaskImage",
        data: JSON.stringify({ imageUploadInfo: imageUploadInfo }),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data.d !== null) {
                if (data.d.ImageID == -1) {
                    ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_NoPermission,true);
                }
                else if (data.d.ImageID == -2) {
                    ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_TaskIsAlreadyCompleted,true);
                }
                else if (data.d.ImageID == -3) {
                    ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_TaskIsNotStarted,true);
                }
                else {
                    var taskItemInfo = ko.utils.arrayFirst(workOrderViewModal.taskInfoList(), function (taskItem) {
                        if (taskItem.TaskID == taskID)
                            return taskItem;
                    });

                    if (taskItemInfo != undefined && taskItemInfo != null) {
                        var imageInfo = {};
                        imageInfo.ImageID = data.d.ImageID;
                        imageInfo.ImagePath = data.d.ImagePath;
                        imageInfo.ThubmnailPath = data.d.ThubmnailPath;
                        taskItemInfo.ImageList.push(imageInfo);
                    }
                }
            } else {
                ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_FailedToUploadImage,true);
            }
        },
        complete: function () {
            workOrderViewModal.ShowImageUploadProgress(false);
        },
        error: function (request, error) {
            var errorMessage = LanguageResource.resMsg_FailedToUploadImage;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                    errorMessage = errorMsg.Message;
            }
            ShowErrorMessage(LanguageResource.resMsg_Error + errorMessage,true);
        }
    });
}

function ShowStartTaskModal(taskInfo) {
    startTaskViewModal.TaskID = taskInfo.TaskID;
    startTaskViewModal.SafetyInstruction(taskInfo.SafetyDescription);
    startTaskViewModal.IsSafetyConfirmed(false);
    startTaskViewModal.IsPPEConfirmed(false);
    startTaskViewModal.StartTaskConfirmError('');
    startTaskViewModal.PPEList.removeAll();

    if (taskInfo.SafetyDescription.length > 0)
        startTaskViewModal.ShowSafetyInstruction(true);
    else
        startTaskViewModal.ShowSafetyInstruction(false);

    if (taskInfo.PPEList.length > 0)
        startTaskViewModal.ShowPPEInfo(true);
    else
        startTaskViewModal.ShowPPEInfo(false);

    ko.utils.arrayForEach(taskInfo.PPEList, function (ppeItemInfo) {
        var ppeInfo = {};
        ppeInfo.ImageID = ppeItemInfo.ImageID;
        //ppeInfo.IsConfirmed = ko.observable(false);
        ppeInfo.Description = ppeItemInfo.Description;
        ppeInfo.ImagePath = ppeItemInfo.ImagePath;
        startTaskViewModal.PPEList.push(ppeInfo);
    });

    if (startTaskViewModal.ShowSafetyInstruction() || startTaskViewModal.ShowPPEInfo()) {
        jQuery("#divStartTaskModal").modal("show");

        jQuery("#btnStartTaskConfirm").unbind('click');
        jQuery("#btnStartTaskConfirm").bind("click", function () {
            if (startTaskViewModal.ShowSafetyInstruction() && startTaskViewModal.ShowPPEInfo()
                && !startTaskViewModal.IsSafetyConfirmed() && !startTaskViewModal.IsPPEConfirmed()) {
                startTaskViewModal.StartTaskConfirmError(LanguageResource.resMsg_PleaseConfirmSafetyInsturctionAndPPE);
            }
            else if (startTaskViewModal.ShowSafetyInstruction() && !startTaskViewModal.IsSafetyConfirmed()) {
                startTaskViewModal.StartTaskConfirmError(LanguageResource.resMsg_PleaseConfirmSafetyInfo);
            }
            else if (startTaskViewModal.ShowPPEInfo() && !startTaskViewModal.IsPPEConfirmed()) {
                startTaskViewModal.StartTaskConfirmError(LanguageResource.resMsg_PleaseConfirmPPEInfo);
            }
            else {
                //var selectedPPEImageIDList = [];
                //ko.utils.arrayForEach(startTaskViewModal.PPEList(), function (selectedPPEInfo) {
                //    if (selectedPPEInfo.IsConfirmed())
                //        selectedPPEImageIDList.push(selectedPPEInfo.ImageID);                    
                //});              

                StartTask(taskInfo, [], startTaskViewModal.IsSafetyConfirmed(), startTaskViewModal.IsPPEConfirmed());
                jQuery("#divStartTaskModal").modal("hide");
            }
            return false;
        });
    }
    else {
        StartTask(taskInfo, [], false, false);
    }
}

function GetEnumTypeInfo(enumType) {
    var basicParam = {};
    jQuery.extend(basicParam, jQuery.WorkOrderNamespace.BasicParam);

    jQuery.ajax({
        type: "POST",
        url: jQuery.WorkOrderNamespace.ServicePath + "/Vegam_MaintenanceService.asmx/GetEnumInfoList",
        data: JSON.stringify({ basicParam: basicParam, EnumType: enumType }),
        dataType: 'json',
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data.d !== null) {
                ko.utils.arrayForEach(data.d, function (statusInfo) {
                    if (enumType == "MAINT_WORKORDERSTATUS")
                        jQuery.WorkOrderNamespace.WorkOrderStatusInfo[statusInfo.TypeValue] = statusInfo;
                    else
                        jQuery.WorkOrderNamespace.WorkOrderTaskStatusInfo[statusInfo.TypeValue] = statusInfo;
                });
            } else {
                ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_FailedToLoadStatusInfo,true);
            }
        },
        error: function (request, error) {
            var errorMessage = LanguageResource.resMsg_FailedToLoadStatusInfo;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                    errorMessage = errorMsg.Message;
            }
            ShowErrorMessage(LanguageResource.resMsg_Error + errorMessage,true);
        }
    });
}

function BindWorkInstructionsViewModal(result) {
    workOrderViewModal.taskInfoList.removeAll();

    if (!result.IsScheduledForToday) {
        workOrderViewModal.HasTaskAccess(false);
        workOrderViewModal.HasEditAccess(false);
    }

    jQuery.each(result.TaskInfoList, function (index, item) {
        var taskInfo = {};
        taskInfo.TaskID = item.TaskID;
        taskInfo.TaskName = item.TaskName;
        taskInfo.Description = item.Description;
        taskInfo.IsSafetyConfirmed = item.IsSafetyConfirmed;
        taskInfo.IsPPEConfirmed = item.IsPPEConfirmed;
        taskInfo.SafetyDescription = item.SafetyDescription;
        taskInfo.EstimatedTime = item.EstimatedTime;
        taskInfo.RemarkEnabled = item.RemarkEnabled;
        taskInfo.IsRemarkMandatory = item.IsRemarkMandatory;
        taskInfo.Remarks = item.Remarks;
        taskInfo.PictureEnabled = item.PictureEnabled;
        taskInfo.IsPictureMandatory = item.IsPictureMandatory;
        taskInfo.StartedBy = ko.observable(item.StartedBy);
        taskInfo.StartedDateTime = ko.observable(item.StartedDateTime);
        taskInfo.EndedBy = ko.observable(item.EndedBy);
        taskInfo.EndDateTime = ko.observable(item.EndDateTime);

        taskInfo.PPEList = [];
        taskInfo.ToolsList = [];
        taskInfo.DocumentInfoList = [];
        taskInfo.ImageList = ko.observableArray([]);
        taskInfo.ParameterList = ko.observableArray([]);

        jQuery.each(item.ImageList, function (imageIndex, imageItem) {
            var imageInfo = {};
            imageInfo.ImageID = imageItem.ImageID;
            imageInfo.ImagePath = imageItem.ImagePath;
            imageInfo.ThubmnailPath = imageItem.ThubmnailPath;
            taskInfo.ImageList.push(imageInfo);
        });

        var parameterList = [];
        jQuery.each(item.ParameterList, function (parameterIndex, parameterItem) {
            var parameterInfo = {};
            parameterInfo.ParameterID = parameterItem.ParameterID;
            parameterInfo.ParameterName = parameterItem.ParameterName;
            parameterInfo.Type = parameterItem.Type;
            parameterInfo.Value = ko.observable(parameterItem.Value);
            parameterInfo.IsMandatory = parameterItem.IsMandatory;
            parameterInfo.TemplateName = GetParameterTemplateName(parameterItem.Type);
            parameterInfo.ValueMissing = ko.observable(false);
            parameterInfo.SelectionCodeItemList = [];

            if (parameterItem.Type == workOrderViewModal.parameterTypeInfo.SelectionCode) {
                var selGroupInfo = ko.utils.arrayFirst(result.SeletionGroupInfoList, function (selectionGroupInfo, selIndex) {
                    if (parameterItem.SelectionGroupID == selectionGroupInfo.SelectionGroupID)
                        return selectionGroupInfo;
                });

                if (selGroupInfo != null) {
                    jQuery.extend(parameterInfo.SelectionCodeItemList, selGroupInfo.KeyValueInfoList);
                    var selectInfo = {};
                    selectInfo.Key = LanguageResource.resMsg_Select;
                    selectInfo.Value = 0;
                    parameterInfo.SelectionCodeItemList.splice(0, 0, selectInfo);

                    if (parameterInfo.Value().length > 0) {
                        var selItem = ko.utils.arrayFirst(selGroupInfo.KeyValueInfoList, function (selItem, selItemIndex) {
                            if (selItem.Value == parameterInfo.Value)
                                return selItem;
                        });

                        if (selItem == null) {
                            var selectInfo = {};
                            selectInfo.Key = parameterItem.ValueDisplayName;
                            selectInfo.Value = parameterItem.Value;
                            parameterInfo.SelectionCodeItemList.push(selectInfo);
                        }
                    }
                }
            }

            parameterList.push(parameterInfo);
        });

        var PPEList = [];
        jQuery.each(item.PPEList, function (ppeIndex, PPEItem) {
            var ppeInfo = {};
            ppeInfo.ImageID = PPEItem.ImageID;
            ppeInfo.Description = PPEItem.Description;
            ppeInfo.ImagePath = PPEItem.ImagePath;
            PPEList.push(ppeInfo);
        });

        var documentInfoList = [];
        jQuery.each(item.DocumentInfoList, function (dIndex, documentItem) {
            if (documentItem.DocumentType != jQuery.WorkOrderNamespace.DocumentType.IMAGE) {//Not Equal to image                
                var ext = documentItem.DocumentName.substring(documentItem.DocumentName.lastIndexOf('.') + 1).toLowerCase();
                documentItem.ThumbnailPath = jQuery.WorkOrderNamespace.ImagePath + '/' + ext + '.png';
            }
            documentItem.ShowDownloadProgress = ko.observable(false);
            documentInfoList.push(documentItem);
        });

        taskInfo.PPEList = PPEList;
        taskInfo.ToolsList = item.ToolsList;
        taskInfo.ParameterList = parameterList;
        taskInfo.DocumentInfoList = documentInfoList;

        var statusInfo = GetStatusInfo(item.Status, false);
        taskInfo.Status = ko.observable(statusInfo.DisplayName);
        taskInfo.StatusImage = ko.observable(jQuery.WorkOrderNamespace.ImagePath + "/" + statusInfo.ImageName);

        taskInfo.ShowStartTask = ko.observable(false);
        taskInfo.ShowEndTask = ko.observable(false);
        taskInfo.TaskIsInProgress = ko.observable(false);

        if (item.Status == "P") {
            taskInfo.ShowEndTask = ko.observable(true);
            taskInfo.TaskIsInProgress = ko.observable(true);
        }
        else if (item.Status == "N") {
            taskInfo.ShowStartTask = ko.observable(true);
        }

        taskInfo.ShowTaskStartEndProgress = ko.observable(false);
        taskInfo.DisableTaskStartEnd = ko.observable(false);
        taskInfo.DisableSaveParameter = ko.observable(false);
        taskInfo.ShowSaveParameterProgress = ko.observable(false);
        taskInfo.ParameterSaveMessage = ko.observable('');
        taskInfo.RemarksMissing = ko.observable(false);

        workOrderViewModal.taskInfoList.push(taskInfo);
    });

    jQuery('[data-toggle="popover"]').popover();
    jQuery('#popoverData').popover();
    jQuery('.pover').popover({ trigger: "hover" });
}

function DownloadDocumentOrImageOrVideoInfo(item) {
    if (item.DownloadPath.length > 0 && item.DocumentName.length > 0) {
        var fileName = item.DocumentName;
        var filePath = item.DownloadPath;
        window.location = jQuery.WorkOrderNamespace.BasePath + "/HandlerFiles/DownloadHandler.ashx?MaintenanceDocsName=" + fileName + "&MaintenanceDocsPath=" + filePath;
    }
    else {
        var errorMessage = '';
        if (item.DocumentType == 'I' || item.DocumentType == 'V') {
            errorMessage = LanguageResource.resMsg_Error + LanguageResource.resMsg_FailedToDownloadMultimediaFile;
        }
        else if (item.DocumentType == 'D') {
            errorMessage = LanguageResource.resMsg_Error + LanguageResource.resMsg_FailedToDownloadDocument;
        }
        ShowMessage(errorMessage);
    }
}

function DownloadImage(imagePath) {
    var startIndex = imagePath.lastIndexOf("/");
    var lastIndex = imagePath.length;
    var fileName = imagePath.substring(startIndex + 1, lastIndex);

    window.location = jQuery.WorkOrderNamespace.BasePath + "/HandlerFiles/DownloadHandler.ashx?MaintenanceDocsName=" + fileName + "&MaintenanceDocsPath=" + imagePath;
}

function LoadWorkOrderInfo(lnkID) {
    if (lnkID == "lnkGeneral") {
        jQuery("#lnkGeneral").addClass("active");
        jQuery("#lnkWorkEquipments").removeClass("active");
        jQuery("#lnkEquipment").removeClass("active");
        jQuery("#lnkSpareParts").removeClass("active");
        jQuery("#lnkMeasuringPoint").removeClass("active");

        jQuery("#divEquipmentInfo").addClass("hide");
        jQuery("#divWorkInstruction").addClass("hide");
        jQuery("#divGeneralInfo").removeClass("hide");
        jQuery("#divSparePartInfo").addClass("hide");
        jQuery("#divMeasuringPointInfo").addClass("hide");
        $('.flipdiv1').css('height', '0px');
        LoadWorkOrderGeneralInfo();
    }
    else if (lnkID == "lnkWorkInstructions") {
        jQuery("#lnkWorkEquipments").addClass("active");
        jQuery("#lnkGeneral").removeClass("active");
        jQuery("#lnkEquipment").removeClass("active");
        jQuery("#lnkSpareParts").removeClass("active");
        jQuery("#lnkMeasuringPoint").removeClass("active");

        jQuery("#divEquipmentInfo").addClass("hide");
        jQuery("#divGeneralInfo").addClass("hide");
        jQuery("#divWorkInstruction").removeClass("hide");
        jQuery("#divSparePartInfo").addClass("hide");
        jQuery("#divMeasuringPointInfo").addClass("hide");
        $('.flipdiv1').css('height', '0px');
        //var flipDv = $('.flipdiv2, .flipdiv1').height();
        //if (flipDv == 0) {
            $('.flipdiv1').removeClass('flipdiv1animate');
            $('.flipdiv2').removeClass('flipdiv2animate');
        //}
        //$('.flipdiv1').css('border', '0px solid #ccc');
        //$('.flipdiv1').css('background-color', '#fff');
        LoadWorkInstructionInfo();
    }
    else if (lnkID == "lnkEquipment") {
        jQuery("#lnkEquipment").addClass("active");
        jQuery("#lnkGeneral").removeClass("active");
        jQuery("#lnkWorkEquipments").removeClass("active");
        jQuery("#lnkSpareParts").removeClass("active");
        jQuery("#lnkMeasuringPoint").removeClass("active");

        jQuery("#divGeneralInfo").addClass("hide");
        jQuery("#divWorkInstruction").addClass("hide");
        jQuery("#divEquipmentInfo").removeClass("hide");
        jQuery("#divSparePartInfo").addClass("hide");
        jQuery("#divMeasuringPointInfo").addClass("hide");
        $('.flipdiv1').css('height', '0px');
        LoadEquipmentInfo();
        jQuery.WorkOrderNamespace.IsSearch = true;
        LoadEquipmentHistory(jQuery.WorkOrderNamespace.PagerData);
    }
    else if (lnkID == "lnkSpareParts") {
        jQuery("#lnkSpareParts").addClass("active");
        jQuery("#lnkGeneral").removeClass("active");
        jQuery("#lnkWorkEquipments").removeClass("active");
        jQuery("#lnkEquipment").removeClass("active");
        jQuery("#lnkMeasuringPoint").removeClass("active");

        jQuery("#divGeneralInfo").addClass("hide");
        jQuery("#divWorkInstruction").addClass("hide");
        jQuery("#divEquipmentInfo").addClass("hide");
        jQuery("#divSparePartInfo").removeClass("hide");
        jQuery("#divMeasuringPointInfo").addClass("hide");
        $('.flipdiv1').css('height', '0px');
        LoadSparePartInfo();
    }
    else if (lnkID == "lnkMeasuringPoint") {
        jQuery("#lnkMeasuringPoint").addClass("active");
        jQuery("#lnkSpareParts").removeClass("active");
        jQuery("#lnkGeneral").removeClass("active");
        jQuery("#lnkWorkEquipments").removeClass("active");
        jQuery("#lnkEquipment").removeClass("active");


        jQuery("#divGeneralInfo").addClass("hide");
        jQuery("#divWorkInstruction").addClass("hide");
        jQuery("#divEquipmentInfo").addClass("hide");
        jQuery("#divSparePartInfo").addClass("hide");
        jQuery("#divMeasuringPointInfo").removeClass("hide");
        $('.flipdiv1').css('height', '0px');
        LoadMeasuringPoint();
    }

}

function GetStatusInfo(statusValue, isHeader) {
    var statusInfo;
    if (isHeader)
        statusInfo = jQuery.WorkOrderNamespace.WorkOrderStatusInfo[statusValue];
    else
        statusInfo = jQuery.WorkOrderNamespace.WorkOrderTaskStatusInfo[statusValue];

    if (statusInfo == undefined) {
        statusInfo = {};
        statusInfo.DisplayName = '';
        statusInfo.ImageName = '';
    }
    return statusInfo;
}

function ShowErrorMessage(message, isError) {
    if (isError)
        jQuery("#errorMessageText").html(message).removeClass('blue').addClass("red");
    else
        jQuery("#errorMessageText").html(message).removeClass('red').addClass("blue");

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

function ShowHideDetails(ctlInfo, divAttribute) {
    var contentDiv;
    if (divAttribute == "taskdiv") {
        var parentFieldSet = jQuery(ctlInfo).parent("fieldset");
        contentDiv = jQuery(parentFieldSet).next("div");
    }
    else {
        var parentFieldSet = jQuery(ctlInfo).parents("[contentdiv=taskdiv]");
        contentDiv = jQuery(parentFieldSet).find("[contentdiv='" + divAttribute + "']");
    }

    if (jQuery(ctlInfo).hasClass("fa-minus-circle")) {
        jQuery(ctlInfo).removeClass("fa-minus-circle");
        jQuery(ctlInfo).addClass("fa-plus-circle");
        jQuery(contentDiv).addClass("hide");
    }
    else {
        jQuery(ctlInfo).removeClass("fa-plus-circle");
        jQuery(ctlInfo).addClass("fa-minus-circle");
        jQuery(contentDiv).removeClass("hide");
    }
}

function GetParameterTemplateName(parameterType) {
    var templateName = '';
    if (parameterType == workOrderViewModal.parameterTypeInfo.MultiLineText) {
        templateName = "multilineParameter-template";
    }
    else if (parameterType == workOrderViewModal.parameterTypeInfo.SelectionCode) {
        templateName = "selection-template";
    }
    else {
        templateName = "singleParameter-template";
    }
    return templateName;
}

function ConfirmSafetyInstruction() {
    startTaskViewModal.IsSafetyConfirmed(true);
}

function ConfirmPPE() {
    startTaskViewModal.IsPPEConfirmed(true);
}

function TestUpload() {
    var tes = '';
    var test1 = jQuery("#fleTaskImageUpload").val();
    jQuery("#fleTaskImageUpload").val('');
    test1 = jQuery("#fleTaskImageUpload").val();
}

//Attachments
function LoadAttachmentInfo() {
    workOrderViewModal.ModelErrorMsg('');
    jQuery.ajax({
        type: "POST",
        url: jQuery.WorkOrderNamespace.ServicePath + "/Vegam_MaintenanceService.asmx/GetAttachmentDetailsForWorkOrder",
        data: JSON.stringify({ basicParam: jQuery.WorkOrderNamespace.BasicParam, workOrderNo: jQuery.WorkOrderNamespace.WorkOrder }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        success: function (json) {
            if (json != undefined && json.d != undefined && json.d != null) {
                if (json.d.length > 0) {
                    workOrderViewModal.AttachmentList([]);
                    ko.utils.arrayForEach(json.d, function (item) {
                        var ext = item.DocumentName.substring(item.DocumentName.lastIndexOf('.') + 1).toLowerCase();
                        var type = GetAttachmentType(ext);
                        if (type == jQuery.WorkOrderNamespace.DocumentType.DOCUMENT) {
                            item.ThumbnailPath = jQuery.WorkOrderNamespace.ImagePath + '/' + ext + '.png';
                        }
                        else if (type == jQuery.WorkOrderNamespace.DocumentType.VIDEO) {
                            item.ThumbnailPath = jQuery.WorkOrderNamespace.ImagePath + '/video.png';
                        }
                        workOrderViewModal.AttachmentList.push(item);
                    });
                }
            }
            else {
                ShowErrorMessage(LanguageResource.resMsg_FailedToLoadDocumentsInfo,true);
            }
        },
        beforeSend: function () {
            jQuery("#divAttachmentProgress").removeClass("hide");
        },
        complete: function () {
            jQuery("#divAttachmentProgress").addClass("hide");
        },
        error: function (request, error) {
            var msg = LanguageResource.resMsg_FailedToLoadDocumentsInfo;
            var errorMessage = LanguageResource.resMsg_Error + msg;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    errorMessage = LanguageResource.resMsg_Error + errorMsg.Message;
            }
            ShowErrorMessage(errorMessage,true);
        }
    });
}

function GetAttachmentType(ext) {
    if (ext == "pdf" || ext == "xls" || ext == "xlsx" || ext == "doc" || ext == "docx" || ext == "txt" || ext == "xps" || ext == "ppt" || ext == "pptx") {
        return jQuery.WorkOrderNamespace.DocumentType.DOCUMENT;

    } else if (ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg") {
        return jQuery.WorkOrderNamespace.DocumentType.IMAGE;
    }
    else if (ext == "ogg" || ext == "ogv" || ext == "avi" || ext == "mpeg" || ext == "mov" || ext == "wmv" || ext == "flv" || ext == "mp4" || ext == "mpg") {
        return jQuery.WorkOrderNamespace.DocumentType.VIDEO;
    }
    return 'INVALID_FORMAT';
}

function DownloadAttachment(data) {
    workOrderViewModal.ModelErrorMsg('');
    var fileName = data.DocumentName;
    var filePath = data.DownloadPath;
    var ext = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
    var type = GetAttachmentType(ext);

    if (type == jQuery.WorkOrderNamespace.DocumentType.VIDEO && (ext == "mp4" || ext == "ogg")) {
        jQuery("#divLoadMediaContent").html("<video id='videoCtrl' width='98%' height='98%' autoplay controls><source src='" + filePath + "' type='video/" + ext + "'></video>");
        jQuery("#divVideoPhotoModal").modal('show');
        var videoCtrl = document.getElementById('videoCtrl');
        jQuery("#divVideoPhotoModal").on('hide.bs.modal', function () {
            videoCtrl.pause();
            videoCtrl.removeAttribute('src');
        });
    }
    else if (type == jQuery.WorkOrderNamespace.DocumentType.IMAGE) {
        jQuery("#divLoadMediaContent").html("<img style='width:98%;height:98%;' src='" + filePath + "' />");
        jQuery("#divLoadMediaContent>img").css("height", "");
        jQuery("#divVideoPhotoModal").modal('show');
    }
    else {
        window.location = jQuery.WorkOrderNamespace.BasePath + "/HandlerFiles/DownloadHandler.ashx?MaintenanceDocsName=" + fileName + "&MaintenanceDocsPath=" + filePath;
    }
}

var value;
function LoadEquipmentHistory(pagerData) {
    var isValid = true;
    var equipmentHistoryFilter = {};
    equipmentHistoryFilter.EquipmentID = jQuery.WorkOrderNamespace.EquipmentID;
    equipmentHistoryFilter.FromDate = 0;
    equipmentHistoryFilter.ToDate = 0;
    equipmentHistoryFilter.PageSize = pagerData.PageSize;
    equipmentHistoryFilter.PageIndex = pagerData.PageIndex;
    equipmentHistoryFilter.WorkOrderNumber = jQuery.WorkOrderNamespace.WorkOrder;

    if (jQuery.WorkOrderNamespace.IsSearch) {
        if (jQuery.trim(jQuery("#txtFromDate").val()).length > 0) {
            var parsedFromDate = jQuery.datepicker.parseDate(jQuery.WorkOrderNamespace.DateFormat, jQuery.trim(jQuery("#txtFromDate").val()));
            equipmentHistoryFilter.FromDate = parseInt(jQuery.datepicker.formatDate('yymmdd', parsedFromDate));
        }
        if (jQuery.trim(jQuery("#txtToDate").val()).length > 0) {
            var parsedToDate = jQuery.datepicker.parseDate(jQuery.WorkOrderNamespace.DateFormat, jQuery.trim(jQuery("#txtToDate").val()));
            equipmentHistoryFilter.ToDate = parseInt(jQuery.datepicker.formatDate('yymmdd', parsedToDate));
        }

        if (equipmentHistoryFilter.FromDate > 0 && equipmentHistoryFilter.ToDate > 0) {
            if (equipmentHistoryFilter.FromDate > equipmentHistoryFilter.ToDate) {
                jQuery("#spnErrorEquipment").html(LanguageResource.resMsg_EndDateIsLesserThanStartDate);
                isValid = false;
            }
        }
    }

    //Dynamic pagerdata
    var totPageHeight = jQuery(window.parent.document).height();
    var equipmentPos = jQuery("#divEquipmentHistory").offset().top;
    LocationMaxHeight = totPageHeight - equipmentPos;
    if (jQuery(window).width() < 768)
        LocationMaxHeight = 500;
    if (true) {
        value = value || Math.floor(LocationMaxHeight / 75);
        equipmentHistoryFilter.PageSize = value;
        pagerData.PageSize = value;
    }

    if (isValid) {
        jQuery.ajax({
            type: "POST",
            url: jQuery.WorkOrderNamespace.ServicePath + "/Vegam_MaintenanceService.asmx/GetWorkOrderEquipmentHistory",
            data: JSON.stringify({ pagerData: pagerData, equipmentHistoryFilter: equipmentHistoryFilter }),
            dataType: 'json',
            async: false,
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data.d != undefined) {
                    var workOrderEquipmentHistoryDetails = data.d.WorkOrderEquipmentHistoryDetails;
                    workOrderViewModal.EquipmentHistoryList.removeAll();
                    if (workOrderEquipmentHistoryDetails.WorkOrderEquipmentHistoryInfoList.length > 0) {
                        workOrderViewModal.IsEmptyEquipmentHistorylist(false);
                        jQuery.each(workOrderEquipmentHistoryDetails.WorkOrderEquipmentHistoryInfoList, function (i, obj) {
                            switch (obj.Priority) {
                                case jQuery.WorkOrderNamespace.WorkOrderPriority.Lowest:
                                    obj.WorkOrderStatusColor = "bg-yellow";
                                    break;
                                case jQuery.WorkOrderNamespace.WorkOrderPriority.Low:
                                    obj.WorkOrderStatusColor = "bg-yellow";
                                    break;
                                case jQuery.WorkOrderNamespace.WorkOrderPriority.Medium:
                                    obj.WorkOrderStatusColor = "bg-orange";
                                    break;
                                case jQuery.WorkOrderNamespace.WorkOrderPriority.High:
                                    obj.WorkOrderStatusColor = "bg-red";
                                    break;
                                case jQuery.WorkOrderNamespace.WorkOrderPriority.Highest:
                                    obj.WorkOrderStatusColor = "bg-red";
                                    break;
                            }
                            workOrderViewModal.EquipmentHistoryList.push(obj);
                        });
                        workOrderViewModal.EquipmentPagerContent(data.d.HTMLPager);
                    } else {
                        workOrderViewModal.IsEmptyEquipmentHistorylist(true);
                    }
                }
            },
            beforeSend: function () {
                jQuery("#divLoadProgressVisible").show();
                workOrderViewModal.IsEmptyEquipmentHistorylist(false);
            },
            complete: function () {
                jQuery("#divLoadProgressVisible").hide();
            },
            error: function (request, error) {
                jQuery("#divLoadProgressVisible").hide();
                if (request.responseText != "") {
                    var errorMsg = jQuery.parseJSON(request.responseText);
                    if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                        ShowErrorMessage(LanguageResource.resMsg_Error + errorMessage,true);
                    else
                        ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.FailedToLoadEquipmentHistory,true);
                }
                else {
                    ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.FailedToLoadEquipmentHistory,true);
                }
            }

        });
    }
}

function SearchEquipmentHistoryInfo() {
    if (jQuery.trim(jQuery("#txtFromDate").val()).length == 0 && jQuery.trim(jQuery("#txtToDate").val()).length == 0) {
        jQuery("#spnErrorEquipment").html(LanguageResource.resMsg_SearchCriteria);
        return false;
    }
    jQuery("#btnShowAllEquipment").removeClass('hide');
    jQuery("#spnErrorEquipment").empty();
    jQuery.WorkOrderNamespace.IsSearch = true;
    LoadEquipmentHistory(jQuery.WorkOrderNamespace.PagerData);
}

function ShowAllEquipmentHistoryInfo() {
    jQuery("#txtFromDate").val('');
    jQuery("#txtToDate").val('');
    jQuery("#spnErrorEquipment").empty();
    jQuery("#btnShowAllEquipment").addClass('hide');
    jQuery.WorkOrderNamespace.IsSearch = false;
    LoadEquipmentHistory(jQuery.WorkOrderNamespace.PagerData);
}

function LoadNewEquipentWorkOrder(workOrderNumber) {
    window.open(jQuery.WorkOrderNamespace.BasePath + '/Preventive/ViewWorkOrderInfo.aspx?id=' + jQuery.WorkOrderNamespace.BasicParam.SiteID + '&workorder=' + workOrderNumber + '', '_blank');
}

//DatePicker
function InitiateDatePicker() {
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
        dateFormat: jQuery.WorkOrderNamespace.DateFormat
    });

    jQuery("#txtFromDate").datepicker({
    });

    jQuery("#txtFromDate").keypress(function () {
        return false;
    });



    jQuery("#txtToDate").keypress(function () {
        return false;
    });
}

//Spare Parts
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

function LoadSparePartInfo() {
    var filterInfo = {};
    filterInfo.WorkOrderID = jQuery.WorkOrderNamespace.WorkOrder;
    jQuery.extend(filterInfo, jQuery.WorkOrderNamespace.BasicParam);

    jQuery.ajax({
        type: "POST",
        url: jQuery.WorkOrderNamespace.ServicePath + "/Vegam_MaintenanceService.asmx/GetWorkOrderSpareParts",
        data: JSON.stringify({ filterInfo: filterInfo }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if (json.d != null && json.d != undefined) {
                if (json.d.WorkOrderSpareParts.length > 0) {
                    workOrderViewModal.IsQuantityEditable(json.d.IsOrderInProgress);
                    workOrderViewModal.SparePartInfoList(json.d.WorkOrderSpareParts);
                }
                else {
                    var errorMessage = LanguageResource.resMsg_NoRecordFound;
                    workOrderViewModal.IsErrorVisible(true);
                    workOrderViewModal.ErrorMessage(errorMessage);
                    workOrderViewModal.ErrorClass('text-info');
                }
            }
            else {
                var errorMessage = LanguageResource.resMsg_Error + LanguageResource.resMsg_FailedToLoadSparepartInfo;
                workOrderViewModal.IsErrorVisible(true);
                workOrderViewModal.ErrorMessage(errorMessage);
                workOrderViewModal.ErrorClass('text-danger');
            }
        },
        beforeSend: function () {
            workOrderViewModal.IsErrorVisible(false);
            workOrderViewModal.ErrorMessage('');
            workOrderViewModal.ErrorClass('');
        },
        complete: function () {
        },
        error: function (request, error) {
            var errorMessage = LanguageResource.resMsg_Error + LanguageResource.resMsg_FailedToLoadSparepartInfo;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    errorMessage = LanguageResource.resMsg_Error + errorMsg.Message;
            }
            workOrderViewModal.IsErrorVisible(true);
            workOrderViewModal.ErrorMessage(errorMessage);
            workOrderViewModal.ErrorClass('text-danger');
        }
    });
}

function SaveSparePartInfo() {
    var filterInfo = {};
    filterInfo.WorkOrderID = jQuery.WorkOrderNamespace.WorkOrder;
    var sparPartList = [];
    var sparePart = {};
    jQuery.each(workOrderViewModal.SparePartInfoList(), function (index, value) {
        sparePart.MaterialNumber = value.MaterialNumber;
        sparePart.MaterialDesc = value.MaterialDesc;
        sparePart.Quantity = value.Quantity;
        sparePart.UsedQuantity = isNaN(parseFloat(value.UsedQuantity)) ? 0 : parseFloat(value.UsedQuantity);
        sparePart.UOM = value.UOM;
        sparPartList.push(sparePart);
        sparePart = {};
    });
    filterInfo.SparePartList = sparPartList;
    jQuery.extend(filterInfo, jQuery.WorkOrderNamespace.BasicParam);

    var quantityNotExists = ko.utils.arrayFirst(sparPartList, function (item) {
        return item.UsedQuantity === undefined || item.UsedQuantity === "" || isNaN(item.UsedQuantity) || item.UsedQuantity.length > 10;
    });
    if (quantityNotExists) {
        workOrderViewModal.IsErrorVisible(true);
        workOrderViewModal.ErrorMessage(LanguageResource.resMsg_PleaseEnterQuantity);
        workOrderViewModal.ErrorClass('text-danger');
    }
    else {
        jQuery.ajax({
            type: "POST",
            url: jQuery.WorkOrderNamespace.ServicePath + "/Vegam_MaintenanceService.asmx/SaveWorkOrderSparePartInfo",
            data: JSON.stringify({ filterInfo: filterInfo }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                if (json.d != null && json.d != undefined && json.d == true) {
                    var errorMessage = LanguageResource.resMsg_SparePartSaved;
                    workOrderViewModal.IsErrorVisible(true);
                    workOrderViewModal.ErrorMessage(errorMessage);
                    workOrderViewModal.ErrorClass('text-info');
                }
                else {
                    var errorMessage = LanguageResource.resMsg_Error + LanguageResource.resMsg_FailedToSaveSparepartInfo;
                    workOrderViewModal.IsErrorVisible(true);
                    workOrderViewModal.ErrorMessage(errorMessage);
                    workOrderViewModal.ErrorClass('text-danger');
                }
            },
            beforeSend: function () {
                workOrderViewModal.IsErrorVisible(false);
                workOrderViewModal.ErrorMessage('');
                workOrderViewModal.ErrorClass('');
            },
            complete: function () {
            },
            error: function (request, error) {
                var errorMessage = LanguageResource.resMsg_Error + LanguageResource.resMsg_FailedToSaveSparepartInfo;
                if (request.responseText != "") {
                    var errorMsg = jQuery.parseJSON(request.responseText);
                    if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                        errorMessage = LanguageResource.resMsg_Error + errorMsg.Message;
                }
                workOrderViewModal.IsErrorVisible(true);
                workOrderViewModal.ErrorMessage(errorMessage);
                workOrderViewModal.ErrorClass('text-danger');
            }
        });
    }
}

//Region Measuring point

function LoadMeasuringPoint() {
    if (jQuery.WorkOrderNamespace.MPIsLoadingFirstTime) {
        LoadDynamicGridBasicInfo(jQuery.WorkOrderNamespace.DynamicGridProp);
        jQuery.WorkOrderNamespace.MPIsLoadingFirstTime = false;
    }
    else {
        ReLoadGridContent();
    }

}


function BindFieldIDVariables() {
    jQuery.WorkOrderNamespace.FieldIDInfo = {};
    ko.utils.arrayForEach(dynamicGridViewModel.GridFieldList(), function (fieldInfo) {
        if (fieldInfo.FieldIdentifier != undefined && fieldInfo.FieldIdentifier.toLowerCase() == "equip_flid")
            jQuery.WorkOrderNamespace.FieldIDInfo.Equip_FLID = fieldInfo.FieldID;
        else if (fieldInfo.FieldIdentifier != undefined && fieldInfo.FieldIdentifier.toLowerCase() == "parenttype")
            jQuery.WorkOrderNamespace.FieldIDInfo.ParentType = fieldInfo.FieldID;

    });
}

function GetCustomFilters(gridContentFilter) {

    if (jQuery.WorkOrderNamespace.EquipmentID > 0)
    {
        var equip_FLIDField = {};
        equip_FLIDField.FieldID = jQuery.WorkOrderNamespace.FieldIDInfo.Equip_FLID;
        equip_FLIDField.FilterValueList = [];
        equip_FLIDField.FilterValueList.push(jQuery.WorkOrderNamespace.EquipmentID);
        gridContentFilter.GridFilteredFieldInfoValueList.push(equip_FLIDField);

        var parentTypeFilter = {};
        parentTypeFilter.FieldID = jQuery.WorkOrderNamespace.FieldIDInfo.ParentType;
        parentTypeFilter.FilterValueList = [];
        parentTypeFilter.FilterValueList.push('E');
        gridContentFilter.GridFilteredFieldInfoValueList.push(parentTypeFilter);
    }
  
}


function ManageSiteMapUrl(isEquipment) {
    if (isEquipment) {
        var equipmentListURL = jQuery.WorkOrderNamespace.BasePath + "/Preventive/EquipmentList.aspx?id=" + jQuery.WorkOrderNamespace.BasicParam.SiteID + "&isviewequipment=true";
        jQuery("#SiteMap1>span>a[href*='WorkOrderCalendar.aspx']").html(LanguageResource.resMsg_ViewEquipment).attr('href', equipmentListURL).attr('title', LanguageResource.resMsg_ViewEquipment);
        jQuery("#SiteMap1>span>a[href*='EquipmentList.aspx']").closest('span').next().next().html(LanguageResource.resMsg_EquipmentInformation);
        jQuery("#lnkAdminTab,#A1").attr("isSetDefault", "false");
        jQuery("#lnkAdminTab").attr("href", equipmentListURL); // Set herf value
        jQuery("#A1").attr("href", equipmentListURL); // Set herf value
    }
    else {
        var calendarURL = jQuery.WorkOrderNamespace.BasePath + "/Preventive/WorkOrderCalendar.aspx?id=" + jQuery.WorkOrderNamespace.BasicParam.SiteID + "&ptype=" + jQuery.WorkOrderNamespace.PageType;
        jQuery("#SiteMap1>span>a[href*='EquipmentList.aspx']").html(LanguageResource.resMsg_WorkOrdercalendar).attr('href', calendarURL).attr('title', LanguageResource.resMsg_WorkOrdercalendar);
        jQuery("#SiteMap1>span>a[href*='WorkOrderCalendar.aspx']").closest('span').next().next().html(LanguageResource.resMsg_WorkOrderInfo);
        jQuery("#lnkAdminTab,#A1").attr("isSetDefault", "false");
        jQuery("#lnkAdminTab").attr("href", calendarURL); // Set herf value
        jQuery("#A1").attr("href", calendarURL); // Set herf value
    }
}

function CollapseAll(parenticon) {
    jQuery(parenticon).toggleClass("fa-minus-circle fa-plus-circle");
    var contentDiv = jQuery('div [contentdiv="taskdiv"]');
    if (jQuery(parenticon).hasClass('fa-minus-circle')) {
        jQuery(contentDiv).prev('fieldset').find('i').addClass('fa-minus-circle').removeClass('fa-plus-circle');
        jQuery(contentDiv).removeClass('hide');
    } else {
        jQuery(contentDiv).prev('fieldset').find('i').addClass('fa-plus-circle').removeClass('fa-minus-circle');
        jQuery(contentDiv).addClass('hide');
    }
}

jQuery(document).ready(function () {
    $('.flipdiv1').find('input[type="text"]').click(function () {
        var inputelement = jQuery(this);
        Datepicker(inputelement);
    });
    jQuery(window).click(function (e) {
        var element = document.getElementsByClassName('btnflipelement');
        if (!$(e.target).hasClass('btnflipelement') && $(e.target).closest('.flipdiv1').length == 0) {
            if ($('.flipdiv1').height() > 30) {
                jQuery(".flipdiv1").toggleClass("flipdiv1animate").removeAttr('style');
                jQuery(".flipdiv2").toggleClass("flipdiv2animate");
            }
        }
    });
});

