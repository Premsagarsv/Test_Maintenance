﻿<%@ Page Title="" Language="C#" MasterPageFile="~/Vegam-Responsive.Master" AutoEventWireup="true" CodeBehind="MaintenanceMasterIndex.aspx.cs" Inherits="Vegam_MaintenanceModule.MaintenanceMasterIndex" %>

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
                <a id="lnkWorkGroup" runat="server" enableviewstate="false">
                    <div class="outer-rect-orange">
                        <div class="col-xs-4 p-a-0">
                            <div class="outer-circle-orange p-a-0">
                                <div class="inner-circle-orange">
                                    <img src="<%= ConfigurationManager.AppSettings["MaintImagePath"].TrimEnd('/') %>/Styles/Images/work_group.png"
                                        alt="Configure Work Group" class="img-margin">
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-8 p-r-0">
                            <span class="form-control-label bold label-margin col-xs-12"><%=GetGlobalResourceObject("MaintenanceIndex_Resource", "configureWorkGroup")%></span>
                            <span class="form-control-label p-a-0 pull-xs-left col-xs-12 label-size"><%=GetGlobalResourceObject("MaintenanceIndex_Resource", "workGroupDescription")%></span>
                        </div>

                    </div>
                </a>
            </div>

            <div class="col-xs-12 col-sm-6 col-lg-4 col-xl-3 cursor-pointer p-r-0 hbox" style="display: block;">
                <a id="lnkMaintenanceInfo" runat="server" enableviewstate="false">
                    <div class="outer-rect-blue">
                        <div class="col-xs-4 p-a-0">
                            <div class="outer-circle-blue p-a-0">
                                <div class="inner-circle-blue">
                                    <img src="<%= ConfigurationManager.AppSettings["MaintImagePath"].TrimEnd('/') %>/Styles/Images/Configure_Location_equipment.png"
                                        alt="Configure Equipments" class="img-margin">
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-8 p-r-0">
                            <span class="form-control-label bold label-margin col-xs-12"><%=GetGlobalResourceObject("MaintenanceIndex_Resource", "configureLocationAndEquipment")%></span>
                            <span class="form-control-label p-a-0 pull-xs-left col-xs-12 label-size"><%=GetGlobalResourceObject("MaintenanceIndex_Resource", "LocationAndEquipmentDescription")%></span>
                        </div>

                    </div>
                </a>
            </div>

            <div class="col-xs-12 col-sm-6 col-lg-4 col-xl-3 cursor-pointer p-r-0 hbox" style="display: block;">
                <a id="lnkToolsInfo" runat="server" enableviewstate="false">
                    <div class="outer-rect-dark-org">
                        <div class="col-xs-4 p-a-0">
                            <div class="outer-circle-dark-org p-a-0">
                                <div class="inner-circle-dark-org">
                                    <img src="<%= ConfigurationManager.AppSettings["MaintImagePath"].TrimEnd('/') %>/Styles/Images/Tools.png"
                                        alt="Tools Info" class="img-margin">
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-8 p-r-0">
                            <span class="form-control-label bold label-margin col-xs-12"><%=GetGlobalResourceObject("MaintenanceIndex_Resource", "configureTools")%></span>
                            <span class="form-control-label p-a-0 pull-xs-left col-xs-12 label-size"><%=GetGlobalResourceObject("MaintenanceIndex_Resource", "toolsDescription")%></span>
                        </div>

                    </div>
                </a>
            </div>

            <div class="col-xs-12 col-sm-6 col-lg-4 col-xl-3 cursor-pointer p-r-0 hbox" style="display: block;">
                <a id="lnkTaskGroup" runat="server" enableviewstate="false">
                    <div class="outer-rect-lightblue">
                        <div class="col-xs-4 p-a-0">
                            <div class="outer-circle-lightblue p-a-0">
                                <div class="inner-circle-lightblue">
                                    <img src="<%= ConfigurationManager.AppSettings["MaintImagePath"].TrimEnd('/') %>/Styles/Images/TaskGroup.png"
                                        alt="Task Group" class="img-margin">
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-8 p-r-0">
                            <span class="form-control-label bold label-margin col-xs-12"><%=GetGlobalResourceObject("MaintenanceIndex_Resource", "manageTaskGroup")%></span>
                            <span class="form-control-label p-a-0 pull-xs-left col-xs-12 label-size"><%=GetGlobalResourceObject("MaintenanceIndex_Resource", "taskGroupDescription")%></span>
                        </div>

                    </div>
                </a>
            </div>
           
             <div class="col-xs-12 col-sm-6 col-lg-4 col-xl-3 cursor-pointer p-r-0 hbox" style="display: block;">
                <a id="lnkSpareParts" runat="server" enableviewstate="false">
                    <div class="outer-rect-orange">
                        <div class="col-xs-4 p-a-0">
                            <div class="outer-circle-orange p-a-0">
                                <div class="inner-circle-orange">
                                    <img src="<%= ConfigurationManager.AppSettings["MaintImagePath"].TrimEnd('/') %>/Styles/Images/Spare_parts.png"
                                        alt="Manage SOP" class="img-margin">
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-8 p-r-0">
                            <span class="form-control-label bold label-margin col-xs-12"><%=GetGlobalResourceObject("MaintenanceIndex_Resource", "configureSpareParts")%></span>
                            <span class="form-control-label p-a-0 pull-xs-left col-xs-12 label-size"><%=GetGlobalResourceObject("MaintenanceIndex_Resource", "sparePartsDescription")%></span>
                        </div>

                    </div>
                </a>
            </div>

             <div class="col-xs-12 col-sm-6 col-lg-4 col-xl-3 cursor-pointer p-r-0 hbox" style="display: block;">
                <a id="lnkConfigureEmail" runat="server" enableviewstate="false">
                    <div class="outer-rect-orange">
                        <div class="col-xs-4 p-a-0">
                            <div class="outer-circle-orange p-a-0">
                                <div class="inner-circle-orange">
                                    <img src="<%= ConfigurationManager.AppSettings["MaintImagePath"].TrimEnd('/') %>/Styles/Images/Config_email.png"
                                        alt="Email Templates" class="img-margin">
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-8 p-r-0">
                            <span class="form-control-label bold label-margin col-xs-12"><%=GetGlobalResourceObject("MaintenanceIndex_Resource", "configureEmailTemplates")%></span>
                            <span class="form-control-label p-a-0 pull-xs-left col-xs-12 label-size"><%=GetGlobalResourceObject("MaintenanceIndex_Resource", "emailTemplatesDescription")%></span>
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
