jQuery.FunctionalLocationNamespace = jQuery.FunctionalLocationNamespace || {};
jQuery.FunctionalLocationNamespace.BasicParam = jQuery.FunctionalLocationNamespace.BasicParam || {};
jQuery.FunctionalLocationNamespace.PagerData = jQuery.FunctionalLocationNamespace.PagerData || {};
jQuery.FunctionalLocationNamespace.BasePath = "";
jQuery.FunctionalLocationNamespace.IsSearch = false;
jQuery.FunctionalLocationNamespace.ImgFunctionalLocProfile = "";

var functionalLocationViewModel = {
    HasEditAccess: false,
    HasDeleteAccess: false,
    FunctionalLocationFilterArray: ko.observableArray([]),
    SelectedFunctionalLocationFilterArray: ko.observableArray([]),
    FunctionalLocationInfoArray: ko.observableArray([]),
    LoadErrorMessageVisible: ko.observable(false),
    LoadErrorMessage: ko.observable(''),
    LoadErrorMessageClass: ko.observable(''),
    PagerContent: ko.observable('')
};

function InitFunctionalLocationInfo(pagerData, basePath, imgFunctionalLocProfile, hasEditAccess, hasDeleteAccess, flocationIDs) {
    jQuery.FunctionalLocationNamespace.PagerData = pagerData;
    jQuery.FunctionalLocationNamespace.BasePath = basePath;
    jQuery.FunctionalLocationNamespace.BasicParam.SiteID = pagerData.SiteID;
    jQuery.FunctionalLocationNamespace.BasicParam.UserID = pagerData.UserID;
    jQuery.FunctionalLocationNamespace.ImgFunctionalLocProfile = imgFunctionalLocProfile;

    functionalLocationViewModel.HasDeleteAccess = hasDeleteAccess.toString().toUpperCase() == "TRUE" ? true : false;
    functionalLocationViewModel.HasEditAccess = hasEditAccess.toString().toUpperCase() == "TRUE" ? true : false;

    ko.applyBindings(functionalLocationViewModel, document.getElementById("divFunctionLocationInfo"));
    ApplyFilterToggle();
    BindDropdownFunctionalLocationsFilter(0);
    if (flocationIDs != undefined && flocationIDs.length > 0) {
        jQuery.each(flocationIDs, function (ind, locationID) {
            var locationInfo = jQuery.grep(functionalLocationViewModel.FunctionalLocationFilterArray(), function (value, index) {
                return value.TypeValue == locationID;
            });
            if (locationInfo.length > 0)
                SelectLoctaionInfo(locationInfo[0]);
        });
        if (functionalLocationViewModel.SelectedFunctionalLocationFilterArray().length > 0) {
            jQuery("#btnShowAll").html(languageResource.resMsg_ShowAll);
            jQuery("#btnShowAll").removeClass('hide');
            jQuery("#spnSearchError").empty();
            jQuery.FunctionalLocationNamespace.IsSearch = true;
        }
    }
    LoadFunctionalLocationsInfo(pagerData);    
}

function BindDropdownFunctionalLocationsFilter(parentlocationID) {
    var fLocationFilterInfo = {};
    fLocationFilterInfo.SiteID = jQuery.FunctionalLocationNamespace.BasicParam.SiteID;
    fLocationFilterInfo.UserID = jQuery.FunctionalLocationNamespace.BasicParam.UserID;
    fLocationFilterInfo.FLocationID = parentlocationID;
    jQuery.ajax({
        type: "POST",
        url: jQuery.FunctionalLocationNamespace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetFunctionalLocListForHierarchicalDropDown",
        data: JSON.stringify({ fLocationFilterInfo: fLocationFilterInfo }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        async: false,
        success: function (json) {
            if (json != undefined || json.d != null) {
                functionalLocationViewModel.FunctionalLocationFilterArray(json.d);
            }
            else {
                var errorMsg = languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadFunctionalLocationInfo;
                functionalLocationViewModel.LoadErrorMessage(errorMsg);
            }
        },
        beforeSend: function () {
            functionalLocationViewModel.FunctionalLocationFilterArray.removeAll();
        },
        complete: function () {
            jQuery("#divLoadProgressVisible").hide();
        },
        error: function (request, error) {
            functionalLocationViewModel.LoadErrorMessageClass('red');
            functionalLocationViewModel.LoadErrorMessageVisible(true);
            var errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadFunctionalLocationInfo;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    errorMessage = languageResource.resMsg_Error + errorMsg.Message;
            }
            functionalLocationViewModel.LoadErrorMessage(errorMessage);
        }
    });
}

