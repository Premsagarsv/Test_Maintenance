using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace Vegam_MaintenanceService
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IMaintenanceMobileAPIService" in both code and config file together.
    [ServiceContract]
    public interface IMaintenanceMobileAPIService
    {
        #region Maintenance-Mobile

        #region Get Company Site Info

        [OperationContract]
        [WebInvoke(UriTemplate = "SyncCompanySitesDateTimeData?companyID={companyID}&siteID={siteID}", Method = "POST", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Bare)]
        TableDetailInfo SyncCompanySitesDateTimeData(int companyID,int siteID);
        
        #endregion

        #region Sync Maintenance Table Data
        [OperationContract]
        [WebInvoke(UriTemplate = "SyncMaintenanceTableData", Method = "POST", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped)]
        TableDetailInfo SyncMaintenanceTableData(TableDetailsFilterInfo tableFilterInfo);

        #endregion

        #region SyncIn Maintenance Data Info
        [OperationContract]
        [WebInvoke(UriTemplate = "SyncInMaintenanceTableInfo", Method = "POST", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped)]
        dynamic SyncInMaintenanceTableInfo(SyncInInfo syncInInfo);
        #endregion

        #region Online Feature Notification Info
        [OperationContract]
        [WebInvoke(UriTemplate = "GetMaintMasterData", Method = "POST", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped)]
        MasterDataList GetMaintMasterData(BasicParam basicParam, MasterDataFilterInfo masterDataFilterInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetEnumInfoList", Method = "POST", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped)]
        List<EnumTypeInfo> GetEnumInfoList(BasicParam basicParam, string enumType);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetAllEquipmentFLocation", Method = "POST", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped)]
        List<EquipmentFLocInfo> GetAllEquipmentFLocation(EquipmentFLocFilterInfo equipmentFilterInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetNotificationListInfo", Method = "POST", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped)]
        List<NotificationInfo> GetNotificationListInfo(BasicParam basicParam);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetNotificationEditInfo", Method = "POST", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped)]
        NotificationInfo GetNotificationEditInfo(BasicParam basicParam, int notificationID);

        [OperationContract]
        [WebInvoke(UriTemplate = "InsertUpdateNotificationInfo", Method = "POST", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped)]
        int InsertUpdateNotificationInfo(BasicParam basicParam, NotificationInfo notificationInfo);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetAttachmentDetailsForNotification", Method = "POST", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped)]
        List<DocumentInfo> GetAttachmentDetailsForNotification(BasicParam basicParam, int notificationID);

        [OperationContract]
        [WebInvoke(UriTemplate = "DeleteDocumentsAndImagesInfo", Method = "POST", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped)]
        int DeleteDocumentsAndImagesInfo(BasicParam basicParam, int documentID);

        [OperationContract]
        [WebInvoke(UriTemplate = "InsertDocumentsAndImagesInfo", Method = "POST", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped)]
        int InsertDocumentsAndImagesInfo(DocumentFilterInfo documentFilterInfo);

        #endregion

        #region App Details Info

        [OperationContract]
        [WebInvoke(UriTemplate = "GetAppDetailsInfo?appName={appName}", Method = "POST", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Bare)]
        AppDetailsInfo GetAppDetailsInfo(string appName);

        #endregion

        #endregion
    }
}
