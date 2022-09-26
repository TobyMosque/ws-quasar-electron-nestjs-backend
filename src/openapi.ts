import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './modules/app/app.module';
import { INestApplication } from '@nestjs/common';
import { writeFile } from 'fs';
import { promisify } from 'util';

const writeFileAsync = promisify(writeFile);
interface GetOpenApiSpecParams {
  app?: INestApplication;
}

interface WriteSwaggerFileParams {
  document?: OpenAPIObject;
  forceThrow?: boolean;
}

export async function getOpenApiSpec({ app }: GetOpenApiSpecParams = {}) {
  const config = new DocumentBuilder()
    .setTitle('Quasar Nest example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .addSecurityRequirements('access-token')
    .build();
  return SwaggerModule.createDocument(app, config, {
    include: [AppModule],
    operationIdFactory(controllerKey, methodKey) {
      return methodKey;
    },
  });
}

export async function writeSwaggerFile({
  document,
  forceThrow = false,
}: WriteSwaggerFileParams = {}) {
  await writeFileAsync('./swagger.json', JSON.stringify(document, null, 2));
  if (forceThrow) {
    throw new Error('we had the swagger.json');
  }
}
