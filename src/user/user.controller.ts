import { Body, Controller, Req, UseGuards, Delete, Put } from '@nestjs/common';
import { DeleteAccountDto } from 'dto/deleteAccountDto';
import { UpdateAccountDto } from 'dto/updateAccountDto';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from "express";
@Controller('user')
export class UserController {
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
}
