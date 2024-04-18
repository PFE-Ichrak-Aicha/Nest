import { Injectable } from '@nestjs/common';
import * as multer from 'multer';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';
import { CreateExpertDto } from 'dto/createExpertDto';
import * as bcrypt from 'bcrypt';
import { diskStorage } from 'multer';
@Injectable()
export class ExpertService {
    constructor(private prisma: PrismaService) { }
   /* private readonly certifStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/certif');
        },
        filename: (req, file, cb) => {
            cb(null, `${file.fieldname}-${Date.now()}${this.getExtension(file.mimetype)}`);
        },
    });

    private readonly upload = multer({ storage: this.certifStorage });
     getExtension(mimetype: string): string {
        switch (mimetype) {
            case 'image/jpeg':
            case 'image/png':
                return '.png';
            case 'application/pdf':
                return '.pdf';
            default:
                return '.bin';
    
        }
    }*/

      /*async createExpert(formExpertDtoExpertDto: CreateExpertDto, file: Express.Multer.File): Promise<void> {
        try {
          // Hash the password
          const hashedPassword = await bcrypt.hash(createExpertDto.passe, 10);
    
          // Store the CV file
          const cvPath = await new Promise<string>((resolve, reject) => {
            this.upload.single('cv')(createExpertDto, (err, file) => {
              if (err) {
                reject(err);
              }
              resolve(file.path);
            });
          });
    
          // Create the expert
          const expert = await this.prisma.expert.create({
            data: {
              firstName: createExpertDto.firstName,
              lastName: createExpertDto.lastName,
              email: createExpertDto.email,
              tel: createExpertDto.tel,
              city: createExpertDto.city,
              passe: hashedPassword,
              cv: fs.readFileSync(cvPath).toString('base64'),
            },
          });
    
          // Delete the CV file
          //fs.unlinkSync(cvPath);
    
          // Send a notification to the admin
        } catch (error) {
          // Handle the error
        }
      }
  
    }*/
}



