jQuery.DocumnetsAndImagesNamespace = jQuery.DocumnetsAndImagesNamespace || {};
jQuery.DocumnetsAndImagesNamespace.BasicParam = jQuery.DocumnetsAndImagesNamespace.BasicParam || {};
jQuery.DocumnetsAndImagesNamespace.BasePath = null;
jQuery.DocumnetsAndImagesNamespace.Type = "";
jQuery.DocumnetsAndImagesNamespace.EquipmentID = 0;
jQuery.DocumnetsAndImagesNamespace.FLocationID = 0;
jQuery.DocumnetsAndImagesNamespace.WebServicePath = "";
jQuery.DocumnetsAndImagesNamespace.DocThumbnailPath = "";
jQuery.DocumnetsAndImagesNamespace.UploaderPath = "";
jQuery.DocumnetsAndImagesNamespace.InfoType = { "Equipment": 'E', "Equipment_Model": 'M', "None": 'N' };
jQuery.DocumnetsAndImagesNamespace.Type = "";
jQuery.DocumnetsAndImagesNamespace.DocumentType = { "DOCUMENT": 'D', "IMAGE": 'I', "VIDEO": 'V', "NONE": 'N', "SDOCUMENT": 'S' };
jQuery.DocumnetsAndImagesNamespace.AdditionalLinksType = { "FunctionalLocation": 'L', "Equipment": 'E', "Equipment_Model": 'M' };
jQuery.DocumnetsAndImagesNamespace.DefaultUplaodIconPath = "";
jQuery.DocumnetsAndImagesNamespace.MaintDocumentLocation = "";

var viewDocumnetsAndImagesModal = {
    HasFullAccess: false,
    DefaultUplaodIconPath: ko.observable(''),
    ImagesAndVideosList: ko.observableArray([]),
    ManualDocumentsList: ko.observableArray([]),
    SpecificationDocumentsList: ko.observableArray([]),
    FilterEquipmentModelList: ko.observableArray([]),
    SelectedEquipmentModelID: ko.observable(0)
};

function LoadDocumentAndImagesBasicInfo(basicParam, hasFullAccess, type, equipmentID, basePath, webservicePath, uploaderPath, defaultUploadIconPath, maintDocumentLocation, fLocationID, fLocationBtnLinkAccess) {
    jQuery.DocumnetsAndImagesNamespace.BasicParam = basicParam;
    jQuery.DocumnetsAndImagesNamespace.EquipmentID = equipmentID;
    jQuery.DocumnetsAndImagesNamespace.FLocationID = fLocationID;

    jQuery.DocumnetsAndImagesNamespace.Type = type;
    jQuery.DocumnetsAndImagesNamespace.BasePath = basePath;
    jQuery.DocumnetsAndImagesNamespace.WebServicePath = webservicePath;
    jQuery.DocumnetsAndImagesNamespace.UploaderPath = uploaderPath;
    jQuery.DocumnetsAndImagesNamespace.DocThumbnailPath = defaultUploadIconPath;
    jQuery.DocumnetsAndImagesNamespace.MaintDocumentLocation = maintDocumentLocation;

    if (jQuery.DocumnetsAndImagesNamespace.FLocationID == 0 || fLocationBtnLinkAccess.toUpperCase() == "FALSE") {
        jQuery("#buttonlnkAddFLocation").addClass("hide");
    }

    if (jQuery.DocumnetsAndImagesNamespace.Type == jQuery.DocumnetsAndImagesNamespace.InfoType.Equipment) {
        jQuery("#lblEquipmentmodelName").html(languageResource.resMsg_Equipment);
    }
    else if (jQuery.DocumnetsAndImagesNamespace.Type == jQuery.DocumnetsAndImagesNamespace.InfoType.Equipment_Model) {
        jQuery("#lblEquipmentmodelName").html(languageResource.resMsg_EquipmentModel);
    }

    viewDocumnetsAndImagesModal.HasFullAccess = hasFullAccess.toString().toUpperCase() == "TRUE" ? true : false;

    if (defaultUploadIconPath != null || defaultUploadIconPath != undefined)
        viewDocumnetsAndImagesModal.DefaultUplaodIconPath = defaultUploadIconPath + "upload_icon.png";

    BindFilterModelListOrEquipmentList();
    ko.applyBindings(viewDocumnetsAndImagesModal, document.getElementById("divAddDocument"));
    LoadImagesDocumentsList();
}

