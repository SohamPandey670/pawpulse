package com.pawpulse.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
@Profile("prod")
public class DatabaseConfig {

    @Value("${DATABASE_URL:${spring.datasource.url:}}")
    private String databaseUrl;

    @Bean
    @Primary
    public DataSource dataSource() {
        if (databaseUrl == null || databaseUrl.isBlank()) {
            throw new IllegalStateException("DATABASE_URL must be provided when running with 'prod' profile");
        }

        HikariConfig config = new HikariConfig();

        if (databaseUrl.startsWith("jdbc:")) {
            config.setJdbcUrl(databaseUrl);
        } else if (databaseUrl.startsWith("postgres://") || databaseUrl.startsWith("postgresql://")) {
            try {
                // Parse standard URI format: postgresql://user:password@host:port/database
                String normalized = databaseUrl.replaceFirst("^postgres(ql)?://", "http://");
                URI uri = new URI(normalized);

                String host = uri.getHost();
                int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                String path = uri.getPath();
                String dbName = (path != null && path.length() > 1) ? path.substring(1) : "postgres";

                String userInfo = uri.getUserInfo();
                if (userInfo != null && userInfo.contains(":")) {
                    String[] parts = userInfo.split(":", 2);
                    config.setUsername(parts[0]);
                    config.setPassword(parts[1]);
                } else if (userInfo != null) {
                    config.setUsername(userInfo);
                }

                String jdbcUrl = String.format("jdbc:postgresql://%s:%d/%s?sslmode=require", host, port, dbName);
                config.setJdbcUrl(jdbcUrl);
            } catch (Exception e) {
                // Fallback: prepend jdbc:
                config.setJdbcUrl("jdbc:" + databaseUrl);
            }
        } else {
            config.setJdbcUrl("jdbc:postgresql://" + databaseUrl);
        }

        config.setDriverClassName("org.postgresql.Driver");
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setConnectionTimeout(30000);
        config.setIdleTimeout(600000);

        return new HikariDataSource(config);
    }
}
