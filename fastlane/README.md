fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## iOS

### ios publish_internal_test

```sh
[bundle exec] fastlane ios publish_internal_test
```

Push a new test build to TestFlight

### ios publish_open_test

```sh
[bundle exec] fastlane ios publish_open_test
```

Publish the latest build to open testing

### ios publish_production

```sh
[bundle exec] fastlane ios publish_production
```

Publish the latest build to production

----


## Android

### android publish_internal_test

```sh
[bundle exec] fastlane android publish_internal_test
```

Push a new test build to Play Store

### android publish_open_test

```sh
[bundle exec] fastlane android publish_open_test
```

Publish the latest build to open testing

### android publish_production

```sh
[bundle exec] fastlane android publish_production
```

Publish the latest build to production

### android app_icon

```sh
[bundle exec] fastlane android app_icon
```



----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