function BindFilterModelListOrEquipmentList() {
    var filterInfo = {};
    filterInfo.SiteID = jQuery.DocumnetsAndImagesNamespace.BasicParam.SiteID;
    filterInfo.UserID = jQuery.DocumnetsAndImagesNamespace.BasicParam.UserID;
    if (jQuery.DocumnetsAndImagesNamespace.Type == jQuery.DocumnetsAndImagesNamespace.InfoType.Equipment)
        filterInfo.InfoType = jQuery.DocumnetsAndImagesNamespace.InfoType.Equipment.charCodeAt();
    else if (jQuery.DocumnetsAndImagesNamespace.Type == jQuery.DocumnetsAndImagesNamespace.InfoType.Equipment_Model)
        filterInfo.InfoType = jQuery.DocumnetsAndImagesNamespace.InfoType.Equipment_Model.charCodeAt();
    filterInfo.ConsiderEquipmentList = true;

    jQuery.ajax({
        type: "POST",
        url: jQuery.DocumnetsAndImagesNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/GetEquipmentInfoList",
        data: JSON.stringify({ pagerData: null, equipmentFilterInfo: filterInfo }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if (json != undefined && json.d != null) {
                var equipmentInfoList = json.d.EquipmentDetailList;
                var indexInfo = {};
                indexInfo.TypeValue = 0;
                indexInfo.DisplayName = languageResource.resMsg_PleaseSelect;
                viewDocumnetsAndImagesModal.FilterEquipmentModelList.push(indexInfo);
                if (equipmentInfoList.EquipmentList.length > 0) {
                    jQuery.each(equipmentInfoList.EquipmentList, function (i, equipmentData) {
                        var equipmentInfo = {};
                        equipmentInfo.TypeValue = equipmentData.EquipmentID;
                        equipmentInfo.DisplayName = equipmentData.EquipmentName;
                        viewDocumnetsAndImagesModal.FilterEquipmentModelList.push(equipmentInfo);
                    });
                    if (jQuery.DocumnetsAndImagesNamespace.EquipmentID > 0) {
                        viewDocumnetsAndImagesModal.SelectedEquipmentModelID(jQuery.DocumnetsAndImagesNamespace.EquipmentID);
                    }
                    jQuery("#drpModelEquipment").select2();
                }
            }
            else {
                var errorMsg = "";
                if (jQuery.DocumnetsAndImagesNamespace.Type == jQuery.DocumnetsAndImagesNamespace.InfoType.Equipment) {
                    errorMsg = languageResource.resMsg_Error + languageResource.resMsg_FailedToBindEquipmentList;
                }
                else if (jQuery.DocumnetsAndImagesNamespace.Type == jQuery.DocumnetsAndImagesNamespace.InfoType.Equipment_Model) {
                    errorMsg = languageResource.resMsg_Error + languageResource.resMsg_FailedToBindEquipmentModelList;
                }
                ShowErrorMessage(errorMsg, true);
            }
        },
        beforeSend: function () {
            viewDocumnetsAndImagesModal.FilterEquipmentModelList.removeAll();
        },
        complete: function () {
        },
        error: function (request, error) {
            var msg;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    msg = languageResource.resMsg_Error + errorMsg.Message;
                else {
                    if (jQuery.DocumnetsAndImagesNamespace.Type == jQuery.DocumnetsAndImagesNamespace.InfoType.Equipment) {
                        msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToBindEquipmentList;
                    }
                    else if (jQuery.DocumnetsAndImagesNamespace.Type == jQuery.DocumnetsAndImagesNamespace.InfoType.Equipment_Model) {
                        msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToBindEquipmentModelList;
                    }
                }
            }
            else {
                if (jQuery.DocumnetsAndImagesNamespace.Type == jQuery.DocumnetsAndImagesNamespace.InfoType.Equipment) {
                    msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToBindEquipmentList;
                }
                else if (jQuery.DocumnetsAndImagesNamespace.Type == jQuery.DocumnetsAndImagesNamespace.InfoType.Equipment_Model) {
                    msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToBindEquipmentModelList;
                }

            }
            ShowErrorMessage(msg, true);
        }
    });
}

