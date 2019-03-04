package com.redislabs.university.health;

import com.codahale.metrics.health.HealthCheck;
import com.codahale.metrics.health.HealthCheck.Result;

public class RediSolarHealthCheck extends HealthCheck {

    public RediSolarHealthCheck() {
    }

    @Override
    protected Result check() throws Exception {
        return Result.healthy();
    }
}
