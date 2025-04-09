package co.uniquindio.edu.Agencia_Turistica.controller;

import co.uniquindio.edu.Agencia_Turistica.dto.ClienteDTO;
import co.uniquindio.edu.Agencia_Turistica.dto.LoginDTO;
import co.uniquindio.edu.Agencia_Turistica.dto.response.LoginResponseDTO;
import co.uniquindio.edu.Agencia_Turistica.dto.response.UsuarioResponseDTO;
import co.uniquindio.edu.Agencia_Turistica.service.AuthService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@Controller
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<UsuarioResponseDTO> registrarUsuario(@RequestBody ClienteDTO clienteDTO) throws MessagingException, IOException {
        UsuarioResponseDTO response = authService.registrarUsuarioCliente(clienteDTO);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> iniciarSesion(@RequestBody LoginDTO loginDTO) {
        LoginResponseDTO response = authService.iniciarSesion(loginDTO);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/recover")
    public ResponseEntity<Void> solicitarRecuperacionAcceso(@RequestParam String email) {
        authService.solicitarRecuperacionAcceso(email);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/change-password")
    public ResponseEntity<Void> cambiarPassword(@RequestParam String email, @RequestParam String codigo, @RequestParam String nuevaPassword) {
        authService.cambiarPassword(email, codigo, nuevaPassword);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<Void> solicitarNuevoCodigoVerificacion(@RequestParam String email) {
        authService.solicitarNuevoCodigoVerificacion(email);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/resend-recovery")
    public ResponseEntity<Void> solicitarNuevoCodigoRecuperacion(@RequestParam String email) {
        authService.solicitarNuevoCodigoRecuperacion(email);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/login")
    public String mostrarLogin() {
        return "login"; // Thymeleaf busca login.html en /templates
    }

}