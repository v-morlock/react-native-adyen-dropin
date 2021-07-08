import React from 'react';
import { requireNativeComponent, ViewStyle } from 'react-native';

export interface ConfigInterface {
  card?: CardConfiguration;
  applePay?: ApplePayConfiguration;
  googlePay?: GooglePayConfiguration;
  clientKey: string;
  localizationParameters?: LocalizationParameters;
  payment: Payment;

  environment: 'test' | 'live';
}

export interface GooglePayConfiguration {
  merchantID: string;
}

export interface CardConfiguration {
  showsHolderNameField?: boolean;
  showsStorePaymentMethodField?: boolean;
  showsSecurityCodeField?: boolean;
  billingAddress?: AddressFormType;
  stored?: StoredCardConfiguration;
}

export enum AddressFormType {
  FULL = 'full',
  POSTAL_CODE = 'postalCode',
  NONE = 'none',
}

export interface StoredCardConfiguration {
  showsSecurityCodeField?: boolean;
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
  debug?: boolean;
  visible?: boolean;
  paymentMethods?: unknown;
  paymentMethodsConfiguration: ConfigInterface;
  paymentResponse?: any;
  detailsResponse?: any;
  onSubmit?: Function;
  onAdditionalDetails?: Function;
  onError?: Function;
  onSuccess?: Function;
  onClose?: Function;
  style?: ViewStyle;
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
