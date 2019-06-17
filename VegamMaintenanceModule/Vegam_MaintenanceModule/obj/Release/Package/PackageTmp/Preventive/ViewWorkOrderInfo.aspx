<%@ Page Title="" Language="C#" MasterPageFile="~/Vegam-Responsive.Master" AutoEventWireup="true" CodeBehind="ViewWorkOrderInfo.aspx.cs" Inherits="Vegam_MaintenanceModule.Preventive.ViewWorkOrderInfo" %>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/Vegam_DynamicGridControlScript_v26.js" type="text/javascript"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/iPAS_Pager.js"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/moment.min.js" type="text/javascript"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/Vegam_ViewWorkOrderInfo.js" type="text/javascript"></script>
    <link href="<%= ConfigurationManager.AppSettings["MaintCssPath"].TrimEnd('/') %>/Styles/proplan_v7.css" rel="stylesheet" type="text/css" />
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/ajaxfileupload.js"></script>
    <script type="text/javascript" src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/jquery.timepicker.js"></script>
    <script type="text/javascript" src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/jquery.ui.timepicker.js"></script>
    <style>
        .ui-timepicker{
            width:0% !important;
            overflow-y:visible;
        }
        .bg-gray {
            background-color: #C0C0C0;
        }

        .bg-cancel {
            background-color: #FF6347;
        }

        .bg-warning {
            background-color: #FF0000;
        }

        .bg-inprogess {
            background-color: #FFFF00;
        }

        .EquipmentHistoryList > fieldset {
            cursor: pointer;
        }

        .p-listing {
            min-height: 0 !important;
        }

        .popover-content {
            background-color: #5f6973;
            color: #FFFFFF;
            padding: 2px;
            border-radius: 3px;
        }

        .popover-title {
            display: none;
        }

        .EquipmentHistoryList {
            background-color: #fafafa;
            border: 1px solid #d3d3d3;
            border-radius: 2px;
            padding-left: 5px
        }

            .EquipmentHistoryList .tiny-padding {
                padding-left: 7px;
            }

            .EquipmentHistoryList .color {
                position: absolute;
                width: 5px;
                height: 100%;
                border-bottom-left-radius: 2px;
                border-top-left-radius: 2px;
            }

            .EquipmentHistoryList:hover {
                border-bottom: 2px solid #7cc4e3;
                border-top: 1px solid #7cc4e3;
                border-left: 1px solid #7cc4e3;
                border-right: 1px solid #7cc4e3;
                border-radius: 4px;
                box-shadow: 1px 1px 1px 0 rgba(234,236,237,1);
            }

        .rside-box {
            box-shadow: 0 0 10px 10px #f5f5f5;
            padding-top: 2px;
            overflow: auto;
            border: 1px solid #f3f1f1;
            min-height: 97vh;
            min-height: 100% \9;
            height: 100% \9;
        }

        .ul-nopadding ul {
            padding: 0;
            padding-left: 5px;
        }

        .img-radius {
            border-radius: 5px;
        }

        .bg-orange {
            background-color: #FFA500;
        }

        pre {
            font-family: ClearSans-Regular-webfont,"Droid Sans Mono",Helvetica,Arial,"Lucida Grande",Verdana,"Gill Sans",sans-serif;
            font-size: 14px;
            padding: .4rem .375rem;
            margin-bottom: 0px;
            line-height: 20px;
        }

        
        .flipdiv1 {
    height: 0px;
    overflow: hidden;
    position: absolute;
    transition-property: height;
    transition-duration: 1s;
    perspective: 1000px;
    transform-style: preserve-3d;
    background-color: #eee;
    z-index: 999;
    margin-left: 49%;
    margin-top: 36px;
    border:1px solid #fff;
}


        .flipdiv2 {
            /* animated, "folded" block */
            transition-property: all;
            transition-duration: 1s;
            transform: rotateX(-90deg);
            transform-origin: top;
        }

        /* Hover states to trigger animations */
        .flipdiv1animate {
            height: 160px;
            border:1px solid #ccc;
        }

        .flipdiv2animate {
            transform: rotateX(0deg);
            height: 160px;
        }
        .margin-right {
            margin-right: 2.3rem;
        }
    </style>
    <asp:ScriptManager ID="scriptManager" runat="server" EnableViewState="false">
    </asp:ScriptManager>
    <input id="hdnPageSize" type="hidden" runat="server" enableviewstate="false" value="50" />
    <input type="hidden" runat="server" enableviewstate="false" value="10" id="hdnEquipmentHistoryPageSize" />
    <input type="hidden" runat="server" enableviewstate="false" id="hdfDatePickerFormat" />
    <div id="divWorkOrderInfo" class="col-xs-12">
        <ul class="nav nav-tabs m-b-0">
            <li onclick="javascript:LoadWorkOrderInfo('lnkGeneral');return false;" class="pull-xs-left nav-item" data-bind="visible: !IsEquipmentView()">
                <a id="lnkGeneral" class="nav-link"><%=GetGlobalResourceObject("ViewWorkOrderResource", "general")%></a>
            </li>
            <li onclick="javascript:LoadWorkOrderInfo('lnkWorkInstructions');return false;" class="pull-xs-left nav-item" data-bind="visible: !IsEquipmentView()">
                <a id="lnkWorkEquipments" class="nav-link"><%=GetGlobalResourceObject("ViewWorkOrderResource", "workInstructions")%></a>
            </li>
            <li id="liSpareParts" onclick="javascript:LoadWorkOrderInfo('lnkSpareParts');return false;" class="pull-xs-left nav-item" data-bind="visible: !IsEquipmentView()">
                <a id="lnkSpareParts" class="nav-link"><%=GetGlobalResourceObject("ViewWorkOrderResource", "spareParts")%></a>
            </li>
            <li id="liEquipment" onclick="javascript:LoadWorkOrderInfo('lnkEquipment');return false;" class="pull-xs-left nav-item hide">
                <a id="lnkEquipment" class="nav-link"><%=GetGlobalResourceObject("ViewWorkOrderResource", "equipmentDetails")%></a>
            </li>
            <li id="liMeasuringPoint" onclick="javascript:LoadWorkOrderInfo('lnkMeasuringPoint');return false;" class="pull-xs-left nav-item">
                <a id="lnkMeasuringPoint" class="nav-link"><%=GetGlobalResourceObject("ViewWorkOrderResource", "mpReadingHistory")%></a>
            </li>
        </ul>

        <div class="row heading-gap" id="divGeneralInfo">
            <div class="col-xs-12 col-lg-9">
                <div class="rside-box" style="padding-right:5px;">
                    <div class="col-xs-12 col-lg-8 p-l-0">
                        <fieldset>
                            <label class="form-control-label col-xs-12 col-lg-3 margin-right blue font-big"><%=GetGlobalResourceObject("ViewWorkOrderResource", "workOrder")%></label><label class="form-control-label pull-xs-left bold blue">:</label>
                            <label data-bind="text: WorkOrderNum" class="form-control-label col-xs-12 col-lg-7 blue font-big"></label>
                        </fieldset>
                        <fieldset>
                            <label class="form-control-label col-xs-12 col-lg-3 margin-right"><%=GetGlobalResourceObject("ViewWorkOrderResource", "maintenanceName")%></label><label class="form-control-label pull-xs-left bold">:</label>
                            <label data-bind="text: MaintenanceName" class="form-control-label col-xs-12 col-lg-7"></label>
                        </fieldset>
                        <fieldset>
                            <label class="form-control-label col-xs-12 col-lg-3 margin-right"><%=GetGlobalResourceObject("ViewWorkOrderResource", "description")%></label><label class="form-control-label pull-xs-left bold">:</label>
                            <label data-bind="text: Description" class="form-control-label col-xs-12 col-lg-7"></label>
                        </fieldset>
                        <fieldset>
                            <label class="form-control-label col-xs-12 col-lg-3 margin-right"><%=GetGlobalResourceObject("ViewWorkOrderResource", "maintenanceType")%></label><label class="form-control-label pull-xs-left bold">:</label>
                            <label data-bind="text: MaintenanceType" class="form-control-label col-xs-12 col-lg-7"></label>
                        </fieldset>
                        <fieldset>
                            <label class="form-control-label col-xs-12 col-lg-3 margin-right"><%=GetGlobalResourceObject("ViewWorkOrderResource", "priority")%></label><label class="form-control-label pull-xs-left bold">:</label>
                            <label data-bind="text: Priority" class="form-control-label col-xs-12 col-lg-7"></label>
                        </fieldset>
                        <fieldset>
                            <label class="form-control-label col-xs-12 col-lg-3 margin-right"><%=GetGlobalResourceObject("ViewWorkOrderResource", "status")%></label>
                            <label class="form-control-label pull-xs-left bold">:</label>
                            <div class="col-xs-12 col-lg-6 p-x-0">
                                <img data-bind="attr: { src: StatusImage }" alt="image here" class="img-radius" />
                                <label data-bind="text: StatusText" class="form-control-label "></label>
                            </div>
                        </fieldset>
                        <fieldset>
                            <label class="form-control-label col-xs-12 col-lg-3 margin-right"><%=GetGlobalResourceObject("ViewWorkOrderResource", "scheduledDate")%></label><label class="form-control-label pull-xs-left bold">:</label>
                            <label data-bind="text: ScheduledDate" class="form-control-label col-xs-12 col-lg-6"></label>
                        </fieldset>

                        </div>
                    <div data-bind="visible: EquipmentImagePath().length > 0" class="col-xs-12 col-lg-4 heading-gap pull-xs-right">
                        <img data-bind="attr: { src: EquipmentImagePath }" style="width: 200px; height: 170px" alt="image here" class="img-radius" />
                        <fieldset>
                            <label class="form-control-label col-xs-12 col-lg-6" data-bind="text: IsLocationInfo() ? '<%=GetGlobalResourceObject("ViewWorkOrderResource", "locationName")%>':'<%=GetGlobalResourceObject("ViewWorkOrderResource", "equipmentName")%>'"></label>
                            <label class="form-control-label pull-xs-left bold">:</label>
                            <label data-bind="text: EquipmentName" class="form-control-label col-xs-12 col-lg-5"></label>
                        </fieldset>
                        <fieldset data-bind="visible: !IsLocationInfo()">
                            <label class="form-control-label col-xs-12 col-lg-6"><%=GetGlobalResourceObject("ViewWorkOrderResource", "equipmentType")%></label><label class="form-control-label pull-xs-left bold">:</label>
                            <label data-bind="text: EquipmentType" class="form-control-label col-xs-12 col-lg-5"></label>
                        </fieldset>
                    </div>
                    <div class="col-xs-12 col-lg-6 p-l-0">
                        <fieldset>
                            <label class="form-control-label col-xs-12 col-lg-5"><%=GetGlobalResourceObject("ViewWorkOrderResource", "actualStartDate")%></label><label class="form-control-label pull-xs-left bold">:</label>
                            <label data-bind="text: ActualStartDate" class="form-control-label col-xs-12 col-lg-6"></label>
                        </fieldset>
                        <fieldset>
                            <label class="form-control-label col-xs-12 col-lg-5"><%=GetGlobalResourceObject("ViewWorkOrderResource", "actualEndDate")%></label><label class="form-control-label pull-xs-left bold">:</label>
                            <label data-bind="text: ActualEndDate" class="form-control-label col-xs-12 col-lg-6"></label>
                        </fieldset>
                        <fieldset>
                            <label class="form-control-label col-xs-12 col-lg-5"><%=GetGlobalResourceObject("ViewWorkOrderResource", "estimatedTime")%></label><label class="form-control-label pull-xs-left bold">:</label>
                            <label data-bind="text: EstimatedTime" class="form-control-label col-xs-12 col-lg-6"></label>
                        </fieldset>
                        <fieldset>
                            <label class="form-control-label col-xs-12 col-lg-5"><%=GetGlobalResourceObject("ViewWorkOrderResource", "actualTime")%></label><label class="form-control-label pull-xs-left bold">:</label>
                            <label data-bind="text: ActualTime" class="form-control-label col-xs-12 col-lg-6"></label>
                        </fieldset>
                        <fieldset>
                            <label class="form-control-label col-xs-12 col-lg-5"><%=GetGlobalResourceObject("ViewWorkOrderResource", "assignedTo")%></label><label class="form-control-label pull-xs-left bold">:</label>
                            <label data-bind="text: AssignedTo" class="form-control-label col-xs-12 col-lg-6"></label>
                        </fieldset>
                        <fieldset>
                            <label class="form-control-label col-xs-12 col-lg-5"><%=GetGlobalResourceObject("ViewWorkOrderResource", "reportedTo")%></label><label class="form-control-label pull-xs-left bold">:</label>
                            <label data-bind="text: ReportedTo" class="form-control-label col-xs-12 col-lg-6"></label>
                        </fieldset>
                        </div>
                    <div class="col-xs-12 col-lg-6 p-r-0" style="border: 1px solid #ccc; border-radius: 5px; background-color: #f9f9f9; padding: 5px;" data-bind="visible: IsWorkOrderClosed">
                        <div class="col-xs-12 p-a-0">
                            <label class="form-control-label tiny-padding p-l-0 blue"><%=GetGlobalResourceObject("ViewWorkOrderResource", "workOrderSummary")%></label>
                        </div>
                        <div class="col-xs-12 p-a-0">
                            <div class="col-xs-6 p-a-0">
                                <label class="form-control-label p-x-0 col-xs-5 font-mini"><%=GetGlobalResourceObject("ViewWorkOrderResource", "workStartDate")%></label>
                                <colon class="font-mini">:</colon>
                                <label class="form-control-label p-x-0 font-mini" data-bind="text: WorkStartDateTime"></label>
                            </div>
                            <div class="col-xs-6 p-a-0">
                                <label class="form-control-label p-x-0 col-xs-5 font-mini"><%=GetGlobalResourceObject("ViewWorkOrderResource", "workEndDate")%></label>
                                <colon class="font-mini">:</colon>
                                <label class="form-control-label p-x-0 font-mini" data-bind="text: WorkEndDateTime"></label>
                            </div>
                        </div>
                        <div class="col-xs-12 p-a-0">
                            <div class="col-xs-6 p-a-0">
                                <label class="form-control-label p-x-0 col-xs-5 font-mini"><%=GetGlobalResourceObject("ViewWorkOrderResource", "actualDuration")%></label>
                                <colon class="font-mini">:</colon>
                                <label class="form-control-label p-x-0 font-mini" data-bind="text: TimeSpent() + ' ' + TimeSpentUnitResource()"></label>
                            </div>
                            <div class="col-xs-6 p-a-0">
                                <label class="form-control-label p-x-0 col-xs-5 font-mini"><%=GetGlobalResourceObject("ViewWorkOrderResource", "laborTime")%></label>
                                <colon class="font-mini">:</colon>
                                <label class="form-control-label p-x-0 font-mini" data-bind="text: LaborTime()+ ' '+ LaborTimeUnitResource()"></label>
                            </div>
                        </div>
                        <div class="col-xs-12 p-a-0" data-bind="visible: IsBreakDownInfoExists">
                            <div class="col-xs-6 p-a-0">
                                <label class="form-control-label p-x-0 col-xs-5 font-mini"><%=GetGlobalResourceObject("ViewWorkOrderResource", "closedBy")%></label>
                                <colon class="font-mini">:</colon>
                                <label class="form-control-label p-x-0 font-mini" data-bind="text: ClosedBy"></label>
                            </div>
                            <div class="col-xs-6 p-a-0">
                                <label class="form-control-label p-x-0 col-xs-5 font-mini"><%=GetGlobalResourceObject("ViewWorkOrderResource", "closedOn")%></label>
                                <colon class="font-mini">:</colon>
                                <label class="form-control-label p-x-0 font-mini" data-bind="text: ClosedOn"></label>
                            </div>
                        </div>
                        <div class="col-xs-12 p-a-0" data-bind="visible: IsBreakDownInfoExists">
                            <div class="col-xs-6 p-a-0">
                                <label class="form-control-label p-x-0 col-xs-5 font-mini"><%=GetGlobalResourceObject("ViewWorkOrderResource", "breakdownStartDate")%></label>
                                <colon class="font-mini">:</colon>
                                <label class="form-control-label p-x-0 font-mini" data-bind="text: BreakDownStartDateTime"></label>
                            </div>
                            <div class="col-xs-6 p-a-0">
                                <label class="form-control-label p-x-0 col-xs-5 font-mini"><%=GetGlobalResourceObject("ViewWorkOrderResource", "breakdownEndDate")%></label>
                                <colon class="font-mini">:</colon>
                                <label class="form-control-label p-x-0 font-mini" data-bind="text: BreakDownEndDateTime"></label>
                            </div>
                        </div>
                        <div class="col-xs-6 p-a-0" data-bind="visible: IsBreakDownInfoExists">
                            <label class="form-control-label p-x-0 col-xs-5 font-mini"><%=GetGlobalResourceObject("ViewWorkOrderResource", "breakdownDuration")%></label>
                            <colon class="font-mini" style="line-height: 33px !important">:</colon>
                            <label class="form-control-label p-x-0 font-mini" data-bind="text: BreakdownDuration() + ' '+BreakDownDurationUnitResource() "></label>
                        </div>
                    </div>
                </div>
            </div>


            <div id="divDocument" class="col-xs-12 col-lg-3 p-l-0 p-r-0 rside-box">
                <label class="col-xs-12 center-align" style="background: #cccccc; padding-top: 3px; padding-bottom: 4px;"><%=GetGlobalResourceObject("ViewWorkOrderResource", "documents")%></label>
                <div class="col-xs-12 tiny-padding">
                    <div class="col-xs-12 p-a-0" data-bind="foreach: AttachmentList">
                        <div class="col-xs-12 p-a-0" style="display: inline-block;">
                            <img class="pull-xs-left center-align heading-gap cursor-pointer tiny-rightmargin" data-bind="attr: { src: ThumbnailPath, title: DocumentName }, click: function () { DownloadAttachment($data); } " style="width: 50px; height: 55px;">
                            <label class="cursor-pointer m-t-2 nowrap ellipsis" data-bind="atr: { title: DocumentName }, text: DocumentName, click: function () { DownloadAttachment($data); }"></label>
                        </div>
                    </div>
                    <fieldset class="col-xs-12 p-x-0 bottom-gap">
                        <span data-bind="html: ModelErrorMsg, css: ModelErrorCss, visible: ModelErrorVisible"></span>
                        <span data-bind="text: AttachmentList().length > 0 ? '' : '<%=GetGlobalResourceObject("ViewWorkOrderResource", "noRecordFound")%>'" class="font-small text-xs-center tiny-leftmargin gray center-align"></span>
                    </fieldset>
                </div>
            </div>
        </div>

        <div id="divEquipmentInfo" class="heading-gap">
            <div class="col-xs-12 col-lg-7 p-l-0">
                <div class="rside-box p-l-0">
                    <div class="col-xs-12 col-lg-9">
                        <fieldset>
                            <label class="form-control-label col-xs-12 col-lg-4 col-xl-3"><%=GetGlobalResourceObject("ViewWorkOrderResource", "equipmentName")%></label><label class="form-control-label pull-xs-left bold">:</label>
                            <label data-bind="text: EquipmentName" class="form-control-label col-xs-12 col-lg-7 col-xl-8"></label>
                        </fieldset>
                        <fieldset>
                            <label class="form-control-label col-xs-12 col-lg-4 col-xl-3"><%=GetGlobalResourceObject("ViewWorkOrderResource", "description")%></label><label class="form-control-label pull-xs-left bold">:</label>
                            <label data-bind="text: Description" class="form-control-label col-xs-12 col-lg-7 col-xl-8"></label>
                        </fieldset>
                        <fieldset>
                            <label class="form-control-label col-xs-12 col-lg-4 col-xl-3"><%=GetGlobalResourceObject("ViewWorkOrderResource", "location")%></label><label class="form-control-label pull-xs-left bold">:</label>
                            <label data-bind="text: Location" class="form-control-label col-xs-12 col-lg-7 col-xl-8"></label>
                        </fieldset>
                        <fieldset>
                            <label class="form-control-label col-xs-12 col-lg-4 col-xl-3"><%=GetGlobalResourceObject("ViewWorkOrderResource", "type")%></label><label class="form-control-label pull-xs-left bold">:</label>
                            <label data-bind="text: EquipmentType" class="form-control-label col-xs-12 col-lg-7 col-xl-8"></label>
                        </fieldset>
                        <fieldset>
                            <label class="form-control-label col-xs-12 col-lg-4 col-xl-3"><%=GetGlobalResourceObject("ViewWorkOrderResource", "equipmentClass")%></label><label class="form-control-label pull-xs-left bold">:</label>
                            <label data-bind="text: EquipmentClass" class="form-control-label col-xs-12 col-lg-7 col-xl-8"></label>
                        </fieldset>
                    </div>
                    <%--<div class="col-xs-12 col-lg-4 heading-gap p-x-0">
                        <img data-bind="attr: { src: EquipmentImagePath }, visible: EquipmentImagePath().length > 0" style="width: 200px; height: 170px" alt="image here" class="img-radius" />
                    </div>--%>
                    <div class="col-xs-12 p-l-0">
                        <div class="col-xs-12 col-lg-9">
                            <fieldset>
                                <label class="form-control-label col-xs-12 col-lg-4 col-xl-3"><%=GetGlobalResourceObject("ViewWorkOrderResource", "modelNumber")%></label><label class="form-control-label pull-xs-left bold">:</label>
                                <label data-bind="text: ModelNumber" class="form-control-label col-xs-12 col-lg-7 col-xl-8"></label>
                            </fieldset>
                            <fieldset>
                                <label class="form-control-label col-xs-12 col-lg-4 col-xl-3"><%=GetGlobalResourceObject("ViewWorkOrderResource", "modelName")%></label><label class="form-control-label pull-xs-left bold">:</label>
                                <label data-bind="text: ModelName" class="form-control-label col-xs-12 col-lg-7 col-xl-8"></label>
                            </fieldset>
                            <fieldset>
                                <label class="form-control-label col-xs-12 col-lg-4 col-xl-3"><%=GetGlobalResourceObject("ViewWorkOrderResource", "manufacturer")%></label><label class="form-control-label pull-xs-left bold">:</label>
                                <label data-bind="text: Manufacturer" class="form-control-label col-xs-12 col-lg-7 col-xl-8"></label>
                            </fieldset>
                            <fieldset>
                                <label class="form-control-label col-xs-12 col-lg-4 col-xl-3"><%=GetGlobalResourceObject("ViewWorkOrderResource", "serialNumber")%></label><label class="form-control-label pull-xs-left bold">:</label>
                                <label data-bind="text: SerialNumber" class="form-control-label col-xs-12 col-lg-7 col-xl-8"></label>
                            </fieldset>
                        </div>
                        
                    </div>
                    <div class="col-xs-12 p-l-0">
                        <div class="col-xs-12 col-lg-9" data-bind="visible: WarrentyNo().length > 0">
                            <label class="form-control-label bold"><%=GetGlobalResourceObject("ViewWorkOrderResource", "warrentyDetails")%></label>
                            <fieldset>
                                <label class="form-control-label col-xs-12 col-lg-4 col-xl-3"><%=GetGlobalResourceObject("ViewWorkOrderResource", "warrentyNumber")%></label><label class="form-control-label pull-xs-left bold">:</label>
                                <label data-bind="text: WarrentyNo" class="form-control-label col-xs-12 col-lg-7 col-xl-8"></label>
                            </fieldset>
                            <fieldset>
                                <label class="form-control-label col-xs-12 col-lg-4 col-xl-3"><%=GetGlobalResourceObject("ViewWorkOrderResource", "warrentyStatus")%></label><label class="form-control-label pull-xs-left bold">:</label>
                                <label data-bind="text: WarrentyStatus" class="form-control-label col-xs-12 col-lg-7 col-xl-8"></label>
                            </fieldset>
                            <fieldset>
                                <label class="form-control-label col-xs-12 col-lg-4 col-xl-3"><%=GetGlobalResourceObject("ViewWorkOrderResource", "warrentyExpiry")%></label><label class="form-control-label pull-xs-left bold">:</label>
                                <label data-bind="text: WarrentyExpiry" class="form-control-label col-xs-12 col-lg-7 col-xl-8"></label>
                            </fieldset>
                            <fieldset>
                                <label class="form-control-label col-xs-12 col-lg-4 col-xl-3"><%=GetGlobalResourceObject("ViewWorkOrderResource", "purchaseDate")%></label><label class="form-control-label pull-xs-left bold">:</label>
                                <label data-bind="text: PurchaseDate" class="form-control-label col-xs-12 col-lg-7 col-xl-8"></label>
                            </fieldset>
                            <fieldset>
                                <label class="form-control-label col-xs-12 col-lg-4 col-xl-3"><%=GetGlobalResourceObject("ViewWorkOrderResource", "installDate")%></label><label class="form-control-label pull-xs-left bold">:</label>
                                <label data-bind="text: InstalledDate" class="form-control-label col-xs-12 col-lg-7 col-xl-8"></label>
                            </fieldset>
                        </div>
                    </div>

                    <div class="col-xs-12 p-l-0">
                        <fieldset data-bind="visible: SpecificationDocumentsList().length > 0">
                            <label class="form-control-label bold">
                                <%=GetGlobalResourceObject("ViewWorkOrderResource", "specificationDocuments")%>
                            </label>
                            <fieldset class="nowrwap info-block" style="overflow-y: auto">
                                <div class="col-xs-12 ">
                                    <div id="divSpecificationList" class="rightmargin pull-xs-left" data-bind="foreach: SpecificationDocumentsList">
                                        <div class="cursor-pointer tiny-leftmargin p-a-0" style="display: inline-block; width: 70px">
                                            <img class="full-width center-align heading-gap" data-bind="attr: { src: ThumbnailPath, title: DocumentDisplayName }, click: function () { DownloadDocumentOrImageOrVideoInfo($data); return false; }" style="width: 50px; height: 55px;">
                                            <label data-bind="atr: { id: 'lbl_' + DocumentID, title: DocumentDisplayName }, text: DocumentDisplayName" class="center-align full-width" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"></label>
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                        </fieldset>
                        <fieldset data-bind="visible: ManualDocumentsList().length > 0">
                            <label class="form-control-label bold">
                                <%=GetGlobalResourceObject("ViewWorkOrderResource", "manuals")%>
                            </label>
                            <fieldset class="nowrwap info-block" style="overflow-y: auto">
                                <div class="col-xs-12 ">
                                    <div id="divDoumentsList" class="rightmargin pull-xs-left" data-bind="foreach: ManualDocumentsList">
                                        <div class="cursor-pointer tiny-leftmargin p-a-0" style="display: inline-block; width: 70px">
                                            <img class="full-width center-align heading-gap" data-bind="attr: { src: ThumbnailPath, title: DocumentDisplayName }, click: function () { DownloadDocumentOrImageOrVideoInfo($data); return false; }" style="width: 50px; height: 55px;">
                                            <label class="center-align full-width" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" data-bind="atr: { id: 'lbl_' + DocumentID, title: DocumentDisplayName }, text: DocumentDisplayName"></label>
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                        </fieldset>
                        <fieldset data-bind="visible: ImagesAndVideosList().length > 0">
                            <label class="form-control-label bold">
                                <%=GetGlobalResourceObject("ViewWorkOrderResource", "photosAndVideos")%>
                            </label>
                            <fieldset class="nowrwap info-block" style="overflow-y: auto">
                                <div class="col-xs-12 ">
                                    <div id="divImagesList" class="rightmargin pull-xs-left" data-bind=" foreach: ImagesAndVideosList">
                                        <div class="cursor-pointer tiny-leftmargin p-a-0" style="display: inline-block; width: 70px">
                                            <img class="full-width center-align heading-gap" data-bind=" attr: { src: ThumbnailPath, title: DocumentDisplayName }, click: function () { DownloadDocumentOrImageOrVideoInfo($data); return false; }" style="width: 50px; height: 55px;" />
                                            <label class="center-align full-width" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" data-bind="atr: { id: 'lbl_' + DocumentID, title: DocumentDisplayName }, text: DocumentDisplayName"></label>
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                        </fieldset>
                    </div>
                </div>
            </div>
            <div class="col-xs-12 col-lg-5 tiny-padding well" id="divEquipmentHistory">
                <fieldset>
                    <div class="col-xs-12 col-lg-4 p-a-0">
                        <label class="form-control-label col-xs-12 col-lg-4"><%=GetGlobalResourceObject("ViewWorkOrderResource", "from")%></label>
                        <input type="text" autocomplete="off" id="txtFromDate" class="form-control-sm col-xs-12 col-lg-8 cursor-pointer datecontrol" />
                    </div>
                    <div class="col-xs-12 col-lg-4 p-a-0">
                        <label class="form-control-label col-xs-12 col-lg-3 col-xl-2"><%=GetGlobalResourceObject("ViewWorkOrderResource", "to")%></label>
                        <input type="text" autocomplete="off" id="txtToDate" class="form-control-sm col-xs-12 col-lg-8 col-xl-9 cursor-pointer datecontrol" />
                    </div>
                    <button class="btn-sm btn btn-normal tiny-rightmargin pull-xs-left" id="btnSearch" onclick="SearchEquipmentHistoryInfo();return false;">
                        <i class="fa fa-search"></i>
                    </button>
                    <button class="btn-sm btn btn-primary hide pull-xs-left" id="btnShowAllEquipment" onclick="ShowAllEquipmentHistoryInfo();return false;">
                        <%=GetGlobalResourceObject("ViewWorkOrderResource", "all")%>
                    </button>
                    <p class="text-danger font-small col-xs-12 m-b-0 p-x-0 tiny-leftmargin" id="spnErrorEquipment"></p>
                </fieldset>
                <label class="form-control-label p-a-0 bold"><%=GetGlobalResourceObject("ViewWorkOrderResource", "maintenanceHistory")%></label>
                <div data-bind="foreach: EquipmentHistoryList" style="max-height: 70vh; overflow: auto">
                    <div class="col-xs-12 p-a-0 cursor-pointer EquipmentHistoryList push-down" data-bind=" click: function () { LoadNewEquipentWorkOrder(WorkOrderNumber) }">
                        <div class="color" data-bind="css: WorkOrderStatusColor"></div>
                        <fieldset class="tiny-padding p-t-0 ">
                            <label class="col-xs-12 col-lg-3 p-a-0 m-b-0 m-b-0 font-mini"><%=GetGlobalResourceObject("ViewWorkOrderResource", "workOrder")%></label>
                            <label class="pull-xs-left bold m-b-0">:</label>
                            <label class="col-xs-12 col-lg-8 p-y-0 m-b-0 font-mini" data-bind="text: WorkOrderNumber"></label>
                        </fieldset>
                        <fieldset class="tiny-padding p-t-0 ">
                            <label class="col-xs-12 col-lg-3 p-a-0 m-b-0 font-mini"><%=GetGlobalResourceObject("ViewWorkOrderResource", "maintenanceName")%></label>
                            <label class="pull-xs-left bold m-b-0">:</label>
                            <label class="col-xs-12 col-lg-8 p-y-0 m-b-0 font-mini ellipsis nowrap" data-bind="text: MaintenanceName, attr: { title: MaintenanceName }"></label>
                        </fieldset>
                        <fieldset class="tiny-padding p-t-0 ">
                            <label class="col-xs-12 col-lg-3 p-a-0 m-b-0 font-mini"><%=GetGlobalResourceObject("ViewWorkOrderResource", "maintenanceType")%></label>
                            <label class="pull-xs-left bold m-b-0">:</label>
                            <label class="col-xs-12 col-lg-8 p-y-0 m-b-0 font-mini ellipsis nowrap" data-bind="text: MaintenanceType, attr: { title: MaintenanceType }"></label>
                        </fieldset>
                         <fieldset class="tiny-padding p-t-0 ">
                            <label class="col-xs-12 col-lg-3 p-a-0 m-b-0 font-mini"><%=GetGlobalResourceObject("ViewWorkOrderResource", "description")%></label>
                            <label class="pull-xs-left bold m-b-0">:</label>
                            <label class="col-xs-12 col-lg-8 p-y-0 m-b-0 font-mini ellipsis nowrap" data-bind="text: Description"></label>
                        </fieldset>                         
                        <fieldset class="tiny-padding p-t-0 ">
                            <label class="col-xs-12 col-lg-3 p-a-0 m-b-0 font-mini"><%=GetGlobalResourceObject("ViewWorkOrderResource", "CompleteDate")%></label>
                            <label class="pull-xs-left bold m-b-0">:</label>
                            <label class="col-xs-12 col-lg-8 p-y-0 m-b-0 font-mini ellipsis nowrap" data-bind="text: CompleteDate"></label>
                        </fieldset>
                         <fieldset class="tiny-padding p-t-0 " data-bind="visible: IsTimeSpentInfoExists">
                            <label class="col-xs-12 col-lg-3 p-a-0 m-b-0 font-mini"><%=GetGlobalResourceObject("ViewWorkOrderResource", "actualDuration")%></label>
                            <label class="pull-xs-left bold m-b-0">:</label>
                            <label class="col-xs-12 col-lg-8 p-y-0 m-b-0 font-mini ellipsis nowrap"  data-bind="text: TimeSpent > 0 ? TimeSpent + ' ' + TimeSpentUnitResource:''"></label>                        
                        </fieldset>
                         <fieldset class="tiny-padding p-t-0 " data-bind="visible:IsBreakDownInfoExists">
                            <label class="col-xs-12 col-lg-3 p-a-0 m-b-0 font-mini"><%=GetGlobalResourceObject("ViewWorkOrderResource", "breakdownDuration")%></label>
                            <label class="pull-xs-left bold m-b-0">:</label>
                            <label class="col-xs-12 col-lg-8 p-y-0 m-b-0 font-mini ellipsis nowrap"  data-bind="text: BreakdownDuration > 0 ? BreakdownDuration + ' ' + BreakDownDurationUnitResource:''"></label>
                        </fieldset>
                    </div>
                </div>
                <div data-bind="html: EquipmentPagerContent" class="pagination col-xs-12 heading-gap ul-nopadding p-a-0"></div>
                <div id="divLoadProgressVisible" class="spinner-circle-big hide"></div>
                <div class="tiny-padding col-xs-12 p-t-0" data-bind="visible: IsEmptyEquipmentHistorylist">
                    <div class=" center-align gray col-xs-12"><%=GetGlobalResourceObject("ViewWorkOrderResource", "noRecordFound")%></div>
                </div>
            </div>
        </div>

        <div id="divWorkInstruction" class="col-xs-12 p-x-0 p-b-1">
            <fieldset class="info-block p-listing bottom-gap" style="background: #eee">
                <i onclick="CollapseAll(this);return false;" style="font-size: 30px;" class="fa fa-minus-circle green push-up pull-xs-left tiny-leftmargin tiny-rightmargin cursor-pointer"></i>
                <span class="pull-xs-left push-up pover" data-placement='top' data-bind="attr: { 'data-content': StatusText }" style="line-height: 28px">
                    <img data-bind="attr: { src: StatusImage }" />
                </span>
                <label class="blue font-big pull-xs-left leftmargin m-b-0"><%=GetGlobalResourceObject("ViewWorkOrderResource", "workOrder")%> :</label>
                <label data-bind="text: WorkOrderNum" class="pull-xs-left m-b-0 blue font-big tiny-leftmargin"></label>
                <div>
                <button class="btn btn-sm btn-success leftmargin font-small pull-xs-right rightmargin btnflipelement" data-bind="visible: StatusText() == 'Completed' || StatusText() == 'Closed'" onclick="ShowCloseWorkOrderDiv()"><%=GetGlobalResourceObject("ViewWorkOrderResource", "reviewCloseWorkOrder")%></button>
                <div class="flipdiv1 col-xs-6 p-a-0">
                <div class="flipdiv2">
                    <div class="p-t-1 p-b-1 tiny-padding">
                        <fieldset id="fdNormaldown" class="col-xs-12 p-a-0">
                        <div class="col-xs-12 p-a-0">
                            <div class="col-xs-6 p-a-0">
                                <label class="form-control-label col-xs-5"><%=GetGlobalResourceObject("ViewWorkOrderResource", "workStartDate")%></label>
                                <input type="text" id="txtWorkStartDate" data-bind="enable: StatusText() == 'Completed'" class="form-control-sm col-xs-3 tiny-rightmargin">
                                <input type="text" id="txtWorkStartTime" data-bind="enable: StatusText() == 'Completed'" class="form-control-sm col-xs-3">
                            </div>
                            <div class="col-xs-6 p-a-0">
                                <label class="form-control-label col-xs-5"><%=GetGlobalResourceObject("ViewWorkOrderResource", "workEndDate")%></label>
                                <input type="text" id="txtWorkEndDate"  data-bind="enable: StatusText() == 'Completed'"  class="form-control-sm col-xs-3 tiny-rightmargin">
                                <input type="text" id="txtWorkEndTime"   data-bind="enable: StatusText() == 'Completed'" class="form-control-sm col-xs-3">
                            </div>
                        </div>
                        <div class="col-xs-12 p-a-0">
                            <div class="col-xs-6 p-a-0">
                                <label class="form-control-label col-xs-5"><%=GetGlobalResourceObject("ViewWorkOrderResource", "laborTime")%></label>
                                <input type="text"  maxlength="20" onkeypress="return ValidateDecimalValueForInput(this,event,20,2);" class="form-control-sm col-xs-3 tiny-rightmargin" data-bind="textInput: LaborTime, enable: StatusText() == 'Completed'">
                                <%--<input type="text" class="form-control-sm col-xs-2">--%>
                                 <select id="ddlTimeUnitForlaborTime" class="form-control-sm col-xs-3" style="display: block" data-bind="options: UnitOfTimeList, optionsText: 'DisplayName', optionsValue: 'TypeValue', enable: StatusText() == 'Completed'">
                                 </select>
                            </div>
                            <div class="col-xs-6 p-a-0">
                                <label class="form-control-label col-xs-5"><%=GetGlobalResourceObject("ViewWorkOrderResource", "actualDuration")%></label>
                                <input type="text" type="text" maxlength="20" onkeypress="return ValidateDecimalValueForInput(this,event,20,2);" class="form-control-sm col-xs-3 tiny-rightmargin" data-bind="textInput: TimeSpent,enable: StatusText()=='Completed'">
                                <%--<input type="text" class="form-control-sm col-xs-2">--%>
                                <select id="ddlTimeUnitForTimeSpent" class="form-control-sm col-xs-12 col-lg-3" style="display: block" data-bind="options: UnitOfTimeList, optionsText: 'DisplayName', optionsValue: 'TypeValue', enable: StatusText() == 'Completed'">
                                </select>
                            </div>
                        </div>
                        <div class="col-xs-12 p-a-0">
                             <label class="form-control-label cursor-pointer"  onchange="ShowBreakdowndiv();return false;"><%=GetGlobalResourceObject("ViewWorkOrderResource", "breakdown")%>
                            <input type="checkbox" id="chkbreakdown" class="pull-xs-left tiny-rightmargin tiny_push-down cursor-pointer" />
                           </label>
                        </div>
                            </fieldset>
                        <fieldset id="fdBreakdown" class="col-xs-12 p-a-0 hide">
                        <div class="col-xs-12 p-a-0">
                            <div class="col-xs-6 p-a-0">
                                <label class="form-control-label col-xs-5"><%=GetGlobalResourceObject("ViewWorkOrderResource", "breakdownStartDate")%></label>
                                <input type="text" id="txtBreakdownStartDate" data-bind="enable: StatusText() == 'Completed'" class="form-control-sm col-xs-3 tiny-rightmargin">
                                <input type="text"  id="txtBreakdownStartTime" data-bind="enable: StatusText() == 'Completed'"  class="form-control-sm col-xs-3">
                            </div>
                            <div class="col-xs-6 p-a-0">
                                <label class="form-control-label col-xs-5"><%=GetGlobalResourceObject("ViewWorkOrderResource", "breakdownEndDate")%></label>
                                <input type="text" id="txtBreakdownEndDate" data-bind="enable: StatusText() == 'Completed'" class="form-control-sm col-xs-3 tiny-rightmargin">
                                <input type="text" id="txtBreakdownEndTime" data-bind="enable: StatusText() == 'Completed'" class="form-control-sm col-xs-3">
                            </div>
                        </div>
                        <div class="col-xs-12 p-a-0">
                            <div class="col-xs-6 p-a-0">
                                <label class="form-control-label col-xs-5"><%=GetGlobalResourceObject("ViewWorkOrderResource", "breakdownDuration")%></label>
                                <input type="text"  maxlength="20" onkeypress="return ValidateDecimalValueForInput(this,event,20,2);" class="form-control-sm col-xs-3 tiny-rightmargin" data-bind="textInput: BreakdownDuration, enable: StatusText() == 'Completed'">
                               <%-- <input type="text" class="form-control-sm col-xs-2">--%>
                                <select id="ddlTimeUnitForBreakdown" class="form-control-sm col-xs-12 col-lg-3" style="display: block" data-bind="options: UnitOfTimeList, optionsText: 'DisplayName', optionsValue: 'TypeValue', enable: StatusText() == 'Completed'">
                                </select>
                            </div>
                        </div>
                        </fieldset>
                        <div class="col-xs-12 p-a-0 parentdiv">
                            <div class="errorheight">
                            <span class="pull-xs-left tiny-leftmargin text-danger col-xs-7 p-a-0" id="spnCloseWorkOrderError"></span>
                                </div>
                            <button class="btn btn-sm btn-success pull-xs-right push-up tiny-rightmargin font-small" data-bind="visible: StatusText() == 'Completed'" onclick=" CloseOrSaveWorkOrderInfo(true); return false;"><%=GetGlobalResourceObject("ViewWorkOrderResource", "saveCloseWorkOrder")%></button>
                            <button class="btn btn-sm btn-success pull-xs-right push-up tiny-rightmargin font-small" data-bind="visible: StatusText() == 'Completed'" onclick=" CloseOrSaveWorkOrderInfo(false); return false;"><%=GetGlobalResourceObject("ViewWorkOrderResource", "save")%></button>
                        </div>
                    </div>
                </div>
            </div>
            </fieldset>
            
            <!-- ko foreach: taskInfoList -->
            <section class="bottom-gap">
                <fieldset class="info-block p-listing" style="background: #eee">
                    <i onclick="javascript:ShowHideDetails(this,'taskdiv');return false;" class="fa fa-minus-circle orange fa-2x push-up pull-xs-left tiny-leftmargin tiny-rightmargin cursor-pointer"></i>
                    <span class="pull-xs-left push-up pover" data-placement='top' data-bind="attr: { 'data-content': Status }">
                        <img data-bind="attr: { src: StatusImage }" />
                    </span>
                    <label data-bind="text: TaskName" class="bold col-xs-12 col-lg-2"></label>
                    <div class="in-block nowrap medium-rightmargin">
                        <label class="bold pull-xs-left tiny-rightmargin m-b-0"><%=GetGlobalResourceObject("ViewWorkOrderResource", "estimatedTime")%>:</label>
                        <label data-bind="text: EstimatedTime" class="pull-xs-left m-b-0"></label>
                    </div>
                    <div class="in-block nowrap medium-rightmargin">
                        <label class="bold tiny-rightmargin label-large m-b-0"><%=GetGlobalResourceObject("ViewWorkOrderResource", "startDate")%>:</label>
                        <label data-bind="text: StartedDateTime" class="label-xxxlarge nomarginleft m-b-0"></label>
                    </div>
                    <div class="in-block nowrap medium-rightmargin">
                        <label class="bold tiny-rightmargin label-large m-b-0"><%=GetGlobalResourceObject("ViewWorkOrderResource", "endDate")%>:</label>
                        <label data-bind="text: EndDateTime" class="label-xxxlarge nomarginleft m-b-0"></label>
                    </div>
                    <div class="in-block nowrap medium-rightmargin">
                        <label class="bold medium-rightmargin label-large m-b-0"><%=GetGlobalResourceObject("ViewWorkOrderResource", "startedBy")%>:</label>
                        <label data-bind="text: StartedBy" class="label-xlarge nomarginleft m-b-0"></label>
                    </div>
                    <div class="spinner-circle-small push-up pull-xs-right" data-bind="visible: ShowTaskStartEndProgress"></div>
                    <button data-bind="visible: ShowStartTask, click: $root.HasTaskAccess() ? function () { ShowStartTaskModal($data); return false; } : '', enable: $root.HasTaskAccess() && !DisableTaskStartEnd() && $root.IsStartWorkOrderAccess()" class="btn btn-sm btn-primary pull-xs-right push-up tiny-rightmargin font-small"><%=GetGlobalResourceObject("ViewWorkOrderResource", "start")%></button>
                    <button data-bind="visible: ShowEndTask, click: $root.HasTaskAccess() ? function () { EndTask($data); return false; } : '', enable: $root.HasTaskAccess() && !DisableTaskStartEnd() " class="btn btn-sm btn-primary pull-xs-right push-up tiny-rightmargin font-small"><%=GetGlobalResourceObject("ViewWorkOrderResource", "end")%></button>
                </fieldset>
                <div contentdiv="taskdiv" class="p-listing box-shadow col-xs-12 p-x-0 bottom-gap">
                    <div class="col-xs-7 p-a-0">
                        <div class="col-xs-12 heading-gap bottom-gap tiny-leftmargin p-a-0" style="border: 1px solid lightgray; border-radius: 6px; width: 98% !important">
                            <fieldset data-bind="visible: Description.length > 0">
                                <%--<label class="form-control-label col-xs-12 col-md-7 bold"><%=GetGlobalResourceObject("ViewWorkOrderResource", "description")%></label>--%>
                                <label data-bind="text: Description" class="col-xs-12 form-control-label"></label>
                            </fieldset>
                        </div>
                        <div class="col-xs-12 p-l-0 p-b-1">
                            <fieldset data-bind="visible: SafetyDescription.length > 0">
                                <div class="col-xs-12 p-a-0 tiny-leftmargin" style="border: 1px solid lightgray; border-radius: 6px;">
                                    <fieldset>
                                        <i onclick="javascript:ShowHideDetails(this,'safetydiv');return false;" class="fa fa-minus-circle blue big pull-xs-left cursor-pointer tiny-leftmargin" style="padding-top: 5px;"></i>
                                        <label class="form-control-label col-xs-12 col-md-3 tiny-leftmargin bold"><%=GetGlobalResourceObject("ViewWorkOrderResource", "safetyInstruction")%></label>
                                    </fieldset>
                                    <fieldset contentdiv="safetydiv">
                                        <label data-bind="text: SafetyDescription" style="border: 1px solid #bababa; white-space: pre-wrap;" class="form-control-label col-xs-12"></label>
                                    </fieldset>
                                </div>
                            </fieldset>
                            <fieldset data-bind="visible: PPEList.length > 0">
                                <div class="col-xs-12 p-l-0 push-down tiny-leftmargin" style="border: 1px solid lightgray; border-radius: 6px;">
                                    <div class="col-xs-12 p-a-0 tiny-leftmargin">
                                        <i onclick="javascript:ShowHideDetails(this,'ppediv');return false;" class="fa fa-minus-circle blue big pull-xs-left cursor-pointer" style="padding-top: 5px;"></i>
                                        <label class="form-control-label bold"><%=GetGlobalResourceObject("ViewWorkOrderResource", "ppe")%></label>
                                    </div>
                                    <div contentdiv="ppediv" class="col-xs-12 p-a-0 medium-leftmargin">
                                        <!-- ko foreach: PPEList -->
                                        <div class="in-block nowrap tiny-rightmargin" data-bind="attr: { title: Description }">
                                            <fieldset>
                                                <%--<input data-bind="checked: IsConfirmed" disabled="disabled" type="checkbox" class="pull-xs-right">--%>
                                                <img data-bind="attr: { src: ImagePath }" class="pull-xs-left tiny-rightmargin" style="width: 60px; height: 60px;" />
                                            </fieldset>
                                            <label data-bind="text: Description" class="col-xs-12 p-x-0 ellipsis"></label>
                                        </div>
                                        <!-- /ko -->
                                    </div>
                                </div>
                            </fieldset>
                            <fieldset data-bind="visible: ToolsList.length > 0">
                                <div class="col-xs-12 p-l-0 push-down tiny-leftmargin" style="border: 1px solid lightgray; border-radius: 6px;">
                                    <div class="col-xs-12 p-a-0 tiny-leftmargin">
                                        <i onclick="javascript:ShowHideDetails(this,'toolsdiv');return false;" class="fa fa-minus-circle blue big pull-xs-left cursor-pointer" style="padding-top: 5px;"></i>
                                        <label class="form-control-label bold"><%=GetGlobalResourceObject("ViewWorkOrderResource", "tools")%></label>
                                    </div>
                                    <div contentdiv="toolsdiv" class="col-xs-12 p-a-0 medium-leftmargin">
                                        <!-- ko foreach: ToolsList -->
                                        <div class="in-block nowrap tiny-rightmargin" data-bind="attr: { title: Description }">
                                            <fieldset>
                                                <img data-bind="attr: { src: ImagePath }" class="bottom-gap tiny-rightmargin" style="width: 60px; height: 60px;" />
                                            </fieldset>
                                            <label data-bind="text: Description" class="col-xs-12 p-x-0 ellipsis"></label>
                                        </div>
                                        <!-- /ko -->
                                    </div>
                                </div>
                            </fieldset>

                            <fieldset data-bind="visible: DocumentInfoList.length > 0">
                                <div class="col-xs-12 p-l-0 push-down tiny-leftmargin" style="border: 1px solid lightgray; border-radius: 6px;">
                                    <div class="col-xs-12 p-a-0 tiny-leftmargin">
                                        <i class="fa blue big pull-xs-left cursor-pointer fa-minus-circle push-down" onclick="ShowHideDetails(this,'documentsdiv');"></i>
                                        <label class="col-xs-12 col-md-6 tiny-leftmargin p-a-0 push-down bold"><%=GetGlobalResourceObject("ViewWorkOrderResource", "files")%></label>
                                    </div>
                                    <div contentdiv="documentsdiv" class="col-xs-12 medium-leftmargin p-x-0">
                                        <!-- ko foreach: DocumentInfoList -->
                                        <span class="tiny-rightmargin pull-xs-left">
                                            <span class="cursor-pointer tiny-leftmargin" style="display: inline-block">
                                                <img class="pull-xs-left tiny-rightmargin heading-gap bottom-gap" data-bind="attr: { src: ThumbnailPath, title: DocumentName }, click: function () { DownloadDocumentOrImageOrVideoInfo($data); return false; }" style="width: 50px; height: 55px;">
                                                <span data-bind="visible: ShowDownloadProgress" class="spinner-circle-small pull-xs-left m-t-2"></span>
                                            </span>

                                        </span>
                                        <!-- /ko -->
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                    <div class="col-xs-5">
                        <div class="col-xs-12 tiny-padding">
                            <div data-bind="visible: RemarkEnabled || ParameterList.length > 0" class=" info-block m-r-0">
                                <fieldset data-bind="visible: ParameterList.length > 0" class="push-down">
                                    <table class="table m-b-0 table-bordered">
                                        <thead>
                                            <tr>
                                                <th><%=GetGlobalResourceObject("ViewWorkOrderResource", "parameterName")%></th>
                                                <th><%=GetGlobalResourceObject("ViewWorkOrderResource", "value")%></th>
                                            </tr>
                                        </thead>
                                        <tbody data-bind="foreach: ParameterList">
                                            <tr>
                                                <td data-bind="text: ParameterName"></td>
                                                <td data-bind="template: { name: TemplateName, data: $data }"></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </fieldset>
                                <fieldset data-bind="visible: RemarkEnabled" class="push-down">
                                    <label class="col-xs-12"><%=GetGlobalResourceObject("ViewWorkOrderResource", "remarks")%></label>
                                    <textarea data-bind="value: Remarks, style: { 'border-color': (RemarksMissing() ? 'red' : '') }" class="col-xs-12 form-control-lg font-small" rows="4" maxlength="300"></textarea>
                                </fieldset>
                                <fieldset>
                                    <span data-bind="visible: ShowSaveParameterProgress"></span>
                                    <span class="blue" data-bind="text: ParameterSaveMessage"></span>
                                    <button data-bind="click: function () { SaveTaskParameterValue($data); return false; }, visible: TaskIsInProgress, enable: !DisableSaveParameter() && $parent.HasEditAccess"
                                        class="btn btn-sm btn-success tiny-rightmargin  pull-xs-right tiny-rightmargin push-down">
                                        <%=GetGlobalResourceObject("ViewWorkOrderResource", "save")%></button>
                                </fieldset>
                            </div>
                            <fieldset data-bind="visible: PictureEnabled && (ImageList().length > 0 || TaskIsInProgress)">
                                <div class="col-xs-12 p-a-0 push-down" style="border: 1px solid lightgray; border-radius: 6px;">
                                    <div>
                                        <i onclick="javascript:ShowHideDetails(this,'imagediv');return false;" class="fa fa-minus-circle blue big pull-xs-left cursor-pointer tiny-leftmargin" style="padding-top: 5px;"></i>
                                        <label class="form-control-label bold"><%=GetGlobalResourceObject("ViewWorkOrderResource", "images")%></label>
                                    </div>
                                    <div contentdiv="imagediv" class="col-xs-12 p-a-0">
                                        <fieldset>
                                            <!-- ko foreach: ImageList -->
                                            <img data-bind="attr: { src: ThubmnailPath }, click: function () { DownloadImage(ImagePath); return false; }" class="bottom-gap tiny-leftmargin cursor-pointer" style="width: 60px; height: 60px;" />
                                            <!-- /ko -->
                                            <span data-bind="visible: TaskIsInProgress" class="relative cursor-pointer">
                                                <img class="tiny-leftmargin" data-bind="attr: { src: $parent.CaptureDefaultImagePath }" style="width: 50px; height: 55px;" title="add Image" />
                                                <input type="file" name="fleTaskImageUpload" class="cursor-pointer" onchange="javascript:TaskImageUpload(this);return false;" data-bind="attr: { taskID: TaskID, id: 'fleTaskImageUpload' + TaskID }, enable: $parent.HasEditAccess, css: $parent.HasEditAccess ? '' : 'icon-muted'"
                                                    style="position: absolute; top: -19px; left: -4px; opacity: 0; width: 50px; height: 55px; min-height: 0px; font-size: 0; line-height: 2px;" />
                                            </span>
                                            <span data-bind="visible: $parent.ShowImageUploadProgress" class="spinner-circle-small absolute m-t-1"></span>
                                        </fieldset>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                </div>
            </section>
            <!-- /ko -->
            <div data-bind="visible: TaskGroupNotFoundMessage" class="center-align gray m-t-3 big text-danger"><%=GetGlobalResourceObject("ViewWorkOrderResource", "SOPNotFound")%></div>
        </div>
        <div id="divSparePartInfo" class="col-xs-12 p-x-0 p-b-1">
            <section class="bottom-gap">
                <div class="col-xs-12 tiny-leftmargin p-x-0 show" style="border: 1px solid lightgray; border-radius: 6px; border-top-left-radius: 0px; border-top-right-radius: 0px;">
                    <table class="table nobox-shadow noborder-radius m-b-0 main-table table-bordered bottom-gap col-xs-10 push-down" style="border: none;">
                        <thead>
                            <tr>
                                <th><%=GetGlobalResourceObject("ViewWorkOrderResource", "materialCodeAndDesc")%></th>
                                <th><%=GetGlobalResourceObject("ViewWorkOrderResource", "requiredQuantity")%></th>
                                <th><%=GetGlobalResourceObject("ViewWorkOrderResource", "usedQuantity")%></th>
                                <th><%=GetGlobalResourceObject("ViewWorkOrderResource", "uom")%></th>
                            </tr>
                        </thead>
                        <tbody data-bind="foreach: SparePartInfoList" id="tbodySparePartInfoList">
                            <tr>
                                <td>
                                    <input type="text" class="form-control-sm col-xs-12 col-md-10" data-bind="textInput: MaterialNumber + ' - ' + MaterialDesc" disabled="disabled" />
                                </td>
                                <td>
                                    <input type="text" class="form-control-sm col-xs-12 col-md-10" data-bind="textInput: Quantity" disabled="disabled" />
                                </td>
                                <td>
                                    <input type="text" class="form-control-sm col-xs-12 col-md-10" onpaste="OnValuePaste(this,event,10,3);" data-bind="textInput: UsedQuantity, enable: $root.IsQuantityEditable()" onkeypress="return ValidateDecimalValueForInput(this,event,10,3);" />
                                </td>
                                <td>
                                    <input type="text" class="form-control-sm col-xs-12 col-md-10" data-bind="textInput: UOM" disabled="disabled" />
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr data-bind="visible: IsErrorVisible()">
                                <td class="center-align" colspan="10">
                                    <span data-bind="text: ErrorMessage(), attr: { class: ErrorClass }"></span>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <button data-bind="visible: IsQuantityEditable, enable: HasEditAccess"
                    class="btn btn-sm btn-success tiny-rightmargin  pull-xs-right tiny-rightmargin push-down" onclick="SaveSparePartInfo(); return false;">
                    <%=GetGlobalResourceObject("ViewWorkOrderResource", "save")%></button>
            </section>
        </div>
        
        <div data-bind="visible: ShowLoadProgress" class="spinner-circle-big"></div>
    </div>

    <div id="divMeasuringPointInfo" class="col-xs-12 pro-plan push-down">
        <section id="divDynamicGridContent" runat="server" enableviewstate="false"></section>
    </div>

    <div id="divStartTaskModal" data-backdrop="static" class="modal fade in" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div id="divStartTaskModalBody" class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                    <h5><%=GetGlobalResourceObject("ViewWorkOrderResource", "startTask")%> 
                    </h5>
                </div>
                <div contentdiv="taskdiv" class="modal-body" style="min-height: 190px; overflow: hidden;">
                    <fieldset data-bind="visible: ShowSafetyInstruction">
                        <div class="col-xs-12 p-a-0 tiny-leftmargin" style="border-radius: 6px; border: 1px solid lightgray; border-image: none;">
                            <fieldset>
                                <i onclick="javascript:ShowHideDetails(this,'startTaskSafetyDiv');return false;" class="fa fa-minus-circle blue big pull-xs-left cursor-pointer tiny-leftmargin" style="padding-top: 5px;"></i>
                                <label class="form-control-label col-xs-12 col-md-3 tiny-leftmargin bold"><%=GetGlobalResourceObject("ViewWorkOrderResource", "safetyInstruction")%></label>
                            </fieldset>
                            <fieldset contentdiv="startTaskSafetyDiv">
                                <label data-bind="text: SafetyInstruction" class="form-control-label col-xs-12 tiny-leftmargin"></label>
                                <button data-bind=" click: function () { IsSafetyConfirmed(true); jQuery('#divStartTaskModal').focus();}, visible: !IsSafetyConfirmed()" class="btn btn-sm btn-primary pull-xs-right push-down tiny-rightmargin font-mini bottom-gap"><%=GetGlobalResourceObject("ViewWorkOrderResource", "confirm")%></button>
                            </fieldset>
                        </div>
                    </fieldset>
                    <fieldset data-bind="visible: ShowPPEInfo">
                        <div class="col-xs-12 p-l-0 push-down tiny-leftmargin" style="border-radius: 6px; border: 1px solid lightgray; border-image: none;">
                            <div class="col-xs-12 p-a-0 tiny-leftmargin">
                                <i onclick="javascript:ShowHideDetails(this,'startTaskPPEDiv');return false;" class="fa fa-minus-circle blue big pull-xs-left cursor-pointer" style="padding-top: 5px;"></i>
                                <label class="form-control-label bold"><%=GetGlobalResourceObject("ViewWorkOrderResource", "ppe")%></label>
                            </div>
                            <div contentdiv="startTaskPPEDiv" class="col-xs-12 p-a-0 medium-leftmargin">
                                <!-- ko foreach: PPEList -->
                                <div class="in-block nowrap bottom-gap tiny-rightmargin">
                                    <fieldset>
                                        <%--<input data-bind="checked: IsConfirmed, enable: !$parent.IsPPEConfirmed()" class="pull-xs-right" type="checkbox">--%>
                                        <img data-bind="attr: { src: ImagePath }" class="pull-xs-left tiny-rightmargin" style="width: 60px; height: 60px;">
                                    </fieldset>
                                    <label data-bind="text: Description" class="col-xs-12 p-x-0 ellipsis"></label>
                                </div>
                                <!-- /ko -->
                                <button data-bind=" click: function () { IsPPEConfirmed(true); jQuery('#divStartTaskModal').focus();}, visible: !IsPPEConfirmed()" class="btn btn-sm btn-primary pull-xs-right push-down tiny-rightmargin font-mini bottom-gap"><%=GetGlobalResourceObject("ViewWorkOrderResource", "confirm")%></button>
                            </div>
                        </div>
                    </fieldset>
                </div>
                <div class="modal-footer">
                    <fieldset>
                        <span data-bind="text: StartTaskConfirmError" class="red rightmargin"></span>
                        <button id="btnStartTaskConfirm" class="btn btn-sm btn-success pull-xs-right tiny-rightmargin"><%=GetGlobalResourceObject("ViewWorkOrderResource", "start")%></button>
                    </fieldset>
                </div>
            </div>
        </div>
    </div>

    <script id="singleParameter-template" type="text/html">
        <!-- ko if:Type==$root.parameterTypeInfo.SingleLineText -->
        <input type="text" data-bind="value: Value, style: { 'border-color': (ValueMissing() ? 'red' : '') }" class="form-control-sm col-xs-12" maxlength="300" />
        <!-- /ko -->
        <!-- ko if:Type==$root.parameterTypeInfo.Numeric -->
        <input type="text" data-bind="value: Value, style: { 'border-color': (ValueMissing() ? 'red' : '') }" onkeypress="javascript:return isNumberKey(event);" class="form-control-sm col-xs-12" maxlength="300" />
        <!-- /ko -->
        <!-- ko if:Type==$root.parameterTypeInfo.Decimal -->
        <input type="text" data-bind="value: Value, style: { 'border-color': (ValueMissing() ? 'red' : '') }" onkeypress="javascript:ValidateDecimalInput(this, event, 7, 3);" class="form-control-sm col-xs-12" maxlength="300" />
        <!-- /ko -->
    </script>
    <script id="multilineParameter-template" type="text/html">
        <textarea data-bind="value: Value, style: { 'border-color': (ValueMissing() ? 'red' : '') }" class="form-control-lg font-small col-xs-12" rows="3" maxlength="300" onkeydown="return checkTextAreaMaxLength(this,event,'300');"></textarea>
    </script>
    <script id="selection-template" class="form-control-sm col-xs-12" type="text/html">
        <select data-bind="options: SelectionCodeItemList, optionsText: 'Key', optionsValue: 'Value', value: Value, style: { 'border-color': (ValueMissing() ? 'red' : '') }" class="form-control-sm col-xs-12 col-lg-7">
        </select>
    </script>
    <div class="small-popup">
        <div id="divErrorModal">
            <div>
                <p id="errorMessageText">
                </p>
            </div>
        </div>
    </div>

    <div class="modal fade" tabindex="-1" role="dialog" id="divVideoPhotoModal">
        <div class="modal-dialog" role="document" style="width: 680px; margin-top: 10%;">
            <div class="modal-content">
                <div class="modal-header p-b-0">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="embed-responsive embed-responsive-16by9 z-depth-1-half center-align" id="divLoadMediaContent">
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
