package co.uniquindio.edu.Agencia_Turistica.security;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration = 86400000;

    private Key key;

    @PostConstruct
    public void init(){
        this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    /**
     * Genera un token JWT para el usuario especificado.
     *
     * @param idUsuario El ID del usuario para el que se generará el token.
     * @return El token JWT generado.
     */
    public String generarToken(String idUsuario) {
        Date ahora = new Date();
        Date expiracion = new Date(ahora.getTime() + jwtExpiration);

        return Jwts.builder()
                .setSubject(idUsuario)
                .setIssuedAt(ahora)
                .setExpiration(expiracion)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Obtiene el ID del usuario a partir del token JWT.
     *
     * @param token El token JWT del que se extraerá el ID del usuario.
     * @return El ID del usuario extraído del token.
     */
    public String obtenerIdDesdeToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    /**
     * Válida el token JWT.
     *
     * @param token El token JWT a validar.
     * @return true si el token es válido, false en caso contrario.
     */
    public boolean validarToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String obtenerTokenDeSolicitud(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7); // Remueve "Bearer " del inicio
        }
        return null;
    }


}
