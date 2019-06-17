using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;
using Vegam_MaintenanceModule.ipas_CompanyService;
using Vegam_MaintenanceModule.Vegam_MaintenanceService;

namespace Vegam_MaintenanceModule.Preventive
{
    public partial class ViewWorkOrderInfo : iPAS_Base.BasePage
    {
        int equipmentID = 0;
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
                scriptReference.Path = ConfigurationManager.AppSettings["MaintJsPath"].ToString().TrimEnd('/') + "/ScriptResources/ViewWorkOrderInfoScriptResource.js";
                string[] cultures = ConfigurationManager.AppSettings["SupportLanguages"].ToString().Split(',');
                scriptReference.ResourceUICultures = CommonBLL.GetCultures(cultures, scriptReference.Path);
                scriptManager.Scripts.Add(scriptReference);

                scriptReference = new ScriptReference();
                scriptReference.Path = ConfigurationManager.AppSettings["MaintJsPath"].ToString().TrimEnd('/') + "/ScriptResources/JQueryCalendarScriptResource.js";
                scriptReference.ResourceUICultures = CommonBLL.GetCultures(cultures, scriptReference.Path);
                scriptManager.Scripts.Add(scriptReference);

                scriptReference = new ScriptReference();
                scriptReference.Path = ConfigurationManager.AppSettings["MaintJsPath"].ToString().TrimEnd('/') + "/ScriptResources/DynamicGridScriptResource.js";                
                scriptReference.ResourceUICultures = CommonBLL.GetCultures(cultures, scriptReference.Path);
                scriptManager.Scripts.Add(scriptReference);
                #endregion

                int siteID = CommonBLL.ValidateSiteID(Request);
                if (siteID == 0)
                    Response.Redirect(ConfigurationManager.AppSettings["NoAccessPage"].ToString());

                int userID = this.CurrentUser.UserID;
                int accessLevelID = CommonBLL.GetAccessLevelID(this.CurrentUser.AccessLevel);

                string workOrder = string.Empty;
                if (Request.QueryString["workorder"] != null && Request.QueryString["workorder"].Trim().Length > 0)
                {
                    workOrder = Request.QueryString["workorder"].Trim();
                }

                if (Request.QueryString["equipment"] != null && Request.QueryString["equipment"].Trim().Length > 0)
                {
                    equipmentID = Convert.ToInt32(Request.QueryString["equipment"].Trim());
                }

                string pType = string.Empty;
                if (Request.QueryString["ptype"] != null && Request.QueryString["ptype"].Trim().Length > 0)
                {
                    pType = Request.QueryString["ptype"].Trim();
                }


                AccessType accessType = ValidateUserPrivileges(siteID, accessLevelID);

                string servicePath = ConfigurationManager.AppSettings["MaintWebServicePath"].TrimEnd('/');
                string imagePath = ConfigurationManager.AppSettings["MaintImagePath"].TrimEnd('/') + "/Styles/Images/";
                string basePath = ConfigurationManager.AppSettings["MaintBasePath"].ToString().TrimEnd('/');
                string uploaderPath = ConfigurationManager.AppSettings["uploaderPath"].ToString().Trim('/');
                string maintScheduleAttachmentPath = ConfigurationManager.AppSettings["MaintScheduleAttachmentPath"].TrimEnd('/');


                Vegam_MaintenanceService.SiteDateTimeFormatInfo dateTimeFormat = BLL.MaintenanceBLL.GetSiteDateTimeFormatInfo(siteID);
                hdfDatePickerFormat.Value = CommonBLL.GetDatePickerDateFormat(dateTimeFormat.DateFormat);

                Vegam_MaintenanceService.BasicParam basicParam = new Vegam_MaintenanceService.BasicParam();
                basicParam.SiteID = siteID;
                basicParam.UserID = userID;
                basicParam.AccessLevelID = accessLevelID;
                basicParam.LanguageCode = this.CurrentUser.LanguageCode;


                UserControls.PagerData pagerData = new UserControls.PagerData();
                pagerData.PageIndex = 0;
                pagerData.PageSize = int.Parse(hdnEquipmentHistoryPageSize.Value.ToString());
                pagerData.SelectMethod = "LoadEquipmentHistory";
                pagerData.ServicePath = servicePath;
                pagerData.SiteID = siteID;
                pagerData.UserID = userID;
                pagerData.AccessLevelID = accessLevelID;

