
package Exceptions;

public class JwtException extends RuntimeException {
  private final String errorCode;

  public JwtException(String message, String errorCode) {
    super(message);
    this.errorCode = errorCode;
  }

  public String getErrorCode() {
    return errorCode;
  }
}


