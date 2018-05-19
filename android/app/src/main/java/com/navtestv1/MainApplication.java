package com.navtestv1;

import android.app.Application;

import com.facebook.react.ReactApplication;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.imagepicker.ImagePickerPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.zxcpoiu.incallmanager.InCallManagerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.oney.WebRTCModule.WebRTCModulePackage;
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
            new SplashScreenReactPackage(),
            new PickerPackage(),
            new ImagePickerPackage(),
            new MapsPackage(),
            new FastImageViewPackage(),
            new InCallManagerPackage(),
            new VectorIconsPackage(),
            new WebRTCModulePackage()

      );
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
