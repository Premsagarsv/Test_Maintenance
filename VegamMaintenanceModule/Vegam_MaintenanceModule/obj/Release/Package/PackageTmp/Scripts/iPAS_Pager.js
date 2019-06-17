function pageIndexClick(pagerData) {
    currentPage = jQuery.trim(jQuery("#" + pagerData.CurrentPageID).val());
    if (pagerData.Type == "Next") {
        if (currentPage < 5)
            currentPage = 5;
        else
            currentPage = parseInt(currentPage) + 3;
    }
    else if (pagerData.Type == "Prev") {
        if (currentPage >= 3)
            currentPage = parseInt(currentPage) - 3;
        else
            currentPage = 0;
    }
    else {
        currentPage = pagerData.PageIndex;
    }

    jQuery("#" + pagerData.CurrentPageID).val(currentPage);
    pagerData.CurrentPage = parseInt(currentPage);
    pagerData.PageIndex = parseInt(pagerData.PageSize) * parseInt(currentPage) + 1;
    window[pagerData.SelectMethod](pagerData);
}




