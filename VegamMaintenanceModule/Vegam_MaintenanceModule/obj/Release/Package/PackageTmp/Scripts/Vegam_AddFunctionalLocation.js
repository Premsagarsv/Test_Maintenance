jQuery.AddFunctionalLocationNamespace = jQuery.AddFunctionalLocationNamespace || {};
jQuery.AddFunctionalLocationNamespace.BasicParam = jQuery.AddFunctionalLocationNamespace.BasicParam || {};
jQuery.AddFunctionalLocationNamespace.PagerData = jQuery.AddFunctionalLocationNamespace.PagerData || {};
jQuery.AddFunctionalLocationNamespace.BasePath = "";
jQuery.AddFunctionalLocationNamespace.WebServicePath = "";
jQuery.AddFunctionalLocationNamespace.ImageDefaultPath = "";
jQuery.AddFunctionalLocationNamespace.LocationID = 0;
jQuery.AddFunctionalLocationNamespace.UploaderPath = "";
jQuery.AddFunctionalLocationNamespace.LocationImageName = "";
jQuery.AddFunctionalLocationNamespace.FLocationImagePath = "";
jQuery.AddFunctionalLocationNamespace.LoadControlID = "";
jQuery.AddFunctionalLocationNamespace.MeasuringPointDataTyeInfo = { "Equipment_Model": 'M', "Equipment": 'E', "Functional_Location": 'L' };
jQuery.AddFunctionalLocationNamespace.AdditionalLinksType = { "Equipment": 'E', "MeasuringPoint": 'P' };
jQuery.AddFunctionalLocationNamespace.InfoType = { "Equipment_Model": 'M', "Equipment": 'E', "Measuring_Point": 'P',"Location":'L', "None": 'N' };
jQuery.AddFunctionalLocationNamespace.AssignedWorkGroupInfo = [];

var addFunctionalLocationViewModel = {
    FLocationsInfoArray: ko.observableArray([]),
    HasDeleteAccess: false,
    HasEditAccess: false,
    FLocationName: ko.observable(''),
    FLocationDesc: ko.observable(''),
    ParentFLocation: ko.observable(0),
    FunctionalLocationCode: ko.observable(''),
    BtnGenerateCode: ko.observable(true),
    LoadErrorMessageVisible: ko.observable(false),
    LoadErrorMessage: ko.observable(''),
    LoadErrorMessageClass: ko.observable(''),
    PagerContent: ko.observable(''),
    ParentLocationsList: ko.observableArray([]),
    WorkGroupList: ko.observableArray([]),
    SelectedWorkGroupInfoList: ko.observableArray([])
};

