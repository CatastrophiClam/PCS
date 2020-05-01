import {
  BACKEND_DATA_ENDPOINT,
  BACKEND_CATEGORIES_ENDPOINT,
} from "../constants/Api";

export const getData = async (query: string) => {
  const res = await fetch(`${BACKEND_DATA_ENDPOINT}${query}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
  const text = await res.text();
  const status = await res.status;
  let respJSON;
  try {
    respJSON = JSON.parse(text);
  } catch (err) {
    respJSON = {};
  }
  for (let i = 0; i < respJSON.length; i++) {
    respJSON[i] = JSON.parse(respJSON[i]);
  }
  console.log(respJSON);
  return [respJSON, status];
};

export const getCategories = async (query: string) => {
  const res = await fetch(`${BACKEND_CATEGORIES_ENDPOINT}${query}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
  const text = await res.text();
  const status = await res.status;
  let respJSON;
  try {
    respJSON = JSON.parse(text);
  } catch (err) {
    respJSON = {};
  }
  for (let i = 0; i < respJSON.length; i++) {
    respJSON[i] = JSON.parse(respJSON[i]);
  }
  console.log(respJSON);
  return [respJSON, status];
};
