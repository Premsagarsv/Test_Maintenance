﻿jQuery.AddToolsInfoNamespace = jQuery.AddToolsInfoNamespace || {};
jQuery.AddToolsInfoNamespace.PagerData = jQuery.AddToolsInfoNamespace.PagerData || {};
jQuery.AddToolsInfoNamespace.BasicParam = jQuery.AddToolsInfoNamespace.BasicParam || {};
jQuery.AddToolsInfoNamespace.BasePath = "";
jQuery.AddToolsInfoNamespace.WebServicePath = "";
jQuery.AddToolsInfoNamespace.ImageDefaultPath = "";
jQuery.AddToolsInfoNamespace.LoactionID = false;
jQuery.AddToolsInfoNamespace.UploaderPath = "";
jQuery.AddToolsInfoNamespace.ImageName = "";
jQuery.AddToolsInfoNamespace.ImagePath = "";
jQuery.AddToolsInfoNamespace.LoadControlID = "";

var addToolsInfoViewModel = {
	ToolsInfoArray: ko.observableArray([]),
	HasDeleteAccess: false,
	HasEditAccess: false,
	ToolThumbnailPath: ko.observable(''),
	EditToolDesc: ko.observable(''),
	EditToolID: ko.observable(0),
	PagerContent: ko.observable(''),
	LoadErrorMessageVisible: ko.observable(false),
	LoadErrorMessage: ko.observable(''),
	LoadErrorMessageClass: ko.observable('')
};
function LoadToolsInfoPage(pagerData, basicParam, basePath, webServicePath, uploaderPath, imageDefaultPath, imgPath, hasDeleteAccess, hasEditAccess) {

	jQuery.AddToolsInfoNamespace.PagerData = pagerData;
	jQuery.AddToolsInfoNamespace.BasicParam = basicParam;
	jQuery.AddToolsInfoNamespace.BasePath = basePath;
	jQuery.AddToolsInfoNamespace.WebServicePath = webServicePath;
	jQuery.AddToolsInfoNamespace.ImageDefaultPath = imageDefaultPath;
	jQuery.AddToolsInfoNamespace.UploaderPath = uploaderPath;
	jQuery.AddToolsInfoNamespace.ImagePath = imgPath;

    addToolsInfoViewModel.HasDeleteAccess = hasDeleteAccess === "True" ? true : false;
    addToolsInfoViewModel.HasEditAccess = hasEditAccess === "True" ? true : false;
    ko.applyBindings(addToolsInfoViewModel, document.getElementById("divToolsInfo"));
    ClearFieldInfo();

    LoadToolsInfo(jQuery.AddToolsInfoNamespace.PagerData);
}

