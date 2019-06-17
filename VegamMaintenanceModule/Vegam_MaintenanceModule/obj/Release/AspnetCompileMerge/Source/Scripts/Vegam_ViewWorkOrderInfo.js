jQuery.WorkOrderNamespace = jQuery.WorkOrderNamespace || {};
jQuery.WorkOrderNamespace.BasicParam = jQuery.WorkOrderNamespace.BasicParam || {};
jQuery.WorkOrderNamespace.WorkOrderStatusInfo = {};
jQuery.WorkOrderNamespace.WorkOrderTaskStatusInfo = {};
jQuery.WorkOrderNamespace.DocumentType = { "DOCUMENT": 68, "IMAGE": 73, "VIDEO": 86, "NONE": 78, "SDOCUMENT":83 };
jQuery.WorkOrderNamespace.ImagePath = '';
jQuery.WorkOrderNamespace.ServicePath = '';
jQuery.WorkOrderNamespace.WorkOrder = '';
jQuery.WorkOrderNamespace.WorkOrderStatus = '';
jQuery.WorkOrderNamespace.BasePath = '';
jQuery.WorkOrderNamespace.UploaderPath = '';

var workOrderViewModal = {
    MaintenanceName: ko.observable(''),
    Description: ko.observable(''),
    MaintenanceType: ko.observable(''),
    Priority: ko.observable(''),
    StatusText: ko.observable(''),
    StatusImage: ko.observable(''),
    ScheduledDate: ko.observable(''),
    StartDate: ko.observable(''),
    ActualStartDate: ko.observable(''),
    ActualEndDate: ko.observable(''),
    EstimatedTime: ko.observable(''),
    ActualTime: ko.observable(''),
    AssignedTo: ko.observable(''),
    ReportedTo: ko.observable(''),
    EquipmentImagePath: ko.observable(''),
    EquipmentName: ko.observable(''),
    EquipmentType: ko.observable(''),       
    
    Location: ko.observable(''),    
    EquipmentClass: ko.observable(''),
    ModelNumber: ko.observable(''),
    ModelName: ko.observable(''),
    Manufacturer: ko.observable(''),
    SerialNumber: ko.observable(''),
    WarrentyNo: ko.observable(''),
    WarrentyStatus: ko.observable(''),
    WarrentyExpiry: ko.observable(''),
    PurchaseDate: ko.observable(''),
    InstalledDate: ko.observable(''),  
    ImagesAndVideosList: ko.observableArray([]),
    ManualDocumentsList: ko.observableArray([]),
    SpecificationDocumentsList: ko.observableArray([]),

    HasTaskAccess: ko.observable(false),
    HasEditAccess: ko.observable(false),
    taskInfoList: ko.observableArray([]),
    parameterTypeInfo: { "SingleLineText": 83, "MultiLineText": 77, "Numeric": 78, "Decimal": 68, "SelectionCode": 67 },
    CaptureDefaultImagePath: '',
    ShowLoadProgress: ko.observable(false),
    TaskGroupNotFoundMessage: ko.observable(false),
    ShowImageUploadProgress: ko.observable(false)
};

var startTaskViewModal = {
    TaskID: '',
    SafetyInstruction: ko.observable(),
    PPEList: ko.observableArray([]),
    ShowSafetyInstruction: ko.observable(false),
    ShowPPEInfo: ko.observable(false),
    IsSafetyConfirmed: ko.observable(false),
    IsPPEConfirmed: ko.observable(false),
    StartTaskConfirmError: ko.observable('')
};
    
workOrderViewModal.EquipmentName.subscribe(function (newValue) {
    if (newValue.length > 0) jQuery("#liEquipment").removeClass("hide");
    else jQuery("#liEquipment").addClass("hide");
});

function LoadWorkOrderBasicInfo(basicParam, servicePath, workOrder, imagePath, basePath, uploaderPath, pageAccess) {
    jQuery.WorkOrderNamespace.BasicParam = basicParam;
    jQuery.WorkOrderNamespace.ServicePath = servicePath;
    jQuery.WorkOrderNamespace.WorkOrder = workOrder;
    jQuery.WorkOrderNamespace.ImagePath = imagePath;
    jQuery.WorkOrderNamespace.BasePath = basePath;
    jQuery.WorkOrderNamespace.UploaderPath = uploaderPath;

    workOrderViewModal.CaptureDefaultImagePath = imagePath + '/upload_icon.png';

    if (pageAccess.toLowerCase() == 'full_access') {
        workOrderViewModal.HasTaskAccess(true);
        workOrderViewModal.HasEditAccess(true);
    }
    else if (pageAccess.toLowerCase() == 'edit_only') {
        workOrderViewModal.HasEditAccess(true);
    }

    ko.applyBindings(workOrderViewModal, document.getElementById("divWorkOrderInfo"));
    ko.applyBindings(startTaskViewModal, document.getElementById("divStartTaskModalBody"));

    GetEnumTypeInfo("MAINT_WORKORDERSTATUS");
    LoadWorkOrderInfo("lnkGeneral");
    GetEnumTypeInfo("MAINT_WORKORDER_TASK_STATUS");
}

