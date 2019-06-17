jQuery.MeasuringPointListNameSpace = jQuery.MeasuringPointListNameSpace || {};
jQuery.MeasuringPointListNameSpace.BasicParam = jQuery.MeasuringPointListNameSpace.BasicParam || {};
jQuery.MeasuringPointListNameSpace.PagerData = jQuery.MeasuringPointListNameSpace.PagerData || {};
jQuery.MeasuringPointListNameSpace.BasePath = "";
jQuery.MeasuringPointListNameSpace.FieldIDInfo = jQuery.MeasuringPointListNameSpace.FieldIDInfo || {};
jQuery.MeasuringPointListNameSpace.FieldIDInfo.HdnMeasuringPointID = "";


function LoadMeasuringPointListPage(gridProperties, basePath) {
    var pagerData = gridProperties.PagerData;
    jQuery.MeasuringPointListNameSpace.PagerData = pagerData;
    jQuery.MeasuringPointListNameSpace.BasePath = basePath;
    jQuery.MeasuringPointListNameSpace.BasicParam.UserID = pagerData.UserID;
    jQuery.MeasuringPointListNameSpace.BasicParam.SiteID = pagerData.SiteID;

    jQuery("#divDynamicGridTableHeaderInfo").removeClass("col-xl-4").addClass("col-lg-7");

    LoadDynamicGridBasicInfo(gridProperties);

}

