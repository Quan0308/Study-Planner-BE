import { Module } from '@nestjs/common';
import { SharedModulesService } from './shared-modules.service';

@Module({
  providers: [SharedModulesService],
  exports: [SharedModulesService],
})
export class SharedModulesModule {}
