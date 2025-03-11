import { HTTPError } from 'ky';
import { apiClient } from '../apiClient';
import { API_URLS } from '../apiConstants';
import { returnErrorFromHTTPError } from '../error';

export const postDevLogin = async (loginInfo: {
  name: string;
  password: string;
}) => {
  try {
    await apiClient.post(API_URLS.DEV_LOGIN, { json: loginInfo });
  } catch (httpError) {
    if (httpError instanceof HTTPError) {
      const error = await returnErrorFromHTTPError(httpError);
      throw error;
    }
    throw httpError;
  }
};
