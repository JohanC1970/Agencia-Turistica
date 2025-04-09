package co.uniquindio.edu.Agencia_Turistica.service;

import co.uniquindio.edu.Agencia_Turistica.config.CodigoVerificacionConfig;
import co.uniquindio.edu.Agencia_Turistica.dto.EmpleadoDTO;
import co.uniquindio.edu.Agencia_Turistica.dto.response.AdministradorResponseDTO;
import co.uniquindio.edu.Agencia_Turistica.dto.response.EmpleadoResponseDTO;
import co.uniquindio.edu.Agencia_Turistica.dto.response.UsuarioResponseDTO;
import co.uniquindio.edu.Agencia_Turistica.exception.EmpleadoYaRegistradoException;
import co.uniquindio.edu.Agencia_Turistica.exception.UsuarioNoEncontradoException;
import co.uniquindio.edu.Agencia_Turistica.exception.ValidacionException;
import co.uniquindio.edu.Agencia_Turistica.model.Administrador;
import co.uniquindio.edu.Agencia_Turistica.model.Empleado;
import co.uniquindio.edu.Agencia_Turistica.model.Rol;
import co.uniquindio.edu.Agencia_Turistica.model.Usuario;
import co.uniquindio.edu.Agencia_Turistica.repository.AdministradorRepository;
import co.uniquindio.edu.Agencia_Turistica.repository.UsuarioRepository;
import jakarta.mail.MessagingException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Random;

@Service
public class AdministradorService {

    private final AdministradorRepository administradorRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final CodigoVerificacionConfig codigoVerificacionConfig;

    public AdministradorService(AdministradorRepository administradorRepository, UsuarioRepository usuarioRepository,
                                PasswordEncoder passwordEncoder, CodigoVerificacionConfig codigoVerificacionConfig) {
        this.administradorRepository = administradorRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.codigoVerificacionConfig = codigoVerificacionConfig;
    }

    //-----------------METODOS CRUD---------------------

    /**
     * Registra un nuevo administrador en la base de datos.
     *
     * @param adminDTO Datos del administrador a registrar.
     * @return UsuarioResponseDTO con los datos del administrador registrado.
     * @throws MessagingException
     * @throws IOException
     */
    public UsuarioResponseDTO registrarAdministrador(EmpleadoDTO adminDTO) throws MessagingException, IOException {
        verificarAdministradorNoRegistrado(adminDTO);
        validarDatosAdministrador(adminDTO);

        String codigo = generarCodigo();
        Usuario usuario = crearUsuario(adminDTO, codigo);
        Administrador administrador = crearAdministrador(adminDTO, usuario);

        return new UsuarioResponseDTO(adminDTO.getId(), adminDTO.getNombre(), adminDTO.getApellidos(),
                adminDTO.getEmail(), Rol.ADMIN);
    }

    /**
     * Este método obtiene un administrador de la base de datos por su ID.
     * @param id ID del administrador a obtener.
     * @return
     */
    public AdministradorResponseDTO obtenerAdministrador(String id) {
        Administrador administrador = administradorRepository.findById(id)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Empleado no encontrado"));

        // Retornar los detalles del empleado en un DTO (EmpleadoResponseDTO)
        return new AdministradorResponseDTO(administrador.getId(), administrador.getUsuario().getNombre(),
                administrador.getUsuario().getApellido(), administrador.getUsuario().getEmail(),
                administrador.getTelefono(), administrador.getFechaContratacion());
    }

    /**
     * Actualiza los datos de un administrador existente en la base de datos.
     *
     * @param adminDTO Datos del administrador a actualizar.
     * @return UsuarioResponseDTO con los datos del administrador actualizado.
     */
    public UsuarioResponseDTO actualizarDatosAdministrador(EmpleadoDTO adminDTO) {
        validarDatosAdministrador(adminDTO);

        Administrador administrador = administradorRepository.findById(adminDTO.getId())
                .orElseThrow(() -> new UsuarioNoEncontradoException("Administrador no encontrado"));

        Usuario usuario = administrador.getUsuario();
        usuario.setNombre(adminDTO.getNombre());
        usuario.setApellido(adminDTO.getApellidos());
        usuarioRepository.save(usuario);

        administradorRepository.save(administrador);

        return new UsuarioResponseDTO(adminDTO.getId(), adminDTO.getNombre(), adminDTO.getApellidos(),
                adminDTO.getEmail(), Rol.ADMIN);
    }

