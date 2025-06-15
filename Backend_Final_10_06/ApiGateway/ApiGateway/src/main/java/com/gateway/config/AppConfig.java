package com.gateway.config;

import com.gateway.filter.AuthenticationFilter;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

	private final AuthenticationFilter authenticationFilter;

	public AppConfig(AuthenticationFilter authenticationFilter) {
		this.authenticationFilter = authenticationFilter;
	}

	@Bean
	public RouteLocator routes(RouteLocatorBuilder builder) {
		return builder.routes()
				// 1) Auth Service – no filter (open endpoints: register & token)
				.route("AUTH-SERVICE", r -> r.path("/auth/**").uri("lb://AUTH-SERVICE"))
				// 2) Appointment Service – any logged-in user may access
				.route("APPOINTMENT-SERVICE",
						r -> r.path("/appointment/**")
								.filters(f -> f.filter(authenticationFilter.apply(new AuthenticationFilter.Config())))
								.uri("lb://APPOINTMENT-SERVICE"))
				// 3) Doctor Service – only ADMIN or DOCTOR
				.route("DOCTOR-SERVICE",
						r -> r.path("/doctor/**")
								.filters(f -> f.filter(authenticationFilter.apply(new AuthenticationFilter.Config())))
								.uri("lb://DOCTOR-SERVICE"))
				// 4) Patient Service – only ADMIN or PATIENT
				.route("PATIENT-SERVICE",
						r -> r.path("/patient/**")
								.filters(f -> f.filter(authenticationFilter.apply(new AuthenticationFilter.Config())))
								.uri("lb://PATIENT-SERVICE"))
				// 5) Notification Service – any logged-in user (or adjust as needed)
				.route("NOTIFICATION-SERVICE",
						r -> r.path("/notifications/**")
								.filters(f -> f.filter(authenticationFilter.apply(new AuthenticationFilter.Config())))
								.uri("lb://NOTIFICATION-SERVICE"))
				.route("MEDICAL-HISTORY-SERVICE",
						r -> r.path("/medical-history/**")
								.filters(f -> f.filter(authenticationFilter.apply(new AuthenticationFilter.Config())))
								.uri("lb://MEDICAL-HISTORY-SERVICE"))
				.build();
	}
}
