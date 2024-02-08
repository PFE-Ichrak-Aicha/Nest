import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as multer from 'multer';

@Injectable()
export class UploadService {
    async uploadFile(file: multer.File): Promise<string> {
        const uploadPath = path.join(__dirname, '..', 'uploads'); // Chemin du dossier "uploads" dans votre application
        const fileName = `${Date.now()}-${file.originalname}`;
        const filePath = path.join(uploadPath, fileName);

        // Écrire le fichier téléversé sur le disque
        await fs.promises.writeFile(filePath, file.buffer);

        return filePath; // Vous pouvez retourner l'URL du fichier ou toute autre information pertinente
    }
}
