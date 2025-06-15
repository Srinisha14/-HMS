package com.gateway.filter;

import com.gateway.util.JwtUtil;
import com.gateway.util.RouterValidator;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    @Autowired
    private RouterValidator routerValidator;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthenticationFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String path = exchange.getRequest().getURI().getPath();
            String method = exchange.getRequest().getMethod().name();

            // Allow registration: Skip JWT check for "POST /patient"
            if (path.startsWith("/patient") && method.equalsIgnoreCase("POST")) {
                return chain.filter(exchange); // Forward the request without any authentication
            }
            

            // Apply authentication only to secured endpoints
            if (routerValidator.isSecured.test(exchange.getRequest())) {
                if (!exchange.getRequest().getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                    exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                    return exchange.getResponse().setComplete();
                }

                String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
                String token = authHeader != null && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;

                try {
                    jwtUtil.validateToken(token);
                    String role = jwtUtil.getRoleFromToken(token);

                    // Role-based access control
                    if (path.startsWith("/doctor") && !(role.equals("ADMIN") || role.equals("DOCTOR")|| role.equals("PATIENT"))) {
                        exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                        return exchange.getResponse().setComplete();
                    }
                    if (path.startsWith("/patient") && !(role.equals("ADMIN") || role.equals("PATIENT"))) {
                        exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                        return exchange.getResponse().setComplete();
                    }
                } catch (Exception e) {
                    exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                    return exchange.getResponse().setComplete();
                }
            }

            return chain.filter(exchange); // Forward the request
        };
    }

    public static class Config {
        // no properties needed for now
    }
}
