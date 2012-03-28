require(
    [
        'copyright',
        'utils/log',
        'text!coffee/views/index.html',
        'text!coffee/views/_item.html'
    ],
    function(copyright, log) {
        log.loader('bootstrap-html');
    }
);