<%@ Page Title="" Language="C#" MasterPageFile="~/Vegam-Responsive.Master" AutoEventWireup="true" CodeBehind="ManageMeasurementDocument.aspx.cs" Inherits="Vegam_MaintenanceModule.Preventive.ManageMeasurementDocument" %>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <script type="text/javascript" src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/Vegam_ManageMeasurementDocument.js"></script>
    <script type="text/javascript" src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/Vegam_DynamicGridControlScript_v26.js"></script>
    <script type="text/javascript" src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/iPAS_Pager.js"></script>
    <link href="<%= ConfigurationManager.AppSettings["MaintCssPath"].TrimEnd('/') %>/Styles/proplan_v7.css" rel="stylesheet" type="text/css" />
    <style>
        .pro-plan .dropdown-menu {
            min-width: 140px !important;
        }

        /*#tblDynamicGrid th:first-child {
            max-width: 100px;
        }

        #tblDynamicGrid td:first-child {
            max-width: 100px;
            min-width: 100px !important;
        } 
        #tblDynamicGrid th:nth-child(4) {
            max-width: 450px;
        }

        #tblDynamicGrid td:nth-child(4) {
            max-width: 450px;
            min-width: 450px !important;
        }*/ 
        .popover-title {
            display: none;
        }

        .popover-content {
            background-color: #5f6973;
            color: #FFFFFF;
            padding: 2px;
            border-radius: 3px;
        }
        .popover{
            z-index:10050;
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
        
    </style>
    <asp:ScriptManager ID="ScriptManager1" runat="server" EnableViewState="false">
    </asp:ScriptManager>
    <input id="hdnPageSize" type="hidden" runat="server" enableviewstate="false" value="10" />
    <input id="hdnWorkOrderPageSize" type="hidden" runat="server" enableviewstate="false" value="10" />
    <div class="pro-plan col-xs-12">
        <div class="col-xs-12" dynamicgridctl="true" id="divDynamicGridContent" runat="server" enableviewstate="false"></div>
    </div>

    <div class="pop-content" style="display: none;" id="divMeasuringPointInfo">
        <div class="table-responsive">
            <table class="table table-bordered m-b-0" data-bind="visible: MeasuringPointArray().length > 0">
                <thead>
                    <tr>
                        <th enableviewstate="false" style="white-space: nowrap; width:100%!important;max-width:100%!important" class="bg-graylight cursor-pointer center-align">
                            <%=GetGlobalResourceObject("MeasurementDocument_Resource", "measuringPointsList")%> 
                        </th>
                    </tr>
                </thead>
                <tbody id="tbMeasuringPointInfo" style="color: black;" data-bind="foreach: MeasuringPointArray()">
                    <tr>
                        <td class="nowrap" style="width:100%!important;max-width:100%!important" data-bind="text: MeasuringPoint"></td>
                    </tr>
                </tbody>
            </table>
            <table class="table table-bordered m-b-0" data-bind="visible: MeasuringPointArray().length == 0">
                <tbody id="tbWorkGroupInfo" style="color: black">
                    <tr data-bind="visible: AssigneeUserName().length > 0">
                        <th>Assignee</th>
                        <td style="white-space:normal" data-bind="text: AssigneeUserName"></td>       
                    </tr>
                    <tr data-bind="visible: ReportToUserName().length > 0">
                        <th class="nowrap">Report To</th>
                        <td style="white-space:normal" data-bind="text: ReportToUserName"></td>       
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div id="divWorkOrderDetailModal" data-backdrop="static" role="dialog" class="modal fade" aria-hidden="true" style="overflow-y:hidden !important;" tabindex="-1" >
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h5><%=GetGlobalResourceObject("MeasurementDocument_Resource", "listOfWorkOrders")%>
                    </h5>
                </div>
                <div class="modal-body" style="min-height: 190px; overflow: hidden;">
                    <fieldset class="info-block bottom-gap">
                        <legend class="search-legend cursor-pointer" id="legSearchCriteria"><i class="fa fa-caret-down tiny-rightmargin"></i><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "defineSearchCriteria")%></legend>
                        <div class="push-up">
                            <label class="pull-xs-left form-control-sm push-down">
                                <%=GetGlobalResourceObject("MeasurementDocument_Resource", "status")%>
                            </label>
                            <select class="form-control-sm pull-xs-left" data-bind="options: WorkOrderStatusList, optionsText: 'DisplayName', optionsValue: 'TypeValue', value: SelectedWorkOrderStatus, optionsCaption: '<%=GetGlobalResourceObject("MeasurementDocument_Resource", "select")%>'"></select>
                            <button type="button" id="btnSearch" class="btn-sm btn btn-normal  bottom-gap  tiny-leftmargin pull-xs-left" onclick="SearchWorkOrderInfo();return false;">
                                <i class="fa fa-search"></i>
                            </button>
                            <button type="button" id="btnShowAll" class="btn-sm btn btn-primary pull-xs-left  tiny-leftmargin" onclick="ShowAllWorkOrderInfo();return false;">
                                <%=GetGlobalResourceObject("MeasurementDocument_Resource", "showAll")%>
                            </button>
                            <span class="text-danger font-small pull-xs-left tiny-leftmargin push-down" id="spnSearchError"></span>
                        </div>
                    </fieldset>
                    <div>
                        <div data-bind="visible: ShowLoadProgress"><span class="spinner-circle-big"></span></div>
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th style="width: 8%" class="center-align"><%=GetGlobalResourceObject("MeasurementDocument_Resource", "status")%></th>
                                    <th style="width: 12%"><%=GetGlobalResourceObject("MeasurementDocument_Resource", "workOrder")%></th>
                                    <th style="width: 20%"><%=GetGlobalResourceObject("MeasurementDocument_Resource", "scheduleDate")%></th>
                                    <th style="width: 20%"><%=GetGlobalResourceObject("MeasurementDocument_Resource", "plannedDate")%></th>
                                    <th style="width: 20%"><%=GetGlobalResourceObject("MeasurementDocument_Resource", "startDate")%></th>
                                    <th style="width: 20%"><%=GetGlobalResourceObject("MeasurementDocument_Resource", "endDate")%></th>
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
                                <tr data-bind="visible: NoRecordFound"><td colspan="6"  class="center-align"><%=GetGlobalResourceObject("MeasurementDocument_Resource", "noRecordFound")%></td></tr>
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
