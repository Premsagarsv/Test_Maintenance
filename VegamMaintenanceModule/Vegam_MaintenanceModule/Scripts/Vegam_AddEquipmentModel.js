﻿jQuery.EquipmentModelNamespace = jQuery.EquipmentModelNamespace || {};
jQuery.EquipmentModelNamespace.BasicParam = jQuery.EquipmentModelNamespace.BasicParam || {};
jQuery.EquipmentModelNamespace.PagerData = jQuery.EquipmentModelNamespace.PagerData || {};
jQuery.EquipmentModelNamespace.MaintTypePagerData = jQuery.EquipmentModelNamespace.MaintTypePagerData || {};
jQuery.EquipmentModelNamespace.BasePath = "";
jQuery.EquipmentModelNamespace.WebServicePath = "";
jQuery.EquipmentModelNamespace.ImagePath = "";
jQuery.EquipmentModelNamespace.ModelID = 0;
jQuery.EquipmentModelNamespace.UploaderPath = "";
jQuery.EquipmentModelNamespace.EquipmentModelImageName = "";
jQuery.EquipmentModelNamespace.EquipmentModelImagePath = "";
jQuery.EquipmentModelNamespace.MasterDataType = { "Manufacturer": 'MANUFACTURER', "EquipmentType": 'TYPE', "EquipmentClass": 'CLASS', "MeasuringPointCategory": 'MP_CATEGORY', "MPSelectionGroupCode": 'GROUPCODE' };
jQuery.EquipmentModelNamespace.SelectedMasterDataType = ""
jQuery.EquipmentModelNamespace.InfoType = { "None": 'N', "Equipment": 'E', "Equipment_Model": 'M' };
jQuery.EquipmentModelNamespace.AdditionalLinksType = { "MeasuringPoint": 'P', "Document": 'D' };
jQuery.EquipmentModelNamespace.LoadControlID = "";
jQuery.EquipmentModelNamespace.HasFullAccess = "";

var equipmentViewModel = {
    HasEditAccess: false,
    HasDeleteAccess: false,
    ModelName: ko.observable(''),
    ManufacturerList: ko.observableArray([]),
    SelectedManufacturer: ko.observable(),
    ModelVersionNo: ko.observable(''),
    HasUploadPermission: ko.observable(false),
    ModelTypeList: ko.observableArray([]),
    SelectedModelType: ko.observable(),
    ModelClassList: ko.observableArray([]),
    SelectedModelClass: ko.observable(),
    ModelDescription: ko.observable(''),
    ModelImagePath: ko.observable(''),
    ModelErrorMsg: ko.observable(''),
    ModelErrorCss: ko.observable(''),
    MeasuringPointURLPath: ko.observable('#'),
    DocumentPhotoURLPath: ko.observable('#'),
    IsEmptylist: ko.observable(false)
};

var equipmentViewModelList = {
    EquipmentModelList: ko.observableArray([]),
    PagerContent: ko.observable(),
    IsEmptyModelist: ko.observable(false)
};

var maintenanceTypeUpdateViewModel = {
    LoadErrorMessageVisible: ko.observable(false),
    LoadErrorMessage: ko.observable(''),
    LoadErrorMessageClass: ko.observable(''),
    MaintTypePagerData: ko.observable(''),
    DefaultMaintenanceTypesArray: ko.observableArray([]),
    HasMaintTypeAccess: false,
    HasDeleteMaintTypeAccess: false
}

function EquipmentModelLoadInfo(basicParam, pagerData, maintTypePagerData, basePath, webServicePath, imagePath, uploaderPath, uploadImageAccess, modelID, equipmentModelImgPath, hasFullAccess) {
    jQuery.EquipmentModelNamespace.BasicParam = basicParam;
    jQuery.EquipmentModelNamespace.PagerData = pagerData;
    jQuery.EquipmentModelNamespace.BasePath = basePath;
    jQuery.EquipmentModelNamespace.WebServicePath = webServicePath;
    jQuery.EquipmentModelNamespace.ImagePath = imagePath;
    jQuery.EquipmentModelNamespace.UploaderPath = uploaderPath;
    jQuery.EquipmentModelNamespace.ModelID = modelID;
    jQuery.EquipmentModelNamespace.EquipmentModelImagePath = equipmentModelImgPath;
    jQuery.EquipmentModelNamespace.MaintTypePagerData = maintTypePagerData;
    jQuery.EquipmentModelNamespace.LoadControlID = maintTypePagerData.LoadControlID;
    jQuery.EquipmentModelNamespace.HasFullAccess = hasFullAccess;

    if (hasFullAccess.toLowerCase() == "true") {
        equipmentViewModel.HasDeleteAccess = true;
        equipmentViewModel.HasEditAccess = true;
    }
    else
        equipmentViewModel.HasEditAccess = true;

    jQuery('.selectDropDown').select2();
    ko.applyBindings(equipmentViewModel, document.getElementById("divEquipmentModelInfo"));
    ko.applyBindings(equipmentViewModelList, document.getElementById("divEquipmentModelList"));
    ko.applyBindings(maintenanceTypeUpdateViewModel, document.getElementById("divAddMaintenanceMasterDataModal"));

    LoadMasterDropDownList(true);
    LoadEquipmentModelList(jQuery.EquipmentModelNamespace.PagerData);

    if (modelID > 0) {
        LoadEquipmentModelInfo();
    }
    else {
        equipmentViewModel.ModelImagePath(jQuery.EquipmentModelNamespace.ImagePath);
    }
    if (uploadImageAccess != "True")
        equipmentViewModel.HasUploadPermission(true);
}

