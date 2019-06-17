using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;
using static Vegam_MaintenanceService.Common;

namespace Vegam_MaintenanceService
{
    #region Common
    [DataContract]
    public class KeyValueInfo
    {
        #region Prvate Fields
        private string _key = string.Empty;
        private string _value = string.Empty;
        #endregion

        #region Properties

        [DataMember]
        public string Key
        {
            get { return _key; }
            set { _key = value; }
        }
        [DataMember]
        public string Value
        {
            get { return _value; }
            set { _value = value; }
        }
        #endregion
    }


    [DataContract]
    public class HierarchicalListInfo
    {
        [DataMember]
        public int? TypeValue { get; set; }
        [DataMember]
        public string DisplayName { get; set; }
        [DataMember]
        public int? ParentID { get; set; }
        [DataMember]
        public string UserDefaultLocation{ get; set; }
        [DataMember]
        public string UserDefaultEquipment { get; set; }
        [DataMember]
        public List<HierarchicalListInfo> Children { get; set; }

        public HierarchicalListInfo()
        {
            Children = new List<HierarchicalListInfo>();
        }

        public HierarchicalListInfo BindHierarchicalListTree(HierarchicalListInfo root, List<HierarchicalListInfo> hierarchicalListInfo)
        {
            if (hierarchicalListInfo.Count == 0)
            {
                return root;
            }

            var children = hierarchicalListInfo.Where(n => n.ParentID == root.TypeValue).ToList();
            root.Children.AddRange(children);
            foreach (var node in root.Children)
            {
                hierarchicalListInfo.Remove(node);
            }
            for (int i = 0; i < children.Count; i++)
            {
                children[i] = children[i].BindHierarchicalListTree(children[i], hierarchicalListInfo);
                if (hierarchicalListInfo.Count == 0) { break; }
            }

            return root;
        }
    }

    [DataContract]
    public class UserPreferenceFilter : BasicParam
    {
        #region Private Fields     
        private List<string> _userPreferenceLocationIDs = new List<string>();
        private List<string> _userPreferenceEquipmentIDs = new List<string>();
        #endregion

        #region Properties
        [DataMember]
        public List<string> PreferenceLocationIDS
        {
            get { return _userPreferenceLocationIDs; }
            set { _userPreferenceLocationIDs = value; }
        }
        [DataMember]
        public List<string> PreferenceEquipmentIDS
        {
            get { return _userPreferenceEquipmentIDs; }
            set { _userPreferenceEquipmentIDs = value; }
        }
        #endregion

    }

    #endregion

    #region Maintenance Feature Info
    [DataContract]
    public class MaintenanceFeatureInfo
    {
        #region Private Fields
        private string _tabName = string.Empty;
        private string _tabPath = string.Empty;

        #endregion

        #region Properties
        [DataMember]
        public string TabName
        {
            get { return _tabName; }
            set { _tabName = value; }
        }

        [DataMember]
        public string TabPath
        {
            get { return _tabPath; }
            set { _tabPath = value; }
        }

        #endregion
    }

    #endregion

    #region Functional Location Info
    [DataContract]
    public class FLocationFilterInfo : BasicParam
    {
        #region Private Fields
        private string _functionalLocIDs = string.Empty;
        private int _pageSize = 0;
        private int _pageIndex = 0;
        private string _sortType = string.Empty;
        private int _fLocationID = 0;
        private string _fLocationNameSearch = string.Empty;
        private bool _considerFLoc = false;
        #endregion

        #region Properties
        [DataMember]
        public string FunctionalLocIDs
        {
            get { return _functionalLocIDs; }
            set { _functionalLocIDs = value; }
        }

        [DataMember]
        public int PageSize
        {
            get { return _pageSize; }
            set { _pageSize = value; }
        }

        [DataMember]
        public int PageIndex
        {
            get { return _pageIndex; }
            set { _pageIndex = value; }
        }

        [DataMember]
        public string SortType
        {
            get { return _sortType; }
            set { _sortType = value; }
        }

        [DataMember]
        public int FLocationID
        {
            get { return _fLocationID; }
            set { _fLocationID = value; }
        }

        [DataMember]
        public string FLocationNameSearch
        {
            get { return _fLocationNameSearch; }
            set { _fLocationNameSearch = value; }
        }

        [DataMember]
        public bool ConsiderFLoc
        {
            get { return _considerFLoc; }
            set { _considerFLoc = value; }
        }

        #endregion

    }

    [DataContract]
    public class FLocationDetails
    {
        #region Private Fields
        private int _functionalLocID = 0;
        private string _functionalLocName = string.Empty;
        private string _functionalLocDesc = string.Empty;
        private string _functionalLocCode = string.Empty;
        #endregion

        #region Properties
        [DataMember]
        public int FunctionalLocationID
        {
            get { return _functionalLocID; }
            set { _functionalLocID = value; }
        }

        [DataMember]
        public string FunctionalLocationName
        {
            get { return _functionalLocName; }
            set { _functionalLocName = value; }
        }

        [DataMember]
        public string FunctionalLocationDesc
        {
            get { return _functionalLocDesc; }
            set { _functionalLocDesc = value; }
        }

        [DataMember]
        public string FunctionalLocationCode
        {
            get { return _functionalLocCode; }
            set { _functionalLocCode = value; }
        }
        #endregion
    }

    [DataContract]
    public class FLocationInfo : FLocationDetails
    {
        #region Private Fields
        private string _functionalLocImageName = string.Empty;
        private string _functionalLocImagePath = null;
        private string _functionalLocUpdatedOn = string.Empty;
        private int _parentLocID = 0;
        private List<TypeValueInfo> _asignedWorkGroupList = new List<TypeValueInfo>();
        private bool _workGroupDeletionConfirmed = false;
        private bool _assignNewWorkGroupsToChild = false;
        #endregion

        #region Properties
        [DataMember]
        public string FunctionalLocationImageName
        {
            get { return _functionalLocImageName; }
            set { _functionalLocImageName = value; }
        }

        [DataMember]
        public string FunctionalLocationImagePath
        {
            get { return _functionalLocImagePath; }
            set { _functionalLocImagePath = value; }
        }

        [DataMember]
        public string FunctionalLocationUpdatedOn
        {
            get { return _functionalLocUpdatedOn; }
            set { _functionalLocUpdatedOn = value; }
        }

        [DataMember]
        public int ParentLocationID
        {
            get { return _parentLocID; }
            set { _parentLocID = value; }
        }

        [DataMember]
        public List<TypeValueInfo> AssignedWorkGroupList
        {
            get { return _asignedWorkGroupList; }
            set { _asignedWorkGroupList = value; }
        }

        [DataMember]
        public bool WorkGroupDeletionConfirmed
        {
            get { return _workGroupDeletionConfirmed; }
            set { _workGroupDeletionConfirmed = value; }
        }

        [DataMember]
        public bool AsignNewWorkGroupsToChild
        {
            get { return _assignNewWorkGroupsToChild; }
            set { _assignNewWorkGroupsToChild = value; }
        }

        #endregion
    }

    [DataContract]
    public class FLocationListInfo
    {
        #region Private Fields
        private List<FLocationInfo> _functionalLocListInfo = new List<FLocationInfo>();
        private int _totalRecords = 0;
        #endregion

        #region Properties
        [DataMember]
        public List<FLocationInfo> FunctionalLocationListInfo
        {
            get { return _functionalLocListInfo; }
            set { _functionalLocListInfo = value; }

        }

        [DataMember]
        public int TotalRecords
        {
            get { return _totalRecords; }
            set { _totalRecords = value; }

        }
        #endregion
    }

    [DataContract]
    public class FLocationListDetails
    {
        #region Private Fields
        private List<FLocationDetails> _functionalLocListInfo = new List<FLocationDetails>();
        private int _totalRecords = 0;
        #endregion

        #region Properties
        [DataMember]
        public List<FLocationDetails> FunctionalLocationListInfo
        {
            get { return _functionalLocListInfo; }
            set { _functionalLocListInfo = value; }

        }

        [DataMember]
        public int TotalRecords
        {
            get { return _totalRecords; }
            set { _totalRecords = value; }

        }
        #endregion
    }

    [DataContract]
    public class AddFLocationReturnInfo
    {
        #region Private Fields
        private int _code = 0;
        private List<string> _messageList = new List<string>();
        #endregion

        #region Properties

        [DataMember]
        public int Code
        {
            get { return _code; }
            set { _code = value; }
        }

        [DataMember]
        public List<string> MessageList
        {
            get { return _messageList; }
            set { _messageList = value; }
        }
        #endregion
    }

    [DataContract]
    public class LocationWorkGroupInfo : TypeValueInfo
    {
        [DataMember]
        public List<TypeValueInfo> WorkGroupInfoList = new List<TypeValueInfo>();
    }

    #endregion

    #region Equipment Info
    [DataContract]
    public class EquipmentDetailsInfo : EquipmentInformation
    {
        #region Private Fields
        private int _fLocationID = 0;
        private int _resourceID = 0;
        private int _manufacturerID = 0;
        private int _categoryID = 0;
        private int _classID = 0;
        private InfoType _infoType = InfoType.None;
        private int _modelReferenceID = 0;
        private string _modelNumber = string.Empty;
        private string _modelName = string.Empty;
        private string _serialNumber = string.Empty;
        private string _warrantyNumber = string.Empty;
        private int _warrantyStartDate = 0;
        private int _warrantyExpireDate = 0;
        private int _purchaseDate = 0;
        private int _installDate = 0;
        private bool _equipmentImageExist = false;
        private List<SupportInfo> _supportInfoList = new List<SupportInfo>();
        private bool _workGroupDeletionConfirmed = false;
        private bool _assignNewWorkGroupsToChild = false;
        #endregion

        #region Properties
        [DataMember]
        public int FLocationID
        {
            get { return _fLocationID; }
            set { _fLocationID = value; }
        }

        [DataMember]
        public int ResourceID
        {
            get { return _resourceID; }
            set { _resourceID = value; }
        }

        [DataMember]
        public int ManufacturerID
        {
            get { return _manufacturerID; }
            set { _manufacturerID = value; }
        }

        [DataMember]
        public int CategoryID
        {
            get { return _categoryID; }
            set { _categoryID = value; }
        }

        [DataMember]
        public int ClassID
        {
            get { return _classID; }
            set { _classID = value; }
        }

        [DataMember]
        public InfoType InfoType
        {
            get { return _infoType; }
            set { _infoType = value; }
        }

        [DataMember]
        public int ModelReferenceID
        {
            get { return _modelReferenceID; }
            set { _modelReferenceID = value; }
        }

        [DataMember]
        public string ModelNumber
        {
            get { return _modelNumber; }
            set { _modelNumber = value; }
        }
        [DataMember]
        public string ModelName
        {
            get { return _modelName; }
            set { _modelName = value; }
        }

        [DataMember]
        public string SerialNumber
        {
            get { return _serialNumber; }
            set { _serialNumber = value; }
        }

        [DataMember]
        public string WarrantyNumber
        {
            get { return _warrantyNumber; }
            set { _warrantyNumber = value; }
        }

        [DataMember]
        public int WarrantyStartDate
        {
            get { return _warrantyStartDate; }
            set { _warrantyStartDate = value; }
        }

        [DataMember]
        public int WarrantyExpireDate
        {
            get { return _warrantyExpireDate; }
            set { _warrantyExpireDate = value; }
        }

        [DataMember]
        public int PurchaseDate
        {
            get { return _purchaseDate; }
            set { _purchaseDate = value; }
        }

        [DataMember]
        public int InstallDate
        {
            get { return _installDate; }
            set { _installDate = value; }
        }
        
            [DataMember]
        public bool EquipmentImageExist
        {
            get { return _equipmentImageExist; }
            set { _equipmentImageExist = value; }
        }

        [DataMember]
        public List<SupportInfo> SupportInfoList
        {
            get { return _supportInfoList; }
            set { _supportInfoList = value; }
        }

        [DataMember]
        public bool WorkGroupDeletionConfirmed
        {
            get { return _workGroupDeletionConfirmed; }
            set { _workGroupDeletionConfirmed = value; }
        }

        [DataMember]
        public bool AsignNewWorkGroupsToChild
        {
            get { return _assignNewWorkGroupsToChild; }
            set { _assignNewWorkGroupsToChild = value; }
        }
        #endregion
    }

    [DataContract]
    public class EquipmentInformation
    {
        #region Private Fields
        private int _equipmentID = 0;
        private string _equipmentCode = string.Empty;
        private string _equipmentName = string.Empty;
        private string _functionalLocName = string.Empty;
        private int _functionalLocID = 0;
        private string _equipmentDesc = string.Empty;
        private string _categoryName = string.Empty;
        private string _className = string.Empty;
        private int _parentEquipmentID = 0;
        private string _equipmentImageName = string.Empty;
        private string _equipmentImagePath = null;
        private string _updatedOn = string.Empty;
        private List<TypeValueInfo> _assignedWorkGroupList = new List<TypeValueInfo>();
        #endregion

        #region Properties
        [DataMember]
        public int EquipmentID
        {
            get { return _equipmentID; }
            set { _equipmentID = value; }
        }

        [DataMember]
        public string EquipmentCode
        {
            get { return _equipmentCode; }
            set { _equipmentCode = value; }
        }

        [DataMember]
        public string EquipmentName
        {
            get { return _equipmentName; }
            set { _equipmentName = value; }
        }

