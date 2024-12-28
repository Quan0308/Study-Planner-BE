import { Body, Controller, Param, Post, Put, UseGuards } from "@nestjs/common";
import { SessionService } from "./session.service";
import { CreateSessionDto, UpdateSessionDto } from "@app/types/dtos/sessions";
import { CurrentUser } from "../../decorators";
import { ICurrentUser } from "@app/types/interfaces";
import { FirebaseJwtAuthGuard } from "../../guards";

@UseGuards(FirebaseJwtAuthGuard)
@Controller("sessions")
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  async startSession(@Body() data: CreateSessionDto, @CurrentUser() user: ICurrentUser) {
    return this.sessionService.createNewSession(data, user);
  }

  @Put(":id")
  async updateSession(@Param("id") id: string, @Body() data: UpdateSessionDto, @CurrentUser() user: ICurrentUser) {
    return this.sessionService.updateExistedSession(id, data, user);
  }
}
