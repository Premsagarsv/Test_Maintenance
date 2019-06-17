using Microsoft.Practices.EnterpriseLibrary.Data;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using Vegam_MaintenanceService_DAL;
using Newtonsoft.Json;
using System.Data.Common;
using System.Web.Script.Serialization;

namespace Vegam_MaintenanceService
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "MaintenanceMobileAPIService" in code, svc and config file together.
    // NOTE: In order to launch WCF Test Client for testing this service, please select MaintenanceMobileAPIService.svc or MaintenanceMobileAPIService.svc.cs at the Solution Explorer and start debugging.
    [ServiceBehavior(InstanceContextMode = InstanceContextMode.PerCall, ConcurrencyMode = ConcurrencyMode.Multiple)]
    public class MaintenanceMobileAPIService : IMaintenanceMobileAPIService
    {
        #region Maintenance-Mobile

        #region Sync Master Table Data Info
        public TableDetailInfo SyncMaintenanceTableData(TableDetailsFilterInfo tableFilterInfo)
        {
            try
            {
                Database db = DatabaseFactory.CreateDatabase("ApplicationConnection");
                BasicParam basicParam = new BasicParam();
                basicParam.SiteID = tableFilterInfo.SiteID;
                basicParam.UserID = tableFilterInfo.UserID;

                TableDetailInfo tableDetailsInfo = new TableDetailInfo();
                int totalRowCount = 0;

                switch (tableFilterInfo.TableName.ToUpper())
                {
                    case "LDB1_USERINFO":
                        tableDetailsInfo.TableDetails = GetUserInfoTable(db, basicParam, tableFilterInfo.StartRowIndex, tableFilterInfo.RowCount, tableFilterInfo.UtcDateTime, ref totalRowCount);
                        break;
                    case "LDB1_USERROLE":
                        tableDetailsInfo.TableDetails = GetUserRoleTable(db, basicParam, tableFilterInfo.StartRowIndex, tableFilterInfo.RowCount, ref totalRowCount);
                        break;
                    case "LDB1_MAINT_LOCATIONS":
                        tableDetailsInfo.TableDetails = GetMaint_LocationsTable(db, basicParam, tableFilterInfo.StartRowIndex, tableFilterInfo.RowCount, tableFilterInfo.UtcDateTime, ref totalRowCount);
                        break;
                    case "LDB1_MAINT_EQUIPMENT":
                        tableDetailsInfo.TableDetails = GetMaint_EquipmentTable(db, basicParam, tableFilterInfo.StartRowIndex, tableFilterInfo.RowCount, tableFilterInfo.UtcDateTime, ref totalRowCount);
                        break;
                    case "LDB1_MAINT_MEASURINGPOINT":
                        tableDetailsInfo.TableDetails = GetMaint_MeasuringPointTable(db, basicParam, tableFilterInfo.StartRowIndex, tableFilterInfo.RowCount, tableFilterInfo.UtcDateTime, ref totalRowCount);
                        break;
                    case "LDB1_MAINT_DOCUMENTS":
                        tableDetailsInfo.TableDetails = GetMaint_DocumentsTable(db, basicParam, tableFilterInfo.StartRowIndex, tableFilterInfo.RowCount, tableFilterInfo.UtcDateTime, ref totalRowCount);
                        break;
                    case "LDB1_MAINT_MASTER":
                        tableDetailsInfo.TableDetails = GetMaint_MasterTable(db, basicParam, tableFilterInfo.StartRowIndex, tableFilterInfo.RowCount, tableFilterInfo.UtcDateTime, ref totalRowCount);
                        break;
                    case "LDB1_MAINT_MEAS_DOCS":
                        tableDetailsInfo.TableDetails = GetMaint_Meas_DocsTable(db, basicParam, tableFilterInfo.StartRowIndex, tableFilterInfo.RowCount, tableFilterInfo.UtcDateTime, ref totalRowCount);
                        break;
                    case "LDB1_MAINT_SUPPORT":
                        tableDetailsInfo.TableDetails = GetMaint_SupportTable(db, basicParam, tableFilterInfo.StartRowIndex, tableFilterInfo.RowCount, tableFilterInfo.UtcDateTime, ref totalRowCount);
                        break;
                    case "LDB1_MAINT_SCHEDULE":
                        tableDetailsInfo.TableDetails = GetMaint_ScheduleTable(db, basicParam, tableFilterInfo.StartRowIndex, tableFilterInfo.RowCount, tableFilterInfo.UtcDateTime, ref totalRowCount);
                        break;
                    case "LDB1_MAINT_SCHEDULE_DTL":
                        tableDetailsInfo.TableDetails = GetMaint_ScheduleDtlTable(db, basicParam, tableFilterInfo.StartRowIndex, tableFilterInfo.RowCount, tableFilterInfo.UtcDateTime, ref totalRowCount);
                        break;
                    case "LDB1_MAINT_SELGRP_CODE":
                        tableDetailsInfo.TableDetails = GetMaint_SelGrpCodeTable(db, basicParam, tableFilterInfo.StartRowIndex, tableFilterInfo.RowCount, tableFilterInfo.UtcDateTime, ref totalRowCount);
                        break;
                    case "LDB1_MAINT_TASKGROUP":
                        tableDetailsInfo.TableDetails = GetMaint_TaskGroupTable(db, basicParam, tableFilterInfo.StartRowIndex, tableFilterInfo.RowCount, tableFilterInfo.UtcDateTime, ref totalRowCount);
                        break;
                    case "LDB1_MAINT_TASKS":
                        tableDetailsInfo.TableDetails = GetMaint_TasksTable(db, basicParam, tableFilterInfo.StartRowIndex, tableFilterInfo.RowCount, tableFilterInfo.UtcDateTime, ref totalRowCount);
                        break;
                    case "LDB1_MAINT_TASKSPARAM":
                        tableDetailsInfo.TableDetails = GetMaint_TasksParamTable(db, basicParam, tableFilterInfo.StartRowIndex, tableFilterInfo.RowCount, tableFilterInfo.UtcDateTime, ref totalRowCount);
                        break;
                    case "LDB1_MAINT_TASKSPPE":
                        tableDetailsInfo.TableDetails = GetMaint_TasksPPETable(db, basicParam, tableFilterInfo.StartRowIndex, tableFilterInfo.RowCount, tableFilterInfo.UtcDateTime, ref totalRowCount);
                        break;
                    case "LDB1_MAINT_TASKSTOOLS":
                        tableDetailsInfo.TableDetails = GetMaint_TasksToolsTable(db, basicParam, tableFilterInfo.StartRowIndex, tableFilterInfo.RowCount, tableFilterInfo.UtcDateTime, ref totalRowCount);
                        break;
                    case "LDB1_MAINT_TOOLS":
                        tableDetailsInfo.TableDetails = GetMaint_ToolsTable(db, basicParam, tableFilterInfo.StartRowIndex, tableFilterInfo.RowCount, tableFilterInfo.UtcDateTime, ref totalRowCount);
                        break;
                    case "LDB1_MAINT_WORKGROUPUSER":
                        tableDetailsInfo.TableDetails = GetMaint_WorkGroupUserTable(db, basicParam, tableFilterInfo.StartRowIndex, tableFilterInfo.RowCount, tableFilterInfo.UtcDateTime, ref totalRowCount);
                        break;
                    case "LDB1_MAINT_WORKORDER":
                        tableDetailsInfo.TableDetails = GetMaint_WorkOrderTable(db, basicParam, tableFilterInfo.StartRowIndex, tableFilterInfo.RowCount, tableFilterInfo.UtcDateTime, ref totalRowCount);
                        break;
                    case "LDB1_MAINT_WORKORDER_TASK":
                        tableDetailsInfo.TableDetails = GetMaint_WorkOrderTaskTable(db, basicParam, tableFilterInfo.StartRowIndex, tableFilterInfo.RowCount, tableFilterInfo.UtcDateTime, ref totalRowCount);
                        break;
                    case "LDB1_MAINT_WORKORDER_TASKIMG":
                        tableDetailsInfo.TableDetails = GetMaint_WorkOrderTaskImgTable(db, basicParam, tableFilterInfo.StartRowIndex, tableFilterInfo.RowCount, tableFilterInfo.UtcDateTime, ref totalRowCount);
                        break;
                    case "LDB1_MAINT_WORKORDER_TASKPARAM":
                        tableDetailsInfo.TableDetails = GetMaint_WorkOrderTaskParamTable(db, basicParam, tableFilterInfo.StartRowIndex, tableFilterInfo.RowCount, tableFilterInfo.UtcDateTime, ref totalRowCount);
                        break;
                    case "LDB1_PRODUCTIONLINERESOURCE":
                        tableDetailsInfo.TableDetails = GetProductionlineresourceTable(db, basicParam, tableFilterInfo.StartRowIndex, tableFilterInfo.RowCount, tableFilterInfo.UtcDateTime, ref totalRowCount);
                        break;
                    case "LDB1_PLANTPPE":
                        tableDetailsInfo.TableDetails = GetPlantppeTable(db, basicParam, tableFilterInfo.StartRowIndex, tableFilterInfo.RowCount, tableFilterInfo.UtcDateTime, ref totalRowCount);
                        break;
                    case "LDB1_ENUMTYPE":
                        tableDetailsInfo.TableDetails = GetEnumTypeTable(db, basicParam, tableFilterInfo.StartRowIndex, tableFilterInfo.RowCount, ref totalRowCount, tableFilterInfo.FilterType);
                        break;
                    case "LDB1_MAINT_AUTH_GROUP":
                        tableDetailsInfo.TableDetails = GetAuthGroup(db, basicParam, tableFilterInfo.StartRowIndex, tableFilterInfo.RowCount, tableFilterInfo.UtcDateTime, ref totalRowCount);
                        break;
					case "LDB1_SENSORTYPE_UOM":
						tableDetailsInfo.TableDetails = GetSensorType_UOMTable(db, basicParam, tableFilterInfo.StartRowIndex, tableFilterInfo.RowCount, tableFilterInfo.UtcDateTime, ref totalRowCount);
						break;
					case "LDB1_SENSOR_TYPE":
						tableDetailsInfo.TableDetails = GetSensor_TypeTable(db, basicParam, tableFilterInfo.StartRowIndex, tableFilterInfo.RowCount, tableFilterInfo.UtcDateTime, ref totalRowCount);
						break;
					case "LDB1_MAINT_SCHEDULE_SPAREPARTS":
						tableDetailsInfo.TableDetails = GetMaint_Schedule_SparepartsTable(db, basicParam, tableFilterInfo.StartRowIndex, tableFilterInfo.RowCount, tableFilterInfo.UtcDateTime, ref totalRowCount);
						break;
					case "LDB1_MAINT_WORKORDER_SPAREPART":
						tableDetailsInfo.TableDetails = GetMaint_WorkOrder_SparepartTable(db, basicParam, tableFilterInfo.StartRowIndex, tableFilterInfo.RowCount, tableFilterInfo.UtcDateTime, ref totalRowCount);
						break;
					case "LDB1_PLANTMATERIAL":
						tableDetailsInfo.TableDetails = GetPlantMaterialTable(db, basicParam, tableFilterInfo.StartRowIndex, tableFilterInfo.RowCount, tableFilterInfo.UtcDateTime, ref totalRowCount);
						break;
                    case "LDB1_MAINT_READING_RESULT":
                        tableDetailsInfo.TableDetails = GetMaint_ReadingResultTable(db, basicParam, tableFilterInfo.StartRowIndex, tableFilterInfo.RowCount, tableFilterInfo.UtcDateTime, ref totalRowCount);
                        break;
                    default:
                        tableDetailsInfo.TableDetails = null;
                        break;
                }

                if (tableDetailsInfo.TableDetails != null)
                {
                    tableDetailsInfo.TableDetails = tableDetailsInfo.TableDetails = JsonConvert.SerializeObject(tableDetailsInfo.TableDetails);
                    tableDetailsInfo.TotalCount = totalRowCount;
                }

                return tableDetailsInfo;
            }
            catch (Exception ex)
            {
                string exceptionErrorMessage = Common.GetErrorMessage(ex.Message);
                Common.LogException(ex, "VegamMaintenanceAPIService", "Error while getting table data information", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "SiteID : " + tableFilterInfo.SiteID + " ,UserID : " + tableFilterInfo.UserID);
                throw new FaultException(exceptionErrorMessage);
            }

        }
        #endregion

        #region Company Info

        public TableDetailInfo SyncCompanySitesDateTimeData(int companyID,int siteID)
        {
            try
            {
                Database db = DatabaseFactory.CreateDatabase("ApplicationConnection");

                TableDetailInfo tableDetailsInfo = new TableDetailInfo();
                
                tableDetailsInfo.TableDetails = GetCompanySitesDateTimeData(db, companyID, siteID);

                if (tableDetailsInfo.TableDetails != null)
                {
                    int totalRowCount = tableDetailsInfo.TableDetails.Count;
                    tableDetailsInfo.TableDetails = tableDetailsInfo.TableDetails = JsonConvert.SerializeObject(tableDetailsInfo.TableDetails);
                    tableDetailsInfo.TotalCount = totalRowCount;
                }

                return tableDetailsInfo;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        private List<SiteDateTimeInfo> GetCompanySitesDateTimeData(Database db, int companyID,int siteID)
        {
            IDataReader dataReaderSiteInfo = null;
            try
            {
                List<SiteDateTimeInfo> siteInfoList = new List<SiteDateTimeInfo>();
                SiteDateTimeInfo siteInfo = null;
                string filterSiteDateTime = string.Empty;

                dataReaderSiteInfo = MaintenanceMobileAPIDAL.GetCompanySitesDateTimeInfo(db, companyID, siteID);
                if (dataReaderSiteInfo.Read())
                {
                    siteInfo = new SiteDateTimeInfo();
                    siteInfo.FCOMPANYID = Common.GetSafeInt32(dataReaderSiteInfo, "FCOMPANYID");
                    siteInfo.FSITEID = Common.GetSafeInt32(dataReaderSiteInfo, "FSITEID");
                    siteInfo.FSITE_NAME = Common.GetSafeString(dataReaderSiteInfo, "FSITE_NAME");
                    siteInfo.FTIMEZONE = Common.GetSafeString(dataReaderSiteInfo, "FTIMEZONE");
                    siteInfo.FSITE_DATEFORMAT = Common.GetSafeString(dataReaderSiteInfo, "FSITE_DATEFORMAT");
                    siteInfo.FSITE_TIMEFORMAT = Common.GetSafeString(dataReaderSiteInfo, "FSITE_TIMEFORMAT");
                   
                    siteInfoList.Add(siteInfo);
                
                }
                dataReaderSiteInfo.Close();
                
                return siteInfoList;
            }
            catch (Exception ex)
            {
                string exceptionErrorMessage = Common.GetErrorMessage(ex.Message);
                Common.LogException(ex, "VegamMaintenanceAPIService", "Error while getting site date and time information", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, string.Empty);
                throw new FaultException(exceptionErrorMessage);
            }
            finally
            {
                if (dataReaderSiteInfo != null && !dataReaderSiteInfo.IsClosed)
                    dataReaderSiteInfo.Close();
            }
        }
        
        #endregion

        #region Maintenance Table Data
        private List<UserInfo> GetUserInfoTable(Database db, BasicParam basicParam, int startRowIndex, int rowCount, string utcDateTime, ref int totalRowCount)
        {
            IDataReader dataReaderUserInfo = null;
            try
            {
                List<UserInfo> userInfoList = new List<UserInfo>();
                UserInfo userInfo = null;
                int startDate = 0;
                int startTime = 0;
                int timeZoneOffset = 0;
                //string filterSiteDateTime = string.Empty;

                if (!string.IsNullOrEmpty(utcDateTime))
                {
                    //Convert UTC Date Time to site Date Time
                    Common.GetSiteDateTimeFromUtc(db, basicParam.SiteID, Convert.ToInt64(utcDateTime), ref startDate, ref startTime, ref timeZoneOffset);
                    //filterSiteDateTime = startDate.ToString() + startTime.ToString().PadLeft(6,'0'); //YYYYMMDDHH24MMSS Format string
                }

                dataReaderUserInfo = MaintenanceMobileAPIDAL.GetUserInfoTable(db, basicParam.SiteID, startRowIndex, rowCount, startDate);
                while (dataReaderUserInfo.Read())
                {
                    userInfo = new UserInfo();
                    userInfo.FUSERID = Common.GetSafeInt32(dataReaderUserInfo, "FUSERID");
                    userInfo.FUSERNAME = Common.GetSafeString(dataReaderUserInfo, "FUSERNAME");
                    userInfo.FPASSWORD = Common.GetSafeString(dataReaderUserInfo, "FPASSWORD");
                    userInfo.FFIRSTNAME = Common.GetSafeString(dataReaderUserInfo, "FFIRSTNAME");
                    userInfo.FLASTNAME = Common.GetSafeString(dataReaderUserInfo, "FLASTNAME");
                    userInfo.FACCESSLEVELID = Common.GetSafeInt32(dataReaderUserInfo, "FACCESSLEVELID");
                    userInfo.FLANGUAGEID = Common.GetSafeInt32(dataReaderUserInfo, "FLANGUAGEID");
                    userInfo.FSALTKEYVALUE = Common.GetSafeString(dataReaderUserInfo, "FSALTKEYVALUE");
                    userInfo.FUPDATEDATE = Common.GetSafeInt32(dataReaderUserInfo, "FUPDATEDATE");
                    userInfo.FSTATUS = Convert.ToChar(Common.GetSafeChar(dataReaderUserInfo, "FSTATUS"));
                    userInfo.FSITEID = Common.GetSafeInt32(dataReaderUserInfo, "FSITEID");

                    if (totalRowCount == 0)
                        totalRowCount = Common.GetSafeInt32(dataReaderUserInfo, "FCOUNT");

                    userInfoList.Add(userInfo);
                }
                dataReaderUserInfo.Close();

                return userInfoList;
            }
            catch (Exception ex)
            {
                string exceptionErrorMessage = Common.GetErrorMessage(ex.Message);
                Common.LogException(ex, "VegamMaintenanceAPIService", "Error while getting UserInfo table information", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "SiteID : " + basicParam.SiteID + " ;UserID : " + basicParam.UserID);
                throw new FaultException(exceptionErrorMessage);
            }
            finally
            {
                if (dataReaderUserInfo != null && !dataReaderUserInfo.IsClosed)
                    dataReaderUserInfo.Close();
            }
        }

        private List<UserRole> GetUserRoleTable(Database db, BasicParam basicParam, int startRowIndex, int rowCount, ref int totalRowCount)
        {
            IDataReader dataReaderUserRoleInfo = null;
            try
            {
                List<UserRole> userRoleInfoList = new List<UserRole>();
                UserRole userRoleInfo = null;

                dataReaderUserRoleInfo = MaintenanceMobileAPIDAL.GetUserRoleTable(db, basicParam.SiteID, startRowIndex, rowCount);
                while (dataReaderUserRoleInfo.Read())
                {
                    userRoleInfo = new UserRole();
                    userRoleInfo.FROLEID = Common.GetSafeInt32(dataReaderUserRoleInfo, "FROLEID");
                    userRoleInfo.FUSERID = Common.GetSafeInt32(dataReaderUserRoleInfo, "FUSERID");
                    userRoleInfo.FSITEID = Common.GetSafeInt32(dataReaderUserRoleInfo, "FSITEID");

                    if (totalRowCount == 0)
                        totalRowCount = Common.GetSafeInt32(dataReaderUserRoleInfo, "FCOUNT");

                    userRoleInfoList.Add(userRoleInfo);
                }
                dataReaderUserRoleInfo.Close();

                return userRoleInfoList;
            }
            catch (Exception ex)
            {
                string exceptionErrorMessage = Common.GetErrorMessage(ex.Message);
                Common.LogException(ex, "VegamMaintenanceAPIService", "Error while getting UserRole table information", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "SiteID : " + basicParam.SiteID + " ;UserID : " + basicParam.UserID);
                throw new FaultException(exceptionErrorMessage);
            }
            finally
            {
                if (dataReaderUserRoleInfo != null && !dataReaderUserRoleInfo.IsClosed)
                    dataReaderUserRoleInfo.Close();
            }
        }

        private List<Maint_Locations> GetMaint_LocationsTable(Database db, BasicParam basicParam, int startRowIndex, int rowCount, string utcDateTime, ref int totalRowCount)
        {
            IDataReader dataReaderFLocationInfo = null;
            try
            {
                long utcTimestamp = 0;

                List<Maint_Locations> functionalLocationList = new List<Maint_Locations>();
                Maint_Locations functionalLocationInfo = null;

                if (!string.IsNullOrEmpty(utcDateTime))
                {
                    //Convert UtcDateTime to TimeStamp(YYYYMMDDHHmmss)
                    utcTimestamp=  Common.GetDateTimeFromUtc(utcDateTime);
                }

                dataReaderFLocationInfo = MaintenanceMobileAPIDAL.GetMaint_LocationsTable(db, basicParam.SiteID, utcTimestamp, startRowIndex, rowCount);
                while (dataReaderFLocationInfo.Read())
                {
                    functionalLocationInfo = new Maint_Locations();
                    functionalLocationInfo.FLOCATIONID = Common.GetSafeInt64(dataReaderFLocationInfo, "FLOCATIONID");
                    functionalLocationInfo.FSITEID = Common.GetSafeInt32(dataReaderFLocationInfo, "FSITEID");
                    functionalLocationInfo.FLOCATIONNAME = Common.GetSafeString(dataReaderFLocationInfo, "FLOCATIONNAME");
                    functionalLocationInfo.FLOCATIONDESC = Common.GetSafeString(dataReaderFLocationInfo, "FLOCATIONDESC");
                    functionalLocationInfo.FPARENTLOCATIONID = Common.GetSafeInt32(dataReaderFLocationInfo, "FPARENTLOCATIONID");
                    functionalLocationInfo.FIMAGENAME = Common.GetSafeString(dataReaderFLocationInfo, "FIMAGENAME");
                    functionalLocationInfo.FUPDATEDON = Common.GetSafeInt32(dataReaderFLocationInfo, "FUPDATEDON");
                    functionalLocationInfo.FUPDATEDTIME = Common.GetSafeInt32(dataReaderFLocationInfo, "FUPDATEDTIME");
                    functionalLocationInfo.FSTATUS = Convert.ToChar(Common.GetSafeChar(dataReaderFLocationInfo, "FSTATUS"));
                    functionalLocationInfo.FLOCATIONCODE = Common.GetSafeString(dataReaderFLocationInfo, "FLOCATIONCODE");

                    if (totalRowCount == 0)
                        totalRowCount = Common.GetSafeInt32(dataReaderFLocationInfo, "FCOUNT");

                    functionalLocationList.Add(functionalLocationInfo);
                }
                dataReaderFLocationInfo.Close();

                return functionalLocationList;
            }
            catch (Exception ex)
            {
                string exceptionErrorMessage = Common.GetErrorMessage(ex.Message);
                Common.LogException(ex, "VegamMaintenanceAPIService", "Error while getting MAINT_LOCATIONS table information", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "SiteID : " + basicParam.SiteID + " ;UserID : " + basicParam.UserID);
                throw new FaultException(exceptionErrorMessage);
            }
            finally
            {
                if (dataReaderFLocationInfo != null && !dataReaderFLocationInfo.IsClosed)
                    dataReaderFLocationInfo.Close();
            }
        }

        private List<Maint_Equipment> GetMaint_EquipmentTable(Database db, BasicParam basicParam, int startRowIndex, int rowCount, string utcDateTime, ref int totalRowCount)
        {
            IDataReader dataReaderEquipmentInfo = null;
            try
            {
              long  utcTimestamp = 0;

                List<Maint_Equipment> equipmentInfoList = new List<Maint_Equipment>();
                Maint_Equipment equipmentInfo = null;

                if (!string.IsNullOrEmpty(utcDateTime))
                {
                    //Convert UtcDateTime to TimeStamp(YYYYMMDDHHmmss)
                    utcTimestamp = Common.GetDateTimeFromUtc(utcDateTime);
                }

                dataReaderEquipmentInfo = MaintenanceMobileAPIDAL.GetMaint_EquipmentTable(db, basicParam.SiteID, utcTimestamp, startRowIndex, rowCount);
                while (dataReaderEquipmentInfo.Read())
                {
                    equipmentInfo = new Maint_Equipment();
                    equipmentInfo.FEQUIPMENTID = Common.GetSafeInt64(dataReaderEquipmentInfo, "FEQUIPMENTID");
                    equipmentInfo.FSITEID = Common.GetSafeInt32(dataReaderEquipmentInfo, "FSITEID");
                    equipmentInfo.FEQUIPMENTCODE = Common.GetSafeString(dataReaderEquipmentInfo, "FEQUIPMENTCODE");
                    equipmentInfo.FEQUIPMENTNAME = Common.GetSafeString(dataReaderEquipmentInfo, "FEQUIPMENTNAME");
                    equipmentInfo.FDESCRIPTION = Common.GetSafeString(dataReaderEquipmentInfo, "FDESCRIPTION");
                    equipmentInfo.FMANUFID = Common.GetSafeInt64(dataReaderEquipmentInfo, "FMANUFID");
                    equipmentInfo.FCATEGORYID = Common.GetSafeInt32(dataReaderEquipmentInfo, "FCATEGORYID");
                    equipmentInfo.FCLASSID = Common.GetSafeInt32(dataReaderEquipmentInfo, "FCLASSID");
                    equipmentInfo.FIMAGENAME = Common.GetSafeString(dataReaderEquipmentInfo, "FIMAGENAME");
                    equipmentInfo.FINFOTYPE = Convert.ToChar(Common.GetSafeString(dataReaderEquipmentInfo, "FINFOTYPE"));
                    equipmentInfo.FLOCATIONID = Common.GetSafeInt64(dataReaderEquipmentInfo, "FLOCATIONID");
                    equipmentInfo.FRESOURCEID = Common.GetSafeInt64(dataReaderEquipmentInfo, "FRESOURCEID");
                    equipmentInfo.FMODELREFERENCEID = Common.GetSafeInt64(dataReaderEquipmentInfo, "FMODELREFERENCEID");
                    equipmentInfo.FMODELNUMBER = Common.GetSafeString(dataReaderEquipmentInfo, "FMODELNUMBER");
                    equipmentInfo.FSERIALNUMBER = Common.GetSafeString(dataReaderEquipmentInfo, "FSERIALNUMBER");
                    equipmentInfo.FWARRANTYNUMBER = Common.GetSafeString(dataReaderEquipmentInfo, "FWARRANTYNUMBER");
                    equipmentInfo.FWARRANTYSTARTDATE = Common.GetSafeInt32(dataReaderEquipmentInfo, "FWARRANTYSTARTDATE");
                    equipmentInfo.FWARRANTYEXPIREDDATE = Common.GetSafeInt32(dataReaderEquipmentInfo, "FWARRANTYEXPIREDDATE");
                    equipmentInfo.FPURCHASEDATE = Common.GetSafeInt32(dataReaderEquipmentInfo, "FPURCHASEDATE");
                    equipmentInfo.FINSTALLDATE = Common.GetSafeInt32(dataReaderEquipmentInfo, "FINSTALLDATE");
                    equipmentInfo.FUPDATEDON = Common.GetSafeInt32(dataReaderEquipmentInfo, "FUPDATEDON");
                    equipmentInfo.FUPDATEDTIME = Common.GetSafeInt32(dataReaderEquipmentInfo, "FUPDATEDTIME");
                    equipmentInfo.FPARENTEQUIPMENTID = Common.GetSafeInt64(dataReaderEquipmentInfo, "FPARENTEQUIPMENTID");
                    equipmentInfo.FSTATUS = Convert.ToChar(Common.GetSafeChar(dataReaderEquipmentInfo, "FSTATUS"));

                    if (totalRowCount == 0)
                        totalRowCount = Common.GetSafeInt32(dataReaderEquipmentInfo, "FCOUNT");

                    equipmentInfoList.Add(equipmentInfo);
                }
                dataReaderEquipmentInfo.Close();

                return equipmentInfoList;
            }
            catch (Exception ex)
            {
                string exceptionErrorMessage = Common.GetErrorMessage(ex.Message);
                Common.LogException(ex, "VegamMaintenanceAPIService", "Error while getting MAINT_EQUIPMENT table information", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "SiteID : " + basicParam.SiteID + " ;UserID : " + basicParam.UserID);
                throw new FaultException(exceptionErrorMessage);
            }
            finally
            {
                if (dataReaderEquipmentInfo != null && !dataReaderEquipmentInfo.IsClosed)
                    dataReaderEquipmentInfo.Close();
            }
        }

        private List<Maint_MeasuringPoint> GetMaint_MeasuringPointTable(Database db, BasicParam basicParam, int startRowIndex, int rowCount, string utcDateTime, ref int totalRowCount)
        {
            IDataReader dataReaderMeasuringPointInfo = null;
            try
            {
                long utcTimestamp = 0;

                List<Maint_MeasuringPoint> measuringPointInfoList = new List<Maint_MeasuringPoint>();
                Maint_MeasuringPoint measuringPointInfo = null;

                if (!string.IsNullOrEmpty(utcDateTime))
                {
                    //Convert UtcDateTime to TimeStamp(YYYYMMDDHHmmss)
                    utcTimestamp = Common.GetDateTimeFromUtc(utcDateTime);
                }

                dataReaderMeasuringPointInfo = MaintenanceMobileAPIDAL.GetMaint_MeasuringPointTable(db, basicParam.SiteID, utcTimestamp, startRowIndex, rowCount);
                while (dataReaderMeasuringPointInfo.Read())
                {
                    measuringPointInfo = new Maint_MeasuringPoint();
                    measuringPointInfo.FMEASURINGPOINTID = Common.GetSafeInt64(dataReaderMeasuringPointInfo, "FMEASURINGPOINTID");
                    measuringPointInfo.FSITEID = Common.GetSafeInt32(dataReaderMeasuringPointInfo, "FSITEID");
                    measuringPointInfo.FMEASURINGPOINTCODE = Common.GetSafeString(dataReaderMeasuringPointInfo, "FMEASURINGPOINTCODE");
                    measuringPointInfo.FMEASURINGPOINTNAME = Common.GetSafeString(dataReaderMeasuringPointInfo, "FMEASURINGPOINTNAME");
                    measuringPointInfo.FDESCRIPTION = Common.GetSafeString(dataReaderMeasuringPointInfo, "FDESCRIPTION");
                    measuringPointInfo.FPOSITION = Common.GetSafeString(dataReaderMeasuringPointInfo, "FPOSITION");
                    measuringPointInfo.FCATEGORYID = Common.GetSafeInt64(dataReaderMeasuringPointInfo, "FCATEGORYID");
                    measuringPointInfo.FIMAGENAME = Common.GetSafeString(dataReaderMeasuringPointInfo, "FIMAGENAME");
                    measuringPointInfo.FREADINGTYPE = Convert.ToChar(Common.GetSafeString(dataReaderMeasuringPointInfo, "FREADINGTYPE"));
                    measuringPointInfo.FDECIMALPLACES = Common.GetSafeInt64(dataReaderMeasuringPointInfo, "FDECIMALPLACES");
                    measuringPointInfo.FIMAGENAME = Common.GetSafeString(dataReaderMeasuringPointInfo, "FIMAGENAME");
                    measuringPointInfo.FLOWERLIMIT = Common.GetSafeDecimal(dataReaderMeasuringPointInfo, "FLOWERLIMIT");
                    measuringPointInfo.FUPPERLIMIT = Common.GetSafeDecimal(dataReaderMeasuringPointInfo, "FUPPERLIMIT");
                    measuringPointInfo.FLOWERLIMITWARNING = Common.GetSafeDecimal(dataReaderMeasuringPointInfo, "FLOWERLIMITWARNING");
                    measuringPointInfo.FUPPERLIMITWARNING = Common.GetSafeDecimal(dataReaderMeasuringPointInfo, "FUPPERLIMITWARNING");
                    measuringPointInfo.FMAXTEXTLENGTH = Common.GetSafeInt32(dataReaderMeasuringPointInfo, "FMAXTEXTLENGTH");
                    measuringPointInfo.FGROUPID = Common.GetSafeInt64(dataReaderMeasuringPointInfo, "FGROUPID");
                    measuringPointInfo.FPARENTID = Common.GetSafeInt64(dataReaderMeasuringPointInfo, "FPARENTID");
                    measuringPointInfo.FPARENTTYPE = Convert.ToChar(Common.GetSafeString(dataReaderMeasuringPointInfo, "FPARENTTYPE"));
                    measuringPointInfo.FISCOUNTER = Convert.ToChar(Common.GetSafeString(dataReaderMeasuringPointInfo, "FISCOUNTER"));
                    measuringPointInfo.FOPCTAGID = Common.GetSafeString(dataReaderMeasuringPointInfo, "FOPCTAGID");
                    measuringPointInfo.FUUID = Common.GetSafeInt32(dataReaderMeasuringPointInfo, "FUUID");
                    measuringPointInfo.FUPDATEDON = Common.GetSafeInt32(dataReaderMeasuringPointInfo, "FUPDATEDON");
                    measuringPointInfo.FUPDATEDTIME = Common.GetSafeInt32(dataReaderMeasuringPointInfo, "FUPDATEDTIME");
                    measuringPointInfo.FSTATUS = Convert.ToChar(Common.GetSafeChar(dataReaderMeasuringPointInfo, "FSTATUS"));
                    measuringPointInfo.FSENSORTYPEUOMID = Common.GetSafeInt32(dataReaderMeasuringPointInfo, "FSENSORTYPEUOMID");

                    if (totalRowCount == 0)
                        totalRowCount = Common.GetSafeInt32(dataReaderMeasuringPointInfo, "FCOUNT");

                    measuringPointInfoList.Add(measuringPointInfo);
                }
                dataReaderMeasuringPointInfo.Close();

                return measuringPointInfoList;
            }
            catch (Exception ex)
            {
                string exceptionErrorMessage = Common.GetErrorMessage(ex.Message);
                Common.LogException(ex, "VegamMaintenanceAPIService", "Error while getting MAINT_MEASURINGPOINT table information", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "SiteID : " + basicParam.SiteID + " ;UserID : " + basicParam.UserID);
                throw new FaultException(exceptionErrorMessage);
            }
            finally
            {
                if (dataReaderMeasuringPointInfo != null && !dataReaderMeasuringPointInfo.IsClosed)
                    dataReaderMeasuringPointInfo.Close();
            }
        }

        private List<Maint_Documents> GetMaint_DocumentsTable(Database db, BasicParam basicParam, int startRowIndex, int rowCount, string utcDateTime, ref int totalRowCount)
        {
            IDataReader dataReaderDocumentsInfo = null;
            try
            {
                long utcTimestamp = 0;

                List<Maint_Documents> documentsInfoList = new List<Maint_Documents>();
                Maint_Documents documentsInfo = null;

                if (!string.IsNullOrEmpty(utcDateTime))
                {
                    //Convert UtcDateTime to TimeStamp(YYYYMMDDHHmmss)
                    utcTimestamp = Common.GetDateTimeFromUtc(utcDateTime);
                }

                dataReaderDocumentsInfo = MaintenanceMobileAPIDAL.GetMaint_DocumentsTable(db, basicParam.SiteID, utcTimestamp, startRowIndex, rowCount);
                while (dataReaderDocumentsInfo.Read())
                {
                    documentsInfo = new Maint_Documents();
                    documentsInfo.FDOCUMENTID = Common.GetSafeInt64(dataReaderDocumentsInfo, "FDOCUMENTID");
                    documentsInfo.FSITEID = Common.GetSafeInt32(dataReaderDocumentsInfo, "FSITEID");
                    documentsInfo.FREFERENCEID = Common.GetSafeInt64(dataReaderDocumentsInfo, "FREFERENCEID");
                    documentsInfo.FDOCUMENTTYPE = Convert.ToChar(Common.GetSafeString(dataReaderDocumentsInfo, "FDOCUMENTTYPE"));
                    documentsInfo.FDOCUMENTNAME = Common.GetSafeString(dataReaderDocumentsInfo, "FDOCUMENTNAME");
                    documentsInfo.FREF_TYPE = Common.GetSafeString(dataReaderDocumentsInfo, "FREF_TYPE");
                    documentsInfo.FUPDATEDON = Common.GetSafeInt32(dataReaderDocumentsInfo, "FUPDATEDON");
                    documentsInfo.FUPDATEDTIME = Common.GetSafeInt32(dataReaderDocumentsInfo, "FUPDATEDTIME");
                    documentsInfo.FSTATUS = Convert.ToChar(Common.GetSafeString(dataReaderDocumentsInfo, "FSTATUS"));

                    if (totalRowCount == 0)
                        totalRowCount = Common.GetSafeInt32(dataReaderDocumentsInfo, "FCOUNT");

                    documentsInfoList.Add(documentsInfo);
                }
                dataReaderDocumentsInfo.Close();

                return documentsInfoList;
            }
            catch (Exception ex)
            {
                string exceptionErrorMessage = Common.GetErrorMessage(ex.Message);
                Common.LogException(ex, "VegamMaintenanceAPIService", "Error while getting MAINT_DOCUMENTS table information", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "SiteID : " + basicParam.SiteID + " ;UserID : " + basicParam.UserID);
                throw new FaultException(exceptionErrorMessage);
            }
            finally
            {
                if (dataReaderDocumentsInfo != null && !dataReaderDocumentsInfo.IsClosed)
                    dataReaderDocumentsInfo.Close();
            }
        }

        private List<Maint_Master> GetMaint_MasterTable(Database db, BasicParam basicParam, int startRowIndex, int rowCount, string utcDateTime, ref int totalRowCount)
        {
            IDataReader dataReaderMasterInfo = null;
            try
            {
                long utcTimestamp = 0;
                List<Maint_Master> masterInfoList = new List<Maint_Master>();
                Maint_Master masterInfo = null;

                if (!string.IsNullOrEmpty(utcDateTime))
                {
                    //Convert UtcDateTime to TimeStamp(YYYYMMDDHHmmss)
                    utcTimestamp = Common.GetDateTimeFromUtc(utcDateTime);
                }


                dataReaderMasterInfo = MaintenanceMobileAPIDAL.GetMaint_MasterTable(db, basicParam.SiteID, utcTimestamp, startRowIndex, rowCount);
                while (dataReaderMasterInfo.Read())
                {
                    masterInfo = new Maint_Master();
                    masterInfo.FMASTERID = Common.GetSafeInt64(dataReaderMasterInfo, "FMASTERID");
                    masterInfo.FSITEID = Common.GetSafeInt32(dataReaderMasterInfo, "FSITEID");
                    masterInfo.FNAME = Common.GetSafeString(dataReaderMasterInfo, "FNAME");
                    masterInfo.FDESCRIPTION = Common.GetSafeString(dataReaderMasterInfo, "FDESCRIPTION");
                    masterInfo.FTYPE = Common.GetSafeString(dataReaderMasterInfo, "FTYPE");
                    masterInfo.FUPDATEDON = Common.GetSafeInt32(dataReaderMasterInfo, "FUPDATEDON");
                    masterInfo.FUPDATEDTIME = Common.GetSafeInt32(dataReaderMasterInfo, "FUPDATEDTIME");
                    masterInfo.FSTATUS = Convert.ToChar(Common.GetSafeChar(dataReaderMasterInfo, "FSTATUS"));

                    if (totalRowCount == 0)
                        totalRowCount = Common.GetSafeInt32(dataReaderMasterInfo, "FCOUNT");

                    masterInfoList.Add(masterInfo);
                }
                dataReaderMasterInfo.Close();

                return masterInfoList;
            }
            catch (Exception ex)
            {
                string exceptionErrorMessage = Common.GetErrorMessage(ex.Message);
                Common.LogException(ex, "VegamMaintenanceAPIService", "Error while getting MAINT_MASTER table information", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "SiteID : " + basicParam.SiteID + " ;UserID : " + basicParam.UserID);
                throw new FaultException(exceptionErrorMessage);
            }
            finally
            {
                if (dataReaderMasterInfo != null && !dataReaderMasterInfo.IsClosed)
                    dataReaderMasterInfo.Close();
            }
        }

        private List<Maint_Meas_Docs> GetMaint_Meas_DocsTable(Database db, BasicParam basicParam, int startRowIndex, int rowCount, string utcDateTime, ref int totalRowCount)
        {
            IDataReader dataReaderMeasuringDocsInfo = null;
            try
            {
                long utcTimestamp = 0;
                List<Maint_Meas_Docs> measuringDocsInfoList = new List<Maint_Meas_Docs>();
                Maint_Meas_Docs measuringDocsInfo = null;

                if (!string.IsNullOrEmpty(utcDateTime))
                {
                    //Convert UtcDateTime to TimeStamp(YYYYMMDDHHmmss)
                    utcTimestamp = Common.GetDateTimeFromUtc(utcDateTime);
                }

                dataReaderMeasuringDocsInfo = MaintenanceMobileAPIDAL.GetMaint_Meas_DocsTable(db, basicParam.SiteID, utcTimestamp, startRowIndex, rowCount);
                while (dataReaderMeasuringDocsInfo.Read())
                {
                    measuringDocsInfo = new Maint_Meas_Docs();
                    measuringDocsInfo.FSCHEDULEID = Common.GetSafeInt64(dataReaderMeasuringDocsInfo, "FSCHEDULEID");
                    measuringDocsInfo.FSITEID = Common.GetSafeInt32(dataReaderMeasuringDocsInfo, "FSITEID");
                    measuringDocsInfo.FITEMID = Common.GetSafeInt64(dataReaderMeasuringDocsInfo, "FITEMID");
                    measuringDocsInfo.FMEASURINGPOINTID = Common.GetSafeInt64(dataReaderMeasuringDocsInfo, "FMEASURINGPOINTID");
                    measuringDocsInfo.FUPDATEDON = Common.GetSafeInt32(dataReaderMeasuringDocsInfo, "FUPDATEDON");
                    measuringDocsInfo.FUPDATEDTIME = Common.GetSafeInt32(dataReaderMeasuringDocsInfo, "FUPDATEDTIME");

                    if (totalRowCount == 0)
                        totalRowCount = Common.GetSafeInt32(dataReaderMeasuringDocsInfo, "FCOUNT");

                    measuringDocsInfoList.Add(measuringDocsInfo);
                }
                dataReaderMeasuringDocsInfo.Close();

                return measuringDocsInfoList;
            }
            catch (Exception ex)
            {
                string exceptionErrorMessage = Common.GetErrorMessage(ex.Message);
                Common.LogException(ex, "VegamMaintenanceAPIService", "Error while getting MAINT_MEAS_DOCS table information", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "SiteID : " + basicParam.SiteID + " ;UserID : " + basicParam.UserID);
                throw new FaultException(exceptionErrorMessage);
            }
            finally
            {
                if (dataReaderMeasuringDocsInfo != null && !dataReaderMeasuringDocsInfo.IsClosed)
                    dataReaderMeasuringDocsInfo.Close();
            }
        }

        private List<Maint_Support> GetMaint_SupportTable(Database db, BasicParam basicParam, int startRowIndex, int rowCount, string utcDateTime, ref int totalRowCount)
        {
            IDataReader dataReaderInfo = null;
            try
            {

                long utcTimestamp = 0;
                List<Maint_Support> maintSupportInfoList = new List<Maint_Support>();
                Maint_Support maintSupportInfo = null;

                if (!string.IsNullOrEmpty(utcDateTime))
                {
                    //Convert UtcDateTime to DateTime(YYYYMMDDHHmmss)
                    utcTimestamp = Common.GetDateTimeFromUtc(utcDateTime);
                }

                dataReaderInfo = MaintenanceMobileAPIDAL.GetMaint_SupportTable(db, basicParam.SiteID, startRowIndex, rowCount, utcTimestamp);
                while (dataReaderInfo.Read())
                {
                    maintSupportInfo = new Maint_Support();
                    maintSupportInfo.FSUPPORTID = Common.GetSafeInt64(dataReaderInfo, "FSUPPORTID");
                    maintSupportInfo.FEQUIPMENTID = Common.GetSafeInt64(dataReaderInfo, "FEQUIPMENTID");
                    maintSupportInfo.FSUPPORTNAME = Common.GetSafeString(dataReaderInfo, "FSUPPORTNAME");
                    maintSupportInfo.FSUPPORTNUMBER = Common.GetSafeString(dataReaderInfo, "FSUPPORTNUMBER");
                    maintSupportInfo.FSUPPORTEMAILID = Common.GetSafeString(dataReaderInfo, "FSUPPORTEMAILID");
                    maintSupportInfo.FSUPPORTTYPE = Convert.ToChar(Common.GetSafeString(dataReaderInfo, "FSUPPORTTYPE"));
                    maintSupportInfo.FUPDATEDON = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDON");
                    maintSupportInfo.FUPDATEDTIME = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDTIME");
                    maintSupportInfo.FSTATUS = Convert.ToChar(Common.GetSafeChar(dataReaderInfo, "FSTATUS"));
                    maintSupportInfo.FSITEID = Common.GetSafeInt32(dataReaderInfo, "FSITEID");

                    if (totalRowCount == 0)
                        totalRowCount = Common.GetSafeInt32(dataReaderInfo, "FCOUNT");

                    maintSupportInfoList.Add(maintSupportInfo);
                }
                dataReaderInfo.Close();

                return maintSupportInfoList;
            }
            catch (Exception ex)
            {
                string exceptionErrorMessage = Common.GetErrorMessage(ex.Message);
                Common.LogException(ex, "VegamMaintenanceAPIService", "Error while getting maintenance support information ", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "SiteID : " + basicParam.SiteID + " ;UserID : " + basicParam.UserID);
                throw new FaultException(exceptionErrorMessage);
            }
            finally
            {
                if (dataReaderInfo != null && !dataReaderInfo.IsClosed)
                    dataReaderInfo.Close();
            }
        }

        private List<ProductionLineResource> GetProductionlineresourceTable(Database db, BasicParam basicParam, int startRowIndex, int rowCount, string utcDateTime, ref int totalRowCount)
        {
            IDataReader dataReaderInfo = null;
            try
            {
                List<ProductionLineResource> productionlineresourceList = new List<ProductionLineResource>();
                ProductionLineResource productionlineresourceInfo = null;
                int startDate = 0;
                int startTime = 0;
                int timeZoneOffset = 0;
                string filterSiteDateTime = string.Empty;


                if (!string.IsNullOrEmpty(utcDateTime))
                {
                    //Convert UTC Date Time to site Date Time
                    Common.GetSiteDateTimeFromUtc(db, basicParam.SiteID, Convert.ToInt64(utcDateTime), ref startDate, ref startTime, ref timeZoneOffset);
                    filterSiteDateTime = startDate.ToString() + startTime.ToString().PadLeft(6,'0'); //YYYYMMDDHH24MMSS Format string
                }

                dataReaderInfo = MaintenanceMobileAPIDAL.GetProductionlineresourceTable(db, basicParam.SiteID, startRowIndex, rowCount, startDate);
                while (dataReaderInfo.Read())
                {
                    productionlineresourceInfo = new ProductionLineResource();
                    productionlineresourceInfo.FRESOURCEID = Common.GetSafeInt64(dataReaderInfo, "FRESOURCEID");
                    productionlineresourceInfo.FSITEID = Common.GetSafeInt32(dataReaderInfo, "FSITEID");
                    productionlineresourceInfo.FPLINEID = Common.GetSafeInt64(dataReaderInfo, "FPLINEID");
                    productionlineresourceInfo.FRESOURCECODE = Common.GetSafeString(dataReaderInfo, "FRESOURCECODE");
                    productionlineresourceInfo.FRESOURCEDESC = Common.GetSafeString(dataReaderInfo, "FRESOURCEDESC");
                    productionlineresourceInfo.FTYPE = Convert.ToChar(Common.GetSafeChar(dataReaderInfo, "FTYPE"));
                    productionlineresourceInfo.FUPDATEDATE = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDATE");
                    productionlineresourceInfo.FSTATUS = Convert.ToChar(Common.GetSafeChar(dataReaderInfo, "FSTATUS"));

                    if (totalRowCount == 0)
                        totalRowCount = Common.GetSafeInt32(dataReaderInfo, "FCOUNT");

                    productionlineresourceList.Add(productionlineresourceInfo);
                }
                dataReaderInfo.Close();

                return productionlineresourceList;
            }
            catch (Exception ex)
            {
                string exceptionErrorMessage = Common.GetErrorMessage(ex.Message);
                Common.LogException(ex, "VegamMaintenanceAPIService", "Error while getting Productionlineresource table information", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "SiteID : " + basicParam.SiteID + " ;UserID : " + basicParam.UserID);
                throw new FaultException(exceptionErrorMessage);
            }
            finally
            {
                if (dataReaderInfo != null && !dataReaderInfo.IsClosed)
                    dataReaderInfo.Close();
            }
        }

        private List<Plantppe> GetPlantppeTable(Database db, BasicParam basicParam, int startRowIndex, int rowCount, string utcDateTime, ref int totalRowCount)
        {
            IDataReader dataReaderInfo = null;
            try
            {
                List<Plantppe> plantppeList = new List<Plantppe>();
                Plantppe plantppeInfo = null;
                int startDate = 0;
                int startTime = 0;
                int timeZoneOffset = 0;
                string filterSiteDateTime = string.Empty;


                if (!string.IsNullOrEmpty(utcDateTime))
                {
                    //Convert UTC Date Time to site Date Time
                    Common.GetSiteDateTimeFromUtc(db, basicParam.SiteID, Convert.ToInt64(utcDateTime), ref startDate, ref startTime, ref timeZoneOffset);
                    filterSiteDateTime = startDate.ToString() + startTime.ToString().PadLeft(6,'0'); //YYYYMMDDHH24MMSS Format string
                }

                dataReaderInfo = MaintenanceMobileAPIDAL.GetPlantppeTable(db, basicParam.SiteID, startRowIndex, rowCount, startDate);
                while (dataReaderInfo.Read())
                {
                    plantppeInfo = new Plantppe();
                    plantppeInfo.FPPEID = Common.GetSafeInt64(dataReaderInfo, "FPPEID");
                    plantppeInfo.FSITEID = Common.GetSafeInt32(dataReaderInfo, "FSITEID");
                    plantppeInfo.FPPEDESC = Common.GetSafeString(dataReaderInfo, "FPPEDESC");
                    plantppeInfo.FPPEIMAGENAME = Common.GetSafeString(dataReaderInfo, "FPPEIMAGENAME");
                    plantppeInfo.FUPDATEDATE = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDATE");
                    plantppeInfo.FSTATUS = Convert.ToChar(Common.GetSafeChar(dataReaderInfo, "FSTATUS"));

                    if (totalRowCount == 0)
                        totalRowCount = Common.GetSafeInt32(dataReaderInfo, "FCOUNT");

                    plantppeList.Add(plantppeInfo);
                }
                dataReaderInfo.Close();

                return plantppeList;
            }
            catch (Exception ex)
            {
                string exceptionErrorMessage = Common.GetErrorMessage(ex.Message);
                Common.LogException(ex, "VegamMaintenanceAPIService", "Error while getting Plantppe table information", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "SiteID : " + basicParam.SiteID + " ;UserID : " + basicParam.UserID);
                throw new FaultException(exceptionErrorMessage);
            }
            finally
            {
                if (dataReaderInfo != null && !dataReaderInfo.IsClosed)
                    dataReaderInfo.Close();
            }
        }

        private List<EnumType> GetEnumTypeTable(Database db, BasicParam basicParam, int startRowIndex, int rowCount, ref int totalRowCount, string filterType)
        {
            IDataReader dataReaderInfo = null;
            try
            {

                List<EnumType> enumTypeList = new List<EnumType>();
                EnumType EnumTypeInfo = null;

                dataReaderInfo = MaintenanceMobileAPIDAL.GetEnumTypeTable(db, basicParam.SiteID, startRowIndex, rowCount, filterType);
                while (dataReaderInfo.Read())
                {
                    EnumTypeInfo = new EnumType();
                    EnumTypeInfo.FTYPE = Common.GetSafeString(dataReaderInfo, "FTYPE");
                    EnumTypeInfo.FVALUE = Common.GetSafeString(dataReaderInfo, "FVALUE");
                    EnumTypeInfo.FTEXT = Common.GetSafeString(dataReaderInfo, "FTEXT");
                    EnumTypeInfo.FISDEFAULT = Convert.ToChar(Common.GetSafeChar(dataReaderInfo, "FISDEFAULT"));
                    EnumTypeInfo.FSITEID = Common.GetSafeInt32(dataReaderInfo, "FSITEID");

                    if (totalRowCount == 0)
                        totalRowCount = Common.GetSafeInt32(dataReaderInfo, "FCOUNT");

                    enumTypeList.Add(EnumTypeInfo);
                }
                dataReaderInfo.Close();
                return enumTypeList;
            }
            catch (Exception ex)
            {
                string exceptionErrorMessage = Common.GetErrorMessage(ex.Message);
                Common.LogException(ex, "VegamMaintenanceAPIService", "Error while getting enum type information ", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "SiteID : " + basicParam.SiteID + " ;UserID : " + basicParam.UserID);
                throw new FaultException(exceptionErrorMessage);
            }
            finally
            {
                if (dataReaderInfo != null && !dataReaderInfo.IsClosed)
                    dataReaderInfo.Close();
            }
        }

        private List<Maint_Auth_Group> GetAuthGroup(Database db, BasicParam basicParam, int startRowIndex, int rowCount, string utcDateTime, ref int totalRowCount)
        {
            IDataReader dataReaderInfo = null;
            try
            {
                long utcTimestamp = 0;
                List<Maint_Auth_Group> maintAuthGroupList = new List<Maint_Auth_Group>();
                Maint_Auth_Group maintAuthGroupInfo = null;

                if (!string.IsNullOrEmpty(utcDateTime))
                {
                    //Convert UtcDateTime to TimeStamp(YYYYMMDDHHmmss)
                    utcTimestamp = Common.GetDateTimeFromUtc(utcDateTime);
                }

                dataReaderInfo = MaintenanceMobileAPIDAL.GetAuthGroupTable(db, basicParam.SiteID, startRowIndex, rowCount, utcTimestamp);
                while (dataReaderInfo.Read())
                {
                    maintAuthGroupInfo = new Maint_Auth_Group();
                    maintAuthGroupInfo.FREFERENCEID = Common.GetSafeInt64(dataReaderInfo, "FREFERENCEID");
                    maintAuthGroupInfo.FSITEID = Common.GetSafeInt32(dataReaderInfo, "FSITEID");
                    maintAuthGroupInfo.FTYPE = Common.GetSafeString(dataReaderInfo, "FTYPE");
                    maintAuthGroupInfo.FWORKGROUPID = Common.GetSafeInt64(dataReaderInfo, "FWORKGROUPID");
                    maintAuthGroupInfo.FSTATUS = Convert.ToChar(Common.GetSafeString(dataReaderInfo, "FSTATUS"));
                    maintAuthGroupInfo.FUPDATEDBY = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDBY");
                    maintAuthGroupInfo.FUPDATEDDATE = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDDATE");
                    maintAuthGroupInfo.FUPDATEDTIME = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDTIME");

                    if (totalRowCount == 0)
                        totalRowCount = Common.GetSafeInt32(dataReaderInfo, "FCOUNT");

                    maintAuthGroupList.Add(maintAuthGroupInfo);
                }
                dataReaderInfo.Close();

                return maintAuthGroupList;
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

		private List<SensorType_UOM> GetSensorType_UOMTable(Database db, BasicParam basicParam, int startRowIndex, int rowCount, string utcDateTime, ref int totalRowCount)
		{
			IDataReader dataReaderInfo = null;
			try
			{
				List<SensorType_UOM> sensorTypeUOMList = new List<SensorType_UOM>();
				SensorType_UOM sensorTypeUOMInfo = null;
                int startDate = 0;
                int startTime = 0;
                int timeZoneOffset = 0;

                if (!string.IsNullOrEmpty(utcDateTime))
                {
                    //Convert UTC Date Time to site Date Time
                    Common.GetSiteDateTimeFromUtc(db, basicParam.SiteID, Convert.ToInt64(utcDateTime), ref startDate, ref startTime, ref timeZoneOffset);
                }

                dataReaderInfo = MaintenanceMobileAPIDAL.GetSensorType_UOMTable(db, startRowIndex, rowCount, startDate);
				while (dataReaderInfo.Read())
				{
					sensorTypeUOMInfo = new SensorType_UOM();
					sensorTypeUOMInfo.FSENSORTYPEUOMID = Common.GetSafeInt32(dataReaderInfo, "FSENSORTYPEUOMID");
					sensorTypeUOMInfo.FSENSORTYPEID = Common.GetSafeInt32(dataReaderInfo, "FSENSORTYPEID");
					sensorTypeUOMInfo.FUOMNAME = Common.GetSafeString(dataReaderInfo, "FUOMNAME");
					sensorTypeUOMInfo.FSYMBOL = Common.GetSafeString(dataReaderInfo, "FSYMBOL");
					sensorTypeUOMInfo.FCREATEDBY = Common.GetSafeInt32(dataReaderInfo, "FCREATEDBY");
					sensorTypeUOMInfo.FCREATEDDATE = Common.GetSafeInt32(dataReaderInfo, "FCREATEDDATE");
					

					if (totalRowCount == 0)
						totalRowCount = Common.GetSafeInt32(dataReaderInfo, "FCOUNT");

					sensorTypeUOMList.Add(sensorTypeUOMInfo);
				}
				dataReaderInfo.Close();

				return sensorTypeUOMList;
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

		private List<Sensor_Type> GetSensor_TypeTable(Database db, BasicParam basicParam, int startRowIndex, int rowCount, string utcDateTime, ref int totalRowCount)
		{
			IDataReader dataReaderInfo = null;
			try
			{
				List<Sensor_Type> sensorTypeList = new List<Sensor_Type>();
				Sensor_Type sensorTypeInfo = null;
				int startDate = 0;
				int startTime = 0;
				int timeZoneOffset = 0;
				string filterSiteDateTime = string.Empty;


				if (!string.IsNullOrEmpty(utcDateTime))
				{
					//Convert UTC Date Time to site Date Time
					Common.GetSiteDateTimeFromUtc(db, basicParam.SiteID, Convert.ToInt64(utcDateTime), ref startDate, ref startTime, ref timeZoneOffset);
					filterSiteDateTime = startDate.ToString() + startTime.ToString().PadLeft(6,'0'); //YYYYMMDDHH24MMSS Format string
				}

				dataReaderInfo = MaintenanceMobileAPIDAL.GetSensor_TypeTable(db, basicParam.SiteID, startRowIndex, rowCount, startDate);
				while (dataReaderInfo.Read())
				{
					sensorTypeInfo = new Sensor_Type();
					sensorTypeInfo.FSENSORTYPEID = Common.GetSafeInt32(dataReaderInfo, "FSENSORTYPEID");
					sensorTypeInfo.FSENSORTYPENAME = Common.GetSafeString(dataReaderInfo, "FSENSORTYPENAME");
					sensorTypeInfo.FCREATEDBY = Common.GetSafeInt32(dataReaderInfo, "FCREATEDON");
					sensorTypeInfo.FCREATEDBY = Common.GetSafeInt32(dataReaderInfo, "FCREATEDBY");
					sensorTypeInfo.FUPDATEDON = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDON");
					sensorTypeInfo.FUPDATEDBY = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDBY");
					sensorTypeInfo.FSTATUS = Convert.ToChar(Common.GetSafeString(dataReaderInfo, "FSTATUS"));

					if (totalRowCount == 0)
						totalRowCount = Common.GetSafeInt32(dataReaderInfo, "FCOUNT");

					sensorTypeList.Add(sensorTypeInfo);
				}
				dataReaderInfo.Close();

				return sensorTypeList;
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

		private List<Maint_Schedule_Spareparts> GetMaint_Schedule_SparepartsTable(Database db, BasicParam basicParam, int startRowIndex, int rowCount, string utcDateTime, ref int totalRowCount)
		{
			IDataReader dataReaderInfo = null;
			try
			{
                long utcTimestamp = 0;

                List<Maint_Schedule_Spareparts> maintScheduleSparepartsList = new List<Maint_Schedule_Spareparts>();
				Maint_Schedule_Spareparts maintScheduleSparepartsInfo = null;

                if (!string.IsNullOrEmpty(utcDateTime))
                {
                    //Convert UtcDateTime to TimeStamp(YYYYMMDDHHmmss)
                    utcTimestamp = Common.GetDateTimeFromUtc(utcDateTime);
                }

                dataReaderInfo = MaintenanceMobileAPIDAL.GetMaint_Schedule_SparepartsTable(db, basicParam.SiteID, startRowIndex, rowCount, utcTimestamp);
				while (dataReaderInfo.Read())
				{
					maintScheduleSparepartsInfo = new Maint_Schedule_Spareparts();
					maintScheduleSparepartsInfo.FSITEID = Common.GetSafeInt32(dataReaderInfo, "FSITEID");
					maintScheduleSparepartsInfo.FSCHEDULEID = Common.GetSafeInt64(dataReaderInfo, "FSCHEDULEID");
					maintScheduleSparepartsInfo.FIDHID = Common.GetSafeString(dataReaderInfo, "FIDHID");
					maintScheduleSparepartsInfo.FQTY = Common.GetSafeDecimal(dataReaderInfo, "FQTY");
					maintScheduleSparepartsInfo.FCREATEDBY = Common.GetSafeInt32(dataReaderInfo, "FCREATEDBY");
					maintScheduleSparepartsInfo.FCREATEDON = Common.GetSafeInt32(dataReaderInfo, "FCREATEDON");
					maintScheduleSparepartsInfo.FCREATEDTIME = Common.GetSafeInt32(dataReaderInfo, "FCREATEDTIME");
					maintScheduleSparepartsInfo.FUPDATEDBY = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDBY");
					maintScheduleSparepartsInfo.FUPDATEDON = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDON");
					maintScheduleSparepartsInfo.FUPDATEDTIME = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDTIME");
					maintScheduleSparepartsInfo.FSTATUS = Convert.ToChar(Common.GetSafeString(dataReaderInfo, "FSTATUS"));

					if (totalRowCount == 0)
						totalRowCount = Common.GetSafeInt32(dataReaderInfo, "FCOUNT");

					maintScheduleSparepartsList.Add(maintScheduleSparepartsInfo);
				}
				dataReaderInfo.Close();

				return maintScheduleSparepartsList;
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

		private List<Maint_WorkOrder_Sparepart> GetMaint_WorkOrder_SparepartTable(Database db, BasicParam basicParam, int startRowIndex, int rowCount, string utcDateTime, ref int totalRowCount)
		{
			IDataReader dataReaderInfo = null;
			try
			{
                long utcTimestamp = 0;

                List<Maint_WorkOrder_Sparepart> maintWorkOrderSparepartList = new List<Maint_WorkOrder_Sparepart>();
				Maint_WorkOrder_Sparepart maintWorkOrderSparepartInfo = null;

                if (!string.IsNullOrEmpty(utcDateTime))
                {
                    //Convert UtcDateTime to TimeStamp(YYYYMMDDHHmmss)
                    utcTimestamp = Common.GetDateTimeFromUtc(utcDateTime);
                }

                dataReaderInfo = MaintenanceMobileAPIDAL.GetMaint_WorkOrder_SparepartTable(db, basicParam.SiteID, startRowIndex, rowCount, utcTimestamp);
				while (dataReaderInfo.Read())
				{
					maintWorkOrderSparepartInfo = new Maint_WorkOrder_Sparepart();
					maintWorkOrderSparepartInfo.FSITEID = Common.GetSafeInt32(dataReaderInfo, "FSITEID");
					maintWorkOrderSparepartInfo.FWORK_ORDERID = Common.GetSafeString(dataReaderInfo, "FWORK_ORDERID");
					maintWorkOrderSparepartInfo.FIDHID = Common.GetSafeString(dataReaderInfo, "FIDHID");
					maintWorkOrderSparepartInfo.FREQUIREDQTY = Common.GetSafeDecimal(dataReaderInfo, "FREQUIREDQTY");
					maintWorkOrderSparepartInfo.FACTUALQUANTITY = Common.GetSafeDecimal(dataReaderInfo, "FACTUALQUANTITY");
					maintWorkOrderSparepartInfo.FCREATEDBY = Common.GetSafeInt32(dataReaderInfo, "FCREATEDBY");
					maintWorkOrderSparepartInfo.FCREATEDON = Common.GetSafeInt32(dataReaderInfo, "FCREATEDON");
					maintWorkOrderSparepartInfo.FCREATEDTIME = Common.GetSafeInt32(dataReaderInfo, "FCREATEDTIME");
					maintWorkOrderSparepartInfo.FUPDATEDBY = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDBY");
					maintWorkOrderSparepartInfo.FUPDATEDON = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDON");
					maintWorkOrderSparepartInfo.FUPDATEDTIME = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDTIME");
					
					if (totalRowCount == 0)
						totalRowCount = Common.GetSafeInt32(dataReaderInfo, "FCOUNT");

					maintWorkOrderSparepartList.Add(maintWorkOrderSparepartInfo);
				}
				dataReaderInfo.Close();

				return maintWorkOrderSparepartList;
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

		private List<PlantMaterial> GetPlantMaterialTable(Database db, BasicParam basicParam, int startRowIndex, int rowCount, string utcDateTime, ref int totalRowCount)
		{
			IDataReader dataReaderInfo = null;
			try
			{
				List<PlantMaterial> plantMaterialList = new List<PlantMaterial>();
				PlantMaterial plantMaterialInfo = null;
                int startDate = 0;
                int startTime = 0;
                int timeZoneOffset = 0;
                string filterSiteDateTime = string.Empty;

                if (!string.IsNullOrEmpty(utcDateTime))
                {
                    //Convert UTC Date Time to site Date Time
                    Common.GetSiteDateTimeFromUtc(db, basicParam.SiteID, Convert.ToInt64(utcDateTime), ref startDate, ref startTime, ref timeZoneOffset);
                    filterSiteDateTime = startDate.ToString() + startTime.ToString().PadLeft(6, '0'); //YYYYMMDDHH24MMSS Format string
                }

                dataReaderInfo = MaintenanceMobileAPIDAL.GetPlantMaterialTable(db, basicParam.SiteID, startRowIndex, rowCount, filterSiteDateTime);
				while (dataReaderInfo.Read())
				{
					plantMaterialInfo = new PlantMaterial();
					plantMaterialInfo.FSITEID = Common.GetSafeInt32(dataReaderInfo, "FSITEID");
					plantMaterialInfo.FIDHDESC = Common.GetSafeString(dataReaderInfo, "FIDHDESC");
					plantMaterialInfo.FIDHID = Common.GetSafeString(dataReaderInfo, "FIDHID");
					plantMaterialInfo.FTYPE = Common.GetSafeString(dataReaderInfo, "FTYPE");
					plantMaterialInfo.FSTATUS = Convert.ToChar(Common.GetSafeString(dataReaderInfo, "FSTATUS"));
					plantMaterialInfo.FSAP_IDHDESC = Common.GetSafeString(dataReaderInfo, "FSAP_IDHDESC");
					plantMaterialInfo.FMATCATEGORY = Common.GetSafeInt64(dataReaderInfo, "FMATCATEGORY");
                    plantMaterialInfo.FBASEUOM = Common.GetSafeString(dataReaderInfo, "FBASEUOM");
                    plantMaterialInfo.FUPDATEDON = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDON");
                    plantMaterialInfo.FUPDATEDTIME = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDTIME");

                    if (totalRowCount == 0)
						totalRowCount = Common.GetSafeInt32(dataReaderInfo, "FCOUNT");

					plantMaterialList.Add(plantMaterialInfo);
				}
				dataReaderInfo.Close();

				return plantMaterialList;
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
		#endregion

		#region Schedule/Work Orders Table Data

		private List<Maint_Schedule> GetMaint_ScheduleTable(Database db, BasicParam basicParam, int startRowIndex, int rowCount, string utcDateTime, ref int totalRowCount)
        {
            IDataReader dataReaderInfo = null;
            try
            {

                long utcTimestamp = 0;

                List<Maint_Schedule> maintScheduleInfoList = new List<Maint_Schedule>();
                Maint_Schedule maintScheduleInfo = null;

                if (!string.IsNullOrEmpty(utcDateTime))
                {
                    //Convert UtcDateTime to TimeStamp(YYYYMMDDHHmmss)
                    utcTimestamp = Common.GetDateTimeFromUtc(utcDateTime);
                }

                dataReaderInfo = MaintenanceMobileAPIDAL.GetMaint_ScheduleTable(db, basicParam.SiteID, startRowIndex, rowCount, utcTimestamp);
                while (dataReaderInfo.Read())
                {
                    maintScheduleInfo = new Maint_Schedule();
                    maintScheduleInfo.FSITEID = Common.GetSafeInt32(dataReaderInfo, "FSITEID");
                    maintScheduleInfo.FSCHEDULEID = Common.GetSafeInt64(dataReaderInfo, "FSCHEDULEID");
                    maintScheduleInfo.FMAINTENANCENAME = Common.GetSafeString(dataReaderInfo, "FMAINTENANCENAME");
                    maintScheduleInfo.FMAINDESCRIPTION = Common.GetSafeString(dataReaderInfo, "FMAINDESCRIPTION");
                    maintScheduleInfo.FSCHEDULE_TYPE = Convert.ToChar(Common.GetSafeChar(dataReaderInfo, "FSCHEDULE_TYPE"));
                    maintScheduleInfo.FMAINTYPEID = Common.GetSafeInt64(dataReaderInfo, "FMAINTYPEID");
                    maintScheduleInfo.FLOCATIONID = Common.GetSafeInt64(dataReaderInfo, "FLOCATIONID");
                    maintScheduleInfo.FEQUIPMENTID = Common.GetSafeInt64(dataReaderInfo, "FEQUIPMENTID");
                    maintScheduleInfo.FWORKGROUPID = Common.GetSafeInt64(dataReaderInfo, "FWORKGROUPID");
                    maintScheduleInfo.FSCHD_RULE_DESC = Common.GetSafeString(dataReaderInfo, "FSCHD_RULE_DESC");
                    maintScheduleInfo.FSCHEDULESTATUS = Common.GetSafeString(dataReaderInfo, "FSCHEDULESTATUS");
                    maintScheduleInfo.FTASKGROUPIDENTIFIER = Common.GetSafeInt64(dataReaderInfo, "FTASKGROUPIDENTIFIER");
                    maintScheduleInfo.FSCHD_RULE_DESC_TYPE = Common.GetSafeInt32(dataReaderInfo, "FSCHD_RULE_DESC_TYPE");
                    maintScheduleInfo.FUPDATEDON = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDON");
                    maintScheduleInfo.FUPDATEDTIME = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDTIME");
                    maintScheduleInfo.FSTATUS = Convert.ToChar(Common.GetSafeChar(dataReaderInfo, "FSTATUS"));
                    maintScheduleInfo.FPRIORITYTYPE = Common.GetSafeString(dataReaderInfo, "FPRIORITYTYPE");
                    maintScheduleInfo.FNOTIFY_WORK_ORDERID = Common.GetSafeString(dataReaderInfo, "FNOTIFY_WORK_ORDERID");
                    maintScheduleInfo.FNOTIFY_TYPEID = Common.GetSafeInt64(dataReaderInfo, "FNOTIFY_TYPEID");
                    maintScheduleInfo.FREMARKS = Common.GetSafeString(dataReaderInfo, "FREMARKS");

                    if (totalRowCount == 0)
                        totalRowCount = Common.GetSafeInt32(dataReaderInfo, "FCOUNT");

                    maintScheduleInfoList.Add(maintScheduleInfo);
                }
                dataReaderInfo.Close();

                return maintScheduleInfoList;
            }
            catch (Exception ex)
            {
                string exceptionErrorMessage = Common.GetErrorMessage(ex.Message);
                Common.LogException(ex, "VegamMaintenanceAPIService", "Error while getting maintenance schedule information ", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "SiteID : " + basicParam.SiteID + " ;UserID : " + basicParam.UserID);
                throw new FaultException(exceptionErrorMessage);
            }
            finally
            {
                if (dataReaderInfo != null && !dataReaderInfo.IsClosed)
                    dataReaderInfo.Close();
            }
        }

        private List<Maint_Schedule_Dtl> GetMaint_ScheduleDtlTable(Database db, BasicParam basicParam, int startRowIndex, int rowCount, string utcDateTime, ref int totalRowCount)
        {
            IDataReader dataReaderInfo = null;
            try
            {
                long utcTimestamp = 0;

                List<Maint_Schedule_Dtl> maintScheduleDtlInfoList = new List<Maint_Schedule_Dtl>();
                Maint_Schedule_Dtl maintScheduleDtlInfo = null;

                if (!string.IsNullOrEmpty(utcDateTime))
                {
                    //Convert UtcDateTime to TimeStamp(YYYYMMDDHHmmss)
                    utcTimestamp = Common.GetDateTimeFromUtc(utcDateTime);
                }

                dataReaderInfo = MaintenanceMobileAPIDAL.GetMaint_ScheduleDtlTable(db, basicParam.SiteID, startRowIndex, rowCount, utcTimestamp);
                while (dataReaderInfo.Read())
                {
                    maintScheduleDtlInfo = new Maint_Schedule_Dtl();
                    maintScheduleDtlInfo.FSITEID = Common.GetSafeInt32(dataReaderInfo, "FSITEID");
                    maintScheduleDtlInfo.FSCHEDULE_DTL_ID = Common.GetSafeInt64(dataReaderInfo, "FSCHEDULE_DTL_ID");
                    maintScheduleDtlInfo.FSCHEDULEID = Common.GetSafeInt64(dataReaderInfo, "FSCHEDULEID");
                    maintScheduleDtlInfo.FITEM_ID = Common.GetSafeInt32(dataReaderInfo, "FITEM_ID");
                    maintScheduleDtlInfo.FFREQUENCY = Common.GetSafeString(dataReaderInfo, "FFREQUENCY");
                    maintScheduleDtlInfo.FINTERVAL = Common.GetSafeInt32(dataReaderInfo, "FINTERVAL");
                    maintScheduleDtlInfo.FSTARTDATE = Common.GetSafeInt32(dataReaderInfo, "FSTARTDATE");
                    maintScheduleDtlInfo.FSTARTTIME = Common.GetSafeInt32(dataReaderInfo, "FSTARTTIME");
                    maintScheduleDtlInfo.FENDDATE = Common.GetSafeInt32(dataReaderInfo, "FENDDATE");
                    maintScheduleDtlInfo.FENDNUM_OCCURENCE = Common.GetSafeInt32(dataReaderInfo, "FENDNUM_OCCURENCE");
                    maintScheduleDtlInfo.FWEEK_DAY = Common.GetSafeString(dataReaderInfo, "FWEEK_DAY");
                    maintScheduleDtlInfo.FMONTH_OPTION = Common.GetSafeInt32(dataReaderInfo, "FMONTH_OPTION");
                    maintScheduleDtlInfo.FMONTH_DAY = Common.GetSafeString(dataReaderInfo, "FMONTH_DAY");
                    maintScheduleDtlInfo.FMONTH_POSITION = Common.GetSafeString(dataReaderInfo, "FMONTH_POSITION");
                    maintScheduleDtlInfo.FYEAR_OPTION = Common.GetSafeInt32(dataReaderInfo, "FYEAR_OPTION");
                    maintScheduleDtlInfo.FYEAR_MONTH = Common.GetSafeString(dataReaderInfo, "FYEAR_MONTH");
                    maintScheduleDtlInfo.FNOTIFYDAY = Common.GetSafeInt32(dataReaderInfo, "FNOTIFYDAY");
                    maintScheduleDtlInfo.FBASEDONPERFDATE = Convert.ToChar(Common.GetSafeChar(dataReaderInfo, "FBASEDONPERFDATE"));
                    maintScheduleDtlInfo.FUPDATEDON = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDON");
                    maintScheduleDtlInfo.FUPDATEDTIME = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDTIME");
                    maintScheduleDtlInfo.FSTATUS = Convert.ToChar(Common.GetSafeChar(dataReaderInfo, "FSTATUS"));

                    if (totalRowCount == 0)
                        totalRowCount = Common.GetSafeInt32(dataReaderInfo, "FCOUNT");

                    maintScheduleDtlInfoList.Add(maintScheduleDtlInfo);
                }
                dataReaderInfo.Close();

                return maintScheduleDtlInfoList;
            }
            catch (Exception ex)
            {
                string exceptionErrorMessage = Common.GetErrorMessage(ex.Message);
                Common.LogException(ex, "VegamMaintenanceAPIService", "Error while getting maintenance schedule details information ", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "SiteID : " + basicParam.SiteID + " ;UserID : " + basicParam.UserID);
                throw new FaultException(exceptionErrorMessage);
            }
            finally
            {
                if (dataReaderInfo != null && !dataReaderInfo.IsClosed)
                    dataReaderInfo.Close();
            }
        }

        private List<Maint_Selgrp_Code> GetMaint_SelGrpCodeTable(Database db, BasicParam basicParam, int startRowIndex, int rowCount, string utcDateTime, ref int totalRowCount)
        {
            IDataReader dataReaderInfo = null;
            try
            {
                long utcTimestamp = 0;

                List<Maint_Selgrp_Code> maintSelgrpCodeInfoList = new List<Maint_Selgrp_Code>();
                Maint_Selgrp_Code maintSelgrpCodeInfo = null;

                if (!string.IsNullOrEmpty(utcDateTime))
                {
                    //Convert UtcDateTime to TimeStamp(YYYYMMDDHHmmss)
                    utcTimestamp = Common.GetDateTimeFromUtc(utcDateTime);
                }

                dataReaderInfo = MaintenanceMobileAPIDAL.GetMaint_SelGrpCodeTable(db, basicParam.SiteID, startRowIndex, rowCount, utcTimestamp);
                while (dataReaderInfo.Read())
                {
                    maintSelgrpCodeInfo = new Maint_Selgrp_Code();
                    maintSelgrpCodeInfo.FSITEID = Common.GetSafeInt32(dataReaderInfo, "FSITEID");
                    maintSelgrpCodeInfo.FMASTERID = Common.GetSafeInt64(dataReaderInfo, "FMASTERID");
                    maintSelgrpCodeInfo.FITEMID = Common.GetSafeInt32(dataReaderInfo, "FITEMID");
                    maintSelgrpCodeInfo.FDISPLAYNAME = Common.GetSafeString(dataReaderInfo, "FDISPLAYNAME");
                    maintSelgrpCodeInfo.FUPDATEDON = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDON");
                    maintSelgrpCodeInfo.FUPDATEDTIME = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDTIME");
                    maintSelgrpCodeInfo.FSTATUS = Convert.ToChar(Common.GetSafeChar(dataReaderInfo, "FSTATUS"));

                    if (totalRowCount == 0)
                        totalRowCount = Common.GetSafeInt32(dataReaderInfo, "FCOUNT");

                    maintSelgrpCodeInfoList.Add(maintSelgrpCodeInfo);
                }
                dataReaderInfo.Close();

                return maintSelgrpCodeInfoList;
            }
            catch (Exception ex)
            {
                string exceptionErrorMessage = Common.GetErrorMessage(ex.Message);
                Common.LogException(ex, "VegamMaintenanceAPIService", "Error while getting maintenance selection group code information ", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "SiteID : " + basicParam.SiteID + " ;UserID : " + basicParam.UserID);
                throw new FaultException(exceptionErrorMessage);
            }
            finally
            {
                if (dataReaderInfo != null && !dataReaderInfo.IsClosed)
                    dataReaderInfo.Close();
            }
        }

        private List<Maint_Taskgroup> GetMaint_TaskGroupTable(Database db, BasicParam basicParam, int startRowIndex, int rowCount, string utcDateTime, ref int totalRowCount)
        {
            IDataReader dataReaderInfo = null;
            try
            {
                long utcTimestamp = 0;

                List<Maint_Taskgroup> maintTaskgroupInfoList = new List<Maint_Taskgroup>();
                Maint_Taskgroup maintTaskgroupInfo = null;

                if (!string.IsNullOrEmpty(utcDateTime))
                {
                    //Convert UtcDateTime to TimeStamp(YYYYMMDDHHmmss)
                    utcTimestamp = Common.GetDateTimeFromUtc(utcDateTime);
                }

                dataReaderInfo = MaintenanceMobileAPIDAL.GetMaint_TaskGroupTable(db, basicParam.SiteID, startRowIndex, rowCount, utcTimestamp);
                while (dataReaderInfo.Read())
                {
                    maintTaskgroupInfo = new Maint_Taskgroup();
                    maintTaskgroupInfo.FSITEID = Common.GetSafeInt32(dataReaderInfo, "FSITEID");
                    maintTaskgroupInfo.FTASKGROUPID = Common.GetSafeInt64(dataReaderInfo, "FTASKGROUPID");
                    maintTaskgroupInfo.FTASKGROUPNAME = Common.GetSafeString(dataReaderInfo, "FTASKGROUPNAME");
                    maintTaskgroupInfo.FTASKGROUPTYPEID = Common.GetSafeInt64(dataReaderInfo, "FTASKGROUPTYPEID");
                    maintTaskgroupInfo.FVERSION = Common.GetSafeInt32(dataReaderInfo, "FVERSION");
                    maintTaskgroupInfo.FIDENTIFIER = Common.GetSafeInt64(dataReaderInfo, "FIDENTIFIER");
                    maintTaskgroupInfo.FUPDATEDON = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDON");
                    maintTaskgroupInfo.FUPDATEDTIME = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDTIME");
                    maintTaskgroupInfo.FREF_TYPE = Common.GetSafeString(dataReaderInfo, "FREF_TYPE");
                    maintTaskgroupInfo.FSTATUS = Convert.ToChar(Common.GetSafeChar(dataReaderInfo, "FSTATUS"));

                    if (totalRowCount == 0)
                        totalRowCount = Common.GetSafeInt32(dataReaderInfo, "FCOUNT");

                    maintTaskgroupInfoList.Add(maintTaskgroupInfo);
                }
                dataReaderInfo.Close();

                return maintTaskgroupInfoList;
            }
            catch (Exception ex)
            {
                string exceptionErrorMessage = Common.GetErrorMessage(ex.Message);
                Common.LogException(ex, "VegamMaintenanceAPIService", "Error while getting maintenance task group information ", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "SiteID : " + basicParam.SiteID + " ;UserID : " + basicParam.UserID);
                throw new FaultException(exceptionErrorMessage);
            }
            finally
            {
                if (dataReaderInfo != null && !dataReaderInfo.IsClosed)
                    dataReaderInfo.Close();
            }
        }

        private List<Maint_Tasks> GetMaint_TasksTable(Database db, BasicParam basicParam, int startRowIndex, int rowCount, string utcDateTime, ref int totalRowCount)
        {
            IDataReader dataReaderInfo = null;
            try
            {
                long utcTimestamp = 0;

                List<Maint_Tasks> maintTaskInfoList = new List<Maint_Tasks>();
                Maint_Tasks maintTaskInfo = null;

                if (!string.IsNullOrEmpty(utcDateTime))
                {
                    //Convert UtcDateTime to TimeStamp(YYYYMMDDHHmmss)
                    utcTimestamp = Common.GetDateTimeFromUtc(utcDateTime);
                }

                dataReaderInfo = MaintenanceMobileAPIDAL.GetMaint_TasksTable(db, basicParam.SiteID, startRowIndex, rowCount, utcTimestamp);
                while (dataReaderInfo.Read())
                {
                    maintTaskInfo = new Maint_Tasks();
                    maintTaskInfo.FSITEID = Common.GetSafeInt32(dataReaderInfo, "FSITEID");
                    maintTaskInfo.FTASKID = Common.GetSafeInt64(dataReaderInfo, "FTASKID");
                    //    maintTaskInfo.FREF_TYPE = Common.GetSafeString(dataReaderInfo, "FREF_TYPE");
                    maintTaskInfo.FREFERENCEID = Common.GetSafeInt64(dataReaderInfo, "FREFERENCEID");
                    maintTaskInfo.FTASKNAME = Common.GetSafeString(dataReaderInfo, "FTASKNAME");
                    maintTaskInfo.FDESCRIPTION = Common.GetSafeString(dataReaderInfo, "FDESCRIPTION");
                    maintTaskInfo.FSAFETYDESCRIPTION = Common.GetSafeString(dataReaderInfo, "FSAFETYDESCRIPTION");
                    maintTaskInfo.FESTIMATEDTIME = Common.GetSafeInt64(dataReaderInfo, "FESTIMATEDTIME");
                    maintTaskInfo.FUNIT = Convert.ToChar(Common.GetSafeChar(dataReaderInfo, "FUNIT"));
                    maintTaskInfo.FREMARKENABLED = Convert.ToChar(Common.GetSafeChar(dataReaderInfo, "FREMARKENABLED"));
                    maintTaskInfo.FREMARKMANDATORY = Convert.ToChar(Common.GetSafeChar(dataReaderInfo, "FREMARKMANDATORY"));
                    maintTaskInfo.FPICTUREENABLED = Convert.ToChar(Common.GetSafeChar(dataReaderInfo, "FPICTUREENABLED"));
                    maintTaskInfo.FPICTUREMANDATORY = Convert.ToChar(Common.GetSafeChar(dataReaderInfo, "FPICTUREMANDATORY"));
                    maintTaskInfo.FSEQUENCENUM = Common.GetSafeInt32(dataReaderInfo, "FSEQUENCENUM");
                    maintTaskInfo.FUPDATEDON = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDON");
                    maintTaskInfo.FUPDATEDTIME = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDTIME");
                    maintTaskInfo.FSTATUS = Convert.ToChar(Common.GetSafeChar(dataReaderInfo, "FSTATUS"));

                    if (totalRowCount == 0)
                        totalRowCount = Common.GetSafeInt32(dataReaderInfo, "FCOUNT");

                    maintTaskInfoList.Add(maintTaskInfo);
                }
                dataReaderInfo.Close();

                return maintTaskInfoList;
            }
            catch (Exception ex)
            {
                string exceptionErrorMessage = Common.GetErrorMessage(ex.Message);
                Common.LogException(ex, "VegamMaintenanceAPIService", "Error while getting maintenance tasks information ", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "SiteID : " + basicParam.SiteID + " ;UserID : " + basicParam.UserID);
                throw new FaultException(exceptionErrorMessage);
            }
            finally
            {
                if (dataReaderInfo != null && !dataReaderInfo.IsClosed)
                    dataReaderInfo.Close();
            }
        }

        private List<Maint_Tasksparam> GetMaint_TasksParamTable(Database db, BasicParam basicParam, int startRowIndex, int rowCount, string utcDateTime, ref int totalRowCount)
        {
            IDataReader dataReaderInfo = null;
            try
            {
                long utcTimestamp = 0;

                List<Maint_Tasksparam> maintTasksparamInfoList = new List<Maint_Tasksparam>();
                Maint_Tasksparam maintTasksparamInfo = null;

                if (!string.IsNullOrEmpty(utcDateTime))
                {
                    //Convert UtcDateTime to TimeStamp(YYYYMMDDHHmmss)
                    utcTimestamp = Common.GetDateTimeFromUtc(utcDateTime);
                }

                dataReaderInfo = MaintenanceMobileAPIDAL.GetMaint_TasksParamTable(db, basicParam.SiteID, startRowIndex, rowCount, utcTimestamp);
                while (dataReaderInfo.Read())
                {
                    maintTasksparamInfo = new Maint_Tasksparam();
                    maintTasksparamInfo.FSITEID = Common.GetSafeInt32(dataReaderInfo, "FSITEID");
                    maintTasksparamInfo.FPARAMETERID = Common.GetSafeInt64(dataReaderInfo, "FPARAMETERID");
                    maintTasksparamInfo.FTASKGROUPID = Common.GetSafeInt64(dataReaderInfo, "FTASKGROUPID");
                    //  maintTasksparamInfo.FREF_TYPE = Common.GetSafeString(dataReaderInfo, "FREF_TYPE");
                    maintTasksparamInfo.FREFERENCEID = Common.GetSafeInt64(dataReaderInfo, "FREFERENCEID");
                    maintTasksparamInfo.FPARAMNAME = Common.GetSafeString(dataReaderInfo, "FPARAMNAME");
                    maintTasksparamInfo.FISMANDATORY = Convert.ToChar(Common.GetSafeChar(dataReaderInfo, "FISMANDATORY"));
                    maintTasksparamInfo.FTYPE = Convert.ToChar(Common.GetSafeChar(dataReaderInfo, "FTYPE"));
                    maintTasksparamInfo.FSELECTIONGROUPID = Common.GetSafeInt64(dataReaderInfo, "FSELECTIONGROUPID");
                    maintTasksparamInfo.FUPDATEDON = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDON");
                    maintTasksparamInfo.FUPDATEDTIME = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDTIME");
                    maintTasksparamInfo.FSTATUS = Convert.ToChar(Common.GetSafeChar(dataReaderInfo, "FSTATUS"));

                    if (totalRowCount == 0)
                        totalRowCount = Common.GetSafeInt32(dataReaderInfo, "FCOUNT");

                    maintTasksparamInfoList.Add(maintTasksparamInfo);
                }
                dataReaderInfo.Close();

                return maintTasksparamInfoList;
            }
            catch (Exception ex)
            {
                string exceptionErrorMessage = Common.GetErrorMessage(ex.Message);
                Common.LogException(ex, "VegamMaintenanceAPIService", "Error while getting maintenance tasks parameter information ", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "SiteID : " + basicParam.SiteID + " ;UserID : " + basicParam.UserID);
                throw new FaultException(exceptionErrorMessage);
            }
            finally
            {
                if (dataReaderInfo != null && !dataReaderInfo.IsClosed)
                    dataReaderInfo.Close();
            }
        }

        private List<Maint_Tasksppe> GetMaint_TasksPPETable(Database db, BasicParam basicParam, int startRowIndex, int rowCount, string utcDateTime, ref int totalRowCount)
        {
            IDataReader dataReaderInfo = null;
            try
            {
                long utcTimestamp = 0;

                List<Maint_Tasksppe> maintTasksppeInfoList = new List<Maint_Tasksppe>();
                Maint_Tasksppe maintTasksppeInfo = null;

                if (!string.IsNullOrEmpty(utcDateTime))
                {
                    //Convert UtcDateTime to TimeStamp(YYYYMMDDHHmmss)
                    utcTimestamp = Common.GetDateTimeFromUtc(utcDateTime);
                }


                dataReaderInfo = MaintenanceMobileAPIDAL.GetMaint_TasksPPETable(db, basicParam.SiteID, startRowIndex, rowCount, utcTimestamp);
                while (dataReaderInfo.Read())
                {
                    maintTasksppeInfo = new Maint_Tasksppe();
                    maintTasksppeInfo.FSITEID = Common.GetSafeInt32(dataReaderInfo, "FSITEID");
                    maintTasksppeInfo.FTASKPPEID = Common.GetSafeInt64(dataReaderInfo, "FTASKPPEID");
                    maintTasksppeInfo.FPPEID = Common.GetSafeInt64(dataReaderInfo, "FPPEID");
                    maintTasksppeInfo.FTASKGROUPID = Common.GetSafeInt64(dataReaderInfo, "FTASKGROUPID");
                    //maintTasksppeInfo.FREF_TYPE = Common.GetSafeString(dataReaderInfo, "FREF_TYPE");
                    maintTasksppeInfo.FREFERENCEID = Common.GetSafeInt64(dataReaderInfo, "FREFERENCEID");
                    maintTasksppeInfo.FCREATEDON = Common.GetSafeInt32(dataReaderInfo, "FCREATEDON");
                    maintTasksppeInfo.FCREATEDTIME = Common.GetSafeInt32(dataReaderInfo, "FCREATEDTIME");
                    maintTasksppeInfo.FUPDATEDON = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDON");
                    maintTasksppeInfo.FUPDATEDTIME = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDTIME");
                    maintTasksppeInfo.FSTATUS = Convert.ToChar(Common.GetSafeChar(dataReaderInfo, "FSTATUS"));

                    if (totalRowCount == 0)
                        totalRowCount = Common.GetSafeInt32(dataReaderInfo, "FCOUNT");

                    maintTasksppeInfoList.Add(maintTasksppeInfo);
                }
                dataReaderInfo.Close();
                return maintTasksppeInfoList;
            }
            catch (Exception ex)
            {
                string exceptionErrorMessage = Common.GetErrorMessage(ex.Message);
                Common.LogException(ex, "VegamMaintenanceAPIService", "Error while getting maintenance tasks ppe information ", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "SiteID : " + basicParam.SiteID + " ;UserID : " + basicParam.UserID);
                throw new FaultException(exceptionErrorMessage);
            }
            finally
            {
                if (dataReaderInfo != null && !dataReaderInfo.IsClosed)
                    dataReaderInfo.Close();
            }
        }

        private List<Maint_Taskstools> GetMaint_TasksToolsTable(Database db, BasicParam basicParam, int startRowIndex, int rowCount, string utcDateTime, ref int totalRowCount)
        {
            IDataReader dataReaderInfo = null;
            try
            {
                long utcTimestamp = 0;

                List<Maint_Taskstools> maintTaskstoolsInfoList = new List<Maint_Taskstools>();
                Maint_Taskstools maintTaskstoolsInfo = null;

                if (!string.IsNullOrEmpty(utcDateTime))
                {
                    //Convert UtcDateTime to TimeStamp(YYYYMMDDHHmmss)
                    utcTimestamp = Common.GetDateTimeFromUtc(utcDateTime);
                }

                dataReaderInfo = MaintenanceMobileAPIDAL.GetMaint_TasksToolsTable(db, basicParam.SiteID, startRowIndex, rowCount, utcTimestamp);
                while (dataReaderInfo.Read())
                {
                    maintTaskstoolsInfo = new Maint_Taskstools();
                    maintTaskstoolsInfo.FSITEID = Common.GetSafeInt32(dataReaderInfo, "FSITEID");
                    maintTaskstoolsInfo.FTASKTOOLSID = Common.GetSafeInt64(dataReaderInfo, "FTASKTOOLSID");
                    maintTaskstoolsInfo.FTOOLSID = Common.GetSafeInt64(dataReaderInfo, "FTOOLSID");
                    maintTaskstoolsInfo.FTASKGROUPID = Common.GetSafeInt64(dataReaderInfo, "FTASKGROUPID");
                    //   maintTaskstoolsInfo.FREF_TYPE = Common.GetSafeString(dataReaderInfo, "FREF_TYPE");
                    maintTaskstoolsInfo.FREFERENCEID = Common.GetSafeInt64(dataReaderInfo, "FREFERENCEID");
                    maintTaskstoolsInfo.FCREATEDON = Common.GetSafeInt32(dataReaderInfo, "FCREATEDON");
                    maintTaskstoolsInfo.FCREATEDTIME = Common.GetSafeInt32(dataReaderInfo, "FCREATEDTIME");
                    maintTaskstoolsInfo.FUPDATEDON = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDON");
                    maintTaskstoolsInfo.FUPDATEDTIME = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDTIME");
                    maintTaskstoolsInfo.FSTATUS = Convert.ToChar(Common.GetSafeChar(dataReaderInfo, "FSTATUS"));

                    if (totalRowCount == 0)
                        totalRowCount = Common.GetSafeInt32(dataReaderInfo, "FCOUNT");

                    maintTaskstoolsInfoList.Add(maintTaskstoolsInfo);
                }
                dataReaderInfo.Close();
                return maintTaskstoolsInfoList;
            }
            catch (Exception ex)
            {
                string exceptionErrorMessage = Common.GetErrorMessage(ex.Message);
                Common.LogException(ex, "VegamMaintenanceAPIService", "Error while getting maintenance tasks tools information ", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "SiteID : " + basicParam.SiteID + " ;UserID : " + basicParam.UserID);
                throw new FaultException(exceptionErrorMessage);
            }
            finally
            {
                if (dataReaderInfo != null && !dataReaderInfo.IsClosed)
                    dataReaderInfo.Close();
            }
        }

        private List<Maint_Tools> GetMaint_ToolsTable(Database db, BasicParam basicParam, int startRowIndex, int rowCount, string utcDateTime, ref int totalRowCount)
        {
            IDataReader dataReaderInfo = null;
            try
            {
                long utcTimestamp = 0;

                List<Maint_Tools> maintToolsInfoList = new List<Maint_Tools>();
                Maint_Tools maintToolsInfo = null;

                if (!string.IsNullOrEmpty(utcDateTime))
                {
                    //Convert UtcDateTime to TimeStamp(YYYYMMDDHHmmss)
                    utcTimestamp = Common.GetDateTimeFromUtc(utcDateTime);
                }

                dataReaderInfo = MaintenanceMobileAPIDAL.GetMaint_ToolsTable(db, basicParam.SiteID, startRowIndex, rowCount, utcTimestamp);
                while (dataReaderInfo.Read())
                {
                    maintToolsInfo = new Maint_Tools();
                    maintToolsInfo.FSITEID = Common.GetSafeInt32(dataReaderInfo, "FSITEID");
                    maintToolsInfo.FTOOLSID = Common.GetSafeInt64(dataReaderInfo, "FTOOLSID");
                    maintToolsInfo.FTOOLSDESC = Common.GetSafeString(dataReaderInfo, "FTOOLSDESC");
                    maintToolsInfo.FTOOLSIMAGENAME = Common.GetSafeString(dataReaderInfo, "FTOOLSIMAGENAME");
                    maintToolsInfo.FUPDATEDATE = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDATE");
                    maintToolsInfo.FSTATUS = Convert.ToChar(Common.GetSafeChar(dataReaderInfo, "FSTATUS"));

                    if (totalRowCount == 0)
                        totalRowCount = Common.GetSafeInt32(dataReaderInfo, "FCOUNT");

                    maintToolsInfoList.Add(maintToolsInfo);
                }
                dataReaderInfo.Close();
                return maintToolsInfoList;
            }
            catch (Exception ex)
            {
                string exceptionErrorMessage = Common.GetErrorMessage(ex.Message);
                Common.LogException(ex, "VegamMaintenanceAPIService", "Error while getting maintenance tools information ", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "SiteID : " + basicParam.SiteID + " ;UserID : " + basicParam.UserID);
                throw new FaultException(exceptionErrorMessage);
            }
            finally
            {
                if (dataReaderInfo != null && !dataReaderInfo.IsClosed)
                    dataReaderInfo.Close();
            }
        }

        private List<Maint_Workgroupuser> GetMaint_WorkGroupUserTable(Database db, BasicParam basicParam, int startRowIndex, int rowCount, string utcDateTime, ref int totalRowCount)
        {
            IDataReader dataReaderInfo = null;
            try
            {
                long utcTimestamp = 0;

                List<Maint_Workgroupuser> maintWorkgroupuserInfoList = new List<Maint_Workgroupuser>();
                Maint_Workgroupuser maintWorkgroupuserInfo = null;

                if (!string.IsNullOrEmpty(utcDateTime))
                {
                    //Convert UtcDateTime to TimeStamp(YYYYMMDDHHmmss)
                    utcTimestamp = Common.GetDateTimeFromUtc(utcDateTime);
                }

                dataReaderInfo = MaintenanceMobileAPIDAL.GetMaint_WorkGroupUserTable(db, basicParam.SiteID, startRowIndex, rowCount, utcTimestamp);
                while (dataReaderInfo.Read())
                {
                    maintWorkgroupuserInfo = new Maint_Workgroupuser();
                    maintWorkgroupuserInfo.FSITEID = Common.GetSafeInt32(dataReaderInfo, "FSITEID");
                    maintWorkgroupuserInfo.FWORKGROUPID = Common.GetSafeInt64(dataReaderInfo, "FWORKGROUPID");
                    maintWorkgroupuserInfo.FITEMID = Common.GetSafeInt32(dataReaderInfo, "FITEMID");
                    maintWorkgroupuserInfo.FUSERID = Common.GetSafeInt32(dataReaderInfo, "FUSERID");
                    maintWorkgroupuserInfo.FSCH_NOTIFY = Convert.ToChar(Common.GetSafeString(dataReaderInfo, "FSCH_NOTIFY"));
                    maintWorkgroupuserInfo.FWORKSTART_NOTIFY = Convert.ToChar(Common.GetSafeString(dataReaderInfo, "FWORKSTART_NOTIFY"));
                    maintWorkgroupuserInfo.FWORKFINISH_NOTIFY = Convert.ToChar(Common.GetSafeString(dataReaderInfo, "FWORKFINISH_NOTIFY"));
                    maintWorkgroupuserInfo.FREPORTISSUE_NOTIFY = Convert.ToChar(Common.GetSafeString(dataReaderInfo, "FREPORTISSUE_NOTIFY"));
                    maintWorkgroupuserInfo.FDOWNTIME_NOTIFY = Convert.ToChar(Common.GetSafeString(dataReaderInfo, "FDOWNTIME_NOTIFY"));
                    maintWorkgroupuserInfo.FUSERTYPE = Convert.ToChar(Common.GetSafeString(dataReaderInfo, "FUSERTYPE"));
                    maintWorkgroupuserInfo.FUPDATEDON = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDON");
                    maintWorkgroupuserInfo.FUPDATEDTIME = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDTIME");
                    maintWorkgroupuserInfo.FSTATUS = Convert.ToChar(Common.GetSafeChar(dataReaderInfo, "FSTATUS"));

                    if (totalRowCount == 0)
                        totalRowCount = Common.GetSafeInt32(dataReaderInfo, "FCOUNT");

                    maintWorkgroupuserInfoList.Add(maintWorkgroupuserInfo);
                }
                dataReaderInfo.Close();
                return maintWorkgroupuserInfoList;
            }
            catch (Exception ex)
            {
                string exceptionErrorMessage = Common.GetErrorMessage(ex.Message);
                Common.LogException(ex, "VegamMaintenanceAPIService", "Error while getting maintenance work group user information ", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "SiteID : " + basicParam.SiteID + " ;UserID : " + basicParam.UserID);
                throw new FaultException(exceptionErrorMessage);
            }
            finally
            {
                if (dataReaderInfo != null && !dataReaderInfo.IsClosed)
                    dataReaderInfo.Close();
            }
        }

        private List<Maint_Workorder> GetMaint_WorkOrderTable(Database db, BasicParam basicParam, int startRowIndex, int rowCount, string utcDateTime, ref int totalRowCount)
        {
            IDataReader dataReaderInfo = null;
            try
            {
                long utcTimestamp = 0;
                List<Maint_Workorder> maintWorkorderInfoList = new List<Maint_Workorder>();
                Maint_Workorder maintWorkorderInfo = null;

                if (!string.IsNullOrEmpty(utcDateTime))
                {
                    //Convert UtcDateTime to TimeStamp(YYYYMMDDHHmmss)
                    utcTimestamp = Common.GetDateTimeFromUtc(utcDateTime);
                }

                dataReaderInfo = MaintenanceMobileAPIDAL.GetMaint_WorkOrderTable(db, basicParam.SiteID, startRowIndex, rowCount, utcTimestamp);
                while (dataReaderInfo.Read())
                {
                    maintWorkorderInfo = new Maint_Workorder();
                    maintWorkorderInfo.FSITEID = Common.GetSafeInt32(dataReaderInfo, "FSITEID");
                    maintWorkorderInfo.FWORK_ORDERID = Common.GetSafeString(dataReaderInfo, "FWORK_ORDERID");
                    maintWorkorderInfo.FREF_SCHEDULE_DTL_ID = Common.GetSafeInt64(dataReaderInfo, "FREF_SCHEDULE_DTL_ID");
                    maintWorkorderInfo.FSCHEDULEDATE = Common.GetSafeInt32(dataReaderInfo, "FSCHEDULEDATE");
                    maintWorkorderInfo.FSCHEDULETIME = Common.GetSafeInt32(dataReaderInfo, "FSCHEDULETIME");
                    maintWorkorderInfo.FPLANNEDDATE = Common.GetSafeInt32(dataReaderInfo, "FPLANNEDDATE");
                    maintWorkorderInfo.FPLANNEDTIME = Common.GetSafeInt32(dataReaderInfo, "FPLANNEDTIME");
                    maintWorkorderInfo.FSTARTDATE = Common.GetSafeInt32(dataReaderInfo, "FSTARTDATE");
                    maintWorkorderInfo.FSTARTTIME = Common.GetSafeInt32(dataReaderInfo, "FSTARTTIME");
                    maintWorkorderInfo.FENDDATE = Common.GetSafeInt32(dataReaderInfo, "FENDDATE");
                    maintWorkorderInfo.FENDTIME = Common.GetSafeInt32(dataReaderInfo, "FENDTIME");
                    maintWorkorderInfo.FERP_WORKORDER = Common.GetSafeString(dataReaderInfo, "FERP_WORKORDER");
                    maintWorkorderInfo.FSTARTEDBY = Common.GetSafeInt32(dataReaderInfo, "FSTARTEDBY");
                    maintWorkorderInfo.FENDEDBY = Common.GetSafeInt32(dataReaderInfo, "FENDEDBY");
                    maintWorkorderInfo.FREF_SCHEDULEID = Common.GetSafeInt64(dataReaderInfo, "FREF_SCHEDULEID");
                    maintWorkorderInfo.FTASKGROUPID = Common.GetSafeInt64(dataReaderInfo, "FTASKGROUPID");
                    maintWorkorderInfo.FSCHEDULEDATE = Common.GetSafeInt32(dataReaderInfo, "FSCHEDULEDATE");
                    maintWorkorderInfo.FSCHEDULETIME = Common.GetSafeInt32(dataReaderInfo, "FSCHEDULETIME");
                    maintWorkorderInfo.FWORKORDERSTATUS = Common.GetSafeString(dataReaderInfo, "FWORKORDERSTATUS");
                    maintWorkorderInfo.FTIMETAKEN = Common.GetSafeDecimal(dataReaderInfo, "FTIMETAKEN");
                    maintWorkorderInfo.FTIMETAKENUNIT = Convert.ToChar(Common.GetSafeChar(dataReaderInfo, "FTIMETAKENUNIT"));
                    maintWorkorderInfo.FTIMECONFIRMEDBY = Common.GetSafeInt32(dataReaderInfo, "FTIMECONFIRMEDBY");
                    maintWorkorderInfo.FUPDATEDON = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDON");
                    maintWorkorderInfo.FUPDATEDTIME = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDTIME");

                    if (totalRowCount == 0)
                        totalRowCount = Common.GetSafeInt32(dataReaderInfo, "FCOUNT");

                    maintWorkorderInfoList.Add(maintWorkorderInfo);
                }
                dataReaderInfo.Close();
                return maintWorkorderInfoList;
            }
            catch (Exception ex)
            {
                string exceptionErrorMessage = Common.GetErrorMessage(ex.Message);
                Common.LogException(ex, "VegamMaintenanceAPIService", "Error while getting maintenance work order information ", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "SiteID : " + basicParam.SiteID + " ;UserID : " + basicParam.UserID);
                throw new FaultException(exceptionErrorMessage);
            }
            finally
            {
                if (dataReaderInfo != null && !dataReaderInfo.IsClosed)
                    dataReaderInfo.Close();
            }
        }

        private List<Maint_Workorder_Task> GetMaint_WorkOrderTaskTable(Database db, BasicParam basicParam, int startRowIndex, int rowCount, string utcDateTime, ref int totalRowCount)
        {
            IDataReader dataReaderInfo = null;
            try
            {
                long utcTimestamp = 0;

                List<Maint_Workorder_Task> maintWorkorderTaskInfoList = new List<Maint_Workorder_Task>();
                Maint_Workorder_Task maintWorkorderTaskInfo = null;

                if (!string.IsNullOrEmpty(utcDateTime))
                {
                    //Convert UtcDateTime to TimeStamp(YYYYMMDDHHmmss)
                    utcTimestamp = Common.GetDateTimeFromUtc(utcDateTime);
                }

                dataReaderInfo = MaintenanceMobileAPIDAL.GetMaint_WorkOrderTaskTable(db, basicParam.SiteID, startRowIndex, rowCount, utcTimestamp);
                while (dataReaderInfo.Read())
                {
                    maintWorkorderTaskInfo = new Maint_Workorder_Task();
                    maintWorkorderTaskInfo.FSITEID = Common.GetSafeInt32(dataReaderInfo, "FSITEID");
                    maintWorkorderTaskInfo.FWORK_ORDERID = Common.GetSafeString(dataReaderInfo, "FWORK_ORDERID");
                    maintWorkorderTaskInfo.FTASKID = Common.GetSafeInt64(dataReaderInfo, "FTASKID");
                    maintWorkorderTaskInfo.FREMARKS = Common.GetSafeString(dataReaderInfo, "FREMARKS");
                    maintWorkorderTaskInfo.FSTARTEDBY = Common.GetSafeInt64(dataReaderInfo, "FSTARTEDBY");
                    maintWorkorderTaskInfo.FSTARTDATE = Common.GetSafeInt32(dataReaderInfo, "FSTARTDATE");
                    maintWorkorderTaskInfo.FSTARTTIME = Common.GetSafeInt32(dataReaderInfo, "FSTARTTIME");
                    maintWorkorderTaskInfo.FENDEDBY = Common.GetSafeInt64(dataReaderInfo, "FENDEDBY");
                    maintWorkorderTaskInfo.FENDDATE = Common.GetSafeInt32(dataReaderInfo, "FENDDATE");
                    maintWorkorderTaskInfo.FENDTIME = Common.GetSafeInt32(dataReaderInfo, "FENDTIME");
                    maintWorkorderTaskInfo.FSEQUENCENUM = Common.GetSafeInt32(dataReaderInfo, "FSEQUENCENUM");
                    maintWorkorderTaskInfo.FISSAFETYCONFIRMED = Convert.ToChar(Common.GetSafeChar(dataReaderInfo, "FISSAFETYCONFIRMED"));
                    maintWorkorderTaskInfo.FISPPECONFIRMED = Convert.ToChar(Common.GetSafeChar(dataReaderInfo, "FISPPECONFIRMED"));
                    maintWorkorderTaskInfo.FCREATEDON = Common.GetSafeInt32(dataReaderInfo, "FCREATEDON");
                    maintWorkorderTaskInfo.FCREATEDTIME = Common.GetSafeInt32(dataReaderInfo, "FCREATEDTIME");
                    maintWorkorderTaskInfo.FUPDATEDON = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDON");
                    maintWorkorderTaskInfo.FUPDATEDTIME = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDTIME");

                    if (totalRowCount == 0)
                        totalRowCount = Common.GetSafeInt32(dataReaderInfo, "FCOUNT");

                    maintWorkorderTaskInfoList.Add(maintWorkorderTaskInfo);
                }
                dataReaderInfo.Close();
                return maintWorkorderTaskInfoList;
            }
            catch (Exception ex)
            {
                string exceptionErrorMessage = Common.GetErrorMessage(ex.Message);
                Common.LogException(ex, "VegamMaintenanceAPIService", "Error while getting maintenance work order task information ", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "SiteID : " + basicParam.SiteID + " ;UserID : " + basicParam.UserID);
                throw new FaultException(exceptionErrorMessage);
            }
            finally
            {
                if (dataReaderInfo != null && !dataReaderInfo.IsClosed)
                    dataReaderInfo.Close();
            }
        }

        private List<Maint_Workorder_Taskimg> GetMaint_WorkOrderTaskImgTable(Database db, BasicParam basicParam, int startRowIndex, int rowCount, string utcDateTime, ref int totalRowCount)
        {
            IDataReader dataReaderInfo = null;
            try
            {
                long utcTimestamp = 0;
                List<Maint_Workorder_Taskimg> maintWorkorderTaskimgInfoList = new List<Maint_Workorder_Taskimg>();
                Maint_Workorder_Taskimg maintWorkorderTaskimgInfo = null;

                if (!string.IsNullOrEmpty(utcDateTime))
                {
                    //Convert UtcDateTime to TimeStamp(YYYYMMDDHHmmss)
                    utcTimestamp = Common.GetDateTimeFromUtc(utcDateTime);
                }

                dataReaderInfo = MaintenanceMobileAPIDAL.GetMaint_WorkOrderTaskImgTable(db, basicParam.SiteID, startRowIndex, rowCount, utcTimestamp);
                while (dataReaderInfo.Read())
                {
                    maintWorkorderTaskimgInfo = new Maint_Workorder_Taskimg();
                    maintWorkorderTaskimgInfo.FSITEID = Common.GetSafeInt32(dataReaderInfo, "FSITEID");
                    maintWorkorderTaskimgInfo.FWORK_ORDERID = Common.GetSafeString(dataReaderInfo, "FWORK_ORDERID");
                    maintWorkorderTaskimgInfo.FTASKID = Common.GetSafeInt64(dataReaderInfo, "FTASKID");
                    maintWorkorderTaskimgInfo.FIMAGENAME = Common.GetSafeString(dataReaderInfo, "FIMAGENAME");
                    maintWorkorderTaskimgInfo.FIMAGEITEM = Common.GetSafeInt32(dataReaderInfo, "FIMAGEITEM");
                    maintWorkorderTaskimgInfo.FCREATEDON = Common.GetSafeInt32(dataReaderInfo, "FCREATEDON");
                    maintWorkorderTaskimgInfo.FCREATEDTIME = Common.GetSafeInt32(dataReaderInfo, "FCREATEDTIME");
                    maintWorkorderTaskimgInfo.FUPDATEDON = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDON");
                    maintWorkorderTaskimgInfo.FUPDATEDTIME = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDTIME");

                    if (totalRowCount == 0)
                        totalRowCount = Common.GetSafeInt32(dataReaderInfo, "FCOUNT");

                    maintWorkorderTaskimgInfoList.Add(maintWorkorderTaskimgInfo);
                }
                dataReaderInfo.Close();
                return maintWorkorderTaskimgInfoList;
            }
            catch (Exception ex)
            {
                string exceptionErrorMessage = Common.GetErrorMessage(ex.Message);
                Common.LogException(ex, "VegamMaintenanceAPIService", "Error while getting maintenance work order task image information ", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "SiteID : " + basicParam.SiteID + " ;UserID : " + basicParam.UserID);
                throw new FaultException(exceptionErrorMessage);
            }
            finally
            {
                if (dataReaderInfo != null && !dataReaderInfo.IsClosed)
                    dataReaderInfo.Close();
            }
        }

        private List<Maint_Workorder_Taskparam> GetMaint_WorkOrderTaskParamTable(Database db, BasicParam basicParam, int startRowIndex, int rowCount, string utcDateTime, ref int totalRowCount)
        {
            IDataReader dataReaderInfo = null;
            try
            {
                long utcTimestamp = 0;
                List<Maint_Workorder_Taskparam> maintWorkorderTaskparamInfoList = new List<Maint_Workorder_Taskparam>();
                Maint_Workorder_Taskparam maintWorkorderTaskparamInfo = null;

                if (!string.IsNullOrEmpty(utcDateTime))
                {
                    //Convert UtcDateTime to TimeStamp(YYYYMMDDHHmmss)
                    utcTimestamp = Common.GetDateTimeFromUtc(utcDateTime);
                }

                dataReaderInfo = MaintenanceMobileAPIDAL.GetMaint_WorkOrderTaskParamTable(db, basicParam.SiteID, startRowIndex, rowCount, utcTimestamp);
                while (dataReaderInfo.Read())
                {
                    maintWorkorderTaskparamInfo = new Maint_Workorder_Taskparam();
                    maintWorkorderTaskparamInfo.FSITEID = Common.GetSafeInt32(dataReaderInfo, "FSITEID");
                    maintWorkorderTaskparamInfo.FWORK_ORDERID = Common.GetSafeString(dataReaderInfo, "FWORK_ORDERID");
                    maintWorkorderTaskparamInfo.FTASKID = Common.GetSafeInt64(dataReaderInfo, "FTASKID");
                    maintWorkorderTaskparamInfo.FPARAMETERID = Common.GetSafeInt64(dataReaderInfo, "FPARAMETERID");
                    maintWorkorderTaskparamInfo.FVALUE = Common.GetSafeString(dataReaderInfo, "FVALUE");
                    maintWorkorderTaskparamInfo.FSELECTCODEITEM = Common.GetSafeInt32(dataReaderInfo, "FSELECTCODEITEM");
                    maintWorkorderTaskparamInfo.FRECORDEDDATE = Common.GetSafeInt32(dataReaderInfo, "FRECORDEDDATE");
                    maintWorkorderTaskparamInfo.FRECORDEDTIME = Common.GetSafeInt32(dataReaderInfo, "FRECORDEDTIME");
                    maintWorkorderTaskparamInfo.FRECORDEDBY = Common.GetSafeInt32(dataReaderInfo, "FRECORDEDBY");
                    maintWorkorderTaskparamInfo.FCREATEDON = Common.GetSafeInt32(dataReaderInfo, "FCREATEDON");
                    maintWorkorderTaskparamInfo.FCREATEDTIME = Common.GetSafeInt32(dataReaderInfo, "FCREATEDTIME");
                    maintWorkorderTaskparamInfo.FUPDATEDON = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDON");
                    maintWorkorderTaskparamInfo.FUPDATEDTIME = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDTIME");
                    maintWorkorderTaskparamInfo.FSTATUS = Convert.ToChar(Common.GetSafeChar(dataReaderInfo, "FSTATUS"));

                    if (totalRowCount == 0)
                        totalRowCount = Common.GetSafeInt32(dataReaderInfo, "FCOUNT");

                    maintWorkorderTaskparamInfoList.Add(maintWorkorderTaskparamInfo);
                }

                dataReaderInfo.Close();
                return maintWorkorderTaskparamInfoList;
            }
            catch (Exception ex)
            {
                string exceptionErrorMessage = Common.GetErrorMessage(ex.Message);
                Common.LogException(ex, "VegamMaintenanceAPIService", "Error while getting maintenance work order task parameter information ", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "SiteID : " + basicParam.SiteID + " ;UserID : " + basicParam.UserID);
                throw new FaultException(exceptionErrorMessage);
            }
            finally
            {
                if (dataReaderInfo != null && !dataReaderInfo.IsClosed)
                    dataReaderInfo.Close();
            }
        }

        private List<Maint_Reading_Result> GetMaint_ReadingResultTable(Database db, BasicParam basicParam, int startRowIndex, int rowCount, string utcDateTime, ref int totalRowCount)
        {
            IDataReader dataReaderInfo = null;
            try
            {
                long utcTimestamp = 0;

                List<Maint_Reading_Result> maintReadingResultInfoList = new List<Maint_Reading_Result>();
                Maint_Reading_Result maintReadingResultInfo = null;

                if (!string.IsNullOrEmpty(utcDateTime))
                {
                    //Convert UtcDateTime to TimeStamp(YYYYMMDDHHmmss)
                    utcTimestamp = Common.GetDateTimeFromUtc(utcDateTime);
                }

                dataReaderInfo = MaintenanceMobileAPIDAL.GetMaint_ReadingResultTable(db, basicParam.SiteID, startRowIndex, rowCount, utcTimestamp);
                while (dataReaderInfo.Read())
                {
                    maintReadingResultInfo = new Maint_Reading_Result();
                    maintReadingResultInfo.FREADINGID = Common.GetSafeInt64(dataReaderInfo, "FREADINGID");
                    maintReadingResultInfo.FSCHEDULEID = Common.GetSafeInt64(dataReaderInfo, "FSCHEDULEID");
                    maintReadingResultInfo.FWORK_ORDERID = Common.GetSafeString(dataReaderInfo, "FWORK_ORDERID");
                    maintReadingResultInfo.FMEASURINGPOINTID = Common.GetSafeInt64(dataReaderInfo, "FMEASURINGPOINTID");
                    maintReadingResultInfo.FRESULT = Common.GetSafeString(dataReaderInfo, "FRESULT");
                    maintReadingResultInfo.FSITEID = Common.GetSafeInt32(dataReaderInfo, "FSITEID");
                    maintReadingResultInfo.FCREATEDBY = Common.GetSafeInt32(dataReaderInfo, "FCREATEDBY");
                    maintReadingResultInfo.FCREATEDDATE = Common.GetSafeInt32(dataReaderInfo, "FCREATEDDATE");
                    maintReadingResultInfo.FCREATEDTIME = Common.GetSafeInt32(dataReaderInfo, "FCREATEDTIME");
                    maintReadingResultInfo.FUPDATEDBY = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDBY");
                    maintReadingResultInfo.FUPDATEDON = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDON");
                    maintReadingResultInfo.FUPDATEDTIME = Common.GetSafeInt32(dataReaderInfo, "FUPDATEDTIME");
                    maintReadingResultInfo.FSTATUS = Convert.ToChar(Common.GetSafeString(dataReaderInfo, "FSTATUS"));

                    if (totalRowCount == 0)
                        totalRowCount = Common.GetSafeInt32(dataReaderInfo, "FCOUNT");

                    maintReadingResultInfoList.Add(maintReadingResultInfo);
                }
                dataReaderInfo.Close();
                return maintReadingResultInfoList;
            }
            catch (Exception ex)
            {
                string exceptionErrorMessage = Common.GetErrorMessage(ex.Message);
                Common.LogException(ex, "VegamMaintenanceAPIService", "Error while getting maintenance reading result information ", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "SiteID : " + basicParam.SiteID + " ;UserID : " + basicParam.UserID);
                throw new FaultException(exceptionErrorMessage);
            }
            finally
            {
                if (dataReaderInfo != null && !dataReaderInfo.IsClosed)
                    dataReaderInfo.Close();
            }
        }

        #endregion

        #region User LogIn Info

        public UserAccessInfo GetUserAccessInfo(int userID, int currentSiteID)
		{
			UserAccessInfo userAccessInfo = new UserAccessInfo();
			if (userID>0)
			{
				IDataReader dataReaderUserInfo = null;
				try
				{
					Database db = DatabaseFactory.CreateDatabase("ApplicationConnection");
					SiteInfo siteInfo = null;
					bool defaultSiteSetted = false;
					dataReaderUserInfo = MaintenanceMobileAPIDAL.GetCurrentUserSiteInfoByUserID(db, userID);
					while (dataReaderUserInfo.Read())
					{
						siteInfo = new SiteInfo();
						int siteID = Common.GetSafeInt32(dataReaderUserInfo, "FSITEID");
						int defaultSiteID = Common.GetSafeInt32(dataReaderUserInfo, "FDEFAULTSITE");
						int regDefaultSiteID = Common.GetSafeInt32(dataReaderUserInfo, "FREGDEFAULTSITEID");

						if (defaultSiteID > 0 && defaultSiteID == siteID)
						{
							siteInfo.IsDefaultSite = true;
							defaultSiteSetted = true;
						}
						else if (regDefaultSiteID > 0 && regDefaultSiteID == siteID && defaultSiteID == 0)
						{
							siteInfo.IsDefaultSite = true;
							defaultSiteSetted = true;
						}

						else if ((siteID == currentSiteID || currentSiteID == 0) && defaultSiteID == 0 && regDefaultSiteID == 0 && !defaultSiteSetted)
						{
							siteInfo.IsDefaultSite = true;
							defaultSiteSetted = true;
						}
						else
							siteInfo.IsDefaultSite = false;

						siteInfo.SiteID = siteID;
						userAccessInfo.SiteInfoList.Add(siteInfo);//Adding site level info
					}
					dataReaderUserInfo.Close();

					if (userAccessInfo.SiteInfoList.Count > 1)
					{
						userAccessInfo.IsMultiSiteUser = true;
					}

					//userAccessInfo.AccessLevel = currentUserInfo.AccessLevel.ToString();
					userAccessInfo.Status = true;
					userAccessInfo.StatusCode = 1; //Valid user
					userAccessInfo.UserID = userID;
					
				}
				catch (Exception)
				{
					throw;
				}
				finally
				{
					if (dataReaderUserInfo != null && !dataReaderUserInfo.IsClosed)
						dataReaderUserInfo.Close();
				}
			}
			else
			{
				userAccessInfo.IsMultiSiteUser = false;
				userAccessInfo.UserID = 0;
				userAccessInfo.StatusCode = -2;//userID is zero
				userAccessInfo.Status = false;
			}

			return userAccessInfo;
		}

		#endregion

        #region SyncIn Maintenance Table Data Info
        public dynamic SyncInMaintenanceTableInfo(SyncInInfo syncInInfo)
        {
            try
            {
                Database db = DatabaseFactory.CreateDatabase("ApplicationConnection");
                dynamic tableDataSyncInResultInfo = null;

                string serializeData = syncInInfo.serializeData;

                BasicParam basicParam = new BasicParam();
                basicParam.SiteID = syncInInfo.SiteID;
                basicParam.UserID = syncInInfo.UserID;

                switch (syncInInfo.syncOutParam)
                {
                    case SyncOutParams.SyncOut_Readings:
                        tableDataSyncInResultInfo = SyncIn_MaintReadingResultTableData(db, basicParam, serializeData);
                        break;
                    case SyncOutParams.SyncOut_Workorder:
                        tableDataSyncInResultInfo = SyncIn_MaintWorkOrderTableData(db, basicParam, serializeData);
                        break;
                    case SyncOutParams.SyncOut_Notification:
                        tableDataSyncInResultInfo = SyncIn_MaintNotificationTableData(db, basicParam, serializeData);
                        break;
                }

                return tableDataSyncInResultInfo;
            }
            catch (Exception ex)
            {
                string exceptionErrorMessage = Common.GetErrorMessage(ex.Message);
                Common.LogException(ex, "VegamMaintenanceAPIService", "Error while SyncIn maintenance table data information ", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "SiteID : " + syncInInfo.SiteID + " ;UserID : " + syncInInfo.UserID);
                throw new FaultException(exceptionErrorMessage);
            }
        }

        private dynamic SyncIn_MaintReadingResultTableData(Database db, BasicParam basicParam, string serializeData)
        {
            try
            {
                List<SyncIn_Maint_Reading_Result> responseSyncInListInfo = new List<SyncIn_Maint_Reading_Result>();
                SyncIn_Maint_Reading_Result responseSyncInReadingResult = null;

                int createdOn = 0;
                int createdTime = 0;
                Common.GetCurrentSiteDateTime(db, basicParam.SiteID, ref createdOn, ref createdTime);

                List<SyncIn_Maint_Reading_Result> syncInTableDataInfo = JsonConvert.DeserializeObject<List<SyncIn_Maint_Reading_Result>>(serializeData);

                if (syncInTableDataInfo != null && syncInTableDataInfo.Count > 0)
                {
                    DbTransaction transaction = null;
                    using (DbConnection connection = db.CreateConnection())
                    {
                        connection.Open();

                        try
                        {
                            foreach (SyncIn_Maint_Reading_Result readingResultInfo in syncInTableDataInfo)
                            {
                                transaction = connection.BeginTransaction();
                                var transactionCompeted = false;

                                responseSyncInReadingResult = new SyncIn_Maint_Reading_Result();

                                try
                                {
                                    if (readingResultInfo != null)
                                    {
                                        //Insert into LDB1_MAINT_READING_RESULT Table
                                        if (readingResultInfo.FREADINGID < 0 && readingResultInfo.FLOCALUPDATE == "I")
                                        {
                                            int newReadingID = MaintenanceMobileAPIDAL.CheckMaintReadingResultExist(db, transaction, readingResultInfo.FSITEID, readingResultInfo.FREADINGID, readingResultInfo.FMOB_SYNC_IDENTIFIER, false);

                                            if (newReadingID == 0)
                                            {
                                                readingResultInfo.FNEWID = (MaintenanceMobileAPIDAL.InsertMaintReadingResultInfo(db, transaction, readingResultInfo.FSITEID, readingResultInfo.FSCHEDULEID,
                                                    readingResultInfo.FWORK_ORDERID, readingResultInfo.FMEASURINGPOINTID, readingResultInfo.FRESULT, readingResultInfo.FSTATUS, readingResultInfo.FCREATEDBY,
                                                    readingResultInfo.FCREATEDDATE, readingResultInfo.FCREATEDTIME, readingResultInfo.FUPDATEDBY, readingResultInfo.FUPDATEDON, readingResultInfo.FUPDATEDTIME,
                                                    readingResultInfo.FMOB_SYNC_IDENTIFIER)).ToString();

                                                readingResultInfo.FRESPONSE = Convert.ToChar(ResponseType.SUCCESS).ToString();

                                                transactionCompeted = true;
                                            }
                                            else
                                            {
                                                transactionCompeted = false;
                                                readingResultInfo.FNEWID = newReadingID.ToString();
                                                readingResultInfo.FRESPONSE = Convert.ToChar(ResponseType.SUCCESS).ToString();
                                            }
                                        }
                                        else if (readingResultInfo.FREADINGID > 0 && readingResultInfo.FLOCALUPDATE == "U")
                                        {
                                            if (MaintenanceMobileAPIDAL.CheckMaintReadingResultExist(db, transaction, readingResultInfo.FSITEID, readingResultInfo.FREADINGID, readingResultInfo.FMOB_SYNC_IDENTIFIER, true) > 0)
                                            {
                                                MaintenanceMobileAPIDAL.UpdateMaintReadingResultInfo(db, transaction, readingResultInfo.FSITEID, readingResultInfo.FREADINGID, readingResultInfo.FSCHEDULEID,
                                                readingResultInfo.FWORK_ORDERID, readingResultInfo.FMEASURINGPOINTID, readingResultInfo.FRESULT, readingResultInfo.FSTATUS, readingResultInfo.FUPDATEDBY,
                                                readingResultInfo.FCREATEDDATE, readingResultInfo.FCREATEDTIME, readingResultInfo.FUPDATEDBY, readingResultInfo.FUPDATEDON, readingResultInfo.FUPDATEDTIME,
                                                readingResultInfo.FMOB_SYNC_IDENTIFIER);

                                                readingResultInfo.FNEWID = (readingResultInfo.FREADINGID).ToString();
                                                readingResultInfo.FRESPONSE = Convert.ToChar(ResponseType.SUCCESS).ToString();

                                                transactionCompeted = true;
                                            }
                                            else
                                            {
                                                transactionCompeted = false;
                                                readingResultInfo.FNEWID = (readingResultInfo.FREADINGID).ToString();
                                                readingResultInfo.FRESPONSE = Convert.ToChar(ResponseType.SUCCESS).ToString();
                                            }
                                        }
                                        else
                                        {
                                            transactionCompeted = false;
                                            readingResultInfo.FNEWID = "0";
                                            readingResultInfo.FRESPONSE = Convert.ToChar(ResponseType.FAIL).ToString();
                                        }


                                        foreach (SyncIn_Maint_Workorder_Taskimg workOrderImgInfo in readingResultInfo.WorkOrderTaskImgList)
                                        {

                                            //once reading result insert successfully then insert mapped images record
                                            if (Convert.ToInt64(readingResultInfo.FNEWID) > 0 && workOrderImgInfo.FLOCALUPDATE == "I")
                                            {

                                                if (!MaintenanceMobileAPIDAL.CheckWorkOrderTaskImageExist(db, transaction, workOrderImgInfo.FSITEID, workOrderImgInfo.FMOB_SYNC_IDENTIFIER))
                                                {
                                                    MaintenanceDAL.InsertWorkOrderTaskImage(db, transaction, workOrderImgInfo.FSITEID, workOrderImgInfo.FWORK_ORDERID, workOrderImgInfo.FTASKID,
                                                        workOrderImgInfo.FIMAGEITEM, workOrderImgInfo.FIMAGENAME, workOrderImgInfo.FCREATEDON, workOrderImgInfo.FCREATEDTIME, workOrderImgInfo.FUPDATEDON,
                                                        workOrderImgInfo.FUPDATEDTIME, workOrderImgInfo.FMOB_SYNC_IDENTIFIER);

                                                    workOrderImgInfo.FRESPONSE = Convert.ToChar(ResponseType.SUCCESS).ToString();
                                                }
                                                else
                                                {
                                                    transactionCompeted = true;
                                                    workOrderImgInfo.FRESPONSE = Convert.ToChar(ResponseType.FAIL).ToString();
                                                }

                                            }
                                            else
                                            {
                                                transactionCompeted = false;
                                                workOrderImgInfo.FRESPONSE = Convert.ToChar(ResponseType.FAIL).ToString();
                                            }

                                        }

                                        if (transactionCompeted)
                                        {
                                            #region Log Information
                                            //Log Information
                                            string description = Language_Resources.Maintenance_LogInformations_Resource.readingResultInfoSuccess.Replace("[XXX]", readingResultInfo.FSCHEDULEID.ToString()).Replace("[YYY]", readingResultInfo.FWORK_ORDERID.ToString()).Replace("[ZZZ]", readingResultInfo.FMEASURINGPOINTID.ToString());
                                            string descInEnglish = "Successfully inserted reading result info for schedule ID : " + readingResultInfo.FSCHEDULEID + " ,workorder ID : " + readingResultInfo.FWORK_ORDERID + " and measuring point ID : " + readingResultInfo.FMEASURINGPOINTID;
                                            CommonDAL.InsertLogInformation(db, transaction, basicParam.SiteID, LogTypes.Reading_Result_Info.ToString(), description, descInEnglish, basicParam.UserID, createdOn, createdTime);
                                            #endregion
                                        }

                                        transaction.Commit();
                                    }
                                }
                                catch (Exception ex)
                                {
                                    transactionCompeted = false;

                                    if (readingResultInfo != null && readingResultInfo.FRESPONSE == string.Empty)
                                    {
                                        readingResultInfo.FNEWID = "0";
                                        readingResultInfo.FRESPONSE = Convert.ToChar(ResponseType.FAIL).ToString();
                                    }

                                    //set response=false for all records,if any record failed.
                                    if (readingResultInfo.WorkOrderTaskImgList != null && readingResultInfo.WorkOrderTaskImgList.Count > 0)
                                    {
                                        readingResultInfo.WorkOrderTaskImgList.ForEach(x => x.FRESPONSE = Convert.ToChar(ResponseType.FAIL).ToString());
                                    }

                                    if (transaction != null)
                                        transaction.Rollback();


                                    continue;

                                }
                                finally
                                {
                                    responseSyncInReadingResult.FREADINGID = readingResultInfo.FREADINGID;
                                    responseSyncInReadingResult.FSITEID = readingResultInfo.FSITEID;
                                    responseSyncInReadingResult.FSCHEDULEID = readingResultInfo.FSCHEDULEID;
                                    responseSyncInReadingResult.FWORK_ORDERID = readingResultInfo.FWORK_ORDERID;
                                    responseSyncInReadingResult.FMEASURINGPOINTID = readingResultInfo.FMEASURINGPOINTID;
                                    responseSyncInReadingResult.FMOB_SYNC_IDENTIFIER = readingResultInfo.FMOB_SYNC_IDENTIFIER;
                                    responseSyncInReadingResult.FNEWID = readingResultInfo.FNEWID;
                                    responseSyncInReadingResult.FRESULT = readingResultInfo.FRESULT;
                                    responseSyncInReadingResult.FSTATUS = readingResultInfo.FSTATUS;
                                    responseSyncInReadingResult.FCREATEDBY = readingResultInfo.FCREATEDBY;
                                    responseSyncInReadingResult.FCREATEDDATE = readingResultInfo.FCREATEDDATE;
                                    responseSyncInReadingResult.FCREATEDTIME = readingResultInfo.FCREATEDTIME;
                                    responseSyncInReadingResult.FUPDATEDBY = readingResultInfo.FUPDATEDBY;
                                    responseSyncInReadingResult.FUPDATEDON = readingResultInfo.FUPDATEDON;
                                    responseSyncInReadingResult.FUPDATEDTIME = readingResultInfo.FUPDATEDTIME;
                                    responseSyncInReadingResult.FRESPONSE = readingResultInfo.FRESPONSE;
                                    responseSyncInReadingResult.FLOCALUPDATE = readingResultInfo.FLOCALUPDATE;
                                    responseSyncInReadingResult.WorkOrderTaskImgList = readingResultInfo.WorkOrderTaskImgList;
                                    responseSyncInListInfo.Add(responseSyncInReadingResult);
                                }

                            }

                        }
                        catch (Exception)
                        {
                            throw;
                        }
                        finally
                        {
                            connection.Close();
                        }
                    }
                }

                if (responseSyncInListInfo != null && responseSyncInListInfo.Count > 0)
                    return JsonConvert.SerializeObject(responseSyncInListInfo);
                else
                    return string.Empty;

            }
            catch (Exception ex)
            {

                string exceptionErrorMessage = Common.GetErrorMessage(ex.Message);
                Common.LogException(ex, "VegamMaintenanceAPIService", "Error while SyncIn MAINT_READING_RESULT table data information ", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "SiteID : " + basicParam.SiteID + " ;UserID : " + basicParam.UserID);
                throw new FaultException(exceptionErrorMessage);
            }
        }

        private dynamic SyncIn_MaintWorkOrderTableData(Database db, BasicParam basicParam, string serializeData)
        {
            List<SyncIn_Maint_Workorder> workOrderInfoList = new List<SyncIn_Maint_Workorder>();
            try
            {
                int createdOn = 0;
                int createdTime = 0;

                if (serializeData != null && serializeData.Length > 0)
                {
                    workOrderInfoList = JsonConvert.DeserializeObject<List<SyncIn_Maint_Workorder>>(serializeData);

                    if (workOrderInfoList != null && workOrderInfoList.Count > 0)
                    {
                        Common.GetCurrentSiteDateTime(db, basicParam.SiteID, ref createdOn, ref createdTime);
                        DbTransaction transaction = null;
                        using (DbConnection dbConnection = db.CreateConnection())
                        {
                            dbConnection.Open();

                            try
                            {
                                foreach (SyncIn_Maint_Workorder workOrderInfo in workOrderInfoList)
                                {
                                    bool transSuccess = false;
                                    try
                                    {
                                        transaction = dbConnection.BeginTransaction();

                                        MaintenanceMobileAPIDAL.UpdateWorkOrderInfo(db, transaction, basicParam.SiteID, workOrderInfo.FWORK_ORDERID, workOrderInfo.FSTARTDATE,
                                            workOrderInfo.FSTARTTIME, workOrderInfo.FSTARTEDBY, workOrderInfo.FENDDATE, workOrderInfo.FENDTIME, workOrderInfo.FENDEDBY, workOrderInfo.FWORKORDERSTATUS,
                                           Convert.ToInt32(workOrderInfo.FTASKGROUPID), workOrderInfo.FTIMETAKEN, workOrderInfo.FTIMETAKENUNIT, workOrderInfo.FTIMECONFIRMEDBY, workOrderInfo.FUPDATEDON, workOrderInfo.FUPDATEDTIME);

                                        foreach (SyncIn_Maint_Workorder_Task taskInfo in workOrderInfo.WorkOrderTask)
                                        {
                                            if (MaintenanceMobileAPIDAL.CheckIfWorkOrderTaskExists(db, transaction, basicParam.SiteID, workOrderInfo.FWORK_ORDERID, Convert.ToInt32(taskInfo.FTASKID)))
                                            {
                                                MaintenanceMobileAPIDAL.UpdateTaskInfo(db, transaction, basicParam.SiteID, workOrderInfo.FWORK_ORDERID, Convert.ToInt32(taskInfo.FTASKID), taskInfo.FSEQUENCENUM, taskInfo.FREMARKS,
                                                    taskInfo.FISSAFETYCONFIRMED, taskInfo.FISPPECONFIRMED, taskInfo.FSTARTDATE, taskInfo.FSTARTTIME, Convert.ToInt32(taskInfo.FSTARTEDBY), taskInfo.FENDDATE, taskInfo.FENDTIME, Convert.ToInt32(taskInfo.FENDEDBY)
                                                    , taskInfo.FUPDATEDON, taskInfo.FUPDATEDTIME, taskInfo.FCREATEDON, taskInfo.FCREATEDTIME);
                                            }
                                            else
                                            {
                                                MaintenanceMobileAPIDAL.InsertTaskInfo(db, transaction, basicParam.SiteID, workOrderInfo.FWORK_ORDERID, Convert.ToInt32(taskInfo.FTASKID), taskInfo.FSEQUENCENUM, taskInfo.FREMARKS, taskInfo.FISSAFETYCONFIRMED, taskInfo.FISPPECONFIRMED
                                                    , taskInfo.FSTARTDATE, taskInfo.FSTARTTIME, Convert.ToInt32(taskInfo.FSTARTEDBY), taskInfo.FENDDATE, taskInfo.FENDTIME, Convert.ToInt32(taskInfo.FENDEDBY), taskInfo.FCREATEDON, taskInfo.FCREATEDTIME, taskInfo.FUPDATEDON, taskInfo.FUPDATEDTIME);
                                            }

                                            foreach (SyncIn_Maint_Workorder_Taskparam parameterInfo in taskInfo.WorkOrderTaskParam)
                                            {
                                                string status = string.Empty;
                                                if (MaintenanceMobileAPIDAL.CheckIfWorkOrderTaskParameterInfo(db, transaction, basicParam.SiteID, workOrderInfo.FWORK_ORDERID, Convert.ToInt32(taskInfo.FTASKID), Convert.ToInt32(parameterInfo.FPARAMETERID)))
                                                {
                                                    MaintenanceMobileAPIDAL.UpdateWorkOrderTaskParameterInfo(db, transaction, basicParam.SiteID, workOrderInfo.FWORK_ORDERID, Convert.ToInt32(taskInfo.FTASKID), Convert.ToInt32(parameterInfo.FPARAMETERID), parameterInfo.FVALUE, parameterInfo.FSELECTCODEITEM
                                                        , parameterInfo.FSTATUS, parameterInfo.FRECORDEDBY, parameterInfo.FRECORDEDDATE, parameterInfo.FRECORDEDTIME, parameterInfo.FCREATEDON, parameterInfo.FCREATEDTIME, parameterInfo.FUPDATEDON, parameterInfo.FUPDATEDTIME);
                                                }
                                                else
                                                {
                                                    MaintenanceDAL.InsertTaskParameterValue(db, transaction, basicParam.SiteID, workOrderInfo.FWORK_ORDERID, Convert.ToInt32(taskInfo.FTASKID), Convert.ToInt32(parameterInfo.FPARAMETERID), parameterInfo.FVALUE, parameterInfo.FSELECTCODEITEM
                                                        , parameterInfo.FSTATUS, parameterInfo.FRECORDEDBY, parameterInfo.FRECORDEDDATE, parameterInfo.FRECORDEDTIME, parameterInfo.FCREATEDON, parameterInfo.FCREATEDTIME, parameterInfo.FUPDATEDON, parameterInfo.FUPDATEDTIME);
                                                }
                                            }

                                            foreach (SyncIn_Maint_Workorder_Taskimg taskImageInfo in taskInfo.WorkOrderTaskImgList)
                                            {
                                                MaintenanceDAL.InsertWorkOrderTaskImage(db, transaction, basicParam.SiteID, workOrderInfo.FWORK_ORDERID, taskInfo.FTASKID, taskImageInfo.FIMAGEITEM, taskImageInfo.FIMAGENAME
                                                    , taskImageInfo.FCREATEDON, taskImageInfo.FCREATEDTIME, taskImageInfo.FUPDATEDON, taskImageInfo.FUPDATEDTIME, string.Empty);
                                            }
                                        }

                                        foreach (SyncIn_Maint_WorkOrder_Sparepart sparePartInfo in workOrderInfo.WorkOrderSparePart)
                                        {
                                            if (MaintenanceDAL.CheckWorkOrderSparePartExists(db, transaction, basicParam.SiteID, workOrderInfo.FWORK_ORDERID, sparePartInfo.FIDHID))
                                            {
                                                MaintenanceDAL.UpdateWorkOrderSparePart(db, transaction, basicParam.SiteID, workOrderInfo.FWORK_ORDERID, sparePartInfo.FIDHID, sparePartInfo.FREQUIREDQTY, sparePartInfo.FACTUALQUANTITY, sparePartInfo.FUPDATEDBY, sparePartInfo.FUPDATEDON, sparePartInfo.FUPDATEDTIME);
                                            }
                                            else
                                            {
                                                MaintenanceDAL.InsertWorkOrderSparePart(db, transaction, basicParam.SiteID, workOrderInfo.FWORK_ORDERID, sparePartInfo.FIDHID, sparePartInfo.FREQUIREDQTY, sparePartInfo.FACTUALQUANTITY, sparePartInfo.FCREATEDBY, sparePartInfo.FCREATEDON, sparePartInfo.FCREATEDTIME, sparePartInfo.FUPDATEDBY, sparePartInfo.FUPDATEDON, sparePartInfo.FUPDATEDTIME);
                                            }
                                        }
                                        transaction.Commit();
                                        transSuccess = true;
                                    }
                                    catch(Exception ex)
                                    {
                                        transaction.Rollback();
                                        transSuccess = false;
                                    }
                                    finally
                                    {
                                        var operationStatus = Convert.ToChar(ResponseType.SUCCESS).ToString();
                                        if (!transSuccess)
                                        {
                                            operationStatus = Convert.ToChar(ResponseType.FAIL).ToString();
                                        }
                                        workOrderInfo.FRESPONSE = operationStatus;
                                    }
                                }
                            }
                            catch (Exception ex)
                            {
                                throw ex;
                            }
                            finally
                            {
                                dbConnection.Close();
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                workOrderInfoList.ForEach(x => x.FRESPONSE = ResponseType.FAIL.ToString());
                string exceptionErrorMessage = Common.GetErrorMessage(ex.Message);
                Common.LogException(ex, "VegamMaintenanceAPIService", "Error while SyncIn MAINT_WORKORDER table data information ", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "SiteID : " + basicParam.SiteID + " ;UserID : " + basicParam.UserID);
                //throw new FaultException(exceptionErrorMessage);
            }

            var returnString = JsonConvert.SerializeObject(workOrderInfoList);

            return returnString;
        }

        private dynamic SyncIn_MaintNotificationTableData(Database db, BasicParam basicParam, string serializeData)
        {
            List<SyncIn_Maint_Schedule> syncInTableDataInfo = new List<SyncIn_Maint_Schedule>();
            try
            {
                int createdOn = 0;
                int createdTime = 0;
                Common.GetCurrentSiteDateTime(db, basicParam.SiteID, ref createdOn, ref createdTime);

                syncInTableDataInfo = JsonConvert.DeserializeObject<List<SyncIn_Maint_Schedule>>(serializeData);

                if (syncInTableDataInfo != null && syncInTableDataInfo.Count > 0)
                {
                    DbTransaction transaction = null;
                    using (DbConnection connection = db.CreateConnection())
                    {
                        connection.Open();
                        try
                        {
                            foreach (SyncIn_Maint_Schedule maintScheduleInfo in syncInTableDataInfo)
                            {
                                transaction = connection.BeginTransaction();
                                var transactionCompeted = false;
                                
                                try
                                {
                                    if (maintScheduleInfo != null)
                                    {
                                        if (maintScheduleInfo.FSCHEDULEID < 0 && maintScheduleInfo.FLOCALUPDATE == "I")
                                        {
                                            //Insert Notification info
                                            int notificationID = MaintenanceDAL.GetNextNotificationID(db);

                                            MaintenanceDAL.InsertNotificationInfo(db, transaction, notificationID, maintScheduleInfo.FSITEID, maintScheduleInfo.FMAINTENANCENAME,
                                                maintScheduleInfo.FMAINDESCRIPTION, (char)ScheduleType.Notification, maintScheduleInfo.FPRIORITYTYPE, Convert.ToInt32(maintScheduleInfo.FLOCATIONID),
                                                Convert.ToInt32(maintScheduleInfo.FEQUIPMENTID), Convert.ToInt32(maintScheduleInfo.FNOTIFY_TYPEID), maintScheduleInfo.FCREATEDBY, maintScheduleInfo.FCREATEDON, maintScheduleInfo.FCREATEDTIME,
                                                maintScheduleInfo.FUPDATEDBY, maintScheduleInfo.FUPDATEDON, maintScheduleInfo.FUPDATEDTIME, maintScheduleInfo.FSCHEDULESTATUS, maintScheduleInfo.FREQUESTED_ENDDATE);

                                            maintScheduleInfo.FNEWID = notificationID.ToString();
                                            maintScheduleInfo.FRESPONSE = Convert.ToChar(ResponseType.SUCCESS).ToString();
                                        }
                                        else if (maintScheduleInfo.FSCHEDULEID > 0 && maintScheduleInfo.FLOCALUPDATE == "U")
                                        {
                                            //Update Notification info
                                            MaintenanceDAL.UpdateMaintenanceInfo(db, transaction, maintScheduleInfo.FSITEID, Convert.ToInt32(maintScheduleInfo.FSCHEDULEID), maintScheduleInfo.FMAINTENANCENAME,
                                                maintScheduleInfo.FMAINDESCRIPTION, (char)ScheduleType.Notification, 0, maintScheduleInfo.FPRIORITYTYPE, Convert.ToInt32(maintScheduleInfo.FLOCATIONID),
                                                Convert.ToInt32(maintScheduleInfo.FEQUIPMENTID), Convert.ToInt32(maintScheduleInfo.FWORKGROUPID), Convert.ToInt32(maintScheduleInfo.FNOTIFY_TYPEID), maintScheduleInfo.FREMARKS,
                                                maintScheduleInfo.FUPDATEDBY, maintScheduleInfo.FUPDATEDON, maintScheduleInfo.FUPDATEDTIME, maintScheduleInfo.FREQUESTED_ENDDATE);

                                            maintScheduleInfo.FNEWID = maintScheduleInfo.FSCHEDULEID.ToString();
                                            maintScheduleInfo.FRESPONSE = Convert.ToChar(ResponseType.SUCCESS).ToString();
                                        }
                                        else
                                        {
                                            transactionCompeted = false;
                                            maintScheduleInfo.FNEWID = "0";
                                            maintScheduleInfo.FRESPONSE = Convert.ToChar(ResponseType.FAIL).ToString();
                                        }

                                        if (transactionCompeted)
                                        {
                                            #region Log Information
                                            //Log Information
                                            string description = Language_Resources.Maintenance_LogInformations_Resource.notificationInfoSuccess.Replace("[XXX]", maintScheduleInfo.FSCHEDULEID.ToString());
                                            string descInEnglish = "Successfully inserted notification info for schedule ID : " + maintScheduleInfo.FSCHEDULEID;
                                            CommonDAL.InsertLogInformation(db, transaction, basicParam.SiteID, LogTypes.Notification_Info.ToString(), description, descInEnglish, basicParam.UserID, createdOn, createdTime);
                                            #endregion
                                        }

                                        transaction.Commit();
                                    }
                                }
                                catch (Exception)
                                {
                                    transactionCompeted = false;
                                    maintScheduleInfo.FNEWID = "0";
                                    maintScheduleInfo.FRESPONSE = Convert.ToChar(ResponseType.FAIL).ToString();

                                    if (transaction != null)
                                        transaction.Rollback();

                                    continue;
                                }
                                finally
                                {

                                }

                            }
                        }
                        catch (Exception)
                        {
                            throw;
                        }
                        finally
                        {
                            connection.Close();
                        }
                    }
                }

            }
            catch (Exception ex)
            {
                string exceptionErrorMessage = Common.GetErrorMessage(ex.Message);
                Common.LogException(ex, "VegamMaintenanceAPIService", "Error while SyncIn MAINT_SCHEDULE table data information ", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "SiteID : " + basicParam.SiteID + " ;UserID : " + basicParam.UserID);
                throw new FaultException(exceptionErrorMessage);
            }

            var returnString = JsonConvert.SerializeObject(syncInTableDataInfo);
            return returnString;
        }

        #endregion

        #region Mobile Notification -Info
        //Notification Type
        public MasterDataList GetMaintMasterData(BasicParam basicParam, MasterDataFilterInfo masterDataFilterInfo)
        {
            try
            {
                MaintenanceService maintenanceService = new MaintenanceService();
                return maintenanceService.GetMaintMasterData(basicParam, masterDataFilterInfo);
            }
            catch (Exception ex)
            {
                string exceptionErrorMessage = Common.GetErrorMessage(ex.Message);
                Common.LogException(ex, "VegamMaintenanceAPIService", "Error while getting notification/priority type info ", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "SiteID : " + basicParam.SiteID + " ;UserID : " + basicParam.UserID);
                throw new FaultException(exceptionErrorMessage);
            }
        }

        //Priority Type
        public List<EnumTypeInfo> GetEnumInfoList(BasicParam basicParam, string enumType)
        {
            try
            {
                MaintenanceService mainenanceService = new MaintenanceService();
                return mainenanceService.GetEnumInfoList(basicParam, enumType);
            }
            catch (Exception ex)
            {
                string exceptionErrorMessage = Common.GetErrorMessage(ex.Message);
                Common.LogException(ex, "VegamMaintenanceAPIService", "Error while fetching enum type info for : " + enumType, "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "SiteID:" + basicParam.SiteID + ",UserID:" + basicParam.UserID);
                throw new FaultException(exceptionErrorMessage);
            }
        }

        //Autocomplete Equipment/FLocation Info
        public List<EquipmentFLocInfo> GetAllEquipmentFLocation(EquipmentFLocFilterInfo equipmentFilterInfo)
        {
            IDataReader dataReaderEquipmentInfo = null;
            try
            {
                Database db = DatabaseFactory.CreateDatabase("ApplicationConnection");

                bool restrictAccess = true;

                List<EquipmentFLocInfo> equipmentFLocInfoList = new List<EquipmentFLocInfo>();
                EquipmentFLocInfo equipmenFLocInfo = null;

                int accessLevelID = Common.GetUserAccessLevelID(db, equipmentFilterInfo.UserID);

                if (accessLevelID != 5)
                {
                    restrictAccess = false;
                }

                dataReaderEquipmentInfo = MaintenanceMobileAPIDAL.GetAllEquipmentFLocation(db, equipmentFilterInfo.SiteID, equipmentFilterInfo.SearchEquipmentName, equipmentFilterInfo.EquipmentFLocCode, equipmentFilterInfo.UserID, restrictAccess);
                while (dataReaderEquipmentInfo.Read())
                {
                    equipmenFLocInfo = new EquipmentFLocInfo();
                    equipmenFLocInfo.EquipmentID = Common.GetSafeInt32(dataReaderEquipmentInfo, "FLOCEQUIPMENTID");
                    equipmenFLocInfo.EquipmentCode = Common.GetSafeString(dataReaderEquipmentInfo, "FEQUIPMENTCODE");
                    equipmenFLocInfo.EquipmentName = Common.GetSafeString(dataReaderEquipmentInfo, "FEQUIPMENTNAME");
                    equipmenFLocInfo.ParentType = Convert.ToChar(Common.GetSafeString(dataReaderEquipmentInfo, "FPARENTTYPE"));
                    equipmentFLocInfoList.Add(equipmenFLocInfo);
                }
                dataReaderEquipmentInfo.Close();

                return equipmentFLocInfoList;
            }
            catch (Exception ex)
            {
                string exceptionErrorMessage = Common.GetErrorMessage(ex.Message);
                Common.LogException(ex, "MaintenanceService", "Error while getting equipment/functional location info ", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "SiteID : " + equipmentFilterInfo.SiteID + " ;UserID : " + equipmentFilterInfo.UserID);
                throw new FaultException(exceptionErrorMessage);
            }
            finally
            {
                if (dataReaderEquipmentInfo != null && !dataReaderEquipmentInfo.IsClosed)
                    dataReaderEquipmentInfo.Close();
            }
        }

        public List<NotificationInfo> GetNotificationListInfo(BasicParam basicParam)
        {
            IDataReader dataReaderNotificationInfo = null;
            try
            {
                Database db = DatabaseFactory.CreateDatabase("ApplicationConnection");

                bool restrictAccess = true;
                SiteDateTimeFormatInfo siteDateTimeFormatInfo = Common.GetSiteDateTimeFormatInfo(db, basicParam.SiteID);

                List<NotificationInfo> notificationInfoList = new List<NotificationInfo>();
                NotificationInfo notificationInfo = null;

                int accessLevelID = Common.GetUserAccessLevelID(db, basicParam.UserID);

                if (accessLevelID != 5)
                {
                    restrictAccess = false;
                }

                dataReaderNotificationInfo = MaintenanceMobileAPIDAL.GetAllNotificationInfo(db, basicParam.SiteID, basicParam.UserID, restrictAccess);
                while (dataReaderNotificationInfo.Read())
                {
                    notificationInfo = new NotificationInfo();
                    notificationInfo.NotificationID = Common.GetSafeInt32(dataReaderNotificationInfo, "FSCHEDULEID");
                    notificationInfo.NotificationName = Common.GetSafeString(dataReaderNotificationInfo, "FMAINTENANCENAME");
                    notificationInfo.NotificationStatus = SetNotificationStatus(Common.GetSafeString(dataReaderNotificationInfo, "FSCHEDULESTATUS").Trim());
                    notificationInfo.FLocationID = Common.GetSafeInt32(dataReaderNotificationInfo, "FLOCATIONID");
                    notificationInfo.EquipmentID = Common.GetSafeInt32(dataReaderNotificationInfo, "FEQUIPMENTID");
                    notificationInfo.FLocationName = Common.GetSafeString(dataReaderNotificationInfo, "FLOCATIONNAME");
                    notificationInfo.EquipmentName = Common.GetSafeString(dataReaderNotificationInfo, "FEQUIPMENTNAME");
                    notificationInfo.NotificationTypeID = Common.GetSafeInt32(dataReaderNotificationInfo, "FNOTIFY_TYPEID");
                    notificationInfo.PriorityValue = Common.GetSafeString(dataReaderNotificationInfo, "FPRIORITYTYPE");
                    notificationInfo.NotificationType = Common.GetSafeString(dataReaderNotificationInfo, "FNOTIFY_TYPE");
                    notificationInfo.Priority = Common.GetSafeString(dataReaderNotificationInfo, "FPRIORITY");
                    notificationInfo.Description = Common.GetSafeString(dataReaderNotificationInfo, "FMAINDESCRIPTION");
                    notificationInfo.WorkOrderNumber = Common.GetSafeString(dataReaderNotificationInfo, "FNOTIFYWORKORDERID");
                    notificationInfo.RequestedEndDate = Common.GetSafeInt32(dataReaderNotificationInfo, "FREQUESTED_ENDDATE");
                    notificationInfo.CreatedOn = Common.GetDateFormat(Common.GetSafeInt32(dataReaderNotificationInfo, "FCREATEDON"), siteDateTimeFormatInfo.DateFormat);
                    notificationInfo.CreatedBy = Common.GetSafeString(dataReaderNotificationInfo, "FCREATEDUSERNAME");

                    notificationInfoList.Add(notificationInfo);
                }
                dataReaderNotificationInfo.Close();

                return notificationInfoList;
            }
            catch (Exception ex)
            {
                string exceptionErrorMessage = Common.GetErrorMessage(ex.Message);
                Common.LogException(ex, "MaintenanceService", "Error while getting notification info for list ", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "SiteID : " + basicParam.SiteID + " ;UserID : " + basicParam.UserID);
                throw new FaultException(exceptionErrorMessage);
            }
            finally
            {
                if (dataReaderNotificationInfo != null && !dataReaderNotificationInfo.IsClosed)
                    dataReaderNotificationInfo.Close();
            }
        }

        public NotificationInfo GetNotificationEditInfo(BasicParam basicParam, int notificationID)
        {
            try
            {
                MaintenanceService maintenanceService = new MaintenanceService();
                return maintenanceService.GetNotificationInfo(basicParam, notificationID);
            }
            catch (Exception ex)
            {
                string exceptionErrorMessage = Common.GetErrorMessage(ex.Message);
                Common.LogException(ex, "VegamMaintenanceAPIService", "Error while getting notification info for edit ", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "SiteID : " + basicParam.SiteID + " ;UserID : " + basicParam.UserID);
                throw new FaultException(exceptionErrorMessage);
            }
        }

        public int InsertUpdateNotificationInfo(BasicParam basicParam, NotificationInfo notificationInfo)
        {
            try
            {
                MaintenanceService maintenanceService = new MaintenanceService();
                return maintenanceService.InsertUpdateNotificationInfo(basicParam, notificationInfo);
            }
            catch (Exception ex)
            {
                string exceptionErrorMessage = Common.GetErrorMessage(ex.Message);
                Common.LogException(ex, "VegamMaintenanceAPIService", "Error while inserting notification info ", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "SiteID : " + basicParam.SiteID + " ;UserID : " + basicParam.UserID);
                throw new FaultException(exceptionErrorMessage);
            }
        }

        public List<DocumentInfo> GetAttachmentDetailsForNotification(BasicParam basicParam, int notificationID)
        {
            try
            {
                MaintenanceService maintenanceService = new MaintenanceService();
                return maintenanceService.GetAttachmentDetailsForNotification(basicParam, notificationID);
            }
            catch (Exception ex)
            {
                Common.LogException(ex, "VegamMaintenanceAPIService", "Error while fetching attachment details for notification", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "SiteID: " + basicParam.SiteID + ";UserID: " + basicParam.UserID);
                throw new FaultException(ex.Message);
            }
        }
        
        private NotificationStatus? SetNotificationStatus(string status)
        {
            try
            {
                MaintenanceService maintenanceService = new MaintenanceService();
                return maintenanceService.SetNotificationStatus(status);
            }
            catch (Exception)
            {
                throw;
            }
        }

        //Delete Document Info
        public int DeleteDocumentsAndImagesInfo(BasicParam basicParam, int documentID)
        {
            try
            {
                MaintenanceService maintenanceService = new MaintenanceService();
                return maintenanceService.DeleteDocumentsAndImagesInfo(basicParam, documentID);
            }
            catch (Exception ex)
            {
                Common.LogException(ex, "VegamMaintenanceAPIService", "Error while deleting attachment of notification", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "SiteID: " + basicParam.SiteID + ";UserID: " + basicParam.UserID);
                throw new FaultException(ex.Message);
            }
        }

        //Insert Attachment Notification Info
        public int InsertDocumentsAndImagesInfo(DocumentFilterInfo documentFilterInfo)
        {
            try
            {
                MaintenanceService maintenanceService = new MaintenanceService();
                return maintenanceService.InsertDocumentsAndImagesInfo(documentFilterInfo);
            }
            catch (Exception ex)
            {
                Common.LogException(ex, "VegamMaintenanceAPIService", "Error while inserting attachment info for notification", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "SiteID: " + documentFilterInfo.SiteID + ";UserID: " + documentFilterInfo.UserID);
                throw new FaultException(ex.Message);
            }
        }

        #endregion

        #region App Details Info

        public AppDetailsInfo GetAppDetailsInfo(string appName)
        {
            IDataReader dataReaderAppDetailInfo = null;
            try
            {
                Database db = DatabaseFactory.CreateDatabase("ApplicationConnection");
                AppDetailsInfo appDetailsInfo = null;

                dataReaderAppDetailInfo = MaintenanceMobileAPIDAL.GetAppDetailsInfo(db, appName);
                if (dataReaderAppDetailInfo.Read())
                {
                    appDetailsInfo = new AppDetailsInfo();
                    appDetailsInfo.VegamAppID = Common.GetSafeInt32(dataReaderAppDetailInfo, "FVEGAMAPPID");
                    appDetailsInfo.VegamAppName = Common.GetSafeString(dataReaderAppDetailInfo, "FAPPNAME");
                    appDetailsInfo.VegamAppVersion = Common.GetSafeString(dataReaderAppDetailInfo, "FAPPVERSION");
                    appDetailsInfo.ReleasedNumber = Common.GetSafeInt32(dataReaderAppDetailInfo, "FRELEASENUMBER");
                    appDetailsInfo.UpdateType = Convert.ToChar(Common.GetSafeString(dataReaderAppDetailInfo, "FUPDATETYPE"));
                    appDetailsInfo.CreatedOn = Common.GetSafeInt32(dataReaderAppDetailInfo, "FCREATEDON");
                    appDetailsInfo.CreatedTime = Common.GetSafeInt32(dataReaderAppDetailInfo, "FCREATEDTIME");
                    appDetailsInfo.Remarks = Common.GetSafeString(dataReaderAppDetailInfo, "FREMARKS");
                }
                dataReaderAppDetailInfo.Close();

                return appDetailsInfo;
            }
            catch (Exception ex)
            {
                string exceptionErrorMessage = Common.GetErrorMessage(ex.Message);
                Common.LogException(ex, "VegamMaintenanceAPIService", "Error while getting app information ", "Vegam_MaintenanceService", System.Reflection.MethodBase.GetCurrentMethod().Name, "APP Name : " + appName.ToString());
                throw new FaultException(exceptionErrorMessage);
            }
            finally
            {
                if (dataReaderAppDetailInfo != null && !dataReaderAppDetailInfo.IsClosed)
                    dataReaderAppDetailInfo.Close();
            }

        }

        #endregion

        #endregion
    }
}
