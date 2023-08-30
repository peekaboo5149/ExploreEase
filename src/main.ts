import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger, ValidationPipe } from '@nestjs/common'
import WebConfig from './global/web.config'

async function bootstrap() {
    await WebConfig.getInstance().init()
    const app = await NestFactory.create(AppModule)
    app.setGlobalPrefix('api')
    // Configure the default logger to use Winston
    app.useLogger(app.get(Logger))
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
    await app.listen(5000)
}
bootstrap()