function LoadImagesDocumentsList() {
    if (viewDocumnetsAndImagesModal.SelectedEquipmentModelID() > 0) {
        jQuery.DocumnetsAndImagesNamespace.EquipmentID = viewDocumnetsAndImagesModal.SelectedEquipmentModelID();
        jQuery("#specificationFileUpload").prop("disabled", false);
        jQuery("#documentFileUpload").prop("disabled", false);
        jQuery("#imageVideoFileUpload").prop("disabled", false);
        jQuery("#specificationFileUpload").addClass("cursor-pointer");
        jQuery("#documentFileUpload").addClass("cursor-pointer");
        jQuery("#imageVideoFileUpload").addClass("cursor-pointer");

        var filterInfo = {};
        filterInfo.SiteID = jQuery.DocumnetsAndImagesNamespace.BasicParam.SiteID;
        filterInfo.UserID = jQuery.DocumnetsAndImagesNamespace.BasicParam.UserID;
        filterInfo.InfoType = GetInfoTypeText(jQuery.DocumnetsAndImagesNamespace.Type);
        filterInfo.EquipmentID = viewDocumnetsAndImagesModal.SelectedEquipmentModelID();

        jQuery.ajax({
            type: "POST",
            url: jQuery.DocumnetsAndImagesNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/GetAllDocumentsAndImagesInfo",
            data: JSON.stringify({ filterInfo: filterInfo }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                if (json.d != null || json.d != undefined) {
                    if (json.d.length != 0) {
                        jQuery.each(json.d, function (key, value) {
                            var docInfo = {};
                            docInfo.DocumentID = value.DocumentID;
                            docInfo.DocumentType = String.fromCharCode(value.DocumentType);;
                            docInfo.DocumentName = value.DocumentName;//split('_', 1)[2].split('.')[0];value.DocumentName.split('.')[0].toString();//split(new [] { '_' }, 3).Last().ToString();
                            docInfo.DocumentDisplayName = value.DocumentName.split('.')[0].substring(value.DocumentName.indexOf('_', value.DocumentName.indexOf('_') + 1) + 1);
                            docInfo.DownloadPath = value.DownloadPath;
                            if (jQuery.DocumnetsAndImagesNamespace.Type != 'M')
                                docInfo.IsModelDocument = value.IsModelDocument;
                            else
                                docInfo.IsModelDocument = false;
                            docInfo.ThumbnailPath = '';

                            if (String.fromCharCode(value.DocumentType) == 'I' || String.fromCharCode(value.DocumentType) == 'V') {

                                if (String.fromCharCode(value.DocumentType) == 'I') {                                   
                                    docInfo.ThumbnailPath = value.ThumbnailPath;
                                }
                                else if (String.fromCharCode(value.DocumentType) == 'V') {
                                    docInfo.ThumbnailPath = jQuery.DocumnetsAndImagesNamespace.DocThumbnailPath + 'video.png';
                                }
                                viewDocumnetsAndImagesModal.ImagesAndVideosList.push(docInfo);
                            }
                            else if (String.fromCharCode(value.DocumentType) == 'D') {
                                var ext = value.DocumentName.substring(value.DocumentName.lastIndexOf('.') + 1).toLowerCase();
                                if (ext == "png" || ext == "jpeg" || ext == "jpg") {
                                    docInfo.ThumbnailPath = value.ThumbnailPath;
                                }
                                else {
                                    docInfo.ThumbnailPath = jQuery.DocumnetsAndImagesNamespace.DocThumbnailPath + ext + '.png';
                                }
                                viewDocumnetsAndImagesModal.ManualDocumentsList.push(docInfo);
                            }
                            else if (String.fromCharCode(value.DocumentType) == 'S') {
                                var ext = value.DocumentName.substring(value.DocumentName.lastIndexOf('.') + 1).toLowerCase();
                                if (ext == "png" || ext == "jpeg" || ext == "jpg") {
                                    docInfo.ThumbnailPath = value.ThumbnailPath;
                                }
                                else {
                                    docInfo.ThumbnailPath = jQuery.DocumnetsAndImagesNamespace.DocThumbnailPath + ext + '.png';
                                }
                                viewDocumnetsAndImagesModal.SpecificationDocumentsList.push(docInfo);
                            }
                        });
                    }
                }
                else {
                    jQuery("#spnDocumentAndImageError").text(languageResource.resMsg_FailedToLoadDocumentAndImageInfo);
                }
            },
            beforeSend: function () {
                jQuery("#divProgress").show();
                viewDocumnetsAndImagesModal.ImagesAndVideosList.removeAll();
                viewDocumnetsAndImagesModal.ManualDocumentsList.removeAll();
                viewDocumnetsAndImagesModal.SpecificationDocumentsList.removeAll();
            },
            complete: function () {
                jQuery("#divProgress").hide();
                setTimeout(function () {
                    oldHeight = window.parent.jQuery("iframe").height();
                    newHeight = jQuery("#divAddDocument").height();
                    if (oldHeight < newHeight) {
                        newHeight = newHeight + 50;
                        window.parent.jQuery("iframe").css("height", newHeight);
                    }
                    else
                        window.parent.jQuery("iframe").css("height", oldHeight);
                }, 1000)
            },
            error: function (request, error) {
                jQuery("#divProgress").hide();
                jQuery("#spnDocumentAndImageError").text('');
                if (request.responseText != "") {
                    var errorMsg = jQuery.parseJSON(request.responseText);
                    if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                        errorMessage = languageResource.resMsg_Error + errorMsg.Message;
                    else
                        errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadDocumentAndImageInfo;
                }
                else {
                    errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadDocumentAndImageInfo;
                }
                jQuery("#spnDocumentAndImageError").text(errorMessage);
            }
        });
    }
    else {
        viewDocumnetsAndImagesModal.ManualDocumentsList.removeAll();
        viewDocumnetsAndImagesModal.SpecificationDocumentsList.removeAll();
        viewDocumnetsAndImagesModal.ImagesAndVideosList.removeAll();
        jQuery("#specificationFileUpload").prop("disabled", true);
        jQuery("#documentFileUpload").prop("disabled", true);
        jQuery("#imageVideoFileUpload").prop("disabled", true);
        jQuery("#specificationFileUpload").removeClass("cursor-pointer");
        jQuery("#documentFileUpload").removeClass("cursor-pointer");
        jQuery("#imageVideoFileUpload").removeClass("cursor-pointer");
    }
}

