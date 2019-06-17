jQuery.MeasuringPointNameSpace = jQuery.MeasuringPointNameSpace || {};
jQuery.MeasuringPointNameSpace.BasicParam = jQuery.MeasuringPointNameSpace.BasicParam || {};
jQuery.MeasuringPointNameSpace.BasePath = "";
jQuery.MeasuringPointNameSpace.ServicePath = "";
jQuery.MeasuringPointNameSpace.UploaderPath = "";
jQuery.MeasuringPointNameSpace.ImagePath = "";
jQuery.MeasuringPointNameSpace.MeasuringPointImgPath = "";
jQuery.MeasuringPointNameSpace.MeasuringPointImageName = "";
jQuery.MeasuringPointNameSpace.ReadingType = { "Text": 'T', "Numeric": 'N', "Decimal": 'D', "Selection": 'S' };
jQuery.MeasuringPointNameSpace.SelectedMeasuringPointID = 0;
jQuery.MeasuringPointNameSpace.LoadControlID = "";
jQuery.MeasuringPointNameSpace.MasterDataType = { "Manufacturer": "M", "EquipmentType": "T", "EquipmentClass": "C", "MeasuringPointCategory": "P", "MPSelectionGroupCode": "G" };
jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo = { "Equipment_Model": 'M', "Equipment": 'E', "Functional_Location": 'L' };
jQuery.MeasuringPointNameSpace.InfoType = { "Equipment_Model": 'M', "Equipment": 'E', "Measuring_Point": 'P', "None": 'N' };
jQuery.MeasuringPointNameSpace.AdditionalLinksType = { "FunctionalLocation": 'L', "Equipment": 'E' };
jQuery.MeasuringPointNameSpace.MeasuringPointDataType = "";
jQuery.MeasuringPointNameSpace.ParentID = 0;
jQuery.MeasuringPointNameSpace.FLocationID = 0;
jQuery.MeasuringPointNameSpace.MeasuringPointID = 0;
jQuery.MeasuringPointNameSpace.restAPIServicePath = "";
jQuery.MeasuringPointNameSpace.CurrentlySelectedTag = "";
jQuery.MeasuringPointNameSpace.CurrentlySelectedTagUUID = "";
jQuery.MeasuringPointNameSpace.SelectedMasterDataType = "";
jQuery.MeasuringPointNameSpace.MaintTypePagerData = jQuery.MeasuringPointNameSpace.MaintTypePagerData || {};
jQuery.MeasuringPointNameSpace.SelectedMasterDataMessage = "";

var iframeValue = 0;
var measuringPointViewModel = {
    MeasuringPointList: ko.observableArray([]),
    SensorTypeList: ko.observableArray([]),
    SelectedSensorType: ko.observable(),
    SensorTypeUnitList: ko.observableArray([]),
    SelectedSensorTypeUnit: ko.observable(),
    ReadingTypeList: ko.observableArray([]),
    SelectedReadingType: ko.observable(),
    CategoryList: ko.observableArray([]),
    SelectedCategory: ko.observable(),
    GroupList: ko.observableArray([]),
    FunctionalLocationList: ko.observableArray([]),
    EquipmentList: ko.observableArray([]),
    EquipmentModelList: ko.observableArray([]),
    MeasuringPointDataTypeList: ko.observableArray([]),
    MeasuringPointDataTypeInfo: ko.observableArray([]),

    FLocationOrEquipOrModelList: ko.observableArray([]),
    EquipmentForLocList: ko.observableArray([]),

    SelectedFLocationOrEquipOrModel: ko.observable(0),
    SelectEquipmentForLocation: ko.observable(0),

    SelectFunctionalLocationFilter: ko.observable(0),
    SelectEquipmentFilter: ko.observable(0),
    SelectEquipmentModelFilter: ko.observable(0),
    SelectedMeasuringPointDataType: ko.observable(),
    SelectedMeasuringPointDataTypeInfo: ko.observable(0),
    ChangeEventBind: ko.observable(false),
    SelectedGroup: ko.observable(),
    MeasuringCode: ko.observable(''),
    MeasuringPointName: ko.observable(''),
    Position: ko.observable(''),
    Description: ko.observable(''),
    DecimalPlaces: ko.observable(''),
    UpperLimit: ko.observable(''),
    LowerLimit: ko.observable(''),
    UpperLimitWarn: ko.observable(''),
    LowerLimitWarn: ko.observable(''),
    MaxLength: ko.observable(''),
    DisplayName: ko.observable(''),
    EquipmentOrLocation: ko.observable(''),
    ParentID: ko.observable(''),
    LblMeasuringPointDataType: ko.observable(''),
    LoadErrorMessage: ko.observable(''),
    LoadErrorMessageClass: ko.observable(''),
    LoadMeasuringPointListError: ko.observable(''),
    LoadMeasuringPointListErrorClass: ko.observable(''),
    LoadMeasuringPointErrorMessageVisible: ko.observable(false),
    IsCounter: ko.observable(false),
    BtnGenerateCode: ko.observable(true),
    FdDecimal: ko.observable(false),
    FdNumeric: ko.observable(false),
    FdText: ko.observable(false),
    FdSelection: ko.observable(false),
    FdGenerateCode: ko.observable(true),
    FdMeasuringPointDataType: ko.observable(true),
    FdFuncLocFilter: ko.observable(false),
    FdEquipmentFilter: ko.observable(false),
    FdEquipModelFilter: ko.observable(false),

    FdFLocationOrEquipOrModel: ko.observable(false),
    FdEquipmentForLoc: ko.observable(false),
    LblFLocationOrEquipOrModel: ko.observable(false),

    HasDeleteAccess: false,
    HasEditAccess: false,
    ParentURLPath: ko.observable(''),
    ParentUrlName: ko.observable(''),
    DocumentPhotoURLPath: ko.observable('')
};

var maintenanceTypeViewModel = {
    LoadErrorMessageVisible: ko.observable(false),
    LoadErrorMessage: ko.observable(''),
    LoadErrorMessageClass: ko.observable(''),
    MaintTypePagerData: ko.observable(''),
    DefaultMaintenanceTypesArray: ko.observableArray([]),
    SelectionGroupItemName: ko.observableArray([]),
    DescOrItemName: ko.observable(''),
    HasMaintTypeAccess: false,
    HasDeleteMaintTypeAccess: false
}

function LoadMeasuringPointInfo(basicParam, basePath, webServicePath, imagePath, uploaderPath, measuringPointImgPath, restAPIServicePath, loadControlID, measuringPointDataType, equipmentID, fLocationID, measuringPointID, hasDeleteAccess, hasEditAccess, uploadImageAccess, maintTypePagerData) {
    jQuery.MeasuringPointNameSpace.BasicParam.SiteID = basicParam.SiteID;
    jQuery.MeasuringPointNameSpace.BasicParam.UserID = basicParam.UserID;
    jQuery.MeasuringPointNameSpace.BasePath = basePath;
    jQuery.MeasuringPointNameSpace.ServicePath = webServicePath;
    jQuery.MeasuringPointNameSpace.LoadControlID = loadControlID;
    jQuery.MeasuringPointNameSpace.ImagePath = imagePath;
    jQuery.MeasuringPointNameSpace.UploaderPath = uploaderPath;
    jQuery.MeasuringPointNameSpace.MeasuringPointImgPath = measuringPointImgPath;
    jQuery.MeasuringPointNameSpace.ParentID = equipmentID; //EQUIPMENT ID,EQUIPMENT_MODEL ID
    jQuery.MeasuringPointNameSpace.FLocationID = fLocationID;//FUNCTIONAL LOCATION ID
    jQuery.MeasuringPointNameSpace.MeasuringPointID = measuringPointID;
    jQuery.MeasuringPointNameSpace.MeasuringPointDataType = measuringPointDataType;
    jQuery.MeasuringPointNameSpace.restAPIServicePath = restAPIServicePath;
    jQuery.MeasuringPointNameSpace.MaintTypePagerData = maintTypePagerData;

    measuringPointViewModel.HasDeleteAccess = hasDeleteAccess === "True" ? true : false;
    measuringPointViewModel.HasEditAccess = hasEditAccess === "True" ? true : false;

    if (uploadImageAccess != "True") {
        jQuery("#imageFileToUpload").attr('disabled', 'disabled');
    }
    if (jQuery.MeasuringPointNameSpace.MeasuringPointDataType == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment_Model) {
        measuringPointViewModel.FdGenerateCode(false);
        measuringPointViewModel.FdMeasuringPointDataType(false);
        measuringPointViewModel.FdEquipModelFilter(true);
        measuringPointViewModel.FdFLocationOrEquipOrModel(true);
        measuringPointViewModel.LblFLocationOrEquipOrModel(languageResource.resMsg_EquipmentModel);    
        jQuery("#divUrlLink").removeClass("hide");
        jQuery("#lnkEquipmentInfo").removeClass("hide");
        jQuery("#lnkEquipmentInfo").removeClass("btn-success");
        jQuery("#lnkEquipmentInfo").addClass("btn-primary");
        jQuery("#lnkEquipmentInfo").text(languageResource.resMsg_AddEquipmentsModel);

    }
    else if (jQuery.MeasuringPointNameSpace.MeasuringPointDataType == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment) {
        measuringPointViewModel.FdGenerateCode(true);
        measuringPointViewModel.FdMeasuringPointDataType(false);
        measuringPointViewModel.FdEquipmentFilter(true);
        measuringPointViewModel.FdFLocationOrEquipOrModel(true);
        jQuery("#divUrlLink").removeClass("hide");
        if (jQuery.MeasuringPointNameSpace.FLocationID > 0) {
            measuringPointViewModel.FdFuncLocFilter(true);
            measuringPointViewModel.FdEquipmentForLoc(true);
            jQuery("#lnkFLocation").removeClass("hide");
            measuringPointViewModel.LblFLocationOrEquipOrModel(languageResource.resMsg_FunctionalLocation);
        }
        else {
            jQuery("#lnkEquipmentInfo").removeClass("btn-success");
            jQuery("#lnkEquipmentInfo").addClass("btn-primary");
            measuringPointViewModel.LblFLocationOrEquipOrModel(languageResource.resMsg_Equipment);
        }
        jQuery("#lnkEquipmentInfo").removeClass("hide");
        jQuery("#lnkEquipmentInfo").text(languageResource.resMsg_AddEquipments);

    }
    else if (jQuery.MeasuringPointNameSpace.MeasuringPointDataType == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Functional_Location) {
        measuringPointViewModel.FdGenerateCode(true);
        measuringPointViewModel.FdMeasuringPointDataType(false);
        measuringPointViewModel.FdFuncLocFilter(true);
        measuringPointViewModel.FdFLocationOrEquipOrModel(true);
        measuringPointViewModel.LblFLocationOrEquipOrModel(languageResource.resMsg_FunctionalLocation);      
        jQuery("#divUrlLink").removeClass("hide");
        jQuery("#lnkFLocation").removeClass("hide");
        jQuery("#lnkFLocation").text(languageResource.resMsg_AddViewFLocation)
    }
    else {
        measuringPointViewModel.FdGenerateCode(false);
        measuringPointViewModel.FdFuncLocFilter(true);
        measuringPointViewModel.FdEquipModelFilter(true);
        measuringPointViewModel.FdEquipmentFilter(true);
        measuringPointViewModel.FdFLocationOrEquipOrModel(false);
        measuringPointViewModel.FdEquipmentForLoc(false);
    }
    measuringPointViewModel.ChangeEventBind(true);
    jQuery('.select2').select2();
    jQuery("#imgMeasuringPointImage").attr('src', jQuery.MeasuringPointNameSpace.ImagePath);
    ko.applyBindings(measuringPointViewModel, document.getElementById("divMeasuringPointList"));
    ko.applyBindings(measuringPointViewModel, document.getElementById("divMeasuringPointUC"));
    ko.applyBindings(maintenanceTypeViewModel, document.getElementById("divAddMaintenanceMasterDataModal"));

    GetMeasuringPointList();
    if (jQuery.MeasuringPointNameSpace.MeasuringPointID > 0) {
        LoadSelectedMeasuringPoint(jQuery.MeasuringPointNameSpace.MeasuringPointID);
    }

    jQuery("#btnOpc").click(function () {
        jQuery("#opcHide").addClass("info-block");
        hideTheTestDiv();
        return false;
    });


    var index = 1;
    jQuery('#divOPCNodeTree').on("select_node.jstree", function (e, data) {
        //Use below section if you want to disable tree expansion on double click of a node.
        //        if (data.node.children.length) {
        //            e.preventDefault(); // may not be necessary
        //            e.stopImmediatePropagation();
        //            // uncomment below if you wish to have the parent item open/close the tree when double clicked
        //            return data.instance.toggle_node(data.node);

        //        }
        // showMessage("", false);
        if (data.node.data.isVariable == true) {
            jQuery('#spanTagSerachError').html('');
            jQuery("#txtConnecttoTag").val(data.node.data.description);
            jQuery.MeasuringPointNameSpace.CurrentlySelectedTag = data.node.data.description;
            jQuery.MeasuringPointNameSpace.CurrentlySelectedTagUUID = data.node.data.opcNodeId;
            jQuery("#btnSelectTag").removeClass("hide");
        }
        else {
            jQuery("#txtConnecttoTag").val("");
            jQuery.MeasuringPointNameSpace.CurrentlySelectedTag = "";
            jQuery.MeasuringPointNameSpace.CurrentlySelectedTagUUID = "";
            jQuery("#btnSelectTag").addClass("hide");
            return;
        }

        //Making a call to the server to check if the selected tag is alredy configured if yes then show the details of the tag on the screen

    })
        .on('loaded.jstree', function (e, data) {
        })
        .on('open_node.jstree close_node.jstree', function (e, data) {
            jQuery('#opcNodeFetchingError').html('');
        })
        .jstree({
            //        'plugins': ["checkbox", "types"],
            //        'checkbox': {
            //            "keep_selected_style": false,
            //            "tie_selection": false,
            //            "three_state": false
            //        },
            'core': {
                'data': {
                    'type': 'POST',
                    'cache': false,
                    'contentType': 'application/json',
                    'url': jQuery.MeasuringPointNameSpace.ServicePath + "/Vegam_MaintenanceService.asmx/LoadOPCUUIDInfoTags",
                    'data': function (node) {
                        var opcTagId = "";
                        var opcTagFilterInfo = {};
                        var UUIDProperties = {};
                        var gateWayServiceID = 0;
                        var dataSourceID = jQuery("#drpDataSourceList").val();
                        if (dataSourceID > 0) {
                            opcTagFilterInfo.TagName = jQuery("#txtTagName").val().trim().length > 0 ? jQuery("#txtTagName").val() : "";
                            UUIDProperties.TransducerType = "";
                            opcTagFilterInfo.UUIDProperties = UUIDProperties;
                            if (node.id != "#") {
                                opcTagId = node.data.opcNodeId;
                                gateWayServiceID = node.data.GatewayID;
                                opcTagFilterInfo.ServerID = node.data.ServerID;
                            }
                        }
                        return JSON.stringify({ nodeId: node.id, index: index, siteID: jQuery.MeasuringPointNameSpace.BasicParam.SiteID, dataSourceID: dataSourceID, gatewayServiceID: gateWayServiceID, opcTagFilterInfo: opcTagFilterInfo });
                    },
                    'success': function (data) {
                        if (data.d != null) {
                            if (data.d != "") {
                                var length = data.d.length - 1;
                                index = data.d[length].data.index;
                            }
                        }
                        jQuery("#divOPCNodeTree").removeClass("hide");
                        jQuery("#divOPCTags").removeClass("hide");
                        if (data.d == undefined || data.d.length == 0)
                            jQuery("#opcNodeFetchingError").html(languageResource.resMsg_Serversfound);
                        return data.d;
                    },
                    beforeSend: function () {
                        jQuery("#divTagProgress").show();
                    },
                    complete: function () {
                        jQuery("#divTagProgress").hide();
                    },
                    error: function (request, error) {
                        jQuery("#divOPCNodeTree").addClass("hide");
                        if (request.responseText != "") {
                            var errorMsg = jQuery.parseJSON(request.responseText);
                            if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null) {
                                jQuery("#opcNodeFetchingError").html("<span class='text-danger font-small span5'>" + languageResource.resMsg_Error + errorMsg.Message + "</span>");
                            }
                            else {
                                jQuery("#opcNodeFetchingError").html("<span class='text-danger font-small span5'>" + languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadOPCNodeInfo + "</span>");
                            }
                        }
                        else {
                            jQuery("#opcNodeFetchingError").html("<span class='text-danger font-small span5'>" + languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadOPCNodeInfo + "</span>");
                        }
                    }
                }
            }

        });
}

