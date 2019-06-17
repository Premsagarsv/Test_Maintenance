<%@ Page Title="" Language="C#" MasterPageFile="~/Vegam-Iframe.Master" AutoEventWireup="true" CodeBehind="AddDocumentsAndImages.aspx.cs" Inherits="Vegam_MaintenanceModule.Preventive.AddDocumentsAndImages" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <asp:ScriptManager ID="ScriptManager" runat="server" EnableViewState="false">
    </asp:ScriptManager>
    <script type="text/javascript" src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/Vegam_AddDocumentsAndImages.js"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/ajaxfileupload.js"></script>
    <script type="text/javascript" src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/iPAS_Common_v4.js"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/select3.js"></script>
    <link href="<%= ConfigurationManager.AppSettings["MaintCssPath"].TrimEnd('/') %>/Styles/select2.css" rel="stylesheet" type="text/css" />
    <style>
        i[disabled] {
            color: gray !important;
            cursor: default !important;
        }

        .rside-box {
            box-shadow: 0 0 10px 10px #f5f5f5;
            padding-top: 2px;
            overflow: auto;
            border: 1px solid #f3f1f1;
            min-height: 65vh;
            min-height: 100% \9;
            height: 100% \9;
        }
        .select2{
            width:100%
        }
    </style>
    <div id="divAddDocument" class="pro-plan col-xs-12 p-x-0 bottom-gap">

        <div class="col-xs-12 col-lg-8 push-down">
            <div class="info-block m-r-0 m-b-1" style="padding: 2px">
                <fieldset>
                    <span class="pull-xs-right">
                        <button id="buttonlnkAddFLocation" class="btn btn-mini btn-primary" onclick="ViewAdditionalInfoLinks('L'); return false;" data-bind="visible: jQuery.DocumnetsAndImagesNamespace.Type == 'E' ? true : false">
                            <%=GetGlobalResourceObject("DocumentInfo_Resources", "addViewFLocation")%>
                        </button>
                        <button id="buttonlnkAddEquipment" class="btn btn-mini btn-success" onclick="ViewAdditionalInfoLinks('E'); return false;" data-bind="visible: jQuery.DocumnetsAndImagesNamespace.Type == 'E' ? true : false">
                            <%=GetGlobalResourceObject("DocumentInfo_Resources", "addViewEquipments")%>
                        </button>
                        <button id="buttonlnkAddEquipmentModel" class="btn btn-mini btn-info" onclick="ViewAdditionalInfoLinks('M'); return false;" data-bind="visible: jQuery.DocumnetsAndImagesNamespace.Type == 'M' ? true : false">
                            <%=GetGlobalResourceObject("DocumentInfo_Resources", "addViewEquipmentsModel")%>
                        </button>
                    </span>
                </fieldset>
            </div>
            <div class="col-xs-12">
                <div>
                    <label class="form-control-label bold">
                        <%=GetGlobalResourceObject("DocumentInfo_Resources", "specificationDocument")%>
                    </label>
                    <fieldset class="nowrwap info-block" style="overflow-y: auto">
                        <div class="col-xs-12 ">
                            <div id="divSpecificationList" class="rightmargin pull-xs-left" data-bind="visible: viewDocumnetsAndImagesModal.SpecificationDocumentsList().length > 0, foreach: viewDocumnetsAndImagesModal.SpecificationDocumentsList">
                                <div class="cursor-pointer tiny-leftmargin p-a-0" style="display: inline-block; width: 70px">

                                    <img class="full-width center-align heading-gap" data-bind="attr: { src: ThumbnailPath, title: DocumentDisplayName }, click: function () { DownloadDocumentOrImageOrVideoInfo($data); return false; }" style="width: 50px; height: 55px;">
                                    <i class="fa fa-times-circle-o font-big cursor-pointer red pull-xs-right push-down" data-bind="click: $root.HasFullAccess ? function () { DeleteDocumentOrImageOrVideoInfo($data); return false; } : '', attr: $root.HasFullAccess ? { 'disabled': IsModelDocument } : BindIconAttributes($root.HasFullAccess)"></i>
                                    <label data-bind="atr: { id: 'lbl_' + DocumentID }, text: DocumentDisplayName" class="center-align full-width" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><span data-bind="attr: { title: DocumentDisplayName }"></span></label>
                                </div>
                            </div>
                            <span class="heading-gap  relative medium-rightmargin pull-xs-left bottom-gap">
                                <img data-bind="attr: { id: 'imgSpecification', src: DefaultUplaodIconPath }" style="width: 60px; height: 65px;" title="add Image" />
                                <input id="specificationFileUpload" type="file" name="specificationFileUpload" class="cursor-pointer" data-bind="attr: BindIconAttributes($root.HasFullAccess)" onchange="UploadMaintenanceDocument(false);return false;"
                                    style="position: absolute; top: 3px; left: 0; opacity: 0; width: 50px; height: 55px; min-height: 0px; font-size: 0; line-height: 2px" />
                            </span>
                        </div>
                    </fieldset>
                    <label class="form-control-label bold">
                        <%=GetGlobalResourceObject("DocumentInfo_Resources", "manuals")%>
                    </label>
                    <fieldset class="nowrwap info-block" style="overflow-y: auto">
                        <div class="col-xs-12 ">
                            <div id="divDoumentsList" class="rightmargin pull-xs-left" data-bind="visible: viewDocumnetsAndImagesModal.ManualDocumentsList().length > 0, foreach: viewDocumnetsAndImagesModal.ManualDocumentsList">
                                <div class="cursor-pointer tiny-leftmargin p-a-0" style="display: inline-block; width: 70px">
                                    <img class="full-width center-align heading-gap" data-bind="attr: { src: ThumbnailPath, title: DocumentDisplayName }, click: function () { DownloadDocumentOrImageOrVideoInfo($data); return false; }" style="width: 50px; height: 55px;">
                                    <i class="fa fa-times-circle-o font-big cursor-pointer red pull-xs-right push-down" data-bind="click: $root.HasFullAccess ? function () { DeleteDocumentOrImageOrVideoInfo($data); return false; } : '', attr: $root.HasFullAccess ? { 'disabled': IsModelDocument } : BindIconAttributes($root.HasFullAccess)"></i>
                                    <label class="center-align full-width" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" data-bind="atr: { id: 'lbl_' + DocumentID, title: DocumentDisplayName }, text: DocumentDisplayName"></label>
                                </div>
                            </div>
                            <span class="heading-gap  relative medium-rightmargin pull-xs-left bottom-gap">
                                <img data-bind="attr: { id: 'imgDocuments', src: DefaultUplaodIconPath }" style="width: 60px; height: 65px;" />
                                <input id="documentFileUpload" type="file" name="documentFileUpload" class="cursor-pointer" data-bind="attr: BindIconAttributes($root.HasFullAccess)" onchange="UploadMaintenanceDocument(true);return false;"
                                    style="position: absolute; top: 3px; left: 0; opacity: 0; width: 50px; height: 55px; min-height: 0px; font-size: 0; line-height: 2px" />
                            </span>
                        </div>
                    </fieldset>
                    <label class="form-control-label bold">
                        <%=GetGlobalResourceObject("DocumentInfo_Resources", "photosAndVideo")%>
                    </label>
                    <fieldset class="nowrwap info-block" style="overflow-y: auto">
                        <div class="col-xs-12 ">
                            <div id="divImagesList" class="rightmargin pull-xs-left" data-bind="visible: viewDocumnetsAndImagesModal.ImagesAndVideosList().length > 0, foreach: viewDocumnetsAndImagesModal.ImagesAndVideosList">
                                <div class="cursor-pointer tiny-leftmargin p-a-0" style="display: inline-block; width: 70px">
                                    <%--<a data-bind="attr: { href: DownloadPath }" >--%>
                                    <img class="full-width center-align heading-gap" data-bind=" attr: { src: ThumbnailPath, title: DocumentDisplayName },
                                         click: function () {
                                        LoadImageOrVideoInfo(DownloadPath, $data);
    }/*, click: function () { DownloadDocumentOrImageOrVideoInfo($data); }*/"
                                        style="width: 50px; height: 55px;">
                                    <%--</a>--%>
                                    <i class="fa fa-times-circle-o font-big cursor-pointer red pull-xs-right push-down" data-bind="click: $root.HasFullAccess ? function () { DeleteDocumentOrImageOrVideoInfo($data); } : '', attr: $root.HasFullAccess ? { 'disabled': IsModelDocument } : BindIconAttributes($root.HasFullAccess)"></i>
                                    <label class="center-align full-width" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" data-bind="atr: { id: 'lbl_' + DocumentID, title: DocumentDisplayName }, text: DocumentDisplayName"></label>
                                </div>
                            </div>
                            <span class="heading-gap relative medium-rightmargin pull-xs-left bottom-gap">
                                <img data-bind="attr: { id: 'imgPhotosAndVideos', src: DefaultUplaodIconPath }" style="width: 60px; height: 65px;" />
                                <input class="cursor-pointer" type="file" name="imageVideoFileUpload" id="imageVideoFileUpload" data-bind="attr: BindIconAttributes($root.HasFullAccess)" onchange="UploadMaintenanceImageVideo();return false;"
                                    style="position: absolute; top: 3px; left: 0; opacity: 0; width: 50px; height: 55px; min-height: 0px; font-size: 0; line-height: 2px" />
                            </span>
                        </div>
                    </fieldset>
                    <span class="text-danger font-small pull-xs-left tiny-leftmargin" id="spnDocumentAndImageError"></span>
                </div>
                <div id="divProgress" class="spinner-circle-big hide"></div>
            </div>
        </div>
        <div class="col-xs-12 col-lg-4 pull-xs-right">
            <div class="rside-box">
                <fieldset class="info-block box-shadow bg-transparent">
                    <div class="tiny-padding col-xs-12">
                        <fieldset class="info-block bottom-gap">
                            <legend class="search-legend cursor-pointer"><i class="fa fa-caret-down tiny-rightmargin"></i>Filter</legend>
                            <div>
                                <fieldset>
                                    <label id="lblEquipmentmodelName" class="form-control-label label-xxxlarge nomarginleft"></label>
                                    <div class="col-xs-12 col-lg-6 p-x-0">
                                        <select id="drpModelEquipment" class="form-control-sm Parameters-Select select2" data-bind=" options: FilterEquipmentModelList, optionsText: 'DisplayName', optionsValue: 'TypeValue', value: SelectedEquipmentModelID " onchange="LoadImagesDocumentsList(); return false;"></select>
                                    </div>
                                </fieldset>
                                <span class="font-small red col-xs-12 p-l-0"></span>
                            </div>
                        </fieldset>
                    </div>
                </fieldset>
            </div>
        </div>
    </div>
    <div class="small-popup">
        <div id="divAlertModal">
            <div>
                <p id="alertMessage">
                </p>
            </div>
        </div>
    </div>

</asp:Content>
