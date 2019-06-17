<%@ Page Title="" Language="C#" MasterPageFile="~/Vegam-Responsive.Master" AutoEventWireup="true" CodeBehind="ManageNotification.aspx.cs" Inherits="Vegam_MaintenanceModule.Preventive.ManageNotification" %>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <asp:ScriptManager ID="ScriptManager1" runat="server">
    </asp:ScriptManager>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/Vegam_DynamicGridControlScript_v26.js" type="text/javascript"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/iPAS_Pager.js"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/ajaxfileupload.js" type="text/javascript"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/Vegam_ManageNotification.js"></script>
    <link href="<%= ConfigurationManager.AppSettings["MaintCssPath"].TrimEnd('/') %>/Styles/proplan_v7.css" rel="stylesheet" type="text/css" />
    <style type="text/css">
       
        .popover-title {
            display: none;
        }

        .popover-content {
            background-color: #5f6973;
            color: #FFFFFF;
            padding: 2px;
            border-radius: 3px;
        }

        .add-btn {
            margin-top: -25px !important;
        }

        .td-red{
            color:white !important;
            background-color: #FA5C5B !important;
        }

        .td-orange{
            color:white !important;
            background-color: #FDA40F !important;
        }

        .td-blue{
            color:white !important;
            background-color: #3DB9EC !important;
        }

        .td-green{
            color:white !important;
            background-color: #00AA13 !important;
        }

         .td-navyBlue{
            color:white !important;
            background-color: #0275d8 !important;
        }
    </style>
    <input type="hidden" id="hdnPageSize" runat="server" enableviewstate="false" value="10" />
    <input type="hidden" id="hdnAccessRights" runat="server" enableviewstate="false" />
    <div class="col-xs-12 pro-plan push-down" id="divNotificationList">
        <div id="divDynamicGridContent" runat="server" enableviewstate="false"></div>
    </div>
    <div class="small-popup">
        <div id="alertModal">
            <div>
                <p id="alertMessage">
                </p>
            </div>
        </div>
    </div>
    <div class="pop-content hide">
        
    </div>
</asp:Content>

