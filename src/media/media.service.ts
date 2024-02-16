import { BadRequestException, Injectable } from '@nestjs/common';
import path from 'path';
import * as fs from 'fs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MediaService {
    constructor(private readonly prismaService: PrismaService) {}
    async uploadImage(image: any) {
        // Assurez-vous que le dossier 'uploads' existe
        const uploadDir = path.join(__dirname, '..', 'uploads', 'images');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
    
        try {
          // Générez un nom de fichier unique pour l'image
          const fileName = `${Date.now()}-${image.originalname}`;
          // Déplacez le fichier téléchargé vers le dossier 'uploads'
          fs.writeFileSync(path.join(uploadDir, fileName), image.buffer);
          
          // Enregistrez les informations de l'image dans la base de données
          const savedImage = await this.prismaService.media.create({
            data: {
              fileName,
              type: 'image', // Vous pouvez ajouter d'autres métadonnées selon vos besoins
            },
          });
    
          return savedImage;
        } catch (error) {
          throw new BadRequestException('Failed to upload image');
        }
      }
}
