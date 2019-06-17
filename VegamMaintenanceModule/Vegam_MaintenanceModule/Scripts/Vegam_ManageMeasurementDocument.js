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
jQuery.ManageMeasurementDocNameSpace.ScheduleStatus = { 'Created': 'CREATED', 'Released': 'RELEASED', 'Cancelled': 'CANCELLED', 'Scheduling': 'SCHEDULING' };
jQuery.ManageMeasurementDocNameSpace.ScheduleTypeList = { 'Schedule': 'S', 'WorkOrder': 'W', 'Inspection': 'I' };
jQuery.ManageMeasurementDocNameSpace.WorkOrderStatusEnumInfo = {};
jQuery.ManageMeasurementDocNameSpace.WorkOrderStatus = { 'Scheduled': 'SCHEDULED', 'InProgress': 'INPROGRESS', 'Completed': 'COMPLETED', 'OverDue': 'OVERDUE', 'Cancelled': 'CANCELLED', 'Closed': 'CLOSED' };
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

    if (dynamicGridProperties.PagerData.AccessLevelID != 5)
        jQuery.DynamicGridNamespace.FeatureAdditionalInfo = 'ADMINUSER';
    else
        jQuery.DynamicGridNamespace.FeatureAdditionalInfo = 'PLANTUSER';

    LoadDynamicGridBasicInfo(dynamicGridProperties);
    ManageSiteMapUrl();
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
            else if (columnInfo.FieldIdentifier.toLowerCase() == "fschd_rule_desc_type")
                jQuery.ManageMeasurementDocNameSpace.FieldIDInfo.ScheduleRuleDescTypeFieldID = columnInfo.FieldID;
            else if (columnInfo.FieldIdentifier != undefined && columnInfo.FieldIdentifier.toLowerCase() == "userid")
                jQuery.ManageMeasurementDocNameSpace.FieldIDInfo.UserIDFieldID = columnInfo.FieldID;
        }
    });
}

