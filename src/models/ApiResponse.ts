export function ApiResponse<T>() {
  abstract class Response {
    Error?: number;
    Data?: T[];
    Msg?: string;

    /* static methods */
    public static fromJson(): T {
      return null!;
    }

    public static toJson(value: T): string {
      return JSON.stringify(value);
    }

    /*  instance methods */
  }
  return Response;
}

export function ApiSingleObjectResponse<T>() {
  abstract class Response {
    Error?: number;
    Data?: T;
    Msg?: string;

    /* static methods */
    public static fromJson(): T {
      return null!;
    }

    public static toJson(value: T): string {
      return JSON.stringify(value);
    }

    /*  instance methods */
  }
  return Response;
}