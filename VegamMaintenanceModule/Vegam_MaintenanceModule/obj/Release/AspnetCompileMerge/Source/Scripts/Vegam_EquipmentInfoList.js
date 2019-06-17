﻿jQuery.EquipmentNamespace = jQuery.EquipmentNamespace || {};
jQuery.EquipmentNamespace.BasicParam = jQuery.EquipmentNamespace.BasicParam || {};
jQuery.EquipmentNamespace.PagerData = jQuery.EquipmentNamespace.PagerData || {};
jQuery.EquipmentNamespace.BasePath = null;
jQuery.EquipmentNamespace.IsSearch = false;
jQuery.EquipmentNamespace.ImgEquipmentProfile = "";
jQuery.EquipmentNamespace.MasterDataType = { "EquipmentType": 'T' };
jQuery.EquipmentNamespace.InfoType = { "Equipment": 'E', "Equipment_Model": 'M', "None": 'N' };
var equipmentInfoViewModel = {
    FunctionalLocationFilterArray: ko.observableArray([]),
    SelectedFunctionalLocationFilterArray: ko.observableArray([]),
    EquipmentFilterValue: ko.observable(''),
    EquipmentTypeArray: ko.observableArray([]),
    EquipmentInfoArray: ko.observableArray([]),
    SelectedCategoryFilterArray: ko.observableArray([]),
    HasEditAccess: false,
    HasDeleteAccess: false,
    LoadErrorMessageVisible: ko.observable(false),
    LoadErrorMessage: ko.observable(''),
    LoadErrorMessageClass: ko.observable(''),
    PagerContent: ko.observable()
};

function LoadEquipmentListBasicInfo(pagerData, basePath, imgEquipmentProfile, hasEditAccess, hasDeleteAccess, filterObject) {
    jQuery.EquipmentNamespace.PagerData = pagerData;
    jQuery.EquipmentNamespace.BasePath = basePath;
    jQuery.EquipmentNamespace.BasicParam.UserID = pagerData.UserID;
    jQuery.EquipmentNamespace.BasicParam.SiteID = pagerData.SiteID;

    if (hasDeleteAccess.toLowerCase() == "true") {
        equipmentInfoViewModel.HasEditAccess = true;
        equipmentInfoViewModel.HasDeleteAccess = true;
    }
    else if (hasEditAccess.toLowerCase() == "true")
        equipmentInfoViewModel.HasEditAccess = true;

    jQuery.EquipmentNamespace.ImgEquipmentProfile = imgEquipmentProfile;

    ko.applyBindings(equipmentInfoViewModel, document.getElementById("divEquipmentInfo"));

    BindDropdownFunctionalLocationsFilter(0);
    BindMaintenanceMasterInfo();
    BindEquipmentFilterInfo(filterObject);
    LoadEquipmentList(pagerData);
}

