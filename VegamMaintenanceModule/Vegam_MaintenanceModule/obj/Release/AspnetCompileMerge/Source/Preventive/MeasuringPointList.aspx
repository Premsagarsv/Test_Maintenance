<%@ Page Title="" Language="C#" MasterPageFile="~/Vegam-Iframe.Master" AutoEventWireup="true" CodeBehind="MeasuringPointList.aspx.cs" Inherits="Vegam_MaintenanceModule.Preventive.MeasuringPointList" %>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <asp:ScriptManager ID="ScriptManager1" runat="server">
    </asp:ScriptManager>
     <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/Vegam_DynamicGridControlScript_v26.js" type="text/javascript"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/Vegam_MeasuringPointList.js" type="text/javascript"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/iPAS_Pager.js"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/ajaxfileupload.js" type="text/javascript"></script>
    <link href="<%= ConfigurationManager.AppSettings["MaintCssPath"].TrimEnd('/') %>/Styles/proplan_v7.css" rel="stylesheet" type="text/css" />
    <style type="text/css">
        .popover-title {
            display: none;
        }

        .popover-content {
            background-color: #5f6973;
            color: #FFFFFF;
            padding: 2px;
            border-radius: 3px;
        }
        .add-btn {
    margin-top: -25px !important;
}
    </style>
    <input type="hidden" id="hdnPageSize" runat="server" enableviewstate="false" value="10" />
    <input type="hidden" id="hdnAccessRights" runat="server" enableviewstate="false" />
    <input type="hidden" id="hdfSortValue" />
    <div class="col-xs-12 pro-plan push-down" id="divMeasuringPointList">
        <fieldset>
            <legend class="search-legend cursor-pointer"><i id="iDownloadAndUpload" class="fa fa-caret-right tiny-rightmargin"></i><%=GetGlobalResourceObject("MeasuringPoint_Resource", "downlaodAndUpload")%></legend>
           <button id="btnAddMeasuringPoint" runat="server" class="btn btn-success btn-sm pull-xs-right tiny-rightmargin add-btn"><%=GetGlobalResourceObject("MeasuringPoint_Resource", "addEditMeasuringPoint")%></button>
            <div id="spnDownloadAndUpload" class="hide">
                <button class="btn btn-default btn-sm tiny-rightmargin bottom-gap tiny-leftmargin d-m-left"
                    id="btnDownloadTemplate" onclick="DownLoadExcelTemplate();return false;">
                    <i class="fa fa-download tiny-rightmargin"></i><%=GetGlobalResourceObject("MeasuringPoint_Resource", "downloadTemplate")%>
                </button>
                <button type="button" class="btn btn-default btn-sm  tiny-rightmargin bottom-gap"
                    runat="server" id="btnUploadExcel" onclick="ShowUploadDiv();return false;" disabled="disabled">
                    <i class="fa fa-upload tiny-rightmargin"></i><%=GetGlobalResourceObject("MeasuringPoint_Resource", "uplaodMeasuringPoint")%>
                </button>
                <button class="btn btn-default btn-sm tiny-rightmargin bottom-gap" id="btnDownloadExcel"
                    onclick="DownloadExcelInfo();return false;">
                    <i class="fa fa-download tiny-rightmargin"></i><%=GetGlobalResourceObject("MeasuringPoint_Resource", "dowlaodExcel")%>
                </button>
                <span id="spnProgressExcel" class="spinner-circle-small absolute hide"></span>
                <div id="divUploadExcel" class="hide col-xs-12 p-a-0">
                    <div id="divFileExcel">
                        <input name="fileToUpload" type="file" id="uploadFile" class="form-control-sm tiny-leftmargin"
                            runat="server" enableviewstate="false" />
                        <span id="divUploadProgress" class="spinner-circle-small absolute medium-leftmargin hide"></span><span id="lblUploadError" class="text-danger"></span>
                    </div>
                </div>
                <span class="text-danger nomarginleft font-small col-xs-12" id="spnErrorMessageForExcel"></span>
                
            </div>
        </fieldset>
         <div id="divDynamicGridContent" runat="server" enableviewstate="false"></div>
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
