var config           = {};
config.port          = '9000';
config.uid           = "www";
config.gid           = config.user;
config.transport     = "file";
config.default_level = "info";
config.log_file      = "./log/gyppo.log";

module.exports = config;
