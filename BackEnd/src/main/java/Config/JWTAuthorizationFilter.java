package Config;

import Exceptions.JwtException;
import Exceptions.JwtExpiredException;
import Exceptions.JwtInvalidException;
import Services.UserService;
import Utils.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Component
class JWTAuthorizationFilter extends OncePerRequestFilter {

    @Autowired
    private UserService userDetailsService;

    @Autowired
    private JwtService jwtService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Skip authentication for refresh token endpoint
        String requestPath = request.getServletPath();
        if (requestPath.equals("/api/auth/login") ||
                requestPath.equals("/api/auth/register") ||
                requestPath.equals("/api/auth/refresh") ||
                requestPath.equals("/api/auth/forget-password")) {
            filterChain.doFilter(request, response);
            return;
        }

        Cookie[] cookies = request.getCookies();
        String token = null;

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("access_token")) {
                    token = cookie.getValue();
                    break;
                }
            }
        }

        if (token == null) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String email = jwtService.extractEmail(token);
            jwtService.isTokenValid(token); // This will throw exceptions if token is invalid

            UserDetails userDetails = userDetailsService.loadUserByUsername(email);

            if (userDetails != null) {
                Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();
                SimpleGrantedAuthority authority = (SimpleGrantedAuthority) authorities.iterator().next();

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, Collections.singletonList(authority));

                SecurityContextHolder.getContext().setAuthentication(authentication);
                filterChain.doFilter(request, response);
            } else {
                // User not found
                sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "invalid_token", "User not found");
            }
        } catch (JwtExpiredException e) {
            // Token expired - special error code for the interceptor to handle refresh
            sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, e.getErrorCode(), e.getMessage());
        } catch (JwtInvalidException e) {
            // Invalid token
            sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, e.getErrorCode(), e.getMessage());
        } catch (Exception e) {
            // General exception
            sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "error", "Authentication error: " + e.getMessage());
        }
    }

    private void sendErrorResponse(HttpServletResponse response, int status, String errorCode, String message) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");

        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", errorCode);
        errorResponse.put("message", message);

        String json = objectMapper.writeValueAsString(errorResponse);

        response.getWriter().write(json);
    }
}