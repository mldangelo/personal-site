import Koa from 'koa';
import views from 'koa-views';
import serve from 'koa-static';
import convert from 'koa-convert';
import Router from 'koa-router';

const app = new Koa();
const router = Router();

//app.use(router(app));
app.use(convert(serve(__dirname + '/public')));

app.use(convert(views(__dirname + '/public/dist', {
  map: {
    html: 'underscore',
  }
})));
/*
app.use(async (ctx, next) => {
  await ctx.render('index', {});
}); */


router.get('/', function *(next) {
    yield this.render('index', {});
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(7999, () => console.log('server started 7999'))

export default app;
