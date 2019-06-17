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
    public partial class TaskGroupList : iPAS_Base.BasePage
    {
        int siteID = 0;
        int userID = 0;
        int accessLevelID = 0;
        int currentPage = 0;

        protected override void OnPreInit(EventArgs e)
        {
            this.MasterPageFile = ConfigurationManager.AppSettings["MaintVegamMasterPage"].ToString();
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
                scriptReference.Path = ConfigurationManager.AppSettings["MaintJsPath"].ToString().TrimEnd('/') + "/ScriptResources/TaskGroupScriptResource.js";
                scriptReference.ResourceUICultures = CommonBLL.GetCultures(cultures, scriptReference.Path);
                ScriptManager1.Scripts.Add(scriptReference);
                #endregion

                userID = this.CurrentUser.UserID;
                siteID = this.CurrentUser.SiteID;
                accessLevelID = CommonBLL.GetAccessLevelID(this.CurrentUser.AccessLevel);

                AccessType accessType = ValidateUserPrivileges(siteID, accessLevelID);

                Vegam_MaintenanceService.BasicParam basicParam = new Vegam_MaintenanceService.BasicParam();
                basicParam.SiteID = siteID;
                basicParam.UserID = userID;

                string usercontrolPath = ConfigurationManager.AppSettings["MaintUserControls"].ToString().TrimEnd('/');
                string webServicePath = ConfigurationManager.AppSettings["MaintWebServicePath"].ToString().TrimEnd('/');
                string basePath = ConfigurationManager.AppSettings["MaintBasePath"].ToString().TrimEnd('/');
                string uploaderPath = ConfigurationManager.AppSettings["uploaderPath"].ToString().Trim('/');

                SiteDateTimeFormatInfo dateTimeForamt = BLL.MaintenanceBLL.GetSiteDateTimeFormatInfo(siteID);

                UserControls.DynamicGridControl dynamicGridControl = (UserControls.DynamicGridControl)Page.LoadControl(usercontrolPath + "/DynamicGridControl.ascx");
                divDynamicGridContent.Controls.Add(dynamicGridControl);

                #region Feature Equipment Model
                List<string> featureName = new List<string>();
                featureName.Add(Language_Resources.TaskGroup_Resource.FEATURE_TASKGROUP);

                int featureID = 0;
                List<ipas_UserService.SiteFeatureInfo> featurePageToLoad = BLL.UserBLL.GetCompanyFeatureConfiguredURL(siteID, 0, featureName);
                if (featurePageToLoad.Count > 0)
                {
                    ipas_UserService.SiteFeatureInfo result = featurePageToLoad.SingleOrDefault(x => x.FeatureName == Language_Resources.TaskGroup_Resource.FEATURE_TASKGROUP);
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
                pagerData.PageAccessRights = accessType.ToString();

                UserControls.DynamicGridProperties dynamicGridProperties = new UserControls.DynamicGridProperties();
                dynamicGridProperties.GridType = UserControls.DynamicGridType.Table;
                dynamicGridProperties.FeatureID = featureID;
                dynamicGridProperties.DatePickerFormat = CommonBLL.GetDatePickerDateFormat(dateTimeForamt.DateFormat);
                dynamicGridProperties.TableHeaderText = Language_Resources.TaskGroup_Resource.listOfTaskGroup;
                //dynamicGridProperties.ImagePath = ConfigurationManager.AppSettings["MaintImagePath"].TrimEnd('/') + "/Styles/Images";
                dynamicGridProperties.PagerData = pagerData;
                dynamicGridProperties.WebServiceName = "Vegam_MaintenanceService.asmx";
                dynamicGridProperties.ExcelSheetName = "TaskGrouplList";

                if (accessType == AccessType.FULL_ACCESS)
                {
                    uploadFile.Attributes.Add("onchange", "javascript:UploadTaskGroupInfo(); return false;");
                    btnAddNewEquipmentModel.Attributes.Add("onclick", "javascript:AddNewTaskGroup();return false;");
                }
                else
                {
                    btnUploadExcel.Attributes.Add("disabled", "disabled");
                    btnAddNewEquipmentModel.Attributes.Add("disabled", "disabled");
                }
                
                Page.ClientScript.RegisterStartupScript(GetType(), "LoadTaskGroupListPage", "LoadTaskGroupListPage(" + (new JavaScriptSerializer()).Serialize(dynamicGridProperties) + ",'" + basePath + "','" + uploaderPath + "')", true);

            }
        }

        private AccessType ValidateUserPrivileges(int siteID, int accessLevelID)
        {
            AccessType access = AccessType.NO_ACCESS;
            access = CommonBLL.ValidateUserPrivileges(siteID, this.CurrentUser.SiteID, this.CurrentUser.UserID, accessLevelID, Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.configureTaskGroup));

            if (access == AccessType.NO_ACCESS)
            {
                Response.Redirect(ConfigurationManager.AppSettings["NoAccessPage"].ToString());

            }
            return access;
        }
    }
}