var Ermis = function () {
    var initHomePage = function () {
        jQuery('#check_mst').on('click ', btnCheckMst);
    }

     var btnCheckMst = function(e) {
            let tax_code = jQuery("input[name='tax_code']").val();
            if(tax_code == ''){
                kendo.alert("Vui lòng nhập Mã số thuế !");
                return;
            }
            var url = UrlString("mst/api/v1/check-mst/"+tax_code);
            ErmisTemplateAjaxPostApi0(e,url,
                function(){
                    window.location.href = 'index';
                },
                function(result){
                      kendo.alert(result);
                }
            );
        };

        return {
        init: function () {
            initHomePage();
        }

    };
}();

jQuery(document).ready(function () {
    Ermis.init();
});