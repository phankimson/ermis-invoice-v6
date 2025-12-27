function RequestURLWaitingGet(url, returnType , postData, callback, displayLoading) {
    var windowWidget = jQuery('body');
    if (displayLoading) {
        kendo.ui.progress(windowWidget, true);
    }
    jQuery.ajax({
        url: url,
        type : 'GET',
        data: postData,
        dataType: returnType,
        success: function (result) {
            callback(result);
            if (displayLoading) {
                kendo.ui.progress(windowWidget, false);
            }
        },
        error: function (xhr) {
            kendo.alert(xhr.statusText);
            kendo.ui.progress(windowWidget, false);
        //    location.reload();
        }
    });
}

function RequestURLWaiting(url, returnType, postData, callback, displayLoading) {
    var windowWidget = jQuery('body');
    if (displayLoading) {
        kendo.ui.progress(windowWidget, true);
    }
    jQuery.ajax({
        url: url,
        type : 'POST',
        data: postData,
        dataType: returnType,
        success: function (result) {
            callback(result);
            if (displayLoading) {
                kendo.ui.progress(windowWidget, false);
            }
        },
        error: function (xhr) {
            kendo.alert(xhr.statusText);
            kendo.ui.progress(windowWidget, false);
        //    location.reload();
        }
    });
}

function RequestURLWaitingGetApi(url, callback_true,callback_false, displayLoading) {
    var windowWidget = jQuery('body');
    if (displayLoading) {
        kendo.ui.progress(windowWidget, true);
    }
    jQuery.ajax({
        url: url,
        type : 'GET',
    }).done(function(result) {
             callback_true(result);
            if (displayLoading) {
                kendo.ui.progress(windowWidget, false);
            }
        })
        .fail(function(xhr, textStatus) {
            callback_false(xhr.responseText);
            kendo.ui.progress(windowWidget, false);
        });;
}


function RequestURLWaitingApi(url, callback_true,callback_false, displayLoading) {
    var windowWidget = jQuery('body');
    if (displayLoading) {
        kendo.ui.progress(windowWidget, true);
    }
    jQuery.ajax({
        url: url,
        type : 'POST',
        }).done(function(result) {
             callback_true(result);
            if (displayLoading) {
                kendo.ui.progress(windowWidget, false);
            }
        })
        .fail(function(xhr, textStatus) {
            callback_false(xhr.responseText);
            kendo.ui.progress(windowWidget, false);
        });
}