<%@ Page Title="" Language="C#" MasterPageFile="~/Vegam-Iframe.Master" AutoEventWireup="true" CodeBehind="WorkOrderResourceView.aspx.cs" Inherits="Vegam_MaintenanceModule.Preventive.WorkOrderResourceView" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <link rel="Stylesheet" type="text/css" href="<%= ConfigurationManager.AppSettings["MaintCssPath"].TrimEnd('/') %>/Styles/dhtmlxscheduler.css" />
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/dhtmlxscheduler.js" type="text/javascript"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/dhtmlxscheduler_timeline.js" type="text/javascript"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/dhtmlxscheduler_tooltip.js" type="text/javascript"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/Vegam_WorkOrderResourceView.js" type="text/javascript"></script>   
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/vegam-multiselect-dropdown.js"></script>
    <link href="<%= ConfigurationManager.AppSettings["MaintCssPath"].TrimEnd('/') %>/Styles/vegam-multiselect-dropdown.css" rel="stylesheet" type="text/css" />
       <script type="text/javascript" src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/iPAS_Pager.js"></script>
    <style>
         .dhtmlXTooltip::-webkit-scrollbar {
            width: 8px;
            height: 10px;
        }

        .dhtmlXTooltip::-webkit-scrollbar-track {
            -webkit-box-shadow: inset -2px -1px 10px 0px rgba(0,0,0,0.3);
            -webkit-border-radius: 50px;
            border-radius: 5px;
        }

        .dhtmlXTooltip::-webkit-scrollbar-thumb {
            -webkit-border-radius: 10px;
            border-radius: 10px;
            background: #E3E3E3;
            -webkit-box-shadow: inset -2px -1px 10px 0px rgba(0,0,0,0.5);
        }

        .dhtmlXTooltip::-webkit-scrollbar-thumb:window-inactive {
            background: #CECECE;
        }

        .dhtmlXTooltip {
            max-height: 50vh;
            overflow: auto;
        }
        .back_primary_circle{
           background: white;
    color: #484848;
    border-radius: 100%;
    margin: 6px 2px 2px -3px;
    position: absolute;
    width: 17px;
    height: 17px;
    padding-top: 0px;
    font-size: 11px;
    text-align:center;
        }
         .dhx_matrix_line {
            height: auto !important;
        }
    .dhx_matrix_scell{
        font-weight: lighter;
    text-align: left;
    padding-left: 15px;
    }
        .dhx_cal_data {
            height: 75vh !important;
            top: 21px !important;
        }

         .dhx_cal_date {
            display: none;
        }

        .dhx_cal_header {
            top: 0px !important;
        }       
         .dhx_scale_bar {
            font: 14px/13px Arial;
            font-weight: bold;
        }

        .dhx_cal_container {
            font-size: 10pt;
            font-weight: bold;
        }

        .dhx_cal_navline {
            height: 22px !important;
        }
        #viewMonthCalendar .ui-datepicker-inline {
            position:absolute
        } 
        .popover-title{
            display:none
        }
        /*.popover-content{
            max-height:250px;
            overflow-y:auto;
            overflow-x:hidden;
            width:auto;
        }*/
        .popover-content li{
            list-style-type:none
        }
        td:first-child.dhx_matrix_scell{
            background:#f5f4f4;
        }
         .drpDownList {
            border-top-left-radius: 0px;
            border-top-right-radius: 0px;
        }

        #ulFLoctionMultiSelect, #ulEquipMultiSelect {
            border: 1px solid #c7c7c7;
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
            max-height: 200px;
            overflow-y: auto;
        }
        @media only screen and (min-width: 1400px) {
  .dhx_cal_data {
            height: 85vh !important;            
        }
}
    </style>
    <script>
        $(document).ready(function () {
            jQuery('[data-toggle="popover"]').popover();
            jQuery('#popoverData').popover();
            jQuery('.pover').popover({ trigger: "hover" });
            $('#ulFLoctionMultiSelect').find('.ulField').hide();                    
        });
    </script>
    <asp:ScriptManager ID="scriptManager" runat="server" EnableViewState="false">
    </asp:ScriptManager>
    <div id="divScheduler" class="col-xs-12 nopadding push-down bold">
        <div id="divTimelineProgress" class="spinner-circle-big" style="z-index: 99999"></div>     
         <div id="divid" class="col-xs-12 bottom-gap p-l-0">
            <div  class="col-xs-2 p-a-0">
                <div class="functiondropdown cursor-pointer col-xs-11">
                    <label class="appendSelectedElements"><%=GetGlobalResourceObject("WorkOrderCalendar_Resource", "location")%></label>
                    <i class="icontag fa big pull-xs-right fa-caret-down i-opacity"></i>
                </div>
                <div class="drpdownbody col-xs-12" style="margin-top: 36px;">
                    <div class="input-div" style="padding: 4px 0px 4px 4px !important;">
                        <input type="text" class="searchField form-control-sm col-xs-11" onkeyup="KeyUpEle(this);" placeholder="Search Functional Location" style="height: 34px;">
                    </div>
                    <div class="divider-border"></div>
                    <ul id="ulFLoctionMultiSelect" data-bind="template: { name: 'itemTmpl', foreach: FunctionalLocationFilterArray }" class="workOrderResource_dropdown ulField drpDownList pull-xs-left heading-gap col-xs-11 tiny-leftmargin m-b-0" style="width: 95.6% !important" onclick="ApplyCss(this)">
                    </ul>
                    <script id="itemTmpl" type="text/html">
                        <li data-bind="attr: { id: 'idlist_' + TypeValue }">
                            <span class="li col-xs-12" onclick="WorkOrderResourceViewCustom()">
                                <input type="checkbox" class="tiny-leftmargin tiny_push-down pull-xs-left tiny-rightmargin" data-bind="attr: { id: 'idCheckBox_' + TypeValue, value: TypeValue }"  onclick="WorkOrderResourceViewCustom()"/>
                                <label data-bind="text: DisplayName"></label>
                                <i class="fa fa-drop-icon fa-chevron-circle-down big pull-xs-right" data-bind="visible: Children.length > 0 ? true : false"></i>
                            </span>
                            <ul data-bind="template: { name: 'itemTmpl', foreach: Children }" class="ulField drpDownList col-xs-12 m-b-0">
                            </ul>
                        </li>
                    </script>
                </div>               
            </div>
             <div class="col-xs-2 p-a-0" id="divEquipment">
                  <div class="functiondropdown cursor-pointer col-xs-11">
                    <label class="appendSelectedElements"><%=GetGlobalResourceObject("WorkOrderCalendar_Resource", "equipment")%></label>
                    <i class="icontag fa big pull-xs-right fa-caret-down i-opacity"></i>
                </div>
                <div class="drpdownbody col-xs-12" style="margin-top: 36px;">
                    <div class="input-div" style="padding: 4px 0px 4px 4px !important;">
                        <input type="text" class="searchField form-control-sm col-xs-11" onkeyup="KeyUpEle(this);" placeholder="Search Equipment" style="height: 34px;">
                    </div>
                    <div class="divider-border"></div>
                    <ul id="ulEquipMultiSelect" data-bind="template: { name: 'itemTmpl2', foreach: EquipmentFilterArray }" class="workOrderResource_dropdown ulField drpDownList pull-xs-left heading-gap col-xs-11 tiny-leftmargin m-b-0" style="width: 95.6% !important" onclick="ApplyCss(this)">
                    </ul>
                    <script id="itemTmpl2" type="text/html">
                        <li data-bind="attr: { id: 'idlist_' + TypeValue }">
                            <span class="li col-xs-12">
                                <input type="checkbox" class="tiny-leftmargin tiny_push-down pull-xs-left tiny-rightmargin" data-bind="attr: { id: 'idCheckBox_' + TypeValue, value: TypeValue }" />
                                <label data-bind="text: DisplayName"></label>
                                <i class="fa fa-drop-icon fa-chevron-circle-down big pull-xs-right" data-bind="visible: Children.length > 0 ? true : false"></i>
                            </span>
                            <ul data-bind="template: { name: 'itemTmpl2', foreach: Children }" class="ulField drpDownList col-xs-12 m-b-0">
                            </ul>
                        </li>
                    </script>
                </div>
             </div>
             <button class="btn-sm btn btn-normal bottom-gap tiny-leftmargin pull-xs-left" onclick="SearchFuncLocOrEquipment();return false;">
                 <i class="fa fa-search"></i>
             </button>
             <p class="text-danger font-small pull-xs-left tiny-leftmargin push-down" id="spnSearchError"></p>
            <div class="center-align pull-xs-left m-l-3">
                <span id="viewMonthCalendar" class="fa fa-calendar blue font-bigger cursor-pointer "></span>
                <span id="headerText" class="blue"></span>
            </div>
        </div>
        <div id="divNoSelection" class="center-align text-danger clear headin-gap">           
        </div>
        <div id="scheduler_here" class="dhx_cal_container" style="min-height: 115px; border: 1px solid #CECECE; border-top: none !important; margin-bottom: 10px;">
            <div class="dhx_cal_navline">
                <div class="dhx_cal_date push-up hide">
                </div>
            </div>
            <div class="dhx_cal_header">
            </div>
            <div class="dhx_cal_data" style="margin-top: 0px; position: relative;">
            </div>
        </div>
          <div data-bind="html: PagerContent" class="pagination text-md-center m-a-0 col-xs-12">
          </div>  
          <input type="hidden" runat="server" enableviewstate="false" value="5" id="hdnResourceViewPageSize" />
    </div>
    <div id="popover_content_wrapper" style="display: none">
        <div class="title" style="display:none"></div>
        <div id="divPopOverContent" class="content"></div>
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