var value;
function LoadEquipmentModelList(pagerData) {
    var equipmentFilterInfo = {};
    equipmentFilterInfo.EquipmentID = jQuery.EquipmentModelNamespace.ModelID;
    equipmentFilterInfo.UserID = jQuery.EquipmentModelNamespace.BasicParam.UserID;
    equipmentFilterInfo.SiteID = jQuery.EquipmentModelNamespace.BasicParam.SiteID;
    equipmentFilterInfo.InfoType = jQuery.EquipmentModelNamespace.InfoType.Equipment_Model.charCodeAt();
    equipmentFilterInfo.SerachNameOrCode = jQuery("#txtSearchEquipmentModel").val().trim();
    equipmentFilterInfo.PageSize = pagerData.PageSize;
    equipmentFilterInfo.PageIndex = pagerData.PageIndex;  

    if (jQuery("#hdnSortbyNameValue").val() != "") {
        equipmentFilterInfo.SortType = jQuery("#hdnSortbyNameValue").val();
    }

    //Dynamic pagerdata
    var totPageHeight = 800;
    var equipmentModelPos = jQuery("#divEquipmentModelList").offset().top;
    fLocationMaxHeight = totPageHeight - equipmentModelPos;
    if (jQuery(window).width() < 768)
        fLocationMaxHeight = 500;
    if (true) {
        value = value || Math.floor(fLocationMaxHeight / 75);
        equipmentFilterInfo.PageSize = value - 1;
        pagerData.PageSize = value;
    }

    jQuery.ajax({
        type: "POST",
        url: jQuery.EquipmentModelNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/GetEquipmentModelList",
        data: JSON.stringify({ pagerData: pagerData, equipmentFilterInfo: equipmentFilterInfo }),
        dataType: 'json',
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data.d != undefined) {
                var equipmentModelInfoList = data.d.EquipmentModeListlInfo;
                equipmentViewModelList.EquipmentModelList.removeAll();
                if ( equipmentModelInfoList.EquipmentModelList.length > 0) {
                    equipmentViewModelList.IsEmptyModelist(false);
                    equipmentViewModel.IsEmptylist(false);
                    jQuery.each(equipmentModelInfoList.EquipmentModelList, function (i, obj) {
                        obj.SelectedClass = ko.observable('');
                        if (obj.TypeValue == jQuery.EquipmentModelNamespace.ModelID)
                            obj.SelectedClass = ko.observable('bg-info');
                        else
                            obj.SelectedClass = ko.observable('');
                        equipmentViewModelList.EquipmentModelList.push(obj);
                    });
                    equipmentViewModelList.PagerContent(data.d.HTMLPager);
                } else {
                    equipmentViewModelList.IsEmptyModelist(true);
                    equipmentViewModel.IsEmptylist(true);
                }
            }
        },
        beforeSend: function () {
            jQuery("#divLoadProgressVisible").show();
            equipmentViewModelList.EquipmentModelList.removeAll();
            equipmentViewModelList.IsEmptyModelist(false);
            equipmentViewModel.IsEmptylist(false);
            equipmentViewModelList.PagerContent('');
        },
        complete: function () {
            jQuery("#divLoadProgressVisible").hide();
        },
        error: function (request, error) {
            jQuery("#divLoadProgressVisible").hide();
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                    ShowMessage(languageResource.resMsg_Error + errorMsg.Message, "error");
                else
                    ShowMessage(languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadEquipmentModel, "error");
            }
            else {
                ShowMessage(languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadEquipmentModel, "error");
            }
        }

    });
}

function LoadEquipmentModelInfo() {
    if (jQuery.EquipmentModelNamespace.ModelID > 0) {
        jQuery.EquipmentModelNamespace.EquipmentModelImageName = "";

        ko.utils.arrayForEach(equipmentViewModelList.EquipmentModelList(), function (item) {
            item.SelectedClass('');
            if (item.TypeValue == jQuery.EquipmentModelNamespace.ModelID) {
                item.SelectedClass('bg-info');
            }
            else {
                item.SelectedClass('');
            }
        });

        equipmentViewModel.ModelErrorMsg('');
        var EquipmentFilterInfo = {};
        EquipmentFilterInfo.EquipmentID = jQuery.EquipmentModelNamespace.ModelID;
        EquipmentFilterInfo.UserID = jQuery.EquipmentModelNamespace.BasicParam.UserID;
        EquipmentFilterInfo.SiteID = jQuery.EquipmentModelNamespace.BasicParam.SiteID;
        EquipmentFilterInfo.InfoType = jQuery.EquipmentModelNamespace.InfoType.Equipment_Model.charCodeAt();

        jQuery.ajax({
            type: "POST",
            url: jQuery.EquipmentModelNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/GetEquipmentModelInfo",
            data: JSON.stringify({ equipmentFilterInfo: EquipmentFilterInfo }),
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            async: false,
            success: function (data) {
                var equipmentDetailsInfo = data.d;
                if (equipmentDetailsInfo != undefined) {
                    equipmentViewModel.ModelName(equipmentDetailsInfo.EquipmentModelName);
                    equipmentViewModel.ModelDescription(equipmentDetailsInfo.EquipmentModelDesc);
                    equipmentViewModel.SelectedManufacturer(equipmentDetailsInfo.ManufacturerID);
                    equipmentViewModel.SelectedModelType(equipmentDetailsInfo.CategoryID);
                    equipmentViewModel.SelectedModelClass(equipmentDetailsInfo.ClassID);
                    jQuery("#drpModelManufacturer").select2();
                    jQuery("#drpModelType").select2();
                    jQuery("#drpModelClass").select2();
                    equipmentViewModel.ModelVersionNo(equipmentDetailsInfo.EquipmentModelNumber);
                    if (equipmentDetailsInfo.EquipmentImagePath != null && jQuery.trim(equipmentDetailsInfo.EquipmentImagePath) != "") {
                        equipmentViewModel.ModelImagePath(equipmentDetailsInfo.EquipmentImagePath);
                    }
                    else {
                        equipmentViewModel.ModelImagePath(jQuery.EquipmentModelNamespace.ImagePath);
                    }
                    jQuery("#" + jQuery.EquipmentModelNamespace.LoadControlID).html(languageResource.resMsg_Update);
                    jQuery("#" + jQuery.EquipmentModelNamespace.LoadControlID).removeClass('disabled');
                    jQuery("#txtEquipmentModelDesc").autoResize();
                }
                else {
                    ShowMessage(languageResource.resMsg_FailedToLoadModelInfo, "error");
                }
            },
            error: function (request, error) {
                if (request.responseText != "") {
                    var errorMsg = jQuery.parseJSON(request.responseText);
                    if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                        ShowMessage(languageResource.resMsg_Error + errorMsg.Message, "error");
                    else
                        ShowMessage(languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadModelInfo, "error");
                }
                else {
                    ShowMessage(languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadModelInfo, "error");
                }
            }
        });
    }
    else {
        ClearEquipmentModelInfo();
    }
}

