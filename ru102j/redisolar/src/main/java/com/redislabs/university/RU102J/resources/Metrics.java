package com.redislabs.university.RU102J.resources;

import com.redislabs.university.RU102J.api.Measurement;
import com.redislabs.university.RU102J.api.Plot;
import com.redislabs.university.RU102J.api.ValueUnit;
import com.redislabs.university.RU102J.dao.DayMinuteMetricDao;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;

@Path("/metrics")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class Metrics {

    private final DayMinuteMetricDao dayMetricDao;

    public Metrics(DayMinuteMetricDao dayMetricDao) {
        this.dayMetricDao = dayMetricDao;
    }

    @GET
    @Path("/{siteId}")
    public Response getSiteMetrics(@PathParam("siteId") Long siteId) {
        List<Plot> plots = new ArrayList<>();

        // Get kWhGenerated measurements
        List<Measurement> generated = dayMetricDao.getMeasurements(siteId, ValueUnit.KWHGenerated);
        plots.add(new Plot("kWh Generated", generated));

        // Get kWhUsed measurements
        List<Measurement> used = dayMetricDao.getMeasurements(siteId, ValueUnit.KWHUsed);
        plots.add(new Plot("kWh Used", used));

        return Response.ok(plots)
                .header("Access-Control-Allow-Origin", "*")
                .build();
    }
}
