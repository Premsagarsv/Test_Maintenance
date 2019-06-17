﻿jQuery.WorkGroupNameSpace = jQuery.WorkGroupNameSpace || {};
jQuery.WorkGroupNameSpace.BasicParam = jQuery.WorkGroupNameSpace.BasicParam || {};
jQuery.WorkGroupNameSpace.PagerData = jQuery.WorkGroupNameSpace.PagerData || {};
jQuery.WorkGroupNameSpace.MasterDataType = { "WorkGroup": "WORKGROUP" };
jQuery.WorkGroupNameSpace.WorkGroupUserType = { "Assignee": "A", "Report": "R" };
jQuery.WorkGroupNameSpace.BasePath = "";

var workGroupViewModel = {
    MasterDataInfoList: ko.observableArray([]),
    HasEditAccess: false,
    HasDeleteAccess: false,
    WorkGroupAssigneeList: ko.observableArray([]),
    WorkGroupReporterList: ko.observableArray([]),
    addNewAssigneeRow: function () {
        workGroupViewModel.WorkGroupAssigneeList.push(AddNewAssigneeRow());
    },
    addNewReportRow: function () {
        workGroupViewModel.WorkGroupReporterList.push(AddNewReportToRow());
    },
    UserName: ko.observable(''),
    CheckImagePath: ko.observable(''),
    UnCheckImagePath: ko.observable(''),
    MasterDataID: ko.observable(0),
    Description: ko.observable(''),
    MasterDataName: ko.observable(''),
    IsScheduleNotification: ko.observable(false),
    IsOnWork: ko.observable(false),
    IsOnComplete: ko.observable(false),
    IsOnReport: ko.observable(false),
    IsOnDowntime: ko.observable(false),
    ShowCheck: ko.observable(false),
    PagerContent: ko.observable(''),
    LoadErrorMessageVisible: ko.observable(false),
    LoadErrorMessage: ko.observable(''),
    LoadErrorMessageClass: ko.observable('')

};

function LoadWorkGroupInfo(pagerData, basePath, imagePath) {
    jQuery.WorkGroupNameSpace.PagerData = pagerData;
    jQuery.WorkGroupNameSpace.BasePath = basePath;
    jQuery.WorkGroupNameSpace.BasicParam.SiteID = pagerData.SiteID;
    jQuery.WorkGroupNameSpace.BasicParam.UserID = pagerData.UserID;
    jQuery.WorkGroupNameSpace.ImagePath = imagePath;

    if (jQuery.WorkGroupNameSpace.PagerData.PageAccessRights.toUpperCase() == "FULL_ACCESS" || jQuery.WorkGroupNameSpace.PagerData.PageAccessRights.toUpperCase() == "EDIT_ONLY") {
        workGroupViewModel.HasEditAccess = true;
        if (jQuery.WorkGroupNameSpace.PagerData.PageAccessRights.toUpperCase() == "FULL_ACCESS") {
            workGroupViewModel.HasDeleteAccess = true;
        }
    }

    ko.applyBindings(workGroupViewModel, document.getElementById("divWorkGroup"));
    jQuery(" .ui-autocomplete-input").autogrow();
    workGroupViewModel.CheckImagePath(imagePath + '/defaultUnderHeatIcon_Blue.png');
    workGroupViewModel.UnCheckImagePath(imagePath + '/defaultUnderHeatIcon.png');
    workGroupViewModel.WorkGroupAssigneeList.push(AddNewAssigneeRow());
    workGroupViewModel.WorkGroupReporterList.push(AddNewReportToRow());

    jQuery("#btnSaveWorkGroup").html(languageResource.resMsg_SaveandAddMore);
    if (workGroupViewModel.HasEditAccess && !workGroupViewModel.HasDeleteAccess)
        jQuery("#btnSaveWorkGroup").addClass('disabled');
    LoadWorkGroupList(jQuery.WorkGroupNameSpace.PagerData);

}

function BindIconAttributes(hasAccess) {
    var iconAttributes = {};
    if (!hasAccess) {
        iconAttributes.disabled = "disabled";
    }
    return iconAttributes;
}

var value;
function LoadWorkGroupList(pagerData) {

    var masterDataFilterInfo = {};
    masterDataFilterInfo.MasterDataType = jQuery.WorkGroupNameSpace.MasterDataType.WorkGroup;

    if (jQuery.trim(jQuery("#txtSearchWorkGroupName").val()) != "") {
        masterDataFilterInfo.SearchString = jQuery.trim(jQuery("#txtSearchWorkGroupName").val());
    }
    if (jQuery("#hdnSortbyNameValue").val() != "") {
        masterDataFilterInfo.SortType = jQuery("#hdnSortbyNameValue").val();
    }
    masterDataFilterInfo.PageSize = pagerData.PageSize;
    masterDataFilterInfo.PageIndex = pagerData.PageIndex;

    //Dynamic pagerdata
    var totPageHeight = jQuery(window.parent.document).height();
    var workGroupPos = jQuery("#divWorkGroupList").offset().top;
    workGroupMaxHeight = totPageHeight - workGroupPos;
    if (jQuery(window).width() < 768)
        workGroupMaxHeight = 500;
    if (true) {
        value = value || Math.floor(workGroupMaxHeight / 75);
        masterDataFilterInfo.PageSize = value;
        pagerData.PageSize = value;
    }

    jQuery.ajax({
        type: "POST",
        url: jQuery.WorkGroupNameSpace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetMaintMasterDataWithPager",
        data: JSON.stringify({ pagerData:pagerData,basicParam: jQuery.WorkGroupNameSpace.BasicParam, masterDataFilterInfo: masterDataFilterInfo }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (json) {
            jQuery("#divLoadProgressVisible").addClass("hide");
            if (json != undefined && json.d != null) {
                if (json.d.MasterDataInfoList.length > 0) {
                    var workGroupList = json.d.MasterDataInfoList;
                    ko.utils.arrayForEach(workGroupList, function (item, index) {
                        item.IsSelected = ko.observable(false);
                        if (item.MasterDataID==workGroupViewModel.MasterDataID()){
                            item.IsSelected = ko.observable(true)
                        }
                    });
                    workGroupViewModel.PagerContent(json.d.HTMLPager);
                    workGroupViewModel.MasterDataInfoList(workGroupList);
                }
            }
            else {
                var errorMsg = languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadWorkGroup;
                ShowErrorMessage(errorMsg, true);
            }
        },
        beforeSend: function () {
            jQuery("#divLoadProgressVisible").removeClass("hide");
            workGroupViewModel.MasterDataInfoList.removeAll();
            workGroupViewModel.PagerContent('');

        },
        complete: function () {
        },
        error: function (request, error) {
            jQuery("#divLoadProgressVisible").addClass("hide");
            var msg;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    msg = languageResource.resMsg_Error + errorMsg.Message;
                else
                    msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadWorkGroup;
            }
            else {
                msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadWorkGroup;
            }
            ShowErrorMessage(msg, true);
        }
    });
}