function LoadFunctionalLocationsInfo(pagerData) {
    var locationFilterInfo = {};
    if (jQuery.FunctionalLocationNamespace.IsSearch) {
        if (functionalLocationViewModel.SelectedFunctionalLocationFilterArray().length > 0) {
            locationFilterInfo.FunctionalLocIDs = "";
            ko.utils.arrayForEach(functionalLocationViewModel.SelectedFunctionalLocationFilterArray(), function (locationID) {
                locationFilterInfo.FunctionalLocIDs = locationFilterInfo.FunctionalLocIDs + locationID + ",";
            });
            locationFilterInfo.FunctionalLocIDs = locationFilterInfo.FunctionalLocIDs.slice(0, -1);
        }
    }
    locationFilterInfo.SiteID = pagerData.SiteID;
    locationFilterInfo.UserID = pagerData.UserID;
    locationFilterInfo.PageIndex = pagerData.PageIndex;
    locationFilterInfo.PageSize = pagerData.PageSize;
    if (jQuery("#hdfSortValue").val() != "") {
        locationFilterInfo.SortType = jQuery("#hdfSortValue").val();
    }

    var totPageHeight = jQuery(window.parent.document).height();
    var fLocationStartPos = jQuery("#fieldFunctionalLocations").offset().top;
    fLocationMaxHeight = totPageHeight - fLocationStartPos;
    if (jQuery(window).width() < 768)
        fLocationMaxHeight = 500;
    if (Math.floor(fLocationMaxHeight / 110) > 2) {
        locationFilterInfo.PageSize = Math.floor(fLocationMaxHeight / 110) % 2 == 0 ? Math.floor(fLocationMaxHeight / 110) : Math.floor(fLocationMaxHeight / 110) + 1;
        pagerData.PageSize = Math.floor(fLocationMaxHeight / 110) % 2 == 0 ? Math.floor(fLocationMaxHeight / 110) : Math.floor(fLocationMaxHeight / 110) + 1;
    }


    jQuery.ajax({
        type: "POST",
        url: jQuery.FunctionalLocationNamespace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetAllFunctionalLocInfo",
        data: JSON.stringify({ pagerData: pagerData, locationFilterInfo: locationFilterInfo }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        async: false,
        success: function (json) {
            if (json.d != null && json.d != undefined) {
                if (json.d.FunctionalLocationList.length == 0) {
                    functionalLocationViewModel.LoadErrorMessage(languageResource.resMsg_NoRecordsFound);
                    functionalLocationViewModel.LoadErrorMessageClass('');
                    functionalLocationViewModel.LoadErrorMessageVisible(true);
                }
                else {
                    functionalLocationViewModel.FunctionalLocationInfoArray.removeAll();
                    functionalLocationViewModel.PagerContent(json.d.HTMLPager);
                    BindFunctionalLocationInfo(json.d.FunctionalLocationList);
                }
            }
            else {
                functionalLocationViewModel.LoadErrorMessage(languageResource.resMsg_FailedToLoadFunctionalLocationInfo);
                functionalLocationViewModel.LoadErrorMessageClass('red');
                functionalLocationViewModel.LoadErrorMessageVisible(true);
            }
        },
        beforeSend: function () {
            functionalLocationViewModel.FunctionalLocationInfoArray.removeAll();
            jQuery("#divProgress").show();
            functionalLocationViewModel.LoadErrorMessageVisible(false);
            functionalLocationViewModel.PagerContent('');
        },
        complete: function () {
            jQuery("#divProgress").hide();
        },
        error: function (request, error) {
            functionalLocationViewModel.LoadErrorMessageClass('red');
            functionalLocationViewModel.LoadErrorMessageVisible(true);
            var errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadFunctionalLocationInfo;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    errorMessage = languageResource.resMsg_Error + errorMsg.Message;
            }

            functionalLocationViewModel.LoadErrorMessage(errorMessage);
        }
    });
}

