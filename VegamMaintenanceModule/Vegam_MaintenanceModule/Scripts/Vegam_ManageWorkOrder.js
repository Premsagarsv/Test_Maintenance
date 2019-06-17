jQuery.ManageWorkOrderNameSpace = jQuery.ManageWorkOrderNameSpace || {};
jQuery.ManageWorkOrderNameSpace.PagerData = jQuery.ManageWorkOrderNameSpace.PagerData || {};
jQuery.ManageWorkOrderNameSpace.ScheduleTypeList = { 'Schedule': 'S', 'WorkOrder': 'W', 'Inspection': 'I' };
jQuery.ManageWorkOrderNameSpace.WorkOrderStatusInfo = jQuery.ManageWorkOrderNameSpace.WorkOrderStatusInfo || {};
jQuery.ManageWorkOrderNameSpace.ScheduleTime = 0;
jQuery.ManageWorkOrderNameSpace.WorkOrderStatus = { 'CREATED' :'Created' , 'SCHEDULED': 'Scheduled' ,'INPROGRESS' : 'In Progress', 'COMPLETED' : 'Completed' , 'OVERDUE' : 'OverDue', 'CANCELLED' : 'Cancelled', 'CLOSED' : 'Closed'  };
jQuery.ManageWorkOrderNameSpace.DateFormat = "";

var workGroupInfoViewModel = {
    AssigneeUserName: ko.observable(''),
    ReportToUserName: ko.observable('')
};

function LoadManageWorkOrderInfo(gridProperties, manageWorkOrderAccess, newWorkOrderHTML, editWorkOrderHTML, deleteWorkOrderHTML, basePath,dateFormat) {
    jQuery.ManageWorkOrderNameSpace.PagerData = gridProperties.PagerData;
    jQuery.ManageWorkOrderNameSpace.ManageWorkOrderAccess = manageWorkOrderAccess;
    jQuery.ManageWorkOrderNameSpace.EditWorkOrderHTML = editWorkOrderHTML;
    jQuery.ManageWorkOrderNameSpace.DeleteWorkOrderHTML = deleteWorkOrderHTML;
    jQuery.ManageWorkOrderNameSpace.BasePath = basePath;
    jQuery.ManageWorkOrderNameSpace.DateFormat = dateFormat;

    if (gridProperties.PagerData.AccessLevelID != 5)
        jQuery.DynamicGridNamespace.FeatureAdditionalInfo = 'ADMINUSER';
    else
        jQuery.DynamicGridNamespace.FeatureAdditionalInfo = 'PLANTUSER';

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
        dateFormat: jQuery.ManageWorkOrderNameSpace.DateFormat
    });


    GetWorkOrderStatusType("MAINT_WORKORDERSTATUS");
    bindDatePickerAndSelectDefaultDate();
    LoadDynamicGridBasicInfo(gridProperties);
    ManageSiteMapUrl();
    ko.applyBindings(workGroupInfoViewModel, document.getElementById('divWorkGroupInfo'));

    jQuery("#divColumnAndGroupBy").append(newWorkOrderHTML);
}

