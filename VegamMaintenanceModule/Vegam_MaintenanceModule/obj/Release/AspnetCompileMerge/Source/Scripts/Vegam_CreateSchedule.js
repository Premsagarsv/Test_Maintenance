﻿jQuery.CreateScheduleNamespace = jQuery.CreateScheduleNamespace || {};
jQuery.CreateScheduleNamespace.BasicParam = jQuery.CreateScheduleNamespace.BasicParam || {};
jQuery.CreateScheduleNamespace.ScheduleTypeList = { 'Schedule': 'S', 'WorkOrder': 'W', 'Inspection': 'I' };
jQuery.CreateScheduleNamespace.Frequency = { "Hourly": 1, "Daily": 2, "Weekly": 3, "Monthly": 4, "Yearly": 5 };
jQuery.CreateScheduleNamespace.FixedOption = { "Fixed": "1", "BasedOnLastPerformanceDate": "2" };
jQuery.CreateScheduleNamespace.EndOption = { "EndOcccurrence": "1", "EndDate": "2" };
jQuery.CreateScheduleNamespace.WeekDay = LanguageResource.WeekDay;
jQuery.CreateScheduleNamespace.MonthOption = { "MonthByDate": 1, "MonthByDay": 2 };
jQuery.CreateScheduleNamespace.MonthDay = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
jQuery.CreateScheduleNamespace.MonthPosition = LanguageResource.MonthPosition;
jQuery.CreateScheduleNamespace.YearOption = { "YearByDate": 1, "YearByDay": 2 };
jQuery.CreateScheduleNamespace.YearMonth = LanguageResource.YearMonth;
jQuery.CreateScheduleNamespace.ScheduleDetailID = 0;

var scheduleInfoViewModel = {
    Frequency: ko.observable(jQuery.CreateScheduleNamespace.Frequency.Hourly.toString()),
    IsHourly: ko.observable(true),
    IsDaily: ko.observable(false),
    IsWeekly: ko.observable(false),
    IsMonthly: ko.observable(false),
    IsYearly: ko.observable(false),
    WeekDay: ko.observableArray(ConvertObjectToKeyValuePair(jQuery.CreateScheduleNamespace.WeekDay)),
    MonthDay: ko.observableArray(ConvertObjectToKeyValuePair(jQuery.CreateScheduleNamespace.MonthDay)),
    MonthPosition: ko.observableArray(ConvertObjectToKeyValuePair(jQuery.CreateScheduleNamespace.MonthPosition)),
    YearMonth: ko.observableArray(ConvertObjectToKeyValuePair(jQuery.CreateScheduleNamespace.YearMonth)),
    YearMonth2: ko.observableArray(ConvertObjectToKeyValuePair(jQuery.CreateScheduleNamespace.YearMonth)),
    Interval: ko.observable(),
    FixedOption: ko.observable(jQuery.CreateScheduleNamespace.FixedOption.Fixed),
    EndOption: ko.observable(jQuery.CreateScheduleNamespace.EndOption.EndOcccurrence),
    EndNumOccurrence: ko.observable(),
    NotifyDay: ko.observable(),
    MonthOption: ko.observable(jQuery.CreateScheduleNamespace.MonthOption.MonthByDate.toString()),
    YearOption: ko.observable(jQuery.CreateScheduleNamespace.YearOption.YearByDate.toString()),
    SelectedMonthPosition: ko.observable(),
    SelectedWeekDayFull: ko.observable(),
    SelectedYearMonth: ko.observable(),
    MandateFixedOption: ko.observable(false)
};