        [DataMember]
        public string FunctionalLocationName
        {
            get { return _functionalLocName; }
            set { _functionalLocName = value; }
        }

        [DataMember]
        public int FunctionalLocationID
        {
            get { return _functionalLocID; }
            set { _functionalLocID = value; }
        }

        [DataMember]
        public string EquipmentDesc
        {
            get { return _equipmentDesc; }
            set { _equipmentDesc = value; }
        }

        [DataMember]
        public string CategoryName
        {
            get { return _categoryName; }
            set { _categoryName = value; }
        }

        [DataMember]
        public string ClassName
        {
            get { return _className; }
            set { _className = value; }
        }

        [DataMember]
        public int ParentEquipmentID
        {
            get { return _parentEquipmentID; }
            set { _parentEquipmentID = value; }
        }

        [DataMember]
        public string EquipmentImageName
        {
            get { return _equipmentImageName; }
            set { _equipmentImageName = value; }
        }

        [DataMember]
        public string EquipmentImagePath
        {
            get { return _equipmentImagePath; }
            set { _equipmentImagePath = value; }
        }

        [DataMember]
        public string UpdatedOn
        {
            get { return _updatedOn; }
            set { _updatedOn = value; }
        }

        [DataMember]
        public List<TypeValueInfo> AssignedWorkGroupList
        {
            get { return _assignedWorkGroupList; }
            set { _assignedWorkGroupList = value; }
        }
        #endregion
    }

    [DataContract]
    public class EquipmentListInfo
    {
        #region Private Fields
        private List<EquipmentInformation> _equipmentList = new List<EquipmentInformation>();
        private int _totalRecords = 0;
        #endregion

        #region Properties
        [DataMember]
        public List<EquipmentInformation> EquipmentList
        {
            get { return _equipmentList; }
            set { _equipmentList = value; }
        }

        [DataMember]
        public int TotalRecords
        {
            get { return _totalRecords; }
            set { _totalRecords = value; }

        }
        #endregion
    }

    [DataContract]
    public class EquipmentDetail
    {
        #region Private Fields
        private int _equipmentID = 0;
        private string _equipmentName = string.Empty;
        private int _functionalLocID = 0;
        private List<TypeValueInfo> _assignedWorkGroupList = new List<TypeValueInfo>();
        #endregion

        #region Properties
        [DataMember]
        public int EquipmentID
        {
            get { return _equipmentID; }
            set { _equipmentID = value; }
        }

        [DataMember]
        public string EquipmentName
        {
            get { return _equipmentName; }
            set { _equipmentName = value; }
        }

        [DataMember]
        public int FunctionalLocationID
        {
            get { return _functionalLocID; }
            set { _functionalLocID = value; }
        }

        [DataMember]
        public List<TypeValueInfo> AssignedWorkGroupList
        {
            get { return _assignedWorkGroupList; }
            set { _assignedWorkGroupList = value; }
        }

        #endregion
    }

    [DataContract]
    public class EquipmentDetailList
    {
        #region Private Fields
        private List<EquipmentDetail> _equipmentList = new List<EquipmentDetail>();
        private int _totalRecords = 0;
        #endregion

        #region Properties
        [DataMember]
        public List<EquipmentDetail> EquipmentList
        {
            get { return _equipmentList; }
            set { _equipmentList = value; }
        }

        [DataMember]
        public int TotalRecords
        {
            get { return _totalRecords; }
            set { _totalRecords = value; }

        }
        #endregion

    }

    [DataContract]
    public class SupportInfo
    {
        #region Private Fields
        private int _supportID = 0;
        private string _supportName = string.Empty;
        private string _supportNumber = string.Empty;
        private string _supportEmail = string.Empty;
        private SupportType _supportType = SupportType.None;
        #endregion

        #region Properties
        [DataMember]
        public int SupportID
        {
            get { return _supportID; }
            set { _supportID = value; }
        }

        [DataMember]
        public string SupportName
        {
            get { return _supportName; }
            set { _supportName = value; }
        }

        [DataMember]
        public string SupportNumber
        {
            get { return _supportNumber; }
            set { _supportNumber = value; }
        }

        [DataMember]
        public string SupportEmail
        {
            get { return _supportEmail; }
            set { _supportEmail = value; }
        }

        [DataMember]
        public SupportType SupportType
        {
            get { return _supportType; }
            set { _supportType = value; }
        }
        #endregion
    }

    [DataContract]
    public enum InfoType
    {
        [EnumMember]
        None = 'N',
        [EnumMember]
        Location = 'L',
        [EnumMember]
        Equipment = 'E',
        [EnumMember]
        Equipment_Model = 'M',
        [EnumMember]
        Measuring_Point = 'P',
        [EnumMember]
        MaintenanceAttachment = 'A',
        [EnumMember]
        NotificationAttachment = 'T'
    }

    [DataContract]
    public enum SupportType
    {
        [EnumMember]
        None = 'N',
        [EnumMember]
        InHouse = 'H',
        [EnumMember]
        Third_Party = 'T'
    }

    [DataContract]
    public class EquipmentFilterInfo : BasicParam
    {
        #region Private Fields
        private int _equipmentID = 0;
        private string _searchNameOrCode = string.Empty;
        private string _searchLocationIDs = string.Empty;
        private string _searchManufactureIDs = string.Empty;
        private string _searchCategoryIDs = string.Empty;
        private int _pageSize = 0;
        private int _pageIndex = 0;
        private string _sortType = string.Empty;
        private InfoType _infoType = InfoType.Equipment;
        private bool _considerEquipmentList = false;
        private string _searchLocationName = string.Empty;

        #endregion

        #region Properties
        [DataMember]
        public int EquipmentID
        {
            get { return _equipmentID; }
            set { _equipmentID = value; }
        }

        [DataMember]
        public string SerachNameOrCode
        {
            get { return _searchNameOrCode; }
            set { _searchNameOrCode = value; }
        }

        [DataMember]
        public string SearchLocationIDs
        {
            get { return _searchLocationIDs; }
            set { _searchLocationIDs = value; }
        }

        [DataMember]
        public string SearchManufactureIDs
        {
            get { return _searchManufactureIDs; }
            set { _searchManufactureIDs = value; }
        }

        [DataMember]
        public string SearchCategoryIDs
        {
            get { return _searchCategoryIDs; }
            set { _searchCategoryIDs = value; }
        }

        [DataMember]
        public int PageSize
        {
            get { return _pageSize; }
            set { _pageSize = value; }
        }

        [DataMember]
        public int PageIndex
        {
            get { return _pageIndex; }
            set { _pageIndex = value; }
        }

        [DataMember]
        public string SortType
        {
            get { return _sortType; }
            set { _sortType = value; }
        }

        [DataMember]
        public InfoType InfoType
        {
            get { return _infoType; }
            set { _infoType = value; }
        }

        [DataMember]
        public bool ConsiderEquipmentList
        {
            get { return _considerEquipmentList; }
            set { _considerEquipmentList = value; }
        }

        [DataMember]
        public string SearchLocationName
        {
            get { return _searchLocationName; }
            set { _searchLocationName = value; }
        }
        #endregion

    }

    [DataContract]
    public class EquipmentSupportInfo : BasicParam
    {
        #region Private Fields
        private int _supportID = 0;
        private int _equipmentID = 0;
        #endregion

        #region Properties
        [DataMember]
        public int EquipmentID
        {
            get { return _equipmentID; }
            set { _equipmentID = value; }
        }

        [DataMember]
        public int SupportID
        {
            get { return _supportID; }
            set { _supportID = value; }
        }
        #endregion

    }
    #endregion

    #region Equipment Model
    [DataContract]
    public class EquipmentModelListInfo
    {
        #region Private Fields
        private List<TypeValueInfo> _equipmentModelList = new List<TypeValueInfo>();
        private int _totalRecords = 0;
        #endregion

        #region Properties
        [DataMember]
        public List<TypeValueInfo> EquipmentModelList
        {
            get { return _equipmentModelList; }
            set { _equipmentModelList = value; }
        }

        [DataMember]
        public int TotalRecords
        {
            get { return _totalRecords; }
            set { _totalRecords = value; }

        }
        #endregion
    }

    [DataContract]
    public class EquipmentModelInfo
    {
        #region Private Fields
        private int _equipmentModelID = 0;
        private string _equipmentModelName = string.Empty;
        private string _equipmentModelNumber = string.Empty;
        private string _equipmentModelDesc = string.Empty;
        private int _manufacturerID = 0;
        private int _categoryID = 0;
        private int _classID = 0;
        // private string _equipmentImageName = string.Empty;
        private string _equipmentImagePath = null;
        private string _manufacturerName = string.Empty;
        private string _categoryName = string.Empty;
        private string _className = string.Empty;
        #endregion

        #region Properties
        [DataMember]
        public int EquipmentModelID
        {
            get { return _equipmentModelID; }
            set { _equipmentModelID = value; }
        }

        [DataMember]
        public string EquipmentModelName
        {
            get { return _equipmentModelName; }
            set { _equipmentModelName = value; }
        }

        [DataMember]
        public string EquipmentModelNumber
        {
            get { return _equipmentModelNumber; }
            set { _equipmentModelNumber = value; }
        }

        [DataMember]
        public string EquipmentModelDesc
        {
            get { return _equipmentModelDesc; }
            set { _equipmentModelDesc = value; }
        }

        [DataMember]
        public int CategoryID
        {
            get { return _categoryID; }
            set { _categoryID = value; }
        }

        [DataMember]
        public int ManufacturerID
        {
            get { return _manufacturerID; }
            set { _manufacturerID = value; }
        }

        [DataMember]
        public int ClassID
        {
            get { return _classID; }
            set { _classID = value; }
        }

        //[DataMember]
        //public string EquipmentImageName
        //{
        //    get { return _equipmentImageName; }
        //    set { _equipmentImageName = value; }
        //}

        [DataMember]
        public string EquipmentImagePath
        {
            get { return _equipmentImagePath; }
            set { _equipmentImagePath = value; }
        }

        [DataMember]
        public string ManufacturerName
        {
            get { return _manufacturerName; }
            set { _manufacturerName = value; }
        }

        [DataMember]
        public string CategoryName
        {
            get { return _categoryName; }
            set { _categoryName = value; }
        }

        [DataMember]
        public string ClassName
        {
            get { return _className; }
            set { _className = value; }
        }

        #endregion
    }

    public class EquipmentModelListDetails
    {
        #region Private Fields
        private List<EquipmentModelInfo> _equipmentModelInfo = new List<EquipmentModelInfo>();
        private int _totalRecords = 0;
        #endregion

        #region Properties
        [DataMember]
        public List<EquipmentModelInfo> EquipmentModelInfoList
        {
            get { return _equipmentModelInfo; }
            set { _equipmentModelInfo = value; }
        }

        [DataMember]
        public int TotalRecords
        {
            get { return _totalRecords; }
            set { _totalRecords = value; }

        }
        #endregion
    }
    #endregion

    #region Measuring Point
    [DataContract]
    public enum ReadingType
    {
        [EnumMember]
        Text = 'T',
        [EnumMember]
        Numeric = 'N',
        [EnumMember]
        Decimal = 'D',
        [EnumMember]
        Selection = 'S'
    }

    [DataContract]
    public enum MeasuringPointDataType
    {
        [EnumMember]
        Equipment_Model = 'M',
        [EnumMember]
        Equipment = 'E',
        [EnumMember]
        Functional_Location = 'L'
    }

    [DataContract]
    public class MeasuringPoint
    {
        #region Private Fields
        private int _measuringPointID = 0;
        private MeasuringPointDataType? _measuringPointDataType = null;
        private string _measuringPointCode = string.Empty;
        private string _measuringPointName = string.Empty;
        private string _description = string.Empty;
        private string _imageName = string.Empty;
        private string _imagePath = null;
        private string _position = string.Empty;
        private int _categoryID = 0;
        private int _uomID = 0;
        private int _sensorTypeID = 0;
        private ReadingType? _readingType = null;
        private int _maxTextLength = 0;
        private decimal _minValue = 0;
        private decimal _maxValue = 0;
        private decimal _maxValueWarning = 0;
        private decimal _minValueWarning = 0;
        private int _decimalPlaces = 0;
        private int _groupID = 0;
        private int _parentID = 0;
        private int _locationID = 0;
        private bool _isCounter = false;
        private string _opcTagID = string.Empty;
        private int _tagUUID = 0;

        #endregion

        #region Properties
        [DataMember]
        public int ID
        {
            get { return _measuringPointID; }
            set { _measuringPointID = value; }
        }
        [DataMember]
        public MeasuringPointDataType? MeasuringPointDataType
        {
            get { return _measuringPointDataType; }
            set { _measuringPointDataType = value; }
        }
        [DataMember]
        public string Code
        {
            get { return _measuringPointCode; }
            set { _measuringPointCode = value; }
        }
        [DataMember]
        public string Name
        {
            get { return _measuringPointName; }
            set { _measuringPointName = value; }
        }
        [DataMember]
        public string Description
        {
            get { return _description; }
            set { _description = value; }
        }
        [DataMember]
        public string ImageName
        {
            get { return _imageName; }
            set { _imageName = value; }
        }
        [DataMember]
        public string ImagePath
        {
            get { return _imagePath; }
            set { _imagePath = value; }
        }
        [DataMember]
        public string Position
        {
            get { return _position; }
            set { _position = value; }
        }
        [DataMember]
        public int CategoryID
        {
            get { return _categoryID; }
            set { _categoryID = value; }
        }
        [DataMember]
        public int UOMID
        {
            get { return _uomID; }
            set { _uomID = value; }
        }
        [DataMember]
        public int SensorTypeID
        {
            get { return _sensorTypeID; }
            set { _sensorTypeID = value; }
        }