function LoadToolsInfo(pagerData) {

    //jQuery.AddToolsInfoNamespace.PagerData = pagerData;
    var filterInfo = {};
    filterInfo.SiteID = jQuery.AddToolsInfoNamespace.BasicParam.SiteID;
    filterInfo.UserID = jQuery.AddToolsInfoNamespace.BasicParam.UserID;
    filterInfo.PageSize = pagerData.PageSize;
    filterInfo.PageIndex = pagerData.PageIndex;

    if (jQuery("#hdfSortValue").val() != "") {
        filterInfo.SortType = jQuery("#hdfSortValue").val();
    }

	jQuery.ajax({
		type: "POST",
		url: jQuery.AddToolsInfoNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/GetAllToolsInfo",
		data: JSON.stringify({ pagerData: pagerData, filterInfo: filterInfo }),
		contentType: "application/json; charset=utf-8",
		datatype: 'json',
		async: false,
		success: function (json) {
			if (json != undefined && json.d != undefined) {
				if (json.d.ToolsList != null || json.d.ToolsList != undefined) {
					jQuery.each(json.d.ToolsList, function (i, data) {
						toolInfo = {};
						toolInfo.ToolID = data.ToolID;
						toolInfo.ImageName = data.ImageName;
						if (data.ThumbnailPath != null)
							toolInfo.ThumbnailPath = data.ThumbnailPath;
						else
							toolInfo.ThumbnailPath = jQuery.AddToolsInfoNamespace.ImageDefaultPath;
						toolInfo.ToolDesc = data.ToolDesc;
						addToolsInfoViewModel.ToolsInfoArray.push(toolInfo);
					});
					addToolsInfoViewModel.PagerContent(json.d.HTMLPager);
				}
			}
			else {
				addToolsInfoViewModel.LoadErrorMessage(languageResource.resMsg_FailedToLoadToolsInfo);
				addToolsInfoViewModel.LoadErrorMessageClass('red');
				addToolsInfoViewModel.LoadErrorMessageVisible(true);
			}
		},
		beforeSend: function () {
			jQuery("#divToolsInfoProgress").show();
			addToolsInfoViewModel.ToolsInfoArray.removeAll();
			addToolsInfoViewModel.PagerContent('');
		},
		complete: function () {
			jQuery("#divToolsInfoProgress").hide();
		},
		error: function (request, error) {
			var msg;
			if (request.responseText != "") {
				var errorMsg = request.responseText;
				if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
					msg = languageResource.resMsg_Error + errorMsg.Message;
				else
					msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToInsertMaintTypeInfo.replace("[XXX]", jQuery.AddEquipmentNamespace.SelectedMasterDataMessage.toLowerCase().toString());
			}
			else {
				msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToInsertMaintTypeInfo.replace("[XXX]", jQuery.AddEquipmentNamespace.SelectedMasterDataMessage.toLowerCase().toString());
			}
			jQuery("#spnAddMaintTypeError").removeClass("text-info").addClass('text-danger');
			jQuery("#spnAddMaintTypeError").text(msg);
			addToolsInfoViewModel.LoadErrorMessage(errorMessage);
		}
	});

}

function ShowMessage(msg, addClass, removeClass) {
	jQuery("#spnErrorAddEditTools").text('');
	jQuery("#spnErrorAddEditTools").removeClass(removeClass).addClass(addClass);
	jQuery("#spnErrorAddEditTools").text(msg);
}

function ClearFieldInfo() {
	jQuery.AddToolsInfoNamespace.ImageName = "";
	jQuery("#divAddEditProgress").hide();
	jQuery("#spnErrorAddEditTools").text('');
	addToolsInfoViewModel.EditToolDesc('');
	addToolsInfoViewModel.ToolThumbnailPath(jQuery.AddToolsInfoNamespace.ImageDefaultPath);
	addToolsInfoViewModel.EditToolID(0);
	jQuery("#btnSaveTools").html(languageResource.resMsg_Add);

	if (addToolsInfoViewModel.HasDeleteAccess) {
		jQuery("#btnSaveTools").removeAttr('disabled');
		jQuery("#btnSaveTools").prop("onclick", null);
		jQuery("#btnSaveTools").unbind('click');
		jQuery("#btnSaveTools").bind("click", function () { InsertOrUpdateToolInfo(0); return false; });
	}
	else {
		jQuery("#btnSaveTools").attr('disabled', 'disabled');
		jQuery("#imageFileToUpload").attr('disabled', 'disabled');
	}

}

function SortTabs(thValue, value) {
    var thClass = "";
    var hasSortUpClassExist = jQuery("#" + thValue + " i").hasClass('fa-sort-up');
    var hasSortDownExist = jQuery("#" + thValue + " i").hasClass('fa-sort-down');

    if (hasSortUpClassExist == false && hasSortDownExist == false) {
        jQuery(".fa-sort-down").removeClass('fa fa-sort-down');
        jQuery(".fa-sort-up").removeClass('fa fa-sort-up');

        jQuery("#" + thValue + " i").addClass('fa fa-sort-up');
        thClass = value + "_asc";
        jQuery("#hdfSortValue").val(thClass);
        LoadToolsInfo(jQuery.AddToolsInfoNamespace.PagerData);
        return false;
    }
    if (jQuery("#" + thValue + " i").hasClass('fa-sort-up')) {
        jQuery(".fa-sort-down").removeClass('fa fa-sort-down');
        jQuery(".fa-sort-up").removeClass('fa fa-sort-up');

        jQuery("#" + thValue + " i").addClass('fa fa-sort-down');
        thClass = value + "_desc";
        jQuery("#hdfSortValue").val(thClass);
        LoadToolsInfo(jQuery.AddToolsInfoNamespace.PagerData);
        return false;
    }
    if (jQuery("#" + thValue + " i").hasClass('fa-sort-down')) {
        jQuery(".fa-sort-down").removeClass('fa fa-sort-down');
        jQuery(".fa-sort-up").removeClass('fa fa-sort-up');

        jQuery("#" + thValue + " i").addClass('fa fa-sort-up');
        thClass = value + "_asc";
        jQuery("#hdfSortValue").val(thClass);
        LoadToolsInfo(jQuery.AddToolsInfoNamespace.PagerData);
        return false;
    }
}

