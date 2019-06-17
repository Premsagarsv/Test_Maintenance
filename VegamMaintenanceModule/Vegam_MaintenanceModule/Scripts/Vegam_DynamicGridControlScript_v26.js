jQuery.DynamicGridNamespace = jQuery.DynamicGridNamespace || {};
jQuery.DynamicGridNamespace.FilterControlRenderType = { 'None': 78, 'Text': 84, 'Range': 82, 'DateRange': 68, 'Custom': 67, 'CustomMultiSelect': 77, 'EnumType': 69, 'EnumTypeMultiSelect': 83 };
jQuery.DynamicGridNamespace.FieldSelectionType = { 'None': 78, 'Optional': 79, 'OptionalDefaultViewDisplay': 68, 'Mandatory': 77, 'Custom': 67, 'SQLFilter': 70 };
jQuery.DynamicGridNamespace.SortType = { 'None': 78, 'Ascending': 65, 'Descending': 68 };
jQuery.DynamicGridNamespace.DataRenderType = { 'None': 78, 'Text': 84, 'SiteDate': 68, 'SiteTime': 77, 'EnumType': 69, 'Image': 73, 'Custom': 67, 'YesOrNo': 89};
jQuery.DynamicGridNamespace.GridType = { 'Table': 0, 'Calendar': 1, 'TableWithAutoLoad': 2 };
jQuery.DynamicGridNamespace.CalendorDisplayMode = { 'None': 0, 'PrevDay': 1, 'NextDay': 2 };
jQuery.DynamicGridNamespace.FilterControlDataType = { 'None': 78, 'Text': 84, 'Number': 73, 'Decimal': 68 };

jQuery.DynamicGridNamespace.PagerData = jQuery.DynamicGridNamespace.PagerData || {};
jQuery.DynamicGridNamespace.FeatureID = 0;
jQuery.DynamicGridNamespace.CurrentDate = 0;
jQuery.DynamicGridNamespace.DynamicGridTableHeaderText = '';
jQuery.DynamicGridNamespace.DatePickerDateFormat = '';
jQuery.DynamicGridNamespace.DeleteUseViewAccess = '';
jQuery.DynamicGridNamespace.CustomRowNavigationMethod = '';//Row Onclick method name

jQuery.DynamicGridNamespace.DisableFilter = false;
jQuery.DynamicGridNamespace.DisableColumnSelection = false;
jQuery.DynamicGridNamespace.DisableGroupBy = false;
jQuery.DynamicGridNamespace.WebServiceNameWithPath = '';

jQuery.DynamicGridNamespace.TotalRecords = 0;
jQuery.DynamicGridNamespace.IsSearch = false;

jQuery.DynamicGridNamespace.ObjectID = 0; //feature object ID
jQuery.DynamicGridNamespace.SelectedFieldIDList = [];//Selected Field ID List
jQuery.DynamicGridNamespace.ImageFieldIDList = [];//Render type Image Fiels ID
jQuery.DynamicGridNamespace.GroupedFieldValueInfo = {};//Grouped fields information with value
jQuery.DynamicGridNamespace.SelectedUserViewID = 0;//Selected userview ID
jQuery.DynamicGridNamespace.GroupID = 0;//In Group by view, this is used to assign unique ID for each group

jQuery.DynamicGridNamespace.SelectedProductionLineID = 0;
jQuery.DynamicGridNamespace.FeatureAdditionalInfo = '';

jQuery.DynamicGridNamespace.ContentLoadIsInProgress = false;//Auto content load
jQuery.DynamicGridNamespace.ContentLoadIsTriggered = false;//Auto content load
jQuery.DynamicGridNamespace.FieldSelectionChanged = false;//Set as 'true' when field selection is changed.
jQuery.DynamicGridNamespace.GroupFieldSelectionChanged = true;//This flag is to prevent knockout subscribe event, only two columns can be grouped, if already two are grouped then unselecting the first selected group field through code.
jQuery.DynamicGridNamespace.GroupSelectedFieldOrderList = [];//Order of the groupby fields selection.

jQuery.DynamicGridNamespace.GroupFieldProperties = {};
jQuery.DynamicGridNamespace.ExcelSheetName = '';
jQuery.DynamicGridNamespace.ShowGroupRowsByDefault = true;

jQuery.DynamicGridNamespace.FilterFieldValueInfoList = [];

jQuery.DynamicGridNamespace.IsSearchClicked = false;
/* The Following methods has to be written in respective page js files for specific functionalities.
 * BindFieldIDVariables - Called when field load is completed, To get respective field ID using identifier.
 * CustomGridAttributeBind - Called while rendering data, To add attruibtues to td.
 * CustomGridContentBind - Called while rendering data, To bind custom data.
 * GetCustomFilters - Called while searching or first time load, To get special filter values.
 * SetCustomFilterValues - Called when each filter is loaded, To set customixed values to filter controls.
 * CustomCalendarDateChange - Called when production line or date changed - Only for calendar.
 * DynamicGridNoRecords - Called when no records or search failed.
 * SearchDynamicFilters - Called on search or search failed.
 * CustomBindRowAttributes - Called to bind attributes to tr.
 * CustomGridGroupRowContentBind - Called while rendering group row.
 * GetCustomFilterValues - Called for rendering custom filter values, custom method should return array of object of type {TypeValue:'',DisplayName:''}
 */

var tScrollWidth = 0;
var tblMaxHeight = 0;
var tblBeforeHeight = 0;
var alreadyClicked = 0;
var diff = 0;
var dynamicGridViewModel = {
    GridFieldList: ko.observableArray([]),
    FilterFieldList: ko.observableArray([]),
    DisplayFieldList: ko.observableArray([]),
    GroupFieldList: ko.observableArray([]),
    TableHeaderFieldList: ko.observableArray([]),
    HeaderStatusInfoList: ko.observableArray([]),
    UserViewInfoList: ko.observableArray([]),
    TableBodyContent: ko.observableArray([]),
    ImagePath: ko.observable(''),
    TdDynamicGridPagerSpan: ko.observable(0),
    PageDisplayMode: 'table',
    FilterFieldExists: ko.observable(false),
    SelectedViewName: ko.observable('')
};

dynamicGridViewModel.TableHeaderFieldList.subscribe(function (headerList) {
    dynamicGridViewModel.TdDynamicGridPagerSpan(headerList.length);
});

function LoadDynamicGridBasicInfo(gridProperties) {
    jQuery.DynamicGridNamespace.PagerData = gridProperties.PagerData;
    jQuery.DynamicGridNamespace.FeatureID = gridProperties.FeatureID;
    jQuery.DynamicGridNamespace.CurrentDate = gridProperties.CurrentDate;
    jQuery.DynamicGridNamespace.DynamicGridTableHeaderText = gridProperties.TableHeaderText;
    jQuery.DynamicGridNamespace.DatePickerDateFormat = gridProperties.DatePickerFormat;
    jQuery.DynamicGridNamespace.CustomRowNavigationMethod = gridProperties.CustomRowNavigationMethod;
    jQuery.DynamicGridNamespace.DeleteUseViewAccess = jQuery("input[deleteuserviewpermissionctl]")[0].value;
    jQuery.DynamicGridNamespace.WebServiceNameWithPath = gridProperties.PagerData.ServicePath + "/" + gridProperties.WebServiceName;
    jQuery.DynamicGridNamespace.ExcelSheetName = gridProperties.ExcelSheetName;
    jQuery.DynamicGridNamespace.ShowGroupRowsByDefault = gridProperties.ShowGroupRowsByDefault;

    jQuery.DynamicGridNamespace.DisableFilter = gridProperties.DisableFilter;
    jQuery.DynamicGridNamespace.DisableColumnSelection = gridProperties.DisableColumnSelection;
    jQuery.DynamicGridNamespace.DisableGroupBy = gridProperties.DisableGroupBy;

    dynamicGridViewModel.ImagePath(gridProperties.ImagePath);

    if (gridProperties.GridType == jQuery.DynamicGridNamespace.GridType.Table)
        dynamicGridViewModel.PageDisplayMode = 'table';
    else if (gridProperties.GridType == jQuery.DynamicGridNamespace.GridType.TableWithAutoLoad)
        dynamicGridViewModel.PageDisplayMode = 'tablewithautoload';
    else
        dynamicGridViewModel.PageDisplayMode = 'calendar';

    ko.applyBindings(dynamicGridViewModel, document.getElementById("divDynamciGridControl"));

    if (gridProperties.GridType != jQuery.DynamicGridNamespace.GridType.Table)
        jQuery('#progressbar').progressbar({ maximum: 100 });
    else
        jQuery('#progressbar').addClass("hide");
    
    if (dynamicGridViewModel.PageDisplayMode == 'calendar') {
        jQuery("#spnDynamicGridTotalRecords").addClass("hide");
        jQuery("#spnDynamicGridTotalRecords").closest("div").addClass("cal-date");
        jQuery(".table-responsive").addClass("custom-table");
        jQuery("#spnDynamicGridTableHeader").removeClass("tiny-leftmargin").addClass("leftmargin");
    }
    else {
        jQuery("#divDynamicGridSearch").addClass("info-block").addClass("bottom-gap");
        jQuery("#divDynamicGridSearch div").removeClass("hide");
        jQuery("#spnDynamicGridTotalRecords").closest("div").removeClass("cal-date");
    }

    InitiateDatePicker();
    ApplyFilterToggle();
    LoadGridFieldnfo();
    EnableColumnSorting();   
    BindDynamicGridEvents();
}

//Fields info
function LoadGridFieldnfo() {
    jQuery("#spnTotalRecords").html(0);
    jQuery("#divDynamicGridPager").empty();
    if (jQuery.DynamicGridNamespace.TimerInterval != undefined) {
        clearInterval(jQuery.DynamicGridNamespace.TimerInterval);
        jQuery("#divDynamicGridProgress").removeClass("hide");

        if (jQuery.DynamicGridNamespace.ContentLoadIsInProgress) {
            var loadGridfieldInterval = setInterval(function () {
                if (!jQuery.DynamicGridNamespace.ContentLoadIsInProgress) {
                    clearInterval(loadGridfieldInterval);
                    LoadFieldInfo();
                }
            }, 2000);
        }
        else {            
            LoadFieldInfo();            
        }
    }
    else {        
        LoadFieldInfo();
    }    
}

