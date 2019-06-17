using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Vegam_MaintenanceModule.Preventive
{
    public partial class ToolsInfo : iPAS_Base.BasePage
    {
        bool hasEditAccess = false;
        bool hasDeleteAccess = false;
        protected override void OnPreInit(EventArgs e)
        {
            this.MasterPageFile = ConfigurationManager.AppSettings["MaintVegamMasterPage"].ToString();            
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                #region Script Resource

                ScriptReference scriptReference = new ScriptReference();
                scriptReference.Path = ConfigurationManager.AppSettings["MaintJsPath"].ToString().TrimEnd('/') + "/ScriptResources/ToolsScriptResource.js";
                string[] cultures = ConfigurationManager.AppSettings["SupportLanguages"].ToString().Split(',');
                scriptReference.ResourceUICultures = CommonBLL.GetCultures(cultures, scriptReference.Path);
                scriptManager.Scripts.Add(scriptReference);

                #endregion

                int siteID = CommonBLL.ValidateSiteID(Request);
               

                int userID = this.CurrentUser.UserID;
                int accessLevelID = CommonBLL.GetAccessLevelID(this.CurrentUser.AccessLevel);


                AccessType access = ValidateUserPrivileges(siteID, accessLevelID);
                AccessType approveAccess = CommonBLL.ValidateUserPrivileges(siteID, this.CurrentUser.SiteID, this.CurrentUser.UserID, accessLevelID, Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.taskGroupApprove));


                Vegam_MaintenanceService.BasicParam basicParam = new Vegam_MaintenanceService.BasicParam();
                basicParam.SiteID = siteID;
                basicParam.UserID = userID;
                basicParam.AccessLevelID = accessLevelID;

                string basePath = ConfigurationManager.AppSettings["MaintBasePath"].ToString().TrimEnd('/');
                string webServicePath = ConfigurationManager.AppSettings["MaintWebServicePath"].Trim();
                string uploaderPath = ConfigurationManager.AppSettings["uploaderPath"].ToString().Trim('/');
                string imagePath = ConfigurationManager.AppSettings["ToolsImagePath"].Trim()+siteID +"/Thumbnail";
                string imageDefaultPath = ConfigurationManager.AppSettings["MaintImagePath"].TrimEnd('/') + "/Styles/Images/deafult.png";

                UserControls.PagerData pagerData = new UserControls.PagerData();
                pagerData.PageIndex = 0;
                pagerData.PageSize = int.Parse(hdnPageSize.Value.ToString());
                pagerData.SelectMethod = "LoadToolsInfo";
                pagerData.ServicePath = webServicePath;
                pagerData.LoadControlID = hdnPageSize.ClientID;
                pagerData.SiteID = siteID;
                pagerData.UserID = userID;
                pagerData.PageAccessRights = access.ToString();

                thDescription.Attributes.Add("onclick", "javascript:SortTabs('" + thDescription.ClientID + "','ToolsDescription');");

                Page.ClientScript.RegisterStartupScript(GetType(), "LoadToolsInfoPage", "LoadToolsInfoPage(" + (new JavaScriptSerializer()).Serialize(pagerData) + "," + (new JavaScriptSerializer()).Serialize(basicParam) + ",'" + basePath + "','" + webServicePath + "','" + uploaderPath + "','"+ imageDefaultPath+"','" + imagePath + "','" + hasDeleteAccess + "','" + hasEditAccess + "');", true);
            }
        }
        
        private AccessType ValidateUserPrivileges(int siteID, int accessLevelID)
        {
            AccessType access = AccessType.NO_ACCESS;
            access = CommonBLL.ValidateUserPrivileges(siteID, this.CurrentUser.SiteID, this.CurrentUser.UserID, accessLevelID, Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.configureTools));
            if (access == AccessType.FULL_ACCESS || access == AccessType.EDIT_ONLY)
            {
                hasEditAccess = true;
                if (access == AccessType.FULL_ACCESS)
                {
                    hasDeleteAccess = true;
                }
            }
            else if (access == AccessType.NO_ACCESS)
            {
                Response.Redirect(ConfigurationManager.AppSettings["NoAccessPage"].ToString());
            }

            return access;
        }
    }
}