function LoadWorkOrderGeneralInfo() {
    workOrderViewModal.TaskGroupNotFoundMessage(false);

    var filter = {};
    filter.WorkOrderID = jQuery.WorkOrderNamespace.WorkOrder;
    jQuery.extend(filter, jQuery.WorkOrderNamespace.BasicParam);
    
    jQuery.ajax({
        type: "POST",
        url: jQuery.WorkOrderNamespace.ServicePath + "/Vegam_MaintenanceService.asmx/GetWorkOrderBasicInfo",
        data: JSON.stringify({ filter: filter }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",        
        success: function (json) {
            if (json.d != null && json.d != undefined) {               
                jQuery.WorkOrderNamespace.WorkOrderStatus = json.d.Status;
                workOrderViewModal.MaintenanceName(json.d.MaintenanceName);
                workOrderViewModal.Description(json.d.Description);
                workOrderViewModal.MaintenanceType(json.d.MaintenanceType);
                workOrderViewModal.Priority(json.d.Priority);                
                workOrderViewModal.ScheduledDate(json.d.ScheduledDateTime);
                workOrderViewModal.StartDate(json.d.StartDateTime);
                workOrderViewModal.ActualStartDate(json.d.ActualStartDateTime);
                workOrderViewModal.ActualEndDate(json.d.CompletedDateTime);
                workOrderViewModal.EstimatedTime(json.d.EstimatedTime);
                workOrderViewModal.ActualTime(json.d.ActualTime);
                workOrderViewModal.AssignedTo(json.d.AssignedTo);
                workOrderViewModal.ReportedTo(json.d.ReportedTo);
                workOrderViewModal.EquipmentImagePath(json.d.EquipmentImagePath);
                workOrderViewModal.EquipmentName(json.d.EquipmentName);
                workOrderViewModal.EquipmentType(json.d.EquipmentType);
                var statusInfo = GetStatusInfo(json.d.Status, true);
                workOrderViewModal.StatusText(statusInfo.DisplayName);
                workOrderViewModal.StatusImage(jQuery.WorkOrderNamespace.ImagePath + "/" + statusInfo.ImageName);                  
            }
        },
        beforeSend: function () {
        },
        complete: function () {
        },
        error: function (request, error) {
            var errorMessage = LanguageResource.resMsg_Error + LanguageResource.resMsg_FailedToLoadWorkOrderInformation;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    errorMessage = LanguageResource.resMsg_Error + errorMsg.Message;
            }
            ShowErrorMessage(errorMessage);
        }
    });
}

function LoadEquipmentInfo() {
    workOrderViewModal.TaskGroupNotFoundMessage(false);

    var filter = {};
    filter.WorkOrderID = jQuery.WorkOrderNamespace.WorkOrder;
    jQuery.extend(filter, jQuery.WorkOrderNamespace.BasicParam);

    jQuery.ajax({
        type: "POST",
        url: jQuery.WorkOrderNamespace.ServicePath + "/Vegam_MaintenanceService.asmx/GetWorkOrderEquipmentInfo",
        data: JSON.stringify({ filter: filter }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if (json.d != null && json.d != undefined) {
                workOrderViewModal.EquipmentName(json.d.EquipmentName);
                workOrderViewModal.Description(json.d.Description);
                workOrderViewModal.Location(json.d.Location);
                workOrderViewModal.EquipmentType(json.d.Type);
                workOrderViewModal.EquipmentClass(json.d.Class);
                workOrderViewModal.ModelNumber(json.d.ModelNumber);
                workOrderViewModal.ModelName(json.d.ModelName);
                workOrderViewModal.Manufacturer(json.d.Manufacturer);
                workOrderViewModal.SerialNumber(json.d.SerialNumber);
                workOrderViewModal.WarrentyNo(json.d.WarrentyNo);
                if (json.d.WarretyStatus.length > 0) {                    
                    if (json.d.WarretyStatus == "0")
                        workOrderViewModal.WarrentyStatus(LanguageResource.resMsg_Expired);
                    else if (json.d.WarretyStatus == "1")
                        workOrderViewModal.WarrentyStatus(LanguageResource.resMsg_InWarrenty);
                }
                workOrderViewModal.WarrentyExpiry(json.d.WarrentyExpiryDate);
                workOrderViewModal.PurchaseDate(json.d.PurchaseDate);
                workOrderViewModal.InstalledDate(json.d.InstalledDate);
                workOrderViewModal.EquipmentImagePath(json.d.EquipmentImagePath);

                workOrderViewModal.ManualDocumentsList.removeAll();
                workOrderViewModal.ImagesAndVideosList.removeAll();
                workOrderViewModal.SpecificationDocumentsList.removeAll();

                ko.utils.arrayForEach(json.d.DocumentInfoList, function (docItem) {
                    var docInfo = {};
                    docInfo.DocumentID = docItem.DocumentID;
                    docInfo.DocumentType = String.fromCharCode(docItem.DocumentType);;
                    docInfo.DocumentName = docItem.DocumentName;//split('_', 1)[2].split('.')[0];value.DocumentName.split('.')[0].toString();//split(new [] { '_' }, 3).Last().ToString();
                    docInfo.DocumentDisplayName = docItem.DocumentName.split('.')[0].substring(docItem.DocumentName.lastIndexOf('_') + 1);
                    docInfo.DownloadPath = docItem.DownloadPath;
                    //if (jQuery.DocumnetsAndImagesNamespace.Type != 'M')
                    //    docInfo.IsModelDocument = value.IsModelDocument;
                    //else
                    docInfo.IsModelDocument = false;
                    docInfo.ThumbnailPath = '';
                    docInfo.ShowOnHover = ko.observable(false);

                    if (String.fromCharCode(docItem.DocumentType) == 'I' || String.fromCharCode(docItem.DocumentType) == 'V') {

                        if (String.fromCharCode(docItem.DocumentType) == 'I') {
                            docInfo.ShowOnHover(true);
                            docInfo.ThumbnailPath = docItem.ThumbnailPath;
                        }
                        else if (String.fromCharCode(docItem.DocumentType) == 'V') {
                            docInfo.ThumbnailPath = jQuery.WorkOrderNamespace.ImagePath + 'video.png';
                        }
                        workOrderViewModal.ImagesAndVideosList.push(docInfo);
                    }
                    else if (String.fromCharCode(docItem.DocumentType) == 'D') {
                        var ext = docItem.DocumentName.substring(docItem.DocumentName.lastIndexOf('.') + 1).toLowerCase();
                        if (ext == "png" || ext == "jpeg" || ext == "jpg") {
                            docInfo.ThumbnailPath = docItem.ThumbnailPath;
                        }
                        else {
                            docInfo.ThumbnailPath = jQuery.WorkOrderNamespace.ImagePath + ext + '.png';
                        }
                        workOrderViewModal.ManualDocumentsList.push(docInfo);
                    }
                    else if (String.fromCharCode(docItem.DocumentType) == 'S') {
                        var ext = docItem.DocumentName.substring(docItem.DocumentName.lastIndexOf('.') + 1).toLowerCase();
                        if (ext == "png" || ext == "jpeg" || ext == "jpg") {
                            docInfo.ThumbnailPath = docItem.ThumbnailPath;
                        }
                        else {
                            docInfo.ThumbnailPath = jQuery.WorkOrderNamespace.ImagePath + ext + '.png';
                        }
                        workOrderViewModal.SpecificationDocumentsList.push(docInfo);
                    }
                });                
            }
        },
        beforeSend: function () {
        },
        complete: function () {
        },
        error: function (request, error) {
            var errorMessage = LanguageResource.resMsg_Error + LanguageResource.resMsg_FailedToLoadEquipmentInfo;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    errorMessage = LanguageResource.resMsg_Error + errorMsg.Message;
            }
            ShowErrorMessage(errorMessage);
        }
    });
}