function LoadFieldInfo() {
    ResetGlobalVariables();
    ResetViewModelProperties();
    ResetDOMElements();

    var gridfilter = {};
    gridfilter.SiteID = jQuery.DynamicGridNamespace.PagerData.SiteID;
    gridfilter.UserID = jQuery.DynamicGridNamespace.PagerData.UserID;
    gridfilter.FeatureID = jQuery.DynamicGridNamespace.FeatureID
    gridfilter.PlineID = jQuery.DynamicGridNamespace.SelectedProductionLineID;
    gridfilter.FeatureAdditionalInfo = jQuery.DynamicGridNamespace.FeatureAdditionalInfo;
    
    jQuery.ajax({
        type: "POST",
        url: jQuery.DynamicGridNamespace.WebServiceNameWithPath + "/GetDynamicGridFieldInfo",
        data: JSON.stringify({ gridfilter: gridfilter }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        success: function (json) {
            if (json != undefined && json.d != undefined) {
                if (json.d.ObjectID > 0 && jQuery.DynamicGridNamespace.SelectedProductionLineID == json.d.PlineID) {
                    jQuery("#divDynamicGridExcelDownload").removeClass("hide");
                    jQuery("#divDynamicGridRefresh").removeClass("hide");
                    if (dynamicGridViewModel.PageDisplayMode == 'calendar')
                        SetDayViewControls();
                    else
                        jQuery("#spnDynamicGridTableHeader").html(jQuery.DynamicGridNamespace.DynamicGridTableHeaderText);

                    BindFieldInfo(json.d);
                    ReLoadGridContent();
                }
                else {
                    ErrorMessageDialog(null, DynamicGridLanguageResource.resMsg_Error + DynamicGridLanguageResource.resMsg_FeatureIsNotConfigured);
                }
            }
        },       
        error: function (request, error) {
            ErrorMessageDialog(request, DynamicGridLanguageResource.resMsg_Error + DynamicGridLanguageResource.resMsg_FailedToLoadFields);
        }
    });   
}

function BindFieldInfo(objectFieldInfo) {
    jQuery.DynamicGridNamespace.ObjectID = objectFieldInfo.ObjectID;
    jQuery.DynamicGridNamespace.SelectedUserViewID = 0;
    jQuery.DynamicGridNamespace.SelectedFieldIDList = [];

    if (dynamicGridViewModel.PageDisplayMode == 'calendar') {
        var tableHeaderFieldInfo = {};
        tableHeaderFieldInfo.FieldID = 0;
        tableHeaderFieldInfo.FieldIdentifier = "rownumber";
        tableHeaderFieldInfo.DisplayName = '';
        tableHeaderFieldInfo.DisplayOrder = 0;
        tableHeaderFieldInfo.SortType = jQuery.DynamicGridNamespace.SortType.None;
        tableHeaderFieldInfo.EnableSorting = false;
        tableHeaderFieldInfo.FieldSelectionType = jQuery.DynamicGridNamespace.FieldSelectionType.Custom;        
        tableHeaderFieldInfo.HasCustomAttribute = false;
        tableHeaderFieldInfo.HasCustomDataBind = false;    
        dynamicGridViewModel.TableHeaderFieldList.push(tableHeaderFieldInfo);
    }

    var userViewFieldExists = false;
    var savedViewInfo = {};
    savedViewInfo.ViewID = 0;
    savedViewInfo.ViewName = 'Default View';
    savedViewInfo.IsSharedView = false;    
    dynamicGridViewModel.UserViewInfoList.push(savedViewInfo);
    dynamicGridViewModel.SelectedViewName(savedViewInfo.ViewName); 

    var savedFilterData = RetriveSavedDynamicGridFilterValues();//This is used to get user selected filter values before page redirection.

    ko.utils.arrayFirst(objectFieldInfo.UserViewInfoList, function (userViewInfo) {        
        dynamicGridViewModel.UserViewInfoList.push(userViewInfo);

        if (objectFieldInfo.UserDefaultViewID != 0 && objectFieldInfo.UserDefaultViewID == userViewInfo.ViewID) {            
            jQuery.DynamicGridNamespace.SelectedUserViewID = objectFieldInfo.UserDefaultViewID;
            dynamicGridViewModel.SelectedViewName(userViewInfo.ViewName);
        }
    });

    ko.utils.arrayForEach(objectFieldInfo.TypeValueInfoList, function (typeInfo) {
        dynamicGridViewModel.HeaderStatusInfoList.push(typeInfo);
    });

    ko.utils.arrayForEach(objectFieldInfo.FieldInfoList, function (fieldInfo) {
        dynamicGridViewModel.GridFieldList.push(fieldInfo);

        var isDisplayField = (fieldInfo.FieldSelectionType != jQuery.DynamicGridNamespace.FieldSelectionType.SQLFilter && fieldInfo.FieldSelectionType != jQuery.DynamicGridNamespace.FieldSelectionType.None) ? true : false;
        var isMandatoryField = (fieldInfo.FieldSelectionType == jQuery.DynamicGridNamespace.FieldSelectionType.Mandatory || fieldInfo.FieldSelectionType == jQuery.DynamicGridNamespace.FieldSelectionType.Custom) ? true : false;
        var isUserViewField = (fieldInfo.UserViewGroupByOrder == 0 && fieldInfo.UserViewDisplayOrder > 0) ? true : false;

        var isSavedFilterField = false;
        if (savedFilterData != undefined && savedFilterData[fieldInfo.FieldID] != undefined)
            isSavedFilterField = true;

        var userViewDisplayOrder = fieldInfo.DisplayOrder;
        if (!isMandatoryField) {
            if (jQuery.DynamicGridNamespace.SelectedUserViewID > 0 && fieldInfo.UserViewDisplayOrder > 0)
                userViewDisplayOrder = (fieldInfo.UserViewDisplayOrder + 100);
            else if (jQuery.DynamicGridNamespace.SelectedUserViewID > 0 || fieldInfo.FieldSelectionType == jQuery.DynamicGridNamespace.FieldSelectionType.Optional)
                userViewDisplayOrder = 1000;
            else if (fieldInfo.FieldSelectionType == jQuery.DynamicGridNamespace.FieldSelectionType.OptionalDefaultViewDisplay)
                userViewDisplayOrder = (userViewDisplayOrder + 100);
        }

        if (!jQuery.DynamicGridNamespace.DisableColumnSelection && isDisplayField && !isMandatoryField) {
            var displayFieldInfo = {};
            displayFieldInfo.FieldID = fieldInfo.FieldID;
            displayFieldInfo.FieldIdentifier = fieldInfo.FieldIdentifier;
            displayFieldInfo.DisplayName = fieldInfo.DisplayName;
            displayFieldInfo.DisplayOrder = fieldInfo.DisplayOrder;
            displayFieldInfo.EnableSorting = fieldInfo.EnableSorting;
            displayFieldInfo.HasCustomAttribute = fieldInfo.HasCustomAttribute;
            displayFieldInfo.HasCustomDataBind = fieldInfo.HasCustomDataBind;
            displayFieldInfo.FieldSelectionType = fieldInfo.FieldSelectionType;
            displayFieldInfo.UserViewDisplayOrder = userViewDisplayOrder;
            displayFieldInfo.SelectedClass = ko.observable("fa fa-check gray tiny-rightmargin tiny-leftmargin font-big");
            displayFieldInfo.IsSelected = ko.observable(false);
            displayFieldInfo.IsSelected.subscribe(function () {
                if (displayFieldInfo.IsSelected() == true)
                    displayFieldInfo.SelectedClass("fa fa-check text-success tiny-rightmargin tiny-leftmargin font-big");
                else
                    displayFieldInfo.SelectedClass("fa fa-check gray tiny-rightmargin tiny-leftmargin font-big");
            });
            if ((jQuery.DynamicGridNamespace.SelectedUserViewID > 0 && isUserViewField) || (jQuery.DynamicGridNamespace.SelectedUserViewID == 0 && fieldInfo.FieldSelectionType == jQuery.DynamicGridNamespace.FieldSelectionType.OptionalDefaultViewDisplay))
                displayFieldInfo.IsSelected(true);
            else
                displayFieldInfo.IsSelected(false); 
            dynamicGridViewModel.DisplayFieldList.push(displayFieldInfo);

            if (displayFieldInfo.IsSelected() == true)
                jQuery.DynamicGridNamespace.SelectedFieldIDList.push(fieldInfo.FieldID);
        }

        if (!jQuery.DynamicGridNamespace.DisableGroupBy  && fieldInfo.EnableGrouping) {
            var groupFieldInfo = {};
            groupFieldInfo.FieldID = fieldInfo.FieldID;
            groupFieldInfo.FieldIdentifier = fieldInfo.FieldIdentifier;
            groupFieldInfo.DisplayName = fieldInfo.DisplayName;
            if (fieldInfo.UserViewGroupByOrder > 0) {
                groupFieldInfo.SelectedClass = ko.observable("fa fa-check text-success tiny-rightmargin tiny-leftmargin font-big");
                groupFieldInfo.IsSelected = ko.observable(true);
            }
            else {
                groupFieldInfo.SelectedClass = ko.observable("fa fa-check gray tiny-rightmargin tiny-leftmargin font-big");
                groupFieldInfo.IsSelected = ko.observable(false);
            }
            groupFieldInfo.IsSelected.subscribe(function () {
                if (groupFieldInfo.IsSelected() == true)
                    groupFieldInfo.SelectedClass("fa fa-check text-success tiny-rightmargin tiny-leftmargin font-big");
                else
                    groupFieldInfo.SelectedClass("fa fa-check gray tiny-rightmargin tiny-leftmargin font-big");

                ChangeGroupBySelection(groupFieldInfo, 0);
            });
            dynamicGridViewModel.GroupFieldList.push(groupFieldInfo);

            var defaultGroupSortFieldIdentifierInfo;
            var grpSortExcludeFilterFieldInfo;
            if (fieldInfo.DefaultGroupSortingFieldIdentifier.length > 0 || fieldInfo.GroupSortingExcludeFilterFieldIdentifier.length > 0) {
                ko.utils.arrayForEach(objectFieldInfo.FieldInfoList, function (groupSortFieldInfo) {
                    if (fieldInfo.DefaultGroupSortingFieldIdentifier.length > 0 && groupSortFieldInfo.FieldIdentifier.toLowerCase() == fieldInfo.DefaultGroupSortingFieldIdentifier.toLowerCase())
                        defaultGroupSortFieldIdentifierInfo = groupSortFieldInfo;

                    if (fieldInfo.GroupSortingExcludeFilterFieldIdentifier.length > 0 && groupSortFieldInfo.FieldIdentifier.toLowerCase() == fieldInfo.GroupSortingExcludeFilterFieldIdentifier.toLowerCase())
                        grpSortExcludeFilterFieldInfo = groupSortFieldInfo;
                });
            }

            var groupProperties = {};
            groupProperties.EnableGroupSorting = fieldInfo.EnableGroupSorting;
            if (defaultGroupSortFieldIdentifierInfo != undefined)
                groupProperties.DefaultGroupSortingFieldID = defaultGroupSortFieldIdentifierInfo.FieldID;
            else
                groupProperties.DefaultGroupSortingFieldID = 0;
            if (grpSortExcludeFilterFieldInfo != undefined)
                groupProperties.GroupSortingExcludeFilterFieldID = grpSortExcludeFilterFieldInfo.FieldID;
            else
                groupProperties.GroupSortingExcludeFilterFieldID = 0;
            groupProperties.EnableGroupSelection = fieldInfo.EnableGroupSelection;
            jQuery.DynamicGridNamespace.GroupFieldProperties[fieldInfo.FieldID] = groupProperties;

            if (fieldInfo.UserViewGroupByOrder > 0) {
                ChangeGroupBySelection(groupFieldInfo, fieldInfo.UserViewGroupByOrder);
            }
        }

        if (isDisplayField && (isMandatoryField || (jQuery.DynamicGridNamespace.SelectedUserViewID > 0 && isUserViewField)
            || (jQuery.DynamicGridNamespace.SelectedUserViewID == 0 && fieldInfo.FieldSelectionType == jQuery.DynamicGridNamespace.FieldSelectionType.OptionalDefaultViewDisplay))) {               
            var tableHeaderFieldInfo = {};
            tableHeaderFieldInfo.FieldID = fieldInfo.FieldID;
            tableHeaderFieldInfo.DisplayName = fieldInfo.DisplayName;
            tableHeaderFieldInfo.DisplayOrder = userViewDisplayOrder;
            tableHeaderFieldInfo.FieldSelectionType = fieldInfo.FieldSelectionType;
            tableHeaderFieldInfo.EnableSorting = fieldInfo.EnableSorting;
            tableHeaderFieldInfo.SortType = jQuery.DynamicGridNamespace.SortType.None;
            tableHeaderFieldInfo.FieldIdentifier = fieldInfo.FieldIdentifier;
            tableHeaderFieldInfo.HasCustomAttribute = fieldInfo.HasCustomAttribute;
            tableHeaderFieldInfo.HasCustomDataBind = fieldInfo.HasCustomDataBind;                     
            dynamicGridViewModel.TableHeaderFieldList.push(tableHeaderFieldInfo);

            if (fieldInfo.EnableSorting == true && fieldInfo.UserViewSortType != jQuery.DynamicGridNamespace.SortType.None) {
                SortField(fieldInfo.FieldID, fieldInfo.UserViewSortType);
            }
        }

        if (!jQuery.DynamicGridNamespace.DisableFilter && fieldInfo.FilterControlRenderType != jQuery.DynamicGridNamespace.FilterControlRenderType.None) {

            dynamicGridViewModel.FilterFieldExists(true);

            if (fieldInfo.IsFixedFilter == false) {
                var filterFieldInfo = {};
                filterFieldInfo.FieldID = fieldInfo.FieldID;
                filterFieldInfo.DisplayName = fieldInfo.DisplayName;
                filterFieldInfo.FilterControlRenderType = fieldInfo.FilterControlRenderType;
                filterFieldInfo.DataRenderType = fieldInfo.DataRenderType;
                filterFieldInfo.FieldIdentifier = fieldInfo.FieldIdentifier;                
                filterFieldInfo.FilterDefaultValue = fieldInfo.FilterDefaultValue;
                filterFieldInfo.IsSelected = ko.observable(fieldInfo.IsUserViewFilterField);
                filterFieldInfo.FilterControlDataType = fieldInfo.FilterControlDataType;
                if (fieldInfo.IsUserViewFilterField)
                    filterFieldInfo.SelectedClass = ko.observable("fa fa-check text-success tiny-rightmargin tiny-leftmargin font-big");
                else
                    filterFieldInfo.SelectedClass = ko.observable("fa fa-check gray tiny-rightmargin tiny-leftmargin font-big");
                filterFieldInfo.IsSelected.subscribe(function (selectedField) {
                    if (filterFieldInfo.IsSelected() == true)
                        filterFieldInfo.SelectedClass("fa fa-check text-success tiny-rightmargin tiny-leftmargin font-big");
                    else
                        filterFieldInfo.SelectedClass("fa fa-check gray tiny-rightmargin tiny-leftmargin font-big");
                    ChangeFilterSelection(filterFieldInfo);
                });
                dynamicGridViewModel.FilterFieldList.push(filterFieldInfo);
            }

            if (fieldInfo.IsFixedFilter == true || fieldInfo.IsUserViewFilterField == true || isSavedFilterField) {
                RenderFilterControl(fieldInfo.FieldID, fieldInfo.DisplayName, fieldInfo.FilterControlRenderType, fieldInfo.FieldIdentifier, fieldInfo.FilterDefaultValueList, true, fieldInfo.FilterControlDataType, savedFilterData);
            }
        }

        if (fieldInfo.DataRenderType == jQuery.DynamicGridNamespace.DataRenderType.Image)
            jQuery.DynamicGridNamespace.ImageFieldIDList.push(fieldInfo.FieldID);

        if (fieldInfo.UserViewDisplayOrder > 0)
            userViewFieldExists = true;
    });

    if (jQuery.DynamicGridNamespace.SelectedUserViewID > 0) {
        if (userViewFieldExists) {
            dynamicGridViewModel.DisplayFieldList.sort(function (left, right) {
                return left.UserViewDisplayOrder == right.UserViewDisplayOrder ? 0 : (left.UserViewDisplayOrder < right.UserViewDisplayOrder ? -1 : 1)
            });
        }        
    }

    dynamicGridViewModel.TableHeaderFieldList.sort(function (left, right) {
        return left.DisplayOrder == right.DisplayOrder ? 0 : (left.DisplayOrder < right.DisplayOrder ? -1 : 1)
    });

    dynamicGridViewModel.DisplayFieldList.sort(function (left, right) {
        return left.UserViewDisplayOrder == right.UserViewDisplayOrder ? 0 : (left.UserViewDisplayOrder < right.UserViewDisplayOrder ? -1 : 1)
    });
    
    if (typeof BindFieldIDVariables != "undefined" && jQuery.isFunction(BindFieldIDVariables))
        BindFieldIDVariables();    

    ApplyDisplayAndGroupColumnSelection(true, true, false, undefined);

    setBoxHeight();
}

//Content
function LoadDynamicGridContent(pagerData) {

    if (jQuery.DynamicGridNamespace.IsSearchClicked == false) {
        jQuery.DynamicGridNamespace.IsSearchClicked = true;
        jQuery.DynamicGridNamespace.ContentLoadIsInProgress = true;
        jQuery.DynamicGridNamespace.PagerData = pagerData;

        var enablePaging = true;
        if (dynamicGridViewModel.PageDisplayMode == 'calendar' || dynamicGridViewModel.PageDisplayMode == 'tablewithautoload') {
            enablePaging = false;
        }
        else {
            jQuery("#divDynamicGridPager").empty();
            dynamicGridViewModel.TableBodyContent.removeAll();
        }

        var gridContentFilter = {};
        if (dynamicGridViewModel.PageDisplayMode != "table" || pagerData.PageIndex == 0)
            gridContentFilter.PageIndex = pagerData.PageIndex + 1;
        else
            gridContentFilter.PageIndex = pagerData.PageIndex;

        gridContentFilter.PageSize = pagerData.PageSize;

        gridContentFilter.GridFilteredFieldInfoValueList = [];
        var isValid = true;
        if (gridContentFilter.PageIndex == 1) {
            if (jQuery.DynamicGridNamespace.IsSearch == true) {
                var searchValueInfo = GetFilterValues(false);
                isValid = searchValueInfo.IsValid;
                if (isValid == true)
                    gridContentFilter.GridFilteredFieldInfoValueList = searchValueInfo.FilterFieldValueList;
            }

            if (typeof GetCustomFilters != "undefined" && jQuery.isFunction(GetCustomFilters))
                GetCustomFilters(gridContentFilter);

            if (typeof SearchDynamicFilters != "undefined" && jQuery.isFunction(SearchDynamicFilters)) {
                var searchFilter = isValid ? gridContentFilter.GridFilteredFieldInfoValueList : undefined;

                setTimeout(function () { SearchDynamicFilters(searchFilter); }, 500);
            }

            if (isValid == false) {
                jQuery.DynamicGridNamespace.IsSearchClicked = false;
                if (typeof DynamicGridNoRecords != "undefined" && jQuery.isFunction(DynamicGridNoRecords))
                    DynamicGridNoRecords();
                return false;
            }

            jQuery.DynamicGridNamespace.FilterFieldValueInfoList = gridContentFilter.GridFilteredFieldInfoValueList;
        }
        else {
            gridContentFilter.GridFilteredFieldInfoValueList = jQuery.DynamicGridNamespace.FilterFieldValueInfoList;
        }

        gridContentFilter.GroupedFirstFieldID = 0;
        gridContentFilter.GroupedSecondFieldID = 0;
        var groupedItemIndex = 0;
        jQuery.each(jQuery.DynamicGridNamespace.GroupedFieldValueInfo, function (property, propertyValue) {
            if (groupedItemIndex == 0) {
                gridContentFilter.GroupedFirstFieldID = property;
            }
            else if (groupedItemIndex == 1) {
                gridContentFilter.GroupedSecondFieldID = property;
                return false;
            }
            groupedItemIndex++;
        });

        if (jQuery.DynamicGridNamespace.FieldSelectionChanged == true) {
            jQuery.DynamicGridNamespace.FieldSelectionChanged = false;
            ChangeTableHeaderFields();
        }

        var groupFieldID = 0;
        var hasGroupSortField = false;
        gridContentFilter.GridSelectedFieldInfoList = [];

        if (Object.keys(jQuery.DynamicGridNamespace.GroupedFieldValueInfo).length == 1) {
            groupFieldID = Object.keys(jQuery.DynamicGridNamespace.GroupedFieldValueInfo)[0];

            if (jQuery.DynamicGridNamespace.GroupFieldProperties[groupFieldID].DefaultGroupSortingFieldID > 0) {
                hasGroupSortField = true;
                var groupSortFieldInfo = {};
                groupSortFieldInfo.FieldID = jQuery.DynamicGridNamespace.GroupFieldProperties[groupFieldID].DefaultGroupSortingFieldID;
                groupSortFieldInfo.SortType = jQuery.DynamicGridNamespace.SortType.Ascending;
                gridContentFilter.GridSelectedFieldInfoList.push(groupSortFieldInfo);
            }

            if (jQuery.DynamicGridNamespace.GroupFieldProperties[groupFieldID].GroupSortingExcludeFilterFieldID > 0) {
                var disableGrouping = false;
                jQuery.each(gridContentFilter.GridFilteredFieldInfoValueList, function (index, item) {
                    if (item.FieldID != groupFieldID && item.FieldID != jQuery.DynamicGridNamespace.GroupFieldProperties[groupFieldID].GroupSortingExcludeFilterFieldID) {
                        disableGrouping = true;
                        return;
                    }
                });

                if (disableGrouping)
                    jQuery("#tbDynamicGrid").sortable({ disabled: true });
                else
                    jQuery("#tbDynamicGrid").sortable({ disabled: false });
            }
        }

        ko.utils.arrayForEach(dynamicGridViewModel.TableHeaderFieldList(), function (headerFieldInfo) {
            if ((headerFieldInfo.FieldSelectionType == jQuery.DynamicGridNamespace.FieldSelectionType.Mandatory && headerFieldInfo.SortType != jQuery.DynamicGridNamespace.SortType.None)
                || jQuery.inArray(headerFieldInfo.FieldID, jQuery.DynamicGridNamespace.SelectedFieldIDList) > -1) {
                var selectedFieldInfo = {};
                selectedFieldInfo.FieldID = headerFieldInfo.FieldID;
                if (hasGroupSortField)
                    selectedFieldInfo.SortType = jQuery.DynamicGridNamespace.SortType.None;
                else
                    selectedFieldInfo.SortType = headerFieldInfo.SortType;

                if (hasGroupSortField == false || selectedFieldInfo.FieldID != groupFieldID)
                    gridContentFilter.GridSelectedFieldInfoList.push(selectedFieldInfo);
            }
        });

        //fitting the height of the table based on the browser height,minimum is always 500px
        
        jQuery(".table-responsive").removeClass("scroll");       
       
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");
        var iFrameDetection = (window === window.parent) ? false : true;
        var totPageHeight;
        var tblBodyStartPos;
        if (iFrameDetection) { //if grid loading under iframe then reducing teh size of 
            totPageHeight = jQuery(parent.window).height();
            var tblBodyStartPos = $("#tbDynamicGrid").offset().top + 150;
            if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
                totPageHeight = jQuery(parent.window).height();
                var tblOffsetEle = jQuery("#tblDynamicGrid").offset().top + 200;
                tblBodyStartPos = tblOffsetEle;              
            }
        }

        else {
            totPageHeight = jQuery(window).height();
            tblBodyStartPos = jQuery("#tblDynamicGrid").offset().top + 100;
            if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
                totPageHeight = jQuery(window).height();
                var tblOffsetEle = jQuery("#tblDynamicGrid").offset().top;
                    tblBodyStartPos = tblOffsetEle;
                
            }

        }
        tblMaxHeight = totPageHeight - tblBodyStartPos - 82;  //82 is for header and footer
        if (jQuery(window).width() < 768)
            tblMaxHeight = 500;
        jQuery("#tbDynamicGrid").css("max-height", tblMaxHeight);
        //grid size for pages with pager.
        if (pagerData.PageIndex == 0) {
            if (enablePaging && Math.floor(tblMaxHeight / 38) > 2) {
                gridContentFilter.PageSize = Math.floor(tblMaxHeight / 38);
                pagerData.pageSize = Math.floor(tblMaxHeight / 38);
            }
            jQuery.DynamicGridNamespace.PageSizeSet = true;
        }
        

        tScrollWidth = 0;
        diff = 0;
        var gridfilter = {};
        gridfilter.SiteID = pagerData.SiteID;
        gridfilter.UserID = pagerData.UserID;
        gridfilter.FeatureID = jQuery.DynamicGridNamespace.FeatureID;
        gridfilter.PlineID = jQuery.DynamicGridNamespace.SelectedProductionLineID;
        gridfilter.FeatureAdditionalInfo = jQuery.DynamicGridNamespace.FeatureAdditionalInfo;

        jQuery.ajax({
            type: "POST",
            url: jQuery.DynamicGridNamespace.WebServiceNameWithPath + "/GetDynamicGridContent",
            data: JSON.stringify({ gridfilter: gridfilter, gridContentFilter: gridContentFilter, pagerData: pagerData, enablePaging: enablePaging }),
            contentType: "application/json; charset=utf-8",
            datatype: 'json',
            success: function (json) {
                if (json != undefined && json.d != undefined && jQuery.DynamicGridNamespace.ContentLoadIsTriggered == false) { //jQuery.DynamicGridNamespace.ContentLoadIsTriggered  - if true means another content load is triggered, so no need to consider this load.
                    if (gridContentFilter.PageIndex == 1 || enablePaging)
                        dynamicGridViewModel.TableBodyContent.removeAll();

                    if (gridContentFilter.PageIndex == 1) {
                        jQuery("#tbDynamicGrid tr[norecordsfoundrow]").remove();
                        if (json.d.GridRowList.length == 0)
                            jQuery("#tbDynamicGrid").append("<tr norecordsfoundrow='true'><td class='center-align' style='background:white;' colspan='" + dynamicGridViewModel.TableHeaderFieldList().length + "'>" + DynamicGridLanguageResource.resMsg_NoRecordsFound + "</td></tr>");
                    }

                    if (json.d.GridRowList.length > 0) {
                        var groupCollapsableIconHtml = "<i class='fa fa-minus-circle blue tiny-leftmargin cursor-pointer tiny-rightmargin' style='font-size:22px;' onclick='javascript:CollapsableGroup(this)'/>";
                        if (Object.keys(jQuery.DynamicGridNamespace.GroupedFieldValueInfo).length > 0 && !jQuery.DynamicGridNamespace.ShowGroupRowsByDefault)
                            groupCollapsableIconHtml = "<i class='fa fa-plus-circle blue tiny-leftmargin cursor-pointer tiny-rightmargin' style='font-size:22px;' onclick='javascript:CollapsableGroup(this)'/>";

                        var groupSelectionHtml = '';
                        if (Object.keys(jQuery.DynamicGridNamespace.GroupedFieldValueInfo).length == 1) {
                            var groupFieldID = Object.keys(jQuery.DynamicGridNamespace.GroupedFieldValueInfo)[0];
                            if (jQuery.DynamicGridNamespace.GroupFieldProperties[groupFieldID].EnableGroupSelection == true)
                                groupSelectionHtml = "<input type='checkbox' class='tiny-rightmargin cursor-pointer' groupselection='true'>";
                        }

                        var groupSortingEnabled = false; var curretGroupHasSorting = true;
                        if (jQuery("#tbDynamicGrid").hasClass("ui-sortable") && !jQuery("#tbDynamicGrid").hasClass("ui-sortable-disabled"))
                            groupSortingEnabled = true;

                        var rowIndex = 1;
                        ko.utils.arrayForEach(json.d.GridRowList, function (rowValue) {
                            var rowInfo = {};
                            rowInfo.IsGroupRow = rowValue.IsGroupRow;
                            var currentGroupValueInfo = {};

                            ko.utils.arrayForEach(rowValue.FieldValueList, function (fieldValueInfo, fieldIndex) {
                                var fieldValue = fieldValueInfo.FieldValue;
                                if (jQuery.inArray(fieldValueInfo.FieldID, jQuery.DynamicGridNamespace.ImageFieldIDList) > -1) {
                                    fieldValue = "<img src='" + dynamicGridViewModel.ImagePath() + "/" + fieldValueInfo.FieldValue + "'/>";
                                }

                                if (rowInfo.IsGroupRow == false) {
                                    rowInfo[fieldValueInfo.FieldID] = fieldValue;
                                }
                                else {
                                    currentGroupValueInfo[fieldValueInfo.FieldID] = fieldValue;

                                    var rowGroupSelectionHTML = groupSelectionHtml;
                                    if (fieldValue.length == 0) {
                                        fieldValue = "None";
                                        rowGroupSelectionHTML = '';
                                        curretGroupHasSorting = false;
                                    }

                                    if (fieldIndex == 0) {
                                        rowInfo[dynamicGridViewModel.TableHeaderFieldList()[0].FieldID] = groupCollapsableIconHtml + rowGroupSelectionHTML + jQuery.DynamicGridNamespace.GroupedFieldValueInfo[fieldValueInfo.FieldID].DisplayName + " - " + fieldValue;
                                        rowInfo.GroupFirstFieldValue = fieldValue;
                                    }
                                    else {
                                        rowInfo[dynamicGridViewModel.TableHeaderFieldList()[0].FieldID] += " , " + jQuery.DynamicGridNamespace.GroupedFieldValueInfo[fieldValueInfo.FieldID].DisplayName + " - " + fieldValue;
                                        rowInfo.GroupSecondFieldValue = fieldValue;
                                    }
                                }
                            });

                            if (rowInfo.IsGroupRow == true && rowValue.FieldValueList.length == 0) //Displaying 'None', If grouped column doesn't have value.
                            {
                                rowInfo[dynamicGridViewModel.TableHeaderFieldList()[0].FieldID] = groupCollapsableIconHtml + 'None';
                                curretGroupHasSorting = false;
                            }

                            if (rowInfo.IsGroupRow == false && dynamicGridViewModel.PageDisplayMode == 'calendar')
                                rowInfo[0] = jQuery.DynamicGridNamespace.PagerData.PageIndex + rowIndex;

                            if (rowInfo.IsGroupRow == true)
                                rowInfo[dynamicGridViewModel.TableHeaderFieldList()[0].FieldID] += " [" + rowValue.GroupTotalRecords + "]";

                            if (groupSortingEnabled && curretGroupHasSorting)
                                rowInfo.GroupSortingEnabled = true;
                            else
                                rowInfo.GroupSortingEnabled = false;

                            if (rowInfo.IsGroupRow == false || dynamicGridViewModel.PageDisplayMode.toLowerCase() == 'table') {
                                if (rowInfo.IsGroupRow == true) {
                                    jQuery.DynamicGridNamespace.GroupID++;
                                    rowInfo.GroupID = jQuery.DynamicGridNamespace.GroupID;
                                }
                                else {
                                    rowInfo.GroupID = jQuery.DynamicGridNamespace.GroupID;
                                }
                                dynamicGridViewModel.TableBodyContent.push(rowInfo);
                                rowIndex++;
                            }
                            else {
                                var groupedFirstFieldPreviousValue = jQuery.DynamicGridNamespace.GroupedFieldValueInfo[gridContentFilter.GroupedFirstFieldID] == undefined ? '' : jQuery.DynamicGridNamespace.GroupedFieldValueInfo[gridContentFilter.GroupedFirstFieldID].PreviousValue;
                                var groupedSecondFieldPreviuosValue = jQuery.DynamicGridNamespace.GroupedFieldValueInfo[gridContentFilter.GroupedSecondFieldID] == undefined ? '' : jQuery.DynamicGridNamespace.GroupedFieldValueInfo[gridContentFilter.GroupedSecondFieldID].PreviousValue;
                                var groupedFirstFieldCurrentValue = currentGroupValueInfo[gridContentFilter.GroupedFirstFieldID];
                                var groupedSecondFieldCurrentValue = currentGroupValueInfo[gridContentFilter.GroupedSecondFieldID];

                                if (groupedFirstFieldCurrentValue == undefined) groupedFirstFieldCurrentValue = '';
                                if (groupedSecondFieldCurrentValue == undefined) groupedSecondFieldCurrentValue = '';
                                if (groupedFirstFieldPreviousValue == undefined) groupedFirstFieldPreviousValue = '';
                                if (groupedSecondFieldPreviuosValue == undefined) groupedSecondFieldPreviuosValue = '';

                                if ((groupedFirstFieldPreviousValue.toLowerCase() != groupedFirstFieldCurrentValue.toLowerCase() || groupedSecondFieldPreviuosValue.toLowerCase() != groupedSecondFieldCurrentValue.toLowerCase())
                                    || gridContentFilter.PageIndex == 1) {
                                    jQuery.DynamicGridNamespace.GroupID++;
                                    rowInfo.GroupID = jQuery.DynamicGridNamespace.GroupID;
                                    dynamicGridViewModel.TableBodyContent.push(rowInfo);
                                    jQuery.DynamicGridNamespace.GroupedFieldValueInfo[gridContentFilter.GroupedFirstFieldID].PreviousValue = groupedFirstFieldCurrentValue;
                                    if (gridContentFilter.GroupedSecondFieldID > 0)
                                        jQuery.DynamicGridNamespace.GroupedFieldValueInfo[gridContentFilter.GroupedSecondFieldID].PreviousValue = groupedSecondFieldCurrentValue;
                                }
                            }
                        });

                        jQuery.DynamicGridNamespace.TotalRecords = json.d.TotalRecords;
                        jQuery.DynamicGridNamespace.PagerData.PageIndex = json.d.LastRowIndex;

                        if (enablePaging == true)
                            jQuery("#divDynamicGridPager").html(json.d.HTMLPager);

                        ApplyFilterToggle();
                        jQuery("[data-toggle=tooltip]").tooltip();
                        jQuery('.pover').popover({ trigger: "hover" });
                    }
                    else {
                        jQuery.DynamicGridNamespace.TotalRecords = 0;
                        jQuery.DynamicGridNamespace.PagerData.PageIndex = 0;
                    }

                    jQuery("#spnTotalRecords").html(jQuery.DynamicGridNamespace.TotalRecords);
                    if (enablePaging) {
                        var tblScrollWidth = jQuery(".table-responsive").get(0).scrollWidth;
                        var tblInnerWidth = jQuery(".table-responsive").innerWidth();
                        if (tblScrollWidth > (tblInnerWidth + 10))
                            jQuery("#divDynamicGridPager").removeClass("text-md-center");
                        else
                            jQuery("#divDynamicGridPager").addClass("text-md-center");
                    }
                }
            },
            beforeSend: function () {
                if (gridContentFilter.PageIndex == 1) {
                    jQuery("#divDynamicGridProgress").removeClass("hide");
                    jQuery("#tbDynamicGrid").css("height", "");
                    if (!enablePaging) {
                        jQuery('#progressbar').removeClass("hide");
                        jQuery('#progressbar').progressbar('setPosition', 0);
                    }
                }
                if (gridContentFilter.PageIndex == 1 || enablePaging) {
                    jQuery(".float-scroll-div").css("height", "");
                    jQuery(".float-scroll").css("height", "");
                }
            },
            complete: function () {
                if (!enablePaging) {
                    LoadComplete();
                    if (typeof GetLoadComplete != "undefined" && jQuery.isFunction(GetLoadComplete))
                        GetLoadComplete();
                }

                if (gridContentFilter.PageIndex == 1)
                    jQuery("#divDynamicGridProgress").addClass("hide");

                if (enablePaging || (!enablePaging && jQuery.DynamicGridNamespace.PagerData.PageIndex >= jQuery.DynamicGridNamespace.TotalRecords)) {
                    if ((Object.keys(jQuery.DynamicGridNamespace.GroupedFieldValueInfo).length == 0 || (Object.keys(jQuery.DynamicGridNamespace.GroupedFieldValueInfo).length > 0 && jQuery.DynamicGridNamespace.ShowGroupRowsByDefault === true)) && dynamicGridViewModel.TableBodyContent().length > 0)
                        TableFirstColumnFixedScroll();
                }

                if (typeof DynamicGridNoRecords != "undefined" && jQuery.isFunction(DynamicGridNoRecords) && jQuery.DynamicGridNamespace.TotalRecords == 0)
                    DynamicGridNoRecords();
                jQuery.DynamicGridNamespace.IsSearchClicked = false;
            },
            error: function (request, error) {
                StopAutoLoad();
                ErrorMessageDialog(request, DynamicGridLanguageResource.resMsg_Error + DynamicGridLanguageResource.resMsg_FailedToLoadData);
            }
        });
    }
}

