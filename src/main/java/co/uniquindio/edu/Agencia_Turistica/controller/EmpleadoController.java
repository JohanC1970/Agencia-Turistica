package co.uniquindio.edu.Agencia_Turistica.controller;

import co.uniquindio.edu.Agencia_Turistica.dto.EmpleadoDTO;
import co.uniquindio.edu.Agencia_Turistica.dto.response.EmpleadoResponseDTO;
import co.uniquindio.edu.Agencia_Turistica.dto.response.UsuarioResponseDTO;
import co.uniquindio.edu.Agencia_Turistica.service.EmpleadoService;
import jakarta.mail.MessagingException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/empleados")
public class EmpleadoController {

    private final EmpleadoService empleadoService;

    public EmpleadoController(EmpleadoService empleadoService) {
        this.empleadoService = empleadoService;
    }

    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> registrarEmpleado(@RequestBody EmpleadoDTO empleadoDTO) throws MessagingException, IOException {
        UsuarioResponseDTO response = empleadoService.registrarEmpleado(empleadoDTO);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> actualizarEmpleado(@PathVariable String id, @RequestBody EmpleadoDTO empleadoDTO) {
        empleadoDTO.setId(id);
        UsuarioResponseDTO response = empleadoService.actualizarDatosEmpleado(empleadoDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmpleadoResponseDTO> obtenerEmpleado(@PathVariable String id) {
        EmpleadoResponseDTO response = empleadoService.obtenerEmpleado(id);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarEmpleado(@PathVariable String id) {
        empleadoService.eliminarEmpleado(id);
        return ResponseEntity.noContent().build();
    }

}