        [DataMember]
        public ReadingType? ReadingType
        {
            get { return _readingType; }
            set { _readingType = value; }
        }
        [DataMember]
        public int MaxTextLength
        {
            get { return _maxTextLength; }
            set { _maxTextLength = value; }
        }
        [DataMember]
        public decimal MinValue
        {
            get { return _minValue; }
            set { _minValue = value; }
        }
        [DataMember]
        public decimal MaxValue
        {
            get { return _maxValue; }
            set { _maxValue = value; }
        }
        [DataMember]
        public decimal MinValueWarning
        {
            get { return _minValueWarning; }
            set { _minValueWarning = value; }
        }
        [DataMember]
        public decimal MaxValueWarning
        {
            get { return _maxValueWarning; }
            set { _maxValueWarning = value; }
        }
        [DataMember]
        public int DecimalPlaces
        {
            get { return _decimalPlaces; }
            set { _decimalPlaces = value; }
        }
        [DataMember]
        public int GroupID
        {
            get { return _groupID; }
            set { _groupID = value; }
        }
        [DataMember]
        public int ParentID
        {
            get { return _parentID; }
            set { _parentID = value; }
        }
        [DataMember]
        public int LocationID
        {
            get { return _locationID; }
            set { _locationID = value; }
        }
        [DataMember]
        public bool IsCounter
        {
            get { return _isCounter; }
            set { _isCounter = value; }
        }
        [DataMember]
        public string OpcTagID
        {
            get { return _opcTagID; }
            set { _opcTagID = value; }
        }
        [DataMember]
        public int TagUUID
        {
            get { return _tagUUID; }
            set { _tagUUID = value; }
        }
        #endregion
    }

    [DataContract]
    public class TypeValueInfo
    {
        #region Private Fields
        private int _typeValue = 0;
        private string _displayName = string.Empty;

        [DataMember]
        public int TypeValue
        {
            get { return _typeValue; }
            set { _typeValue = value; }
        }

        #endregion

        #region Properties
        [DataMember]
        public string DisplayName
        {
            get { return _displayName; }
            set { _displayName = value; }
        }
        #endregion
    }

    [DataContract]
    public class MeasuringPointFilter : BasicParam
    {
        #region Private Fields
        private int _selectionID = 0;
        private MeasuringPointDataType? _measuringPointDataType = null;
        private string _searchString = string.Empty;
        private int _pageIndex = 0;
        private int _pageSize = 0;
        private string _sortType = string.Empty;
        #endregion

        #region Properties
        [DataMember]
        public int SelectionID
        {
            get { return _selectionID; }
            set { _selectionID = value; }
        }
        [DataMember]
        public MeasuringPointDataType? MeasuringPointDataType
        {
            get { return _measuringPointDataType; }
            set { _measuringPointDataType = value; }
        }
        [DataMember]
        public string SearchString
        {
            get { return _searchString; }
            set { _searchString = value; }
        }
        [DataMember]
        public int PageIndex
        {
            get { return _pageIndex; }
            set { _pageIndex = value; }
        }
        [DataMember]
        public int PageSize
        {
            get { return _pageSize; }
            set { _pageSize = value; }
        }
        [DataMember]
        public string SortType
        {
            get { return _sortType; }
            set { _sortType = value; }
        }
        #endregion

    }

    [DataContract]
    public class MeasuringPointListInfo
    {
        #region Private Fields
        private List<MeasuringPointList> _measuringPointList = new List<MeasuringPointList>();
        private int _totalRecords = 0;
        #endregion

        #region Properties
        [DataMember]
        public List<MeasuringPointList> MeasuringPointList
        {
            get { return _measuringPointList; }
            set { _measuringPointList = value; }
        }

        [DataMember]
        public int TotalRecords
        {
            get { return _totalRecords; }
            set { _totalRecords = value; }

        }
        #endregion
    }

    [DataContract]
    public class MeasuringPointList
    {
        #region Private Fields
        private int _measuringPointID = 0;
        private string _measuringPointName = string.Empty;
        private bool _isActivated = false;
        #endregion

        #region Properties
        [DataMember]
        public int MeasuringPointID
        {
            get { return _measuringPointID; }
            set { _measuringPointID = value; }
        }

        [DataMember]
        public string MeasuringPointName
        {
            get { return _measuringPointName; }
            set { _measuringPointName = value; }
        }

        [DataMember]
        public bool IsActivated
        {
            get { return _isActivated; }
            set { _isActivated = value; }
        }
        #endregion
    }

    [DataContract]
    public class MeasuringPointFilterInfo : BasicParam
    {
        [DataMember]
        public int DynamicGridObjectID { get; set; } = 0;
        [DataMember]
        public DynamicGridSearchInfo DynamicGridSearchInfo { get; set; } = new DynamicGridSearchInfo();
    }
    #endregion

    #region Category,Class,Manufacturer,Equipment Type 
    [DataContract]
    public enum MasterDataType
    {
        [EnumMember]
        MANUFACTURER = 1,
        [EnumMember]
        TYPE = 2,
        [EnumMember]
        CLASS = 3,
        [EnumMember]
        MP_CATEGORY = 4,
        [EnumMember]
        GROUPCODE = 5,
        [EnumMember]
        TASKGRP_TYPE = 6,
        [EnumMember]
        MAINT_TYPE = 7,
        [EnumMember]
        WORKGROUP = 8,
        [EnumMember]
        SPARE_PARTS = 9,
        [EnumMember]
        NOTIFICATION_TYPE = 10
    }

    [DataContract]
    public class MasterDataInfo
    {
        #region Private Fields
        private int _masterDataID = 0;
        private string _masterDataName = string.Empty;
        private string _description = string.Empty;
        private MasterDataType? _masterDataType = null;
        private List<string> _selectionGroupItemName = new List<string>();
        #endregion

        #region Properties
        [DataMember]
        public int MasterDataID
        {
            get { return _masterDataID; }
            set { _masterDataID = value; }
        }

        [DataMember]
        public string MasterDataName
        {
            get { return _masterDataName; }
            set { _masterDataName = value; }
        }

        [DataMember]
        public string Description
        {
            get { return _description; }
            set { _description = value; }
        }

        [DataMember]
        public MasterDataType? MasterDataType
        {
            get { return _masterDataType; }
            set { _masterDataType = value; }
        }

        [DataMember]
        public List<string> SelectionGroupItemName
        {
            get { return _selectionGroupItemName; }
            set { _selectionGroupItemName = value; }
        }
        #endregion
    }

    [DataContract]
    public class MasterDataFilterInfo
    {
        #region Private fields

        private int _pageIndex = 0;
        private int _pageSize = 0;
        private string _searchString = string.Empty;
        private MasterDataType? _masterDataType = null;
        private string _sortType = null;

        #endregion

        #region properties

        [DataMember]
        public int PageIndex
        {
            get { return _pageIndex; }
            set { _pageIndex = value; }
        }

        [DataMember]
        public int PageSize
        {
            get { return _pageSize; }
            set { _pageSize = value; }
        }

        [DataMember]
        public string SearchString
        {
            get { return _searchString; }
            set { _searchString = value; }
        }

        [DataMember]
        public MasterDataType? MasterDataType
        {
            get { return _masterDataType; }
            set { _masterDataType = value; }
        }


        [DataMember]
        public string SortType
        {
            get { return _sortType; }
            set { _sortType = value; }
        }

        #endregion
    }

    [DataContract]
    public class MasterDataList
    {
        #region Private Fields
        private List<MasterDataInfo> _masterDataInfoList = new List<MasterDataInfo>();
        private int _totalMasterDataCount = 0;
        #endregion

        #region Properties
        [DataMember]
        public List<MasterDataInfo> MasterDataInfoList
        {
            get { return _masterDataInfoList; }
            set { _masterDataInfoList = value; }
        }

        [DataMember]
        public int TotalMasterDataCount
        {
            get { return _totalMasterDataCount; }
            set { _totalMasterDataCount = value; }
        }
        #endregion
    }

    [DataContract]
    public class MasterDataDropDownListFilterInfo
    {
        #region Private fields
        private List<MasterDataType> _masterDataTypeList = new List<Vegam_MaintenanceService.MasterDataType>();
        private string _sortType = null;

        #endregion

        #region properties
        [DataMember]
        public List<MasterDataType> MasterDataTypeList
        {
            get { return _masterDataTypeList; }
            set { _masterDataTypeList = value; }
        }
        [DataMember]
        public string SortType
        {
            get { return _sortType; }
            set { _sortType = value; }
        }
        #endregion
    }

    [DataContract]
    public class MeasuringPointDataTypeFilterInfo : BasicParam
    {
        #region Private fields
        private List<MeasuringPointDataType> _measuringPointDataTypeList = new List<Vegam_MaintenanceService.MeasuringPointDataType>();
        #endregion

        #region properties
        [DataMember]
        public List<MeasuringPointDataType> MeasuringPointDataTypeList
        {
            get { return _measuringPointDataTypeList; }
            set { _measuringPointDataTypeList = value; }
        }
        #endregion
    }

    [DataContract]
    public class MasterDataDropDownList
    {
        #region Private Fields
        private List<TypeValueInfo> _manufacturerInfoList = new List<TypeValueInfo>();
        private List<TypeValueInfo> _categoryInfoList = new List<TypeValueInfo>();
        private List<TypeValueInfo> _classInfoList = new List<TypeValueInfo>();
        private List<TypeValueInfo> _mpcategoryInfoList = new List<TypeValueInfo>();
        private List<TypeValueInfo> _mpGroupList = new List<TypeValueInfo>();
        private List<TypeValueInfo> _taskGroupList = new List<TypeValueInfo>();
        #endregion

        #region Properties
        [DataMember]
        public List<TypeValueInfo> ManufacturerInfoList
        {
            get { return _manufacturerInfoList; }
            set { _manufacturerInfoList = value; }
        }
        [DataMember]
        public List<TypeValueInfo> CategoryInfoList
        {
            get { return _categoryInfoList; }
            set { _categoryInfoList = value; }
        }
        [DataMember]
        public List<TypeValueInfo> ClassInfoList
        {
            get { return _classInfoList; }
            set { _classInfoList = value; }
        }
        [DataMember]
        public List<TypeValueInfo> MPcategoryInfoList
        {
            get { return _mpcategoryInfoList; }
            set { _mpcategoryInfoList = value; }
        }
        [DataMember]
        public List<TypeValueInfo> MPGroupList
        {
            get { return _mpGroupList; }
            set { _mpGroupList = value; }
        }
        [DataMember]
        public List<TypeValueInfo> TaskGroupList
        {
            get { return _taskGroupList; }
            set { _taskGroupList = value; }
        }
        #endregion
    }

    [DataContract]
    public class MeasuringPointDataTypeList
    {
        #region Private Fields
        private List<FLocationDetails> _functionalLocation = new List<FLocationDetails>();
        private List<EquipmentDetail> _equipment = new List<EquipmentDetail>();
        private List<EquipmentDetail> _equipmentModel = new List<EquipmentDetail>();
        #endregion

        #region Properties
        [DataMember]
        public List<FLocationDetails> FunctionalLocationList
        {
            get { return _functionalLocation; }
            set { _functionalLocation = value; }
        }
        [DataMember]
        public List<EquipmentDetail> EquipmentList
        {
            get { return _equipment; }
            set { _equipment = value; }
        }
        [DataMember]
        public List<EquipmentDetail> EquipmentModelList
        {
            get { return _equipmentModel; }
            set { _equipmentModel = value; }
        }
        #endregion
    }
    #endregion

    #region Documents,Images and Videos

    [DataContract]
    public class DocumentBasicInfo : BasicParam
    {
        #region Private Fields
        private int _equipmentID = 0;
        private int _documentID = 0;
        private InfoType _infoType = InfoType.None;
        #endregion

        #region Properties
        [DataMember]
        public int EquipmentID
        {
            get { return _equipmentID; }
            set { _equipmentID = value; }
        }

        [DataMember]
        public int DocumentID
        {
            get { return _documentID; }
            set { _documentID = value; }
        }

        [DataMember]
        public InfoType InfoType
        {
            get { return _infoType; }
            set { _infoType = value; }
        }
        #endregion

    }

    [DataContract]
    public class DocumentFilterInfo : BasicParam
    {
        #region Private Fields
        private DocumentType _documentType = DocumentType.NONE;
        private string _documentName = string.Empty;
        private int _referenceID = 0;
        private InfoType _infoType = InfoType.None;
        #endregion

        #region Properties
        [DataMember]
        public int ReferenceID
        {
            get { return _referenceID; }
            set { _referenceID = value; }
        }

        [DataMember]
        public string DocumentName
        {
            get { return _documentName; }
            set { _documentName = value; }
        }

        [DataMember]
        public DocumentType DocumentType
        {
            get { return _documentType; }
            set { _documentType = value; }
        }

        [DataMember]
        public InfoType InfoType
        {
            get { return _infoType; }
            set { _infoType = value; }
        }

        #endregion

    }

    [DataContract]
    public class DocumentInfo
    {
        #region Private Fields
        private int _documentID = 0;
        private DocumentType _documentType = DocumentType.NONE;
        private string _documentName = string.Empty;
        private string _docDownloadPath = string.Empty;
        private string _thumbnailPath = string.Empty;
        private bool _isModelDocument = false;
        #endregion

