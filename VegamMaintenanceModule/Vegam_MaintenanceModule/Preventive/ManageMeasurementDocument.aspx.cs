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
    public partial class ManageMeasurementDocument : iPAS_Base.BasePage
    {
        int userID;
        int siteID;
        int accessLevelID;
        int currentPage = 0;
        bool hasEditAccess = false;
        bool hasDeleteAccess = false;
        
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
                scriptReference.Path = ConfigurationManager.AppSettings["MaintJsPath"].ToString().TrimEnd('/') + "/ScriptResources/MeasurementDocumentScriptResource.js";
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
                string imagePath = ConfigurationManager.AppSettings["MaintImagePath"].TrimEnd('/') + "/Styles/Images";


                SiteDateTimeFormatInfo dateTimeForamt = BLL.MaintenanceBLL.GetSiteDateTimeFormatInfo(siteID);

                UserControls.DynamicGridControl dynamicGridControl = (UserControls.DynamicGridControl)Page.LoadControl(usercontrolPath + "/DynamicGridControl.ascx");
                divDynamicGridContent.Controls.Add(dynamicGridControl);

                #region Feature Measuring Point
                List<string> featureName = new List<string>();
                featureName.Add(Language_Resources.MaintenanceFeatures.ManageChecklist);

                int featureID = 0;
                List<ipas_UserService.SiteFeatureInfo> featurePageToLoad = BLL.UserBLL.GetCompanyFeatureConfiguredURL(siteID, 0, featureName);
                if (featurePageToLoad.Count > 0)
                {
                    ipas_UserService.SiteFeatureInfo result = featurePageToLoad.SingleOrDefault(x => x.FeatureName == Language_Resources.MaintenanceFeatures.ManageChecklist);
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
                pagerData.SiteID = siteID;
                pagerData.UserID = userID;
                pagerData.AccessLevelID = accessLevelID;
                pagerData.PlantDateFormat = dateTimeForamt.DateFormat;
                pagerData.PlantTimeFormat = dateTimeForamt.TimeFormat;

                UserControls.DynamicGridProperties dynamicGridProperties = new UserControls.DynamicGridProperties();
                dynamicGridProperties.GridType = UserControls.DynamicGridType.Table;
                dynamicGridProperties.FeatureID = featureID;
                dynamicGridProperties.DatePickerFormat = CommonBLL.GetDatePickerDateFormat(dateTimeForamt.DateFormat);
                dynamicGridProperties.TableHeaderText = Language_Resources.MeasurementDocument_Resource.listOfMeasurementDocument;
                dynamicGridProperties.ImagePath = ConfigurationManager.AppSettings["MaintImagePath"].TrimEnd('/') + "/Styles/Images";
                dynamicGridProperties.PagerData = pagerData;
                dynamicGridProperties.WebServiceName = "Vegam_MaintenanceService.asmx";
                dynamicGridProperties.ExcelSheetName = "MeasurementDocumentList";
                
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

                string newScheduleHTML = "<input id='btnNewSchedule' type='button'class='btn btn-sm btn-success pull-xs-right pover' data-placement='top' data-content='" + Language_Resources.MeasurementDocument_Resource.newMeasDocument + "' value='" + Language_Resources.MeasurementDocument_Resource.newMeasDocument + "' disabled='disabled'/>";
                string editScheduleHTML = "<i class='fa fa-edit linkcolor big tiny-leftmargin tiny-rightmargin v-icon  cursor-pointer icon-muted'></i>";
                string deleteScheduleHTML = "<i class='fa fa-trash-o red big tiny-leftmargin tiny-rightmargin v-icon  cursor-pointer icon-muted '></i>";
                string activateScheduleHTML = string.Empty;

                //if (hasEditAccess)
                    editScheduleHTML = "<i class='fa fa-edit linkcolor big tiny-leftmargin tiny-rightmargin v-icon  cursor-pointer' title='Edit' onclick='javascript:EditScheduleInfo(this);'></i>";
                if (hasDeleteAccess)
                {
                    newScheduleHTML = "<input id='btnNewSchedule' type='button'class='btn btn-sm btn-success pull-xs-right pover' data-placement='top' data-content='" + Language_Resources.MeasurementDocument_Resource.newMeasDocument + "' value='" + Language_Resources.MeasurementDocument_Resource.newMeasDocument + "' onclick='javascript:AddNewSchedule();'/>";
                    deleteScheduleHTML = "<i class='fa fa-trash-o red big tiny-leftmargin tiny-rightmargin v-icon  cursor-pointer' title='Delete' onclick='javascript:DeleteScheduleInfoConfirm(this);'></i>";
                    //activateScheduleHTML = "<li><label onclick='javascript:ActivateScheduleInfoCinfirm(this);' class='font-small push-down full-width cursor-pointer'><span><i class='fa myicon text-danger big tiny-leftmargin tiny-rightmargin v-icon'></i><span name='activate'>ActivateButtonValue</span></span></label></li>";
                }

                Page.ClientScript.RegisterStartupScript(GetType(), "LoadMeasurementDocumentPage", "LoadMeasurementDocumentPage(" + (new JavaScriptSerializer()).Serialize(dynamicGridProperties) + ",'" + basePath+"','"+hasEditAccess+"','"+hasDeleteAccess+ "',\"" + newScheduleHTML + "\",\"" + editScheduleHTML + "\",\"" + deleteScheduleHTML + "\",\"" + activateScheduleHTML + "\","+ (new JavaScriptSerializer()).Serialize(workOrderPagerData)+ ",'" + imagePath + "')", true);

            }
        }

        private void ValidateUserPrivileges(int siteID, int accessLevelID)
        {
            AccessType access = CommonBLL.ValidateUserPrivileges(siteID, this.CurrentUser.SiteID, userID, accessLevelID, Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.ManageChecklist));

            if (access == AccessType.NO_ACCESS)
                Response.Redirect(ConfigurationManager.AppSettings["NoAccessPage"].ToString());

            if (access == AccessType.FULL_ACCESS)
            {
                hasDeleteAccess = true;
                hasEditAccess = true;
            }
            else if (access == AccessType.EDIT_ONLY)
            {
                hasEditAccess = true;
            }
        }
    }
}