jQuery.WorkOrderResourceViewCalendarNamespace = jQuery.WorkOrderResourceViewCalendarNamespace || {};
jQuery.WorkOrderResourceViewCalendarNamespace.InfoType = { "Equipment_Model": 'M', "Equipment": 'E', "None": 'N' };
jQuery.WorkOrderResourceViewCalendarNamespace.BasicParam = {};
jQuery.WorkOrderResourceViewCalendarNamespace.ServicePath = '';
jQuery.WorkOrderResourceViewCalendarNamespace.YAxisItems = [];
jQuery.WorkOrderResourceViewCalendarNamespace.CurrentDate = 0;
jQuery.WorkOrderResourceViewCalendarNamespace.Month = 0;
jQuery.WorkOrderResourceViewCalendarNamespace.Year = 0;
jQuery.WorkOrderResourceViewCalendarNamespace.BasePath = '';
jQuery.WorkOrderResourceViewCalendarNamespace.PagerData = {};
jQuery.WorkOrderResourceViewCalendarNamespace.LocationEquipmentInfo = [];
jQuery.WorkOrderResourceViewCalendarNamespace.IsSearch = true;

var workOrderResourceViewModel = {
    FunctionalLocationFilterArray: ko.observableArray([]),
    SelectedFunctionalLocationFilterArray: ko.observableArray([]),
    EquipmentFilterArray: ko.observableArray([]),
    SelectedEquipmentFilterArray: ko.observableArray([]),
    PagerContent: ko.observable('')
};

function LoadResourceViewBasicInfo(basicParam, pagerData, servicePath, currentDate, basePath) {
    jQuery.WorkOrderResourceViewCalendarNamespace.BasicParam = basicParam;
    jQuery.WorkOrderResourceViewCalendarNamespace.ServicePath = servicePath;
    jQuery.WorkOrderResourceViewCalendarNamespace.CurrentDate = currentDate;
    jQuery.WorkOrderResourceViewCalendarNamespace.BasePath = basePath;
    jQuery.WorkOrderResourceViewCalendarNamespace.PagerData = pagerData;

    ko.applyBindings(workOrderResourceViewModel, document.getElementById("divScheduler"));
    BindDropdownFunctionalLocationsFilter(true, true);
    BindDropdownFunctionalLocationsFilter(true, false);
    LoadResourceViewTimeline(pagerData);
    ConfigureScheduler();
}

