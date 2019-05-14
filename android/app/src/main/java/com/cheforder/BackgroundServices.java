package com.cheforder;
import android.content.Intent;
import android.os.Bundle;
import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;

/**
 * Created by Manish Budhiraja on 26/05/17.
 */

public class BackgroundServices extends HeadlessJsTaskService {
    @Override
    protected HeadlessJsTaskConfig getTaskConfig(Intent intent){
        Bundle extras = intent.getExtras();
        if(extras != null){
            return new HeadlessJsTaskConfig(
                    "BackgroundServices",
                    Arguments.fromBundle(extras),
                    50
            );
        }
        return null;
    }
}