function BindFieldIDVariables() {
    jQuery.ManageWorkOrderNameSpace.FieldIDInfo = {};
    ko.utils.arrayForEach(dynamicGridViewModel.GridFieldList(), function (columnInfo) {
        if (columnInfo.FieldIdentifier != undefined) {
            if (columnInfo.FieldIdentifier.toLowerCase() == "fscheduleid")
                jQuery.ManageWorkOrderNameSpace.FieldIDInfo.ScheduleID = columnInfo.FieldID;
            else if (columnInfo.FieldIdentifier.toLowerCase() == "fwork_orderid")
                jQuery.ManageWorkOrderNameSpace.FieldIDInfo.WorkOrderID = columnInfo.FieldID;
            else if (columnInfo.FieldIdentifier.toLowerCase() == "fworkgroup")
                jQuery.ManageWorkOrderNameSpace.FieldIDInfo.WorkGroupID = columnInfo.FieldID;
            else if (columnInfo.FieldIdentifier.toLowerCase() == "fassignee")
                jQuery.ManageWorkOrderNameSpace.FieldIDInfo.AssigneeID = columnInfo.FieldID;
            else if (columnInfo.FieldIdentifier.toLowerCase() == "freportedto")
                jQuery.ManageWorkOrderNameSpace.FieldIDInfo.ReportToID = columnInfo.FieldID;
            else if (columnInfo.FieldIdentifier.toLowerCase() == "fstatuskey")
                jQuery.ManageWorkOrderNameSpace.FieldIDInfo.StatusKeyID = columnInfo.FieldID;
            else if (columnInfo.FieldIdentifier.toLowerCase() == "maint_workorderstatus")
                jQuery.ManageWorkOrderNameSpace.FieldIDInfo.WorkOrderStatusID = columnInfo.FieldID;
            else if (columnInfo.FieldIdentifier != undefined && columnInfo.FieldIdentifier.toLowerCase() == "userid")
                jQuery.ManageWorkOrderNameSpace.FieldIDInfo.UserIDFieldID = columnInfo.FieldID;
            else if (columnInfo.FieldIdentifier != undefined && columnInfo.FieldIdentifier.toLowerCase() == "scheduletype")
                jQuery.ManageWorkOrderNameSpace.FieldIDInfo.ScheduleType = columnInfo.FieldID;
            else if (columnInfo.FieldIdentifier != undefined && columnInfo.FieldIdentifier.toLowerCase() == "scheduletime")
                jQuery.ManageWorkOrderNameSpace.FieldIDInfo.ScheduleTime = columnInfo.FieldID;
            else if (columnInfo.FieldIdentifier != undefined && columnInfo.FieldIdentifier.toLowerCase() == "scheduletime_num")
                jQuery.ManageWorkOrderNameSpace.FieldIDInfo.ScheduleTimeNum = columnInfo.FieldID;
            else if (columnInfo.FieldIdentifier != undefined && columnInfo.FieldIdentifier.toLowerCase() == "scheduledate")
                jQuery.ManageWorkOrderNameSpace.FieldIDInfo.ScheduledDate = columnInfo.FieldID;
            else if (columnInfo.FieldIdentifier != undefined && columnInfo.FieldIdentifier.toLowerCase() == "planneddate")
                jQuery.ManageWorkOrderNameSpace.FieldIDInfo.PlannedDate = columnInfo.FieldID;
            else if (columnInfo.FieldIdentifier != undefined && columnInfo.FieldIdentifier.toLowerCase() == "scheduledbdate")
                jQuery.ManageWorkOrderNameSpace.FieldIDInfo.ScheduledDBDate = columnInfo.FieldID;
            else if (columnInfo.FieldIdentifier != undefined && columnInfo.FieldIdentifier.toLowerCase() == "planneddbdate")
                jQuery.ManageWorkOrderNameSpace.FieldIDInfo.PlannedDBDate = columnInfo.FieldID;
        }
    });
}

