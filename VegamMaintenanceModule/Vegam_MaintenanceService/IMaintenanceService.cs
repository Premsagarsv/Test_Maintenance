using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace Vegam_MaintenanceService
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IMaintenanceService" in both code and config file together.
    [ServiceContract]
    public interface IMaintenanceService
    {
        #region Common
        [OperationContract]
        [WebInvoke(UriTemplate = "GetMaintenanceFeatureInfo?basicParam={basicParam}&featureName={featureName}", Method = "GET", RequestFormat = WebMessageFormat.Xml)]
        List<MaintenanceFeatureInfo> GetMaintenanceFeatureInfo(BasicParam basicParam, string featureName);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetSiteDateTimeFormatInfo?siteID={siteID}", Method = "GET", RequestFormat = WebMessageFormat.Xml)]
        SiteDateTimeFormatInfo GetSiteDateTimeFormatInfo(int siteID);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetSiteCurrentDateTime?siteID={siteID}", Method = "GET", RequestFormat = WebMessageFormat.Xml)]
        DateTimeInfo GetSiteCurrentDateTime(int siteID);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetEnumInfoList?basicParam={basicParam}&EnumType={EnumType}", Method = "GET", RequestFormat = WebMessageFormat.Xml)]
        List<EnumTypeInfo> GetEnumInfoList(BasicParam basicParam, string EnumType);

        [OperationContract]
        [WebInvoke(UriTemplate = "GenerateRandomCode?basicParam={basicParam}&infoType={infoType}", Method = "GET", RequestFormat = WebMessageFormat.Xml)]
        string GenerateRandomCode(BasicParam basicParam, InfoType infoType);

        [OperationContract]
        [WebInvoke(UriTemplate = "InsertOrUpdateUserPreference?filterInfo={filterInfo}", Method = "POST", RequestFormat = WebMessageFormat.Xml)]
        int InsertOrUpdateUserPreference(UserPreferenceFilter filterInfo);
        #endregion

        #region Functional Location Info
        [OperationContract]
        [WebInvoke(UriTemplate = "GetAllFunctionalLocInfo?functionalLocFilterInfo={functionalLocFilterInfo}", Method = "GET", RequestFormat = WebMessageFormat.Xml)]
        FLocationListInfo GetAllFunctionalLocInfo(FLocationFilterInfo functionalLocFilterInfo);

       
        [OperationContract]
        [WebInvoke(UriTemplate = "GetAllFunctionalLocList?filterFLocaInfo={filterFLocaInfo}", Method = "GET", RequestFormat = WebMessageFormat.Json)]
        FLocationListDetails GetAllFunctionalLocList(FLocationFilterInfo filterFLocInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetFLocationEditInfo?basicParam={basicParam}&fLocationID={fLocationID}", Method = "GET", RequestFormat = WebMessageFormat.Json)]
        FLocationInfo GetFLocationEditInfo(BasicParam basicParam, int fLocationID);

        [OperationContract]
        [WebInvoke(UriTemplate = "InsertOrUpdateFunctionalLocInfo?basicParam={basicParam}&functionalLocInfo={functionalLocInfo}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        AddFLocationReturnInfo InsertOrUpdateFunctionalLocInfo(BasicParam basicParam, FLocationInfo functionalLocInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "DeleteFunctionalLocInfo?basicParam={basicParam}&functionalLocationID={functionalLocationID}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        int DeleteFunctionalLocInfo(BasicParam basicParam, int functionalLocationID);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetFunctionalLocListForHierarchicalDropDown?fLocationFilterInfo={fLocationFilterInfo}", Method = "GET", RequestFormat = WebMessageFormat.Xml)]
        List<HierarchicalListInfo> GetFunctionalLocListForHierarchicalDropDown(FLocationFilterInfo fLocationFilterInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetParentLocationDropDown?parentlocationFilter={parentlocationFilter}", Method = "GET", RequestFormat = WebMessageFormat.Xml)]
        List<LocationWorkGroupInfo> GetParentLocationDropDown(FLocationFilterInfo parentlocationFilter);
		[WebInvoke(UriTemplate = "GetUserWorkGroups?basicParam={basicParam}", Method = "GET", RequestFormat = WebMessageFormat.Xml)]
        List<TypeValueInfo> GetUserWorkGroups(BasicParam basicParam);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetAllFuncLocForSchedule?filterFLocationInfo={filterFLocationInfo}", Method = "GET", RequestFormat = WebMessageFormat.Xml)]
        FLocationListInfo GetAllFuncLocForSchedule(FLocationFilterInfo filterFLocationInfo);

        #region Download & Upload

        [OperationContract]
        [WebInvoke(UriTemplate = "DownloadFunctionalLocationInfo?locationFilterInfo={locationFilterInfo}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        string DownloadFunctionalLocationInfo(FLocationFilterInfo locationFilterInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "DownloadFunctionalLocationTemplate?basicParam={basicParam}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        string DownloadFunctionalLocationTemplate(BasicParam basicParam);

        [OperationContract]
        [WebInvoke(UriTemplate = "UploadFunctionalLocationInfoExcel?basicParam={basicParam}&fileName={fileName}&unzipedFolderName={unzipedFolderName}", Method = "GET", RequestFormat = WebMessageFormat.Json)]
        string UploadFunctionalLocationInfoExcel(BasicParam basicParam, string fileName , string unzipedFolderName);
        #endregion

        #endregion

        #region Equipment Info

        [OperationContract]
        [WebInvoke(UriTemplate = "GetAllEquipmentInfo?equipmentFilterInfo={equipmentFilterInfo}", Method = "GET", RequestFormat = WebMessageFormat.Xml)]
        EquipmentListInfo GetAllEquipmentInfo(EquipmentFilterInfo equipmentFilterInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetEquipmentInfoList?equipmentFilterInfo={equipmentFilterInfo}", Method = "GET", RequestFormat = WebMessageFormat.Xml)]
        EquipmentDetailList GetEquipmentInfoList(EquipmentFilterInfo equipmentFilterInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetEquipmentEditInfo?equipmentFilterInfo={equipmentFilterInfo}", Method = "GET", RequestFormat = WebMessageFormat.Xml)]
        EquipmentDetailsInfo GetEquipmentEditInfo(EquipmentFilterInfo equipmentFilterInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "InsertOrUpdateEquipmentInfo?basicParam={basicParam}&equipmentDetailsInfo={equipmentDetailsInfo}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        AddFLocationReturnInfo InsertOrUpdateEquipmentInfo(BasicParam basicParam, EquipmentDetailsInfo equipmentDetailsInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "DeleteEquipmentInfo?basicParam={basicParam}&equipmentID={equipmentID}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        int DeleteEquipmentInfo(BasicParam basicParam, int equipmentID);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetResourceInfo?basicParam={basicParam}", Method = "GET", RequestFormat = WebMessageFormat.Xml)]
        List<KeyValueInfo> GetResourceInfo(BasicParam basicParam);

        [OperationContract]
        [WebInvoke(UriTemplate = "DeleteEquipmentSupportInfo?supportInfoFilter={supportInfoFilter}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        int DeleteEquipmentSupportInfo(EquipmentSupportInfo supportInfoFilter);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetAllEquipmentModelList?equipmentFilterInfo={equipmentFilterInfo}", Method = "GET", RequestFormat = WebMessageFormat.Xml)]
        EquipmentModelListDetails GetAllEquipmentModelList(EquipmentFilterInfo equipmentFilterInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetParentEquipmentListDropDown?parentEquipmentFilter={parentEquipmentFilter}", Method = "GET", RequestFormat = WebMessageFormat.Xml)]
        List<EquipmentDetail> GetParentEquipmentListDropDown(EquipmentFilterInfo parentEquipmentFilter);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetAllEquipmentLocationInfo?equipmentFilterInfo={equipmentFilterInfo}", Method = "GET", RequestFormat = WebMessageFormat.Xml)]
        EquipmentListInfo GetAllEquipmentLocationInfoSchedule(EquipmentFilterInfo equipmentFilterInfo);

        #region Download & Uplaod
        [OperationContract]
        [WebInvoke(UriTemplate = "DownloadEquipmentTemplate?basicParam={basicParam}", Method = "GET", RequestFormat = WebMessageFormat.Xml)]
        string DownloadEquipmentTemplate(BasicParam basicParam);

        [OperationContract]
        [WebInvoke(UriTemplate = "DownloadEquipmentInfo?equipmentFilterInfo={equipmentFilterInfo}", Method = "GET", RequestFormat = WebMessageFormat.Xml)]
        string DownloadEquipmentInfo(EquipmentFilterInfo equipmentFilterInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "UploadEquipmentInfoExcel?basicParam={basicParam}&fileName={fileName}&unzipedFolderName={unzipedFolderName}", Method = "GET", RequestFormat = WebMessageFormat.Json)]
        string UploadEquipmentInfoExcel(BasicParam basicParam, string fileName, string unzipedFolderName);
        #endregion

        #endregion

        #region Equipment Model Info       

        [OperationContract]
        [WebInvoke(UriTemplate = "InsertOrUpdateEquipmentModelInfo?basicParam={basicParam}&equipmentDetailsInfo={equipmentDetailsInfo}", Method = "POST", RequestFormat = WebMessageFormat.Xml)]
        int InsertOrUpdateEquipmentModelInfo(BasicParam basicParam, EquipmentDetailsInfo equipmentDetailsInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetEquipmentModelList?equipmentFilterInfo={equipmentFilterInfo}", Method = "POST", RequestFormat = WebMessageFormat.Xml)]
        EquipmentModelListInfo GetEquipmentModelList(EquipmentFilterInfo equipmentFilterInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetEquipmentModelInfo?equipmentFilterInfo={equipmentFilterInfo}", Method = "POST", RequestFormat = WebMessageFormat.Xml)]
        EquipmentModelInfo GetEquipmentModelInfo(EquipmentFilterInfo equipmentFilterInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "DeleteEquipmentModelInfo?basicParam={basicParam}&equipmentModelID={equipmentModelID}", Method = "POST", RequestFormat = WebMessageFormat.Xml)]
        int DeleteEquipmentModelInfo(BasicParam basicParam, int equipmentModelID);
        #endregion

        #region Measuring Points Info
        [OperationContract]
        [WebInvoke(UriTemplate = "GetSensorTypeInfo?basicParam={basicParam}", Method = "GET", RequestFormat = WebMessageFormat.Json)]
        List<TypeValueInfo> GetSensorTypeInfo(BasicParam basicParam);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetSensorUnitInfo?basicParam={basicParam}&sensorTypeID={sensorTypeID}", Method = "GET", RequestFormat = WebMessageFormat.Json)]
        List<TypeValueInfo> GetSensorUnitInfo(BasicParam basicParam, int sensorTypeID);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetMeasuringPointList?measuringPointSelection={measuringPointSelection}", Method = "GET", RequestFormat = WebMessageFormat.Json)]
        MeasuringPointListInfo GetMeasuringPointList(MeasuringPointFilter measuringPointfilter);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetSelectedMeasuringPointInfo?basicParam={basicParam}&measuringPointID={measuringPointID}", Method = "GET", RequestFormat = WebMessageFormat.Json)]
        MeasuringPoint GetSelectedMeasuringPointInfo(BasicParam basicParam, int measuringPointID);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetMeasuringPointDropDownDataInfo?measuringPointDataTypeFilterInfo={measuringPointDataTypeFilterInfo}", Method = "GET", RequestFormat = WebMessageFormat.Json)]
        MeasuringPointDataTypeList GetMeasuringPointDropDownDataInfo(MeasuringPointDataTypeFilterInfo measuringPointDataTypeFilterInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "InsertUpdateMeasuringPointInfo?basicParam={basicParam}&measuringPoint={measuringPoint}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        int InsertUpdateMeasuringPointInfo(BasicParam basicParam, MeasuringPoint measuringPoint);

        [OperationContract]
        [WebInvoke(UriTemplate = "DeleteMeasuringPointInfo?basicParam={basicParam}&measuringPointID={measuringPointID}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        int DeleteMeasuringPointInfo(BasicParam basicParam, int measuringPointID);

        #region Download & upload
        [OperationContract]
        [WebInvoke(UriTemplate = "DownloadMeasuringPointListTemplate?basicParam={basicParam}", Method = "GET", RequestFormat = WebMessageFormat.Json)]
        string DownloadMeasuringPointListTemplate(BasicParam basicParam);

        [OperationContract]
        [WebInvoke(UriTemplate = "DownloadMeasuringPointListExcel?filter={filter}", Method = "GET", RequestFormat = WebMessageFormat.Json)]
        string DownloadMeasuringPointListExcel(MeasuringPointFilterInfo filter);

        [OperationContract]
        [WebInvoke(UriTemplate = "UploadMeasuringPointListExcel?basicParam={basicParam}&fileName={fileName}&unzipedFolderName={unzipedFolderName}", Method = "GET", RequestFormat = WebMessageFormat.Json)]
        string UploadMeasuringPointListExcel(BasicParam basicParam, string fileName, string unzipedFolderName);
        #endregion
        #endregion

        #region Documents,Images And Videos
        [OperationContract]
        [WebInvoke(UriTemplate = "GetAllDocumenstAndImagesInfo?filter={filter}", Method = "GET", RequestFormat = WebMessageFormat.Xml)]
        List<DocumentInfo> GetAllDocumentsAndImagesInfo(DocumentBasicInfo filter);

        [OperationContract]
        [WebInvoke(UriTemplate = "InsertDocumenstAndImagesInfo?documentFilterInfo={documentFilterInfo}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        int InsertDocumentsAndImagesInfo(DocumentFilterInfo documentFilterInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "DeleteDocumentsAndImagesInfo?basicParam={basicParam}&documentID={documentID}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        int DeleteDocumentsAndImagesInfo(BasicParam basicParam, int documentID);
        #endregion

        #region Category,Class,Manufacturer,Equipment Type 
        [OperationContract]
        [WebInvoke(UriTemplate = "GetMaintMasterData?basicParam={basicParam}&masterDataFilterInfo={masterDataFilterInfo}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        MasterDataList GetMaintMasterData(BasicParam basicParam, MasterDataFilterInfo masterDataFilterInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetAllMaintMasterDropDownDataInfo?basicParam={basicParam}&masterDataDropDownListFilterInfo={masterDataDropDownListFilterInfo}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        MasterDataDropDownList GetAllMaintMasterDropDownDataInfo(BasicParam basicParam, MasterDataDropDownListFilterInfo masterDataDropDownListFilterInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "InsertUpdateMasterData?basicParam={basicParam}&masterDataInfo={masterDataInfo}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        int InsertUpdateMasterData(BasicParam basicParam, MasterDataInfo masterDataInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "DeleteMasterData?basicParam={basicParam}&masterDataInfo={masterDataInfo}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        int DeleteMasterData(BasicParam basicParam, MasterDataInfo masterDataInfo);
        #endregion

        #region TaskGroup Info
        #region Task Group
        [OperationContract]
        [WebInvoke(UriTemplate = "GetTaskGroupInfo?basicParam={basicParam}&taskGroupFilterInfo={taskGroupFilterInfo}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        TaskGroupBasicInfo GetTaskGroupInfo(BasicParam basicParam, TaskGroupFilterInfo taskGroupFilterInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "SaveTaskGroupInfo?basicParam={basicParam}&taskGroupInfo={taskGroupInfo}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        TaskGroupIdentifier SaveTaskGroupInfo(BasicParam basicParam, TaskGroupBasicInfo taskGroupInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "DeleteTaskGroupInfo?basicParam={basicParam}&taskGroupfilterInfo={taskGroupfilterInfo}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        int DeleteTaskGroupInfo(BasicParam basicParam, TaskGroupFilterInfo taskGroupfilterInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "ApproveGroupTask?basicParam={basicParam}&taskGroupfilterInfo={taskGroupfilterInfo}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        int ApproveGroupTask(BasicParam basicParam, TaskGroupFilterInfo taskGroupfilterInfo);
        #endregion

        #region Task
        [OperationContract]
        [WebInvoke(UriTemplate = "GetTaskInfo?basicParam={basicParam}&taskFilterInfo={taskFilterInfo}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        List<TaskInfo> GetTaskInfo(BasicParam basicParam, TaskGroupFilterInfo taskFilterInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "SaveTaskInfo?basicParam={basicParam}&filterInfo={filterInfo}&taskInfo={taskInfo}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        TaskGroupIdentifier SaveTaskInfo(BasicParam basicParam, TaskGroupFilterInfo filterInfo, TaskInfo taskInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "DeleteTaskInfo?basicParam={basicParam}&filterInfo={filterInfo}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        TaskGroupIdentifier DeleteTaskInfo(BasicParam basicParam, TaskGroupFilterInfo filterInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "SaveTaskSequenceInfo?basicParam={basicParam}&filterInfo={filterInfo}&taskBasicInfoList={taskBasicInfoList}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        TaskGroupIdentifier SaveTaskSequenceInfo(BasicParam basicParam, TaskGroupFilterInfo filterInfo, List<TaskBasicInfo> taskBasicInfoList);

        #endregion

        [OperationContract]
        [WebInvoke(UriTemplate = "GetPPIDetails?basicParam={basicParam}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        List<InstructionSelectorInfo> GetPPIDetails(BasicParam basicParam);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetToolsDetails?basicParam={basicParam}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        List<InstructionSelectorInfo> GetToolsDetails(BasicParam basicParam);

        [OperationContract]
        [WebInvoke(UriTemplate = "DownloadSOPTemplate?basicParam={basicParam}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        string DownloadSOPTemplate(BasicParam basicParam);

        [OperationContract]
        [WebInvoke(UriTemplate = "UploadTaskGroupZip?basicParam={basicParam}&fileName={fileName}&unzipedFolderName={unzipedFolderName}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        string UploadTaskGroupZip(BasicParam basicParam, string fileName);
        #endregion

        #region Maintenance Schedule & Work Order
        [OperationContract]
        [WebInvoke(UriTemplate = "InsertUpdateMaintenanceInfo?maintenanceInfo={maintenanceInfo}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        MaintenanceIdentityInfo InsertUpdateMaintenanceInfo(MaintenanceInfo maintenanceInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetMaintenanceInfo?filterInfo={filterInfo}", Method = "POST", RequestFormat = WebMessageFormat.Xml)]
        MaintenanceInfo GetMaintenanceInfo(MaintenanceFilterInfo filterInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "DeleteMaintenanceInfo?filterInfo={filterInfo}", Method = "POST", RequestFormat = WebMessageFormat.Xml)]
        int DeleteMaintenanceInfo(MaintenanceFilterInfo filterInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetWorkGroupOfEquipemntOrLocation?filterInfo={filterInfo}", Method = "GET", RequestFormat = WebMessageFormat.Xml)]
        List<TypeValueInfo> GetWorkGroupOfEquipemntOrLocation(MaintWorkGroupFilter filterInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "CancelmaintenanceWorkOrder?filterInfo={filterInfo}", Method = "POST", RequestFormat = WebMessageFormat.Xml)]
        bool CancelmaintenanceWorkOrder(MaintenanceFilterInfo filterInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "UpdateMaintWorkOrderScheduleDateTime?filterInfo={filterInfo}", Method = "POST", RequestFormat = WebMessageFormat.Xml)]
        bool UpdateMaintWorkOrderScheduleDateTime(MaintenanceFilterInfo filterInfo);
        #region Work Instruction

        [OperationContract]
        [WebInvoke(UriTemplate = "GetTaskGroupList?filterInfo={filterInfo}", Method = "POST", RequestFormat = WebMessageFormat.Xml)]
        List<MaintTaskGroupInfo> GetTaskGroupList(MaintTaskGroupFilterInfo filterInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetTaskDetailsForTaskGroup?filterInfo={filterInfo}", Method = "POST", RequestFormat = WebMessageFormat.Xml)]
        List<MaintTaskInfo> GetTaskDetailsForTaskGroup(MaintTaskGroupFilterInfo filterInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "UpdateMaintenanceTaskGroupInfo?filterInfo={filterInfo}", Method = "POST", RequestFormat = WebMessageFormat.Xml)]
        bool UpdateMaintenanceTaskGroupInfo(MaintTaskGroupFilterInfo filterInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetTaskGroupIdentifier?filterInfo={filterInfo}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        int GetTaskGroupIdentifier(MaintTaskGroupFilterInfo filterInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "UpdateMaintenanceTaskInfo?filterInfo={filterInfo}&taskInfo={taskInfo}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        TaskGroupIdentifier UpdateMaintenanceTaskInfo(MaintTaskGroupFilterInfo filterInfo, TaskInfo taskInfo);

        #endregion

        #region Create Schedule

        [OperationContract]
        [WebInvoke(UriTemplate = "GetMaintScheduleDetailInfo?filterInfo={filterInfo}", Method = "POST", RequestFormat = WebMessageFormat.Xml)]
        ScheduleDetailInfo GetMaintScheduleDetailInfo(ScheduleFilterInfo filterInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "InsertUpdateMaintenanceScheduleDetailInfo?schdDetailInfo={schdDetailInfo}", Method = "POST", RequestFormat = WebMessageFormat.Xml)]
        int InsertUpdateMaintenanceScheduleDetailInfo(ScheduleDetailInfo schdDetailInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "ActivateMaintenanceSchedule?filterInfo={filterInfo}", Method = "POST", RequestFormat = WebMessageFormat.Xml)]
        bool ActivateMaintenanceSchedule(ScheduleFilterInfo filterInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "InActivateMaintenanceSchedule?filterInfo={filterInfo}", Method = "POST", RequestFormat = WebMessageFormat.Xml)]
        bool InActivateMaintenanceSchedule(ScheduleFilterInfo filterInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetScheduleWorkOrderDetails?filterInfo={filterInfo}", Method = "POST", RequestFormat = WebMessageFormat.Xml)]
        ScheduleWorkOrderDetails GetScheduleWorkOrderDetails(ScheduleWorkOrderFilter filterInfo);

        #endregion

        #region Auto Reshedule Work Order
        [OperationContract]
        [WebInvoke(UriTemplate = "AutoReScheduleWorkOrder", Method = "POST", RequestFormat = WebMessageFormat.Xml)]
        void AutoReScheduleWorkOrder();
        #endregion

        #region Auto Update Maintenance Schedule
        [OperationContract]
        [WebInvoke(UriTemplate = "AutoUpdateMaintenanceScheduleWorkOrder", Method = "POST", RequestFormat = WebMessageFormat.Xml)]
        void AutoUpdateMaintenanceScheduleWorkOrder();

        [OperationContract]
        [WebInvoke(UriTemplate = "AutoUpdateScheduleBasedOnLastPerformanceDate", Method = "POST", RequestFormat = WebMessageFormat.Xml)]
        void AutoUpdateScheduleBasedOnLastPerformanceDate();
        #endregion

        #region Maintenance checklist Schedule
        [OperationContract]
        [WebInvoke(UriTemplate = "GetMeasurementDocumentInfo?filterInfo={filterInfo}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        MeasurementDocumentInfo GetMeasurementDocumentInfo(MeasurementDocumentFilter filterInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetMeasDocMeasuringPoints?filterInfo={filterInfo}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        MeasurementDocumentInfo GetMeasDocMeasuringPoints(MeasurementDocumentFilter filterInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "InsertSelectedMeasuringPoint?measurementDocInfo={measurementDocInfo}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        bool InsertSelectedMeasuringPoint(MeasusrementDocumentScheduleInfo measurementDocInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "DeleteSelectedMeasuringPoint?filterInfo={filterInfo}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        bool DeleteSelectedMeasuringPoint(MeasDocScheduleMeasPoint filterInfo);
        #endregion

        #region Spare Parts

        [OperationContract]
        [WebInvoke(UriTemplate = "GetSparePartMaterialDetails?basicParam={basicParam}", Method = "POST", RequestFormat = WebMessageFormat.Xml)]
        List<MaintSparePartInfo> GetSparePartMaterialDetails(BasicParam basicParam);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetMaintSparePartDetails?filterInfo={filterInfo}", Method = "POST", RequestFormat = WebMessageFormat.Xml)]
        List<MaintSparePartInfo> GetMaintSparePartDetails(MaintenanceFilterInfo filterInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "SaveMaintSparePartInfo?maintSparePartDetails={maintSparePartDetails}", Method = "POST", RequestFormat = WebMessageFormat.Xml)]
        bool SaveMaintSparePartInfo(MaintSparePartDetails maintSparePartDetails);

        [OperationContract]
        [WebInvoke(UriTemplate = "DeleteMaintSparePartInfo?filterInfo={filterInfo}", Method = "POST", RequestFormat = WebMessageFormat.Xml)]
        bool DeleteMaintSparePartInfo(MaintSparePartFilter filterInfo);
        #endregion

        #region Attachments

        [OperationContract]
        [WebInvoke(UriTemplate = "GetAttachmentDetailsForSchedule?filterInfo={filterInfo}", Method = "POST", RequestFormat = WebMessageFormat.Xml)]
        List<DocumentInfo> GetAttachmentDetailsForSchedule(MaintenanceFilterInfo filterInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetAttachmentDetailsForSchedule?filterInfo={filterInfo}", Method = "POST", RequestFormat = WebMessageFormat.Xml)]
        List<DocumentInfo> GetAttachmentDetailsForWorkOrder(BasicParam basicParam, string workOrderID);

        #endregion

        #endregion

        #region Work Group
        //[OperationContract]
        //[WebInvoke(UriTemplate = "GetWorkGroupDetailsInfo?basicParam={basicParam}&workGroupID={workGroupID}", Method = "GET", RequestFormat = WebMessageFormat.Json)]
        //WorkGroupDetailsInfoList GetWorkGroupDetailsInfo(BasicParam basicParam, int workGroupID);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetUserNameForAutoComplete?searchInfo={searchInfo}", Method = "GET", RequestFormat = WebMessageFormat.Json)]
        List<AutoCompleteUserInfo> GetUserNameForAutoComplete(AutoCompleteSearch searchInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetEditWorkGroupInfo?workGroupFilterInfo={workGroupFilterInfo}", Method = "GET", RequestFormat = WebMessageFormat.Json)]
        WorkGroupInfo GetEditWorkGroupInfo(WorkGroupFilterInfo workGroupFilterInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "InsertOrUpdateWorkGroupInfo?basicParam={basicParam}&workGroupInfo={workGroupInfo}", Method = "POST", RequestFormat = WebMessageFormat.Xml)]
        int InsertOrUpdateWorkGroupInfo(BasicParam basicParam, WorkGroupInfo workGroupInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "DeleteWorkGroupUserInfo?workGroupFilterInfo={workGroupFilterInfo}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        int DeleteWorkGroupUserInfo(WorkGroupFilterInfo workGroupFilterInfo);

        #region Download & Uplaod
        [OperationContract]
        [WebInvoke(UriTemplate = "DownloadWorkGroupExcelTemplateInfo?basicParam={basicParam}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        string DownloadWorkGroupExcelTemplateInfo(BasicParam basicParam);

        [OperationContract]
        [WebInvoke(UriTemplate = "DownloadAllWorkGroupInfo?workGroupFilterInfo={workGroupFilterInfo}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        string DownloadAllWorkGroupInfo(WorkGroupFilterInfo workGroupFilterInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "UploadExcelWorkGroupInfo?basicParam={basicParam}&fileName={fileName}", Method = "GET", RequestFormat = WebMessageFormat.Json)]
        string UploadExcelWorkGroupInfo(BasicParam basicParam, string fileName);
        #endregion
        #endregion

        #region View Work Order

        #region Calendar

        [OperationContract]
        [WebInvoke(UriTemplate = "GetUserWorkGroupInfo?basicParam={basicParam}", Method = "GET", RequestFormat = WebMessageFormat.Xml)]
        List<UserWorkGroupInfo> GetUserWorkGroupInfo(BasicParam basicParam);

        #endregion

        #region Resource View

        [OperationContract]
        [WebInvoke(UriTemplate = "GetResourceViewWorkOrderInfo?filter={filter}", Method = "GET", RequestFormat = WebMessageFormat.Json)]
        WorkOrderResourceViewInfo GetResourceViewWorkOrderInfo(WorkOrderResourceViewFilter filter);

        #endregion

        
        [OperationContract]
        [WebInvoke(UriTemplate = "GetWorkOrderBasicInfo?filter={filter}", Method = "GET", RequestFormat = WebMessageFormat.Json)]
        WorkOrderBasicInfo GetWorkOrderBasicInfo(WorkOrderFilter filter);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetWorkOrderEquipmentInfo?filter={filter}", Method = "GET", RequestFormat = WebMessageFormat.Json)]
        WorkOrderEquipmentInfo GetWorkOrderEquipmentInfo(WorkOrderFilter filter);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetWorkOrderEquipmentHistory?basicParam={basicParam}&equipmentHistoryFilter={equipmentHistoryFilter}", Method = "GET", RequestFormat = WebMessageFormat.Json)]
        WorkOrderEquipmentHistoryDetails GetWorkOrderEquipmentHistory(BasicParam basicParam, EquipmentHistoryFilter equipmentHistoryFilter);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetWorkOrderTaskInfo?filter={filter}", Method = "GET", RequestFormat = WebMessageFormat.Json)]
        WorkOrderTaskDetails GetWorkOrderTaskInfo(WorkOrderFilter filter);

        [OperationContract]
        [WebInvoke(UriTemplate = "StartWorkOrderTask?startTaskInfo={startTaskInfo}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        TaskStartEndReturnInfo StartWorkOrderTask(WorkOrderTaskProcessInfo startTaskInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "EndWorkOrderTask?endTaskInfo={endTaskInfo}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        TaskStartEndReturnInfo EndWorkOrderTask(WorkOrderTaskProcessInfo endTaskInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "SaveTaskParameterValue?taskParameter={taskParameter}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        int SaveTaskParameterValue(TaskParameterInfo taskParameter);

        [OperationContract]
        [WebInvoke(UriTemplate = "InsertWorkOrderTaskImage?imageUploadInfo={imageUploadInfo}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        WorkOrderTaskImageInfo InsertWorkOrderTaskImage(WorkOrderTaskImageUploadInfo imageUploadInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetWorkOrderSpareParts?filterInfo={filterInfo}", Method = "GET", RequestFormat = WebMessageFormat.Json)]
        WorkOrderSparePartsInfo GetWorkOrderSpareParts(WorkOrderFilter filterInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "SaveWorkOrderSparePartInfo?filterInfo={filterInfo}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        bool SaveWorkOrderSparePartInfo(MaintSparePartDetails filterInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "CloseWorkOrderInfo?workOrderCloseFilter={workOrderCloseFilter}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        bool CloseWorkOrderInfo(WorkOrderCloseInfo workOrderCloseFilter);


        #endregion

        #region Tools Info

        [OperationContract]
        [WebInvoke(UriTemplate = "GetAllToolsInfo?filterInfo={filterInfo}", Method = "GET", RequestFormat = WebMessageFormat.Json)]
        ToolsListInfo GetAllToolsInfo(ToolsFilterInfo filterInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "InsertOrUpdateToolInfo?basicParam={basicParam}&toolsInfo={toolsInfo}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        int InsertOrUpdateToolInfo(BasicParam basicParam, ToolsInfo toolsInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "DeleteToolsInfo?basicParam={basicParam}&toolID={toolID}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        int DeleteToolsInfo(BasicParam basicParam, int toolID);
        #endregion

        #region Configure Spare Parts
        [OperationContract]
        [WebInvoke(UriTemplate = "DownloadSparePartsTemplate?basicParam={basicParam}", Method = "GET", RequestFormat = WebMessageFormat.Json)]
        string DownloadSparePartsTemplate(BasicParam basicParam);

        [OperationContract]
        [WebInvoke(UriTemplate = "DownloadSparePartsListExcel?filter={filter}", Method = "GET", RequestFormat = WebMessageFormat.Json)]
        string DownloadSparePartsListExcel(SparePartsFilterInfo filter);

        [OperationContract]
        [WebInvoke(UriTemplate = "UploadSparePartsinfoExcel?basicParam={basicParam}&fileName={fileName}", Method = "GET", RequestFormat = WebMessageFormat.Json)]
        string UploadSparePartsinfoExcel(BasicParam basicParam, string fileName);
        #endregion

        #region Notification
        [OperationContract]
        [WebInvoke(UriTemplate = "GetNotificationList?basicParam={basicParam}&notificationFilter={notificationFilter}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        NotificationList GetNotificationList(BasicParam basicParam, NotificationtFilter notificationFilter);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetNotificationInfo?basicParam={basicParam}&notificationID={notificationID}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        NotificationInfo GetNotificationInfo(BasicParam basicParam, int notificationID);

        [OperationContract]
        [WebInvoke(UriTemplate = "InsertUpdateNotificationInfo?basicParam={basicParam}&notificationInfo={notificationInfo}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        int InsertUpdateNotificationInfo(BasicParam basicParam, NotificationInfo notificationInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "DeleteNotificationInfo?basicParam={basicParam}&notificationID={notificationID}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        int DeleteNotificationInfo(BasicParam basicParam, int notificationID);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetEquipmentListForDropDown?equipmentFilterInfo={equipmentFilterInfo}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        List<TypeValueInfo> GetEquipmentListForDropDown(EquipmentFilterInfo equipmentFilterInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetAttachmentDetailsForNotification?basicParam={basicParam}&notificationID={notificationID}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        List<DocumentInfo> GetAttachmentDetailsForNotification(BasicParam basicParam, int notificationID);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetNextNotificationSequenceID?basicParam={basicParam}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        int GetNextNotificationSequenceID(BasicParam basicParam);

        [OperationContract]
        [WebInvoke(UriTemplate = "AcceptNotificationInfo?basicParam={basicParam}&notificationID={notificationID}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        int AcceptNotificationInfo(BasicParam basicParam, int notificationID);

        [OperationContract]
        [WebInvoke(UriTemplate = "CloseNotificationInfo?basicParam={basicParam}&notificationInfo={notificationInfo}", Method = "POST", RequestFormat = WebMessageFormat.Json)]
        int CloseNotificationInfo(BasicParam basicParam, NotificationInfo notificationInfo);
        #endregion
    }

}
