var views = require('co-views');
var koa = require('koa');
const app = module.exports = new koa();

// setup views, appending .ejs
// when no extname is given to render()

var render = views(__dirname + '/views', { ext: 'jade' });

// render

app.use(function *(){
  this.body = yield render('index', {});
});

if (!module.parent) app.listen(7999);