function CustomGridContentBind(rowInfo, rowIndex, columnInfo) {
    var fieldID = columnInfo.FieldID;
    var fieldIdentifier = columnInfo.FieldIdentifier;
    var content = "";

    if (fieldIdentifier.toLowerCase() == "action") {
        //var actionContent = '';
        //if (jQuery.ManageWorkOrderNameSpace.ManageWorkOrderAccess.toLowerCase() != "read_only") {
        //    actionContent = jQuery.ManageWorkOrderNameSpace.EditWorkOrderHTML;
        //    actionContent += jQuery.ManageWorkOrderNameSpace.DeleteWorkOrderHTML;
        //}

        //if (actionContent.length > 0) {
        //    content = "<div class='relative pull-xs-left'><button class='btn btn-sm btn-defult dropdown-toggle' type='button'></button>";
        //    content += "<div class='absolute col-xs-12 p-x-0 dropdown-menu hide' style='z-index: 1020; overflow-y: auto; max-height: 200px; overflow-x: hidden; min-width: 190px !important; left:42px;top:3px;'>";
        //    content += "<ul class='p-a-0' style='list-style: none;'>";
        //    content += actionContent;
        //    content += "</ul></div>";
        //    content += "</div>";
        //}
        //else {
        //    content = "<div class='relative pull-xs-left'><button class='btn btn-sm btn-defult dropdown-toggle' type='button' disabled='disabled'></button></div>";
        //}
        content += "<div class='center-align'>";
        content += jQuery.ManageWorkOrderNameSpace.EditWorkOrderHTML;
        if (rowInfo[jQuery.ManageWorkOrderNameSpace.FieldIDInfo.ScheduleType] == "S") {
            content += "<i class='fa fa-trash-o red big tiny-leftmargin tiny-rightmargin v-icon  cursor-pointer icon-muted '></i>";
        }
        else {
            content += jQuery.ManageWorkOrderNameSpace.DeleteWorkOrderHTML;
        }
        content += "</div>";
    }
    else if (fieldIdentifier.toLowerCase() == "fworkgroup") {
        var assigneeInfo = rowInfo[jQuery.ManageWorkOrderNameSpace.FieldIDInfo.AssigneeID];
        var reportToInfo = rowInfo[jQuery.ManageWorkOrderNameSpace.FieldIDInfo.ReportToID];
        if (assigneeInfo != "" || reportToInfo != "") {
            content = "<span class='pull-xs-left nowrap'><i class='fa fa-info-circle blue font-big tiny-rightmargin' data-placement='left' onmouseover='ShowWorkGroupInfo(this,\"" + assigneeInfo + "\",\"" + reportToInfo + "\");return false;' onmouseout='HideWorkGroupInfo(this);return false;'/>" + "<span>" + rowInfo[fieldID] + "</span></span>";
        }
        else {
            content = rowInfo[fieldID];
        }
    }
    else if (fieldIdentifier.toLowerCase() == "maint_workorderstatus") {
           var seletedStatus = jQuery.ManageWorkOrderNameSpace.WorkOrderStatus[rowInfo[jQuery.ManageWorkOrderNameSpace.FieldIDInfo.WorkOrderStatusID]];
           var className = GetClassForWorkOrderStatus(seletedStatus);
            var statuscolumnIndex = -1;
            jQuery("#tblDynamicGrid th").each(function (thIndex) {
                if (jQuery(this).attr("fieldid") == jQuery.ManageWorkOrderNameSpace.FieldIDInfo.WorkOrderStatusID)
                    statuscolumnIndex = thIndex;
            });
            jQuery("#tbDynamicGrid").find("tr:eq(" + rowIndex + ")").find("td:eq(" + statuscolumnIndex + ")").addClass(className);          
            content = seletedStatus;
    }
    else if (fieldIdentifier.toLowerCase() == "scheduledate") {
        var scheduleDate="";
        if (rowInfo[jQuery.ManageWorkOrderNameSpace.FieldIDInfo.ScheduledDate] != undefined && rowInfo[jQuery.ManageWorkOrderNameSpace.FieldIDInfo.ScheduledDate] != "")
            scheduleDate = rowInfo[jQuery.ManageWorkOrderNameSpace.FieldIDInfo.ScheduledDate];       
        if (rowInfo[jQuery.ManageWorkOrderNameSpace.FieldIDInfo.StatusKeyID] == jQuery.ManageWorkOrderNameSpace.WorkOrderStatusInfo["SCHEDULED"].TypeValue || rowInfo[jQuery.ManageWorkOrderNameSpace.FieldIDInfo.StatusKeyID] == jQuery.ManageWorkOrderNameSpace.WorkOrderStatusInfo["OVERDUE"].TypeValue || rowInfo[jQuery.ManageWorkOrderNameSpace.FieldIDInfo.StatusKeyID] == jQuery.ManageWorkOrderNameSpace.WorkOrderStatusInfo["CREATED"].TypeValue)
            content = "<div><i class='fa fa-pencil font-big blue tiny-leftmargin cursor-pointer tiny-rightmargin' onclick='UpdateScheduleStartDateTime(this);return false;'></i><label class='font-small m-b-0' name='scheduleDate'>" + scheduleDate + "</label></div>";
        else
            content = "<div><i class='fa fa-pencil font-big tiny-leftmargin tiny-rightmargin cursor-pointer' style='color:#9e9e9e' disabled></i><label class='font-small m-b-0' name='scheduleDate'>" + scheduleDate + "</label></div>";
    }
    else if (fieldIdentifier.toLowerCase() == "scheduletime") {
        var scheduleTime;
        if (rowInfo[jQuery.ManageWorkOrderNameSpace.FieldIDInfo.ScheduleTime] != undefined && rowInfo[jQuery.ManageWorkOrderNameSpace.FieldIDInfo.ScheduleTime] != "")
            scheduleTime = rowInfo[jQuery.ManageWorkOrderNameSpace.FieldIDInfo.ScheduleTime];
        else
            scheduleTime = ConvertIntToSiteTimeFormat('000000').toString();      
            content = "<div><label class='font-small' name='scheduletime'>" + scheduleTime + "</label></div>";
    }
    else if (fieldIdentifier.toLowerCase() == "planneddate") {
        if (parseInt(rowInfo[jQuery.ManageWorkOrderNameSpace.FieldIDInfo.PlannedDBDate]) < parseInt(rowInfo[jQuery.ManageWorkOrderNameSpace.FieldIDInfo.ScheduledDBDate])) {
            content = "<span class='red'>" + rowInfo[fieldID] + "</span>";
        }
        else {
            content = rowInfo[fieldID];
        }
    }
    else if (fieldIdentifier.toLowerCase() == "fplannedtime") {
        var scheduleTime;
        if (rowInfo[fieldID] != undefined && rowInfo[fieldID] != "")
            scheduleTime = rowInfo[fieldID];
        else
            scheduleTime = ConvertIntToSiteTimeFormat('000000').toString();
        content = "<div><label class='font-small' name='scheduletime'>" + scheduleTime + "</label></div>";
    }

    jQuery(".td-center").closest("td").addClass("center-align");
    return content;
}