function LoadResourceViewTimeline(pagerData) {
    var filter = {};

    var functionalLocIDs = "";
    var equipmentIDs = "";
    jQuery("#spnSearchError").empty();
    jQuery("#divNoSelection").empty();

    if (workOrderResourceViewModel.SelectedFunctionalLocationFilterArray().length > 0 || workOrderResourceViewModel.SelectedEquipmentFilterArray().length > 0) {

        if (workOrderResourceViewModel.SelectedFunctionalLocationFilterArray().length > 0 && workOrderResourceViewModel.SelectedEquipmentFilterArray().length == 0) {
            ko.utils.arrayForEach(workOrderResourceViewModel.SelectedFunctionalLocationFilterArray(), function (locationID) {
                functionalLocIDs = functionalLocIDs + locationID + ",";
            });
            functionalLocIDs = functionalLocIDs.slice(0, -1);

            filter.FunctionalLocIDs = functionalLocIDs;

            jQuery.each(jQuery.WorkOrderResourceViewCalendarNamespace.LocationEquipmentInfo, function (index, equipmentID) {
                equipmentIDs = equipmentIDs + equipmentID + ",";
            });
            equipmentIDs = equipmentIDs.slice(0, -1);
            filter.EquipmentIDs = equipmentIDs;         
        }
        else {
            ko.utils.arrayForEach(workOrderResourceViewModel.SelectedEquipmentFilterArray(), function (equipmentID) {
                equipmentIDs = equipmentIDs + equipmentID + ",";
            });
            equipmentIDs = equipmentIDs.slice(0, -1);

            filter.EquipmentIDs = equipmentIDs;
           
        }

    

    filter.Month = parseInt(jQuery.WorkOrderResourceViewCalendarNamespace.CurrentDate.toString().substring(4, 6));
    filter.Year = parseInt(jQuery.WorkOrderResourceViewCalendarNamespace.CurrentDate.toString().substring(0, 4));
    filter.PageSize = pagerData.PageSize;
    filter.PageIndex = pagerData.PageIndex;

    //Dynamic pagerdata
    var totPageHeight = screen.height;
    //var totPageHeight = jQuery(window).height();
    var functionalLocationPos = jQuery("#scheduler_here").offset().top + 200;

    fLocationMaxHeight = totPageHeight - functionalLocationPos;
    if (jQuery(window).width() < 768)
        fLocationMaxHeight = 500;

    value = Math.floor((fLocationMaxHeight) / 40);
    filter.PageSize = value;
    pagerData.PageSize = value;

    jQuery.extend(filter, jQuery.WorkOrderResourceViewCalendarNamespace.BasicParam);

    jQuery.ajax({
        type: "POST",
        url: jQuery.WorkOrderResourceViewCalendarNamespace.ServicePath + "/Vegam_MaintenanceService.asmx/GetResourceViewWorkOrderInfo",
        data: JSON.stringify({ pagerData: pagerData, filter: filter }),
        dataType: 'json',
            aysnc: false,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            jQuery.WorkOrderResourceViewCalendarNamespace.Month = filter.Month;
            jQuery.WorkOrderResourceViewCalendarNamespace.Year = filter.Year;

            jQuery("#headerText").html(data.d.MonthYear);
            if (data.d.WorkOrderTimelineEventList.length > 0) {
                /* Taking locations and equipments which has events */
                var LocationEquipmentIDList = [];
                jQuery.each(data.d.WorkOrderTimelineEventList, function (index, item) {
                    var YAxisInfo = {};
                    YAxisInfo.label = '';
                    if (item.EquipmentID > 0) {
                        YAxisInfo.key = "E" + item.EquipmentID;
                        YAxisInfo.label = item.EquipmentName;
                    }
                    else {
                        YAxisInfo.key = "L" + item.LocationID;
                        YAxisInfo.label = item.LocationName;
                    }

                    if (LocationEquipmentIDList.indexOf(YAxisInfo.key) == -1) {
                        LocationEquipmentIDList.push(YAxisInfo.key);

                        //if (jQuery.WorkOrderResourceViewCalendarNamespace.LocationEquipmentNameInfo[YAxisInfo.key] != undefined)
                        //    YAxisInfo.label = jQuery.WorkOrderResourceViewCalendarNamespace.LocationEquipmentNameInfo[YAxisInfo.key];
                        jQuery.WorkOrderResourceViewCalendarNamespace.YAxisItems.push(YAxisInfo);
                    }
                });
                jQuery("#scheduler_here").show();
                InitiateScheduler();
                workOrderResourceViewModel.PagerContent(data.d.HTMLPager);

                jQuery.each(data.d.WorkOrderTimelineEventList, function (index, item) {
                    var eventInfo = {};
                    eventInfo.id = index + 1;
                    eventInfo.start_date = GetDateTimeFromInt(item.ScheduleDate, true);
                    eventInfo.end_date = GetDateTimeFromInt(item.ScheduleDate, false);
                    if (item.EventListDetailsList.length > 1)
                        eventInfo.text = "<div class='back_primary_circle'>" + item.EventListDetailsList.length + "</div>";
                    else
                        eventInfo.text = '';
                    eventInfo.EquipmentID = item.EquipmentID;
                    eventInfo.LocationID = item.LocationID;
                    if (item.EquipmentID > 0)
                        eventInfo.ResourceID = "E" + item.EquipmentID;
                    else
                        eventInfo.ResourceID = "L" + item.LocationID;
                    eventInfo.EventListDetailsList = item.EventListDetailsList;
                    scheduler.addEvent(eventInfo)
                });
            }
            if (data.d.FunctionalLocationEquipmentList.length > 0) {
                /* Taking locations and equipments which does not have events */

                jQuery.each(data.d.FunctionalLocationEquipmentList, function (index, item) {
                    /*If location is not selected and equipment is selected then displaying the selected equipment in the timeline*/
                    if (workOrderResourceViewModel.SelectedFunctionalLocationFilterArray().length == 0 && workOrderResourceViewModel.SelectedEquipmentFilterArray().length > 0) {
                        var YAxisInfo = {};
                        YAxisInfo.label = '';
                        YAxisInfo.key = "E" + item.TypeValue;
                        YAxisInfo.label = item.DisplayName;
                        jQuery.WorkOrderResourceViewCalendarNamespace.YAxisItems.push(YAxisInfo);
                    }
                    /* If location is selected and equipment is not selected then displaying location and all equipments in the timeline */
                    else if (workOrderResourceViewModel.SelectedFunctionalLocationFilterArray().length > 0 && workOrderResourceViewModel.SelectedEquipmentFilterArray().length == 0) {
                        var YAxisInfo = {};
                        YAxisInfo.label = '';
                        YAxisInfo.key = "L" + item.TypeValue;
                        YAxisInfo.label = item.DisplayName;
                        jQuery.WorkOrderResourceViewCalendarNamespace.YAxisItems.push(YAxisInfo);
                    }
                    /* If location and equipment are selected then displaying the selected equipment in the timeline */
                    else if (workOrderResourceViewModel.SelectedFunctionalLocationFilterArray().length > 0 && workOrderResourceViewModel.SelectedEquipmentFilterArray().length > 0) {
                        var YAxisInfo = {};
                        YAxisInfo.label = '';
                        YAxisInfo.key = "E" + item.TypeValue;
                        YAxisInfo.label = item.DisplayName;
                        jQuery.WorkOrderResourceViewCalendarNamespace.YAxisItems.push(YAxisInfo);
                    }
                });

                if (jQuery.WorkOrderResourceViewCalendarNamespace.YAxisItems.length > 0) {
                    jQuery("#scheduler_here").show();
                    InitiateScheduler();
                    workOrderResourceViewModel.PagerContent(data.d.HTMLPager);
                }
                else
                    ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_LocationAndEquipmentAreNotConfiguredInSystem);
            }
        },
        beforeSend: function () {
            scheduler.clearAll();
            jQuery.WorkOrderResourceViewCalendarNamespace.YAxisItems = [];
            jQuery("#divTimelineProgress").removeClass("hide");
        },
        complete: function () {
            jQuery("#divTimelineProgress").addClass("hide");
                jQuery.WorkOrderResourceViewCalendarNamespace.IsSearch = true;      
        },
        error: function (request, error) {
            var displayErrorMessage = LanguageResource.resMsg_Error + LanguageResource.resMsg_FailedToLoadResourceViewTimelineInfo;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null) {
                    displayErrorMessage = LanguageResource.resMsg_Error + errorMsg.Message;
                }
            }
            ShowErrorMessage(displayErrorMessage);
        }
    });
}
    else {
    jQuery("#divNoSelection").html(LanguageResource.resMsg_SelectFunctionalLocOrEquipment);
    jQuery("#scheduler_here").hide();
    workOrderResourceViewModel.PagerContent('');
    jQuery("#divTimelineProgress").addClass("hide");
}
}

