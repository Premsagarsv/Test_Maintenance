jQuery.AddFunctionalLocationNamespace = jQuery.AddFunctionalLocationNamespace || {};
jQuery.AddFunctionalLocationNamespace.BasicParam = jQuery.AddFunctionalLocationNamespace.BasicParam || {};
jQuery.AddFunctionalLocationNamespace.BasePath = "";
jQuery.AddFunctionalLocationNamespace.WebServicePath = "";
jQuery.AddFunctionalLocationNamespace.ImageDefaultPath = "";
jQuery.AddFunctionalLocationNamespace.LoactionID = 0;
jQuery.AddFunctionalLocationNamespace.UploaderPath = "";
jQuery.AddFunctionalLocationNamespace.LocationImageName = "";
jQuery.AddFunctionalLocationNamespace.FLocationImagePath = "";
jQuery.AddFunctionalLocationNamespace.LoadControlID = "";
jQuery.AddFunctionalLocationNamespace.MeasuringPointDataTyeInfo = { "Equipment_Model": 'M', "Equipment": 'E', "Functional_Location": 'L' };
jQuery.AddFunctionalLocationNamespace.AdditionalLinksType = { "Equipment": 'E', "MeasuringPoint":'P'};
jQuery.AddFunctionalLocationNamespace.ParentLocationsList = [];

var addFunctionalLocationViewModel = {
    FLocationsInfoArray: ko.observableArray([]),
    HasDeleteAccess: false,
    HasEditAccess: false,
    IsEditFieldsDisabled: ko.observable(false),
    FLocationName: ko.observable(''),
    FLocationDesc: ko.observable(''),
    ParentFLocation: ko.observable(0),
    LoadErrorMessageVisible: ko.observable(false),
    LoadErrorMessage: ko.observable(''),
    LoadErrorMessageClass: ko.observable(''),
    ParentLocationsList: ko.observableArray([])
};

function FunctionalLocationBasicInfo(basicParam, basePath, webServicePath, imageDefaultPath, uploaderPath, loactionID, fLocationImgPath, hasDeleteAccess, hasEditAccess, loadControlID) {
    jQuery.AddFunctionalLocationNamespace.BasicParam = basicParam;
    jQuery.AddFunctionalLocationNamespace.BasePath = basePath;
    jQuery.AddFunctionalLocationNamespace.WebServicePath = webServicePath;
    jQuery.AddFunctionalLocationNamespace.ImageDefaultPath = imageDefaultPath;
    jQuery.AddFunctionalLocationNamespace.UploaderPath = uploaderPath;
    jQuery.AddFunctionalLocationNamespace.LoactionID = loactionID;
    jQuery.AddFunctionalLocationNamespace.FLocationImagePath = fLocationImgPath;
    jQuery.AddFunctionalLocationNamespace.LoadControlID = loadControlID;

    addFunctionalLocationViewModel.HasDeleteAccess = hasDeleteAccess === "True" ? true : false;
    addFunctionalLocationViewModel.HasEditAccess = hasEditAccess === "True" ? true : false;
    ko.applyBindings(addFunctionalLocationViewModel, document.getElementById("divAddFunctionalLocation"));
    
    if (jQuery.AddFunctionalLocationNamespace.LoactionID == 0) {
        jQuery("#imgFLocationImage").attr('src', jQuery.AddFunctionalLocationNamespace.ImageDefaultPath);
    }

    if (hasEditAccess.toLowerCase() != "true") {
        jQuery("#imageFileToUpload").attr('disabled', 'disabled');
    }

    var totPageHeight = jQuery(window).height();
    var fLocationStartPos = jQuery("#divFLocationsList").offset().top;
    fLocationMaxHeight = totPageHeight - fLocationStartPos;

    if (jQuery(window).width() < 768)
        fLocationMaxHeight = 500;

    jQuery("#divFLocationsList").css('max-height', fLocationMaxHeight);


    LoadLoactionInfo(loactionID);
}

