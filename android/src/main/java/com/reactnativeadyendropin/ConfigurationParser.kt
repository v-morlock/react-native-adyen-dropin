package com.reactnativeadyendropin

import android.content.Context
import com.adyen.checkout.card.CardConfiguration
import com.adyen.checkout.card.data.CardType
import com.adyen.checkout.components.model.payments.Amount
import com.adyen.checkout.core.api.Environment
import com.adyen.checkout.core.util.LocaleUtil
import com.adyen.checkout.dropin.DropInConfiguration
import com.adyen.checkout.googlepay.GooglePayConfiguration
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import org.json.JSONObject
import java.util.*

class ConfigurationParser(private val clientKey: String, context: ReactApplicationContext) {

  private val context: Context = context

  private  fun getShopperLocale(config: ReadableMap): Locale {
    val providedShopperLocale = config.getMap("localizationParameters")?.getString("locale")

    if (providedShopperLocale != null) {
      return LocaleUtil.fromLanguageTag(providedShopperLocale)
    }

    return Locale.getDefault()
  }

  private fun getEnvironment(config: ReadableMap): Environment {
    val environmentName = config.getString("environment")

    return when (environmentName) {
      "test" -> Environment.TEST
      "live" -> Environment.EUROPE
      else -> Environment.TEST
    }
  }

  private fun getAmount(config: ReadableMap): Amount {
    val paymentMap = config.getMap("payment")
    val amountMap = paymentMap?.getMap("amount")
    val value = amountMap?.getInt("value")
    val currencyCode = amountMap?.getString("currencyCode")
    if (value != null && currencyCode != null) {
      val json = JSONObject()
        .put("value", value)
        .put("currency", currencyCode)
      val serializer = Amount.SERIALIZER

      return serializer.deserialize(json)
    }

    return Amount()
  }

  private fun getCardConfig(config: ReadableMap): CardConfiguration{
    val cardConfig = config.getMap("card")
    val storedCardConfig = cardConfig?.getMap("stored");

    val shopperLocale = this.getShopperLocale(config)
    val environment = this.getEnvironment(config)
    val showsHolderNameField = cardConfig?.getBoolean("showsHolderNameField")
    val showsStorePaymentMethodField = cardConfig?.getBoolean("showsStorePaymentMethodField")
    val showsSecurityCodeField = cardConfig?.getBoolean("showsSecurityCodeField")
    val showsStoredSecurityCodeField = storedCardConfig?.getBoolean("showsSecurityCodeField")

    val builder =  CardConfiguration.Builder(shopperLocale, environment, this.clientKey)

    if(showsHolderNameField != null){
      builder.setHolderNameRequired(showsHolderNameField)
    }
    if(showsStorePaymentMethodField != null){
      builder.setShowStorePaymentField(showsStorePaymentMethodField)
    }
    if(showsSecurityCodeField != null){
      builder.setHideCvc(!showsSecurityCodeField)
    }

    if(showsStoredSecurityCodeField != null) {
      builder.setHideCvcStoredCard(!showsStoredSecurityCodeField)
    }

    return builder.build()
  }

  private fun getGooglePayConfig(config: ReadableMap): GooglePayConfiguration?{
    val merchantID = config.getMap("googlePay")?.getString("merchantID")
    val shopperLocale = this.getShopperLocale(config)
    val environment = this.getEnvironment(config)

    if(merchantID == null){
      return null
    }

    return GooglePayConfiguration.Builder(shopperLocale, environment, merchantID).build()
  }

  fun parse(config: ReadableMap): DropInConfiguration {
    val environment = this.getEnvironment(config)

    val shopperLocale = this.getShopperLocale(config)

    val cardConfiguration = this.getCardConfig(config)

    val amount = this.getAmount(config)

    val builder = DropInConfiguration.Builder(
      this.context,
      AdyenDropInService::class.java,
      this.clientKey
    )
      .setShopperLocale(shopperLocale)
      .setEnvironment(environment)
      .setAmount(amount)
      .addCardConfiguration(cardConfiguration)

    val googlePayConfig = this.getGooglePayConfig(config);

    if(googlePayConfig != null){
      builder.addGooglePayConfiguration(googlePayConfig)
    }

    return builder.build()
  }
}
