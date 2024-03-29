﻿jQuery.WorkOrderDayViewCalendarNamespace = jQuery.WorkOrderDayViewCalendarNamespace || {};
jQuery.WorkOrderDayViewCalendarNamespace.FieldIDInfo = {};
jQuery.WorkOrderDayViewCalendarNamespace.UserWorkGroupInfo = {};
jQuery.WorkOrderDayViewCalendarNamespace.BasePath = '';
jQuery.WorkOrderDayViewCalendarNamespace.SiteID = 0;
jQuery.WorkOrderDayViewCalendarNamespace.ViewWorkOrderPermission = '';

function LoadDayViewBasicInfo(gridProperties, basePath, viewWorkOrderPermission) {
    jQuery.WorkOrderDayViewCalendarNamespace.BasePath = basePath;
    jQuery.WorkOrderDayViewCalendarNamespace.ViewWorkOrderPermission = viewWorkOrderPermission;
    jQuery.WorkOrderDayViewCalendarNamespace.SiteID = gridProperties.PagerData.SiteID;

    BindWorkGroupFilter();
    UserWorkGroupInfo(gridProperties.PagerData.ServicePath, gridProperties.PagerData.SiteID, gridProperties.PagerData.UserID);
    LoadDynamicGridBasicInfo(gridProperties);    
}

function BindFieldIDVariables() {
    jQuery.WorkOrderDayViewCalendarNamespace.FieldIDInfo = {};    
    ko.utils.arrayForEach(dynamicGridViewModel.GridFieldList(), function (fieldInfo) {
        if (fieldInfo.FieldIdentifier != undefined && fieldInfo.FieldIdentifier.toLowerCase() == "scheduledate")
            jQuery.WorkOrderDayViewCalendarNamespace.FieldIDInfo.ScheduleDate = fieldInfo.FieldID;
        else if (fieldInfo.FieldIdentifier != undefined && fieldInfo.FieldIdentifier.toLowerCase() == "work_orderid")
            jQuery.WorkOrderDayViewCalendarNamespace.FieldIDInfo.WorkOrderID = fieldInfo.FieldID;
        else if (fieldInfo.FieldIdentifier != undefined && fieldInfo.FieldIdentifier.toLowerCase() == "statuskey")
            jQuery.WorkOrderDayViewCalendarNamespace.FieldIDInfo.StatusKey = fieldInfo.FieldID;
        else if (fieldInfo.FieldIdentifier != undefined && fieldInfo.FieldIdentifier.toLowerCase() == "workgroupid")
            jQuery.WorkOrderDayViewCalendarNamespace.FieldIDInfo.WorkGroupID = fieldInfo.FieldID;
        else if (fieldInfo.FieldIdentifier != undefined && fieldInfo.FieldIdentifier.toLowerCase() == "assignedto")
            jQuery.WorkOrderDayViewCalendarNamespace.FieldIDInfo.AssignedToID = fieldInfo.FieldID;
        else if (fieldInfo.FieldIdentifier != undefined && fieldInfo.FieldIdentifier.toLowerCase() == "reportedto")
            jQuery.WorkOrderDayViewCalendarNamespace.FieldIDInfo.ReportedToID = fieldInfo.FieldID;        
    });
}

function CustomGridContentBind(rowInfo, rowIndex, columnInfo) {
    var fieldID = columnInfo.FieldID;
    var fieldIdentifier = columnInfo.FieldIdentifier;

    var content = "";
    if (fieldIdentifier.toLowerCase() == "planneddate") {
        if (rowInfo[jQuery.WorkOrderDayViewCalendarNamespace.FieldIDInfo.StatusKey] != undefined) {
            if (rowInfo[jQuery.WorkOrderDayViewCalendarNamespace.FieldIDInfo.StatusKey] == 'D')
                content = "<span class='red'>" + rowInfo[fieldID] + "</span>";
            else
                content = rowInfo[fieldID];
        }
        else {
            content = rowInfo[fieldID];
        }
    }
    else if (fieldIdentifier.toLowerCase() == "workgroupname") {
        var assigneeInfo = rowInfo[jQuery.WorkOrderDayViewCalendarNamespace.FieldIDInfo.AssignedToID];
        var reportToInfo = rowInfo[jQuery.WorkOrderDayViewCalendarNamespace.FieldIDInfo.ReportedToID];
        if (assigneeInfo != "" || reportToInfo != "") {
            content = rowInfo[fieldID] + " <i class='fa fa-info-circle blue font-big tiny-leftmargin' data-placement='left' onmouseover='ShowWorkGroupInfo(this,\"" + assigneeInfo + "\",\"" + reportToInfo + "\");return false;' onmouseout='HideWorkGroupInfo(this);return false;'/>";
        }
        else {
            content = rowInfo[fieldID];
        }
    }
    else if (fieldIdentifier.toLowerCase() == "actualtime") {
        if (rowInfo[fieldID] != "0")
            content = rowInfo[fieldID];
        else
            content = '';
    }
    return content;
}