        #region Properties
        [DataMember]
        public int DocumentID
        {
            get { return _documentID; }
            set { _documentID = value; }
        }

        [DataMember]
        public DocumentType DocumentType
        {
            get { return _documentType; }
            set { _documentType = value; }
        }

        [DataMember]
        public string DocumentName
        {
            get { return _documentName; }
            set { _documentName = value; }
        }

        [DataMember]
        public string DownloadPath
        {
            get { return _docDownloadPath; }
            set { _docDownloadPath = value; }
        }

        [DataMember]
        public string ThumbnailPath
        {
            get { return _thumbnailPath; }
            set { _thumbnailPath = value; }
        }

        [DataMember]
        public bool IsModelDocument
        {
            get { return _isModelDocument; }
            set { _isModelDocument = value; }
        }
        #endregion

    }

    [DataContract]
    public enum DocumentType
    {
        [EnumMember]
        NONE = 'N',
        [EnumMember]
        DOCUMENT = 'D',
        [EnumMember]
        IMAGE = 'I',
        [EnumMember]
        VIDEO = 'V',
        [EnumMember]
        SDOCUMENT = 'S'
    }
    #endregion

    #region TaskGroup 

    [DataContract]
    public enum TaskGroupStatus
    {
        [EnumMember]
        Approved = 'A',
        [EnumMember]
        Draft = 'D',
        [EnumMember]
        MODIFIED = 'M',
    }

    [DataContract]
    public class TaskGroupIdentifier
    {
        private int _identifierID = 0;
        private int _versionNumber = 0;
        private int _selectedTaskID = 0;

        [DataMember]
        public int IdentifierID
        {
            get { return _identifierID; }
            set { _identifierID = value; }
        }

        [DataMember]
        public int VersionNumber
        {
            get { return _versionNumber; }
            set { _versionNumber = value; }
        }

        [DataMember]
        public int SelectedTaskID
        {
            get { return _selectedTaskID; }
            set { _selectedTaskID = value; }
        }
    }

    [DataContract]
    public class TaskGroupFilterInfo : TaskGroupIdentifier
    {
        private int _taskID = 0;
        private string _taskGroupName = string.Empty;
        private int _taskGroupTypeId = 0;

        [DataMember]
        public int TaskID
        {
            get { return _taskID; }
            set { _taskID = value; }
        }

        [DataMember]
        public string TaskGroupName
        {
            get { return _taskGroupName; }
            set { _taskGroupName = value; }
        }

        [DataMember]
        public int TaskGroupTypeId
        {
            get { return _taskGroupTypeId; }
            set { _taskGroupTypeId = value; }
        }
    }

    [DataContract]
    public class TaskGroupBasicInfo : TaskGroupIdentifier
    {
        private int _taskGroupID = 0;
        private string _taskGroupName = string.Empty;
        private TaskGroupStatus _status = TaskGroupStatus.Draft;
        private int _taskGroupTypeId = 0;
        private List<TaskBasicInfo> _taskBasicInfoList = new List<TaskBasicInfo>();

        [DataMember]
        public int TaskGroupID
        {
            get { return _taskGroupID; }
            set { _taskGroupID = value; }
        }

        [DataMember]
        public string TaskGroupName
        {
            get { return _taskGroupName; }
            set { _taskGroupName = value; }
        }

        [DataMember]
        public TaskGroupStatus TaskGroupStatus
        {
            get { return _status; }
            set { _status = value; }
        }

        [DataMember]
        public int TaskGroupTypeId
        {
            get { return _taskGroupTypeId; }
            set { _taskGroupTypeId = value; }
        }

        [DataMember]
        public List<TaskBasicInfo> TaskBasicInfoList
        {
            get { return _taskBasicInfoList; }
            set { _taskBasicInfoList = value; }
        }
    }

    [DataContract]
    public enum UnitOfTime
    {
        [EnumMember]
        Hours = 'H',
        [EnumMember]
        Minutes = 'M',
        [EnumMember]
        Seconds = 'S'
    }

    [DataContract]
    public enum ParameterType
    {
        [EnumMember]
        SingleLineText = 'S',
        [EnumMember]
        MultiLineText = 'M',
        [EnumMember]
        Numeric = 'N',
        [EnumMember]
        Decimal = 'D',
        [EnumMember]
        SelectionCode = 'C'
    }

    [DataContract]
    public class TaskBasicInfo
    {
        private int _taskID = 0;
        private string _taskName = string.Empty;
        private int _sequenceNum = 0;

        [DataMember]
        public int TaskID
        {
            get { return _taskID; }
            set { _taskID = value; }
        }

        [DataMember]
        public string TaskName
        {
            get { return _taskName; }
            set { _taskName = value; }
        }

        [DataMember]
        public int SequenceNum
        {
            get { return _sequenceNum; }
            set { _sequenceNum = value; }
        }

    }

    [DataContract]
    public class TaskInfo : TaskBasicInfo
    {
        private string _description = string.Empty;
        private string _safetyDescription = string.Empty;
        private long _estimatedTime = 0;
        private UnitOfTime _unit = UnitOfTime.Hours;
        private bool _remarkEnabled = false;
        private bool _remarkMandatory = false;
        private bool _pictureEnabled = false;
        private bool _pictureMandatory = false;
        private bool _recordActionEnabled = false;
        private List<ParameterInfo> _parameterInfoList = new List<ParameterInfo>();
        private List<DocumentInfo> _documentInfoList = new List<DocumentInfo>();
        private List<TaskPPEInfo> _ppeInfoList = new List<TaskPPEInfo>();
        private List<TaskToolsInfo> _toolsInfoList = new List<TaskToolsInfo>();
        private List<MaintSparePartInfo> _sparePartInfoList = new List<MaintSparePartInfo>();

        [DataMember]
        public string Description
        {
            get { return _description; }
            set { _description = value; }
        }

        [DataMember]
        public string SafetyDescription
        {
            get { return _safetyDescription; }
            set { _safetyDescription = value; }
        }

        [DataMember]
        public long EstimatedTime
        {
            get { return _estimatedTime; }
            set { _estimatedTime = value; }
        }

        [DataMember]
        public UnitOfTime UnitOfTime
        {
            get { return _unit; }
            set { _unit = value; }
        }

        [DataMember]
        public bool RemarkEnabled
        {
            get { return _remarkEnabled; }
            set { _remarkEnabled = value; }
        }

        [DataMember]
        public bool RemarkMandatory
        {
            get { return _remarkMandatory; }
            set { _remarkMandatory = value; }
        }

        [DataMember]
        public bool PictureEnabled
        {
            get { return _pictureEnabled; }
            set { _pictureEnabled = value; }
        }

        [DataMember]
        public bool PictureMandatory
        {
            get { return _pictureMandatory; }
            set { _pictureMandatory = value; }
        }


        [DataMember]
        public bool RecordActionEnabled
        {
            get { return _recordActionEnabled; }
            set { _recordActionEnabled = value; }
        }

        [DataMember]
        public List<ParameterInfo> ParameterInfoList
        {
            get { return _parameterInfoList; }
            set { _parameterInfoList = value; }
        }

        [DataMember]
        public List<DocumentInfo> DocumentInfoList
        {
            get { return _documentInfoList; }
            set { _documentInfoList = value; }
        }

        [DataMember]
        public List<TaskPPEInfo> PPEInfoList
        {
            get { return _ppeInfoList; }
            set { _ppeInfoList = value; }
        }

        [DataMember]
        public List<TaskToolsInfo> ToolsInfoList
        {
            get { return _toolsInfoList; }
            set { _toolsInfoList = value; }
        }

        [DataMember]
        public List<MaintSparePartInfo> SparePartInfoList
        {
            get { return _sparePartInfoList; }
            set { _sparePartInfoList = value; }
        }
    }

    [DataContract]
    public class ParameterInfo
    {
        private int _parameterID = 0;
        private string _parameterName = string.Empty;
        private bool _isMandatory = false;
        private ParameterType _parameterType = ParameterType.SingleLineText;
        private int _selectionGroupID = 0;

        [DataMember]
        public int ParameterID
        {
            get { return _parameterID; }
            set { _parameterID = value; }
        }

        [DataMember]
        public string ParameterName
        {
            get { return _parameterName; }
            set { _parameterName = value; }
        }



        [DataMember]
        public bool IsMandatory
        {
            get { return _isMandatory; }
            set { _isMandatory = value; }
        }

        [DataMember]
        public ParameterType ParameterType
        {
            get { return _parameterType; }
            set { _parameterType = value; }
        }

        [DataMember]
        public int SelectionGroupID
        {
            get { return _selectionGroupID; }
            set { _selectionGroupID = value; }
        }
    }

    [DataContract]
    public class TaskPPEInfo
    {
        private int _taskPPEID = 0;
        private int _ppeID = 0;
        private string _ppeDescription = string.Empty;
        private string _ppeImagePath = string.Empty;

        [DataMember]
        public int TaskPPEID
        {
            get { return _taskPPEID; }
            set { _taskPPEID = value; }
        }

        [DataMember]
        public int PPEID
        {
            get { return _ppeID; }
            set { _ppeID = value; }
        }

        [DataMember]
        public string PPEDescription
        {
            get { return _ppeDescription; }
            set { _ppeDescription = value; }
        }

        [DataMember]
        public string PPEImagePath
        {
            get { return _ppeImagePath; }
            set { _ppeImagePath = value; }
        }
    }

    [DataContract]
    public class TaskToolsInfo
    {
        private int _taskToolsID = 0;
        private int _toolsID = 0;
        private string _toolsDescription = string.Empty;
        private string _toolsImagePath = string.Empty;

        [DataMember]
        public int TaskToolsID
        {
            get { return _taskToolsID; }
            set { _taskToolsID = value; }
        }

        [DataMember]
        public int ToolsID
        {
            get { return _toolsID; }
            set { _toolsID = value; }
        }

        [DataMember]
        public string ToolsDescription
        {
            get { return _toolsDescription; }
            set { _toolsDescription = value; }
        }

        [DataMember]
        public string ToolsImagePath
        {
            get { return _toolsImagePath; }
            set { _toolsImagePath = value; }
        }
    }

    [DataContract]
    public class InstructionSelectorInfo
    {
        private int _instructionID = 0;
        private string _instructionName = string.Empty;
        private string _imagePath = string.Empty;

        [DataMember]
        public int InstructionID
        {
            get { return _instructionID; }
            set { _instructionID = value; }
        }

        [DataMember]
        public string InstructionName
        {
            get { return _instructionName; }
            set { _instructionName = value; }
        }

        [DataMember]
        public string ImagePath
        {
            get { return _imagePath; }
            set { _imagePath = value; }
        }
    }

    public class TaskMappingInfo
    {
        private int _taskID = 0;
        private int _mappedTaskID = 0;

        public int TaskID
        {
            get { return _taskID; }
            set { _taskID = value; }
        }

        public int MappedTaskID
        {
            get { return _mappedTaskID; }
            set { _mappedTaskID = value; }
        }
    }
    #endregion

    #region Maintenance Schedule & Work Order

    [DataContract]
    public enum ScheduleType
    {
        [EnumMember]
        Schedule = 'S',
        [EnumMember]
        WorkOrder = 'W',
        [EnumMember]
        Inspection = 'I',
        [EnumMember]
        Notification = 'N'
    }

    [DataContract]
    public enum ScheduleStatus
    {
        [EnumMember]
        CREATED = 1,
        [EnumMember]
        RELEASED = 2,
        [EnumMember]
        CANCELLED = 3,
        [EnumMember]
        SCHEDULING = 4
    }

    [DataContract]
    public class MaintenanceInfo : BasicParam
    {
        #region Private Fields
        private int _maintScheduleID = 0;
        private string _maintenanceName = string.Empty;
        private int _fLoactionID = 0;
        private int _equipmentID = 0;
        private string _maintenanceDesc = string.Empty;
        private int _maintenanceTypeID = 0;
        private string _maintenancePriorityType = string.Empty;
        private int _scheduleDate = 0;
        private int _scheduleTime = 0;
        private int _workGroupID = 0;
        private string _workGroupName = string.Empty;
        private bool _isWorkGroupAvailable = false;
        private ScheduleType _maintScheduleType = ScheduleType.Schedule;
        private string _fLocationName = string.Empty;
        private string _equipmentName = string.Empty;
        private string _fLocationOrEquipmentImg = string.Empty;
        private int _taskGroupID = 0;
        private string _taskGroupName = string.Empty;
        private int _taskGroupVersion = 0;
        private int _taskGroupIdentifier = 0;
        private string _scheduleStatus = string.Empty;
        private int _scheduleDetailID = 0;
        private int _manualTaskGroupID = 0;
        private int _notificationID = 0;
        private string _workOrderStatus = string.Empty;
        private bool _isTaskGroupSOPRemoved = false;
        #endregion

        #region Properties
        [DataMember]
        public int MaintScheduleID
        {
            get { return _maintScheduleID; }
            set { _maintScheduleID = value; }
        }

        [DataMember]
        public string MaintenanceName
        {
            get { return _maintenanceName; }
            set { _maintenanceName = value; }
        }

        [DataMember]
        public int EquipmentID
        {
            get { return _equipmentID; }
            set { _equipmentID = value; }
        }