function LoadWorkInstructionInfo() {
    var filter = {};
    filter.WorkOrderID = jQuery.WorkOrderNamespace.WorkOrder;
    jQuery.extend(filter, jQuery.WorkOrderNamespace.BasicParam);

    jQuery.ajax({
        type: "POST",
        url: jQuery.WorkOrderNamespace.ServicePath + "/Vegam_MaintenanceService.asmx/GetWorkOrderTaskInfo",
        data: JSON.stringify({ filter: filter }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if (json.d != null && json.d != undefined) {
                if (json.d.TaskInfoList.length > 0) {
                    BindWorkInstructionsViewModal(json.d);
                    workOrderViewModal.TaskGroupNotFoundMessage(false);
                }
                else {                    
                    workOrderViewModal.TaskGroupNotFoundMessage(true);
                }
            }
        },
        beforeSend: function () {
            workOrderViewModal.ShowLoadProgress(true);
        },
        complete: function () {
            workOrderViewModal.ShowLoadProgress(false);
        },
        error: function (request, error) {
            var errorMessage = LanguageResource.resMsg_Error + LanguageResource.resMsg_FailedToLoadWorkInstructions;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    errorMessage = LanguageResource.resMsg_Error + errorMsg.Message;
            }
            ShowErrorMessage(errorMessage);
        }
    });
}


function StartTask(taskInfo, selectedPPEImageIDList, isSafetyConfirmed) {
    var startTaskInfo = {};
    startTaskInfo.TaskID = taskInfo.TaskID;
    startTaskInfo.WorkOrderID = jQuery.WorkOrderNamespace.WorkOrder;
    startTaskInfo.TaskPPEIDList = selectedPPEImageIDList;
    startTaskInfo.IsSafetyConfirmed = isSafetyConfirmed;
    jQuery.extend(startTaskInfo, jQuery.WorkOrderNamespace.BasicParam);

    jQuery.ajax({
        type: "POST",
        url: jQuery.WorkOrderNamespace.ServicePath + "/Vegam_MaintenanceService.asmx/StartWorkOrderTask",
        data: JSON.stringify({ startTaskInfo: startTaskInfo }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if (json.d.ReturnValue == 1) {                //Task Started Successfully.                
                taskInfo.TaskIsInProgress(true);
                taskInfo.ShowStartTask(false);
                taskInfo.ShowEndTask(true);
                var statusInfo = GetStatusInfo("P", false);
                taskInfo.Status(statusInfo.DisplayName);
                taskInfo.StatusImage(jQuery.WorkOrderNamespace.ImagePath + "/" + statusInfo.ImageName);
                taskInfo.StartedBy(json.d.UserName);
                taskInfo.StartedDateTime(json.d.CurrentDateTime);

                ko.utils.arrayFirst(selectedPPEImageIDList, function (ppeImageID) {
                    ko.utils.arrayFirst(taskInfo.PPEList, function (ppeInfo) {
                        if (ppeImageID == ppeInfo.ImageID) {
                            ppeInfo.IsConfirmed(true);
                            return ppeInfo
                        }
                    });
                });
            }
            else if (json.d.ReturnValue == 0) {
                ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_TaskDoesNotExistsInTaskGroup);
            }
            else if (json.d.ReturnValue = -1) {
                ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_NoPermission);
            }
            else if (json.d.ReturnValue == -2) {
                ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_TaskAlreadyStarted);
            }
            else if (json.d.ReturnValue == -3) {
                ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_TaskGroupIsNotExists );
            }
        },
        beforeSend: function () {
            taskInfo.DisableTaskStartEnd(true);
            taskInfo.ShowTaskStartEndProgress(true);
        },
        complete: function () {
            taskInfo.DisableTaskStartEnd(false);
            taskInfo.ShowTaskStartEndProgress(false);
        },
        error: function (request, error) {
            var errorMessage = LanguageResource.resMsg_Error + LanguageResource.resMsg_FailedToStartTask;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    errorMessage = LanguageResource.resMsg_Error + errorMsg.Message;
            }
            ShowErrorMessage(errorMessage);
        }
    });
}

