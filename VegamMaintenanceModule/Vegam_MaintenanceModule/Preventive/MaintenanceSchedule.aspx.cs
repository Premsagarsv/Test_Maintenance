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
    public partial class MaintenanceSchedule : iPAS_Base.BasePage
    {
        AccessType maintTypeAccess = AccessType.NO_ACCESS;
        AccessType maintReleaseAccess = AccessType.NO_ACCESS;
        string scheduleType = "S";

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                #region Script Resource

                ScriptReference scriptReference = new ScriptReference();
                scriptReference.Path = ConfigurationManager.AppSettings["MaintJsPath"].ToString().TrimEnd('/') + "/ScriptResources/MaintenanceScheduleScriptResource.js";
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

                //if loading page from manage schedule option
                if (Request.QueryString["isschedule"] != null && Request.QueryString["isschedule"].Trim().Length > 0)
                {
                    scheduleType = Request.QueryString["isschedule"].ToString().Trim() == "true" ? "S" : scheduleType;
                }

                //if loading page from manage work order option
                else if (Request.QueryString["isworkorder"] != null && Request.QueryString["isworkorder"].Trim().Length > 0)
                {
                    scheduleType = Request.QueryString["isworkorder"].ToString().Trim() == "true" ? "W" : scheduleType;
                }

                //if loading page from measuring point
                else if (Request.QueryString["isinspection"] != null && Request.QueryString["isinspection"].Trim().Length > 0)
                {
                    scheduleType = Request.QueryString["isinspection"].ToString().Trim() == "true" ? "I" : scheduleType;
                }

                //if loading page in edit mode
                int maintScheduleID = 0;
                if (Request.QueryString["maintscheduleid"] != null && Request.QueryString["maintscheduleid"].Trim().Length > 0)
                {
                    maintScheduleID = Convert.ToInt32(Request.QueryString["maintscheduleid"].ToString().Trim());
                }

                //if creating workorder for notification
                int notificationID = 0;
                if (Request.QueryString["notificationid"] != null && Request.QueryString["notificationid"].Trim().Length > 0 && scheduleType=="W")
                {
                    notificationID = Convert.ToInt32(Request.QueryString["notificationid"].ToString().Trim());
                }

                string workOrderID = string.Empty;
                //workorder will be there if its workorder of schedule
                if (Request.QueryString["workorderid"] != null && Request.QueryString["workorderid"].Trim().Length > 0 && scheduleType == "W")
                {
                    workOrderID = Request.QueryString["workorderid"].ToString().Trim();
                }

                string workOrderScheduleType = string.Empty;
                //workorder schedule type will be there if its workorder of schedule
                if (Request.QueryString["scheduletype"] != null && Request.QueryString["scheduletype"].Trim().Length > 0 && !string.IsNullOrEmpty(workOrderID))
                {
                    workOrderScheduleType = Request.QueryString["scheduletype"].ToString().Trim();
                }

                bool isFromManageNotify = false;
                if (Request.QueryString["ismn"] != null && Request.QueryString["ismn"].Trim().Length > 0 && scheduleType == "W")
                {
                    isFromManageNotify = Request.QueryString["ismn"].ToString().Trim().ToLower()=="true";
                }

                int userID = this.CurrentUser.UserID;
                int accessLevelID = CommonBLL.GetAccessLevelID(this.CurrentUser.AccessLevel);

                AccessType accessType = ValidateUserPrivileges(siteID, accessLevelID);


                if ((accessType == AccessType.FULL_ACCESS || accessType == AccessType.EDIT_ONLY) && maintScheduleID > 0)
                {
                    btnCancelWorkOrder.Attributes.Add("onclick", "javascript:CancelWorkOrderConfirm();return false;");
                }
                else
                {
                    btnCancelWorkOrder.Attributes.Add("disabled", "disabled");
                }

                btnCancelWorkOrder.Visible = false;
                if (!string.IsNullOrEmpty(workOrderID) && !string.IsNullOrEmpty(workOrderScheduleType) && workOrderScheduleType == "S")
                {
                    accessType = AccessType.READ_ONLY;
                    btnActivateSchedule.Visible = false;
                    btnCancelWorkOrder.Visible = true;
                }
                if(!string.IsNullOrEmpty(workOrderID) && !string.IsNullOrEmpty(workOrderScheduleType) && workOrderScheduleType == "W")
                {
                    btnCancelWorkOrder.Visible = false;
                    btnActivateSchedule.Visible = true;
                }

                string basePath = ConfigurationManager.AppSettings["MaintBasePath"].ToString().TrimEnd('/');
                string webServicePath = ConfigurationManager.AppSettings["MaintWebServicePath"].Trim();
                string defaultImage = ConfigurationManager.AppSettings["MaintImagePath"].TrimEnd('/') + "/Styles/Images/Equipments.png";
                string imagePath = ConfigurationManager.AppSettings["MaintImagePath"].TrimEnd('/');
                string taskDocumentPath = ConfigurationManager.AppSettings["MaintenanceTaskDocumentsPath"].TrimEnd('/');
                string uploaderPath = ConfigurationManager.AppSettings["uploaderPath"].ToString().Trim('/');
                string maintScheduleAttachmentPath = ConfigurationManager.AppSettings["MaintScheduleAttachmentPath"].TrimEnd('/');

                Vegam_MaintenanceService.SiteDateTimeFormatInfo dateTimeFormat = BLL.MaintenanceBLL.GetSiteDateTimeFormatInfo(siteID);
                string datePickerFormat = CommonBLL.GetDatePickerDateFormat(dateTimeFormat.DateFormat);

                //using pager for displaying maintenance types in configure maintenance types modal popup 
                UserControls.PagerData maintTypePagerData = new UserControls.PagerData();
                maintTypePagerData.PageIndex = 0;
                maintTypePagerData.PageSize = int.Parse(hdnPageSize.Value.ToString());
                maintTypePagerData.SelectMethod = "LoadMaintTypesInfo";
                maintTypePagerData.ServicePath = webServicePath;
                maintTypePagerData.SiteID = siteID;
                maintTypePagerData.UserID = userID;
                maintTypePagerData.AccessLevelID = accessLevelID;
                maintTypePagerData.LoadControlID = btnSaveMaintInfo.ClientID;
                maintTypePagerData.PageAccessRights = maintTypeAccess.ToString();


                //using pager for displaying equipment and locations in modal popup
                UserControls.PagerData equipmentPagerData = new UserControls.PagerData();
                equipmentPagerData.PageIndex = 0;
                equipmentPagerData.PageSize = int.Parse(hdnPageSize.Value.ToString());
                equipmentPagerData.SelectMethod = "LoadAllEquipmentFLoaction";
                equipmentPagerData.ServicePath = webServicePath;
                equipmentPagerData.SiteID = siteID;
                equipmentPagerData.UserID = userID;
                equipmentPagerData.AccessLevelID = accessLevelID;
                equipmentPagerData.LoadControlID = btnSaveMaintInfo.ClientID;

                if (accessType == AccessType.FULL_ACCESS || (accessType == AccessType.EDIT_ONLY && maintScheduleID > 0))
                {
                    btnSaveMaintInfo.Attributes.Add("onclick", "javascript:AddNewMaintenance();return false;");
                    btnSaveWorkInstruction.Attributes.Add("onclick", "javascript:SaveWorkInstructionInfo();return false;");
                    btnSaveSparePartInfo.Attributes.Add("onclick", "javascript:SaveSparePartInformation();return false;");
                }
                else
                {
                    btnSaveMaintInfo.Attributes.Add("disabled", "disabled");
                    btnSaveWorkInstruction.Attributes.Add("disabled", "disabled");
                    btnSaveSparePartInfo.Attributes.Add("disabled", "disabled");
                }

                if (maintReleaseAccess == AccessType.FULL_ACCESS)
                {
                    btnActivateSchedule.Attributes.Add("onclick", "javascript:ActivateScheduleConfirm();return false;");
                }
                else
                {
                    btnActivateSchedule.Attributes.Add("disabled", "disabled");
                }

                if (accessType == AccessType.FULL_ACCESS)
                {
                    btnAddMaintType.Attributes.Add("onclick", "javascript:InsertOrUpdateMaintType(" + (new JavaScriptSerializer()).Serialize(0) + ");return false;");
                }
                else
                {
                    btnAddMaintType.Attributes.Add("disabled", "disabled");
                }

                thMaintTypes.Attributes.Add("onclick", "javascript:SortMaintTypesTabs('" + thMaintTypes.ClientID + "','MasterDataName');");
                thFLocation.Attributes.Add("onclick", "javascript:SortEquipmentTabs('" + thFLocation.ClientID + "','LocationName');");
                thEquipment.Attributes.Add("onclick", "javascript:SortEquipmentTabs('" + thEquipment.ClientID + "','EquipmentName');");
                thEquipmentType.Attributes.Add("onclick", "javascript:SortEquipmentTabs('" + thEquipmentType.ClientID + "','EquipmentType');");

                ScriptManager.RegisterStartupScript(this, this.GetType(), "InitMaintenanceScheduleInfo", "javascript:InitMaintenanceScheduleInfo(" + (new JavaScriptSerializer()).Serialize(maintTypePagerData)+"," + (new JavaScriptSerializer()).Serialize(equipmentPagerData) + ",'" + basePath + "','" + datePickerFormat + "','" + dateTimeFormat.DateFormat + "','" + dateTimeFormat.TimeFormat + "','" + defaultImage + "','" + scheduleType + "'," + maintScheduleID+",'"+ imagePath+"','"+ taskDocumentPath+"','"+ uploaderPath+"','"+ accessType + "','" + maintScheduleAttachmentPath + "',"+ notificationID +",'"+ workOrderID + "','"+ isFromManageNotify + "','"+ maintReleaseAccess + "');", true);
            }
        }

        private AccessType ValidateUserPrivileges(int siteID, int accessLevelID)
        {
            AccessType access = AccessType.NO_ACCESS;
            if(scheduleType=="S")
                access = CommonBLL.ValidateUserPrivileges(siteID, this.CurrentUser.SiteID, this.CurrentUser.UserID, accessLevelID, Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.ManagePreventiveMaintenanceSchedule));
            else if(scheduleType == "W")
                access = CommonBLL.ValidateUserPrivileges(siteID, this.CurrentUser.SiteID, this.CurrentUser.UserID, accessLevelID, Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.ManageWorkOrder));
                                    
            if (access == AccessType.NO_ACCESS)
            {
                Response.Redirect(ConfigurationManager.AppSettings["NoAccessPage"].ToString());
            }

            maintReleaseAccess = CommonBLL.ValidateUserPrivileges(siteID, this.CurrentUser.SiteID, this.CurrentUser.UserID, accessLevelID, Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Manage_Release));

            maintTypeAccess = CommonBLL.ValidateUserPrivileges(siteID, this.CurrentUser.SiteID, this.CurrentUser.UserID, accessLevelID, Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_Maintenance_Type));
            return access;
        }
    }
}