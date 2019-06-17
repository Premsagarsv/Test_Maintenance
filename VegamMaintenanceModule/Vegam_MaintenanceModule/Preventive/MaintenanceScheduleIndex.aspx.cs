using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Vegam_MaintenanceModule.ipas_UserService;

namespace Vegam_MaintenanceModule.Preventive
{
    public partial class MaintenanceScheduleIndex : iPAS_Base.BasePage
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            int siteID = 0;
            siteID = CommonBLL.ValidateSiteID(Request);
            if (siteID == 0)
            {
                Response.Redirect(ConfigurationManager.AppSettings["NoAccessPage"].ToString());
            }
            int userID = this.CurrentUser.UserID;

            string maintBasePath = ConfigurationManager.AppSettings["MaintBasePath"].TrimEnd('/').ToString();

            #region Link Visible Setting

            lnkMaintenanceSchedule.Visible = false;
            lnkmaintenanceWorkOrder.Visible = false;
            lnkMeasurementDocument.Visible = false;
            #endregion

            lnkMaintenanceSchedule.HRef = maintBasePath + "/Preventive/ManageSchedule.aspx?id=" + siteID;
            lnkmaintenanceWorkOrder.HRef = maintBasePath + "/Preventive/ManageWorkOrder.aspx?id=" + siteID;
            lnkMeasurementDocument.HRef = maintBasePath + "/Preventive/ManageMeasurementDocument.aspx?id=" + siteID;

            #region Permission
            int pageAccessCount = 0;

            UserPermissions[] userPermissionList = BLL.UserBLL.GetAllUserAssignedPermissionsWithType(userID, siteID, TypeMasterData.Manufacture);
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
                else if(Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.ManageWorkOrder) == userPermission.PageIDNumber)
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
            }

            if (pageAccessCount == 0)
                divNoAccessRight.Attributes.Add("class", "col-md-7 col-md-offset-2 well access-n-box show");

            #endregion
        }
    }
}