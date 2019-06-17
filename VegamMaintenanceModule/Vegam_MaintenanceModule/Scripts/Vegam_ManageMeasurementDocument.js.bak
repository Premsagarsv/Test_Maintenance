jQuery.ManageMeasurementDocNameSpace = jQuery.ManageMeasurementDocNameSpace || {};
jQuery.ManageMeasurementDocNameSpace.PagerData = jQuery.ManageMeasurementDocNameSpace.PagerData || {};
jQuery.ManageMeasurementDocNameSpace.BasePath = "";
jQuery.ManageMeasurementDocNameSpace.BasicParam = jQuery.ManageMeasurementDocNameSpace.BasicParam || {};
jQuery.ManageMeasurementDocNameSpace.WorkOrderPagerData = jQuery.ManageMeasurementDocNameSpace.WorkOrderPagerData || {};
jQuery.ManageMeasurementDocNameSpace.HasEditAccess = false;
jQuery.ManageMeasurementDocNameSpace.HasDeleteAccess = false;
jQuery.ManageMeasurementDocNameSpace.FieldIDInfo = {};
jQuery.ManageMeasurementDocNameSpace.EditScheduleHTML = "";
jQuery.ManageMeasurementDocNameSpace.DeleteScheduleHTML = "";
jQuery.ManageMeasurementDocNameSpace.ActivateScheduleHTML = "";
jQuery.ManageMeasurementDocNameSpace.ScheduleStatus = { 'Active': 'A', 'InActive': 'I', 'SchedulingInProgress': 'P' };
jQuery.ManageMeasurementDocNameSpace.ScheduleTypeList = { 'Schedule': 'S', 'WorkOrder': 'W', 'Inspection': 'I' };
jQuery.ManageMeasurementDocNameSpace.WorkOrderStatusEnumInfo = {};
jQuery.ManageMeasurementDocNameSpace.WorkOrderStatus = { 'Scheduled': 'S', 'InProgress': 'P', 'Completed': 'C', 'OverDue': 'D' };
jQuery.ManageMeasurementDocNameSpace.ScheduleStatusInfoForGrid = [];
jQuery.ManageMeasurementDocNameSpace.RecurrenceRuleMessageType = {
    1: 'EveryHour', 2: 'EveryNHour', 3: 'EveryDay', 4: 'EveryNDay', 5: 'EveryWeek', 6: 'EveryNWeek', 7: 'EveryWeekDay', 8: 'EveryNWeekDay', 9: 'EveryMonth', 10: 'EveryNMonth',
    11: 'EveryMonthByDate', 12: 'EveryNMonthByDate', 13: 'EveryMonthByDay', 14: 'EveryNMonthByDay', 15: 'EveryYear', 16: 'EveryNYear', 17: 'EveryYearByDate', 18: 'EveryNYearByDate', 19: 'EveryYearByDay', 20: 'EveryNYearByDay'
};
jQuery.ManageMeasurementDocNameSpace.RecurrenceRuleConvertFormat = {
    'EveryWeekDay': { 0: 'WeekDay' }, 'EveryNWeekDay': { 1: 'WeekDay' }, 'EveryMonthByDate': { 0: 'MonthDay' }, 'EveryNMonthByDate': { 1: 'MonthDay' }, 'EveryMonthByDay': { 0: 'MonthPosition', 1: 'WeekDay' }, 'EveryNMonthDay': { 1: 'MonthPosition', 2: 'WeekDay' },
    'EveryYearByDate': { 0: 'MonthDay', 1: 'YearMonth' }, 'EveryNYearByDate': { 1: 'MonthDay', 2: 'YearMonth' }, 'EveryYearByDay': { 0: 'MonthPosition', 1: 'WeekDay', 2: 'YearMonth' }, 'EveryNYearByDay': { 1: 'MonthPosition', 2: 'WeekDay', 3: 'YearMonth' }
};

var measuringPointViewModel = {
    MeasuringPointArray: ko.observableArray([]),
    AssigneeUserName: ko.observable(''),
    ReportToUserName: ko.observable('')
}

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