function ConfigureScheduler() {
    scheduler.config.time_step = 0;//when event is starting and ending at same time, it will plot with same starting and ending time.
    scheduler.config.drag_create = false;
    scheduler.config.drag_resize = false;
    scheduler.config.drag_move = false;
    scheduler.config.show_loading = true;
    scheduler.config.dblclick_create = false;
    scheduler.xy.bar_height = 65;
    scheduler.config.touch_tooltip = true;

    //holding tooltip for on-click event
    dhtmlXTooltip.config.timeout_to_hide = 3000;

    scheduler.templates.tooltip_text = function (start, end, eventInfo) {
        var toolTipText = "";
        for (var index = 0; index < eventInfo.EventListDetailsList.length; index++) {
            if (eventInfo.EventListDetailsList.length > 1) {
                if (index > 0)
                    toolTipText = toolTipText + "<br/>";

                toolTipText = toolTipText + "<b>" + LanguageResource.resMsg_Event + " : " + (index + 1) + "</b><br/>";
            }

            toolTipText = toolTipText + "<b>" + LanguageResource.resMsg_Name + "</b> : " + eventInfo.EventListDetailsList[index].MaintenanceName + "<br/>";
            toolTipText = toolTipText + "<b>" + LanguageResource.resMsg_WorkOrder + "</b><a onClick='javascript:ViewWorkOrderInfo(" + eventInfo.EventListDetailsList[index].WorkOrderNumber + ");return false'> : " + eventInfo.EventListDetailsList[index].WorkOrderNumber + "</a><br/>";
            toolTipText = toolTipText + "<b>" + LanguageResource.resMsg_StartTime + "</b> : " + eventInfo.EventListDetailsList[index].StartDateTime + "<br/>";
            if (eventInfo.EventListDetailsList[index].EndDateTime.length > 0)
                toolTipText = toolTipText + "<b>" + LanguageResource.resMsg_EndTime + "</b> : " + eventInfo.EventListDetailsList[index].EndDateTime + "<br/>";
        }
        if (eventInfo.EventListDetailsList.length > 3) {
            dhtmlXTooltip.config.timeout_to_hide = 5000;
        } else {
            dhtmlXTooltip.config.timeout_to_hide = 3000;
        }
        
        return toolTipText;
    };

    scheduler.templates.event_class = function (start, end, event) {
        return "bg-primary";
    };

    jQuery("#divScheduler").click(function () {
        dhtmlXTooltip.hide();
    });

    scheduler.attachEvent("onClick", function (eventCtlID, event) {
        event.stopPropagation();
        var eventInfo = scheduler.getEvent(eventCtlID);
        if (eventInfo.EventListDetailsList.length > 0) {
            if (eventInfo.EventListDetailsList.length == 1) {
                ViewWorkOrderInfo(eventInfo.EventListDetailsList[0].WorkOrderID);
            }
        }
    });

    scheduler.attachEvent("onDblClick", function (eventCtlID) {
        return false;
    });

}