                string usercontrolPath = ConfigurationManager.AppSettings["MaintUserControls"].ToString().TrimEnd('/');
                UserControls.DynamicGridControl dynamicGridControl = (UserControls.DynamicGridControl)Page.LoadControl(usercontrolPath + "/DynamicGridControl.ascx");
                divDynamicGridContent.Controls.Add(dynamicGridControl);


                #region Feature

                List<string> featureName = new List<string>();
                featureName.Add(Language_Resources.MaintenanceFeatures.viewMeasuringPointReadings);

                int featureID = 0;
                List<ipas_UserService.SiteFeatureInfo> featurePageToLoad = BLL.UserBLL.GetCompanyFeatureConfiguredURL(siteID, 0, featureName);
                if (featurePageToLoad.Count > 0)
                {
                    ipas_UserService.SiteFeatureInfo result = featurePageToLoad.SingleOrDefault(x => x.FeatureName == Language_Resources.MaintenanceFeatures.viewMeasuringPointReadings);
                    if (result != null)
                    {
                        featureID = result.FeatureID;
                    }
                }

                #endregion

                SiteDateTimeFormatInfo dateTimeForamt = BLL.MaintenanceBLL.GetSiteDateTimeFormatInfo(siteID);
                int currentDate = BLL.MaintenanceBLL.GetSiteCurrentDateTime(siteID).CurrentDate;


                UserControls.DynamicGridProperties dynamicGridProperties = new UserControls.DynamicGridProperties();
                 dynamicGridProperties.CurrentDate = currentDate;
                dynamicGridProperties.TableHeaderText = Language_Resources.ViewWorkOrderResource.measuringPointList;
                //dynamicGridProperties.CustomRowNavigationMethod = "ViewWorkOrderInfo";
                dynamicGridProperties.FeatureID = featureID;
                dynamicGridProperties.GridType = UserControls.DynamicGridType.Table;
                dynamicGridProperties.PagerData = pagerData;                
                //dynamicGridProperties.ImagePath = ConfigurationManager.AppSettings["MaintImagePath"].TrimEnd('/') + "/Styles/Images";
                dynamicGridProperties.WebServiceName = "Vegam_MaintenanceService.asmx";
                dynamicGridProperties.DatePickerFormat = CommonBLL.GetDatePickerDateFormat(dateTimeForamt.DateFormat);
                // dynamicGridProperties.ShowGroupRowsByDefault = false;
                dynamicGridProperties.ExcelSheetName = "MeasuringPointList";

                ScriptManager.RegisterStartupScript(this, this.GetType(), "LoadWorkOrderBasicInfo", "javascript:LoadWorkOrderBasicInfo(" + (new JavaScriptSerializer()).Serialize(basicParam) + "," + (new JavaScriptSerializer()).Serialize(pagerData) + "," + (new JavaScriptSerializer()).Serialize(dynamicGridProperties) + ",'" + servicePath + "','" + workOrder + "','" + imagePath + "','" + basePath + "','" + uploaderPath + "','" + maintScheduleAttachmentPath + "','" + accessType.ToString() + "','" + hdfDatePickerFormat.Value + "',"+ equipmentID + "," +
                    "'" + dateTimeFormat.DateFormat + "','" + dateTimeFormat.TimeFormat + "','"+ pType+"');", true);
            }
        }

        private AccessType ValidateUserPrivileges(int siteID, int accessLevelID)
        {
            AccessType access = AccessType.NO_ACCESS;
            if (equipmentID > 0)
                access = CommonBLL.ValidateUserPrivileges(siteID, this.CurrentUser.SiteID, this.CurrentUser.UserID, accessLevelID, Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.ViewEquipment));
            else
                access = CommonBLL.ValidateUserPrivileges(siteID, this.CurrentUser.SiteID, this.CurrentUser.UserID, accessLevelID, Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.ViewWorkOrderInfo));
            if (access == AccessType.NO_ACCESS)
                Response.Redirect(ConfigurationManager.AppSettings["NoAccessPage"].ToString());

            return access;
        }
    }
}