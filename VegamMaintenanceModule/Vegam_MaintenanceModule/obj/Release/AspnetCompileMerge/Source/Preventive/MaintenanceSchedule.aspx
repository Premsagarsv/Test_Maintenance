<%@ Page Title="" Language="C#" MasterPageFile="~/Vegam-Responsive.Master" AutoEventWireup="true" CodeBehind="MaintenanceSchedule.aspx.cs" Inherits="Vegam_MaintenanceModule.Preventive.MaintenanceSchedule" %>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/Vegam_MaintenanceSchedule.js" type="text/javascript"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/ajaxfileupload.js" type="text/javascript"></script>
    <script type="text/javascript" src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/jquery.ui.timepicker.js"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/select3.js"></script>
    <script type="text/javascript" src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/iPAS_Pager.js"></script>
    <link href="<%= ConfigurationManager.AppSettings["MaintCssPath"].TrimEnd('/') %>/Styles/proplan_v7.css" rel="stylesheet" type="text/css" />
    <link href="<%= ConfigurationManager.AppSettings["MaintCssPath"].TrimEnd('/') %>/Styles/select2.css" rel="stylesheet" type="text/css" />
    <script>
        jQuery(document).ready(function () {

            jQuery("textarea").addClass("font-small");
            jQuery("textarea").css({ "resize": "none", "overflow": "hidden" });
            jQuery("textarea").keyup(function (e) {
                autoheight(this);
            });

            //List Drag & drop functionality
            jQuery(".sorting-contain").sortable({
                stop: function () {
                    SaveTaskSequence();
                }
            });
            jQuery(".sorting-contain").disableSelection();
            //End List Drag & drop


        });

        function autoheight(a) {
            if (!jQuery(a).prop('scrollTop')) {
                do {
                    var b = $(a).prop('scrollHeight');
                    var h = $(a).height();
                    jQuery(a).height(h - 5);
                }
                while (b && (b != jQuery(a).prop('scrollHeight')));
            };
            jQuery(a).height(jQuery(a).prop('scrollHeight') + 5);
        }

        function Toggle(elm) {
            var toggleDiv = $(elm).parent('div').next('div');
            if ($(elm).hasClass('fa-plus-circle')) {
                $(elm).removeClass('fa-plus-circle').addClass('fa-minus-circle');
                $(elm).parent('div').css({ "border-bottom": "" })
            } else {
                $(elm).removeClass('fa-minus-circle').addClass('fa-plus-circle');
                $(elm).parent('div').css({ "border-bottom": "1px solid #c1c1c1" })
            }
            if ($(toggleDiv).hasClass('show')) {
                $(toggleDiv).removeClass('show').addClass('hide');
            } else {
                $(toggleDiv).removeClass('hide').addClass('show');
            }
        }

        function divCollapseContent(taskEle) {
            if (jQuery(taskEle).closest(".p-listing").find(".divElementHide").hasClass("hide")) {
                jQuery(taskEle).closest(".p-listing").find(".divElementHide").removeClass("hide").closest(".heightcontent").attr('style', 'min-height: 430px !important');
                jQuery(taskEle).toggleClass("fa-plus-circle fa-minus-circle");
            } else {
                jQuery(taskEle).closest(".p-listing").find(".divElementHide").addClass("hide").closest(".heightcontent").attr('style', 'min-height: 37px !important');
                jQuery(taskEle).toggleClass("fa-plus-circle fa-minus-circle");
            }
        }
    </script>
    <style>
        .pro-plan .dropdown-menu {
            min-width: 140px !important;
        }

        .img-border:nth-child(odd) {
            border-right: 1px solid #cdd2d2;
        }

        .img-border {
            border-bottom: 1px solid #cdd2d2;
        }

        .add-btn {
            margin-top: -25px !important
        }

        .addlabel {
            margin-top: -25px;
        }

        .info-block .addlabel {
            margin-top: 15px;
        }

        .li-disabled {
            pointer-events: none;
            opacity: 0.6;
        }

        .rside-box {
            box-shadow: 0 0 10px 10px #f5f5f5;
            min-height: 95vh;
            padding-top: 2px;
            overflow: auto;
            border: 1px solid #f3f1f1;
        }

        .lside-box {
            box-shadow: 0 0 10px 10px #f5f5f5;
            min-height: 95vh;
            overflow: auto;
            border: 1px solid #f3f1f1;
        }

        .select2-container {
            z-index: 100;
            width: 100% !important;
        }

        .ui-autocomplete {
            z-index: 99999 !important;
        }

        .ui-timepicker {
            z-index: 9999 !important;
        }

        .process-step .btn:focus {
            outline: none
        }

        .process {
            display: table;
            width: 100%;
            position: relative
        }

        .process-row {
            display: table-row
        }

        .process-step button[disabled] {
            opacity: 1 !important;
            filter: alpha(opacity=100) !important
        }

        .process-row:before {
            top: 20px;
            bottom: 0;
            position: absolute;
            content: " ";
            width: 100%;
            height: 1px;
            background-color: #ccc;
            z-order: 0
        }

        .process-step {
            display: table-cell;
            text-align: left;
            position: relative;
            width: 25%;
            padding-left: 25px
        }

            .process-step p {
                position: absolute;
                left: 100px
            }

        .btn-circle {
            border-radius: 50%;
            height: 40px;
            width: 40px
        }

        .border-heading {
            padding-top: 4px;
            padding-bottom: 0px;
            background: #e1e1e1;
            height: 30px;
            border: 1px solid #c2c2c2;
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

        .box-shadow {
            box-shadow: 0 0 5px 5px #eee;
        }

        .border-bottom {
            border-bottom: 1px solid #ccc;
        }

        .sorting-contain {
            counter-reset: slides;
            position: absolute;
            margin-top: 15%;
            top: 0;
            left: 0;
            padding: 0rem 1rem 1rem 0.5rem;
            height: 100%;
        }


        .sorting-element {
            position: relative;
            user-select: none;
        }

        .ui-sortable-helper {
            transition: none !important;
            animation: alternate infinite;
            left: 10px !important;
            width: 300px !important;
            background-color: #cccccc;
        }

        .fa-2x {
            font-size: 1.4em !important;
        }

        .process-step .btn:focus {
            outline: none
        }

        .process {
            display: table;
            width: 100%;
            position: relative
        }

        .process-row {
            display: table-row
        }

        .process-step button[disabled] {
            opacity: 1 !important;
            filter: alpha(opacity=100) !important
        }

        .process-row:before {
            top: 20px;
            bottom: 0;
            position: absolute;
            content: " ";
            width: 100%;
            height: 1px;
            background-color: #ccc;
            z-order: 0
        }

        .process-step {
            display: table-cell;
            text-align: left;
            position: relative;
            width: 25%;
            padding-left: 25px
        }

            .process-step p {
                position: absolute;
                left: 100px
            }

        .btn-circle {
            border-radius: 50%;
            height: 40px;
            width: 40px
        }
    </style>

    <asp:ScriptManager ID="scriptManager" runat="server" EnableViewState="false">
    </asp:ScriptManager>
    <input id="hdnPageSize" type="hidden" runat="server" enableviewstate="false" value="10" />
    <input type="hidden" id="hdfSortValue" />
    <div class="pro-plan col-xs-12" id="divMaintenanceSchedule">
        <div class="col-xs-12">
            <div class="process push-up bottom-gap" id="divTabInfo">
                <div class="process-row nav nav-tabs">
                    <div class="process-step">
                        <p class="p-y-0 m-b-0">
                            <a><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "maintenanceInfo")%></a>
                        </p>
                        <button type="button" id="btnMaintInfo" class="btn btn-sm btn-circle btn-info" data-toggle="tab" href="#menu1"><i class="fa fa-info"></i></button>
                    </div>
                    <div class="process-step">
                        <p class="p-y-0 m-b-0">
                            <a><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "workInstruction")%></a>
                        </p>
                        <button type="button" id="btnWorkInstruction" class="btn btn-sm btn-circle btn-default" data-toggle="tab" href="#menu2"><i class="fa fa-file-text-o"></i></button>
                    </div>
                    <div class="process-step" id="divScheduleTab">
                        <p class="p-y-0 m-b-0">
                            <a><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "schedule")%></a>
                        </p>
                        <button type="button" id="btnScheduleInfo" class="btn btn-sm btn-circle btn-default" data-toggle="tab" href="#menu3"><i class="fa fa-calendar"></i></button>
                    </div>
                </div>
            </div>
            <div class="tab-content">
                <div id="divMaintenanceInfo" class="tab-pane fade active in">
                    <div class="push-down">
                        <div class="col-xs-12 col-lg-8">
                            <div class="lside-box push-down p-l-1">
                                <fieldset class="push-down">
                                    <label class="form-control-label col-xs-12 col-lg-3" style="margin-left: 13px !important"><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "maintenanceName")%></label>
                                    <input type="text" maxlength="50" id="txtMaintenanceName" class="form-control-sm col-xs-12 col-lg-6">
                                    <button id="btnActivateSchedule" type="button" class="btn btn-sm btn-success pull-xs-right tiny-rightmargin" runat="server" enableviewstate="false" data-bind="visible: ShowActivateSchedule">Activate</button>
                                    <label class="form-control-label pull-xs-right blue" data-bind="visible: ShowActivateSchedule() == false">Scheduling In-Progress</label>
                                </fieldset>
                                <fieldset>
                                    <label class="form-control-label col-xs-12 col-lg-3" style="margin-left: 13px !important"><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "description")%></label>
                                    <textarea maxlength="200" id="txtMaintenanceDesc" onkeydown="return AutosizeTextArea(this)" class="form-control-sm col-xs-12 col-lg-6 font-small" style="min-height: 85px; overflow-y: auto"></textarea>
                                </fieldset>
                                <fieldset>
                                    <label class="form-control-label col-xs-12 col-lg-3" style="margin-left: 13px !important"><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "maintenanceType")%></label>
                                    <div class="col-xs-11 col-lg-6 p-x-0">
                                        <select id="ddlSelectMaintenanceType" class="form-control-sm Parameters-Select" data-bind="options: MaintenanceTypeList, optionsText: 'MasterDataName', optionsValue: 'MasterDataID', optionsCaption: '<%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "select")%>'"></select>
                                    </div>
                                    <a id="lnkAddMaintenanceType" onclick="javascript:ShowAddMaintenanceTypeModal();"><i class="fa fa-plus-circle blue tiny-leftmargin" data-placement="top" title="<%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "clickHereToAddMaintType")%>" style="font-size: 25px;"></i></a>
                                </fieldset>
                                <fieldset class="push-down">
                                    <input type="radio" name="rdbFloactionOrEquipment" value="equipment" class="form-control-sm pull-xs-left" checked>
                                    <label class="form-control-label col-xs-12 col-lg-3"><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "selectEquipment")%></label>
                                    <input type="text" maxlength="50" id="txtEquipmentName" equipmentnum="" equipmentimg="" class="form-control-sm col-xs-12 col-lg-6" data-bind="disable: !IsFLocationDisabled()">
                                </fieldset>
                                <fieldset>
                                    <label class="form-control-label col-xs-12 col-lg-3 center-align"><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "or")%></label>
                                </fieldset>
                                <fieldset>
                                    <input type="radio" name="rdbFloactionOrEquipment" value="flocation" class="form-control-sm pull-xs-left">
                                    <label class="form-control-label col-xs-12 col-lg-3"><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "selectFLocation")%></label>
                                    <input type="text" maxlength="50" id="txtFLoactionName" flocationnum="" flocationimg="" class="form-control-sm col-xs-12 col-lg-6" data-bind="disable: IsFLocationDisabled()">
                                </fieldset>
                                <fieldset class="push-down">
                                    <label class="form-control-label col-xs-12 col-lg-3" style="margin-left: 13px !important"><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "priority")%></label>
                                    <div class="col-xs-12 col-lg-6 p-x-0">
                                        <select id="ddlSelectPriority" class="form-control-sm col-xs-12 Parameters-Select" data-bind="options: MaintenancePriorityList, optionsText: 'MasterDataName', optionsValue: 'MasterDataID', optionsCaption: '<%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "select")%>'"></select>
                                    </div>
                                </fieldset>
                                <fieldset data-bind="visible: IsDirectWorkOrder">
                                    <label class="form-control-label col-xs-12 col-lg-3" style="margin-left: 13px !important"><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "scheduleDate")%></label>
                                    <input type="text" id="txtScheduleDate" class="form-control-sm cursor-pointer col-xs-12 col-lg-4 v-tiny-rightmargin" />
                                    <input type="text" id="txtScheduleTime" class="form-control-sm cursor-pointer col-xs-12 col-lg-2" />
                                </fieldset>
                                <fieldset>
                                    <label class="form-control-label col-xs-12 col-lg-3" style="margin-left: 13px !important"><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "assignWorkGroup")%></label>
                                    <div class="col-xs-12 col-lg-6 p-x-0">
                                        <select id="ddlSelectWorkGroupType" class="form-control-sm col-xs-12 Parameters-Select" data-bind="options: WorkGroupTypeList, optionsText: 'MasterDataName', optionsValue: 'MasterDataID', optionsCaption: '<%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "select")%>'"></select>
                                    </div>
                                </fieldset>
                                <fieldset class="bottom-gap">
                                    <div class="col-xs-12 col-lg-9 p-r-0" style="margin-left: 13px !important">
                                        <button class="btn btn-sm btn-success pull-xs-right" id="btnSaveMaintInfo" runat="server"><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "save")%></button>
                                        <span id="divMaintProgress" class="spinner-circle-small absolute medium-leftmargin hide"></span>
                                    </div>
                                </fieldset>
                                <fieldset class="bottom-gap">
                                    <span data-bind="html: ModelErrorMsg, css: ModelErrorCss, visible: ModelErrorVisible"></span>
                                </fieldset>
                            </div>
                        </div>
                        <div class="col-xs-12 col-lg-4 pull-xs-right">
                            <div class="rside-box center-align push-down">
                                <label class="col-xs-12 bold push-down left-align" data-bind="text: $root.SelectedLocationOrEquipment"></label>
                                <div>
                                    <img id="imgFLocationOrEquipmentImage" data-bind="attr: { 'style': $root.IsDefaultImage() ? 'width: 100px; height: 100px' : 'width: 300px; height: 300px' }" class="bottom-gap push-down leftmargin pull-xs-left">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="divWorkInstructionInfo" class="tab-pane fade">
                    <div class="push-down">
                        <div class="lside-box  tiny-padding">
                            <fieldset class="push-down bottom-gap">
                                <button type="button" id="btnAddInstrManual" onclick="OnChangeBindInstruction(this)" class="btn btn-sm btn-primary tiny-rightmargin"><i class="fa fa-check tiny-rightmargin"></i>Add Instructions Manually</button>
                                <button type="button" id="btnImportInstrTaskGroup" onclick="OnChangeBindInstruction(this)" class="btn btn-sm btn-normal"><i class="fa fa-check tiny-rightmargin" style="display: none;"></i>Import Instructions from task group</button>
                            </fieldset>
                            <fieldset class="" id="divSelectTaskGroup" data-bind="visible: IsImportTaskGroup">
                                <div class="bottom-gap col-xs-12 p-a-0">
                                    <label class="form-control-label p-l-0"><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "taskGroup")%></label>
                                    <span class="blue tiny-rightmargin"><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "noTaskGroupSelected")%></span>
                                    <i class="fa fa-pencil font-big blue cursor-pointer push-down" onclick="EditTaskGroupModal(this)"></i>
                                </div>
                            </fieldset>
                            <div id="divSelectTaskGroupModal" data-backdrop="static" role="dialog" class="modal fade" aria-hidden="true">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                            <h5><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "selectTaskGroup")%>
                                            </h5>
                                        </div>
                                        <div class="modal-body" style="min-height: 190px; overflow: hidden;">
                                            <span class="blue" <%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "searchToLoadMoreTaskGroup")%>></span>
                                            <fieldset class="card">
                                                <div class="card-header bottom-gap col-xs-12 tiny-padding">
                                                    <input type="text" id="txtSearchTaskGroup" class="form-control-sm col-xs-12 col-lg-5 push-down black" placeholder="Search Task Group" onkeyup="SearchTaskGroup(this)" />
                                                </div>
                                                <div data-bind="foreach: TaskGroupList" class="card-body tiny-padding" id="divTaskGroupList">
                                                    <button type="button" class="btn btn-sm btn-primary tiny-rightmargin font-mini push-down" data-bind="attr: { id: 'btnTaskGroup_' + TaskGroupID, taskGroupId: TaskGroupID, identifier: Identifier }, click: function (data, event) { OnSelectTaskGroup(data); }"><i style="display: none;" class="fa fa-check tiny-rightmargin"></i><span data-bind="text: TaskGroupName"></span></button>
                                                </div>
                                            </fieldset>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" id="btnSaveWorkInstruction" runat="server" enableviewstate="false" class="btn btn-sm btn-success pull-xs-right heading-gap"><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "save")%></button>
                                            <span id="spnSelectTaskGroupErrorMessage" class="red pull-xs-left"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <fieldset>
                                <div class="" data-bind="visible: TaskInfoList().length > 0 && IsImportTaskGroup() ? true : false">
                                    <button type="button" id="btnShowCompleteTaskDetails" class="btn btn-sm btn-primary pull-xs-right" onclick="ShowCompleteTaskDetails()">Show Complete Task Details</button>
                                    <table class="table table-bordered" data-bind="if: ShowCompleteTaskDetails() == false">
                                        <thead>
                                            <tr>
                                                <th style="width: 25%"><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "taskName")%></th>
                                                <th style="width: 50%"><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "description")%></th>
                                                <th style="width: 25%"><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "estimatedTimeMin")%></th>
                                            </tr>
                                        </thead>
                                        <tbody data-bind="foreach: TaskInfoList">
                                            <tr>
                                                <td data-bind="text: TaskName"></td>
                                                <td data-bind="text: Description"></td>
                                                <td data-bind="text: EstimatedTime"></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div class="col-xs-12 p-x-0" data-bind="if: ShowCompleteTaskDetails">
                                        <iframe id="iFrameCompleteTaskDetail" width="100%" style="min-height: 100vh; border: 0;"></iframe>
                                    </div>
                                </div>
                            </fieldset>
                            <fieldset id="divAddTaskDetails">
                                <div class="col-xs-12 p-a-0 p-listing box-shadow bottom-gap heightcontent">
                                    <div class="heading-gap">
                                        <label class="form-control-label col-xs-12 col-md-2"><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "taskName")%></label>
                                        <input type="text" class="form-control-sm col-xs-12 col-md-4" maxlength="100" data-bind="textInput: TaskName" />
                                    </div>
                                    <div class="col-xs-12 p-a-0 divElementHide">
                                        <fieldset>
                                            <label class="form-control-label col-xs-12 col-md-2"><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "estimatedTime")%></label>
                                            <input type="text" class="form-control-sm col-xs-12 col-md-2 pull-xs-left" maxlength="7" onkeypress="return isNumberKey(event)" data-bind="textInput: EstimatedTime" />
                                            <select class="form-control-sm col-xs-12 col-md-1" style="display: block" data-bind="options: UnitOfTimeList, optionsText: 'DisplayName', optionsValue: 'TypeValue', value: UnitOfTimeSelectedValue">
                                            </select>
                                        </fieldset>

                                        <fieldset>
                                            <label class="form-control-label col-xs-12 col-md-2"><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "description")%></label>
                                            <textarea class="form-control-lg col-xs-12 col-md-4 font-small" rows="4" onkeypress="return checkTextAreaMaxLength(this,event,300);" data-bind="textInput: TaskDescription"></textarea>
                                        </fieldset>
                                        <fieldset>
                                            <div class="col-xs-12 p-l-1 col-lg-7 p-a-0 tiny-leftmargin borderstyling heading-gap" style="padding: 2px !important; height: 30px">
                                                <i class="fa blue big pull-xs-left cursor-pointer fa-minus-circle tiny-leftmargin" style="padding-top: 3px !important;" onclick="Toggle(this);"></i>
                                                <label class="col-xs-12 col-md-6 tiny-leftmargin p-a-0" style="padding-top: 3px !important;"><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "safetyInstruction")%></label>
                                            </div>
                                            <div class="col-xs-12 col-md-7 p-x-0 show">
                                                <textarea class="form-control-lg col-xs-12 tiny-leftmargin font-small" style="border-top-left-radius: 0px; border-top-right-radius: 0px;" rows="4" onkeypress="return checkTextAreaMaxLength(this,event,300);" data-bind="textInput: SafetyInstruction"></textarea>
                                            </div>
                                        </fieldset>

                                        <fieldset class="col-xs-12 col-md-7 p-x-0 heading-gap tiny-rightmargin bottom-gap">
                                            <div class="col-xs-12 tiny-leftmargin borderstyling p-a-0" style="height: 30px;">
                                                <i class="fa blue big pull-xs-left cursor-pointer tiny-leftmargin fa-minus-circle push-down" onclick="Toggle(this);"></i>
                                                <label class="col-xs-12 col-md-6 tiny-leftmargin p-a-0 push-down"><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "ppe")%></label>
                                                <button type="button" class="btn btn-sm btn-primary tiny_push-down pull-xs-right font-small tiny-rightmargin" data-bind="click: $root.IsUserHasSavingPermission() ? function () { ShowPPEInfo(); return false; } : '', css: $root.IsUserHasSavingPermission() ? '' : 'icon-muted'" style="padding: 0px;"><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "ppeImages")%></button>
                                            </div>
                                            <div class="col-xs-12 tiny-leftmargin p-x-0 show" style="border: 1px solid lightgray; border-radius: 6px; border-top-left-radius: 0px; border-top-right-radius: 0px;">
                                                <div class="push-down bottom-gap" data-bind="foreach: TaskPPEList">
                                                    <div class="col-xs-2 bottom-gap heading-gap">
                                                        <i class="fa fa-2x fa-times-circle red cursor-pointer" style="position: absolute; right: -7%; top: -7%;" data-bind="click: $root.HasDeleteAccess() ? function () { RemovePPIImage(InstructionID); } : '', css: $root.HasDeleteAccess() ? '' : 'icon-muted'"></i>
                                                        <img style="width: 60px; height: 60px;" data-bind="attr: { src: ImagePath }" />
                                                        <label class="pull-xs-left full-width center-align nowrap" data-bind="text: InstructionName"></label>
                                                    </div>

                                                </div>
                                                <div class="push-down bottom-gap center-align" data-bind="visible: IsTaskPPElistEmpty"><span class="gray"><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "ppeNotFound")%></span></div>
                                            </div>
                                        </fieldset>

                                        <fieldset class="col-xs-12 col-md-7 p-x-0 heading-gap tiny-rightmargin bottom-gap">
                                            <div class="col-xs-12 tiny-leftmargin borderstyling p-a-0" style="height: 30px;">
                                                <i class="fa blue big pull-xs-left cursor-pointer tiny-leftmargin fa-minus-circle push-down" onclick="Toggle(this);"></i>
                                                <label class="col-xs-12 col-md-6 tiny-leftmargin p-a-0 push-down"><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "tools")%></label>
                                                <button type="button" class="btn btn-sm btn-primary tiny_push-down pull-xs-right font-small tiny-rightmargin" data-bind="click: $root.IsUserHasSavingPermission() ? function () { ShowToolsInfo(); return false; } : '', css: $root.IsUserHasSavingPermission() ? '' : 'icon-muted'" style="padding: 0px;"><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "toolsImages")%></button>
                                            </div>
                                            <div class="col-xs-12 tiny-leftmargin p-x-0 show" style="border: 1px solid lightgray; border-radius: 6px; border-top-left-radius: 0px; border-top-right-radius: 0px;">
                                                <div class="push-down bottom-gap" data-bind="foreach: TaskToolsList">
                                                    <div class="col-xs-2 bottom-gap heading-gap">
                                                        <i class="fa fa-2x fa-times-circle red cursor-pointer" style="position: absolute; right: -7%; top: -7%;" data-bind="click: $root.HasDeleteAccess() ? function () { RemoveToolsImage(InstructionID); } : '', css: $root.HasDeleteAccess() ? '' : 'icon-muted'"></i>
                                                        <img style="width: 60px; height: 60px;" data-bind="attr: { src: ImagePath }" />
                                                        <label class="pull-xs-left full-width center-align nowrap" data-bind="text: InstructionName"></label>
                                                    </div>
                                                </div>
                                                <div class="push-down bottom-gap center-align" data-bind="visible: IsTaskToolslistEmpty"><span class="gray"><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "toolsNotFound")%></span></div>
                                            </div>
                                        </fieldset>

                                        <fieldset class="col-xs-12 col-md-7 p-x-0 heading-gap tiny-rightmargin bottom-gap">
                                            <div class="col-xs-12 p-a-0 borderstyling tiny-leftmargin" style="height: 30px;">
                                                <i class="fa blue big pull-xs-left cursor-pointer fa-minus-circle tiny-leftmargin push-down" onclick="Toggle(this);"></i>
                                                <label class="col-xs-12 col-md-6 tiny-leftmargin p-a-0 push-down"><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "fileAndImageUpload")%></label>
                                            </div>

                                            <div class="col-xs-12 tiny-leftmargin p-x-0 show" style="border: 1px solid lightgray; border-radius: 6px; border-top-left-radius: 0px; border-top-right-radius: 0px;">
                                                <span class="rightmargin pull-xs-left" data-bind="foreach: DocumentOrImageList">
                                                    <span class="cursor-pointer tiny-leftmargin" style="display: inline-block">
                                                        <img class="pull-xs-left tiny-rightmargin heading-gap bottom-gap" data-bind="attr: { src: ThumbnailPath }, click: function () { DownloadDocumentOrImageOrVideoInfo($data); return false; }" style="width: 50px; height: 55px;">
                                                        <i class="fa fa-times font-big cursor-pointer red pull-xs-left" data-bind="click: $root.HasDeleteAccess ? function () { DeleteDocumentOrImageOrVideoInfo($data); return false; } : '', css: $root.HasDeleteAccess() ? '' : 'icon-muted'"></i>
                                                    </span>
                                                </span>
                                                <span class="heading-gap cursor-pointer relative medium-rightmargin pull-xs-left bottom-gap">
                                                    <img data-bind="attr: { src: DefaultUploadIconPath }" style="width: 50px; height: 55px;" title="add Image" />
                                                    <input id="instructionFileUpload" type="file" name="instructionFileUpload" class="cursor-pointer" onchange="javascript:AddDocumentOrImageOrVideoInfo();return false;" data-bind=" attr: IsUserHasSavingPermission() ? '' : { visible: 'visible' }, css: IsUserHasSavingPermission() ? '' : 'icon-muted'"
                                                        style="position: absolute; top: 3px; left: 0; opacity: 0; width: 50px; height: 55px; min-height: 0px; font-size: 0; line-height: 2px" />
                                                </span>
                                            </div>
                                        </fieldset>
                                        <fieldset class="col-xs-12">
                                            <input type="checkbox" class="pull-xs-left heading-gap" onchange="ChkEnterRemarkChanged(this);return false;" data-bind="checked: IsEnabledEnterRemark">
                                            <label class="form-control-label col-xs-12 col-md-3"><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "enableToEnterRemark")%></label>
                                            <div data-bind="visible: IsEnterRemarkVisible">
                                                <input type="checkbox" class="pull-xs-left  heading-gap" data-bind="checked: IsEnabledEnterRemarkMandatory">
                                                <label class="form-control-label col-xs-12 col-md-3"><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "isMandatory")%></label>
                                            </div>
                                        </fieldset>
                                        <fieldset class="col-xs-12">
                                            <input type="checkbox" class="pull-xs-left  heading-gap" onchange="ChkTakePictureChanged(this);return false;" data-bind="checked: IsEnabledTakePicture">
                                            <label class="form-control-label col-xs-12 col-md-3"><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "enableToTakePicture")%></label>
                                            <div data-bind="visible: IsTakePictureVisible">
                                                <input type="checkbox" class="pull-xs-left heading-gap" data-bind="checked: IsEnabledTakePictureMandatory">
                                                <label class="form-control-label col-xs-12 col-md-3"><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "isMandatory")%></label>
                                            </div>
                                        </fieldset>
                                        <fieldset class="col-xs-12 p-l-0 heading-gap tiny-rightmargin bottom-gap">
                                            <div class="col-xs-12 p-a-0 borderstyling tiny-leftmargin" style="height: 30px;">
                                                <i class="fa blue big pull-xs-left cursor-pointer fa-minus-circle tiny-leftmargin push-down" onclick="Toggle(this);"></i>
                                                <label class="col-xs-12 col-md-6 tiny-leftmargin p-a-0 push-down"><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "actionParameter")%></label>
                                                <label class="form-control-label blue cursor-pointer pull-xs-right" onclick="javascript:AddMoreParameter();return false;"><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "addMore")%></label>
                                            </div>
                                            <div class="col-xs-12 tiny-leftmargin p-x-0 show" style="border: 1px solid lightgray; border-radius: 6px; border-top-left-radius: 0px; border-top-right-radius: 0px;">
                                                <table class="table nobox-shadow noborder-radius m-b-0 main-table table-bordered bottom-gap col-xs-10 push-down" style="border: none;">
                                                    <thead>
                                                        <tr>
                                                            <th><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "parameterName")%></th>
                                                            <th><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "isMandatory")%></th>
                                                            <th><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "parameterType")%></th>
                                                            <th><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "selectionCode")%></th>
                                                            <th><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "action")%></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody data-bind="foreach: ParameterInfoList">
                                                        <tr>
                                                            <td>
                                                                <input type="text" maxlength="150" class="form-control-sm col-xs-12 col-md-10" data-bind="textInput: ParameterName" />
                                                            </td>
                                                            <td>
                                                                <input type="checkbox" class=" col-xs-12 col-md-10 heading-gap" data-bind="checked: IsParameterMandatory" />
                                                            </td>
                                                            <td>
                                                                <select class="form-control-sm col-xs-12 col-md-10" data-bind="options: $root.ParameterTypeList, optionsText: 'DisplayName', optionsValue: 'TypeValue', value: ParameterType, event: { change: $root.ParameterTypeChanged }">
                                                                </select>
                                                            </td>
                                                            <td>
                                                                <select class="form-control-sm col-xs-12 col-md-10 selectDropDown" data-bind="options: $root.SelectionGroupList, optionsText: 'DisplayName', optionsValue: 'TypeValue', value: SelectionCode, visible: isSelectionEnabled()">
                                                                </select>
                                                            </td>
                                                            <td class="center-align" style="width: 12%;">
                                                                <i class="fa fa-trash-o text-danger i-action v-icon cursor-pointer" title="Delete" data-bind="click: $root.HasDeleteAccess() ? function () { DeleteParameterInfo($data); } : '', css: $root.HasDeleteAccess() ? '' : 'icon-muted', visible: isDeleteEnabled"></i>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </fieldset>
                                    </div>
                                </div>
                                <button type="button" class="btn btn-sm btn-success pull-xs-right heading-gap m-r-1 bottom-gap" onclick="javascript:SaveTaskInformation();return false;"><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "save")%></button>
                                <div id="divProgress" class="spinner-circle-big" data-bind="css: IsProgressing() ? '' : 'hide'"></div>
                            </fieldset>
                            <fieldset class="bottom-gap">
                                <span data-bind="html: ModelErrorMsg, css: ModelErrorCss, visible: ModelErrorVisible"></span>
                            </fieldset>
                        </div>
                    </div>
                </div>
                <div id="divScheduleInfo" class="tab-pane fade">
                    <iframe id="iFrameScheduleInfo" width="100%" style="min-height: 100vh; border: 0;" scrolling="no"></iframe>
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

        <div class="modal" tabindex="-1" role="dialog" id="divSelectInstructionModal">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <span class="form-control-label bold" data-bind="text: PopupModelName"></span>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body row p-l-2">
                        <div data-bind="foreach: InstructionSelectionList">
                            <div class="col-xs-12 col-md-3 col-xl-2 p-l-0">
                                <input type="checkbox" name="instructionGroup" class="pull-xs-left tiny-rightmargin" data-bind="checkedValue: InstructionID, checked: $parent.SelectedInstrution">
                                <img class="pull-xs-left" style="width: 60px; height: 70px;" data-bind="attr: { src: ImagePath }" />
                                <label class="pull-xs-left full-width center-align  nowrap" data-bind="text: InstructionName"></label>
                            </div>
                        </div>
                        <div class="tiny-padding col-xs-12 p-t-0" data-bind="visible: IsEmptyInstructionlist">
                            <span class="gray"><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "noRecordFound")%></span>
                        </div>

                        <div class="spinner-circle-big" data-bind="css: IsPopupProgressing() ? '' : 'hide'"></div>
                    </div>
                    <div class="modal-footer">
                        <span class="red" data-bind="text: InstructionSeleErrorMsg"></span>
                        <button type="button" class="btn btn-success btn-sm" onclick="javascript:AddInstructionInfo();return false;"><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "ok")%></button>
                        <button type="button" class="btn btn-cancel btn-sm" onclick="javascript:ClearInstructionCheked();return false;"><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "clear")%></button>
                    </div>
                </div>
            </div>
        </div>

        <div id="divAddMaintenanceTypeModal" data-backdrop="static" data-keyboard="false" class="modal fade in ">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" id="btnCloseMaintenanceTypeModal" onclick="ClearMaintenanceTypeInfo(); return false;" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h5>
                            <%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "maintTypeInformation")%>
                        </h5>
                    </div>
                    <div class="modal-body" style="min-height: 190px; overflow: hidden;">
                        <fieldset class="info-block bottom-gap">
                            <legend class="search-legend cursor-pointer" id="legSearchCriteria"><i class="fa fa-caret-down tiny-rightmargin"></i><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "defineSearchCriteria")%></legend>
                            <div class="push-up">
                                <label class="pull-xs-left form-control-sm">
                                    <%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "maintenanceType")%>
                                </label>
                                <input type="text" id="txtSearchMaintType" maxlength="30" class="form-control-sm pull-xs-left" />
                                <button id="btnSearch" class="btn-sm btn btn-normal  bottom-gap  tiny-leftmargin pull-xs-left" onclick="SearchMaintTypes();return false;">
                                    <i class="fa fa-search"></i>
                                </button>
                                <button id="btnShowAll" class="btn-sm btn btn-primary hide pull-xs-left  tiny-leftmargin" onclick="ShowAllMaintTypes();return false;">
                                    <%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "showAll")%>
                                </button>
                                <span class="text-danger font-small pull-xs-left tiny-leftmargin push-down" id="spnSearchError"></span>
                            </div>
                        </fieldset>
                        <fieldset class="info-block bottom-gap">
                            <legend class="search-legend cursor-pointer" id="legWarehouseStockFilter"><i class="fa fa-caret-down tiny-rightmargin"></i><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "addEditMaintType")%></legend>
                            <div class="push-up">
                                <fieldset>
                                    <div class="col-xs-12 col-lg-7 p-l-0">
                                        <label class="pull-xs-left form-control-sm">
                                            <%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "maintenanceType")%>
                                        </label>
                                        <input type="text" id="txtNewMaintType" maxlength="30" class="pull-xs-left form-control-sm" />
                                    </div>
                                </fieldset>
                                <fieldset class="bottom-gap">
                                    <span class="font-small tiny-leftmargin pull-xs-left text-danger" id="spnAddMaintTypeError"></span>
                                    <div class="spinner-rectangle pull-xs-left" id="divCategoryProgress" style="display: none;">
                                    </div>
                                    <button onclick="ClearMaintenanceTypeInfo();return false;" class="btn btn-sm btn-cancel tiny-rightmargin pull-xs-right">
                                        <%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "cancel")%>
                                    </button>
                                    <asp:Button ID="btnAddMaintType" btntype="add" Text="Add" CssClass="btn btn-sm btn-success tiny-rightmargin pull-xs-right"
                                        runat="server" EnableViewState="false" />
                                </fieldset>
                            </div>
                        </fieldset>

                        <fieldset class="heading-gap text-xs-right">
                            <span id="spnViewMaintTypes" onclick="javascript:ShowHideMaintTypesInfo();"><i class="cursor-pointer pull-right blue fa fa-plus-circle  font-bigger tiny-rightmargin"
                                id="iconViewMaintTypes"></i><span id="spnViewAllMaintTypes" class="pull-right bold blue cursor-pointer font-small">
                                    <%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "clickHereToViewMaintTypes")%></span> </span>
                        </fieldset>
                        <div id="divMaintTypes" class="scroll-auto" style="height: 300px;">
                            <div class="table-side-box-heading">
                                <span class="m-l-1"><%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "listofMaintTypes")%></span>
                            </div>
                            <span id="divMaintTypesProgress" class="spinner-circle-big hide"></span>
                            <table id="tableMaintTypes" class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th style="width: 20%" class="bg-graylight center-align">
                                            <%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "action")%>
                                        </th>
                                        <th id="thMaintTypes" runat="server" enableviewstate="false" style="width: 80%; white-space: nowrap;" class="bg-graylight cursor-pointer center-align">
                                            <span class="underline">
                                                <%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "maintenanceType")%> 
                                            </span><i class="tiny-leftmargin cursor-pointer "></i>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody id="tbdMaintTypes" class="tbodypositionfixed" runat="server" data-bind="foreach: $root.DefaultMaintenanceTypesArray()">
                                    <tr>
                                        <td class="center-align">
                                            <i class="fa fa-edit linkcolor i-action tiny-leftmargin tiny-rightmargin v-icon  cursor-pointer" data-bind="click: $root.HasMaintTypeAccess ? function () { ShowEditMaintTypes(MasterDataID, MasterDataName); } : '', attr: BindIconAttributes($root.HasMaintTypeAccess)  " title="<%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "edit")%>"></i>
                                            <i class="fa fa-trash-o text-danger i-action tiny-leftmargin tiny-rightmargin v-icon  cursor-pointer" data-bind="click: $root.HasDeleteMaintTypeAccess ? function () { DeleteMaintTypeClick(MasterDataID); } : '', attr: BindIconAttributes($root.HasDeleteMaintTypeAccess)" title="<%=GetGlobalResourceObject("MaintenanceSchedule_Resource", "delete")%>"></i>
                                        </td>
                                        <td class="nowrap" data-bind="text: MasterDataName"></td>
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
    </div>
</asp:Content>
