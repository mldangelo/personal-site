import Koa from 'koa';
import views from 'koa-views';
import serve from 'koa-static';
import convert from 'koa-convert';
import Router from 'koa-router';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 7999;

const app = new Koa();
const router = Router();

app.use(convert(serve(__dirname + '/public')));
app.use(convert(views(__dirname + '/public/dist', {
  html: 'underscore',
})));
/*
app.use(async (ctx, next) => {
  await ctx.render('index', {});
}); */


router.get('/', function *() {
  yield this.render('index', {});
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => console.log(`server started ${port}`));

export default app;
