var Ermis = function () {
    var currentItem = 4;
    var maxItem = 4;

    var initHomePage = function () {
        jQuery('#check_mst').on('click ', btnCheckMst);
        initDialog("#dialog","Kết quả kiểm tra MST","");
        jQuery('.prev-btn').on('click ', initPrevItem);
        jQuery('.next-btn').on('click ', initNextItem);
    }

     var btnCheckMst = function(e) {
            let tax_code = jQuery("input[name='tax_code']").val();
            if(tax_code == ''){
                kendo.alert("Vui lòng nhập Mã số thuế !");
                return;
            }
            var url = UrlString("mst/api/v1/check-mst/"+tax_code);
            ErmisTemplateAjaxPostApi0(e,url,
                function(result){
                    var rs = '<table class="table"><tbody>';
                    for (var i = 0; i < result.length; i++) {
                        if(i == result.length -2){
                        rs += '<tr><td colspan="2"><strong>' + result[i] + '</strong></td>';
                        } else if (i % 2 === 0 || i === 0) {
                        rs += '<tr><td style="width: 30%;"><strong>' + result[i] + '</strong></td>';
                        }else {
                        rs += '<td style="width: 70%;">' + result[i] + '</td></tr>';
                        }
                    }                   
                        rs += '</tbody></table>';
                    var dialog = $("#dialog").data("kendoWindow");
                    dialog.center().content(rs).open();
                },
                function(result){
                      kendo.alert(result);
                }
            );
        };

        var initDialog = function (selector,title,content) {
            var dialog = jQuery(selector),
            undo = jQuery("#undo");

            undo.click(function () {
                dialog.data("kendoDialog").open();
                undo.fadeOut();
            });

            function onClose() {
                undo.fadeIn();
            }

            dialog.kendoWindow({
                width: "600px",
                height: "600px",
                title: title,
                closable: true,
                visible: false,
                scrollable: true,
                content: content,
                close: onClose
            });
        }

        var initShowItem = function (currentItem,maxItem){
            jQuery('.solution_item').each(function(index, element){
                if(currentItem <= maxItem){
                    if(index < currentItem){
                        jQuery(this).fadeIn();
                    } else {
                        jQuery(this).fadeOut();
                    }
                }else{
                    if(index >= maxItem){
                        jQuery(this).fadeIn();
                    } else {
                        jQuery(this).fadeOut();
                    }
                }

            })
        }

        var initNextItem = function (){ 
            currentItem = currentItem + 1;
            if(currentItem > (jQuery('.solution_item').length)){
                currentItem = (jQuery('.solution_item').length);
            }else{
                initShowItem(currentItem,maxItem);
            }          
        }

        var initPrevItem = function (){ 
            currentItem = currentItem - 1;
            if(currentItem < maxItem){
                currentItem = maxItem;
            }else{
                initShowItem(currentItem,maxItem);
            }
        
        }

        return {
        init: function () {
            initHomePage();
            initShowItem(currentItem,maxItem);
        }

    };
}();

jQuery(document).ready(function () {
    Ermis.init();
});