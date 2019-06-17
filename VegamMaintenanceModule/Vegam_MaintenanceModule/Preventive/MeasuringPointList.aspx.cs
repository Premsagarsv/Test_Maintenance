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
    public partial class MeasuringPointList : iPAS_Base.BasePage
    {
        int userID;
        int siteID;
        int accessLevelID;
        int currentPage = 0;

        protected override void OnPreInit(EventArgs e)
        {
            this.MasterPageFile = ConfigurationManager.AppSettings["VegamiFrameMasterPage"].ToString();
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                #region Script_Resource_Refernce
                ScriptReference scriptReference = new ScriptReference();
                scriptReference.Path = ConfigurationManager.AppSettings["MaintJsPath"].ToString().TrimEnd('/') + "/ScriptResources/DynamicGridScriptResource.js";
                string[] cultures = ConfigurationManager.AppSettings["SupportLanguages"].ToString().Split(',');
                scriptReference.ResourceUICultures = CommonBLL.GetCultures(cultures, scriptReference.Path);
                ScriptManager1.Scripts.Add(scriptReference);

                scriptReference = new ScriptReference();
                scriptReference.Path = ConfigurationManager.AppSettings["MaintJsPath"].ToString().TrimEnd('/') + "/ScriptResources/MeasuringPointScriptResource.js";
                scriptReference.ResourceUICultures = CommonBLL.GetCultures(cultures, scriptReference.Path);
                ScriptManager1.Scripts.Add(scriptReference);
                #endregion

                userID = this.CurrentUser.UserID;
                siteID = this.CurrentUser.SiteID;
                accessLevelID = CommonBLL.GetAccessLevelID(this.CurrentUser.AccessLevel);

                ValidateUserPrivileges(siteID, accessLevelID);

                BasicParam basicParam = new BasicParam();
                basicParam.SiteID = siteID;
                basicParam.UserID = userID;

                string usercontrolPath = ConfigurationManager.AppSettings["MaintUserControls"].ToString().TrimEnd('/');
                string webServicePath = ConfigurationManager.AppSettings["MaintWebServicePath"].ToString().TrimEnd('/');
                string basePath = ConfigurationManager.AppSettings["MaintBasePath"].ToString().TrimEnd('/');
                string uploaderPath = ConfigurationManager.AppSettings["uploaderPath"].ToString().Trim('/');

                SiteDateTimeFormatInfo dateTimeForamt = BLL.MaintenanceBLL.GetSiteDateTimeFormatInfo(siteID);

                UserControls.DynamicGridControl dynamicGridControl = (UserControls.DynamicGridControl)Page.LoadControl(usercontrolPath + "/DynamicGridControl.ascx");
                divDynamicGridContent.Controls.Add(dynamicGridControl);

                #region Feature Measuring Point
                List<string> featureName = new List<string>();
                featureName.Add(Language_Resources.MaintenanceFeatures.measuringPoints);

                int featureID = 0;
                List<ipas_UserService.SiteFeatureInfo> featurePageToLoad = BLL.UserBLL.GetCompanyFeatureConfiguredURL(siteID, 0, featureName);
                if (featurePageToLoad.Count > 0)
                {
                    ipas_UserService.SiteFeatureInfo result = featurePageToLoad.SingleOrDefault(x => x.FeatureName == Language_Resources.MaintenanceFeatures.measuringPoints);
                    if (result != null)
                    {
                        featureID = result.FeatureID;
                    }
                }
                #endregion

                UserControls.PagerData pagerData = new UserControls.PagerData();
                pagerData.PageIndex = 0;
                pagerData.PageSize = int.Parse(hdnPageSize.Value.ToString());
                pagerData.CurrentPage = currentPage;
                pagerData.ServicePath = webServicePath;
                pagerData.SelectMethod = "LoadDynamicGridContent";
                pagerData.LoadControlID = uploadFile.ClientID;
                pagerData.SiteID = siteID;
                pagerData.UserID = userID;
                pagerData.AccessLevelID = accessLevelID;
                pagerData.PlantDateFormat = dateTimeForamt.DateFormat;
                pagerData.PlantTimeFormat = dateTimeForamt.TimeFormat;
                pagerData.PageAccessRights = PageAccessRights;

                UserControls.DynamicGridProperties dynamicGridProperties = new UserControls.DynamicGridProperties();
                dynamicGridProperties.GridType = UserControls.DynamicGridType.Table;
                dynamicGridProperties.FeatureID = featureID;
                dynamicGridProperties.DatePickerFormat = CommonBLL.GetDatePickerDateFormat(dateTimeForamt.DateFormat);
                dynamicGridProperties.TableHeaderText = Language_Resources.MeasuringPoint_Resource.listOfMeasuringPoints;
                dynamicGridProperties.ImagePath = ConfigurationManager.AppSettings["MaintImagePath"].TrimEnd('/') + "/Styles/Images";
                dynamicGridProperties.PagerData = pagerData;
                dynamicGridProperties.WebServiceName = "Vegam_MaintenanceService.asmx";
                dynamicGridProperties.ExcelSheetName = "MeasuringPointList";                   

                if (PageAccessRights == AccessType.FULL_ACCESS.ToString())
                {
                    uploadFile.Attributes.Add("onchange", "javascript:UploadMeasuringPointInfo(); return false;");
                    btnAddMeasuringPoint.Attributes.Add("onclick", "javascript:AddMeasuringPoints();return false;");
                }
                else
                {
                    btnUploadExcel.Attributes.Add("disabled", "disabled");
                    btnAddMeasuringPoint.Attributes.Add("disabled", "disabled");
                }
                Page.ClientScript.RegisterStartupScript(GetType(), "LoadMeasuringPointListPage", "LoadMeasuringPointListPage(" + (new JavaScriptSerializer()).Serialize(dynamicGridProperties) + ",'" + basePath + "','" + uploaderPath + "')", true);

            }
        }

        public string PageAccessRights
        {
            get
            {
                return hdnAccessRights.Value.ToString();
            }
            set
            {
                hdnAccessRights.Value = value;
            }
        }

        private void ValidateUserPrivileges(int siteID, int accessLevelID)
        {
            string accessValue = BLL.UserBLL.GetUserAssignedPermissions(this.CurrentUser.UserID, 0, Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_Measuring_Point));
            if (accessValue != "0")
            {
                this.PageAccessRights = CommonBLL.GetAccessValue(accessValue).ToString();
            }
            else
            {
                Response.Redirect(ConfigurationManager.AppSettings["NoAccessPage"].ToString());
            }
        }
    }
}