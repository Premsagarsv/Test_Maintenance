using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace Vegam_MaintenanceService
{
    #region Maintenance-Mobile
    [DataContract]
    [KnownType(typeof(UserInfo))]
    [KnownType(typeof(UserRole))]
    [KnownType(typeof(Maint_Locations))]
    [KnownType(typeof(Maint_Equipment))]
    [KnownType(typeof(Maint_MeasuringPoint))]
    [KnownType(typeof(Maint_Documents))]
    [KnownType(typeof(Maint_Master))]
    [KnownType(typeof(Maint_Meas_Docs))]
    [KnownType(typeof(ProductionLineResource))]
    [KnownType(typeof(Plantppe))]
    [KnownType(typeof(Maint_Schedule))]
    [KnownType(typeof(Maint_Schedule_Dtl))]
    [KnownType(typeof(Maint_Selgrp_Code))]
    [KnownType(typeof(Maint_Support))]
    [KnownType(typeof(Maint_Taskgroup))]
    [KnownType(typeof(Maint_Tasks))]
    [KnownType(typeof(Maint_Tasksparam))]
    [KnownType(typeof(Maint_Tasksppe))]
    [KnownType(typeof(Maint_Taskstools))]
    [KnownType(typeof(Maint_Tools))]
    [KnownType(typeof(Maint_Workgroupuser))]
    [KnownType(typeof(Maint_Workorder))]
    [KnownType(typeof(Maint_Workorder_Task))]
    [KnownType(typeof(Maint_Workorder_Taskimg))]
    [KnownType(typeof(Maint_Workorder_Taskparam))]
    [KnownType(typeof(Maint_Workorder_Taskppe))]
    [KnownType(typeof(SiteDateTimeInfo))]
    [KnownType(typeof(EnumType))]
    [KnownType(typeof(Maint_Auth_Group))]
	[KnownType(typeof(SensorType_UOM))]
	[KnownType(typeof(Sensor_Type))]
	[KnownType(typeof(Maint_Schedule_Spareparts))]
	[KnownType(typeof(Maint_WorkOrder_Sparepart))]
    [KnownType(typeof(Maint_Reading_Result))]
    [KnownType(typeof(PlantMaterial))]
	public class TableDetailInfo
    {
        #region Private Fields
        private int _totalCount = 0;
        private dynamic _tableDetails = null;
        #endregion

        #region Properties
        [DataMember]
        public dynamic TableDetails
        {
            get { return _tableDetails; }
            set { _tableDetails = value; }

        }
        [DataMember]
        public int TotalCount
        {
            get { return _totalCount; }
            set { _totalCount = value; }
        }
        #endregion
    }


    [DataContract]
    public class TableDetailsFilterInfo : BasicParam
    {
        #region Properties
        [DataMember]
        public string TableName { get; set; }
        [DataMember]
        public int StartRowIndex { get; set; }
        [DataMember]
        public int RowCount { get; set; }
        [DataMember]
        public string UtcDateTime { get; set; }
        [DataMember]
        public string FilterType { get; set; }
        #endregion
    }

    [DataContract]
    public class ScanEquipmentInfo
    {
        #region Properties
        [DataMember]
        public int EquipmentID { get; set; }
        [DataMember]
        public string EquipmentCode { get; set; }
        [DataMember]
        public string EquipmentName { get; set; }
        [DataMember]
        public string Description { get; set; }
        [DataMember]
        public string FLocationName { get; set; }
        [DataMember]
        public string Type { get; set; }
        [DataMember]
        public string ClassName { get; set; }
        [DataMember]
        public string ModelName { get; set; }
        [DataMember]
        public string ModelNumber { get; set; }
        [DataMember]
        public string Manufacturer { get; set; }
        [DataMember]
        public string SerialNumber { get; set; }
        [DataMember]
        public InfoType InfoType { get; set; }
        [DataMember]
        public string ImagePath { get; set; }
        #endregion
    }

    [DataContract]
    public class MeasuringPointsInfo
    {
        #region Properties
        [DataMember]
        public int MeasuringPointID { get; set; }
        [DataMember]
        public string MeasuringPointName { get; set; }
        [DataMember]
        public string MeasuringPointCode { get; set; }
        [DataMember]
        public string ReadingValue { get; set; }
        [DataMember]
        public string ReadingDate { get; set; }
        [DataMember]
        public string OperatorBy { get; set; }
        [DataMember]
        public string ImagePath { get; set; }
        #endregion
    }

    #region User LogIn Info
    [DataContract]
    public class UserAccessInfo
    {
        private List<SiteInfo> _siteInfoList = new List<SiteInfo>();

        #region Properties
        [DataMember]
        public List<SiteInfo> SiteInfoList
        {
            get { return _siteInfoList; }
            set { _siteInfoList = value; }
        }

        [DataMember]
        public int UserID { get; set; }
        [DataMember]
        public bool Status { get; set; }
        [DataMember]
        public int StatusCode { get; set; }
        [DataMember]
        public bool IsMultiSiteUser { get; set; }
        #endregion
    }

    [DataContract]
    public class SiteInfo
    {
        #region Properties
        [DataMember]
        public int SiteID { get; set; }
        [DataMember]
        public bool IsDefaultSite { get; set; }
        #endregion

    }

    /*AccessLevel
    //COMPANY_LEVEL = 1,
    //REGIONAL_LEVEL = 2,
    //COUNTRY_LEVEL = 3, 
    //PLANT_MANAGER_LEVEL = 4,
    //PLANT_LEVEL = 5,
    //PORTAL_ADMIN = 6*/

    #endregion

    #region Maintenance Master Data
    [DataContract]
    public class UserInfo
    {
        #region Properties
        [DataMember]
        public int FUSERID { get; set; }
        [DataMember]
        public string FUSERNAME { get; set; }
        [DataMember]
        public string FPASSWORD { get; set; }
        [DataMember]
        public string FFIRSTNAME { get; set; }
        [DataMember]
        public string FLASTNAME { get; set; }
        [DataMember]
        public int FACCESSLEVELID { get; set; }
        [DataMember]
        public int FLANGUAGEID { get; set; }
        [DataMember]
        public string FSALTKEYVALUE { get; set; }
        [DataMember]
        public int FUPDATEDATE { get; set; }
        [DataMember]
        public char FSTATUS { get; set; }
        [DataMember]
        public int FSITEID { get; set; }

        #endregion
    }

    [DataContract]
    public class UserRole
    {
        #region Properties
        [DataMember]
        public int FUSERID { get; set; }
        [DataMember]
        public int FROLEID { get; set; }
        [DataMember]
        public int FSITEID { get; set; }
        #endregion
    }

    [DataContract]
    public class Maint_Locations
    {
        #region Properties
        [DataMember]
        public long FLOCATIONID { get; set; }
        [DataMember]
        public int FSITEID { get; set; }
        [DataMember]
        public string FLOCATIONNAME { get; set; }
        [DataMember]
        public string FLOCATIONDESC { get; set; }
        [DataMember]
        public int FPARENTLOCATIONID { get; set; }
        [DataMember]
        public string FIMAGENAME { get; set; }
        [DataMember]
        public int FUPDATEDON { get; set; }
        [DataMember]
        public int FUPDATEDTIME { get; set; }
        [DataMember]
        public char FSTATUS { get; set; }
        [DataMember]
        public string FLOCATIONCODE { get; set; }
        #endregion
    }

    [DataContract]
    public class Maint_Equipment
    {
        #region Properties
        [DataMember]
        public long FEQUIPMENTID { get; set; }
        [DataMember]
        public int FSITEID { get; set; }
        [DataMember]
        public string FEQUIPMENTCODE { get; set; }
        [DataMember]
        public string FEQUIPMENTNAME { get; set; }
        [DataMember]
        public string FDESCRIPTION { get; set; }
        [DataMember]
        public long FMANUFID { get; set; }
        [DataMember]
        public int FCATEGORYID { get; set; }
        [DataMember]
        public int FCLASSID { get; set; }
        [DataMember]
        public string FIMAGENAME { get; set; }
        [DataMember]
        public char FINFOTYPE { get; set; }
        [DataMember]
        public long FLOCATIONID { get; set; }
        [DataMember]
        public long FRESOURCEID { get; set; }
        [DataMember]
        public long FMODELREFERENCEID { get; set; }
        [DataMember]
        public string FMODELNUMBER { get; set; }
        [DataMember]
        public string FSERIALNUMBER { get; set; }
        [DataMember]
        public string FWARRANTYNUMBER { get; set; }
        [DataMember]
        public int FWARRANTYSTARTDATE { get; set; }
        [DataMember]
        public int FWARRANTYEXPIREDDATE { get; set; }
        [DataMember]
        public int FPURCHASEDATE { get; set; }
        [DataMember]
        public int FINSTALLDATE { get; set; }
        [DataMember]
        public int FUPDATEDON { get; set; }
        [DataMember]
        public int FUPDATEDTIME { get; set; }
        [DataMember]
        public long FPARENTEQUIPMENTID { get; set; }
        [DataMember]
        public char FSTATUS { get; set; }

        #endregion

    }

    [DataContract]
    public class Maint_MeasuringPoint
    {
        #region Properties
        [DataMember]
        public long FMEASURINGPOINTID { get; set; }
        [DataMember]
        public int FSITEID { get; set; }
        [DataMember]
        public string FMEASURINGPOINTCODE { get; set; }
        [DataMember]
        public string FMEASURINGPOINTNAME { get; set; }
        [DataMember]
        public string FDESCRIPTION { get; set; }
        [DataMember]
        public string FPOSITION { get; set; }
        [DataMember]
        public long FCATEGORYID { get; set; }
        [DataMember]
        public int FSENSORTYPEUOMID { get; set; }
        [DataMember]
        public string FIMAGENAME { get; set; }
        [DataMember]
        public char FREADINGTYPE { get; set; }
        [DataMember]
        public long FDECIMALPLACES { get; set; }
        [DataMember]
        public decimal FLOWERLIMIT { get; set; }
        [DataMember]
        public decimal FUPPERLIMIT { get; set; }
        [DataMember]
        public decimal FLOWERLIMITWARNING { get; set; }
        [DataMember]
        public decimal FUPPERLIMITWARNING { get; set; }
        [DataMember]
        public int FMAXTEXTLENGTH { get; set; }
        [DataMember]
        public long FGROUPID { get; set; }
        [DataMember]
        public long FPARENTID { get; set; }
        [DataMember]
        public char FPARENTTYPE { get; set; }
        [DataMember]
        public char FISCOUNTER { get; set; }
        [DataMember]
        public string FOPCTAGID { get; set; }
        [DataMember]
        public int FUUID { get; set; }
        [DataMember]
        public int FUPDATEDON { get; set; }
        [DataMember]
        public int FUPDATEDTIME { get; set; }
        [DataMember]
        public char FSTATUS { get; set; }
        #endregion
    }

    [DataContract]
    public class Maint_Documents
    {
        #region Properties
        [DataMember]
        public long FDOCUMENTID { get; set; }
        [DataMember]
        public int FSITEID { get; set; }
        [DataMember]
        public long FREFERENCEID { get; set; }
        [DataMember]
        public char FDOCUMENTTYPE { get; set; }
        [DataMember]
        public string FDOCUMENTNAME { get; set; }
        [DataMember]
        public int FUPDATEDON { get; set; }
        [DataMember]
        public int FUPDATEDTIME { get; set; }
        [DataMember]
        public string FREF_TYPE { get; set; }
        [DataMember]
        public char FSTATUS { get; set; }
        #endregion
    }

    [DataContract]
    public class Maint_Master
    {
        #region Properties
        [DataMember]
        public long FMASTERID { get; set; }
        [DataMember]
        public int FSITEID { get; set; }
        [DataMember]
        public string FNAME { get; set; }
        [DataMember]
        public string FDESCRIPTION { get; set; }
        [DataMember]
        public string FTYPE { get; set; }
        [DataMember]
        public int FUPDATEDON { get; set; }
        [DataMember]
        public int FUPDATEDTIME { get; set; }
        [DataMember]
        public char FSTATUS { get; set; }
        #endregion
    }

    [DataContract]
    public class Maint_Meas_Docs
    {
        #region Properties
        [DataMember]
        public long FSCHEDULEID { get; set; }
        [DataMember]
        public int FSITEID { get; set; }
        [DataMember]
        public long FITEMID { get; set; }
        [DataMember]
        public long FMEASURINGPOINTID { get; set; }
        [DataMember]
        public int FUPDATEDON { get; set; }
        [DataMember]
        public int FUPDATEDTIME { get; set; }
        #endregion
    }

    [DataContract]
    public class ProductionLineResource
    {
        #region Properties
        [DataMember]
        public long FRESOURCEID { get; set; }
        [DataMember]
        public int FSITEID { get; set; }
        [DataMember]
        public long FPLINEID { get; set; }
        [DataMember]
        public string FRESOURCECODE { get; set; }
        [DataMember]
        public string FRESOURCEDESC { get; set; }
        [DataMember]
        public char FTYPE { get; set; }
        [DataMember]
        public int FUPDATEDATE { get; set; }
        [DataMember]
        public char FSTATUS { get; set; }
        #endregion
    }

    [DataContract]
    public class Plantppe
    {
        #region Properties
        [DataMember]
        public long FPPEID { get; set; }
        [DataMember]
        public int FSITEID { get; set; }
        [DataMember]
        public string FPPEDESC { get; set; }
        [DataMember]
        public string FPPEIMAGENAME { get; set; }
        [DataMember]
        public int FUPDATEDATE { get; set; }
        [DataMember]
        public char FSTATUS { get; set; }
        #endregion
    }
    #endregion

    #region Schedule/Work orders
    [DataContract]
    public class Maint_Schedule
    {
        #region Properties
        [DataMember]
        public int FSITEID { get; set; }
        [DataMember]
        public long FSCHEDULEID { get; set; }
        [DataMember]
        public string FMAINTENANCENAME { get; set; }
        [DataMember]
        public string FMAINDESCRIPTION { get; set; }
        [DataMember]
        public char FSCHEDULE_TYPE { get; set; }
        [DataMember]
        public long FMAINTYPEID { get; set; }

        [DataMember]
        public long FLOCATIONID { get; set; }
        [DataMember]
        public long FEQUIPMENTID { get; set; }
        [DataMember]
        public long FWORKGROUPID { get; set; }
        [DataMember]
        public string FSCHD_RULE_DESC { get; set; }
        [DataMember]
        public string FSCHEDULESTATUS { get; set; }
        [DataMember]
        public long FTASKGROUPIDENTIFIER { get; set; }
        [DataMember]
        public int FSCHD_RULE_DESC_TYPE { get; set; }
        [DataMember]
        public int FCREATEDBY { get; set; }
        [DataMember]
        public int FCREATEDON { get; set; }
        [DataMember]
        public int FCREATEDTIME { get; set; }
        [DataMember]
        public int FUPDATEDBY { get; set; }
        [DataMember]
        public int FUPDATEDON { get; set; }
        [DataMember]
        public int FUPDATEDTIME { get; set; }
        [DataMember]
        public char FSTATUS { get; set; }
        [DataMember]
        public string FPRIORITYTYPE { get; set; }
        [DataMember]
        public string FNOTIFY_WORK_ORDERID { get; set; }
        [DataMember]
        public long FNOTIFY_TYPEID { get; set; }
        [DataMember]
        public string FREMARKS { get; set; }
        [DataMember]
        public int FREQUESTED_ENDDATE { get; set; }
        #endregion
    }

    [DataContract]
    public class Maint_Schedule_Dtl
    {
        #region Properties
        [DataMember]
        public int FSITEID { get; set; }
        [DataMember]
        public long FSCHEDULE_DTL_ID { get; set; }
        [DataMember]
        public long FSCHEDULEID { get; set; }
        [DataMember]
        public int FITEM_ID { get; set; }
        [DataMember]
        public string FFREQUENCY { get; set; }
        [DataMember]
        public int FINTERVAL { get; set; }
        [DataMember]
        public int FSTARTDATE { get; set; }
        [DataMember]
        public int FSTARTTIME { get; set; }
        [DataMember]
        public int FENDDATE { get; set; }
        [DataMember]
        public int FENDNUM_OCCURENCE { get; set; }
        [DataMember]
        public string FWEEK_DAY { get; set; }
        [DataMember]
        public int FMONTH_OPTION { get; set; }
        [DataMember]
        public string FMONTH_DAY { get; set; }
        [DataMember]
        public string FMONTH_POSITION { get; set; }
        [DataMember]
        public int FYEAR_OPTION { get; set; }
        [DataMember]
        public string FYEAR_MONTH { get; set; }
        [DataMember]
        public int FNOTIFYDAY { get; set; }
        [DataMember]
        public char FBASEDONPERFDATE { get; set; }
        [DataMember]
        public int FUPDATEDON { get; set; }
        [DataMember]
        public int FUPDATEDTIME { get; set; }
        [DataMember]
        public char FSTATUS { get; set; }
        #endregion
    }

    [DataContract]
    public class Maint_Selgrp_Code
    {
        #region Properties
        [DataMember]
        public long FMASTERID { get; set; }
        [DataMember]
        public int FITEMID { get; set; }
        [DataMember]
        public string FDISPLAYNAME { get; set; }
        [DataMember]
        public int FSITEID { get; set; }
        [DataMember]
        public int FUPDATEDON { get; set; }
        [DataMember]
        public int FUPDATEDTIME { get; set; }
        [DataMember]
        public char FSTATUS { get; set; }

        #endregion
    }

    [DataContract]
    public class Maint_Support
    {
        #region Properties
        [DataMember]
        public long FSUPPORTID { get; set; }
        [DataMember]
        public long FEQUIPMENTID { get; set; }
        [DataMember]
        public string FSUPPORTNAME { get; set; }
        [DataMember]
        public string FSUPPORTNUMBER { get; set; }
        [DataMember]
        public string FSUPPORTEMAILID { get; set; }
        [DataMember]
        public char FSUPPORTTYPE { get; set; }
        [DataMember]
        public int FUPDATEDON { get; set; }
        [DataMember]
        public int FUPDATEDTIME { get; set; }
        [DataMember]
        public char FSTATUS { get; set; }
        [DataMember]
        public int FSITEID { get; set; }
        #endregion
    }

    [DataContract]
    public class Maint_Taskgroup
    {
        #region Properties
        [DataMember]
        public int FSITEID { get; set; }
        [DataMember]
        public long FTASKGROUPID { get; set; }
        [DataMember]
        public string FTASKGROUPNAME { get; set; }
        [DataMember]
        public long FTASKGROUPTYPEID { get; set; }
        [DataMember]
        public int FVERSION { get; set; }
        [DataMember]
        public string FREF_TYPE { get; set; }
        [DataMember]
        public long FIDENTIFIER { get; set; }
        [DataMember]
        public int FUPDATEDON { get; set; }
        [DataMember]
        public int FUPDATEDTIME { get; set; }
        [DataMember]
        public char FSTATUS { get; set; }
        #endregion
    }

    [DataContract]
    public class Maint_Tasks
    {
        #region Properties
        [DataMember]
        public int FSITEID { get; set; }
        [DataMember]
        public long FTASKID { get; set; }
        [DataMember]
        public long FREFERENCEID { get; set; }
        [DataMember]
        public string FTASKNAME { get; set; }
        [DataMember]
        public string FDESCRIPTION { get; set; }
        [DataMember]
        public string FSAFETYDESCRIPTION { get; set; }
        [DataMember]
        public long FESTIMATEDTIME { get; set; }
        [DataMember]
        public char FUNIT { get; set; }
        [DataMember]
        public char FREMARKENABLED { get; set; }
        [DataMember]
        public char FREMARKMANDATORY { get; set; }
        [DataMember]
        public char FPICTUREENABLED { get; set; }
        [DataMember]
        public char FPICTUREMANDATORY { get; set; }
        [DataMember]
        public int FSEQUENCENUM { get; set; }
        [DataMember]
        public int FUPDATEDON { get; set; }
        [DataMember]
        public int FUPDATEDTIME { get; set; }
        [DataMember]
        public char FSTATUS { get; set; }
        #endregion
    }

    [DataContract]
    public class Maint_Tasksparam
    {
        #region Properties
        [DataMember]
        public int FSITEID { get; set; }
        [DataMember]
        public long FPARAMETERID { get; set; }
        [DataMember]
        public long FTASKGROUPID { get; set; }
        [DataMember]
        public long FREFERENCEID { get; set; }
        [DataMember]
        public string FPARAMNAME { get; set; }
        [DataMember]
        public char FISMANDATORY { get; set; }
        [DataMember]
        public char FTYPE { get; set; }
        [DataMember]
        public long FSELECTIONGROUPID { get; set; }
        [DataMember]
        public int FUPDATEDON { get; set; }
        [DataMember]
        public int FUPDATEDTIME { get; set; }
        [DataMember]
        public char FSTATUS { get; set; }
        #endregion
    }

    [DataContract]
    public class Maint_Tasksppe
    {
        #region Properties
        [DataMember]
        public int FSITEID { get; set; }
        [DataMember]
        public long FTASKPPEID { get; set; }
        [DataMember]
        public long FPPEID { get; set; }
        [DataMember]
        public long FTASKGROUPID { get; set; }
        [DataMember]
        public long FREFERENCEID { get; set; }
        [DataMember]
        public int FCREATEDON { get; set; }
        [DataMember]
        public int FCREATEDTIME { get; set; }
        [DataMember]
        public int FUPDATEDON { get; set; }
        [DataMember]
        public int FUPDATEDTIME { get; set; }
        [DataMember]
        public char FSTATUS { get; set; }
        #endregion
    }

    [DataContract]
    public class Maint_Taskstools
    {
        #region Properties
        [DataMember]
        public int FSITEID { get; set; }
        [DataMember]
        public long FTASKTOOLSID { get; set; }
        [DataMember]
        public long FTOOLSID { get; set; }
        [DataMember]
        public long FTASKGROUPID { get; set; }
        [DataMember]
        public long FREFERENCEID { get; set; }
        [DataMember]
        public int FCREATEDON { get; set; }
        [DataMember]
        public int FCREATEDTIME { get; set; }
        [DataMember]
        public int FUPDATEDON { get; set; }
        [DataMember]
        public int FUPDATEDTIME { get; set; }
        [DataMember]
        public char FSTATUS { get; set; }
        #endregion
    }

    [DataContract]
    public class Maint_Tools
    {
        #region Properties
        [DataMember]
        public int FSITEID { get; set; }
        [DataMember]
        public long FTOOLSID { get; set; }
        [DataMember]
        public string FTOOLSDESC { get; set; }
        [DataMember]
        public string FTOOLSIMAGENAME { get; set; }
        [DataMember]
        public int FUPDATEDATE { get; set; }
        [DataMember]
        public char FSTATUS { get; set; }
        #endregion
    }

    [DataContract]
    public class Maint_Workgroupuser
    {
        #region Properties
        [DataMember]
        public int FSITEID { get; set; }
        [DataMember]
        public long FWORKGROUPID { get; set; }
        [DataMember]
        public int FITEMID { get; set; }
        [DataMember]
        public int FUSERID { get; set; }
        [DataMember]
        public char FSCH_NOTIFY { get; set; }
        [DataMember]
        public char FWORKSTART_NOTIFY { get; set; }
        [DataMember]
        public char FWORKFINISH_NOTIFY { get; set; }
        [DataMember]
        public char FREPORTISSUE_NOTIFY { get; set; }
        [DataMember]
        public char FDOWNTIME_NOTIFY { get; set; }
        [DataMember]
        public char FUSERTYPE { get; set; }
        [DataMember]
        public int FUPDATEDON { get; set; }
        [DataMember]
        public int FUPDATEDTIME { get; set; }
        [DataMember]
        public char FSTATUS { get; set; }
        #endregion
    }

    [DataContract]
    public class Maint_Workorder
    {
        #region Properties
        [DataMember]
        public int FSITEID { get; set; }
        [DataMember]
        public string FWORK_ORDERID { get; set; }
        [DataMember]
        public long FREF_SCHEDULE_DTL_ID { get; set; }
        [DataMember]
        public int FSCHEDULEDATE { get; set; }
        [DataMember]
        public int FSCHEDULETIME { get; set; }
        [DataMember]
        public int FPLANNEDDATE { get; set; }
        [DataMember]
        public int FPLANNEDTIME { get; set; }
        [DataMember]
        public int FSTARTDATE { get; set; }
        [DataMember]
        public int FSTARTTIME { get; set; }
        [DataMember]
        public int FENDDATE { get; set; }
        [DataMember]
        public int FENDTIME { get; set; }
        [DataMember]
        public string FERP_WORKORDER { get; set; }
        [DataMember]
        public int FSTARTEDBY { get; set; }
        [DataMember]
        public int FENDEDBY { get; set; }
        [DataMember]
        public long FREF_SCHEDULEID { get; set; }
        [DataMember]
        public long FTASKGROUPID { get; set; }
        [DataMember]
        public string FWORKORDERSTATUS { get; set; }
        [DataMember]
        public char FTIMETAKENUNIT { get; set; }
        [DataMember]
        public decimal FTIMETAKEN { get; set; }
        [DataMember]
        public int FTIMECONFIRMEDBY { get; set; }
        [DataMember]
        public int FUPDATEDON { get; set; }
        [DataMember]
        public int FUPDATEDTIME { get; set; }
        #endregion
    }

    [DataContract]
    public class Maint_Workorder_Task
    {
        #region Properties
        [DataMember]
        public int FSITEID { get; set; }
        [DataMember]
        public string FWORK_ORDERID { get; set; }
        [DataMember]
        public long FTASKID { get; set; }
        [DataMember]
        public string FREMARKS { get; set; }
        [DataMember]
        public long FSTARTEDBY { get; set; }
        [DataMember]
        public int FSTARTDATE { get; set; }
        [DataMember]
        public int FSTARTTIME { get; set; }
        [DataMember]
        public long FENDEDBY { get; set; }
        [DataMember]
        public int FENDDATE { get; set; }
        [DataMember]
        public int FENDTIME { get; set; }
        [DataMember]
        public int FSEQUENCENUM { get; set; }
        [DataMember]
        public char FISSAFETYCONFIRMED { get; set; }
        [DataMember]
        public char FISPPECONFIRMED { get; set; }
        [DataMember]
        public int FCREATEDON { get; set; }
        [DataMember]
        public int FCREATEDTIME { get; set; }
        [DataMember]
        public int FUPDATEDON { get; set; }
        [DataMember]
        public int FUPDATEDTIME { get; set; }
        #endregion
    }

    [DataContract]
    public class Maint_Workorder_Taskimg
    {
        #region Properties
        [DataMember]
        public int FSITEID { get; set; }
        [DataMember]
        public string FWORK_ORDERID { get; set; }
        [DataMember]
        public long FTASKID { get; set; }
        [DataMember]
        public string FIMAGENAME { get; set; }
        [DataMember]
        public int FIMAGEITEM { get; set; }
        [DataMember]
        public int FCREATEDON { get; set; }
        [DataMember]
        public int FCREATEDTIME { get; set; }
        [DataMember]
        public int FUPDATEDON { get; set; }
        [DataMember]
        public int FUPDATEDTIME { get; set; }
        #endregion
    }

    [DataContract]
    public class Maint_Workorder_Taskparam
    {
        #region Properties
        [DataMember]
        public int FSITEID { get; set; }
        [DataMember]
        public string FWORK_ORDERID { get; set; }
        [DataMember]
        public long FTASKID { get; set; }
        [DataMember]
        public long FPARAMETERID { get; set; }
        [DataMember]
        public string FVALUE { get; set; }
        [DataMember]
        public int FSELECTCODEITEM { get; set; }
        [DataMember]
        public int FRECORDEDDATE { get; set; }
        [DataMember]
        public int FRECORDEDTIME { get; set; }
        [DataMember]
        public int FRECORDEDBY { get; set; }
        [DataMember]
        public int FCREATEDON { get; set; }
        [DataMember]
        public int FCREATEDTIME { get; set; }
        [DataMember]
        public int FUPDATEDON { get; set; }
        [DataMember]
        public int FUPDATEDTIME { get; set; }
        [DataMember]
        public char FSTATUS { get; set; }
        #endregion
    }

    [DataContract]
    public class Maint_Workorder_Taskppe
    {
        #region Properties
        [DataMember]
        public int FSITEID { get; set; }
        [DataMember]
        public string FWORK_ORDERID { get; set; }
        [DataMember]
        public long FTASKID { get; set; }
        [DataMember]
        public long FTASKPPEID { get; set; }
        [DataMember]
        public int FCONFIRMEDDDATE { get; set; }
        [DataMember]
        public int FCONFIRMEDTIME { get; set; }
        [DataMember]
        public int FCONFIRMEDBY { get; set; }
        #endregion
    }

    [DataContract]
    public class EnumType
    {
        #region Properties
        [DataMember]
        public string FTYPE { get; set; }
        [DataMember]
        public string FVALUE { get; set; }
        [DataMember]
        public string FTEXT { get; set; }
        [DataMember]
        public char FISDEFAULT { get; set; }
        [DataMember]
        public int FSITEID { get; set; }
        #endregion
    }

    [DataContract]
    public class Maint_Auth_Group
    {
        #region Properties
        [DataMember]
        public long FREFERENCEID { get; set; }
        [DataMember]
        public string FTYPE { get; set; }
        [DataMember]
        public long FWORKGROUPID { get; set; }
        [DataMember]
        public int FSITEID { get; set; }
        [DataMember]
        public char FSTATUS { get; set; }
        [DataMember]
        public int FUPDATEDBY { get; set; }
        [DataMember]
        public int FUPDATEDDATE { get; set; }
        [DataMember]
        public int FUPDATEDTIME { get; set; }
        #endregion
    }

	[DataContract]
	public class SensorType_UOM
	{
		#region Properties
		[DataMember]
		public int FSENSORTYPEUOMID { get; set; }
		[DataMember]
		public int FSENSORTYPEID { get; set; }
		[DataMember]
		public string FUOMNAME { get; set; }
		[DataMember]
		public string FSYMBOL { get; set; }
		[DataMember]
		public int FCREATEDBY { get; set; }
		[DataMember]
		public int FCREATEDDATE { get; set; }
		#endregion
	}

	[DataContract]
	public class Sensor_Type
	{
		#region Properties
		[DataMember]
		public int FSENSORTYPEID { get; set; }
		[DataMember]
		public string FSENSORTYPENAME { get; set; }
		[DataMember]
		public int FCREATEDON { get; set; }
		[DataMember]
		public int FCREATEDBY { get; set; }
		[DataMember]
		public int FUPDATEDON { get; set; }
		[DataMember]
		public int FUPDATEDBY { get; set; }
		[DataMember]
		public char FSTATUS { get; set; }
		#endregion
	}

	[DataContract]
	public class Maint_Schedule_Spareparts
	{
		#region Properties
		[DataMember]
		public int FSITEID { get; set; }
		[DataMember]
		public long FSCHEDULEID { get; set; }
		[DataMember]
		public string FIDHID { get; set; }
		[DataMember]
		public decimal FQTY { get; set; }
		[DataMember]
		public char FSTATUS { get; set; }
		[DataMember]
		public int FCREATEDBY { get; set; }
		[DataMember]
		public int FCREATEDON { get; set; }
		[DataMember]
		public int FCREATEDTIME { get; set; }
		[DataMember]
		public int FUPDATEDBY { get; set; }
		[DataMember]
		public int FUPDATEDON { get; set; }
		[DataMember]
		public int FUPDATEDTIME { get; set; }
		#endregion
	}

	[DataContract]
	public class Maint_WorkOrder_Sparepart
	{
		#region Properties
		[DataMember]
		public int FSITEID { get; set; }
		[DataMember]
		public string FWORK_ORDERID { get; set; }
		[DataMember]
		public string FIDHID { get; set; }
		[DataMember]
		public decimal FREQUIREDQTY { get; set; }
		[DataMember]
		public decimal FACTUALQUANTITY { get; set; }
		[DataMember]
		public int FCREATEDBY { get; set; }
		[DataMember]
		public int FCREATEDON { get; set; }
		[DataMember]
		public int FCREATEDTIME { get; set; }
		[DataMember]
		public int FUPDATEDBY { get; set; }
		[DataMember]
		public int FUPDATEDON { get; set; }
		[DataMember]
		public int FUPDATEDTIME { get; set; }
		#endregion
	}

    [DataContract]
    public class Maint_Reading_Result
    {
        #region Properties
        [DataMember]
        public long FREADINGID { get; set; }
        [DataMember]
        public long FSCHEDULEID { get; set; }
        [DataMember]
        public string FWORK_ORDERID { get; set; }
        [DataMember]
        public long FMEASURINGPOINTID { get; set; }
        [DataMember]
        public string FRESULT { get; set; }
        [DataMember]
        public int FSITEID { get; set; }
        [DataMember]
        public int FCREATEDBY { get; set; }
        [DataMember]
        public int FCREATEDDATE { get; set; }
        [DataMember]
        public int FCREATEDTIME { get; set; }
        [DataMember]
        public int FUPDATEDBY { get; set; }
        [DataMember]
        public int FUPDATEDON { get; set; }
        [DataMember]
        public int FUPDATEDTIME { get; set; }
        [DataMember]
        public char FSTATUS { get; set; }
        #endregion
    }

    [DataContract]
	public class PlantMaterial
	{
		#region Properties
		[DataMember]
		public int FSITEID { get; set; }
		[DataMember]
		public string FIDHDESC { get; set; }
		[DataMember]
		public string FIDHID { get; set; }
		[DataMember]
		public string FTYPE { get; set; }
		[DataMember]
		public char FSTATUS { get; set; }
		[DataMember]
		public string FSAP_IDHDESC { get; set; }
		[DataMember]
		public long FMATCATEGORY { get; set; }
        [DataMember]
        public string FBASEUOM { get; set; }
        [DataMember]
        public int FUPDATEDON { get; set; }
        [DataMember]
        public int FUPDATEDTIME { get; set; }
        #endregion
    }
	#endregion

    #region Syn Out Table Data Info

    [DataContract]
    public class SyncIn_Maint_Reading_Result : Maint_Reading_Result
    {
        #region Properties
        [DataMember]
        public string FLOCALUPDATE { get; set; }
        [DataMember]
        public string FNEWID { get; set; }
        [DataMember]
        public string FMOB_SYNC_IDENTIFIER { get; set; }
        [DataMember]
        public string FRESPONSE { get; set; }
        [DataMember]
        public List<SyncIn_Maint_Workorder_Taskimg> WorkOrderTaskImgList { get; set; }
        #endregion

    }

    [DataContract]
    public class SyncIn_Maint_WorkOrder_Sparepart : Maint_WorkOrder_Sparepart
    {
        #region Properties
        [DataMember]
        public string FLOCALUPDATE { get; set; }
        [DataMember]
        public string FNEWID { get; set; }
        [DataMember]
        public string FMOB_SYNC_IDENTIFIER { get; set; }
        [DataMember]
        public string FRESPONSE { get; set; }
        #endregion

    }

    [DataContract]
    public class SyncIn_Maint_Workorder : Maint_Workorder
    {
        private List<SyncIn_Maint_Workorder_Task> _taskInfoList = new List<SyncIn_Maint_Workorder_Task>();
        private List<SyncIn_Maint_WorkOrder_Sparepart> _sparePartsList = new List<SyncIn_Maint_WorkOrder_Sparepart>();

        [DataMember]
        public List<SyncIn_Maint_Workorder_Task> WorkOrderTask
        {
            get { return _taskInfoList; }
            set { _taskInfoList = value; }
        }

        [DataMember]
        public List<SyncIn_Maint_WorkOrder_Sparepart> WorkOrderSparePart
        {
            get { return _sparePartsList; }
            set { _sparePartsList = value; }
        }

        [DataMember]
        public string FLOCALUPDATE { get; set; }
        [DataMember]
        public string FNEWID { get; set; }
        [DataMember]
        public string FMOB_SYNC_IDENTIFIER { get; set; }
        [DataMember]
        public string FRESPONSE { get; set; }
    }

    [DataContract]
    public class SyncIn_Maint_Workorder_Task : Maint_Workorder_Task
    {
        //private Maint_Workorder_Task _taskInfo = new Maint_Workorder_Task();
        private List<SyncIn_Maint_Workorder_Taskparam> _paramInfoList = new List<SyncIn_Maint_Workorder_Taskparam>();
        private List<SyncIn_Maint_Workorder_Taskimg> _taskImgList = new List<SyncIn_Maint_Workorder_Taskimg>();

        //[DataMember]
        //public Maint_Workorder_Task TaskInfo
        //{
        //    get { return _taskInfo; }
        //    set { _taskInfo = value; }
        //}

        [DataMember]
        public List<SyncIn_Maint_Workorder_Taskparam> WorkOrderTaskParam
        {
            get { return _paramInfoList; }
            set { _paramInfoList = value; }
        }

        [DataMember]
        public List<SyncIn_Maint_Workorder_Taskimg> WorkOrderTaskImgList
        {
            get { return _taskImgList; }
            set { _taskImgList = value; }
        }

        [DataMember]
        public string FLOCALUPDATE { get; set; }
        [DataMember]
        public string FNEWID { get; set; }
        [DataMember]
        public string FMOB_SYNC_IDENTIFIER { get; set; }
        [DataMember]
        public string FRESPONSE { get; set; }
    }

    [DataContract]
    public class SyncIn_Maint_Workorder_Taskparam : Maint_Workorder_Taskparam
    {
        #region Properties
        [DataMember]
        public string FLOCALUPDATE { get; set; }
        [DataMember]
        public string FNEWID { get; set; }
        [DataMember]
        public string FMOB_SYNC_IDENTIFIER { get; set; }
        [DataMember]
        public string FRESPONSE { get; set; }
        #endregion

    }

    [DataContract]
    public class SyncIn_Maint_Workorder_Taskimg : Maint_Workorder_Taskimg
    {
        #region Properties
        [DataMember]
        public string FLOCALUPDATE { get; set; }
        [DataMember]
        public string FNEWID { get; set; }
        [DataMember]
        public string FMOB_SYNC_IDENTIFIER { get; set; }
        [DataMember]
        public string FRESPONSE { get; set; }
        #endregion
    }

    [DataContract]
    public class SyncIn_Maint_Schedule : Maint_Schedule
    {
        #region Properties
        [DataMember]
        public string FLOCALUPDATE { get; set; }
        [DataMember]
        public string FNEWID { get; set; }
        [DataMember]
        public string FMOB_SYNC_IDENTIFIER { get; set; }
        [DataMember]
        public string FRESPONSE { get; set; }
        #endregion

    }

    [DataContract]
    public enum SyncOutParams
    {
        [EnumMember]
        SyncOut_Readings = 1,
        [EnumMember]
        SyncOut_Workorder = 2,
        [EnumMember]
        SyncOut_Notification = 3
    }

    [DataContract]
    public enum ResponseType
    {
        [EnumMember]
        SUCCESS = 'S',
        [EnumMember]
        FAIL = 'F',
        [EnumMember]
        NONE = 'N'
    }

    [DataContract]
    public class SyncInInfo : BasicParam
    {
        [DataMember]
        public SyncOutParams syncOutParam { get; set; }

        [DataMember]
        public string serializeData { get; set; }
    }

    #endregion

    #endregion

    #region Equipment/FLocation Info
    [DataContract]
    public class EquipmentFLocInfo
    {
        #region Properties
        [DataMember]
        public int EquipmentID { get; set; }
        [DataMember]
        public string EquipmentCode { get; set; }
        [DataMember]
        public string EquipmentName { get; set; }
        [DataMember]
        public char ParentType { get; set; }
        #endregion
    }

    [DataContract]
    public class EquipmentFLocFilterInfo :BasicParam
    {
        #region Properties
        [DataMember]
        public string SearchEquipmentName { get; set; }
        [DataMember]
        public string EquipmentFLocCode { get; set; }
        #endregion
    }
    #endregion

    #region APP Details Info
    [DataContract]
    public class AppDetailsInfo
    {
        #region Properties
        [DataMember]
        public int VegamAppID { get; set; }
        [DataMember]
        public string VegamAppName { get; set; }
        [DataMember]
        public string VegamAppVersion { get; set; }
        [DataMember]
        public int ReleasedNumber { get; set; }
        [DataMember]
        public char UpdateType { get; set; }
        [DataMember]
        public int CreatedOn { get; set; }
        [DataMember]
        public int CreatedTime { get; set; }
        [DataMember]
        public string Remarks { get; set; }

        #endregion
    }
    #endregion

    [DataContract]
    public class SiteDateTimeInfo
    {
        [DataMember]
        public int FCOMPANYID { get; set; }
        [DataMember]
        public int FSITEID { get; set; }
        [DataMember]
        public string FSITE_NAME { get; set; }
        [DataMember]
        public string FTIMEZONE { get; set; }
        [DataMember]
        public string FSITE_DATEFORMAT { get; set; }
        [DataMember]
        public string FSITE_TIMEFORMAT { get; set; }

    }
}