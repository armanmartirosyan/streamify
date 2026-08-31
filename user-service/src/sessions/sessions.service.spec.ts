import { Test } from "@nestjs/testing";
import { SessionsService } from "./sessions.service";
import type { TestingModule } from "@nestjs/testing";

describe("SessionsService", () => {
  let service: SessionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionsService],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