function LoadMasterDropDownList(isPageLoad, masterDataType) {
    var masterDataDropDownListFilterInfo = {}
    masterDataDropDownListFilterInfo.MasterDataTypeList = [];
    if (isPageLoad || masterDataType == jQuery.EquipmentModelNamespace.MasterDataType.Manufacturer)
        masterDataDropDownListFilterInfo.MasterDataTypeList.push(jQuery.EquipmentModelNamespace.MasterDataType.Manufacturer);
    if (isPageLoad || masterDataType == jQuery.EquipmentModelNamespace.MasterDataType.EquipmentType)
        masterDataDropDownListFilterInfo.MasterDataTypeList.push(jQuery.EquipmentModelNamespace.MasterDataType.EquipmentType);
    if (isPageLoad || masterDataType == jQuery.EquipmentModelNamespace.MasterDataType.EquipmentClass)
        masterDataDropDownListFilterInfo.MasterDataTypeList.push(jQuery.EquipmentModelNamespace.MasterDataType.EquipmentClass);
masterDataDropDownListFilterInfo.SortType = "MasterDataName_asc";  

    jQuery.ajax({
        type: "POST",
        url: jQuery.EquipmentModelNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/GetAllMaintMasterDropDownDataInfo",
        data: JSON.stringify({ basicParam: jQuery.EquipmentModelNamespace.BasicParam, masterDataDropDownListFilterInfo: masterDataDropDownListFilterInfo }),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (data) {
            if (data != undefined && data.d != null) {
                var indexInfo = {};
                indexInfo.TypeValue = "-1";
                var masterDataDropDownList = data.d;
                if (isPageLoad || masterDataType == jQuery.EquipmentModelNamespace.MasterDataType.Manufacturer) {
                    indexInfo.DisplayName = languageResource.resMsg_SelectManufacturer;
                    equipmentViewModel.ManufacturerList.removeAll();
                    equipmentViewModel.ManufacturerList.push(indexInfo);
                    jQuery.each(masterDataDropDownList.ManufacturerInfoList, function (i, masterData) {
                        masterDataInfo = {};
                        masterDataInfo.TypeValue = masterData.TypeValue;
                        masterDataInfo.DisplayName = masterData.DisplayName;
                        equipmentViewModel.ManufacturerList.push(masterDataInfo);
                    });
                    if (jQuery.EquipmentModelNamespace.ModelID > 0) {
                        jQuery("#drpModelManufacturer").val(equipmentViewModel.SelectedManufacturer());
                    }
                    jQuery("#drpModelManufacturer").select2();
                }
                if (isPageLoad || masterDataType == jQuery.EquipmentModelNamespace.MasterDataType.EquipmentType) {
                    indexInfo.DisplayName = languageResource.resMsg_SelectModelType;
                    equipmentViewModel.ModelTypeList.removeAll();
                    equipmentViewModel.ModelTypeList.push(indexInfo);
                    jQuery.each(masterDataDropDownList.CategoryInfoList, function (i, masterData) {
                        masterDataInfo = {};
                        masterDataInfo.TypeValue = masterData.TypeValue;
                        masterDataInfo.DisplayName = masterData.DisplayName;
                        equipmentViewModel.ModelTypeList.push(masterDataInfo);
                    });
                    if (jQuery.EquipmentModelNamespace.ModelID > 0) {
                        jQuery("#drpModelType").val(equipmentViewModel.SelectedModelType());
                    }
                    jQuery("#drpModelType").select2();
                }
                if (isPageLoad || masterDataType == jQuery.EquipmentModelNamespace.MasterDataType.EquipmentClass) {
                    indexInfo.DisplayName = languageResource.resMsg_SelectModelClass;
                    equipmentViewModel.ModelClassList.removeAll();
                    equipmentViewModel.ModelClassList.push(indexInfo);
                    jQuery.each(masterDataDropDownList.ClassInfoList, function (i, masterData) {
                        masterDataInfo = {};
                        masterDataInfo.TypeValue = masterData.TypeValue;
                        masterDataInfo.DisplayName = masterData.DisplayName;
                        equipmentViewModel.ModelClassList.push(masterDataInfo);
                    });
                    if (jQuery.EquipmentModelNamespace.ModelID > 0) {
                        jQuery("#drpModelClass").val(equipmentViewModel.equipmentViewModel.SelectedModelClass());
                    }
                    jQuery("#drpModelClass").select2();
                }
            }
            else {
                var errorMsg = languageResource.resMsg_Error + languageResource.resMsg_FailedToBindMaintenanceMasterInfo;
                ShowErrorMessage(errorMsg, true);
            }
        },
        error: function (request, error) {
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                    ShowMessage(errorMsg.Message, "error");
                else
                    ShowMessage(languageResource.resMsg_FailedToInsertUpdateData, "error");
            }
            else {
                ShowMessage(languageResource.resMsg_FailedToInsertUpdateData, "error");
            }
        }
    });
}

function AddUpdateEquipmentModel() {

    equipmentViewModel.ModelErrorMsg('');
    var isValid = true;
    var errorMsg = "";
    var equipmentDetailsInfo = {}
    equipmentDetailsInfo.EquipmentID = jQuery.EquipmentModelNamespace.ModelID;
    equipmentDetailsInfo.EquipmentName = jQuery.trim(equipmentViewModel.ModelName());
    equipmentDetailsInfo.ManufacturerID = equipmentViewModel.SelectedManufacturer();
    equipmentDetailsInfo.CategoryID = equipmentViewModel.SelectedModelType();
    equipmentDetailsInfo.ClassID = equipmentViewModel.SelectedModelClass();
    equipmentDetailsInfo.EquipmentDesc = jQuery.trim(equipmentViewModel.ModelDescription());
    equipmentDetailsInfo.ModelNumber = jQuery.trim(equipmentViewModel.ModelVersionNo());
    equipmentDetailsInfo.EquipmentImageName = jQuery.EquipmentModelNamespace.EquipmentModelImageName;
    equipmentDetailsInfo.InfoType = jQuery.EquipmentModelNamespace.InfoType.Equipment_Model.charCodeAt();

    if (equipmentDetailsInfo.EquipmentName === "") {
        errorMsg += languageResource.resMsg_EnterModelName + "</br>";
        isValid = false;
    }
    if (equipmentDetailsInfo.ModelNumber === "") {
        errorMsg += languageResource.resMsg_EnterModelVersion + "</br>";
        isValid = false;
    }
    if (equipmentDetailsInfo.ManufacturerID === "-1") {
        errorMsg += languageResource.resMsg_PleaseSelectManufacturer + "</br>";
        isValid = false;
    }
    if (equipmentDetailsInfo.CategoryID === "-1") {
        errorMsg += languageResource.resMsg_PleaseSelectType + "</br>";
        isValid = false;
    }
    if (equipmentDetailsInfo.ClassID === "-1") {
        equipmentDetailsInfo.ClassID = 0;
    }

    if (!isValid) {
        ShowMessage(errorMsg, "error");
    }
    else {
        jQuery.ajax({
            type: "POST",
            url: jQuery.EquipmentModelNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/InsertOrUpdateEquipmentModelInfo",
            data: JSON.stringify({ basicParam: jQuery.EquipmentModelNamespace.BasicParam, equipmentDetailsInfo: equipmentDetailsInfo }),
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            async: false,
            success: function (data) {
                var equipmentModelID = data.d;
                if (equipmentModelID != undefined) {
                    switch (equipmentModelID) {
                        case -1:
                            ShowMessage(languageResource.resMsg_EnterModelName, "error");
                            break;
                        case -2:
                            ShowMessage(languageResource.resMsg_ModelNameAlreadyExist, "error");
                            break;
                        case -3:
                            ShowMessage(languageResource.resMsg_InvalidUser, "error");
                            break;
                        case -4:
                            ShowMessage(languageResource.resMsg_EnterModelVersion, "error");
                            break;
                        case -5:
                            ShowMessage(languageResource.resMsg_PleaseSelectManufacturer, "error");
                            break;
                        case -6:
                            ShowMessage(languageResource.resMsg_PleaseSelectType, "error");
                            break;
                        //case -7:
                        //    ShowMessage(languageResource.resMsg_PleaseSelectClass, "error");
                        //    break;
                        case -7:
                            ShowMessage(languageResource.resMsg_ManufacturerAndVersionIsAlreadyExists, "error");
                            break;
                        default:
                            {
                                if (equipmentDetailsInfo.EquipmentID > 0)
                                    ShowMessage(languageResource.resMsg_ModelInfoUpdated, "info");
                                else
                                ShowMessage(languageResource.resMsg_ModelInfoSaved, "info");
                                jQuery("#" + jQuery.EquipmentModelNamespace.LoadControlID).prop("onclick", null);
                                jQuery("#" + jQuery.EquipmentModelNamespace.LoadControlID).show().attr('onclick', 'AddUpdateEquipmentModel();return false;');
                                jQuery("#" + jQuery.EquipmentModelNamespace.LoadControlID).html(languageResource.resMsg_SaveAndAddMore);
                                ClearEquipmentModelInfo();
                                LoadEquipmentModelList(jQuery.EquipmentModelNamespace.PagerData);
                                ko.utils.arrayForEach(equipmentViewModelList.EquipmentModelList(), function (item) {
                                    item.SelectedClass('');
                                    if (item.TypeValue == equipmentModelID) {
                                        item.SelectedClass('bg-info');
                                    }
                                    else {
                                        item.SelectedClass('');
                                    }
                                });
                            }
                            break;
                    }
                }
                else {
                    ShowMessage(languageResource.resMsg_FailedToInsertUpdateData, "error");
                }
            },
            error: function (request, error) {
                if (request.responseText != "") {
                    var errorMsg = jQuery.parseJSON(request.responseText);
                    if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                        ShowMessage(languageResource.resMsg_Error + errorMsg.Message, "error");
                    else
                        ShowMessage(languageResource.resMsg_Error + languageResource.resMsg_FailedToInsertUpdateData, "error");
                }
                else {
                    ShowMessage(languageResource.resMsg_Error + languageResource.resMsg_FailedToInsertUpdateData, "error");
                }
            }
        });
    }
}

