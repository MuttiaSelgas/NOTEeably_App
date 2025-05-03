package com.g3appdev.noteably.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // ✅ Serve uploaded files (e.g., profile pictures)
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/")
                .setCachePeriod(3600);
    }

    // ❌ REMOVE this: CORS is now fully handled in SecurityConfig
    // @Override
    // public void addCorsMappings(CorsRegistry registry) {
    //     ...
    // }
}