function CustomGridContentBind(rowInfo, rowIndex, columnInfo) {
    var fieldID = columnInfo.FieldID;
    var fieldIdentifier = columnInfo.FieldIdentifier;
    var content = "";

    if (fieldIdentifier.toLowerCase() == "action") {
        content += "<div class='center-align'>";
        content += jQuery.ManageMeasurementDocNameSpace.EditScheduleHTML + jQuery.ManageMeasurementDocNameSpace.DeleteScheduleHTML;
        content += "</div>";
    }
    else if (fieldIdentifier.toLowerCase() == "fmeaspoints") {
        var measPointInfo = rowInfo[jQuery.ManageMeasurementDocNameSpace.FieldIDInfo.MeasuringPointID];
        if (measPointInfo.length > 60) {
            content = "<span class='pull-xs-left'><i class='fa fa-info-circle blue font-big tiny-rightmargin' data-placement='left'  onmouseover='ShowMeasPointInfoInfo(this,\"" + measPointInfo + "\");return false;' onmouseout='HideMeasPointInfo(this);return false;' />" + "<span>" + rowInfo[fieldID].substring(0, 60) + "...</span></span>";
        }
        else {
            content = rowInfo[fieldID];
        }
    }
    else if (fieldIdentifier.toLowerCase() == "fworkgroup") {
        var assigneeInfo = rowInfo[jQuery.ManageMeasurementDocNameSpace.FieldIDInfo.AssigneeID];
        var reportToInfo = rowInfo[jQuery.ManageMeasurementDocNameSpace.FieldIDInfo.ReportToID];
        if (assigneeInfo != "" || reportToInfo != "") {
            content = "<span class='pull-xs-left'><i class='fa fa-info-circle blue font-big tiny-rightmargin' data-placement='right' onmouseover='ShowWorkGroupInfo(this,\"" + assigneeInfo + "\",\"" + reportToInfo + "\");return false;' onmouseout='HideWorkGroupInfo(this);return false;'/>" + "<span>" + rowInfo[fieldID] + "</span></span>";
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
        if (rowInfo[jQuery.ManageMeasurementDocNameSpace.FieldIDInfo.ScheduleStatusValueFieldID] != jQuery.ManageMeasurementDocNameSpace.ScheduleStatus.Created)
            content = "<span class='pull-xs-left nowrap'> <i class='fa fa-table blue font-big tiny-rightmargin cursor-pointer pover' data-content='list of work orders' data-placement='top' data-original-title='' title='' onclick='ShowWorkOrderDetailModal(this,true);return false;'/>" + "<span>" + rowInfo[fieldID] + "</span></span>";
        else
            content = rowInfo[fieldID];
    }
    else if (fieldIdentifier.toLowerCase() == "fmaintenancename") {
        content = rowInfo[fieldID];
    } else if (fieldIdentifier.toLowerCase() == "maint_schedulestatus") {
        var className = GetClassForScheduleStatus(rowInfo[jQuery.ManageMeasurementDocNameSpace.FieldIDInfo.ScheduleStatusTextFieldID]);
        var statuscolumnIndex = -1;
        jQuery("#tblDynamicGrid th").each(function (thIndex) {
            if (jQuery(this).attr("fieldid") == jQuery.ManageMeasurementDocNameSpace.FieldIDInfo.ScheduleStatusTextFieldID)
                statuscolumnIndex = thIndex;
        });
        jQuery("#tbDynamicGrid").find("tr:eq(" + rowIndex + ")").find("td:eq(" + statuscolumnIndex + ")").addClass(className);
        content = rowInfo[fieldID];
    }

    jQuery(".td-center").closest("td").addClass("center-align");
    return content;
}

function GetCustomFilters(gridContentFilter) {
    if (jQuery.DynamicGridNamespace.FeatureAdditionalInfo == 'PLANTUSER') {
        var userIDField = {};
        userIDField.FieldID = jQuery.ManageMeasurementDocNameSpace.FieldIDInfo.UserIDFieldID;
        userIDField.FilterValueList = [];
        userIDField.FilterValueList.push(jQuery.ManageMeasurementDocNameSpace.BasicParam.UserID);
        gridContentFilter.GridFilteredFieldInfoValueList.push(userIDField);
    }
}

function AddNewSchedule() {
    SaveDynamicGridFilterValues();
    window.location.href = jQuery.ManageMeasurementDocNameSpace.BasePath + "/Preventive/MeasurementDocument.aspx?id=" + jQuery.ManageMeasurementDocNameSpace.PagerData.SiteID;
}

function EditScheduleInfo(editCtl) {
    SaveDynamicGridFilterValues();
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
    filterInfo.MaintScheduleType = jQuery.ManageMeasurementDocNameSpace.ScheduleTypeList.Inspection.charCodeAt();

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

//#region release and cancel schedule option is removed
//function ActivateScheduleInfoCinfirm(ctrl) {
//    jQuery("#alertMessage").removeClass("text-danger");
//    if (jQuery(ctrl).find("span[name='activate']").text() == languageResource.resMsg_InActivate)
//        jQuery("#alertMessage").html(languageResource.resMsg_UpdateScheduleStatusInActiveConfirm);
//    else
//        jQuery("#alertMessage").html(languageResource.resMsg_UpdateScheduleStatusActiveConfirm);
//    jQuery("#confirmModal").dialog({
//        zIndex: 1060,
//        closeOnEscape: false,
//        open: function (event, ui) {
//            jQuery(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
//            jQuery(".ui-widget-overlay").css('z-index', '10043');
//        },
//        modal: true,
//        buttons: [
//            {
//                text: languageResource.resMsg_Confirm,
//                click: function () {
//                    jQuery("#confirmModal").dialog("close");
//                    ActivateScheduleInfo(ctrl);
//                }
//            },
//            {
//                text: languageResource.resMsg_Cancel,
//                click: function () {

//                    jQuery("#confirmModal").dialog("close");
//                    isTrue = false;
//                }
//            }
//        ]
//    });
//}

//function ActivateScheduleInfo(ctrl) {
//    var rowInfo = ko.dataFor(jQuery(ctrl).closest("tr")[0]);
//    var scheduleID = rowInfo[jQuery.ManageMeasurementDocNameSpace.FieldIDInfo.ScheduleID];

//    var filterInfo = {};
//    filterInfo.SiteID = jQuery.ManageMeasurementDocNameSpace.PagerData.SiteID;
//    filterInfo.UserID = jQuery.ManageMeasurementDocNameSpace.PagerData.UserID;
//    filterInfo.MaintScheduleID = scheduleID;

//    var serviceMethod = "ActivateMaintenanceSchedule";
//    var activate = true;
//    if (jQuery(ctrl).find("span[name='activate']").text() == languageResource.resMsg_InActivate) {
//        serviceMethod = "InActivateMaintenanceSchedule";
//        activate = false;
//    }

//    jQuery.ajax({
//        type: "POST",
//        url: jQuery.ManageMeasurementDocNameSpace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/" + serviceMethod,
//        data: JSON.stringify({ filterInfo: filterInfo }),
//        contentType: "application/json; charset=utf-8",
//        datatype: 'json',
//        success: function (json) {
//            if (json != undefined && json.d != undefined && json.d == true) {
//                var scheduleStatuscolumnIndex = -1;
//                jQuery("#tblDynamicGrid th").each(function (thIndex) {
//                    if (jQuery(this).attr("fieldid") == jQuery.ManageMeasurementDocNameSpace.FieldIDInfo.ScheduleStatusTextFieldID)
//                        scheduleStatuscolumnIndex = thIndex;
//                });
//                if (activate) {
//                    jQuery(ctrl).find("span[name='activate']").text(languageResource.resMsg_InActivate);
//                    jQuery(ctrl).find("i").removeClass("fa-play").addClass("fa-stop");
//                    jQuery(ctrl).find("span[name='activate']").closest("li").hide();
//                    jQuery(ctrl).closest("tr").find("td:eq(" + scheduleStatuscolumnIndex + ") span").html(jQuery.ManageMeasurementDocNameSpace.ScheduleStatusInfoForGrid[jQuery.ManageMeasurementDocNameSpace.ScheduleStatus.Scheduling].DisplayName);
//                    rowInfo[jQuery.ManageMeasurementDocNameSpace.FieldIDInfo.ScheduleStatusTextFieldID] = jQuery.ManageMeasurementDocNameSpace.ScheduleStatusInfoForGrid[jQuery.ManageMeasurementDocNameSpace.ScheduleStatus.Scheduling].DisplayName;
//                    ShowErrorMessagePopUp(languageResource.resMsg_SuccessfullyActivatedSchedule, false);
//                }
//                else {
//                    jQuery(ctrl).find("span[name='activate']").text(languageResource.resMsg_Activate);
//                    jQuery(ctrl).find("i").removeClass("fa-stop").addClass("fa-play");
//                    ShowErrorMessagePopUp(languageResource.resMsg_SuccessfullyInActivatedSchedule, false);
//                    jQuery(ctrl).closest("tr").find("td:eq(" + scheduleStatuscolumnIndex + ") span").html(jQuery.ManageMeasurementDocNameSpace.ScheduleStatusInfoForGrid[jQuery.ManageMeasurementDocNameSpace.ScheduleStatus.Cancelled].DisplayName);
//                    rowInfo[jQuery.ManageMeasurementDocNameSpace.FieldIDInfo.ScheduleStatusTextFieldID] = jQuery.ManageMeasurementDocNameSpace.ScheduleStatusInfoForGrid[jQuery.ManageMeasurementDocNameSpace.ScheduleStatus.Cancelled].DisplayName;
//                }
//            }
//            else {
//                if (activate)
//                    ShowErrorMessagePopUp(languageResource.resMsg_FailedToActivateSchedule, true);
//                else
//                    ShowErrorMessagePopUp(languageResource.resMsg_FailedToInActivateSchedule, true);
//            }
//        },
//        error: function (request, error) {
//            var msg = languageResource.resMsg_FailedToInActivateSchedule;
//            if (activate)
//                msg = languageResource.resMsg_FailedToActivateSchedule;
//            var errorMessage = languageResource.resMsg_Error + msg;
//            if (request.responseText != "") {
//                var errorMsg = jQuery.parseJSON(request.responseText);
//                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
//                    errorMessage = languageResource.resMsg_Error + errorMsg.Message;
//            }
//            ShowErrorMessagePopUp(errorMessage, true);
//        }
//    });
//}

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

function ShowWorkOrderDetailModal(ctrl, isShowScheduled) {
    var rowInfo = ko.dataFor(jQuery(ctrl).closest("tr")[0]);
    var scheduleID = rowInfo[jQuery.ManageMeasurementDocNameSpace.FieldIDInfo.ScheduleID];
    jQuery("#divWorkOrderDetailModal").attr('scheduleid', scheduleID);

    //default selected to 'scheduled' status
    if (isShowScheduled)
        var schdStatusEnumInfo = ko.utils.arrayFirst(workOrderDetailViewModel.WorkOrderStatusList(), function (item) { return item.TypeValue == jQuery.ManageMeasurementDocNameSpace.WorkOrderStatus.Scheduled; });
    if (schdStatusEnumInfo != undefined && schdStatusEnumInfo != null) {
        workOrderDetailViewModel.SelectedWorkOrderStatus(schdStatusEnumInfo.TypeValue);
        jQuery("#btnShowAll").removeClass("hide");
    }
    else {
        workOrderDetailViewModel.SelectedWorkOrderStatus('');
        jQuery("#btnShowAll").addClass("hide");
    }
    jQuery(ctrl).popover('hide');
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
        filterInfo.Status = workOrderDetailViewModel.SelectedWorkOrderStatus();

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
                        item.StatusImage = jQuery.ManageMeasurementDocNameSpace.ImagePath + "/" + jQuery.ManageMeasurementDocNameSpace.WorkOrderStatusEnumInfo[item.Status].ImageName;
                        item.StatusType = jQuery.ManageMeasurementDocNameSpace.WorkOrderStatusEnumInfo[item.Status] == undefined ? '' : jQuery.ManageMeasurementDocNameSpace.WorkOrderStatusEnumInfo[item.Status].DisplayName;
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
        beforeSend: function () {
            workOrderDetailViewModel.WorkOrderList.removeAll();
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
    jQuery("#btnSearch").focus();
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

function ManageSiteMapUrl() {
    var scheduleURL = jQuery.ManageMeasurementDocNameSpace.BasePath + "/MaintenanceIndex.aspx?id=" + jQuery.ManageMeasurementDocNameSpace.BasicParam.SiteID;

    jQuery("#lnkAdminTab,#A1").attr("isSetDefault", "false");
    jQuery("#lnkAdminTab").attr("href", scheduleURL); // Set herf value
    jQuery("#A1").attr("href", scheduleURL); // Set herf value
}

function GetClassForScheduleStatus(status) {
    if (status != null) {
        switch (status.toUpperCase()) {
            case jQuery.ManageMeasurementDocNameSpace.ScheduleStatus.Created: return 'td-blue';
            case jQuery.ManageMeasurementDocNameSpace.ScheduleStatus.Released: return 'td-navyBlue';
            case jQuery.ManageMeasurementDocNameSpace.ScheduleStatus.Cancelled: return 'td-grey';
            case jQuery.ManageMeasurementDocNameSpace.ScheduleStatus.Scheduling: return 'td-orange';
            default: return '';
        }
    }
}