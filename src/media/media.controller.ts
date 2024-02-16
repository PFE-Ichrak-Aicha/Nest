import { Controller, Post, UploadedFile,UseGuards, UseInterceptors } from '@nestjs/common';
import { MediaService } from './media.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
@Controller('media')
export class MediaController {
    constructor(private readonly mediaService: MediaService) {}
    @UseGuards(AuthGuard('jwt'))
    @Post('upload/image')
    @UseInterceptors(FileInterceptor('image'))
    async uploadImage(@UploadedFile() image: Express.Multer.File): Promise<any> {
      return await this.mediaService.uploadImage(image);
    }}
