jQuery(document).ready(function () {
    jQuery(window).click(function (e) {
        if (jQuery(e.target).parents(".drpdownbody").length === 0) {
            if (jQuery(".drpdownbody").is(':visible')) {
                jQuery(".drpdownbody").removeClass("show");
                jQuery('.functiondropdown').find('i').addClass('fa-caret-down').removeClass('fa-caret-up').addClass("i-opacity");
            }
        }
    });
    jQuery(".drpdownbody").find('.drpDownList:gt(0)').slideUp();
    jQuery(".drpdownbody").hide();
    //Toggle dropdown Lists
    jQuery('.functiondropdown').click(function (e) {
        var dropDown = jQuery(this).siblings(".drpdownbody");
        var iconToggle = jQuery(this).find(".icontag");
        e.stopPropagation();
        if (jQuery(".drpdownbody").not(dropDown).hasClass("show")) {
            jQuery(".searchField").addClass("input-focus");
            jQuery(".drpdownbody").removeClass("show");
            jQuery('.functiondropdown').find('i').addClass('fa-caret-down').removeClass('fa-caret-up').addClass("i-opacity");
            jQuery(this).siblings(".drpdownbody").toggleClass("show");
            jQuery(iconToggle).addClass('fa-caret-up').removeClass('fa-caret-down').removeClass("i-opacity");
        } else {
            jQuery(this).siblings(".drpdownbody").toggleClass("show");
            jQuery(".searchField").addClass("input-focus");
            if (jQuery(iconToggle).hasClass('fa-caret-down')) {
                jQuery(iconToggle).addClass('fa-caret-up').removeClass('fa-caret-down').removeClass("i-opacity");
            } else {
                jQuery(iconToggle).removeClass('fa-caret-up').addClass('fa-caret-down').addClass("i-opacity");
            }
        }
        //text ellipsis
        var IsTrue = jQuery(this).parent('div.col-xs-2');
        if (IsTrue.length === 1) {
            jQuery(this).next('.drpdownbody').find('ul li span label').css({
                'text-overflow': 'ellipsis',
                'max-width': '80%',
                'overflow': ' hidden',
                'white-space': 'nowrap',
                'margin-bottom': '0px'
            });
        }

        //padding-left for child element
        var j = 0, padding;
        jQuery(this).next('.drpdownbody').find('ul').each(function (i) {
            var parentul = $(this).parents('ul');
            if (parentul.length < 2) {
                j = 0;
            }
            j++;
            if (jQuery(this).find('span').val() != undefined && i > 0) {
                jQuery(this).find('span').css('padding-left', j * 8 + 'px');
                var nestedUl = jQuery(this).find('ul >li');
                if (nestedUl.length > 1) {
                    j++;
                    jQuery(nestedUl).find('span').css('padding-left', j * 8 + 'px');                    
                    //dynamic label width
                    padding =j *2;
                    childLabel = jQuery(nestedUl).find('span > label');
                    jQuery(childLabel).each(function () {
                        jQuery(this).css({
                            'max-width': 'calc(75% - ' + padding + 'px)'
                        })
                    });                    
                }
            } else {
                j--;
            }
        });
        //click event binding
        jQuery('.drpdownbody span').off('click');
        jQuery('.drpdownbody input[type="checkbox"]').off('click');
        jQuery('.fa-drop-icon').off('click');

        jQuery('.drpdownbody span').on('click', function () {
            //event.stopImmediatePropagation();
            var input = jQuery(this).find('input');
            All(input);
        });
        jQuery('.drpdownbody input[type="checkbox"]').on('click', function () {
            event.stopImmediatePropagation();
            var input = jQuery(this);
            //based on browser
            var ua = window.navigator.userAgent;
            var isIE = /MSIE|Trident/.test(ua);
            if (isIE) {
                //var ulnum = jQuery(this).closest('.drpdownbody').find('ul').length;
                //if (ulnum <= 1) {
                //event.stopPropagation();
                    if (jQuery(input).prop('checked') == true) {
                        jQuery(input).prop('checked', false);
                    } else {
                        jQuery(input).prop('checked', true);
                    }
                //}
            }
            All(input);
        });
        jQuery('.fa-drop-icon').on('click', function () {
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
                jQuery(this).closest('span').next('ul').css({ 'background-color': '#fff' });
            }
        });
    });
});
//checkBox
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
function All(inputElement) {
    if (jQuery(inputElement).prop('checked') == true) {
        jQuery(inputElement).prop('checked', false);
    } else {
        jQuery(inputElement).prop('checked', true);
    }
    //Check / unCheck elements
    if (jQuery(inputElement).is(':checked')) {
        if (jQuery(inputElement).closest('span').next('ul').length > 0) {
            jQuery(inputElement).closest('span').next('ul').find('input').prop('checked', true);
        }
    } else {
        jQuery(inputElement).prop('checked', false);
        if (jQuery(inputElement).closest('span').next('ul').length > 0) {
            jQuery(inputElement).closest('span').next('ul').find('input').prop('checked', false);
        }
    }
    var elm = jQuery(inputElement);
    Uncheck(elm);
    //append elements
    var clk = jQuery(inputElement).closest('.drpdownbody').prev('div').find('.appendSelectedElements');
    AppendElements(clk);
    //to retain value
    if (typeof SelectItem == "function") {
        SelectItem(inputElement);
    }
    if (typeof LocationChange == "function" && jQuery(inputElement).closest('#ulFLoctionMultiSelect').length == 1){
        WorkOrderResourceViewCustom();
    }
    var drpdownbodyUl = jQuery(inputElement).closest('.drpdownbody').find('> .drpDownList');
    ApplyCss(drpdownbodyUl);
}
// Append Text of selected lists.
function AppendElements(input) {
    if (input) {
        var text = "";
        var ele = jQuery(input).closest('div').next('.drpdownbody').find('input:checked').parent('span');
        var ParentDiv = jQuery(input).parent('div');
        jQuery(ele).each(function () {
            text += jQuery(this).text() + ',';
        });
        if (text != "") {
            var name = text.replace(/,\s*$/, "");
            jQuery(ParentDiv).find('.appendSelectedElements, .existingLabel').hide();
            jQuery(ParentDiv).find('label').not('.appendSelectedElements, .existingLabel').remove();
            jQuery(ParentDiv).append('<div  class="pover" style="width:85%;" data-placement="right" data-toggle="popover"><label style="text-overflow: ellipsis;display: inline-block;width: 94%;white-space: nowrap;overflow: hidden !important;" onmouseover="ShowSelectedElements(this);return false;" onmouseout="HideSelectedElements(this); return false; ">' + name + '</label> </div><div class="pop-remarkcontent" style="display: none;"><div class="content" id= "divSelectedElements" ></div > </div >')
        } else {
            jQuery(ParentDiv).find('label').not('.appendSelectedElements, .existingLabel').remove();
            jQuery(ParentDiv).find('.appendSelectedElements').show();
        }
    }
    else {
        jQuery('.functiondropdown').find('label').not('.appendSelectedElements, .existingLabel').remove();
        jQuery('.functiondropdown').find('.appendSelectedElements').show();
    }
}
// Apply CSS for Selected elements
function ApplyCss(ParentUl) {
    jQuery(ParentUl).find('input').each(function () {
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
        jQuery(this).find('input[type = "text"]').val('');
        jQuery(this).find('ul:gt(0)').slideUp();
        jQuery(this).find('ul:gt(0)').each(function () {
            jQuery(this).prev('span').find('.fa-drop-icon').removeClass('fa-chevron-circle-up i-opacity').addClass('fa-chevron-circle-down');
        });
        jQuery(this).find('li').show();
        jQuery(this).find('.no-results-found').hide();
        jQuery(this).find('> .ulField').css({
            'border': '1px solid #ccc',
            'border-top-left-radius': '6px',
            'border-top-right-radius': '6px'
        });
    });
}
function ShowSelectedElements(ctlInfo) {
    if (ctlInfo.innerText.length > 0) {
        jQuery("#divSelectedElements").text(ctlInfo.innerText);
    }
    jQuery(ctlInfo).popover({
        html: true,
        trigger: "manual",
        placement: 'right',
        template: '<div class="popover custom"><div class="popover-content"></div></div>',
        content: function () {
            return jQuery('.pop-remarkcontent').html();
        }
    });
    jQuery(ctlInfo).popover("show");
    var posX = event.clientX;
    var posY = jQuery(ctlInfo).offset().top;
    jQuery('.custom').css({
        'left': posX + 10,
        'top': posY,
        'transform': 'translateY(0)'
    });
}
function HideSelectedElements(ctlInfo) {
    jQuery(ctlInfo).popover("hide");
}
function KeyUpEle(ele) {
    var Ulsearch = jQuery(ele).parent('div').nextAll('.ulField');
    var UlLength = jQuery(Ulsearch).find('ul');
    var valThis = jQuery(ele).val().toUpperCase();
    var noresult = 0;
    if (valThis == "") {
        jQuery(Ulsearch).find('li').show();
        noresult = 1;
        jQuery(ele).parent().next(".divider-border").find(".no-results-found").remove();
        jQuery(ele).parents('.drpdownbody').find('.ulField').show();
        jQuery(ele).parents().prev().find(".drpdownbody").css({ "height": "" });
        jQuery(Ulsearch).find('ul').hide();
        jQuery(Ulsearch).find(".fa-drop-icon").removeClass('fa-chevron-circle-up i-opacity').addClass('fa-chevron-circle-down');
    } else {
        jQuery(Ulsearch).find('ul').show();

        jQuery(Ulsearch).find('> li').each(function () {
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
    } else if (noresult > 0) {
        jQuery(ele).parents('.drpdownbody').find('> .ulField').css({
            'border': '1px solid #ccc',
            'border-top-left-radius': '6px',
            'border-top-right-radius': '6px'
        });
    }
    jQuery(Ulsearch).find('span:visible').each(function () {
        var nextUl = jQuery(this).parent('li').find('ul span:visible').length;
        if (nextUl > 0) {
            jQuery(this).find(".fa-drop-icon").addClass('fa-chevron-circle-up i-opacity').removeClass('fa-chevron-circle-down');
        } else {
            jQuery(this).find(".fa-drop-icon").removeClass('fa-chevron-circle-up i-opacity').addClass('fa-chevron-circle-down');
        }
    });
}