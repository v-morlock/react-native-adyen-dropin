import React, { useState, useEffect } from 'react';
import { Alert, Button } from 'react-native';

import { StyleSheet, View } from 'react-native';
import AdyenDropIn from '@ancon/react-native-adyen-dropin';

const { default: config } = __DEV__
  ? require('../config')
  : require('../config.example');

// @ts-ignore
import * as services from './services';

export default function App() {
  const [visible, setVisible] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState(null);
  const [paymentResponse, setPaymentResponse] = useState(null);
  const [detailsResponse, setDetailsResponse] = useState(null);

  const [error, setError] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const response = await services.getPaymentMethods();
        setPaymentMethods(response);
      } catch (err) {
        setError(err);
      }
    }

    init();
  }, []);

  useEffect(() => {
    if (error && !visible) {
      console.log('Show error', error);
      Alert.alert(
        'Payment failure',
        JSON.stringify(error ?? {}, undefined, 2),
        [
          {
            onPress: () => setError(null),
          },
        ]
      );
    }
  }, [error, visible]);

  async function handleSubmit(data: any) {
    try {
      console.log('running handleSubmit');
      console.log(data);
      const response = await services.makePayment(data);
      console.log('handleSubmit response');
      console.log(response);
      setPaymentResponse(response);
    } catch (err) {
      setIsClosing(true);
      setError(err);
    }
  }

  async function handleAdditionalDetails(data: any) {
    try {
      console.log('running handleAdditionalDetails');
      console.log(data);
      const response = await services.makeDetailsCall(data);
      console.log('handleAdditionalDetails response');
      console.log(response);
      setDetailsResponse(response);
    } catch (err) {
      setIsClosing(true);
      setError(err);
    }
  }

  function handleError(data: any) {
    console.log('handleError', data);
    setError(data);
  }

  function handleSuccess(data: any) {
    console.log('handleSuccess', data);
    Alert.alert('Payment success', JSON.stringify(data ?? {}, undefined, 2));
  }

  function handleClose() {
    setVisible(false);
    setIsClosing(false);
  }

  return (
    <View style={styles.container}>
      <AdyenDropIn
        debug={__DEV__}
        visible={isClosing === true ? false : visible}
        paymentMethods={paymentMethods}
        paymentMethodsConfiguration={{
          clientKey: config.clientKey,
          environment: config.environment,
          applePay: {
            merchantIdentifier: config.applePay?.configuration?.merchantId,
            summaryItems: [{ label: 'Total', amount: 1, type: 'FINAL' }],
          },
          payment: {
            amount: { value: 1, currencyCode: 'SEK' },
            countryCode: config.countryCode,
          },
        }}
        paymentResponse={paymentResponse}
        detailsResponse={detailsResponse}
        onSubmit={handleSubmit}
        onAdditionalDetails={handleAdditionalDetails}
        onError={handleError}
        onSuccess={handleSuccess}
        onClose={handleClose}
      />
      <Button title="Start payment" onPress={() => setVisible(true)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