function GetCustomFilters(gridContentFilter) {
    if (jQuery.DynamicGridNamespace.FeatureAdditionalInfo == 'PLANTUSER') {
        var userIDField = {};
        userIDField.FieldID = jQuery.ManageWorkOrderNameSpace.FieldIDInfo.UserIDFieldID;
        userIDField.FilterValueList = [];
        userIDField.FilterValueList.push(jQuery.ManageWorkOrderNameSpace.PagerData.UserID);
        gridContentFilter.GridFilteredFieldInfoValueList.push(userIDField);
    }
}

function AddNewWorkOrder() {
    SaveDynamicGridFilterValues();
    window.location.href = jQuery.ManageWorkOrderNameSpace.BasePath + "/Preventive/MaintenanceSchedule.aspx?id=" + jQuery.ManageWorkOrderNameSpace.PagerData.SiteID+"&isworkorder=true";
}

function EditWorkOrderInfo(editCtl) {
    SaveDynamicGridFilterValues();
    var rowInfo = ko.dataFor(jQuery(editCtl).closest("tr")[0]);
    var scheduleID = rowInfo[jQuery.ManageWorkOrderNameSpace.FieldIDInfo.ScheduleID];
    var workOrderID = rowInfo[jQuery.ManageWorkOrderNameSpace.FieldIDInfo.WorkOrderID];
    var scheduleType = rowInfo[jQuery.ManageWorkOrderNameSpace.FieldIDInfo.ScheduleType];
    window.location.href = jQuery.ManageWorkOrderNameSpace.BasePath + "/Preventive/MaintenanceSchedule.aspx?id=" + jQuery.ManageWorkOrderNameSpace.PagerData.SiteID + "&maintscheduleid=" + scheduleID + "&isworkorder=true&workorderid=" + workOrderID + "&scheduletype=" + scheduleType;
}

function DeleteWorkOrderInfoConfirm(deleteCtl) {
    var rowInfo = ko.dataFor(jQuery(deleteCtl).closest("tr")[0]);
    var scheduleID = rowInfo[jQuery.ManageWorkOrderNameSpace.FieldIDInfo.ScheduleID];

    jQuery("#alertMessage").removeClass("text-danger");
    jQuery("#alertMessage").html(languageResource.resMsg_DeleteWorkOrderConfirm);
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
                    DeleteWorkOrderInfo(scheduleID);
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

function DeleteWorkOrderInfo(scheduleID) {
    var filterInfo = {};
    filterInfo.SiteID = jQuery.ManageWorkOrderNameSpace.PagerData.SiteID;
    filterInfo.UserID = jQuery.ManageWorkOrderNameSpace.PagerData.UserID;
    filterInfo.MaintScheduleID = scheduleID;
    filterInfo.MaintScheduleType = jQuery.ManageWorkOrderNameSpace.ScheduleTypeList.WorkOrder.charCodeAt();

    jQuery.ajax({
        type: "POST",
        url: jQuery.ManageWorkOrderNameSpace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/DeleteMaintenanceInfo",
        data: JSON.stringify({ filterInfo: filterInfo }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if (json.d != undefined && json.d != null) {
                if (json.d > 0) {
                    ReLoadGridContent();
                }
                else if (json.d == -1) {
                    ShowErrorMessagePopUp(languageResource.resMsg_WorkOrderIsStartedDeleteNotPossible, true);
                }
            }
            else {
                ShowErrorMessagePopUp(languageResource.resMsg_FailedToDeleteWorkOrder, true);
            }
        },
        error: function (request, error) {
            var msg;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    msg = languageResource.resMsg_Error + errorMsg.Message;
                else
                    msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToDeleteWorkOrder;
            }
            else {
                msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToDeleteWorkOrder;
            }
            ShowErrorMessagePopUp(msg, true);
        },
    });
}

