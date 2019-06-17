jQuery.ManageWorkOrderNameSpace = jQuery.ManageWorkOrderNameSpace || {};
jQuery.ManageWorkOrderNameSpace.PagerData = jQuery.ManageWorkOrderNameSpace.PagerData || {};
jQuery.ManageWorkOrderNameSpace.ScheduleTypeList = { 'Schedule': 'S', 'WorkOrder': 'W', 'Inspection': 'I' };
jQuery.ManageWorkOrderNameSpace.WorkOrderStatusInfo = jQuery.ManageWorkOrderNameSpace.WorkOrderStatusInfo || {};

var workGroupInfoViewModel = {
    AssigneeUserName: ko.observable(''),
    ReportToUserName: ko.observable('')
};

function LoadManageWorkOrderInfo(gridProperties, manageWorkOrderAccess, newWorkOrderHTML, editWorkOrderHTML, deleteWorkOrderHTML, basePath) {
    jQuery.ManageWorkOrderNameSpace.PagerData = gridProperties.PagerData;
    jQuery.ManageWorkOrderNameSpace.ManageWorkOrderAccess = manageWorkOrderAccess;
    jQuery.ManageWorkOrderNameSpace.EditWorkOrderHTML = editWorkOrderHTML;
    jQuery.ManageWorkOrderNameSpace.DeleteWorkOrderHTML = deleteWorkOrderHTML;
    jQuery.ManageWorkOrderNameSpace.BasePath = basePath;

    GetWorkOrderStatusType("MAINT_WORKORDERSTATUS");
    LoadDynamicGridBasicInfo(gridProperties);

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
        }
    });
}

function CustomGridContentBind(rowInfo, rowIndex, columnInfo) {
    var fieldID = columnInfo.FieldID;
    var fieldIdentifier = columnInfo.FieldIdentifier;
    var content = "";

    if (fieldIdentifier.toLowerCase() == "action") {
        var actionContent = '';
        if (jQuery.ManageWorkOrderNameSpace.ManageWorkOrderAccess.toLowerCase() != "read_only") {
            actionContent = jQuery.ManageWorkOrderNameSpace.EditWorkOrderHTML;
            actionContent += jQuery.ManageWorkOrderNameSpace.DeleteWorkOrderHTML;
        }

        if (actionContent.length > 0) {
            content = "<div class='relative pull-xs-left'><button class='btn btn-sm btn-defult dropdown-toggle' type='button'></button>";
            content += "<div class='absolute col-xs-12 p-x-0 dropdown-menu hide' style='z-index: 1020; overflow-y: auto; max-height: 200px; overflow-x: hidden; min-width: 190px !important; left:42px;top:3px;'>";
            content += "<ul class='p-a-0' style='list-style: none;'>";
            content += actionContent;
            content += "</ul></div>";
            content += "</div>";
        }
        else {
            content = "<div class='relative pull-xs-left'><button class='btn btn-sm btn-defult dropdown-toggle' type='button' disabled='disabled'></button></div>";
        }
    }
    else if (fieldIdentifier.toLowerCase() == "fworkgroup") {
        var assigneeInfo = rowInfo[jQuery.ManageWorkOrderNameSpace.FieldIDInfo.AssigneeID];
        var reportToInfo = rowInfo[jQuery.ManageWorkOrderNameSpace.FieldIDInfo.ReportToID];
        if (assigneeInfo != "" || reportToInfo != "") {
            content = rowInfo[fieldID] + " <i class='fa fa-info-circle blue font-big tiny-leftmargin' data-placement='left' onmouseover='ShowWorkGroupInfo(this,\"" + assigneeInfo + "\",\"" + reportToInfo + "\");return false;' onmouseout='HideWorkGroupInfo(this);return false;'/>";
        }
        else {
            content = rowInfo[fieldID];
        }
    }
    else if (fieldIdentifier.toLowerCase() == "maint_workorderstatus") {
        if (jQuery.ManageWorkOrderNameSpace.FieldIDInfo.WorkOrderStatusID != undefined && rowInfo[jQuery.ManageWorkOrderNameSpace.FieldIDInfo.WorkOrderStatusID] != undefined) {
            var status = rowInfo[jQuery.ManageWorkOrderNameSpace.FieldIDInfo.StatusKeyID];
            var statusDisplayName = jQuery.ManageWorkOrderNameSpace.WorkOrderStatusInfo[status] == undefined ? '' : jQuery.ManageWorkOrderNameSpace.WorkOrderStatusInfo[status].DisplayName;
            content = "<span class='pover' data-placement='top'  data-content='" + statusDisplayName + "' style='cursor: pointer'>" + rowInfo[fieldID] + "</span>";
        }
        else {
            content = rowInfo[fieldID];
        }
    }

    jQuery(".td-center").closest("td").addClass("center-align");
    return content;
}

function AddNewWorkOrder() {
    window.location.href = jQuery.ManageWorkOrderNameSpace.BasePath + "/Preventive/MaintenanceSchedule.aspx?id=" + jQuery.ManageWorkOrderNameSpace.PagerData.SiteID+"&isworkorder=true";
}

function EditWorkOrderInfo(editCtl) {
    var rowInfo = ko.dataFor(jQuery(editCtl).closest("tr")[0]);
    var scheduleID = rowInfo[jQuery.ManageWorkOrderNameSpace.FieldIDInfo.ScheduleID];
    window.location.href = jQuery.ManageWorkOrderNameSpace.BasePath + "/Preventive/MaintenanceSchedule.aspx?id=" + jQuery.ManageWorkOrderNameSpace.PagerData.SiteID + "&maintscheduleid=" + scheduleID + "&isworkorder=true";
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