import {
  AddressFormType,
  ConfigInterface,
} from '@ancon/react-native-adyen-dropin';

const config: ConfigInterface = {
  clientKey: '<enter clientKey here>',
  environment: 'test',
  card: {
    billingAddress: AddressFormType.FULL,
    showsSecurityCodeField: true,
    stored: {
      showsSecurityCodeField: false,
    },
  },
  payment: {
    amount: { currencyCode: 'EUR', value: 20 },
    countryCode: 'DE-de',
  },
};

export default config;