function EndTask(taskInfo) {
    taskInfo.RemarksMissing(false);
    ko.utils.arrayForEach(taskInfo.ParameterList, function (parameterInfo) {
        parameterInfo.ValueMissing(false);
    });

    var endTaskInfo = {};
    endTaskInfo.TaskID = taskInfo.TaskID;
    endTaskInfo.WorkOrderID = jQuery.WorkOrderNamespace.WorkOrder;
    jQuery.extend(endTaskInfo, jQuery.WorkOrderNamespace.BasicParam);

    jQuery.ajax({
        type: "POST",
        url: jQuery.WorkOrderNamespace.ServicePath + "/Vegam_MaintenanceService.asmx/EndWorkOrderTask",
        data: JSON.stringify({ endTaskInfo: endTaskInfo }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if (json.d.ReturnValue == 1) {
                taskInfo.TaskIsInProgress(false);
                taskInfo.ShowStartTask(false);
                taskInfo.ShowEndTask(false);
                var statusInfo = GetStatusInfo("C", false);
                taskInfo.Status(statusInfo.DisplayName);
                taskInfo.StatusImage(jQuery.WorkOrderNamespace.ImagePath + "/" + statusInfo.ImageName);
                taskInfo.EndedBy(json.d.UserName);
                taskInfo.EndDateTime(json.d.CurrentDateTime);
            }
            else if (json.d.ReturnValue == 0) {
                ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_TaskDoesNotExistsInTaskGroup);
            }
            else if (json.d.ReturnValue == -1){
                ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_NoPermission);
            }
            else if (json.d.ReturnValue == -2) {
                ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_TaskIsAlreadyCompleted);
            }
            else if (json.d.ReturnValue == -3) {
                ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_TaskIsNotStarted);
            }  
            else if (json.d.ReturnValue == -4) {
                taskInfo.RemarksMissing(true);
                ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_RemarksAreMissing);
            } 
            else if (json.d.ReturnValue == -5) {
                ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_ImagesAreMissing);
            } 
            else if (json.d.ReturnValue == -6) {
                ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_ParametersAreMissing);

                ko.utils.arrayForEach(taskInfo.ParameterList, function (parameterInfo) {
                    if (json.d.MissingParameterIDList.indexOf(parameterInfo.ParameterID) > -1)
                        parameterInfo.ValueMissing(true);
                });
            } 
        },
        beforeSend: function () {
            taskInfo.DisableTaskStartEnd(true);
            taskInfo.ShowTaskStartEndProgress(true);
        },
        complete: function () {
            taskInfo.DisableTaskStartEnd(false);
            taskInfo.ShowTaskStartEndProgress(false);
        },
        error: function (request, error) {
            var errorMessage = LanguageResource.resMsg_Error + LanguageResource.resMsg_FaileToEndTask;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    errorMessage = LanguageResource.resMsg_Error + errorMsg.Message;
            }
            ShowErrorMessage(errorMessage);
        }
    });
}

function SaveTaskParameterValue(taskInfo) {
    taskInfo.DisableSaveParameter(true);
    taskInfo.ShowSaveParameterProgress(true);
    taskInfo.RemarksMissing(false);
    ko.utils.arrayForEach(taskInfo.ParameterList, function (parameterInfo) {
        parameterInfo.ValueMissing(false);
    });

    var remarks = '';
    if (taskInfo.RemarkEnabled) {
        remarks = jQuery.trim(taskInfo.Remarks);
    }

    var parameterList = [];
    ko.utils.arrayForEach(taskInfo.ParameterList, function (paramInfo) {
        var selectCodeItem = 0;
        var paramValue = jQuery.trim(paramInfo.Value());     
        if (paramInfo.Type == workOrderViewModal.parameterTypeInfo.Numeric) {
            paramValue = parseInt(paramValue);
        }
        else if (paramInfo.Type == workOrderViewModal.parameterTypeInfo.Numeric) {
            paramValue = parseFloat(paramValue);
        }
        else if (paramInfo.Type == workOrderViewModal.parameterTypeInfo.SelectionCode && paramValue == "0") {
            selectCodeItem = paramValue;
            paramValue = '';
        }

        if (paramValue.length > 0 || paramValue > 0) {
            var parameterInfo = {};
            parameterInfo.ParameterID = paramInfo.ParameterID;
            parameterInfo.ParameterValue = paramValue;
            parameterInfo.SelectCodeItem = selectCodeItem;
            parameterList.push(parameterInfo);
        }
    });

    var taskParameter = {};
    taskParameter.WorkOrderID = jQuery.WorkOrderNamespace.WorkOrder;
    taskParameter.TaskID = taskInfo.TaskID;
    taskParameter.Remarks = remarks;
    taskParameter.ParameterList = [];
    taskParameter.ParameterList = parameterList;
    jQuery.extend(taskParameter, jQuery.WorkOrderNamespace.BasicParam);

    jQuery.ajax({
        type: "POST",
        url: jQuery.WorkOrderNamespace.ServicePath + "/Vegam_MaintenanceService.asmx/SaveTaskParameterValue",
        data: JSON.stringify({ taskParameter: taskParameter }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if (json.d == 1) {                
                taskInfo.ParameterSaveMessage(LanguageResource.resMsg_ParameterInfoSavedSuccessfully);
            }           
            else if (json.d == -1) {
                ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_NoPermission);
            }
            else if (json.d == -2) {
                ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_TaskIsAlreadyCompleted);
            }
            else if (json.d == -3) {
                ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_TaskIsNotStarted);
            }
        },       
        complete: function () {
            taskInfo.DisableSaveParameter(false);
            taskInfo.ShowSaveParameterProgress(false);
        },
        error: function (request, error) {
            var errorMessage = LanguageResource.resMsg_Error + LanguageResource.resMsg_FailedToSaveParameterInfo;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    errorMessage = LanguageResource.resMsg_Error + errorMsg.Message;
            }
            ShowErrorMessage(errorMessage);
        }
    });
}

