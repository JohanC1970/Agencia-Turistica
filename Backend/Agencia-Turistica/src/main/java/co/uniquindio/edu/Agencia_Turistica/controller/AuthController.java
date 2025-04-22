package co.uniquindio.edu.Agencia_Turistica.controller;

import co.uniquindio.edu.Agencia_Turistica.dto.ClienteDTO;
import co.uniquindio.edu.Agencia_Turistica.dto.LoginDTO;
import co.uniquindio.edu.Agencia_Turistica.dto.response.LoginResponseDTO;
import co.uniquindio.edu.Agencia_Turistica.service.AuthService;
import co.uniquindio.edu.Agencia_Turistica.service.ClienteService;
import co.uniquindio.edu.Agencia_Turistica.service.UsuarioService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@Controller
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/register")
    public ResponseEntity<Void> registrarUsuario(@RequestBody ClienteDTO clienteDTO) throws MessagingException, IOException {
        clienteService.registrarCliente(clienteDTO);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> iniciarSesion(@RequestBody LoginDTO loginDTO) {
        LoginResponseDTO response = authService.iniciarSesion(loginDTO);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/recover")
    public ResponseEntity<Void> solicitarRecuperacionAcceso(@RequestBody Map<String, String> datos) {
        String email = datos.get("email");
        authService.solicitarRecuperacionAcceso(email);
        return ResponseEntity.ok().build();
    }


    @PostMapping("/resend-verification")
    public ResponseEntity<Void> solicitarNuevoCodigoVerificacion(@RequestBody Map<String, String> datos) {
        String email = datos.get("email");
        authService.solicitarNuevoCodigoVerificacion(email);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/resend-recovery")
    public ResponseEntity<Void> solicitarNuevoCodigoRecuperacion(@RequestParam String email) {
        authService.solicitarNuevoCodigoRecuperacion(email);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/verify")
    public ResponseEntity<Void> verificarCuenta(@RequestBody Map<String, String> datos) {
        String email = datos.get("email");
        String codigo = datos.get("codigo");
        usuarioService.validarCuenta(email, codigo);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/login")
    public String mostrarLogin() {
        return "login"; // Thymeleaf busca auth.html en /templates
    }

    @PostMapping("/verify-recovery-code")
    public ResponseEntity<Void> verificarCodigoRecuperacion(@RequestBody Map<String, String> datos) {
        String email = datos.get("email");
        String codigo = datos.get("codigo");
        usuarioService.verificarCodigoRecuperacion(email, codigo);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/change-password")
    public ResponseEntity<Void> cambiarPassword(@RequestBody Map<String, String> datos) {
        String email = datos.get("email");
        String nuevaPassword = datos.get("nuevaPassword");
        usuarioService.cambiarPassword(email, nuevaPassword);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/verificar")
    public String mostrarVerificar() {
        return "verificar"; // Thymeleaf busca verificar.html en /templates
    }

    @GetMapping("/registro")
    public String mostrarRegistro() {
        return "registro"; // Thymeleaf buscará registro.html en /templates
    }
    @GetMapping("/recuperar-password")
    public String mostrarRecuperarPassword() {
        return "recuperar-password"; // Thymeleaf buscará recuperar-password.html en /templates
    }

    @GetMapping("/validar-cuenta")
    public String mostrarValidarCuenta() {
        return "validar-cuenta"; // Thymeleaf buscará validar-cuenta.html en /templates
    }

    @GetMapping("/verificar-codigo")
    public String mostrarVerificarCodigo() {
        return "verificar-codigo"; // Thymeleaf buscará verificar-codigo.html en /templates
    }

    @GetMapping("/verificar-codigo-recuperacion")
    public String mostrarVerificarCodigoRecuperacion() {
        return "verificar-codigo-recuperacion"; // Thymeleaf buscará verificar-codigo-recuperacion.html en /templates
    }
}