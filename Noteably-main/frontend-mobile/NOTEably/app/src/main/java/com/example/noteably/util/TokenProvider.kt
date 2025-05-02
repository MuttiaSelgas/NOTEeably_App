package com.example.noteably.util

import android.content.Context
import android.content.SharedPreferences

object TokenProvider {
    private const val PREF_NAME = "noteably_prefs"
    private const val KEY_TOKEN = "jwt_token"
    private lateinit var prefs: SharedPreferences

    var token: String? = null
        private set

    fun init(context: Context) {
        prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
        token = prefs.getString(KEY_TOKEN, null)
    }

    fun saveToken(newToken: String) {
        token = newToken
        prefs.edit().putString(KEY_TOKEN, newToken).apply()
    }

    fun clearToken() {
        token = null
        prefs.edit().remove(KEY_TOKEN).apply()
    }
}