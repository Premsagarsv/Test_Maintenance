<%@ Page Title="" Language="C#" MasterPageFile="~/Vegam-Responsive.Master" AutoEventWireup="true" CodeBehind="AddNotificationInfo.aspx.cs" Inherits="Vegam_MaintenanceModule.Preventive.AddNotification" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <asp:ScriptManager ID="scriptManager" runat="server" EnableViewState="false">
    </asp:ScriptManager>
    <link href="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Styles/select2.css" rel="stylesheet" type="text/css" />
    <script type="text/javascript" src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/jquery.ui.timepicker.js"></script>
    <script type="text/javascript" src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/Vegam_AddNotification.js"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/select3.js"></script>
    <script type="text/javascript" src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/iPAS_Common_v4.js"></script>
    <script type="text/javascript" src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/iPAS_Pager.js"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/ajaxfileupload.js"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/vegam-multiselect-dropdown.js"></script>
    <link href="<%= ConfigurationManager.AppSettings["MaintCssPath"].TrimEnd('/') %>/Styles/vegam-multiselect-dropdown.css" rel="stylesheet" type="text/css" />
    <style>
        .toggle-div-mydesign {
            z-index: 9999;
        }
        .popover-title {
            display: none;
        }

        .popover-content {
            background-color: #5f6973;
            color: #FFFFFF;
            padding: 2px;
            border-radius: 3px;
        }

        .select2 {
            width: 100% !important;
        }

        .select2-container {
            z-index: 99 !important;
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

        .borderstyling {
            border: 1px solid #c1c1c1;
            background-color: #efefef !important;
            padding: 2px !important;
            height: 30px;
            border-bottom: none;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
        }

        .v-icon {
            font-size: 20px;
            margin-left: 5px;
            margin-right: 5px;
            margin-top: 2px;
            float: left;
        }

        .border-bottom {
            border-bottom: 1.5px solid #eee;
        }

        .img-radius {
            border-radius: 10px;
            box-shadow: 0px 0px 4px 0.2px #ccc;
        }

        .link-disabled {
            pointer-events: none;
            color: gray;
        }

        i[disabled] {
            color: #9e9e9e !important;
            cursor: default;
        }
        .notification-box{
            border-radius: 5px;
            box-shadow: 1px 1px grey;
        }
        .icon-muted{
            color:#9e9e9e; 
            cursor: default;
        }
        .ui-timepicker {   
            width: auto !important;
        }
         #ulEquipmentTypeMultiSelect {
    border: 1px solid #c7c7c7;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    max-height: 200px;
    overflow-y: auto;
}
    </style>
    <div class="col-xs-12 push-down p-x-0 bottom-gap">
        <div class="container-fluid p-x-0" id="divManageNotification">
            <div class="col-xs-12 col-lg-4 pull-xs-right">
                <input type="hidden" runat="server" enableviewstate="false" value="10" id="hdnPageSize" />
                <input type="hidden" runat="server" enableviewstate="false" value="10" id="hdnEquipmentPageSize" />
                <input type="hidden" runat="server" enableviewstate="false" value="5" id="hdnMasterPageSize" />
                <input type="hidden" id="hdfEquipmentSortValue" />
                <input type="hidden" id="hdfNotificationTypeSortValue" />
                <div class="rside-box">
                    <fieldset class="info-block box-shadow bg-transparent" id="divNotificationList">
                        <div class="tiny-padding col-xs-12 bottom-gap" style="border-bottom: 1.5px solid #eee;">

                            <fieldset class="info-block bottom-gap">
                                <legend class="search-legend cursor-pointer"><i class="fa fa-caret-down tiny-rightmargin"></i><%=GetGlobalResourceObject("ManageNotification_Resource", "filters")%></legend>
                                <div>
                                    <fieldset>
                                        <label class="form-control-label label-xxxlarge nomarginleft"><%=GetGlobalResourceObject("ManageNotification_Resource", "functionalLocation")%></label>
                                        <div class="col-xs-12 col-lg-6 p-x-0">
                                            <select class="form-control-sm  Parameters-Select select2" id="drpFilterFuncLoc"
                                                data-bind="options: FunctionalLocationFilterList, optionsText: 'DisplayName', optionsValue: 'TypeValue', value: SelectFunctionalLocationFilter, event: { change: DropdownNotificationFlag == true ? function () { BindDropdownEquipmentFilter() } : '' }">
                                            </select>
                                        </div>
                                    </fieldset>
                                    <fieldset>
                                        <label class="form-control-label label-xxxlarge nomarginleft"><%=GetGlobalResourceObject("ManageNotification_Resource", "equipment")%></label>
                                        <div class="col-xs-12 col-lg-6 p-x-0">
                                            <select class="form-control-sm Parameters-Select select2" id="drpFilterEquipment"
                                                data-bind="options: EquipmentFilterList, optionsText: 'DisplayName', optionsValue: 'TypeValue', value: SelectEquipmentFilter, event: { change: DropdownNotificationFlag == true ? function () { LoadNotificationList(jQuery.AddNotificationNamespace.PagerData) } : '' }">
                                            </select>
                                        </div>
                                    </fieldset>
                                </div>
                            </fieldset>

                            <label class="form-control-label pull-xs-left label-xxxlarge nomarginleft gray"><%=GetGlobalResourceObject("ManageNotification_Resource", "notification")%></label>
                            <input type="text" class="form-control-sm col-xs-12 col-lg-6  gray" id="txtSearchNotification" onkeyup="LoadNotificationList(jQuery.AddNotificationNamespace.PagerData);" placeholder="<%=GetGlobalResourceObject("ManageNotification_Resource", "searchNotification")%>" />
                        </div>
                        <div class="col-xs-12 p-a-0">
                            <input type="hidden" id="hdnSortbyNameValue" />
                            <a id="sortNotifications" runat="server" enableviewstate="false" style="white-space: nowrap;" class="cursor-pointer center-align black tiny-rightmargin pull-xs-right" data-bind="visible: !IsNotificationListEmpty()">
                                <span class="underline gray"><%=GetGlobalResourceObject("ManageNotification_Resource", "sortByName")%></span><i class="tiny-leftmargin cursor-pointer gray  "></i></a>
                            <fieldset class="tiny-padding col-xs-12 p-t-0" data-bind="foreach: NotificationList">
                                <div class="bottom-gap col-xs-12 flocations cursor-pointer p-x-0">
                                    <i class="fa fa-trash-o text-danger v-icon cursor-pointer tiny-leftmargin" title="Delete" data-bind="click: ($root.HasDeleteAccess && StatusCreated()) ? function () { DeleteNotificationClick(NotificationID); } : '', attr: BindIconAttributes(($root.HasDeleteAccess && StatusCreated()) ? true : false)"></i>
                                    <label class="col-xs-7 col-lg-7 tiny-leftmargin p-l-0 m-b-0 p-b-0 cursor-pointer" style="border-bottom: 1px solid #ccc" data-bind="text: NotificationName, css: SelectedClass, click: function () { LoadSelectedNotification(NotificationID) }"></label>
                                    <label class="tiny-leftmargin font-mini" data-bind="text: CreatedOn"></label>
                                    <label class="tiny-leftmargin font-mini" data-bind="text: LabelStatus"></label>
                                </div>
                            </fieldset>
                            <div id="divLoadProgressVisible" class="spinner-circle-big hide"></div>
                        </div>
                        <div data-bind="visible: IsNotificationListEmpty" class="center-align">
                            <span class="gray"><%=GetGlobalResourceObject("ManageNotification_Resource", "noRecordFound")%></span>
                        </div>
                        <div data-bind="html: PagerContent" class="pagination text-md-center m-a-0 col-xs-12">
                        </div>
                    </fieldset>
                </div>
            </div>

            <div class="col-xs-12 col-lg-8 push-down rside-box p-t-1">
                <div class="col-xs-12 col-lg-7 p-x-0 m-r-3">
                    <fieldset>
                        <input type="radio" name="rdbFloactionOrEquipment" id="rdbEquipment" value="equipment" class="form-control-sm pull-xs-left tiny-leftmargin" checked="">
                        <label class="form-control-label pull-xs-left" id="lblRdbEquipment"><%=GetGlobalResourceObject("ManageNotification_Resource", "equipment")%></label>
                        <input type="radio" name="rdbFloactionOrEquipment" id="rdbLocation" value="flocation" class="form-control-sm pull-xs-left">
                        <label class="form-control-label pull-xs-left" id="lblRdbLocation" style="padding-right: 2px;"><%=GetGlobalResourceObject("ManageNotification_Resource", "fLocation")%></label>
                        <i class="fa fa-star red p-a-0" style="font-size:8px !important"></i>
                        <fieldset class="col-xs-12 col-lg-7 p-x-0 pull-xs-right nowrap" style="z-index: 999">
                            <input type="text" maxlength="50" id="txtFLocationOrEquipmentName" class="form-control-sm col-xs-10 col-lg-12" readonly onclick="javascript:ShowFLocationEquipmentModal(); return false;">
                            <a onclick="javascript:ShowFLocationEquipmentModal(); return false;"><i class="fa fa-search blue tiny-leftmargin cursor-pointer" data-placement="top" title="<%=GetGlobalResourceObject("ManageNotification_Resource", "clickHereToSelectEquipmentOrFlocation")%>" style="font-size: 25px; z-index: 99"></i></a>
                        </fieldset>
                    </fieldset>
                    <fieldset>
                        <label class="form-control-label pull-xs-left"><%=GetGlobalResourceObject("ManageNotification_Resource", "notificationName")%></label> 
                            <label class="form-control-label font-mini pull-xs-left p-l-0" style="padding-right: 2px;"><%=GetGlobalResourceObject("ManageNotification_Resource", "shortText")%></label>
                            <i class="fa fa-star red p-a-0 pull-xs-left" style="font-size:8px !important;margin-top: 7px!important;"></i>                        
                        <input type="text" id="txtNotificationName" maxlength="100" class="form-control-sm col-xs-12 col-lg-7 pull-xs-right" data-bind="textInput: NotificationName">
                    </fieldset>
                    <fieldset>
                        <label class="form-control-label pull-xs-left" style="padding-right: 2px;"><%=GetGlobalResourceObject("ManageNotification_Resource", "notificationType")%> </label>
                            <i class="fa fa-star red p-a-0 pull-xs-left" style="font-size:8px !important;margin-top: 7px!important;"></i>                        
                        <fieldset class="col-xs-12 col-lg-7 nowrap p-x-0 pull-xs-right">
                            <div class="col-xs-10 col-lg-12 p-x-0">
                                <select class="form-control-sm nopadding select2" id="drpNotificationType"
                                    data-bind="options: NotificationTypeList, optionsText: 'DisplayName', optionsValue: 'TypeValue', value: SelectedNotificationType">
                                </select>
                            </div>
                            <a id="lnkAddMaintenanceType" onclick="javascript:ShowAddMaintenanceTypeModal();"><i class="fa fa-plus-circle blue tiny-leftmargin" data-placement="top" title="<%=GetGlobalResourceObject("ManageNotification_Resource", "clickHereToAddNotificationType")%>" style="font-size: 25px; z-index: 99"></i></a>
                        </fieldset>
                    </fieldset>
                    <fieldset>
                        <label class="form-control-label pull-xs-left" style="padding-right: 2px;"><%=GetGlobalResourceObject("ManageNotification_Resource", "priority")%> </label>
                          <i class="fa fa-star red p-a-0 pull-xs-left" style="font-size:8px !important;margin-top: 7px!important;"></i>    
                        <fieldset class="col-xs-12 col-lg-7 p-x-0 pull-xs-right">
                            <select class="form-control-sm nopadding select2" id="drpPriority"
                                data-bind="options: PriorityList, optionsText: 'DisplayName', optionsValue: 'TypeValue', value: SelectedPriority">
                            </select>
                        </fieldset>
                    </fieldset>
                    <fieldset class="bottom-gap ">
                        <label class="form-control-label col-xs-12 col-lg-5"><%=GetGlobalResourceObject("ManageNotification_Resource", "requestedEndDate")%></label>
                        <input type="text" id="txtRequestedEndDate" class="form-control-sm cursor-pointer col-xs-12 col-lg-4 v-tiny-rightmargin" />
                    </fieldset>
                    <fieldset class="bottom-gap ">
                        <label class="form-control-label col-xs-12 col-lg-5"><%=GetGlobalResourceObject("ManageNotification_Resource", "issueDescription")%></label>
                        <textarea id="txtDescription" maxlength="2000" data-bind="textInput: Description, attr: { onkeydown: 'return checkTextAreaMaxLength(this,event,2000)' }" class="form-control-sm font-small col-xs-12 col-lg-12" style="min-height: 150px"></textarea>
                    </fieldset>
                    <fieldset class="col-xs-12 p-x-0 heading-gap tiny-rightmargin bottom-gap" >
                        <div class="col-xs-12 p-a-0 borderstyling tiny-leftmargin" style="height: 30px;">
                            <i class="fa blue big pull-xs-left cursor-pointer fa-minus-circle tiny-leftmargin push-down" onclick="Toggle(this);"></i>
                            <label class="col-xs-12 col-md-3 tiny-leftmargin p-a-0 push-down bold"><%=GetGlobalResourceObject("ManageNotification_Resource", "addAttachments")%></label>
                        </div>

                        <div class="col-xs-12 tiny-leftmargin p-x-0 show" style="border: 1px solid lightgray; border-radius: 6px; border-top-left-radius: 0px; border-top-right-radius: 0px;">
                            <span class="rightmargin pull-xs-left" data-bind="foreach: AttachmentList">
                                            <span class="cursor-pointer tiny-leftmargin" style="display: inline-block;width:90px">
                                                <img class="pull-xs-left tiny-rightmargin heading-gap bottom-gap" data-bind="attr: { src: ThumbnailPath, title: DocumentName }, click: function () { DownloadAttachment($data); return false; }" style="width: 50px; height: 55px;">
                                                <i class="fa fa-times font-big cursor-pointer red pull-xs-left" data-bind="id: 'iconAttribute_' + ($index()), click: ($root.HasEditAccess && $root.IsNotificationStatusCreate()) || $root.SequenceID() > 0 ? function () { DeleteAttachment($data); return false; } : '', attr: BindDocumentIconAttributes($element)"></i>
                                                 <label class="center-align full-width" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" data-bind="attr: { title: DocumentName }, text: DocumentName"></label>
                                            </span>
                                        </span>
                            <span class="heading-gap cursor-pointer relative medium-rightmargin pull-xs-left bottom-gap">
                                <img data-bind="attr: { src: DefaultUploadIconPath }" style="width: 50px; height: 55px;" title="add Image" />
                                <input id="fileUpload" type="file" name="instructionFileUpload" class="cursor-pointer" onchange="UploadAttachment(); return false;"
                                    data-bind=" attr: { disabled : !($root.HasEditAccess && (IsNotificationStatusCreate() || NotificationID() == 0)) }"
                                    style="position: absolute; top: 3px; left: 6px; opacity: 0; width: 36px; height: 52px; min-height: 0px; font-size: 0; line-height: 2px" />
                            </span>
                        </div>
                    </fieldset>
                    <fieldset class="col-xs-12 bottom-gap">
                        <button id="btnCloseNotification" class="btn btn-cancel btn-sm pull-xs-right heading-gap medium-leftmargin" onclick="ClearNotificationInfo(); return false;"><%=GetGlobalResourceObject("ManageNotification_Resource", "cancel")%></button>
                        <button id="btnSaveNotification" class="btn btn-sm btn-success pull-xs-right heading-gap" runat="server" enableviewstate="false"></button>
                        <span id="divProgress" class="spinner-circle-small absolute medium-leftmargin hide"></span>
                    </fieldset>
                    <div class="p-l-1 push-down" data-bind="html: ModelErrorMsg, css: ModelErrorCss"></div>
                </div>
                <div class="col-xs-12 col-lg-4 tiny-padding pull-xs-right info-block notification-box" data-bind="visible: NotificationID() > 0  ">
                <div>
                    <fieldset>
                        <label><%=GetGlobalResourceObject("ManageNotification_Resource", "notificationNumber")%> :</label>
                        <%--<label>:</label>--%>
                        <label data-bind="text: NotificationID"></label>
                        <button class="btn btn-sm btn-cancel pull-xs-right" style="padding: .15rem .25rem" id="btnReject" data-bind="visible: IsNotificationRejectVisible" onclick="RejectNotificationClick(); return false;"><%=GetGlobalResourceObject("ManageNotification_Resource", "reject")%></button>
                        <button class="btn btn-sm btn-success pull-xs-right tiny-rightmargin" style="padding: .15rem .25rem" id="btnAccept" data-bind="visible: IsNotificationAcceptVisible" onclick="AcceptNotificationClick(); return false;"><%=GetGlobalResourceObject("ManageNotification_Resource", "accept")%></button>                        
                    </fieldset>
                    <fieldset>
                        <label><%=GetGlobalResourceObject("ManageNotification_Resource", "status")%></label>
                        <label>:</label>
                        <label data-bind="text: NotificationStatus" class="tiny-rightmargin"></label>
                    </fieldset>
                    <fieldset data-bind="visible: AttachedSchedlueID() > 0 ">
                        <label><%=GetGlobalResourceObject("ManageNotification_Resource", "workOrderNumber")%></label>
                        <label>:</label>
                        <label class="blue underline cursor-pointer" data-bind="text: WorkOrderNumber, attr: { disabled: WorkOrderHasNoAccess }, click: !WorkOrderHasNoAccess ? function () { CreateWorkOrder(true); return false; } : ''"></label>
                    </fieldset>
                    <fieldset>
                        <label class="font-mini bold"><%=GetGlobalResourceObject("ManageNotification_Resource", "createdOn")%></label>
                        <label class="m-b-0">:</label>
                        <label class="rightmargin font-mini" data-bind="text: CreatedOn"></label>
                    </fieldset>
                    <fieldset class="push-up">
                        <label class="font-mini bold"><%=GetGlobalResourceObject("ManageNotification_Resource", "createdBy")%></label>
                        <label class="m-b-0">:</label>
                        <label class="rightmargin font-mini" data-bind="text: CreatedBy"></label>
                    </fieldset>
                    <fieldset class="push-down">
                        <button class="btn btn-sm btn-primary pull-xs-right" style="padding: .15rem .25rem" data-bind="visible: IsNotificationCreateWOVisible, attr: { disabled: !WorkOrderHasFullAccess }, click: WorkOrderHasFullAccess ? function () { CreateWorkOrder(false); return false; } : ''" id="btnCreateWorkOrder"><%=GetGlobalResourceObject("ManageNotification_Resource", "createWorkOrder")%></button>
                        <button class="btn btn-sm btn-success pull-xs-right tiny-rightmargin" style="padding: .15rem .25rem" data-bind="visible: IsNotificationCloseVisible" onclick="CloseNotificationClick(); return false;" id="btnCloseNotificationInfo"><%=GetGlobalResourceObject("ManageNotification_Resource", "closeNotification")%></button>                        
                    </fieldset>

                    </div>
                    <div id="divremark" data-bind="visible: RejectReason().length > 0" class="push-up">

                        <label class="font-small bold">
                            <%=GetGlobalResourceObject("ManageNotification_Resource", "remark")%>
                        </label>

                        <%-- <div style="border: 1px solid lightgray; border-radius: 4px; height: 150px; width: 225px; margin-left: 22px;">
                            <label style="max-height: 150px; overflow-y: auto; padding: 3px; word-break: break-all;" data-bind="text: RejectReason">
                            </label>
                        </div>--%>

                        <p class="info-block scroll-y tiny-padding" data-bind="text: RejectReason" style="height: 150px; border-radius: 3px">this is label</p>
                    </div>
                    <div id="divClosedNotification" data-bind="visible: CloseRemark().length > 0" class="push-up">                        
                        <fieldset class="push-up">
                            <label class="font-mini bold"><%=GetGlobalResourceObject("ManageNotification_Resource", "closedOn")%></label>
                            <label class="m-b-0">:</label>
                            <label class="rightmargin font-mini" data-bind="text: ClosedOn"></label>
                        </fieldset>
                        <fieldset class="push-up">
                            <label class="font-mini bold"><%=GetGlobalResourceObject("ManageNotification_Resource", "closedBy")%></label>
                            <label class="m-b-0">:</label>
                            <label class="rightmargin font-mini" data-bind="text: ClosedBy"></label>
                        </fieldset>
                        <fieldset class="push-up">
                            <label class="font-mini bold"><%=GetGlobalResourceObject("ManageNotification_Resource", "timeSpent")%></label>
                            <label class="m-b-0">:</label>
                            <label class="rightmargin font-mini" data-bind="text: TimeSpent"></label>
                        </fieldset>
                        <fieldset class="push-up">
                            <label class="font-mini bold"><%=GetGlobalResourceObject("ManageNotification_Resource", "startTime")%></label>
                            <label class="m-b-0">:</label>
                            <label class="rightmargin font-mini" data-bind="text: StartTime"></label>
                        </fieldset>
                        <fieldset class="push-up">
                            <label class="font-mini bold"><%=GetGlobalResourceObject("ManageNotification_Resource", "endTime")%></label>
                            <label class="m-b-0">:</label>
                            <label class="rightmargin font-mini" data-bind="text: EndTime"></label>
                        </fieldset>
                        <label class="font-small bold">
                            <%=GetGlobalResourceObject("ManageNotification_Resource", "remark")%>
                        </label>
                        <p class="info-block scroll-y tiny-padding" data-bind="text: CloseRemark" style="height: 150px; border-radius: 3px">this is label</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="divSelectEquipmentFLocationModal" class="modal fade in" tabindex="-1">
        <div id="divModalEquipmentOrLocation" class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" onclick="ClearEquipmentFLocationInfo(); return false;" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h5 data-bind="text: $root.IsEquipemntSelected() ? '<%=GetGlobalResourceObject("ManageNotification_Resource", "equipmentInformation")%>':'<%=GetGlobalResourceObject("ManageNotification_Resource", "fLocationInformation")%>'"></h5>
                </div>
                <div class="modal-body" style="min-height: 190px; overflow: hidden;">
                    <fieldset class="info-block bottom-gap">
                        <legend class="search-legend cursor-pointer"><i class="fa fa-caret-down tiny-rightmargin"></i><%=GetGlobalResourceObject("ManageNotification_Resource", "defineSearchCriteria")%></legend>
                        <div class="push-up">
                            <div class="col-xs-12">
                                <div class="col-xs-12 col-lg-6 p-a-0">
                                    <label class="pull-xs-left form-control-label col-xs-12 col-lg-6" id="label" data-bind="text: $root.IsEquipemntSelected() ? '<%=GetGlobalResourceObject("ManageNotification_Resource", "fLocationOrEquipment")%>':'<%=GetGlobalResourceObject("ManageNotification_Resource", "functionalLocation")%>'">
                                    </label>
                                    <input type="text" id="txtSearchLocation" maxlength="40" class="form-control-sm pull-xs-left col-xs-12 col-lg-6" />
                                </div>
                                <div class="col-xs-12 col-lg-4 p-r-0" data-bind="visible: $root.IsEquipemntSelected()">
                                    <div class="functiondropdown cursor-pointer col-xs-12">
                                        <label class="appendSelectedElements"><%=GetGlobalResourceObject("ManageNotification_Resource", "equipmentType")%></label>
                                        <i class="icontag fa big pull-xs-right fa-caret-down i-opacity"></i>
                                    </div>
                                    <div class="drpdownbody col-xs-12" style="margin-top: 36px;">
                                        <div class="input-div" style="padding: 4px 0px 4px 4px !important;">
                                            <input type="text" class="searchField form-control-sm col-xs-11" onkeyup="KeyUpEle(this);" placeholder="Search ..." style="height: 34px;">
                                        </div>
                                        <div class="divider-border"></div>
                                        <ul id="ulEquipmentTypeMultiSelect" class="p-x-0 ulField drpDownList pull-xs-left heading-gap col-xs-11 tiny-leftmargin m-b-0" data-bind="foreach: EquipmentTypeArray" onclick="ApplyCss(this)">
                                            <li data-bind="click: function () { SelectCategoryInfo($data); }">
                                                <span class="li col-xs-12">
                                                    <input type="checkbox" class="tiny-leftmargin tiny_push-down pull-xs-left tiny-rightmargin" />
                                                    <label data-bind="text: DisplayName, attr: { title: DisplayName }" class="ellipsis nowrap m-b-0"></label>
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div>
                                    <button id="btnSearchEquipment" class="btn-sm btn btn-normal  bottom-gap  tiny-leftmargin pull-xs-left" onclick="SearchEquipmentFLoaction();return false;">
                                        <i class="fa fa-search"></i>
                                    </button>
                                    <button id="btnShowAllEquipment" class="btn-sm btn btn-primary hide pull-xs-left  tiny-leftmargin" onclick="ShowAllEquipmentFLoaction();return false;">
                                        <%=GetGlobalResourceObject("ManageNotification_Resource", "showAll")%>
                                    </button>
                                </div>
                            </div>

                            <span class="text-danger font-small pull-xs-left tiny-leftmargin push-down" id="spnEquipmentFLocationSearchError"></span>
                        </div>
                    </fieldset>
                    <div class="scroll-auto" style="height: 423px;">
                        <div class="table-side-box-heading">
                            <span class="m-l-1" data-bind="text: $root.IsEquipemntSelected() ? '<%=GetGlobalResourceObject("ManageNotification_Resource", "doubleClickToSelectEquipment")%>':'<%=GetGlobalResourceObject("ManageNotification_Resource", "doubleClickToSelectFLocation")%>'"></span>
                        </div>
                        <span id="divEuipmentProgress" class="spinner-circle-big hide"></span>
                        <table id="tableEquipment" class="table table-bordered">
                            <thead>
                                <tr>
                                    <th style="width: 5%"></th>
                                    <th id="thFLocation" runat="server" enableviewstate="false" style="white-space: nowrap;" class="bg-graylight cursor-pointer center-align">
                                        <span class="underline">
                                            <%=GetGlobalResourceObject("ManageNotification_Resource", "functionalLocation")%> 
                                        </span><i class="tiny-leftmargin cursor-pointer "></i>
                                    </th>
                                    <th id="thEquipment" data-bind="visible: $root.IsEquipemntSelected()" runat="server" enableviewstate="false" style="white-space: nowrap;" class="bg-graylight cursor-pointer center-align">
                                        <span class="underline">
                                            <%=GetGlobalResourceObject("ManageNotification_Resource", "equipment")%> 
                                        </span><i class="tiny-leftmargin cursor-pointer "></i>
                                    </th>
                                    <th id="thEquipmentType" data-bind="visible: $root.IsEquipemntSelected()" runat="server" enableviewstate="false" style="white-space: nowrap;" class="bg-graylight cursor-pointer center-align">
                                        <span class="underline">
                                            <%=GetGlobalResourceObject("ManageNotification_Resource", "equipmentType")%> 
                                        </span><i class="tiny-leftmargin cursor-pointer "></i>
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="tbodypositionfixed" runat="server" data-bind="foreach: FLocationOrEquipmentList()">
                                <tr class="cursor-pointer" onclick="javascript: SelectFlocationOrEquipment(this,false); return false;" data-bind="attr: { class: IsSelected ? 'bg-info cursor-pointer' : 'cursor-pointer' }" ondblclick="javascript: SelectFlocationOrEquipment(this,true); return false;">
                                    <td><i class="fa big white" data-bind="attr: { class: IsSelected ? 'fa big white fa-hand-o-right' : 'fa big white' }"></i></td>
                                    <td class="nowrap" data-bind="text: FLocationName"></td>
                                    <td class="nowrap" data-bind="text: EquipmentName, visible: $root.IsEquipemntSelected()"></td>
                                    <td class="nowrap" data-bind="text: EquipmentType, visible: $root.IsEquipemntSelected()"></td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr data-bind="visible: LoadErrorMessageVisible()">
                                    <td class="center-align" colspan="10">
                                        <span data-bind="text: LoadErrorMessage(), attr: { class: LoadErrorMessageClass }"></span>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="10">
                                        <div data-bind="html: PagerData()" class="pagination text-md-center m-a-0 col-xs-12">
                                        </div>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
            </div>
        </div>
    </div>

    <div id="divAddMaintenanceTypeModal" class="modal fade in" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" id="btnCloseMaintenanceTypeModal" onclick="ClearMaintenanceTypeInfo(); return false;" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h5>
                        <%=GetGlobalResourceObject("ManageNotification_Resource", "NotificationTypeInformation")%>
                    </h5>
                </div>
                <div class="modal-body" style="min-height: 190px; overflow: hidden;">
                    <fieldset class="info-block bottom-gap">
                        <legend class="search-legend cursor-pointer" id="legSearchCriteria"><i class="fa fa-caret-down tiny-rightmargin"></i><%=GetGlobalResourceObject("ManageNotification_Resource", "defineSearchCriteria")%></legend>
                        <div class="push-up">
                            <label class="pull-xs-left form-control-label">
                                <%=GetGlobalResourceObject("ManageNotification_Resource", "notificationType")%>
                            </label>
                            <input type="text" id="txtSearchMaintType" maxlength="30" class="form-control-sm pull-xs-left col-xs-12 col-md-5" />
                            <button id="btnSearch" class="btn-sm btn btn-normal  bottom-gap  tiny-leftmargin pull-xs-left" onclick="SearchMaintTypes();return false;">
                                <i class="fa fa-search"></i>
                            </button>
                            <button id="btnShowAll" class="btn-sm btn btn-primary hide pull-xs-left  tiny-leftmargin" onclick="ShowAllMaintTypes();return false;">
                                <%=GetGlobalResourceObject("ManageNotification_Resource", "showAll")%>
                            </button>
                            <span class="text-danger font-small pull-xs-left tiny-leftmargin push-down" id="spnSearchError"></span>
                        </div>
                    </fieldset>
                    <fieldset class="info-block">
                        <legend class="search-legend cursor-pointer" id="legWarehouseStockFilter"><i class="fa fa-caret-down tiny-rightmargin"></i><%=GetGlobalResourceObject("ManageNotification_Resource", "addEditNotificationType")%></legend>
                        <div class="push-up">
                            <fieldset>
                                <div class="col-xs-12 p-l-0">
                                    <label class="pull-xs-left form-control-sm col-xs-12 col-md-4">
                                        <%=GetGlobalResourceObject("ManageNotification_Resource", "notificationType")%>
                                    </label>
                                    <input type="text" id="txtNewMaintType" maxlength="30" class="pull-xs-left form-control-sm col-xs-12 col-md-6" />
                                </div>
                                <div class="col-xs-12 p-l-0">
                                    <label class="pull-xs-left form-control-sm col-xs-12 col-md-4">
                                        <%=GetGlobalResourceObject("ManageNotification_Resource", "notificationTypeCode")%>
                                    </label>
                                    <input type="text" id="txtNotificationTypeCode" maxlength="30" class="pull-xs-left form-control-sm col-xs-12 col-md-6" />
                                </div>
                            </fieldset>
                            <fieldset class="bottom-gap">
                                <span class="font-small tiny-leftmargin pull-xs-left text-danger" id="spnAddMaintTypeError"></span>
                                <div class="spinner-rectangle pull-xs-left" id="divCategoryProgress" style="display: none;">
                                </div>
                                <button onclick="ClearMaintenanceTypeInfo();return false;" class="btn btn-sm btn-cancel tiny-rightmargin pull-xs-right">
                                    <%=GetGlobalResourceObject("ManageNotification_Resource", "cancel")%>
                                </button>
                                <asp:Button ID="btnAddMaintType" btntype="add" Text="Add" CssClass="btn btn-sm btn-success tiny-rightmargin pull-xs-right"
                                    runat="server" EnableViewState="false" />
                            </fieldset>
                        </div>
                    </fieldset>

                    <fieldset class="heading-gap text-xs-right">
                        <span id="spnViewMaintTypes" onclick="javascript:ShowHideMaintTypesInfo();"><i class="cursor-pointer pull-right blue fa fa-plus-circle  font-bigger tiny-rightmargin"
                            id="iconViewMaintTypes"></i><span id="spnViewAllMaintTypes" class="pull-right bold blue cursor-pointer font-small">
                                <%=GetGlobalResourceObject("ManageNotification_Resource", "clickHereToViewNotificationTypes")%></span> </span>
                    </fieldset>
                    <div id="divMaintTypes" class="scroll-auto" style="max-height: 300px;">
                        <div class="table-side-box-heading">
                            <span class="m-l-1"><%=GetGlobalResourceObject("ManageNotification_Resource", "listofNotificationTypes")%></span>
                        </div>
                        <span id="divMaintTypesProgress" class="spinner-circle-big hide"></span>
                        <table id="tableMaintTypes" class="table table-bordered m-b-0">
                            <thead>
                                <tr>
                                    <th style="width: 20%" class="bg-graylight center-align">
                                        <%=GetGlobalResourceObject("ManageNotification_Resource", "action")%>
                                    </th>
                                    <th id="thMaintTypes" runat="server" enableviewstate="false" style="width: 30%; white-space: nowrap;" class="bg-graylight cursor-pointer center-align">
                                        <span class="underline">
                                            <%=GetGlobalResourceObject("ManageNotification_Resource", "notificationType")%> 
                                        </span><i class="tiny-leftmargin cursor-pointer "></i>
                                    </th>
                                    <th style="width: 50%; white-space: nowrap;" class="bg-graylight center-align">
                                        <%=GetGlobalResourceObject("ManageNotification_Resource", "notificationTypeCode")%>
                                    </th>
                                </tr>
                            </thead>
                            <tbody id="tbdMaintTypes" class="tbodypositionfixed" runat="server" data-bind="foreach: $root.DefaultMaintenanceTypesArray()">
                                <tr>
                                    <td class="center-align">
                                        <i class="fa fa-edit linkcolor i-action tiny-leftmargin tiny-rightmargin v-icon  cursor-pointer" data-bind="click: $root.HasMaintTypeAccess ? function () { ShowEditMaintTypes(MasterDataID, MasterDataName, Description); } : '', attr: BindIconAttributes($root.HasMaintTypeAccess)  " title="<%=GetGlobalResourceObject("ManageNotification_Resource", "edit")%>"></i>
                                        <i class="fa fa-trash-o text-danger i-action tiny-leftmargin tiny-rightmargin v-icon  cursor-pointer" data-bind="click: $root.HasDeleteMaintTypeAccess ? function () { DeleteMaintTypeClick(MasterDataID); } : '', attr: BindIconAttributes($root.HasDeleteMaintTypeAccess)" title="<%=GetGlobalResourceObject("ManageNotification_Resource", "delete")%>"></i>
                                    </td>
                                    <td class="nowrap" data-bind="text: MasterDataName"></td>
                                    <td class="nowrap" data-bind="text: Description"></td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr data-bind="visible: LoadErrorMessageVisible()">
                                    <td class="center-align" colspan="10">
                                        <span data-bind="text: LoadErrorMessage(), attr: { class: LoadErrorMessageClass }"></span>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="10">
                                        <div data-bind="html: MaintTypePagerData()" class="pagination text-md-center m-a-0 col-xs-12">
                                        </div>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
            </div>
        </div>
    </div>

    <div id="rejectReasonModal" class="modal fade in" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" id="btnCloseRejectModal" onclick="ClearRejectReasonInfo(); return false;" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                    <h5 id="rejectReasonHeader">
                        <%=GetGlobalResourceObject("ManageNotification_Resource", "rejectReason")%>  
                    </h5>
                </div>
                <div class="modal-body" style="min-height: 190px; overflow: hidden;">
                    <fieldset id="rejectReasonDiv" class="heading-gap">
                        <textarea id="txtRejectReason" maxlength="500" class="form-control-lg font-small col-xs-12" style="min-height: 130px"></textarea>
                    </fieldset>
                </div>
                <div class="modal-footer">
                    <p id="saveReasonMessage" class="pull-xs-left red"></p>
                    <a id="saveReasonLink" class="btn btn-success btn-sm pull-xs-right" onclick=" AddUpdateNotification(true); return false;">
                        <%=GetGlobalResourceObject("ManageNotification_Resource", "save")%> </a>
                </div>
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

    <div id="closeNotificationModal" class="modal fade in" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" id="btnCloseCloseNotificationModal" onclick="ClearRejectReasonInfo(); return false;" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                    <h5>
                        <%=GetGlobalResourceObject("ManageNotification_Resource", "closeNotification")%>  
                    </h5>
                </div>
                <div class="modal-body" style="min-height: 190px; overflow: hidden;">
                    <fieldset class="heading-gap">
                        <label class="form-control-label col-xs-12 col-lg-3"><%=GetGlobalResourceObject("ManageNotification_Resource", "timeSpent")%></label>
                        <input type="text" maxlength="20" onkeypress="return isNumberKey(event)" class="form-control-sm col-xs-12 col-lg-3 v-tiny-rightmargin" data-bind="textInput:TimeSpent">
                        <select id="ddlTimeUnit" class="form-control-sm col-xs-12 col-lg-2" style="display: block" data-bind="options: UnitOfTimeList, optionsText: 'DisplayName', optionsValue: 'TypeValue'">
                                    </select>
                    </fieldset>
                    <fieldset class="heading-gap">
                        <label class="form-control-label col-xs-12 col-lg-3"><%=GetGlobalResourceObject("ManageNotification_Resource", "workStartDate")%></label>
                        <input type="text" id="txtWorkStartDate" class="form-control-sm cursor-pointer col-xs-12 col-lg-3 v-tiny-rightmargin" />
                        <input type="text" id="txtWorkStartTime" class="form-control-sm cursor-pointer col-xs-12 col-lg-2" />
                    </fieldset>
                    <fieldset class="heading-gap">
                        <label class="form-control-label col-xs-12 col-lg-3"><%=GetGlobalResourceObject("ManageNotification_Resource", "workEndDate")%></label>
                        <input type="text" id="txtWorkEndDate" class="form-control-sm cursor-pointer col-xs-12 col-lg-3 v-tiny-rightmargin" />
                        <input type="text" id="txtWorkEndTime" class="form-control-sm cursor-pointer col-xs-12 col-lg-2" />
                    </fieldset>
                    <fieldset class="heading-gap">
                        <label class="form-control-label col-xs-12 col-lg-3"><%=GetGlobalResourceObject("ManageNotification_Resource", "remark")%></label>
                        <textarea id="txtCloseRemark" maxlength="500" data-bind="textInput: Remark, attr: { onkeydown: 'return checkTextAreaMaxLength(this,event,500)' }" class="form-control-sm font-small col-xs-12 col-lg-12" style="min-height: 150px"></textarea>
                    </fieldset>
                </div>
                <div class="modal-footer">
                    <p id="saveCloseNotificationMessage" class="pull-xs-left red"></p>
                    <a id="saveCloseNotification" class="btn btn-success btn-sm pull-xs-right" onclick=" CloseNotificationInfo(); return false;">
                        <%=GetGlobalResourceObject("ManageNotification_Resource", "save")%> </a>
                </div>
            </div>
        </div>
    </div>

    <div class="small-popup">
        <div id="confirmModal" style="z-index: 5000">
            <div>
                <p id="alertMessage">
                </p>
            </div>
        </div>
    </div>
</asp:Content>
