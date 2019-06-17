<%@ Page Title="" Language="C#" MasterPageFile="~/Vegam-Responsive.Master" AutoEventWireup="true" CodeBehind="ManufactureIndex.aspx.cs" Inherits="Vegam_MaintenanceModule.ManufactureIndex" %>

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
                            <span class="form-control-label bold label-margin col-xs-12"><%=GetGlobalResourceObject("MaintenanceIndex_Resource", "managePreventiveMaintenanceSchedule")%></span>
                            <span class="form-control-label p-a-0 pull-xs-left col-xs-12 label-size"><%=GetGlobalResourceObject("MaintenanceIndex_Resource", "manageScheduleDesc")%></span>
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
                            <span class="form-control-label bold label-margin col-xs-12"><%=GetGlobalResourceObject("MaintenanceIndex_Resource", "manageWorkOrders")%></span>
                            <span class="form-control-label p-a-0 pull-xs-left col-xs-12 label-size"><%=GetGlobalResourceObject("MaintenanceIndex_Resource", "manageWorkOrderDesc")%></span>
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
                            <span class="form-control-label bold label-margin col-xs-12"><%=GetGlobalResourceObject("MaintenanceIndex_Resource", "manageCheckList")%></span>
                            <span class="form-control-label p-a-0 pull-xs-left col-xs-12 label-size"><%=GetGlobalResourceObject("MaintenanceIndex_Resource", "manageChecklistDesc")%></span>
                        </div>
                    </div>
                </a>
            </div>
            <div class="col-xs-12 col-sm-6 col-lg-4 col-xl-3 cursor-pointer p-r-0 hbox">
                <a id="lnkManageNotification" runat="server" enableviewstate="false">
                    <div class="outer-rect-dark-org">
                        <div class="col-xs-4 p-a-0">
                            <div class="outer-circle-dark-org p-a-0">
                                <div class="inner-circle-dark-org">
                                    <img src="<%= ConfigurationManager.AppSettings["MaintImagePath"].TrimEnd('/') %>/Styles/Images/notification.png" class="img-margin"
                                alt="Maintenance Schedule" />
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-8 p-r-0">
                            <span class="form-control-label bold label-margin col-xs-12"><%=GetGlobalResourceObject("MaintenanceIndex_Resource", "manageNotification")%></span>
                           <span class="form-control-label p-a-0 pull-xs-left col-xs-12 label-size"><%=GetGlobalResourceObject("MaintenanceIndex_Resource", "manageNotificationDescription")%></span>
                        </div>
                    </div>
                </a>
            </div>
            <div class="col-xs-12 col-sm-6 col-lg-4 col-xl-3 cursor-pointer p-r-0 hbox" style="display: block;">
                <a id="lnkWorkOrderCalendar" runat="server" enableviewstate="false">
                    <div class="outer-rect-blue">
                        <div class="col-xs-4 p-a-0">
                            <div class="outer-circle-blue p-a-0">
                                <div class="inner-circle-blue">
                                    <img src="<%= ConfigurationManager.AppSettings["MaintImagePath"].TrimEnd('/') %>/Styles/Images/Maint_calender.png"
                                        alt="Calendar Maintenance" class="img-margin">
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-8 p-r-0">
                            <span class="form-control-label bold label-margin col-xs-12"><%=GetGlobalResourceObject("MaintenanceIndex_Resource", "workOrderCalendar")%></span>
                            <span class="form-control-label p-a-0 pull-xs-left col-xs-12 label-size"><%=GetGlobalResourceObject("MaintenanceIndex_Resource", "manageOrderCalendarDescription")%></span>
                        </div>

                    </div>
                </a>
            </div>
            <div class="col-xs-12 col-sm-6 col-lg-4 col-xl-3 cursor-pointer p-r-0 hbox" style="display: block;">
                <a id="lnkEquipment" runat="server" enableviewstate="false">
                    <div class="outer-rect-blue">
                        <div class="col-xs-4 p-a-0">
                            <div class="outer-circle-blue p-a-0">
                                <div class="inner-circle-blue">
                                    <img src="<%= ConfigurationManager.AppSettings["MaintImagePath"].TrimEnd('/') %>/Styles/Images/Configure_Location_equipment.png"
                                        alt="Calendar Maintenance" class="img-margin">
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-8 p-r-0">
                            <span class="form-control-label bold label-margin col-xs-12"><%=GetGlobalResourceObject("MaintenanceIndex_Resource", "equipment")%></span>
                            <span class="form-control-label p-a-0 pull-xs-left col-xs-12 label-size"><%=GetGlobalResourceObject("MaintenanceIndex_Resource", "viewEquipmentDetails")%></span>
                        </div>

                    </div>
                </a>
            </div>
            <div class="col-xs-12 col-sm-6 col-lg-4 col-xl-3 cursor-pointer p-r-0 hbox" style="display: block;">
                <a id="lnkMaintReports" runat="server" enableviewstate="false">
                    <div class="outer-rect-blue">
                        <div class="col-xs-4 p-a-0">
                            <div class="outer-circle-blue p-a-0">
                                <div class="inner-circle-blue">
                                    <img src="<%= ConfigurationManager.AppSettings["MaintImagePath"].TrimEnd('/') %>/Styles/Images/report.png"
                                        alt="Calendar Maintenance" class="img-margin">
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-8 p-r-0">
                            <span class="form-control-label bold label-margin col-xs-12"><%=GetGlobalResourceObject("MaintenanceIndex_Resource", "reports")%></span>
                            <span class="form-control-label p-a-0 pull-xs-left col-xs-12 label-size"><%=GetGlobalResourceObject("MaintenanceIndex_Resource", "reports")%></span>
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
