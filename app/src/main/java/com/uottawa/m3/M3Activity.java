package com.uottawa.m3;

import com.phonegap.*;
import android.os.Bundle;

public class M3Activity extends DroidGap {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //Actual Application
        super.loadUrl("file:///android_asset/www/M3.html");
        

    }
}
