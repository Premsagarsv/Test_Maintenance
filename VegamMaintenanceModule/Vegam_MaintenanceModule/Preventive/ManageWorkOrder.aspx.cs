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
    public partial class ManageWorkOrder : iPAS_Base.BasePage
    {
        private string _manageWorkOrderAccess = string.Empty;

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
                scriptReference.Path = ConfigurationManager.AppSettings["MaintJsPath"].ToString().TrimEnd('/') + "/ScriptResources/DynamicGridScriptResource.js";
                string[] cultures = ConfigurationManager.AppSettings["SupportLanguages"].ToString().Split(',');
                scriptReference.ResourceUICultures = CommonBLL.GetCultures(cultures, scriptReference.Path);
                ScriptManager1.Scripts.Add(scriptReference);

                scriptReference = new ScriptReference();
                scriptReference.Path = ConfigurationManager.AppSettings["MaintJsPath"].ToString().TrimEnd('/') + "/ScriptResources/ManageWorkOrderScriptResource.js";
                scriptReference.ResourceUICultures = CommonBLL.GetCultures(cultures, scriptReference.Path);
                ScriptManager1.Scripts.Add(scriptReference);

                scriptReference = new ScriptReference();
                scriptReference.Path = ConfigurationManager.AppSettings["MaintJsPath"].ToString().TrimEnd('/') + "/ScriptResources/jQueryCalendarScriptResource.js";
                scriptReference.ResourceUICultures = CommonBLL.GetCultures(cultures, scriptReference.Path);
                ScriptManager1.Scripts.Add(scriptReference);

                #endregion

                int siteID = CommonBLL.ValidateSiteID(Request);
                if (siteID == 0)
                    Response.Redirect(ConfigurationManager.AppSettings["NoAccessPage"].ToString());

                int userID = this.CurrentUser.UserID;
                int accessLevelID = CommonBLL.GetAccessLevelID(this.CurrentUser.AccessLevel);

                ValidateUserPrivileges(userID, siteID, accessLevelID);

                string basePath = ConfigurationManager.AppSettings["MaintBasePath"].ToString().TrimEnd('/');
                string userControlPath = ConfigurationManager.AppSettings["MaintUserControls"].ToString().TrimEnd('/');

                SiteDateTimeFormatInfo dateTimeForamt = BLL.MaintenanceBLL.GetSiteDateTimeFormatInfo(siteID);

                UserControls.DynamicGridControl dynamicGridControl = (UserControls.DynamicGridControl)Page.LoadControl(userControlPath + "/DynamicGridControl.ascx");
                divDynamicGridContent.Controls.Add(dynamicGridControl);

                int featureID = 0;
                List<string> featureName = new List<string>();
                featureName.Add(Language_Resources.MaintenanceFeatures.ManageWorkOrder);

                List<ipas_UserService.SiteFeatureInfo> featurePageToLoad = BLL.UserBLL.GetCompanyFeatureConfiguredURL(siteID, 0, featureName);
                if (featurePageToLoad.Count > 0)
                {
                    ipas_UserService.SiteFeatureInfo result = featurePageToLoad.SingleOrDefault(x => x.FeatureName == featureName[0]);
                    if (result != null)
                    {
                        featureID = result.FeatureID;
                    }
                }

                Vegam_MaintenanceService.SiteDateTimeFormatInfo dateTimeFormat = BLL.MaintenanceBLL.GetSiteDateTimeFormatInfo(siteID);
                string dateFormat = CommonBLL.GetDatePickerDateFormat(dateTimeFormat.DateFormat);

                UserControls.PagerData pagerData = new UserControls.PagerData();
                pagerData.PageIndex = 0;
                pagerData.PageSize = Convert.ToInt32(hdnPageSize.Value);
                pagerData.CurrentPage = 0;
                pagerData.SelectMethod = "LoadDynamicGridContent";
                pagerData.ServicePath = ConfigurationManager.AppSettings["MaintWebServicePath"].Trim();
                pagerData.SiteID = siteID;
                pagerData.UserID = userID;
                pagerData.PlantDateFormat = dateTimeForamt.DateFormat;
                pagerData.PlantTimeFormat = dateTimeForamt.TimeFormat;
                pagerData.AccessLevelID = accessLevelID;

                string imagePath = ConfigurationManager.AppSettings["MaintImagePath"].TrimEnd('/') + "/Styles/Images";

                UserControls.DynamicGridProperties dynamicGridProperties = new UserControls.DynamicGridProperties();
                dynamicGridProperties.FeatureID = featureID;
                dynamicGridProperties.DatePickerFormat = CommonBLL.GetDatePickerDateFormat(dateTimeForamt.DateFormat);
                dynamicGridProperties.GridType = UserControls.DynamicGridType.Table;
                dynamicGridProperties.PagerData = pagerData;
                dynamicGridProperties.TableHeaderText = Language_Resources.ManageWorkOrder_Resource.listOfWorkOrders;
                dynamicGridProperties.WebServiceName = "Vegam_MaintenanceService.asmx";
                dynamicGridProperties.ExcelSheetName = "MaintenanceWorkOrder";
                dynamicGridProperties.ImagePath = imagePath;

                string newWorkOrderHTML = "<input id='btnNewWorkOrder' type='button'class='btn btn-sm btn-success pull-xs-right pover' data-placement='top' data-content='" + Language_Resources.ManageWorkOrder_Resource.addMaintWorkOrder + "' value='" + Language_Resources.ManageWorkOrder_Resource.addMaintWorkOrder + "' disabled='disabled'/>";
                string editWorkOrderHTML = "<i class='fa fa-edit linkcolor big tiny-leftmargin tiny-rightmargin v-icon  cursor-pointer icon-muted'></i>";
                string deleteWorkOrderHTML = "<i class='fa fa-trash-o red big tiny-leftmargin tiny-rightmargin v-icon  cursor-pointer icon-muted '></i>";

                //if (_manageWorkOrderAccess.ToLower() != "read_only")
                //{
                    editWorkOrderHTML = "<i class='fa fa-edit linkcolor big tiny-leftmargin tiny-rightmargin v-icon  cursor-pointer' onclick='javascript:EditWorkOrderInfo(this);' title='Edit'></i>";
                    if (_manageWorkOrderAccess.ToLower() == "full_access")
                    {
                        newWorkOrderHTML = "<input id='btnNewWorkOrder' type='button'class='btn btn-sm btn-success pull-xs-right pover' data-placement='top' data-content='" + Language_Resources.ManageWorkOrder_Resource.addMaintWorkOrder + "' value='" + Language_Resources.ManageWorkOrder_Resource.addMaintWorkOrder + "' onclick='javascript:AddNewWorkOrder();'/>";
                        deleteWorkOrderHTML = "<i class='fa fa-trash-o red big tiny-leftmargin tiny-rightmargin v-icon  cursor-pointer' onclick='javascript:DeleteWorkOrderInfoConfirm(this);' title='Delete'></i>";
                    }
                //}

                Page.ClientScript.RegisterStartupScript(GetType(), "LoadManageWorkOrderInfo", "LoadManageWorkOrderInfo(" + (new JavaScriptSerializer()).Serialize(dynamicGridProperties) + ",'" + _manageWorkOrderAccess + "',\"" + newWorkOrderHTML + "\",\"" + editWorkOrderHTML + "\",\"" + deleteWorkOrderHTML + "\",'" + basePath + "','"+ dateFormat + "')", true);
            }
        }

        private void ValidateUserPrivileges(int userID, int siteID, int accessLevelID)
        {
            AccessType access = CommonBLL.ValidateUserPrivileges(siteID, this.CurrentUser.SiteID, userID, accessLevelID, Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.ManageWorkOrder));

            if (access == AccessType.NO_ACCESS)
                Response.Redirect(ConfigurationManager.AppSettings["NoAccessPage"].ToString());

            _manageWorkOrderAccess = access.ToString();
        }
    }
}