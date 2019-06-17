jQuery.WorkOrderResourceViewCalendarNamespace = jQuery.WorkOrderResourceViewCalendarNamespace || {};
jQuery.WorkOrderResourceViewCalendarNamespace.InfoType = { "Equipment_Model": 'M', "Equipment": 'E', "None": 'N' };
jQuery.WorkOrderResourceViewCalendarNamespace.BasicParam = {};
jQuery.WorkOrderResourceViewCalendarNamespace.ServicePath = '';
jQuery.WorkOrderResourceViewCalendarNamespace.YAxisItems = [];
jQuery.WorkOrderResourceViewCalendarNamespace.CurrentDate = 0;
jQuery.WorkOrderResourceViewCalendarNamespace.LocationEquipmentInfo = {};
jQuery.WorkOrderResourceViewCalendarNamespace.Month = 0;
jQuery.WorkOrderResourceViewCalendarNamespace.Year = 0;
jQuery.WorkOrderResourceViewCalendarNamespace.BasePath = '';
jQuery.WorkOrderResourceViewCalendarNamespace.ViewWorkOrderPermission = '';

function LoadResourceViewBasicInfo(basicParam, servicePath, currentDate, basePath, viewWorkOrderPermission) {
    jQuery.WorkOrderResourceViewCalendarNamespace.BasicParam = basicParam;
    jQuery.WorkOrderResourceViewCalendarNamespace.ServicePath = servicePath;
    jQuery.WorkOrderResourceViewCalendarNamespace.CurrentDate = currentDate;
    jQuery.WorkOrderResourceViewCalendarNamespace.BasePath = basePath;
    jQuery.WorkOrderResourceViewCalendarNamespace.ViewWorkOrderPermission = viewWorkOrderPermission;

    GetLocationEquipmentInfo();
    if (jQuery.WorkOrderResourceViewCalendarNamespace.YAxisItems.length > 0) {
        ConfigureScheduler();
        LoadResourceViewTimeline();
    }
    else {
        ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_EquipmentNotExists);
    }
}