        [DataMember]
        public int FLocationID
        {
            get { return _fLoactionID; }
            set { _fLoactionID = value; }
        }

        [DataMember]
        public string MaintenanceDesc
        {
            get { return _maintenanceDesc; }
            set { _maintenanceDesc = value; }
        }

        [DataMember]
        public int MaintenanceTypeID
        {
            get { return _maintenanceTypeID; }
            set { _maintenanceTypeID = value; }
        }

        [DataMember]
        public string MaintenancePriorityType
        {
            get { return _maintenancePriorityType; }
            set { _maintenancePriorityType = value; }
        }

        [DataMember]
        public int ScheduleDate
        {
            get { return _scheduleDate; }
            set { _scheduleDate = value; }
        }

        [DataMember]
        public int ScheduleTime
        {
            get { return _scheduleTime; }
            set { _scheduleTime = value; }
        }

        [DataMember]
        public int WorkGroupID
        {
            get { return _workGroupID; }
            set { _workGroupID = value; }
        }

        [DataMember]
        public string WorkGroupName
        {
            get { return _workGroupName; }
            set { _workGroupName = value; }
        }

        [DataMember]
        public bool IsWorkGroupAvailable
        {
            get { return _isWorkGroupAvailable; }
            set { _isWorkGroupAvailable = value; }
        }

        [DataMember]
        public ScheduleType MaintScheduleType
        {
            get { return _maintScheduleType; }
            set { _maintScheduleType = value; }
        }

        [DataMember]
        public string FLocationName
        {
            get { return _fLocationName; }
            set { _fLocationName = value; }
        }

        [DataMember]
        public string EquipmentName
        {
            get { return _equipmentName; }
            set { _equipmentName = value; }
        }

        [DataMember]
        public string FLocationOrEquipmentImg
        {
            get { return _fLocationOrEquipmentImg; }
            set { _fLocationOrEquipmentImg = value; }
        }

        [DataMember]
        public int TaskGroupID
        {
            get { return _taskGroupID; }
            set { _taskGroupID = value; }
        }

        [DataMember]
        public string TaskGroupName
        {
            get { return _taskGroupName; }
            set { _taskGroupName = value; }
        }

        [DataMember]
        public int TaskGroupIdentifier
        {
            get { return _taskGroupIdentifier; }
            set { _taskGroupIdentifier = value; }
        }

        [DataMember]
        public int TaskGroupVersion
        {
            get { return _taskGroupVersion; }
            set { _taskGroupVersion = value; }
        }

        [DataMember]
        public string ScheduleStatus
        {
            get { return _scheduleStatus; }
            set { _scheduleStatus = value; }
        }

        [DataMember]
        public int ScheduleDetailID
        {
            get { return _scheduleDetailID; }
            set { _scheduleDetailID = value; }
        }
        [DataMember]
        public int ManualTaskGroupID
        {
            get { return _manualTaskGroupID; }
            set { _manualTaskGroupID = value; }
        }
        [DataMember]
        public int NotificationID
        {
            get { return _notificationID; }
            set { _notificationID = value; }
        }

        [DataMember]
        public string WorkOrderStatus
        {
            get { return _workOrderStatus; }
            set { _workOrderStatus = value; }
        }

        [DataMember]
        public bool IsTaskGroupSOPRemoved
        {
            get { return _isTaskGroupSOPRemoved; }
            set { _isTaskGroupSOPRemoved = value; }
        }
        #endregion
    }

    [DataContract]
    public class MaintenanceIdentityInfo
    {
        #region Private Fields
        private int _maintScheduleID = 0;
        private string _workOrderID = string.Empty;

        #endregion

        #region Properties
        [DataMember]
        public int MaintScheduleID
        {
            get { return _maintScheduleID; }
            set { _maintScheduleID = value; }
        }

        [DataMember]
        public string WorkOrderID
        {
            get { return _workOrderID; }
            set { _workOrderID = value; }
        }

        #endregion
    }

    [DataContract]
    public class MaintenanceFilterInfo : BasicParam
    {
        #region Private Fields
        private int _maintScheduleID = 0;
        private ScheduleType? _maintScheduleType = ScheduleType.Schedule;
        private int _pageIndex = 0;
        private int _pageSize = 0;
        private string _workOrderID = string.Empty;
        private int _scheduleDate = 0;
        private int _scheduleTime = 0;
        #endregion

        #region Properties
        [DataMember]
        public int MaintScheduleID
        {
            get { return _maintScheduleID; }
            set { _maintScheduleID = value; }
        }

        [DataMember]
        public ScheduleType? MaintScheduleType
        {
            get { return _maintScheduleType; }
            set { _maintScheduleType = value; }
        }

        [DataMember]
        public int PageIndex
        {
            get { return _pageIndex; }
            set { _pageIndex = value; }
        }

        [DataMember]
        public int PageSize
        {
            get { return _pageSize; }
            set { _pageSize = value; }
        }

        [DataMember]
        public string WorkOrderID
        {
            get { return _workOrderID; }
            set { _workOrderID = value; }
        }

        [DataMember]
        public int ScheduleTime
        {
            get { return _scheduleTime; }
            set { _scheduleTime = value; }
        }
        [DataMember]
        public int ScheduleDate
        {
            get { return _scheduleDate; }
            set { _scheduleDate = value; }
        }
        #endregion
    }

    [DataContract]
    public class MaintTaskGroupFilterInfo : BasicParam
    {
        [DataMember]
        public string SearchTaskGroupName { get; set; } = string.Empty;
        [DataMember]
        public int TaskGroupID { get; set; } = 0;
        [DataMember]
        public int ScheduleID { get; set; } = 0;
        [DataMember]
        public int Identifier { get; set; } = 0;
        [DataMember]
        public int TaskGroupTypeID { get; set; } = 0;
    }

    [DataContract]
    public class MaintTaskGroupInfo
    {
        [DataMember]
        public int TaskGroupID { get; set; } = 0;
        [DataMember]
        public string TaskGroupName { get; set; } = string.Empty;
        [DataMember]
        public int Identifier { get; set; } = 0;
        [DataMember]
        public int VersionNumber { get; set; } = 0;
    }

    [DataContract]
    public class MaintTaskInfo
    {
        [DataMember]
        public int TaskID { get; set; } = 0;
        [DataMember]
        public string TaskName { get; set; } = string.Empty;
        [DataMember]
        public string Description { get; set; } = string.Empty;
        [DataMember]
        public decimal EstimatedTime { get; set; } = 0;
    }

    [DataContract]
    public class ScheduleFilterInfo : BasicParam
    {
        [DataMember]
        public ScheduleType? ScheduleType { get; set; } = null;
        [DataMember]
        public int MaintScheduleID { get; set; } = 0;
    }

    [DataContract]
    public class ScheduleDetailInfo : BasicParam
    {
        [DataMember]
        public int ScheduleDetailID { get; set; } = 0;
        [DataMember]
        public int ScheduleID { get; set; } = 0;
        [DataMember]
        public int ItemID { get; set; } = 0;
        [DataMember]
        public Schd_Frequency? Frequency { get; set; } = null;
        [DataMember]
        public int Interval { get; set; } = 0;
        [DataMember]
        public bool BasedOnLastPerformanceDate { get; set; } = false;
        [DataMember]
        public int StartDate { get; set; } = 0;
        [DataMember]
        public int StartTime { get; set; } = 0;
        [DataMember]
        public int EndDate { get; set; } = 0;
        [DataMember]
        public int EndNumOccurrence { get; set; } = 0;
        [DataMember]
        public List<string> WeekDay { get; set; } = new List<string>();
        [DataMember]
        public Schd_MonthOption? MonthOption { get; set; } = null;
        [DataMember]
        public List<int> MonthDay { get; set; } = new List<int>();
        [DataMember]
        public List<string> MonthPosition { get; set; } = new List<string>();
        [DataMember]
        public Schd_YearOption? YearOption { get; set; } = null;
        [DataMember]
        public List<string> YearMonth { get; set; } = new List<string>();
        [DataMember]
        public int NotifyDay { get; set; } = 0;
    }

    [DataContract]
    public enum Schd_Frequency
    {
        [EnumMember]
        HOURLY = 1,
        [EnumMember]
        DAILY = 2,
        [EnumMember]
        WEEKLY = 3,
        [EnumMember]
        MONTHLY = 4,
        [EnumMember]
        YEARLY = 5
    }

    [DataContract]
    public enum Schd_MonthOption
    {
        [EnumMember]
        Monthly_By_Date = 1,
        [EnumMember]
        Monthly_By_Day = 2
    }

    [DataContract]
    public enum Schd_YearOption
    {
        [EnumMember]
        Yearly_By_Date = 1,
        [EnumMember]
        Yearly_By_Day = 2
    }

    [DataContract]
    public enum RecurrenceRuleDescType
    {
        [EnumMember]
        EveryHour = 1,
        [EnumMember]
        EveryNHour = 2,
        [EnumMember]
        EveryDay = 3,
        [EnumMember]
        EveryNDay = 4,
        [EnumMember]
        EveryWeek = 5,
        [EnumMember]
        EveryNWeek = 6,
        [EnumMember]
        EveryWeekDay = 7,
        [EnumMember]
        EveryNWeekDay = 8,
        [EnumMember]
        EveryMonth = 9,
        [EnumMember]
        EveryNMonth = 10,
        [EnumMember]
        EveryMonthByDate = 11,
        [EnumMember]
        EveryNMonthByDate = 12,
        [EnumMember]
        EveryMonthByDay = 13,
        [EnumMember]
        EveryNMonthByDay = 14,
        [EnumMember]
        EveryYear = 15,
        [EnumMember]
        EveryNYear = 16,
        [EnumMember]
        EveryYearByDate = 17,
        [EnumMember]
        EveryNYearByDate = 18,
        [EnumMember]
        EveryYearByDay = 19,
        [EnumMember]
        EveryNYearByDay = 20
    }

    public class RecurrenceRuleDescInfo
    {
        public RecurrenceRuleDescType RuleDescType { get; set; }
        public string RuleDesc { get; set; } = string.Empty;
    }

    [DataContract]
    public enum WorkOrderStatus
    {
        [EnumMember]
        SCHEDULED = 1,
        [EnumMember]
        INPROGRESS = 2,
        [EnumMember]
        COMPLETED = 3,
        [EnumMember]
        OVERDUE = 4,
        [EnumMember]
        CANCELLED = 5,
        [EnumMember]
        CLOSED = 6,
        [EnumMember]
        CREATED = 7
    }

    [DataContract]
    public class ScheduleWorkOrderInfo
    {
        [DataMember]
        public string Status { get; set; }
        [DataMember]
        public string WorkOrder { get; set; }
        [DataMember]
        public string ScheduleDate { get; set; }
        [DataMember]
        public string PlannedDate { get; set; }
        [DataMember]
        public string StartDate { get; set; }
        [DataMember]
        public string EndDate { get; set; }
    }

    [DataContract]
    public class ScheduleWorkOrderDetails
    {
        [DataMember]
        public List<ScheduleWorkOrderInfo> WorkOrderList { get; set; } = new List<ScheduleWorkOrderInfo>();
        [DataMember]
        public int TotalRecords { get; set; }
    }

    [DataContract]
    public class ScheduleWorkOrderFilter : BasicParam
    {
        [DataMember]
        public int ScheduleID { get; set; }
        [DataMember]
        public int PageIndex { get; set; }
        [DataMember]
        public int PageSize { get; set; }
        [DataMember]
        public int ScheduleDate { get; set; }
        [DataMember]
        public string Status { get; set; }
    }

    [DataContract]
    public enum TaskGroupRefType
    {
        [EnumMember]
        TASK = 1,
        [EnumMember]
        SCHEDULE = 2
    }

    [DataContract]
    public class MaintSparePartInfo
    {
        [DataMember]
        public string MaterialNumber { get; set; } = string.Empty;
        [DataMember]
        public string MaterialDesc { get; set; } = string.Empty;
        [DataMember]
        public decimal Quantity { get; set; } = 0;
        [DataMember]
        public decimal UsedQuantity { get; set; } = 0;
        [DataMember]
        public string UOM { get; set; } = string.Empty;
        [DataMember]
        public bool IsSOPSparePart { get; set; } = false;
    }

    [DataContract]
    public class MaintSparePartDetails : BasicParam
    {
        [DataMember]
        public int ScheduleID { get; set; } = 0;
        [DataMember]
        public string WorkOrderID { get; set; } = string.Empty;
        [DataMember]
        public List<MaintSparePartInfo> SparePartList { get; set; } = new List<MaintSparePartInfo>();
    }

    [DataContract]
    public class MaintSparePartFilter: BasicParam
    {
        [DataMember]
        public int ScheduleID { get; set; } = 0;
        [DataMember]
        public string WorkOrderID { get; set; } = string.Empty;
        [DataMember]
        public string SparePartID { get; set; } = string.Empty;
    }

    [DataContract]
    public class MaintAttachmentInfo
    {
        [DataMember]
        public int AttachmentID { get; set; } = 0;
        [DataMember]
        public string AttachmentName { get; set; } = string.Empty;
        [DataMember]
        public string DownloadPath { get; set; } = string.Empty;
    }

    [DataContract]
    public class MaintAttachmentDetails : BasicParam
    {
        [DataMember] public int ScheduleID { get; set; } = 0;
        [DataMember] public int AttachmentID { get; set; } = 0;
        [DataMember] public string AttachmentName { get; set; } = string.Empty;
    }