function BindFunctionalLocationInfo(functionalLocationInfoList) {
    functionalLocationViewModel.FunctionalLocationInfoArray.removeAll();

    ko.utils.arrayForEach(functionalLocationInfoList, function (functionalLocInfo) {
        var functionalLocData = {};
        functionalLocData.FunctionalLocationID = functionalLocInfo.FunctionalLocationID;
        functionalLocData.FunctionalLocationName = functionalLocInfo.FunctionalLocationName;
        functionalLocData.FunctionalLocationDesc = functionalLocInfo.FunctionalLocationDesc;
        functionalLocData.FunctionalLocationUpdatedOn = functionalLocInfo.FunctionalLocationUpdatedOn;
        if (functionalLocInfo.FunctionalLocationImagePath != null || functionalLocInfo.FunctionalLocationImagePath != undefined) {
            functionalLocData.FunctionalLocationImagePath = functionalLocInfo.FunctionalLocationImagePath;
            functionalLocData.IsHoverable = true;
        }
        else {
            functionalLocData.FunctionalLocationImagePath = jQuery.FunctionalLocationNamespace.ImgFunctionalLocProfile;
            functionalLocData.IsHoverable = false;
        }

        if (functionalLocData.FunctionalLocationID > 0) {
            functionalLocationViewModel.FunctionalLocationInfoArray.push(functionalLocData);
        }
    });
}

function SearchFunctionalLocations() {

    functionalLocationViewModel.SelectedFunctionalLocationFilterArray.removeAll();
    jQuery('#ulFLoctionMultiSelect').find('.selectedCheckbox').each(function () {
        functionalLocationViewModel.SelectedFunctionalLocationFilterArray.push(jQuery(this).val());
    });

    if (functionalLocationViewModel.SelectedFunctionalLocationFilterArray().length == 0) {
        jQuery("#spnSearchError").html(languageResource.resMsg_SearchCriteria);
        return false;
    }
    jQuery("#btnShowAll").html(languageResource.resMsg_ShowAll);
    jQuery("#btnShowAll").removeClass('hide');
    jQuery("#spnSearchError").empty();
    jQuery.FunctionalLocationNamespace.IsSearch = true;
    LoadFunctionalLocationsInfo(jQuery.FunctionalLocationNamespace.PagerData);
}

function ShowAllFunctionalLocations() {
    functionalLocationViewModel.SelectedFunctionalLocationFilterArray.removeAll();
    AppendElements();
    jQuery("#ulFLoctionMultiSelect li").find('span').removeClass('selectedlist selectedParentlist').find('input').prop('checked', false).removeClass('selectedCheckbox');
    jQuery("#btnShowAll").addClass('hide');
    jQuery("#txtSeachFLocation").val("");
    jQuery.FunctionalLocationNamespace.IsSearch = false;
    LoadFunctionalLocationsInfo(jQuery.FunctionalLocationNamespace.PagerData);
    //Reset Ul
    ResetDropdownCss();
}

function AddUpdateNewFunctionalLoaction(locationID) {
    var functionalLocIDs = "";
    if (jQuery.FunctionalLocationNamespace.IsSearch && functionalLocationViewModel.SelectedFunctionalLocationFilterArray().length > 0) {
        ko.utils.arrayForEach(functionalLocationViewModel.SelectedFunctionalLocationFilterArray(), function (locationID) {
            functionalLocIDs = functionalLocIDs + locationID + ",";
        });
        functionalLocIDs = functionalLocIDs.slice(0, -1);
    }
    var queryString = "?id=" + jQuery.FunctionalLocationNamespace.BasicParam.SiteID + "&flid=" + locationID + "&fids=" + functionalLocIDs;
    window.location.href = jQuery.FunctionalLocationNamespace.BasePath + "/Preventive/AddFunctionalLocation.aspx" + queryString;
}

