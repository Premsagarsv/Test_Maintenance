﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using Microsoft.Practices.EnterpriseLibrary.Data;
using System.Data.Common;

namespace Vegam_MaintenanceService_DAL
{
    public class MaintenanceDAL
    {
        #region Common
        public static IDataReader GetMaintenanceFeatures(Database db, int siteID, int plineID, string featureType)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();

            sqlCmdBuilder.Append(" SELECT F.FFEATURENAME,PF.FPAGETOLOAD ");
            sqlCmdBuilder.Append(" FROM LDB1_FEATURES F ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_COUNTRY_SITES C ON C.FSITEID = :SITEID ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_PLANTFEATURE PF ON PF.FFEATUREID=F.FFEATUREID  ");

            if (plineID > 0)
            {
                sqlCmdBuilder.Append(" AND PF.FPLINEID=:PLINEID ");
            }

            sqlCmdBuilder.Append(" WHERE F.FFEATURETYPE=:FEATURETYPE AND (PF.FSITEID=:SITEID OR PF.FSITEID=0) AND PF.FCOMPANYID = C.FCOMPANYID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":FEATURETYPE", DbType.AnsiString, featureType.Trim().ToUpper());
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            if (plineID > 0)
            {
                db.AddInParameter(dbCmd, ":PLINEID", DbType.Int32, plineID);
            }

            return db.ExecuteReader(dbCmd);
        }

        public static string GenerateRandomCode(Database db, int siteID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            string sequenceName = string.Empty;

            sqlCmdBuilder.Append(" SELECT SEQUENCE_GENERATERANDOM_ID.NEXTVAL AS FGENERATERANDOMCODE FROM DUAL");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            return db.ExecuteScalar(dbCmd).ToString();
        }

        #endregion

        #region Functional Location Info
        public static IDataReader GetAllFunctionalLocationInfo(Database db, DbTransaction transaction, int siteID, int pageSize, int pageIndex, int locationID, string functionalLocName, string functionalLocCode, string searchLocationIDs, bool considerStatus, bool isFromExcel, string sortType, int userID, bool restrictAccess)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();

            if (pageSize > 0)
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");

            sqlCmdBuilder.Append(" SELECT DISTINCT L.FLOCATIONID,L.FLOCATIONCODE,L.FLOCATIONNAME,L.FLOCATIONDESC,L.FPARENTLOCATIONID,PL.FLOCATIONNAME AS FPARENTLOCATIONNAME,L.FIMAGENAME,L.FUPDATEDON,L.FUPDATEDTIME,L.FSTATUS  ");

            if (isFromExcel)
            {
                sqlCmdBuilder.Append(" ,(U.FFIRSTNAME || ' ' || U.FLASTNAME) AS FUPDATEUSERNAME ");
            }

            sqlCmdBuilder.Append(" FROM LDB1_MAINT_LOCATIONS L ");

            if (isFromExcel)
            {
                sqlCmdBuilder.Append(" INNER JOIN LDB1_USERINFO U ON U.FUSERID=L.FUPDATEDBY ");
            }

            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_LOCATIONS PL ON PL.FSITEID=L.FSITEID AND PL.FSTATUS='A' AND PL.FLOCATIONID=L.FPARENTLOCATIONID ");

            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_AUTH_GROUP MA ON MA.FREFERENCEID=L.FLOCATIONID AND MA.FSITEID=L.FSITEID AND MA.FTYPE='LOCATION' AND MA.FSTATUS='A' ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_WORKGROUPUSER MW ON MW.FWORKGROUPID=MA.FWORKGROUPID AND MW.FSITEID=MA.FSITEID AND MW.FSTATUS='A' ");

            sqlCmdBuilder.Append(" WHERE L.FSITEID=:SITEID ");

            if (userID > 0 && restrictAccess == true)
            {
                sqlCmdBuilder.Append(" AND (MA.FREFERENCEID IS NULL OR MW.FUSERID=:USERID) ");
            }

            if (considerStatus)
            {
                sqlCmdBuilder.Append(" AND L.FSTATUS='A' ");
            }

            if (!string.IsNullOrEmpty(functionalLocName) && !string.IsNullOrEmpty(functionalLocCode))
            {
                sqlCmdBuilder.Append(" AND (UPPER(L.FLOCATIONNAME)=:LOCATIONNAME OR UPPER(L.FLOCATIONCODE)=:LOCATIONCODE )");
            }
            else if (!string.IsNullOrEmpty(functionalLocName))
            {
                sqlCmdBuilder.Append(" AND UPPER(L.FLOCATIONNAME)=:LOCATIONNAME ");
            }

            if (locationID > 0) //checking purpose location exist or not
            {
                sqlCmdBuilder.Append(" AND L.FLOCATIONID<>:LOCATIONID ");
            }

            if (!string.IsNullOrEmpty(searchLocationIDs))
            {
                sqlCmdBuilder.Append(" AND L.FLOCATIONID IN (" + searchLocationIDs.Trim() + ") ");
            }

            //sqlCmdBuilder.Append(" ORDER BY L.FUPDATEDON DESC,L.FUPDATEDTIME DESC ");

            #region Sorting
            switch (sortType)
            {
                case "FunctionalLoc_asc":
                    sqlCmdBuilder.Append(" ORDER BY L.FLOCATIONNAME ASC ");
                    break;
                case "FunctionalLoc_desc":
                    sqlCmdBuilder.Append(" ORDER BY L.FLOCATIONNAME DESC ");
                    break;
                case "UpdateOn_asc":
                    sqlCmdBuilder.Append(" ORDER BY L.FUPDATEDON ASC,L.FUPDATEDTIME ASC ");
                    break;
                default:
                    sqlCmdBuilder.Append(" ORDER BY L.FUPDATEDON DESC,L.FUPDATEDTIME DESC ");
                    break;
            }
            #endregion

            #region Paging
            if (pageSize > 0)
            {
                if (pageIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:PAGEINDEX)  AND (:PAGESIZE + (:PAGEINDEX - 1))");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:PAGEINDEX)  AND  (:PAGESIZE + (:PAGEINDEX))");
            }
            #endregion

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            if (userID > 0 && restrictAccess == true)
                db.AddInParameter(dbCmd, ":USERID", DbType.Int32, userID);

            if (!string.IsNullOrEmpty(functionalLocName))
            {
                db.AddInParameter(dbCmd, ":LOCATIONNAME", DbType.String, functionalLocName.Trim().ToUpper());
            }
            if (!string.IsNullOrEmpty(functionalLocCode))
            {
                db.AddInParameter(dbCmd, ":LOCATIONCODE", DbType.AnsiString, functionalLocCode.Trim().ToUpper());
            }
            if (locationID > 0)
            {
                db.AddInParameter(dbCmd, ":LOCATIONID", DbType.Int32, locationID);
            }

            if (pageSize > 0)
            {
                db.AddInParameter(dbCmd, ":PAGEINDEX", DbType.Int32, pageIndex);
                db.AddInParameter(dbCmd, ":PAGESIZE", DbType.Int32, pageSize);
            }

            if (transaction != null)
                return db.ExecuteReader(dbCmd, transaction);
            else
                return db.ExecuteReader(dbCmd);
        }

        public static int InsertFunctionalLocationInfo(Database db, DbTransaction transaction, int siteID, string locationCode, string locationName, string locationDescription, int parentLocationID, string imageName, int createdBy, int createdDate, int createdTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" INSERT INTO LDB1_MAINT_LOCATIONS(FLOCATIONID,FSITEID,FLOCATIONCODE,FLOCATIONNAME,FLOCATIONDESC,FIMAGENAME,FPARENTLOCATIONID,FSTATUS,FCREATEDBY,FCREATEDON,FCREATEDTIME,FUPDATEDBY,FUPDATEDON,FUPDATEDTIME) ");
            sqlCmdBuilder.Append(" VALUES(SEQUENCE_MAINT_EQUIPMENT_ID.NEXTVAL,:SITEID,:LOCATIONCODE,:LOCATIONNAME,:LOCATIONDESC,:IMAGENAME,:PARENTLOCATIONID,'A',:CREATEDBY,:CREATEDON,:CREATEDTIME,:CREATEDBY,:CREATEDON,:CREATEDTIME) ");
            sqlCmdBuilder.Append(" RETURNING FLOCATIONID INTO :LOCATIONID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddOutParameter(dbCmd, ":LOCATIONID", DbType.Int32, sizeof(Int32));
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":LOCATIONCODE", DbType.AnsiString, locationCode.Trim().ToUpper());
            db.AddInParameter(dbCmd, ":LOCATIONNAME", DbType.String, locationName.Trim());
            db.AddInParameter(dbCmd, ":LOCATIONDESC", DbType.String, locationDescription.Trim());
            db.AddInParameter(dbCmd, ":IMAGENAME", DbType.String, imageName != null ? imageName.Trim() : imageName);
            db.AddInParameter(dbCmd, ":CREATEDBY", DbType.Int32, createdBy);
            db.AddInParameter(dbCmd, ":CREATEDON", DbType.Int32, createdDate);
            db.AddInParameter(dbCmd, ":CREATEDTIME", DbType.Int32, createdTime);
            db.AddInParameter(dbCmd, ":PARENTLOCATIONID", DbType.Int32, parentLocationID);

            if (transaction != null)
                db.ExecuteNonQuery(dbCmd, transaction);
            else
                db.ExecuteNonQuery(dbCmd);

            return Convert.ToInt32(db.GetParameterValue(dbCmd, ":LOCATIONID"));
        }

        public static bool UpdateFunctionalLocationInfo(Database db, DbTransaction transaction, int siteID, int locationID, string locationCode, string locationName, string locationDescription, int parentLocationID, string imageName, int updatedBy, int updatedDate, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_LOCATIONS SET FLOCATIONCODE=:LOCATIONCODE,FLOCATIONNAME=:LOCATIONNAME,FLOCATIONDESC=:LOCATIONDESC ");

            if (!string.IsNullOrEmpty(imageName))
            {
                sqlCmdBuilder.Append(" ,FIMAGENAME=:IMAGENAME ");
            }

            sqlCmdBuilder.Append(" ,FPARENTLOCATIONID=:PARENTLOCATIONID,FUPDATEDBY=:UPDATEDBY,FUPDATEDON=:UPDATEDON,FUPDATEDTIME=:UPDATEDTIME ");
            sqlCmdBuilder.Append(" WHERE FLOCATIONID=:LOCATIONID AND FSITEID=:SITEID AND FSTATUS='A' ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":LOCATIONID", DbType.Int32, locationID);
            db.AddInParameter(dbCmd, ":LOCATIONCODE", DbType.AnsiString, locationCode.Trim().ToUpper());
            db.AddInParameter(dbCmd, ":LOCATIONNAME", DbType.String, locationName.Trim());
            db.AddInParameter(dbCmd, ":LOCATIONDESC", DbType.String, locationDescription.Trim());

            if (!string.IsNullOrEmpty(imageName))
            {
                db.AddInParameter(dbCmd, ":IMAGENAME", DbType.String, imageName.Trim());
            }

            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedDate);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);
            db.AddInParameter(dbCmd, ":PARENTLOCATIONID", DbType.Int32, parentLocationID);

            if (transaction != null)
                db.ExecuteNonQuery(dbCmd, transaction);
            else
                db.ExecuteNonQuery(dbCmd);

            return true;
        }

        public static bool UpdateFunctionalLocStatus(Database db, DbTransaction transaction, int siteID, int locationID, char status, int updatedBy, int updatedDate, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_LOCATIONS SET FSTATUS=:STATUS,FUPDATEDBY=:UPDATEDBY,FUPDATEDON=:UPDATEDON,FUPDATEDTIME=:UPDATEDTIME ");
            if (status == 'I')
            {
                sqlCmdBuilder.Append(" ,FIMAGENAME=NULL ");
            }
            sqlCmdBuilder.Append(" WHERE FLOCATIONID=:LOCATIONID AND FSITEID=:SITEID  ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":LOCATIONID", DbType.Int32, locationID);
            db.AddInParameter(dbCmd, ":STATUS", DbType.AnsiStringFixedLength, status);
            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedDate);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);

            if (transaction != null)
                db.ExecuteNonQuery(dbCmd, transaction);
            else
                db.ExecuteNonQuery(dbCmd);

            return true;
        }

        public static bool CheckFunctionalLocationExist(Database db, DbTransaction transaction, int siteID, int locationID)
        {
            IDataReader dataReaderCheck = null;
            try
            {
                StringBuilder sqlCmdBuilder = new StringBuilder();
                sqlCmdBuilder.Append(" SELECT FEQUIPMENTID FROM LDB1_MAINT_EQUIPMENT ");
                sqlCmdBuilder.Append(" WHERE FLOCATIONID=:LOCATIONID AND FSITEID=:SITEID AND FSTATUS='A' ");

                DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
                dbCmd.CommandType = CommandType.Text;

                db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
                db.AddInParameter(dbCmd, ":LOCATIONID", DbType.Int32, locationID);

                bool isExists = false;
                using (dataReaderCheck = transaction != null ? db.ExecuteReader(dbCmd, transaction) : db.ExecuteReader(dbCmd))
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

        public static IDataReader CheckIsParentFunctionalLocation(Database db, DbTransaction transaction, int siteID, int locationID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FLOCATIONID, FLOCATIONNAME ");
            sqlCmdBuilder.Append(",( SELECT COUNT(FLOCATIONID) FROM LDB1_MAINT_LOCATIONS WHERE FSITEID=:SITEID AND FPARENTLOCATIONID=:LOCATIONID AND FSTATUS='A') AS FCOUNT ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_LOCATIONS ");
            sqlCmdBuilder.Append(" WHERE FLOCATIONID=:LOCATIONID AND FSITEID=:SITEID AND FSTATUS='A' ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":LOCATIONID", DbType.Int32, locationID);

            if (transaction != null)
                return db.ExecuteReader(dbCmd, transaction);
            else
                return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetAllFunctionalLocations(Database db, int siteID, int pageSize, int pageIndex, string flocationName, int flocationID, string sortType, int userID, bool restrictAccess)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();

            if (pageSize > 0)
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");

            sqlCmdBuilder.Append(" SELECT DISTINCT L.FLOCATIONID,L.FLOCATIONNAME,L.FUPDATEDON,L.FUPDATEDTIME ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_LOCATIONS L ");

            if (userID > 0 && restrictAccess == true)
            {
                sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_AUTH_GROUP MA ON MA.FREFERENCEID=L.FLOCATIONID AND MA.FSITEID=L.FSITEID AND MA.FTYPE='LOCATION' AND MA.FSTATUS='A' ");
                sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_WORKGROUPUSER MW ON MW.FWORKGROUPID=MA.FWORKGROUPID AND MW.FSITEID=MA.FSITEID AND MW.FSTATUS='A' ");
            }

            sqlCmdBuilder.Append(" WHERE L.FSITEID=:SITEID AND L.FSTATUS='A' ");

            if (userID > 0 && restrictAccess == true)
            {
                sqlCmdBuilder.Append(" AND (MA.FREFERENCEID IS NULL OR MW.FUSERID=:USERID) ");
            }

            if (flocationID > 0)
            {
                sqlCmdBuilder.Append(" AND FLOCATIONID =:LOCATIONID ");
            }
            else if (!string.IsNullOrEmpty(flocationName))
            {
                sqlCmdBuilder.Append(" AND UPPER(FLOCATIONNAME) LIKE :LOCATIONNAME ");
            }

            #region Sorting
            switch (sortType)
            {
                case "LocationName_asc":
                    sqlCmdBuilder.Append(" ORDER BY FLOCATIONNAME ASC ");
                    break;
                case "LocationName_desc":
                    sqlCmdBuilder.Append(" ORDER BY FLOCATIONNAME DESC ");
                    break;
                default:
                    sqlCmdBuilder.Append(" ORDER BY FUPDATEDON DESC,FUPDATEDTIME DESC ");
                    break;
            }
            #endregion

            #region Paging
            if (pageSize > 0)
            {
                if (pageIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:PAGEINDEX)  AND (:PAGESIZE + (:PAGEINDEX - 1))");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:PAGEINDEX)  AND  (:PAGESIZE + (:PAGEINDEX))");
            }
            #endregion

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            if (userID > 0 && restrictAccess == true)
                db.AddInParameter(dbCmd, ":USERID", DbType.Int32, userID);

            if (flocationID > 0)
            {
                db.AddInParameter(dbCmd, ":LOCATIONID", DbType.Int32, flocationID);
            }
            else if (!string.IsNullOrEmpty(flocationName))
            {
                db.AddInParameter(dbCmd, ":LOCATIONNAME", DbType.String, "%" + flocationName.Trim().ToUpper() + "%");
            }

            if (pageSize > 0)
            {
                db.AddInParameter(dbCmd, ":PAGEINDEX", DbType.Int32, pageIndex);
                db.AddInParameter(dbCmd, ":PAGESIZE", DbType.Int32, pageSize);
            }

            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetFunctionalLocListForHierarchicalDropDown(Database db, int siteID, int userID, bool restrictAccess)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FLOCATIONID, FLOCATIONNAME, FPARENTLOCATIONID ,FLOCATIONIDS FROM ( ");
            sqlCmdBuilder.Append(" SELECT DISTINCT L.FLOCATIONID, L.FLOCATIONNAME, L.FPARENTLOCATIONID,UP.FLOCATIONIDS,L.FUPDATEDON, L.FUPDATEDTIME FROM LDB1_MAINT_LOCATIONS L  ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_LOCATIONS PL ON PL.FSITEID=L.FSITEID AND PL.FSTATUS='A' AND PL.FLOCATIONID=L.FPARENTLOCATIONID ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_USERPREFERENCE UP ON UP.FUSERID=:USERID ");

            if (userID > 0 && restrictAccess == true)
            {
                sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_AUTH_GROUP MA ON MA.FREFERENCEID=L.FLOCATIONID AND MA.FSITEID=L.FSITEID AND MA.FTYPE='LOCATION' AND MA.FSTATUS='A' ");
                sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_WORKGROUPUSER MW ON MW.FWORKGROUPID=MA.FWORKGROUPID AND MW.FSITEID=MA.FSITEID AND MW.FSTATUS='A' ");
            }
            sqlCmdBuilder.Append(" WHERE L.FSITEID=:SITEID AND L.FSTATUS='A' ");

            if (userID > 0 && restrictAccess == true)
            {
                sqlCmdBuilder.Append(" AND (MA.FREFERENCEID IS NULL OR MW.FUSERID=:USERID) ");
            }

            sqlCmdBuilder.Append(" ) ORDER BY FPARENTLOCATIONID ASC,FUPDATEDON DESC,FUPDATEDTIME DESC ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            if (userID > 0)
            {
                db.AddInParameter(dbCmd, ":USERID", DbType.Int32, userID);
            }

            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetParentFunctionalLocationDropDown(Database db, DbTransaction transaction, int siteID, int locationID, int userID, bool restrictAccess, int parentLocationID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();

            sqlCmdBuilder.Append(" SELECT DISTINCT L.FLOCATIONID, L.FLOCATIONNAME FROM LDB1_MAINT_LOCATIONS L ");

            if (userID > 0 && restrictAccess == true)
            {
                sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_AUTH_GROUP MA ON MA.FREFERENCEID=L.FLOCATIONID AND MA.FSITEID=L.FSITEID AND MA.FTYPE='LOCATION' AND MA.FSTATUS='A' ");
                sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_WORKGROUPUSER MW ON MW.FWORKGROUPID=MA.FWORKGROUPID AND MW.FSITEID=MA.FSITEID AND MW.FSTATUS='A' ");
            }

            sqlCmdBuilder.Append(" WHERE L.FSITEID=:SITEID AND L.FSTATUS='A' AND L.FLOCATIONID<>:LOCATIONID ");

            if (userID > 0 && restrictAccess == true)
            {
                sqlCmdBuilder.Append(" AND (MA.FREFERENCEID IS NULL OR MW.FUSERID=:USERID) ");
            }

            if (locationID > 0)
            {
                //sqlCmdBuilder.Append(" AND L.FLOCATIONID NOT IN (SELECT FLOCATIONID FROM LDB1_MAINT_LOCATIONS WHERE FSITEID=:SITEID AND FSTATUS = 'A' ");
                //sqlCmdBuilder.Append(" CONNECT BY PRIOR FLOCATIONID = FPARENTLOCATIONID START WITH FPARENTLOCATIONID=:LOCATIONID) ");
                sqlCmdBuilder.Append(" AND L.FLOCATIONID NOT IN (" + GetChildFLocationList(db, siteID, locationID) + ") ");
            }
            if (parentLocationID > 0)
            {
                sqlCmdBuilder.Append(" AND L.FLOCATIONID = :PARENTLOCATIONID ");
            }

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":LOCATIONID", DbType.Int32, locationID);

            if (parentLocationID > 0)
                db.AddInParameter(dbCmd, ":PARENTLOCATIONID", DbType.Int32, parentLocationID);

            if (userID > 0 && restrictAccess == true)
            {
                db.AddInParameter(dbCmd, ":USERID", DbType.Int32, userID);
            }

            if (transaction != null)
                return db.ExecuteReader(dbCmd, transaction);
            else
                return db.ExecuteReader(dbCmd);
        }

        private static string GetChildFLocationList(Database db, int siteID, int parentLocationID)
        {
            DataTable childLocationTable = GetSubFuncationLocationsForParent(db, siteID, parentLocationID);
            List<string> locationIDs = new List<string>();
            if (childLocationTable.Rows.Count > 0)
            {
                foreach (DataRow childRow in childLocationTable.Rows)
                {
                    locationIDs.Add(childRow["FLOCATIONID"].ToString());
                }
            }
            else
            {
                locationIDs.Add("0");
            }
            return string.Join(",", locationIDs);
        }

        public static DataTable GetUserWorkGroups(Database db, int siteID, int userID, bool restrictUser, string workGroupName)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT M.FMASTERID,M.FNAME ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_MASTER M ");

            if (userID > 0 && restrictUser == true)
            {
                sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_WORKGROUPUSER MW ON MW.FWORKGROUPID=M.FMASTERID AND MW.FUSERID=:USERID AND MW.FSITEID=M.FSITEID AND MW.FSTATUS='A' ");
            }
            sqlCmdBuilder.Append(" WHERE M.FSITEID=:SITEID AND M.FTYPE='WORKGROUP' AND M.FSTATUS='A' ");
            if (!string.IsNullOrEmpty(workGroupName))
            {
                sqlCmdBuilder.Append(" AND UPPER(M.FNAME) = :WORKGROUPNAME");
            }
            sqlCmdBuilder.Append(" ORDER BY M.FNAME ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            if (userID > 0 && restrictUser == true)
            {
                db.AddInParameter(dbCmd, ":USERID", DbType.Int32, userID);
            }
            if (!string.IsNullOrEmpty(workGroupName))
            {
                db.AddInParameter(dbCmd, ":WORKGROUPNAME", DbType.String, workGroupName.Trim().ToUpper());
            }

            return db.ExecuteDataSet(dbCmd).Tables[0];
        }

        public static DataTable GetAssignedWorkGroups(Database db, int siteID, int userID, int referenceID, string type)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT DISTINCT MA.FREFERENCEID,M.FMASTERID,M.FNAME ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_AUTH_GROUP MA ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_MASTER M ON M.FMASTERID=MA.FWORKGROUPID AND M.FSITEID=MA.FSITEID AND M.FTYPE='WORKGROUP' ");

            if (userID > 0)
                sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_WORKGROUPUSER MW ON MW.FWORKGROUPID=MA.FWORKGROUPID AND MW.FSITEID=MA.FSITEID AND MW.FSTATUS='A' ");

            sqlCmdBuilder.Append(" WHERE MA.FSITEID=:SITEID AND MA.FTYPE=:TYPE AND MA.FSTATUS='A' ");

            if (referenceID > 0)
                sqlCmdBuilder.Append(" AND MA.FREFERENCEID=:LOCATIONID ");

            if (userID > 0)
                sqlCmdBuilder.Append(" AND MW.FUSERID=:USERID ");
            sqlCmdBuilder.Append(" ORDER BY M.FNAME ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":TYPE", DbType.AnsiString, type.Trim().ToUpper());

            if (userID > 0)
                db.AddInParameter(dbCmd, ":USERID", DbType.Int32, userID);
            if (referenceID > 0)
                db.AddInParameter(dbCmd, ":LOCATIONID", DbType.Int32, referenceID);

            return db.ExecuteDataSet(dbCmd).Tables[0];
        }

        public static void DeleteAssignedWorkGroup(Database db, DbTransaction transaction, int siteID, string type, string referenceIDListString, string workGrupIDListString, int userID, int updatedDate, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_AUTH_GROUP SET FSTATUS='I',FUPDATEDDATE=:UPDATEDDATE,FUPDATEDTIME=:UPDATEDTIME,FUPDATEDBY=:UPDATEDBY ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FTYPE=:TYPE AND FREFERENCEID IN (" + referenceIDListString + ") ");

            if (workGrupIDListString.Length > 0)
                sqlCmdBuilder.Append(" AND FWORKGROUPID IN (" + workGrupIDListString + ") ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":TYPE", DbType.AnsiString, type.Trim().ToUpper());
            db.AddInParameter(dbCmd, ":UPDATEDDATE", DbType.Int32, updatedDate);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);
            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, userID);

            int result = db.ExecuteNonQuery(dbCmd, transaction);
        }

        public static void InsertWorkGroup(Database db, DbTransaction transaction, int siteID, string type, int referenceID, int workGroupID, int userID, int updateDate, int updateTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" INSERT INTO LDB1_MAINT_AUTH_GROUP (FREFERENCEID,FTYPE,FWORKGROUPID,FSITEID,FUPDATEDBY,FUPDATEDDATE,FUPDATEDTIME) ");
            sqlCmdBuilder.Append(" VALUES(:REFERENCEID,:TYPE,:WORKGROUPID,:SITEID,:UPDATEDBY,:UPDATEDDATE,:UPDATEDTIME) ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":REFERENCEID", DbType.Int32, referenceID);
            db.AddInParameter(dbCmd, ":TYPE", DbType.AnsiString, type.Trim().ToUpper());
            db.AddInParameter(dbCmd, ":WORKGROUPID", DbType.Int32, workGroupID);
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, userID);
            db.AddInParameter(dbCmd, ":UPDATEDDATE", DbType.Int32, updateDate);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updateTime);

            db.ExecuteNonQuery(dbCmd, transaction);
        }

        public static DataTable CheckWorkGroupAssignedForEquipments(Database db, int siteID, int locationID, int parentEquipmentID, string workGroupIDListString)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT DISTINCT E.FEQUIPMENTID,M.FNAME ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_EQUIPMENT E ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_AUTH_GROUP G ON G.FREFERENCEID=E.FEQUIPMENTID AND G.FSITEID=E.FSITEID AND G.FTYPE='EQUIPMENT' AND G.FWORKGROUPID IN (" + workGroupIDListString + ") AND G.FSTATUS='A' ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_MASTER M ON M.FMASTERID=G.FWORKGROUPID AND M.FSITEID=G.FSITEID AND M.FTYPE='WORKGROUP' AND M.FSTATUS='A' ");
            sqlCmdBuilder.Append(" WHERE E.FSITEID=:SITEID AND E.FSTATUS='A' ");

            if (locationID > 0)
                sqlCmdBuilder.Append(" AND E.FLOCATIONID=:LOCATIONID ");

            if (parentEquipmentID > 0)
                sqlCmdBuilder.Append(" AND E.FPARENTEQUIPMENTID=:PARENTEQUIPMENTID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            if (locationID > 0)
                db.AddInParameter(dbCmd, ":LOCATIONID", DbType.Int32, locationID);
            if (parentEquipmentID > 0)
                db.AddInParameter(dbCmd, ":PARENTEQUIPMENTID", DbType.Int32, parentEquipmentID);
            return db.ExecuteDataSet(dbCmd).Tables[0];
        }

        public static DataTable CheckWorkGroupAssignedForSubLocations(Database db, int siteID, int parentLocationID, string workGroupIDListString)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT DISTINCT L.FLOCATIONID,M.FNAME ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_LOCATIONS L ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_AUTH_GROUP G ON G.FREFERENCEID=L.FLOCATIONID AND G.FSITEID=L.FSITEID AND G.FTYPE='LOCATION' AND G.FWORKGROUPID IN (" + workGroupIDListString + ") AND G.FSTATUS='A' ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_MASTER M ON M.FMASTERID=G.FWORKGROUPID AND M.FSITEID=G.FSITEID AND M.FTYPE='WORKGROUP' AND M.FSTATUS='A'  ");
            sqlCmdBuilder.Append(" WHERE L.FSITEID=:SITEID AND L.FPARENTLOCATIONID=:LOCATIONID AND L.FSTATUS='A' ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":LOCATIONID", DbType.Int32, parentLocationID);

            return db.ExecuteDataSet(dbCmd).Tables[0];
        }

        public static IDataReader GetAllFuncLocForSchedule(Database db, int siteID, int pageSize, int pageIndex, string flocationName, int flocationID, string sortType, int userID, bool restrictAccess)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();

            if (pageSize > 0)
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");

            sqlCmdBuilder.Append(" SELECT DISTINCT L.FLOCATIONID,L.FLOCATIONNAME,L.FUPDATEDON,L.FUPDATEDTIME FROM LDB1_MAINT_LOCATIONS L ");

            if (userID > 0 && restrictAccess == true)
            {
                sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_AUTH_GROUP MA ON MA.FREFERENCEID=L.FLOCATIONID AND MA.FSITEID=L.FSITEID AND MA.FTYPE='LOCATION' AND MA.FSTATUS='A' ");
                sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_WORKGROUPUSER MW ON MW.FWORKGROUPID=MA.FWORKGROUPID AND MW.FSITEID=MA.FSITEID AND MW.FSTATUS='A' ");
            }


            sqlCmdBuilder.Append(" WHERE L.FSITEID=:SITEID AND L.FSTATUS='A' ");

            if (userID > 0 && restrictAccess == true)
            {
                sqlCmdBuilder.Append(" AND (MA.FREFERENCEID IS NULL OR MW.FUSERID=:USERID) ");
            }

            if (!string.IsNullOrEmpty(flocationName))
            {
                sqlCmdBuilder.Append(" AND UPPER(L.FLOCATIONNAME) LIKE :LOCATIONNAME ");
            }

            #region Sorting
            switch (sortType)
            {
                case "LocationName_asc":
                    sqlCmdBuilder.Append(" ORDER BY ");
                    if (flocationID > 0)
                        sqlCmdBuilder.Append(" CASE WHEN L.FLOCATIONID=:LOCATIONID THEN 0 ELSE 1 END, ");
                    sqlCmdBuilder.Append(" L.FLOCATIONNAME ASC ");
                    break;
                case "LocationName_desc":
                    sqlCmdBuilder.Append(" ORDER BY ");
                    if (flocationID > 0)
                        sqlCmdBuilder.Append(" CASE WHEN L.FLOCATIONID=:LOCATIONID THEN 0 ELSE 1 END, ");
                    sqlCmdBuilder.Append(" L.FLOCATIONNAME DESC ");
                    break;
                default:
                    sqlCmdBuilder.Append(" ORDER BY ");
                    if (flocationID > 0)
                        sqlCmdBuilder.Append(" CASE WHEN L.FLOCATIONID=:LOCATIONID THEN 0 ELSE 1 END, ");
                    sqlCmdBuilder.Append(" L.FUPDATEDON DESC,L.FUPDATEDTIME DESC ");
                    break;
            }
            #endregion

            #region Paging
            if (pageSize > 0)
            {
                if (pageIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:PAGEINDEX)  AND (:PAGESIZE + (:PAGEINDEX - 1))");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:PAGEINDEX)  AND  (:PAGESIZE + (:PAGEINDEX))");
            }
            #endregion

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            if (userID > 0 && restrictAccess == true)
            {
                db.AddInParameter(dbCmd, ":USERID", DbType.Int32, userID);
            }

            if (flocationID > 0)
            {
                db.AddInParameter(dbCmd, ":LOCATIONID", DbType.Int32, flocationID);
            }
            if (!string.IsNullOrEmpty(flocationName))
            {
                db.AddInParameter(dbCmd, ":LOCATIONNAME", DbType.String, "%" + flocationName.Trim().ToUpper() + "%");
            }

            if (pageSize > 0)
            {
                db.AddInParameter(dbCmd, ":PAGEINDEX", DbType.Int32, pageIndex);
                db.AddInParameter(dbCmd, ":PAGESIZE", DbType.Int32, pageSize);
            }

            return db.ExecuteReader(dbCmd);
        }

        public static DataTable GetSubFuncationLocationsForParent(Database db, int siteID, int parentLocation)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FLOCATIONID,FLOCATIONNAME,FPARENTLOCATIONID ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_LOCATIONS ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FSTATUS='A' ");
            //sqlCmdBuilder.Append(" START WITH FPARENTLOCATIONID=:LOCATIONID ");
            //sqlCmdBuilder.Append(" CONNECT BY PRIOR FLOCATIONID=FPARENTLOCATIONID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            //db.AddInParameter(dbCmd, ":LOCATIONID", DbType.Int32, parentLocation);

            DataTable fLocationTable = db.ExecuteDataSet(dbCmd).Tables[0];
            DataTable childFLocationTable = fLocationTable.Clone();
            GetOnlyChildFLocationRecords(parentLocation, fLocationTable, ref childFLocationTable);

            return childFLocationTable;
        }

        private static void GetOnlyChildFLocationRecords(int fLocationID, DataTable fLocationTable, ref DataTable childLocationTable)
        {
            var childRows = fLocationTable.Select("FPARENTLOCATIONID=" + fLocationID);
            if (childRows != null)
            {
                foreach (var row in childRows)
                {
                    int locationID = 0;
                    int.TryParse(row["FLOCATIONID"].ToString(), out locationID);
                    childLocationTable.Rows.Add(row.ItemArray);
                    GetOnlyChildFLocationRecords(locationID, fLocationTable, ref childLocationTable);
                }
            }
        }

        public static DataTable GetLocationEquipments(Database db, int siteID, string locationIDListString)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FEQUIPMENTID ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_EQUIPMENT ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FSTATUS='A' AND FLOCATIONID IN (" + locationIDListString + ") ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            return db.ExecuteDataSet(dbCmd).Tables[0];
        }

        public static DataTable GetSubEquipments(Database db, int siteID, int patentEquipmentID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FEQUIPMENTID,FPARENTEQUIPMENTID ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_EQUIPMENT ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FSTATUS='A' AND FINFOTYPE='E' ");
            //sqlCmdBuilder.Append(" START WITH FPARENTEQUIPMENTID=:EQUIPMENTID ");
            //sqlCmdBuilder.Append(" CONNECT BY PRIOR FEQUIPMENTID=FPARENTEQUIPMENTID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            //db.AddInParameter(dbCmd, ":EQUIPMENTID", DbType.Int32, patentEquipmentID);

            DataTable equipmentTable = db.ExecuteDataSet(dbCmd).Tables[0];
            DataTable childEquipmentTable = equipmentTable.Clone();
            GetOnlyChildEquipentRecords(patentEquipmentID, equipmentTable, ref childEquipmentTable);

            return childEquipmentTable;
        }

        private static void GetOnlyChildEquipentRecords(int equipmentID, DataTable equipmentTable, ref DataTable childEquipmentTable)
        {
            var childRows = equipmentTable.Select("FPARENTEQUIPMENTID=" + equipmentID);
            if (childRows != null)
            {
                foreach (var row in childRows)
                {
                    int eqID = 0;
                    int.TryParse(row["FEQUIPMENTID"].ToString(), out eqID);
                    childEquipmentTable.Rows.Add(row.ItemArray);
                    GetOnlyChildEquipentRecords(eqID, equipmentTable, ref childEquipmentTable);
                }
            }
        }

        public static DataTable GetWorkGroupNotAssignedLocations(Database db, DbTransaction transaction, int siteID, string locationIDListString)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT L.FLOCATIONID ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_LOCATIONS L ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_AUTH_GROUP A ON A.FREFERENCEID=L.FLOCATIONID AND A.FTYPE='LOCATION' AND A.FSITEID=L.FSITEID AND A.FSTATUS='A' ");
            sqlCmdBuilder.Append(" WHERE L.FSITEID=:SITEID AND L.FSTATUS='A' AND A.FREFERENCEID IS NULL AND L.FLOCATIONID IN (" + locationIDListString + ") ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            return db.ExecuteDataSet(dbCmd, transaction).Tables[0];
        }

        public static DataTable GetWorkGroupNotAssignedEquipments(Database db, DbTransaction transaction, int siteID, string equipmentIDListString)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT E.FEQUIPMENTID ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_EQUIPMENT E ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_AUTH_GROUP A ON A.FREFERENCEID=E.FEQUIPMENTID AND A.FTYPE='EQUIPMENT' AND A.FSITEID=E.FSITEID AND A.FSTATUS='A' ");
            sqlCmdBuilder.Append(" WHERE E.FSITEID=:SITEID AND E.FSTATUS='A' AND A.FREFERENCEID IS NULL AND FEQUIPMENTID IN (" + equipmentIDListString + ") ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            return db.ExecuteDataSet(dbCmd, transaction).Tables[0];
        }

        public static bool CheckAuthorizationGroupExists(Database db, DbTransaction transaction, int siteID, string referenceType, int referenceID, int workGroupID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FREFERENCEID FROM LDB1_MAINT_AUTH_GROUP ");
            sqlCmdBuilder.Append(" WHERE FREFERENCEID=:REFERENCEID AND FTYPE=:TYPE AND FWORKGROUPID=:WORKGROUPID AND FSITEID=:SITEID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":REFERENCEID", DbType.Int32, referenceID);
            db.AddInParameter(dbCmd, ":TYPE", DbType.String, referenceType.Trim().ToUpper());
            db.AddInParameter(dbCmd, ":WORKGROUPID", DbType.Int32, workGroupID);
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            DataTable dtAuthGroup = db.ExecuteDataSet(dbCmd, transaction).Tables[0];
            if (dtAuthGroup.Rows.Count > 0)
                return true;
            else
                return false;
        }

        public static void UpdateAuthorizationGroupStatus(Database db, DbTransaction transaction, int siteID, string referenceType, int referenceID, int workGrpupID, int updatedDate, int updatedTime, int updatedBy)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_AUTH_GROUP SET FSTATUS='A',FUPDATEDBY=:UPDATEDBY,FUPDATEDDATE=:UPDATEDDATE,FUPDATEDTIME=:UPDATEDTIME ");
            sqlCmdBuilder.Append(" WHERE FREFERENCEID=:REFERENCEID AND FTYPE=:TYPE AND FWORKGROUPID=:WORKGROUPID AND FSITEID=:SITEID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":REFERENCEID", DbType.Int32, referenceID);
            db.AddInParameter(dbCmd, ":TYPE", DbType.String, referenceType.Trim().ToUpper());
            db.AddInParameter(dbCmd, ":WORKGROUPID", DbType.Int32, workGrpupID);
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDDATE", DbType.Int32, updatedDate);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);

            db.ExecuteNonQuery(dbCmd, transaction);
        }

        public static bool CheckFunctionalLocationCodeExist(Database db, DbTransaction transaction, int siteID, string locationCode, int locationID)
        {
            IDataReader dataReaderCheck = null;
            try
            {
                StringBuilder sqlCmdBuilder = new StringBuilder();
                sqlCmdBuilder.Append(" SELECT FLOCATIONID FROM LDB1_MAINT_LOCATIONS  ");
                sqlCmdBuilder.Append(" WHERE FLOCATIONCODE=:LOCATIONCODE AND FSITEID=:SITEID AND FSTATUS='A'");
                if (locationID > 0)
                    sqlCmdBuilder.Append(" AND FLOCATIONID<>:LOCATIONID ");
                
                DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
                dbCmd.CommandType = CommandType.Text;

                db.AddInParameter(dbCmd, ":LOCATIONCODE", DbType.AnsiString, locationCode.Trim().ToUpper());
                db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
                if (locationID > 0)
                    db.AddInParameter(dbCmd, ":LOCATIONID", DbType.Int32, locationID);

                bool isExists = false;
                using (dataReaderCheck = transaction == null? db.ExecuteReader(dbCmd): db.ExecuteReader(dbCmd, transaction))
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

        #region Equipments Info

        public static IDataReader GetAllEquipmentInfo(Database db, int siteID, int pageSize, int pageIndex, int equipmentID, string searchEquipmentNameOrCode, string searchFLoctionIDs, string searchCategoryIDs, bool considerStatus, string sortType, char infoType, int userID, bool restrictAccess)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();

            if (pageSize > 0)
            {
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");
            }

            sqlCmdBuilder.Append(" SELECT DISTINCT E.FEQUIPMENTID,E.FMODELREFERENCEID,E.FEQUIPMENTNAME,E.FDESCRIPTION,E.FEQUIPMENTCODE, ");
            sqlCmdBuilder.Append(" E.FLOCATIONID,DECODE(ML.FLOCATIONNAME,'','None',ML.FLOCATIONNAME) AS FLOCATIONNAME,E.FRESOURCEID,E.FSERIALNUMBER, ");
            sqlCmdBuilder.Append(" E.FIMAGENAME,P.FEQUIPMENTNAME AS FPARENTEQUIPMENT, PR.FRESOURCECODE, ");
            sqlCmdBuilder.Append(" E1.FIMAGENAME AS FMODELIMAGENAME,E1.FEQUIPMENTNAME AS FMODELNAME, ");
            sqlCmdBuilder.Append(" CASE WHEN E.FMODELREFERENCEID>0 THEN M1.FNAME ELSE M.FNAME END AS FMANUFACTURERNAME, ");
            sqlCmdBuilder.Append(" CASE WHEN E.FMODELREFERENCEID>0 THEN T1.FNAME ELSE T.FNAME END AS FCATEGORYNAME, ");
            sqlCmdBuilder.Append(" CASE WHEN E.FMODELREFERENCEID>0 THEN C1.FNAME ELSE C.FNAME END AS FCLASSNAME, ");
            sqlCmdBuilder.Append(" CASE WHEN E.FMODELREFERENCEID>0 THEN E1.FMANUFID ELSE E.FMANUFID END AS FMANUFID, ");
            sqlCmdBuilder.Append(" CASE WHEN E.FMODELREFERENCEID>0 THEN E1.FCATEGORYID ELSE E.FCATEGORYID END AS FCATEGORYID, ");
            sqlCmdBuilder.Append(" CASE WHEN E.FMODELREFERENCEID>0 THEN E1.FCLASSID ELSE E.FCLASSID END AS FCLASSID, ");
            sqlCmdBuilder.Append(" CASE WHEN E.FMODELREFERENCEID>0 THEN E1.FMODELNUMBER ELSE E.FMODELNUMBER END FMODELNUMBER, ");
            sqlCmdBuilder.Append(" E.FWARRANTYNUMBER,E.FWARRANTYSTARTDATE,E.FWARRANTYEXPIREDDATE,E.FPURCHASEDATE,E.FINSTALLDATE,E.FPARENTEQUIPMENTID, ");
            sqlCmdBuilder.Append(" E.FINFOTYPE,(U.FFIRSTNAME || ' ' || U.FLASTNAME) AS FUPDATEUSERNAME,E.FUPDATEDON,E.FUPDATEDTIME ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_EQUIPMENT E ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_MASTER M ON M.FMASTERID=E.FMANUFID AND M.FSITEID=E.FSITEID  AND M.FTYPE='MANUFACTURER' "); //--M-MANUFACTURER
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_MASTER T ON T.FMASTERID=E.FCATEGORYID AND T.FSITEID=E.FSITEID AND T.FTYPE='TYPE' ");//--T-EQUIPMENT TYPE
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_MASTER C ON C.FMASTERID=E.FCLASSID AND C.FSITEID=E.FSITEID AND C.FTYPE='CLASS' ");//--C-EQUIPMENT CLASS
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_LOCATIONS ML ON ML.FLOCATIONID=E.FLOCATIONID AND ML.FSITEID=E.FSITEID "); //--Functional Location Name
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_PRODUCTIONLINERESOURCE PR ON PR.FRESOURCEID=E.FRESOURCEID AND PR.FSITEID=E.FSITEID ");//--RESOURCENAME
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_USERINFO U ON U.FUSERID=E.FUPDATEDBY ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_EQUIPMENT E1 ON E1.FEQUIPMENTID=E.FMODELREFERENCEID AND E1.FSITEID=E.FSITEID AND E1.FINFOTYPE='M' ");//Referring Equipment Model
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_MASTER M1 ON M1.FMASTERID=E1.FMANUFID AND M1.FSITEID=E1.FSITEID  AND M1.FTYPE='MANUFACTURER' ");//--M-MANUFACTURER
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_MASTER T1 ON T1.FMASTERID=E1.FCATEGORYID AND T1.FSITEID=E1.FSITEID AND T1.FTYPE='TYPE' ");//--T-EQUIPMENT TYPE
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_MASTER C1 ON C1.FMASTERID=E1.FCLASSID AND C1.FSITEID=E1.FSITEID AND C1.FTYPE='CLASS' ");//--C-EQUIPMENT CLASS
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_EQUIPMENT P ON P.FEQUIPMENTID=E.FPARENTEQUIPMENTID AND P.FSITEID=E.FSITEID AND P.FINFOTYPE='E' ");// Parent Equuipment Name 

            if (userID > 0 && restrictAccess == true)
            {
                sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_AUTH_GROUP AE ON AE.FREFERENCEID=E.FEQUIPMENTID AND AE.FSITEID=E.FSITEID AND AE.FTYPE='EQUIPMENT' AND AE.FSTATUS='A' ");
                sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_AUTH_GROUP APE ON APE.FREFERENCEID=E.FPARENTEQUIPMENTID AND APE.FSITEID=E.FSITEID AND APE.FTYPE='EQUIPMENT' AND APE.FSTATUS='A' ");
                sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_AUTH_GROUP AFL ON AFL.FREFERENCEID=E.FLOCATIONID AND AFL.FSITEID=E.FSITEID AND AFL.FTYPE='LOCATION' AND AFL.FSTATUS='A' ");
                sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_AUTH_GROUP APFL ON APFL.FREFERENCEID=ML.FPARENTLOCATIONID AND APFL.FSITEID=E.FSITEID AND APFL.FTYPE='LOCATION' AND APFL.FSTATUS='A' ");
                sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_WORKGROUPUSER MW ON MW.FWORKGROUPID=(CASE WHEN AE.FWORKGROUPID IS NOT NULL THEN AE.FWORKGROUPID WHEN APE.FWORKGROUPID IS NOT NULL THEN APE.FWORKGROUPID ELSE AFL.FWORKGROUPID END) AND MW.FSITEID=E.FSITEID AND MW.FSTATUS='A' ");
            }

            sqlCmdBuilder.Append(" WHERE E.FSITEID=:SITEID ");

            if (userID > 0 && restrictAccess == true)
            {
                sqlCmdBuilder.Append(" AND ((AE.FREFERENCEID IS NULL AND APE.FREFERENCEID IS NULL AND AFL.FREFERENCEID IS NULL AND APFL.FREFERENCEID IS NULL) OR MW.FUSERID=:USERID) ");//FINTOTYPE=E-Equipment,M-Equipment_Model
            }

            if (!string.IsNullOrEmpty(searchEquipmentNameOrCode))
            {
                sqlCmdBuilder.Append(" AND ( UPPER(E.FEQUIPMENTNAME) LIKE :EQUIPMENTNAME OR  UPPER(E.FEQUIPMENTCODE) LIKE :EQUIPMENTNAME)  ");
            }

            if (!string.IsNullOrEmpty(searchFLoctionIDs))
            {
                sqlCmdBuilder.Append(" AND E.FLOCATIONID IN (" + searchFLoctionIDs.Trim() + ") ");
            }

            if (!string.IsNullOrEmpty(searchCategoryIDs))
            {
                sqlCmdBuilder.Append(" AND DECODE(NVL(E.FMODELREFERENCEID,0),0,E.FCATEGORYID,E1.FCATEGORYID) IN (" + searchCategoryIDs.Trim() + ") ");
            }

            if (equipmentID > 0)
            {
                sqlCmdBuilder.Append(" AND E.FEQUIPMENTID=:EQUIPMENTID ");
            }

            if (considerStatus)
            {
                sqlCmdBuilder.Append(" AND E.FSTATUS='A' ");
            }

            sqlCmdBuilder.Append(" AND E.FINFOTYPE=:INFOTYPE ");

            #region Sorting
            switch (sortType)
            {
                case "EquipmentName_asc":
                    sqlCmdBuilder.Append(" ORDER BY E.FEQUIPMENTNAME ASC ");
                    break;
                case "EquipmentName_desc":
                    sqlCmdBuilder.Append(" ORDER BY E.FEQUIPMENTNAME DESC ");
                    break;
                case "UpdateOn_asc":
                    sqlCmdBuilder.Append(" ORDER BY E.FUPDATEDON ASC,E.FUPDATEDTIME ASC ");
                    break;
                default:
                    sqlCmdBuilder.Append(" ORDER BY E.FUPDATEDON DESC,E.FUPDATEDTIME DESC ");
                    break;
            }
            #endregion

            #region Paging
            if (pageSize > 0)
            {
                if (pageIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:PAGEINDEX)  AND (:PAGESIZE + (:PAGEINDEX - 1))");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:PAGEINDEX)  AND  (:PAGESIZE + (:PAGEINDEX))");
            }
            #endregion

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":INFOTYPE", DbType.AnsiStringFixedLength, infoType);

            if (userID > 0 && restrictAccess == true)
            {
                db.AddInParameter(dbCmd, ":USERID", DbType.Int32, userID);
            }

            if (equipmentID > 0)
            {
                db.AddInParameter(dbCmd, ":EQUIPMENTID", DbType.Int32, equipmentID);
            }

            if (!string.IsNullOrEmpty(searchEquipmentNameOrCode))
            {
                db.AddInParameter(dbCmd, ":EQUIPMENTNAME", DbType.String, "%" + searchEquipmentNameOrCode.Trim().ToUpper() + "%");
            }

            if (pageSize > 0)
            {
                db.AddInParameter(dbCmd, ":PAGEINDEX", DbType.Int32, pageIndex);
                db.AddInParameter(dbCmd, ":PAGESIZE", DbType.Int32, pageSize);
            }

            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetResourceInfo(Database db, int siteID, int userID, int accessLevelID, string resourceCode)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT PR.FRESOURCEID,PR.FRESOURCECODE FROM LDB1_PLANTPRODUCTIONLINE P ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_PRODUCTIONLINERESOURCE PR ON P.FPLINEID=PR.FPLINEID AND P.FSITEID=PR.FSITEID AND PR.FSTATUS='A' ");

            if (accessLevelID == 5)
            {
                sqlCmdBuilder.Append(" INNER JOIN LDB1_USERPLINE UP ON UP.FPLINEID = P.FPLINEID AND UP.FUSERID=:USERID ");
            }

            sqlCmdBuilder.Append(" WHERE P.FSTATUS='A' AND P.FSITEID=:SITEID ");

            if (!string.IsNullOrEmpty(resourceCode))
                sqlCmdBuilder.Append(" AND UPPER(PR.FRESOURCECODE) = :RESOURCECODE ");

            sqlCmdBuilder.Append(" ORDER BY PR.FRESOURCECODE ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            if (accessLevelID == 5)
                db.AddInParameter(dbCmd, ":USERID", DbType.Int32, userID);
            if (!string.IsNullOrEmpty(resourceCode))
                db.AddInParameter(dbCmd, ":RESOURCECODE", DbType.String, resourceCode.ToUpper().Trim());

            return db.ExecuteReader(dbCmd);
        }

        public static int InsertEquipmentInfo(Database db, DbTransaction transaction, int siteID, string equipmentCode, string equipmentName, string equipmentDesc, int manufacturerID, int categoryID, int classID, string imageName,
            int functionalLocationID, int resourceID, int modalReferenceID, string modalNumber, string serialNumber, string warrantyNumber, int warrantyStartDate, int warrantyExpiryDate, int purchaseDate,
            int installedDate, int eqipmentParentID, char infoType, int createdBy, int createdDate, int createdTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" INSERT INTO LDB1_MAINT_EQUIPMENT(FEQUIPMENTID,FSITEID,FEQUIPMENTCODE,FEQUIPMENTNAME,FDESCRIPTION,FIMAGENAME,FLOCATIONID,FRESOURCEID,FMODELREFERENCEID,FMANUFID ");
            sqlCmdBuilder.Append(" ,FCATEGORYID,FCLASSID,FMODELNUMBER,FSERIALNUMBER,FWARRANTYNUMBER,FWARRANTYSTARTDATE,FWARRANTYEXPIREDDATE,FPURCHASEDATE,FINSTALLDATE,FPARENTEQUIPMENTID,FINFOTYPE,FSTATUS ");
            sqlCmdBuilder.Append(" ,FCREATEDBY,FCREATEDON,FCREATEDTIME,FUPDATEDBY,FUPDATEDON,FUPDATEDTIME) ");
            sqlCmdBuilder.Append(" VALUES(SEQUENCE_MAINT_EQUIPMENT_ID.NEXTVAL,:SITEID,:EQUIPMENTCODE,:EQUIPMENTNAME,:DESCRIPTION,:IMAGENAME,:LOCATIONID,:RESOURCEID,:MODELREFERENCEID,:MANUFID ");
            sqlCmdBuilder.Append(" ,:CATEGORYID,:CLASSID,:MODELNUMBER,:SERIALNUMBER,:WARRANTYNUMBER,:WARRANTYSTARTDATE,:WARRANTYEXPIREDDATE,:PURCHASEDATE,:INSTALLDATE,:PARENTEQUIPMENTID,:INFOTYPE,'A' ");
            sqlCmdBuilder.Append(" ,:CREATEDBY,:CREATEDON,:CREATEDTIME,:CREATEDBY,:CREATEDON,:CREATEDTIME) ");
            sqlCmdBuilder.Append(" RETURNING FEQUIPMENTID INTO :EQUIPMENTID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":EQUIPMENTCODE", DbType.AnsiString, equipmentCode.Trim().ToUpper());
            db.AddInParameter(dbCmd, ":EQUIPMENTNAME", DbType.String, equipmentName.Trim());
            db.AddInParameter(dbCmd, ":DESCRIPTION", DbType.String, equipmentDesc.Trim());
            db.AddInParameter(dbCmd, ":IMAGENAME", DbType.String, string.IsNullOrEmpty(imageName) ? null : imageName.Trim());
            db.AddInParameter(dbCmd, ":LOCATIONID", DbType.Int32, functionalLocationID);

            db.AddInParameter(dbCmd, ":RESOURCEID", DbType.Int32, resourceID);
            db.AddInParameter(dbCmd, ":MODELREFERENCEID", DbType.Int32, modalReferenceID);
            db.AddInParameter(dbCmd, ":MANUFID", DbType.Int32, manufacturerID);
            db.AddInParameter(dbCmd, ":CATEGORYID", DbType.Int32, categoryID);
            db.AddInParameter(dbCmd, ":CLASSID", DbType.Int32, classID);

            //Modal Details
            db.AddInParameter(dbCmd, ":MODELNUMBER", DbType.String, modalNumber.Trim().ToUpper());
            db.AddInParameter(dbCmd, ":SERIALNUMBER", DbType.String, serialNumber.Trim().ToUpper());

            //Warranty Details
            db.AddInParameter(dbCmd, ":WARRANTYNUMBER", DbType.String, warrantyNumber.Trim().ToUpper());
            db.AddInParameter(dbCmd, ":WARRANTYSTARTDATE", DbType.Int32, warrantyStartDate);
            db.AddInParameter(dbCmd, ":WARRANTYEXPIREDDATE", DbType.Int32, warrantyExpiryDate);
            db.AddInParameter(dbCmd, ":PURCHASEDATE", DbType.Int32, purchaseDate);
            db.AddInParameter(dbCmd, ":INSTALLDATE", DbType.Int32, installedDate);

            //Equipment parent location id
            db.AddInParameter(dbCmd, ":PARENTEQUIPMENTID", DbType.Int32, eqipmentParentID);
            db.AddInParameter(dbCmd, ":INFOTYPE", DbType.AnsiStringFixedLength, infoType);

            db.AddInParameter(dbCmd, ":CREATEDBY", DbType.Int32, createdBy);
            db.AddInParameter(dbCmd, ":CREATEDON", DbType.Int32, createdDate);
            db.AddInParameter(dbCmd, ":CREATEDTIME", DbType.Int32, createdTime);
            db.AddOutParameter(dbCmd, ":EQUIPMENTID", DbType.Int32, sizeof(Int32));

            db.ExecuteNonQuery(dbCmd, transaction);

            return Convert.ToInt32(db.GetParameterValue(dbCmd, ":EQUIPMENTID"));

        }

        public static bool UpdateEquipmentInfo(Database db, DbTransaction transaction, int siteID, int equipmentID, string equipmentCode, string equipmentName, string equipmentDesc, int manufacturerID, int categoryID, int classID, string imageName,
            int locationID, int resourceID, int modalReferenceID, string modalNumber, string serialNumber, string warrantyNumber, int warrantyStartDate, int warrantyExpiryDate, int purchaseDate,
            int installedDate, int equipmentParentID, int updatedBy, int updatedDate, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_EQUIPMENT SET FEQUIPMENTCODE=:EQUIPMENTCODE,FEQUIPMENTNAME=:EQUIPMENTNAME,FDESCRIPTION=:DESCRIPTION,FLOCATIONID=:LOCATIONID ");

            if (!string.IsNullOrEmpty(imageName))
            {
                sqlCmdBuilder.Append(",FIMAGENAME=:IMAGENAME ");
            }
            sqlCmdBuilder.Append(" ,FRESOURCEID=:RESOURCEID,FMODELREFERENCEID=:MODELREFERENCEID,FMANUFID=:MANUFID,FCATEGORYID=:CATEGORYID,FCLASSID=:CLASSID,FMODELNUMBER=:MODELNUMBER,FSERIALNUMBER=:SERIALNUMBER ");
            sqlCmdBuilder.Append(" ,FWARRANTYNUMBER=:WARRANTYNUMBER,FWARRANTYSTARTDATE=:WARRANTYSTARTDATE,FWARRANTYEXPIREDDATE=:WARRANTYEXPIREDDATE,FPURCHASEDATE=:PURCHASEDATE,FINSTALLDATE=:INSTALLDATE ");
            sqlCmdBuilder.Append(" ,FPARENTEQUIPMENTID=:PARENTEQUIPMENTID,FUPDATEDBY=:UPDATEDBY,FUPDATEDON=:UPDATEDON,FUPDATEDTIME=:UPDATEDTIME");
            sqlCmdBuilder.Append(" WHERE  FSITEID=:SITEID AND FEQUIPMENTID=:EQUIPMENTID AND FSTATUS='A' AND FINFOTYPE='E' ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":EQUIPMENTID", DbType.Int32, equipmentID);
            db.AddInParameter(dbCmd, ":EQUIPMENTCODE", DbType.AnsiString, equipmentCode.Trim().ToUpper());
            db.AddInParameter(dbCmd, ":EQUIPMENTNAME", DbType.String, equipmentName.Trim());
            db.AddInParameter(dbCmd, ":DESCRIPTION", DbType.String, equipmentDesc.Trim());

            if (!string.IsNullOrEmpty(imageName))
            {
                db.AddInParameter(dbCmd, ":IMAGENAME", DbType.String, imageName.Trim());
            }

            db.AddInParameter(dbCmd, ":LOCATIONID", DbType.Int32, locationID);
            db.AddInParameter(dbCmd, ":RESOURCEID", DbType.Int32, resourceID);
            db.AddInParameter(dbCmd, ":MODELREFERENCEID", DbType.Int32, modalReferenceID);
            db.AddInParameter(dbCmd, ":MANUFID", DbType.Int32, manufacturerID);
            db.AddInParameter(dbCmd, ":CATEGORYID", DbType.Int32, categoryID);
            db.AddInParameter(dbCmd, ":CLASSID", DbType.Int32, classID);

            //Modal Details
            db.AddInParameter(dbCmd, ":MODELNUMBER", DbType.String, modalNumber.Trim().ToUpper());
            db.AddInParameter(dbCmd, ":SERIALNUMBER", DbType.String, serialNumber.Trim().ToUpper());

            //Warranty Details
            db.AddInParameter(dbCmd, ":WARRANTYNUMBER", DbType.String, warrantyNumber.Trim().ToUpper());
            db.AddInParameter(dbCmd, ":WARRANTYSTARTDATE", DbType.Int32, warrantyStartDate);
            db.AddInParameter(dbCmd, ":WARRANTYEXPIREDDATE", DbType.Int32, warrantyExpiryDate);
            db.AddInParameter(dbCmd, ":PURCHASEDATE", DbType.Int32, purchaseDate);
            db.AddInParameter(dbCmd, ":INSTALLDATE", DbType.Int32, installedDate);

            //Equipment parent id
            db.AddInParameter(dbCmd, ":PARENTEQUIPMENTID", DbType.Int32, equipmentParentID);

            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedDate);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);

            if (transaction != null)
                db.ExecuteNonQuery(dbCmd, transaction);
            else
                db.ExecuteNonQuery(dbCmd);
            return true;
        }

        public static bool UpdateEquipmentInfoStatus(Database db, DbTransaction transaction, int siteID, int equipmentID, char status, char infoType, int updatedBy, int updatedDate, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_EQUIPMENT SET FSTATUS=:STATUS,FUPDATEDBY=:UPDATEDBY,FUPDATEDON=:UPDATEDON,FUPDATEDTIME=:UPDATEDTIME ");
            if (status == 'I')
            {
                sqlCmdBuilder.Append(" ,FIMAGENAME=NULL ");
            }
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FEQUIPMENTID=:EQUIPMENTID AND FINFOTYPE=:INFOTYPE  ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":EQUIPMENTID", DbType.Int32, equipmentID);
            db.AddInParameter(dbCmd, ":STATUS", DbType.AnsiStringFixedLength, status);
            db.AddInParameter(dbCmd, ":INFOTYPE", DbType.AnsiStringFixedLength, infoType);

            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedDate);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);

            if (transaction != null)
                db.ExecuteNonQuery(dbCmd, transaction);
            else
                db.ExecuteNonQuery(dbCmd);

            return true;
        }

        public static bool UpdateDocumentsInfoStatus(Database db, DbTransaction transaction, int siteID, int referenceID, string referenceType, char status, int updatedBy, int updatedDate, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_DOCUMENTS SET FSTATUS=:STATUS,FUPDATEDBY=:UPDATEDBY,FUPDATEDON=:UPDATEDON,FUPDATEDTIME=:UPDATEDTIME ");
            sqlCmdBuilder.Append(" WHERE FREFERENCEID=:REFERENCEID AND FSITEID=:SITEID AND FSTATUS='A' AND FREF_TYPE=:REFTYPE ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":REFERENCEID", DbType.Int32, referenceID);
            db.AddInParameter(dbCmd, ":REFTYPE", DbType.AnsiString, referenceType);
            db.AddInParameter(dbCmd, ":STATUS", DbType.AnsiStringFixedLength, status);

            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedDate);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);

            if (transaction != null)
                db.ExecuteNonQuery(dbCmd, transaction);
            else
                db.ExecuteNonQuery(dbCmd);

            return true;
        }

        public static IDataReader CheckEquipmentInfoExist(Database db, DbTransaction transaction, int siteID, int equipmentID, string equipmentCode, string equipmentName, bool checkIsParentEquipment, bool considerStatus)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FEQUIPMENTID,FEQUIPMENTNAME,FEQUIPMENTCODE,FLOCATIONID,FMODELREFERENCEID,FSTATUS ");

            if (checkIsParentEquipment && equipmentID > 0)// when deleting check equipment having parents  
            {
                sqlCmdBuilder.Append(",( SELECT COUNT(FEQUIPMENTID) FROM LDB1_MAINT_EQUIPMENT");
                sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FPARENTEQUIPMENTID=:EQUIPMENTID AND FSTATUS='A' AND FINFOTYPE='E') AS FCOUNT ");
            }

            sqlCmdBuilder.Append(" FROM LDB1_MAINT_EQUIPMENT ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FINFOTYPE='E' ");

            if (!string.IsNullOrEmpty(equipmentCode) || !string.IsNullOrEmpty(equipmentName))  //when insert or update check location name is exist 
            {
                if (!string.IsNullOrEmpty(equipmentCode) && !string.IsNullOrEmpty(equipmentName))
                    sqlCmdBuilder.Append(" AND ( UPPER(FEQUIPMENTNAME)=:EQUIPMENTNAME OR UPPER(FEQUIPMENTCODE)=:EQUIPMENTCODE ) ");
                else if (!string.IsNullOrEmpty(equipmentName))
                    sqlCmdBuilder.Append(" AND UPPER(FEQUIPMENTNAME)=:EQUIPMENTNAME ");
                sqlCmdBuilder.Append(" AND FEQUIPMENTID<>:EQUIPMENTID ");
            }
            else
            {
                sqlCmdBuilder.Append(" AND FEQUIPMENTID=:EQUIPMENTID ");
            }

            if (considerStatus)
                sqlCmdBuilder.Append(" AND FSTATUS = 'A' ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":EQUIPMENTID", DbType.Int32, equipmentID);

            if (!string.IsNullOrEmpty(equipmentCode))
                db.AddInParameter(dbCmd, ":EQUIPMENTCODE", DbType.AnsiString, equipmentCode.Trim().ToUpper());
            if (!string.IsNullOrEmpty(equipmentName))
                db.AddInParameter(dbCmd, ":EQUIPMENTNAME", DbType.String, equipmentName.Trim().ToUpper());

            if (transaction != null)
                return db.ExecuteReader(dbCmd, transaction);
            else
                return db.ExecuteReader(dbCmd);
        }

        public static bool UpdateMeasuringPointStatus(Database db, DbTransaction transaction, int siteID, int parentID, char parentType, int measuringPointID, char status, int updatedBy, int updatedDate, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_MEASURINGPOINT SET FSTATUS=:STATUS,FUPDATEDBY=:UPDATEDBY,FUPDATEDON=:UPDATEDON,FUPDATEDTIME=:UPDATEDTIME ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID ");

            if (parentID > 0)
            {
                sqlCmdBuilder.Append(" AND FPARENTID=:PARENTID AND FPARENTTYPE=:PARENTTYPE ");
            }

            if (measuringPointID > 0)
            {
                sqlCmdBuilder.Append(" AND FMEASURINGPOINTID=:MEASURINGPOINTID ");
            }

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            if (parentID > 0)
            {
                db.AddInParameter(dbCmd, ":PARENTID", DbType.Int32, parentID);
                db.AddInParameter(dbCmd, ":PARENTTYPE", DbType.AnsiStringFixedLength, parentType);
            }

            if (measuringPointID > 0)
            {
                db.AddInParameter(dbCmd, ":MEASURINGPOINTID", DbType.Int32, measuringPointID);
            }

            db.AddInParameter(dbCmd, ":STATUS", DbType.AnsiStringFixedLength, status);

            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedDate);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);

            if (transaction != null)
                db.ExecuteNonQuery(dbCmd, transaction);
            else
                db.ExecuteNonQuery(dbCmd);

            return true;
        }

        public static IDataReader GetAllMeasuringPointsForEquipmentID(Database db, DbTransaction transaction, int siteID, int equipmentID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FMEASURINGPOINTCODE,FMEASURINGPOINTNAME,FDESCRIPTION,FPOSITION,FCATEGORYID,FSENSORTYPEUOMID,FIMAGENAME, ");
            sqlCmdBuilder.Append(" FREADINGTYPE,FDECIMALPLACES,FLOWERLIMIT,FUPPERLIMIT,FLOWERLIMITWARNING,FUPPERLIMITWARNING,FMAXTEXTLENGTH,FGROUPID,FISCOUNTER,FOPCTAGID,FUUID ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_MEASURINGPOINT ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FPARENTID=:PARENTID AND FPARENTTYPE='M' AND FSTATUS='A' ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":PARENTID", DbType.Int32, equipmentID);

            return db.ExecuteReader(dbCmd, transaction);
        }

        public static IDataReader GetEquipmentInfo(Database db, int siteID, int pageSize, int pageIndex, string equipmentName, int fLocationID, int equipmentID, char infoType, string sortType, int userID, bool restrictAccess)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();

            if (pageSize > 0)
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");

            sqlCmdBuilder.Append(" SELECT DISTINCT E.FLOCATIONID,E.FEQUIPMENTID,E.FEQUIPMENTCODE,E.FEQUIPMENTNAME,E.FUPDATEDON,E.FUPDATEDTIME ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_EQUIPMENT E ");

            if (userID > 0 && infoType == 'E' && restrictAccess) //only for equipment - work group
            {
                sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_AUTH_GROUP MA ON MA.FREFERENCEID=E.FEQUIPMENTID AND MA.FSITEID=E.FSITEID AND MA.FTYPE='EQUIPMENT' AND MA.FSTATUS='A' ");
                sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_WORKGROUPUSER MW ON MW.FWORKGROUPID=MA.FWORKGROUPID AND MW.FSITEID=MA.FSITEID AND MW.FSTATUS='A' ");
            }
            sqlCmdBuilder.Append(" WHERE E.FSITEID=:SITEID ");

            if (!string.IsNullOrEmpty(equipmentName))
            {
                sqlCmdBuilder.Append(" AND UPPER(E.FEQUIPMENTNAME) LIKE :EQUIPMENTNAME ");
            }

            if (fLocationID >= 0)
            {
                sqlCmdBuilder.Append(" AND E.FLOCATIONID=:LOCATIONID ");
            }

            if (equipmentID > 0)
            {
                sqlCmdBuilder.Append(" AND E.FEQUIPMENTID=:EQUIPMENTID ");
            }

            if (userID > 0 && infoType == 'E' && restrictAccess) //only for equipment - work group
            {
                sqlCmdBuilder.Append(" AND (MA.FREFERENCEID IS NULL OR MW.FUSERID=:USERID) ");
            }

            sqlCmdBuilder.Append("  AND E.FSTATUS='A' AND E.FINFOTYPE=:INFOTYPE ");

            #region Sorting
            switch (sortType)
            {
                case "EquipmentName_asc":
                    sqlCmdBuilder.Append(" ORDER BY E.FEQUIPMENTNAME ASC ");
                    break;
                case "EquipmentName_desc":
                    sqlCmdBuilder.Append(" ORDER BY E.FEQUIPMENTNAME DESC ");
                    break;
                default:
                    sqlCmdBuilder.Append(" ORDER BY E.FUPDATEDON DESC, E.FUPDATEDTIME DESC");
                    break;
            }
            #endregion

            #region Paging
            if (pageSize > 0)
            {
                if (pageIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:PAGEINDEX)  AND (:PAGESIZE + (:PAGEINDEX - 1))");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:PAGEINDEX)  AND  (:PAGESIZE + (:PAGEINDEX))");
            }
            #endregion

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":INFOTYPE", DbType.AnsiStringFixedLength, infoType);

            if (userID > 0 && infoType == 'E' && restrictAccess) //only for equipment - work group
                db.AddInParameter(dbCmd, ":USERID", DbType.Int32, userID);

            if (!string.IsNullOrEmpty(equipmentName))
            {
                db.AddInParameter(dbCmd, ":EQUIPMENTNAME", DbType.String, "%" + equipmentName.Trim().ToUpper() + "%");
            }

            if (equipmentID > 0)
            {
                db.AddInParameter(dbCmd, ":EQUIPMENTID", DbType.Int32, equipmentID);
            }

            if (fLocationID >= 0)
            {
                db.AddInParameter(dbCmd, ":LOCATIONID", DbType.Int32, fLocationID);
            }

            if (pageSize > 0)
            {
                db.AddInParameter(dbCmd, ":PAGEINDEX", DbType.Int32, pageIndex);
                db.AddInParameter(dbCmd, ":PAGESIZE", DbType.Int32, pageSize);
            }

            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetTopParentEquipmentInfo(Database db, DbTransaction transaction, int siteID, int equipmentID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FEQUIPMENTID,FLOCATIONID FROM LDB1_MAINT_EQUIPMENT ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FINFOTYPE='E' AND FSTATUS='A' AND FEQUIPMENTID IN (" + GetTopParentEquipmentID(db, siteID, equipmentID) + ") ");
            //sqlCmdBuilder.Append(" SELECT CONNECT_BY_ROOT FEQUIPMENTID AS FTOPPARENTLOCTIONID FROM LDB1_MAINT_EQUIPMENT ");
            //sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FINFOTYPE='E' AND FSTATUS='A' AND FEQUIPMENTID = :EQUIPMENTID AND ROWNUM = 1 ");
            //sqlCmdBuilder.Append(" CONNECT BY PRIOR FEQUIPMENTID = FPARENTEQUIPMENTID ) ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            //db.AddInParameter(dbCmd, ":EQUIPMENTID", DbType.Int32, equipmentID);

            return db.ExecuteReader(dbCmd);
        }

        private static string GetTopParentEquipmentID(Database db, int siteID, int equipmentID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FEQUIPMENTID,FPARENTEQUIPMENTID FROM LDB1_MAINT_EQUIPMENT ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FINFOTYPE='E' AND FSTATUS='A' ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            DataTable equipmentTable = db.ExecuteDataSet(dbCmd).Tables[0];
            GetTopParentEquimentRecords(equipmentID, ref equipmentTable);

            string topEquipmentID = equipmentID.ToString();
            if (equipmentTable.Rows.Count > 0)
            {
                topEquipmentID = equipmentTable.Rows[0]["FEQUIPMENTID"].ToString();
            }

            return topEquipmentID;
        }

        private static void GetTopParentEquimentRecords(int equipmentID, ref DataTable equipmentTable)
        {
            var equipRows = equipmentTable.Select("FEQUIPMENTID=" + equipmentID);
            if (equipRows != null && equipRows.Length > 0)
            {
                int parentEquipmentID = 0;
                int.TryParse(equipRows[0]["FPARENTEQUIPMENTID"].ToString(), out parentEquipmentID);
                if (parentEquipmentID > 0)
                {
                    GetTopParentEquimentRecords(parentEquipmentID, ref equipmentTable);
                }
                else
                {
                    DataRow dr = equipmentTable.NewRow();
                    dr["FEQUIPMENTID"] = equipRows[0]["FEQUIPMENTID"];
                    dr["FPARENTEQUIPMENTID"] = equipRows[0]["FPARENTEQUIPMENTID"];
                    equipmentTable.Rows.Clear();
                    equipmentTable.Rows.Add(dr);
                }
            }
            else
            {
                equipmentTable.Rows.Clear();
            }
        }

        public static IDataReader GetAllEquipmentLocationInfo(Database db, int siteID, int pageSize, int pageIndex, string searchEquipmentNameOrCode, string searchCategoryIDs, int equipmentID, string sortType, char infoType, int userID, bool restrictAccess)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();

            if (pageSize > 0)
            {
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");
            }

            sqlCmdBuilder.Append(" SELECT DISTINCT E.FEQUIPMENTID,E.FEQUIPMENTNAME,E.FLOCATIONID,ML.FLOCATIONNAME,E.FUPDATEDON,E.FUPDATEDTIME ");
            sqlCmdBuilder.Append(" ,CASE WHEN E.FMODELREFERENCEID > 0 THEN T1.FNAME ELSE T.FNAME END AS FCATEGORYNAME ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_EQUIPMENT E ");

            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_EQUIPMENT E1 ON E1.FEQUIPMENTID = E.FMODELREFERENCEID AND E1.FINFOTYPE = 'M'");

            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_LOCATIONS ML ON ML.FLOCATIONID=E.FLOCATIONID AND ML.FSITEID=E.FSITEID "); //--Functional Location Name
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_MASTER T ON T.FMASTERID=E.FCATEGORYID AND T.FSITEID=E.FSITEID AND T.FTYPE='TYPE' ");//--T-EQUIPMENT TYPE

            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_MASTER T1 ON T1.FMASTERID = E1.FCATEGORYID AND T1.FSITEID = E1.FSITEID AND T1.FTYPE = 'TYPE' ");

            if (userID > 0 && restrictAccess)
            {
                sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_AUTH_GROUP MA ON MA.FREFERENCEID=E.FEQUIPMENTID AND MA.FSITEID=E.FSITEID AND MA.FTYPE='EQUIPMENT' AND MA.FSTATUS='A' ");
                sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_WORKGROUPUSER MW ON MW.FWORKGROUPID=MA.FWORKGROUPID AND MW.FSITEID=MA.FSITEID AND MW.FSTATUS='A' ");
            }

            sqlCmdBuilder.Append(" WHERE E.FSITEID=:SITEID  AND E.FSTATUS='A' AND E.FINFOTYPE=:INFOTYPE ");//FINTOTYPE=E-Equipment,M-Equipment_Model

            if (userID > 0 && restrictAccess)
            {
                sqlCmdBuilder.Append(" AND (MA.FREFERENCEID IS NULL OR MW.FUSERID=:USERID) ");
            }


            if (!string.IsNullOrEmpty(searchEquipmentNameOrCode))
            {
                sqlCmdBuilder.Append(" AND ( UPPER(E.FEQUIPMENTNAME) LIKE :EQUIPMENTNAME OR  UPPER(E.FEQUIPMENTCODE) LIKE :EQUIPMENTNAME OR UPPER(ML.FLOCATIONNAME) LIKE :EQUIPMENTNAME)  ");
            }

            if (!string.IsNullOrEmpty(searchCategoryIDs))
            {
                sqlCmdBuilder.Append(" AND CASE WHEN E.FMODELREFERENCEID > 0 THEN E1.FCATEGORYID ELSE E.FCATEGORYID END IN (" + searchCategoryIDs.Trim() + ") ");
                //sqlCmdBuilder.Append(" AND E.FCATEGORYID IN (" + searchCategoryIDs.Trim() + ") ");
            }

            #region Sorting
            switch (sortType)
            {
                case "EquipmentName_asc":
                    sqlCmdBuilder.Append(" ORDER BY ");
                    if (equipmentID > 0)
                        sqlCmdBuilder.Append(" CASE WHEN E.FEQUIPMENTID=:EQUIPMENTID THEN 0 ELSE 1 END, ");
                    sqlCmdBuilder.Append(" E.FEQUIPMENTNAME ASC ");
                    break;
                case "EquipmentName_desc":
                    sqlCmdBuilder.Append(" ORDER BY ");
                    if (equipmentID > 0)
                        sqlCmdBuilder.Append(" CASE WHEN E.FEQUIPMENTID=:EQUIPMENTID THEN 0 ELSE 1 END, ");
                    sqlCmdBuilder.Append(" E.FEQUIPMENTNAME DESC ");
                    break;
                case "LocationName_asc":
                    sqlCmdBuilder.Append(" ORDER BY ");
                    if (equipmentID > 0)
                        sqlCmdBuilder.Append(" CASE WHEN E.FEQUIPMENTID=:EQUIPMENTID THEN 0 ELSE 1 END, ");
                    sqlCmdBuilder.Append(" ML.FLOCATIONNAME ASC ");
                    break;
                case "LocationName_desc":
                    sqlCmdBuilder.Append(" ORDER BY ");
                    if (equipmentID > 0)
                        sqlCmdBuilder.Append(" CASE WHEN E.FEQUIPMENTID=:EQUIPMENTID THEN 0 ELSE 1 END, ");
                    sqlCmdBuilder.Append(" ML.FLOCATIONNAME DESC ");
                    break;
                case "EquipmentType_asc":
                    sqlCmdBuilder.Append(" ORDER BY ");
                    if (equipmentID > 0)
                        sqlCmdBuilder.Append(" CASE WHEN E.FEQUIPMENTID=:EQUIPMENTID THEN 0 ELSE 1 END, ");
                    sqlCmdBuilder.Append(" FCATEGORYNAME ASC ");
                    break;
                case "EquipmentType_desc":
                    sqlCmdBuilder.Append(" ORDER BY ");
                    if (equipmentID > 0)
                        sqlCmdBuilder.Append(" CASE WHEN E.FEQUIPMENTID=:EQUIPMENTID THEN 0 ELSE 1 END, ");
                    sqlCmdBuilder.Append(" FCATEGORYNAME DESC ");
                    break;
                default:
                    sqlCmdBuilder.Append(" ORDER BY ");
                    if (equipmentID > 0)
                        sqlCmdBuilder.Append(" CASE WHEN E.FEQUIPMENTID=:EQUIPMENTID THEN 0 ELSE 1 END, ");
                    sqlCmdBuilder.Append(" E.FUPDATEDON DESC,E.FUPDATEDTIME DESC  ");
                    break;
            }
            #endregion

            #region Paging
            if (pageSize > 0)
            {
                if (pageIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:PAGEINDEX)  AND (:PAGESIZE + (:PAGEINDEX - 1))");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:PAGEINDEX)  AND  (:PAGESIZE + (:PAGEINDEX))");
            }
            #endregion

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":INFOTYPE", DbType.AnsiStringFixedLength, infoType);

            if (equipmentID > 0)
            {
                db.AddInParameter(dbCmd, ":EQUIPMENTID", DbType.Int32, equipmentID);
            }
            if (userID > 0 && restrictAccess)
            {
                db.AddInParameter(dbCmd, ":USERID", DbType.Int32, userID);
            }
            if (!string.IsNullOrEmpty(searchEquipmentNameOrCode))
            {
                db.AddInParameter(dbCmd, ":EQUIPMENTNAME", DbType.String, "%" + searchEquipmentNameOrCode.Trim().ToUpper() + "%");
            }

            if (pageSize > 0)
            {
                db.AddInParameter(dbCmd, ":PAGEINDEX", DbType.Int32, pageIndex);
                db.AddInParameter(dbCmd, ":PAGESIZE", DbType.Int32, pageSize);
            }

            return db.ExecuteReader(dbCmd);
        }

        public static DataTable GetHierarchicalEquipmentList(Database db, DbTransaction transaction, int siteID, int equipmentID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FEQUIPMENTID, FLOCATIONID, FPARENTEQUIPMENTID FROM LDB1_MAINT_EQUIPMENT ");
            sqlCmdBuilder.Append(" WHERE FSITEID =:SITEID AND FINFOTYPE = 'E' AND FSTATUS = 'A' ");
            //sqlCmdBuilder.Append(" START WITH FEQUIPMENTID = :EQUIPMENTID ");
            //sqlCmdBuilder.Append(" CONNECT BY FPARENTEQUIPMENTID = PRIOR FEQUIPMENTID ");
            //sqlCmdBuilder.Append(" ORDER SIBLINGS BY FEQUIPMENTID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            //db.AddInParameter(dbCmd, ":EQUIPMENTID", DbType.Int32, equipmentID);

            DataTable equipmentTable = db.ExecuteDataSet(dbCmd, transaction).Tables[0];
            var equipRows = equipmentTable.Select("FEQUIPMENTID=" + equipmentID);
            DataTable equipmentHierarchyTable = equipmentTable.Clone();
            if (equipRows != null && equipRows.Length > 0)
            {
                equipmentHierarchyTable.Rows.Add(equipRows[0].ItemArray);
                GetOnlyChildEquipentRecords(equipmentID, equipmentTable, ref equipmentHierarchyTable);
            }

            return equipmentHierarchyTable;
        }

        public static IDataReader GetParentEquipmentListDropDown(Database db, DbTransaction transaction, int siteID, int equipmentID, int userID, bool restrictAccess)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();

            sqlCmdBuilder.Append(" SELECT DISTINCT E.FEQUIPMENTID,E.FEQUIPMENTNAME,E.FLOCATIONID FROM LDB1_MAINT_EQUIPMENT E ");

            if (userID > 0 && restrictAccess)
            {
                sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_AUTH_GROUP AE ON AE.FREFERENCEID=E.FEQUIPMENTID AND AE.FSITEID=E.FSITEID AND AE.FTYPE='EQUIPMENT' AND AE.FSTATUS='A' ");
                sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_AUTH_GROUP APE ON APE.FREFERENCEID=E.FPARENTEQUIPMENTID AND APE.FSITEID=E.FSITEID AND APE.FTYPE='EQUIPMENT' AND APE.FSTATUS='A' ");
                sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_AUTH_GROUP AFL ON AFL.FREFERENCEID=E.FLOCATIONID AND AFL.FSITEID=E.FSITEID AND AFL.FTYPE='LOCATION' AND AFL.FSTATUS='A' ");
                sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_WORKGROUPUSER MW ON MW.FWORKGROUPID=(CASE WHEN AE.FWORKGROUPID IS NOT NULL THEN AE.FWORKGROUPID WHEN APE.FWORKGROUPID IS NOT NULL THEN APE.FWORKGROUPID ELSE AFL.FWORKGROUPID END) AND MW.FSITEID=E.FSITEID AND MW.FSTATUS='A' ");
            }

            sqlCmdBuilder.Append(" WHERE E.FSITEID=:SITEID AND E.FINFOTYPE = 'E' AND E.FSTATUS='A' AND E.FEQUIPMENTID<>:EQUIPMENTID ");

            if (userID > 0 && restrictAccess)
            {
                sqlCmdBuilder.Append(" AND((AE.FREFERENCEID IS NULL AND APE.FREFERENCEID IS NULL AND AFL.FREFERENCEID IS NULL) OR MW.FUSERID =:USERID) ");
            }

            if (equipmentID > 0)
            {
                //sqlCmdBuilder.Append(" AND E.FEQUIPMENTID NOT IN (SELECT FEQUIPMENTID FROM LDB1_MAINT_EQUIPMENT WHERE FSITEID=:SITEID AND FINFOTYPE = 'E' AND FSTATUS = 'A' ");
                //sqlCmdBuilder.Append(" CONNECT BY PRIOR FEQUIPMENTID = FPARENTEQUIPMENTID START WITH FPARENTEQUIPMENTID=:EQUIPMENTID) ");
                sqlCmdBuilder.Append(" AND E.FEQUIPMENTID NOT IN (" + GetChildEquipmentList(db, siteID, equipmentID) + ") ");
            }

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            if (userID > 0 && restrictAccess)
            {
                db.AddInParameter(dbCmd, ":USERID", DbType.Int32, userID);
            }

            db.AddInParameter(dbCmd, ":EQUIPMENTID", DbType.Int32, equipmentID);

            if (transaction != null)
                return db.ExecuteReader(dbCmd, transaction);
            else
                return db.ExecuteReader(dbCmd);
        }

        private static string GetChildEquipmentList(Database db, int siteID, int parentEquipmentID)
        {
            DataTable childEquipmentTable = GetSubEquipments(db, siteID, parentEquipmentID);
            List<string> equipmentIDs = new List<string>();
            if (childEquipmentTable.Rows.Count > 0)
            {
                foreach (DataRow childRow in childEquipmentTable.Rows)
                {
                    equipmentIDs.Add(childRow["FEQUIPMENTID"].ToString());
                }
            }
            else
            {
                equipmentIDs.Add("0");
            }
            return string.Join(",", equipmentIDs);
        }

        public static bool UpdateEquipmentFunctionalLocation(Database db, DbTransaction transaction, int siteID, int equipmentID, int functionalLocationID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_EQUIPMENT SET FLOCATIONID=:LOCATIONID ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FEQUIPMENTID=:EQUIPMENTID AND FINFOTYPE='E' AND FSTATUS='A' ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":EQUIPMENTID", DbType.Int32, equipmentID);
            db.AddInParameter(dbCmd, ":LOCATIONID", DbType.Int32, functionalLocationID);

            db.ExecuteNonQuery(dbCmd, transaction);

            return true;
        }

        public static bool CheckEquipmentCodeExist(Database db, DbTransaction transaction, int siteID, string equipmentCode, int equipmentID)
        {
            IDataReader dataReaderCheck = null;
            try
            {
                StringBuilder sqlCmdBuilder = new StringBuilder();
                sqlCmdBuilder.Append(" SELECT FEQUIPMENTID FROM LDB1_MAINT_EQUIPMENT  ");
                sqlCmdBuilder.Append(" WHERE FEQUIPMENTCODE=:EQUIPMENTCODE AND FSITEID=:SITEID AND FSTATUS='A' ");
                if (equipmentID > 0)
                    sqlCmdBuilder.Append(" AND FEQUIPMENTID<>:EQUIPMENTID ");

                DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
                dbCmd.CommandType = CommandType.Text;

                db.AddInParameter(dbCmd, ":EQUIPMENTCODE", DbType.AnsiString, equipmentCode.Trim().ToUpper());
                db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
                if (equipmentID > 0)
                    db.AddInParameter(dbCmd, ":EQUIPMENTID", DbType.Int32, equipmentID);

                bool isExists = false;
                using (dataReaderCheck = transaction == null ? db.ExecuteReader(dbCmd) : db.ExecuteReader(dbCmd, transaction))
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
        
        #region Support Details
        public static IDataReader GetSupportInfo(Database db, DbTransaction transaction, int siteID, int equipmentID, int supportID, string supportName, char supportType)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT S.FSUPPORTID,S.FSUPPORTNAME,S.FSUPPORTNUMBER,S.FSUPPORTEMAILID,S.FSUPPORTTYPE,E.FEQUIPMENTNAME,E.FEQUIPMENTCODE ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_SUPPORT S ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_EQUIPMENT E ON  E.FSITEID=S.FSITEID AND E.FEQUIPMENTID=S.FEQUIPMENTID ");
            sqlCmdBuilder.Append(" WHERE S.FSITEID=:SITEID ");

            if (equipmentID > 0)
                sqlCmdBuilder.Append(" AND S.FEQUIPMENTID=:EQUIPMENTID ");
            if (supportID > 0)
                sqlCmdBuilder.Append(" AND S.FSUPPORTID=:SUPPORTID ");
            if (!string.IsNullOrEmpty(supportName) && supportType != 'N')
            {
                sqlCmdBuilder.Append(" AND UPPER(FSUPPORTNAME) =:SUPPORTNAME AND FSUPPORTTYPE =:TYPE");
            }

            sqlCmdBuilder.Append(" AND S.FSTATUS = 'A' ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            if (equipmentID > 0)
                db.AddInParameter(dbCmd, ":EQUIPMENTID", DbType.Int32, equipmentID);
            if (supportID > 0)
                db.AddInParameter(dbCmd, ":SUPPORTID", DbType.Int32, supportID);
            if (!string.IsNullOrEmpty(supportName) && supportType != 'N')
            {
                db.AddInParameter(dbCmd, ":SUPPORTNAME", DbType.String, supportName.Trim().ToUpper());
                db.AddInParameter(dbCmd, ":TYPE", DbType.AnsiStringFixedLength, supportType);
            }

            if (transaction != null)
                return db.ExecuteReader(dbCmd, transaction);
            else
                return db.ExecuteReader(dbCmd);
        }

        public static void InsertSupportData(Database db, DbTransaction transaction, int equipmentID, int siteID, string supportName, string supportNumber, string supportEmailID, char supportType, int createdBy, int createdOn, int createdTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" INSERT INTO LDB1_MAINT_SUPPORT (FSUPPORTID,FEQUIPMENTID,FSITEID,FSUPPORTNAME,FSUPPORTNUMBER,FSUPPORTEMAILID,FSUPPORTTYPE,FCREATEDBY,FCREATEDON,FCREATEDTIME,FUPDATEDBY,FUPDATEDON,FUPDATEDTIME) ");
            sqlCmdBuilder.Append(" VALUES(SEQUENCE_MAINTSUPPORT_ID.NEXTVAL,:EQUIPMENTID,:SITEID,:SUPPORTNAME,:SUPPORTNUMBER,:SUPPORTEMAILID,:TYPE,:CREATEDBY,:CREATEDON,:CREATEDTIME,:CREATEDBY,:CREATEDON,:CREATEDTIME) ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":EQUIPMENTID", DbType.Int32, equipmentID);
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":SUPPORTNAME", DbType.String, supportName);
            db.AddInParameter(dbCmd, ":SUPPORTNUMBER", DbType.AnsiString, supportNumber);
            db.AddInParameter(dbCmd, ":SUPPORTEMAILID", DbType.String, supportEmailID);
            db.AddInParameter(dbCmd, ":TYPE", DbType.AnsiStringFixedLength, supportType);
            db.AddInParameter(dbCmd, ":CREATEDBY", DbType.Int32, createdBy);
            db.AddInParameter(dbCmd, ":CREATEDON", DbType.Int32, createdOn);
            db.AddInParameter(dbCmd, ":CREATEDTIME", DbType.Int32, createdTime);

            if (transaction == null)
                db.ExecuteNonQuery(dbCmd);
            else
                db.ExecuteNonQuery(dbCmd, transaction);
        }

        public static bool UpdateSupportStatus(Database db, DbTransaction transaction, int siteID, int equipmentID, int supportID, char status, int updatedBy, int updatedDate, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_SUPPORT SET FSTATUS=:STATUS,FUPDATEDBY=:UPDATEDBY,FUPDATEDON=:UPDATEDON,FUPDATEDTIME=:UPDATEDTIME ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID ");

            if (equipmentID > 0)
                sqlCmdBuilder.Append(" AND FEQUIPMENTID=:EQUIPMENTID ");
            if (supportID > 0)
                sqlCmdBuilder.Append(" AND FSUPPORTID=:SUPPORTID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            if (equipmentID > 0)
                db.AddInParameter(dbCmd, ":EQUIPMENTID", DbType.Int32, equipmentID);
            if (supportID > 0)
                db.AddInParameter(dbCmd, ":SUPPORTID", DbType.Int32, supportID);

            db.AddInParameter(dbCmd, ":STATUS", DbType.AnsiStringFixedLength, status);
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedDate);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);

            if (transaction != null)
                db.ExecuteNonQuery(dbCmd, transaction);
            else
                db.ExecuteNonQuery(dbCmd);

            return true;
        }

        public static bool UpdateSupportData(Database db, DbTransaction transaction, int siteID, int equipmentID, int supportID, string supportNumber, string supportEmailID, int updatedBy, int updatedDate, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_SUPPORT SET FSUPPORTNUMBER=:SUPPORTNUMBER,FSUPPORTEMAILID=:SUPPORTEMAILID, ");
            sqlCmdBuilder.Append(" FUPDATEDBY=:UPDATEDBY,FUPDATEDON=:UPDATEDON,FUPDATEDTIME=:UPDATEDTIME ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FSUPPORTID=:SUPPORTID AND FEQUIPMENTID=:EQUIPMENTID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":EQUIPMENTID", DbType.Int32, equipmentID);
            db.AddInParameter(dbCmd, ":SUPPORTID", DbType.Int32, supportID);
            db.AddInParameter(dbCmd, ":SUPPORTNUMBER", DbType.AnsiString, supportNumber);
            db.AddInParameter(dbCmd, ":SUPPORTEMAILID", DbType.String, supportEmailID);
            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedDate);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);

            db.ExecuteNonQuery(dbCmd, transaction);
            return true;
        }

        #endregion

        #endregion

        #region Equipment Model Info
        public static IDataReader GetEquipmentModelList(Database db, int siteID, int equipmentModelID, int pageSize, int pageIndex, string searchEquipmentModelName, int searchManufactureID, int searchCategoryID, string sortType)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            if (pageSize > 0)
            {
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");
            }

            sqlCmdBuilder.Append(" SELECT E.FEQUIPMENTID,E.FEQUIPMENTNAME,E.FDESCRIPTION,E.FMODELNUMBER,E.FMANUFID,E.FCATEGORYID,E.FCLASSID,E.FIMAGENAME,M.FNAME AS FMANUFACTURERNAME,T.FNAME AS FCATEGORYNAME,C.FNAME AS FCLASSNAME ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_EQUIPMENT E ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_MASTER M ON M.FMASTERID = E.FMANUFID AND M.FSITEID = E.FSITEID AND M.FTYPE = 'MANUFACTURER' ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_MASTER T ON T.FMASTERID = E.FCATEGORYID AND T.FSITEID = E.FSITEID AND T.FTYPE = 'TYPE' ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_MASTER C ON C.FMASTERID = E.FCLASSID AND C.FSITEID = E.FSITEID AND C.FTYPE = 'CLASS' ");
            sqlCmdBuilder.Append(" WHERE E.FSITEID=:SITEID AND E.FSTATUS='A' AND E.FINFOTYPE='M' ");

            if (equipmentModelID > 0)
            {
                sqlCmdBuilder.Append(" AND E.FEQUIPMENTID =:EQUIPMENTID ");
            }
            if (!string.IsNullOrEmpty(searchEquipmentModelName))
            {
                sqlCmdBuilder.Append(" AND UPPER(E.FEQUIPMENTNAME) LIKE :EQUIPMENTNAME ");
            }
            if (searchManufactureID > 0)
            {
                sqlCmdBuilder.Append(" AND E.FMANUFID =:MANUFID ");
            }
            if (searchCategoryID > 0)
            {
                sqlCmdBuilder.Append(" AND  E.FCATEGORYID =:CATEGORYID ");
            }

            #region Sorting
            switch (sortType)
            {
                case "EquipmentModelName_asc":
                    sqlCmdBuilder.Append(" ORDER BY E.FEQUIPMENTNAME ASC ");
                    break;
                case "EquipmentModelName_desc":
                    sqlCmdBuilder.Append(" ORDER BY E.FEQUIPMENTNAME DESC ");
                    break;
                default:
                    sqlCmdBuilder.Append(" ORDER BY E.FUPDATEDON DESC, E.FUPDATEDTIME DESC");
                    break;
            }
            #endregion

            #region Paging
            if (pageSize > 0)
            {
                if (pageIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:PAGEINDEX)  AND (:PAGESIZE + (:PAGEINDEX - 1))");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:PAGEINDEX)  AND  (:PAGESIZE + (:PAGEINDEX))");
            }
            #endregion

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            if (equipmentModelID > 0)
            {
                db.AddInParameter(dbCmd, ":EQUIPMENTID", DbType.Int32, equipmentModelID);
            }
            if (searchManufactureID > 0)
            {
                db.AddInParameter(dbCmd, ":MANUFID", DbType.Int32, searchManufactureID);
            }
            if (searchCategoryID > 0)
            {
                db.AddInParameter(dbCmd, ":CATEGORYID", DbType.Int32, searchCategoryID);
            }

            if (!string.IsNullOrEmpty(searchEquipmentModelName))
            {
                db.AddInParameter(dbCmd, ":EQUIPMENTNAME", DbType.String, "%" + searchEquipmentModelName.Trim().ToUpper() + "%");
            }

            if (pageSize > 0)
            {
                db.AddInParameter(dbCmd, ":PAGEINDEX", DbType.Int32, pageIndex);
                db.AddInParameter(dbCmd, ":PAGESIZE", DbType.Int32, pageSize);
            }

            return db.ExecuteReader(dbCmd);
        }

        public static int GetEquipmentModelID(Database db, DbTransaction transaction, int siteID, int equipmentModelID, string modelName, out string status)
        {
            int equipmentModelDBID = 0;
            status = "I";
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FEQUIPMENTID,FSTATUS ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_EQUIPMENT WHERE UPPER(FEQUIPMENTNAME) =:EQUIPMENTNAME AND FINFOTYPE='M' ");
            if (equipmentModelID > 0)
            {
                sqlCmdBuilder.Append(" AND FEQUIPMENTID<>:EQUIPMENTID AND FSTATUS='A' ");
            }
            sqlCmdBuilder.Append(" AND FSITEID=:SITEID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":EQUIPMENTNAME", DbType.String, modelName.Trim().ToUpper());
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            if (equipmentModelID > 0)
            {
                db.AddInParameter(dbCmd, ":EQUIPMENTID", DbType.Int32, equipmentModelID);
            }

            DataTable measuringPointInfo;
            if (transaction == null)
            {
                measuringPointInfo = db.ExecuteDataSet(dbCmd).Tables[0];
            }
            else
            {
                measuringPointInfo = db.ExecuteDataSet(dbCmd, transaction).Tables[0];
            }
            if (measuringPointInfo.Rows.Count > 0)
            {
                int.TryParse(measuringPointInfo.Rows[0]["FEQUIPMENTID"].ToString(), out equipmentModelDBID);
                status = measuringPointInfo.Rows[0]["FSTATUS"].ToString();
            }
            return equipmentModelDBID;
        }

        public static int InsertEquipmentModelInfo(Database db, DbTransaction transaction, int siteID, string equipmentName, string equipmentDesc, int manufacturerID, int categoryID, int classID, string imageName,
           string modalNumber, int createdBy, int createdDate, int createdTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" INSERT INTO LDB1_MAINT_EQUIPMENT(FEQUIPMENTID,FSITEID,FEQUIPMENTNAME,FDESCRIPTION,FIMAGENAME,FMANUFID, ");
            sqlCmdBuilder.Append(" FCATEGORYID,FCLASSID,FMODELNUMBER,FINFOTYPE,FCREATEDBY,FCREATEDON,FCREATEDTIME,FSTATUS,FUPDATEDBY,FUPDATEDON,FUPDATEDTIME)");
            sqlCmdBuilder.Append(" VALUES(SEQUENCE_MAINT_EQUIPMENT_ID.NEXTVAL,:SITEID,:EQUIPMENTNAME,:DESCRIPTION,:IMAGENAME,:MANUFID, ");
            sqlCmdBuilder.Append(" :CATEGORYID,:CLASSID,:MODELNUMBER,'M',:CREATEDBY,:CREATEDON,:CREATEDTIME,'A',:CREATEDBY,:CREATEDON,:CREATEDTIME)");
            sqlCmdBuilder.Append(" RETURNING FEQUIPMENTID INTO :EQUIPMENTID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":EQUIPMENTNAME", DbType.String, equipmentName.Trim());
            db.AddInParameter(dbCmd, ":DESCRIPTION", DbType.String, equipmentDesc.Trim());
            db.AddInParameter(dbCmd, ":IMAGENAME", DbType.String, imageName.Trim().ToUpper());
            db.AddInParameter(dbCmd, ":MODELNUMBER", DbType.AnsiString, modalNumber.Trim().ToUpper());
            db.AddInParameter(dbCmd, ":MANUFID", DbType.Int32, manufacturerID);
            db.AddInParameter(dbCmd, ":CATEGORYID", DbType.Int32, categoryID);
            db.AddInParameter(dbCmd, ":CLASSID", DbType.Int32, classID);

            db.AddInParameter(dbCmd, ":CREATEDBY", DbType.Int32, createdBy);
            db.AddInParameter(dbCmd, ":CREATEDON", DbType.Int32, createdDate);
            db.AddInParameter(dbCmd, ":CREATEDTIME", DbType.Int32, createdTime);
            db.AddOutParameter(dbCmd, ":EQUIPMENTID", DbType.Int32, sizeof(Int32));

            if (transaction != null)
                db.ExecuteNonQuery(dbCmd, transaction);
            else
                db.ExecuteNonQuery(dbCmd);

            return Convert.ToInt32(db.GetParameterValue(dbCmd, ":EQUIPMENTID"));

        }

        public static bool UpdateEquipmentModelInfo(Database db, DbTransaction transaction, int siteID, int equipmentID, string equipmentName, string equipmentDesc, int manufacturerID, int categoryID, int classID, string imageName, string modelNumber, int updatedBy, int updatedDate, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_EQUIPMENT SET FEQUIPMENTNAME=:EQUIPMENTNAME,FDESCRIPTION=:DESCRIPTION ");

            if (!string.IsNullOrEmpty(imageName))
            {
                sqlCmdBuilder.Append(",FIMAGENAME=:IMAGENAME ");
            }

            sqlCmdBuilder.Append(" ,FMANUFID=:MANUFID,FCATEGORYID=:CATEGORYID,FCLASSID=:CLASSID,FMODELNUMBER=:MODELNUMBER ");
            sqlCmdBuilder.Append(" ,FUPDATEDBY=:UPDATEDBY,FUPDATEDON=:UPDATEDON,FUPDATEDTIME=:UPDATEDTIME ");
            sqlCmdBuilder.Append(" WHERE FEQUIPMENTID=:EQUIPMENTID AND FSITEID=:SITEID AND FINFOTYPE='M' AND FSTATUS='A' ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":EQUIPMENTID", DbType.Int32, equipmentID);
            db.AddInParameter(dbCmd, ":EQUIPMENTNAME", DbType.String, equipmentName.Trim());
            db.AddInParameter(dbCmd, ":DESCRIPTION", DbType.String, equipmentDesc.Trim());

            if (!string.IsNullOrEmpty(imageName))
            {
                db.AddInParameter(dbCmd, ":IMAGENAME", DbType.String, imageName.Trim().ToUpper());
            }

            db.AddInParameter(dbCmd, ":MODELNUMBER", DbType.String, modelNumber.Trim().ToUpper());
            db.AddInParameter(dbCmd, ":MANUFID", DbType.Int32, manufacturerID);
            db.AddInParameter(dbCmd, ":CATEGORYID", DbType.Int32, categoryID);
            db.AddInParameter(dbCmd, ":CLASSID", DbType.Int32, classID);

            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedDate);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);

            if (transaction != null)
                db.ExecuteNonQuery(dbCmd, transaction);
            else
                db.ExecuteNonQuery(dbCmd);

            return true;
        }

        public static bool CheckEquipmentModelInfoExist(Database db, DbTransaction transaction, int siteID, int referenceModelID, int equipmentID, int manufacturerID, string modelNumber, bool checkIsExitModel)
        {
            IDataReader dataReaderCheck = null;
            try
            {
                StringBuilder sqlCmdBuilder = new StringBuilder();
                sqlCmdBuilder.Append(" SELECT FEQUIPMENTID FROM LDB1_MAINT_EQUIPMENT ");
                sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FSTATUS='A' ");
                if (referenceModelID > 0)
                {
                    sqlCmdBuilder.Append(" AND FMODELREFERENCEID=:MODELREFERENCEID AND FINFOTYPE='E'");
                }
                else if (checkIsExitModel && referenceModelID == 0)
                {
                    sqlCmdBuilder.Append(" AND FEQUIPMENTID<>:EQUIPMENTID AND FMANUFID=:MANUFID AND UPPER(FMODELNUMBER)=:MODELNUMBER AND FINFOTYPE='M'");
                }

                DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
                dbCmd.CommandType = CommandType.Text;

                db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
                if (referenceModelID > 0)
                    db.AddInParameter(dbCmd, ":MODELREFERENCEID", DbType.Int32, referenceModelID);
                if (checkIsExitModel)
                {
                    db.AddInParameter(dbCmd, ":EQUIPMENTID", DbType.Int32, equipmentID);
                    db.AddInParameter(dbCmd, ":MANUFID", DbType.Int32, manufacturerID);
                    db.AddInParameter(dbCmd, ":modelNumber", DbType.String, modelNumber.ToUpper().Trim());
                }

                bool isExists = false;
                using (dataReaderCheck = transaction != null ? db.ExecuteReader(dbCmd, transaction) : db.ExecuteReader(dbCmd))
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

        //public static bool DeleteMeasuringPointOfParentID(Database db, DbTransaction transaction, int siteID, int parentID, char parentType)
        //{
        //    StringBuilder sqlCmdBuilder = new StringBuilder();
        //    sqlCmdBuilder.Append(" UPDATE SET LDB1_MAINT_MEASURINGPOINT ");
        //    sqlCmdBuilder.Append(" WHERE FPARENTID=:PARENTID AND FPARENTTYPE=:PARENTTYPE AND FSITEID=:SITEID AND FSTATUS='A' ");

        //    DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
        //    dbCmd.CommandType = CommandType.Text;

        //    db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
        //    db.AddInParameter(dbCmd, ":PARENTID", DbType.Int32, parentID);
        //    db.AddInParameter(dbCmd, ":PARENTTYPE", DbType.AnsiStringFixedLength, parentType);

        //    if (transaction != null)
        //        db.ExecuteNonQuery(dbCmd, transaction);
        //    else
        //        db.ExecuteNonQuery(dbCmd);

        //    return true;
        //}

        //public static bool InActiavteDocumentsAndImagesInfo(Database db, DbTransaction transaction, int siteID, int referenceID, char referenceType,int userID,int updatedOn,int updatedTime)
        //{
        //    StringBuilder sqlCmdBuilder = new StringBuilder();
        //    sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_DOCUMENTS SET FSTATUS='I',FUPDATEDBY=:UPDATEDBY,FUPDATEDON=:UPDATEDON,FUPDATEDTIME=:UPDATEDTIME ");
        //    sqlCmdBuilder.Append(" WHERE FREFERENCEID=:REFERENCEID AND FREF_TYPE=:REFTYPE AND FSITEID=:SITEID AND FSTATUS='A' ");

        //    DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
        //    dbCmd.CommandType = CommandType.Text;

        //    db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
        //    db.AddInParameter(dbCmd, ":REFERENCEID", DbType.Int32, referenceID);
        //    db.AddInParameter(dbCmd, ":REFTYPE", DbType.AnsiStringFixedLength, referenceType);
        //    db.AddInParameter(dbCmd, ":FUPDATEDBY", DbType.Int32, userID);
        //    db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedOn);
        //    db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);


        //    if (transaction != null)
        //        db.ExecuteNonQuery(dbCmd, transaction);
        //    else
        //        db.ExecuteNonQuery(dbCmd);

        //    return true;

        //}
        #endregion

        #region Measuring Point Info

        public static IDataReader GetSensorTypeInfo(Database db, int siteID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FSENSORTYPEID,FSENSORTYPENAME FROM LDB1_SENSOR_TYPE S  ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_COUNTRY_SITES C ON C.FCOMPANYID=S.FCOMPANYID AND C.FSTATUS='A' ");
            sqlCmdBuilder.Append(" WHERE C.FSITEID=:SITEID AND S.FSTATUS='A' ");
            sqlCmdBuilder.Append(" ORDER BY FSENSORTYPENAME ASC ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetSensorUnitInfo(Database db, int siteID, int sensorTypeID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FSENSORTYPEUOMID,FUOMNAME FROM LDB1_SENSORTYPE_UOM  ");
            if (sensorTypeID > 0)
                sqlCmdBuilder.Append(" WHERE FSENSORTYPEID=:SENSORTYPEID ");
            sqlCmdBuilder.Append(" ORDER BY FUOMNAME ASC ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            if (sensorTypeID > 0)
                db.AddInParameter(dbCmd, ":SENSORTYPEID", DbType.Int32, sensorTypeID);
            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetMeasuringPointList(Database db, DbTransaction transaction, int pageSize, int pageIndex, int siteID, int parentID, char parentType, string searchString, int measuringPointID, string sortType)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();

            if (pageSize > 0)
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");

            sqlCmdBuilder.Append(" SELECT FMEASURINGPOINTID,FMEASURINGPOINTNAME,FSTATUS ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_MEASURINGPOINT ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FSTATUS<>'I' ");

            if (parentID != 0)
            {
                sqlCmdBuilder.Append(" AND FPARENTID=:PARENTID AND FPARENTTYPE=:PARENTTYPE ");
            }
            //if (parentType == 'E' && parentID==0)
            //{
            //    sqlCmdBuilder.Append(" AND FPARENTTYPE IN('L','E') "); 
            //}
            if (measuringPointID != 0)
            {
                sqlCmdBuilder.Append(" AND FMEASURINGPOINTID=:MEASURINGPOINTID ");
            }

            if (!string.IsNullOrEmpty(searchString))
            {
                sqlCmdBuilder.Append(" AND UPPER(FMEASURINGPOINTNAME) LIKE :MEASURINGPOINTNAME ");
            }
            // sqlCmdBuilder.Append(" ORDER BY FUPDATEDON DESC, FUPDATEDTIME DESC ");

            #region Sorting
            switch (sortType)
            {
                case "MeasuringPointName_asc":
                    sqlCmdBuilder.Append(" ORDER BY UPPER(FMEASURINGPOINTNAME) ASC ");
                    break;
                case "MeasuringPointName_desc":
                    sqlCmdBuilder.Append(" ORDER BY UPPER(FMEASURINGPOINTNAME) DESC ");
                    break;
                default:
                    sqlCmdBuilder.Append(" ORDER BY FUPDATEDON DESC,FUPDATEDTIME DESC ");
                    break;
            }
            #endregion

            #region Paging
            if (pageSize > 0)
            {
                if (pageIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:PAGEINDEX)  AND (:PAGESIZE + (:PAGEINDEX - 1))");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:PAGEINDEX)  AND  (:PAGESIZE + (:PAGEINDEX))");
            }
            #endregion

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            if (parentID != 0)
            {
                db.AddInParameter(dbCmd, ":PARENTID", DbType.Int32, parentID);
                db.AddInParameter(dbCmd, ":PARENTTYPE", DbType.AnsiStringFixedLength, parentType);
            }

            if (measuringPointID != 0)
            {
                db.AddInParameter(dbCmd, ":MEASURINGPOINTID", DbType.Int32, measuringPointID);
            }

            if (!string.IsNullOrEmpty(searchString))
            {
                db.AddInParameter(dbCmd, ":MEASURINGPOINTNAME", DbType.AnsiString, "%" + searchString.Trim().ToUpper() + "%");
            }
            if (pageSize > 0)
            {
                db.AddInParameter(dbCmd, ":PAGEINDEX", DbType.Int32, pageIndex);
                db.AddInParameter(dbCmd, ":PAGESIZE", DbType.Int32, pageSize);
            }
            if (transaction != null)
                return db.ExecuteReader(dbCmd, transaction);
            else
                return db.ExecuteReader(dbCmd);
        }

        public static bool CheckMeasuringPointCodeExist(Database db, DbTransaction transaction, int siteID, string measuringPointCode, int measuringPointID, bool isConsiderStatus)
        {
            IDataReader dataReaderCheck = null;
            try
            {
                StringBuilder sqlCmdBuilder = new StringBuilder();
                sqlCmdBuilder.Append(" SELECT FMEASURINGPOINTID FROM LDB1_MAINT_MEASURINGPOINT  ");
                sqlCmdBuilder.Append(" WHERE FMEASURINGPOINTCODE=:MEASURINGPOINTCODE AND FSITEID=:SITEID ");
                if (measuringPointID > 0)
                    sqlCmdBuilder.Append(" AND FMEASURINGPOINTID<>:MEASURINGPOINTID ");
                if (isConsiderStatus)
                    sqlCmdBuilder.Append(" AND FSTATUS='A' ");

                DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
                dbCmd.CommandType = CommandType.Text;

                db.AddInParameter(dbCmd, ":MEASURINGPOINTCODE", DbType.AnsiString, measuringPointCode.Trim().ToUpper());
                db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
                if (measuringPointID > 0)
                    db.AddInParameter(dbCmd, ":MEASURINGPOINTID", DbType.Int32, measuringPointID);

                bool isExists = false;
                using (dataReaderCheck = transaction != null ? db.ExecuteReader(dbCmd, transaction) : db.ExecuteReader(dbCmd))
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

        public static IDataReader GetMeasuringPointID(Database db, DbTransaction transaction, int siteID, int measuringPointID, string measuringPointCode, string measuringPointName, int parentID, char parentType)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FMEASURINGPOINTID,FPARENTID,FSTATUS ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_MEASURINGPOINT WHERE FSITEID=:SITEID ");
            if (measuringPointCode.Length > 0)
                sqlCmdBuilder.Append(" AND FMEASURINGPOINTCODE=:MEASURINGPOINTCODE ");
            if (measuringPointName.Length > 0)
                sqlCmdBuilder.Append(" AND UPPER(FMEASURINGPOINTNAME) =:MEASURINGPOINTNAME ");
            if (parentID > 0)
                sqlCmdBuilder.Append(" AND FPARENTID=:PARENTID AND FPARENTTYPE=:PARENTTYPE ");

            if (measuringPointID > 0)
            {
                sqlCmdBuilder.Append(" AND FMEASURINGPOINTID<>:MEASURINGPOINTID AND FSTATUS='A' ");
            }

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            if (measuringPointCode.Length > 0)
                db.AddInParameter(dbCmd, ":MEASURINGPOINTCODE", DbType.AnsiString, measuringPointCode.Trim().ToUpper());
            if (measuringPointName.Length > 0)
                db.AddInParameter(dbCmd, ":MEASURINGPOINTNAME", DbType.String, measuringPointName.Trim().ToUpper());
            if (parentID > 0)
            {
                db.AddInParameter(dbCmd, ":PARENTID", DbType.Int32, parentID);
                db.AddInParameter(dbCmd, ":PARENTTYPE", DbType.AnsiStringFixedLength, parentType);
            }
            if (measuringPointID > 0)
                db.AddInParameter(dbCmd, ":MEASURINGPOINTID", DbType.Int32, measuringPointID);

            if (transaction != null)
                return db.ExecuteReader(dbCmd, transaction);
            else
                return db.ExecuteReader(dbCmd);
        }


        public static IDataReader GetMeasuringPointInfo(Database db, int siteID, int measuringPointID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT M.FMEASURINGPOINTID ,M.FMEASURINGPOINTCODE,M.FPARENTTYPE,M.FPARENTID,M.FMEASURINGPOINTNAME,M.FDESCRIPTION,M.FPOSITION,M.FCATEGORYID,S.FSENSORTYPEUOMID,S.FSENSORTYPEID,M.FIMAGENAME  ");
            sqlCmdBuilder.Append(" ,M.FREADINGTYPE,M.FDECIMALPLACES,M.FLOWERLIMIT,M.FUPPERLIMIT,M.FLOWERLIMITWARNING,M.FUPPERLIMITWARNING,M.FMAXTEXTLENGTH,M.FGROUPID,M.FISCOUNTER,M.FOPCTAGID,M.FUUID,E.FLOCATIONID ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_MEASURINGPOINT M LEFT OUTER JOIN LDB1_SENSORTYPE_UOM S ON M.FSENSORTYPEUOMID=S.FSENSORTYPEUOMID ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_EQUIPMENT E ON M.FPARENTID=E.FEQUIPMENTID ");
            sqlCmdBuilder.Append(" WHERE FMEASURINGPOINTID=:MEASURINGPOINTID AND M.FSTATUS<>'I' AND M.FSITEID=:SITEID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":MEASURINGPOINTID", DbType.Int32, measuringPointID);

            return db.ExecuteReader(dbCmd);
        }

        public static int InsertMeasuringPointInfo(Database db, DbTransaction transaction, int siteID, string measuringPointCode, string measuringPointName, string description, string position, int categoryID, int uomID, int parentID, char parentType, string imageName, char readingType, int maxTextLength,
            decimal minValue, decimal maxValue, decimal minValueWarning, decimal maxValueWarning, int decimalPlaces, int groupID, bool isCounter, char status, string opcTagID, int tagUUID, int createdBy, int createdOn, int createdTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            StringBuilder sqlCmdBuilderValues = new StringBuilder();
            sqlCmdBuilder.Append(" INSERT INTO LDB1_MAINT_MEASURINGPOINT ( ");
            sqlCmdBuilder.Append(" FMEASURINGPOINTID,FMEASURINGPOINTNAME,FPARENTID,FPARENTTYPE,FPOSITION,FCATEGORYID,FREADINGTYPE,FISCOUNTER,FOPCTAGID,FUUID, ");
            sqlCmdBuilderValues.Append(" VALUES (SEQUENCE_MAINT_MP_ID.NEXTVAL,:MEASURINGPOINTNAME,:PARENTID,:PARENTTYPE,:POSITION,:CATEGORYID,:READINGTYPE,:ISCOUNTER,:OPCTAGID,:TAGUUID, ");

            if (measuringPointCode.Length > 0)
            {
                sqlCmdBuilder.Append(" FMEASURINGPOINTCODE, ");
                sqlCmdBuilderValues.Append(" :MEASURINGPOINTCODE, ");
            }

            if (!string.IsNullOrEmpty(description))
            {
                sqlCmdBuilder.Append(" FDESCRIPTION, ");
                sqlCmdBuilderValues.Append(" :DESCRIPTION, ");
            }

            if (!string.IsNullOrEmpty(imageName))
            {
                sqlCmdBuilder.Append(" FIMAGENAME, ");
                sqlCmdBuilderValues.Append(" :IMAGENAME, ");
            }

            if (uomID > 0)
            {
                sqlCmdBuilder.Append(" FSENSORTYPEUOMID, ");
                sqlCmdBuilderValues.Append(" :SENSORTYPEUOMID, ");
            }

            switch (readingType)
            {
                case 'T': //Text
                    {
                        if (maxTextLength > 0)
                        {
                            sqlCmdBuilder.Append(" FMAXTEXTLENGTH, ");
                            sqlCmdBuilderValues.Append(" :MAXTEXTLENGTH, ");
                        }
                    }
                    break;
                case 'D': //Digit
                    {
                        if (decimalPlaces > 0)
                        {
                            sqlCmdBuilder.Append(" FDECIMALPLACES, ");
                            sqlCmdBuilderValues.Append(" :DECIMALPLACES, ");
                        }
                        sqlCmdBuilder.Append(" FLOWERLIMIT,FUPPERLIMIT,FLOWERLIMITWARNING,FUPPERLIMITWARNING, ");
                        sqlCmdBuilderValues.Append(" :LOWERLIMIT,:UPPERLIMIT,:LOWERLIMITWARNING,:UPPERLIMITWARNING, ");
                    }
                    break;
                case 'N': //Numeric
                    {
                        sqlCmdBuilder.Append(" FLOWERLIMIT,FUPPERLIMIT,FLOWERLIMITWARNING,FUPPERLIMITWARNING, ");
                        sqlCmdBuilderValues.Append(" :LOWERLIMIT,:UPPERLIMIT,:LOWERLIMITWARNING,:UPPERLIMITWARNING, ");
                    }
                    break;
                case 'S': //Selection
                    sqlCmdBuilder.Append(" FGROUPID, ");
                    sqlCmdBuilderValues.Append(" :GROUPID, ");
                    break;
            }

            sqlCmdBuilder.Append(" FSITEID,FCREATEDBY,FCREATEDON,FCREATEDTIME,FUPDATEDBY,FUPDATEDON,FUPDATEDTIME,FSTATUS) ");
            sqlCmdBuilderValues.Append(" :SITEID,:CREATEDBY,:CREATEDON,:CREATEDTIME,:CREATEDBY,:CREATEDON,:CREATEDTIME,:STATUS) ");
            sqlCmdBuilderValues.Append(" RETURNING FMEASURINGPOINTID INTO :MEASURINGPOINTID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString() + " " + sqlCmdBuilderValues.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":MEASURINGPOINTNAME", DbType.String, measuringPointName);
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":PARENTID", DbType.Int32, parentID);
            db.AddInParameter(dbCmd, ":PARENTTYPE", DbType.AnsiStringFixedLength, parentType);
            db.AddInParameter(dbCmd, ":POSITION", DbType.String, position);
            db.AddInParameter(dbCmd, ":CATEGORYID", DbType.Int32, categoryID);
            db.AddInParameter(dbCmd, ":READINGTYPE", DbType.AnsiStringFixedLength, readingType);
            db.AddInParameter(dbCmd, ":OPCTAGID", DbType.String, opcTagID);
            db.AddInParameter(dbCmd, ":TAGUUID", DbType.Int32, tagUUID);

            if (measuringPointCode.Length > 0)
            {
                db.AddInParameter(dbCmd, ":MEASURINGPOINTCODE", DbType.AnsiString, measuringPointCode.Trim().ToUpper());
            }

            if (!string.IsNullOrEmpty(description))
            {
                db.AddInParameter(dbCmd, ":DESCRIPTION", DbType.String, description);
            }

            if (!string.IsNullOrEmpty(imageName))
            {
                db.AddInParameter(dbCmd, ":IMAGENAME", DbType.String, imageName);
            }

            if (uomID > 0)
            {
                db.AddInParameter(dbCmd, ":SENSORTYPEUOMID", DbType.Int32, uomID);
            }

            if (isCounter)
                db.AddInParameter(dbCmd, ":ISCOUNTER", DbType.AnsiStringFixedLength, 'Y');
            else
                db.AddInParameter(dbCmd, ":ISCOUNTER", DbType.AnsiStringFixedLength, 'N');

            switch (readingType)
            {
                case 'T': //Text
                    {
                        if (maxTextLength > 0)
                        {
                            db.AddInParameter(dbCmd, ":MAXTEXTLENGTH", DbType.Int32, maxTextLength);
                        }
                    }
                    break;
                case 'D': //Digit
                    {
                        if (decimalPlaces > 0)
                        {
                            db.AddInParameter(dbCmd, ":DECIMALPLACES", DbType.Int32, decimalPlaces);
                        }
                        db.AddInParameter(dbCmd, ":LOWERLIMIT", DbType.Decimal, minValue);
                        db.AddInParameter(dbCmd, ":UPPERLIMIT", DbType.Decimal, maxValue);
                        db.AddInParameter(dbCmd, ":LOWERLIMITWARNING", DbType.Decimal, minValueWarning);
                        db.AddInParameter(dbCmd, ":UPPERLIMITWARNING", DbType.Decimal, maxValueWarning);
                    }
                    break;
                case 'N': //Numeric
                    {
                        db.AddInParameter(dbCmd, ":LOWERLIMIT", DbType.Decimal, minValue);
                        db.AddInParameter(dbCmd, ":UPPERLIMIT", DbType.Decimal, maxValue);
                        db.AddInParameter(dbCmd, ":LOWERLIMITWARNING", DbType.Decimal, minValueWarning);
                        db.AddInParameter(dbCmd, ":UPPERLIMITWARNING", DbType.Decimal, maxValueWarning);
                    }
                    break;
                case 'S': //Selection
                    db.AddInParameter(dbCmd, ":GROUPID", DbType.Int32, groupID);
                    break;
            }

            db.AddInParameter(dbCmd, ":STATUS", DbType.AnsiStringFixedLength, status);
            db.AddInParameter(dbCmd, ":CREATEDBY", DbType.Int32, createdBy);
            db.AddInParameter(dbCmd, ":CREATEDON", DbType.Int32, createdOn);
            db.AddInParameter(dbCmd, ":CREATEDTIME", DbType.Int32, createdTime);
            db.AddOutParameter(dbCmd, ":MEASURINGPOINTID", DbType.Int32, sizeof(Int32));

            if (transaction == null) db.ExecuteNonQuery(dbCmd);
            else db.ExecuteNonQuery(dbCmd, transaction);

            return Convert.ToInt32(db.GetParameterValue(dbCmd, ":MEASURINGPOINTID").ToString());
        }

        public static bool UpdateMeasuringPointInfo(Database db, DbTransaction transaction, int siteID, int measuringPointID, string measuringCode, string measuringPointName, string description, char parentType, int parentID, string position, int categoryID, int uomID, string imageName,
            char readingType, int maxTextLength, decimal minValue, decimal maxValue, decimal minValueWarning, decimal maxValueWarning, int decimalPlaces, int groupID, bool isCounter, string opcTagID, int tagUUID, int updatedBy, int updatedOn, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_MEASURINGPOINT SET FMEASURINGPOINTCODE=:MEASURINGPOINTCODE,FMEASURINGPOINTNAME=:MEASURINGPOINTNAME,FDESCRIPTION=:DESCRIPTION,FPARENTID=:PARENTID,FPARENTTYPE=:PARENTTYPE, ");
            sqlCmdBuilder.Append(" FPOSITION=:POSITION,FCATEGORYID=:CATEGORYID,FIMAGENAME=:IMAGENAME,FISCOUNTER=:ISCOUNTER,FOPCTAGID=:OPCTAGID,FUUID=:UUID, ");

            if (uomID > 0)
            {
                sqlCmdBuilder.Append(" FSENSORTYPEUOMID=:SENSORTYPEUOMID, ");
            }
            else
            {
                sqlCmdBuilder.Append(" FSENSORTYPEUOMID= NULL, ");
            }
            sqlCmdBuilder.Append(" FREADINGTYPE=:READINGTYPE,FMAXTEXTLENGTH=:MAXTEXTLENGTH,FLOWERLIMIT=:LOWERLIMIT,FUPPERLIMIT=:UPPERLIMIT,FLOWERLIMITWARNING=:LOWERLIMITWARNING,FUPPERLIMITWARNING=:UPPERLIMITWARNING,FDECIMALPLACES=:DECIMALPLACES, ");
            if (groupID > 0)
            {
                sqlCmdBuilder.Append(" FGROUPID=:GROUPID, ");
            }
            else
            {
                sqlCmdBuilder.Append(" FGROUPID= NULL, ");
            }

            sqlCmdBuilder.Append(" FUPDATEDBY=:UPDATEDBY,FUPDATEDON=:UPDATEDON,FUPDATEDTIME=:UPDATEDTIME,FSTATUS='A' WHERE FMEASURINGPOINTID=:MEASURINGPOINTID AND FSITEID=:SITEID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":MEASURINGPOINTID", DbType.Int32, measuringPointID);
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":MEASURINGPOINTCODE", DbType.AnsiString, measuringCode.Trim().ToUpper());
            db.AddInParameter(dbCmd, ":MEASURINGPOINTNAME", DbType.String, measuringPointName);
            db.AddInParameter(dbCmd, ":DESCRIPTION", DbType.String, description);
            db.AddInParameter(dbCmd, ":POSITION", DbType.String, position);
            db.AddInParameter(dbCmd, ":CATEGORYID", DbType.Int32, categoryID);
            db.AddInParameter(dbCmd, ":PARENTID", DbType.Int32, parentID);
            db.AddInParameter(dbCmd, ":PARENTTYPE", DbType.AnsiStringFixedLength, parentType);
            db.AddInParameter(dbCmd, ":IMAGENAME", DbType.String, imageName);
            if (uomID > 0)
            {
                db.AddInParameter(dbCmd, ":SENSORTYPEUOMID", DbType.Int32, uomID);
            }
            db.AddInParameter(dbCmd, ":READINGTYPE", DbType.AnsiStringFixedLength, readingType);
            db.AddInParameter(dbCmd, ":MAXTEXTLENGTH", DbType.Int32, maxTextLength);
            db.AddInParameter(dbCmd, ":LOWERLIMIT", DbType.Decimal, minValue);
            db.AddInParameter(dbCmd, ":UPPERLIMIT", DbType.Decimal, maxValue);
            db.AddInParameter(dbCmd, ":LOWERLIMITWARNING", DbType.Decimal, minValueWarning);
            db.AddInParameter(dbCmd, ":UPPERLIMITWARNING", DbType.Decimal, maxValueWarning);
            db.AddInParameter(dbCmd, ":DECIMALPLACES", DbType.Int32, decimalPlaces);

            if (groupID > 0)
            {
                db.AddInParameter(dbCmd, ":GROUPID", DbType.Int32, groupID);
            }

            if (isCounter)
                db.AddInParameter(dbCmd, ":ISCOUNTER", DbType.AnsiStringFixedLength, 'Y');
            else
                db.AddInParameter(dbCmd, ":ISCOUNTER", DbType.AnsiStringFixedLength, 'N');
            db.AddInParameter(dbCmd, ":OPCTAGID", DbType.String, opcTagID);
            db.AddInParameter(dbCmd, ":UUID", DbType.Int32, tagUUID);
            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedOn);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);

            if (transaction == null) db.ExecuteNonQuery(dbCmd);
            else db.ExecuteNonQuery(dbCmd, transaction);
            return true;
        }

        public static bool DeleteMeasuringPointInfo(Database db, DbTransaction transaction, int siteID, int equipmentID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" DELETE FROM LDB1_MAINT_MEASURINGPOINT ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FPARENTID=:EQUIPMENTID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":EQUIPMENTID", DbType.Int32, equipmentID);


            if (transaction != null)
                db.ExecuteNonQuery(dbCmd, transaction);
            else
                db.ExecuteNonQuery(dbCmd);

            return true;
        }

        public static DataTable GetMeasuringPointInfoFromView(Database db, int siteID, string viewName, List<DynamicGrid.SQLColumnFilterInfo> sqlColumnFilterInfoList,string equipmentIDs)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT * FROM " + viewName);
            sqlCmdBuilder.Append(" WHERE FSITEID = " + siteID);

            if (sqlColumnFilterInfoList != null)
            {
                sqlCmdBuilder.Append(" AND ");
                DynamicGrid.Common.AppendDynamicFilter(sqlCmdBuilder, sqlColumnFilterInfoList, -1);
            }
            else if (equipmentIDs.Length > 0)
            {
                sqlCmdBuilder.Append(" AND FPARENTID IN (" + equipmentIDs + ") ");
            }

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            if (sqlColumnFilterInfoList != null)
            {
                DynamicGrid.Common.AddDynamicFilterParameters(db, dbCmd, sqlColumnFilterInfoList);
            }
            return db.ExecuteDataSet(dbCmd).Tables[0];
        }

        public static IDataReader GetSensorTypeUOMID(Database db, string sensorTypeName, string uomName)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT U.FSENSORTYPEUOMID FROM LDB1_SENSORTYPE_UOM U  ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_SENSOR_TYPE S ON S.FSENSORTYPEID=U.FSENSORTYPEID AND FSTATUS='A' AND UPPER(S.FSENSORTYPENAME)=:SENSORTYPENAME ");
            sqlCmdBuilder.Append(" WHERE UPPER(U.FUOMNAME)=:UOMNAME ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SENSORTYPENAME", DbType.AnsiString, sensorTypeName.Trim().ToUpper());
            db.AddInParameter(dbCmd, ":UOMNAME", DbType.AnsiString, uomName.Trim().ToUpper());
            return db.ExecuteReader(dbCmd);
        }

        #region OPC Configuration
        public static IDataReader GetGatewayService(Database db, int siteID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FGATEWAYNAME,FGATEWAYID FROM LDB1_IOT_GATEWAYINFO WHERE FSITEID=:SITEID AND FSTATUS='A' ");
            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            dbCmd.CommandType = CommandType.Text;
            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetDataSourceList(Database db, int siteID, string dataSourceName = null)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT DISTINCT DS.FDATASOURCENAME,DS.FDATASOURCEID ");
            sqlCmdBuilder.Append(" FROM  LDB1_SITEDATASOURCE SDS ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_IOT_GATEWAYINFO G ON G.FGATEWAYID=SDS.FGATEWAYID AND G.FSITEID=:SITEID AND G.FSTATUS='A' ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_IOT_DATASOURCES DS ON DS.FDATASOURCEID=SDS.FDATASOURCEID AND DS.FSTATUS='A' ");
            sqlCmdBuilder.Append(" WHERE SDS.FISDLLLOADED='Y' AND SDS.FSTATUS='A' ");
            if (!string.IsNullOrEmpty(dataSourceName))
                sqlCmdBuilder.Append(" AND UPPER(DS.FDATASOURCENAME)=:DATASOURCENAME");

            System.Data.Common.DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            if (!string.IsNullOrEmpty(dataSourceName))
                db.AddInParameter(dbCmd, ":DATASOURCENAME", DbType.AnsiString, dataSourceName.Trim());
            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetGatewayServiceID(Database db, int siteID, string gatewayName, int dataSourceID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FGATEWAYSERVICEID FROM LDB1_SITEDATASOURCE ");
            sqlCmdBuilder.Append(" WHERE FDATASOURCEID=:DATASOURCEID AND FGATEWAYID=( ");
            sqlCmdBuilder.Append(" SELECT FGATEWAYID FROM LDB1_IOT_GATEWAYINFO WHERE FSTATUS='A' AND UPPER(FGATEWAYNAME)=:GATEWAYNAME AND FSITEID=:SITEID ) AND FSTATUS='A' ");
            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":GATEWAYNAME", DbType.String, gatewayName.Trim().ToUpper());
            db.AddInParameter(dbCmd, ":DATASOURCEID", DbType.Int32, dataSourceID);

            dbCmd.CommandType = CommandType.Text;
            return db.ExecuteReader(dbCmd);
        }
        #endregion

        #endregion

        #region Documents,Images and Videos
        public static IDataReader GetAllDocumentsAndImagesInfo(Database db, int siteID, int equipmentID, char infoType, bool considerModel)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT D.FDOCUMENTID,D.FDOCUMENTNAME,D.FDOCUMENTTYPE,D.FREF_TYPE,E.FMODELREFERENCEID,E.FEQUIPMENTNAME ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_DOCUMENTS D ");

            if (infoType == 'E' && considerModel)
            {
                sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_EQUIPMENT E ON D.FREFERENCEID IN (E.FEQUIPMENTID,NVL(E.FMODELREFERENCEID,0)) ");
            }
            else if (infoType == 'E' && !considerModel)
            {
                sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_EQUIPMENT E ON D.FREFERENCEID = E.FEQUIPMENTID ");
            }
            else if (infoType == 'M')
            {
                sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_EQUIPMENT E ON D.FREFERENCEID=E.FEQUIPMENTID ");
            }

            sqlCmdBuilder.Append(" AND E.FSTATUS='A' AND E.FINFOTYPE=:INFOTYPE AND E.FEQUIPMENTID=:EQUIPMENTID ");
            sqlCmdBuilder.Append(" WHERE D.FSITEID=:SITEID AND D.FSTATUS='A' AND (D.FREF_TYPE = 'MODEL' OR D.FREF_TYPE = 'EQUIPMENT') ");
            sqlCmdBuilder.Append(" ORDER BY D.FREF_TYPE DESC,D.FUPDATEDON DESC,D.FUPDATEDTIME DESC ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":EQUIPMENTID", DbType.Int32, equipmentID);
            db.AddInParameter(dbCmd, ":INFOTYPE", DbType.AnsiStringFixedLength, infoType);

            return db.ExecuteReader(dbCmd);
        }

        public static int InsertDocumentsAndImagesInfo(Database db, DbTransaction transaction, int siteID, int referenceID, string refernceType, string documentName, char documentType, int createdBy, int createdDate, int createdTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" INSERT INTO LDB1_MAINT_DOCUMENTS(FDOCUMENTID,FSITEID,FREFERENCEID,FREF_TYPE,FDOCUMENTTYPE,FDOCUMENTNAME,FSTATUS, ");
            sqlCmdBuilder.Append(" FCREATEDBY,FCREATEDON,FCREATEDTIME,FUPDATEDBY,FUPDATEDON,FUPDATEDTIME) ");
            sqlCmdBuilder.Append(" VALUES(SEQUENCE_MAINT_DOC_ID.NEXTVAL,:SITEID,:REFERENCEID,:REF_TYPE,:DOCUMENTTYPE,:DOCUMENTNAME,'A', ");
            sqlCmdBuilder.Append(" :CREATEDBY,:CREATEDON,:CREATEDTIME,:CREATEDBY,:CREATEDON,:CREATEDTIME) ");
            sqlCmdBuilder.Append(" RETURNING FDOCUMENTID INTO :DOCUMENTID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":REFERENCEID", DbType.Int32, referenceID);
            db.AddInParameter(dbCmd, ":REF_TYPE", DbType.AnsiString, refernceType.Trim().ToUpper());
            db.AddInParameter(dbCmd, ":DOCUMENTTYPE", DbType.AnsiStringFixedLength, documentType);
            db.AddInParameter(dbCmd, ":DOCUMENTNAME", DbType.String, documentName.Trim());

            db.AddInParameter(dbCmd, ":CREATEDBY", DbType.Int32, createdBy);
            db.AddInParameter(dbCmd, ":CREATEDON", DbType.Int32, createdDate);
            db.AddInParameter(dbCmd, ":CREATEDTIME", DbType.Int32, createdTime);

            db.AddOutParameter(dbCmd, ":DOCUMENTID", DbType.Int32, sizeof(Int32));

            if (transaction == null) db.ExecuteNonQuery(dbCmd);
            else db.ExecuteNonQuery(dbCmd, transaction);

            return Convert.ToInt32(db.GetParameterValue(dbCmd, ":DOCUMENTID").ToString());
        }

        public static bool InActivateDocumentsInfo(Database db, DbTransaction transaction, int siteID, int documnetID, int updatedBy, int updatedDate, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_DOCUMENTS SET FSTATUS='I',FUPDATEDBY=:UPDATEDBY,FUPDATEDON=:UPDATEDON,FUPDATEDTIME=:UPDATEDTIME ");
            sqlCmdBuilder.Append(" WHERE FDOCUMENTID=:DOCUMENTID AND FSITEID=:SITEID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":DOCUMENTID", DbType.Int32, documnetID);
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedDate);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);

            if (transaction != null)
                db.ExecuteNonQuery(dbCmd, transaction);
            else
                db.ExecuteNonQuery(dbCmd);
            return true;

        }

        public static bool CheckDocumentExist(Database db, DbTransaction transaction, int siteID, int documentID, string documentName, string referenceType, int referenceID)
        {
            IDataReader dataReaderCheck = null;
            try
            {
                bool isExists = false;
                StringBuilder sqlCmdBuilder = new StringBuilder();
                sqlCmdBuilder.Append(" SELECT FDOCUMENTID FROM LDB1_MAINT_DOCUMENTS ");
                sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FSTATUS='A' ");

                if (documentID > 0)
                    sqlCmdBuilder.Append(" AND FDOCUMENTID=:DOCUMENTID ");
                if (!string.IsNullOrEmpty(documentName))
                    sqlCmdBuilder.Append(" AND UPPER(FDOCUMENTNAME)=:DOCUMENTNAME AND FREF_TYPE=:REF_TYPE AND FREFERENCEID=:REFERENCEID ");

                DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
                dbCmd.CommandType = CommandType.Text;

                db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
                if (documentID > 0)
                    db.AddInParameter(dbCmd, ":DOCUMENTID", DbType.Int32, documentID);
                if (!string.IsNullOrEmpty(documentName))
                {
                    db.AddInParameter(dbCmd, ":DOCUMENTNAME", DbType.String, documentName.Trim().ToUpper());
                    db.AddInParameter(dbCmd, ":REF_TYPE", DbType.AnsiString, referenceType.Trim());
                    db.AddInParameter(dbCmd, ":REFERENCEID", DbType.Int32, referenceID);
                }

                using (dataReaderCheck = db.ExecuteReader(dbCmd, transaction))
                {
                    if (dataReaderCheck.Read())
                    {
                        isExists = true;
                    }
                    dataReaderCheck.Close();
                }
                dataReaderCheck.Close();

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

        public static IDataReader CheckDocumentExistFromExcel(Database db, DbTransaction transaction, int siteID, string documentName, char documentType, string referenceType, int referenceID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FDOCUMENTID FROM LDB1_MAINT_DOCUMENTS ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FREFERENCEID=:REFERENCEID AND FDOCUMENTTYPE=:DOCUMENTTYPE AND FREF_TYPE=:REF_TYPE AND FSTATUS='A' ");
            sqlCmdBuilder.Append(" AND UPPER(FDOCUMENTNAME) Like :DOCUMENTNAME ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":DOCUMENTNAME", DbType.String, "%" + documentName.Trim().ToUpper());
            db.AddInParameter(dbCmd, ":DOCUMENTTYPE", DbType.AnsiStringFixedLength, documentType);
            db.AddInParameter(dbCmd, ":REF_TYPE", DbType.AnsiString, referenceType.Trim());
            db.AddInParameter(dbCmd, ":REFERENCEID", DbType.Int32, referenceID);

            return db.ExecuteReader(dbCmd, transaction);
        }

        public static string GetDocumentName(Database db, int siteID, int documentID)
        {
            IDataReader dataReaderCheck = null;
            try
            {
                StringBuilder sqlCmdBuilder = new StringBuilder();
                sqlCmdBuilder.Append(" SELECT FDOCUMENTID,FDOCUMENTNAME FROM LDB1_MAINT_DOCUMENTS ");
                sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FDOCUMENTID=:DOCUMENTID AND FSTATUS='A' ");

                DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
                dbCmd.CommandType = CommandType.Text;

                db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
                db.AddInParameter(dbCmd, ":DOCUMENTID", DbType.Int32, documentID);

                string documentName = string.Empty;
                using (dataReaderCheck = db.ExecuteReader(dbCmd))
                {
                    if (dataReaderCheck.Read())
                    {
                        documentName = dataReaderCheck.GetString(dataReaderCheck.GetOrdinal("FDOCUMENTNAME"));
                    }
                    dataReaderCheck.Close();
                }
                dataReaderCheck.Close();

                return documentName;
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

        #region Master Category,Class,Manufacturer,Equipment Type Info
        public static int InsertMaintMasterData(Database db, DbTransaction transaction, int siteID, string name, string type, string description, int createdBy, int createdOn, int createdTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" INSERT INTO LDB1_MAINT_MASTER (FMASTERID,FSITEID,FNAME,FDESCRIPTION,FTYPE,FCREATEDBY,FCREATEDON,FCREATEDTIME,FUPDATEDBY,FUPDATEDON,FUPDATEDTIME) ");
            sqlCmdBuilder.Append(" VALUES(SEQUENCE_MAINTMASTER_ID.NEXTVAL,:SITEID,:NAME,:DESCRIPTION,:TYPE,:CREATEDBY,:CREATEDON,:CREATEDTIME,:CREATEDBY,:CREATEDON,:CREATEDTIME) ");
            sqlCmdBuilder.Append(" RETURNING FMASTERID INTO :MASTERID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":NAME", DbType.String, name);
            db.AddInParameter(dbCmd, ":DESCRIPTION", DbType.String, description.Trim());
            db.AddInParameter(dbCmd, ":TYPE", DbType.AnsiString, type.Trim());
            db.AddInParameter(dbCmd, ":CREATEDBY", DbType.Int32, createdBy);
            db.AddInParameter(dbCmd, ":CREATEDON", DbType.Int32, createdOn);
            db.AddInParameter(dbCmd, ":CREATEDTIME", DbType.Int32, createdTime);
            db.AddOutParameter(dbCmd, ":MASTERID", DbType.Int32, sizeof(Int32));

            if (transaction == null) db.ExecuteNonQuery(dbCmd);
            else db.ExecuteNonQuery(dbCmd, transaction);

            return Convert.ToInt32(db.GetParameterValue(dbCmd, ":MASTERID").ToString());
        }

        public static bool UpdateMaintMasterData(Database db, DbTransaction transaction, int siteID, int masterID, string name, string type, string description, int updatedBy, int updatedOn, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_MASTER SET FNAME=:NAME,FDESCRIPTION=:DESCRIPTION,FSTATUS='A', ");
            sqlCmdBuilder.Append(" FUPDATEDBY=:UPDATEDBY,FUPDATEDON=:UPDATEDON,FUPDATEDTIME=:UPDATEDTIME WHERE FMASTERID=:MASTERID AND FSITEID=:SITEID AND FTYPE=:TYPE ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":MASTERID", DbType.Int32, masterID);
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":NAME", DbType.String, name);
            db.AddInParameter(dbCmd, ":DESCRIPTION", DbType.String, description.Trim());
            db.AddInParameter(dbCmd, ":TYPE", DbType.AnsiString, type.Trim());
            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedOn);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);

            if (transaction != null)
                db.ExecuteNonQuery(dbCmd, transaction);
            else
                db.ExecuteNonQuery(dbCmd);

            return true;
        }
        public static bool DeleteMaintMasterData(Database db, DbTransaction transaction, int siteID, int masterID, int updatedBy, int updatedOn, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_MASTER SET FSTATUS='I',FUPDATEDBY=:UPDATEDBY,FUPDATEDON=:UPDATEDON,FUPDATEDTIME=:UPDATEDTIME WHERE FMASTERID=:MASTERID AND FSITEID=:SITEID ");
            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":MASTERID", DbType.Int32, masterID);
            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedOn);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);

            if (transaction != null)
                db.ExecuteNonQuery(dbCmd, transaction);
            else
                db.ExecuteNonQuery(dbCmd);
            return true;
        }

        public static int GetMaintMasterID(Database db, DbTransaction transaction, int siteID, int masterID, string name, string type, out string status)
        {
            int maintMasterDBID = 0;
            status = "I";
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FMASTERID,FSTATUS ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_MASTER WHERE UPPER(FNAME) =:NAME AND FTYPE=:TYPE ");
            if (masterID > 0)
            {
                sqlCmdBuilder.Append(" AND FMASTERID<>:MASTERID AND FSTATUS='A' ");
            }
            sqlCmdBuilder.Append(" AND FSITEID=:SITEID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":NAME", DbType.String, name.Trim().ToUpper());
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":TYPE", DbType.AnsiString, type.Trim());
            if (masterID > 0)
            {
                db.AddInParameter(dbCmd, ":MASTERID", DbType.Int32, masterID);
            }

            DataTable measuringPointInfo;
            if (transaction != null)
                measuringPointInfo = db.ExecuteDataSet(dbCmd, transaction).Tables[0];
            else
                measuringPointInfo = db.ExecuteDataSet(dbCmd).Tables[0];
            if (measuringPointInfo.Rows.Count > 0)
            {
                int.TryParse(measuringPointInfo.Rows[0]["FMASTERID"].ToString(), out maintMasterDBID);
                status = measuringPointInfo.Rows[0]["FSTATUS"].ToString();
            }
            return maintMasterDBID;
        }

        public static IDataReader GetMaintMasterData(Database db, int siteID, string masterName, string type, int pageSize, int pageIndex, string sortType)
        {
            StringBuilder sqlCommandBuilder = new StringBuilder();
            sqlCommandBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT ");
            sqlCommandBuilder.Append(" FROM ( SELECT FMASTERID,FNAME,FDESCRIPTION  ");
            sqlCommandBuilder.Append(" FROM LDB1_MAINT_MASTER WHERE FSITEID=:SITEID AND FSTATUS='A' ");
            if (!string.IsNullOrEmpty(masterName))
            {
                sqlCommandBuilder.Append(" AND UPPER(FNAME) LIKE :NAME ");
            }
            sqlCommandBuilder.Append(" AND FTYPE=:TYPE ");

            #region Sorting
            switch (sortType)
            {
                case "MasterDataName_asc":
                    sqlCommandBuilder.Append(" ORDER BY UPPER(FNAME) ASC ");
                    break;
                case "MasterDataName_desc":
                    sqlCommandBuilder.Append(" ORDER BY UPPER(FNAME) DESC ");
                    break;
                default:
                    sqlCommandBuilder.Append(" ORDER BY FUPDATEDON DESC, FUPDATEDTIME DESC ");
                    break;
            }
            #endregion

            if (pageSize > 0)
            {
                if (pageIndex != 0)
                    sqlCommandBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:PAGEINDEX)  AND (:PAGESIZE + (:PAGEINDEX - 1))");
                else
                    sqlCommandBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:PAGEINDEX)  AND  (:PAGESIZE + (:PAGEINDEX))");
            }
            else
            {
                sqlCommandBuilder.Append(" ) B ) ");
            }

            DbCommand dbCommand = db.GetSqlStringCommand(sqlCommandBuilder.ToString());
            dbCommand.CommandType = CommandType.Text;
            db.AddInParameter(dbCommand, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCommand, ":TYPE", DbType.AnsiString, type.Trim());

            if (pageSize > 0)
            {
                db.AddInParameter(dbCommand, ":PAGEINDEX", DbType.Int32, pageIndex);
                db.AddInParameter(dbCommand, ":PAGESIZE", DbType.Int32, pageSize);
            }
            if (!string.IsNullOrEmpty(masterName))
            {
                db.AddInParameter(dbCommand, ":NAME", DbType.String, "%" + masterName.Trim().ToUpper() + "%");
            }

            return db.ExecuteReader(dbCommand);
        }

        public static bool CheckMasterDataExistInEquipmentTable(Database db, DbTransaction transaction, int siteID, int masterID)
        {
            IDataReader dataReaderCheck = null;
            try
            {
                StringBuilder sqlCmdBuilder = new StringBuilder();
                sqlCmdBuilder.Append(" SELECT FEQUIPMENTID FROM LDB1_MAINT_EQUIPMENT ");
                sqlCmdBuilder.Append(" WHERE (FMANUFID=:MASTERID OR FCATEGORYID=:MASTERID OR FCLASSID=:MASTERID) AND FSITEID=:SITEID AND FSTATUS='A' ");

                DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
                dbCmd.CommandType = CommandType.Text;

                db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
                db.AddInParameter(dbCmd, ":MASTERID", DbType.Int32, masterID);

                bool isExists = false;
                using (dataReaderCheck = transaction != null ? db.ExecuteReader(dbCmd, transaction) : db.ExecuteReader(dbCmd))
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

        public static IDataReader GetSelectionGroupItems(Database db, int siteID, int masterID, string type)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT S.FDISPLAYNAME FROM LDB1_MAINT_SELGRP_CODE S ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_MASTER M ON M.FMASTERID=S.FMASTERID AND M.FSITEID=S.FSITEID AND M.FSTATUS='A' AND M.FTYPE=:TYPE AND S.FSTATUS='A'");
            sqlCmdBuilder.Append(" WHERE S.FMASTERID=:MASTERID ");
            sqlCmdBuilder.Append(" AND M.FTYPE=:TYPE AND S.FSITEID=:SITEID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":MASTERID", DbType.Int32, masterID);
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":TYPE", DbType.AnsiString, type.Trim());

            return db.ExecuteReader(dbCmd);
        }

        public static bool CheckMasterDataExistsInMeasuringPointTable(Database db, DbTransaction transaction, int siteID, int masterID)
        {
            IDataReader dataReaderCheck = null;
            try
            {
                StringBuilder sqlCmdBuilder = new StringBuilder();
                sqlCmdBuilder.Append(" SELECT FMEASURINGPOINTID FROM LDB1_MAINT_MEASURINGPOINT ");
                sqlCmdBuilder.Append(" WHERE (FCATEGORYID=:MASTERID OR FGROUPID=:MASTERID) AND FSITEID=:SITEID AND FSTATUS='A' ");

                DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
                dbCmd.CommandType = CommandType.Text;

                db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
                db.AddInParameter(dbCmd, ":MASTERID", DbType.Int32, masterID);

                bool isExists = false;
                using (dataReaderCheck = transaction != null ? db.ExecuteReader(dbCmd, transaction) : db.ExecuteReader(dbCmd))
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

        public static int GetSelectionGroupMaxItemID(Database db, DbTransaction transaction, int masterID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();

            sqlCmdBuilder.Append(" SELECT NVL(MAX(FITEMID),0) + 1 AS MAXITEMID ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_SELGRP_CODE  WHERE FMASTERID =:MASTERID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":MASTERID", DbType.Int32, masterID);

            if (transaction != null)
                return Convert.ToInt32(db.ExecuteScalar(dbCmd, transaction).ToString());
            else
                return Convert.ToInt32(db.ExecuteScalar(dbCmd).ToString());
        }

        public static bool InsertSelectionGroupItemInfo(Database db, DbTransaction transaction, int siteID, string itemName, int itemID, int masterID, int createdBy, int createdDate, int createdTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" INSERT INTO LDB1_MAINT_SELGRP_CODE(FMASTERID,FITEMID,FDISPLAYNAME,FSITEID,FCREATEDBY,FCREATEDDATE,FCREATEDTIME,FUPDATEDBY,FUPDATEDON,FUPDATEDTIME) ");
            sqlCmdBuilder.Append(" VALUES(:MASTERID,:ITEMID,:DISPLAYNAME,:SITEID,:CREATEDBY,:CREATEDON,:CREATEDTIME,:CREATEDBY,:CREATEDON,:CREATEDTIME) ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":MASTERID", DbType.Int32, masterID);
            db.AddInParameter(dbCmd, ":ITEMID", DbType.Int32, itemID);
            db.AddInParameter(dbCmd, ":DISPLAYNAME", DbType.String, itemName.Trim());
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

        public static bool DeleteSelectionGroupItem(Database db, DbTransaction transaction, int siteID, int masterID, int updatedBy, int updatedOn, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_SELGRP_CODE SET FSTATUS='I',FUPDATEDBY=:UPDATEDBY,FUPDATEDON=:UPDATEDON,FUPDATEDTIME=:UPDATEDTIME");
            sqlCmdBuilder.Append(" WHERE FMASTERID=:MASTERID AND FSITEID=:SITEID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":MASTERID", DbType.Int32, masterID);
            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedOn);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);

            if (transaction != null)
                db.ExecuteNonQuery(dbCmd, transaction);
            else
                db.ExecuteNonQuery(dbCmd);

            return true;
        }

        public static bool UpdateMasterDataStatus(Database db, DbTransaction transaction, int siteID, int masterID, char status, int updatedBy, int updatedDate, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_MASTER SET FSTATUS=:STATUS,FUPDATEDBY=:UPDATEDBY,FUPDATEDON=:UPDATEDON,FUPDATEDTIME=:UPDATEDTIME ");
            sqlCmdBuilder.Append(" WHERE FMASTERID=:MASTERID AND FSITEID=:SITEID  ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":MASTERID", DbType.Int32, masterID);
            db.AddInParameter(dbCmd, ":STATUS", DbType.AnsiStringFixedLength, status);
            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedDate);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);

            if (transaction != null)
                db.ExecuteNonQuery(dbCmd, transaction);
            else
                db.ExecuteNonQuery(dbCmd);

            return true;
        }

        public static bool CheckMasterDataExistInTaskGroupTable(Database db, DbTransaction transaction, int siteID, int masterID)
        {
            IDataReader dataReaderCheck = null;
            try
            {
                StringBuilder sqlCmdBuilder = new StringBuilder();
                sqlCmdBuilder.Append(" SELECT FTASKGROUPID FROM LDB1_MAINT_TASKGROUP ");
                sqlCmdBuilder.Append(" WHERE FTASKGROUPTYPEID=:MASTERID AND FSITEID=:SITEID AND FSTATUS <>'I' ");

                DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
                dbCmd.CommandType = CommandType.Text;

                db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
                db.AddInParameter(dbCmd, ":MASTERID", DbType.Int32, masterID);

                bool isExists = false;
                using (dataReaderCheck = transaction != null ? db.ExecuteReader(dbCmd, transaction) : db.ExecuteReader(dbCmd))
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

        public static bool CheckMasterDataExistInScheduleTable(Database db, DbTransaction transaction, int siteID, int masterID)
        {
            IDataReader dataReaderCheck = null;
            try
            {
                StringBuilder sqlCmdBuilder = new StringBuilder();
                sqlCmdBuilder.Append(" SELECT FSCHEDULEID FROM LDB1_MAINT_SCHEDULE ");
                sqlCmdBuilder.Append(" WHERE FMAINTYPEID=:MAINTYPEID AND FSITEID=:SITEID AND FSTATUS ='A' ");

                DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
                dbCmd.CommandType = CommandType.Text;

                db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
                db.AddInParameter(dbCmd, ":MAINTYPEID", DbType.Int32, masterID);

                bool isExists = false;
                using (dataReaderCheck = transaction != null ? db.ExecuteReader(dbCmd, transaction) : db.ExecuteReader(dbCmd))
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
        public static bool CheckWorkGroupLinkToSchedule(Database db, DbTransaction transaction, int siteID, int workGroupID)
        {
            IDataReader dataReaderCheck = null;
            bool isExists = false;
            try
            {
                StringBuilder sqlCmdBuilder = new StringBuilder();
                sqlCmdBuilder.Append(" SELECT MS.FSCHEDULEID FROM LDB1_MAINT_SCHEDULE MS ");
                sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_MEAS_DOCS MD ON MD.FSCHEDULEID=MS.FSCHEDULEID AND MD.FSITEID=MS.FSITEID ");
                sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_MEASURINGPOINT MP ON MP.FMEASURINGPOINTID=MD.FMEASURINGPOINTID ");
                sqlCmdBuilder.Append(" AND MP.FSITEID=MS.FSITEID AND MP.FSTATUS='A' AND MP.FPARENTID>0 AND MP.FPARENTTYPE IN ('L','E') ");
                sqlCmdBuilder.Append(" WHERE MS.FSITEID=:SITEID AND MS.FSTATUS='A' AND MS.FWORKGROUPID=:WORKGROUPID ");

                DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
                dbCmd.CommandType = CommandType.Text;

                db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
                db.AddInParameter(dbCmd, ":WORKGROUPID", DbType.Int32, workGroupID);


                using (dataReaderCheck = transaction != null ? db.ExecuteReader(dbCmd, transaction) : db.ExecuteReader(dbCmd))
                {
                    if (dataReaderCheck.Read())
                    {
                        isExists = true;
                    }
                    dataReaderCheck.Close();
                }

                return isExists;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (dataReaderCheck != null && !dataReaderCheck.IsClosed)
                    dataReaderCheck.Close();
            }
        }

        #endregion

        #region Task Group Info

        #region TaskGroup
        public static IDataReader GetTaskGroupInfo(Database db, DbTransaction transaction, int siteID, int identifierID, int versionNumber, bool isApproved)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FTASKGROUPID,FVERSION,FTASKGROUPNAME,FTASKGROUPTYPEID,FSTATUS ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_TASKGROUP WHERE FIDENTIFIER =:IDENTIFIER AND FSITEID=:SITEID AND FSTATUS<>'I' ");
            if (versionNumber > 0)
                sqlCmdBuilder.Append(" AND FVERSION=:VERSION ");
            if (isApproved)
                sqlCmdBuilder.Append(" AND FSTATUS='A' ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":IDENTIFIER", DbType.Int32, identifierID);
            if (versionNumber > 0)
                db.AddInParameter(dbCmd, ":VERSION", DbType.Int32, versionNumber);

            if (transaction != null)
            {
                return db.ExecuteReader(dbCmd, transaction);
            }
            else
            {
                return db.ExecuteReader(dbCmd);
            }
        }

        public static int GetNextIdentifierID(Database db)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT SEQUENCE_MAINT_TASKGRP_IDENTID.NEXTVAL AS FIDENTIFIERID FROM DUAL ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            string identifierID = string.Empty;
            identifierID = Convert.ToString(db.ExecuteScalar(dbCmd));

            return Convert.ToInt32(identifierID);
        }

        public static bool CheckTaskGroupNameExists(Database db, DbTransaction transaction, int siteID, string taskGroupName, int identifierID)
        {
            IDataReader dataReader = null;
            bool isExists = false;

            try
            {
                StringBuilder sqlCmdBuilder = new StringBuilder();
                sqlCmdBuilder.Append(" SELECT FTASKGROUPID FROM LDB1_MAINT_TASKGROUP ");
                sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND UPPER(FTASKGROUPNAME)=:TASKGROUPNAME  AND FSTATUS<>'I' AND FREF_TYPE='TASK' ");

                if (identifierID > 0)
                {
                    sqlCmdBuilder.Append(" AND FIDENTIFIER<>:IDENTIFIER ");
                }

                DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
                dbCmd.CommandType = CommandType.Text;

                db.AddInParameter(dbCmd, ":TASKGROUPNAME", DbType.String, taskGroupName.Trim().ToUpper());
                db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
                if (identifierID > 0)
                {
                    db.AddInParameter(dbCmd, ":IDENTIFIER", DbType.Int32, identifierID);
                }
                if (transaction != null)
                {
                    dataReader = db.ExecuteReader(dbCmd, transaction);
                }
                else
                {
                    dataReader = db.ExecuteReader(dbCmd);
                }
                if (dataReader.Read())
                {
                    isExists = true;
                }
                dataReader.Close();


                return isExists;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (dataReader != null && !dataReader.IsClosed)
                    dataReader.Close();
            }
        }

        public static int GetTaskGroupVersion(Database db, DbTransaction transaction, int siteID, string taskGroupName, out int seletedIdentifier)
        {
            IDataReader dataReader = null;
            int versionNumber = 0;
            seletedIdentifier = 0;
            try
            {
                StringBuilder sqlCmdBuilder = new StringBuilder();
                sqlCmdBuilder.Append(" SELECT FIDENTIFIER,MAX(FVERSION)  FROM LDB1_MAINT_TASKGROUP ");
                sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND UPPER(FTASKGROUPNAME)=:TASKGROUPNAME  AND FSTATUS<>'I' AND FREF_TYPE='TASK' ");
                sqlCmdBuilder.Append(" GROUP BY FIDENTIFIER ");

                DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
                dbCmd.CommandType = CommandType.Text;

                db.AddInParameter(dbCmd, ":TASKGROUPNAME", DbType.String, taskGroupName.Trim().ToUpper());
                db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

                if (transaction != null)
                {
                    dataReader = db.ExecuteReader(dbCmd, transaction);
                }
                else
                {
                    dataReader = db.ExecuteReader(dbCmd);
                }
                if (dataReader.Read())
                {
                    seletedIdentifier = dataReader.GetInt32(0);
                    versionNumber = dataReader.GetInt32(1);
                }
                dataReader.Close();


                return versionNumber;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (dataReader != null && !dataReader.IsClosed)
                    dataReader.Close();
            }
        }
        public static int InsertTaskGroupInfo(Database db, DbTransaction transaction, int siteID, string taskGroupName, int taskGroupTypeID, int identifierID, int versionID, char taskStatus, string taskGroupRefType, int referenceID, int createdBy, int createdDate, int createdTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" INSERT INTO LDB1_MAINT_TASKGROUP(FTASKGROUPID,FTASKGROUPNAME,FTASKGROUPTYPEID,FVERSION,FIDENTIFIER,FSITEID,FSTATUS,FREF_TYPE,FREFERENCEID,FCREATEDBY,FCREATEDON,FCREATEDTIME,FUPDATEDBY,FUPDATEDON,FUPDATEDTIME) ");
            sqlCmdBuilder.Append(" VALUES(SEQUENCE_MAINT_TASKGRP_ID.NEXTVAL,:TASKGROUPNAME,:TASKGROUPTYPEID,:VERSION,:IDENTIFIER,:SITEID,:TASKSTATUS,:REF_TYPE,:REFERENCEID,:CREATEDBY,:CREATEDON,:CREATEDTIME,:CREATEDBY,:CREATEDON,:CREATEDTIME) ");
            sqlCmdBuilder.Append(" RETURNING FTASKGROUPID INTO :TASKGROUPID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":TASKGROUPNAME", DbType.String, taskGroupName.Trim());
            db.AddInParameter(dbCmd, ":TASKGROUPTYPEID", DbType.Int32, taskGroupTypeID);
            db.AddInParameter(dbCmd, ":VERSION", DbType.Int32, versionID);
            db.AddInParameter(dbCmd, ":IDENTIFIER", DbType.Int32, identifierID);
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":TASKSTATUS", DbType.AnsiStringFixedLength, taskStatus);
            db.AddInParameter(dbCmd, ":REF_TYPE", DbType.AnsiString, taskGroupRefType);
            db.AddInParameter(dbCmd, ":REFERENCEID", DbType.Int32, referenceID);
            db.AddInParameter(dbCmd, ":CREATEDBY", DbType.Int32, createdBy);
            db.AddInParameter(dbCmd, ":CREATEDON", DbType.Int32, createdDate);
            db.AddInParameter(dbCmd, ":CREATEDTIME", DbType.Int32, createdTime);

            db.AddOutParameter(dbCmd, ":TASKGROUPID", DbType.Int32, sizeof(Int32));

            if (transaction != null)
            {
                db.ExecuteNonQuery(dbCmd, transaction);
            }
            else
            {
                db.ExecuteNonQuery(dbCmd);
            }


            int taskGroupID = Convert.ToInt32(Convert.ToString(db.GetParameterValue(dbCmd, ":TASKGROUPID")));

            return taskGroupID;
        }

        public static bool UpdateTaskGroupInfo(Database db, DbTransaction transaction, int siteID, int taskGroupID, string taskGroupName, int taskGroupTypeID, int updatedby, int updatedOn, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_TASKGROUP SET FTASKGROUPNAME=:TASKGROUPNAME, FTASKGROUPTYPEID=:TASKGROUPTYPEID, FUPDATEDBY=:UPDATEDBY, FUPDATEDON=:UPDATEDON, FUPDATEDTIME=:UPDATEDTIME ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FTASKGROUPID=:TASKGROUPID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":TASKGROUPNAME", DbType.String, taskGroupName.Trim());
            db.AddInParameter(dbCmd, ":TASKGROUPTYPEID", DbType.Int32, taskGroupTypeID);
            db.AddInParameter(dbCmd, ":TASKGROUPID", DbType.Int32, taskGroupID);
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedby);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedOn);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);

            if (transaction != null)
            {
                db.ExecuteNonQuery(dbCmd, transaction);
            }
            else
            {
                db.ExecuteNonQuery(dbCmd);
            }

            return true;
        }

        public static bool SetTaskGroupStatus(Database db, DbTransaction transaction, int siteID, int taskGroupID, char status, int updatedby, int updatedOn, int updatedTime, bool isApproved)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_TASKGROUP SET FSTATUS=:STATUS, FUPDATEDBY=:UPDATEDBY, FUPDATEDON=:UPDATEDON, FUPDATEDTIME=:UPDATEDTIME ");

            if (isApproved)
            {
                sqlCmdBuilder.Append(" ,FAPPROVEDBY=:UPDATEDBY, FAPPROVEDON=:UPDATEDON, FAPPROVEDTIME=:UPDATEDTIME  ");
            }
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FTASKGROUPID=:TASKGROUPID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":TASKGROUPID", DbType.Int32, taskGroupID);
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":STATUS", DbType.AnsiStringFixedLength, status);
            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedby);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedOn);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);

            db.ExecuteNonQuery(dbCmd, transaction);

            return true;
        }
        
        public static int GetPendingWorkOrderCount(Database db, int siteID, int identifierID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT COUNT(WO.FWORK_ORDERID) AS TOTALORDER FROM LDB1_MAINT_WORKORDER WO ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_SCHEDULE MS ON MS.FSCHEDULEID=WO.FREF_SCHEDULEID AND MS.FSITEID=WO.FSITEID AND MS.FTASKGROUPIDENTIFIER=:IDENTIFIER ");
            sqlCmdBuilder.Append(" WHERE WO.FSITEID=:SITEID AND WO.FWORKORDERSTATUS IN ('SCHEDULED','INPROGRESS') AND ROWNUM=1 ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":IDENTIFIER", DbType.Int32, identifierID);

            return Convert.ToInt32(db.ExecuteScalar(dbCmd));
        }
        #endregion

        #region Tasks
        public static IDataReader GetTaskInfo(Database db, DbTransaction transaction, int taskGroupID, int taskID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FTASKID,FTASKNAME,FDESCRIPTION,FSAFETYDESCRIPTION,FESTIMATEDTIME,FUNIT,FREMARKENABLED ");
            sqlCmdBuilder.Append(" , FREMARKMANDATORY, FPICTUREENABLED, FPICTUREMANDATORY, FSEQUENCENUM ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_TASKS ");
            sqlCmdBuilder.Append(" WHERE FREFERENCEID = :REFERENCEID AND FSTATUS='A' ");
            if (taskID > 0)
                sqlCmdBuilder.Append(" AND FTASKID=:TASKID ");
            sqlCmdBuilder.Append(" ORDER BY FSEQUENCENUM ASC ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":REFERENCEID", DbType.Int32, taskGroupID);
            if (taskID > 0)
                db.AddInParameter(dbCmd, ":TASKID", DbType.Int32, taskID);
            if (transaction != null)
            {
                return db.ExecuteReader(dbCmd, transaction);
            }
            else
            {
                return db.ExecuteReader(dbCmd);
            }

        }
        public static IDataReader GetTaskListInfo(Database db, DbTransaction transaction, int siteID, int taskGroupID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FTASKID, FTASKNAME, FSEQUENCENUM");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_TASKS WHERE FREFERENCEID=:TASKGROUPID AND FSITEID=:SITEID AND FSTATUS='A' ORDER BY FSEQUENCENUM ASC ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":TASKGROUPID", DbType.Int32, taskGroupID);

            if (transaction != null)
            {
                return db.ExecuteReader(dbCmd, transaction);
            }
            else
            {
                return db.ExecuteReader(dbCmd);
            }
        }
        public static bool CheckTaskNameExists(Database db, DbTransaction transaction, int taskGroupID, int taskID, string taskName)
        {
            IDataReader dataReaderTaskName = null;
            bool isExists = false;

            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FTASKID FROM LDB1_MAINT_TASKS ");
            sqlCmdBuilder.Append(" WHERE UPPER(FTASKNAME)=:TASKNAME AND FREFERENCEID=:REFERENCEID AND FSTATUS='A' ");

            if (taskID > 0)
                sqlCmdBuilder.Append(" AND FTASKID <> :TASKID ");
            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":REFERENCEID", DbType.Int32, taskGroupID);
            db.AddInParameter(dbCmd, ":TASKNAME", DbType.String, taskName.Trim().ToUpper());
            if (taskID > 0)
                db.AddInParameter(dbCmd, ":TASKID", DbType.Int32, taskID);
            try
            {
                using (dataReaderTaskName = db.ExecuteReader(dbCmd, transaction))
                {
                    if (dataReaderTaskName.Read())
                    {
                        isExists = true;
                    }
                    dataReaderTaskName.Close();
                }

                return isExists;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (dataReaderTaskName != null && !dataReaderTaskName.IsClosed)
                    dataReaderTaskName.Close();
            }
        }

        public static int InsertTaskInfo(Database db, DbTransaction transaction, int siteID, int taskGroupID, string taskName, string description, string safetyDescription, double estimateTime,
            char unit, bool remarkEnabled, bool isRemarkMandatory, bool pictureEnabled, bool isPictureMandatory, int sequenceNum, int createdBy, int createdDate, int createdTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" INSERT INTO LDB1_MAINT_TASKS (FTASKID,FREFERENCEID,FTASKNAME,FDESCRIPTION,FSAFETYDESCRIPTION,FESTIMATEDTIME,FUNIT ");
            sqlCmdBuilder.Append(" ,FREMARKENABLED,FREMARKMANDATORY,FPICTUREENABLED,FPICTUREMANDATORY,FSEQUENCENUM,FCREATEDON,FCREATEDTIME,FCREATEDBY,FUPDATEDON,FUPDATEDTIME,FUPDATEDBY,FSITEID) ");
            sqlCmdBuilder.Append(" VALUES (SEQUENCE_MAINT_TASKS.NEXTVAL,:REFERENCEID,:TASKNAME,:DESCRIPTION,:SAFETYDESCRIPTION,:ESTIMATEDTIME,:UNIT ");
            sqlCmdBuilder.Append(" ,:REMARKENABLED,:REMARKMANDATORY,:PICTUREENABLED,:PICTUREMANDATORY,:SEQUENCENUM,:CREATEDON,:CREATEDTIME,:CREATEDBY,:CREATEDON,:CREATEDTIME,:CREATEDBY,:SITEID) ");
            sqlCmdBuilder.Append(" RETURNING FTASKID INTO :TASKID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":REFERENCEID", DbType.Int32, taskGroupID);
            db.AddInParameter(dbCmd, ":TASKNAME", DbType.String, taskName.Trim());
            db.AddInParameter(dbCmd, ":DESCRIPTION", DbType.String, description.Trim());
            db.AddInParameter(dbCmd, ":SAFETYDESCRIPTION", DbType.String, safetyDescription.Trim());
            db.AddInParameter(dbCmd, ":ESTIMATEDTIME", DbType.Int64, Convert.ToInt64(estimateTime));
            db.AddInParameter(dbCmd, ":UNIT", DbType.AnsiStringFixedLength, unit);
            db.AddInParameter(dbCmd, ":REMARKENABLED", DbType.AnsiStringFixedLength, remarkEnabled ? 'Y' : 'N');
            db.AddInParameter(dbCmd, ":REMARKMANDATORY", DbType.AnsiStringFixedLength, isRemarkMandatory ? 'Y' : 'N');
            db.AddInParameter(dbCmd, ":PICTUREENABLED", DbType.AnsiStringFixedLength, pictureEnabled ? 'Y' : 'N');
            db.AddInParameter(dbCmd, ":PICTUREMANDATORY", DbType.AnsiStringFixedLength, isPictureMandatory ? 'Y' : 'N');
            db.AddInParameter(dbCmd, ":SEQUENCENUM", DbType.Int32, sequenceNum);
            db.AddInParameter(dbCmd, ":CREATEDBY", DbType.Int32, createdBy);
            db.AddInParameter(dbCmd, ":CREATEDON", DbType.Int32, createdDate);
            db.AddInParameter(dbCmd, ":CREATEDTIME", DbType.Int32, createdTime);
            db.AddOutParameter(dbCmd, ":TASKID", DbType.Int32, sizeof(Int32));

            db.ExecuteNonQuery(dbCmd, transaction);

            int taskID = Convert.ToInt32(Convert.ToString(db.GetParameterValue(dbCmd, ":TASKID")));
            return taskID;
        }

        public static bool UpdateTaskInfo(Database db, DbTransaction transaction, int taskID, int taskGroupID, string taskName, string description, string safetyDescription, double estimateTime,
           char unit, bool remarkEnabled, bool isRemarkMandatory, bool pictureEnabled, bool isPictureMandatory, int sequenceNum, int updatedBy, int updatedDate, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_TASKS SET FTASKNAME=:TASKNAME,FDESCRIPTION=:DESCRIPTION,FSAFETYDESCRIPTION=:SAFETYDESCRIPTION ");
            sqlCmdBuilder.Append(" ,FESTIMATEDTIME=:ESTIMATEDTIME,FUNIT=:UNIT,FREMARKENABLED=:REMARKENABLED,FREMARKMANDATORY=:REMARKMANDATORY,FPICTUREENABLED=:PICTUREENABLED ");
            sqlCmdBuilder.Append(" ,FPICTUREMANDATORY=:PICTUREMANDATORY,FSEQUENCENUM=:SEQUENCENUM,FUPDATEDON=:UPDATEDON,FUPDATEDTIME=:UPDATEDTIME,FUPDATEDBY=:UPDATEDBY ");
            sqlCmdBuilder.Append(" WHERE FTASKID=:TASKID  AND FREFERENCEID=:REFERENCEID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":TASKID", DbType.Int32, taskID);
            db.AddInParameter(dbCmd, ":REFERENCEID", DbType.Int32, taskGroupID);
            db.AddInParameter(dbCmd, ":TASKNAME", DbType.String, taskName.Trim());
            db.AddInParameter(dbCmd, ":DESCRIPTION", DbType.String, description.Trim());
            db.AddInParameter(dbCmd, ":SAFETYDESCRIPTION", DbType.String, safetyDescription.Trim());
            db.AddInParameter(dbCmd, ":ESTIMATEDTIME", DbType.Int64, Convert.ToInt64(estimateTime));
            db.AddInParameter(dbCmd, ":UNIT", DbType.AnsiStringFixedLength, unit);
            db.AddInParameter(dbCmd, ":REMARKENABLED", DbType.AnsiStringFixedLength, remarkEnabled ? 'Y' : 'N');
            db.AddInParameter(dbCmd, ":REMARKMANDATORY", DbType.AnsiStringFixedLength, isRemarkMandatory ? 'Y' : 'N');
            db.AddInParameter(dbCmd, ":PICTUREENABLED", DbType.AnsiStringFixedLength, pictureEnabled ? 'Y' : 'N');
            db.AddInParameter(dbCmd, ":PICTUREMANDATORY", DbType.AnsiStringFixedLength, isPictureMandatory ? 'Y' : 'N');
            db.AddInParameter(dbCmd, ":SEQUENCENUM", DbType.Int32, sequenceNum);
            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedDate);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);

            db.ExecuteNonQuery(dbCmd, transaction);

            return true;
        }

        public static bool UpdateTaskSequence(Database db, DbTransaction transaction, int taskID, int taskGroupID, int sequenceNum, int updatedBy, int updatedDate, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_TASKS SET FSEQUENCENUM=:SEQUENCENUM,FUPDATEDON=:UPDATEDON,FUPDATEDTIME=:UPDATEDTIME,FUPDATEDBY=:UPDATEDBY ");
            sqlCmdBuilder.Append(" WHERE FTASKID=:TASKID AND FREFERENCEID=:REFERENCEID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":TASKID", DbType.Int32, taskID);
            db.AddInParameter(dbCmd, ":REFERENCEID", DbType.Int32, taskGroupID);
            db.AddInParameter(dbCmd, ":SEQUENCENUM", DbType.Int32, sequenceNum);
            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedDate);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);

            db.ExecuteNonQuery(dbCmd, transaction);

            return true;
        }

        public static int GetNewVersionNumber(Database db, DbTransaction transaction, int identifierID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT MAX(FVERSION) ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_TASKGROUP WHERE FIDENTIFIER=:IDENTIFIER ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":IDENTIFIER", DbType.Int32, identifierID);

            string versionNumber = Convert.ToString(db.ExecuteScalar(dbCmd, transaction));
            return Convert.ToInt32(versionNumber);
        }

        public static int GetNewTaskID(Database db)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();

            sqlCmdBuilder.Append("  SELECT SEQUENCE_MAINT_TASKS.NEXTVAL FROM DUAL ");

            System.Data.Common.DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;
            return Convert.ToInt32(Convert.ToString(db.ExecuteScalar(dbCmd)));
        }
        public static bool CreateCopyOfTaskInfo(Database db, DbTransaction transaction, int taskGroupID, int newTaskGroupID, int taskId, int newTaskID, int createdBy, int createdDate, int createdTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" INSERT INTO LDB1_MAINT_TASKS (FTASKID,FREFERENCEID,FTASKNAME,FDESCRIPTION,FSAFETYDESCRIPTION,FESTIMATEDTIME,FUNIT ");
            sqlCmdBuilder.Append(" ,FREMARKENABLED,FREMARKMANDATORY,FPICTUREENABLED,FPICTUREMANDATORY,FSEQUENCENUM,FCREATEDON,FCREATEDTIME,FCREATEDBY,FUPDATEDON,FUPDATEDTIME,FUPDATEDBY,FSITEID) ");
            sqlCmdBuilder.Append(" SELECT :NEWTASKID,:NEWTASKGROUPID,FTASKNAME,FDESCRIPTION,FSAFETYDESCRIPTION,FESTIMATEDTIME,FUNIT ");
            sqlCmdBuilder.Append(" ,FREMARKENABLED,FREMARKMANDATORY,FPICTUREENABLED,FPICTUREMANDATORY,FSEQUENCENUM,:CREATEDON,:CREATEDTIME,:CREATEDBY,:CREATEDON,:CREATEDTIME,:CREATEDBY,FSITEID ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_TASKS ");
            sqlCmdBuilder.Append(" WHERE FREFERENCEID=:REFERENCEID ");
            sqlCmdBuilder.Append(" AND FTASKID =:TASKID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":NEWTASKID", DbType.Int32, newTaskID);
            db.AddInParameter(dbCmd, ":NEWTASKGROUPID", DbType.Int32, newTaskGroupID);
            db.AddInParameter(dbCmd, ":REFERENCEID", DbType.Int32, taskGroupID);
            db.AddInParameter(dbCmd, ":TASKID", DbType.Int32, taskId);
            db.AddInParameter(dbCmd, ":CREATEDBY", DbType.Int32, createdBy);
            db.AddInParameter(dbCmd, ":CREATEDON", DbType.Int32, createdDate);
            db.AddInParameter(dbCmd, ":CREATEDTIME", DbType.Int32, createdTime);

            db.ExecuteNonQuery(dbCmd, transaction);

            return true;
        }

        public static bool DeleteTaskInfo(Database db, DbTransaction transaction, int taskGroupID, int taskID, int updatedBy, int updatedOn, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_TASKS SET FSTATUS='I' ,FUPDATEDTIME=:UPDATEDTIME,FUPDATEDON=:UPDATEDON,FUPDATEDBY=:UPDATEDBY");
            sqlCmdBuilder.Append(" WHERE FREFERENCEID=:REFERENCEID ");

            if (taskID > 0)
                sqlCmdBuilder.Append(" AND FTASKID=:TASKID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":REFERENCEID", DbType.Int32, taskGroupID);
            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedOn);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);

            if (taskID > 0)
                db.AddInParameter(dbCmd, ":TASKID", DbType.Int32, taskID);

            db.ExecuteNonQuery(dbCmd, transaction);

            return true;
        }

        public static int GetTaskID(Database db, DbTransaction transaction, int taskGroupID, string taskName)
        {
            IDataReader dataReader= null;
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FTASKID ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_TASKS ");
            sqlCmdBuilder.Append(" WHERE FREFERENCEID = :REFERENCEID AND FSTATUS='A' ");
            sqlCmdBuilder.Append(" AND UPPER(FTASKNAME)=:TASKNAME ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":REFERENCEID", DbType.Int32, taskGroupID);
            db.AddInParameter(dbCmd, ":TASKNAME", DbType.String, taskName.Trim().ToUpper());
            int taskID = 0;
            using (dataReader = db.ExecuteReader(dbCmd, transaction))
            {
                if (dataReader.Read())
                {
                    taskID = dataReader.GetInt32(0);
                }
                dataReader.Close();
            }           
            return taskID;
        }
        #endregion

        #region Task PPE
        public static IDataReader GetTaskPPEInfo(Database db, int siteID, int taskID, int taskGroupID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT TP.FTASKPPEID,TP.FPPEID,PP.FPPEDESC,PP.FPPEIMAGENAME ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_TASKSPPE TP ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_PLANTPPE PP ON TP.FPPEID=PP.FPPEID AND PP.FSITEID=:SITEID ");
            sqlCmdBuilder.Append(" WHERE FTASKGROUPID=:TASKGROUPID ");
            sqlCmdBuilder.Append(" AND TP.FREFERENCEID = :REFERENCEID AND TP.FSTATUS='A' ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":TASKGROUPID", DbType.Int32, taskGroupID);
            db.AddInParameter(dbCmd, ":REFERENCEID", DbType.Int32, taskID);

            return db.ExecuteReader(dbCmd);
        }

        public static bool InsertTaskPPEInfo(Database db, DbTransaction transaction, int siteID, int taskNumber, int taskgroupID, int ppeID, int createdBy, int createdDate, int createdTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" INSERT INTO LDB1_MAINT_TASKSPPE (FTASKPPEID,FSITEID,FPPEID,FTASKGROUPID,FREFERENCEID,FCREATEDON,FCREATEDTIME,FCREATEDBY,FUPDATEDON,FUPDATEDTIME,FUPDATEDBY)");
            sqlCmdBuilder.Append(" VALUES (PK_MAINT_TASKPPE_ID.NEXTVAL,:SITEID,:PPEID,:TASKGROUPID,:REFERENCEID,:CREATEDON,:CREATEDTIME,:CREATEDBY,:CREATEDON,:CREATEDTIME,:CREATEDBY) ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":PPEID", DbType.Int32, ppeID);
            db.AddInParameter(dbCmd, ":TASKGROUPID", DbType.Int32, taskgroupID);
            db.AddInParameter(dbCmd, ":REFERENCEID", DbType.Int32, taskNumber);
            db.AddInParameter(dbCmd, ":CREATEDBY", DbType.Int32, createdBy);
            db.AddInParameter(dbCmd, ":CREATEDON", DbType.Int32, createdDate);
            db.AddInParameter(dbCmd, ":CREATEDTIME", DbType.Int32, createdTime);

            db.ExecuteNonQuery(dbCmd, transaction);

            return true;
        }

        public static bool CreateCopyOfTaskPPEInfo(Database db, DbTransaction transaction, int taskGroupID, int newTaskGroupID, int taskID, int newTaskID, int createdBy, int createdDate, int createdTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" INSERT INTO LDB1_MAINT_TASKSPPE (FTASKPPEID, FPPEID, FTASKGROUPID, FREFERENCEID, FCREATEDON, FCREATEDTIME, FCREATEDBY,FUPDATEDON,FUPDATEDTIME,FUPDATEDBY,FSITEID)");
            sqlCmdBuilder.Append(" SELECT PK_MAINT_TASKPPE_ID.NEXTVAL, FPPEID, :NEWTASKGROUPID, :NEWTASKID, :CREATEDON, :CREATEDTIME, :CREATEDBY,:CREATEDON, :CREATEDTIME, :CREATEDBY,FSITEID ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_TASKSPPE ");
            sqlCmdBuilder.Append(" WHERE FTASKGROUPID=:TASKGROUPID AND FREFERENCEID =:REFERENCEID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":NEWTASKGROUPID", DbType.Int32, newTaskGroupID);
            db.AddInParameter(dbCmd, ":TASKGROUPID", DbType.Int32, taskGroupID);
            db.AddInParameter(dbCmd, ":REFERENCEID", DbType.Int32, taskID);
            db.AddInParameter(dbCmd, ":NEWTASKID", DbType.Int32, newTaskID);
            db.AddInParameter(dbCmd, ":CREATEDBY", DbType.Int32, createdBy);
            db.AddInParameter(dbCmd, ":CREATEDON", DbType.Int32, createdDate);
            db.AddInParameter(dbCmd, ":CREATEDTIME", DbType.Int32, createdTime);

            db.ExecuteNonQuery(dbCmd, transaction);

            return true;
        }

        public static bool DeleteTaskPPEInfo(Database db, DbTransaction transaction, int taskGroupID, int taskID, string ppeNumberList, int updatedBy, int updatedOn, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_TASKSPPE SET FSTATUS='I',FUPDATEDTIME=:UPDATEDTIME,FUPDATEDON=:UPDATEDON,FUPDATEDBY=:UPDATEDBY ");
            sqlCmdBuilder.Append(" WHERE FTASKGROUPID=:TASKGROUPID  ");
            if (taskID > 0)
                sqlCmdBuilder.Append(" AND FREFERENCEID=:REFERENCEID ");

            if (ppeNumberList.Length > 0)
                sqlCmdBuilder.Append(" AND FTASKPPEID IN (" + ppeNumberList + ") ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":TASKGROUPID", DbType.Int32, taskGroupID);

            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedOn);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);

            if (taskID > 0)
                db.AddInParameter(dbCmd, ":REFERENCEID", DbType.Int32, taskID);

            db.ExecuteNonQuery(dbCmd, transaction);

            return true;
        }
        #endregion

        #region Task Tools
        public static bool InsertTaskToolsInfo(Database db, DbTransaction transaction, int siteID, int taskNumber, int taskgroupID, int toolsID, int createdBy, int createdDate, int createdTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" INSERT INTO LDB1_MAINT_TASKSTOOLS (FTASKTOOLSID,FSITEID,FTOOLSID,FTASKGROUPID,FREFERENCEID,FCREATEDON,FCREATEDTIME,FCREATEDBY,FUPDATEDON,FUPDATEDTIME,FUPDATEDBY)");
            sqlCmdBuilder.Append(" VALUES (PK_MAINT_TASKTOOLS_ID.NEXTVAL,:SITEID,:TOOLSID,:TASKGROUPID,:REFERENCEID,:CREATEDON,:CREATEDTIME,:CREATEDBY,:CREATEDON,:CREATEDTIME,:CREATEDBY) ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":TOOLSID", DbType.Int32, toolsID);
            db.AddInParameter(dbCmd, ":TASKGROUPID", DbType.Int32, taskgroupID);
            db.AddInParameter(dbCmd, ":REFERENCEID", DbType.Int32, taskNumber);
            db.AddInParameter(dbCmd, ":CREATEDBY", DbType.Int32, createdBy);
            db.AddInParameter(dbCmd, ":CREATEDON", DbType.Int32, createdDate);
            db.AddInParameter(dbCmd, ":CREATEDTIME", DbType.Int32, createdTime);

            db.ExecuteNonQuery(dbCmd, transaction);

            return true;
        }

        public static bool CreateCopyOfTaskToolsInfo(Database db, DbTransaction transaction, int taskGroupID, int newTaskGroupID, int taskID, int newTaskID, int createdBy, int createdDate, int createdTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" INSERT INTO LDB1_MAINT_TASKSTOOLS (FTASKTOOLSID, FTOOLSID, FTASKGROUPID,FREFERENCEID, FCREATEDON, FCREATEDTIME, FCREATEDBY,FUPDATEDON,FUPDATEDTIME,FUPDATEDBY,FSITEID)");
            sqlCmdBuilder.Append(" SELECT PK_MAINT_TASKTOOLS_ID.NEXTVAL, FTOOLSID, :NEWTASKGROUPID,:NEWTASKID, :CREATEDON, :CREATEDTIME, :CREATEDBY,:CREATEDON, :CREATEDTIME, :CREATEDBY,FSITEID ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_TASKSTOOLS ");
            sqlCmdBuilder.Append(" WHERE FTASKGROUPID=:TASKGROUPID ");
            sqlCmdBuilder.Append(" AND FREFERENCEID =:REFERENCEID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":NEWTASKGROUPID", DbType.Int32, newTaskGroupID);
            db.AddInParameter(dbCmd, ":TASKGROUPID", DbType.Int32, taskGroupID);
            db.AddInParameter(dbCmd, ":REFERENCEID", DbType.Int32, taskID);
            db.AddInParameter(dbCmd, ":NEWTASKID", DbType.Int32, newTaskID);
            db.AddInParameter(dbCmd, ":CREATEDBY", DbType.Int32, createdBy);
            db.AddInParameter(dbCmd, ":CREATEDON", DbType.Int32, createdDate);
            db.AddInParameter(dbCmd, ":CREATEDTIME", DbType.Int32, createdTime);

            db.ExecuteNonQuery(dbCmd, transaction);

            return true;
        }

        public static IDataReader GetTaskToolsInfo(Database db, int siteID, int taskID, int taskGroupID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT TL.FTASKTOOLSID,TL.FTOOLSID,T.FTOOLSDESC,T.FTOOLSIMAGENAME ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_TASKSTOOLS TL ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_TOOLS T ON T.FTOOLSID=TL.FTOOLSID AND T.FSITEID=:SITEID ");
            sqlCmdBuilder.Append(" WHERE TL.FTASKGROUPID=:TASKGROUPID ");
            sqlCmdBuilder.Append(" AND TL.FREFERENCEID = :REFERENCEID AND TL.FSTATUS='A' ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":TASKGROUPID", DbType.Int32, taskGroupID);
            db.AddInParameter(dbCmd, ":REFERENCEID", DbType.Int32, taskID);

            return db.ExecuteReader(dbCmd);
        }

        public static bool DeleteTaskToolsInfo(Database db, DbTransaction transaction, int taskGroupID, int taskID, string toolsNumberList, int updatedBy, int updatedOn, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_TASKSTOOLS SET FSTATUS='I',FUPDATEDTIME=:UPDATEDTIME,FUPDATEDON=:UPDATEDON,FUPDATEDBY=:UPDATEDBY ");
            sqlCmdBuilder.Append(" WHERE FTASKGROUPID=:TASKGROUPID ");
            if (taskID > 0)
                sqlCmdBuilder.Append("  AND FREFERENCEID=:REFERENCEID ");

            if (toolsNumberList.Length > 0)
                sqlCmdBuilder.Append(" AND FTASKTOOLSID IN (" + toolsNumberList + ") ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":TASKGROUPID", DbType.Int32, taskGroupID);
            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedOn);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);

            if (taskID > 0)
                db.AddInParameter(dbCmd, ":REFERENCEID", DbType.Int32, taskID);

            db.ExecuteNonQuery(dbCmd, transaction);

            return true;
        }
        #endregion

        #region Task Documents
        public static IDataReader GetTaskDocumentsOrImagesOrVideoInfo(Database db, int siteID, int taskID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT D.FDOCUMENTID,D.FREFERENCEID,D.FDOCUMENTNAME,D.FDOCUMENTTYPE ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_DOCUMENTS D ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_TASKS T ON D.FREFERENCEID=T.FTASKID AND T.FSITEID=:SITEID ");
            sqlCmdBuilder.Append(" WHERE D.FSITEID=:SITEID AND D.FREFERENCEID=:TASKID AND D.FREF_TYPE IN ('TASK','SCHEDULE') AND D.FSTATUS='A' ");  //while adding manual task from schedule ref_type is schedule
            sqlCmdBuilder.Append(" ORDER BY D.FUPDATEDON DESC,D.FUPDATEDTIME DESC");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":TASKID", DbType.Int32, taskID);

            return db.ExecuteReader(dbCmd);
        }

        public static bool CreateCopyOfTaskDocumentInfo(Database db, DbTransaction transaction, int siteID, int taskID, int newTaskID, int createdBy, int createdDate, int createdTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" INSERT INTO LDB1_MAINT_DOCUMENTS(FDOCUMENTID,FSITEID,FREFERENCEID,FREF_TYPE,FDOCUMENTTYPE,FDOCUMENTNAME,FSTATUS,FCREATEDON,FCREATEDTIME,FCREATEDBY,FUPDATEDON,FUPDATEDTIME,FUPDATEDBY ) ");
            sqlCmdBuilder.Append(" SELECT SEQUENCE_MAINT_DOC_ID.NEXTVAL,FSITEID,:NEWTASKID,FREF_TYPE,FDOCUMENTTYPE,FDOCUMENTNAME,FSTATUS,:CREATEDON,:CREATEDTIME,:CREATEDBY,:CREATEDON,:CREATEDTIME,:CREATEDBY ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_DOCUMENTS ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FREFERENCEID=:REFERENCEID AND FREF_TYPE='TASK' ");
            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":NEWTASKID", DbType.Int32, newTaskID);
            db.AddInParameter(dbCmd, ":REFERENCEID", DbType.Int32, taskID);
            db.AddInParameter(dbCmd, ":CREATEDBY", DbType.Int32, createdBy);
            db.AddInParameter(dbCmd, ":CREATEDON", DbType.Int32, createdDate);
            db.AddInParameter(dbCmd, ":CREATEDTIME", DbType.Int32, createdTime);
            db.ExecuteNonQuery(dbCmd, transaction);
            return true;
        }

        public static bool DeleteTaskDocumentsInfo(Database db, DbTransaction transaction, int siteID, int taskID, int updatedBy, int updatedOn, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_DOCUMENTS SET FSTATUS='I',FUPDATEDTIME=:UPDATEDTIME,FUPDATEDON=:UPDATEDON,FUPDATEDBY=:UPDATEDBY ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID  AND FREFERENCEID=:REFERENCEID AND FREF_TYPE='TASK' ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":REFERENCEID", DbType.Int32, taskID);
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedOn);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);


            db.ExecuteNonQuery(dbCmd, transaction);

            return true;
        }
        #endregion

        #region Tasks Parameters
        public static IDataReader GetTaskParameters(Database db, int siteID, int taskGroupID, int taskID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FPARAMETERID,FPARAMNAME,FISMANDATORY,FTYPE,NVL(FSELECTIONGROUPID,0) AS FSELECTIONGROUPID ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_TASKSPARAM  ");
            sqlCmdBuilder.Append(" WHERE FTASKGROUPID = :TASKGROUPID AND FSITEID=:SITEID ");
            sqlCmdBuilder.Append(" AND FREFERENCEID = :REFERENCEID AND FSTATUS='A' ORDER BY FPARAMETERID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":TASKGROUPID", DbType.Int32, taskGroupID);
            db.AddInParameter(dbCmd, ":REFERENCEID", DbType.Int32, taskID);

            return db.ExecuteReader(dbCmd);
        }

        public static bool CheckTasksParameterExists(Database db, DbTransaction transaction, int siteID, int parameterID, int taskNumber, int taskGroupID, string parameterName)
        {
            IDataReader dataReaderParameterName = null;
            bool isExists = false;
            try
            {
                StringBuilder sqlCmdBuilder = new StringBuilder();
                sqlCmdBuilder.Append(" SELECT FPARAMETERID FROM LDB1_MAINT_TASKSPARAM ");
                sqlCmdBuilder.Append(" WHERE FTASKGROUPID=:TASKGROUPID AND UPPER(FPARAMNAME)=:PARAMNAME ");
                sqlCmdBuilder.Append(" AND FREFERENCEID = :REFERENCEID AND FSITEID=:SITEID AND FSTATUS='A' ");
                if (parameterID > 0)
                    sqlCmdBuilder.Append(" AND FPARAMETERID <> :PARAMETERID ");

                DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
                dbCmd.CommandType = CommandType.Text;

                db.AddInParameter(dbCmd, ":REFERENCEID", DbType.Int32, taskNumber);
                db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
                db.AddInParameter(dbCmd, ":TASKGROUPID", DbType.Int32, taskGroupID);
                db.AddInParameter(dbCmd, ":PARAMNAME", DbType.String, parameterName.Trim().ToUpper());
                if (parameterID > 0)
                    db.AddInParameter(dbCmd, ":PARAMETERID", DbType.Int32, parameterID);

                using (dataReaderParameterName = db.ExecuteReader(dbCmd, transaction))
                {
                    if (dataReaderParameterName.Read())
                    {
                        isExists = true;
                    }
                    dataReaderParameterName.Close();
                }

                return isExists;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (dataReaderParameterName != null && !dataReaderParameterName.IsClosed)
                    dataReaderParameterName.Close();
            }
        }

        public static bool InsertTasksParameterInfo(Database db, DbTransaction transaction, int siteID, int taskNumber, int taskGroupID, string parameterName, bool isMandatory, char type, int selectionGruopID, int createdBy, int createdDate, int createdTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" INSERT INTO LDB1_MAINT_TASKSPARAM (FPARAMETERID,FSITEID,FTASKGROUPID, FREFERENCEID, FPARAMNAME, FISMANDATORY, FTYPE,FSELECTIONGROUPID, FCREATEDON, FCREATEDTIME, FCREATEDBY,FUPDATEDON,FUPDATEDTIME,FUPDATEDBY) ");
            sqlCmdBuilder.Append(" VALUES (SEQUENCE_MAINT_TASKSPARAM_ID.NEXTVAL,:SITEID, :TASKGROUPID, :REFERENCEID, :PARAMNAME, :ISMANDATORY, :TYPE,:SELECTIONGROUPID, :CREATEDON, :CREATEDTIME, :CREATEDBY, :CREATEDON, :CREATEDTIME, :CREATEDBY) ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":REFERENCEID", DbType.Int32, taskNumber);
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":TASKGROUPID", DbType.Int32, taskGroupID);
            db.AddInParameter(dbCmd, ":PARAMNAME", DbType.String, parameterName.Trim());
            db.AddInParameter(dbCmd, ":ISMANDATORY", DbType.AnsiStringFixedLength, isMandatory ? 'Y' : 'N');
            db.AddInParameter(dbCmd, ":TYPE", DbType.AnsiStringFixedLength, type);
            db.AddInParameter(dbCmd, ":SELECTIONGROUPID", DbType.Int32, selectionGruopID);
            db.AddInParameter(dbCmd, ":CREATEDBY", DbType.Int32, createdBy);
            db.AddInParameter(dbCmd, ":CREATEDON", DbType.Int32, createdDate);
            db.AddInParameter(dbCmd, ":CREATEDTIME", DbType.Int32, createdTime);

            db.ExecuteNonQuery(dbCmd, transaction);

            return true;
        }
        public static bool UpdateTasksParameterInfo(Database db, DbTransaction transaction, int siteID, int taskNumber, int taskGroupID, int parameterID, string parameterName, bool isMandatory, char type, int selectionCode, int updatedBy, int updatedDate, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_TASKSPARAM SET FPARAMNAME=:PARAMNAME, FISMANDATORY=:ISMANDATORY, FTYPE=:TYPE,FSELECTIONGROUPID=:SELECTIONGROUPID, FUPDATEDON=:UPDATEDON, FUPDATEDTIME=:UPDATEDTIME, FUPDATEDBY=:UPDATEDBY ");
            sqlCmdBuilder.Append(" WHERE FPARAMETERID=:PARAMETERID AND FREFERENCEID = :REFERENCEID AND FTASKGROUPID=:TASKGROUPID AND FSITEID=:SITEID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":PARAMETERID", DbType.Int32, parameterID);
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":REFERENCEID", DbType.Int32, taskNumber);
            db.AddInParameter(dbCmd, ":TASKGROUPID", DbType.Int32, taskGroupID);
            db.AddInParameter(dbCmd, ":PARAMNAME", DbType.String, parameterName.Trim());
            db.AddInParameter(dbCmd, ":ISMANDATORY", DbType.AnsiStringFixedLength, isMandatory ? 'Y' : 'N');
            db.AddInParameter(dbCmd, ":TYPE", DbType.AnsiStringFixedLength, type);
            db.AddInParameter(dbCmd, ":SELECTIONGROUPID", DbType.Int32, selectionCode);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedDate);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);
            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);

            db.ExecuteNonQuery(dbCmd, transaction);

            return true;
        }
        public static bool CreateCopyOfParameterInfo(Database db, DbTransaction transaction, int siteID, int taskGroupID, int newTaskGroupID, int taskID, int newTaskID, int createdBy, int createdDate, int createdTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" INSERT INTO LDB1_MAINT_TASKSPARAM (FPARAMETERID,FSITEID, FTASKGROUPID, FREFERENCEID, FPARAMNAME, FISMANDATORY, FTYPE,FSELECTIONGROUPID, FCREATEDON, FCREATEDTIME, FCREATEDBY,FUPDATEDON,FUPDATEDTIME,FUPDATEDBY) ");
            sqlCmdBuilder.Append(" SELECT SEQUENCE_MAINT_TASKSPARAM_ID.NEXTVAL,:SITEID, :NEWTASKGROUPID, :NEWTASKID, FPARAMNAME, FISMANDATORY, FTYPE,FSELECTIONGROUPID, :CREATEDON, :CREATEDTIME, :CREATEDBY, :CREATEDON, :CREATEDTIME, :CREATEDBY ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_TASKSPARAM ");
            sqlCmdBuilder.Append(" WHERE FTASKGROUPID=:TASKGROUPID AND FREFERENCEID =:REFERENCEID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":NEWTASKGROUPID", DbType.Int32, newTaskGroupID);
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":TASKGROUPID", DbType.Int32, taskGroupID);
            db.AddInParameter(dbCmd, ":NEWTASKID", DbType.Int32, newTaskID);
            db.AddInParameter(dbCmd, ":REFERENCEID", DbType.Int32, taskID);
            db.AddInParameter(dbCmd, ":CREATEDBY", DbType.Int32, createdBy);
            db.AddInParameter(dbCmd, ":CREATEDON", DbType.Int32, createdDate);
            db.AddInParameter(dbCmd, ":CREATEDTIME", DbType.Int32, createdTime);

            db.ExecuteNonQuery(dbCmd, transaction);
            return true;
        }

        public static bool DeleteTasksParameterList(Database db, DbTransaction transaction, int siteID, int taskGroupID, int taskID, string parameterNumberList, int updatedBy, int updatedOn, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_TASKSPARAM SET FSTATUS='I',FUPDATEDTIME=:UPDATEDTIME,FUPDATEDON=:UPDATEDON,FUPDATEDBY=:UPDATEDBY ");
            sqlCmdBuilder.Append(" WHERE FTASKGROUPID=:TASKGROUPID AND FSITEID=:SITEID ");

            if (taskID > 0)
                sqlCmdBuilder.Append(" AND FREFERENCEID = :REFERENCEID ");

            if (!string.IsNullOrEmpty(parameterNumberList))
                sqlCmdBuilder.Append(" AND FPARAMETERID IN (" + parameterNumberList + ") ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":TASKGROUPID", DbType.Int32, taskGroupID);
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedOn);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);

            if (taskID > 0)
                db.AddInParameter(dbCmd, ":REFERENCEID", DbType.Int32, taskID);

            db.ExecuteNonQuery(dbCmd, transaction);

            return true;
        }

        public static int GetTasksParameterID(Database db, DbTransaction transaction, int siteID, int taskNumber, int taskGroupID, string parameterName)
        {
            IDataReader dataReaderParameterName = null;
            int parameterID = 0;
            try
            {
                StringBuilder sqlCmdBuilder = new StringBuilder();
                sqlCmdBuilder.Append(" SELECT FPARAMETERID FROM LDB1_MAINT_TASKSPARAM ");
                sqlCmdBuilder.Append(" WHERE FTASKGROUPID=:TASKGROUPID AND UPPER(FPARAMNAME)=:PARAMNAME ");
                sqlCmdBuilder.Append(" AND FREFERENCEID = :REFERENCEID AND FSITEID=:SITEID AND FSTATUS='A' ");


                DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
                dbCmd.CommandType = CommandType.Text;

                db.AddInParameter(dbCmd, ":REFERENCEID", DbType.Int32, taskNumber);
                db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
                db.AddInParameter(dbCmd, ":TASKGROUPID", DbType.Int32, taskGroupID);
                db.AddInParameter(dbCmd, ":PARAMNAME", DbType.String, parameterName.Trim().ToUpper());

                using (dataReaderParameterName = db.ExecuteReader(dbCmd, transaction))
                {
                    if (dataReaderParameterName.Read())
                    {
                        parameterID = dataReaderParameterName.GetInt32(0);
                    }
                    dataReaderParameterName.Close();
                }
                return parameterID;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (dataReaderParameterName != null && !dataReaderParameterName.IsClosed)
                    dataReaderParameterName.Close();
            }
        }

        #endregion

        #region Tasks SpareParts
        public static IDataReader GetTaskSpareParts(Database db, int siteID, int taskID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT LTRIM(TS.FIDHID,'0') AS FIDHID,M.FIDHDESC,M.FBASEUOM,NVL(TS.FQTY,0) AS FQUANTITY ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_TASKSPARES TS ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_PLANTMATERIAL M ON M.FIDHID=TS.FIDHID AND M.FSITEID=TS.FSITEID ");
            sqlCmdBuilder.Append(" WHERE TS.FSITEID=:SITEID AND TS.FTASKID=:TASKID AND TS.FSTATUS='A' ORDER BY TS.FTIMESTAMP ASC ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":TASKID", DbType.Int32, taskID);

            return db.ExecuteReader(dbCmd);
        }

        public static bool CheckTaskSparePartExists(Database db, DbTransaction transaction, int siteID, int taskID, string materialCode, bool considerStatus)
        {
            IDataReader dataReaderTaskName = null;
            bool isExists = false;

            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FIDHID FROM LDB1_MAINT_TASKSPARES WHERE FSITEID=:SITEID AND FIDHID=:IDHID");
            if(taskID>0)
            sqlCmdBuilder.Append(" AND FTASKID=:TASKID");
            if(considerStatus)
                sqlCmdBuilder.Append(" AND FSTATUS = 'A'");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":IDHID", DbType.AnsiString, materialCode.Trim().PadLeft(18, '0'));
            if (taskID > 0)
                db.AddInParameter(dbCmd, ":TASKID", DbType.Int32, taskID);

            try
            {
                using (dataReaderTaskName = (transaction==null)?db.ExecuteReader(dbCmd):db.ExecuteReader(dbCmd, transaction))
                {
                    if (dataReaderTaskName.Read())
                    {
                        isExists = true;
                    }
                    dataReaderTaskName.Close();
                }
                return isExists;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (dataReaderTaskName != null && !dataReaderTaskName.IsClosed)
                    dataReaderTaskName.Close();
            }
        }

        public static bool CreateCopyOfTaskSparePartInfo(Database db, DbTransaction transaction, int siteID, int taskID, int newTaskID, int createdBy, int createdDate, int createdTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" INSERT INTO LDB1_MAINT_TASKSPARES (FSITEID, FTASKID, FIDHID, FQTY, FCREATEDON, FCREATEDTIME, FCREATEDBY,FUPDATEDON,FUPDATEDTIME,FUPDATEDBY) ");
            sqlCmdBuilder.Append(" SELECT :SITEID,  :NEWTASKID, FIDHID, FQTY, :CREATEDON, :CREATEDTIME, :CREATEDBY, :CREATEDON, :CREATEDTIME, :CREATEDBY ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_TASKSPARES ");
            sqlCmdBuilder.Append(" WHERE FTASKID=:TASKID AND FSITEID =:SITEID AND FSTATUS='A' ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":TASKID", DbType.Int32, taskID);
            db.AddInParameter(dbCmd, ":NEWTASKID", DbType.Int32, newTaskID);
            db.AddInParameter(dbCmd, ":CREATEDBY", DbType.Int32, createdBy);
            db.AddInParameter(dbCmd, ":CREATEDON", DbType.Int32, createdDate);
            db.AddInParameter(dbCmd, ":CREATEDTIME", DbType.Int32, createdTime);

            db.ExecuteNonQuery(dbCmd, transaction);
            return true;
        }

        public static int InsertTaskSparePartInfo(Database db, DbTransaction transaction, int siteID, int taskID, string material, decimal qty, int createdBy, int createdOn, int createdTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" INSERT INTO LDB1_MAINT_TASKSPARES(FSITEID,FTASKID,FIDHID,FQTY,FSTATUS,FCREATEDBY,FCREATEDON,FCREATEDTIME,FUPDATEDBY,FUPDATEDON,FUPDATEDTIME) ");
            sqlCmdBuilder.Append(" VALUES(:SITEID,:TASKID,:IDHID,:QTY,'A',:CREATEDBY,:CREATEDON,:CREATEDTIME,:UPDATEDBY,:UPDATEDON,:UPDATEDTIME) ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":TASKID", DbType.Int32, taskID);
            db.AddInParameter(dbCmd, ":IDHID", DbType.AnsiString, material.Trim().ToUpper().PadLeft(18, '0'));
            db.AddInParameter(dbCmd, ":QTY", DbType.Decimal, qty);
            db.AddInParameter(dbCmd, ":CREATEDBY", DbType.Int32, createdBy);
            db.AddInParameter(dbCmd, ":CREATEDON", DbType.Int32, createdOn);
            db.AddInParameter(dbCmd, ":CREATEDTIME", DbType.Int32, createdTime);
            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, createdBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, createdOn);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, createdTime);

            return db.ExecuteNonQuery(dbCmd, transaction);
        }

        public static bool UpdateTaskSparePart(Database db, DbTransaction transaction, int siteID, int taskID, string materialCode, decimal qty, int createdBy, int createdDate, int createdTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_TASKSPARES SET FQTY=:QTY,FSTATUS='A',FUPDATEDBY=:CREATEDBY,FUPDATEDON=:CREATEDON,FUPDATEDTIME=:CREATEDTIME ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FTASKID=:TASKID AND FIDHID=:IDHID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":TASKID", DbType.Int32, taskID);
            db.AddInParameter(dbCmd, ":IDHID", DbType.AnsiString, materialCode.Trim().ToUpper().PadLeft(18, '0'));
            db.AddInParameter(dbCmd, ":QTY", DbType.Decimal, qty);
            db.AddInParameter(dbCmd, ":CREATEDBY", DbType.Int32, createdBy);
            db.AddInParameter(dbCmd, ":CREATEDON", DbType.Int32, createdDate);
            db.AddInParameter(dbCmd, ":CREATEDTIME", DbType.Int32, createdTime);

            db.ExecuteNonQuery(dbCmd, transaction);
            return true;
        }

        public static int DeleteTaskSparePartInfo(Database db, DbTransaction transaction, int siteID, int taskID, int createdBy, int createdOn, int createdTime, string materialCode)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_TASKSPARES SET FSTATUS='I',FUPDATEDBY=:UPDATEDBY,FUPDATEDON=:UPDATEDON,FUPDATEDTIME=:UPDATEDTIME WHERE FSITEID=:SITEID AND FTASKID=:TASKID AND FSTATUS='A' ");
            if (!string.IsNullOrEmpty(materialCode))
                sqlCmdBuilder.Append(" AND FIDHID=:IDHID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":TASKID", DbType.Int32, taskID);
            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, createdBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, createdOn);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, createdTime);
            if (!string.IsNullOrEmpty(materialCode))
                db.AddInParameter(dbCmd, ":IDHID", DbType.AnsiString, materialCode.Trim().ToUpper().PadLeft(18, '0'));

            return db.ExecuteNonQuery(dbCmd, transaction);
        }
        #endregion

        public static IDataReader GetPPEInfo(Database db, int siteID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FPPEID,FPPEDESC,FPPEIMAGENAME ");
            sqlCmdBuilder.Append(" FROM LDB1_PLANTPPE WHERE FSITEID=:SITEID AND FSTATUS='A' ORDER BY FPPEDESC ASC ");


            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            return db.ExecuteReader(dbCmd);
        }
        public static int GetPPEID(Database db, DbTransaction transaction, int siteID, string ppeName)
        {
            IDataReader dataReader = null;
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FPPEID ");
            sqlCmdBuilder.Append(" FROM LDB1_PLANTPPE ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FSTATUS='A' ");
            sqlCmdBuilder.Append(" AND UPPER(FPPEDESC)=:PPENAME ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":PPENAME", DbType.String, ppeName.Trim().ToUpper());
            int ppeID = 0;
            using (dataReader = db.ExecuteReader(dbCmd, transaction))
            {
                if (dataReader.Read())
                {
                    ppeID = dataReader.GetInt32(0);
                }
                dataReader.Close();
            }
            return ppeID;
        }

        public static IDataReader GetToolsInfo(Database db, int siteID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FTOOLSID,FTOOLSDESC,FTOOLSIMAGENAME ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_TOOLS WHERE FSITEID=:SITEID AND FSTATUS='A' ORDER BY FTOOLSDESC ASC ");


            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            return db.ExecuteReader(dbCmd);
        }
        public static int GetToolsID(Database db, DbTransaction transaction, int siteID, string toolsName)
        {
            IDataReader dataReader = null;
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FTOOLSID ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_TOOLS ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FSTATUS='A' ");
            sqlCmdBuilder.Append(" AND UPPER(FTOOLSDESC)=:TOOLSNAME ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":TOOLSNAME", DbType.String, toolsName.Trim().ToUpper());
            int toolsID = 0;
            using (dataReader = db.ExecuteReader(dbCmd, transaction))
            {
                if (dataReader.Read())
                {
                    toolsID = dataReader.GetInt32(0);
                }
                dataReader.Close();
            }
            return toolsID;
        }
        #endregion

        #region Maintenance Schedule & Work Order

        public static int InsertMaintenanceInfo(Database db, DbTransaction transaction, int siteID, string maintenanceName, string maintenanceDesc, char scheduleType, int maintTypeID, string maintPriorityType, int fLocationID, int equipmentID
            , int workGroupID, int notificationTypeID, int createdBy, int createdOn, int createdTime, string scheduleStatus)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" INSERT INTO LDB1_MAINT_SCHEDULE (FSCHEDULEID,FSITEID,FMAINTENANCENAME,FMAINDESCRIPTION,FSCHEDULE_TYPE,FMAINTYPEID ");
            sqlCmdBuilder.Append(" ,FPRIORITYTYPE,FLOCATIONID,FEQUIPMENTID,FWORKGROUPID,FSCHEDULESTATUS,FNOTIFY_TYPEID,FSTATUS,FCREATEDBY,FCREATEDON,FCREATEDTIME,FUPDATEDBY,FUPDATEDON,FUPDATEDTIME) ");
            sqlCmdBuilder.Append(" VALUES(SEQUENCE_MAINT_SCHEDULE_ID.NEXTVAL,:SITEID,:MAINTENANCENAME,:MAINDESCRIPTION,:SCHEDULE_TYPE,:MAINTYPEID ");
            sqlCmdBuilder.Append(" ,:PRIORITYTYPE,:LOCATIONID,:EQUIPMENTID,:WORKGROUPID,:SCHEDULESTATUS,:NOTIFY_TYPEID,'A',:CREATEDBY,:CREATEDON,:CREATEDTIME,:CREATEDBY,:CREATEDON,:CREATEDTIME) ");
            sqlCmdBuilder.Append("  RETURNING FSCHEDULEID INTO :SCHEDULEID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddOutParameter(dbCmd, ":SCHEDULEID", DbType.Int32, sizeof(Int32));
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":MAINTENANCENAME", DbType.String, maintenanceName.Trim());
            db.AddInParameter(dbCmd, ":MAINDESCRIPTION", DbType.String, maintenanceDesc.Trim());
            db.AddInParameter(dbCmd, ":SCHEDULE_TYPE", DbType.AnsiStringFixedLength, scheduleType.ToString().ToUpper());
            db.AddInParameter(dbCmd, ":MAINTYPEID", DbType.Int32, maintTypeID);
            db.AddInParameter(dbCmd, ":PRIORITYTYPE", DbType.AnsiString, maintPriorityType.Trim().ToUpper());
            db.AddInParameter(dbCmd, ":LOCATIONID", DbType.Int32, fLocationID);
            db.AddInParameter(dbCmd, ":EQUIPMENTID", DbType.Int32, equipmentID);
            db.AddInParameter(dbCmd, ":WORKGROUPID", DbType.Int32, workGroupID);
            db.AddInParameter(dbCmd, ":NOTIFY_TYPEID", DbType.Int32, notificationTypeID);
            db.AddInParameter(dbCmd, ":SCHEDULESTATUS", DbType.AnsiString, scheduleStatus.Trim().ToUpper());
            db.AddInParameter(dbCmd, ":CREATEDBY", DbType.Int32, createdBy);
            db.AddInParameter(dbCmd, ":CREATEDON", DbType.Int32, createdOn);
            db.AddInParameter(dbCmd, ":CREATEDTIME", DbType.Int32, createdTime);

            if (transaction != null)
                db.ExecuteNonQuery(dbCmd, transaction);
            else
                db.ExecuteNonQuery(dbCmd);

            return Convert.ToInt32(db.GetParameterValue(dbCmd, ":SCHEDULEID").ToString());
        }

        public static bool UpdateMaintenanceInfo(Database db, DbTransaction transaction, int siteID, int scheduleID, string maintenanceName, string maintenanceDesc, char scheduleType, int maintTypeID, string maintPriorityType, int fLocationID,
            int equipmentID, int workGroupID, int notificationTypeID, string notificationRemarks, int updatedBy, int updatedOn, int updatedTime,int requestedEndDate)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_SCHEDULE SET ");
            sqlCmdBuilder.Append(" FMAINTENANCENAME=:MAINTENANCENAME,FMAINDESCRIPTION=:MAINDESCRIPTION,FSCHEDULE_TYPE=:SCHEDULE_TYPE,FMAINTYPEID=:MAINTYPEID,FPRIORITYTYPE=:PRIORITYTYPE ");
            sqlCmdBuilder.Append(" ,FLOCATIONID=:LOCATIONID,FEQUIPMENTID=:EQUIPMENTID,FWORKGROUPID=:WORKGROUPID,FNOTIFY_TYPEID=:NOTIFY_TYPEID,FUPDATEDBY=:UPDATEDBY ");
            sqlCmdBuilder.Append(" ,FUPDATEDON=:UPDATEDON,FUPDATEDTIME=:UPDATEDTIME,FREQUESTED_ENDDATE=:REQUESTED_ENDDATE ");

            if (!string.IsNullOrEmpty(notificationRemarks))
            {
                sqlCmdBuilder.Append(" ,FREMARKS=:REMARKS,FSCHEDULESTATUS='REJECTED' ");//Remarked notification status changing to 'Rejected:R'
            }

            sqlCmdBuilder.Append(" WHERE FSCHEDULEID=:SCHEDULEID AND FSITEID=:SITEID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SCHEDULEID", DbType.Int32, scheduleID);
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":MAINTENANCENAME", DbType.String, maintenanceName.Trim());
            db.AddInParameter(dbCmd, ":MAINDESCRIPTION", DbType.String, maintenanceDesc.Trim());
            db.AddInParameter(dbCmd, ":SCHEDULE_TYPE", DbType.AnsiStringFixedLength, scheduleType);
            db.AddInParameter(dbCmd, ":MAINTYPEID", DbType.Int32, maintTypeID);
            db.AddInParameter(dbCmd, ":PRIORITYTYPE", DbType.AnsiString, maintPriorityType.Trim().ToUpper());
            db.AddInParameter(dbCmd, ":LOCATIONID", DbType.Int32, fLocationID);
            db.AddInParameter(dbCmd, ":EQUIPMENTID", DbType.Int32, equipmentID);
            db.AddInParameter(dbCmd, ":WORKGROUPID", DbType.Int32, workGroupID);
            db.AddInParameter(dbCmd, ":NOTIFY_TYPEID", DbType.Int32, notificationTypeID);
            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedOn);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);
            db.AddInParameter(dbCmd, ":REQUESTED_ENDDATE", DbType.Int32, requestedEndDate);
            if (!string.IsNullOrEmpty(notificationRemarks))
            {
                db.AddInParameter(dbCmd, ":REMARKS", DbType.String, notificationRemarks.Trim());
            }

            if (transaction != null)
                db.ExecuteNonQuery(dbCmd, transaction);
            else
                db.ExecuteNonQuery(dbCmd);

            return true;
        }

        public static IDataReader GetMaintenanceInfo(Database db, int siteID, int maintScheduleID, bool isWorkOrder, string workOrderID)        //, char scheduleType
        {
            StringBuilder sqlCommandBuilder = new StringBuilder();
            sqlCommandBuilder.Append(" SELECT MS.FMAINTENANCENAME,MS.FMAINDESCRIPTION,MS.FMAINTYPEID,MS.FPRIORITYTYPE,MS.FLOCATIONID,MS.FEQUIPMENTID,WG.FMASTERID AS FWORKGROUPID,WG.FNAME AS FWORKGROUPNAME,WG.FSTATUS AS FWORKGROUPSTATUS,ML.FLOCATIONNAME ");
            sqlCommandBuilder.Append(" ,ME.FEQUIPMENTNAME,ML.FIMAGENAME AS FLOCATIONIMG,ME.FIMAGENAME AS FEQUIPMENTIMG,MS.FSCHEDULESTATUS,MD.FSCHEDULE_DTL_ID ");
            sqlCommandBuilder.Append(" ,TG.FTASKGROUPID,TG.FTASKGROUPNAME,TG.FVERSION,MS.FTASKGROUPIDENTIFIER AS FIDENTIFIER,MS.FTASKGROUPID AS FMANTASKGROUPID,MODEL.FMODELREFERENCEID,MODEL.FIMAGENAME AS FMODELIMAGE ");

            if (isWorkOrder)
            {
                sqlCommandBuilder.Append(" ,MW.FSCHEDULEDATE,MW.FSCHEDULETIME,MW.FWORKORDERSTATUS,N.FSCHEDULEID AS FNOTIFICATIONID ");
            }

            sqlCommandBuilder.Append(" FROM LDB1_MAINT_SCHEDULE MS ");

            if (isWorkOrder)
            {
                sqlCommandBuilder.Append(" INNER JOIN LDB1_MAINT_WORKORDER MW ON MW.FSITEID=MS.FSITEID AND MW.FREF_SCHEDULEID=MS.FSCHEDULEID ");
                if (!string.IsNullOrEmpty(workOrderID))
                {
                    sqlCommandBuilder.Append(" AND MW.FWORK_ORDERID=:WORK_ORDERID ");
                }
                sqlCommandBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_SCHEDULE N ON N.FSITEID=MW.FSITEID AND N.FNOTIFY_WORK_ORDERID=MW.FWORK_ORDERID ");
            }

            sqlCommandBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_SCHEDULE_DTL MD ON MD.FSCHEDULEID=MS.FSCHEDULEID AND MD.FSTATUS='A' AND ROWNUM=1 ");      //MD.FITEM_ID=1 
            sqlCommandBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_LOCATIONS ML ON ML.FSITEID=MS.FSITEID AND ML.FLOCATIONID=MS.FLOCATIONID ");
            sqlCommandBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_EQUIPMENT ME ON ME.FSITEID=MS.FSITEID AND ME.FEQUIPMENTID=MS.FEQUIPMENTID ");
            sqlCommandBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_EQUIPMENT MODEL ON MODEL.FSITEID=MS.FSITEID AND MODEL.FEQUIPMENTID=ME.FMODELREFERENCEID ");
            sqlCommandBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_TASKGROUP TG ON TG.FIDENTIFIER=MS.FTASKGROUPIDENTIFIER AND TG.FSITEID=MS.FSITEID AND TG.FSTATUS='A' ");

            if (isWorkOrder)
                sqlCommandBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_MASTER WG ON WG.FMASTERID=DECODE(NVL(MW.FWORKGROUPID,0),0,MS.FWORKGROUPID,MW.FWORKGROUPID) AND WG.FSITEID=MS.FSITEID AND WG.FTYPE='WORKGROUP' ");
            else
                sqlCommandBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_MASTER WG ON WG.FMASTERID=MS.FWORKGROUPID AND WG.FSITEID=MS.FSITEID AND WG.FTYPE='WORKGROUP' ");

            sqlCommandBuilder.Append(" WHERE MS.FSITEID=:SITEID AND MS.FSCHEDULEID=:SCHEDULEID  AND MS.FSTATUS='A' ");          //AND MS.FSCHEDULE_TYPE=:SCHEDULE_TYPE

            DbCommand dbCommand = db.GetSqlStringCommand(sqlCommandBuilder.ToString());
            dbCommand.CommandType = CommandType.Text;

            db.AddInParameter(dbCommand, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCommand, ":SCHEDULEID", DbType.Int32, maintScheduleID);

            if (isWorkOrder && !string.IsNullOrEmpty(workOrderID))
            {
                db.AddInParameter(dbCommand, ":WORK_ORDERID", DbType.AnsiString, workOrderID.Trim().ToUpper().PadLeft(12, '0'));
            }

            return db.ExecuteReader(dbCommand);
        }

        public static int InsertMaintenaceScheduleDetailInfoWorkOrder(Database db, DbTransaction transaction, int siteID, int scheduleID, int itemID, int createdBy, int createdOn, int createdTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" INSERT INTO LDB1_MAINT_SCHEDULE_DTL(FSCHEDULE_DTL_ID,FSITEID,FSCHEDULEID,FITEM_ID,FCREATEDBY,FCREATEDON,FCREATEDTIME,FSTATUS,FUPDATEDBY,FUPDATEDON,FUPDATEDTIME) ");
            sqlCmdBuilder.Append(" VALUES(SEQUENCE_MAINTSCHEDULE_DTLID.NEXTVAL,:SITEID,:SCHEDULEID,:ITEM_ID,:CREATEDBY,:CREATEDON,:CREATEDTIME,'A',:CREATEDBY,:CREATEDON,:CREATEDTIME) ");
            sqlCmdBuilder.Append(" RETURNING FSCHEDULE_DTL_ID INTO :SCHEDULE_DTL_ID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddOutParameter(dbCmd, ":SCHEDULE_DTL_ID", DbType.Int32, sizeof(Int32));
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":SCHEDULEID", DbType.Int32, scheduleID);
            db.AddInParameter(dbCmd, ":ITEM_ID", DbType.Int32, itemID);
            db.AddInParameter(dbCmd, ":CREATEDBY", DbType.Int32, createdBy);
            db.AddInParameter(dbCmd, ":CREATEDON", DbType.Int32, createdOn);
            db.AddInParameter(dbCmd, ":CREATEDTIME", DbType.Int32, createdTime);

            db.ExecuteNonQuery(dbCmd, transaction);

            return Convert.ToInt32(db.GetParameterValue(dbCmd, ":SCHEDULE_DTL_ID"));
        }

        public static string GetNextMaintenanceWorkOrder(Database db)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT LPAD(SEQUENCE_MAINTWORKORDER_ID.NEXTVAL,12,'0') AS FNEXTORDERID FROM DUAL ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            return db.ExecuteScalar(dbCmd).ToString();
        }

        public static int InsertMaintenanceWorkOrderInfo(Database db, DbTransaction transaction, int siteID, string workOrder, int schedule_dtl_id, int scheduleID, int scheduleDate, int scheduleTime
            , char isNotificationOrder, int updatedBy, int updatedON, int updatedTime, string status)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" INSERT INTO LDB1_MAINT_WORKORDER(FWORK_ORDERID,FSITEID,FREF_SCHEDULE_DTL_ID,FREF_SCHEDULEID,FSCHEDULEDATE,FSCHEDULETIME ");
            sqlCmdBuilder.Append(", FPLANNEDDATE,FPLANNEDTIME,FWORKORDERSTATUS,FISNOTIFICATIONORDER,FCREATEDBY,FCREATEDON,FCREATEDTIME,FUPDATEDBY,FUPDATEDON,FUPDATEDTIME) ");

            sqlCmdBuilder.Append(" VALUES(:WORK_ORDERID,:SITEID,:REF_SCHEDULE_DTL_ID,:REF_SCHEDULEID,:SCHEDULEDATE,:SCHEDULETIME,:SCHEDULEDATE,:SCHEDULETIME,:WORKORDERSTATUS,:ISNOTIFICATIONORDER ");
            sqlCmdBuilder.Append(" ,:CREATEDBY,:CREATEDON,:CREATEDTIME,:CREATEDBY,:CREATEDON,:CREATEDTIME) ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":WORK_ORDERID", DbType.AnsiString, workOrder.Trim().PadLeft(12, '0'));
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":REF_SCHEDULE_DTL_ID", DbType.Int32, schedule_dtl_id);
            db.AddInParameter(dbCmd, ":REF_SCHEDULEID", DbType.Int32, scheduleID);
            db.AddInParameter(dbCmd, ":SCHEDULEDATE", DbType.Int32, scheduleDate);
            db.AddInParameter(dbCmd, ":SCHEDULETIME", DbType.Int32, scheduleTime);
            db.AddInParameter(dbCmd, ":ISNOTIFICATIONORDER", DbType.AnsiStringFixedLength, isNotificationOrder);
            db.AddInParameter(dbCmd, ":WORKORDERSTATUS", DbType.AnsiString, status.Trim().ToUpper());

            db.AddInParameter(dbCmd, ":CREATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":CREATEDON", DbType.Int32, updatedON);
            db.AddInParameter(dbCmd, ":CREATEDTIME", DbType.Int32, updatedTime);


            return db.ExecuteNonQuery(dbCmd, transaction);
        }

        public static bool UpdateScheduleDateForWorkOrder(Database db, DbTransaction transaction, int siteID, string workOrderID, int scheduleDate, int scheduleTime
            , bool updatePlannedDate, int updatedBy, int updatedON, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_WORKORDER SET FSCHEDULEDATE=:SCHEDULEDATE,FSCHEDULETIME=:SCHEDULETIME ");
            if (updatePlannedDate)
                sqlCmdBuilder.Append(" ,FPLANNEDDATE=:SCHEDULEDATE,FPLANNEDTIME=:SCHEDULETIME ");

            sqlCmdBuilder.Append(" ,FUPDATEDBY=:UPDATEDBY,FUPDATEDON=:UPDATEDON,FUPDATEDTIME=:UPDATEDTIME ");

            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FWORK_ORDERID=:WORK_ORDERID AND FWORKORDERSTATUS IN ('CREATED','SCHEDULED','OVERDUE') ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":WORK_ORDERID", DbType.AnsiString, workOrderID.PadLeft(12, '0'));
            db.AddInParameter(dbCmd, ":SCHEDULEDATE", DbType.Int32, scheduleDate);
            db.AddInParameter(dbCmd, ":SCHEDULETIME", DbType.Int32, scheduleTime);

            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedON);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);

            if (transaction != null)
                db.ExecuteNonQuery(dbCmd, transaction);
            else
                db.ExecuteNonQuery(dbCmd);

            return true;
        }

        public static IDataReader CheckDirectWorkOrderExists(Database db, DbTransaction transaction, int siteID, int maintScheduleID, string workOrderID, bool statusCheck)
        {
            StringBuilder sqlCommandBuilder = new StringBuilder();
            sqlCommandBuilder.Append(" SELECT WO.FWORK_ORDERID,WO.FWORKORDERSTATUS,WO.FISNOTIFICATIONORDER ");
            sqlCommandBuilder.Append(" FROM LDB1_MAINT_WORKORDER WO  WHERE WO.FSITEID=:SITEID ");
            if (maintScheduleID > 0)
                sqlCommandBuilder.Append(" AND WO.FREF_SCHEDULEID=:SCHEDULEID ");
            else
                sqlCommandBuilder.Append(" AND WO.FWORK_ORDERID=:WORK_ORDERID ");

            if (statusCheck)
                sqlCommandBuilder.Append(" AND WO.FWORKORDERSTATUS NOT IN ('CREATED','SCHEDULED','OVERDUE','INACTIVE','CANCELLED') ");

            DbCommand dbCommand = db.GetSqlStringCommand(sqlCommandBuilder.ToString());
            dbCommand.CommandType = CommandType.Text;

            db.AddInParameter(dbCommand, ":SITEID", DbType.Int32, siteID);
            if (maintScheduleID > 0)
                db.AddInParameter(dbCommand, ":SCHEDULEID", DbType.Int32, maintScheduleID);
            else
                db.AddInParameter(dbCommand, ":WORK_ORDERID", DbType.AnsiString, workOrderID.Trim().ToUpper().PadLeft(12, '0'));

            if (transaction != null)
                return db.ExecuteReader(dbCommand, transaction);
            else
                return db.ExecuteReader(dbCommand);
        }

        public static bool DeleteMaintenanceInfo(Database db, DbTransaction transaction, int siteID, int scheduleID, int updatedBy, int updatedOn, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_SCHEDULE SET FSTATUS='I',FUPDATEDBY=:UPDATEDBY,FUPDATEDON=:UPDATEDON,FUPDATEDTIME=:UPDATEDTIME ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FSCHEDULEID=:SCHEDULEID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":SCHEDULEID", DbType.Int32, scheduleID);
            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedOn);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);
            if (transaction != null)
            {
                db.ExecuteNonQuery(dbCmd, transaction);
            }
            else
            {
                db.ExecuteNonQuery(dbCmd);
            }
            return true;
        }

        public static IDataReader GetScheduleDetailInfoForSchedule(Database db, DbTransaction transaction, int siteID, int scheduleID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FSCHEDULE_DTL_ID FROM LDB1_MAINT_SCHEDULE_DTL WHERE FSITEID=:SITEID AND FSCHEDULEID=:SCHEDULEID AND FSTATUS='A' ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":SCHEDULEID", DbType.Int32, scheduleID);

            if (transaction != null)
                return db.ExecuteReader(dbCmd, transaction);
            else
                return db.ExecuteReader(dbCmd);
        }

        public static bool DeleteMaintenanceWorkOrderInfo(Database db, DbTransaction transaction, int siteID, int schedule_dtl_id, int updatedBy, int updatedOn, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_WORKORDER SET FWORKORDERSTATUS='INACTIVE',FUPDATEDBY=:UPDATEDBY,FUPDATEDON=:UPDATEDON,FUPDATEDTIME=:UPDATEDTIME ");
            sqlCmdBuilder.Append("  WHERE FSITEID=:SITEID AND FREF_SCHEDULE_DTL_ID=:REF_SCHEDULE_DTL_ID AND FWORKORDERSTATUS IN ('SCHEDULED','OVERDUE','CREATED') ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":REF_SCHEDULE_DTL_ID", DbType.Int32, schedule_dtl_id);
            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedOn);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);

            db.ExecuteNonQuery(dbCmd, transaction);
            return true;
        }

        public static bool UpdateMaintenanceScheduleStatus(Database db, DbTransaction transaction, int siteID, int scheduleID, int updatedBy, int updatedOn, int updatedTime, string scheduleStatus)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_SCHEDULE SET FSCHEDULESTATUS=:SCHEDULESTATUS,FUPDATEDBY=DECODE(:UPDATEDBY,0,FUPDATEDBY,:UPDATEDBY),FUPDATEDON=:UPDATEDON,FUPDATEDTIME=:UPDATEDTIME ");


            if (scheduleStatus.Trim().ToUpper() == "RELEASED" || scheduleStatus.Trim().ToUpper() == "SCHEDULING")
            {
                sqlCmdBuilder.Append(" ,FRELEASEDBY=:UPDATEDBY,FRELEASEDON=:UPDATEDON ");
            }
            else if (scheduleStatus.Trim().ToUpper() == "CREATED")
            {
                sqlCmdBuilder.Append(" ,FRELEASEDBY=0,FRELEASEDON=0 ");
            }

            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FSCHEDULEID=:SCHEDULEID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":SCHEDULEID", DbType.Int32, scheduleID);
            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedOn);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);
            db.AddInParameter(dbCmd, ":SCHEDULESTATUS", DbType.AnsiString, scheduleStatus);

            if (transaction != null)
                db.ExecuteNonQuery(dbCmd, transaction);
            else
                db.ExecuteNonQuery(dbCmd);
            return true;
        }

        public static IDataReader CheckMaintenanceScheduleStatus(Database db, DbTransaction transaction, int siteID, int scheduleID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FSCHEDULESTATUS,FTASKGROUPID FROM LDB1_MAINT_SCHEDULE WHERE FSITEID=:SITEID AND FSCHEDULEID=:SCHEDULEID AND FSTATUS='A' ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":SCHEDULEID", DbType.Int32, scheduleID);

            return db.ExecuteReader(dbCmd, transaction);
        }

        public static IDataReader GetWorkGroupOfEquipemntOrLocation(Database db, int siteID, int referenceID, string referenceType)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT M.FMASTERID,M.FNAME ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_MASTER M ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_AUTH_GROUP MA ON MA.FWORKGROUPID=M.FMASTERID AND MA.FSITEID=M.FSITEID AND MA.FSTATUS='A' ");
            sqlCmdBuilder.Append(" WHERE M.FSITEID=:SITEID AND M.FTYPE='WORKGROUP' AND M.FSTATUS='A' AND MA.FREFERENCEID=:REFERENCEID AND MA.FTYPE=:TYPE ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":REFERENCEID", DbType.Int32, referenceID);
            db.AddInParameter(dbCmd, ":TYPE", DbType.AnsiString, referenceType.Trim().ToUpper());

            return db.ExecuteReader(dbCmd);
        }

        public static bool UpdateMaintWorkOrderScheduleDateTime(Database db, int siteID, string workOrderID, int scheduleDate, int scheduleTime, int updatedBy, int updatedON, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_WORKORDER SET FSCHEDULEDATE=:SCHEDULEDATE,FSCHEDULETIME=:SCHEDULETIME ");
            sqlCmdBuilder.Append(" ,FUPDATEDBY=:UPDATEDBY,FUPDATEDON=:UPDATEDON,FUPDATEDTIME=:UPDATEDTIME ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FWORK_ORDERID=:WORK_ORDERID AND FWORKORDERSTATUS IN ('SCHEDULED','OVERDUE','CREATED') ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":WORK_ORDERID", DbType.AnsiString, workOrderID.Trim().PadLeft(12, '0'));
            db.AddInParameter(dbCmd, ":SCHEDULEDATE", DbType.Int32, scheduleDate);
            db.AddInParameter(dbCmd, ":SCHEDULETIME", DbType.Int32, scheduleTime);
            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedON);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);

            db.ExecuteNonQuery(dbCmd);
            return true;
        }

        public static IDataReader GetLastApprovedTaskGroupSOP(Database db, int siteID, int identifier)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT * FROM (SELECT FTASKGROUPID,FTASKGROUPNAME,FVERSION FROM LDB1_MAINT_TASKGROUP ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FIDENTIFIER=:IDENTIFIER ORDER BY FAPPROVEDON DESC,FAPPROVEDTIME DESC) WHERE ROWNUM=1 ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":IDENTIFIER", DbType.Int32, identifier);

            return db.ExecuteReader(dbCmd);
        }

        #region Work Instruction

        public static IDataReader GetTaskGroupList(Database db, int siteID, string taskGroupName, int taskGroupTypeID, string taskGroupRefType)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT * FROM (SELECT FTASKGROUPID,FTASKGROUPNAME,FIDENTIFIER,FVERSION ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_TASKGROUP WHERE FSITEID=:SITEID AND FSTATUS='A' AND FREF_TYPE=:REF_TYPE ");

            if (!string.IsNullOrEmpty(taskGroupName))
                sqlCmdBuilder.Append(" AND UPPER(FTASKGROUPNAME) LIKE :TASKGROUPNAME ");

            if (taskGroupTypeID > 0)
                sqlCmdBuilder.Append(" AND FTASKGROUPTYPEID=:TASKGROUPTYPEID ");

            sqlCmdBuilder.Append(" ORDER BY FTIMESTAMP DESC) WHERE ROWNUM<=20 ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":REF_TYPE", DbType.AnsiString, taskGroupRefType);
            if (!string.IsNullOrEmpty(taskGroupName))
                db.AddInParameter(dbCmd, ":TASKGROUPNAME", DbType.AnsiString, "%" + taskGroupName.ToUpper() + "%");
            if (taskGroupTypeID > 0)
                db.AddInParameter(dbCmd, ":TASKGROUPTYPEID", DbType.Int32, taskGroupTypeID);

            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetTaskDetailsForTaskGroup(Database db, int siteID, int taskGroupID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FTASKID,FTASKNAME,FDESCRIPTION,FESTIMATEDTIME,FUNIT ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_TASKS WHERE FSITEID=:SITEID AND FREFERENCEID=:REFERENCEID AND FSTATUS='A' ORDER BY FSEQUENCENUM ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":REFERENCEID", DbType.Int32, taskGroupID);
            return db.ExecuteReader(dbCmd);
        }

        public static bool UpdateMaintenanceTaskGroupInfo(Database db, DbTransaction transaction, int siteID, int scheduleID, int identifier, int taskGroupID, int updatedBy, int updatedOn, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_SCHEDULE SET FTASKGROUPIDENTIFIER=:TASKGROUPIDENTIFIER,FTASKGROUPID=:TASKGROUPID ");
            sqlCmdBuilder.Append(" ,FUPDATEDBY=:UPDATEDBY,FUPDATEDON=:UPDATEDON,FUPDATEDTIME= :UPDATEDTIME ");
            sqlCmdBuilder.Append(" ,FINST_UPDATEDBY=:UPDATEDBY,FINST_UPDATEDON=:UPDATEDON,FINST_UPDATEDTIME=:UPDATEDTIME WHERE FSITEID=:SITEID AND FSCHEDULEID=:SCHEDULEID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":TASKGROUPIDENTIFIER", DbType.Int32, identifier);
            db.AddInParameter(dbCmd, ":TASKGROUPID", DbType.Int32, taskGroupID);
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":SCHEDULEID", DbType.Int32, scheduleID);
            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedOn);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);

            if (transaction != null)
                db.ExecuteNonQuery(dbCmd, transaction);
            else
                db.ExecuteNonQuery(dbCmd);
            return true;
        }

        #endregion

        #region Spare Parts

        public static IDataReader GetSparePartMaterialDetails(Database db, int siteID, string materialCode)
        {
            //Get spare parts IDH from plant material master
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT LTRIM(FIDHID,'0') AS FIDHID,FIDHDESC,FBASEUOM FROM LDB1_PLANTMATERIAL WHERE FSITEID=:SITEID AND FSTATUS='A' AND FTYPE='S' ");

            if (!string.IsNullOrEmpty(materialCode))
                sqlCmdBuilder.Append(" AND FIDHID=:IDHID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            if (!string.IsNullOrEmpty(materialCode))
                db.AddInParameter(dbCmd, ":IDHID", DbType.AnsiString, materialCode.Trim().ToUpper().PadLeft(18, '0'));
            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetMaintSparePartDetails(Database db, int siteID, int scheduleID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT LTRIM(SP.FIDHID,'0') AS FIDHID,M.FIDHDESC,M.FBASEUOM,SP.FQTY,'N' AS FISSOPSPAREPART  ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_SCHEDULE_SPAREPARTS SP INNER JOIN LDB1_PLANTMATERIAL M ON M.FIDHID=SP.FIDHID AND M.FSITEID=SP.FSITEID AND M.FSTATUS='A' ");
            sqlCmdBuilder.Append(" WHERE SP.FSITEID=:SITEID AND SP.FSCHEDULEID=:SCHEDULEID AND SP.FSTATUS='A' ");

            sqlCmdBuilder.Append(" UNION ");

            sqlCmdBuilder.Append(" SELECT LTRIM(TS.FIDHID,'0') AS FIDHID,M.FIDHDESC,M.FBASEUOM,SUM(TS.FQTY) AS FQTY,'Y' AS FISSOPSPAREPART  ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_SCHEDULE MS INNER JOIN LDB1_MAINT_TASKGROUP TG ON TG.FIDENTIFIER=MS.FTASKGROUPIDENTIFIER AND TG.FSITEID=MS.FSITEID AND TG.FSTATUS='A' ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_TASKS MT ON MT.FREFERENCEID=TG.FTASKGROUPID AND MT.FSITEID=TG.FSITEID AND MT.FSTATUS='A' ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_TASKSPARES TS ON TS.FTASKID=MT.FTASKID AND TS.FSITEID=MT.FSITEID AND TS.FSTATUS='A' ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_PLANTMATERIAL M ON M.FIDHID=TS.FIDHID AND M.FSITEID=TS.FSITEID AND M.FSTATUS='A' ");
            sqlCmdBuilder.Append(" WHERE MS.FSITEID=:SITEID AND MS.FSCHEDULEID=:SCHEDULEID AND MS.FSTATUS='A' ");
            sqlCmdBuilder.Append(" GROUP BY TS.FIDHID,M.FIDHDESC,M.FBASEUOM ");
            sqlCmdBuilder.Append(" ORDER BY FISSOPSPAREPART DESC");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":SCHEDULEID", DbType.Int32, scheduleID);

            return db.ExecuteReader(dbCmd);
        }

        public static int InsertMaintSparePartInfo(Database db, DbTransaction transaction, int siteID, int scheduleID, string material, decimal qty, int createdBy, int createdOn, int createdTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" INSERT INTO LDB1_MAINT_SCHEDULE_SPAREPARTS(FSITEID,FSCHEDULEID,FIDHID,FQTY,FSTATUS,FCREATEDBY,FCREATEDON,FCREATEDTIME,FUPDATEDBY,FUPDATEDON,FUPDATEDTIME) ");
            sqlCmdBuilder.Append(" VALUES(:SITEID,:SCHEDULEID,:IDHID,:QTY,'A',:CREATEDBY,:CREATEDON,:CREATEDTIME,:UPDATEDBY,:UPDATEDON,:UPDATEDTIME) ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":SCHEDULEID", DbType.Int32, scheduleID);
            db.AddInParameter(dbCmd, ":IDHID", DbType.AnsiString, material.Trim().ToUpper().PadLeft(18, '0'));
            db.AddInParameter(dbCmd, ":QTY", DbType.Decimal, qty);
            db.AddInParameter(dbCmd, ":CREATEDBY", DbType.Int32, createdBy);
            db.AddInParameter(dbCmd, ":CREATEDON", DbType.Int32, createdOn);
            db.AddInParameter(dbCmd, ":CREATEDTIME", DbType.Int32, createdTime);
            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, createdBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, createdOn);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, createdTime);

            return db.ExecuteNonQuery(dbCmd, transaction);
        }

        public static bool UpdateMaintSparePart(Database db, DbTransaction transaction, int siteID, int scheduleID, string materialCode, decimal qty, int createdBy, int createdDate, int createdTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_SCHEDULE_SPAREPARTS SET FQTY=:QTY,FSTATUS='A',FUPDATEDBY=:CREATEDBY,FUPDATEDON=:CREATEDON,FUPDATEDTIME=:CREATEDTIME ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FSCHEDULEID=:SCHEDULEID AND FIDHID=:IDHID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":SCHEDULEID", DbType.Int32, scheduleID);
            db.AddInParameter(dbCmd, ":IDHID", DbType.AnsiString, materialCode.Trim().ToUpper().PadLeft(18, '0'));
            db.AddInParameter(dbCmd, ":QTY", DbType.Decimal, qty);
            db.AddInParameter(dbCmd, ":CREATEDBY", DbType.Int32, createdBy);
            db.AddInParameter(dbCmd, ":CREATEDON", DbType.Int32, createdDate);
            db.AddInParameter(dbCmd, ":CREATEDTIME", DbType.Int32, createdTime);

            db.ExecuteNonQuery(dbCmd, transaction);
            return true;
        }

        public static int DeleteMaintSparePartInfo(Database db, DbTransaction transaction, int siteID, int scheduleID, int createdBy, int createdOn, int createdTime, string materialCode)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_SCHEDULE_SPAREPARTS SET FSTATUS='I',FUPDATEDBY=:UPDATEDBY,FUPDATEDON=:UPDATEDON,FUPDATEDTIME=:UPDATEDTIME WHERE FSITEID=:SITEID AND FSCHEDULEID=:SCHEDULEID ");
            if (!string.IsNullOrEmpty(materialCode))
                sqlCmdBuilder.Append(" AND FIDHID=:IDHID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":SCHEDULEID", DbType.Int32, scheduleID);
            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, createdBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, createdOn);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, createdTime);
            if (!string.IsNullOrEmpty(materialCode))
                db.AddInParameter(dbCmd, ":IDHID", DbType.AnsiString, materialCode.Trim().ToUpper().PadLeft(18, '0'));

            if (transaction != null)
                return db.ExecuteNonQuery(dbCmd, transaction);
            else
                return db.ExecuteNonQuery(dbCmd);
        }

        public static bool CheckMaintSparePartExists(Database db, DbTransaction transaction, int siteID, int scheduleID, string materialCode)
        {
            IDataReader dataReaderTaskName = null;
            bool isExists = false;

            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FIDHID FROM LDB1_MAINT_SCHEDULE_SPAREPARTS ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FSCHEDULEID=:SCHEDULEID AND FIDHID=:IDHID ");          //dO NOT CHECK with status

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":SCHEDULEID", DbType.Int32, scheduleID);
            db.AddInParameter(dbCmd, ":IDHID", DbType.AnsiString, materialCode.Trim().ToUpper().PadLeft(18, '0'));

            try
            {
                using (dataReaderTaskName = db.ExecuteReader(dbCmd, transaction))
                {
                    if (dataReaderTaskName.Read())
                    {
                        isExists = true;
                    }
                    dataReaderTaskName.Close();
                }

                return isExists;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (dataReaderTaskName != null && !dataReaderTaskName.IsClosed)
                    dataReaderTaskName.Close();
            }
        }
        #endregion

        #region Attachments

        public static IDataReader GetAttachmentDetailsForSchedule(Database db, int siteID, int scheduleID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FDOCUMENTID,FDOCUMENTNAME,FDOCUMENTTYPE FROM LDB1_MAINT_DOCUMENTS WHERE FSITEID=:SITEID AND FREFERENCEID=:REFERENCEID AND FREF_TYPE='ATTACHMENT' AND FSTATUS='A' ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":REFERENCEID", DbType.Int32, scheduleID);

            return db.ExecuteReader(dbCmd);
        }

        #endregion

        #region Create Schedule

        public static IDataReader GetMaintScheduleDetailInfo(Database db, int siteID, int scheduleID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FSCHEDULE_DTL_ID,FITEM_ID,FFREQUENCY,FINTERVAL,FBASEDONPERFDATE,FSTARTDATE,FSTARTTIME,FENDDATE,FENDNUM_OCCURENCE,FWEEK_DAY,FMONTH_OPTION,FMONTH_DAY,FMONTH_POSITION,FYEAR_OPTION,FYEAR_MONTH,FNOTIFYDAY ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_SCHEDULE_DTL WHERE FSITEID=:SITEID AND FSCHEDULEID=:SCHEDULEID AND FSTATUS='A' ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":SCHEDULEID", DbType.Int32, scheduleID);

            return db.ExecuteReader(dbCmd);
        }

        public static int InsertMaintenanceScheduleDetail(Database db, DbTransaction tranasction, int siteID, int scheduleID, int itemID, string frequency, int interval, bool basedOnPerfDate, int startDate, int startTime, int endDate, int endOccurence, string weekDay, int monthOption, string monthDay, string monthPosition, int yearOption, string yearMonth, int notifyDay, int createdBy, int createdOn, int createdTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" INSERT INTO LDB1_MAINT_SCHEDULE_DTL(FSCHEDULE_DTL_ID,FSITEID,FSCHEDULEID,FITEM_ID,FFREQUENCY,FINTERVAL,FBASEDONPERFDATE,FSTARTDATE,FSTARTTIME ");
            sqlCmdBuilder.Append(" ,FENDDATE,FENDNUM_OCCURENCE,FWEEK_DAY,FMONTH_OPTION,FMONTH_DAY,FMONTH_POSITION,FYEAR_OPTION,FYEAR_MONTH,FNOTIFYDAY,FCREATEDBY,FCREATEDON,FCREATEDTIME,FUPDATEDBY,FUPDATEDON,FUPDATEDTIME) ");
            sqlCmdBuilder.Append(" VALUES(SEQUENCE_MAINTSCHEDULE_DTLID.NEXTVAL,:SITEID,:SCHEDULEID,:ITEM_ID,:FREQUENCY,:INTERVAL,:BASEDONPERFDATE,:STARTDATE,:STARTTIME ");
            sqlCmdBuilder.Append(",:ENDDATE,:ENDNUM_OCCURENCE,:WEEK_DAY,:MONTH_OPTION,:MONTH_DAY,:MONTH_POSITION,:YEAR_OPTION,:YEAR_MONTH,:NOTIFYDAY,:CREATEDBY,:CREATEDON,:CREATEDTIME,:CREATEDBY,:CREATEDON,:CREATEDTIME) ");
            sqlCmdBuilder.Append(" RETURNING FSCHEDULE_DTL_ID INTO :SCHEDULE_DTL_ID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddOutParameter(dbCmd, ":SCHEDULE_DTL_ID", DbType.Int32, sizeof(Int32));
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":SCHEDULEID", DbType.Int32, scheduleID);
            db.AddInParameter(dbCmd, ":ITEM_ID", DbType.Int32, itemID);
            db.AddInParameter(dbCmd, ":FREQUENCY", DbType.AnsiString, frequency.Trim());
            db.AddInParameter(dbCmd, ":INTERVAL", DbType.Int32, interval);
            db.AddInParameter(dbCmd, ":BASEDONPERFDATE", DbType.AnsiStringFixedLength, basedOnPerfDate ? 'Y' : 'N');
            db.AddInParameter(dbCmd, ":STARTDATE", DbType.Int32, startDate);
            db.AddInParameter(dbCmd, ":STARTTIME", DbType.Int32, startTime);
            db.AddInParameter(dbCmd, ":ENDDATE", DbType.Int32, endDate);
            db.AddInParameter(dbCmd, ":ENDNUM_OCCURENCE", DbType.Int32, endOccurence);
            db.AddInParameter(dbCmd, ":WEEK_DAY", DbType.AnsiString, weekDay.Trim());
            db.AddInParameter(dbCmd, ":MONTH_OPTION", DbType.Int32, monthOption);
            db.AddInParameter(dbCmd, ":MONTH_DAY", DbType.AnsiString, monthDay.Trim());
            db.AddInParameter(dbCmd, ":MONTH_POSITION", DbType.AnsiString, monthPosition.Trim());
            db.AddInParameter(dbCmd, ":YEAR_OPTION", DbType.Int32, yearOption);
            db.AddInParameter(dbCmd, ":YEAR_MONTH", DbType.AnsiString, yearMonth);
            db.AddInParameter(dbCmd, ":NOTIFYDAY", DbType.Int32, notifyDay);
            db.AddInParameter(dbCmd, ":CREATEDBY", DbType.Int32, createdBy);
            db.AddInParameter(dbCmd, ":CREATEDON", DbType.Int32, createdOn);
            db.AddInParameter(dbCmd, ":CREATEDTIME", DbType.Int32, createdTime);

            db.ExecuteNonQuery(dbCmd, tranasction);

            return Convert.ToInt32(db.GetParameterValue(dbCmd, ":SCHEDULE_DTL_ID").ToString());
        }

        public static bool UpdateMaintenanceScheduleDetail(Database db, DbTransaction tranasction, int siteID, int schedule_dtl_id, int itemID, string frequency, int interval, bool basedOnPerfDate, int startDate, int startTime, int endDate, int endOccurence, string weekDay, int monthOption, string monthDay, string monthPosition, int yearOption, string yearMonth, int notifyDay, int updatedBy, int updatedOn, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_SCHEDULE_DTL SET FFREQUENCY=:FREQUENCY,FINTERVAL=:INTERVAL,FBASEDONPERFDATE=:BASEDONPERFDATE,FSTARTDATE=:STARTDATE ");
            sqlCmdBuilder.Append(",FSTARTTIME=:STARTTIME,FENDDATE=:ENDDATE,FENDNUM_OCCURENCE=:ENDNUM_OCCURENCE,FWEEK_DAY=:WEEK_DAY,FMONTH_OPTION=:MONTH_OPTION,FMONTH_DAY=:MONTH_DAY ");
            sqlCmdBuilder.Append(",FMONTH_POSITION=:MONTH_POSITION,FYEAR_OPTION=:YEAR_OPTION,FYEAR_MONTH=:YEAR_MONTH,FNOTIFYDAY=:NOTIFYDAY,FUPDATEDBY=:UPDATEDBY,FUPDATEDON=:UPDATEDON,FUPDATEDTIME=:UPDATEDTIME ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FSCHEDULE_DTL_ID=:SCHEDULE_DTL_ID AND FITEM_ID=:ITEM_ID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SCHEDULE_DTL_ID", DbType.Int32, schedule_dtl_id);
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":ITEM_ID", DbType.Int32, itemID);
            db.AddInParameter(dbCmd, ":FREQUENCY", DbType.AnsiString, frequency.Trim());
            db.AddInParameter(dbCmd, ":INTERVAL", DbType.Int32, interval);
            db.AddInParameter(dbCmd, ":BASEDONPERFDATE", DbType.AnsiStringFixedLength, basedOnPerfDate ? 'Y' : 'N');
            db.AddInParameter(dbCmd, ":STARTDATE", DbType.Int32, startDate);
            db.AddInParameter(dbCmd, ":STARTTIME", DbType.Int32, startTime);
            db.AddInParameter(dbCmd, ":ENDDATE", DbType.Int32, endDate);
            db.AddInParameter(dbCmd, ":ENDNUM_OCCURENCE", DbType.Int32, endOccurence);
            db.AddInParameter(dbCmd, ":WEEK_DAY", DbType.AnsiString, weekDay.Trim());
            db.AddInParameter(dbCmd, ":MONTH_OPTION", DbType.Int32, monthOption);
            db.AddInParameter(dbCmd, ":MONTH_DAY", DbType.AnsiString, monthDay.Trim());
            db.AddInParameter(dbCmd, ":MONTH_POSITION", DbType.AnsiString, monthPosition.Trim());
            db.AddInParameter(dbCmd, ":YEAR_OPTION", DbType.Int32, yearOption);
            db.AddInParameter(dbCmd, ":YEAR_MONTH", DbType.AnsiString, yearMonth);
            db.AddInParameter(dbCmd, ":NOTIFYDAY", DbType.Int32, notifyDay);
            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedOn);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);

            db.ExecuteNonQuery(dbCmd, tranasction);

            return true;
        }

        public static bool UpdateScheduleRuleDisplayTextFormat(Database db, DbTransaction transaction, int siteID, int scheduleID, int scheduleRuleType, string scheduleRuleDesc)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_SCHEDULE SET FSCHD_RULE_DESC_TYPE=:SCHD_RULE_DESC_TYPE,FSCHD_RULE_DESC=:SCHD_RULE_DESC WHERE FSITEID=:SITEID AND FSCHEDULEID=:SCHEDULEID AND FSTATUS='A' ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SCHD_RULE_DESC_TYPE", DbType.Int32, scheduleRuleType);
            db.AddInParameter(dbCmd, ":SCHD_RULE_DESC", DbType.AnsiString, scheduleRuleDesc.Trim());
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":SCHEDULEID", DbType.Int32, scheduleID);

            db.ExecuteNonQuery(dbCmd, transaction);
            return true;
        }

        public static IDataReader GetScheduleWorkOrderDetails(Database db, int siteID, int scheduleID, string status, int pageIndex, int pageSize)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT * FROM (SELECT B.*,MAX(ROWNUM) OVER () AS FCOUNT,ROWNUM AS FROWINDEX FROM (  ");
            sqlCmdBuilder.Append(" SELECT LTRIM(FWORK_ORDERID,'0') AS FWORK_ORDERID,FWORKORDERSTATUS,FPLANNEDDATE,FPLANNEDTIME,FSCHEDULEDATE,FSCHEDULETIME,FSTARTDATE,FSTARTTIME,FENDDATE,FENDTIME ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_WORKORDER WHERE FSITEID=:SITEID AND FREF_SCHEDULEID=:REF_SCHEDULEID AND FWORKORDERSTATUS<>'INACTIVE' ");

            if (!string.IsNullOrEmpty(status))
                sqlCmdBuilder.Append(" AND FWORKORDERSTATUS=:STATUS ");

            sqlCmdBuilder.Append(" ORDER BY FSCHEDULEDATE,FSCHEDULETIME)B) ");

            if (pageSize > 0)
            {
                if (pageIndex > 0)
                    sqlCmdBuilder.Append(" WHERE FROWINDEX BETWEEN :PAGEINDEX AND (:PAGEINDEX+:PAGESIZE)-1 ");
                else
                    sqlCmdBuilder.Append(" WHERE FROWINDEX BETWEEN :PAGEINDEX AND :PAGESIZE ");
            }

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":REF_SCHEDULEID", DbType.Int32, scheduleID);
            if (!string.IsNullOrEmpty(status))
                db.AddInParameter(dbCmd, ":STATUS", DbType.AnsiString, status);

            if (pageSize > 0)
            {
                db.AddInParameter(dbCmd, ":PAGEINDEX", DbType.Int32, pageIndex);
                db.AddInParameter(dbCmd, ":PAGESIZE", DbType.Int32, pageSize);
            }

            return db.ExecuteReader(dbCmd);
        }

        #endregion

        #endregion

        #region Auto Reschedule Work Order

        public static DataTable GetYesterdaysWorkOrderForReschedule(Database db, int siteID, int previousDate)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FWORK_ORDERID,FWORKORDERSTATUS,FREF_SCHEDULE_DTL_ID,FSCHEDULETIME FROM ");
            sqlCmdBuilder.Append(" LDB1_MAINT_WORKORDER  WHERE FSITEID=:SITEID AND FWORKORDERSTATUS  IN ('SCHEDULED','INPROGRESS') AND FSCHEDULEDATE=:SCHEDULEDATE "); //'COMPLETED' orders should be included until they are closed
            sqlCmdBuilder.Append(" ORDER BY FWORK_ORDERID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":SCHEDULEDATE", DbType.Int32, previousDate);

            return db.ExecuteDataSet(dbCmd).Tables[0];
        }

        public static bool CheckWorkOrderExistsForToday(Database db, int siteID, int schedule_dtl_id, int currentDate)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FWORK_ORDERID FROM LDB1_MAINT_WORKORDER WHERE FSITEID=:SITEID ");
            sqlCmdBuilder.Append(" AND FREF_SCHEDULE_DTL_ID=:REF_SCHEDULE_DTL_ID AND FSCHEDULEDATE=:SCHEDULEDATE AND FWORKORDERSTATUS='SCHEDULED' ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":REF_SCHEDULE_DTL_ID", DbType.Int32, schedule_dtl_id);
            db.AddInParameter(dbCmd, ":SCHEDULEDATE", DbType.Int32, currentDate);

            bool isExists = false;
            IDataReader dataReaderInfo = null;
            try
            {
                dataReaderInfo = db.ExecuteReader(dbCmd);
                if (dataReaderInfo.Read())
                {
                    isExists = true;
                }
                dataReaderInfo.Close();

                return isExists;
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                if (dataReaderInfo != null && !dataReaderInfo.IsClosed)
                    dataReaderInfo.Close();
            }
        }

        public static bool UpdateMaintWorkOrderStatus(Database db, DbTransaction transaction, int siteID, string workOrderID, string status, int updatedBy, int updatedON, int updatedTime, int scheduleID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_WORKORDER SET FWORKORDERSTATUS=:STATUS ");
            sqlCmdBuilder.Append(" ,FUPDATEDBY=:UPDATEDBY,FUPDATEDON=:UPDATEDON,FUPDATEDTIME=:UPDATEDTIME ");

            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FWORKORDERSTATUS IN ('SCHEDULED','OVERDUE','CREATED','CANCELLED') ");

            if (!string.IsNullOrEmpty(workOrderID))
                sqlCmdBuilder.Append(" AND FWORK_ORDERID=:WORK_ORDERID ");
            if (scheduleID > 0)
                sqlCmdBuilder.Append(" AND FREF_SCHEDULEID=:REF_SCHEDULEID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            if (!string.IsNullOrEmpty(workOrderID))
                db.AddInParameter(dbCmd, ":WORK_ORDERID", DbType.AnsiString, workOrderID.Trim().PadLeft(12, '0'));

            if (scheduleID > 0)
                db.AddInParameter(dbCmd, ":REF_SCHEDULEID", DbType.Int32, scheduleID);

            db.AddInParameter(dbCmd, ":STATUS", DbType.AnsiString, status.Trim().ToUpper());
            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedON);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);

            if (transaction != null)
                db.ExecuteNonQuery(dbCmd, transaction);
            else
                db.ExecuteNonQuery(dbCmd);
            return true;
        }

        #endregion

        #region Auto Update Maintenance Schedule

        public static DataTable GetSchedulesForAutoRecalculate(Database db, int siteID, int currentDate)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT * FROM (SELECT SD.FSCHEDULE_DTL_ID,SD.FSCHEDULEID FROM LDB1_MAINT_SCHEDULE S ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_SCHEDULE_DTL SD ON SD.FSCHEDULEID=S.FSCHEDULEID AND SD.FSITEID=S.FSITEID AND SD.FSTATUS='A' ");
            sqlCmdBuilder.Append(" WHERE S.FSITEID=:SITEID AND S.FSTATUS='A' AND S.FSCHEDULESTATUS='SCHEDULING' ");
            sqlCmdBuilder.Append(" AND (SD.FUPDATEDON >= TO_NUMBER(TO_CHAR(ADD_MONTHS(TO_DATE(:CURRENTDATE,'YYYYMMDD'),-2),'YYYYMMDD')) OR S.FUPDATEDON >= TO_NUMBER(TO_CHAR(ADD_MONTHS(TO_DATE(:CURRENTDATE,'YYYYMMDD'),-2),'YYYYMMDD'))) ");
            sqlCmdBuilder.Append(" ORDER BY S.FSCHEDULEID,SD.FSCHEDULE_DTL_ID) WHERE ROWNUM<=5 ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":CURRENTDATE", DbType.Int32, currentDate);
            return db.ExecuteDataSet(dbCmd).Tables[0];
        }

        public static bool CheckWorkOrderWithPlannedTimeExists(Database db, DbTransaction transaction, int siteID, int schedule_dtl_id, int plannedDate, int plannedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FWORK_ORDERID FROM LDB1_MAINT_WORKORDER ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FREF_SCHEDULE_DTL_ID=:REF_SCHEDULE_DTL_ID AND FPLANNEDDATE=:PLANNEDDATE AND FPLANNEDTIME=:PLANNEDTIME AND FWORKORDERSTATUS<>'INACTIVE' ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":REF_SCHEDULE_DTL_ID", DbType.Int32, schedule_dtl_id);
            db.AddInParameter(dbCmd, ":PLANNEDDATE", DbType.Int32, plannedDate);
            db.AddInParameter(dbCmd, ":PLANNEDTIME", DbType.Int32, plannedTime);

            IDataReader dataReader = null;
            bool isExists = false;
            try
            {
                dataReader = db.ExecuteReader(dbCmd, transaction);
                if (dataReader.Read())
                {
                    isExists = true;
                }
                dataReader.Close();
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                if (dataReader != null && !dataReader.IsClosed)
                    dataReader.Close();
            }
            return isExists;
        }

        public static DataTable GetSchedulesBasedOnLastPeformanceDate(Database db, int siteID, int previousDate)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT DISTINCT SD.FSCHEDULE_DTL_ID,SD.FSCHEDULEID FROM LDB1_MAINT_WORKORDER W ");//adding distinct in case of over due orders and scheduled orders are completed on same day
            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_SCHEDULE_DTL SD ON SD.FSCHEDULE_DTL_ID=W.FREF_SCHEDULE_DTL_ID AND SD.FSITEID=W.FSITEID ");
            sqlCmdBuilder.Append(" AND SD.FBASEDONPERFDATE='Y' AND ((SD.FFREQUENCY='DAILY' AND SD.FINTERVAL>1) OR SD.FFREQUENCY<>'DAILY') ");
            sqlCmdBuilder.Append(" WHERE W.FSITEID=:SITEID AND W.FENDDATE=:ENDDATE AND W.FENDDATE>W.FPLANNEDDATE ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":ENDDATE", DbType.Int32, previousDate);
            return db.ExecuteDataSet(dbCmd).Tables[0];
        }

        public static DataTable GetLastExecutedWorkOrderForSchedule(Database db, DbTransaction transaction, int siteID, int schedule_dtl_id)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT * FROM (SELECT FWORK_ORDERID,FPLANNEDDATE,FPLANNEDTIME,FENDDATE,FENDTIME,FWORKORDERSTATUS ");
            sqlCmdBuilder.Append("  FROM LDB1_MAINT_WORKORDER WHERE FSITEID=:SITEID AND FREF_SCHEDULE_DTL_ID=:REF_SCHEDULE_DTL_ID ");
            sqlCmdBuilder.Append("  AND FWORKORDERSTATUS IN ('INPROGRESS','COMPLETED','CLOSED') ORDER BY FSTARTDATE DESC,FSTARTTIME DESC) WHERE ROWNUM=1 ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":REF_SCHEDULE_DTL_ID", DbType.Int32, schedule_dtl_id);
            return db.ExecuteDataSet(dbCmd, transaction).Tables[0];
        }

        public static DataTable GetTotalScheduledWorkOrdersAvailable(Database db, DbTransaction transaction, int siteID, int schedule_dtl_id, int startDate, int startTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT COUNT(FWORK_ORDERID) AS FCOUNT FROM LDB1_MAINT_WORKORDER WHERE FSITEID=:SITEID AND FREF_SCHEDULE_DTL_ID=:REF_SCHEDULE_DTL_ID ");
            sqlCmdBuilder.Append(" AND FWORKORDERSTATUS='SCHEDULED' AND (FSCHEDULEDATE>:SCHEDULEDATE OR (FSCHEDULEDATE=:SCHEDULEDATE AND FSCHEDULETIME>=:SCHEDULETIME)) ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":REF_SCHEDULE_DTL_ID", DbType.Int32, schedule_dtl_id);
            db.AddInParameter(dbCmd, ":SCHEDULEDATE", DbType.Int32, startDate);
            db.AddInParameter(dbCmd, ":SCHEDULETIME", DbType.Int32, startTime);
            return db.ExecuteDataSet(dbCmd, transaction).Tables[0];
        }

        #endregion

        #region Maintenance checklist Schedule
        public static IDataReader GetMeasurementDocumentInfo(Database db, int siteID, int maintScheduleID)
        {
            StringBuilder sqlCommandBuilder = new StringBuilder();
            sqlCommandBuilder.Append(" SELECT MS.FMAINTENANCENAME,MS.FWORKGROUPID,MS.FSCHEDULESTATUS,MD.FSCHEDULE_DTL_ID ");
            sqlCommandBuilder.Append(" FROM LDB1_MAINT_SCHEDULE MS");
            sqlCommandBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_SCHEDULE_DTL MD ON MD.FSCHEDULEID=MS.FSCHEDULEID AND MD.FITEM_ID=1 AND MD.FSTATUS='A' ");
            sqlCommandBuilder.Append(" WHERE MS.FSCHEDULEID=:SCHEDULEID AND MS.FSITEID=:SITEID AND MS.FSCHEDULE_TYPE='I' AND MS.FSTATUS='A' ");

            DbCommand dbCommand = db.GetSqlStringCommand(sqlCommandBuilder.ToString());
            dbCommand.CommandType = CommandType.Text;
            db.AddInParameter(dbCommand, ":SCHEDULEID", DbType.Int32, maintScheduleID);
            db.AddInParameter(dbCommand, ":SITEID", DbType.Int32, siteID);

            return db.ExecuteReader(dbCommand);
        }

        public static IDataReader GetMeasDocMeasuringPoints(Database db, int siteID, int pageSize, int pageIndex, int scheduleID, string fLocationIDs, string equipmentIDs, string measuringPoint, string categoryIDs, string sortType, bool isConsiderSelected, int userID, bool restrictAccess, int workGroupID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();

            if (pageSize > 0)
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");

            sqlCmdBuilder.Append(" SELECT DISTINCT MP.FMEASURINGPOINTID,MP.FMEASURINGPOINTCODE,MP.FMEASURINGPOINTNAME,C.FNAME AS FCATEGORY ");
            sqlCmdBuilder.Append(" ,DECODE(ML1.FLOCATIONNAME,'', ML2.FLOCATIONNAME,ML1.FLOCATIONNAME) AS FLOCATIONNAME ");
            sqlCmdBuilder.Append(" ,ME.FEQUIPMENTNAME,MP.FUPDATEDON,MP.FUPDATEDTIME ");

            sqlCmdBuilder.Append(" FROM LDB1_MAINT_MEASURINGPOINT MP ");
            if (isConsiderSelected)
                sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_MEAS_DOCS MD ON MD.FSITEID=MP.FSITEID AND MD.FMEASURINGPOINTID=MP.FMEASURINGPOINTID ");

            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_MASTER C ON C.FMASTERID=MP.FCATEGORYID AND C.FSITEID=MP.FSITEID AND C.FSTATUS='A' AND C.FTYPE='MP_CATEGORY' ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_LOCATIONS ML1 ON ML1.FLOCATIONID=MP.FPARENTID AND MP.FPARENTTYPE='L' ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_EQUIPMENT ME ON ME.FEQUIPMENTID=MP.FPARENTID AND MP.FPARENTTYPE='E' ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_LOCATIONS ML2 ON ML2.FLOCATIONID=ME.FLOCATIONID ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_AUTH_GROUP MA ON ((MA.FREFERENCEID=ME.FEQUIPMENTID AND MA.FTYPE='EQUIPMENT') OR (MA.FREFERENCEID=DECODE(NVL(ML1.FLOCATIONID,0),0, ML2.FLOCATIONID,ML1.FLOCATIONID) AND MA.FTYPE='LOCATION')) AND  MA.FSITEID=MP.FSITEID AND MA.FSTATUS='A' ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_WORKGROUPUSER MW ON MW.FWORKGROUPID=MA.FWORKGROUPID AND MW.FSITEID=MA.FSITEID AND MW.FSTATUS='A' ");

            sqlCmdBuilder.Append(" WHERE MP.FSITEID=:SITEID AND MP.FSTATUS='A' AND MP.FPARENTID>0 AND MP.FPARENTTYPE IN ('L','E') ");
            if (userID > 0 && restrictAccess)
            {
                sqlCmdBuilder.Append(" AND (MA.FREFERENCEID IS NULL OR MW.FUSERID=:USERID) ");
            }
            if (isConsiderSelected)
                sqlCmdBuilder.Append(" AND MD.FSCHEDULEID=:SCHEDULEID AND MD.FSTATUS='A' ");

            if (!string.IsNullOrEmpty(fLocationIDs))
            {
                sqlCmdBuilder.Append(" AND (ML1.FLOCATIONID IN (" + fLocationIDs.Trim() + ") OR ML2.FLOCATIONID IN (" + fLocationIDs.Trim() + ")) ");
            }
            if (!string.IsNullOrEmpty(equipmentIDs))
            {
                sqlCmdBuilder.Append(" AND ME.FEQUIPMENTID IN (" + equipmentIDs.Trim() + ") ");
            }
            if (!string.IsNullOrEmpty(measuringPoint))
            {
                sqlCmdBuilder.Append(" AND UPPER(MP.FMEASURINGPOINTNAME) LIKE :MEASURINGPOINTNAME ");
            }
            if (!string.IsNullOrEmpty(categoryIDs))
            {
                sqlCmdBuilder.Append(" AND C.FMASTERID IN (" + categoryIDs.Trim() + ") ");
            }

            if (workGroupID > 0)
            {
                sqlCmdBuilder.Append(" AND MW.FWORKGROUPID=:WORKGROUPID ");
            }

            #region Sorting
            switch (sortType)
            {
                case "FLocationName_asc":
                    sqlCmdBuilder.Append(" ORDER BY FLOCATIONNAME ASC ");
                    break;
                case "FLocationName_desc":
                    sqlCmdBuilder.Append(" ORDER BY FLOCATIONNAME DESC ");
                    break;
                case "Equipment_asc":
                    sqlCmdBuilder.Append(" ORDER BY FEQUIPMENTNAME ASC ");
                    break;
                case "Equipment_desc":
                    sqlCmdBuilder.Append(" ORDER BY FEQUIPMENTNAME DESC ");
                    break;
                case "MeasuringPoint_asc":
                    sqlCmdBuilder.Append(" ORDER BY MP.FMEASURINGPOINTNAME ASC ");
                    break;
                case "MeasuringPoint_desc":
                    sqlCmdBuilder.Append(" ORDER BY MP.FMEASURINGPOINTNAME DESC ");
                    break;
                case "Category_asc":
                    sqlCmdBuilder.Append(" ORDER BY FCATEGORY ASC ");
                    break;
                case "Category_desc":
                    sqlCmdBuilder.Append(" ORDER BY FCATEGORY DESC ");
                    break;
                default:
                    sqlCmdBuilder.Append(" ORDER BY MP.FUPDATEDON||MP.FUPDATEDTIME DESC ");
                    break;
            }
            #endregion

            #region Paging
            if (pageSize > 0)
            {
                if (pageIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:PAGEINDEX)  AND (:PAGESIZE + (:PAGEINDEX - 1))");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:PAGEINDEX)  AND  (:PAGESIZE + (:PAGEINDEX))");
            }
            #endregion

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            if (isConsiderSelected)
                db.AddInParameter(dbCmd, ":SCHEDULEID", DbType.Int32, scheduleID);

            if (userID > 0 && restrictAccess)
            {
                db.AddInParameter(dbCmd, ":USERID", DbType.Int32, userID);
            }
            if (!string.IsNullOrEmpty(measuringPoint))
            {
                db.AddInParameter(dbCmd, ":MEASURINGPOINTNAME", DbType.String, "%" + measuringPoint.Trim().ToUpper() + "%");
            }
            if (workGroupID > 0)
            {
                db.AddInParameter(dbCmd, ":WORKGROUPID", DbType.Int32, workGroupID);
            }

            if (pageSize > 0)
            {
                db.AddInParameter(dbCmd, ":PAGEINDEX", DbType.Int32, pageIndex);
                db.AddInParameter(dbCmd, ":PAGESIZE", DbType.Int32, pageSize);
            }

            return db.ExecuteReader(dbCmd);
        }

        public static bool InsertMeasuringPointForSchedule(Database db, DbTransaction transaction, int siteID, int scheduleID, int measuringPointID, int updatedBy, int updatedOn, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" INSERT INTO LDB1_MAINT_MEAS_DOCS(FSCHEDULEID,FSITEID,FITEMID,FMEASURINGPOINTID,FSTATUS,FUPDATEDBY,FUPDATEDON,FUPDATEDTIME) ");
            sqlCmdBuilder.Append(" VALUES (:SCHEDULEID,:SITEID,(SELECT NVL(MAX(FITEMID),0)+1 FROM LDB1_MAINT_MEAS_DOCS WHERE FSITEID=:SITEID AND FSCHEDULEID=:SCHEDULEID),:MEASURINGPOINTID,'A',:UPDATEDBY,:UPDATEDON,:UPDATEDTIME) ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SCHEDULEID", DbType.Int32, scheduleID);
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":MEASURINGPOINTID", DbType.Int32, measuringPointID);
            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedOn);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);

            db.ExecuteNonQuery(dbCmd, transaction);

            return true;
        }

        public static bool UpdateMeasuringPointForSchedule(Database db, DbTransaction transaction, int siteID, int scheduleID, int measuringPointID, int updatedBy, int updatedOn, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_MEAS_DOCS SET FITEMID=(SELECT NVL(MAX(FITEMID),0)+1 FROM LDB1_MAINT_MEAS_DOCS WHERE FSITEID=:SITEID AND FSCHEDULEID=:SCHEDULEID),FSTATUS='A',FUPDATEDBY=:UPDATEDBY,FUPDATEDON=:UPDATEDON,FUPDATEDTIME=:UPDATEDTIME ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FSCHEDULEID=:SCHEDULEID AND FMEASURINGPOINTID=:MEASURINGPOINTID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SCHEDULEID", DbType.Int32, scheduleID);
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":MEASURINGPOINTID", DbType.Int32, measuringPointID);
            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedOn);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);

            db.ExecuteNonQuery(dbCmd, transaction);

            return true;
        }

        public static IDataReader CheckMeasuringPointExistForSchedule(Database db, DbTransaction transaction, int siteID, int scheduleID, int measuringPointID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FMEASURINGPOINTID,FSTATUS FROM LDB1_MAINT_MEAS_DOCS ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FSCHEDULEID=:SCHEDULEID AND FMEASURINGPOINTID=:MEASURINGPOINTID ");          //dO NOT CHECK with status

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SCHEDULEID", DbType.Int32, scheduleID);
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":MEASURINGPOINTID", DbType.Int32, measuringPointID);

            return db.ExecuteReader(dbCmd, transaction);
        }

        public static bool DeleteSelectedMeasuringPoint(Database db, int siteID, int scheduleID, int measuringPointID, int updatedBy, int updatedOn, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_MEAS_DOCS SET FSTATUS='I',FUPDATEDBY=:UPDATEDBY,FUPDATEDON=:UPDATEDON,FUPDATEDTIME=:UPDATEDTIME ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FSCHEDULEID=:SCHEDULEID AND FMEASURINGPOINTID=:MEASURINGPOINTID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SCHEDULEID", DbType.Int32, scheduleID);
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":MEASURINGPOINTID", DbType.Int32, measuringPointID);
            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedOn);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);

            db.ExecuteNonQuery(dbCmd);

            return true;
        }
        #endregion

        #region Work Group
        public static IDataReader GetUserInfoForAutoCompleteBox(Database db, int siteID, string searchString, bool excelUsername)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT DISTINCT U.FUSERID ");

            if (excelUsername)
                sqlCmdBuilder.Append(" ,U.FUSERNAME ");
            else
                sqlCmdBuilder.Append(" ,(U.FFIRSTNAME || ' ' || U.FLASTNAME) AS FUSERNAME ");

            sqlCmdBuilder.Append(" FROM LDB1_USERINFO U ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_USERROLE R ON R.FUSERID=U.FUSERID AND (NVL(U.FSITEID,0)=R.FSITEID OR NVL(U.FREGDEFAULTSITEID,0)=R.FSITEID) ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_ROLE_TASKS TR ON TR.FROLEID = R.FROLEID ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_TASKS T ON T.FTASKID=TR.FTASKID AND UPPER(T.FCATEGORY) IN('CONFIGURE MAINTENANCE MASTER','MAINTENANCE') AND T.FSTATUS='A' ");
            sqlCmdBuilder.Append(" WHERE (U.FSITEID=:SITEID OR U.FREGDEFAULTSITEID=:SITEID) AND U.FSTATUS='A' ");

            if (searchString.Length > 0 && !excelUsername)
                sqlCmdBuilder.Append(" AND ((UPPER(U.FFIRSTNAME) LIKE UPPER(:USERNAME)) OR (UPPER(U.FLASTNAME) LIKE UPPER(:USERNAME))) ");
            else if (searchString.Length > 0 && excelUsername)
                sqlCmdBuilder.Append(" AND UPPER(U.FUSERNAME)=:USERNAME ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            if (searchString.Trim().Length > 0 && !excelUsername)
                db.AddInParameter(dbCmd, ":USERNAME", DbType.String, "%" + searchString.Trim().ToUpper() + "%");
            else if (searchString.Trim().Length > 0 && excelUsername)
                db.AddInParameter(dbCmd, ":USERNAME", DbType.String, searchString.Trim().ToUpper());

            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetWorkGroupInfo(Database db, DbTransaction transaction, int siteID, string type, int masterID, string masterDataName, bool isCheckExist)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FMASTERID,FNAME,FDESCRIPTION,FSTATUS ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_MASTER ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FTYPE=:TYPE ");

            if (isCheckExist && masterID > 0)
                sqlCmdBuilder.Append(" AND FMASTERID<>:MASTERID ");

            else if (!isCheckExist && masterID > 0)                         
               sqlCmdBuilder.Append(" AND FSTATUS='A' AND FMASTERID=:MASTERID ");
                         
            if (!string.IsNullOrEmpty(masterDataName))
            {
                sqlCmdBuilder.Append(" AND UPPER(FNAME) LIKE :WORKGROUPNAME ");
            }

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":TYPE", DbType.AnsiStringFixedLength, type.Trim().ToUpper());

            if (masterID > 0)
                db.AddInParameter(dbCmd, ":MASTERID", DbType.Int32, masterID);

            if (!string.IsNullOrEmpty(masterDataName))
                db.AddInParameter(dbCmd, ":WORKGROUPNAME", DbType.String, masterDataName.Trim().ToUpper());

            if (transaction != null)
                return db.ExecuteReader(dbCmd, transaction);
            else
                return db.ExecuteReader(dbCmd);
        }

        public static int GetWorkGroupMaxItemID(Database db, DbTransaction transaction, int workGroupID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();

            sqlCmdBuilder.Append(" SELECT NVL(MAX(FITEMID),0) + 1 AS MAXITEMID ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_WORKGROUPUSER  WHERE FWORKGROUPID =:WORKGROUPID ");          //DO NOT CHECK WITH AND FSTATUS='A'

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":WORKGROUPID", DbType.Int32, workGroupID);

            return Convert.ToInt32(db.ExecuteScalar(dbCmd, transaction).ToString());

        }

        public static DataTable GetWorkGroupUserInfo(Database db, DbTransaction transaction, int siteID, int masterID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT W.FUSERID,W.FITEMID,W.FUSERTYPE,W.FSCH_NOTIFY,W.FWORKSTART_NOTIFY,W.FWORKFINISH_NOTIFY,W.FREPORTISSUE_NOTIFY,W.FDOWNTIME_NOTIFY,(U.FFIRSTNAME || ' ' || U.FLASTNAME) AS FUSERNAME ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_WORKGROUPUSER W ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_USERINFO U ON W.FUSERID=U.FUSERID ");
            sqlCmdBuilder.Append(" AND (NVL(U.FSITEID,0)=W.FSITEID OR NVL(U.FREGDEFAULTSITEID,0)=W.FSITEID) AND U.FSTATUS='A' ");
            sqlCmdBuilder.Append(" WHERE W.FSITEID=:SITEID AND W.FSTATUS='A' AND W.FWORKGROUPID=:WORKGROUPID ORDER BY W.FITEMID");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":WORKGROUPID", DbType.Int32, masterID);

            DataTable workGroupInfo;
            if (transaction == null)
            {
                workGroupInfo = db.ExecuteDataSet(dbCmd).Tables[0];
            }
            else
            {
                workGroupInfo = db.ExecuteDataSet(dbCmd, transaction).Tables[0];
            }
            return workGroupInfo;
        }

        public static void InsertWorkGroupUserData(Database db, DbTransaction transaction, int workGroupID, int itemID, int userID, bool isScheduleNotify,
            bool workStartNotify, bool workFinishNotify, bool reportIssueNotify, bool downtimeNotify, string userType, int siteID, int createdBy, int createdOn, int createdTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" INSERT INTO LDB1_MAINT_WORKGROUPUSER (FWORKGROUPID,FITEMID,FUSERID,FSITEID,FSCH_NOTIFY,FWORKSTART_NOTIFY,FWORKFINISH_NOTIFY,FREPORTISSUE_NOTIFY ");
            sqlCmdBuilder.Append(" ,FDOWNTIME_NOTIFY,FUSERTYPE,FCREATEDBY,FCREATEDDATE,FCREATEDTIME,FUPDATEDBY,FUPDATEDON,FUPDATEDTIME) ");

            sqlCmdBuilder.Append(" VALUES(:WORKGROUPID,:ITEMID,:USERID,:SITEID,:SCH_NOTIFY,:WORKSTART_NOTIFY,:WORKFINISH_NOTIFY,:REPORTISSUE_NOTIFY ");
            sqlCmdBuilder.Append(" ,:DOWNTIME_NOTIFY,:USERTYPE,:CREATEDBY,:CREATEDON,:CREATEDTIME,:CREATEDBY,:CREATEDON,:CREATEDTIME) ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":WORKGROUPID", DbType.Int32, workGroupID);
            db.AddInParameter(dbCmd, ":ITEMID", DbType.Int32, itemID);
            db.AddInParameter(dbCmd, ":USERID", DbType.Int32, userID);
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":SCH_NOTIFY", DbType.AnsiStringFixedLength, isScheduleNotify == true ? 'Y' : 'N');
            db.AddInParameter(dbCmd, ":WORKSTART_NOTIFY", DbType.AnsiStringFixedLength, workStartNotify == true ? 'Y' : 'N');
            db.AddInParameter(dbCmd, ":WORKFINISH_NOTIFY", DbType.AnsiStringFixedLength, workFinishNotify == true ? 'Y' : 'N');
            db.AddInParameter(dbCmd, ":REPORTISSUE_NOTIFY", DbType.AnsiStringFixedLength, reportIssueNotify == true ? 'Y' : 'N');
            db.AddInParameter(dbCmd, ":DOWNTIME_NOTIFY", DbType.AnsiStringFixedLength, downtimeNotify == true ? 'Y' : 'N');
            db.AddInParameter(dbCmd, ":USERTYPE", DbType.AnsiStringFixedLength, userType.Trim());
            db.AddInParameter(dbCmd, ":CREATEDBY", DbType.Int32, createdBy);
            db.AddInParameter(dbCmd, ":CREATEDON", DbType.Int32, createdOn);
            db.AddInParameter(dbCmd, ":CREATEDTIME", DbType.Int32, createdTime);

            if (transaction == null) db.ExecuteNonQuery(dbCmd);
            else db.ExecuteNonQuery(dbCmd, transaction);
        }

        public static bool UpdateWorkGroupUserData(Database db, DbTransaction transaction, int userID, int workGroupID, int itemID, bool isScheduleNotify,
            bool workStartNotify, bool workFinishNotify, bool reportIssueNotify, bool downtimeNotify, string userType, int siteID, int updatedBy, int updatedDate, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_WORKGROUPUSER SET FITEMID=:ITEMID,FSCH_NOTIFY=:SCH_NOTIFY,FWORKSTART_NOTIFY=:WORKSTART_NOTIFY ");
            sqlCmdBuilder.Append(" ,FWORKFINISH_NOTIFY=:WORKFINISH_NOTIFY,FREPORTISSUE_NOTIFY=:REPORTISSUE_NOTIFY,FDOWNTIME_NOTIFY=:DOWNTIME_NOTIFY,FUSERTYPE=:USERTYPE ");
            sqlCmdBuilder.Append(" ,FUPDATEDBY=:UPDATEDBY,FUPDATEDON=:UPDATEDON,FUPDATEDTIME=:UPDATEDTIME,FSTATUS='A' ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FWORKGROUPID=:WORKGROUPID AND FUSERID=:USERID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":ITEMID", DbType.Int32, itemID);
            db.AddInParameter(dbCmd, ":USERID", DbType.Int32, userID);
            db.AddInParameter(dbCmd, ":SCH_NOTIFY", DbType.AnsiStringFixedLength, isScheduleNotify == true ? 'Y' : 'N');
            db.AddInParameter(dbCmd, ":WORKSTART_NOTIFY", DbType.AnsiStringFixedLength, workStartNotify == true ? 'Y' : 'N');
            db.AddInParameter(dbCmd, ":WORKFINISH_NOTIFY", DbType.AnsiStringFixedLength, workFinishNotify == true ? 'Y' : 'N');
            db.AddInParameter(dbCmd, ":REPORTISSUE_NOTIFY", DbType.AnsiStringFixedLength, reportIssueNotify == true ? 'Y' : 'N');
            db.AddInParameter(dbCmd, ":DOWNTIME_NOTIFY", DbType.AnsiStringFixedLength, downtimeNotify == true ? 'Y' : 'N');
            db.AddInParameter(dbCmd, ":USERTYPE", DbType.AnsiStringFixedLength, userType.Trim());
            db.AddInParameter(dbCmd, ":WORKGROUPID", DbType.Int32, workGroupID);

            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedDate);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);

            if (transaction != null)
                db.ExecuteNonQuery(dbCmd, transaction);
            else
                db.ExecuteNonQuery(dbCmd);
            return true;
        }

        public static IDataReader CheckWorkGroupUserExist(Database db, DbTransaction transaction, int siteID, int workgroupID, string searchString, string userName,bool considerStatus)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();

            if (!string.IsNullOrEmpty(userName))
                sqlCmdBuilder.Append(" SELECT * FROM ( ");

            sqlCmdBuilder.Append(" SELECT  MAX(ROWNUM) OVER () AS FCOUNT,W.FUSERID,(U.FFIRSTNAME || ' ' || U.FLASTNAME) AS FUSERNAME,U.FUSERNAME AS USERNAME ");
            sqlCmdBuilder.Append(" ,W.FITEMID,W.FUSERTYPE,W.FSCH_NOTIFY,W.FWORKSTART_NOTIFY,W.FWORKFINISH_NOTIFY,W.FREPORTISSUE_NOTIFY,W.FDOWNTIME_NOTIFY,W.FSTATUS ");

            if (considerStatus)
                sqlCmdBuilder.Append(" ,M.FNAME,M.FDESCRIPTION ");

            sqlCmdBuilder.Append(" FROM LDB1_MAINT_WORKGROUPUSER W ");

            if (considerStatus)
                sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_MASTER M ON M.FMASTERID=W.FWORKGROUPID AND M.FSITEID=W.FSITEID AND M.FSTATUS='A' ");

            sqlCmdBuilder.Append(" INNER JOIN LDB1_USERINFO U ON W.FUSERID=U.FUSERID ");
            sqlCmdBuilder.Append(" AND (NVL(U.FSITEID,0)=W.FSITEID OR NVL(U.FREGDEFAULTSITEID,0)=W.FSITEID) AND U.FSTATUS='A' ");
            sqlCmdBuilder.Append(" WHERE W.FSITEID=:SITEID ");

            if (considerStatus)
                sqlCmdBuilder.Append(" AND W.FSTATUS='A' ");

            if (!string.IsNullOrEmpty(searchString))
                sqlCmdBuilder.Append(" AND UPPER(M.FNAME) LIKE :NAME ");

            if (workgroupID > 0)
                sqlCmdBuilder.Append(" AND W.FWORKGROUPID=:WORKGROUPID ");
            else
                sqlCmdBuilder.Append(" ORDER BY M.FUPDATEDON DESC,M.FUPDATEDTIME DESC,W.FWORKGROUPID,W.FITEMID ");

            if (!string.IsNullOrEmpty(userName))
                sqlCmdBuilder.Append(" )A WHERE UPPER(A.USERNAME)=:USERNAME ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            if (!string.IsNullOrEmpty(searchString))
                db.AddInParameter(dbCmd, ":NAME", DbType.String, "%" + searchString.Trim().ToUpper() + "%");

            if (!string.IsNullOrEmpty(userName))
                db.AddInParameter(dbCmd, ":USERNAME", DbType.String, userName.Trim().ToUpper());

            if (workgroupID > 0)
                db.AddInParameter(dbCmd, ":WORKGROUPID", DbType.Int32, workgroupID);


            if (transaction != null)
                return db.ExecuteReader(dbCmd, transaction);
            else
                return db.ExecuteReader(dbCmd);
        }

        public static bool UpdateWorkGroupUserStatus(Database db, DbTransaction transaction, int siteID, int workGroupID, int itemID, char status, int updatedBy, int updatedDate, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_WORKGROUPUSER SET FSTATUS=:STATUS,FUPDATEDBY=:UPDATEDBY,FUPDATEDON=:UPDATEDON,FUPDATEDTIME=:UPDATEDTIME ");
            sqlCmdBuilder.Append(" WHERE FWORKGROUPID=:WORKGROUPID AND FSITEID=:SITEID ");
            if (itemID > 0)
                sqlCmdBuilder.Append(" AND FITEMID=:ITEMID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":WORKGROUPID", DbType.Int32, workGroupID);
            if (itemID > 0)
                db.AddInParameter(dbCmd, ":ITEMID", DbType.Int32, itemID);
            db.AddInParameter(dbCmd, ":STATUS", DbType.AnsiStringFixedLength, status);
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedDate);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);

            if (transaction != null)
                db.ExecuteNonQuery(dbCmd, transaction);
            else
                db.ExecuteNonQuery(dbCmd);

            return true;
        }

        public static bool CheckWorkGroupUserExists(Database db, DbTransaction transaction, int workGroupID, int userID, int siteID)
        {
            IDataReader dataReaderCheck = null;
            try
            {
                StringBuilder sqlCmdBuilder = new StringBuilder();
                sqlCmdBuilder.Append(" SELECT FWORKGROUPID FROM LDB1_MAINT_WORKGROUPUSER ");
                sqlCmdBuilder.Append(" WHERE FWORKGROUPID=:WORKGROUPID AND FUSERID=:USERID AND FSITEID=:SITEID ");          //warning - do not check with status

                DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
                dbCmd.CommandType = CommandType.Text;

                db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
                db.AddInParameter(dbCmd, ":USERID", DbType.Int32, userID);
                db.AddInParameter(dbCmd, ":WORKGROUPID", DbType.Int32, workGroupID);

                bool isExists = false;
                using (dataReaderCheck = transaction != null ? db.ExecuteReader(dbCmd, transaction) : db.ExecuteReader(dbCmd))
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

        #region View Work Order

        #region Calendar

        public static IDataReader GetUserWorkGroup(Database db, int siteID, int userID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FUSERTYPE,FWORKGROUPID ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_WORKGROUPUSER WHERE FSITEID=:SITEID AND FUSERID=:USERID AND FSTATUS='A' ");
            sqlCmdBuilder.Append(" ORDER BY FUSERTYPE ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":USERID", DbType.Int32, userID);

            return db.ExecuteReader(dbCmd);
        }

        #endregion

        #region Resource View

        public static IDataReader GetResourceViewInfo(Database db, int pageSize, int pageIndex, int siteID, string flocationIDs,string equipmentIDs)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");

            sqlCmdBuilder.Append(" SELECT FLOCATIONID AS TYPEVALUE,FLOCATIONNAME AS DISPLAYNAME ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_LOCATIONS ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FSTATUS='A' ");

            if (!string.IsNullOrEmpty(flocationIDs))
                sqlCmdBuilder.Append(" AND FLOCATIONID IN(" + flocationIDs.Trim() + ")");
            sqlCmdBuilder.Append(" UNION ");

            sqlCmdBuilder.Append(" SELECT ME.FEQUIPMENTID AS TYPEVALUE,ME.FEQUIPMENTNAME AS DISPLAYNAME ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_LOCATIONS ML ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_EQUIPMENT ME ON ME.FLOCATIONID=ML.FLOCATIONID AND ME.FSITEID=ML.FSITEID AND ME.FSTATUS='A' ");

            if (!string.IsNullOrEmpty(equipmentIDs))
                sqlCmdBuilder.Append(" AND FEQUIPMENTID IN(" + equipmentIDs.Trim() + ")");

            sqlCmdBuilder.Append(" WHERE ML.FSITEID=:SITEID AND ML.FSTATUS='A' ");

            if (!string.IsNullOrEmpty(flocationIDs))
                sqlCmdBuilder.Append(" AND ML.FLOCATIONID IN(" + flocationIDs.Trim() + ")");

            if (pageIndex != 0)
                sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:PAGEINDEX)  AND (:PAGESIZE + (:PAGEINDEX - 1))");
            else
                sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:PAGEINDEX)  AND  (:PAGESIZE + (:PAGEINDEX))");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
           
                db.AddInParameter(dbCmd, ":PAGEINDEX", DbType.Int32, pageIndex);
                db.AddInParameter(dbCmd, ":PAGESIZE", DbType.Int32, pageSize);
            
            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetResourceViewEquipmentInfo(Database db, int pageSize, int pageIndex, int siteID, string equipmentIDs)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");
            sqlCmdBuilder.Append(" SELECT FEQUIPMENTID,FEQUIPMENTNAME ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_EQUIPMENT ");         
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID ");

            if (!string.IsNullOrEmpty(equipmentIDs))
                sqlCmdBuilder.Append(" AND FEQUIPMENTID IN(" + equipmentIDs.Trim() + ")");

            if (pageIndex != 0)
                sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:PAGEINDEX)  AND (:PAGESIZE + (:PAGEINDEX - 1))");
            else
                sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:PAGEINDEX)  AND  (:PAGESIZE + (:PAGEINDEX))");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            db.AddInParameter(dbCmd, ":PAGEINDEX", DbType.Int32, pageIndex);
            db.AddInParameter(dbCmd, ":PAGESIZE", DbType.Int32, pageSize);

            return db.ExecuteReader(dbCmd);
        }

        public static DataTable GetResourceViewWorkOrderInfoForPaging(Database db, int pageSize, int pageIndex, int siteID, int startDate, int endDate, string flocationIDs, string equipmentIDs)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT * FROM (SELECT D.*, ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM( ");
            sqlCmdBuilder.Append(" SELECT C.FLOCATIONID,C.FEQUIPMENTID FROM ( SELECT B.FLOCATIONID,B.FEQUIPMENTID,ROWNUM AS FROWINDEX FROM ( ");
            sqlCmdBuilder.Append(" SELECT MS.FLOCATIONID,MS.FEQUIPMENTID,DECODE(NVL(WO.FSTARTDATE,0),0,WO.FSCHEDULEDATE,WO.FSTARTDATE) AS FSCHEDULEDATE ,DECODE(NVL(WO.FSTARTDATE,0),0,WO.FSCHEDULETIME,WO.FSTARTTIME)  AS FSCHEDULETIME ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_WORKORDER WO ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_SCHEDULE MS ON MS.FSCHEDULEID=WO.FREF_SCHEDULEID AND MS.FSITEID=WO.FSITEID AND MS.FSCHEDULE_TYPE IN ('S','W') ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_LOCATIONS ML ON ML.FSITEID=MS.FSITEID AND ML.FLOCATIONID=MS.FLOCATIONID ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_EQUIPMENT ME ON ME.FSITEID=MS.FSITEID AND ME.FEQUIPMENTID=MS.FEQUIPMENTID ");
            sqlCmdBuilder.Append(" WHERE WO.FSCHEDULEDATE BETWEEN :STARTDATE AND :ENDDATE AND WO.FSITEID=:SITEID AND WO.FWORKORDERSTATUS NOT IN ('INACTIVE' ,'CANCELLED','CREATED') ");

            if (!string.IsNullOrEmpty(flocationIDs) && !string.IsNullOrEmpty(equipmentIDs))
                sqlCmdBuilder.Append(" AND (MS.FLOCATIONID IN(" + flocationIDs.Trim() + ") OR MS.FEQUIPMENTID IN(" + equipmentIDs.Trim() + ")) ");
            else if (!string.IsNullOrEmpty(flocationIDs) && string.IsNullOrEmpty(equipmentIDs))
                sqlCmdBuilder.Append(" AND MS.FLOCATIONID IN(" + flocationIDs.Trim() + ") ");
            else if (string.IsNullOrEmpty(flocationIDs) && !string.IsNullOrEmpty(equipmentIDs))
                sqlCmdBuilder.Append(" AND MS.FEQUIPMENTID IN(" + equipmentIDs.Trim() + ") ");

            sqlCmdBuilder.Append(" ORDER BY DECODE(NVL(WO.FSTARTDATE,0),0,WO.FSCHEDULEDATE,WO.FSTARTDATE) ,DECODE(NVL(WO.FSTARTDATE,0),0,WO.FSCHEDULETIME,WO.FSTARTTIME))B ");
            sqlCmdBuilder.Append(" )C GROUP BY C.FLOCATIONID,C.FEQUIPMENTID ORDER BY MIN(FROWINDEX) ");

            if (pageIndex != 0)
                sqlCmdBuilder.Append(" ) D) WHERE FROWINDEX BETWEEN (:PAGEINDEX)  AND (:PAGESIZE + (:PAGEINDEX - 1))");
            else
                sqlCmdBuilder.Append(" ) D) WHERE FROWINDEX BETWEEN (:PAGEINDEX)  AND  (:PAGESIZE + (:PAGEINDEX)) ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":STARTDATE", DbType.Int32, startDate);
            db.AddInParameter(dbCmd, ":ENDDATE", DbType.Int32, endDate);

            db.AddInParameter(dbCmd, ":PAGEINDEX", DbType.Int32, pageIndex);
            db.AddInParameter(dbCmd, ":PAGESIZE", DbType.Int32, pageSize);

            return db.ExecuteDataSet(dbCmd).Tables[0];
        }
        public static IDataReader GetResourceViewWorkOrderInfo(Database db, int siteID, int startDate, int endDate, string flocationIDs, string equipmentIDs)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT DECODE(NVL(WO.FSTARTDATE,0),0,WO.FSCHEDULEDATE,WO.FSTARTDATE) AS SCHEDULEDATE ,DECODE(NVL(WO.FSTARTDATE,0),0,WO.FSCHEDULETIME,WO.FSTARTTIME) AS SCHEDULETIME ");
            sqlCmdBuilder.Append(" ,WO.FENDDATE,WO.FENDTIME,MS.FLOCATIONID,ML.FLOCATIONNAME,MS.FEQUIPMENTID,ME.FEQUIPMENTNAME ");
            sqlCmdBuilder.Append(" ,DECODE(NVL(WO.FERP_WORKORDER,'N'),'N',LTRIM(WO.FWORK_ORDERID,'0'),WO.FERP_WORKORDER) AS FERP_WORKORDER,WO.FWORK_ORDERID,MS.FMAINTENANCENAME ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_WORKORDER WO ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_SCHEDULE MS ON MS.FSCHEDULEID=WO.FREF_SCHEDULEID AND MS.FSITEID=WO.FSITEID AND MS.FSCHEDULE_TYPE IN ('S','W') ");//CONSIDER ONLY SCHEDULE & DIRECT WORK ORDER
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_LOCATIONS ML ON ML.FSITEID=MS.FSITEID AND ML.FLOCATIONID=MS.FLOCATIONID ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_EQUIPMENT ME ON ME.FSITEID=MS.FSITEID AND ME.FEQUIPMENTID=MS.FEQUIPMENTID ");
            sqlCmdBuilder.Append(" WHERE WO.FSCHEDULEDATE BETWEEN :STARTDATE AND :ENDDATE AND WO.FSITEID=:SITEID AND WO.FWORKORDERSTATUS NOT IN ('INACTIVE' ,'CANCELLED','CREATED') ");

            if (!string.IsNullOrEmpty(flocationIDs) && !string.IsNullOrEmpty(equipmentIDs))
                sqlCmdBuilder.Append(" AND (MS.FLOCATIONID IN(" + flocationIDs.Trim() + ") OR MS.FEQUIPMENTID IN(" + equipmentIDs.Trim() + ")) ");
            else if (!string.IsNullOrEmpty(flocationIDs) && string.IsNullOrEmpty(equipmentIDs))
                sqlCmdBuilder.Append(" AND MS.FLOCATIONID IN(" + flocationIDs.Trim() + ") ");
            else if (string.IsNullOrEmpty(flocationIDs) && !string.IsNullOrEmpty(equipmentIDs))
                sqlCmdBuilder.Append(" AND MS.FEQUIPMENTID IN(" + equipmentIDs.Trim() + ") ");

            sqlCmdBuilder.Append(" ORDER BY SCHEDULEDATE,SCHEDULETIME ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":STARTDATE", DbType.Int32, startDate);
            db.AddInParameter(dbCmd, ":ENDDATE", DbType.Int32, endDate);

            return db.ExecuteReader(dbCmd);
        }

        //public static IDataReader GetEquipmentsForTimeLine(Database db, int siteID, bool restrictAccess, int userID)
        //{
        //    StringBuilder sqlCmdBuilder = new StringBuilder();
        //    sqlCmdBuilder.Append(" SELECT DISTINCT E.FLOCATIONID,E.FEQUIPMENTID,E.FEQUIPMENTCODE,E.FEQUIPMENTNAME,E.FUPDATEDON,E.FUPDATEDTIME ");
        //    sqlCmdBuilder.Append(" FROM LDB1_MAINT_EQUIPMENT E ");

        //    if (userID > 0 && restrictAccess) //only for equipment - work group
        //    {
        //        sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_AUTH_GROUP MA ON MA.FREFERENCEID=E.FEQUIPMENTID AND MA.FSITEID=E.FSITEID AND MA.FTYPE='EQUIPMENT' AND MA.FSTATUS='A' ");
        //        sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_WORKGROUPUSER MW ON MW.FWORKGROUPID=MA.FWORKGROUPID AND MW.FSITEID=MA.FSITEID AND MW.FSTATUS='A' ");
        //    }
        //    sqlCmdBuilder.Append(" WHERE E.FSITEID=:SITEID AND E.FSTATUS='A' AND E.FINFOTYPE='E' ");

        //    if (userID > 0 && restrictAccess) //only for equipment - work group
        //    {
        //        sqlCmdBuilder.Append(" AND (MA.FREFERENCEID IS NULL OR MW.FUSERID=:USERID) ");
        //    }

        //    DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
        //    dbCmd.CommandType = CommandType.Text;

        //    db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

        //    if (userID > 0 && restrictAccess) //only for equipment - work group
        //        db.AddInParameter(dbCmd, ":USERID", DbType.Int32, userID);            

        //    return db.ExecuteReader(dbCmd);
        //}

        public static IDataReader GetEquipmentListForHierarchicalDropDown(Database db, int siteID, int userID,string fLocationIDS, bool restrictAccess)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FEQUIPMENTID,FEQUIPMENTNAME,FPARENTEQUIPMENTID,FEQUIPMENTIDS FROM ( ");
            sqlCmdBuilder.Append(" SELECT DISTINCT E.FEQUIPMENTID,E.FEQUIPMENTNAME,E.FPARENTEQUIPMENTID,UP.FEQUIPMENTIDS, E.FUPDATEDON,E.FUPDATEDTIME FROM LDB1_MAINT_EQUIPMENT E  ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_EQUIPMENT PL ON PL.FSITEID =E.FSITEID AND PL.FSTATUS='A' AND PL.FEQUIPMENTID=E.FPARENTEQUIPMENTID ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_USERPREFERENCE UP ON UP.FUSERID=:USERID ");

            if (userID > 0 && restrictAccess == true)
            {
                sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_AUTH_GROUP MA ON MA.FREFERENCEID=E.FEQUIPMENTID AND MA.FSITEID=E.FSITEID AND MA.FTYPE='EQUIPMENT' AND MA.FSTATUS='A' ");
                sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_WORKGROUPUSER MW ON MW.FWORKGROUPID=MA.FWORKGROUPID AND MW.FSITEID=MA.FSITEID AND MW.FSTATUS='A' ");
            }
            sqlCmdBuilder.Append(" WHERE E.FSITEID=:SITEID AND E.FSTATUS='A' AND E.FINFOTYPE='E' ");

            if (!string.IsNullOrEmpty(fLocationIDS))
                sqlCmdBuilder.Append(" AND E.FLOCATIONID IN(" + fLocationIDS.Trim() + ") ");
            else
                sqlCmdBuilder.Append(" AND NVL(E.FLOCATIONID,0)=0 ");

            if (userID > 0 && restrictAccess == true)
            {
                sqlCmdBuilder.Append(" AND (MA.FREFERENCEID IS NULL OR MW.FUSERID=:USERID) ");
            }

            sqlCmdBuilder.Append(" ) ORDER BY FPARENTEQUIPMENTID ASC,FUPDATEDON DESC,FUPDATEDTIME DESC ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            if (userID > 0)
            {
                db.AddInParameter(dbCmd, ":USERID", DbType.Int32, userID);
            }

            return db.ExecuteReader(dbCmd);
        }

        #endregion

        #region Work Order
        public static IDataReader GetWorkOrderBasicInfo(Database db, int siteID, string workOrderID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT MS.FMAINTENANCENAME,MS.FMAINDESCRIPTION,MT.FNAME AS FMAINTANANCETYPE,WO.FWORKORDERSTATUS,ET.FTEXT AS FPRIORITY,ME.FEQUIPMENTID,ME.FEQUIPMENTNAME ");
            sqlCmdBuilder.Append(" ,MM.FNAME AS EQUIPMENTTYPE,WO.FPLANNEDDATE,WO.FPLANNEDTIME,WO.FSCHEDULEDATE,WO.FSCHEDULETIME,WO.FSTARTDATE,WO.FSTARTTIME,WO.FENDDATE,WO.FENDTIME ");
            sqlCmdBuilder.Append(" ,ME.FIMAGENAME AS FEQUIPMENTIMAGE,DECODE(NVL(ME.FIMAGENAME,''),'',EM.FIMAGENAME,ME.FIMAGENAME) AS FIMAGENAME ");
            sqlCmdBuilder.Append(" ,MS.FLOCATIONID,ML.FLOCATIONNAME,ML.FIMAGENAME AS FLOCATIONIMG ");

            sqlCmdBuilder.Append(" ,(SELECT LISTAGG((INITCAP(TO_CHAR(U.FLASTNAME))||' '||INITCAP(TO_CHAR(U.FFIRSTNAME))),',') WITHIN GROUP (ORDER BY U.FLASTNAME) ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_WORKGROUPUSER WU ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_USERINFO U ON U.FUSERID=WU.FUSERID ");
            sqlCmdBuilder.Append(" WHERE WU.FWORKGROUPID=DECODE(NVL(WO.FWORKGROUPID,0),0,MS.FWORKGROUPID,WO.FWORKGROUPID) AND WU.FSITEID=MS.FSITEID AND WU.FUSERTYPE='A' AND WU.FSTATUS='A') AS FASSIGNEDTO ");

            sqlCmdBuilder.Append(" ,(SELECT LISTAGG((INITCAP(TO_CHAR(U.FLASTNAME))||' '||INITCAP(TO_CHAR(U.FFIRSTNAME))),',') WITHIN GROUP (ORDER BY U.FLASTNAME) ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_WORKGROUPUSER WU ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_USERINFO U ON U.FUSERID=WU.FUSERID ");
            sqlCmdBuilder.Append(" WHERE WU.FWORKGROUPID=DECODE(NVL(WO.FWORKGROUPID,0),0,MS.FWORKGROUPID,WO.FWORKGROUPID) AND WU.FSITEID=MS.FSITEID AND WU.FUSERTYPE='R' AND WU.FSTATUS='A') AS FREPORTEDTO ");

            sqlCmdBuilder.Append(" ,(SELECT ROUND(SUM(MT.FESTIMATEDTIME/60),2) FROM LDB1_MAINT_TASKS MT ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_TASKGROUP TG ON TG.FIDENTIFIER=MS.FTASKGROUPIDENTIFIER AND TG.FSTATUS='A' AND TG.FSITEID=MS.FSITEID ");
            sqlCmdBuilder.Append(" WHERE MT.FREFERENCEID=DECODE(NVL(WO.FTASKGROUPID,0),0,TG.FTASKGROUPID,WO.FTASKGROUPID) AND MT.FSITEID=MS.FSITEID) AS FESTIMATEDTIME ");

            sqlCmdBuilder.Append(" ,(SELECT NVL(SUM(NVL(ROUND((TO_DATE(FENDDATE||' '||LPAD(FENDTIME,6,'0'),'YYYYMMDD hh24miSS') ");
            sqlCmdBuilder.Append(" - TO_DATE(FSTARTDATE||' '||LPAD(FSTARTTIME,6,'0'),'YYYYMMDD hh24miSS'))*24*60,2),0)),0) ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_WORKORDER_TASK WT WHERE WT.FWORK_ORDERID=WO.FWORK_ORDERID AND WT.FSITEID=MS.FSITEID AND WT.FENDDATE>0) AS FACTUALTIME ");

            sqlCmdBuilder.Append(" ,WO.FWORK_STARTDATE,WO.FWORK_STARTTIME,WO.FWORK_ENDDATE,WO.FWORK_ENDTIME,WO.FTIMETAKEN,WO.FTIMETAKENUNIT,(INITCAP(TO_CHAR(UI.FLASTNAME))||' '||INITCAP(TO_CHAR(UI.FFIRSTNAME))) AS FCLOSEDBY,WO.FUPDATEDON,WO.FUPDATEDTIME,WO.FLABORTIME,WO.FLABORTIMEUNIT ");
            sqlCmdBuilder.Append(" ,WO.FBREAKDOWN_STARTDATE,WO.FBREAKDOWN_STARTTIME,WO.FBREAKDOWN_ENDDATE,WO.FBREAKDOWN_ENDTIME,WO.FBREAKDOWN_DURATION,WO.FBREAKDOWN_DURATIONUNIT ");

            sqlCmdBuilder.Append(" FROM LDB1_MAINT_WORKORDER WO ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_SCHEDULE MS ON MS.FSCHEDULEID=WO.FREF_SCHEDULEID AND MS.FSITEID=WO.FSITEID ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_MASTER MT ON MT.FMASTERID=MS.FMAINTYPEID AND MT.FSITEID=MS.FSITEID ");//AND MT.FTYPE=''
            sqlCmdBuilder.Append(" INNER JOIN LDB1_ENUMTYPE ET ON ET.FTYPE='MAINT_PRIORITY_TYPE' AND ET.FVALUE=MS.FPRIORITYTYPE ");//AND MP.FTYPE='' 
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_LOCATIONS ML ON ML.FSITEID=MS.FSITEID AND ML.FLOCATIONID=MS.FLOCATIONID ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_EQUIPMENT ME ON ME.FEQUIPMENTID=MS.FEQUIPMENTID AND ME.FSITEID=MS.FSITEID ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_EQUIPMENT EM ON EM.FEQUIPMENTID=ME.FMODELREFERENCEID AND EM.FSITEID=WO.FSITEID ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_MASTER MM ON MM.FMASTERID=DECODE(NVL(ME.FCATEGORYID,0),0,EM.FCATEGORYID,ME.FCATEGORYID) AND MM.FSITEID=WO.FSITEID ");//AND ET.FTYPE='' 
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_USERINFO UI ON UI.FUSERID=WO.FTIMECONFIRMEDBY ");
            sqlCmdBuilder.Append(" WHERE WO.FWORK_ORDERID=:WORK_ORDERID AND WO.FSITEID=:SITEID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":WORK_ORDERID", DbType.AnsiString, workOrderID.Trim().PadLeft(12, '0'));

            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetWorkOrderEquipmentInfo(Database db, int siteID, string workOrderID, int equipmentID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT ME.FEQUIPMENTID,ME.FEQUIPMENTNAME,ME.FDESCRIPTION,ME.FIMAGENAME,ML.FLOCATIONNAME,EM.FEQUIPMENTNAME AS EQUIPMENTMODEL,EM.FIMAGENAME AS FMODELIMAGENAME");
            sqlCmdBuilder.Append(" ,MM.FNAME AS MANUFACTURER,ET.FNAME AS EQUIPMENTTYPE,EC.FNAME AS EQUIPMENTCLASS ");
            sqlCmdBuilder.Append(" ,DECODE(NVL(ME.FMODELNUMBER,'N'),'N',EM.FMODELNUMBER,ME.FMODELNUMBER) AS FMODELNUMBER ");
            sqlCmdBuilder.Append(" ,DECODE(NVL(ME.FSERIALNUMBER,'N'),'N',EM.FSERIALNUMBER,ME.FSERIALNUMBER) AS FSERIALNUMBER ");
            sqlCmdBuilder.Append(" ,DECODE(NVL(ME.FWARRANTYNUMBER,'N'),'N',EM.FWARRANTYNUMBER,ME.FWARRANTYNUMBER) AS FWARRANTYNUMBER ");
            sqlCmdBuilder.Append(" ,DECODE(NVL(ME.FWARRANTYEXPIREDDATE,0),0,EM.FWARRANTYEXPIREDDATE,ME.FWARRANTYEXPIREDDATE) AS FWARRANTYEXPIREDDATE ");
            sqlCmdBuilder.Append(" ,DECODE(NVL(ME.FPURCHASEDATE,0),0,EM.FPURCHASEDATE,ME.FPURCHASEDATE) AS FPURCHASEDATE ");
            sqlCmdBuilder.Append(" ,DECODE(NVL(ME.FINSTALLDATE,0),0,EM.FINSTALLDATE,ME.FINSTALLDATE) AS FINSTALLDATE ");

            if (!string.IsNullOrEmpty(workOrderID))
            {
                sqlCmdBuilder.Append(" FROM LDB1_MAINT_WORKORDER WO ");
                sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_SCHEDULE MS ON MS.FSCHEDULEID=WO.FREF_SCHEDULEID AND MS.FSITEID=WO.FSITEID ");
                sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_EQUIPMENT ME ON ME.FEQUIPMENTID=MS.FEQUIPMENTID AND ME.FSITEID=MS.FSITEID ");
            }
            else
            {
                sqlCmdBuilder.Append(" FROM LDB1_MAINT_EQUIPMENT ME ");
            }
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_EQUIPMENT EM ON EM.FEQUIPMENTID=ME.FMODELREFERENCEID AND EM.FSITEID=ME.FSITEID ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_LOCATIONS ML ON ML.FLOCATIONID=ME.FLOCATIONID AND ML.FSITEID=ME.FSITEID ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_MASTER ET ON ET.FMASTERID=DECODE(NVL(ME.FCATEGORYID,0),0,EM.FCATEGORYID,ME.FCATEGORYID) AND ET.FSITEID=ME.FSITEID ");//AND ET.FTYPE=''
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_MASTER EC ON EC.FMASTERID=DECODE(NVL(ME.FCLASSID,0),0,EM.FCLASSID,ME.FCLASSID) AND EC.FSITEID=ME.FSITEID ");//AND EC.FTYPE=''
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_MASTER MM ON MM.FMASTERID=DECODE(NVL(ME.FMANUFID,0),0,EM.FMANUFID,ME.FMANUFID) AND MM.FSITEID=ME.FSITEID ");//AND EM.FTYPE=''
            sqlCmdBuilder.Append(" WHERE ME.FSITEID=:SITEID ");
            if (!string.IsNullOrEmpty(workOrderID))
                sqlCmdBuilder.Append(" AND WO.FWORK_ORDERID=:WORK_ORDERID ");
            if (equipmentID > 0)
                sqlCmdBuilder.Append(" AND ME.FEQUIPMENTID=:EQUIPMENTID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            if (!string.IsNullOrEmpty(workOrderID))
                db.AddInParameter(dbCmd, ":WORK_ORDERID", DbType.AnsiString, workOrderID.Trim().PadLeft(12, '0'));
            if (equipmentID > 0)
                db.AddInParameter(dbCmd, ":EQUIPMENTID", DbType.Int32, equipmentID);

            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetEquipmentHistory(Database db, int siteID, int equipmentID, string workOrderNumber, int fromDate, int toDate, int pageSize, int pageIndex)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();

            if (pageSize > 0)
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");

            sqlCmdBuilder.Append(" SELECT LTRIM(WO.FWORK_ORDERID,'0') AS FWORKORDER,MS.FMAINTENANCENAME,MM.FNAME AS FMAINTENANCETYPE,NVL(WO.FSTARTDATE,0) AS FSTARTDATE,NVL(WO.FSTARTTIME,0) AS FSTARTTIME,NVL(WO.FENDDATE,0) AS FENDDATE,NVL(WO.FENDTIME,0) AS FENDTIME,WO.FWORKORDERSTATUS,MS.FPRIORITYTYPE ");
            sqlCmdBuilder.Append(" ,MS.FMAINDESCRIPTION,WO.FTIMETAKEN,WO.FTIMETAKENUNIT,WO.FBREAKDOWN_DURATION,WO.FBREAKDOWN_DURATIONUNIT ");

           sqlCmdBuilder.Append(" FROM LDB1_MAINT_WORKORDER WO  ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_SCHEDULE MS ON MS.FSCHEDULEID=WO.FREF_SCHEDULEID AND MS.FSITEID=WO.FSITEID  ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_MASTER MM ON MM.FMASTERID=MS.FMAINTYPEID AND MM.FSITEID=MS.FSITEID AND FTYPE='MAINT_TYPE'  ");
            sqlCmdBuilder.Append(" WHERE WO.FREF_SCHEDULEID IN (SELECT FSCHEDULEID FROM LDB1_MAINT_SCHEDULE WHERE FEQUIPMENTID=:EQUIPMENTID AND FSTATUS <> 'I' AND FSITEID=:SITEID) ");
            if (!string.IsNullOrEmpty(workOrderNumber))
                sqlCmdBuilder.Append(" AND WO.FWORK_ORDERID <> :WORK_ORDERID ");
            sqlCmdBuilder.Append(" AND FWORKORDERSTATUS IN ('COMPLETED','CLOSED') ");

            if (fromDate > 0)
            {
                sqlCmdBuilder.Append(" AND WO.FENDDATE >= :FROMDATE  ");
            }
            if (toDate > 0)
            {
                sqlCmdBuilder.Append(" AND WO.FENDDATE <= :TODATE ");
            }
            sqlCmdBuilder.Append(" ORDER BY WO.FUPDATEDON DESC, WO.FUPDATEDTIME ASC ");


            #endregion

            #region Paging
            if (pageSize > 0)
            {
                if (pageIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:PAGEINDEX)  AND (:PAGESIZE + (:PAGEINDEX - 1))");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:PAGEINDEX)  AND  (:PAGESIZE + (:PAGEINDEX))");
            }
            #endregion

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":EQUIPMENTID", DbType.Int32, equipmentID);
            if (!string.IsNullOrEmpty(workOrderNumber))
                db.AddInParameter(dbCmd, ":WORK_ORDERID", DbType.AnsiString, workOrderNumber.Trim());

            if (fromDate > 0)
                db.AddInParameter(dbCmd, ":FROMDATE", DbType.Int32, fromDate);
            if (toDate > 0)
                db.AddInParameter(dbCmd, ":TODATE", DbType.Int32, toDate);

            if (pageSize > 0)
            {
                db.AddInParameter(dbCmd, ":PAGEINDEX", DbType.Int32, pageIndex);
                db.AddInParameter(dbCmd, ":PAGESIZE", DbType.Int32, pageSize);
            }
            return db.ExecuteReader(dbCmd);
        }

        public static IDataReader GetWorkOrderTaskInfo(Database db, int siteID, string workOrderID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT TG.FTASKGROUPID,WO.FWORKORDERSTATUS,WO.FSCHEDULEDATE,TG.FIDENTIFIER,T.FTASKID,T.FTASKNAME,T.FDESCRIPTION,T.FSAFETYDESCRIPTION,T.FESTIMATEDTIME,T.FUNIT,T.FREMARKENABLED,T.FREMARKMANDATORY,T.FPICTUREENABLED ");
            sqlCmdBuilder.Append(" ,T.FPICTUREMANDATORY,WT.FREMARKS,WT.FISSAFETYCONFIRMED,WT.FSTARTDATE,WT.FSTARTTIME,WT.FENDDATE,WT.FENDTIME,WT.FISPPECONFIRMED ");
            sqlCmdBuilder.Append(" ,INITCAP(US.FLASTNAME)||' '||INITCAP(US.FFIRSTNAME) AS FSTARTEDBY,INITCAP(UE.FLASTNAME)||' '||INITCAP(UE.FFIRSTNAME) AS FENDEDBY ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_WORKORDER WO ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_SCHEDULE MS ON MS.FSCHEDULEID=WO.FREF_SCHEDULEID AND MS.FSITEID=WO.FSITEID ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_TASKGROUP TG ON ");
            sqlCmdBuilder.Append(" DECODE(NVL(WO.FTASKGROUPID,0),0,(CASE WHEN TG.FIDENTIFIER=MS.FTASKGROUPIDENTIFIER AND TG.FSTATUS='A' THEN 1 ELSE 0 END),(CASE WHEN TG.FTASKGROUPID=WO.FTASKGROUPID THEN 1 ELSE 0 END))=1 AND TG.FSITEID=WO.FSITEID ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_TASKS T ON T.FREFERENCEID=TG.FTASKGROUPID AND T.FSITEID=WO.FSITEID ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_WORKORDER_TASK WT ON WT.FWORK_ORDERID=WO.FWORK_ORDERID AND WT.FTASKID=T.FTASKID AND WT.FSITEID=WO.FSITEID ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_USERINFO US ON US.FUSERID=WT.FSTARTEDBY ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_USERINFO UE ON UE.FUSERID=WT.FENDEDBY ");
            sqlCmdBuilder.Append(" WHERE WO.FWORK_ORDERID=:WORK_ORDERID AND WO.FSITEID=:SITEID AND CASE NVL(WO.FTASKGROUPID,0) WHEN 0 THEN CASE WHEN T.FSTATUS='A' THEN 1 ELSE 0 END ELSE 1 END=1 ");
            sqlCmdBuilder.Append(" ORDER BY T.FSEQUENCENUM ASC ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":WORK_ORDERID", DbType.AnsiString, workOrderID.Trim().PadLeft(12, '0'));

            return db.ExecuteReader(dbCmd);
        }

        public static DataTable GetWorkOrderTaskPPE(Database db, int siteID, int taskGroupID, string workOrderID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT TP.FREFERENCEID,TP.FTASKPPEID,PP.FPPEID,PP.FPPEDESC,PP.FPPEIMAGENAME ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_TASKSPPE TP ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_PLANTPPE PP ON PP.FPPEID=TP.FPPEID AND PP.FSITEID=TP.FSITEID ");
            sqlCmdBuilder.Append(" WHERE TP.FTASKGROUPID=:TASKGROUPID AND TP.FSITEID=:SITEID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":TASKGROUPID", DbType.Int32, taskGroupID);
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            //db.AddInParameter(dbCmd, ":WORKORDERID", DbType.AnsiString, workOrderID.Trim().PadLeft(12, '0'));

            return db.ExecuteDataSet(dbCmd).Tables[0];
        }

        public static DataTable GetWorkOrderTaskTools(Database db, int siteID, int taskGroupID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT MT.FREFERENCEID,MT.FTASKTOOLSID,T.FTOOLSID,T.FTOOLSDESC,T.FTOOLSIMAGENAME ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_TASKSTOOLS MT ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_TOOLS T ON T.FTOOLSID=MT.FTOOLSID AND T.FSITEID=MT.FSITEID ");
            sqlCmdBuilder.Append(" WHERE MT.FTASKGROUPID=:TASKGROUPID AND MT.FSITEID=:SITEID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":TASKGROUPID", DbType.Int32, taskGroupID);
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            return db.ExecuteDataSet(dbCmd).Tables[0];
        }

        public static DataTable GetWorkOrderImages(Database db, int siteID, string workOrderID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FTASKID,FIMAGEITEM,FIMAGENAME ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_WORKORDER_TASKIMG ");
            sqlCmdBuilder.Append(" WHERE FWORK_ORDERID=:WORKORDERID AND FSITEID=:SITEID ");
            sqlCmdBuilder.Append(" ORDER BY FIMAGEITEM ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":WORKORDERID", DbType.AnsiString, workOrderID.Trim().PadLeft(12, '0'));

            return db.ExecuteDataSet(dbCmd).Tables[0];
        }

        public static DataTable GetWorkOrderTaskParameters(Database db, int siteID, int taskGroupID, string workOrderID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT T.FREFERENCEID,T.FPARAMETERID,T.FPARAMNAME,T.FISMANDATORY,T.FTYPE,T.FSELECTIONGROUPID,WT.FVALUE,SC.FDISPLAYNAME ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_TASKSPARAM T ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_WORKORDER_TASKPARAM WT ON WT.FTASKID=T.FREFERENCEID AND WT.FPARAMETERID=T.FPARAMETERID AND WT.FWORK_ORDERID=:FWORK_ORDERID AND WT.FSITEID=T.FSITEID AND WT.FSTATUS='A' ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_SELGRP_CODE SC ON SC.FMASTERID=T.FSELECTIONGROUPID AND SC.FITEMID=WT.FSELECTCODEITEM AND SC.FSITEID=T.FSITEID ");
            sqlCmdBuilder.Append(" WHERE T.FTASKGROUPID=:TASKGROUPID AND T.FSITEID=:SITEID ");
            sqlCmdBuilder.Append(" ORDER BY T.FPARAMETERID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":TASKGROUPID", DbType.Int32, taskGroupID);
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":FWORK_ORDERID", DbType.AnsiString, workOrderID.Trim().PadLeft(12, '0'));

            return db.ExecuteDataSet(dbCmd).Tables[0];
        }

        public static IDataReader GetSelectionGroupInfo(Database db, int siteID, string selectionGroupIDListString)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT M.FMASTERID,S.FITEMID,S.FDISPLAYNAME ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_MASTER M ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_SELGRP_CODE S ON S.FMASTERID=M.FMASTERID AND S.FSITEID=M.FSITEID  AND S.FSTATUS='A' ");
            sqlCmdBuilder.Append(" WHERE M.FTYPE='GROUPCODE' AND M.FSITEID=:SITEID AND M.FMASTERID IN (" + selectionGroupIDListString + ") ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            return db.ExecuteReader(dbCmd);
        }

        public static DataTable GetWorkOrderTaskGroupTaskInfo(Database db, int siteID, string workOrderID, int taskID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT W.FWORKORDERSTATUS ,T.FTASKID,NVL(WT.FSTARTDATE,0) AS FSTARTDATE,NVL(WT.FENDDATE,0) AS FENDDATE ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_WORKORDER W ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_SCHEDULE S ON S.FSCHEDULEID=W.FREF_SCHEDULEID AND S.FSITEID=W.FSITEID ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_TASKGROUP TG ON  DECODE(NVL(W.FTASKGROUPID,0),0,(CASE WHEN TG.FIDENTIFIER=S.FTASKGROUPIDENTIFIER AND TG.FSTATUS='A' THEN 1 ELSE 0 END),(CASE WHEN TG.FTASKGROUPID=W.FTASKGROUPID THEN 1 ELSE 0 END))=1 AND TG.FSITEID=W.FSITEID ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_TASKS T ON T.FREFERENCEID=TG.FTASKGROUPID AND T.FSITEID=S.FSITEID ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_WORKORDER_TASK WT ON WT.FWORK_ORDERID=W.FWORK_ORDERID AND WT.FTASKID=T.FTASKID AND WT.FSITEID=T.FSITEID ");
            sqlCmdBuilder.Append(" WHERE W.FWORK_ORDERID=:WORK_ORDERID AND W.FSITEID=:SITEID ");

            if (taskID > 0)
                sqlCmdBuilder.Append(" AND T.FTASKID=:TASKID ");

            sqlCmdBuilder.Append(" ORDER BY T.FSEQUENCENUM ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":WORK_ORDERID", DbType.AnsiString, workOrderID.Trim().PadLeft(12, '0'));
            if (taskID > 0)
                db.AddInParameter(dbCmd, ":TASKID", DbType.Int32, taskID);

            return db.ExecuteDataSet(dbCmd).Tables[0];
        }

        public static int GetTaskGroupID(Database db, int siteID, string workOrderID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT TG.FTASKGROUPID ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_WORKORDER WO ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_SCHEDULE MS ON MS.FSCHEDULEID=WO.FREF_SCHEDULEID AND MS.FSITEID=WO.FSITEID ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_TASKGROUP TG ON TG.FIDENTIFIER=MS.FTASKGROUPIDENTIFIER AND TG.FSTATUS='A' AND TG.FSITEID=MS.FSITEID ");
            sqlCmdBuilder.Append(" WHERE WO.FWORK_ORDERID=:WORK_ORDERID AND WO.FSITEID=:SITEID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":WORK_ORDERID", DbType.AnsiString, workOrderID.Trim().PadLeft(12, '0'));

            DataTable dt = db.ExecuteDataSet(dbCmd).Tables[0];
            if (dt.Rows.Count > 0)
                return Convert.ToInt32(dt.Rows[0][0]);
            else
                return 0;
        }

        public static int GetWorkGroupID(Database db, int siteID, string workOrderID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT MS.FWORKGROUPID ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_WORKORDER WO ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_SCHEDULE MS ON MS.FSCHEDULEID=WO.FREF_SCHEDULEID AND MS.FSITEID=WO.FSITEID ");
            sqlCmdBuilder.Append(" WHERE WO.FWORK_ORDERID=:WORK_ORDERID AND WO.FSITEID=:SITEID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":WORK_ORDERID", DbType.AnsiString, workOrderID.Trim().PadLeft(12, '0'));

            DataTable dt = db.ExecuteDataSet(dbCmd).Tables[0];
            if (dt.Rows.Count > 0)
                return Convert.ToInt32(dt.Rows[0][0]);
            else
                return 0;
        }

        public static void UpdateWorkOrderStartEndInfo(Database db, DbTransaction transaction, int siteID, string workOrderID, string status, int taskGroupID, int wDate, int wTime, int userID, int workGroupID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_WORKORDER SET FWORKORDERSTATUS =:STATUS ");

            if (status == "INPROGRESS")
                sqlCmdBuilder.Append(" ,FSTARTDATE=:WDATE,FSTARTTIME=:WTIME,FSTARTEDBY=:USERID,FTASKGROUPID=:TASKGROUPID,FWORKGROUPID=:WORKGROUPID ");
            else
                sqlCmdBuilder.Append(" ,FENDDATE=:WDATE,FENDTIME=:WTIME,FENDEDBY=:USERID ");

            sqlCmdBuilder.Append(" ,FUPDATEDON=:WDATE,FUPDATEDTIME=:WTIME ");
            sqlCmdBuilder.Append(" WHERE FWORK_ORDERID=:WORK_ORDERID AND FSITEID=:SITEID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":WORK_ORDERID", DbType.AnsiString, workOrderID.Trim().PadLeft(12, '0'));
            db.AddInParameter(dbCmd, ":STATUS", DbType.AnsiString, status.Trim());
            db.AddInParameter(dbCmd, ":WDATE", DbType.Int32, wDate);
            db.AddInParameter(dbCmd, ":WTIME", DbType.Int32, wTime);
            db.AddInParameter(dbCmd, ":USERID", DbType.Int32, userID);
            if (status == "INPROGRESS")
            {
                db.AddInParameter(dbCmd, ":TASKGROUPID", DbType.Int32, taskGroupID);
                db.AddInParameter(dbCmd, ":WORKGROUPID", DbType.Int32, workGroupID);
            }

            db.ExecuteNonQuery(dbCmd, transaction);
        }

        public static void InsertTaskStartInfo(Database db, DbTransaction transaction, int siteID, string workOrderID, int taskID, int sequenceNum, char IsSafetyConfirmed, int startDate, int startTime, int startedBy, char isPPEConfirmed)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" INSERT INTO LDB1_MAINT_WORKORDER_TASK(FWORK_ORDERID,FSITEID,FTASKID,FSEQUENCENUM,FISSAFETYCONFIRMED,FISPPECONFIRMED,FSTARTEDBY,FSTARTDATE,FSTARTTIME,FCREATEDON,FCREATEDTIME,FUPDATEDON,FUPDATEDTIME) ");
            sqlCmdBuilder.Append(" VALUES(:WORK_ORDERID,:SITEID,:TASKID,:SEQUENCENUM,:ISSAFETYCONFIRMED,:ISPPECONFIRMED,:STARTEDBY,:STARTDATE,:STARTTIME,:STARTDATE,:STARTTIME,:STARTDATE,:STARTTIME) ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":WORK_ORDERID", DbType.AnsiString, workOrderID.Trim().PadLeft(12, '0'));
            db.AddInParameter(dbCmd, ":TASKID", DbType.Int32, taskID);
            db.AddInParameter(dbCmd, ":SEQUENCENUM", DbType.Int32, sequenceNum);
            db.AddInParameter(dbCmd, ":ISSAFETYCONFIRMED", DbType.AnsiStringFixedLength, IsSafetyConfirmed);
            db.AddInParameter(dbCmd, ":ISPPECONFIRMED", DbType.AnsiStringFixedLength, isPPEConfirmed);
            db.AddInParameter(dbCmd, ":STARTEDBY", DbType.Int32, startedBy);
            db.AddInParameter(dbCmd, ":STARTDATE", DbType.Int32, startDate);
            db.AddInParameter(dbCmd, ":STARTTIME", DbType.Int32, startTime);

            db.ExecuteNonQuery(dbCmd, transaction);
        }

        public static int GetWorkOrderTaskNextSequence(Database db, DbTransaction transaction, int siteID, string workOrderID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT NVL(MAX(FSEQUENCENUM),0)+1 AS NEXTSEQUENCENUM FROM LDB1_MAINT_WORKORDER_TASK ");
            sqlCmdBuilder.Append(" WHERE FWORK_ORDERID=:WORK_ORDERID AND FSITEID=:SITEID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":WORK_ORDERID", DbType.AnsiString, workOrderID.Trim().PadLeft(12, '0'));

            return Convert.ToInt32(db.ExecuteScalar(dbCmd, transaction));
        }

        public static void UpdateTaskEndInfo(Database db, DbTransaction transaction, int siteID, string workOrderID, int taskID, int endDate, int endTime, int endedBy)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_WORKORDER_TASK SET FENDEDBY=:ENDEDBY,FENDDATE=:ENDDATE,FENDTIME=:ENDTIME,FUPDATEDON=:ENDDATE,FUPDATEDTIME=:ENDTIME ");
            sqlCmdBuilder.Append(" WHERE FWORK_ORDERID=:WORK_ORDERID AND FTASKID=:TASKID AND FSITEID=:SITEID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":WORK_ORDERID", DbType.AnsiString, workOrderID.Trim().PadLeft(12, '0'));
            db.AddInParameter(dbCmd, ":TASKID", DbType.Int32, taskID);
            db.AddInParameter(dbCmd, ":ENDEDBY", DbType.Int32, endedBy);
            db.AddInParameter(dbCmd, ":ENDDATE", DbType.Int32, endDate);
            db.AddInParameter(dbCmd, ":ENDTIME", DbType.Int32, endTime);

            db.ExecuteNonQuery(dbCmd, transaction);
        }

        public static void DeleteTaskParametersValue(Database db, DbTransaction transaction, int siteID, string workOrderID, int taskID, string parameterIDListString, int currentDate, int currentTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_WORKORDER_TASKPARAM SET FSTATUS='I',FUPDATEDON=:UPDATEDON,FUPDATEDTIME=:UPDATEDTIME ");
            sqlCmdBuilder.Append(" WHERE FWORK_ORDERID=:WORK_ORDERID AND FTASKID=:TASKID AND FSITEID=:SITEID AND FPARAMETERID IN (" + parameterIDListString + ") ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":WORK_ORDERID", DbType.AnsiString, workOrderID.Trim().PadLeft(12, '0'));
            db.AddInParameter(dbCmd, ":TASKID", DbType.Int32, taskID);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, currentDate);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, currentTime);

            db.ExecuteNonQuery(dbCmd, transaction);
        }

        public static void InsertTaskParameterValue(Database db, DbTransaction transaction, int siteID, string workOrderID, int taskID, int parameterID, string parameterValue, int selectCodeItem, char status, int recordedBy, int recordedDate, int recordedTime, int createdOn, int createdTime, int updatedOn, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" INSERT INTO LDB1_MAINT_WORKORDER_TASKPARAM(FWORK_ORDERID,FSITEID,FTASKID,FPARAMETERID,FVALUE,FSELECTCODEITEM,FSTATUS,FRECORDEDBY,FRECORDEDDATE,FRECORDEDTIME,FCREATEDON,FCREATEDTIME,FUPDATEDON,FUPDATEDTIME) ");
            sqlCmdBuilder.Append(" VALUES(:WORK_ORDERID,:SITEID,:TASKID,:PARAMETERID,:PARAMETERVALUE,:SELECTCODEITEM,:STATUS,:RECORDEDBY,:RECORDEDDATE,:RECORDEDTIME,:CREATEDON,:CREATEDTIME,:UPDATEDON,:UPDATEDTIME) ");

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
        public static DataTable GetWorkOrderTaskParamterValues(Database db, int siteID, string workOrderID, int taskID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FPARAMETERID,FSTATUS ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_WORKORDER_TASKPARAM ");
            sqlCmdBuilder.Append(" WHERE FWORK_ORDERID=:WORK_ORDERID AND FTASKID=:TASKID AND FSITEID=:SITEID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":TASKID", DbType.Int32, taskID);
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":WORK_ORDERID", DbType.AnsiString, workOrderID.Trim().PadLeft(12, '0'));

            return db.ExecuteDataSet(dbCmd).Tables[0];
        }

        public static void UpdateWorkOrderTaskParameterValue(Database db, DbTransaction transaction, int siteID, string workOrderID, int taskID, int parameterID, string parameterValue, int selectCodeItem, int currentDate, int currentTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_WORKORDER_TASKPARAM SET FVALUE=:PARAMETERVALUE,FSELECTCODEITEM=:SELECTCODEITEM,FSTATUS='A',FUPDATEDON=:UPDATEDON,FUPDATEDTIME=:UPDATEDTIME ");
            sqlCmdBuilder.Append(" WHERE FWORK_ORDERID=:WORK_ORDERID AND FTASKID=:TASKID AND FPARAMETERID=:PARAMETERID AND FSITEID=:SITEID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":WORK_ORDERID", DbType.AnsiString, workOrderID.Trim().PadLeft(12, '0'));
            db.AddInParameter(dbCmd, ":TASKID", DbType.Int32, taskID);
            db.AddInParameter(dbCmd, ":PARAMETERID", DbType.Int32, parameterID);
            db.AddInParameter(dbCmd, ":PARAMETERVALUE", DbType.String, parameterValue.Trim());
            db.AddInParameter(dbCmd, ":SELECTCODEITEM", DbType.Int32, selectCodeItem);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, currentDate);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, currentTime);

            db.ExecuteNonQuery(dbCmd, transaction);
        }

        public static void UpdateTaskRemark(Database db, DbTransaction transaction, int siteID, string workOrderID, int taskID, string remarks, int updatedDate, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_WORKORDER_TASK SET FREMARKS=:REMARKS,FUPDATEDON=:UPDATEDON,FUPDATEDTIME=:UPDATEDTIME ");
            sqlCmdBuilder.Append(" WHERE FWORK_ORDERID=:WORK_ORDERID AND FTASKID=:TASKID AND FSITEID=:SITEID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":WORK_ORDERID", DbType.AnsiString, workOrderID.Trim().PadLeft(12, '0'));
            db.AddInParameter(dbCmd, ":TASKID", DbType.Int32, taskID);
            db.AddInParameter(dbCmd, ":REMARKS", DbType.String, remarks.Trim());
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedDate);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);

            db.ExecuteNonQuery(dbCmd, transaction);
        }

        public static int GetNextWorkOrderTaskImageNextItem(Database db, int siteID, string workOrderID, int taskID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT NVL(MAX(FIMAGEITEM),0)+1 AS FIMAGEITEM ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_WORKORDER_TASKIMG ");
            sqlCmdBuilder.Append(" WHERE FWORK_ORDERID=:WORK_ORDERID AND FSITEID=:SITEID AND FTASKID=:TASKID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":WORK_ORDERID", DbType.AnsiString, workOrderID.Trim().PadLeft(12, '0'));
            db.AddInParameter(dbCmd, ":TASKID", DbType.Int32, taskID);

            return Convert.ToInt32(db.ExecuteScalar(dbCmd));
        }

        public static void InsertWorkOrderTaskImage(Database db, DbTransaction transaction, int siteID, string workOrderID, long taskID, int imageItem, string imageName, int currentDate, int currentTime,
            int updatedOn, int updatedTime, string syncMobIdentifier)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" INSERT INTO LDB1_MAINT_WORKORDER_TASKIMG(FWORK_ORDERID,FSITEID,FTASKID,FIMAGEITEM,FIMAGENAME,FCREATEDON,FCREATEDTIME,FUPDATEDON,FUPDATEDTIME,FMOB_SYNC_IDENTIFIER) ");
            sqlCmdBuilder.Append(" VALUES(:WORK_ORDERID,:SITEID,:TASKID,:IMAGEITEM,:IMAGENAME,:CREATEDON,:CREATEDTIME,:UPDATEDON,:UPDATEDTIME,:MOB_SYNC_IDENTIFIER) ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":WORK_ORDERID", DbType.AnsiString, workOrderID.Trim().PadLeft(12, '0'));
            db.AddInParameter(dbCmd, ":TASKID", DbType.Int64, taskID);
            db.AddInParameter(dbCmd, ":IMAGEITEM", DbType.Int32, imageItem);
            db.AddInParameter(dbCmd, ":IMAGENAME", DbType.AnsiString, imageName.Trim());
            db.AddInParameter(dbCmd, ":CREATEDON", DbType.Int32, currentDate);
            db.AddInParameter(dbCmd, ":CREATEDTIME", DbType.Int32, currentTime);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedOn);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);
            db.AddInParameter(dbCmd, ":MOB_SYNC_IDENTIFIER", DbType.AnsiString, syncMobIdentifier);

            if (transaction != null)
                db.ExecuteNonQuery(dbCmd, transaction);
            else
                db.ExecuteNonQuery(dbCmd);
        }

        public static DataTable GetWorkOrderTaskMandatoryItems(Database db, int siteID, string workOrderID, int taskID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT T.FREMARKMANDATORY,T.FPICTUREMANDATORY,WT.FREMARKS,NVL(P.FPARAMETERID,0) AS FPARAMETERID,NVL(WP.FPARAMETERID,0) AS SAVEDPARAMETER ");
            sqlCmdBuilder.Append(" ,(SELECT COUNT(FIMAGEITEM) FROM LDB1_MAINT_WORKORDER_TASKIMG I WHERE I.FWORK_ORDERID=W.FWORK_ORDERID AND I.FTASKID=T.FTASKID AND I.FSITEID=W.FSITEID) AS IMAGECOUNT ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_WORKORDER W ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_TASKS T ON T.FREFERENCEID=W.FTASKGROUPID AND T.FTASKID=:TASKID AND T.FSITEID=W.FSITEID ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_TASKSPARAM P ON P.FTASKGROUPID=W.FTASKGROUPID AND P.FREFERENCEID=T.FTASKID AND P.FISMANDATORY='Y' AND P.FSITEID=T.FSITEID ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_WORKORDER_TASK WT ON WT.FWORK_ORDERID=W.FWORK_ORDERID AND WT.FTASKID=T.FTASKID AND WT.FSITEID=T.FSITEID ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_WORKORDER_TASKPARAM WP ON WP.FWORK_ORDERID=W.FWORK_ORDERID AND WP.FTASKID=T.FTASKID AND WP.FPARAMETERID=P.FPARAMETERID AND WP.FSITEID=T.FSITEID AND WP.FSTATUS='A' ");
            sqlCmdBuilder.Append(" WHERE W.FWORK_ORDERID=:WORKORDERID AND W.FSITEID=:SITEID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":WORKORDERID", DbType.AnsiString, workOrderID.Trim().PadLeft(12, '0'));
            db.AddInParameter(dbCmd, ":TASKID", DbType.Int32, taskID);

            return db.ExecuteDataSet(dbCmd).Tables[0];
        }

        public static IDataReader GetWorkOrderSpareParts(Database db, int siteID, string workOrderID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();

            sqlCmdBuilder.Append(" SELECT LTRIM(SP.FIDHID,'0') AS FIDHID, M.FIDHDESC, M.FBASEUOM, DECODE(NVL(WS.FREQUIREDQTY,0),0,SP.FQTY,WS.FREQUIREDQTY) AS FREQUIREDQUANTITY, WS.FACTUALQUANTITY, WO.FWORKORDERSTATUS, 'N' AS FISSOPSPAREPART ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_SCHEDULE_SPAREPARTS SP INNER JOIN LDB1_PLANTMATERIAL M ON M.FSITEID=SP.FSITEID AND M.FIDHID=SP.FIDHID ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_SCHEDULE MS ON MS.FSCHEDULEID=SP.FSCHEDULEID AND MS.FSITEID=SP.FSITEID ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_WORKORDER WO ON WO.FSITEID=MS.FSITEID AND WO.FREF_SCHEDULEID=MS.FSCHEDULEID ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_WORKORDER_SPAREPART WS ON WS.FSITEID=SP.FSITEID AND WS.FWORK_ORDERID=WO.FWORK_ORDERID AND WS.FIDHID=SP.FIDHID ");
            sqlCmdBuilder.Append(" WHERE SP.FSITEID=:SITEID AND WO.FWORK_ORDERID=:WORK_ORDERID AND DECODE(NVL(WS.FIDHID,''),'',SP.FSTATUS,'A')='A' ");

            sqlCmdBuilder.Append(" UNION ");

            sqlCmdBuilder.Append(" SELECT LTRIM(TS.FIDHID,'0') AS FIDHID, M.FIDHDESC, M.FBASEUOM, SUM(TS.FQTY) AS FREQUIREDQUANTITY, WS.FACTUALQUANTITY, WO.FWORKORDERSTATUS, 'Y' AS FISSOPSPAREPART  ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_SCHEDULE MS ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_WORKORDER WO ON WO.FSITEID=MS.FSITEID AND WO.FREF_SCHEDULEID=MS.FSCHEDULEID ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_TASKGROUP TG ON ");
            sqlCmdBuilder.Append(" DECODE(NVL(WO.FTASKGROUPID,0),0,(CASE WHEN TG.FIDENTIFIER=MS.FTASKGROUPIDENTIFIER AND TG.FSTATUS='A' THEN 1 ELSE 0 END),(CASE WHEN TG.FTASKGROUPID=WO.FTASKGROUPID THEN 1 ELSE 0 END))=1 AND TG.FSITEID=WO.FSITEID ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_TASKS MT ON MT.FREFERENCEID=TG.FTASKGROUPID AND MT.FSITEID=TG.FSITEID ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_TASKSPARES TS ON TS.FTASKID=MT.FTASKID AND TS.FSITEID=MT.FSITEID ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_PLANTMATERIAL M ON M.FIDHID=TS.FIDHID AND M.FSITEID=TS.FSITEID ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_WORKORDER_SPAREPART WS ON WS.FSITEID=MS.FSITEID AND WS.FWORK_ORDERID=WO.FWORK_ORDERID AND WS.FIDHID=TS.FIDHID ");
            sqlCmdBuilder.Append(" WHERE MS.FSITEID=:SITEID AND WO.FWORK_ORDERID=:WORK_ORDERID AND DECODE(NVL(WS.FIDHID,''),'',TS.FSTATUS,'A')='A' ");
            sqlCmdBuilder.Append(" GROUP BY TS.FIDHID,M.FIDHDESC,M.FBASEUOM, WS.FACTUALQUANTITY, WO.FWORKORDERSTATUS ");

            sqlCmdBuilder.Append(" ORDER BY FISSOPSPAREPART DESC ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":WORK_ORDERID", DbType.AnsiString, workOrderID.Trim().PadLeft(12, '0'));

            return db.ExecuteReader(dbCmd);
        }

        public static bool InsertWorkOrderSparePart(Database db, DbTransaction transaction, int siteID, string workOrderID, string materialCode, decimal requiredQty, decimal usedQuantity, int createdBy, int createdDate, int createdTime, int updatedBy, int updatedDate, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" INSERT INTO LDB1_MAINT_WORKORDER_SPAREPART (FWORK_ORDERID,FSITEID,FIDHID,FREQUIREDQTY,FACTUALQUANTITY,FCREATEDBY,FCREATEDON,FCREATEDTIME,FUPDATEDBY,FUPDATEDON,FUPDATEDTIME) ");
            sqlCmdBuilder.Append(" VALUES (:WORK_ORDERID,:SITEID,:IDHID,:REQUIREDQTY,:ACTUALQUANTITY,:CREATEDBY,:CREATEDON,:CREATEDTIME,:UPDATEDBY,:UPDATEDON,:UPDATEDTIME) ");
            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":WORK_ORDERID", DbType.AnsiString, workOrderID.Trim().PadLeft(12, '0'));
            db.AddInParameter(dbCmd, ":IDHID", DbType.AnsiString, materialCode.Trim().PadLeft(18, '0'));
            db.AddInParameter(dbCmd, ":REQUIREDQTY", DbType.Decimal, requiredQty);
            db.AddInParameter(dbCmd, ":ACTUALQUANTITY", DbType.Decimal, usedQuantity);
            db.AddInParameter(dbCmd, ":CREATEDBY", DbType.Int32, createdBy);
            db.AddInParameter(dbCmd, ":CREATEDON", DbType.Int32, createdDate);
            db.AddInParameter(dbCmd, ":CREATEDTIME", DbType.Int32, createdTime);
            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedDate);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);

            db.ExecuteNonQuery(dbCmd, transaction);
            return true;
        }

        public static bool UpdateWorkOrderSparePart(Database db, DbTransaction transaction, int siteID, string workOrderID, string materialCode, decimal requiredQty, decimal usedQuantity, int createdBy, int createdDate, int createdTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_WORKORDER_SPAREPART SET FREQUIREDQTY=:REQUIREDQTY,FACTUALQUANTITY=:ACTUALQUANTITY,FUPDATEDBY=:CREATEDBY,FUPDATEDON=:CREATEDON,FUPDATEDTIME=:CREATEDTIME ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FWORK_ORDERID=:WORK_ORDERID AND FIDHID=:IDHID ");
            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":WORK_ORDERID", DbType.AnsiString, workOrderID.Trim().PadLeft(12, '0'));
            db.AddInParameter(dbCmd, ":IDHID", DbType.AnsiString, materialCode.Trim().PadLeft(18, '0'));
            db.AddInParameter(dbCmd, ":REQUIREDQTY", DbType.Decimal, requiredQty);
            db.AddInParameter(dbCmd, ":ACTUALQUANTITY", DbType.Decimal, usedQuantity);
            db.AddInParameter(dbCmd, ":CREATEDBY", DbType.Int32, createdBy);
            db.AddInParameter(dbCmd, ":CREATEDON", DbType.Int32, createdDate);
            db.AddInParameter(dbCmd, ":CREATEDTIME", DbType.Int32, createdTime);

            db.ExecuteNonQuery(dbCmd, transaction);
            return true;
        }

        public static bool CheckWorkOrderSparePartExists(Database db, DbTransaction transaction, int siteID, string workOrderID, string materialCode)
        {
            IDataReader dataReaderTaskName = null;
            bool isExists = false;

            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FIDHID FROM LDB1_MAINT_WORKORDER_SPAREPART ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FWORK_ORDERID=:WORK_ORDERID AND FIDHID=:IDHID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":WORK_ORDERID", DbType.AnsiString, workOrderID.Trim().PadLeft(12, '0'));
            db.AddInParameter(dbCmd, ":IDHID", DbType.AnsiString, materialCode.Trim().PadLeft(18, '0'));

            try
            {
                using (dataReaderTaskName = db.ExecuteReader(dbCmd, transaction))
                {
                    if (dataReaderTaskName.Read())
                    {
                        isExists = true;
                    }
                    dataReaderTaskName.Close();
                }

                return isExists;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (dataReaderTaskName != null && !dataReaderTaskName.IsClosed)
                    dataReaderTaskName.Close();
            }
        }

        public static bool UpdateWorkOrderStatus(Database db, DbTransaction transaction, int siteID, string workOrderID, string status, int workOrderStartDate, int workOrderStartTime, int workOrderEndDate, int workOrderEndTime
           , decimal laborTimeTaken, char laborTimeTakenUnit, decimal timeSpent, char timeSpentUnit, int breakdownStartDate, int breakdownStartTime, int breakdownEndDate, int breakdownEndTime, decimal breakdownTimeTaken, char breakdownTakenUnit
          , int updatedBy, int updatedOn, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_WORKORDER SET FWORK_STARTDATE=:WORK_STARTDATE,FWORK_STARTTIME=:WORK_STARTTIME ");
            sqlCmdBuilder.Append(" ,FWORK_ENDDATE=:WORK_ENDDATE,FWORK_ENDTIME=:WORK_ENDTIME,FLABORTIME=:LABORTIME,FLABORTIMEUNIT=:LABORTIMEUNIT ");
            sqlCmdBuilder.Append(" ,FTIMETAKEN=:TIMESPENT,FTIMETAKENUNIT=:TIMESPENTUNIT ");
            sqlCmdBuilder.Append(" ,FBREAKDOWN_STARTDATE=:BREAKDOWN_STARTDATE,FBREAKDOWN_STARTTIME=:BREAKDOWN_STARTTIME,FBREAKDOWN_ENDDATE=:BREAKDOWN_ENDDATE,FBREAKDOWN_ENDTIME=:BREAKDOWN_ENDTIME ");
            sqlCmdBuilder.Append(" ,FBREAKDOWN_DURATION=:BREAKDOWN_DURATION,FBREAKDOWN_DURATIONUNIT=:BREAKDOWN_DURATIONUNIT ");

            if (!string.IsNullOrEmpty(status))
                sqlCmdBuilder.Append(" ,FWORKORDERSTATUS=:WORKORDERSTATUS ");

            sqlCmdBuilder.Append(" ,FUPDATEDBY=:UPDATEDBY,FUPDATEDON=:UPDATEDON,FUPDATEDTIME=:UPDATEDTIME ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FWORK_ORDERID=:WORK_ORDERID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":WORK_ORDERID", DbType.AnsiString, workOrderID.Trim().PadLeft(12, '0'));
            db.AddInParameter(dbCmd, ":WORK_STARTDATE", DbType.Int32, workOrderStartDate);
            db.AddInParameter(dbCmd, ":WORK_STARTTIME", DbType.Int32, workOrderStartTime);
            db.AddInParameter(dbCmd, ":WORK_ENDDATE", DbType.Int32, workOrderEndDate);
            db.AddInParameter(dbCmd, ":WORK_ENDTIME", DbType.Int32, workOrderEndTime);
            if (!string.IsNullOrEmpty(status))
                db.AddInParameter(dbCmd, ":WORKORDERSTATUS", DbType.AnsiString, status);
            db.AddInParameter(dbCmd, ":LABORTIME", DbType.Decimal, laborTimeTaken);
            db.AddInParameter(dbCmd, ":LABORTIMEUNIT", DbType.AnsiStringFixedLength, laborTimeTakenUnit);
            db.AddInParameter(dbCmd, ":TIMESPENT", DbType.Decimal, timeSpent);
            db.AddInParameter(dbCmd, ":TIMESPENTUNIT", DbType.AnsiStringFixedLength, timeSpentUnit);

            db.AddInParameter(dbCmd, ":BREAKDOWN_STARTDATE", DbType.Int32, breakdownStartDate);
            db.AddInParameter(dbCmd, ":BREAKDOWN_STARTTIME", DbType.Int32, breakdownStartTime);
            db.AddInParameter(dbCmd, ":BREAKDOWN_ENDDATE", DbType.Int32, breakdownEndDate);
            db.AddInParameter(dbCmd, ":BREAKDOWN_ENDTIME", DbType.Int32, breakdownEndTime);
            db.AddInParameter(dbCmd, ":BREAKDOWN_DURATION", DbType.Decimal, breakdownTimeTaken);
            db.AddInParameter(dbCmd, ":BREAKDOWN_DURATIONUNIT", DbType.AnsiStringFixedLength, breakdownTakenUnit);
            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedOn);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);

            if (transaction != null)
                db.ExecuteNonQuery(dbCmd, transaction);
            else
                db.ExecuteNonQuery(dbCmd);
            return true;
        }

        #endregion

        #region Tools info
        public static IDataReader GetAllToolsInfo(Database db, int siteID, int pageSize, int pageIndex, string sortType, int toolID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();

            if (pageSize > 0)
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");

            sqlCmdBuilder.Append(" SELECT T.FTOOLSID,T.FTOOLSDESC,T.FTOOLSIMAGENAME  ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_TOOLS T ");
            sqlCmdBuilder.Append(" WHERE T.FSITEID=:SITEID AND FSTATUS='A' ");

            if (toolID > 0)
            {
                sqlCmdBuilder.Append(" AND T.FTOOLSID=:TOOLID ");
            }

            #region Sorting
            switch (sortType)
            {
                case "ToolsDescription_asc":
                    sqlCmdBuilder.Append(" ORDER BY UPPER(T.FTOOLSDESC) ASC ");
                    break;
                case "ToolsDescription_desc":
                    sqlCmdBuilder.Append(" ORDER BY UPPER(T.FTOOLSDESC) DESC ");
                    break;
                default:
                    sqlCmdBuilder.Append(" ORDER BY T.FUPDATEDATE DESC,T.FTIMESTAMP DESC ");
                    break;
            }
            #endregion

            #region Paging
            if (pageSize > 0)
            {
                if (pageIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:PAGEINDEX)  AND (:PAGESIZE + (:PAGEINDEX - 1))");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:PAGEINDEX)  AND  (:PAGESIZE + (:PAGEINDEX))");
            }
            #endregion

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);


            if (toolID > 0)
            {
                db.AddInParameter(dbCmd, ":TOOLID", DbType.Int32, toolID);
            }

            if (pageSize > 0)
            {
                db.AddInParameter(dbCmd, ":PAGEINDEX", DbType.Int32, pageIndex);
                db.AddInParameter(dbCmd, ":PAGESIZE", DbType.Int32, pageSize);
            }

            return db.ExecuteReader(dbCmd);
        }

        public static bool InsertToolsInfo(Database db, DbTransaction transaction, int siteID, string toolDescription, string imageName, int createdBy, int createdDate)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" INSERT INTO LDB1_MAINT_TOOLS(FTOOLSID,FSITEID,FTOOLSDESC,FTOOLSIMAGENAME,FSTATUS,FCREATEDBY,FCREATEDDATE,FUPDATEDBY,FUPDATEDATE) ");
            sqlCmdBuilder.Append(" VALUES(SEQUENCE_MAINT_TOOLS_ID.NEXTVAL,:SITEID,:TOOLSDESC,:IMAGENAME,'A',:CREATEDBY,:CREATEDON,:CREATEDBY,:CREATEDON) ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":TOOLSDESC", DbType.String, toolDescription.Trim());
            db.AddInParameter(dbCmd, ":IMAGENAME", DbType.String, imageName != null ? imageName.Trim() : imageName);
            db.AddInParameter(dbCmd, ":CREATEDBY", DbType.Int32, createdBy);
            db.AddInParameter(dbCmd, ":CREATEDON", DbType.Int32, createdDate);

            if (transaction != null)
                db.ExecuteNonQuery(dbCmd, transaction);
            else
                db.ExecuteNonQuery(dbCmd);
            return true;
        }

        public static bool UpdateToolsInfo(Database db, DbTransaction transaction, int siteID, int toolID, string toolDescription, string imageName, int updatedBy, int updatedDate)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_TOOLS SET FTOOLSDESC=:TOOLSDESC ");

            if (!string.IsNullOrEmpty(imageName))
            {
                sqlCmdBuilder.Append(" ,FTOOLSIMAGENAME=:IMAGENAME ");
            }

            sqlCmdBuilder.Append(" ,FUPDATEDBY=:UPDATEDBY,FUPDATEDATE=:UPDATEDON ");
            sqlCmdBuilder.Append(" WHERE FTOOLSID=:TOOLSID AND FSITEID=:SITEID AND FSTATUS='A' ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":TOOLSID", DbType.Int32, toolID);
            db.AddInParameter(dbCmd, ":TOOLSDESC", DbType.String, toolDescription.Trim());

            if (!string.IsNullOrEmpty(imageName))
            {
                db.AddInParameter(dbCmd, ":IMAGENAME", DbType.String, imageName.Trim());
            }

            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedDate);

            if (transaction != null)
                db.ExecuteNonQuery(dbCmd, transaction);
            else
                db.ExecuteNonQuery(dbCmd);

            return true;
        }

        public static bool UpdateToolStatus(Database db, DbTransaction transaction, int siteID, int toolID, char status, int updatedBy, int updatedDate)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_TOOLS SET FSTATUS=:STATUS,FUPDATEDBY=:UPDATEDBY,FUPDATEDATE=:UPDATEDATE ");
            if (status == 'I')
            {
                sqlCmdBuilder.Append(" ,FTOOLSIMAGENAME=NULL ");
            }
            sqlCmdBuilder.Append(" WHERE FTOOLSID=:TOOLSID AND FSITEID=:SITEID  ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":TOOLSID", DbType.Int32, toolID);
            db.AddInParameter(dbCmd, ":STATUS", DbType.AnsiStringFixedLength, status);
            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDATE", DbType.Int32, updatedDate);

            if (transaction != null)
                db.ExecuteNonQuery(dbCmd, transaction);
            else
                db.ExecuteNonQuery(dbCmd);

            return true;
        }

        public static IDataReader CheckToolExist(Database db, int siteID, int toolID, string toolDesc, bool checkStatus)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FTOOLSID,FSTATUS,FTOOLSDESC FROM LDB1_MAINT_TOOLS ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID  ");
            if (toolID > 0)
            {
                sqlCmdBuilder.Append("  AND FTOOLSID<>:TOOLSID ");
            }
            if (toolDesc.Length > 0)
            {
                sqlCmdBuilder.Append("  AND UPPER(FTOOLSDESC)=:TOOLSDESC ");
            }
            if (checkStatus)
            {
                sqlCmdBuilder.Append(" AND FSTATUS='A' ");
            }
            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            if (toolID > 0)
            {
                db.AddInParameter(dbCmd, ":TOOLSID", DbType.Int32, toolID);
            }
            if (toolDesc.Length > 0)
            {
                db.AddInParameter(dbCmd, ":TOOLSDESC", DbType.String, toolDesc.Trim().ToUpper());
            }
            return db.ExecuteReader(dbCmd);

        }
        #endregion

        #region Configure Spare Parts
        public static IDataReader GetSparePartsInfoFromView(Database db, int siteID, string viewName, List<DynamicGrid.SQLColumnFilterInfo> sqlColumnFilterInfoList)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT * FROM " + viewName);
            sqlCmdBuilder.Append(" WHERE FSITEID = " + siteID);

            if (sqlColumnFilterInfoList != null)
            {
                sqlCmdBuilder.Append(" AND ");
                DynamicGrid.Common.AppendDynamicFilter(sqlCmdBuilder, sqlColumnFilterInfoList, -1);
            }

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            if (sqlColumnFilterInfoList != null)
            {
                DynamicGrid.Common.AddDynamicFilterParameters(db, dbCmd, sqlColumnFilterInfoList);
            }
            return db.ExecuteReader(dbCmd);
        }

        public static bool CheckSparePartsMaterialCodeExist(Database db, DbTransaction transaction, int siteID, string materialCode, string type, out string status)
        {
            try
            {
                status = "I";
                StringBuilder sqlCmdBuilder = new StringBuilder();
                sqlCmdBuilder.Append(" SELECT LTRIM(FIDHID) AS FIDHID,FSTATUS FROM LDB1_PLANTMATERIAL  ");
                sqlCmdBuilder.Append(" WHERE FIDHID=:IDHID AND FSITEID=:SITEID ");

                if (type != null && type.ToString().Length > 0)
                    sqlCmdBuilder.Append(" AND FTYPE=:TYPE ");


                DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
                dbCmd.CommandType = CommandType.Text;

                db.AddInParameter(dbCmd, ":IDHID", DbType.AnsiString, materialCode.Trim().ToUpper().PadLeft(18, '0'));
                db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
                if (type != null && type.ToString().Length > 0)
                    db.AddInParameter(dbCmd, ":TYPE", DbType.AnsiStringFixedLength, type);

                bool isExists = false;
                DataTable sparePartsInfo = null;

                sparePartsInfo = db.ExecuteDataSet(dbCmd, transaction).Tables[0];

                if (sparePartsInfo.Rows.Count > 0)
                {
                    isExists = true;
                    status = sparePartsInfo.Rows[0]["FSTATUS"].ToString();
                }

                return isExists;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public static bool CheckSparePartsCategoryExist(Database db, DbTransaction transaction, int siteID, int categoryID)
        {
            try
            {
                StringBuilder sqlCmdBuilder = new StringBuilder();
                sqlCmdBuilder.Append(" SELECT FIDHID FROM LDB1_PLANTMATERIAL  ");
                sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FMATCATEGORY=:MATCATEGORY AND FSTATUS='A' AND FTYPE='S' ");

                DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
                dbCmd.CommandType = CommandType.Text;

                db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
                db.AddInParameter(dbCmd, ":MATCATEGORY", DbType.Int32, categoryID);

                bool isExists = false;
                DataTable sparePartsInfo = null;

                sparePartsInfo = db.ExecuteDataSet(dbCmd, transaction).Tables[0];

                if (sparePartsInfo.Rows.Count > 0)
                {
                    isExists = true;
                }

                return isExists;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public static IDataReader GetSparePartsScheduleDetails(Database db, int siteID, string materialCode)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT MS.FSCHEDULE_TYPE,MS.FSCHEDULEID  ");
            sqlCmdBuilder.Append(" FROM LDB1_PLANTMATERIAL M ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_SCHEDULE_SPAREPARTS SS ON M.FIDHID=SS.FIDHID  AND M.FSITEID=SS.FSITEID AND SS.FSTATUS='A' ");
            sqlCmdBuilder.Append(" INNER JOIN LDB1_MAINT_SCHEDULE MS ON MS.FSCHEDULEID=SS.FSCHEDULEID AND MS.FSITEID=SS.FSITEID AND MS.FSTATUS='A' AND MS.FSCHEDULE_TYPE IN ('S','W') ");
            sqlCmdBuilder.Append(" WHERE UPPER(M.FIDHID)=:MATERIAL AND M.FSITEID=:SITEID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":MATERIAL", DbType.AnsiString, materialCode.Trim().PadLeft(18, '0').ToUpper());

            return db.ExecuteReader(dbCmd);
        }

        public static bool InsertSparePartsInfo(Database db, DbTransaction transaction, int siteID, string materialCode, string description, char matType, string uom, int categoryID, int createdBy, int createdOn, int createdTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            StringBuilder sqlCmdBuilderValues = new StringBuilder();
            sqlCmdBuilder.Append(" INSERT INTO LDB1_PLANTMATERIAL  ");
            sqlCmdBuilder.Append(" (FIDHID,FIDHDESC,FSAP_IDHDESC,FSITEID,FTYPE,FSTATUS,FBASEUOM,FMATCATEGORY,FCREATEDBY,FCREATEDDATE,FUPDATEDBY,FUPDATEDON,FUPDATEDTIME) ");
            sqlCmdBuilderValues.Append(" VALUES (:IDHID,:IDHDESC,:IDHDESC,:SITEID,:TYPE,'A',:UOM,:MATCATEGORY,:CREATEDBY,:CREATEDDATE,:UPDATEDBY,:UPDATEDON,:UPDATEDTIME) ");


            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString() + " " + sqlCmdBuilderValues.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":IDHID", DbType.AnsiString, materialCode.Trim().ToUpper().PadLeft(18, '0'));
            db.AddInParameter(dbCmd, ":IDHDESC", DbType.String, description.Trim());
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":TYPE", DbType.AnsiStringFixedLength, matType);
            db.AddInParameter(dbCmd, ":UOM", DbType.AnsiString, uom.Trim().ToUpper());
            db.AddInParameter(dbCmd, ":MATCATEGORY", DbType.Int32, categoryID);
            db.AddInParameter(dbCmd, ":CREATEDBY", DbType.Int32, createdBy);
            db.AddInParameter(dbCmd, ":CREATEDDATE", DbType.Int32, createdOn);
            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, createdBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, createdOn);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, createdTime);

            db.ExecuteNonQuery(dbCmd, transaction);

            return true;
        }

        public static bool UpdateSparePartsInfo(Database db, DbTransaction transaction, int siteID, string materialCode, string uom, string description, int categoryID,
             int updatedBy, int updatedOn, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_PLANTMATERIAL SET FIDHDESC=:IDHDESC,FSAP_IDHDESC=:IDHDESC,FBASEUOM=:BASEUOM,FMATCATEGORY=:MATCATEGORY ");
            sqlCmdBuilder.Append(" ,FUPDATEDTIME=:UPDATEDTIME,FUPDATEDON=:UPDATEDON,FUPDATEDBY=:UPDATEDBY ");
            sqlCmdBuilder.Append(" WHERE FIDHID=:IDHID AND FSITEID=:SITEID ");



            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":IDHID", DbType.AnsiString, materialCode.Trim().ToUpper().PadLeft(18, '0'));
            db.AddInParameter(dbCmd, ":IDHDESC", DbType.String, description.Trim());
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":BASEUOM", DbType.AnsiString, uom.Trim().ToUpper());
            db.AddInParameter(dbCmd, ":MATCATEGORY", DbType.Int32, categoryID);
            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedOn);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);

            db.ExecuteNonQuery(dbCmd, transaction);

            return true;
        }

        public static bool UpdateSparePartsInfoStatus(Database db, DbTransaction transaction, int siteID, string materialCode, char status, int updatedBy, int updatedOn, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_PLANTMATERIAL SET FSTATUS=:STATUS,FUPDATEDTIME=:UPDATEDTIME,FUPDATEDON=:UPDATEDON,FUPDATEDBY=:UPDATEDBY");
            sqlCmdBuilder.Append(" WHERE FIDHID=:IDHID AND FSITEID=:SITEID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":IDHID", DbType.AnsiString, materialCode.Trim().ToUpper().PadLeft(18, '0'));
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedOn);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);
            db.AddInParameter(dbCmd, ":STATUS", DbType.AnsiStringFixedLength, status);

            db.ExecuteNonQuery(dbCmd, transaction);

            return true;
        }

        #endregion

        #region Notification info

        public static IDataReader GetNotificationList(Database db, DbTransaction transaction, int siteID, int functionalLocationID, int equipmentID, int notificationID, string searchString, int pageSize, int pageIndex, string sortType)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();

            if (pageSize > 0)
                sqlCmdBuilder.Append(" SELECT * FROM ( SELECT B.*,ROWNUM AS FROWINDEX, MAX(ROWNUM) OVER () AS FCOUNT FROM ( ");

            sqlCmdBuilder.Append(" SELECT N.FSCHEDULEID,N.FLOCATIONID,L.FLOCATIONNAME,L.FLOCATIONCODE,N.FEQUIPMENTID,E.FEQUIPMENTNAME,E.FEQUIPMENTCODE,N.FPRIORITYTYPE,N.FMAINTENANCENAME,N.FSCHEDULESTATUS,N.FMAINDESCRIPTION,N.FNOTIFY_TYPEID ");
            sqlCmdBuilder.Append(" ,CASE WHEN MS.FISNOTIFICATIONORDER='C' THEN '' ELSE CASE WHEN NVL(MS.FERP_WORKORDER,'NA')='NA' THEN LTRIM(N.FNOTIFY_WORK_ORDERID,'0') ELSE LTRIM(MS.FERP_WORKORDER,'0') END END AS FNOTIFYWORKORDERID ");
            sqlCmdBuilder.Append(" ,N.FREMARKS,N.FCREATEDON,M.FNAME AS FNOTIFY_TYPE,T.FTEXT AS FPRIORITY,TO_CHAR(TRIM(U.FLASTNAME || ' ' || U.FFIRSTNAME)) AS FCREATEDBY,N.FREQUESTED_ENDDATE,N.FUPDATEDON,N.FUPDATEDTIME ");
            sqlCmdBuilder.Append(" ,MS.FUPDATEDON AS FCLOSEDON,TO_CHAR(TRIM(U1.FLASTNAME || ' ' || U1.FFIRSTNAME)) AS FCLOSEDBY,MS.FWORK_STARTDATE,MS.FWORK_STARTTIME,MS.FWORK_ENDDATE,MS.FWORK_ENDTIME,MS.FTIMETAKEN,MS.FTIMETAKENUNIT,MS.FREMARKS AS FCLOSEREMARK ");
            sqlCmdBuilder.Append(" FROM LDB1_MAINT_SCHEDULE N ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_WORKORDER MS ON MS.FSITEID=N.FSITEID AND MS.FWORK_ORDERID=N.FNOTIFY_WORK_ORDERID ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_LOCATIONS L ON N.FLOCATIONID = L.FLOCATIONID AND L.FSITEID = N.FSITEID ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_EQUIPMENT E ON N.FEQUIPMENTID = E.FEQUIPMENTID AND E.FSITEID = N.FSITEID AND E.FINFOTYPE = 'E' ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_MAINT_MASTER M ON M.FMASTERID = N.FNOTIFY_TYPEID ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_ENUMTYPE T ON T.FTYPE='MAINT_PRIORITY_TYPE' AND T.FVALUE=N.FPRIORITYTYPE ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_USERINFO U ON U.FUSERID=N.FCREATEDBY ");
            sqlCmdBuilder.Append(" LEFT OUTER JOIN LDB1_USERINFO U1 ON U1.FUSERID=MS.FTIMECONFIRMEDBY ");
            sqlCmdBuilder.Append(" WHERE N.FSITEID =:SITEID AND N.FSTATUS <> 'I' AND N.FSCHEDULE_TYPE = 'N' ");

            if (functionalLocationID > 0)
            {
                sqlCmdBuilder.Append(" AND N.FLOCATIONID=:LOCATIONID ");
            }

            if (equipmentID > 0)
            {
                sqlCmdBuilder.Append(" AND N.FEQUIPMENTID=:EQUIPMENTID ");
            }

            if (notificationID > 0)
            {
                sqlCmdBuilder.Append(" AND N.FSCHEDULEID=:SCHEDULEID ");
            }

            if (!string.IsNullOrEmpty(searchString))
            {
                sqlCmdBuilder.Append(" AND UPPER(N.FMAINTENANCENAME) LIKE :MAINTENANCENAME ");
            }

            sqlCmdBuilder.Append(" AND N.FUPDATEDON > TO_NUMBER(TO_CHAR(SYSDATE - 60, 'YYYYmmDD')) ");          //Show notificatins which are created in last 60 days.

            #region Sorting
            switch (sortType)
            {
                case "NotificationName_asc":
                    sqlCmdBuilder.Append(" ORDER BY UPPER(N.FMAINTENANCENAME) ASC,N.FUPDATEDON DESC,N.FUPDATEDTIME DESC ");
                    break;
                case "NotificationName_desc":
                    sqlCmdBuilder.Append(" ORDER BY UPPER(N.FMAINTENANCENAME) DESC,N.FUPDATEDON DESC,N.FUPDATEDTIME DESC ");
                    break;
                default:
                    sqlCmdBuilder.Append(" ORDER BY N.FUPDATEDON DESC,N.FUPDATEDTIME DESC ");
                    break;
            }
            #endregion

            #region Paging
            if (pageSize > 0)
            {
                if (pageIndex != 0)
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:PAGEINDEX)  AND (:PAGESIZE + (:PAGEINDEX - 1))");
                else
                    sqlCmdBuilder.Append(" ) B ) WHERE FROWINDEX BETWEEN (:PAGEINDEX)  AND  (:PAGESIZE + (:PAGEINDEX))");
            }
            #endregion

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);

            if (functionalLocationID > 0)
            {
                db.AddInParameter(dbCmd, ":LOCATIONID", DbType.Int32, functionalLocationID);
            }

            if (equipmentID > 0)
            {
                db.AddInParameter(dbCmd, ":EQUIPMENTID", DbType.Int32, equipmentID);
            }

            if (notificationID != 0)
            {
                db.AddInParameter(dbCmd, ":SCHEDULEID", DbType.Int32, notificationID);
            }

            if (!string.IsNullOrEmpty(searchString))
            {
                db.AddInParameter(dbCmd, ":MAINTENANCENAME", DbType.AnsiString, "%" + searchString.Trim().ToUpper() + "%");
            }
            if (pageSize > 0)
            {
                db.AddInParameter(dbCmd, ":PAGEINDEX", DbType.Int32, pageIndex);
                db.AddInParameter(dbCmd, ":PAGESIZE", DbType.Int32, pageSize);
            }
            if (transaction != null)
                return db.ExecuteReader(dbCmd, transaction);
            else
                return db.ExecuteReader(dbCmd);
        }

        public static int InsertNotificationInfo(Database db, DbTransaction transaction, int notificationID, int siteID, string maintenanceName, string maintenanceDesc, char scheduleType, string maintPriorityType, int fLocationID, int equipmentID
           , int notificationTypeID, int createdBy, int createdOn, int createdTime, int updatedBy, int updatedOn, int updatedTime, string scheduleStatus, int requestedEndDate)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" INSERT INTO LDB1_MAINT_SCHEDULE (FSCHEDULEID,FSITEID,FMAINTENANCENAME,FMAINDESCRIPTION,FSCHEDULE_TYPE,FPRIORITYTYPE,FLOCATIONID, ");
            sqlCmdBuilder.Append(" FEQUIPMENTID,FSCHEDULESTATUS,FNOTIFY_TYPEID,FSTATUS,FCREATEDBY,FCREATEDON,FCREATEDTIME,FUPDATEDBY,FUPDATEDON,FUPDATEDTIME,FREQUESTED_ENDDATE) ");
            sqlCmdBuilder.Append(" VALUES(:NOTIFICATIONID,:SITEID,:MAINTENANCENAME,:MAINDESCRIPTION,:SCHEDULE_TYPE,:PRIORITYTYPE,:LOCATIONID,:EQUIPMENTID,:SCHEDULESTATUS, ");
            sqlCmdBuilder.Append(" :NOTIFY_TYPEID,'A',:CREATEDBY,:CREATEDON,:CREATEDTIME,:UPDATEDBY,:UPDATEDON,:UPDATEDTIME,:REQUESTED_ENDDATE) ");
            sqlCmdBuilder.Append(" RETURNING FSCHEDULEID INTO :SCHEDULEID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddOutParameter(dbCmd, ":SCHEDULEID", DbType.Int32, sizeof(Int32));
            db.AddInParameter(dbCmd, ":NOTIFICATIONID", DbType.Int32, notificationID);
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":MAINTENANCENAME", DbType.String, maintenanceName.Trim());
            db.AddInParameter(dbCmd, ":MAINDESCRIPTION", DbType.String, maintenanceDesc.Trim());
            db.AddInParameter(dbCmd, ":SCHEDULE_TYPE", DbType.AnsiStringFixedLength, scheduleType);
            db.AddInParameter(dbCmd, ":PRIORITYTYPE", DbType.AnsiString, maintPriorityType.Trim().ToUpper());
            db.AddInParameter(dbCmd, ":LOCATIONID", DbType.Int32, fLocationID);
            db.AddInParameter(dbCmd, ":EQUIPMENTID", DbType.Int32, equipmentID);
            db.AddInParameter(dbCmd, ":NOTIFY_TYPEID", DbType.Int32, notificationTypeID);
            db.AddInParameter(dbCmd, ":SCHEDULESTATUS", DbType.AnsiString, scheduleStatus.Trim().ToUpper());
            db.AddInParameter(dbCmd, ":CREATEDBY", DbType.Int32, createdBy);
            db.AddInParameter(dbCmd, ":CREATEDON", DbType.Int32, createdOn);
            db.AddInParameter(dbCmd, ":CREATEDTIME", DbType.Int32, createdTime);
            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedOn);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);
            db.AddInParameter(dbCmd, ":REQUESTED_ENDDATE", DbType.Int32, requestedEndDate);

            db.ExecuteNonQuery(dbCmd, transaction);

            return Convert.ToInt32(db.GetParameterValue(dbCmd, ":SCHEDULEID").ToString());
        }

        //update status on work order create, inprogress, complete and delete 
        public static bool UpdateNotificationStatus(Database db, DbTransaction transaction, int siteID, int notificationID, string workOrderID, String status, int updatedBy, int updatedOn, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_SCHEDULE SET FSCHEDULESTATUS=:SCHEDULESTATUS,FUPDATEDBY=:UPDATEDBY,FUPDATEDON=:UPDATEDON,FUPDATEDTIME=:UPDATEDTIME ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID ");

            if (notificationID > 0)
                sqlCmdBuilder.Append(" AND FSCHEDULEID=:SCHEDULEID ");
            else
                sqlCmdBuilder.Append(" AND FNOTIFY_WORK_ORDERID=:NOTIFY_WORK_ORDERID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            if (notificationID > 0)
                db.AddInParameter(dbCmd, ":SCHEDULEID", DbType.Int32, notificationID);
            else
                db.AddInParameter(dbCmd, ":NOTIFY_WORK_ORDERID", DbType.AnsiString, workOrderID.Trim().PadLeft(12, '0'));

            db.AddInParameter(dbCmd, ":SCHEDULESTATUS", DbType.AnsiString, status.Trim().ToUpper());

            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedOn);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);

            if (transaction != null)
                db.ExecuteNonQuery(dbCmd, transaction);
            else
                db.ExecuteNonQuery(dbCmd);

            return true;
        }

        //update notify_workorder_ID on work order create and delete
        public static bool UpdateNotificationWorkOrder(Database db, DbTransaction transaction, int siteID, int notificationID, string workOrderID, int updatedBy, int updatedOn, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" UPDATE LDB1_MAINT_SCHEDULE SET  ");

            if (notificationID > 0)
                sqlCmdBuilder.Append(" FNOTIFY_WORK_ORDERID=:NOTIFY_WORK_ORDERID, ");
            else
                sqlCmdBuilder.Append(" FNOTIFY_WORK_ORDERID=0, ");


            sqlCmdBuilder.Append(" FUPDATEDBY=:UPDATEDBY,FUPDATEDON=:UPDATEDON,FUPDATEDTIME=:UPDATEDTIME WHERE FSITEID=:SITEID ");

            if (notificationID > 0)
                sqlCmdBuilder.Append(" AND FSCHEDULEID=:SCHEDULEID ");
            else
                sqlCmdBuilder.Append(" AND FNOTIFY_WORK_ORDERID=:NOTIFY_WORK_ORDERID ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            if (notificationID > 0)
                db.AddInParameter(dbCmd, ":SCHEDULEID", DbType.Int32, notificationID);

            db.AddInParameter(dbCmd, ":NOTIFY_WORK_ORDERID", DbType.AnsiString, workOrderID.Trim().PadLeft(12, '0'));

            db.AddInParameter(dbCmd, ":UPDATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":UPDATEDON", DbType.Int32, updatedOn);
            db.AddInParameter(dbCmd, ":UPDATEDTIME", DbType.Int32, updatedTime);

            if (transaction != null)
                db.ExecuteNonQuery(dbCmd, transaction);
            else
                db.ExecuteNonQuery(dbCmd);

            return true;
        }

        public static int GetAttachedWorkOrderScheduleID(Database db, DbTransaction transaction, int siteID, string workOrderNumber)
        {
            int scheduleDBID = 0;

            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FREF_SCHEDULEID FROM LDB1_MAINT_WORKORDER ");
            sqlCmdBuilder.Append(" WHERE FWORK_ORDERID=:WORKORDERNUMBER AND FSITEID=:SITEID ");


            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":WORKORDERNUMBER", DbType.AnsiString, workOrderNumber.Trim().PadLeft(12, '0'));
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);


            DataTable schdelueInfoDt;
            if (transaction != null)
                schdelueInfoDt = db.ExecuteDataSet(dbCmd, transaction).Tables[0];
            else
                schdelueInfoDt = db.ExecuteDataSet(dbCmd).Tables[0];

            if (schdelueInfoDt.Rows.Count > 0)
            {
                int.TryParse(schdelueInfoDt.Rows[0]["FREF_SCHEDULEID"].ToString(), out scheduleDBID);
            }
            return scheduleDBID;
        }

        public static IDataReader GetAttachmentDetailsForNotification(Database db, int siteID, int notificationID)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT FDOCUMENTID,FDOCUMENTNAME,FDOCUMENTTYPE FROM LDB1_MAINT_DOCUMENTS ");
            sqlCmdBuilder.Append(" WHERE FSITEID=:SITEID AND FREFERENCEID=:REFERENCEID AND FREF_TYPE='NOTIFICATION' AND FSTATUS='A' ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":REFERENCEID", DbType.Int32, notificationID);

            return db.ExecuteReader(dbCmd);
        }

        public static int GetNextNotificationID(Database db)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" SELECT SEQUENCE_MAINT_SCHEDULE_ID.NEXTVAL AS FNOTIFICATIONID FROM DUAL");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            return Convert.ToInt32(Convert.ToString(db.ExecuteScalar(dbCmd)));
        }

        public static bool InsertWorkOrderForNotificationClose(Database db, DbTransaction transaction, int siteID, string workOrderID, int schedule_dtl_id, int notificationID, int startDate, int startTime, int endDate, int endTime
            , double timeTaken, char timeTakenUnit, string remark, string workOrderStatus, char isnotificationOrder, int updatedBy, int updatedDate, int updatedTime)
        {
            StringBuilder sqlCmdBuilder = new StringBuilder();
            sqlCmdBuilder.Append(" INSERT INTO LDB1_MAINT_WORKORDER (FWORK_ORDERID,FSITEID,FREF_SCHEDULE_DTL_ID,FWORK_STARTDATE,FWORK_STARTTIME,FWORK_ENDDATE,FWORK_ENDTIME,FREF_SCHEDULEID,FISNOTIFICATIONORDER ");
            sqlCmdBuilder.Append(" ,FCREATEDBY,FCREATEDON,FCREATEDTIME,FUPDATEDBY,FUPDATEDON,FUPDATEDTIME,FWORKORDERSTATUS,FTIMECONFIRMEDBY,FTIMETAKEN,FTIMETAKENUNIT,FREMARKS) ");

            sqlCmdBuilder.Append(" VALUES(:WORK_ORDERID,:SITEID,:REF_SCHEDULE_DTL_ID,:WORK_STARTDATE,:WORK_STARTTIME,:WORK_ENDDATE,:WORK_ENDTIME,:REF_SCHEDULEID,:ISNOTIFICATIONORDER ");
            sqlCmdBuilder.Append(" ,:CREATEDBY,:CREATEDON,:CREATEDTIME,:CREATEDBY,:CREATEDON,:CREATEDTIME,:WORKORDERSTATUS,:CREATEDBY,:TIMETAKEN,:TIMETAKENUNIT,:REMARKS) ");

            DbCommand dbCmd = db.GetSqlStringCommand(sqlCmdBuilder.ToString());
            dbCmd.CommandType = CommandType.Text;

            db.AddInParameter(dbCmd, ":WORK_ORDERID", DbType.AnsiString, workOrderID.Trim().PadLeft(12, '0'));
            db.AddInParameter(dbCmd, ":SITEID", DbType.Int32, siteID);
            db.AddInParameter(dbCmd, ":REF_SCHEDULE_DTL_ID", DbType.Int32, schedule_dtl_id);
            db.AddInParameter(dbCmd, ":WORK_STARTDATE", DbType.Int32, startDate);
            db.AddInParameter(dbCmd, ":WORK_STARTTIME", DbType.Int32, startTime);
            db.AddInParameter(dbCmd, ":WORK_ENDDATE", DbType.Int32, endDate);
            db.AddInParameter(dbCmd, ":WORK_ENDTIME", DbType.Int32, endTime);
            db.AddInParameter(dbCmd, ":REF_SCHEDULEID", DbType.Int32, notificationID);
            db.AddInParameter(dbCmd, ":ISNOTIFICATIONORDER", DbType.AnsiStringFixedLength, isnotificationOrder);
            db.AddInParameter(dbCmd, ":WORKORDERSTATUS", DbType.AnsiString, workOrderStatus.Trim().ToUpper());
            db.AddInParameter(dbCmd, ":TIMETAKEN", DbType.Int64, timeTaken);
            db.AddInParameter(dbCmd, ":TIMETAKENUNIT", DbType.AnsiStringFixedLength, timeTakenUnit);
            db.AddInParameter(dbCmd, ":REMARKS", DbType.String, remark.Trim());

            db.AddInParameter(dbCmd, ":CREATEDBY", DbType.Int32, updatedBy);
            db.AddInParameter(dbCmd, ":CREATEDON", DbType.Int32, updatedDate);
            db.AddInParameter(dbCmd, ":CREATEDTIME", DbType.Int32, updatedTime);

            db.ExecuteNonQuery(dbCmd, transaction);
            return true;
        }
      
        #endregion
    }
}
