import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { SessionService } from "./session.service";
import { CreateSessionDto, UpdateSessionDto } from "@app/types/dtos/sessions";
import { CurrentUser } from "../../decorators";
import { ICurrentUser } from "@app/types/interfaces";
import { FirebaseJwtAuthGuard } from "../../guards";
import { ParseDatePipe } from "../../pipes";

@UseGuards(FirebaseJwtAuthGuard)
@Controller("sessions")
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get()
  async getSessionHistory(
    @CurrentUser() user: ICurrentUser,
    @Query("from", new ParseDatePipe(false)) from: Date,
    @Query("to", new ParseDatePipe(false)) to: Date,
    @Query("status") status?: string | string[]
  ) {
    return this.sessionService.getSessionHistory(user, from, to, status);
  }

  @Post()
  async startSession(@Body() data: CreateSessionDto, @CurrentUser() user: ICurrentUser) {
    return this.sessionService.createNewSession(data, user);
  }

  @Put(":id")
  async updateSession(@Param("id") id: string, @Body() data: UpdateSessionDto, @CurrentUser() user: ICurrentUser) {
    return this.sessionService.updateExistedSession(id, data, user);
  }
}
