<%@ Page Title="" Language="C#" MasterPageFile="~/Vegam-Iframe.Master" AutoEventWireup="true" CodeBehind="AddEquipmentModel.aspx.cs" Inherits="Vegam_MaintenanceModule.Preventive.AddEquipmentModel" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/Vegam_AddEquipmentModel.js" type="text/javascript"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/iPAS_Pager.js"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/ajaxfileupload.js" type="text/javascript"></script>
    <link href="<%= ConfigurationManager.AppSettings["MaintCssPath"].TrimEnd('/') %>/Styles/select2.css" rel="stylesheet" type="text/css" />
    <script src="<%= ConfigurationManager.AppSettings["MaintCssPath"].TrimEnd('/') %>/Scripts/select3.js"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/AutoReSize.js"></script>
    <link href="<%= ConfigurationManager.AppSettings["MaintCssPath"].TrimEnd('/') %>/Styles/proplan_v7.css" rel="stylesheet" type="text/css" />
    <script>
        jQuery(document).ready(function () {
            jQuery("#txtEquipmentModelDesc").autoResize();
            jQuery("#divAddMaintenanceMasterDataModal").on('keydown', function (e) {
                if (e.keyCode == 27)
                    ClearMaintenanceTypeInfo(false);
            });
        });
    </script>
    <asp:ScriptManager ID="scriptManager" runat="server" EnableViewState="false">
    </asp:ScriptManager>
    <style>
        .ui-widget-overlay{
            z-index:9999 !important;
        }
        .ui-dialog{
            z-index:99999 !important;
        }
        .select2 {
            width: 100% !important;
            z-index: 999;
        }

          i[disabled] {
            color: gray !important;
            cursor: default !important;
        }

        .img-radius {
            border-radius: 10px;
            box-shadow: 0px 0px 4px 0.2px #ccc;
        }

        .rside-box {
            box-shadow: 0 0 10px 10px #f5f5f5;
            padding-top: 2px;
            overflow: auto;
            border: 1px solid #f3f1f1;
            min-height: 97vh;
            min-height:100% \9;
            height:100% \9;
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

        .link-disabled {
            pointer-events: none;
            color: gray;
        }
    </style>
    <div class="col-xs-12">
        <div class="row">
            <div id="divEquipmentModelList" class="col-xs-12 col-lg-4 pull-xs-right bottom-gap push-down p-r-0">
                <fieldset class="addNewMeasuringPoint rside-box">
                    <div class="tiny-padding col-xs-12" style="border-bottom: 1.5px solid #eee;">
                        <%--<fieldset>
                            <button id="btnAddNewEquipmentModel" class="btn btn-sm btn-success pull-xs-right" onclick="ClearEquipmentModeFieldlInfo();return false;"><%=GetGlobalResourceObject("EquipmentModel_Resource", "addNewEquipmentModel")%></button>
                        </fieldset>--%>
                        <fieldset class="push-down">
                            <label class="form-control-label pull-xs-left gray"><%=GetGlobalResourceObject("EquipmentModel_Resource", "equipmentModel")%></label>
                            <input type="text" class="form-control-sm col-xs-12 col-lg-8 pull-xs-right gray" id="txtSearchEquipmentModel" onkeyup="LoadEquipmentModelList()" placeholder="<%=GetGlobalResourceObject("EquipmentModel_Resource", "searchModelName")%>" />
                        </fieldset>
                        <span id="MeasuringPointErrorMsg" class="font-small text-xs-center gray hide"></span>
                    </div>
                    <fieldset class="tiny-padding p-b-0">
                        <fieldset id="fieldsetModelList" data-bind="foreach: EquipmentModelList">
                            <div class="col-xs-12 p-a-0 measuring-points bottom-gap" data-bind=" attr: { id: 'divTrash_' + TypeValue }">
                                <i class="fa fa-trash-o v-icon cursor-pointer text-danger" title="Delete"
                                    data-bind="css: 'cursor-pointer', click: (equipmentViewModel.HasDeleteAccess) ? function () { DeleteEquipmentModel(TypeValue) } : '', attr: BindIconAttributes(equipmentViewModel.HasDeleteAccess)" ></i>
                                <label class="col-xs-8 col-lg-9 tiny-leftmargin p-l-0 m-b-0 p-b-0 cursor-pointer" style="border-bottom: 1px solid #ccc" 
                                    data-bind="click: function () { jQuery.EquipmentModelNamespace.ModelID = TypeValue; LoadEquipmentModelInfo(); }, css: SelectedClass">
                                      <span data-bind="text: DisplayName"></span>
                                </label>
                            </div>
                        </fieldset>
                    </fieldset>
                    <div id="divLoadProgressVisible" class="spinner-circle-big hide"></div>
                    <div class="tiny-padding col-xs-12 p-t-0" data-bind="visible: IsEmptyModelist">
                        <div class=" center-align gray col-xs-12"><%=GetGlobalResourceObject("EquipmentModel_Resource", "noRecordFound")%></div>
                    </div>

                </fieldset>
            </div>

            <div id="divEquipmentModelInfo" class="col-xs-12 col-lg-8 push-down p-x-0">
                <div class="info-block m-r-0 m-b-1" style="padding: 2px" data-bind="visible: !IsEmptylist()">
                    <fieldset>
                        <span class="pull-xs-right">
                            <button id="buttonlnkMeasuringPoint" class="btn btn-mini btn-primary" onclick="ViewAdditionalInfoLinks('P'); return false;" ><%=GetGlobalResourceObject("EquipmentModel_Resource", "addViewMeasuringPoint")%></button>
                            <button id="buttonlnkDocuments" class="btn btn-mini btn-success" onclick="ViewAdditionalInfoLinks('D'); return false;" ><%=GetGlobalResourceObject("EquipmentModel_Resource", "addViewDocumentsAndImages")%></button>
                        </span>
                    </fieldset>
                </div>
                <div class="col-xs-12 col-sm-12 col-lg-5 col-xl-4 pull-xs-right">
                    <img style="width: 100px; height: 100px;" class="bottom-gap img-radius" data-bind="attr: { src: ModelImagePath }">
                    <div id="divUploadImage" class="col-xs-12 p-x-0">
                        <input id="imageFileToUpload" type="file" name="fileToUploadImage" data-bind="attr: { enable: HasUploadPermission }" class="form-control-sm bottom-gap" onchange="EquipmentModelImageUpload();return false;">
                        <p class="green"><%=GetGlobalResourceObject("EquipmentModel_Resource", "imageUploadInstruction")%></p>
                    </div>
                </div>
                <div class="col-xs-12 col-lg-7 col-xl-7 p-x-0">
                    <fieldset>
                        <label class="form-control-label col-xs-12 col-lg-5 col-xl-4"><%=GetGlobalResourceObject("EquipmentModel_Resource", "modelName")%></label>
                        <input type="text" maxlength="50" class="form-control-sm col-xs-12 col-lg-7 col-xl-8" data-bind="textInput: ModelName">
                    </fieldset>
                    <fieldset>
                        <label class="form-control-label col-xs-12 col-lg-5 col-xl-4"><%=GetGlobalResourceObject("EquipmentModel_Resource", "description")%></label>
                        <textarea id="txtEquipmentModelDesc" maxlength="200" class="form-control-sm col-xs-12 col-lg-7 col-xl-8 font-small" data-bind="textInput: ModelDescription, attr: { onkeydown: 'return checkTextAreaMaxLength(this,event,200)' }"></textarea>
                    </fieldset>
                    <fieldset>
                        <label class="form-control-label col-xs-12 col-lg-5 col-xl-4"><%=GetGlobalResourceObject("EquipmentModel_Resource", "manufacturer")%></label>
                        <div class="col-xs-12 col-lg-7 col-xl-8 p-a-0">
                            <div class="col-xs-10 col-lg-11 p-x-0">
                                <select id="drpModelManufacturer" class="form-control-sm selectDropDown" data-bind="options: ManufacturerList, optionsText: 'DisplayName', optionsValue: 'TypeValue', value: SelectedManufacturer">
                                </select>
                            </div>
                            <i class="fa blue cursor-pointer fa-plus-circle fa-2x pull-xs-right" onclick="javascript:ShowAddMaintenanceTypeModal('M');" title="Add/Edit Manufacture"></i>
                        </div>
                    </fieldset>
                    <fieldset>
                        <label class="form-control-label col-xs-12 col-lg-5 col-xl-4"><%=GetGlobalResourceObject("EquipmentModel_Resource", "model_versionNo")%></label>
                        <input type="text" maxlength="50" class="form-control-sm col-xs-12 col-lg-7 col-xl-8" data-bind="textInput: ModelVersionNo">
                    </fieldset>
                    <fieldset>
                        <label class="form-control-label col-xs-12 col-lg-5 col-xl-4"><%=GetGlobalResourceObject("EquipmentModel_Resource", "modelType")%></label>
                        <div class="col-xs-12 col-lg-7 col-xl-8 p-a-0">
                            <div class="col-xs-10 col-lg-11 p-x-0">
                                <select id="drpModelType" class="form-control-sm selectDropDown" data-bind="options: ModelTypeList, optionsText: 'DisplayName', optionsValue: 'TypeValue', value: SelectedModelType">
                                </select>
                            </div>
                            <i class="fa blue cursor-pointer fa-plus-circle fa-2x pull-xs-right" onclick="javascript:ShowAddMaintenanceTypeModal('T');" title="Add/Edit Type"></i>
                        </div>
                    </fieldset>
                    <fieldset>
                        <label class="form-control-label col-xs-7 col-lg-5 col-xl-4"><%=GetGlobalResourceObject("EquipmentModel_Resource", "modelClass")%></label>
                        <div class="col-xs-12 col-lg-7 col-xl-8 p-a-0">
                            <div class="col-xs-10 col-lg-11 p-x-0">
                                <select id="drpModelClass" class="form-control-sm selectDropDown" data-bind="options: ModelClassList, optionsText: 'DisplayName', optionsValue: 'TypeValue', value: SelectedModelClass">
                                </select>
                            </div>
                            <i class="fa blue cursor-pointer fa-plus-circle fa-2x pull-xs-right" onclick="javascript:ShowAddMaintenanceTypeModal('C');" title="Add/Edit Class"></i>
                        </div>
                    </fieldset>
                    <fieldset class="heading-gap">
                        <button id="cancel" class="btn btn-sm btn-cancel pull-xs-right" onclick="ClearEquipmentModeFieldlInfo();return false;" enableviewstate="false"><%=GetGlobalResourceObject("EquipmentModel_Resource", "cancel")%></button>
                        <button id="btnAddUpdateEquipmentModel" class="btn btn-sm btn-success pull-xs-right tiny-rightmargin" runat="server" enableviewstate="false"><%=GetGlobalResourceObject("EquipmentModel_Resource", "saveAndAddMore")%></button>
                        <span id="divProgress" class="spinner-circle-small absolute medium-leftmargin hide"></span>
                    </fieldset>
                    <div class="p-l-1 push-down" data-bind="html: ModelErrorMsg, css: ModelErrorCss"></div>
                </div>
            </div>

            <div id="divAddMaintenanceMasterDataModal" data-backdrop="static" data-keyboard="false" class="modal fade in ">
                <input type="hidden" id="hdfSortValue" />
                <input type="hidden" runat="server" enableviewstate="false" value="5" id="hdnModelPageSize" />
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
                                <legend class="search-legend cursor-pointer"><i class="fa fa-caret-down tiny-rightmargin"></i>
                                    <span id="fieldsetAddedit"></span>
                                </legend>
                                <div class="push-up">


                                    <fieldset>
                                        <label class="form-control-label label-xxlarge nomarginleft labelMasterDataType">
                                        </label>
                                        <input type="text" id="txtNewMaintType" maxlength="30" class="form-control-sm col-xs-12 col-lg-5 col-xl-6" />
                                    </fieldset>
                                    <fieldset>
                                        <label class="form-control-label label-xxlarge nomarginleft "><%=GetGlobalResourceObject("Equipment_Resource", "description")%></label>
                                        <textarea id="txtMasterDescription" maxlength="100" class="form-control-lg font-small col-xs-12 col-lg-5 col-xl-6" rows="4"></textarea>
                                    </fieldset>

                                    <fieldset class="bottom-gap">
                                        <span class="font-small tiny-leftmargin pull-xs-left text-danger" id="spnAddMaintTypeError"></span>
                                        <div class="spinner-rectangle pull-xs-left" id="divCategoryProgress" style="display: none;">
                                        </div>
                                        <button onclick="ClearMaintenanceTypeInfo();return false;" class="btn btn-sm btn-cancel tiny-rightmargin pull-xs-right">
                                            <%=GetGlobalResourceObject("Equipment_Resource", "cancel")%>
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
                                            <th class="center-align" style="width: 18%">
                                                <%=GetGlobalResourceObject("Equipment_Resource", "action")%>
                                            </th>
                                            <th id="thMaintTypes" runat="server" enableviewstate="false" class="cursor-pointer center-align nowrap" style="width: 35%">
                                                <span id="thMaintName" class="underline labelMasterDataType"></span><i class="tiny-leftmargin cursor-pointer" style="width: 47%"></i>
                                            </th>
                                            <th id="th1" runat="server" enableviewstate="false" class="cursor-pointer center-align">
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
        </div>
    </div>

    <div class="small-popup" >
        <div id="alertModal">
            <div>
                <p id="alertMessage">
                </p>
            </div>
        </div>
    </div>
</asp:Content>
