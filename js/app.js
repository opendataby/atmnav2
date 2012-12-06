app.utils.setDefaults();

jQuery.ajaxSetup({
    timeout: app.settings.ajaxTimeout
});

window.onerror = function(errorMsg, url, lineNumber) {
    jQuery.ajax({
        'url': app.settings.errorsUrl,
        'type': 'POST',
        'async': true,
        'dataType': 'json',
        'timeout': app.settings.ajaxTimeout,
        'data': {
            'error_msg': errorMsg,
            'error_url': url,
            'error_line': lineNumber
        },
        'error': function(jqXHR, textStatus, errorThrown) {
            alert(textStatus);
        }
    });

    return true;
};