function TaskImageUpload(fileUploadCtl) {
    var errorMessage = ''; var isValid = false; var ext = '';
    var capturedImage = jQuery(fileUploadCtl).val();
    if (capturedImage != 'undefined' && capturedImage.length > 0) {
        //errorMessage = LanguageResource.resMsg_FailedToUploadImage;
        ext = capturedImage.substring(capturedImage.lastIndexOf('.') + 1).toLowerCase();
        if ((ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg")) {
            isValid = true;
        }
        else {
            errorMessage = LanguageResource.resMsg_InvalidFileFormat;
        }

        if (!isValid) {
            ShowErrorMessage(errorMessage);
            jQuery(fileUploadCtl).val('');
            return;
        }

        var currentDate = new Date();
        var currentDateAndTime = currentDate.format("yyyyMMddhhmmss");
        var fileName = "Img_" + currentDateAndTime + "." + ext;
        var urlString = jQuery.WorkOrderNamespace.UploaderPath + '?uid=' + jQuery.WorkOrderNamespace.BasicParam.UserID + '&sid=' + jQuery.WorkOrderNamespace.BasicParam.SiteID + '&workorder=' + jQuery.WorkOrderNamespace.WorkOrder + '&fileName=' + fileName + '&workordertaskimage=true';

        var taskID = jQuery(fileUploadCtl).attr("taskID");
        var fileUploadCtlID = "fleTaskImageUpload" + taskID;

        jQuery.ajaxFileUpload({
            type: "POST",
            url: urlString,
            fileElementId: fileUploadCtlID,
            success: function (data, status) {
                jQuery(fileUploadCtl).val('');
                if (data.documentElement.innerText != "true") {
                    ShowErrorMessage(LanguageResource.resMsg_FailedToUploadImage);
                }
                else {
                    InsertWorkOrderTaskImage(taskID, fileName);
                }
            },
            beforeSend: function () {
                workOrderViewModal.ShowImageUploadProgress(true);
            },
            error: function (request, error) {
                workOrderViewModal.ShowImageUploadProgress(false);
                jQuery(fileUploadCtl).val('');
                var errorMessage = LanguageResource.resMsg_Error + LanguageResource.resMsg_FailedToUploadImage;
                if (request.responseText != "") {
                    var errorMsg = jQuery.parseJSON(request.responseText);
                    if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                        errorMessage = languageResource.resMsg_Error + errorMsg.Message;
                }
                ShowErrorMessage(errorMessage);
            }
        });
    }
}

function InsertWorkOrderTaskImage(taskID, fileName) {
    var imageUploadInfo = {};
    imageUploadInfo.TaskID = taskID;
    imageUploadInfo.WorkOrderID = jQuery.WorkOrderNamespace.WorkOrder;
    imageUploadInfo.ImageName = fileName;
    jQuery.extend(imageUploadInfo, jQuery.WorkOrderNamespace.BasicParam);

    jQuery.ajax({
        type: "POST",
        url: jQuery.WorkOrderNamespace.ServicePath + "/Vegam_MaintenanceService.asmx/InsertWorkOrderTaskImage",
        data: JSON.stringify({ imageUploadInfo: imageUploadInfo }),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data.d !== null) {
                if (data.d.ImageID == -1) {
                    ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_NoPermission);
                }
                else if (data.d.ImageID == -2) {
                    ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_TaskIsAlreadyCompleted);
                }
                else if (data.d.ImageID == -3) {
                    ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_TaskIsNotStarted);
                }          
                else {                                        
                    var taskItemInfo = ko.utils.arrayFirst(workOrderViewModal.taskInfoList(), function (taskItem) {
                        if (taskItem.TaskID == taskID)
                            return taskItem;
                    });

                    if (taskItemInfo != undefined && taskItemInfo != null) {
                        var imageInfo = {};
                        imageInfo.ImageID = data.d.ImageID;
                        imageInfo.ImagePath = data.d.ImagePath;
                        imageInfo.ThubmnailPath = data.d.ThubmnailPath;                        
                        taskItemInfo.ImageList.push(imageInfo);
                    }
                }
            } else {
                ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_FailedToUploadImage);
            }
        },
        complete: function () {
            workOrderViewModal.ShowImageUploadProgress(false);
        },
        error: function (request, error) {
            var errorMessage = LanguageResource.resMsg_FailedToUploadImage;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                    errorMessage = errorMsg.Message;
            }
            ShowErrorMessage(LanguageResource.resMsg_Error + errorMessage);
        }
    });
}

