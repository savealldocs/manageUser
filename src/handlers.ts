import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as AWS from "aws-sdk";
import { v4 } from "uuid";
import * as yup from "yup";

const docClient = new AWS.DynamoDB.DocumentClient();
const headers = {
  "content-type": "application/json",
};
const tableName = "UsersTable";
const schema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().required(),
  dob: yup.string().required(),
});

class HttpError extends Error {
  constructor(public statusCode: number, body: Record<string, unknown> = {}) {
    super(JSON.stringify(body));
  }
}

/**
 *
 * @param e
 * @returns
 */
const handleError = (e: unknown) => {
  if (e instanceof yup.ValidationError) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        errors: e.errors,
      }),
    };
  }

  if (e instanceof SyntaxError) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error: `invalid request body format : "${e.message}"`,
      }),
    };
  }

  if (e instanceof HttpError) {
    return {
      statusCode: e.statusCode,
      headers,
      body: e.message,
    };
  }

  throw e;
};

/**
 *
 * @param id
 * @returns
 */
const fetchUserByObj = async (obj: any) => {
  const output = await docClient
    .get({
      TableName: tableName,
      Key: obj,
    })
    .promise();

  if (!output.Item) {
    throw new HttpError(404, { error: "not found" });
  }

  return output.Item;
};

/**
 *
 * @param event
 * @returns
 */
const createUser = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const reqBody = JSON.parse(event.body as string);

    await schema.validate(reqBody, { abortEarly: false });
    const email = event.pathParameters?.email as string;
    const obj = { email };
    const users = {
      ...reqBody,
      userId: v4(),
    };
    await docClient
      .put({
        TableName: tableName,
        Item: users,
      })
      .promise();

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify(users),
    };
  } catch (e) {
    return handleError(e);
  }
};

/**
 *
 * @param event
 * @returns
 */
const getUser = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id as string;
    const obj = { userId: id };
    const userData = await fetchUserByObj(obj);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(userData),
    };
  } catch (e) {
    return handleError(e);
  }
};

/**
 *
 * @param event
 * @returns
 */
const deleteUser = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id as string;
    const obj = { userId: id };
    await fetchUserByObj(obj);

    await docClient
      .delete({
        TableName: tableName,
        Key: {
          userId: id,
        },
      })
      .promise();

    return {
      statusCode: 204,
      body: "",
    };
  } catch (e) {
    return handleError(e);
  }
};

export { createUser, getUser, deleteUser };