function LoadLoactionInfo(locationID) {
    jQuery.AddFunctionalLocationNamespace.LoactionID = locationID;   
    jQuery(".flocations").removeClass('bg-info');
    jQuery("#div_" + locationID).addClass('bg-info');

    var filterFLocationInfo = {};
    filterFLocationInfo.SiteID = jQuery.AddFunctionalLocationNamespace.BasicParam.SiteID;
    filterFLocationInfo.UserID = jQuery.AddFunctionalLocationNamespace.BasicParam.UserID;
    filterFLocationInfo.FLocationID = jQuery.AddFunctionalLocationNamespace.LoactionID;
    filterFLocationInfo.ConsiderFLoc = true;

    jQuery.ajax({
        type: "POST",
        url: jQuery.AddFunctionalLocationNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/GetFunctionalLocationInfo",
        data: JSON.stringify({ filterFLocationInfo: filterFLocationInfo }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        async: false,
        success: function (json) {
            if (json != undefined && json.d != undefined) {
                if (json.d.FunctionalLocationList != null || json.d.FunctionalLocationList != undefined) {
                    jQuery.each(json.d.FunctionalLocationList, function (i, fLocation) {
                        locationInfo = {};
                        locationInfo.TypeValue = fLocation.FunctionalLocationID;
                        locationInfo.DisplayName = fLocation.FunctionalLocationName;
                      jQuery.AddFunctionalLocationNamespace.ParentLocationsList.push(locationInfo);
                    });

                    //load parent loaction dropdown
                    BindParentLoactions();

                    //load right side location filters
                    jQuery.each(json.d.FunctionalLocationList, function (i, fLocation) {
                        var locationInfo = {};
                        locationInfo.TypeValue = fLocation.FunctionalLocationID;
                        locationInfo.DisplayName = fLocation.FunctionalLocationName;
                        if (fLocation.FunctionalLocationID == jQuery.AddFunctionalLocationNamespace.LoactionID)
                            locationInfo.SelectedClass = "bg-info";
                        else
                            locationInfo.SelectedClass = "";
                        addFunctionalLocationViewModel.FLocationsInfoArray.push(locationInfo);
                    });
                }

                //load edit fields
                if (locationID > 0) {
                    addFunctionalLocationViewModel.FLocationName(json.d.FunctionalLocationInfo.FunctionalLocationName);
                    addFunctionalLocationViewModel.FLocationDesc(json.d.FunctionalLocationInfo.FunctionalLocationDesc);
                    addFunctionalLocationViewModel.ParentFLocation(json.d.FunctionalLocationInfo.ParentLocationID);
                    jQuery("#drpFLocationParent").val(json.d.FunctionalLocationInfo.ParentLocationID);
                    jQuery("#drpFLocationParent").select2();
                    if (json.d.FunctionalLocationInfo.FunctionalLocationImagePath != null && json.d.FunctionalLocationInfo.FunctionalLocationImagePath != undefined && json.d.FunctionalLocationInfo.FunctionalLocationImagePath.length > 0) {
                        jQuery("#imgFLocationImage").attr('src', json.d.FunctionalLocationInfo.FunctionalLocationImagePath);
                    }
                    else {
                        jQuery("#imgFLocationImage").attr('src', jQuery.AddFunctionalLocationNamespace.ImageDefaultPath);
                    }
                }
            }
            else {
                ShowErrorMessage(languageResource.resMsg_FailedToLoadFunctionalLocationInfo, true);
            }
        },
        beforeSend: function () {
            jQuery("#divLoadProgressVisible").show();
            addFunctionalLocationViewModel.FLocationsInfoArray.removeAll();
            addFunctionalLocationViewModel.ParentLocationsList.removeAll();
            jQuery.AddFunctionalLocationNamespace.ParentLocationsList = [];
        },
        complete: function () {
            jQuery("#divLoadProgressVisible").hide();
        },
        error: function (request, error) {
            var errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadFunctionalLocationInfo;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    errorMessage = languageResource.resMsg_Error + errorMsg.Message;
            }
            ShowErrorMessage(errorMessage, true);
        }
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

function AddUpdateFunctionalLoaction(isUpdate) {
    jQuery("#lblSaveUpdateError").removeClass("text-info");
    jQuery("#lblSaveUpdateError").addClass("text-danger");
    if (jQuery.trim(addFunctionalLocationViewModel.FLocationName()).length == 0) {
        jQuery("#lblSaveUpdateError").text(languageResource.resMsg_EnterLocationName);
    }
    else {
        var functionalLocInfo = {};
        if (isUpdate)
            functionalLocInfo.FunctionalLocationID = jQuery.AddFunctionalLocationNamespace.LoactionID;
        else
            functionalLocInfo.FunctionalLocationID = 0;
        functionalLocInfo.FunctionalLocationName = jQuery.trim(addFunctionalLocationViewModel.FLocationName());
        functionalLocInfo.FunctionalLocationDesc = jQuery.trim(addFunctionalLocationViewModel.FLocationDesc());
        functionalLocInfo.ParentLocationID = jQuery("#drpFLocationParent").val() == null ? 0 : jQuery("#drpFLocationParent").val();

        if (jQuery.AddFunctionalLocationNamespace.LocationImageName != null || jQuery.AddFunctionalLocationNamespace.LocationImageName != undefined || jQuery.AddFunctionalLocationNamespace.LocationImageName != "") {
            functionalLocInfo.FunctionalLocationImageName = jQuery.AddFunctionalLocationNamespace.LocationImageName;
        }
        else {
            functionalLocInfo.FunctionalLocationImageName = "";
        }
        jQuery.ajax({
            type: "POST",
            url: jQuery.AddFunctionalLocationNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/InsertOrUpdateFunctionalLocInfo",
            data: JSON.stringify({ basicParam: jQuery.AddFunctionalLocationNamespace.BasicParam, functionalLocInfo: functionalLocInfo }),
            contentType: "application/json; charset=utf-8",
            datatype: 'json',
            async: false,
            success: function (json) {
                if (json != null || json.d != undefined || json.d != 0) {
                    var result = json.d;
                    if (result == -1) {//Already exist
                        jQuery("#lblSaveUpdateError").removeClass("text-info");
                        jQuery("#lblSaveUpdateError").addClass("text-danger");
                        jQuery("#lblSaveUpdateError").text(languageResource.resMsg_AlreadyExistsLocation);
                    }
                    else if (result == -2) {//already exist in in-active status can not updated
                        jQuery("#lblSaveUpdateError").removeClass("text-info");
                        jQuery("#lblSaveUpdateError").addClass("text-danger");
                        jQuery("#lblSaveUpdateError").text(languageResource.resMsg_CanNotUpdatedAlreadyExistInInActiveState);
                    }
                    else if (result > 0) {
                        ClearFieldInfo();
                        LoadFunctionalLocationsList(false);

                        //successfully inserted || successfully updated
						jQuery.AddFunctionalLocationNamespace.LocationImageName = '';
                        jQuery("#" + jQuery.AddFunctionalLocationNamespace.LoadControlID).prop("onclick", null);
                        jQuery("#" + jQuery.AddFunctionalLocationNamespace.LoadControlID).show().attr('onclick', 'AddUpdateFunctionalLoaction(false);return false;');
                        jQuery("#" + jQuery.AddFunctionalLocationNamespace.LoadControlID).html(languageResource.resMsg_SaveAndAddMore);

                        jQuery("#lblSaveUpdateError").removeClass("text-danger");
                        jQuery("#lblSaveUpdateError").addClass("text-info");
                        jQuery("#lblSaveUpdateError").text(languageResource.resMsg_SuccessfullySaveFLocationInfo);

                        //jQuery.AddFunctionalLocationNamespace.LoactionID = result; //functional location id

                        jQuery(".flocations").removeClass('bg-info');
                        jQuery("#div_" + result).addClass('bg-info');
                    }
                }
                else {
                    jQuery("#lblSaveUpdateError").removeClass("text-info");
                    jQuery("#lblSaveUpdateError").addClass("text-danger");
                    jQuery("#lblSaveUpdateError").text(languageResource.resMsg_FailedAddOrUpdateLocation);
                }
            },
            beforeSend: function () {
                jQuery("#divProgress").show();
                jQuery("#lblSaveUpdateError").removeClass("text-danger");
                jQuery("#lblSaveUpdateError").text('');
            },
            complete: function () {
                jQuery("#divProgress").hide();
            },
            error: function (request, error) {
                jQuery("#divProgress").hide();
                var errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedAddOrUpdateLocation;
                if (request.responseText != "") {
                    var errorMsg = jQuery.parseJSON(request.responseText);
                    if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                        errorMessage = languageResource.resMsg_Error + errorMsg.Message;
                }
                jQuery("#lblSaveUpdateError").addClass("text-danger");
                jQuery("#lblSaveUpdateError").text(errorMessage);
            }
        });
    }
}

var isChanged = true;
function FunctionalLocationImageUpload() {
    if (isChanged) {
        isChanged = false;
        var imageName = ""; var isValid = false; var errorMessage = '';
        var capturedImage = jQuery("#imageFileToUpload").val();
        var fileSize = jQuery("#imageFileToUpload")[0].files[0].size;
        fileSize = fileSize / 1024;//size in kb
        fileSize = fileSize / 1024;//size in mb

        if (capturedImage == 'undefined' || capturedImage == "") {
            errorMessage = languageResource.resMsg_FaiedToCaptureImage;
            isValid = false;
        }
        else {
            var ext = capturedImage.substring(capturedImage.lastIndexOf('.') + 1).toLowerCase();
            if (ext == "png" || ext == "jpeg" || ext == "jpg") {
                var currentDate = new Date();
                currentDateAndTime = currentDate.format("yyyyMMddhhmmss");
                imageName = "IMG_" + currentDateAndTime + "." + ext;
                isValid = true;
            }
            else {
                errorMessage = languageResource.resMsg_InvalidImageFormat;
            }
        }
        if (fileSize > 5) {
            errorMessage = languageResource.resMsg_InvalidImagesize;
            isValid = false;
        }

        if (!isValid) {
            ShowErrorMessage(errorMessage, true);
            jQuery("#imageFileToUpload").val('');
            imageName = '';
            isChanged = true;
        }

        if (isValid) {
            var urlString = jQuery.AddFunctionalLocationNamespace.UploaderPath + '?uid=' + jQuery.AddFunctionalLocationNamespace.BasicParam.UserID + '&sid=' + jQuery.AddFunctionalLocationNamespace.BasicParam.SiteID + '&fileName=' + imageName + '&functionalLocation=true';

            jQuery.ajaxFileUpload({
                type: "POST",
                url: urlString,
                fileElementId: 'imageFileToUpload',
                success: function (data, status) {
                    jQuery("#imageFileToUpload").val('');
                    if (data.documentElement.innerText != "true") {
                        ShowErrorMessage(languageResource.resMsg_FailedToUploadImage, true);
                        imageName = '';
                    }
                    else {
                        jQuery.AddFunctionalLocationNamespace.LocationImageName = imageName;
                        jQuery("#imgFLocationImage").attr('src', jQuery.AddFunctionalLocationNamespace.FLocationImagePath + "/" + imageName);
                    }
                    isChanged = true;
                },
                error: function (request, error) {
                    jQuery("#imageFileToUpload").val('');
                    var errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToUploadImage;
                    if (request.responseText != "") {
                        var errorMsg = jQuery.parseJSON(request.responseText);
                        if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                            errorMessage = languageResource.resMsg_Error + errorMsg.Message;
                    }
                    ShowErrorMessage(errorMessage, true);
                    imageName = '';
                    isChanged = true;
                }
            });
        }
    }
}

function ClearFieldInfo() {
     jQuery("#lblSaveUpdateError").html("");
     jQuery("#div_" + jQuery.AddFunctionalLocationNamespace.LoactionID).removeClass('bg-info');
     if (jQuery.AddFunctionalLocationNamespace.LoactionID == 0)
     jQuery("#divFLocationsList > div").find('label').removeClass('bg-info');
     jQuery.AddFunctionalLocationNamespace.LoactionID = 0;
    addFunctionalLocationViewModel.FLocationName('');
    addFunctionalLocationViewModel.FLocationDesc('');
    jQuery("#txtFLocationDesc").autoResize();
 	jQuery.AddFunctionalLocationNamespace.LocationImageName = "";
    jQuery("#imgFLocationImage").attr('src', jQuery.AddFunctionalLocationNamespace.ImageDefaultPath);
    BindParentLoactions();
    jQuery("#" + jQuery.AddFunctionalLocationNamespace.LoadControlID).html(languageResource.resMsg_SaveAndAddMore);
    if (addFunctionalLocationViewModel.HasEditAccess && !addFunctionalLocationViewModel.HasDeleteAccess)
        jQuery("#" + jQuery.AddFunctionalLocationNamespace.LoadControlID).addClass('disabled');
   
}

function LoadFunctionalLocationsList(selectDefaultRow) {
    var functionalLocName = jQuery.trim(jQuery("#txtSeachFLocation").val());
    jQuery.ajax({
        type: "POST",
        url: jQuery.AddFunctionalLocationNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/GetAllFunctionalLocations",
        data: JSON.stringify({ basicParam: jQuery.AddFunctionalLocationNamespace.BasicParam, functionalLocName: functionalLocName }),
        contentType: "application/json; charset=utf-8",
        async: false,
        datatype: 'json',
        success: function (json) {
            if (json != undefined && json.d != undefined) {
                if (json.d.length == 0) {
                    addFunctionalLocationViewModel.LoadErrorMessage(languageResource.resMsg_NoRecordsFound);
                    addFunctionalLocationViewModel.LoadErrorMessageClass('gray');
                    addFunctionalLocationViewModel.LoadErrorMessageVisible(true);
                }
                else {
                    /*# region Bind Functional Location List */
                    jQuery.each(json.d, function (i, fLocation) {
                        var locationInfo = {};
                        locationInfo.TypeValue = fLocation.FunctionalLocationID;
                        locationInfo.DisplayName = fLocation.FunctionalLocationName;
                        if (selectDefaultRow == true) {
                            if (fLocation.FunctionalLocationID == jQuery.AddFunctionalLocationNamespace.LoactionID)
                                locationInfo.SelectedClass = "bg-info";
                            else
                                locationInfo.SelectedClass = "";
                        }
                        else {
                            locationInfo.SelectedClass = "";
                        }
                        addFunctionalLocationViewModel.FLocationsInfoArray.push(locationInfo);
                    });
                    /*# endregion */

                    /*# region Bind Parent Functional Location */
                    jQuery.each(json.d, function (i, fLocation) {
                        locationInfo = {};
                        locationInfo.TypeValue = fLocation.FunctionalLocationID;
                        locationInfo.DisplayName = fLocation.FunctionalLocationName;
                        jQuery.AddFunctionalLocationNamespace.ParentLocationsList.push(locationInfo);
                    });
                    BindParentLoactions();
                    /*# endregion */
                }
            }
            else {
                addFunctionalLocationViewModel.LoadErrorMessage(languageResource.resMsg_FailedToLoadFunctionalLocationInfo);
                addFunctionalLocationViewModel.LoadErrorMessageClass('red');
                addFunctionalLocationViewModel.LoadErrorMessageVisible(true);
            }
        },
        beforeSend: function () {
            jQuery("#divLoadProgressVisible").show();
            addFunctionalLocationViewModel.FLocationsInfoArray.removeAll();
            jQuery.AddFunctionalLocationNamespace.ParentLocationsList = [];
            addFunctionalLocationViewModel.LoadErrorMessage('');
            addFunctionalLocationViewModel.LoadErrorMessageClass('');
            addFunctionalLocationViewModel.LoadErrorMessageVisible(false);
        },
        complete: function () {
            jQuery("#divLoadProgressVisible").hide();
        },
        error: function (request, error) {
            jQuery("#divLoadProgressVisible").hide();
            addFunctionalLocationViewModel.LoadErrorMessageClass('red');
            addFunctionalLocationViewModel.LoadErrorMessageVisible(true);
            var errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadFunctionalLocationInfo;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    errorMessage = languageResource.resMsg_Error + errorMsg.Message;
            }
            addFunctionalLocationViewModel.LoadErrorMessage(errorMessage);
        }
    });
}

function BindIconAttributes(hasAccess) {
    var iconAttributes = {};
    if (!hasAccess) {
        iconAttributes.disabled = "disabled";
    }
    return iconAttributes;
}

function DeleteLocationInfoClick(locationID) {
    jQuery("#alertMessage").removeClass("text-danger");
    jQuery("#alertMessage").html(languageResource.resMsg_DeleteLocationInfoConfirm);
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
                    DeleteLocationInfo(locationID);
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

function DeleteLocationInfo(locationID) {
    jQuery.ajax({
        type: "POST",
        url: jQuery.AddFunctionalLocationNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/DeleteFunctionalLocInfo",
        data: JSON.stringify({ basicParam: jQuery.AddFunctionalLocationNamespace.BasicParam, functionalLocationID: locationID }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if (json.d == 2) {
                if (locationID == jQuery.AddFunctionalLocationNamespace.LoactionID) {
                    addFunctionalLocationViewModel.FLocationName('');
                    addFunctionalLocationViewModel.FLocationDesc('');
                    jQuery.AddFunctionalLocationNamespace.LoactionID = 0;
                }
                ClearFieldInfo();
                LoadFunctionalLocationsList(true); 
            }
            else if (json.d == 1) {
                var msg = languageResource.resMsg_LocationInfoInUse;
                jQuery("#alertMessage").addClass("text-danger");
                ShowErrorMessage(msg, true);
            }
            else if (json.d == 3) {
                var msg = languageResource.resMsg_FunctionalLocationIsAssigned;
                ShowErrorMessage(msg, true);
            }
            else {
                var msg = languageResource.resMsg_FailedToDeleteLocationInfo;
                jQuery("#alertMessage").addClass("text-danger");
                ShowErrorMessage(msg, true);
            }
        },
        error: function (request, error) {
            var msg;
            if (request.responseText != "") {
                var errorMsg = request.responseText;//jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    msg = languageResource.resMsg_Error + errorMsg.Message;
                else
                    msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToDeleteLocationInfo;
            }
            else {
                msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToDeleteLocationInfo;
            }
            ShowErrorMessage(msg, true);
        },
    });
}

function GetEditFunctionalLocInfo(locationID, isDisabled) {
    jQuery.AddFunctionalLocationNamespace.LocationImageName = "";
    jQuery("#lblSaveUpdateError").html("");
    jQuery("#" + jQuery.AddFunctionalLocationNamespace.LoadControlID).html(languageResource.resMsg_Update);
    jQuery.AddFunctionalLocationNamespace.LoactionID = locationID;
    jQuery("#" + jQuery.AddFunctionalLocationNamespace.LoadControlID).show().attr('onclick', 'AddUpdateFunctionalLoaction(true);return false;');
    jQuery(".flocations").removeClass('bg-info');
    jQuery("#div_" + locationID).addClass('bg-info');
    addFunctionalLocationViewModel.IsEditFieldsDisabled(isDisabled);

    //if (addFunctionalLocationViewModel.HasEditAccess == true) {
    //    jQuery("#" + jQuery.AddFunctionalLocationNamespace.LoadControlID).removeClass('disabled');
    //}
    //else {
    //    jQuery("#" + jQuery.AddFunctionalLocationNamespace.LoadControlID).addClass('disabled');
    //}
    jQuery("#" + jQuery.AddFunctionalLocationNamespace.LoadControlID).removeClass('disabled');

    BindParentLoactions();

    var filterFLocationInfo = {};
    filterFLocationInfo.SiteID = jQuery.AddFunctionalLocationNamespace.BasicParam.SiteID;
    filterFLocationInfo.UserID = jQuery.AddFunctionalLocationNamespace.BasicParam.UserID;
    filterFLocationInfo.FLocationID = locationID;
    filterFLocationInfo.ConsiderFLoc = false;

    jQuery.ajax({
        type: "POST",
        url: jQuery.AddFunctionalLocationNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/GetFunctionalLocationInfo",
        data: JSON.stringify({ filterFLocationInfo: filterFLocationInfo }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        async: false,
        success: function (json) {
            if (json != undefined && json.d != undefined) {
                //load edit fields
                if (locationID > 0) {
                    addFunctionalLocationViewModel.FLocationName(json.d.FunctionalLocationInfo.FunctionalLocationName);
                    addFunctionalLocationViewModel.FLocationDesc(json.d.FunctionalLocationInfo.FunctionalLocationDesc);
                    jQuery("#txtFLocationDesc").autoResize();
                    addFunctionalLocationViewModel.ParentFLocation(json.d.FunctionalLocationInfo.ParentLocationID);
                    jQuery("#drpFLocationParent").val(json.d.FunctionalLocationInfo.ParentLocationID);
                    jQuery("#drpFLocationParent").select2();
                    if (json.d.FunctionalLocationInfo.FunctionalLocationImagePath == undefined || json.d.FunctionalLocationInfo.FunctionalLocationImagePath == null || json.d.FunctionalLocationInfo.FunctionalLocationImagePath == "")
                        jQuery("#imgFLocationImage").attr('src', jQuery.AddFunctionalLocationNamespace.ImageDefaultPath);
                    else {
                        jQuery("#imgFLocationImage").attr('src', json.d.FunctionalLocationInfo.FunctionalLocationImagePath);
                    } 
                }
            }
            else {
                ShowErrorMessage(languageResource.resMsg_FailedToLoadFunctionalLocationInfo, true);
            }
        },
        beforeSend: function () {
            jQuery("#divLoadProgressVisible").show();
        },
        complete: function () {
            jQuery("#divLoadProgressVisible").hide();
        },
        error: function (request, error) {
            var errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadFunctionalLocationInfo;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    errorMessage = languageResource.resMsg_Error + errorMsg.Message;
            }
            ShowErrorMessage(errorMessage, true);
        }
    });
}

function LoadLoactionInfoForEdit(locationID) {
    if (jQuery.AddFunctionalLocationNamespace.LoactionID != locationID)
        GetEditFunctionalLocInfo(locationID, false);
    else {
        addFunctionalLocationViewModel.IsEditFieldsDisabled(false);
    }
}

function ViewFLocationList(filterObjectInfo) {
    var queryString = "?id=" + jQuery.AddFunctionalLocationNamespace.BasicParam.SiteID;
    window.location.href = jQuery.AddFunctionalLocationNamespace.BasePath + "/Preventive/FunctionalLocationList.aspx" + queryString;
}

function BindParentLoactions() {
    addFunctionalLocationViewModel.ParentLocationsList.removeAll();
    //load parent loaction dropdown
    var locationInfo = {};
    locationInfo.TypeValue = 0;
    locationInfo.DisplayName = languageResource.resMsg_SelectFunctionalLocation;
    addFunctionalLocationViewModel.ParentLocationsList.push(locationInfo);
    jQuery.each(jQuery.AddFunctionalLocationNamespace.ParentLocationsList, function (i, fLocation) {
        var newLocationInfo = {};
        newLocationInfo.TypeValue = fLocation.TypeValue;
        newLocationInfo.DisplayName = fLocation.DisplayName;
        if (fLocation.TypeValue != jQuery.AddFunctionalLocationNamespace.LoactionID) {
            addFunctionalLocationViewModel.ParentLocationsList.push(newLocationInfo);
        }
    });
 jQuery("#drpFLocationParent").select2();
}

function ViewAdditionalInfoLinks(additionalLinksType) {
    var queryString = "?id=" + jQuery.AddFunctionalLocationNamespace.BasicParam.SiteID;
    if (jQuery.AddFunctionalLocationNamespace.LoactionID == 0) {
        if (jQuery("#divFLocationsList > div").find("label").hasClass('bg-info')) {
            jQuery.AddFunctionalLocationNamespace.LoactionID = addFunctionalLocationViewModel.FLocationsInfoArray()[0].TypeValue;
        }
    }
    if (additionalLinksType == jQuery.AddFunctionalLocationNamespace.AdditionalLinksType.Equipment) {
        queryString = queryString + "&flid=" + jQuery.AddFunctionalLocationNamespace.LoactionID;
        window.location.href = jQuery.AddFunctionalLocationNamespace.BasePath + "/Preventive/AddEquipmentInfo.aspx" + queryString;
    }
    else if (additionalLinksType == jQuery.AddFunctionalLocationNamespace.AdditionalLinksType.MeasuringPoint) {
        queryString = queryString + "&type=" + jQuery.AddFunctionalLocationNamespace.MeasuringPointDataTyeInfo.Functional_Location.toString() + "&flid=" + jQuery.AddFunctionalLocationNamespace.LoactionID;
        window.location.href = jQuery.AddFunctionalLocationNamespace.BasePath + "/Preventive/AddMeasuringPoint.aspx" + queryString;
    }
}
