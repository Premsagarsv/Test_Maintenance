using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;
using Vegam_MaintenanceModule.ipas_CompanyService;

namespace Vegam_MaintenanceModule.Preventive
{
    public partial class WorkOrderResourceView : iPAS_Base.BasePage
    {
        int currentPage = 0;

        protected override void OnPreInit(EventArgs e)
        {
            this.MasterPageFile = ConfigurationManager.AppSettings["VegamiFrameMasterPage"].ToString();
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                #region Script Resource

                ScriptReference scriptReference = new ScriptReference();
                scriptReference.Path = ConfigurationManager.AppSettings["MaintJsPath"].ToString().TrimEnd('/') + "/ScriptResources/WorkOrderResourceViewCalendarScriptResource.js";
                string[] cultures = ConfigurationManager.AppSettings["SupportLanguages"].ToString().Split(',');
                scriptReference.ResourceUICultures = CommonBLL.GetCultures(cultures, scriptReference.Path);
                scriptManager.Scripts.Add(scriptReference);

                #endregion

                int siteID = CommonBLL.ValidateSiteID(Request);
                if (siteID == 0)
                    Response.Redirect(ConfigurationManager.AppSettings["NoAccessPage"].ToString());

                int userID = this.CurrentUser.UserID;
                int accessLevelID = CommonBLL.GetAccessLevelID(this.CurrentUser.AccessLevel);

                ValidateUserPrivileges(siteID, accessLevelID);

                AccessType viewWorkOrderInfo = GetViewWorkOrderInfoPermission(siteID, accessLevelID);

                string servicePath = ConfigurationManager.AppSettings["MaintWebServicePath"].TrimEnd('/');
                string maintBasePath = ConfigurationManager.AppSettings["MaintBasePath"].TrimEnd('/').ToString();
                int currentDate = BLL.MaintenanceBLL.GetSiteCurrentDateTime(siteID).CurrentDate;

                BasicParam basicParam = new BasicParam();
                basicParam.SiteID = siteID;
                basicParam.UserID = userID;
                basicParam.AccessLevelID = accessLevelID;
                basicParam.LanguageCode = this.CurrentUser.LanguageCode;

                UserControls.PagerData resourceViewpagerData = new UserControls.PagerData();
                resourceViewpagerData.PageIndex = 0;
                resourceViewpagerData.PageSize = int.Parse(hdnResourceViewPageSize.Value.ToString());
                resourceViewpagerData.CurrentPage = currentPage;
                resourceViewpagerData.SelectMethod = "LoadResourceViewTimeline";
                resourceViewpagerData.ServicePath = servicePath;
                resourceViewpagerData.SiteID = siteID;
                resourceViewpagerData.UserID = userID;
                resourceViewpagerData.AccessLevelID = accessLevelID;
                resourceViewpagerData.PageAccessRights = viewWorkOrderInfo.ToString();

                Page.ClientScript.RegisterStartupScript(GetType(), "LoadResourceViewBasicInfo", "LoadResourceViewBasicInfo(" + (new JavaScriptSerializer()).Serialize(basicParam) + ","+(new JavaScriptSerializer()).Serialize(resourceViewpagerData) + ", '" + servicePath + "'," + currentDate + ",'" + maintBasePath + "');", true);
            }
        }

        private void ValidateUserPrivileges(int siteID, int accessLevelID)
        {
            AccessType access = CommonBLL.ValidateUserPrivileges(siteID, this.CurrentUser.SiteID, this.CurrentUser.UserID, accessLevelID, Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.WorkOrderCalendar));
            if (access == AccessType.NO_ACCESS)
                Response.Redirect(ConfigurationManager.AppSettings["NoAccessPage"].ToString());
        }

        private AccessType GetViewWorkOrderInfoPermission(int siteID, int accessLevelID)
        {
            return CommonBLL.ValidateUserPrivileges(siteID, this.CurrentUser.SiteID, this.CurrentUser.UserID, accessLevelID, Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.ViewWorkOrderInfo));
        }
    }
}