function ShowStartTaskModal(taskInfo) {    
    startTaskViewModal.TaskID = taskInfo.TaskID;
    startTaskViewModal.SafetyInstruction(taskInfo.SafetyDescription);
    startTaskViewModal.IsSafetyConfirmed(false);
    startTaskViewModal.IsPPEConfirmed(false);
    startTaskViewModal.StartTaskConfirmError('');
    startTaskViewModal.PPEList.removeAll();

    if (taskInfo.SafetyDescription.length > 0)
        startTaskViewModal.ShowSafetyInstruction(true);
    else
        startTaskViewModal.ShowSafetyInstruction(false);

    if (taskInfo.PPEList.length > 0)
        startTaskViewModal.ShowPPEInfo(true);
    else
        startTaskViewModal.ShowPPEInfo(false);

    ko.utils.arrayForEach(taskInfo.PPEList, function (ppeItemInfo) {
        var ppeInfo = {};
        ppeInfo.ImageID = ppeItemInfo.ImageID;
        ppeInfo.IsConfirmed = ko.observable(false);
        ppeInfo.Description = ppeItemInfo.Description;
        ppeInfo.ImagePath = ppeItemInfo.ImagePath;        
        startTaskViewModal.PPEList.push(ppeInfo);
    });

    if (startTaskViewModal.ShowSafetyInstruction() || startTaskViewModal.ShowPPEInfo()) {
        jQuery("#divStartTaskModal").modal("show");

        jQuery("#btnStartTaskConfirm").unbind('click');
        jQuery("#btnStartTaskConfirm").bind("click", function () {
            if (startTaskViewModal.ShowSafetyInstruction() && startTaskViewModal.ShowPPEInfo()
                && !startTaskViewModal.IsSafetyConfirmed() && !startTaskViewModal.IsPPEConfirmed()) {
                startTaskViewModal.StartTaskConfirmError(LanguageResource.resMsg_PleaseConfirmSafetyInsturctionAndPPE);
            }
            else if (startTaskViewModal.ShowSafetyInstruction() && !startTaskViewModal.IsSafetyConfirmed()) {
                startTaskViewModal.StartTaskConfirmError(LanguageResource.resMsg_PleaseConfirmSafetyInfo);
            }
            else if (startTaskViewModal.ShowPPEInfo() && !startTaskViewModal.IsPPEConfirmed()) {
                startTaskViewModal.StartTaskConfirmError(LanguageResource.resMsg_PleaseConfirmPPEInfo);
            }
            else {                
                var selectedPPEImageIDList = [];
                ko.utils.arrayForEach(startTaskViewModal.PPEList(), function (selectedPPEInfo) {
                    if (selectedPPEInfo.IsConfirmed())
                        selectedPPEImageIDList.push(selectedPPEInfo.ImageID);                    
                });              

                StartTask(taskInfo, selectedPPEImageIDList, startTaskViewModal.IsSafetyConfirmed());
                jQuery("#divStartTaskModal").modal("hide");
            }
            return false;
        });
    }
    else {
        StartTask(taskInfo, [], false);
    }        
}

function GetEnumTypeInfo(enumType) {
    var basicParam = {};
    jQuery.extend(basicParam, jQuery.WorkOrderNamespace.BasicParam);

    jQuery.ajax({
        type: "POST",
        url: jQuery.WorkOrderNamespace.ServicePath + "/Vegam_MaintenanceService.asmx/GetEnumInfoList",
        data: JSON.stringify({ basicParam: basicParam, EnumType: enumType }),
        dataType: 'json',
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data.d !== null) {
                ko.utils.arrayForEach(data.d, function (statusInfo) {
                    if (enumType =="MAINT_WORKORDERSTATUS")
                        jQuery.WorkOrderNamespace.WorkOrderStatusInfo[statusInfo.TypeValue] = statusInfo;
                    else
                        jQuery.WorkOrderNamespace.WorkOrderTaskStatusInfo[statusInfo.TypeValue] = statusInfo;
                });
            } else {
                ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_FailedToLoadStatusInfo);
            }
        },
        error: function (request, error) {
            var errorMessage = LanguageResource.resMsg_FailedToLoadStatusInfo;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg !== undefined && errorMsg !== null && errorMsg.Message !== undefined && errorMsg.Message !== null)
                    errorMessage = errorMsg.Message;
            }
            ShowErrorMessage(LanguageResource.resMsg_Error + errorMessage);
        }
    });
}


