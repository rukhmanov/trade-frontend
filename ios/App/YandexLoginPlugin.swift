import Foundation
import Capacitor
import YandexLoginSDK

@objc(YandexLoginPlugin)
public class YandexLoginPlugin: CAPPlugin {
  @objc func login(_ call: CAPPluginCall) {
    let config = YandexLoginConfiguration(clientId: "14e2cce0ee3743fe8f1e0da062f95200")
    YandexLogin.shared.login(with: config, presenting: bridge?.viewController ?? UIViewController()) { result in
      switch result {
      case .success(let token):
        call.resolve([
          "accessToken": token.accessToken,
          "expiresIn": token.expiresIn,
          "userID": token.userID
        ])
      case .failure(let error):
        call.reject("Login failed", error.localizedDescription)
      }
    }
  }
}
