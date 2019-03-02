/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTLinkingManager.h>
#import <Firebase.h>
#import "RNFirebaseMessaging.h"
#import "RNFirebaseNotifications.h"
#import "RNSplashScreen.h"  

@import GoogleMaps;
@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
  [RNFirebaseNotifications configure];
 // [[UNUserNotificationCenter currentNotificationCenter] setDelegate:self];
  [GMSServices provideAPIKey:@"AIzaSyBI8XPW03pYA9WiEKjUiJ4d0Phz6e8VZE8"];
  NSURL *jsCodeLocation;

  jsCodeLocation = [NSURL URLWithString:@"http://192.168.1.76:8081/index.ios.bundle?platform=ios&dev=true&minify=false"];
  //jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"Homecast"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [UIColor blackColor];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  [RNSplashScreen show];
  return YES;
}

 - (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
  {
    return [RCTLinkingManager application:application openURL:url
                        sourceApplication:sourceApplication annotation:annotation];
  }

- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
    [[RNFirebaseNotifications instance] didReceiveLocalNotification:notification];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo
fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler{
    [[RNFirebaseNotifications instance] didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}

- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings {
    [[RNFirebaseMessaging instance] didRegisterUserNotificationSettings:notificationSettings];
}
@end
