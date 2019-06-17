<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Pager.ascx.cs" Inherits="Vegam_MaintenanceModule.UserControls.Pager" %>
<script type="text/javascript" language="javascript" src="<%= ConfigurationManager.AppSettings["MaintJsPath"].TrimEnd('/') %>/Scripts/iPAS_pager.js"></script>

<asp:HiddenField ID="hdfCurrentPage" runat="server" Value="0" />
<div id="divPager" runat="server" class="pagination pagination-centered nomargin">
    <ul class="nomargin">
        <li><a id="hrefFirst" runat="server" href="#"><<</a></li>
        <li><a id="hrefPrevious" runat="server" href="#">...</a></li>
        <li><a id="hrefNum1" runat="server" href="#"></a></li>
        <li><a id="hrefNum2" runat="server" href="#"></a></li>
        <li><a id="hrefNum3" runat="server" href="#"></a></li>
        <li><a id="hrefNum4" runat="server" href="#"></a></li>
        <li><a id="hrefNum5" runat="server" href="#"></a></li>
        <li><a id="hrefNext" runat="server" href="#">...</a></li>
        <li><a id="hrefLast" runat="server" href="#">>></a></li>
    </ul>
</div>