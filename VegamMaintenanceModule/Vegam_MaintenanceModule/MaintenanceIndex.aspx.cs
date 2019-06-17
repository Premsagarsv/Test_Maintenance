using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Vegam_MaintenanceModule.ipas_UserService;

namespace Vegam_MaintenanceModule
{
    public partial class MaintenanceIndex1 : iPAS_Base.BasePage
    {
        protected override void OnPreInit(EventArgs e)
        {
            this.MasterPageFile = ConfigurationManager.AppSettings["MaintVegamMasterPage"].ToString();
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            int siteID = 0;
            siteID = CommonBLL.ValidateSiteID(Request);
            if (siteID == 0)
            {
                Response.Redirect(ConfigurationManager.AppSettings["NoAccessPage"].ToString());
            }
            int userID = this.CurrentUser.UserID;

            #region Link Visible Setting

            lnkMaintenanceMasterData.Visible = false;
            lnkMaintenanceSchedule.Visible = false;
            lnkmaintenanceWorkOrder.Visible = false;
            lnkMeasurementDocument.Visible = false;
            lnkWorkOrderCalendar.Visible = false;
            lnkEquipment.Visible = false;
            lnkManageNotification.Visible = false;
            lnkMaintReports.Visible = false;

            #endregion

            string maintBasePath = ConfigurationManager.AppSettings["MaintBasePath"].TrimEnd('/').ToString();
            lnkMaintenanceMasterData.HRef = maintBasePath + "/MaintenanceMasterIndex.aspx?id=" + siteID;
            lnkWorkOrderCalendar.HRef = maintBasePath + "/Preventive/WorkOrderCalendar.aspx?id=" + siteID;
            lnkWorkOrderCalendar.HRef = maintBasePath + "/Preventive/WorkOrderCalendar.aspx?id=" + siteID;
            lnkMaintenanceSchedule.HRef = maintBasePath + "/Preventive/ManageSchedule.aspx?id=" + siteID;
            lnkmaintenanceWorkOrder.HRef = maintBasePath + "/Preventive/ManageWorkOrder.aspx?id=" + siteID;
            lnkMeasurementDocument.HRef = maintBasePath + "/Preventive/ManageMeasurementDocument.aspx?id=" + siteID;
            lnkManageNotification.HRef = maintBasePath + "/Preventive/ManageNotification.aspx?id=" + siteID;
            lnkEquipment.HRef = maintBasePath + "/Preventive/EquipmentList.aspx?id=" + siteID + "&isviewequipment=true";

            string reportBasePath = ConfigurationManager.AppSettings["KPIReportBasePath"].TrimEnd('/').ToString();
            lnkMaintReports.HRef = reportBasePath + "/Report/KPIReport.aspx?id=" + siteID + "&userType=4";//maint_user
            #region Permission
            int pageAccessCount = 0;

            UserPermissions[] userPermissionMasterDataList = BLL.UserBLL.GetAllUserAssignedPermissionsWithType(userID, siteID, TypeMasterData.MasterData);
            foreach (UserPermissions userPermission in userPermissionMasterDataList)
            {
                if (Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_Equipments) == userPermission.PageIDNumber
                     || Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_Equipment_Models) == userPermission.PageIDNumber
                     || Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_Measuring_Point) == userPermission.PageIDNumber
                     || Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_Functional_Loc) == userPermission.PageIDNumber
                     || Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.configureTaskGroup) == userPermission.PageIDNumber
                     || Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.configureTools) == userPermission.PageIDNumber
                     || Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_WorkGroup) == userPermission.PageIDNumber)
                {
                    if (CommonBLL.ValidateUserPrivileges(userPermission.AccessValue) != "0")
                    {
                        lnkMaintenanceMasterData.Visible = true;
                        pageAccessCount++;
                    }
                }
            }

                UserPermissions[] userPermissionList = BLL.UserBLL.GetAllUserAssignedPermissionsWithType(userID, siteID, TypeMasterData.Maintenance);
            foreach (UserPermissions userPermission in userPermissionList)
            {
              if (Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.ManagePreventiveMaintenanceSchedule) == userPermission.PageIDNumber)
                {
                    if (CommonBLL.ValidateUserPrivileges(userPermission.AccessValue) != "0")
                    {
                        lnkMaintenanceSchedule.Visible = true;
                        pageAccessCount++;
                    }
                }
                else if (Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.ManageWorkOrder) == userPermission.PageIDNumber)
                {
                    if (CommonBLL.ValidateUserPrivileges(userPermission.AccessValue) != "0")
                    {
                        lnkmaintenanceWorkOrder.Visible = true;
                        pageAccessCount++;
                    }
                }
                else if (Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.ManageChecklist) == userPermission.PageIDNumber)
                {
                    if (CommonBLL.ValidateUserPrivileges(userPermission.AccessValue) != "0")
                    {
                        lnkMeasurementDocument.Visible = true;
                        pageAccessCount++;
                    }
                }
                else if (Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.ManageNotification) == userPermission.PageIDNumber)
                {
                    if (CommonBLL.ValidateUserPrivileges(userPermission.AccessValue) != "0")
                    {
                        lnkManageNotification.Visible = true;
                        pageAccessCount++;
                    }
                }
                else if (Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.WorkOrderCalendar) == userPermission.PageIDNumber)
                {
                    if (CommonBLL.ValidateUserPrivileges(userPermission.AccessValue) != "0")
                    {
                        lnkWorkOrderCalendar.Visible = true;
                        pageAccessCount++;
                    }
                }
                else if (Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.ViewEquipment) == userPermission.PageIDNumber)
                {
                    if (CommonBLL.ValidateUserPrivileges(userPermission.AccessValue) != "0")
                    {
                        lnkEquipment.Visible = true;
                        pageAccessCount++;
                    }
                }
                else if (Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.MaintenanceReports) == userPermission.PageIDNumber)
                {
                    if (CommonBLL.ValidateUserPrivileges(userPermission.AccessValue) != "0")
                    {
                        lnkMaintReports.Visible = true;
                        pageAccessCount++;
                    }
                }
            }
            if (pageAccessCount == 0)
                divNoAccessRight.Attributes.Add("class", "col-md-7 col-md-offset-2 well access-n-box show");

            #endregion
        }
    }
}