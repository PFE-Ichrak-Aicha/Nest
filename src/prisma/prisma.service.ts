import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
@Injectable()
export class PrismaService extends PrismaClient {
    private _media: any;
    public get media(): any {
        return this._media;
    }
    public set media(value: any) {
        this._media = value;
    }
    constructor(configService: ConfigService) {
        super({
            datasources: {
                db: {
                    url: configService.get('DATABASE_URL'),
                },
            },
        });
    }
}
