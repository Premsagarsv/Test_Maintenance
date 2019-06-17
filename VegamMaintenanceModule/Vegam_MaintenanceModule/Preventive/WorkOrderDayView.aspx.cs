using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;
using Vegam_MaintenanceModule.Vegam_MaintenanceService;

namespace Vegam_MaintenanceModule.Preventive
{
    public partial class WorkOrderDayView : iPAS_Base.BasePage
    {
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
                scriptReference.Path = ConfigurationManager.AppSettings["MaintJsPath"].ToString().TrimEnd('/') + "/ScriptResources/DynamicGridScriptResource.js";
                string[] cultures = ConfigurationManager.AppSettings["SupportLanguages"].ToString().Split(',');
                scriptReference.ResourceUICultures = CommonBLL.GetCultures(cultures, scriptReference.Path);
                scriptManager.Scripts.Add(scriptReference);

                scriptReference = new ScriptReference();
                scriptReference.Path = ConfigurationManager.AppSettings["MaintJsPath"].ToString().TrimEnd('/') + "/ScriptResources/WorkOrderDayViewCalendarScriptResource.js";
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

                string usercontrolPath = ConfigurationManager.AppSettings["MaintUserControls"].ToString().TrimEnd('/');
                UserControls.DynamicGridControl dynamicGridControl = (UserControls.DynamicGridControl)Page.LoadControl(usercontrolPath + "/DynamicGridControl.ascx");
                divDynamicGridContent.Controls.Add(dynamicGridControl);

                #region Feature

                List<string> featureName = new List<string>();
                featureName.Add(Language_Resources.MaintenanceFeatures.workOrderDayView);

                int featureID = 0;
                List<ipas_UserService.SiteFeatureInfo> featurePageToLoad = BLL.UserBLL.GetCompanyFeatureConfiguredURL(siteID, 0, featureName);
                if (featurePageToLoad.Count > 0)
                {
                    ipas_UserService.SiteFeatureInfo result = featurePageToLoad.SingleOrDefault(x => x.FeatureName == Language_Resources.MaintenanceFeatures.workOrderDayView);
                    if (result != null)
                    {
                        featureID = result.FeatureID;
                    }
                }

                #endregion
                
                string maintBasePath = ConfigurationManager.AppSettings["MaintBasePath"].TrimEnd('/').ToString();

                SiteDateTimeFormatInfo dateTimeForamt = BLL.MaintenanceBLL.GetSiteDateTimeFormatInfo(siteID);
                int currentDate = BLL.MaintenanceBLL.GetSiteCurrentDateTime(siteID).CurrentDate;               

                UserControls.PagerData pagerData = new UserControls.PagerData();
                pagerData.PageIndex = 1;
                pagerData.PageSize = Convert.ToInt32(hdnPageSize.Value);
                pagerData.CurrentPage = 0;
                pagerData.SelectMethod = "LoadDynamicGridContent";
                pagerData.ServicePath = ConfigurationManager.AppSettings["MaintWebServicePath"].TrimEnd('/');
                pagerData.SiteID = siteID;
                pagerData.UserID = userID;
                pagerData.AccessLevelID = accessLevelID;
                pagerData.PlantDateFormat = dateTimeForamt.DateFormat;
                pagerData.PlantTimeFormat = dateTimeForamt.TimeFormat;

                UserControls.DynamicGridProperties dynamicGridProperties = new UserControls.DynamicGridProperties();
                dynamicGridProperties.CurrentDate = currentDate;
                dynamicGridProperties.CustomRowNavigationMethod = "ViewWorkOrderInfo";
                dynamicGridProperties.FeatureID = featureID;
                dynamicGridProperties.GridType = UserControls.DynamicGridType.Calendar;
                dynamicGridProperties.PagerData = pagerData;
                dynamicGridProperties.DatePickerFormat = CommonBLL.GetDatePickerDateFormat(dateTimeForamt.DateFormat);
                dynamicGridProperties.ImagePath = ConfigurationManager.AppSettings["MaintImagePath"].TrimEnd('/') + "/Styles/Images";
                dynamicGridProperties.WebServiceName = "Vegam_MaintenanceService.asmx";
                dynamicGridProperties.ShowGroupRowsByDefault = false;
                dynamicGridProperties.ExcelSheetName = "DayViewWorkOrders";

                Page.ClientScript.RegisterStartupScript(GetType(), "LoadDayViewBasicInfo", "LoadDayViewBasicInfo(" + (new JavaScriptSerializer()).Serialize(dynamicGridProperties) + ",'" + maintBasePath + "','" + viewWorkOrderInfo.ToString() + "');", true);
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