    [DataContract]
    public class MaintWorkGroupFilter : BasicParam
    {
        [DataMember] public int ReferenceID { get; set; } = 0;
        [DataMember] public string ReferenceType { get; set; } = string.Empty;
    }

    #endregion

    #region Maintenance checklist Schedule
    [DataContract]
    public class MeasDocMeasPoint
    {
        #region Private Fields
        private int _measuringPointID = 0;
        private string _measuringPointName = string.Empty;
        private string _category = string.Empty;
        private string _functionalLocation = string.Empty;
        private string _equipment = string.Empty;
        #endregion

        #region Properties
        [DataMember]
        public int MeasuringPointID
        {
            get { return _measuringPointID; }
            set { _measuringPointID = value; }
        }

        [DataMember]
        public string MeasuringPointName
        {
            get { return _measuringPointName; }
            set { _measuringPointName = value; }
        }

        [DataMember]
        public string Category
        {
            get { return _category; }
            set { _category = value; }
        }

        [DataMember]
        public string FunctionalLocation
        {
            get { return _functionalLocation; }
            set { _functionalLocation = value; }
        }

        [DataMember]
        public string Equipment
        {
            get { return _equipment; }
            set { _equipment = value; }
        }
        #endregion
    }

    [DataContract]
    public class MeasurementDocumentInfo
    {
        #region Private Fields
        private string _measDocName = string.Empty;
        private int _workGroupID = 0;
        private string _scheduleStatus = null;
        private int _scheduleDetailID = 0;
        private List<MeasDocMeasPoint> _measPointsList = new List<MeasDocMeasPoint>();
        private int _totalRecords = 0;
        #endregion

        #region Properties
        [DataMember]
        public string MeasDocName
        {
            get { return _measDocName; }
            set { _measDocName = value; }

        }

        [DataMember]
        public int WorkGroupID
        {
            get { return _workGroupID; }
            set { _workGroupID = value; }

        }

        [DataMember]
        public int ScheduleDetailID
        {
            get { return _scheduleDetailID; }
            set { _scheduleDetailID = value; }

        }

        [DataMember]
        public string ScheduleStatus
        {
            get { return _scheduleStatus; }
            set { _scheduleStatus = value; }

        }

        [DataMember]
        public List<MeasDocMeasPoint> MeasPointsList
        {
            get { return _measPointsList; }
            set { _measPointsList = value; }
        }

        [DataMember]
        public int TotalRecords
        {
            get { return _totalRecords; }
            set { _totalRecords = value; }

        }
        #endregion
    }

    [DataContract]
    public class MeasurementDocumentFilter : BasicParam
    {
        #region Private Fields
        private int _scheduleID = 0;
        private string _fLocationIDs = string.Empty;
        private string _equipmentIDs = string.Empty;
        private string _measuringPoint = string.Empty;
        private string _categoryIDs = string.Empty;
        private int _pageSize = 0;
        private int _pageIndex = 0;
        private string _sortType = string.Empty;
        private int _workGroupID = 0;
        #endregion

        #region Properties
        [DataMember]
        public int ScheduleID
        {
            get { return _scheduleID; }
            set { _scheduleID = value; }
        }

        [DataMember]
        public string FLocationIDs
        {
            get { return _fLocationIDs; }
            set { _fLocationIDs = value; }
        }

        [DataMember]
        public string EquipmentIDs
        {
            get { return _equipmentIDs; }
            set { _equipmentIDs = value; }
        }

        [DataMember]
        public string MeasuringPoint
        {
            get { return _measuringPoint; }
            set { _measuringPoint = value; }
        }

        [DataMember]
        public string CategoryIDs
        {
            get { return _categoryIDs; }
            set { _categoryIDs = value; }
        }

        [DataMember]
        public int PageSize
        {
            get { return _pageSize; }
            set { _pageSize = value; }
        }

        [DataMember]
        public int PageIndex
        {
            get { return _pageIndex; }
            set { _pageIndex = value; }
        }

        [DataMember]
        public string SortType
        {
            get { return _sortType; }
            set { _sortType = value; }
        }

        [DataMember]
        public int WorkGroupID
        {
            get { return _workGroupID; }
            set { _workGroupID = value; }
        }

        #endregion
    }

    [DataContract]
    public class MeasusrementDocumentScheduleInfo : BasicParam
    {
        #region Private Fields
        private int _scheduleID = 0;
        private string _documentName = string.Empty;
        private int _workGroupID = 0;
        private List<int> _selectedMeasuringPoints = new List<int>();
        #endregion

        #region Properties
        [DataMember]
        public int ScheduleID
        {
            get { return _scheduleID; }
            set { _scheduleID = value; }
        }

        [DataMember]
        public string DocumentName
        {
            get { return _documentName; }
            set { _documentName = value; }
        }

        [DataMember]
        public int WorkGroupID
        {
            get { return _workGroupID; }
            set { _workGroupID = value; }
        }

        [DataMember]
        public List<int> SelectedMeasuringPoints
        {
            get { return _selectedMeasuringPoints; }
            set { _selectedMeasuringPoints = value; }
        }
        #endregion
    }

    [DataContract]
    public class MeasDocScheduleMeasPoint : BasicParam
    {
        #region Private Fields
        private int _scheduleID = 0;
        private int _measuringPointID = 0;
        #endregion

        #region Properties
        [DataMember]
        public int ScheduleID
        {
            get { return _scheduleID; }
            set { _scheduleID = value; }
        }

        [DataMember]
        public int MeasuringPointID
        {
            get { return _measuringPointID; }
            set { _measuringPointID = value; }
        }
        #endregion
    }
    #endregion

    #region Work group

    [DataContract]
    public class WorkGroupFilterInfo : BasicParam
    {
        #region Private fields          
        private int _workGroupID = 0;
        private int _itemID = 0;
        private MasterDataType? _masterDataType = null;
        private string _searchString = string.Empty;
        #endregion

        #region properties
        [DataMember]
        public int WorkGroupID
        {
            get { return _workGroupID; }
            set { _workGroupID = value; }
        }
        [DataMember]
        public int ItemID
        {
            get { return _itemID; }
            set { _itemID = value; }
        }
        [DataMember]
        public MasterDataType? MasterDataType
        {
            get { return _masterDataType; }
            set { _masterDataType = value; }
        }
        [DataMember]
        public string SearchString
        {
            get { return _searchString; }
            set { _searchString = value; }
        }
        #endregion
    }

    [DataContract]
    public class WorkGroupInfo : MasterDataInfo
    {
        #region Private Fields         
        private List<WorkGroupUserInfo> _workGroupAssigneeList = new List<WorkGroupUserInfo>();
        private List<WorkGroupUserInfo> _workGroupReporterList = new List<WorkGroupUserInfo>();
        #endregion

        #region Properties       
        [DataMember]
        public List<WorkGroupUserInfo> WorkGroupAssigneeList
        {
            get { return _workGroupAssigneeList; }
            set { _workGroupAssigneeList = value; }
        }
        [DataMember]
        public List<WorkGroupUserInfo> WorkGroupReporterList
        {
            get { return _workGroupReporterList; }
            set { _workGroupReporterList = value; }
        }

        #endregion
    }

    public class WorkGroupUserInfo
    {
        #region Private Fields
        private int _itemID = 0;
        private int _userID = 0;
        private string _userName = string.Empty;
        private WorkGroupUserType? _workGroupUserType = null;
        private bool _scheduleNotification = false;
        private bool _onWork = false;
        private bool _onComplete = false;
        private bool _onReport = false;
        private bool _onDowntime = false;
        #endregion

        #region Properties
        [DataMember]
        public int ItemID
        {
            get { return _itemID; }
            set { _itemID = value; }
        }
        [DataMember]
        public int UserID
        {
            get { return _userID; }
            set { _userID = value; }
        }
        [DataMember]
        public string UserName
        {
            get { return _userName; }
            set { _userName = value; }
        }
        [DataMember]
        public WorkGroupUserType? WorkGroupUserType
        {
            get { return _workGroupUserType; }
            set { _workGroupUserType = value; }
        }

        [DataMember]
        public bool IsScheduleNotification
        {
            get { return _scheduleNotification; }
            set { _scheduleNotification = value; }
        }
        [DataMember]
        public bool IsOnWork
        {
            get { return _onWork; }
            set { _onWork = value; }
        }
        [DataMember]
        public bool IsOnComplete
        {
            get { return _onComplete; }
            set { _onComplete = value; }
        }

        [DataMember]
        public bool IsOnReport
        {
            get { return _onReport; }
            set { _onReport = value; }
        }

        [DataMember]
        public bool IsOnDowntime
        {
            get { return _onDowntime; }
            set { _onDowntime = value; }
        }
        #endregion

    }

    [DataContract]
    public enum WorkGroupUserType
    {
        [EnumMember]
        Assignee = 'A',
        [EnumMember]
        Report = 'R'
    }

    [DataContract]
    public class AutoCompleteUserInfo
    {
        #region Private Fields

        private int _userID = 0;
        private string _userName = string.Empty;

        #endregion

        #region Properties

        [DataMember]
        public int UserID
        {
            get { return _userID; }
            set { _userID = value; }
        }

        [DataMember]
        public string UserName
        {
            get { return _userName; }
            set { _userName = value; }
        }


        #endregion
    }

    [DataContract]
    public class AutoCompleteSearch : BasicParam
    {
        #region Fields

        private string _searchString = string.Empty;
        private int _dispayCount = 0;

        #endregion

        #region Properties

        [DataMember]
        public string SearchString
        {
            get { return _searchString; }
            set { _searchString = value; }
        }
        [DataMember]
        public int DisplayCount
        {
            get { return _dispayCount; }
            set { _dispayCount = value; }
        }
        #endregion
    }
    #endregion

    #region View Work Order

    #region Resource View

    [DataContract]
    public class WorkOrderResourceViewInfo
    {
        [DataMember]
        public string MonthYear { get; set; } = string.Empty;
        [DataMember]
        public List<WorkOrderTimelineEventInfo> eventInfoList = new List<WorkOrderTimelineEventInfo>();
        [DataMember]
        public List<TypeValueInfo> FunctionalLocationEquipmentList = new List<TypeValueInfo>();
        [DataMember]
        public int TotalRecords { get; set; } = 0;
    }

    [DataContract]
    public class WorkOrderTimelineEventInfo
    {
        [DataMember]
        public int EquipmentID { get; set; } = 0;
        [DataMember]
        public int LocationID { get; set; } = 0;
        [DataMember]
        public int ScheduleDate { get; set; } = 0;
        [DataMember]
        public List<WorkOrderTimelineEventDetails> EventListDetailsList = new List<WorkOrderTimelineEventDetails>();
        [DataMember]
        public string EquipmentName { get; set; } = string.Empty;
        [DataMember]
        public string LocationName { get; set; } = string.Empty;
    }

    [DataContract]
    public class WorkOrderTimelineEventDetails
    {
        [DataMember]
        public string WorkOrderID { get; set; } = string.Empty;
        [DataMember]
        public string WorkOrderNumber { get; set; } = string.Empty;
        [DataMember]
        public string MaintenanceName { get; set; } = string.Empty;
        [DataMember]
        public string StartDateTime { get; set; } = string.Empty;
        [DataMember]
        public string EndDateTime { get; set; } = string.Empty;
    }

    [DataContract]
    public class WorkOrderResourceViewFilter : BasicParam
    {
        [DataMember]
        public int Month { get; set; } = 0;
        [DataMember]
        public int Year { get; set; } = 0;
        //[DataMember]
        //public int LocationID { get; set; } = 0;
        //[DataMember]
        //public int EquipmentID { get; set; } = 0;
        [DataMember]
        public string FunctionalLocIDs { get; set; } = string.Empty;
        [DataMember]
        public string EquipmentIDs { get; set; } = string.Empty;
        [DataMember]
        public int PageSize { get; set; } = 0;
        [DataMember]
        public int PageIndex { get; set; } = 0;
    }

    [DataContract]
    public class LocationEquipmentInfo : KeyValueInfo
    {
        [DataMember]
        public List<KeyValueInfo> EquipmentInfoList { get; set; } = new List<KeyValueInfo>();
    }

    #endregion

    #region Display WorkOrdr Info

    [DataContract]
    public class WorkOrderFilter : BasicParam
    {
        [DataMember]
        public string WorkOrderID { get; set; } = string.Empty;
        [DataMember]
        public int EquipmentID { get; set; } = 0;
    }

    [DataContract]
    public class WorkOrderCloseInfo : BasicParam
    {
        [DataMember]
        public string WorkOrderID { get; set; } = string.Empty;
        [DataMember]
        public bool IsWorkOrderClose { get; set; } = false;
        [DataMember]
        public int WorkStartDate { get; set; } = 0;
        [DataMember]
        public int WorkStartTime { get; set; } = 0;
        [DataMember]
        public int WorkEndDate { get; set; } = 0;
        [DataMember]
        public int WorkEndTime { get; set; } = 0;
        [DataMember]
        public decimal LaborTime { get; set; } = 0;
        [DataMember]
        public UnitOfTime LaborTimeTakenUnit { get; set; } = UnitOfTime.Hours;
        [DataMember]
        public decimal TimeSpent { get; set; } = 0;
        [DataMember]
        public UnitOfTime TimeSpentUnit { get; set; } = UnitOfTime.Hours;
        [DataMember]
        public int BreakdownStartDate { get; set; } = 0;
        [DataMember]
        public int BreakdownStartTime { get; set; } = 0;
        [DataMember]
        public int BreakdownEndDate { get; set; } = 0;
        [DataMember]
        public int BreakdownEndTime { get; set; } = 0;
        [DataMember]
        public decimal BreakdownDuration { get; set; } = 0;
        [DataMember]
        public UnitOfTime BreakdownDurationUnit { get; set; } = UnitOfTime.Hours;
        [DataMember]
        public string ClosedBy { get; set; } = string.Empty;
        [DataMember]
        public string ClosedOn { get; set; } = string.Empty;
    }

