using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Vegam_MaintenanceModule
{
    public partial class Login : System.Web.UI.Page
    {
        iPAS_Base.CurrentUserInfo currentUserInfo = null;
        protected void Page_Load(object sender, EventArgs e)
        {
            //iPAS_StagingService.StagingServiceClient s = new iPAS_StagingService.StagingServiceClient();

            //iPAS_StagingService.PickMaterialFilter filter = new iPAS_StagingService.PickMaterialFilter();
            //filter.SiteID = 2;
            //filter.UserID = 9;
            //filter.AccessLevelID = 4;
            //filter.LanguageCode = "EN";

            //string s2="001000247231";

            //string[] s1 =s2.Split(',');

            //filter.OrderList = s1;
            //filter.PickType = iPAS_StagingService.PickMaterialType.ShowNextMaterial;
            //filter.ReplenishmentType = iPAS_StagingService.POReplenishmentType.ProcessOrder;
            //filter.CurrentDisplayedMaterial = "";

            //s.GetPickMaterialInfo(filter);

            //iPAS_PreweighService.PreweighServiceClient s = new  iPAS_PreweighService.PreweighServiceClient();
            //  iPAS_PreweighService.MaterialBatchInfo materialBatchInfo = new iPAS_PreweighService.MaterialBatchInfo();
            //         materialBatchInfo.AccessLevelID = 4;
            //         materialBatchInfo.SiteID = 2;
            //         materialBatchInfo.UserID = 137;
            //         materialBatchInfo.LanguageCode = "EN";
            //         materialBatchInfo.ProcessOrder = "001000141342";
            //         materialBatchInfo.PlantCode = "0759";
            //         materialBatchInfo.MaterialNumber ="552242";

            //         s.GetBatchInPSALocation(materialBatchInfo);

            //iPAS_StagingService.KanbanMaterialReplenishmentPickFilter _filterInfo = new iPAS_StagingService.KanbanMaterialReplenishmentPickFilter();
            //_filterInfo.SiteID = 2;
            //_filterInfo.UserID = 137;
            //_filterInfo.MaterialNumber="1042117";
            //_filterInfo.BinID = 143;
            //_filterInfo.AccessLevelID = 4;
            //_filterInfo.LanguageCode = "EN";
            //    iPAS_StagingService.KanabnMaterialPickInfo _materialPickInfo = s.GetKanbanMaterialPickInfo(_filterInfo);

            //iPAS_StagingService.BasicParam b = new iPAS_StagingService.BasicParam();
            //b.SiteID=2;
            //b.UserID=9;
            //b.AccessLevelID = 4;

            //s.GetPickingProcessOrderForToday(b);

            //iPAS_ManufactureService.ManufactureServiceClient s1 = new iPAS_ManufactureService.ManufactureServiceClient();
            //iPAS_ManufactureService.ManufactureBasicParam manfBasicParam = new iPAS_ManufactureService.ManufactureBasicParam();
            //manfBasicParam.ProcessOrder = "001000141342";
            //manfBasicParam.SiteID = 2;
            //manfBasicParam.UserID = 137;

            //s1.GetManufactureNextPhaseInfo(manfBasicParam, "1240884");
            // s.AnalyseBinIssues(1, 5, "1000004338");
            //   s.AnalyseBinIssues(1, 5, "002000003587");

            //s.UpdateWorkOrderSummary(1, "002000095262");

            //iPAS_ManufactureService.ConfirmManufacturePhaseParam phaseParam = new iPAS_ManufactureService.ConfirmManufacturePhaseParam();
            //phaseParam.LineItemNumber = 1;
            //phaseParam.MaterialNumber = "333170";
            //phaseParam.MixQty = 12;
            //phaseParam.MixUoM = "EH";
            //phaseParam.UserID = 4;
            //phaseParam.SiteID = 1;
            //phaseParam.BatchNumber = "D521790031";
            //phaseParam.ProcessOrder = "002000003435";
            //phaseParam.PhaseNumber = "0020";


            if (!IsPostBack)
            {
                txtUserName.Focus();
                if (Request.QueryString["Logout"] == null)
                {
                    HttpCookie IPadmincookie = Request.Cookies["CurrentiPASUser"];
                    if (IPadmincookie != null)
                    {
                        if (IPadmincookie.Values.Count == 3)
                        {
                            string strPassword = Encoder.DecryptData(IPadmincookie["pwd"].ToString());
                            string status = string.Empty;
                            if (IPadmincookie["user"].ToString() != string.Empty && IPadmincookie["pwd"].ToString() != string.Empty)
                            {
                                //currentUserInfo = iPAS_Base.CurrentUserInfo.GetCurrentUserInfo(IPadmincookie["user"].ToString(), IPadmincookie["pwd"].ToString());
                                if (currentUserInfo != null)
                                {
                                    System.Web.HttpContext.Current.Session["CurrentUserInfo"] = currentUserInfo;
                                    //Server.Transfer("~/galaxy/Home.aspx", false);
                                }
                                else
                                {
                                    lblErrorMessage.Text = "Sorry, your login failed";
                                }
                            }
                        }
                    }
                }
                else
                {
                    Response.Cookies["CurrentiPASUser"].Expires = DateTime.Now.AddYears(-1);
                }
            }
        }

        protected void CustomValidator1_ServerValidate(object source, ServerValidateEventArgs args)
        {
            string emailID = txtUserName.Text.Trim();
            string password = txtPassword.Text.Trim();
            string status = string.Empty;
            try
            {
                if (emailID != string.Empty && password != string.Empty)
                {

                    string saltKeyValue = GenerateSaltKey(emailID);
                    string encodedPwd = GetHashedPasswordUsingSha256HashAlgorithm(password);
                    string hashedPwdWithSAltKey = GetHashedPasswordUsingSha256HashAlgorithm(encodedPwd + saltKeyValue);
                    string encryptedPassword = Encoder.EncryptData(hashedPwdWithSAltKey);

                    currentUserInfo = iPAS_Base.CurrentUserInfo.GetCurrentUserInfo(emailID, encryptedPassword);
                    if (currentUserInfo != null)
                    {
                        System.Web.HttpContext.Current.Session["CurrentUserInfo"] = currentUserInfo;
                        args.IsValid = true;
                    }
                    else
                    {
                        args.IsValid = false;
                    }
                }
                else
                {
                    args.IsValid = false;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        protected void btnLogin_Click(object sender, EventArgs e)
        {
            if (Page.IsValid)
            {
                string sKeepLogin = string.Empty;

                sKeepLogin = "Y";

                HttpCookie cookIPAdminUser = new HttpCookie("CurrentiPASUser");
                cookIPAdminUser.Values.Add("user", txtUserName.Text.ToString().Trim());
                cookIPAdminUser.Values.Add("Pwd", Encoder.EncryptData(txtPassword.Text.ToString()));
                cookIPAdminUser.Values.Add("keepLogin", sKeepLogin);

                Response.Cookies.Add(cookIPAdminUser);
                cookIPAdminUser.Expires = DateTime.Now.AddYears(1);

                Response.Redirect("MaintenanceIndex.aspx?id=" + currentUserInfo.SiteID);
            }
        }

        private string GenerateSaltKey(string emailID)
        {
            return BLL.UserBLL.GenerateSaltKey(emailID);
        }

        private string GetHashedPasswordUsingSha256HashAlgorithm(string password)
        {
            try
            {
                System.Security.Cryptography.SHA256Managed crypt = new System.Security.Cryptography.SHA256Managed();
                StringBuilder hash = new StringBuilder();
                byte[] crypto = crypt.ComputeHash(Encoding.UTF8.GetBytes(password), 0, Encoding.UTF8.GetByteCount(password));
                foreach (byte hashPwdByte in crypto)
                {
                    hash.Append(hashPwdByte.ToString("x2"));  //conversion to hex
                }
                return hash.ToString();
            }
            catch (Exception ex)
            {
                throw new FaultException(ex.Message);
            }
        }
    }
}