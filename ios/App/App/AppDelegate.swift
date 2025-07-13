import UIKit
import Capacitor
import YandexLoginSDK

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    // MARK: - Application Lifecycle
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        configureYandexLoginSDK()
        print("✅ Yandex Login SDK v\(YandexLoginSDK.version) initialized")
        return true
    }

    // MARK: - URL Handling
    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        return handleYandexLoginURL(url) ||
               handleCapacitorURL(app, url: url, options: options)
    }

    // MARK: - Universal Links
    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        if let url = userActivity.webpageURL, handleYandexLoginURL(url) {
            return true
        }
        return ApplicationDelegateProxy.shared.application(
            application,
            continue: userActivity,
            restorationHandler: restorationHandler
        )
    }

    // MARK: - Private Methods
    private func configureYandexLoginSDK() {
        do {
            try YandexLoginSDK.shared.activate(
                with: "14e2cce0ee3743fe8f1e0da062f95200",
                authorizationStrategy: .webOnly
            )
        } catch {
            print("⚠️ Yandex SDK activation failed: \(error.localizedDescription)")
        }
    }

    private func handleYandexLoginURL(_ url: URL) -> Bool {
        let handled = YandexLoginSDK.shared.tryHandleOpenURL(url)
        if handled {
            print("🔗 Handled Yandex URL: \(url.absoluteString)")
        }
        return handled
    }

    private func handleCapacitorURL(_ app: UIApplication, url: URL, options: [UIApplication.OpenURLOptionsKey: Any]) -> Bool {
        return ApplicationDelegateProxy.shared.application(
            app,
            open: url,
            options: options
        )
    }

    // MARK: - Standard Lifecycle Methods
    func applicationWillResignActive(_ application: UIApplication) {
        print("➡️ App will resign active")
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        print("⬇️ App entered background")
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        print("⬆️ App will enter foreground")
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        print("🔄 App became active")
    }

    func applicationWillTerminate(_ application: UIApplication) {
        print("⏹ App will terminate")
    }
}

// MARK: - SceneDelegate for iOS 13+
@available(iOS 13.0, *)
class SceneDelegate: UIResponder, UIWindowSceneDelegate {

    func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
        guard let url = URLContexts.first?.url else { return }

        if YandexLoginSDK.shared.tryHandleOpenURL(url) {
            print("🔗 Handled Yandex URL via SceneDelegate: \(url.absoluteString)")
        }
    }
}