function BindFieldIDVariables() {
    ko.utils.arrayForEach(dynamicGridViewModel.GridFieldList(), function (columnInfo) {
        if (columnInfo.FieldIdentifier != undefined && columnInfo.FieldIdentifier.toLowerCase() == "hdnmeasuringpointid")
            jQuery.MeasuringPointListNameSpace.FieldIDInfo.HdnMeasuringPointID = columnInfo.FieldID;       
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
      
        //Common action field
        if (fieldIdentifier.toLowerCase() == "action") {
            var measuringPointID = rowInfo[jQuery.MeasuringPointListNameSpace.FieldIDInfo.HdnMeasuringPointID];
            var editHref = jQuery.MeasuringPointListNameSpace.BasePath + "/Preventive/AddMeasuringPoint.aspx?id=" + jQuery.MeasuringPointListNameSpace.BasicParam.SiteID + "&mpid=" + measuringPointID;
            content += "<div class='center-align'>";
            //verifying permission        
                rowActionInfoHtml = "<a class='fa fa-edit big tiny-leftmargin tiny-rightmargin v-icon  cursor-pointer' href='" + editHref + "'></a>";
                     
            if (jQuery.MeasuringPointListNameSpace.PagerData.PageAccessRights.toLowerCase() == "full_access") {
                rowActionInfoHtml += "<i class='fa fa-trash-o red big tiny-leftmargin tiny-rightmargin v-icon  cursor-pointer' onclick='DeleteMeasuringPoint(" + measuringPointID + ")'></i>";
            }
            else {
                rowActionInfoHtml += "<i class='fa fa-trash-o red big tiny-leftmargin tiny-rightmargin v-icon  cursor-pointer icon-muted '></i>";
            }

            content += rowActionInfoHtml;
            content += "</div>";
        }

    }
    return content;
}

function DownLoadExcelTemplate() {
    jQuery("#divUploadExcel").hide();
    var fileToUpload = jQuery.MeasuringPointListNameSpace.PagerData.LoadControlID;
    jQuery("#" + fileToUpload).val('');
    jQuery("#lblUploadError").removeClass("text-info");
    jQuery("#lblUploadError").addClass("text-danger");
    jQuery("#lblUploadError").text('');
    jQuery("#spnSearchError").text('');
    jQuery("#spnErrorMessageForExcel").text('');

    jQuery.ajax({
        type: "POST",
        url: jQuery.MeasuringPointListNameSpace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/DownloadMeasuringPointListTemplate",
        data: JSON.stringify({ basicParam: jQuery.MeasuringPointListNameSpace.BasicParam }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if (json.d != null) {
                if (json.d != "") {
                    TimerMethodsForDownloading(json.d);
                }
                else {
                    jQuery("#spnErrorMessageForExcel").html(languageResource.resMsg_Error + languageResource.resMsg_FailedToDownloadTemplate);
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
                    jQuery("#spnErrorMessageForExcel").html(languageResource.resMsg_FailedToDownloadTemplate);
            }
            else {
                jQuery("#spnErrorMessageForExcel").html(languageResource.resMsg_FailedToDownloadTemplate);
            }
        }
    });
}

//donwlaod excel information
function DownloadExcelInfo() {
    jQuery("#lblUploadError").removeClass("text-info");
    jQuery("#lblUploadError").addClass("text-danger");
    jQuery("#lblUploadError").text('');
    jQuery("#divUploadExcel").hide();
    jQuery("#spnSearchError").text('');
    jQuery("#spnErrorMessageForExcel").text('');
    var fileToUpload = jQuery.MeasuringPointListNameSpace.PagerData.LoadControlID;
    jQuery("#" + fileToUpload).val('');

    var filter = {};
    filter.SiteID = jQuery.MeasuringPointListNameSpace.PagerData.SiteID;
    filter.UserID = jQuery.MeasuringPointListNameSpace.PagerData.UserID;
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
        url: jQuery.MeasuringPointListNameSpace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/DownloadMeasuringPointListExcel",
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
            url: jQuery.MeasuringPointListNameSpace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/CheckFileExist",
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
                        window.location = jQuery.MeasuringPointListNameSpace.BasePath + "/HandlerFiles/DownLoadHandler.ashx?MeasuringPointInfoExcel=" + excelFileName;

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
            url: jQuery.MeasuringPointListNameSpace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/CheckFileExist",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ fileName: errorTextFile }),
            dataType: "json",
            success: function (json) {
                if (json.d) {
                    jQuery.get(jQuery.MeasuringPointListNameSpace.BasePath + "/HandlerFiles/DownLoadHandler.ashx?MeasuringPointInfoExcel=" + excelFileName, function (data) {
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
function UploadMeasuringPointInfo() {
    var fileToUpload = jQuery.MeasuringPointListNameSpace.PagerData.LoadControlID;
    var btnUploadExcel = jQuery.MeasuringPointListNameSpace.PagerData.LoadControlID.replace("uploadFile", "btnUploadExcel");
    var control = "#" + fileToUpload;
    jQuery("#lblUploadError").removeClass("text-info");
    jQuery("#lblUploadError").addClass("text-danger");
    jQuery("#lblUploadError").text('');
    jQuery("#spnSearchError").text('');
    jQuery("#spnErrorMessageForExcel").text('');

    var isValid = true;
    var data = jQuery("#" + fileToUpload).val().split('\\').pop();
    var extension = data.substring(data.lastIndexOf('.') + 1).toLowerCase();
    if (extension != "xls" && extension != "xlsx") {
        isValid = false;
        jQuery("#lblUploadError").html(languageResource.resMsg_InvalidFileFormat);
    }
    if (jQuery.MeasuringPointListNameSpace.PagerData.SiteID == 0 || jQuery.MeasuringPointListNameSpace.PagerData.UserID == 0) {
        jQuery("#lblUploadError").html(languageResource.resMsg_InvalidSiteOrUser);
    }

    if (isValid) {
        jQuery.ajaxFileUpload({
            type: "POST",
            url: jQuery.MeasuringPointListNameSpace.BasePath + "/HandlerFiles/MeasuringPointUploadHandler.ashx" + '?sid=' + jQuery.MeasuringPointListNameSpace.PagerData.SiteID +
            '&uid=' + jQuery.MeasuringPointListNameSpace.PagerData.UserID,
            fileElementId: fileToUpload,
            success: function (data, status) {
                var handlerMsg = data.documentElement.innerText;
                var message = handlerMsg.split(',');
                if (message[0] != "false") {
                    var fileName = message[1];
                    jQuery("#spnProgressExcel").removeClass('hide');
                    TimerMethodForUpload(fileName);
                }
                else {
                    jQuery("#spnProgressExcel").addClass('hide');
                    jQuery("#lblUploadError").text(message[1]);
                    jQuery(control).val('');
                    EnableUploadControls();
                }
                if (navigator.userAgent.search("MSIE") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
                {
                    var control = jQuery("#" + fileToUpload);
                    control.replaceWith(control = control.clone(true));
                }

            },
            beforeSend: function () {
                jQuery("#spnProgressExcel").removeClass('hide');
                DisableUploadControls();
            },
            error: function (request, error) {
                if (request.responseText != "") {
                    EnableUploadControls();
                    jQuery("#spnProgressExcel").addClass('hide');
                    control.replaceWith(control = control.val('').clone(true));
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
        if (navigator.userAgent.search("MSIE") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
        {
            control = jQuery("#" + fileToUpload);
            control.replaceWith(control = control.clone(true));
        }

    }
    else {
        if (navigator.userAgent.search("MSIE") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
        {
            control = jQuery("#" + fileToUpload);
            control.replaceWith(control = control.clone(true));
        }

    }
}

function TimerMethodForUpload(fileName) {
    var fileToUpload = jQuery.MeasuringPointListNameSpace.PagerData.LoadControlID;
    var btnUploadExcel = jQuery.MeasuringPointListNameSpace.PagerData.LoadControlID.replace("uploadFile", "btnUploadExcel");

    DisableUploadControls();
    var successTimer;
    var errorTimer;
    var successTxtFile = fileName + "_tempSuccess.txt";
    var errorFileName = fileName + "_tempError.txt";

    successTimer = setInterval(function () {
        jQuery.ajax({
            type: "POST",
            url: jQuery.MeasuringPointListNameSpace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/CheckFileExist",
            data: JSON.stringify({ fileName: successTxtFile }),
            contentType: "Application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                if (json.d) {
                    clearInterval(successTimer);
                    clearInterval(errorTimer);
                    EnableUploadControls();
                    window.location = jQuery.MeasuringPointListNameSpace.BasePath + "/HandlerFiles/DownLoadHandler.ashx?MeasuringPointInfoLogFile=" + successTxtFile;
                    jQuery.MeasuringPointListNameSpace.PagerData.PageIndex = 0;
                    jQuery.MeasuringPointListNameSpace.PagerData.CurrentPage = 0;
                    jQuery("#btnShowAll").addClass('hide');
                    jQuery("#divUploadExcel").hide();
                    jQuery("#spnProgressExcel").addClass('hide');
                    LoadDynamicGridContent(jQuery.MeasuringPointListNameSpace.PagerData);
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
            url: jQuery.MeasuringPointListNameSpace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/CheckFileExist",
            data: JSON.stringify({ fileName: errorFileName }),
            contentType: "Application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                if (json.d) {
                    jQuery.get(jQuery.MeasuringPointListNameSpace.BasePath + '/HandlerFiles/DownloadHandler.ashx?MeasuringPointInfoLogFile=' + errorFileName, function (data) {
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
                            window.location = jQuery.MeasuringPointListNameSpace.BasePath + "/HandlerFiles/DownloadHandler.ashx?MeasuringPointInfoLogFile=" + errorFileName;
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
    var fileToUpload = jQuery.MeasuringPointListNameSpace.PagerData.LoadControlID;
    var btnUploadExcel = jQuery.MeasuringPointListNameSpace.PagerData.LoadControlID.replace("uploadFile", "btnUploadExcel");

    if (jQuery.MeasuringPointListNameSpace.PagerData.PageAccessRights == "FULL_ACCESS") {
        jQuery("#" + btnUploadExcel).removeAttr('disabled');
        jQuery("#" + fileToUpload).removeAttr('disabled');
    }
    jQuery("#btnDownloadExcel").removeAttr('disabled');
    jQuery("#btnDownloadTemplate").removeAttr('disabled');

}

function DisableUploadControls() {
    var fileToUpload = jQuery.MeasuringPointListNameSpace.PagerData.LoadControlID;
    var btnUploadExcel = jQuery.MeasuringPointListNameSpace.PagerData.LoadControlID.replace("uploadFile", "btnUploadExcel");
    jQuery("#btnDownloadExcel").attr('disabled', 'disabled');
    jQuery("#" + btnUploadExcel).attr('disabled', 'disabled');
    jQuery("#btnDownloadTemplate").attr('disabled', 'disabled');
    jQuery("#" + fileToUpload).attr('disabled', 'disabled');
}

function ShowUploadDiv() {
    jQuery("#spnUploadProgress").addClass('hide');
    jQuery("#lblUploadError").text("");
    jQuery("#divUploadExcel").slideToggle();
    var fileToUpload = jQuery.MeasuringPointListNameSpace.PagerData.LoadControlID;
    jQuery("#" + fileToUpload).val('');
}


function DeleteMeasuringPoint(measuringPointID) {
    jQuery("#alertMessage").removeClass("text-info");
    jQuery("#alertMessage").removeClass("text-danger");
    jQuery("#alertMessage").html(languageResource.resMsg_AreYouSureYouWantToDeleteMeasuringPoint);
    jQuery("#alertModal").dialog({
        modal: true,
        buttons: [
            {
                text: languageResource.resMsg_Confirm,
                click: function () {
                    jQuery("#alertModal").dialog("close");
                    DeleteConfirmedMeasuringPoint(measuringPointID);
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

function DeleteConfirmedMeasuringPoint(measuringPointID) {
    jQuery.ajax({
        type: "POST",
        url: jQuery.MeasuringPointListNameSpace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/DeleteMeasuringPointInfo",
        data: JSON.stringify({ basicParam: jQuery.MeasuringPointListNameSpace.BasicParam, measuringPointID: measuringPointID }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (json) {
            if (json.d != null || json.d != undefined) {
                if (json.d === 1) { //successfully deleted measuring point
                    ReLoadGridContent();
                } 
                else if (json.d === 2) { //sont exists in active state
                    ShowPopupMessage(languageResource.resMsg_MeasuringPointDonNotExistActiveStatus, "error");
                } 
                else {
                    ShowPopupMessage(languageResource.resMsg_MeasuringPointDeleteFailure, "error");
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
                    errorMessage = languageResource.resMsg_MeasuringPointDeleteFailure;
            }
            else {
                errorMessage = languageResource.resMsg_MeasuringPointDeleteFailure;
            }
            ShowPopupMessage(languageResource.resMsg_MeasuringPointDeleteFailure, "error");
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
                text: languageResource.resMsg_Ok,
                click: function () {
                    jQuery("#alertModal").dialog("close");
                    isTrue = false;
                }
            }
        ]
    });

}
function AddMeasuringPoints() {
    var queryString = "?id=" + jQuery.MeasuringPointListNameSpace.BasicParam.SiteID;
    window.location.href = jQuery.MeasuringPointListNameSpace.BasePath + "/Preventive/AddMeasuringPoint.aspx" + queryString;
}
