import { Body, Controller, Delete, Get, Logger, Param, Post, Put, UseGuards } from "@nestjs/common";
import { SubjectService } from "./subject.service";
import { FirebaseJwtAuthGuard } from "../../guards";
import { CurrentUser } from "../../decorators";
import { ICurrentUser } from "@app/types/interfaces";
import { CreateSubjectDto, UpdateSubjectDto } from "@app/types/dtos/task";

@UseGuards(FirebaseJwtAuthGuard)
@Controller("subject")
export class SubjectController {
  private readonly logger = new Logger(this.constructor.name);
  constructor(private readonly subjectService: SubjectService) {}

  @Get("/mine")
  async getAllSubjectsByUserId(@CurrentUser() user: ICurrentUser) {
    return this.subjectService.getAllSubjectsByUserId(user.userId);
  }

  @Get("/:id")
  async getSubjectById(@Param("id") id: string) {
    return this.subjectService.getSubjectById(id);
  }

  @Post("")
  async createSubject(@CurrentUser() user: ICurrentUser, @Body() data: CreateSubjectDto) {
    return this.subjectService.createSubject(user.userId, data);
  }

  @Put("/:id")
  async updateSubject(@Param("id") id: string, @Body() data: UpdateSubjectDto) {
    return this.subjectService.updateSubject(id, data);
  }

  @Delete("/:id")
  async deleteSubject(@Param("id") id: string) {
    return this.subjectService.deleteSubject(id);
  }
}
