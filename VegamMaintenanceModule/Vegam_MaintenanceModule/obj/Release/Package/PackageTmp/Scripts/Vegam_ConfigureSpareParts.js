﻿jQuery.SparePartsNamespace = jQuery.SparePartsNamespace || {};
jQuery.SparePartsNamespace.BasicParam = jQuery.SparePartsNamespace.BasicParam || {};
jQuery.SparePartsNamespace.PagerData = jQuery.SparePartsNamespace.PagerData || {};
jQuery.SparePartsNamespace.FieldIDInfo = jQuery.SparePartsNamespace.FieldIDInfo || {};
jQuery.SparePartsNamespace.BasePath = "";
jQuery.SparePartsNamespace.WebServicePath = "";
jQuery.SparePartsNamespace.HeaderStatusInfo = [];

function LoadSparePartsPage(gridProperties, basePath) {
	var pagerData = gridProperties.PagerData;
	jQuery.SparePartsNamespace.PagerData = pagerData;
	jQuery.SparePartsNamespace.BasePath = basePath;
	jQuery.SparePartsNamespace.BasicParam.UserID = pagerData.UserID;
	jQuery.SparePartsNamespace.BasicParam.SiteID = pagerData.SiteID;
	jQuery.SparePartsNamespace.WebServicePath = pagerData.ServicePath;
	jQuery("#divDynamicGridTableHeaderInfo").removeClass("col-xl-4").addClass("col-lg-7");
	LoadDynamicGridBasicInfo(gridProperties);
}

