jQuery.AddEquipmentNamespace = jQuery.AddEquipmentNamespace || {};
jQuery.AddEquipmentNamespace.BasicParam = jQuery.AddEquipmentNamespace.BasicParam || {};
jQuery.AddEquipmentNamespace.ModelPagerData = jQuery.AddEquipmentNamespace.ModelPagerData || {};
jQuery.AddEquipmentNamespace.PagerData = jQuery.AddEquipmentNamespace.PagerData || {};
jQuery.AddEquipmentNamespace.MaintTypePagerData = jQuery.AddEquipmentNamespace.MaintTypePagerData || {};
jQuery.AddEquipmentNamespace.MasterDataType = { "Manufacturer": 'MANUFACTURER', "EquipmentType": 'TYPE', "EquipmentClass": 'CLASS' };
jQuery.AddEquipmentNamespace.SelectedMasterDataType = "";
jQuery.AddEquipmentNamespace.SelectedMasterDataMessage = "";
jQuery.AddEquipmentNamespace.SupportType = { "In_House": 'H', "Third_Party": 'T', };
jQuery.AddEquipmentNamespace.InfoType = { "Equipment_Model": 'M', "Equipment": 'E', "Measuring_Point": 'P', "None": 'N' };
jQuery.AddEquipmentNamespace.AdditionalLinksType = { "MeasuringPoint": 'P', "Document": 'D', "FunctionalLocation": 'L' };
jQuery.AddEquipmentNamespace.BasePath = "";
jQuery.AddEquipmentNamespace.WebServicePath = "";
jQuery.AddEquipmentNamespace.ImgDefaultProfilePath = "";
jQuery.AddEquipmentNamespace.UploaderPath = '';
jQuery.AddEquipmentNamespace.DateFormat = '';
jQuery.AddEquipmentNamespace.EquipmentImageName = '';
jQuery.AddEquipmentNamespace.EquipmentImagePath = '';
jQuery.AddEquipmentNamespace.IsSearch = false;
jQuery.AddEquipmentNamespace.FLocationID = "";
jQuery.AddEquipmentNamespace.IsChanged = true;
jQuery.AddEquipmentNamespace.isPageLoad = true;
jQuery.AddEquipmentNamespace.AssignedWorkGroupInfo = [];
jQuery.AddEquipmentNamespace.ParentEquipmentID = 0;
jQuery.AddEquipmentNamespace.LocationID = 0;

