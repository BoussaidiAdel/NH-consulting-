package Exceptions;

public class JwtExpiredException extends JwtException {
    public JwtExpiredException() {
        super("JWT token has expired", "token_expired");
    }
}
