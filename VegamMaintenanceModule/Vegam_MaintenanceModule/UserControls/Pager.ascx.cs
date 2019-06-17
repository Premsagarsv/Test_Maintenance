using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Vegam_MaintenanceModule.UserControls
{
    public partial class Pager : System.Web.UI.UserControl
    {
        private bool _allowPaging = false;
        private int _pageSize = 0;
        private int _rowCount = 0;
        private int _lastPage = 0;
        private string _selectMethod = string.Empty;

        #region Properties

        public int RowCount
        {
            get { return _rowCount; }
            set { _rowCount = value; }
        }

        public int CurrentPage
        {
            get
            {
                return Convert.ToInt32(hdfCurrentPage.Value);
            }
            set
            {
                hdfCurrentPage.Value = Convert.ToString(value);
            }
        }

        public bool AllowPaging
        {
            get { return _allowPaging; }
            set { _allowPaging = value; }
        }

        public int PageSize
        {
            get { return _pageSize; }
            set { _pageSize = value; }
        }

        public string SelectMethod
        {
            set
            {
                _selectMethod = value;
            }
            get
            {
                return _selectMethod;
            }
        }

        #endregion

        #region Methods

        public void doPaging()
        {
            int iPageCount = GetPageCount();
            if (CurrentPage >= iPageCount)
                CurrentPage = iPageCount - 1;

            if (RowCount > 0)
            {
                if (RowCount <= PageSize)
                    divPager.Visible = false;
                else
                    divPager.Visible = true;
            }
            else
                divPager.Visible = false;

            if (CurrentPage == 0)
            {
                hrefFirst.Visible = false;
                hrefNum1.Style.Value = "border-left:1px solid #DDDDDD";
            }
            else
            {
                hrefFirst.Visible = true;
            }

            _lastPage = iPageCount;
            int iMaxCount;

            if (iPageCount > 5)
            {
                hrefNext.Visible = true;
                if ((iPageCount - 2) == CurrentPage || (iPageCount - 1) == CurrentPage || iPageCount == CurrentPage)
                    iMaxCount = iPageCount - 5;
                else if (CurrentPage != 0 && CurrentPage != 1 && CurrentPage != 2)
                    iMaxCount = CurrentPage - 2;
                else
                    iMaxCount = 0;
            }
            else
            {
                hrefNum1.Style.Value = "border-left:1px solid #DDDDDD";
                hrefFirst.Visible = false;
                hrefLast.Visible = false;
                hrefNext.Visible = false;
                iMaxCount = 0;
            }

            if (CurrentPage >= 3 && iPageCount > 5)
                hrefPrevious.Visible = true;
            else
                hrefPrevious.Visible = false;

            if (_lastPage != 0 && (CurrentPage + 1 == _lastPage || CurrentPage + 2 == _lastPage || CurrentPage + 3 == _lastPage))
            {
                hrefLast.Visible = false;
                hrefNext.Visible = false;
            }
            else
            {
                if (iPageCount > 5)
                {
                    hrefLast.Visible = true;
                    hrefNext.Visible = true;
                }
                else
                {
                    hrefLast.Visible = false;
                    hrefNext.Visible = false;
                }

            }

            hrefNum1.Visible = false;
            hrefNum2.Visible = false;
            hrefNum3.Visible = false;
            hrefNum4.Visible = false;
            hrefNum5.Visible = false;

            for (int i = 0; i < 5 && iMaxCount < iPageCount; i++)
            {
                switch (i)
                {
                    case 0:
                        if (CurrentPage == iMaxCount)
                            hrefNum1.Attributes.Add("class", "active");
                        hrefNum1.InnerText = (iMaxCount + 1).ToString();
                        hrefNum1.Visible = true;
                        break;
                    case 1:
                        if (CurrentPage == iMaxCount)
                            hrefNum2.Attributes.Add("class", "active");
                        hrefNum2.InnerText = (iMaxCount + 1).ToString();
                        hrefNum2.Visible = true;
                        break;
                    case 2:
                        if (CurrentPage == iMaxCount)
                            hrefNum3.Attributes.Add("class", "active");
                        hrefNum3.InnerText = (iMaxCount + 1).ToString();
                        hrefNum3.Visible = true;
                        break;
                    case 3:
                        if (CurrentPage == iMaxCount)
                            hrefNum4.Attributes.Add("class", "active");
                        hrefNum4.InnerText = (iMaxCount + 1).ToString();
                        hrefNum4.Visible = true;
                        break;
                    case 4:
                        if (CurrentPage == iMaxCount)
                            hrefNum5.Attributes.Add("class", "active");
                        hrefNum5.InnerText = (iMaxCount + 1).ToString();
                        hrefNum5.Visible = true;
                        break;
                    default:
                        break;
                }
                iMaxCount++;
            }
        }

        private int GetPageCount()
        {
            int iCount = RowCount / PageSize;
            int iMod = RowCount % PageSize;
            if (iMod != 0)
                return iCount + 1;
            else
                return iCount;
        }

        public void BindControls(PagerData pagerData)
        {
            pagerData.CurrentPageID = hdfCurrentPage.ClientID;

            pagerData.PageIndex = (CurrentPage - 1);
            pagerData.Type = "Prev";
            hrefPrevious.Attributes.Add("onclick", "javascript:pageIndexClick(" + (new JavaScriptSerializer()).Serialize(pagerData) + "); return false;");

            pagerData.PageIndex = 0;
            pagerData.Type = "First";
            hrefFirst.Attributes.Add("onclick", "javascript:pageIndexClick(" + (new JavaScriptSerializer()).Serialize(pagerData) + "); return false;");

            if (hrefNum1.Visible == true)
            {
                pagerData.PageIndex = (Convert.ToInt32(hrefNum1.InnerText) - 1);
                pagerData.Type = "";
                hrefNum1.Attributes.Add("onclick", "javascript:pageIndexClick(" + (new JavaScriptSerializer()).Serialize(pagerData) + "); return false;");
            }
            if (hrefNum2.Visible == true)
            {
                pagerData.PageIndex = (Convert.ToInt32(hrefNum2.InnerText) - 1);
                pagerData.Type = "";
                hrefNum2.Attributes.Add("onclick", "javascript:pageIndexClick(" + (new JavaScriptSerializer()).Serialize(pagerData) + "); return false;");
            }
            if (hrefNum3.Visible == true)
            {
                pagerData.PageIndex = (Convert.ToInt32(hrefNum3.InnerText) - 1);
                pagerData.Type = "";
                hrefNum3.Attributes.Add("onclick", "javascript:pageIndexClick(" + (new JavaScriptSerializer()).Serialize(pagerData) + "); return false;");
            }
            if (hrefNum4.Visible == true)
            {
                pagerData.PageIndex = (Convert.ToInt32(hrefNum4.InnerText) - 1);
                pagerData.Type = "";
                hrefNum4.Attributes.Add("onclick", "javascript:pageIndexClick(" + (new JavaScriptSerializer()).Serialize(pagerData) + "); return false;");
            }
            if (hrefNum5.Visible == true)
            {
                pagerData.PageIndex = (Convert.ToInt32(hrefNum5.InnerText) - 1);
                pagerData.Type = "";
                hrefNum5.Attributes.Add("onclick", "javascript:pageIndexClick(" + (new JavaScriptSerializer()).Serialize(pagerData) + "); return false;");
            }
            pagerData.PageIndex = (_lastPage - 1);
            pagerData.Type = "Last";
            hrefLast.Attributes.Add("onclick", "javascript:pageIndexClick(" + (new JavaScriptSerializer()).Serialize(pagerData) + "); return false;");

            pagerData.PageIndex = CurrentPage;
            pagerData.Type = "Next";
            hrefNext.Attributes.Add("onclick", "javascript:pageIndexClick(" + (new JavaScriptSerializer()).Serialize(pagerData) + "); return false;");
        }

        #endregion
    }

    public class PagerData
    {
        public string LoadControlID { get; set; }
        public int UserID { get; set; }
        public int SiteID { get; set; }
        public int PageSize { get; set; }
        public int PageIndex { get; set; }
        public string CurrentPageID { get; set; }
        public int CurrentPage { get; set; }
        public string Type { get; set; }
        public string SelectMethod { get; set; }
        public string ServiceMethod { get; set; }
        public object ExtraParam { get; set; }
        public string ServicePath { get; set; }
        public string PageAccessRights { get; set; }
        public int AccessLevelID { get; set; }
        public string PlantDateFormat { get; set; }
        public string PlantTimeFormat { get; set; }
    }
}