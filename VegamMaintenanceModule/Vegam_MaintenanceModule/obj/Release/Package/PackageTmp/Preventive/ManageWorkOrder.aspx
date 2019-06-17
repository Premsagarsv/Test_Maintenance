<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ManageWorkOrder.aspx.cs" Inherits="Vegam_MaintenanceModule.Preventive.ManageWorkOrder" MasterPageFile="~/Vegam-Responsive.Master" %>

<asp:Content ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <script type="text/javascript" src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/jquery.ui.timepicker.js"></script>
    <script type="text/javascript" src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/knockout-3.4.2.js"></script>
    <script type="text/javascript" src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/Vegam_ManageWorkOrder.js"></script>
    <script type="text/javascript" src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/Vegam_DynamicGridControlScript_v26.js"></script>
    <script type="text/javascript" src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/iPAS_Pager.js"></script>
    <script type="text/javascript" src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/moment.min.js"></script>
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
        .ui-timepicker {   
            width: auto !important;
        }

       .td-grey{
            color:white !important;
            background-color:#b0b0b0 !important;
        }

        .td-orange{
            color:white !important;
            background-color: #FDA40F !important;
        }

        .td-blue{
            color:white !important;
            background-color: #3DB9EC !important;
        }      

        .td-navyBlue{
            color:white !important;
            background-color: #0275d8 !important;
        }

         .td-lightGreen{
            color:white !important;
            background-color: #32CD32 !important;
        }

          .td-green{
            color:white !important;
            background-color: #00AA13 !important;
        }

          .td-red{
            color:white !important;
            background-color: #FA5C5B !important;
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
                        <td style="white-space:normal" data-bind="text: AssigneeUserName"></td>       
                    </tr>
                    <tr data-bind="visible: ReportToUserName().length > 0">
                        <th class="nowrap"><%=GetGlobalResourceObject("ManageWorkOrder_Resource", "reportTo")%></th>
                        <td style="white-space:normal" data-bind="text: ReportToUserName"></td>       
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
    <div id="divUpdateStartTimeModal" class="modal fade" data-backdrop="static" role="dialog" aria-hidden="true"  tabindex="-1" >
        <div class="modal-dialog" style="margin-top: 10%; width: 350px;">
            <div class="modal-content">
                <div class="modal-header p-b-0">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h6><%=GetGlobalResourceObject("ManageWorkOrder_Resource", "updateScheduleDateTime")%></h6>
                </div>
                <div class="modal-body p-t-0">
                     <fieldset class="heading-gap">
                        <label class="form-control-label pull-xs-left"><%=GetGlobalResourceObject("ManageWorkOrder_Resource", "scheduleDate")%></label>
                         <input id="txtScheduleDate" type="text" class="datecontrol form-control-sm cursor-pointer col-xs-12 col-lg-3 no-rightborder-radius font-small tiny-rightmargin" maxlength="10" readonly/>
                    </fieldset>
                    <fieldset class="heading-gap">
                        <label class="form-control-label pull-xs-left"><%=GetGlobalResourceObject("ManageWorkOrder_Resource", "scheduleTime")%></label>
                         <input id="txtScheduleTime" type="text" class="timecontrol form-control-sm cursor-pointer col-xs-12 col-lg-3" maxlength="12"/>
                    </fieldset>
                    <p id="spnUpdateStartTimeModalErrorMessage" class="red m-b-0"></p>
                </div>
                <div class="modal-footer">
                    <div class="pull-xs-right">
                        <a id="btnUpdateStartTime" class="btn btn-success btn-sm"><%=GetGlobalResourceObject("ManageWorkOrder_Resource", "update")%></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