function GetFilterValues(isExcelDownload) {
    var errorMessage = "";
    var returnParameterInfo = {};
    returnParameterInfo.IsValid = true;
    returnParameterInfo.FilterFieldValueList = [];
    jQuery("#spnDynamicGridSearchError").html('');

    jQuery("#divDynamicFilterControls div[dynamicfilter]").each(function () {
        var filterType = jQuery(this).attr("filtertype");
        if (jQuery(this).find("input[type='text']").length > 0 || jQuery(this).find("select").length > 0 || jQuery(this).find("ul").length > 0) {

            var filterValue1 = "";
            var filterValue2 = "";
            var filterValueList = [];
            if (filterType == "daterange" || filterType == 'range') {
                if (jQuery(this).find("input[type='text'][controltype='startvalue']").length > 0 && jQuery(this).find("input[type='text'][controltype='endvalue']").length > 0) {
                    filterValue1 = jQuery.trim(jQuery(this).find("input[type='text'][controltype='startvalue']")[0].value);
                    filterValue2 = jQuery.trim(jQuery(this).find("input[type='text'][controltype='endvalue']")[0].value);
                }
            }
            else if (filterType == "custom") {
                if (jQuery(this).find("select").length > 0) {
                    filterValue1 = jQuery.trim(jQuery(this).find("select")[0].value);
                    if (filterValue1 == "0") filterValue1 = "";
                }
            }
            else if (filterType == "custommultiselect" || filterType == "enumtypemultiselect") {

                jQuery(this).find(".text-success").each(function () {
                    var filterValue = jQuery(this).closest("li").attr("filtervalue");
                    filterValueList.push(filterValue);
                });
            }
            else {
                if (jQuery(this).find("input[type='text']").length > 0) {
                    filterValue1 = jQuery.trim(jQuery(this).find("input[type='text']").val());
                }
            }

            if (filterValue1.length > 0 || filterValue2.length > 0 || filterValueList.length > 0) {
                var filterInfo = {};
                filterInfo.FieldID = jQuery(this).attr("fieldid");
                filterInfo.FilterValueList = [];
                var columnName = jQuery("#" + this.id + " label")[0].outerText;

                if (filterType == "daterange" || filterType == "range") {
                    if (filterValue1.length > 0 || filterValue2.length > 0) {
                        if (filterType == "daterange") {
                            var parsedStartDate = 0; var parsedEndDate = 0; var startDate = 0; var endDate = 0;
                            if (filterValue1.length > 0) {
                                parsedStartDate = jQuery.datepicker.parseDate(jQuery.DynamicGridNamespace.DatePickerDateFormat, filterValue1);
                                startDate = jQuery.datepicker.formatDate('yymmdd', parsedStartDate);
                            }
                            if (filterValue2.length > 0) {
                                parsedEndDate = jQuery.datepicker.parseDate(jQuery.DynamicGridNamespace.DatePickerDateFormat, filterValue2);
                                endDate = jQuery.datepicker.formatDate('yymmdd', parsedEndDate);
                            }

                            if (endDate == 0 || startDate <= endDate) {
                                filterValue1 = startDate == 0 ? '' : startDate;
                                filterValue2 = endDate == 0 ? '' : endDate;
                            }
                            else {
                                returnParameterInfo.IsValid = false;
                                errorMessage += DynamicGridLanguageResource.resMsg_EndDateIsLesserThanStartDate + columnName + " <br/>";
                            }
                        }

                        filterInfo.FilterValueList.push(filterValue1);
                        filterInfo.FilterValueList.push(filterValue2);
                    }
                }
                else if (filterType == "custommultiselect" || filterType == "enumtypemultiselect")
                    filterInfo.FilterValueList = filterValueList;
                else {
                    filterInfo.FilterValueList.push(filterValue1);
                }

                if (filterInfo.FilterValueList.length > 0) {
                    returnParameterInfo.FilterFieldValueList.push(filterInfo);
                }
            }
        }
    });

    if (returnParameterInfo.IsValid == false) {
        if (isExcelDownload)
            ErrorMessageDialog(null, errorMessage);
        else
            jQuery("#spnDynamicGridSearchError").html(errorMessage);
    }
    else {
        if (returnParameterInfo.FilterFieldValueList.length == 0) {
            returnParameterInfo.IsValid = false;
            if (isExcelDownload)
                ErrorMessageDialog(null, DynamicGridLanguageResource.resMsg_PleaseDefineSearchCriteria);
            else
                jQuery("#spnDynamicGridSearchError").html(DynamicGridLanguageResource.resMsg_PleaseDefineSearchCriteria);
        }
    }

    if (!isExcelDownload && returnParameterInfo.IsValid == false) {
        jQuery("#divDynamicGridProgress").addClass("hide");
        jQuery('#progressbar').addClass("hide");
        StopAutoLoad();
        if (jQuery("#tbDynamicGrid tr[norecordsfoundrow]").length == 0) {
            jQuery("#tbDynamicGrid").append("<tr norecordsfoundrow='true'><td class='center-align' style='background:white; width:1%;' colspan='" + dynamicGridViewModel.TableHeaderFieldList().length + "'>" + DynamicGridLanguageResource.resMsg_NoRecordsFound + "</td></tr>");
            jQuery("#floatScroll").remove();
            jQuery("#tbDynamicGrid").removeClass("tbodypositionfixed");
        }
    }
    else
        jQuery("#tbDynamicGrid").addClass("tbodypositionfixed");

    return returnParameterInfo;
}


//Change events
function ChangeTableHeaderFields() {
    ko.utils.arrayForEach(dynamicGridViewModel.DisplayFieldList(), function (displayFieldInfo) {
        var selectedFieldInfo = ko.utils.arrayFirst(dynamicGridViewModel.TableHeaderFieldList(), function (tableHeaderFieldInfo) {
            if (tableHeaderFieldInfo.FieldID == displayFieldInfo.FieldID)
                return tableHeaderFieldInfo;
        });

        var isGroupedColumn = false;
        if (jQuery.DynamicGridNamespace.GroupedFieldValueInfo[displayFieldInfo.FieldID] != undefined)
            isGroupedColumn = true;

        if (selectedFieldInfo == undefined && displayFieldInfo.IsSelected() == true && isGroupedColumn == false) {
            var displayOrder = displayFieldInfo.DisplayOrder
            if (jQuery.DynamicGridNamespace.SelectedFieldIDList.indexOf(displayFieldInfo.FieldID) > -1)
                displayOrder = (jQuery.DynamicGridNamespace.SelectedFieldIDList.indexOf(displayFieldInfo.FieldID) + 100);

            var tableHeaderFieldInfo = {};
            tableHeaderFieldInfo.FieldID = displayFieldInfo.FieldID;
            tableHeaderFieldInfo.DisplayName = displayFieldInfo.DisplayName;
            tableHeaderFieldInfo.DisplayOrder = displayOrder;
            tableHeaderFieldInfo.SortType = jQuery.DynamicGridNamespace.SortType.None;
            tableHeaderFieldInfo.EnableSorting = displayFieldInfo.EnableSorting;
            tableHeaderFieldInfo.HasCustomAttribute = displayFieldInfo.HasCustomAttribute;
            tableHeaderFieldInfo.HasCustomDataBind = displayFieldInfo.HasCustomDataBind;
            tableHeaderFieldInfo.FieldIdentifier = displayFieldInfo.FieldIdentifier;
            dynamicGridViewModel.TableHeaderFieldList.push(tableHeaderFieldInfo);
        }
        else if ((selectedFieldInfo != undefined && displayFieldInfo.IsSelected() == false) || isGroupedColumn == true) {
            dynamicGridViewModel.TableHeaderFieldList.remove(function (unSelectedFieldInfo) {
                return unSelectedFieldInfo.FieldID == displayFieldInfo.FieldID;
            });
        }
        else if (selectedFieldInfo != undefined && jQuery.DynamicGridNamespace.SelectedFieldIDList.indexOf(displayFieldInfo.FieldID) > -1) {
            selectedFieldInfo.DisplayOrder = (jQuery.DynamicGridNamespace.SelectedFieldIDList.indexOf(displayFieldInfo.FieldID) + 100);
        }

    });

    dynamicGridViewModel.TableHeaderFieldList.sort(function (left, right) {
        return left.DisplayOrder == right.DisplayOrder ? 0 : (left.DisplayOrder < right.DisplayOrder ? -1 : 1)
    });
}

