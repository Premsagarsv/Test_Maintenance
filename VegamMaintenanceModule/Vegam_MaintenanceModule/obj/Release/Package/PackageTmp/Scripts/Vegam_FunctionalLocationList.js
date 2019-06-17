jQuery.FunctionalLocationNamespace = jQuery.FunctionalLocationNamespace || {};
jQuery.FunctionalLocationNamespace.BasicParam = jQuery.FunctionalLocationNamespace.BasicParam || {};
jQuery.FunctionalLocationNamespace.PagerData = jQuery.FunctionalLocationNamespace.PagerData || {};
jQuery.FunctionalLocationNamespace.BasePath = "";
jQuery.FunctionalLocationNamespace.IsSearch = false;
jQuery.FunctionalLocationNamespace.ImgFunctionalLocProfile = "";
jQuery.FunctionalLocationNamespace.UploaderPath = "";

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

function InitFunctionalLocationInfo(pagerData, basePath, imgFunctionalLocProfile, uploaderPath, hasEditAccess, hasDeleteAccess, flocationIDs) {
    jQuery.FunctionalLocationNamespace.PagerData = pagerData;
    jQuery.FunctionalLocationNamespace.BasePath = basePath;
    jQuery.FunctionalLocationNamespace.BasicParam.SiteID = pagerData.SiteID;
    jQuery.FunctionalLocationNamespace.BasicParam.UserID = pagerData.UserID;
    jQuery.FunctionalLocationNamespace.ImgFunctionalLocProfile = imgFunctionalLocProfile;
    jQuery.FunctionalLocationNamespace.UploaderPath = uploaderPath;

    functionalLocationViewModel.HasDeleteAccess = hasDeleteAccess.toString().toUpperCase() == "TRUE" ? true : false;
    functionalLocationViewModel.HasEditAccess = hasEditAccess.toString().toUpperCase() == "TRUE" ? true : false;

    ko.applyBindings(functionalLocationViewModel, document.getElementById("divFunctionLocationInfo"));
    ApplyFilterToggle();
    BindDropdownFunctionalLocationsFilter();
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

function BindDropdownFunctionalLocationsFilter() {
    var fLocationFilterInfo = {};
    fLocationFilterInfo.SiteID = jQuery.FunctionalLocationNamespace.BasicParam.SiteID;
    fLocationFilterInfo.UserID = jQuery.FunctionalLocationNamespace.BasicParam.UserID;
    fLocationFilterInfo.FLocationID = 0;
    fLocationFilterInfo.ConsiderFLoc = true;
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
    if (Math.floor(fLocationMaxHeight / 113) > 2) {
        locationFilterInfo.PageSize = Math.floor(fLocationMaxHeight / 113) % 2 == 0 ? Math.floor(fLocationMaxHeight / 113) : Math.floor(fLocationMaxHeight / 113) + 1;
        pagerData.PageSize = Math.floor(fLocationMaxHeight / 113) % 2 == 0 ? Math.floor(fLocationMaxHeight / 113) : Math.floor(fLocationMaxHeight / 113) + 1;
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
            jQuery(".description").each(function (i) {
                var len = jQuery(this).text().trim().length;
                if (len > 100) {
                    jQuery(this).text(jQuery(this).text().substr(0, 100) + '...');
                }
            });
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
                BindDropdownFunctionalLocationsFilter();
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
        closeOnEscape: false,
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
function EnableUploadControls() {
    var btnUploadExcel = jQuery.FunctionalLocationNamespace.PagerData.LoadControlID;
    var fileToUpload = jQuery.FunctionalLocationNamespace.PagerData.LoadControlID.replace("btnUploadExcel", "uploadFile");

    if (jQuery.FunctionalLocationNamespace.PagerData.PageAccessRights == "FULL_ACCESS") {
        jQuery("#" + btnUploadExcel).removeClass("disabled");
        jQuery("#" + fileToUpload).removeClass("disabled");
    }
    jQuery("#btnDownloadExcel").removeClass("disabled");
    jQuery("#btnDownloadTemplate").removeClass("disabled");
}
function DisableUploadControls() {
    var btnUploadExcel = jQuery.FunctionalLocationNamespace.PagerData.LoadControlID;
    var fileToUpload = jQuery.FunctionalLocationNamespace.PagerData.LoadControlID.replace("btnUploadExcel", "uploadFile");

    jQuery("#" + btnUploadExcel).addClass("disabled");
    jQuery("#" + fileToUpload).addClass("disabled");
    jQuery("#btnDownloadExcel").addClass('disabled');
    jQuery("#btnDownloadTemplate").addClass('disabled');
}

//Download Functional location template Zip file ---------------
function DownLoadExcelTemplate() {
    jQuery("#divUploadExcel").hide();
    jQuery.ajax({
        type: "POST",
        url: jQuery.FunctionalLocationNamespace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/DownloadFunctionalLocationTemplate",
        data: JSON.stringify({ basicParam: jQuery.FunctionalLocationNamespace.BasicParam }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if (json.d != null) {
                if (json.d != "") {
                    TimerMethodForDownloadTemplate(json.d);
                }
                else {
                    jQuery("#spnErrorMessageForExcel").html(languageResource.resMsg_Error + languageResource.resMsg_FailedToDownloadTemplate);
                    EnableUploadControls();
                }
            }
        },
        beforeSend: function () {
            jQuery("#divProgressExcel").removeClass('hide');
            DisableUploadControls()
        },
        error: function (request, error) {
            EnableUploadControls();
            jQuery("#divProgressExcel").addClass('hide');
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
function TimerMethodForDownloadTemplate(fileName) {
    var successTimer;
    var errorTimer;
    var successTxtFile = fileName + "_tempSuccess.txt";
    var errorTxtFile = fileName + "_tempError.txt";

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
                        window.location = jQuery.FunctionalLocationNamespace.BasePath + "/HandlerFiles/DownloadHandler.ashx?FLocationFileName=" + fileName;
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
                    jQuery("#btnDownloadLogs").removeAttr('disabled');
                    EnableUploadControls();
                    jQuery("#spnErrorMessageForExcel").html(languageResource.resMsg_FailedToDownloadTemplate);

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
                    jQuery.get(jQuery.FunctionalLocationNamespace.BasePath + '/HandlerFiles/DownloadHandler.ashx?FLocationFileName=' + errorTxtFile, function (data) {
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
                    jQuery("#btnDownloadLogs").removeAttr('disabled');
                    EnableUploadControls();
                    jQuery("#spnErrorMessageForExcel").html(languageResource.resMsg_FailedToDownloadTemplate);
                }
            }
        });
    }, 5000);
}

//Download Functional location info excel file------------------
function DownloadAllFunctionalLocationInfo() {
    jQuery("#divUploadExcel").hide();
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
            }
        },
        beforeSend: function () {            
            jQuery("#divProgressExcel").removeClass('hide');
            DisableUploadControls();
        },
        error: function (request, error) {
            jQuery("#divProgressExcel").addClass('hide');
            EnableUploadControls();
            if (request.responseText != "") {
                var msg = jQuery.parseJSON(request.responseText);
                if (msg != null && msg != "" && msg.Message != null && msg.Message != "") {
                    jQuery("#spnErrorMessageForExcel").html(languageResource.resMsg_Error + msg.Message);
                }
                else {
                    jQuery("#spnErrorMessageForExcel").html(languageResource.resMsg_FailedToDownloadFunctionalLocInfo);
                }
            }
            else {
                jQuery("#spnErrorMessageForExcel").html(languageResource.resMsg_FailedToDownloadFunctionalLocInfo);
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
                    jQuery("#spnErrorMessageForExcel").html(languageResource.resMsg_FailedToDownloadFunctionalLocInfo);
                }
            }
        });
    }, 5000);
}

