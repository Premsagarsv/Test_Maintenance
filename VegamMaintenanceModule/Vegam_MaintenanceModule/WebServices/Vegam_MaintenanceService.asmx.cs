using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Script.Services;
using System.Web.Services;
using Vegam_MaintenanceModule.UserControls;
using Vegam_MaintenanceModule.Vegam_MaintenanceService;
using VegamIOTDataSources;

namespace Vegam_MaintenanceModule.WebServices
{
    /// <summary>
    /// Summary description for Vegam_MaintenanceService
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class Vegam_MaintenanceService : System.Web.Services.WebService
    {
        #region Common
        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public DateTimeInfo GetSiteCurrentDateTime(int siteID)
        {
            return BLL.MaintenanceBLL.GetSiteCurrentDateTime(siteID);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public List<EnumTypeInfo> GetEnumInfoList(BasicParam basicParam, string EnumType)
        {
            return BLL.MaintenanceBLL.GetEnumInfoList(basicParam, EnumType);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public bool CheckFileExist(string fileName)
        {
            string logFilePath = ConfigurationManager.AppSettings["LogFileLocation"] + fileName;
            if (File.Exists(logFilePath))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public bool CheckDirectoryExist(string fileName)
        {
            string logFilePath = ConfigurationManager.AppSettings["LogFileLocation"] + fileName;
            if (Directory.Exists(logFilePath))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public int InsertOrUpdateUserPreference(UserPreferenceFilter filterInfo)
        {
            return BLL.MaintenanceBLL.InsertOrUpdateUserPreference(filterInfo);
        }
        #endregion

        #region Maintenance Feature
        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public List<MaintenanceFeatureInfo> GetMaintenanceFeatureInfo(BasicParam basicParam, string featureName)
        {
            return BLL.MaintenanceBLL.GetMaintenanceFeatureInfo(basicParam, featureName);
        }

        #endregion

        #region Dynamic Grid

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public ipas_CompanyService.DynamicGridFeatureFieldInfo GetDynamicGridFieldInfo(ipas_CompanyService.DynamicGridFilter gridfilter)
        {
            return BLL.MaintenanceBLL.GetDynamicGridFieldInfo(gridfilter);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public DynamicGridContent GetDynamicGridContent(ipas_CompanyService.DynamicGridFilter gridfilter, ipas_CompanyService.DynamicGridContentFilter gridContentFilter, UserControls.PagerData pagerData, bool enablePaging)
        {
            ipas_CompanyService.DynamicGridContentInfo dynamicGridContent = BLL.MaintenanceBLL.GetDynamicGridContent(gridfilter, gridContentFilter);

            DynamicGridContent content = new DynamicGridContent();
            content.GridRowList = dynamicGridContent.DynamicGridRowInfoList;
            content.TotalRecords = dynamicGridContent.TotalRecords;
            content.LastRowIndex = dynamicGridContent.LastRowIndex;
            if (enablePaging == true)
            {
                string userControlPath = ConfigurationManager.AppSettings["MaintUserControls"].TrimEnd('/');
                content.HTMLPager = CommonBLL.RenderPagerHTML(userControlPath, pagerData, dynamicGridContent.TotalRecords);
            }
            return content;
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public List<ipas_CompanyService.TypeValueInfo> GetFilterTypeValues(ipas_CompanyService.DynamicGridFilter filter, ipas_CompanyService.DynamicGridTypeValueFilter typeValueFilter)
        {
            return BLL.MaintenanceBLL.GetFilterTypeValues(filter, typeValueFilter);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public CalendarHeader LoadDayViewCalendaHeader(int currentValue, UserControls.DisplayMode displayMode)
        {
            CalendarHeader calendarHeader = new CalendarHeader();
            string selectedDate = CommonBLL.GetChangedDate(currentValue.ToString(), displayMode);
            calendarHeader.selevetedValue = selectedDate;
            calendarHeader.HeaderText = CommonBLL.GetCalenderDayDisplayFormat(selectedDate.Trim());
            return calendarHeader;
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string DynamicGridContentExcelDownload(ipas_CompanyService.DynamicGridFilter filter, ipas_CompanyService.DynamicGridContentFilter contentFilter)
        {
            return BLL.MaintenanceBLL.DynamicGridContentExcelDownload(filter, contentFilter);
        }

        #region UserView

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public List<ipas_CompanyService.UserViewFieldInfo> GetUserViewFields(ipas_CompanyService.DynamicGridFilter filter)
        {
            return BLL.MaintenanceBLL.GetUserViewFields(filter);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public int InserUserView(ipas_CompanyService.DynamicGridFilter filter, ipas_CompanyService.UserViewInfo userViewInfo)
        {
            return BLL.MaintenanceBLL.InserUserView(filter, userViewInfo);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public bool DeleteUserView(ipas_CompanyService.DynamicGridFilter filter)
        {
            return BLL.MaintenanceBLL.DeleteUserView(filter);
        }

        #endregion
        #endregion

        #region Generate Code
        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string GenerateRandomCode(BasicParam basicParam, InfoType infoType)
        {
            return BLL.MaintenanceBLL.GenerateRandomCode(basicParam, infoType);
        }
        #endregion

        #region Functional Location Info
        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public FunctionalLocationData GetAllFunctionalLocInfo(PagerData pagerData, FLocationFilterInfo locationFilterInfo)
        {
            FLocationListInfo FunctionalLocationListInfo = BLL.MaintenanceBLL.GetAllFunctionalLocInfo(locationFilterInfo);
            FunctionalLocationData data = new FunctionalLocationData();
            string userControlPath = ConfigurationManager.AppSettings["MaintUserControls"].TrimEnd('/');
            data.FunctionalLocationList = FunctionalLocationListInfo.FunctionalLocationListInfo;
            if (pagerData != null)
                data.HTMLPager = CommonBLL.RenderPagerHTML(userControlPath, pagerData, FunctionalLocationListInfo.TotalRecords);
            return data;
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public FunctionalLocationInfoListData GetAllFunctionalLocList(PagerData pagerData, FLocationFilterInfo filterFLocationInfo)
        {
            FLocationListDetails functionalLocationListInfo = BLL.MaintenanceBLL.GetAllFunctionalLocList(filterFLocationInfo);
            FunctionalLocationInfoListData data = new FunctionalLocationInfoListData();
            data.FLocationListInfo = functionalLocationListInfo.FunctionalLocationListInfo;
            if (pagerData != null)
            {
                string userControlPath = ConfigurationManager.AppSettings["MaintUserControls"].TrimEnd('/');
                data.HTMLPager = CommonBLL.RenderPagerHTML(userControlPath, pagerData, functionalLocationListInfo.TotalRecords);
            }
            return data;
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public FLocationInfo GetFLocationEditInfo(BasicParam basicParam, int fLocationID)
        {
            return BLL.MaintenanceBLL.GetFLocationEditInfo(basicParam, fLocationID);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public AddFLocationReturnInfo InsertOrUpdateFunctionalLocInfo(BasicParam basicParam, FLocationInfo functionalLocInfo)
        {
            return BLL.MaintenanceBLL.InsertOrUpdateFunctionalLocInfo(basicParam, functionalLocInfo);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public int DeleteFunctionalLocInfo(BasicParam basicParam, int functionalLocationID)
        {
            return BLL.MaintenanceBLL.DeleteFunctionalLocInfo(basicParam, functionalLocationID);
        }


        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public List<HierarchicalListInfo> GetFunctionalLocListForHierarchicalDropDown(FLocationFilterInfo fLocationFilterInfo)
        {
            return BLL.MaintenanceBLL.GetFunctionalLocListForHierarchicalDropDown(fLocationFilterInfo);
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public List<LocationWorkGroupInfo> GetParentLocationDropDown(FLocationFilterInfo fLocationFilterInfo)
        {
            return BLL.MaintenanceBLL.GetParentLocationDropDown(fLocationFilterInfo);
        }

        [WebMethod]
        public List<TypeValueInfo> GetUserWorkGroups(BasicParam basicParam)
        {
            return BLL.MaintenanceBLL.GetUserWorkGroups(basicParam);
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public FunctionalLocationData GetAllFuncLocForSchedule(PagerData pagerData, FLocationFilterInfo filterFLocationInfo)
        {
            FLocationListInfo fLocationListDetails = BLL.MaintenanceBLL.GetAllFuncLocForSchedule(filterFLocationInfo);
            FunctionalLocationData data = new FunctionalLocationData();
            data.FunctionalLocationList = fLocationListDetails.FunctionalLocationListInfo;
            if (pagerData != null)
            {
                string userControlPath = ConfigurationManager.AppSettings["MaintUserControls"].TrimEnd('/');
                data.HTMLPager = CommonBLL.RenderPagerHTML(userControlPath, pagerData, fLocationListDetails.TotalRecords);
            }
            return data;
        }
        #region Download & Upload

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public string DownloadFunctionalLocationInfo(FLocationFilterInfo locationFilterInfo)
        {
            return BLL.MaintenanceBLL.DownloadFunctionalLocationInfo(locationFilterInfo);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string DownloadFunctionalLocationTemplate(Vegam_MaintenanceModule.Vegam_MaintenanceService.BasicParam basicParam)
        {
            return BLL.MaintenanceBLL.DownloadFunctionalLocationTemplate(basicParam);
        }
        #endregion

        #endregion

        #region Equipment Details Info

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public EquipmentData GetAllEquipmentInfo(PagerData pagerData, EquipmentFilterInfo equipmentFilterInfo)
        {
            EquipmentListInfo EquipmentList = BLL.MaintenanceBLL.GetAllEquipmentInfo(equipmentFilterInfo);
            EquipmentData data = new EquipmentData();
            data.EquipmentList = EquipmentList.EquipmentList;
            if (pagerData.PageSize > 0)
            {
                string userControlPath = ConfigurationManager.AppSettings["MaintUserControls"].TrimEnd('/');
                data.HTMLPager = CommonBLL.RenderPagerHTML(userControlPath, pagerData, EquipmentList.TotalRecords);
            }
            return data;
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public EquipmentInfoListData GetEquipmentInfoList(PagerData pagerData, EquipmentFilterInfo equipmentFilterInfo)
        {
            EquipmentDetailList equipmentInfoList = BLL.MaintenanceBLL.GetEquipmentInfoList(equipmentFilterInfo);
            EquipmentInfoListData data = new EquipmentInfoListData();
            data.EquipmentDetailList = equipmentInfoList;
            if (pagerData != null)
            {
                string userControlPath = ConfigurationManager.AppSettings["MaintUserControls"].TrimEnd('/');
                data.HTMLPager = CommonBLL.RenderPagerHTML(userControlPath, pagerData, equipmentInfoList.TotalRecords);
            }
            return data;
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public EquipmentDetailsInfo GetEquipmentEditInfo(EquipmentFilterInfo equipmentFilterInfo)
        {
            return BLL.MaintenanceBLL.GetEquipmentEditInfo(equipmentFilterInfo);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public AddFLocationReturnInfo InsertOrUpdateEquipmentInfo(BasicParam basicParam, EquipmentDetailsInfo equipmentDetailsInfo)
        {
            return BLL.MaintenanceBLL.InsertOrUpdateEquipmentInfo(basicParam, equipmentDetailsInfo);

        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public int DeleteEquipmentInfo(BasicParam basicParam, int equipmentID)
        {
            return BLL.MaintenanceBLL.DeleteEquipmentInfo(basicParam, equipmentID);
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public List<KeyValueInfo> GetResourceInfo(BasicParam basicParam)
        {
            return BLL.MaintenanceBLL.GetResourceInfo(basicParam);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public int DeleteEquipmentSupportInfo(EquipmentSupportInfo supportInfoFilter)
        {
            return BLL.MaintenanceBLL.DeleteEquipmentSupportInfo(supportInfoFilter);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public EquipmentModelData GetAllEquipmentModelList(PagerData pagerData, EquipmentFilterInfo equipmentFilterInfo)
        {
            EquipmentModelListDetails equipmentModelListInfo = BLL.MaintenanceBLL.GetAllEquipmentModelList(equipmentFilterInfo);
            EquipmentModelData data = new EquipmentModelData();
            data.EquipmentModelList = equipmentModelListInfo.EquipmentModelInfoList;
            if (pagerData.PageSize > 0)
            {
                string userControlPath = ConfigurationManager.AppSettings["MaintUserControls"].TrimEnd('/');
                data.HTMLPager = CommonBLL.RenderPagerHTML(userControlPath, pagerData, equipmentModelListInfo.TotalRecords);
            }
            return data;
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public List<EquipmentDetail> GetParentEquipmentListDropDown(EquipmentFilterInfo parentEquipmentFilter)
        {
            return BLL.MaintenanceBLL.GetParentEquipmentListDropDown(parentEquipmentFilter);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public EquipmentData GetAllEquipmentLocationInfoSchedule(PagerData pagerData, EquipmentFilterInfo equipmentFilterInfo)
        {
            EquipmentListInfo EquipmentList = BLL.MaintenanceBLL.GetAllEquipmentLocationInfoSchedule(equipmentFilterInfo);
            EquipmentData data = new EquipmentData();
            data.EquipmentList = EquipmentList.EquipmentList;
            if (pagerData.PageSize > 0)
            {
                string userControlPath = ConfigurationManager.AppSettings["MaintUserControls"].TrimEnd('/');
                data.HTMLPager = CommonBLL.RenderPagerHTML(userControlPath, pagerData, EquipmentList.TotalRecords);
            }
            return data;
        }

        #region Download & Upload
        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string DownloadEquipmentTemplate(BasicParam basicParam)
        {
            return BLL.MaintenanceBLL.DownloadEquipmentTemplate(basicParam);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string DownloadEquipmentInfo(EquipmentFilterInfo equipmentFilterInfo)
        {
            return BLL.MaintenanceBLL.DownloadEquipmentInfo(equipmentFilterInfo);
        }

        #endregion

        #endregion

        #region  Equipment Model Info
        [System.Web.Services.WebMethod(EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public int InsertOrUpdateEquipmentModelInfo(BasicParam basicParam, EquipmentDetailsInfo equipmentDetailsInfo)
        {
            return BLL.MaintenanceBLL.InsertOrUpdateEquipmentModelInfo(basicParam, equipmentDetailsInfo);

        }

        [System.Web.Services.WebMethod(EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public ModelListInfoData GetEquipmentModelList(PagerData pagerData, EquipmentFilterInfo equipmentFilterInfo)
        {
            ModelListInfoData data = new ModelListInfoData();
            string userControlPath = ConfigurationManager.AppSettings["MaintUserControls"].TrimEnd('/');
            EquipmentModelListInfo equipmentModelListInfo = BLL.MaintenanceBLL.GetEquipmentModelList(equipmentFilterInfo);
            data.EquipmentModeListlInfo = equipmentModelListInfo;
            data.HTMLPager = CommonBLL.RenderPagerHTML(userControlPath, pagerData, equipmentModelListInfo.TotalRecords);

            return data;
        }

        [System.Web.Services.WebMethod(EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public EquipmentModelInfo GetEquipmentModelInfo(EquipmentFilterInfo equipmentFilterInfo)
        {
            return BLL.MaintenanceBLL.GetEquipmentModelInfo(equipmentFilterInfo);
        }

        [System.Web.Services.WebMethod(EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public int DeleteEquipmentModelInfo(BasicParam basicParam, int equipmentModelID)
        {
            return BLL.MaintenanceBLL.DeleteEquipmentModelInfo(basicParam, equipmentModelID);
        }
        #endregion

        #region Measuring Point Info
        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public List<TypeValueInfo> GetSensorTypeInfo(BasicParam basicParam)
        {
            return BLL.MaintenanceBLL.GetSensorTypeInfo(basicParam);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public List<TypeValueInfo> GetSensorUnitInfo(BasicParam basicParam, int sensorTypeID)
        {
            return BLL.MaintenanceBLL.GetSensorUnitInfo(basicParam, sensorTypeID);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public MeasuringPointListDetails GetMeasuringPointList(UserControls.PagerData pagerData, MeasuringPointFilter measuringPointfilter)
        {
            MeasuringPointListDetails data = new MeasuringPointListDetails();
            string userControlPath = ConfigurationManager.AppSettings["MaintUserControls"].TrimEnd('/');
            MeasuringPointListInfo measuringPointList = BLL.MaintenanceBLL.GetMeasuringPointList(measuringPointfilter);
            data.MeasuringPointInfoList = measuringPointList.MeasuringPointList;
            data.HTMLPager = CommonBLL.RenderPagerHTML(userControlPath, pagerData, measuringPointList.TotalRecords);
            return data;
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public int InsertUpdateMeasuringPointInfo(BasicParam basicParam, MeasuringPoint measuringPointInfo)
        {
            return BLL.MaintenanceBLL.InsertUpdateMeasuringPointInfo(basicParam, measuringPointInfo);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public MeasuringPoint GetSelectedMeasuringPointInfo(BasicParam basicParam, int measuringPointID)
        {
            return BLL.MaintenanceBLL.GetSelectedMeasuringPointInfo(basicParam, measuringPointID);

        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public int DeleteMeasuringPointInfo(BasicParam basicParam, int measuringPointID)
        {
            return BLL.MaintenanceBLL.DeleteMeasuringPointInfo(basicParam, measuringPointID);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public MeasuringPointDataTypeList GetMeasuringPointDropDownDataInfo(MeasuringPointDataTypeFilterInfo measuringPointDataTypeFilterInfo)
        {
            return BLL.MaintenanceBLL.GetMeasuringPointDropDownDataInfo(measuringPointDataTypeFilterInfo);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public List<TreeNode> LoadOPCUUIDInfoTags(string nodeId, int index, int siteID, int dataSourceID, int gatewayServiceID, TagFilterInfo opcTagFilterInfo = null)
        {
            List<TreeNode> listOfNodes = new List<TreeNode>();
            List<ServerInfo> opcServerInfo = new List<ServerInfo>();
            JavaScriptSerializer apiSerialize = new JavaScriptSerializer();
            try
            {
                string restAPIPath = ConfigurationManager.AppSettings["VegamViewServicePath"].TrimEnd('/') + "/GetServerInfoList";
                var webrequest = (System.Net.HttpWebRequest)WebRequest.Create(string.Format(restAPIPath));
                webrequest.Method = "POST";
                webrequest.ContentType = "application/json; charset=utf-8";
                webrequest.Timeout = 100000;
                webrequest.KeepAlive = true;
                var restAPIInputParametes = new { siteID = siteID, dataSourceID = dataSourceID, gatewayServiceID = gatewayServiceID, opcTagFilterInfo = opcTagFilterInfo };
                string restAPIInputString = apiSerialize.Serialize(restAPIInputParametes);
                using (var streamWriter = new StreamWriter(webrequest.GetRequestStream()))
                {
                    streamWriter.Write(restAPIInputString);
                    streamWriter.Flush();
                    streamWriter.Close();
                }

                using (StreamReader responseReader = new StreamReader(webrequest.GetResponse().GetResponseStream()))
                {
                    string opcUUIDNodeResponse = responseReader.ReadToEnd();
                    opcServerInfo = apiSerialize.Deserialize<List<ServerInfo>>(opcUUIDNodeResponse);
                    responseReader.Close();
                }
                listOfNodes = ConstructOPCNodeTree(nodeId, index, opcTagFilterInfo.ServerID, opcServerInfo);
                return listOfNodes;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<TreeNode> ConstructOPCNodeTree(string nodeID, int index, int serverID, List<ServerInfo> opcUUIDServerInfoList)
        {
            List<TreeNode> nodeTree = new List<TreeNode>();
            try
            {
                if (opcUUIDServerInfoList.Count > 0)
                {
                    foreach (ServerInfo objOPCUUIDServerInfo in opcUUIDServerInfoList)
                    {
                        if (serverID > 0)
                        {
                            foreach (TagInfo objOPCUUIDTagInfo in objOPCUUIDServerInfo.TagInfoList)
                            {
                                OPCNode node = new OPCNode(); // Binding the tags for the Server
                                OPCNodeData nodeData = new OPCNodeData();
                                index++;
                                nodeData.opcNodeId = objOPCUUIDTagInfo.TagUUID.ToString();
                                nodeData.description = objOPCUUIDTagInfo.TagName;
                                nodeData.GatewayID = 0;
                                nodeData.dataType = string.Empty;
                                nodeData.isVariable = true;
                                nodeData.index = index;
                                node.data = nodeData;
                                node.id = index;
                                node.icon = "icon-leaf"; //"http://jstree.com/tree.png";
                                if (string.IsNullOrEmpty(nodeID))
                                {
                                    node.parent = "#";
                                }
                                else
                                {
                                    node.parent = nodeID;
                                }
                                node.text = objOPCUUIDTagInfo.TagName;
                                node.children = false; // Tags will not have child
                                nodeTree.Add(node);
                            }
                        }
                        else if (serverID == 0) // Binding the server list
                        {

                            OPCNode node = new OPCNode();
                            OPCNodeData nodeData = new OPCNodeData();
                            index++;
                            nodeData.opcNodeId = objOPCUUIDServerInfo.ServerID.ToString();
                            nodeData.description = objOPCUUIDServerInfo.ServerName.ToString();
                            nodeData.GatewayID = objOPCUUIDServerInfo.GatewayServiceID;
                            nodeData.ServerID = objOPCUUIDServerInfo.ServerID;
                            nodeData.dataType = string.Empty;
                            nodeData.isVariable = false;
                            nodeData.index = index;
                            node.data = nodeData;
                            node.id = index;
                            if (string.IsNullOrEmpty(nodeID))
                            {
                                node.parent = "#";
                            }
                            else
                            {
                                node.parent = nodeID;
                            }
                            node.text = objOPCUUIDServerInfo.ServerName.ToString();
                            node.children = true;
                            nodeTree.Add(node);

                        }
                    }
                }
            }
            catch (Exception ex)
            {
                TreeNode node = new TreeNode();
                OPCNodeData nodeData = new OPCNodeData();
                nodeData.error = ex.ToString();
                nodeTree.Add(node);
                throw;
            }

            return nodeTree;
        }


        #region Download & Uplaod
        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string DownloadMeasuringPointListTemplate(Vegam_MaintenanceModule.Vegam_MaintenanceService.BasicParam basicParam)
        {
            return BLL.MaintenanceBLL.DownloadMeasuringPointListTemplate(basicParam);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string DownloadMeasuringPointListExcel(MeasuringPointFilterInfo filter)
        {
            return BLL.MaintenanceBLL.DownloadMeasuringPointListExcel(filter);
        }
        #endregion

        #endregion

        #region Document,Image And Video Info

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public List<DocumentInfo> GetAllDocumentsAndImagesInfo(DocumentBasicInfo filterInfo)
        {
            return BLL.MaintenanceBLL.GetAllDocumentsAndImagesInfo(filterInfo);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public int InsertDocumentsAndImagesInfo(DocumentFilterInfo filterInfo)
        {
            return BLL.MaintenanceBLL.InsertDocumentsAndImagesInfo(filterInfo);
        }


        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public int DeleteDocumentsAndImagesInfo(BasicParam basicParam, int documentID)
        {
            return BLL.MaintenanceBLL.DeleteDocumentsAndImagesInfo(basicParam, documentID);
        }
        #endregion

        #region Category,Class,Manufacturer,Equipment Type
        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public MasterDataList GetMaintMasterData(BasicParam basicParam, MasterDataFilterInfo masterDataFilterInfo)
        {
            return BLL.MaintenanceBLL.GetMaintMasterData(basicParam, masterDataFilterInfo);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public MaintMasterDataInfo GetMaintMasterDataWithPager(PagerData pagerData, BasicParam basicParam, MasterDataFilterInfo masterDataFilterInfo)
        {
            MasterDataList masterDataList = BLL.MaintenanceBLL.GetMaintMasterData(basicParam, masterDataFilterInfo);
            MaintMasterDataInfo data = new MaintMasterDataInfo();
            string userControlPath = ConfigurationManager.AppSettings["MaintUserControls"].TrimEnd('/');
            data.MasterDataInfoList = masterDataList.MasterDataInfoList;
            data.TotalMasterDataCount = masterDataList.TotalMasterDataCount;
            if (pagerData != null)
                data.HTMLPager = CommonBLL.RenderPagerHTML(userControlPath, pagerData, masterDataList.TotalMasterDataCount);
            return data;
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public MasterDataDropDownList GetAllMaintMasterDropDownDataInfo(BasicParam basicParam, MasterDataDropDownListFilterInfo masterDataDropDownListFilterInfo)
        {
            return BLL.MaintenanceBLL.GetAllMaintMasterDropDownDataInfo(basicParam, masterDataDropDownListFilterInfo);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public int InsertUpdateMasterData(BasicParam basicParam, MasterDataInfo masterDataInfo)
        {
            return BLL.MaintenanceBLL.InsertUpdateMasterData(basicParam, masterDataInfo);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public int DeleteMasterData(BasicParam basicParam, MasterDataInfo masterDataInfo)
        {
            return BLL.MaintenanceBLL.DeleteMasterData(basicParam, masterDataInfo);
        }
        #endregion

        #region TaskGroup Info
        #region TaskGroup
        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public TaskGroupBasicInfo GetTaskGroupInfo(BasicParam basicParam, TaskGroupFilterInfo taskGroupFilterInfo)
        {
            return BLL.MaintenanceBLL.GetTaskGroupInfo(basicParam, taskGroupFilterInfo);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public TaskGroupIdentifier SaveTaskGroupInfo(BasicParam basicParam, TaskGroupBasicInfo taskGroupInfo)
        {
            return BLL.MaintenanceBLL.SaveTaskGroupInfo(basicParam, taskGroupInfo);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public int DeleteTaskGroupInfo(BasicParam basicParam, TaskGroupFilterInfo taskGroupfilterInfo)
        {
            return BLL.MaintenanceBLL.DeleteTaskGroupInfo(basicParam, taskGroupfilterInfo);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public int ApproveGroupTask(BasicParam basicParam, TaskGroupFilterInfo taskGroupfilterInfo)
        {
            return BLL.MaintenanceBLL.ApproveGroupTask(basicParam, taskGroupfilterInfo);
        }
        #endregion

        #region Task
        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public List<TaskInfo> GetTaskInfo(BasicParam basicParam, TaskGroupFilterInfo taskFilterInfo)
        {
            return BLL.MaintenanceBLL.GetTaskInfo(basicParam, taskFilterInfo);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public TaskGroupIdentifier SaveTaskInfo(BasicParam basicParam, TaskGroupFilterInfo taskGroupFilterInfo, TaskInfo taskInfo)
        {
            return BLL.MaintenanceBLL.SaveTaskInfo(basicParam, taskGroupFilterInfo, taskInfo);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public TaskGroupIdentifier DeleteTaskInfo(BasicParam basicParam, TaskGroupFilterInfo filterInfo)
        {
            return BLL.MaintenanceBLL.DeleteTaskInfo(basicParam, filterInfo);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public TaskGroupIdentifier SaveTaskSequenceInfo(BasicParam basicParam, TaskGroupFilterInfo filterInfo, List<TaskBasicInfo> taskBasicInfoList)
        {
            return BLL.MaintenanceBLL.SaveTaskSequenceInfo(basicParam, filterInfo, taskBasicInfoList);
        }
        #endregion

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public List<InstructionSelectorInfo> GetPPIDetails(BasicParam basicParam)
        {
            return BLL.MaintenanceBLL.GetPPIDetails(basicParam);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public List<InstructionSelectorInfo> GetToolsDetails(BasicParam basicParam)
        {
            return BLL.MaintenanceBLL.GetToolsDetails(basicParam);
        }

        #region Download Template
        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string DownloadSOPTemplate(Vegam_MaintenanceModule.Vegam_MaintenanceService.BasicParam basicParam)
        {
            return BLL.MaintenanceBLL.DownloadSOPTemplate(basicParam);
        } 
        #endregion
        #endregion

        #region Maintenance Schedule & Work Order

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public MaintenanceIdentityInfo InsertUpdateMaintenanceInfo(MaintenanceInfo maintenanceInfo)
        {
            return BLL.MaintenanceBLL.InsertUpdateMaintenanceInfo(maintenanceInfo);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public MaintenanceInfo GetMaintenanceInfo(MaintenanceFilterInfo filterInfo)
        {
            return BLL.MaintenanceBLL.GetMaintenanceInfo(filterInfo);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public int DeleteMaintenanceInfo(MaintenanceFilterInfo filterInfo)
        {
            return BLL.MaintenanceBLL.DeleteMaintenanceInfo(filterInfo);
        }


        [WebMethod]
        public List<TypeValueInfo> GetWorkGroupOfEquipemntOrLocation(MaintWorkGroupFilter filterInfo)
        {
            return BLL.MaintenanceBLL.GetWorkGroupOfEquipemntOrLocation(filterInfo);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public bool CancelmaintenanceWorkOrder(MaintenanceFilterInfo filterInfo)
        {
            return BLL.MaintenanceBLL.CancelmaintenanceWorkOrder(filterInfo);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public bool UpdateMaintWorkOrderScheduleDateTime(MaintenanceFilterInfo filterInfo)
        {
            return BLL.MaintenanceBLL.UpdateMaintWorkOrderScheduleDateTime(filterInfo);
        }

        #region Work Instruction

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public List<MaintTaskGroupInfo> GetTaskGroupList(MaintTaskGroupFilterInfo filterInfo)
        {
            return BLL.MaintenanceBLL.GetTaskGroupList(filterInfo);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public List<MaintTaskInfo> GetTaskDetailsForTaskGroup(MaintTaskGroupFilterInfo filterInfo)
        {
            return BLL.MaintenanceBLL.GetTaskDetailsForTaskGroup(filterInfo);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public bool UpdateMaintenanceTaskGroupInfo(MaintTaskGroupFilterInfo filterInfo)
        {
            return BLL.MaintenanceBLL.UpdateMaintenanceTaskGroupInfo(filterInfo);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public int GetTaskGroupIdentifier(MaintTaskGroupFilterInfo filterInfo)
        {
            return BLL.MaintenanceBLL.GetTaskGroupIdentifier(filterInfo);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public TaskGroupIdentifier UpdateMaintenanceTaskInfo(MaintTaskGroupFilterInfo filterInfo, TaskInfo taskInfo)
        {
            return BLL.MaintenanceBLL.UpdateMaintenanceTaskInfo(filterInfo, taskInfo);
        }

        #endregion

        #region Create Schedule

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public ScheduleDetailInfo GetMaintScheduleDetailInfo(ScheduleFilterInfo filterInfo)
        {
            return BLL.MaintenanceBLL.GetMaintScheduleDetailInfo(filterInfo);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public int InsertUpdateMaintenanceScheduleDetailInfo(ScheduleDetailInfo schdDetailInfo)
        {
            return BLL.MaintenanceBLL.InsertUpdateMaintenanceScheduleDetailInfo(schdDetailInfo);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public bool ActivateMaintenanceSchedule(ScheduleFilterInfo filterInfo)
        {
            return BLL.MaintenanceBLL.ActivateMaintenanceSchedule(filterInfo);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public bool InActivateMaintenanceSchedule(ScheduleFilterInfo filterInfo)
        {
            return BLL.MaintenanceBLL.InActivateMaintenanceSchedule(filterInfo);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public ScheduleWorkOrderDetailInfo GetScheduleWorkOrderDetails(PagerData pagerData, ScheduleWorkOrderFilter filterInfo)
        {
            ScheduleWorkOrderDetails scheduleWorkOrderDetails = BLL.MaintenanceBLL.GetScheduleWorkOrderDetails(filterInfo);
            ScheduleWorkOrderDetailInfo data = new ScheduleWorkOrderDetailInfo();
            data.ScheduleWorkOrderDetails = scheduleWorkOrderDetails;
            if (pagerData.PageSize > 0)
            {
                string userControlPath = ConfigurationManager.AppSettings["MaintUserControls"].TrimEnd('/');
                data.HTMLPager = CommonBLL.RenderPagerHTML(userControlPath, pagerData, scheduleWorkOrderDetails.TotalRecords);
            }
            return data;
        }
        #endregion

        #region Maintenance checklist Schedule
        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public MeasurementDocumentData GetMeasurementDocumentInfo(MeasurementDocumentFilter filterInfo)
        {
            MeasurementDocumentInfo measurementDocumentInfo = BLL.MaintenanceBLL.GetMeasurementDocumentInfo(filterInfo);
            MeasurementDocumentData data = new MeasurementDocumentData();
            string userControlPath = ConfigurationManager.AppSettings["MaintUserControls"].TrimEnd('/');
            data.MeasurementDocName = measurementDocumentInfo.MeasDocName;
            data.WorkGroupID = measurementDocumentInfo.WorkGroupID;
            data.ScheduleDetailID = measurementDocumentInfo.ScheduleDetailID;
            data.ScheduleStatus = measurementDocumentInfo.ScheduleStatus;
            data.MeasuringPointList = measurementDocumentInfo.MeasPointsList;
            return data;
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public MeasurementDocumentData GetMeasDocMeasuringPoints(MeasurementDocumentFilter filterInfo, PagerData pagerData)
        {
            MeasurementDocumentInfo measurementDocumentInfo = BLL.MaintenanceBLL.GetMeasDocMeasuringPoints(filterInfo);
            MeasurementDocumentData data = new MeasurementDocumentData();
            string userControlPath = ConfigurationManager.AppSettings["MaintUserControls"].TrimEnd('/');
            data.MeasuringPointList = measurementDocumentInfo.MeasPointsList;

            if (pagerData != null)
                data.HTMLPager = CommonBLL.RenderPagerHTML(userControlPath, pagerData, measurementDocumentInfo.TotalRecords);
            return data;
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public bool InsertSelectedMeasuringPoint(MeasusrementDocumentScheduleInfo measurementDocInfo)
        {
            return BLL.MaintenanceBLL.InsertSelectedMeasuringPoint(measurementDocInfo); ;
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public bool DeleteSelectedMeasuringPoint(MeasDocScheduleMeasPoint filterInfo)
        {
            return BLL.MaintenanceBLL.DeleteSelectedMeasuringPoint(filterInfo); ;
        }
        #endregion

        #region Spare Parts

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public List<MaintSparePartInfo> GetSparePartMaterialDetails(BasicParam basicParam)
        {
            return BLL.MaintenanceBLL.GetSparePartMaterialDetails(basicParam);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public List<MaintSparePartInfo> GetMaintSparePartDetails(MaintenanceFilterInfo filterInfo)
        {
            return BLL.MaintenanceBLL.GetMaintSparePartDetails(filterInfo);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public bool SaveMaintSparePartInfo(MaintSparePartDetails maintSparePartDetails)
        {
            return BLL.MaintenanceBLL.SaveMaintSparePartInfo(maintSparePartDetails);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public bool DeleteMaintSparePartInfo(MaintSparePartFilter filterInfo)
        {
            return BLL.MaintenanceBLL.DeleteMaintSparePartInfo(filterInfo);
        }

        #endregion

        #region Attachments

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public List<DocumentInfo> GetAttachmentDetailsForSchedule(MaintenanceFilterInfo filterInfo)
        {
            return BLL.MaintenanceBLL.GetAttachmentDetailsForSchedule(filterInfo);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public List<DocumentInfo> GetAttachmentDetailsForWorkOrder(BasicParam basicParam, string workOrderNo)
        {
            return BLL.MaintenanceBLL.GetAttachmentDetailsForWorkOrder(basicParam, workOrderNo);
        }

        #endregion

        #endregion

        #region Work Group
        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public List<AutoCompleteUserInfo> GetUserNameForAutoComplete(AutoCompleteSearch searchInfo)
        {
            return BLL.MaintenanceBLL.GetUserNameForAutoComplete(searchInfo);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public WorkGroupInfo GetEditWorkGroupInfo(WorkGroupFilterInfo workGroupFilterInfo)
        {
            return BLL.MaintenanceBLL.GetEditWorkGroupInfo(workGroupFilterInfo);

        }
        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public int InsertOrUpdateWorkGroupInfo(BasicParam basicParam, WorkGroupInfo workGroupInfo)
        {
            return BLL.MaintenanceBLL.InsertOrUpdateWorkGroupInfo(basicParam, workGroupInfo);

        }
        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public int DeleteWorkGroupUserInfo(WorkGroupFilterInfo workGroupUserFilter)
        {
            return BLL.MaintenanceBLL.DeleteWorkGroupUserInfo(workGroupUserFilter);
        }

        #region Download & Upload
        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string DownloadWorkGroupExcelTemplateInfo(Vegam_MaintenanceModule.Vegam_MaintenanceService.BasicParam basicParam)
        {
            return BLL.MaintenanceBLL.DownloadWorkGroupExcelTemplateInfo(basicParam);
        }
        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public string DownloadAllWorkGroupInfo(WorkGroupFilterInfo workGroupFilterInfo)
        {
            return BLL.MaintenanceBLL.DownloadAllWorkGroupInfo(workGroupFilterInfo);
        }
        #endregion
        #endregion

        #region View Work Order

        #region Calendar

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public List<UserWorkGroupInfo> GetUserWorkGroupInfo(BasicParam basicParam)
        {
            return BLL.MaintenanceBLL.GetUserWorkGroupInfo(basicParam);
        }

        #endregion

        #region Resource View

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public MaintResourceViewDataInfo GetResourceViewWorkOrderInfo(PagerData pagerData,WorkOrderResourceViewFilter filter)
        {
            WorkOrderResourceViewInfo masterDataList = BLL.MaintenanceBLL.GetResourceViewWorkOrderInfo(filter);
            MaintResourceViewDataInfo data = new MaintResourceViewDataInfo();
            string userControlPath = ConfigurationManager.AppSettings["MaintUserControls"].TrimEnd('/');
            data.WorkOrderTimelineEventList = masterDataList.eventInfoList;
            data.FunctionalLocationEquipmentList = masterDataList.FunctionalLocationEquipmentList;
            data.MonthYear = masterDataList.MonthYear;
            data.TotalMasterDataCount = masterDataList.TotalRecords;
            if (pagerData != null)
                data.HTMLPager = CommonBLL.RenderPagerHTML(userControlPath, pagerData, masterDataList.TotalRecords);
            return data;
        }

        #endregion
        
        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public WorkOrderBasicInfo GetWorkOrderBasicInfo(WorkOrderFilter filter)
        {
            return BLL.MaintenanceBLL.GetWorkOrderBasicInfo(filter);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public WorkOrderEquipmentInfo GetWorkOrderEquipmentInfo(WorkOrderFilter filter)
        {
            return BLL.MaintenanceBLL.GetWorkOrderEquipmentInfo(filter);
        }

        [System.Web.Services.WebMethod(EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public EquipmentHistoryData GetWorkOrderEquipmentHistory(PagerData pagerData, EquipmentHistoryFilter equipmentHistoryFilter)
        {
            EquipmentHistoryData data = new EquipmentHistoryData();
            string userControlPath = ConfigurationManager.AppSettings["MaintUserControls"].TrimEnd('/');
            BasicParam basicParam = new BasicParam();
            basicParam.UserID = pagerData.UserID;
            basicParam.SiteID = pagerData.SiteID;
            basicParam.AccessLevelID = pagerData.AccessLevelID;
            WorkOrderEquipmentHistoryDetails workOrderEquipmentHistoryDetails = BLL.MaintenanceBLL.GetWorkOrderEquipmentHistory(basicParam, equipmentHistoryFilter);
            data.WorkOrderEquipmentHistoryDetails = workOrderEquipmentHistoryDetails;
            data.HTMLPager = CommonBLL.RenderPagerHTML(userControlPath, pagerData, workOrderEquipmentHistoryDetails.TotalRecords);

            return data;
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public WorkOrderTaskDetails GetWorkOrderTaskInfo(WorkOrderFilter filter)
        {
            return BLL.MaintenanceBLL.GetWorkOrderTaskInfo(filter);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public TaskStartEndReturnInfo StartWorkOrderTask(WorkOrderTaskProcessInfo startTaskInfo)
        {
            return BLL.MaintenanceBLL.StartWorkOrderTask(startTaskInfo);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public TaskStartEndReturnInfo EndWorkOrderTask(WorkOrderTaskProcessInfo endTaskInfo)
        {
            return BLL.MaintenanceBLL.EndWorkOrderTask(endTaskInfo);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public int SaveTaskParameterValue(TaskParameterInfo taskParameter)
        {
            return BLL.MaintenanceBLL.SaveTaskParameterValue(taskParameter);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public WorkOrderTaskImageInfo InsertWorkOrderTaskImage(WorkOrderTaskImageUploadInfo imageUploadInfo)
        {
            return BLL.MaintenanceBLL.InsertWorkOrderTaskImage(imageUploadInfo);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public WorkOrderSparePartsInfo GetWorkOrderSpareParts(WorkOrderFilter filterInfo)
        {
            return BLL.MaintenanceBLL.GetWorkOrderSpareParts(filterInfo);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public bool SaveWorkOrderSparePartInfo(MaintSparePartDetails filterInfo)
        {
            return BLL.MaintenanceBLL.SaveWorkOrderSparePartInfo(filterInfo);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public bool CloseWorkOrderInfo(WorkOrderCloseInfo workOrderCloseFilter)
        {
            return BLL.MaintenanceBLL.CloseWorkOrderInfo(workOrderCloseFilter);
        }

        #endregion

        #region Tools Info

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public ToolsInfoData GetAllToolsInfo(PagerData pagerData, ToolsFilterInfo filterInfo)
        {
            ToolsListInfo output = BLL.MaintenanceBLL.GetAllToolsInfo(filterInfo);
            ToolsInfoData data = new ToolsInfoData();
            string userControlPath = ConfigurationManager.AppSettings["MaintUserControls"].TrimEnd('/');
            data.ToolsList = output.ToolsList;

            if (pagerData != null)
                data.HTMLPager = CommonBLL.RenderPagerHTML(userControlPath, pagerData, output.TotalRecords);
            return data;


        }
        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public int InsertOrUpdateToolInfo(BasicParam basicParam, ToolsInfo toolsInfo)
        {
            return BLL.MaintenanceBLL.InsertOrUpdateToolInfo(basicParam, toolsInfo);

        }
        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public int DeleteToolsInfo(BasicParam basicParam, int toolID)
        {
            return BLL.MaintenanceBLL.DeleteToolsInfo(basicParam, toolID);
        }
        #endregion

        #region Configure Spare Parts
        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string DownloadSparePartsTemplate(Vegam_MaintenanceModule.Vegam_MaintenanceService.BasicParam basicParam)
        {
            return BLL.MaintenanceBLL.DownloadSparePartsTemplate(basicParam);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string DownloadSparePartsListExcel(SparePartsFilterInfo filter)
        {
            return BLL.MaintenanceBLL.DownloadSparePartsListExcel(filter);
        }
        #endregion

        #region Notification
        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public int InsertUpdateNotificationInfo(BasicParam basicParam, NotificationInfo notificationInfo)
        {
            return BLL.MaintenanceBLL.InsertUpdateNotificationInfo(basicParam, notificationInfo);

        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public NotificationListDetails GetNotificationList(UserControls.PagerData pagerData, NotificationtFilter notificationFilter)
        {
            NotificationListDetails data = new NotificationListDetails();
            string userControlPath = ConfigurationManager.AppSettings["MaintUserControls"].TrimEnd('/');
            BasicParam basicParam = new BasicParam();
            basicParam.UserID = pagerData.UserID;
            basicParam.SiteID = pagerData.SiteID;
            basicParam.AccessLevelID = pagerData.AccessLevelID;

            NotificationList notificationList = BLL.MaintenanceBLL.GetNotificationList(basicParam, notificationFilter);
            data.NotificationInfoList = notificationList.NotificationInoList;
            data.HTMLPager = CommonBLL.RenderPagerHTML(userControlPath, pagerData, notificationList.TotalRecords);
            return data;
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public NotificationInfo GetNotificationInfo(BasicParam basicParam, int notificationID)
        {
            return BLL.MaintenanceBLL.GetNotificationInfo(basicParam, notificationID);
        }
        [System.Web.Services.WebMethod(EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public int DeleteNotificationInfo(BasicParam basicParam, int notificationID)
        {
            return BLL.MaintenanceBLL.DeleteNotificationInfo(basicParam, notificationID);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public List<TypeValueInfo> GetEquipmentListForDropDown(EquipmentFilterInfo equipmentFilterInfo)
        {
            return BLL.MaintenanceBLL.GetEquipmentListForDropDown(equipmentFilterInfo);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public List<DocumentInfo> GetAttachmentDetailsForNotification(BasicParam basicParam, int notificationID)
        {
            return BLL.MaintenanceBLL.GetAttachmentDetailsForNotification(basicParam, notificationID);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public int GetNextNotificationSequenceID(BasicParam basicParam)
        {
            return BLL.MaintenanceBLL.GetNextNotificationSequenceID(basicParam);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public int AcceptNotificationInfo(BasicParam basicParam, int notificationID)
        {
            return BLL.MaintenanceBLL.AcceptNotificationInfo(basicParam, notificationID);
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public int CloseNotificationInfo(BasicParam basicParam, NotificationInfo notificationInfo)
        {
            return BLL.MaintenanceBLL.CloseNotificationInfo(basicParam, notificationInfo);
        }

        #endregion


    }

    public class DynamicGridContent
    {
        public ipas_CompanyService.DynamicGridRowContentInfo[] GridRowList { get; set; }
        public int TotalRecords { get; set; }
        public int LastRowIndex { get; set; }
        public string HTMLPager { get; set; }
    }

    public class CalendarHeader
    {
        public string selevetedValue { get; set; }
        public string HeaderText { get; set; }
    }

    public class FunctionalLocationData
    {
        public FLocationInfo[] FunctionalLocationList { get; set; }
        public string HTMLPager { get; set; }
    }

    public class FunctionalLocationInfoListData
    {
        public FLocationDetails[] FLocationListInfo { get; set; }
        public string HTMLPager { get; set; }
    }

    public class EquipmentData
    {
        public EquipmentInformation[] EquipmentList { get; set; }
        public string HTMLPager { get; set; }
    }

    public class EquipmentInfoListData
    {
        public EquipmentDetailList EquipmentDetailList { get; set; }
        public string HTMLPager { get; set; }
    }

    public class EquipmentModelData
    {
        public EquipmentModelInfo[] EquipmentModelList { get; set; }
        public string HTMLPager { get; set; }
    }

    public class ModelListInfoData
    {
        public EquipmentModelListInfo EquipmentModeListlInfo { get; set; }
        public string HTMLPager { get; set; }
    }

    public class MaintMasterDataInfo
    {
        public MasterDataInfo[] MasterDataInfoList { get; set; }
        public int TotalMasterDataCount { get; set; }
        public string HTMLPager { get; set; }
    }

    public class MaintResourceViewDataInfo
    {
        public WorkOrderTimelineEventInfo[] WorkOrderTimelineEventList { get; set; }
        public TypeValueInfo[] FunctionalLocationEquipmentList { get; set; }
        public int TotalMasterDataCount { get; set; }
        public string MonthYear { get; set; }
        public string HTMLPager { get; set; }
    }


    //Tags
    public class TreeNode
    {
        public int id;
        public string parent;
        public string text;
        public bool children;
        public string icon;
    }

    public class OPCNode : TreeNode
    {
        public OPCNodeData data;
    }
    public class OPCNodeData
    {
        public string dataType;
        public string opcNodeId;
        public int GatewayID;
        public int ServerID;
        public string error;
        public int index;
        public string description;
        public bool isVariable { get; set; }
    }

    public class ScheduleWorkOrderDetailInfo
    {
        public ScheduleWorkOrderDetails ScheduleWorkOrderDetails { get; set; }
        public string HTMLPager { get; set; }
    }

    public class MeasurementDocumentData
    {
        public string MeasurementDocName { get; set; }
        public int WorkGroupID { get; set; }
        public string ScheduleStatus { get; set; }
        public int ScheduleDetailID { get; set; }
        public MeasDocMeasPoint[] MeasuringPointList { get; set; }
        public string HTMLPager { get; set; }
    }

    public class ToolsInfoData
    {
        public ToolsInfo[] ToolsList { get; set; }
        public string HTMLPager { get; set; }
    }

    public class MeasuringPointListDetails
    {
        public MeasuringPointList[] MeasuringPointInfoList { get; set; }
        public string HTMLPager { get; set; }
    }

    public class NotificationListDetails
    {
        public NotificationBasicInfo[] NotificationInfoList { get; set; }
        public string HTMLPager { get; set; }
    }

    public class EquipmentHistoryData
    {
        public WorkOrderEquipmentHistoryDetails WorkOrderEquipmentHistoryDetails { get; set; }
        public string HTMLPager { get; set; }
    }
}
