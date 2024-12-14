import { Module } from "@nestjs/common";
import { TaskController } from "./task.controller";
import { TaskService } from "./task.service";
import { SubjectRepository, TaskRepository } from "@app/database/repositories";
import { DatabaseModule } from "@app/database";
import { Subject, SubjectSchema, Task, TaskSchema } from "@app/database/entities";
import { SubjectService } from "./subject.service";
import { SubjectController } from "./subject.controller";

@Module({
  imports: [
    DatabaseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: Subject.name, schema: SubjectSchema },
    ]),
  ],
  controllers: [TaskController, SubjectController],
  providers: [TaskService, TaskRepository, SubjectService, SubjectRepository],
})
export class TaskModule {}