    /**
     * Elimina un administrador de la base de datos.
     *La eliminación no es física, sino que se desactiva la cuenta del usuario.
     * @param id ID del administrador a eliminar.
     */
    public void eliminarAdministrador(String id) {
        Administrador administrador = administradorRepository.findById(id)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Administrador no encontrado"));

        administrador.getUsuario().setEstado(false);
        usuarioRepository.save(administrador.getUsuario());
        administradorRepository.save(administrador);
    }

    //-----------------METODOS COMPLEMENTARIOS---------------------

    /**
     * Valida los datos de un administrador.
     *
     * @param adminDTO Datos del administrador a validar.
     * @throws ValidacionException Si faltan campos obligatorios o si el formato del email es inválido.
     */
    private void validarDatosAdministrador(EmpleadoDTO adminDTO) {
        StringBuilder camposFaltantes = new StringBuilder();

        if (adminDTO.getId() == null || adminDTO.getId().isBlank()) {
            camposFaltantes.append("ID, ");
        }
        if (adminDTO.getNombre() == null || adminDTO.getNombre().isBlank()) {
            camposFaltantes.append("Nombre, ");
        }
        if (adminDTO.getApellidos() == null || adminDTO.getApellidos().isBlank()) {
            camposFaltantes.append("Apellidos, ");
        }
        if (adminDTO.getEmail() == null || adminDTO.getEmail().isBlank()) {
            camposFaltantes.append("Email, ");
        } else if (!adminDTO.getEmail().matches("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")) {
            camposFaltantes.append("Email (formato inválido), ");
        }
        if (adminDTO.getPassword() == null || adminDTO.getPassword().isBlank()) {
            camposFaltantes.append("Contraseña, ");
        }
        if(adminDTO.getTelefono() == null || adminDTO.getTelefono().isBlank()){
            camposFaltantes.append("Teléfono, ");
        }
        if (camposFaltantes.length() > 0) {
            camposFaltantes.setLength(camposFaltantes.length() - 2);
            throw new ValidacionException("Faltan los siguientes campos: " + camposFaltantes.toString());
        }
    }

    /**
     * Verifica si el administrador ya está registrado en la base de datos.
     *
     * @param adminDTO Datos del administrador a verificar.
     * @throws EmpleadoYaRegistradoException Si el administrador ya está registrado.
     */
    private void verificarAdministradorNoRegistrado(EmpleadoDTO adminDTO) {
        if (usuarioRepository.existsById(adminDTO.getId())) {
            throw new EmpleadoYaRegistradoException("El administrador ya está registrado");
        }
        if (usuarioRepository.existsByEmail(adminDTO.getEmail())) {
            throw new EmpleadoYaRegistradoException("El email ya está registrado");
        }
    }

    /**
     * Crea un nuevo administrador en la base de datos.
     *
     * @param adminDTO Datos del administrador a crear.
     * @param usuario  Usuario asociado al administrador.
     * @return El administrador creado.
     */
    private Administrador crearAdministrador(EmpleadoDTO adminDTO, Usuario usuario) {
        Administrador administrador = new Administrador();
        administrador.setId(adminDTO.getId());
        administrador.setTelefono(adminDTO.getTelefono());
        administrador.setFechaContratacion(LocalDate.now());
        administrador.setUsuario(usuario);
        return administradorRepository.save(administrador);
    }

    /**
     * Crea un nuevo usuario en la base de datos.
     *
     * @param adminDTO Datos del administrador a crear.
     * @param codigoVerificacion Código de verificación del usuario.
     * @return El usuario creado.
     */
    private Usuario crearUsuario(EmpleadoDTO adminDTO, String codigoVerificacion) {
        Usuario usuario = new Usuario();
        usuario.setId(adminDTO.getId());
        usuario.setNombre(adminDTO.getNombre());
        usuario.setApellido(adminDTO.getApellidos());
        usuario.setEmail(adminDTO.getEmail());
        usuario.setPassword(passwordEncoder.encode(adminDTO.getPassword()));
        usuario.setRol(Rol.ADMIN);
        usuario.setCuentaVerificada(false);
        usuario.setCodigoVerificacion(codigoVerificacion);
        usuario.setFechaExpiracionCodigoVerificacion(LocalDateTime.now().plusMinutes(codigoVerificacionConfig.getExpiracionMinutos()));
        return usuarioRepository.save(usuario);
    }

    /**
     * Genera un código de verificación aleatorio de 6 dígitos.
     *
     * @return Código de verificación generado.
     */
    private String generarCodigo() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }


}
