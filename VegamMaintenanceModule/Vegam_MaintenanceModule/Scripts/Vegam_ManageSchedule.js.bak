jQuery.ManageScheduleNameSpace = jQuery.ManageScheduleNameSpace || {};
jQuery.ManageScheduleNameSpace.PagerData = jQuery.ManageScheduleNameSpace.PagerData || {};
jQuery.ManageScheduleNameSpace.ScheduleStatus = { 'Active': 'A', 'InActive': 'I', 'SchedulingInProgress': 'P' };
jQuery.ManageScheduleNameSpace.WorkOrderStatus = { 'Scheduled': 'S', 'InProgress': 'P', 'Completed': 'C', 'OverDue': 'D' };
jQuery.ManageScheduleNameSpace.ScheduleStatusEnumInfo = {};
jQuery.ManageScheduleNameSpace.WorkOrderStatusEnumInfo = {};
jQuery.ManageScheduleNameSpace.ScheduleTypeList = { 'Schedule': 'S', 'WorkOrder': 'W', 'Inspection': 'I' };
jQuery.ManageScheduleNameSpace.RecurrenceRuleMessageType = {
    1: 'EveryHour', 2: 'EveryNHour', 3: 'EveryDay', 4: 'EveryNDay', 5: 'EveryWeek', 6: 'EveryNWeek', 7: 'EveryWeekDay', 8: 'EveryNWeekDay', 9: 'EveryMonth', 10: 'EveryNMonth',
    11: 'EveryMonthByDate', 12: 'EveryNMonthByDate', 13: 'EveryMonthByDay', 14: 'EveryNMonthByDay', 15: 'EveryYear', 16: 'EveryNYear', 17: 'EveryYearByDate', 18: 'EveryNYearByDate', 19: 'EveryYearByDay', 20: 'EveryNYearByDay'
};
jQuery.ManageScheduleNameSpace.RecurrenceRuleConvertFormat = {
    'EveryWeekDay': { 0: 'WeekDay' }, 'EveryNWeekDay': { 1: 'WeekDay' }, 'EveryMonthByDate': { 0: 'MonthDay' }, 'EveryNMonthByDate': { 1: 'MonthDay' }, 'EveryMonthByDay': { 0: 'MonthPosition', 1: 'WeekDay' }, 'EveryNMonthDay': { 1: 'MonthPosition', 2: 'WeekDay' },
    'EveryYearByDate': { 0: 'MonthDay', 1: 'YearMonth' }, 'EveryNYearByDate': { 1: 'MonthDay', 2: 'YearMonth' }, 'EveryYearByDay': { 0: 'MonthPosition', 1: 'WeekDay', 2: 'YearMonth' }, 'EveryNYearByDay': { 1: 'MonthPosition', 2: 'WeekDay', 3: 'YearMonth'}
};

var workGroupInfoViewModel = {
    AssigneeUserName: ko.observable(''),
    ReportToUserName: ko.observable('')
};

var workOrderDetailViewModel = {
    WorkOrderList: ko.observableArray([]),
    TotalWorkOrders: ko.observable(0),
    NoRecordFound: ko.observable(false),
    HTMLPagerContent: ko.observable(''),
    ShowLoadProgress: ko.observable(false),
    ErrorMessage: ko.observable(''),
    WorkOrderStatusList: ko.observableArray([]),
    SelectedWorkOrderStatus: ko.observable(),
}

function LoadManageScheduleInfo(gridProperties, manageScheduleAccess, newScheduleHTML, editScheduleHTML, deleteScheduleHTML, activateScheduleHTML, basePath, imagePath, workOrderPagerData) {
    jQuery.ManageScheduleNameSpace.PagerData = gridProperties.PagerData;
    jQuery.ManageScheduleNameSpace.ManageScheduleAccess = manageScheduleAccess;
    jQuery.ManageScheduleNameSpace.EditScheduleHTML = editScheduleHTML;
    jQuery.ManageScheduleNameSpace.DeleteScheduleHTML = deleteScheduleHTML;
    jQuery.ManageScheduleNameSpace.ActivateScheduleHTML = activateScheduleHTML;
    jQuery.ManageScheduleNameSpace.BasePath = basePath;
    jQuery.ManageScheduleNameSpace.ImagePath = imagePath;
    jQuery.ManageScheduleNameSpace.WorkOrderPagerData = workOrderPagerData;
    LoadDynamicGridBasicInfo(gridProperties);

    ko.applyBindings(workGroupInfoViewModel, document.getElementById('divWorkGroupInfo'));
    ko.applyBindings(workOrderDetailViewModel, document.getElementById('divWorkOrderDetailModal'));

    GetEnumTypeInfo("MAINT_SCHEDULESTATUS");
    GetEnumTypeInfo("MAINT_WORKORDERSTATUS");

    jQuery("#divColumnAndGroupBy").append(newScheduleHTML);
}

