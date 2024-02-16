import { Body, Controller, Req, UseGuards, Delete, Put, Post, UseInterceptors, UploadedFile, Get, Param, Res } from '@nestjs/common';
import { DeleteAccountDto } from 'dto/deleteAccountDto';
import { UpdateAccountDto } from 'dto/updateAccountDto';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path, { join } from 'path';
import { Request, request } from 'express'
import { Observable, from, map, of } from 'rxjs';
import * as multer from 'multer';
import { User } from '@prisma/client';

export const storage = {
    storage: multer.diskStorage({
        destination: './uploads/profileimages',
        filename: (req, file, cb) => {
            console.log('Configuration du stockage :', file);
            let splitedName = file.originalname.split('.')
            const filename: string = splitedName[0];
            const extention: string = file.mimetype.split('/')[1];;
            cb(null, `${filename}.${extention}`);
        }
    })
}
@Controller('user')
export class UserController {
    uploadService: any;
    constructor(private readonly userService: UserService) { }

    @UseGuards(AuthGuard("jwt"))
    @Delete("delete-account")
    deleteAccount(@Req() request: Request, @Body() deleteAccountDto: DeleteAccountDto) {
        const userId = request.user["id"]
        return this.userService.deleteAccount(userId, deleteAccountDto);
    }
    @UseGuards(AuthGuard("jwt"))
    @Put("update-account")
    update(@Req() request: Request,
        @Body() updateAccountDto: UpdateAccountDto,
    ) {
        const userId = request.user["id"]
        return this.userService.updateAccount(userId, updateAccountDto)
    }
    @UseGuards(AuthGuard("jwt"))
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', storage))
    uploadFile(@UploadedFile() file, @Req() request: Request): Observable<Object> {
        const user: User = request.user["id"];
        console.log(user)
        //return from(this.userService.updateAccount(user.id, {PhotoProfil: file.filename})).pipe(
        // map(() => ({PhotoProfil: user.PhotoProfil}))
        // )
        return of({ imagePath: file.filename });
    }
    @Get('profile-image/:imagename')
    findProfileImage(@Param('imagename') imagename, @Res() res): void {
        res.sendFile(join(process.cwd(), 'uploads/profileimages/' + imagename))
    }
    @UseGuards(AuthGuard("jwt"))
    @Put('update-profile-image') 
    @UseInterceptors(FileInterceptor('file', storage))
    updateProfileImage(@UploadedFile() file, @Req() request: Request): Observable<Object> {
        const userId = request.user["id"]; 
        return from(this.userService.updateProfileImage(userId, file.filename));
    }


}
