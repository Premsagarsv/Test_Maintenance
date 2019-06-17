<%@ Page Title="" Language="C#" MasterPageFile="~/Vegam-Responsive.Master" AutoEventWireup="true" CodeBehind="CreateWorkGroup.aspx.cs" Inherits="Vegam_MaintenanceModule.Preventive.CreateWorkGroup" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <asp:ScriptManager ID="scriptManager" runat="server" EnableViewState="false">
    </asp:ScriptManager>

    <link href="<%=ConfigurationManager.AppSettings["MaintCssPath"].TrimEnd('/') %>/Styles/themes/default/style.css" rel="stylesheet" type="text/css" />
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/Vegam_CreateWorkGroup.js" type="text/javascript"></script>
    <script type="text/javascript" src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/iPAS_Common_v4.js"></script>
    <script type="text/javascript" src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/autogrow.js"></script>   
    <style>
        
        .rside-box {
            box-shadow: 0 0 10px 10px #f5f5f5;
            padding-top: 2px;
            overflow: auto;
            border: 1px solid #f3f1f1;
            min-height: 97vh
        }

        .horizontalLine {
            margin-top: 0px !important;
        }

        .v-icon {
            font-size: 20px;
            margin-left: 5px;
            margin-right: 5px;
            margin-top: 2px;
            float: left;
        }

        .border-bottom {
            border-bottom: 1.5px solid #eee
        }
     
        i[disabled] {
            color: #9e9e9e !important;
            cursor: default;
        }

        .ui-autocomplete-input {
            z-index: 100;
        }
        .ui-autocomplete-input {
            /*position: absolute;*/
            cursor: default;
            z-index: 1001 !important;
        }
        /* IE 6 doesn't support max-height we use height instead, but this forces the menu to always be this tall */
        * html .ui-autocomplete-input {
            height: 150px;
        }
        .border-red{
            border-color:red !important
        }
    </style>

    <div class="col-xs-12 push-down p-x-0 bottom-gap" id="divWorkGroup">

        <div id="divWorkGroupList" class="col-xs-12 col-lg-4 pull-xs-right bottom-gap push-down p-r-0">
            <fieldset class="rside-box">
                <div class="tiny-padding col-xs-12" style="border-bottom: 1.5px solid #eee;">
                    <fieldset class="push-down">
                        <label class="form-control-label pull-xs-left gray"><%=GetGlobalResourceObject("WorkGroup_Resource", "workGroupName")%></label>
                        <input type="text" class="form-control-sm col-xs-12 col-lg-7 gray" id="txtSearchWorkGroupName" onkeyup="LoadWorkGroupList()" placeholder="<%=GetGlobalResourceObject("WorkGroup_Resource", "searchWorkGroup")%>" />
                    </fieldset>
                </div>
                <fieldset class="tiny-padding p-b-0">
                    <fieldset data-bind="foreach: MasterDataInfoList">
                        <div class="col-xs-12 p-a-0 bottom-gap">
                            <i class="fa fa-trash-o v-icon cursor-pointer text-danger" title="Delete"
                                data-bind="css: 'cursor-pointer', click: (workGroupViewModel.HasDeleteAccess) ? function () { DeleteWorkGroupClick(MasterDataID) } : '', attr: BindIconAttributes(workGroupViewModel.HasDeleteAccess)"></i>
                            <label class="col-xs-8 col-lg-9 tiny-leftmargin p-l-0 m-b-0 p-b-0 cursor-pointer" style="border-bottom: 1px solid #ccc"
                                data-bind="css: IsSelected() == true ? 'bg-info' : '', click: function () { SelectedWorkGroupInfo(MasterDataID) }">
                                <span data-bind="text: MasterDataName"></span>
                            </label>
                        </div>
                    </fieldset>
                </fieldset>

                <div id="divLoadProgressVisible" class="spinner-circle-big hide"></div>
                <div class="col-xs-12 center-align">
                    <span data-bind="text: MasterDataInfoList().length > 0 ? '' : 'No record found'" class="font-small text-xs-center tiny-leftmargin gray center-align"></span>
                </div>

            </fieldset>
        </div>

        <div id="divWorkGroupInfoList" class="col-xs-12 col-sm-12 col-lg-8 rside-box push-down">
            <fieldset class="heading-gap">
                <label class="form-control-label col-xs-12 col-lg-5"><%=GetGlobalResourceObject("WorkGroup_Resource", "workGroupName")%></label>
                <div class="col-xs-12 col-lg-7 p-a-0">
                    <input type="text" id="txtWorkGroupName" maxlength="50"  data-bind="textInput: MasterDataName" class="form-control-sm col-xs-7 col-lg-6 col-xl-7">
                </div>
            </fieldset>
            <fieldset class="bottom-gap ">
                <label class="form-control-label col-xs-12 col-lg-5"><%=GetGlobalResourceObject("WorkGroup_Resource", "description")%></label>
                <textarea id="txtDescription" maxlength="100" data-bind="textInput: Description, attr: { onkeydown: 'return checkTextAreaMaxLength(this,event,100)' }" class="form-control-lg font-small col-xs-12 col-lg-7" style="min-height: 60px"></textarea>
            </fieldset>
            <div class="col-xs-12 p-x-0 bottom-gap">
                <label class="medium-rightmargin bold pull-xs-left">
                    <i id="iPlusAssignee" class="fa fa-minus-circle tiny-rightmargin blue font-big cursor-pointer" onclick="HideShowAssigneeOrReportTo(this,'divAssignee',false); return false;"></i>
                    <%=GetGlobalResourceObject("WorkGroup_Resource", "assignee")%>
                </label>
                <div id="divAddMore" class=" pull-xs-left">
                    <a id="btnAddMoreAssignee" class="underline" data-bind="click: $root.HasEditAccess ? addNewAssigneeRow : ''"><%=GetGlobalResourceObject("WorkGroup_Resource", "addMore")%></a>
                </div>
                
                <div id="divAssignee" class="col-xs-12 p-x-0" style="max-height:300px;overflow:auto">
                    <div class="table-responsive">
                        <table id="tblAssignee" class="table table-bordered">
                            <thead>
                                <tr>
                                    <th class="center-align" style="width: 15%;">
                                        <%=GetGlobalResourceObject("WorkGroup_Resource", "userName")%>
                                    </th>
                                    <th class="center-align nowrap" style="width: 15%;">
                                        <%=GetGlobalResourceObject("WorkGroup_Resource", "scheduleNotification")%>
                                    </th>
                                    <th class="center-align nowrap" style="width: 10%;">
                                        <%=GetGlobalResourceObject("WorkGroup_Resource", "onWorkStatement")%>
                                    </th>
                                    <th class="center-align" style="width: 13%;">
                                        <%=GetGlobalResourceObject("WorkGroup_Resource", "onComplete")%>
                                    </th>
                                    <th class="center-align" style="width: 13%;">
                                        <%=GetGlobalResourceObject("WorkGroup_Resource", "onReportIssue")%>
                                    </th>
                                    <th class="center-align" style="width: 13%;">
                                        <%=GetGlobalResourceObject("WorkGroup_Resource", "onDowntime")%>
                                    </th>
                                    <th class="center-align" style="width: 12%;"> <%=GetGlobalResourceObject("WorkGroup_Resource", "action")%>
                                    </th>
                                </tr>
                            </thead>
                            <tbody id="tbAssignee" data-bind="foreach: workGroupViewModel.WorkGroupAssigneeList" class="tbody">
                                <tr data-bind="attr: { id: 'trAssigneeInfoList_' + ($index()) }">
                                    <td>
                                        <input type="text" id="txtAssigneeUserName" maxlength="20" class="form-control-sm ui-autocomplete-input m-a-0"
                                            onkeypress='javascript:LoadUserNameForAutoComplete(this)' data-bind="textInput: UserName, attr: { id: 'txtAssigneeUserName_' + ($index()) }" />
                                    </td>
                                    <td class="center-align" data-bind="attr: { id: 'AssigneeScheduleNotify_' + ($index()), onclick: 'javascript:MarkCheckAssigneeBind(' + $index() + ',this);return false;'}">
                                        <img class="fa fa-sticky-note orange big comment-link" data-bind="attr: { src: IsScheduleNotification() == true ? workGroupViewModel.CheckImagePath() : workGroupViewModel.UnCheckImagePath() }" /></td>
                                    
                                    <td class="center-align" data-bind="attr: { id: 'AssigneeOnWork_' + ($index()), onclick: 'javascript:MarkCheckAssigneeBind(' + $index() + ',this);return false;'}">
                                        <img class="fa fa-sticky-note orange big comment-link" data-bind=" attr: { src: IsOnWork() == true ? workGroupViewModel.CheckImagePath() : workGroupViewModel.UnCheckImagePath() }" /></td>
                                    
                                    <td class="center-align" data-bind="attr: { id: 'AssigneeOnComplete_' + ($index()), onclick: 'javascript:MarkCheckAssigneeBind(' + $index() + ',this);return false;'}">
                                        <img class="fa fa-sticky-note orange big comment-link" data-bind="attr: { src: IsOnComplete() == true ? workGroupViewModel.CheckImagePath() : workGroupViewModel.UnCheckImagePath() }" /></td>
                                    
                                    <td class="center-align" data-bind="attr: { id: 'AssigneeOnReport_' + ($index()), onclick: 'javascript:MarkCheckAssigneeBind(' + $index() + ',this);return false;'}">
                                        <img class="fa fa-sticky-note orange big comment-link" data-bind="attr: { src: IsOnReport() == true ? workGroupViewModel.CheckImagePath() : workGroupViewModel.UnCheckImagePath() }" /></td>
                                    
                                    <td class="center-align" data-bind=" attr: { id: 'AssigneeOnDowntime_' + ($index()), onclick: 'javascript:MarkCheckAssigneeBind(' + $index() + ',this);return false;'}">
                                        <img class="fa fa-sticky-note orange big comment-link" data-bind="attr: { src: IsOnDowntime() == true ? workGroupViewModel.CheckImagePath() : workGroupViewModel.UnCheckImagePath() }" /></td>

                                    <td class="center-align">
                                        <i class="fa fa-trash-o text-danger cursor-pointer" style="opacity:0.6;font-size:20px" data-bind="click: ($root.HasEditAccess) ? function () { DeleteWorkGroupUserClick($data, $index()) } : '', attr: BindIconAttributes($root.HasEditAccess)" title="Delete"></i>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="col-xs-12 p-x-0 bottom-gap">
                <label class="medium-rightmargin bold pull-xs-left">
                    <i id="iPlusReportingTo" class="fa fa-minus-circle tiny-rightmargin blue font-big cursor-pointer" onclick="HideShowAssigneeOrReportTo(this,'divReportingTo',false); return false;"></i>
                    <%=GetGlobalResourceObject("WorkGroup_Resource", "reportingTo")%>
                </label>
                <div id="divAddMoreReportingTo" class=" pull-xs-left">
                    <a id="btnAddMoreReport" class="underline push-down pull-down" data-bind="click: $root.HasEditAccess ? addNewReportRow : ''"><%=GetGlobalResourceObject("WorkGroup_Resource", "addMore")%></a>
                </div>
                
                <div id="divReportingTo" class="col-xs-12 p-x-0" style="max-height:300px;overflow:auto">
                    <div class="table-responsive">
                        <table id="tblReportingTo" class="table table-bordered m-b-0">
                            <thead>
                                <tr>
                                    <th class="center-align" style="width: 15%;">
                                        <%=GetGlobalResourceObject("WorkGroup_Resource", "userName")%>
                                    </th>
                                    <th class="center-align nowrap" style="width: 15%;">
                                        <%=GetGlobalResourceObject("WorkGroup_Resource", "scheduleNotification")%>
                                    </th>
                                    <th class="center-align nowrap" style="width: 10%;">
                                        <%=GetGlobalResourceObject("WorkGroup_Resource", "onWorkStatement")%>
                                    </th>
                                    <th class="center-align " style="width: 13%;">
                                        <%=GetGlobalResourceObject("WorkGroup_Resource", "onComplete")%>
                                    </th>
                                    <th class="center-align" style="width: 13%;">
                                        <%=GetGlobalResourceObject("WorkGroup_Resource", "onReportIssue")%>
                                    </th>
                                    <th class="center-align" style="width: 13%;">
                                        <%=GetGlobalResourceObject("WorkGroup_Resource", "onDowntime")%>
                                    </th>
                                    <th class="center-align" style="width: 12%;">Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody id="tbReportingTo" data-bind="foreach: workGroupViewModel.WorkGroupReporterList" class="tbody">
                                <tr data-bind="attr: { id: 'trReportingToInfoList_' + ($index()) }">
                                    <td>
                                        <input type="text" maxlength="20" autocomplete="off" class="form-control-sm m-a-0 ui-autocomplete-input"
                                            onkeypress='javascript:LoadUserNameForAutoComplete(this)' data-bind="textInput: UserName, attr: { id: 'txtReportUserName_' + ($index()) }" />
                                    </td>
                                    <td class="center-align" data-bind="attr: { id: 'ReportScheduleNotify_' + ($index()), onclick: 'javascript:MarkCheckReportToBind(' + $index() + ',this);return false;' }">
                                        <img class="fa fa-sticky-note orange big comment-link" data-bind="attr: {src: IsScheduleNotification() == true ? workGroupViewModel.CheckImagePath() : workGroupViewModel.UnCheckImagePath() }" /></td>
                                    
                                    <td class="center-align" data-bind="attr: { id: 'ReportOnWork_' + ($index()), onclick: 'javascript:MarkCheckReportToBind(' + $index() + ',this);return false;' }">
                                        <img class="fa fa-sticky-note orange big comment-link" data-bind="attr: {src: IsOnWork() == true ? workGroupViewModel.CheckImagePath() : workGroupViewModel.UnCheckImagePath() }" /></td>
                                    
                                    <td class="center-align" data-bind="attr: { id: 'ReportOnComplete_' + ($index()), onclick: 'javascript:MarkCheckReportToBind(' + $index() + ',this);return false;'}">
                                        <img class="fa fa-sticky-note orange big comment-link" data-bind="attr: {src: IsOnComplete() == true ? workGroupViewModel.CheckImagePath() : workGroupViewModel.UnCheckImagePath() }" /></td>
                                    
                                    <td class="center-align" data-bind="attr: { id: 'ReportOnReport_' + ($index()), onclick: 'javascript:MarkCheckReportToBind(' + $index() + ',this);return false;' }">
                                        <img class="fa fa-sticky-note orange big comment-link" data-bind="attr: { src: IsOnReport() == true ? workGroupViewModel.CheckImagePath() : workGroupViewModel.UnCheckImagePath() }" /></td>
                                    
                                    <td class="center-align" data-bind="attr: { id: 'ReportOnDowntime_' + ($index()), onclick: 'javascript:MarkCheckReportToBind(' + $index() + ',this);return false;'}">
                                        <img class="fa fa-sticky-note orange big comment-link" data-bind="attr: {src: IsOnDowntime() == true ? workGroupViewModel.CheckImagePath() : workGroupViewModel.UnCheckImagePath() }" /></td>

                                    <td class="center-align">
                                        <i class="fa fa-trash-o text-danger cursor-pointer" style="opacity:0.6;font-size:20px" data-bind="click: ($root.HasEditAccess) ? function () { DeleteWorkGroupUserClick($data, $index()) } : '', attr: BindIconAttributes($root.HasEditAccess)" title="Delete"></i>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="col-xs-12 push-down">
                <button id="btnCancelWorkGroup" onclick="ClearWorkGroupInfo(); return false;" class="btn btn-sm btn-cancel pull-xs-right tiny-rightmargin"><%=GetGlobalResourceObject("WorkGroup_Resource", "cancel")%></button>
                <button id="btnSaveWorkGroup" class="btn btn-sm btn-success pull-xs-right tiny-rightmargin" data-bind="click: ($root.HasEditAccess) ? function () { InsertUpdateWorkGroupInfo() } : '', attr: BindIconAttributes($root.HasEditAccess)"><%=GetGlobalResourceObject("WorkGroup_Resource", "save")%></button>

            </div>
            <fieldset class="col-xs-12">
                    <div data-bind="visible: LoadErrorMessageVisible">
                        <span data-bind="html: LoadErrorMessage, attr: { class: LoadErrorMessageClass }"></span>
                    </div>
                    <span id="spnErrorMsg" class="text-info"></span>
             </fieldset>

        </div>       
        <div class="small-popup">
            <div id="confirmModal" style="z-index: 5000">
                <div>
                    <p id="alertMessage">
                    </p>
                </div>
            </div>
        </div>
    </div>
</asp:Content>