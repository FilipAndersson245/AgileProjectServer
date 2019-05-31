import { MysqlError } from "mysql";

interface ISqlResult<T> {
  readonly data?: T;
  readonly error?: MysqlError;
}

export const sqlpromiseHandler = async <T>(
  promise: Promise<T>
): Promise<ISqlResult<T>> => {
  try {
    const data = await promise;
    return { data, error: undefined };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }
    return { error, data: undefined };
  }
};
