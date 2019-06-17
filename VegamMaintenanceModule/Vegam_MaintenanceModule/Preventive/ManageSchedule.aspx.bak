<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ManageSchedule.aspx.cs" Inherits="Vegam_MaintenanceModule.Preventive.ManageSchedule" MasterPageFile="~/Vegam-Responsive.Master" %>

<asp:Content ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <script type="text/javascript" src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/knockout-3.4.2.js"></script>
    <script type="text/javascript" src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/Vegam_ManageSchedule.js"></script>
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

        th:first-child {
            max-width: 70px;
        }

        td:first-child {
            max-width: 70px;
            min-width: 70px !important;
        }
        .popover{
            z-index:10050;
        }
    </style>
    <asp:ScriptManager ID="ScriptManager1" runat="server" EnableViewState="false">
    </asp:ScriptManager>
    <input id="hdnPageSize" type="hidden" runat="server" enableviewstate="false" value="10" />
    <input id="hdnWorkOrderPageSize" type="hidden" runat="server" enableviewstate="false" value="8" />
    <div class="col-xs-12 pro-plan">
        <div class="col-xs-12" dynamicgridctl="true" id="divDynamicGridContent" runat="server" enableviewstate="false"></div>
    </div>
    <div class="pop-content" style="display: none;" id="divWorkGroupInfo">
        <div class="table-responsive">
            <table class="table table-bordered m-b-0">
                <tbody id="tbWorkGroupInfo" style="color: black">
                    <tr data-bind="visible: AssigneeUserName().length > 0">
                        <th><%=GetGlobalResourceObject("ManageSchedule_Resource", "assignee")%></th>
                        <td data-bind="text: AssigneeUserName"></td>       
                    </tr>
                    <tr data-bind="visible: ReportToUserName().length > 0">
                        <th><%=GetGlobalResourceObject("ManageSchedule_Resource", "reportTo")%></th>
                        <td data-bind="text: ReportToUserName"></td>       
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div id="divWorkOrderDetailModal" data-backdrop="static" role="dialog" class="modal fade pro-plan" aria-hidden="true" style="overflow-y:hidden !important;">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h5><%=GetGlobalResourceObject("ManageSchedule_Resource", "listOfWorkOrders")%>
                    </h5>
                </div>
                <div class="modal-body" style="min-height: 190px; overflow: hidden;">
                    <fieldset class="info-block bottom-gap">
                        <legend class="search-legend cursor-pointer" id="legSearchCriteria"><i class="fa fa-caret-down tiny-rightmargin"></i><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "defineSearchCriteria")%></legend>
                        <div class="push-up">
                            <label class="pull-xs-left form-control-sm push-down">
                                <%=GetGlobalResourceObject("ManageSchedule_Resource", "status")%>
                            </label>
                            <select class="form-control-sm pull-xs-left" data-bind="options: WorkOrderStatusList, optionsText: 'DisplayName', optionsValue: 'TypeValue', value: SelectedWorkOrderStatus, optionsCaption: '<%=GetGlobalResourceObject("ManageSchedule_Resource", "select")%>'"></select>
                            <button type="button" id="btnSearch" class="btn-sm btn btn-normal  bottom-gap  tiny-leftmargin pull-xs-left" onclick="SearchWorkOrderInfo();return false;">
                                <i class="fa fa-search"></i>
                            </button>
                            <button type="button" id="btnShowAll" class="btn-sm btn btn-primary pull-xs-left  tiny-leftmargin" onclick="ShowAllWorkOrderInfo();return false;">
                                <%=GetGlobalResourceObject("ManageSchedule_Resource", "showAll")%>
                            </button>
                            <span class="text-danger font-small pull-xs-left tiny-leftmargin push-down" id="spnSearchError"></span>
                        </div>
                    </fieldset>
                    <div>
                        <div data-bind="visible: ShowLoadProgress"><span class="spinner-circle-big"></span></div>
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th style="width: 8%" class="center-align"><%=GetGlobalResourceObject("ManageSchedule_Resource", "status")%></th>
                                    <th style="width: 12%"><%=GetGlobalResourceObject("ManageSchedule_Resource", "workOrder")%></th>
                                    <th style="width: 20%"><%=GetGlobalResourceObject("ManageSchedule_Resource", "scheduleDate")%></th>
                                    <th style="width: 20%"><%=GetGlobalResourceObject("ManageSchedule_Resource", "plannedDate")%></th>
                                    <th style="width: 20%"><%=GetGlobalResourceObject("ManageSchedule_Resource", "startDate")%></th>
                                    <th style="width: 20%"><%=GetGlobalResourceObject("ManageSchedule_Resource", "endDate")%></th>
                                </tr>
                            </thead>
                            <tbody data-bind="foreach: WorkOrderList, visible: NoRecordFound() == false" id="tBodyWorkOrderDetails" runat="server" enableviewstate="false">
                                <tr>
                                    <td class="center-align"><span class='pover' data-placement='top' data-bind="attr: { 'data-content': StatusType }" style="cursor: pointer"><img data-bind="attr: {src: StatusImage}"/></span></td>
                                    <td data-bind="text: WorkOrder"></td>
                                    <td data-bind="text: ScheduleDate"></td>
                                    <td data-bind="text: PlannedDate"></td>
                                    <td data-bind="text: StartDate"></td>
                                    <td data-bind="text: EndDate"></td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr data-bind="visible: HTMLPagerContent().length > 0"><td colspan="6" class="center-align" data-bind="html: HTMLPagerContent"></td></tr>
                                <tr data-bind="visible: NoRecordFound"><td colspan="6"  class="center-align"><%=GetGlobalResourceObject("ManageSchedule_Resource", "noRecordFound")%></td></tr>
                                <tr data-bind="visible: ErrorMessage().length > 0"><td colspan="6" class="center-align"><span class="red" data-bind="text: ErrorMessage"></span></td></tr>
                            </tfoot>
                        </table>                        
                    </div>
                </div>
                <div class="modal-footer" style="display:none;">
                </div>
            </div>
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

