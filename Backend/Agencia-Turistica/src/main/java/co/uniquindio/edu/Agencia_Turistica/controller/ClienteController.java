package co.uniquindio.edu.Agencia_Turistica.controller;

import co.uniquindio.edu.Agencia_Turistica.dto.ClienteDTO;
import co.uniquindio.edu.Agencia_Turistica.dto.response.ClienteResponseDTO;
import co.uniquindio.edu.Agencia_Turistica.dto.response.UsuarioResponseDTO;
import co.uniquindio.edu.Agencia_Turistica.service.ClienteService;
import jakarta.mail.MessagingException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteService clienteService;
    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @PostMapping
    public ResponseEntity<UsuarioResponseDTO>registrarCliente(@RequestBody ClienteDTO clienteDTO) throws MessagingException, IOException {
        UsuarioResponseDTO response = clienteService.registrarCliente(clienteDTO);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> actualizarCliente(@PathVariable String id, @RequestBody ClienteDTO clienteDTO) {
        clienteDTO.setId(id);
        UsuarioResponseDTO response = clienteService.actualizarDatosCliente(clienteDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> obtenerCliente(@PathVariable String id) {
        ClienteResponseDTO response = clienteService.obtenerCliente(id);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCliente(@PathVariable String id) {
        clienteService.eliminarCliente(id);
        return ResponseEntity.noContent().build();
    }

}
