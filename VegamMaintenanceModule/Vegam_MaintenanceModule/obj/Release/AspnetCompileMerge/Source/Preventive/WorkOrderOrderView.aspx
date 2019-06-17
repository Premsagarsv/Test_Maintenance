﻿<%@ Page Title="" Language="C#" MasterPageFile="~/Vegam-Iframe.Master" AutoEventWireup="true" CodeBehind="WorkOrderOrderView.aspx.cs" Inherits="Vegam_MaintenanceModule.Preventive.WorkOrderOrderView" %>
<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/Vegam_DynamicGridControlScript_v26.js" type="text/javascript"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/Vegam_WorkOrderOrderView.js" type="text/javascript"></script>
    <link href="<%= ConfigurationManager.AppSettings["MaintCssPath"].TrimEnd('/') %>/Styles/proplan_v7.css" rel="stylesheet" type="text/css" />
     <style>
        .popover-content {
            background-color: #5f6973;
            color: #FFFFFF;
            padding: 2px;
            border-radius: 3px;
        }
        .popover-title {
            display: none;
        }
    </style>
     <script>
        $(document).ready(function () {
            $('[data-toggle="popover"]').popover();
            $('#popoverData').popover();
            $('.pover').popover({ trigger: "hover" });
        });
    </script>
    <asp:ScriptManager ID="scriptManager" runat="server" EnableViewState="false">
    </asp:ScriptManager>
    <input id="hdnPageSize" type="hidden" runat="server" enableviewstate="false" value="50" />
    <div class="col-xs-12 pro-plan push-down">
        <section id="divDynamicGridContent" runat="server" enableviewstate="false"></section>
    </div>
    <div class="pop-content" style="display: none;" id="divWorkGroupInfo">
        <div class="table-responsive">
            <table class="table table-bordered m-b-0">
                <tbody id="tbWorkGroupInfo" style="color: black">
                    <tr>
                        <th><%=GetGlobalResourceObject("WorkOrderCalendar_Resource", "assignedTo")%></th>
                        <td id="tdAssignedTo"></td>
                    </tr>
                    <tr>
                        <th><%=GetGlobalResourceObject("WorkOrderCalendar_Resource", "reportedTo")%></th>
                        <td id="tdReportedTo"></td>
                    </tr>
                </tbody>
            </table>
        </div>
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