function ShowWorkGroupInfo(ctlInfo, assigneeInfo, reportToInfo) {
    workGroupInfoViewModel.AssigneeUserName(assigneeInfo);
    workGroupInfoViewModel.ReportToUserName(reportToInfo);

    jQuery('.popover').remove();
    jQuery(ctlInfo).popover({
        html: true,
        trigger: "manual",
        content: function () {
            return jQuery('.pop-content').html();
        }
    });
    jQuery(ctlInfo).popover("show");
}

function HideWorkGroupInfo(ctlInfo) {
    jQuery(ctlInfo).popover("hide");
}

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

function GetWorkOrderStatusType(enumType) {   
    var basicParam = {};
    basicParam.SiteID = jQuery.ManageWorkOrderNameSpace.PagerData.SiteID;
    basicParam.UserID = jQuery.ManageWorkOrderNameSpace.PagerData.UserID;

    jQuery.ajax({
        type: "POST",
        url: jQuery.ManageWorkOrderNameSpace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetEnumInfoList",
        data: JSON.stringify({ basicParam: basicParam, EnumType: enumType}),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data.d !== null) {
                ko.utils.arrayForEach(data.d, function (statusInfo) {
                    var statusTypeInfo = {};
                    statusTypeInfo.DisplayName = statusInfo.DisplayName;
                    statusTypeInfo.ImageName = statusInfo.ImageName;
                    statusTypeInfo.TypeValue = statusInfo.TypeValue;
                    jQuery.ManageWorkOrderNameSpace.WorkOrderStatusInfo[statusInfo.TypeValue] = statusTypeInfo;
                });
            } else {
                ShowErrorMessage(LanguageResource.resMsg_FailedToLoadWorkOrderStatusTypeInfo);
            }
        },
        error: function (request, error) {
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                    ShowErrorMessage(LanguageResource.resMsg_Error + errorMsg.Message);
                else
                    ShowErrorMessage(LanguageResource.resMsg_FailedToLoadWorkOrderStatusTypeInfo);
            }
            else {
                ShowErrorMessage(LanguageResource.resMsg_FailedToLoadWorkOrderStatusTypeInfo);
            }
        }
    });
}

function ManageSiteMapUrl() {
    var scheduleURL = jQuery.ManageWorkOrderNameSpace.BasePath + "/MaintenanceIndex.aspx?id=" + jQuery.ManageWorkOrderNameSpace.PagerData.SiteID;

    jQuery("#lnkAdminTab,#A1").attr("isSetDefault", "false");
    jQuery("#lnkAdminTab").attr("href", scheduleURL); // Set herf value
    jQuery("#A1").attr("href", scheduleURL); // Set herf value
}

function UpdateScheduleStartDateTime(ctrl) {
    var rowInfo = ko.dataFor(jQuery(ctrl).closest("tr")[0]);
    var dateInt = rowInfo[jQuery.ManageWorkOrderNameSpace.FieldIDInfo.ScheduledDate];
    var timeInt = rowInfo[jQuery.ManageWorkOrderNameSpace.FieldIDInfo.ScheduleTimeNum];
    jQuery("#spnUpdateStartTimeModalErrorMessage").text("");
    jQuery.ManageWorkOrderNameSpace.ScheduleTime = timeInt;
    jQuery("#txtScheduleTime").val(ConvertSiteDateTimeToTimePickerFormat(timeInt,false));
    jQuery("#txtScheduleDate").val(dateInt);

    jQuery("#btnUpdateStartTime").unbind("click");
    jQuery("#btnUpdateStartTime").bind("click", function () { UpdateWorkOrderScheduleTime(ctrl); return false; });
    jQuery("#divUpdateStartTimeModal").modal("show");
}

