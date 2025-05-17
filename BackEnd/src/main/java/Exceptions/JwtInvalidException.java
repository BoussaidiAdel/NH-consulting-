package Exceptions;

public class JwtInvalidException extends JwtException {
    public JwtInvalidException(String message) {
        super(message, "invalid_token");
    }
}

