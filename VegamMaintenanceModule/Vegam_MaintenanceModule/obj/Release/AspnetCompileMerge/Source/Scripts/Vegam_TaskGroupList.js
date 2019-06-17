jQuery.TaskGroupListNamespace = jQuery.TaskGroupListNamespace || {};
jQuery.TaskGroupListNamespace.BasicParam = jQuery.TaskGroupListNamespace.BasicParam || {};
jQuery.TaskGroupListNamespace.PagerData = jQuery.TaskGroupListNamespace.PagerData || {};
jQuery.TaskGroupListNamespace.FieldIDInfo = jQuery.TaskGroupListNamespace.FieldIDInfo || {};
jQuery.TaskGroupListNamespace.BasePath = "";
jQuery.TaskGroupListNamespace.WebServicePath = "";
jQuery.TaskGroupListNamespace.HeaderStatusInfo = [];

function LoadTaskGroupListPage(gridProperties, basePath) {
    var pagerData = gridProperties.PagerData;
    jQuery.TaskGroupListNamespace.PagerData = pagerData;
    jQuery.TaskGroupListNamespace.BasePath = basePath;
    jQuery.TaskGroupListNamespace.BasicParam.UserID = pagerData.UserID;
    jQuery.TaskGroupListNamespace.BasicParam.SiteID = pagerData.SiteID;
    jQuery.TaskGroupListNamespace.WebServicePath = pagerData.ServicePath;
    jQuery("#divDynamicGridTableHeaderInfo").removeClass("col-xl-4").addClass("col-lg-7");
    GetHeaderStatusType();
    LoadDynamicGridBasicInfo(gridProperties);
}

