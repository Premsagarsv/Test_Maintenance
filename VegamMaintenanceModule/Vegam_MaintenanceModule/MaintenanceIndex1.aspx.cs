using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Vegam_MaintenanceModule.BLL;
using Vegam_MaintenanceModule.ipas_SiteService;
using Vegam_MaintenanceModule.ipas_UserService;

namespace Vegam_MaintenanceModule
{
    public partial class MaintenanceIndex : iPAS_Base.BasePage
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

            lnkMaintenanceIndex.Visible = false;
            lnkManufactureIndex.Visible = false;

            #endregion

            string maintBasePath = ConfigurationManager.AppSettings["MaintBasePath"].TrimEnd('/').ToString();
            lnkMaintenanceIndex.HRef = maintBasePath + "/MaintenanceMasterIndex.aspx?id=" + siteID;
            lnkManufactureIndex.HRef = maintBasePath + "/ManufactureIndex.aspx?id=" + siteID;


            #region Permission

            int pageAccessCount = 0;
            PlantSettings plantSettings = SiteBLL.GetPlantSettings(siteID);

            if (plantSettings.EnableMaintenance)
            {
                UserPermissions[] userPermissionList = BLL.UserBLL.GetAllUserAssignedPermissionsWithType(userID, siteID, TypeMasterData.MasterData);
                foreach (UserPermissions userPermission in userPermissionList)
                {

                    if (Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_Equipments) == userPermission.PageIDNumber
                        || Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_Equipment_Models) == userPermission.PageIDNumber
                        || Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_Measuring_Point) == userPermission.PageIDNumber
                        || Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_Functional_Loc) == userPermission.PageIDNumber
                        || Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.configureTaskGroup) == userPermission.PageIDNumber
                        || Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_WorkGroup) == userPermission.PageIDNumber)
                    {
                        if (CommonBLL.ValidateUserPrivileges(userPermission.AccessValue) != "0")
                        {
                            lnkMaintenanceIndex.Visible = true;
                            pageAccessCount++;
                        }
                    }

                }
                userPermissionList = null;
                userPermissionList = BLL.UserBLL.GetAllUserAssignedPermissionsWithType(userID, siteID, TypeMasterData.Manufacture);
                foreach (UserPermissions userPermission in userPermissionList)
                {
                    if (Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.ManagePreventiveMaintenanceSchedule) == userPermission.PageIDNumber ||
                        Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.ManageWorkOrder) == userPermission.PageIDNumber ||
                        Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.ManageChecklist) == userPermission.PageIDNumber ||
                        Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.WorkOrderCalendar) == userPermission.PageIDNumber)
                    {
                        if (CommonBLL.ValidateUserPrivileges(userPermission.AccessValue) != "0")
                        {
                            lnkManufactureIndex.Visible = true;
                            pageAccessCount++;
                            break;
                        }
                    }

                }
            }

            if (pageAccessCount == 0)
                divNoAccessRight.Attributes.Add("class", "col-md-7 col-md-offset-2 well access-n-box show");

            #endregion

        }
    }
}