    [DataContract]
    public class WorkOrderBasicInfo : WorkOrderCloseInfo
    {
        [DataMember]
        public string MaintenanceName { get; set; } = string.Empty;
        [DataMember]
        public string Description { get; set; } = string.Empty;
        [DataMember]
        public string MaintenanceType { get; set; } = string.Empty;
        [DataMember]
        public string Status { get; set; } = string.Empty;
        [DataMember]
        public string ScheduledDateTime { get; set; } = string.Empty;
        [DataMember]
        public string StartDateTime { get; set; } = string.Empty;
        [DataMember]
        public string ActualStartDateTime { get; set; } = string.Empty;
        [DataMember]
        public string CompletedDateTime { get; set; } = string.Empty;
        [DataMember]
        public decimal EstimatedTime { get; set; } = 0;
        [DataMember]
        public decimal ActualTime { get; set; } = 0;
        [DataMember]
        public string Priority { get; set; } = string.Empty;
        [DataMember]
        public string AssignedTo { get; set; } = string.Empty;
        [DataMember]
        public string ReportedTo { get; set; } = string.Empty;
        [DataMember]
        public int EquipmentID { get; set; } = 0;
        [DataMember]
        public string EquipmentName { get; set; } = string.Empty;
        [DataMember]
        public string EquipmentType { get; set; } = string.Empty;
        [DataMember]
        public string EquipmentImagePath { get; set; } = string.Empty;
        [DataMember]
        public string EquipmentOrgImagePath { get; set; } = string.Empty;
        [DataMember]
        public int LocationID { get; set; } = 0;
        [DataMember]
        public string LocationName { get; set; } = string.Empty;
        [DataMember]
        public string LocationImagePath { get; set; } = string.Empty;
        [DataMember]
        public string LocationOrgImagePath { get; set; } = string.Empty;
    }

    [DataContract]
    public class WorkOrderEquipmentInfo
    {
        [DataMember]
        public int EquipmentID { get; set; } = 0;
        [DataMember]
        public string EquipmentName { get; set; } = string.Empty;
        [DataMember]
        public string Description { get; set; } = string.Empty;
        [DataMember]
        public string Location { get; set; } = string.Empty;
        [DataMember]
        public string Type { get; set; } = string.Empty;
        [DataMember]
        public string Class { get; set; } = string.Empty;
        [DataMember]
        public string EquipmentImagePath { get; set; } = string.Empty;
        [DataMember]
        public string EquipmentOrgImagePath { get; set; } = string.Empty;
        [DataMember]
        public string ModelNumber { get; set; } = string.Empty;
        [DataMember]
        public string ModelName { get; set; } = string.Empty;
        [DataMember]
        public string Manufacturer { get; set; } = string.Empty;
        [DataMember]
        public string SerialNumber { get; set; } = string.Empty;
        [DataMember]
        public string WarrentyNo { get; set; } = string.Empty;
        [DataMember]
        public string WarretyStatus { get; set; } = string.Empty;
        [DataMember]
        public string WarrentyExpiryDate { get; set; } = string.Empty;
        [DataMember]
        public string PurchaseDate { get; set; } = string.Empty;
        [DataMember]
        public string InstalledDate { get; set; } = string.Empty;
        [DataMember]
        public List<DocumentInfo> DocumentInfoList { get; set; } = new List<DocumentInfo>();
    }

    [DataContract]
    public class WorkOrderTaskDetails
    {
        [DataMember]
        public List<WorkOrderTaskInfo> TaskInfoList { get; set; } = new List<WorkOrderTaskInfo>();
        [DataMember]
        public List<SelectionGroupInfo> SeletionGroupInfoList { get; set; } = new List<SelectionGroupInfo>();
        [DataMember]
        public bool IsScheduledForToday { get; set; } = false;
    }

    [DataContract]
    public class WorkOrderTaskInfo
    {
        [DataMember]
        public int TaskID { get; set; } = 0;
        [DataMember]
        public string TaskName { get; set; } = string.Empty;
        [DataMember]
        public string Description { get; set; } = string.Empty;
        [DataMember]
        public bool IsSafetyConfirmed { get; set; } = false;
        [DataMember]
        public string SafetyDescription { get; set; } = string.Empty;
        [DataMember]
        public decimal EstimatedTime { get; set; } = 0;
        [DataMember]
        public bool RemarkEnabled { get; set; } = false;
        [DataMember]
        public bool IsRemarkMandatory { get; set; } = false;
        [DataMember]
        public string Remarks { get; set; } = string.Empty;
        [DataMember]
        public bool PictureEnabled { get; set; } = false;
        [DataMember]
        public bool IsPictureMandatory { get; set; } = false;
        [DataMember]
        public string Status { get; set; } = string.Empty;
        [DataMember]
        public string StartedBy { get; set; } = string.Empty;
        [DataMember]
        public string StartedDateTime { get; set; } = string.Empty;
        [DataMember]
        public string EndedBy { get; set; } = string.Empty;
        [DataMember]
        public string EndDateTime { get; set; } = string.Empty;
        [DataMember]
        public bool IsPPEConfirmed { get; set; } = false;

        [DataMember]
        public List<WorkOrderTaskImageInfo> PPEList = new List<WorkOrderTaskImageInfo>();
        [DataMember]
        public List<WorkOrderTaskImageInfo> ToolsList = new List<WorkOrderTaskImageInfo>();
        [DataMember]
        public List<WorkOrderTaskImageInfo> ImageList = new List<WorkOrderTaskImageInfo>();
        [DataMember]
        public List<WorkOrderTaskParameterInfo> ParameterList = new List<WorkOrderTaskParameterInfo>();
        [DataMember]
        public List<DocumentInfo> DocumentInfoList = new List<DocumentInfo>();
    }

    [DataContract]
    public class WorkOrderTaskImageInfo
    {
        [DataMember]
        public int ImageID { get; set; } = 0;
        [DataMember]
        public string Description { get; set; } = string.Empty;
        [DataMember]
        public string ImagePath { get; set; } = string.Empty;
        [DataMember]
        public string ThubmnailPath { get; set; } = string.Empty;
    }

    [DataContract]
    public class WorkOrderTaskParameterInfo
    {
        [DataMember]
        public int ParameterID { get; set; } = 0;
        [DataMember]
        public string ParameterName { get; set; } = string.Empty;
        [DataMember]
        public ParameterType Type { get; set; } = ParameterType.SingleLineText;
        [DataMember]
        public bool IsMandatory { get; set; } = false;
        [DataMember]
        public string Value { get; set; } = string.Empty;
        [DataMember]
        public string ValueDisplayName { get; set; } = string.Empty;
        [DataMember]
        public int SelectionGroupID { get; set; } = 0;
    }

    [DataContract]
    public class SelectionGroupInfo
    {
        [DataMember]
        public int SelectionGroupID { get; set; } = 0;
        [DataMember]
        public List<KeyValueInfo> KeyValueInfoList { get; set; } = new List<KeyValueInfo>();
    }

    [DataContract]
    public class WorkOrderTaskImageUploadInfo : BasicParam
    {
        [DataMember]
        public string WorkOrderID { get; set; } = string.Empty;
        [DataMember]
        public int TaskID { get; set; } = 0;
        [DataMember]
        public string ImageName { get; set; } = string.Empty;
    }

    [DataContract]
    public class WorkOrderSparePartsInfo
    {
        [DataMember] public List<MaintSparePartInfo> WorkOrderSpareParts { get; set; } = new List<MaintSparePartInfo>();
        [DataMember] public bool IsOrderInProgress { get; set; } = false;
    }

    #endregion

    #region Start/End Task

    [DataContract]
    public class WorkOrderTaskProcessInfo : BasicParam
    {
        [DataMember]
        public string WorkOrderID { get; set; } = string.Empty;
        [DataMember]
        public int TaskID { get; set; } = 0;
        [DataMember]
        public List<int> TaskPPEIDList { get; set; } = new List<int>();
        [DataMember]
        public bool IsSafetyConfirmed { get; set; } = false;
        [DataMember]
        public bool IsPPEConfirmed { get; set; } = false;
    }

    [DataContract]
    public class TaskStartEndReturnInfo
    {
        [DataMember]
        public int ReturnValue { get; set; } = 0;
        [DataMember]
        public string UserName { get; set; } = string.Empty;
        [DataMember]
        public string CurrentDateTime { get; set; } = string.Empty;
        [DataMember]
        public List<int> MissingParameterIDList { get; set; } = new List<int>();
    }

    [DataContract]
    public class TaskParameterInfo : BasicParam
    {
        [DataMember]
        public string WorkOrderID { get; set; } = string.Empty;
        [DataMember]
        public int TaskID { get; set; } = 0;
        [DataMember]
        public string Remarks { get; set; } = string.Empty;
        [DataMember]
        public List<TaskParameterValueInfo> ParameterList { get; set; } = new List<TaskParameterValueInfo>();
    }

    [DataContract]
    public class TaskParameterValueInfo
    {
        [DataMember]
        public int ParameterID { get; set; } = 0;
        [DataMember]
        public string ParameterValue { get; set; } = string.Empty;
        [DataMember]
        public int SelectCodeItem { get; set; } = 0;
    }

    [DataContract]
    public enum TaskStatus
    {
        [EnumMember]
        NotStarted = 'N',
        [EnumMember]
        InProgess = 'P',
        [EnumMember]
        Completed = 'C'
    }

    #endregion

    [DataContract]
    public class UserWorkGroupInfo
    {
        [DataMember]
        public string UserType { get; set; } = string.Empty;
        [DataMember]
        public List<int> WorkGroupIDList { get; set; } = new List<int>();
    }

    [DataContract]
    public class WorkOrderEquipmentHistoryInfo
    {
        [DataMember]
        public string WorkOrderNumber { get; set; } = string.Empty;
        [DataMember]
        public string MaintenanceName { get; set; } = string.Empty;
        [DataMember]
        public string MaintenanceType { get; set; } = string.Empty;
        [DataMember]
        public WorkOrderStatus WorkOrderStatus { get; set; } = WorkOrderStatus.SCHEDULED;
        [DataMember]
        public string CompleteDate { get; set; } = string.Empty;
        [DataMember]
        public string Priority { get; set; } = string.Empty;
        [DataMember]
        public string Description { get; set; } = string.Empty;
        [DataMember]
        public decimal TimeSpent { get; set; } = 0;
        [DataMember]
        public UnitOfTime TimeSpentUnit { get; set; } = UnitOfTime.Hours;
        [DataMember]
        public decimal BreakdownDuration { get; set; } = 0;
        [DataMember]
        public UnitOfTime BreakdownDurationUnit { get; set; } = UnitOfTime.Hours;
    }


    [DataContract]
    public class EquipmentHistoryFilter
    {
        #region Private Fields    
        private int _equipmentID = 0;
        private string _searchString = string.Empty;
        private int _pageIndex = 0;
        private int _pageSize = 0;
        private string _sortType = string.Empty;
        private int _fromDate = 0;
        private int _toDate = 0;
        private string _workOrderNumber = string.Empty;
        #endregion

        #region Properties  
        [DataMember]
        public int EquipmentID
        {
            get { return _equipmentID; }
            set { _equipmentID = value; }
        }
        [DataMember]
        public string SearchString
        {
            get { return _searchString; }
            set { _searchString = value; }
        }
        [DataMember]
        public int PageIndex
        {
            get { return _pageIndex; }
            set { _pageIndex = value; }
        }
        [DataMember]
        public int PageSize
        {
            get { return _pageSize; }
            set { _pageSize = value; }
        }
        [DataMember]
        public string SortType
        {
            get { return _sortType; }
            set { _sortType = value; }
        }

        [DataMember]
        public int FromDate
        {
            get { return _fromDate; }
            set { _fromDate = value; }
        }
        [DataMember]
        public int ToDate
        {
            get { return _toDate; }
            set { _toDate = value; }
        }

        [DataMember]
        public string WorkOrderNumber
        {
            get { return _workOrderNumber; }
            set { _workOrderNumber = value; }
        }
        #endregion

    }

    [DataContract]
    public class WorkOrderEquipmentHistoryDetails
    {
        private List<WorkOrderEquipmentHistoryInfo> _workOrderEquipmentHistoryInfoList = new List<WorkOrderEquipmentHistoryInfo>();
        private int _totalRecords = 0;

        [DataMember]
        public List<WorkOrderEquipmentHistoryInfo> WorkOrderEquipmentHistoryInfoList
        {
            get { return _workOrderEquipmentHistoryInfoList; }
            set { _workOrderEquipmentHistoryInfoList = value; }
        }
        [DataMember]
        public int TotalRecords
        {
            get { return _totalRecords; }
            set { _totalRecords = value; }
        }

    }
    #endregion

    #region Tools Info
    [DataContract]
    public class ToolsFilterInfo : BasicParam
    {
        #region Private Fields
        private int _tooID = 0;
        private int _pageSize = 0;
        private int _pageIndex = 0;
        private string _sortType = string.Empty;
        #endregion

