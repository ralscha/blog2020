Code for blog post: https://blog.rasc.ch/2020/04/capacitor-push-notification.html

## Android build

Use JDK 21, Android SDK 36 and the checked-in Gradle 8.14.6 wrapper. The
Capacitor 8 Android library uses Android Gradle Plugin 8.13; Dependabot holds
the wrapper below Gradle 9 until that toolchain can be upgraded together.

From `client`, install dependencies, build the web application and synchronize
the native project:

```sh
npm install
npm run build
npx cap sync android
cd android
./gradlew assembleDebug testDebugUnitTest
```

Use `gradlew.bat` on Windows. Configure `ANDROID_HOME` with the SDK location.
Add your Firebase project's `google-services.json` to `android/app` to enable
push notifications; a build without that file cannot test Firebase delivery.
