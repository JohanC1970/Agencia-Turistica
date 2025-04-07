package co.uniquindio.edu.Agencia_Turistica.service;

import co.uniquindio.edu.Agencia_Turistica.dto.UsuarioDTO;
import co.uniquindio.edu.Agencia_Turistica.model.Usuario;
import co.uniquindio.edu.Agencia_Turistica.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    @Autowired
    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public Usuario registrarUsuario(UsuarioDTO usuarioDTO) {

        if(usuarioRepository.existsById(usuarioDTO.getId())) {
            throw new IllegalArgumentException("El usuario ya existe");
        }

        if(usuarioRepository.existsByEmail(usuarioDTO.getEmail())) {
            throw new IllegalArgumentException("El usuario ya existe");
        }

        if(usuarioDTO.getRol().equals("CLIENTE")) {

        } else if(usuarioDTO.getRol().equals("EMPLEADO")) {

        } else {
            throw new IllegalArgumentException("El rol no es válido");
        }
        return null;
    }
}

