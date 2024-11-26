export interface ISuccessResponse<T> {
  statusCode: number;
  message: string;
  data?: T | object | object[] | null;
}