function LoadEquipmentList(pagerData) {
    var equipmentFilterInfo = {}
    equipmentFilterInfo.PageIndex = pagerData.PageIndex;
    equipmentFilterInfo.PageSize = pagerData.PageSize;
    equipmentFilterInfo.SiteID = jQuery.EquipmentNamespace.BasicParam.SiteID;
    equipmentFilterInfo.UserID = jQuery.EquipmentNamespace.BasicParam.UserID;
    equipmentFilterInfo.InfoType = jQuery.EquipmentNamespace.InfoType.Equipment.charCodeAt(0);

    if (jQuery("#hdfSortValue").val() != "") {
        equipmentFilterInfo.SortType = jQuery("#hdfSortValue").val();
    }

    if (jQuery.EquipmentNamespace.IsSearch) {

        equipmentFilterInfo.SerachNameOrCode = jQuery.trim(jQuery("#txtSearchEquipment").val());

        if (equipmentInfoViewModel.SelectedFunctionalLocationFilterArray().length > 0) {
            equipmentFilterInfo.SearchLocationIDs = "";
            ko.utils.arrayForEach(equipmentInfoViewModel.SelectedFunctionalLocationFilterArray(), function (locationID) {
                equipmentFilterInfo.SearchLocationIDs = equipmentFilterInfo.SearchLocationIDs + locationID + ",";
            });
            equipmentFilterInfo.SearchLocationIDs = equipmentFilterInfo.SearchLocationIDs.slice(0, -1);
        }
        if (equipmentInfoViewModel.SelectedCategoryFilterArray().length > 0) {
            equipmentFilterInfo.SearchCategoryIDs = "";
            ko.utils.arrayForEach(equipmentInfoViewModel.SelectedCategoryFilterArray(), function (categoryInfo) {
                equipmentFilterInfo.SearchCategoryIDs = equipmentFilterInfo.SearchCategoryIDs + categoryInfo.TypeValue + ",";
            });
            equipmentFilterInfo.SearchCategoryIDs = equipmentFilterInfo.SearchCategoryIDs.slice(0, -1);
        }
        
    }
    var totPageHeight = jQuery(window.parent.document).height();
    var fLocationStartPos = jQuery("#fieldEquipments").offset().top;
    fLocationMaxHeight = totPageHeight - fLocationStartPos;
    if (jQuery(window).width() < 768)
        fLocationMaxHeight = 500;
    if (Math.floor(fLocationMaxHeight / 160) > 2) {
        equipmentFilterInfo.PageSize = Math.floor(fLocationMaxHeight / 160) % 2 == 0 ? Math.floor(fLocationMaxHeight / 160) : Math.floor(fLocationMaxHeight / 160) + 1;
        pagerData.PageSize = Math.floor(fLocationMaxHeight / 160) % 2 == 0 ? Math.floor(fLocationMaxHeight / 160) : Math.floor(fLocationMaxHeight / 160) + 1;
    }


    jQuery.ajax({
        type: "POST",
        url: jQuery.EquipmentNamespace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetAllEquipmentInfo",
        data: JSON.stringify({ pagerData: pagerData, equipmentFilterInfo: equipmentFilterInfo }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (json) {
            if (json != undefined && json.d != undefined) {
                if (json.d.EquipmentList.length == 0) {
                    equipmentInfoViewModel.LoadErrorMessage(languageResource.resMsg_NoRecordsFound);
                    equipmentInfoViewModel.LoadErrorMessageClass('');
                    equipmentInfoViewModel.LoadErrorMessageVisible(true);
                }
                else {
                    equipmentInfoViewModel.EquipmentInfoArray.removeAll();
                    equipmentInfoViewModel.PagerContent(json.d.HTMLPager);
                    BindEquipmentInfo(json.d.EquipmentList);
                    jQuery("#divProgress").addClass('hide');
                }
            }
            else {
                equipmentInfoViewModel.LoadErrorMessage(languageResource.resMsg_FailedToLoadEquipmentInfo);
                equipmentInfoViewModel.LoadErrorMessageClass('red');
                equipmentInfoViewModel.LoadErrorMessageVisible(true);
            }
        },
        beforeSend: function () {
            equipmentInfoViewModel.EquipmentInfoArray.removeAll();
            jQuery("#divProgress").show();
            equipmentInfoViewModel.LoadErrorMessageVisible(false);
            equipmentInfoViewModel.PagerContent('');
        },
        complete: function () {
            jQuery("#divProgress").hide();
        },
        error: function (request, error) {
            equipmentInfoViewModel.LoadErrorMessageClass('red');
            equipmentInfoViewModel.LoadErrorMessageVisible(true);
            var errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadEquipmentInfo;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    errorMessage = languageResource.resMsg_Error + errorMsg.Message;
            }
            equipmentInfoViewModel.LoadErrorMessage(errorMessage);
        }
    });
}

