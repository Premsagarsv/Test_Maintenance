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
    public partial class FunctionalLocationList : iPAS_Base.BasePage
    {
        bool hasEditAccess = false;
        bool hasDeleteAccess = false;

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
                scriptReference.Path = ConfigurationManager.AppSettings["MaintJsPath"].ToString().TrimEnd('/') + "/ScriptResources/FunctionalLocationScriptResource.js";
                string[] cultures = ConfigurationManager.AppSettings["SupportLanguages"].ToString().Split(',');
                scriptReference.ResourceUICultures = CommonBLL.GetCultures(cultures, scriptReference.Path);
                scriptManager.Scripts.Add(scriptReference);

                #endregion

                int siteID = CommonBLL.ValidateSiteID(Request);
                if (siteID == 0)
                {
                    Response.Redirect(ConfigurationManager.AppSettings["NoAccessPage"].ToString());
                }

                string filterLocationIds = string.Empty;
                if (Request.QueryString["fids"] != null && Request.QueryString["fids"].Trim().Length > 0)
                {
                    filterLocationIds = Request.QueryString["fids"].Trim();
                }

                int userID = this.CurrentUser.UserID;
                int accessLevelID = CommonBLL.GetAccessLevelID(this.CurrentUser.AccessLevel);

                AccessType accessType = ValidateUserPrivileges(siteID, accessLevelID);

                string basePath = ConfigurationManager.AppSettings["MaintBasePath"].ToString().TrimEnd('/');
                string webServicePath = ConfigurationManager.AppSettings["MaintWebServicePath"].Trim();
                string imgFunctionalLocProfilePath = ConfigurationManager.AppSettings["MaintImagePath"].TrimEnd('/') + "/Styles/Images/FLocation.png";
                string uploaderPath = ConfigurationManager.AppSettings["uploaderPath"].ToString().Trim('/');

                UserControls.PagerData pagerData = new UserControls.PagerData();
                pagerData.PageIndex = 0;
                pagerData.PageSize = int.Parse(hdnPageSize.Value.ToString());
                pagerData.SelectMethod = "LoadFunctionalLocationsInfo";
                pagerData.ServicePath = webServicePath;
                pagerData.SiteID = siteID;
                pagerData.UserID = userID;
                pagerData.AccessLevelID = accessLevelID;
                pagerData.LoadControlID = btnUploadExcel.ClientID;
                pagerData.PageAccessRights = accessType.ToString();

                btnFLocationName.Attributes.Add("onclick", "javascript:SortTabs('" + btnFLocationName.ClientID + "','FunctionalLoc');");
                btnUpdateOn.Attributes.Add("onclick", "javascript:SortTabs('" + btnUpdateOn.ClientID + "','UpdateOn');");

                if (accessType == AccessType.FULL_ACCESS)
                {
                    btnAddNewFunctionalLocation.Attributes.Add("onclick", "javascript:AddUpdateNewFunctionalLoaction(" + (new JavaScriptSerializer()).Serialize(0) + ");return false;");
                    uploadFile.Attributes.Add("onchange", "javascript:UploadFunctionalLocationInfo();return false;");
                }
                else
                {
                    btnAddNewFunctionalLocation.Attributes.Add("disabled", "disabled");
                    btnUploadExcel.Attributes.Add("disabled", "disabled");
                }

                ScriptManager.RegisterStartupScript(this, this.GetType(), "InitFunctionalLocationInfo", "javascript:InitFunctionalLocationInfo(" + (new JavaScriptSerializer()).Serialize(pagerData) + ",'" + basePath + "','" + imgFunctionalLocProfilePath + "','"+ uploaderPath + "','" + hasEditAccess + "','" + hasDeleteAccess + "'," + (new JavaScriptSerializer()).Serialize(filterLocationIds.Split(',')) + ");", true);
            }
        }

        private AccessType ValidateUserPrivileges(int siteID, int accessLevelID)
        {
            AccessType access = AccessType.NO_ACCESS;
            access = CommonBLL.ValidateUserPrivileges(siteID, this.CurrentUser.SiteID, this.CurrentUser.UserID, accessLevelID, Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_Functional_Loc));

            if (access == AccessType.FULL_ACCESS || access == AccessType.EDIT_ONLY)
            {
                hasEditAccess = true;
                if (access == AccessType.FULL_ACCESS)
                {
                    hasDeleteAccess = true;
                }
            }
            else if (access == AccessType.NO_ACCESS)
            {
                Response.Redirect(ConfigurationManager.AppSettings["NoAccessPage"].ToString());
            }


            return access;
        }
    }
}