import {
  BACKEND_DATA_ENDPOINT,
  BACKEND_CATEGORIES_ENDPOINT,
  BACKEND_DATA_COUNT_ENDPOINT,
} from "../constants/Api";

export const send_request = async (url: string, data: Object) => {
  const res = await fetch(url, data);
  const text = await res.text();
  const status = await res.status;
  let respJSON;
  try {
    respJSON = JSON.parse(text);
  } catch (err) {
    respJSON = {};
  }
  return [respJSON, status];
};

export const getData = async (query: string) => {
  let [respJSON, status] = await send_request(
    `${BACKEND_DATA_ENDPOINT}${query}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  for (let i = 0; i < respJSON.length; i++) {
    respJSON[i] = JSON.parse(respJSON[i]);
  }
  //console.log(respJSON);
  return [respJSON, status];
};

export const getCategories = async (category: string, query: string) => {
  let [respJSON, status] = await send_request(
    `${BACKEND_CATEGORIES_ENDPOINT}${category}${query}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );
  for (let i = 0; i < respJSON.length; i++) {
    respJSON[i] = JSON.parse(respJSON[i]);
  }
  // console.log(respJSON);
  return [respJSON, status];
};

export const getDataCount = async (query: string) => {
  let [respJSON, status] = await send_request(
    `${BACKEND_DATA_COUNT_ENDPOINT}${query}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );
  return [respJSON, status];
};
