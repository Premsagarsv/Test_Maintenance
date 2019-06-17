jQuery.WorkOrderOrderViewCalendarNamespace = jQuery.WorkOrderOrderViewCalendarNamespace || {};
jQuery.WorkOrderOrderViewCalendarNamespace.FieldIDInfo = {};
jQuery.WorkOrderOrderViewCalendarNamespace.HeaderStatusInfo = {};
jQuery.WorkOrderOrderViewCalendarNamespace.BasePath = '';
jQuery.WorkOrderOrderViewCalendarNamespace.SiteID = 0;
jQuery.WorkOrderOrderViewCalendarNamespace.UserID = 0;

function LoadOrderViewBasicInfo(gridProperties, basePath) {
    jQuery.WorkOrderOrderViewCalendarNamespace.BasePath = basePath;
    jQuery.WorkOrderOrderViewCalendarNamespace.SiteID = gridProperties.PagerData.SiteID;
    jQuery.WorkOrderOrderViewCalendarNamespace.UserID = gridProperties.PagerData.UserID;

    if (gridProperties.PagerData.AccessLevelID != 5)
        jQuery.DynamicGridNamespace.FeatureAdditionalInfo = 'ADMINUSER';
    else
        jQuery.DynamicGridNamespace.FeatureAdditionalInfo = 'PLANTUSER';

    GetHeaderStatusType(gridProperties.PagerData.ServicePath, gridProperties.PagerData.SiteID, gridProperties.PagerData.UserID);
    LoadDynamicGridBasicInfo(gridProperties);
}

function BindFieldIDVariables() {
    jQuery.WorkOrderOrderViewCalendarNamespace.FieldIDInfo = {};
    ko.utils.arrayForEach(dynamicGridViewModel.GridFieldList(), function (fieldInfo) {
        if (fieldInfo.FieldIdentifier != undefined && fieldInfo.FieldIdentifier.toLowerCase() == "work_orderid")
            jQuery.WorkOrderOrderViewCalendarNamespace.FieldIDInfo.WorkOrderID = fieldInfo.FieldID;      
        else if (fieldInfo.FieldIdentifier != undefined && fieldInfo.FieldIdentifier.toLowerCase() == "assignedto")
            jQuery.WorkOrderOrderViewCalendarNamespace.FieldIDInfo.AssignedToID = fieldInfo.FieldID;
        else if (fieldInfo.FieldIdentifier != undefined && fieldInfo.FieldIdentifier.toLowerCase() == "reportedto")
            jQuery.WorkOrderOrderViewCalendarNamespace.FieldIDInfo.ReportedToID = fieldInfo.FieldID;
        else if (fieldInfo.FieldIdentifier != undefined && fieldInfo.FieldIdentifier.toLowerCase() == "statuskey")
            jQuery.WorkOrderOrderViewCalendarNamespace.FieldIDInfo.StatusKeyID = fieldInfo.FieldID;  
        else if (fieldInfo.FieldIdentifier != undefined && fieldInfo.FieldIdentifier.toLowerCase() == "userid")
            jQuery.WorkOrderOrderViewCalendarNamespace.FieldIDInfo.UserIDFieldID = fieldInfo.FieldID;
        else if (fieldInfo.FieldIdentifier != undefined && fieldInfo.FieldIdentifier.toLowerCase() == "orderscheduledate")
            jQuery.WorkOrderOrderViewCalendarNamespace.FieldIDInfo.ScheduleDate = fieldInfo.FieldID;
        else if (fieldInfo.FieldIdentifier != undefined && fieldInfo.FieldIdentifier.toLowerCase() == "duedate")
            jQuery.WorkOrderOrderViewCalendarNamespace.FieldIDInfo.DueDate = fieldInfo.FieldID;
    });
}

