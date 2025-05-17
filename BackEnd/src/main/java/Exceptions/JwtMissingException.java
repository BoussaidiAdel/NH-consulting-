package Exceptions;

public class JwtMissingException extends JwtException {
    public JwtMissingException() {
        super("JWT token is missing", "missing_token");
    }
}