function BindIconAttributes(hasAccess) {
    var iconAttributes = {};
    if (!hasAccess) {
        iconAttributes.disabled = "disabled";
    }
    return iconAttributes;
}

function DeleteDocumentOrImageOrVideoInfo(item) {
    if (item.DocumentType == 'I' || item.DocumentType == 'V') {
        jQuery("#alertMessage").html(languageResource.resMsg_DeleteImageOrVideoConfrim);
    }
    else if (item.DocumentType == 'D') {
        jQuery("#alertMessage").html(languageResource.resMsg_DeleteManualDocumentConfrim);
    }
    else if (item.DocumentType == 'S') {
        jQuery("#alertMessage").html(languageResource.resMsg_DeleteSpecificationDocumentConfirm);
    }

    jQuery("#alertMessage").removeClass('red');
    jQuery("#divAlertModal").dialog({
        zIndex: 1060,
        modal: true,
        buttons: [
            {
                text: languageResource.resMsg_Confirm,
                click: function () {
                    DeleteDocumentOrImageOrVideoInfoConfirm(item);
                    jQuery("#divAlertModal").dialog("close");
                }
            },
            {
                text: languageResource.resMsg_Cancel,
                click: function () {
                    jQuery("#divAlertModal").dialog("close");
                }
            }
        ]
    });

}

