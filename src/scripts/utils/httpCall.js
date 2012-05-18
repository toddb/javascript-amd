// thin wrapper around `$.ajax` that specifically manages the `Accept` header
define(
    'utils/httpCall',
    ['utils/log', 'jquery', 'underscore'],
    function (log, $, _) {
 
        function ajax(verb, url, accept, data, dataType) {        
            return $.ajax({
                type: verb,
                url: url,
                data: data,
                dataType: dataType,
                contentType: dataType,
                beforeSend: function (jqXhr) {
                    if (accept && verb === 'GET') {
                        jqXhr.setRequestHeader("Accept", accept);
                    }
                  } 
                })
                .fail(function (jqXhr, status, message) {
                        log.debug('HTTP %s of "%s" failed ( %s ), and no error handler was defined', verb, url, message);
                })
        }
        
        //  Public interface methods
        //  ------------------------
        function ajaxGet(uri, mediaType) {
            return ajax('GET', uri, mediaType, null, null);
        }

        function ajaxPut(uri, data, dataType) {
            return ajax('PUT', uri, null, data, dataType);
        }

        function ajaxPost(uri, data, dataType) {
            return ajax('POST', uri, null, data, dataType);
        }

        function ajaxDelete(uri) {
            return ajax('DELETE', uri, null, null, null, null);
        }

        // 'Static' object with functions.
        return {
            // Http verbs (`get`, `put`, `post`, `delete`).
            //
            // **WARNING**: `delete` is a reserved identifer in javascript. The delete
            // method can be called if it is used as an array name.
            get: ajaxGet,
            put: ajaxPut,
            post: ajaxPost,
            'delete': ajaxDelete,
            _delete: ajaxDelete
        };
    });