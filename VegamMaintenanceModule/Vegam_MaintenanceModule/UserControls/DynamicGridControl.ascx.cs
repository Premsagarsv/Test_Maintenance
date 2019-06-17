using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Vegam_MaintenanceModule.UserControls
{
    public partial class DynamicGridControl : iPAS_Base.BaseControl
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                if (this.CurrentUser.AccessLevel == iPAS_Base.AccessLevel.COMPANY_LEVEL || this.CurrentUser.AccessLevel == iPAS_Base.AccessLevel.PORTAL_ADMIN)
                {
                    divShareable.Visible = true;
                    hdnDeleteUserViewAccess.Value = AccessType.FULL_ACCESS.ToString();
                }
                else
                {
                    int accessLevelID = CommonBLL.GetAccessLevelID(this.CurrentUser.AccessLevel);
                    AccessType access = CommonBLL.ValidateUserPrivileges(this.CurrentUser.SiteID, this.CurrentUser.SiteID, this.CurrentUser.UserID, accessLevelID, Convert.ToInt32(Language_Resources.MaintenancePageID_Resource.ShareUserView));
                    if (access == AccessType.FULL_ACCESS)
                        divShareable.Visible = true;
                    else
                        divShareable.Visible = false;

                    hdnDeleteUserViewAccess.Value = access.ToString();
                }
            }
        }
    }

    public class DynamicGridProperties
    {
        #region private Fields

        private int _featureID = 0;
        private int _currentDate = 0;
        private string _imagePath = string.Empty;
        private string _datePickerFormat = string.Empty;
        private string _tableHeaderText = string.Empty;
        private string _customRowNavigationMethod = string.Empty;
        private DynamicGridType _gridType = DynamicGridType.Table;
        private PagerData _pagerData = new PagerData();
        private bool _disableFilters = false;
        private bool _disableColumnSelection = false;
        private bool _disableGroupBy = false;
        private string _webServiceName = string.Empty;
        private string _excelSheetName = string.Empty;
        private bool _showGroupRowsByDefault = true;

        #endregion

        #region Properties

        public int FeatureID
        {
            get { return _featureID; }
            set { _featureID = value; }
        }

        public int CurrentDate
        {
            get { return _currentDate; }
            set { _currentDate = value; }
        }

        public string DatePickerFormat
        {
            get { return _datePickerFormat; }
            set { _datePickerFormat = value; }
        }

        public string ImagePath
        {
            get { return _imagePath; }
            set { _imagePath = value; }
        }

        public string TableHeaderText
        {
            get { return _tableHeaderText; }
            set { _tableHeaderText = value; }
        }

        public string CustomRowNavigationMethod
        {
            get { return _customRowNavigationMethod; }
            set { _customRowNavigationMethod = value; }
        }

        public DynamicGridType GridType
        {
            get { return _gridType; }
            set { _gridType = value; }
        }

        public PagerData PagerData
        {
            get { return _pagerData; }
            set { _pagerData = value; }
        }

        public bool DisableFilter
        {
            get { return _disableFilters; }
            set { _disableFilters = value; }
        }

        public bool DisableColumnSelection
        {
            get { return _disableColumnSelection; }
            set { _disableColumnSelection = value; }
        }

        public bool DisableGroupBy
        {
            get { return _disableGroupBy; }
            set { _disableGroupBy = value; }
        }

        public string WebServiceName
        {
            get { return _webServiceName; }
            set { _webServiceName = value; }
        }

        public string ExcelSheetName
        {
            get { return _excelSheetName; }
            set { _excelSheetName = value; }
        }

        public bool ShowGroupRowsByDefault
        {
            get { return _showGroupRowsByDefault; }
            set { _showGroupRowsByDefault = value; }
        }

        #endregion
    }

    public class ProductionLinePermission
    {
        public int PLineID { get; set; } = 0;
        public string PLineName { get; set; } = string.Empty;
        public string AccessPermission { get; set; } = string.Empty;
    }

    public enum DisplayMode
    {
        None = 0,
        PrevDay = 1,
        NextDay = 2
    }

    public enum DynamicGridType
    {
        Table = 0,
        Calendar = 1,
        TableWithAutoLoad = 2
    }
}