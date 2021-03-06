package com.Homecast;

import android.app.Application;

import com.facebook.react.ReactApplication;
import me.jhen.devsettings.DevSettingsPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.oney.WebRTCModule.WebRTCModulePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.zxcpoiu.incallmanager.InCallManagerPackage;
import com.imagepicker.ImagePickerPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.masteratul.exceptionhandler.ReactNativeExceptionHandlerPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;                       import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new DevSettingsPackage(),
            new SplashScreenReactPackage(),
            new ReactNativeExceptionHandlerPackage(),
            new RNFirebasePackage(),
            new PickerPackage(),
            new ImagePickerPackage(),
            new MapsPackage(),
            new FastImageViewPackage(),
            new InCallManagerPackage(),
            new VectorIconsPackage(),
            new WebRTCModulePackage(),
            new RNFirebaseNotificationsPackage(),
            new RNFirebaseMessagingPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
