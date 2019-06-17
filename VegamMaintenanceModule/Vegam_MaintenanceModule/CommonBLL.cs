using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using Vegam_MaintenanceModule.ipas_UserService;

namespace Vegam_MaintenanceModule
{
    public class CommonBLL
    {
        public static int ValidateSiteID(HttpRequest request)
        {
            int siteID = 0;
            if (request.QueryString["id"] != null)
            {
                int.TryParse(request.QueryString["id"].ToString(), out siteID);
            }

            return siteID;
        }

        public static int GetAccessLevelID(iPAS_Base.AccessLevel accessLevel)
        {
            if (accessLevel == iPAS_Base.AccessLevel.COMPANY_LEVEL)
                return 1;
            else if (accessLevel == iPAS_Base.AccessLevel.REGIONAL_LEVEL)
                return 2;
            else if (accessLevel == iPAS_Base.AccessLevel.COUNTRY_LEVEL)
                return 3;
            else if (accessLevel == iPAS_Base.AccessLevel.PLANT_MANAGER_LEVEL)
                return 4;
            else if (accessLevel == iPAS_Base.AccessLevel.PLANT_LEVEL)
                return 5;
            else if (accessLevel == iPAS_Base.AccessLevel.PORTAL_ADMIN)
                return 6;
            else return 0;
        }

        public static string[] GetCultures(string[] cultures, string scriptPath)
        {
            string languageCode = System.Threading.Thread.CurrentThread.CurrentCulture.ToString();
            string path = HttpContext.Current.Server.MapPath(scriptPath.Replace(".js", "." + languageCode + ".js"));
            if (!System.IO.File.Exists(path))
                return null;
            else
                return cultures;
        }

        public static string CleanHtml(string html)
        {
            html = Regex.Replace(html, @"<[/]?(form|[ovwxp]:\w+)[^>]*?>", "", RegexOptions.IgnoreCase);
            html = Regex.Replace(html, @"<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>", "", RegexOptions.IgnoreCase);
            html = html.Replace("class=\"aspNetHidden\"", "class='aspNetHidden'");
            html = Regex.Replace(html.Trim(), @"<div class='aspNetHidden'>[^&;]*?</div>", "", RegexOptions.IgnoreCase);
            return html.Trim();
        }

        public static string RenderPagerHTML(string usercontrolPath, UserControls.PagerData pager, int totalCount)
        {
            System.Web.UI.Page page = new System.Web.UI.Page();
            UserControls.Pager ucPager = (UserControls.Pager)page.LoadControl(usercontrolPath + "/Pager.ascx");
            System.Web.UI.HtmlControls.HtmlForm form = new System.Web.UI.HtmlControls.HtmlForm();
            if (ucPager != null)
            {
                ucPager.CurrentPage = pager.CurrentPage;
                ucPager.PageSize = pager.PageSize;
                ucPager.RowCount = totalCount;
                ucPager.AllowPaging = false;
                ucPager.SelectMethod = pager.SelectMethod;
                ucPager.doPaging();
                form.Controls.Add(ucPager);
            }
            page.Controls.Add(form);
            foreach (System.Web.UI.Control ctrlpage in page.Controls)
            {
                foreach (System.Web.UI.Control ctrl in ctrlpage.Controls)
                {
                    UserControls.Pager ucPager1 = ctrl as UserControls.Pager;
                    if (ucPager1 != null)
                    {
                        ucPager1.BindControls(pager);
                        break;
                    }
                }
            }

            StringWriter textWriter = new StringWriter();
            HttpContext.Current.Server.Execute(page, textWriter, false);
            string htmlData = CleanHtml(textWriter.ToString());
            textWriter.Close();
            return htmlData;

        }

        public static string GetChangedDate(string value, UserControls.DisplayMode mode)
        {
            DateTime date;
            DateTime.TryParseExact(value.Trim(), "yyyyMMdd", CultureInfo.InvariantCulture, DateTimeStyles.None, out date);

            if (mode == UserControls.DisplayMode.NextDay)
                date = date.AddDays(1);
            else if (mode == UserControls.DisplayMode.PrevDay)
                date = date.AddDays(-1);

            return date.ToString("yyyyMMdd", CultureInfo.InvariantCulture);
        }