//Upload Functional Location info zip/excel---------------------
function UploadFunctionalLocationInfo() {
    
    var btnUploadExcel = jQuery.FunctionalLocationNamespace.PagerData.LoadControlID;
    var fileToUpload = jQuery.FunctionalLocationNamespace.PagerData.LoadControlID.replace("btnUploadExcel", "uploadFile");
   
    var control = "#" + fileToUpload;
    jQuery("#lblUploadError").removeClass("text-info");
    jQuery("#lblUploadError").addClass("text-danger");
    jQuery("#lblUploadError").empty();
    jQuery("#spnErrorMessageForExcel").empty();
    jQuery("#spnSearchError").empty();

    var isValid = true;
    var data = jQuery("#" + fileToUpload).val().split('\\').pop();
    var extension = data.substring(data.lastIndexOf('.') + 1).toLowerCase();

    if (extension != "zip" && extension != "xls" && extension != "xlsx") {
        isValid = false;
        jQuery("#lblUploadError").html(languageResource.resMsg_InvalidFileFormat);
    }
    if (jQuery.FunctionalLocationNamespace.PagerData.SiteID == 0 || jQuery.FunctionalLocationNamespace.PagerData.UserID == 0) {
        jQuery("#lblUploadError").html(languageResource.resMsg_InvalidSiteOrUser);
    }
    if (isValid) {
        jQuery("#divUploadProgress").removeClass('hide');
        jQuery.ajaxFileUpload({
            type: "POST",
            url: jQuery.FunctionalLocationNamespace.BasePath + "/HandlerFiles/FunctionalLocationUploadHandler.ashx?sid=" + jQuery.FunctionalLocationNamespace.BasicParam.SiteID + "&uid=" + jQuery.FunctionalLocationNamespace.BasicParam.UserID,
            fileElementId: fileToUpload,
            success: function (data, status) {
                var handlerMsg = data.documentElement.innerText;
                var message = handlerMsg.split(',');
                if (message[0] != "false") {
                    var fileName = message[1];
                    TimerMethodForUpload(fileName);
                }
                else {
                    jQuery("#divUploadProgress").addClass('hide');
                    jQuery("#lblUploadError").html(message[1]);
                    jQuery(control).val('');
                    EnableUploadControls();
                }
                if (navigator.userAgent.search("MSIE") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
                {
                    var control = jQuery("#" + fileToUpload);
                    control.replaceWith(control = control.clone(true));
                }
                else {
                    jQuery("#" + fileToUpload).val('');
                }
            },
            beforeSend: function () {               
                DisableUploadControls();
            },
            error: function (request, error) {
                jQuery("#divUploadProgress").addClass('hide');
                EnableUploadControls();
                control.replaceWith(control = control.val('').clone(true));
                jQuery("#" + fileToUpload).removeAttr('disabled');
                if (request.responseText != "") {
                    var message = request.responseText;
                    if (message != undefined && message != "" && message.Message != undefined && message.Message != "") {
                        jQuery("#lblUploadError").html(languageResource.resMsg_Error + message.Message);
                    }
                    else {
                        jQuery("#lblUploadError").html(languageResource.resMsg_FailedToUpload);
                    }
                }
                else {
                    jQuery("#lblUploadError").html(languageResource.resMsg_FailedToUpload);
                }
            }
        });
        if (navigator.userAgent.search("MSIE") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
        {
            var control = jQuery("#" + fileToUpload);
            control.replaceWith(control = control.clone(true));
        }
        else {
            jQuery("#" + fileToUpload).val('');
        }
    }
    else {
        if (navigator.userAgent.search("MSIE") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
        {
            var control = jQuery("#" + fileToUpload);
            control.replaceWith(control = control.clone(true));
        }
        else {
            jQuery("#" + fileToUpload).val('');
        }
    }
}
function TimerMethodForUpload(fileName) {
    var btnUploadExcel = jQuery.FunctionalLocationNamespace.PagerData.LoadControlID.replace("btnUploadExcel", "btnUploadExcel");
    var fileToUpload = jQuery.FunctionalLocationNamespace.PagerData.LoadControlID.replace("btnUploadExcel", "uploadFile");
    DisableUploadControls();

    var successTimer;
    var errorTimer;
    var successTxtFile = fileName + "_tempSuccess.txt";
    var errorFileName = fileName + "_tempError.txt";

    successTimer = setInterval(function () {
        jQuery.ajax({
            type: "POST",
            url: jQuery.FunctionalLocationNamespace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/CheckFileExist",
            data: JSON.stringify({ fileName: successTxtFile }),
            contentType: "Application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                if (json.d) {
                    clearInterval(successTimer);
                    clearInterval(errorTimer);
                    UploadAllImages(fileName);
                    EnableUploadControls();
                    jQuery("#divUploadProgress").addClass('hide');
                    jQuery("#divUploadExcel").hide();
                     window.location = jQuery.FunctionalLocationNamespace.BasePath + "/HandlerFiles/DownloadHandler.ashx?FunctionalLocationLogFile=" + successTxtFile;
                    jQuery.FunctionalLocationNamespace.PagerData.PageIndex = 0;
                    jQuery.FunctionalLocationNamespace.PagerData.CurrentPage = 0;
                    BindDropdownFunctionalLocationsFilter();
                    ShowAllFunctionalLocations();
                    window[jQuery.FunctionalLocationNamespace.PagerData.SelectMethod](jQuery.FunctionalLocationNamespace.PagerData);
                }
            },
            error: function (request, error) {
                clearInterval(successTimer);
                clearInterval(errorTimer);
                EnableUploadControls();
                jQuery("#divUploadProgress").addClass('hide');
                if (request.responseText != "") {
                    var message = request.responseText;
                    if (message != undefined && message != "" && message.Message != undefined && message.Message != "") {
                        jQuery("#lblUploadError").html(languageResource.resMsg_Error + message.Message);
                    }
                    else {
                        jQuery("#lblUploadError").html(languageResource.resMsg_FailedToUpload);
                    }
                }
                else {
                    jQuery("#lblUploadError").html(languageResource.resMsg_FailedToUpload);
                }
            }
        });
    }, 10000);

    errorTimer = setInterval(function () {
        jQuery.ajax({
            type: "POST",
            url: jQuery.FunctionalLocationNamespace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/CheckFileExist",
            data: JSON.stringify({ fileName: errorFileName }),
            contentType: "Application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                if (json.d) {
                    jQuery.get(jQuery.FunctionalLocationNamespace.BasePath + "/HandlerFiles/DownloadHandler.ashx?FunctionalLocationLogFile=" + errorFileName, function (data) {
                        clearInterval(successTimer);
                        clearInterval(errorTimer);
                        EnableUploadControls();
                        jQuery("#divUploadProgress").addClass('hide');
                        var indexOfError = data.indexOf('Error :');
                        jQuery("#lblUploadError").html(data.substring(indexOfError + 7, data.length));
                        if (data.indexOf('Inserted :0') != -1 && data.indexOf('Updated :0') != -1 && data.indexOf('Failure :0') != -1) {
                        }
                        else {
                            window.location = jQuery.FunctionalLocationNamespace.BasePath + "/HandlerFiles/DownloadHandler.ashx?FunctionalLocationLogFile=" + errorFileName;
                        }
                    });
                }
            },
            error: function (request, error) {
                clearInterval(successTimer);
                clearInterval(errorTimer);
                jQuery("#divUploadProgress").addClass('hide');
                EnableUploadControls();
                if (request.responseText != "") {
                    var message = request.responseText;
                    if (message != undefined && message != "" && message.Message != undefined && message.Message != "") {
                        jQuery("#lblUploadError").html(languageResource.resMsg_Error + message.Message);
                    }
                    else {
                        jQuery("#lblUploadError").html(languageResource.resMsg_FailedToUpload);
                    }
                }
                else {
                    jQuery("#lblUploadError").html(languageResource.resMsg_FailedToUpload);
                }
            }
        });
    }, 10000);
}

