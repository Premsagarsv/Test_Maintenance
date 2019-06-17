jQuery.NotificationInfoListNameSpace = jQuery.NotificationInfoListNameSpace || {};
jQuery.NotificationInfoListNameSpace.BasicParam = jQuery.NotificationInfoListNameSpace.BasicParam || {};
jQuery.NotificationInfoListNameSpace.PagerData = jQuery.NotificationInfoListNameSpace.PagerData || {};
jQuery.NotificationInfoListNameSpace.FieldIDInfo = jQuery.NotificationInfoListNameSpace.FieldIDInfo || {};
jQuery.NotificationInfoListNameSpace.BasePath = "";
jQuery.NotificationInfoListNameSpace.WebServicePath = "";
jQuery.NotificationInfoListNameSpace.ScheduleStatus = { 'Created': 'CREATED', 'Accepted': 'ACCEPTED', 'WorkOrderAssigned': 'ASSIGNED', 'InProgress': 'INPROGRESS', 'Rejected': 'REJECTED', 'Completed': 'COMPLETED', 'Closed': 'CLOSED' };


function LoadNotificationInfo(gridProperties, basePath, addNotificationHtml) {
    var pagerData = gridProperties.PagerData;
    jQuery.NotificationInfoListNameSpace.PagerData = pagerData;
    jQuery.NotificationInfoListNameSpace.BasePath = basePath;
    jQuery.NotificationInfoListNameSpace.BasicParam.UserID = pagerData.UserID;
    jQuery.NotificationInfoListNameSpace.BasicParam.SiteID = pagerData.SiteID;
    jQuery.NotificationInfoListNameSpace.WebServicePath = pagerData.ServicePath;
    jQuery("#divDynamicGridTableHeaderInfo").removeClass("col-xl-4").addClass("col-lg-7");
    if (gridProperties.PagerData.AccessLevelID != 5)
        jQuery.DynamicGridNamespace.FeatureAdditionalInfo = 'ADMINUSER';
    else
        jQuery.DynamicGridNamespace.FeatureAdditionalInfo = 'PLANTUSER';
    ManageSiteMapUrl();
    LoadDynamicGridBasicInfo(gridProperties);
    jQuery("#divColumnAndGroupBy").append(addNotificationHtml);
}


function BindFieldIDVariables() {
    jQuery.NotificationInfoListNameSpace.FieldIDInfo = {};
    ko.utils.arrayForEach(dynamicGridViewModel.GridFieldList(), function (columnInfo) {
        if (columnInfo.FieldIdentifier != undefined) {
            if (columnInfo.FieldIdentifier.toLowerCase() == "fscheduleid")
                jQuery.NotificationInfoListNameSpace.FieldIDInfo.NotificationID = columnInfo.FieldID;
            if (columnInfo.FieldIdentifier.toLowerCase() == "fschedulestatusvalue")
                jQuery.NotificationInfoListNameSpace.FieldIDInfo.ScheduleStatusValueFieldID = columnInfo.FieldID;
            if (columnInfo.FieldIdentifier.toLowerCase() == "fworkorderid")
                jQuery.NotificationInfoListNameSpace.FieldIDInfo.WorkOrderID = columnInfo.FieldID;
            if (columnInfo.FieldIdentifier.toLowerCase() == "frefscheduleid")
                jQuery.NotificationInfoListNameSpace.FieldIDInfo.AttachedSchedlueID = columnInfo.FieldID;
            if (columnInfo.FieldIdentifier.toLowerCase() == "userid")
                jQuery.NotificationInfoListNameSpace.FieldIDInfo.UserIDFieldID = columnInfo.FieldID;
            if (columnInfo.FieldIdentifier.toLowerCase() == "maint_notification_status")
                jQuery.NotificationInfoListNameSpace.FieldIDInfo.ScheduleStatusTextFieldID = columnInfo.FieldID;
            if (columnInfo.FieldIdentifier.toLowerCase() == "fremarks")
                jQuery.NotificationInfoListNameSpace.FieldIDInfo.Remarks = columnInfo.FieldID;

        }
    });
}

