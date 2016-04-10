import views from 'co-views';
import Koa from 'koa';
const app = new Koa();

const render = views(__dirname + '/views', { ext: 'jade' });

// response
app.use(async (ctx) => {
  const page = await render('index', {});
  ctx.body = page;
})

app.listen(7999, () => console.log('server started 7999'))

export default app;