function DeleteDocumentOrImageOrVideoInfoConfirm(item) {
    var basicParam = {};
    basicParam.SiteID = jQuery.DocumnetsAndImagesNamespace.BasicParam.SiteID;
    basicParam.UserID = jQuery.DocumnetsAndImagesNamespace.BasicParam.UserID;
    //basicParam.EquipmentID = jQuery.DocumnetsAndImagesNamespace.EquipmentID;
    var documentID = item.DocumentID;
    //filterInfo.InfoType = GetInfoTypeText(jQuery.DocumnetsAndImagesNamespace.Type);

    jQuery.ajax({
        type: "POST",
        url: jQuery.DocumnetsAndImagesNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/DeleteDocumentsAndImagesInfo",
        data: JSON.stringify({ basicParam: basicParam, documentID: documentID }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        async: false,
        success: function (json) {
            if (json.d != undefined) {
                if (json.d == 1) {
                    if (item.DocumentType == 'I' || item.DocumentType == 'V') {
                        viewDocumnetsAndImagesModal.ImagesAndVideosList.remove(item);
                    }
                    else if (item.DocumentType == 'D') {
                        viewDocumnetsAndImagesModal.ManualDocumentsList.remove(item);
                    }
                    else if (item.DocumentType == 'S') {
                        viewDocumnetsAndImagesModal.SpecificationDocumentsList.remove(item);
                    }
                   // LoadImagesDocumentsList();
                }
                else if (json.d == -1) {
                    if (item.DocumentType == 'I' || item.DocumentType == 'V') {
                        ShowAlertMessage(languageResource.resMsg_ImageVideoInfoDoesNotExist, 'red', 'blue');
                    }
                    else if (item.DocumentType == 'D') {
                        ShowAlertMessage(languageResource.resMsg_DocumentDoesNotExist, 'red', 'blue');
                    }

                }
                else {
                    if (item.DocumentType == 'I' || item.DocumentType == 'V') {
                        ShowAlertMessage(languageResource.resMsg_FailedToImageVideoInfo, 'red', 'blue');
                    }
                    else if (item.DocumentType == 'D') {
                        ShowAlertMessage(languageResource.resMsg_FailedToDeleteDocument, 'red', 'blue');
                    }

                }
            }
        },
        error: function (request, error) {
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null) {
                    ShowAlertMessage(languageResource.resMsg_Error + errorMsg.Message, 'red', 'blue');
                }
                else {
                    if (item.DocumentType == 'I' || item.DocumentType == 'V') {
                        ShowAlertMessage(languageResource.resMsg_Error + languageResource.resMsg_FailedToImageVideoInfo, 'red', 'blue');
                    }
                    else if (item.DocumentType == 'D') {
                        ShowAlertMessage(languageResource.resMsg_Error + languageResource.resMsg_FailedToDeleteDocument, 'red', 'blue');
                    }

                }

            }
            else {
                if (item.DocumentType == 'I' || item.DocumentType == 'V') {
                    ShowAlertMessage(languageResource.resMsg_Error + languageResource.resMsg_FailedToImageVideoInfo, 'red', 'blue');
                }
                else if (item.DocumentType == 'D') {
                    ShowAlertMessage(languageResource.resMsg_Error + languageResource.resMsg_FailedToDeleteDocument, 'red', 'blue');
                }

            }
        }
    });
}

