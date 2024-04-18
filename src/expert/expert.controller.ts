import { Body, Controller, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import * as multer from 'multer';
import { diskStorage } from 'multer';
import { ExpertService } from './expert.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateExpertDto } from 'dto/createExpertDto';
import { FormExpertDto } from 'dto/formExpertDto';
import { MailerService } from 'src/mailer/mailer.service';

const certifStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/certif');
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${getExtension(file.mimetype)}`);
    },
});
const upload = multer({ dest: 'uploads/certif' });
@Controller('expert')
export class ExpertController {
constructor(private readonly expertService: ExpertService, private readonly mailerService:MailerService) {}

  @Post('demand')
  @UseInterceptors(FileInterceptor('cv', { dest: 'uploads/certif' }))
  async expertDemand(
   @UploadedFile() cv : Express.Multer.File,
    @Body() formExpertDto: FormExpertDto,
  ): Promise<void> {
    console.log('cv:', cv);
    try {
        // Send a notification to the admin
        const mailOptions = {
          to: 'admin@example.com',
          subject: 'New Expert Application',
          text: `A new expert application has been received from ${formExpertDto.firstName} ${formExpertDto.lastName} (${formExpertDto.email}).
  
  First Name: ${formExpertDto.firstName}
  Last Name: ${formExpertDto.lastName}
  Email: ${formExpertDto.email}
  Phone: ${formExpertDto.tel}
  City: ${formExpertDto.city}`,
        };
  
        await this.mailerService.sendExpertDemand(formExpertDto);
      } catch (error) {
      // Handle the error
      console.log(error);
    }
  }
}
   function getExtension(mimetype: string): string {
    switch (mimetype) {
      case 'image/jpeg':
      case 'image/png':
        return '.png';
      case 'application/pdf':
        return '.pdf';
      default:
        return '.bin';
    }





    /*@Post()
  @UseInterceptors(FileInterceptor('cv', { dest: 'uploads/certificates' }))
  async createExpert(
    @UploadedFile() file: Express.Multer.File,
    createExpertDto: CreateExpertDto,
  ): Promise<void> {
    try {
      await this.expertService.createExpert(createExpertDto, file);
      // Send a notification to the admin
    } catch (error) {
      // Handle the error
    }
  }*/
/*
  @Post('accept/:id')
  async acceptExpertApplication(
    @Param('id') id: number,
    @Body() createExpertDto: CreateExpertDto,
  ): Promise<void> {
    try {
      // Generate a random password
      const password = Math.random().toString(36).slice(-8);

      // Create the expert
      const expert = await this.expertService.createExpert(createExpertDto, null, password, id);

      // Send an acceptance email to the expert
      const transporter = nodemailer.createTransport({
        host: 'smtp.example.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'admin@example.com',
          pass: 'password',
        },
      });

      const mailOptions = {
        from: 'admin@example.com',
        to: createExpertDto.email,
        subject: 'Expert Application Accepted',
        text: `Your expert application has been accepted. Your account credentials are:

Email: ${createExpertDto.email}
Password: ${password}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log(`Email sent: ${info.response}`);
        }
      });
    } catch (error) {
      // Handle the error
      console.log(error);
    }
  }

  @Post('reject/:id')
  async rejectExpertApplication(
    @Param('id') id: number,
    @Body() createExpertDto: CreateExpertDto,
  ): Promise<void> {
    try {
      // Send a rejection email to the expert
      const transporter = nodemailer.createTransport({
host: 'smtp.example.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'admin@example.com',
          pass: 'password',
        },
      });

      const mailOptions = {
        from: 'admin@example.com',
        to: createExpertDto.email,
        subject: 'Expert Application Rejected',
        text: 'Your expert application has been rejected.',
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log(`Email sent: ${info.response}`);
        }
      });
    } catch (error) {
      // Handle the error
      console.log(error);
    }
  }
}*/






}

    

