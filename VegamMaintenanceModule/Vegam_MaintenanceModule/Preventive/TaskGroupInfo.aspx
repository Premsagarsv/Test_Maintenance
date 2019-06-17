<%@ Page Title="" Language="C#" MasterPageFile="~/Vegam-Responsive.Master" AutoEventWireup="true" CodeBehind="TaskGroupInfo.aspx.cs" Inherits="Vegam_MaintenanceModule.Preventive.TaskGroupInfo" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <asp:ScriptManager ID="scriptManager" runat="server" EnableViewState="false">
    </asp:ScriptManager>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/Vegam_TaskGroupInfo.js" type="text/javascript"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/ajaxfileupload.js" type="text/javascript"></script>
    <script type="text/javascript" src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/iPAS_Common_v4.js"></script>
    <link href="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Styles/select2.css" rel="stylesheet" type="text/css" />
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/select3.js"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/iPAS_Pager.js"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/AutoReSize.js"></script>

    <script>
        jQuery(document).ready(function () {

            AutoResizeDescription(); // this method exist in Vegam_TaskGroupInfo.js
            //List Drag & drop functionality
            jQuery(".sorting-contain").sortable({
                stop: function () {
                    SaveTaskSequence();
                }
            });
            jQuery(".sorting-contain").disableSelection();
            //End List Drag & drop


        });

        jQuery(document).on('keypress', function (e) {
            var keyCode = e.keyCode || e.which;
            if (jQuery("#divAddMaintenanceMasterDataModal").is(':visible')) {
                if (keyCode == 27) {
                    jQuery("#divAddMaintenanceMasterDataModal").modal("hide");
                }
                if (keyCode == 13) {
                    jQuery("#btnAddItem").click();
                    return false;
                }
            }
            else {
                if (!jQuery("#txtTaskdesc").is(':focus') && !jQuery("#txtTaskSafety").is(':focus')) {
                    if (keyCode === 13) {
                        if (jQuery("#divTaskDetails").hasClass("disabled-div")) {
                            SaveTaskGroupInfo();
                        } else {
                            if (jQuery("#divEnableEdit").css("display") == "none") {
                                jQuery("#btnSaveTask").click();
                            }                                                     
                        }                        
                        return false;
                    }
                }
            }

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
                var height = taskGroupViewModel.isMaintShowAll() ? 'min-height: auto !important' : 'min-height: 430px !important';
                jQuery(taskEle).closest(".p-listing").find(".divElementHide").removeClass("hide").closest(".heightcontent").attr('style', height);
                jQuery(taskEle).toggleClass("fa-plus-circle fa-minus-circle");
            } else {
                jQuery(taskEle).closest(".p-listing").find(".divElementHide").addClass("hide").closest(".heightcontent").attr('style', 'min-height: 37px !important');
                jQuery(taskEle).toggleClass("fa-minus-circle fa-plus-circle");
            }
        }
    </script>
    <style>
        .select2-container {
            width: 230px !important;
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
            height: 100%;
        }

        .select2 {
            width: 145px;
            z-index: 999;
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

        .i-action {
            font-size: 20px;
            margin-left: 5px;
            margin-right: 5px;
            margin-top: 2px;
            float: left;
        }

        .ui-widget-overlay {
            z-index: 99999 !important;
        }

        .ui-dialog {
            z-index: 9999991 !important;
        }

        .full-width + .select2 {
            width: 100% !important
        }
         .image_styles {
            width: 60px;
            height: 60px;
            display: block;
            margin: auto;
        }
        .toggle-div-mydesign {
            z-index: 9999;
        }
    </style>
    <div id="divTaskGroup" class="col-xs-12">
        <fieldset class="info-block bottom-gap" id="divTaskGroupHeader">
            <legend class="search-legend cursor-pointer" id="legDefectDownload"><i class="fa tiny-rightmargin fa-caret-down"></i><%=GetGlobalResourceObject("TaskGroup_Resource", "taskGroupInformation")%></legend>
            <div>
                <label class="form-control-label label-xlarge nomarginleft">
                    <%=GetGlobalResourceObject("TaskGroup_Resource", "taskGroupName")%>
                    <i class="fa fa-asterisk red p-a-0" style="font-size: 8px !important; margin-top: 2px!important; position: absolute; margin-left: 2px;"></i>
                </label>
                <input type="text" class="form-control-sm col-xs-12 col-lg-3" style="width: 22% !important;" maxlength="200" data-bind="textInput: TaskGroupName" />

                <label class="form-control-label label-xlarge nomarginleft">
                    <%=GetGlobalResourceObject("TaskGroup_Resource", "taskGroupType")%>
                    <i class="fa fa-asterisk red p-a-0" style="font-size: 8px !important; margin-top: 2px!important; position: absolute; margin-left: 2px;"></i>
                </label>
                <div class="p-a-0 pull-xs-left">
                    <select class="form-control-sm col-xs-12 col-lg-2 selectDropDown" data-bind="options: TaskGroupTypeList, optionsText: 'DisplayName', optionsValue: 'TypeValue', value: TaskGroupSelectedTypeList">
                    </select>
                </div>
                <i class="fa blue cursor-pointer fa-plus-circle fa-2x  medium-leftmargin pull-xs-left push-down" onclick="javascript:ShowAddMaintenanceTypeModal('TASKGRP_TYPE');" title="<%=GetGlobalResourceObject("TaskGroup_Resource", "addEditTaskGroupType")%>"></i>
                <%-- <button type="button" class="btn btn-sm btn-info tiny-leftmargin"><%=GetGlobalResourceObject("TaskGroup_Resource", "edit")%></button>--%>
                <button id="btnGroupInfoSave" runat="server" type="button" class="btn btn-sm btn-success medium-leftmargin pull-xs-left"></button>
                <div class="pull-xs-left text-info push-down medium-leftmargin" data-bind="html: TaskGroupErrorMsg, css: TaskGroupErrorCss"></div>
                <button id="btnGroupInfoApprove" type="button" class="btn btn-sm btn-success pull-xs-right m-r-1" data-bind="click: IsUserHasApprovePermission() ? function () { ApproveGroupTask(); } : '', visible: ApproveEnabled, css: IsUserHasApprovePermission() ? '' : 'icon-muted'"><%=GetGlobalResourceObject("TaskGroup_Resource", "approve")%></button>

            </div>
        </fieldset>
        <div id="divTaskDetails" data-bind="css: TaskEditEnable() ? '' : 'disabled-div'">
            <div class="col-xs-12 col-md-3 p-l-0" id="divTaskGroupLeftHeader">
                <div class="p-listing box-shadow" style="min-height: 550px !important;">
                    <div class="c-newphase col-xs-12 bottom-gap">
                        <button id="btnAddTask" type="button" class="pull-xs-left btn btn-sm btn-success tiny-leftmargin left-align" style="height: 30px; width: 190px; padding-left: 5px;" data-bind="click: function () { ModelErrorMsg(''); ClearTaskInfo(); AutoResizeDescription(); }">
                            <i class="fa fa-plus-circle"></i>
                            <%=GetGlobalResourceObject("TaskGroup_Resource", "addOperation")%>
                            <label class="font-mini"><%=GetGlobalResourceObject("TaskGroup_Resource", "shortText")%></label>
                        </button>
                        <button class="pull-xs-right btn btn-sm btn-primary tiny-rightmargin font-small" onclick="javascript:ShowAllTaskInfo();return false;">
                            <i class="fa fa-eye"></i>
                            <%=GetGlobalResourceObject("TaskGroup_Resource", "showAll")%></button>
                    </div>
                    <fieldset class="tiny-padding p-b-0 sorting-contain col-xs-12" data-bind="foreach: TaskList" style="max-height: 470px !important; overflow-y: auto;">
                        <div class="col-xs-12 p-a-0 sorting-element" data-bind="css: SelectedClass">
                            <i class="fa fa-arrows v-icon cursor-pointer black pull-xs-left push-down"></i>
                            <label class="border-bottom col-xs-7 col-lg-10 tiny-leftmargin  p-l-0 form-control-label" data-bind="text: TaskName(), click: function () { BindTaskInfo(TaskID) }"></label>
                            <i class="fa fa-trash-o red big push-down cursor-pointer" data-bind="click: $root.HasDeleteAccess() ? function () { DeleteTaskInfo($data); return false; } : '', css: $root.HasDeleteAccess() ? '' : 'icon-muted'"></i>
                        </div>
                    </fieldset>
                    <div class="col-xs-12 p-a-0 show  center-align" style="position: relative; margin-top: 70px;" data-bind="visible: IsEmptyTasklist">
                        <span class="gray"><%=GetGlobalResourceObject("TaskGroup_Resource", "noRecordFound")%></span>
                    </div>
                </div>

            </div>
            <div class="col-xs-12 col-md-9 p-r-0 bottom-gap p-l-0" id="divTaskGroupTaskDetails">
                <div>
                    <div data-bind="foreach: TaskInfoList">
                        <div class="col-xs-12 p-a-0 p-listing box-shadow bottom-gap heightcontent" data-bind="attr: {style : taskGroupViewModel.isMaintShowAll()? 'min-height: auto !important;':''}">
                            <div class="heading-gap" data-bind="visible: taskGroupViewModel.EnableEdit()">
                                <label class="form-control-label col-xs-12 col-md-2">
                                    <%=GetGlobalResourceObject("TaskGroup_Resource", "operationName")%>
                                    <i class="fa fa-asterisk red p-a-0" style="font-size: 8px !important; margin-top: 2px!important; position: absolute; margin-left: 2px;"></i>
                                </label>
                                <input type="text" class="form-control-sm col-xs-12 col-md-4" maxlength="200" data-bind="textInput: TaskName" />
                            </div>
                            <div id="divEnableEdit" class="border-heading" data-bind="visible: !taskGroupViewModel.EnableEdit()">
                                <i class="fa fa-minus-circle orange big pull-xs-left tiny-leftmargin tiny-rightmargin cursor-pointer" onclick="divCollapseContent(this); return false;"></i>
                                <label><%=GetGlobalResourceObject("TaskGroup_Resource", "taskName")%></label>
                                <span class="form-control-label bold" data-bind="text: TaskName"></span>
                            </div>
                            <div class="col-xs-12 p-a-0 divElementHide">
                                <fieldset>
                                    <label class="form-control-label col-xs-12 col-md-2"><%=GetGlobalResourceObject("TaskGroup_Resource", "estimatedTime")%></label>

                                    <input type="text" class="form-control-sm col-xs-12 col-md-2 pull-xs-left" maxlength="7" onkeypress="return isNumberKey(event)" data-bind="textInput: EstimatedTime, visible: taskGroupViewModel.EnableEdit()" />
                                    <span class="form-control-label pull-xs-left" data-bind="text: EstimatedTime, visible: !taskGroupViewModel.EnableEdit()"></span>
                                    <select class="form-control-sm col-xs-12 col-md-1 tiny-leftmargin" style="display: block" data-bind="options: taskGroupViewModel.UnitOfTimeList, optionsText: 'DisplayName', optionsValue: 'TypeValue', value: UnitOfTimeSelectedValue, visible: taskGroupViewModel.EnableEdit()">
                                    </select>
                                    <span class="form-control-label col-xs-12 col-md-1" data-bind="text: SelectedEstimatedTime, visible: !taskGroupViewModel.EnableEdit()"></span>
                                </fieldset>

                                <fieldset data-bind="visible: TaskDescription().length > 0 || !taskGroupViewModel.isMaintShowAll()">
                                    <div class="col-xs-12 p-l-1 col-lg-7 p-a-0 tiny-leftmargin borderstyling heading-gap" style="padding: 2px !important; height: 30px">
                                        <i class="fa blue big pull-xs-left cursor-pointer fa-minus-circle tiny-leftmargin" style="padding-top: 3px !important;" onclick="Toggle(this);"></i>
                                        <label class="col-xs-12 col-md-6 tiny-leftmargin p-a-0" style="padding-top: 3px !important;">
                                            <%=GetGlobalResourceObject("TaskGroup_Resource", "instructions")%>
                                            <i class="fa fa-asterisk red p-a-0" style="font-size: 8px !important; margin-top: 2px!important; position: absolute; margin-left: 2px;"></i>
                                        </label>
                                    </div>
                                    <div class="col-xs-12 col-md-7 p-x-0 show">
                                        <textarea id="txtTaskdesc" class="form-control-lg col-xs-12 tiny-leftmargin font-small" maxlength="2000" style="border-top-left-radius: 0px; border-top-right-radius: 0px; min-height: 120px;" rows="6" onkeypress="return checkTextAreaMaxLength(this,event,2000);" data-bind="textInput: TaskDescription, visible: taskGroupViewModel.EnableEdit"></textarea>
                                        <span class="form-control-lg col-xs-12 tiny-leftmargin font-small" style="display: inline; border: 1px solid lightgray; border-radius: 6px; border-top-left-radius: 0px; border-top-right-radius: 0px; word-break: break-all; height: auto;white-space:pre-wrap"
                                            data-bind="text: TaskDescription, visible: !taskGroupViewModel.EnableEdit()"></span>
                                    </div>
                                </fieldset>
                                <fieldset data-bind="visible: SafetyInstruction().length > 0 || !taskGroupViewModel.isMaintShowAll()">
                                    <div class="col-xs-12 p-l-1 col-lg-7 p-a-0 tiny-leftmargin borderstyling heading-gap" style="padding: 2px !important; height: 30px">
                                        <i class="fa blue big pull-xs-left cursor-pointer fa-minus-circle tiny-leftmargin" style="padding-top: 3px !important;" onclick="Toggle(this);"></i>
                                        <label class="col-xs-12 col-md-6 tiny-leftmargin p-a-0" style="padding-top: 3px !important;"><%=GetGlobalResourceObject("TaskGroup_Resource", "safetyInstruction")%></label>
                                    </div>
                                    <div class="col-xs-12 col-md-7 p-x-0 show">
                                        <textarea id="txtTaskSafety" class="form-control-lg col-xs-12 tiny-leftmargin font-small" maxlength="1000" style="border-top-left-radius: 0px; border-top-right-radius: 0px; min-height: 90px;" rows="4" onkeypress="return checkTextAreaMaxLength(this,event,1000);" data-bind="textInput: SafetyInstruction, visible: taskGroupViewModel.EnableEdit"></textarea>
                                        <span class="form-control-lg col-xs-12 tiny-leftmargin font-small" style="display: inline; border: 1px solid lightgray; border-radius: 6px; border-top-left-radius: 0px; border-top-right-radius: 0px; word-break: break-all; height: auto;white-space:pre-wrap"
                                            data-bind="text: SafetyInstruction, visible: !taskGroupViewModel.EnableEdit()"></span>
                                    </div>
                                </fieldset>

                                <fieldset class="col-xs-12 col-md-7 p-x-0 heading-gap tiny-rightmargin bottom-gap" data-bind="visible: TaskPPEList().length > 0 || !taskGroupViewModel.isMaintShowAll()">
                                    <div class="col-xs-12 tiny-leftmargin borderstyling p-a-0" style="height: 30px;">
                                        <i class="fa blue big pull-xs-left cursor-pointer tiny-leftmargin fa-minus-circle push-down" onclick="Toggle(this);"></i>
                                        <label class="col-xs-12 col-md-3 tiny-leftmargin p-a-0 push-down"><%=GetGlobalResourceObject("TaskGroup_Resource", "ppe")%></label>
                                        <label class="pull-xs-left blue form-control-label" data-bind="visible: taskGroupViewModel.HasPPEChanged()"><i class="fa fa-info-circle tiny-rightmargin font-big"></i><%=GetGlobalResourceObject("TaskGroup_Resource", "changesWontSaveMsg")%></label>
                                        <button type="button" class="btn btn-sm btn-primary tiny_push-down pull-xs-right font-small tiny-rightmargin" data-bind="click: $root.IsUserHasSavingPermission() ? function () { ShowPPEInfo(); return false; } : '', css: $root.IsUserHasSavingPermission() ? '' : 'icon-muted', visible: taskGroupViewModel.EnableEdit" style="padding: 0px;"><%=GetGlobalResourceObject("TaskGroup_Resource", "ppeImages")%></button>
                                    </div>
                                    <div class="col-xs-12 tiny-leftmargin p-x-0 show" style="border: 1px solid lightgray; border-radius: 6px; border-top-left-radius: 0px; border-top-right-radius: 0px;">
                                        <div class="push-down bottom-gap" data-bind="foreach: TaskPPEList">
                                            <div class="col-xs-2 bottom-gap heading-gap">
                                                <i class="fa fa-2x fa-times-circle red cursor-pointer" style="position: absolute; right: -2px; top: -7%;" data-bind="click: $root.HasDeleteAccess() ? function () { RemovePPIImage(InstructionID); } : '', css: $root.HasDeleteAccess() ? '' : 'icon-muted', visible: taskGroupViewModel.EnableEdit  "></i>
                                                <div data-bind="attr: { title: InstructionName }">
                                                    <img class="image_styles" data-bind="attr: { src: ImagePath }" />
                                                    <label class="pull-xs-left full-width center-align nowrap ellipsis" style="max-width: 95%" data-bind="text: InstructionName"></label>
                                                </div>
                                            </div>

                                        </div>
                                        <div class="push-down bottom-gap center-align" data-bind="visible: IsTaskPPElistEmpty"><span class="gray"><%=GetGlobalResourceObject("TaskGroup_Resource", "ppeNotFound")%></span></div>
                                    </div>
                                </fieldset>

                                <fieldset class="col-xs-12 col-md-7 p-x-0 heading-gap tiny-rightmargin bottom-gap" data-bind="visible: TaskToolsList().length > 0 || !taskGroupViewModel.isMaintShowAll()">
                                    <div class="col-xs-12 tiny-leftmargin borderstyling p-a-0" style="height: 30px;">
                                        <i class="fa blue big pull-xs-left cursor-pointer tiny-leftmargin fa-minus-circle push-down" onclick="Toggle(this);"></i>
                                        <label class="col-xs-12 col-md-3 tiny-leftmargin p-a-0 push-down"><%=GetGlobalResourceObject("TaskGroup_Resource", "tools")%></label>
                                        <label class="pull-xs-left blue form-control-label" data-bind="visible: taskGroupViewModel.HasToolsChanged()"><i class="fa fa-info-circle tiny-rightmargin font-big"></i><%=GetGlobalResourceObject("TaskGroup_Resource", "changesWontSaveMsg")%></label>
                                        <button type="button" class="btn btn-sm btn-primary tiny_push-down pull-xs-right font-small tiny-rightmargin" data-bind="click: $root.IsUserHasSavingPermission() ? function () { ShowToolsInfo(); return false; } : '', css: $root.IsUserHasSavingPermission() ? '' : 'icon-muted', visible: taskGroupViewModel.EnableEdit  " style="padding: 0px;"><%=GetGlobalResourceObject("TaskGroup_Resource", "toolsImages")%></button>
                                    </div>
                                    <div class="col-xs-12 tiny-leftmargin p-x-0 show" style="border: 1px solid lightgray; border-radius: 6px; border-top-left-radius: 0px; border-top-right-radius: 0px;">
                                        <div class="push-down bottom-gap" data-bind="foreach: TaskToolsList">
                                            <div class="col-xs-2 bottom-gap heading-gap">
                                                <i class="fa fa-2x fa-times-circle red cursor-pointer" style="position: absolute; right: -2px; top: -7%;" data-bind="click: $root.HasDeleteAccess() ? function () { RemoveToolsImage(InstructionID); } : '', css: $root.HasDeleteAccess() ? '' : 'icon-muted', visible: taskGroupViewModel.EnableEdit  "></i>
                                                <div data-bind="attr: { title: InstructionName }">
                                                    <img class="image_styles" data-bind="attr: { src: ImagePath }" />
                                                    <label class="pull-xs-left full-width center-align nowrap ellipsis" style="max-width: 95%" data-bind="text: InstructionName"></label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="push-down bottom-gap center-align" data-bind="visible: IsTaskToolslistEmpty"><span class="gray"><%=GetGlobalResourceObject("TaskGroup_Resource", "toolsNotFound")%></span></div>
                                    </div>
                                </fieldset>

                                <fieldset class="col-xs-12 col-md-7 p-x-0 heading-gap tiny-rightmargin bottom-gap" data-bind="visible: DocumentOrImageList().length > 0 || !taskGroupViewModel.isMaintShowAll()">
                                    <div class="col-xs-12 p-a-0 borderstyling tiny-leftmargin" style="height: 30px;">
                                        <i class="fa blue big pull-xs-left cursor-pointer fa-minus-circle tiny-leftmargin push-down" onclick="Toggle(this);"></i>
                                        <label class="col-xs-12 col-md-3 tiny-leftmargin p-a-0 push-down"><%=GetGlobalResourceObject("TaskGroup_Resource", "fileAndImageUpload")%></label>
                                        <label class="pull-xs-left blue form-control-label" data-bind="visible: taskGroupViewModel.HasDocumentChanged()"><i class="fa fa-info-circle tiny-rightmargin font-big"></i><%=GetGlobalResourceObject("TaskGroup_Resource", "changesWontSaveMsg")%></label>
                                    </div>

                                    <div class="col-xs-12 tiny-leftmargin p-x-0 show" style="border: 1px solid lightgray; border-radius: 6px; border-top-left-radius: 0px; border-top-right-radius: 0px;">
                                    
                                        <div class="rightmargin pull-xs-left"  data-bind="foreach: DocumentOrImageList">
                                            <i class="fa fa-times font-big cursor-pointer red pull-xs-left" data-bind="click: $root.HasDeleteAccess ? function () { DeleteDocumentOrImageOrVideoInfo($data); return false; } : '', css: $root.HasDeleteAccess() ? '' : 'icon-muted', visible: taskGroupViewModel.EnableEdit"></i>
                                            <div data-bind="attr: { title: InstructionName }">
                                                <img class="image_styles" data-bind="attr: { src: ThumbnailPath, title: DocumentDisplayName }, click: function () { DownloadDocumentOrImageOrVideoInfo($data); return false; }" />
                                                <label class="pull-xs-left full-width center-align nowrap ellipsis" style="max-width: 95%" data-bind="text: DocumentDisplayName"></label>
                                            </div>
                                        </div>
                                        <span class="heading-gap cursor-pointer relative medium-rightmargin pull-xs-left bottom-gap" data-bind="visible: taskGroupViewModel.EnableEdit">
                                            <img data-bind="attr: { src: taskGroupViewModel.DefaultUploadIconPath }" style="width: 50px; height: 55px;" title="add Image" />
                                            <input id="instructionFileUpload" type="file" name="instructionFileUpload" class="cursor-pointer" onchange="javascript:AddDocumentOrImageOrVideoInfo();return false;" data-bind=" attr: $root.IsUserHasSavingPermission() ? '' : { visible: 'visible' }, css: $root.IsUserHasSavingPermission() ? '' : 'icon-muted'"
                                                style="position: absolute; top: 3px; left: 0; opacity: 0; width: 50px; height: 55px; min-height: 0px; font-size: 0; line-height: 2px" />
                                        </span>
                                    </div>
                                </fieldset>
                                <fieldset class="col-xs-12" data-bind="visible: SparePartInfoList().length > 1 || !taskGroupViewModel.isMaintShowAll() || SparePartInfoList()[0].Quantity()>0">
                                    <label class="form-control-label bold col-xs-12 col-lg-3"><%=GetGlobalResourceObject("TaskGroup_Resource", "sparePartsRequirements")%></label>
                                    <label class="pull-xs-left blue form-control-label" data-bind="visible: taskGroupViewModel.HasSparePartChanged()"><i class="fa fa-info-circle tiny-rightmargin font-big"></i><%=GetGlobalResourceObject("TaskGroup_Resource", "changesWontSaveMsg")%></label>
                                    <label class="form-control-label pull-xs-right blue cursor-pointer" data-bind="visible: taskGroupViewModel.EnableEdit" onclick="javascript:AddMoreSparePartRow();return false;"><%=GetGlobalResourceObject("TaskGroup_Resource", "addMore")%></label>
                                </fieldset>
                                <div id="divSparePartInfo" class="table-responsive" data-bind="visible: SparePartInfoList().length > 1 || !taskGroupViewModel.isMaintShowAll() || SparePartInfoList()[0].Quantity()>0">
                                    <table class="table nobox-shadow noborder-radius m-b-0 main-table table-bordered bottom-gap col-xs-10 bottom-gap" style="border: none;">
                                        <thead>
                                            <tr>
                                                <th><%=GetGlobalResourceObject("TaskGroup_Resource", "materialCodeAndDescription")%></th>
                                                <th><%=GetGlobalResourceObject("TaskGroup_Resource", "quantity")%></th>
                                                <th><%=GetGlobalResourceObject("TaskGroup_Resource", "UOM")%></th>
                                                <th data-bind="visible: taskGroupViewModel.EnableEdit()"><%=GetGlobalResourceObject("TaskGroup_Resource", "action")%></th>
                                            </tr>
                                        </thead>
                                        <tbody class="tbodySparePartInfoList" data-bind="attr: { id: 'divSparePart_' + ($index()) }, foreach: SparePartInfoList">
                                            <tr>
                                                <td style="width: 350px; max-width: 350px">
                                                    <div>
                                                        <select class="form-control-sm col-xs-12 select2 full-width" data-bind="event: { change: OnSparePartChange }, enable: taskGroupViewModel.EnableEdit(), options: taskGroupViewModel.SparePartMaterialList, optionsText: 'DisplayName', optionsValue: 'MaterialNumber', optionsCaption: '<%=GetGlobalResourceObject("TaskGroup_Resource", "select")%>'">
                                                        </select>
                                                    </div>
                                                </td>

                                                <td>
                                                    <input type="text" class="form-control-sm col-xs-12" data-bind="textInput: Quantity, enable: taskGroupViewModel.EnableEdit()" onkeypress="return ValidateDecimalValueForInput(this,event,10,3);" />
                                                </td>
                                                <td>
                                                    <input type="text" class="form-control-sm col-xs-12" data-bind="textInput: UOM" disabled="disabled" />
                                                </td>
                                                <td class="center-align" data-bind="visible: taskGroupViewModel.EnableEdit()">
                                                    <i class="fa fa-trash-o red big push-down cursor-pointer" data-bind="click: $root.HasDeleteAccess() ? function () { DeleteSparePartInfo($data); } : '', css: $root.HasDeleteAccess() ? '' : 'icon-muted', visible: taskGroupViewModel.EnableEdit() ? isDeleteEnabled : false"></i>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <fieldset class="col-xs-12">
                                    <input type="checkbox" class="pull-xs-left heading-gap" onchange="ChkEnterRemarkChanged(this);return false;" data-bind="checked: IsEnabledEnterRemark, enable: taskGroupViewModel.EnableEdit, visible: IsEnabledEnterRemark() || !taskGroupViewModel.isMaintShowAll()">
                                    <label class="form-control-label col-xs-12 col-md-3" data-bind="visible: IsEnabledEnterRemark() || !taskGroupViewModel.isMaintShowAll()"><%=GetGlobalResourceObject("TaskGroup_Resource", "enableToEnterRemark")%></label>
                                    <div data-bind="visible: IsEnterRemarkVisible">
                                        <input type="checkbox" class="pull-xs-left  heading-gap" data-bind="checked: IsEnabledEnterRemarkMandatory, enable: taskGroupViewModel.EnableEdit">
                                        <label class="form-control-label col-xs-12 col-md-2"><%=GetGlobalResourceObject("TaskGroup_Resource", "isMandatory")%></label>
                                    </div>
                                    <input type="checkbox" class="pull-xs-left  heading-gap" onchange="ChkTakePictureChanged(this);return false;" data-bind="checked: IsEnabledTakePicture, enable: taskGroupViewModel.EnableEdit,visible: IsEnabledTakePicture() || !taskGroupViewModel.isMaintShowAll()">
                                    <label class="form-control-label col-xs-12 col-md-3" data-bind="visible: IsEnabledTakePicture() || !taskGroupViewModel.isMaintShowAll()"><%=GetGlobalResourceObject("TaskGroup_Resource", "enableToTakePicture")%></label>
                                    <div data-bind="visible: IsTakePictureVisible">
                                        <input type="checkbox" class="pull-xs-left heading-gap" data-bind="checked: IsEnabledTakePictureMandatory, enable: taskGroupViewModel.EnableEdit">
                                        <label class="form-control-label col-xs-12 col-md-2"><%=GetGlobalResourceObject("TaskGroup_Resource", "isMandatory")%></label>
                                    </div>
                                </fieldset>
                                <fieldset class="col-xs-12" data-bind="visible: ParameterInfoList().length>1 || !taskGroupViewModel.isMaintShowAll() || ParameterInfoList()[0].ParameterName().length>0">
                                    <label class="form-control-label bold col-xs-12 col-lg-3"><%=GetGlobalResourceObject("TaskGroup_Resource", "parameters")%></label>
                                    <label class="pull-xs-left blue form-control-label" data-bind="visible: taskGroupViewModel.HasParameterChanged()"><i class="fa fa-info-circle tiny-rightmargin font-big"></i><%=GetGlobalResourceObject("TaskGroup_Resource", "changesWontSaveMsg")%></label>
                                    <label class="form-control-label pull-xs-right blue cursor-pointer" data-bind="visible: taskGroupViewModel.EnableEdit" onclick="javascript:AddMoreParameter();return false;"><%=GetGlobalResourceObject("TaskGroup_Resource", "addMore")%></label>
                                </fieldset>
                                <div class="table-responsive" data-bind="visible: ParameterInfoList().length>1 || !taskGroupViewModel.isMaintShowAll() || ParameterInfoList()[0].ParameterName().length>0">
                                    <table class="table nobox-shadow noborder-radius m-b-0 main-table table-bordered bottom-gap col-xs-10" style="border: none;">
                                        <thead>
                                            <tr>
                                                <th><%=GetGlobalResourceObject("TaskGroup_Resource", "parameterName")%></th>
                                                <th><%=GetGlobalResourceObject("TaskGroup_Resource", "isMandatory")%></th>
                                                <th><%=GetGlobalResourceObject("TaskGroup_Resource", "parameterType")%></th>
                                                <th><%=GetGlobalResourceObject("TaskGroup_Resource", "selectionCode")%>
                                                    <i class="fa white cursor-pointer fa-plus-circle fa-2x pull-xs-right" onclick="javascript:ShowAddMaintenanceTypeModal('GROUPCODE');" title="Add/Edit Selection Group"></i>
                                                </th>
                                                <th data-bind="visible: taskGroupViewModel.EnableEdit()"><%=GetGlobalResourceObject("TaskGroup_Resource", "action")%></th>
                                            </tr>
                                        </thead>
                                        <tbody data-bind="foreach: ParameterInfoList">
                                            <tr>
                                                <td>
                                                    <input type="text" maxlength="200" class="form-control-sm col-xs-12 col-md-10" data-bind="textInput: ParameterName, visible: taskGroupViewModel.EnableEdit" />
                                                    <span class="form-control-sm col-xs-12 col-md-10" data-bind="text: ParameterName, visible: !taskGroupViewModel.EnableEdit()"></span>
                                                </td>
                                                <td class="center-align">
                                                    <input type="checkbox" class="push-down heading-gap" data-bind="checked: IsParameterMandatory, enable: taskGroupViewModel.EnableEdit()" />
                                                </td>
                                                <td>
                                                    <select class="form-control-sm col-xs-12 col-md-10" data-bind="options: taskGroupViewModel.ParameterTypeList, optionsText: 'DisplayName', optionsValue: 'TypeValue', value: ParameterType, event: { change: taskGroupViewModel.ParameterTypeChanged }, visible: taskGroupViewModel.EnableEdit">
                                                    </select>
                                                    <span class="form-control-sm col-xs-12 col-md-10" data-bind="text: SelectedParameterType, visible: !taskGroupViewModel.EnableEdit()"></span>
                                                </td>
                                                <td>
                                                    <select class="form-control-sm col-xs-12 col-md-10" data-bind="options: taskGroupViewModel.SelectionGroupList, optionsText: 'DisplayName', optionsValue: 'TypeValue', value: SelectionCode, visible: isSelectionEnabled() && taskGroupViewModel.EnableEdit() ">
                                                    </select>
                                                    <span class="form-control-sm col-xs-12 col-md-10" data-bind="text: SelectedSelectionGroup, visible: !taskGroupViewModel.EnableEdit()"></span>
                                                </td>
                                                <td class="center-align" style="width: 12%;" data-bind="visible: taskGroupViewModel.EnableEdit()">
                                                    <i class="fa fa-trash-o red big push-down cursor-pointer" data-bind="click: $root.HasDeleteAccess() ? function () { DeleteParameterInfo($data); } : '', css: $root.HasDeleteAccess() ? '' : 'icon-muted', visible: taskGroupViewModel.EnableEdit() ? isDeleteEnabled : false"></i>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-12 col-lg-4" data-bind="html: ModelErrorMsg, css: ModelErrorCss"></div>
                    <button id="btnSaveTask" type="button" class="btn btn-sm btn-success pull-xs-right heading-gap m-r-1 bottom-gap" onclick="javascript:SaveTaskInformation();return false;" data-bind="visible: taskGroupViewModel.EnableEdit() "><%=GetGlobalResourceObject("TaskGroup_Resource", "save")%></button>

                </div>
            </div>
        </div>
        <div id="divProgress" class="spinner-circle-big" data-bind="css: IsProgressing() ? '' : 'hide'"></div>
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
                     
                        <div class="col-xs-2 bottom-gap heading-gap">
                                <input type="checkbox" name="instructionGroup" class="pull-xs-left tiny-rightmargin" data-bind="checkedValue: InstructionID, checked: $parent.SelectedInstrution">  
                                <div data-bind="attr: { title: InstructionName }">
                                  <img class="image_styles" data-bind="attr: { src: ImagePath }" />
                                <label class="pull-xs-left full-width center-align nowrap ellipsis" style="max-width: 95%"data-bind="text: InstructionName"></label>
                            </div>
                        </div>
                    </div>
                    <div class="tiny-padding col-xs-12 p-t-0" data-bind="visible: IsEmptyInstructionlist">
                        <span class="gray"><%=GetGlobalResourceObject("TaskGroup_Resource", "noRecordFound")%></span>
                    </div>

                    <div class="spinner-circle-big" data-bind="css: IsPopupProgressing() ? '' : 'hide'"></div>
                </div>
                <div class="modal-footer">
                    <span class="red" data-bind="text: InstructionSeleErrorMsg"></span>
                    <button type="button" class="btn btn-success btn-sm" onclick="javascript:AddInstructionInfo();return false;"><%=GetGlobalResourceObject("TaskGroup_Resource", "ok")%></button>
                    <button type="button" class="btn btn-cancel btn-sm" onclick="javascript:ClearInstructionCheked();return false;"><%=GetGlobalResourceObject("TaskGroup_Resource", "clear")%></button>
                </div>
            </div>
        </div>
    </div>

    <div id="divAddMaintenanceMasterDataModal" data-backdrop="static" data-keyboard="false" class="modal fade in ">
        <input type="hidden" id="hdfSortValue" />
        <input type="hidden" runat="server" enableviewstate="false" value="5" id="hdnPageSize" />
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" id="btnCloseMaintenanceTypeModal" onclick="ClearMaintenanceTypeInfo(); return false;" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h5 id="modalHeaderName"></h5>
                </div>
                <div class="modal-body" style="min-height: 190px; overflow: hidden;">
                    <fieldset class="info-block bottom-gap">
                        <legend class="search-legend cursor-pointer" id="legSearchCriteria"><i class="fa fa-caret-down tiny-rightmargin"></i><%=GetGlobalResourceObject("TaskGroup_Resource", "defineSearchCriteria")%></legend>
                        <div class="push-up">
                            <label id="lblSearchField" class="form-control-label label-xxxlarge nomarginleft labelMasterDataType">
                            </label>
                            <input type="text" id="txtSearchMaintType" maxlength="30" class="form-control-sm col-xs-12 col-lg-5 col-xl-6" />
                            <button id="btnSearch" class="btn-sm btn btn-normal  bottom-gap  tiny-leftmargin pull-xs-left" onclick="SearchMaintTypes();return false;">
                                <i class="fa fa-search"></i>
                            </button>
                            <button id="btnShowAll" class="btn-sm btn btn-primary hide pull-xs-left  tiny-leftmargin" onclick="ShowAllMaintTypes();return false;">
                                <%=GetGlobalResourceObject("TaskGroup_Resource", "showAll")%>
                            </button>
                            <span class="text-danger font-small pull-xs-left tiny-leftmargin push-down" id="spnSearchError"></span>
                        </div>
                    </fieldset>
                    <fieldset class="info-block bottom-gap">
                        <legend class="search-legend cursor-pointer"><i class="fa fa-caret-down tiny-rightmargin"></i>
                            <span id="fieldsetAddedit"></span>
                        </legend>
                        <div class="push-up">

                            <fieldset>
                                <label class="form-control-label label-xxxlarge nomarginleft labelMasterDataType">
                                </label>
                                <input type="text" id="txtNewMaintType" maxlength="30" class="form-control-sm col-xs-12 col-lg-5 col-xl-6" />
                            </fieldset>
                            <fieldset class="hide" id="fdDescription">
                                <label class="form-control-label label-xxlarge nomarginleft "><%=GetGlobalResourceObject("TaskGroup_Resource", "description")%></label>
                                <textarea id="txtMasterDescription" maxlength="100" class="form-control-lg font-small col-xs-12 col-lg-5 col-xl-6" rows="4"></textarea>
                            </fieldset>
                            <div id="addItem" class="hide">
                                <fieldset>
                                    <label class="form-control-label label-xxxlarge nomarginleft"><%=GetGlobalResourceObject("TaskGroup_Resource","itemName")%></label>
                                    <input type="text" id="txtItemName" maxlength="50" class="form-control-sm col-xs-12 col-lg-5 col-xl-6" />

                                    <button id="btnAddItem" class="btn btn-sm btn-success tiny-rightmargin pull-xs-right" onclick="javascript:AddItemsToModal();return false;"><%=GetGlobalResourceObject("TaskGroup_Resource","addItem")%></button>
                                </fieldset>
                                <div id="divAddedItems" class="tiny-padding" style="max-height: 130px; overflow: auto">
                                </div>
                            </div>

                            <fieldset class="bottom-gap">
                                <span class="font-small tiny-leftmargin pull-xs-left text-danger" id="spnAddMaintTypeError"></span>
                                <div class="spinner-rectangle pull-xs-left" id="divCategoryProgress" style="display: none;">
                                </div>
                                <button onclick="ClearMaintenanceTypeInfo();return false;" class="btn btn-sm btn-cancel tiny-rightmargin pull-xs-right">
                                    <%=GetGlobalResourceObject("TaskGroup_Resource", "cancel")%>
                                </button>
                                <button id="btnAddMaintType" class="btn btn-sm btn-success tiny-rightmargin pull-xs-right"
                                    runat="server" enableviewstate="false">
                                </button>
                            </fieldset>
                        </div>
                    </fieldset>

                    <fieldset class="heading-gap text-xs-right">
                        <span id="spnViewMaintTypes" onclick="javascript:ShowHideMaintTypesInfo();"><i class="cursor-pointer pull-right blue fa fa-plus-circle  font-bigger tiny-rightmargin"
                            id="iconViewMaintTypes"></i><span id="spnViewAllMaintTypes" class="pull-right bold blue cursor-pointer font-small"></span></span>
                    </fieldset>
                    <div id="divMaintTypes" class="scroll-auto" style="max-height: 300px;">
                        <div class="table-side-box-heading">
                            <span id="spanListofInfo" class="m-l-1"></span>
                        </div>
                        <span id="divMaintTypesProgress" class="spinner-circle-big hide"></span>
                        <table id="tableMaintTypes" class="table table-bordered">
                            <thead>
                                <tr>
                                    <th class="center-align" style="width: 90px">
                                        <%=GetGlobalResourceObject("TaskGroup_Resource", "action")%>
                                    </th>
                                    <th id="thMaintTypes" runat="server" enableviewstate="false" class="cursor-pointer center-align nowrap">
                                        <span id="thMaintName" class="underline labelMasterDataType"></span><i class="tiny-leftmargin cursor-pointer"></i>
                                    </th>
                                    <th id="th1" runat="server" enableviewstate="false" class="cursor-pointer center-align">
                                        <%=GetGlobalResourceObject("TaskGroup_Resource", "description")%>
                                        <i class="tiny-leftmargin cursor-pointer "></i>
                                    </th>
                                </tr>
                            </thead>
                            <tbody id="tbdMaintTypes" class="tbodypositionfixed" runat="server" data-bind="foreach: $root.DefaultMaintenanceTypesArray()">
                                <tr>
                                    <td class="center-align">
                                        <i class="fa fa-edit linkcolor i-action tiny-leftmargin tiny-rightmargin v-icon  cursor-pointer" data-bind="click: $root.HasMaintTypeAccess ? function () { ShowEditMaintTypes($data); } : '', attr: BindIconAttributes($root.HasMaintTypeAccess)  " title="Edit"></i>
                                        <i class="fa fa-trash-o red big cursor-pointer" data-bind="click: $root.HasDeleteMaintTypeAccess ? function () { DeleteMaintTypeClick(MasterDataID); } : '', css: $root.HasDeleteMaintTypeAccess ? '' : 'icon-muted'" title="Delete"></i>
                                    </td>
                                    <td class="break-word" data-bind="text: MasterDataName"></td>
                                    <td class="break-word" data-bind="text: Description"></td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr data-bind="visible: $root.DefaultMaintenanceTypesArray().length == 0">
                                    <td class="center-align" colspan="3"><span><%=GetGlobalResourceObject("TaskGroup_Resource", "noRecordFound")%></span>
                                    </td>
                                </tr>
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

    <div class="modal" tabindex="-1" role="dialog" id="divFailedTaskGroupLoad" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-body row p-l-2 center-align text-danger">
                    <%=GetGlobalResourceObject("TaskGroup_Resource", "failedToLoadSOPInfo")%>
                </div>

            </div>
        </div>
    </div>

    <div class="small-popup">
        <div id="alertModal" style="z-index: 5000">
            <div>
                <p id="alertMessage">
                </p>
            </div>
        </div>
    </div>
</asp:Content>

