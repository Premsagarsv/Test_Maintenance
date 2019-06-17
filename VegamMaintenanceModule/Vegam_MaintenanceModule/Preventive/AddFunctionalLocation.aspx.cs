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
    public partial class AddFunctionalLocation : iPAS_Base.BasePage
    {
        bool hasDeleteAccess = false;
        bool hasEditAccess = false;

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

                int userID = this.CurrentUser.UserID;
                int accessLevelID = CommonBLL.GetAccessLevelID(this.CurrentUser.AccessLevel);

                int locationID = 0;
                if (Request.QueryString["flid"] != null && Request.QueryString["flid"].Trim().Length > 0)
                {
                    locationID = Convert.ToInt32(Request.QueryString["flid"].Trim());
                }

                string filterLocationIds = string.Empty;
                if (Request.QueryString["fids"] != null && Request.QueryString["fids"].Trim().Length > 0)
                {
                    filterLocationIds = Request.QueryString["fids"].Trim();
                }

                AccessType access = ValidateUserPrivileges(siteID, accessLevelID);

                //btnClose.Attributes.Add("onclick", "javascript:ViewFLocationList(" + (new JavaScriptSerializer()).Serialize(filterLocationIds) + ");return false;");

                if (locationID == 0)
                {
                    btnAddUpdateFLocation.InnerText = Language_Resources.FunctionalLocation_Resource.saveAndAddMore.ToString();
                }
                else
                {
                    btnAddUpdateFLocation.InnerText = Language_Resources.FunctionalLocation_Resource.update.ToString();
                }

                if (access == AccessType.FULL_ACCESS && locationID == 0)
                {
                    btnAddUpdateFLocation.Attributes.Add("onclick", "javascript:AddUpdateFunctionalLoaction(false);return false;");
                }
                else if (locationID != 0 && (access == AccessType.FULL_ACCESS || access == AccessType.EDIT_ONLY))
                {
                    btnAddUpdateFLocation.Attributes.Add("onclick", "javascript:AddUpdateFunctionalLoaction(true);return false;");
                }
                else
                {
                    btnAddUpdateFLocation.Attributes.Add("disabled", "disabled");
                }

                string webServicePath = ConfigurationManager.AppSettings["MaintWebServicePath"];
                string basePath = ConfigurationManager.AppSettings["MaintBasePath"].ToString().TrimEnd('/');
                string uploaderPath = ConfigurationManager.AppSettings["uploaderPath"].ToString().Trim('/');
                string fLocationImgPath = ConfigurationManager.AppSettings["FunctionalLocImagePath"].ToString().Trim('/') + "/" + siteID + "/" + "Thumbnail";
                string imageDefaultPath = ConfigurationManager.AppSettings["MaintImagePath"].TrimEnd('/') + "/Styles/Images/FLocation.png";

                BasicParam basicParam = new BasicParam();
                basicParam.SiteID = siteID;
                basicParam.UserID = userID;
                basicParam.AccessLevelID = accessLevelID;
                basicParam.LanguageCode = this.CurrentUser.LanguageCode;

                UserControls.PagerData pagerData = new UserControls.PagerData();
                pagerData.PageIndex = 0;
                pagerData.PageSize = int.Parse(hdnFLocationPageSize.Value.ToString());
                pagerData.SelectMethod = "LoadLocationInfo";
                pagerData.ServicePath = webServicePath;
                pagerData.SiteID = siteID;
                pagerData.UserID = userID;
                pagerData.AccessLevelID = accessLevelID;
                pagerData.LoadControlID = btnAddUpdateFLocation.ClientID;
                pagerData.PageAccessRights = access.ToString();

                sortFLocation.Attributes.Add("onclick", "javascript:SortByFLocationName('" + sortFLocation.ClientID + "','LocationName');");

                ScriptManager.RegisterStartupScript(this, this.GetType(), "FunctionalLocationBasicInfo", "javascript:FunctionalLocationBasicInfo(" + (new JavaScriptSerializer()).Serialize(pagerData) + "," + (new JavaScriptSerializer()).Serialize(basicParam) + ",'" + basePath + "','" + webServicePath + "','" + imageDefaultPath + "','" + uploaderPath + "','" + locationID + "','" + fLocationImgPath + "','" + hasDeleteAccess + "','" + hasEditAccess + "','" + btnAddUpdateFLocation.ClientID + "');", true);
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

            #region ValidateUserPrivileges for navigation links

            if (CommonBLL.ValidateUserPrivileges(siteID, this.CurrentUser.SiteID, this.CurrentUser.UserID, accessLevelID, Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_Equipments)) == AccessType.NO_ACCESS)
            {
                buttonlnkAddEquipment.Visible = false;
            }
            if (CommonBLL.ValidateUserPrivileges(siteID, this.CurrentUser.SiteID, this.CurrentUser.UserID, accessLevelID, Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.Configure_Measuring_Point)) == AccessType.NO_ACCESS)
            {
                buttonlnkMeasuringPoint.Visible = false;
            }
            #endregion

            return access;
        }

    }
}