function ViewAdditionalInfoLinks(additionalLinksType) {
    var queryString = "?id=" + jQuery.MeasuringPointNameSpace.BasicParam.SiteID;

    if (additionalLinksType == jQuery.MeasuringPointNameSpace.AdditionalLinksType.FunctionalLocation) {
        if (jQuery.MeasuringPointNameSpace.FLocationID > 0 && jQuery.MeasuringPointNameSpace.ParentID > 0) {
            var fLocationQueryString = queryString + "&eid=" + jQuery.MeasuringPointNameSpace.ParentID + "&flid=" + jQuery.MeasuringPointNameSpace.FLocationID;
            window.location.href = jQuery.MeasuringPointNameSpace.BasePath + "/Preventive/AddFunctionalLocation.aspx" + fLocationQueryString
        }
        else if (jQuery.MeasuringPointNameSpace.FLocationID > 0 && jQuery.MeasuringPointNameSpace.ParentID == 0) {
            var fLocationQueryString = queryString + "&flid=" + jQuery.MeasuringPointNameSpace.FLocationID;
            window.location.href = jQuery.MeasuringPointNameSpace.BasePath + "/Preventive/AddFunctionalLocation.aspx" + fLocationQueryString;
        }
        else if (jQuery.MeasuringPointNameSpace.FLocationID == 0) {
            var fLocationQueryString = queryString;
            window.location.href = jQuery.MeasuringPointNameSpace.BasePath + "/Preventive/AddFunctionalLocation.aspx" + fLocationQueryString;
        }
    }
    else if (additionalLinksType == jQuery.MeasuringPointNameSpace.AdditionalLinksType.Equipment) {
        if (jQuery.MeasuringPointNameSpace.MeasuringPointDataType == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment_Model) {
            var equipmentQueryString = queryString + "&eid=" + jQuery.MeasuringPointNameSpace.ParentID;
            window.location.href = jQuery.MeasuringPointNameSpace.BasePath + "/Preventive/AddEquipmentModel.aspx" + equipmentQueryString;
        }
        else if (jQuery.MeasuringPointNameSpace.MeasuringPointDataType == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment) {
            var equipmentQueryString = queryString + "&eid=" + jQuery.MeasuringPointNameSpace.ParentID + "&flid=" + jQuery.MeasuringPointNameSpace.FLocationID;
            window.location.href = jQuery.MeasuringPointNameSpace.BasePath + "/Preventive/AddEquipmentInfo.aspx" + equipmentQueryString;
        }

    }

}

function BindIconAttributes(hasAccess) {
    var iconAttributes = {};
    if (!hasAccess) {
        iconAttributes.disabled = "disabled";
    }
    return iconAttributes;
}

function GetMeasuringPointList() {
    LoadSensorType();
    LoadReadingType();
    LoadMasterDataDropDown(true);
    if (jQuery.MeasuringPointNameSpace.MeasuringPointDataType == "") {
        LoadMeasuringPointDataType();
    }
    LoadMeasuringPointDataTypeFilter(true);
    LoadMeasuringPointList();
}

function LoadMeasuringPointDataTypeFilter(pageLoad) {

    var selectedValue = measuringPointViewModel.SelectedMeasuringPointDataType();
    if (selectedValue == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment_Model) {
        measuringPointViewModel.FdGenerateCode(false);
        measuringPointViewModel.MeasuringCode('');
        measuringPointViewModel.BtnGenerateCode(true);
        measuringPointViewModel.LblMeasuringPointDataType(languageResource.resMsg_EquipmentModel);
    }
    else if (selectedValue == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment) {
        measuringPointViewModel.FdGenerateCode(true);
        measuringPointViewModel.BtnGenerateCode(true);
        measuringPointViewModel.LblMeasuringPointDataType(languageResource.resMsg_Equipment);
    }
    else if (selectedValue == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Functional_Location) {
        measuringPointViewModel.FdGenerateCode(true);
        measuringPointViewModel.BtnGenerateCode(true);
        measuringPointViewModel.LblMeasuringPointDataType(languageResource.resMsg_FunctionalLocation);
    }

    if (pageLoad) {
        var measuringPointDataTypeFilterInfo = {}
        measuringPointDataTypeFilterInfo.MeasuringPointDataTypeList = [];
        if (jQuery.MeasuringPointNameSpace.MeasuringPointDataType == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Functional_Location || jQuery.MeasuringPointNameSpace.FLocationID > 0
            || jQuery.MeasuringPointNameSpace.MeasuringPointDataType == "") {
            var measuringPointDataTypeInfo = {};
            measuringPointDataTypeInfo.TypeValue = 0;
            measuringPointDataTypeInfo.DisplayName = languageResource.resMsg_PleaseSelect;
            measuringPointViewModel.FunctionalLocationList.removeAll();
            measuringPointViewModel.ChangeEventBind(false);
            measuringPointViewModel.FunctionalLocationList.push(measuringPointDataTypeInfo);

            if (jQuery.MeasuringPointNameSpace.MeasuringPointDataType != "") {
                measuringPointViewModel.FLocationOrEquipOrModelList.removeAll();
                measuringPointViewModel.ChangeEventBind(false);
                measuringPointViewModel.FLocationOrEquipOrModelList.push(measuringPointDataTypeInfo);
            }
            measuringPointDataTypeFilterInfo.MeasuringPointDataTypeList.push(jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Functional_Location.charCodeAt());
        }
        if (jQuery.MeasuringPointNameSpace.MeasuringPointDataType == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment || jQuery.MeasuringPointNameSpace.MeasuringPointDataType == "") {
            var measuringPointDataTypeInfo = {};
            measuringPointDataTypeInfo.TypeValue = 0;
            measuringPointDataTypeInfo.DisplayName = languageResource.resMsg_PleaseSelect;
            measuringPointViewModel.EquipmentList.removeAll();
            measuringPointViewModel.ChangeEventBind(false);
            measuringPointViewModel.EquipmentList.push(measuringPointDataTypeInfo);
            measuringPointDataTypeFilterInfo.MeasuringPointDataTypeList.push(jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment.charCodeAt());
            if (jQuery.MeasuringPointNameSpace.FLocationID > 0) {
                measuringPointDataTypeFilterInfo.MeasuringPointDataTypeList.push(jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Functional_Location.charCodeAt());
            }
        }
        if (jQuery.MeasuringPointNameSpace.MeasuringPointDataType == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment_Model || jQuery.MeasuringPointNameSpace.MeasuringPointDataType == "") {
            var measuringPointDataTypeInfo = {};
            measuringPointDataTypeInfo.TypeValue = 0;
            measuringPointDataTypeInfo.DisplayName = languageResource.resMsg_PleaseSelect;
            measuringPointViewModel.EquipmentModelList.removeAll();
            measuringPointViewModel.ChangeEventBind(false);
            measuringPointViewModel.EquipmentModelList.push(measuringPointDataTypeInfo);
            measuringPointDataTypeFilterInfo.MeasuringPointDataTypeList.push(jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment_Model.charCodeAt());

            if (jQuery.MeasuringPointNameSpace.MeasuringPointDataType != "") {
                measuringPointViewModel.EquipmentForLocList.removeAll();
                measuringPointViewModel.ChangeEventBind(false);
                measuringPointViewModel.EquipmentForLocList.push(measuringPointDataTypeInfo);
            }
        }
        if (jQuery.MeasuringPointNameSpace.MeasuringPointDataType != "") {
            var measuringPointDataTypeInfo = {};
            measuringPointDataTypeInfo.TypeValue = 0;
            measuringPointDataTypeInfo.DisplayName = languageResource.resMsg_PleaseSelect;
            measuringPointViewModel.FLocationOrEquipOrModelList.removeAll();
            measuringPointViewModel.ChangeEventBind(false);
            measuringPointViewModel.FLocationOrEquipOrModelList.push(measuringPointDataTypeInfo);
        }
    }
    else {

        var measuringPointDataTypeInfo = {};
        measuringPointDataTypeInfo.TypeValue = 0;
        measuringPointDataTypeInfo.DisplayName = languageResource.resMsg_PleaseSelect;
        measuringPointViewModel.MeasuringPointDataTypeInfo.removeAll();
        measuringPointViewModel.MeasuringPointDataTypeInfo.push(measuringPointDataTypeInfo);

        var measuringPointDataTypeFilterInfo = {}
        measuringPointDataTypeFilterInfo.MeasuringPointDataTypeList = [];

        if (measuringPointViewModel.SelectedMeasuringPointDataType() == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment_Model) {
            measuringPointDataTypeFilterInfo.MeasuringPointDataTypeList.push(jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment_Model.charCodeAt());
        }
        else if (measuringPointViewModel.SelectedMeasuringPointDataType() == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment) {
            measuringPointDataTypeFilterInfo.MeasuringPointDataTypeList.push(jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment.charCodeAt());
        }
        else {
            measuringPointDataTypeFilterInfo.MeasuringPointDataTypeList.push(jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Functional_Location.charCodeAt());

        }
    }
    measuringPointDataTypeFilterInfo.SiteID = jQuery.MeasuringPointNameSpace.BasicParam.SiteID;
    measuringPointDataTypeFilterInfo.UserID = jQuery.MeasuringPointNameSpace.BasicParam.UserID;

    jQuery.ajax({
        type: "POST",
        url: jQuery.MeasuringPointNameSpace.ServicePath + "/Vegam_MaintenanceService.asmx/GetMeasuringPointDropDownDataInfo",
        data: JSON.stringify({ basicParam: jQuery.MeasuringPointNameSpace.BasicParam, measuringPointDataTypeFilterInfo: measuringPointDataTypeFilterInfo }),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (data) {
            if (data.d != undefined) {
                var measuringPointDataTypeList = data.d;
                if (pageLoad) {
                    jQuery.each(measuringPointDataTypeList.FunctionalLocationList, function (i, fLocation) {
                        var fLocationInfo = {};
                        fLocationInfo.TypeValue = fLocation.FunctionalLocationID;
                        fLocationInfo.DisplayName = fLocation.FunctionalLocationName;
                        measuringPointViewModel.FunctionalLocationList.push(fLocationInfo);
                        if (jQuery.MeasuringPointNameSpace.MeasuringPointDataType != "")
                            measuringPointViewModel.FLocationOrEquipOrModelList.push(fLocationInfo);
                    });
                    if ((jQuery.MeasuringPointNameSpace.MeasuringPointDataType == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment && jQuery.MeasuringPointNameSpace.FLocationID == 0)
                        || jQuery.MeasuringPointNameSpace.MeasuringPointDataType == "") {
                        jQuery.each(measuringPointDataTypeList.EquipmentList, function (i, equipmentList) {
                            var equipmentListInfo = {};
                            equipmentListInfo.TypeValue = equipmentList.EquipmentID;
                            equipmentListInfo.DisplayName = equipmentList.EquipmentName;
                            measuringPointViewModel.EquipmentList.push(equipmentListInfo);
                            if (jQuery.MeasuringPointNameSpace.MeasuringPointDataType != "")
                                measuringPointViewModel.FLocationOrEquipOrModelList.push(equipmentListInfo);
                        });
                    }
                    jQuery.each(measuringPointDataTypeList.EquipmentModelList, function (i, equipmentModelList) {
                        var equipmentModelListInfo = {};
                        equipmentModelListInfo.TypeValue = equipmentModelList.EquipmentID;
                        equipmentModelListInfo.DisplayName = equipmentModelList.EquipmentName;
                        measuringPointViewModel.EquipmentModelList.push(equipmentModelListInfo);
                        if (jQuery.MeasuringPointNameSpace.MeasuringPointDataType != "")
                            measuringPointViewModel.FLocationOrEquipOrModelList.push(equipmentModelListInfo);
                    });

                    if (jQuery.MeasuringPointNameSpace.MeasuringPointDataType == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment_Model) {
                        measuringPointViewModel.SelectEquipmentModelFilter(jQuery.MeasuringPointNameSpace.ParentID);
                        measuringPointViewModel.SelectedFLocationOrEquipOrModel(jQuery.MeasuringPointNameSpace.ParentID);
                    }
                    else if (jQuery.MeasuringPointNameSpace.MeasuringPointDataType == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Functional_Location) {
                        measuringPointViewModel.SelectFunctionalLocationFilter(jQuery.MeasuringPointNameSpace.FLocationID);
                        measuringPointViewModel.SelectedFLocationOrEquipOrModel(jQuery.MeasuringPointNameSpace.FLocationID);
                    }
                    else if (jQuery.MeasuringPointNameSpace.MeasuringPointDataType == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment) {
                        if (jQuery.MeasuringPointNameSpace.FLocationID > 0) {
                            measuringPointViewModel.ChangeEventBind(false);
                            measuringPointViewModel.SelectFunctionalLocationFilter(jQuery.MeasuringPointNameSpace.FLocationID);
                            measuringPointViewModel.SelectedFLocationOrEquipOrModel(jQuery.MeasuringPointNameSpace.FLocationID);
                            LoadAllEquipmentInfo(true, true, false);
                        }
                        else {
                            measuringPointViewModel.ChangeEventBind(false);
                            measuringPointViewModel.SelectEquipmentFilter(jQuery.MeasuringPointNameSpace.ParentID);
                            measuringPointViewModel.SelectedFLocationOrEquipOrModel(jQuery.MeasuringPointNameSpace.ParentID);
                        }
                    }
                }

                else {
                    if (measuringPointViewModel.SelectedMeasuringPointDataType() == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Functional_Location) {
                        jQuery.each(measuringPointDataTypeList.FunctionalLocationList, function (i, fLocation) {
                            var fLocationInfo = {};
                            fLocationInfo.TypeValue = fLocation.FunctionalLocationID;
                            fLocationInfo.DisplayName = fLocation.FunctionalLocationName;
                            measuringPointViewModel.MeasuringPointDataTypeInfo.push(fLocationInfo);
                        });
                    }
                    else if (measuringPointViewModel.SelectedMeasuringPointDataType() == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment) {
                        jQuery.each(measuringPointDataTypeList.EquipmentList, function (i, equipmentList) {
                            var equipmentListInfo = {};
                            equipmentListInfo.TypeValue = equipmentList.EquipmentID;
                            equipmentListInfo.DisplayName = equipmentList.EquipmentName;
                            measuringPointViewModel.MeasuringPointDataTypeInfo.push(equipmentListInfo);
                        });
                    }
                    else {
                        jQuery.each(measuringPointDataTypeList.EquipmentModelList, function (i, equipmentModelList) {
                            var equipmentModelListInfo = {};
                            equipmentModelListInfo.TypeValue = equipmentModelList.EquipmentID;
                            equipmentModelListInfo.DisplayName = equipmentModelList.EquipmentName;
                            measuringPointViewModel.MeasuringPointDataTypeInfo.push(equipmentModelListInfo);
                        });
                    }
                    jQuery("#drpMeasuringPointDataTypeInfo").val(measuringPointViewModel.SelectedMeasuringPointDataTypeInfo()).trigger("change");
                }

            }
            else {
                ShowMessage(languageResource.resMsg_FailedToLoadMeasuringPointDataTypeInfo, "error");
            }
        },
        error: function (request, error) {
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                    ShowMessage(errorMsg.Message, "error");
                else {
                    ShowMessage(languageResource.resMsg_FailedToLoadMeasuringPointDataTypeInfo, "error");
                }
            }
            else {
                ShowMessage(languageResource.resMsg_FailedToLoadMeasuringPointDataTypeInfo, "error");
            }
        }
    });
}

