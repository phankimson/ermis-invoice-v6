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
                kendo.ui.progress(windowWidget, true);
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
                kendo.ui.progress(windowWidget, true);
            }
        },
        error: function (xhr) {
            kendo.alert(xhr.statusText);
            kendo.ui.progress(windowWidget, false);
        //    location.reload();
        }
    });
}

function RequestURLWaitingGetApi(url, returnType , callback, displayLoading) {
    var windowWidget = jQuery('body');
    if (displayLoading) {
        kendo.ui.progress(windowWidget, true);
    }
    jQuery.ajax({
        url: url,
        type : 'GET',
        dataType: returnType,
        success: function (result) {
            callback(result);
            if (displayLoading) {
                kendo.ui.progress(windowWidget, true);
            }
        },
        error: function (xhr) {         
            kendo.alert(xhr.responseText);
            kendo.ui.progress(windowWidget, false);
        //    location.reload();
        }
    });
}


function RequestURLWaitingApi(url, returnType, callback, displayLoading) {
    var windowWidget = jQuery('body');
    if (displayLoading) {
        kendo.ui.progress(windowWidget, true);
    }
    jQuery.ajax({
        url: url,
        type : 'POST',
        dataType: returnType,
        success: function (result) {
            callback(result);
            if (displayLoading) {
                kendo.ui.progress(windowWidget, true);
            }
        },
        error: function (xhr) {
            kendo.alert(xhr.responseText);
            kendo.ui.progress(windowWidget, false);
        //    location.reload();
        }
    });
}