using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Vegam_MaintenanceModule.Vegam_MaintenanceService;
namespace Vegam_MaintenanceModule.BLL
{
    public class MaintenanceBLL
    {

        #region Common

        public static SiteDateTimeFormatInfo GetSiteDateTimeFormatInfo(int siteID)
        {
            MaintenanceServiceClient maintenanceService = new MaintenanceServiceClient();
            try
            {
                SiteDateTimeFormatInfo output = maintenanceService.GetSiteDateTimeFormatInfo(siteID);
                maintenanceService.Close();
                return output;
            }
            catch
            {
                maintenanceService.Abort();
                throw;
            }
        }

        public static DateTimeInfo GetSiteCurrentDateTime(int siteID)
        {
            MaintenanceServiceClient maintenanceService = new MaintenanceServiceClient();
            try
            {
                DateTimeInfo output = maintenanceService.GetSiteCurrentDateTime(siteID);
                maintenanceService.Close();
                return output;
            }
            catch
            {
                maintenanceService.Abort();
                throw;
            }
        }

        public static List<EnumTypeInfo> GetEnumInfoList(BasicParam basicParam, string EnumType)
        {
            MaintenanceServiceClient maintenanceService = new MaintenanceServiceClient();
            try
            {
                List<EnumTypeInfo> output = maintenanceService.GetEnumInfoList(basicParam, EnumType).ToList();
                maintenanceService.Close();
                return output;
            }
            catch
            {
                maintenanceService.Abort();
                throw;
            }
        }
        public static int InsertOrUpdateUserPreference(UserPreferenceFilter filterInfo)
        {
            MaintenanceServiceClient maintenanceService = new MaintenanceServiceClient();
            try
            {
                int output = maintenanceService.InsertOrUpdateUserPreference(filterInfo);
                maintenanceService.Close();
                return output;
            }
            catch
            {
                maintenanceService.Abort();
                throw;
            }
        }
        #endregion

        #region Dynamic Grid

        public static ipas_CompanyService.DynamicGridFeatureFieldInfo GetDynamicGridFieldInfo(ipas_CompanyService.DynamicGridFilter gridFilter)
        {
            ipas_CompanyService.CompanyServiceClient bindingService = new ipas_CompanyService.CompanyServiceClient();
            try
            {
                ipas_CompanyService.DynamicGridFeatureFieldInfo output = bindingService.GetDynamicGridFieldInfo(gridFilter);
                bindingService.Close();
                return output;
            }
            catch
            {
                bindingService.Abort();
                throw;
            }
        }

        public static ipas_CompanyService.DynamicGridContentInfo GetDynamicGridContent(ipas_CompanyService.DynamicGridFilter gridfilter, ipas_CompanyService.DynamicGridContentFilter contentFilter)
        {
            ipas_CompanyService.CompanyServiceClient bindingService = new ipas_CompanyService.CompanyServiceClient();
            try
            {
                ipas_CompanyService.DynamicGridContentInfo output = bindingService.GetDynamicGridContent(gridfilter, contentFilter);
                bindingService.Close();
                return output;
            }
            catch
            {
                bindingService.Abort();
                throw;
            }
        }

        public static List<ipas_CompanyService.TypeValueInfo> GetFilterTypeValues(ipas_CompanyService.DynamicGridFilter filter, ipas_CompanyService.DynamicGridTypeValueFilter typeValueFilter)
        {
            ipas_CompanyService.CompanyServiceClient bindingService = new ipas_CompanyService.CompanyServiceClient();
            try
            {
                List<ipas_CompanyService.TypeValueInfo> output = bindingService.GetFilterTypeValues(filter, typeValueFilter).ToList();
                bindingService.Close();
                return output;
            }
            catch
            {
                bindingService.Abort();
                throw;
            }
        }

        public static string DynamicGridContentExcelDownload(ipas_CompanyService.DynamicGridFilter filter, ipas_CompanyService.DynamicGridContentFilter contentFilter)
        {
            ipas_CompanyService.CompanyServiceClient bindingService = new ipas_CompanyService.CompanyServiceClient();
            try
            {
                string output = bindingService.DynamicGridContentExcelDownload(filter, contentFilter);
                bindingService.Close();
                return output;
            }
            catch
            {
                bindingService.Abort();
                throw;
            }
        }

        #region UserView

        public static List<ipas_CompanyService.UserViewFieldInfo> GetUserViewFields(ipas_CompanyService.DynamicGridFilter filter)
        {
            ipas_CompanyService.CompanyServiceClient bindingService = new ipas_CompanyService.CompanyServiceClient();
            try
            {
                List<ipas_CompanyService.UserViewFieldInfo> output = bindingService.GetUserViewFields(filter).ToList();
                bindingService.Close();
                return output;
            }
            catch
            {
                bindingService.Abort();
                throw;
            }
        }