function ConvertSiteDateTimeToTimePickerFormat(timeString, isSecondsRquired) {
    timeString = ('000000' + timeString).slice(-6);
    var hour = parseInt(timeString.substr(0, 2));
    var minute = timeString.substr(2, 2);
    var seconds = timeString.substr(4, 2);
    var result = '';

    if (jQuery.ManageWorkOrderNameSpace.PagerData.PlantTimeFormat.indexOf('tt') !== -1) {
        if (hour >= 12) {
            if (hour > 12) hour -= 12;
            if (hour < 10) hour = "0" + hour;
            result = hour + ":" + minute + " PM";
        }
        else {
            if (hour == 0) hour = 12;
            if (hour < 10) hour = "0" + hour;
            result = hour + ":" + minute + " AM";
        }
    }
    else {
        if (hour < 10)
            result = "0" + hour + ":" + minute;
        else
            result = hour + ":" + minute;
    }
    if (jQuery.ManageWorkOrderNameSpace.PagerData.PlantTimeFormat.indexOf('ss') !== -1 && isSecondsRquired) {
        result = result + ":" + seconds;
    }
    return result;
}

function bindDatePickerAndSelectDefaultDate() {
    if (jQuery.ManageWorkOrderNameSpace.PagerData.PlantTimeFormat.indexOf('tt') !== -1) {
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
                jQuery.ManageWorkOrderNameSpace.ScheduleTime=ConvertTimePickerFormatToInt(time);
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
                jQuery.ManageWorkOrderNameSpace.ScheduleTime = ConvertTimePickerFormatToInt(time);
            }
        });
    }
    jQuery("#txtScheduleDate").datepicker();
    jQuery("#txtScheduleTime").keydown(function () {
        return false;
    });
}

