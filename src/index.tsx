import React from 'react';
import { requireNativeComponent, ViewStyle } from 'react-native';

export interface ConfigInterface {
  card?: CardConfiguration | undefined;
  applePay?: ApplePayConfiguration | undefined;
  googlePay?: GooglePayConfiguration | undefined;
  clientKey: string;
  localizationParameters?: LocalizationParameters | undefined;
  payment: Payment;

  environment: 'test' | 'live';
}

export interface GooglePayConfiguration {
  merchantID: string;
}

export interface CardConfiguration {
  showsHolderNameField?: boolean | undefined;
  showsStorePaymentMethodField?: boolean | undefined;
  showsSecurityCodeField?: boolean | undefined;
  billingAddress?: AddressFormType | undefined;
  stored?: StoredCardConfiguration | undefined;
}

export enum AddressFormType {
  FULL = 'full',
  POSTAL_CODE = 'postalCode',
  NONE = 'none',
}

export interface StoredCardConfiguration {
  showsSecurityCodeField?: boolean | undefined;
}

export interface PKPaymentSummaryItem {
  label: string;
  amount: number;
  type: 'FINAL' | 'PENDING';
}

export interface ApplePayConfiguration {
  summaryItems: PKPaymentSummaryItem[];
  merchantIdentifier: string;
  // todo requiredBillingContactFields, requiredShippingContactFields
}

export interface LocalizationParameters {
  /**
   * The locale for external resources.
   * By default current locale is used.
   */
  locale?: string | undefined;
  tableName?: string | undefined;
  // todo keySeparator, bundle
}

export interface Amount {
  /** The value of the amount in minor units. */
  value: number;
  /** The code of the currency in which the amount's value is specified */
  currencyCode: string;
}

export interface Payment {
  amount: Amount;
  countryCode: string;
}

export type AdyenDropInProps = {
  debug?: boolean | undefined;
  visible?: boolean | undefined;
  paymentMethods?: unknown | undefined;
  paymentMethodsConfiguration: ConfigInterface;
  paymentResponse?: any | undefined;
  detailsResponse?: any | undefined;
  onSubmit?: Function | undefined;
  onAdditionalDetails?: Function | undefined;
  onError?: Function | undefined;
  onSuccess?: Function | undefined;
  onClose?: Function | undefined;
  style?: ViewStyle | undefined;
};

export const AdyenDropInModule = requireNativeComponent<AdyenDropInProps>(
  'AdyenDropIn'
);

function cleanEvent(event: any): any {
  if (event && typeof event === 'object' && event.target !== undefined) {
    delete event.target;
  }

  return event;
}

const AdyenDropIn = React.forwardRef(
  (
    {
      debug = false,
      visible = false,
      paymentMethods,
      paymentMethodsConfiguration,
      paymentResponse,
      detailsResponse,
      onSubmit,
      onAdditionalDetails,
      onError,
      onSuccess,
      onClose,
      style,
    }: AdyenDropInProps,
    ref
  ) => {
    const forwardedRef = ref as React.RefObject<any>;

    function handleSubmit(event: any) {
      onSubmit?.(cleanEvent(event.nativeEvent));
    }

    function handleError(event: any) {
      onError?.(cleanEvent(event.nativeEvent));
    }

    function handleAdditionalDetails(event: any) {
      onAdditionalDetails?.(cleanEvent(event.nativeEvent));
    }

    function handleSuccess(event: any) {
      onSuccess?.(cleanEvent(event.nativeEvent));
    }

    function handleClose(event: any) {
      onClose?.(cleanEvent(event.nativeEvent));
    }

    return (
      <AdyenDropInModule
        ref={forwardedRef}
        debug={debug}
        visible={visible}
        paymentMethods={paymentMethods ?? {}}
        paymentMethodsConfiguration={paymentMethodsConfiguration}
        paymentResponse={paymentResponse}
        detailsResponse={detailsResponse}
        onSubmit={handleSubmit}
        onAdditionalDetails={handleAdditionalDetails}
        onError={handleError}
        onSuccess={handleSuccess}
        onClose={handleClose}
        style={style}
      />
    );
  }
);

export default AdyenDropIn;
