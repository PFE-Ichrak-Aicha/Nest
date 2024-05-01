import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class NotificationDTO {
    @IsNotEmpty()
    @IsString()
    content: string;

    @IsBoolean()
    isRead: boolean;

}