function LoadUserNameForAutoComplete(controlID) {
    var txtBoxID = controlID.id;
    var arrTxtBox = txtBoxID.split('_');
    var currentIndex = arrTxtBox[1];
    var searchInfo = {};
    searchInfo.DisplayCount = 10;
    searchInfo.SiteID = jQuery.WorkGroupNameSpace.BasicParam.SiteID;
    jQuery("#" + controlID.id).autocomplete({
      //  autoSelect: true,
        autoFocus: true,
        source: function (request, response) {
            searchInfo.SearchString = jQuery.trim(jQuery("#" + controlID.id).val());
            var selectedUsers = [];
            jQuery.ajax({
                type: "POST",
                url: jQuery.WorkGroupNameSpace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetUserNameForAutoComplete",
                data: JSON.stringify({ searchInfo: searchInfo }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (json) {
                    if (json != undefined && json.d != undefined) {
                        if (json.d.length > 0) {
                            response(jQuery.map(json.d, function (item) {
                                return {
                                    userID: item.UserID,
                                    value: jQuery.trim(item.UserName)
                                };
                            }));
                        }
                    }
                },
                error: function (request, error) {
                    var errorMsg = languageResource.resMsg_Error + languageResource.resMsg_FailedToLoadAutoCompleteForUser;
                    ShowErrorMessage(errorMsg, true);
                }
            });
        },
        change: function (event, ui) {
            if (!ui.item) {
                //jQuery(this).val('');
                if (arrTxtBox[0] == 'txtAssigneeUserName') {
                    workGroupViewModel.WorkGroupAssigneeList()[currentIndex].UserID = 0;
                    workGroupViewModel.WorkGroupAssigneeList()[currentIndex].UserName = "";
                }
                else {
                    workGroupViewModel.WorkGroupReporterList()[currentIndex].UserID = 0;
                    workGroupViewModel.WorkGroupReporterList()[currentIndex].UserName = "";
                }
            }
        },
        select: function (event, ui) {
            event.preventDefault();
            jQuery("#" + controlID.id).val(ui.item.value);
            if (arrTxtBox[0] == 'txtAssigneeUserName') {
                workGroupViewModel.WorkGroupAssigneeList()[currentIndex].UserID = ui.item.userID;
                workGroupViewModel.WorkGroupAssigneeList()[currentIndex].UserName = ui.item.value;
            }
            else {
                workGroupViewModel.WorkGroupReporterList()[currentIndex].UserID = ui.item.userID;
                workGroupViewModel.WorkGroupReporterList()[currentIndex].UserName = ui.item.value;
            }
        }
    });
}

function MarkCheckAssigneeBind(currentIndex, controlID) {

    if (jQuery("#AssigneeScheduleNotify_" + currentIndex)[0].id == controlID.id) {
        if (workGroupViewModel.WorkGroupAssigneeList()[currentIndex].IsScheduleNotification() == true)
            workGroupViewModel.WorkGroupAssigneeList()[currentIndex].IsScheduleNotification(false);
        else
            workGroupViewModel.WorkGroupAssigneeList()[currentIndex].IsScheduleNotification(true);
    }

    if (jQuery("#AssigneeOnWork_" + currentIndex)[0].id == controlID.id) {
        if (workGroupViewModel.WorkGroupAssigneeList()[currentIndex].IsOnWork() == true)
            workGroupViewModel.WorkGroupAssigneeList()[currentIndex].IsOnWork(false);
        else
            workGroupViewModel.WorkGroupAssigneeList()[currentIndex].IsOnWork(true);
    }

    if (jQuery("#AssigneeOnComplete_" + currentIndex)[0].id == controlID.id) {
        if (workGroupViewModel.WorkGroupAssigneeList()[currentIndex].IsOnComplete() == true)
            workGroupViewModel.WorkGroupAssigneeList()[currentIndex].IsOnComplete(false);
        else
            workGroupViewModel.WorkGroupAssigneeList()[currentIndex].IsOnComplete(true);
    }

    if (jQuery("#AssigneeOnReport_" + currentIndex)[0].id == controlID.id) {
        if (workGroupViewModel.WorkGroupAssigneeList()[currentIndex].IsOnReport() == true)
            workGroupViewModel.WorkGroupAssigneeList()[currentIndex].IsOnReport(false);
        else
            workGroupViewModel.WorkGroupAssigneeList()[currentIndex].IsOnReport(true);
    }

    if (jQuery("#AssigneeOnDowntime_" + currentIndex)[0].id == controlID.id) {
        if (workGroupViewModel.WorkGroupAssigneeList()[currentIndex].IsOnDowntime() == true)
            workGroupViewModel.WorkGroupAssigneeList()[currentIndex].IsOnDowntime(false);
        else
            workGroupViewModel.WorkGroupAssigneeList()[currentIndex].IsOnDowntime(true);

    }

}

function MarkCheckReportToBind(currentIndex, controlID) {

    if (jQuery("#ReportScheduleNotify_" + currentIndex)[0].id == controlID.id) {
        if (workGroupViewModel.WorkGroupReporterList()[currentIndex].IsScheduleNotification() == true)
            workGroupViewModel.WorkGroupReporterList()[currentIndex].IsScheduleNotification(false);
        else
            workGroupViewModel.WorkGroupReporterList()[currentIndex].IsScheduleNotification(true);
    }

    if (jQuery("#ReportOnWork_" + currentIndex)[0].id == controlID.id) {
        if (workGroupViewModel.WorkGroupReporterList()[currentIndex].IsOnWork() == true)
            workGroupViewModel.WorkGroupReporterList()[currentIndex].IsOnWork(false);
        else
            workGroupViewModel.WorkGroupReporterList()[currentIndex].IsOnWork(true);
    }

    if (jQuery("#ReportOnComplete_" + currentIndex)[0].id == controlID.id) {
        if (workGroupViewModel.WorkGroupReporterList()[currentIndex].IsOnComplete() == true)
            workGroupViewModel.WorkGroupReporterList()[currentIndex].IsOnComplete(false);
        else
            workGroupViewModel.WorkGroupReporterList()[currentIndex].IsOnComplete(true);
    }

    if (jQuery("#ReportOnReport_" + currentIndex)[0].id == controlID.id) {
        if (workGroupViewModel.WorkGroupReporterList()[currentIndex].IsOnReport() == true)
            workGroupViewModel.WorkGroupReporterList()[currentIndex].IsOnReport(false);
        else
            workGroupViewModel.WorkGroupReporterList()[currentIndex].IsOnReport(true);
    }

    if (jQuery("#ReportOnDowntime_" + currentIndex)[0].id == controlID.id) {
        if (workGroupViewModel.WorkGroupReporterList()[currentIndex].IsOnDowntime() == true)
            workGroupViewModel.WorkGroupReporterList()[currentIndex].IsOnDowntime(false);
        else
            workGroupViewModel.WorkGroupReporterList()[currentIndex].IsOnDowntime(true);
    }

}

function SelectedWorkGroupInfo(masterDataID) {
    ko.utils.arrayForEach(workGroupViewModel.MasterDataInfoList(), function (item) {
        item.IsSelected(false);
        if (item.MasterDataID == masterDataID) {
            item.IsSelected(true);
        }
    });
    var workGroupFilterInfo = {};
    workGroupFilterInfo.SiteID = jQuery.WorkGroupNameSpace.BasicParam.SiteID;
    workGroupFilterInfo.UserID = jQuery.WorkGroupNameSpace.BasicParam.UserID;
    workGroupFilterInfo.WorkGroupID = masterDataID;
    workGroupFilterInfo.MasterDataType = jQuery.WorkGroupNameSpace.MasterDataType.WorkGroup;
    jQuery.ajax({
        type: "POST",
        url: jQuery.WorkGroupNameSpace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/GetEditWorkGroupInfo",
        data: JSON.stringify({ workGroupFilterInfo: workGroupFilterInfo }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (json) {
            if (json != undefined && json.d != null) {
                jQuery("#btnSaveWorkGroup").html(languageResource.resMsg_Update);
                if (workGroupViewModel.HasEditAccess)
                    jQuery("#btnSaveWorkGroup").removeClass('disabled');
                BindWorkGroupViewModel(json.d);
            }
            else {
                ShowMessage(languageResource.resMsg_FailedToLoadWorkGroupInfo, "error");
            }
        },
        beforeSend: function () {
            ClearWorkGroupInfo(false);
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
                    msg = languageResource.resMsg_FailedToLoadWorkGroupInfo;
            }
            else {
                msg = languageResource.resMsg_FailedToLoadWorkGroupInfo;
            }
            ShowMessage(msg, "error");
        }
    });

}

function BindWorkGroupViewModel(workGroupInfo) {
    workGroupViewModel.MasterDataID(workGroupInfo.MasterDataID);
    workGroupViewModel.MasterDataName(workGroupInfo.MasterDataName);
    workGroupViewModel.Description(workGroupInfo.Description);
    autoheight('#txtDescription');

    if (workGroupInfo.WorkGroupAssigneeList.length > 0) {
        workGroupViewModel.WorkGroupAssigneeList.removeAll();
        ko.utils.arrayForEach(workGroupInfo.WorkGroupAssigneeList, function (data, rowIndex) {
            var workGroupUserInfo = {};

            if (data.UserName != "")
                workGroupUserInfo.UserName = data.UserName;

            if (data.UserID != 0)
                workGroupUserInfo.UserID = data.UserID;

            if (data.ItemID != 0)
                workGroupUserInfo.ItemID = data.ItemID;

            if (data.WorkGroupUserType != null)
                workGroupUserInfo.WorkGroupUserType = String.fromCharCode(data.WorkGroupUserType);


            if (data.IsScheduleNotification == true)
                workGroupUserInfo.IsScheduleNotification = ko.observable(true);
            else
                workGroupUserInfo.IsScheduleNotification = ko.observable(false);

            if (data.IsOnWork == true)
                workGroupUserInfo.IsOnWork = ko.observable(true);
            else
                workGroupUserInfo.IsOnWork = ko.observable(false);

            if (data.IsOnReport == true)
                workGroupUserInfo.IsOnReport = ko.observable(true);
            else
                workGroupUserInfo.IsOnReport = ko.observable(false);

            if (data.IsOnDowntime == true)
                workGroupUserInfo.IsOnDowntime = ko.observable(true);
            else
                workGroupUserInfo.IsOnDowntime = ko.observable(false);

            if (data.IsOnComplete == true)
                workGroupUserInfo.IsOnComplete = ko.observable(true);
            else
                workGroupUserInfo.IsOnComplete = ko.observable(false);
        
             jQuery('#tbAssignee').removeClass("h-last-child");
             jQuery('#tblAssignee tr th:nth-child(7)').show();
            workGroupViewModel.WorkGroupAssigneeList.push(workGroupUserInfo);
        });
    }

    if (workGroupInfo.WorkGroupReporterList.length > 0) {
        workGroupViewModel.WorkGroupReporterList.removeAll();
        ko.utils.arrayForEach(workGroupInfo.WorkGroupReporterList, function (data) {
            var workGroupUserInfo = {};

            if (data.UserName != "")
                workGroupUserInfo.UserName = data.UserName;

            if (data.UserID != 0)
                workGroupUserInfo.UserID = data.UserID;

            if (data.ItemID != 0)
                workGroupUserInfo.ItemID = data.ItemID;

            if (data.WorkGroupUserType != null)
                workGroupUserInfo.WorkGroupUserType = String.fromCharCode(data.WorkGroupUserType);


            if (data.IsScheduleNotification == true)
                workGroupUserInfo.IsScheduleNotification = ko.observable(true);
            else
                workGroupUserInfo.IsScheduleNotification = ko.observable(false);

            if (data.IsOnWork == true)
                workGroupUserInfo.IsOnWork = ko.observable(true);
            else
                workGroupUserInfo.IsOnWork = ko.observable(false);

            if (data.IsOnReport == true)
                workGroupUserInfo.IsOnReport = ko.observable(true);
            else
                workGroupUserInfo.IsOnReport = ko.observable(false);

            if (data.IsOnDowntime == true)
                workGroupUserInfo.IsOnDowntime = ko.observable(true);
            else
                workGroupUserInfo.IsOnDowntime = ko.observable(false);

            if (data.IsOnComplete == true)
                workGroupUserInfo.IsOnComplete = ko.observable(true);
            else
                workGroupUserInfo.IsOnComplete = ko.observable(false);

            jQuery('#tbReportingTo').removeClass("h-last-child");
            jQuery('#tblReportingTo tr th:nth-child(7)').show();          
            workGroupViewModel.WorkGroupReporterList.push(workGroupUserInfo);
        });
    }
}

function HideShowAssigneeOrReportTo(element, elementBlock) {
    if (jQuery(element).hasClass('fa-plus-circle')) {
        jQuery("#" + elementBlock).removeClass('hide');
        jQuery(element).removeClass('fa-plus-circle');
        jQuery(element).addClass('fa-minus-circle');
        if (elementBlock.toLowerCase() == "divassignee")
            jQuery("#divAddMore").removeClass('hide');
        else if (elementBlock.toLowerCase() == "divreportingto")
            jQuery("#divAddMoreReportingTo").removeClass('hide');
    }
    else {
        jQuery("#" + elementBlock).addClass('hide');
        jQuery(element).removeClass('fa-minus-circle');
        jQuery(element).addClass('fa-plus-circle');
        if (elementBlock.toLowerCase() == "divassignee")
            jQuery("#divAddMore").addClass('hide');
        else if (elementBlock.toLowerCase() == "divreportingto")
            jQuery("#divAddMoreReportingTo").addClass('hide');
    }
}

function AddNewAssigneeRow() {
    var assigneeInfo = {};
    assigneeInfo.UserName = '';
    assigneeInfo.UserID = 0;
    assigneeInfo.ItemID = 0;
    assigneeInfo.WorkGroupUserType = 'A';
    assigneeInfo.IsScheduleNotification = ko.observable(false);
    assigneeInfo.IsOnWork = ko.observable(false);
    assigneeInfo.IsOnComplete = ko.observable(false);
    assigneeInfo.IsOnReport = ko.observable(false);
    assigneeInfo.IsOnDowntime = ko.observable(false);
    var totalRowCount = jQuery('#tbAssignee tr').length;
    if (totalRowCount == 0) {
        jQuery('#tbAssignee').addClass("h-last-child");//to hide delete column
        jQuery('#tblAssignee tr th:nth-child(7)').hide();
    }
    else {
        jQuery('#tbAssignee').removeClass("h-last-child");
        jQuery('#tblAssignee tr th:nth-child(7)').show();
    }
    return assigneeInfo;
}

function AddNewReportToRow() {
    var reportToInfo = {};
    reportToInfo.UserName = '';
    reportToInfo.UserID = 0;
    reportToInfo.ItemID = 0;
    reportToInfo.WorkGroupUserType = 'R';
    reportToInfo.IsScheduleNotification = ko.observable(false);
    reportToInfo.IsOnWork = ko.observable(false);
    reportToInfo.IsOnComplete = ko.observable(false);
    reportToInfo.IsOnReport = ko.observable(false);
    reportToInfo.IsOnDowntime = ko.observable(false);
    var totalRowCount = jQuery('#tbReportingTo tr').length;
    if (totalRowCount == 0) {
        jQuery('#tbReportingTo').addClass("h-last-child");//to hide delete column
        jQuery('#tblReportingTo tr th:nth-child(7)').hide();
    }
    else {
        jQuery('#tbReportingTo').removeClass("h-last-child");
        jQuery('#tblReportingTo tr th:nth-child(7)').show();
    }
    return reportToInfo;
}

function SortByWorkGroupName(thValue, value) {
    var thClass = "";
    var hasSortUpClassExist = jQuery("#" + thValue + " i").hasClass('fa fa-long-arrow-up');
    var hasSortDownExist = jQuery("#" + thValue + " i").hasClass('fa fa-long-arrow-down');

    if (hasSortUpClassExist == false && hasSortDownExist == false) {
        jQuery(".fa-long-arrow-down").removeClass('fa fa-long-arrow-down');
        jQuery(".fa-long-arrow-up").removeClass('fa fa-long-arrow-up');

        jQuery("#" + thValue + " i").addClass('fa fa-long-arrow-up');
        thClass = value + "_asc";
        jQuery("#hdnSortbyNameValue").val(thClass);
        LoadWorkGroupList(jQuery.WorkGroupNameSpace.PagerData);

        return false;
    }
    if (jQuery("#" + thValue + " i").hasClass('fa fa-long-arrow-up')) {
        jQuery(".fa-long-arrow-down").removeClass('fa fa-long-arrow-down');
        jQuery(".fa-long-arrow-up").removeClass('fa fa-long-arrow-up');

        jQuery("#" + thValue + " i").addClass('fa fa-long-arrow-down');
        thClass = value + "_desc";
        jQuery("#hdnSortbyNameValue").val(thClass);
        LoadWorkGroupList(jQuery.WorkGroupNameSpace.PagerData);

        return false;
    }
    if (jQuery("#" + thValue + " i").hasClass('fa-long-arrow-down')) {
        jQuery(".fa-long-arrow-down").removeClass('fa fa-long-arrow-down');
        jQuery(".fa-long-arrow-up").removeClass('fa fa-long-arrow-up');

        jQuery("#" + thValue + " i").addClass('fa fa-long-arrow-up');
        thClass = value + "_asc";
        jQuery("#hdnSortbyNameValue").val(thClass);
        LoadWorkGroupList(jQuery.WorkGroupNameSpace.PagerData);

        return false;
    }
}


//Insert or update work group
function InsertUpdateWorkGroupInfo() {
    var isValid = true;
    var errorMessage = "";
    jQuery("input").removeClass('border-red');
    workGroupViewModel.LoadErrorMessageVisible(false);

    var workGroupInfo = {};
    workGroupInfo.MasterDataID = workGroupViewModel.MasterDataID();
    workGroupInfo.MasterDataName = jQuery.trim(workGroupViewModel.MasterDataName());
    workGroupInfo.Description = jQuery.trim(workGroupViewModel.Description());
    workGroupInfo.MasterDataType = jQuery.WorkGroupNameSpace.MasterDataType.WorkGroup;

    workGroupInfo.WorkGroupAssigneeList = [];
    workGroupInfo.WorkGroupReporterList = [];

    if (workGroupInfo.MasterDataName.length == 0) {
        jQuery("#txtWorkGroupName").addClass('border-red');
        errorMessage = errorMessage + languageResource.resMsg_EnterGroupName + "<br/>";;
        isValid = false;
    }

    var addedReportToUser = [];
    var addedAssigneeUser = [];
    var isReportUserNameEmpty = true;
    var isAssigneeUserNameEmpty = true;


    if (workGroupViewModel.WorkGroupAssigneeList().length > 0) {
        ko.utils.arrayForEach(workGroupViewModel.WorkGroupAssigneeList(), function (assigneeData, rowIndex) {
            var workGroupAssigneeUserInfo = {};
            if (jQuery("#txtAssigneeUserName_" + rowIndex).val().length != 0) {
                if (assigneeData.UserID == 0) {
                    jQuery("#txtAssigneeUserName_" + rowIndex).addClass('border-red');
                    errorMessage = errorMessage + languageResource.resMsg_EnterValidUserName + "<br/>";
                    isValid = false;

                }
                else if (jQuery.inArray(assigneeData.UserID, addedAssigneeUser) != -1 && addedAssigneeUser.length != 0) {
                    jQuery("#txtAssigneeUserName_" + rowIndex).addClass('border-red');
                    errorMessage = errorMessage + "" + assigneeData.UserName + languageResource.resMsg_AlreadyAdded + "<br/>";                 
                    isValid = false;

                }
              
                isAssigneeUserNameEmpty = false;
            }
            else if (jQuery("#txtAssigneeUserName_" + rowIndex).val().length == 0 && isValid && isAssigneeUserNameEmpty) {
                isAssigneeUserNameEmpty = true;

            }
            if (isValid && assigneeData.UserID > 0 && !isAssigneeUserNameEmpty) {
                isAssigneeUserNameEmpty = false;
                workGroupAssigneeUserInfo.UserID = assigneeData.UserID;
                workGroupAssigneeUserInfo.IsScheduleNotification = assigneeData.IsScheduleNotification();
                workGroupAssigneeUserInfo.IsOnWork = assigneeData.IsOnWork();
                workGroupAssigneeUserInfo.IsOnComplete = assigneeData.IsOnComplete();
                workGroupAssigneeUserInfo.IsOnReport = assigneeData.IsOnReport();
                workGroupAssigneeUserInfo.IsOnDowntime = assigneeData.IsOnDowntime();
                workGroupAssigneeUserInfo.WorkGroupUserType = jQuery.WorkGroupNameSpace.WorkGroupUserType.Assignee.charCodeAt();
                workGroupInfo.WorkGroupAssigneeList.push(workGroupAssigneeUserInfo);

            }
            addedAssigneeUser.push(assigneeData.UserID);

        });
    }
    else
        isAssigneeUserNameEmpty = true;

    var isValidReportTo = true;
    if (workGroupViewModel.WorkGroupReporterList().length > 0) {
        ko.utils.arrayForEach(workGroupViewModel.WorkGroupReporterList(), function (reportToData, rowIndex) {
            var workGroupReportToUserInfo = {};
            if (jQuery("#txtReportUserName_" + rowIndex).val().length != 0) {
                if (reportToData.UserID == 0) {
                    jQuery("#txtReportUserName_" + rowIndex).addClass('border-red');
                    errorMessage = errorMessage + languageResource.resMsg_EnterValidUserName + "<br/>";
                    isValidReportTo = false;

                }
                else if (jQuery.inArray(reportToData.UserID, addedReportToUser) != -1 && addedReportToUser.length != 0) {
                    jQuery("#txtReportUserName_" + rowIndex).addClass('border-red');
                    errorMessage = errorMessage + "" + reportToData.UserName + languageResource.resMsg_AlreadyAdded + "<br/>";
                    isValidReportTo = false;
                }              
                isReportUserNameEmpty = false;
            }
            else if (jQuery("#txtReportUserName_" + rowIndex).val().length == 0 && isValidReportTo && isReportUserNameEmpty) {
                isReportUserNameEmpty = true;

            }
            if (isValidReportTo && reportToData.UserID != 0 && !isReportUserNameEmpty) {
                isReportUserNameEmpty = false;
                workGroupReportToUserInfo.UserID = reportToData.UserID;
                workGroupReportToUserInfo.IsScheduleNotification = reportToData.IsScheduleNotification();
                workGroupReportToUserInfo.IsOnWork = reportToData.IsOnWork();
                workGroupReportToUserInfo.IsOnComplete = reportToData.IsOnComplete();
                workGroupReportToUserInfo.IsOnReport = reportToData.IsOnReport();
                workGroupReportToUserInfo.IsOnDowntime = reportToData.IsOnDowntime();
                workGroupReportToUserInfo.WorkGroupUserType = jQuery.WorkGroupNameSpace.WorkGroupUserType.Report.charCodeAt();
                workGroupInfo.WorkGroupReporterList.push(workGroupReportToUserInfo);

            }
            addedReportToUser.push(reportToData.UserID);
        });
    }
    else
        isReportUserNameEmpty = true;

    if (isReportUserNameEmpty && isAssigneeUserNameEmpty) {
        jQuery("#txtAssigneeUserName_0").addClass('border-red');
        jQuery("#txtReportUserName_0").addClass('border-red');
        errorMessage = errorMessage + languageResource.resMsg_PleaseEnterAtleastOneUser + "<br/>";
        isValid = false;

    }

    jQuery.each(workGroupViewModel.WorkGroupAssigneeList(), function (rowIndex1, assigneeData) {
        var workGroupAssigneeUserInfo = {};
        jQuery.each(workGroupViewModel.WorkGroupReporterList(), function (rowIndex, reportToData) {
            var workGroupReportToUserInfo = {};
            if (jQuery("#txtAssigneeUserName_" + rowIndex1).val().length != 0 && jQuery("#txtReportUserName_" + rowIndex).val().length != 0 &&
                assigneeData.UserID != 0 && reportToData.UserID != 0 && (assigneeData.UserID == reportToData.UserID)) {
                jQuery("#txtAssigneeUserName_" + rowIndex1).addClass('border-red');
                jQuery("#txtReportUserName_" + rowIndex).addClass('border-red');
                errorMessage = errorMessage + languageResource.resMsg_UserAddedBothAssigneeAndReportTo + "<br/>";
                isValid = false;
            }
        });
    });

    if (isValid == false || isValidReportTo == false) {
        ShowMessage(errorMessage, "error");
        workGroupViewModel.LoadErrorMessageVisible(true);
    }
    else {
        jQuery.ajax({
            type: "POST",
            url: jQuery.WorkGroupNameSpace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/InsertOrUpdateWorkGroupInfo",
            data: JSON.stringify({ basicParam: jQuery.WorkGroupNameSpace.BasicParam, workGroupInfo: workGroupInfo }),
            contentType: "application/json; charset=utf-8",
            datatype: 'json',
            async: false,
            success: function (json) {
                if (json != undefined && json.d != undefined) {
                    var result = json.d;
                    if (result == 1) {//Already exist
                        ShowMessage(languageResource.resMsg_AlreadyExistsWorkGroupName, "error");
                        workGroupViewModel.LoadErrorMessageVisible(true);
                    }
                    else if (result == 2) {//successfully inserted
                        ClearWorkGroupInfo(false);
                        ShowMessage(languageResource.resMsg_SuccessfullyInsertedWorkGroupInfo, "Info");
                        workGroupViewModel.LoadErrorMessageVisible(true);
                        LoadWorkGroupList(jQuery.WorkGroupNameSpace.PagerData);
                        if (workGroupViewModel.MasterDataInfoList().length > 0)
                            workGroupViewModel.MasterDataInfoList()[0].IsSelected(true);
                    }
                    else if (result == 3) {//successfully updated
                        ClearWorkGroupInfo(false);
                        ShowMessage(languageResource.resMsg_SuccessfullyUpdatedWorkGroupInfo, "Info");
                        workGroupViewModel.LoadErrorMessageVisible(true);
                        LoadWorkGroupList(jQuery.WorkGroupNameSpace.PagerData);
                        if (workGroupViewModel.MasterDataInfoList().length > 0)
                            workGroupViewModel.MasterDataInfoList()[0].IsSelected(true);
                    }
                    else if (result == 4) {//already exist in in-active status can not updated
                        ShowMessage(languageResource.resMsg_CanNotUpdatedAlreadyExistInInActiveState, "error");
                        workGroupViewModel.LoadErrorMessageVisible(true);
                    }
                }
                else {
                    ShowMessage(languageResource.resMsg_FailedAddOrUpdateWorkGroupInfo, "error");
                    workGroupViewModel.LoadErrorMessageVisible(true);
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
                        workGroupViewModel.LoadErrorMessageVisible(true);
                    }
                    else {
                        errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedAddOrUpdateWorkGroupInfo;
                        ShowMessage(errorMessage, "error");
                        workGroupViewModel.LoadErrorMessageVisible(true);
                    }
                }
                else {
                    errorMessage = languageResource.resMsg_Error + languageResource.resMsg_FailedAddOrUpdateWorkGroupInfo;
                    ShowMessage(errorMessage, "error");
                    workGroupViewModel.LoadErrorMessageVisible(true);
                }
            }
        });
    }
}

