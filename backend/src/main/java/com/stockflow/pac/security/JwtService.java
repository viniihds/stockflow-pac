package com.stockflow.pac.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {

    private final Key signingKey;
    private final long expirationMillis;

    public JwtService(
            @Value("${app.security.jwt-secret}") String secretBase64,
            @Value("${app.security.jwt-exp-minutes}") long expMinutes
    ) {
        this.signingKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretBase64));
        this.expirationMillis = expMinutes * 60_000L;
    }

    public String generate(String subject, Map<String, Object> claims) {
        Instant now = Instant.now();
        // Importante: setClaims substitui todo o payload e remove os campos padrao
        // que ja tenham sido configurados anteriormente (incluindo "sub").
        // Portanto, defina as claims primeiro e, em seguida, defina o subject, iat e exp.
        return Jwts.builder()
                .setClaims(claims == null ? java.util.Map.of() : claims)
                .setSubject(subject)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plusMillis(expirationMillis)))
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractSubject(String token) {
        return Jwts.parserBuilder().setSigningKey(signingKey).build()
                .parseClaimsJws(token)
                .getBody().getSubject();
    }
}
