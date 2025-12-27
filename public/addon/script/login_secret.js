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
            var url = UrlString("hddt/api/v1/login-invoice/"+secret_key);
            ErmisTemplateAjaxPostApi0(e,url,
                function(){
                if(Ermis_login_secret.url_back.indexOf("login_key")>0)
                {
                    window.location.href = 'index';
                }else{
                    window.location.href = Ermis_login_secret.url_back;
                }

                },
                function(result){
                    jQuery('#notification').EPosMessage('error', result.message);
                }
            );
        };

        jQuery('#connect').on('click ', btnConnect);
    }
}