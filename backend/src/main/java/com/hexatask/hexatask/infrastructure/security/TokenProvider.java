package com.hexatask.hexatask.infrastructure.security;

import com.hexatask.hexatask.infrastructure.adapters.security.CustomUserDetails;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class TokenProvider {

    private static final String AUTHORITIES_KEY = "auth";

    private final Key key;
    private final long accessTokenValidityInMilliseconds;
    private final long refreshTokenValidityInMilliseconds;

    public TokenProvider(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.access-token-validity-in-seconds:900}") long accessTokenValidityInSeconds,
            @Value("${jwt.refresh-token-validity-in-seconds:1800}") long refreshTokenValidityInSeconds) {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.accessTokenValidityInMilliseconds = accessTokenValidityInSeconds * 1000;
        this.refreshTokenValidityInMilliseconds = refreshTokenValidityInSeconds * 1000;
    }

    public long getRefreshTokenValidityInMilliseconds() {
        return refreshTokenValidityInMilliseconds;
    }

    public String createAccessToken(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return createToken(authentication.getName(), userDetails.getId(), authentication.getAuthorities(),
                accessTokenValidityInMilliseconds);
    }

    public String createAccessToken(String email, UUID userId, Collection<? extends GrantedAuthority> authorities) {
        return createToken(email, userId, authorities, accessTokenValidityInMilliseconds);
    }

    public String createRefreshToken(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return createToken(authentication.getName(), userDetails.getId(), authentication.getAuthorities(),
                refreshTokenValidityInMilliseconds);
    }

    public String createRefreshToken(String email, UUID userId, Collection<? extends GrantedAuthority> authorities) {
        return createToken(email, userId, authorities, refreshTokenValidityInMilliseconds);
    }

    private String createToken(String subject, UUID userId, Collection<? extends GrantedAuthority> authorities,
            long validity) {
        String authoritiesStr = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        long now = (new Date()).getTime();
        Date validityDate = new Date(now + validity);

        return Jwts.builder()
                .setSubject(subject)
                .claim("userId", userId.toString())
                .claim(AUTHORITIES_KEY, authoritiesStr)
                .setIssuedAt(new Date(now))
                .setExpiration(validityDate)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    public Authentication getAuthentication(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        Collection<? extends GrantedAuthority> authorities = Arrays
                .stream(claims.get(AUTHORITIES_KEY).toString().split(","))
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        String username = claims.getSubject();

        // Reconstruction details to pass to context.
        // Note: Password usually null in context after JWT auth
        // We could fetch actual UserDetails from DB here if we want strict consistency
        // (at cost of DB hit per request)
        // For stateless scalability, reconstruction is preferred if claims are trusted.
        // Let's rely on standard Spring User for principal.

        String userIdStr = (String) claims.get("userId");
        UUID userId = UUID.fromString(userIdStr);

        CustomUserDetails principal = new CustomUserDetails(
                userId,
                username,
                "", // Password not needed for token auth
                authorities);

        return new UsernamePasswordAuthenticationToken(principal, token, authorities);
    }

    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
        return claims.getSubject();
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(authToken);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            // log error
        }
        return false;
    }
}