function LoadSensorType() {
    jQuery.ajax({
        type: "POST",
        url: jQuery.MeasuringPointNameSpace.ServicePath + "/Vegam_MaintenanceService.asmx/GetSensorTypeInfo",
        data: JSON.stringify({ basicParam: jQuery.MeasuringPointNameSpace.BasicParam }),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (data) {
            if (data.d != undefined) {
                var sensorTypeObj = {};
                //bind sensor type dropdownlist
                sensorTypeObj.DisplayName = languageResource.resMsg_PleaseSelect;
                sensorTypeObj.TypeValue = 0;

                measuringPointViewModel.SensorTypeList.removeAll();
                measuringPointViewModel.SensorTypeList.push(sensorTypeObj);

                ko.utils.arrayForEach(data.d, function (sensorTypeInfo) {
                    measuringPointViewModel.SensorTypeList.push(sensorTypeInfo);
                });
            }
            else {
                ShowErrorMessage(languageResource.resMsg_FailedToLoadSensorType, true);
            }
        },
        error: function (request, error) {
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                    ShowErrorMessage(languageResource.resMsg_Error + errorMsg.Message, true);
                else
                    ShowErrorMessage(languageResource.resMsg_FailedToLoadSensorType, true);
            }
            else {
                ShowErrorMessage(languageResource.resMsg_FailedToLoadSensorType, true);
            }
        }
    });
}

function LoadSensorUnitInfo() {
    var selectedValue = jQuery.trim(jQuery("#drpSensorType option:selected").val());
    jQuery.ajax({
        type: "POST",
        url: jQuery.MeasuringPointNameSpace.ServicePath + "/Vegam_MaintenanceService.asmx/GetSensorUnitInfo",
        data: JSON.stringify({ basicParam: jQuery.MeasuringPointNameSpace.BasicParam, sensorTypeID: selectedValue }),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (data) {
            if (data.d != undefined) {
                var sensorTypeObj = {};
                //bind sensor type dropdownlist
                sensorTypeObj.DisplayName = languageResource.resMsg_PleaseSelect;
                sensorTypeObj.TypeValue = 0;

                measuringPointViewModel.SensorTypeUnitList.removeAll();
                measuringPointViewModel.SensorTypeUnitList.push(sensorTypeObj);

                ko.utils.arrayForEach(data.d, function (sensorTypeUnit) {
                    measuringPointViewModel.SensorTypeUnitList.push(sensorTypeUnit);
                });
            }
            else {
                ShowErrorMessage(languageResource.resMsg_FailedToLoadSensorType, true);
            }
        },
        error: function (request, error) {
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                    ShowErrorMessage(languageResource.resMsg_Error + errorMsg.Message, true);
                else
                    ShowErrorMessage(languageResource.resMsg_FailedToLoadSensorType, true);
            }
            else {
                ShowErrorMessage(languageResource.resMsg_FailedToLoadSensorType, true);
            }
        }
    });
}

function LoadReadingType() {
    var readingTypeObj = {};
    measuringPointViewModel.ReadingTypeList.removeAll();

    jQuery.each(jQuery.MeasuringPointNameSpace.ReadingType, function (value, key) {
        readingTypeObj.TypeValue = key;
        readingTypeObj.DisplayName = value;
        measuringPointViewModel.ReadingTypeList.push(readingTypeObj);
    });
}

function LoadMasterDataDropDown(isPageLoad, masterDataType) {
    if (isPageLoad || masterDataType == jQuery.MeasuringPointNameSpace.MasterDataType.MeasuringPointCategory) {
        var masterDataInfo = {};
        masterDataInfo.TypeValue = 0;
        masterDataInfo.DisplayName = languageResource.resMsg_PleaseSelect;
        measuringPointViewModel.CategoryList.removeAll();
        measuringPointViewModel.CategoryList.push(masterDataInfo);
    }
    if (isPageLoad || masterDataType == jQuery.MeasuringPointNameSpace.MasterDataType.MPSelectionGroupCode) {
        var masterDataInfo = {};
        masterDataInfo.TypeValue = 0;
        masterDataInfo.DisplayName = languageResource.resMsg_PleaseSelect;
        measuringPointViewModel.GroupList.removeAll();
        measuringPointViewModel.GroupList.push(masterDataInfo);
    }

    var masterDataDropDownListFilterInfo = {}
    masterDataDropDownListFilterInfo.MasterDataTypeList = [];
    if (isPageLoad || masterDataType == jQuery.MeasuringPointNameSpace.MasterDataType.MeasuringPointCategory) {
        masterDataDropDownListFilterInfo.MasterDataTypeList.push(jQuery.MeasuringPointNameSpace.MasterDataType.MeasuringPointCategory.charCodeAt());
    }
    if (isPageLoad || masterDataType == jQuery.MeasuringPointNameSpace.MasterDataType.MPSelectionGroupCode)
        masterDataDropDownListFilterInfo.MasterDataTypeList.push(jQuery.MeasuringPointNameSpace.MasterDataType.MPSelectionGroupCode.charCodeAt());


    jQuery.ajax({
        type: "POST",
        url: jQuery.MeasuringPointNameSpace.ServicePath + "/Vegam_MaintenanceService.asmx/GetAllMaintMasterDropDownDataInfo",
        data: JSON.stringify({ basicParam: jQuery.MeasuringPointNameSpace.BasicParam, masterDataDropDownListFilterInfo: masterDataDropDownListFilterInfo }),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (data) {
            if (data.d != undefined) {
                var masterDataDropDownList = data.d;
                if (isPageLoad || masterDataType == jQuery.MeasuringPointNameSpace.MasterDataType.MeasuringPointCategory) {
                    jQuery.each(masterDataDropDownList.MPcategoryInfoList, function (i, object) {
                        measuringPointViewModel.CategoryList.push(object);
                    });
                }
                if (isPageLoad || masterDataType == jQuery.MeasuringPointNameSpace.MasterDataType.MPSelectionGroupCode) {
                    jQuery.each(masterDataDropDownList.MPGroupList, function (i, object) {
                        measuringPointViewModel.GroupList.push(object);
                    });
                }
            }
            else {
                ShowMessage(languageResource.resMsg_FailedToLoadMasterDataDropDown, "error");

            }
        },
        error: function (request, error) {
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                    ShowMessage(errorMsg.Message, "error");
                else {
                    ShowMessage(languageResource.resMsg_FailedToLoadMasterDataDropDown, "error");
                }
            }
            else {

                ShowMessage(languageResource.resMsg_FailedToLoadMasterDataDropDown, "error");

            }
        }
    });
}

function LoadMeasuringPointDataType() {
    var measuringPointDataTypeObj = {};
    measuringPointViewModel.MeasuringPointDataTypeList.removeAll();

    jQuery.each(jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo, function (value, key) {
        measuringPointDataTypeObj.TypeValue = key;
        measuringPointDataTypeObj.DisplayName = value.replace('_', ' ');
        measuringPointViewModel.MeasuringPointDataTypeList.push(measuringPointDataTypeObj);
    });
}

function HideAndShowFieldSet() {
    var selectedValue = jQuery.trim(jQuery("#drpReadingType option:selected").val());
    // var selectedValue = measuringPointViewModel.SelectedReadingType();
    if (selectedValue == jQuery.MeasuringPointNameSpace.ReadingType.Decimal) {
        measuringPointViewModel.FdText(false);
        measuringPointViewModel.FdDecimal(true);
        measuringPointViewModel.FdSelection(false);
        measuringPointViewModel.FdNumeric(false);
        measuringPointViewModel.MaxLength('');
        if (iframeValue == 0)
            resizeIframe(100);
    }
    else if (selectedValue == jQuery.MeasuringPointNameSpace.ReadingType.Selection) {
        measuringPointViewModel.FdText(false);
        measuringPointViewModel.FdDecimal(false);
        measuringPointViewModel.FdSelection(true);
        measuringPointViewModel.FdNumeric(false);
        measuringPointViewModel.DecimalPlaces('');
        measuringPointViewModel.UpperLimit('');
        measuringPointViewModel.LowerLimit('');
        measuringPointViewModel.MaxLength('');

    }
    else if (selectedValue == jQuery.MeasuringPointNameSpace.ReadingType.Numeric) {
        measuringPointViewModel.FdText(false);
        measuringPointViewModel.FdDecimal(false);
        measuringPointViewModel.FdSelection(false);
        measuringPointViewModel.FdNumeric(true);
        measuringPointViewModel.MaxLength('');
        measuringPointViewModel.DecimalPlaces('');
        measuringPointViewModel.UpperLimit('');
        measuringPointViewModel.LowerLimit('');
        measuringPointViewModel.UpperLimitWarn('');
        measuringPointViewModel.LowerLimitWarn('');

    }
    else {
        measuringPointViewModel.FdText(true);
        measuringPointViewModel.FdDecimal(false);
        measuringPointViewModel.FdSelection(false);
        measuringPointViewModel.FdNumeric(false);
        measuringPointViewModel.DecimalPlaces('');
        measuringPointViewModel.UpperLimit('');
        measuringPointViewModel.LowerLimit('');
        measuringPointViewModel.UpperLimitWarn('');
        measuringPointViewModel.LowerLimitWarn('');
    }
}

function ClearMeasuringPointListFilter(filterType)
{
    measuringPointViewModel.ChangeEventBind(false);
    if (filterType == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Functional_Location) {
        jQuery("#drpFilterEquipModel").val(0).trigger("change");
    }
    else if (filterType == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment) {
        jQuery("#drpFilterEquipModel").val(0).trigger("change");
    }
    else {
        jQuery("#drpFilterEquipment").val(0).trigger("change");

        if (measuringPointViewModel.SelectFunctionalLocationFilter() != 0 && measuringPointViewModel.SelectFunctionalLocationFilter() != undefined) {
            jQuery("#drpFilterFuncLoc").val(0).trigger("change");
            measuringPointViewModel.SelectFunctionalLocationFilter(0);
            LoadAllEquipmentInfo(false, true, true);
        }
    }

}

