using iPAS_ExceptionHandler;
using Microsoft.Practices.EnterpriseLibrary.Data;
using OfficeOpenXml;
using OfficeOpenXml.DataValidation;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Drawing;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Runtime.Serialization;
using System.Web;
using Vegam_MaintenanceService_DAL;

namespace Vegam_MaintenanceService
{
    public class Common
    {
        #region Common
        internal static string GetSafeString(IDataReader dataReader, string psColumnName)
        {
            if (!System.DBNull.Value.Equals(dataReader[psColumnName]))
                return dataReader.GetString(dataReader.GetOrdinal(psColumnName)).Trim();
            else
                return string.Empty;
        }

        internal static Int32 GetSafeInt32(IDataReader dataReader, string psColumnName)
        {
            if (!System.DBNull.Value.Equals(dataReader[psColumnName]))
            {
                try
                {
                    return dataReader.GetInt32(dataReader.GetOrdinal(psColumnName));
                }
                catch
                {
                    int intValue = 0;
                    string value = dataReader.GetString(dataReader.GetOrdinal(psColumnName));
                    Int32.TryParse(value, out intValue);
                    return intValue;
                }
            }
            else
                return 0;
        }

        internal static Int64 GetSafeInt64(IDataReader dataReader, string psColumnName)
        {
            if (!System.DBNull.Value.Equals(dataReader[psColumnName]))
            {
                try
                {
                    return dataReader.GetInt64(dataReader.GetOrdinal(psColumnName));
                }
                catch
                {
                    Int64 intValue = 0;
                    string value = dataReader.GetString(dataReader.GetOrdinal(psColumnName));
                    Int64.TryParse(value, out intValue);
                    return intValue;
                }
            }
            else
                return 0;
        }

        internal static Decimal GetSafeDecimal(IDataReader dataReader, string psColumnName)
        {
            if (!System.DBNull.Value.Equals(dataReader[psColumnName]))
            {
                try
                {
                    return dataReader.GetDecimal(dataReader.GetOrdinal(psColumnName));
                }
                catch
                {
                    decimal decimalValue = 0;
                    string value = dataReader.GetString(dataReader.GetOrdinal(psColumnName));
                    decimal.TryParse(value, out decimalValue);
                    return decimalValue;
                }
            }
            else
                return 0;
        }

        internal static Int32 GetSafeChar(IDataReader dataReader, string psColumnName)
        {
            if (!System.DBNull.Value.Equals(dataReader[psColumnName]))
                try
                {
                    return dataReader.GetChar(dataReader.GetOrdinal(psColumnName));
                }
                catch
                {
                    string value = dataReader.GetString(dataReader.GetOrdinal(psColumnName)).Trim();
                    return Convert.ToChar(value);
                }
            else
                return 0;
        }
        #endregion

        #region LogException
        internal static void LogException(Exception ex, string pageName, string customMessage, string moduleName, string functionName, string userID)
        {
            (new ExceptionProcessor()).ProcessException(ex, pageName, customMessage, moduleName, functionName, userID);
        }

        #endregion

        #region General
        public static string GetErrorMessage(string ErrorMessage)
        {
            string exceptionErrorMessage = ErrorMessage;
            if (ConfigurationManager.AppSettings["EnableCustomException"] != null)
            {
                string showCustomException = ConfigurationManager.AppSettings["EnableCustomException"].ToString().ToUpper();
                if (showCustomException == "TRUE" && exceptionErrorMessage.ToUpper().Contains("ORA"))
                {
                    exceptionErrorMessage = "Failed to perform the operation";
                }
            }
            return exceptionErrorMessage;
        }