scheduleInfoViewModel.Frequency.subscribe(function (newValue) {
    scheduleInfoViewModel.IsHourly(false);
    scheduleInfoViewModel.IsDaily(false);
    scheduleInfoViewModel.IsWeekly(false);
    scheduleInfoViewModel.IsMonthly(false);
    scheduleInfoViewModel.IsYearly(false);

    if (newValue == jQuery.CreateScheduleNamespace.Frequency.Hourly)
        scheduleInfoViewModel.IsHourly(true);
    else if (newValue == jQuery.CreateScheduleNamespace.Frequency.Daily)
        scheduleInfoViewModel.IsDaily(true);
    else if (newValue == jQuery.CreateScheduleNamespace.Frequency.Weekly)
        scheduleInfoViewModel.IsWeekly(true);
    else if (newValue == jQuery.CreateScheduleNamespace.Frequency.Monthly)
        scheduleInfoViewModel.IsMonthly(true);
    else if (newValue == jQuery.CreateScheduleNamespace.Frequency.Yearly)
        scheduleInfoViewModel.IsYearly(true);

    ClearScheduleInfo();
});

scheduleInfoViewModel.MandateFixedOption.subscribe(function (newValue) {
    if (newValue == true) {
        scheduleInfoViewModel.FixedOption(jQuery.CreateScheduleNamespace.FixedOption.Fixed);
    }
});

function LoadScheduleInfo(basicParam, basePath, servicePath, datePickerFormat, plantDateFormat, plantTimeFormat, scheduleType, maintScheduleID, saveControlID) {
    jQuery.CreateScheduleNamespace.BasicParam.SiteID = basicParam.SiteID;
    jQuery.CreateScheduleNamespace.BasicParam.UserID = basicParam.UserID;
    jQuery.CreateScheduleNamespace.BasicParam.AccessLevelID = basicParam.AccessLevelID;
    jQuery.CreateScheduleNamespace.Basepath = basePath;
    jQuery.CreateScheduleNamespace.ServicePath = servicePath;
    jQuery.CreateScheduleNamespace.DatePickerFormat = datePickerFormat;
    jQuery.CreateScheduleNamespace.PlantDateFormat = plantDateFormat;
    jQuery.CreateScheduleNamespace.PlantTimeFormat = plantTimeFormat;
    jQuery.CreateScheduleNamespace.ScheduleType = scheduleType;
    jQuery.CreateScheduleNamespace.MaintScheduleID = maintScheduleID;
    jQuery.CreateScheduleNamespace.SaveControlID = saveControlID;

    ko.applyBindings(scheduleInfoViewModel, document.getElementById("divScheduleInfo"));

    InitiateDatePicker();
    BindDateTimeControls("divRangeOfRecurrence");

    GetMaintScheduleInfo();
}

function ConvertObjectToKeyValuePair(obj) {
    var arr = [];
    for (let key in obj) {
        var newObj = { "Key": key, "Value": obj[key], "IsSelected": ko.observable(false) };
        newObj.IsSelected.subscribe(function (newValue) { MandateFixedOption(); });
        arr.push(newObj);
    }
    return arr;
}

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
        dateFormat: jQuery.CreateScheduleNamespace.DatePickerFormat
    });
}

function GetSiteCurrentDateTime() {
    var currentDateTime;
    jQuery.ajax({
        type: "POST",
        url: jQuery.CreateScheduleNamespace.ServicePath + "/Vegam_MaintenanceService.asmx/GetSiteCurrentDateTime",
        data: JSON.stringify({ siteID: jQuery.CreateScheduleNamespace.BasicParam.SiteID }),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (data) {
            if (data.d !== null) {
                currentDateTime = data.d;
            }
            else {
                ShowErrorMessage(LanguageResource.resMsg_FailedToLoadCurrentSiteDateTime);
            }
        },
        error: function (request, error) {
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                    ShowErrorMessage(LanguageResource.resMsg_Error + errorMsg.Message);
                else
                    ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_FailedToLoadCurrentSiteDateTime);
            }
            else {
                ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_FailedToLoadCurrentSiteDateTime);
            }
        }
    });
    return currentDateTime;
}

