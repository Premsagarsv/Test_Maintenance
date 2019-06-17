jQuery.SiteNameNameSpace = jQuery.SiteNameNameSpace || {};
jQuery.SiteNameNameSpace.UserID = 0;
jQuery.SiteNameNameSpace.WebServicePath = "";


function GetAllSites(ctl, userID, webServicePath) {
    jQuery.SiteNameNameSpace.UserID = userID;
    jQuery.SiteNameNameSpace.WebServicePath = webServicePath;
    jQuery("#btnRedirectSite").toggleClass("fa-chevron-down fa-chevron-up");
    if (jQuery(window).width() < 767) {
        $(".table-green-box-heading>span").removeClass("font-bigger").addClass("bold");
        jQuery("#ulSite").addClass("nopadding tiny-leftmargin");
        if (jQuery('#divManagaeSite').css("margin-right") == "200px") {
            jQuery('.pollSlider').animate({ "margin-right": '-=200' });
            jQuery('#divManagaeSite').animate({ "margin-right": '-=200' });
        }
        else {
            jQuery('.pollSlider').animate({ "margin-right": '+=200' });
            jQuery('#divManagaeSite').animate({ "margin-right": '+=200' });
        }
    }
    else {
        if (jQuery('#divManagaeSite').css("margin-right") == "400px") {
            jQuery('.pollSlider').animate({ "margin-right": '-=400' });
            jQuery('#divManagaeSite').animate({ "margin-right": '-=400' });
        }
        else {
            jQuery('.pollSlider').animate({ "margin-right": '+=400' });
            jQuery('#divManagaeSite').animate({ "margin-right": '+=400' });
        }
    }
    jQuery.ajax({
        type: "POST",
        url: jQuery.SiteNameNameSpace.WebServicePath + "/Vegam_PlantSettingService.asmx/GetAllSites",
        data: JSON.stringify({ userID: jQuery.SiteNameNameSpace.UserID }),
        contentType: "application/json; charset=utf-8",
        dataType: "xml",
        success: function (xml) {
            if ((jQuery(xml).find("HTMLDataList").text() != "")) {
                var siteNames = JSON.parse(jQuery(xml).find("HTMLDataList").text());
                var htmlData = "";
                for (var index = 0; index < siteNames.CompanySites.length > 0; index++) {
                    htmlData = htmlData + " <li class='bottom-gap font-big'><a id='liSite_" + siteNames.CompanySites[index].SiteID + "' onclick='UpdateDefaultSiteAndRedirect(" + siteNames.CompanySites[index].SiteID + ");return false;'>" + siteNames.CompanySites[index].SiteName + "</a></li>";
                }
                jQuery("#ulSite").html(htmlData);

            }
        },
        error: function (request, error) {
        }

    })
}

function UpdateDefaultSiteAndRedirect(siteID) {
    var queryParameters = {};
    queryString = location.search.substring(1);
    regExp = /([^&=]+)=([^&]*)/g;
    matchString = '';

    // Creates a map with the query string parameters
    while (matchString = regExp.exec(queryString)) {
        queryParameters[decodeURIComponent(matchString[1])] = decodeURIComponent(matchString[2]);
    }
    queryParameters['id'] = siteID.toString();

    var basicParam = {};
    basicParam.UserID = jQuery.SiteNameNameSpace.UserID;
    basicParam.SiteID = siteID;

    jQuery.ajax({
        type: "POST",
        url: jQuery.SiteNameNameSpace.WebServicePath + "/Vegam_PlantSettingService.asmx/UpdateUserDefaultSite",
        data: JSON.stringify({ basicParam: basicParam }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if (json.d > 0) {
                jQuery('.pollSlider').animate({ "margin-right": '-=400' });
                jQuery('#divManagaeSite').animate({ "margin-right": '-=400' });
                location.search = $.param(queryParameters);;

            }
        },
        error: function (request, error) {

        }
    });
}
//Click on edit,scroll to the edit section in mobile devices
jQuery(window).load(function () {
    jQuery(".scroll-edit").on('click', function () {
        if (window.innerWidth < 767) {
            jQuery("body").animate({
                scrollTop: $("#editBlock").offset().top - 75
            },
                '10000');
        }
    });

});
QueryStr = {};