var isChanged = true;
function EquipmentModelImageUpload() {
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
                imageName = "Img_" + currentDateAndTime + "." + ext;
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
            var urlString = jQuery.EquipmentModelNamespace.UploaderPath + '?uid=' + jQuery.EquipmentModelNamespace.BasicParam.UserID + '&sid=' + jQuery.EquipmentModelNamespace.BasicParam.SiteID + '&fileName=' + imageName + '&equipmentModelInfo=true';

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
                        jQuery.EquipmentModelNamespace.EquipmentModelImageName = imageName;
                        equipmentViewModel.ModelImagePath(jQuery.EquipmentModelNamespace.EquipmentModelImagePath + "/" + imageName);
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

function ShowMessage(message, messageType) {
    switch (messageType.toLowerCase()) {
        case 'info':
            equipmentViewModel.ModelErrorCss("text-info");
            equipmentViewModel.ModelErrorMsg(message);
            break;
        case 'error':
            equipmentViewModel.ModelErrorCss("text-danger");
            equipmentViewModel.ModelErrorMsg(message);
            break;
    }
}

function ClearEquipmentModelInfo() {
    ko.utils.arrayForEach(equipmentViewModelList.EquipmentModelList(), function (item) {
        item.SelectedClass('');
    });
    jQuery.EquipmentModelNamespace.ModelID = 0;
    equipmentViewModel.ModelName('');
    equipmentViewModel.ModelDescription('');
    jQuery("#txtEquipmentModelDesc").autoResize();
    equipmentViewModel.ModelVersionNo('');
    equipmentViewModel.SelectedManufacturer("-1");
    equipmentViewModel.SelectedModelType("-1");
    equipmentViewModel.SelectedModelClass("-1");
    jQuery("#drpModelManufacturer").select2();
    jQuery("#drpModelType").select2();
    jQuery("#drpModelClass").select2();
    jQuery.EquipmentModelNamespace.EquipmentModelImageName = "";
    equipmentViewModel.ModelImagePath(jQuery.EquipmentModelNamespace.ImagePath);
    jQuery("#" + jQuery.EquipmentModelNamespace.LoadControlID).html(languageResource.resMsg_SaveAndAddMore);
    if (equipmentViewModel.HasEditAccess && !equipmentViewModel.HasDeleteAccess)
        jQuery("#" + jQuery.EquipmentModelNamespace.LoadControlID).addClass('disabled');
}

function DeleteEquipmentModel(equipmentModelID) {
    jQuery("#alertMessage").removeClass("text-info");
    jQuery("#alertMessage").removeClass("text-danger");
    jQuery("#alertMessage").html(languageResource.resMsg_AreYouSureYouWantToDeleteEquipmentModel);
    jQuery("#alertModal").dialog({
        modal: true,
        buttons: [
            {
                text: languageResource.resMsg_Confirm,
                click: function () {
                    jQuery("#alertModal").dialog("close");
                    DeleteConfirmedEquipmentModel(equipmentModelID);
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

    var btnPosition = jQuery("#divTrash_" + equipmentModelID).offset().top;
    jQuery(".ui-dialog").css("top", btnPosition);
    window.parent.parent.scrollTo(0, btnPosition);
}

function DeleteConfirmedEquipmentModel(equipmentModelID) {
    jQuery.ajax({
        type: "POST",
        url: jQuery.EquipmentModelNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/DeleteEquipmentModelInfo",
        data: JSON.stringify({ basicParam: jQuery.EquipmentModelNamespace.BasicParam, equipmentModelID: equipmentModelID }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (json) {
            if (json.d != null && json.d != undefined) {
                if (json.d === 1) {
                    ClearEquipmentModelInfo();
                    LoadEquipmentModelList(jQuery.EquipmentModelNamespace.PagerData);
                }
                else if (json.d === 2) {
                    var msg = languageResource.resMsg_EquipmentModelAleadyInUsed;
                    ShowMessage(msg, "error");
                }
                else {
                    ShowMessage(languageResource.resMsg_EquipmentModelDeleteFailure, "error");
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
                    errorMessage = languageResource.resMsg_EquipmentModelDeleteFailure;
            }
            else {
                errorMessage = languageResource.resMsg_EquipmentModelDeleteFailure;
            }
            ShowMessage(languageResource.resMsg_EquipmentModelDeleteFailure, "error");
        }
    });
}

function ViewAdditionalInfoLinks(additionalLinksType) {
    var queryString = "?id=" + jQuery.EquipmentModelNamespace.BasicParam.SiteID;
    if (jQuery.EquipmentModelNamespace.ModelID == 0) {
        if (jQuery("#fieldsetModelList > div").find("label").hasClass('bg-info')) {
            jQuery.EquipmentModelNamespace.ModelID = equipmentViewModelList.EquipmentModelList()[0].TypeValue;
        }
    }
    if (additionalLinksType == jQuery.EquipmentModelNamespace.AdditionalLinksType.MeasuringPoint) {
        queryString = queryString + "&eid=" + jQuery.EquipmentModelNamespace.ModelID + "&type=" + jQuery.EquipmentModelNamespace.InfoType.Equipment_Model.toString();
        window.location.href = jQuery.EquipmentModelNamespace.BasePath + "/Preventive/AddMeasuringPoint.aspx" + queryString;
    }
    else if (additionalLinksType == jQuery.EquipmentModelNamespace.AdditionalLinksType.Document) {
        queryString = queryString + "&eid=" + jQuery.EquipmentModelNamespace.ModelID + "&type=" + jQuery.EquipmentModelNamespace.InfoType.Equipment_Model.toString() + "&hasFullAccess=" + jQuery.EquipmentModelNamespace.HasFullAccess;
        window.location.href = jQuery.EquipmentModelNamespace.BasePath + "/Preventive/AddDocumentsAndImages.aspx" + queryString;
    }
}

function ClearEquipmentModeFieldlInfo() {
    equipmentViewModel.ModelErrorMsg('');
    ClearEquipmentModelInfo();
}

function BindIconAttributes(hasAccess) {
    var iconAttributes = {};
    if (!hasAccess) {
        iconAttributes.disabled = "disabled";
    }
    return iconAttributes;
}

//add maintenance type modal
function ShowAddMaintenanceTypeModal(type) {
    jQuery.EquipmentModelNamespace.SelectedMasterDataType = type;
    BindMasterDataInfo();
    ClearMaintenanceTypeInfo(false);
    var btnAddMaintType = jQuery.EquipmentModelNamespace.MaintTypePagerData.LoadControlID.replace("btnAddUpdateEquipmentModel", "btnAddMaintType");
    jQuery("#" + btnAddMaintType).text(languageResource.resMsg_Add);
    if (jQuery("#iconViewintTypes").hasClass("fa fa-minus-circle")) {
        jQuery("#iconViewintTypes").removeClass("fa fa-minus-circle");
        jQuery("#iconViewintTypes").addClass("fa fa-plus-circle");
    }
    var btnShowAll = "btnShowAll";
    jQuery("#" + btnShowAll).addClass('hide');
    jQuery("#iconViewMaintTypes").removeClass("fa fa-minus-circle");
    jQuery("#iconViewMaintTypes").addClass("fa fa-plus-circle");
    jQuery("#divMaintTypes").addClass("hide");
    jQuery("#divAddMaintenanceMasterDataModal").modal("show");
}

function BindMasterDataInfo() {
    if (jQuery.EquipmentModelNamespace.SelectedMasterDataType == jQuery.EquipmentModelNamespace.MasterDataType.Manufacturer) {
        jQuery("#modalHeaderName").text(languageResource.resMsg_ManufacturerInformation);
        jQuery(".labelMasterDataType").text(languageResource.resMsg_Manufacturer);
        jQuery("#fieldsetAddedit").text(languageResource.resMsg_AddEditMasterData.replace("[XXX]", languageResource.resMsg_Manufacturer));
        jQuery("#spnViewAllMaintTypes").text(languageResource.resMsg_ClickHereToView.replace("[XXX]", languageResource.resMsg_Manufacturer));
        jQuery("#spanListofInfo").text(languageResource.resMsg_ListOfMasterData.replace("[XXX]", languageResource.resMsg_Manufacturer + 's'));
        jQuery.EquipmentModelNamespace.SelectedMasterDataMessage = languageResource.resMsg_Manufacturer;
    }
    if (jQuery.EquipmentModelNamespace.SelectedMasterDataType == jQuery.EquipmentModelNamespace.MasterDataType.EquipmentType) {
        jQuery("#modalHeaderName").text(languageResource.resMsg_EquipmentTypeInformation);
        jQuery(".labelMasterDataType").text(languageResource.resMsg_EquipmentType);
        jQuery("#fieldsetAddedit").text(languageResource.resMsg_AddEditMasterData.replace("[XXX]", languageResource.resMsg_EquipmentType));
        jQuery("#spnViewAllMaintTypes").text(languageResource.resMsg_ClickHereToView.replace("[XXX]", languageResource.resMsg_EquipmentType));
        jQuery("#spanListofInfo").text(languageResource.resMsg_ListOfMasterData.replace("[XXX]", languageResource.resMsg_EquipmentType + 's'));
        jQuery.EquipmentModelNamespace.SelectedMasterDataMessage = languageResource.resMsg_EquipmentType;
    }
    if (jQuery.EquipmentModelNamespace.SelectedMasterDataType == jQuery.EquipmentModelNamespace.MasterDataType.EquipmentClass) {
        jQuery("#modalHeaderName").text(languageResource.resMsg_EquipmentClassInformation);
        jQuery(".labelMasterDataType").text(languageResource.resMsg_EquipmentClass);
        jQuery("#fieldsetAddedit").text(languageResource.resMsg_AddEditMasterData.replace("[XXX]", languageResource.resMsg_EquipmentClass));
        jQuery("#spnViewAllMaintTypes").text(languageResource.resMsg_ClickHereToView.replace("[XXX]", languageResource.resMsg_EquipmentClass));
        jQuery("#spanListofInfo").text(languageResource.resMsg_ListOfMasterData.replace("[XXX]", languageResource.resMsg_EquipmentClass + 'es'));
        jQuery.EquipmentModelNamespace.SelectedMasterDataMessage = languageResource.resMsg_EquipmentClass;
    }
}

function SearchMaintTypes() {
    var btnSave = jQuery.EquipmentModelNamespace.MaintTypePagerData.LoadControlID;
    jQuery.EquipmentModelNamespace.IsMaintTypeSearch = true;

    if (jQuery.EquipmentModelNamespace.IsMaintTypeSearch == true) {
        if (jQuery.trim(jQuery("#txtSearchMaintType").val()) == "") {
            jQuery("#spnSearchError").html(languageResource.resMsg_SearchCriteria);
            return false;
        }
    }
    var btnShowAll = "btnShowAll";
    jQuery("#" + btnShowAll).html("Show All");
    jQuery("#" + btnShowAll).removeClass('hide');
    jQuery("#spnSearchError").empty();
    jQuery("#spnAddMaintTypeError").html("");
    jQuery("#txtNewMaintType").val("");
    var btnAddMaintType = btnSave.replace("btnAddUpdateEquipmentModel", "btnAddMaintType");
    jQuery("#" + btnAddMaintType).val("");
    jQuery("#" + btnAddMaintType).text(languageResource.resMsg_Add);

    var thMaintTypes = jQuery.EquipmentModelNamespace.MaintTypePagerData.LoadControlID.replace("btnAddUpdateEquipmentModel", "thMaintTypes");
    jQuery("#" + thMaintTypes + " i").removeClass('fa-sort-up');
    jQuery("#" + thMaintTypes + " i").removeClass('fa-sort-down');
    jQuery("#hdfSortValue").val('');
    jQuery("#divMaintTypes").removeClass("hide");
    jQuery("#iconViewMaintTypes").removeClass("fa fa-plus-circle");
    jQuery("#iconViewMaintTypes").addClass("fa fa-minus-circle");

    var maintTypeAccess = jQuery.EquipmentModelNamespace.MaintTypePagerData.PageAccessRights.toLowerCase();
    if (maintTypeAccess == "full_access" || maintTypeAccess == "edit_only")
        maintenanceTypeUpdateViewModel.HasMaintTypeAccess = true;
    if (maintTypeAccess == "full_access") {
        maintenanceTypeUpdateViewModel.HasDeleteMaintTypeAccess = true;
        jQuery("#" + btnAddMaintType).removeAttr('disabled');
        jQuery("#" + btnAddMaintType).prop("onclick", null);
        jQuery("#" + btnAddMaintType).unbind('click');
        jQuery("#" + btnAddMaintType).bind("click", function () { InsertOrUpdateMaintType(0); return false; });
    }
    else {
        jQuery("#" + btnAddMaintType).attr('disabled', 'disabled');
    }

    LoadMaintTypesInfo(jQuery.EquipmentModelNamespace.MaintTypePagerData);
}

function ShowAllMaintTypes() {
    jQuery.EquipmentModelNamespace.IsMaintTypeSearch = false;
    ClearMaintenanceTypeInfo(false);
    jQuery("#btnShowAll").addClass('hide');

    var thMaintTypes = jQuery.EquipmentModelNamespace.MaintTypePagerData.LoadControlID.replace("btnAddUpdateEquipmentModel", "thMaintTypes");
    jQuery("#" + thMaintTypes + " i").removeClass('fa-sort-up');
    jQuery("#" + thMaintTypes + " i").removeClass('fa-sort-down');
    jQuery("#hdfSortValue").val('');
    jQuery("#divMaintTypes").removeClass("hide");
    jQuery("#iconViewMaintTypes").removeClass("fa fa-plus-circle");
    jQuery("#iconViewMaintTypes").addClass("fa fa-minus-circle");

    var btnAddMaintType = jQuery.EquipmentModelNamespace.MaintTypePagerData.LoadControlID.replace("btnAddUpdateEquipmentModel", "btnAddMaintType");
    jQuery("#" + btnAddMaintType).text(languageResource.resMsg_Add);

    var maintTypeAccess = jQuery.EquipmentModelNamespace.MaintTypePagerData.PageAccessRights.toLowerCase();
    if (maintTypeAccess == "full_access" || maintTypeAccess == "edit_only")
        maintenanceTypeUpdateViewModel.HasMaintTypeAccess = true;
    if (maintTypeAccess == "full_access") {
        maintenanceTypeUpdateViewModel.HasDeleteMaintTypeAccess = true;
        jQuery("#" + btnAddMaintType).removeAttr('disabled');
        jQuery("#" + btnAddMaintType).prop("onclick", null);
        jQuery("#" + btnAddMaintType).unbind('click');
        jQuery("#" + btnAddMaintType).bind("click", function () { InsertOrUpdateMaintType(0); return false; });
    }
    else {
        jQuery("#" + btnAddMaintType).attr('disabled', 'disabled');
    }

    LoadMaintTypesInfo(jQuery.EquipmentModelNamespace.MaintTypePagerData);
}

function ClearMaintenanceTypeInfo(isDelete) {
    jQuery("#spnSearchError").html("");
    jQuery("#spnAddMaintTypeError").html("");
    var btnAddMaintType = jQuery.EquipmentModelNamespace.MaintTypePagerData.LoadControlID.replace("btnAddUpdateEquipmentModel", "btnAddMaintType");
    jQuery("#" + btnAddMaintType).text(languageResource.resMsg_Add);
    if (jQuery.EquipmentModelNamespace.MaintTypePagerData.PageAccessRights.toLowerCase() == "full_access") {
        jQuery("#" + btnAddMaintType).removeAttr('disabled');
        jQuery("#" + btnAddMaintType).prop("onclick", null);
        jQuery("#" + btnAddMaintType).unbind('click');
        jQuery("#" + btnAddMaintType).bind("click", function () { InsertOrUpdateMaintType(0); return false; });
    }
    else {
        jQuery("#" + btnAddMaintType).attr('disabled', 'disabled');
    }

    if (jQuery.EquipmentModelNamespace.MaintTypePagerData.PageAccessRights.toLowerCase() != "full_access") {
        jQuery("#" + btnAddMaintType).attr("disabled", "disabled");
    }
    var btnShowAll = "btnShowAll";
    if (jQuery.trim(jQuery("#txtNewMaintType").val()) == "" && jQuery.trim(jQuery("#txtMasterDescription").val()) == "" && jQuery.trim(jQuery("#txtSearchMaintType").val()) == "" && (jQuery("#" + btnShowAll).is(':visible') == false) && !isDelete)
        jQuery("#divAddMaintenanceMasterDataModal").modal("hide");
    else {
        jQuery("#txtNewMaintType").val("");
        jQuery("#txtSearchMaintType").val("");
        jQuery("#txtMasterDescription").val("");
        jQuery("#txtMasterDescription").autoResize();
        if (jQuery("#" + btnShowAll).is(':visible')) {
            jQuery("#" + btnShowAll).addClass('hide');
            LoadMaintTypesInfo(jQuery.EquipmentModelNamespace.MaintTypePagerData);
        }
    }

    if (jQuery("#divAddMaintenanceMasterDataModal").hasClass('ui-dialog-content')) {
        jQuery("#divAddMaintenanceMasterDataModal").dialog("close");
    }
}

function ShowHideMaintTypesInfo() {
    if (jQuery("#iconViewMaintTypes").hasClass("fa-plus-circle")) {
        var thMaintTypes = jQuery.EquipmentModelNamespace.MaintTypePagerData.LoadControlID.replace("btnAddUpdateEquipmentModel", "thMaintTypes");
        jQuery("#" + thMaintTypes + " i").removeClass('fa-sort-up');
        jQuery("#" + thMaintTypes + " i").removeClass('fa-sort-down');
        jQuery("#hdfSortValue").val('');
        jQuery("#divMaintTypes").removeClass("hide");
        jQuery("#iconViewMaintTypes").removeClass("fa fa-plus-circle");
        jQuery("#iconViewMaintTypes").addClass("fa fa-minus-circle");

        var maintTypeAccess = jQuery.EquipmentModelNamespace.MaintTypePagerData.PageAccessRights.toLowerCase();
        if (maintTypeAccess == "full_access" || maintTypeAccess == "edit_only")
            maintenanceTypeUpdateViewModel.HasMaintTypeAccess = true;
        if (maintTypeAccess == "full_access") {
            maintenanceTypeUpdateViewModel.HasDeleteMaintTypeAccess = true;
        }
        LoadMaintTypesInfo(jQuery.EquipmentModelNamespace.MaintTypePagerData);
    }
    else {
        jQuery("#iconViewMaintTypes").removeClass("fa fa-minus-circle");
        jQuery("#iconViewMaintTypes").addClass("fa fa-plus-circle");
        jQuery("#divMaintTypes").addClass("hide");
    }
}

function LoadMaintTypesInfo(pagerData) {
    var masterDataFilterInfo = {};
    masterDataFilterInfo.PageIndex = pagerData.PageIndex;
    masterDataFilterInfo.PageSize = pagerData.PageSize;
    masterDataFilterInfo.MasterDataType = jQuery.EquipmentModelNamespace.SelectedMasterDataType;

    if (jQuery.EquipmentModelNamespace.IsMaintTypeSearch == true) {
        if (jQuery.trim(jQuery("#txtSearchMaintType").val()) != "") {
            masterDataFilterInfo.SearchString = jQuery.trim(jQuery("#txtSearchMaintType").val());
        }
    }

    if (jQuery("#hdfSortValue").val() != "") {
        masterDataFilterInfo.SortType = jQuery("#hdfSortValue").val();
    }

    jQuery.ajax({
        type: "POST",
        url: jQuery.EquipmentModelNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetMaintMasterDataWithPager",
        data: JSON.stringify({ pagerData: pagerData, basicParam: jQuery.EquipmentModelNamespace.BasicParam, masterDataFilterInfo: masterDataFilterInfo }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        success: function (json) {
            maintenanceTypeUpdateViewModel.DefaultMaintenanceTypesArray([]);
            if (json != undefined && json.d != undefined) {
                if (json.d.MasterDataInfoList.length == 0) {
                    maintenanceTypeUpdateViewModel.LoadErrorMessage(languageResource.resMsg_NoRecordFound);
                    maintenanceTypeUpdateViewModel.LoadErrorMessageClass('');
                    maintenanceTypeUpdateViewModel.LoadErrorMessageVisible(true);
                }
                else {
                    maintenanceTypeUpdateViewModel.MaintTypePagerData(json.d.HTMLPager);
                    maintenanceTypeUpdateViewModel.DefaultMaintenanceTypesArray(json.d.MasterDataInfoList);
                }
            }
            else {
                maintenanceTypeUpdateViewModel.LoadErrorMessage(languageResource.resMsg_FailedToLoadMaintTypeInfo.replace("[XXX]", jQuery.EquipmentModelNamespace.SelectedMasterDataMessage.toLowerCase().toString()));
                maintenanceTypeUpdateViewModel.LoadErrorMessageClass('red');
                maintenanceTypeUpdateViewModel.LoadErrorMessageVisible(true);
            }
        },
        beforeSend: function () {
            maintenanceTypeUpdateViewModel.LoadErrorMessageVisible(false);
            maintenanceTypeUpdateViewModel.MaintTypePagerData('');
            jQuery("#divMaintTypesProgress").show();
        },
        complete: function () {
            jQuery("#divMaintTypesProgress").hide();
        },
        error: function (request, error) {
            maintenanceTypeUpdateViewModel.LoadErrorMessageClass('red');
            maintenanceTypeUpdateViewModel.LoadErrorMessageVisible(true);
            var errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadMaintTypeInfo.replace("[XXX]", jQuery.EquipmentModelNamespace.SelectedMasterDataMessage.toLowerCase().toString());
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    errorMessage = languageResource.resMsg_Error + errorMsg.Message;
            }
            maintenanceTypeUpdateViewModel.LoadErrorMessage(errorMessage);
        }
    });
}

function ShowEditMaintTypes(maintMasterData) {
    jQuery("#txtNewMaintType").val(maintMasterData.MasterDataName);
    jQuery("#txtMasterDescription").val(maintMasterData.Description);
    jQuery("#txtMasterDescription").autoResize();
    var btnAddMaintType = jQuery.EquipmentModelNamespace.MaintTypePagerData.LoadControlID.replace("btnAddUpdateEquipmentModel", "btnAddMaintType");
    jQuery("#" + btnAddMaintType).text(languageResource.resMsg_Update);
    if (jQuery.EquipmentModelNamespace.MaintTypePagerData.PageAccessRights.toLowerCase() == "full_access" || jQuery.EquipmentModelNamespace.MaintTypePagerData.PageAccessRights.toLowerCase() == "edit_only") {
        jQuery("#" + btnAddMaintType).removeAttr('disabled');
        jQuery("#" + btnAddMaintType).prop("onclick", null);
        jQuery("#" + btnAddMaintType).unbind('click');
        jQuery("#" + btnAddMaintType).bind("click", function () { InsertOrUpdateMaintType(maintMasterData.MasterDataID); return false; });
    }
    else {
        jQuery("#" + btnAddMaintType).attr('disabled', 'disabled');
    }
}

function DeleteMaintTypeClick(maintTypeID) {
    jQuery("#alertMessage").removeClass("text-danger");
    jQuery("#alertMessage").html(languageResource.resMsg_DeleteMaintTypeConfirm.replace("[XXX]", jQuery.EquipmentModelNamespace.SelectedMasterDataMessage.toLowerCase().toString()));
    jQuery("#alertModal").dialog({
        zIndex: 1060,
        closeOnEscape: false,
        open: function (event, ui) {
            jQuery(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
            jQuery(".ui-widget-overlay").css('z-index', '10043');
        },
        modal: true,
        buttons: [
            {
                text: languageResource.resMsg_Confirm,
                click: function () {
                    jQuery("#alertModal").dialog("close");
                    DeleteMaintTypeInfo(maintTypeID);
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

function DeleteMaintTypeInfo(maintTypeID) {
    var masterDataInfo = {};
    masterDataInfo.MasterDataID = maintTypeID;

    jQuery.ajax({
        type: "POST",
        url: jQuery.EquipmentModelNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/DeleteMasterData",
        data: JSON.stringify({ basicParam: jQuery.EquipmentModelNamespace.BasicParam, masterDataInfo: masterDataInfo }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if (json.d != undefined && json.d != null && json.d > 0) {
                if (json.d == 2) {
                    ClearMaintenanceTypeInfo(true);
                    LoadMaintTypesInfo(jQuery.EquipmentModelNamespace.MaintTypePagerData);
                }
                else if (json.d == 1) {
                    var msg = languageResource.resMsg_MaterDataInfoInUse.replace("[XXX]", jQuery.EquipmentModelNamespace.SelectedMasterDataMessage.toLowerCase().toString());
                    ShowErrorMessage(msg, true);
                }
                LoadMasterDropDownList(false, jQuery.EquipmentModelNamespace.SelectedMasterDataType);
            }
            else {
                var msg = languageResource.resMsg_FailedToDeleteMaintTypeInfo.replace("[XXX]", jQuery.EquipmentModelNamespace.SelectedMasterDataMessage.toLowerCase().toString());
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
                    msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToDeleteMaintTypeInfo.replace("[XXX]", jQuery.EquipmentModelNamespace.SelectedMasterDataMessage.toLowerCase().toString());
            }
            else {
                msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToDeleteMaintTypeInfo.replace("[XXX]", jQuery.EquipmentModelNamespace.SelectedMasterDataMessage.toLowerCase().toString());
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
    jQuery("#alertModal").dialog({
        modal: true,
        buttons: [
            {
                text: languageResource.resMsg_BtnOK,
                click: function () {
                    jQuery("#alertModal").dialog("close");
                }
            }
        ]
    });
}

function InsertOrUpdateMaintType(maintTypeID) {
    jQuery("#spnAddMaintTypeError").removeClass('text-danger').removeClass('text-info');
    jQuery("#spnAddMaintTypeError").text('');
    if (jQuery.trim(jQuery("#txtNewMaintType").val()).length == 0) {
        jQuery("#spnAddMaintTypeError").addClass('text-danger');
        jQuery("#spnAddMaintTypeError").text(languageResource.resMsg_EnterMaintType.replace("[XXX]", jQuery.EquipmentModelNamespace.SelectedMasterDataMessage.toLowerCase().toString()));
    }
    else {
        var masterDataInfo = {};
        masterDataInfo.MasterDataID = maintTypeID;
        masterDataInfo.MasterDataName = jQuery.trim(jQuery("#txtNewMaintType").val());
        masterDataInfo.MasterDataType = jQuery.EquipmentModelNamespace.SelectedMasterDataType;
        masterDataInfo.Description = jQuery.trim(jQuery("#txtMasterDescription").val());
        jQuery.ajax({
            type: "POST",
            url: jQuery.EquipmentModelNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/InsertUpdateMasterData",
            data: JSON.stringify({ basicParam: jQuery.EquipmentModelNamespace.BasicParam, masterDataInfo: masterDataInfo }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                jQuery("#spnAddMaintTypeError").removeClass('text-danger').removeClass('text-info');
                if (json.d != undefined && json.d != null && json.d > 0) {
                    jQuery("#txtNewMaintType").val("");
                    jQuery("#txtMasterDescription").val("");
                    jQuery("#txtMasterDescription").autoResize();
                    var btnAddMaintType = jQuery.EquipmentModelNamespace.MaintTypePagerData.LoadControlID.replace("btnAddUpdateEquipmentModel", "btnAddMaintType");
                    jQuery("#" + btnAddMaintType).text(languageResource.resMsg_Add);
                    if (jQuery.EquipmentModelNamespace.MaintTypePagerData.PageAccessRights.toLowerCase() == "full_access") {
                        jQuery("#" + btnAddMaintType).removeAttr('disabled');
                        jQuery("#" + btnAddMaintType).prop("onclick", null);
                        jQuery("#" + btnAddMaintType).unbind('click');
                        jQuery("#" + btnAddMaintType).bind("click", function () { InsertOrUpdateMaintType(0); return false; });
                    }
                    else {
                        jQuery("#" + btnAddMaintType).attr('disabled', 'disabled');
                    }
                    jQuery("#spnAddMaintTypeError").addClass('text-info');
                    if (json.d == maintTypeID)
                        jQuery("#spnAddMaintTypeError").text(languageResource.resMsg_UpdatedMaintType.replace("[XXX]", jQuery.EquipmentModelNamespace.SelectedMasterDataMessage.toLowerCase().toString()));
                    else
                        jQuery("#spnAddMaintTypeError").text(languageResource.resMsg_InsertedMaintType.replace("[XXX]", jQuery.EquipmentModelNamespace.SelectedMasterDataMessage.toLowerCase().toString()));
                    LoadMaintTypesInfo(jQuery.EquipmentModelNamespace.MaintTypePagerData);
                    LoadMasterDropDownList(false, jQuery.EquipmentModelNamespace.SelectedMasterDataType)
                    if (jQuery.EquipmentModelNamespace.SelectedMasterDataType == jQuery.EquipmentModelNamespace.MasterDataType.Manufacturer) {
                        equipmentViewModel.SelectedManufacturer(json.d);
                        jQuery("#drpModelManufacturer").select2();
                    }
                    else if (jQuery.EquipmentModelNamespace.SelectedMasterDataType == jQuery.EquipmentModelNamespace.MasterDataType.EquipmentType) {
                        equipmentViewModel.SelectedModelType(json.d);
                        jQuery("#drpModelType").select2();
                    }
                    else if (jQuery.EquipmentModelNamespace.SelectedMasterDataType == jQuery.EquipmentModelNamespace.MasterDataType.EquipmentClass) {
                        equipmentViewModel.SelectedModelClass(json.d);
                        jQuery("#drpModelClass").select2();
                    }
                }
                else {
                    if (json.d == -3) {
                        jQuery("#spnAddMaintTypeError").addClass('text-danger');
                        jQuery("#spnAddMaintTypeError").text(languageResource.resMsg_MaintenanceTypeAlreadyExists.replace("[XXX]", jQuery.EquipmentModelNamespace.SelectedMasterDataMessage.toLowerCase().toString()));
                    }
                    else {
                        var msg = languageResource.resMsg_FailedToInsertMaintTypeInfo.replace("[XXX]", jQuery.EquipmentModelNamespace.SelectedMasterDataMessage.toLowerCase().toString());
                        jQuery("#spnAddMaintTypeError").addClass('text-danger');
                        jQuery("#spnAddMaintTypeError").text(msg);
                    }
                }
            },
            error: function (request, error) {
                var msg;
                if (request.responseText != "") {
                    var errorMsg = request.responseText;//jQuery.parseJSON(request.responseText);
                    if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                        msg = languageResource.resMsg_Error + errorMsg.Message;
                    else
                        msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToInsertMaintTypeInfo.replace("[XXX]", jQuery.EquipmentModelNamespace.SelectedMasterDataMessage.toLowerCase().toString());
                }
                else {
                    msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToInsertMaintTypeInfo.replace("[XXX]", jQuery.EquipmentModelNamespace.SelectedMasterDataMessage.toLowerCase().toString());
                }
                jQuery("#spnAddMaintTypeError").removeClass("text-info").addClass('text-danger');
                jQuery("#spnAddMaintTypeError").text(msg);
            },
        });
    }
}

function SortMaintTypesTabs(thValue, value) {
    var thClass = "";    
    var hasSortUpClassExist = jQuery("#" + thValue + " i").hasClass('fa-sort-up');
    var hasSortDownExist = jQuery("#" + thValue + " i").hasClass('fa-sort-down');

    if (hasSortUpClassExist == false && hasSortDownExist == false) {
        jQuery(".fa-sort-down").removeClass('fa fa-sort-down');
        jQuery(".fa-sort-up").removeClass('fa fa-sort-up');

        jQuery("#" + thValue + " i").addClass('fa fa-sort-up');
        thClass = value + "_asc";
        jQuery("#hdfSortValue").val(thClass); 
        LoadMaintTypesInfo(jQuery.EquipmentModelNamespace.MaintTypePagerData);
        
        return false;
    }
    if (jQuery("#" + thValue + " i").hasClass('fa-sort-up')) {
        jQuery(".fa-sort-down").removeClass('fa fa-sort-down');
        jQuery(".fa-sort-up").removeClass('fa fa-sort-up');

        jQuery("#" + thValue + " i").addClass('fa fa-sort-down');
        thClass = value + "_desc";
        jQuery("#hdfSortValue").val(thClass);
        LoadMaintTypesInfo(jQuery.EquipmentModelNamespace.MaintTypePagerData);

        return false;
    }
    if (jQuery("#" + thValue + " i").hasClass('fa-sort-down')) {
        jQuery(".fa-sort-down").removeClass('fa fa-sort-down');
        jQuery(".fa-sort-up").removeClass('fa fa-sort-up');

        jQuery("#" + thValue + " i").addClass('fa fa-sort-up');
        thClass = value + "_asc";
        jQuery("#hdfSortValue").val(thClass);
        LoadMaintTypesInfo(jQuery.EquipmentModelNamespace.MaintTypePagerData);
        
        return false;
    }
}

function SortByEquipmentModelName(thValue, value) {
    var thClass = "";
    var hasSortUpClassExist = jQuery("#" + thValue + " i").hasClass('fa fa-long-arrow-up');
    var hasSortDownExist = jQuery("#" + thValue + " i").hasClass('fa fa-long-arrow-down');

    if (hasSortUpClassExist == false && hasSortDownExist == false) { 
        jQuery(".fa-long-arrow-down").removeClass('fa fa-long-arrow-down');
        jQuery(".fa-long-arrow-up").removeClass('fa fa-long-arrow-up');

        jQuery("#" + thValue + " i").addClass('fa fa-long-arrow-up');
        thClass = value + "_asc";
        jQuery("#hdnSortbyNameValue").val(thClass);
        LoadEquipmentModelList(jQuery.EquipmentModelNamespace.PagerData);

        return false;
    }
    if (jQuery("#" + thValue + " i").hasClass('fa fa-long-arrow-up')) {
        jQuery(".fa-long-arrow-down").removeClass('fa fa-long-arrow-down');
        jQuery(".fa-long-arrow-up").removeClass('fa fa-long-arrow-up');

        jQuery("#" + thValue + " i").addClass('fa fa-long-arrow-down');
        thClass = value + "_desc";
        jQuery("#hdnSortbyNameValue").val(thClass);
        LoadEquipmentModelList(jQuery.EquipmentModelNamespace.PagerData);
        
        return false;
    }
    if (jQuery("#" + thValue + " i").hasClass('fa-long-arrow-down')) {
        jQuery(".fa-long-arrow-down").removeClass('fa fa-long-arrow-down');
        jQuery(".fa-long-arrow-up").removeClass('fa fa-long-arrow-up');

        jQuery("#" + thValue + " i").addClass('fa fa-long-arrow-up');
        thClass = value + "_asc";
        jQuery("#hdnSortbyNameValue").val(thClass);
        LoadEquipmentModelList(jQuery.EquipmentModelNamespace.PagerData);
        
        return false;
    }
}