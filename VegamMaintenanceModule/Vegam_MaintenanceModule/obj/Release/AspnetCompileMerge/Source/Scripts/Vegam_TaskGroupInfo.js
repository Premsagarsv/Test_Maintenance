jQuery.TaskGroupInfoNameSpace = jQuery.TaskGroupInfoNameSpace || {};
jQuery.TaskGroupInfoNameSpace.BasicParam = jQuery.TaskGroupInfoNameSpace.BasicParam || {};
jQuery.TaskGroupInfoNameSpace.BasePath = "";
jQuery.TaskGroupInfoNameSpace.UploaderPath = "";
jQuery.TaskGroupInfoNameSpace.TaskDocumentPath = "";
jQuery.TaskGroupInfoNameSpace.ImagePath = "";
jQuery.TaskGroupInfoNameSpace.TaskGroupIdentifier = "";
jQuery.TaskGroupInfoNameSpace.TaskGroupVersion = 0;
jQuery.TaskGroupInfoNameSpace.TaskGroupSelectedStatus = "";
jQuery.TaskGroupInfoNameSpace.ServicePath = "";
jQuery.TaskGroupInfoNameSpace.loadControlID = "";
jQuery.TaskGroupInfoNameSpace.AccessRights = "";
jQuery.TaskGroupInfoNameSpace.IsSelectedPPE = true;
jQuery.TaskGroupInfoNameSpace.MasterDataType = { "Manufacturer": "M", "EquipmentType": "T", "EquipmentClass": "C", "MeasuringPointCategory": "P", "MPSelectionGroupCode": "G", "TaskGroupType": "S" };
jQuery.TaskGroupInfoNameSpace.UnitOfTime = { "Hours": 'H', "Minutes": 'M', "Seconds": 'S' };
jQuery.TaskGroupInfoNameSpace.ParameterType = { "SingleLineText": 'S', "MultiLineText": 'M', "Numeric": 'N', "Decimal": "D", "SelectionCode": "C" };
jQuery.TaskGroupInfoNameSpace.SelectedTaskID = 0;
jQuery.TaskGroupInfoNameSpace.TaskGroupStatus = { "Approved": "A", "Draft": "D", "MODIFIED": "M" };
jQuery.TaskGroupInfoNameSpace.DocumentType = { "DOCUMENT": "D", "IMAGE": "I", "VIDEO": "V", "NONE": "N", "SDOCUMENT": "S" };
jQuery.TaskGroupInfoNameSpace.MaintScheduleID = 0;
jQuery.TaskGroupInfoNameSpace.SelectedTaskGroupType = -1;
jQuery.TaskGroupInfoNameSpace.SelectedMasterDataType = "";
jQuery.TaskGroupInfoNameSpace.SelectedMasterDataMessage = "";
jQuery.TaskGroupInfoNameSpace.IsMaintTypeSearch = false;
jQuery.TaskGroupInfoNameSpace.SelectedMasterDataTypeID = 0;

var taskGroupViewModel = {
    TaskGroupName: ko.observable(''),
    TaskGroupTypeList: ko.observableArray([]),
    TaskGroupSelectedTypeList: ko.observable(''),

    TaskGroupErrorMsg: ko.observable(''),
    TaskGroupErrorCss: ko.observable(''),

    TaskList: ko.observableArray([]),
    IsEmptyTasklist: ko.observable(false),

    TaskInfoList: ko.observableArray([]),

    UnitOfTimeList: ko.observableArray([]),


    DefaultUploadIconPath: ko.observable(''),

    ParameterTypeList: ko.observableArray([]),
    SelectionGroupList: ko.observableArray([]),

    TaskEditEnable: ko.observable(false),
    IsProgressing: ko.observable(false),

    ModelErrorMsg: ko.observable(''),
    ModelErrorCss: ko.observable(''),

    HasDeleteAccess: ko.observable(false),
    IsUserHasSavingPermission: ko.observable(false),
    IsUserHasApprovePermission: ko.observable(false),
    ApproveEnabled: ko.observable(false),
    EnableEdit: ko.observable(false),

    ParameterTypeChanged: function (obj, event) {
        if (obj.ParameterType() === jQuery.TaskGroupInfoNameSpace.ParameterType.SelectionCode) {
            obj.isSelectionEnabled(true);
        }
        else {
            obj.isSelectionEnabled(false);
        }
    }
};
var taskViewModel = function () {
    return {
        TaskName: ko.observable(''),
        EstimatedTime: ko.observable(0),
        UnitOfTimeSelectedValue: ko.observable(''),
        SelectedEstimatedTime: ko.observable(''),
        TaskDescription: ko.observable(''),
        SafetyInstruction: ko.observable(''),

        TaskPPEList: ko.observableArray([]),
        IsTaskPPElistEmpty: ko.observable(true),
        TaskToolsList: ko.observableArray([]),
        IsTaskToolslistEmpty: ko.observable(true),

        IsEnabledEnterRemark: ko.observable(false),
        IsEnabledEnterRemarkMandatory: ko.observable(false),
        IsEnterRemarkVisible: ko.observable(false),

        IsEnabledTakePicture: ko.observable(false),
        IsEnabledTakePictureMandatory: ko.observable(false),
        IsTakePictureVisible: ko.observable(false),

        DocumentOrImageList: ko.observableArray([]),
        ParameterInfoList: ko.observableArray([])


    }
};
var instructionSelectionViewModel = {
    PopupModelName: ko.observable(''),
    InstructionSelectionList: ko.observableArray([]),
    SelectedInstrution: ko.observableArray([]),
    IsPopupProgressing: ko.observable(false),
    IsEmptyInstructionlist: ko.observable(false),
    InstructionSeleErrorMsg: ko.observable('')
};
var newParameterRow = function () {
    return {
        ParameterID: ko.observable(0),
        ParameterName: ko.observable(''),
        IsParameterMandatory: ko.observable(false),
        ParameterType: ko.observable(''),
        SelectedParameterType: ko.observable(''),
        SelectionCode: ko.observable(''),
        SelectedSelectionGroup: ko.observable(''),
        isSelectionEnabled: ko.observable(false),
        isDeleteEnabled: ko.observable(false)
    }
}

var maintenanceTypeUpdateViewModel = {
    LoadErrorMessageVisible: ko.observable(false),
    LoadErrorMessage: ko.observable(''),
    LoadErrorMessageClass: ko.observable(''),
    MaintTypePagerData: ko.observable(''),
    DefaultMaintenanceTypesArray: ko.observableArray([]),
    HasMaintTypeAccess: false,
    HasDeleteMaintTypeAccess: false
}


function LoadTaskGroupInfo(maintTypePagerData, basicParam, basePath, webservicePath, uploaderPath, imagePath, taskGroupIdentifier, versionNumber, loadControlID, accessRights, taskDocumentPath, isUserHasApprovePermission, maintScheduledId, isMaintShowAll) {
    jQuery.TaskGroupInfoNameSpace.BasePath = basePath;
    jQuery.TaskGroupInfoNameSpace.BasicParam = basicParam;
    jQuery.TaskGroupInfoNameSpace.UploaderPath = uploaderPath;
    jQuery.TaskGroupInfoNameSpace.TaskGroupIdentifier = taskGroupIdentifier;
    jQuery.TaskGroupInfoNameSpace.TaskGroupVersion = versionNumber;
    jQuery.TaskGroupInfoNameSpace.ServicePath = webservicePath;
    jQuery.TaskGroupInfoNameSpace.loadControlID = loadControlID;
    jQuery.TaskGroupInfoNameSpace.AccessRights = accessRights;
    jQuery.TaskGroupInfoNameSpace.TaskDocumentPath = taskDocumentPath;
    jQuery.TaskGroupInfoNameSpace.ImagePath = imagePath + "/Styles/Images";
    jQuery.TaskGroupInfoNameSpace.MaintTypePagerData = maintTypePagerData;

    ko.applyBindings(taskGroupViewModel, document.getElementById("divTaskGroup"));
    ko.applyBindings(instructionSelectionViewModel, document.getElementById("divSelectInstructionModal"));
    ko.applyBindings(maintenanceTypeUpdateViewModel, document.getElementById("divAddMaintenanceMasterDataModal"));

    if (accessRights === "FULL_ACCESS") {
        taskGroupViewModel.HasDeleteAccess(true);
        taskGroupViewModel.IsUserHasSavingPermission(true);
    } else if (accessRights === "EDIT_ONLY") {
        taskGroupViewModel.IsUserHasSavingPermission(true);

    }
    if (isUserHasApprovePermission.toLowerCase() === "true") {
        taskGroupViewModel.IsUserHasApprovePermission(true);
    }
    else {
        taskGroupViewModel.IsUserHasApprovePermission(false);
    }

    taskGroupViewModel.DefaultUploadIconPath(jQuery.TaskGroupInfoNameSpace.ImagePath + '/upload_icon.png');

    LoadUnitOfTime();
    LoadParameterType();
    LoadMasterDataDropDown();

    if (taskGroupIdentifier <= 0) {
        taskGroupViewModel.TaskEditEnable(false);
    }
    else {
        BindTaskGroupInfo();
        taskGroupViewModel.TaskEditEnable(true);
    }

    //Adding empty list
    ClearTaskInfo();
    jQuery(".selectDropDown").select2();

    //if from mainteanance schedule page
    jQuery.TaskGroupInfoNameSpace.MaintScheduleID = maintScheduledId;
    //if (maintScheduleID > 0 && isShowAll.toLowerCase() == "true") {
    if (isMaintShowAll.toLowerCase() == "true") {
        jQuery("#divTaskGroupHeader").hide();
        jQuery("#divTaskGroupLeftHeader").hide();
        jQuery("#divTaskGroupTaskDetails").removeClass('col-md-9');
        ShowAllTaskInfo();
    }
}

