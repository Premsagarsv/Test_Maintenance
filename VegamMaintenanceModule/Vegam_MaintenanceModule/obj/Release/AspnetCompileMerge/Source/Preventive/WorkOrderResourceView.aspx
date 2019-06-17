<%@ Page Title="" Language="C#" MasterPageFile="~/Vegam-Iframe.Master" AutoEventWireup="true" CodeBehind="WorkOrderResourceView.aspx.cs" Inherits="Vegam_MaintenanceModule.Preventive.WorkOrderResourceView" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <link rel="Stylesheet" type="text/css" href="<%= ConfigurationManager.AppSettings["MaintCssPath"].TrimEnd('/') %>/Styles/dhtmlxscheduler.css" />
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/dhtmlxscheduler.js" type="text/javascript"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/dhtmlxscheduler_timeline.js" type="text/javascript"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/dhtmlxscheduler_tooltip.js" type="text/javascript"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/Vegam_WorkOrderResourceView.js" type="text/javascript"></script>   
    <style>
         .dhx_matrix_line {
            border-bottom: 1px solid #CECECE !important;
            height: auto !important;
        }

        .dhx_cal_data {
            height: 75vh !important;
        }

         .dhx_cal_date {
            display: none;
        }

        .dhx_cal_header {
            top: 0px !important;
        }

        .dhx_cal_data {
            top: 21px !important;
            
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
        .bg-green {
            background: #228B22 !important;
            color: black;
            font-weight: bold;
            /*height: 25px !important*/
        }
        #viewMonthCalendar .ui-datepicker-inline {
            position:absolute
        } 
        .popover-title{
            display:none
        }
        .popover-content{
            max-height:250px;
            overflow-y:auto;
            overflow-x:hidden;
            width:140px;
        }
        .popover-content li{
            list-style-type:none
        }
    </style>
    <asp:ScriptManager ID="scriptManager" runat="server" EnableViewState="false">
    </asp:ScriptManager>
    <div id="divScheduler" class="col-xs-12 nopadding push-down center-align bold">
        <div id="divTimelineProgress" class="spinner-circle-big" style="z-index: 99999"></div>
        <fieldset>
            <label class="form-control-label pull-xs-left"><%=GetGlobalResourceObject("WorkOrderCalendar_Resource", "location")%></label>
        <select id="drpLocation" onchange="javascript:LocationChange();return false;" class="form-control-sm pull-xs-left medium-rightmargin">            
        </select>
             <label id="lblEqipment" class="form-control-label pull-xs-left hide"><%=GetGlobalResourceObject("WorkOrderCalendar_Resource", "equipment")%></label>
        <select id="drpEquipment" onchange="javascript:EquipmentOnChange();return false;" class="form-control-sm pull-xs-left hide">            
        </select>
        <span id="viewMonthCalendar" class="fa fa-calendar blue font-bigger cursor-pointer "></span>
        <span id="headerText" class="blue"></span>
            </fieldset>
        <div id="scheduler_here" class="dhx_cal_container" style="min-height: 115px; border: 1px solid #CECECE; border-top: none !important; margin-bottom: 10px;">
            <div class="dhx_cal_navline">
                <div class="dhx_cal_date push-up hide">
                </div>
            </div>
            <div class="dhx_cal_header">
            </div>
            <div class="dhx_cal_data" style="margin-top: 0px; position: relative; margin-bottom: 30px;">
            </div>
        </div>

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
