import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { PubService } from './pub.service';
import { AuthGuard } from '@nestjs/passport';
import { CreatePubDto } from 'dto/createPubDto';
import { Request } from 'express';
import { UpdatePubDto } from 'dto/updatePubDto';
@Controller('pubs')
export class PubController {
    constructor(private readonly pubService: PubService) { }
    @Get()
    getAll() {
        return this.pubService.getAll()
    }
    @UseGuards(AuthGuard('jwt')) 
    @Get(':pubid')
    async getPublicationById(@Param('pubid',ParseIntPipe) pubId: number) {
        return this.pubService.getPubById(pubId);
    }
    @UseGuards(AuthGuard("jwt"))
    @Post("create")
    create(@Body() createPubDto: CreatePubDto, @Req() request: Request) {
        const userId = request.user["id"]
        return this.pubService.create(createPubDto, userId)
    }
    @UseGuards(AuthGuard("jwt"))
    @Delete("delete/:id")
    delete(@Param("id", ParseIntPipe) pubid: number, @Req() request: Request) {
        const userId = request.user["id"]
        return this.pubService.delete(pubid, userId)
    }
    @UseGuards(AuthGuard("jwt"))
    @Put("update/:id")
    update(@Param("id", ParseIntPipe) pubid: number,
        @Body() updatePubDto: UpdatePubDto,
        @Req() request: Request) {
        const userId = request.user["id"]
        return this.pubService.update(pubid, userId, updatePubDto)
    }

}

