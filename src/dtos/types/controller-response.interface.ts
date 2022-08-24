export interface IControllerResponse<T> {
  statusCode: number;
  toSend: {
    data: T;
    Message: "Success" | "Failure";
  };
}

export interface IControllerResponsePaginated<T> {
  statusCode: number;
  toSend: {
    data: {
      [key: string]: any;
      paginationData: {
        currentPage: number;
        perPage: number;
        totalPages: number;
        total?: number;
      };
    };
    Message: "Success" | "Failure";
  };
}
