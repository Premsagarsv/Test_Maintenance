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
    public partial class EquipmentList : iPAS_Base.BasePage
    {
        bool hasEditAccess = false;
        bool hasDeleteAccess = false;
        bool isViewEquipment = false;

        protected override void OnPreInit(EventArgs e)
        {
            if (Request.QueryString["isviewequipment"] != null && Request.QueryString["isviewequipment"].Trim().Length > 0)
            {
                isViewEquipment = Request.QueryString["isviewequipment"].Trim().ToLower()=="true"?true:false;
            }

            if (isViewEquipment)
            {
                this.MasterPageFile = ConfigurationManager.AppSettings["MaintVegamMasterPage"].ToString();
            }
            else
            {
                this.MasterPageFile = ConfigurationManager.AppSettings["VegamiFrameMasterPage"].ToString();
            }
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                #region Script Resource

                ScriptReference scriptReference = new ScriptReference();
                scriptReference.Path = ConfigurationManager.AppSettings["MaintJsPath"].ToString().TrimEnd('/') + "/ScriptResources/EquipmentInfoScriptResource.js";
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

                AccessType accessType = ValidateUserPrivileges(siteID, accessLevelID);
                FilterObject filterObject = new FilterObject();

                if (Request.QueryString["filterTextValue"] != null && Request.QueryString["filterTextValue"].Trim().Length > 0)
                {
                    filterObject.FilterTextValue = Request.QueryString["filterTextValue"].Trim();
                }
                if (Request.QueryString["fids"] != null && Request.QueryString["fids"].Trim().Length > 0)
                {
                    filterObject.FilterLocationIds = Request.QueryString["fids"].Trim();
                }
                if (Request.QueryString["cids"] != null && Request.QueryString["cids"].Trim().Length > 0)
                {
                    filterObject.FilterCategoryIds = Request.QueryString["cids"].Trim();
                }

                string basePath = ConfigurationManager.AppSettings["MaintBasePath"].ToString().TrimEnd('/');
                string webServicePath = ConfigurationManager.AppSettings["MaintWebServicePath"].ToString().TrimEnd('/');
                string imgEquipmentProfilePath = ConfigurationManager.AppSettings["MaintImagePath"].TrimEnd('/') + "/Styles/Images/Equipments.png";
                string uploaderPath = ConfigurationManager.AppSettings["uploaderPath"].ToString().Trim('/');

                UserControls.PagerData pagerData = new UserControls.PagerData();
                pagerData.PageIndex = 0;
                pagerData.PageSize = int.Parse(hdnPageSize.Value.ToString());
                pagerData.SelectMethod = "LoadEquipmentList";
                pagerData.ServicePath = webServicePath;
                pagerData.SiteID = siteID;
                pagerData.UserID = userID;
                pagerData.AccessLevelID = accessLevelID;
                pagerData.LoadControlID = uploadFile.ClientID;
                pagerData.PageAccessRights = accessType.ToString();

                btnEuipmentName.Attributes.Add("onclick", "javascript:SortTabs('" + btnEuipmentName.ClientID + "','EquipmentName');");
                btnUpdateOn.Attributes.Add("onclick", "javascript:SortTabs('" + btnUpdateOn.ClientID + "','UpdateOn');");

                if (accessType == AccessType.FULL_ACCESS)
                {
                    btnAddNewEquipment.Attributes.Add("onclick", "javascript:AddUpdateNewEquipment(" + (new JavaScriptSerializer()).Serialize(0) + ");return false;");
                    uploadFile.Attributes.Add("onchange", "javascript:UploadEquipmentInfo();return false;");
                }
                else
                {
                    btnAddNewEquipment.Attributes.Add("disabled", "disabled");
                    btnUploadExcel.Attributes.Add("disabled", "disabled");
                }

                Page.ClientScript.RegisterStartupScript(GetType(), "LoadEquipmentListBasicInfo", "LoadEquipmentListBasicInfo(" + (new JavaScriptSerializer()).Serialize(pagerData) + ", '" + basePath + "','" + imgEquipmentProfilePath + "','" + hasEditAccess + "','" + hasDeleteAccess + "','" + (new JavaScriptSerializer()).Serialize(filterObject) + "','" + isViewEquipment + "','" + uploaderPath + "');", true);
            }
        }

        private AccessType ValidateUserPrivileges(int siteID, int accessLevelID)
        {
            AccessType access = AccessType.NO_ACCESS;
            if (isViewEquipment)
                access = CommonBLL.ValidateUserPrivileges(siteID, this.CurrentUser.SiteID, this.CurrentUser.UserID, accessLevelID, Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.ViewEquipment));
            else
                access = CommonBLL.ValidateUserPrivileges(siteID, this.CurrentUser.SiteID, this.CurrentUser.UserID, accessLevelID, Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_Equipments));

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