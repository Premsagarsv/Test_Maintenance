<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="DynamicGridControl.ascx.cs"
    Inherits="Vegam_MaintenanceModule.UserControls.DynamicGridControl" %>
<style type="text/css">
    td {
        white-space:nowrap;
           }  
       .scroll table {
            position: relative;
            overflow: hidden;            
        }
        /*thead*/
       .scroll .theadpositionfixed {
            position: relative;
            display: block; /*seperates the header from the body allowing it to be positioned*/
            overflow: visible;
        }
          .scroll .theadpositionfixed th {
                height: 32px;
                vertical-align: top !important;
            }
        /*tbody*/
        .scroll .tbodypositionfixed {
            position: relative;
            display: block; /*seperates the tbody from the header*/
            overflow-y: scroll;
        }
       #tbDynamicGrid tr .show{
           display:block !important;
       }
  
   </style>
<section id="divDynamciGridControl">
    <div id="progressbar" class="progress-info progress-striped progresscalendar active push-up text-center pull-xs-right absolute" style="margin-bottom: 0px; width: 150px; top: -40px; right: 282px;">
        <div class="progress">
            <div class="bar bar-info progress-bar progress-bar-info" style="width: 100%;"></div>
        </div>
    </div>
    <input type="hidden" id="hdnDeleteUserViewAccess" deleteuserviewpermissionctl="true" runat="server" enableviewstate="false" />
    <fieldset data-bind="visible: HeaderStatusInfoList().length > 0">
        <legend class="search-legend cursor-pointer"><i class="fa fa-caret-right tiny-rightmargin"></i><%=GetGlobalResourceObject("DynamicGridResource", "orderStatus")%></legend>
        <div class="hide col-xs-12">
            <fieldset id="divHeaderStatus" data-bind="foreach: HeaderStatusInfoList">
                <div class="label-xxxlarge nomarginleft">
                    <p class="font-mini bottom-gap">
                        <img data-bind="attr: { src: $root.ImagePath() + '/' + $data.ImageName }" class="tiny-rightmargin"
                            alt="" /><span data-bind="text: $data.DisplayName "></span>
                    </p>
                </div>
            </fieldset>
        </div>
    </fieldset>
    <fieldset id="divDynamicGridSearch" data-bind="visible: FilterFieldExists">
        <legend class="search-legend cursor-pointer"><i class="fa fa-caret-right tiny-rightmargin"></i><%=GetGlobalResourceObject("DynamicGridResource", "defineSearchCriteria")%></legend>
        <div class="hide">
            <div data-bind="visible: FilterFieldList().length > 0" class="col-xs-12 col-lg-1">
                <fieldset class="relative col-xs-12 p-x-0 heading-gap">
                    <button type="button" class="btn btn-default btn-sm dropdown-toggle relative col-xs-12 push-down bottom-gap">
                        <%=GetGlobalResourceObject("DynamicGridResource", "filter")%></button>
                    <div class="absolute col-xs-12 p-x-0 dropdown-menu hide" style="z-index: 9; overflow-y: auto; max-height: 200px; overflow-x: hidden;">
                        <ul data-bind="foreach: FilterFieldList" class="p-a-0" style="list-style: none;">
                            <li data-bind="click: function () { SelectDisplayColumn($data); }" class="cursor-pointer">
                                <label class="font-small push-down full-width">
                                    <span><i data-bind="attr: { class: SelectedClass }"></i></span><span data-bind="text: $data.DisplayName"></span>
                                </label>
                            </li>
                        </ul>
                    </div>
                </fieldset>
            </div>
            <div class="col-xs-12 col-lg-11 dynamic-columns p-x-0 push-up">
                <div id="divDynamicFilterControls">
                </div>
                <div class="bottom-gap pull-xs-left">
                    <a id="btnDynamicGridSearch" onclick="javascript:DynamicGridSearch();" class="btn btn-normal btn-sm hide tiny-rightmargin heading-gap-big"><i class="fa fa-search white"></i></a><a id="btnDynamicGridShowAll" onclick="javascript:DynamicGridShowAll();"
                        class="btn btn-primary btn-sm heading-gap-big tiny-rightmargin hide"><%=GetGlobalResourceObject("DynamicGridResource", "reset")%></a>
                </div>
            </div>

        </div>
        <p id="spnDynamicGridSearchError" class="text-danger font-small pull-xs-left p-l-1 m-b-0 push-up col-xs-12"></p>
    </fieldset>
    <fieldset id="divDynamicGridTableHeader" style="margin-bottom: 1px;">
        <div id="divHeaderPrevNextButton" class="pull-xs-right btn-group hide">
            <a id="headerPrevButton" class="btn btn-default btn-sm pull-xs-left"><i class="fa fa-chevron-left tiny-rightmargin font-small"></i><%=GetGlobalResourceObject("DynamicGridResource", "previousDay")%></a> <a id="headerNextButton" class="btn btn-default btn-sm pull-xs-left">
                <%=GetGlobalResourceObject("DynamicGridResource", "nextDay")%><i class="fa fa-chevron-right tiny-leftmargin font-small"></i></a>
        </div>
        <div id="divHeaderFirstLine" class="col-xs-12 col-lg-2 push-up hide">
            <hr style="border-top: 2px solid #CCCCCC;" />
        </div>
        <div id="divDynamicGridTableHeaderInfo" class="col-xs-12 col-xl-4 bold p-l-0 cal-date">
            <span id="spnHeaderCalendarIcon" class="fa fa-calendar blue font-bigger cursor-pointer absolute hide"></span>
            <span id="spnDynamicGridTableHeader" class="blue font-big tiny-leftmargin"></span>
            <span id="spnDynamicGridTotalRecords" class="black font-small tiny-leftmargin">[ <%=GetGlobalResourceObject("DynamicGridResource", "totalRecords")%> : <span id="spnTotalRecords"></span> ]</span>
        </div>
       
        <div id="divHeaderSecondLine" class="col-xs-12 col-lg-2 push-up hide">
            <hr style="border-top: 2px solid #CCCCCC;" />
        </div>
        <div id="divColumnAndGroupBy" class="pull-xs-right push-up">
        </div>
        <div data-bind="visible: DisplayFieldList().length > 0 || GroupFieldList().length > 0 || FilterFieldExists" class="relative pull-xs-right medium-rightmargin">
            <i drpsavesetting="true" class="fa fa-save blue tiny-rightmargin font-bigger dropdown-toggle cursor-pointer pover" data-content="Save Settings" data-placement="top"></i>
            <div class="absolute col-xs-12 p-x-0 dropdown-menu hide" style="z-index: 9; left: -97px; min-width: 120px !important;">
                <div class="arrow-up" style="left: 95px;"></div>
                <ul class="p-a-0 m-b-0" style="list-style: none; overflow-y: auto; max-height: 350px; overflow-x: hidden;">
                    <li onclick="javascript:SaveUserView(true);" class="cursor-pointer">
                        <label class="font-small push-down full-width p-l-1">
                            <%=GetGlobalResourceObject("DynamicGridResource", "save")%>
                        </label>
                    </li>
                    <li onclick="javascript:ShowSaveUserViewModel();" class="cursor-pointer">
                        <label class="font-small push-down full-width p-l-1">
                            <%=GetGlobalResourceObject("DynamicGridResource", "saveAs")%>
                        </label>
                    </li>
                </ul>
            </div>
        </div>
        <div data-bind="visible: DisplayFieldList().length > 0" class="relative pull-xs-right medium-rightmargin">
            <i class="fa fa-cog blue tiny-rightmargin font-bigger dropdown-toggle cursor-pointer pover" data-content="Select Columns" data-placement="top"></i>
            <div class="absolute col-xs-12 p-x-0 dropdown-menu hide" style="z-index: 9; left: -140px; min-width: 220px !important;">
                <div class="arrow-up" style="left: 139px;"></div>
                <ul id="ulColumnOption" data-bind="foreach: DisplayFieldList" class="p-a-0 m-b-0" style="list-style: none; overflow-y: auto; max-height: 350px; overflow-x: hidden;">
                    <li data-bind="click: function () { SelectDisplayColumn($data); }, attr: { fieldid: FieldID }" class="cursor-pointer">
                        <label class="font-small push-down full-width">
                            <span><i class="fa fa-arrows gray v-icon tiny-leftmargin" style="cursor:move;"></i><i data-bind="attr: { class: SelectedClass }"></i></span><span data-bind="text: $data.DisplayName"></span>
                        </label>
                    </li>
                </ul>
                <a class="btn btn-mini btn-success pull-xs-right medium-rightmargin push-down" onclick="javascript: ApplyDisplayAndGroupColumnSelection(true,false,true,this);">
                    <i class="fa fa-check tiny-rightmargin"></i><%=GetGlobalResourceObject("DynamicGridResource", "apply")%></a>
            </div>
        </div>
        <div data-bind="visible: GroupFieldList().length > 0" class="relative pull-xs-right medium-rightmargin">
            <i class="fa fa-sitemap blue tiny-rightmargin font-bigger dropdown-toggle cursor-pointer pover" data-content="Group By" data-placement="top"></i>
            <div class="absolute col-xs-12 p-x-0 dropdown-menu hide" style="z-index: 9; left: -140px; min-width: 160px;">
                <div class="arrow-up" style="left: 139px;"></div>
                <ul data-bind="foreach: GroupFieldList" class="p-a-0 m-b-0" style="list-style: none; overflow-y: auto; max-height: 200px; overflow-x: hidden;">
                    <li data-bind="click: function () { SelectDisplayColumn($data); }" class="cursor-pointer">
                        <label class="font-small push-down full-width">
                            <span><i data-bind="attr: { class: SelectedClass }"></i></span><span data-bind="text: $data.DisplayName"></span>
                        </label>
                    </li>
                </ul>
                <a class="btn btn-mini btn-success pull-xs-right medium-rightmargin push-down" onclick="javascript: ApplyDisplayAndGroupColumnSelection(false,true,true,this);">
                    <i class="fa fa-check tiny-rightmargin"></i><%=GetGlobalResourceObject("DynamicGridResource", "apply")%></a>
            </div>
        </div>
        <div id="divDynamicGridExcelDownload" class="relative pull-xs-right medium-rightmargin">
            <button id="btnDynamicGridExcelDownload" onclick="javascript:DynamicGridExcelDownload();return false;" class="fa fa-download blue tiny-rightmargin font-bigger cursor-pointer pover"
                style="border: 0px; padding: 0px; background-color: transparent;" data-content="Download" data-placement="top">
            </button>
            <div id="divDynamicGridExcelDownloadProgress" class="spinner-rectangle pull-xs-left push-up hide"></div>
        </div>
        <div id="divDynamicGridRefresh" class="relative pull-xs-right medium-rightmargin">
            <i id="iconDynamicGridRefresh" onclick="javascript:ReLoadGridContent();" class="fa fa fa-refresh blue tiny-rightmargin font-bigger cursor-pointer pover" data-content="Refresh" data-placement="top"></i>
        </div>
        <div data-bind="visible: UserViewInfoList().length > 1 ? true : false" class="relative pull-xs-right rightmargin">
            <label data-bind="text: SelectedViewName" class="blue tiny-rightmargin dropdown-toggle cursor-pointer m-b-0 tiny-padding-left bold pover user-view " data-content="Select Custom View" data-placement="top"></label>
            <div class="absolute col-xs-12 p-a-0 dropdown-menu hide" style="z-index: 9; overflow-y: auto; max-height: 200px; overflow-x: hidden; left: -20px; min-width: 160px;">
                <ul data-bind="foreach: UserViewInfoList" class="p-a-0" style="list-style: none;">
                    <li>
                        <label class="font-small push-down col-xs-10 cursor-pointer drp-close" data-bind="click: function () { ChangeUserView($data.ViewID); }">
                            <span data-bind="text: $data.ViewName" class="tiny-leftmargin"></span>

                        </label>
                        <i data-bind="attr: GetUserViewDeleteAttributes($data)"></i>
                    </li>
                </ul>
            </div>
        </div>
    </fieldset>
    <div class="table-responsive">
        <div id="divDynamicGridProgress" class="spinner-circle-big hide">
        </div>
        <table id="tblDynamicGrid" class="table nobox-shadow noborder-radius m-b-0  main-table"
            data-bind="css: (PageDisplayMode != 'calendar' ? 'table-bordered' : '') ">
            <thead targetthead="thDynamicGrid" class="theadpositionfixed">
                <tr data-bind="foreach: TableHeaderFieldList">
                    <th data-bind="attr: GetDynamicGridTableHeaderColumnAttributes($data)" class=" fixed-side nowrap">
                        <span data-bind="text: DisplayName"></span><i data-bind="attr: { id: 'thicon_' + $data.FieldID, thiconfieldid: FieldID }"
                            class="tiny-leftmargin cursor-pointer fa"></i>
                    </th>
                </tr>
            </thead>
            <div class="absolute float-scroll">
                <div id="floatScroll" class="float-scroll-div"></div>
            </div>
            <tbody id="tbDynamicGrid" data-bind="foreach: TableBodyContent" targettbody="tdGridDynamic" class="tbodypositionfixed">
                <tr data-bind="foreach: $parent.TableHeaderFieldList, attr: GetDynamicGridTableRowAttributes($data, $index())">
                    <td class="fixed-side"  data-bind="attr: GetDynamicGridTableColumnAttributes($parent, $index(), $data.FieldIdentifier, $data.HasCustomAttribute), visible: ($parent.IsGroupRow && $index() > 0) ? false : true">
                        <span data-bind="html: GetDyanmicGridContent($parent, $parentContext.$index(), $data, $index()), attr: GetDynamicGridDataAttributes($data, $parent.IsGroupRow)"></span>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td data-bind="attr: { colspan: TdDynamicGridPagerSpan }">
                        <div class="pagination text-md-center m-a-0 col-xs-12 " id="divDynamicGridPager">
                        </div>
                    </td>
                </tr>
            </tfoot>
        </table>
    </div>
    <fieldset id="divDayViewFooter" class="heading-gap hide">
        <div class="col-xs-12 col-lg-2 push-up">
            <hr style="border-top: 2px solid #CCCCCC;" />
        </div>
        <div class="col-xs-12 bold p-l-0 col-lg-3 cal-date">
            <span id="spnDynamicGridTableFooter" class="blue font-big"></span>
        </div>
        <div class="col-xs-12 col-lg-2 push-up">
            <hr style="border-top: 2px solid #CCCCCC;" />
        </div>
        <div class="pull-xs-right btn-group">
            <a id="footerPrevButton" class="btn btn-default btn-sm pull-xs-left"><i class="fa fa-chevron-left tiny-rightmargin font-small"></i><%=GetGlobalResourceObject("DynamicGridResource", "previousDay")%></a> <a id="footerNextButton" class="btn btn-default btn-sm pull-xs-left">
                <%=GetGlobalResourceObject("DynamicGridResource", "nextDay")%><i class="fa fa-chevron-right tiny-leftmargin font-small"></i></a>
        </div>
    </fieldset>

    <div class="small-popup">
        <div id="divDynamicGridMessageModel">
            <div>
                <p id="dynamicGridModelConfirmMessage" class="red">
                </p>
            </div>
        </div>
    </div>
    <div id="saveUserViewModel" data-backdrop="static" data-keyboard="false" class="modal fade in">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-body p-b-0">
                    <fieldset>
                        <label class="form-control-label pull-xs-left">
                            <%=GetGlobalResourceObject("DynamicGridResource", "enterViewName")%></label>
                        <input id="txtUserViewName" type="text" class="form-control-sm col-xs-12" maxlength="30" />

                    </fieldset>
                    <fieldset id="divShareable" runat="server" enableviewstate="false">
                        <label onclick="javascript:ShareableViewClick(this);return false;" class="tiny-leftmargin cursor-pointer"><i id="iconShareableView" class="fa fa-check-square font-big tiny-rightmargin i-opacity text-success"></i><%=GetGlobalResourceObject("DynamicGridResource", "shareView")%></label>
                    </fieldset>

                    <p id="spnSaveSaveGridViewMessage" class="red medium-leftmargin m-b-0">
                    </p>
                </div>
                <div class="modal-footer">
                    <input type="button" id="btnSaveUserView" class="btn btn-sm btn-success" value="Save"
                        onclick="SaveUserView(false); return false;" />
                    <input type="button" id="btnCloseSaveUserViewModel" class="btn btn-sm btn-cancel"
                        value="Cancel" onclick="CloseSaveUserViewModel(); return false;" />
                </div>
            </div>
        </div>
    </div>
</section>
