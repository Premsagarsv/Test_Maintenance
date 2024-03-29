﻿using System;
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
    public partial class CreateSchedule : iPAS_Base.BasePage
    {
        string scheduleType = "S";

        protected void Page_Load(object sender, EventArgs e)
        {
            #region Script Resource

            ScriptReference scriptReference = new ScriptReference();
            scriptReference.Path = ConfigurationManager.AppSettings["MaintJsPath"].ToString().TrimEnd('/') + "/ScriptResources/CreateScheduleScriptResource.js";
            string[] cultures = ConfigurationManager.AppSettings["SupportLanguages"].ToString().Split(',');
            scriptReference.ResourceUICultures = CommonBLL.GetCultures(cultures, scriptReference.Path);
            scriptManager.Scripts.Add(scriptReference);

            scriptReference = new ScriptReference();
            scriptReference.Path = ConfigurationManager.AppSettings["MaintJsPath"].ToString().TrimEnd('/') + "/ScriptResources/jQueryCalendarScriptResource.js";
            scriptReference.ResourceUICultures = CommonBLL.GetCultures(cultures, scriptReference.Path);
            scriptManager.Scripts.Add(scriptReference);

            #endregion

            int siteID = CommonBLL.ValidateSiteID(Request);
            if (siteID == 0)
            {
                Response.Redirect(ConfigurationManager.AppSettings["NoAccessPage"].ToString());
            }

            //if loading page from maintenance schedule
            if (Request.QueryString["ismaintenance"] != null && Request.QueryString["ismaintenance"].Trim().Length > 0)
            {
                scheduleType = Request.QueryString["ismaintenance"].ToString().Trim() == "true" ? "S" : scheduleType;
            }
            //if loading page from measuring point
            else if (Request.QueryString["ischecklist"] != null && Request.QueryString["ischecklist"].Trim().Length > 0)
            {
                scheduleType = Request.QueryString["ischecklist"].ToString().Trim() == "true" ? "I" : scheduleType;
            }

            //if loading page in edit mode
            int maintScheduleID = 0;
            if (Request.QueryString["maintscheduleid"] != null && Request.QueryString["maintscheduleid"].Trim().Length > 0)
            {
                maintScheduleID = Convert.ToInt32(Request.QueryString["maintscheduleid"].ToString().Trim());
            }

            int userID = this.CurrentUser.UserID;
            int accessLevelID = CommonBLL.GetAccessLevelID(this.CurrentUser.AccessLevel);

            AccessType accessType = ValidateUserPrivileges(siteID, accessLevelID);

            string basePath = ConfigurationManager.AppSettings["MaintBasePath"].ToString().TrimEnd('/');
            string webServicePath = ConfigurationManager.AppSettings["MaintWebServicePath"].Trim();

            Vegam_MaintenanceService.SiteDateTimeFormatInfo dateTimeFormat = BLL.MaintenanceBLL.GetSiteDateTimeFormatInfo(siteID);
            string datePickerFormat = CommonBLL.GetDatePickerDateFormat(dateTimeFormat.DateFormat);

            if(accessType == AccessType.FULL_ACCESS || accessType == AccessType.EDIT_ONLY)
            {
                btnSaveScheduleInfo.Attributes.Add("onclick", "javascript:SaveScheduleInfo();return false;");
            }
            else
            {
                btnSaveScheduleInfo.Attributes.Add("disabled", "disabled");
            }

            BasicParam basicParam = new BasicParam();
            basicParam.SiteID = siteID;
            basicParam.UserID = userID;
            basicParam.AccessLevelID = accessLevelID;

            ScriptManager.RegisterStartupScript(this, this.GetType(), "LoadScheduleInfo", "javascript:LoadScheduleInfo(" + (new JavaScriptSerializer()).Serialize(basicParam) + ",'" + basePath + "','" + webServicePath + "','" + datePickerFormat + "','" + dateTimeFormat.DateFormat + "','" + dateTimeFormat.TimeFormat + "','" + scheduleType + "'," + maintScheduleID + ",'" + btnSaveScheduleInfo.ClientID + "');", true);
        }

        private AccessType ValidateUserPrivileges(int siteID, int accessLevelID)
        {
            AccessType access = AccessType.NO_ACCESS;
            if (scheduleType == "S")
                access = CommonBLL.ValidateUserPrivileges(siteID, this.CurrentUser.SiteID, this.CurrentUser.UserID, accessLevelID, Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.ManagePreventiveMaintenanceSchedule));
            else if(scheduleType=="I")
                access = CommonBLL.ValidateUserPrivileges(siteID, this.CurrentUser.SiteID, this.CurrentUser.UserID, accessLevelID, Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.ManageChecklist));
            if (access == AccessType.NO_ACCESS)
            {
                Response.Redirect(ConfigurationManager.AppSettings["NoAccessPage"].ToString());
            }
            return access;
        }
    }
}