function LoadResourceViewTimeline() {
    var filter = {};
    filter.Month = parseInt(jQuery.WorkOrderResourceViewCalendarNamespace.CurrentDate.toString().substring(4, 6));
    filter.Year = parseInt(jQuery.WorkOrderResourceViewCalendarNamespace.CurrentDate.toString().substring(0, 4));
    jQuery.extend(filter, jQuery.WorkOrderResourceViewCalendarNamespace.BasicParam);

    jQuery.ajax({
        type: "POST",
        url: jQuery.WorkOrderResourceViewCalendarNamespace.ServicePath + "/Vegam_MaintenanceService.asmx/GetResourceViewWorkOrderInfo",
        data: JSON.stringify({ filter: filter }),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (data) {            
            jQuery.WorkOrderResourceViewCalendarNamespace.Month = filter.Month;
            jQuery.WorkOrderResourceViewCalendarNamespace.Year = filter.Year;
            InitiateScheduler()
            if (data.d != null) {
                jQuery("#headerText").html(data.d.MonthYear);
                jQuery.each(data.d.eventInfoList, function (index, item) {
                    var eventInfo = {};
                    eventInfo.id = index + 1;
                    eventInfo.start_date = GetDateTimeFromInt(item.ScheduleDate, true);
                    eventInfo.end_date = GetDateTimeFromInt(item.ScheduleDate, false);
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
            else {
                ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_FailedToLoadResourceViewTimelineInfo);
            }
        },
        beforeSend: function () {         
            scheduler.clearAll();
            jQuery("#divTimelineProgress").removeClass("hide");
        },
        complete: function () {            
            jQuery("#divTimelineProgress").addClass("hide");
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

function GetLocationEquipmentInfo() { 
    jQuery.ajax({
        type: "POST",
        url: jQuery.WorkOrderResourceViewCalendarNamespace.ServicePath + "/Vegam_MaintenanceService.asmx/GetResourceInfoForTimeLine",
        data: JSON.stringify({ basicParam: jQuery.WorkOrderResourceViewCalendarNamespace.BasicParam }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (json) {
            if (json != undefined && json.d != null) {                
                if (json.d.length > 0) {                    
                    jQuery.each(json.d, function (index, locationItem) {
                        var locationInfo = {};
                        locationInfo.key = "L" + locationItem.Key;
                        locationInfo.label = locationItem.Value;
                        jQuery.WorkOrderResourceViewCalendarNamespace.YAxisItems.push(locationInfo);                        
                        
                        var equipmentList = [];
                        jQuery.each(locationItem.EquipmentInfoList, function (eIndex, equipmentItem) {
                            var equipmentInfo = {};
                            equipmentInfo.key = "E" + equipmentItem.Key;
                            equipmentInfo.label = equipmentItem.Value;
                            jQuery.WorkOrderResourceViewCalendarNamespace.YAxisItems.push(equipmentInfo);
                            equipmentList.push(equipmentItem);
                        });

                        var locationEquipment = {};
                        locationEquipment.LocationID = locationItem.Key;
                        locationEquipment.LocationName = locationItem.Value;
                        locationEquipment.EquipmentInfoList = equipmentList;
                        jQuery.WorkOrderResourceViewCalendarNamespace.LocationEquipmentInfo[locationItem.Key] = locationEquipment;                        

                        if (index == 0) {                            
                            jQuery("#drpLocation").append(jQuery("<option></option>").attr("value", 0).text(LanguageResource.resMsg_Select));
                        }                        
                        jQuery("#drpLocation").append(jQuery("<option></option>").attr("value", locationItem.Key).text(locationItem.Value));
                    });                    
                }
                else {
                    ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_ResourceInfoNotExistsInSystem);
                }
            }
            else {
                ShowErrorMessage(LanguageResource.resMsg_Error + LanguageResource.resMsg_FailedToLoadResourceInfo);
            }
        },
        error: function (request, error) {
            var msg = LanguageResource.resMsg_Error + LanguageResource.resMsg_FailedToLoadResourceInfo;
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    msg = LanguageResource.resMsg_Error + errorMsg.Message;
            }
            ShowErrorMessage(msg);
        }
    });
}

function ConfigureScheduler() {
    scheduler.config.time_step = 0;//when event is starting and ending at same time, it will plot with same starting and ending time.
    scheduler.config.drag_create = false;
    scheduler.config.drag_resize = false;
    scheduler.config.drag_move = false;
    scheduler.config.show_loading = true;
    scheduler.config.dblclick_create = false;
    scheduler.xy.bar_height = 65;

    scheduler.templates.tooltip_text = function (start, end, eventInfo) {     
        var toolTipText = "";
        for (var index = 0; index < eventInfo.EventListDetailsList.length; index++) {
            if (eventInfo.EventListDetailsList.length > 1) {
                if (index > 0)
                    toolTipText = toolTipText + "<br/>";

                toolTipText = toolTipText + "<b>" + LanguageResource.resMsg_Event + " : " + (index + 1) + "</b><br/>";
            }

            toolTipText = toolTipText + "<b>" + LanguageResource.resMsg_Name + "</b> : " + eventInfo.EventListDetailsList[index].MaintenanceName + "<br/>";
            toolTipText = toolTipText + "<b>" + LanguageResource.resMsg_WorkOrder + "</b> : " + eventInfo.EventListDetailsList[index].WorkOrderNumber + "<br/>";            
            toolTipText = toolTipText + "<b>" + LanguageResource.resMsg_StartTime + "</b> : " + eventInfo.EventListDetailsList[index].StartDateTime + "<br/>";
            if (eventInfo.EventListDetailsList[index].EndDateTime.length > 0)
                toolTipText = toolTipText + "<b>" + LanguageResource.resMsg_EndTime + "</b> : " + eventInfo.EventListDetailsList[index].EndDateTime + "<br/>";
        }
        return toolTipText;
    };

    scheduler.templates.event_class = function (start, end, event) {
        return "bg-green";
    };

    scheduler.attachEvent("onClick", function (eventCtlID, event) {
        event.stopPropagation();
        var eventInfo = scheduler.getEvent(eventCtlID);
        if (eventInfo.EventListDetailsList.length > 0) {
            if (eventInfo.EventListDetailsList.length == 1) {
                ViewWorkOrderInfo(eventInfo.EventListDetailsList[0].WorkOrderID);
            }
            else {                
                jQuery.each(eventInfo.EventListDetailsList, function (index, ItemInfo) {
                    jQuery("#divPopOverContent").append("<li onClick='javascript:ViewWorkOrderInfo(" + ItemInfo.WorkOrderID + ");return false'><a>" + ItemInfo.WorkOrderNumber + "</a></li>");
                });                

                jQuery('.popover').popover('hide');
                jQuery("[event_id=" + eventCtlID + "]").popover({
                    html: true,
                    trigger: "click",
                    title: function () {
                        return jQuery('#popover_content_wrapper .title').html();
                    },
                    content: function () {
                        return jQuery('#popover_content_wrapper .content').html();
                    }
                }).popover("show");
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
        event_dy: 35,
        resize_events: false,
        dy: 35,
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
    LoadResourceViewTimeline();
}

function LocationChange() {    
    jQuery.WorkOrderResourceViewCalendarNamespace.YAxisItems = [];
    var selectionLocation = jQuery("#drpLocation").val();
    if (selectionLocation == 0) {
        jQuery("#drpEquipment").empty();
        jQuery("#drpEquipment").addClass("hide");
        jQuery("#lblEqipment").addClass("hide");

        var equipmentList = [];
        jQuery.each(jQuery.WorkOrderResourceViewCalendarNamespace.LocationEquipmentInfo, function (index, equipments) {
            var locationInfo = {};
            locationInfo.key = "L" + equipments.LocationID;
            locationInfo.label = equipments.LocationName;
            jQuery.WorkOrderResourceViewCalendarNamespace.YAxisItems.push(locationInfo);

            jQuery.each(equipments.EquipmentInfoList, function (eqipIndex, equipmentItem) {
                var equipmentInfo = {};
                equipmentInfo.key = "E" + equipmentItem.Key;
                equipmentInfo.label = equipmentItem.Value;
                equipmentList.push(equipmentInfo);
            });
        });

        jQuery.WorkOrderResourceViewCalendarNamespace.YAxisItems = jQuery.WorkOrderResourceViewCalendarNamespace.YAxisItems.concat(equipmentList);
    }
    else {
        var equipmentList = jQuery.WorkOrderResourceViewCalendarNamespace.LocationEquipmentInfo[selectionLocation];
        if (equipmentList != undefined) {
            jQuery("#drpEquipment").empty();
            jQuery("#drpEquipment").removeClass("hide");
            jQuery("#lblEqipment").removeClass("hide");
            jQuery("#drpEquipment").append(jQuery("<option></option>").attr("value", 0).text(LanguageResource.resMsg_Select));

            var locationInfo = {};
            locationInfo.key = "L" + equipmentList.LocationID;
            locationInfo.label = equipmentList.LocationName;
            jQuery.WorkOrderResourceViewCalendarNamespace.YAxisItems.push(locationInfo);

            jQuery.each(equipmentList.EquipmentInfoList, function (index, equipmentItem) {
                jQuery("#drpEquipment").append(jQuery("<option></option>").attr("value", equipmentItem.Key).text(equipmentItem.Value));

                var equipmentInfo = {};
                equipmentInfo.key = "E" + equipmentItem.Key;
                equipmentInfo.label = equipmentItem.Value;
                jQuery.WorkOrderResourceViewCalendarNamespace.YAxisItems.push(equipmentInfo);
            });
        }
    }   
    InitiateScheduler();
    LoadResourceViewTimeline();
}

function EquipmentOnChange() {
    var locationID = jQuery("#drpLocation").val();    
    var equipmentID = jQuery("#drpEquipment").val();
    jQuery.WorkOrderResourceViewCalendarNamespace.YAxisItems = [];

    if (equipmentID == 0) {
        var locationEquipmentInfo = jQuery.WorkOrderResourceViewCalendarNamespace.LocationEquipmentInfo[locationID];
        var locationInfo = {};
        locationInfo.key = "L" + locationEquipmentInfo.LocationID;
        locationInfo.label = locationEquipmentInfo.LocationName;
        jQuery.WorkOrderResourceViewCalendarNamespace.YAxisItems.push(locationInfo);

        jQuery.each(locationEquipmentInfo.EquipmentInfoList, function (eqipIndex, equipmentItem) {
            var equipmentInfo = {};
            equipmentInfo.key = "E" + equipmentItem.Key;
            equipmentInfo.label = equipmentItem.Value;
            jQuery.WorkOrderResourceViewCalendarNamespace.YAxisItems.push(equipmentInfo);
        });
    }
    else {
        var equipmentName = jQuery("#drpEquipment option:selected").text();
        var equipmentInfo = {};
        equipmentInfo.key = "E" + equipmentID;
        equipmentInfo.label = equipmentName;
        jQuery.WorkOrderResourceViewCalendarNamespace.YAxisItems.push(equipmentInfo);
    }
    InitiateScheduler();
    LoadResourceViewTimeline();
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
    if (jQuery.WorkOrderResourceViewCalendarNamespace.ViewWorkOrderPermission.toLowerCase() != "no_access") {        
        var queryString = "id=" + jQuery.WorkOrderResourceViewCalendarNamespace.BasicParam.SiteID + "&workorder=" + workOrder;
        var url = jQuery.WorkOrderResourceViewCalendarNamespace.BasePath + "/Preventive/ViewWorkOrderInfo.aspx?" + queryString;
        window.parent.ShowWorkOrderInfo(url);
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