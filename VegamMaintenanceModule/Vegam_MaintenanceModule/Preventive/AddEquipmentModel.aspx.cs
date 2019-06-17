using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;
using Vegam_MaintenanceModule.ipas_CompanyService;

namespace Vegam_MaintenanceModule.Preventive
{
    public partial class AddEquipmentModel : iPAS_Base.BasePage
    {
        bool uploadImageAccess = false;
        bool hasFullAccess = false;

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
                scriptReference.Path = ConfigurationManager.AppSettings["MaintJsPath"].ToString().TrimEnd('/') + "/ScriptResources/EquipmentModelScriptResource.js";
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

                int equipmentID = 0;
                if (Request.QueryString["eid"] != null && Request.QueryString["eid"].Trim().Length > 0)
                {
                    equipmentID = Convert.ToInt32(Request.QueryString["eid"].Trim());
                }

                AccessType access = ValidateUserPrivileges(siteID, accessLevelID);
                if (equipmentID == 0 && access == AccessType.FULL_ACCESS)
                {
                    btnAddUpdateEquipmentModel.Attributes.Add("onclick", "javascript:AddUpdateEquipmentModel(true);return false;");
                    uploadImageAccess = true;
                }
                else if (equipmentID > 0 && (access == AccessType.FULL_ACCESS || access == AccessType.EDIT_ONLY))
                {
                    btnAddUpdateEquipmentModel.Attributes.Add("onclick", "javascript:AddUpdateEquipmentModel(false);return false;");
                    uploadImageAccess = true;
                }
                else
                {
                    btnAddUpdateEquipmentModel.Attributes.Add("disabled", "disabled");
                    uploadImageAccess = false;
                }

                string basePath = ConfigurationManager.AppSettings["MaintBasePath"].ToString().TrimEnd('/');
                string webServicePath = ConfigurationManager.AppSettings["MaintWebServicePath"];
                string uploaderPath = ConfigurationManager.AppSettings["uploaderPath"].ToString().Trim('/');
                string equipmentModelImgPath = ConfigurationManager.AppSettings["EquipmentModelImagePath"].ToString().Trim('/') + "/" + siteID + "/" + "Thumbnail";
                string imagePath = ConfigurationManager.AppSettings["MaintImagePath"].TrimEnd('/') + "/Styles/Images/Measuring_Point.png";

                BasicParam basicParam = new BasicParam();
                basicParam.SiteID = siteID;
                basicParam.UserID = userID;
                basicParam.AccessLevelID = accessLevelID;
                basicParam.LanguageCode = this.CurrentUser.LanguageCode;

                UserControls.PagerData pagerData = new UserControls.PagerData();
                pagerData.PageIndex = 0;
                pagerData.PageSize = int.Parse(hdnModelPageSize.Value.ToString());
                pagerData.SelectMethod = "LoadEquipmentModelList";
                pagerData.ServicePath = webServicePath;
                pagerData.SiteID = siteID;
                pagerData.UserID = userID;
                pagerData.AccessLevelID = accessLevelID;
                pagerData.LoadControlID = btnAddUpdateEquipmentModel.ClientID;
                pagerData.PageAccessRights = access.ToString();
 
                //using pager for displaying maintenance master data in configure maintenance types modal popup 
                UserControls.PagerData maintTypePagerData = new UserControls.PagerData();
                maintTypePagerData.PageIndex = 0;
                maintTypePagerData.PageSize = int.Parse(hdnMasterPageSize.Value.ToString());
                maintTypePagerData.SelectMethod = "LoadMaintTypesInfo";
                maintTypePagerData.ServicePath = webServicePath;
                maintTypePagerData.SiteID = siteID;
                maintTypePagerData.UserID = userID;
                maintTypePagerData.AccessLevelID = accessLevelID;
                maintTypePagerData.LoadControlID = btnAddUpdateEquipmentModel.ClientID;
                maintTypePagerData.PageAccessRights = access.ToString();

                thMaintTypes.Attributes.Add("onclick", "javascript:SortMaintTypesTabs('" + thMaintTypes.ClientID + "','MasterDataName');");
                sortEquipmentModel.Attributes.Add("onclick", "javascript:SortByEquipmentModelName('" + sortEquipmentModel.ClientID + "','EquipmentModelName');");
                ScriptManager.RegisterStartupScript(this, this.GetType(), "EquipmentModelLoadInfo", "javascript:EquipmentModelLoadInfo(" + (new JavaScriptSerializer()).Serialize(basicParam) + "," + (new JavaScriptSerializer()).Serialize(pagerData) + "," + (new JavaScriptSerializer()).Serialize(maintTypePagerData) + ",'" + basePath + "','" + webServicePath + "','" + imagePath + "','" + uploaderPath + "','" + uploadImageAccess + "'," + equipmentID + ",'" + equipmentModelImgPath + "','" + hasFullAccess + "');", true);
            }

        }

        private AccessType ValidateUserPrivileges(int siteID, int accessLevelID)
        {
            AccessType access = AccessType.NO_ACCESS;
            access = CommonBLL.ValidateUserPrivileges(siteID, this.CurrentUser.SiteID, this.CurrentUser.UserID, accessLevelID, Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_Equipment_Models));
            if (access == AccessType.NO_ACCESS)
            {
                Response.Redirect(ConfigurationManager.AppSettings["NoAccessPage"].ToString());
            }
            else if (access == AccessType.FULL_ACCESS)
            {
                hasFullAccess = true;
            }

            #region ValidateUserPrivileges for navigation button links

            if (CommonBLL.ValidateUserPrivileges(siteID, this.CurrentUser.SiteID, this.CurrentUser.UserID, accessLevelID, Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_Measuring_Point)) == AccessType.NO_ACCESS)
            {
                buttonlnkMeasuringPoint.Visible = false;
            }
            #endregion

            return access;
        }
    }
}