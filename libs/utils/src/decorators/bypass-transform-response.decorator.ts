import { SetMetadata } from "@nestjs/common";

export const BypassTransformResponse = () => SetMetadata("bypass-transform-response", true);
