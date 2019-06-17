﻿using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;
using Vegam_MaintenanceModule.ipas_CompanyService;
using Vegam_MaintenanceModule.Vegam_MaintenanceService;

namespace Vegam_MaintenanceModule.Preventive
{
    public partial class AddMeasuringPoint : iPAS_Base.BasePage
    {
        bool uploadImageAccess = false;
        int currentPage = 0;

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
                scriptReference.Path = ConfigurationManager.AppSettings["MaintJsPath"].ToString().TrimEnd('/') + "/ScriptResources/MeasuringPointScriptResource.js";
                string[] cultures = ConfigurationManager.AppSettings["SupportLanguages"].ToString().Split(',');
                scriptReference.ResourceUICultures = CommonBLL.GetCultures(cultures, scriptReference.Path);
                scriptManager.Scripts.Add(scriptReference);

                #endregion

                int siteID = CommonBLL.ValidateSiteID(Request);
                int equipmentID = 0;
                int fLocationID = 0;
                int measuringPointID = 0;
                string mptDataType = Request.QueryString["type"];//E : Equipment, L:Location, M: Master

                if (Request.QueryString["flid"] != null && Request.QueryString["flid"].Trim().Length > 0)
                {
                    fLocationID = Convert.ToInt32(Request.QueryString["flid"].Trim());
                }

                if (Request.QueryString["eid"] != null && Request.QueryString["eid"].Trim().Length > 0)
                {
                    equipmentID = Convert.ToInt32(Request.QueryString["eid"].Trim());
                }
                if (Request.QueryString["mpid"] != null && Request.QueryString["mpid"].Trim().Length > 0)
                {
                    measuringPointID = Convert.ToInt32(Request.QueryString["mpid"].Trim());
                }

                if (siteID == 0 && string.IsNullOrEmpty(mptDataType) && equipmentID < 0)
                {
                    Response.Redirect(ConfigurationManager.AppSettings["NoAccessPage"].ToString());
                }
                
                int userID = this.CurrentUser.UserID;
                int accessLevelID = CommonBLL.GetAccessLevelID(this.CurrentUser.AccessLevel);

                ValidateUserPrivileges(siteID, accessLevelID , mptDataType);

                Vegam_MaintenanceService.BasicParam basicParam = new Vegam_MaintenanceService.BasicParam();
                basicParam.SiteID = siteID;
                basicParam.UserID = userID;
                basicParam.AccessLevelID = accessLevelID;

                string basePath = ConfigurationManager.AppSettings["MaintBasePath"].ToString().TrimEnd('/');
                string webServicePath = ConfigurationManager.AppSettings["MaintWebServicePath"].Trim();
                string uploaderPath = ConfigurationManager.AppSettings["uploaderPath"].ToString().Trim('/');
                string restAPIPath = ConfigurationManager.AppSettings["VegamViewServicePath"].TrimEnd('/');
                string measuringPointImgPath = ConfigurationManager.AppSettings["MeasuringPointImagePath"].ToString().Trim('/') + "/" + basicParam.SiteID + "/" + "Thumbnail";
                string imagePath = ConfigurationManager.AppSettings["MaintImagePath"].TrimEnd('/')+ "/Styles/Images/Measuring_Point.png";

                UserControls.PagerData measuringPointpagerData = new UserControls.PagerData();
                measuringPointpagerData.PageIndex = 0;
                measuringPointpagerData.PageSize = int.Parse(hdnMeasuringPointPageSize.Value.ToString());
                measuringPointpagerData.CurrentPage = currentPage;
                measuringPointpagerData.SelectMethod = "LoadMeasuringPointList";
                measuringPointpagerData.ServicePath = webServicePath;
                measuringPointpagerData.SiteID = siteID;
                measuringPointpagerData.UserID = userID;
                measuringPointpagerData.AccessLevelID = accessLevelID;
                measuringPointpagerData.PageAccessRights = PageAccessRights.ToString();

                if (measuringPointpagerData.PageAccessRights == AccessType.FULL_ACCESS.ToString())
                {
                    btnSaveMeasuringPoint.Attributes.Add("onclick", "javascript:InsertOrUpdateMeasuringPointInfo(" + (new JavaScriptSerializer()).Serialize(0) + ");return false;");
                }
                else
                {
                    btnSaveMeasuringPoint.Attributes.Add("disabled", "disabled");
                    btnGenerateCode.Attributes.Add("disabled", "disabled");               
                }

