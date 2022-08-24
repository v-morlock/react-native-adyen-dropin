import { Platform } from 'react-native';

export const httpPost = async (url, data) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      'Authorization': '',
      'x-channel': Platform.OS,
    },
    body: JSON.stringify(data) ?? '{}',
  });

  const responseData = await response.json();

  if (response.ok) {
    if (
      responseData.refusalReasonCode != null &&
      responseData.refusalReasonCode !== '0'
    ) {
      throw responseData;
    }

    return responseData;
  }

  throw responseData;
};

const BASE_URL = 'http://192.168.1.74:3000/api';

export const getPaymentMethods = async (configuration) =>
  httpPost(`${BASE_URL}/paymentMethods`, configuration);