//region Loading DropDown List Methods
function LoadUnitOfTime() {
    taskGroupViewModel.UnitOfTimeList.removeAll();
    jQuery.each(jQuery.TaskGroupInfoNameSpace.UnitOfTime, function (value, key) {
        var unitOfTimeObj = {};
        unitOfTimeObj.TypeValue = key;
        unitOfTimeObj.DisplayName = value;
        taskGroupViewModel.UnitOfTimeList.push(unitOfTimeObj);
    });
}
function LoadParameterType() {
    taskGroupViewModel.ParameterTypeList.removeAll();
    jQuery.each(jQuery.TaskGroupInfoNameSpace.ParameterType, function (value, key) {
        var parameterType = {};
        parameterType.TypeValue = key;
        parameterType.DisplayName = value;
        taskGroupViewModel.ParameterTypeList.push(parameterType);
    });
}
function LoadMasterDataDropDown() {

    var masterDataInfo = {};
    masterDataInfo.TypeValue = -1;
    masterDataInfo.DisplayName = languageResource.resMsg_PleaseSelect;
    taskGroupViewModel.TaskGroupTypeList.removeAll();
    taskGroupViewModel.TaskGroupTypeList.push(masterDataInfo);

    var masterDataInfo = {};
    masterDataInfo.TypeValue = -1;
    masterDataInfo.DisplayName = languageResource.resMsg_PleaseSelect;
    taskGroupViewModel.SelectionGroupList.removeAll();
    taskGroupViewModel.SelectionGroupList.push(masterDataInfo);



    var masterDataDropDownListFilterInfo = {}
    masterDataDropDownListFilterInfo.MasterDataTypeList = [];
    masterDataDropDownListFilterInfo.MasterDataTypeList.push(jQuery.TaskGroupInfoNameSpace.MasterDataType.TaskGroupType.charCodeAt());
    masterDataDropDownListFilterInfo.MasterDataTypeList.push(jQuery.TaskGroupInfoNameSpace.MasterDataType.MPSelectionGroupCode.charCodeAt());


    jQuery.ajax({
        type: "POST",
        url: jQuery.TaskGroupInfoNameSpace.ServicePath + "/Vegam_MaintenanceService.asmx/GetAllMaintMasterDropDownDataInfo",
        data: JSON.stringify({ basicParam: jQuery.TaskGroupInfoNameSpace.BasicParam, masterDataDropDownListFilterInfo: masterDataDropDownListFilterInfo }),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (data) {
            if (data.d != undefined) {
                var masterDataDropDownList = data.d;
                jQuery.each(masterDataDropDownList.TaskGroupList, function (i, object) {
                    taskGroupViewModel.TaskGroupTypeList.push(object);
                });
                jQuery.each(masterDataDropDownList.MPGroupList, function (i, object) {
                    taskGroupViewModel.SelectionGroupList.push(object);
                });
            }
        },
        beforeSend: function () {
            taskGroupViewModel.IsProgressing(true);
        },
        complete: function () {
            taskGroupViewModel.IsProgressing(false);
            if (jQuery.TaskGroupInfoNameSpace.SelectedTaskGroupType != null) {
                taskGroupViewModel.TaskGroupSelectedTypeList(jQuery.TaskGroupInfoNameSpace.SelectedTaskGroupType);
            }
        },
        error: function (request, error) {
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                    ShowMessage(errorMsg.Message, "error");
                else {
                    ShowMessage(languageResource.resMsg_FailedToLoadDropdown, "error");
                }
            }
            else {
                ShowMessage(languageResource.resMsg_FailedToLoadDropdown, "error");

            }
        }
    });
}
//endregion Loading DropDown List Methods

//region TaskGroupInfo Methods
function BindTaskGroupInfo() {
    var taskGroupFilterInfo = {};
    taskGroupFilterInfo.IdentifierID = jQuery.TaskGroupInfoNameSpace.TaskGroupIdentifier;
    taskGroupFilterInfo.VersionNumber = jQuery.TaskGroupInfoNameSpace.TaskGroupVersion;

    jQuery.ajax({
        type: "POST",
        url: jQuery.TaskGroupInfoNameSpace.ServicePath + "/Vegam_MaintenanceService.asmx/GetTaskGroupInfo",
        data: JSON.stringify({ basicParam: jQuery.TaskGroupInfoNameSpace.BasicParam, taskGroupFilterInfo: taskGroupFilterInfo }),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data.d != undefined && data.d != null) {
                var taskGroupBasicInfo = data.d;
                taskGroupViewModel.TaskGroupName(taskGroupBasicInfo.TaskGroupName);
                var taskGroupType = taskGroupBasicInfo.TaskGroupTypeId + "";
                taskGroupViewModel.TaskGroupSelectedTypeList(taskGroupType);
                jQuery.TaskGroupInfoNameSpace.SelectedTaskGroupType = taskGroupBasicInfo.TaskGroupTypeId;
                jQuery.TaskGroupInfoNameSpace.TaskGroupSelectedStatus = String.fromCharCode(taskGroupBasicInfo.TaskGroupStatus);

                if (jQuery.TaskGroupInfoNameSpace.TaskGroupSelectedStatus != jQuery.TaskGroupInfoNameSpace.TaskGroupStatus.Approved) {
                    if (taskGroupViewModel.IsUserHasApprovePermission()) {
                        taskGroupViewModel.ApproveEnabled(true);
                    }
                }

                if (taskGroupBasicInfo.TaskBasicInfoList.length > 0) {
                    taskGroupViewModel.IsEmptyTasklist(false);
                    jQuery.each(taskGroupBasicInfo.TaskBasicInfoList, function (i, object) {
                        var taskModel = {};
                        taskModel.SequenceNum = object.SequenceNum;
                        taskModel.TaskID = object.TaskID;
                        taskModel.TaskName = ko.observable(object.TaskName);
                        taskModel.SelectedClass = ko.observable('');
                        taskGroupViewModel.TaskList.push(taskModel);
                    });
                }
                else {
                    taskGroupViewModel.IsEmptyTasklist(true);
                }
            }
            else {
                ShowMessage(languageResource.resMsg_FailedToLoadTaskGroupInfo, "error");
            }
        },
        beforeSend: function () {
            taskGroupViewModel.IsProgressing(true);
        },
        complete: function () {
            taskGroupViewModel.IsProgressing(false);
        },
        error: function (request, error) {
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                    ShowMessage(errorMsg.Message, "error");
                else {

                    ShowMessage(languageResource.resMsg_FailedToLoadTaskGroupInfo, "error");

                }
            }
            else {
                ShowMessage(languageResource.resMsg_FailedToLoadTaskGroupInfo, "error");
            }
        }
    });
}
function SaveTaskGroupInfo() {
    var isValid = true;
    var taskGroupInfo = {};
    taskGroupInfo.IdentifierID = jQuery.TaskGroupInfoNameSpace.TaskGroupIdentifier;
    taskGroupInfo.TaskGroupName = taskGroupViewModel.TaskGroupName();
    taskGroupInfo.TaskGroupTypeId = taskGroupViewModel.TaskGroupSelectedTypeList();
    taskGroupInfo.TaskGroupStatus = jQuery.TaskGroupInfoNameSpace.TaskGroupStatus.Draft.charCodeAt();
    taskGroupInfo.VersionNumber = jQuery.TaskGroupInfoNameSpace.TaskGroupVersion;

    var errorMsg = "";
    taskGroupViewModel.TaskGroupErrorMsg('');
    if (taskGroupInfo.TaskGroupName === "") {
        errorMsg += languageResource.resMsg_EnterTaskGroupName + "</br>";
        isValid = false;
    }

    if (taskGroupInfo.TaskGroupTypeId === -1) {
        errorMsg += languageResource.resMsg_PleaseSelectGroupType + "</br>";
        isValid = false;
    }

    if (!isValid) {
        ShowTaskGroupMessage(errorMsg, "error");
    }
    else {

        jQuery.ajax({
            type: "POST",
            url: jQuery.TaskGroupInfoNameSpace.ServicePath + "/Vegam_MaintenanceService.asmx/SaveTaskGroupInfo",
            data: JSON.stringify({ basicParam: jQuery.TaskGroupInfoNameSpace.BasicParam, taskGroupInfo: taskGroupInfo }),
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data.d != undefined) {
                    var taskGroupIdentifier = data.d;
                    switch (taskGroupIdentifier.IdentifierID) {
                        case 0:
                            ShowTaskGroupMessage(languageResource.resMsg_InvalidUser, "error");
                            break;
                        case -1:
                            ShowTaskGroupMessage(languageResource.resMsg_EnterTaskGroupName, "error");
                            break;
                        case -2:
                            ShowTaskGroupMessage(languageResource.resMsg_PleaseSelectGroupType, "error");
                            break;
                        case -3:
                            ShowTaskGroupMessage(languageResource.resMsg_TaskGroupAlreadyExist, "error");
                            break;
                        default:
                            {
                                if (jQuery.TaskGroupInfoNameSpace.TaskGroupVersion === 0) {
                                    jQuery.TaskGroupInfoNameSpace.TaskGroupIdentifier = taskGroupIdentifier.IdentifierID;
                                    jQuery.TaskGroupInfoNameSpace.TaskGroupVersion = taskGroupIdentifier.VersionNumber;
                                    if (taskGroupViewModel.IsUserHasApprovePermission()) {
                                        taskGroupViewModel.ApproveEnabled(true);
                                    }
                                    taskGroupViewModel.TaskEditEnable(true);
                                } else if (jQuery.TaskGroupInfoNameSpace.TaskGroupVersion === taskGroupIdentifier.VersionNumber) {
                                    ShowTaskGroupMessage(languageResource.resMsg_TaskGroupUpdatedSuccessfully, "info");
                                } else {
                                    var queryString = "?id=" + jQuery.TaskGroupInfoNameSpace.BasicParam.SiteID + "&gid=" + jQuery.TaskGroupInfoNameSpace.TaskGroupIdentifier + "&v=" + taskGroupIdentifier.VersionNumber;
                                    window.location = jQuery.TaskGroupInfoNameSpace.BasePath + "/Preventive/TaskGroupInfo.aspx" + queryString;
                                }
                            }
                            break;
                    }
                }
            },
            beforeSend: function () {
                taskGroupViewModel.IsProgressing(true);
            },
            complete: function () {
                taskGroupViewModel.IsProgressing(false);
            },
            error: function (request, error) {
                if (request.responseText != "") {
                    var errorMsg = jQuery.parseJSON(request.responseText);
                    if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                        ShowTaskGroupMessage(errorMsg.Message, "error");
                    else {
                        ShowTaskGroupMessage(languageResource.resMsg_FailedToSaveTaskGroupInfo, "error");

                    }
                }
                else {
                    ShowTaskGroupMessage(languageResource.resMsg_FailedToSaveTaskGroupInfo, "error");

                }
            }
        });
    }
}
function ShowTaskGroupMessage(message, messageType) {
    switch (messageType.toLowerCase()) {
        case 'info':
            taskGroupViewModel.TaskGroupErrorCss("text-info");
            taskGroupViewModel.TaskGroupErrorMsg(message);
            break;
        case 'error':
            taskGroupViewModel.TaskGroupErrorCss("text-danger");
            taskGroupViewModel.TaskGroupErrorMsg(message);
            break;
    }
}
//endregion TaskGroupInfo Methods