function InitiateScheduler() {
    var daysInMonth = new Date(jQuery.WorkOrderResourceViewCalendarNamespace.Year, jQuery.WorkOrderResourceViewCalendarNamespace.Month, 0).getDate();

    scheduler.createTimelineView({
        name: "timeline",
        x_unit: "day",
        x_date: "%d",
        x_step: 1,
        x_size: daysInMonth,
        x_start: 0,
        y_unit: jQuery.WorkOrderResourceViewCalendarNamespace.YAxisItems,
        y_property: "ResourceID",
        render: "bar",
        section_autoheight: false,
        event_dy: 30,
        resize_events: false,
        dy: 30,
    });

    var newDate = new Date(jQuery.WorkOrderResourceViewCalendarNamespace.Year, jQuery.WorkOrderResourceViewCalendarNamespace.Month - 1, 1);
    scheduler.init('scheduler_here', newDate, "timeline");
}

function GetDateTimeFromInt(inputVal, isStartTime) {
    inputVal = inputVal.toString();

    var yearVal = inputVal.substring(0, 4);
    var monthVal = inputVal.substring(4, 6);
    var dateVal = inputVal.substring(6, 8);

    if (isStartTime)
        return new Date(yearVal, monthVal - 1, dateVal, 0, 0, 0);
    else
        return new Date(yearVal, monthVal - 1, dateVal, 23, 59, 00);
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

function MonthYearChange() {
    var month = parseInt(jQuery("#viewMonthCalendar .ui-datepicker-month").val()) + 1;
    var year = jQuery("#viewMonthCalendar .ui-datepicker-year").val();
    var dateformate = year + "/" + month + "/" + "01";
    var selectedDate = new Date(dateformate);
    jQuery.WorkOrderResourceViewCalendarNamespace.CurrentDate = selectedDate.format('yyyyMMdd');
    jQuery("#viewMonthCalendar .ui-datepicker-calendar").hide();
    LoadResourceViewTimeline(jQuery.WorkOrderResourceViewCalendarNamespace.PagerData);
}

function LocationChange() {
    workOrderResourceViewModel.SelectedFunctionalLocationFilterArray.removeAll();
    workOrderResourceViewModel.EquipmentFilterArray.removeAll();
    jQuery('#ulFLoctionMultiSelect').find('input:checked').each(function () {
        workOrderResourceViewModel.SelectedFunctionalLocationFilterArray.push($(this).val());
    });
    if (workOrderResourceViewModel.SelectedFunctionalLocationFilterArray().length == 0) {
        workOrderResourceViewModel.EquipmentFilterArray.removeAll();
    }
    BindDropdownFunctionalLocationsFilter(false, false);
}

jQuery(document).ready(function () {
    jQuery("#viewMonthCalendar").datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'yymmdd',
        selectWeek: true,
        showOtherMonths: true,
        selectOtherMonths: false,
        closeOnSelect: false
    });

    jQuery("#viewMonthCalendar .ui-datepicker").hide();
    jQuery("#viewMonthCalendar .ui-datepicker-calendar").hide();

    jQuery("#viewMonthCalendar").mouseover(function () {
        jQuery("#viewMonthCalendar .ui-datepicker").addClass("hasDatepicker");
        jQuery("#viewMonthCalendar .ui-datepicker").show();
        jQuery("#viewMonthCalendar .ui-datepicker-calendar").hide();

        jQuery("#viewMonthCalendar .ui-datepicker-month").unbind("change");
        jQuery("#viewMonthCalendar .ui-datepicker-year").unbind("change");
        jQuery("#viewMonthCalendar .ui-datepicker-month").change(function () {
            MonthYearChange();
        });
        jQuery("#viewMonthCalendar .ui-datepicker-year").change(function () {
            MonthYearChange();
        });

        jQuery("#viewMonthCalendar .ui-datepicker-month").click(function () {
            jQuery("#viewMonthCalendar").unbind("mouseout");
        });
        jQuery("#viewMonthCalendar .ui-datepicker-year").click(function () {
            jQuery("#viewMonthCalendar").unbind("mouseout");
        });
    });

    jQuery("#viewMonthCalendar").mouseout(function () {
        jQuery("#viewMonthCalendar .ui-datepicker").hide();
    });
});