                if (measuringPointpagerData.PageAccessRights == AccessType.FULL_ACCESS.ToString() || measuringPointpagerData.PageAccessRights == AccessType.EDIT_ONLY.ToString())
                {
                    uploadImageAccess = true;
                }
                else
                {
                    uploadImageAccess = false;
                }

               
                //using pager for displaying master data in configure maintenance types modal popup 
                UserControls.PagerData maintTypePagerData = new UserControls.PagerData();
                maintTypePagerData.PageIndex = 0;
                maintTypePagerData.PageSize = int.Parse(hdnModelPageSize.Value.ToString());
                maintTypePagerData.CurrentPage = currentPage;
                maintTypePagerData.SelectMethod = "LoadMaintTypesInfo";
                maintTypePagerData.ServicePath = webServicePath;
                maintTypePagerData.SiteID = siteID;
                maintTypePagerData.UserID = userID;
                maintTypePagerData.AccessLevelID = accessLevelID;
                maintTypePagerData.PageAccessRights = PageAccessRights.ToString();

                if (maintTypePagerData.PageAccessRights == AccessType.FULL_ACCESS.ToString())
                {
                    btnAddMaintType.Attributes.Add("onclick", "javascript:InsertOrUpdateMaintType(" + (new JavaScriptSerializer()).Serialize(0) + ");return false;");
                }
                else
                {
                    btnAddMaintType.Attributes.Add("disabled", "disabled");
                }
                thMaintTypes.Attributes.Add("onclick", "javascript:SortMaintenanceTypeTabs('" + thMaintTypes.ClientID + "','MasterDataName');");

                sortMeasuringPoint.Attributes.Add("onclick", "javascript:SortByMeasuringPointName('" + sortMeasuringPoint.ClientID + "','MeasuringPointName');");

                Page.ClientScript.RegisterStartupScript(GetType(), "LoadMeasuringPointInfo", "LoadMeasuringPointInfo(" + (new JavaScriptSerializer()).Serialize(basicParam) + ",'" + basePath + "','" + imagePath + "','" + uploaderPath + "','" + measuringPointImgPath + "','" + restAPIPath + "','" + btnSaveMeasuringPoint.ClientID + "','" + mptDataType + "'," + equipmentID + ","+ fLocationID + "," + measuringPointID + "," + (new JavaScriptSerializer()).Serialize(measuringPointpagerData) + "," + (new JavaScriptSerializer()).Serialize(maintTypePagerData) + ");", true);
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

        private void ValidateUserPrivileges(int siteID, int accessLevelID , string mptDataType)
        { 
            AccessType access  = CommonBLL.ValidateUserPrivileges(siteID, this.CurrentUser.SiteID, this.CurrentUser.UserID, accessLevelID, Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_Measuring_Point));
            if (access == AccessType.NO_ACCESS)
            {
                Response.Redirect(ConfigurationManager.AppSettings["NoAccessPage"].ToString());
            }
            else
            {
                this.PageAccessRights = access.ToString();
            }

            #region ValidateUserPrivileges for navigation button links

            if (CommonBLL.ValidateUserPrivileges(siteID, this.CurrentUser.SiteID, this.CurrentUser.UserID, accessLevelID, Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_Functional_Loc)) == AccessType.NO_ACCESS)
            {
                lnkFLocation.Visible = false;
            }

            if (mptDataType != null && mptDataType.ToUpper() == "E")
            {
                if (CommonBLL.ValidateUserPrivileges(siteID, this.CurrentUser.SiteID, this.CurrentUser.UserID, accessLevelID, Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_Equipments)) == AccessType.NO_ACCESS)
                {
                    lnkEquipmentInfo.Visible = false;
                }
            }
            else if (mptDataType != null && mptDataType.ToUpper() == "M")
            {
                if (CommonBLL.ValidateUserPrivileges(siteID, this.CurrentUser.SiteID, this.CurrentUser.UserID, accessLevelID, Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_Equipment_Models)) == AccessType.NO_ACCESS)
                {
                    lnkEquipmentInfo.Visible = false;
                }
            }
            #endregion
        }
    }
}