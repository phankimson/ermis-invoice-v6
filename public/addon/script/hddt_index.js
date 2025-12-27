var Ermis = function () {

    var initKendoDatePicker = function(){
        ErmisKendoDatePickerTemplate("#start_date","dd/MM/yyyy");
        ErmisKendoDatePickerTemplate("#end_date","dd/MM/yyyy");
    }




    return {

        init: function () {
            initKendoDatePicker();
        }

    };

}();

jQuery(document).ready(function () {
    Ermis.init();
});