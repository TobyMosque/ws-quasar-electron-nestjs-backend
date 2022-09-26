import * as express from 'express';
import configure from './index';

async function bootstrap() {
  const app = express();
  const nest = await configure({ app, prefix: 'api' });
  await nest.listen(3000);
}
bootstrap();
