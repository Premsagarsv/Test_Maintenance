<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Login.aspx.cs" Inherits="Vegam_MaintenanceModule.Login" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
     <div>
        <asp:CustomValidator ID="CustomValidator1" runat="server" ErrorMessage="CustomValidator"
            OnServerValidate="CustomValidator1_ServerValidate"></asp:CustomValidator>
        <asp:TextBox ID="txtUserName" CssClass="input-small" runat="server" placeholder="Email"
            MaxLength="50" ToolTip="Please enter email id"></asp:TextBox>
        <asp:TextBox ID="txtPassword" Text="Password" CssClass="input-small" runat="server"
            placeholder="Password" TextMode="Password" MaxLength="50" ToolTip="Please enter password"></asp:TextBox>
        <asp:LinkButton ID="lnkBtnLogin" CssClass="btn btn-primary" runat="server" Text="Login"
            OnClick="btnLogin_Click"></asp:LinkButton>
        <asp:Label ID="lblErrorMessage" runat="server" EnableViewState="false"></asp:Label>
    </div>
    </form>
</body>
</html>