function DeleteLocationInfoClick(locationID, event) {
    event.stopPropagation();
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
        url: jQuery.FunctionalLocationNamespace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/DeleteFunctionalLocInfo",
        data: JSON.stringify({ basicParam: jQuery.FunctionalLocationNamespace.BasicParam, functionalLocationID: locationID }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if (json.d == 2) {
                ShowAllFunctionalLocations();
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

function BindIconAttributes(hasAccess) {
    var iconAttributes = {};
    if (!hasAccess) {
        iconAttributes.disabled = "disabled";
    }
    return iconAttributes;
}

function ApplyFilterToggle() {
    jQuery(".dropdown-toggle ").unbind("click");
    jQuery(".dropdown-menu ul,li").click(function (e) { e.stopPropagation() });
    jQuery(".dropdown-toggle ").bind("click", function (e) {
        e.stopPropagation();
        targ = jQuery(this).siblings(".dropdown-menu");
        jQuery(targ).find("ul").animate({ scrollTop: 0 }, 100);
        if (jQuery(".dropdown-menu").not(targ).hasClass("show"))
            jQuery(".dropdown-menu").removeClass("show");

        jQuery(this).closest(".dropdown-menu").toggleClass("show");
        jQuery(this).siblings(".dropdown-menu").toggleClass("show");
        jQuery(this).toggleClass("drp-closed");
    });
    jQuery(".drp-close").click(function () {
        jQuery(".dropdown-menu").removeClass("show");
    });
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

function LoadLargeImageView(imagePath, locationID) {
    var imgIndex = jQuery("#imgFLocation_" + locationID).offset();
    var thumbnailIndex = imagePath.indexOf('Thumbnail');
    var fullImagePath = imagePath.substring(0, thumbnailIndex) + imagePath.substring(thumbnailIndex+10);
    jQuery("#divZoomFLocationImage").attr('src', fullImagePath);
    jQuery("#divZoomFLocation").show();
    jQuery("#divZoomFLocationImage").css({
        'height': '200',
        'width': '200',
        'border-radius': '6px'
    });
    jQuery("#divZoomFLocation").css({
        'position': 'absolute',
        'left': imgIndex.left + 210,
        'top': imgIndex.top + 100,
        'transform': 'translate(-50%,-50%)',
        'z-index': '999'
    });
}

function CloseLargeImageView() {
    jQuery("#divZoomFLocationImage").attr('src', '');
    jQuery("#divZoomFLocation").hide();
};

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
        LoadFunctionalLocationsInfo(jQuery.FunctionalLocationNamespace.PagerData);
        return false;
    }
    if (jQuery("#" + btnValue + " i").hasClass('fa-long-arrow-up')) {
        jQuery(".fa-long-arrow-down").removeClass('fa fa-long-arrow-down');
        jQuery(".fa-long-arrow-up").removeClass('fa fa-long-arrow-up');

        jQuery("#" + btnValue + " i").addClass('fa fa-long-arrow-down gray');
        thClass = value + "_desc";
        jQuery("#hdfSortValue").val(thClass);
        LoadFunctionalLocationsInfo(jQuery.FunctionalLocationNamespace.PagerData);
        return false;
    }
    if (jQuery("#" + btnValue + " i").hasClass('fa-long-arrow-down')) {
        jQuery(".fa-long-arrow-down").removeClass('fa fa-long-arrow-down');
        jQuery(".fa-long-arrow-up").removeClass('fa fa-long-arrow-up');

        jQuery("#" + btnValue + " i").addClass('fa fa-long-arrow-up gray');
        thClass = value + "_asc";
        jQuery("#hdfSortValue").val(thClass);
        LoadFunctionalLocationsInfo(jQuery.FunctionalLocationNamespace.PagerData);
        return false;
    }
}
//--------Upload & Download-------------
function ShowUploadDiv() {
    jQuery("#divUploadProgress").addClass('hide');
    jQuery("#spanUploadError").html("");
    jQuery("#divUploadExcel").slideToggle();
}

function DownLoadExcelTemplate() {
    jQuery("#divUploadExcel").hide();
    window.location = "../DownloadHandler.ashx?type=FLocationTemplate";
}

function DownloadAllFunctionalLocationInfo() {
    var locationFilterInfo = {};
    locationFilterInfo.SiteID = jQuery.FunctionalLocationNamespace.BasicParam.SiteID;
    locationFilterInfo.UserID = jQuery.FunctionalLocationNamespace.BasicParam.UserID;

    if (jQuery.FunctionalLocationNamespace.IsSearch) {
        if (functionalLocationViewModel.SelectedFunctionalLocationFilterArray().length > 0) {
            locationFilterInfo.FunctionalLocIDs = "";
            ko.utils.arrayForEach(functionalLocationViewModel.SelectedFunctionalLocationFilterArray(), function (locationID) {
                locationFilterInfo.FunctionalLocIDs = locationFilterInfo.FunctionalLocIDs + locationID + ",";
            });
            locationFilterInfo.FunctionalLocIDs = locationFilterInfo.FunctionalLocIDs.slice(0, -1);
        }
    }

    jQuery.ajax({
        type: "POST",
        url: jQuery.FunctionalLocationNamespace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/DownloadFunctionalLocationInfo",
        data: JSON.stringify({ locationFilterInfo: locationFilterInfo }),
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
                EnableLinkTabs();
            }
        },
        beforeSend: function () {
            jQuery("#divProgressExcel").removeClass('hide');
            DisableUploadControls();
            DisableLinkTabs();
        },
        error: function (request, error) {
            jQuery("#divProgressExcel").addClass('hide');
            EnableUploadControls();
            EnableLinkTabs();
            if (request.responseText != "") {
                var msg = jQuery.parseJSON(request.responseText);
                if (msg != null && msg != "" && msg.Message != null && msg.Message != "") {
                    jQuery("#spnErrorMessageForExcel").html(languageResource.resMsg_Error + msg.Message);
                }
                else {
                    jQuery("#spnErrorMessageForExcel").html(languageResource.resMsg_FailedToDownloadAssetInfo);
                }
            }
            else {
                jQuery("#spnErrorMessageForExcel").html(languageResource.resMsg_FailedToDownloadAssetInfo);
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
            url: jQuery.FunctionalLocationNamespace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/CheckFileExist",
            data: JSON.stringify({ fileName: successTxtFile }),
            contentType: "Application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                if (json.d != null) {
                    if (json.d) {
                        clearInterval(successTimer);
                        clearInterval(errorTimer);
                        window.location = jQuery.FunctionalLocationNamespace.BasePath + "/HandlerFiles/DownloadHandler.ashx?FLocationExcelFile=" + excelFile;
                        jQuery("#divProgressExcel").addClass('hide');
                        jQuery("#btnDownloadLogs").removeAttr('disabled');
                        EnableUploadControls();
                        EnableLinkTabs();
                    }
                }
            },
            error: function (request, error) {
                if (request.responseText != "") {
                    clearInterval(successTimer);
                    clearInterval(errorTimer);
                    jQuery("#divProgressExcel").addClass('hide');
                    jQuery("#btnDownloadLogs").removeAttr('disabled');
                    EnableUploadControls();
                    EnableLinkTabs();
                    jQuery("#spnErrorMessageForExcel").html(languageResource.resMsg_FailedToDownloadFunctionalLocInfo);

                }
            }
        });
    }, 5000);
    errorTimer = setInterval(function () {
        jQuery.ajax({
            type: "POST",
            url: jQuery.FunctionalLocationNamespace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/CheckFileExist",
            data: JSON.stringify({ fileName: errorTxtFile }),
            contentType: "Application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                if (json.d) {
                    jQuery.get(jQuery.FunctionalLocationNamespace.BasePath + '/HandlerFiles/DownloadHandler.ashx?FLocationExcelFile=' + errorTxtFile, function (data) {
                        clearInterval(successTimer);
                        clearInterval(errorTimer);
                        jQuery("#spnErrorMessageForExcel").empty();
                        jQuery("#spnErrorMessageForExcel").html(data);
                        jQuery("#divProgressExcel").addClass('hide');
                        jQuery("#btnDownloadLogs").removeAttr('disabled');
                        EnableUploadControls();
                        EnableLinkTabs();
                    });
                }
            },
            error: function (request, error) {
                if (request.responseText != "") {
                    clearInterval(successTimer);
                    clearInterval(errorTimer);
                    jQuery("#divProgressExcel").addClass('hide');
                    jQuery("#btnDownloadLogs").removeAttr('disabled');
                    EnableUploadControls();
                    EnableLinkTabs();
                    jQuery("#spnErrorMessageForExcel").html(languageResource.resMsg_FailedToDownloadFunctionalLocInfo);
                }
            }
        });
    }, 5000);
}

function UploadFunctionalLocationInfo() {
    //Upload Functional Location info
}

function EnableUploadControls() {
    var btnUploadExcel = jQuery.FunctionalLocationNamespace.PagerData.LoadControlID.replace("btnUploadExcel", "btnUploadExcel");
    var fileToUpload = jQuery.FunctionalLocationNamespace.PagerData.LoadControlID.replace("btnUploadExcel", "fileToUpload");

    jQuery("#" + btnUploadExcel).removeClass("disabled");
    jQuery("#" + fileToUpload).removeClass("disabled");
    jQuery("#btnDownloadExcel").removeClass("disabled");
}

function DisableUploadControls() {
    var btnUploadExcel = jQuery.FunctionalLocationNamespace.PagerData.LoadControlID.replace("btnUploadExcel", "btnUploadExcel");
    var fileToUpload = jQuery.FunctionalLocationNamespace.PagerData.LoadControlID.replace("btnUploadExcel", "fileToUpload");

    jQuery("#" + btnUploadExcel).addClass("disabled");
    jQuery("#" + fileToUpload).addClass("disabled");
    jQuery("#btnDownloadExcel").addClass('disabled');
}

function EnableLinkTabs() {

}

function DisableLinkTabs() {

}