function GetCustomFilters(gridContentFilter) {
    var calendarDateField = {};
    calendarDateField.FieldID = jQuery.WorkOrderDayViewCalendarNamespace.FieldIDInfo.ScheduleDate;
    calendarDateField.FilterValueList = [];
    calendarDateField.FilterValueList.push(jQuery.DynamicGridNamespace.CurrentDate);
    gridContentFilter.GridFilteredFieldInfoValueList.push(calendarDateField);
    
    var selectedWorkGroupFilter = jQuery("#drpWorkGroupFilter").val();   
    if (selectedWorkGroupFilter != "SHOWALL") {
        var workGroupFilterVal = [];
        ko.utils.arrayForEach(jQuery.WorkOrderDayViewCalendarNamespace.UserWorkGroupInfo, function (workGroupInfo, itemIndex) {
            if ((selectedWorkGroupFilter == "ASSIGNEDTOME" || selectedWorkGroupFilter == "SHOWBOTH") && workGroupInfo.UserType == "A") {
                workGroupFilterVal = workGroupInfo.WorkGroupIDList;
            }
            if ((selectedWorkGroupFilter == "REPORTEDTOME" || selectedWorkGroupFilter == "SHOWBOTH") && workGroupInfo.UserType == "R") {
                jQuery.each(workGroupInfo.WorkGroupIDList, function (index,item) {
                    workGroupFilterVal.push(item);
                });
            }
        });

        var workGroupFilterFieldInfo = {};
        workGroupFilterFieldInfo.FieldID = jQuery.WorkOrderDayViewCalendarNamespace.FieldIDInfo.WorkGroupID;
        workGroupFilterFieldInfo.FilterValueList = [];
        workGroupFilterFieldInfo.FilterValueList = workGroupFilterVal;
        gridContentFilter.GridFilteredFieldInfoValueList.push(workGroupFilterFieldInfo);
    }
}

function UserWorkGroupInfo(servicePath, siteID, userID) {
    var basicParam = {};
    basicParam.UserID = userID;
    basicParam.siteID = siteID;

    jQuery.ajax({
        type: "POST",
        url: servicePath + "/Vegam_MaintenanceService.asmx/GetUserWorkGroupInfo",
        data: JSON.stringify({ basicParam: basicParam }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (json) {
            if (json != null && json != undefined && json.d != undefined && json.d != null) {
                jQuery.WorkOrderDayViewCalendarNamespace.UserWorkGroupInfo = json.d;
            }
            else {
                ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_FailedToLoadUserWorkGroupInfo);
            }
        },
        error: function (request, error) {
            var errorMessage = LanguageResource.resMsg_Error + LanguageResource.resMsg_FailedToLoadUserWorkGroupInfo;
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

function BindWorkGroupFilter() {
    var filterHTML = "<fieldset><select id='drpWorkGroupFilter' onchange='javascript:DrpWorkGroupChangeFilter();return false;' class='form-control-sm medium-leftmargin'>";
    filterHTML = filterHTML + "<option value='SHOWALL' selected>" + LanguageResource.resMsg_ShowAll + "</option>";
    filterHTML = filterHTML + "<option value='ASSIGNEDTOME'>" + LanguageResource.resMsg_ShowOrdersAssignedToMe + "</option>";
    filterHTML = filterHTML + "<option value='REPORTEDTOME'>" + LanguageResource.resMsg_ShowOrdersReportingToMe + "</option>";
    filterHTML = filterHTML + "<option value='SHOWBOTH'>" + LanguageResource.resMsg_ShowBoth + "</option>";
    filterHTML = filterHTML + "</select></fieldset>";

    jQuery("#divDynamicGridSearch").after(filterHTML);
}

function DrpWorkGroupChangeFilter() {
    ReLoadGridContent();
}

function ViewWorkOrderInfo(rowCtl) {
    var rowInfo = ko.dataFor(rowCtl);
    if (jQuery.WorkOrderDayViewCalendarNamespace.ViewWorkOrderPermission.toLowerCase() != "no_access") {        
        var workOrder = rowInfo[jQuery.WorkOrderDayViewCalendarNamespace.FieldIDInfo.WorkOrderID];
        var queryString = "id=" + jQuery.WorkOrderDayViewCalendarNamespace.SiteID + "&workorder=" + workOrder;
        var url = jQuery.WorkOrderDayViewCalendarNamespace.BasePath + "/Preventive/ViewWorkOrderInfo.aspx?" + queryString;
        window.parent.ShowWorkOrderInfo(url);
    }
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

function ShowWorkGroupInfo(ctlInfo, assigneeInfo, reportToInfo) {
    jQuery("#tdAssignedTo").html(assigneeInfo);
    jQuery("#tdReportedTo").html(reportToInfo);
    if (assigneeInfo.length > 0)
        jQuery("#trAssignedTo").removeClass("hide");
    else
        jQuery("#trAssignedTo").addClass("hide");

    if (reportToInfo.length > 0)
        jQuery("#trReportedTo").removeClass("hide");
    else
        jQuery("#trReportedTo").addClass("hide");

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