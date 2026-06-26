import { ArgumentMetadata, Injectable, ValidationPipe } from "@nestjs/common";

@Injectable()
export class ProtoValidationPipe extends ValidationPipe {
  async transform(value: unknown, metadata: ArgumentMetadata): Promise<unknown> {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      for (const key of Object.keys(value as object)) {
        if (key.startsWith("_")) {
          delete (value as Record<string, unknown>)[key];
        }
      }
    }
    return super.transform(value, metadata);
  }
}