function LoadMeasurementDocumentPage(dynamicGridProperties, basePath, hasEditAccess, hasDeleteAccess, newScheduleHTML, editScheduleHTML, deleteScheduleHTML, activateScheduleHTML, workOrderPagerData, imagePath) {
    var pagerData = dynamicGridProperties.PagerData;
    jQuery.ManageMeasurementDocNameSpace.PagerData = pagerData;
    jQuery.ManageMeasurementDocNameSpace.BasePath = basePath;
    jQuery.ManageMeasurementDocNameSpace.BasicParam.UserID = pagerData.UserID;
    jQuery.ManageMeasurementDocNameSpace.BasicParam.SiteID = pagerData.SiteID;
    jQuery.ManageMeasurementDocNameSpace.EditScheduleHTML = editScheduleHTML;
    jQuery.ManageMeasurementDocNameSpace.DeleteScheduleHTML = deleteScheduleHTML;
    jQuery.ManageMeasurementDocNameSpace.ActivateScheduleHTML = activateScheduleHTML;
    jQuery.ManageMeasurementDocNameSpace.WorkOrderPagerData = workOrderPagerData;
    jQuery.ManageMeasurementDocNameSpace.ImagePath = imagePath;

    jQuery.ManageMeasurementDocNameSpace.HasEditAccess = hasEditAccess.toLowerCase() == "true" ? true : false;
    jQuery.ManageMeasurementDocNameSpace.HasDeleteAccess = hasDeleteAccess.toLowerCase() == "true" ? true : false;

    LoadDynamicGridBasicInfo(dynamicGridProperties);
    jQuery("#divColumnAndGroupBy").append(newScheduleHTML);
    jQuery("#divDynamicGridTableHeaderInfo").removeClass("col-xl-4").addClass("col-xl-5");

    ko.applyBindings(measuringPointViewModel, document.getElementById("divMeasuringPointInfo"));
    ko.applyBindings(workOrderDetailViewModel, document.getElementById('divWorkOrderDetailModal'));
    GetEnumTypeInfo("MAINT_SCHEDULESTATUS");
    GetEnumTypeInfo("MAINT_WORKORDERSTATUS");
}

function BindFieldIDVariables() {
    jQuery.ManageMeasurementDocNameSpace.FieldIDInfo = {};
    ko.utils.arrayForEach(dynamicGridViewModel.GridFieldList(), function (columnInfo) {
        if (columnInfo.FieldIdentifier != undefined) {
            if (columnInfo.FieldIdentifier.toLowerCase() == "fscheduleid")
                jQuery.ManageMeasurementDocNameSpace.FieldIDInfo.ScheduleID = columnInfo.FieldID;
            else if (columnInfo.FieldIdentifier.toLowerCase() == "fmeaspoints")
                jQuery.ManageMeasurementDocNameSpace.FieldIDInfo.MeasuringPointID = columnInfo.FieldID;
            else if (columnInfo.FieldIdentifier.toLowerCase() == "fassignee")
                jQuery.ManageMeasurementDocNameSpace.FieldIDInfo.AssigneeID = columnInfo.FieldID;
            else if (columnInfo.FieldIdentifier.toLowerCase() == "freportedto")
                jQuery.ManageMeasurementDocNameSpace.FieldIDInfo.ReportToID = columnInfo.FieldID;
            else if (columnInfo.FieldIdentifier.toLowerCase() == "fschedule_dtl_id")
                jQuery.ManageMeasurementDocNameSpace.FieldIDInfo.ScheduleDetailFieldID = columnInfo.FieldID;
            else if (columnInfo.FieldIdentifier.toLowerCase() == "fschedulestatusvalue")
                jQuery.ManageMeasurementDocNameSpace.FieldIDInfo.ScheduleStatusValueFieldID = columnInfo.FieldID;
            else if (columnInfo.FieldIdentifier.toLowerCase() == "maint_schedulestatus")
                jQuery.ManageMeasurementDocNameSpace.FieldIDInfo.ScheduleStatusTextFieldID = columnInfo.FieldID;
            else if (columnInfo.FieldIdentifier.toLowerCase() == "fschd_rule_desc_type")
                jQuery.ManageMeasurementDocNameSpace.FieldIDInfo.ScheduleRuleDescTypeFieldID = columnInfo.FieldID;
        }
    });
}

