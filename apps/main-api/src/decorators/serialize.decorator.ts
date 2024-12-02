import { SERIALIZE_KEY } from "@app/types/constants";
import { SetMetadata } from "@nestjs/common";

export const Serialize = (cls: new () => any) => SetMetadata(SERIALIZE_KEY, cls);
