import { IsString } from 'class-validator';

export class AddBookmarkDto {
  @IsString()
  title: string;

  @IsString()
  link: string;
}
