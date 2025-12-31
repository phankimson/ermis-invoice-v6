$(function() {
    // login_secret
    Ermis_login_secret.init();
});
// variables here

//
Ermis_login_secret = {
    init: function () {    
         // show login form (hide other forms)
        var btnConnect = function(e) {
            let secret_key = jQuery("#login_secret_key").val();
            if(secret_key == ''){
                kendo.alert("Vui lòng nhập Mã bí mật!");
                return;
            }
            var url = UrlString("hddt/api/v1/login-invoice/"+secret_key);
            ErmisTemplateAjaxPostApi0(e,url,
                function(){
                    window.location.href = 'index';
                },
                function(result){
                      kendo.alert(result);
                }
            );
        };

        jQuery('#connect').on('click ', btnConnect);
    }
}