        public static int InserUserView(ipas_CompanyService.DynamicGridFilter filter, ipas_CompanyService.UserViewInfo userViewInfo)
        {
            ipas_CompanyService.CompanyServiceClient bindingService = new ipas_CompanyService.CompanyServiceClient();
            try
            {
                int output = bindingService.InserUserView(filter, userViewInfo);
                bindingService.Close();
                return output;
            }
            catch
            {
                bindingService.Abort();
                throw;
            }
        }

        public static bool DeleteUserView(ipas_CompanyService.DynamicGridFilter filter)
        {
            ipas_CompanyService.CompanyServiceClient bindingService = new ipas_CompanyService.CompanyServiceClient();
            try
            {
                bool output = bindingService.DeleteUserView(filter);
                bindingService.Close();
                return output;
            }
            catch
            {
                bindingService.Abort();
                throw;
            }
        }

        #endregion

        #endregion

        #region Maintenance Feature Info
        public static List<MaintenanceFeatureInfo> GetMaintenanceFeatureInfo(BasicParam basicParam, string featureName)
        {
            MaintenanceServiceClient maintenanceService = new MaintenanceServiceClient();
            try
            {
                List<MaintenanceFeatureInfo> output = maintenanceService.GetMaintenanceFeatureInfo(basicParam, featureName).ToList();
                maintenanceService.Close();
                return output;
            }
            catch
            {
                maintenanceService.Abort();
                throw;
            }
        }
        #endregion

        #region Functional Location Info
        public static FLocationListInfo GetAllFunctionalLocInfo(FLocationFilterInfo locationFilterInfo)
        {
            MaintenanceServiceClient maintenanceService = new MaintenanceServiceClient();
            try
            {
                FLocationListInfo output = maintenanceService.GetAllFunctionalLocInfo(locationFilterInfo);
                maintenanceService.Close();
                return output;
            }
            catch
            {
                maintenanceService.Abort();
                throw;
            }
        }

        public static FLocationListDetails GetAllFunctionalLocList(FLocationFilterInfo filterFLocaInfo)
        {
            MaintenanceServiceClient maintenanceService = new MaintenanceServiceClient();
            try
            {
                FLocationListDetails output = maintenanceService.GetAllFunctionalLocList(filterFLocaInfo); 
                maintenanceService.Close();
                return output;
            }
            catch
            {
                maintenanceService.Abort();
                throw;
            }
        }

        public static FLocationInfo GetFLocationEditInfo(BasicParam basicParam, int fLocationID)
        {
            MaintenanceServiceClient maintenanceService = new MaintenanceServiceClient();
            try
            {
                FLocationInfo output = maintenanceService.GetFLocationEditInfo(basicParam, fLocationID);
                maintenanceService.Close();
                return output;
            }
            catch
            {
                maintenanceService.Abort();
                throw;
            }
        }

        public static AddFLocationReturnInfo InsertOrUpdateFunctionalLocInfo(BasicParam basicParam, FLocationInfo functionalLocInfo)
        {
            MaintenanceServiceClient maintenanceService = new MaintenanceServiceClient();
            try
            {
                AddFLocationReturnInfo output = maintenanceService.InsertOrUpdateFunctionalLocInfo(basicParam, functionalLocInfo);
                maintenanceService.Close();
                return output;
            }
            catch
            {
                maintenanceService.Abort();
                throw;
            }
        }

        public static int DeleteFunctionalLocInfo(BasicParam basicParam, int functionalLocationID)
        {
            MaintenanceServiceClient maintenanceService = new MaintenanceServiceClient();
            try
            {
                int output = maintenanceService.DeleteFunctionalLocInfo(basicParam, functionalLocationID);
                maintenanceService.Close();
                return output;
            }
            catch
            {
                maintenanceService.Abort();
                throw;
            }
        }

