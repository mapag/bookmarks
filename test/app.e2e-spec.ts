import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';

import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

import { AuthDto } from './../src/auth/dto/auth.dto';
import { EditUserDto } from './../src/user/dto/edit-user.dto';
import { AddBookmarkDto } from './../src/bookmark/dto/add-bookmark.dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    const configService = app.get<ConfigService>(ConfigService);

    await app.init();
    await app.listen(configService.get('port'));

    prisma = app.get(PrismaService);
    await prisma.cleanDb();

    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'test@test.com',
      password: '123',
    };
    describe('Sign up', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });

      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });

      it('should throw if no body', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });

      it('should sign up', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });

      it('should throw if email exists', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(403);
      });
    });

    describe('Sign in', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });

      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });

      it('should throw if no body', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });

      it('should sign in', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('User', () => {
    const userEmail = 'test@test.com';
    describe('Get me', () => {
      it('Should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders('Authorization', 'Bearer $S{userAt}')
          .expectStatus(200)
          .expectBodyContains(userEmail);
      });
    });
    describe('Edit user', () => {
      const editUserDto: EditUserDto = {
        firstName: 'Juan',
        lastName: 'Perez',
      };
      it('Should edit current user', () => {
        return pactum
          .spec()
          .patch('/users/me')
          .withHeaders('Authorization', 'Bearer $S{userAt}')
          .withBody(editUserDto)
          .expectStatus(200)
          .expectBodyContains(editUserDto.firstName)
          .expectBodyContains(editUserDto.lastName);
      });
    });
  });

  describe('Bookmarks', () => {
    const addBookmarkDto: AddBookmarkDto = {
      title: 'Test bookmark',
      link: 'Link of bookmark',
    };
    describe('Add bookmarks', () => {
      it('Should get reject unauthorized users', () => {
        return pactum.spec().post('/bookmarks').expectStatus(401);
      });

      it('Should create bookmark', () => {
        return pactum
          .spec()
          .post('/bookmarks')
          .withBody(addBookmarkDto)
          .withHeaders('Authorization', 'Bearer $S{userAt}')
          .expectStatus(201);
      });
    });

    describe('Get bookmarks', () => {
      it('Should get reject unauthorized users', () => {
        return pactum.spec().get('/bookmarks').expectStatus(401);
      });

      it('Should get user bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders('Authorization', 'Bearer $S{userAt}')
          .expectStatus(200)
          .expectBodyContains(addBookmarkDto.title)
          .expectBodyContains(addBookmarkDto.link)
          .inspect();
      });
    });

    describe('Get bookmarks by id', () => {
      it.todo('Should pass');
    });
    describe('Edit bookmarks', () => {
      it.todo('Should pass');
    });
    describe('Delete bookmarks', () => {
      it.todo('Should pass');
    });
  });
});
