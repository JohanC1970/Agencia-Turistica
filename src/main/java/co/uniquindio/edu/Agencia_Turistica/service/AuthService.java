package co.uniquindio.edu.Agencia_Turistica.service;

import co.uniquindio.edu.Agencia_Turistica.dto.UsuarioDTO;
import co.uniquindio.edu.Agencia_Turistica.model.Usuario;
import co.uniquindio.edu.Agencia_Turistica.repository.UsuarioRepository;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Random;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailSender emailSender;

    public Usuario registrarUsuario(UsuarioDTO usuarioDTO) throws MessagingException, IOException {


        Usuario usuario = UsuarioService.registrarUsuario(usuarioDTO);
        emailSender.enviarCodigoVerificacion(usuario.getEmail(),generarCodigo());
        return usuario;
    }


    public String generarCodigo(){
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }

}