function BindWorkInstructionsViewModal(result) {
    workOrderViewModal.taskInfoList.removeAll();    

    if (!result.IsScheduledForToday) {
        workOrderViewModal.HasTaskAccess(false);
        workOrderViewModal.HasEditAccess(false);
    }

    jQuery.each(result.TaskInfoList, function (index, item) {
        var taskInfo = {};
        taskInfo.TaskID = item.TaskID;
        taskInfo.TaskName = item.TaskName;
        taskInfo.Description = item.Description;
        taskInfo.IsSafetyConfirmed = item.IsSafetyConfirmed;
        taskInfo.SafetyDescription = item.SafetyDescription;
        taskInfo.EstimatedTime = item.EstimatedTime;
        taskInfo.RemarkEnabled = item.RemarkEnabled;
        taskInfo.IsRemarkMandatory = item.IsRemarkMandatory;
        taskInfo.Remarks = item.Remarks;
        taskInfo.PictureEnabled = item.PictureEnabled;
        taskInfo.IsPictureMandatory = item.IsPictureMandatory;
        taskInfo.StartedBy = ko.observable(item.StartedBy);
        taskInfo.StartedDateTime = ko.observable(item.StartedDateTime);
        taskInfo.EndedBy = ko.observable(item.EndedBy);
        taskInfo.EndDateTime = ko.observable(item.EndDateTime);

        taskInfo.PPEList = [];
        taskInfo.ToolsList = [];
        taskInfo.DocumentInfoList = [];
        taskInfo.ImageList = ko.observableArray([]);
        taskInfo.ParameterList = ko.observableArray([]);

        jQuery.each(item.ImageList, function (imageIndex, imageItem) {
            var imageInfo = {};
            imageInfo.ImageID = imageItem.ImageID;
            imageInfo.ImagePath = imageItem.ImagePath;
            imageInfo.ThubmnailPath = imageItem.ThubmnailPath;
            taskInfo.ImageList.push(imageInfo);
        });

        var parameterList = [];
        jQuery.each(item.ParameterList, function (parameterIndex, parameterItem) {
            var parameterInfo = {};
            parameterInfo.ParameterID = parameterItem.ParameterID;
            parameterInfo.ParameterName = parameterItem.ParameterName;
            parameterInfo.Type = parameterItem.Type;
            parameterInfo.Value = ko.observable(parameterItem.Value);
            parameterInfo.IsMandatory = parameterItem.IsMandatory;
            parameterInfo.TemplateName = GetParameterTemplateName(parameterItem.Type);
            parameterInfo.ValueMissing = ko.observable(false);
            parameterInfo.SelectionCodeItemList = [];

            if (parameterItem.Type == workOrderViewModal.parameterTypeInfo.SelectionCode) {
                var selGroupInfo = ko.utils.arrayFirst(result.SeletionGroupInfoList, function (selectionGroupInfo, selIndex) {
                    if (parameterItem.SelectionGroupID == selectionGroupInfo.SelectionGroupID)
                        return selectionGroupInfo;
                });

                if (selGroupInfo != null) {
                    parameterInfo.SelectionCodeItemList = selGroupInfo.KeyValueInfoList;
                    var selectInfo = {};
                    selectInfo.Key = LanguageResource.resMsg_Select;
                    selectInfo.Value = 0;
                    parameterInfo.SelectionCodeItemList.splice(0, 0, selectInfo);

                    if (parameterInfo.Value().length > 0) {
                        var selItem = ko.utils.arrayFirst(selGroupInfo.KeyValueInfoList, function (selItem, selItemIndex) {
                            if (selItem.Value == parameterInfo.Value)
                                return selItem;
                        });

                        if (selItem == null) {
                            var selectInfo = {};
                            selectInfo.Key = parameterItem.ValueDisplayName;
                            selectInfo.Value = parameterItem.Value;
                            parameterInfo.SelectionCodeItemList.push(selectInfo);
                        }
                    }
                }
            }

            parameterList.push(parameterInfo);
        });

        var PPEList = [];
        jQuery.each(item.PPEList, function (ppeIndex, PPEItem) {
            var ppeInfo = {};
            ppeInfo.ImageID = PPEItem.ImageID;
            ppeInfo.Description = PPEItem.Description;
            ppeInfo.ImagePath = PPEItem.ImagePath;
            ppeInfo.IsConfirmed = ko.observable(PPEItem.IsConfirmed);
            PPEList.push(ppeInfo);
        });

        var documentInfoList = [];
        jQuery.each(item.DocumentInfoList, function (dIndex, documentItem) {
            if (documentItem.DocumentType != jQuery.WorkOrderNamespace.DocumentType.IMAGE) {//Not Equal to image                
                var ext = documentItem.DocumentName.substring(documentItem.DocumentName.lastIndexOf('.') + 1).toLowerCase();
                documentItem.ThumbnailPath = jQuery.WorkOrderNamespace.ImagePath + '/' + ext + '.png';
            }
            documentItem.ShowDownloadProgress = ko.observable(false);
            documentInfoList.push(documentItem);
        });

        taskInfo.PPEList = PPEList;
        taskInfo.ToolsList = item.ToolsList;
        taskInfo.ParameterList = parameterList;
        taskInfo.DocumentInfoList = documentInfoList;

        var statusInfo = GetStatusInfo(item.Status, false);
        taskInfo.Status = ko.observable(statusInfo.DisplayName);
        taskInfo.StatusImage = ko.observable(jQuery.WorkOrderNamespace.ImagePath + "/" + statusInfo.ImageName);

        taskInfo.ShowStartTask = ko.observable(false);
        taskInfo.ShowEndTask = ko.observable(false);
        taskInfo.TaskIsInProgress = ko.observable(false);
        
        if (item.Status == "P") {
            taskInfo.ShowEndTask = ko.observable(true);
            taskInfo.TaskIsInProgress = ko.observable(true);
        }
        else if (item.Status == "N") {
            taskInfo.ShowStartTask = ko.observable(true);
        }        

        taskInfo.ShowTaskStartEndProgress = ko.observable(false);
        taskInfo.DisableTaskStartEnd = ko.observable(false);
        taskInfo.DisableSaveParameter = ko.observable(false);
        taskInfo.ShowSaveParameterProgress = ko.observable(false);
        taskInfo.ParameterSaveMessage = ko.observable('');
        taskInfo.RemarksMissing = ko.observable(false);        

        workOrderViewModal.taskInfoList.push(taskInfo);
    });

    jQuery('[data-toggle="popover"]').popover();
    jQuery('#popoverData').popover();
    jQuery('.pover').popover({ trigger: "hover" });
}

