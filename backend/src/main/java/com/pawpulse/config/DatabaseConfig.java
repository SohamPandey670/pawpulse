package com.pawpulse.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Configuration
@Profile("prod")
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    @Value("${DATABASE_URL:${spring.datasource.url:}}")
    private String rawUrl;

    @Bean
    @Primary
    public DataSource dataSource() {
        if (rawUrl == null || rawUrl.isBlank()) {
            throw new IllegalStateException("DATABASE_URL must be provided when running with 'prod' profile");
        }

        HikariConfig config = new HikariConfig();
        config.setDriverClassName("org.postgresql.Driver");

        // Clean any leading prefixes (e.g. jdbc:postgresql:// or postgresql:// or postgres://)
        String cleanUrl = rawUrl.trim();
        if (cleanUrl.startsWith("jdbc:")) {
            cleanUrl = cleanUrl.substring(5);
        }

        // Universal regex to cleanly extract user, password, host, port, dbName, and query params
        Pattern pattern = Pattern.compile("^(?:postgres(?:ql)?://)?(?:([^:]+)(?::([^@]+))?@)?([^:/]+)(?::(\\d+))?(?:/([^?]+))?(?:\\?(.*))?$");
        Matcher matcher = pattern.matcher(cleanUrl);

        if (matcher.matches()) {
            String username = matcher.group(1);
            String password = matcher.group(2);
            String host = matcher.group(3);
            String portStr = matcher.group(4);
            String db = matcher.group(5);
            String queryParams = matcher.group(6);

            int port = (portStr != null && !portStr.isEmpty()) ? Integer.parseInt(portStr) : 5432;
            String databaseName = (db != null && !db.isEmpty()) ? db : "postgres";

            StringBuilder jdbcUrl = new StringBuilder();
            jdbcUrl.append("jdbc:postgresql://").append(host).append(":").append(port).append("/").append(databaseName);

            if (queryParams != null && !queryParams.isEmpty()) {
                if (!queryParams.contains("sslmode")) {
                    jdbcUrl.append("?sslmode=require&").append(queryParams);
                } else {
                    jdbcUrl.append("?").append(queryParams);
                }
            } else {
                jdbcUrl.append("?sslmode=require");
            }

            log.info("Connecting to PostgreSQL at {}:{} (database: {}, user: {})", host, port, databaseName, username);

            config.setJdbcUrl(jdbcUrl.toString());
            if (username != null) config.setUsername(username);
            if (password != null) config.setPassword(password);
        } else {
            log.warn("Using raw URL fallback with jdbc: prefix: {}", cleanUrl);
            config.setJdbcUrl(cleanUrl.startsWith("jdbc:") ? cleanUrl : "jdbc:" + cleanUrl);
        }

        config.setMaximumPoolSize(5);
        config.setMinimumIdle(1);
        config.setConnectionTimeout(30000);
        config.setIdleTimeout(600000);

        return new HikariDataSource(config);
    }
}