function BindFieldIDVariables() {
    jQuery.ManageScheduleNameSpace.FieldIDInfo = {};
    ko.utils.arrayForEach(dynamicGridViewModel.GridFieldList(), function (columnInfo) {
        if (columnInfo.FieldIdentifier != undefined) {
            if (columnInfo.FieldIdentifier.toLowerCase() == "fscheduleid")
                jQuery.ManageScheduleNameSpace.FieldIDInfo.ScheduleID = columnInfo.FieldID;
            else if (columnInfo.FieldIdentifier.toLowerCase() == "fworkgroup")
                jQuery.ManageScheduleNameSpace.FieldIDInfo.WorkGroupID = columnInfo.FieldID;
            else if (columnInfo.FieldIdentifier.toLowerCase() == "fassignee")
                jQuery.ManageScheduleNameSpace.FieldIDInfo.AssigneeID = columnInfo.FieldID;
            else if (columnInfo.FieldIdentifier.toLowerCase() == "freportedto")
                jQuery.ManageScheduleNameSpace.FieldIDInfo.ReportToID = columnInfo.FieldID;
            else if (columnInfo.FieldIdentifier.toLowerCase() == "fschedule_dtl_id")
                jQuery.ManageScheduleNameSpace.FieldIDInfo.ScheduleDetailFieldID = columnInfo.FieldID;
            else if (columnInfo.FieldIdentifier.toLowerCase() == "fschedulestatusvalue")
                jQuery.ManageScheduleNameSpace.FieldIDInfo.ScheduleStatusValueFieldID = columnInfo.FieldID;
            else if (columnInfo.FieldIdentifier.toLowerCase() == "maint_schedulestatus")
                jQuery.ManageScheduleNameSpace.FieldIDInfo.ScheduleStatusTextFieldID = columnInfo.FieldID;
            else if (columnInfo.FieldIdentifier.toLowerCase() == "fschd_rule_desc_type")
                jQuery.ManageScheduleNameSpace.FieldIDInfo.ScheduleRuleDescTypeFieldID = columnInfo.FieldID;
        }
    });
}

