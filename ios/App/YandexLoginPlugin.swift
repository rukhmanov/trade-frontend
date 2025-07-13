import Capacitor
import YandexLoginSDK

@objc(YandexLoginPlugin)
public class YandexLoginPlugin: CAPPlugin, YandexLoginSDKObserver {
    private var authCall: CAPPluginCall?

    @objc func login(_ call: CAPPluginCall) {
        authCall = call

        DispatchQueue.main.async {
            guard let vc = self.bridge?.viewController else {
                call.reject("No view controller")
                return
            }

            YandexLoginSDK.shared.add(observer: self)

            do {
                try YandexLoginSDK.shared.authorize(
                    with: vc,
                    authorizationStrategy: .default
                )
            } catch {
                call.reject(error.localizedDescription)
            }
        }
    }

    @objc func logout(_ call: CAPPluginCall) {
        do {
            try YandexLoginSDK.shared.logout()
            call.resolve()
        } catch {
            call.reject(error.localizedDescription)
        }
    }

    // MARK: - YandexLoginSDKObserver
    public func didFinishLogin(with result: Result<LoginResult, Error>) {
        switch result {
        case .success(let loginResult):
            authCall?.resolve([
                "token": loginResult.token,
                "jwt": loginResult.jwt
            ])
        case .failure(let error):
            authCall?.reject(error.localizedDescription)
        }
        YandexLoginSDK.shared.remove(observer: self)
    }
}
