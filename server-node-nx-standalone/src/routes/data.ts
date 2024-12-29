import express from "express";
import {
  getQueryParamStatus,
  HTTP_STATUS_CODE,
  onErrorMsg,
  onSuccessMsg
} from "./utils";
import LOGGER from "../utils/logger";

const router = express.Router();

type Data = {
  name: string;
  age: number;
  createdAt: Date;
};

const dataArr: Data[] = [
  {
    name: "John Doe",
    age: 30,
    createdAt: new Date()
  },
  {
    name: "Jane Doe",
    age: 25,
    createdAt: new Date()
  },
  {
    name: "Alice Smith",
    age: 35,
    createdAt: new Date()
  },
  {
    name: "John Smith",
    age: 40,
    createdAt: new Date()
  },
  {
    name: "Alice Doe",
    age: 20,
    createdAt: new Date()
  }
];

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

router.get("/api/data", (req, res) => {
  let dataArrFiltered: Data[] = dataArr;
  LOGGER.debug(JSON.stringify(req.query));

  // Possible Regex: /api/data?queryParamAge={age}&queryParamName={name}
  const expectedQueryParams = new Set(["queryParamAge", "queryParamName"]);
  const queryParamStatus = getQueryParamStatus(req.query, expectedQueryParams);
  if (queryParamStatus === "INVALID QUERY - INCORRECT NUMBER OF ARGUMENTS") {
    return res
      .status(HTTP_STATUS_CODE.UNPROCESSABLE_CONTENT)
      .json(onErrorMsg("Not enough query parameters"));
  } else if (queryParamStatus === "INVALID QUERY - UNEXPECTED PARAMETER") {
    return res
      .status(HTTP_STATUS_CODE.UNPROCESSABLE_CONTENT)
      .json(onErrorMsg("Unexpected query parameter"));
  } else if (queryParamStatus === "VALID QUERY") {
    const { queryParamAge, queryParamName } = req.query as {
      queryParamAge: string;
      queryParamName: string;
    };
    const age = parseInt(queryParamAge);
    const name = queryParamName;
    LOGGER.debug(`Age: ${age}, Name: ${name}`);
    dataArrFiltered = dataArr.filter(
      (data) => data.age >= age && data.name.startsWith(name)
    );
  }
  return res.status(HTTP_STATUS_CODE.OK).json(onSuccessMsg(dataArrFiltered));
});

router.get("/api/data/:pathParamAge/:pathParamName", (req, res) => {
  const { pathParamName, pathParamAge } = req.params as {
    pathParamName: string;
    pathParamAge: string;
  };
  const age = parseInt(pathParamAge);
  const name = pathParamName;
  LOGGER.debug(`Age: ${age}, Name: ${name}`);
  const result = dataArr.find(
    (data) => data.age >= age && data.name.startsWith(name)
  );
  if (result == null) {
    return res
      .status(HTTP_STATUS_CODE.NOT_FOUND)
      .json(onErrorMsg("Data not found"));
  }
  return res.status(HTTP_STATUS_CODE.OK).json(onSuccessMsg(result));
});

router.get("/api/data/error", (_, res) => {
  return res
    .status(HTTP_STATUS_CODE.IM_A_TEAPOT)
    .json(onErrorMsg("Error fetching data"));
});

export { router as DATA_ROUTER };
