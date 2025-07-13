import UIKit
import YandexLoginSDK

@available(iOS 13.0, *)
class SceneDelegate: UIResponder, UIWindowSceneDelegate {

    var window: UIWindow?

    func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
        guard let url = URLContexts.first?.url else { return }
        if YandexLogin.processOpen(url: url) { // Обработка Яндекс.Логина
            return
        }
        // Другие URL-обработчики (если есть)
    }
}
