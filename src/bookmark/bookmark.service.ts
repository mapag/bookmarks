import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { AddBookmarkDto } from './dto/add-bookmark.dto';
import { User } from '@prisma/client';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  getBookmarks() {
    return this.prisma.bookmark.findMany();
  }

  addBookmark(user: User, dto: AddBookmarkDto) {
    return this.prisma.bookmark.create({
      data: {
        userId: user.id,
        ...dto,
      },
    });
  }
}