        public static string GetCalenderDayDisplayFormat(string value)
        {
            DateTime date;
            if (DateTime.TryParseExact(value.ToString(), "yyyyMMdd", CultureInfo.InvariantCulture, DateTimeStyles.None, out date))
            {
                return date.ToString("dddd, MMMM dd, yyyy", CultureInfo.InvariantCulture);
            }
            return value.ToString();
        }

        public static string GetDatePickerDateFormat(string format)
        {
            switch (format)
            {
                case "dd-MM-yyyy":
                    return "dd-mm-yy";
                case "dd/MM/yyyy":
                    return "dd/mm/yy";
                case "yyyy-MM-dd":
                    return "yy-mm-dd";
                case "yyyy/MM/dd":
                    return "yy/mm/dd";
                case "dd-yyyy-MM":
                    return "dd-yy-mm";
                case "dd/yyyy/MM":
                    return "dd/yy/mm";
                case "MM/yyyy/dd":
                    return "mm/yy/dd";
                case "MM-yyyy-dd":
                    return "mm-yy-dd";
                case "MM-dd-yyyy":
                    return "mm-dd-yy";
                case "MM/dd/yyyy":
                    return "mm/dd/yy";
                case "dd/MMM/yyyy":
                    return "dd/M/yy";
                case "dd-MMM-yyyy":
                    return "dd-M-yy";
                case "yyyy/MMM/dd":
                    return "yy/M/dd";
                case "yyyy-MMM-dd":
                    return "yy-M-dd";
                case "MMM/dd/yyyy":
                    return "M/dd/yy";
                case "MMM-dd-yyyy":
                    return "M-dd-yy";
                case "dd/MMMM/yyyy":
                    return "dd/MM/yy";
                case "dd-MMMM-yyyy":
                    return "dd-MM-yy";
                default:
                    return "dd-mm-yy";
            }
        }

        public static string GetDateFormat(int value, string dateFormat)
        {
            if (value == 0)
                return string.Empty;

            DateTime date;
            if (DateTime.TryParseExact(value.ToString(), "yyyyMMdd", CultureInfo.InvariantCulture, DateTimeStyles.None, out date))
            {
                return date.ToString(dateFormat);
            }
            return value.ToString(); //Return original if not expected format
        }

        public static string GetTimeFormat(int value, string timeFormat)
        {
            DateTime date;
            if (DateTime.TryParseExact(value.ToString().PadLeft(6, '0'), "HHmmss", CultureInfo.InvariantCulture, DateTimeStyles.None, out date))
            {
                return date.ToString(timeFormat);
            }
            return value.ToString();
        }

        public static AccessType ValidateUserPrivileges(int siteID, int userSiteID, int userID, int accessLevelID, int pageID)
        {

            BasicInfo basicInfo = new ipas_UserService.BasicInfo();
            basicInfo.SiteID = siteID;
            basicInfo.UserID = userID;

            AccessInfo accessInfo = BLL.UserBLL.GetUserAssignedPermissionsWithAccessLevel(basicInfo, pageID);

            if (accessInfo.AccessLevelID == 4 || accessInfo.AccessLevelID == 5) // For Plant Level User
            {
                //make sure query string site id & user site id are same
                if (siteID != userSiteID)
                    return AccessType.NO_ACCESS;
            }
            else if (accessInfo.AccessLevelID == 2 || accessInfo.AccessLevelID == 3 || accessInfo.AccessLevelID == 1) // For Company level, Regional and Country Level User  
            {
                int[] userSiteIDList = BLL.UserBLL.GetPlantUserSites(userID);
                if (!(userSiteIDList.Contains(siteID)))
                    return AccessType.NO_ACCESS;
            }
            //else if (accessInfo.AccessLevelID == 6) // For Portal Admin User, full control for all pages
            //{
            //    return AccessType.FULL_ACCESS;
            //}

            //return AccessType.FULL_ACCESS;
            ////returns 1 - FULL CONTROL ,2 - EDIT ONLY ,3 - READ ONLY or 0 - NO ACCESS

            if (accessInfo.AccessValue == "1")
            {
                return AccessType.FULL_ACCESS;
            }
            else if (accessInfo.AccessValue == "2")
            {
                return AccessType.EDIT_ONLY;
            }
            else if (accessInfo.AccessValue == "3")
            {
                return AccessType.READ_ONLY;
            }
            else
            {
                return AccessType.NO_ACCESS;
            }
        }