function ShowToolsInfoEdit(toolID) {
	jQuery("#spnErrorAddEditTools").text('');
	var filterInfo = {};
	filterInfo.SiteID = jQuery.AddToolsInfoNamespace.BasicParam.SiteID;
	filterInfo.UserID = jQuery.AddToolsInfoNamespace.BasicParam.UserID;
	filterInfo.ToolID = toolID;
	filterInfo.PageSize = 0;
	filterInfo.PageIndex = 0;

	jQuery.ajax({
		type: "POST",
		url: jQuery.AddToolsInfoNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/GetAllToolsInfo",
		data: JSON.stringify({ pagerData: null, filterInfo: filterInfo }),
		contentType: "application/json; charset=utf-8",
		datatype: 'json',
		async: false,
		success: function (json) {
			if (json != undefined && json.d != undefined) {
				if (json.d.ToolsList != null || json.d.ToolsList != undefined) {
					jQuery.each(json.d.ToolsList, function (i, data) {
						addToolsInfoViewModel.EditToolID(data.ToolID);
						if (data.ThumbnailPath != null)
							addToolsInfoViewModel.ToolThumbnailPath(data.ThumbnailPath);
						else
							addToolsInfoViewModel.ToolThumbnailPath(jQuery.AddToolsInfoNamespace.ImageDefaultPath);
						addToolsInfoViewModel.EditToolDesc(data.ToolDesc);
						jQuery.AddToolsInfoNamespace.ImageName = data.ImageName;
					});
				}
			}
			else {
				ShowMessage(languageResource.resMsg_FailedToLoadToolsInfo, 'text-danger', 'text-info');
			}
		},
		beforeSend: function () {
			addToolsInfoViewModel.EditToolID(0);
			addToolsInfoViewModel.ToolThumbnailPath(jQuery.AddToolsInfoNamespace.ImageDefaultPath);
			addToolsInfoViewModel.EditToolDesc('');
			jQuery.AddToolsInfoNamespace.ImageName = "";
		},
		complete: function () {
			jQuery("#divAddEditProgress").hide();
			jQuery("#btnSaveTools").html(languageResource.resMsg_Update);
			if (addToolsInfoViewModel.HasEditAccess) {
				jQuery("#btnSaveTools").removeAttr('disabled');
				jQuery("#btnSaveTools").prop("onclick", null);
				jQuery("#btnSaveTools").unbind('click');
				jQuery("#btnSaveTools").bind("click", function () { InsertOrUpdateToolInfo(toolID); return false; });
			}
			else {
				jQuery("#btnSaveTools").attr('disabled', 'disabled');
				jQuery("#imageFileToUpload").attr('disabled', 'disabled');
			}
		},
		error: function (request, error) {
			var errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadToolsInfo;
			if (request.responseText != "") {
				var errorMsg = jQuery.parseJSON(request.responseText);
				if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
					errorMessage = languageResource.resMsg_Error + errorMsg.Message;
			}
			ShowMessage(errorMessage, 'text-danger', 'text-info');
		}
	});
}

