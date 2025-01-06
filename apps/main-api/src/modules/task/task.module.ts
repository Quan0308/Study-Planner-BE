import { Module } from "@nestjs/common";
import { TaskController } from "./task.controller";
import { TaskService } from "./task.service";
import { SessionRepository, SubjectRepository, TaskRepository } from "@app/database/repositories";
import { DatabaseModule } from "@app/database";
import { Subject, SubjectSchema, Task, TaskSchema, Session, SessionSchema } from "@app/database/entities";
import { SubjectService } from "./subject.service";
import { SubjectController } from "./subject.controller";
import { SessionController } from "./session.controller";
import { SessionService } from "./session.service";

@Module({
  imports: [
    DatabaseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: Subject.name, schema: SubjectSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
  ],
  controllers: [TaskController, SubjectController, SessionController],
  providers: [TaskService, TaskRepository, SubjectService, SubjectRepository, SessionService, SessionRepository],
})
export class TaskModule {}