var addEquipmentViewModel = {
    EquipmentImgPath: ko.observable(''),
    EquipmentImageExist : false ,
    HasEditAccess: false,
    HasDeleteAccess: false,
    ParentEquipmentList: ko.observableArray([]),
    EquipmentInfoArray: ko.observableArray([]),
    FunctionalLocationArray: ko.observableArray([]),
    ResourceListArray: ko.observableArray([]),
    ManufacturerArray: ko.observableArray([]),
    EquipmentTypeArray: ko.observableArray([]),
    EquipmentClassArray: ko.observableArray([]),
    SupportTypeArray: ko.observableArray([]),
    EquipmentModelArray: ko.observableArray([]),
    ModelPagerContent: ko.observable(''),
    SelectFunctionalLocationFilter: ko.observable(0),
    DrpDownFunctionalLocationFlag: ko.observable(false),
    EquipmentID: ko.observable(0),
    EquipmentCode: ko.observable(''),
    EquipmentName: ko.observable(''),
    EquipmentDesc: ko.observable(''),
    SelectedFunctionLocation: ko.observable(0),
    SelectedResource: ko.observable(0),
    SelectedParentEquipment: ko.observable(0),
    CheckReferModel: ko.observable(false),
    SelectedModel: ko.observable(0),
    ModelNumber: ko.observable(''),
    ModelName: ko.observable(''),
    SerialNumber: ko.observable(''),
    SelectedManufacture: ko.observable(0),
    SelectedCategory: ko.observable(0),
    SelectedClass: ko.observable(0),
    WarrantyNumber: ko.observable(''),
    WarrantyStartDate: ko.observable(''),
    WarrantyExpireDate: ko.observable(''),
    PurchaseDate: ko.observable(''),
    InstallDate: ko.observable(''),
    SupportInfoList: ko.observableArray([]),
    addNewRow: function () {
        var newSupportInfo = new AddNewSupportRow();
        this.SupportInfoList.push(newSupportInfo);
        resizeIframe(45)
    },
    LoadErrorMessageVisible: ko.observable(false),
    LoadErrorMessage: ko.observable(''),
    PagerContent: ko.observable(''),
    BtnGenerateCode: ko.observable(true),
    LoadErrorMessageClass: ko.observable(''),
    WorkGroupList: ko.observableArray([]),
    SelectedWorkGroupInfoList: ko.observableArray([])
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

addEquipmentViewModel.SelectedFunctionLocation.subscribe(function (newValue) {
    if (newValue != null && newValue != undefined)
        BindWorkSelectedWorkGroup();
});


addEquipmentViewModel.SelectedParentEquipment.subscribe(function (newValue) {
    if (newValue != null && newValue != undefined)
        BindWorkSelectedWorkGroup();
});

function LoadEquipmentBasicInfo(basicParam, pagerData, maintTypePagerData, modelPagerData, basePath, webServicePath, equipmentID, hasEditAccess, hasDeleteAccess, imagePathInfo, fLocationID, hdfDatePickerFormat) {
    jQuery.AddEquipmentNamespace.BasicParam = basicParam;
    jQuery.AddEquipmentNamespace.BasePath = basePath;
    jQuery.AddEquipmentNamespace.WebServicePath = webServicePath;
    jQuery.AddEquipmentNamespace.ImgDefaultProfilePath = imagePathInfo.ImgDefaultProfilePath;
    jQuery.AddEquipmentNamespace.UploaderPath = imagePathInfo.UploaderPath;
    jQuery.AddEquipmentNamespace.EquipmentImagePath = imagePathInfo.EquipmentImgPath;
    jQuery.AddEquipmentNamespace.FLocationID = parseInt(fLocationID);
    InitiateDatePicker(hdfDatePickerFormat)

    jQuery.AddEquipmentNamespace.PagerData = pagerData;
    jQuery.AddEquipmentNamespace.ModelPagerData = modelPagerData;
    jQuery.AddEquipmentNamespace.MaintTypePagerData = maintTypePagerData;
    addEquipmentViewModel.EquipmentID(equipmentID);

    addEquipmentViewModel.HasDeleteAccess = hasDeleteAccess.toLowerCase() === "true" ? true : false;
    addEquipmentViewModel.HasEditAccess = hasEditAccess.toLowerCase() === "true" ? true : false;

    if (addEquipmentViewModel.EquipmentID() == 0) {
        addEquipmentViewModel.EquipmentImgPath(jQuery.AddEquipmentNamespace.ImgDefaultProfilePath);
    }

    if (hasEditAccess.toLowerCase() != "true")
        jQuery("#imageFileToUpload").attr('disabled', 'disabled');

    if (equipmentID == 0) {
        jQuery("#btnSaveEquipment").html(languageResource.resMsg_SaveandAddMore);
        if (addEquipmentViewModel.HasEditAccess && !addEquipmentViewModel.HasDeleteAccess)
            jQuery("#btnSaveEquipment").addClass('disabled');
    }
    else {
        jQuery("#btnSaveEquipment").html(languageResource.resMsg_Update);
        if (!addEquipmentViewModel.HasEditAccess && !addEquipmentViewModel.HasDeleteAccess)
            jQuery("#btnSaveEquipment").addClass('disabled');
    }

    ko.applyBindings(maintenanceTypeUpdateViewModel, document.getElementById("divAddMaintenanceMasterDataModal"));
    ko.applyBindings(addEquipmentViewModel, document.getElementById("divEquipmentArea"));

    BindSupportType(jQuery.AddEquipmentNamespace.isPageLoad);
    jQuery('.select2').select2();

    GetUserWorkGroupInfo();
    BindDropdownFunctionalLocationFilter();
    BindResourceInfo();
    BindMaintenanceMasterInfo(jQuery.AddEquipmentNamespace.isPageLoad);
    BindParentEquipmentInfo();
    LoadAllEquipmentInfo(jQuery.AddEquipmentNamespace.PagerData);
    if (addEquipmentViewModel.EquipmentID() > 0)
        SelectedEquipmentList(addEquipmentViewModel.EquipmentID());
    addEquipmentViewModel.DrpDownFunctionalLocationFlag(true);
    jQuery.AddEquipmentNamespace.isPageLoad = false;
}

//Binding all maintenance master list
function BindMaintenanceMasterInfo(isPageLoad, masterDataType) {
    var masterDataDropDownListFilterInfo = {}
    masterDataDropDownListFilterInfo.MasterDataTypeList = [];
    if (isPageLoad || masterDataType == jQuery.AddEquipmentNamespace.MasterDataType.Manufacturer)
        masterDataDropDownListFilterInfo.MasterDataTypeList.push(jQuery.AddEquipmentNamespace.MasterDataType.Manufacturer);
    if (isPageLoad || masterDataType == jQuery.AddEquipmentNamespace.MasterDataType.EquipmentType)
        masterDataDropDownListFilterInfo.MasterDataTypeList.push(jQuery.AddEquipmentNamespace.MasterDataType.EquipmentType);
    if (isPageLoad || masterDataType == jQuery.AddEquipmentNamespace.MasterDataType.EquipmentClass)
        masterDataDropDownListFilterInfo.MasterDataTypeList.push(jQuery.AddEquipmentNamespace.MasterDataType.EquipmentClass);
   masterDataDropDownListFilterInfo.SortType = "MasterDataName_asc"; 

    jQuery.ajax({
        type: "POST",
        url: jQuery.AddEquipmentNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/GetAllMaintMasterDropDownDataInfo",
        data: JSON.stringify({ basicParam: jQuery.AddEquipmentNamespace.BasicParam, masterDataDropDownListFilterInfo: masterDataDropDownListFilterInfo }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (json) {
            if (json != undefined && json.d != null) {
                var indexInfo = {};
                indexInfo.TypeValue = 0;
                var masterDataDropDownList = json.d;
                if (isPageLoad || masterDataType == jQuery.AddEquipmentNamespace.MasterDataType.Manufacturer) {
                    indexInfo.DisplayName = languageResource.resMsg_SelectManufacturer;
                    addEquipmentViewModel.ManufacturerArray.removeAll();
                    addEquipmentViewModel.ManufacturerArray.push(indexInfo);
                    jQuery.each(masterDataDropDownList.ManufacturerInfoList, function (i, masterData) {
                        masterDataInfo = {};
                        masterDataInfo.TypeValue = masterData.TypeValue;
                        masterDataInfo.DisplayName = masterData.DisplayName;
                        addEquipmentViewModel.ManufacturerArray.push(masterDataInfo);
                    });
                    jQuery("#drpManufacturer").select2();
                }
                if (isPageLoad || masterDataType == jQuery.AddEquipmentNamespace.MasterDataType.EquipmentType) {
                    indexInfo.DisplayName = languageResource.resMsg_SelectEquipmentType;
                    addEquipmentViewModel.EquipmentTypeArray.removeAll();
                    addEquipmentViewModel.EquipmentTypeArray.push(indexInfo);
                    jQuery.each(masterDataDropDownList.CategoryInfoList, function (i, masterData) {
                        masterDataInfo = {};
                        masterDataInfo.TypeValue = masterData.TypeValue;
                        masterDataInfo.DisplayName = masterData.DisplayName;
                        addEquipmentViewModel.EquipmentTypeArray.push(masterDataInfo);
                    });
                    jQuery("#drpEquipmentType").select2();
                }
                if (isPageLoad || masterDataType == jQuery.AddEquipmentNamespace.MasterDataType.EquipmentClass) {
                    indexInfo.DisplayName = languageResource.resMsg_SelectEquipmentClass;
                    addEquipmentViewModel.EquipmentClassArray.removeAll();
                    addEquipmentViewModel.EquipmentClassArray.push(indexInfo);
                    jQuery.each(masterDataDropDownList.ClassInfoList, function (i, masterData) {
                        masterDataInfo = {};
                        masterDataInfo.TypeValue = masterData.TypeValue;
                        masterDataInfo.DisplayName = masterData.DisplayName;
                        addEquipmentViewModel.EquipmentClassArray.push(masterDataInfo);
                    });
                    jQuery("#drpEquipmentClass").select2();
                }
            }
            else {
                var errorMsg = languageResource.resMsg_Error + languageResource.resMsg_FailedToBindMaintenanceMasterInfo;
                ShowErrorMessage(errorMsg, true);
            }
        },
        beforeSend: function () {
        },
        error: function (request, error) {
            var msg;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    msg = languageResource.resMsg_Error + errorMsg.Message;
                else
                    msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToBindMaintenanceMasterInfo;
            }
            else {
                msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToBindMaintenanceMasterInfo;
            }
            ShowErrorMessage(msg, true);
        }
    });
}

function GetUserWorkGroupInfo() {
    jQuery.ajax({
        type: "POST",
        url: jQuery.AddEquipmentNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/GetUserWorkGroups",
        data: JSON.stringify({ basicParam: jQuery.AddEquipmentNamespace.BasicParam }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        async: false,
        success: function (json) {
            if (json != undefined && json.d != undefined) {
                ko.utils.arrayForEach(json.d, function (item, index) {
                    addEquipmentViewModel.WorkGroupList.push(item);
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
                        addEquipmentViewModel.SelectedWorkGroupInfoList.push(item);
                    }
                    else {
                        addEquipmentViewModel.SelectedWorkGroupInfoList.remove(function (item) {
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

function BindDropdownFunctionalLocationFilter() {
    var locationFilterInfo = {};
    locationFilterInfo.SiteID = jQuery.AddEquipmentNamespace.BasicParam.SiteID;
    locationFilterInfo.UserID = jQuery.AddEquipmentNamespace.BasicParam.UserID;
    jQuery.ajax({
        type: "POST",
        url: jQuery.AddEquipmentNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/GetAllFunctionalLocInfo",
        data: JSON.stringify({ pagerData: null, locationFilterInfo: locationFilterInfo }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        async: false,
        success: function (json) {
            if (json != undefined && json.d != null) {
                var locationInfo = {};
                locationInfo.TypeValue = 0;
                locationInfo.DisplayName = languageResource.resMsg_SelectFunctionalLocation;
                addEquipmentViewModel.FunctionalLocationArray.push(locationInfo);
                jQuery.each(json.d.FunctionalLocationList, function (i, fLocation) {
                    var fLocationInfo = {};
                    fLocationInfo.TypeValue = fLocation.FunctionalLocationID;
                    fLocationInfo.DisplayName = fLocation.FunctionalLocationName;
                    fLocationInfo.AssignedWorkGroupList = fLocation.AssignedWorkGroupList;
                    addEquipmentViewModel.FunctionalLocationArray.push(fLocationInfo);
                });

                if (jQuery.AddEquipmentNamespace.FLocationID != 0) {
                    addEquipmentViewModel.SelectFunctionalLocationFilter(jQuery.AddEquipmentNamespace.FLocationID);
                    addEquipmentViewModel.SelectedFunctionLocation(jQuery.AddEquipmentNamespace.FLocationID);
                }

                jQuery("#drpFunctionLocation").select2();
                jQuery("#drpFilterFunctionalLocation").select2();
            }
            else {
                var errorMsg = languageResource.resMsg_Error + languageResource.resMsg_FailedToBindFunctionalLocationList;
                ShowErrorMessage(errorMsg, true);
            }
        },
        beforeSend: function () {
            addEquipmentViewModel.FunctionalLocationArray.removeAll();
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
                    msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToBindFunctionalLocationList;
            }
            else {
                msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToBindFunctionalLocationList;
            }
            ShowErrorMessage(msg, true);
        }
    });
}

function BindResourceInfo() {
    jQuery.ajax({
        type: "POST",
        url: jQuery.AddEquipmentNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/GetResourceInfo",
        data: JSON.stringify({ basicParam: jQuery.AddEquipmentNamespace.BasicParam }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (json) {
            if (json != undefined && json.d != null) {
                var resourceInfo = {};
                resourceInfo.Value = 0;
                resourceInfo.Key = languageResource.resMsg_SelectResource;
                addEquipmentViewModel.ResourceListArray.push(resourceInfo);
                jQuery.each(json.d, function (i, resourceData) {
                    resourceInfo = {};
                    resourceInfo.Key = resourceData.Key;
                    resourceInfo.Value = resourceData.Value;
                    addEquipmentViewModel.ResourceListArray.push(resourceInfo);
                });
                jQuery("#drpResource").select2();
            }
            else {
                var errorMsg = languageResource.resMsg_Error + languageResource.resMsg_FailedToBindResourceListInfo;
                ShowErrorMessage(errorMsg, true);
            }
        },
        beforeSend: function () {
            addEquipmentViewModel.ResourceListArray.removeAll();
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
                    msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToBindResourceListInfo;
            }
            else {
                msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToBindResourceListInfo;
            }
            ShowErrorMessage(msg, true);
        }
    });
}

function BindParentEquipmentInfo() {
    var equipmentFilterInfo = {};
    equipmentFilterInfo.SiteID = jQuery.AddEquipmentNamespace.BasicParam.SiteID;
    equipmentFilterInfo.UserID = jQuery.AddEquipmentNamespace.BasicParam.UserID;
    equipmentFilterInfo.InfoType = jQuery.AddEquipmentNamespace.InfoType.Equipment.charCodeAt();
    equipmentFilterInfo.EquipmentID = addEquipmentViewModel.EquipmentID();

    jQuery.ajax({
        type: "POST",
        url: jQuery.AddEquipmentNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/GetParentEquipmentListDropDown",
        data: JSON.stringify({ parentEquipmentFilter: equipmentFilterInfo }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (json) {
            if (json != undefined && json.d != null) {
                var indexInfo = {};
                indexInfo.EquipmentID = 0;
                indexInfo.EquipmentName = languageResource.resMsg_SelectEquipment;
                addEquipmentViewModel.ParentEquipmentList.push(indexInfo);
                jQuery.each(json.d, function (i, equipmentData) {
                    var equipmentInfo = {};
                    equipmentInfo.EquipmentID = equipmentData.EquipmentID;
                    equipmentInfo.EquipmentName = equipmentData.EquipmentName;
                    equipmentInfo.AssignedWorkGroupList = equipmentData.AssignedWorkGroupList;
                    equipmentInfo.FunctionalLocationID = equipmentData.FunctionalLocationID;
                    if (equipmentData.EquipmentID != addEquipmentViewModel.EquipmentID()) {
                        addEquipmentViewModel.ParentEquipmentList.push(equipmentInfo);
                    }
                });
                jQuery("#drpEquipment").select2();
            }
            else {
                var errorMsg = languageResource.resMsg_Error + languageResource.resMsg_FailedToBindEquipmentList;
                ShowErrorMessage(errorMsg, true);
            }
        },
        beforeSend: function () {
            addEquipmentViewModel.ParentEquipmentList.removeAll();
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
                    msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToBindEquipmentList;
            }
            else {
                msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToBindEquipmentList;
            }
            ShowErrorMessage(msg, true);
        }
    });
}

function BindSupportType(isPageLoad) {
    if (isPageLoad) {
        jQuery.each(jQuery.AddEquipmentNamespace.SupportType, function (index, enumValue) {
            var itemInfo = {};
            itemInfo.TypeValue = enumValue;
            itemInfo.DisplayName = index.replace("_", " ");
            addEquipmentViewModel.SupportTypeArray.push(itemInfo);
        });
    }
    addEquipmentViewModel.SupportInfoList.removeAll();
    var newSupportInfo = new AddNewSupportRow();
    addEquipmentViewModel.SupportInfoList.push(newSupportInfo);
    var totalRowCount = jQuery('#tbSupport tr').length;
    if (totalRowCount == 1) {
        jQuery('#tbSupport tr  td:nth-child(5)').hide();//to hide delete column
        jQuery('#tblSupport tr th:nth-child(5)').hide();
    }
    else {
        jQuery('#tbSupport tr  td:nth-child(5)').show();
        jQuery('#tblSupport tr th:nth-child(5)').show();
    }
    setTimeout(function () {        
        oldHeight = window.parent.jQuery("iframe").height();
        newHeight = jQuery("#divEquipmentArea").height();
        if (oldHeight < newHeight) {
            newHeight = newHeight + 50;
            window.parent.jQuery("iframe").css("height", newHeight);
        }
        else
            window.parent.jQuery("iframe").css("height", oldHeight);
    }, 1000)
}

function GenerateEquipmentCode() {
    jQuery.ajax({
        type: "POST",
        url: jQuery.AddEquipmentNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/GenerateRandomCode",
        data: JSON.stringify({ basicParam: jQuery.AddEquipmentNamespace.BasicParam, infoType: jQuery.AddEquipmentNamespace.InfoType.Equipment.charCodeAt() }),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (json) {
            if (json.d != undefined) {
                addEquipmentViewModel.EquipmentCode(json.d);
                addEquipmentViewModel.BtnGenerateCode(false);
            }
            else {
                ShowErrorMessage(languageResource.resMsg_FailedToLoadEquipmentCode);
            }
        },
        error: function (request, error) {
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                    ShowErrorMessage(languageResource.resMsg_Error + errorMsg.Message);
                else
                    ShowErrorMessage(languageResource.resMsg_FailedToLoadEquipmentCode);
            }
            else {
                ShowErrorMessage(languageResource.resMsg_FailedToLoadEquipmentCode);
            }
        }
    });
}

function ClearGenerateEquipmentCode() {
    addEquipmentViewModel.BtnGenerateCode(true);
    addEquipmentViewModel.EquipmentCode('');
}  

//To get equipment information and also equipment list 
var value;
function LoadAllEquipmentInfo(pagerData) {
    var equipmentFilterInfo = {};
    equipmentFilterInfo.SiteID = jQuery.AddEquipmentNamespace.BasicParam.SiteID;
    equipmentFilterInfo.UserID = jQuery.AddEquipmentNamespace.BasicParam.UserID;
    equipmentFilterInfo.InfoType = jQuery.AddEquipmentNamespace.InfoType.Equipment.charCodeAt();
    equipmentFilterInfo.SearchLocationIDs = addEquipmentViewModel.SelectFunctionalLocationFilter();
    equipmentFilterInfo.ConsiderEquipmentList = true;
    equipmentFilterInfo.PageSize = pagerData.PageSize;
    equipmentFilterInfo.PageIndex = pagerData.PageIndex;  

    var searchEquipmentName = jQuery.trim(jQuery("#txtSearchEquipment").val());
    if (searchEquipmentName.length > 0)
        equipmentFilterInfo.SerachNameOrCode = searchEquipmentName;

    if (jQuery.AddEquipmentNamespace.isPageLoad == true) {
        equipmentFilterInfo.EquipmentID = addEquipmentViewModel.EquipmentID();
    }

    if (jQuery("#hdnSortbyNameValue").val() != "") {
        equipmentFilterInfo.SortType = jQuery("#hdnSortbyNameValue").val();
    }

    //Dynamic pagerdata
    var totPageHeight = 800;
    var functionalLocationPos = jQuery("#fieldsetEquipmentList").offset().top - 8;
    fLocationMaxHeight = totPageHeight - functionalLocationPos;
    if (jQuery(window).width() < 768)
        fLocationMaxHeight = 500;
    if (true) {
        value = value || Math.floor(fLocationMaxHeight / 75);
        equipmentFilterInfo.PageSize = value;
        pagerData.PageSize = value;
    }

    jQuery.ajax({
        type: "POST",
        url: jQuery.AddEquipmentNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/GetEquipmentInfoList",
        data: JSON.stringify({ pagerData: pagerData, equipmentFilterInfo: equipmentFilterInfo }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (json) {
            jQuery("#divLoadProgressVisible").addClass('hide');
            if (json != undefined && json.d != null) {
                var equipmentInfoList = json.d.EquipmentDetailList;
                if (equipmentInfoList.EquipmentList.length > 0) {
                    var equipmentList = equipmentInfoList.EquipmentList;
                    ko.utils.arrayForEach(equipmentList, function (item) {
                        item.IsSelected = ko.observable(false);
                        if (addEquipmentViewModel.EquipmentID() == item.EquipmentID)
                            item.IsSelected(true);
                    });
                    addEquipmentViewModel.EquipmentInfoArray(equipmentList);
                    addEquipmentViewModel.PagerContent(json.d.HTMLPager);
                }
                }
            else {
                var errorMsg = languageResource.resMsg_Error + languageResource.resMsg_FailedToBindEquipmentList;
                ShowErrorMessage(errorMsg, true);
            }
        },
        beforeSend: function () {
            addEquipmentViewModel.EquipmentInfoArray.removeAll();
            jQuery("#divLoadProgressVisible").removeClass('hide');
            addEquipmentViewModel.PagerContent('');
          
        },
        complete: function () {
        },
        error: function (request, error) {
            jQuery("#divLoadProgressVisible").addClass('hide');
            var msg;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    msg = languageResource.resMsg_Error + errorMsg.Message;
                else
                    msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToBindEquipmentList;
            }
            else {
                msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToBindEquipmentList;
            }
            ShowErrorMessage(msg, true);
        }
    });
}

//Add/Upadte equipment list
function InsertUpdateEquipmentinfo(workGroupDeletionConfirmed, newWorkGroupConfirmation) {
    var isValid = true;
    var isValidSupport = true;
    var errorMessage = "";
    jQuery("input").removeClass('border-red');
    jQuery("select").removeClass('border-red');
    addEquipmentViewModel.LoadErrorMessageVisible(false);

    var equipmentDetailsInfo = {};
    equipmentDetailsInfo.InfoType = jQuery.AddEquipmentNamespace.InfoType.Equipment.charCodeAt(0);
    equipmentDetailsInfo.EquipmentID = addEquipmentViewModel.EquipmentID();
    equipmentDetailsInfo.EquipmentCode = jQuery.trim(addEquipmentViewModel.EquipmentCode());
    equipmentDetailsInfo.EquipmentName = jQuery.trim(addEquipmentViewModel.EquipmentName());
    equipmentDetailsInfo.EquipmentDesc = jQuery.trim(addEquipmentViewModel.EquipmentDesc());
    equipmentDetailsInfo.FLocationID = parseInt(addEquipmentViewModel.SelectedFunctionLocation());
    equipmentDetailsInfo.ResourceID = parseInt(addEquipmentViewModel.SelectedResource());
    equipmentDetailsInfo.ParentEquipmentID = parseInt(addEquipmentViewModel.SelectedParentEquipment());
    equipmentDetailsInfo.ModelReferenceID = parseInt(addEquipmentViewModel.SelectedModel());
    if (addEquipmentViewModel.SelectedModel() == 0) {
        equipmentDetailsInfo.ModelNumber = jQuery.trim(addEquipmentViewModel.ModelNumber());
        equipmentDetailsInfo.ModelName = jQuery.trim(addEquipmentViewModel.ModelName());
        equipmentDetailsInfo.ManufacturerID = parseInt(addEquipmentViewModel.SelectedManufacture());
        equipmentDetailsInfo.CategoryID = parseInt(addEquipmentViewModel.SelectedCategory());
        equipmentDetailsInfo.ClassID = parseInt(addEquipmentViewModel.SelectedClass());
    }
    equipmentDetailsInfo.SerialNumber = jQuery.trim(addEquipmentViewModel.SerialNumber());
    equipmentDetailsInfo.WarrantyNumber = jQuery.trim(addEquipmentViewModel.WarrantyNumber());
    if (addEquipmentViewModel.WarrantyStartDate().length > 0) {
        var parsedWarrantyStartDate = jQuery.datepicker.parseDate(jQuery.AddEquipmentNamespace.DateFormat, addEquipmentViewModel.WarrantyStartDate());
        equipmentDetailsInfo.WarrantyStartDate = parseInt(jQuery.datepicker.formatDate('yymmdd', parsedWarrantyStartDate));
    }
    if (addEquipmentViewModel.WarrantyExpireDate().length > 0) {
        var parsedWarrantyExpireDate = jQuery.datepicker.parseDate(jQuery.AddEquipmentNamespace.DateFormat, addEquipmentViewModel.WarrantyExpireDate());
        equipmentDetailsInfo.WarrantyExpireDate = parseInt(jQuery.datepicker.formatDate('yymmdd', parsedWarrantyExpireDate));
    }
    if (addEquipmentViewModel.PurchaseDate().length > 0) {
        var parsedPurchaseDate = jQuery.datepicker.parseDate(jQuery.AddEquipmentNamespace.DateFormat, addEquipmentViewModel.PurchaseDate());
        equipmentDetailsInfo.PurchaseDate = parseInt(jQuery.datepicker.formatDate('yymmdd', parsedPurchaseDate));
    }
    if (addEquipmentViewModel.InstallDate().length > 0) {
        var parsedInstallDate = jQuery.datepicker.parseDate(jQuery.AddEquipmentNamespace.DateFormat, addEquipmentViewModel.InstallDate());
        equipmentDetailsInfo.InstallDate = parseInt(jQuery.datepicker.formatDate('yymmdd', parsedInstallDate));
    }
    equipmentDetailsInfo.SupportInfoList = [];

    if (jQuery.AddEquipmentNamespace.EquipmentImageName != null || jQuery.AddEquipmentNamespace.EquipmentImageName != undefined || jQuery.AddEquipmentNamespace.EquipmentImageName != "") {
        equipmentDetailsInfo.EquipmentImageName = jQuery.AddEquipmentNamespace.EquipmentImageName;   
    }
    else {
        equipmentDetailsInfo.EquipmentImageName = "";
    }    

    var locationID = addEquipmentViewModel.SelectedFunctionLocation();
    var parentEquipmentID = addEquipmentViewModel.SelectedParentEquipment();
    if (addEquipmentViewModel.SelectedWorkGroupInfoList().length == 0 && (locationID > 0 || parentEquipmentID > 0)) {

        var selectedWorkGroupList = [];
        if (parentEquipmentID > 0) {
            var equipmentInfo = ko.utils.arrayFirst(addEquipmentViewModel.ParentEquipmentList(), function (item) {
                return item.EquipmentID == parentEquipmentID;
            });

            if (equipmentInfo != null) {
                selectedWorkGroupList = equipmentInfo.AssignedWorkGroupList;
            }
        }

        if (locationID > 0) {
            var locationInfo = ko.utils.arrayFirst(addEquipmentViewModel.FunctionalLocationArray(), function (item) {
                return item.TypeValue == locationID;
            });

            if (locationInfo != null) {
                selectedWorkGroupList = locationInfo.AssignedWorkGroupList;
            }
        }

        if (selectedWorkGroupList.length > 0) {            
            jQuery("#spnErrorMsg").removeClass("text-info").addClass("text-danger");            
            jQuery("#spnErrorMsg").html(languageResource.resMsg_PleaseSelectAuthGroup);
            return;
        }
    }

    equipmentDetailsInfo.AssignedWorkGroupList = [];
    ko.utils.arrayForEach(addEquipmentViewModel.SelectedWorkGroupInfoList(), function (item, index) {
        var keyValueInfo = {};
        keyValueInfo.TypeValue = parseInt(item.TypeValue);
        keyValueInfo.DisplayName = '';
        equipmentDetailsInfo.AssignedWorkGroupList.push(keyValueInfo);
    });

    if (equipmentDetailsInfo.EquipmentCode.length == 0) {
        jQuery("#txtequipmentCode").addClass('border-red');
        isValid = false;
    }
    if (equipmentDetailsInfo.EquipmentName.length == 0) {
        jQuery("#txtequipmentName").addClass('border-red');
        isValid = false;
    }
    if ((equipmentDetailsInfo.WarrantyStartDate > 0 || equipmentDetailsInfo.PurchaseDate > 0 || equipmentDetailsInfo.InstallDate > 0 || equipmentDetailsInfo.WarrantyExpireDate > 0) && isValid) {
        var msg = "";
        if (equipmentDetailsInfo.WarrantyStartDate > equipmentDetailsInfo.WarrantyExpireDate && equipmentDetailsInfo.WarrantyStartDate != 0) {
            msg = languageResource.WarrantyDateInvalid;
            isValid = false;
        }
        if (equipmentDetailsInfo.PurchaseDate > (equipmentDetailsInfo.InstallDate || equipmentDetailsInfo.WarrantyStartDate) && equipmentDetailsInfo.PurchaseDate != 0) {
            msg = languageResource.PurchaseDateInvalid;
            isValid = false;
        }
        if (!isValid) {
            jQuery("#spnErrorMsg").removeClass("text-info");
            jQuery("#spnErrorMsg").addClass("text-danger");
            jQuery("#spnErrorMsg").html(msg);
            return false;
        }
    }

    if (isValid) {
        ko.utils.arrayForEach(addEquipmentViewModel.SupportInfoList(), function (data, rowIndex) {
            var supportInfo = {};
            if (jQuery.trim(data.SupportEmail).length > 0) {
                var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                if (emailReg.test(jQuery.trim(data.SupportEmail)) == false) {
                    jQuery("#txtSupportEmail_" + rowIndex).addClass('border-red');
                    errorMessage = languageResource.resMsg_PleaseEnterValidEmailId + "<br/>";
                    isValidSupport = false;
                      return false;
                }
            }

            var supportinfoExist = ko.utils.arrayFirst(equipmentDetailsInfo.SupportInfoList, function (supportInfo) {
                return (supportInfo.SupportName === data.SupportName && supportInfo.SupportType === data.SupportType.charCodeAt());
            });
            if (supportinfoExist)
            {
                errorMessage = languageResource.resMsg_SupportNameAndSupportTypeCantbeSame + "<br/>";
                isValidSupport = false;
                return false;
            }
            if (isValidSupport) {
                if (jQuery.trim(data.SupportName).length > 0) {
                    supportInfo.SupportName = data.SupportName;
                    supportInfo.SupportNumber = data.SupportNumber;
                    supportInfo.SupportEmail = data.SupportEmail;
                    supportInfo.SupportType = data.SupportType.charCodeAt();
                    equipmentDetailsInfo.SupportInfoList.push(supportInfo);
                }
            }
        });
    }

    if (isValid == false || isValidSupport == false) {
        if (isValid == false)
        errorMessage = languageResource.resMsg_PleaseEnterAllTheMandatoryFields + "<br/>";
        jQuery("#spnErrorMsg").removeClass("text-info");
        jQuery("#spnErrorMsg").addClass("text-danger");
        jQuery("#spnErrorMsg").html(errorMessage);
    }
    else {
        if (workGroupDeletionConfirmed)
            equipmentDetailsInfo.WorkGroupDeletionConfirmed = true;
        else
            equipmentDetailsInfo.WorkGroupDeletionConfirmed = false;

        if (workGroupDeletionConfirmed == undefined && newWorkGroupConfirmation == undefined && equipmentDetailsInfo.EquipmentID > 0 && jQuery.AddEquipmentNamespace.AssignedWorkGroupInfo.length > 0) {
            var newWorkGroupIDList = [];
            ko.utils.arrayForEach(addEquipmentViewModel.SelectedWorkGroupInfoList(), function (item, index) {
                var alreadyAssignedWorkGroup = ko.utils.arrayFirst(jQuery.AddEquipmentNamespace.AssignedWorkGroupInfo, function (AssignedItem, index) {
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

        equipmentDetailsInfo.AsignNewWorkGroupsToChild = false;
        if (newWorkGroupConfirmation != undefined)
            equipmentDetailsInfo.AsignNewWorkGroupsToChild = newWorkGroupConfirmation;

        jQuery.ajax({
            type: "POST",
            url: jQuery.AddEquipmentNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/InsertOrUpdateEquipmentInfo",
            data: JSON.stringify({ basicParam: jQuery.AddEquipmentNamespace.BasicParam, equipmentDetailsInfo: equipmentDetailsInfo }),
            contentType: "application/json; charset=utf-8",
            datatype: 'json',
            async: false,
            success: function (json) {
                if (json != undefined && json.d != undefined) {
                    var result = json.d.Code;
                    if (result == -1) {//Already exist
                        ShowMessage(languageResource.resMsg_AlreadyExistsEquipment, "error");
                        addEquipmentViewModel.LoadErrorMessageVisible(true);
                    }
                    else if (result > 0) { //successfully inserted or updated
                        AddNewEquipmentClick();
                        if (equipmentDetailsInfo.EquipmentID == 0) {
                            ShowMessage(languageResource.resMsg_SuccessfullyInsertedEquipment, "Info");
                        }
                        else if (equipmentDetailsInfo.EquipmentID > 0) {
                            ShowMessage(languageResource.resMsg_SuccessfullyUpdatedEquipment, "Info");
                        }
                        if (addEquipmentViewModel.SelectFunctionalLocationFilter() == 0 && equipmentDetailsInfo.FLocationID != 0) {
                            addEquipmentViewModel.SelectFunctionalLocationFilter(equipmentDetailsInfo.FLocationID);
                            jQuery("#drpFilterFunctionalLocation").select2();
                        }
                        addEquipmentViewModel.LoadErrorMessageVisible(true);
                        LoadAllEquipmentInfo(jQuery.AddEquipmentNamespace.PagerData);
                        if (addEquipmentViewModel.EquipmentInfoArray().length > 0 && (addEquipmentViewModel.SelectFunctionalLocationFilter() == equipmentDetailsInfo.FLocationID)) {
                            ko.utils.arrayForEach(addEquipmentViewModel.EquipmentInfoArray(), function (item) {
                                item.IsSelected(false);
                                if (item.EquipmentID == result) {
                                    item.IsSelected(true);
                                }
                            });
                        }
                        BindParentEquipmentInfo();
                    }
                    else if (result == -2) {//already exist in in-active status can not updated
                        ShowMessage(languageResource.resMsg_CanNotUpdatedAlreadyExistInInActiveState, "error");
                        addEquipmentViewModel.LoadErrorMessageVisible(true);
                    }
                    else if (result == -5) {
                        DeleteWorkGroupConfirmation(json.d.MessageList, equipmentDetailsInfo.AsignNewWorkGroupsToChild);
                    }
                }
                else {
                    ShowMessage(languageResource.resMsg_Error + languageResource.resMsg_FailedAddOrUpdateEquipment, "error");
                    addEquipmentViewModel.LoadErrorMessageVisible(true);
                }
            },
            beforeSend: function () {
                jQuery("#divProgress").show();

            },
            complete: function () {
                jQuery("#divProgress").hide();
                jQuery("#spnErrorMsg").html('');
            },
            error: function (request, error) {
                if (request.responseText != "") {
                    var errorMsg = jQuery.parseJSON(request.responseText);
                    if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null) {
                        errorMessage = languageResource.resMsg_Error + errorMsg.Message;
                        ShowMessage(errorMessage, "error");
                        addEquipmentViewModel.LoadErrorMessageVisible(true);
                    }
                    else {
                        errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedAddOrUpdateEquipment;
                        ShowMessage(errorMessage, "error");
                        addEquipmentViewModel.LoadErrorMessageVisible(true);
                    }
                }
                else {
                    errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedAddOrUpdateEquipment;
                    ShowMessage(errorMessage, "error");
                    addEquipmentViewModel.LoadErrorMessageVisible(true);
                }
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
    var errorMessage = languageResource.resMsg_WorkGroupLinkedToSubEquipmentConfirmation.replace("[XXX]", deletedWorkGroups);
    jQuery("#alertMessage").removeClass("text-danger");
    jQuery("#alertMessage").html(errorMessage);
    jQuery("#confirmModal").dialog({
        zIndex: 1060,
        //closeOnEscape: false,
        //open: function (event, ui) {
        //    jQuery(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
        //},
        modal: true,
        buttons: [
            {
                text: languageResource.resMsg_BtnConfirm,
                click: function () {
                    jQuery("#confirmModal").dialog("close");
                    InsertUpdateEquipmentinfo(true, newWorkGroupConfirmation);
                }
            },
            {
                text: languageResource.resMsg_BtnCancel,
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
                    InsertUpdateEquipmentinfo(false, true);
                }
            },
            {
                text: languageResource.resMsg_No,
                click: function () {
                    jQuery("#confirmModal").dialog("close");
                    InsertUpdateEquipmentinfo(false, false);
                }
            }
        ]
    });
}

function AddNewEquipmentClick() {
    ClearEquipmentInfo(true);
}

function AddNewSupportRow() {
    jQuery('#tbSupport tr  td:nth-child(5)').show();//to show delete column
    jQuery('#tblSupport tr th:nth-child(5)').show();
    return {
        SupportID: 0,
        SupportName: '',
        SupportNumber: '',
        SupportEmail: '',
        SupportType: 'H',
    };
}

function SelectedEquipmentList(equipmentID) {
    addEquipmentViewModel.EquipmentID(equipmentID);
    GetEquipmentInfo(equipmentID);
    ko.utils.arrayForEach(addEquipmentViewModel.EquipmentInfoArray(), function (item) {
        item.IsSelected(false);
        if (item.EquipmentID == equipmentID) {
            item.IsSelected(true);
        }
    });
}

function SelectFunctionalLocation() {
    jQuery("#drpFunctionLocation").prop("disabled", false);
    if (addEquipmentViewModel.SelectedParentEquipment() > 0 && addEquipmentViewModel.SelectedParentEquipment() != 0 && addEquipmentViewModel.SelectedParentEquipment() != undefined) {
        var equipmentInfo = jQuery.grep(addEquipmentViewModel.ParentEquipmentList(), function (value, index) {
            return value.EquipmentID == addEquipmentViewModel.SelectedParentEquipment();
        });
        if (equipmentInfo[0].FunctionalLocationID > 0) {
            addEquipmentViewModel.SelectedFunctionLocation(equipmentInfo[0].FunctionalLocationID);
            jQuery("#drpFunctionLocation").prop("disabled", true);
        }
        else {
            addEquipmentViewModel.SelectedFunctionLocation(0);
        }
    }    
    jQuery("#drpFunctionLocation").select2();
}

function GetEquipmentInfo(equipmentID) {
    var equipmentFilterInfo = {}
    equipmentFilterInfo.SiteID = jQuery.AddEquipmentNamespace.BasicParam.SiteID;
    equipmentFilterInfo.UserID = jQuery.AddEquipmentNamespace.BasicParam.UserID;
    equipmentFilterInfo.InfoType = jQuery.AddEquipmentNamespace.InfoType.Equipment.charCodeAt();
    equipmentFilterInfo.EquipmentID = equipmentID;

    jQuery.ajax({
        type: "POST",
        url: jQuery.AddEquipmentNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/GetEquipmentEditInfo",
        data: JSON.stringify({equipmentFilterInfo: equipmentFilterInfo }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if (json != undefined && json.d != null) {
                jQuery("#btnSaveEquipment").html(languageResource.resMsg_Update);
                if (addEquipmentViewModel.HasEditAccess)
                    jQuery("#btnSaveEquipment").removeClass('disabled');
                BindEquipmentViewModel(json.d);
            }
            else {
                ShowMessage(languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadEquipmentInfo, "error");
            }
        },
        beforeSend: function () {
            ClearEquipmentInfo(false);
            jQuery.AddEquipmentNamespace.AssignedWorkGroupInfo = [];
            jQuery.AddEquipmentNamespace.ParentEquipmentID = 0;
            jQuery.AddEquipmentNamespace.LocationID = 0;
        },
        complete: function () {
        },
        error: function (request, error) {
            var msg;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    msg = errorMsg.Message;
                else
                    msg = languageResource.resMsg_FailedToLoadEquipmentInfo;
            }
            else {
                msg = languageResource.resMsg_FailedToLoadEquipmentInfo;
            }
            ShowMessage(languageResource.resMsg_Error + msg, "error");
        }
    });
}

function BindEquipmentViewModel(equipmentInfo) {
    jQuery.AddEquipmentNamespace.AssignedWorkGroupInfo = equipmentInfo.AssignedWorkGroupList;
    jQuery.AddEquipmentNamespace.ParentEquipmentID = equipmentInfo.ParentEquipmentID;
    jQuery.AddEquipmentNamespace.LocationID = equipmentInfo.FLocationID;

    var selectedWorkGroupList = [];
    addEquipmentViewModel.SelectedWorkGroupInfoList.removeAll();
    ko.utils.arrayForEach(equipmentInfo.AssignedWorkGroupList, function (item, index) {
        var workGroupInfo = {};
        workGroupInfo.TypeValue = item.TypeValue;
        workGroupInfo.DisplayName = item.DisplayName;
        var userWorkGroup = ko.utils.arrayFirst(addEquipmentViewModel.WorkGroupList(), function (userItem, userItemIndex) {
            return userItem.TypeValue == item.TypeValue;
        });

        if (userWorkGroup != null) workGroupInfo.IsUserWorkGroup = true;
        else workGroupInfo.IsUserWorkGroup = false;

        addEquipmentViewModel.SelectedWorkGroupInfoList.push(workGroupInfo);

        selectedWorkGroupList.push(item.TypeValue);
    });
    jQuery("#drpWorkGroup").multipleSelect("setSelects", selectedWorkGroupList);

    addEquipmentViewModel.EquipmentID(equipmentInfo.EquipmentID);
    addEquipmentViewModel.EquipmentCode(equipmentInfo.EquipmentCode);
    addEquipmentViewModel.BtnGenerateCode(false);
    addEquipmentViewModel.EquipmentName(equipmentInfo.EquipmentName);
    addEquipmentViewModel.EquipmentDesc(equipmentInfo.EquipmentDesc);
    autoheight('#txtDescription');
    BindParentEquipmentInfo();
    addEquipmentViewModel.SelectedParentEquipment(equipmentInfo.ParentEquipmentID);
    SelectFunctionalLocation();
    if (addEquipmentViewModel.SelectedParentEquipment() == 0)
      addEquipmentViewModel.SelectedFunctionLocation(equipmentInfo.FLocationID);
    addEquipmentViewModel.SelectedResource(equipmentInfo.ResourceID);

    if (equipmentInfo.ModelReferenceID > 0) {
        $("#checkModel").prop("checked", true);
        ReferModelMasterDataChecked();
    }
    else {
        $("#checkModel").prop("checked", false);
        ReferModelMasterDataChecked();
    }

    addEquipmentViewModel.SelectedModel(equipmentInfo.ModelReferenceID);
    addEquipmentViewModel.ModelNumber(equipmentInfo.ModelNumber);
    addEquipmentViewModel.ModelName(equipmentInfo.ModelName);
    addEquipmentViewModel.SerialNumber(equipmentInfo.SerialNumber);
    addEquipmentViewModel.SelectedManufacture(equipmentInfo.ManufacturerID);
    addEquipmentViewModel.SelectedCategory(equipmentInfo.CategoryID);
    addEquipmentViewModel.SelectedClass(equipmentInfo.ClassID);
    jQuery('.select2').select2();

    addEquipmentViewModel.WarrantyNumber(equipmentInfo.WarrantyNumber);
    addEquipmentViewModel.WarrantyStartDate(equipmentInfo.WarrantyStartDate != 0 ? ConvertDBToPlantDateFormat(jQuery.AddEquipmentNamespace.DateFormat, equipmentInfo.WarrantyStartDate.toString()) : "");
    addEquipmentViewModel.WarrantyExpireDate(equipmentInfo.WarrantyExpireDate != 0 ? ConvertDBToPlantDateFormat(jQuery.AddEquipmentNamespace.DateFormat, equipmentInfo.WarrantyExpireDate.toString()) : "");
    addEquipmentViewModel.PurchaseDate(equipmentInfo.PurchaseDate != 0 ? ConvertDBToPlantDateFormat(jQuery.AddEquipmentNamespace.DateFormat, equipmentInfo.PurchaseDate.toString()) : "");
    addEquipmentViewModel.InstallDate(equipmentInfo.InstallDate != 0 ? ConvertDBToPlantDateFormat(jQuery.AddEquipmentNamespace.DateFormat, equipmentInfo.InstallDate.toString()) : "");

    if (equipmentInfo.EquipmentImagePath != null || equipmentInfo.EquipmentImagePath != undefined) {
        addEquipmentViewModel.EquipmentImgPath(equipmentInfo.EquipmentImagePath);
    }
    else {
        addEquipmentViewModel.EquipmentImgPath(jQuery.AddEquipmentNamespace.ImgDefaultProfilePath);
    } 
    addEquipmentViewModel.EquipmentImageExist = equipmentInfo.EquipmentImageExist;

    if (equipmentInfo.SupportInfoList.length > 0) {
        addEquipmentViewModel.SupportInfoList.removeAll();
        ko.utils.arrayForEach(equipmentInfo.SupportInfoList, function (data) {
            var supportInfo = {};
            supportInfo.SupportID = data.SupportID;
            supportInfo.SupportName = data.SupportName;
            supportInfo.SupportNumber = data.SupportNumber;
            supportInfo.SupportEmail = data.SupportEmail;
            supportInfo.SupportType = String.fromCharCode(data.SupportType);
            addEquipmentViewModel.SupportInfoList.push(supportInfo);
        });

        jQuery('#tbSupport tr  td:nth-child(5)').show();
        jQuery('#tblSupport tr th:nth-child(5)').show();
    }
}

function ClearEquipmentInfo(isClearCode) {
    jQuery("input").removeClass('border-red');
    jQuery("select").removeClass('border-red');
    if (isClearCode)
        addEquipmentViewModel.BtnGenerateCode(true);
    addEquipmentViewModel.EquipmentID(0);
    BindParentEquipmentInfo();
    addEquipmentViewModel.SelectedFunctionLocation(0);
    addEquipmentViewModel.LoadErrorMessageVisible(false);
    addEquipmentViewModel.LoadErrorMessage('');
    addEquipmentViewModel.LoadErrorMessageClass('');
    ko.utils.arrayForEach(addEquipmentViewModel.EquipmentInfoArray(), function (item) {
        item.IsSelected(false);
    });
    addEquipmentViewModel.EquipmentCode('');
    addEquipmentViewModel.EquipmentName('');
    addEquipmentViewModel.EquipmentDesc('');
    addEquipmentViewModel.SelectedResource(0);
    addEquipmentViewModel.SelectedModel(0);
    addEquipmentViewModel.ModelNumber('');
    addEquipmentViewModel.ModelName('');
    addEquipmentViewModel.SerialNumber('');
    addEquipmentViewModel.SelectedManufacture(0);
    addEquipmentViewModel.SelectedCategory(0);
    addEquipmentViewModel.SelectedClass(0);
    addEquipmentViewModel.WarrantyNumber('');
    addEquipmentViewModel.WarrantyStartDate('');
    addEquipmentViewModel.WarrantyExpireDate('');
    addEquipmentViewModel.PurchaseDate('');
    addEquipmentViewModel.InstallDate('');
    jQuery('.select2').select2();
    jQuery.AddEquipmentNamespace.EquipmentImageName = "";
    addEquipmentViewModel.EquipmentImgPath(jQuery.AddEquipmentNamespace.ImgDefaultProfilePath);
    addEquipmentViewModel.EquipmentImageExist = false;
    $("#checkModel").prop("checked", false);
    ReferModelMasterDataChecked();
    jQuery("#spnErrorMsg").html('');
    BindSupportType(false);
    jQuery("#btnSaveEquipment").html(languageResource.resMsg_SaveandAddMore);
    if (addEquipmentViewModel.HasEditAccess && !addEquipmentViewModel.HasDeleteAccess)
        jQuery("#btnSaveEquipment").addClass('disabled');

    jQuery("#drpWorkGroup").multipleSelect("setSelects", []);
    addEquipmentViewModel.SelectedWorkGroupInfoList.removeAll();
    ShowAllEquipmentModelInfo();
}

//Delete equipment info and support infos
function DeleteEquipmentClick(equipmentID, rowIndex) {
    jQuery("#alertMessage").removeClass("text-danger");
    jQuery("#alertMessage").html(languageResource.resMsg_DeleteEquipmentInfoConfirm);
    jQuery("#confirmModal").dialog({
        zIndex: 1060,
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

    var btnPosition = jQuery("#fieldsetEquipmentList_" + rowIndex).offset().top;
    jQuery(".ui-dialog").css("top", btnPosition);
    window.parent.parent.scrollTo(0, btnPosition);
}

function DeleteEquipmentInfo(equipmentID) {
    jQuery.ajax({
        type: "POST",
        url: jQuery.AddEquipmentNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/DeleteEquipmentInfo",
        data: JSON.stringify({ basicParam: jQuery.AddEquipmentNamespace.BasicParam, equipmentID: equipmentID }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if (json.d == 2) {
                AddNewEquipmentClick();
                LoadAllEquipmentInfo(jQuery.AddEquipmentNamespace.PagerData); 
                BindParentEquipmentInfo();
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
                var errorMsg = jQuery.parseJSON(request.responseText);
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

function DeleteSupportInfo(deleteItemData, trRowIndex) {
    if (deleteItemData.SupportID == 0) {
        addEquipmentViewModel.SupportInfoList.remove(deleteItemData);
        resizeIframe(-40);
    }
    else {
        jQuery("#alertMessage").html(languageResource.resMsg_DeleteSupportInformationConfirm);
        jQuery("#alertMessage").removeClass('text-danger');
        jQuery("#confirmModal").dialog({
            zIndex: 1060,
            modal: true,
            buttons: [
                {
                    text: languageResource.resMsg_BtnConfirm,
                    click: function () {
                        DeleteEquipmentSupportInfo(deleteItemData);
                        jQuery("#confirmModal").dialog("close");
                    }
                },
                {
                    text: languageResource.resMsg_BtnCancel,
                    click: function () {
                        jQuery("#confirmModal").dialog("close");
                    }
                }
            ]
        });
        var btnPosition = jQuery("#trSupportInfoList_" + trRowIndex).offset().top;
        jQuery(".ui-dialog").css("top", btnPosition - 120);
        window.parent.parent.scrollTo(0, btnPosition);
    }

    var totalRowCount = jQuery('#tbSupport tr').length;
    if (totalRowCount == 1) {
        jQuery('#tbSupport tr  td:nth-child(5)').hide();//to hide delete column
        jQuery('#tblSupport tr th:nth-child(5)').hide();
    }
    else {
        jQuery('#tbSupport tr  td:nth-child(5)').show();
        jQuery('#tblSupport tr th:nth-child(5)').show();
    }
}

function DeleteEquipmentSupportInfo(deleteItemData) {
    if (deleteItemData.SupportID > 0) {
        var supportInfoFilter = {};
        supportInfoFilter.SiteID = jQuery.AddEquipmentNamespace.BasicParam.SiteID;
        supportInfoFilter.UserID = jQuery.AddEquipmentNamespace.BasicParam.UserID;
        supportInfoFilter.SupportID = deleteItemData.SupportID;
        supportInfoFilter.EquipmentID = addEquipmentViewModel.EquipmentID();
        jQuery.ajax({
            type: "POST",
            url: jQuery.AddEquipmentNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/DeleteEquipmentSupportInfo",
            data: JSON.stringify({ supportInfoFilter: supportInfoFilter }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                if (json.d == 2) {
                    addEquipmentViewModel.SupportInfoList.remove(deleteItemData);
                    resizeIframe(-40);
                    var totalRowCount = jQuery('#tbSupport tr').length;
                    if (totalRowCount == 1) {
                        jQuery('#tbSupport tr  td:nth-child(5)').hide();//to hide delete column
                        jQuery('#tblSupport tr th:nth-child(5)').hide();
                    }
                    else {
                        jQuery('#tbSupport tr  td:nth-child(5)').show();
                        jQuery('#tblSupport tr th:nth-child(5)').show();
                    }
                }
                //else if (json.d == 3) {
                //    var msg = languageResource.resMsg_CantDeleteSupportInfo;
                //    ShowErrorMessage(msg, true);
                //}
                else if (json.d == 1) {
                    var msg = languageResource.resMsg_SupportInfoDoesnotExist;
                    ShowErrorMessage(msg, true);
                }
            },
            error: function (request, error) {
                var msg;
                if (request.responseText != "") {
                    var errorMsg = jQuery.parseJSON(request.responseText);
                    if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                        msg = languageResource.resMsg_Error + errorMsg.Message;
                    else
                        msg = languageResource.resMsg_Error + languageResource.resMsg_SupportInfoDoesnotExist;
                }
                else {
                    msg = languageResource.resMsg_Error + languageResource.resMsg_SupportInfoDoesnotExist;
                }
                ShowErrorMessage(msg, true);
            },
        });
    }
}

//modalMessage

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

function ShowMessage(message, messageType) {
    switch (messageType.toLowerCase()) {
        case 'info':
            addEquipmentViewModel.LoadErrorMessageClass("text-info");
            addEquipmentViewModel.LoadErrorMessage(message);
            break;
        case 'error':
            addEquipmentViewModel.LoadErrorMessageClass("text-danger");
            addEquipmentViewModel.LoadErrorMessage(message);
            break;
    }
}

//To get equipment model information
function LoadEquipmentModelInfo(pagerData) {
    var equipmentFilterInfo = {};
    equipmentFilterInfo.SiteID = jQuery.AddEquipmentNamespace.BasicParam.SiteID;
    equipmentFilterInfo.UserID = jQuery.AddEquipmentNamespace.BasicParam.UserID;
    equipmentFilterInfo.PageSize = pagerData.PageSize;
    equipmentFilterInfo.PageIndex = pagerData.PageIndex;
    equipmentFilterInfo.InfoType = jQuery.AddEquipmentNamespace.InfoType.Equipment_Model.charCodeAt();

    if (jQuery.AddEquipmentNamespace.IsSearch) {
        equipmentFilterInfo.SerachNameOrCode = jQuery.trim(jQuery("#txtSearchEquipmentModel").val());
        equipmentFilterInfo.SearchManufactureIDs = jQuery("#drpManufacturerModel").val();
        equipmentFilterInfo.SearchCategoryIDs = jQuery("#drpTypeModel").val();
    }

    jQuery.ajax({
        type: "POST",
        url: jQuery.AddEquipmentNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/GetAllEquipmentModelList",
        data: JSON.stringify({ pagerData: pagerData, equipmentFilterInfo: equipmentFilterInfo }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (json) {
            if (json != undefined && json.d != null) {
                jQuery("#equipmentLoadProgress").addClass('hide');
                if (json.d.EquipmentModelList.length > 0) {
                    jQuery.each(json.d.EquipmentModelList, function (i, modelData) {
                        equipmentModelData = {};
                        equipmentModelData.IsSelected = ko.observable(false);;
                        if (addEquipmentViewModel.SelectedModel() > 0) {
                            if (addEquipmentViewModel.SelectedModel() == modelData.EquipmentModelID)
                                equipmentModelData.IsSelected(true);
                        }
                        equipmentModelData.EquipmentModelID = modelData.EquipmentModelID;
                        equipmentModelData.EquipmentModelName = modelData.EquipmentModelName;
                        equipmentModelData.EquipmentModelDesc = modelData.EquipmentModelDesc;
                        equipmentModelData.EquipmentModelNumber = modelData.EquipmentModelNumber;
                        equipmentModelData.ManufacturerName = modelData.ManufacturerName;
                        equipmentModelData.CategoryName = modelData.CategoryName;
                        equipmentModelData.ClassName = modelData.ClassName;
                        addEquipmentViewModel.EquipmentModelArray.push(equipmentModelData);
                    });
                    addEquipmentViewModel.ModelPagerContent(json.d.HTMLPager);
                }
            }
            else {
                var errorMsg = languageResource.resMsg_Error + languageResource.resMsg_FailedToBindModelListInfo;
                jQuery("#spnErrorEquipmentModel").addClass("text-danger");
                jQuery("#spnErrorEquipmentModel").html(errorMsg);
            }
        },
        beforeSend: function () {
            addEquipmentViewModel.EquipmentModelArray.removeAll();
            jQuery("#equipmentLoadProgress").removeClass('hide');
            addEquipmentViewModel.ModelPagerContent('');
        },
        complete: function () {
            jQuery("#equipmentLoadProgress").addClass('hide');
        },
        error: function (request, error) {
            var msg;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    msg = languageResource.resMsg_Error + errorMsg.Message;
                else
                    msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToBindModelListInfo;
            }
            else {
                msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToBindModelListInfo;
            }
            jQuery("#spnErrorEquipmentModel").addClass("text-danger");
            jQuery("#spnErrorEquipmentModel").html(msg);
        }
    });
}

function SearchEquipmentModelInfo() {
    if (jQuery("#txtSearchEquipmentModel").val().length == 0 && jQuery("#drpManufacturerModel").val() == 0 && jQuery("#drpTypeModel").val() == 0) {
        jQuery("#spnErrorEquipmentModel").html(languageResource.resMsg_SearchCriteria);
        return false;
    }
    jQuery("#btnShowAllEquipmentModel").html(languageResource.resMsg_ShowAll);
    jQuery("#btnShowAllEquipmentModel").removeClass('hide');
    jQuery("#spnErrorEquipmentModel").empty();
    jQuery.AddEquipmentNamespace.IsSearch = true;
    LoadEquipmentModelInfo(jQuery.AddEquipmentNamespace.ModelPagerData);
}

function ShowAllEquipmentModelInfo() {
    jQuery("#txtSearchEquipmentModel").val('');
    jQuery("#drpManufacturerModel").val(0);
    jQuery("#drpTypeModel").val(0);
    jQuery("#drpManufacturerModel").select2();
    jQuery("#drpTypeModel").select2();
    jQuery("#btnShowAllEquipmentModel").addClass('hide');
    jQuery.AddEquipmentNamespace.IsSearch = false;
    LoadEquipmentModelInfo(jQuery.AddEquipmentNamespace.ModelPagerData);
}

function ReferModelMasterDataChecked() {
    if (jQuery('#checkModel').is(':checked')) {
        addEquipmentViewModel.ModelNumber('');
        addEquipmentViewModel.ModelName('');
        addEquipmentViewModel.SerialNumber('');
        addEquipmentViewModel.SelectedCategory(0);
        addEquipmentViewModel.SelectedManufacture(0);
        addEquipmentViewModel.SelectedClass(0);
        jQuery("#drpManufacturer").select2();
        jQuery("#drpEquipmentType").select2();
        jQuery("#drpEquipmentClass").select2();
        addEquipmentViewModel.CheckReferModel(true);
        jQuery("#btnReferModel").removeClass("link-disabled");
        jQuery("#btnReferModel").prop("onclick", null);
        jQuery("#btnReferModel").bind("click", function () { ModalReferModelMasterData(); return false; });
    }
    else {
        BindMaintenanceMasterInfo(true);
        addEquipmentViewModel.CheckReferModel(false);
        addEquipmentViewModel.SelectedModel(0);
        jQuery("#btnReferModel").addClass("link-disabled");
        addEquipmentViewModel.ModelNumber('');
        addEquipmentViewModel.ModelName('');
        addEquipmentViewModel.SerialNumber('');
        addEquipmentViewModel.SelectedCategory(0);
        addEquipmentViewModel.SelectedManufacture(0);
        addEquipmentViewModel.SelectedClass(0);
        jQuery("#drpManufacturer").select2();
        jQuery("#drpEquipmentType").select2();
        jQuery("#drpEquipmentClass").select2();
        jQuery("#btnReferModel").prop("onclick", null);
    }
}

function ModalReferModelMasterData() {
    LoadEquipmentModelInfo(jQuery.AddEquipmentNamespace.ModelPagerData);

    jQuery("#spnErrorEquipmentModel").html('');
    jQuery("#divModalEquipmentModel").modal("show");

    var btnPosition = jQuery("#btnReferModel").offset().top;
    //jQuery("#divModalEquipmentModel").css("top", btnPosition - 100);
    window_height = $(window).height();
    $('html, body').animate({ scrollTop: window_height - 200 });
}

function ReferEquipmentModelCloseModal() {
    jQuery("#divModalEquipmentModel").modal("hide");
}

function SelectedEquipmentModelConfirm(equipmentModelInfo, isDoubleClick) {
    if (!isDoubleClick) {
        ko.utils.arrayForEach(addEquipmentViewModel.EquipmentModelArray(), function (item) {
            item.IsSelected(false);
            if (equipmentModelInfo.EquipmentModelID == item.EquipmentModelID) {
                item.IsSelected(true);
            }
        });
    }
    else {
        jQuery("#alertMessage").removeClass("text-danger");
        jQuery("#alertMessage").html(languageResource.resMsg_SelectEquipmentModelInfoConfirm.replace("[XXX]", equipmentModelInfo.EquipmentModelName));
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
                        SelectedEquipmentModel(equipmentModelInfo);
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
}

function SelectedEquipmentModel(equipmentModelInfo) {
    addEquipmentViewModel.SelectedModel(equipmentModelInfo.EquipmentModelID);

    var equipmentFilterInfo = {};
    equipmentFilterInfo.SiteID = jQuery.AddEquipmentNamespace.BasicParam.SiteID;
    equipmentFilterInfo.UserID = jQuery.AddEquipmentNamespace.BasicParam.UserID;
    equipmentFilterInfo.InfoType = jQuery.AddEquipmentNamespace.InfoType.Equipment_Model.charCodeAt();
    equipmentFilterInfo.EquipmentID = addEquipmentViewModel.SelectedModel();// Equipment Model ID
    jQuery.ajax({
        type: "POST",
        url: jQuery.AddEquipmentNamespace.WebServicePath + "/Vegam_MaintenanceService.asmx/GetEquipmentModelInfo",
        data: JSON.stringify({ equipmentFilterInfo: equipmentFilterInfo }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (json) {
            if (json != undefined && json.d != null) {
                var equipmentModelInfo = json.d;
                addEquipmentViewModel.ModelNumber(equipmentModelInfo.EquipmentModelNumber);
                addEquipmentViewModel.ModelName(equipmentModelInfo.EquipmentModelName);
                addEquipmentViewModel.SelectedManufacture(equipmentModelInfo.ManufacturerID);
                addEquipmentViewModel.SerialNumber('');
                addEquipmentViewModel.SelectedClass(equipmentModelInfo.ClassID);
                addEquipmentViewModel.SelectedCategory(equipmentModelInfo.CategoryID);
                if (equipmentModelInfo.EquipmentImagePath != null && addEquipmentViewModel.EquipmentImageExist == false) {
                    addEquipmentViewModel.EquipmentImgPath(equipmentModelInfo.EquipmentImagePath);
                }
                jQuery("#drpManufacturer").select2();
                jQuery("#drpEquipmentType").select2();
                jQuery("#drpEquipmentClass").select2();
            }
            else {
                ShowMessage(languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadEquipmentModelInfo, "error");
            }
        },
        complete: function () {
        },
        error: function (request, error) {
            var msg;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    msg = errorMsg.Message;
                else
                    msg = languageResource.resMsg_FailedToLoadEquipmentModelInfo;
            }
            else {
                msg = languageResource.resMsg_FailedToLoadEquipmentModelInfo;
            }
            ShowMessage(msg, "error");
        }
    });
    jQuery("#divModalEquipmentModel").modal("hide"); return false;
}

//DatePicker
function InitiateDatePicker(dateFormatID) {
    jQuery.AddEquipmentNamespace.DateFormat = dateFormatID;
    jQuery.datepicker.setDefaults({
        closeText: calendarLanguageResource.resMsg_CloseText,
        prevText: calendarLanguageResource.resMsg_PrevText,
        nextText: calendarLanguageResource.resMsg_NextText,
        currentText: calendarLanguageResource.resMsg_CurrentText,
        monthNames: calendarLanguageResource.resMsg_MonthNames,
        monthNamesShort: calendarLanguageResource.resMsg_MonthNamesShort,
        dayNames: calendarLanguageResource.resMsg_DayNames,
        dayNamesShort: calendarLanguageResource.resMsg_DayNamesShort,
        dayNamesMin: calendarLanguageResource.resMsg_DayNamesMin,
        weekHeader: calendarLanguageResource.resMsg_WeekHeader,
        firstDay: calendarLanguageResource.resMsg_FirstDay,
        yearSuffix: '',
        changeMonth: true,
        changeYear: true,
        dateFormat: jQuery.AddEquipmentNamespace.DateFormat
    });

    jQuery("#txtWarrantyStart").datepicker({
    });
    jQuery("#txtWarrantyStart").keypress(function () {
        return false;
    });

    jQuery("#txtPurchaseDate").datepicker({
    });
    jQuery("#txtPurchaseDate").keypress(function () {
        return false;
    });

    jQuery("#txtWarrantyExpire").datepicker({
    });
    jQuery("#txtWarrantyExpire").keypress(function () {
        return false;
    });

    jQuery("#txtInstallDate").datepicker({
    });
    jQuery("#txtInstallDate").keypress(function () {
        return false;
    });
}

function HideShowWarrantySupport(element, elementBlock) {
    if (jQuery(element).hasClass('fa-plus-circle')) {
            jQuery("#" + elementBlock).removeClass('hide');
            jQuery(element).removeClass('fa-plus-circle');
            jQuery(element).addClass('fa-minus-circle');
            if (elementBlock.toLowerCase() == "divsupport")
                jQuery("#divAddMore").removeClass('hide');
            myValue = jQuery("#" + elementBlock).height();
            resizeIframe(myValue);
        }
    else {
            jQuery("#" + elementBlock).addClass('hide');
            jQuery(element).removeClass('fa-minus-circle');
            jQuery(element).addClass('fa-plus-circle');
            if (elementBlock.toLowerCase() == "divsupport")
                jQuery("#divAddMore").addClass('hide');
            myValue = jQuery("#" + elementBlock).height();
            resizeIframe(-myValue);
    }
}

function resizeIframe(myValue) {
    //obj.style.height = 0;
    //obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
    window.parent.document.getElementById("MaintenanceInfoFrame").style.height = (window.parent.document.getElementById("MaintenanceInfoFrame").scrollHeight + myValue) + "px";
}

function BindIconAttributes(hasAccess) {
    var iconAttributes = {};
    if (!hasAccess) {
        iconAttributes.disabled = "disabled";
    }
    return iconAttributes;
}

jQuery(document).ready(function () {
    jQuery("textarea").addClass("font-small");
    jQuery("textarea").css({ "resize": "none", "overflow": "hidden" });
    jQuery("textarea").keyup(function (e) {
        autoheight(this);
    });
    jQuery('input').on('keypress', function (e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode === 13) {
            e.preventDefault();
            return false;
        }
    });
    jQuery("#divModalEquipmentModel").on('keydown', function (e) {
        if (e.keyCode == 27)
            ReferEquipmentModelCloseModal();
    });
    jQuery("#divAddMaintenanceMasterDataModal").on('keydown', function (e) {
        if (e.keyCode == 27)
            ClearMaintenanceTypeInfo(false);
    });
});

function autoheight(a) {
    if (!jQuery(a).prop('scrollTop')) {
        do {
            var b = $(a).prop('scrollHeight');
            var h = $(a).height();
            jQuery(a).height(h - 5);
        }
        while (b && (b != jQuery(a).prop('scrollHeight')));
    };
    jQuery(a).height(jQuery(a).prop('scrollHeight') + 5);
}

function EquipmentImageUpload() {
    if (jQuery.AddEquipmentNamespace.IsChanged) {
        jQuery.AddEquipmentNamespace.IsChanged = false;
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
            jQuery.AddEquipmentNamespace.IsChanged = true;
        }

        if (isValid) {
            var urlString = jQuery.AddEquipmentNamespace.UploaderPath + '?uid=' + jQuery.AddEquipmentNamespace.BasicParam.UserID + '&sid=' + jQuery.AddEquipmentNamespace.BasicParam.SiteID + '&fileName=' + imageName + '&equipmentInfo=true';

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
                        jQuery.AddEquipmentNamespace.EquipmentImageName = imageName;
                        jQuery.AddEquipmentNamespace.EquipmentImagePath.substring(0, 50) + imageName
                        addEquipmentViewModel.EquipmentImgPath(jQuery.AddEquipmentNamespace.EquipmentImagePath + "/" + imageName);
                        addEquipmentViewModel.EquipmentImageExist = true;
                        //jQuery("#imgEquipmentImage").attr('src', jQuery.AddEquipmentNamespace.EquipmentImagePath + "/" + imageName);
                    }
                    jQuery.AddEquipmentNamespace.IsChanged = true;
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
                    jQuery.AddEquipmentNamespace.IsChanged = true;
                }
            });
        }
    }
}

function ViewAdditionalInfoLinks(additionalLinksType) {
    var equipmentID = "";
    var queryString = "?id=" + jQuery.AddEquipmentNamespace.BasicParam.SiteID;
    if (addEquipmentViewModel.EquipmentID() == 0) {
        if (jQuery("#fieldsetEquipmentList > div").find("label").hasClass('bg-info')) {
            equipmentID = addEquipmentViewModel.EquipmentInfoArray()[0].EquipmentID;
        }
    }
    else {
        equipmentID = addEquipmentViewModel.EquipmentID();
    }
    if (additionalLinksType == jQuery.AddEquipmentNamespace.AdditionalLinksType.FunctionalLocation) {
        queryString = queryString + "&flid=" + jQuery.AddEquipmentNamespace.FLocationID;
        window.location.href = jQuery.AddEquipmentNamespace.BasePath + "/Preventive/AddFunctionalLocation.aspx" + queryString;
    }
    else if (additionalLinksType == jQuery.AddEquipmentNamespace.AdditionalLinksType.MeasuringPoint) {
        queryString = queryString + "&flid=" + addEquipmentViewModel.SelectFunctionalLocationFilter() + "&eid=" + equipmentID + "&type=" + jQuery.AddEquipmentNamespace.InfoType.Equipment.toString();
        window.location.href = jQuery.AddEquipmentNamespace.BasePath + "/Preventive/AddMeasuringPoint.aspx" + queryString;
    }
    else if (additionalLinksType == jQuery.AddEquipmentNamespace.AdditionalLinksType.Document) {
        queryString = queryString + "&flid=" + addEquipmentViewModel.SelectFunctionalLocationFilter() + "&eid=" + equipmentID + "&type=" + jQuery.AddEquipmentNamespace.InfoType.Equipment.toString() + "&hasFullAccess=" + addEquipmentViewModel.HasDeleteAccess;
        window.location.href = jQuery.AddEquipmentNamespace.BasePath + "/Preventive/AddDocumentsAndImages.aspx" + queryString;
    }
}

//add maintenance type modal
function ShowAddMaintenanceTypeModal(type, indexPos) {
    jQuery.AddEquipmentNamespace.SelectedMasterDataType = type;
    BindMasterDataInfo();
    ClearMaintenanceTypeInfo(false);
    var btnAddMaintType = jQuery.AddEquipmentNamespace.MaintTypePagerData.LoadControlID.replace("divModelInfo", "btnAddMaintType");
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
    if (jQuery.AddEquipmentNamespace.SelectedMasterDataType == jQuery.AddEquipmentNamespace.MasterDataType.Manufacturer) {
        jQuery("#modalHeaderName").text(languageResource.resMsg_ManufacturerInformation);
        jQuery(".labelMasterDataType").text(languageResource.resMsg_Manufacturer);
        jQuery("#fieldsetAddedit").text(languageResource.resMsg_AddEditMasterData.replace("[XXX]", languageResource.resMsg_Manufacturer));
        jQuery("#spnViewAllMaintTypes").text(languageResource.resMsg_ClickHereToView.replace("[XXX]", languageResource.resMsg_Manufacturer));
        jQuery("#spanListofInfo").text(languageResource.resMsg_ListOfMasterData.replace("[XXX]", languageResource.resMsg_Manufacturer + 's'));
        jQuery.AddEquipmentNamespace.SelectedMasterDataMessage = languageResource.resMsg_Manufacturer;
    }
    if (jQuery.AddEquipmentNamespace.SelectedMasterDataType == jQuery.AddEquipmentNamespace.MasterDataType.EquipmentType) {
        jQuery("#modalHeaderName").text(languageResource.resMsg_EquipmentTypeInformation);
        jQuery(".labelMasterDataType").text(languageResource.resMsg_EquipmentType);
        jQuery("#fieldsetAddedit").text(languageResource.resMsg_AddEditMasterData.replace("[XXX]", languageResource.resMsg_EquipmentType));
        jQuery("#spnViewAllMaintTypes").text(languageResource.resMsg_ClickHereToView.replace("[XXX]", languageResource.resMsg_EquipmentType));
        jQuery("#spanListofInfo").text(languageResource.resMsg_ListOfMasterData.replace("[XXX]", languageResource.resMsg_EquipmentType + 's'));
        jQuery.AddEquipmentNamespace.SelectedMasterDataMessage = languageResource.resMsg_EquipmentType;
    }
    if (jQuery.AddEquipmentNamespace.SelectedMasterDataType == jQuery.AddEquipmentNamespace.MasterDataType.EquipmentClass) {
        jQuery("#modalHeaderName").text(languageResource.resMsg_EquipmentClassInformation);
        jQuery(".labelMasterDataType").text(languageResource.resMsg_EquipmentClass);
        jQuery("#fieldsetAddedit").text(languageResource.resMsg_AddEditMasterData.replace("[XXX]", languageResource.resMsg_EquipmentClass));
        jQuery("#spnViewAllMaintTypes").text(languageResource.resMsg_ClickHereToView.replace("[XXX]", languageResource.resMsg_EquipmentClass));
        jQuery("#spanListofInfo").text(languageResource.resMsg_ListOfMasterData.replace("[XXX]", languageResource.resMsg_EquipmentClass + 'es'));
        jQuery.AddEquipmentNamespace.SelectedMasterDataMessage = languageResource.resMsg_EquipmentClass;
    }
}

function SearchMaintTypes() {
    var btnSave = jQuery.AddEquipmentNamespace.MaintTypePagerData.LoadControlID;
    jQuery.AddEquipmentNamespace.IsMaintTypeSearch = true;

    if (jQuery.AddEquipmentNamespace.IsMaintTypeSearch == true) {
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
    var btnAddMaintType = btnSave.replace("divModelInfo", "btnAddMaintType");
    jQuery("#" + btnAddMaintType).val("");
    jQuery("#" + btnAddMaintType).text(languageResource.resMsg_Add);

    var thMaintTypes = jQuery.AddEquipmentNamespace.MaintTypePagerData.LoadControlID.replace("divModelInfo", "thMaintTypes");
    jQuery("#" + thMaintTypes + " i").removeClass('fa-sort-up');
    jQuery("#" + thMaintTypes + " i").removeClass('fa-sort-down');
    jQuery("#hdfSortValue").val('');
    jQuery("#divMaintTypes").removeClass("hide");
    jQuery("#iconViewMaintTypes").removeClass("fa fa-plus-circle");
    jQuery("#iconViewMaintTypes").addClass("fa fa-minus-circle");

    var maintTypeAccess = jQuery.AddEquipmentNamespace.MaintTypePagerData.PageAccessRights.toLowerCase();
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

    LoadMaintTypesInfo(jQuery.AddEquipmentNamespace.MaintTypePagerData);
}

function ShowAllMaintTypes() {
    jQuery.AddEquipmentNamespace.IsMaintTypeSearch = false;
    ClearMaintenanceTypeInfo(false);
    jQuery("#btnShowAll").addClass('hide');

    var thMaintTypes = jQuery.AddEquipmentNamespace.MaintTypePagerData.LoadControlID.replace("divModelInfo", "thMaintTypes");
    jQuery("#" + thMaintTypes + " i").removeClass('fa-sort-up');
    jQuery("#" + thMaintTypes + " i").removeClass('fa-sort-down');
    jQuery("#hdfSortValue").val('');
    jQuery("#divMaintTypes").removeClass("hide");
    jQuery("#iconViewMaintTypes").removeClass("fa fa-plus-circle");
    jQuery("#iconViewMaintTypes").addClass("fa fa-minus-circle");

    var btnAddMaintType = jQuery.AddEquipmentNamespace.MaintTypePagerData.LoadControlID.replace("divModelInfo", "btnAddMaintType");
    jQuery("#" + btnAddMaintType).text(languageResource.resMsg_Add);

    var maintTypeAccess = jQuery.AddEquipmentNamespace.MaintTypePagerData.PageAccessRights.toLowerCase();
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

    LoadMaintTypesInfo(jQuery.AddEquipmentNamespace.MaintTypePagerData);
}

function ClearMaintenanceTypeInfo(isDelete) {
    jQuery("#spnSearchError").html("");
    jQuery("#spnAddMaintTypeError").html("");
    var btnAddMaintType = jQuery.AddEquipmentNamespace.MaintTypePagerData.LoadControlID.replace("divModelInfo", "btnAddMaintType");
    jQuery("#" + btnAddMaintType).text(languageResource.resMsg_Add);
    if (jQuery.AddEquipmentNamespace.MaintTypePagerData.PageAccessRights.toLowerCase() == "full_access") {
        jQuery("#" + btnAddMaintType).removeAttr('disabled');
        jQuery("#" + btnAddMaintType).prop("onclick", null);
        jQuery("#" + btnAddMaintType).unbind('click');
        jQuery("#" + btnAddMaintType).bind("click", function () { InsertOrUpdateMaintType(0); return false; });
    }
    else {
        jQuery("#" + btnAddMaintType).attr('disabled', 'disabled');
    }

    if (jQuery.AddEquipmentNamespace.MaintTypePagerData.PageAccessRights.toLowerCase() != "full_access") {
        jQuery("#" + btnAddMaintType).attr("disabled", "disabled");
    }
    var btnShowAll = "btnShowAll";
    if (jQuery.trim(jQuery("#txtNewMaintType").val()) == "" && jQuery.trim(jQuery("#txtMasterDescription").val()) == "" && jQuery.trim(jQuery("#txtSearchMaintType").val()) == "" && (jQuery("#" + btnShowAll).is(':visible') == false) && !isDelete) 
        jQuery("#divAddMaintenanceMasterDataModal").modal("hide");
    else {
        jQuery("#txtNewMaintType").val("");
        jQuery("#txtSearchMaintType").val("");
        jQuery("#txtMasterDescription").val("");
        autoheight('#txtMasterDescription');
        if (jQuery("#" + btnShowAll).is(':visible')) {
            jQuery("#" + btnShowAll).addClass('hide');
            LoadMaintTypesInfo(jQuery.AddEquipmentNamespace.MaintTypePagerData);
        }
    }

    if (jQuery("#divAddMaintenanceMasterDataModal").hasClass('ui-dialog-content')) {
        jQuery("#divAddMaintenanceMasterDataModal").dialog("close");
    }
}

function ShowHideMaintTypesInfo() {
    if (jQuery("#iconViewMaintTypes").hasClass("fa-plus-circle")) {
        var thMaintTypes = jQuery.AddEquipmentNamespace.MaintTypePagerData.LoadControlID.replace("divModelInfo", "thMaintTypes");
        jQuery("#" + thMaintTypes + " i").removeClass('fa-sort-up');
        jQuery("#" + thMaintTypes + " i").removeClass('fa-sort-down');
        jQuery("#hdfSortValue").val('');
        jQuery("#divMaintTypes").removeClass("hide");
        jQuery("#iconViewMaintTypes").removeClass("fa fa-plus-circle");
        jQuery("#iconViewMaintTypes").addClass("fa fa-minus-circle");

        var maintTypeAccess = jQuery.AddEquipmentNamespace.MaintTypePagerData.PageAccessRights.toLowerCase();
        if (maintTypeAccess == "full_access" || maintTypeAccess == "edit_only")
            maintenanceTypeUpdateViewModel.HasMaintTypeAccess = true;
        if (maintTypeAccess == "full_access") {
            maintenanceTypeUpdateViewModel.HasDeleteMaintTypeAccess = true;
        }
        LoadMaintTypesInfo(jQuery.AddEquipmentNamespace.MaintTypePagerData);
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
    masterDataFilterInfo.MasterDataType = jQuery.AddEquipmentNamespace.SelectedMasterDataType;

    if (jQuery.AddEquipmentNamespace.IsMaintTypeSearch == true) {
        if (jQuery.trim(jQuery("#txtSearchMaintType").val()) != "") {
            masterDataFilterInfo.SearchString = jQuery.trim(jQuery("#txtSearchMaintType").val());
        }
    }

    if (jQuery("#hdfSortValue").val() != "") {
        masterDataFilterInfo.SortType = jQuery("#hdfSortValue").val();
    }

    jQuery.ajax({
        type: "POST",
        url: jQuery.AddEquipmentNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetMaintMasterDataWithPager",
        data: JSON.stringify({ pagerData: pagerData, basicParam: jQuery.AddEquipmentNamespace.BasicParam, masterDataFilterInfo: masterDataFilterInfo }),
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
                maintenanceTypeUpdateViewModel.LoadErrorMessage(languageResource.resMsg_FailedToLoadMaintTypeInfo.replace("[XXX]", jQuery.AddEquipmentNamespace.SelectedMasterDataMessage.toLowerCase().toString()));
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
            var errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadMaintTypeInfo.replace("[XXX]", jQuery.AddEquipmentNamespace.SelectedMasterDataMessage.toLowerCase().toString());
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
    autoheight('#txtMasterDescription');
    var btnAddMaintType = jQuery.AddEquipmentNamespace.MaintTypePagerData.LoadControlID.replace("divModelInfo", "btnAddMaintType");
    jQuery("#" + btnAddMaintType).text(languageResource.resMsg_Update);
    if (jQuery.AddEquipmentNamespace.MaintTypePagerData.PageAccessRights.toLowerCase() == "full_access" || jQuery.AddEquipmentNamespace.MaintTypePagerData.PageAccessRights.toLowerCase() == "edit_only") {
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
    jQuery("#alertMessage").html(languageResource.resMsg_DeleteMaintTypeConfirm.replace("[XXX]", jQuery.AddEquipmentNamespace.SelectedMasterDataMessage.toLowerCase().toString()));
    jQuery("#confirmModal").dialog({
        zIndex: 1060,
        closeOnEscape: false,
        open: function (event, ui) {
            jQuery(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
            jQuery(".ui-widget-overlay").css('z-index', '10043');
        },
        modal: true,
        buttons: [
            {
                text: languageResource.resMsg_BtnConfirm,
                click: function () {
                    jQuery("#confirmModal").dialog("close");
                    DeleteMaintTypeInfo(maintTypeID);
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

function DeleteMaintTypeInfo(maintTypeID) {
    var masterDataInfo = {};
    masterDataInfo.MasterDataID = maintTypeID;

    jQuery.ajax({
        type: "POST",
        url: jQuery.AddEquipmentNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/DeleteMasterData",
        data: JSON.stringify({ basicParam: jQuery.AddEquipmentNamespace.BasicParam, masterDataInfo: masterDataInfo }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if (json.d != undefined && json.d != null && json.d > 0) {
                if (json.d == 2) {
                    ClearMaintenanceTypeInfo(true);
                    LoadMaintTypesInfo(jQuery.AddEquipmentNamespace.MaintTypePagerData);
                }
                else if (json.d == 1) {
                    var msg = languageResource.resMsg_MaterDataInfoInUse.replace("[XXX]", jQuery.AddEquipmentNamespace.SelectedMasterDataMessage.toLowerCase().toString());
                    ShowErrorMessage(msg, true);
                }
                if (!addEquipmentViewModel.CheckReferModel())
                    BindMaintenanceMasterInfo(false, jQuery.AddEquipmentNamespace.SelectedMasterDataType);
            }
            else {
                var msg = languageResource.resMsg_FailedToDeleteMaintTypeInfo.replace("[XXX]", jQuery.AddEquipmentNamespace.SelectedMasterDataMessage.toLowerCase().toString());
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
                    msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToDeleteMaintTypeInfo.replace("[XXX]", jQuery.AddEquipmentNamespace.SelectedMasterDataMessage.toLowerCase().toString());
            }
            else {
                msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToDeleteMaintTypeInfo.replace("[XXX]", jQuery.AddEquipmentNamespace.SelectedMasterDataMessage.toLowerCase().toString());
            }
            ShowErrorMessage(msg, true);
        },
    });
}

function InsertOrUpdateMaintType(maintTypeID) {
    jQuery("#spnAddMaintTypeError").removeClass('text-danger').removeClass('text-info');
    jQuery("#spnAddMaintTypeError").text('');
    if (jQuery.trim(jQuery("#txtNewMaintType").val()).length == 0) {
        jQuery("#spnAddMaintTypeError").addClass('text-danger');
        jQuery("#spnAddMaintTypeError").text(languageResource.resMsg_EnterMaintType.replace("[XXX]", jQuery.AddEquipmentNamespace.SelectedMasterDataMessage.toLowerCase().toString()));
    }
    else {
        var masterDataInfo = {};
        masterDataInfo.MasterDataID = maintTypeID;
        masterDataInfo.MasterDataName = jQuery.trim(jQuery("#txtNewMaintType").val());
        masterDataInfo.MasterDataType = jQuery.AddEquipmentNamespace.SelectedMasterDataType;
        masterDataInfo.Description = jQuery.trim(jQuery("#txtMasterDescription").val());
        jQuery.ajax({
            type: "POST",
            url: jQuery.AddEquipmentNamespace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/InsertUpdateMasterData",
            data: JSON.stringify({ basicParam: jQuery.AddEquipmentNamespace.BasicParam, masterDataInfo: masterDataInfo }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                if (json.d != undefined && json.d != null && json.d > 0) {
                    jQuery("#txtNewMaintType").val("");
                    jQuery("#txtMasterDescription").val("");
                    autoheight('#txtMasterDescription');
                    var btnAddMaintType = jQuery.AddEquipmentNamespace.MaintTypePagerData.LoadControlID.replace("divModelInfo", "btnAddMaintType");
                    jQuery("#" + btnAddMaintType).text(languageResource.resMsg_Add);
                    if (jQuery.AddEquipmentNamespace.MaintTypePagerData.PageAccessRights.toLowerCase() == "full_access") {
                        jQuery("#" + btnAddMaintType).removeAttr('disabled');
                        jQuery("#" + btnAddMaintType).prop("onclick", null);
                        jQuery("#" + btnAddMaintType).unbind('click');
                        jQuery("#" + btnAddMaintType).bind("click", function () { InsertOrUpdateMaintType(0); return false; });
                    }
                    else {
                        jQuery("#" + btnAddMaintType).attr('disabled', 'disabled');
                    }
                    jQuery("#spnAddMaintTypeError").addClass('text-info');
                    if (json.d == maintTypeID) {
                        jQuery("#spnAddMaintTypeError").text(languageResource.resMsg_UpdatedMaintType.replace("[XXX]", jQuery.AddEquipmentNamespace.SelectedMasterDataMessage.toLowerCase().toString()));
                    }
                    else {
                        jQuery("#spnAddMaintTypeError").text(languageResource.resMsg_InsertedMaintType.replace("[XXX]", jQuery.AddEquipmentNamespace.SelectedMasterDataMessage.toLowerCase().toString()));
                    }
                    LoadMaintTypesInfo(jQuery.AddEquipmentNamespace.MaintTypePagerData);
                    if (!addEquipmentViewModel.CheckReferModel()) {
                        BindMaintenanceMasterInfo(false, jQuery.AddEquipmentNamespace.SelectedMasterDataType);
                        if (jQuery.AddEquipmentNamespace.SelectedMasterDataType == jQuery.AddEquipmentNamespace.MasterDataType.Manufacturer) {
                            addEquipmentViewModel.SelectedManufacture(json.d);
                            jQuery("#drpManufacturer").select2();
                        }
                        else if (jQuery.AddEquipmentNamespace.SelectedMasterDataType == jQuery.AddEquipmentNamespace.MasterDataType.EquipmentType) {
                            addEquipmentViewModel.SelectedCategory(json.d);
                            jQuery("#drpEquipmentType").select2();
                        }
                        else if (jQuery.AddEquipmentNamespace.SelectedMasterDataType == jQuery.AddEquipmentNamespace.MasterDataType.EquipmentClass) {
                            addEquipmentViewModel.SelectedClass(json.d);
                            jQuery("#drpEquipmentClass").select2();
                        }
                    }
                }
                else {
                    if (json.d == -3) {
                        jQuery("#spnAddMaintTypeError").addClass('text-danger');
                        jQuery("#spnAddMaintTypeError").text(languageResource.resMsg_MaintenanceTypeAlreadyExists.replace("[XXX]", jQuery.AddEquipmentNamespace.SelectedMasterDataMessage.toLowerCase().toString()));
                    }
                    else {
                        var msg = languageResource.resMsg_FailedToInsertMaintTypeInfo.replace("[XXX]", jQuery.AddEquipmentNamespace.SelectedMasterDataMessage.toLowerCase().toString());
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
                        msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToInsertMaintTypeInfo.replace("[XXX]", jQuery.AddEquipmentNamespace.SelectedMasterDataMessage.toLowerCase().toString());
                }
                else {
                    msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToInsertMaintTypeInfo.replace("[XXX]", jQuery.AddEquipmentNamespace.SelectedMasterDataMessage.toLowerCase().toString());
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
        LoadMaintTypesInfo(jQuery.AddEquipmentNamespace.MaintTypePagerData);
        return false;
    }
    if (jQuery("#" + thValue + " i").hasClass('fa-sort-up')) {
        jQuery(".fa-sort-down").removeClass('fa fa-sort-down');
        jQuery(".fa-sort-up").removeClass('fa fa-sort-up');

        jQuery("#" + thValue + " i").addClass('fa fa-sort-down');
        thClass = value + "_desc";
        jQuery("#hdfSortValue").val(thClass);
        LoadMaintTypesInfo(jQuery.AddEquipmentNamespace.MaintTypePagerData);
        return false;
    }
    if (jQuery("#" + thValue + " i").hasClass('fa-sort-down')) {
        jQuery(".fa-sort-down").removeClass('fa fa-sort-down');
        jQuery(".fa-sort-up").removeClass('fa fa-sort-up');

        jQuery("#" + thValue + " i").addClass('fa fa-sort-up');
        thClass = value + "_asc";
        jQuery("#hdfSortValue").val(thClass);
        LoadMaintTypesInfo(jQuery.AddEquipmentNamespace.MaintTypePagerData);
        return false;
    }
}  

function SortByEquipmentName(thValue, value) {
    var thClass = "";
    var hasSortUpClassExist = jQuery("#" + thValue + " i").hasClass('fa fa-long-arrow-up');
    var hasSortDownExist = jQuery("#" + thValue + " i").hasClass('fa fa-long-arrow-down');

    if (hasSortUpClassExist == false && hasSortDownExist == false) {
        jQuery(".fa-long-arrow-down").removeClass('fa fa-long-arrow-down');
        jQuery(".fa-long-arrow-up").removeClass('fa fa-long-arrow-up');

        jQuery("#" + thValue + " i").addClass('fa fa-long-arrow-up');
        thClass = value + "_asc";
        jQuery("#hdnSortbyNameValue").val(thClass);
        LoadAllEquipmentInfo(jQuery.AddEquipmentNamespace.PagerData);

        return false;
    }
    if (jQuery("#" + thValue + " i").hasClass('fa fa-long-arrow-up')) {
        jQuery(".fa-long-arrow-down").removeClass('fa fa-long-arrow-down');
        jQuery(".fa-long-arrow-up").removeClass('fa fa-long-arrow-up');

        jQuery("#" + thValue + " i").addClass('fa fa-long-arrow-down');
        thClass = value + "_desc";
        jQuery("#hdnSortbyNameValue").val(thClass);
        LoadAllEquipmentInfo(jQuery.AddEquipmentNamespace.PagerData);

        return false;
    }
    if (jQuery("#" + thValue + " i").hasClass('fa-long-arrow-down')) {
        jQuery(".fa-long-arrow-down").removeClass('fa fa-long-arrow-down');
        jQuery(".fa-long-arrow-up").removeClass('fa fa-long-arrow-up');

        jQuery("#" + thValue + " i").addClass('fa fa-long-arrow-up');
        thClass = value + "_asc";
        jQuery("#hdnSortbyNameValue").val(thClass);
        LoadAllEquipmentInfo(jQuery.AddEquipmentNamespace.PagerData);

        return false;
    }
}

function DownloadBarcode() {
    var equipmentName = jQuery("#txtequipmentName").val();
    var barcodeText = jQuery("#txtequipmentCode").val().toUpperCase();
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
    if (equipmentName == undefined || equipmentName == "") {
        equipmentName = "Equip";
    }
    pdfMake.createPdf(docDefinition).download(equipmentName + "_Barcode.pdf");

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

    addEquipmentViewModel.SelectedWorkGroupInfoList.remove(function (item) {
        return item.TypeValue == workOrderID;
    });
}

function BindWorkSelectedWorkGroup() {
    addEquipmentViewModel.SelectedWorkGroupInfoList.removeAll();
    jQuery("#divDrpWorkGroup").find("li").removeAttr("disabled");
    jQuery("#drpWorkGroup").multipleSelect("setSelects", []);

    var isEquipmentWorkGroup = false;
    var locationID = addEquipmentViewModel.SelectedFunctionLocation();
    var parentEquipmentID = addEquipmentViewModel.SelectedParentEquipment();
    var equipmentID = addEquipmentViewModel.EquipmentID();

    var selectedWorkGroupList = [];    
    if (equipmentID > 0 && jQuery.AddEquipmentNamespace.ParentEquipmentID == parentEquipmentID && locationID == jQuery.AddEquipmentNamespace.LocationID) {
        selectedWorkGroupList = jQuery.AddEquipmentNamespace.AssignedWorkGroupInfo;
        if (selectedWorkGroupList.length > 0)
            isEquipmentWorkGroup = true
    }

    if (parentEquipmentID > 0 && selectedWorkGroupList.length == 0) {
        var equipmentInfo = ko.utils.arrayFirst(addEquipmentViewModel.ParentEquipmentList(), function (item) {
            return item.EquipmentID == parentEquipmentID;
        });

        if (equipmentInfo != null && equipmentInfo.AssignedWorkGroupList.length > 0)
            selectedWorkGroupList = equipmentInfo.AssignedWorkGroupList;
    }

    if (locationID > 0 && selectedWorkGroupList.length == 0) {
        var locationInfo = ko.utils.arrayFirst(addEquipmentViewModel.FunctionalLocationArray(), function (item) {
            return item.TypeValue == locationID;
        });

        if (locationInfo != null && locationInfo.AssignedWorkGroupList.length > 0)
            selectedWorkGroupList = locationInfo.AssignedWorkGroupList;
    }
   
    var parentEQOrLocationWGInfoList = [];
    if (parentEquipmentID > 0 || locationID > 0) {
        if (parentEquipmentID > 0) {
            var equipmentInfo = ko.utils.arrayFirst(addEquipmentViewModel.ParentEquipmentList(), function (item) {
                return item.EquipmentID == parentEquipmentID;
            });

            if (equipmentInfo != null)
                parentEQOrLocationWGInfoList = equipmentInfo.AssignedWorkGroupList;
        }
        else if (locationID > 0) {
            var locationInfo = ko.utils.arrayFirst(addEquipmentViewModel.FunctionalLocationArray(), function (item) {
                return item.TypeValue == locationID;
            });

            if (locationInfo != null)
                parentEQOrLocationWGInfoList = locationInfo.AssignedWorkGroupList;
        }        
    }    

    var selectedWorkGroupIDList = [];
    ko.utils.arrayForEach(selectedWorkGroupList, function (item, index) {

        var isExistsInParent = undefined;
        if (parentEQOrLocationWGInfoList.length > 0) {
            var parentItemInfo = ko.utils.arrayFirst(parentEQOrLocationWGInfoList, function (parentItem, index) {
                return parentItem.TypeValue == item.TypeValue;
            });

            isExistsInParent = false;
            if (parentItemInfo != null)
                isExistsInParent = true; 
        }       

        if (isExistsInParent == undefined || isExistsInParent == true) {
            var workGroupInfo = {};
            workGroupInfo.TypeValue = item.TypeValue;
            workGroupInfo.DisplayName = item.DisplayName;
            var userWorkGroup = ko.utils.arrayFirst(addEquipmentViewModel.WorkGroupList(), function (userItem, userItemIndex) {
                return userItem.TypeValue == item.TypeValue;
            });

            if (userWorkGroup != null) {
                workGroupInfo.IsUserWorkGroup = true;
                selectedWorkGroupIDList.push(item.TypeValue);
            }
            else {
                workGroupInfo.IsUserWorkGroup = false;
            }
            addEquipmentViewModel.SelectedWorkGroupInfoList.push(workGroupInfo);
        }
    });
    jQuery("#drpWorkGroup").multipleSelect("setSelects", selectedWorkGroupIDList);

    if (selectedWorkGroupIDList.length > 0) {
        var nonUserWorkGroupIDList = []; var selWorkGropInfoList = [];
        if (parentEquipmentID == 0 && locationID == 0) {
            selWorkGropInfoList = selectedWorkGroupList;
        }
        else {
            selWorkGropInfoList = parentEQOrLocationWGInfoList;          

            ko.utils.arrayForEach(addEquipmentViewModel.WorkGroupList(), function (item, index) {
                var parentRquipmentWGroup = ko.utils.arrayFirst(selWorkGropInfoList, function (parentWGroupInfo, locationItemIndex) {
                    return parentWGroupInfo.TypeValue == item.TypeValue;
                });

                if (parentRquipmentWGroup == null)
                    nonUserWorkGroupIDList.push(item.TypeValue);
            });

            if (nonUserWorkGroupIDList.length > 0) {
                jQuery("#divDrpWorkGroup input").each(function (index, element) {
                    var itemValue = parseInt(jQuery(element).attr("value"));
                    var itemIndex = nonUserWorkGroupIDList.indexOf(itemValue);
                    if (itemIndex >= 0) {
                        jQuery(element).closest("li").attr("disabled", "disabled");
                        jQuery(element).attr("disabled", "disabled");
                    }
                });
            }
        }
    }
    else if (parentEquipmentID > 0 || locationID > 0) {
        jQuery("#divDrpWorkGroup input").each(function (index, element) {
            jQuery(element).closest("li").attr("disabled", "disabled");
            jQuery(element).attr("disabled", "disabled");
        });
    }
}