        public static List<HierarchicalListInfo> GetFunctionalLocListForHierarchicalDropDown(FLocationFilterInfo fLocationFilterInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                List<HierarchicalListInfo> output = service.GetFunctionalLocListForHierarchicalDropDown(fLocationFilterInfo).ToList();
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static List<LocationWorkGroupInfo> GetParentLocationDropDown(FLocationFilterInfo fLocationFilterInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                List<LocationWorkGroupInfo> output = service.GetParentLocationDropDown(fLocationFilterInfo).ToList();
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

 		public static List<TypeValueInfo> GetUserWorkGroups(BasicParam basicParam)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                List<TypeValueInfo> output = service.GetUserWorkGroups(basicParam).ToList();
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }
        
        public static FLocationListInfo GetAllFuncLocForSchedule(FLocationFilterInfo filterFLocationInfo)
        {
            MaintenanceServiceClient maintenanceService = new MaintenanceServiceClient();
            try
            {
                FLocationListInfo output = maintenanceService.GetAllFuncLocForSchedule(filterFLocationInfo);
                maintenanceService.Close();
                return output;
            }
            catch
            {
                maintenanceService.Abort();
                throw;
            }
        }

        #region Download & Upload
        public static string DownloadFunctionalLocationInfo(FLocationFilterInfo locationFilterInfo)
        {
            MaintenanceServiceClient maintenanceService = new MaintenanceServiceClient();
            try
            {
                string output = maintenanceService.DownloadFunctionalLocationInfo(locationFilterInfo);
                maintenanceService.Close();
                return output;
            }
            catch
            {
                maintenanceService.Abort();
                throw;
            }
        }

        public static string DownloadFunctionalLocationTemplate(BasicParam basicParam)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                string output = service.DownloadFunctionalLocationTemplate(basicParam);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static string UploadFunctionalLocationInfoExcel(BasicParam basicParam, string fileName, string unzipedFolderName)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                string output = service.UploadFunctionalLocationInfoExcel(basicParam, fileName, unzipedFolderName);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }
        #endregion

        #endregion