function ChangeFilterSelection(filterInfo) { 
    if (filterInfo.IsSelected() == false) {
        jQuery("#divDynamicFilterControls div[fieldid=" + filterInfo.FieldID + "]").remove();
        if (jQuery("#divDynamicFilterControls div[dynamicfilter=true]").length == 0) {
            jQuery("#btnDynamicGridSearch").addClass("hide");
            jQuery("#btnDynamicGridShowAll").addClass("hide");
            jQuery.DynamicGridNamespace.IsSearch = false;
        }
    }
    else {
        RenderFilterControl(filterInfo.FieldID, filterInfo.DisplayName, filterInfo.FilterControlRenderType, filterInfo.FieldIdentifier, filterInfo.FilterDefaultValueList, false, filterInfo.FilterControlDataType, undefined);
    }
}

function ChangeGroupBySelection(groupFieldInfo, userViewGroupByOrder) {
    if (userViewGroupByOrder > 0) {
        jQuery.DynamicGridNamespace.GroupSelectedFieldOrderList[userViewGroupByOrder - 1] = groupFieldInfo.FieldID;
    }
    else {
        if (jQuery.DynamicGridNamespace.GroupFieldSelectionChanged == true) {
            if (groupFieldInfo.IsSelected() == true) {
                if (jQuery.DynamicGridNamespace.GroupSelectedFieldOrderList.length == 2) {
                    var fieldIDToDeSelect = jQuery.DynamicGridNamespace.GroupSelectedFieldOrderList[0];
                    jQuery.DynamicGridNamespace.GroupSelectedFieldOrderList.splice(0, 1);

                    ko.utils.arrayFirst(dynamicGridViewModel.GroupFieldList(), function (selectedItem) {
                        if (selectedItem.FieldID == fieldIDToDeSelect) {
                            jQuery.DynamicGridNamespace.GroupFieldSelectionChanged = false;
                            selectedItem.IsSelected(false);
                            return selectedItem;
                        }
                    });
                }

                jQuery.DynamicGridNamespace.GroupSelectedFieldOrderList.push(groupFieldInfo.FieldID);
            }
            else {
                groupFieldInfo.FieldID;
                var deleteFieldIDIndex = jQuery.DynamicGridNamespace.GroupSelectedFieldOrderList.indexOf(groupFieldInfo.FieldID);
                jQuery.DynamicGridNamespace.GroupSelectedFieldOrderList.splice(deleteFieldIDIndex, 1);
            }
        }
        else {
            jQuery.DynamicGridNamespace.GroupFieldSelectionChanged = true;
        }
    }
}

function ApplyDisplayAndGroupColumnSelection(applyColumnSelection, applyGroupBySelection, loadContent, applyCtl) {
    if (applyCtl != undefined) {        
        jQuery(applyCtl).closest("div").removeClass("show");
    }

    if (applyGroupBySelection) {
        var groupFieldValueInfo = {};
        ko.utils.arrayForEach(jQuery.DynamicGridNamespace.GroupSelectedFieldOrderList, function (selectedGroupFieldID) {
            if (selectedGroupFieldID > 0) {
                ko.utils.arrayFirst(dynamicGridViewModel.GroupFieldList(), function (groupFieldInfo) {
                    if (groupFieldInfo.FieldID == selectedGroupFieldID) {
                        var grpFieldInfo = {};
                        grpFieldInfo.DisplayName = groupFieldInfo.DisplayName;
                        grpFieldInfo.FieldIdentifier = groupFieldInfo.FieldIdentifier;
                        grpFieldInfo.PreviousValue = null;
                        groupFieldValueInfo[groupFieldInfo.FieldID] = grpFieldInfo;
                        return;
                    }
                });
            }
        });

        jQuery.DynamicGridNamespace.GroupedFieldValueInfo = groupFieldValueInfo;

        var hasGroupSorting = false;
        if (Object.keys(jQuery.DynamicGridNamespace.GroupedFieldValueInfo).length == 1) {
            var groupFieldID = Object.keys(jQuery.DynamicGridNamespace.GroupedFieldValueInfo)[0];
            if (jQuery.DynamicGridNamespace.GroupFieldProperties[groupFieldID] != undefined && jQuery.DynamicGridNamespace.GroupFieldProperties[groupFieldID].EnableGroupSorting == true)
                hasGroupSorting = true;
        }

        if (hasGroupSorting || jQuery.DynamicGridNamespace.EnableRowSorting)
            EnableGroupSorting();
        else if (jQuery("#tbDynamicGrid").hasClass("ui-sortable"))
            jQuery("#tbDynamicGrid").sortable({ disabled: true });
    }

    if (applyColumnSelection) {
        jQuery.DynamicGridNamespace.SelectedFieldIDList = [];
        jQuery("#ulColumnOption li").each(function () {
            if (jQuery(this).find("i").hasClass("text-success")) {
                jQuery.DynamicGridNamespace.SelectedFieldIDList.push(parseInt(jQuery(this).attr("fieldid")));
            }
        });      
    }

    if (loadContent) {
        jQuery.DynamicGridNamespace.FieldSelectionChanged = true;
        ReLoadGridContent();
    }   
}

function RenderFilterControl(fieldID, fieldName, filterControlRenderType, customDataRenderType, filterDefaultValueList, isFixedFilter, filterControlDataType, savedFilterData) {
    var controlString = "";
    var startValueCtlID = "";
    var endValueCtlID = "";
    var txtFilterDefaultValue = '';
    var defaultValueList = [];
    var enableSearch = false;
    if (savedFilterData == undefined) {
        if (filterDefaultValueList == undefined || filterDefaultValueList == null) {
            defaultValueList = [];
        }
        else {
            jQuery.each(filterDefaultValueList, function (index, itemValue) {
                if (jQuery.trim(itemValue).length > 0);
                defaultValueList.push(jQuery.trim(itemValue).toLowerCase());
            });            
        }
    }
    else {
        if (savedFilterData[fieldID] != undefined) {
            jQuery.each(savedFilterData[fieldID], function (index, itemValue) {
                if (jQuery.trim(itemValue).length > 0);
                defaultValueList.push(jQuery.trim(itemValue).toLowerCase());
            });
        }
    }

    if (defaultValueList.length > 0)
        txtFilterDefaultValue = defaultValueList[0];

    var checkInteger = '';
    var textMaxLength = 30;
    if (filterControlDataType == jQuery.DynamicGridNamespace.FilterControlDataType.Number && filterControlRenderType != jQuery.DynamicGridNamespace.FilterControlRenderType.DateRange) {
        checkInteger = "onkeypress='return isNumberKey(event);'";
        textMaxLength = 10;
    }
    else if (filterControlDataType == jQuery.DynamicGridNamespace.FilterControlDataType.Decimal) {
        checkInteger = "onkeypress='ValidateDecimalInput(this, event, 13, 3);'";
        textMaxLength = 10;
    }

    if (filterControlRenderType == jQuery.DynamicGridNamespace.FilterControlRenderType.Text) {
        controlString = "<div id='div_" + fieldID + "' fieldid=" + fieldID + " dynamicfilter='true' filtertype='text' class='col-xs-12 col-lg-2 p-l-0'> <label class='form-control-label col-xs-12 p-y-0'>" + fieldName + "</label>" +
            "<input type='text' id='txt_" + fieldID + "' maxlength=" + textMaxLength + " class='form-control-sm col-xs-12 font-small' value='" + txtFilterDefaultValue + "' " + checkInteger + " /></div > ";

        if (txtFilterDefaultValue.length > 0) enableSearch = true;
    }
    else if (filterControlRenderType == jQuery.DynamicGridNamespace.FilterControlRenderType.DateRange || filterControlRenderType == jQuery.DynamicGridNamespace.FilterControlRenderType.Range) {
        var filterType = 'daterange';
        startValueCtlID = 'txtstartvaluectl_' + fieldID;
        endValueCtlID = 'txtendvaluectl_' + fieldID;      
        var rangeStartValue = '';
        var rangeEndValue = '';
        if (filterControlRenderType == jQuery.DynamicGridNamespace.FilterControlRenderType.Range)
            filterType = 'range';

        if (savedFilterData == undefined) {
        if (filterControlRenderType == jQuery.DynamicGridNamespace.FilterControlRenderType.DateRange && (txtFilterDefaultValue == "currentdate" || txtFilterDefaultValue == "currentmonth"
            || txtFilterDefaultValue == "lasttwomonths" || txtFilterDefaultValue == "lastthreemonths" || txtFilterDefaultValue=="prevnext30days"||txtFilterDefaultValue=="next30days")) {
            var currentDateTimeInfo = new Date();
            rangeEndValue = jQuery.datepicker.formatDate(jQuery.DynamicGridNamespace.DatePickerDateFormat, currentDateTimeInfo);
            if (txtFilterDefaultValue == "currentdate") {
                rangeStartValue = rangeEndValue;
            }
            else if (txtFilterDefaultValue == "lasttwomonths") {
                currentDateTimeInfo.setMonth(currentDateTimeInfo.getMonth() - 2);
                rangeStartValue = jQuery.datepicker.formatDate(jQuery.DynamicGridNamespace.DatePickerDateFormat, currentDateTimeInfo);
            }
            else if (txtFilterDefaultValue == "lastthreemonths") {
                currentDateTimeInfo.setMonth(currentDateTimeInfo.getMonth() - 3);
                rangeStartValue = jQuery.datepicker.formatDate(jQuery.DynamicGridNamespace.DatePickerDateFormat, currentDateTimeInfo);
            }
            else if (txtFilterDefaultValue == "currentmonth") {
                var monthStartDateTimeInfo = new Date(currentDateTimeInfo.getFullYear(), currentDateTimeInfo.getMonth(), 1);
                rangeStartValue = jQuery.datepicker.formatDate(jQuery.DynamicGridNamespace.DatePickerDateFormat, monthStartDateTimeInfo);
            }
            else if (txtFilterDefaultValue == "prevnext30days") {
                var filterStartDate = new Date();
                var filterEndDate = new Date();
                filterStartDate.setDate(currentDateTimeInfo.getDate() - 30);
                filterEndDate.setDate(currentDateTimeInfo.getDate() + 30);
                rangeStartValue = jQuery.datepicker.formatDate(jQuery.DynamicGridNamespace.DatePickerDateFormat, filterStartDate);
                rangeEndValue = jQuery.datepicker.formatDate(jQuery.DynamicGridNamespace.DatePickerDateFormat, filterEndDate);
            }
            else if (txtFilterDefaultValue == "next30days") {
                var filterEndDate = new Date();
                filterEndDate.setDate(currentDateTimeInfo.getDate() + 30);
                rangeStartValue = jQuery.datepicker.formatDate(jQuery.DynamicGridNamespace.DatePickerDateFormat, currentDateTimeInfo);
                rangeEndValue = jQuery.datepicker.formatDate(jQuery.DynamicGridNamespace.DatePickerDateFormat, filterEndDate);
            }
            enableSearch = true;
            }
        }
        else {
            var savedFieldValue = savedFilterData[fieldID];
            if (savedFieldValue != undefined && Array.isArray(savedFieldValue) && savedFieldValue.length > 0) {
                rangeStartValue = GetFormatedStringFromNumber(savedFieldValue[0]);
                if (savedFieldValue.length > 1)
                    rangeEndValue = GetFormatedStringFromNumber(savedFieldValue[1]);

                enableSearch = true;
            }
        }

        controlString = "<div id='div_" + fieldID + "' fieldid=" + fieldID + " dynamicfilter='true' filtertype=" + filterType + " class='col-xs-12 col-lg-2 p-l-0'><label class='form-control-label col-xs-12 p-y-0'>" + fieldName + "</label>" +
            "<input type='text' id=" + startValueCtlID + " maxlength=" + textMaxLength + " controltype='startvalue' class='form-control-sm col-xs-12 col-lg-5 no-rightborder-radius font-small tiny-rightmargin' " + checkInteger + " value='" + rangeStartValue + "' />" +
            "<input type='text' id=" + endValueCtlID + " maxlength=" + textMaxLength + " controltype='endvalue' class='form-control-sm col-xs-12 col-lg-5 no-leftborder-radius font-small' " + checkInteger + " value='" + rangeEndValue + "' /></div > ";
    }
    else if (filterControlRenderType == jQuery.DynamicGridNamespace.FilterControlRenderType.Custom || filterControlRenderType == jQuery.DynamicGridNamespace.FilterControlRenderType.EnumType) {
        var filterType = "custom";
        controlString = "<div id='div_" + fieldID + "' fieldid=" + fieldID + " dynamicfilter='true' filtertype=" + filterType + " class='col-xs-12 col-lg-2 p-l-0'><label class='form-control-label col-xs-12 p-y-0'>" + fieldName + "</label>" +
            "<select id='drp_" + fieldID + "' class='form-control-sm col-xs-12'><option value='0'>" + DynamicGridLanguageResource.resMsg_Select + "</option>";

        var enumTypeItemList = [];
        if (filterControlRenderType != jQuery.DynamicGridNamespace.FilterControlRenderType.EnumType && typeof GetCustomFilterValues != "undefined" && jQuery.isFunction(GetCustomFilterValues))
            enumTypeItemList = GetCustomFilterValues(customDataRenderType);

        if (enumTypeItemList.length == 0)//Some of the existing custom filter values are coming from DynamicGrid DLL, so getting from backend if value is not there.
            enumTypeItemList = GetFilterControlValues(customDataRenderType, filterControlRenderType);

        jQuery.each(enumTypeItemList, function (index, memberInfo) {
            if (jQuery.inArray(memberInfo.TypeValue.toLowerCase(), defaultValueList) > -1) {
                controlString += "<option value='" + memberInfo.TypeValue + "' selected>" + memberInfo.DisplayName + "</option>";
                enableSearch = true;
            }
            else {
                controlString += "<option value='" + memberInfo.TypeValue + "'>" + memberInfo.DisplayName + "</option>";
            }
        });

        controlString += "</select>";
    }
    else if (filterControlRenderType == jQuery.DynamicGridNamespace.FilterControlRenderType.CustomMultiSelect || filterControlRenderType == jQuery.DynamicGridNamespace.FilterControlRenderType.EnumTypeMultiSelect) {
        var filterType = "custommultiselect";

        controlString = "<div id='div_" + fieldID + "' fieldid=" + fieldID + " dynamicfilter='true' filtertype=" + filterType + " class='col-xs-12 col-lg-2 p-l-0'><fieldset class='relative col-xs-12 p-x-0 heading-gap-big' style='margin-bottom:8.85px;'><button class='btn btn-default btn-sm dropdown-toggle relative col-xs-12' type='button' data-toggle='dropdown'> " + fieldName + "</button>" +
            "<div class='absolute col-xs-12 p-x-0 dropdown-menu hide' style='z-index: 1020; overflow-y: auto; max-height: 200px; overflow-x: hidden;'>" +
            "<ul id='div_" + fieldID + "' class='p-a-0' style= 'list-style: none;'>";

        var enumTypeItemList = [];
        if (filterControlRenderType != jQuery.DynamicGridNamespace.FilterControlRenderType.EnumTypeMultiSelect && typeof GetCustomFilterValues != "undefined" && jQuery.isFunction(GetCustomFilterValues))
            enumTypeItemList = GetCustomFilterValues(customDataRenderType);

        if (enumTypeItemList.length == 0)//Some of the existing custom filter values are coming from DynamicGrid DLL, so getting from backend if value is not there.
            enumTypeItemList = GetFilterControlValues(customDataRenderType, filterControlRenderType);

        jQuery.each(enumTypeItemList, function (index, memberInfo) {            
            if (jQuery.inArray(memberInfo.TypeValue.toLowerCase(), defaultValueList) > -1) {
                controlString += "<li onclick='javascript:MultiSelectFilterSelect(this);' filtervalue='" + memberInfo.TypeValue + "'><label class='cursor-pointer'><label class='font-small push-down full-width'><span><i class='fa fa-check text-success tiny-rightmargin tiny-leftmargin font-big'></i></span><span>" + memberInfo.DisplayName + " </span></label></li>";

                if (isFixedFilter) enableSearch = true; 
            }
            else {
                controlString += "<li onclick='javascript:MultiSelectFilterSelect(this);' filtervalue='" + memberInfo.TypeValue + "'><label class='cursor-pointer'><label class='font-small push-down full-width'><span><i class='fa fa-check gray tiny-rightmargin tiny-leftmargin font-big'></i></span><span>" + memberInfo.DisplayName + " </span></label></li>";
            }
        });
    }

    if (controlString.length > 0) {
        jQuery("#divDynamicFilterControls").append(controlString);

        jQuery("#btnDynamicGridSearch").removeClass("hide");
        jQuery("#btnDynamicGridShowAll").removeClass("hide");
        if (isFixedFilter && enableSearch) 
            jQuery.DynamicGridNamespace.IsSearch = true; 

        if (filterControlRenderType == jQuery.DynamicGridNamespace.FilterControlRenderType.DateRange) {
            jQuery("#" + startValueCtlID).datepicker({});
            jQuery("#" + endValueCtlID).datepicker({});
            jQuery("#" + startValueCtlID).keydown(function () {
                return false;
            });
            jQuery("#" + endValueCtlID).keydown(function () {
                return false;
            });
        }
        
        if (filterControlRenderType == jQuery.DynamicGridNamespace.FilterControlRenderType.Custom || filterControlRenderType == jQuery.DynamicGridNamespace.FilterControlRenderType.CustomMultiSelect
            || filterControlRenderType == jQuery.DynamicGridNamespace.FilterControlRenderType.EnumType || filterControlRenderType == jQuery.DynamicGridNamespace.FilterControlRenderType.EnumTypeMultiSelect) {
            ApplyFilterToggle();
        }
        setBoxHeight();

        if (typeof SetCustomFilterValues != "undefined" && jQuery.isFunction(SetCustomFilterValues))
            SetCustomFilterValues(fieldID, fieldName);
    }
}

