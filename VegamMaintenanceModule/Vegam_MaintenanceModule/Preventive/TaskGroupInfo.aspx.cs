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
    public partial class TaskGroupInfo : iPAS_Base.BasePage
    {
        public int maintScheduleID = 0;
        protected override void OnPreInit(EventArgs e)
        {
            this.MasterPageFile = ConfigurationManager.AppSettings["MaintVegamMasterPage"].ToString();

            if (Request.QueryString["maintscheduleid"] != null && Request.QueryString["maintscheduleid"].Trim().Length > 0)
            {
                maintScheduleID = Convert.ToInt32(Request.QueryString["maintscheduleid"].Trim());
                this.MasterPageFile = ConfigurationManager.AppSettings["VegamiFrameMasterPage"].ToString();
            }
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                #region Script Resource

                ScriptReference scriptReference = new ScriptReference();
                scriptReference.Path = ConfigurationManager.AppSettings["MaintJsPath"].ToString().TrimEnd('/') + "/ScriptResources/TaskGroupScriptResource.js";
                string[] cultures = ConfigurationManager.AppSettings["SupportLanguages"].ToString().Split(',');
                scriptReference.ResourceUICultures = CommonBLL.GetCultures(cultures, scriptReference.Path);
                scriptManager.Scripts.Add(scriptReference);

                #endregion

                int siteID = CommonBLL.ValidateSiteID(Request);

                int versionNumber = 0;
                int.TryParse(Request.QueryString["v"], out versionNumber);               

                int taskGroupIdentifier = 0;
                if (Request.QueryString["gid"] != null && Request.QueryString["gid"].Trim().Length > 0)
                {
                    taskGroupIdentifier = Convert.ToInt32(Request.QueryString["gid"].Trim());
                }

                if (siteID == 0 || versionNumber < 0 || taskGroupIdentifier < 0)
                {
                    Response.Redirect(ConfigurationManager.AppSettings["NoAccessPage"].ToString());
                }
                bool isMaintShowAll = false;
                if (Request.QueryString["showall"] != null && Request.QueryString["showall"].Trim().Length > 0)
                {
                    isMaintShowAll = Request.QueryString["showall"].Trim().ToLower() == "true" ? true : false;
                }

                int userID = this.CurrentUser.UserID;
                int accessLevelID = CommonBLL.GetAccessLevelID(this.CurrentUser.AccessLevel);



                AccessType access = ValidateUserPrivileges(siteID, accessLevelID);
                AccessType approveAccess = CommonBLL.ValidateUserPrivileges(siteID, this.CurrentUser.SiteID, this.CurrentUser.UserID, accessLevelID, Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.taskGroupApprove));


                Vegam_MaintenanceService.BasicParam basicParam = new Vegam_MaintenanceService.BasicParam();
                basicParam.SiteID = siteID;
                basicParam.UserID = userID;
                basicParam.AccessLevelID = accessLevelID;

                string basePath = ConfigurationManager.AppSettings["MaintBasePath"].ToString().TrimEnd('/');
                string webServicePath = ConfigurationManager.AppSettings["MaintWebServicePath"].Trim();
                string uploaderPath = ConfigurationManager.AppSettings["uploaderPath"].ToString().Trim('/');
                string imagePath = ConfigurationManager.AppSettings["MaintImagePath"].TrimEnd('/');
                string taskDocumentPath = ConfigurationManager.AppSettings["MaintenanceTaskDocumentsPath"].TrimEnd('/');

                if (access == AccessType.FULL_ACCESS)
                {

                    btnGroupInfoSave.Attributes.Add("onclick", "javascript:SaveTaskGroupInfo();return false;");
                    if (taskGroupIdentifier == 0)
                    {
                        btnGroupInfoSave.InnerText = Language_Resources.TaskGroup_Resource.save;
                    }
                    else
                    {
                        btnGroupInfoSave.InnerText = Language_Resources.TaskGroup_Resource.update;
                    }
                }
                else if (access == AccessType.EDIT_ONLY)
                {
                    btnGroupInfoSave.Attributes.Add("onclick", "javascript:SaveTaskGroupInfo();return false;");
                    btnGroupInfoSave.InnerText = Language_Resources.TaskGroup_Resource.update;
                }
                else
                {
                    btnGroupInfoSave.Attributes.Add("disabled", "disabled");
                }

                bool isUserHasApprovePermission = false;
                if (approveAccess == AccessType.FULL_ACCESS)
                {
                    isUserHasApprovePermission = true;
                }
                //else if (approveAccess == AccessType.READ_ONLY)
                //{
                //    isUserHasApproveVisiblePermission = true;
                //}

                //using pager for displaying maintenance master data in configure maintenance types modal popup 
                UserControls.PagerData maintTypePagerData = new UserControls.PagerData();
                maintTypePagerData.PageIndex = 0;
                maintTypePagerData.PageSize = int.Parse(hdnPageSize.Value.ToString());
                maintTypePagerData.SelectMethod = "LoadMaintTypesInfo";
                maintTypePagerData.ServicePath = webServicePath;
                maintTypePagerData.SiteID = siteID;
                maintTypePagerData.UserID = userID;
                maintTypePagerData.AccessLevelID = accessLevelID;
                maintTypePagerData.LoadControlID = btnAddMaintType.ClientID;
                maintTypePagerData.PageAccessRights = access.ToString();

                if (access == AccessType.FULL_ACCESS)
                {
                    btnAddMaintType.Attributes.Add("onclick", "javascript:InsertOrUpdateMaintType(" + (new JavaScriptSerializer()).Serialize(0) + ");return false;");
                }
                else
                {
                    btnAddMaintType.Attributes.Add("disabled", "disabled");
                }

                thMaintTypes.Attributes.Add("onclick", "javascript:SortMaintTypesTabs('" + thMaintTypes.ClientID + "','MasterDataName');");


                Page.ClientScript.RegisterStartupScript(GetType(), "LoadTaskGroupInfo", "LoadTaskGroupInfo(" + (new JavaScriptSerializer()).Serialize(maintTypePagerData) + "," + (new JavaScriptSerializer()).Serialize(basicParam) + ",'" + basePath + "','" + webServicePath + "','" + uploaderPath + "','" + imagePath + "'," + taskGroupIdentifier + "," + versionNumber + ",'" + btnGroupInfoSave.ClientID + "','" + access.ToString() + "','" + taskDocumentPath + "','"+ isUserHasApprovePermission + "','" + maintScheduleID + "','" + isMaintShowAll + "');", true);
            }
        }

        private AccessType ValidateUserPrivileges(int siteID, int accessLevelID)
        {             
            AccessType access = CommonBLL.ValidateUserPrivileges(siteID, this.CurrentUser.SiteID, this.CurrentUser.UserID, accessLevelID, Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.configureTaskGroup));
            if (access == AccessType.NO_ACCESS)
            {
                Response.Redirect(ConfigurationManager.AppSettings["NoAccessPage"].ToString());
            }

            return access;
        }
    }
}