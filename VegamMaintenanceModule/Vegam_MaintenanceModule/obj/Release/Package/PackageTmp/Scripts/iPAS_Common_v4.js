
function checkTextAreaMaxLength(textBox, e, length) {

    var mLen = textBox["MaxLength"];
    if (mLen == null)
        mLen = length;

    var maxLength = parseInt(mLen);
    if ((e.keyCode == 65 && e.ctrlKey === true) || (e.keyCode == 86 && e.ctrlKey === true) || e.keyCode == 17 || e.keyCode == 8 || e.keyCode == 46 || e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40)
        return true;
    if (textBox.value.length >= maxLength) {
        return false;
    }
}

function limitnofotext(reftxt, charlength) {
    if (reftxt.value.length > charlength) {
        reftxt.value = reftxt.value.substring(0, charlength);
    }
}

function checkInteger(textBox) {
    if (textBox.value.match(/[^0-9]/g)) {
        textBox.value = textBox.value.replace(/[^0-9]/g, ''); //^\d+\.\d{0,3}$
        return false;
    }
    else {
        return true;
    }
}

function checkIntegerOnBlur(textBox) {
    if (textBox.value.match(/[^0-9]/g)) {
        textBox.value = textBox.value.replace(/[^0-9]/g, ''); //^\d+\.\d{0,3}$
    }
}

function checkDecimal(textBox) {
    if (textBox.value.match(/[^0-9.]/g)) {
        textBox.value = textBox.value.replace(/[^0-9.]/g, ''); //^\d+\.\d{0,3}$
        return false;
    }
    else {
        return true;
    }
}

function CheckDecimalOnBlur(textBox) {
    if (textBox.value.match(/[^0-9.]/g)) {
        textBox.value = textBox.value.replace(/[^0-9.]/g, ''); //^\d+\.\d{0,3}$
    }
}

function isNumberDecKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46)
        return false;

    return true;

}
function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;

    return true;
}

function isDecimalCheck(evt, element) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    if (charCode != 45) {//for not allowing - entry
        if ((charCode != 45 || jQuery(element).val().indexOf('-') != -1) && (charCode != 46 || jQuery(element).val().indexOf('.') != -1) && (charCode < 48 || charCode > 57))
            return false;
        else if (charCode == 45) {
            // Set minus character at the beginning of the line
            evt.preventDefault();
            jQuery(element).val(String.fromCharCode(charCode) + jQuery(element).val());
            return true;
        }
        else {
            var dotPosition = jQuery(element).val().indexOf(".");
            var cursorPosition = jQuery(element).val().slice(0, element.selectionStart).length;
            if (dotPosition != -1 && cursorPosition > dotPosition) {
                var splittedValue = (jQuery(element).val()).split(".");
                if (splittedValue[1].length > 2) {
                    return false;
                }
            }
            return true;
        }
    }
    else
        return false;
}

function isDecimalCheckWithNegativeValue(evt, element) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    if (charCode == 45 && jQuery(element).val().indexOf('-') != -1) // charcode 45(-) and allow only one (-)
        return false;
    else if (charCode == 46 && jQuery(element).val().indexOf('.') != -1) // charcode 46(.) and allow only one (.)
        return false;
    else if ((charCode != 45 && charCode != 46) && (charCode < 48 || charCode > 57))
        return false;
    else {
        var dotPosition = jQuery(element).val().indexOf(".");
        var cursorPosition = jQuery(element).val().slice(0, element.selectionStart).length;
        if (charCode == 45) //allow negative sign at begining only not in middle
        {
            evt.preventDefault();
            jQuery(element).val(String.fromCharCode(charCode) + jQuery(element).val());
            return true;
        }
        else if (dotPosition != -1 && cursorPosition > dotPosition) {
            var splittedValue = (jQuery(element).val()).split(".");
            if (splittedValue[1].length > 2) {
                return false;
            }
        }
        return true;
    }
}


function ValidateAlpha(evt) {
    var keyCode = (evt.which) ? evt.which : evt.keyCode
    if ((keyCode < 65 || keyCode > 90) && (keyCode < 97 || keyCode > 122) && keyCode != 32)
        return false;
    return true;
}

function isNumberDecKeyWithMaxLength(evt, precisionLength, scaleLength) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46)
        return false;

    return true;
}

function ValidateDecimalInput(ctrl, event, maxLength, maxPrecision) {
    var s = "^((?=.*\\d)\\d{1," + maxLength + "}(\\.\\d{0," + maxPrecision + "}?)?)$";
    var regex = new RegExp(s);
    var key = String.fromCharCode(event.charCode);
    var value = jQuery(ctrl).val().trim();
    var init = value.substring(0, event.target.selectionStart);
    var substr = value.substring(event.target.selectionStart);
    var final = init + key + substr;
    if (!regex.test(final)) {
        event.preventDefault();
        return false;
    }
}


function ValidateNumberAndText(evt) {
    var keyCode = (evt.which) ? evt.which : evt.keyCode
    if ((keyCode < 48 || keyCode > 57) && (keyCode < 65 || keyCode > 90) && (keyCode < 97 || keyCode > 122) && keyCode != 32)
        return false;
    return true;
}

function htmlEncode(value) {
    return jQuery('<div/>').text(value).html();
}

function htmlDecode(value) {
    return $('<div/>').html(value).text();
}

function ConvertDBToPlantDateFormat(siteDateFormat, curretdate) {
    var year = curretdate.substring(0, 4);
    var month = curretdate.substring(4, 6);
    var day = curretdate.substring(6, 8);
    var retDate = jQuery.datepicker.formatDate(siteDateFormat.replace("MM", "mm").replace("yyyy", "yy"), new Date(year, month - 1, day));
    return retDate;
}