jQuery(document).mouseup(function (e) {
    var container = jQuery("#viewMonthCalendar");

    if (!container.is(e.target)
        && container.has(e.target).length === 0) {
        jQuery("#viewMonthCalendar .ui-datepicker").hide();
    }
});

jQuery(document).click(function () {
    jQuery('.popover').popover('hide');
});

function ViewWorkOrderInfo(workOrder) {
    if (jQuery.WorkOrderResourceViewCalendarNamespace.PagerData.PageAccessRights.toLowerCase() != "no_access") {
        var queryString = "id=" + jQuery.WorkOrderResourceViewCalendarNamespace.BasicParam.SiteID + "&workorder=" + workOrder;
        var url = jQuery.WorkOrderResourceViewCalendarNamespace.BasePath + "/Preventive/ViewWorkOrderInfo.aspx?" + queryString+"&ptype=R";
        window.open(url);
    }
}

function ShowWorkGroupInfo(ctlInfo, workOrderList) {
    jQuery.each(workOrderList, function (index, ItemInfo) {
        jQuery("#ulOrder").append("<li onClick='javascript:ViewWorkOrderInfo();return false'>" + ItemInfo.WorkOrderNumber + "</li>");
    });

    jQuery('.popover').remove();
    jQuery(ctlInfo).popover({
        html: true,
        trigger: "manual",
        content: function () {
            return jQuery('.pop-content').html();
        }
    });
    jQuery(ctlInfo).popover("show");
}

function HideWorkGroupInfo(ctlInfo) {
    jQuery(ctlInfo).popover("hide");
}

