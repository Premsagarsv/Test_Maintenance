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
    public partial class ManageSchedule : iPAS_Base.BasePage
    {
        private string _manageScheduleAccess = string.Empty;

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
                scriptReference.Path = ConfigurationManager.AppSettings["MaintJsPath"].ToString().TrimEnd('/') + "/ScriptResources/ManageScheduleScriptResource.js";
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
                string imagePath = ConfigurationManager.AppSettings["MaintImagePath"].TrimEnd('/') + "/Styles/Images";
                string userControlPath = ConfigurationManager.AppSettings["MaintUserControls"].ToString().TrimEnd('/');
                UserControls.DynamicGridControl dynamicGridControl = (UserControls.DynamicGridControl)Page.LoadControl(userControlPath + "/DynamicGridControl.ascx");
                divDynamicGridContent.Controls.Add(dynamicGridControl);

                int featureID = 0;
                List<string> featureName = new List<string>();
                featureName.Add(Language_Resources.MaintenanceFeatures.ManageSchedule);

                List<ipas_UserService.SiteFeatureInfo> featurePageToLoad = BLL.UserBLL.GetCompanyFeatureConfiguredURL(siteID, 0, featureName);
                if (featurePageToLoad.Count > 0)
                {
                    ipas_UserService.SiteFeatureInfo result = featurePageToLoad.SingleOrDefault(x => x.FeatureName == featureName[0]);
                    if (result != null)
                    {
                        featureID = result.FeatureID;
                    }
                }

                string webServicePath = ConfigurationManager.AppSettings["MaintWebServicePath"].Trim();

                UserControls.PagerData pagerData = new UserControls.PagerData();
                pagerData.PageIndex = 0;
                pagerData.PageSize = Convert.ToInt32(hdnPageSize.Value);
                pagerData.CurrentPage = 0;
                pagerData.SelectMethod = "LoadDynamicGridContent";
                pagerData.ServicePath = webServicePath;
                pagerData.SiteID = siteID;
                pagerData.UserID = userID;
                pagerData.AccessLevelID = accessLevelID;

                UserControls.DynamicGridProperties dynamicGridProperties = new UserControls.DynamicGridProperties();
                dynamicGridProperties.FeatureID = featureID;
                dynamicGridProperties.GridType = UserControls.DynamicGridType.Table;
                dynamicGridProperties.PagerData = pagerData;
                dynamicGridProperties.TableHeaderText = Language_Resources.ManageSchedule_Resource.listOfSchedules;
                dynamicGridProperties.WebServiceName = "Vegam_MaintenanceService.asmx";
                dynamicGridProperties.ExcelSheetName = "MaintenanceSchedule";

                //using pager for displaying work order details
                UserControls.PagerData workOrderPagerData = new UserControls.PagerData();
                workOrderPagerData.PageIndex = 0;
                workOrderPagerData.PageSize = int.Parse(hdnWorkOrderPageSize.Value.ToString());
                workOrderPagerData.SelectMethod = "LoadScheduleWorkOrderDetails";
                workOrderPagerData.ServicePath = webServicePath;
                workOrderPagerData.SiteID = siteID;
                workOrderPagerData.UserID = userID;
                workOrderPagerData.AccessLevelID = accessLevelID;
                workOrderPagerData.LoadControlID = tBodyWorkOrderDetails.ClientID;

                string newScheduleHTML = "<input id='btnNewSchedule' type='button'class='btn btn-sm btn-success pull-xs-right pover' data-placement='top' disabled='disabled' data-content='" + Language_Resources.ManageSchedule_Resource.addMaintSchedule + "' value='" + Language_Resources.ManageSchedule_Resource.addMaintSchedule + "'/>";
                string editScheduleHTML = "<i class='fa fa-edit linkcolor big tiny-leftmargin tiny-rightmargin v-icon  cursor-pointer icon-muted'></i>";
                string deleteScheduleHTML = "<i class='fa fa-trash-o red big tiny-leftmargin tiny-rightmargin v-icon  cursor-pointer icon-muted '></i>";
                string activateScheduleHTML = string.Empty;

                //if (_manageScheduleAccess.ToLower() != "read_only")
                //{
                    editScheduleHTML = "<i class='fa fa-edit linkcolor big tiny-leftmargin tiny-rightmargin v-icon  cursor-pointer' title='Edit' onclick='javascript:EditScheduleInfo(this);'></i>";
                    if (_manageScheduleAccess.ToLower() == "full_access")
                    {
                        newScheduleHTML = "<input id='btnNewSchedule' type='button'class='btn btn-sm btn-success pull-xs-right pover' data-placement='top' data-content='" + Language_Resources.ManageSchedule_Resource.addMaintSchedule + "' value='" + Language_Resources.ManageSchedule_Resource.addMaintSchedule + "' onclick='javascript:AddNewSchedule();'/>";
                        deleteScheduleHTML= "<i class='fa fa-trash-o red big tiny-leftmargin tiny-rightmargin v-icon  cursor-pointer' title='Delete' onclick='javascript:DeleteScheduleInfoConfirm(this);'></i>";
                        //activateScheduleHTML = "<li><label onclick='javascript:ActivateScheduleInfoConfirm(this);' class='font-small push-down full-width cursor-pointer'><span><i class='fa myicon text-danger big tiny-leftmargin tiny-rightmargin v-icon'></i><span name='activate'>ActivateButtonValue</span></span></label></li>";
                    }
                //}

                Page.ClientScript.RegisterStartupScript(GetType(), "LoadManageScheduleInfo", "LoadManageScheduleInfo(" + (new JavaScriptSerializer()).Serialize(dynamicGridProperties) + ",'" + _manageScheduleAccess + "',\"" + newScheduleHTML + "\",\"" + editScheduleHTML + "\",\"" + deleteScheduleHTML + "\",\"" + activateScheduleHTML + "\",'" + basePath + "','"+ imagePath + "',"+ (new JavaScriptSerializer()).Serialize(workOrderPagerData) + ")", true);
            }
        }

        private void ValidateUserPrivileges(int userID, int siteID, int accessLevelID)
        {
            AccessType access = CommonBLL.ValidateUserPrivileges(siteID, this.CurrentUser.SiteID, userID, accessLevelID, Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.ManagePreventiveMaintenanceSchedule));

            if (access == AccessType.NO_ACCESS)
                Response.Redirect(ConfigurationManager.AppSettings["NoAccessPage"].ToString());

            _manageScheduleAccess = access.ToString();
        }
    }
}