﻿<%@ Page Title="" Language="C#" MasterPageFile="~/Vegam-Responsive.Master" AutoEventWireup="true" CodeBehind="MaintenanceInfo.aspx.cs" Inherits="Vegam_MaintenanceModule.Preventive.FunctionalLocationInfo" %>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/Vegam_MaintenanceInfo.js" type="text/javascript"></script>
    <script src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/iPAS_Pager.js" type="text/javascript"></script>
    <style>
        .img-border:nth-child(even) {
            border-left: 1px solid gray;
        }

        .img-border {
            border-bottom: 1px solid gray;
        }

        .m-frame {
            border: 0;
            min-height: 100vh;
        }

        @media only screen and (min-width: 1366px) {
            .m-frame {
                min-height: 100vh;
            }
            
        }
    </style>
    <!--[if IE]>
<style>
    .m-frame {
            height: 600px !important;
           
        }
        @media only screen and (min-width: 1366px) {
            
           .m-frame {
                height: 700px !important;
                
            }
        }
</style>
<![endif]-->
    <script>
        jQuery(document).ready(function () {
            var ua = window.navigator.userAgent;
            var is_ie = /MSIE|Trident/.test(ua);

            if (!is_ie) {
                jQuery("iframe").attr("scrolling", "no");
            }
        });

    </script>
    <asp:ScriptManager ID="scriptManager1" runat="server" EnableViewState="false">
    </asp:ScriptManager>
    <%--<input id="hdnPageSize" type="hidden" runat="server" enableviewstate="false" value="6" />--%>

    <div id="divMaintenanceInfoContent">
        <div class="col-xs-12">
            <div id="divNoErrorInfo" data-bind="visible: IsErrorInfoVisible" class="hide">
                <div class="col-md-10 n-access-text center-align" data-identifyelement="15">
                    <h5 class="blue m-b-0 tiny-leftmargin heading-gap-big" id="spnMaintenanceInfoMsg"></h5>
                </div>
                <p class="red font-small m-b-0 tiny-leftmargin" id="spnMaintenanceErrorMsg"></p>
            </div>
            <div id="divProgress" class="spinner-circle-big hide"></div>
            <section id="divTabIFrameInfo" data-bind="visible: IsTabIFrameVisible" style="clear: both;">
                <div class="col-xs-12 nopadding scroll-x">
                    <div class="step push-down">
                        <ul id="ulPhaseTab" data-bind="foreach: viewMaintenanceDetailsModel.FeatureTabList" class="nav nav-tabs m-b-0">
                            <li data-bind="attr: { onclick: 'javascript:LoadIframe(\'' + TabPath + '\')' }" class="pull-xs-left nav-item ">
                                <a class="nav-link" data-bind="html: TabName"></a>
                            </li>
                        </ul>
                    </div>
                </div>
                <%--  scrolling="no"--%>
                <iframe id="MaintenanceInfoFrame" onload="javascript:MaintenanceInfoFrameLoaded(this)" class="hide m-frame" width="100%" scrolling="no"></iframe>
            </section>

        </div>
    </div>

    <div class="small-popup">
        <div>
            <div>
                <a id="alertMessage"></a>
            </div>
        </div>
    </div>

    <div class="modal fade" tabindex="-1" role="dialog" id="div_VideoPhotoModal">
        <div class="modal-dialog" role="document" style="width: 680px; margin-top: 10%;">
            <div class="modal-content">
                <div class="modal-header p-b-0">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="embed-responsive embed-responsive-16by9 z-depth-1-half center-align">
                        <video id="iframeModalLink" autoplay controls>                          
                        </video>
                         <img id="imgIframeLink" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