//region Task Methods
function ShowAllTaskInfo() {
    BindTaskInfo(0);
    return false;
}



function BindTaskInfo(taskID) {

    if (taskID == 0) {
        taskGroupViewModel.EnableEdit(false);
    }
    else {
        taskGroupViewModel.EnableEdit(true);
    }
    taskGroupViewModel.TaskGroupErrorMsg('');
    taskGroupViewModel.ModelErrorMsg('');
    ko.utils.arrayForEach(taskGroupViewModel.TaskList(), function (item, index) {
        if (item.TaskID === taskID) {
            item.SelectedClass('bg-info');

        } else {
            item.SelectedClass('');
        }

    });

    var taskGroupFilterInfo = {};
    taskGroupFilterInfo.IdentifierID = jQuery.TaskGroupInfoNameSpace.TaskGroupIdentifier;
    taskGroupFilterInfo.TaskID = taskID;
    taskGroupFilterInfo.VersionNumber = jQuery.TaskGroupInfoNameSpace.TaskGroupVersion;

    jQuery.ajax({
        type: "POST",
        url: jQuery.TaskGroupInfoNameSpace.ServicePath + "/Vegam_MaintenanceService.asmx/GetTaskInfo",
        data: JSON.stringify({ basicParam: jQuery.TaskGroupInfoNameSpace.BasicParam, taskFilterInfo: taskGroupFilterInfo }),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data.d != undefined && data.d != null) {
                var taskInfoList = data.d;
                var taskInfo = taskInfoList[0];
                taskGroupViewModel.TaskInfoList.removeAll();
                jQuery.each(taskInfoList, function (index, taskInfo) {
                    jQuery.TaskGroupInfoNameSpace.SelectedTaskID = taskID;
                    var taskViewModelObj = new taskViewModel();

                    taskViewModelObj.TaskName(taskInfo.TaskName);
                    taskViewModelObj.EstimatedTime(taskInfo.EstimatedTime);
                    taskViewModelObj.TaskDescription(taskInfo.Description);
                    taskViewModelObj.SafetyInstruction(taskInfo.SafetyDescription);
                    taskViewModelObj.UnitOfTimeSelectedValue(String.fromCharCode(taskInfo.UnitOfTime));

                    taskViewModelObj.TaskPPEList.removeAll();
                    if (taskInfo.PPEInfoList.length > 0) {
                        taskViewModelObj.IsTaskPPElistEmpty(false);
                        jQuery.each(taskInfo.PPEInfoList, function (index, obj) {
                            var instructions = {};
                            instructions.ID = obj.TaskPPEID;
                            instructions.InstructionID = obj.PPEID;
                            instructions.InstructionName = obj.PPEDescription;
                            instructions.ImagePath = obj.PPEImagePath;
                            taskViewModelObj.TaskPPEList.push(instructions);
                        });
                    }
                    else {
                        taskViewModelObj.IsTaskPPElistEmpty(true);
                    }


                    taskViewModelObj.TaskToolsList.removeAll();
                    if (taskInfo.ToolsInfoList.length > 0) {
                        taskViewModelObj.IsTaskToolslistEmpty(false);
                        jQuery.each(taskInfo.ToolsInfoList, function (index, obj) {
                            var instructions = {};
                            instructions.ID = obj.TaskToolsID;
                            instructions.InstructionID = obj.ToolsID;
                            instructions.InstructionName = obj.ToolsDescription;
                            instructions.ImagePath = obj.ToolsImagePath;
                            taskViewModelObj.TaskToolsList.push(instructions);
                        });
                    }
                    else {
                        taskViewModelObj.IsTaskToolslistEmpty(true);
                    }


                    taskViewModelObj.IsEnabledEnterRemark(taskInfo.RemarkEnabled);
                    if (taskInfo.RemarkEnabled) {
                        taskViewModelObj.IsEnterRemarkVisible(true);
                    } else { taskViewModelObj.IsEnterRemarkVisible(false); }
                    taskViewModelObj.IsEnabledEnterRemarkMandatory(taskInfo.RemarkMandatory);
                    taskViewModelObj.IsEnabledTakePicture(taskInfo.PictureEnabled);
                    if (taskInfo.PictureEnabled) {
                        taskViewModelObj.IsTakePictureVisible(true);
                    }
                    else { taskViewModelObj.IsTakePictureVisible(false); }
                    taskViewModelObj.IsEnabledTakePictureMandatory(taskInfo.PictureMandatory);

                    //documents
                    taskViewModelObj.DocumentOrImageList.removeAll();
                    if (taskInfo.DocumentInfoList.length > 0) {
                        jQuery.each(taskInfo.DocumentInfoList, function (index, obj) {
                            obj.DocumentDisplayName = obj.DocumentName.split('_')[1];
                            if (String.fromCharCode(obj.DocumentType) == jQuery.TaskGroupInfoNameSpace.DocumentType.VIDEO) {
                                obj.ThumbnailPath = jQuery.TaskGroupInfoNameSpace.ImagePath + '/video.png';
                            }
                            else if (String.fromCharCode(obj.DocumentType) != jQuery.TaskGroupInfoNameSpace.DocumentType.IMAGE) {
                                var ext = obj.DocumentName.substring(obj.DocumentName.lastIndexOf('.') + 1).toLowerCase();
                                obj.ThumbnailPath = jQuery.TaskGroupInfoNameSpace.ImagePath + '/' + ext + '.png';
                            }

                            taskViewModelObj.DocumentOrImageList.push(obj);
                        });
                    }
                    //Only for Show all
                    if (!taskGroupViewModel.EnableEdit()) {
                        for (var key in jQuery.TaskGroupInfoNameSpace.UnitOfTime) {
                            if (jQuery.TaskGroupInfoNameSpace.UnitOfTime[key] == String.fromCharCode(taskInfo.UnitOfTime)) {
                                taskViewModelObj.SelectedEstimatedTime(key);
                            }
                        }
                    }

                    //Parameter list
                    taskViewModelObj.ParameterInfoList.removeAll();
                    if (taskInfo.ParameterInfoList.length > 0) {
                        jQuery.each(taskInfo.ParameterInfoList, function (index, obj) {
                            var newParameterObj = new newParameterRow();
                            newParameterObj.ParameterID(obj.ParameterID);
                            newParameterObj.ParameterName(obj.ParameterName);
                            newParameterObj.IsParameterMandatory(obj.IsMandatory);
                            newParameterObj.ParameterType(String.fromCharCode(obj.ParameterType));
                            newParameterObj.isDeleteEnabled(true);
                            if (obj.SelectionGroupID > 0) {
                                newParameterObj.SelectionCode(obj.SelectionGroupID);
                            }
                            if (String.fromCharCode(obj.ParameterType) == jQuery.TaskGroupInfoNameSpace.ParameterType.SelectionCode) {
                                newParameterObj.isSelectionEnabled(true);
                            }
                            //Only for Show all
                            if (!taskGroupViewModel.EnableEdit()) {
                                for (var key in jQuery.TaskGroupInfoNameSpace.ParameterType) {
                                    if (jQuery.TaskGroupInfoNameSpace.ParameterType[key] == String.fromCharCode(obj.ParameterType)) {
                                        newParameterObj.SelectedParameterType(key);
                                    }
                                }
                                jQuery.each(taskGroupViewModel.SelectionGroupList(), function (i, groupObj) {
                                    if (groupObj.TypeValue == obj.SelectionGroupID) {
                                        newParameterObj.SelectedSelectionGroup(groupObj.DisplayName);
                                    }
                                });
                            }

                            taskViewModelObj.ParameterInfoList.push(newParameterObj);
                        });

                    }
                    else {
                        var newParameterObj = new newParameterRow();
                        taskViewModelObj.ParameterInfoList.push(newParameterObj);
                    }
                    taskGroupViewModel.TaskInfoList.push(taskViewModelObj);
                });
            }
            else {
                ShowMessage(languageResource.resMsg_FailedToLoadTaskInfo, "error");
            }
        },
        beforeSend: function () {
            taskGroupViewModel.IsProgressing(true);
        },
        complete: function () {
            taskGroupViewModel.IsProgressing(false);

        },
        error: function (request, error) {
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                    ShowMessage(errorMsg.Message, "error");
                else {
                    ShowMessage(languageResource.resMsg_FailedToLoadTaskInfo, "error");

                }
            }
            else {
                ShowMessage(languageResource.resMsg_FailedToLoadTaskInfo, "error");
            }
        }
    });

}

function SaveTaskSequence() {
    /// Updating sequence number
    jQuery("div .sorting-element").each(function (index, object) {
        var taskName = jQuery(object).find("label").text();
        ko.utils.arrayForEach(taskGroupViewModel.TaskList(), function (item, i) {
            if (item.TaskName() === taskName) {
                item.SequenceNum = index + 1;
            }
        });
    });

    var taskBasicInfoList = [];
    ko.utils.arrayForEach(taskGroupViewModel.TaskList(), function (item, i) {
        var basicTaskInfo = {};
        basicTaskInfo.TaskID = item.TaskID;
        basicTaskInfo.SequenceNum = item.SequenceNum;
        taskBasicInfoList.push(basicTaskInfo);

    });

    var taskGroupFilterInfo = {};
    taskGroupFilterInfo.IdentifierID = jQuery.TaskGroupInfoNameSpace.TaskGroupIdentifier;
    taskGroupFilterInfo.VersionNumber = jQuery.TaskGroupInfoNameSpace.TaskGroupVersion;

    jQuery.ajax({
        type: "POST",
        url: jQuery.TaskGroupInfoNameSpace.ServicePath + "/Vegam_MaintenanceService.asmx/SaveTaskSequenceInfo",
        data: JSON.stringify({ basicParam: jQuery.TaskGroupInfoNameSpace.BasicParam, filterInfo: taskGroupFilterInfo, taskBasicInfoList: taskBasicInfoList }),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data.d != undefined) {
                var taskGroupIdentifier = data.d;
                if (taskGroupIdentifier != null && taskGroupIdentifier.IdentifierID > 0) {
                    if (jQuery.TaskGroupInfoNameSpace.TaskGroupVersion != taskGroupIdentifier.VersionNumber) {
                        var queryString = "?id=" + jQuery.TaskGroupInfoNameSpace.BasicParam.SiteID + "&gid=" + jQuery.TaskGroupInfoNameSpace.TaskGroupIdentifier + "&v=" + taskGroupIdentifier.VersionNumber;
                        window.location = jQuery.TaskGroupInfoNameSpace.BasePath + "/Preventive/TaskGroupInfo.aspx" + queryString;
                    }
                }
                else {
                    ShowMessage(languageResource.resMsg_FailedToUpdateTaskSequence, "error");
                }
            }
        },
        beforeSend: function () {
            taskGroupViewModel.IsProgressing(true);
        },
        complete: function () {
            taskGroupViewModel.IsProgressing(false);
        },
        error: function (request, error) {
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                    ShowMessage(errorMsg.Message, "error");
                else {
                    ShowMessage(languageResource.resMsg_FailedToUpdateTaskSequence, "error");
                }
            }
            else {
                ShowMessage(languageResource.resMsg_FailedToUpdateTaskSequence, "error");

            }
        }
    });

}

