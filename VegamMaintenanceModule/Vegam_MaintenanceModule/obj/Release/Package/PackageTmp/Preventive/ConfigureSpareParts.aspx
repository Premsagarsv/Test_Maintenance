<%@ Page Title="" Language="C#" MasterPageFile="~/Vegam-Responsive.Master" AutoEventWireup="true" CodeBehind="ConfigureSpareParts.aspx.cs" Inherits="Vegam_MaintenanceModule.Preventive.ConfigureSpareParts" %>
<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolderKPI" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
      <asp:ScriptManager ID="ScriptManager1" runat="server">
    </asp:ScriptManager>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/Vegam_DynamicGridControlScript_v26.js" type="text/javascript"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/Vegam_ConfigureSpareParts.js" type="text/javascript"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/iPAS_Pager.js"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/ajaxfileupload.js" type="text/javascript"></script>
    <link href="<%= ConfigurationManager.AppSettings["MaintCssPath"].TrimEnd('/') %>/Styles/proplan_v7.css" rel="stylesheet" type="text/css" />
    <style>
        .pover::after{
            display:none !important;
        }
        .dynamic-columns{
            padding-left:5px !important 
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
    </style>
      <script>
        $(document).ready(function () {
            jQuery(".fa-save").hide();
        });
    </script>
    <input type="hidden" id="hdnPageSize" runat="server" enableviewstate="false" value="2" />
    <input type="hidden" id="hdnAccessRights" runat="server" enableviewstate="false" />
    <input type="hidden" id="hdfSortValue" />
    <div class="col-xs-12 pro-plan push-down" id="divSpareParts">
        <fieldset>
            <legend class="search-legend cursor-pointer"><i id="iDownloadAndUpload" class="fa fa-caret-right tiny-rightmargin"></i><%=GetGlobalResourceObject("SparePartsInfo_Resource", "downloadAndupload")%></legend>
           <span id="spnDownloadAndUpload" class="hide">
                <button class="btn btn-default btn-sm tiny-rightmargin bottom-gap tiny-leftmargin d-m-left"
                    id="btnDownloadTemplate" onclick="DownLoadExcelTemplate();return false;">
                    <i class="fa fa-download tiny-rightmargin"></i><%=GetGlobalResourceObject("SparePartsInfo_Resource", "downloadTemplate")%>
                </button>
                <button type="button" class="btn btn-default btn-sm  tiny-rightmargin bottom-gap"
                    runat="server" id="btnUploadExcel" onclick="ShowUploadDiv();return false;" >
                    <i class="fa fa-upload tiny-rightmargin"></i><%=GetGlobalResourceObject("SparePartsInfo_Resource", "uploadInfo")%>
                </button>
               <button class="btn btn-default btn-sm tiny-rightmargin bottom-gap "
                    id="btnDownloadExcelInfo" onclick="DownloadExcelInfo();return false;">
                    <i class="fa fa-download tiny-rightmargin"></i><%=GetGlobalResourceObject("SparePartsInfo_Resource", "downloadInfo")%>
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

            </span>
        </fieldset>
        <div id="divDynamicGridContent" runat="server" enableviewstate="false"></div>
    </div>

</asp:Content>
