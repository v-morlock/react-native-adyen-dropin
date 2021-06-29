//
//  PaymentMethodsConfiguration.swift
//  react-native-adyen-dropin
//
//  Created by Jesper Johansson on 2021-05-05.
//

import Adyen
import PassKit

struct ConfigurationParser {
  static func getEnvironment(_ environmentName: String) -> Environment {
    switch environmentName {
      case "test":
        return Environment.test
      case "live":
        return Environment.live
      default:
        return Environment.test
    }
  }
  
  let clientKey: String
  let config: DropInComponent.PaymentMethodsConfiguration
  
  init(_ clientKey: String) {
    self.clientKey = clientKey
    self.config = DropInComponent.PaymentMethodsConfiguration(clientKey: clientKey)
  }
  
  func parse(_ config: NSDictionary) -> DropInComponent.PaymentMethodsConfiguration {
    let nextConfig = self.config
    
    if let amountConfig = config.value(forKey: "amount") as? NSDictionary {
      let value = amountConfig.value(forKey: "value") as! Int
      let currencyCode = amountConfig.value(forKey: "currencyCode") as! String
      let amount = Payment.Amount(value: value, currencyCode: currencyCode)
      nextConfig.payment = Payment(amount: amount)
      
      if let countryCode = config.value(forKey: "countryCode") as? String {
        nextConfig.payment?.countryCode = countryCode
      }
    }
    
    if let applePayConfig = config.value(forKey: "applePay") as? NSDictionary {
      let amount = NSDecimalNumber(string: String(format: "%.2f", Float(nextConfig.payment?.amount.value ?? 0) / 100))
      let summaryItem = PKPaymentSummaryItem(label: "Total", amount: amount, type: .final)
      
      if let amountConfig = applePayConfig.value(forKey: "amount") as? NSDictionary {
        if let applePayAmount = amountConfig.value(forKey: "value") as? Int {
          summaryItem.amount = NSDecimalNumber(value: applePayAmount)
        }
        
        if let applePayCountryCode = amountConfig.value(forKey: "countryCode") as? String {
          nextConfig.payment?.countryCode = applePayCountryCode
        }
      }
      
      if let nestedConfig = applePayConfig.value(forKey: "configuration") as? NSDictionary {
        if let merchantIdentifier = nestedConfig.value(forKey: "merchantId") as? String {
          nextConfig.applePay = DropInComponent.ApplePayConfiguration(summaryItems: [summaryItem], merchantIdentifier: merchantIdentifier)
        }
      }
    }

    if let locale = config.value(forKey: "locale") as? String {
      nextConfig.localizationParameters = LocalizationParameters(locale: locale)
    }
    
    return nextConfig
  }
}
