using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Vegam_MaintenanceModule
{
    public partial class Vegam_Responsive : System.Web.UI.MasterPage
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        //CR00023 - Feb 09, 2010 - Add username in the IE title
        public string UserName()
        {
            try
            {
                if (System.Web.HttpContext.Current.Session["CurrentUserInfo"] != null)
                {
                    iPAS_Base.CurrentUserInfo currentUserInfo = System.Web.HttpContext.Current.Session["CurrentUserInfo"] as iPAS_Base.CurrentUserInfo;
                    return currentUserInfo.UserName.ToString();
                }
                return string.Empty;
            }
            catch
            {
                return string.Empty;
            }
        }

        protected void StockReceipt_Click(Object sender, EventArgs e)
        {
            //Session["liMainMenuList"] = liStockReceipt.ClientID;
            //if (Request.QueryString["id"] != null && Request.QueryString["id"] != string.Empty)
            //{
            //    string queryStringValue = Request.QueryString["id"].ToString();
            //    Response.Redirect("~/ipas_StockReceipt/StockReceipt/StockReceiptIndex.aspx?id=" + queryStringValue);
            //}
        }

        protected void Manufacture_Click(Object sender, EventArgs e)
        {
            //Session["liMainMenuList"] = liManufacture.ClientID;
            //if (Request.QueryString["id"] != null && Request.QueryString["id"] != string.Empty)
            //{
            //    string queryStringValue = Request.QueryString["id"].ToString();
            //    Response.Redirect("~/Manufacture/ManufactureIndex.aspx?id=" + queryStringValue);
            //    // Response.Redirect("~/NoAccessRight.aspx?id=" + queryStringValue);              
            //}
        }

        protected void Maintenance_Click(Object sender, EventArgs e)
        {
            Session["liMainMenuList"] = liManufacture.ClientID;
            if (Request.QueryString["id"] != null && Request.QueryString["id"] != string.Empty)
            {
                string queryStringValue = Request.QueryString["id"].ToString();
                Response.Redirect("~/MaintenanceIndex.aspx?id=" + queryStringValue);
                // Response.Redirect("~/NoAccessRight.aspx?id=" + queryStringValue);              
            }
        }

        protected void Admin_Click(Object sender, EventArgs e)
        {

            //Session["liMainMenuList"] = liManufacture.ClientID;
            //if (Request.QueryString["id"] != null && Request.QueryString["id"] != string.Empty)
            //{
            //    string queryStringValue = Request.QueryString["id"].ToString();
            //    Response.Redirect("~/Manufacture/AdminIndex.aspx?id=" + queryStringValue);
            //    // Response.Redirect("~/NoAccessRight.aspx?id=" + queryStringValue);              
            //}
        }

        public string FirstName()
        {
            try
            {
                if (System.Web.HttpContext.Current.Session["CurrentUserInfo"] != null)
                {
                    iPAS_Base.CurrentUserInfo currentUserInfo = System.Web.HttpContext.Current.Session["CurrentUserInfo"] as iPAS_Base.CurrentUserInfo;
                    string userName = currentUserInfo.UserName.ToString();
                    if (currentUserInfo.UserName.ToString().Length > 10)
                    {
                        userName = currentUserInfo.UserName.ToString().Substring(0, 10);
                        userName = userName + "..";
                    }
                    return userName;
                }
                return string.Empty;
            }
            catch
            {
                return string.Empty;
            }
        }
    }
}