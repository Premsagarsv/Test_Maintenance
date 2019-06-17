<%@ Page Title="" Language="C#" MasterPageFile="~/Vegam-Responsive.Master" AutoEventWireup="true" CodeBehind="MaintenanceMasterIndex.aspx.cs" Inherits="Vegam_MaintenanceModule.MaintenanceMasterIndex" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolderKPI" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <script type="text/javascript">
        jQuery(document).ready(function () {
            jQuery(".hbox").css("display", "none");
            jQuery(".hbox").each(function () {
                jQuery(".hbox:has(a)").css("display", "block");
            });
        });
    </script>
    <div class="col-xs-12">
        <div class="col-xs-12">

            <div class="col-xs-12 col-sm-6 col-lg-4 col-xl-3 cursor-pointer p-r-0 hbox" style="display: block;">
                <a id="lnkMaintenanceInfo" runat="server" enableviewstate="false">
                    <div class="outer-rect-orange">
                        <div class="col-xs-4 p-a-0">
                            <div class="outer-circle-orange p-a-0">
                                <div class="inner-circle-orange">
                                    <img src="<%= ConfigurationManager.AppSettings["MaintImagePath"].TrimEnd('/') %>/Styles/Images/Configure_Location_equipment.png"
                                        alt="Configure Maintenance" class="img-margin">
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-8 p-r-0">
                            <span class="form-control-label bold label-margin col-xs-12"><%=GetGlobalResourceObject("MaintenanceIndex_Resource", "configureLocationAndEquipment")%></span>
                            <span class="form-control-label p-a-0 pull-xs-left col-xs-12 label-size"></span>
                        </div>

                    </div>
                </a>
            </div>

            <div class="col-xs-12 col-sm-6 col-lg-4 col-xl-3 cursor-pointer p-r-0 hbox" style="display: block;">
                <a id="lnkTaskGroup" runat="server" enableviewstate="false">
                    <div class="outer-rect-orange">
                        <div class="col-xs-4 p-a-0">
                            <div class="outer-circle-orange p-a-0">
                                <div class="inner-circle-orange">
                                    <img src="<%= ConfigurationManager.AppSettings["MaintImagePath"].TrimEnd('/') %>/Styles/Images/TaskGroup.png"
                                        alt="Manage SOP" class="img-margin">
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-8 p-r-0">
                            <span class="form-control-label bold label-margin col-xs-12"><%=GetGlobalResourceObject("MaintenanceIndex_Resource", "manageTaskGroup")%></span>
                            <span class="form-control-label p-a-0 pull-xs-left col-xs-12 label-size"></span>
                        </div>

                    </div>
                </a>
            </div>
            <div class="col-xs-12 col-sm-6 col-lg-4 col-xl-3 cursor-pointer p-r-0 hbox" style="display: block;">
                <a id="lnkWorkGroup" runat="server" enableviewstate="false">
                    <div class="outer-rect-orange">
                        <div class="col-xs-4 p-a-0">
                            <div class="outer-circle-orange p-a-0">
                                <div class="inner-circle-orange">
                                    <img src="<%= ConfigurationManager.AppSettings["MaintImagePath"].TrimEnd('/') %>/Styles/Images/work_group.png"
                                        alt="Configure Maintenance" class="img-margin">
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-8 p-r-0">
                            <span class="form-control-label bold label-margin col-xs-12"><%=GetGlobalResourceObject("MaintenanceIndex_Resource", "configureWorkGroup")%></span>
                            <span class="form-control-label p-a-0 pull-xs-left col-xs-12 label-size"></span>
                        </div>

                    </div>
                </a>
            </div>
              <div class="col-xs-12 col-sm-6 col-lg-4 col-xl-3 cursor-pointer p-r-0 hbox" style="display: block;">
                <a id="lnkToolsInfo" runat="server" enableviewstate="false">
                    <div class="outer-rect-orange">
                        <div class="col-xs-4 p-a-0">
                            <div class="outer-circle-orange p-a-0">
                                <div class="inner-circle-orange">
                                    <img src="<%= ConfigurationManager.AppSettings["MaintImagePath"].TrimEnd('/') %>/Styles/Images/Tools.png"
                                        alt="Configure Maintenance" class="img-margin">
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-8 p-r-0">
                            <span class="form-control-label bold label-margin col-xs-12"><%=GetGlobalResourceObject("MaintenanceIndex_Resource", "toolsInfo")%></span>
                            <span class="form-control-label p-a-0 pull-xs-left col-xs-12 label-size"></span>
                        </div>

                    </div>
                </a>
            </div>
        </div>

        <div class="row">
            <div class="col-md-7 col-md-offset-2 well access-n-box hide bottom-gap" id="divNoAccessRight"
                runat="server" enableviewstate="false">
                <div class="col-md-2 center-align n-access-icon">
                    <i class="fa fa-exclamation-circle"></i>
                </div>
                <div class="col-md-10 n-access-text center-align">
                    <h2>
                        <%=GetGlobalResourceObject("MaintenanceIndex_Resource", "sorry")%>
                    </h2>
                    <div>
                        <%=GetGlobalResourceObject("MaintenanceIndex_Resource", "noPermission")%>
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
