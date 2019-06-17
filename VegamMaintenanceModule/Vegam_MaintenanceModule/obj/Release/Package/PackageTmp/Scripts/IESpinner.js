jQuery(document).ready(function () {
    window.setInterval(function () {
        sp();
    }, 700);  
});
function sp() {
    window.setTimeout(function () {
        jQuery(".rect1").css("-ms-transform", " scale(1,1.3)");
        jQuery(".rect2").css("-ms-transform", " scale(1,0.5)");
        jQuery(".rect3").css("-ms-transform", " scale(1,0.5)");
        jQuery(".rect4").css("-ms-transform", " scale(1,0.5)");
        jQuery(".rect5").css("-ms-transform", " scale(1,0.5)");
    }, 100);
    window.setTimeout(function () {
        jQuery(".rect1").css("-ms-transform", " scale(1,1.1)");
        jQuery(".rect2").css("-ms-transform", " scale(1,1.3)");
        jQuery(".rect3").css("-ms-transform", " scale(1,0.5)");
        jQuery(".rect4").css("-ms-transform", " scale(1,0.5)");
        jQuery(".rect5").css("-ms-transform", " scale(1,0.5)");
    }, 200);
    window.setTimeout(function () {
        jQuery(".rect1").css("-ms-transform", " scale(1,0.5)");
        jQuery(".rect2").css("-ms-transform", " scale(1,1.1)");
        jQuery(".rect3").css("-ms-transform", " scale(1,1.3)");
        jQuery(".rect4").css("-ms-transform", " scale(1,0.5)");
        jQuery(".rect5").css("-ms-transform", " scale(1,0.5)");
    }, 300);
    window.setTimeout(function () {
        jQuery(".rect1").css("-ms-transform", " scale(1,0.5)");
        jQuery(".rect2").css("-ms-transform", " scale(1,0.5)");
        jQuery(".rect3").css("-ms-transform", " scale(1,1.1)");
        jQuery(".rect4").css("-ms-transform", " scale(1,1.3)");
        jQuery(".rect5").css("-ms-transform", " scale(1,0.5)");
    }, 400);
    window.setTimeout(function () {
        jQuery(".rect1").css("-ms-transform", " scale(1,0.5)");
        jQuery(".rect2").css("-ms-transform", " scale(1,0.5)");
        jQuery(".rect3").css("-ms-transform", " scale(1,0.5)");
        jQuery(".rect4").css("-ms-transform", " scale(1,1.1)");
        jQuery(".rect5").css("-ms-transform", " scale(1,1.3)");
    }, 500);
    window.setTimeout(function () {
        jQuery(".rect1").css("-ms-transform", " scale(1,0.5)");
        jQuery(".rect2").css("-ms-transform", " scale(1,0.5)");
        jQuery(".rect3").css("-ms-transform", " scale(1,0.5)");
        jQuery(".rect4").css("-ms-transform", " scale(1,0.5)");
        jQuery(".rect5").css("-ms-transform", " scale(1,0.5)");
    }, 600);
}

