<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="CreateSchedule.aspx.cs" Inherits="Vegam_MaintenanceModule.Preventive.CreateSchedule" MasterPageFile="~/Vegam-Iframe.Master" %>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/Vegam_CreateSchedule.js" type="text/javascript"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/jquery.ui.timepicker.js" type="text/javascript"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/moment.min.js" type="text/javascript"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/vegam-multiselect-dropdown.js" type="text/javascript"></script>
    <link href="<%= ConfigurationManager.AppSettings["MaintCssPath"].TrimEnd('/') %>/Styles/vegam-multiselect-dropdown.css" rel="stylesheet" type="text/css" />
    <asp:ScriptManager ID="scriptManager" runat="server" EnableViewState="false">
    </asp:ScriptManager>
    <style>
        .lside-box {
            box-shadow: 0 0 10px 10px #f5f5f5;
            min-height:95vh;
            overflow: auto;
            border: 1px solid #f3f1f1;
        }
        .rside-box {
            box-shadow: 0 0 10px 10px #f5f5f5;
            min-height:95vh;
            padding-top: 2px;
            overflow: auto;
            border: 1px solid #f3f1f1;
        }
        input[type='radio']:disabled {
            cursor: not-allowed !important;
        }
        #spnErrorMessage{
            cursor:default !important;
        }
        #spnErrorMessage:hover{
            background-color:white !important;
        }                
        .scheduleTypeMultiSelect {
            border: 1px solid #c7c7c7;
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
            max-height: 200px;
            overflow-y: auto;
        }
        .ui-timepicker {   
            width: auto !important;
        }
    </style>
    <div id="divScheduleInfo" style="min-height: 100vh">
        <fieldset>
            <label class="form-control-label p-l-0 bold m-b-1 push-up"><%=GetGlobalResourceObject("CreateSchedule_Resource", "addScheduleInformation")%></label>
        </fieldset>
        <div class="col-xs-12 col-lg-2 lside-box">
            <label class="form-control-label center-align bold"><%=GetGlobalResourceObject("CreateSchedule_Resource", "recurrencePattern")%></label>
            <div class="radio p-l-1">
                <label>
                    <input type="radio" name="frequency" data-bind="checked: Frequency" class="tiny-rightmargin" value="1" /><%=GetGlobalResourceObject("CreateSchedule_Resource", "hourly")%></label>
            </div>
            <div class="radio p-l-1">
                <label>
                    <input type="radio" name="frequency" data-bind="checked: Frequency" class="tiny-rightmargin" value="2" /><%=GetGlobalResourceObject("CreateSchedule_Resource", "daily")%></label>
            </div>
            <div class="radio p-l-1">
                <label>
                    <input type="radio" name="frequency" data-bind="checked: Frequency" class="tiny-rightmargin" value="3" /><%=GetGlobalResourceObject("CreateSchedule_Resource", "weekly")%></label>
            </div>
            <div class="radio p-l-1">
                <label>
                    <input type="radio" name="frequency" data-bind="checked: Frequency" class="tiny-rightmargin" value="4" /><%=GetGlobalResourceObject("CreateSchedule_Resource", "monthly")%></label>
            </div>
            <div class="radio p-l-1">
                <label>
                    <input type="radio" name="frequency" data-bind="checked: Frequency" class="tiny-rightmargin" value="5" /><%=GetGlobalResourceObject("CreateSchedule_Resource", "yearly")%></label>
            </div>
        </div>
        <div class="col-xs-12 col-lg-10 p-t-1 rside-box">
            <fieldset>
                <label class="pull-xs-left form-control-label"><%=GetGlobalResourceObject("CreateSchedule_Resource", "occursEvery")%></label>
                <input type="text" class="form-control-sm col-xs-3 col-lg-1" data-bind="value: Interval" maxlength="3" onkeypress="return isNumberKey(event)" />
                <label class="pull-xs-left form-control-label" data-bind="visible: IsHourly"><%=GetGlobalResourceObject("CreateSchedule_Resource", "hours")%></label>
                <label class="pull-xs-left form-control-label" data-bind="visible: IsDaily"><%=GetGlobalResourceObject("CreateSchedule_Resource", "days")%></label>
                <label class="pull-xs-left form-control-label" data-bind="visible: IsWeekly"><%=GetGlobalResourceObject("CreateSchedule_Resource", "weeks")%></label>
                <label class="pull-xs-left form-control-label" data-bind="visible: IsMonthly"><%=GetGlobalResourceObject("CreateSchedule_Resource", "months")%></label>
                <label class="pull-xs-left form-control-label" data-bind="visible: IsYearly"><%=GetGlobalResourceObject("CreateSchedule_Resource", "years")%></label>
            </fieldset>
            <fieldset data-bind="visible: IsWeekly">
                <label class="full-width gray bold form-control-label"><%=GetGlobalResourceObject("CreateSchedule_Resource", "selectDay")%></label>
                <div data-bind="foreach: WeekDay" class="btn-group tiny-padding p-y-0">
                    <button type="button" class="btn btn-sm" data-bind="text: Value, css: { 'btn-info': IsSelected, 'btn-default': IsSelected() == false }, click: function (data) { OnMultiSelectButton(data) }"></button>
                </div>
            </fieldset>
            <fieldset data-bind="visible: IsMonthly" class="medium-leftmargin push-down">
                <div class="radio p-l-1 pull-xs-left push-down">
                    <label class="pull-xs-left form-control-label p-l-0"><input type="radio" name="monthOption" value="1" data-bind="checked: MonthOption">
                    <%=GetGlobalResourceObject("CreateSchedule_Resource", "recurOnDays")%></label>
                </div>
                <div class="col-xs-12 btn-group" data-bind="foreach: MonthDay">
                    <button type="button" class="btn btn-mini btn-default" style="height:22px;" data-bind="text: Value, css: { 'btn-info': IsSelected, 'btn-default': IsSelected() == false }, click: function (data) { OnMultiSelectButton(data) }"></button>
                </div>
            </fieldset>
            <fieldset data-bind="visible: IsMonthly" class="medium-leftmargin heading-gap">
                <div class="radio p-l-1 pull-xs-left push-down">
                <label class="pull-xs-left form-control-label p-l-0">
                    <input type="radio" name="monthOption" value="2" data-bind="checked: MonthOption">
                    <%=GetGlobalResourceObject("CreateSchedule_Resource", "occursOnThe")%></label>
                </div>
                <div data-bind="template: { name: 'multiselect-dropdown-template', data: MonthPosition }"></div>
                <div data-bind="template: { name: 'multiselect-dropdown-template', data: WeekDay }"></div>
                <label class="pull-xs-left form-control-label"><%=GetGlobalResourceObject("CreateSchedule_Resource", "ofTheMonth")%></label>
            </fieldset>
            <fieldset data-bind="visible: IsYearly" class="medium-leftmargin heading-gap">
                <div class="radio p-l-1 pull-xs-left push-down">
                    <label class="pull-xs-left form-control-label p-l-0"><input type="radio" name="yearOption" value="1" data-bind="checked: YearOption">
                <%=GetGlobalResourceObject("CreateSchedule_Resource", "on")%></label>
                </div>
                <div data-bind="template: { name: 'multiselect-dropdown-template', data: YearMonth }"></div>
                <label class="col-xs-12 pull-xs-left form-control-label p-l-0"><%=GetGlobalResourceObject("CreateSchedule_Resource", "recurOnDays")%></label>
                <div class="col-xs-12 btn-group" data-bind="foreach: MonthDay">
                    <button type="button" class="btn btn-mini btn-default" style="height:22px;" data-bind="text: Value, css: { 'btn-info': IsSelected, 'btn-default': IsSelected() == false }, click: function (data) { OnMultiSelectButton(data) }"></button>
                </div>
            </fieldset>
            <fieldset data-bind="visible: IsYearly" class="medium-leftmargin heading-gap">
                <div class="radio p-l-1 pull-xs-left push-down">
                    <label class="pull-xs-left form-control-label p-l-0"><input type="radio" name="yearOption" value="2" data-bind="checked: YearOption">
                <%=GetGlobalResourceObject("CreateSchedule_Resource", "on")%></label>
                </div>
                <div data-bind="template: { name: 'multiselect-dropdown-template', data: MonthPosition }"></div>
                <div data-bind="template: { name: 'multiselect-dropdown-template', data: WeekDay }"></div>
                <label class="pull-xs-left form-control-label"><%=GetGlobalResourceObject("CreateSchedule_Resource", "of")%></label>
                <div data-bind="template: { name: 'multiselect-dropdown-template', data: YearMonth2 }"></div>
            </fieldset>
            <fieldset class="heading-gap-big bottom-gap" data-bind="visible: IsHourly() == false">
                <div class="inline tiny-leftmargin">
                    <label class="tiny-rightmargin">
                        <input type="radio" class="tiny-rightmargin" name="fixed" value="1" data-bind="checked: FixedOption, enable: MandateFixedOption() == false"><%=GetGlobalResourceObject("CreateSchedule_Resource", "fixed1")%>
                    </label>
                </div>
                <div class="inline tiny-leftmargin">
                    <label class="tiny-rightmargin">
                        <input type="radio" class="tiny-rightmargin" name="fixed" value="2" data-bind="checked: FixedOption, enable: MandateFixedOption() == false"><%=GetGlobalResourceObject("CreateSchedule_Resource", "basedOnLastPerformanceDate")%>
                    </label>
                </div>
            </fieldset>
            <fieldset id="divRangeOfRecurrence">
                <label class="full-width gray bold form-control-label"><%=GetGlobalResourceObject("CreateSchedule_Resource", "recurrencePattern")%></label>
                <label class="form-control-label pull-xs-left"><%=GetGlobalResourceObject("CreateSchedule_Resource", "startOn")%></label>
                <input type="text" class="datecontrol form-control-sm col-xs-12 col-lg-2 tiny-rightmargin" id="txtStartDate" />
                <input type="text" class="timecontrol form-control-sm col-xs-12 col-lg-1" id="txtStartTime" />
                <div class="pull-xs-left medium-leftmargin">
                    <fieldset>
                        <div class="radio p-l-1 pull-xs-left push-down">
                            <label class="pull-xs-left form-control-label p-l-0 label-large nomarginleft"><input type="radio" class="tiny-rightmargin" name="endOption" value="1" data-bind="checked: EndOption">
                            <%=GetGlobalResourceObject("CreateSchedule_Resource", "endAfter")%></label>
                        </div>
                        <input type="text" class="form-control-sm col-xs-12 col-lg-2 tiny-rightmargin" data-bind="value: EndNumOccurrence" maxlength="3" onkeypress="return isNumberKey(event)" onfocus="ChangeEndOption(true)"/>
                        <label class="pull-xs-left form-control-label p-l-0 rightmargin"><%=GetGlobalResourceObject("CreateSchedule_Resource", "occurrences")%></label>
                    </fieldset>
                    <fieldset>
                        <div class="radio p-l-1 pull-xs-left push-down">
                            <label class="pull-xs-left form-control-label p-l-0 label-large nomarginleft"><input type="radio" class="tiny-rightmargin" name="endOption" value="2" data-bind="checked: EndOption">
                            <%=GetGlobalResourceObject("CreateSchedule_Resource", "endBy")%></label>
                        </div>
                        <input type="text" class="datecontrol form-control-sm col-xs-12 col-lg-4" id="txtEndDate" onfocus="ChangeEndOption(false)" />
                    </fieldset>
                </div>
            </fieldset>
            <fieldset class="heading-gap">
                <label class="pull-xs-left form-control-label tiny-rightmargin"><%=GetGlobalResourceObject("CreateSchedule_Resource", "setReminderNotificationMail")%></label>
                <input type="text" class="form-control-sm col-xs-4 col-lg-1 tiny-rightmargin" data-bind="value: NotifyDay" maxlength="2" onkeypress="return isNumberKey(event)" />
                <label class="pull-xs-left form-control-label p-l-0" data-bind="visible: IsHourly() == false"><%=GetGlobalResourceObject("CreateSchedule_Resource", "daysBeforeNextSchedule")%></label>
                <label class="pull-xs-left form-control-label p-l-0" data-bind="visible: IsHourly"><%=GetGlobalResourceObject("CreateSchedule_Resource", "hoursBeforeNextSchedule")%></label>
            </fieldset>
            <fieldset>
                <div class="col-xs-12 col-lg-10">
                <button type="button" id="btnSaveScheduleInfo" runat="server" enableviewstate="false" class="btn btn-sm btn-success pull-xs-right"><%=GetGlobalResourceObject("CreateSchedule_Resource", "save")%></button>
                    </div>
            </fieldset>
            <fieldset>
                <span id="spnErrorMessage" class="text-danger"></span>
            </fieldset>
        </div>
        <script type="text/html" id="multiselect-dropdown-template">
            <div class="col-xs-1 p-a-0 tiny-leftmargin">
                <div class="functiondropdown cursor-pointer col-xs-12">
                    <label class="appendSelectedElements" data-bind="visible: ko.utils.arrayFirst($data, function (item) { return item.IsSelected(); }) ? false : true"><%=GetGlobalResourceObject("CreateSchedule_Resource", "select")%></label>
                    <i class="icontag fa big pull-xs-right fa-caret-down i-opacity"></i>
                    <label style="text-overflow: ellipsis;display: inline-block;width: 80%;white-space: nowrap;overflow: hidden !important;" class="existingLabel" data-bind="text: ko.utils.arrayFilter($data, function (item) { return item.IsSelected(); }).map(function (item) { return item['Value']; }).join(', ')"></label>
                </div>
                <div class="drpdownbody col-xs-12" style="margin-top: 36px;">
                    <div class="input-div" style="padding: 4px 0px 4px 4px !important;">
                        <input type="text" class="searchField form-control-sm col-xs-11" onkeyup="KeyUpEle(this);" placeholder="<%=GetGlobalResourceObject("CreateSchedule_Resource", "search")%>" style="height: 34px;">
                    </div>
                    <div class="divider-border"></div>
                    <ul class="p-x-0 ulField drpDownList pull-xs-left heading-gap col-xs-11 tiny-leftmargin m-b-0 scheduleTypeMultiSelect" data-bind="foreach: $data" onclick="ApplyCss(this)">
                        <li class="">
                            <span class="li col-xs-12" data-bind="css: { selectedlist: IsSelected }">
                                <input type="checkbox" class="tiny-leftmargin tiny_push-down pull-xs-left tiny-rightmargin" data-bind="checked: IsSelected" />
                                <label data-bind="text: Value"></label>
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </script>
    </div>
    <div class="small-popup">
        <div id="divErrorModal">
            <div>
                <p id="errorMessageText">
                </p>
            </div>
        </div>
    </div>
</asp:Content>