function ConvertTimePickerFormatToInt(timeString) {
    if (timeString != undefined && timeString != "") {
        var hour = parseInt(timeString.substr(0, 2));
        var minute = timeString.substr(3, 2);
        if (jQuery.ManageWorkOrderNameSpace.PagerData.PlantTimeFormat.indexOf('tt') !== -1) {
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

function UpdateWorkOrderScheduleTime(ctrl) {
    var rowInfo = ko.dataFor(jQuery(ctrl).closest("tr")[0]);
    var workOrderID = rowInfo[jQuery.ManageWorkOrderNameSpace.FieldIDInfo.WorkOrderID];

    var selectedScheduleDate = jQuery("#txtScheduleDate").val();
    var parsedScheduleDate;
    var invalidDate = false; 
    try {
        parsedScheduleDate = jQuery.datepicker.parseDate(jQuery.ManageWorkOrderNameSpace.DateFormat, selectedScheduleDate);
    } catch (e) {
        invalidDate = true;
    }

    if (parsedScheduleDate == undefined || parsedScheduleDate == null) {
        invalidDate = true;
    }

    if (invalidDate) {
        jQuery("#spnUpdateStartTimeModalErrorMessage").text("Please enter valid date");
    } else {
        var filterInfo = {};
        filterInfo.SiteID = jQuery.ManageWorkOrderNameSpace.PagerData.SiteID;
        filterInfo.UserID = jQuery.ManageWorkOrderNameSpace.PagerData.UserID;
        filterInfo.WorkOrderID = workOrderID;
        filterInfo.ScheduleDate = parseInt(jQuery.datepicker.formatDate('yymmdd', parsedScheduleDate));
        filterInfo.ScheduleTime = jQuery.ManageWorkOrderNameSpace.ScheduleTime;
        // if (filterInfo.ScheduleTime > 0) {
        jQuery.ajax({
            type: "POST",
            url: jQuery.ManageWorkOrderNameSpace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/UpdateMaintWorkOrderScheduleDateTime",
            data: JSON.stringify({ filterInfo: filterInfo }),
            contentType: "application/json; charset=utf-8",
            datatype: 'json',
            success: function (json) {
                if (json != undefined && json.d != undefined && json.d == true) {
                    var scheduleDatecolumnIndex = -1;
                    var scheduleTimecolumnIndex = -1;
                    jQuery("#tblDynamicGrid th").each(function (thIndex) {
                        if (jQuery(this).attr("fieldid") == jQuery.ManageWorkOrderNameSpace.FieldIDInfo.ScheduledDate) {
                            scheduleDatecolumnIndex = thIndex;
                        } else if (jQuery(this).attr("fieldid") == jQuery.ManageWorkOrderNameSpace.FieldIDInfo.ScheduleTime) {
                            scheduleTimecolumnIndex = thIndex;
                        }
                    });
                    jQuery(ctrl).closest("tr").find("td:eq(" + scheduleDatecolumnIndex + ") label[name='scheduleDate']").html(selectedScheduleDate);
                    rowInfo[jQuery.ManageWorkOrderNameSpace.FieldIDInfo.ScheduledDate] = selectedScheduleDate;

                    var siteTimeString = ConvertSiteDateTimeToTimePickerFormat(filterInfo.ScheduleTime,true);
                    jQuery(ctrl).closest("tr").find("td:eq(" + scheduleTimecolumnIndex + ") label[name='scheduletime']").html(siteTimeString);
                    rowInfo[jQuery.ManageWorkOrderNameSpace.FieldIDInfo.ScheduleTime] = siteTimeString;
                    rowInfo[jQuery.ManageWorkOrderNameSpace.FieldIDInfo.ScheduleTimeNum] = filterInfo.ScheduleTime;
                    jQuery("#divUpdateStartTimeModal").modal("hide");
                }
                else {
                    jQuery("#spnUpdateStartTimeModalErrorMessage").text(languageResource.resMsg_FailedToUpdateWorkOrderScheduleTime);
                }
            },
            error: function (request, error) {
                var msg = languageResource.resMsg_FailedToUpdateWorkOrderScheduleTime;
                var errorMessage = languageResource.resMsg_Error + msg;
                if (request.responseText != "") {
                    var errorMsg = jQuery.parseJSON(request.responseText);
                    if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                        errorMessage = languageResource.resMsg_Error + errorMsg.Message;
                }
                jQuery("#spnUpdateStartTimeModalErrorMessage").text(errorMessage);
            }
        });
        // }
        //else {
        //    jQuery("#spnUpdateStartTimeModalErrorMessage").text(languageResource.resMsg_SelectWorkOrderScheduleTime);
        //}
    }
}

function ConvertIntToSiteTimeFormat(timeString) {
    timeString = ('000000' + timeString).slice(-6);
    var siteDateTimeFormat = ConvertTimeFormat(jQuery.ManageWorkOrderNameSpace.PagerData.PlantTimeFormat);
    return moment(ConvertIntToDate(20500112, timeString)).format(siteDateTimeFormat);
}

function ConvertTimeFormat(timeFormat) {
    switch (timeFormat) {
        case "hh:mm tt": return "hh:mm A";
        case "HH:mm": return "HH:mm";
        case "hh:mm:ss tt": return "hh:mm:ss A";
        case "HH:mm:ss": return "HH:mm:ss";
        default: return "HH:mm";
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
function GetClassForWorkOrderStatus(status) {
    if (status != null) {
        switch (status) {
            case jQuery.ManageWorkOrderNameSpace.WorkOrderStatus.CREATED: return 'td-blue';
            case jQuery.ManageWorkOrderNameSpace.WorkOrderStatus.SCHEDULED: return 'td-navyBlue';
            case jQuery.ManageWorkOrderNameSpace.WorkOrderStatus.INPROGRESS: return 'td-orange';
            case jQuery.ManageWorkOrderNameSpace.WorkOrderStatus.COMPLETED: return 'td-lightGreen';
            case jQuery.ManageWorkOrderNameSpace.WorkOrderStatus.OVERDUE: return 'td-red';
            case jQuery.ManageWorkOrderNameSpace.WorkOrderStatus.CANCELLED: return 'td-grey';
            case jQuery.ManageWorkOrderNameSpace.WorkOrderStatus.CLOSED: return 'td-green';
            default: return '';
        }
    }
}