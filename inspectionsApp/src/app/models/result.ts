export class Result {
  isSuccess: boolean;
  data: any;
  errorMessage: string;
  errorType: number;
  constructor(
    isSuccess: boolean = true,
    data: any = null,
    errorMessage: string = "",
    errorType: number = 0
  ) {
    this.isSuccess = isSuccess;
    this.data = data;
    this.errorMessage = errorMessage;
    this.errorType = errorType;
  }
}
