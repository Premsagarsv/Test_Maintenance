﻿jQuery(document).ready(function () {
    jQuery(window).click(function (e) {
        if (jQuery(e.target).parents(".drpdownbody").length === 0) {
            if (jQuery(".drpdownbody").is(':visible')) {
                jQuery(".drpdownbody").removeClass("show");
                jQuery('.functiondropdown').find('i').addClass('fa-caret-down').removeClass('fa-caret-up').addClass("i-opacity");
            }
        }
    });
    jQuery(".drpdownbody").find('ul').not('.drpDownList').hide();
    jQuery(".drpdownbody").hide();
    jQuery('.drpdownbody span').click(function () {   
        var inputElement = jQuery(this).find('input');
        if (jQuery(inputElement).prop('checked') == true) {
            jQuery(inputElement).prop('checked', false).triggerHandler('click');
        } else {
            jQuery(inputElement).prop('checked', true).triggerHandler('click');
        }
        //Check / unCheck elements
        if (jQuery(inputElement).is(':checked')) {
            if (jQuery(this).next('ul').length > 0) {
                jQuery(this).next('ul').find('input').prop('checked', true);
            }
            var elm = jQuery(this);
            Uncheck(elm);
            //append elements
            var clk = jQuery(this).closest('.drpdownbody').prev('div').find('.appendSelectedElements');
            AppendElements(clk);
        } else {
            jQuery(inputElement).prop('checked', false);
            if (jQuery(this).next('ul').length > 0) {
                jQuery(this).next('ul').find('input').prop('checked', false);
            }
            var elm = jQuery(this);
            Uncheck(elm);
            //append elements
            var clk = jQuery(this).closest('.drpdownbody').prev('div').find('.appendSelectedElements');
            AppendElements(clk);
        }
    });
    //Toggle dropdown Lists
    jQuery('.functiondropdown').click(function (e) {       
        var dropDown = jQuery(this).siblings(".drpdownbody");
        var iconToggle = jQuery(this).find(".icontag");
        e.stopPropagation();
        if (jQuery(".drpdownbody").not(dropDown).hasClass("show")) {
            jQuery(".drpdownbody").removeClass("show");
            jQuery('.functiondropdown').find('i').addClass('fa-caret-down').removeClass('fa-caret-up').addClass("i-opacity");
            jQuery(this).siblings(".drpdownbody").toggleClass("show");
            jQuery(iconToggle).addClass('fa-caret-up').removeClass('fa-caret-down').removeClass("i-opacity");
        } else {
            jQuery(this).siblings(".drpdownbody").toggleClass("show");
            if (jQuery(iconToggle).hasClass('fa-caret-down')) {
                jQuery(iconToggle).addClass('fa-caret-up').removeClass('fa-caret-down').removeClass("i-opacity");
            } else {
                jQuery(iconToggle).removeClass('fa-caret-up').addClass('fa-caret-down').addClass("i-opacity");
            }
        }
        //padding-left for child element
        var j = 0;
        jQuery(this).next('.drpdownbody').find('ul').each(function (i) {
            j++;
            if (jQuery(this).find('span').val() != undefined && i >0) {
            jQuery(this).find('span').css('padding-left', j * 8 + 'px');
            } else {
                j--;
            }       
        });
    });
    jQuery('.fa-drop-icon').click(function () {
        event.stopImmediatePropagation();
        var ul = jQuery(this).closest('span').next('ul');
        var nextAllUl = jQuery(this).closest('li').find('ul');
        if (jQuery(ul).is(':hidden')) {
            jQuery(nextAllUl).slideDown('fast');
            jQuery(this).closest('span').next('ul').css({
                'background-color': '#fbfbfb !important',
                'border-top': '1px solid #E4e4e4',
                'border-bottom': '1px solid #E4e4e4'
            });
            jQuery(this).removeClass('fa-chevron-circle-down').addClass('fa-chevron-circle-up i-opacity');
            jQuery(nextAllUl).find('.fa-drop-icon').removeClass('fa-chevron-circle-down').addClass('fa-chevron-circle-up i-opacity');
        } else {
            jQuery(nextAllUl).slideUp('fast');            
            jQuery(this).addClass('fa-chevron-circle-down').removeClass('fa-chevron-circle-up i-opacity');
            jQuery(nextAllUl).find('.fa-drop-icon').removeClass('fa-chevron-circle-down').addClass('fa-chevron-circle-up i-opacity');
            jQuery(this).closest('span').next('ul').css({ 'background-color': '#fff'});
        }
    });
});
// search list elements
function KeyUpEle(ele) {
    var Ulsearch = jQuery(ele).parent('div').nextAll('ul').attr('id');
    var valThis = jQuery(ele).val().toUpperCase();
    var noresult = 0;
    if (valThis == "") {
        jQuery('#' + Ulsearch+ ' li').show();
        noresult = 1;
        jQuery(ele).parent().next(".divider-border").find(".no-results-found").remove();
        jQuery(ele).parents('.drpdownbody').find('.ulField').show();
        jQuery(ele).parents().prev().find(".drpdownbody").css({ "height": "" });
        jQuery('#' + Ulsearch).find('ul').hide();
        jQuery('#' + Ulsearch).find(".fa-drop-icon").removeClass('fa-chevron-circle-up i-opacity').addClass('fa-chevron-circle-down');
    } else {
        jQuery('#' + Ulsearch).find('ul').show();
        
        jQuery('#' + Ulsearch + '> li').each(function () {
            var text = jQuery(this).text().toUpperCase();
            (text.indexOf(valThis) !== -1) ? jQuery(this).show() : jQuery(this).hide();
            var match = text.indexOf(valThis);
            if (match >= 0) {
                jQuery(this).show();
                noresult = 1;
                jQuery(ele).parent().next(".divider-border").find(".no-results-found").remove();
                jQuery(ele).parents().prev().find(".drpdownbody").css({ "height": "" });
            } else {
                jQuery(this).hide();
            }
        });
    };
    if (noresult == 0) {
        jQuery(ele).parent().next(".divider-border").find(".no-results-found").remove();
        jQuery(ele).parent().next(".divider-border").append('<span class="no-results-found col-xs-12 center-align push-down p-a-0" style="font-size:13px; color: #696969;">No results found.</span>');
        jQuery(ele).parents('.drpdownbody').find('.ulField').css('border', 'none');
    }
    if (jQuery(ele).parents('.drpdownbody').find('.ulField span:visible').length == 1) {
        jQuery(ele).parent('div').parent('div').find(".drpDownList").css({
            'border-top-left-radius': '0px',
            'border-top-right-radius': '0px'
        });
    }
    jQuery('#' + Ulsearch).find('span:visible').each(function () {
        var nextUl = jQuery(this).parent('li').find('ul span:visible').length;
        if (nextUl > 0) {
            jQuery(this).find(".fa-drop-icon").addClass('fa-chevron-circle-up i-opacity').removeClass('fa-chevron-circle-down');
        } else {
            jQuery(this).find(".fa-drop-icon").removeClass('fa-chevron-circle-up i-opacity').addClass('fa-chevron-circle-down');

        }
    });
    
}