        public static string GetFormatedDate(string excelDate, string siteDateFormat)
        {
            string finalDate = string.Empty;
            int year = 0, month = 0, day = 0;
            string[] dateArray = null;
            string[] separateDate = excelDate.Split(' ');

            switch (siteDateFormat)
            {
                case "dd/MM/yyyy":
                    dateArray = separateDate[0].ToString().Split('/');
                    if (dateArray.Length == 3)
                    {
                        int.TryParse(dateArray[0], out day);
                        int.TryParse(dateArray[1], out month);
                        int.TryParse(dateArray[2], out year);
                        finalDate = day.ToString().PadLeft(2, '0') + "/" + month.ToString().PadLeft(2, '0') + "/" + year.ToString();
                    }

                    break;
                case "dd-MM-yyyy":
                    dateArray = separateDate[0].ToString().Split('-');
                    if (dateArray.Length == 3)
                    {
                        int.TryParse(dateArray[0], out day);
                        int.TryParse(dateArray[1], out month);
                        int.TryParse(dateArray[2], out year);
                        finalDate = day.ToString().PadLeft(2, '0') + "-" + month.ToString().PadLeft(2, '0') + "-" + year.ToString();
                    }
                    break;
                case "dd.MM.yyyy":
                    dateArray = separateDate[0].ToString().Split('.');
                    if (dateArray.Length == 3)
                    {
                        int.TryParse(dateArray[0], out day);
                        int.TryParse(dateArray[1], out month);
                        int.TryParse(dateArray[2], out year);
                        finalDate = day.ToString().PadLeft(2, '0') + "." + month.ToString().PadLeft(2, '0') + "." + year.ToString();
                    }
                    break;
                case "MM/dd/yyyy":
                    dateArray = separateDate[0].ToString().Split('/');
                    if (dateArray.Length == 3)
                    {
                        int.TryParse(dateArray[0], out month);
                        int.TryParse(dateArray[1], out day);
                        int.TryParse(dateArray[2], out year);
                        finalDate = month.ToString().PadLeft(2, '0') + "/" + day.ToString().PadLeft(2, '0') + "/" + year.ToString();
                    }
                    break;
                case "MM-dd-yyyy":
                    dateArray = separateDate[0].ToString().Split('-');
                    if (dateArray.Length == 3)
                    {
                        int.TryParse(dateArray[0], out month);
                        int.TryParse(dateArray[1], out day);
                        int.TryParse(dateArray[2], out year);
                        finalDate = month.ToString().PadLeft(2, '0') + "-" + day.ToString().PadLeft(2, '0') + "-" + year.ToString();
                    }
                    break;
                case "MM.dd.yyyy":
                    dateArray = separateDate[0].ToString().Split('.');
                    if (dateArray.Length == 3)
                    {
                        int.TryParse(dateArray[0], out month);
                        int.TryParse(dateArray[1], out day);
                        int.TryParse(dateArray[2], out year);
                        finalDate = month.ToString().PadLeft(2, '0') + "." + day.ToString().PadLeft(2, '0') + "." + year.ToString();
                    }
                    break;
                case "yyyy/MM/dd":
                    dateArray = separateDate[0].ToString().Split('/');
                    if (dateArray.Length == 3)
                    {
                        int.TryParse(dateArray[0], out year);
                        int.TryParse(dateArray[1], out month);
                        int.TryParse(dateArray[2], out day);
                        finalDate = year.ToString() + "/" + day.ToString().PadLeft(2, '0') + "/" + month.ToString().PadLeft(2, '0');
                    }
                    break;
                case "yyyy-MM-dd":
                    dateArray = separateDate[0].ToString().Split('-');
                    if (dateArray.Length == 3)
                    {
                        int.TryParse(dateArray[0], out year);
                        int.TryParse(dateArray[1], out month);
                        int.TryParse(dateArray[2], out day);
                        finalDate = year.ToString().Trim() + "-" + day.ToString().PadLeft(2, '0') + "-" + month.ToString().PadLeft(2, '0');
                    }
                    break;
                case "yyyy.MM.dd":
                    dateArray = separateDate[0].ToString().Split('.');
                    if (dateArray.Length == 3)
                    {
                        int.TryParse(dateArray[0], out year);
                        int.TryParse(dateArray[1], out month);
                        int.TryParse(dateArray[2], out day);
                        finalDate = year.ToString() + "." + day.ToString().PadLeft(2, '0') + "/" + month.ToString().PadLeft(2, '0');
                    }
                    break;
            }

            return finalDate;
        }

        public static int ValidateDateFormatExcel(string value, string dateExcelFormat)
        {
            if (string.IsNullOrEmpty(value.Trim()) || string.IsNullOrWhiteSpace(value.Trim()))
                return 0;

            DateTime date;
            if (DateTime.TryParseExact(value.ToString(), dateExcelFormat, CultureInfo.InvariantCulture, DateTimeStyles.None, out date))
            {
                return Convert.ToInt32(date.ToString("yyyyMMdd", CultureInfo.InvariantCulture));
            }
            else
            {
                return -1; // Invalid date format
            }

        }
        #endregion

