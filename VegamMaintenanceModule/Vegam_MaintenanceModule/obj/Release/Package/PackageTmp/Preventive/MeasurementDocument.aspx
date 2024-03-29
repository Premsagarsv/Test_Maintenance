﻿<%@ Page Title="" Language="C#" MasterPageFile="~/Vegam-Responsive.Master" AutoEventWireup="true" CodeBehind="MeasurementDocument.aspx.cs" Inherits="Vegam_MaintenanceModule.Preventive.MeasurementDocument" %>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/Vegam_MeasurementDocument.js" type="text/javascript"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/select3.js"></script>
    <script type="text/javascript" src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/iPAS_Pager.js"></script>
    <link href="<%= ConfigurationManager.AppSettings["MaintCssPath"].TrimEnd('/') %>/Styles/proplan_v7.css" rel="stylesheet" type="text/css" />
    <link href="<%= ConfigurationManager.AppSettings["MaintCssPath"].TrimEnd('/') %>/Styles/select2.css" rel="stylesheet" type="text/css" />
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/vegam-multiselect-dropdown.js"></script>
    <link href="<%= ConfigurationManager.AppSettings["MaintCssPath"].TrimEnd('/') %>/Styles/vegam-multiselect-dropdown.css" rel="stylesheet" type="text/css" />
    <style>
        .pro-plan .dropdown-menu {
            min-width: 140px !important;
        }

        .img-border:nth-child(odd) {
            border-right: 1px solid #cdd2d2;
        }

        .img-border {
            border-bottom: 1px solid #cdd2d2;
        }

        .add-btn {
            margin-top: -25px !important
        }

        .addlabel {
            margin-top: -25px;
        }

        .info-block .addlabel {
            margin-top: 15px;
        }
        .li-disabled {
            pointer-events: none !important;
            opacity: 0.6 !important;
            cursor: default !important;
        }

        .rside-box {
            box-shadow: 0 0 10px 10px #f5f5f5;
            height: 70vh;
            padding-top: 2px;
            border: 1px solid #f3f1f1;
        }

        .lside-box {
            box-shadow: 0 0 10px 10px #f5f5f5;
            height: 70vh;
            border: 1px solid #f3f1f1;
        }

        .select2-container {
            z-index: 10;
            width: 100% !important
        }

        .shift-btn {
            padding: 2px !important;
            top: 50%;
            left: 48.7%;
            z-index: 9
        }

        @media (min-width: 1366px) {
            .shift-btn {
                padding: 5px !important;
                left: 48.9%;
            }
        }
        
        i[disabled] {
            color: gray !important;
            cursor: default !important;
        }
        .border-red{
            border-color:red !important
        }
        .process-step .btn:focus{outline:none}
        .process{display:table;width:100%;position:relative}
        .process-row{display:table-row}
        .process-step button[disabled]{opacity:1 !important;filter: alpha(opacity=100) !important}
        .process-row:before{top:20px;bottom:0;position:absolute;content:" ";width:100%;height:1px;background-color:#ccc;z-order:0}
        .process-step{display:table-cell;text-align:left;position:relative;width:30%;padding-left:25px}
        .process-step p{position:absolute;left:100px}
        .btn-circle{border-radius:50%;height:40px;width:40px}
        
        .tab-icon-disabled{
            pointer-events: none;
            opacity: 0.6;
        }
        
         #ulAvailFLoctionMultiSelect, #ulSelectFLoctionMultiSelect, #ulAvailEquipmentMultiSelect, #ulSelectEquipmentMultiSelect {
            border: 1px solid #c7c7c7;
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
            max-height: 200px;
            overflow-y: auto;
        }
    </style>

    <asp:ScriptManager ID="scriptManager" runat="server" EnableViewState="false">
    </asp:ScriptManager>
    <input id="hdnPageSize" type="hidden" runat="server" enableviewstate="false" value="10" />
    <input type="hidden" id="hdfAMSortValue" />
    <input type="hidden" id="hdfSMSortValue" />
    <div class="pro-plan col-xs-12" id="divMeasurementDocument">
        <section>            
            <div class="process push-up bottom-gap" id="divTabInfo">
                <div class="process-row nav nav-tabs">
                    <div class="process-step active in" id="divChecklistTab">
                        <p class="p-y-0 m-b-0"><a><%=GetGlobalResourceObject("MeasurementDocument_Resource", "basicInformation")%></a>
                            </p>
                        <button type="button" id="btnChecklist" class="btn btn-sm btn-circle btn-info" data-toggle="tab" href="#menu2"><i class="fa fa-file-text-o"></i></button>
                    </div>
                    <div class="process-step" id="divScheduleTab">
                        <p class="p-y-0 m-b-0"><a style="color:grey"><%=GetGlobalResourceObject("MeasurementDocument_Resource", "schedule")%></a>
                            </p>
                        <button type="button" id="btnScheduleInfo" class="btn btn-sm btn-circle btn-default tab-icon-disabled" data-toggle="tab" href="#menu3"><i class="fa fa-calendar"></i></button>
                    </div>                    
                    <div class="process-step" style="visibility:hidden">
                        <p class="p-y-0 m-b-0"><a></a>
                           </p>
                        <button type="button" id="btnMaintInfo" class="btn btn-sm btn-circle btn-info" data-toggle="tab" href="#menu1"><i class="fa fa-info"></i></button>
                    </div>
                </div>
            </div>
            <div id="divMeasurementInfo" class="row push-down">                
                <fieldset class="push-down p-l-1">
                    <label class="form-control-label pull-xs-left in-label"><%=GetGlobalResourceObject("MeasurementDocument_Resource", "checkListName")%></label>
                    <input type="text" maxlength="50" id="txtMeasDocName" data-bind="value: MeasurementDocName()" class="form-control-sm col-xs-12 col-lg-3">
                    <label class="form-control-label pull-xs-left"><%=GetGlobalResourceObject("MeasurementDocument_Resource", "workGroup")%></label>
                    <label class="form-control-label pull-xs-left font-mini in-label p-l-0"><%=GetGlobalResourceObject("MeasurementDocument_Resource", "selectWorkGgroup")%></label>
                    <div class="col-xs-12 col-lg-2 p-x-0 tiny-rightmargin">
                        <select id="ddlWorkGroup" class="form-control-sm Parameters-Select" onchange="ReloadMeasuringPoints(); return false;"
                            data-bind="options: WorkGroupList, optionsText: 'DisplayName', optionsValue: 'TypeValue', optionsCaption: 'Select'">
                        </select>
                    </div>
                    <asp:Button ID="btnAdd" btntype="add" Text="Add" CssClass="btn btn-sm btn-success tiny-rightmargin"
                        runat="server" EnableViewState="false" />
                    <div class="spinner-rectangle pull-xs-left" id="divProgress" style="display: none;">
                    </div>
                    <span class="text-danger medium-leftmargin font-small push-down" id="spnAddUpdateError"></span>
                    <button id="btnActivateSchedule" type="button" class="btn btn-sm btn-success pull-xs-right tiny-rightmargin" runat="server" enableviewstate="false" disabled="disabled"><%=GetGlobalResourceObject("MeasurementDocument_Resource", "release")%></button>
                    <span id="spnScheduleInProgress" class="text-info medium-leftmargin font-small pull-xs-right push-down hide"><%=GetGlobalResourceObject("MeasurementDocument_Resource", "scheduling")%></span>
                </fieldset>
                <div class="col-xs-12 col-lg-6">
                    <div class="lside-box push-down">
                        <label class="form-control-label tiny-leftmargin bold col-xs-12">
                            <%=GetGlobalResourceObject("MeasurementDocument_Resource", "availableMeasuringPoints")%>
                        </label>
                        <fieldset class="tiny-padding">
                            <legend class="search-legend cursor-pointer" id="legAvailableMeasPoints"><i class="fa fa-caret-right tiny-rightmargin"></i><%=GetGlobalResourceObject("MeasurementDocument_Resource", "defineSearchCriteria")%></legend>
                            <div class="hide">
                                <div class="row m-a-0">
                                    <div class="col-xs-12 col-lg-7 p-l-0">
                                        <label class="form-control-label col-xs-12 col-lg-4">
                                            <%=GetGlobalResourceObject("MeasurementDocument_Resource", "measuringPoint")%>
                                        </label>
                                        <input type="text" id="txtAMMeasPoint" maxlength="50" class="form-control-sm ol-xs-12 col-lg-8" />
                                    </div>
                                    <div class="col-xs-12 col-lg-5 p-l-0">
                                        <label class="form-control-label col-xs-12 col-lg-4">
                                            <%=GetGlobalResourceObject("MeasurementDocument_Resource", "category")%>
                                        </label>
                                        <div class="col-xs-12 col-lg-8 p-x-0">
                                            <select id="ddlAMCategory" class="form-control-sm Parameters-Select"
                                                data-bind="options: CategoryList, optionsText: 'MasterDataName', optionsValue: 'MasterDataID', optionsCaption: 'Select'">
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row m-a-0">
                                    <div class="col-xs-12 col-lg-7 p-l-0">
                                        <div class="functiondropdown cursor-pointer col-xs-12 tiny-leftmargin">
                                            <label class="appendSelectedElements"><%=GetGlobalResourceObject("MeasurementDocument_Resource", "functionalLocation")%></label>
                                            <i class="icontag fa big pull-xs-right fa-caret-down i-opacity"></i>
                                        </div>
                                        <div class="drpdownbody col-xs-12" style="margin-top: 36px;">
                                            <div class="input-div" style="padding: 4px 0px 4px 4px !important;">
                                                <input type="text" class="searchField form-control-sm col-xs-11" onkeyup="KeyUpEle(this);" placeholder="Search Functional Location" style="height: 34px;">
                                            </div>
                                            <div class="divider-border"></div>
                                            <ul id="ulAvailFLoctionMultiSelect" data-bind="template: { name: 'itemTmplAvail', foreach: FLocationList }" class="ulField drpDownList pull-xs-left heading-gap col-xs-11 tiny-leftmargin m-b-0" style="width: 95.6% !important" onclick="ApplyCss(this)">
                                            </ul>
                                            <script id="itemTmplAvail" type="text/html">
                                                <li data-bind="attr: { id: 'idlist_' + TypeValue }">
                                                    <span class="li col-xs-12">
                                                        <input type="checkbox" class="tiny-leftmargin tiny_push-down pull-xs-left tiny-rightmargin" data-bind="attr: { id: 'idCheckBox_' + TypeValue, value: TypeValue }" />
                                                        <label data-bind="text: DisplayName"></label>
                                                        <i class="fa fa-drop-icon fa-chevron-circle-down big pull-xs-right" data-bind="visible: Children.length > 0 ? true : false"></i>
                                                    </span>
                                                    <ul data-bind="template: { name: 'itemTmplAvail', foreach: Children }" class="ulField drpDownList col-xs-12 m-b-0">
                                                    </ul>
                                                </li>
                                            </script>
                                        </div>
                                    </div>
                                    <div class="col-xs-12 col-lg-5 p-l-0">
                                        <div class="functiondropdown cursor-pointer col-xs-12 tiny-leftmargin">
                                            <label class="appendSelectedElements"><%=GetGlobalResourceObject("MeasurementDocument_Resource", "equipment")%></label>
                                            <i class="icontag fa big pull-xs-right fa-caret-down i-opacity"></i>
                                        </div>
                                        <div class="drpdownbody col-xs-12" style="margin-top: 36px;">
                                            <div class="input-div" style="padding: 4px 0px 4px 4px !important;">
                                                <input type="text" class="searchField form-control-sm col-xs-11" onkeyup="KeyUpEle(this);" placeholder="Search Type" style="height: 34px;">
                                            </div>
                                            <div class="divider-border"></div>
                                            <ul id="ulAvailEquipmentMultiSelect" class="p-x-0 ulField drpDownList pull-xs-left heading-gap col-xs-11 tiny-leftmargin m-b-0" data-bind="foreach: AvailEquipmentList" onclick="ApplyCss(this)">
                                                <li data-bind="click: function () { SelectEquipmentInfo($data,true); }">
                                                    <span class="li col-xs-12">
                                                        <input type="checkbox" class="tiny-leftmargin tiny_push-down pull-xs-left tiny-rightmargin" />
                                                        <label data-bind="text: DisplayName"></label>
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xs-12 p-x-0 push-down">
                                    <span class="text-danger medium-leftmargin font-small pull-xs-left push-down" id="spnAvailMeasuringPointsSearchError"></span>
                                    <button id="btnShowAllAvailMeasuringPoints" class="btn-sm btn btn-primary hide pull-xs-right tiny-leftmargin" onclick="ShowAllAvailMeasuringPoints();return false;">
                                        <%=GetGlobalResourceObject("MeasurementDocument_Resource", "showAll")%>
                                    </button>
                                    <button id="btnSearchAvailMeasuringPoints" class="btn-sm btn btn-normal pull-xs-right" onclick="SearchAvailMeasuringPoints();return false;">
                                        <i class="fa fa-search"></i>
                                    </button>

                                </div>
                            </div>
                        </fieldset>
                        <div class="table-with-heading">
                            <div class="table-side-box-heading">
                                <span class="m-l-1"><%=GetGlobalResourceObject("MeasurementDocument_Resource", "listOfAailMeasPoint")%></span>
                            </div>
                            <div class="table-responsive">
                                <table class="table table-bordered" id="selTable">
                                    <thead>
                                        <tr>
                                            <th class="bg-graylight center-align">
                                                <%=GetGlobalResourceObject("MeasurementDocument_Resource", "action")%>
                                            </th>
                                            <th id="thAMMeasPoint" runat="server" enableviewstate="false" style="white-space: nowrap;" class="bg-graylight cursor-pointer center-align">
                                                <span class="underline">
                                                    <%=GetGlobalResourceObject("MeasurementDocument_Resource", "measuringPoint")%> 
                                                </span><i class="tiny-leftmargin cursor-pointer "></i>
                                            </th>
                                            <th id="thAMFLocName" runat="server" enableviewstate="false" style="white-space: nowrap;" class="bg-graylight cursor-pointer center-align">
                                                <span class="underline">
                                                    <%=GetGlobalResourceObject("MeasurementDocument_Resource", "functionalLocation")%> 
                                                </span><i class="tiny-leftmargin cursor-pointer "></i>
                                            </th>
                                            <th id="thAMEquipment" runat="server" enableviewstate="false" style="white-space: nowrap;" class="bg-graylight cursor-pointer center-align">
                                                <span class="underline">
                                                    <%=GetGlobalResourceObject("MeasurementDocument_Resource", "equipment")%> 
                                                </span><i class="tiny-leftmargin cursor-pointer "></i>
                                            </th>
                                            <th id="thAMCategory" runat="server" enableviewstate="false" style="white-space: nowrap;" class="bg-graylight cursor-pointer center-align">
                                                <span class="underline">
                                                    <%=GetGlobalResourceObject("MeasurementDocument_Resource", "category")%> 
                                                </span><i class="tiny-leftmargin cursor-pointer "></i>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody id="tbdAvailMeasPoint" class="tbodypositionfixed" runat="server" data-bind="foreach: AvailableMeasuringPointList">
                                        <tr>
                                            <td class="center-align">
                                                <input type="checkbox" onclick="SelectAvailableMeasuringPoint(this)" data-bind="disable: IsDisabled, attr: { 'style': IsDisabled ? 'cursor: not-allowed !important' : '' }" /></td>
                                            <td class="nowrap" data-bind="text: MeasuringPointName"></td>
                                            <td class="nowrap" data-bind="text: FunctionalLocation"></td>
                                            <td class="nowrap" data-bind="text: Equipment"></td>
                                            <td class="nowrap" data-bind="text: Category"></td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr data-bind="visible: LoadAMErrorMessageVisible">
                                            <td class="center-align" colspan="10">
                                                <span data-bind="text: LoadAMErrorMessage, attr: { class: LoadAMErrorMessageClass }"></span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colspan="10">
                                                <div data-bind="html: PagerContent" class="pagination text-md-center m-a-0 col-xs-12">
                                                </div>
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                                <div class="spinner-circle-big hide" id="divLoadAMProgressVisible"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <button data-bind="enable: IsMeasPointSelectable()" class="btn btn-sm btn-warning absolute shift-btn tiny-leftmargin" onclick="PushAvailMeasInSelectedMeasPoints();return false;">>></button>
                <div class="col-xs-12 col-lg-6">
                    <div class="rside-box push-down">
                        <label class="form-control-label tiny-leftmargin bold col-xs-12">
                            <%=GetGlobalResourceObject("MeasurementDocument_Resource", "selectedMeasuringPoints")%>
                        </label>
                        <fieldset class="tiny-padding">
                            <legend class="search-legend cursor-pointer" id="legSelectedMeasPoints"><i class="fa fa-caret-right tiny-rightmargin"></i><%=GetGlobalResourceObject("MeasurementDocument_Resource", "defineSearchCriteria")%></legend>
                            <div class="hide">
                                <div class="row m-a-0">
                                    <div class="col-xs-12 col-lg-7 p-l-0">
                                        <label class="form-control-label col-xs-12 col-lg-4">
                                            <%=GetGlobalResourceObject("MeasurementDocument_Resource", "measuringPoint")%>
                                        </label>
                                        <input type="text" id="txtSMMeasPoint" maxlength="50" class="form-control-sm col-xs-12 col-lg-8 p-x-0" />
                                    </div>
                                    <div class="col-xs-12 col-lg-5 p-l-0">
                                        <label class="form-control-label col-xs-12 col-lg-4">
                                            <%=GetGlobalResourceObject("MeasurementDocument_Resource", "category")%>
                                        </label>
                                        <div class="col-xs-12 col-lg-8 p-x-0">
                                            <select id="ddlSMCategory" class="form-control-sm Parameters-Select"
                                                data-bind="options: CategoryList, optionsText: 'MasterDataName', optionsValue: 'MasterDataID', optionsCaption: 'Select'">
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row m-a-0">
                                    <div class="col-xs-12 col-lg-7 p-l-0">
                                        <div class="functiondropdown cursor-pointer col-xs-12 tiny-leftmargin">
                                            <label class="appendSelectedElements"><%=GetGlobalResourceObject("MeasurementDocument_Resource", "functionalLocation")%></label>
                                            <i class="icontag fa big pull-xs-right fa-caret-down i-opacity"></i>
                                        </div>
                                        <div class="drpdownbody col-xs-12" style="margin-top: 36px;">
                                            <div class="input-div" style="padding: 4px 0px 4px 4px !important;">
                                                <input type="text" class="searchField form-control-sm col-xs-11" onkeyup="KeyUpEle(this);" placeholder="Search Functional Location" style="height: 34px;">
                                            </div>
                                            <div class="divider-border"></div>
                                            <ul id="ulSelectFLoctionMultiSelect" data-bind="template: { name: 'itemTmplSel', foreach: FLocationList }" class="ulField drpDownList pull-xs-left heading-gap col-xs-11 tiny-leftmargin m-b-0" style="width: 95.6% !important" onclick="ApplyCss(this)">
                                            </ul>
                                            <script id="itemTmplSel" type="text/html">
                                                <li data-bind="attr: { id: 'idlist_' + TypeValue }">
                                                    <span class="li col-xs-12">
                                                        <input type="checkbox" class="tiny-leftmargin tiny_push-down pull-xs-left tiny-rightmargin" data-bind="attr: { id: 'idCheckBox_' + TypeValue, value: TypeValue }" />
                                                        <label data-bind="text: DisplayName"></label>
                                                        <i class="fa fa-drop-icon fa-chevron-circle-down big pull-xs-right" data-bind="visible: Children.length > 0 ? true : false"></i>
                                                    </span>
                                                    <ul data-bind="template: { name: 'itemTmplSel', foreach: Children }" class="ulField drpDownList col-xs-12 m-b-0">
                                                    </ul>
                                                </li>
                                            </script>
                                        </div>
                                    </div>
                                    <div class="col-xs-12 col-lg-5 p-l-0">
                                        <div class="functiondropdown cursor-pointer col-xs-12 tiny-leftmargin">
                                            <label class="appendSelectedElements"><%=GetGlobalResourceObject("MeasurementDocument_Resource", "equipment")%></label>
                                            <i class="icontag fa big pull-xs-right fa-caret-down i-opacity"></i>
                                        </div>
                                        <div class="drpdownbody col-xs-12" style="margin-top: 36px;">
                                            <div class="input-div" style="padding: 4px 0px 4px 4px !important;">
                                                <input type="text" class="searchField form-control-sm col-xs-11" onkeyup="KeyUpEle(this);" placeholder="Search Type" style="height: 34px;">
                                            </div>
                                            <div class="divider-border"></div>
                                            <ul id="ulSelectEquipmentMultiSelect" class="p-x-0 ulField drpDownList pull-xs-left heading-gap col-xs-11 tiny-leftmargin m-b-0" data-bind="foreach: SelectedEquipmentList" onclick="ApplyCss(this)">
                                                <li data-bind="click: function () { SelectEquipmentInfo($data, false); }">
                                                    <span class="li col-xs-12">
                                                        <input type="checkbox" class="tiny-leftmargin tiny_push-down pull-xs-left tiny-rightmargin" />
                                                        <label data-bind="text: DisplayName"></label>
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xs-12 p-x-0 push-down">
                                    <span class="text-danger medium-leftmargin font-small pull-xs-left push-down" id="spnSelectedMeasuringPointsSearchError"></span>
                                    <button id="btnShowAllSelectedMeasuringPoints" class="btn-sm btn btn-primary hide pull-xs-right tiny-leftmargin" onclick="ShowAllSelectedMeasuringPoints();return false;">
                                        <%=GetGlobalResourceObject("MeasurementDocument_Resource", "showAll")%>
                                    </button>
                                    <button id="btnSearchSelectedMeasuringPoints" class="btn-sm btn btn-normal pull-xs-right" onclick="SearchSelectedMeasuringPoints();return false;">
                                        <i class="fa fa-search"></i>
                                    </button>

                                </div>
                            </div>
                        </fieldset>
                        <div class="table-with-heading">
                            <div class="table-side-box-heading">
                                <span class="m-l-1"><%=GetGlobalResourceObject("MeasurementDocument_Resource", "listOfSelectedMeasPoint")%></span>
                            </div>
                            <div class="table-responsive">
                                <table class="table table-bordered m-b-0" id="tblHead">
                                    <thead>
                                        <tr>
                                            <th class="bg-graylight center-align" style="width: 10%">
                                                <%=GetGlobalResourceObject("MeasurementDocument_Resource", "action")%>
                                            </th>
                                            <th id="thSMMeasPoint" runat="server" enableviewstate="false" style="width: 30%" class="cursor-pointer center-align">
                                                <span class="underline">
                                                    <%=GetGlobalResourceObject("MeasurementDocument_Resource", "measuringPoint")%> 
                                                </span><i class="tiny-leftmargin cursor-pointer "></i>
                                            </th>
                                            <th id="thSMFLocName" runat="server" enableviewstate="false" style="width: 20%" class="cursor-pointer center-align">
                                                <span class="underline">
                                                    <%=GetGlobalResourceObject("MeasurementDocument_Resource", "functionalLocation")%> 
                                                </span><i class="tiny-leftmargin cursor-pointer "></i>
                                            </th>
                                            <th id="thSMEquipment" runat="server" enableviewstate="false" style="width: 20%" class="cursor-pointer center-align">
                                                <span class="underline">
                                                    <%=GetGlobalResourceObject("MeasurementDocument_Resource", "equipment")%> 
                                                </span><i class="tiny-leftmargin cursor-pointer "></i>
                                            </th>
                                            <th id="thSMCategory" runat="server" enableviewstate="false" style="width: 20%" class="cursor-pointer center-align">
                                                <span class="underline">
                                                    <%=GetGlobalResourceObject("MeasurementDocument_Resource", "category")%> 
                                                </span><i class="tiny-leftmargin cursor-pointer "></i>
                                            </th>
                                        </tr>
                                    </thead>
                                </table>
                                <div id="tblBody" style="overflow: auto;">
                                    <table class="table table-bordered">
                                        <tbody id="tbdSelectedMeasPoint" class="tbodypositionfixed" runat="server" data-bind="foreach: SelectedMeasuringPointList">
                                            <tr>
                                                <td class="center-align" style="width: 10%">
                                                    <i class="fa fa-trash-o text-danger v-icon cursor-pointer tiny-rightmargin" data-bind="attr: { id: 'iconEdit_' + MeasuringPointID }, click: $root.HasDeleteAccess ? function () { DeleteSelectedMeasuringPointClick(MeasuringPointID); } : '', attr: BindIconAttributes($root.HasDeleteAccess)" title="Delete"></i>
                                                </td>
                                                <td data-bind="text: MeasuringPointName" style="width: 30%"></td>
                                                <td data-bind="text: FunctionalLocation" style="width: 20%"></td>
                                                <td data-bind="text: Equipment" style="width: 20%"></td>
                                                <td data-bind="text: Category" style="width: 20%"></td>
                                            </tr>
                                        </tbody>
                                        <tfoot>
                                            <tr data-bind="visible: LoadSMErrorMessageVisible">
                                                <td class="center-align" colspan="10">
                                                    <span data-bind="text: LoadSMErrorMessage, attr: { class: LoadSMErrorMessageClass }"></span>
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                                <div class="spinner-circle-big hide" id="divLoadSMProgressVisible"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="divScheduleInfo" style="display: none;">
                <iframe id="iFrameScheduleInfo" width="100%" style="min-height: 100vh; border: 0;" scrolling="no"></iframe>
            </div>
        </section>

    </div>
    <div class="small-popup">
        <div id="confirmModal" style="z-index: 5000">
            <div>
                <p id="alertMessage">
                </p>
            </div>
        </div>
    </div>

</asp:Content>