function SaveTaskInformation() {

    var sequenceNumber = 0;
    if (jQuery.TaskGroupInfoNameSpace.SelectedTaskID === 0) {
        sequenceNumber = taskGroupViewModel.TaskList().length + 1;
    } else {
        ko.utils.arrayForEach(taskGroupViewModel.TaskList(), function (item, i) {
            if (item.TaskID === jQuery.TaskGroupInfoNameSpace.SelectedTaskID) {
                sequenceNumber = item.SequenceNum;
            }
        });
    }

    var isValid = true;
    var taskGroupFilterInfo = {};
    taskGroupFilterInfo.IdentifierID = jQuery.TaskGroupInfoNameSpace.TaskGroupIdentifier;
    taskGroupFilterInfo.TaskGroupName = taskGroupViewModel.TaskGroupName();
    taskGroupFilterInfo.TaskGroupTypeId = taskGroupViewModel.TaskGroupSelectedTypeList();
    taskGroupFilterInfo.VersionNumber = jQuery.TaskGroupInfoNameSpace.TaskGroupVersion;

    var SelectedTaskInfoViewModel = taskGroupViewModel.TaskInfoList()[0];
    var taskInfo = {};
    taskInfo.TaskID = jQuery.TaskGroupInfoNameSpace.SelectedTaskID;
    taskInfo.TaskName = SelectedTaskInfoViewModel.TaskName();
    taskInfo.SequenceNum = sequenceNumber;
    taskInfo.Description = SelectedTaskInfoViewModel.TaskDescription();
    taskInfo.SafetyDescription = SelectedTaskInfoViewModel.SafetyInstruction();
    taskInfo.EstimatedTime = SelectedTaskInfoViewModel.EstimatedTime();
    taskInfo.UnitOfTime = SelectedTaskInfoViewModel.UnitOfTimeSelectedValue().charCodeAt();
    taskInfo.RemarkEnabled = SelectedTaskInfoViewModel.IsEnabledEnterRemark();
    taskInfo.RemarkMandatory = SelectedTaskInfoViewModel.IsEnabledEnterRemarkMandatory();
    taskInfo.PictureEnabled = SelectedTaskInfoViewModel.IsEnabledTakePicture();
    taskInfo.PictureMandatory = SelectedTaskInfoViewModel.IsEnabledTakePictureMandatory();

    var ppeInfoList = [];
    ko.utils.arrayForEach(SelectedTaskInfoViewModel.TaskPPEList(), function (item, index) {
        var ppeInfo = {};
        ppeInfo.TaskPPEID = item.ID;
        ppeInfo.PPEID = item.InstructionID;
        ppeInfoList.push(ppeInfo);
    });
    taskInfo.PPEInfoList = ppeInfoList;

    var toolsInfoList = [];
    ko.utils.arrayForEach(SelectedTaskInfoViewModel.TaskToolsList(), function (item, index) {
        var toolsInfo = {};
        toolsInfo.TaskToolsID = item.ID;
        toolsInfo.ToolsID = item.InstructionID;
        toolsInfoList.push(toolsInfo);
    });

    taskInfo.ToolsInfoList = toolsInfoList;

    var isSelectedCodeInValid = false;
    var parameterInfoList = [];
    ko.utils.arrayForEach(SelectedTaskInfoViewModel.ParameterInfoList(), function (item, index) {
        var parameterInfo = {};
        parameterInfo.ParameterID = item.ParameterID();
        parameterInfo.ParameterName = item.ParameterName();
        parameterInfo.IsMandatory = item.IsParameterMandatory();
        parameterInfo.ParameterType = item.ParameterType().charCodeAt();
        parameterInfo.SelectionGroupID = item.SelectionCode();
        if (parameterInfo.ParameterName != "") {
            if (item.ParameterType() == jQuery.TaskGroupInfoNameSpace.ParameterType.SelectionCode) {
                if (item.SelectionCode() == -1) {
                    isSelectedCodeInValid = true;
                }
            }
            parameterInfoList.push(parameterInfo);
        }


    });

    taskInfo.ParameterInfoList = parameterInfoList;


    var documentInfoList = [];
    ko.utils.arrayForEach(SelectedTaskInfoViewModel.DocumentOrImageList(), function (item, index) {
        var documentInfo = {};
        documentInfo.DocumentID = item.DocumentID;
        documentInfo.DocumentName = item.DocumentName;
        documentInfo.DocumentType = item.DocumentType;
        documentInfo.ThumbnailPath = item.ThumbnailPath;
        documentInfo.DownloadPath = item.DownloadPath;
        documentInfoList.push(documentInfo);
    });
    taskInfo.DocumentInfoList = documentInfoList;



    var errorMsg = "";
    taskGroupViewModel.ModelErrorMsg('');
    taskGroupViewModel.TaskGroupErrorMsg('');

    if (taskGroupFilterInfo.TaskGroupName === "") {
        errorMsg += languageResource.resMsg_EnterTaskGroupName + "</br>";
        isValid = false;
    }

    if (taskGroupFilterInfo.TaskGroupTypeId === -1) {
        errorMsg += languageResource.resMsg_PleaseSelectGroupType + "</br>";
        isValid = false;
    }

    if (taskInfo.TaskName === "") {
        errorMsg += languageResource.resMsg_EnterTaskName + "</br>";
        isValid = false;
    }

    if (isSelectedCodeInValid) {
        errorMsg += languageResource.resMsg_PleaseSelectSelectionCode + "</br>";
        isValid = false;
    }

    if (!isValid) {
        ShowMessage(errorMsg, "error");
    }
    else {

        jQuery.ajax({
            type: "POST",
            url: jQuery.TaskGroupInfoNameSpace.ServicePath + "/Vegam_MaintenanceService.asmx/SaveTaskInfo",
            data: JSON.stringify({ basicParam: jQuery.TaskGroupInfoNameSpace.BasicParam, taskGroupFilterInfo: taskGroupFilterInfo, taskInfo: taskInfo }),
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data.d != undefined) {
                    var taskGroupIdentifier = data.d;
                    switch (taskGroupIdentifier.IdentifierID) {
                        case 0:
                            ShowMessage(languageResource.resMsg_InvalidUser, "error");
                            break;
                        case -1:
                            ShowMessage(languageResource.resMsg_EnterTaskGroupName, "error");
                            break;
                        case -2:
                            ShowMessage(languageResource.resMsg_PleaseSelectGroupType, "error");
                            break;
                        case -3:
                            ShowMessage(languageResource.resMsg_TaskGroupAlreadyExist, "error");
                            break;
                        case -4:
                            ShowMessage(languageResource.resMsg_EnterTaskName, "error");
                            break;
                            //case -5:
                            //    ShowMessage(languageResource.resMsg_PleaseEnterEstimatedTime, "error");
                            //    break;
                        case -6:
                            ShowMessage(languageResource.resMsg_TaskNameAlreadyExist, "error");
                            break;
                        case -7:
                            ShowMessage(languageResource.resMsg_TaskParameterNameAlreadyExist, "error");
                            break;
                        default:
                            {
                                if (jQuery.TaskGroupInfoNameSpace.TaskGroupSelectedStatus == jQuery.TaskGroupInfoNameSpace.TaskGroupStatus.Approved) {
                                    var queryString = "?id=" + jQuery.TaskGroupInfoNameSpace.BasicParam.SiteID + "&gid=" + jQuery.TaskGroupInfoNameSpace.TaskGroupIdentifier + "&v=" + taskGroupIdentifier.VersionNumber;
                                    window.location = jQuery.TaskGroupInfoNameSpace.BasePath + "/Preventive/TaskGroupInfo.aspx" + queryString;
                                }

                                if (jQuery.TaskGroupInfoNameSpace.SelectedTaskID == 0) {
                                    taskGroupViewModel.IsEmptyTasklist(false);
                                    var taskModel = {};
                                    taskModel.SequenceNum = sequenceNumber;
                                    taskModel.TaskID = taskGroupIdentifier.IdentifierID;
                                    taskModel.TaskName = ko.observable(taskInfo.TaskName);
                                    taskModel.SelectedClass = ko.observable('');
                                    taskGroupViewModel.TaskList.push(taskModel);
                                }
                                else {
                                    ko.utils.arrayForEach(taskGroupViewModel.TaskList(), function (item, index) {
                                        if (item.TaskID === jQuery.TaskGroupInfoNameSpace.SelectedTaskID)
                                            item.TaskName(taskInfo.TaskName);
                                    });
                                }
                                ShowMessage(languageResource.resMsg_TaskInfoSuccessfullyAdded, "info");
                                ClearTaskInfo();
                            }
                            break;
                    }
                }
            },
            beforeSend: function () {
                taskGroupViewModel.IsProgressing(true);
            },
            complete: function () {
                taskGroupViewModel.IsProgressing(false);
            },
            error: function (request, error) {
                if (request.responseText != "") {
                    var errorMsg = jQuery.parseJSON(request.responseText);
                    if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                        ShowTaskGroupMessage(errorMsg.Message, "error");
                    else {
                        ShowTaskGroupMessage(languageResource.resMsg_FailedToSaveTaskGroupInfo, "error");

                    }
                }
                else {
                    ShowTaskGroupMessage(languageResource.resMsg_FailedToSaveTaskGroupInfo, "error");

                }
            }
        });
    }
}
function DeleteTaskInfo(taskInfo) {
    taskGroupViewModel.ModelErrorMsg('');
    taskGroupViewModel.TaskGroupErrorMsg('');
    jQuery("#alertMessage").removeClass("text-danger");
    jQuery("#alertMessage").html(languageResource.resMsg_AreYouSureYouWantToDeleteTask);
    jQuery("#alertModal").dialog({
        zIndex: 1060,
        modal: true,
        buttons: [
            {
                text: languageResource.resMsg_Confirm,
                click: function () {
                    jQuery("#alertModal").dialog("close");
                    ConfirmDeleteTaskInfo(taskInfo);
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
function ConfirmDeleteTaskInfo(taskInfo) {
    if (taskInfo != null) {
        var taskGroupFilterInfo = {};
        taskGroupFilterInfo.IdentifierID = jQuery.TaskGroupInfoNameSpace.TaskGroupIdentifier;
        taskGroupFilterInfo.TaskID = taskInfo.TaskID;
        taskGroupFilterInfo.VersionNumber = jQuery.TaskGroupInfoNameSpace.TaskGroupVersion;

        jQuery.ajax({
            type: "POST",
            url: jQuery.TaskGroupInfoNameSpace.ServicePath + "/Vegam_MaintenanceService.asmx/DeleteTaskInfo",
            data: JSON.stringify({ basicParam: jQuery.TaskGroupInfoNameSpace.BasicParam, filterInfo: taskGroupFilterInfo }),
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data.d != undefined) {
                    var taskGroupIdentifier = data.d;
                    if (taskGroupIdentifier != null && taskGroupIdentifier.IdentifierID > 0) {
                        if (jQuery.TaskGroupInfoNameSpace.TaskGroupVersion === taskGroupIdentifier.VersionNumber) {
                            taskGroupViewModel.TaskList.remove(taskInfo);
                            if (taskGroupViewModel.TaskList().length == 0) {
                                taskGroupViewModel.IsEmptyTasklist(true);
                            }
                            ShowMessage(languageResource.resMsg_SuccessfullyDeletedTaskInfo, "info");
                            ClearTaskInfo();

                        } else {
                            var queryString = "?id=" + jQuery.TaskGroupInfoNameSpace.BasicParam.SiteID + "&gid=" + jQuery.TaskGroupInfoNameSpace.TaskGroupIdentifier + "&v=" + taskGroupIdentifier.VersionNumber;
                            window.location = jQuery.TaskGroupInfoNameSpace.BasePath + "/Preventive/TaskGroupInfo.aspx" + queryString;
                        }
                    }
                    else {
                        ShowMessage(languageResource.resMsg_FailedToDeleteTaskInfo, "error");
                    }
                }
            },
            beforeSend: function () {
                taskGroupViewModel.IsProgressing(true);
            },
            complete: function () {
                taskGroupViewModel.IsProgressing(false);
            },
            error: function (request, error) {
                if (request.responseText != "") {
                    var errorMsg = jQuery.parseJSON(request.responseText);
                    if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                        ShowMessage(errorMsg.Message, "error");
                    else {
                        ShowMessage(languageResource.resMsg_FailedToDeleteTaskInfo, "error");
                    }
                }
                else {
                    ShowMessage(languageResource.resMsg_FailedToDeleteTaskInfo, "error");

                }
            }
        });
    }
}
function ClearTaskInfo() {
    taskGroupViewModel.TaskGroupErrorMsg('');
    jQuery.TaskGroupInfoNameSpace.SelectedTaskID = 0;
    taskGroupViewModel.EnableEdit(true);


    taskGroupViewModel.TaskInfoList.removeAll();

    var newParameterObj = new newParameterRow();
    var taskViewModelObj = new taskViewModel();
    taskViewModelObj.ParameterInfoList.push(newParameterObj);

    taskGroupViewModel.TaskInfoList.push(taskViewModelObj);

    ko.utils.arrayForEach(taskGroupViewModel.TaskList(), function (item, index) {
        item.SelectedClass('');
    });
}
//endregion Task Methods

//region Approve
function ApproveGroupTask(parameterInfo) {
    taskGroupViewModel.ModelErrorMsg('');
    taskGroupViewModel.TaskGroupErrorMsg('');
    jQuery("#alertMessage").removeClass("text-danger");
    jQuery("#alertMessage").html(languageResource.resMsg_AreYouSureYouWantToApprove);
    jQuery("#alertModal").dialog({
        zIndex: 1060,
        modal: true,
        buttons: [
            {
                text: languageResource.resMsg_Confirm,
                click: function () {
                    jQuery("#alertModal").dialog("close");
                    ConfirmApproveGroupTask();
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
function ConfirmApproveGroupTask() {
    var taskGroupFilterInfo = {};
    taskGroupFilterInfo.IdentifierID = jQuery.TaskGroupInfoNameSpace.TaskGroupIdentifier;
    taskGroupFilterInfo.VersionNumber = jQuery.TaskGroupInfoNameSpace.TaskGroupVersion;

    jQuery.ajax({
        type: "POST",
        url: jQuery.TaskGroupInfoNameSpace.ServicePath + "/Vegam_MaintenanceService.asmx/ApproveGroupTask",
        data: JSON.stringify({ basicParam: jQuery.TaskGroupInfoNameSpace.BasicParam, taskGroupfilterInfo: taskGroupFilterInfo }),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data.d != undefined && data.d != null) {
                var responseData = data.d;
                switch (responseData) {
                    case 0:
                        ShowMessage(languageResource.resMsg_InvalidUser, "error");
                        break;
                    case -1:
                        ShowMessage(languageResource.resMsg_InvalidGroupIdentifier, "error");
                        break;
                    case -2:
                        ShowTaskGroupMessage(languageResource.resMsg_PleaseAddTasks, "error");
                        break;
                    default:
                       // var queryString = "?id=" + jQuery.TaskGroupInfoNameSpace.BasicParam.SiteID + "&gid=" + jQuery.TaskGroupInfoNameSpace.TaskGroupIdentifier + "&v=" + jQuery.TaskGroupInfoNameSpace.TaskGroupVersion;
                        var queryString = "?id=" + jQuery.TaskGroupInfoNameSpace.BasicParam.SiteID;
                        window.location = jQuery.TaskGroupInfoNameSpace.BasePath + "/Preventive/TaskGroupList.aspx" + queryString;
                        break;
                }
            }
            else {
                ShowMessage(languageResource.resMsg_FailedToApprove, "error");
            }
        },
        beforeSend: function () {
            taskGroupViewModel.IsProgressing(true);
        },
        complete: function () {
            taskGroupViewModel.IsProgressing(false);
        },
        error: function (request, error) {
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                    ShowMessage(errorMsg.Message, "error");
                else {
                    ShowMessage(languageResource.resMsg_FailedToApprove, "error");
                }
            }
            else {
                ShowMessage(languageResource.resMsg_FailedToApprove, "error");
            }
        }
    });
}
//endRegion Approve

//region Showing Message
function ShowMessage(message, messageType) {
    switch (messageType.toLowerCase()) {
        case 'info':
            taskGroupViewModel.ModelErrorCss("text-info");
            taskGroupViewModel.ModelErrorMsg(message);
            break;
        case 'error':
            taskGroupViewModel.ModelErrorCss("text-danger");
            taskGroupViewModel.ModelErrorMsg(message);
            break;
    }
}
//endregion Showing Message

//region PPE method
function ShowPPEInfo() {
    jQuery.TaskGroupInfoNameSpace.IsSelectedPPE = true;
    instructionSelectionViewModel.PopupModelName(languageResource.resMsg_PPEImage);
    instructionSelectionViewModel.InstructionSelectionList.removeAll();
    jQuery("#divSelectInstructionModal").modal("show");
    jQuery.ajax({
        type: "POST",
        url: jQuery.TaskGroupInfoNameSpace.ServicePath + "/Vegam_MaintenanceService.asmx/GetPPIDetails",
        data: JSON.stringify({ basicParam: jQuery.TaskGroupInfoNameSpace.BasicParam }),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data.d != undefined || data.d != null) {
                var instructionSelectionInfoList = data.d;
                BindInstructionImages(instructionSelectionInfoList);
            }
            else {
                ShowMessage(languageResource.resMsg_FailedToLoadPPEInfo, "error");
            }
        },
        beforeSend: function () {
            instructionSelectionViewModel.IsPopupProgressing(true);
        },
        complete: function () {
            instructionSelectionViewModel.IsPopupProgressing(false);
        },
        error: function (request, error) {
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                    ShowMessage(errorMsg.Message, "error");
                else {
                    ShowMessage(languageResource.resMsg_FailedToLoadPPEInfo, "error");

                }
            }
            else {
                ShowTaskGroupMessage(languageResource.resMsg_FailedToLoadPPEInfo, "error");
            }
        }
    });
}
function RemovePPIImage(instructionID) {
    var SelectedTaskInfoViewModel = taskGroupViewModel.TaskInfoList()[0];
    ko.utils.arrayForEach(SelectedTaskInfoViewModel.TaskPPEList(), function (item, index) {
        if (item.InstructionID === instructionID) {
            SelectedTaskInfoViewModel.TaskPPEList.splice(index, 1);
        }
    });

    if (SelectedTaskInfoViewModel.TaskPPEList().length == 0) {
        SelectedTaskInfoViewModel.IsTaskPPElistEmpty(true);
    }
}
//endregion PPE method

//region Tools method
function ShowToolsInfo() {
    jQuery.TaskGroupInfoNameSpace.IsSelectedPPE = false;
    instructionSelectionViewModel.PopupModelName(languageResource.resMsg_ToolsImage);
    instructionSelectionViewModel.InstructionSelectionList.removeAll();
    jQuery("#divSelectInstructionModal").modal("show");
    jQuery.ajax({
        type: "POST",
        url: jQuery.TaskGroupInfoNameSpace.ServicePath + "/Vegam_MaintenanceService.asmx/GetToolsDetails",
        data: JSON.stringify({ basicParam: jQuery.TaskGroupInfoNameSpace.BasicParam }),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data.d != undefined || data.d != null) {
                var instructionSelectionInfoList = data.d;
                BindInstructionImages(instructionSelectionInfoList);
            }
            else {
                ShowMessage(languageResource.resMsg_FailedToLoadToolsInfo, "error");
            }
        },
        beforeSend: function () {
            instructionSelectionViewModel.IsPopupProgressing(true);
        },
        complete: function () {
            instructionSelectionViewModel.IsPopupProgressing(false);
        },
        error: function (request, error) {
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                    ShowMessage(errorMsg.Message, "error");
                else {
                    ShowMessage(languageResource.resMsg_FailedToLoadToolsInfo, "error");

                }
            }
            else {
                ShowTaskGroupMessage(languageResource.resMsg_FailedToLoadToolsInfo, "error");
            }
        }
    });
}
function RemoveToolsImage(instructionID) {
    var SelectedTaskInfoViewModel = taskGroupViewModel.TaskInfoList()[0];
    ko.utils.arrayForEach(SelectedTaskInfoViewModel.TaskToolsList(), function (item, index) {
        if (item.InstructionID === instructionID) {
            SelectedTaskInfoViewModel.TaskToolsList.splice(index, 1);
        }
    });

    if (SelectedTaskInfoViewModel.TaskToolsList().length == 0) {
        SelectedTaskInfoViewModel.IsTaskToolslistEmpty(true);
    }
}
//endregion Tools method

//region PPE&Tools [POPUP] method
function BindInstructionImages(instructionSelectionInfoList) {
    var SelectedTaskInfoViewModel = taskGroupViewModel.TaskInfoList()[0];
    var selectedList = null;
    if (jQuery.TaskGroupInfoNameSpace.IsSelectedPPE) {
        selectedList = SelectedTaskInfoViewModel.TaskPPEList();
    }
    else {
        selectedList = SelectedTaskInfoViewModel.TaskToolsList();
    }

    instructionSelectionViewModel.SelectedInstrution.removeAll();
    if (instructionSelectionInfoList.length > 0) {
        instructionSelectionViewModel.IsEmptyInstructionlist(false);
        jQuery.each(instructionSelectionInfoList, function (index, obj) {
            instructionSelectionViewModel.InstructionSelectionList.push(obj);
            jQuery.each(selectedList, function (i, selectedObj) {
                if (obj.InstructionID === selectedObj.InstructionID) {
                    instructionSelectionViewModel.SelectedInstrution.push(obj.InstructionID);
                }
            });
        });
    } else {
        instructionSelectionViewModel.IsEmptyInstructionlist(true);
    }
}
function AddInstructionInfo() {
    var SelectedTaskInfoViewModel = taskGroupViewModel.TaskInfoList()[0];
    taskGroupViewModel.ModelErrorMsg('');
    instructionSelectionViewModel.InstructionSeleErrorMsg('');
    if (instructionSelectionViewModel.SelectedInstrution().length > 0) {
        var selectedList = null;
        if (jQuery.TaskGroupInfoNameSpace.IsSelectedPPE) {
            selectedList = SelectedTaskInfoViewModel.TaskPPEList;
            SelectedTaskInfoViewModel.IsTaskPPElistEmpty(false);
        }
        else {
            selectedList = SelectedTaskInfoViewModel.TaskToolsList;
            SelectedTaskInfoViewModel.IsTaskToolslistEmpty(false);
        }

        //selectedList.removeAll();
        ko.utils.arrayForEach(instructionSelectionViewModel.InstructionSelectionList(), function (item) {
            ko.utils.arrayForEach(instructionSelectionViewModel.SelectedInstrution(), function (selectedInstructionID) {
                if (item.InstructionID === selectedInstructionID) {
                    //Add into the array
                    var isListExist = false;
                    jQuery.each(selectedList(), function (index, obj) {
                        if (obj.InstructionID === selectedInstructionID) {
                            isListExist = true;
                        }
                    });
                    if (!isListExist) {
                        item.ID = 0;
                        selectedList.push(item);
                    }

                }
            });
        });
        jQuery("#divSelectInstructionModal").modal("hide");
    }
    else {
        instructionSelectionViewModel.InstructionSeleErrorMsg(languageResource.resMsg_PleaseSelectCheckbox);
    }

}
function ClearInstructionCheked() {
    instructionSelectionViewModel.InstructionSeleErrorMsg('');
    instructionSelectionViewModel.SelectedInstrution.removeAll();
}
//endregion PPE&Tools method

//region ParameterInfo method
function AddMoreParameter() {
    taskGroupViewModel.ModelErrorMsg('');
    var SelectedTaskInfoViewModel = taskGroupViewModel.TaskInfoList()[0];
    var newParameterObj = new newParameterRow();
    if (SelectedTaskInfoViewModel.ParameterInfoList().length > 0) {
        var isParameterEmpty = false;
        var isSelectionCodeEmpty = false;
        ko.utils.arrayForEach(SelectedTaskInfoViewModel.ParameterInfoList(), function (item) {
            var enableDeleteIcon = true;
            if (item.ParameterName() === "") {
                isParameterEmpty = true;
                enableDeleteIcon = false;
            } else if (item.ParameterType() == jQuery.TaskGroupInfoNameSpace.ParameterType.SelectionCode) {
                if (item.SelectionCode() == -1) {
                    isSelectionCodeEmpty = true;
                    enableDeleteIcon = false;
                }
            }
            item.isDeleteEnabled(enableDeleteIcon);

        });
        if (isParameterEmpty) {
            ShowMessage(languageResource.resMsg_PleaseEnterParameterName, "error");
        } else if (isSelectionCodeEmpty) {
            ShowMessage(languageResource.resMsg_PleaseSelectSelectionCode, "error");
        }
        else {
            SelectedTaskInfoViewModel.ParameterInfoList.push(newParameterObj);
        }

    } else {
        SelectedTaskInfoViewModel.ParameterInfoList.push(newParameterObj);
    }
}
function DeleteParameterInfo(parameterInfo) {
    taskGroupViewModel.TaskGroupErrorMsg('');
    taskGroupViewModel.ModelErrorMsg('');
    jQuery("#alertMessage").removeClass("text-danger");
    jQuery("#alertMessage").html(languageResource.resMsg_AreYouSureYouWantToDeleteParameter);
    jQuery("#alertModal").dialog({
        zIndex: 1060,
        modal: true,
        buttons: [
            {
                text: languageResource.resMsg_Confirm,
                click: function () {
                    jQuery("#alertModal").dialog("close");
                    var SelectedTaskInfoViewModel = taskGroupViewModel.TaskInfoList()[0];
                    SelectedTaskInfoViewModel.ParameterInfoList.remove(parameterInfo);
                    if (SelectedTaskInfoViewModel.ParameterInfoList().length == 0) {
                        var newParameterObj = new newParameterRow();
                        SelectedTaskInfoViewModel.ParameterInfoList.push(newParameterObj);
                    }
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
//endregion ParameterInfo method

//region Upload Doc/Image
function AddDocumentOrImageOrVideoInfo() {
    var fileName = ""; var isValid = false; var errorMessage = '';
    var fileUploadedThumbnailICon = "";
    var capturedImage = jQuery("#instructionFileUpload").val();
    var uploadedName = capturedImage.substring(capturedImage.lastIndexOf('\\') + 1);
    var downloadPath = jQuery.TaskGroupInfoNameSpace.TaskDocumentPath + "/" + jQuery.TaskGroupInfoNameSpace.BasicParam.SiteID + "/" + jQuery.TaskGroupInfoNameSpace.TaskGroupIdentifier;
    if (capturedImage == 'undefined' || capturedImage == "") {
        errorMessage = languageResource.resMsg_FaliedToUpload;
    }
    else {
        var ext = capturedImage.substring(capturedImage.lastIndexOf('.') + 1).toLowerCase();
        if ((ext == "pdf" || ext == "xls" || ext == "xlsx" || ext == "doc" || ext == "docx" || ext == "txt" || ext == "xps" || ext == "ppt" || ext == "pptx")) {
            var currentDate = new Date();
            currentDateAndTime = currentDate.format("yyyyMMddhhmmss");
            fileName = "Doc" + currentDateAndTime + "_" + uploadedName;
            fileUploadedThumbnailICon = jQuery.TaskGroupInfoNameSpace.ImagePath + '/' + ext + '.png';
            isValid = true;
            fileType = jQuery.TaskGroupInfoNameSpace.DocumentType.DOCUMENT;

        } else if ((ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg")) {
            var currentDate = new Date();
            currentDateAndTime = currentDate.format("yyyyMMddhhmmss");
            fileName = "Img" + currentDateAndTime + "_" + uploadedName;
            fileUploadedThumbnailICon = downloadPath + "/Thumbnail/" + fileName;
            isValid = true;
            fileType = jQuery.TaskGroupInfoNameSpace.DocumentType.IMAGE;
        }
        else if (ext == "ogg" || ext == "ogv" || ext == "avi" || ext == "mpeg" || ext == "mov" || ext == "wmv" || ext == "flv" || ext == "mp4" || ext == "mpg") {
            var currentDate = new Date();
            currentDateAndTime = currentDate.format("yyyyMMddhhmmss");
            fileName = "Vid" + currentDateAndTime + "_" + uploadedName;
            fileUploadedThumbnailICon = jQuery.TaskGroupInfoNameSpace.ImagePath + '/video.png';
            isValid = true;
            fileType = jQuery.TaskGroupInfoNameSpace.DocumentType.VIDEO;
        }
        else {
            errorMessage = languageResource.resMsg_InvalidUploadingFormat;
        }
    }

    if (!isValid) {
        ShowMessage(errorMessage, "error");
    }
    else {
        var urlString = jQuery.TaskGroupInfoNameSpace.UploaderPath + '?uid=' + jQuery.TaskGroupInfoNameSpace.BasicParam.UserID + '&sid=' + jQuery.TaskGroupInfoNameSpace.BasicParam.SiteID + '&tid=' + jQuery.TaskGroupInfoNameSpace.TaskGroupIdentifier + '&fileName=' + fileName + '&taskGroupDoc=true';

        jQuery.ajaxFileUpload({
            type: "POST",
            url: urlString,
            fileElementId: 'instructionFileUpload',
            processData: false,
            success: function (data, status) {
                jQuery("#instructionFileUpload").val('');
                if (data.documentElement.innerText != "true") {
                    ShowMessage(languageResource.resMsg_FaliedToUpload, "error");
                    fileName = '';
                }
                else {
                    var documentInfo = {};
                    documentInfo.DocumentID = 0;
                    documentInfo.DocumentName = fileName;
                    documentInfo.DocumentType = fileType.charCodeAt(0);
                    documentInfo.ThumbnailPath = fileUploadedThumbnailICon;
                    documentInfo.DownloadPath = downloadPath + "/" + fileName;
                    documentInfo.DocumentDisplayName = uploadedName;
                    var SelectedTaskInfoViewModel = taskGroupViewModel.TaskInfoList()[0];
                    SelectedTaskInfoViewModel.DocumentOrImageList.push(documentInfo);
                }
            },
            error: function (request, error) {
                jQuery("#instructionFileUpload").val('');
                var errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FaliedToUpload;
                if (request.responseText != "") {
                    var errorMsg = jQuery.parseJSON(request.responseText);
                    if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                        errorMessage = languageResource.resMsg_Error + errorMsg.Message;
                }
                fileName = '';
            }
        });
    }

}
function DownloadDocumentOrImageOrVideoInfo(item) {
    if (item.DownloadPath.length > 0 && item.DocumentName.length > 0) {
        var fileName = item.DocumentName;
        var filePath = item.DownloadPath;
        window.location = jQuery.TaskGroupInfoNameSpace.BasePath + "/HandlerFiles/DownloadHandler.ashx?MaintenanceDocsName=" + fileName + "&MaintenanceDocsPath=" + filePath;

    }
    else {
        var errorMessage = '';
        if (item.DocumentType == 'I' || item.DocumentType == 'V') {
            errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToDownloadImageOrVideo;
        }
        else if (item.DocumentType == 'D') {
            errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToDownloadDocument;
        }
        ShowMessage(errorMessage, "error");
    }
}
function DeleteDocumentOrImageOrVideoInfo(documentInfo) {
    var SelectedTaskInfoViewModel = taskGroupViewModel.TaskInfoList()[0];
    SelectedTaskInfoViewModel.DocumentOrImageList.remove(documentInfo);
}
//endregion

//region CheckBox change event for Remark & TakePicture
function ChkTakePictureChanged(ctrl) {
    var isChecked = jQuery(ctrl).prop("checked"); //Fixing because of IE is not triggering

    var SelectedTaskInfoViewModel = taskGroupViewModel.TaskInfoList()[0];
    if (isChecked) {
        SelectedTaskInfoViewModel.IsTakePictureVisible(true);
    } else {
        SelectedTaskInfoViewModel.IsTakePictureVisible(false);
        SelectedTaskInfoViewModel.IsEnabledTakePictureMandatory(false);
    }
}
function ChkEnterRemarkChanged(ctrl) {
    var isChecked = jQuery(ctrl).prop("checked"); //Fixing because of IE is not triggering

    var SelectedTaskInfoViewModel = taskGroupViewModel.TaskInfoList()[0];
    if (isChecked) {
        SelectedTaskInfoViewModel.IsEnterRemarkVisible(true);
    } else {
        SelectedTaskInfoViewModel.IsEnterRemarkVisible(false);
        SelectedTaskInfoViewModel.IsEnabledEnterRemarkMandatory(false);
    }
}
//region Upload Doc/Image


//add task group type modal

function ShowAddMaintenanceTypeModal(type, indexPos) {
    jQuery.TaskGroupInfoNameSpace.SelectedMasterDataType = type;
    BindMasterDataInfo();
    ClearMaintenanceTypeInfo();
    var btnAddMaintType = jQuery.TaskGroupInfoNameSpace.MaintTypePagerData.LoadControlID;
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

function BindIconAttributes(hasAccess) {
    var iconAttributes = {};
    if (!hasAccess) {
        iconAttributes.disabled = "disabled";
    }
    return iconAttributes;
}

function BindMasterDataInfo() {
    if (jQuery.TaskGroupInfoNameSpace.SelectedMasterDataType == jQuery.TaskGroupInfoNameSpace.MasterDataType.TaskGroupType) {
        jQuery("#modalHeaderName").text(languageResource.resMsg_TaskGroupTypeInformation);
        jQuery(".labelMasterDataType").text(languageResource.resMsg_TaskGroupType);
        jQuery("#fieldsetAddedit").text(languageResource.resMsg_AddEditMasterData.replace("[XXX]", languageResource.resMsg_TaskGroupType));
        jQuery("#spnViewAllMaintTypes").text(languageResource.resMsg_ClickHereToView.replace("[XXX]", languageResource.resMsg_TaskGroupType));
        jQuery("#spanListofInfo").text(languageResource.resMsg_ListOfMasterData.replace("[XXX]", languageResource.resMsg_TaskGroupType + 's'));
        jQuery.TaskGroupInfoNameSpace.SelectedMasterDataMessage = languageResource.resMsg_TaskGroupType;
    }
}

function SearchMaintTypes() {
    jQuery.TaskGroupInfoNameSpace.IsMaintTypeSearch = true;

    if (jQuery.TaskGroupInfoNameSpace.IsMaintTypeSearch == true) {
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
    var btnAddMaintType = jQuery.TaskGroupInfoNameSpace.MaintTypePagerData.LoadControlID;
    jQuery("#" + btnAddMaintType).val("");
    jQuery("#" + btnAddMaintType).text(languageResource.resMsg_Add);

    var thMaintTypes = jQuery.TaskGroupInfoNameSpace.MaintTypePagerData.LoadControlID.replace("btnAddMaintType", "thMaintTypes");
    jQuery("#" + thMaintTypes + " i").removeClass('fa-sort-up');
    jQuery("#" + thMaintTypes + " i").removeClass('fa-sort-down');
    jQuery("#hdfSortValue").val('');
    jQuery("#divMaintTypes").removeClass("hide");
    jQuery("#iconViewMaintTypes").removeClass("fa fa-plus-circle");
    jQuery("#iconViewMaintTypes").addClass("fa fa-minus-circle");

    var maintTypeAccess = jQuery.TaskGroupInfoNameSpace.MaintTypePagerData.PageAccessRights.toLowerCase();
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

    LoadMaintTypesInfo(jQuery.TaskGroupInfoNameSpace.MaintTypePagerData);
}

function ShowAllMaintTypes() {
    jQuery.TaskGroupInfoNameSpace.IsMaintTypeSearch = false;
    ClearMaintenanceTypeInfo();
    jQuery("#btnShowAll").addClass('hide');

    var thMaintTypes = jQuery.TaskGroupInfoNameSpace.MaintTypePagerData.LoadControlID.replace("btnAddMaintType", "thMaintTypes");
    jQuery("#" + thMaintTypes + " i").removeClass('fa-sort-up');
    jQuery("#" + thMaintTypes + " i").removeClass('fa-sort-down');
    jQuery("#hdfSortValue").val('');
    jQuery("#divMaintTypes").removeClass("hide");
    jQuery("#iconViewMaintTypes").removeClass("fa fa-plus-circle");
    jQuery("#iconViewMaintTypes").addClass("fa fa-minus-circle");

    var btnAddMaintType = jQuery.TaskGroupInfoNameSpace.MaintTypePagerData.LoadControlID;
    jQuery("#" + btnAddMaintType).text(languageResource.resMsg_Add);

    var maintTypeAccess = jQuery.TaskGroupInfoNameSpace.MaintTypePagerData.PageAccessRights.toLowerCase();
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

    LoadMaintTypesInfo(jQuery.TaskGroupInfoNameSpace.MaintTypePagerData);
}

function ClearMaintenanceTypeInfo() {

    if (jQuery.TaskGroupInfoNameSpace.SelectedMasterDataTypeID > 0)
    {
        LoadMasterDataDropDown();
        var isDataFound = false;
        jQuery.each(taskGroupViewModel.TaskGroupTypeList(), function (index, obj) {
            if (obj.TypeValue == jQuery.TaskGroupInfoNameSpace.SelectedMasterDataTypeID)
                isDataFound = true;
        });
        if (isDataFound) {
            taskGroupViewModel.TaskGroupSelectedTypeList(jQuery.TaskGroupInfoNameSpace.SelectedMasterDataTypeID);
        }           
    }

    jQuery("#spnSearchError").html("");
    jQuery("#spnAddMaintTypeError").html("");
    var btnAddMaintType = jQuery.TaskGroupInfoNameSpace.MaintTypePagerData.LoadControlID;
    jQuery("#" + btnAddMaintType).text(languageResource.resMsg_Add);
    if (jQuery.TaskGroupInfoNameSpace.MaintTypePagerData.PageAccessRights.toLowerCase() == "full_access") {
        jQuery("#" + btnAddMaintType).removeAttr('disabled');
        jQuery("#" + btnAddMaintType).prop("onclick", null);
        jQuery("#" + btnAddMaintType).unbind('click');
        jQuery("#" + btnAddMaintType).bind("click", function () { InsertOrUpdateMaintType(0); return false; });
    }
    else {
        jQuery("#" + btnAddMaintType).attr('disabled', 'disabled');
    }

    if (jQuery.TaskGroupInfoNameSpace.MaintTypePagerData.PageAccessRights.toLowerCase() != "full_access") {
        jQuery("#" + btnAddMaintType).attr("disabled", "disabled");
    }
    var btnShowAll = "btnShowAll";
    if (jQuery.trim(jQuery("#txtNewMaintType").val()) == "" && jQuery.trim(jQuery("#txtMasterDescription").val()) == "" && jQuery.trim(jQuery("#txtSearchMaintType").val()) == "" && (jQuery("#" + btnShowAll).is(':visible') == false)) {
        jQuery("#divAddMaintenanceMasterDataModal").modal("hide");
        //LoadMasterDataDropDown();
    }
    else {
        jQuery("#txtNewMaintType").val("");
        jQuery("#txtSearchMaintType").val("");
        jQuery("#txtMasterDescription").val("");
        autoheight('#txtMasterDescription');
        if (jQuery("#" + btnShowAll).is(':visible')) {
            jQuery("#" + btnShowAll).addClass('hide');
            LoadMaintTypesInfo(jQuery.TaskGroupInfoNameSpace.MaintTypePagerData);
        }
    }

    if (jQuery("#divAddMaintenanceMasterDataModal").hasClass('ui-dialog-content')) {
        jQuery("#divAddMaintenanceMasterDataModal").dialog("close");
    }
}

function ShowHideMaintTypesInfo() {
    if (jQuery("#iconViewMaintTypes").hasClass("fa-plus-circle")) {
        var thMaintTypes = jQuery.TaskGroupInfoNameSpace.MaintTypePagerData.LoadControlID.replace("btnAddMaintType", "thMaintTypes");
        jQuery("#" + thMaintTypes + " i").removeClass('fa-sort-up');
        jQuery("#" + thMaintTypes + " i").removeClass('fa-sort-down');
        jQuery("#hdfSortValue").val('');
        jQuery("#divMaintTypes").removeClass("hide");
        jQuery("#iconViewMaintTypes").removeClass("fa fa-plus-circle");
        jQuery("#iconViewMaintTypes").addClass("fa fa-minus-circle");

        var maintTypeAccess = jQuery.TaskGroupInfoNameSpace.MaintTypePagerData.PageAccessRights.toLowerCase();
        if (maintTypeAccess == "full_access" || maintTypeAccess == "edit_only")
            maintenanceTypeUpdateViewModel.HasMaintTypeAccess = true;
        if (maintTypeAccess == "full_access") {
            maintenanceTypeUpdateViewModel.HasDeleteMaintTypeAccess = true;
        }
        LoadMaintTypesInfo(jQuery.TaskGroupInfoNameSpace.MaintTypePagerData);
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
    masterDataFilterInfo.MasterDataType = jQuery.TaskGroupInfoNameSpace.SelectedMasterDataType.charCodeAt();

    if (jQuery.TaskGroupInfoNameSpace.IsMaintTypeSearch == true) {
        if (jQuery.trim(jQuery("#txtSearchMaintType").val()) != "") {
            masterDataFilterInfo.SearchString = jQuery.trim(jQuery("#txtSearchMaintType").val());
        }
    }

    if (jQuery("#hdfSortValue").val() != "") {
        masterDataFilterInfo.SortType = jQuery("#hdfSortValue").val();
    }

    jQuery.ajax({
        type: "POST",
        url: jQuery.TaskGroupInfoNameSpace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetMaintMasterDataWithPager",
        data: JSON.stringify({ pagerData: pagerData, basicParam: jQuery.TaskGroupInfoNameSpace.BasicParam, masterDataFilterInfo: masterDataFilterInfo }),
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
                maintenanceTypeUpdateViewModel.LoadErrorMessage(languageResource.resMsg_FailedToLoadMaintTypeInfo.replace("[XXX]", jQuery.TaskGroupInfoNameSpace.SelectedMasterDataMessage.toLowerCase().toString()));
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
            var errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadMaintTypeInfo.replace("[XXX]", jQuery.TaskGroupInfoNameSpace.SelectedMasterDataMessage.toLowerCase().toString());
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
    var btnAddMaintType = jQuery.TaskGroupInfoNameSpace.MaintTypePagerData.LoadControlID;
    jQuery("#" + btnAddMaintType).text(languageResource.resMsg_Update);
    if (jQuery.TaskGroupInfoNameSpace.MaintTypePagerData.PageAccessRights.toLowerCase() == "full_access" || jQuery.TaskGroupInfoNameSpace.MaintTypePagerData.PageAccessRights.toLowerCase() == "edit_only") {
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
    jQuery("#alertMessage").html(languageResource.resMsg_DeleteMaintTypeConfirm.replace("[XXX]", jQuery.TaskGroupInfoNameSpace.SelectedMasterDataMessage.toLowerCase().toString()));
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
    masterDataInfo.MasterDataType = jQuery.TaskGroupInfoNameSpace.SelectedMasterDataType.charCodeAt();
    jQuery.ajax({
        type: "POST",
        url: jQuery.TaskGroupInfoNameSpace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/DeleteMasterData",
        data: JSON.stringify({ basicParam: jQuery.TaskGroupInfoNameSpace.BasicParam, masterDataInfo: masterDataInfo }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if (json.d != undefined && json.d != null && json.d > 0) {
                if (json.d == 2) {
                    LoadMaintTypesInfo(jQuery.TaskGroupInfoNameSpace.MaintTypePagerData);
                }
                else if (json.d == 1) {
                    var msg = languageResource.resMsg_MaterDataInfoInUse.replace("[XXX]", jQuery.TaskGroupInfoNameSpace.SelectedMasterDataMessage.toLowerCase().toString());
                    ShowErrorMessage(msg, true);
                }
                //if (!addEquipmentViewModel.CheckReferModel())
                //	BindMaintenanceMasterInfo(false, jQuery.TaskGroupInfoNameSpace.SelectedMasterDataType);
            }
            else {
                var msg = languageResource.resMsg_FailedToDeleteMaintTypeInfo.replace("[XXX]", jQuery.TaskGroupInfoNameSpace.SelectedMasterDataMessage.toLowerCase().toString());
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
                    msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToDeleteMaintTypeInfo.replace("[XXX]", jQuery.TaskGroupInfoNameSpace.SelectedMasterDataMessage.toLowerCase().toString());
            }
            else {
                msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToDeleteMaintTypeInfo.replace("[XXX]", jQuery.TaskGroupInfoNameSpace.SelectedMasterDataMessage.toLowerCase().toString());
            }
            ShowErrorMessage(msg, true);
        },
    });
}

function InsertOrUpdateMaintType(maintTypeID) {
    jQuery.TaskGroupInfoNameSpace.SelectedMasterDataTypeID = 0;
    jQuery("#spnAddMaintTypeError").removeClass('text-danger').removeClass('text-info');
    jQuery("#spnAddMaintTypeError").text('');
    if (jQuery.trim(jQuery("#txtNewMaintType").val()).length == 0) {
        jQuery("#spnAddMaintTypeError").addClass('text-danger');
        jQuery("#spnAddMaintTypeError").text(languageResource.resMsg_EnterMaintType.replace("[XXX]", jQuery.TaskGroupInfoNameSpace.SelectedMasterDataMessage.toLowerCase().toString()));
    }
    else {
        var masterDataInfo = {};
        masterDataInfo.MasterDataID = maintTypeID;
        masterDataInfo.MasterDataName = jQuery.trim(jQuery("#txtNewMaintType").val());
        masterDataInfo.MasterDataType = jQuery.TaskGroupInfoNameSpace.SelectedMasterDataType.charCodeAt();
        masterDataInfo.Description = jQuery.trim(jQuery("#txtMasterDescription").val());
        jQuery.ajax({
            type: "POST",
            url: jQuery.TaskGroupInfoNameSpace.MaintTypePagerData.ServicePath + "/Vegam_MaintenanceService.asmx/InsertUpdateMasterData",
            data: JSON.stringify({ basicParam: jQuery.TaskGroupInfoNameSpace.BasicParam, masterDataInfo: masterDataInfo }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                if (json.d != undefined && json.d != null && json.d > 0) {
                    jQuery("#txtNewMaintType").val("");
                    jQuery("#txtMasterDescription").val("");
                    autoheight('#txtMasterDescription');
                    var btnAddMaintType = jQuery.TaskGroupInfoNameSpace.MaintTypePagerData.LoadControlID;
                    jQuery("#" + btnAddMaintType).text(languageResource.resMsg_Add);
                    if (jQuery.TaskGroupInfoNameSpace.MaintTypePagerData.PageAccessRights.toLowerCase() == "full_access") {
                        jQuery("#" + btnAddMaintType).removeAttr('disabled');
                        jQuery("#" + btnAddMaintType).prop("onclick", null);
                        jQuery("#" + btnAddMaintType).unbind('click');
                        jQuery("#" + btnAddMaintType).bind("click", function () { InsertOrUpdateMaintType(0); return false; });
                    }
                    else {
                        jQuery("#" + btnAddMaintType).attr('disabled', 'disabled');
                    }
                    jQuery("#spnAddMaintTypeError").addClass('text-info');
                    jQuery.TaskGroupInfoNameSpace.SelectedMasterDataTypeID = json.d;
                    
                    if (json.d == maintTypeID)
                        jQuery("#spnAddMaintTypeError").text(languageResource.resMsg_UpdatedMaintType.replace("[XXX]", jQuery.TaskGroupInfoNameSpace.SelectedMasterDataMessage.toLowerCase().toString()));
                    else
                        jQuery("#spnAddMaintTypeError").text(languageResource.resMsg_InsertedMaintType.replace("[XXX]", jQuery.TaskGroupInfoNameSpace.SelectedMasterDataMessage.toLowerCase().toString()));
                    LoadMaintTypesInfo(jQuery.TaskGroupInfoNameSpace.MaintTypePagerData);
                    
                }
                else {
                    if (json.d == -3) {
                        jQuery("#spnAddMaintTypeError").addClass('text-danger');
                        jQuery("#spnAddMaintTypeError").text(languageResource.resMsg_MaintenanceTypeAlreadyExists.replace("[XXX]", jQuery.TaskGroupInfoNameSpace.SelectedMasterDataMessage.toLowerCase().toString()));
                    }
                    else {
                        var msg = languageResource.resMsg_FailedToInsertMaintTypeInfo.replace("[XXX]", jQuery.TaskGroupInfoNameSpace.SelectedMasterDataMessage.toLowerCase().toString());
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
                        msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToInsertMaintTypeInfo.replace("[XXX]", jQuery.TaskGroupInfoNameSpace.SelectedMasterDataMessage.toLowerCase().toString());
                }
                else {
                    msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToInsertMaintTypeInfo.replace("[XXX]", jQuery.TaskGroupInfoNameSpace.SelectedMasterDataMessage.toLowerCase().toString());
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
        LoadMaintTypesInfo(jQuery.TaskGroupInfoNameSpace.MaintTypePagerData);
        return false;
    }
    if (jQuery("#" + thValue + " i").hasClass('fa-sort-up')) {
        jQuery(".fa-sort-down").removeClass('fa fa-sort-down');
        jQuery(".fa-sort-up").removeClass('fa fa-sort-up');

        jQuery("#" + thValue + " i").addClass('fa fa-sort-down');
        thClass = value + "_desc";
        jQuery("#hdfSortValue").val(thClass);
        LoadMaintTypesInfo(jQuery.TaskGroupInfoNameSpace.MaintTypePagerData);
        return false;
    }
    if (jQuery("#" + thValue + " i").hasClass('fa-sort-down')) {
        jQuery(".fa-sort-down").removeClass('fa fa-sort-down');
        jQuery(".fa-sort-up").removeClass('fa fa-sort-up');

        jQuery("#" + thValue + " i").addClass('fa fa-sort-up');
        thClass = value + "_asc";
        jQuery("#hdfSortValue").val(thClass);
        LoadMaintTypesInfo(jQuery.TaskGroupInfoNameSpace.MaintTypePagerData);
        return false;
    }
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