function BindDateTimeControls(ctrlDiv) {
    var currentDateTimeInfo = GetSiteCurrentDateTime();
    var currentDate = new Date();
    if (currentDateTimeInfo != undefined && currentDateTimeInfo != null && currentDateTimeInfo.CurrentDate != undefined && currentDateTimeInfo.CurrentDate != 0) {
        currentDate = ConvertIntToDate(currentDateTimeInfo.CurrentDate, currentDateTimeInfo.CurrentTime);
    }

    jQuery("#" + ctrlDiv).find(".datecontrol").datepicker({ minDate: currentDate });
    if (jQuery.CreateScheduleNamespace.PlantTimeFormat.indexOf('tt') !== -1) {
        jQuery("#"+ctrlDiv).find(".timecontrol").timepicker({
            minutes: {
                starts: 0,
                ends: 59,
                interval: 1
            },
            amPmText: ['AM', 'PM'],
            defaultTime: "00:00",
            showPeriod: true,
            showPeriodLabels: true,
            showMinutesLeadingZero: false
        });
    }
    else {
        jQuery("#" + ctrlDiv).find(".timecontrol").timepicker({
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

    jQuery("#" + ctrlDiv).find(".datecontrol,.timecontrol").keydown(function () {
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
        return jQuery.datepicker.formatDate('yymmdd', jQuery.datepicker.parseDate(jQuery.CreateScheduleNamespace.DatePickerFormat, dateString));
    else
        return 0;
}

function ConvertTimePickerFormatToInt(timeString) {
    if (timeString != undefined && timeString != "") {
        var hour = parseInt(timeString.substr(0, 2));
        var minute = timeString.substr(3, 2);
        if (jQuery.CreateScheduleNamespace.PlantTimeFormat.indexOf('tt') !== -1) {
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
        return jQuery.datepicker.formatDate(jQuery.CreateScheduleNamespace.DatePickerFormat, jQuery.datepicker.parseDate("yymmdd", dateString));
    }
    else
        return "";
}

function ConvertSiteDateTimeToTimePickerFormat(dateTimeInt) {
    if (dateTimeInt > 0) {
        var timeString = dateTimeInt.toString().substr(8, 6);
        var hour = parseInt(timeString.substr(0, 2));
        var minute = timeString.substr(2, 2);
        if (jQuery.CreateScheduleNamespace.PlantTimeFormat.indexOf('tt') !== -1) {
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

//save schedule info
function SaveScheduleInfo() {
    if (jQuery.CreateScheduleNamespace.MaintScheduleID > 0) {
        UpdateMaintScheduleInfo();
    }
}

function UpdateMaintScheduleInfo() {
    var schdDetailInfo = {};
    schdDetailInfo.SiteID = jQuery.CreateScheduleNamespace.BasicParam.SiteID;
    schdDetailInfo.UserID = jQuery.CreateScheduleNamespace.BasicParam.UserID;
    schdDetailInfo.ScheduleID = jQuery.CreateScheduleNamespace.MaintScheduleID;
    schdDetailInfo.ScheduleDetailID = jQuery.CreateScheduleNamespace.ScheduleDetailID;

    var frequency = jQuery.CreateScheduleNamespace.Frequency.Daily;
    if (scheduleInfoViewModel.IsHourly())
        frequency = jQuery.CreateScheduleNamespace.Frequency.Hourly;
    else if (scheduleInfoViewModel.IsDaily())
        frequency = jQuery.CreateScheduleNamespace.Frequency.Daily;
    else if (scheduleInfoViewModel.IsWeekly())
        frequency = jQuery.CreateScheduleNamespace.Frequency.Weekly;
    else if (scheduleInfoViewModel.IsMonthly())
        frequency = jQuery.CreateScheduleNamespace.Frequency.Monthly;
    else if (scheduleInfoViewModel.IsYearly())
        frequency = jQuery.CreateScheduleNamespace.Frequency.Yearly;

    schdDetailInfo.Frequency = frequency;
    schdDetailInfo.Interval = scheduleInfoViewModel.Interval();
    schdDetailInfo.BasedOnLastPerformanceDate = scheduleInfoViewModel.FixedOption() == jQuery.CreateScheduleNamespace.FixedOption.BasedOnLastPerformanceDate;
    schdDetailInfo.StartDate = ConvertDatePickerFormatToInt(jQuery("#txtStartDate").val());
    schdDetailInfo.StartTime = ConvertTimePickerFormatToInt(jQuery("#txtStartTime").val());

    if (scheduleInfoViewModel.EndOption() == jQuery.CreateScheduleNamespace.EndOption.EndOcccurrence)
        schdDetailInfo.EndNumOccurrence = scheduleInfoViewModel.EndNumOccurrence();
    else
        schdDetailInfo.EndDate = ConvertDatePickerFormatToInt(jQuery("#txtEndDate").val());

    if (scheduleInfoViewModel.NotifyDay() != "")
        schdDetailInfo.NotifyDay = scheduleInfoViewModel.NotifyDay();
    else
        schdDetailInfo.NotifyDay = 0;

    var errorMessage = "";
    if (schdDetailInfo.Interval == 0 || schdDetailInfo.Interval == undefined) {
        errorMessage += LanguageResource.resMsg_EnterOccurrence + "<br/>";
    }
    if (schdDetailInfo.StartDate == 0) {
        errorMessage += LanguageResource.resMsg_SelectStartDate + "<br/>";
    }

    if (scheduleInfoViewModel.EndOption() == jQuery.CreateScheduleNamespace.EndOption.EndOcccurrence) {
        if (schdDetailInfo.EndNumOccurrence == 0 || schdDetailInfo.EndNumOccurrence == undefined)
            errorMessage += LanguageResource.resMsg_EnterEndOccurrence + "<br/>";
    }
    else {
        if (schdDetailInfo.EndDate == 0)
            errorMessage += LanguageResource.resMsg_SelectEndDate + "<br/>";
    }

    schdDetailInfo.WeekDay = [];
    schdDetailInfo.MonthDay = [];
    schdDetailInfo.MonthPosition = [];
    schdDetailInfo.YearMonth = [];

    if (schdDetailInfo.Frequency == jQuery.CreateScheduleNamespace.Frequency.Weekly) {
        ko.utils.arrayForEach(scheduleInfoViewModel.WeekDay(), function (item) {
            if (item.IsSelected())
                schdDetailInfo.WeekDay.push(item.Key);
        });
    }
    else if (schdDetailInfo.Frequency == jQuery.CreateScheduleNamespace.Frequency.Monthly) {
        if (scheduleInfoViewModel.MonthOption() == jQuery.CreateScheduleNamespace.MonthOption.MonthByDate) {
            schdDetailInfo.MonthOption = jQuery.CreateScheduleNamespace.MonthOption.MonthByDate;
            ko.utils.arrayForEach(scheduleInfoViewModel.MonthDay(), function (item) {
                if (item.IsSelected())
                    schdDetailInfo.MonthDay.push(item.Value);
            });
        }
        else {
            schdDetailInfo.MonthOption = jQuery.CreateScheduleNamespace.MonthOption.MonthByDay;
            ko.utils.arrayForEach(scheduleInfoViewModel.MonthPosition(), function (item) {
                if (item.IsSelected())
                    schdDetailInfo.MonthPosition.push(item.Key);
            });
            ko.utils.arrayForEach(scheduleInfoViewModel.WeekDay(), function (item) {
                if (item.IsSelected())
                    schdDetailInfo.WeekDay.push(item.Key);
            });

            //validate month by day
            if (schdDetailInfo.MonthPosition.length > 0 || schdDetailInfo.WeekDay.length > 0) {
                if (schdDetailInfo.MonthPosition.length == 0) {
                    errorMessage += LanguageResource.resMsg_SelectMonthPosition + "<br/>";
                }
                else if (schdDetailInfo.WeekDay.length == 0) {
                    errorMessage += LanguageResource.resMsg_SelectWeekDay + "<br/>";
                }
            }
        }
    }
    else if (schdDetailInfo.Frequency == jQuery.CreateScheduleNamespace.Frequency.Yearly) {
        if (scheduleInfoViewModel.YearOption() == jQuery.CreateScheduleNamespace.YearOption.YearByDate) {
            schdDetailInfo.YearOption = jQuery.CreateScheduleNamespace.YearOption.YearByDate;
            ko.utils.arrayForEach(scheduleInfoViewModel.YearMonth(), function (item) {
                if (item.IsSelected())
                    schdDetailInfo.YearMonth.push(item.Key);
            });
            ko.utils.arrayForEach(scheduleInfoViewModel.MonthDay(), function (item) {
                if (item.IsSelected())
                    schdDetailInfo.MonthDay.push(item.Value);
            });

            //validate year by date
            if (schdDetailInfo.YearMonth.length > 0 || schdDetailInfo.MonthDay.length > 0) {
                if (schdDetailInfo.YearMonth.length == 0) {
                    errorMessage += LanguageResource.resMsg_SelectMonth + "<br/>";
                }
                else if (schdDetailInfo.MonthDay.length == 0) {
                    errorMessage += LanguageResource.resMsg_SelectMonthDay + "<br/>";
                }
            }
        }
        else {
            schdDetailInfo.YearOption = jQuery.CreateScheduleNamespace.YearOption.YearByDay;
            ko.utils.arrayForEach(scheduleInfoViewModel.MonthPosition(), function (item) {
                if (item.IsSelected())
                    schdDetailInfo.MonthPosition.push(item.Key);
            });
            ko.utils.arrayForEach(scheduleInfoViewModel.WeekDay(), function (item) {
                if (item.IsSelected())
                    schdDetailInfo.WeekDay.push(item.Key);
            });
            ko.utils.arrayForEach(scheduleInfoViewModel.YearMonth2(), function (item) {
                if (item.IsSelected())
                    schdDetailInfo.YearMonth.push(item.Key);
            });

            //validate year by day
            if (schdDetailInfo.MonthPosition.length > 0 || schdDetailInfo.WeekDay.length > 0 || schdDetailInfo.YearMonth.length > 0) {
                if (schdDetailInfo.MonthPosition.length == 0) {
                    errorMessage += LanguageResource.resMsg_SelectMonthPosition + "<br/>";
                }
                if (schdDetailInfo.WeekDay.length == 0) {
                    errorMessage += LanguageResource.resMsg_SelectWeekDay + "<br/>";
                }
                if (schdDetailInfo.YearMonth.length == 0) {
                    errorMessage += LanguageResource.resMsg_SelectMonth + "<br/>";
                }
            }
        }
    }

    var isValid = true;
    if (errorMessage != "")
        isValid = false;

    if (isValid) {
        jQuery.ajax({
            type: "POST",
            url: jQuery.CreateScheduleNamespace.ServicePath + "/Vegam_MaintenanceService.asmx/InsertUpdateMaintenanceScheduleDetailInfo",
            data: JSON.stringify({ schdDetailInfo: schdDetailInfo }),
            contentType: "application/json; charset=utf-8",
            datatype: 'json',
            success: function (json) {
                if (json != undefined && json.d != undefined && json.d > 0) {
                    jQuery.CreateScheduleNamespace.ScheduleDetailID = json.d;
                    ShowErrorMessageSpan(LanguageResource.resMsg_SuccessfullyUpdatedScheduleInfo, true);
                    jQuery("#" + jQuery.CreateScheduleNamespace.SaveControlID).text(LanguageResource.resMsg_Update);
                }
                else {
                    ShowErrorMessageSpan(LanguageResource.resMsg_FailedToUpdateScheduleInfo);
                }
            },
            error: function (request, error) {
                var errorMessage = LanguageResource.resMsg_Error + LanguageResource.resMsg_FailedToUpdateScheduleInfo;
                if (request.responseText != "") {
                    var errorMsg = jQuery.parseJSON(request.responseText);
                    if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                        errorMessage = LanguageResource.resMsg_Error + errorMsg.Message;
                }
                ShowErrorMessageSpan(errorMessage);
            }
        });
    }
    else {
        ShowErrorMessageSpan(errorMessage);
    }
}

//get schedule info
function GetMaintScheduleInfo() {
    var filterInfo = {};
    filterInfo.SiteID = jQuery.CreateScheduleNamespace.BasicParam.SiteID;
    filterInfo.UserID = jQuery.CreateScheduleNamespace.BasicParam.UserID;
    filterInfo.MaintScheduleID = jQuery.CreateScheduleNamespace.MaintScheduleID;
    filterInfo.ScheduleType = jQuery.CreateScheduleNamespace.ScheduleTypeList.Schedule.charCodeAt();

    jQuery.ajax({
        type: "POST",
        url: jQuery.CreateScheduleNamespace.ServicePath + "/Vegam_MaintenanceService.asmx/GetMaintScheduleDetailInfo",
        data: JSON.stringify({ filterInfo: filterInfo }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        success: function (json) {
            if (json != undefined && json != null && json.d != undefined && json.d != null) {
                if (json.d.ScheduleDetailID > 0) {
                    jQuery.CreateScheduleNamespace.ScheduleInfo = json.d;
                    jQuery.CreateScheduleNamespace.ScheduleDetailID = json.d.ScheduleDetailID;
                    BindScheduleInfo(json.d);
                    jQuery("#" + jQuery.CreateScheduleNamespace.SaveControlID).text(LanguageResource.resMsg_Update);
                }
            }
            else {
                ShowErrorMessage(LanguageResource.resMsg_FailedToGetScheduleInfo);
            }
        },
        error: function (request, error) {
            var errorMessage = LanguageResource.resMsg_Error + LanguageResource.resMsg_FailedToGetScheduleInfo;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    errorMessage = LanguageResource.resMsg_Error + errorMsg.Message;
            }
            ShowErrorMessage(errorMessage);
        }
    });
}

function ClearScheduleInfo() {
    jQuery("#spnErrorMessage").html("");
    scheduleInfoViewModel.Interval("");
    scheduleInfoViewModel.FixedOption(jQuery.CreateScheduleNamespace.FixedOption.Fixed);
    jQuery("#txtStartDate").val("");
    jQuery("#txtStartTime").val("");
    jQuery("txtEndDate").val("");
    scheduleInfoViewModel.EndOption(jQuery.CreateScheduleNamespace.EndOption.EndOcccurrence);
    scheduleInfoViewModel.EndNumOccurrence("");
    scheduleInfoViewModel.NotifyDay("");
    scheduleInfoViewModel.MonthOption(jQuery.CreateScheduleNamespace.MonthOption.MonthByDate.toString());
    scheduleInfoViewModel.YearOption(jQuery.CreateScheduleNamespace.YearOption.YearByDate.toString());
    scheduleInfoViewModel.MandateFixedOption(false);

    ko.utils.arrayForEach(scheduleInfoViewModel.WeekDay(), function (item) {
        item.IsSelected(false);
    });
    ko.utils.arrayForEach(scheduleInfoViewModel.MonthDay(), function (item) {
        item.IsSelected(false);
    });
    ko.utils.arrayForEach(scheduleInfoViewModel.MonthPosition(), function (item) {
        item.IsSelected(false);
    });
    ko.utils.arrayForEach(scheduleInfoViewModel.YearMonth(), function (item) {
        item.IsSelected(false);
    });
    ko.utils.arrayForEach(scheduleInfoViewModel.YearMonth2(), function (item) {
        item.IsSelected(false);
    });

    if (jQuery.CreateScheduleNamespace.ScheduleDetailID > 0) {
        if (scheduleInfoViewModel.Frequency() == jQuery.CreateScheduleNamespace.ScheduleInfo.Frequency) {
            BindScheduleInfo(jQuery.CreateScheduleNamespace.ScheduleInfo);
        }
    }
}

function BindScheduleInfo(schdInfo) {
    scheduleInfoViewModel.Frequency(schdInfo.Frequency.toString());

    scheduleInfoViewModel.Interval(schdInfo.Interval);
    if (schdInfo.BasedOnLastPerformanceDate)
        scheduleInfoViewModel.FixedOption(jQuery.CreateScheduleNamespace.FixedOption.BasedOnLastPerformanceDate);

    var startDateTimeString = ConvertIntToDateTimeString(schdInfo.StartDate, schdInfo.StartTime);
    jQuery("#txtStartDate").val(ConvertSiteDateTimeToDatePickerFormat(startDateTimeString));
    jQuery("#txtStartTime").val(ConvertSiteDateTimeToTimePickerFormat(startDateTimeString));

    if (schdInfo.EndNumOccurrence > 0) {
        scheduleInfoViewModel.EndOption(jQuery.CreateScheduleNamespace.EndOption.EndOcccurrence);
        scheduleInfoViewModel.EndNumOccurrence(schdInfo.EndNumOccurrence);
    }
    else {
        scheduleInfoViewModel.EndOption(jQuery.CreateScheduleNamespace.EndOption.EndDate);
        jQuery("#txtEndDate").val(ConvertSiteDateTimeToDatePickerFormat(ConvertIntToDateTimeString(schdInfo.EndDate, 0)));
    }

    if (schdInfo.NotifyDay > 0)
        scheduleInfoViewModel.NotifyDay(schdInfo.NotifyDay);
    else
        scheduleInfoViewModel.NotifyDay("");

    if (schdInfo.MonthOption > 0)
        scheduleInfoViewModel.MonthOption(schdInfo.MonthOption.toString());

    if (schdInfo.YearOption > 0)
        scheduleInfoViewModel.YearOption(schdInfo.YearOption.toString());

    if (schdInfo.Frequency == jQuery.CreateScheduleNamespace.Frequency.Weekly) {
        ko.utils.arrayForEach(schdInfo.WeekDay, function (item) {
            var selItem = ko.utils.arrayFirst(scheduleInfoViewModel.WeekDay(), function (info) { return info.Key == item; });
            if (selItem)
                selItem.IsSelected(true);
        });
    }
    else if (schdInfo.Frequency == jQuery.CreateScheduleNamespace.Frequency.Monthly) {
        ko.utils.arrayForEach(schdInfo.WeekDay, function (item) {
            var selItem = ko.utils.arrayFirst(scheduleInfoViewModel.WeekDay(), function (info) { return info.Key == item; });
            if (selItem)
                selItem.IsSelected(true);
        });
        ko.utils.arrayForEach(schdInfo.MonthPosition, function (item) {
            var selItem = ko.utils.arrayFirst(scheduleInfoViewModel.MonthPosition(), function (info) { return info.Key == item; });
            if (selItem)
                selItem.IsSelected(true);
        });
        ko.utils.arrayForEach(schdInfo.MonthDay, function (item) {
            var selItem = ko.utils.arrayFirst(scheduleInfoViewModel.MonthDay(), function (info) { return info.Value == item; });
            if (selItem)
                selItem.IsSelected(true);
        });
    }
    else if (schdInfo.Frequency == jQuery.CreateScheduleNamespace.Frequency.Yearly) {
        ko.utils.arrayForEach(schdInfo.WeekDay, function (item) {
            var selItem = ko.utils.arrayFirst(scheduleInfoViewModel.WeekDay(), function (info) { return info.Key == item; });
            if (selItem)
                selItem.IsSelected(true);
        });
        ko.utils.arrayForEach(schdInfo.MonthPosition, function (item) {
            var selItem = ko.utils.arrayFirst(scheduleInfoViewModel.MonthPosition(), function (info) { return info.Key == item; });
            if (selItem)
                selItem.IsSelected(true);
        });
        ko.utils.arrayForEach(schdInfo.MonthDay, function (item) {
            var selItem = ko.utils.arrayFirst(scheduleInfoViewModel.MonthDay(), function (info) { return info.Value == item; });
            if (selItem)
                selItem.IsSelected(true);
        });

        if (schdInfo.YearOption == jQuery.CreateScheduleNamespace.YearOption.YearByDate) {
            ko.utils.arrayForEach(schdInfo.YearMonth, function (item) {
                var selItem = ko.utils.arrayFirst(scheduleInfoViewModel.YearMonth(), function (info) { return info.Key == item; });
                if (selItem)
                    selItem.IsSelected(true);
            });
        }
        else {
            ko.utils.arrayForEach(schdInfo.YearMonth, function (item) {
                var selItem = ko.utils.arrayFirst(scheduleInfoViewModel.YearMonth2(), function (info) { return info.Key == item; });
                if (selItem)
                    selItem.IsSelected(true);
            });
        }
    }

    MandateFixedOption();
}

//show error message info
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

function ShowErrorMessageSpan(message, success) {
    if (success)
        jQuery("#spnErrorMessage").html(message).removeClass('red').addClass("blue");
    else
        jQuery("#spnErrorMessage").html(message).removeClass('blue').addClass("red");
}



function OnMultiSelectButton(data) {
    if (data.IsSelected())
        data.IsSelected(false);
    else
        data.IsSelected(true);
}

function MandateFixedOption() {
    var selectedItemExists = false;
    if (scheduleInfoViewModel.Frequency() == jQuery.CreateScheduleNamespace.Frequency.Weekly) {
        var firstItem = ko.utils.arrayFirst(scheduleInfoViewModel.WeekDay(), function (item) { return item.IsSelected() == true; });
        if (firstItem != null && firstItem != undefined)
            selectedItemExists = true;
    }
    else if (scheduleInfoViewModel.Frequency() == jQuery.CreateScheduleNamespace.Frequency.Monthly) {
        if (scheduleInfoViewModel.MonthOption() == jQuery.CreateScheduleNamespace.MonthOption.MonthByDate) {
            var firstItem = ko.utils.arrayFirst(scheduleInfoViewModel.MonthDay(), function (item) { return item.IsSelected() == true; });
            if (firstItem != null && firstItem != undefined)
                selectedItemExists = true;
        }
        else {
            var firstItem = ko.utils.arrayFirst(scheduleInfoViewModel.MonthPosition(), function (item) { return item.IsSelected() == true; });
            if (firstItem != null && firstItem != undefined)
                selectedItemExists = true;

            if (selectedItemExists == false) {
                firstItem = ko.utils.arrayFirst(scheduleInfoViewModel.WeekDay(), function (item) { return item.IsSelected() == true; });
                if (firstItem != null && firstItem != undefined)
                    selectedItemExists = true;
            }
        }
    }
    else if (scheduleInfoViewModel.Frequency() == jQuery.CreateScheduleNamespace.Frequency.Yearly) {
        if (scheduleInfoViewModel.YearOption() == jQuery.CreateScheduleNamespace.YearOption.YearByDate) {
            var firstItem = ko.utils.arrayFirst(scheduleInfoViewModel.YearMonth(), function (item) { return item.IsSelected() == true; });
            if (firstItem != null && firstItem != undefined)
                selectedItemExists = true;

            if (selectedItemExists == false) {
                firstItem = ko.utils.arrayFirst(scheduleInfoViewModel.MonthDay(), function (item) { return item.IsSelected() == true; });
                if (firstItem != null && firstItem != undefined)
                    selectedItemExists = true;
            }
        }
        else {
            var firstItem = ko.utils.arrayFirst(scheduleInfoViewModel.YearMonth2(), function (item) { return item.IsSelected() == true; });
            if (firstItem != null && firstItem != undefined)
                selectedItemExists = true;

            if (selectedItemExists == false) {
                var firstItem = ko.utils.arrayFirst(scheduleInfoViewModel.MonthPosition(), function (item) { return item.IsSelected() == true; });
                if (firstItem != null && firstItem != undefined)
                    selectedItemExists = true;
            }
            if (selectedItemExists == false) {
                var firstItem = ko.utils.arrayFirst(scheduleInfoViewModel.WeekDay(), function (item) { return item.IsSelected() == true; });
                if (firstItem != null && firstItem != undefined)
                    selectedItemExists = true;
            }
        }
    }

    if (selectedItemExists == true) {
        scheduleInfoViewModel.MandateFixedOption(true);
    }
    else {
        scheduleInfoViewModel.MandateFixedOption(false);
    }
}