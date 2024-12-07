import { Test, TestingModule } from "@nestjs/testing";
import { FilesModule } from "./files.module";

describe("Files", () => {
  let provider: FilesModule;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilesModule],
    }).compile();

    provider = module.get<FilesModule>(FilesModule);
  });

  it("should be defined", () => {
    expect(provider).toBeDefined();
  });
});
