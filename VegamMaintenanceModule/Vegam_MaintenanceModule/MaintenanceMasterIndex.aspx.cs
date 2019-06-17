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
    public partial class MaintenanceMasterIndex : iPAS_Base.BasePage
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

            lnkMaintenanceInfo.Visible = false;
            lnkTaskGroup.Visible = false;
            lnkWorkGroup.Visible = false;
            lnkToolsInfo.Visible = false;
            lnkSpareParts.Visible = false;
            lnkConfigureEmail.Visible = false;
            #endregion

            string maintBasePath = ConfigurationManager.AppSettings["MaintBasePath"].TrimEnd('/').ToString();
            string coreBasePath = ConfigurationManager.AppSettings["coreBasePath"].TrimEnd('/').ToString();
            
            lnkMaintenanceInfo.HRef = maintBasePath + "/Preventive/MaintenanceInfo.aspx?id=" + siteID;
            lnkTaskGroup.HRef = maintBasePath + "/Preventive/TaskGroupList.aspx?id=" + siteID;
            lnkWorkGroup.HRef = maintBasePath + "/Preventive/CreateWorkGroup.aspx?id=" + siteID;
            lnkToolsInfo.HRef = maintBasePath + "/Preventive/ToolsInfo.aspx?id=" + siteID;
            lnkSpareParts.HRef = maintBasePath + "/Preventive/ConfigureSpareParts.aspx?id=" + siteID;
            lnkConfigureEmail.HRef= coreBasePath + "/Plant/ConfigureEmail.aspx?id=" + siteID + "&isMaintenance=true";

            #region Permission
            int pageAccessCount = 0;

            UserPermissions[] userPermissionList = BLL.UserBLL.GetAllUserAssignedPermissionsWithType(userID, siteID, TypeMasterData.MasterData);
            foreach (UserPermissions userPermission in userPermissionList)
            {
                if (Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_Equipments) == userPermission.PageIDNumber
                        || Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_Equipment_Models) == userPermission.PageIDNumber
                        || Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_Measuring_Point) == userPermission.PageIDNumber
                        || Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_Functional_Loc) == userPermission.PageIDNumber)
                {
                    if (CommonBLL.ValidateUserPrivileges(userPermission.AccessValue) != "0")
                    {
                        lnkMaintenanceInfo.Visible = true;
                        pageAccessCount++;
                    }
                }
                else if (Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.configureTaskGroup) == userPermission.PageIDNumber)
                {
                    if (CommonBLL.ValidateUserPrivileges(userPermission.AccessValue) != "0")
                    {
                        lnkTaskGroup.Visible = true;
                        pageAccessCount++;
                    }
                }
                else if (Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_WorkGroup) == userPermission.PageIDNumber)
                {
                    if (CommonBLL.ValidateUserPrivileges(userPermission.AccessValue) != "0")
                    {
                        lnkWorkGroup.Visible = true;
                        pageAccessCount++;
                    }
                }
                else if (Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.configureTools) == userPermission.PageIDNumber)
                {
                    if (CommonBLL.ValidateUserPrivileges(userPermission.AccessValue) != "0")
                    {
                        lnkToolsInfo.Visible = true;
                        pageAccessCount++;
                    }
                }
                else if (Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_SpareParts) == userPermission.PageIDNumber)
                {
                    if (CommonBLL.ValidateUserPrivileges(userPermission.AccessValue) != "0")
                    {
                        lnkSpareParts.Visible = true;
                        pageAccessCount++;
                    }
                }
                else if (Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_EmailTemplates) == userPermission.PageIDNumber)
                {
                    if (CommonBLL.ValidateUserPrivileges(userPermission.AccessValue) != "0")
                    {
                        lnkConfigureEmail.Visible = true;
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