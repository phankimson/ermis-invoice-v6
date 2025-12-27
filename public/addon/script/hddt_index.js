var Ermis = function () {

    var initKendoDatePicker = function(){
        ErmisKendoDatePickerTemplate("#start_date","dd/MM/yyyy");
        ErmisKendoDatePickerTemplate("#end_date","dd/MM/yyyy");
        ErmisKendoDroplistTemplate('#invoice_type',false);
    }

    var initLoadInfoUser = function(e){
            var url = UrlString("hddt/api/v1/info-user");
            ErmisTemplateAjaxPostApi0(e,url,
                function(result){               
                    jQuery("#info_user").text(result[1]+' - '+result[2]+' - '+result[4]);
                },
                function(result){         
                     kendo.alert(result);
                }
            );
    }



    return {

        init: function () {
            initKendoDatePicker();
            initLoadInfoUser();
        }

    };

}();

jQuery(document).ready(function () {
    Ermis.init();
});