function CustomGridContentBind(rowInfo, rowIndex, columnInfo) {
    var fieldID = columnInfo.FieldID;
    var fieldIdentifier = columnInfo.FieldIdentifier;
    var content = "";
    var editHref = "";
    var workOrderHref = "";   
  
    if (rowInfo.IsGroupRow) {
        content = rowInfo[fieldID];
    }
    else {
        var rowActionInfoHtml = "";
        //Common action field
        var notificationID = rowInfo[jQuery.NotificationInfoListNameSpace.FieldIDInfo.NotificationID];
        if (fieldIdentifier.toLowerCase() == "action") {
            var scheduleStatus = rowInfo[jQuery.NotificationInfoListNameSpace.FieldIDInfo.ScheduleStatusValueFieldID];
            //if (scheduleStatus == jQuery.NotificationInfoListNameSpace.ScheduleStatus.Created || scheduleStatus == jQuery.NotificationInfoListNameSpace.ScheduleStatus.Accepted)
             //   editHref = jQuery.NotificationInfoListNameSpace.BasePath + "/Preventive/AddNotificationInfo.aspx?id=" + jQuery.NotificationInfoListNameSpace.BasicParam.SiteID + "&nid=" + notificationID;
            //else
            //    editHref = jQuery.NotificationInfoListNameSpace.BasePath + "/Preventive/AddNotificationInfo.aspx?id=" + jQuery.NotificationInfoListNameSpace.BasicParam.SiteID + "&nid=" + notificationID + "&workOrder=true";

            content += "<div class='center-align'>";
            //verifying permission 
            rowActionInfoHtml = "<a class='fa fa-edit big tiny-leftmargin tiny-rightmargin v-icon  cursor-pointer' title='Edit' onclick='javascript:AddNewNotification(" + notificationID + ",\"" + scheduleStatus +"\");return false;'></a>";

            if (jQuery.NotificationInfoListNameSpace.PagerData.PageAccessRights.toLowerCase() == "full_access" && (scheduleStatus == jQuery.NotificationInfoListNameSpace.ScheduleStatus.Created || scheduleStatus == jQuery.NotificationInfoListNameSpace.ScheduleStatus.Accepted)) {
                rowActionInfoHtml += "<i class='fa fa-trash-o red big tiny-leftmargin tiny-rightmargin v-icon  cursor-pointer' title='Delete' onclick='DeleteNotificationClick(" + notificationID + ")'></i>";
            }
            else {
                rowActionInfoHtml += "<i class='fa fa-trash-o red big tiny-leftmargin tiny-rightmargin v-icon  cursor-pointer icon-muted ' title='Delete'></i>";
            }

            content += rowActionInfoHtml;
            content += "</div>";
        }
        if (fieldIdentifier.toLowerCase() == "fworkorderid") {
            var querystring = "?id=" + jQuery.NotificationInfoListNameSpace.BasicParam.SiteID + "&isworkorder=true&notificationid=" + notificationID + "&maintscheduleid=" + rowInfo[jQuery.NotificationInfoListNameSpace.FieldIDInfo.AttachedSchedlueID] + "&ismn=true";
            workOrderHref = jQuery.NotificationInfoListNameSpace.BasePath + "/Preventive/MaintenanceSchedule.aspx" + querystring;
            content += "<a  class='underline' href='" + workOrderHref + "' >" + rowInfo[jQuery.NotificationInfoListNameSpace.FieldIDInfo.WorkOrderID] + "</a>";
        }
        if (fieldIdentifier.toLowerCase() == "maint_notification_status") {
            var className = GetClassForNotificationStatus(rowInfo[jQuery.NotificationInfoListNameSpace.FieldIDInfo.ScheduleStatusValueFieldID]);
            var statuscolumnIndex = -1;
            jQuery("#tblDynamicGrid th").each(function (thIndex) {
                if (jQuery(this).attr("fieldid") == jQuery.NotificationInfoListNameSpace.FieldIDInfo.ScheduleStatusTextFieldID)
                    statuscolumnIndex = thIndex;
            });
            jQuery("#tbDynamicGrid").find("tr:eq(" + rowIndex + ")").find("td:eq(" + statuscolumnIndex + ")").addClass(className);
            content = rowInfo[fieldID];
        }
        if (fieldIdentifier.toLowerCase() == "fremarks") {
            var remarks = rowInfo[jQuery.NotificationInfoListNameSpace.FieldIDInfo.Remarks];
            if (remarks != null && remarks != '') {
                remarks = remarks.replace(/(?:\r\n|\r|\n)/g, '<br>');
                content += "<div class='full-width center-align'><i class='fa fa-file-text-o blue font-big cursor-pointer' onmouseover='ShowRemarks(this);return false;' onmouseout='HideRemarks(this);return false;'></i></div>";
                
            }
        }

    }
    return content;
}

function ShowRemarks(ctlInfo) {
    var rowInfo = ko.dataFor(jQuery(ctlInfo).closest("tr")[0]);
    var remarks = rowInfo[jQuery.NotificationInfoListNameSpace.FieldIDInfo.Remarks];
    jQuery('.pop-content').html("<span>" + remarks + "</span>");
    jQuery('.popover').remove();
    jQuery(ctlInfo).popover({
        html: true,
        trigger: "manual",
        placement:"left",
        content: function () {
            return jQuery('.pop-content').html();
        }
    });
    jQuery(ctlInfo).popover("show");
}

function HideRemarks(ctlInfo) {
    jQuery(ctlInfo).popover("hide");
}

