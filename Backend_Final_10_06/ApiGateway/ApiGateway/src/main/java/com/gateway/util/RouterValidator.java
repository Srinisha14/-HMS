package com.gateway.util;

import org.springframework.stereotype.Component;
import java.util.List;
import java.util.function.Predicate;
import org.springframework.http.server.reactive.ServerHttpRequest;

@Component
public class RouterValidator {

    // Endpoints to skip
    private static final List<String> openApiEndpoints = List.of(
        "/auth/register",
        "/auth/token"
    );

    public Predicate<ServerHttpRequest> isSecured = request -> {
        String path = request.getURI().getPath();
        System.out.println("Requested path: " + path);
        return openApiEndpoints.stream().noneMatch(uri -> path.contains(uri));
    };
}
