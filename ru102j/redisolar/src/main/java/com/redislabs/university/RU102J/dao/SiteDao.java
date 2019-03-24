package com.redislabs.university.RU102J.dao;

import com.redislabs.university.RU102J.api.Coordinate;
import com.redislabs.university.RU102J.api.Site;

import java.util.Set;

public interface SiteDao {
    void insert(Site site);
    Site findById(Long id);
    Set<Site> findAll();
}