function BindEquipmentInfo(equipmentInfoList) {
    equipmentInfoViewModel.EquipmentInfoArray.removeAll();

    ko.utils.arrayForEach(equipmentInfoList, function (equipmentInfo) {
        var equipmentData = {};
        equipmentData.EquipmentID = equipmentInfo.EquipmentID;
        equipmentData.EquipmentName = equipmentInfo.EquipmentName;
        equipmentData.FunctionalLocationName = equipmentInfo.FunctionalLocationName;
        equipmentData.EquipmentDesc = equipmentInfo.EquipmentDesc;
        equipmentData.CategoryName = equipmentInfo.CategoryName;
        equipmentData.ClassName = equipmentInfo.ClassName;
        equipmentData.UpdatedOn = equipmentInfo.UpdatedOn;
        if (equipmentInfo.EquipmentImagePath != null || equipmentInfo.EquipmentImagePath != undefined) {
            equipmentData.EquipmentImagePath = equipmentInfo.EquipmentImagePath;
            equipmentData.IsHoverable = true;
        }
        else {
            equipmentData.EquipmentImagePath = jQuery.EquipmentNamespace.ImgEquipmentProfile;
            equipmentData.IsHoverable = false;
        }

        if (equipmentData.EquipmentID > 0) {
            equipmentInfoViewModel.EquipmentInfoArray.push(equipmentData);
        }

    });
}

