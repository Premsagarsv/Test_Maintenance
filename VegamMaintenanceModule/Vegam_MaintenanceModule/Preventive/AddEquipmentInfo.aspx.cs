using System;
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
    public partial class AddEquipmentInfo : iPAS_Base.BasePage
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
                scriptReference.Path = ConfigurationManager.AppSettings["MaintJsPath"].ToString().TrimEnd('/') + "/ScriptResources/EquipmentInfoScriptResource.js";
                string[] cultures = ConfigurationManager.AppSettings["SupportLanguages"].ToString().Split(',');
                scriptReference.ResourceUICultures = CommonBLL.GetCultures(cultures, scriptReference.Path);
                scriptManager.Scripts.Add(scriptReference);

                scriptReference = new ScriptReference();
                scriptReference.Path = ConfigurationManager.AppSettings["MaintJsPath"].ToString().TrimEnd('/') + "/ScriptResources/JQueryCalendarScriptResource.js";
                scriptReference.ResourceUICultures = CommonBLL.GetCultures(cultures, scriptReference.Path);
                scriptManager.Scripts.Add(scriptReference);
                #endregion

                int fLocationID = 0;
                int equipmentID = 0;
                int siteID = CommonBLL.ValidateSiteID(Request);
                int userID = this.CurrentUser.UserID;

                if (siteID == 0)
                {
                    Response.Redirect(ConfigurationManager.AppSettings["NoAccessPage"].ToString());
                }

                int accessLevelID = CommonBLL.GetAccessLevelID(this.CurrentUser.AccessLevel);

                //functional location id
                if (Request.QueryString["flid"] != null && Request.QueryString["flid"].Trim().Length > 0)
                {
                    fLocationID = Convert.ToInt32(Request.QueryString["flid"].Trim());
                }

                //equipment id
                if (Request.QueryString["eid"] != null && Request.QueryString["eid"].Trim().Length > 0)
                {
                    equipmentID = Convert.ToInt32(Request.QueryString["eid"].Trim());
                }

                AccessType access = ValidateUserPrivileges(siteID, accessLevelID);

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
                string webServicePath = ConfigurationManager.AppSettings["MaintWebServicePath"].Trim();
                ImagePathInfo imagePathInfo = new ImagePathInfo();
                imagePathInfo.UploaderPath = ConfigurationManager.AppSettings["uploaderPath"].ToString().Trim('/');
                imagePathInfo.ImgDefaultProfilePath = ConfigurationManager.AppSettings["MaintImagePath"].TrimEnd('/') + "/Styles/Images/Equipments.png";
                imagePathInfo.EquipmentImgPath = ConfigurationManager.AppSettings["EquipmentImagePath"].ToString().Trim('/') + "/" + siteID + "/" + "Thumbnail";

                Vegam_MaintenanceService.SiteDateTimeFormatInfo dateTimeFormat = BLL.MaintenanceBLL.GetSiteDateTimeFormatInfo(siteID);
                hdfDatePickerFormat.Value = CommonBLL.GetDatePickerDateFormat(dateTimeFormat.DateFormat);

                BasicParam basicParam = new BasicParam();
                basicParam.SiteID = siteID;
                basicParam.UserID = userID;
                basicParam.AccessLevelID = accessLevelID;
                basicParam.LanguageCode = this.CurrentUser.LanguageCode;

                UserControls.PagerData pagerData = new UserControls.PagerData();
                pagerData.PageIndex = 0;
                pagerData.PageSize = int.Parse(hdnEquipmentPageSize.Value.ToString());
                pagerData.SelectMethod = "LoadAllEquipmentInfo";
                pagerData.ServicePath = webServicePath;
                pagerData.SiteID = siteID;
                pagerData.UserID = userID;
                pagerData.AccessLevelID = accessLevelID;
                pagerData.LoadControlID = divModelInfo.ClientID;
                pagerData.PageAccessRights = access.ToString();

                # region PagerData for Equipment model and master popup
                //using pager for equipment model selection
                UserControls.PagerData modelPagerData = new UserControls.PagerData();
                modelPagerData.PageIndex = 0;
                modelPagerData.PageSize = int.Parse(hdnModelPageSize.Value.ToString());
                modelPagerData.SelectMethod = "LoadEquipmentModelInfo";
                modelPagerData.ServicePath = webServicePath;
                modelPagerData.SiteID = siteID;
                modelPagerData.UserID = userID;
                modelPagerData.PageAccessRights = access.ToString();


                //using pager for displaying maintenance master data in configure maintenance types modal popup 
                UserControls.PagerData maintTypePagerData = new UserControls.PagerData();
                maintTypePagerData.PageIndex = 0;
                maintTypePagerData.PageSize = int.Parse(hdnModelPageSize.Value.ToString());
                maintTypePagerData.SelectMethod = "LoadMaintTypesInfo";
                maintTypePagerData.ServicePath = webServicePath;
                maintTypePagerData.SiteID = siteID;
                maintTypePagerData.UserID = userID;
                maintTypePagerData.AccessLevelID = accessLevelID;
                maintTypePagerData.LoadControlID = divModelInfo.ClientID;
                maintTypePagerData.PageAccessRights = access.ToString();
                #endregion

                if (access == AccessType.FULL_ACCESS)
                {
                    btnAddMaintType.Attributes.Add("onclick", "javascript:InsertOrUpdateMaintType(" + (new JavaScriptSerializer()).Serialize(0) + ");return false;");
                }
                else
                {
                    btnAddMaintType.Attributes.Add("disabled", "disabled");
                }

                thMaintTypes.Attributes.Add("onclick", "javascript:SortMaintTypesTabs('" + thMaintTypes.ClientID + "','MasterDataName');");
                sortEquipment.Attributes.Add("onclick", "javascript:SortByEquipmentName('" + sortEquipment.ClientID + "','EquipmentName');");

                ScriptManager.RegisterStartupScript(this, this.GetType(), "LoadEquipmentBasicInfo", "javascript:LoadEquipmentBasicInfo(" + (new JavaScriptSerializer()).Serialize(basicParam) + "," + (new JavaScriptSerializer()).Serialize(pagerData) + "," + (new JavaScriptSerializer()).Serialize(maintTypePagerData) + "," + (new JavaScriptSerializer()).Serialize(modelPagerData) + ",'" + basePath + "','" + webServicePath + "','" + equipmentID + "','" + hasEditAccess + "','" + hasDeleteAccess + "'," + (new JavaScriptSerializer()).Serialize(imagePathInfo) + ",'"+ fLocationID + "','"+ hdfDatePickerFormat.Value + "');", true);
            }
        }

        private AccessType ValidateUserPrivileges(int siteID, int accessLevelID)
        {
            AccessType access = CommonBLL.ValidateUserPrivileges(siteID, this.CurrentUser.SiteID, this.CurrentUser.UserID, accessLevelID, Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_Equipments));
            if (access == AccessType.NO_ACCESS)
            {
                Response.Redirect(ConfigurationManager.AppSettings["NoAccessPage"].ToString());
            }
            else if (access == AccessType.FULL_ACCESS || access == AccessType.EDIT_ONLY)
            {
                hasEditAccess = true;
                if (access == AccessType.FULL_ACCESS)
                {
                    hasDeleteAccess = true;
                }
            }

            #region ValidateUserPrivileges for navigation button links

            if (CommonBLL.ValidateUserPrivileges(siteID, this.CurrentUser.SiteID, this.CurrentUser.UserID, accessLevelID, Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_Functional_Loc)) == AccessType.NO_ACCESS)
            {
                buttonlnkAddFLocation.Visible = false;
            }
            if (CommonBLL.ValidateUserPrivileges(siteID, this.CurrentUser.SiteID, this.CurrentUser.UserID, accessLevelID, Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_Measuring_Point)) == AccessType.NO_ACCESS)
            {
                buttonlnkMeasuringPoint.Visible = false;
            }
            #endregion

            return access;
        }
    }

    public class ImagePathInfo
    {
        public string UploaderPath { get; set; } = string.Empty;
        public string EquipmentImgPath { get; set; } = string.Empty;
        public string ImgDefaultProfilePath { get; set; } = string.Empty;
    }

    public class FilterObject
    {
        public string FilterTextValue { get; set; } = string.Empty;
        public string FilterLocationIds { get; set; } = string.Empty;
        public string FilterCategoryIds { get; set; } = string.Empty;
    }
}