jQuery(document).ready(function () {
    window.setInterval(function () {
        circle();
    }, 600);
    jQuery(".spinner-circle-big").html("<span class='loading'>loading...</span>");    
		for(i=1;i<5;i++){
			str = '<div class="rect' + i + '"></div>';
			jQuery(".spinner-rectangle").append(str);
		}
});
function circle() {
    window.setTimeout(function () {
        jQuery(".spinner-circle-big").css({"border-top":" 6px dotted #248ACC","border-right":" 6px dotted #f6f6f6","border-bottom":" 6px dotted #f6f6f6","border-left":" 6px dotted #f6f6f6"});
        jQuery(".spinner-circle-small").css({"border-top":" 3px dotted #248ACC","border-right":" 3px dotted #f6f6f6","border-bottom":" 3px dotted #f6f6f6","border-left":" 3px dotted #f6f6f6"});        
    }, 120);
    window.setTimeout(function () {
        jQuery(".spinner-circle-big").css({"border-top":" 6px dotted #248ACC","border-right":" 6px dotted #248ACC","border-bottom":" 6px dotted #f6f6f6","border-left":" 6px dotted #f6f6f6"}); 
        jQuery(".spinner-circle-small").css({"border-top":" 3px dotted #248ACC","border-right":" 3px dotted #248ACC","border-bottom":" 3px dotted #f6f6f6","border-left":" 3px dotted #f6f6f6"});
        }, 240);
    window.setTimeout(function () {
        jQuery(".spinner-circle-big").css({"border-top":" 6px dotted #f6f6f6","border-right":" 6px dotted #248ACC","border-bottom":" 6px dotted #248ACC","border-left":" 6px dotted #f6f6f6"});
        jQuery(".spinner-circle-small").css({"border-top":" 3px dotted #f6f6f6","border-right":" 3px dotted #248ACC","border-bottom":" 3px dotted #248ACC","border-left":" 3px dotted #f6f6f6"});
       }, 360);
    window.setTimeout(function () {
        jQuery(".spinner-circle-big").css({"border-top":" 6px dotted #f6f6f6","border-right":" 6px dotted #f6f6f6","border-bottom":" 6px dotted #248ACC","border-left":" 6px dotted #248ACC"});
        jQuery(".spinner-circle-small").css({"border-top":" 3px dotted #f6f6f6","border-right":" 3px dotted #f6f6f6","border-bottom":" 3px dotted #248ACC","border-left":" 3px dotted #248ACC"});
        }, 480);
    window.setTimeout(function () {
        jQuery(".spinner-circle-big").css({"border-top":" 6px dotted #f6f6f6","border-right":" 6px dotted #f6f6f6","border-bottom":" 6px dotted #f6f6f6","border-left":" 6px dotted #248ACC"});
        jQuery(".spinner-circle-small").css({"border-top":" 3px dotted #f6f6f6","border-right":" 3px dotted #f6f6f6","border-bottom":" 3px dotted #f6f6f6","border-left":" 3px dotted #248ACC"});
      }, 600);

}	


	
