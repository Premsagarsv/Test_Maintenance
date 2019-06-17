<%@ Page Title="" Language="C#" MasterPageFile="~/Vegam-Iframe.Master" AutoEventWireup="true" CodeBehind="FunctionalLocationList.aspx.cs" Inherits="Vegam_MaintenanceModule.Preventive.FunctionalLocationList" %>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/Vegam_FunctionalLocationList.js" type="text/javascript"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/iPAS_Pager.js"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/ajaxfileupload.js" type="text/javascript"></script>
    <link href="<%= ConfigurationManager.AppSettings["MaintCssPath"].TrimEnd('/') %>/Styles/proplan_v7.css" rel="stylesheet" type="text/css" />
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/vegam-multiselect-dropdown.js"></script>
    <link href="<%= ConfigurationManager.AppSettings["MaintCssPath"].TrimEnd('/') %>/Styles/vegam-multiselect-dropdown.css" rel="stylesheet" type="text/css" />
    <asp:ScriptManager ID="scriptManager" runat="server" EnableViewState="false">
    </asp:ScriptManager>
    <style type="text/css">
        .popover-title {
            display: none;
        }

        .popover-content {
            background-color:white;           
            padding: 2px;
            border-radius: 3px;
            border:1px solid gray
        }

        .pro-plan .dropdown-menu {
            min-width: 140px !important;
        }

        .img-border:nth-child(odd) {
            border-right: 1px solid #cdd2d2;
        }

         i[disabled] {
            color: gray !important;
            cursor: default !important;
        }

        .img-border {
            border-bottom: 1px solid #cdd2d2;
            min-height:114px;
        }

       .img-radius{
           border-radius:10px;
           box-shadow :0px 0px 4px 0.2px #ccc;
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
         #ulFLoctionMultiSelect, #ulTypeMultiSelect {
            border: 1px solid #c7c7c7;
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
            max-height: 200px;
            overflow-y: auto;
        }

    </style>

    <script>
        $(document).ready(function () {
            $('#ulFLoctionMultiSelect').find('.ulField').hide();
        });
    </script>

    <div class="pro-plan col-xs-12" id="divFunctionLocationInfo">
        <input type="hidden" id="hdfSortValue" enableviewstate="false" />
        <input type="hidden" runat="server" enableviewstate="false" value="6" id="hdnPageSize" />

        <fieldset id="fdDownloadAndUpload" class="heading-gap">
            <legend class="search-legend cursor-pointer"><i class="fa tiny-rightmargin fa-caret-right"></i><%=GetGlobalResourceObject("FunctionalLocation_Resource", "downloadAndUpload")%></legend>
            <button id="btnAddNewFunctionalLocation" runat="server" class="btn btn-success btn-sm pull-xs-right tiny-rightmargin add-btn"><%=GetGlobalResourceObject("FunctionalLocation_Resource", "addEditFunctionalLocation")%></button>
            <div id="spnDownloadAndUpload" class="hide">
                <button class="btn btn-default btn-sm tiny-rightmargin bottom-gap tiny-leftmargin d-m-left" id="btnDownloadTemplate" onclick="DownLoadExcelTemplate();return false;">
                    <i class="fa fa-download tiny-rightmargin"></i><%=GetGlobalResourceObject("FunctionalLocation_Resource", "downloadTemplate")%></button>
                <button type="button" class="btn btn-default btn-sm  tiny-rightmargin bottom-gap" runat="server" id="btnUploadExcel" onclick="ShowUploadDiv();return false;">
                    <i class="fa fa-upload tiny-rightmargin"></i><%=GetGlobalResourceObject("FunctionalLocation_Resource", "uploadFLocation")%></button>
                <button class="btn btn-default btn-sm tiny-rightmargin bottom-gap" id="btnDownloadExcel" onclick="DownloadAllFunctionalLocationInfo();return false;">
                    <i class="fa fa-download tiny-rightmargin"></i><%=GetGlobalResourceObject("FunctionalLocation_Resource", "downloadFunctionalLocInfo")%></button>
                <span id="divProgressExcel" class="spinner-circle-small absolute hide"></span>
                <div id="divUploadExcel" class="hide col-xs-12 p-a-0">
                    <div id="divFileExcel">
                        <input name="fileToUpload" type="file" id="uploadFile" class="form-control-sm tiny-leftmargin" runat="server" enableviewstate="false">
                        <span id="divUploadProgress" class="spinner-circle-small absolute medium-leftmargin hide"></span><span id="lblUploadError" class="text-danger"></span>
                    </div>
                </div>
                <span class="text-danger font-small col-xs-12" id="spnErrorMessageForExcel"></span>
            </div>
        </fieldset>

        <fieldset class="info-block bottom-gap">
            <legend class="search-legend cursor-pointer" id="legFunctionalLocationFilter"><i class="fa fa-caret-down tiny-rightmargin"></i><%=GetGlobalResourceObject("FunctionalLocation_Resource", "defineSearchCriteria")%></legend>
            <label class="pull-xs-right addlabel m-b-0">
                <label id="lblSortBy" class="m-b-0"><%=GetGlobalResourceObject("FunctionalLocation_Resource", "sortBy")%></label>
                <a id="btnFLocationName" runat="server" enableviewstate="false" style="white-space: nowrap;" class="cursor-pointer center-align black tiny-rightmargin">
                    <span class="underline"><%=GetGlobalResourceObject("FunctionalLocation_Resource", "locationName")%></span><i class="tiny-leftmargin cursor-pointer gray "></i></a>
                <a id="btnUpdateOn" runat="server" enableviewstate="false" style="white-space: nowrap;" class="cursor-pointer center-align black tiny-rightmargin">
                    <span class="underline"><%=GetGlobalResourceObject("FunctionalLocation_Resource", "updatedOn")%></span><i class="tiny-leftmargin cursor-pointer gray "></i></a>
            </label>
            <div>
              <div class="col-xs-3 p-a-0 tiny-leftmargin" style="width: 21% !important">
                    <div class="functiondropdown cursor-pointer col-xs-11">
                        <label class="appendSelectedElements"><%=GetGlobalResourceObject("Equipment_Resource", "functionalLocation")%></label>
                        <i class="icontag fa big pull-xs-right fa-caret-down i-opacity"></i>
                    </div>
                    <div class="drpdownbody col-xs-12" style="margin-top: 36px;">
                        <div class="input-div" style="padding: 4px 0px 4px 4px !important;">
                            <input type="text" class="searchField form-control-sm col-xs-11" onkeyup="KeyUpEle(this);" placeholder="Search Functional Location" style="height: 34px;">
                        </div>
                        <div class="divider-border"></div>
                        <ul id="ulFLoctionMultiSelect" data-bind="template: { name: 'itemTmpl', foreach: FunctionalLocationFilterArray }" class="ulField drpDownList pull-xs-left heading-gap col-xs-11 tiny-leftmargin m-b-0" style="width: 95.6% !important" onclick="ApplyCss(this)">
                        </ul>
                        <script id="itemTmpl" type="text/html">
                            <li data-bind="attr: { id: 'idlist_' + TypeValue }">
                                <span class="li col-xs-12">
                                    <input type="checkbox" class="tiny-leftmargin tiny_push-down pull-xs-left tiny-rightmargin" data-bind="attr: { id: 'idCheckBox_' + TypeValue, value: TypeValue }" />
                                    <label data-bind="text: DisplayName"></label>
                                    <i class="fa fa-drop-icon fa-chevron-circle-down big pull-xs-right" data-bind="visible: Children.length > 0 ? true : false"></i>
                                </span>
                                <ul data-bind="template: { name: 'itemTmpl', foreach: Children }" class="ulField drpDownList col-xs-12 m-b-0">
                                </ul>
                            </li>
                        </script>
                    </div>
                </div>
                <button id="btnSearch" class="btn-sm btn btn-normal bottom-gap tiny-leftmargin pull-xs-left" onclick="SearchFunctionalLocations();return false;">
                    <i class="fa fa-search"></i>
                </button>
                <button id="btnShowAll" class="btn-sm btn btn-primary hide pull-xs-left tiny-leftmargin" onclick="ShowAllFunctionalLocations();return false;">
                </button>
                <p class="text-danger font-small pull-xs-left tiny-leftmargin push-down" style="cursor: default;" id="spnSearchError"></p>

            </div>
        </fieldset>
        <div class="relative">
            <fieldset id="fieldFunctionalLocations" class="info-block p-a-0" style="border-radius: 5px" data-bind="foreach: FunctionalLocationInfoArray">
                <div data-bind="click: function () { AddUpdateNewFunctionalLoaction(FunctionalLocationID); }, attr: { class: 'col-xs-12 col-lg-6 img-border tiny-padding cursor-pointer' } ">
                    <div class="col-xs-5 col-lg-3">
                        <img class="img-radius" style="width: 100px; height: 100px" data-bind="attr: { src: FunctionalLocationImagePath, id: 'imgFLocation_' + FunctionalLocationID, onmouseover: IsHoverable ? 'LoadLargeImageView(\'' + FunctionalLocationImagePath + '\',' + FunctionalLocationID + ')' : '' }" onmouseout="CloseLargeImageView();" />
                    </div>
                    <div class="col-xs-7 col-lg-6 bold p-l-0">
                        <label class="bold ellipsis full-width nowrap m-b-0" style="max-width: 98%" data-bind="text: FunctionalLocationName"></label>
                        <label class="gray description" data-bind="text: FunctionalLocationDesc"></label>
                    </div>
                    <div class="col-xs-7 col-lg-3 p-a-0">
                        <fieldset class="col-xs-12 p-a-0">
                            <i class="fa fa-trash-o text-danger v-icon cursor-pointer tiny-rightmargin pull-lg-right" data-bind="attr: { id: 'iconDelete_' + FunctionalLocationID }, click: $root.HasDeleteAccess ? function () { DeleteLocationInfoClick(FunctionalLocationID, event); } : '', attr: BindIconAttributes($root.HasDeleteAccess)" title="Delete"></i>
                            <i class="fa fa-edit text-info v-icon cursor-pointer tiny-rightmargin pull-xs-right" data-bind="attr: { id: 'iconEdit_' + FunctionalLocationID }, click: function () { AddUpdateNewFunctionalLoaction(FunctionalLocationID); } " title="Edit"></i>
                        </fieldset>

                    </div>
                    <div class="col-xs-12" style="position: absolute; bottom: 0">

                        <label class="gray pull-lg-right font-mini m-b-0" data-bind="text: FunctionalLocationUpdatedOn"></label>
                        <label class="gray m-b-0 pull-lg-right font-mini"><%=GetGlobalResourceObject("FunctionalLocation_Resource", "updatedOn")%>:</label>

                    </div>
                </div>
            </fieldset>
        </div>
        <div id="divProgress" class="spinner-circle-big hide"></div>
        <div class="col-xs-12 center-align pagination pagination-centered nomargin" id="divPager">
            <div data-bind="visible: LoadErrorMessageVisible" class="center-align heading-gap">
                <span data-bind="text: LoadErrorMessage, attr: { class: LoadErrorMessageClass }"></span>
            </div>
            <div>
                <div data-bind="html: $root.PagerContent" class="pagination text-md-center m-a-0 col-xs-12"></div>
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
    <div id="divZoomFLocation" class="hide">
        <img id="divZoomFLocationImage" height="200" width="200">
    </div>
</asp:Content>
