package com.la7agli.delivery

import android.app.Application
import com.la7agli.delivery.di.appModule
import com.la7agli.delivery.di.networkModule
import com.la7agli.delivery.di.viewModelModule
import org.koin.android.ext.koin.androidContext
import org.koin.android.ext.koin.androidLogger
import org.koin.core.context.startKoin

class La7agliApp : Application() {
    override fun onCreate() {
        super.onCreate()
        
        startKoin {
            androidLogger()
            androidContext(this@La7agliApp)
            modules(listOf(appModule, networkModule, viewModelModule))
        }
    }
}