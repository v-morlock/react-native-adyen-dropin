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
        
        // card
        if let cardConfig = config.value(forKey: "card") as? NSDictionary {
            
            if let showsHolderNameField = cardConfig.value(forKey:"showsHolderNameField") as? Bool{
                nextConfig.card.showsHolderNameField = showsHolderNameField;
            }
            if let showsStorePaymentMethodField = cardConfig.value(forKey:"showsStorePaymentMethodField") as? Bool{
                nextConfig.card.showsStorePaymentMethodField = showsStorePaymentMethodField;
            }
            if let showsSecurityCodeField = cardConfig.value(forKey:"showsSecurityCodeField") as? Bool{
                nextConfig.card.showsSecurityCodeField = showsSecurityCodeField;
            }
            if let billingAddress = cardConfig.value(forKey:"billingAddress") as? String{
                if billingAddress == "full" {
                    nextConfig.card.billingAddress = .full;
                }
                else if billingAddress == "postalCode" {
                    nextConfig.card.billingAddress = .postalCode;
                }
                else {
                    nextConfig.card.billingAddress = .none;
                }
            }
            if let stored = cardConfig.value(forKey:"stored") as? NSDictionary {
                if let showsSecurityCodeField = stored.value(forKey:"showsSecurityCodeField") as? Bool {
                    nextConfig.card.stored.showsSecurityCodeField = showsSecurityCodeField;
                }
            }
        }
        
        // applePay
        
        if let applePayConfig = config.value(forKey: "applePay") as? NSDictionary {
            
            let rawItems = applePayConfig.value(forKey: "summaryItems") as! [NSDictionary]
            let merchantIdentifier = applePayConfig.value(forKey: "merchantId") as! String
            var summaryItems: [PKPaymentSummaryItem] = [];
            
            for item in rawItems {
                let rawAmount = item.value(forKey: "amount") as! Float
                let amount = NSDecimalNumber(string: String(format: "%.2f", rawAmount / 100))
                let label = item.value(forKey: "label") as! String
                
                summaryItems.append(PKPaymentSummaryItem(label: label, amount: amount))
            }
            
            
            nextConfig.applePay = DropInComponent.ApplePayConfiguration(summaryItems: summaryItems, merchantIdentifier: merchantIdentifier)
        }
        
        // localizationParameters
        
        if let localizationParameters = config.value(forKey: "localizationParameters") as? NSDictionary{
            let locale = localizationParameters.value(forKey: "locale") as! String
            nextConfig.localizationParameters = LocalizationParameters(locale: locale)
        }
        
        // payment
        
        if let paymentConfig = config.value(forKey: "payment") as? NSDictionary {
            let countryCode = paymentConfig.value(forKey: "countryCode") as! String
            
            let amount = paymentConfig.value(forKey: "amount") as! NSDictionary
            
            let currencyCode = amount.value(forKey:"currencyCode") as! String
            let value = amount.value(forKey:"value") as! Int
            
            nextConfig.payment = Payment(amount: Payment.Amount(value: value, currencyCode: currencyCode), countryCode: countryCode)
        }
        
        
        return nextConfig
    }
}
