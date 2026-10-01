type ErrorResponse = {
  path: string;
  msg: string;
  message:string
};

type ErrorObject = Record<string, string>;

export const mapErrorsToErrorObject = (errors: ErrorResponse[]): ErrorObject => {

  return errors.reduce((acc: ErrorObject, cur: ErrorResponse) => {
    
    acc[cur.path] = cur.msg?cur.msg:cur.message;
    return acc;
  }, {});
};


