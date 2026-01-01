var ErmisTemplateAjaxPost0 = function(e, postdata, url, callback_true, callback_false) {
    RequestURLWaiting(url, 'json', postdata, function(result) {
        if (result.status === true) {
            callback_true(result);
        } else {
            callback_false(result);
        }
    }, true);
};

var ErmisTemplateAjaxPostApi0 = function(e, url, callback_true, callback_false) {
    RequestURLWaitingApi(url, function(result) {
            callback_true(result);
        },
        function(result){
            callback_false(result);
        }
    , true);
};

var ErmisTemplateAjaxGet0 = function(e, postdata, url, callback_true, callback_false) {
    RequestURLWaitingGet(url, 'json', postdata, function(result) {
        if (result.status === true) {
            callback_true(result);
        } else {
            callback_false(result);
        }
    }, true);
};

var ErmisTemplateAjaxGetApi0 = function(e, url, callback_true, callback_false) {
    RequestURLWaitingGetApi(url, function(result) {
            callback_true(result);
        },
        function(result){
            callback_false(result);
        }
    , true);
};

var ErmisTemplateAjaxApi = function(e, url, callback_true, callback_false,type) {
    RequestURLMultiWaitingApi(url, function(result) {
            callback_true(result);
        },
        function(result){
            callback_false(result);
        }
    , type, true);
};

var ErmisTemplateAjaxPost1 = function(e, elem, url, callback_true, callback_false) {
    e.preventDefault();
    var data = GetAllValueForm(elem);
    var postdata = {
        data: JSON.stringify(data)
    };
    RequestURLWaiting(url, 'json', postdata, function(result) {
        if (result.status === true) {
            callback_true(result);
        } else {
            callback_false(result);
        }
    }, true);
};

var ErmisTemplateAjaxGet1 = function(e, elem, url, callback_true, callback_false) {
    e.preventDefault();
    var data = GetAllValueForm(elem);
    var postdata = {
        data: JSON.stringify(data)
    };
    RequestURLWaitingGet(url, 'json', postdata, function(result) {
        if (result.status === true) {
            callback_true(result);
        } else {
            callback_false(result);
        }
    }, true);
};

var ErmisKendoDatePickerTemplate = function(elem, format) {
    jQuery(elem).kendoDatePicker({
        format: format
    });
};


var ErmisKendoDroplistTemplate = function(elem, filter) {
    jQuery(elem).kendoDropDownList({
        filter: filter,
        autoBind: false,
    });
};


function GetAllValueForm(elem) {
    var map = {};
    jQuery(elem + ' input').each(function () {
        if (jQuery(this).attr("type") === 'radio') {
            map[jQuery(this).attr("name")] = jQuery('input[name=radio]:checked', '#radio').val();
        } else {
            map[jQuery(this).attr("name")] = jQuery(this).val();
        }
    });
    jQuery(elem + ' textarea').each(function () {
        map[jQuery(this).attr("name")] = jQuery(this).val();
    });
    jQuery(elem + ' select').each(function () {
        map[jQuery(this).attr("name")] = jQuery(this).find('option:selected').val();
    });
    return map;
}

jQuery.fn.EPosMessage = function (type, message) {
    type = type === '' ? 'success' : type;
    jQuery(this).html('');
    var messageElem = '';
    if (type === "success") {
        messageElem = jQuery("<div class=\"alert alert-success\"><a href='javascript:;' class='close'></a>" + message + "</div>");
    } else {
        messageElem = jQuery("<div class=\"alert alert-danger\"><a href='javascript:;'  class='close'></a>" + message + "</div>");
    }
    jQuery(this).append(messageElem);
    messageElem.fadeIn(500).delay(5000).fadeOut(500);
    jQuery('.alert .close').on('click',function(){
      messageElem.hide();
    })
};


function UrlString (url){
  var hostname = window.location.hostname;
  var port = window.location.port;
  var protocal = window.location.protocol;
  var string = '';
  if(port){
    string = protocal + '//' + hostname + ':' + port + '/' + url;
  }else{
    string = protocal + '//' + hostname + '/' + url;
  }
  return string;
}

function UrlStringPath (url,path){
  var hostname = window.location.hostname;
  var port = window.location.port;
  var protocal = window.location.protocol;
  var string = '';
  if(port){
    string = protocal + '//' + hostname + ':' + port + '/' + path + '/' + url;
  }else{
    string = protocal + '//' + hostname + '/' + path + '/' + url;
  }

  return string;
}

function search(nameKey, valueKey, myArray){
    for (let i=0; i < myArray.length; i++) {
        if (myArray[i][nameKey] === valueKey) {
            return myArray[i];
        }
    }
}

 function openDownload(link){
      var popout = window.open(link);
      window.setTimeout(function(){
         popout.close();
      }, 2000);
}

function convertNameTaxcode (name){
    var arr = name.split(":");
    var rs = [];
    if(arr[1] != undefined && arr[2] != undefined){
        var mst_text = arr[1].trimLeft().split(" ");
        rs.name = arr[2];
        if(mst_text[0] != undefined){
          rs.tax_code = mst_text[0].replace("Tên","");
        }
    }else if(arr[1] != undefined){
        rs.name = arr[1];
        rs.tax_code = "";
    }else{

    }  
    return rs;      
}