function DownLoadExcelTemplate() {
    jQuery("#divUploadExcel").hide();
    var fileToUpload = jQuery.SparePartsNamespace.PagerData.LoadControlID;
    jQuery("#" + fileToUpload).val('');
    jQuery("#lblUploadError").removeClass("text-info");
    jQuery("#lblUploadError").addClass("text-danger");
    jQuery("#lblUploadError").text('');
    jQuery("#spnSearchError").text('');
    jQuery("#spnErrorMessageForExcel").text('');

    jQuery.ajax({
        type: "POST",
		url: jQuery.SparePartsNamespace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/DownloadSparePartsTemplate",
        data: JSON.stringify({ basicParam: jQuery.SparePartsNamespace.BasicParam }),
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

function DownloadExcelInfo() {
	jQuery("#lblUploadError").removeClass("text-info");
	jQuery("#lblUploadError").addClass("text-danger");
	jQuery("#lblUploadError").text('');
	jQuery("#divUploadExcel").hide();
	jQuery("#spnSearchError").text('');
	jQuery("#spnErrorMessageForExcel").text('');
	var fileToUpload = jQuery.SparePartsNamespace.PagerData.LoadControlID;
	jQuery("#" + fileToUpload).val('');

	var filter = {};
	filter.SiteID = jQuery.SparePartsNamespace.PagerData.SiteID;
	filter.UserID = jQuery.SparePartsNamespace.PagerData.UserID;
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
		url: jQuery.SparePartsNamespace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/DownloadSparePartsListExcel",
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
			url: jQuery.SparePartsNamespace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/CheckFileExist",
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
						window.location = jQuery.SparePartsNamespace.BasePath + "/HandlerFiles/DownLoadHandler.ashx?SparePartsInfoExcel=" + excelFileName;

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
			url: jQuery.SparePartsNamespace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/CheckFileExist",
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify({ fileName: errorTextFile }),
			dataType: "json",
			success: function (json) {
				if (json.d) {
					jQuery.get(jQuery.SparePartsNamespace.BasePath + "/HandlerFiles/DownLoadHandler.ashx?SparePartsInfoExcel=" + excelFileName, function (data) {
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

function UploadSparePartsInfo() {
    var fileToUpload = jQuery.SparePartsNamespace.PagerData.LoadControlID;
    var btnUploadExcel = jQuery.SparePartsNamespace.PagerData.LoadControlID.replace("uploadFile", "btnUploadExcel");
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
    if (jQuery.SparePartsNamespace.PagerData.SiteID == 0 || jQuery.SparePartsNamespace.PagerData.UserID == 0) {
        jQuery("#lblUploadError").html(languageResource.resMsg_InvalidSiteOrUser);
    }

    if (isValid) {
        jQuery.ajaxFileUpload({
            type: "POST",
			url: jQuery.SparePartsNamespace.BasePath + "/HandlerFiles/SparePartsUploadHandler.ashx" + '?sid=' + jQuery.SparePartsNamespace.PagerData.SiteID +
            '&uid=' + jQuery.SparePartsNamespace.PagerData.UserID,
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
	var fileToUpload = jQuery.SparePartsNamespace.PagerData.LoadControlID;
	var btnUploadExcel = jQuery.SparePartsNamespace.PagerData.LoadControlID.replace("uploadFile", "btnUploadExcel");

	DisableUploadControls();
	var successTimer;
	var errorTimer;
	var successTxtFile = fileName + "_tempSuccess.txt";
	var errorFileName = fileName + "_tempError.txt";

	successTimer = setInterval(function () {
		jQuery.ajax({
			type: "POST",
			url: jQuery.SparePartsNamespace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/CheckFileExist",
			data: JSON.stringify({ fileName: successTxtFile }),
			contentType: "Application/json; charset=utf-8",
			dataType: "json",
			success: function (json) {
				if (json.d) {
					clearInterval(successTimer);
					clearInterval(errorTimer);
					EnableUploadControls();
					window.location = jQuery.SparePartsNamespace.BasePath + "/HandlerFiles/DownLoadHandler.ashx?SparePartsLogFile=" + successTxtFile;
					jQuery.SparePartsNamespace.PagerData.PageIndex = 0;
					jQuery.SparePartsNamespace.PagerData.CurrentPage = 0;
					jQuery("#btnShowAll").addClass('hide');
					jQuery("#divUploadExcel").hide();
					jQuery("#spnProgressExcel").addClass('hide');
					LoadDynamicGridContent(jQuery.SparePartsNamespace.PagerData);
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
			url: jQuery.SparePartsNamespace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/CheckFileExist",
			data: JSON.stringify({ fileName: errorFileName }),
			contentType: "Application/json; charset=utf-8",
			dataType: "json",
			success: function (json) {
				if (json.d) {
					jQuery.get(jQuery.SparePartsNamespace.BasePath + '/HandlerFiles/DownloadHandler.ashx?SparePartsLogFile=' + errorFileName, function (data) {
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
							window.location = jQuery.SparePartsNamespace.BasePath + "/HandlerFiles/DownloadHandler.ashx?SparePartsLogFile=" + errorFileName;
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
	var fileToUpload = jQuery.SparePartsNamespace.PagerData.LoadControlID;
	var btnUploadExcel = jQuery.SparePartsNamespace.PagerData.LoadControlID.replace("uploadFile", "btnUploadExcel");

	if (jQuery.SparePartsNamespace.PagerData.PageAccessRights == "FULL_ACCESS") {
		jQuery("#" + btnUploadExcel).removeAttr('disabled');
		jQuery("#" + fileToUpload).removeAttr('disabled');
	}
	jQuery("#btnDownloadExcelInfo").removeAttr('disabled');
	jQuery("#btnDownloadTemplate").removeAttr('disabled');

}

function DisableUploadControls() {
	var fileToUpload = jQuery.SparePartsNamespace.PagerData.LoadControlID;
	var btnUploadExcel = jQuery.SparePartsNamespace.PagerData.LoadControlID.replace("uploadFile", "btnUploadExcel");
	jQuery("#btnDownloadExcelInfo").attr('disabled', 'disabled');
	jQuery("#" + btnUploadExcel).attr('disabled', 'disabled');
	jQuery("#btnDownloadTemplate").attr('disabled', 'disabled');
	jQuery("#" + fileToUpload).attr('disabled', 'disabled');
}

function ShowUploadDiv() {
	jQuery("#spnUploadProgress").addClass('hide');
	jQuery("#lblUploadError").text("");
	jQuery("#divUploadExcel").slideToggle();
	var fileToUpload = jQuery.SparePartsNamespace.PagerData.LoadControlID;
	jQuery("#" + fileToUpload).val('');
}
