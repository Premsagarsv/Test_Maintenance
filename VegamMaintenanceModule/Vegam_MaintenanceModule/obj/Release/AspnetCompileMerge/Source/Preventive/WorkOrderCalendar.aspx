<%@ Page Title="" Language="C#" MasterPageFile="~/Vegam-Responsive.Master" AutoEventWireup="true" CodeBehind="WorkOrderCalendar.aspx.cs" Inherits="Vegam_MaintenanceModule.Preventive.Calendar" %>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server" EnableViewState="false">
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/Vegam_WorkOrderCalendar.js" type="text/javascript"></script>    
 
     <asp:ScriptManager ID="scriptManager" runat="server" EnableViewState="false">
    </asp:ScriptManager>
    <div id="divWorkOrderCalenderTabContent">
        <div class="col-xs-12">                        
            <section id="divTabIFrameInfo" style="clear: both;">
                <div class="col-xs-12 nopadding scroll-x">
                    <div class="step push-down">
                         <ul id="ulPhaseTab" class="nav nav-tabs m-b-0">
                            <li id="lnkDayView" onclick="javascript:LoadIFrame(this);return false;" class="pull-xs-left nav-item hide">
                                <a class="nav-link"><%=GetGlobalResourceObject("WorkOrderCalendar_Resource", "dayView")%></a>
                            </li>
                             <li id="lnkOrderView" onclick="javascript:LoadIFrame(this);return false;" class="pull-xs-left nav-item hide">
                                <a class="nav-link"><%=GetGlobalResourceObject("WorkOrderCalendar_Resource", "orderView")%></a>
                            </li>
                             <li id="lnkResourceView" onclick="javascript:LoadIFrame(this);return false;" class="pull-xs-left nav-item hide">
                                <a class="nav-link"><%=GetGlobalResourceObject("WorkOrderCalendar_Resource", "resourceView")%></a>
                            </li>                             
                        </ul>
                    </div>
                </div>
              <%--  scrolling="no"--%>
                <iframe id="iFrameWorkOrder" onload="javascript:WorkOrderCalendarIFrameLoad(this)" class="hide" width="100%" style="min-height: 500px; border: 0;" scrolling="no" ></iframe>
            </section>
        </div>
    </div>
     <div class="small-popup">
        <div id="divErrorModal">
            <div>
                <p id="errorMessageText">
                </p>
            </div>
        </div>
    </div>
</asp:Content>