function Uncheck(thisLi) {
    var selectedLen = jQuery(thisLi).closest('ul').find('> li').find('> span input:checked').length;
    var spanLen = jQuery(thisLi).closest('ul').find('> li').find('> span input').length;
    if (selectedLen == spanLen) {
        jQuery(thisLi).closest('ul').prev('span').find('input').prop('checked', true);
        var parent = jQuery(thisLi);
        CommonChildCheck(parent);
    } else {
        jQuery(thisLi).closest('ul').prev('span').find('input').prop('checked', false);
        var parent = jQuery(thisLi);
        CommonChildCheck(parent);
    }
}
function CommonChildCheck(thisLi) {
    var len1 = jQuery(thisLi).closest('ul').parent('li').closest('ul').find(' > li').find('> span input').length;
    var len2 = jQuery(thisLi).closest('ul').parent('li').closest('ul').find(' > li').find('> span input:checked').length;
    if (len1 || len2 != 0) {
        if (len1 == len2) {
            jQuery(thisLi).closest('ul').parent('li').closest('ul').prev('span').find('input').prop('checked', true);
            var nextParent = jQuery(thisLi).closest('ul').parent('li').closest('ul');
            CommonChildCheck(nextParent);
        } else {
            jQuery(thisLi).closest('ul').parent('li').closest('ul').prev('span').find('input').prop('checked', false);
            var nextParent = jQuery(thisLi).closest('ul').parent('li').closest('ul');
            CommonChildCheck(nextParent);            
        }
    }    
}
// Append Text of selected lists.
function AppendElements(input) {
    if (input) {
        var text = "";
        var ele = jQuery(input).closest('div').next('.drpdownbody').find('input:checked').parent('span');
        var ParentDiv = jQuery(input).parent('div');
        $(ele).each(function () {
            if ($(ele).length == 1) {
                text = $(this).text();
            } else {
                text += $(this).text() + ',';
            }
        });
        if (text != "") {
            var name = text.replace(/,\s*$/, "");
            jQuery(ParentDiv).find('.appendSelectedElements').hide();
            jQuery(ParentDiv).find('label').not('.appendSelectedElements').remove();
            jQuery(ParentDiv).append('<label style="text-overflow: ellipsis;display: inline-block;width: 80%;white-space: nowrap;overflow: hidden !important;">' + name + '</label>')
        } else {
            jQuery(ParentDiv).find('label').not('.appendSelectedElements').remove();
            jQuery(ParentDiv).find('.appendSelectedElements').show();
        }
    }
    else {
        jQuery('.functiondropdown').find('label').not('.appendSelectedElements').remove();
        jQuery('.functiondropdown').find('.appendSelectedElements').show();
    }
}
// Apply CSS for Selected elements    
function ApplyCss(ParentUl) {
    var ParentId = jQuery(ParentUl).attr('id');
    jQuery('#' +ParentId).find('input').each(function () {
        if (jQuery(this).is(':checked')) {
            jQuery(this).addClass('selectedCheckbox');
            if (jQuery(this).closest('li').find('>ul li').length > 0) {
                jQuery(this).parent('span').addClass('selectedParentlist');
            } else {
                jQuery(this).parent('span').addClass('selectedlist');
            }
        } else {
            jQuery(this).removeClass('selectedCheckbox');
            if (jQuery(this).closest('li').find('>ul li').length > 0) {
                jQuery(this).parent('span').removeClass('selectedParentlist');
            } else {
                jQuery(this).parent('span').removeClass('selectedlist');
            }
        }
    });     
}
//Reset Dropdown to initial.
function ResetDropdownCss() {
    jQuery('.drpdownbody').each(function () {
        jQuery(this).find('ul:gt(0)').slideUp();
        jQuery(this).find('ul:gt(0)').each(function () {
            jQuery(this).prev('span').find('.fa-drop-icon').removeClass('fa-chevron-circle-up i-opacity').addClass('fa-chevron-circle-down');
        });
    });
}