var koa = require('koa');
var koaBody = require('koa-body');
var logger = require('koa-logger2');
var utils = require('./lib/utils');
var app = koa();

app.use(koaBody());

if (process.env.TINYMCE_CLEAN_LOG) {
	var log_middleware = logger('ip [day/month/year:time zone] "method url protocol/httpVer" status size "referer" "userAgent" duration ms custom[unpacked]');
	app.use(log_middleware.gen);
}

app.use(function* (next) {
	if (this.request.method == 'POST'
			&& this.request.headers['content-type'] == 'text/plain') {
		this.body = utils.process(this.request.body);
		return;
	}
	this.status = 400;
});

var host = process.env.TINYMCE_CLEAN_HOST || undefined;
var port = process.env.TINYMCE_CLEAN_PORT || 16342;
console.log(`Listening on port ${port}`);
app.listen(port, host);
