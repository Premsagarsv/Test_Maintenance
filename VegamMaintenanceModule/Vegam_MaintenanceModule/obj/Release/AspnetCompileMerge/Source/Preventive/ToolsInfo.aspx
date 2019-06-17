<%@ Page Title="" Language="C#" MasterPageFile="~/Vegam-Responsive.Master" AutoEventWireup="true" CodeBehind="ToolsInfo.aspx.cs" Inherits="Vegam_MaintenanceModule.Preventive.ToolsInfo" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolderKPI" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <asp:ScriptManager ID="scriptManager" runat="server" EnableViewState="false">
    </asp:ScriptManager>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/Vegam_ToolsInfo.js" type="text/javascript"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/ajaxfileupload.js" type="text/javascript"></script>
       <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/iPAS_Pager.js"></script>

    <div class="col-xs-12">
         <input type="hidden" runat="server" enableviewstate="false" value="7" id="hdnPageSize" />
        <div class="row" id="divToolsInfo">
            <div class="col-xs-12 col-md-7 table-with-heading">
                <div class="table-side-box-heading">
                    <span class="m-l-1">List Of Tools </span>
                </div>
                <div class="table-responsive">
                    <table class="table table-bordered nobox-shadow noborder-radius">
                        <thead>
                            <tr>
                                <th style="width: 20%"><%=GetGlobalResourceObject("ToolInfo_Resource", "action")%>
                                </th>
                                <th style="width: 30%"><%=GetGlobalResourceObject("ToolInfo_Resource", "tools")%>
                                </th>
                                <th style="width: 50%"><%=GetGlobalResourceObject("ToolInfo_Resource", "description")%>
                                </th>

                            </tr>
                        </thead>
                        <tbody id="tbTools" data-bind="foreach: ToolsInfoArray()">
                            <tr>
                                <td class="text-xs-center">
                                    <i class="fa fa-edit i-action cursor-pointer linkcolor scroll-edit" 
                                        data-bind="click: $root.HasEditAccess ? function () { ShowToolsInfoEdit(ToolID); } : '', attr: BindIconAttributes($root.HasEditAccess)  " title="Edit"></i>
                                    <i class="fa fa-trash-o i-action cursor-pointer text-danger"
                                        data-bind="click: $root.HasDeleteAccess ? function () { DeleteToolsInfoClick(ToolID); } : '', attr: BindIconAttributes($root.HasDeleteAccess)" title="Delete"></i>
                                </td>
                                <td>
                                  <img data-bind="attr: { src: ThumbnailPath }" style="width: 65px; height: 65px;"/>  </td>
                                <td data-bind="text: ToolDesc "></td>

                            </tr>
                        </tbody>
                        <tfoot>
                            <tr data-bind="visible: ToolsInfoArray().length == 0">
                                <td class="center-align" ><span><%=GetGlobalResourceObject("ToolInfo_Resource", "noRecordFound")%></span>
                                </td>
                            </tr>
                             <tr data-bind="visible: LoadErrorMessageVisible()">
                                        <td class="center-align">
                                            <span data-bind="text: LoadErrorMessage(), attr: { class: LoadErrorMessageClass }"></span>
                                        </td>
                                    </tr>
                            <tr>
                                <td colspan="10">
                                    <div data-bind="html: PagerContent" class="pagination text-md-center m-a-0 col-xs-12"></div>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                    <div class="spinner-circle-big" id="divToolsInfoProgress"></div>
                </div>
            </div>
            <div class="col-xs-12 col-lg-5">
                <div class="table-side-box">
                    <div class="table-side-box-heading">
                        <span class="m-l-1"><%=GetGlobalResourceObject("ToolInfo_Resource", "addEditTools")%></span>
                    </div>
                    <div class="table-side-box-content">
                        <fieldset>
                            <img data-bind="attr: { src: ToolThumbnailPath }" style="width: 100px; height: 100px;" />
                        </fieldset>
                        <fieldset>
                            <label class="form-control-label col-xs-12 col-lg-4 nomarginleft"><%=GetGlobalResourceObject("ToolInfo_Resource", "toolsImage")%></label>
                            <input type="file" class="form-control-sm" id="imageFileToUpload" name="fileToUploadImage" onchange="ToolsImageUpload()">
                        </fieldset>

                        <p class="font-small tiny-leftmargin text-info m-b-0"><%=GetGlobalResourceObject("ToolInfo_Resource", "imageFormatSepecification")%>
                        </p>
                        <fieldset class="m-y-1">
                            <label class="form-control-label col-xs-12 col-lg-4 nomarginleft"><%=GetGlobalResourceObject("ToolInfo_Resource", "description")%></label>
                            <input type="text" class="form-control-sm col-xs-12 col-lg-6" data-bind="text: EditToolDesc, value: EditToolDesc" maxlength="200">
                        </fieldset>
                        <fieldset>
                            <div class="pull-xs-right tiny-rightmargin">
                               <div class="spinner-rectangle pull-xs-left" id="divAddEditProgress">
                       
                    </div>
                                <button class="btn btn-sm btn-success" id="btnSaveTools"></button>
                                <button class="btn btn-sm btn-cancel" onclick="ClearFieldInfo();return false;"><%=GetGlobalResourceObject("ToolInfo_Resource", "cancel")%></button>
                            </div>
                             <span class="font-small  col-xs-12 m-b-0" id="spnErrorAddEditTools">
                                        </span>
                        </fieldset>
                        
                        
                
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
    </div>
</asp:Content>
