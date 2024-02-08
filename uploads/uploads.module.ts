import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
    imports: [
        MulterModule.register({
            dest: './uploads', // Dossier de destination pour stocker les fichiers téléversés
        }),
    ],
    controllers: [UploadController],
    providers: [UploadService],
})
export class UploadModule { }
