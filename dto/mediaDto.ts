/*import { Prisma } from "@prisma/client";
import { IsNotEmpty, IsString } from "class-validator";

export class MediaDto implements Prisma.MediaUncheckedCreateInput  {
    mediaID?: number;
    createdAt?: string | Date;
    updatedAt?: string | Date;
    images: string;
    videos: string;
    fileType: string;
    pubId: number;
    //@IsNotEmpty()
    //images: string;
    //@IsNotEmpty()
   // videos: string;
    @IsString()
    filePath: string;
    videoPath: string;
    imagePath: string[] = [];
    mediaType: 'image' | 'video';
    url: string;
}*/