        #region Properties
        [DataMember]
        public int ToolID
        {
            get { return _tooID; }
            set { _tooID = value; }
        }
        [DataMember]
        public int PageSize
        {
            get { return _pageSize; }
            set { _pageSize = value; }
        }
        [DataMember]
        public int PageIndex
        {
            get { return _pageIndex; }
            set { _pageIndex = value; }
        }
        [DataMember]
        public string SortType
        {
            get { return _sortType; }
            set { _sortType = value; }
        }
        #endregion

    }

    [DataContract]
    public class ToolsInfo
    {
        #region Private Fields
        private int _tooID = 0;
        private string _imageName = string.Empty;
        private string _thumbPath = string.Empty;
        private string _toolDesc = string.Empty;
        #endregion

        #region Properties
        [DataMember]
        public int ToolID
        {
            get { return _tooID; }
            set { _tooID = value; }
        }

        [DataMember]
        public string ImageName
        {
            get { return _imageName; }
            set { _imageName = value; }
        }

        [DataMember]
        public string ToolDesc
        {
            get { return _toolDesc; }
            set { _toolDesc = value; }
        }
        [DataMember]
        public string ThumbnailPath
        {
            get { return _thumbPath; }
            set { _thumbPath = value; }
        }
        #endregion
    }

    [DataContract]
    public class ToolsListInfo
    {
        #region Private Fields
        private List<ToolsInfo> _toolsListInfo = new List<ToolsInfo>();
        private int _totalRecords = 0;
        #endregion

        #region Properties
        [DataMember]
        public List<ToolsInfo> ToolsList
        {
            get { return _toolsListInfo; }
            set { _toolsListInfo = value; }

        }

        [DataMember]
        public int TotalRecords
        {
            get { return _totalRecords; }
            set { _totalRecords = value; }

        }
        #endregion
    }


    #endregion

    #region Configure Spare Parts
    [DataContract]
    public class SparePartsFilterInfo : BasicParam
    {
        [DataMember]
        public int DynamicGridObjectID { get; set; } = 0;
        [DataMember]
        public DynamicGridSearchInfo DynamicGridSearchInfo { get; set; } = new DynamicGridSearchInfo();
    }

    [DataContract]
    public enum MaterialType
    {
        [EnumMember]
        SPARE_PART = 'S'
    }
    #endregion

    #region Notifications
    [DataContract]
    public enum NotificationStatus
    {
        [EnumMember]
        CREATED = 1,
        [EnumMember]
        ASSIGNED = 2,
        [EnumMember]
        REJECTED = 3,
        [EnumMember]
        COMPLETED = 4,
        [EnumMember]
        INPROGRESS = 5,
        [EnumMember]
        ACCEPTED = 6,
        [EnumMember]
        CLOSED = 7
    }

    [DataContract]
    public class NotificationBasicInfo
    {
        private int _notificationID = 0;
        private string _notificationName = string.Empty;
        private NotificationStatus? _notificationStatus = null;
        private string _createdOn = string.Empty;

        [DataMember]
        public int NotificationID
        {
            get { return _notificationID; }
            set { _notificationID = value; }
        }

        [DataMember]
        public string NotificationName
        {
            get { return _notificationName; }
            set { _notificationName = value; }
        }

        [DataMember]
        public NotificationStatus? NotificationStatus
        {
            get { return _notificationStatus; }
            set { _notificationStatus = value; }
        }

        [DataMember]
        public string CreatedOn
        {
            get { return _createdOn; }
            set { _createdOn = value; }
        }
    }

    [DataContract]
    public class NotificationInfo : NotificationBasicInfo
    {
        #region Private fileds
        private int _fLocationID = 0;
        private int _equipmentID = 0;
        private int _notificationTypeID = 0;
        private string _priority = string.Empty;
        private string _description = string.Empty;
        private string _workOrderNumber = string.Empty;
        private string _rejectedReason = string.Empty;
        private string _fLocationName = string.Empty;
        private string _equipmentName = string.Empty;
        private int _attachedSchedlueID = 0;
        private string _notificationType = string.Empty;
        private string _priorityValue = string.Empty;
        private string _createdBy = string.Empty;
        private int _sequenceID = 0;
        private int _requestedEndDate = 0;
        private int _timeTaken = 0;
        private UnitOfTime _timeTakenUnit = UnitOfTime.Hours;
        private int _workStartDate = 0;
        private int _workStartTime = 0;
        private int _workEndDate = 0;
        private int _workEndTime = 0;
        private string _remark = string.Empty;
		private string _flocationCode = string.Empty;
        private string _equipmentCode = string.Empty;
        private string _closedBy = string.Empty;
        private string _closedOn = string.Empty;
        private string _startTime = string.Empty;
        private string _endTime = string.Empty;
        #endregion

        #region Properties
        [DataMember]
        public int FLocationID
        {
            get { return _fLocationID; }
            set { _fLocationID = value; }
        }

        [DataMember]
        public int EquipmentID
        {
            get { return _equipmentID; }
            set { _equipmentID = value; }
        }

        [DataMember]
        public int NotificationTypeID
        {
            get { return _notificationTypeID; }
            set { _notificationTypeID = value; }
        }

        [DataMember]
        public string Priority
        {
            get { return _priority; }
            set { _priority = value; }
        }

        [DataMember]
        public string Description
        {
            get { return _description; }
            set { _description = value; }
        }

        [DataMember]
        public string WorkOrderNumber
        {
            get { return _workOrderNumber; }
            set { _workOrderNumber = value; }
        }

        [DataMember]
        public string RejectedReason
        {
            get { return _rejectedReason; }
            set { _rejectedReason = value; }
        }

        [DataMember]
        public string FLocationName
        {
            get { return _fLocationName; }
            set { _fLocationName = value; }
        }

        [DataMember]
        public string EquipmentName
        {
            get { return _equipmentName; }
            set { _equipmentName = value; }
        }

        [DataMember]
        public int AttachedSchedlueID
        {
            get { return _attachedSchedlueID; }
            set { _attachedSchedlueID = value; }
        }

        [DataMember]
        public string NotificationType
        {
            get { return _notificationType; }
            set { _notificationType = value; }
        }

        [DataMember]
        public string PriorityValue
        {
            get { return _priorityValue; }
            set { _priorityValue = value; }
        }

        [DataMember]
        public string CreatedBy
        {
            get { return _createdBy; }
            set { _createdBy = value; }
        }

        [DataMember]
        public int SequenceID
        {
            get { return _sequenceID; }
            set { _sequenceID = value; }
        }

        [DataMember]
        public int RequestedEndDate
        {
            get { return _requestedEndDate; }
            set { _requestedEndDate = value; }
        }

        [DataMember]
        public int TimeTaken
        {
            get { return _timeTaken; }
            set { _timeTaken = value; }
        }

        [DataMember]
        public int WorkStartDate
        {
            get { return _workStartDate; }
            set { _workStartDate = value; }
        }

        [DataMember]
        public int WorkStartTime
        {
            get { return _workStartTime; }
            set { _workStartTime = value; }
        }

        [DataMember]
        public int WorkEndDate
        {
            get { return _workEndDate; }
            set { _workEndDate = value; }
        }

        [DataMember]
        public int WorkEndTime
        {
            get { return _workEndTime; }
            set { _workEndTime = value; }
        }

        [DataMember]
        public string Remark
        {
            get { return _remark; }
            set { _remark = value; }
        }

        [DataMember]
        public UnitOfTime TimeTakenUnit
        {
            get { return _timeTakenUnit; }
            set { _timeTakenUnit = value; }
        }

		public string FLocationCode
        {
            get { return _flocationCode; }
            set { _flocationCode = value; }
        }

        [DataMember]
        public string EquipmentCode
        {
            get { return _equipmentCode; }
            set { _equipmentCode = value; }
        }

        [DataMember]
        public string ClosedBy
        {
            get { return _closedBy; }
            set { _closedBy = value; }
        }

        [DataMember]
        public string ClosedOn
        {
            get { return _closedOn; }
            set { _closedOn = value; }
        }

        [DataMember]
        public string StartTime
        {
            get { return _startTime; }
            set { _startTime = value; }
        }

        [DataMember]
        public string EndTime
        {
            get { return _endTime; }
            set { _endTime = value; }
        }


        #endregion
    }

    [DataContract]
    public class NotificationtFilter
    {
        #region Private Fields
        private int _selectionID = 0;
        private int _fLocationID = 0;
        private int _equipmentID = 0;
        private string _searchString = string.Empty;
        private int _pageIndex = 0;
        private int _pageSize = 0;
        private string _sortType = string.Empty;
        #endregion

        #region Properties
        [DataMember]
        public int SelectionID
        {
            get { return _selectionID; }
            set { _selectionID = value; }
        }
        [DataMember]
        public int FLocationID
        {
            get { return _fLocationID; }
            set { _fLocationID = value; }
        }
        [DataMember]
        public int EquipmentID
        {
            get { return _equipmentID; }
            set { _equipmentID = value; }
        }
        [DataMember]
        public string SearchString
        {
            get { return _searchString; }
            set { _searchString = value; }
        }
        [DataMember]
        public int PageIndex
        {
            get { return _pageIndex; }
            set { _pageIndex = value; }
        }
        [DataMember]
        public int PageSize
        {
            get { return _pageSize; }
            set { _pageSize = value; }
        }
        [DataMember]
        public string SortType
        {
            get { return _sortType; }
            set { _sortType = value; }
        }
        #endregion

    }

    [DataContract]
    public class NotificationList
    {
        private List<NotificationBasicInfo> _notificationInfoList = new List<NotificationBasicInfo>();
        private int _totalRecords = 0;

        [DataMember]
        public List<NotificationBasicInfo> NotificationInoList
        {
            get { return _notificationInfoList; }
            set { _notificationInfoList = value; }
        }
        [DataMember]
        public int TotalRecords
        {
            get { return _totalRecords; }
            set { _totalRecords = value; }
        }
       
    }


    #endregion

    #region OPC Configuration
    [DataContract]
    public class DataSourceBasicInfo
    {
        [DataMember] public int DataSourceID { get; set; } = 0;
        [DataMember] public int VersionID { get; set; } = 0;
        [DataMember] public int GatewayServiceID { get; set; } = 0;
    }

    [DataContract]
    public class DataSourceInfo : DataSourceBasicInfo
    {
        [DataMember] public string DataSourceName { get; set; } = string.Empty;
        [DataMember] public string ClientDLLName { get; set; } = string.Empty;
        [DataMember] public string RestServicePath { get; set; } = string.Empty;
        [DataMember] public string DependencyDLLName { get; set; } = string.Empty;
        [DataMember] public DataSourceStatus Status { get; set; } = DataSourceStatus.Draft;
        [DataMember] public string LastUpdatedOn { get; set; } = string.Empty;
        [DataMember] public bool IsClientDLLUploaded { get; set; } = false;
        [DataMember] public string LastUpdatedBy { get; set; } = string.Empty;
        [DataMember] public string ApplicationBasePath { get; set; } = string.Empty;
        [DataMember] public bool IsExternalDataSource { get; set; } = false;
    }

    [DataContract]
    public enum DataSourceStatus
    {
        [EnumMember]
        Approved = 'A',
        [EnumMember]
        Draft = 'D',
        [EnumMember]
        InActive = 'I'
    }

    [DataContract]
    public class IoTUUIDInfo
    {
        [DataMember] public string GatewayName { get; set; } = string.Empty;
        [DataMember] public string DataSourceName { get; set; } = string.Empty;
        [DataMember] public List<ServerInfo> ServerInfoList { get; set; } = new List<ServerInfo>();
    }

    [DataContract]
    public class ServerInfo
    {
        [DataMember] public int GatewayServiceID { get; set; } = 0;
        [DataMember] public int ServerID { get; set; } = 0;
        [DataMember] public string ServerName { get; set; } = string.Empty;
        [DataMember] public List<TagInfo> TagInfoList { get; set; } = new List<TagInfo>();
    }

    [DataContract]
    public class TagInfo
    {
        [DataMember] public int TagUUID { get; set; } = 0;
        [DataMember] public string TagName { get; set; } = string.Empty;
        [DataMember] public string TagDisplayName { get; set; } = string.Empty;
        [DataMember] public TagType TagInfoList { get; set; } = TagType.Default;
    }

    [DataContract]
    public enum TagType
    {
        [EnumMember]
        Default = 0,
        [EnumMember]
        Alert = 1,
        [EnumMember]
        TimeSeries = 2,
        [EnumMember]
        NonTimeSeries = 3
    }

    [DataContract]
    public class TagFilterInfo
    {
        [DataMember] public int ServerID { get; set; } = 0;
        [DataMember] public string ServerName { get; set; } = string.Empty;
        [DataMember] public string TagName { get; set; } = string.Empty;
        [DataMember] public TagPropertiesFilterInfo UUIDProperties { get; set; } = new TagPropertiesFilterInfo();
    }

    [DataContract]
    public class TagPropertiesFilterInfo
    {
        [DataMember] public int PLineID { get; set; } = 0;
        [DataMember] public string MapAccessRights { get; set; } = string.Empty;
        [DataMember] public string MapDataType { get; set; } = string.Empty;
        [DataMember] public string MapUOM { get; set; } = string.Empty;
        [DataMember] public string TransducerType { get; set; } = string.Empty;
    }
    #endregion
}