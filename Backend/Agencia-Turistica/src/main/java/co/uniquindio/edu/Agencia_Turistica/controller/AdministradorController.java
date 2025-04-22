package co.uniquindio.edu.Agencia_Turistica.controller;

import co.uniquindio.edu.Agencia_Turistica.dto.EmpleadoDTO;
import co.uniquindio.edu.Agencia_Turistica.dto.response.AdministradorResponseDTO;
import co.uniquindio.edu.Agencia_Turistica.dto.response.UsuarioResponseDTO;
import co.uniquindio.edu.Agencia_Turistica.service.AdministradorService;
import jakarta.mail.MessagingException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/administradores")
public class AdministradorController {

    private final AdministradorService administradorService;
    public AdministradorController(AdministradorService administradorService) {
        this.administradorService = administradorService;
    }

    @PostMapping
    public ResponseEntity<UsuarioResponseDTO>registrarAdministrador(@RequestBody EmpleadoDTO empleadoDTO) throws MessagingException, IOException {
        UsuarioResponseDTO response = administradorService.registrarAdministrador(empleadoDTO);
        return ResponseEntity.ok(response);
    }


    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> actualizarAdministrador(@PathVariable String id, @RequestBody EmpleadoDTO empleadoDTO) {
        empleadoDTO.setId(id);
        UsuarioResponseDTO response = administradorService.actualizarDatosAdministrador(empleadoDTO);
        return ResponseEntity.ok(response);
    }


    @GetMapping("/{id}")
    public ResponseEntity<AdministradorResponseDTO> obtenerAdministrador(@PathVariable String id) {
        AdministradorResponseDTO response = administradorService.obtenerAdministrador(id);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarAdministrador(@PathVariable String id) {
        administradorService.eliminarAdministrador(id);
        return ResponseEntity.noContent().build();
    }

}