function InsertOrUpdateToolInfo(toolID) {
	jQuery("#spnErrorAddEditTools").text('');
	if (addToolsInfoViewModel.EditToolDesc().length == 0) {
		ShowMessage(languageResource.resMsg_PleaseEnterToolDescription, 'text-danger', 'text-info');
	}
	else if (jQuery.AddToolsInfoNamespace.ImageName.length == 0) {
		ShowMessage(languageResource.resMsg_PleaseSelectToolImage, 'text-danger', 'text-info');
	}
	else {
		var toolsInfo = {};
		if (parseInt(toolID) == 0) {
			toolsInfo.ToolID = 0;
		}
		else {
			toolsInfo.ToolID = parseInt(toolID);
		}
		toolsInfo.ToolDesc = addToolsInfoViewModel.EditToolDesc();
		toolsInfo.ImageName = jQuery.AddToolsInfoNamespace.ImageName;
		jQuery.ajax({
			type: "POST",
			url: jQuery.AddToolsInfoNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/InsertOrUpdateToolInfo",
			data: JSON.stringify({ basicParam: jQuery.AddToolsInfoNamespace.BasicParam, toolsInfo: toolsInfo }),
			contentType: "application/json; charset=utf-8",
			datatype: 'json',
			async: false,
			success: function (json) {
				if (json != null || json.d != undefined || json.d != 0) {
					var result = json.d;
					if (result == 1) {//Already exist
						ShowMessage(languageResource.resMsg_ToolDescriptionAlreadyExists, 'text-danger', 'text-info');
					}
					else if (result == 2) {//already exist in in-active status can not updated
						ClearFieldInfo();
						ShowMessage(languageResource.resMsg_ToolsInfoInsertedSuccess, 'text-info', 'text-danger');
						LoadToolsInfo(jQuery.AddToolsInfoNamespace.PagerData);
					}
					else if (result = 3) {
						ClearFieldInfo();
						ShowMessage(languageResource.resMsg_ToolsInfoUpdatedSuccess, 'text-info', 'text-danger');
						LoadToolsInfo(jQuery.AddToolsInfoNamespace.PagerData);
					}
					else {
						ShowMessage(languageResource.resMsg_FailedToInsertUpdateToolsInfo, 'text-danger', 'text-info');
					}
				}
				else {
					ShowMessage(languageResource.resMsg_FailedToInsertUpdateToolsInfo, 'text-danger', 'text-info');
				}
			},
			beforeSend: function () {
				jQuery("#spnErrorAddEditTools").text('');
				jQuery("#divAddEditProgress").show();
			},
			complete: function () {
				jQuery("#divAddEditProgress").hide();
			},
			error: function (request, error) {
				jQuery("#divProgress").hide();
				var errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToInsertUpdateToolsInfo;
				if (request.responseText != "") {
					var errorMsg = jQuery.parseJSON(request.responseText);
					if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
						errorMessage = languageResource.resMsg_Error + errorMsg.Message;
				}
				ShowMessage(errorMessage, 'text-danger', 'text-info');
			}
		});
	}

}

