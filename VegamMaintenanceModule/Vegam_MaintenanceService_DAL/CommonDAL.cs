using Microsoft.Practices.EnterpriseLibrary.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Vegam_MaintenanceService_DAL
{
    public class CommonDAL
    {
        public static IDataReader GetActiveSitesInfo(Database db)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FSITEID FROM LDB1_COUNTRY_SITES WHERE FSTATUS='A' ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetActiveSitesBasedOnModules(Database db, bool stockReceiptEnable, bool stagingOrManufactureEnable, bool dispatchEnable, bool labelSolutionEnable, bool dStoreEnable, bool considerSAPActiveStatus, bool maintenanceEnable)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();

            sqlCmdBuilder.Append(" SELECT CS.FSITEID,CS.FSITE_NAME FROM LDB1_COUNTRY_SITES CS");

            if (considerSAPActiveStatus) // Checking SAP Connection sites
            {
                //This code is need to be updated once multi sap connection changes has been released.
                //sqlCmdBuilder.Append(" INNER JOIN LDB1_SITECONNECTIONS SC ON CS.FSITEID=SC.FSITEID AND SC.FSTATUS='A' ");
                //sqlCmdBuilder.Append(" WHERE CS.FSTATUS='A' AND CS.FSAPSTATUS <> 'D' AND NVL(SC.FCONNECTIONTYPE,'S') <> 'E' "); // consider not excel connections
                sqlCmdBuilder.Append(" WHERE CS.FSTATUS='A'  ");
            }
            else
            {
                sqlCmdBuilder.Append(" WHERE CS.FSTATUS='A'  ");
            }

            string modulesEnable = string.Empty;
            if (stockReceiptEnable)
            {
                modulesEnable = " (CS.FSTOCKRECEIPT = 'Y') ";
            }

            if (stagingOrManufactureEnable)
            {
                if (modulesEnable.Length == 0)
                    modulesEnable = " (CS.FMANUFACTURE = 'Y' OR CS.FSTAGING = 'Y') ";
                else
                    modulesEnable = modulesEnable + " OR (CS.FMANUFACTURE = 'Y' OR CS.FSTAGING = 'Y') ";
            }

            if (dispatchEnable)
            {
                if (modulesEnable.Length == 0)
                    modulesEnable = " (CS.FDISPATCH = 'Y') ";
                else
                    modulesEnable = modulesEnable + " OR (CS.FDISPATCH = 'Y') ";
            }

            if (labelSolutionEnable)
            {
                if (modulesEnable.Length == 0)
                    modulesEnable = " (CS.FLABELPRINTSOLUTION = 'Y') ";
                else
                    modulesEnable = modulesEnable + " OR (CS.FLABELPRINTSOLUTION = 'Y') ";
            }

            if (dStoreEnable)
            {
                if (modulesEnable.Length == 0)
                    modulesEnable = " (CS.FENABLEDSTORE = 'Y') ";
                else
                    modulesEnable = modulesEnable + " OR (CS.FENABLEDSTORE = 'Y') ";
            }

            if (maintenanceEnable)
            {
                if (modulesEnable.Length == 0)
                    modulesEnable = " (CS.FENABLEMAINTENANCE = 'Y') ";
                else
                    modulesEnable = modulesEnable + " OR (CS.FENABLEMAINTENANCE = 'Y') ";
            }

            if (modulesEnable.Length > 0)
            {
                sqlCmdBuilder.Append(" AND (" + modulesEnable + ")");
            }

            System.Data.Common.DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            return db.ExecuteReader(dbCmd);
        }

        #region Common_PlantInfo
        public static IDataReader GetSiteDateTimeFormat(Database db, int siteID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FSITE_DATEFORMAT,FSITE_TIMEFORMAT FROM LDB1_COUNTRY_SITES WHERE FSITEID=:SITEID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetTimeZoneName(Database db, int siteID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();

            sqlCmdBuilder.Append(" SELECT FTIMEZONE FROM LDB1_COUNTRY_SITES WHERE FSITEID=:SITEID");
            System.Data.Common.DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            dbCmd.CommandType = CommandType.Text;
            return db.ExecuteReader(dbCmd);
        }
        #endregion

        #region General Log

        public static bool InsertLogInformation(Database db, DbTransaction transaction, int siteID, string logType, string logDescription, string logDesInEnglish, int createdBy, int createdDate, int createdTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append("INSERT INTO LDB1_LOGINFORMATIONS(FLOGID,FLOGTYPE,FLOGDESCRIPTION,FLOGDESINENGLISH,FSITEID,FCREATEDBY,FCREATEDON,FCREATEDTIME) ");
            sqlCmdBuilder.Append(" VALUES (SEQUENCE_LOGINFORMATIONS_ID.NEXTVAL,:LOGTYPE,:LOGDESCRIPTION,:LOGDESINENGLISH,:SITEID,:CREATEDBY,:CREATEDON,:CREATEDTIME) ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":LOGTYPE", DbType.AnsiStringFixedLength, logType);
            db.AddInParameter(dbCmd, ":LOGDESCRIPTION", DbType.String, logDescription);
            db.AddInParameter(dbCmd, ":LOGDESINENGLISH", DbType.String, logDesInEnglish);
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":CREATEDBY", DbType.Int32, createdBy);
            db.AddInParameter(dbCmd, ":CREATEDON", DbType.Int32, createdDate);
            db.AddInParameter(dbCmd, ":CREATEDTIME", DbType.Int32, createdTime);

            if (transaction != null)
                db.ExecuteNonQuery(dbCmd, transaction);
            else
                db.ExecuteNonQuery(dbCmd);
            return true;
        }

        #endregion

        #region User Permissions

        public static IDataReader GetPlantUserSite(Database db, int userID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT U.FSITEID,U.FACCESSLEVELID FROM LDB1_USERINFO U  ");
            sqlCmdBuilder.Append(" WHERE FUSERID=:USERID AND FSTATUS='A' ");

            System.Data.Common.DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;
            db.AddInParameter(dbCmd, ":USERID", DbType.Int32, userID);
            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetPlantUserSites(Database db, int userID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT U.FSITEID FROM LDB1_PLANTUSERINFO U INNER JOIN LDB1_COUNTRY_SITES S ON S.FSITEID = U.FSITEID ");
            sqlCmdBuilder.Append(" WHERE S.FSTATUS='A' AND FUSERID=:USERID ");

            System.Data.Common.DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;
            db.AddInParameter(dbCmd, ":USERID", DbType.Int32, userID);
            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetUserAssignedPermissions(Database db, int userID, int pageID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT TR.FACCESS FROM LDB1_USERROLE R INNER JOIN LDB1_ROLE_TASKS TR ");
            sqlCmdBuilder.Append(" ON TR.FROLEID = R.FROLEID INNER JOIN LDB1_TASKS T ON T.FTASKID=TR.FTASKID  ");
            sqlCmdBuilder.Append(" WHERE R.FUSERID=:FUSERID AND T.FIDNUM=:FIDNUM ORDER BY CAST(NVL(TR.FACCESS,0) AS NUMBER(4,0)) DESC ");

            System.Data.Common.DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;
            db.AddInParameter(dbCmd, ":FUSERID", DbType.Int32, userID);
            db.AddInParameter(dbCmd, ":FIDNUM", DbType.Int32, pageID);

            return db.ExecuteReader(dbCmd);
        }

        #endregion

        public static DataTable GetUserName(Database db, int userID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT INITCAP(FLASTNAME)||' '||INITCAP(FFIRSTNAME) AS USERNAME FROM LDB1_USERINFO WHERE FUSERID=:USERID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":USERID", DbType.Int32, userID);

            return db.ExecuteDataSet(dbCmd).Tables[0];
        }

        public static IDataReader GetUserAccessLevelID(Database db, int userID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT A.FACCESSLEVELID ");
            sqlCmdBuilder.Append(" FROM LDB1_USERINFO A  ");
            sqlCmdBuilder.Append(" WHERE A.FUSERID =:USERID ");

            System.Data.Common.DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;
            db.AddInParameter(dbCmd, ":USERID", DbType.Int32, userID);

            return db.ExecuteReader(dbCmd);
        }

        #region UserPreferences

        public static bool CheckUserPreferenceRecordExists(Database db, int userID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FUSERID FROM LDB1_MAINT_USERPREFERENCE WHERE FUSERID=:USERID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":USERID", DbType.Int32, userID);

            return db.ExecuteDataSet(dbCmd).Tables[0].Rows.Count > 0 ? true : false;
        }

        public static void InsertUserPreference(Database db, int userID, string preferanceLocIDs,string preferenceEquipIDS, int currentDate, int currentTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            StringBuilder sqlCmdBuilderValues = new StringBuilder();

            sqlCmdBuilder.Append(" INSERT INTO LDB1_MAINT_USERPREFERENCE( ");
            sqlCmdBuilder.Append(" FUSERID ");
            sqlCmdBuilderValues.Append(" VALUES( :USERID ");

            if (!string.IsNullOrEmpty(preferanceLocIDs))
            {
                sqlCmdBuilder.Append(" ,FLOCATIONIDS ");
                sqlCmdBuilderValues.Append(" ,:LOCATIONIDS ");
            }
            if (!string.IsNullOrEmpty(preferenceEquipIDS))
            {
                sqlCmdBuilder.Append(" ,FEQUIPMENTIDS ");
                sqlCmdBuilderValues.Append(" ,:EQUIPMENTIDS ");
            }

            sqlCmdBuilder.Append(" ,FLASTUPDATEDON,FLASTUPDATEDTIME)");
            sqlCmdBuilderValues.Append(" ,:CURRENTDATE,:CURRENTTIME)");
            
            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString() + " " + sqlCmdBuilderValues.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":USERID", DbType.Int32, userID);

            if (!string.IsNullOrEmpty(preferanceLocIDs))
                db.AddInParameter(dbCmd, ":LOCATIONIDS", DbType.String, preferanceLocIDs);

            if (!string.IsNullOrEmpty(preferenceEquipIDS))
                db.AddInParameter(dbCmd, ":EQUIPMENTIDS", DbType.String, preferenceEquipIDS);

            db.AddInParameter(dbCmd, ":CURRENTDATE", DbType.Int32, currentDate);
            db.AddInParameter(dbCmd, ":CURRENTTIME", DbType.Int32, currentTime);

            db.ExecuteNonQuery(dbCmd);
        }

        public static void UpdateUserPreference(Database db, int userID, string preferanceLocIDs, string preferenceEquipIDS, int currentDate, int currentTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_USERPREFERENCE SET FLASTUPDATEDON=:CURRENTDATE,FLASTUPDATEDTIME=:CURRENTTIME ");            
            sqlCmdBuilder.Append(" ,FLOCATIONIDS=:LOCATIONIDS,FEQUIPMENTIDS=:EQUIPMENTIDS ");             
            sqlCmdBuilder.Append(" WHERE FUSERID=:USERID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":USERID", DbType.Int32, userID);
            db.AddInParameter(dbCmd, ":LOCATIONIDS", DbType.String, preferanceLocIDs);       
            db.AddInParameter(dbCmd, ":EQUIPMENTIDS", DbType.String, preferenceEquipIDS);
            db.AddInParameter(dbCmd, ":CURRENTDATE", DbType.Int32, currentDate);
            db.AddInParameter(dbCmd, ":CURRENTTIME", DbType.Int32, currentTime);

            db.ExecuteNonQuery(dbCmd);
        }

        #endregion

    }
}
