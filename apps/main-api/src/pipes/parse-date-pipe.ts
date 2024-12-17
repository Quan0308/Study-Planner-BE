import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ParseDatePipe implements PipeTransform {
  constructor(private readonly required: boolean = true) {}
  transform(value: string | undefined | null): Date {
    if (!this.required && !value) {
      return value as undefined | null;
    }

    if (!value) {
      throw new BadRequestException("Date is required");
    }

    const transformedValue = new Date(value);

    if (isNaN(transformedValue.getTime())) {
      throw new BadRequestException("Invalid date");
    }

    return transformedValue;
  }
}