        #region Equipment Details Info
        public static EquipmentListInfo GetAllEquipmentInfo(EquipmentFilterInfo equipmentFilterInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                EquipmentListInfo output = service.GetAllEquipmentInfo(equipmentFilterInfo);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

              public static EquipmentDetailList GetEquipmentInfoList(EquipmentFilterInfo equipmentFilterInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                EquipmentDetailList output = service.GetEquipmentInfoList(equipmentFilterInfo);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static EquipmentDetailsInfo GetEquipmentEditInfo(EquipmentFilterInfo equipmentFilterInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                EquipmentDetailsInfo output = service.GetEquipmentEditInfo(equipmentFilterInfo);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static AddFLocationReturnInfo InsertOrUpdateEquipmentInfo(BasicParam basicParam, EquipmentDetailsInfo equipmentDetailsInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                AddFLocationReturnInfo output = service.InsertOrUpdateEquipmentInfo(basicParam, equipmentDetailsInfo);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static int DeleteEquipmentInfo(BasicParam basicParam, int equipmentID)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                int output = service.DeleteEquipmentInfo(basicParam, equipmentID);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static List<KeyValueInfo> GetResourceInfo(BasicParam basicParam)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                List<KeyValueInfo> output = service.GetResourceInfo(basicParam).ToList();
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static string GenerateRandomCode(BasicParam basicParam, InfoType infoType)
        {
            MaintenanceServiceClient maintenanceService = new MaintenanceServiceClient();
            try
            {
                string output = maintenanceService.GenerateRandomCode(basicParam, infoType);
                maintenanceService.Close();
                return output;
            }
            catch
            {
                maintenanceService.Abort();
                throw;
            }
        }

        public static int DeleteEquipmentSupportInfo(EquipmentSupportInfo supportInfoFilter)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                int output = service.DeleteEquipmentSupportInfo(supportInfoFilter);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static EquipmentModelListDetails GetAllEquipmentModelList(EquipmentFilterInfo equipmentFilterInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                EquipmentModelListDetails output = service.GetAllEquipmentModelList(equipmentFilterInfo);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static List<EquipmentDetail> GetParentEquipmentListDropDown(EquipmentFilterInfo parentEquipmentFilter)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                List<EquipmentDetail> output = service.GetParentEquipmentListDropDown(parentEquipmentFilter).ToList();
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static EquipmentListInfo GetAllEquipmentLocationInfoSchedule(EquipmentFilterInfo equipmentFilterInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                EquipmentListInfo output = service.GetAllEquipmentLocationInfoSchedule(equipmentFilterInfo);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        #region Download & Uplaod
        public static string DownloadEquipmentTemplate(BasicParam basicParam)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                string output = service.DownloadEquipmentTemplate(basicParam);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static string DownloadEquipmentInfo(EquipmentFilterInfo filterInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                string output = service.DownloadEquipmentInfo(filterInfo);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static string UploadEquipmentInfoExcel(BasicParam basicParam, string fileName, string unzipedFolderName)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                string output = service.UploadEquipmentInfoExcel(basicParam, fileName, unzipedFolderName);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }
        #endregion

        #endregion

        #region  Equipment Model Info    
        public static int InsertOrUpdateEquipmentModelInfo(BasicParam basicParam, EquipmentDetailsInfo equipmentDetailsInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                int output = service.InsertOrUpdateEquipmentModelInfo(basicParam, equipmentDetailsInfo);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static EquipmentModelInfo GetEquipmentModelInfo(EquipmentFilterInfo equipmentFilterInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                EquipmentModelInfo output = service.GetEquipmentModelInfo(equipmentFilterInfo);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static EquipmentModelListInfo GetEquipmentModelList(EquipmentFilterInfo equipmentFilterInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                EquipmentModelListInfo output = service.GetEquipmentModelList(equipmentFilterInfo);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static int DeleteEquipmentModelInfo(BasicParam basicParam, int equipmentModelID)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                int output = service.DeleteEquipmentModelInfo(basicParam, equipmentModelID);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        #endregion

        #region Measuring Points Info
        public static List<TypeValueInfo> GetSensorTypeInfo(BasicParam basicParam)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                List<TypeValueInfo> output = service.GetSensorTypeInfo(basicParam).ToList();
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static List<TypeValueInfo> GetSensorUnitInfo(BasicParam basicParam, int sensorTypeID)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                List<TypeValueInfo> output = service.GetSensorUnitInfo(basicParam, sensorTypeID).ToList();
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static MeasuringPointListInfo GetMeasuringPointList(MeasuringPointFilter measuringPointfilter)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                MeasuringPointListInfo output = service.GetMeasuringPointList(measuringPointfilter); ;
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static int InsertUpdateMeasuringPointInfo(BasicParam basicParam, MeasuringPoint measuringPoint)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                int output = service.InsertUpdateMeasuringPointInfo(basicParam, measuringPoint);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static MeasuringPoint GetSelectedMeasuringPointInfo(BasicParam basicParam, int measuringPointID)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                MeasuringPoint output = service.GetSelectedMeasuringPointInfo(basicParam, measuringPointID);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static int DeleteMeasuringPointInfo(BasicParam basicParam, int measuringPointID)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                int output = service.DeleteMeasuringPointInfo(basicParam, measuringPointID);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static string DownloadMeasuringPointListTemplate(BasicParam basicParam)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                string output = service.DownloadMeasuringPointListTemplate(basicParam);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static string DownloadMeasuringPointListExcel(MeasuringPointFilterInfo filter)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                string output = service.DownloadMeasuringPointListExcel(filter);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static string UploadMeasuringPointListExcel(BasicParam basicParam, string fileName, string unzipedFolderName)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                string output = service.UploadMeasuringPointListExcel(basicParam, fileName, unzipedFolderName);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static MeasuringPointDataTypeList GetMeasuringPointDropDownDataInfo(MeasuringPointDataTypeFilterInfo measuringPointDataTypeFilterInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                MeasuringPointDataTypeList output = service.GetMeasuringPointDropDownDataInfo(measuringPointDataTypeFilterInfo);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }
        #endregion

        #region Document,Images And Video Info
        public static List<DocumentInfo> GetAllDocumentsAndImagesInfo(DocumentBasicInfo filterInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                List<DocumentInfo> output = service.GetAllDocumentsAndImagesInfo(filterInfo).ToList();
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static int InsertDocumentsAndImagesInfo(DocumentFilterInfo documentFilterInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                int output = service.InsertDocumentsAndImagesInfo(documentFilterInfo);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static int DeleteDocumentsAndImagesInfo(BasicParam basicParam,int documentID)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                int output = service.DeleteDocumentsAndImagesInfo(basicParam, documentID);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }
        #endregion

        #region Category,Class,Manufacturer,Equipment Type 
        public static MasterDataList GetMaintMasterData(BasicParam basicParam, MasterDataFilterInfo masterDataFilterInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                MasterDataList output = service.GetMaintMasterData(basicParam, masterDataFilterInfo);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static MasterDataDropDownList GetAllMaintMasterDropDownDataInfo(BasicParam basicParam, MasterDataDropDownListFilterInfo masterDataDropDownListFilterInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                MasterDataDropDownList output = service.GetAllMaintMasterDropDownDataInfo(basicParam, masterDataDropDownListFilterInfo);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static int InsertUpdateMasterData(BasicParam basicParam, MasterDataInfo masterDataInfo)
        {
            MaintenanceServiceClient maintenanceService = new MaintenanceServiceClient();
            try
            {
                int output = maintenanceService.InsertUpdateMasterData(basicParam, masterDataInfo);
                maintenanceService.Close();
                return output;
            }
            catch
            {
                maintenanceService.Abort();
                throw;
            }
        }

        public static int DeleteMasterData(BasicParam basicParam, MasterDataInfo masterDataInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                int output = service.DeleteMasterData(basicParam, masterDataInfo);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        #endregion

        #region TaskGroup Info

        #region TaskGroup
        public static TaskGroupBasicInfo GetTaskGroupInfo(BasicParam basicParam, TaskGroupFilterInfo taskGroupFilterInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                TaskGroupBasicInfo output = service.GetTaskGroupInfo(basicParam, taskGroupFilterInfo);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }
        public static TaskGroupIdentifier SaveTaskGroupInfo(BasicParam basicParam, TaskGroupBasicInfo taskGroupInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                TaskGroupIdentifier output = service.SaveTaskGroupInfo(basicParam, taskGroupInfo);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }
        public static int DeleteTaskGroupInfo(BasicParam basicParam, TaskGroupFilterInfo taskGroupfilterInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                int output = service.DeleteTaskGroupInfo(basicParam, taskGroupfilterInfo);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }
        public static int ApproveGroupTask(BasicParam basicParam, TaskGroupFilterInfo taskGroupfilterInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                int output = service.ApproveGroupTask(basicParam, taskGroupfilterInfo);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }
        #endregion

        #region Task
        public static List<TaskInfo> GetTaskInfo(BasicParam basicParam, TaskGroupFilterInfo taskFilterInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                List<TaskInfo> output = service.GetTaskInfo(basicParam, taskFilterInfo).ToList();
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }
        public static TaskGroupIdentifier SaveTaskInfo(BasicParam basicParam, TaskGroupFilterInfo filterInfo, TaskInfo taskInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                TaskGroupIdentifier output = service.SaveTaskInfo(basicParam, filterInfo, taskInfo);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static TaskGroupIdentifier DeleteTaskInfo(BasicParam basicParam, TaskGroupFilterInfo filterInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                TaskGroupIdentifier output = service.DeleteTaskInfo(basicParam, filterInfo);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }
        public static TaskGroupIdentifier SaveTaskSequenceInfo(BasicParam basicParam, TaskGroupFilterInfo filterInfo, List<TaskBasicInfo> taskBasicInfoList)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                TaskGroupIdentifier output = service.SaveTaskSequenceInfo(basicParam, filterInfo, taskBasicInfoList.ToArray());
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }
        #endregion

        public static List<InstructionSelectorInfo> GetPPIDetails(BasicParam basicParam)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                List<InstructionSelectorInfo> output = service.GetPPIDetails(basicParam).ToList();
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }
        public static List<InstructionSelectorInfo> GetToolsDetails(BasicParam basicParam)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                List<InstructionSelectorInfo> output = service.GetToolsDetails(basicParam).ToList();
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        #region Download Template
        public static string DownloadSOPTemplate(BasicParam basicParam)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                string output = service.DownloadSOPTemplate(basicParam);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static string UploadTaskGroupZip(BasicParam basicParam, string fileName)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                string output = service.UploadTaskGroupZip(basicParam, fileName);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }
        #endregion
        #endregion

        #region Maintenance Schedule & Work Order

        public static MaintenanceIdentityInfo InsertUpdateMaintenanceInfo(MaintenanceInfo maintenanceInfo)
        {
            MaintenanceServiceClient maintenanceService = new MaintenanceServiceClient();
            try
            {
                MaintenanceIdentityInfo output = maintenanceService.InsertUpdateMaintenanceInfo(maintenanceInfo);
                maintenanceService.Close();
                return output;
            }
            catch
            {
                maintenanceService.Abort();
                throw;
            }
        }

        public static MaintenanceInfo GetMaintenanceInfo(MaintenanceFilterInfo filterInfo)
        {
            MaintenanceServiceClient maintenanceService = new MaintenanceServiceClient();
            try
            {
                MaintenanceInfo output = maintenanceService.GetMaintenanceInfo(filterInfo);
                maintenanceService.Close();
                return output;
            }
            catch
            {
                maintenanceService.Abort();
                throw;
            }
        }

        public static int DeleteMaintenanceInfo(MaintenanceFilterInfo filterInfo)
        {
            MaintenanceServiceClient maintenanceService = new MaintenanceServiceClient();
            try
            {
                int output = maintenanceService.DeleteMaintenanceInfo(filterInfo);
                maintenanceService.Close();
                return output;
            }
            catch
            {
                maintenanceService.Abort();
                throw;
            }
        }

        public static List<TypeValueInfo> GetWorkGroupOfEquipemntOrLocation(MaintWorkGroupFilter filterInfo)
        {
            MaintenanceServiceClient maintenanceService = new MaintenanceServiceClient();
            try
            {
                List<TypeValueInfo> output = maintenanceService.GetWorkGroupOfEquipemntOrLocation(filterInfo).ToList();
                maintenanceService.Close();
                return output;
            }
            catch
            {
                maintenanceService.Abort();
                throw;
            }
        }

        public static bool CancelmaintenanceWorkOrder(MaintenanceFilterInfo filterInfo)
        {
            MaintenanceServiceClient maintenanceService = new MaintenanceServiceClient();
            try
            {
                bool output = maintenanceService.CancelmaintenanceWorkOrder(filterInfo);
                maintenanceService.Close();
                return output;
            }
            catch
            {
                maintenanceService.Abort();
                throw;
            }
        }

        public static bool UpdateMaintWorkOrderScheduleDateTime(MaintenanceFilterInfo filterInfo)
        {
            MaintenanceServiceClient maintenanceService = new MaintenanceServiceClient();
            try
            {
                bool output = maintenanceService.UpdateMaintWorkOrderScheduleDateTime(filterInfo);
                maintenanceService.Close();
                return output;
            }
            catch
            {
                maintenanceService.Abort();
                throw;
            }
        }

        #region Work Instruction

        public static List<MaintTaskGroupInfo> GetTaskGroupList(MaintTaskGroupFilterInfo filterInfo)
        {
            MaintenanceServiceClient maintenanceService = new MaintenanceServiceClient();
            try
            {
                var output = maintenanceService.GetTaskGroupList(filterInfo).ToList();
                maintenanceService.Close();
                return output;
            }
            catch
            {
                maintenanceService.Abort();
                throw;
            }
        }

        public static List<MaintTaskInfo> GetTaskDetailsForTaskGroup(MaintTaskGroupFilterInfo filterInfo)
        {
            MaintenanceServiceClient maintenanceService = new MaintenanceServiceClient();
            try
            {
                var output = maintenanceService.GetTaskDetailsForTaskGroup(filterInfo).ToList();
                maintenanceService.Close();
                return output;
            }
            catch
            {
                maintenanceService.Abort();
                throw;
            }
        }

        public static bool UpdateMaintenanceTaskGroupInfo(MaintTaskGroupFilterInfo filterInfo)
        {
            MaintenanceServiceClient maintenanceService = new MaintenanceServiceClient();
            try
            {
                var output = maintenanceService.UpdateMaintenanceTaskGroupInfo(filterInfo);
                maintenanceService.Close();
                return output;
            }
            catch
            {
                maintenanceService.Abort();
                throw;
            }
        }

        public static int GetTaskGroupIdentifier(MaintTaskGroupFilterInfo filterInfo)
        {
            MaintenanceServiceClient maintenanceService = new MaintenanceServiceClient();
            try
            {
                int output = maintenanceService.GetTaskGroupIdentifier(filterInfo);
                maintenanceService.Close();
                return output;
            }
            catch
            {
                maintenanceService.Abort();
                throw;
            }
        }

        public static TaskGroupIdentifier UpdateMaintenanceTaskInfo(MaintTaskGroupFilterInfo filterInfo, TaskInfo taskInfo)
        {
            MaintenanceServiceClient maintenanceService = new MaintenanceServiceClient();
            try
            {
                TaskGroupIdentifier output = maintenanceService.UpdateMaintenanceTaskInfo(filterInfo, taskInfo);
                maintenanceService.Close();
                return output;
            }
            catch
            {
                maintenanceService.Abort();
                throw;
            }
        }
        #endregion

        #region Create Schedule

        public static ScheduleDetailInfo GetMaintScheduleDetailInfo(ScheduleFilterInfo filterInfo)
        {
            MaintenanceServiceClient maintenanceService = new MaintenanceServiceClient();
            try
            {
                var output = maintenanceService.GetMaintScheduleDetailInfo(filterInfo);
                maintenanceService.Close();
                return output;
            }
            catch
            {
                maintenanceService.Abort();
                throw;
            }
        }

        public static int InsertUpdateMaintenanceScheduleDetailInfo(ScheduleDetailInfo schdDetailInfo)
        {
            MaintenanceServiceClient maintenanceService = new MaintenanceServiceClient();
            try
            {
                var output = maintenanceService.InsertUpdateMaintenanceScheduleDetailInfo(schdDetailInfo);
                maintenanceService.Close();
                return output;
            }
            catch
            {
                maintenanceService.Abort();
                throw;
            }
        }

        public static bool ActivateMaintenanceSchedule(ScheduleFilterInfo filterInfo)
        {
            MaintenanceServiceClient maintenanceService = new MaintenanceServiceClient();
            try
            {
                var output = maintenanceService.ActivateMaintenanceSchedule(filterInfo);
                maintenanceService.Close();
                return output;
            }
            catch
            {
                maintenanceService.Abort();
                throw;
            }
        }

        public static bool InActivateMaintenanceSchedule(ScheduleFilterInfo filterInfo)
        {
            MaintenanceServiceClient maintenanceService = new MaintenanceServiceClient();
            try
            {
                var output = maintenanceService.InActivateMaintenanceSchedule(filterInfo);
                maintenanceService.Close();
                return output;
            }
            catch
            {
                maintenanceService.Abort();
                throw;
            }
        }

        public static ScheduleWorkOrderDetails GetScheduleWorkOrderDetails(ScheduleWorkOrderFilter filterInfo)
        {
            MaintenanceServiceClient maintenanceService = new MaintenanceServiceClient();
            try
            {
                var output = maintenanceService.GetScheduleWorkOrderDetails(filterInfo);
                maintenanceService.Close();
                return output;
            }
            catch
            {
                maintenanceService.Abort();
                throw;
            }
        }

        #endregion

        #region Maintenance checklist Schedule
        public static MeasurementDocumentInfo GetMeasurementDocumentInfo(MeasurementDocumentFilter filterInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                MeasurementDocumentInfo output = service.GetMeasurementDocumentInfo(filterInfo);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static MeasurementDocumentInfo GetMeasDocMeasuringPoints(MeasurementDocumentFilter filterInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                MeasurementDocumentInfo output = service.GetMeasDocMeasuringPoints(filterInfo);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static bool InsertSelectedMeasuringPoint(MeasusrementDocumentScheduleInfo measurementDocInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                bool output = service.InsertSelectedMeasuringPoint(measurementDocInfo);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static bool DeleteSelectedMeasuringPoint(MeasDocScheduleMeasPoint filterInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                bool output = service.DeleteSelectedMeasuringPoint(filterInfo);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }
        #endregion

        #region Spare Parts

        public static List<MaintSparePartInfo> GetSparePartMaterialDetails(BasicParam basicParam)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                List<MaintSparePartInfo> output = service.GetSparePartMaterialDetails(basicParam).ToList();
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static List<MaintSparePartInfo> GetMaintSparePartDetails(MaintenanceFilterInfo filterInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                List<MaintSparePartInfo> output = service.GetMaintSparePartDetails(filterInfo).ToList();
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static bool SaveMaintSparePartInfo(MaintSparePartDetails maintSparePartDetails)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                bool output = service.SaveMaintSparePartInfo(maintSparePartDetails);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static bool DeleteMaintSparePartInfo(MaintSparePartFilter filterInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                bool output = service.DeleteMaintSparePartInfo(filterInfo);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        #endregion

        #region Attachments

        public static List<DocumentInfo> GetAttachmentDetailsForSchedule(MaintenanceFilterInfo filterInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                List<DocumentInfo> output = service.GetAttachmentDetailsForSchedule(filterInfo).ToList();
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static List<DocumentInfo> GetAttachmentDetailsForWorkOrder(BasicParam basicParam, string workOrderNo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                List<DocumentInfo> output = service.GetAttachmentDetailsForWorkOrder(basicParam, workOrderNo).ToList();
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        #endregion
        #endregion

        #region Work Group
        public static List<AutoCompleteUserInfo> GetUserNameForAutoComplete(AutoCompleteSearch searchInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                List<AutoCompleteUserInfo> output = service.GetUserNameForAutoComplete(searchInfo).ToList();
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }
        public static WorkGroupInfo GetEditWorkGroupInfo(WorkGroupFilterInfo workGroupFilterInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                WorkGroupInfo output = service.GetEditWorkGroupInfo(workGroupFilterInfo);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }
        public static int InsertOrUpdateWorkGroupInfo(BasicParam basicParam, WorkGroupInfo workGroupInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                int output = service.InsertOrUpdateWorkGroupInfo(basicParam, workGroupInfo);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }
        public static int DeleteWorkGroupUserInfo(WorkGroupFilterInfo workGroupFilterInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                int output = service.DeleteWorkGroupUserInfo(workGroupFilterInfo);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }
        #region Download & Upload
        public static string DownloadWorkGroupExcelTemplateInfo(BasicParam basicParam)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                string output = service.DownloadWorkGroupExcelTemplateInfo(basicParam);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }
        public static string DownloadAllWorkGroupInfo(WorkGroupFilterInfo workGroupFilterInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                string output = service.DownloadAllWorkGroupInfo(workGroupFilterInfo);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }
        public static string UploadExcelWorkGroupInfo(BasicParam basicParam, string fileName)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                string output = service.UploadExcelWorkGroupInfo(basicParam, fileName);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }
        #endregion
        #endregion

        #region View Work Order

        #region Calendar

        public static List<UserWorkGroupInfo> GetUserWorkGroupInfo(BasicParam basicParam)
        {
            MaintenanceServiceClient maintenanceService = new MaintenanceServiceClient();
            try
            {
                List<UserWorkGroupInfo> output = maintenanceService.GetUserWorkGroupInfo(basicParam).ToList();
                maintenanceService.Close();
                return output;
            }
            catch
            {
                maintenanceService.Abort();
                throw;
            }
        }

        #endregion

        #region Resource View

        public static WorkOrderResourceViewInfo GetResourceViewWorkOrderInfo(WorkOrderResourceViewFilter filter)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                WorkOrderResourceViewInfo output = service.GetResourceViewWorkOrderInfo(filter);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        #endregion   

        public static WorkOrderBasicInfo GetWorkOrderBasicInfo(WorkOrderFilter filter)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                WorkOrderBasicInfo output = service.GetWorkOrderBasicInfo(filter);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static WorkOrderEquipmentInfo GetWorkOrderEquipmentInfo(WorkOrderFilter filter)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                WorkOrderEquipmentInfo output = service.GetWorkOrderEquipmentInfo(filter);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static WorkOrderEquipmentHistoryDetails GetWorkOrderEquipmentHistory(BasicParam basicParam, EquipmentHistoryFilter equipmentHistoryFilter)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                WorkOrderEquipmentHistoryDetails output = service.GetWorkOrderEquipmentHistory(basicParam, equipmentHistoryFilter);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static WorkOrderTaskDetails GetWorkOrderTaskInfo(WorkOrderFilter filter)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                WorkOrderTaskDetails output = service.GetWorkOrderTaskInfo(filter);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static TaskStartEndReturnInfo StartWorkOrderTask(WorkOrderTaskProcessInfo startTaskInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                TaskStartEndReturnInfo output = service.StartWorkOrderTask(startTaskInfo);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static TaskStartEndReturnInfo EndWorkOrderTask(WorkOrderTaskProcessInfo endTaskInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                TaskStartEndReturnInfo output = service.EndWorkOrderTask(endTaskInfo);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static int SaveTaskParameterValue(TaskParameterInfo taskParameter)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                int output = service.SaveTaskParameterValue(taskParameter);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static WorkOrderTaskImageInfo InsertWorkOrderTaskImage(WorkOrderTaskImageUploadInfo imageUploadInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                WorkOrderTaskImageInfo output = service.InsertWorkOrderTaskImage(imageUploadInfo);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static WorkOrderSparePartsInfo GetWorkOrderSpareParts(WorkOrderFilter filterInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                WorkOrderSparePartsInfo output = service.GetWorkOrderSpareParts(filterInfo);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }
        public static bool SaveWorkOrderSparePartInfo(MaintSparePartDetails filterInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                bool output = service.SaveWorkOrderSparePartInfo(filterInfo);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static bool CloseWorkOrderInfo(WorkOrderCloseInfo workOrderCloseFilter)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                bool output = service.CloseWorkOrderInfo(workOrderCloseFilter);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }
        #endregion

        #region Tools Info
        public static ToolsListInfo GetAllToolsInfo(ToolsFilterInfo filterInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                ToolsListInfo output = service.GetAllToolsInfo(filterInfo);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }
        public static int InsertOrUpdateToolInfo(BasicParam basicParam,ToolsInfo toolsInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                int output = service.InsertOrUpdateToolInfo(basicParam,toolsInfo);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }
        public static int DeleteToolsInfo(BasicParam basicParam, int toolID)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                int output = service.DeleteToolsInfo(basicParam, toolID);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }
        #endregion

        #region Configure Spare Parts
        public static string DownloadSparePartsTemplate(BasicParam basicParam)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                string output = service.DownloadSparePartsTemplate(basicParam);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static string DownloadSparePartsListExcel(SparePartsFilterInfo filter)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                string output = service.DownloadSparePartsListExcel(filter);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static string UploadSparePartsinfoExcel(BasicParam basicParam, string fileName)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                string output = service.UploadSparePartsinfoExcel(basicParam, fileName);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }
        #endregion

        #region Notification
        public static int InsertUpdateNotificationInfo(BasicParam basicParam, NotificationInfo notificationInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                int output = service.InsertUpdateNotificationInfo(basicParam, notificationInfo);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static NotificationList GetNotificationList(BasicParam basicParam, NotificationtFilter notificationFilter)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                NotificationList output = service.GetNotificationList(basicParam, notificationFilter);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static NotificationInfo GetNotificationInfo(BasicParam basicParam, int notificationID)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                NotificationInfo output = service.GetNotificationInfo(basicParam, notificationID);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static int DeleteNotificationInfo(BasicParam basicParam, int notificationID)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                int output = service.DeleteNotificationInfo(basicParam, notificationID);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static List<TypeValueInfo> GetEquipmentListForDropDown(EquipmentFilterInfo equipmentFilterInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                List<TypeValueInfo> output = service.GetEquipmentListForDropDown(equipmentFilterInfo).ToList();
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static List<DocumentInfo> GetAttachmentDetailsForNotification(BasicParam basicParam, int notificationID)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                List<DocumentInfo> output = service.GetAttachmentDetailsForNotification(basicParam, notificationID).ToList();
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static int GetNextNotificationSequenceID(BasicParam basicParam)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                int output = service.GetNextNotificationSequenceID(basicParam);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static int AcceptNotificationInfo(BasicParam basicParam, int notificationID)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                int output = service.AcceptNotificationInfo(basicParam, notificationID);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static int CloseNotificationInfo(BasicParam basicParam, NotificationInfo notificationInfo)
        {
            MaintenanceServiceClient service = new MaintenanceServiceClient();
            try
            {
                int output = service.CloseNotificationInfo(basicParam, notificationInfo);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }
        #endregion
    }
}