function BindDropdownFunctionalLocationsFilter(pageLoad, considerFLoc) {
    jQuery.WorkOrderResourceViewCalendarNamespace.LocationEquipmentInfo = [];
    var fLocationFilterInfo = {};
    fLocationFilterInfo.SiteID = jQuery.WorkOrderResourceViewCalendarNamespace.BasicParam.SiteID;
    fLocationFilterInfo.UserID = jQuery.WorkOrderResourceViewCalendarNamespace.BasicParam.UserID;
    fLocationFilterInfo.ConsiderFLoc = considerFLoc;
    var functionalLocIDs = "";

    if (workOrderResourceViewModel.SelectedFunctionalLocationFilterArray().length > 0) {
        ko.utils.arrayForEach(workOrderResourceViewModel.SelectedFunctionalLocationFilterArray(), function (locationID) {
            functionalLocIDs = functionalLocIDs + locationID + ",";
        });
        functionalLocIDs = functionalLocIDs.slice(0, -1);

        fLocationFilterInfo.FunctionalLocIDs = functionalLocIDs;
    }


    jQuery.ajax({
        type: "POST",
        url: jQuery.WorkOrderResourceViewCalendarNamespace.ServicePath + "/Vegam_MaintenanceService.asmx/GetFunctionalLocListForHierarchicalDropDown",
        data: JSON.stringify({ fLocationFilterInfo: fLocationFilterInfo }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        async: false,
        success: function (json) {
            var inputCheckBox;
            if (json != undefined || json.d != null) {
                if (fLocationFilterInfo.ConsiderFLoc == true) {
                    workOrderResourceViewModel.FunctionalLocationFilterArray(json.d);

                    if (json.d[0].UserDefaultLocation.length > 0) {
                        json.d[0].UserDefaultLocation.split(',').forEach(function (item) {
                            workOrderResourceViewModel.SelectedFunctionalLocationFilterArray.push(item);
                            jQuery("#idCheckBox_" + item).prop('checked', true);
                            inputCheckBox = jQuery("#idCheckBox_" + item);
                        });
                        var inputTextBox = jQuery(inputCheckBox).closest('.drpdownbody').prev('.functiondropdown').find('.appendSelectedElements');
                        AppendElements(inputTextBox);
                    }
                    var parentulforHistory = jQuery('.workOrderResource_dropdown');
                    ApplyCss(parentulforHistory);
                    ResetEquipmentDropdown();
                }
                else {
                    var equipmentInfo = json.d;
                    if (equipmentInfo.length > 0) {
                        jQuery('#divEquipment').show();
                        jQuery.each(equipmentInfo, function (index, equipmentItem) {
                            if (workOrderResourceViewModel.SelectedFunctionalLocationFilterArray().length > 0) {                             
                                jQuery.WorkOrderResourceViewCalendarNamespace.LocationEquipmentInfo.push(equipmentItem.TypeValue);
                            }
                            iterate(equipmentInfo[index], 0, false);
                        });

                        workOrderResourceViewModel.EquipmentFilterArray(json.d);                     
                        if (pageLoad) {
                            if (json.d[0].UserDefaultEquipment.length > 0) {
                                json.d[0].UserDefaultEquipment.split(',').forEach(function (item) {
                                    workOrderResourceViewModel.SelectedEquipmentFilterArray.push(item);
                                    jQuery("#idCheckBox_" + item).prop('checked', true);
                                    inputCheckBox = jQuery("#idCheckBox_" + item);
                                });
                            }
                            var inputTextBox = jQuery(inputCheckBox).closest('.drpdownbody').prev('.functiondropdown').find('.appendSelectedElements');
                            AppendElements(inputTextBox);
                        }
                        var parentulforHistory = jQuery('.workOrderResource_dropdown');
                        ApplyCss(parentulforHistory);
                        ResetEquipmentDropdown();
                    }
                    else
                        jQuery('#divEquipment').hide();
                }

            }
            else {
                ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_FailedToBindHierarchicalDropDown);
            }
        },
        beforeSend: function () {

        },
        complete: function () {
            jQuery("#divLoadProgressVisible").hide();
        },
        error: function (request, error) {
            var msg;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    msg = LanguageResource.resMsg_Error + errorMsg.Message;
                else
                    msg = LanguageResource.resMsg_Error + languageResource.resMsg_FailedToBindHierarchicalDropDown;
            }
            else {
                msg = LanguageResource.resMsg_Error + languageResource.resMsg_FailedToBindHierarchicalDropDown;
            }
            ShowErrorMessage(msg);
        }
    });
}

