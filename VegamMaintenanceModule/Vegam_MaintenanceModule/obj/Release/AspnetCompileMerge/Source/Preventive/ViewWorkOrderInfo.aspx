<%@ Page Title="" Language="C#" MasterPageFile="~/Vegam-Responsive.Master" AutoEventWireup="true" CodeBehind="ViewWorkOrderInfo.aspx.cs" Inherits="Vegam_MaintenanceModule.Preventive.ViewWorkOrderInfo" %>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/Vegam_ViewWorkOrderInfo.js" type="text/javascript"></script>
    <link href="<%= ConfigurationManager.AppSettings["MaintCssPath"].TrimEnd('/') %>/Styles/proplan_v7.css" rel="stylesheet" type="text/css" />    
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/ajaxfileupload.js"></script>
    <style>
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
    </style>    
    <asp:ScriptManager ID="scriptManager" runat="server" EnableViewState="false">
    </asp:ScriptManager>
    <div id="divWorkOrderInfo" class="col-xs-12">
        <ul class="nav nav-tabs m-b-0">
            <li onclick="javascript:LoadWorkOrderInfo('lnkGeneral');return false;" class="pull-xs-left nav-item">
                <a id="lnkGeneral" class="nav-link"><%=GetGlobalResourceObject("ViewWorkOrderResource", "general")%></a>
            </li>
            <li onclick="javascript:LoadWorkOrderInfo('lnkWorkInstructions');return false;" class="pull-xs-left nav-item">
                <a id="lnkWorkEquipments" class="nav-link"><%=GetGlobalResourceObject("ViewWorkOrderResource", "workInstructions")%></a>
            </li>
            <li id="liEquipment" onclick="javascript:LoadWorkOrderInfo('lnkEquipment');return false;" class="pull-xs-left nav-item hide">
                <a id="lnkEquipment" class="nav-link"><%=GetGlobalResourceObject("ViewWorkOrderResource", "equipmentDetails")%></a>
            </li>
        </ul>
        <div id="divGeneralInfo" class="col-xs-12 info-block p-b-1">
            <div class="col-xs-12 col-lg-8">
                <fieldset>
                    <label class="form-control-label col-xs-12 col-lg-3"><%=GetGlobalResourceObject("ViewWorkOrderResource", "maintenanceName")%></label><label class="form-control-label pull-xs-left bold">:</label>
                    <label data-bind="text: MaintenanceName" class="form-control-label col-xs-12 col-lg-8"></label>
                </fieldset>
                <fieldset>
                    <label class="form-control-label col-xs-12 col-lg-3"><%=GetGlobalResourceObject("ViewWorkOrderResource", "description")%></label><label class="form-control-label pull-xs-left bold">:</label>
                    <label data-bind="text: Description" class="form-control-label col-xs-12 col-lg-8"></label>
                </fieldset>
                <fieldset>
                    <label class="form-control-label col-xs-12 col-lg-3"><%=GetGlobalResourceObject("ViewWorkOrderResource", "maintenanceType")%></label><label class="form-control-label pull-xs-left bold">:</label>
                    <label data-bind="text: MaintenanceType" class="form-control-label col-xs-12 col-lg-8"></label>
                </fieldset>
                <fieldset>
                    <label class="form-control-label col-xs-12 col-lg-3"><%=GetGlobalResourceObject("ViewWorkOrderResource", "priority")%></label><label class="form-control-label pull-xs-left bold">:</label>
                    <label data-bind="text: Priority" class="form-control-label col-xs-12 col-lg-8"></label>
                </fieldset>
                <fieldset>
                    <label class="form-control-label col-xs-12 col-lg-3"><%=GetGlobalResourceObject("ViewWorkOrderResource", "status")%></label>
                    <label class="form-control-label pull-xs-left bold">:</label>
                    <div class="col-xs-12 col-lg-8 p-x-0">
                        <img data-bind="attr: { src: StatusImage }" alt="image here" class="img-radius" />
                        <label data-bind="text: StatusText" class="form-control-label "></label>
                    </div>
                </fieldset>
                <fieldset>
                    <label class="form-control-label col-xs-12 col-lg-3"><%=GetGlobalResourceObject("ViewWorkOrderResource", "scheduledDate")%></label><label class="form-control-label pull-xs-left bold">:</label>
                    <label data-bind="text: ScheduledDate" class="form-control-label col-xs-12 col-lg-3"></label>
                    <label class="form-control-label col-xs-12 col-lg-2"><%=GetGlobalResourceObject("ViewWorkOrderResource", "startDate")%></label><label class="form-control-label pull-xs-left bold">:</label>
                    <label data-bind="text: StartDate" class="form-control-label col-xs-12 col-lg-3"></label>
                </fieldset>
                <fieldset>
                    <label class="form-control-label col-xs-12 col-lg-3"><%=GetGlobalResourceObject("ViewWorkOrderResource", "actualStartDate")%></label><label class="form-control-label pull-xs-left bold">:</label>
                    <label data-bind="text: ActualStartDate" class="form-control-label col-xs-12 col-lg-3"></label>
                    <label class="form-control-label col-xs-12 col-lg-2"><%=GetGlobalResourceObject("ViewWorkOrderResource", "actualEndDate")%></label><label class="form-control-label pull-xs-left bold">:</label>
                    <label data-bind="text: ActualEndDate" class="form-control-label col-xs-12 col-lg-3"></label>
                </fieldset>
                <fieldset>
                    <label class="form-control-label col-xs-12 col-lg-3"><%=GetGlobalResourceObject("ViewWorkOrderResource", "estimatedTime")%></label><label class="form-control-label pull-xs-left bold">:</label>
                    <label data-bind="text: EstimatedTime" class="form-control-label col-xs-12 col-lg-3"></label>
                    <label class="form-control-label col-xs-12 col-lg-2"><%=GetGlobalResourceObject("ViewWorkOrderResource", "actualTime")%></label><label class="form-control-label pull-xs-left bold">:</label>
                    <label data-bind="text: ActualTime" class="form-control-label col-xs-12 col-lg-3"></label>
                </fieldset>
                <fieldset>
                    <label class="form-control-label col-xs-12 col-lg-3"><%=GetGlobalResourceObject("ViewWorkOrderResource", "assignedTo")%></label><label class="form-control-label pull-xs-left bold">:</label>
                    <label data-bind="text: AssignedTo" class="form-control-label col-xs-12 col-lg-8"></label>
                </fieldset>
                <fieldset>
                    <label class="form-control-label col-xs-12 col-lg-3"><%=GetGlobalResourceObject("ViewWorkOrderResource", "reportedTo")%></label><label class="form-control-label pull-xs-left bold">:</label>
                    <label data-bind="text: ReportedTo" class="form-control-label col-xs-12 col-lg-8"></label>
                </fieldset>
            </div>
            <div data-bind="visible: EquipmentImagePath().length > 0" class="col-xs-12 col-lg-4 heading-gap">
                <img data-bind="attr: { src: EquipmentImagePath }" style="width: 200px; height: 170px" alt="image here" class="img-radius" />
                <fieldset>
                    <label class="form-control-label col-xs-12 col-lg-5 col-xl-4"><%=GetGlobalResourceObject("ViewWorkOrderResource", "equipmentName")%></label><label class="form-control-label pull-xs-left bold">:</label>
                    <label data-bind="text: EquipmentName" class="form-control-label col-xs-12 col-lg-6 col-xl-7"></label>
                </fieldset>
                <fieldset>
                    <label class="form-control-label col-xs-12 col-lg-5 col-xl-4"><%=GetGlobalResourceObject("ViewWorkOrderResource", "equipmentType")%></label><label class="form-control-label pull-xs-left bold">:</label>
                    <label data-bind="text: EquipmentType" class="form-control-label col-xs-12 col-lg-6 col-xl-7"></label>
                </fieldset>
            </div>
        </div>
        <div id="divEquipmentInfo" class="col-xs-12 info-block p-b-1">
            <section class="container-fluid p-l-0">
                <div class="col-xs-12 col-lg-6">
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
                <div class="col-xs-12 col-lg-4 heading-gap"">
                    <img data-bind="attr: { src: EquipmentImagePath }, visible: EquipmentImagePath().length > 0" style="width: 200px; height: 170px" alt="image here" class="img-radius" />
                </div>
            </section>
            <fieldset>
                <hr class="col-xs-12 col-lg-5" />
            </fieldset>
            <section class="container-fluid p-l-0">
                <div class="col-xs-12 col-lg-6">
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
                <div class="col-xs-12 col-lg-5 col-xl-4 p-l-0">
                    <fieldset>
                        <label class="col-xs-12 col-lg-6 col-xl-5"><%=GetGlobalResourceObject("ViewWorkOrderResource", "warrentyNumber")%></label><label class="pull-xs-left bold">:</label>
                        <label data-bind="text: WarrentyNo" class="col-xs-12 col-lg-5 col-xl-6"></label>
                    </fieldset>
                    <fieldset>
                        <label class="col-xs-12 col-lg-6 col-xl-5"><%=GetGlobalResourceObject("ViewWorkOrderResource", "warrentyStatus")%></label><label class="pull-xs-left bold">:</label>
                        <label data-bind="text: WarrentyStatus" class="col-xs-12 col-lg-5 col-xl-6"></label>
                    </fieldset>
                    <fieldset>
                        <label class="col-xs-12 col-lg-6 col-xl-5"><%=GetGlobalResourceObject("ViewWorkOrderResource", "warrentyExpiry")%></label><label class="pull-xs-left bold">:</label>
                        <label data-bind="text: WarrentyExpiry" class="col-xs-12 col-lg-5 col-xl-6"></label>
                    </fieldset>
                    <fieldset>
                        <label class="col-xs-12 col-lg-6 col-xl-5"><%=GetGlobalResourceObject("ViewWorkOrderResource", "purchaseDate")%></label><label class="pull-xs-left bold">:</label>
                        <label data-bind="text: PurchaseDate" class="col-xs-12 col-lg-5 col-xl-6"></label>
                    </fieldset>
                    <fieldset>
                        <label class="col-xs-12 col-lg-6 col-xl-5"><%=GetGlobalResourceObject("ViewWorkOrderResource", "installDate")%></label><label class="pull-xs-left bold">:</label>
                        <label data-bind="text: InstalledDate" class="col-xs-12 col-lg-5 col-xl-6"></label>
                    </fieldset>
                </div>
            </section>
            <div>          
                <fieldset data-bind="visible: SpecificationDocumentsList().length > 0">
                    <label class="form-control-label bold">
                        <%=GetGlobalResourceObject("ViewWorkOrderResource", "specificationDocuments")%>
                    </label>
                    <fieldset class="nowrwap info-block" style="overflow-y: auto">
                        <div class="col-xs-12 ">
                            <div id="divSpecificationList" class="rightmargin pull-xs-left" data-bind="foreach: SpecificationDocumentsList">
                                <div class="cursor-pointer tiny-leftmargin p-a-0" style="display: inline-block; width: 70px">
                                    <img class="full-width center-align heading-gap" data-bind="attr: { src: ThumbnailPath, title: DocumentDisplayName }, click: function () { DownloadDocumentOrImageOrVideoInfo($data); return false; }" style="width: 50px; height: 55px;">
                                    <label data-bind="atr: { id: 'lbl_' + DocumentID }, text: DocumentDisplayName" class="center-align full-width" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><span data-bind="attr: { title: DocumentDisplayName }"></span></label>
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
        <div id="divWorkInstruction" class="col-xs-12 p-x-0 p-b-1">
            <!-- ko foreach: taskInfoList -->
            <section class="bottom-gap">
                <fieldset class="info-block p-listing" style="background: #eee">
                    <i onclick="javascript:ShowHideDetails(this,'taskdiv');return false;" class="fa fa-minus-circle orange fa-2x push-up pull-xs-left tiny-leftmargin tiny-rightmargin cursor-pointer"></i>
                    <span class="pull-xs-left push-up pover" data-placement='top' data-bind="attr: {'data-content':Status}">
                        <img data-bind="attr: { src: StatusImage}" />
                    </span>
                    <label data-bind="text: TaskName" class="bold col-xs-12 col-lg-2"></label>
                    <div class="in-block nowrap medium-rightmargin">
                        <label class="bold label-xxxlarge nomarginleft m-b-0"><%=GetGlobalResourceObject("ViewWorkOrderResource", "estimatedTime")%>:</label>
                        <label data-bind="text: EstimatedTime" class="label-large m-b-0"></label>
                    </div>
                    <div class="in-block nowrap medium-rightmargin">
                        <label class="bold tiny-rightmargin label-large m-b-0"><%=GetGlobalResourceObject("ViewWorkOrderResource", "startDate")%>:</label>
                        <label data-bind="text: StartedDateTime" class="label-xxlarge nomarginleft m-b-0"></label>
                    </div>
                    <div class="in-block nowrap medium-rightmargin">
                        <label class="bold tiny-rightmargin label-large m-b-0"><%=GetGlobalResourceObject("ViewWorkOrderResource", "endDate")%>:</label>
                        <label data-bind="text: EndDateTime" class="label-xxlarge nomarginleft m-b-0"></label>
                    </div>
                    <div class="in-block nowrap medium-rightmargin">
                        <label class="bold medium-rightmargin label-large m-b-0"><%=GetGlobalResourceObject("ViewWorkOrderResource", "startedBy")%>:</label>
                        <label data-bind="text: StartedBy" class="label-xlarge nomarginleft m-b-0"></label>
                    </div>
                    <div class="spinner-circle-small push-up pull-xs-right" data-bind="visible: ShowTaskStartEndProgress"></div>
                    <button data-bind="visible: ShowStartTask, click: $root.HasTaskAccess() ? function () { ShowStartTaskModal($data); return false; } : '', enable: $root.HasTaskAccess() && !DisableTaskStartEnd()" class="btn btn-sm btn-primary pull-xs-right push-up tiny-rightmargin font-small"><%=GetGlobalResourceObject("ViewWorkOrderResource", "start")%></button>
                    <button data-bind="visible: ShowEndTask, click: $root.HasTaskAccess() ? function () { EndTask($data); return false; } : '', enable: $root.HasTaskAccess() && !DisableTaskStartEnd() " class="btn btn-sm btn-primary pull-xs-right push-up tiny-rightmargin font-small"><%=GetGlobalResourceObject("ViewWorkOrderResource", "end")%></button>
                </fieldset>
                <div contentdiv="taskdiv" class="p-listing box-shadow col-xs-12 p-x-0 bottom-gap">
                    <fieldset data-bind="visible: Description.length > 0">
                        <label class="form-control-label col-xs-12 col-md-7 bold"><%=GetGlobalResourceObject("ViewWorkOrderResource", "description")%></label>
                        <label data-bind="text: Description" class="col-xs-12 col-md-7"></label>
                    </fieldset>
                    <div class="col-xs-12 col-lg-7 p-l-0 p-b-1">
                        <fieldset data-bind="visible: SafetyDescription.length > 0">
                            <div class="col-xs-12 p-a-0 tiny-leftmargin" style="border: 1px solid lightgray; border-radius: 6px;">
                                <fieldset>
                                    <i onclick="javascript:ShowHideDetails(this,'safetydiv');return false;" class="fa fa-minus-circle blue big pull-xs-left cursor-pointer tiny-leftmargin" style="padding-top: 5px;"></i>
                                    <label class="form-control-label col-xs-12 col-md-3 tiny-leftmargin bold"><%=GetGlobalResourceObject("ViewWorkOrderResource", "safetyInstruction")%></label>
                                </fieldset>
                                <fieldset contentdiv="safetydiv">
                                    <label data-bind="text: SafetyDescription" class="form-control-label col-xs-12 tiny-leftmargin"></label>
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
                                    <div class="in-block nowrap tiny-rightmargin">
                                        <fieldset>
                                            <input data-bind="checked: IsConfirmed" disabled="disabled" type="checkbox" class="pull-xs-right">
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
                                    <div class="in-block nowrap tiny-rightmargin">
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
                                <i class="fa blue big pull-xs-left cursor-pointer fa-minus-circle tiny-leftmargin push-down" onclick="ShowHideDetails(this,'documentsdiv');"></i>
                                <label class="col-xs-12 col-md-6 tiny-leftmargin p-a-0 push-down bold"><%=GetGlobalResourceObject("ViewWorkOrderResource", "files")%></label>
                            </div>
                            <div contentdiv="documentsdiv" class="col-xs-12 medium-leftmargin p-x-0">
                                <!-- ko foreach: DocumentInfoList -->
                                <span class="tiny-rightmargin pull-xs-left">
                                    <span class="cursor-pointer tiny-leftmargin" style="display: inline-block">
                                        <img class="pull-xs-left tiny-rightmargin heading-gap bottom-gap" data-bind="attr: { src: ThumbnailPath }, click: function () { DownloadDocumentOrImageOrVideoInfo($data); return false; }" style="width: 50px; height: 55px;">
                                        <span data-bind="visible: ShowDownloadProgress" class="spinner-circle-small pull-xs-left m-t-2"></span>
                                    </span>
                                    
                                </span>
                                 <!-- /ko -->
                            </div>
                                </div>
                        </fieldset>
                    </div>
                    <div class="col-xs-12 col-lg-5 tiny-padding">
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
                            <textarea data-bind="value: Remarks, style: { 'border-color': (RemarksMissing() ? 'red' : '') }" class="col-xs-12 form-control-lg font-small" rows="4"></textarea>
                        </fieldset>
                        <fieldset>
                            <span data-bind="visible: ShowSaveParameterProgress"></span>
                            <span class="blue" data-bind="text: ParameterSaveMessage"></span>
                            <button data-bind="click: function () { SaveTaskParameterValue($data); return false; }, visible: TaskIsInProgress, enable: !DisableSaveParameter() && $parent.HasEditAccess"
                                class="btn btn-sm btn-success tiny-rightmargin  pull-xs-right tiny-rightmargin push-down">
                                <%=GetGlobalResourceObject("ViewWorkOrderResource", "save")%></button>
                        </fieldset>                        
                    </div>
                    <fieldset data-bind="visible: PictureEnabled &&( ImageList().length > 0 || TaskIsInProgress)">
                            <div  class="col-xs-12 p-a-0 push-down" style="border: 1px solid lightgray; border-radius: 6px;">
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
                                    style="position: absolute; top: -19px; left: -4px; opacity: 0; width: 50px; height: 55px; min-height: 0px; font-size: 0; line-height: 2px"; />
                                            </span>
                                        <span data-bind="visible: $parent.ShowImageUploadProgress" class="spinner-circle-small absolute m-t-1"></span>
                                    </fieldset>
                                </div>
                            </div>
                        </fieldset>
                        </div>
                </div>
            </section>
            <!-- /ko -->
        </div>
        <div data-bind="visible:TaskGroupNotFoundMessage" class="center-align gray m-t-3 big text-danger"><%=GetGlobalResourceObject("ViewWorkOrderResource", "taskGroupNotFound")%></div>
        <div data-bind="visible: ShowLoadProgress" class="spinner-circle-big"></div>
    </div>

    <div id="divStartTaskModal" data-backdrop="static" data-keyboard="false" class="modal fade in">
        <div class="modal-dialog modal-lg">
            <div id="divStartTaskModalBody" class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                    <h5><%=GetGlobalResourceObject("ViewWorkOrderResource", "startTask")%> 
                    </h5>
                </div>
                <div contentdiv="taskdiv"  class="modal-body" style="min-height: 190px; overflow: hidden;">
                    <fieldset data-bind="visible: ShowSafetyInstruction">
                        <div class="col-xs-12 p-a-0 tiny-leftmargin" style="border-radius: 6px; border: 1px solid lightgray; border-image: none;">
                            <fieldset>
                                <i onclick="javascript:ShowHideDetails(this,'startTaskSafetyDiv');return false;" class="fa fa-minus-circle blue big pull-xs-left cursor-pointer tiny-leftmargin" style="padding-top: 5px;"></i>
                                <label class="form-control-label col-xs-12 col-md-3 tiny-leftmargin bold"><%=GetGlobalResourceObject("ViewWorkOrderResource", "safetyInstruction")%></label>
                            </fieldset>
                            <fieldset contentdiv="startTaskSafetyDiv">
                                <label data-bind="text: SafetyInstruction" class="form-control-label col-xs-12 tiny-leftmargin"></label>
                                <button data-bind=" click: function () { IsSafetyConfirmed(true); }, visible: !IsSafetyConfirmed()" class="btn btn-sm btn-info pull-xs-right push-down tiny-rightmargin font-mini bottom-gap"><%=GetGlobalResourceObject("ViewWorkOrderResource", "confirm")%></button>
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
                                        <input data-bind="checked: IsConfirmed, enable: !$parent.IsPPEConfirmed()" class="pull-xs-right" type="checkbox">
                                        <img data-bind="attr: { src: ImagePath }" class="pull-xs-left tiny-rightmargin" style="width: 60px; height: 60px;" >
                                    </fieldset>
                                    <label data-bind="text: Description" class="col-xs-12 p-x-0 ellipsis"></label>
                                </div>
                                <!-- /ko -->                                
                                <button data-bind=" click: function () { IsPPEConfirmed(true); }, visible: !IsPPEConfirmed()" class="btn btn-sm btn-info pull-xs-right push-down tiny-rightmargin font-mini bottom-gap"><%=GetGlobalResourceObject("ViewWorkOrderResource", "confirm")%></button>
                            </div>
                        </div>
                    </fieldset>
                </div>
                <div class="modal-footer">
                    <fieldset> 
                        <span data-bind="text: StartTaskConfirmError" class="red"></span>
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
        <input type="text" data-bind="value: Value, style: { 'border-color': (ValueMissing() ? 'red' : '') }" onkeypress="javascript:return isNumberKey(event);" class="form-control-sm col-xs-12" />
        <!-- /ko -->
        <!-- ko if:Type==$root.parameterTypeInfo.Decimal -->
        <input type="text" data-bind="value: Value, style: { 'border-color': (ValueMissing() ? 'red' : '') }" onkeypress="javascript:ValidateDecimalInput(this, event, 7, 3);" class="form-control-sm col-xs-12" />
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
</asp:Content>