function DownloadDocumentOrImageOrVideoInfo(item) {
    if (item.DownloadPath.length > 0 && item.DocumentName.length > 0) {
        var fileName = item.DocumentName;
        var filePath = item.DownloadPath;
        window.location = jQuery.WorkOrderNamespace.BasePath + "/HandlerFiles/DownloadHandler.ashx?MaintenanceDocsName=" + fileName + "&MaintenanceDocsPath=" + filePath;
    }
    else {
        var errorMessage = '';
        if (item.DocumentType == 'I' || item.DocumentType == 'V') {
            errorMessage = LanguageResource.resMsg_Error + LanguageResource.resMsg_FailedToDownloadMultimediaFile;
        }
        else if (item.DocumentType == 'D') {
            errorMessage = LanguageResource.resMsg_Error + LanguageResource.resMsg_FailedToDownloadDocument;
        }
        ShowMessage(errorMessage);
    }
}

function DownloadImage(imagePath) {
    var startIndex = imagePath.lastIndexOf("/");
    var lastIndex = imagePath.length;
    var fileName = imagePath.substring(startIndex + 1, lastIndex);
   
    window.location = jQuery.WorkOrderNamespace.BasePath + "/HandlerFiles/DownloadHandler.ashx?MaintenanceDocsName=" + fileName + "&MaintenanceDocsPath=" + imagePath;
}

function LoadWorkOrderInfo(lnkID) {
    if (lnkID == "lnkGeneral") {
        jQuery("#lnkGeneral").addClass("active");
        jQuery("#lnkWorkEquipments").removeClass("active");
        jQuery("#lnkEquipment").removeClass("active");

        jQuery("#divEquipmentInfo").addClass("hide");
        jQuery("#divWorkInstruction").addClass("hide");
        jQuery("#divGeneralInfo").removeClass("hide");        

        LoadWorkOrderGeneralInfo();
    }
    else if (lnkID == "lnkWorkInstructions") {
        jQuery("#lnkWorkEquipments").addClass("active");
        jQuery("#lnkGeneral").removeClass("active");
        jQuery("#lnkEquipment").removeClass("active");

        jQuery("#divEquipmentInfo").addClass("hide");
        jQuery("#divGeneralInfo").addClass("hide");
        jQuery("#divWorkInstruction").removeClass("hide");

        LoadWorkInstructionInfo();
    }
    else if (lnkID == "lnkEquipment") {
        jQuery("#lnkEquipment").addClass("active");
        jQuery("#lnkGeneral").removeClass("active");
        jQuery("#lnkWorkEquipments").removeClass("active");

        jQuery("#divGeneralInfo").addClass("hide");
        jQuery("#divWorkInstruction").addClass("hide");
        jQuery("#divEquipmentInfo").removeClass("hide");  

        LoadEquipmentInfo();
    }
}

function GetStatusInfo(statusValue, isHeader) {
    var statusInfo;
    if (isHeader)
        statusInfo = jQuery.WorkOrderNamespace.WorkOrderStatusInfo[statusValue];
    else
        statusInfo = jQuery.WorkOrderNamespace.WorkOrderTaskStatusInfo[statusValue];

    if (statusInfo == undefined) {
        statusInfo = {};
        statusInfo.DisplayName = '';
        statusInfo.ImageName = '';
    }
    return statusInfo;
}

function ShowErrorMessage(message) {
    jQuery("#errorMessageText").html(message).removeClass('blue').addClass("red");
    jQuery("#divErrorModal").dialog({
        zIndex: 999999,
        buttons: [
            {
                text: LanguageResource.resMsg_Ok,
                click: function () {
                    jQuery("#divErrorModal").dialog("close");
                }
            }
        ]
    });
}

function ShowHideDetails(ctlInfo, divAttribute) {
    var contentDiv;    
    if (divAttribute == "taskdiv") {        
        var parentFieldSet = jQuery(ctlInfo).parent("fieldset");
        contentDiv = jQuery(parentFieldSet).next("div");
    }    
    else {
        var parentFieldSet = jQuery(ctlInfo).parents("[contentdiv=taskdiv]");
        contentDiv = jQuery(parentFieldSet).find("[contentdiv='" + divAttribute + "']");
    }  

    if (jQuery(ctlInfo).hasClass("fa-minus-circle")) {
        jQuery(ctlInfo).removeClass("fa-minus-circle");
        jQuery(ctlInfo).addClass("fa-plus-circle");
        jQuery(contentDiv).addClass("hide");
    }
    else {
        jQuery(ctlInfo).removeClass("fa-plus-circle");
        jQuery(ctlInfo).addClass("fa-minus-circle");
        jQuery(contentDiv).removeClass("hide");
    }
}

function GetParameterTemplateName(parameterType) {
    var templateName = '';
    if (parameterType == workOrderViewModal.parameterTypeInfo.MultiLineText) {
        templateName = "multilineParameter-template";
    }
    else if (parameterType == workOrderViewModal.parameterTypeInfo.SelectionCode) {
        templateName = "selection-template";
    }
    else {
        templateName = "singleParameter-template";
    }
    return templateName;
}

function ConfirmSafetyInstruction() {
    startTaskViewModal.IsSafetyConfirmed(true);    
}

function ConfirmPPE() {
    startTaskViewModal.IsPPEConfirmed(true);
}

function TestUpload() {
    var tes = '';
    var test1 = jQuery("#fleTaskImageUpload").val();
    jQuery("#fleTaskImageUpload").val('');
    test1 = jQuery("#fleTaskImageUpload").val();
}