function CustomGridContentBind(rowInfo, rowIndex, columnInfo) {
    var fieldID = columnInfo.FieldID;
    var fieldIdentifier = columnInfo.FieldIdentifier;
    var content = "";

    if (fieldIdentifier.toLowerCase() == "action") {
        var actionContent = '';
        if (jQuery.ManageMeasurementDocNameSpace.HasEditAccess)
            actionContent = jQuery.ManageMeasurementDocNameSpace.EditScheduleHTML;
        if (jQuery.ManageMeasurementDocNameSpace.HasDeleteAccess)
            actionContent += jQuery.ManageMeasurementDocNameSpace.DeleteScheduleHTML;

        var scheduleDetailID = rowInfo[jQuery.ManageMeasurementDocNameSpace.FieldIDInfo.ScheduleDetailFieldID];
        if (scheduleDetailID > 0) {
            var scheduleStatus = rowInfo[jQuery.ManageMeasurementDocNameSpace.FieldIDInfo.ScheduleStatusValueFieldID];
            if (scheduleStatus == jQuery.ManageMeasurementDocNameSpace.ScheduleStatus.Active)
                actionContent += jQuery.ManageMeasurementDocNameSpace.ActivateScheduleHTML.replace("ActivateButtonValue", languageResource.resMsg_InActivate).replace("myicon", "fa-stop");
            else if (scheduleStatus == jQuery.ManageMeasurementDocNameSpace.ScheduleStatus.InActive)
                actionContent += jQuery.ManageMeasurementDocNameSpace.ActivateScheduleHTML.replace("ActivateButtonValue", languageResource.resMsg_Activate).replace("myicon", "fa-play");
        }

        if (actionContent.length > 0) {
            content = "<div class='relative center-align'><button class='btn btn-sm btn-defult dropdown-toggle' type='button'></button>";
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
    else if (fieldIdentifier.toLowerCase() == "fmeaspoints") {
        var measPointInfo = rowInfo[jQuery.ManageMeasurementDocNameSpace.FieldIDInfo.MeasuringPointID];
        if (measPointInfo.length > 60) {
            content = rowInfo[fieldID].substring(0, 60) + "..." + "<i class='fa fa-info-circle blue font-big tiny-leftmargin bold cursor-pointer pull-xs-right' style='margin-left:0px!important' data-placement='left' onmouseover='ShowMeasPointInfoInfo(this,\"" + measPointInfo + "\");return false;' onmouseout='HideMeasPointInfo(this);return false;' />";
        }
        else {
            content = rowInfo[fieldID];
        }
    }
    else if (fieldIdentifier.toLowerCase() == "fworkgroup") {
        var assigneeInfo = rowInfo[jQuery.ManageMeasurementDocNameSpace.FieldIDInfo.AssigneeID];
        var reportToInfo = rowInfo[jQuery.ManageMeasurementDocNameSpace.FieldIDInfo.ReportToID];
        if (assigneeInfo != "" || reportToInfo != "") {
            content = rowInfo[fieldID] + " <i class='fa fa-info-circle blue font-big tiny-leftmargin cursor-pointer pull-xs-right' data-placement='left' onmouseover='ShowWorkGroupInfo(this,\"" + assigneeInfo + "\",\"" + reportToInfo + "\");return false;' onmouseout='HideWorkGroupInfo(this);return false;'/>";
        }
        else {
            content = rowInfo[fieldID];
        }
    }
    else if (fieldIdentifier.toLowerCase() == "fschd_rule_desc") {
        var ruleMessageType = rowInfo[jQuery.ManageMeasurementDocNameSpace.FieldIDInfo.ScheduleRuleDescTypeFieldID];
        if (ruleMessageType > 0) {
            var messageType = jQuery.ManageMeasurementDocNameSpace.RecurrenceRuleMessageType[ruleMessageType];
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
    window.location.href = jQuery.ManageMeasurementDocNameSpace.BasePath + "/Preventive/MeasurementDocument.aspx?id=" + jQuery.ManageMeasurementDocNameSpace.PagerData.SiteID;
}

function EditScheduleInfo(editCtl) {
    var rowInfo = ko.dataFor(jQuery(editCtl).closest("tr")[0]);
    var scheduleID = rowInfo[jQuery.ManageMeasurementDocNameSpace.FieldIDInfo.ScheduleID];
    window.location.href = jQuery.ManageMeasurementDocNameSpace.BasePath + "/Preventive/MeasurementDocument.aspx?id=" + jQuery.ManageMeasurementDocNameSpace.PagerData.SiteID + "&maintscheduleid=" + scheduleID;
}

function DeleteScheduleInfoConfirm(deleteCtl) {
    var rowInfo = ko.dataFor(jQuery(deleteCtl).closest("tr")[0]);
    var scheduleID = rowInfo[jQuery.ManageMeasurementDocNameSpace.FieldIDInfo.ScheduleID];

    jQuery("#alertMessage").removeClass("text-danger");
    jQuery("#alertMessage").html(languageResource.resMsg_DeleteMeasurementDocConfirm);
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
    filterInfo.SiteID = jQuery.ManageMeasurementDocNameSpace.PagerData.SiteID;
    filterInfo.UserID = jQuery.ManageMeasurementDocNameSpace.PagerData.UserID;
    filterInfo.MaintScheduleID = scheduleID;
    filterInfo.MaintScheduleType = jQuery.ManageMeasurementDocNameSpace.ScheduleTypeList.Schedule.charCodeAt();

    jQuery.ajax({
        type: "POST",
        url: jQuery.ManageMeasurementDocNameSpace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/DeleteMaintenanceInfo",
        data: JSON.stringify({ filterInfo: filterInfo }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if (json.d != undefined && json.d != null && json.d == true) {
                ReLoadGridContent();
            }
            else {
                ShowErrorMessagePopUp(LanguageResource.resMsg_FailedToDeleteSchedule, true);
            }
        },
        error: function (request, error) {
            var msg;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    msg = LanguageResource.resMsg_Error + errorMsg.Message;
                else
                    msg = LanguageResource.resMsg_Error + LanguageResource.resMsg_FailedToDeleteSchedule;
            }
            else {
                msg = LanguageResource.resMsg_Error + LanguageResource.resMsg_FailedToDeleteSchedule;
            }
            ShowErrorMessagePopUp(msg, true);
        },
    });
}

function ActivateScheduleInfoCinfirm(ctrl) {
    jQuery("#alertMessage").removeClass("text-danger");
    if (jQuery(ctrl).find("span[name='activate']").text() == languageResource.resMsg_InActivate)
        jQuery("#alertMessage").html(languageResource.resMsg_UpdateScheduleStatusInActiveConfirm);
    else
        jQuery("#alertMessage").html(languageResource.resMsg_UpdateScheduleStatusActiveConfirm);
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
                    isTrue = false;
                }
            }
        ]
    });
}