function ClearWorkGroupInfo(isPageLoad) {
    jQuery("input").removeClass('border-red');
    jQuery("select").removeClass('border-red');
    workGroupViewModel.MasterDataID(0);
    workGroupViewModel.LoadErrorMessageVisible(false);
    workGroupViewModel.LoadErrorMessage('');
    workGroupViewModel.LoadErrorMessageClass('');
    workGroupViewModel.MasterDataName('');
    workGroupViewModel.Description('');
    autoheight("#txtDescription");
    workGroupViewModel.WorkGroupAssigneeList.removeAll();
    workGroupViewModel.WorkGroupReporterList.removeAll();
    workGroupViewModel.WorkGroupAssigneeList.push(AddNewAssigneeRow());
    workGroupViewModel.WorkGroupReporterList.push(AddNewReportToRow());
    jQuery("#spnErrorMsg").html('');
    jQuery("#btnSaveWorkGroup").html(languageResource.resMsg_SaveandAddMore);
    if (workGroupViewModel.HasEditAccess && !workGroupViewModel.HasDeleteAccess)
        jQuery("#btnSaveWorkGroup").addClass('disabled');
    if (isPageLoad) {
        ko.utils.arrayForEach(workGroupViewModel.MasterDataInfoList(), function (item) {
            item.IsSelected(false);
        });
    }
}

