package co.uniquindio.edu.Agencia_Turistica.service;

import co.uniquindio.edu.Agencia_Turistica.config.CodigoVerificacionConfig;
import co.uniquindio.edu.Agencia_Turistica.dto.ClienteDTO;
import co.uniquindio.edu.Agencia_Turistica.dto.response.ClienteResponseDTO;
import co.uniquindio.edu.Agencia_Turistica.dto.response.UsuarioResponseDTO;
import co.uniquindio.edu.Agencia_Turistica.exception.EmpleadoYaRegistradoException;
import co.uniquindio.edu.Agencia_Turistica.exception.UsuarioNoEncontradoException;
import co.uniquindio.edu.Agencia_Turistica.exception.ValidacionException;
import co.uniquindio.edu.Agencia_Turistica.model.Cliente;
import co.uniquindio.edu.Agencia_Turistica.model.Rol;
import co.uniquindio.edu.Agencia_Turistica.model.Usuario;
import co.uniquindio.edu.Agencia_Turistica.repository.ClienteRepository;
import co.uniquindio.edu.Agencia_Turistica.repository.UsuarioRepository;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Random;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final CodigoVerificacionConfig codigoVerificacionConfig;
    private final EmailSender emailSender;

    public ClienteService(ClienteRepository clienteRepository, UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder, CodigoVerificacionConfig codigoVerificacionConfig, EmailSender emailSender) {
        this.clienteRepository = clienteRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.codigoVerificacionConfig = codigoVerificacionConfig;
        this.emailSender = emailSender;
    }

    //-----------------METODOS CRUD---------------------

    @Transactional
    /**
     * Método para registrar un cliente en el sistema.
     * @param clienteDTO
     * @return
     * @throws MessagingException
     * @throws IOException
     */
    public UsuarioResponseDTO registrarCliente(ClienteDTO clienteDTO) throws MessagingException, IOException {
        verificarClienteNoRegistrado(clienteDTO);
        validarDatosCliente(clienteDTO);

        String codigo = generarCodigo();
        Usuario usuario = crearUsuario(clienteDTO, codigo);
        Cliente cliente = crearCliente(clienteDTO, usuario);

        try {
            emailSender.enviarCodigoVerificacion(usuario.getEmail(), codigo);
        } catch (MessagingException | IOException e) {
            e.printStackTrace(); // Registra el error en los logs
            throw new RuntimeException("Error al enviar el correo de verificación", e);
        }

        return new UsuarioResponseDTO(clienteDTO.getId(), clienteDTO.getNombre(), clienteDTO.getApellidos(),
                clienteDTO.getEmail(), Rol.CLIENTE);
    }

    /**
     * Método para actualizar los datos de un cliente en el sistema.
     * @param clienteDTO ClienteDTO con los datos a actualizar
     * @return
     */
    public UsuarioResponseDTO actualizarDatosCliente(ClienteDTO clienteDTO) {
        validarDatosCliente(clienteDTO);

        Cliente cliente = clienteRepository.findById(clienteDTO.getId())
                .orElseThrow(() -> new UsuarioNoEncontradoException("Cliente no encontrado"));

        Usuario usuario = cliente.getUsuario();
        usuario.setNombre(clienteDTO.getNombre());
        usuario.setApellido(clienteDTO.getApellidos());
        usuarioRepository.save(usuario);

        cliente.setTelefono(clienteDTO.getTelefono());
        cliente.setFechaNacimiento(clienteDTO.getFechaNacimiento());
        clienteRepository.save(cliente);

        return new UsuarioResponseDTO(clienteDTO.getId(), clienteDTO.getNombre(), clienteDTO.getApellidos(),
                clienteDTO.getEmail(), Rol.CLIENTE);
    }

    /**
     * Método para eliminar un cliente del sistema.
     * @param id ID del cliente a eliminar
     */
    public void eliminarCliente(String id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Cliente no encontrado"));

        cliente.getUsuario().setEstado(false);
        usuarioRepository.save(cliente.getUsuario());
        clienteRepository.save(cliente);
    }

    /**
     * Método para obtener un cliente por su ID.
     * @param id ID del cliente a buscar
     * @return ClienteResponseDTO con los datos del cliente
     */
    public ClienteResponseDTO obtenerCliente(String id){
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Cliente no encontrado"));

        return new ClienteResponseDTO(cliente.getId(),cliente.getUsuario().getNombre(),
                cliente.getUsuario().getApellido(),cliente.getUsuario().getEmail(),
                cliente.getTelefono(),cliente.getFechaNacimiento());
    }

    //-----------------METODOS COMPLEMENTARIOS---------------------

    /**
     * Método para validar los datos de un cliente.
     * @param clienteDTO ClienteDTO con los datos a validar
     */
    private void validarDatosCliente(ClienteDTO clienteDTO) {
        StringBuilder camposFaltantes = new StringBuilder();

        if (clienteDTO.getId() == null || clienteDTO.getId().isBlank()) {
            camposFaltantes.append("ID, ");
        }
        if (clienteDTO.getNombre() == null || clienteDTO.getNombre().isBlank()) {
            camposFaltantes.append("Nombre, ");
        }
        if (clienteDTO.getApellidos() == null || clienteDTO.getApellidos().isBlank()) {
            camposFaltantes.append("Apellidos, ");
        }
        if (clienteDTO.getEmail() == null || clienteDTO.getEmail().isBlank()) {
            camposFaltantes.append("Email, ");
        } else if (!clienteDTO.getEmail().matches("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")) {
            camposFaltantes.append("Email (formato inválido), ");
        }
        if (clienteDTO.getPassword() == null || clienteDTO.getPassword().isBlank()) {
            camposFaltantes.append("Contraseña, ");
        }
        if (clienteDTO.getTelefono() == null || clienteDTO.getTelefono().isBlank()) {
            camposFaltantes.append("Teléfono, ");
        }
        if (clienteDTO.getFechaNacimiento() == null) {
            camposFaltantes.append("Fecha de Nacimiento, ");
        }
        if (camposFaltantes.length() > 0) {
            camposFaltantes.setLength(camposFaltantes.length() - 2);
            throw new ValidacionException("Faltan los siguientes campos: " + camposFaltantes);
        }
    }

    /**
     * Método para verificar si un cliente ya está registrado en el sistema.
     * @param clienteDTO ClienteDTO con los datos a verificar
     */
    private void verificarClienteNoRegistrado(ClienteDTO clienteDTO) {
        if (usuarioRepository.existsById(clienteDTO.getId())) {
            throw new EmpleadoYaRegistradoException("El cliente ya está registrado");
        }
        if (usuarioRepository.existsByEmail(clienteDTO.getEmail())) {
            throw new EmpleadoYaRegistradoException("El email ya está registrado");
        }
    }

    /**
     * Método para crear un cliente en el sistema.
     * @param clienteDTO ClienteDTO con los datos del cliente
     * @param usuario Usuario asociado al cliente
     * @return Cliente creado
     */
    private Cliente crearCliente(ClienteDTO clienteDTO, Usuario usuario) {
        Cliente cliente = new Cliente();
        cliente.setTelefono(clienteDTO.getTelefono());
        cliente.setFechaNacimiento(clienteDTO.getFechaNacimiento());
        cliente.setUsuario(usuario);
        return clienteRepository.save(cliente);
    }

    /**
     * Método para crear un usuario en el sistema.
     * @param clienteDTO ClienteDTO con los datos del usuario
     * @param codigoVerificacion Código de verificación del usuario
     * @return Usuario creado
     */
    private Usuario crearUsuario(ClienteDTO clienteDTO, String codigoVerificacion) {
        Usuario usuario = new Usuario();
        usuario.setId(clienteDTO.getId());
        usuario.setNombre(clienteDTO.getNombre());
        usuario.setApellido(clienteDTO.getApellidos());
        usuario.setEmail(clienteDTO.getEmail());
        usuario.setPassword(passwordEncoder.encode(clienteDTO.getPassword()));
        usuario.setRol(Rol.CLIENTE);
        usuario.setCuentaVerificada(false);
        usuario.setCodigoVerificacion(codigoVerificacion);
        usuario.setFechaExpiracionCodigoVerificacion(LocalDateTime.now().plusMinutes(codigoVerificacionConfig.getExpiracionMinutos()));
        return usuario;
    }

    /**
     * Método para generar un código de verificación aleatorio.
     * @return Código de verificación generado
     */
    private String generarCodigo() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }
}