function LoadMeasuringPointList(filterType) {
    if (filterType != undefined) {
        ClearMeasuringPointListFilter(filterType);
    }

    var isValid = true;
    jQuery("#measuringPointErrorMsg").html("");
    var measuringPointfilter = {};
    measuringPointfilter.SiteID = jQuery.MeasuringPointNameSpace.BasicParam.SiteID;
    measuringPointfilter.UserID = jQuery.MeasuringPointNameSpace.BasicParam.UserID;

    if (jQuery.MeasuringPointNameSpace.MeasuringPointDataType != "")
        measuringPointfilter.MeasuringPointDataType = jQuery.MeasuringPointNameSpace.MeasuringPointDataType.charCodeAt();
    else
        measuringPointfilter.MeasuringPointDataType = null;
    if (jQuery.MeasuringPointNameSpace.MeasuringPointDataType == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment
        && jQuery.MeasuringPointNameSpace.FLocationID > 0) {
        if ((measuringPointViewModel.SelectFunctionalLocationFilter() == 0 || measuringPointViewModel.SelectFunctionalLocationFilter() == undefined)
            && (measuringPointViewModel.SelectEquipmentFilter() == 0 || measuringPointViewModel.SelectEquipmentFilter() == undefined)) {
            jQuery("#measuringPointErrorMsg").html(languageResource.resMsg_SelectFunctionalLocOrEuipment);
            jQuery("#measuringPointErrorMsg").addClass("red");
            isValid = false;
        }
    }
    if (measuringPointViewModel.SelectEquipmentModelFilter() != 0 && measuringPointViewModel.SelectEquipmentModelFilter() != undefined
        || measuringPointViewModel.SelectFunctionalLocationFilter() != 0 && measuringPointViewModel.SelectFunctionalLocationFilter() != undefined
        || measuringPointViewModel.SelectEquipmentFilter() != 0 && measuringPointViewModel.SelectEquipmentFilter() != undefined) {
        if (measuringPointViewModel.SelectEquipmentModelFilter() != 0 && measuringPointViewModel.SelectEquipmentModelFilter() != undefined) {
            measuringPointViewModel.ChangeEventBind(false);

            measuringPointfilter.SelectionID = measuringPointViewModel.SelectEquipmentModelFilter();
            measuringPointfilter.MeasuringPointDataType = jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment_Model.charCodeAt();
        }
        else if ((measuringPointViewModel.SelectFunctionalLocationFilter() != 0 && measuringPointViewModel.SelectFunctionalLocationFilter() != undefined)
            && (measuringPointViewModel.SelectEquipmentFilter() != 0 && measuringPointViewModel.SelectEquipmentFilter() != undefined)) {
            measuringPointfilter.SelectionID = measuringPointViewModel.SelectEquipmentFilter();
            measuringPointfilter.MeasuringPointDataType = jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment.charCodeAt();
        }
        else if (measuringPointViewModel.SelectFunctionalLocationFilter() != 0 && measuringPointViewModel.SelectFunctionalLocationFilter() != undefined) {
            measuringPointfilter.SelectionID = measuringPointViewModel.SelectFunctionalLocationFilter();
            measuringPointfilter.MeasuringPointDataType = jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Functional_Location.charCodeAt();

        }
        else if (measuringPointViewModel.SelectEquipmentFilter() != 0 && measuringPointViewModel.SelectEquipmentFilter() != undefined) {
            measuringPointfilter.SelectionID = measuringPointViewModel.SelectEquipmentFilter();
            measuringPointfilter.MeasuringPointDataType = jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment.charCodeAt();

        }
    }
    else {
        isValid = false;
        measuringPointViewModel.MeasuringPointList.removeAll();
        measuringPointViewModel.LoadMeasuringPointListError(languageResource.resMsg_NoRecords);
        measuringPointViewModel.LoadMeasuringPointListErrorClass('gray');
        measuringPointViewModel.LoadMeasuringPointErrorMessageVisible(true);
        measuringPointViewModel.ChangeEventBind(true);       
    }

    if (isValid) {
        var searchString = jQuery("#txtSearchMeasuringPoint").val();
        if (searchString != "") {
            measuringPointfilter.SearchString = searchString;
        }

        jQuery.ajax({
            type: "POST",
            url: jQuery.MeasuringPointNameSpace.ServicePath + "/Vegam_MaintenanceService.asmx/GetMeasuringPointList",
            data: JSON.stringify({ measuringPointfilter: measuringPointfilter }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (json) {
                //jQuery("#divLoadProgressVisible").addClass('hide');
                if (json.d != null) {
                    if (json.d.length > 0) {
                        ko.utils.arrayForEach(json.d, function (item, index) {
                            item.SelectedClass = ko.observable('');
                            if (index == 0)
                                item.SelectedClass = ko.observable('bg-info');
                            else if (item.IsActivated == false) {
                                item.SelectedClass = ko.observable('bg-lightgray');
                            }
                        });
                        measuringPointViewModel.MeasuringPointList(json.d);
                    }
                    else {
                        measuringPointViewModel.MeasuringPointList.removeAll();
                        measuringPointViewModel.LoadMeasuringPointListError(languageResource.resMsg_NoRecords);
                        measuringPointViewModel.LoadMeasuringPointListErrorClass('gray');
                        measuringPointViewModel.LoadMeasuringPointErrorMessageVisible(true);
                    }
                }
                else {
                    measuringPointViewModel.LoadMeasuringPointListError(languageResource.resMsg_FailedToLoadMeasuringPointList);
                    measuringPointViewModel.LoadMeasuringPointListErrorClass('red');
                    measuringPointViewModel.LoadMeasuringPointErrorMessageVisible(true);
                }
            },
            beforeSend: function () {
                jQuery("#divLoadProgressVisible").show();
                measuringPointViewModel.MeasuringPointList.removeAll();
                measuringPointViewModel.LoadMeasuringPointListError('');
                measuringPointViewModel.LoadMeasuringPointListErrorClass('');
                measuringPointViewModel.LoadMeasuringPointErrorMessageVisible(false);
            },
            complete: function () {
                jQuery("#divLoadProgressVisible").hide();
                measuringPointViewModel.ChangeEventBind(true);
            },
            error: function (request, error) {
                jQuery("#divLoadProgressVisible").hide();
                measuringPointViewModel.LoadMeasuringPointListErrorClass('red');
                measuringPointViewModel.LoadMeasuringPointErrorMessageVisible(true);
                var errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadMeasuringPointList;
                if (request.responseText != "") {
                    var errorMsg = jQuery.parseJSON(request.responseText);
                    if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                        errorMessage = languageResource.resMsg_Error + errorMsg.Message;
                }
                measuringPointViewModel.LoadMeasuringPointListError(errorMessage);
            }
        });
    }

}

function LoadAllEquipmentInfo(pageLoad, filter, isLoadEquipFilter) {

    if (jQuery.MeasuringPointNameSpace.MeasuringPointDataType == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment
        && jQuery.MeasuringPointNameSpace.FLocationID > 0 || filter ) {
        jQuery("#measuringPointErrorMsg").html("");

        measuringPointViewModel.ChangeEventBind(false);
        var equipmentFilterInfo = {};
        equipmentFilterInfo.SiteID = jQuery.MeasuringPointNameSpace.BasicParam.SiteID;
        equipmentFilterInfo.UserID = jQuery.MeasuringPointNameSpace.BasicParam.UserID;
        equipmentFilterInfo.InfoType = jQuery.MeasuringPointNameSpace.InfoType.Equipment.charCodeAt();
        if (pageLoad) {
            if (measuringPointViewModel.SelectFunctionalLocationFilter()>0)
            equipmentFilterInfo.SearchLocationIDs = measuringPointViewModel.SelectFunctionalLocationFilter();
        }
        else if (filter == true) {
            if (measuringPointViewModel.SelectFunctionalLocationFilter() > 0)
                equipmentFilterInfo.SearchLocationIDs = measuringPointViewModel.SelectFunctionalLocationFilter();
        }
        else {
            if (measuringPointViewModel.SelectedFLocationOrEquipOrModel() > 0)
                equipmentFilterInfo.SearchLocationIDs = measuringPointViewModel.SelectedFLocationOrEquipOrModel();
        }

        equipmentFilterInfo.ConsiderEquipmentList = true;
        if (pageLoad || filter == true) {
            var equipmentListInfo = {};
            equipmentListInfo.TypeValue = 0;
            equipmentListInfo.DisplayName = languageResource.resMsg_PleaseSelect;
            measuringPointViewModel.EquipmentList.removeAll();
            measuringPointViewModel.EquipmentList.push(equipmentListInfo);
        }
        if (pageLoad || !filter) {
            var equipmentListInfo = {};
            equipmentListInfo.TypeValue = 0;
            equipmentListInfo.DisplayName = languageResource.resMsg_PleaseSelect;
            measuringPointViewModel.EquipmentForLocList.removeAll();
            measuringPointViewModel.EquipmentForLocList.push(equipmentListInfo);
        }

        jQuery.ajax({
            type: "POST",
            url: jQuery.MeasuringPointNameSpace.ServicePath + "/Vegam_MaintenanceService.asmx/GetEquipmentDetailsInfo",
            data: JSON.stringify({ equipmentFilterInfo: equipmentFilterInfo }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (json) {
                if (json != undefined && json.d != null) {
                    if (json.d.EquipmentInfoList.length > 0) {
                        jQuery.each(json.d.EquipmentInfoList, function (i, equipmentList) {
                            var equipmentListInfo = {};
                            equipmentListInfo.TypeValue = equipmentList.EquipmentID;
                            equipmentListInfo.DisplayName = equipmentList.EquipmentName;
                            if (pageLoad || filter == true)
                                measuringPointViewModel.EquipmentList.push(equipmentListInfo);

                            if (pageLoad || !filter)
                                measuringPointViewModel.EquipmentForLocList.push(equipmentListInfo);
                        });
                    }
                    if (pageLoad) {
                        measuringPointViewModel.SelectEquipmentFilter(jQuery.MeasuringPointNameSpace.ParentID);
                        measuringPointViewModel.SelectEquipmentForLocation(jQuery.MeasuringPointNameSpace.ParentID);
                    }
                    else if (pageLoad || filter == true)
                        if (!isLoadEquipFilter)
                            LoadMeasuringPointList(jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Functional_Location);
                    jQuery("#drpEquipmentForLoc").select2();


                }
                else {
                    var errorMsg = languageResource.resMsg_Error + languageResource.resMsg_FailedToBindEquipmentList;
                    ShowErrorMessage(errorMsg, true);
                }
            },
            beforeSend: function () {
                // measuringPointViewModel.EquipmentList.removeAll();
            },
            complete: function () {
                measuringPointViewModel.ChangeEventBind(true);
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

}

function InsertOrUpdateMeasuringPointInfo(measuringPointID) {
    var isValid = true;
    var errorMessage = "";

    var tagToRead = jQuery.trim(jQuery("#txtConnecttoTag").val());
    var name = measuringPointViewModel.MeasuringPointName();
    var position = measuringPointViewModel.Position();
    var parentType = measuringPointViewModel.SelectedMeasuringPointDataType();
    var category = measuringPointViewModel.SelectedCategory();
    var uomID = measuringPointViewModel.SelectedSensorTypeUnit();
    var description = measuringPointViewModel.Description();
    var readingType = measuringPointViewModel.SelectedReadingType();
    var decimalPlaces = measuringPointViewModel.DecimalPlaces();
    var upperLimit = measuringPointViewModel.UpperLimit();
    var lowerLimit = measuringPointViewModel.LowerLimit();
    var upperLimitWarn = measuringPointViewModel.UpperLimitWarn();
    var lowerLimitWarn = measuringPointViewModel.LowerLimitWarn();
    var maxTextLength = measuringPointViewModel.MaxLength();
    var groupID = measuringPointViewModel.SelectedGroup();
    var isCounter = measuringPointViewModel.IsCounter();
    var measuringCode = measuringPointViewModel.MeasuringCode();

    if (jQuery.MeasuringPointNameSpace.MeasuringPointDataType == "")
        var parentID = measuringPointViewModel.SelectedMeasuringPointDataTypeInfo();
    else if (jQuery.MeasuringPointNameSpace.MeasuringPointDataType == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment
        && jQuery.MeasuringPointNameSpace.FLocationID > 0 && measuringPointViewModel.SelectEquipmentForLocation() > 0)
        var parentID = measuringPointViewModel.SelectEquipmentForLocation();
    else
        var parentID = measuringPointViewModel.SelectedFLocationOrEquipOrModel();

    if (jQuery.MeasuringPointNameSpace.MeasuringPointDataType == "") {
        if (parentType == 0) {
            errorMessage = errorMessage + languageResource.resMsg_SelectMeasuringPointDataType + "<br/>";
            isValid = false;
        }
    }
    if (parentID == 0) {
        if (measuringPointViewModel.SelectedMeasuringPointDataType() == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment_Model ||
            jQuery.MeasuringPointNameSpace.MeasuringPointDataType == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment_Model) {
            errorMessage = errorMessage + languageResource.resMsg_SelectEquipmentModel + "<br/>";
        }
        else if (measuringPointViewModel.SelectedMeasuringPointDataType() == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Functional_Location ||
            jQuery.MeasuringPointNameSpace.MeasuringPointDataType == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Functional_Location) {
            errorMessage = errorMessage + languageResource.resMsg_SelectFunctionalLocation + "<br/>";
        }
        else if (measuringPointViewModel.SelectEquipmentForLocation() == 0 && measuringPointViewModel.SelectedFLocationOrEquipOrModel() == 0) {
            errorMessage = errorMessage + languageResource.resMsg_SelectFunctionalLocOrEuipment + "<br/>";
        }
        else if (measuringPointViewModel.SelectedMeasuringPointDataType() == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment ||
            jQuery.MeasuringPointNameSpace.MeasuringPointDataType == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment) {
            errorMessage = errorMessage + languageResource.resMsg_SelectEquipment + "<br/>";
        }
        isValid = false;
    }

    if (jQuery.MeasuringPointNameSpace.MeasuringPointDataType != jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment_Model && measuringPointViewModel.SelectedMeasuringPointDataType() != jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment_Model) {
        if (measuringCode == "") {
            errorMessage = errorMessage + languageResource.resMsg_PleaseGenerateMeasuringCode + "<br/>";
            isValid = false;
        }
    }
    if (name == "") {
        errorMessage = errorMessage + languageResource.resMsg_EnterMeasuringPointName + "<br/>";
        isValid = false;
    }
    if (category == 0) {
        errorMessage = errorMessage + languageResource.resMsg_EnterCategory + "<br/>";
        isValid = false;
    }
    if (readingType == 0) {
        errorMessage = errorMessage + languageResource.resMsg_EnterReadingType + "<br/>";
        isValid = false;
    }

    if ((parseFloat(lowerLimit) > parseFloat(upperLimit))) {
        errorMessage = errorMessage + languageResource.resMsg_UpperLimitShouldBeGreater + "<br/>";
        isValid = false;
    }
    if ((parseFloat(lowerLimitWarn) > parseFloat(upperLimitWarn))) {
        errorMessage = errorMessage + languageResource.resMsg_UpperLimitWarningShouldBeGreater + "<br/>";
        isValid = false;
    }

    if (isValid == false) {
        ShowMessage(errorMessage, "error");
    }

    if (isValid == true) {
        var measuringPointInfo = {};
        measuringPointInfo.Name = name;
        if (jQuery.MeasuringPointNameSpace.MeasuringPointDataType != "") {
            if (jQuery.MeasuringPointNameSpace.MeasuringPointDataType == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment
                && jQuery.MeasuringPointNameSpace.FLocationID > 0) {
                if (measuringPointViewModel.SelectEquipmentForLocation() > 0)
                    measuringPointInfo.MeasuringPointDataType = jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment.charCodeAt();
                else
                    measuringPointInfo.MeasuringPointDataType = jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Functional_Location.charCodeAt();
                //  measuringPointInfo.ParentID = measuringPointViewModel.SelectEquipmentForLocation();
            }
            else
                measuringPointInfo.MeasuringPointDataType = jQuery.MeasuringPointNameSpace.MeasuringPointDataType.charCodeAt();
        }
        else
            measuringPointInfo.MeasuringPointDataType = parentType.charCodeAt();

        measuringPointInfo.ParentID = parentID;//Measuring Point ID 
        measuringPointInfo.Position = position;
        measuringPointInfo.CategoryID = category;
        measuringPointInfo.UOMID = uomID;
        measuringPointInfo.Description = description;
        measuringPointInfo.ReadingType = readingType.charCodeAt();

        if (isCounter != undefined)
            measuringPointInfo.IsCounter = isCounter == true ? true : false;

        if (decimalPlaces.length > 0)
            measuringPointInfo.DecimalPlaces = parseInt(decimalPlaces);
        else
            measuringPointInfo.DecimalPlaces = 0;

        if (upperLimit != "" && !isNaN(parseFloat(upperLimit)))
            measuringPointInfo.MaxValue = parseFloat(upperLimit);
        else
            measuringPointInfo.MaxValue = 0;

        if (lowerLimit != "" && !isNaN(parseFloat(lowerLimit)))
            measuringPointInfo.MinValue = parseFloat(lowerLimit);
        else
            measuringPointInfo.MinValue = 0;

        if (upperLimitWarn != "" && !isNaN(parseFloat(upperLimitWarn)))
            measuringPointInfo.MaxValueWarning = parseFloat(upperLimitWarn);
        else
            measuringPointInfo.MaxValueWarning = 0;

        if (lowerLimitWarn != "" && !isNaN(parseFloat(lowerLimitWarn)))
            measuringPointInfo.MinValueWarning = parseFloat(lowerLimitWarn);
        else
            measuringPointInfo.MinValueWarning = 0;

        if (maxTextLength > 0)
            measuringPointInfo.MaxTextLength = parseInt(maxTextLength);
        else
            measuringPointInfo.MaxTextLength = 0;

        if ((jQuery.MeasuringPointNameSpace.MeasuringPointDataType != jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment_Model || jQuery.MeasuringPointNameSpace.MeasuringPointDataType == "") && measuringCode != "")
            measuringPointInfo.Code = measuringCode;
        else
            measuringPointInfo.Code = "";

        if (jQuery.MeasuringPointNameSpace.MeasuringPointImageName != null || jQuery.MeasuringPointNameSpace.MeasuringPointImageName != undefined || jQuery.MeasuringPointNameSpace.MeasuringPointImageName != "")
            measuringPointInfo.ImageName = jQuery.MeasuringPointNameSpace.MeasuringPointImageName;
        else
            measuringPointInfo.ImageName = "";

        if (jQuery.MeasuringPointNameSpace.CurrentlySelectedTagUUID != "")
            measuringPointInfo.TagUUID = jQuery.MeasuringPointNameSpace.CurrentlySelectedTagUUID;
        else
            measuringPointInfo.TagUUID = 0;

        measuringPointInfo.OpcTagID = tagToRead;
        measuringPointInfo.GroupID = groupID;
        measuringPointInfo.ID = measuringPointID;

        jQuery.ajax({
            type: "POST",
            url: jQuery.MeasuringPointNameSpace.ServicePath + "/Vegam_MaintenanceService.asmx/InsertUpdateMeasuringPointInfo",
            data: JSON.stringify({ basicParam: jQuery.MeasuringPointNameSpace.BasicParam, measuringPointInfo: measuringPointInfo }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (json) {
                if (json.d != null && json.d != undefined) {
                    if (json.d == "-1") {
                        ShowMessage(languageResource.resMsg_EnterMeasuringPointName, "error");
                    }
                    else if (json.d == "-2") {
                        ShowMessage(languageResource.resMsg_MeasuringCodeEmpty, "error");
                    }
                    else if (json.d == "-3") {
                        ShowMessage(languageResource.resMsg_MeasuringCodeAlreadyExists, "error");
                    }
                    else if (json.d == "-4") {
                        ShowMessage(languageResource.resMsg_MeasuringPointNameAlreadyExists, "error");
                    }
                    else if (json.d == "-5") {
                        ShowMessage(languageResource.resMsg_MeasuringPointExistInInActiveState, "error");
                    }
                    else if (json.d == "-6") {
                        SelectMeasuringPointFilter();                      
                        ClearMeasuringPointInfo();
                        ShowMessage(languageResource.resMsg_MeasuringPointInfoAddedSuccessfully, "info");
                        LoadMeasuringPointList();

                    }
                    else if (json.d == "-7") {
                        SelectMeasuringPointFilter();
                        ClearMeasuringPointInfo();
                        ShowMessage(languageResource.resMsg_MeasuringPointInfoUpdatedSuccessfully, "info");
                        LoadMeasuringPointList();
                     
                    }
                }
                else {
                    ShowMessage(languageResource.resMsg_FailedToAddMeasuringPointInfo, "error");
                }
            },
            error: function (request, error) {
                if (request.responseText != "") {
                    var errorMsg = jQuery.parseJSON(request.responseText);
                    if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null) {
                        errorMessage = languageResource.resMsg_Error + errorMsg.Message;
                        ShowMessage(errorMessage, "error");
                    }
                    else {
                        errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToAddMeasuringPointInfo;
                        ShowMessage(errorMessage, "error");
                    }
                }
                else {
                    errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToAddMeasuringPointInfo;
                    ShowMessage(errorMessage, "error");
                }
            }
        });
    }
}

function SelectMeasuringPointFilter() {
    var filterValue;
    measuringPointViewModel.ChangeEventBind(false);
    if (jQuery.MeasuringPointNameSpace.MeasuringPointDataType == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Functional_Location
        || measuringPointViewModel.SelectedMeasuringPointDataType() == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Functional_Location) {
        if (jQuery.MeasuringPointNameSpace.MeasuringPointDataType == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Functional_Location) {
            filterValue = measuringPointViewModel.SelectedFLocationOrEquipOrModel();
            measuringPointViewModel.SelectFunctionalLocationFilter(filterValue);
        }
        else {
            filterValue = measuringPointViewModel.SelectedMeasuringPointDataTypeInfo();
            measuringPointViewModel.SelectFunctionalLocationFilter(filterValue);
            LoadAllEquipmentInfo(false, true, true);
           // measuringPointViewModel.ChangeEventBind(false);
            measuringPointViewModel.SelectEquipmentModelFilter(0);
            measuringPointViewModel.SelectEquipmentFilter(0);
        }
    }
    else if (jQuery.MeasuringPointNameSpace.MeasuringPointDataType == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment_Model
        || measuringPointViewModel.SelectedMeasuringPointDataType() == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment_Model) {
        if (jQuery.MeasuringPointNameSpace.MeasuringPointDataType == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment_Model)
            filterValue = measuringPointViewModel.SelectedFLocationOrEquipOrModel();
        else {
            filterValue = measuringPointViewModel.SelectedMeasuringPointDataTypeInfo();
            measuringPointViewModel.SelectFunctionalLocationFilter(0);
            measuringPointViewModel.SelectEquipmentFilter(0);
            measuringPointViewModel.SelectFunctionalLocationFilter(0);
            LoadAllEquipmentInfo(false, true, true);
            measuringPointViewModel.ChangeEventBind(false);
        }
        measuringPointViewModel.SelectEquipmentModelFilter(filterValue);
        
    }
    else if (jQuery.MeasuringPointNameSpace.MeasuringPointDataType == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment
        || measuringPointViewModel.SelectedMeasuringPointDataType() == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment) {
       
        if (jQuery.MeasuringPointNameSpace.MeasuringPointDataType == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment) {
            filterValue = measuringPointViewModel.SelectedFLocationOrEquipOrModel();
            if (jQuery.MeasuringPointNameSpace.FLocationID > 0) {           
                measuringPointViewModel.SelectFunctionalLocationFilter(filterValue);
                LoadAllEquipmentInfo(false, true, true);
                measuringPointViewModel.ChangeEventBind(false);
                filterValue = measuringPointViewModel.SelectEquipmentForLocation();
            }           
        }
        else {
            filterValue = measuringPointViewModel.SelectedMeasuringPointDataTypeInfo();          
            measuringPointViewModel.SelectEquipmentModelFilter(0);
            measuringPointViewModel.SelectFunctionalLocationFilter(0);  
            LoadAllEquipmentInfo(false, true, true);
            measuringPointViewModel.ChangeEventBind(false);
        }
        measuringPointViewModel.SelectEquipmentFilter(filterValue);
        
    }
}

function ClearMeasuringPointInfo() {
    measuringPointViewModel.LoadErrorMessage('');
    measuringPointViewModel.MeasuringPointName('');
    measuringPointViewModel.Position('');
    if (jQuery.MeasuringPointNameSpace.MeasuringPointDataType == "") {
        measuringPointViewModel.SelectedMeasuringPointDataType(jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment_Model);
        LoadMeasuringPointDataTypeFilter(false);
        measuringPointViewModel.SelectedMeasuringPointDataTypeInfo(0);
    }
    else {
        measuringPointViewModel.SelectedFLocationOrEquipOrModel(0);
        if (jQuery.MeasuringPointNameSpace.MeasuringPointDataType == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment
            && jQuery.MeasuringPointNameSpace.FLocationID > 0 && measuringPointViewModel.SelectEquipmentForLocation() > 0) {
            measuringPointViewModel.SelectEquipmentForLocation(0);
            LoadAllEquipmentInfo(false, false, true);
            measuringPointViewModel.ChangeEventBind(false);
        }
    }
    measuringPointViewModel.SelectedCategory(0);
    measuringPointViewModel.SelectedSensorType(0);
    measuringPointViewModel.SelectedSensorTypeUnit(0);
    measuringPointViewModel.Description('');
    measuringPointViewModel.SelectedReadingType('T');

    measuringPointViewModel.IsCounter(false);
    measuringPointViewModel.DecimalPlaces('');
    measuringPointViewModel.UpperLimit('');
    measuringPointViewModel.LowerLimit('');
    measuringPointViewModel.UpperLimitWarn('');
    measuringPointViewModel.LowerLimitWarn('');
    measuringPointViewModel.MaxLength('');
    measuringPointViewModel.SelectedGroup(0);
    ClearTags();
    HideAndShowFieldSet();
    if (jQuery.MeasuringPointNameSpace.MeasuringPointDataType == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Functional_Location
        || jQuery.MeasuringPointNameSpace.MeasuringPointDataType == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment) {
        measuringPointViewModel.FdGenerateCode(true);
        measuringPointViewModel.MeasuringCode('');
        measuringPointViewModel.BtnGenerateCode(true);
    }
    else {
        measuringPointViewModel.FdGenerateCode(false);
        measuringPointViewModel.MeasuringCode('');
        measuringPointViewModel.BtnGenerateCode(true);
    }
    jQuery('.select2').select2();

    jQuery("#" + jQuery.MeasuringPointNameSpace.LoadControlID).html("");
    jQuery("#" + jQuery.MeasuringPointNameSpace.LoadControlID).html(languageResource.resMsg_SaveAndAddMore);
    jQuery("#" + jQuery.MeasuringPointNameSpace.LoadControlID).removeAttr("onclick");
    jQuery("#" + jQuery.MeasuringPointNameSpace.LoadControlID).prop("onclick", null);
    jQuery("#" + jQuery.MeasuringPointNameSpace.LoadControlID).unbind('click');
    jQuery("#" + jQuery.MeasuringPointNameSpace.LoadControlID).bind("click", function () { InsertOrUpdateMeasuringPointInfo(0); return false; });

    if (measuringPointViewModel.HasEditAccess == true) {
        jQuery("#" + jQuery.MeasuringPointNameSpace.LoadControlID).attr("disabled", "disabled");
        jQuery("#" + jQuery.MeasuringPointNameSpace.LoadControlID.replace("btnSaveMeasuringPoint", "btnGenerateCode")).attr("disabled", "disabled");
    }
    jQuery("#imgMeasuringPointImage").attr('src', jQuery.MeasuringPointNameSpace.ImagePath);

    ko.utils.arrayForEach(measuringPointViewModel.MeasuringPointList(), function (item, index) {
        item.SelectedClass('');       
        if (item.IsActivated != false)
            item.SelectedClass('');
        else
            item.SelectedClass('bg-lightgray');
    });
}

function LoadSelectedMeasuringPoint(measuringPointID) {

    measuringPointViewModel.LoadErrorMessage('');
    ko.utils.arrayForEach(measuringPointViewModel.MeasuringPointList(), function (item) {
        item.SelectedClass('');
        if (item.MeasuringPointID == measuringPointID) {
            item.SelectedClass('bg-info');
        }
        if (item.IsActivated == false) {
            item.SelectedClass('bg-lightgray');
        }
        if (item.MeasuringPointID == measuringPointID && item.IsActivated == false) {
            item.SelectedClass('bg-info');
        }
    });

    jQuery.ajax({
        type: "POST",
        url: jQuery.MeasuringPointNameSpace.ServicePath + "/Vegam_MaintenanceService.asmx/GetSelectedMeasuringPointInfo",
        data: JSON.stringify({ basicParam: jQuery.MeasuringPointNameSpace.BasicParam, measuringPointID: measuringPointID }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if (json.d != null) {
                var measuringPointInfo = json.d;
                measuringPointViewModel.ParentID(measuringPointInfo.ParentID);
                measuringPointViewModel.MeasuringPointName(measuringPointInfo.Name);
                measuringPointViewModel.Position(measuringPointInfo.Position);
                measuringPointViewModel.SelectedSensorType(measuringPointInfo.SensorTypeID);
                measuringPointViewModel.SelectedCategory(measuringPointInfo.CategoryID);
                LoadSensorUnitInfo();
                measuringPointViewModel.SelectedSensorTypeUnit(measuringPointInfo.UOMID);
                jQuery("#drpSensorType").select2();
                jQuery("#drpSensorTypeUnit").select2();
                jQuery("#drpCategory").select2();

                measuringPointViewModel.Description(measuringPointInfo.Description);
                measuringPointViewModel.IsCounter(measuringPointInfo.IsCounter);
                jQuery("#txtConnecttoTag").val(measuringPointInfo.OpcTagID);
                jQuery.MeasuringPointNameSpace.CurrentlySelectedTag = measuringPointInfo.OpcTagID;
                jQuery.MeasuringPointNameSpace.CurrentlySelectedTagUUID = json.d.TagUUID;

                measuringPointViewModel.ChangeEventBind(true);
                if (jQuery.MeasuringPointNameSpace.MeasuringPointDataType == "") {
                    if (measuringPointInfo.MeasuringPointDataType == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Functional_Location.charCodeAt()) {
                        measuringPointViewModel.SelectedMeasuringPointDataType(jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Functional_Location);
                        LoadMeasuringPointDataTypeFilter(false);
                        measuringPointViewModel.SelectedMeasuringPointDataTypeInfo(measuringPointInfo.ParentID);
                        measuringPointViewModel.FdGenerateCode(true);
                        measuringPointViewModel.BtnGenerateCode(false);
                        measuringPointViewModel.MeasuringCode(measuringPointInfo.Code);
                    }
                    else if (measuringPointInfo.MeasuringPointDataType == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment.charCodeAt()) {
                        measuringPointViewModel.SelectedMeasuringPointDataType(jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment);
                        LoadMeasuringPointDataTypeFilter(false);
                        measuringPointViewModel.SelectedMeasuringPointDataTypeInfo(measuringPointInfo.ParentID);
                        measuringPointViewModel.FdGenerateCode(true);
                        measuringPointViewModel.MeasuringCode(measuringPointInfo.Code);
                        if (measuringPointInfo.Code != "")
                            measuringPointViewModel.BtnGenerateCode(false);
                        else
                            measuringPointViewModel.BtnGenerateCode(true);
                    }
                    else {
                        measuringPointViewModel.SelectedMeasuringPointDataType(jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment_Model);
                        LoadMeasuringPointDataTypeFilter(false);
                        measuringPointViewModel.SelectedMeasuringPointDataTypeInfo(measuringPointInfo.ParentID);
                        measuringPointViewModel.FdGenerateCode(false);
                        measuringPointViewModel.BtnGenerateCode(false);
                    }
                    jQuery("#drpMeasuringPointDataTypeInfo").select2();
                }
                else if (measuringPointInfo.MeasuringPointDataType == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Functional_Location.charCodeAt()) {
                    measuringPointViewModel.FdGenerateCode(true);
                    measuringPointViewModel.BtnGenerateCode(false);
                    measuringPointViewModel.MeasuringCode(measuringPointInfo.Code);
                    measuringPointViewModel.ChangeEventBind(false);
                    measuringPointViewModel.SelectedFLocationOrEquipOrModel(measuringPointInfo.ParentID);
                    if (jQuery.MeasuringPointNameSpace.FLocationID > 0)
                        LoadAllEquipmentInfo(false, false, false);
                    jQuery("#drpFLocationOrEquipOrModel").select2();
                    jQuery("#drpEquipmentForLoc").select2();

                }
                else if (measuringPointInfo.MeasuringPointDataType == jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment.charCodeAt()) {
                    measuringPointViewModel.FdGenerateCode(true);
                    measuringPointViewModel.MeasuringCode(measuringPointInfo.Code);
                    if (measuringPointInfo.Code != "")
                        measuringPointViewModel.BtnGenerateCode(false);
                    else
                        measuringPointViewModel.BtnGenerateCode(true);
                    measuringPointViewModel.ChangeEventBind(false);
                    if (jQuery.MeasuringPointNameSpace.FLocationID == 0) {
                        measuringPointViewModel.SelectedFLocationOrEquipOrModel(measuringPointInfo.ParentID);
                        jQuery("#drpFLocationOrEquipOrModel").select2();
                    }
                    else {
                        measuringPointViewModel.SelectedFLocationOrEquipOrModel(measuringPointInfo.LocationID);
                        LoadAllEquipmentInfo(false, false, false);
                        jQuery("#drpFLocationOrEquipOrModel").select2();
                        measuringPointViewModel.SelectEquipmentForLocation(measuringPointInfo.ParentID);
                        jQuery("#drpEquipmentForLoc").select2();
                    }
                }
                else {
                    measuringPointViewModel.ChangeEventBind(false);
                    measuringPointViewModel.SelectedFLocationOrEquipOrModel(measuringPointInfo.ParentID);
                    measuringPointViewModel.FdGenerateCode(false);
                    measuringPointViewModel.BtnGenerateCode(false);
                    jQuery("#drpFLocationOrEquipOrModel").select2();
                }
                if (measuringPointInfo.ReadingType == jQuery.MeasuringPointNameSpace.ReadingType.Text.charCodeAt()) {
                    measuringPointViewModel.SelectedReadingType(jQuery.MeasuringPointNameSpace.ReadingType.Text);
                    HideAndShowFieldSet();
                    measuringPointViewModel.MaxLength(measuringPointInfo.MaxTextLength.toString());
                }
                else if (measuringPointInfo.ReadingType == jQuery.MeasuringPointNameSpace.ReadingType.Decimal.charCodeAt()) {
                    measuringPointViewModel.SelectedReadingType(jQuery.MeasuringPointNameSpace.ReadingType.Decimal);
                    HideAndShowFieldSet();
                    measuringPointViewModel.DecimalPlaces(measuringPointInfo.DecimalPlaces.toString());
                    measuringPointViewModel.UpperLimit(measuringPointInfo.MaxValue.toString());
                    measuringPointViewModel.LowerLimit(measuringPointInfo.MinValue.toString());
                    measuringPointViewModel.UpperLimitWarn(measuringPointInfo.MaxValueWarning.toString());
                    measuringPointViewModel.LowerLimitWarn(measuringPointInfo.MinValueWarning.toString());
                }
                else if (measuringPointInfo.ReadingType == jQuery.MeasuringPointNameSpace.ReadingType.Numeric.charCodeAt()) {
                    measuringPointViewModel.SelectedReadingType(jQuery.MeasuringPointNameSpace.ReadingType.Numeric);
                    HideAndShowFieldSet();
                    measuringPointViewModel.UpperLimit(measuringPointInfo.MaxValue.toString());
                    measuringPointViewModel.LowerLimit(measuringPointInfo.MinValue.toString());
                    measuringPointViewModel.UpperLimitWarn(measuringPointInfo.MaxValueWarning.toString());
                    measuringPointViewModel.LowerLimitWarn(measuringPointInfo.MinValueWarning.toString());
                }
                else if (measuringPointInfo.ReadingType == jQuery.MeasuringPointNameSpace.ReadingType.Selection.charCodeAt()) {
                    measuringPointViewModel.SelectedReadingType(jQuery.MeasuringPointNameSpace.ReadingType.Selection);
                    HideAndShowFieldSet();
                    measuringPointViewModel.SelectedGroup(measuringPointInfo.GroupID);
                    jQuery("#drpGroup").select2();
                }

                if (measuringPointInfo.ImagePath == undefined || measuringPointInfo.ImagePath == null || measuringPointInfo.ImagePath == "")
                    jQuery("#imgMeasuringPointImage").attr('src', jQuery.MeasuringPointNameSpace.ImagePath);

                else
                    jQuery("#imgMeasuringPointImage").attr('src', measuringPointInfo.ImagePath);

                jQuery.MeasuringPointNameSpace.MeasuringPointImageName = measuringPointInfo.ImageName;

                jQuery("#" + jQuery.MeasuringPointNameSpace.LoadControlID).html("");
                jQuery("#" + jQuery.MeasuringPointNameSpace.LoadControlID).html(languageResource.resMsg_Update);
                jQuery("#" + jQuery.MeasuringPointNameSpace.LoadControlID).prop("onclick", null);
                jQuery("#" + jQuery.MeasuringPointNameSpace.LoadControlID).unbind('click');
                jQuery("#" + jQuery.MeasuringPointNameSpace.LoadControlID).bind("click", function () { InsertOrUpdateMeasuringPointInfo(measuringPointID); return false; });

                if (measuringPointViewModel.HasEditAccess == true) {
                    jQuery("#" + jQuery.MeasuringPointNameSpace.LoadControlID).removeAttr("disabled");
                    jQuery("#" + jQuery.MeasuringPointNameSpace.LoadControlID.replace("btnSaveMeasuringPoint", "btnGenerateCode")).removeAttr("disabled");
                }
            }
            else {
                ShowMessage(languageResource.resMsg_FailedToLoadMeasuringPointInfo, "error");
            }
        },
        complete: function () {
            measuringPointViewModel.ChangeEventBind(true);
        },
        error: function (request, error) {
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                    ShowMessage(languageResource.resMsg_FailedToLoadMeasuringPointInfo, "error");
                else
                    ShowMessage(languageResource.resMsg_FailedToLoadMeasuringPointInfo, "error");
            }
            else {
                ShowMessage(languageResource.resMsg_FailedToLoadMeasuringPointInfo, "error");
            }
        },
    });
}

function DeleteMeasuringPointClick(measuringPointID) {
    jQuery("#alertMessage").removeClass("text-info");
    jQuery("#alertMessage").removeClass("text-danger");
    jQuery("#alertMessage").html(languageResource.resMsg_AreYouSureYouWantToDeleteMeasuringPoint);
    jQuery("#alertModal").dialog({
        zIndex: 999999,
        modal: true,
        buttons: [
            {
                text: languageResource.resMsg_Confirm,
                click: function () {
                    jQuery("#alertModal").dialog("close");
                    DeleteMeasuringPoint(measuringPointID);
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

function DeleteMeasuringPoint(measuringPointID) {
    jQuery.ajax({
        type: "POST",
        url: jQuery.MeasuringPointNameSpace.ServicePath + "/Vegam_MaintenanceService.asmx/DeleteMeasuringPointInfo",
        data: JSON.stringify({ basicParam: jQuery.MeasuringPointNameSpace.BasicParam, measuringPointID: measuringPointID }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (json) {
            if (json.d != null && json.d != undefined) {
                if (json.d == 1) {
                    ClearMeasuringPointInfo();
                    LoadMeasuringPointList();
                }
                else if (json.d == 2) {
                    ShowErrorMessage(languageResource.resMsg_MeasuringPointDonNotExistActiveStatus, true);
                }
                else {
                    ShowErrorMessage(languageResource.resMsg_MeasuringPointDeleteFailure, true);
                }
            }
        },
        beforeSend: function () {
        },
        complete: function () {
        },
        error: function (request, error) {
            var errorMessage = "";
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    errorMessage = languageResource.resMsg_Error + errorMsg.Message;
                else
                    errorMessage = languageResource.resMsg_MeasuringPointDeleteFailure;
            }
            else {
                errorMessage = languageResource.resMsg_MeasuringPointDeleteFailure;
            }
            ShowErrorMessage(errorMessage, true);
        }
    });
}

function ClearMeasuringPointCode() {
    measuringPointViewModel.BtnGenerateCode(true);
    measuringPointViewModel.MeasuringCode('');
}

function ClearTags() {
    jQuery.MeasuringPointNameSpace.CurrentlySelectedTag = "";
    jQuery("#txtConnecttoTag").val(' ');
    jQuery.MeasuringPointNameSpace.CurrentlySelectedTagUUID = "";
}

var isChanged = true;
function MeasuringPointImageUpload() {
    if (isChanged) {
        isChanged = false;
        var imageName = ""; var isValid = false; var errorMessage = '';
        var capturedImage = jQuery("#imageFileToUpload").val();
        var fileSize = jQuery("#imageFileToUpload")[0].files[0].size;
        fileSize = fileSize / 1024;//size in kb
        fileSize = fileSize / 1024;//size in mb

        if (capturedImage == 'undefined' || capturedImage == "") {
            errorMessage = languageResource.resMsg_FailedToCaptureImage;
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
            imageName = "";
            jQuery("#imageFileToUpload").val("");
            isChanged = true;
        }

        if (isValid) {
            var urlString = jQuery.MeasuringPointNameSpace.UploaderPath + '?uid=' + jQuery.MeasuringPointNameSpace.BasicParam.UserID + '&sid=' + jQuery.MeasuringPointNameSpace.BasicParam.SiteID + '&fileName=' + imageName + '&measuringPointInfo=true';

            jQuery.ajaxFileUpload({
                type: "POST",
                url: urlString,
                fileElementId: 'imageFileToUpload',
                success: function (data, status) {
                    jQuery("#imageFileToUpload").val("");
                    if (data.documentElement.innerText != "true") {
                        imageName = "";
                        ShowErrorMessage(languageResource.resMsg_FailedToUploadImage, true);
                    }
                    else {
                        jQuery.MeasuringPointNameSpace.MeasuringPointImageName = imageName;
                        jQuery("#imgMeasuringPointImage").attr('src', jQuery.MeasuringPointNameSpace.MeasuringPointImgPath + "/" + imageName);
                    }
                    isChanged = true;
                },
                error: function (request, error) {
                    jQuery("#imageFileToUpload").val("");
                    var errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToUploadImage;
                    if (request.responseText != "") {
                        var errorMsg = jQuery.parseJSON(request.responseText);
                        if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                            errorMessage = languageResource.resMsg_Error + errorMsg.Message;
                    }
                    imageName = "";
                    ShowErrorMessage(errorMessage, true);
                    isChanged = true;
                }
            });
        }
    }
}

function GenerateMeasuringPointCode() {
    jQuery.ajax({
        type: "POST",
        url: jQuery.MeasuringPointNameSpace.ServicePath + "/Vegam_MaintenanceService.asmx/GenerateRandomCode",
        data: JSON.stringify({ basicParam: jQuery.MeasuringPointNameSpace.BasicParam, infoType: jQuery.MeasuringPointNameSpace.InfoType.Measuring_Point.charCodeAt() }),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (data) {
            if (data.d != undefined) {
                measuringPointViewModel.MeasuringCode(data.d);
                measuringPointViewModel.BtnGenerateCode(false);
            }
            else {
                ShowErrorMessage(languageResource.resMsg_FailedToLoadMeasuringPointCode);
            }
        },
        error: function (request, error) {
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                    ShowErrorMessage(languageResource.resMsg_Error + errorMsg.Message);
                else
                    ShowErrorMessage(languageResource.resMsg_FailedToLoadMeasuringPointCode);
            }
            else {
                ShowErrorMessage(languageResource.resMsg_FailedToLoadMeasuringPointCode);
            }
        }
    });
}

function ShowErrorMessage(message, isError) {
    if (isError == true || isError == undefined)
        jQuery("#alertMessage").addClass("text-danger")
    else
        jQuery("#alertMessage").removeClass("text-danger")

    jQuery("#alertMessage").html(message);
    jQuery("#alertModal").dialog({
        zIndex: 999999,
        modal: true,
        open: function (event, ui) {
            $('.ui-dialog').css('z-index', 99999);
            $('.ui-widget-overlay').css('z-index', 10000);
        },
        buttons: [
            {
                text: languageResource.resMsg_Ok,
                click: function () {
                    jQuery("#alertModal").dialog("close");
                }
            }
        ]
    });
}

function ShowMessage(message, messageType) {
    switch (messageType.toLowerCase()) {
        case 'info':
            measuringPointViewModel.LoadErrorMessageClass("text-info");
            measuringPointViewModel.LoadErrorMessage(message);
            break;
        case 'error':
            measuringPointViewModel.LoadErrorMessageClass("text-danger");
            measuringPointViewModel.LoadErrorMessage(message);
            break;
    }
}

function resizeIframe(myValue) {
    window.parent.document.getElementById("MaintenanceInfoFrame").style.height = (window.parent.document.getElementById("MaintenanceInfoFrame").scrollHeight + myValue) + "px";
    iframeValue = myValue;
}

//Connect to Tag
// Handling the Rest API's for OPCTags
function ShowOPCDataSourceModal() {
    jQuery("#modalOPCUUIDTagInfo").modal("show");
    jQuery("#divOPCNodeTree").addClass("hide");
    jQuery("#divOPCTags").addClass("hide");
    if (jQuery.MeasuringPointNameSpace.restAPIServicePath.length > 0) {
        BindOPCDataSourceList(jQuery.MeasuringPointNameSpace.restAPIServicePath)
        jQuery('#opcNodeFetchingError').html('');
        jQuery("#btnSelectTag").addClass("hide");
        jQuery("#spanTagSerachError").html("");
        jQuery("#spanTagSerachError").addClass("hide");
        jQuery("#opcHide").addClass("hide");
        jQuery("#btnOpc").html("Test");
        jQuery("#txtValue,#txtQuality,#txtTimeStamp,#txtTagName").val("");
        jQuery("#txtConnecttoTag").val("");

    }
}

function BindOPCDataSourceList() {
    jQuery("#drpDataSourceList")
        .html(jQuery("<option></option>")
            .attr("value", -1)
            .text(languageResource.resMsg_SelectDataSource));
    jQuery.support.cors = true;
    jQuery.ajax({
        type: 'POST',
        processData: true,
        url: jQuery.MeasuringPointNameSpace.restAPIServicePath + "/GetDataSourceList",
        data: JSON.stringify({ siteID: jQuery.MeasuringPointNameSpace.BasicParam.SiteID }),
        contentType: "application/json",
        dataType: "json",
        async: false,
        success: function (json) {
            var result = json;
            jQuery.each(result, function (key, value) {
                jQuery("#drpDataSourceList")
                    .append(jQuery("<option></option>")
                        .attr("value", value.DataSourceID)
                        .text(value.DataSourceName));
            });
        },
        beforeSend: function () {
        },
        complete: function () {
        },
        error: function (request, status, error) {

        }
    });

    jQuery("#drpDataSourceList").change(function () {
        jQuery("#divOPCNodeTree").addClass("hide");
        jQuery("#divOPCTags").removeClass("hide");
        jQuery('#opcNodeFetchingError').html('');
        jQuery('#spanTagSerachError').html('');
        jQuery("#opcHide").addClass("hide");
        jQuery("#btnOpc").html("Test");
        jQuery("#opcHide").addClass("info-block");
        jQuery("#btnSelectTag").addClass("hide");
        jQuery("#txtValue,#txtQuality,#txtTimeStamp").val("");
        jQuery('#divOPCNodeTree').jstree(true).refresh();

    });
}

function SearchOPCTags() {
    if (jQuery("#drpDataSourceList").val() != -1) {
        jQuery("#divOPCNodeTree").addClass("hide");
        jQuery("#divOPCTags").addClass("hide");
        jQuery('#opcNodeFetchingError').html('');
        jQuery("#spanTagSerachError").addClass("hide");
        jQuery("#btnSelectTag").addClass("hide");
        jQuery("#opcHide").addClass("hide");
        jQuery("#btnOpc").html("Test");
        jQuery("#txtValue,#txtQuality,#txtTimeStamp").val("");
        jQuery('#divOPCNodeTree').jstree(true).refresh();
    }
    else {
        jQuery("#spanTagSerachError").removeClass("hide");
        jQuery("#spanTagSerachError").html(languageResource.resMsg_PleaseSelectDataSource);
    }
}

function HideOPCModal() {
    jQuery("#modalOPCUUIDTagInfo").modal("hide");
}

function hideTheTestDiv() {
    if (jQuery("#opcHide").hasClass("hide")) {
        jQuery("#opcHide").removeClass("hide");
        jQuery("#btnOpc").html("Hide");
        jQuery("#spnReadError").addClass("hide");
        jQuery("#spnReadError").html("");
    }
    else {
        jQuery("#opcHide").addClass("hide");
        jQuery("#btnOpc").html("Test");
        jQuery("#txtValue,#txtQuality,#txtTimeStamp").val("");
    }
    return false;
}

function ReadTagData() {
    if (jQuery.MeasuringPointNameSpace.CurrentlySelectedTagUUID.length > 0) {
        jQuery.support.cors = true;
        var uuidList = [];
        uuidList.push(jQuery.MeasuringPointNameSpace.CurrentlySelectedTagUUID)
        jQuery.ajax({
            type: 'POST',
            processData: true,
            url: jQuery.MeasuringPointNameSpace.restAPIServicePath + "/ReadDataPoint",
            data: JSON.stringify({ uuidList: uuidList }),
            contentType: "application/json",
            dataType: "json",
            async: false,
            success: function (json) {
                if (json != undefined && json.length > 0) {
                    var result = json;
                    var readDateTime = new Date(result[0].TagTimeStamp);

                    jQuery("#txtQuality").val(result[0].TagStrength == 1 ? "Good Quality" : "Bad Quality");
                    jQuery("#txtTimeStamp").val(readDateTime.toLocaleString());
                    jQuery("#txtValue").val(result[0].Value);
                    jQuery("#spnReadError").addClass("hide");
                    jQuery("#spnReadError").html("");
                }
                else {
                    jQuery("#txtValue,#txtQuality,#txtTimeStamp").val("");
                    jQuery("#spnReadError").removeClass("hide");
                    jQuery("#spnReadError").html("Data not found");
                }
            },
            beforeSend: function () {
                jQuery("#spinReadTag").removeClass("hide");
            },
            complete: function () {
                jQuery("#spinReadTag").addClass("hide");
            },
            error: function (request, status, error) {
                jQuery("#spnReadError").removeClass("hide");
                jQuery("#spnReadError").html(languageResource.resMsg_Error + languageResource.resMsg_ErrorWhileReadingTag);
            }
        });
    }
    else {
        jQuery("#spnReadError").removeClass("hide");
        jQuery("#spnReadError").html(languageResource.resMsg_PleaesSelectATagToRead);
    }
}

//Add selection group
function ShowAddMaintenanceTypeModal(type) {
    jQuery.MeasuringPointNameSpace.SelectedMasterDataType = type;
    BindMasterDataInfo();
    var btnAddMaintType = jQuery.MeasuringPointNameSpace.LoadControlID.replace("btnSaveMeasuringPoint", "btnAddMaintType");
    jQuery("#" + btnAddMaintType).text(languageResource.resMsg_Add);
    if (jQuery("#iconViewMaintTypes").hasClass("fa fa-minus-circle")) {
        jQuery("#iconViewMaintTypes").removeClass("fa fa-minus-circle");
        jQuery("#iconViewMaintTypes").addClass("fa fa-plus-circle");
    }
    var btnShowAll = "btnShowAll";
    jQuery("#" + btnShowAll).addClass('hide');
    jQuery("#iconViewMaintTypes").removeClass("fa fa-minus-circle");
    jQuery("#iconViewMaintTypes").addClass("fa fa-plus-circle");
    jQuery("#divMaintTypes").addClass("hide");
    jQuery("#divAddMaintenanceMasterDataModal").modal("show");
}

function BindMasterDataInfo() {
    if (jQuery.MeasuringPointNameSpace.SelectedMasterDataType == jQuery.MeasuringPointNameSpace.MasterDataType.MeasuringPointCategory) {
        jQuery("#modalHeaderName").text(languageResource.resMsg_CategoryInformation);
        jQuery(".labelMasterDataType").text(languageResource.resMsg_CategoryName);
        jQuery("#thDescOrItem").text(languageResource.resMsg_Description);
        jQuery("#addItem").addClass("hide");
        jQuery("#fdDescription").removeClass("hide");
        jQuery("#fieldsetAddedit").text(languageResource.resMsg_AddEditMasterData.replace("[XXX]", languageResource.resMsg_Category));
        jQuery("#spnViewAllMaintTypes").text(languageResource.resMsg_ClickHereToView.replace("[XXX]", languageResource.resMsg_CategoryInformation.toLowerCase().toString()));
        jQuery("#spanListofInfo").text(languageResource.resMsg_ListOfMasterData.replace("[XXX]", languageResource.resMsg_Categories));
        jQuery.MeasuringPointNameSpace.SelectedMasterDataMessage = languageResource.resMsg_Category;
    }
    if (jQuery.MeasuringPointNameSpace.SelectedMasterDataType == jQuery.MeasuringPointNameSpace.MasterDataType.MPSelectionGroupCode) {
        jQuery("#modalHeaderName").text(languageResource.resMsg_SelectionGroupInformation);
        jQuery(".labelMasterDataType").text(languageResource.resMsg_SelectionGroupName);
        jQuery("#thDescOrItem").text(languageResource.resMsg_ItemName);
        jQuery("#addItem").removeClass("hide");
        jQuery("#fdDescription").addClass("hide");
        jQuery("#fieldsetAddedit").text(languageResource.resMsg_AddEditMasterData.replace("[XXX]", languageResource.resMsg_SelectionGroup));
        jQuery("#spnViewAllMaintTypes").text(languageResource.resMsg_ClickHereToView.replace("[XXX]", languageResource.resMsg_SelectionGroupInformation.toLowerCase().toString()));
        jQuery("#spanListofInfo").text(languageResource.resMsg_ListOfMasterData.replace("[XXX]", languageResource.resMsg_SelctionGroups));
        jQuery.MeasuringPointNameSpace.SelectedMasterDataMessage = languageResource.resMsg_SelectionGroup;
    }
}

function ShowHideMaintTypesInfo() {
    if (jQuery("#iconViewMaintTypes").hasClass("fa-plus-circle")) {
        var thSelectionGroupNames = jQuery.MeasuringPointNameSpace.LoadControlID.replace("btnSaveMeasuringPoint", "thMaintTypes");
        jQuery("#" + thSelectionGroupNames + " i").removeClass('fa-sort-up');
        jQuery("#" + thSelectionGroupNames + " i").removeClass('fa-sort-down');
        jQuery("#hdfSortValue").val('');
        jQuery("#divMaintTypes").removeClass("hide");
        jQuery("#iconViewMaintTypes").removeClass("fa fa-plus-circle");
        jQuery("#iconViewMaintTypes").addClass("fa fa-minus-circle");

        var maintTypeAccess = jQuery.MeasuringPointNameSpace.MaintTypePagerData.PageAccessRights.toLowerCase();
        if (maintTypeAccess == "full_access" || maintTypeAccess == "edit_only")
            maintenanceTypeViewModel.HasMaintTypeAccess = true;
        if (maintTypeAccess == "full_access") {
            maintenanceTypeViewModel.HasDeleteMaintTypeAccess = true;
        }
        LoadMaintTypesInfo(jQuery.MeasuringPointNameSpace.MaintTypePagerData);
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
    masterDataFilterInfo.MasterDataType = jQuery.MeasuringPointNameSpace.SelectedMasterDataType.charCodeAt();

    if (jQuery.MeasuringPointNameSpace.IsSelectionGroupSearch == true) {
        if (jQuery.trim(jQuery("#txtSearchMaintType").val()) != "") {
            masterDataFilterInfo.SearchString = jQuery.trim(jQuery("#txtSearchMaintType").val());
        }
    }

    if (jQuery("#hdfSortValue").val() != "") {
        masterDataFilterInfo.SortType = jQuery("#hdfSortValue").val();
    }

    jQuery.ajax({
        type: "POST",
        url: jQuery.MeasuringPointNameSpace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetMaintMasterDataWithPager",
        data: JSON.stringify({ pagerData: pagerData, basicParam: jQuery.MeasuringPointNameSpace.BasicParam, masterDataFilterInfo: masterDataFilterInfo }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        success: function (json) {

            maintenanceTypeViewModel.DefaultMaintenanceTypesArray([]);
            if (json != undefined && json.d != undefined) {
                if (json.d.MasterDataInfoList.length == 0) {
                    maintenanceTypeViewModel.LoadErrorMessage(languageResource.resMsg_NoRecordFound);
                    maintenanceTypeViewModel.LoadErrorMessageClass('');
                    maintenanceTypeViewModel.LoadErrorMessageVisible(true);
                }
                else {
                    maintenanceTypeViewModel.MaintTypePagerData(json.d.HTMLPager);
                    jQuery.each(json.d.MasterDataInfoList, function (i, masterDataInfoList) {
                        var masterDataListInfo = {};
                        masterDataListInfo.MasterDataName = masterDataInfoList.MasterDataName;
                        masterDataListInfo.MasterDataID = masterDataInfoList.MasterDataID;
                        if (jQuery.MeasuringPointNameSpace.SelectedMasterDataType == jQuery.MeasuringPointNameSpace.MasterDataType.MPSelectionGroupCode)
                            masterDataListInfo.DescOrItemName = masterDataInfoList.SelectionGroupItemName;
                        else
                            masterDataListInfo.DescOrItemName = masterDataInfoList.Description;

                        maintenanceTypeViewModel.DefaultMaintenanceTypesArray.push(masterDataListInfo);
                    });
                }
            }
            else {
                maintenanceTypeViewModel.LoadErrorMessage(languageResource.resMsg_FailedToLoadMaintTypeInfo.replace("[XXX]", jQuery.MeasuringPointNameSpace.SelectedMasterDataMessage.toLowerCase().toString()));
                maintenanceTypeViewModel.LoadErrorMessageClass('red');
                maintenanceTypeViewModel.LoadErrorMessageVisible(true);
            }
        },
        beforeSend: function () {
            maintenanceTypeViewModel.LoadErrorMessageVisible(false);
            maintenanceTypeViewModel.MaintTypePagerData('');
            jQuery("#divMaintTypesProgress").show();
        },
        complete: function () {
            jQuery("#divMaintTypesProgress").hide();
        },
        error: function (request, error) {
            maintenanceTypeViewModel.LoadErrorMessageClass('red');
            maintenanceTypeViewModel.LoadErrorMessageVisible(true);
            var errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadMaintTypeInfo.replace("[XXX]", jQuery.MeasuringPointNameSpace.SelectedMasterDataMessage.toLowerCase().toString());
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    errorMessage = languageResource.resMsg_Error + errorMsg.Message;
            }
            maintenanceTypeViewModel.LoadErrorMessage(errorMessage);
        }
    });
}

function AddItemsToModal() {
    jQuery("#divAddedItems").removeClass("hide");
    jQuery("#spnAddMaintTypeError").html("");
    var itemName = jQuery("#txtItemName").val();
    var addedItemName;
    var isExits = false;

    if (itemName.length > 0) {
        jQuery("#divAddedItems button").each(function (i) {
            addedItemName = jQuery(this).text();
            if (itemName == addedItemName) {
                isExits = true;
                return;
            }
        });
        if (!isExits) {
            jQuery("#divAddedItems").append("<button name='" + itemName + "' class='btn btn-sm btn-default bottom-gap' onclick='removeButton(this)' style='padding:2px 6px;margin:0 2px'><i class='fa fa-times-circle font-big tiny-rightmargin blue'></i>" + itemName + "</button>");
            jQuery("#txtItemName").val("");
        }
        else {
            jQuery("#spnAddMaintTypeError").removeClass('text-info');
            jQuery("#spnAddMaintTypeError").addClass('text-danger');
            jQuery("#spnAddMaintTypeError").text(languageResource.resMsg_ItemNameAlreadyAdded);
        }

    }
}

function SearchMaintTypes() {
    jQuery.MeasuringPointNameSpace.IsSelectionGroupSearch = true;
    if (jQuery.MeasuringPointNameSpace.IsSelectionGroupSearch == true) {
        if (jQuery.trim(jQuery("#txtSearchMaintType").val()) == "") {
            jQuery("#spnSearchError").html(languageResource.resMsg_EnterSearchCriteria);
            return false;
        }
    }
    var btnShowAll = "btnShowAll";
    jQuery("#" + btnShowAll).html("Show All");
    jQuery("#" + btnShowAll).removeClass('hide');
    jQuery("#spnSearchError").empty();
    jQuery("#spnAddMaintTypeError").html("");
    jQuery("#txtNewMaintType").val("");
    var btnAddMaintType = jQuery.MeasuringPointNameSpace.LoadControlID.replace("btnSaveMeasuringPoint", "btnAddMaintType");
    jQuery("#" + btnAddMaintType).val("");
    jQuery("#" + btnAddMaintType).text(languageResource.resMsg_Add);

    var thMaintTypes = jQuery.MeasuringPointNameSpace.LoadControlID.replace("btnSaveMeasuringPoint", "thMaintTypes");
    jQuery("#" + thMaintTypes + " i").removeClass('fa-sort-up');
    jQuery("#" + thMaintTypes + " i").removeClass('fa-sort-down');
    jQuery("#hdfSortValue").val('');
    jQuery("#divMaintTypes").removeClass("hide");
    jQuery("#iconViewMaintTypes").removeClass("fa fa-plus-circle");
    jQuery("#iconViewMaintTypes").addClass("fa fa-minus-circle");

    var selectiongGroupAccess = jQuery.MeasuringPointNameSpace.MaintTypePagerData.PageAccessRights.toLowerCase();
    if (selectiongGroupAccess == "full_access" || selectiongGroupAccess == "edit_only")
        maintenanceTypeViewModel.HasMaintTypeAccess = true;
    if (selectiongGroupAccess == "full_access") {
        maintenanceTypeViewModel.HasDeleteMaintTypeAccess = true;
        jQuery("#" + btnAddMaintType).removeAttr('disabled');
        jQuery("#" + btnAddMaintType).prop("onclick", null);
        jQuery("#" + btnAddMaintType).unbind('click');
        jQuery("#" + btnAddMaintType).bind("click", function () { InsertOrUpdateMaintType(0); return false; });
    }
    else {
        jQuery("#" + btnAddMaintType).attr('disabled', 'disabled');
    }

    LoadMaintTypesInfo(jQuery.MeasuringPointNameSpace.MaintTypePagerData);
}

function ShowAllMaintTypes() {
    jQuery.MeasuringPointNameSpace.IsSelectionGroupSearch = false;
    ClearMaintenanceTypeInfo(false);
    jQuery("#btnShowAll").addClass('hide');

    var thMaintTypes = jQuery.MeasuringPointNameSpace.LoadControlID.replace("btnSaveMeasuringPoint", "thMaintTypes");
    jQuery("#" + thMaintTypes + " i").removeClass('fa-sort-up');
    jQuery("#" + thMaintTypes + " i").removeClass('fa-sort-down');
    jQuery("#hdfSortValue").val('');
    jQuery("#divMaintTypes").removeClass("hide");
    jQuery("#iconViewMaintTypes").removeClass("fa fa-plus-circle");
    jQuery("#iconViewMaintTypes").addClass("fa fa-minus-circle");

    var btnAddMaintType = jQuery.MeasuringPointNameSpace.LoadControlID.replace("btnSaveMeasuringPoint", "btnAddMaintType");
    jQuery("#" + btnAddMaintType).text(languageResource.resMsg_Add);

    var maintenanceTypeAccess = jQuery.MeasuringPointNameSpace.MaintTypePagerData.PageAccessRights.toLowerCase();
    if (maintenanceTypeAccess == "full_access" || maintenanceTypeAccess == "edit_only")
        maintenanceTypeViewModel.HasMaintTypeAccess = true;
    if (maintenanceTypeAccess == "full_access") {
        maintenanceTypeViewModel.HasDeleteMaintTypeAccess = true;
        jQuery("#" + btnAddMaintType).removeAttr('disabled');
        jQuery("#" + btnAddMaintType).prop("onclick", null);
        jQuery("#" + btnAddMaintType).unbind('click');
        jQuery("#" + btnAddMaintType).bind("click", function () { InsertOrUpdateMaintType(0); return false; });
    }
    else {
        jQuery("#" + btnAddMaintType).attr('disabled', 'disabled');
    }

    LoadMaintTypesInfo(jQuery.MeasuringPointNameSpace.MaintTypePagerData);
}

function ClearMaintenanceTypeInfo(isDelete) {
    jQuery("#spnSearchError").html("");
    jQuery("#spnAddMaintTypeError").html("");
    jQuery("#divAddedItems").html("");
    var btnAddMaintType = jQuery.MeasuringPointNameSpace.LoadControlID.replace("btnSaveMeasuringPoint", "btnAddMaintType");
    jQuery("#" + btnAddMaintType).text(languageResource.resMsg_Add);
    if (jQuery.MeasuringPointNameSpace.MaintTypePagerData.PageAccessRights.toLowerCase() == "full_access") {
        jQuery("#" + btnAddMaintType).removeAttr('disabled');
        jQuery("#" + btnAddMaintType).prop("onclick", null);
        jQuery("#" + btnAddMaintType).unbind('click');
        jQuery("#" + btnAddMaintType).bind("click", function () { InsertOrUpdateMaintType(0); return false; });
    }
    else {
        jQuery("#" + btnAddMaintType).attr('disabled', 'disabled');
    }

    if (jQuery.MeasuringPointNameSpace.MaintTypePagerData.PageAccessRights.toLowerCase() != "full_access") {
        jQuery("#" + btnAddMaintType).attr("disabled", "disabled");
    }
    var btnShowAll = "btnShowAll";
    if (jQuery.trim(jQuery("#txtNewMaintType").val()) == "" && jQuery.trim(jQuery("#txtItemName").val()) == "" && jQuery.trim(jQuery("#txtNewMaintType").val()) == "" && (jQuery("#" + btnShowAll).is(':visible') == false) && !isDelete)
        jQuery("#divAddMaintenanceMasterDataModal").modal("hide");
    else {
        jQuery("#txtNewMaintType").val("");
        jQuery("#txtSearchMaintType").val("");
        jQuery("#txtItemName").val("");
        jQuery("#txtMasterDescription").val("");
        if (jQuery("#" + btnShowAll).is(':visible')) {
            jQuery("#" + btnShowAll).addClass('hide');
            LoadMaintTypesInfo(jQuery.MeasuringPointNameSpace.MaintTypePagerData);
        }
    }

    if (jQuery("#divAddMaintenanceMasterDataModal").hasClass('ui-dialog-content')) {
        jQuery("#divAddMaintenanceMasterDataModal").dialog("close");
    }
}

function removeButton(elem) {
    if (jQuery.MeasuringPointNameSpace.MaintTypePagerData.PageAccessRights.toUpperCase() != "READ_ONLY") {
        jQuery(elem).detach();
    }
}

function SortMaintenanceTypeTabs(thValue, value) {
    var thClass = "";
    var hasSortUpClassExist = jQuery("#" + thValue + " i").hasClass('fa-sort-up');
    var hasSortDownExist = jQuery("#" + thValue + " i").hasClass('fa-sort-down');

    if (hasSortUpClassExist == false && hasSortDownExist == false) {
        jQuery(".fa-sort-down").removeClass('fa fa-sort-down');
        jQuery(".fa-sort-up").removeClass('fa fa-sort-up');

        jQuery("#" + thValue + " i").addClass('fa fa-sort-up');
        thClass = value + "_asc";
        jQuery("#hdfSortValue").val(thClass);
        LoadMaintTypesInfo(jQuery.MeasuringPointNameSpace.MaintTypePagerData);
        return false;
    }
    if (jQuery("#" + thValue + " i").hasClass('fa-sort-up')) {
        jQuery(".fa-sort-down").removeClass('fa fa-sort-down');
        jQuery(".fa-sort-up").removeClass('fa fa-sort-up');

        jQuery("#" + thValue + " i").addClass('fa fa-sort-down');
        thClass = value + "_desc";
        jQuery("#hdfSortValue").val(thClass);
        LoadMaintTypesInfo(jQuery.MeasuringPointNameSpace.MaintTypePagerData);
        return false;
    }
    if (jQuery("#" + thValue + " i").hasClass('fa-sort-down')) {
        jQuery(".fa-sort-down").removeClass('fa fa-sort-down');
        jQuery(".fa-sort-up").removeClass('fa fa-sort-up');

        jQuery("#" + thValue + " i").addClass('fa fa-sort-up');
        thClass = value + "_asc";
        jQuery("#hdfSortValue").val(thClass);
        LoadMaintTypesInfo(jQuery.MeasuringPointNameSpace.MaintTypePagerData);
        return false;
    }
}

function InsertOrUpdateMaintType(masterDataID) {

    var isValid = true;
    var errorMessage = "";
    var itemNames = [];
    var itemName = "";
    jQuery("#spnAddMaintTypeError").removeClass('text-danger');
    jQuery("#spnAddMaintTypeError").text('');

    if (jQuery.trim(jQuery("#txtNewMaintType").val()).length == 0) {
        errorMessage = errorMessage + languageResource.resMsg_EnterMaintType.replace("[XXX]", jQuery.MeasuringPointNameSpace.SelectedMasterDataMessage.toLowerCase().toString()) + "<br/>";
        isValid = false;
    }
    if (jQuery.MeasuringPointNameSpace.SelectedMasterDataType == jQuery.MeasuringPointNameSpace.MasterDataType.MPSelectionGroupCode) {
        jQuery("#divAddedItems button").each(function (i) {
            itemName = jQuery(this).text();
            itemNames.push(itemName);
        });

        if (jQuery.trim(jQuery("#txtItemName").val()).length == 0 && itemNames.length == 0) {
            errorMessage = errorMessage + languageResource.resMsg_EnterItemName + "<br/>";
            isValid = false;
        }
        jQuery.each(itemNames, function (index, item) {
            if (item == jQuery.trim(jQuery("#txtItemName").val())) {
                errorMessage = errorMessage + languageResource.resMsg_ItemNameAlreadyAdded + "<br/>";
                isValid = false;
            }
        });
    }


    if (!isValid) {
        jQuery("#spnAddMaintTypeError").removeClass("text-info").addClass('text-danger');
        jQuery("#spnAddMaintTypeError").html(errorMessage);
    }
    else {
        var masterDataInfo = {};
        masterDataInfo.MasterDataID = masterDataID;
        masterDataInfo.MasterDataName = jQuery.trim(jQuery("#txtNewMaintType").val());
        masterDataInfo.MasterDataType = jQuery.MeasuringPointNameSpace.SelectedMasterDataType.charCodeAt();

        if (jQuery.MeasuringPointNameSpace.SelectedMasterDataType == jQuery.MeasuringPointNameSpace.MasterDataType.MPSelectionGroupCode) {
            if (itemNames.length != 0) {

                if (jQuery.trim(jQuery("#txtItemName").val()).length != 0) {
                    itemName = jQuery.trim(jQuery("#txtItemName").val());
                    itemNames.push(itemName);
                }
                masterDataInfo.SelectionGroupItemName = itemNames;
            }
            else {
                itemName = jQuery.trim(jQuery("#txtItemName").val());
                itemNames.push(itemName);
                masterDataInfo.SelectionGroupItemName = itemNames;
            }
        }
        else
            masterDataInfo.Description = jQuery.trim(jQuery("#txtMasterDescription").val());
        jQuery.ajax({
            type: "POST",
            url: jQuery.MeasuringPointNameSpace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/InsertUpdateMasterData",
            data: JSON.stringify({ basicParam: jQuery.MeasuringPointNameSpace.BasicParam, masterDataInfo: masterDataInfo }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                jQuery("#spnAddMaintTypeError").removeClass('text-danger').removeClass('text-info');
                if (json.d != undefined && json.d != null && json.d > 0) {
                    if (json.d == masterDataID) {
                        ClearMaintenanceTypeInfo(false);
                        jQuery("#spnAddMaintTypeError").addClass('text-info');
                        jQuery("#spnAddMaintTypeError").text(languageResource.resMsg_UpdatedMaintType.replace("[XXX]", jQuery.MeasuringPointNameSpace.SelectedMasterDataMessage.toLowerCase().toString()));
                    }
                    else {
                        ClearMaintenanceTypeInfo(false);
                        jQuery("#spnAddMaintTypeError").addClass('text-info');
                        jQuery("#spnAddMaintTypeError").text(languageResource.resMsg_InsertedMaintType.replace("[XXX]", jQuery.MeasuringPointNameSpace.SelectedMasterDataMessage.toLowerCase().toString()));
                    }

                    jQuery.MeasuringPointNameSpace.MaintTypePagerData.PageIndex = 0;
                    jQuery.MeasuringPointNameSpace.MaintTypePagerData.CurrentPage = 0;
                    LoadMaintTypesInfo(jQuery.MeasuringPointNameSpace.MaintTypePagerData);
                    LoadMasterDataDropDown(false, jQuery.MeasuringPointNameSpace.SelectedMasterDataType);
                    if (jQuery.MeasuringPointNameSpace.SelectedMasterDataType == jQuery.MeasuringPointNameSpace.MasterDataType.MeasuringPointCategory) {
                        measuringPointViewModel.SelectedCategory(json.d);
                    }
                    else if (jQuery.MeasuringPointNameSpace.SelectedMasterDataType == jQuery.MeasuringPointNameSpace.MasterDataType.MPSelectionGroupCode) {
                        measuringPointViewModel.SelectedGroup(json.d);
                    }
                }
                else {
                    if (json.d == -3) {
                        jQuery("#spnAddMaintTypeError").addClass('text-danger');
                        jQuery("#spnAddMaintTypeError").text(languageResource.resMsg_MaintenanceTypeAlreadyExists.replace("[XXX]", jQuery.MeasuringPointNameSpace.SelectedMasterDataMessage));
                    }
                    else {
                        var msg = languageResource.resMsg_FailedToInsertMaintTypeInfo.replace("[XXX]", jQuery.MeasuringPointNameSpace.SelectedMasterDataMessage.toLowerCase().toString());
                        jQuery("#spnAddMaintTypeError").addClass('text-danger');
                        jQuery("#spnAddMaintTypeError").text(msg);
                    }
                }
            },
            error: function (request, error) {
                var msg;
                if (request.responseText != "") {
                    var errorMsg = request.responseText;
                    if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                        msg = languageResource.resMsg_Error + errorMsg.Message;
                    else
                        msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToInsertMaintTypeInfo.replace("[XXX]", jQuery.MeasuringPointNameSpace.SelectedMasterDataMessage.toLowerCase().toString());
                }
                else {
                    msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToInsertMaintTypeInfo.replace("[XXX]", jQuery.MeasuringPointNameSpace.SelectedMasterDataMessage.toLowerCase().toString());
                }
                jQuery("#spnAddMaintTypeError").removeClass("text-info").addClass('text-danger');
                jQuery("#spnAddMaintTypeError").text(msg);
            },
        });
    }
}

function ShowEditMaintTypes(maintMasterData) {
    jQuery("#txtNewMaintType").val(maintMasterData.MasterDataName);
    jQuery("#txtItemName").val("");
    jQuery("#txtMasterDescription").val("");
    jQuery("#divAddedItems").html("");
    jQuery("#spnAddMaintTypeError").html("");
    if (jQuery.MeasuringPointNameSpace.SelectedMasterDataType == jQuery.MeasuringPointNameSpace.MasterDataType.MPSelectionGroupCode) {
        jQuery.each(maintMasterData.DescOrItemName, function (index, itemValue) {
            jQuery("#divAddedItems").append("<button name='" + itemValue + "' class='btn btn-sm btn-default bottom-gap mar-rt  pull-left' onclick='removeButton(this)' style='padding:2px 6px;margin:0 2px'>" + itemValue + "<i class='fa fa-times-circle font-big tiny-rightmargin blue pull-left'></i></button>");
        });
    }
    else
        jQuery("#txtMasterDescription").val(maintMasterData.DescOrItemName);

    var btnAddMaintType = jQuery.MeasuringPointNameSpace.LoadControlID.replace("btnSaveMeasuringPoint", "btnAddMaintType");
    jQuery("#" + btnAddMaintType).text(languageResource.resMsg_Update);
    if (jQuery.MeasuringPointNameSpace.MaintTypePagerData.PageAccessRights.toLowerCase() == "full_access" | jQuery.MeasuringPointNameSpace.MaintTypePagerData.PageAccessRights.toLowerCase() == "edit_only") {
        jQuery("#" + btnAddMaintType).removeAttr('disabled');
        jQuery("#" + btnAddMaintType).prop("onclick", null);
        jQuery("#" + btnAddMaintType).unbind('click');
        jQuery("#" + btnAddMaintType).bind("click", function () { InsertOrUpdateMaintType(maintMasterData.MasterDataID); return false; });
    }
    else {
        jQuery("#" + btnAddMaintType).attr('disabled', 'disabled');
    }
}

function DeleteMaintTypeClick(masterDataID) {
    jQuery("#alertMessage").removeClass("text-danger");
    jQuery("#alertMessage").html(languageResource.resMsg_DeleteMaintTypeConfirm.replace("[XXX]", jQuery.MeasuringPointNameSpace.SelectedMasterDataMessage.toLowerCase().toString()));
    jQuery("#alertModal").dialog({
        zIndex: 999999,
        modal: true,
        modal: true,
        buttons: [
            {
                text: languageResource.resMsg_Confirm,
                click: function () {
                    jQuery("#alertModal").dialog("close");
                    DeleteMaintTypeInfo(masterDataID);
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

function DeleteMaintTypeInfo(masterDataID) {

    var masterDataInfo = {};
    masterDataInfo.MasterDataID = masterDataID;
    masterDataInfo.MasterDataType = jQuery.MeasuringPointNameSpace.SelectedMasterDataType.charCodeAt();

    jQuery.ajax({
        type: "POST",
        url: jQuery.MeasuringPointNameSpace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/DeleteMasterData",
        data: JSON.stringify({ basicParam: jQuery.MeasuringPointNameSpace.BasicParam, masterDataInfo: masterDataInfo }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if (json.d != undefined && json.d != null && json.d > 0) {
                if (json.d == 2) {
                    ClearMaintenanceTypeInfo(true);
                    LoadMaintTypesInfo(jQuery.MeasuringPointNameSpace.MaintTypePagerData);
                    LoadMasterDataDropDown(false, jQuery.MeasuringPointNameSpace.SelectedMasterDataType);
                }
                else if (json.d == 1) {
                    var msg = languageResource.resMsg_MaterDataInfoInUse.replace("[XXX]", jQuery.MeasuringPointNameSpace.SelectedMasterDataMessage.toLowerCase().toString());
                    ShowErrorMessage(msg, true);
                }
            }
            else {
                var msg = languageResource.resMsg_FailedToDeleteMaintTypeInfo.replace("[XXX]", jQuery.MeasuringPointNameSpace.SelectedMasterDataMessage.toLowerCase().toString());
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
                    msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToDeleteMaintTypeInfo.replace("[XXX]", jQuery.MeasuringPointNameSpace.SelectedMasterDataMessage.toLowerCase().toString());
            }
            else {
                msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToDeleteMaintTypeInfo.replace("[XXX]", jQuery.MeasuringPointNameSpace.SelectedMasterDataMessage.toLowerCase().toString());
            }
            ShowErrorMessage(msg, true);
        },
    });
}


jQuery(document).keydown(function (event) {
    if (event.keyCode == 27) {
        jQuery("#divAddMaintenanceMasterDataModal").modal("hide");
    }
});

function DownloadQrCode() {
    var equipmentName = measuringPointViewModel.MeasuringPointName();
    var qrText = measuringPointViewModel.MeasuringCode();
    jQuery("#divQRCodeMaker").empty();
    jQuery("#divQRCodeMaker").qrcode({
        width: 128,
        height: 128,
        text: qrText
    });
    var canvas = jQuery("#divQRCodeMaker").find('canvas')[0];

    var imgData = canvas.toDataURL("image/jpeg", 1.0);
    var docDefinition = {
        content: [{
            image: imgData,
            width: 100,
            hieght: 100
        }]
    };
    if (equipmentName == undefined || equipmentName == "") {
        equipmentName = "MeasuringPoint";
    }
    pdfMake.createPdf(docDefinition).download(equipmentName + "_QRCode.pdf");

}