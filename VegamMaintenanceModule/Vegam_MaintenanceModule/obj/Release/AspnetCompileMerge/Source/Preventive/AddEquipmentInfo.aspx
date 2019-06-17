<%@ Page Title="" Language="C#" MasterPageFile="~/Vegam-Iframe.Master" AutoEventWireup="true" CodeBehind="AddEquipmentInfo.aspx.cs" Inherits="Vegam_MaintenanceModule.Preventive.AddEquipmentInfo" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/Vegam_AddEquipmentInfo.js" type="text/javascript"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/ajaxfileupload.js" type="text/javascript"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/iPAS_Pager.js"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/iPAS_Common_v4.js"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/select3.js"></script>
    <link href="<%= ConfigurationManager.AppSettings["MaintCssPath"].TrimEnd('/') %>/Styles/proplan_v7.css" rel="stylesheet" type="text/css" />
    <link href="<%= ConfigurationManager.AppSettings["MaintCssPath"].TrimEnd('/') %>/Styles/select2.css" rel="stylesheet" type="text/css" />
    <script type="text/javascript" src="<%= ConfigurationManager.AppSettings["MaintCssPath"].TrimEnd('/') %>/Scripts/jquery.timepicker.js"></script>
    
    <script type="text/javascript" src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/jquery.qrcode.min.js"></script>
    <script type="text/javascript" src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/pdfmake.min.js"></script>


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

        .equipment-background {
            border: 1px solid lightgray;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
            background: lightgray;
            width: 100%;
        }

        .horizontalLine {
            margin-top: 0px !important;
        }

        i[disabled] {
            color: gray !important;
            cursor: default !important;
        }

        .img-border:nth-child(even) {
            border-left: 1px solid gray;
        }

        .img-border {
            border-bottom: 1px solid gray;
        }

        .select2 {
            width: 100% !important;
            z-index: 999;
        }

        .li-disabled {
            color: gray !important;
            cursor: default !important;
        }

        .bg-info {
            color: #fff !important;
            background: #5bc0de !important;
        }

        .box-shadow {
            box-shadow: 0 0 5px 5px #eee;
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

        .l-b-gray {
            border-bottom: 1px solid #ccc;
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

        .link-disabled {
            color: gray;
            pointer-events: none;
        }

        .img-radius {
            border-radius: 10px;
            box-shadow: 0px 0px 4px 0.2px #ccc;
        }

        .ui-widget-overlay {
            z-index: 99999 !important;
        }

        .ui-dialog {
            z-index: 9999991 !important;
        }

        .border-red {
            border-color: red !important;
        }
    </style>
    <script>
        jQuery(document).ready(function () {
            jQuery('[data-toggle="popover"]').popover();
            jQuery('#popoverData').popover();
            jQuery('.pover').popover({ trigger: "hover" });
        });
    </script>
    <asp:ScriptManager ID="scriptManager" runat="server" EnableViewState="false">
    </asp:ScriptManager>

    <input type="hidden" id="hdfDatePickerFormat" runat="server" enableviewstate="false" />
    <div class="col-xs-12 push-down p-x-0 bottom-gap">
        <div class="row" id="divEquipmentArea">
            <div id="divEquipmentInfoBlock" class="col-xs-12 col-lg-8 push-down">
                <div class="info-block m-r-0 m-b-1" style="padding: 2px">
                    <fieldset>
                        <span class="pull-xs-right">
                            <button id="buttonlnkAddFLocation" class="btn btn-mini btn-primary" onclick="ViewAdditionalInfoLinks('L'); return false;"><%=GetGlobalResourceObject("Equipment_Resource", "addViewFunctionalLoc")%></button>
                            <button id="buttonlnkMeasuringPoint" class="btn btn-mini btn-success" onclick="ViewAdditionalInfoLinks('P'); return false;" data-bind="visible: EquipmentInfoArray().length > 0 ? true : false"><%=GetGlobalResourceObject("Equipment_Resource", "addViewMeasuringPoint")%></button>
                            <button id="buttonlnkDocuments" class="btn btn-mini btn-info" onclick="ViewAdditionalInfoLinks('D'); return false;" data-bind="visible: EquipmentInfoArray().length > 0 ? true : false"><%=GetGlobalResourceObject("Equipment_Resource", "addViewDocumentnAndImages")%></button>
                        </span>
                    </fieldset>
                </div>

                <div class="col-xs-12 col-lg-5 col-xl-4  pull-xs-right heading-gap">
                    <img id="imgEquipmentImage" data-bind="attr: { src: EquipmentImgPath }" height="100" width="100" alt="image here" class="img-radius" />
                      <div id="divUploadImage" class="col-xs-12 p-x-0">
                    <input id="imageFileToUpload" type="file" name="fileToUploadImage" class="push-down bottom-gap" onchange="EquipmentImageUpload()">
                      <p class="green"><%=GetGlobalResourceObject("Equipment_Resource", "imageUploadInstruction")%></p>
                           </div>
                </div>

                <div class="col-xs-12 col-sm-12 col-lg-7 col-xl-8 p-l-0"> 
                    <fieldset class="heading-gap">
                        <label class="form-control-label col-xs-12 col-lg-5"><%=GetGlobalResourceObject("Equipment_Resource", "equipmentCode")%></label>
                        <div class="col-xs-12 col-lg-7 p-a-0">
                            <input type="text" id="txtequipmentCode" maxlength="10" style="text-transform: uppercase;" data-bind="attr: { 'disabled': !BtnGenerateCode() }, textInput: EquipmentCode" class="form-control-sm col-xs-7 col-lg-5 tiny-rightmargin">
                            <i class="fa fa-qrcode tiny-rightmargin cursor-pointer pover pull-xs-left" data-bind="visible: EquipmentCode() != '' ? true : false" onclick="DownloadQrCode();return false;" data-content="<%=GetGlobalResourceObject("Equipment_Resource", "downloadQRCode")%>" data-placement="top" data-original-title="" style="font-size:2.2rem;"></i>
                            <a class="btn  btn-sm pull-xs-left btn-primary" data-bind="visible: ($root.HasEditAccess) ? BtnGenerateCode : false, click: function () { GenerateEquipmentCode() }"><span>Generate Code</span></a>
                            <a class="btn btn-cancel btn-sm" data-bind="visible: ($root.HasEditAccess) ? !BtnGenerateCode() : false, click: function () { ClearGenerateEquipmentCode() }"><span>Clear Code</span></a>                            
                            <div id="divQRCodeMaker" class="hide"></div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <label class="form-control-label col-xs-12 col-lg-5"><%=GetGlobalResourceObject("Equipment_Resource", "equipmentName")%></label>
                        <input type="text" id="txtequipmentName" maxlength="50" data-bind="textInput: EquipmentName" class="form-control-sm col-xs-12 col-lg-7">
                    </fieldset>
                    <fieldset class="bottom-gap ">
                        <label class="form-control-label col-xs-12 col-lg-5"><%=GetGlobalResourceObject("Equipment_Resource", "description")%></label>
                        <textarea id="txtDescription" data-bind="textInput: EquipmentDesc, attr: { onkeydown: 'return checkTextAreaMaxLength(this,event,200)' }" class="form-control-lg font-small col-xs-12 col-lg-7" style="min-height: 60px"></textarea>
                    </fieldset>
                    <fieldset>
                        <label class="form-control-label col-xs-12 col-lg-5"><%=GetGlobalResourceObject("Equipment_Resource", "functionalLocation")%></label>
                        <fieldset class="col-xs-12 col-lg-7 p-x-0">
                            <select class="form-control-sm nopadding select2" id="drpFunctionLocation" 
                                data-bind="options: FunctionalLocationArray, optionsText: 'DisplayName', optionsValue: 'TypeValue', value: SelectedFunctionLocation, event: { change: DrpDownFunctionalLocationFlag() == true ? function () { BindParentEquipmentInfo() } : '' }">
                            </select>
                        </fieldset>
                    </fieldset>
                    <fieldset>
                        <label class="form-control-label col-xs-12 col-lg-5"><%=GetGlobalResourceObject("Equipment_Resource", "linkResource")%></label>
                        <fieldset class="col-xs-12 col-lg-7 p-x-0">
                            <select class="form-control-sm nopadding select2" id="drpResource" data-bind="options: ResourceListArray, optionsText: 'Key', optionsValue: 'Value', value: SelectedResource">
                            </select>
                        </fieldset>
                    </fieldset>
                    <fieldset>
                        <label class="form-control-label col-xs-12 col-lg-5"><%=GetGlobalResourceObject("Equipment_Resource", "linkEquipment")%></label>
                        <fieldset class="col-xs-12 col-lg-7 p-x-0">
                            <select class="form-control-sm nopadding select2" id="drpEquipment"
                                data-bind="options: ParentEquipmentList, optionsText: 'EquipmentName', optionsValue: 'EquipmentID', value: SelectedParentEquipment">
                            </select>
                        </fieldset>
                    </fieldset>
                </div>

                <div id="divModelInfo" runat="server" enableviewstate="false" class="col-xs-12 col-sm-12 col-lg-7 col-xl-8 p-x-0">
                    <label class="form-control-label bold"><%=GetGlobalResourceObject("Equipment_Resource", "modelInformation")%></label>
                    <a id="btnReferModel" class="disabled pull-xs-right underline link-disabled" data-bind="click: $root.HasEditAccess ? function () { ModalReferModelMasterData() } : ''"><%=GetGlobalResourceObject("Equipment_Resource", "referModelMaster")%></a>
                    <label class="switch pull-xs-right tiny-rightmargin">
                        <input id="checkModel" type="checkbox" style="display: none;"  onclick="ReferModelMasterDataChecked();" />
                        <span class="slider"></span>
                    </label>

                    <hr class="horizontalLine" />
                    <fieldset>
                        <fieldset class="col-xs-12 p-l-0">
                            <label class="form-control-label col-xs-12 col-lg-5"><%=GetGlobalResourceObject("Equipment_Resource", "modelNumber")%></label>
                            <input type="text" id="txtModelNumber" maxlength="50" data-bind="attr: { 'disabled': CheckReferModel }, textInput: ModelNumber" class="form-control-sm col-xs-12 col-lg-7 ">
                        </fieldset>
                        <fieldset class="col-xs-12 p-l-0">
                            <label class="form-control-label col-xs-12 col-lg-5"><%=GetGlobalResourceObject("Equipment_Resource", "manufacturer")%></label>
                            <div class="col-xs-12 col-lg-7 p-a-0">
                                <div class="col-xs-10 col-lg-11 p-x-0">
                                    <select class="form-control-sm nopadding select2" id="drpManufacturer" data-bind="attr: { 'disabled': CheckReferModel }, options: ManufacturerArray, optionsText: 'DisplayName', optionsValue: 'TypeValue', value: SelectedManufacture ">
                                    </select>
                                </div>
                                <i class="fa blue cursor-pointer fa-plus-circle fa-2x pull-xs-right" onclick="javascript:ShowAddMaintenanceTypeModal('M' , this);" title="Add/Edit Manufacture"></i>
                            </div>
                        </fieldset>
                    </fieldset>
                    <fieldset>
                        <fieldset class="col-xs-12 p-l-0">
                            <label class="form-control-label col-xs-12 col-lg-5"><%=GetGlobalResourceObject("Equipment_Resource", "seriesNo")%></label>
                            <input type="text" id="txtSerialNo" maxlength="50" data-bind="textInput: SerialNumber" class="form-control-sm col-xs-12 col-lg-7">
                        </fieldset>

                        <fieldset class="col-xs-12 p-l-0">
                            <label class="form-control-label col-xs-12 col-lg-5"><%=GetGlobalResourceObject("Equipment_Resource", "Type")%></label>
                            <div class="col-xs-12 col-lg-7 p-a-0">
                                <div class="col-xs-10 col-lg-11 p-x-0">
                                    <select class="form-control-sm nopadding select2" id="drpEquipmentType" data-bind="attr: { 'disabled': CheckReferModel }, options: EquipmentTypeArray, optionsText: 'DisplayName', optionsValue: 'TypeValue', value: SelectedCategory">
                                    </select>
                                </div>
                                <i class="fa blue cursor-pointer fa-plus-circle fa-2x pull-xs-right" onclick="javascript:ShowAddMaintenanceTypeModal('T', this);" title="Add/Edit Type"></i>
                            </div>
                        </fieldset>
                    </fieldset>
                    <fieldset class="col-xs-12 p-l-0">
                        <label class="form-control-label col-xs-7 col-lg-5"><%=GetGlobalResourceObject("Equipment_Resource", "Class")%></label>
                        <div class="col-xs-12 col-lg-7 p-a-0">
                            <div class="col-xs-10 col-lg-11 p-x-0">
                                <select class="form-control-sm nopadding select2" id="drpEquipmentClass" data-bind="attr: { 'disabled': CheckReferModel }, options: EquipmentClassArray, optionsText: 'DisplayName', optionsValue: 'TypeValue', value: SelectedClass">
                                </select>
                            </div>
                            <i class="fa blue cursor-pointer fa-plus-circle fa-2x pull-xs-right" onclick="javascript:ShowAddMaintenanceTypeModal('C', this);" title="Add/Edit Class"></i>
                        </div>
                    </fieldset>
                </div>
                <div class="col-xs-12 col-sm-12 col-lg-7 col-xl-8 p-x-0">
                    <label class="form-control-label bold">
                        <i id="iPlusWarranty" class="fa fa-plus-circle tiny-rightmargin blue font-big cursor-pointer" onclick="HideShowWarrantySupport(this,'divWarranty',false); return false;"></i>
                        <%=GetGlobalResourceObject("Equipment_Resource", "warrantyDetails")%>
                    </label>
                    <hr class="horizontalLine" />
                    <div id="divWarranty" class="hide col-xs-12 p-x-0">
                        <fieldset class="col-xs-12 p-l-0">
                            <label class="form-control-label col-xs-12 col-lg-5 pull-xs-left "><%=GetGlobalResourceObject("Equipment_Resource", "warrantyNumber")%></label>
                            <input type="text" id="txtWarrantyNumber" maxlength="50" class="form-control-sm col-xs-12 col-lg-7" data-bind="textInput: WarrantyNumber">
                        </fieldset>
                        <fieldset class="col-xs-12 p-l-0">
                            <label class="form-control-label col-xs-12 col-lg-5 pull-xs-left"><%=GetGlobalResourceObject("Equipment_Resource", "warrantyStart")%></label>
                            <input id="txtWarrantyStart" type="text" maxlength="50" class="form-control-sm col-xs-12 col-lg-7 datecontrol tiny_push-down" data-bind="textInput: WarrantyStartDate" />
                        </fieldset>
                        <fieldset class="col-xs-12 p-l-0">
                            <label class="form-control-label col-xs-12 col-lg-5 pull-xs-left nowrap"><%=GetGlobalResourceObject("Equipment_Resource", "purchaseDate")%></label>
                            <input id="txtPurchaseDate" type="text" maxlength="50" class="form-control-sm col-xs-12 col-lg-7 datecontrol tiny_push-down" data-bind="textInput: PurchaseDate" />
                        </fieldset>
                        <fieldset class="col-xs-12 p-l-0">
                            <label class="form-control-label col-xs-12 col-lg-5 pull-xs-left nowrap"><%=GetGlobalResourceObject("Equipment_Resource", "warrantyExpire")%></label>
                            <input id="txtWarrantyExpire" type="text" maxlength="50" class="form-control-sm col-xs-12 col-lg-7 datecontrol tiny_push-down" data-bind="textInput: WarrantyExpireDate" />
                        </fieldset>
                        <fieldset class="col-xs-12 p-l-0">
                            <label class="form-control-label col-xs-12 col-lg-5 pull-xs-left nowrap"><%=GetGlobalResourceObject("Equipment_Resource", "installDate")%></label>
                            <input id="txtInstallDate" type="text" maxlength="50" class="form-control-sm col-xs-12 col-lg-7 datecontrol tiny_push-down" data-bind="textInput: InstallDate" />
                        </fieldset>
                    </div>
                </div>
                <div class="col-xs-12 p-x-0">
                    <label class="form-control-label bold">
                        <i id="iPlusSupport" class="fa fa-plus-circle tiny-rightmargin blue font-big cursor-pointer" onclick="HideShowWarrantySupport(this,'divSupport',false); return false;"></i>
                        <%=GetGlobalResourceObject("Equipment_Resource", "supportDetails")%>
                    </label>
                    <div id="divAddMore" class=" pull-xs-right  hide">
                        <a id="btnAddMoreSupport" class="underline push-down pull-down" data-bind="click: $root.HasEditAccess ? addNewRow : '', visible: $root.HasEditAccess"><%=GetGlobalResourceObject("Equipment_Resource", "addMore")%></a>
                    </div>
                    <hr class="horizontalLine" />
                    <div id="divSupport" class="hide col-xs-12 p-x-0">
                        <div class="table-responsive">
                            <table id="tblSupport" class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th class="center-align" style="width: 15%;">
                                            <%=GetGlobalResourceObject("Equipment_Resource", "supportName")%>
                                        </th>
                                        <th class="center-align" style="width: 15%;">
                                            <%=GetGlobalResourceObject("Equipment_Resource", "supportNumber")%>
                                        </th>
                                        <th class="center-align" style="width: 10%;">
                                            <%=GetGlobalResourceObject("Equipment_Resource", "supportEmail")%>
                                        </th>
                                        <th class="center-align" style="width: 13%;">
                                            <%=GetGlobalResourceObject("Equipment_Resource", "supportType")%>
                                        </th>
                                        <th class="center-align" style="width: 12%;">
                                            <%=GetGlobalResourceObject("Equipment_Resource","action")%>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody id="tbSupport" data-bind="foreach: addEquipmentViewModel.SupportInfoList" class="tbody">
                                    <tr data-bind="attr: { id: 'trSupportInfoList_' + ($index()) }">
                                        <td class="nowrap" style="width: 10%;">
                                            <input type="text" maxlength="20" autocomplete="off" class="form-control  font-small"
                                                data-bind="textInput: SupportName, attr: { id: 'txtSupportName_' + ($index()) }" />
                                        </td>
                                        <td class="nowrap" style="width: 10%;">
                                            <input type="text" maxlength="20" autocomplete="off" class="form-control  font-small"
                                                data-bind="textInput: SupportNumber, attr: { id: 'txtSupportNumber_' + ($index()) }" />
                                        </td>
                                        <td class="nowrap" style="width: 13%;">
                                            <input type="text" maxlength="20" autocomplete="off" class="form-control  font-small"
                                                data-bind="textInput: SupportEmail, attr: { id: 'txtSupportEmail_' + ($index()) }" />
                                        </td>
                                        <td class="nowrap" style="width: 15%;">
                                            <select class="form-control-sm nopadding"
                                                data-bind=" attr: { id: 'drpSupportType_' + $index() }, options: addEquipmentViewModel.SupportTypeArray, optionsText: 'DisplayName', optionsValue: 'TypeValue', value: SupportType">
                                            </select>
                                        </td>
                                        <td class="center-align" style="width: 12%;">
                                            <i class="fa fa-trash-o text-danger i-action v-icon cursor-pointer" data-bind="click: ($root.HasEditAccess) ? function () { DeleteSupportInfo($data, $index()) } : '', attr: BindIconAttributes($root.HasEditAccess)" title="Delete"></i>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <fieldset class="col-xs-12 bottom-gap">
                    <button id="btnCloseEquipment" class="btn btn-cancel btn-sm pull-xs-right heading-gap medium-leftmargin" onclick="ClearEquipmentInfo(); return false;"><%=GetGlobalResourceObject("Equipment_Resource", "cancel")%></button>
                    <button id="btnSaveEquipment" class="btn btn-sm btn-success pull-xs-right heading-gap" data-bind="click: ($root.HasEditAccess) ? function () { InsertUpdateEquipmentinfo() } : '', attr: BindIconAttributes($root.HasEditAccess)"></button>
                    <span id="divProgress" class="spinner-circle-small absolute medium-leftmargin hide"></span>

                </fieldset>
                <fieldset class="col-xs-12">
                    <div data-bind="visible: LoadErrorMessageVisible">
                        <span data-bind="text: LoadErrorMessage, attr: { class: LoadErrorMessageClass }"></span>
                    </div>
                    <span id="spnErrorMsg" class="text-info"></span>
                </fieldset>

            </div>
            <div class="col-xs-12 col-lg-4 pull-xs-right">
                <div class="rside-box">
                    <fieldset>
                        <button id="btnAddImagesDocs" onclick="AddImagesAndDocuments();return false;" class="btn btn-sm btn-primary pull-xs-right tiny-rightmargin bottom-gap hide">Add Photos and Documents</button>
                    </fieldset>
                    <fieldset>
                        <label class="form-control-label col-xs-12 col-lg-5 gray"><%=GetGlobalResourceObject("Equipment_Resource", "functionalLocation")%></label>
                        <fieldset class="p-x-0 col-xs-12 col-lg-7">
                            <select class="form-control-sm nopadding select2 " id="drpFilterFunctionalLocation"
                                data-bind="options: FunctionalLocationArray, optionsText: 'DisplayName', optionsValue: 'TypeValue', value: SelectFunctionalLocationFilter, event: { change: DrpDownFunctionalLocationFlag() == true ? function () { LoadAllEquipmentInfo(false) } : '' }">
                            </select>
                        </fieldset>
                    </fieldset>
                    <fieldset style="border-bottom: 1.5px solid #eee">
                        <label class="form-control-label col-xs-12 col-lg-5 gray"><%=GetGlobalResourceObject("Equipment_Resource", "equipments")%> </label>
                        <input type="text" id="txtSearchEquipment" maxlength="50" data-bind="event: { keyup: DrpDownFunctionalLocationFlag() == true ? function () { LoadAllEquipmentInfo(false) } : '' }" placeholder="Search Equipment" class="form-control-sm col-xs-12 col-lg-7 m-b-0" />
                    </fieldset>

                    <fieldset id="fieldsetEquipmentList" class="tiny-padding p-b-0" data-bind="foreach: EquipmentInfoArray">
                        <div class="bottom-gap col-xs-12  cursor-pointer p-l-0 equipmentsort" data-bind="attr: { id: 'fieldsetEquipmentList_' + ($index()) }">
                            <i class="fa fa-trash-o tiny-leftmargin medium-rightmargin v-icon cursor-pointer pull-xs-left text-danger" data-bind="click: $root.HasDeleteAccess ? function () { DeleteEquipmentClick(EquipmentID, $index()); } : '', attr: BindIconAttributes($root.HasDeleteAccess)" title="Delete"></i>
                            <label class="col-xs-8 col-lg-9 tiny-leftmargin p-l-0 m-b-0 p-b-0 l-b-gray cursor-pointer" data-bind="css: IsSelected() == true ? 'bg-info' : '', click: function () { SelectedEquipmentList(EquipmentID, false) }">
                                <span class="btntext" data-bind="text: EquipmentName"></span>
                            </label>
                        </div>
                    </fieldset>
                    <div id="divLoadProgressVisible" class="spinner-circle-big hide"></div>
                    <div class="col-xs-12 center-align">
                    <span data-bind="text: EquipmentInfoArray().length > 0 ? '' : 'No record found'" class="font-small text-xs-center tiny-leftmargin gray center-align"></span>
                    </div>
                </div>
            </div>
            <div id="divModalEquipmentModel" data-backdrop="static" data-keyboard="false" class="modal fade" style="margin: 0px; padding: 0px; overflow: hidden;">
                <div class="modal-dialog" style="width: 750px;">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" onclick="javascript:ReferEquipmentModelCloseModal();return false;" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                            <h5><%=GetGlobalResourceObject("Equipment_Resource", "equipmentModelInformation")%>
                            </h5>

                        </div>
                        <div class="modal-body">
                            <div id="divEquipmentModelInfoList" class="push-down" style="">
                                <fieldset class="info-block bottom-gap">
                                    <legend class="search-legend cursor-pointer"><i class="fa fa-caret-down"></i>
                                        <%=GetGlobalResourceObject("Equipment_Resource", "defineSearchCriteria")%></legend>
                                    <div>
                                        <fieldset>
                                        <div class="col-xs-12 col-lg-6 p-l-0">
                                            <label class="form-control-label col-xs-12 col-lg-4">
                                                <%=GetGlobalResourceObject("Equipment_Resource", "modelName")%></label>
                                            <input type="text" id="txtSearchEquipmentModel" class="form-control-sm  col-lg-8" />
                                        </div>
                                        <div class="col-xs-12 col-lg-6 p-l-0">
                                            <label  class="form-control-label col-xs-12 col-lg-4" >
                                                <%=GetGlobalResourceObject("Equipment_Resource", "manufacturer")%></label>
                                            <div class="form-control-sm col-xs-12 col-lg-8 p-x-0">
                                            <select class="form-control-sm select2" id="drpManufacturerModel" data-bind=" options: ManufacturerArray, optionsText: 'DisplayName', optionsValue: 'TypeValue' ">
                                            </select>
                                                </div>
                                        </div>
                                            </fieldset>
                                        <fieldset>
                                            <div class="col-xs-12 col-lg-6 p-l-0">
                                                <label class="form-control-label col-xs-12 col-lg-4">
                                                    <%=GetGlobalResourceObject("Equipment_Resource", "Type")%></label>
                                                <div class="col-xs-12 col-lg-8 p-x-0">
                                                <select class="form-control-sm select2" id="drpTypeModel" data-bind=" options: EquipmentTypeArray, optionsText: 'DisplayName', optionsValue: 'TypeValue' ">
                                                </select>
                                                    </div>
                                            </div>
                                            <button type="submit" class="btn btn-normal btn-sm" id="btnSearchEquipmentModel" onclick="javascript:SearchEquipmentModelInfo();return false;">
                                                <i class="fa fa-search"></i>
                                            </button>
                                            <button class="btn btn-primary btn-sm hide" type="button" id="btnShowAllEquipmentModel" onclick="javascript:ShowAllEquipmentModelInfo();return false;">
                                                <%=GetGlobalResourceObject("Equipment_Resource", "showAll")%>
                                            </button>
                                        </fieldset>

                                        <p class="font-small text-danger col-xs-12 m-b-0" id="spnErrorEquipmentModel">
                                        </p>
                                    </div>
                                </fieldset>
                                <div class="table-side-box-heading">
                                    <span class="m-l-1">
                                        <%=GetGlobalResourceObject("Equipment_Resource", "doubleClicktoImportModelDetails")%></span>
                                </div>
                                <div class="spinner-circle-big hide" id="equipmentLoadProgress"></div>
                                <div class="table-responsive">
                                    <table class="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th style="width:3% !important"></th>
                                                <th runat="server" enableviewstate="false" style="white-space: nowrap; width: 6%;" class="bg-graylight cursor-pointer center-align">
                                                    <span>
                                                        <%=GetGlobalResourceObject("Equipment_Resource", "modelName")%>
                                                    </span><i class="tiny-leftmargin cursor-pointer"></i>
                                                </th>
                                                <th runat="server" enableviewstate="false" style="white-space: nowrap; width: 10%;" class="bg-graylight cursor-pointer center-align">
                                                    <span>
                                                        <%=GetGlobalResourceObject("Equipment_Resource", "description")%>
                                                    </span><i class="tiny-leftmargin cursor-pointer"></i>
                                                </th>
                                                <th runat="server" enableviewstate="false" style="white-space: nowrap; width: 10%;" class="bg-graylight cursor-pointer center-align">
                                                    <span>
                                                        <%=GetGlobalResourceObject("Equipment_Resource", "modelNumber")%>
                                                    </span><i class="tiny-leftmargin cursor-pointer"></i>
                                                </th>
                                                <th runat="server" enableviewstate="false" style="white-space: nowrap; width: 10%;" class="bg-graylight cursor-pointer center-align">
                                                    <span>
                                                        <%=GetGlobalResourceObject("Equipment_Resource", "manufacturer")%>
                                                    </span><i class="tiny-leftmargin cursor-pointer"></i>
                                                </th>
                                                <th runat="server" enableviewstate="false" style="white-space: nowrap; width: 10%;" class="bg-graylight cursor-pointer center-align">
                                                    <span>
                                                        <%=GetGlobalResourceObject("Equipment_Resource", "Type")%>
                                                    </span><i class="tiny-leftmargin cursor-pointer"></i>
                                                </th>
                                                <th runat="server" enableviewstate="false" style="white-space: nowrap; width: 10%;" class="bg-graylight cursor-pointer center-align">
                                                    <span>
                                                        <%=GetGlobalResourceObject("Equipment_Resource", "class")%>
                                                    </span><i class="tiny-leftmargin cursor-pointer"></i>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody id="Tbody1" runat="server" enableviewstate="false" data-bind="foreach: EquipmentModelArray()">
                                            <tr data-bind="css: IsSelected() == true ? 'bg-info' : '', event: { click: function () { SelectedEquipmentModelConfirm($data, false) }, dblclick: function () { SelectedEquipmentModelConfirm($data, true) } }" class="cursor-pointer">
                                                <td class="fa big white fa-hand-o-right " style="width:3% !important"></td>
                                                <td class="nowrap" data-bind="text: EquipmentModelName"></td>
                                                <td class="nowrap" data-bind="text: EquipmentModelDesc"></td>
                                                <td class="nowrap" data-bind="text: EquipmentModelNumber"></td>
                                                <td class="nowrap" data-bind="text: ManufacturerName"></td>
                                                <td class="nowrap" data-bind="text: CategoryName"></td>
                                                <td class="nowrap" data-bind="text: ClassName"></td>
                                            </tr>
                                        </tbody>
                                        <tfoot>
                                            <tr data-bind="visible: EquipmentModelArray().length == 0">
                                                <td class="center-align" colspan="7"><span><%=GetGlobalResourceObject("Equipment_Resource", "noRecordFound")%></span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="10">
                                                    <div data-bind="html: ModelPagerContent" class="pagination text-md-center m-a-0 col-xs-12"></div>
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <input type="hidden" runat="server" enableviewstate="false" value="5" id="hdnModelPageSize" />
                    </div>
                </div>
            </div>

        </div>
         <div id="divAddMaintenanceMasterDataModal" data-backdrop="static" data-keyboard="false" class="modal fade in ">
              <input type="hidden" id="hdfSortValue" />
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
                            <legend class="search-legend cursor-pointer" id="legSearchCriteria"><i class="fa fa-caret-down tiny-rightmargin"></i><%=GetGlobalResourceObject("Equipment_Resource", "defineSearchCriteria")%></legend>
                            <div class="push-up">
                                <label id="lblSearchField" class="form-control-label label-xxlarge nomarginleft labelMasterDataType">
                                </label>
                                <input type="text" id="txtSearchMaintType" maxlength="30" class="form-control-sm col-xs-12 col-lg-5 col-xl-6" />
                                <button id="btnSearch" class="btn-sm btn btn-normal  bottom-gap  tiny-leftmargin pull-xs-left" onclick="SearchMaintTypes();return false;">
                                    <i class="fa fa-search"></i>
                                </button>
                                <button id="btnShowAll" class="btn-sm btn btn-primary hide pull-xs-left  tiny-leftmargin" onclick="ShowAllMaintTypes();return false;">
                                    <%=GetGlobalResourceObject("Equipment_Resource", "showAll")%>
                                </button>
                                <span class="text-danger font-small pull-xs-left tiny-leftmargin push-down" id="spnSearchError"></span>
                            </div>
                        </fieldset>
                        <fieldset class="info-block bottom-gap">
                            <legend class="search-legend cursor-pointer" ><i class="fa fa-caret-down tiny-rightmargin"></i>
                              <span id ="fieldsetAddedit"></span>
                            </legend>
                            <div class="push-up">
                               
                                    
                                        <fieldset>
                                        <label class="form-control-label label-xxlarge nomarginleft labelMasterDataType">
                                        </label>
                                        <input type="text" id="txtNewMaintType" maxlength="30" class="form-control-sm col-xs-12 col-lg-5 col-xl-6" />
                                        </fieldset>
                                <fieldset>
                                        <label class="form-control-label label-xxlarge nomarginleft "> <%=GetGlobalResourceObject("Equipment_Resource", "description")%></label>
                                        <textarea id="txtMasterDescription" maxlength="100" class="form-control-lg font-small col-xs-12 col-lg-5 col-xl-6" rows="4"></textarea>
                                    </fieldset>
                                   
                                
                                <fieldset class="bottom-gap">
                                    <span class="font-small tiny-leftmargin pull-xs-left text-danger" id="spnAddMaintTypeError"></span>
                                    <div class="spinner-rectangle pull-xs-left" id="divCategoryProgress" style="display: none;">
                                    </div>
                                    <button onclick="ClearMaintenanceTypeInfo();return false;" class="btn btn-sm btn-cancel tiny-rightmargin pull-xs-right">
                                        <%=GetGlobalResourceObject("Equipment_Resource", "cancel")%>
                                    </button>
                                    <button id="btnAddMaintType" Class="btn btn-sm btn-success tiny-rightmargin pull-xs-right"
                                        runat="server" enableviewstate="false" ></button>
                                </fieldset>
                            </div>
                        </fieldset>

                        <fieldset class="heading-gap text-xs-right">
                            <span id="spnViewMaintTypes" onclick="javascript:ShowHideMaintTypesInfo();"><i class="cursor-pointer pull-right blue fa fa-plus-circle  font-bigger tiny-rightmargin"
                                id="iconViewMaintTypes"></i><span id="spnViewAllMaintTypes" class="pull-right bold blue cursor-pointer font-small">
                                     </span> </span>
                        </fieldset>
                        <div id="divMaintTypes" class="scroll-auto" style="max-height: 300px;">
                            <div class="table-side-box-heading">
                           <span id="spanListofInfo" class="m-l-1"></span>
                            </div>
                            <span id="divMaintTypesProgress" class="spinner-circle-big hide"></span>
                            <table id="tableMaintTypes" class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th class="center-align" style="width:18%">
                                            <%=GetGlobalResourceObject("Equipment_Resource", "action")%>
                                        </th>
                                        <th id="thMaintTypes" runat="server" enableviewstate="false" class="cursor-pointer center-align nowrap" style="width:35%">
                                            <span id="thMaintName" class="underline labelMasterDataType">
                                            </span><i class="tiny-leftmargin cursor-pointer"></i>
                                        </th>
                                        <th id="th1" runat="server" enableviewstate="false" class="cursor-pointer center-align" style="width:47%">
                                    <%=GetGlobalResourceObject("Equipment_Resource", "description")%>
                                            <i class="tiny-leftmargin cursor-pointer "></i>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody id="tbdMaintTypes" class="tbodypositionfixed" runat="server" data-bind="foreach: $root.DefaultMaintenanceTypesArray()">
                                    <tr>
                                        <td class="center-align">
                                            <i class="fa fa-edit linkcolor i-action tiny-leftmargin tiny-rightmargin v-icon  cursor-pointer" data-bind="click: $root.HasMaintTypeAccess ? function () { ShowEditMaintTypes($data); } : '', attr: BindIconAttributes($root.HasMaintTypeAccess)  " title="Edit"></i>
                                            <i class="fa fa-trash-o text-danger i-action tiny-leftmargin tiny-rightmargin v-icon  cursor-pointer" data-bind="click: $root.HasDeleteMaintTypeAccess ? function () { DeleteMaintTypeClick(MasterDataID); } : '', attr: BindIconAttributes($root.HasDeleteMaintTypeAccess)" title="Delete"></i>
                                        </td>
                                        <td class="break-all" data-bind="text: MasterDataName"></td>
                                          <td class="break-all" data-bind="text: Description"></td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr data-bind="visible: $root.DefaultMaintenanceTypesArray().length == 0">
                                                <td class="center-align" colspan="3"><span><%=GetGlobalResourceObject("Equipment_Resource", "noRecordFound")%></span>
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
