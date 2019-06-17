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
    public partial class CreateWorkGroup : iPAS_Base.BasePage
    {
        int currentPage = 0;
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
                scriptReference.Path = ConfigurationManager.AppSettings["MaintJsPath"].ToString().TrimEnd('/') + "/ScriptResources/WorkGroupInfoScriptResource.js";
                string[] cultures = ConfigurationManager.AppSettings["SupportLanguages"].ToString().Split(',');
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

                ValidateUserPrivileges(siteID, accessLevelID);

                string basePath = ConfigurationManager.AppSettings["MaintBasePath"].ToString().TrimEnd('/');
                string webServicePath = ConfigurationManager.AppSettings["MaintWebServicePath"].Trim();
                string imagePath = ConfigurationManager.AppSettings["MaintImagePath"].TrimEnd('/') + "/Styles/Images";

                UserControls.PagerData workGroupPagerData = new UserControls.PagerData();
                workGroupPagerData.PageIndex = 0;
                workGroupPagerData.PageSize = int.Parse(hdnWorkGroupPageSize.Value.ToString());
                workGroupPagerData.CurrentPage = currentPage;
                workGroupPagerData.SelectMethod = "LoadWorkGroupList";
                workGroupPagerData.ServicePath = webServicePath;
                workGroupPagerData.SiteID = siteID;
                workGroupPagerData.UserID = userID;
                workGroupPagerData.LoadControlID = btnUploadExcel.ClientID;
                workGroupPagerData.AccessLevelID = accessLevelID;
                workGroupPagerData.PageAccessRights = PageAccessRights.ToString();

                if (PageAccessRights.ToString() == AccessType.FULL_ACCESS.ToString())
                    uploadFile.Attributes.Add("onchange", "javascript:UploadWorkGroupInfo();return false;");
                else
                    btnUploadExcel.Attributes.Add("disabled", "disabled");

                sortWorkGroup.Attributes.Add("onclick", "javascript:SortByWorkGroupName('" + sortWorkGroup.ClientID + "','MasterDataName');");

                Page.ClientScript.RegisterStartupScript(GetType(), "LoadWorkGroupInfo", "LoadWorkGroupInfo(" + (new JavaScriptSerializer()).Serialize(workGroupPagerData) + ",'" + basePath + "','" + imagePath + "');", true);
            }
        }

        public string PageAccessRights
        {
            get
            {
                return hdnAccessRights.Value.ToString();
            }
            set
            {
                hdnAccessRights.Value = value;
            }
        }

        private void ValidateUserPrivileges(int siteID, int accessLevelID)
        {    
            AccessType access = CommonBLL.ValidateUserPrivileges(siteID, this.CurrentUser.SiteID, this.CurrentUser.UserID, accessLevelID, Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_WorkGroup));
            if (access == AccessType.NO_ACCESS)
            {
                Response.Redirect(ConfigurationManager.AppSettings["NoAccessPage"].ToString());
            }
            else
            {
                this.PageAccessRights = access.ToString();
            }           
        }
    }
}