function UploadAllImages(fileName) {
    var imageFileName = "Image" + fileName;
    jQuery.ajax({
        type: "POST",
        url: jQuery.FunctionalLocationNamespace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/CheckDirectoryExist",
        data: JSON.stringify({ fileName: imageFileName }),
        contentType: "Application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (json) {
            if (json.d) {
                jQuery.ajax({
                    url: jQuery.FunctionalLocationNamespace.UploaderPath,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    responseType: "json",
                    data: { 'uid': jQuery.FunctionalLocationNamespace.BasicParam.UserID, 'sid': jQuery.FunctionalLocationNamespace.BasicParam.SiteID, 'functionalLocationZip': 'true', fileName: imageFileName },
                    success: function (json) {
                        if (!json) {
                            ShowErrorMessage(languageResource.resMsg_FailedToUploadImage, true);
                        }
                    },
                    error: function (request, error) {
                        var errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToUploadImage;
                        if (request.responseText != "") {
                            if (error != undefined && error != null && error.Message != undefined && error.Message != null)
                                errorMessage = languageResource.resMsg_Error + errorMsg.Message;
                        }
                        ShowErrorMessage(errorMessage, true);
                    }
                });
            }
        },
        error: function (request, error) {
            if (request.responseText != "") {
                var message = request.responseText;
                if (message != undefined && message != "" && message.Message != undefined && message.Message != "") {
                    jQuery("#lblUploadError").html(languageResource.resMsg_Error + message.Message);
                }
                else {
                    jQuery("#lblUploadError").html(languageResource.resMsg_FailedToUploadImage);
                }
            }
            else {
                jQuery("#lblUploadError").html(languageResource.resMsg_FailedToUploadImage);
            }
        }
    });
}