function ActivateScheduleInfo(ctrl) {
    var rowInfo = ko.dataFor(jQuery(ctrl).closest("tr")[0]);
    var scheduleID = rowInfo[jQuery.ManageMeasurementDocNameSpace.FieldIDInfo.ScheduleID];

    var filterInfo = {};
    filterInfo.SiteID = jQuery.ManageMeasurementDocNameSpace.PagerData.SiteID;
    filterInfo.UserID = jQuery.ManageMeasurementDocNameSpace.PagerData.UserID;
    filterInfo.MaintScheduleID = scheduleID;

    var serviceMethod = "ActivateMaintenanceSchedule";
    var activate = true;
    if (jQuery(ctrl).find("span[name='activate']").text() == languageResource.resMsg_InActivate) {
        serviceMethod = "InActivateMaintenanceSchedule";
        activate = false;
    }

    jQuery.ajax({
        type: "POST",
        url: jQuery.ManageMeasurementDocNameSpace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/" + serviceMethod,
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
                    //jQuery(ctrl).closest("td").next().next().next().next().find("span").text(jQuery.ManageMeasurementDocNameSpace.ScheduleStatusInfoForGrid.P.DisplayName)
                }
                else {
                    //jQuery(ctrl).find("span[name='activate']").text(languageResource.resMsg_Activate);
                    //jQuery(ctrl).find("i").removeClass("fa-stop").addClass("fa-play");
                    ShowErrorMessagePopUp(languageResource.resMsg_SuccessfullyInActivatedSchedule, false);
                    ReLoadGridContent();
                    //jQuery(ctrl).closest("td").next().next().next().next().find("span").text(jQuery.ManageMeasurementDocNameSpace.ScheduleStatusInfoForGrid.I.DisplayName)
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

function ShowMeasPointInfoInfo(ctlInfo, measPointInfo) {
    var measPoint = {};
    measuringPointViewModel.MeasuringPointArray.removeAll();
    jQuery.each(measPointInfo.split(','), function (index, Value) {
        measPoint.MeasuringPoint = Value;
        measuringPointViewModel.MeasuringPointArray.push(measPoint);
        measPoint = {};
    });
    measuringPointViewModel.MeasuringPointArray();

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

function HideMeasPointInfo(ctlInfo) {
    jQuery(ctlInfo).popover("hide");
}

function ShowWorkGroupInfo(ctlInfo, assigneeInfo, reportToInfo) {
    measuringPointViewModel.MeasuringPointArray.removeAll();
    measuringPointViewModel.AssigneeUserName(assigneeInfo);
    measuringPointViewModel.ReportToUserName(reportToInfo);

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

function GetEnumTypeInfo(enumType) {
    var basicParam = {};
    jQuery.extend(basicParam, jQuery.ManageMeasurementDocNameSpace.BasicParam);

    jQuery.ajax({
        type: "POST",
        url: jQuery.ManageMeasurementDocNameSpace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetEnumInfoList",
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
                        jQuery.ManageMeasurementDocNameSpace.WorkOrderStatusEnumInfo[statusInfo.TypeValue] = statusInfo;
                    else
                        jQuery.ManageMeasurementDocNameSpace.ScheduleStatusInfoForGrid[statusInfo.TypeValue] = statusInfo;
                });
            } else {
                ShowErrorMessagePopUp(languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadStatusInfo);
            }
        },
        error: function (request, error) {
            var errorMessage = languageResource.resMsg_FailedToLoadStatusInfo;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                    errorMessage = error.Message
            }
            ShowErrorMessagePopUp(languageResource.resMsg_Error + errorMessage);
        }
    });
}