function GetFilterControlValues(customType, filterControlRenderType) {
    var enumMemberList = [];

    var typeValueFilter = {};
    typeValueFilter.RenderType = filterControlRenderType;
    typeValueFilter.TypeName = customType;

    var filter = {};
    filter.ObjectID = jQuery.DynamicGridNamespace.ObjectID;
    filter.SiteID = jQuery.DynamicGridNamespace.PagerData.SiteID;
    filter.UserID = jQuery.DynamicGridNamespace.PagerData.UserID;
    filter.PlineID = jQuery.DynamicGridNamespace.SelectedProductionLineID;
    
    jQuery.ajax({
        type: "POST",
        url: jQuery.DynamicGridNamespace.WebServiceNameWithPath + "/GetFilterTypeValues",
        data: JSON.stringify({ filter: filter, typeValueFilter: typeValueFilter }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        async: false,
        success: function (json) {
            if (json != undefined && json.d != undefined) {
                enumMemberList = json.d;
            }
        },
        error: function (request, error) {
            ErrorMessageDialog(request, DynamicGridLanguageResource.resMsg_Error + DynamicGridLanguageResource.resMsg_FailedToLoadValuesOfType + enumTypeName);
        }
    });
    return enumMemberList;
}

function SortField(sortedFieldID, userViewSortType) {
    var thIconID = jQuery("#tblDynamicGrid i[thiconfieldid=" + sortedFieldID + "]")[0].id;
    if (userViewSortType != undefined) { 
        if (userViewSortType != jQuery.DynamicGridNamespace.SortType.None) {
            if (userViewSortType == jQuery.DynamicGridNamespace.SortType.Ascending) {
                jQuery("#" + thIconID).removeClass("fa-sort-down");
                jQuery("#" + thIconID).addClass("fa-sort-up");
            }
            else {
                jQuery("#" + thIconID).removeClass("fa-sort-up");
                jQuery("#" + thIconID).addClass("fa-sort-down");
            }

            ko.utils.arrayFirst(dynamicGridViewModel.TableHeaderFieldList(), function (item) {
                if (item.FieldID == sortedFieldID)
                    return item.SortType = userViewSortType;
            });
        }
    }
    else{        
        jQuery("#tblDynamicGrid i").each(function (index, item) { //Removing sorting from already sorted fields
            if (thIconID == 0 || this.id != thIconID) {
                if (jQuery("#" + this.id).hasClass("fa-sort-up") || jQuery("#" + this.id).hasClass("fa-sort-down")) {
                    var fieldID = jQuery(this).attr("thiconfieldid");
                    jQuery("#" + this.id).removeClass("fa-sort-up fa-sort-down");
                    ko.utils.arrayFirst(dynamicGridViewModel.TableHeaderFieldList(), function (item) {
                        if (item.FieldID == fieldID)
                            return item.SortType = jQuery.DynamicGridNamespace.SortType.None;
                    });
                }
            }
        });

        //Setting sort icon for clicked <i>
        var sortType = jQuery.DynamicGridNamespace.SortType.None;
        if (jQuery("#" + thIconID).hasClass("fa-sort-up")) {
            jQuery("#" + thIconID).removeClass("fa-sort-up");
            jQuery("#" + thIconID).addClass("fa-sort-down");
            sortType = jQuery.DynamicGridNamespace.SortType.Descending;
        }
        else if (jQuery("#" + thIconID).hasClass("fa-sort-down")) {
            jQuery("#" + thIconID).removeClass("fa-sort-down");
        }
        else {
            jQuery("#" + thIconID).addClass("fa-sort-up");
            sortType = jQuery.DynamicGridNamespace.SortType.Ascending;
        }

        ko.utils.arrayFirst(dynamicGridViewModel.TableHeaderFieldList(), function (item) {
            if (item.FieldID == sortedFieldID)
                return item.SortType = sortType;
        });

        jQuery.each(jQuery.DynamicGridNamespace.GroupedFieldValueInfo, function (property, value) {
            jQuery.DynamicGridNamespace.GroupedFieldValueInfo[property].PreviousValue = null;
        });

        ReLoadGridContent();        
    }
}

function ResetSorting() {
    jQuery("thead i").each(function (index, item) {
        if (jQuery("#" + this.id).hasClass("fa-sort-up") || jQuery("#" + this.id).hasClass("fa-sort-down")) {
            var fieldID = jQuery(this).attr("thiconfieldid");
            jQuery("#" + this.id).removeClass("fa-sort-up fa-sort-down");
            ko.utils.arrayFirst(dynamicGridViewModel.TableHeaderFieldList(), function (item) {
                if (item.FieldID == fieldID)
                    return item.SortType = jQuery.DynamicGridNamespace.SortType.None;
            });
        }
    });
}

//User View
function SaveUserView(updateSelectedView) {
    var viewID = 0;
    var viewName = jQuery.trim(jQuery("#txtUserViewName").val());
    if (!updateSelectedView) {
        jQuery("#spnSaveSaveGridViewMessage").html('');
        if (viewName.length == 0) {
            jQuery("#spnSaveSaveGridViewMessage").html(DynamicGridLanguageResource.resMsg_PleaseEnterViewName);
            return false;
        }
    }
    else {
        jQuery(".dropdown-menu").removeClass("show");
        viewID = jQuery.DynamicGridNamespace.SelectedUserViewID;
    }

    var selectedDisplayOrder = 0;
    var selectedFieldInfo = {};
    jQuery("#tblDynamicGrid th").each(function (thiInfo) { 
        var fieldID = parseInt(jQuery(this).attr("fieldid"));
        if (fieldID != undefined && fieldID > 0) {            
            var ascendingSort = jQuery(this).find("i").hasClass("fa-sort-up");
            var descendingSort = jQuery(this).find("i").hasClass("fa-sort-down");

            var sortType = jQuery.DynamicGridNamespace.SortType.None;
            if (ascendingSort) sortType = jQuery.DynamicGridNamespace.SortType.Ascending;
            else if (descendingSort) sortType = jQuery.DynamicGridNamespace.SortType.Descending;

            if (sortType != jQuery.DynamicGridNamespace.SortType.None || jQuery.DynamicGridNamespace.SelectedFieldIDList.indexOf(fieldID) > -1) {
                if (jQuery.DynamicGridNamespace.SelectedFieldIDList.indexOf(fieldID) > -1)
                    selectedDisplayOrder = (jQuery.DynamicGridNamespace.SelectedFieldIDList.indexOf(fieldID) + 1);

                selectedFieldInfo[fieldID] = { DisplayOrder: selectedDisplayOrder, SortType: sortType };
            }
        }
    });  

    var userViewInfo = {};
    userViewInfo.ViewID = viewID;
    userViewInfo.UserViewFieldInfoList = [];
    userViewInfo.ViewName = viewName;    
    if (jQuery("#iconShareableView").closest("div").is(":visible"))
        userViewInfo.IsSharedView = jQuery("#iconShareableView").hasClass("i-opacity") ? false : true;
    else
        userViewInfo.IsSharedView = false;

    ko.utils.arrayForEach(dynamicGridViewModel.GridFieldList(), function (gridFieldInfo) {
        var isFilterField = false;
        var displayOrder = 0;
        var groupByOrder = 0;
        var sortType = jQuery.DynamicGridNamespace.SortType.None;        

        var filterField = ko.utils.arrayFirst(dynamicGridViewModel.FilterFieldList(), function (filterFieldInfo) {
            if (filterFieldInfo.FieldID == gridFieldInfo.FieldID) {
                return filterFieldInfo;
            }
        });

        if (filterField != null)
            isFilterField = filterField.IsSelected();        

        if (selectedFieldInfo[gridFieldInfo.FieldID] != undefined) {
            var displayOrder = selectedFieldInfo[gridFieldInfo.FieldID].DisplayOrder;
            var sortType = selectedFieldInfo[gridFieldInfo.FieldID].SortType;
        }

        if (jQuery.DynamicGridNamespace.GroupedFieldValueInfo.hasOwnProperty(gridFieldInfo.FieldID)) {
            var groupColumnIndex = 0;
            jQuery.each(jQuery.DynamicGridNamespace.GroupedFieldValueInfo, function (property, propertyValue) {
                groupColumnIndex++;
                if (gridFieldInfo.FieldID == property) {
                    if (groupColumnIndex == 1) groupByOrder = 1;
                    else if (groupColumnIndex == 2) groupByOrder = 2;
                }
            });
        }

        if (isFilterField == true || displayOrder > 0 || groupByOrder > 0 || sortType != jQuery.DynamicGridNamespace.SortType.None) {
            var fieldInfo = {};
            fieldInfo.FieldID = gridFieldInfo.FieldID;
            fieldInfo.IsFilter = isFilterField;
            fieldInfo.DisplayOrder = displayOrder;
            fieldInfo.GroupByOrder = groupByOrder;
            fieldInfo.SortType = sortType;
            userViewInfo.UserViewFieldInfoList.push(fieldInfo);
        }
    });

    var gridfilter = {};
    gridfilter.SiteID = jQuery.DynamicGridNamespace.PagerData.SiteID;
    gridfilter.UserID = jQuery.DynamicGridNamespace.PagerData.UserID;
    gridfilter.ObjectID = jQuery.DynamicGridNamespace.ObjectID;

    jQuery.ajax({
        type: "POST",
        url: jQuery.DynamicGridNamespace.WebServiceNameWithPath + "/InserUserView",
        data: JSON.stringify({ filter: gridfilter, userViewInfo: userViewInfo }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        success: function (json) {
            if (json.d == 0) {
                jQuery("#spnSaveSaveGridViewMessage").addClass("red");
                jQuery("#spnSaveSaveGridViewMessage").html(DynamicGridLanguageResource.resMsg_ViewNameAlreadyExists);
            }
            else if (!updateSelectedView) {
                var savedViewInfo = {};
                savedViewInfo.ViewID = json.d;
                savedViewInfo.ViewName = userViewInfo.ViewName;
                savedViewInfo.CreatedBy = jQuery.DynamicGridNamespace.PagerData.UserID;
                dynamicGridViewModel.UserViewInfoList.push(savedViewInfo);
                dynamicGridViewModel.SelectedViewName(userViewInfo.ViewName);
                jQuery.DynamicGridNamespace.SelectedUserViewID = json.d;
                CloseSaveUserViewModel();
            }
        },
        beforeSend: function () {
            jQuery("#btnSaveUserView").attr("disabled", "disabled");
        },
        complete: function () {
            jQuery("#btnSaveUserView").removeAttr("disabled");
        },
        error: function (request, error) {
            if (request.responseText != "") {
                var errorMsg = jQuery.parseJSON(request.responseText);
                if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
                    jQuery("#spnSaveSaveGridViewMessage").html(errorMsg.Message);
                else
                    jQuery("#spnSaveSaveGridViewMessage").html(DynamicGridLanguageResource.resMsgFailedToSaveView);
            }
            else
                jQuery("#spnSaveSaveGridViewMessage").html(DynamicGridLanguageResource.resMsgFailedToSaveView);

        }
    });
}

function ChangeUserView(viewID) {
    if (jQuery.DynamicGridNamespace.SelectedUserViewID != viewID) {
        var filter = {};
        filter.UserID = jQuery.DynamicGridNamespace.PagerData.UserID;
        filter.SiteID = jQuery.DynamicGridNamespace.PagerData.SiteID;
        filter.UserViewID = viewID;
        filter.ObjectID = jQuery.DynamicGridNamespace.ObjectID;

        jQuery.ajax({
            type: "POST",
            url: jQuery.DynamicGridNamespace.WebServiceNameWithPath + "/GetUserViewFields",
            data: JSON.stringify({ filter: filter }),
            contentType: "application/json; charset=utf-8",
            datatype: 'json',
            success: function (json) {
                if (json != undefined && json.d != undefined) {
                    jQuery.DynamicGridNamespace.SelectedUserViewID = viewID;
                    if (json.d.length == 0)
                        UpdateUserViewInViewModel(viewID);
                    else
                        UpdateUserViewInViewModel(viewID, json.d);
                }
            },
            error: function (request, error) {
                ErrorMessageDialog(request, DynamicGridLanguageResource.resMsg_Error + DynamicGridLanguageResource.resMsgFailedToLoadView);
            }
        });
    }    
}

function UpdateUserViewInViewModel(viewID, userViewFieldInfoList) {  
    jQuery("#divDynamicGridProgress").removeClass("hide");           
    dynamicGridViewModel.TableBodyContent.removeAll();
    ResetSorting(); 

    var selectedViewInfo = ko.utils.arrayFirst(dynamicGridViewModel.UserViewInfoList(), function (userViewInfo) {
        if (viewID == userViewInfo.ViewID)
            return userViewInfo;
    });

    if (selectedViewInfo != null)
        dynamicGridViewModel.SelectedViewName(selectedViewInfo.ViewName);

    var userViewFieldInfo = {};
    if (userViewFieldInfoList != undefined) {
        ko.utils.arrayForEach(userViewFieldInfoList, function (userFieldInfo) {
            userViewFieldInfo[userFieldInfo.FieldID] = { DisplayOrder: userFieldInfo.DisplayOrder, IsFilter: userFieldInfo.IsFilter, GroupByOrder: userFieldInfo.GroupByOrder, SortType: userFieldInfo.SortType };
        });
    }
    
    ko.utils.arrayForEach(dynamicGridViewModel.FilterFieldList(), function (filterFieldInfo) {
        var isSelectedFilter = false;        
        if (!jQuery.isEmptyObject(userViewFieldInfo) && userViewFieldInfo[filterFieldInfo.FieldID] != undefined && userViewFieldInfo[filterFieldInfo.FieldID].IsFilter == true)
            isSelectedFilter = true;        
        filterFieldInfo.IsSelected(isSelectedFilter);
    });

    var displayFieldListTemp = [];
    ko.utils.arrayForEach(dynamicGridViewModel.GridFieldList(), function (fieldInfo) {
        var isDisplayField = (fieldInfo.FieldSelectionType != jQuery.DynamicGridNamespace.FieldSelectionType.SQLFilter && fieldInfo.FieldSelectionType != jQuery.DynamicGridNamespace.FieldSelectionType.None) ? true : false;
        var isMandatoryField = (fieldInfo.FieldSelectionType == jQuery.DynamicGridNamespace.FieldSelectionType.Mandatory || fieldInfo.FieldSelectionType == jQuery.DynamicGridNamespace.FieldSelectionType.Custom) ? true : false;

        if (isDisplayField) {                       
            var headerFieldInfo = ko.utils.arrayFirst(dynamicGridViewModel.TableHeaderFieldList(), function (tableHeaderFieldInfo) {
                if (tableHeaderFieldInfo.FieldID == fieldInfo.FieldID)
                    return tableHeaderFieldInfo;
            });

            var removeField = false;
            var addField = false;
            var displayOrder = 0;
            var isSelectedField = false;
            var sortType = jQuery.DynamicGridNamespace.SortType.None;

            if (!jQuery.isEmptyObject(userViewFieldInfo)) {//User View fields
                if (headerFieldInfo != null && ((userViewFieldInfo[fieldInfo.FieldID] == undefined && !isMandatoryField) || (userViewFieldInfo[fieldInfo.FieldID] != undefined && userViewFieldInfo[fieldInfo.FieldID].GroupByOrder > 0)))
                    removeField = true;
                else if (headerFieldInfo == null && userViewFieldInfo[fieldInfo.FieldID] != undefined && userViewFieldInfo[fieldInfo.FieldID].GroupByOrder == 0)
                    addField = true;

                if (userViewFieldInfo[fieldInfo.FieldID] != undefined && userViewFieldInfo[fieldInfo.FieldID].DisplayOrder > 0) {
                    displayOrder = (userViewFieldInfo[fieldInfo.FieldID].DisplayOrder + 100);
                    sortType = userViewFieldInfo[fieldInfo.FieldID].SortType;
                }
                else {
                    displayOrder = 1000;
                }
            }
            else {//Default view fields
                if (headerFieldInfo != null && fieldInfo.FieldSelectionType == jQuery.DynamicGridNamespace.FieldSelectionType.Optional)
                    removeField = true;
                if (headerFieldInfo == null && fieldInfo.FieldSelectionType == jQuery.DynamicGridNamespace.FieldSelectionType.OptionalDefaultViewDisplay)
                    addField = true;

                displayOrder = (fieldInfo.DisplayOrder + 100);
                if (fieldInfo.FieldSelectionType == jQuery.DynamicGridNamespace.FieldSelectionType.Optional)
                    displayOrder = 1000;
            }

            if (removeField) {
                dynamicGridViewModel.TableHeaderFieldList.remove(function (unSelectedFieldInfo) {
                    return unSelectedFieldInfo.FieldID == fieldInfo.FieldID;
                });
            }
            else if (addField) {
                isSelectedField = true;
                var tableHeaderFieldInfo = {};
                tableHeaderFieldInfo.FieldID = fieldInfo.FieldID;
                tableHeaderFieldInfo.DisplayName = fieldInfo.DisplayName;
                tableHeaderFieldInfo.DisplayOrder = displayOrder;
                tableHeaderFieldInfo.SortType = sortType;
                tableHeaderFieldInfo.EnableSorting = fieldInfo.EnableSorting;
                tableHeaderFieldInfo.HasCustomAttribute = fieldInfo.HasCustomAttribute;
                tableHeaderFieldInfo.HasCustomDataBind = fieldInfo.HasCustomDataBind;
                tableHeaderFieldInfo.FieldIdentifier = fieldInfo.FieldIdentifier;
                dynamicGridViewModel.TableHeaderFieldList.push(tableHeaderFieldInfo);
            }
            else if (headerFieldInfo != null) {
                isSelectedField = true;
                if (!isMandatoryField)
                    headerFieldInfo.DisplayOrder = displayOrder;
                headerFieldInfo.SortType = sortType;
            }

            ko.utils.arrayFirst(dynamicGridViewModel.DisplayFieldList(), function (displayFieldInfo) {
                if (displayFieldInfo.FieldID == fieldInfo.FieldID) {
                    var displayFieldTempInfo = {};
                    displayFieldTempInfo.FieldID = displayFieldInfo.FieldID;
                    displayFieldTempInfo.FieldIdentifier = displayFieldInfo.FieldIdentifier;
                    displayFieldTempInfo.DisplayName = displayFieldInfo.DisplayName;
                    displayFieldTempInfo.DisplayOrder = displayFieldInfo.DisplayOrder;
                    displayFieldTempInfo.EnableSorting = displayFieldInfo.EnableSorting;
                    displayFieldTempInfo.HasCustomAttribute = displayFieldInfo.HasCustomAttribute;
                    displayFieldTempInfo.HasCustomDataBind = displayFieldInfo.HasCustomDataBind;
                    displayFieldTempInfo.FieldSelectionType = displayFieldInfo.FieldSelectionType;
                    displayFieldTempInfo.SelectedClass = ko.observable("fa fa-check gray tiny-rightmargin tiny-leftmargin font-big");
                    displayFieldTempInfo.IsSelected = ko.observable(false);
                    displayFieldTempInfo.IsSelected.subscribe(function () {
                        if (displayFieldTempInfo.IsSelected() == true)
                            displayFieldTempInfo.SelectedClass("fa fa-check text-success tiny-rightmargin tiny-leftmargin font-big");
                        else
                            displayFieldTempInfo.SelectedClass("fa fa-check gray tiny-rightmargin tiny-leftmargin font-big");
                    });
                    displayFieldTempInfo.IsSelected(isSelectedField);
                    displayFieldTempInfo.UserViewDisplayOrder = displayOrder;
                    displayFieldListTemp.push(displayFieldTempInfo)
                    return displayFieldInfo;
                }
            });

            if (sortType != jQuery.DynamicGridNamespace.SortType.None)
                SortField(fieldInfo.FieldID, sortType);
        }
    });   

    jQuery.DynamicGridNamespace.GroupSelectedFieldOrderList = [];
    ko.utils.arrayForEach(dynamicGridViewModel.GroupFieldList(), function (groupFieldInfo) {
        var isSelectedGroupField = false;
        if (userViewFieldInfoList != undefined) {
            var userGroupFieldInfo = ko.utils.arrayFirst(userViewFieldInfoList, function (userGroupField) {
                if (userGroupField.FieldID == groupFieldInfo.FieldID) {
                    return userGroupField;
                }
            });

            if (userGroupFieldInfo != null && userGroupFieldInfo.GroupByOrder > 0)
                isSelectedGroupField = true;
        }
        groupFieldInfo.IsSelected(isSelectedGroupField);
    });

    dynamicGridViewModel.TableHeaderFieldList.sort(function (left, right) {
        return left.DisplayOrder == right.DisplayOrder ? 0 : (left.DisplayOrder < right.DisplayOrder ? -1 : 1)
    });  

    dynamicGridViewModel.DisplayFieldList.removeAll();//jQuery drag doesn't change viewmodel, so clearing and adding again
    ko.utils.arrayForEach(displayFieldListTemp, function (displayFieldInfo) {
        dynamicGridViewModel.DisplayFieldList.push(displayFieldInfo);
    });

    dynamicGridViewModel.DisplayFieldList.sort(function (left, right) {        
        return left.UserViewDisplayOrder == right.UserViewDisplayOrder ? 0 : (left.UserViewDisplayOrder < right.UserViewDisplayOrder ? -1 : 1);        
    });
    
    ApplyDisplayAndGroupColumnSelection(true, true, false, undefined);

    ReLoadGridContent();
}

function DeleteUserViewConfirm(viewID) {
    jQuery("#dynamicGridModelConfirmMessage").removeClass("red");
    jQuery("#dynamicGridModelConfirmMessage").html(DynamicGridLanguageResource.resMsg_AreYouSureYouWantToDeleteView);
    jQuery("#divDynamicGridMessageModel").dialog({
        buttons: [{
            text: DynamicGridLanguageResource.resMsg_Confirm,
            click: function () {
                jQuery("#divDynamicGridMessageModel").dialog("close");
                DeleteUserView(viewID);
            }
        },
            {
                text: DynamicGridLanguageResource.resMsg_Cancel,
                click: function () {
                    jQuery("#divDynamicGridMessageModel").dialog("close");
                }
            }
        ]
    });
}

function DeleteUserView(viewID) {
    var filter = {};
    filter.UserID = jQuery.DynamicGridNamespace.PagerData.UserID;
    filter.SiteID = jQuery.DynamicGridNamespace.PagerData.SiteID;
    filter.UserViewID = viewID;

    jQuery.ajax({
        type: "POST",
        url: jQuery.DynamicGridNamespace.WebServiceNameWithPath + "/DeleteUserView",
        data: JSON.stringify({ filter: filter }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        success: function (json) {
            if (json != undefined && json.d == true) {
                dynamicGridViewModel.UserViewInfoList.remove(function (userViewInfo) {
                    return userViewInfo.ViewID == viewID;
                });
                if (viewID == jQuery.DynamicGridNamespace.SelectedUserViewID) {
                    jQuery.DynamicGridNamespace.SelectedUserViewID = 0;
                    UpdateUserViewInViewModel(0);
                }
            }
        },
        error: function (request, error) {
            ErrorMessageDialog(request, DynamicGridLanguageResource.resMsg_Error + DynamicGridLanguageResource.resMsg_FailedToDeleteView);
        }
    });
}

function DynamicGridExcelDownload() {
    var gridContentFilter = {};
    gridContentFilter.PageIndex = 0;
    gridContentFilter.PageSize = 0;

    gridContentFilter.GridFilteredFieldInfoValueList = [];
    var isValid = true;
    if (jQuery.DynamicGridNamespace.IsSearch == true) {
        var searchValueInfo = GetFilterValues(true);
        isValid = searchValueInfo.IsValid;
        if (isValid == true)
            gridContentFilter.GridFilteredFieldInfoValueList = searchValueInfo.FilterFieldValueList;
    }

    if (isValid == false)
        return false;

    gridContentFilter.GroupedFirstFieldID = 0;
    gridContentFilter.GroupedSecondFieldID = 0;
    var groupedItemIndex = 0;
    jQuery.each(jQuery.DynamicGridNamespace.GroupedFieldValueInfo, function (property, propertyValue) {
        if (groupedItemIndex == 0) {
            gridContentFilter.GroupedFirstFieldID = property;
        }
        else if (groupedItemIndex == 1) {
            gridContentFilter.GroupedSecondFieldID = property;
            return false;
        }
        groupedItemIndex++;
    });

    var groupFieldID = 0;
    var hasGroupSortField = false;
    gridContentFilter.GridSelectedFieldInfoList = [];
    if (Object.keys(jQuery.DynamicGridNamespace.GroupedFieldValueInfo).length == 1) {
        groupFieldID = Object.keys(jQuery.DynamicGridNamespace.GroupedFieldValueInfo)[0];

        if (jQuery.DynamicGridNamespace.GroupFieldProperties[groupFieldID].DefaultGroupSortingFieldID > 0) {
            hasGroupSortField = true;
            var groupSortFieldInfo = {};
            groupSortFieldInfo.FieldID = jQuery.DynamicGridNamespace.GroupFieldProperties[groupFieldID].DefaultGroupSortingFieldID;
            groupSortFieldInfo.SortType = jQuery.DynamicGridNamespace.SortType.Ascending;
            gridContentFilter.GridSelectedFieldInfoList.push(groupSortFieldInfo);
        }
    }

    ko.utils.arrayForEach(dynamicGridViewModel.TableHeaderFieldList(), function (headerFieldInfo) {
        if ((headerFieldInfo.FieldSelectionType == jQuery.DynamicGridNamespace.FieldSelectionType.Mandatory && headerFieldInfo.SortType != jQuery.DynamicGridNamespace.SortType.None)
            || jQuery.inArray(headerFieldInfo.FieldID, jQuery.DynamicGridNamespace.SelectedFieldIDList) > -1) {
            var selectedFieldInfo = {};
            selectedFieldInfo.FieldID = headerFieldInfo.FieldID;
            if (hasGroupSortField)
                selectedFieldInfo.SortType = jQuery.DynamicGridNamespace.SortType.None;
            else
                selectedFieldInfo.SortType = headerFieldInfo.SortType;

            if (hasGroupSortField == false || selectedFieldInfo.FieldID != groupFieldID)
                gridContentFilter.GridSelectedFieldInfoList.push(selectedFieldInfo);
        }
    });

    if (typeof GetCustomFilters != "undefined" && jQuery.isFunction(GetCustomFilters))
        GetCustomFilters(gridContentFilter);

    gridContentFilter.SelectedFieldIDListOrder = jQuery.DynamicGridNamespace.SelectedFieldIDList;
    gridContentFilter.ExcelSheetName = jQuery.DynamicGridNamespace.ExcelSheetName;

    var gridfilter = {};
    gridfilter.SiteID = jQuery.DynamicGridNamespace.PagerData.SiteID;
    gridfilter.UserID = jQuery.DynamicGridNamespace.PagerData.UserID;
    gridfilter.FeatureID = jQuery.DynamicGridNamespace.FeatureID;
    gridfilter.PlineID = jQuery.DynamicGridNamespace.SelectedProductionLineID;
    gridfilter.FeatureAdditionalInfo = jQuery.DynamicGridNamespace.FeatureAdditionalInfo;

    jQuery.ajax({
        type: "POST",
        url: jQuery.DynamicGridNamespace.WebServiceNameWithPath + "/DynamicGridContentExcelDownload",
        data: JSON.stringify({ filter: gridfilter, contentFilter: gridContentFilter }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        success: function (json) {
            if (json != undefined && json.d != undefined) {
                DynamicGridTimerMethodForDownload(json.d);
            }
        },
        beforeSend: function () {            
            jQuery("#btnDynamicGridExcelDownload").addClass("hide");
            jQuery("#divDynamicGridExcelDownloadProgress").removeClass("hide");
        },
        error: function (request, error) {
            jQuery("#btnDynamicGridExcelDownload").removeClass("hide");
            jQuery("#divDynamicGridExcelDownloadProgress").addClass("hide");
            ErrorMessageDialog(request, DynamicGridLanguageResource.resMsg_Error + DynamicGridLanguageResource.resMsg_FailedToDownloadExcel);
        }
    });
}


//Auto Load
function SetAutoLoad() {
    jQuery.DynamicGridNamespace.ContentLoadIsTriggered = true;
    if (jQuery.DynamicGridNamespace.TimerInterval != undefined) {
        clearInterval(jQuery.DynamicGridNamespace.TimerInterval);
    }

    var isValidSearchCriteria = true;
    jQuery("#divDynamicGridProgress").removeClass("hide");
    if (jQuery.DynamicGridNamespace.PagerData.PageIndex == 0 || jQuery.DynamicGridNamespace.PagerData.PageIndex >= jQuery.DynamicGridNamespace.TotalRecords) {
        jQuery.DynamicGridNamespace.ContentLoadIsTriggered = false;
        ResetContentReloadLoadVariables();
        isValidSearchCriteria = LoadDynamicGridContent(jQuery.DynamicGridNamespace.PagerData);
    }
    else if (!jQuery.DynamicGridNamespace.ContentLoadIsInProgress)
    {
        jQuery.DynamicGridNamespace.ContentLoadIsTriggered = false;
        ResetContentReloadLoadVariables();
        LoadDynamicGridContent(jQuery.DynamicGridNamespace.PagerData);
    }
    else {//Previous call is still not completed, so only clearing the grid and displaying progress bar
        dynamicGridViewModel.TableBodyContent.removeAll();
        jQuery("#divDynamicGridProgress").removeClass("hide")
    }
    
    jQuery.DynamicGridNamespace.TimerInterval = setInterval(function () {
        if (isValidSearchCriteria !== false){
            if (jQuery.DynamicGridNamespace.ContentLoadIsInProgress == false) {
                if (jQuery.DynamicGridNamespace.ContentLoadIsTriggered) {
                    jQuery.DynamicGridNamespace.ContentLoadIsTriggered = false;
                    ResetContentReloadLoadVariables();
                }
                LoadDynamicGridContent(jQuery.DynamicGridNamespace.PagerData);
            }
            else {
                clearInterval(jQuery.DynamicGridNamespace.TimerInterval);
            }
        }
    }, 3000);   
}

function LoadComplete() {
    jQuery.DynamicGridNamespace.ContentLoadIsInProgress = false;
    if (dynamicGridViewModel.PageDisplayMode == 'calendar' || dynamicGridViewModel.PageDisplayMode == 'tablewithautoload') {
        var progressBarValue = (jQuery.DynamicGridNamespace.PagerData.PageIndex / jQuery.DynamicGridNamespace.TotalRecords) * 100;
        if (isNaN(progressBarValue))
            progressBarValue = 100;
        else
            progressBarValue = Math.round(progressBarValue);

        jQuery('#progressbar').progressbar('setPosition', progressBarValue);
    }

    if (jQuery.DynamicGridNamespace.PagerData.PageIndex >= jQuery.DynamicGridNamespace.TotalRecords) {
        clearInterval(jQuery.DynamicGridNamespace.TimerInterval);
        jQuery('#progressbar').addClass("hide");        
    }
}

function StopAutoLoad() {
    if (jQuery.DynamicGridNamespace.TimerInterval != undefined)
        clearInterval(jQuery.DynamicGridNamespace.TimerInterval);

    jQuery.DynamicGridNamespace.ContentLoadIsInProgress = false;
    jQuery.DynamicGridNamespace.ContentLoadIsTriggered = false;    
}

function ReLoadGridContent() {  
    jQuery("#spnTotalRecords").html(0);
    if (dynamicGridViewModel.PageDisplayMode == 'calendar' || dynamicGridViewModel.PageDisplayMode == 'tablewithautoload')
        SetAutoLoad();
    else {
        ResetContentReloadLoadVariables();
        LoadDynamicGridContent(jQuery.DynamicGridNamespace.PagerData);
    }    
}

function ResetContentReloadLoadVariables() {
    jQuery.DynamicGridNamespace.GroupID = 0;
    jQuery.DynamicGridNamespace.PagerData.PageIndex = 0;
    jQuery.DynamicGridNamespace.PagerData.CurrentPage = 0;
    dynamicGridViewModel.TableBodyContent.removeAll();
    jQuery.each(jQuery.DynamicGridNamespace.GroupedFieldValueInfo, function (property, value) {
        jQuery.DynamicGridNamespace.GroupedFieldValueInfo[property].PreviousValue = null;
    });
}

//Search
function DynamicGridSearch() {    
    jQuery.each(jQuery.DynamicGridNamespace.GroupedFieldValueInfo, function (property, value) {
        jQuery.DynamicGridNamespace.GroupedFieldValueInfo[property].PreviousValue = null;
    });
      
    jQuery.DynamicGridNamespace.IsSearch = true;
    ReLoadGridContent();
}

function DynamicGridShowAll() {
    var hasDefaultValue = false;
    ko.utils.arrayForEach(dynamicGridViewModel.GridFieldList(), function (fieldInfo) {
        if (fieldInfo.FilterControlRenderType != jQuery.DynamicGridNamespace.FilterControlRenderType.None) {
            var filterControlDivID = jQuery("#divDynamicFilterControls div[dynamicfilter][fieldid=" + fieldInfo.FieldID + "]").attr("id");
            if (filterControlDivID != undefined) {
                var filterType = jQuery("#" + filterControlDivID).attr("filtertype");
                if (filterType == "enumtype" || filterType == "custom") {
                    jQuery("#" + filterControlDivID).find("select").val("0");
                }
                else if (filterType == "custommultiselect" || filterType == "enumtypemultiselect") {
                    jQuery("#" + filterControlDivID).find("i").removeClass("text-success");
                    jQuery("#" + filterControlDivID).find("i").addClass("gray");
                }
                else {
                    jQuery("#" + filterControlDivID + " input[type='text']").val('');
                }

                if (fieldInfo.FilterDefaultValueList != undefined) {
                    var defaultValueList = [];
                    jQuery.each(fieldInfo.FilterDefaultValueList, function (index, itemValue) {
                        if (jQuery.trim(itemValue).length > 0)
                            defaultValueList.push(jQuery.trim(itemValue).toLowerCase());
                    });

                    if (defaultValueList.length > 0) {
                        if (filterType == "text") {
                            jQuery("#" + filterControlDivID).find("input[type=text]").val(defaultValueList[0]);
                            hasDefaultValue = true;
                        }
                        else if (filterType == "daterange" && (defaultValueList[0] == "currentdate" || defaultValueList[0] == "currentmonth" || defaultValueList[0] == "lasttwomonths" || defaultValueList[0] == "prevnext30days" || defaultValueList[0]=="next30days")) {
                            var rangeStartValue = ''; var rangeEndValue = '';
                            var currentDateTimeInfo = new Date();
                            rangeEndValue = jQuery.datepicker.formatDate(jQuery.DynamicGridNamespace.DatePickerDateFormat, currentDateTimeInfo);
                            if (defaultValueList[0] == "currentdate") {
                                rangeStartValue = rangeEndValue;
                            }
                            else if (defaultValueList[0] == "lasttwomonths") {
                                var lastTwoMonthsDate = new Date(currentDateTimeInfo.getFullYear(), currentDateTimeInfo.getMonth() - 2, currentDateTimeInfo.getDate());
                                rangeStartValue = jQuery.datepicker.formatDate(jQuery.DynamicGridNamespace.DatePickerDateFormat, lastTwoMonthsDate);
                            }
                            else if (defaultValueList[0] == "prevnext30days") {
                                var filterStartDate = new Date();
                                var filterEndDate = new Date();
                                filterStartDate.setDate(currentDateTimeInfo.getDate() - 30);
                                filterEndDate.setDate(currentDateTimeInfo.getDate() + 30);
                                rangeStartValue = jQuery.datepicker.formatDate(jQuery.DynamicGridNamespace.DatePickerDateFormat, filterStartDate);
                                rangeEndValue = jQuery.datepicker.formatDate(jQuery.DynamicGridNamespace.DatePickerDateFormat, filterEndDate);
                            }
                            else if (defaultValueList[0] == "next30days") {
                                var filterEndDate = new Date();
                                filterEndDate.setDate(currentDateTimeInfo.getDate() + 30);
                                rangeStartValue = jQuery.datepicker.formatDate(jQuery.DynamicGridNamespace.DatePickerDateFormat, currentDateTimeInfo);
                                rangeEndValue = jQuery.datepicker.formatDate(jQuery.DynamicGridNamespace.DatePickerDateFormat, filterEndDate);
                            }
                            else {
                                var monthStartDateTimeInfo = new Date(currentDateTimeInfo.getFullYear(), currentDateTimeInfo.getMonth(), 1);
                                rangeStartValue = jQuery.datepicker.formatDate(jQuery.DynamicGridNamespace.DatePickerDateFormat, monthStartDateTimeInfo);
                            }
                            jQuery("#" + filterControlDivID).find("input[type=text][controltype=startvalue]").val(rangeStartValue);
                            jQuery("#" + filterControlDivID).find("input[type=text][controltype=endvalue]").val(rangeEndValue);

                            hasDefaultValue = true;
                        }
                        else if (filterType == "custom") {
                            jQuery("#" + filterControlDivID + " option").each(function () {
                                if (jQuery.inArray(jQuery(this).attr("value").toLowerCase(), defaultValueList) > -1) {
                                    jQuery(this).attr("selected", "selected");
                                    hasDefaultValue = true;
                                }
                            });
                        }
                        else if (filterType == "custommultiselect") {
                            jQuery("#" + filterControlDivID + " li").each(function () {
                                var filterValue = jQuery(this).attr("filtervalue");
                                if (jQuery.inArray(filterValue.toLowerCase(), defaultValueList) > -1) {
                                    jQuery(this).find("i").removeClass("gray").addClass("text-success");
                                    hasDefaultValue = true;
                                }
                            });
                        }
                    }
                }
            }
        }
    });

    if (!hasDefaultValue)
        jQuery.DynamicGridNamespace.IsSearch = false;

    jQuery("#spnDynamicGridSearchError").html('');
    jQuery.each(jQuery.DynamicGridNamespace.GroupedFieldValueInfo, function (property, value) {
        jQuery.DynamicGridNamespace.GroupedFieldValueInfo[property].PreviousValue = null;
    });   
    ReLoadGridContent();
}

//Calendar
function SetDayViewControls() {
    jQuery("#divHeaderFirstLine").removeClass("hide");
    jQuery("#divHeaderSecondLine").removeClass("hide");
    jQuery("#divHeaderPrevNextButton").removeClass("hide");
    jQuery("#divDayViewFooter").removeClass("hide");
    jQuery("#spnHeaderCalendarIcon").removeClass("hide");

    jQuery("#headerPrevButton, #footerPrevButton").unbind("click");
    jQuery("#headerPrevButton, #footerPrevButton").bind("click", function () {
        jQuery.DynamicGridNamespace.CalendarDateChanged = true;
        BindDayViewCalendarHeader(jQuery.DynamicGridNamespace.CalendorDisplayMode.PrevDay);
        SetAutoLoad();
    });

    jQuery("#headerNextButton, #footerNextButton").unbind("click");
    jQuery("#headerNextButton, #footerNextButton").bind("click", function () {
        jQuery.DynamicGridNamespace.CalendarDateChanged = true;
        BindDayViewCalendarHeader(jQuery.DynamicGridNamespace.CalendorDisplayMode.NextDay);
        SetAutoLoad();        
    });

    BindDayViewCalendarHeader(jQuery.DynamicGridNamespace.CalendorDisplayMode.None);
}

function BindDayViewCalendarHeader(mode) {
    jQuery.ajax({
        type: "POST",
        url: jQuery.DynamicGridNamespace.WebServiceNameWithPath + "/LoadDayViewCalendaHeader",
        data: JSON.stringify({ currentValue: jQuery.DynamicGridNamespace.CurrentDate, displayMode: mode }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        async: false,
        success: function (json) {
            if (json != undefined && json.d != undefined) {
                jQuery("#spnDynamicGridTableHeader").html(json.d.HeaderText);
                jQuery("#spnDynamicGridTableFooter").html(json.d.HeaderText);
                jQuery.DynamicGridNamespace.CurrentDate = json.d.selevetedValue;
            }
        },
        error: function (request, error) {
            ErrorMessageDialog(request, DynamicGridLanguageResource.resMsg_Error + DynamicGridLanguageResource.resMsg_FailedToLoadCalendarInfo);
        }
    });

    if (typeof CustomCalendarDateChange != "undefined")
        CustomCalendarDateChange(jQuery.DynamicGridNamespace.CurrentDate);
}

//Sorting
function EnableGroupSorting() {
    jQuery("#tbDynamicGrid").removeClass("ui-sortable-disabled");
    var sortOptions = {
        disabled: false,
        items: 'tr[elablesorting=true]',
        cursor: 'move',
        containment: "#tblDynamicGrid",
        start: function (event, ui) {
            jQuery(ui.item).data("startindex", ui.item.index());
        },             
        update: function (event, ui) {
            var startIndex = ui.item.data().startindex;
            var newIndex = ui.item.index();
            var currentRowGroupID = ui.item.attr("groupid");
            var previousRowGroupID = 0; var nextRowGroupID = 0;

            if (startIndex < newIndex) {
                previousRowGroupID = jQuery("#tbDynamicGrid tr:eq(" + (newIndex - 1) + ")").attr("groupid");
            }
            else {
                nextRowGroupID = jQuery("#tbDynamicGrid tr:eq(" + (newIndex + 1) + ")").attr("groupid");
            }
            if (currentRowGroupID != previousRowGroupID && currentRowGroupID != nextRowGroupID) {
                jQuery(this).sortable('cancel');
                jQuery(ui.item).addClass("br-red");
                setInterval(function () { jQuery(ui.item).removeClass("br-red"); }, 3000);
            }
            else if (startIndex != newIndex) {
                GroupSorting(ui.item, this, startIndex, newIndex);
            }
        },
        helper: function (e, ui) {
            var original = ui.children();
            var helper = ui.clone();
            helper.children().each(function (index) {
                jQuery(this).width(original.eq(index).width());
            });
            return helper;          
        }
    };

    jQuery("#tbDynamicGrid").sortable(sortOptions);
}


function CollapsableGroup(iconCtrl) {
    var groupID = jQuery(iconCtrl).closest("tr").attr("groupid");
    jQuery("tr[groupid=" + groupID + "][grouprow=false]").css('display', '')
    if (jQuery(iconCtrl).hasClass('fa-minus-circle')) {
        jQuery("tr[groupid=" + groupID + "][grouprow=false]").addClass("hide");
        jQuery(iconCtrl).removeClass('fa-minus-circle');
        jQuery(iconCtrl).addClass('fa-plus-circle');
        t2 = jQuery(iconCtrl).parents("tr").nextAll("tr[grouprow=false]").not(".hide").children("td");
        if (t2.length == 0)
            t2 = jQuery(iconCtrl).parents("tr").prev("tr").children("td");
    }
    else {
        jQuery(iconCtrl).removeClass('fa-plus-circle');
        jQuery("tr[groupid=" + groupID + "][grouprow=false]").removeClass("hide");
        jQuery(iconCtrl).addClass('fa-minus-circle');
        t2 = jQuery(iconCtrl).closest("tr").next("tr").children("td");
    }
    if (!(navigator.appVersion.indexOf("MSIE 9.") !== -1)) {         
        jQuery(".table-responsive").removeClass("scroll");
        tblBeforeHeight = jQuery("#tbDynamicGrid").height();
        jQuery(".tbodypositionfixed").css("width", "");
        jQuery(".theadpositionfixed").css("width", "");
        jQuery("#tblDynamicGrid th").css("min-width", "");
        jQuery("#tblDynamicGrid td").css("min-width", "");
        jQuery("#tblDynamicGrid th").css("width", "");
        jQuery("#tblDynamicGrid td").css("width", "");
        jQuery(".fixed-side").css("width", "");
        jQuery("th:first").css("width", "");
        jQuery(".tbodypositionfixed").css("height", "");
        jQuery(".tbodypositionfixed").css("overflow-y", "");
        t1 = jQuery("#tblDynamicGrid th");
        var addWid = 0;
        if (t1.length < 9) {
            t1.each(function (index) {
                jQuery(this).css("min-width", "125px");
            });
            t2.each(function (index) {
                jQuery(this).css("min-width", "125px");
            });
        }
        if (t1.length < 6) {
            totCols = jQuery("#tblDynamicGrid th").length;
            totTblWidth = jQuery(".tbodypositionfixed").width();
            minColWidth = totTblWidth / totCols;
            t1.each(function (index) {
                jQuery(this).css("min-width", minColWidth);
            });
            t2.each(function (index) {
                jQuery(this).css("min-width", minColWidth);
            });
        }
        t1.each(function (index) {
            thWidth = t1.eq(index).width();
            tdWidth = t2.eq(index).width();
            if (thWidth >= tdWidth) {
                t1.eq(index).width(thWidth);
                t2.eq(index).width(thWidth);
            }
            else {
                t1.eq(index).width(tdWidth);
                t2.eq(index).width(tdWidth);
            }
        });
        if (dynamicGridViewModel.PageDisplayMode != 'calendar') { //if not calendar then increments{}
           // if ((t2.eq(0).find(".relative").length > 0) && (t2.eq(0).find("input").length > 0) || (t2.eq(0).find("i").length > 0)) {
                orgWid = jQuery("th:first").width();
                addWid = 30;
                jQuery("tr .fixed-side:first-child").css("width", orgWid + addWid);
                jQuery("th:first").css("width", orgWid + addWid);
            //}
        }
        tHeadWidth = jQuery(".theadpositionfixed").width();
        tBodyWidth = jQuery(".tbodypositionfixed").width();
        jQuery(".tbodypositionfixed").css("width", tBodyWidth + 20 + addWid);
        groupRows = jQuery("#tbDynamicGrid tr[grouprow='true']");
        if ((jQuery("#tbDynamicGrid tr").attr("grouprow").toLowerCase() == "true"))
            groupRows.children("td:first").width(tHeadWidth);
        jQuery(".table-responsive").addClass("scroll");        
        jQuery(".float-scroll-div").css("height", tblBeforeHeight);
        jQuery(".float-scroll").css("height", tblMaxHeight);
        if (tblBeforeHeight < tblMaxHeight) {
            jQuery(".float-scroll").addClass("hide");
        }
        else {
            jQuery(".float-scroll").removeClass("hide");
        }
        //crolling tablediv while scrolling float scroll
        var target = jQuery("#tbDynamicGrid");
        jQuery(".float-scroll").scroll(function () {
            target.prop("scrollTop", this.scrollTop);
        });
        var target1 = jQuery(".float-scroll");
        var scrollValue = 0;
        var scrollTimeout = false
        jQuery("#tbDynamicGrid").scroll(function (event) {
            /* Clear it so the function only triggers when scroll events have stopped firing*/
            clearTimeout(scrollTimeout);
            /* Set it so it fires after a second, but gets cleared after a new triggered event*/
            scrollTimeout = setTimeout(function () {
                var scrolled = jQuery("#tbDynamicGrid").scrollTop() - scrollValue;
                //scrollValue = $("#tbDynamicGrid").scrollTop();
                target1.prop("scrollTop", scrolled);
            }, 50);
        });
        jQuery(".table-responsive").scrollLeft(0);
    }
}

function EnableColumnSorting() {
    var sortOptions = {
        items: 'li',
        cursor: 'move',
        handle:'.v-icon'
    };

    jQuery("#ulColumnOption").sortable(sortOptions);
}

//Attributes binding
function GetDynamicGridTableHeaderColumnAttributes(headerColumnInfo) {
    var tableHeaderColumnProperties = {
        fieldid: headerColumnInfo.FieldID,
        onclick: headerColumnInfo.EnableSorting ? "javascript:SortField(" + headerColumnInfo.FieldID + ");" : "",
        class: headerColumnInfo.EnableSorting ? "cursor-pointer underline nowrap" : "nowrap"      
    };
   
    return tableHeaderColumnProperties;
}

function GetDynamicGridTableRowAttributes(rowInfo, rowIndex) {
    var sortingEnabled = 'false';
    var rowClass = '';
    if (jQuery.DynamicGridNamespace.CustomRowNavigationMethod.length > 0 && rowInfo.IsGroupRow == false)
        rowClass = 'cursor-pointer';

    if (!rowInfo.IsGroupRow && rowInfo.GroupSortingEnabled) {
        sortingEnabled = 'true';
        rowClass = rowClass + ' move';
    }

    if (jQuery("#tbDynamicGrid tr[groupid=" + rowInfo.GroupID + "][grouprow=true]").find("i").hasClass("fa-plus-circle")
        || (Object.keys(jQuery.DynamicGridNamespace.GroupedFieldValueInfo).length > 0 && !rowInfo.IsGroupRow && !jQuery.DynamicGridNamespace.ShowGroupRowsByDefault))
        rowClass = rowClass + " hide";

    var rowAttrubutes = {
        onclick: (jQuery.DynamicGridNamespace.CustomRowNavigationMethod.length > 0 && rowInfo.IsGroupRow == false) ? 'javascript:NavigateOnRowOnclick(this)' : '',
        class: rowClass,
        groupid: rowInfo.GroupID,
        grouprow: rowInfo.IsGroupRow == true ? 'true' : 'false',
        elablesorting: sortingEnabled
    }
    if (typeof CustomBindRowAttributes != "undefined" && rowInfo.IsGroupRow == false) {
        var groupingEnabled = Object.keys(jQuery.DynamicGridNamespace.GroupedFieldValueInfo).length > 0 ? true : false;
        jQuery.extend(rowAttrubutes, CustomBindRowAttributes(rowInfo, rowIndex, groupingEnabled));
    }
    return rowAttrubutes;
}

function GetDynamicGridTableColumnAttributes(rowInfo, columnIndex, fieldIdentifier, hasCustomAttributes) {
    var isGroupRow = rowInfo.IsGroupRow;
    var customAttributeInfo = {};
    if (isGroupRow ) {
        return {
            class: isGroupRow == true ? 'bold bg-white' : '',
            colspan: isGroupRow == true && columnIndex == 0 ? dynamicGridViewModel.TableHeaderFieldList().length : 1,
            visible: isGroupRow == true && columnIndex > 0 ? false : true
        }
    }
    else if (fieldIdentifier.toLowerCase() == "rownumber") {
        return {           
            class: 'nowrap calendar-row-td-style vertical-middle'
        }
    }
    else if (hasCustomAttributes && typeof CustomGridAttributeBind != "undefined") {
        return CustomGridAttributeBind(fieldIdentifier, columnIndex, rowInfo);
    }
    else if (typeof CustomRowStyle != "undefined") {
        return CustomRowStyle();
    }
    else {
        return {}
    }
}

function GetDynamicGridDataAttributes(headerColumnInfo, isGroupRow) {
    var dataAttributeInfo = {};
    if (isGroupRow)
        dataAttributeInfo.class = 'bold';
   
    return dataAttributeInfo;
}

function GetDyanmicGridContent(rowInfo, rowIndex, columnInfo, columnIndex) {
    var content = '';
    if (columnInfo.HasCustomDataBind && typeof CustomGridContentBind != "undefined" && !rowInfo.IsGroupRow) {
        content = CustomGridContentBind(rowInfo, rowIndex, columnInfo);
    }
    else if (rowInfo.IsGroupRow && typeof CustomGridGroupRowContentBind != "undefined" && columnIndex == 0) {
        var groupFirstFieldID = 0; var groupSecondFieldID = 0; var groupedItemIndex = 0; var groupFirstFieldValue = ''; var groupSecondFieldValue = '';
        jQuery.each(jQuery.DynamicGridNamespace.GroupedFieldValueInfo, function (property, propertyValue) {
            if (groupedItemIndex == 0) {
                groupFirstFieldID = property;
            }
            else if (groupedItemIndex == 1) {
                groupSecondFieldID = property;
                return false;
            }
            groupedItemIndex++;
        });

        if (rowInfo[columnInfo.FieldID] != undefined)
            content = rowInfo[columnInfo.FieldID];
        if (Object.keys(jQuery.DynamicGridNamespace.GroupedFieldValueInfo).length == 2) {
            //When two columns are grouped, backend returns first group column value as second group column value and send group column value as first group column value.
            if (rowInfo.GroupSecondFieldValue != undefined)
                groupFirstFieldValue = rowInfo.GroupSecondFieldValue; 
            if (rowInfo.GroupFirstFieldValue != undefined)
                groupSecondFieldValue = rowInfo.GroupFirstFieldValue;
        }
        else {
            if (rowInfo.GroupFirstFieldValue != undefined)
                groupFirstFieldValue = rowInfo.GroupFirstFieldValue;
            if (rowInfo.GroupSecondFieldValue != undefined)
                groupSecondFieldValue = rowInfo.GroupSecondFieldValue;
        }

        content = CustomGridGroupRowContentBind(content, groupFirstFieldID, groupSecondFieldID, groupFirstFieldValue, groupSecondFieldValue);
    }
    else {
        content = rowInfo[columnInfo.FieldID];
    }
    return content;
}

function GetUserViewDeleteAttributes(viewInfo) {
    var hasDeleteUserViewPermission = viewInfo.ViewID > 0
        && (jQuery.DynamicGridNamespace.DeleteUseViewAccess.toLowerCase() == "full_access" || viewInfo.CreatedBy == jQuery.DynamicGridNamespace.PagerData.UserID) ? true : false;

    return {
        onclick: hasDeleteUserViewPermission ? 'javascript:DeleteUserViewConfirm(' + viewInfo.ViewID + ');' : '',
        class: hasDeleteUserViewPermission ? 'fa fa-trash-o text-danger big push-down v-icon cursor-pointer' : 'hide'
    }
}


//Clear
function ResetViewModelProperties() {
    dynamicGridViewModel.FilterFieldList.removeAll();
    dynamicGridViewModel.DisplayFieldList.removeAll();
    dynamicGridViewModel.GroupFieldList.removeAll();
    dynamicGridViewModel.GridFieldList.removeAll();
    dynamicGridViewModel.TableHeaderFieldList.removeAll();
    dynamicGridViewModel.TableBodyContent.removeAll();
    dynamicGridViewModel.HeaderStatusInfoList.removeAll();
    dynamicGridViewModel.UserViewInfoList.removeAll();
    dynamicGridViewModel.FilterFieldExists(false);
}

function ResetGlobalVariables() {    
    jQuery.DynamicGridNamespace.ImageFieldIDList = [];
    jQuery.DynamicGridNamespace.SelectedFieldIDList = []; 
    jQuery.DynamicGridNamespace.GroupSelectedFieldOrderList = []; 
    jQuery.DynamicGridNamespace.GroupedFieldValueInfo = {};
    jQuery.DynamicGridNamespace.GroupID = 0;    
    jQuery.DynamicGridNamespace.GroupFieldProperties = {};
    jQuery.DynamicGridNamespace.TotalRecords = 0;
    jQuery.DynamicGridNamespace.IsSearch = false;
    jQuery.DynamicGridNamespace.SelectedUserViewID = 0;
    jQuery.DynamicGridNamespace.PagerData.PageIndex = 0;
    jQuery.DynamicGridNamespace.ObjectID = 0;
}

function ResetDOMElements() {
    jQuery("#spnSaveSaveGridViewMessage").html('');
    jQuery("#divDynamicFilterControls").html('');
    jQuery("#btnDynamicGridSearch").addClass("hide");    
    jQuery("#spnDynamicGridSearchError").html('');
    jQuery("#divDynamicGridExcelDownload").addClass("hide");
    jQuery("#divDynamicGridRefresh").addClass("hide");
    if (jQuery(".ui-dialog").is(":visible"))
        jQuery(".ui-dialog-content").dialog("close")
}


function NavigateOnRowOnclick(rowCtl) {
    if (jQuery.DynamicGridNamespace.CustomRowNavigationMethod.length > 0) {
        window[jQuery.DynamicGridNamespace.CustomRowNavigationMethod](rowCtl);
    }
}

function ApplyFilterToggle() {
    jQuery(".dropdown-toggle ").unbind("click");
    jQuery(".dropdown-menu ul,li").click(function (e) { e.stopPropagation() });
    jQuery(".dropdown-toggle ").bind("click", function (e) {
        e.stopPropagation();
        jQuery(".wrapper-dropdown").removeClass("active");
        targ = jQuery(this).siblings(".dropdown-menu");
        jQuery(targ).find("ul").animate({ scrollTop: 0 }, 100);
        if (jQuery(".dropdown-menu").not(targ).hasClass("show"))
            jQuery(".dropdown-menu").removeClass("show");

        jQuery(this).closest(".dropdown-menu").toggleClass("show");
        if (jQuery(this).attr("drpsavesetting") == "true") {
            if (jQuery.DynamicGridNamespace.SelectedUserViewID > 0) {
                var selectedViewInfo = ko.utils.arrayFirst(dynamicGridViewModel.UserViewInfoList(), function (userViewInfo) {
                    if (userViewInfo.ViewID == jQuery.DynamicGridNamespace.SelectedUserViewID)
                        return userViewInfo;
                });
                var isSharedView = (selectedViewInfo.CreatedBy != jQuery.DynamicGridNamespace.PagerData.UserID) ? true : false;
                if (!isSharedView || (isSharedView && jQuery.DynamicGridNamespace.DeleteUseViewAccess.toLowerCase() == "full_access")) {
                    jQuery(this).siblings(".dropdown-menu").toggleClass("show");
                    jQuery(this).toggleClass("drp-closed");
                }
                else {
                    ShowSaveUserViewModel();
                }
            }
            else {
                ShowSaveUserViewModel();
            }
        }
        else {
            jQuery(this).siblings(".dropdown-menu").toggleClass("show");
            jQuery(this).toggleClass("drp-closed");
        }
        var tablStartpos = jQuery(".table-responsive").offset().top;
        orgHeight = jQuery(".table-responsive").height();
        var calcHeight = tablStartpos + orgHeight;
        var targPos = jQuery(this).offset().top + 100;
        if (targPos > calcHeight) {
            jQuery(".table-responsive").animate({
                scrollTop: jQuery(".table-responsive").children("table").offset().top
            }, 1000);
        }
        if (jQuery(this).closest("table").length > 0) {
            oldHeight = jQuery(".tbodypositionfixed").height();
            endOfTableHeight = tablStartpos + tblBeforeHeight;
            if ((targPos > endOfTableHeight) && (!(navigator.appVersion.indexOf("MSIE 9.") !== -1))) {
                var drpmenuHeight = 0;
                jQuery(".tbodypositionfixed").css("height", "");

                drpmenuHeight = jQuery(this).siblings(".dropdown-menu").height();
                jQuery(".tbodypositionfixed").css("max-height", oldHeight + drpmenuHeight - diff);
                jQuery(".tbodypositionfixed").css("height", oldHeight + drpmenuHeight - diff);
            }            
            diff = (jQuery(".tbodypositionfixed").height()) - tblBeforeHeight;
        }
    });
    jQuery(".drp-close").click(function () {
        jQuery(".dropdown-menu").removeClass("show");
    });
}


function ShowSaveUserViewModel() {    
    jQuery("#iconShareableView").addClass("i-opacity");
    jQuery("#saveUserViewModel").modal('show');
    jQuery("#txtUserViewName").val('');
    jQuery("#txtUserViewName").focus();
    jQuery("#spnSaveSaveGridViewMessage").html('');
}

function CloseSaveUserViewModel() {
    jQuery("#saveUserViewModel").modal('hide');
}

function ErrorMessageDialog(request, errorMessage) {
    jQuery("#dynamicGridModelConfirmMessage").addClass("red");
    if (request != null && request.responseText != "") {
        var errorMsg = undefined;
        if (request.responseText != undefined)
            errorMsg = jQuery.parseJSON(request.responseText);
        if (errorMsg != undefined && errorMsg != null && errorMsg.Message != undefined && errorMsg.Message != null)
            jQuery("#dynamicGridModelConfirmMessage").html(DynamicGridLanguageResource.resMsg_Error + errorMsg.Message);
        else
            jQuery("#dynamicGridModelConfirmMessage").html(errorMessage);
    }
    else {
        jQuery("#dynamicGridModelConfirmMessage").html(errorMessage);
    }

    jQuery("#divDynamicGridMessageModel").dialog({
        zIndex: 1060,
        buttons:
        [
            {
                text: DynamicGridLanguageResource.resMsg_Ok,
                click: function () {
                    jQuery("#divDynamicGridMessageModel").dialog("close");
                }
            }
        ]
    });
}

function InitiateDatePicker() {
    jQuery.datepicker.setDefaults({
        closeText: DynamicGridCalendarLanguageResource.resMsg_CloseText,
        prevText: DynamicGridCalendarLanguageResource.resMsg_PrevText,
        nextText: DynamicGridCalendarLanguageResource.resMsg_NextText,
        currentText: DynamicGridCalendarLanguageResource.resMsg_CurrentText,
        monthNames: DynamicGridCalendarLanguageResource.resMsg_MonthNames,
        monthNamesShort: DynamicGridCalendarLanguageResource.resMsg_MonthNamesShort,
        dayNames: DynamicGridCalendarLanguageResource.resMsg_DayNames,
        dayNamesShort: DynamicGridCalendarLanguageResource.resMsg_DayNamesShort,
        dayNamesMin: DynamicGridCalendarLanguageResource.resMsg_DayNamesMin,
        weekHeader: DynamicGridCalendarLanguageResource.resMsg_WeekHeader,
        firstDay: DynamicGridCalendarLanguageResource.resMsg_FirstDay,
        yearSuffix: '',
        changeMonth: true,
        changeYear: true,
        dateFormat: jQuery.DynamicGridNamespace.DatePickerDateFormat
    });
}

function SelectDisplayColumn(displayColumnInfo) {
    if (displayColumnInfo.IsSelected() == true)
        displayColumnInfo.IsSelected(false);
    else
        displayColumnInfo.IsSelected(true);
}

function ShareableViewClick(shareViewLabel) {
    var iconShareView = jQuery(shareViewLabel).find("i");
    if (jQuery(iconShareView).hasClass("i-opacity"))
        jQuery(iconShareView).removeClass("i-opacity");
    else
        jQuery(iconShareView).addClass("i-opacity");
}

function MultiSelectFilterSelect(filterCtl) {   
    if (jQuery(filterCtl).find("i").hasClass("gray")) {
        jQuery(filterCtl).find("i").removeClass("gray");
        jQuery(filterCtl).find("i").addClass("text-success");
    }
    else {
        jQuery(filterCtl).find("i").removeClass("text-success");
        jQuery(filterCtl).find("i").addClass("gray");
    }
}

function DynamicGridTimerMethodForDownload(fileName) {
    var successTimer;
    var errorTimer;
    var successTxtFile = fileName + "_tempSuccess.txt";
    var errorTxtFile = fileName + "_tempError.txt";
    var excelFile = fileName + ".xls";

    successTimer = setInterval(function () {
        jQuery.ajax({
            type: "POST",
            url: jQuery.DynamicGridNamespace.WebServiceNameWithPath  + "/CheckFileExist",
            data: JSON.stringify({ fileName: successTxtFile }),
            contentType: "Application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                if (json.d != null) {
                    if (json.d) {
                        clearInterval(successTimer);
                        clearInterval(errorTimer);
                        jQuery("#btnDynamicGridExcelDownload").removeClass("hide");
                        jQuery("#divDynamicGridExcelDownloadProgress").addClass("hide");
                        window.location = "../HandlerFiles/DownloadHandler.ashx?DynamicGridContentExcel=" + excelFile;                                               
                    }
                }
            },
            error: function (request, error) {
                if (request.responseText != "") {
                    clearInterval(successTimer);
                    clearInterval(errorTimer);
                    jQuery("#btnDynamicGridExcelDownload").removeClass("hide");
                    jQuery("#divDynamicGridExcelDownloadProgress").addClass("hide");
                    ErrorMessageDialog(request, DynamicGridLanguageResource.resMsg_Error + DynamicGridLanguageResource.resMsg_FailedToDownloadExcel);
                }
            }
        });
    }, 5000);

    errorTimer = setInterval(function () {
        jQuery.ajax({
            type: "POST",
            url: jQuery.DynamicGridNamespace.WebServiceNameWithPath  + "/CheckFileExist",
            data: JSON.stringify({ fileName: errorTxtFile }),
            contentType: "Application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                if (json.d) {
                    jQuery.get('../HandlerFiles/DownloadHandler.ashx?ProductionPlanLogFile=' + errorTxtFile, function (data) {//
                        clearInterval(successTimer);
                        clearInterval(errorTimer);
                        jQuery("#btnDynamicGridExcelDownload").removeClass("hide");
                        jQuery("#divDynamicGridExcelDownloadProgress").addClass("hide");
                        ErrorMessageDialog(null, data);
                    });
                }
            },
            error: function (request, error) {
                if (request.responseText != "") {
                    clearInterval(successTimer);
                    clearInterval(errorTimer);
                    jQuery("#btnDynamicGridExcelDownload").removeClass("hide");
                    jQuery("#divDynamicGridExcelDownloadProgress").addClass("hide");
                    ErrorMessageDialog(request, DynamicGridLanguageResource.resMsg_Error + DynamicGridLanguageResource.resMsg_FailedToDownloadExcel);
                }
            }
        });
    }, 5000);
}

jQuery(document).click(function () {
    jQuery(".dropdown-menu").removeClass("show");    
});

function BindDynamicGridEvents() { 
    var mouseIsOnSearchDiv = false;
    jQuery("#divDynamicGridSearch").mouseenter(function () {
        mouseIsOnSearchDiv = true;
    });
    jQuery("#divDynamicGridSearch").mouseleave(function () {
        mouseIsOnSearchDiv = false;
    });
    jQuery(window).keypress(function (e) {
        if (e.which == 13) {  //Enter key
            if (mouseIsOnSearchDiv || jQuery("#divDynamicGridSearch input:focus").length > 0) {
                DynamicGridSearch();
                return false;
            }
            else if (e.target.tagName != 'TEXTAREA') {
                return false;
            }
        }        
    });    
}

function TableFirstColumnFixedScroll() {

    if (!(navigator.appVersion.indexOf("MSIE 9.") !== -1)) {
        tblBeforeHeight = jQuery("#tbDynamicGrid").height();
        jQuery("#tbDynamicGrid").addClass("tbodypositionfixed");
        jQuery(".tbodypositionfixed").css("width", "");
        jQuery(".theadpositionfixed").css("width", "");
        jQuery("#tblDynamicGrid th").css("min-width", "");
        jQuery("#tblDynamicGrid td").css("min-width", "");
        jQuery("#tblDynamicGrid th").css("width", "");
        jQuery("#tblDynamicGrid td").css("width", "");
        jQuery(".tbodypositionfixed").css("height", "");
        jQuery(".tbodypositionfixed").css("overflow-y", "");

        t1 = jQuery("#tblDynamicGrid th");
        t2 = jQuery("#tbDynamicGrid tr:last td");        
        if (t1.length < 12 && t1.length > 10) {
            t1.each(function (index) {
                jQuery(this).css("min-width", "105px");
            });
            t2.each(function (index) {
                jQuery(this).css("min-width", "105px");
            });
        }
        if (t1.length < 10 && t1.length > 8) {
            t1.each(function (index) {
                jQuery(this).css("min-width", "125px");
            });
            t2.each(function (index) {
                jQuery(this).css("min-width", "125px");
            });
        }
        if (t1.length < 8) {
            totCols = jQuery("#tblDynamicGrid th").length;
            totTblWidth = jQuery(".tbodypositionfixed").width() - 20;
            minColWidth = totTblWidth / totCols;
            t1.each(function (index) {
                jQuery(this).css("min-width", minColWidth);
            });
            t2.each(function (index) {
                jQuery(this).css("min-width", minColWidth);
            });
        }
        var extraWidth = 0;
        t1.each(function (index) {
            t1.eq(index).removeAttr('style');
            thWidth = t1.eq(index).width();
            tdWidth = t2.eq(index).width();
            if (dynamicGridViewModel.PageDisplayMode != 'calendar') { //if not calendar then increments{}
                if ((t2.eq(0).find(".relative").length > 0) && (t2.eq(0).find("input").length > 0)) {
                    if (t1.length > 13)
                        extraWidth = 20;
                    else if (t1.length >= 15)
                        extraWidth = 30;
                    else if (t1.length >= 18)
                        extraWidth = 40;
                }
            }                      
            if (thWidth >= tdWidth) {
                
                if (index == 0) {                      
                    t1.eq(index).width(thWidth + extraWidth);
                    t2.eq(index).width(thWidth + extraWidth);
                }
                else {
                    t1.eq(index).width(thWidth);
                    t2.eq(index).width(thWidth);
                }
            }
            else {
                if (index == 0) {
                    t1.eq(index).width(tdWidth + extraWidth);
                    t2.eq(index).width(tdWidth + extraWidth);
                }
                else {
                    t1.eq(index).width(tdWidth);
                    t2.eq(index).width(tdWidth);
                }
            }            
            if (tdWidth > 500) {
                if ($(window).width() > 1400)
                    t1.eq(index).width(510);
                else
                    t1.eq(index).width(492.8);
                t2.eq(index).width(500);
                t1.eq(index).css({ "word-break": "break-all", "white-space": "normal", "min-width": "500px", "max-width": "500px" });
                jQuery("#tbDynamicGrid tr td:nth-child(" + (index + 1) + ")").css({ "word-break": "break-all", "white-space": "normal" });

            }
        });
        tHeadWidth = jQuery(".theadpositionfixed").width();
        tBodyWidth = jQuery(".tbodypositionfixed").width();
        if ((jQuery(".tbodypositionfixed").height()) > tblMaxHeight)
            jQuery(".tbodypositionfixed").css("width", tBodyWidth + extraWidth + 20);
        else
            jQuery(".tbodypositionfixed").css({ "width": tBodyWidth + extraWidth, "overflow-y": "hidden" });
        jQuery(".table-responsive").addClass("scroll");
        jQuery(".float-scroll-div").css("height", tblBeforeHeight);
        jQuery(".float-scroll").css("height", tblMaxHeight);
        if (tblBeforeHeight < tblMaxHeight) {
            jQuery(".float-scroll").addClass("hide");
        }
        else {
            jQuery(".float-scroll").removeClass("hide");
        }
        //crolling tablediv while scrolling float scroll
        var target = jQuery("#tbDynamicGrid");
        jQuery(".float-scroll").scroll(function () {
            target.prop("scrollTop", this.scrollTop);
        });
        var target1 = jQuery(".float-scroll");
        var scrollValue = 0;
        var scrollTimeout = false
        jQuery("#tbDynamicGrid").scroll(function (event) {
            /* Clear it so the function only triggers when scroll events have stopped firing*/
            clearTimeout(scrollTimeout);
            /* Set it so it fires after a second, but gets cleared after a new triggered event*/
            scrollTimeout = setTimeout(function () {
                var scrolled = jQuery("#tbDynamicGrid").scrollTop() - scrollValue;
                //scrollValue = $("#tbDynamicGrid").scrollTop();
                target1.prop("scrollTop", scrolled);
            }, 50);
        });
        jQuery(".table-responsive").scrollLeft(0);
    }
}


function setBoxHeight() {  //function for making the height of the div,s equal for dynamic columns
    if (jQuery(window).width() > 768) {
        var maxHeight = 0;
        jQuery('#divDynamicFilterControls').children(".col-lg-2").each(function () {
            var currentHeight = 0;
            currentHeight = jQuery(this).height();
            maxHeight = maxHeight > currentHeight ? maxHeight : currentHeight;
        });

        jQuery('#divDynamicFilterControls').children(".col-lg-2").each(function () {
            jQuery(this).css("height", maxHeight + 1);
        });
    }
}

function SaveDynamicGridFilterValues() {
    if (jQuery.DynamicGridNamespace.FilterFieldValueInfoList.length > 0) {
        var filterInfo = {};
        ko.utils.arrayForEach(jQuery.DynamicGridNamespace.FilterFieldValueInfoList, function (fInfo) {
            filterInfo[fInfo.FieldID] = fInfo.FilterValueList;
        });
        var itemName = "dynamicGridFilterData_" + jQuery.DynamicGridNamespace.ObjectID;
        var filterdata = JSON.stringify(filterInfo);

        window.sessionStorage.setItem(itemName, filterdata);
    }
}

function RetriveSavedDynamicGridFilterValues() {
    var savedFilterData;
    var savedFilterValues = window.sessionStorage.getItem("dynamicGridFilterData_" + jQuery.DynamicGridNamespace.ObjectID);
    if (savedFilterValues != undefined && savedFilterValues.length > 0) {
        savedFilterData = JSON.parse(savedFilterValues);
        window.sessionStorage.removeItem("dynamicGridFilterData_" + jQuery.DynamicGridNamespace.ObjectID);
    }
    return savedFilterData;
}

function GetFormatedStringFromNumber(dateInNumber) {
    var formateDateString = '';
    dateInNumber = dateInNumber.toString();

    var yearVal = dateInNumber.substring(0, 4);
    var monthVal = dateInNumber.substring(4, 6);
    var dateVal = dateInNumber.substring(6, 8);

    monthVal = monthVal - 1;

    var dateTime = new Date(yearVal, monthVal, dateVal);
    formateDateString = jQuery.datepicker.formatDate(jQuery.DynamicGridNamespace.DatePickerDateFormat, dateTime);

    return formateDateString;
}