function SearchFuncLocOrEquipment() {
    if (jQuery.WorkOrderResourceViewCalendarNamespace.IsSearch==true) {
        jQuery.WorkOrderResourceViewCalendarNamespace.IsSearch = false;       
        workOrderResourceViewModel.SelectedFunctionalLocationFilterArray.removeAll();
        workOrderResourceViewModel.SelectedEquipmentFilterArray.removeAll();

        jQuery('#ulFLoctionMultiSelect').find('.selectedCheckbox').each(function () {
            workOrderResourceViewModel.SelectedFunctionalLocationFilterArray.push(jQuery(this).val());
        });

        jQuery('#ulEquipMultiSelect').find('.selectedCheckbox').each(function () {
            workOrderResourceViewModel.SelectedEquipmentFilterArray.push(jQuery(this).val());
        });

        if (workOrderResourceViewModel.SelectedFunctionalLocationFilterArray().length == 0 && workOrderResourceViewModel.SelectedEquipmentFilterArray().length == 0) {
            jQuery("#spnSearchError").html(LanguageResource.resMsg_SelectFunctionalLocOrEquipment);
            jQuery.WorkOrderResourceViewCalendarNamespace.IsSearch = true;
            return false;
        }
        jQuery("#spnSearchError").empty();
        LoadResourceViewTimeline(jQuery.WorkOrderResourceViewCalendarNamespace.PagerData);
        SetUserPreference();        
    }
}

function iterate(current, depth) {
    var children = current.Children;
    if (!children.length > 0) return false;
    jQuery.each(children, function (index, childItem) {
        jQuery.WorkOrderResourceViewCalendarNamespace.LocationEquipmentInfo.push(childItem.TypeValue);    
        iterate(children[index], depth + 1);
    });
}

function SetUserPreference() {
    var filterInfo = {};
    filterInfo.PreferenceLocationIDS = workOrderResourceViewModel.SelectedFunctionalLocationFilterArray();
    filterInfo.PreferenceEquipmentIDS = workOrderResourceViewModel.SelectedEquipmentFilterArray();
    filterInfo.SiteID = jQuery.WorkOrderResourceViewCalendarNamespace.BasicParam.SiteID;
    filterInfo.UserID = jQuery.WorkOrderResourceViewCalendarNamespace.BasicParam.UserID;

    jQuery.ajax({
        type: "POST",
        url: jQuery.WorkOrderResourceViewCalendarNamespace.ServicePath + "/Vegam_MaintenanceService.asmx/InsertOrUpdateUserPreference",
        data: JSON.stringify({ filterInfo: filterInfo }),
        dataType: 'json',
        async: false,
        contentType: "application/json; charset=utf-8",
        error: function (request, error) {
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null) {
                    ShowErrorMessage(LanguageResource.resMsg_Error + errorMsg.Message);
                }
                else {
                    ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_FailedToSetUserPreferenceForDropdown);
                }
            }
            else {
                ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_FailedToSetUserPreferenceForDropdown);
            }
        }
    });
}

function ResetEquipmentDropdown() {
    var EquipmentMultiSelect = jQuery('#ulEquipMultiSelect').closest('.drpdownbody');
    jQuery(EquipmentMultiSelect).find('ul:gt(0)').slideUp();
    jQuery(EquipmentMultiSelect).find('ul:gt(0)').each(function () {
        jQuery(this).prev('span').find('.fa-drop-icon').removeClass('fa-chevron-circle-up i-opacity').addClass('fa-chevron-circle-down');
    });
}

function WorkOrderResourceViewCustom() {
    LocationChange();
    var EquipmentMultiSelect = jQuery('#ulEquipMultiSelect').closest('.drpdownbody');
    $('#ulEquipMultiSelect').find('input[type = "checkbox"]').prop('checked', false);
    $('#ulEquipMultiSelect').find('span').removeClass('selectedParentlist selectedlist');
    jQuery(EquipmentMultiSelect).prev('.functiondropdown').find('.appendSelectedElements').show();
    jQuery(EquipmentMultiSelect).prev('.functiondropdown').find('.pover').remove();
    ResetEquipmentDropdown();
}