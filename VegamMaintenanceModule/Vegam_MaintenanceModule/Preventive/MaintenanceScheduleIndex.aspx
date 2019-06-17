<%@ Page Title="" Language="C#" MasterPageFile="~/Vegam-Responsive.Master" AutoEventWireup="true" CodeBehind="MaintenanceScheduleIndex.aspx.cs" Inherits="Vegam_MaintenanceModule.Preventive.MaintenanceScheduleIndex" %>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <script type="text/javascript">
        jQuery(document).ready(function () {
            jQuery("#breadcrumb").addClass("hide");
            jQuery(".hbox").css("display", "none");
            jQuery(".hbox").each(function () {
                jQuery(".hbox:has(a)").css("display", "block");
            });
        });
    </script>
    <div class="col-xs-12 heading-gap-big">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <div class="col-xs-12 col-sm-6 col-lg-4 col-xl-3 cursor-pointer p-r-0 hbox">
                <a id="lnkMaintenanceSchedule" runat="server" enableviewstate="false">
                    <div class="outer-rect-orange">
                        <div class="col-xs-4 p-a-0">
                            <div class="outer-circle-orange p-a-0">
                                <div class="inner-circle-orange">
                                    <img src="<%= ConfigurationManager.AppSettings["MaintImagePath"].TrimEnd('/') %>/Styles/Images/Preventive_Maintenance.png" class="img-margin"
                                alt="Maintenance Schedule" />
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-8 p-r-0">
                            <span class="form-control-label bold label-margin col-xs-12"><%=GetGlobalResourceObject("MaintenanceScheduleIndex_Resource", "managePreventiveMaintenanceSchedule")%></span>
                            <span class="form-control-label p-a-0 pull-xs-left col-xs-12 label-size"><%=GetGlobalResourceObject("MaintenanceScheduleIndex_Resource", "manageScheduleDesc")%></span>
                        </div>
                    </div>
                </a>
            </div>
            <div class="col-xs-12 col-sm-6 col-lg-4 col-xl-3 cursor-pointer p-r-0 hbox">
                <a id="lnkmaintenanceWorkOrder" runat="server" enableviewstate="false">
                    <div class="outer-rect-blue">
                        <div class="col-xs-4 p-a-0">
                            <div class="outer-circle-blue p-a-0">
                                <div class="inner-circle-blue">
                                    <img src="<%= ConfigurationManager.AppSettings["MaintImagePath"].TrimEnd('/') %>/Styles/Images/Preventive_Maintenance.png" class="img-margin"
                                alt="Maintenance Schedule" />
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-8 p-r-0">
                            <span class="form-control-label bold label-margin col-xs-12"><%=GetGlobalResourceObject("MaintenanceScheduleIndex_Resource", "manageWorkOrders")%></span>
                            <span class="form-control-label p-a-0 pull-xs-left col-xs-12 label-size"><%=GetGlobalResourceObject("MaintenanceScheduleIndex_Resource", "manageWorkOrderDesc")%></span>
                        </div>
                    </div>
                </a>
            </div>
            <div class="col-xs-12 col-sm-6 col-lg-4 col-xl-3 cursor-pointer p-r-0 hbox">
                <a id="lnkMeasurementDocument" runat="server" enableviewstate="false">
                    <div class="outer-rect-dark-org">
                        <div class="col-xs-4 p-a-0">
                            <div class="outer-circle-dark-org p-a-0">
                                <div class="inner-circle-dark-org">
                                    <img src="<%= ConfigurationManager.AppSettings["MaintImagePath"].TrimEnd('/') %>/Styles/Images/Preventive_Maintenance.png" class="img-margin"
                                alt="Maintenance Schedule" />
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-8 p-r-0">
                            <span class="form-control-label bold label-margin col-xs-12"><%=GetGlobalResourceObject("MaintenanceScheduleIndex_Resource", "manageCheckList")%></span>
                            <span class="form-control-label p-a-0 pull-xs-left col-xs-12 label-size"><%=GetGlobalResourceObject("MaintenanceScheduleIndex_Resource", "manageChecklistDesc")%></span>
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
