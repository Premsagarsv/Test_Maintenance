﻿<%@ Page Title="" Language="C#" MasterPageFile="~/Vegam-Iframe.Master" AutoEventWireup="true" CodeBehind="AddMeasuringPoint.aspx.cs" Inherits="Vegam_MaintenanceModule.Preventive.AddMeasuringPoint" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <asp:ScriptManager ID="scriptManager" runat="server" EnableViewState="false">
    </asp:ScriptManager>
    <link href="<%=ConfigurationManager.AppSettings["MaintCssPath"].TrimEnd('/') %>/Styles/themes/default/style.css" rel="stylesheet" type="text/css" />
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/Vegam_AddMeasuringPoint.js" type="text/javascript"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/ajaxfileupload.js" type="text/javascript"></script>
    <link href="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Styles/select2.css" rel="stylesheet" type="text/css" />
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/select3.js"></script>
    <script type="text/javascript" src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/iPAS_Common_v4.js"></script>
    <script type="text/javascript" src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/iPAS_Pager.js"></script>
    <script type="text/javascript" src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/AutoReSize.js"></script>
    <script type="text/javascript" src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/jstree.js"></script>
    <script type="text/javascript" src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/vakata-jstree.js"></script>
    <script type="text/javascript" src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/jstree.checkbox.js"></script>
    <script type="text/javascript" src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/jquery.qrcode.min.js"></script>
    <script type="text/javascript" src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/pdfmake.min.js"></script>
    <script type="text/javascript">
        jQuery(document).ready(function () {
            jQuery('[data-toggle="popover"]').popover();
            jQuery('#popoverData').popover();
            jQuery('.pover').popover({ trigger: "hover" });
            jQuery("#txtDescription").autoResize();
        });
    </script>
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
        .select2 {
            width: 100% !important;
        }

        .select2-container {
            z-index: 99 !important
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
            border-bottom: 1.5px solid #eee
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

        /*//  @media (min-width:)*/

        #divOPCNodeTree .jstree-leaf > a > ins {
            background: red;
        }

        .pointer-evt {
            pointer-events: none;
        }
    </style>

    <div class="col-xs-12 push-down p-x-0 bottom-gap">
        <div class="row">
            <div class="col-xs-12 col-lg-4 pull-xs-right">
                <div class="rside-box">
                    <fieldset class="addNewMeasuringPoint info-block box-shadow bg-transparent" id="divMeasuringPointList">
                        <div class="tiny-padding col-xs-12 bottom-gap" style="border-bottom: 1.5px solid #eee;">
                           
                            <fieldset class="info-block bottom-gap">
                                <legend class="search-legend cursor-pointer"><i class="fa fa-caret-down tiny-rightmargin"></i><%=GetGlobalResourceObject("MeasuringPoint_Resource", "filters")%></legend>
                                <div>
                                    <fieldset data-bind="visible: FdFuncLocFilter">
                                        <label class="form-control-label label-xxxlarge nomarginleft"><%=GetGlobalResourceObject("MeasuringPoint_Resource", "functionalLocation")%></label>
                                        <div class="col-xs-12 col-lg-6 p-x-0">
                                            <select class="form-control-sm  Parameters-Select select2" id="drpFilterFuncLoc"
                                                data-bind="options: FunctionalLocationList, optionsText: 'DisplayName', optionsValue: 'TypeValue', value: SelectFunctionalLocationFilter, event: { change: ChangeEventBind() == true ? function () { LoadAllEquipmentInfo(false, true,false) } : '' }">
                                            </select>
                                        </div>
                                    </fieldset>
                                    <fieldset data-bind="visible: FdEquipmentFilter">
                                        <label class="form-control-label label-xxxlarge nomarginleft"><%=GetGlobalResourceObject("MeasuringPoint_Resource", "equipment")%></label>
                                        <div class="col-xs-12 col-lg-6 p-x-0">
                                            <select class="form-control-sm Parameters-Select select2" id="drpFilterEquipment"
                                                data-bind="options: EquipmentList, optionsText: 'DisplayName', optionsValue: 'TypeValue', value: SelectEquipmentFilter, attr: { id: 'drpFilterEquipment' }, event: { change: ChangeEventBind() == true ? function () { LoadMeasuringPointList(jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment) } : '' }">
                                            </select>
                                        </div>
                                    </fieldset>
                                    <fieldset data-bind="visible: FdEquipModelFilter">
                                        <label class="form-control-label label-xxxlarge nomarginleft"><%=GetGlobalResourceObject("MeasuringPoint_Resource", "equipmentModel")%></label>
                                        <div class="col-xs-12 col-lg-6 p-x-0">
                                            <select class="form-control-sm Parameters-Select select2" id="drpFilterEquipModel"
                                                data-bind="options: EquipmentModelList, optionsText: 'DisplayName', optionsValue: 'TypeValue', value: SelectEquipmentModelFilter, attr: { id: 'drpFilterEquipModel' }, event: { change: ChangeEventBind() == true ? function () { LoadMeasuringPointList(jQuery.MeasuringPointNameSpace.MeasuringPointDataTyeInfo.Equipment_Model) } : '' }">
                                            </select>
                                        </div>
                                    </fieldset>
                                    <span id="measuringPointErrorMsg" class="font-small red col-xs-12 p-l-0"></span>
                                </div>
                            </fieldset>
                            <label class="form-control-label pull-xs-left label-xxxlarge nomarginleft gray"><%=GetGlobalResourceObject("MeasuringPoint_Resource", "measuringPoint")%></label>
                            <input type="text" class="form-control-sm col-xs-12 col-lg-6  gray" id="txtSearchMeasuringPoint" onkeyup="LoadMeasuringPointList()" placeholder="<%=GetGlobalResourceObject("MeasuringPoint_Resource", "searchMeasuringPoint")%>" />
                            
                        </div>
                        <div class="col-xs-12 p-a-0">
                        <fieldset class="tiny-padding col-xs-12 p-t-0" style="max-height: 350px; overflow-y: auto" data-bind="foreach: MeasuringPointList">
                            <div class="bottom-gap col-xs-12 flocations cursor-pointer p-l-0" ">
                                <i class="fa fa-trash-o text-danger v-icon cursor-pointer tiny-leftmargin" title="Delete" data-bind="click: $root.HasDeleteAccess ? function () { DeleteMeasuringPointClick(MeasuringPointID); } : '', attr: BindIconAttributes($root.HasDeleteAccess)"></i>
                                <label class="col-xs-8 col-lg-9 tiny-leftmargin p-l-0 m-b-0 p-b-0 cursor-pointer" style="border-bottom: 1px solid #ccc" data-bind="text: MeasuringPointName, css: SelectedClass, click: function () { LoadSelectedMeasuringPoint(MeasuringPointID) }"></label>
                            </div>
                            
                        </fieldset>
                         <div id="divLoadProgressVisible" class="spinner-circle-big hide"></div>
                            </div>
                         <div data-bind="visible: LoadMeasuringPointErrorMessageVisible" class="center-align">
                            <span data-bind="text: LoadMeasuringPointListError, attr: { class: LoadMeasuringPointListErrorClass }"></span>
                        </div>
                    </fieldset>
                    
                </div>
            </div>
            <div id="divMeasuringPointUC" class="col-xs-12 col-lg-8 push-down">

                <div id="divUrlLink" class="info-block tiny-padding p-y-0 m-r-0 m-b-1 hide">                 
                      <fieldset>
                    <span class="pull-xs-right">
                    <button  id="lnkFLocation" class="btn btn-mini btn-primary hide" onclick="ViewAdditionalInfoLinks('L'); return false;"><%=GetGlobalResourceObject("MeasuringPoint_Resource", "addViewFunctionalLocation")%></button>
                    <button id="lnkEquipmentInfo" class="btn btn-mini btn-success hide" onclick="ViewAdditionalInfoLinks('E'); return false;"></button>
                        </span>
                        </fieldset>
                </div>
                <div id="divUserInfoUpload" class="col-xs-12 col-lg-4 pull-xs-right">
                    <img id="imgMeasuringPointImage" style="width: 100px; height: 100px;" class="bottom-gap">
                    <div id="divUploadImage" class="col-xs-12 p-x-0">
                        <input id="imageFileToUpload" type="file" name="fileToUploadImage" class="form-control-sm tiny-leftmargin bottom-gap" onchange="MeasuringPointImageUpload()">
                        <p class=" green"><%=GetGlobalResourceObject("MeasuringPoint_Resource", "imageUploadInstruction")%></p>
                    </div>
                </div>
                <div class="col-xs-12 col-sm-12 col-lg-7 col-xl-8 p-x-0">
                    <fieldset data-bind="visible: FdMeasuringPointDataType">
                        <fieldset>
                            <label class="form-control-label col-xs-12 col-lg-5 col-xl-4"><%=GetGlobalResourceObject("MeasuringPoint_Resource","measuringPointType")%></label>
                            <select id="drpMeasuringPointDataType" class="form-control-sm col-xs-12 col-lg-7 col-xl-8" data-bind="options: MeasuringPointDataTypeList, optionsText: 'DisplayName', optionsValue: 'TypeValue', value: SelectedMeasuringPointDataType, event: { change: function () { LoadMeasuringPointDataTypeFilter(false) } }"></select>
                        </fieldset>
                        <fieldset>
                            <label data-bind="text: LblMeasuringPointDataType" class="form-control-label col-xs-12 col-lg-5 col-xl-4"></label>
                            <div class="col-xs-12 col-lg-7 col-xl-8 p-x-0">
                                <select id="drpMeasuringPointDataTypeInfo" class="form-control-sm Parameters-Select select2" data-bind="options: MeasuringPointDataTypeInfo, optionsText: 'DisplayName', optionsValue: 'TypeValue', value: SelectedMeasuringPointDataTypeInfo"></select>
                            </div>
                        </fieldset>
                    </fieldset>
                   
                    <fieldset data-bind="visible: FdGenerateCode">
                        <label class="form-control-label col-xs-12 col-lg-5 col-xl-4"><%=GetGlobalResourceObject("MeasuringPoint_Resource","measuringCode")%></label>
                        <input id="txtMeasuringCode" runat="server" type="text" class="form-control-sm col-xs-12 col-lg-4 tiny-rightmargin" data-bind="attr: { 'disabled': !BtnGenerateCode() }, textInput: MeasuringCode">
                        <i class="fa fa-qrcode cursor-pointer pover pull-xs-left tiny-rightmargin" data-bind="visible: MeasuringCode() != '' ? true : false" onclick="DownloadQrCode();return false;" data-content="<%=GetGlobalResourceObject("MeasuringPoint_Resource", "downloadQRCode")%>" data-placement="top" data-original-title="" style="font-size:2.2rem;"></i>
                        <a id="btnGenerateCode" runat="server" class="btn  btn-sm pull-xs-left btn-primary" data-bind="visible: BtnGenerateCode, click: function () { GenerateMeasuringPointCode(); return false; }"><i><%=GetGlobalResourceObject("MeasuringPoint_Resource", "generateCode")%></i></a>
                        <a class="btn btn-cancel btn-sm pull-xs-left" data-bind="visible: !BtnGenerateCode(), click: function () { ClearMeasuringPointCode(); return false; }"><i><%=GetGlobalResourceObject("MeasuringPoint_Resource", "clearCode")%></i></a>
                        <div id="divQRCodeMaker" class="hide"></div>
                    </fieldset>
                    <fieldset>
                        <label class="form-control-label col-xs-12 col-lg-5 col-xl-4"><%=GetGlobalResourceObject("MeasuringPoint_Resource","measuringPointName")%></label>
                        <input type="text" maxlength="50" class="form-control-sm col-xs-12 col-lg-7 col-xl-8" data-bind="textInput: MeasuringPointName">
                    </fieldset>
                    <fieldset data-bind="visible: FdFLocationOrEquipOrModel">
                        <label data-bind="text: LblFLocationOrEquipOrModel" class="form-control-label col-xs-12 col-lg-5 col-xl-4"></label>
                        <div class="col-xs-12 col-lg-7 col-xl-8 p-x-0">
                            <select id="drpFLocationOrEquipOrModel" class="form-control-sm Parameters-Select select2" data-bind="options: FLocationOrEquipOrModelList, optionsText: 'DisplayName', optionsValue: 'TypeValue', value: SelectedFLocationOrEquipOrModel, event: { change: ChangeEventBind() == true ? function () { LoadAllEquipmentInfo(false, false) } : '' }"></select>
                        </div>
                    </fieldset>
                    <fieldset data-bind="visible: FdEquipmentForLoc">
                        <label class="form-control-label col-xs-12 col-lg-5 col-xl-4"><%=GetGlobalResourceObject("MeasuringPoint_Resource","equipment")%></label>
                        <div class="col-xs-12 col-lg-7 col-xl-8 p-x-0">
                            <select id="drpEquipmentForLoc" class="form-control-sm Parameters-Select select2" data-bind="options: EquipmentForLocList, optionsText: 'DisplayName', optionsValue: 'TypeValue', value: SelectEquipmentForLocation"></select>
                        </div>
                    </fieldset>
                    <fieldset>
                        <label class="form-control-label col-xs-12 col-lg-5 col-xl-4"><%=GetGlobalResourceObject("MeasuringPoint_Resource","description")%></label>
                        <textarea maxlength="200" id="txtDescription" class="form-control-lg font-small col-xs-12 col-lg-7 col-xl-8 bottom-gap" rows="4" onkeypress="return checkTextAreaMaxLength(this,event,200);" data-bind="textInput: Description"></textarea>
                    </fieldset>
                    <fieldset>
                        <label class="form-control-label col-xs-12 col-lg-5 col-xl-4"><%=GetGlobalResourceObject("MeasuringPoint_Resource","position")%></label>
                        <input type="text" maxlength="100" class="form-control-sm col-xs-12 col-lg-7 col-xl-8" data-bind="textInput: Position">
                    </fieldset>
                    <fieldset>
                        <label class="form-control-label col-xs-12 col-lg-5 col-xl-4"><%=GetGlobalResourceObject("MeasuringPoint_Resource","category")%></label>
                        <div class="col-xs-12 col-lg-7 col-xl-8 p-x-0">
                        <div class="col-xs-10 col-lg-11 p-x-0">
                            <select id="drpCategory" class="form-control-sm Parameters-Select select2" data-bind="options: CategoryList, optionsText: 'DisplayName', optionsValue: 'TypeValue', value: SelectedCategory">
                            </select>
                        </div>
                        <i class="fa blue cursor-pointer fa-plus-circle fa-2x pull-xs-right" onclick="javascript:ShowAddMaintenanceTypeModal('P');" title="Add/Edit Selection Group"></i>
                            </div>
                    </fieldset>
                    <fieldset>
                        <label class="form-control-label col-xs-12 col-lg-5 col-xl-4"><%=GetGlobalResourceObject("MeasuringPoint_Resource","sensorType")%></label>
                        <div class="col-xs-12 col-lg-7 col-xl-8 p-x-0">
                            <select id="drpSensorType" class="form-control-sm Parameters-Select select2" data-bind="options: SensorTypeList, optionsText: 'DisplayName', optionsValue: 'TypeValue', value: SelectedSensorType, event: { change: function () { LoadSensorUnitInfo() } }">
                            </select>
                        </div>
                    </fieldset>
                    <fieldset>
                        <label class="form-control-label col-xs-12 col-lg-5 col-xl-4"><%=GetGlobalResourceObject("MeasuringPoint_Resource","measuringPointAttribute")%></label>
                        <div class="col-xs-12 col-lg-7 col-xl-8 p-x-0">
                            <select id="drpSensorTypeUnit" class="form-control-sm Parameters-Select select2" data-bind="options: SensorTypeUnitList, optionsText: 'DisplayName', optionsValue: 'TypeValue', value: SelectedSensorTypeUnit">
                            </select>
                        </div>
                    </fieldset>

                    <fieldset>
                        <div class="col-xs-12 col-lg-7 col-xl-8 p-x-0 pull-xs-right tiny-padding">
                            <input type="checkbox" id="chkIsCounter" data-bind="checked: IsCounter" class="pull-xs-left" /><span class="pull-xs-left tiny-leftmargin" style="margin-top: -4px">Is Counter</span>
                        </div>
                    </fieldset>
                    <fieldset>
                        <label class="form-control-label col-xs-12 col-lg-5 col-xl-4"><%=GetGlobalResourceObject("MeasuringPoint_Resource","mpReadingType")%></label>
                        <select id="drpReadingType" class="form-control-sm col-xs-12 col-lg-7 col-xl-8" data-bind="options: ReadingTypeList, optionsText: 'DisplayName', optionsValue: 'TypeValue', value: SelectedReadingType, event: { change: function () { HideAndShowFieldSet() } }">
                        </select>
                    </fieldset>

                    <fieldset data-bind="visible: FdDecimal">
                        <fieldset>
                            <label class="form-control-label col-xs-12 col-lg-5 col-xl-4"><%=GetGlobalResourceObject("MeasuringPoint_Resource","decimalPlaces")%></label>
                            <input type="text" class="form-control-sm col-xs-12 col-lg-7 col-xl-8" maxlength="8" onkeypress="return isNumberKey(event)" data-bind="textInput: DecimalPlaces">
                        </fieldset>
                        <fieldset>
                            <label class="form-control-label col-xs-12 col-lg-4 pull-xs-right p-y-0 font-mini bold gray"><%=GetGlobalResourceObject("MeasuringPoint_Resource","upper")%></label>
                            <label class="form-control-label col-xs-12 col-lg-4 pull-xs-right p-y-0 font-mini bold gray"><%=GetGlobalResourceObject("MeasuringPoint_Resource","lower")%></label>                           
                        </fieldset>
                        
                        <fieldset>
                            <label class="form-control-label col-xs-12 col-lg-5 col-xl-4"><%=GetGlobalResourceObject("MeasuringPoint_Resource","limit")%></label>
                            <input id="txtLowerLimit" type="text" class="form-control-sm col-xs-12 col-lg-4" maxlength="7" onkeypress="return isDecimalCheckWithNegativeValue(event,this);" data-bind="value: LowerLimit, valueUpdate: 'afterkeydown'">
                            <input id="txtUpperLimit" type="text" class="form-control-sm col-xs-12 col-lg-4" maxlength="7" onkeypress="return isDecimalCheckWithNegativeValue(event,this);" data-bind="value: UpperLimit, valueUpdate: 'afterkeydown'">                           
                        </fieldset>                        
                        <fieldset>
                            <label class="form-control-label col-xs-12 col-lg-5 col-xl-4"><%=GetGlobalResourceObject("MeasuringPoint_Resource","limitWarning")%></label>
                            <input type="text" class="form-control-sm col-xs-12 col-lg-4" maxlength="7" onkeypress="return isDecimalCheckWithNegativeValue(event,this);" data-bind="value: LowerLimitWarn, valueUpdate: 'afterkeydown'">
                            <input type="text" class="form-control-sm col-xs-12 col-lg-4" maxlength="7" onkeypress="return isDecimalCheckWithNegativeValue(event,this);" data-bind="value: UpperLimitWarn, valueUpdate: 'afterkeydown'">                           
                        </fieldset>                  
                    </fieldset>

                    <fieldset data-bind="visible: FdNumeric">
                        <fieldset>
                             <label class="form-control-label col-xs-12 col-lg-4 pull-xs-right p-y-0 font-mini bold gray"><%=GetGlobalResourceObject("MeasuringPoint_Resource","upper")%></label>
                            <label class="form-control-label col-xs-12 col-lg-4 pull-xs-right p-y-0 font-mini bold gray"><%=GetGlobalResourceObject("MeasuringPoint_Resource","lower")%></label>                       
                        </fieldset>
                        <fieldset>
                            <label class="form-control-label col-xs-12 col-lg-5 col-xl-4"><%=GetGlobalResourceObject("MeasuringPoint_Resource","limit")%></label>
                            <input type="text" class="form-control-sm col-xs-12 col-lg-4" maxlength="7" onkeypress="return isNumberKey(event);" data-bind="textInput: LowerLimit">
                            <input type="text" class="form-control-sm col-xs-12 col-lg-4" maxlength="7" onkeypress="return isNumberKey(event);" data-bind="textInput: UpperLimit">                          
                        </fieldset>
                        
                        <fieldset>
                            <label class="form-control-label col-xs-12 col-lg-5 col-xl-4"><%=GetGlobalResourceObject("MeasuringPoint_Resource","limitWarning")%></label>
                            <input type="text" class="form-control-sm col-xs-12 col-lg-4" maxlength="7" onkeypress="return isNumberKey(event);" data-bind="textInput: LowerLimitWarn">
                            <input type="text" class="form-control-sm col-xs-12 col-lg-4" maxlength="7" onkeypress="return isNumberKey(event);" data-bind="textInput: UpperLimitWarn">                            
                        </fieldset>

                    </fieldset>

                    <fieldset data-bind="visible: FdText">
                        <label class="form-control-label col-xs-12 col-lg-5 col-xl-4"><%=GetGlobalResourceObject("MeasuringPoint_Resource","maximumLength")%></label>
                        <input type="text" class="form-control-sm col-xs-12 col-lg-7 col-xl-8" maxlength="7" onkeypress="return isNumberKey(event)" data-bind="textInput: MaxLength">
                    </fieldset>

                    <fieldset data-bind="visible: FdSelection">
                        <label class="form-control-label col-xs-12 col-lg-5 col-xl-4"><%=GetGlobalResourceObject("MeasuringPoint_Resource","selectionGroup")%></label>
                        <div class="col-xs-12 col-lg-7 col-xl-8 p-x-0">
                            <div class="col-xs-10 col-lg-11 p-x-0">
                            <select id="drpGroup" class="form-control-sm Parameters-Select select2" data-bind="options: GroupList, optionsText: 'DisplayName', optionsValue: 'TypeValue', value: SelectedGroup">
                            </select>
                                </div>
                               <i class="fa blue cursor-pointer fa-plus-circle fa-2x pull-xs-right" onclick="javascript:ShowAddMaintenanceTypeModal('G');" title="Add/Edit Selection Group"></i>
                        </div>
                    </fieldset>

                    <fieldset>
                        <label class="form-control-label col-xs-12 col-lg-5 col-xl-4">
                           <%=GetGlobalResourceObject("MeasuringPoint_Resource","connectTag")%>
                        </label>
                       <div class="col-xs-12 col-lg-7 col-xl-8 p-x-0">
                        <input type="text" id="txtConnecttoTag" class="form-control-sm col-xs-12 col-xl-7" style="margin-bottom:1px"
                            disabled="disabled" />
                           <div class="col-xs-12 col-xl-5 tiny-padding p-y-0 p-r-0">

                        <button type="button" class="btn btn-sm btn-info font-small col-xs-12 col-lg-7" id="btnOPCModal"
                            onclick="javascript:ShowOPCDataSourceModal(); return false;">
                            <i class="fa fa-search"></i>
                            <%=GetGlobalResourceObject("MeasuringPoint_Resource","browse")%>
                        </button>
                        <button type="button" class="btn btn-sm btn-success font-small col-xs-12 col-lg-4 pull-xs-right" id="btnClearTag"
                            onclick="javascript:ClearTags(); return false;">
                           <%=GetGlobalResourceObject("MeasuringPoint_Resource","clear")%>
                        </button>
                               </div>
                           </div>
                    </fieldset>

                    <fieldset class="col-xs-12 bottom-gap heading-gap p-r-0">
                        <button id="btnCancelMesuringPoint" class="btn btn-sm btn-cancel pull-xs-right" onclick="ClearMeasuringPointInfo();return false;"><%=GetGlobalResourceObject("MeasuringPoint_Resource","cancel")%></button>
                        <button id="btnSaveMeasuringPoint" runat="server" class="btn btn-sm btn-success pull-xs-right tiny-rightmargin"><%=GetGlobalResourceObject("MeasuringPoint_Resource","saveAndAddMore")%></button>

                    </fieldset>

                    <%-- <p class="text-danger font-small m-l-1 col-xs-12 bottom-gap" id="spnErrorMessage">
                        </p>--%>
                    <div class="leftmargin pull-xs-left">
                        <span data-bind="html: LoadErrorMessage, attr: { class: LoadErrorMessageClass }"></span>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <div id="modalOPCUUIDTagInfo" class="modal fade" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header p-b-0">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h5><%=GetGlobalResourceObject("MeasuringPoint_Resource","opcDetails")%></h5>
                </div>
                <div class="modal-body row">
                    <div class="col-xs-12">
                        <div class="col-xs-12 p-l-1 well bottom-gap">
                            <label class="form-control-label pull-xs-left medium-rightmargin">
                            </label>
                            <select class="form-control-sm  rightmargin pull-xs-left " id="drpDataSourceList">
                            </select>
                            <input class="col-xs-3 form-control-sm" placeholder="Tag Name" id="txtTagName" type="text" />
                            <button class="btn btn-normal btn-sm medium-leftmargin" id="btnSearch" onclick="javascript:SearchOPCTags(); return false;">
                                <i class="fa fa-search"></i>
                            </button>
                            <span class="tiny-leftmargin text-danger hide" id="spanTagSerachError"></span>
                        </div>
                        <div class="col-xs-12 heading-gap nomarginleft well bottom-gap">
                            <div class="col-xs-12 table-with-heading tiny-rightmargin p-a-0 bottom-gap" id="divTreeContainer">
                                <div class="table-side-box-heading" style="background-color: #c4c9ce !important; padding-bottom: 33px;">
                                    <span class="medium-leftmargin black push-down pull-xs-left"><%=GetGlobalResourceObject("MeasuringPoint_Resource","addressSpace")%></span>
                                    <button class="btn btn-primary hide btn-sm tiny-leftmargin pull-xs-right m-r-1" id="btnSelectTag"
                                        onclick="javascript:HideOPCModal(); return false;">
                                       <%=GetGlobalResourceObject("MeasuringPoint_Resource","select")%>
                                    </button>
                                    <button class="btn btn-primary btn-sm tiny-leftmargin pull-xs-right m-r-1" id="btnOpc">
                                        Test
                                    </button>
                                </div>
                                <div class="table-side-box-content col-xs-8 p-a-0 info-block heading-gap" id="divOPCTags"
                                    style="width: 58%;">
                                    <div id="divOPCNodeTree" style="max-height: 290px; overflow-y: auto; overflow-x: auto;">
                                    </div>
                                    <p class="pull-left text-danger center-align col-xs-12 big push-down" id="opcNodeFetchingError">
                                    </p>
                                </div>
                                <div class="col-xs-12 col-md-5 p-a-0 pull-xs-right heading-gap">
                                    <div class="col-xs-12 p-a-0 hide" id="opcHide">
                                        <fieldset class="push-down">
                                            <label class="form-control-label col-xs-4">
                                                <%=GetGlobalResourceObject("MeasuringPoint_Resource","value")%></label>
                                            <input class="form-control-sm col-xs-8" type="text" id="txtValue" />
                                        </fieldset>
                                        <fieldset>
                                            <label class="form-control-label col-xs-4">
                                                <%=GetGlobalResourceObject("MeasuringPoint_Resource","quality")%></label>
                                            <input class="form-control-sm col-xs-8" type="text" id="txtQuality" />
                                        </fieldset>
                                        <fieldset>
                                            <label class="form-control-label col-xs-4">
                                               <%=GetGlobalResourceObject("MeasuringPoint_Resource","timestamp")%></label>
                                            <input class="form-control-sm col-xs-4" type="text" id="txtTimeStamp" />
                                            <div class="spinner-rectangle pull-xs-left hide" id="spinReadTag">
                                            </div>
                                            <button class="btn btn-primary btn-sm tiny-leftmargin pull-xs-right tiny-rightmargin"
                                                id="btnReadTag" onclick="javascript:ReadTagData(); return false;">
                                                <%=GetGlobalResourceObject("MeasuringPoint_Resource","read")%></button>
                                            <span class="tiny-leftmargin text-danger pull-xs-left hide" id="spnReadError"></span>
                                        </fieldset>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="spinner-circle-big hide" id="divTagProgress">
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id="divAddMaintenanceMasterDataModal" data-backdrop="static" data-keyboard="false" class="modal fade in ">
              <input type="hidden" id="hdfSortValue" />
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" onclick="ClearMaintenanceTypeInfo(); return false;" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h5 id="modalHeaderName"></h5>
                    </div>
                    <div class="modal-body" style="min-height: 190px; overflow: hidden;">
                        <fieldset class="info-block bottom-gap">
                            <legend class="search-legend cursor-pointer" id="legSearchCriteria"><i class="fa fa-caret-down tiny-rightmargin"></i> <%=GetGlobalResourceObject("MeasuringPoint_Resource","defineSearchCriteria")%></legend>
                            <div class="push-up">
                                <label id="lblSearchField" class="form-control-label label-xxxlarge nomarginleft labelMasterDataType">
                                </label>
                                <input type="text" id="txtSearchMaintType" maxlength="30" class="form-control-sm col-xs-12 col-lg-5" />
                                <button id="btnSearchMasterDataType" class="btn-sm btn btn-normal  bottom-gap  tiny-leftmargin pull-xs-left" onclick="SearchMaintTypes();return false;">
                                    <i class="fa fa-search"></i>
                                </button>
                                <button id="btnShowAll" class="btn-sm btn btn-primary hide pull-xs-left  tiny-leftmargin" onclick="ShowAllMaintTypes();return false;">
                                   <%=GetGlobalResourceObject("MeasuringPoint_Resource","showAll")%>
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
                                        <label class="form-control-label label-xxxlarge nomarginleft labelMasterDataType">
                                        </label>
                                        <input type="text" id="txtNewMaintType" maxlength="50" class="form-control-sm col-xs-12 col-lg-5 col-xl-6" />
                                        </fieldset>
                                 <fieldset class="hide" id="fdDescription">
                                        <label class="form-control-label label-xxxlarge nomarginleft"><%=GetGlobalResourceObject("MeasuringPoint_Resource","maintenanceTypeDesc")%></label>
                                        <textarea id="txtMasterDescription" maxlength="100" class="form-control-lg font-small col-xs-12 col-lg-5 col-xl-6 bottom-gap" rows="4"></textarea>
                                   </fieldset>
                                <div id="addItem" class="hide">
                                     <fieldset>
                                        <label class="form-control-label label-xxxlarge nomarginleft"><%=GetGlobalResourceObject("MeasuringPoint_Resource","itemName")%></label>
                                        <input type="text" id="txtItemName" maxlength="50" class="form-control-sm col-xs-12 col-lg-5 col-xl-6" />
                                        
                                          <button class="btn btn-sm btn-success tiny-rightmargin pull-xs-right" onclick="javascript:AddItemsToModal();return false;"><%=GetGlobalResourceObject("MeasuringPoint_Resource","addItem")%></button>
                                         </fieldset>
                                         <div id="divAddedItems" class="tiny-padding" style="max-height: 130px; overflow: auto">                                   
                                      </div>
                                </div>
                                                                                                     
                                <fieldset class="bottom-gap">
                                    <span class="font-small tiny-leftmargin pull-xs-left text-danger" id="spnAddMaintTypeError"></span>
                                    <div class="spinner-rectangle pull-xs-left" id="divProgress" style="display: none;">
                                    </div>
                                    <button onclick="ClearMaintenanceTypeInfo();return false;" class="btn btn-sm btn-cancel tiny-rightmargin pull-xs-right">
                                       <%=GetGlobalResourceObject("MeasuringPoint_Resource","cancel")%>
                                    </button>
                                    <button id="btnAddMaintType" Class="btn btn-sm btn-success tiny-rightmargin pull-xs-right"
                                        runat="server" enableviewstate="false" ></button>
                                </fieldset>
                            </div>
                        </fieldset>

                        <fieldset class="heading-gap text-xs-right">
                            <span onclick="javascript:ShowHideMaintTypesInfo();"><i class="cursor-pointer pull-right blue fa fa-plus-circle  font-bigger tiny-rightmargin"
                                id="iconViewMaintTypes"></i><span id="spnViewAllMaintTypes" class="pull-right bold blue cursor-pointer font-small">
                              </span> </span>
                        </fieldset>
                        <div id="divMaintTypes" class="scroll-auto" style="max-height: 300px;">
                            <div class="table-side-box-heading">
                           <span  id="spanListofInfo" class="m-l-1"></span>
                            </div>
                            <span id="divMaintTypesProgress" class="spinner-circle-big hide"></span>
                            <table id="tableMaintTypes" class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th class="center-align" style="width:18%">
                                           <%=GetGlobalResourceObject("MeasuringPoint_Resource","action")%>
                                        </th>
                                        <th id="thMaintTypes" runat="server" enableviewstate="false" class="cursor-pointer center-align nowrap" style="width:35%">
                                            <span class="underline labelMasterDataType">
                                            </span><i class="tiny-leftmargin cursor-pointer"></i>
                                        </th>
                                        <th class="cursor-pointer center-align" id="thDescOrItem" style="width:47%">                                      
                                            <i class="tiny-leftmargin cursor-pointer "></i>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="tbodypositionfixed" runat="server" data-bind="foreach: $root.DefaultMaintenanceTypesArray()">
                                    <tr>
                                        <td>
                                            <i class="fa fa-edit linkcolor i-action tiny-leftmargin tiny-rightmargin v-icon  cursor-pointer" data-bind="click: $root.HasMaintTypeAccess ? function () { ShowEditMaintTypes($data); } : '', attr: BindIconAttributes($root.HasMaintTypeAccess)  " title="Edit"></i>
                                            <i class="fa fa-trash-o text-danger i-action tiny-leftmargin tiny-rightmargin v-icon  cursor-pointer" data-bind="click: $root.HasDeleteMaintTypeAccess ? function () { DeleteMaintTypeClick(MasterDataID); } : '', attr: BindIconAttributes($root.HasDeleteMaintTypeAccess)" title="Delete"></i>
                                        </td>
                                        <td class="break-all" data-bind="text: MasterDataName"></td>
                                        <td class="break-all" data-bind="text: DescOrItemName"></td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr data-bind="visible: $root.DefaultMaintenanceTypesArray().length == 0">
                                                <td class="center-align" colspan="3"><span>No Records Found</span>
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
          <input type="hidden" runat="server" enableviewstate="false" value="5" id="hdnModelPageSize" />
        </div>

    <div class="small-popup">
        <div id="alertModal">
            <div>
                <p id="alertMessage">
                </p>
            </div>
        </div>
    </div>
</asp:Content>
