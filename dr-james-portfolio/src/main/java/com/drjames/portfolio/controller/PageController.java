package com.drjames.portfolio.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Pure view-routing controller.
 * No services / repositories / DB wired up yet on purpose — this stage is
 * front-end only. Every route just resolves a Thymeleaf template.
 */
@Controller
public class PageController {

    @GetMapping("/")
    public String home() {
        return "index";
    }

    @GetMapping("/about")
    public String about() {
        return "about";
    }

    @GetMapping("/blog")
    public String blog() {
        return "blog";
    }

    @GetMapping("/blog/{slug}")
    public String blogDetail() {
        return "blog-detail";
    }
}