jQuery(document).ready(function () {
    //Toggle Button
    $(".toggle-button-mydesign").click(function () {
        $(".toggle-ul-ipas").slideToggle();
        return false;
    });
    $(".super-admin-click").click(function () {
        $(".super-admin-toggle").slideToggle("fast");
        return false;
    });
    //toggle button end
    //User-Dropdown Functionlaity
    jQuery(".super-admin-toggle").mouseleave(function () {
        jQuery(this).css("display", "none");
    });
    //focus on index tiles
    if ($(window).width() > 767) {
        jQuery(".box").hover(function () {
            jQuery(this).closest(".hbox").toggleClass("index-padding");
        });
    }

    //passing siteID for Breadcrumbs
    checkScrollBar();
    jQuery(".small-popup").addClass("hide");
    queryTxt = "";
    sid = "?id=" + jQuery.QueryString["id"];
    QueryStr = { id: sid };
    function queryAppend() {
        for (x in QueryStr) {
            queryTxt += QueryStr[x] + "";
        }
    }
    jQuery("#SiteMap1>span>a").click(passSiteId);
    function passSiteId() {
        queryAppend();
        //this.href = this.href + queryTxt;
        if (this.href.toLowerCase().indexOf("id=") >= 0) { this.href = this.href; } else { this.href = this.href + queryTxt; }
    }

    //code for back-button        
    jQuery('#lnkAdminTab,#A1').click(function () {
        var isSetDefault = jQuery('#lnkAdminTab,#A1').attr("isSetDefault"); //set isSetDefault=false -if someone want to specify page and filter value.
        if (isSetDefault != null || isSetDefault != undefined) {
            if (isSetDefault.toUpperCase() == "FALSE") {
                window.location.href = jQuery('#lnkAdminTab,#A1').attr("href");
            }
            else {
                parent.history.back();
                return false;
            }
        }
        else {
            parent.history.back();
            return false;
        }
    });

    jQuery(".search-legend").click(function () {
        jQuery(".search-legend:contains('Download Upload')").toggleClass("m-b-0");
        jQuery(this).siblings(".btn").toggleClass("add-btn");
        jQuery(this).siblings("span").toggleClass("hide");
        jQuery(this).siblings("div").toggleClass("hide");
        jQuery(this).parent("fieldset").toggleClass("info-block");
        jQuery(this).children("i").toggleClass("fa-caret-right fa-caret-down");
        jQuery("legend").hasClass("search-legend");
        {
            jQuery(this).parent("fieldset").toggleClass("bottom-gap");
        }
    });

    /*ui_datapicker Start*/
    jQuery('.modal').on('show.bs.modal', function (e) {
        var datePicker = document.getElementById('ui-datepicker-div');
        if (datePicker) {
            e.delegateTarget.appendChild(datePicker);
        }
    });

    jQuery('.modal').on('hide.bs.modal', function (e) {
        var datePicker = document.getElementById('ui-datepicker-div');
        if (datePicker) {
            jQuery("body").append(datePicker);
        }
    });
    /*ui_datapicker End*/
});
jQuery(document).ajaxStop(function () {
    jQuery(".n-icon-b").show();
    checkScrollBar();
});

//to show and hide the top and bottom scroll icons
function checkScrollBar() {
    jQuery(".n-icon2").hide();
    if ($("body").height() > $(window).height()) {
        jQuery(window).scroll(function () {
            if (jQuery(window).scrollTop() > 0) {
                jQuery(".n-icon2").show();
                jQuery(".n-icon-b").show();
            } else {
                jQuery(".n-icon2").hide();
                jQuery(".n-icon-b").show();
            }
            if (document.documentElement.clientHeight +
                $(document).scrollTop() >= document.body.offsetHeight) {
                jQuery(".n-icon-b").hide();
            }
        });
    }
    else {
        jQuery(".n-icon-b").hide();
    }
}