function CustomGridContentBind(rowInfo, rowIndex, columnInfo) {
    var fieldID = columnInfo.FieldID;
    var fieldIdentifier = columnInfo.FieldIdentifier;
    var content = "";

    if (fieldIdentifier.toLowerCase() == "action") {
        var actionContent = '';
        if (jQuery.ManageScheduleNameSpace.ManageScheduleAccess.toLowerCase() != "read_only") {
            actionContent = jQuery.ManageScheduleNameSpace.EditScheduleHTML;
            actionContent += jQuery.ManageScheduleNameSpace.DeleteScheduleHTML;

            var scheduleDetailID = rowInfo[jQuery.ManageScheduleNameSpace.FieldIDInfo.ScheduleDetailFieldID];
            if (scheduleDetailID > 0) {
                var scheduleStatus = rowInfo[jQuery.ManageScheduleNameSpace.FieldIDInfo.ScheduleStatusValueFieldID];
                if (scheduleStatus != jQuery.ManageScheduleNameSpace.ScheduleStatus.SchedulingInProgress) {
                    if (scheduleStatus == jQuery.ManageScheduleNameSpace.ScheduleStatus.Active)
                        actionContent += jQuery.ManageScheduleNameSpace.ActivateScheduleHTML.replace("ActivateButtonValue", languageResource.resMsg_InActivate).replace("myicon", "fa-stop");
                    else
                        actionContent += jQuery.ManageScheduleNameSpace.ActivateScheduleHTML.replace("ActivateButtonValue", languageResource.resMsg_Activate).replace("myicon", "fa-play");;
                }
            }
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
        var assigneeInfo = rowInfo[jQuery.ManageScheduleNameSpace.FieldIDInfo.AssigneeID];
        var reportToInfo = rowInfo[jQuery.ManageScheduleNameSpace.FieldIDInfo.ReportToID];
        if (assigneeInfo != "" || reportToInfo != "") {
            content = rowInfo[fieldID] + " <i class='fa fa-info-circle blue font-big tiny-leftmargin' data-placement='left' onmouseover='ShowWorkGroupInfo(this,\"" + assigneeInfo + "\",\"" + reportToInfo + "\");return false;' onmouseout='HideWorkGroupInfo(this);return false;'/>";
        }
        else {
            content = rowInfo[fieldID];
        }
    }
    else if (fieldIdentifier.toLowerCase() == "fschd_rule_desc") {
        var ruleMessageType = rowInfo[jQuery.ManageScheduleNameSpace.FieldIDInfo.ScheduleRuleDescTypeFieldID];
        if (ruleMessageType > 0) {
            var messageType = jQuery.ManageScheduleNameSpace.RecurrenceRuleMessageType[ruleMessageType];
            content = PopulateRRuleTextLanguageResource(messageType, rowInfo[fieldID]);
        }
    }
    else if (fieldIdentifier.toLowerCase() == "fnextduedate") {
        if (rowInfo[fieldID] != "")
            content = rowInfo[fieldID] + " <i class='fa fa-table blue font-big tiny-leftmargin cursor-pointer' onclick='ShowWorkOrderDetailModal(this);return false;'/>";
    }
    
    jQuery(".td-center").closest("td").addClass("center-align");
    return content;
}

function AddNewSchedule() {
    window.location.href = jQuery.ManageScheduleNameSpace.BasePath + "/Preventive/MaintenanceSchedule.aspx?id=" + jQuery.ManageScheduleNameSpace.PagerData.SiteID;
}

function EditScheduleInfo(editCtl) {
    var rowInfo = ko.dataFor(jQuery(editCtl).closest("tr")[0]);
    var scheduleID = rowInfo[jQuery.ManageScheduleNameSpace.FieldIDInfo.ScheduleID];
    window.location.href = jQuery.ManageScheduleNameSpace.BasePath + "/Preventive/MaintenanceSchedule.aspx?id=" + jQuery.ManageScheduleNameSpace.PagerData.SiteID + "&maintscheduleid=" + scheduleID;
}

function DeleteScheduleInfoConfirm(deleteCtl) {
    var rowInfo = ko.dataFor(jQuery(deleteCtl).closest("tr")[0]);
    var scheduleID = rowInfo[jQuery.ManageScheduleNameSpace.FieldIDInfo.ScheduleID];

    jQuery("#alertMessage").removeClass("text-danger");
    jQuery("#alertMessage").html(languageResource.resMsg_DeleteScheduleConfirm);
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
                    DeleteScheduleInfo(scheduleID);
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

function DeleteScheduleInfo(scheduleID) {
    var filterInfo = {};
    filterInfo.SiteID = jQuery.ManageScheduleNameSpace.PagerData.SiteID;
    filterInfo.UserID = jQuery.ManageScheduleNameSpace.PagerData.UserID;
    filterInfo.MaintScheduleID = scheduleID;
    filterInfo.MaintScheduleType = jQuery.ManageScheduleNameSpace.ScheduleTypeList.Schedule.charCodeAt();

    jQuery.ajax({
        type: "POST",
        url: jQuery.ManageScheduleNameSpace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/DeleteMaintenanceInfo",
        data: JSON.stringify({ filterInfo: filterInfo }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if (json.d != undefined && json.d != null && json.d > 0) {
                ReLoadGridContent();
            }
            else {
                ShowErrorMessagePopUp(languageResource.resMsg_FailedToDeleteSchedule, true);
            }
        },
        error: function (request, error) {
            var msg;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    msg = languageResource.resMsg_Error + errorMsg.Message;
                else
                    msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToDeleteSchedule;
            }
            else {
                msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToDeleteSchedule;
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

function ActivateScheduleInfoConfirm(ctrl) {
    if (jQuery(ctrl).find("span[name='activate']").text() == languageResource.resMsg_InActivate) {
        jQuery("#alertMessage").html(languageResource.resMsg_AreYouSureWantToInActivateSchedule);
    }
    else {
        jQuery("#alertMessage").html(languageResource.resMsg_AreYouSureWantToActivateSchedule);
    }

    jQuery("#alertMessage").removeClass("text-danger");
    
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
                    ActivateScheduleInfo(ctrl);
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

function ActivateScheduleInfo(ctrl) {
    var rowInfo = ko.dataFor(jQuery(ctrl).closest("tr")[0]);
    var scheduleID = rowInfo[jQuery.ManageScheduleNameSpace.FieldIDInfo.ScheduleID];

    var filterInfo = {};
    filterInfo.SiteID = jQuery.ManageScheduleNameSpace.PagerData.SiteID;
    filterInfo.UserID = jQuery.ManageScheduleNameSpace.PagerData.UserID;
    filterInfo.MaintScheduleID = scheduleID;

    var serviceMethod = "ActivateMaintenanceSchedule";
    var activate = true;
    if (jQuery(ctrl).find("span[name='activate']").text() == languageResource.resMsg_InActivate) {
        serviceMethod = "InActivateMaintenanceSchedule";
        activate = false;
    }

    jQuery.ajax({
        type: "POST",
        url: jQuery.ManageScheduleNameSpace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/" + serviceMethod,
        data: JSON.stringify({ filterInfo: filterInfo }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        success: function (json) {
            if (json != undefined && json.d != undefined && json.d == true) {
                if (activate) {
                    //jQuery(ctrl).find("span[name='activate']").text(languageResource.resMsg_InActivate);
                    //jQuery(ctrl).find("i").removeClass("fa-play").addClass("fa-stop");
                    //jQuery(ctrl).find("span[name='activate']").closest("li").hide();
                    ReLoadGridContent();
                    ShowErrorMessagePopUp(languageResource.resMsg_SuccessfullyActivatedSchedule, false);
                }
                else {
                    //jQuery(ctrl).find("span[name='activate']").text(languageResource.resMsg_Activate);
                    //jQuery(ctrl).find("i").removeClass("fa-stop").addClass("fa-play");
                    ReLoadGridContent();
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

function PopulateRRuleTextLanguageResource(type, content) {
    var data = content.split(']');
    var langResMessage = languageResource.RecurrenceRuleMessage[type];
    var format = jQuery.ManageScheduleNameSpace.RecurrenceRuleConvertFormat[type]
    for (var i = 0; i < data.length; i++) {
        if (data[i] != "") {
            var msg = data[i].replace('[', '');
            if (format == undefined) {
                langResMessage = langResMessage.replace('[' + i + ']', msg);
            }
            else {
                var res = format[i];
                if (res == undefined) {
                    langResMessage = langResMessage.replace('[' + i + ']', msg);
                }
                else {
                    var outArr = [];
                    var langRes = languageResource[res];
                    var arr = msg.split(',');
                    for (var j = 0; j < arr.length; j++) {
                        if (arr[j] != "")
                            outArr.push(langRes[arr[j]]);
                    }
                    langResMessage = langResMessage.replace('[' + i + ']', outArr.join(", "));
                }
            }
        }
    }
    return langResMessage;
}

function GetEnumTypeInfo(enumType) {
    var basicParam = {};
    basicParam.SiteID = jQuery.ManageScheduleNameSpace.PagerData.SiteID;
    basicParam.UserID = jQuery.ManageScheduleNameSpace.PagerData.UserID;

    jQuery.ajax({
        type: "POST",
        url: jQuery.ManageScheduleNameSpace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetEnumInfoList",
        data: JSON.stringify({ basicParam: basicParam, EnumType: enumType }),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data.d !== null) {
                if (enumType == "MAINT_WORKORDERSTATUS") {
                    workOrderDetailViewModel.WorkOrderStatusList(data.d);
                }

                ko.utils.arrayForEach(data.d, function (statusInfo) {
                    if (enumType == "MAINT_WORKORDERSTATUS")
                        jQuery.ManageScheduleNameSpace.WorkOrderStatusEnumInfo[statusInfo.TypeValue] = statusInfo;
                    else
                        jQuery.ManageScheduleNameSpace.ScheduleStatusEnumInfo[statusInfo.TypeValue] = statusInfo;
                });
            } else {
                ShowErrorMessage(languageResource.resMsg_FailedToLoadStatusInfo);
            }
        },
        beforeSend: function () {
            workOrderDetailViewModel.ShowLoadProgress(true);
        },
        complete: function () {
            workOrderDetailViewModel.ShowLoadProgress(false);
        },
        error: function (request, error) {
            var errorMessage = languageResource.resMsg_FailedToLoadStatusInfo;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                    errorMessage = errorMsg;
            }
            ShowErrorMessage(languageResource.resMsg_Error + errorMessage);
        }
    });
}

function ShowWorkOrderDetailModal(ctrl) {
    var rowInfo = ko.dataFor(jQuery(ctrl).closest("tr")[0]);
    var scheduleID = rowInfo[jQuery.ManageScheduleNameSpace.FieldIDInfo.ScheduleID];
    jQuery("#divWorkOrderDetailModal").attr('scheduleid', scheduleID);

    //default selected to 'scheduled' status
    var schdStatusEnumInfo = ko.utils.arrayFirst(workOrderDetailViewModel.WorkOrderStatusList(), function (item) { return item.TypeValue == jQuery.ManageScheduleNameSpace.WorkOrderStatus.Scheduled; });
    if (schdStatusEnumInfo != undefined && schdStatusEnumInfo != null)
        workOrderDetailViewModel.SelectedWorkOrderStatus(schdStatusEnumInfo.TypeValue);
    jQuery("#btnShowAll").removeClass("hide");

    jQuery("#divWorkOrderDetailModal").modal("show");
    LoadScheduleWorkOrderDetails(jQuery.ManageScheduleNameSpace.WorkOrderPagerData);
}

function LoadScheduleWorkOrderDetails(pagerData) {
    workOrderDetailViewModel.ErrorMessage('');
    workOrderDetailViewModel.NoRecordFound(false);
    workOrderDetailViewModel.HTMLPagerContent('');

    var filterInfo = {};
    filterInfo.SiteID = jQuery.ManageScheduleNameSpace.PagerData.SiteID;
    filterInfo.UserID = jQuery.ManageScheduleNameSpace.PagerData.UserID;
    filterInfo.ScheduleID = jQuery("#divWorkOrderDetailModal").attr('scheduleid');
    filterInfo.PageIndex = pagerData.PageIndex;
    filterInfo.PageSize = pagerData.PageSize;

    if (workOrderDetailViewModel.SelectedWorkOrderStatus() != undefined && workOrderDetailViewModel.SelectedWorkOrderStatus() != "")
        filterInfo.Status = workOrderDetailViewModel.SelectedWorkOrderStatus().charCodeAt();

    jQuery.ajax({
        type: "POST",
        url: jQuery.ManageScheduleNameSpace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetScheduleWorkOrderDetails",
        data: JSON.stringify({ pagerData: pagerData, filterInfo: filterInfo }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        success: function (json) {
            if (json != undefined && json.d != undefined && json.d != null) {
                var scheduleWorkOrderDetails = json.d.ScheduleWorkOrderDetails;
                if (scheduleWorkOrderDetails.TotalRecords > 0) {
                    workOrderDetailViewModel.WorkOrderList([]);
                    ko.utils.arrayForEach(scheduleWorkOrderDetails.WorkOrderList, function (item) {
                        item.StatusImage = jQuery.ManageScheduleNameSpace.ImagePath + "/" + jQuery.ManageScheduleNameSpace.WorkOrderStatusEnumInfo[String.fromCharCode(item.Status)].ImageName;
                        item.StatusType = jQuery.ManageScheduleNameSpace.WorkOrderStatusEnumInfo[String.fromCharCode(item.Status)] == undefined ? '' : jQuery.ManageScheduleNameSpace.WorkOrderStatusEnumInfo[String.fromCharCode(item.Status)].DisplayName;
                        workOrderDetailViewModel.WorkOrderList.push(item);
                    });
                    workOrderDetailViewModel.TotalWorkOrders(scheduleWorkOrderDetails.TotalRecords);

                    if (scheduleWorkOrderDetails.TotalRecords > pagerData.PageSize)
                        workOrderDetailViewModel.HTMLPagerContent(json.d.HTMLPager);
                }
                else {
                    workOrderDetailViewModel.NoRecordFound(true);
                }
            }
            else {
                workOrderDetailViewModel.ErrorMessage(languageResource.resMsg_FailedToLoadWorkOrderDetails);
            }
        },
        complete: function () {
            jQuery('[data-toggle="popover"]').popover();
            jQuery('#popoverData').popover();
            jQuery('.pover').popover({ trigger: "hover" });
        },
        error: function (request, error) {
            var msg = languageResource.resMsg_FailedToLoadWorkOrderDetails;
            var errorMessage = languageResource.resMsg_Error + msg;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    errorMessage = languageResource.resMsg_Error + errorMsg.Message;
            }
            workOrderDetailViewModel.ErrorMessage(errorMessage);
        }
    });
}

function SearchWorkOrderInfo() {
    var hasSearchItems = false;
    if (workOrderDetailViewModel.SelectedWorkOrderStatus() != undefined && workOrderDetailViewModel.SelectedWorkOrderStatus() != "")
        hasSearchItems = true;

    if (hasSearchItems)
        jQuery("#btnShowAll").removeClass("hide");

    LoadScheduleWorkOrderDetails(jQuery.ManageScheduleNameSpace.WorkOrderPagerData);
}

function ShowAllWorkOrderInfo() {
    workOrderDetailViewModel.SelectedWorkOrderStatus('');
    jQuery("#btnShowAll").addClass("hide");
    LoadScheduleWorkOrderDetails(jQuery.ManageScheduleNameSpace.WorkOrderPagerData);
}