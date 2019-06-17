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
    public class MaintenanceMobileAPIDAL
    {
        public static IDataReader GetUserInfo(Database db, string userName)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT A.FUSERID,A.FUSERNAME,A.FACCESSLEVELID,A.FSITEID ");
            sqlCmdBuilder.Append(" ,A.FSTATUS,A.FPASSWORD,A.FSALTKEYVALUE ");
            sqlCmdBuilder.Append(" FROM LDB1_USERINFO A ");
            sqlCmdBuilder.Append(" WHERE UPPER(A.FUSERNAME) =:FUSERNAME ");
            sqlCmdBuilder.Append(" AND A.FSTATUS IN ('A','L') ");

            System.Data.Common.DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":FUSERNAME", DbType.String, userName.Trim().ToUpper());
            return db.ExecuteReader(dbCmd);
        }

        #region Maintenance-Mobile

        #region User Info
        //public static IDataReader GetUserDetailsByUserID(Database db,int userID)
        //{
        //    StringBuilder sqlCmdBuilder = new StringBuilder();
        //    sqlCmdBuilder.Append(" SELECT A.FUSERID,NVL(A.FDEFAULTSITE,0) AS FDEFAULTSITE,R.FROLEID,R.FSITEID ");
        //    sqlCmdBuilder.Append(" FROM LDB1_USERINFO A ");
        //    sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_USERROLE R ON R.FUSERID=A.FUSERID ");
        //    sqlCmdBuilder.Append(" WHERE A.FUSERID =:USERID AND A.FSTATUS ='A' ");

        //    System.Data.Common.DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
        //    dbCmd.CommandType = CommandType.Text;

        //    db.AddInParameter(dbCmd, ":USERID", DbType.Int32, userID);
        //    return db.ExecuteReader(dbCmd);
        //}
        #endregion

        #region Equipment/Functional Location Info
        //public static IDataReader GetMeasuringPointReadingInfo(Database db, int siteID, int parentID, char parentType)
        //{
        //    StringBuilder sqlCmdBuilder = new StringBuilder();
        //    sqlCmdBuilder.Append(" SELECT MP.FMEASURINGPOINTID,MP.FMEASURINGPOINTCODE,MP.FMEASURINGPOINTNAME,MR.FRESULT, ");
        //    sqlCmdBuilder.Append(" MR.FUPDATEDON,MR.FUPDATEDTIME,(U.FFIRSTNAME || ' ' || U.FLASTNAME) AS FOPERATORYNAME ");
        //    sqlCmdBuilder.Append(" FROM LDB1_MAINT_MEASURINGPOINT MP ");
        //    sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_MP_READING MR ON MR.FPARENTID=MP.FPARENTID ");
        //    sqlCmdBuilder.Append(" AND MR.FPARENTTYPE=MP.FPARENTTYPE AND MP.FPARENTTYPE='E' AND MP.FSTATUS='A' ");
        //    sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_USERINFO U ON U.FUSERID=MR.FUPDATEDBY ");
        //    sqlCmdBuilder.Append(" WHERE MP.FSITEID=:SITEID AND MP.FPARENTID=:PARENTID AND MP.FPARENTTYPE=:PARENTTYPE AND MP.FSTATUS='A' ");
        //    DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
        //    dbCmd.CommandType = CommandType.Text;

        //    db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
        //    db.AddInParameter(dbCmd, ":PARENTID", DbType.Int32, parentID);
        //    db.AddInParameter(dbCmd, ":PARENTTYPE", DbType.AnsiStringFixedLength, parentType);

        //    return db.ExecuteReader(dbCmd);
        //}
        #endregion

        #region Sync Maintenance Table Data
        public static IDataReader GetUserInfoTable(Database db, int siteID, int startRowIndex, int rowCount, int fromSiteDate)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            if (rowCount > 0)
            {
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");
            }
            sqlCmdBuilder.Append(" SELECT FUSERID,FUSERNAME,FPASSWORD,FFIRSTNAME,FLASTNAME,FACCESSLEVELID, ");
            sqlCmdBuilder.Append(" FLANGUAGEID,FSALTKEYVALUE,FUPDATEDATE,FSTATUS,FSITEID ");
            sqlCmdBuilder.Append(" FROM LDB1_USERINFO ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID ");

            //apply filter based on updated date & time
            if (fromSiteDate > 0)
            {
                sqlCmdBuilder.Append(" AND FUPDATEDATE>=:FROMDATE ");
            }
            else
            {
                sqlCmdBuilder.Append(" AND FSTATUS='A' ");
            }

            if (rowCount > 0)
            {
                if (startRowIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND (:ROWCOUNT + (:ROWINDEX - 1)) ");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND  (:ROWCOUNT + (:ROWINDEX)) ");
            }

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            if (fromSiteDate > 0)
            {
                db.AddInParameter(dbCmd, ":FROMDATE", DbType.Int32, fromSiteDate);
            }

            if (rowCount > 0)
            {
                db.AddInParameter(dbCmd, ":ROWINDEX", DbType.Int32, startRowIndex);
                db.AddInParameter(dbCmd, ":ROWCOUNT", DbType.Int32, rowCount);
            }

            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetUserRoleTable(Database db, int siteID, int startRowIndex, int rowCount)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            if (rowCount > 0)
            {
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");
            }

            sqlCmdBuilder.Append(" SELECT FUSERID,FROLEID,FSITEID FROM LDB1_USERROLE ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID ");

            if (rowCount > 0)
            {
                if (startRowIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND (:ROWCOUNT + (:ROWINDEX - 1)) ");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND  (:ROWCOUNT + (:ROWINDEX)) ");

            }



            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            if (rowCount > 0)
            {
                db.AddInParameter(dbCmd, ":ROWINDEX", DbType.Int32, startRowIndex);
                db.AddInParameter(dbCmd, ":ROWCOUNT", DbType.Int32, rowCount);
            }

            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetMaint_LocationsTable(Database db, int siteID, long utcTimestamp, int startRowIndex, int rowCount)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            if (rowCount > 0)
            {
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");
            }

            sqlCmdBuilder.Append(" SELECT FLOCATIONID,FSITEID,FLOCATIONNAME,FLOCATIONDESC,FPARENTLOCATIONID,FIMAGENAME,FUPDATEDON,FUPDATEDTIME,FSTATUS,FLOCATIONCODE ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_LOCATIONS ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID ");

            if (utcTimestamp > 0)
            {
                sqlCmdBuilder.Append(" AND FTIMESTAMP >= :TIMESTAMP ");
            }
            else
            {
                sqlCmdBuilder.Append(" AND FSTATUS='A' ");
            }

            if (rowCount > 0)
            {
                if (startRowIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND (:ROWCOUNT + (:ROWINDEX - 1)) ");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND  (:ROWCOUNT + (:ROWINDEX)) ");

            }

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            if (utcTimestamp > 0)
            {
                db.AddInParameter(dbCmd, ":TIMESTAMP", DbType.Int64, utcTimestamp);
            }

            if (rowCount > 0)
            {
                db.AddInParameter(dbCmd, ":ROWINDEX", DbType.Int32, startRowIndex);
                db.AddInParameter(dbCmd, ":ROWCOUNT", DbType.Int32, rowCount);
            }
            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetMaint_EquipmentTable(Database db, int siteID, long utcTimestamp, int startRowIndex, int rowCount)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            if (rowCount > 0)
            {
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");
            }

            sqlCmdBuilder.Append(" SELECT FEQUIPMENTID,FSITEID,FEQUIPMENTCODE,FEQUIPMENTNAME,FDESCRIPTION,FMANUFID,FCATEGORYID,FCLASSID,FIMAGENAME, ");
            sqlCmdBuilder.Append(" FINFOTYPE,FLOCATIONID,FRESOURCEID,FMODELREFERENCEID,FMODELNUMBER,FSERIALNUMBER,FWARRANTYNUMBER,FWARRANTYSTARTDATE, ");
            sqlCmdBuilder.Append(" FWARRANTYEXPIREDDATE,FPURCHASEDATE,FINSTALLDATE,FUPDATEDON,FUPDATEDTIME,FPARENTEQUIPMENTID,FSTATUS ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_EQUIPMENT ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID ");

            //apply filter based on timestamp
            if (utcTimestamp > 0)
            {
                sqlCmdBuilder.Append(" AND FTIMESTAMP >= :TIMESTAMP ");
            }
            else
            {
                sqlCmdBuilder.Append(" AND FSTATUS='A' ");
            }

            if (rowCount > 0)
            {
                if (startRowIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND (:ROWCOUNT + (:ROWINDEX - 1)) ");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND  (:ROWCOUNT + (:ROWINDEX)) ");

            }

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            if (utcTimestamp > 0)
            {
                db.AddInParameter(dbCmd, ":TIMESTAMP", DbType.Int64, utcTimestamp);
            }

            if (rowCount > 0)
            {
                db.AddInParameter(dbCmd, ":ROWINDEX", DbType.Int32, startRowIndex);
                db.AddInParameter(dbCmd, ":ROWCOUNT", DbType.Int32, rowCount);
            }
            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetMaint_MeasuringPointTable(Database db, int siteID, long utcTimestamp, int startRowIndex, int rowCount)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            if (rowCount > 0)
            {
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");
            }

            sqlCmdBuilder.Append(" SELECT FMEASURINGPOINTID,FSITEID,FMEASURINGPOINTCODE,FMEASURINGPOINTNAME,FDESCRIPTION,FPOSITION,FCATEGORYID,FIMAGENAME,FREADINGTYPE,FDECIMALPLACES ");
            sqlCmdBuilder.Append(" ,FLOWERLIMIT,FUPPERLIMIT,FLOWERLIMITWARNING,FUPPERLIMITWARNING,FMAXTEXTLENGTH,FGROUPID,FPARENTID,FPARENTTYPE,FISCOUNTER,FOPCTAGID,FUUID,FUPDATEDON,FUPDATEDTIME,FSTATUS,FSENSORTYPEUOMID ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_MEASURINGPOINT ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID ");

            //apply filter based on timestamp
            if (utcTimestamp > 0)
            {
                sqlCmdBuilder.Append(" AND FTIMESTAMP >= :TIMESTAMP ");
            }
            else
            {
                sqlCmdBuilder.Append(" AND FSTATUS='A' ");
            }

            if (rowCount > 0)
            {
                if (startRowIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND (:ROWCOUNT + (:ROWINDEX - 1)) ");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND  (:ROWCOUNT + (:ROWINDEX)) ");

            }

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            if (utcTimestamp > 0)
            {
                db.AddInParameter(dbCmd, ":TIMESTAMP", DbType.Int64, utcTimestamp);
            }

            if (rowCount > 0)
            {
                db.AddInParameter(dbCmd, ":ROWINDEX", DbType.Int32, startRowIndex);
                db.AddInParameter(dbCmd, ":ROWCOUNT", DbType.Int32, rowCount);
            }
            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetMaint_DocumentsTable(Database db, int siteID, long utcTimestamp, int startRowIndex, int rowCount)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();

            if (rowCount > 0)
            {
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");
            }

            sqlCmdBuilder.Append(" SELECT FDOCUMENTID,FSITEID,FREFERENCEID,FDOCUMENTTYPE,FDOCUMENTNAME,FREF_TYPE,FUPDATEDON,FUPDATEDTIME,FSTATUS ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_DOCUMENTS ");
            sqlCmdBuilder.Append(" WHERE  FSITEID=:SITEID ");

            //apply filter based on timestamp
            if (utcTimestamp > 0)
            {
                sqlCmdBuilder.Append(" AND FTIMESTAMP >= :TIMESTAMP ");
            }
            else
            {
                sqlCmdBuilder.Append(" AND FSTATUS='A' ");
            }

            if (rowCount > 0)
            {
                if (startRowIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND (:ROWCOUNT + (:ROWINDEX - 1)) ");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND  (:ROWCOUNT + (:ROWINDEX)) ");

            }

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            if (utcTimestamp > 0)
            {
                db.AddInParameter(dbCmd, ":TIMESTAMP", DbType.Int64, utcTimestamp);
            }

            if (rowCount > 0)
            {
                db.AddInParameter(dbCmd, ":ROWINDEX", DbType.Int32, startRowIndex);
                db.AddInParameter(dbCmd, ":ROWCOUNT", DbType.Int32, rowCount);
            }
            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetMaint_MasterTable(Database db, int siteID, long utcTimestamp, int startRowIndex, int rowCount)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();

            if (rowCount > 0)
            {
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");
            }

            sqlCmdBuilder.Append(" SELECT FMASTERID,FSITEID,FNAME,FDESCRIPTION,FTYPE,FUPDATEDON,FUPDATEDTIME,FSTATUS ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_MASTER ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID ");

            //apply filter based on timestamp
            if (utcTimestamp > 0)
            {
                sqlCmdBuilder.Append(" AND FTIMESTAMP >= :TIMESTAMP ");
            }
            else
            {
                sqlCmdBuilder.Append(" AND FSTATUS='A' ");
            }

            if (rowCount > 0)
            {
                if (startRowIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND (:ROWCOUNT + (:ROWINDEX - 1)) ");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND  (:ROWCOUNT + (:ROWINDEX)) ");

            }

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            if (utcTimestamp > 0)
            {
                db.AddInParameter(dbCmd, ":TIMESTAMP", DbType.Int64, utcTimestamp);
            }

            if (rowCount > 0)
            {
                db.AddInParameter(dbCmd, ":ROWINDEX", DbType.Int32, startRowIndex);
                db.AddInParameter(dbCmd, ":ROWCOUNT", DbType.Int32, rowCount);
            }
            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetMaint_Meas_DocsTable(Database db, int siteID, long utcTimestamp, int startRowIndex, int rowCount)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            if (rowCount > 0)
            {
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");
            }

            sqlCmdBuilder.Append(" SELECT  FSCHEDULEID,FSITEID,FITEMID,FMEASURINGPOINTID,FSTATUS,FUPDATEDON,FUPDATEDTIME ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_MEAS_DOCS ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID ");

            //apply filter based on timestamp
            if (utcTimestamp > 0)
            {
                sqlCmdBuilder.Append(" AND FTIMESTAMP >= :TIMESTAMP ");
            }
            else
            {
                sqlCmdBuilder.Append(" AND FSTATUS='A' ");
            }

            if (rowCount > 0)
            {
                if (startRowIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND (:ROWCOUNT + (:ROWINDEX - 1)) ");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND  (:ROWCOUNT + (:ROWINDEX)) ");

            }

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            if (utcTimestamp > 0)
            {
                db.AddInParameter(dbCmd, ":TIMESTAMP", DbType.Int64, utcTimestamp);
            }

            if (rowCount > 0)
            {
                db.AddInParameter(dbCmd, ":ROWINDEX", DbType.Int32, startRowIndex);
                db.AddInParameter(dbCmd, ":ROWCOUNT", DbType.Int32, rowCount);
            }
            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetProductionlineresourceTable(Database db, int siteID, int startRowIndex, int rowCount, int fromSiteDate)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();

            if (rowCount > 0)
            {
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");
            }

            sqlCmdBuilder.Append(" SELECT FRESOURCEID,FSITEID,FPLINEID,FRESOURCECODE,FRESOURCEDESC,FUPDATEDATE,FSTATUS,FTYPE ");
            sqlCmdBuilder.Append(" FROM LDB1_PRODUCTIONLINERESOURCE ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID ");

            //apply filter based on updated date & time
            if (fromSiteDate > 0)
            {
                sqlCmdBuilder.Append(" AND FUPDATEDATE>=:FROMDATE ");
            }
            else
            {
                sqlCmdBuilder.Append(" AND FSTATUS='A' ");
            }

            if (rowCount > 0)
            {
                if (startRowIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND (:ROWCOUNT + (:ROWINDEX - 1)) ");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND  (:ROWCOUNT + (:ROWINDEX)) ");

            }


            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            if (fromSiteDate > 0)
            {
                db.AddInParameter(dbCmd, ":FROMDATE", DbType.Int32, fromSiteDate);
            }

            if (rowCount > 0)
            {
                db.AddInParameter(dbCmd, ":ROWINDEX", DbType.Int32, startRowIndex);
                db.AddInParameter(dbCmd, ":ROWCOUNT", DbType.Int32, rowCount);
            }

            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetPlantppeTable(Database db, int siteID, int startRowIndex, int rowCount, int fromSiteDate)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            if (rowCount > 0)
            {
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");
            }
            sqlCmdBuilder.Append(" SELECT FPPEID,FSITEID,FPPEDESC,FPPEIMAGENAME,FUPDATEDATE,FSTATUS ");
            sqlCmdBuilder.Append(" FROM LDB1_PLANTPPE ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID ");

            //apply filter based on updated date & time
            if (fromSiteDate > 0)
            {
                sqlCmdBuilder.Append(" AND FUPDATEDATE>=:FROMDATE ");
            }
            else
            {
                sqlCmdBuilder.Append(" AND FSTATUS='A' ");
            }

            if (rowCount > 0)
            {
                if (startRowIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND (:ROWCOUNT + (:ROWINDEX - 1)) ");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND  (:ROWCOUNT + (:ROWINDEX)) ");

            }

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            if (fromSiteDate > 0)
            {
                db.AddInParameter(dbCmd, ":FROMDATE", DbType.Int32, fromSiteDate);
            }

            if (rowCount > 0)
            {
                db.AddInParameter(dbCmd, ":ROWINDEX", DbType.Int32, startRowIndex);
                db.AddInParameter(dbCmd, ":ROWCOUNT", DbType.Int32, rowCount);
            }

            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetEnumTypeTable(Database db, int companyID, int startRowIndex, int rowCount, string filterType)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            if (rowCount > 0)
            {
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");
            }
            sqlCmdBuilder.Append(" SELECT FTYPE,FVALUE,FTEXT,FISDEFAULT,FSITEID FROM LDB1_ENUMTYPE ");

            if (!string.IsNullOrEmpty(filterType))
                sqlCmdBuilder.Append(" WHERE FTYPE=:TYPE ");

            if (rowCount > 0)
            {
                if (startRowIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND (:ROWCOUNT + (:ROWINDEX - 1)) ");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND  (:ROWCOUNT + (:ROWINDEX)) ");

            }
            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            //db.AddInParameter(dbCmd, ":COMPANYID", DbType.Int32, companyID);

            if (!string.IsNullOrEmpty(filterType))
                db.AddInParameter(dbCmd, ":TYPE", DbType.AnsiString, filterType);

            if (rowCount > 0)
            {
                db.AddInParameter(dbCmd, ":ROWINDEX", DbType.Int32, startRowIndex);
                db.AddInParameter(dbCmd, ":ROWCOUNT", DbType.Int32, rowCount);
            }
            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetAuthGroupTable(Database db, int siteID, int startRowIndex, int rowCount, long utcTimestamp)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            if (rowCount > 0)
            {
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");
            }

            sqlCmdBuilder.Append(" SELECT FREFERENCEID,FTYPE,FWORKGROUPID,FSITEID,FSTATUS,FUPDATEDBY,FUPDATEDDATE,FUPDATEDTIME ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_AUTH_GROUP ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID ");

            //apply filter based on timestamp
            if (utcTimestamp > 0)
            {
                sqlCmdBuilder.Append(" AND FTIMESTAMP >= :TIMESTAMP ");
            }
            else
            {
                sqlCmdBuilder.Append(" AND FSTATUS='A' ");

            }

            if (rowCount > 0)
            {
                if (startRowIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND (:ROWCOUNT + (:ROWINDEX - 1)) ");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND  (:ROWCOUNT + (:ROWINDEX)) ");

            }
            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            if (utcTimestamp > 0)
            {
                db.AddInParameter(dbCmd, ":TIMESTAMP", DbType.Int64, utcTimestamp);
            }

            if (rowCount > 0)
            {
                db.AddInParameter(dbCmd, ":ROWINDEX", DbType.Int32, startRowIndex);
                db.AddInParameter(dbCmd, ":ROWCOUNT", DbType.Int32, rowCount);
            }

            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetSensorType_UOMTable(Database db, int startRowIndex, int rowCount, int fromSiteDate)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            if (rowCount > 0)
            {
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");
            }

            sqlCmdBuilder.Append(" SELECT FSENSORTYPEUOMID,FSENSORTYPEID,FUOMNAME,FSYMBOL,FCREATEDBY,FCREATEDDATE  ");
            sqlCmdBuilder.Append(" FROM LDB1_SENSORTYPE_UOM ");

            //apply filter based on created date
            if (fromSiteDate > 0)
            {
                sqlCmdBuilder.Append(" WHERE FCREATEDDATE>:FROMDATE ");
            }

            if (rowCount > 0)
            {
                if (startRowIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND (:ROWCOUNT + (:ROWINDEX - 1)) ");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND  (:ROWCOUNT + (:ROWINDEX)) ");

            }

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            if (fromSiteDate > 0)
            {
                db.AddInParameter(dbCmd, ":FROMDATE", DbType.Int32, fromSiteDate);
            }

            if (rowCount > 0)
            {
                db.AddInParameter(dbCmd, ":ROWINDEX", DbType.Int32, startRowIndex);
                db.AddInParameter(dbCmd, ":ROWCOUNT", DbType.Int32, rowCount);
            }
            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetSensor_TypeTable(Database db, int siteID, int startRowIndex, int rowCount, int fromSiteDate)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            if (rowCount > 0)
            {
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");
            }

            sqlCmdBuilder.Append(" SELECT ST.FSENSORTYPEID,ST.FSENSORTYPENAME,ST.FCREATEDON,ST.FCREATEDBY,ST.FUPDATEDON,ST.FUPDATEDBY,ST.FSTATUS ");
            sqlCmdBuilder.Append(" FROM LDB1_SENSOR_TYPE ST ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_COUNTRY_SITES C ON C.FCOMPANYID=ST.FCOMPANYID AND C.FSTATUS='A' ");
            sqlCmdBuilder.Append(" WHERE C.FSITEID=:SITEID  ");

            //apply filter based on updated date & time
            if (fromSiteDate > 0)
            {
                sqlCmdBuilder.Append(" AND ST.FUPDATEDON>:FROMDATE ");
            }
            else
            {
                sqlCmdBuilder.Append(" AND ST.FSTATUS='A' ");
            }

            if (rowCount > 0)
            {
                if (startRowIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND (:ROWCOUNT + (:ROWINDEX - 1)) ");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND  (:ROWCOUNT + (:ROWINDEX)) ");

            }
            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            if (fromSiteDate > 0)
            {
                db.AddInParameter(dbCmd, ":FROMDATE", DbType.Int32, fromSiteDate);
            }

            if (rowCount > 0)
            {
                db.AddInParameter(dbCmd, ":ROWINDEX", DbType.Int32, startRowIndex);
                db.AddInParameter(dbCmd, ":ROWCOUNT", DbType.Int32, rowCount);
            }

            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetMaint_Schedule_SparepartsTable(Database db, int siteID, int startRowIndex, int rowCount, long utcTimestamp)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            if (rowCount > 0)
            {
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");
            }

            sqlCmdBuilder.Append(" SELECT FSITEID,FSCHEDULEID,FIDHID,FQTY,FCREATEDBY,FCREATEDON,FCREATEDTIME,FUPDATEDBY,FUPDATEDON,FUPDATEDTIME,FSTATUS ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_SCHEDULE_SPAREPARTS ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID ");

            //apply filter based on timestamp
            if (utcTimestamp > 0)
            {
                sqlCmdBuilder.Append(" AND FTIMESTAMP >= :TIMESTAMP ");
            }

            if (rowCount > 0)
            {
                if (startRowIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND (:ROWCOUNT + (:ROWINDEX - 1)) ");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND  (:ROWCOUNT + (:ROWINDEX)) ");

            }
            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            if (utcTimestamp > 0)
            {
                db.AddInParameter(dbCmd, ":TIMESTAMP", DbType.Int64, utcTimestamp);
            }

            if (rowCount > 0)
            {
                db.AddInParameter(dbCmd, ":ROWINDEX", DbType.Int32, startRowIndex);
                db.AddInParameter(dbCmd, ":ROWCOUNT", DbType.Int32, rowCount);
            }

            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetMaint_WorkOrder_SparepartTable(Database db, int siteID, int startRowIndex, int rowCount, long utcTimestamp)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            if (rowCount > 0)
            {
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");
            }

            sqlCmdBuilder.Append(" SELECT FSITEID,FWORK_ORDERID,FIDHID,FREQUIREDQTY,FACTUALQUANTITY,FCREATEDBY,FCREATEDON,FCREATEDTIME,FUPDATEDBY,FUPDATEDON,FUPDATEDTIME ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_WORKORDER_SPAREPART ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID ");

            //apply filter based on timestamp
            if (utcTimestamp > 0)
            {
                sqlCmdBuilder.Append(" AND FTIMESTAMP >= :TIMESTAMP ");
            }

            if (rowCount > 0)
            {
                if (startRowIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND (:ROWCOUNT + (:ROWINDEX - 1)) ");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND  (:ROWCOUNT + (:ROWINDEX)) ");

            }
            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            if (utcTimestamp > 0)
            {
                db.AddInParameter(dbCmd, ":TIMESTAMP", DbType.Int64, utcTimestamp);
            }

            if (rowCount > 0)
            {
                db.AddInParameter(dbCmd, ":ROWINDEX", DbType.Int32, startRowIndex);
                db.AddInParameter(dbCmd, ":ROWCOUNT", DbType.Int32, rowCount);
            }

            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetPlantMaterialTable(Database db, int siteID, int startRowIndex, int rowCount, string filterSiteDateTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            if (rowCount > 0)
            {
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");
            }

            sqlCmdBuilder.Append(" SELECT FSITEID,FIDHDESC,FIDHID,FTYPE,FSTATUS,FSAP_IDHDESC,FMATCATEGORY,FBASEUOM,FUPDATEDON,FUPDATEDTIME ");
            sqlCmdBuilder.Append(" FROM LDB1_PLANTMATERIAL ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FTYPE='S' ");//FTYPE='S'-Spare parts

            if (!string.IsNullOrEmpty(filterSiteDateTime))
            {
                sqlCmdBuilder.Append(" AND FUPDATEDON>=TO_NUMBER(SUBSTR(:FROMDATETIME,1,8)) AND TO_DATE(TO_CHAR(FUPDATEDON||LPAD(FUPDATEDTIME,6,'0')),'YYYYMMDDHH24MISS') > TO_DATE(:FROMDATETIME,'YYYYMMDDHH24MISS') ");
            }

            if (rowCount > 0)
            {
                if (startRowIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND (:ROWCOUNT + (:ROWINDEX - 1)) ");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND  (:ROWCOUNT + (:ROWINDEX)) ");

            }
            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            if (!string.IsNullOrEmpty(filterSiteDateTime))
            {
                db.AddInParameter(dbCmd, ":FROMDATETIME", DbType.AnsiString, filterSiteDateTime);
            }

            if (rowCount > 0)
            {
                db.AddInParameter(dbCmd, ":ROWINDEX", DbType.Int32, startRowIndex);
                db.AddInParameter(dbCmd, ":ROWCOUNT", DbType.Int32, rowCount);
            }

            return db.ExecuteReader(dbCmd);
        }
        #endregion

        #region Sync Schedule/Work orders
        public static IDataReader GetMaint_ScheduleTable(Database db, int siteID, int startRowIndex, int rowCount, long utcTimestamp)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            if (rowCount > 0)
            {
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");
            }

            sqlCmdBuilder.Append(" SELECT FSITEID,FSCHEDULEID,FMAINTENANCENAME,FMAINDESCRIPTION,FSCHEDULE_TYPE,FMAINTYPEID,FLOCATIONID,FPRIORITYTYPE, ");
            sqlCmdBuilder.Append(" FEQUIPMENTID,FWORKGROUPID,FSCHD_RULE_DESC,FSCHEDULESTATUS,FTASKGROUPIDENTIFIER,FSCHD_RULE_DESC_TYPE,FUPDATEDON,FUPDATEDTIME,FSTATUS, ");
            sqlCmdBuilder.Append(" FNOTIFY_WORK_ORDERID,FNOTIFY_TYPEID,FREMARKS ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_SCHEDULE ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID ");

            //apply filter based on timestamp
            if (utcTimestamp > 0)
            {
                sqlCmdBuilder.Append(" AND FTIMESTAMP >= :TIMESTAMP ");
            }
            else
            {
                sqlCmdBuilder.Append(" AND FSTATUS='A' ");
            }

            if (rowCount > 0)
            {
                if (startRowIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND (:ROWCOUNT + (:ROWINDEX - 1)) ");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND  (:ROWCOUNT + (:ROWINDEX)) ");

            }

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            if (utcTimestamp > 0)
            {
                db.AddInParameter(dbCmd, ":TIMESTAMP", DbType.Int64, utcTimestamp);
            }

            if (rowCount > 0)
            {
                db.AddInParameter(dbCmd, ":ROWINDEX", DbType.Int32, startRowIndex);
                db.AddInParameter(dbCmd, ":ROWCOUNT", DbType.Int32, rowCount);
            }

            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetMaint_ScheduleDtlTable(Database db, int siteID, int startRowIndex, int rowCount, long utcTimestamp)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            if (rowCount > 0)
            {
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");
            }
            sqlCmdBuilder.Append(" SELECT FSITEID,FSCHEDULE_DTL_ID,FSCHEDULEID,FITEM_ID,FFREQUENCY,FINTERVAL,FSTARTDATE,FSTARTTIME,FENDDATE,FENDNUM_OCCURENCE, ");
            sqlCmdBuilder.Append(" FWEEK_DAY,FMONTH_OPTION,FMONTH_DAY,FMONTH_POSITION,FYEAR_OPTION,FYEAR_MONTH,FNOTIFYDAY,FBASEDONPERFDATE,FUPDATEDON,FUPDATEDTIME,FSTATUS ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_SCHEDULE_DTL ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID ");

            //apply filter based on timestamp
            if (utcTimestamp > 0)
            {
                sqlCmdBuilder.Append(" AND FTIMESTAMP >= :TIMESTAMP ");
            }
            else
            {
                sqlCmdBuilder.Append(" AND FSTATUS='A' ");
            }

            if (rowCount > 0)
            {
                if (startRowIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND (:ROWCOUNT + (:ROWINDEX - 1)) ");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND  (:ROWCOUNT + (:ROWINDEX)) ");

            }

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            if (utcTimestamp > 0)
            {
                db.AddInParameter(dbCmd, ":TIMESTAMP", DbType.Int64, utcTimestamp);
            }

            if (rowCount > 0)
            {
                db.AddInParameter(dbCmd, ":ROWINDEX", DbType.Int32, startRowIndex);
                db.AddInParameter(dbCmd, ":ROWCOUNT", DbType.Int32, rowCount);
            }
            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetMaint_SelGrpCodeTable(Database db, int siteID, int startRowIndex, int rowCount, long utcTimestamp)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();

            if (rowCount > 0)
            {
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");
            }

            sqlCmdBuilder.Append(" SELECT FSITEID,FMASTERID,FITEMID,FDISPLAYNAME,FUPDATEDON,FUPDATEDTIME,FSTATUS ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_SELGRP_CODE ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID ");

            //apply filter based on timestamp
            if (utcTimestamp > 0)
            {
                sqlCmdBuilder.Append(" AND FTIMESTAMP >= :TIMESTAMP ");
            }
            else
            {
                sqlCmdBuilder.Append(" AND FSTATUS='A' ");
            }

            if (rowCount > 0)
            {
                if (startRowIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND (:ROWCOUNT + (:ROWINDEX - 1)) ");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND  (:ROWCOUNT + (:ROWINDEX)) ");

            }

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            if (utcTimestamp > 0)
            {
                db.AddInParameter(dbCmd, ":TIMESTAMP", DbType.Int64, utcTimestamp);
            }

            if (rowCount > 0)
            {
                db.AddInParameter(dbCmd, ":ROWINDEX", DbType.Int32, startRowIndex);
                db.AddInParameter(dbCmd, ":ROWCOUNT", DbType.Int32, rowCount);
            }
            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetMaint_SupportTable(Database db, int siteID, int startRowIndex, int rowCount, long utcTimestamp)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            if (rowCount > 0)
            {
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");
            }
            sqlCmdBuilder.Append(" SELECT FSITEID,FSUPPORTID,FEQUIPMENTID,FSUPPORTNAME,FSUPPORTNUMBER,FSUPPORTEMAILID,FSUPPORTTYPE,FUPDATEDON,FUPDATEDTIME,FSTATUS ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_SUPPORT ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID ");

            //apply filter based on timestamp
            if (utcTimestamp > 0)
            {
                sqlCmdBuilder.Append(" AND FTIMESTAMP >= :TIMESTAMP ");
            }
            else
            {
                sqlCmdBuilder.Append(" AND FSTATUS='A' ");
            }

            if (rowCount > 0)
            {
                if (startRowIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND (:ROWCOUNT + (:ROWINDEX - 1)) ");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND  (:ROWCOUNT + (:ROWINDEX)) ");

            }

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            if (utcTimestamp > 0)
            {
                db.AddInParameter(dbCmd, ":TIMESTAMP", DbType.Int64, utcTimestamp);
            }

            if (rowCount > 0)
            {
                db.AddInParameter(dbCmd, ":ROWINDEX", DbType.Int32, startRowIndex);
                db.AddInParameter(dbCmd, ":ROWCOUNT", DbType.Int32, rowCount);
            }
            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetMaint_TaskGroupTable(Database db, int siteID, int startRowIndex, int rowCount, long utcTimestamp)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            if (rowCount > 0)
            {
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");
            }
            sqlCmdBuilder.Append(" SELECT FSITEID,FTASKGROUPID,FTASKGROUPNAME,FTASKGROUPTYPEID,FVERSION,FIDENTIFIER,FUPDATEDON,FUPDATEDTIME,FSTATUS,FREF_TYPE ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_TASKGROUP ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID ");

            //apply filter based on timestamp
            if (utcTimestamp > 0)
            {
                sqlCmdBuilder.Append(" AND FTIMESTAMP >= :TIMESTAMP ");
            }
            //else
            //{
            //    sqlCmdBuilder.Append(" AND FSTATUS='A' ");
            //}

            if (rowCount > 0)
            {
                if (startRowIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND (:ROWCOUNT + (:ROWINDEX - 1)) ");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND  (:ROWCOUNT + (:ROWINDEX)) ");

            }

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            if (utcTimestamp > 0)
            {
                db.AddInParameter(dbCmd, ":TIMESTAMP", DbType.Int64, utcTimestamp);
            }

            if (rowCount > 0)
            {
                db.AddInParameter(dbCmd, ":ROWINDEX", DbType.Int32, startRowIndex);
                db.AddInParameter(dbCmd, ":ROWCOUNT", DbType.Int32, rowCount);
            }
            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetMaint_TasksTable(Database db, int siteID, int startRowIndex, int rowCount, long utcTimestamp)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            if (rowCount > 0)
            {
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");
            }
            sqlCmdBuilder.Append(" SELECT FSITEID,FTASKID,FREFERENCEID,FTASKNAME,FDESCRIPTION,FSAFETYDESCRIPTION,FESTIMATEDTIME,FUNIT, ");
            sqlCmdBuilder.Append(" FREMARKENABLED,FREMARKMANDATORY,FPICTUREENABLED,FPICTUREMANDATORY,FSEQUENCENUM,FUPDATEDON,FUPDATEDTIME,FSTATUS ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_TASKS ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID ");

            //apply filter based on timestamp
            if (utcTimestamp > 0)
            {
                sqlCmdBuilder.Append(" AND FTIMESTAMP >= :TIMESTAMP ");
            }
            //else
            //{
            //    sqlCmdBuilder.Append(" AND FSTATUS='A' ");
            //}
            if (rowCount > 0)
            {
                if (startRowIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND (:ROWCOUNT + (:ROWINDEX - 1)) ");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND  (:ROWCOUNT + (:ROWINDEX)) ");

            }


            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            if (utcTimestamp > 0)
            {
                db.AddInParameter(dbCmd, ":TIMESTAMP", DbType.Int64, utcTimestamp);
            }

            if (rowCount > 0)
            {
                db.AddInParameter(dbCmd, ":ROWINDEX", DbType.Int32, startRowIndex);
                db.AddInParameter(dbCmd, ":ROWCOUNT", DbType.Int32, rowCount);
            }
            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetMaint_TasksParamTable(Database db, int siteID, int startRowIndex, int rowCount, long utcTimestamp)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();

            if (rowCount > 0)
            {
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");
            }

            sqlCmdBuilder.Append(" SELECT FSITEID,FPARAMETERID,FTASKGROUPID,FREFERENCEID,FPARAMNAME,FISMANDATORY,FTYPE,FSELECTIONGROUPID,FUPDATEDON,FUPDATEDTIME,FSTATUS ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_TASKSPARAM ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID  ");

            //apply filter based on timestamp
            if (utcTimestamp > 0)
            {
                sqlCmdBuilder.Append(" AND FTIMESTAMP >= :TIMESTAMP ");
            }
            //else
            //{
            //    sqlCmdBuilder.Append(" AND FSTATUS='A' ");
            //}

            if (rowCount > 0)
            {
                if (startRowIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND (:ROWCOUNT + (:ROWINDEX - 1)) ");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND  (:ROWCOUNT + (:ROWINDEX)) ");

            }


            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            if (utcTimestamp > 0)
            {
                db.AddInParameter(dbCmd, ":TIMESTAMP", DbType.Int64, utcTimestamp);
            }

            if (rowCount > 0)
            {
                db.AddInParameter(dbCmd, ":ROWINDEX", DbType.Int32, startRowIndex);
                db.AddInParameter(dbCmd, ":ROWCOUNT", DbType.Int32, rowCount);
            }
            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetMaint_TasksPPETable(Database db, int siteID, int startRowIndex, int rowCount, long utcTimestamp)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            if (rowCount > 0)
            {
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");
            }
            sqlCmdBuilder.Append(" SELECT FSITEID,FTASKPPEID,FPPEID,FTASKGROUPID,FREFERENCEID,FCREATEDON,FCREATEDTIME,FUPDATEDON,FUPDATEDTIME,FSTATUS ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_TASKSPPE ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID ");

            if (utcTimestamp > 0)
            {
                sqlCmdBuilder.Append(" AND FTIMESTAMP >= :TIMESTAMP ");
            }
            //else
            //{
            //    sqlCmdBuilder.Append(" AND FSTATUS='A' ");
            //}
            if (rowCount > 0)
            {
                if (startRowIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND (:ROWCOUNT + (:ROWINDEX - 1)) ");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND  (:ROWCOUNT + (:ROWINDEX)) ");

            }


            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            if (utcTimestamp > 0)
            {
                db.AddInParameter(dbCmd, ":TIMESTAMP", DbType.Int64, utcTimestamp);
            }

            if (rowCount > 0)
            {
                db.AddInParameter(dbCmd, ":ROWINDEX", DbType.Int32, startRowIndex);
                db.AddInParameter(dbCmd, ":ROWCOUNT", DbType.Int32, rowCount);
            }
            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetMaint_TasksToolsTable(Database db, int siteID, int startRowIndex, int rowCount, long utcTimestamp)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            if (rowCount > 0)
            {
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");
            }
            sqlCmdBuilder.Append(" SELECT FSITEID,FTASKTOOLSID,FTOOLSID,FTASKGROUPID,FREFERENCEID,FCREATEDON,FCREATEDTIME,FUPDATEDON,FUPDATEDTIME,FSTATUS ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_TASKSTOOLS ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID  ");

            //apply filter on timestamp
            if (utcTimestamp > 0)
            {
                sqlCmdBuilder.Append(" AND FTIMESTAMP >= :TIMESTAMP ");
            }
            //else
            //{
            //    sqlCmdBuilder.Append(" AND FSTATUS='A' ");
            //}

            if (rowCount > 0)
            {
                if (startRowIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND (:ROWCOUNT + (:ROWINDEX - 1)) ");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND  (:ROWCOUNT + (:ROWINDEX)) ");

            }

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            if (utcTimestamp > 0)
            {
                db.AddInParameter(dbCmd, ":TIMESTAMP", DbType.Int64, utcTimestamp);
            }

            if (rowCount > 0)
            {
                db.AddInParameter(dbCmd, ":ROWINDEX", DbType.Int32, startRowIndex);
                db.AddInParameter(dbCmd, ":ROWCOUNT", DbType.Int32, rowCount);
            }
            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetMaint_ToolsTable(Database db, int siteID, int startRowIndex, int rowCount, long utcTimestamp)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            if (rowCount > 0)
            {
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");
            }
            sqlCmdBuilder.Append(" SELECT FSITEID,FTOOLSID,FTOOLSDESC,FTOOLSIMAGENAME,FUPDATEDATE,FSTATUS ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_TOOLS ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID ");

            //apply filter on timestamp
            if (utcTimestamp > 0)
            {
                sqlCmdBuilder.Append(" AND FTIMESTAMP >= :TIMESTAMP ");
            }
            //else
            //{
            //    sqlCmdBuilder.Append(" AND FSTATUS='A' ");
            //}

            if (rowCount > 0)
            {
                if (startRowIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND (:ROWCOUNT + (:ROWINDEX - 1)) ");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND  (:ROWCOUNT + (:ROWINDEX)) ");

            }


            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            if (utcTimestamp > 0)
            {
                db.AddInParameter(dbCmd, ":TIMESTAMP", DbType.Int64, utcTimestamp);
            }

            if (rowCount > 0)
            {
                db.AddInParameter(dbCmd, ":ROWINDEX", DbType.Int32, startRowIndex);
                db.AddInParameter(dbCmd, ":ROWCOUNT", DbType.Int32, rowCount);
            }
            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetMaint_WorkGroupUserTable(Database db, int siteID, int startRowIndex, int rowCount, long utcTimestamp)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            if (rowCount > 0)
            {
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");
            }
            sqlCmdBuilder.Append(" SELECT FSITEID,FWORKGROUPID,FITEMID,FUSERID,FSCH_NOTIFY,FWORKSTART_NOTIFY,FWORKFINISH_NOTIFY,FREPORTISSUE_NOTIFY,FDOWNTIME_NOTIFY,FUSERTYPE,FUPDATEDON,FUPDATEDTIME,FSTATUS ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_WORKGROUPUSER ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID ");

            //apply filter on timestamp
            if (utcTimestamp > 0)
            {
                sqlCmdBuilder.Append(" AND FTIMESTAMP >= :TIMESTAMP ");
            }
            else
            {
                sqlCmdBuilder.Append(" AND FSTATUS='A' ");
            }

            if (rowCount > 0)
            {
                if (startRowIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND (:ROWCOUNT + (:ROWINDEX - 1)) ");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND  (:ROWCOUNT + (:ROWINDEX)) ");

            }
            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            if (utcTimestamp > 0)
            {
                db.AddInParameter(dbCmd, ":TIMESTAMP", DbType.Int64, utcTimestamp);
            }

            if (rowCount > 0)
            {
                db.AddInParameter(dbCmd, ":ROWINDEX", DbType.Int32, startRowIndex);
                db.AddInParameter(dbCmd, ":ROWCOUNT", DbType.Int32, rowCount);
            }
            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetMaint_WorkOrderTable(Database db, int siteID, int startRowIndex, int rowCount, long utcTimestamp)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            if (rowCount > 0)
            {
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");
            }
            sqlCmdBuilder.Append(" SELECT FSITEID,FWORK_ORDERID,FREF_SCHEDULE_DTL_ID,FSCHEDULEDATE,FSCHEDULETIME,FPLANNEDDATE,FPLANNEDTIME,FSTARTDATE, ");
            sqlCmdBuilder.Append(" FSTARTTIME,FENDDATE,FENDTIME,FERP_WORKORDER,FSTARTEDBY,FENDEDBY,FREF_SCHEDULEID,FTASKGROUPID,FWORKORDERSTATUS,FTIMETAKEN,FTIMETAKENUNIT,FTIMECONFIRMEDBY,FUPDATEDON,FUPDATEDTIME ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_WORKORDER ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID ");

            //apply filter on timestamp
            if (utcTimestamp > 0)
            {
                sqlCmdBuilder.Append(" AND FTIMESTAMP >= :TIMESTAMP ");
            }

            if (rowCount > 0)
            {
                if (startRowIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND (:ROWCOUNT + (:ROWINDEX - 1)) ");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND  (:ROWCOUNT + (:ROWINDEX)) ");

            }

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            if (utcTimestamp > 0)
            {
                db.AddInParameter(dbCmd, ":TIMESTAMP", DbType.Int64, utcTimestamp);
            }

            if (rowCount > 0)
            {
                db.AddInParameter(dbCmd, ":ROWINDEX", DbType.Int32, startRowIndex);
                db.AddInParameter(dbCmd, ":ROWCOUNT", DbType.Int32, rowCount);
            }
            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetMaint_WorkOrderTaskTable(Database db, int siteID, int startRowIndex, int rowCount, long utcTimestamp)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            if (rowCount > 0)
            {
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");
            }
            sqlCmdBuilder.Append(" SELECT FSITEID,FWORK_ORDERID,FTASKID,FREMARKS,FSTARTEDBY,FSTARTDATE,FSTARTTIME,FENDEDBY,FENDDATE,FENDTIME, ");
            sqlCmdBuilder.Append(" FSEQUENCENUM,FISSAFETYCONFIRMED,FISPPECONFIRMED,FCREATEDON,FCREATEDTIME,FUPDATEDON,FUPDATEDTIME ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_WORKORDER_TASK ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID ");

            //apply filter on timestamp
            if (utcTimestamp > 0)
            {
                sqlCmdBuilder.Append(" AND FTIMESTAMP >= :TIMESTAMP ");
            }


            if (rowCount > 0)
            {
                if (startRowIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND (:ROWCOUNT + (:ROWINDEX - 1)) ");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND  (:ROWCOUNT + (:ROWINDEX)) ");

            }

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            if (utcTimestamp > 0)
            {
                db.AddInParameter(dbCmd, ":TIMESTAMP", DbType.Int64, utcTimestamp);
            }

            if (rowCount > 0)
            {
                db.AddInParameter(dbCmd, ":ROWINDEX", DbType.Int32, startRowIndex);
                db.AddInParameter(dbCmd, ":ROWCOUNT", DbType.Int32, rowCount);
            }
            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetMaint_WorkOrderTaskImgTable(Database db, int siteID, int startRowIndex, int rowCount, long utcTimestamp)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            if (rowCount > 0)
            {
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");
            }
            sqlCmdBuilder.Append(" SELECT FSITEID,FWORK_ORDERID,FTASKID,FIMAGENAME,FIMAGEITEM,FCREATEDON,FCREATEDTIME,FUPDATEDON,FUPDATEDTIME ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_WORKORDER_TASKIMG ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID ");

            //apply filter on timestamp
            if (utcTimestamp > 0)
            {
                sqlCmdBuilder.Append(" AND FTIMESTAMP >= :TIMESTAMP ");
            }

            if (rowCount > 0)
            {
                if (startRowIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND (:ROWCOUNT + (:ROWINDEX - 1)) ");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND  (:ROWCOUNT + (:ROWINDEX)) ");

            }
            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            if (utcTimestamp > 0)
            {
                db.AddInParameter(dbCmd, ":TIMESTAMP", DbType.Int64, utcTimestamp);

            }
            if (rowCount > 0)
            {
                db.AddInParameter(dbCmd, ":ROWINDEX", DbType.Int32, startRowIndex);
                db.AddInParameter(dbCmd, ":ROWCOUNT", DbType.Int32, rowCount);
            }
            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetMaint_WorkOrderTaskParamTable(Database db, int siteID, int startRowIndex, int rowCount, long utcTimestamp)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            if (rowCount > 0)
            {
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");
            }
            sqlCmdBuilder.Append(" SELECT FSITEID,FWORK_ORDERID,FTASKID,FPARAMETERID,FVALUE,FSELECTCODEITEM,FRECORDEDDATE,FRECORDEDTIME,FRECORDEDBY, ");
            sqlCmdBuilder.Append(" FCREATEDON,FCREATEDTIME,FUPDATEDON,FUPDATEDTIME,FSTATUS ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_WORKORDER_TASKPARAM ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID ");

            //apply filter on timestamp
            if (utcTimestamp > 0)
            {
                sqlCmdBuilder.Append(" AND FTIMESTAMP >= :TIMESTAMP ");
            }

            if (rowCount > 0)
            {
                if (startRowIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND (:ROWCOUNT + (:ROWINDEX - 1)) ");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND  (:ROWCOUNT + (:ROWINDEX)) ");

            }
            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            if (utcTimestamp > 0)
            {
                db.AddInParameter(dbCmd, ":TIMESTAMP", DbType.Int64, utcTimestamp);
            }

            if (rowCount > 0)
            {
                db.AddInParameter(dbCmd, ":ROWINDEX", DbType.Int32, startRowIndex);
                db.AddInParameter(dbCmd, ":ROWCOUNT", DbType.Int32, rowCount);
            }
            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetMaint_ReadingResultTable(Database db, int siteID, int startRowIndex, int rowCount, long utcTimestamp)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            if (rowCount > 0)
            {
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");
            }

            sqlCmdBuilder.Append(" SELECT FREADINGID,FSCHEDULEID,FWORK_ORDERID,FMEASURINGPOINTID,FRESULT,FSITEID,FCREATEDBY,FCREATEDDATE,FCREATEDTIME,FSTATUS, ");
            sqlCmdBuilder.Append(" FUPDATEDBY,FUPDATEDON,FUPDATEDTIME ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_READING_RESULT ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID ");

            //apply filter on timestamp
            if (utcTimestamp > 0)
            {
                sqlCmdBuilder.Append(" AND FTIMESTAMP >= :TIMESTAMP ");
            }
            else
            {
                sqlCmdBuilder.Append(" AND FSTATUS='A' ");
            }

            if (rowCount > 0)
            {
                if (startRowIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND (:ROWCOUNT + (:ROWINDEX - 1)) ");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:ROWINDEX)  AND  (:ROWCOUNT + (:ROWINDEX)) ");

            }

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            if (utcTimestamp > 0)
            {
                db.AddInParameter(dbCmd, ":TIMESTAMP", DbType.Int64, utcTimestamp);
            }

            if (rowCount > 0)
            {
                db.AddInParameter(dbCmd, ":ROWINDEX", DbType.Int32, startRowIndex);
                db.AddInParameter(dbCmd, ":ROWCOUNT", DbType.Int32, rowCount);
            }
            return db.ExecuteReader(dbCmd);
        }

        #endregion

        public static IDataReader GetCompanySitesDateTimeInfo(Database db, int companyID, int siteID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT C.FCOMPANYID,CS.FSITEID,CS.FSITE_NAME,CS.FTIMEZONE,CS.FSITE_DATEFORMAT,CS.FSITE_TIMEFORMAT    ");
            sqlCmdBuilder.Append(" FROM LDB1_COMPANY C ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_COUNTRY_SITES CS ON CS.FCOMPANYID=C.FCOMPANYID AND CS.FSTATUS='A'  ");
            sqlCmdBuilder.Append(" WHERE C.FCOMPANYID=:COMPANYID AND CS.FSITEID=:SITEID AND C.FSTATUS='A'  ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":COMPANYID", DbType.Int32, companyID);
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            return db.ExecuteReader(dbCmd);
        }

        #region SyncIn Table Data Info
        public static int CheckMaintReadingResultExist(Database db, DbTransaction transaction, int siteID, long readingID, string mobSyncIdentifier, bool isRecordExist)
        {
            IDataReader dataReaderCheck = null;
            try
            {
                StringBuilder sqlCmdBuilder = new StringBuilder();
                sqlCmdBuilder.Append(" SELECT FREADINGID FROM LDB1_MAINT_READING_RESULT ");
                sqlCmdBuilder.Append(" WHERE FSITEID =:SITEID  ");

                if (isRecordExist)
                    sqlCmdBuilder.Append(" AND FREADINGID=:FREADINGID ");
                else
                    sqlCmdBuilder.Append(" AND UPPER(FMOB_SYNC_IDENTIFIER)=:MOB_SYNC_IDENTIFIER ");

                DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
                dbCmd.CommandType = CommandType.Text;

                db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

                if (isRecordExist)
                    db.AddInParameter(dbCmd, ":READINGID", DbType.Int64, readingID);
                else
                    db.AddInParameter(dbCmd, ":MOB_SYNC_IDENTIFIER", DbType.AnsiString, mobSyncIdentifier.Trim().ToUpper());

                int existingReadingID = 0;
                using (dataReaderCheck = db.ExecuteReader(dbCmd, transaction))
                {
                    if (dataReaderCheck.Read())
                    {
                        existingReadingID = dataReaderCheck.GetInt32(0);
                    }
                    dataReaderCheck.Close();
                }

                return existingReadingID;
            }
            catch (Exception)
            {

                throw;
            }
            finally
            {
                if (dataReaderCheck != null && !dataReaderCheck.IsClosed)
                    dataReaderCheck.Close();
            }
        }

        public static int InsertMaintReadingResultInfo(Database db, DbTransaction transaction, int siteID, long scheduleID, string workOrderID, long measuringPointID, string result, char status, int createdBy, int createdOn, int createdTime,
            int updatedBy, int updatedOn, int updatedTime, string mobSyncIdentifier)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" INSERT INTO LDB1_MAINT_READING_RESULT(FREADINGID,FSCHEDULEID,FWORK_ORDERID,FMEASURINGPOINTID,FRESULT,FSITEID,FCREATEDBY,FCREATEDDATE,FCREATEDTIME,FUPDATEDBY,FUPDATEDON,FUPDATEDTIME,FSTATUS,FMOB_SYNC_IDENTIFIER) ");
            sqlCmdBuilder.Append(" VALUES(SEQUENCE_MAINT_READING_ID.NEXTVAL,:SCHEDULEID,:WORKORDERID,:MEASURINGPOINTID,:RESULT,:SITEID,:CREATEDBY,:CREATEDDATE,:CREATEDTIME,:UPDATEDBY,:UPDATEDON,:UPDATEDTIME,:STATUS,:MOB_SYNC_IDENTIFIER) ");
            sqlCmdBuilder.Append(" RETURNING FREADINGID INTO :READINGID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddOutParameter(dbCmd, ":READINGID", DbType.Int32, sizeof(Int32));
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":SCHEDULEID", DbType.Int64, scheduleID);
            db.AddInParameter(dbCmd, ":WORKORDERID", DbType.AnsiString, workOrderID);
            db.AddInParameter(dbCmd, ":MEASURINGPOINTID", DbType.Int64, measuringPointID);
            db.AddInParameter(dbCmd, ":RESULT", DbType.String, result.Trim());

            db.AddInParameter(dbCmd, ":CREATEDBY", DbType.Int32, createdBy);
            db.AddInParameter(dbCmd, ":CREATEDDATE", DbType.Int32, createdOn);
            db.AddInParameter(dbCmd, ":CREATEDTIME", DbType.Int32, createdTime);

            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedOn);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);
            db.AddInParameter(dbCmd, ":STATUS", DbType.AnsiStringFixedLength, status);
            db.AddInParameter(dbCmd, ":MOB_SYNC_IDENTIFIER", DbType.AnsiString, mobSyncIdentifier.Trim().ToUpper());

            if (transaction == null) db.ExecuteNonQuery(dbCmd);
            else db.ExecuteNonQuery(dbCmd, transaction);

            return Convert.ToInt32(db.GetParameterValue(dbCmd, ":READINGID").ToString());
        }

        public static bool UpdateMaintReadingResultInfo(Database db, DbTransaction transaction, int siteID, long readingID, long scheduleID, string workOrderID, long measuringPointID, string result, char status, int createdBy, int createdOn, int createdTime,
            int updatedBy, int updatedOn, int updatedTime, string mobSyncIdentifier)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_READING_RESULT SET FREADINGID =:READINGID,FSCHEDULEID =:SCHEDULEID,FWORK_ORDERID =:WORKORDERID, ");
            sqlCmdBuilder.Append(" FMEASURINGPOINTID =:MEASURINGPOINTID,FRESULT =:RESULT,FCREATEDBY=:CREATEDBY,FCREATEDDATE=:CREATEDDATE,FCREATEDTIME=:CREATEDTIME, ");
            sqlCmdBuilder.Append(" FUPDATEDBY=:UPDATEDBY,FUPDATEDON=:UPDATEDON,FUPDATEDTIME=:UPDATEDTIME,FSTATUS=:STATUS ");
            sqlCmdBuilder.Append(" WHERE UPPER(FMOB_SYNC_IDENTIFIER) =:MOB_SYNC_IDENTIFIER AND FSITEID =:SITEID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":READINGID", DbType.Int64, readingID);
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":SCHEDULEID", DbType.Int64, scheduleID);
            db.AddInParameter(dbCmd, ":WORKORDERID", DbType.AnsiString, workOrderID);
            db.AddInParameter(dbCmd, ":MEASURINGPOINTID", DbType.Int64, measuringPointID);
            db.AddInParameter(dbCmd, ":RESULT", DbType.String, result.Trim());

            db.AddInParameter(dbCmd, ":CREATEDBY", DbType.Int32, createdBy);
            db.AddInParameter(dbCmd, ":CREATEDDATE", DbType.Int32, createdOn);
            db.AddInParameter(dbCmd, ":CREATEDTIME", DbType.Int32, createdTime);

            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedOn);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);
            db.AddInParameter(dbCmd, ":STATUS", DbType.AnsiStringFixedLength, status);
            db.AddInParameter(dbCmd, ":MOB_SYNC_IDENTIFIER", DbType.AnsiString, mobSyncIdentifier.Trim().ToUpper());

            if (transaction == null)
                db.ExecuteNonQuery(dbCmd);
            else
                db.ExecuteNonQuery(dbCmd, transaction);

            return true;

        }

        public static bool CheckWorkOrderTaskImageExist(Database db, DbTransaction transaction, int siteID, string mobSyncIdentifier)
        {
            IDataReader dataReaderCheck = null;
            try
            {
                StringBuilder sqlCmdBuilder = new StringBuilder();
                sqlCmdBuilder.Append(" SELECT FWORK_ORDERID FROM LDB1_MAINT_WORKORDER_TASKIMG ");
                sqlCmdBuilder.Append(" WHERE FSITEID =:SITEID AND UPPER(FMOB_SYNC_IDENTIFIER) =:MOB_SYNC_IDENTIFIER ");

                DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
                dbCmd.CommandType = CommandType.Text;

                db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
                db.AddInParameter(dbCmd, ":MOB_SYNC_IDENTIFIER", DbType.AnsiString, mobSyncIdentifier.Trim().ToUpper());

                bool isExists = false;
                using (dataReaderCheck = db.ExecuteReader(dbCmd, transaction))
                {
                    if (dataReaderCheck.Read())
                    {
                        isExists = true;
                    }
                    dataReaderCheck.Close();
                }

                return isExists;
            }
            catch (Exception)
            {

                throw;
            }
            finally
            {
                if (dataReaderCheck != null && !dataReaderCheck.IsClosed)
                    dataReaderCheck.Close();
            }
        }

        #endregion

        #region Maintenance Mobile Online Feature

        public static IDataReader GetAllNotificationInfo(Database db, int siteID, int userID, bool restrictAccess)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT DISTINCT S.FSITEID,S.FSCHEDULEID,S.FMAINTENANCENAME,S.FMAINDESCRIPTION,ML.FLOCATIONID,ME.FEQUIPMENTID, ");
            sqlCmdBuilder.Append(" ML.FLOCATIONNAME, ME.FEQUIPMENTNAME, M1.FNAME AS FNOTIFY_TYPE, S.FSCHEDULESTATUS, LTRIM(S.FNOTIFY_WORK_ORDERID, '0') AS FNOTIFYWORKORDERID, ");
            sqlCmdBuilder.Append(" NVL(MS.FREF_SCHEDULEID, 0) AS FREF_SCHEDULEID, S.FCREATEDON, (U.FFIRSTNAME || ' ' || U.FLASTNAME) AS FCREATEDUSERNAME, ");
            sqlCmdBuilder.Append(" S.FSCHEDULESTATUS AS FSCHEDULESTATUSVALUE, S.FUPDATEDON, S.FUPDATEDTIME, S.FNOTIFY_TYPEID, S.FREQUESTED_ENDDATE, ");
            sqlCmdBuilder.Append(" T.FVALUE AS FPRIORITYTYPE, T.FTEXT AS FPRIORITY, S.FCREATEDBY ");
            sqlCmdBuilder.Append(" FROM  LDB1_MAINT_SCHEDULE S  ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_ENUMTYPE T ON T.FTYPE='MAINT_PRIORITY_TYPE' AND T.FVALUE=S.FPRIORITYTYPE ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_MASTER M1 ON M1.FMASTERID = S.FNOTIFY_TYPEID AND M1.FSITEID = S.FSITEID AND M1.FTYPE = 'NOTIFICATION_TYPE' ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_LOCATIONS ML ON ML.FSITEID = S.FSITEID AND ML.FLOCATIONID = S.FLOCATIONID ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_EQUIPMENT ME ON ME.FSITEID = S.FSITEID AND ME.FEQUIPMENTID = S.FEQUIPMENTID ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_WORKORDER MS ON MS.FSITEID = S.FSITEID AND MS.FWORK_ORDERID = S.FNOTIFY_WORK_ORDERID ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_USERINFO U ON U.FUSERID = S.FCREATEDBY ");


            if (userID > 0 && restrictAccess)
            {
                sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_AUTH_GROUP MA ON MA.FREFERENCEID = DECODE(NVL(S.FLOCATIONID, 0), 0, S.FEQUIPMENTID, S.FLOCATIONID) AND MA.FTYPE = DECODE(NVL(S.FLOCATIONID, 0), 0, 'EQUIPMENT', 'LOCATION') ");
                sqlCmdBuilder.Append(" AND MA.FSITEID = S.FSITEID AND MA.FSTATUS = 'A' ");
                sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_WORKGROUPUSER WU ON WU.FWORKGROUPID = MA.FWORKGROUPID AND WU.FSITEID = S.FSITEID AND WU.FSTATUS = 'A' ");
            }

            sqlCmdBuilder.Append(" WHERE S.FSITEID =:SITEID AND S.FSCHEDULE_TYPE = 'N' AND S.FSTATUS = 'A' AND S.FUPDATEDON > TO_NUMBER(TO_CHAR(SYSDATE - 60, 'YYYYmmDD')) ");


            if (userID > 0 && restrictAccess)
                sqlCmdBuilder.Append(" AND WU.FUSERID =:USERID ");

            sqlCmdBuilder.Append(" ORDER BY S.FUPDATEDON DESC, S.FUPDATEDTIME DESC, S.FCREATEDON DESC ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            if (userID > 0 && restrictAccess)
            {
                db.AddInParameter(dbCmd, ":USERID", DbType.Int32, userID);
            }

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetAllEquipmentFLocation(Database db, int siteID, string searchEquipmentFLoc, string equipmentFLocationCode, int userID, bool restrictAccess)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT L.FLOCATIONID AS FLOCEQUIPMENTID,L.FLOCATIONNAME AS FEQUIPMENTNAME,L.FLOCATIONCODE AS FEQUIPMENTCODE, 'L' AS FPARENTTYPE ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_LOCATIONS L ");

            if (userID > 0 && restrictAccess)
            {
                sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_AUTH_GROUP MA ON MA.FREFERENCEID = L.FLOCATIONID AND MA.FSITEID = L.FSITEID AND MA.FTYPE = 'LOCATION' AND MA.FSTATUS = 'A' ");
                sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_WORKGROUPUSER MW ON MW.FWORKGROUPID = MA.FWORKGROUPID AND MW.FSITEID = MA.FSITEID AND MW.FSTATUS = 'A' ");
                sqlCmdBuilder.Append(" WHERE L.FSITEID =:SITEID AND L.FSTATUS = 'A' AND(MA.FREFERENCEID IS NULL OR MW.FUSERID =:USERID) ");
            }
            else
            {
                sqlCmdBuilder.Append(" WHERE L.FSITEID =:SITEID AND L.FSTATUS = 'A' ");
            }

            if (!string.IsNullOrEmpty(searchEquipmentFLoc))
            {
                sqlCmdBuilder.Append(" AND(UPPER(L.FLOCATIONNAME) LIKE :FLOCEQUIPMENT OR L.FLOCATIONCODE LIKE :FLOCEQUIPMENT) ");
            }
            else if (!string.IsNullOrEmpty(equipmentFLocationCode))
            {
                sqlCmdBuilder.Append(" AND L.FLOCATIONCODE=:EQUIPMENTCODE  ");
            }

            sqlCmdBuilder.Append(" UNION ");
            sqlCmdBuilder.Append(" SELECT E.FEQUIPMENTID AS FLOCEQUIPMENTID,E.FEQUIPMENTNAME AS FEQUIPMENTNAME,E.FEQUIPMENTCODE, 'E' AS FPARENTTYPE ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_EQUIPMENT E ");

            if (userID > 0 && restrictAccess)
            {

                sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_LOCATIONS ML ON ML.FLOCATIONID = E.FLOCATIONID AND ML.FSITEID = E.FSITEID ");
                sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_AUTH_GROUP AE ON AE.FREFERENCEID = E.FEQUIPMENTID AND AE.FSITEID = E.FSITEID AND AE.FTYPE = 'EQUIPMENT' AND AE.FSTATUS = 'A' ");
                sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_AUTH_GROUP APE ON APE.FREFERENCEID = E.FPARENTEQUIPMENTID AND APE.FSITEID = E.FSITEID AND APE.FTYPE = 'EQUIPMENT' AND APE.FSTATUS = 'A' ");
                sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_AUTH_GROUP AFL ON AFL.FREFERENCEID = E.FLOCATIONID AND AFL.FSITEID = E.FSITEID AND AFL.FTYPE = 'LOCATION' AND AFL.FSTATUS = 'A' ");
                sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_AUTH_GROUP APFL ON APFL.FREFERENCEID = ML.FPARENTLOCATIONID AND APFL.FSITEID = E.FSITEID AND APFL.FTYPE = 'LOCATION' AND APFL.FSTATUS = 'A' ");
                sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_WORKGROUPUSER MW ON MW.FWORKGROUPID = (CASE WHEN AE.FWORKGROUPID IS NOT NULL THEN AE.FWORKGROUPID ");
                sqlCmdBuilder.Append(" WHEN APE.FWORKGROUPID IS NOT NULL THEN APE.FWORKGROUPID ELSE AFL.FWORKGROUPID END) AND MW.FSITEID = E.FSITEID AND MW.FSTATUS = 'A' ");
                sqlCmdBuilder.Append(" WHERE E.FSITEID =:SITEID AND E.FSTATUS = 'A' AND E.FINFOTYPE = 'E' ");
                if (!string.IsNullOrEmpty(searchEquipmentFLoc))
                {
                    sqlCmdBuilder.Append(" AND(UPPER(E.FEQUIPMENTNAME) LIKE :FLOCEQUIPMENT OR E.FEQUIPMENTCODE LIKE :FLOCEQUIPMENT) ");
                }
                else if (!string.IsNullOrEmpty(equipmentFLocationCode))
                {
                    sqlCmdBuilder.Append(" AND E.FEQUIPMENTCODE =:EQUIPMENTCODE ");
                }
                sqlCmdBuilder.Append(" AND((AE.FREFERENCEID IS NULL AND APE.FREFERENCEID IS NULL AND AFL.FREFERENCEID IS NULL AND APFL.FREFERENCEID IS NULL) OR MW.FUSERID =:USERID)  ");
            }
            else
            {
                sqlCmdBuilder.Append(" WHERE E.FSITEID =:SITEID AND E.FSTATUS = 'A' AND E.FINFOTYPE = 'E' ");
            }

            if (!string.IsNullOrEmpty(searchEquipmentFLoc))
            {
                sqlCmdBuilder.Append(" AND(UPPER(E.FEQUIPMENTNAME) LIKE :FLOCEQUIPMENT OR E.FEQUIPMENTCODE LIKE :FLOCEQUIPMENT) ");
            }
            else if (!string.IsNullOrEmpty(equipmentFLocationCode))
            {
                sqlCmdBuilder.Append(" AND E.FEQUIPMENTCODE =:EQUIPMENTCODE ");
            }

            sqlCmdBuilder.Append(" ORDER BY FEQUIPMENTCODE ASC ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            if (userID > 0 && restrictAccess)
                db.AddInParameter(dbCmd, ":USERID", DbType.Int32, userID);

            if (!string.IsNullOrEmpty(searchEquipmentFLoc))
            {
                db.AddInParameter(dbCmd, ":FLOCEQUIPMENT", DbType.String, "%" + searchEquipmentFLoc.Trim().ToUpper() + "%");
            }
            else
            {
                db.AddInParameter(dbCmd, ":EQUIPMENTCODE", DbType.AnsiString, equipmentFLocationCode.Trim().ToUpper());
            }

            return db.ExecuteReader(dbCmd);
        }

        #endregion

        #region WorkOrders

        public static bool UpdateWorkOrderInfo(Database db, DbTransaction transaction, int siteID, string workOrderID, int startDate, int startTime, int startedBy, int endDate, int endTime, int endedBy, string status, int taskGroupID, decimal timeTaken, char timeTakenUnit, int timeConfirmedBy, int updatedOn, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_WORKORDER SET FSTARTDATE=:STARTDATE,FSTARTTIME=:STARTTIME,FSTARTEDBY=:STARTEDBY,FENDDATE=:ENDDATE,FENDTIME=:ENDTIME,FENDEDBY=:ENDEDBY ");
            sqlCmdBuilder.Append(" ,FWORKORDERSTATUS =:STATUS,FTASKGROUPID=:TASKGROUPID,FTIMETAKEN=:TIMETAKEN,FTIMETAKENUNIT=:TIMETAKENUNIT,FTIMECONFIRMEDBY=:TIMECONFIRMEDBY ");
            sqlCmdBuilder.Append(" ,FUPDATEDON=:UPDATEDON,FUPDATEDTIME=:UPDATEDTIME ");
            sqlCmdBuilder.Append(" WHERE FWORK_ORDERID=:WORK_ORDERID AND FSITEID=:SITEID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":WORK_ORDERID", DbType.AnsiString, workOrderID.Trim().PadLeft(12, '0'));
            db.AddInParameter(dbCmd, ":STARTDATE", DbType.Int32, startDate);
            db.AddInParameter(dbCmd, ":STARTTIME", DbType.Int32, startTime);
            db.AddInParameter(dbCmd, ":STARTEDBY", DbType.Int32, startedBy);
            db.AddInParameter(dbCmd, ":ENDDATE", DbType.Int32, endDate);
            db.AddInParameter(dbCmd, ":ENDTIME", DbType.Int32, endTime);
            db.AddInParameter(dbCmd, ":ENDEDBY", DbType.Int32, endedBy);
            db.AddInParameter(dbCmd, ":STATUS", DbType.AnsiString, status.Trim());
            db.AddInParameter(dbCmd, ":TASKGROUPID", DbType.Int32, taskGroupID);
            db.AddInParameter(dbCmd, ":TIMETAKEN", DbType.Decimal, timeTaken);
            db.AddInParameter(dbCmd, ":TIMETAKENUNIT", DbType.AnsiStringFixedLength, timeTakenUnit);
            db.AddInParameter(dbCmd, ":TIMECONFIRMEDBY", DbType.Int32, timeConfirmedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedOn);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);

            db.ExecuteNonQuery(dbCmd, transaction);
            return true;
        }

        public static bool CheckIfWorkOrderTaskExists(Database db, DbTransaction transaction, int siteID, string workOrderID, int taskID)
        {
            IDataReader dataReaderWorkOrderTask = null;
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FTASKID FROM LDB1_MAINT_WORKORDER_TASK ");
            sqlCmdBuilder.Append(" WHERE FWORK_ORDERID=:WORK_ORDERID AND FTASKID=:TASKID AND FSITEID=:SITEID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":WORK_ORDERID", DbType.AnsiString, workOrderID.Trim().PadLeft(12, '0'));
            db.AddInParameter(dbCmd, ":TASKID", DbType.Int32, taskID);

            bool isExists = false;
            try
            {
                using (dataReaderWorkOrderTask = transaction != null ? db.ExecuteReader(dbCmd, transaction) : db.ExecuteReader(dbCmd))
                {
                    if (dataReaderWorkOrderTask.Read())
                    {
                        isExists = true;
                    }
                    dataReaderWorkOrderTask.Close();
                }

                return isExists;
            }
            catch
            {
                throw;
            }
            finally
            {
                if (dataReaderWorkOrderTask != null && !dataReaderWorkOrderTask.IsClosed)
                    dataReaderWorkOrderTask.Close();
            }
        }

        public static void UpdateTaskInfo(Database db, DbTransaction transaction, int siteID, string workOrderID, int taskID, int sequenceNum, string remarks, char isSafetyConfirmed, char isPPEConfirmed, int startDate, int startTime, int startedBy, int endDate, int endTime, int endedBy,
            int updatedOn, int updatedTime, int createdOn, int createdTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_WORKORDER_TASK SET FSEQUENCENUM=:SEQUENCENUM,FREMARKS=:REMARKS,FISSAFETYCONFIRMED=:ISSAFETYCONFIRMED,FISPPECONFIRMED=:ISPPECONFIRMED ");
            sqlCmdBuilder.Append(" ,FSTARTEDBY=:STARTEDBY,FSTARTDATE=:STARTDATE,FSTARTTIME=:STARTTIME,FENDEDBY=:ENDEDBY,FENDDATE=:ENDDATE,FENDTIME=:ENDTIME ");
            sqlCmdBuilder.Append(" ,FUPDATEDON=:UPDATEDON,FUPDATEDTIME=:UPDATEDTIME,FCREATEDON=:CREATEDON,FCREATEDTIME=:CREATEDTIME ");
            sqlCmdBuilder.Append(" WHERE FWORK_ORDERID=:WORK_ORDERID AND FTASKID=:TASKID AND FSITEID=:SITEID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":WORK_ORDERID", DbType.AnsiString, workOrderID.Trim().PadLeft(12, '0'));
            db.AddInParameter(dbCmd, ":TASKID", DbType.Int32, taskID);
            db.AddInParameter(dbCmd, ":SEQUENCENUM", DbType.Int32, sequenceNum);
            db.AddInParameter(dbCmd, ":REMARKS", DbType.String, remarks.Trim());
            db.AddInParameter(dbCmd, ":ISSAFETYCONFIRMED", DbType.AnsiStringFixedLength, isSafetyConfirmed);
            db.AddInParameter(dbCmd, ":ISPPECONFIRMED", DbType.AnsiStringFixedLength, isPPEConfirmed);
            db.AddInParameter(dbCmd, ":STARTEDBY", DbType.Int32, startedBy);
            db.AddInParameter(dbCmd, ":STARTDATE", DbType.Int32, startDate);
            db.AddInParameter(dbCmd, ":STARTTIME", DbType.Int32, startTime);
            db.AddInParameter(dbCmd, ":ENDEDBY", DbType.Int32, endedBy);
            db.AddInParameter(dbCmd, ":ENDDATE", DbType.Int32, endDate);
            db.AddInParameter(dbCmd, ":ENDTIME", DbType.Int32, endTime);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedOn);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);
            db.AddInParameter(dbCmd, ":CREATEDON", DbType.Int32, createdOn);
            db.AddInParameter(dbCmd, ":CREATEDTIME", DbType.Int32, createdTime);

            db.ExecuteNonQuery(dbCmd, transaction);
        }

        public static void InsertTaskInfo(Database db, DbTransaction transaction, int siteID, string workOrderID, int taskID, int sequenceNum, string remarks, char IsSafetyConfirmed, char isPPEConfirmed, int startDate, int startTime, int startedBy, int endDate, int endTime, int endedBy, int createdOn, int createdTime, int updatedOn, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" INSERT INTO LDB1_MAINT_WORKORDER_TASK(FWORK_ORDERID,FSITEID,FTASKID,FSEQUENCENUM,FREMARKS,FISSAFETYCONFIRMED,FISPPECONFIRMED,FSTARTEDBY,FSTARTDATE,FSTARTTIME,FENDEDBY,FENDDATE,FENDTIME,FCREATEDON,FCREATEDTIME,FUPDATEDON,FUPDATEDTIME) ");
            sqlCmdBuilder.Append(" VALUES(:WORK_ORDERID,:SITEID,:TASKID,:SEQUENCENUM,:REMARKS,:ISSAFETYCONFIRMED,:ISPPECONFIRMED,:STARTEDBY,:STARTDATE,:STARTTIME,:ENDEDBY,:ENDDATE,:ENDTIME,:CREATEDON,:CREATEDTIME,:UPDATEDON,:UPDATEDTIME) ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":WORK_ORDERID", DbType.AnsiString, workOrderID.Trim().PadLeft(12, '0'));
            db.AddInParameter(dbCmd, ":TASKID", DbType.Int32, taskID);
            db.AddInParameter(dbCmd, ":SEQUENCENUM", DbType.Int32, sequenceNum);
            db.AddInParameter(dbCmd, ":REMARKS", DbType.String, remarks.Trim());
            db.AddInParameter(dbCmd, ":ISSAFETYCONFIRMED", DbType.AnsiStringFixedLength, IsSafetyConfirmed);
            db.AddInParameter(dbCmd, ":ISPPECONFIRMED", DbType.AnsiStringFixedLength, isPPEConfirmed);
            db.AddInParameter(dbCmd, ":STARTEDBY", DbType.Int32, startedBy);
            db.AddInParameter(dbCmd, ":STARTDATE", DbType.Int32, startDate);
            db.AddInParameter(dbCmd, ":STARTTIME", DbType.Int32, startTime);
            db.AddInParameter(dbCmd, ":ENDEDBY", DbType.Int32, endedBy);
            db.AddInParameter(dbCmd, ":ENDDATE", DbType.Int32, endDate);
            db.AddInParameter(dbCmd, ":ENDTIME", DbType.Int32, endTime);
            db.AddInParameter(dbCmd, ":CREATEDON", DbType.Int32, createdOn);
            db.AddInParameter(dbCmd, ":CREATEDTIME", DbType.Int32, createdTime);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedOn);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);

            db.ExecuteNonQuery(dbCmd, transaction);
        }

        public static bool CheckIfWorkOrderTaskParameterInfo(Database db, DbTransaction transaction, int siteID, string workOrderID, int taskID, int parameterID)
        {
            IDataReader dataReaderWorkOrderTaskPrameterInfo = null;
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FPARAMETERID FROM LDB1_MAINT_WORKORDER_TASKPARAM ");
            sqlCmdBuilder.Append(" WHERE FWORK_ORDERID=:WORK_ORDERID AND FTASKID=:TASKID AND FPARAMETERID=:PARAMETERID AND FSITEID=:SITEID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":WORK_ORDERID", DbType.AnsiString, workOrderID.Trim().PadLeft(12, '0'));
            db.AddInParameter(dbCmd, ":TASKID", DbType.Int32, taskID);
            db.AddInParameter(dbCmd, ":PARAMETERID", DbType.Int32, parameterID);

            bool isExists = false;
            try
            {
                using (dataReaderWorkOrderTaskPrameterInfo = transaction != null ? db.ExecuteReader(dbCmd, transaction) : db.ExecuteReader(dbCmd))
                {
                    if (dataReaderWorkOrderTaskPrameterInfo.Read())
                    {
                        isExists = true;
                    }
                    dataReaderWorkOrderTaskPrameterInfo.Close();
                }

                return isExists;
            }
            catch
            {
                throw;
            }
            finally
            {
                if (dataReaderWorkOrderTaskPrameterInfo != null && !dataReaderWorkOrderTaskPrameterInfo.IsClosed)
                    dataReaderWorkOrderTaskPrameterInfo.Close();
            }
        }

        public static void UpdateWorkOrderTaskParameterInfo(Database db, DbTransaction transaction, int siteID, string workOrderID, int taskID, int parameterID, string parameterValue, int selectCodeItem, char status, int recordedBy, int recordedDate, int recordedTime, int createdOn, int createdTime, int updatedOn, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_WORKORDER_TASKPARAM SET FVALUE=:PARAMETERVALUE,FSELECTCODEITEM=:SELECTCODEITEM,FSTATUS=:STATUS,FRECORDEDBY=:RECORDEDBY,FRECORDEDDATE=:RECORDEDDATE,FRECORDEDTIME=:RECORDEDTIME,FCREATEDON=:CREATEDON,FCREATEDTIME=:CREATEDTIME,FUPDATEDON=:UPDATEDON,FUPDATEDTIME=:UPDATEDTIME ");
            sqlCmdBuilder.Append(" WHERE FWORK_ORDERID=:WORK_ORDERID AND FTASKID=:TASKID AND FPARAMETERID=:PARAMETERID AND FSITEID=:SITEID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":WORK_ORDERID", DbType.AnsiString, workOrderID.Trim().PadLeft(12, '0'));
            db.AddInParameter(dbCmd, ":TASKID", DbType.Int32, taskID);
            db.AddInParameter(dbCmd, ":PARAMETERID", DbType.Int32, parameterID);
            db.AddInParameter(dbCmd, ":PARAMETERVALUE", DbType.String, parameterValue.Trim());
            db.AddInParameter(dbCmd, ":SELECTCODEITEM", DbType.Int32, selectCodeItem);
            db.AddInParameter(dbCmd, ":STATUS", DbType.AnsiStringFixedLength, status);
            db.AddInParameter(dbCmd, ":RECORDEDBY", DbType.Int32, recordedBy);
            db.AddInParameter(dbCmd, ":RECORDEDDATE", DbType.Int32, recordedDate);
            db.AddInParameter(dbCmd, ":RECORDEDTIME", DbType.Int32, recordedTime);
            db.AddInParameter(dbCmd, ":CREATEDON", DbType.Int32, createdOn);
            db.AddInParameter(dbCmd, ":CREATEDTIME", DbType.Int32, createdTime);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedOn);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);

            db.ExecuteNonQuery(dbCmd, transaction);
        }

        public static void InsertWorkOrderTaskParameterInfo(Database db, DbTransaction transaction, int siteID, string workOrderID, int taskID, int parameterID, string parameterValue, int selectCodeItem, int recordedBy, int recordedDate, int recordedTime, int createdOn, int createdTime, int updatedOn, int updatedTime, char status)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" INSERT INTO LDB1_MAINT_WORKORDER_TASKPARAM(FWORK_ORDERID,FSITEID,FTASKID,FPARAMETERID,FVALUE,FSELECTCODEITEM,FRECORDEDBY,FRECORDEDDATE,FRECORDEDTIME,FCREATEDON,FCREATEDTIME,FUPDATEDON,FUPDATEDTIME,FSTATUS) ");
            sqlCmdBuilder.Append(" VALUES(:WORK_ORDERID,:SITEID,:TASKID,:PARAMETERID,:PARAMETERVALUE,:SELECTCODEITEM,:RECORDEDBY,:RECORDEDDATE,:RECORDEDTIME,:CREATEDON,:CREATEDTIME,:UPDATEDON,:UPDATEDTIME,:STATUS) ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":WORK_ORDERID", DbType.AnsiString, workOrderID.Trim().PadLeft(12, '0'));
            db.AddInParameter(dbCmd, ":TASKID", DbType.Int32, taskID);
            db.AddInParameter(dbCmd, ":PARAMETERID", DbType.Int32, parameterID);
            db.AddInParameter(dbCmd, ":PARAMETERVALUE", DbType.String, parameterValue.Trim());
            db.AddInParameter(dbCmd, ":SELECTCODEITEM", DbType.Int32, selectCodeItem);
            db.AddInParameter(dbCmd, ":RECORDEDBY", DbType.Int32, recordedBy);
            db.AddInParameter(dbCmd, ":RECORDEDDATE", DbType.Int32, recordedDate);
            db.AddInParameter(dbCmd, ":RECORDEDTIME", DbType.Int32, recordedTime);
            db.AddInParameter(dbCmd, ":CREATEDON", DbType.Int32, createdOn);
            db.AddInParameter(dbCmd, ":CREATEDTIME", DbType.Int32, createdTime);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedOn);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);
            db.AddInParameter(dbCmd, ":STATUS", DbType.AnsiStringFixedLength, status);

            db.ExecuteNonQuery(dbCmd, transaction);
        }

        public static void UpdateWorkOrderTaskImageInfo(Database db, DbTransaction transaction, int siteID, string workOrderID, int taskID, string imageName)
        {

        }
        #endregion

        #region App Details Info

        public static IDataReader GetAppDetailsInfo(Database db, string appName)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FVEGAMAPPID,FAPPNAME,FAPPVERSION,FRELEASENUMBER,FUPDATETYPE,FCREATEDON,FCREATEDTIME,FREMARKS ");
            sqlCmdBuilder.Append(" FROM LDB1_VEGAM_APPDETAILS ");
            sqlCmdBuilder.Append(" WHERE FAPPNAME =:APPNAME AND FSTATUS = 'A'");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":APPNAME", DbType.AnsiString, appName.Trim().ToUpper());

            return db.ExecuteReader(dbCmd);
        }

        #endregion

        #endregion

        #region User Info

        public static IDataReader GetCurrentUserSiteInfoByUserID(Database db, int userID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT A.FUSERID,NVL(A.FDEFAULTSITE,0) AS FDEFAULTSITE,NVL(A.FREGDEFAULTSITEID,0) AS FREGDEFAULTSITEID,DECODE(NVL(A.FSITEID,0),0,P.FSITEID,A.FSITEID) AS FSITEID ");
            sqlCmdBuilder.Append(" FROM LDB1_USERINFO A ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_PLANTUSERINFO P ON P.FUSERID=A.FUSERID ");
            sqlCmdBuilder.Append(" WHERE A.FUSERID =:USERID AND A.FSTATUS ='A' ");

            System.Data.Common.DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":USERID", DbType.Int32, userID);
            return db.ExecuteReader(dbCmd);
        }

        #endregion
    }
}