        public static List<UserPermissions> ValidateUserPrivileges(int siteID, int userSiteID, int userID, int accessLevelId, List<int> pageIDListString)
        {
            List<UserPermissions> userPermissionList = null;
            if (accessLevelId == 4 || accessLevelId == 5)
            {
                //make sure query string site id & user site id are same
                if (siteID != userSiteID)
                    return userPermissionList;
            }

            if (pageIDListString.Count > 0)
            {
                if (accessLevelId == 2 || accessLevelId == 3) // For Regional and Country Level User  
                {
                    int[] userSiteIDList = BLL.UserBLL.GetPlantUserSites(userID);
                    if (!(userSiteIDList.Contains(siteID)))
                        return userPermissionList;
                }
                else if (accessLevelId == 1 || accessLevelId == 6) // For Company Level and Portal Admin User
                {
                    userPermissionList = new List<UserPermissions>();
                    foreach (int pageID in pageIDListString)
                    {
                        UserPermissions permission = new UserPermissions();
                        permission.PageIDNumber = pageID;
                        permission.AccessValue = "1";
                        userPermissionList.Add(permission);
                    }                  
                }

                userPermissionList = BLL.UserBLL.GetUserPermissions(userID,siteID, pageIDListString);
    
            }

            return userPermissionList;
        }

        public static string ValidateUserPrivileges(string Access)
        {
            try
            {
                if (Access.Length == 3)
                {
                    if (Access.Substring(0, 1) == "1")
                        return "1";     //Full control
                    else if (Access.Substring(1, 1) == "1")
                        return "2";    //Can only edit but no add new & delete
                    else if (Access.Substring(2, 1) == "1")
                        return "3";    //Read only
                    else
                        return "0";     // no access
                }
                else
                    return "0";
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        //public static ProductionLineInfo[] GetUserProductionLines(BasicParam basicParam)
        //{
        //    SOPServiceClient service = new SOPServiceClient();
        //    try
        //    {
        //        ProductionLineInfo[] output = service.GetUserProductionLines(basicParam).ToArray();
        //        service.Close();
        //        return output;
        //    }
        //    catch
        //    {
        //        service.Abort();
        //        throw;
        //    }
        //}

        public static string GetFormattedDate(string value, string format)
        {
            if (value == "0")
            {
                return string.Empty;
            }
            else
            {
                DateTime date;
                DateTime.TryParseExact(value.Trim(), "yyyyMMdd", CultureInfo.InvariantCulture, DateTimeStyles.None, out date);

                return date.ToString(format);
            }
        }

        public static AccessType GetAccessValue(string accessValue)
        {
            if (accessValue == "1")
            {
                return AccessType.FULL_ACCESS;
            }
            else if (accessValue == "2")
            {
                return AccessType.EDIT_ONLY;
            }
            else if (accessValue == "3")
            {
                return AccessType.READ_ONLY;
            }
            else
            {
                return AccessType.NO_ACCESS;
            }
        }
    }    


    public enum PageDisplayType
    {
        None = 0,
        PlannerView = 1,
        SchedulerView = 2
    }

    public enum AccessType
    {
        FULL_ACCESS = 1,
        EDIT_ONLY = 2,
        READ_ONLY = 3,
        NO_ACCESS = 0
    }
}