function ShowWorkOrderDetailModal(ctrl) {
    var rowInfo = ko.dataFor(jQuery(ctrl).closest("tr")[0]);
    var scheduleID = rowInfo[jQuery.ManageMeasurementDocNameSpace.FieldIDInfo.ScheduleID];
    jQuery("#divWorkOrderDetailModal").attr('scheduleid', scheduleID);

    //default selected to 'scheduled' status
    var schdStatusEnumInfo = ko.utils.arrayFirst(workOrderDetailViewModel.WorkOrderStatusList(), function (item) { return item.TypeValue == jQuery.ManageMeasurementDocNameSpace.WorkOrderStatus.Scheduled; });
    if (schdStatusEnumInfo != undefined && schdStatusEnumInfo != null)
        workOrderDetailViewModel.SelectedWorkOrderStatus(schdStatusEnumInfo.TypeValue);
    jQuery("#btnShowAll").removeClass("hide");

    jQuery("#divWorkOrderDetailModal").modal("show");
    LoadScheduleWorkOrderDetails(jQuery.ManageMeasurementDocNameSpace.WorkOrderPagerData);
}

function LoadScheduleWorkOrderDetails(pagerData) {
    workOrderDetailViewModel.ErrorMessage('');
    workOrderDetailViewModel.NoRecordFound(false);
    workOrderDetailViewModel.HTMLPagerContent('');

    var filterInfo = {};
    filterInfo.SiteID = jQuery.ManageMeasurementDocNameSpace.PagerData.SiteID;
    filterInfo.UserID = jQuery.ManageMeasurementDocNameSpace.PagerData.UserID;
    filterInfo.ScheduleID = jQuery("#divWorkOrderDetailModal").attr('scheduleid');
    filterInfo.PageIndex = pagerData.PageIndex;
    filterInfo.PageSize = pagerData.PageSize;

    if (workOrderDetailViewModel.SelectedWorkOrderStatus() != undefined && workOrderDetailViewModel.SelectedWorkOrderStatus() != "")
        filterInfo.Status = workOrderDetailViewModel.SelectedWorkOrderStatus().charCodeAt();

    jQuery.ajax({
        type: "POST",
        url: jQuery.ManageMeasurementDocNameSpace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetScheduleWorkOrderDetails",
        data: JSON.stringify({ pagerData: pagerData, filterInfo: filterInfo }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        success: function (json) {
            if (json != undefined && json.d != undefined && json.d != null) {
                var scheduleWorkOrderDetails = json.d.ScheduleWorkOrderDetails;
                if (scheduleWorkOrderDetails.TotalRecords > 0) {
                    workOrderDetailViewModel.WorkOrderList([]);
                    ko.utils.arrayForEach(scheduleWorkOrderDetails.WorkOrderList, function (item) {
                        item.StatusImage = jQuery.ManageMeasurementDocNameSpace.ImagePath + "/" + jQuery.ManageMeasurementDocNameSpace.WorkOrderStatusEnumInfo[String.fromCharCode(item.Status)].ImageName;
                        item.StatusType = jQuery.ManageMeasurementDocNameSpace.WorkOrderStatusEnumInfo[String.fromCharCode(item.Status)] == undefined ? '' : jQuery.ManageMeasurementDocNameSpace.WorkOrderStatusEnumInfo[String.fromCharCode(item.Status)].DisplayName;
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

    LoadScheduleWorkOrderDetails(jQuery.ManageMeasurementDocNameSpace.WorkOrderPagerData);
}

function ShowAllWorkOrderInfo() {
    workOrderDetailViewModel.SelectedWorkOrderStatus('');
    jQuery("#btnShowAll").addClass("hide");
    LoadScheduleWorkOrderDetails(jQuery.ManageMeasurementDocNameSpace.WorkOrderPagerData);
}

function PopulateRRuleTextLanguageResource(type, content) {
    var data = content.split(']');
    var langResMessage = languageResource.RecurrenceRuleMessage[type];
    var format = jQuery.ManageMeasurementDocNameSpace.RecurrenceRuleConvertFormat[type]
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