        #region Common_PlantInfo
        public static string GetDateFormat(int value, string dateFormat)
        {
            if (value == 0)
                return string.Empty;

            DateTime date;
            if (DateTime.TryParseExact(value.ToString(), "yyyyMMdd", CultureInfo.InvariantCulture, DateTimeStyles.None, out date))
            {
                return date.ToString(dateFormat, CultureInfo.InvariantCulture);
            }
            return value.ToString();
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

        internal static void GetSiteDateTimeFormat(Database db, int siteId, ref string siteDateFormat, ref string siteTimeFormat)
        {
            IDataReader dataReader = null;
            try
            {
                dataReader = CommonDAL.GetSiteDateTimeFormat(db, siteId);
                if (dataReader.Read())
                {
                    siteDateFormat = Common.GetSafeString(dataReader, "FSITE_DATEFORMAT");
                    siteTimeFormat = Common.GetSafeString(dataReader, "FSITE_TIMEFORMAT");
                }
                dataReader.Close();
            }
            catch
            {
                throw;
            }
            finally
            {
                if (dataReader != null && !dataReader.IsClosed)
                    dataReader.Close();
            }
        }

        public static void GetCurrentSiteDateTime(Database db, int siteID, ref int currentDate, ref int currentTime)
        {
            IDataReader dataReaderTimeZone = null;
            string destinationTimeZone = string.Empty;
            string timeZoneName = string.Empty;
            try
            {
                dataReaderTimeZone = CommonDAL.GetTimeZoneName(db, siteID);
                if (dataReaderTimeZone.Read())
                {
                    timeZoneName = Common.GetSafeString(dataReaderTimeZone, "FTIMEZONE");
                }
                dataReaderTimeZone.Close();

                TimeZoneInfo zoneIdInfo = TimeZoneInfo.Local;
                destinationTimeZone = GetTimeZoneName(timeZoneName);

                DateTime createdON = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(DateTime.Now, zoneIdInfo.Id, destinationTimeZone);
                string formatedCreatedDate = createdON.ToString("yyyyMMdd", CultureInfo.InvariantCulture);
                string formatedTime = createdON.ToString("HHmmss");

                currentDate = Convert.ToInt32(formatedCreatedDate);
                currentTime = Convert.ToInt32(formatedTime);
            }
            catch (Exception ex)
            {
                Common.LogException(ex, "Common", "Error while getting time zone ", "iPAS_Service", System.Reflection.MethodBase.GetCurrentMethod().Name, "SiteID: " + siteID);
                throw;
            }
            finally
            {
                if (dataReaderTimeZone != null && !dataReaderTimeZone.IsClosed)
                {
                    dataReaderTimeZone.Close();
                }
            }
        }

        public static string GetTimeZoneName(string timeZoneName)
        {
            string destinationTimeZone = string.Empty;
            switch (timeZoneName)
            {
                case "Asia/Shanghai":
                case "Asia/Hong_Kong":
                case "Asia/Urumqi":
                    return destinationTimeZone = "China Standard Time";

                case "Asia/Dhaka":
                    return destinationTimeZone = "Bangladesh Standard Time";

                case "Asia/Calcutta":
                case "Asia/Kolkata":
                    return destinationTimeZone = "India Standard Time";

                case "Asia/Colombo":
                    return destinationTimeZone = "Sri Lanka Standard Time";

                case "Asia/Baku":
                    return destinationTimeZone = "Azerbaijan Standard Time";

                case "Asia/Baghdad":
                    return destinationTimeZone = "Arabic Standard Time";

                case "Asia/Istanbul":
                    return destinationTimeZone = "Turkey Standard Time";

                case "Asia/Jakarta":
                case "Asia/Bangkok":
                    return destinationTimeZone = "SE Asia Standard Time";

                case "Australia/Sydney":
                case "Australia/Canberra":
                case "Australia/Melbourne":
                    return destinationTimeZone = "AUS Eastern Standard Time";

                case "Australia/Victoria":
                    return destinationTimeZone = "GMT Standard Time";

                case "Asia/Tehran":
                    return destinationTimeZone = "Iran Standard Time";

                case "Asia/Tbilisi":
                    return destinationTimeZone = "Georgian Standard Time";

                case "Asia/Kuwait":
                case "Asia/Riyadh":
                    return destinationTimeZone = "Arab Standard Time";

                case "Asia/Beirut":
                    return destinationTimeZone = "Middle East Standard Time";

                case "Asia/Amman":
                    return destinationTimeZone = "Jordan Standard Time";

                case "Asia/Damascus":
                    return destinationTimeZone = "Syria Standard Time";

                case "Asia/Irkutsk":
                    return destinationTimeZone = "North Asia East Standard Time";

                case "Asia/Jerusalem":
                    return destinationTimeZone = "Israel Standard Time";

                case "Asia/Kabul":
                    return destinationTimeZone = "Afghanistan Standard Time";

                case "Asia/Karachi":
                    return destinationTimeZone = "Pakistan Standard Time";

                case "Asia/Kathmandu":
                    return destinationTimeZone = "Nepal Standard Time";

                case "Asia/Krasnoyarsk":
                    return destinationTimeZone = "North Asia Standard Time";

                case "Asia/Kuala_Lumpur":
                case "Asia/Singapore":
                    return destinationTimeZone = "Singapore Standard Time";

                case "Asia/Magadan":
                    return destinationTimeZone = "Magadan Standard Time";

                case "Asia/Muscat":
                    return destinationTimeZone = "Arabian Standard Time";

                case "Asia/Novosibirsk":
                    return destinationTimeZone = "N. Central Asia Standard Time";

                case "Asia/Rangoon":
                    return destinationTimeZone = "Myanmar Standard Time";

                case "Asia/Seoul":
                    return destinationTimeZone = "Korea Standard Time";

                case "Asia/Taipei":
                    return destinationTimeZone = "Taipei Standard Time";

                case "Asia/Tashkent":
                    return destinationTimeZone = "West Asia Standard Time";

                case "Asia/Tokyo":
                    return destinationTimeZone = "Tokyo Standard Time";

                case "Asia/Ulaanbaatar":
                    return destinationTimeZone = "Ulaanbaatar Standard Time";

                case "Asia/Vladivostok":
                    return destinationTimeZone = "Vladivostok Standard Time";

                case "Asia/Yakutsk":
                    return destinationTimeZone = "Yakutsk Standard Time";

                case "Asia/Yerevan":
                    return destinationTimeZone = "Caucasus Standard Time";

                case "Australia/Adelaide":
                    return destinationTimeZone = "Cen. Australia Standard Time";

                case "Australia/Brisbane":
                    return destinationTimeZone = "E. Australia Standard Time";

                case "Australia/Darwin":
                    return destinationTimeZone = "AUS Central Standard Time";

                case "Australia/Hobart":
                case "Australia/Tasmania":
                    return destinationTimeZone = "Tasmania Standard Time";

                case "Australia/Perth":
                    return destinationTimeZone = "W. Australia Standard Time";

                //Bien Hoa - Bug #3421] Plant Time Zone start
                case "Asia/Ho_Chi_Minh":
                case "Asia/Hovd":
                    return destinationTimeZone = "SE Asia Standard Time";
                //end
                case "Europe/Berlin":
                    return destinationTimeZone = "W. Europe Standard Time";
                default:
                    return destinationTimeZone = "India Standard Time";

            }

        }

        public static SiteDateTimeFormatInfo GetSiteDateTimeFormatInfo(Database db, int siteID)
        {
            IDataReader dateTimeFormatReader = null;
            try
            {
                SiteDateTimeFormatInfo dateTimeInfo = new SiteDateTimeFormatInfo();

                dateTimeFormatReader = CommonDAL.GetSiteDateTimeFormat(db, siteID);
                if (dateTimeFormatReader.Read())
                {
                    dateTimeInfo.DateFormat = Common.GetSafeString(dateTimeFormatReader, "FSITE_DATEFORMAT");
                    dateTimeInfo.TimeFormat = Common.GetSafeString(dateTimeFormatReader, "FSITE_TIMEFORMAT");
                }
                dateTimeFormatReader.Close();

                return dateTimeInfo;
            }
            catch
            {
                throw;
            }
            finally
            {
                if (dateTimeFormatReader != null && !dateTimeFormatReader.IsClosed)
                    dateTimeFormatReader.Close();
            }
        }

        public static List<int> GetActiveSites(Database db)
        {
            IDataReader activeSiteReader = null;
            try
            {
                List<int> activeSiteList = new List<int>();

                activeSiteReader = CommonDAL.GetActiveSitesInfo(db);
                while (activeSiteReader.Read())
                {
                    activeSiteList.Add(Common.GetSafeInt32(activeSiteReader, "FSITEID"));
                }
                activeSiteReader.Close();

                return activeSiteList;
            }
            catch
            {
                throw;
            }
            finally
            {
                if (activeSiteReader != null && !activeSiteReader.IsClosed)
                    activeSiteReader.Close();
            }
        }

        public static string GetActiveSitesBasedOnModules(Database db, bool stockReceiptEnable, bool stagingOrManufactureEnable, bool dispatchEnable, bool labelSolutionEnable, bool dStoreEnable, bool considerSAPActiveStatus, bool maintenanceEnable)
        {
            IDataReader siteDataReader = null;
            try
            {
                string activeSites = string.Empty;
                siteDataReader = CommonDAL.GetActiveSitesBasedOnModules(db, stockReceiptEnable, stagingOrManufactureEnable, dispatchEnable, labelSolutionEnable, dStoreEnable, considerSAPActiveStatus, maintenanceEnable);

                while (siteDataReader.Read())
                {

                    if (activeSites.Trim().Length == 0)
                    {
                        activeSites = Common.GetSafeInt32(siteDataReader, "FSITEID").ToString();
                    }
                    else
                    {
                        activeSites = activeSites + "," + Common.GetSafeInt32(siteDataReader, "FSITEID").ToString();
                    }
                }

                siteDataReader.Close();

                return activeSites;
            }
            catch
            {
                throw;
            }
            finally
            {
                if (siteDataReader != null && !siteDataReader.IsClosed)
                {
                    siteDataReader.Close();
                }
            }
        }
        #endregion

        #region User Permissions

        public static AccessType ValidateUserPrivileges(Database db, int siteID, int userID, int pageID)
        {
            IDataReader dataReaderUserSites = null;
            int accessLevelId = 0;
            int userSiteID = 0;
            try
            {
                if (pageID != 0)
                {
                    dataReaderUserSites = CommonDAL.GetPlantUserSite(db, userID);
                    if (dataReaderUserSites.Read())
                    {
                        userSiteID = Common.GetSafeInt32(dataReaderUserSites, "FSITEID");
                        accessLevelId = Common.GetSafeInt32(dataReaderUserSites, "FACCESSLEVELID");
                    }
                    dataReaderUserSites.Close();


                    if (accessLevelId == 1 || accessLevelId == 6) // For Company Level and Portal Admin User
                    {
                        return AccessType.FULL_ACCESS;
                    }
                    else
                    {
                        if (userSiteID > 0 && userSiteID != siteID)
                        {
                            return AccessType.NO_ACCESS;
                        }
                        else
                        {
                            int[] userSiteIDList = GetPlantUserSites(db, userID, accessLevelId).ToArray();
                            if (!(userSiteIDList.Contains(siteID)))
                                return AccessType.NO_ACCESS;
                        }
                    }

                    //returns 1 - FULL CONTROL ,2 - EDIT ONLY ,3 - READ ONLY or 0 - NO ACCESS
                    //return AccessType.FULL_ACCESS;
                    string accessValue = GetUserAssignedPermissions(db, userID, pageID);
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
                else
                {
                    return AccessType.NO_ACCESS;
                }
            }
            catch
            {
                throw;
            }
            finally
            {
                if (dataReaderUserSites != null && !dataReaderUserSites.IsClosed)
                {
                    dataReaderUserSites.Close();
                }
            }
        }

        private static List<int> GetPlantUserSites(Database db, int userID, int accessLevelID)
        {
            IDataReader dataReaderUserSites = null;
            List<int> userSites = new List<int>();
            try
            {
                if (accessLevelID == 4 || accessLevelID == 5)
                {
                    dataReaderUserSites = CommonDAL.GetPlantUserSite(db, userID);
                }
                else
                {
                    dataReaderUserSites = CommonDAL.GetPlantUserSites(db, userID);
                }

                while (dataReaderUserSites.Read())
                {
                    userSites.Add(Common.GetSafeInt32(dataReaderUserSites, "FSITEID"));
                }
                dataReaderUserSites.Close();

                return userSites;
            }
            catch
            {
                throw;
            }
            finally
            {
                if (dataReaderUserSites != null && !dataReaderUserSites.IsClosed)
                {
                    dataReaderUserSites.Close();
                }
            }
        }

        private static string GetUserAssignedPermissions(Database db, int userID, int pageID)
        {
            IDataReader dataReaderUser = null;
            try
            {
                string accessValue = "0";
                string dbAccessValue = "0";

                dataReaderUser = CommonDAL.GetUserAssignedPermissions(db, userID, pageID);

                if (dataReaderUser.Read())
                {
                    dbAccessValue = Common.GetSafeString(dataReaderUser, "FACCESS");
                }
                dataReaderUser.Close();

                if (dbAccessValue.Length == 3)
                {
                    if (dbAccessValue.Substring(0, 1) == "1")
                        accessValue = "1";     //Full control
                    else if (dbAccessValue.Substring(1, 1) == "1")
                        accessValue = "2";    //Can only edit but no add new & delete
                    else if (dbAccessValue.Substring(2, 1) == "1")
                        accessValue = "3";    //Read only
                    else
                        accessValue = "0";     // no access
                }
                else
                    accessValue = "0";

                return accessValue;
            }
            catch
            {
                throw;
            }
            finally
            {
                if (dataReaderUser != null && !dataReaderUser.IsClosed)
                {
                    dataReaderUser.Close();
                }
            }
        }

        public enum AccessType
        {
            FULL_ACCESS = 1,
            EDIT_ONLY = 2,
            READ_ONLY = 3,
            NO_ACCESS = 0
        }

        #endregion

        #region ImageUpload
        public static Size NewImageSize(int OriginalHeight, int OriginalWidth, double FormatSize)
        {
            Size NewSize;
            double tempval;
            if (OriginalHeight > FormatSize && OriginalWidth > FormatSize)
            {
                if (OriginalHeight > OriginalWidth)
                    tempval = FormatSize / Convert.ToDouble(OriginalHeight);
                else
                    tempval = FormatSize / Convert.ToDouble(OriginalWidth);
                NewSize = new Size(Convert.ToInt32(tempval * OriginalWidth), Convert.ToInt32(tempval * OriginalHeight));
            }
            else
                NewSize = new Size(OriginalWidth, OriginalHeight);
            return NewSize;
        }
        #endregion

        public static string GetUserName(Database db, int userID)
        {
            string userName = string.Empty;

            DataTable userNameTable = CommonDAL.GetUserName(db, userID);
            if (userNameTable.Rows.Count > 0)
                userName = Convert.ToString(userNameTable.Rows[0]["USERNAME"]);

            return userName;
        }

        public static int GetUserAccessLevelID(Database db, int userID)
        {
            IDataReader dataReaderUser = null;
            int accessLevelID = 0;
            try
            {
                dataReaderUser = CommonDAL.GetUserAccessLevelID(db, userID);

                if (dataReaderUser.Read())
                {
                    accessLevelID = Common.GetSafeInt32(dataReaderUser, "FACCESSLEVELID");
                }
                dataReaderUser.Close();

                return accessLevelID;
            }
            catch
            {
                if(dataReaderUser != null & !dataReaderUser.IsClosed)
                {
                    dataReaderUser.Close();
                }

                throw;
            }
        }
        public static void BindExcelCellListData(ExcelPackage package, ExcelWorksheet workSheet, string hiddenDataSheetName, int columnIndex, List<string> listData, bool allowNewEntries)
        {
            var dataCell = workSheet.DataValidations.AddListValidation(ExcelRange.GetAddress(2, columnIndex, ExcelPackage.MaxRows, columnIndex));

            ExcelWorksheet dataSheet = package.Workbook.Worksheets.Add(hiddenDataSheetName);
            dataSheet.Hidden = eWorkSheetHidden.Hidden;//hiding the hidden Sheet from user

            int rowIndex = 1;
            foreach (string strData in listData)
            {
                dataSheet.Cells[rowIndex, 1].Value = strData;
                rowIndex++;
            }

            string cellRangeStatusList = "=" + dataSheet.ToString() + "!" + "$A$1:$A$" + rowIndex.ToString();
            dataCell.Formula.ExcelFormula = cellRangeStatusList;
            if (!allowNewEntries)
            {
                dataCell.ShowErrorMessage = true;
                dataCell.PromptTitle = "Invalid Selection";
                dataCell.Error = "Please select from list";
            }
            dataCell.AllowBlank = true;
        }

        public static void BindDataValidationForExcel(Database db, ExcelWorksheet worksheet, ExcelPackage package, int columnIndex, string enumSheetName, string enumType, int minValue, int maxValue, string columnName, ExcelDataValidation dataValidationType)
        {
            try
            {
                switch (dataValidationType)
                {

                    case ExcelDataValidation.TextLength:
                        #region Text Length Data Validation 
                        var textcolumn = worksheet.DataValidations.AddTextLengthValidation(ExcelRange.GetAddress(2, columnIndex, ExcelPackage.MaxRows, columnIndex));

                        textcolumn.ShowErrorMessage = true;
                        textcolumn.ErrorStyle = ExcelDataValidationWarningStyle.stop;
                        textcolumn.ErrorTitle = "Error";
                        textcolumn.Error = string.Format(columnName + " must be less than or equal to {0} characters.", maxValue);
                        textcolumn.Formula.Value = minValue;
                        textcolumn.Formula2.Value = maxValue;
                        textcolumn.AllowBlank = false;
                        textcolumn.ShowInputMessage = true;
                        //textcolumn.Prompt = "Please enter " + columnName;
                        break;
                    #endregion

                    case ExcelDataValidation.Integer:
                        #region Integer Data Validation 
                        var integercolumn = worksheet.DataValidations.AddIntegerValidation(ExcelRange.GetAddress(2, columnIndex, ExcelPackage.MaxRows, columnIndex));

                        integercolumn.ErrorStyle = ExcelDataValidationWarningStyle.stop;
                        integercolumn.PromptTitle = "Enter a integer value here";
                        integercolumn.Prompt = "Value should be between 0 and 9";
                        integercolumn.ShowInputMessage = true;
                        integercolumn.ErrorTitle = "Invalid data error";
                        integercolumn.Error = string.Format(columnName + " must be between {0} and {1}.", 1, 9);
                        integercolumn.ShowErrorMessage = true;
                        integercolumn.Operator = ExcelDataValidationOperator.between;
                        integercolumn.Formula.Value = 0;
                        integercolumn.Formula2.Value = maxValue;
                        break;
                    #endregion
                    case ExcelDataValidation.DecimalValidationWithMaxLength:
                        #region Decimal Data Validation 

                        var decimalcolumn2 = worksheet.DataValidations.AddDecimalValidation(ExcelRange.GetAddress(2, columnIndex, ExcelPackage.MaxRows, columnIndex));

                        decimalcolumn2.ShowErrorMessage = true;
                        decimalcolumn2.ErrorStyle = ExcelDataValidationWarningStyle.stop;
                        decimalcolumn2.ErrorTitle = "Invalid data error";
                        decimalcolumn2.Error = "Value must be numeric and less than or equal to " + maxValue + " digits";
                        decimalcolumn2.Formula.Value = minValue;
                        //decimalcolumn2.Formula.Value = 0D;

                        string maxChar = string.Empty;
                        for (int i = 0; i < maxValue; i++)
                            maxChar += "9";
                        decimalcolumn2.Operator = ExcelDataValidationOperator.between;
                        decimalcolumn2.Formula2.Value = Convert.ToDouble(maxChar);
                        break;
                    #endregion
                    default:
                        break;
                }
            }
            catch
            {
                throw;
            }
        }

        public static void GetDynamicSearchFieldValueInfo(Database db, List<DynamicGrid.DynamicGridFilterValueInfo> filterValueInfoList, ref List<DynamicGrid.SQLColumnFilterInfo> dbFilterColumnInfoList)
        {
            IDataReader fieldInfoReader = null;
            try
            {
                if (dbFilterColumnInfoList == null)
                    dbFilterColumnInfoList = new List<DynamicGrid.SQLColumnFilterInfo>();

                string selectedFieldIDListString = "'" + string.Join("','", filterValueInfoList.Select(filterColumn => filterColumn.FieldID)) + "'";

                fieldInfoReader = DynamicGrid.DynamicGridDAL.GetFilterSelectedObjectFields(db, selectedFieldIDListString);
                while (fieldInfoReader.Read())
                {
                    int fieldID = Common.GetSafeInt32(fieldInfoReader, "FFIELDID");
                    DynamicGrid.DynamicGridFilterValueInfo filterColumnInfo = filterValueInfoList.FirstOrDefault(filterInfo => filterInfo.FieldID == fieldID);
                    if (filterColumnInfo != null && filterColumnInfo.FilterValueList.Count > 0)
                    {
                        dbFilterColumnInfoList.Add(DynamicGrid.Common.GetSQLColumnfilterInfo(fieldInfoReader, filterColumnInfo));
                    }
                }
                fieldInfoReader.Close();
            }
            catch
            {
                throw;
            }
            finally
            {
                if (fieldInfoReader != null && !fieldInfoReader.IsClosed)
                    fieldInfoReader.Close();
            }
        }

        public static void GetSiteDateTimeFromUtc(Database db, int siteID, long utcDateTimeValue, ref int siteDate, ref int siteTime, ref int timeZoneOffset)
        {
            IDataReader dataReaderTimeZone = null;
            string timeZoneName = string.Empty;
            try
            {
                dataReaderTimeZone = CommonDAL.GetTimeZoneName(db, siteID);
                if (dataReaderTimeZone.Read())
                {
                    timeZoneName = Common.GetSafeString(dataReaderTimeZone, "FTIMEZONE");
                }
                dataReaderTimeZone.Close();

                var utcDateTime = new DateTime(1970, 1, 1);
                utcDateTime = utcDateTime.AddMilliseconds(utcDateTimeValue);
                utcDateTime = DateTime.SpecifyKind(utcDateTime, DateTimeKind.Utc);

                string siteTimeZoneID = GetTimeZoneName(timeZoneName);
                TimeZoneInfo siteTimeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(siteTimeZoneID);

                DateTime siteDateTime = TimeZoneInfo.ConvertTimeFromUtc(utcDateTime, siteTimeZoneInfo);

                timeZoneOffset = (int)(siteDateTime - utcDateTime).TotalMinutes;

                int.TryParse(siteDateTime.ToString("yyyyMMdd", CultureInfo.InvariantCulture), out siteDate);
                int.TryParse(siteDateTime.ToString("HHmmss", CultureInfo.InvariantCulture), out siteTime);
            }
            catch (Exception ex)
            {
                Common.LogException(ex, "Common", "Error while getting time zone ", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "SiteID: " + siteID);
                throw;
            }
            finally
            {
                if (dataReaderTimeZone != null && !dataReaderTimeZone.IsClosed)
                {
                    dataReaderTimeZone.Close();
                }
            }
        }

        //Get DateTime from UtcDateTime
        public static long GetDateTimeFromUtc(string utcDateTimeValue)
        {
            long utcTimestamp = 0;
            try
            {
                long longUtcDatetimeValue = 0;
                Int64.TryParse(utcDateTimeValue, out longUtcDatetimeValue);

                var utcDateTime = new DateTime(1970, 1, 1);
                utcDateTime = utcDateTime.AddMilliseconds(longUtcDatetimeValue);
                utcDateTime = DateTime.SpecifyKind(utcDateTime, DateTimeKind.Utc);
                
                Int64.TryParse(utcDateTime.ToString("yyyyMMddHHmmss", CultureInfo.InvariantCulture), out utcTimestamp);
                return utcTimestamp;
            }
            catch (Exception ex)
            {
                Common.LogException(ex, "Common", "Error while getting utc datetime ", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "utcDateTimeValue: " + utcDateTimeValue);
                throw;
            }
        }
    }
    [DataContract]
    public enum ExcelDataValidation
    {
        [EnumMember]
        TextLength = 1,
        [EnumMember]
        Integer = 2,
        [EnumMember]
        DecimalValidationWithMaxLength = 3
    }

    [DataContract]
    public class BasicParam
    {
        private int _siteID = 0;
        private int _userID = 0;
        private int _accessLevelID = 0;
        private string _languageCode = string.Empty;


        [DataMember(IsRequired = true)]
        public int AccessLevelID
        {
            get { return _accessLevelID; }
            set { _accessLevelID = value; }
        }

        [DataMember(IsRequired = true)]
        public int UserID
        {
            get { return _userID; }
            set { _userID = value; }
        }

        [DataMember(IsRequired = true)]
        public int SiteID
        {
            get { return _siteID; }
            set { _siteID = value; }
        }

        [DataMember]
        public string LanguageCode
        {
            get { return _languageCode; }
            set { _languageCode = value; }
        }
    }

    [DataContract]
    public class ReturnBasicInfo
    {
        private int _errorCode = 0;
        private string _errorMessage = string.Empty;

        [DataMember]
        public int ErrorCode
        {
            get { return _errorCode; }
            set { _errorCode = value; }
        }

        [DataMember]
        public string ErrorMessage
        {
            get { return _errorMessage; }
            set { _errorMessage = value; }
        }
    }

    [DataContract]
    public enum LogTypes
    {
        [EnumMember]
        Config_Functional_Location = 1,
        [EnumMember]
        Config_Equipment_Info = 2,
        [EnumMember]
        Config_Measuring_Point = 3,
        [EnumMember]
        Config_EquipmentModel_Info = 4,
        [EnumMember]
        Config_Document_Info = 5,
        [EnumMember]
        Config_WorkGroup_Info = 6,
        [EnumMember]
        Config_Tool_Info = 7,
        [EnumMember]
        Reading_Result_Info = 8,
        [EnumMember]
        Notification_Info = 9
    }

    [DataContract]
    public class SiteDateTimeFormatInfo
    {
        #region Private Fields

        private string _dateFormat = string.Empty;
        private string _timeFormat = string.Empty;

        #endregion

        #region Properties

        [DataMember]
        public string DateFormat
        {
            get { return _dateFormat; }
            set { _dateFormat = value; }
        }

        [DataMember]
        public string TimeFormat
        {
            get { return _timeFormat; }
            set { _timeFormat = value; }
        }

        #endregion
    }


    [DataContract]
    public class DynamicGridSearchInfo
    {
        [DataMember]
        public List<DynamicGrid.DynamicGridFilterValueInfo> DynamicGridSearchFieldValueInfoList { get; set; } = new List<DynamicGrid.DynamicGridFilterValueInfo>();
    }

    [DataContract]
    public class DateTimeInfo
    {
        [DataMember]
        public int CurrentDate { get; set; } = 0;
        [DataMember]
        public int CurrentTime { get; set; } = 0;
    }

    [DataContract]
    public class EnumTypeInfo
    {
        [DataMember]
        public string TypeValue { get; set; } = string.Empty;
        [DataMember]
        public string DisplayName { get; set; } = string.Empty;
        [DataMember]
        public string ImageName { get; set; } = string.Empty;
        [DataMember]
        public bool IsDefault { get; set; } = false;
    }
}