function DeleteWorkGroupClick(workGroupID) {

    jQuery("#alertMessage").removeClass("text-danger");
    jQuery("#alertMessage").html(languageResource.resMsg_DeleteWorkGroupInfoConfirm);
    jQuery("#confirmModal").dialog({
        zIndex: 1060,        
        modal: true,
        buttons: [
            {
                text: languageResource.resMsg_BtnConfirm,
                click: function () {
                    jQuery("#confirmModal").dialog("close");
                    DeleteWorkGroupInfo(workGroupID);
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

function DeleteWorkGroupInfo(workGroupID) {
    var masterDataInfo = {};
    masterDataInfo.MasterDataID = workGroupID;
    masterDataInfo.MasterDataType = jQuery.WorkGroupNameSpace.MasterDataType.WorkGroup;

    jQuery.ajax({
        type: "POST",
        url: jQuery.WorkGroupNameSpace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/DeleteMasterData",
        data: JSON.stringify({ basicParam: jQuery.WorkGroupNameSpace.BasicParam, masterDataInfo: masterDataInfo }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if (json.d == 1) {
                var msg = languageResource.resMsg_WorkGroupAlreadyLinkedToSchedule;
                ShowErrorMessage(msg, true);
            }
            else if (json.d == 2) {
                LoadWorkGroupList(jQuery.WorkGroupNameSpace.PagerData);
                ClearWorkGroupInfo(false);
            }
            else {
                var msg = languageResource.resMsg_FailedToDeleteWorkGroupInfo;
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
                    msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToDeleteWorkGroupInfo;
            }
            else {
                msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToDeleteWorkGroupInfo;
            }
            ShowErrorMessage(msg, true);
        },
    });
}

function DeleteWorkGroupUserClick(deleteItemData, trRowIndex) {
    if (deleteItemData.ItemID == 0) {
        if (deleteItemData.WorkGroupUserType == jQuery.WorkGroupNameSpace.WorkGroupUserType.Assignee) {
            workGroupViewModel.WorkGroupAssigneeList.remove(deleteItemData);
            var totalRowCount = jQuery('#tbAssignee tr').length;
            if (totalRowCount == 0)
                workGroupViewModel.WorkGroupAssigneeList.push(AddNewAssigneeRow());
        }
        else {           
            workGroupViewModel.WorkGroupReporterList.remove(deleteItemData);
            var totalRowCount = jQuery('#tbReportingTo tr').length;
            if (totalRowCount == 0)
                workGroupViewModel.WorkGroupReporterList.push(AddNewReportToRow());
        }
    }
    else {
        jQuery("#alertMessage").html(languageResource.resMsg_DeleteWorkGroupUserInfoConfirm);
        jQuery("#alertMessage").removeClass('text-danger');
        jQuery("#confirmModal").dialog({
            zIndex: 1060,
            modal: true,
            buttons: [
                {
                    text: languageResource.resMsg_BtnConfirm,
                    click: function () {
                        DeleteWorkGroupUserInfo(deleteItemData);
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
    }
}

function DeleteWorkGroupUserInfo(deleteItemData, userType) {
    if (deleteItemData.ItemID > 0) {
        var workGroupUserFilter = {};
        workGroupUserFilter.SiteID = jQuery.WorkGroupNameSpace.BasicParam.SiteID;
        workGroupUserFilter.UserID = jQuery.WorkGroupNameSpace.BasicParam.UserID;
        workGroupUserFilter.ItemID = deleteItemData.ItemID;
        workGroupUserFilter.WorkGroupID = workGroupViewModel.MasterDataID();

        jQuery.ajax({
            type: "POST",
            url: jQuery.WorkGroupNameSpace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/DeleteWorkGroupUserInfo",
            data: JSON.stringify({ workGroupUserFilter: workGroupUserFilter }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                if (json.d == 2) {
                    if (deleteItemData.WorkGroupUserType == jQuery.WorkGroupNameSpace.WorkGroupUserType.Assignee) {
                        workGroupViewModel.WorkGroupAssigneeList.remove(deleteItemData);
                        var totalRowCount = jQuery('#tbAssignee tr').length;
                        if (totalRowCount == 0)
                            workGroupViewModel.WorkGroupAssigneeList.push(AddNewAssigneeRow());
                    }
                    else {
                        workGroupViewModel.WorkGroupReporterList.remove(deleteItemData);
                        var totalRowCount = jQuery('#tbReportingTo tr').length;
                        if (totalRowCount == 0)
                            workGroupViewModel.WorkGroupReporterList.push(AddNewReportToRow());
                    }
                }
                else if (json.d == 3) {
                    var msg = languageResource.resMsg_CantDeleteWorkGroupInfo;
                    ShowErrorMessage(msg, true);
                }
                else if (json.d == 1) {
                    var msg = languageResource.resMsg_WorkGroupUserInfoDoesnotExist;
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
                        msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToDeleteWorkGroupUserInfo;
                }
                else {
                    msg = languageResource.resMsg_Error + languageResource.resMsg_FailedToDeleteWorkGroupUserInfo;
                }
                ShowErrorMessage(msg, true);
            },
        });
    }
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

function ShowMessage(message, messageType) {
    switch (messageType.toLowerCase()) {
        case 'info':
            workGroupViewModel.LoadErrorMessageClass("text-info");
            workGroupViewModel.LoadErrorMessage(message);
            break;
        case 'error':
            workGroupViewModel.LoadErrorMessageClass("text-danger");
            workGroupViewModel.LoadErrorMessage(message);
            break;
    }
}

//Download template
function EnableUploadControls() {
    var btnUploadExcel = jQuery.WorkGroupNameSpace.PagerData.LoadControlID;
    var fileToUpload = jQuery.WorkGroupNameSpace.PagerData.LoadControlID.replace("btnUploadExcel", "uploadFile");

    if (jQuery.WorkGroupNameSpace.PagerData.PageAccessRights == "FULL_ACCESS") {
        jQuery("#" + btnUploadExcel).removeClass("disabled");
        jQuery("#" + fileToUpload).removeClass("disabled");
    }
    jQuery("#btnDownloadExcel").removeClass("disabled");
    jQuery("#btnDownloadTemplate").removeClass("disabled");
}

function DisableUploadControls() {
    var btnUploadExcel = jQuery.WorkGroupNameSpace.PagerData.LoadControlID;
    var fileToUpload = jQuery.WorkGroupNameSpace.PagerData.LoadControlID.replace("btnUploadExcel", "uploadFile");

    jQuery("#" + btnUploadExcel).addClass("disabled");
    jQuery("#" + fileToUpload).addClass("disabled");
    jQuery("#btnDownloadExcel").addClass('disabled');
    jQuery("#btnDownloadTemplate").addClass('disabled');
}

function ShowUploadDiv() {
    jQuery("#divUploadProgress").addClass('hide');
    jQuery("#lblUploadError").text("");
    jQuery("#divUploadExcel").slideToggle();
}

function DownloadExcelTemplate() {
    jQuery("#lblUploadError").removeClass("text-info");
    jQuery("#lblUploadError").addClass("text-danger");
    jQuery("#lblUploadError").text('');
    jQuery("#spnErrorMessageForExcel").text('');

    jQuery.ajax({
        type: "POST",
        url: jQuery.WorkGroupNameSpace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/DownloadWorkGroupExcelTemplateInfo",
        data: JSON.stringify({ basicParam: jQuery.WorkGroupNameSpace.BasicParam }),
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

function DownloadAllWorkGroupInfo() {
    jQuery("#lblUploadError").removeClass("text-info");
    jQuery("#lblUploadError").addClass("text-danger");
    jQuery("#lblUploadError").text('');
    jQuery("#spnSearchError").text('');
    jQuery("#spnErrorMessageForExcel").text('');

    var workGroupFilterInfo = {};

    if (jQuery.trim(jQuery("#txtSearchWorkGroupName").val()) != "") {
        workGroupFilterInfo.SearchString = jQuery.trim(jQuery("#txtSearchWorkGroupName").val());
    }

    workGroupFilterInfo.SiteID = jQuery.WorkGroupNameSpace.PagerData.SiteID;
    workGroupFilterInfo.UserID = jQuery.WorkGroupNameSpace.PagerData.UserID;
    workGroupFilterInfo.MasterDataType = jQuery.WorkGroupNameSpace.MasterDataType.WorkGroup;

    jQuery.ajax({
        type: "POST",
        url: jQuery.WorkGroupNameSpace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/DownloadAllWorkGroupInfo",
        data: JSON.stringify({ workGroupFilterInfo: workGroupFilterInfo }),
        contentType: "Application/json; charset=utf-8",
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
                    jQuery("#spnErrorMessageForExcel").html(languageResource.resMsg_FailedToPerformOperation);
                }
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
            url: jQuery.WorkGroupNameSpace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/CheckFileExist",
            data: JSON.stringify({ fileName: successTxtFile }),
            contentType: "Application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                if (json.d != null) {
                    if (json.d) {
                        clearInterval(successTimer);
                        clearInterval(errorTimer);
                        window.location = jQuery.WorkGroupNameSpace.BasePath + "/HandlerFiles/DownloadHandler.ashx?WorkGroupExcelFile=" + excelFile;
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
            url: jQuery.WorkGroupNameSpace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/CheckFileExist",
            data: JSON.stringify({ fileName: errorTxtFile }),
            contentType: "Application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                if (json.d) {
                    jQuery.get(jQuery.WorkGroupNameSpace.BasePath + '/HandlerFiles/DownloadHandler.ashx?WorkGroupLogFile=' + errorTxtFile, function (data) {
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

//Upload
function UploadWorkGroupInfo() {
    var btnUploadExcel = jQuery.WorkGroupNameSpace.PagerData.LoadControlID;
    var fileToUpload = jQuery.WorkGroupNameSpace.PagerData.LoadControlID.replace("btnUploadExcel", "uploadFile");

    var control = "#" + fileToUpload;
    jQuery("#lblUploadError").removeClass("text-info");
    jQuery("#lblUploadError").addClass("text-danger");
    jQuery("#lblUploadError").text('');
    jQuery("#spnSearchError").text('');
    jQuery("#spnErrorMessageForExcel").text('');

    var isValid = true;
    var data = jQuery("#" + fileToUpload).val().split('\\').pop();
    var extension = data.substring(data.lastIndexOf('.') + 1).toLowerCase();
    if (extension != "xls" && extension != "xlsx") {
        isValid = false;
        jQuery("#lblUploadError").html(languageResource.resMsg_InvalidFileFormat);
    }
    if (jQuery.WorkGroupNameSpace.PagerData.SiteID == 0 || jQuery.WorkGroupNameSpace.PagerData.UserID == 0) {
         jQuery("#lblUploadError").html(languageResource.resMsg_InvalidSiteOrUser);
    }

    if (isValid) {
        jQuery("#divUploadProgress").removeClass('hide');
        jQuery.ajaxFileUpload({
            type: "POST",
            url: jQuery.WorkGroupNameSpace.BasePath + "/HandlerFiles/WorkGroupUploadHandler.ashx?sid=" + jQuery.WorkGroupNameSpace.PagerData.SiteID + "&uid=" + jQuery.WorkGroupNameSpace.PagerData.UserID,
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
                    jQuery("#lblUploadError").text(message[1]);
                    jQuery("#btnDownloadExcel").removeAttr('disabled');
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
                jQuery("#divProgressExcel").removeClass('hide');
                DisableUploadControls();
            },
            error: function (request, error) {
                if (request.responseText != "") {
                    EnableUploadControls();
                    jQuery("#divUploadProgress").addClass('hide');
                    control.replaceWith(control = control.val('').clone(true));
                    jQuery("#" + fileToUpload).removeAttr('disabled');
                    jQuery("#btnDownloadExcel").removeAttr('disabled');

                    var message = jQuery.parseJSON(request.responseText);
                    if (message != undefined && message != "" && message.Message != undefined && message.Message != "") {
                        jQuery("#lblUploadError").text(languageResource.resMsg_Error + message.Message);
                    }
                    else {
                        jQuery("#lblUploadError").text(languageResource.resMsg_FailedToUpload);
                    }
                }
                else {
                    jQuery("#lblUploadError").text(languageResource.resMsg_FailedToUpload);
                }
            }
        });
        if (navigator.userAgent.search("MSIE") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
        {
            control = jQuery("#" + fileToUpload);
            control.replaceWith(control = control.clone(true));
        }
    }
    else {
        if (navigator.userAgent.search("MSIE") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
        {
            control = jQuery("#" + fileToUpload);
            control.replaceWith(control = control.clone(true));
        }
    }
}

function TimerMethodForUpload(fileName) {
    var btnUploadExcel = jQuery.WorkGroupNameSpace.PagerData.LoadControlID;
    var fileToUpload = jQuery.WorkGroupNameSpace.PagerData.LoadControlID.replace("btnUploadExcel", "uploadFile");

    DisableUploadControls();
    var successTimer;
    var errorTimer;
    var successTxtFile = fileName + "_tempSuccess.txt";
    var errorFileName = fileName + "_tempError.txt";

    successTimer = setInterval(function () {
        jQuery.ajax({
            type: "POST",
            url: jQuery.WorkGroupNameSpace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/CheckFileExist",
            data: JSON.stringify({ fileName: successTxtFile }),
            contentType: "Application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                if (json.d) {
                    clearInterval(successTimer);
                    clearInterval(errorTimer);
                    jQuery("#" + fileToUpload).removeAttr('disabled');
                    jQuery("#divUploadProgress").addClass('hide');
                    EnableUploadControls();
                    jQuery("#" + btnUploadExcel).removeAttr('disabled');
                    jQuery("#btnDownloadExcel").removeAttr('disabled');
                    window.location = jQuery.WorkGroupNameSpace.BasePath + "/HandlerFiles/DownloadHandler.ashx?WorkGroupLogFile=" + successTxtFile;
                    jQuery.WorkGroupNameSpace.PagerData.PageIndex = 0;
                    jQuery.WorkGroupNameSpace.PagerData.CurrentPage = 0;
                    ClearWorkGroupInfo();
                    ShowUploadDiv();
                    LoadWorkGroupList(jQuery.WorkGroupNameSpace.PagerData);
                }
            },
            error: function (request, error) {
                clearInterval(successTimer);
                clearInterval(errorTimer);
                jQuery("#divUploadProgress").addClass('hide');
                EnableUploadControls();
                jQuery("#" + fileToUpload).removeAttr('disabled');
                jQuery("#" + btnUploadExcel).removeAttr('disabled');
                jQuery("#btnDownloadExcel").removeAttr('disabled');
                if (request.responseText != "") {
                    var message = jQuery.parseJSON(request.responseText);
                    if (message != undefined && message != "" && message.Message != undefined && message.Message != "") {
                        jQuery("#lblUploadError").text(languageResource.resMsg_Error + message.Message);
                    }
                    else {
                        jQuery("#lblUploadError").text(languageResource.resMsg_FailedToUpload);
                    }
                }
                else {
                    jQuery("#lblUploadError").text(languageResource.resMsg_FailedToUpload);
                }
            }
        });
    }, 10000);

    errorTimer = setInterval(function () {
        jQuery.ajax({
            type: "POST",
            url: jQuery.WorkGroupNameSpace.PagerData.ServicePath + "/Vegam_MaintenanceService.asmx/CheckFileExist",
            data: JSON.stringify({ fileName: errorFileName }),
            contentType: "Application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                if (json.d) {
                    EnableUploadControls();
                    jQuery.get(jQuery.WorkGroupNameSpace.BasePath + '/HandlerFiles/DownloadHandler.ashx?WorkGroupLogFile=' + errorFileName, function (data) {
                        clearInterval(successTimer);
                        clearInterval(errorTimer);
                        jQuery("#" + fileToUpload).removeAttr('disabled');
                        jQuery("#divUploadProgress").addClass('hide');
                        jQuery("#" + btnUploadExcel).removeAttr('disabled');
                        jQuery("#btnDownloadExcel").removeAttr('disabled');
                        var indexOfError = data.indexOf('Error :');
                        jQuery("#lblUploadError").text(data.substring(indexOfError + 7, data.length));
                        if (data.indexOf('Inserted :0') != -1 && data.indexOf('Updated :0') != -1 && data.indexOf('Failure :0') != -1) {
                            //do nothing
                        }
                        else {
                            window.location = jQuery.WorkGroupNameSpace.BasePath + "/HandlerFiles/DownloadHandler.ashx?WorkGroupLogFile=" + errorFileName;
                        }

                    });
                }
            },
            error: function (request, error) {
                clearInterval(successTimer);
                clearInterval(errorTimer);
                EnableUploadControls();
                jQuery("#divUploadProgress").addClass('hide');
                jQuery("#" + fileToUpload).removeAttr('disabled');
                jQuery("#" + btnUploadExcel).removeAttr('disabled');
                jQuery("#btnDownloadExcel").removeAttr('disabled');

                if (request.responseText != "") {
                    var message = jQuery.parseJSON(request.responseText);
                    if (message != undefined && message != "" && message.Message != undefined && message.Message != "") {
                        jQuery("#lblUploadError").text(languageResource.resMsg_Error + message.Message);
                    }
                    else {
                        jQuery("#lblUploadError").text(languageResource.resMsg_FailedToUpload);
                    }
                }
                else {
                    jQuery("#lblUploadError").text(languageResource.resMsg_FailedToUpload);
                }
            }
        });
    }, 10000);
}

jQuery(document).ready(function () {
    jQuery("textarea").addClass("font-small");
    jQuery("textarea").css({ "resize": "none", "overflow": "hidden" });
    jQuery("textarea").keyup(function (e) {
        autoheight(this);
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