function UploadMaintenanceImageVideo() {
    var fileName = "";
    var isValid = false;
    var errorMessage = '';
    var fileType = ''
    var capturedImage = jQuery("#imageVideoFileUpload").val();
    var controlID = "imageVideoFileUpload";

    if (capturedImage == 'undefined' || capturedImage == "") {
        errorMessage = languageResource.resMsg_FaliedToUpload;
    }
    else {
        var ext = capturedImage.substring(capturedImage.lastIndexOf('.') + 1).toLowerCase();
        var dataFileName = jQuery("#" + controlID).val().split('\\').pop();

        if ((ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg")) {
            var currentDate = new Date();
            currentDateAndTime = currentDate.format("yyyyMMddhhmmss");
            fileName = "IMG_" + currentDateAndTime + "_" + dataFileName;
            isValid = true;
            fileType = 'I'
        }
        else if (ext == "ogg" || ext == "ogv" || ext == "avi" || ext == "mpeg" || ext == "mov" || ext == "wmv" || ext == "flv" || ext == "mp4" || ext == "mpg") {
            var currentDate = new Date();
            currentDateAndTime = currentDate.format("yyyyMMddhhmmss");
            fileName = "VID_" + currentDateAndTime + "_" + dataFileName;
            isValid = true;
            fileType = 'V'
        }
        else {
            errorMessage = languageResource.resMsg_InvalidFormat;
        }
    }


    if (isValid == false) {
        ShowAlertMessage(errorMessage, 'red', 'blue');
        return false;
    }
    else {
        FileUpload(controlID, fileName, fileType);

    }

}

function UploadMaintenanceDocument(isManualUpload) {
    var fileName = "";
    var isValid = false;
    var errorMessage = '';
    var fileType = '';
    var capturedImage = '';
    var controlID = '';
    if (isManualUpload == true) {
        capturedImage = jQuery("#documentFileUpload").val();
        controlID = "documentFileUpload";
    }
    else {
        capturedImage = jQuery("#specificationFileUpload").val();
        controlID = "specificationFileUpload";
    }


    if (capturedImage == 'undefined' || capturedImage == "") {
        errorMessage = languageResource.resMsg_FaliedToUpload;
    }
    else {
        var dataFileName = jQuery("#" + controlID).val().split('\\').pop();
        var ext = capturedImage.substring(capturedImage.lastIndexOf('.') + 1).toLowerCase();

        if ((ext == "pdf" || ext == "xls" || ext == "xlsx" || ext == "doc" || ext == "docx" || ext == "txt" || ext == "xps" || ext == "ppt" || ext == "pptx" || ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg")) {
            var currentDate = new Date();
            currentDateAndTime = currentDate.format("yyyyMMddhhmmss");
            if (isManualUpload == true) {
                fileName = "Doc_" + currentDateAndTime + "_" + dataFileName;
                isValid = true;
                fileType = 'D'
            }
            else {
                fileName = "Spec_" + currentDateAndTime + "_" + dataFileName;
                isValid = true;
                fileType = 'S'
            }
        }
        else {
            errorMessage = languageResource.resMsg_InvalidFormatSelectDocumnetFile;
        }
    }
    if (isValid == false) {
        ShowAlertMessage(errorMessage, 'red', 'blue');
        return false;
    }
    else {
        FileUpload(controlID, fileName, fileType);

    }
}

function FileUpload(controlID, fileName, fileType) {
    jQuery("#divProgress").show();
    var returnValue = false;
    var infoType = "";

    if (jQuery.DocumnetsAndImagesNamespace.Type == jQuery.DocumnetsAndImagesNamespace.InfoType.Equipment) {
        infoType = "Equipment";
    }
    else if (jQuery.DocumnetsAndImagesNamespace.Type == jQuery.DocumnetsAndImagesNamespace.InfoType.Equipment_Model) {
        infoType = "Equipment_Model";
    }

    jQuery.support.cors = true;
    jQuery.ajaxFileUpload({
        type: "POST",
        url: jQuery.DocumnetsAndImagesNamespace.UploaderPath + '?uid=' + jQuery.DocumnetsAndImagesNamespace.BasicParam.UserID + '&sid=' + jQuery.DocumnetsAndImagesNamespace.BasicParam.SiteID + '&EID=' + jQuery.DocumnetsAndImagesNamespace.EquipmentID + '&fileName=' + fileName + '&type=' + infoType + '&maintenanceDocs=true',
        fileElementId: controlID,
        success: function (data, status) {
            jQuery("#" + controlID).val('');
            if (data.documentElement.innerText != "true") {
                ShowAlertMessage(languageResource.resMsg_FaliedToUpload, 'red', 'blue');
                return false;
            }
            else {
                var imagePath = jQuery.DocumnetsAndImagesNamespace.MaintDocumentLocation + "/" + infoType + "/" + jQuery.DocumnetsAndImagesNamespace.BasicParam.SiteID + "/" + jQuery.DocumnetsAndImagesNamespace.EquipmentID + "/";
                var downloadPath = imagePath + fileName;
                var thumbnailPath = imagePath + "Thumbnail/" + fileName;
                InsertDocumentImageVideoInfo(fileName, fileType, downloadPath, thumbnailPath);
                return true;
            }
        },
        complete: function () {
            jQuery("#divProgress").hide();
        },
        error: function (data, status, e) {
            jQuery("#divProgress").hide();
            jQuery("#" + controlID).val('');
            returnValue = false;
            ShowAlertMessage(e.message, 'red', 'blue');
        }
    });
    return true;
}

function InsertDocumentImageVideoInfo(fileName, fileType, downloadPath, thumbnailPath) {
    var filterInfo = {};
    filterInfo.SiteID = jQuery.DocumnetsAndImagesNamespace.BasicParam.SiteID;
    filterInfo.UserID = jQuery.DocumnetsAndImagesNamespace.BasicParam.UserID;
    filterInfo.ReferenceID = jQuery.DocumnetsAndImagesNamespace.EquipmentID;
    filterInfo.DocumentType = GetDocumentTypeText(fileType);
    filterInfo.InfoType = GetInfoTypeText(jQuery.DocumnetsAndImagesNamespace.Type);
    filterInfo.DocumentName = fileName;

    jQuery.ajax({
        type: "POST",
        url: jQuery.DocumnetsAndImagesNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/InsertDocumentsAndImagesInfo",
        data: JSON.stringify({ filterInfo: filterInfo }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if (json.d != null || json.d != undefined) {
                if (json.d > 0) {                   

                    var docInfo = {};
                    docInfo.DocumentID = json.d;
                    docInfo.DocumentType = fileType;
                    docInfo.DocumentName = filterInfo.DocumentName;
                    docInfo.DocumentDisplayName = filterInfo.DocumentName.split('.')[0].substring(filterInfo.DocumentName.indexOf('_', filterInfo.DocumentName.indexOf('_') + 1) + 1);
                    docInfo.DownloadPath = downloadPath;
                    docInfo.IsModelDocument = false;
                    docInfo.ThumbnailPath = '';

                    switch (fileType) {
                        case 'I':                            
                            docInfo.ThumbnailPath = thumbnailPath;
                            viewDocumnetsAndImagesModal.ImagesAndVideosList.push(docInfo);
                            break;
                        case 'V':
                            docInfo.ThumbnailPath = jQuery.DocumnetsAndImagesNamespace.DocThumbnailPath + 'video.png';
                            viewDocumnetsAndImagesModal.ImagesAndVideosList.push(docInfo);
                            break;
                        default:
                            var ext = filterInfo.DocumentName.substring(filterInfo.DocumentName.lastIndexOf('.') + 1).toLowerCase();
                            if (ext == "png" || ext == "jpeg" || ext == "jpg") {
                                docInfo.ThumbnailPath = thumbnailPath;
                            }
                            else {
                                docInfo.ThumbnailPath = jQuery.DocumnetsAndImagesNamespace.DocThumbnailPath + ext + '.png';
                            }
                            if (fileType === 'D') {
                                viewDocumnetsAndImagesModal.ManualDocumentsList.push(docInfo);
                            }
                            else if (fileType === 'S') {
                                viewDocumnetsAndImagesModal.SpecificationDocumentsList.push(docInfo);
                            }
                            break;
                    }

                }
                else if (json.d == -1) { //failed to load documnet info
                    ShowAlertMessage(languageResource.resMsg_FaliedToDocumentUpload, 'red', 'blue');
                }
            }
            else {
                ShowAlertMessage(languageResource.resMsg_FaliedToDocumentUpload, 'red', 'blue');
            }
        },
        beforeSend: function () {

        },
        complete: function () {
            jQuery("#divProgress").hide();
        },
        error: function (request, error) {
            jQuery("#divProgress").hide();
            if (request.responseText != "") {
                var errorMsg = $.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    ShowAlertMessage(languageResource.resMsg_Error + errorMsg.Message, 'red', 'blue');
                else
                    ShowAlertMessage(languageResource.resMsg_Error + languageResource.resMsg_FaliedToUpload, 'red', 'blue');
            }
            else {
                ShowAlertMessage(languageResource.resMsg_Error + languageResource.resMsg_FaliedToUpload, 'red', 'blue');
            }
        }
    });
}


function ShowAlertMessage(displayText, addClass, removeClass) {
    jQuery("#alertMessage").removeClass(removeClass);
    jQuery("#alertMessage").addClass(addClass);
    jQuery("#alertMessage").html(displayText);
    jQuery("#divAlertModal").dialog({
        zIndex: 1060,
        buttons: [
            {
                text: languageResource.resMsg_Ok,
                click: function () {
                    jQuery("#divAlertModal").dialog("close");
                }
            }
        ]
    });
}

function GetInfoTypeText(infoType) {
    if (infoType.toUpperCase() == jQuery.DocumnetsAndImagesNamespace.InfoType.Equipment.toString()) {
        return jQuery.DocumnetsAndImagesNamespace.InfoType.Equipment.charCodeAt(0);
    }
    else if (infoType.toUpperCase() == jQuery.DocumnetsAndImagesNamespace.InfoType.Equipment_Model.toString()) {
        return jQuery.DocumnetsAndImagesNamespace.InfoType.Equipment_Model.charCodeAt(0);
    }
    else {
        return jQuery.DocumnetsAndImagesNamespace.InfoType.None.charCodeAt(0);
    }
}

function GetDocumentTypeText(docType) {
    if (docType.toUpperCase() == jQuery.DocumnetsAndImagesNamespace.DocumentType.DOCUMENT.toString()) {
        return jQuery.DocumnetsAndImagesNamespace.DocumentType.DOCUMENT.charCodeAt(0);
    }
    else if (docType.toUpperCase() == jQuery.DocumnetsAndImagesNamespace.DocumentType.SDOCUMENT.toString()) {
        return jQuery.DocumnetsAndImagesNamespace.DocumentType.SDOCUMENT.charCodeAt(0);
    }
    else if (docType.toUpperCase() == jQuery.DocumnetsAndImagesNamespace.DocumentType.IMAGE.toString()) {
        return jQuery.DocumnetsAndImagesNamespace.DocumentType.IMAGE.charCodeAt(0);
    }
    else if (docType.toUpperCase() == jQuery.DocumnetsAndImagesNamespace.DocumentType.VIDEO.toString()) {
        return jQuery.DocumnetsAndImagesNamespace.DocumentType.VIDEO.charCodeAt(0);
    }
    else {
        return jQuery.DocumnetsAndImagesNamespace.DocumentType.NONE.charCodeAt(0);
    }

}

function DownloadDocumentOrImageOrVideoInfo(item) {
    if (item.DownloadPath.length > 0 && item.DocumentName.length > 0) {
        var fileName = item.DocumentName;
        var filePath = item.DownloadPath;
        window.location = jQuery.DocumnetsAndImagesNamespace.BasePath + "/HandlerFiles/DownloadHandler.ashx?MaintenanceDocsName=" + fileName + "&MaintenanceDocsPath=" + filePath;

    }
    else {
        var errorMessage = '';
        if (item.DocumentType == 'I' || item.DocumentType == 'V') {
            errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToDownloadImageOrVideo;
        }
        else if (item.DocumentType == 'D') {
            errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToDownloadDocument;
        }
        ShowAlertMessage(errorMessage, 'red', 'blue');
    }
}

function LoadImageOrVideoInfo(path, docinfo) {
    var divModal = window.parent.document.getElementById("div_VideoPhotoModal");
    var imgIframeLink = window.parent.document.getElementById("imgIframeLink");
    var iframeModalLink = window.parent.document.getElementById("iframeModalLink");
    jQuery(imgIframeLink).attr("src", "");
    //jQuery(iframeModalLink).attr("src", "");
    //jQuery(iframeModalLink).html('');

    jQuery(imgIframeLink).addClass("hide");
    jQuery(iframeModalLink).addClass("hide");
    if (docinfo.DocumentType == "I") {
        jQuery(imgIframeLink).removeClass("hide");
        jQuery(imgIframeLink).attr("src", path);
        jQuery(imgIframeLink).css({ "width": "400px", "height": "400px" });
        jQuery(divModal).modal("show");
    } else if (docinfo.DocumentType == "V") {
        if (navigator.userAgent.search("MSIE") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
        {
            window.open(path);
        }
        else {
            jQuery(iframeModalLink).removeClass("hide");
            iframeModalLink.pause();
            iframeModalLink.removeAttribute('src');
            iframeModalLink.load();
            //jQuery(iframeModalLink).attr("src", path);
            jQuery(iframeModalLink).html('<source src="' + path + '" type="video/mp4"></source>');
            jQuery(iframeModalLink).css({ "height": "" });
            jQuery(divModal).modal("show");
            jQuery(divModal).on('hide.bs.modal', function () {
                iframeModalLink.pause();
                iframeModalLink.removeAttribute('src');
            });
        }
    }
}

function ShowErrorMessage(msg, isError) {
    if (isError == true || isError == undefined)
        jQuery("#alertMessage").addClass("text-danger")
    else
        jQuery("#alertMessage").removeClass("text-danger")
    jQuery("#alertMessage").html(msg);
    jQuery("#divAlertModal").dialog({
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

function ViewAdditionalInfoLinks(additionalLinksType) {
    var queryString = "?id=" + jQuery.DocumnetsAndImagesNamespace.BasicParam.SiteID;

    if (additionalLinksType == jQuery.DocumnetsAndImagesNamespace.AdditionalLinksType.FunctionalLocation) {
        queryString = queryString + "&flid=" + jQuery.DocumnetsAndImagesNamespace.FLocationID;
        window.location.href = jQuery.DocumnetsAndImagesNamespace.BasePath + "/Preventive/AddFunctionalLocation.aspx" + queryString;
    }
    else if (additionalLinksType == jQuery.DocumnetsAndImagesNamespace.AdditionalLinksType.Equipment) {
        queryString = queryString + "&eid=" + jQuery.DocumnetsAndImagesNamespace.EquipmentID + "&flid=" + jQuery.DocumnetsAndImagesNamespace.FLocationID;
        window.location.href = jQuery.DocumnetsAndImagesNamespace.BasePath + "/Preventive/AddEquipmentInfo.aspx" + queryString;
    }
    else if (additionalLinksType == jQuery.DocumnetsAndImagesNamespace.AdditionalLinksType.Equipment_Model) {
        queryString = queryString + "&eid=" + jQuery.DocumnetsAndImagesNamespace.EquipmentID;
        window.location.href = jQuery.DocumnetsAndImagesNamespace.BasePath + "/Preventive/AddEquipmentModel.aspx" + queryString;
    }
}