function ToolsImageUpload() {
	var imageName = "";
	var isValid = false;
	var errorMessage = '';
	var capturedImage = jQuery("#imageFileToUpload").val();

	if (capturedImage == 'undefined' || capturedImage == "") {
		errorMessage = languageResource.resMsg_FaiedToCaptureImage;
		isValid = false;
	}
	else {
		var ext = capturedImage.substring(capturedImage.lastIndexOf('.') + 1).toLowerCase();
		if (ext == "png" || ext == "jpeg" || ext == "jpg" || ext == "gif") {
			var currentDate = new Date();
			currentDateAndTime = currentDate.format("yyyyMMddhhmmss");
			imageName = "IMG_" + currentDateAndTime + "." + ext;
			isValid = true;
		}
		else {
			errorMessage = languageResource.resMsg_InvalidImageFormat;
		}
	}

	if (!isValid) {
		ShowMessage(errorMessage, 'text-danger', 'text-info');
		jQuery("#imageFileToUpload").val('');
		imageName = '';
	}

	if (isValid) {
		var urlString = jQuery.AddToolsInfoNamespace.UploaderPath + '?uid=' + jQuery.AddToolsInfoNamespace.BasicParam.UserID + '&sid=' + jQuery.AddToolsInfoNamespace.BasicParam.SiteID + '&fileName=' + imageName + '&toolsImage=true';

		jQuery.ajaxFileUpload({
			type: "POST",
			url: urlString,
			fileElementId: 'imageFileToUpload',
			success: function (data, status) {
				jQuery("#imageFileToUpload").val('');
				if (data.documentElement.innerText != "true") {

					ShowMessage(languageResource.resMsg_FailedToUploadImage, 'text-danger', 'text-info');
					imageName = '';
				}
				else {
					jQuery.AddToolsInfoNamespace.ImageName = imageName;
					addToolsInfoViewModel.ToolThumbnailPath(jQuery.AddToolsInfoNamespace.ImagePath + "/" + imageName);
				}
			},
			error: function (request, error) {
				jQuery("#imageFileToUpload").val('');
				var errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToUploadImage;
				if (request.responseText != "") {
					var errorMsg = jQuery.parseJSON(request.responseText);
					if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
						errorMessage = languageResource.resMsg_Error + errorMsg.Message;
				}
				ShowMessage(errorMessage, 'text-danger', 'text-info');
				imageName = '';
			}
		});
	}
}

function BindIconAttributes(hasAccess) {
	var iconAttributes = {};
	if (!hasAccess) {
		iconAttributes.disabled = "disabled";
	}
	return iconAttributes;
}

function DeleteToolsInfoClick(toolID) {
	jQuery("#alertMessage").removeClass("text-danger");
	jQuery("#alertMessage").html(languageResource.resMsg_DeleteToolsConfrim);
	jQuery("#confirmModal").dialog({
		zIndex: 1060,
		closeOnEscape: false,
		open: function (event, ui) {
			jQuery(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
		},
		modal: true,
		buttons: [
			{
				text: languageResource.resMsg_Confirm,
				click: function () {
					jQuery("#confirmModal").dialog("close");
					DeleteToolInfo(toolID);
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

function DeleteToolInfo(toolID) {
    var rowCount = jQuery('#tbTools >tr').length;
    jQuery.ajax({
        type: "POST",
        url: jQuery.AddToolsInfoNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/DeleteToolsInfo",
        data: JSON.stringify({ basicParam: jQuery.AddToolsInfoNamespace.BasicParam, toolID: toolID }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if (json.d == 1) {
                //if (jQuery.AddToolsInfoNamespace.PagerData.PageSize > 1 && jQuery.AddToolsInfoNamespace.PagerData.PageIndex > jQuery.AddToolsInfoNamespace.PagerData.PageSize && rowCount == 1) {
                //    jQuery.AddToolsInfoNamespace.PagerData.PageIndex = jQuery.AddToolsInfoNamespace.PagerData.PageIndex - parseInt(jQuery.AddToolsInfoNamespace.PagerData.PageSize);
                //    jQuery.AddToolsInfoNamespace.PagerData.CurrentPage = jQuery.AddToolsInfoNamespace.PagerData.CurrentPage - 1;
                //}
                ClearFieldInfo();
                LoadToolsInfo(jQuery.AddToolsInfoNamespace.PagerData);
            }
            else if (json.d == 2) {
                var msg = languageResource.resMsg_ToolInfoDoesNotExist;
                jQuery("#alertMessage").addClass("text-danger");
                ShowErrorMessage(msg, true);
            }
            else {
                var msg = languageResource.resMsg_FailedToDeleteToolsInfo;
                jQuery("#alertMessage").addClass("text-danger");
                ShowErrorMessage(msg, true);
            }
        },
        error: function (request, error) {
            var msg;
            if (request.responseText != "") {
                var errorMsg = request.responseText;
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    msg = languageResource.resMsg_Error + errorMsg.Message;
                else
                    msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToDeleteToolsInfo;
            }
            else {
                msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToDeleteToolsInfo;
            }
            ShowErrorMessage(msg, true);
        },
    });
}

function ShowErrorMessage(msg, isError) {
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


