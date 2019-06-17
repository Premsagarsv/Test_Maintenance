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
    public partial class AddNotification : iPAS_Base.BasePage
    {
        bool hasEditAccess = false;
        bool hasDeleteAccess = false;
        AccessType workOrderHasFullAccess = AccessType.NO_ACCESS;
        int notificationID = 0;

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
                scriptReference.Path = ConfigurationManager.AppSettings["MaintJsPath"].ToString().TrimEnd('/') + "/ScriptResources/NotificationScriptResource.js";
                string[] cultures = ConfigurationManager.AppSettings["SupportLanguages"].ToString().Split(',');
                scriptReference.ResourceUICultures = CommonBLL.GetCultures(cultures, scriptReference.Path);
                scriptManager.Scripts.Add(scriptReference);

                scriptReference = new ScriptReference();
                scriptReference.Path = ConfigurationManager.AppSettings["MaintJsPath"].ToString().TrimEnd('/') + "/ScriptResources/jQueryCalendarScriptResource.js";
                scriptReference.ResourceUICultures = CommonBLL.GetCultures(cultures, scriptReference.Path);
                scriptManager.Scripts.Add(scriptReference);

                #endregion

                int siteID = CommonBLL.ValidateSiteID(Request);
                if (siteID == 0)
                {
                    Response.Redirect(ConfigurationManager.AppSettings["NoAccessPage"].ToString());
                }

                int userID = this.CurrentUser.UserID;
                int accessLevelID = CommonBLL.GetAccessLevelID(this.CurrentUser.AccessLevel);

                if (Request.QueryString["nid"] != null && Request.QueryString["nid"].Trim().Length > 0)
                {
                    notificationID = Convert.ToInt32(Request.QueryString["nid"].Trim());

                }

                AccessType access = ValidateUserPrivileges(siteID, accessLevelID);
                if (access == AccessType.FULL_ACCESS || access == AccessType.EDIT_ONLY)
                {
                    btnSaveNotification.Attributes.Add("onclick", "javascript:AddUpdateNotification(false);return false;");
                }
                else
                {
                    btnSaveNotification.Attributes.Add("disabled", "disabled");
                }

                string basePath = ConfigurationManager.AppSettings["MaintBasePath"].ToString().TrimEnd('/');
                string webServicePath = ConfigurationManager.AppSettings["MaintWebServicePath"];
                string uploaderPath = ConfigurationManager.AppSettings["uploaderPath"].ToString().Trim('/');
                string imagePath = ConfigurationManager.AppSettings["MaintImagePath"].TrimEnd('/');
                string notificationAttachmentPath = ConfigurationManager.AppSettings["NotificationAttachmentPath"].TrimEnd('/');

                Vegam_MaintenanceService.SiteDateTimeFormatInfo dateTimeFormat = BLL.MaintenanceBLL.GetSiteDateTimeFormatInfo(siteID);
                string datePickerFormat = CommonBLL.GetDatePickerDateFormat(dateTimeFormat.DateFormat);

                BasicParam basicParam = new BasicParam();
                basicParam.SiteID = siteID;
                basicParam.UserID = userID;
                basicParam.AccessLevelID = accessLevelID;
                basicParam.LanguageCode = this.CurrentUser.LanguageCode;

                #region notification PagerData 
                UserControls.PagerData pagerData = new UserControls.PagerData();
                pagerData.PageIndex = 0;
                pagerData.PageSize = int.Parse(hdnPageSize.Value.ToString());
                pagerData.SelectMethod = "LoadNotificationList";
                pagerData.ServicePath = webServicePath;
                pagerData.SiteID = siteID;
                pagerData.UserID = userID;
                pagerData.AccessLevelID = accessLevelID;
                pagerData.LoadControlID = btnSaveNotification.ClientID;
                pagerData.PageAccessRights = access.ToString();
                #endregion

                #region notification type PagerData 
                ////using pager for notification types modal popup 
                UserControls.PagerData maintTypePagerData = new UserControls.PagerData();
                maintTypePagerData.PageIndex = 0;
                maintTypePagerData.PageSize = int.Parse(hdnMasterPageSize.Value.ToString());
                maintTypePagerData.SelectMethod = "LoadMaintTypesInfo";
                maintTypePagerData.ServicePath = webServicePath;
                maintTypePagerData.SiteID = siteID;
                maintTypePagerData.UserID = userID;
                maintTypePagerData.AccessLevelID = accessLevelID;
                maintTypePagerData.LoadControlID = btnSaveNotification.ClientID;
                maintTypePagerData.PageAccessRights = access.ToString();
                #endregion

                #region FLocation and Equipment modal pagerdata
                //using pager for displaying equipment and locations in modal popup
                UserControls.PagerData equipmentPagerData = new UserControls.PagerData();
                equipmentPagerData.PageIndex = 0;
                equipmentPagerData.PageSize = int.Parse(hdnEquipmentPageSize.Value.ToString());
                equipmentPagerData.SelectMethod = "LoadAllEquipmentFLoaction";
                equipmentPagerData.ServicePath = webServicePath;
                equipmentPagerData.SiteID = siteID;
                equipmentPagerData.UserID = userID;
                equipmentPagerData.AccessLevelID = accessLevelID;
                equipmentPagerData.LoadControlID = btnSaveNotification.ClientID;
                #endregion

                thMaintTypes.Attributes.Add("onclick", "javascript:SortMaintTypesTabs('" + thMaintTypes.ClientID + "','MasterDataName');");
                thFLocation.Attributes.Add("onclick", "javascript:SortEquipmentTabs('" + thFLocation.ClientID + "','LocationName');");
                thEquipment.Attributes.Add("onclick", "javascript:SortEquipmentTabs('" + thEquipment.ClientID + "','EquipmentName');");
                thEquipmentType.Attributes.Add("onclick", "javascript:SortEquipmentTabs('" + thEquipmentType.ClientID + "','EquipmentType');");
                sortNotifications.Attributes.Add("onclick", "javascript:SortByNotificationName('" + sortNotifications.ClientID + "','NotificationName');");
                ScriptManager.RegisterStartupScript(this, this.GetType(), "NotificationBasicLoadInfo", "javascript:NotificationBasicLoadInfo(" + (new JavaScriptSerializer()).Serialize(basicParam) + "," + (new JavaScriptSerializer()).Serialize(pagerData) + "," + (new JavaScriptSerializer()).Serialize(equipmentPagerData) + "," + (new JavaScriptSerializer()).Serialize(maintTypePagerData) + ",'" + basePath + "','" + webServicePath + "','" + notificationID + "','" + hasEditAccess + "','" 
                    + hasDeleteAccess + "','" + workOrderHasFullAccess + "','"+ uploaderPath + "','"+ notificationAttachmentPath + "','"+ imagePath + "','"+ datePickerFormat + "','" + dateTimeFormat.DateFormat + "','" + dateTimeFormat.TimeFormat + "');", true);
            }

        }

        private AccessType ValidateUserPrivileges(int siteID, int accessLevelID)
        {
            AccessType access = CommonBLL.ValidateUserPrivileges(siteID, this.CurrentUser.SiteID, this.CurrentUser.UserID, accessLevelID, Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.ManageNotification));
            if (access == AccessType.NO_ACCESS)
            {
                Response.Redirect(ConfigurationManager.AppSettings["NoAccessPage"].ToString());
            }
            else if (access == AccessType.FULL_ACCESS || access == AccessType.EDIT_ONLY)
            {
                hasEditAccess = true;
                if (access == AccessType.FULL_ACCESS)
                {
                    hasDeleteAccess = true;
                }
            }

            workOrderHasFullAccess = CommonBLL.ValidateUserPrivileges(siteID, this.CurrentUser.SiteID, this.CurrentUser.UserID, accessLevelID, Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.ManageWorkOrder));
            
            return access;
        }
    }
}