function DeleteNotificationClick(notificationID) {
    jQuery("#alertMessage").removeClass("text-info");
    jQuery("#alertMessage").removeClass("text-danger");
    jQuery("#alertMessage").html(languageResource.resMsg_AreYouSureYouWantToDeleteNotification);
    jQuery("#alertModal").dialog({
        modal: true,
        buttons: [
            {
                text: languageResource.resMsg_BtnConfirm,
                click: function () {
                    jQuery("#alertModal").dialog("close");
                    DeleteConfirmedNotification(notificationID);
                }
            },
            {
                text: languageResource.resMsg_BtnCancel,
                click: function () {
                    jQuery("#alertModal").dialog("close");
                    isTrue = false;
                }
            }
        ]
    });
}

function DeleteConfirmedNotification(notificationID) {
    jQuery.ajax({
        type: "POST",
        url: jQuery.NotificationInfoListNameSpace.WebServicePath + "/Vegam_MaintenanceService.asmx/DeleteNotificationInfo",
        data: JSON.stringify({ basicParam: jQuery.NotificationInfoListNameSpace.BasicParam, notificationID: notificationID }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (json) {
            if (json.d != null || json.d != undefined) {
                if (json.d === 1) { //successfully deleted notification information
                    ReLoadGridContent();
                }
                else if (json.d === -1) {
                    ShowPopupMessage(languageResource.resMsg_CantDeleteNotificationWorkOrderAssigned, "error");
                }
                else {
                    ShowPopupMessage(languageResource.resMsg_NotificationDeleteFailure, "error");
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
                errorMessage = languageResource.resMsg_NotificationDeleteFailure;
            }
            ShowPopupMessage(languageResource.resMsg_NotificationDeleteFailure, "error");
        }
    });
}

function ShowPopupMessage(message, messageType) {
    switch (messageType.toLowerCase()) {
        case 'info':
            jQuery("#alertMessage").removeClass("text-danger");
            jQuery("#alertMessage").addClass("text-info");
            jQuery("#alertMessage").text(message);
            break;
        case 'error':
            jQuery("#alertMessage").removeClass("text-info");
            jQuery("#alertMessage").addClass("text-danger");
            jQuery("#alertMessage").text(message);
            break;
    }
    jQuery("#alertModal").dialog({
        modal: true,
        buttons: [
            {
                text: languageResource.resMsg_BtnOK,
                click: function () {
                    jQuery("#alertModal").dialog("close");
                    isTrue = false;
                }
            }
        ]
    });
}
function GetCustomFilters(gridContentFilter) {
    if (jQuery.DynamicGridNamespace.FeatureAdditionalInfo == 'PLANTUSER') {
        var userIDField = {};
        userIDField.FieldID = jQuery.NotificationInfoListNameSpace.FieldIDInfo.UserIDFieldID;
        userIDField.FilterValueList = [];
        userIDField.FilterValueList.push(jQuery.NotificationInfoListNameSpace.PagerData.UserID);
        gridContentFilter.GridFilteredFieldInfoValueList.push(userIDField);
    }
}

function AddNewNotification(notificationID, status) {
    var queryString = "id=" + jQuery.NotificationInfoListNameSpace.BasicParam.SiteID;
    if (notificationID == undefined) {       
        queryString = queryString + "&ismn=true";
    }
    else {        
        if (status == jQuery.NotificationInfoListNameSpace.ScheduleStatus.Created || status == jQuery.NotificationInfoListNameSpace.ScheduleStatus.Accepted) {
            
            queryString = queryString + "&nid=" + notificationID;
        }
        else {
            
            queryString = queryString + "&nid=" + notificationID + "&workOrder=true";
        }
    }

    SaveDynamicGridFilterValues();
    window.location = jQuery.NotificationInfoListNameSpace.BasePath + "/Preventive/AddNotificationInfo.aspx?" + queryString;
}

function ManageSiteMapUrl() {
    var scheduleURL = jQuery.NotificationInfoListNameSpace.BasePath + "/MaintenanceIndex.aspx?id=" + jQuery.NotificationInfoListNameSpace.BasicParam.SiteID;

    jQuery("#lnkAdminTab,#A1").attr("isSetDefault", "false");
    jQuery("#lnkAdminTab").attr("href", scheduleURL); // Set herf value
    jQuery("#A1").attr("href", scheduleURL); // Set herf value
}

function GetClassForNotificationStatus(status) {
    switch (status) {
        case jQuery.NotificationInfoListNameSpace.ScheduleStatus.Created: return 'td-blue';
        case jQuery.NotificationInfoListNameSpace.ScheduleStatus.Accepted: return 'td-navyBlue';
        case jQuery.NotificationInfoListNameSpace.ScheduleStatus.WorkOrderAssigned: return 'td-orange';
        case jQuery.NotificationInfoListNameSpace.ScheduleStatus.InProgress: return 'td-orange';
        case jQuery.NotificationInfoListNameSpace.ScheduleStatus.Completed: return 'td-green';
        case jQuery.NotificationInfoListNameSpace.ScheduleStatus.Closed: return 'td-green';
        case jQuery.NotificationInfoListNameSpace.ScheduleStatus.Rejected: return 'td-red';
        default: return '';
    }
}