function CustomGridContentBind(rowInfo, rowIndex, columnInfo) {
    var fieldID = columnInfo.FieldID;
    var fieldIdentifier = columnInfo.FieldIdentifier;

    var content = "";
    if (fieldIdentifier.toLowerCase() == "planneddate") {
        //if (rowInfo[jQuery.WorkOrderOrderViewCalendarNamespace.FieldIDInfo.StatusKeyID] != undefined) { 
        //    if (rowInfo[jQuery.WorkOrderOrderViewCalendarNamespace.FieldIDInfo.StatusKeyID]=='D')
        //        content = "<span class='red'>" + rowInfo[fieldID] + "</span>";
        //    else
        //        content = rowInfo[fieldID];
        //}
        if (rowInfo[jQuery.WorkOrderOrderViewCalendarNamespace.FieldIDInfo.ScheduleDate] > rowInfo[jQuery.WorkOrderOrderViewCalendarNamespace.FieldIDInfo.DueDate]) {
            content = "<span class='red'>" + rowInfo[fieldID] + "</span>";
        }
        else {
            content = rowInfo[fieldID];
        }
    }
    else if (fieldIdentifier.toLowerCase() == "workgroupname") {
        var assigneeInfo = rowInfo[jQuery.WorkOrderOrderViewCalendarNamespace.FieldIDInfo.AssignedToID];
        var reportToInfo = rowInfo[jQuery.WorkOrderOrderViewCalendarNamespace.FieldIDInfo.ReportedToID];
        if (assigneeInfo != "" || reportToInfo != "") {
            content = "<span class='pull-xs-left nowrap'><i class='fa fa-info-circle blue font-big tiny-rightmargin' data-placement='left' onmouseover='ShowWorkGroupInfo(this,\"" + assigneeInfo + "\",\"" + reportToInfo + "\");return false;' onmouseout='HideWorkGroupInfo(this);return false;'/>" + "<span>" + rowInfo[fieldID] + "</span></span>";                        
        }
        else {
            content = rowInfo[fieldID];
        }
    }
    else if (fieldIdentifier.toLowerCase() == "maint_calendar_workorderstatus") {
        var status = rowInfo[jQuery.WorkOrderOrderViewCalendarNamespace.FieldIDInfo.StatusKeyID];
        var statusDisplayName = jQuery.WorkOrderOrderViewCalendarNamespace.HeaderStatusInfo[status] == undefined ? '' : jQuery.WorkOrderOrderViewCalendarNamespace.HeaderStatusInfo[status].DisplayName;
        var statusImage = jQuery.WorkOrderOrderViewCalendarNamespace.HeaderStatusInfo[status] == undefined ? '' : jQuery.WorkOrderOrderViewCalendarNamespace.HeaderStatusInfo[status].ImageName;
        content = "<div class='pover center-align' data-placement='top'  data-content='" + statusDisplayName + "'>" + rowInfo[fieldID] + "</div>";
    }
    else if (fieldIdentifier.toLowerCase() == "actualtime") {
        if (rowInfo[fieldID] != "0")
            content = rowInfo[fieldID];
        else
            content = '';
    }
    else if (fieldIdentifier.toLowerCase() == "workorder") {
        var workOrderID = rowInfo[jQuery.WorkOrderOrderViewCalendarNamespace.FieldIDInfo.WorkOrderID];
        var workOrder = rowInfo[fieldID];
        content += "<a onclick='javascript:ViewWorkOrderInfo(\"" + workOrderID + "\");'>" + workOrder + "</a>";
    }
    return content;
}

function GetCustomFilters(gridContentFilter) {
    if (jQuery.DynamicGridNamespace.FeatureAdditionalInfo == 'PLANTUSER') {
        var userIDField = {};
        userIDField.FieldID = jQuery.WorkOrderOrderViewCalendarNamespace.FieldIDInfo.UserIDFieldID;
        userIDField.FilterValueList = [];
        userIDField.FilterValueList.push(jQuery.WorkOrderOrderViewCalendarNamespace.UserID);
        gridContentFilter.GridFilteredFieldInfoValueList.push(userIDField);
    }
}

function ShowWorkGroupInfo(ctlInfo, assigneeInfo, reportToInfo) {
    jQuery("#tdAssignedTo").html(assigneeInfo);
    jQuery("#tdReportedTo").html(reportToInfo);

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

function ViewWorkOrderInfo(workOrder) {
    var queryString = "id=" + jQuery.WorkOrderOrderViewCalendarNamespace.SiteID + "&workorder=" + workOrder;
    var url = jQuery.WorkOrderOrderViewCalendarNamespace.BasePath + "/Preventive/ViewWorkOrderInfo.aspx?" + queryString + "&ptype=O";
    window.parent.ShowWorkOrderInfo(url);
}

function HideWorkGroupInfo(ctlInfo) {
    jQuery(ctlInfo).popover("hide");
}

function GetHeaderStatusType(servicePath, siteID, userID) {
    var basicParam = {};
    basicParam.SiteID = siteID;
    basicParam.UserID = userID;

    jQuery.ajax({
        type: "POST",
        url: servicePath + "/Vegam_MaintenanceService.asmx/GetEnumInfoList",
        data: JSON.stringify({ basicParam: basicParam, EnumType: "MAINT_WORKORDERSTATUS" }),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data.d !== null) {
                ko.utils.arrayForEach(data.d, function (statusInfo) {
                    var statusTypeInfo = {};
                    statusTypeInfo.DisplayName = statusInfo.DisplayName;
                    statusTypeInfo.ImageName = statusInfo.ImageName;
                    statusTypeInfo.TypeValue = statusInfo.TypeValue;
                    jQuery.WorkOrderOrderViewCalendarNamespace.HeaderStatusInfo[statusInfo.TypeValue] = statusTypeInfo;
                });
            } else {
                ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_FailedToLoadStatusInfo);
            }
        },
        error: function (request, error) {
            var errorMessage = LanguageResource.resMsg_FailedToLoadStatusInfo;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                    errorMessage = error.Message
            }
            ShowErrorMessage(LanguageResource.resMsg_Error + errorMessage);
        }
    });
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