function FunctionalLocationBasicInfo(pagerData, basicParam, basePath, webServicePath, imageDefaultPath, uploaderPath, locationID, fLocationImgPath, hasDeleteAccess, hasEditAccess, loadControlID) {
    jQuery.AddFunctionalLocationNamespace.BasicParam = basicParam;
    jQuery.AddFunctionalLocationNamespace.PagerData = pagerData;
    jQuery.AddFunctionalLocationNamespace.BasePath = basePath;
    jQuery.AddFunctionalLocationNamespace.WebServicePath = webServicePath;
    jQuery.AddFunctionalLocationNamespace.ImageDefaultPath = imageDefaultPath;
    jQuery.AddFunctionalLocationNamespace.UploaderPath = uploaderPath;
    jQuery.AddFunctionalLocationNamespace.LocationID = locationID;
    jQuery.AddFunctionalLocationNamespace.FLocationImagePath = fLocationImgPath;
    jQuery.AddFunctionalLocationNamespace.LoadControlID = loadControlID;

    addFunctionalLocationViewModel.HasDeleteAccess = hasDeleteAccess === "True" ? true : false;
    addFunctionalLocationViewModel.HasEditAccess = hasEditAccess === "True" ? true : false;
    ko.applyBindings(addFunctionalLocationViewModel, document.getElementById("divAddFunctionalLocation"));
    
    if (jQuery.AddFunctionalLocationNamespace.LocationID == 0) {
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

    GetUserWorkGroupInfo();
    BindParentLocationList();    
    LoadLocationInfo(jQuery.AddFunctionalLocationNamespace.PagerData); 
    if (jQuery.AddFunctionalLocationNamespace.LocationID > 0)
    {
        GetEditFunctionalLocInfo(jQuery.AddFunctionalLocationNamespace.LocationID);
    }
}

var value;
function LoadLocationInfo(pagerData) {
    
    jQuery(".flocations").removeClass('bg-info');
    jQuery("#div_" + jQuery.AddFunctionalLocationNamespace.LocationID).addClass('bg-info');

    var filterFLocationInfo = {};
    filterFLocationInfo.SiteID = jQuery.AddFunctionalLocationNamespace.BasicParam.SiteID;
    filterFLocationInfo.UserID = jQuery.AddFunctionalLocationNamespace.BasicParam.UserID;
    filterFLocationInfo.PageSize = pagerData.PageSize;
    filterFLocationInfo.PageIndex = pagerData.PageIndex;  

    var searchEquipmentName = jQuery.trim(jQuery("#txtSeachFLocation").val());
    if (searchEquipmentName.length > 0)
        filterFLocationInfo.FLocationNameSearch = searchEquipmentName;

    if (jQuery("#hdnSortbyNameValue").val() != "") {
        filterFLocationInfo.SortType = jQuery("#hdnSortbyNameValue").val();
    }

    //Dynamic pagerdata
    //var totPageHeight = jQuery(window.parent.document).height();
    var totPageHeight = 800;
    var functionalLocationPos = jQuery("#divFLocationsList").offset().top;
    fLocationMaxHeight = totPageHeight - functionalLocationPos;
    if (jQuery(window).width() < 768)
        fLocationMaxHeight = 500;

    if (true) {
        value = value || Math.floor(fLocationMaxHeight / 75);
        filterFLocationInfo.PageSize = value;
        pagerData.PageSize = value;
    }

    jQuery.ajax({
        type: "POST",
        url: jQuery.AddFunctionalLocationNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/GetAllFunctionalLocList",
        data: JSON.stringify({ pagerData: pagerData, filterFLocationInfo: filterFLocationInfo }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        async: false,
        success: function (json) {
            if (json != undefined && json.d != undefined) {
                var functionalLocationListDetails = json.d.FLocationListInfo;
                if (functionalLocationListDetails != null || functionalLocationListDetails != undefined) {

                    //load right side location filters
                    jQuery.each(functionalLocationListDetails, function (i, fLocation) {
                        var locationInfo = {};
                        locationInfo.TypeValue = fLocation.FunctionalLocationID;
                        locationInfo.DisplayName = fLocation.FunctionalLocationName;
                        if (fLocation.FunctionalLocationID == jQuery.AddFunctionalLocationNamespace.LocationID)
                            locationInfo.SelectedClass = "bg-info";
                        else
                            locationInfo.SelectedClass = "";
                        addFunctionalLocationViewModel.FLocationsInfoArray.push(locationInfo);
                    });
                    addFunctionalLocationViewModel.PagerContent(json.d.HTMLPager);
                }               
            }
            else {
                ShowErrorMessage(languageResource.resMsg_FailedToLoadFunctionalLocationInfo, true);
            }
        },
        beforeSend: function () {
            jQuery("#divLoadProgressVisible").show();
            addFunctionalLocationViewModel.FLocationsInfoArray.removeAll();
            addFunctionalLocationViewModel.LoadErrorMessage('');
            addFunctionalLocationViewModel.LoadErrorMessageClass('');
            addFunctionalLocationViewModel.LoadErrorMessageVisible(false);
            addFunctionalLocationViewModel.PagerContent('');      
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

function GetUserWorkGroupInfo() {
    jQuery.ajax({
        type: "POST",
        url: jQuery.AddFunctionalLocationNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/GetUserWorkGroups",
        data: JSON.stringify({ basicParam: jQuery.AddFunctionalLocationNamespace.BasicParam }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        async: false,
        success: function (json) {
            if (json != undefined && json.d != undefined) {
                ko.utils.arrayForEach(json.d, function (item, index) {
                    addFunctionalLocationViewModel.WorkGroupList.push(item);
                });
            }

            jQuery("#drpWorkGroup").multipleSelect({
                selectAll: false,
                onClick: function (clickedItem) {
                    if (clickedItem.checked) {
                        var item = {};
                        item.TypeValue = clickedItem.value;
                        item.DisplayName = clickedItem.label;
                        item.IsUserWorkGroup = true;
                        addFunctionalLocationViewModel.SelectedWorkGroupInfoList.push(item);
                    }
                    else {
                        addFunctionalLocationViewModel.SelectedWorkGroupInfoList.remove(function (item) {
                            return item.TypeValue == clickedItem.value;
                        });
                    }
                },
                placeholder: languageResource.resMsg_SelectWorkGroup                
            });
            jQuery("#drpWorkGroup").multipleSelect("setSelects", []);
        },
        error: function (request, error) {
            var msg;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    msg = languageResource.resMsg_Error + errorMsg.Message;
                else
                    msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadUserWorkGroup;
            }
            else {
                msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadUserWorkGroup;
            }
            ShowErrorMessage(msg, true);
        }
    });
}

function BindParentLocationList() {
    var fLocationFilterInfo = {};
    fLocationFilterInfo.SiteID = jQuery.AddFunctionalLocationNamespace.BasicParam.SiteID;
    fLocationFilterInfo.UserID = jQuery.AddFunctionalLocationNamespace.BasicParam.UserID;
    fLocationFilterInfo.FLocationID = jQuery.AddFunctionalLocationNamespace.LocationID;
    jQuery.ajax({
        type: "POST",
        url: jQuery.AddFunctionalLocationNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/GetParentLocationDropDown",
        data: JSON.stringify({ fLocationFilterInfo: fLocationFilterInfo }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        async: false,
        success: function (json) {
            if (json != undefined && json.d != null) {
                var locationInfo = {};
                locationInfo.TypeValue = 0;
                locationInfo.DisplayName = languageResource.resMsg_SelectFunctionalLocation;
                addFunctionalLocationViewModel.ParentLocationsList.push(locationInfo);
                jQuery.each(json.d, function (i, fLocation) {
                    var newLocationInfo = {};
                    newLocationInfo.TypeValue = fLocation.TypeValue;
                    newLocationInfo.DisplayName = fLocation.DisplayName;
                    newLocationInfo.AssignedWorkGroupList = fLocation.WorkGroupInfoList;
                    addFunctionalLocationViewModel.ParentLocationsList.push(newLocationInfo);
                });
                jQuery("#drpFLocationParent").select2();
            }
            else {
                var errorMsg = languageResource.resMsg_Error + languageResource.resMsg_FailedToBindFunctionalLocationList;
                ShowErrorMessage(errorMsg, true);
            }
        },
        beforeSend: function () {
            addFunctionalLocationViewModel.ParentLocationsList.removeAll();
        },
        error: function (request, error) {
            var msg;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    msg = languageResource.resMsg_Error + errorMsg.Message;
                else
                    msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToBindFunctionalLocationList;
            }
            else {
                msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToBindFunctionalLocationList;
            }
            ShowErrorMessage(msg, true);
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

function AddUpdateFunctionalLoaction(isUpdate, workGroupDeletionConfirmed,newWorkGroupConfirmation) {

    var isValid = true;
    var errorMessage = "";

    jQuery("#lblSaveUpdateError").removeClass("text-info");
    jQuery("#lblSaveUpdateError").addClass("text-danger");
   
    if (jQuery.trim(addFunctionalLocationViewModel.FunctionalLocationCode()).length == 0) {
        errorMessage = errorMessage + languageResource.resMsg_EnterFunctionalLocationCode + "<br/>";
        isValid = false;
    }
    if (jQuery.trim(addFunctionalLocationViewModel.FLocationName()).length == 0) {
        errorMessage = errorMessage + languageResource.resMsg_EnterLocationName + "<br/>";
        isValid = false;
    }
    if (!isValid) {
        jQuery("#lblSaveUpdateError").html(errorMessage);
        return false;
    }

    if (isValid) {
        var functionalLocInfo = {};
        if (isUpdate)
            functionalLocInfo.FunctionalLocationID = jQuery.AddFunctionalLocationNamespace.LocationID;
        else
            functionalLocInfo.FunctionalLocationID = 0;
        functionalLocInfo.FunctionalLocationName = jQuery.trim(addFunctionalLocationViewModel.FLocationName());
        functionalLocInfo.FunctionalLocationDesc = jQuery.trim(addFunctionalLocationViewModel.FLocationDesc());
        functionalLocInfo.FunctionalLocationCode = jQuery.trim(addFunctionalLocationViewModel.FunctionalLocationCode());
        functionalLocInfo.ParentLocationID = jQuery("#drpFLocationParent").val() == null ? 0 : jQuery("#drpFLocationParent").val();

        if (jQuery.AddFunctionalLocationNamespace.LocationImageName != null || jQuery.AddFunctionalLocationNamespace.LocationImageName != undefined || jQuery.AddFunctionalLocationNamespace.LocationImageName != "") {
            functionalLocInfo.FunctionalLocationImageName = jQuery.AddFunctionalLocationNamespace.LocationImageName;
        }
        else {
            functionalLocInfo.FunctionalLocationImageName = "";
        }

        functionalLocInfo.AssignedWorkGroupList = [];        
        if (addFunctionalLocationViewModel.SelectedWorkGroupInfoList().length > 0) {
            ko.utils.arrayForEach(addFunctionalLocationViewModel.SelectedWorkGroupInfoList(), function (item, index) {
                var keyValueInfo = {};
                keyValueInfo.TypeValue = item.TypeValue;
                keyValueInfo.DisplayName = '';
                functionalLocInfo.AssignedWorkGroupList.push(keyValueInfo);
            });
        }
        else {
            var selectedParentLocation = jQuery("#drpFLocationParent").val();
            if (selectedParentLocation != "0") {
                var functionLocationInfo = ko.utils.arrayFirst(addFunctionalLocationViewModel.ParentLocationsList(), function (locationInfo, locationIndex) {
                    return locationInfo.TypeValue == selectedParentLocation;
                });
                if (functionLocationInfo != null && functionLocationInfo.AssignedWorkGroupList.length > 0) {
                    jQuery("#lblSaveUpdateError").text(languageResource.resMsg_PleaseSelectAuthGroup);   
                    return;
                }
            }
        }

        if (workGroupDeletionConfirmed)
            functionalLocInfo.WorkGroupDeletionConfirmed = true;
        else
            functionalLocInfo.WorkGroupDeletionConfirmed = false;     

        if (workGroupDeletionConfirmed == undefined && newWorkGroupConfirmation == undefined && jQuery.AddFunctionalLocationNamespace.LocationID > 0 && jQuery.AddFunctionalLocationNamespace.AssignedWorkGroupInfo.length > 0) {
            var newWorkGroupIDList = [];
            ko.utils.arrayForEach(addFunctionalLocationViewModel.SelectedWorkGroupInfoList(), function (item, index) {
                var alreadyAssignedWorkGroup = ko.utils.arrayFirst(jQuery.AddFunctionalLocationNamespace.AssignedWorkGroupInfo, function (AssignedItem, index) {
                    return AssignedItem.TypeValue == item.TypeValue;
                });

                if (alreadyAssignedWorkGroup == null)
                    newWorkGroupIDList.push(item.TypeValue);
            });

            if (newWorkGroupIDList.length > 0) {
                NewWorkGroupConfirmation();
                return;
            }
        }

        functionalLocInfo.AsignNewWorkGroupsToChild = false;
        if (newWorkGroupConfirmation != undefined)
            functionalLocInfo.AsignNewWorkGroupsToChild = newWorkGroupConfirmation;

        jQuery.ajax({
            type: "POST",
            url: jQuery.AddFunctionalLocationNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/InsertOrUpdateFunctionalLocInfo",
            data: JSON.stringify({ basicParam: jQuery.AddFunctionalLocationNamespace.BasicParam, functionalLocInfo: functionalLocInfo }),
            contentType: "application/json; charset=utf-8",
            datatype: 'json',
            async: false,
            success: function (json) {
                if (json != null || json.d != undefined || json.d != 0) {
                    var result = json.d.Code;
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
                    else if (result == -3) {
                        DeleteWorkGroupConfirmation(json.d.MessageList, functionalLocInfo.AsignNewWorkGroupsToChild);
                    }                    
                    else if (result > 0) {
                        ClearFieldInfo();
                        ClearFunctionalLocationCode();
                        LoadLocationInfo(jQuery.AddFunctionalLocationNamespace.PagerData);
                        //successfully inserted || successfully updated
						jQuery.AddFunctionalLocationNamespace.LocationImageName = '';
                        jQuery("#" + jQuery.AddFunctionalLocationNamespace.LoadControlID).prop("onclick", null);
                        jQuery("#" + jQuery.AddFunctionalLocationNamespace.LoadControlID).show().attr('onclick', 'AddUpdateFunctionalLoaction(false);return false;');
                        jQuery("#" + jQuery.AddFunctionalLocationNamespace.LoadControlID).html(languageResource.resMsg_SaveAndAddMore);

                        jQuery("#lblSaveUpdateError").removeClass("text-danger");
                        jQuery("#lblSaveUpdateError").addClass("text-info");
                        if (isUpdate)
                            jQuery("#lblSaveUpdateError").text(languageResource.resMsg_SuccessfullyUpdatedLocation);
                        else
                            jQuery("#lblSaveUpdateError").text(languageResource.resMsg_SuccessfullyInsertedLocation);
                        
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

function DeleteWorkGroupConfirmation(deletedWorkGroupList, newWorkGroupConfirmation) {
    var deletedWorkGroups = '';
    jQuery.each(deletedWorkGroupList, function (index, item) {
        if (deletedWorkGroups.length > 0)
            deletedWorkGroups = deletedWorkGroups + "," + item;
        else
            deletedWorkGroups = item;
    });
    var errorMessage = languageResource.resMsg_WorkGroupAssignedToLocationOrEquipmentConfirmation.replace("[XXX]", deletedWorkGroups);
    jQuery("#alertMessage").removeClass("text-danger");
    jQuery("#alertMessage").html(errorMessage);
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
                    AddUpdateFunctionalLoaction(true, true, newWorkGroupConfirmation);
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

function NewWorkGroupConfirmation() { 
    var errorMessage = languageResource.resMsg_NewWorkGtoupConfirmation;
    jQuery("#alertMessage").removeClass("text-danger");
    jQuery("#alertMessage").html(errorMessage);
    jQuery("#confirmModal").dialog({
        zIndex: 1060,
        closeOnEscape: false,
        open: function (event, ui) {
            jQuery(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
        },
        modal: true,
        buttons: [
            {
                text: languageResource.resMsg_Yes,
                click: function () {
                    jQuery("#confirmModal").dialog("close");                    
                    AddUpdateFunctionalLoaction(true, false, true);
                }
            },
            {
                text: languageResource.resMsg_No,
                click: function () {
                    jQuery("#confirmModal").dialog("close");
                    AddUpdateFunctionalLoaction(true, false, false);
                }
            }
        ]
    });
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
     jQuery("#div_" + jQuery.AddFunctionalLocationNamespace.LocationID).removeClass('bg-info');
     ClearFunctionalLocationCode();
     if (jQuery.AddFunctionalLocationNamespace.LocationID == 0)
     jQuery("#divFLocationsList > div").find('label').removeClass('bg-info');
     jQuery.AddFunctionalLocationNamespace.LocationID = 0;
    addFunctionalLocationViewModel.FLocationName('');
    addFunctionalLocationViewModel.FLocationDesc('');
    jQuery("#txtFLocationDesc").autoResize();
 	jQuery.AddFunctionalLocationNamespace.LocationImageName = "";
    jQuery("#imgFLocationImage").attr('src', jQuery.AddFunctionalLocationNamespace.ImageDefaultPath);
    BindParentLocationList();
    jQuery("#" + jQuery.AddFunctionalLocationNamespace.LoadControlID).html(languageResource.resMsg_SaveAndAddMore);
    if (addFunctionalLocationViewModel.HasEditAccess && !addFunctionalLocationViewModel.HasDeleteAccess)
        jQuery("#" + jQuery.AddFunctionalLocationNamespace.LoadControlID).addClass('disabled');

    addFunctionalLocationViewModel.SelectedWorkGroupInfoList.removeAll();
    jQuery("#drpWorkGroup").multipleSelect("setSelects", []);
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
                if (locationID == jQuery.AddFunctionalLocationNamespace.LocationID) {
                    addFunctionalLocationViewModel.FLocationName('');
                    addFunctionalLocationViewModel.FLocationDesc('');
                    jQuery.AddFunctionalLocationNamespace.LocationID = 0;
                }
                ClearFieldInfo();
                ClearFunctionalLocationCode();
                LoadLocationInfo(jQuery.AddFunctionalLocationNamespace.PagerData); 
                BindParentLocationList();
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

function GetEditFunctionalLocInfo(fLocationID) {
    if (fLocationID > 0) {
        jQuery.AddFunctionalLocationNamespace.LocationImageName = "";
        jQuery("#lblSaveUpdateError").html("");
        jQuery("#" + jQuery.AddFunctionalLocationNamespace.LoadControlID).html(languageResource.resMsg_Update);
        jQuery.AddFunctionalLocationNamespace.LocationID = fLocationID;
        jQuery("#" + jQuery.AddFunctionalLocationNamespace.LoadControlID).show().attr('onclick', 'AddUpdateFunctionalLoaction(true);return false;');
        jQuery(".flocations").removeClass('bg-info');
        jQuery("#div_" + fLocationID).addClass('bg-info');
        jQuery("#" + jQuery.AddFunctionalLocationNamespace.LoadControlID).removeClass('disabled');

        BindParentLocationList();

        jQuery.ajax({
            type: "POST",
            url: jQuery.AddFunctionalLocationNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/GetFLocationEditInfo",
            data: JSON.stringify({ basicParam: jQuery.AddFunctionalLocationNamespace.BasicParam, fLocationID: jQuery.AddFunctionalLocationNamespace.LocationID }),
            contentType: "application/json; charset=utf-8",
            datatype: 'json',
            success: function (json) {
                if (json != undefined && json.d != undefined) {
                    //load edit fields                
                    jQuery.AddFunctionalLocationNamespace.AssignedWorkGroupInfo = json.d.AssignedWorkGroupList;
                    var fLocationDetailsInfo = json.d;                  
                    addFunctionalLocationViewModel.FLocationName(fLocationDetailsInfo.FunctionalLocationName);
                    addFunctionalLocationViewModel.FLocationDesc(fLocationDetailsInfo.FunctionalLocationDesc);
                    if (fLocationDetailsInfo.FunctionalLocationCode != "") {
                        addFunctionalLocationViewModel.FunctionalLocationCode(fLocationDetailsInfo.FunctionalLocationCode);
                        addFunctionalLocationViewModel.BtnGenerateCode(false);
                    }
                    else {
                        ClearFunctionalLocationCode();
                    }

                    jQuery("#txtFLocationDesc").autoResize();
                    addFunctionalLocationViewModel.ParentFLocation(fLocationDetailsInfo.ParentLocationID);
                    jQuery("#drpFLocationParent").val(fLocationDetailsInfo.ParentLocationID);
                    jQuery("#drpFLocationParent").select2();
                    if (fLocationDetailsInfo.FunctionalLocationImagePath == undefined || fLocationDetailsInfo.FunctionalLocationImagePath == null || fLocationDetailsInfo.FunctionalLocationImagePath == "")
                        jQuery("#imgFLocationImage").attr('src', jQuery.AddFunctionalLocationNamespace.ImageDefaultPath);
                    else {
                        jQuery("#imgFLocationImage").attr('src', fLocationDetailsInfo.FunctionalLocationImagePath);
                    }                

                    var selectedWorkGroupList = [];
                    ko.utils.arrayForEach(fLocationDetailsInfo.AssignedWorkGroupList, function (item, index) {
                        var workGroupInfo = {};
                        workGroupInfo.TypeValue = item.TypeValue;
                        workGroupInfo.DisplayName = item.DisplayName;
                        var userWorkGroup = ko.utils.arrayFirst(addFunctionalLocationViewModel.WorkGroupList(), function (userItem, userItemIndex) {
                            return userItem.TypeValue == item.TypeValue;
                        });

                        if (userWorkGroup == null) {
                            workGroupInfo.IsUserWorkGroup = false;
                        }
                        else {
                            workGroupInfo.IsUserWorkGroup = true;
                            selectedWorkGroupList.push(item.TypeValue);
                        }
                        addFunctionalLocationViewModel.SelectedWorkGroupInfoList.push(workGroupInfo);
                        
                    });
                    jQuery("#drpWorkGroup").multipleSelect("setSelects", selectedWorkGroupList);

                    if (fLocationDetailsInfo.ParentLocationID > 0) {
                        var parentFunctionLocationInfo = ko.utils.arrayFirst(addFunctionalLocationViewModel.ParentLocationsList(), function (locationInfo, locationIndex) {
                            return locationInfo.TypeValue == fLocationDetailsInfo.ParentLocationID;
                        });

                        var nonParentWorkGroupIDList = [];
                        ko.utils.arrayForEach(addFunctionalLocationViewModel.WorkGroupList(), function (item, index) {
                            var locationWorkGroup = ko.utils.arrayFirst(parentFunctionLocationInfo.AssignedWorkGroupList, function (locationItem, locationItemIndex) {
                                return locationItem.TypeValue == item.TypeValue;
                            });

                            if (locationWorkGroup == null) {
                                nonParentWorkGroupIDList.push(item.TypeValue);
                            }
                        });
                        if (nonParentWorkGroupIDList.length > 0) {
                            jQuery("#divDrpWorkGroup input").each(function (index, element) {
                                var itemValue = parseInt(jQuery(element).attr("value"));
                                var itemIndex = nonParentWorkGroupIDList.indexOf(itemValue);
                                if (itemIndex >= 0)
                                    jQuery(element).closest("li").attr("disabled", "disabled");
                            });
                        }
                    }
                }
                else {
                    ShowErrorMessage(languageResource.resMsg_FailedToLoadFunctionalLocationInfo, true);
                }
            },
            beforeSend: function () {
                addFunctionalLocationViewModel.SelectedWorkGroupInfoList.removeAll();
                jQuery("#drpWorkGroup").multipleSelect("setSelects", []);
                jQuery("#divDrpWorkGroup").find("li").removeAttr("disabled");
                jQuery.AddFunctionalLocationNamespace.AssignedWorkGroupInfo = [];
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
}

function ViewFLocationList(filterObjectInfo) {
    var queryString = "?id=" + jQuery.AddFunctionalLocationNamespace.BasicParam.SiteID;
    window.location.href = jQuery.AddFunctionalLocationNamespace.BasePath + "/Preventive/FunctionalLocationList.aspx" + queryString;
}

function ViewAdditionalInfoLinks(additionalLinksType) {
    var queryString = "?id=" + jQuery.AddFunctionalLocationNamespace.BasicParam.SiteID;
    if (jQuery.AddFunctionalLocationNamespace.LocationID == 0) {
        if (jQuery("#divFLocationsList > div").find("label").hasClass('bg-info')) {
            jQuery.AddFunctionalLocationNamespace.LocationID = addFunctionalLocationViewModel.FLocationsInfoArray()[0].TypeValue;
        }
    }
    if (additionalLinksType == jQuery.AddFunctionalLocationNamespace.AdditionalLinksType.Equipment) {
        queryString = queryString + "&flid=" + jQuery.AddFunctionalLocationNamespace.LocationID;
        window.location.href = jQuery.AddFunctionalLocationNamespace.BasePath + "/Preventive/AddEquipmentInfo.aspx" + queryString;
    }
    else if (additionalLinksType == jQuery.AddFunctionalLocationNamespace.AdditionalLinksType.MeasuringPoint) {
        queryString = queryString + "&type=" + jQuery.AddFunctionalLocationNamespace.MeasuringPointDataTyeInfo.Functional_Location.toString() + "&flid=" + jQuery.AddFunctionalLocationNamespace.LocationID;
        window.location.href = jQuery.AddFunctionalLocationNamespace.BasePath + "/Preventive/AddMeasuringPoint.aspx" + queryString;
    }
} 

function SortByFLocationName(thValue, value) {
    var thClass = "";
    var hasSortUpClassExist = jQuery("#" + thValue + " i").hasClass('fa fa-long-arrow-up');
    var hasSortDownExist = jQuery("#" + thValue + " i").hasClass('fa fa-long-arrow-down');

    if (hasSortUpClassExist == false && hasSortDownExist == false) {
        jQuery(".fa-long-arrow-down").removeClass('fa fa-long-arrow-down');
        jQuery(".fa-long-arrow-up").removeClass('fa fa-long-arrow-up');

        jQuery("#" + thValue + " i").addClass('fa fa-long-arrow-up');
        thClass = value + "_asc";
        jQuery("#hdnSortbyNameValue").val(thClass);
        LoadLocationInfo(jQuery.AddFunctionalLocationNamespace.PagerData);

        return false;
    }
    if (jQuery("#" + thValue + " i").hasClass('fa fa-long-arrow-up')) {
        jQuery(".fa-long-arrow-down").removeClass('fa fa-long-arrow-down');
        jQuery(".fa-long-arrow-up").removeClass('fa fa-long-arrow-up');

        jQuery("#" + thValue + " i").addClass('fa fa-long-arrow-down');
        thClass = value + "_desc";
        jQuery("#hdnSortbyNameValue").val(thClass);
        LoadLocationInfo(jQuery.AddFunctionalLocationNamespace.PagerData);

        return false;
    }
    if (jQuery("#" + thValue + " i").hasClass('fa-long-arrow-down')) {
        jQuery(".fa-long-arrow-down").removeClass('fa fa-long-arrow-down');
        jQuery(".fa-long-arrow-up").removeClass('fa fa-long-arrow-up');

        jQuery("#" + thValue + " i").addClass('fa fa-long-arrow-up');
        thClass = value + "_asc";
        jQuery("#hdnSortbyNameValue").val(thClass);
        LoadLocationInfo(jQuery.AddFunctionalLocationNamespace.PagerData);

        return false;
    }
}

function RemoveWorkGroupFromSelection(ctlID) {
    var workOrderID = jQuery(ctlID).find("span").attr("groupid");
    jQuery(ctlID).remove();

    var selectedWorkGroupList = jQuery("#drpWorkGroup").multipleSelect("getSelects", "val");
    var itemIndex = selectedWorkGroupList.indexOf(workOrderID);
    if (itemIndex >= 0) {
        selectedWorkGroupList.splice(itemIndex, 1);
        jQuery("#drpWorkGroup").multipleSelect("setSelects", selectedWorkGroupList);
    }

    addFunctionalLocationViewModel.SelectedWorkGroupInfoList.remove(function (item) {
        return item.TypeValue == workOrderID;
    });
}

function ParentLocationChange() {
    var selectedParentLocation = jQuery("#drpFLocationParent").val();
    if (selectedParentLocation != null && selectedParentLocation != undefined) {
        jQuery("#divDrpWorkGroup").find("li").removeAttr("disabled");
        addFunctionalLocationViewModel.SelectedWorkGroupInfoList.removeAll();
        jQuery("#drpWorkGroup").multipleSelect("setSelects", []);

        if (selectedParentLocation > 0) {
            var functionLocationInfo = ko.utils.arrayFirst(addFunctionalLocationViewModel.ParentLocationsList(), function (locationInfo, locationIndex) {
                return locationInfo.TypeValue == selectedParentLocation;
            });

            if (functionLocationInfo != null) {
                var selectedWorkGroupIDList = [];
                ko.utils.arrayForEach(functionLocationInfo.AssignedWorkGroupList, function (item, index) {
                    var workGroupInfo = {};
                    workGroupInfo.TypeValue = item.TypeValue;
                    workGroupInfo.DisplayName = item.DisplayName;
                    var userWorkGroup = ko.utils.arrayFirst(addFunctionalLocationViewModel.WorkGroupList(), function (userItem, userItemIndex) {
                        return userItem.TypeValue == item.TypeValue;
                    });

                    if (userWorkGroup != null) {
                        workGroupInfo.IsUserWorkGroup = true;
                        selectedWorkGroupIDList.push(item.TypeValue);
                    }
                    else {
                        workGroupInfo.IsUserWorkGroup = false;
                    }
                    addFunctionalLocationViewModel.SelectedWorkGroupInfoList.push(workGroupInfo);
                });
                jQuery("#drpWorkGroup").multipleSelect("setSelects", selectedWorkGroupIDList);
            }


            var nonParentWorkGroupIDList = [];
            ko.utils.arrayForEach(addFunctionalLocationViewModel.WorkGroupList(), function (item, index) {
                var locationWorkGroup = ko.utils.arrayFirst(functionLocationInfo.AssignedWorkGroupList, function (locationItem, locationItemIndex) {
                    return locationItem.TypeValue == item.TypeValue;
                });

                if (locationWorkGroup == null) {
                    nonParentWorkGroupIDList.push(item.TypeValue);
                }
            });
            if (nonParentWorkGroupIDList.length > 0) {
                jQuery("#divDrpWorkGroup input").each(function (index, element) {
                    var itemValue = parseInt(jQuery(element).attr("value"));
                    var itemIndex = nonParentWorkGroupIDList.indexOf(itemValue);
                    if (itemIndex >= 0)
                        jQuery(element).closest("li").attr("disabled", "disabled");
                });
            }
        }
        else {

            var selectedWorkGroupIDList = [];
            ko.utils.arrayForEach(jQuery.AddFunctionalLocationNamespace.AssignedWorkGroupInfo, function (item, index) {
                var userWorkGroup = ko.utils.arrayFirst(addFunctionalLocationViewModel.WorkGroupList(), function (userItem, userItemIndex) {
                    return userItem.TypeValue == item.TypeValue;
                });

                if (userWorkGroup != null) {
                    var workGroupInfo = {};
                    workGroupInfo.TypeValue = item.TypeValue;
                    workGroupInfo.DisplayName = item.DisplayName;
                    workGroupInfo.IsUserWorkGroup = true;
                    addFunctionalLocationViewModel.SelectedWorkGroupInfoList.push(workGroupInfo);
                    selectedWorkGroupIDList.push(item.TypeValue);
                }
            });

            jQuery("#drpWorkGroup").multipleSelect("setSelects", selectedWorkGroupIDList);
        }
    }
}

function GenerateFunctionalLocationCode() {
    jQuery.ajax({
        type: "POST",
        url: jQuery.AddFunctionalLocationNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/GenerateRandomCode",
        data: JSON.stringify({ basicParam: jQuery.AddFunctionalLocationNamespace.BasicParam, infoType: jQuery.AddFunctionalLocationNamespace.InfoType.Location.charCodeAt() }),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (json) {
            if (json.d != undefined) {
                addFunctionalLocationViewModel.FunctionalLocationCode(json.d);
                addFunctionalLocationViewModel.BtnGenerateCode(false);
            }
            else {
                ShowErrorMessage(languageResource.resMsg_FailedToLoadFunctionalLocationCode);
            }
        },
        error: function (request, error) {
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                    ShowErrorMessage(languageResource.resMsg_Error + errorMsg.Message);
                else
                    ShowErrorMessage(languageResource.resMsg_FailedToLoadFunctionalLocationCode);
            }
            else {
                ShowErrorMessage(languageResource.resMsg_FailedToLoadFunctionalLocationCode);
            }
        }
    });
}

function ClearFunctionalLocationCode() {
    addFunctionalLocationViewModel.BtnGenerateCode(true);
    addFunctionalLocationViewModel.FunctionalLocationCode('');
}  

function DownloadBarcode() {
    var funtionalLocationName = jQuery("#txtFLocationName").val();
    var barcodeText = jQuery("#txtFLocationCode").val().toUpperCase();
    jQuery("#divBarcodeMaker").empty();
    JsBarcode("#divBarcodeMaker", barcodeText);

    var canvas = jQuery("#divBarcodeMaker")[0].src;
    var docDefinition = {
        content: [{
            image: canvas,
            width: 200,
            hieght: 200
        }]
    };
    if (funtionalLocationName == undefined || funtionalLocationName == "") {
        funtionalLocationName = "FunctionalLocation";
    }
    pdfMake.createPdf(docDefinition).download(funtionalLocationName + "_Barcode.pdf");

}


