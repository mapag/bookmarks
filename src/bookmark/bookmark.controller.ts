import { User } from '@prisma/client';
import { GetUser } from './../auth/decorator/get-user.decorator';
import { AddBookmarkDto } from './dto/add-bookmark.dto';
import { JwtGuard } from './../auth/guard/jwt.guard';
import { BookmarkService } from './bookmark.service';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Get()
  getBookmarks() {
    return this.bookmarkService.getBookmarks();
  }

  @Post()
  addBookmark(@GetUser() user: User, @Body() dto: AddBookmarkDto) {
    return this.bookmarkService.addBookmark(user, dto);
  }
}