function BindDropdownFunctionalLocationsFilter(parentlocationID) {
    var fLocationFilterInfo = {};
    fLocationFilterInfo.SiteID = jQuery.EquipmentNamespace.BasicParam.SiteID;
    fLocationFilterInfo.UserID = jQuery.EquipmentNamespace.BasicParam.UserID;
    fLocationFilterInfo.FLocationID = parentlocationID;
    jQuery.ajax({
        type: "POST",
        url: jQuery.EquipmentNamespace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetFunctionalLocListForHierarchicalDropDown",
        data: JSON.stringify({ fLocationFilterInfo: fLocationFilterInfo }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        async: false,
        success: function (json) {
            if (json != undefined || json.d != null) {
                equipmentInfoViewModel.FunctionalLocationFilterArray(json.d);
            }
            else {
                var errorMsg = languageResource.resMsg_Error + languageResource.resMsg_FailedToBindFunctionalLocationList;
                ShowErrorMessage(errorMsg, true);
            }
        },
        beforeSend: function () {
            equipmentInfoViewModel.FunctionalLocationFilterArray.removeAll();
        },
        complete: function () {
            jQuery("#divLoadProgressVisible").hide();
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

function BindMaintenanceMasterInfo() {
    var masterDataFilterInfo = {};
    masterDataFilterInfo.MasterDataType = jQuery.EquipmentNamespace.MasterDataType.EquipmentType.charCodeAt(0);
    masterDataFilterInfo.SearchString = jQuery.trim(jQuery("#txtSeachEquipmentType").val());
    jQuery.ajax({
        type: "POST",
        url: jQuery.EquipmentNamespace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetMaintMasterData",
        data: JSON.stringify({ basicParam: jQuery.EquipmentNamespace.BasicParam, masterDataFilterInfo: masterDataFilterInfo }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (json) {
            if (json != undefined && json.d != null) {
                var masterDataList = json.d.MasterDataInfoList
                jQuery.each(masterDataList, function (i, itemInfo) {
                    var categoryInfo = {};
                    categoryInfo.TypeValue = itemInfo.MasterDataID;
                    categoryInfo.DisplayName = itemInfo.MasterDataName;
                    categoryInfo.IsSelected = ko.observable(false);
                    equipmentInfoViewModel.EquipmentTypeArray.push(categoryInfo);
                });
            }
            else {
                var errorMsg = languageResource.resMsg_Error + languageResource.resMsg_FailedToBindMaintenanceInfo;
                ShowErrorMessage(errorMsg, true);
            }
        },
        beforeSend: function () {
            equipmentInfoViewModel.EquipmentTypeArray.removeAll();
        },
        complete: function () {
        },
        error: function (request, error) {
            var msg;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    msg = languageResource.resMsg_Error + errorMsg.Message;
                else
                    msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToBindMaintenanceInfo;
            }
            else {
                msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToBindMaintenanceInfo;
            }
            ShowErrorMessage(msg, true);
        }
    });
}

function BindEquipmentFilterInfo(filterObject) {
    if (filterObject != undefined) {
        if (filterObject.FilterTextValue != undefined && filterObject.FilterTextValue.length > 0) {
            equipmentInfoViewModel.EquipmentFilterValue(filterObject.FilterTextValue);
        }
        if (filterObject.FilterLocationIds != undefined && filterObject.FilterLocationIds.length > 0) {
            jQuery.each(filterObject.FilterLocationIds, function (ind, locationID) {
                var locationInfo = jQuery.grep(equipmentInfoViewModel.FunctionalLocationFilterArray(), function (value, index) {
                    return value.TypeValue == locationID;
                });
                if (locationInfo.length > 0)
                    SelectLoctaionInfo(locationInfo[0]);
            });
        }
        if (filterObject.FilterCategoryIds != undefined && filterObject.FilterCategoryIds.length > 0) {
            jQuery.each(filterObject.FilterCategoryIds, function (ind, categoryID) {
                var categoryInfo = jQuery.grep(equipmentInfoViewModel.EquipmentTypeArray(), function (value, index) {
                    return value.TypeValue == categoryID;
                });
                if (categoryInfo.length > 0)
                    SelectCategoryInfo(categoryInfo[0]);
            });
        }

        if (equipmentInfoViewModel.SelectedFunctionalLocationFilterArray().length > 0 || equipmentInfoViewModel.SelectedCategoryFilterArray().length > 0 || equipmentInfoViewModel.EquipmentFilterValue().length > 0) {
            jQuery("#btnShowAll").html(languageResource.resMsg_ShowAll);
            jQuery("#btnShowAll").removeClass('hide');
            jQuery("#spnSearchError").empty();
            jQuery.EquipmentNamespace.IsSearch = true;
        }
    }
}

function SearchEquipments() {
    equipmentInfoViewModel.SelectedFunctionalLocationFilterArray.removeAll();
    jQuery('#ulFLoctionMultiSelect').find('.selectedCheckbox').each(function () {
        equipmentInfoViewModel.SelectedFunctionalLocationFilterArray.push(jQuery(this).val());
    });

    if (equipmentInfoViewModel.SelectedFunctionalLocationFilterArray().length == 0 && jQuery.trim(equipmentInfoViewModel.EquipmentFilterValue()).length == 0 && equipmentInfoViewModel.SelectedCategoryFilterArray().length == 0
        && jQuery("#txtSearchEquipment").val().length == 0) {
        jQuery("#spnSearchError").html(languageResource.resMsg_SearchCriteria);
        return false;
    }
    jQuery("#btnShowAll").html(languageResource.resMsg_ShowAll);
    jQuery("#btnShowAll").removeClass('hide');
    jQuery("#spnSearchError").empty();
    jQuery.EquipmentNamespace.IsSearch = true;
    LoadEquipmentList(jQuery.EquipmentNamespace.PagerData);
}

function ShowAllEquipments() {
    jQuery("#txtSearchEquipment").val('');
    equipmentInfoViewModel.EquipmentFilterValue('');
    equipmentInfoViewModel.SelectedFunctionalLocationFilterArray.removeAll();
    equipmentInfoViewModel.SelectedCategoryFilterArray.removeAll();
    AppendElements();
    jQuery("#ulTypeMultiSelect li").find('span').removeClass('selectedlist selectedParentlist').find('input').prop('checked', false);
    jQuery("#ulFLoctionMultiSelect li").find('span').removeClass('selectedlist selectedParentlist').find('input').prop('checked', false).removeClass('selectedCheckbox');
    ko.utils.arrayForEach(equipmentInfoViewModel.EquipmentTypeArray(), function (categoryInfo) {
        categoryInfo.IsSelected(false);
    });
    jQuery("#btnShowAll").addClass('hide');
    jQuery.EquipmentNamespace.IsSearch = false;
    LoadEquipmentList(jQuery.EquipmentNamespace.PagerData);
    //Ul reset
    ResetDropdownCss();
}

function SelectCategoryInfo(categoryInfo) {
    var isSelected = false;

    if (categoryInfo.IsSelected() == true) {
        categoryInfo.IsSelected(false);
    }
    else {
        categoryInfo.IsSelected(true);
        isSelected = true;
    }

    if (isSelected) {
        equipmentInfoViewModel.SelectedCategoryFilterArray.push(categoryInfo);
    }
    else {
        equipmentInfoViewModel.SelectedCategoryFilterArray.remove(categoryInfo);
    }
}

function AddUpdateNewEquipment(equipmentID) {
    var queryString = {};
    queryString.id = jQuery.EquipmentNamespace.BasicParam.SiteID;
    queryString.eid = equipmentID;

    //if (jQuery.EquipmentNamespace.IsSearch) {
    //    if (equipmentInfoViewModel.EquipmentFilterValue().length > 0) {
    //        queryString.FilterTextValue = jQuery.trim(equipmentInfoViewModel.EquipmentFilterValue());
    //    }
    //    if (equipmentInfoViewModel.SelectedFunctionalLocationFilterArray().length > 0) {
    //        ko.utils.arrayForEach(equipmentInfoViewModel.SelectedFunctionalLocationFilterArray(), function (locationType) {
    //            functionalLocIDs = functionalLocIDs + locationType.TypeValue + ",";
    //        });
    //        queryString.fids = functionalLocIDs.slice(0, -1);
    //    }
    //    if (equipmentInfoViewModel.SelectedCategoryFilterArray().length > 0) {
    //        ko.utils.arrayForEach(equipmentInfoViewModel.SelectedCategoryFilterArray(), function (categoryType) {
    //            categoryIDs = categoryIDs + categoryType.TypeValue + ",";
    //        });
    //        queryString.cids = categoryIDs.slice(0, -1);
    //    }
    //}
    window.location.href = jQuery.EquipmentNamespace.BasePath + "/Preventive/AddEquipmentInfo.aspx?" + jQuery.param(queryString);
}

function DeleteEquipmentClick(equipmentID,event) {
    event.stopPropagation();
    jQuery("#alertMessage").removeClass("text-danger");
    jQuery("#alertMessage").html(languageResource.resMsg_DeleteEquipmentInfoConfirm);
    jQuery("#confirmModal").dialog({
        zIndex: 1060,
        closeOnEscape: false,
        open: function (event, ui) {
            jQuery(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
        },
        modal: true,
        buttons: [
            {
                text: languageResource.resMsg_BtnConfirm,
                click: function () {
                    jQuery("#confirmModal").dialog("close");
                    DeleteEquipmentInfo(equipmentID);
                }
            },
            {
                text: languageResource.resMsg_BtnCancel,
                click: function () {
                    jQuery("#confirmModal").dialog("close");
                    isTrue = false;
                }
            }
        ]
    });
}

function DeleteEquipmentInfo(equipmentID) {
    jQuery.ajax({
        type: "POST",
        url: jQuery.EquipmentNamespace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/DeleteEquipmentInfo",
        data: JSON.stringify({ basicParam: jQuery.EquipmentNamespace.BasicParam, equipmentID: equipmentID }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if (json.d == 2) {
                LoadEquipmentList(jQuery.EquipmentNamespace.PagerData);
            }
            else if (json.d == 3) {
                var msg = languageResource.resMsg_EquipmentIsAssigned;
                ShowErrorMessage(msg, true);
            }
            else if (json.d == 1) {
                var msg = languageResource.resMsg_EquipmentInfoDoesnotexistInActiveStatus;
                ShowErrorMessage(msg, true);
            }
            else {
                var msg = languageResource.resMsg_FailedToDeleteEquipmentInfo;
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
                    msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToDeleteEquipmentInfo;
            }
            else {
                msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToDeleteEquipmentInfo;
            }
            ShowErrorMessage(msg, true);
        },
    });
}

function BindIconAttributes(hasAccess) {
    var iconAttributes = {};
    if (!hasAccess) {
        iconAttributes.disabled = "disabled";
    }
    return iconAttributes;
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
                text: languageResource.resMsg_BtnOK,
                click: function () {
                    jQuery("#confirmModal").dialog("close");
                }
            }
        ]
    });
}

function LoadLargeImageView(imagePath, equipmentID) {
    var imgIndex = jQuery("#imgEquipment_" + equipmentID).offset();
    var thumbnailIndex = imagePath.indexOf('Thumbnail');
    var fullImagePath = imagePath.substring(0, thumbnailIndex) + imagePath.substring(thumbnailIndex + 10);
    jQuery("#divZoomEquipmentImage").attr('src', fullImagePath);
    jQuery("#divZoomEquipment").show();
    jQuery("#divZoomEquipmentImage").css({
        'height': '200',
        'width': '200',
        'border-radius': '6px'
    });
    jQuery("#divZoomEquipment").css({
        'position': 'absolute',
        'left': imgIndex.left + 210,
        'top': imgIndex.top + 100,
        'transform': 'translate(-50%,-50%)',
        'z-index': '999'
    });
}

function CloseLargeImageView() {
    jQuery("#divZoomEquipmentImage").attr('src', '');
    jQuery("#divZoomEquipment").hide();
};

function SortTabs(btnValue, value) {
    var thClass = "";
    var hasSortUpClassExist = jQuery("#" + btnValue + " i").hasClass('fa-long-arrow-up');
    var hasSortDownExist = jQuery("#" + btnValue + " i").hasClass('fa-long-arrow-down');

    if (hasSortUpClassExist == false && hasSortDownExist == false) {
        jQuery(".fa-long-arrow-down").removeClass('fa fa-long-arrow-down');
        jQuery(".fa-long-arrow-up").removeClass('fa fa-long-arrow-up');

        jQuery("#" + btnValue + " i").addClass('fa fa-long-arrow-up gray');
        thClass = value + "_asc";
        jQuery("#hdfSortValue").val(thClass);
        LoadEquipmentList(jQuery.EquipmentNamespace.PagerData);
        return false;
    }
    if (jQuery("#" + btnValue + " i").hasClass('fa-long-arrow-up')) {
        jQuery(".fa-long-arrow-down").removeClass('fa fa-long-arrow-down');
        jQuery(".fa-long-arrow-up").removeClass('fa fa-long-arrow-up');

        jQuery("#" + btnValue + " i").addClass('fa fa-long-arrow-down gray');
        thClass = value + "_desc";
        jQuery("#hdfSortValue").val(thClass);
        LoadEquipmentList(jQuery.EquipmentNamespace.PagerData);
        return false;
    }
    if (jQuery("#" + btnValue + " i").hasClass('fa-long-arrow-down')) {
        jQuery(".fa-long-arrow-down").removeClass('fa fa-long-arrow-down');
        jQuery(".fa-long-arrow-up").removeClass('fa fa-long-arrow-up');

        jQuery("#" + btnValue + " i").addClass('fa fa-long-arrow-up gray');
        thClass = value + "_asc";
        jQuery("#hdfSortValue").val(thClass);
        LoadEquipmentList(jQuery.EquipmentNamespace.PagerData);
        return false;
    }
}
//--------Upload & Download-------------
function ShowUploadDiv() {
    jQuery("#divUploadProgress").addClass('hide');
    jQuery("#spanUploadError").html("");
    jQuery("#divUploadExcel").slideToggle();
}

function EnableUploadControls() {
    var fileToUpload = jQuery.EquipmentNamespace.PagerData.LoadControlID;
    var btnUploadExcel = jQuery.EquipmentNamespace.PagerData.LoadControlID.replace("uploadFile", "btnUploadExcel");

    if (jQuery.EquipmentNamespace.PagerData.PageAccessRights == "FULL_ACCESS") {
        jQuery("#" + btnUploadExcel).removeAttr('disabled');
        jQuery("#" + fileToUpload).removeAttr('disabled');
    }
    jQuery("#btnDownloadExcel").removeAttr('disabled');
    jQuery("#btnDownloadTemplate").removeAttr('disabled');

}

function DisableUploadControls() {
    var fileToUpload = jQuery.EquipmentNamespace.PagerData.LoadControlID;
    var btnUploadExcel = jQuery.EquipmentNamespace.PagerData.LoadControlID.replace("uploadFile", "btnUploadExcel");
    jQuery("#btnDownloadExcel").attr('disabled', 'disabled');
    jQuery("#" + btnUploadExcel).attr('disabled', 'disabled');
    jQuery("#btnDownloadTemplate").attr('disabled', 'disabled');
    jQuery("#" + fileToUpload).attr('disabled', 'disabled');
}

function DownLoadExcelTemplate() {
    jQuery("#lblUploadError").removeClass("text-info");
    jQuery("#lblUploadError").addClass("text-danger");
    jQuery("#lblUploadError").text('');
    jQuery("#spnSearchError").text('');
    jQuery("#spnErrorMessageForExcel").text('');

    jQuery.ajax({
        type: "POST",
        url: jQuery.EquipmentNamespace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/DownloadEquipmentExcelTemplate",
        data: JSON.stringify({ basicParam: jQuery.EquipmentNamespace.BasicParam }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if (json.d != "") {
                if (json.d != null) {
                    TimerMethodForDownload(json.d);
                }
            }
        },
        beforeSend: function () {
            jQuery("#divProgressExcel").removeClass('hide');
            DisableUploadControls();
        },
        error: function (request, error) {
            jQuery("#divProgressExcel").addClass("hide");
            EnableUploadControls();
            if (request.ResponseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    jQuery("#spnErrorMessageForExcel").html(languageResource.resMsg_Error + errorMsg.Message);
                jQuery("#spnErrorMessageForExcel").html(languageResource.resMsg_FailedToPerformOperation);
            }
            else {
                jQuery("#spnErrorMessageForExcel").html(languageResource.resMsg_FailedToPerformOperation);
            }
        }
    });
}

function DownloadAllEquipmentInfo() {
    jQuery("#lblUploadError").removeClass("text-info");
    jQuery("#lblUploadError").addClass("text-danger");
    jQuery("#lblUploadError").text('');
    jQuery("#spnSearchError").text('');
    jQuery("#spnErrorMessageForExcel").text('');

    var equipmentFilterInfo = {}
    equipmentFilterInfo.PageIndex = pagerData.PageIndex;
    equipmentFilterInfo.PageSize = pagerData.PageSize;
    equipmentFilterInfo.SiteID = jQuery.EquipmentNamespace.BasicParam.SiteID;
    equipmentFilterInfo.UserID = jQuery.EquipmentNamespace.BasicParam.UserID;

    if (jQuery.EquipmentNamespace.IsSearch) {
        equipmentFilterInfo.SerachNameOrCode = jQuery.trim(jQuery("#txtSearchEquipment").val());

        if (equipmentInfoViewModel.SelectedFunctionalLocationFilterArray().length > 0) {
            equipmentFilterInfo.SearchLocationIDs = "";
            ko.utils.arrayForEach(equipmentInfoViewModel.SelectedFunctionalLocationFilterArray(), function (locationType) {
                equipmentFilterInfo.SearchLocationIDs = equipmentFilterInfo.SearchLocationIDs + locationType.TypeValue + ",";
            });
            equipmentFilterInfo.SearchLocationIDs = equipmentFilterInfo.SearchLocationIDs.slice(0, -1);
        }
        if (equipmentInfoViewModel.SelectedCategoryFilterArray().length > 0) {
            equipmentFilterInfo.SearchCategoryIDs = "";
            ko.utils.arrayForEach(equipmentInfoViewModel.SelectedCategoryFilterArray(), function (categoryInfo) {
                equipmentFilterInfo.SearchCategoryIDs = equipmentFilterInfo.SearchCategoryIDs + categoryInfo.TypeValue + ",";
            });
            equipmentFilterInfo.SearchCategoryIDs = equipmentFilterInfo.SearchCategoryIDs.slice(0, -1);
        }
    }

    jQuery.ajax({
        type: "POST",
        url: jQuery.EquipmentNamespace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/DownloadEquipmentInfo",
        data: JSON.stringify({ equipmentFilterInfo: equipmentFilterInfo }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if (json.d != null) {
                if (json.d != "") {
                    TimerMethodForDownload(json.d, true);
                }
            }
            else {
                jQuery("#divProgressExcel").addClass('disabled');
                EnableUploadControls();
            }
        },
        beforeSend: function () {
            jQuery("#divProgressExcel").removeClass('hide');
            DisableUploadControls();
        },
        error: function (request, error) {
            jQuery("#divProgressExcel").addClass("hide");
            EnableUploadControls();
            if (request.ResponseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    jQuery("#spnErrorMessageForExcel").html(languageResource.resMsg_Error + errorMsg.Message);
                jQuery("#spnErrorMessageForExcel").html(languageResource.resMsg_FailedToPerformOperation);
            }
            else {
                jQuery("#spnErrorMessageForExcel").html(languageResource.resMsg_FailedToPerformOperation);
            }
        }
    });
}

function TimerMethodForDownload(fileName) {
    var successTimer;
    var errorTimer;
    var successTxtFile = fileName + "_tempSuccess.txt";
    var errorTxtFile = fileName + "_tempError.txt";
    var excelFile = fileName + ".xls";

    successTimer = setInterval(function () {
        jQuery.ajax({
            type: "POST",
            url: jQuery.EquipmentNamespace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/CheckFileExist",
            data: JSON.stringify({ fileName: successTxtFile }),
            contentType: "Application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                if (json.d != null) {
                    if (json.d) {
                        clearInterval(successTimer);
                        clearInterval(errorTimer);
                        window.location = jQuery.EquipmentNamespace.BasePath + "/HandlerFiles/DownloadHandler.ashx?EquipmentInfoFile=" + excelFile;
                        jQuery("#divProgressExcel").addClass('hide');
                        EnableUploadControls();
                    }
                }
            },
            error: function (request, error) {
                if (request.responseText != "") {
                    clearInterval(successTimer);
                    clearInterval(errorTimer);
                    jQuery("#divProgressExcel").addClass('hide');
                    EnableUploadControls();
                    jQuery("#spnErrorMessageForExcel").html(languageResource.resMsg_FailedToPerformOperation);

                }
            }
        });
    }, 5000);

    errorTimer = setInterval(function () {
        jQuery.ajax({
            type: "POST",
            url: jQuery.EquipmentNamespace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/CheckFileExist",
            data: JSON.stringify({ fileName: errorTxtFile }),
            contentType: "Application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                if (json.d) {
                    jQuery.get(jQuery.EquipmentNamespace.BasePath + '/HandlerFiles/DownloadHandler.ashx?EquipmentLogFile=' + errorTxtFile, function (data) {
                        clearInterval(successTimer);
                        clearInterval(errorTimer);
                        jQuery("#spnErrorMessageForExcel").empty();
                        jQuery("#spnErrorMessageForExcel").html(data);
                        jQuery("#divProgressExcel").addClass('hide');
                        EnableUploadControls();
                    });
                }
            },
            error: function (request, error) {
                if (request.responseText != "") {
                    clearInterval(successTimer);
                    clearInterval(errorTimer);
                    jQuery("#divProgressExcel").addClass('hide');
                    EnableUploadControls();
                    jQuery("#spnErrorMessageForExcel").html(languageResource.resMsg_FailedToPerformOperation);
                }
            }
        });
    }, 5000);
}

function UploadEquipmentInfo() {

}

jQuery(document).click(function (e) {

    jQuery(window).keydown(function (event) {
        if (event.keyCode == 13) {
            jQuery("#btnSearch").click();
            return false;
        }
    });

    if ($(e.target).parents(".drpdownbody").length === 0) {
        if (jQuery(".drpdownbody").is(':visible')) {
            jQuery(".drpdownbody").removeClass("show");
            jQuery('.functiondropdown').find('i').addClass('fa-caret-down').removeClass('fa-caret-up').addClass("i-opacity");
        }
    }

    e.stopPropagation();
    var container = jQuery(".dropDown-menu");

    //check if the clicked area is dropDown or not
    if (container.has(e.target).length === 0 && !jQuery("#txtSeachFLocation").is(':focus')) {
        e.stopPropagation();
        targ = jQuery(this).siblings(".dropdown-menu");
        jQuery(targ).find("ul").animate({ scrollTop: 0 }, 100);
        if (jQuery(".flocation").not(targ).hasClass("show"))
            jQuery(".flocation").removeClass("show");

        jQuery(this).closest(".flocation").toggleClass("show");
        jQuery(this).siblings(".flocation").toggleClass("show");
        jQuery(this).toggleClass("drp-closed");
    }
    
})