plugins {
    alias(libs.plugins.androidApplication)
    alias(libs.plugins.jetbrainsKotlinAndroid)
    id("kotlin-kapt")
    id("kotlin-parcelize")
}

android {
    namespace = "com.example.noteably"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.example.noteably"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }

    kotlinOptions {
        jvmTarget = "1.8"
    }

    buildFeatures {
        viewBinding = true
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.appcompat)
    implementation(libs.material)
    implementation(libs.androidx.activity)
    implementation(libs.androidx.constraintlayout)
    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
    implementation(libs.androidx.core.splashscreen)

    implementation(libs.retrofit)
    implementation(libs.retrofit2.converter.gson)
    implementation (libs.logging.interceptor)
    implementation (libs.androidx.security.crypto)

    // Glide
    implementation(libs.glide)
    kapt(libs.compiler)

    // RecyclerView
    implementation(libs.androidx.recyclerview)

    // CardView (for nice-looking task cards)
    implementation(libs.androidx.cardview)

    // Lifecycle components for ViewModel + LiveData (optional but recommended)
    implementation(libs.androidx.lifecycle.livedata.ktx)
    implementation(libs.androidx.lifecycle.viewmodel.ktx)

    // Gson (just in case Retrofit converter needs it directly)
    implementation(libs.gson)
}
