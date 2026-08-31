import { Test } from "@nestjs/testing";
import { UserRolesService } from "./user_roles.service";
import type { TestingModule } from "@nestjs/testing";

describe("UserRolesService", () => {
  let service: UserRolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRolesService],
    }).compile();

    service = module.get<UserRolesService>(UserRolesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
