/* Gyppo - optional client library
 * simple logger to send client errors to the Gyppo server
 *
 * example usage:
 *   var logger = new Gyppo({ url: "/gyppo_log_url"});
 *   logger.log.error("Oh noes");
 *
 * NOTE: logs all errors to the server by default. if you don't want
 * it to, pass log_errors: false in the options param object
 */
(function(){
    window.Gyppo = function(options){
        // allow our defaults to be overridden
        this.options = $.extend(this.options, options);

        if (this.options.log_errors) this.bindErrorLogger();

        this.initLevels();
    };

    $.extend(Gyppo.prototype, {
        options: {
            url:           "/log",
            success:       $.noop,
            error:         $.noop,
            default_level: "info",

            // make sure these map to the backend
            log_levels:    [
                "info",
                "debug",
                "warn",
                "error"
            ],

            // log all errors to the server?
            log_errors: true,

            // you can define a custom method for choosing what
            // metadata you want to include in the report to the
            // server
            meta_data: function(){
                return {
                    ua:    navigator.userAgent,
                    href:  window.location.href
                }
            }
        },

        // makes all errors log to the server
        bindErrorLogger: function(){
            var instance = this;
            window.onerror = function(message, file, line) {
                instance.log.error(file + ':' + line + '\n\n' + message);
            };
        },

        // build out instance.log.debug, instance.log.error, etc
        initLevels: function(){
            var instance = this;
            var logger = this.log = {};

            $.each(this.options.log_levels, function(i, level){
                logger[level] = function(message){
                    instance.logToServer(level, message, instance.options.success, instance.options.error);
                };

                // index the levels for easy lookup
                instance.log_levels_map[level] = i;
            });
        },

        logToServer: function(level, message, success, error){
            if (this.log_levels_map[level] < this.log_levels_map[this.options.default_level]) return;

            return $.ajax({
                type: "POST",
                url:  this.options.url,
                data: {
                    level:     level,
                    message:   message,
                    meta_data: $.isFunction(this.options.meta_data) ? this.options.meta_data() : {}
                },
                success:  $.isFunction(success) ? success : $.noop,
                error:    $.isFunction(error)   ? error   : $.noop
            });
        }
    });
})();
