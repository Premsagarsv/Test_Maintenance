﻿using System;
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
    public partial class AddDocumentsAndImages : iPAS_Base.BasePage
    {
        protected override void OnPreInit(EventArgs e)
        {
            this.MasterPageFile = ConfigurationManager.AppSettings["VegamiFrameMasterPage"].ToString();
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                #region Script Resource
                ScriptReference scriptReference = new ScriptReference();
                string[] cultures = ConfigurationManager.AppSettings["SupportLanguages"].ToString().Split(',');
                scriptReference.Path = ConfigurationManager.AppSettings["MaintJsPath"].ToString().TrimEnd('/') + "/ScriptResources/DocumentsAndImagesInfoScriptResource.js";
                scriptReference.ResourceUICultures = CommonBLL.GetCultures(cultures, scriptReference.Path);
                ScriptManager.Scripts.Add(scriptReference);
                #endregion

                int siteID = CommonBLL.ValidateSiteID(Request);

                if (siteID == 0)
                {
                    Response.Redirect(ConfigurationManager.AppSettings["NoAccessPage"].ToString());
                }

                int userID = this.CurrentUser.UserID;
                int accessLevelID = CommonBLL.GetAccessLevelID(this.CurrentUser.AccessLevel);

                #region Page Permission Access
                List<int> pageIDList = new List<int>();
                pageIDList.Add(Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_Equipments));
                pageIDList.Add(Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_Equipment_Models));
                #endregion

                int fLocationID = 0;
                int equipmentID = 0;
                string type = string.Empty;
                bool hasFullAccess = false;

                //Validate user permission
                 ValidateUserPrivileges(siteID, accessLevelID, pageIDList);

                if (Request.QueryString["flid"] != null && Request.QueryString["flid"].Trim().Length > 0)
                {
                    fLocationID = Convert.ToInt32(Request.QueryString["flid"].Trim());
                }

                if (Request.QueryString["eid"] != null && Request.QueryString["eid"].Trim().Length > 0)
                {
                    equipmentID = Convert.ToInt32(Request.QueryString["eid"].Trim());
                }

                if (Request.QueryString["hasFullAccess"] != null && Request.QueryString["hasFullAccess"].Trim().Length > 0)
                {
                    hasFullAccess = Convert.ToString(Request.QueryString["hasFullAccess"].Trim().ToUpper()) == "TRUE" ? true : false;
                }

                if (Request.QueryString["type"] != null && Request.QueryString["type"].Trim().Length > 0)
                {
                    type = Convert.ToString(Request.QueryString["type"].Trim());
                }

                string basePath = ConfigurationManager.AppSettings["MaintBasePath"].ToString().TrimEnd('/');
                string webServicePath = ConfigurationManager.AppSettings["MaintWebServicePath"].Trim();
                string uploaderPath = ConfigurationManager.AppSettings["uploaderPath"].ToString().Trim('/');
                string defaultUploadIconPath = ConfigurationManager.AppSettings["MaintImagePath"].TrimEnd('/') + "/Styles/Images/";
                string maintDocumentLocation = ConfigurationManager.AppSettings["MaintenanceDocLocation"].ToString().Trim('/');

                BasicParam basicParam = new BasicParam();
                basicParam.SiteID = siteID;
                basicParam.UserID = userID;
                basicParam.AccessLevelID = accessLevelID;
                basicParam.LanguageCode = this.CurrentUser.LanguageCode;

                bool fLocationBtnLinkAccess = CommonBLL.ValidateUserPrivileges(siteID, this.CurrentUser.SiteID, this.CurrentUser.UserID, accessLevelID, Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_Functional_Loc)) != AccessType.NO_ACCESS? true:false;

                ScriptManager.RegisterStartupScript(this, this.GetType(), "LoadDocumentAndImagesBasicInfo", "javascript:LoadDocumentAndImagesBasicInfo(" + (new JavaScriptSerializer()).Serialize(basicParam) + ",'" + hasFullAccess + "','" + type + "','" + equipmentID + "','" + basePath + "','" + webServicePath + "','" + uploaderPath + "','" + defaultUploadIconPath + "','"+ maintDocumentLocation + "','" + fLocationID + "','"+fLocationBtnLinkAccess+"');", true);
            }
        }

        private bool ValidateUserPrivileges(int siteID, int accessLevelID, List<int> pageIDList)
        {
            List<ipas_UserService.UserPermissions> userPermissionList = CommonBLL.ValidateUserPrivileges(siteID, this.CurrentUser.SiteID, this.CurrentUser.UserID, accessLevelID, pageIDList);
            userPermissionList = userPermissionList.OrderBy(x => x.PageIDNumber).ToList();
            bool isEnablePageAccess = false;

            if (userPermissionList.Count > 0)
            {
                foreach (ipas_UserService.UserPermissions userPermission in userPermissionList)
                {
                    if (Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_Equipments) == userPermission.PageIDNumber)
                    {
                        if (userPermission.AccessValue != "0")
                        { isEnablePageAccess = true; }
                    }
                    if (Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_Equipment_Models) == userPermission.PageIDNumber)
                    {
                        if (userPermission.AccessValue != "0")
                        { isEnablePageAccess = true; }
                    }
                }
            }
            else
            {
                Response.Redirect(ConfigurationManager.AppSettings["NoAccessPage"].ToString());
            }

            if (isEnablePageAccess == false)
            {
                Response.Redirect(ConfigurationManager.AppSettings["NoAccessPage"].ToString());
            }

            return isEnablePageAccess;
        }
    }
}