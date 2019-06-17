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
    public partial class FunctionalLocationInfo : iPAS_Base.BasePage
    {
        int userID;
        int siteID;
        int accessLevelID = 0;

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
                scriptReference.Path = ConfigurationManager.AppSettings["MaintBasePath"].ToString().TrimEnd('/') + "/ScriptResources/MaintenanceInfoScriptResource.js";
                string[] cultures = ConfigurationManager.AppSettings["SupportLanguages"].ToString().Split(',');
                scriptReference.ResourceUICultures = CommonBLL.GetCultures(cultures, scriptReference.Path);
                scriptManager1.Scripts.Add(scriptReference);

                #endregion

                //Below values must be updated,it will effect full page
                userID = this.CurrentUser.UserID;
                siteID = CommonBLL.ValidateSiteID(Request);
                accessLevelID = CommonBLL.GetAccessLevelID(this.CurrentUser.AccessLevel);

                if (siteID == 0)
                {
                    Response.Redirect(ConfigurationManager.AppSettings["NoAccessPage"].ToString());
                }

                //validate user privileges
                #region Feature Info
                List<int> pageIDList = new List<int>();
                pageIDList.Add(Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_Functional_Loc));
                pageIDList.Add(Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_Equipment_Models));
                pageIDList.Add(Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_Equipments));
                pageIDList.Add(Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_Measuring_Point));
                #endregion

                List<Tuple<string, bool>> manageFeatureInfoList = ValidateManageUserPrivileges(siteID, accessLevelID, pageIDList);

                string MaintBasePath = ConfigurationManager.AppSettings["MaintBasePath"].ToString().TrimEnd('/');
                string coreBasePath = ConfigurationManager.AppSettings["coreBasePath"].ToString().TrimEnd('/');
                string maintWebServicePath = ConfigurationManager.AppSettings["MaintWebServicePath"].ToString().TrimEnd('/');

                Vegam_MaintenanceService.BasicParam basicParam = new Vegam_MaintenanceService.BasicParam();
                basicParam.SiteID = siteID;
                basicParam.UserID = userID;
                basicParam.AccessLevelID = accessLevelID;

                ScriptManager.RegisterStartupScript(this, this.GetType(), "LoadMaintenanceInfo", "javascript:LoadMaintenanceInfo(" + (new JavaScriptSerializer()).Serialize(basicParam) + "," + (new JavaScriptSerializer()).Serialize(manageFeatureInfoList) + ",'" + MaintBasePath + "','" + coreBasePath + "','" + maintWebServicePath + "');", true);
            }
        }

        private List<Tuple<string, bool>> ValidateManageUserPrivileges(int siteID, int accessLevelID, List<int> pageIDList)
        {
            List<Tuple<string, bool>> manageFeatureInfoList = new List<Tuple<string, bool>>();
            List<ipas_UserService.UserPermissions> userPermissionList = CommonBLL.ValidateUserPrivileges(siteID, this.CurrentUser.SiteID, this.CurrentUser.UserID, accessLevelID, pageIDList);
            userPermissionList = userPermissionList.OrderBy(x => x.PageIDNumber).ToList();

            if (userPermissionList.Count > 0)
            {
                foreach (ipas_UserService.UserPermissions userPermission in userPermissionList)
                {
                    bool isEnableFeature = false;
                    if (Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_Functional_Loc) == userPermission.PageIDNumber)
                    {
                        if (userPermission.AccessValue != "0")
                        { isEnableFeature = true; }
                        manageFeatureInfoList.Add(new Tuple<string, bool>(Language_Resources.MaintenanceFeatures.functionalLocation, isEnableFeature));
                    }
                    else if (Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_Equipment_Models) == userPermission.PageIDNumber)
                    {
                        if (userPermission.AccessValue != "0")
                        { isEnableFeature = true; }
                        manageFeatureInfoList.Add(new Tuple<string, bool>(Language_Resources.MaintenanceFeatures.equipmentModels, isEnableFeature));

                    }
                    else if (Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_Equipments) == userPermission.PageIDNumber)
                    {
                        if (userPermission.AccessValue != "0")
                        { isEnableFeature = true; }
                        manageFeatureInfoList.Add(new Tuple<string, bool>(Language_Resources.MaintenanceFeatures.equipments, isEnableFeature));
                    }
                    else if (Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_Measuring_Point) == userPermission.PageIDNumber)
                    {
                        if (userPermission.AccessValue != "0")
                        { isEnableFeature = true; }
                        manageFeatureInfoList.Add(new Tuple<string, bool>(Language_Resources.MaintenanceFeatures.measuringPoints, isEnableFeature));
                    }
                }
            }
            else
            {
                Response.Redirect(ConfigurationManager.AppSettings["NoAccessPage"].ToString());
            }

            return manageFeatureInfoList;
        }

        //private void ValidateUserPrivileges(int siteID, int accessLevelID)
        //{
        //    AccessType access = AccessType.NO_ACCESS;
        //    access = CommonBLL.ValidateUserPrivileges(siteID, this.CurrentUser.SiteID, this.CurrentUser.UserID, accessLevelID, Convert.ToInt32(Langugage_Resources.MaintenancePageID_Resource.Configure_Functional_Loc));

        //    if (access == AccessType.NO_ACCESS)
        //    {
        //        Response.Redirect(ConfigurationManager.AppSettings["NoAccessPage"].ToString());
        //    }
        //}
    }
}