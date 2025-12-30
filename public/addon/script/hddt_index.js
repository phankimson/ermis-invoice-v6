var Ermis = function () {
    var arr = [];
    var key_search = '';

    var initGlobal = function(){
        ErmisKendoDatePickerTemplate("#start_date","dd/MM/yyyy");
        ErmisKendoDatePickerTemplate("#end_date","dd/MM/yyyy");
        ErmisKendoDroplistTemplate('#invoice_type',false);
        jQuery("#load_invoice").on('click ', initLoadInvoice);
        jQuery("#download_excel").on('click ', initDownloadExcel);
    }

    var initLoadInfoUser = function(e){
            var url = UrlString("hddt/api/v1/info-user");
            ErmisTemplateAjaxPostApi0(e,url,
                function(result){               
                    result = JSON.parse(result);
                    sessionStorage.setItem("info_user",JSON.stringify(result));
                    jQuery("#info_user").text(result[1]+' - '+result[2]+' - '+result[4]);
                },
                function(result){         
                     kendo.alert(result);
                     window.location.href = 'login-key';
                }
            );
    }

    var initLoadInvoice = function(e){
        let start_date = jQuery("#start_date").val().replaceAll("/", "-");
        let end_date = jQuery("#end_date").val().replaceAll("/", "-");
        let invoice_type = jQuery("#invoice_type").val();
        let invoice_group = jQuery(".uk-tab li.uk-active").attr("data-id");  
        let page = 1;    
        var url = UrlString("hddt/api/v1/p-invoice/"+invoice_group+"/"+invoice_type+"/"+start_date+"/"+end_date+"/"+page);
        ErmisTemplateAjaxPostApi0(e,url,
        function(result){
             result = JSON.parse(result);            
            if(result.data.length>0){
                jQuery("#grid"+invoice_group+" tbody tr:not(.hidden)").remove();
                initLoadDataInvoice(result.data,invoice_group);
                    if(key_search == '' || key_search != (invoice_group+'&'+invoice_type+'&'+start_date+'&'+end_date)){
                        initLoadInvoicePage(invoice_group,parseInt(page),result.total_page);
                        arr = [];
                    };     
                  arr.push(result);
                  key_search = invoice_group+'&'+invoice_type+'&'+start_date+'&'+end_date;
                }                             
        },
        function(result){         
                kendo.alert(result);
        }
      );
    }

    var initPageInvoice = function(pageNumber, event){      
        if(event != undefined){event.preventDefault();}
       const resultObject = search("page_current",pageNumber, arr);
       var string_key = key_search.split('&');
        if(resultObject != undefined){
            jQuery("#grid"+string_key[0]+" tbody tr:not(.hidden)").remove();
            initLoadDataInvoice(resultObject.data,string_key[0]);
            return;
        }      
        var url = UrlString("hddt/api/v1/p-invoice/"+string_key[0]+"/"+string_key[1]+"/"+string_key[2]+"/"+string_key[3]+"/"+pageNumber);
        ErmisTemplateAjaxPostApi0(null,url,
        function(result){
             result = JSON.parse(result);   
            if(result.data.length>0){
                    jQuery("#grid"+string_key[0]+" tbody tr:not(.hidden)").remove();
                    initLoadDataInvoice(result.data,string_key[0]);
                    arr.push(result);
                }   
        },
        function(result){         
                kendo.alert(result);
        }
      );
    }

    var initLoadDataInvoice = function(data,invoice_group){
             data.forEach(function(rs) {
                     var clone = jQuery("#grid"+invoice_group+" tbody tr.hidden").first().clone(true);
                     var name = '';
                     clone.find("td").each(function(i) {
                     const $th = $(this);  
                     $th.text(rs[i]); 
                     if(i < 6){
                        $th.text(rs[i]); 
                     }else if(i == 6){
                        var arr = rs[i].split(":");
                        //console.log(arr);
                        if(arr[1] != undefined && arr[2] != undefined){
                            var mst_text = arr[1].trimLeft().split(" ");
                            name = arr[2];
                            if(mst_text[0] != undefined){
                              $th.text(mst_text[0].replace("Tên","")); 
                            }
                        }else if(arr[1] != undefined){
                             name = arr[1];
                             $th.text(""); 
                        }else{

                        }                     
                     }else if(i == 7){
                        $th.text(name);
                     }else if(i == 16 || i == 17){
                        $th.text("");
                     }else{
                        $th.text(rs[i-1]); 
                     }
                  
                    });
                    clone.removeClass("hidden");
                    clone.insertAfter("#grid"+invoice_group+" tbody tr.hidden");
                });  
    }

    var initLoadInvoicePage = function(invoice_group,page_current,total_page){
        jQuery("#grid_pagination_"+invoice_group).pagination({
            items: total_page,
            itemsOnPage: 1,
            pages: 0,
            displayedPages: 2,
            edges : 1,
            prevText : '&laquo;',
            nextText : '&raquo;',
            currentPage: page_current,
            cssStyle: 'light-theme',
            onPageClick : function(pageNumber, event) {
                initPageInvoice(pageNumber,event);
				},
            onInit : initLoadInvoice,
        });
    }

    var initDownloadExcel = async function(){
        let start_date = jQuery("#start_date").val().replaceAll("/", "-");
        let end_date = jQuery("#end_date").val().replaceAll("/", "-");
        let invoice_type = jQuery("#invoice_type").val();
        let invoice_group = jQuery(".uk-tab li.uk-active").attr("data-id"); 
        var url_get = UrlString("hddt/api/v1/excel-invoice/"+invoice_group+"/"+invoice_type+"/"+start_date+"/"+end_date);
            ErmisTemplateAjaxGetApi0(null,url_get,
            function(result){
                 window.location.href = UrlString("hddt/api/v1/download-excel/",result);
                 kendo.alert(result);
            },
            function(result){         
                 kendo.alert(result);
                }
          );
        }    
    



    return {

        init: function () {
            initLoadInfoUser();
            initGlobal();
        }

    };

}();

jQuery(document).ready(function () {
    Ermis.init();
});