function GetHeaderStatusType() {
    var basicParam = {};
    basicParam.SiteID = jQuery.TaskGroupListNamespace.BasicParam.SiteID;
    basicParam.UserID = jQuery.TaskGroupListNamespace.BasicParam.UserID;

    jQuery.ajax({
        type: "POST",
        url: jQuery.TaskGroupListNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/GetEnumInfoList",
        data: JSON.stringify({ basicParam: basicParam, EnumType: "MAINT_TASKGROUPSTATUS" }),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data.d !== null) {
                ko.utils.arrayForEach(data.d, function (statusInfo) {
                    var statusTypeInfo = {};
                    statusTypeInfo.DisplayName = statusInfo.DisplayName;                  
                    statusTypeInfo.TypeValue = statusInfo.TypeValue;
                    jQuery.TaskGroupListNamespace.HeaderStatusInfo[statusInfo.TypeValue] = statusTypeInfo;
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

function BindFieldIDVariables() {

    ko.utils.arrayForEach(dynamicGridViewModel.GridFieldList(), function (columnInfo) {
        if (columnInfo.FieldIdentifier != undefined && columnInfo.FieldIdentifier.toLowerCase() == "hdntaskgroupfieldid")
            jQuery.TaskGroupListNamespace.FieldIDInfo.HdnTaskGroupFieldID = columnInfo.FieldID;
        if (columnInfo.FieldIdentifier != undefined && columnInfo.FieldIdentifier.toLowerCase() == "hdntaskidentifierfieldid")
            jQuery.TaskGroupListNamespace.FieldIDInfo.HdnTaskIdentifierFieldID = columnInfo.FieldID;
        if (columnInfo.FieldIdentifier != undefined && columnInfo.FieldIdentifier.toLowerCase() == "hdntaskversionnofieldid")
            jQuery.TaskGroupListNamespace.FieldIDInfo.TaskVersionNumFieldID = columnInfo.FieldID;
        if (columnInfo.FieldIdentifier != undefined && columnInfo.FieldIdentifier.toLowerCase() == "hdntaskapprovedversionfieldid")
            jQuery.TaskGroupListNamespace.FieldIDInfo.TaskApprovedVersionNumFieldID = columnInfo.FieldID;
        if (columnInfo.FieldIdentifier != undefined && columnInfo.FieldIdentifier.toLowerCase() == "maint_taskgroupstatus")
            jQuery.TaskGroupListNamespace.FieldIDInfo.StatusKeyID = columnInfo.FieldID;

    });
}

function CustomGridContentBind(rowInfo, rowIndex, columnInfo) {
    var fieldID = columnInfo.FieldID;
    var fieldIdentifier = columnInfo.FieldIdentifier;
    var content = "";
    if (rowInfo.IsGroupRow) {
        content = rowInfo[fieldID];
    }
    else {
        var rowActionInfoHtml = "";
        var imageShowerHtml = "";
        //Common action field
        if (fieldIdentifier.toLowerCase() == "action") {
            var taskGroupID = rowInfo[jQuery.TaskGroupListNamespace.FieldIDInfo.HdnTaskGroupFieldID];
            var taskGroupIdentifierID = rowInfo[jQuery.TaskGroupListNamespace.FieldIDInfo.HdnTaskIdentifierFieldID];
            var taskVersionNum = rowInfo[jQuery.TaskGroupListNamespace.FieldIDInfo.TaskVersionNumFieldID];
            var taskApprovedVersionNum = rowInfo[jQuery.TaskGroupListNamespace.FieldIDInfo.TaskApprovedVersionNumFieldID];

            var queryString = "?id=" + jQuery.TaskGroupListNamespace.BasicParam.SiteID + "&gid=" + taskGroupIdentifierID + "&v=" + taskVersionNum;
            var editHref = jQuery.TaskGroupListNamespace.BasePath + "/Preventive/TaskGroupInfo.aspx" + queryString;
            content += "<div class='center-align'>";
            //verifying permission 
            if (jQuery.TaskGroupListNamespace.PagerData.PageAccessRights.toLowerCase() == "full_access" || jQuery.TaskGroupListNamespace.PagerData.PageAccessRights.toLowerCase() == "edit_only") {
                rowActionInfoHtml = "<a class='fa fa-edit big tiny-leftmargin tiny-rightmargin v-icon  cursor-pointer' href='" + editHref + "'></a>";
            }
            else {
                rowActionInfoHtml = "<i class='fa fa-edit linkcolor big tiny-leftmargin tiny-rightmargin v-icon  cursor-pointer icon-muted '></i>";;
            }

            if (jQuery.TaskGroupListNamespace.PagerData.PageAccessRights.toLowerCase() == "full_access") {
                rowActionInfoHtml += "<i class='fa fa-trash-o red big tiny-leftmargin tiny-rightmargin v-icon  cursor-pointer' onclick='DeleteTaskGroup(" + taskGroupIdentifierID + "," + taskGroupID + ")'></i>";
            }
            else {
                rowActionInfoHtml += "<i class='fa fa-trash-o red big tiny-leftmargin tiny-rightmargin v-icon  cursor-pointer icon-muted '></i>";
            }

            if (taskApprovedVersionNum != 0 && taskApprovedVersionNum != taskVersionNum) {
                var queryString = "?id=" + jQuery.TaskGroupListNamespace.BasicParam.SiteID + "&gid=" + taskGroupIdentifierID + "&v=" + taskApprovedVersionNum + "&showall=true";
                var path = jQuery.TaskGroupListNamespace.BasePath + "/Preventive/TaskGroupInfo.aspx" + queryString;

                rowActionInfoHtml += "<a class='fa fa-eye blue big tiny-leftmargin tiny-rightmargin v-icon  cursor-pointer' href='" + path + "'></a>";
            }
            else {
                rowActionInfoHtml += "<i class='fa fa-eye blue big tiny-leftmargin tiny-rightmargin v-icon' style='visibility: hidden'></i>";
            }

            content += rowActionInfoHtml;
            content += "</div>";
        }
        else if (fieldIdentifier.toLowerCase() == "maint_taskgroupstatus") {
            var status = rowInfo[jQuery.TaskGroupListNamespace.FieldIDInfo.StatusKeyID];
            var statusDisplayName = jQuery.TaskGroupListNamespace.HeaderStatusInfo[status] == undefined ? '' : jQuery.TaskGroupListNamespace.HeaderStatusInfo[status].DisplayName;
            content = "<span>" + statusDisplayName + "</span>";
        }

    }
    return content;
}

function DeleteTaskGroup(taskIdentifierID, taskGroupID) {
    jQuery("#alertMessage").removeClass("text-info");
    jQuery("#alertMessage").removeClass("text-danger");
    jQuery("#alertMessage").html(languageResource.resMsg_AreYouSureYouWantToDeleteTaskGroup);
    jQuery("#alertModal").dialog({
        modal: true,
        buttons: [
            {
                text: languageResource.resMsg_Confirm,
                click: function () {
                    jQuery("#alertModal").dialog("close");
                    DeleteConfirmedTaskGroup(taskIdentifierID, taskGroupID);
                }
            },
            {
                text: languageResource.resMsg_Cancel,
                click: function () {
                    jQuery("#alertModal").dialog("close");
                    isTrue = false;
                }
            }
        ]
    });
}

function DeleteConfirmedTaskGroup(taskIdentifierID, taskGroupID) {
    jQuery.ajax({
        type: "POST",
        url: jQuery.TaskGroupListNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/DeleteTaskGroupInfo",
        data: JSON.stringify({ basicParam: jQuery.TaskGroupListNamespace.BasicParam, taskIdentifierID: taskIdentifierID, taskGroupID: taskGroupID }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (json) {
            if (json.d != null && json.d != undefined) {
                if (json.d === 1) {
                    ReLoadGridContent();
                } else if (json.d === -1) {
                    ShowPopupMessage(languageResource.resMsg_TaskGroupAlreadyMapped, "error");
                }
                else {
                    ShowPopupMessage(languageResource.resMsg_TaskGroupDeletionFailed, "error");
                }
            }
        },
        error: function (request, error) {
            var errorMessage = "";
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    ShowPopupMessage(languageResource.resMsg_Error + errorMsg.Message, "error");
                else
                    ShowPopupMessage(languageResource.resMsg_TaskGroupDeletionFailed, "error");
            }
            else {
                ShowPopupMessage(languageResource.resMsg_TaskGroupDeletionFailed, "error");
            }

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
        zIndex: 999999,
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


//function DownLoadExcelTemplate() {
//    jQuery("#divUploadExcel").hide();
//    var fileToUpload = jQuery.TaskGroupListNamespace.PagerData.LoadControlID;
//    jQuery("#" + fileToUpload).val('');
//    jQuery("#lblUploadError").removeClass("text-info");
//    jQuery("#lblUploadError").addClass("text-danger");
//    jQuery("#lblUploadError").text('');
//    jQuery("#spnSearchError").text('');
//    jQuery("#spnErrorMessageForExcel").text('');

//    jQuery.ajax({
//        type: "POST",
//        url: jQuery.TaskGroupListNamespace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/DownloadMeasuringPointListTemplate",
//        data: JSON.stringify({ basicParam: jQuery.TaskGroupListNamespace.BasicParam }),
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: function (json) {
//            if (json.d != null) {
//                if (json.d != "") {
//                    TimerMethodsForDownloading(json.d);
//                }
//                else {
//                    jQuery("#spnErrorMessageForExcel").html(languageResource.resMsg_Error + languageResource.resMsg_FailedToDownloadTemplate);
//                }
//            }
//        },
//        beforeSend: function () {
//            jQuery("#spnProgressExcel").removeClass('hide');
//            DisableUploadControls()
//        },
//        error: function (request, error) {
//            EnableUploadControls();
//            jQuery("#spnProgressExcel").addClass('hide');
//            if (request.ResponseText != "") {
//                var errorMsg = jQuery.parseJSON(request.responseText);
//                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
//                    jQuery("#spnErrorMessageForExcel").html(languageResource.resMsg_Error + GetExceptionErrorMessage(errorMsg.Message, request.status));
//                else
//                    jQuery("#spnErrorMessageForExcel").html(languageResource.resMsg_FailedToDownloadTemplate);
//            }
//            else {
//                jQuery("#spnErrorMessageForExcel").html(languageResource.resMsg_FailedToDownloadTemplate);
//            }
//        }
//    });
//}

//donwlaod excel information
function DownloadExcelInfo() {
    jQuery("#lblUploadError").removeClass("text-info");
    jQuery("#lblUploadError").addClass("text-danger");
    jQuery("#lblUploadError").text('');
    jQuery("#divUploadExcel").hide();
    jQuery("#spnSearchError").text('');
    jQuery("#spnErrorMessageForExcel").text('');
    var fileToUpload = jQuery.TaskGroupListNamespace.PagerData.LoadControlID;
    jQuery("#" + fileToUpload).val('');

    var filter = {};
    filter.SiteID = jQuery.TaskGroupListNamespace.PagerData.SiteID;
    filter.UserID = jQuery.TaskGroupListNamespace.PagerData.UserID;
    filter.DynamicGridObjectID = jQuery.DynamicGridNamespace.ObjectID;

    var isValid = true;
    filter.DynamicGridSearchInfo = {};
    filter.DynamicGridSearchInfo.DynamicGridSearchFieldValueInfoList = [];

    if (jQuery.DynamicGridNamespace.IsSearch) {
        var searchValueInfo = GetFilterValues(false);
        isValid = searchValueInfo.IsValid;
        if (isValid == true)
            filter.DynamicGridSearchInfo.DynamicGridSearchFieldValueInfoList = searchValueInfo.FilterFieldValueList;
    }

    if (!isValid)
        return false;

    jQuery.ajax({
        type: "POST",
        url: jQuery.TaskGroupListNamespace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/DownloadMeasuringPointListExcel",
        data: JSON.stringify({ filter: filter }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if (json.d != null) {
                if (json.d != "") {
                    TimerMethodsForDownloading(json.d);
                }
                else {
                    jQuery("#spnErrorMessageForExcel").html(languageResource.resMsg_Error + languageResource.resMsg_FailedToDownloadInfo);
                }
            }
        },
        beforeSend: function () {
            jQuery("#spnProgressExcel").removeClass('hide');
            DisableUploadControls()
        },
        error: function (request, error) {
            EnableUploadControls();
            jQuery("#spnProgressExcel").addClass('hide');
            if (request.ResponseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    jQuery("#spnErrorMessageForExcel").html(languageResource.resMsg_Error + GetExceptionErrorMessage(errorMsg.Message, request.status));
                else
                    jQuery("#spnErrorMessageForExcel").html(languageResource.resMsg_FailedToDownloadInfo);
            }
            else {
                jQuery("#spnErrorMessageForExcel").html(languageResource.resMsg_FailedToDownloadInfo);
            }
        }
    });
}

function TimerMethodsForDownloading(ExcelFileName) {
    var successTimer;
    var errorTimer;
    var successTextFile = ExcelFileName + "_tempSuccess.txt";
    var errorTextFile = ExcelFileName + "_tempError.txt";
    var excelFileName = ExcelFileName + ".xls";
    successTimer = setInterval(function () {
        jQuery.ajax({
            type: "POST",
            url: jQuery.TaskGroupListNamespace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/CheckFileExist",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ fileName: successTextFile }),
            dataType: "json",
            success: function (json) {
                if (json.d != null) {
                    if (json.d != false) {
                        clearInterval(successTimer);
                        clearInterval(errorTimer);
                        jQuery("#spnProgressExcel").addClass('hide');
                        EnableUploadControls();
                        window.location = jQuery.TaskGroupListNamespace.BasePath + "/HandlerFiles/DownLoadHandler.ashx?MeasuringPointInfoExcel=" + excelFileName;

                    }
                }
            },
            error: function (request, error) {
                EnableUploadControls();
                clearInterval(successTimer);
                clearInterval(errorTimer);
                jQuery("#spnProgressExcel").addClass('hide');
                if (request.ResponseText != "") {
                    var errorMsg = jQuery.parseJSON(request.responseText);
                    if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                        jQuery("#spnErrorMessageForExcel").html(languageResource.resMsg_Error + GetExceptionErrorMessage(errorMsg.Message, request.status));
                    else
                        jQuery("#spnErrorMessageForExcel").html(languageResource.resMsg_Error + languageResource.resMsg_FailedToPerformOperation);
                }
                else {
                    jQuery("#spnErrorMessageForExcel").html(languageResource.resMsg_Error + languageResource.resMsg_FailedToPerformOperation);
                }
            }
        });

    }, 10000);
    errorTimer = setInterval(function () {
        jQuery.ajax({
            type: "POST",
            url: jQuery.TaskGroupListNamespace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/CheckFileExist",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ fileName: errorTextFile }),
            dataType: "json",
            success: function (json) {
                if (json.d) {
                    jQuery.get(jQuery.TaskGroupListNamespace.BasePath + "/HandlerFiles/DownLoadHandler.ashx?MeasuringPointInfoExcel=" + excelFileName, function (data) {
                        clearInterval(successTimer);
                        clearInterval(errorTimer);
                        jQuery("#spnErrorMessageForExcel").empty();
                        jQuery("#spnErrorMessageForExcel").html(data);
                        jQuery("#spnProgressExcel").addClass('hide');
                        EnableUploadControls();
                    });
                }
            },
            error: function (request, error) {
                clearInterval(successTimer);
                clearInterval(errorTimer);
                jQuery("#spnProgressExcel").addClass('hide');
                EnableUploadControls();
                if (request.ResponseText != "") {
                    var errorMsg = jQuery.parseJSON(request.responseText);
                    if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                        jQuery("#spnErrorMessageForExcel").html(languageResource.resMsg_Error + GetExceptionErrorMessage(errorMsg.Message, request.status));
                    else
                        jQuery("#spnErrorMessageForExcel").html(languageResource.resMsg_Error + languageResource.resMsg_FailedToPerformOperation);
                }
                else {
                    jQuery("#spnErrorMessageForExcel").html(languageResource.resMsg_Error + languageResource.resMsg_FailedToPerformOperation);
                }
            }
        });
    }, 10000);
}

//upload file
//function UploadTaskGroupInfo() {
//    var fileToUpload = jQuery.TaskGroupListNamespace.PagerData.LoadControlID;
//    var btnUploadExcel = jQuery.TaskGroupListNamespace.PagerData.LoadControlID.replace("uploadFile", "btnUploadExcel");
//    var control = "#" + fileToUpload;
//    jQuery("#lblUploadError").removeClass("text-info");
//    jQuery("#lblUploadError").addClass("text-danger");
//    jQuery("#lblUploadError").text('');
//    jQuery("#spnSearchError").text('');
//    jQuery("#spnErrorMessageForExcel").text('');

//    var isValid = true;
//    var data = jQuery("#" + fileToUpload).val().split('\\').pop();
//    var extension = data.substring(data.lastIndexOf('.') + 1).toLowerCase();
//    if (extension != "xls" && extension != "xlsx") {
//        isValid = false;
//        jQuery("#lblUploadError").html(languageResource.resMsg_InvalidFileFormat);
//    }
//    if (jQuery.TaskGroupListNamespace.PagerData.SiteID == 0 || jQuery.TaskGroupListNamespace.PagerData.UserID == 0) {
//        jQuery("#lblUploadError").html(languageResource.resMsg_InvalidSiteOrUser);
//    }

//    if (isValid) {
//        jQuery.ajaxFileUpload({
//            type: "POST",
//            url: jQuery.TaskGroupListNamespace.BasePath + "/HandlerFiles/MeasuringPointUploadHandler.ashx" + '?sid=' + jQuery.TaskGroupListNamespace.PagerData.SiteID +
//            '&uid=' + jQuery.TaskGroupListNamespace.PagerData.UserID,
//            fileElementId: fileToUpload,
//            success: function (data, status) {
//                var handlerMsg = data.documentElement.innerText;
//                var message = handlerMsg.split(',');
//                if (message[0] != "false") {
//                    var fileName = message[1];
//                    jQuery("#spnProgressExcel").removeClass('hide');
//                    TimerMethodForUpload(fileName);
//                }
//                else {
//                    jQuery("#spnProgressExcel").addClass('hide');
//                    jQuery("#lblUploadError").text(message[1]);
//                    jQuery(control).val('');
//                    EnableUploadControls();
//                }
//                if (navigator.userAgent.search("MSIE") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
//                {
//                    var control = jQuery("#" + fileToUpload);
//                    control.replaceWith(control = control.clone(true));
//                }

//            },
//            beforeSend: function () {
//                jQuery("#spnProgressExcel").removeClass('hide');
//                DisableUploadControls();
//            },
//            error: function (request, error) {
//                if (request.responseText != "") {
//                    EnableUploadControls();
//                    jQuery("#spnProgressExcel").addClass('hide');
//                    control.replaceWith(control = control.val('').clone(true));
//                    var message = jQuery.parseJSON(request.responseText);
//                    if (message != undefined && message != "" && message.Message != undefined && message.Message != "") {
//                        jQuery("#lblUploadError").text(languageResource.resMsg_Error + message.Message);
//                    }
//                    else {
//                        jQuery("#lblUploadError").text(languageResource.resMsg_FailedToUpload);
//                    }
//                }
//                else {
//                    jQuery("#lblUploadError").text(languageResource.resMsg_FailedToUpload);
//                }
//            }
//        });
//        if (navigator.userAgent.search("MSIE") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
//        {
//            control = jQuery("#" + fileToUpload);
//            control.replaceWith(control = control.clone(true));
//        }

//    }
//    else {
//        if (navigator.userAgent.search("MSIE") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
//        {
//            control = jQuery("#" + fileToUpload);
//            control.replaceWith(control = control.clone(true));
//        }

//    }
//}

function TimerMethodForUpload(fileName) {
    var fileToUpload = jQuery.TaskGroupListNamespace.PagerData.LoadControlID;
    var btnUploadExcel = jQuery.TaskGroupListNamespace.PagerData.LoadControlID.replace("uploadFile", "btnUploadExcel");

    DisableUploadControls();
    var successTimer;
    var errorTimer;
    var successTxtFile = fileName + "_tempSuccess.txt";
    var errorFileName = fileName + "_tempError.txt";

    successTimer = setInterval(function () {
        jQuery.ajax({
            type: "POST",
            url: jQuery.TaskGroupListNamespace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/CheckFileExist",
            data: JSON.stringify({ fileName: successTxtFile }),
            contentType: "Application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                if (json.d) {
                    clearInterval(successTimer);
                    clearInterval(errorTimer);
                    EnableUploadControls();
                    window.location = jQuery.TaskGroupListNamespace.BasePath + "/HandlerFiles/DownLoadHandler.ashx?MeasuringPointInfoLogFile=" + successTxtFile;
                    jQuery.TaskGroupListNamespace.PagerData.PageIndex = 0;
                    jQuery.TaskGroupListNamespace.PagerData.CurrentPage = 0;
                    jQuery("#btnShowAll").addClass('hide');
                    jQuery("#divUploadExcel").hide();
                    jQuery("#spnProgressExcel").addClass('hide');
                    LoadDynamicGridContent(jQuery.TaskGroupListNamespace.PagerData);
                }
            },
            error: function (request, error) {
                jQuery("#spnProgressExcel").addClass('hide');
                clearInterval(successTimer);
                clearInterval(errorTimer);
                EnableUploadControls();
                if (request.responseText != "") {
                    var message = jQuery.parseJSON(request.responseText);
                    if (message != undefined && message != "" && message.Message != undefined && message.Message != "") {
                        jQuery("#lblUploadError").text(languageResource.resMsg_Error + message.Message);
                    }
                    else {
                        jQuery("#lblUploadError").text(languageResource.resMsg_FailedToUpload);
                    }
                }
                else {
                    jQuery("#lblUploadError").text(languageResource.resMsg_FailedToUpload);
                }
            }
        });
    }, 10000);

    errorTimer = setInterval(function () {
        jQuery.ajax({
            type: "POST",
            url: jQuery.TaskGroupListNamespace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/CheckFileExist",
            data: JSON.stringify({ fileName: errorFileName }),
            contentType: "Application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                if (json.d) {
                    jQuery.get(jQuery.TaskGroupListNamespace.BasePath + '/HandlerFiles/DownloadHandler.ashx?MeasuringPointInfoLogFile=' + errorFileName, function (data) {
                        clearInterval(successTimer);
                        clearInterval(errorTimer);
                        EnableUploadControls();
                        var indexOfError = data.indexOf('Error :');
                        jQuery("#spnProgressExcel").addClass('hide');
                        jQuery("#lblUploadError").text(data.substring(indexOfError + 7, data.length));
                        if (data.indexOf('Inserted :0') != -1 && data.indexOf('Updated :0') != -1 && data.indexOf('Failure :0') != -1) {
                            //do nothing
                        }
                        else {
                            window.location = jQuery.TaskGroupListNamespace.BasePath + "/HandlerFiles/DownloadHandler.ashx?MeasuringPointInfoLogFile=" + errorFileName;
                        }

                    });
                }
            },
            error: function (request, error) {
                jQuery("#spnProgressExcel").addClass('hide');
                clearInterval(successTimer);
                clearInterval(errorTimer);
                EnableUploadControls();
                if (request.responseText != "") {
                    var message = jQuery.parseJSON(request.responseText);
                    if (message != undefined && message != "" && message.Message != undefined && message.Message != "") {
                        jQuery("#lblUploadError").text(languageResource.resMsg_Error + message.Message);
                    }
                    else {
                        jQuery("#lblUploadError").text(languageResource.resMsg_FailedToUpload);
                    }
                }
                else {
                    jQuery("#lblUploadError").text(languageResource.resMsg_FailedToUpload);
                }
            }
        });
    }, 10000);
}

function EnableUploadControls() {
    var fileToUpload = jQuery.TaskGroupListNamespace.PagerData.LoadControlID;
    var btnUploadExcel = jQuery.TaskGroupListNamespace.PagerData.LoadControlID.replace("uploadFile", "btnUploadExcel");

    if (jQuery.TaskGroupListNamespace.PagerData.PageAccessRights == "FULL_ACCESS") {
        jQuery("#" + btnUploadExcel).removeAttr('disabled');
        jQuery("#" + fileToUpload).removeAttr('disabled');
    }
    jQuery("#btnDownloadExcel").removeAttr('disabled');
    jQuery("#btnDownloadTemplate").removeAttr('disabled');

}

function DisableUploadControls() {
    var fileToUpload = jQuery.TaskGroupListNamespace.PagerData.LoadControlID;
    var btnUploadExcel = jQuery.TaskGroupListNamespace.PagerData.LoadControlID.replace("uploadFile", "btnUploadExcel");
    jQuery("#btnDownloadExcel").attr('disabled', 'disabled');
    jQuery("#" + btnUploadExcel).attr('disabled', 'disabled');
    jQuery("#btnDownloadTemplate").attr('disabled', 'disabled');
    jQuery("#" + fileToUpload).attr('disabled', 'disabled');
}

function ShowUploadDiv() {
    jQuery("#spnUploadProgress").addClass('hide');
    jQuery("#lblUploadError").text("");
    jQuery("#divUploadExcel").slideToggle();
    var fileToUpload = jQuery.TaskGroupListNamespace.PagerData.LoadControlID;
    jQuery("#" + fileToUpload).val('');
}

function AddNewTaskGroup() {
    var queryString = "?id=" + jQuery.TaskGroupListNamespace.BasicParam.SiteID + "&gid=0&v=0";
    window.location = jQuery.TaskGroupListNamespace.BasePath + "/Preventive/TaskGroupInfo.aspx" + queryString;
}