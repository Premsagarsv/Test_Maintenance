<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ManageWorkOrder.aspx.cs" Inherits="Vegam_MaintenanceModule.Preventive.ManageWorkOrder" MasterPageFile="~/Vegam-Responsive.Master" %>

<asp:Content ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <script type="text/javascript" src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/knockout-3.4.2.js"></script>
    <script type="text/javascript" src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/Vegam_ManageWorkOrder.js"></script>
    <script type="text/javascript" src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/Vegam_DynamicGridControlScript_v26.js"></script>
    <script type="text/javascript" src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/iPAS_Pager.js"></script>
    <link href="<%= ConfigurationManager.AppSettings["MaintCssPath"].TrimEnd('/') %>/Styles/proplan_v7.css" rel="stylesheet" type="text/css" />
    <style>
        .popover-title {
            display: none;
        }

        .popover-content {
            background-color: #5f6973;
            color: #FFFFFF;
            padding: 2px;
            border-radius: 3px;
        }
    </style>
     <script>
         jQuery(document).ready(function () {
             jQuery('[data-toggle="popover"]').popover();
             jQuery('#popoverData').popover();
             jQuery('.pover').popover({ trigger: "hover" });
         });
    </script>
    <asp:ScriptManager ID="ScriptManager1" runat="server" EnableViewState="false">
    </asp:ScriptManager>
    <input id="hdnPageSize" type="hidden" runat="server" enableviewstate="false" value="10" />
    <div class="col-xs-12 pro-plan">
        <div class="col-xs-12" dynamicgridctl="true" id="divDynamicGridContent" runat="server" enableviewstate="false"></div>
    </div>
    <div class="pop-content" style="display: none;" id="divWorkGroupInfo">
        <div class="table-responsive">
            <table class="table table-bordered m-b-0">
                <tbody id="tbWorkGroupInfo" style="color: black">
                    <tr data-bind="visible: AssigneeUserName().length > 0">
                        <th><%=GetGlobalResourceObject("ManageWorkOrder_Resource", "assignee")%></th>
                        <td data-bind="text: AssigneeUserName"></td>       
                    </tr>
                    <tr data-bind="visible: ReportToUserName().length > 0">
                        <th><%=GetGlobalResourceObject("ManageWorkOrder_Resource", "reportTo")%></th>
                        <td data-bind="text: ReportToUserName"></td>       
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="small-popup">
        <div id="confirmModal">
            <div>
                <p id="alertMessage">
                </p>
            </div>
        </div>
    </div>
</asp:Content>
