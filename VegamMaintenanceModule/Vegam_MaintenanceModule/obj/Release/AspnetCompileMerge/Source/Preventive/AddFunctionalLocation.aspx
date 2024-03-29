﻿<%@ Page Title="" Language="C#" MasterPageFile="~/Vegam-Iframe.Master" AutoEventWireup="true" CodeBehind="AddFunctionalLocation.aspx.cs" Inherits="Vegam_MaintenanceModule.Preventive.AddFunctionalLocation" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/Vegam_AddFunctionalLocation.js" type="text/javascript"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/iPAS_Pager.js"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/ajaxfileupload.js" type="text/javascript"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/select3.js"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/AutoReSize.js"></script>
    <link href="<%= ConfigurationManager.AppSettings["MaintCssPath"].TrimEnd('/') %>/Styles/select2.css" rel="stylesheet" type="text/css" />
    <link href="<%= ConfigurationManager.AppSettings["MaintCssPath"].TrimEnd('/') %>/Styles/proplan_v7.css" rel="stylesheet" type="text/css" />
    <asp:ScriptManager ID="scriptManager" runat="server" EnableViewState="false">
    </asp:ScriptManager>
    <script type="text/javascript">
        jQuery(document).ready(function () {
            jQuery('[data-toggle="popover"]').popover();
            jQuery('#popoverData').popover();
            jQuery('.pover').popover({ trigger: "hover" });
            jQuery("#txtFLocationDesc").autoResize();
        });
    </script>
    <style type="text/css">
        .img-border:nth-child(even) {
            border-left: 1px solid gray;
        }

        .img-border {
            border-bottom: 1px solid gray;
        }

         i[disabled] {
            color: gray !important;
            cursor: default !important;
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
            z-index: 99 !important
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

        .img-radius {
            border-radius: 10px;
            box-shadow: 0px 0px 4px 0.2px #ccc;
        }

        .link-disabled {
            pointer-events: none;
            color: gray;
        }

        .flocations {
        }
    </style>
    <div id="divAddFunctionalLocation" class="col-xs-12 push-down p-x-0 bottom-gap">
        <div class="row">
            <div class="col-xs-12 col-lg-8 push-down">

                <div class="info-block m-r-0 m-b-1" style="padding: 2px" data-bind="visible: FLocationsInfoArray().length > 0 ? true : false">
                    <fieldset>
                        <span class="pull-xs-right">
                            <button id="buttonlnkAddEquipment" class="btn btn-mini btn-primary" onclick="ViewAdditionalInfoLinks('E'); return false;" ><%=GetGlobalResourceObject("FunctionalLocation_Resource", "addViewEquipments")%></button>
                            <button id="buttonlnkMeasuringPoint" class="btn btn-mini btn-success" onclick="ViewAdditionalInfoLinks('P'); return false;"><%=GetGlobalResourceObject("FunctionalLocation_Resource", "addViewMeasuringPoints")%></button>
                        </span>
                    </fieldset>
                </div>

                <div id="divFLocationImgUpload" class="col-xs-12 col-lg-5 col-xl-4 pull-xs-right">
                    <img id="imgFLocationImage" style="width: 100px; height: 100px;" class="bottom-gap img-radius">
                    <div id="divUploadImage" class="col-xs-12 p-x-0">
                        <input id="imageFileToUpload" type="file" name="fileToUploadImage" class="form-control-sm bottom-gap" onchange="FunctionalLocationImageUpload()">
                        <p class="green"><%=GetGlobalResourceObject("FunctionalLocation_Resource", "imageUploadInstruction")%></p>
                    </div>
                </div>
                <div class="col-xs-12 col-sm-12 col-lg-7 col-xl-8 p-x-0">
                    <div class="col-xs-12 col-lg-12 p-l-0">
                        <label class="form-control-label col-xs-12 col-lg-6 col-xl-5"><%=GetGlobalResourceObject("FunctionalLocation_Resource", "functionalLocName")%></label>
                        <input type="text" maxlength="50" id="txtFLocationName" data-bind="textInput: FLocationName" class="form-control-sm col-xs-12 col-lg-6 col-xl-7">
                    </div>
                    <div class="col-xs-12 col-lg-12 p-l-0">
                        <label class="form-control-label col-xs-12 col-lg-6 col-xl-5"><%=GetGlobalResourceObject("FunctionalLocation_Resource", "description")%></label>
                        <textarea maxlength="200" id="txtFLocationDesc" data-bind="textInput: FLocationDesc, attr: { onkeydown: 'return checkTextAreaMaxLength(this,event,200)' }" class="form-control-sm col-xs-12 col-lg-6 col-xl-7 font-small"></textarea>
                    </div>
                    <div class="col-xs-12 col-lg-12 p-l-0">
                        <label class="form-control-label col-xs-12 col-lg-6 col-xl-5"><%=GetGlobalResourceObject("FunctionalLocation_Resource", "parentFLocMsg")%></label>
                        <input type="hidden" data-bind="text: $root.ParentFLocation()" />
                        <div class="col-xs-12 col-lg-6 col-xl-7 p-x-0">
                            <select id="drpFLocationParent" class="form-control-sm tiny-rightmargin Parameters-Select col-xs-12" data-bind="options: $root.ParentLocationsList, optionsText: 'DisplayName', optionsValue: 'TypeValue', value: $root.ParentFLocation()">
                            </select>
                        </div>
                    </div>
                    <div class="col-xs-12 col-lg-12">
                       <%-- <button class="btn btn-sm btn-cancel pull-xs-right" id="btnClose" runat="server"><%=GetGlobalResourceObject("FunctionalLocation_Resource", "close")%></button>--%>
                         <button class="btn btn-sm btn-cancel pull-xs-right" id="btnCancel" enableviewstate="false" onclick="ClearFieldInfo();return false;"><%=GetGlobalResourceObject("FunctionalLocation_Resource", "cancel")%></button>
                        <button id="btnAddUpdateFLocation"  class="btn btn-sm btn-success pull-xs-right tiny-rightmargin" runat="server" enableviewstate="false"></button>
                        <div id="divProgress" class="spinner-circle-big hide"></div>
                        <p id="lblSaveUpdateError" class="text-danger col-xs-12 p-l-0"></p>
                    </div>
                </div>
                <%--  --%>
            </div>
            <div class="col-xs-12 col-lg-4 pull-xs-right">
                <div class="rside-box">
                  <%--  <fieldset>
                        <button id="btnAddNewFlocation" enableviewstate="false" class="btn btn-sm btn-success pull-xs-right" onclick="AddNewFLoctionInfo();return false;"><%=GetGlobalResourceObject("FunctionalLocation_Resource", "addNewFunctionalLocation")%></button>
                    </fieldset>--%>
                    <fieldset class="gray p-b-0 push-down" style="border-bottom: 2px solid gainsboro">
                        <label class="form-control-label col-xs-12 col-lg-5"><%=GetGlobalResourceObject("FunctionalLocation_Resource", "functionalLocation")%></label>
                        <input type="text" class="form-control-sm col-xs-12 col-lg-7" id="txtSeachFLocation" onkeyup="LoadFunctionalLocationsList()" placeholder="Search Functional Location" />
                    </fieldset>
                    <fieldset class="tiny-padding p-b-0" id="divFLocationsList" data-bind="foreach: FLocationsInfoArray" style="overflow-y: auto">
                        <div class="bottom-gap col-xs-12  cursor-pointer p-l-0">
                            <i class="fa fa-trash-o text-danger v-icon cursor-pointer tiny-leftmargin" data-bind="click: $root.HasDeleteAccess ? function () { DeleteLocationInfoClick(TypeValue); } : '', attr: BindIconAttributes($root.HasDeleteAccess)" title="Delete"></i>
                            <label class="col-xs-8 col-lg-9 tiny-leftmargin p-l-0 m-b-0 p-b-0 flocations" style="border-bottom: 1px solid #ccc" data-bind="text: DisplayName, attr: { id: 'div_' + TypeValue, 'onclick': 'GetEditFunctionalLocInfo(' + TypeValue + ',' + true + ')' }, css: SelectedClass "></label>
                        </div>
                    </fieldset>
                    <div id="divLoadProgressVisible" class="spinner-circle-big hide"></div>
                    <div data-bind="visible: LoadErrorMessageVisible" class="center-align">
                        <span data-bind="text: LoadErrorMessage, attr: { class: LoadErrorMessageClass }"></span>
                    </div>
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
