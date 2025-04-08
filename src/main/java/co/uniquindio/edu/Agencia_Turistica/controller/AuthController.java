package co.uniquindio.edu.Agencia_Turistica.controller;


import co.uniquindio.edu.Agencia_Turistica.dto.ClienteDTO;
import co.uniquindio.edu.Agencia_Turistica.dto.LoginDTO;
import co.uniquindio.edu.Agencia_Turistica.dto.response.LoginResponseDTO;
import co.uniquindio.edu.Agencia_Turistica.dto.response.UsuarioResponseDTO;
import co.uniquindio.edu.Agencia_Turistica.service.AuthService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * Endpoint para registrar un nuevo cliente.
     *
     * @param clienteDTO Datos del cliente a registrar.
     * @return UsuarioResponseDTO con los datos del usuario registrado.
     * @throws MessagingException Si ocurre un error al enviar el correo electrónico.
     * @throws IOException Si ocurre un error al procesar el correo electrónico.
     */
    @PostMapping("/register")
    public ResponseEntity<UsuarioResponseDTO> registrarUsuario(@RequestBody ClienteDTO clienteDTO) throws MessagingException, IOException {
        UsuarioResponseDTO response = authService.registrarUsuarioCliente(clienteDTO);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint para iniciar sesión.
     *
     * @param loginDTO Datos de inicio de sesión.
     * @return LoginResponseDTO con el token de acceso.
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> iniciarSesion(@RequestBody LoginDTO loginDTO){
        LoginResponseDTO response = authService.iniciarSesion(loginDTO);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint para solicitar la recuperación de acceso.
     *
     * @param email Correo electrónico del usuario.
     * @throws MessagingException Si ocurre un error al enviar el correo electrónico.
     */
    @PostMapping("/recover")
    public ResponseEntity<Void>solicitarRecuperacionAcceso(@RequestBody String email){
        authService.solicitarRecuperacionAcceso(email);
        return ResponseEntity.ok().build();
    }

    /**
     * Endpoint para cambiar la contraseña usando un código de recuperación.
     *
     * @param email Correo electrónico del usuario.
     * @param codigo Código de recuperación.
     * @param nuevaPassword Nueva contraseña.
     */
    @PostMapping("/change-password")
    public ResponseEntity<Void> cambiarPassword(@RequestParam String email, @RequestParam String codigo, @RequestParam String nuevaPassword) {
        authService.cambiarPassword(email, codigo, nuevaPassword);
        return ResponseEntity.ok().build();
    }

    /**
     * Endpoint para solicitar un nuevo código de verificación.
     *
     * @param email Correo electrónico del usuario.
     */
    @PostMapping("/resend-verification")
    public ResponseEntity<Void> solicitarNuevoCodigoVerificacion(@RequestParam String email) {
        authService.solicitarNuevoCodigoVerificacion(email);
        return ResponseEntity.ok().build();
    }

    /**
     * Endpoint para solicitar un nuevo código de recuperación.
     *
     * @param email Correo electrónico del usuario.
     */
    public ResponseEntity<Void> solicitarNuevoCodigoRecuperacion(@RequestParam String email) {
        authService.solicitarNuevoCodigoRecuperacion(email);
        return ResponseEntity.ok().build();
    }

}
