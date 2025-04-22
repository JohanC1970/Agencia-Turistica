package co.uniquindio.edu.Agencia_Turistica.service;

import co.uniquindio.edu.Agencia_Turistica.config.CodigoVerificacionConfig;
import co.uniquindio.edu.Agencia_Turistica.dto.EmpleadoDTO;
import co.uniquindio.edu.Agencia_Turistica.dto.response.EmpleadoResponseDTO;
import co.uniquindio.edu.Agencia_Turistica.dto.response.UsuarioResponseDTO;
import co.uniquindio.edu.Agencia_Turistica.exception.EmpleadoYaRegistradoException;
import co.uniquindio.edu.Agencia_Turistica.exception.UsuarioNoEncontradoException;
import co.uniquindio.edu.Agencia_Turistica.exception.ValidacionException;
import co.uniquindio.edu.Agencia_Turistica.model.Empleado;
import co.uniquindio.edu.Agencia_Turistica.model.Rol;
import co.uniquindio.edu.Agencia_Turistica.model.Usuario;
import co.uniquindio.edu.Agencia_Turistica.repository.EmpleadoRepository;
import co.uniquindio.edu.Agencia_Turistica.repository.UsuarioRepository;
import jakarta.mail.MessagingException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Random;

@Service
public class EmpleadoService {

    private final EmpleadoRepository empleadoRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final CodigoVerificacionConfig codigoVerificacionConfig;


    private final EmailSender emailSender;

    public EmpleadoService(EmpleadoRepository empleadoRepository, UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, CodigoVerificacionConfig codigoVerificacionConfig, EmailSender emailSender) {
        this.empleadoRepository = empleadoRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.codigoVerificacionConfig = codigoVerificacionConfig;
        this.emailSender = emailSender;
    }

    //-----------------METODOS CRUD---------------------
    /**
     * Registra un nuevo empleado en la base de datos.
     *
     * @param empleadoDTO Datos del empleado a registrar.
     * @return UsuarioResponseDTO con los datos del empleado registrado.
     * @throws MessagingException
     * @throws IOException
     */
    public UsuarioResponseDTO registrarEmpleado(EmpleadoDTO empleadoDTO) throws MessagingException, IOException {

        verificarEmpleadoNoRegistrado(empleadoDTO);
        validarDatosEmpleado(empleadoDTO);

        String codigo = generarCodigo();
        Usuario usuario = crearUsuario(empleadoDTO, codigo);
        Empleado empleado = crearEmpleado(empleadoDTO, usuario);
        emailSender.enviarCodigoVerificacion(empleadoDTO.getEmail(), codigo);

        return new UsuarioResponseDTO(empleadoDTO.getId(), empleadoDTO.getNombre(), empleadoDTO.getApellidos(),
                empleadoDTO.getEmail(), Rol.EMPLEADO);

    }

    /**
     * Actualiza los datos de un empleado existente.
     *
     * @param empleadoDTO Datos del empleado a actualizar.
     * @return UsuarioResponseDTO con los datos del empleado actualizado.
     */
    public UsuarioResponseDTO actualizarDatosEmpleado(EmpleadoDTO empleadoDTO) {

        validarDatosEmpleado(empleadoDTO);

        Empleado empleado = empleadoRepository.findById(empleadoDTO.getId())
                .orElseThrow(() -> new UsuarioNoEncontradoException("Empleado no encontrado"));

        //Obtener el usuario asociado al empleado
        Usuario usuario = empleado.getUsuario();

        usuario.setNombre(empleadoDTO.getNombre());
        usuario.setApellido(empleadoDTO.getApellidos());
        usuarioRepository.save(usuario);

        empleado.setTelefono(empleadoDTO.getTelefono());
        empleadoRepository.save(empleado);

        return new UsuarioResponseDTO(empleadoDTO.getId(), empleadoDTO.getNombre(), empleadoDTO.getApellidos(),
                empleadoDTO.getEmail(), Rol.EMPLEADO);
    }

    /**
     * Obtiene los datos de un empleaod
     * @param id ID del empleado a buscar.
     * @return EmpleadoResponseDTO con los datos del empleado encontrado.
     */
    public EmpleadoResponseDTO obtenerEmpleado(String id) {
        // Buscar al empleado por su ID
        Empleado empleado = empleadoRepository.findById(id)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Empleado no encontrado"));

        // Retornar los detalles del empleado en un DTO (EmpleadoResponseDTO)
        return new EmpleadoResponseDTO(empleado.getId(), empleado.getUsuario().getNombre(),
                empleado.getUsuario().getApellido(), empleado.getUsuario().getEmail(),
                empleado.getTelefono(), empleado.getFechaContratacion());
    }

    /**
     * Elimina un empleado de la base de datos.
     *(esta eliminación no es física, sino que se cambia el estado del usuario a false)
     * @param id ID del empleado a eliminar.
     */
    public void eliminarEmpleado(String id) {
        // Buscar al empleado por su ID
        Empleado empleado = empleadoRepository.findById(id)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Empleado no encontrado"));

        empleado.getUsuario().setEstado(false);
        usuarioRepository.save(empleado.getUsuario());
        empleadoRepository.save(empleado);
    }



    //------METODOS COMPLEMENTARIOS -------

    /**
     * Válida que los datos del empleado esten correctos.
     *
     * @param empleadoDTO Datos del empleado.
     */
    private void validarDatosEmpleado(EmpleadoDTO empleadoDTO) {
        StringBuilder camposFaltantes = new StringBuilder();

        if (empleadoDTO.getId() == null || empleadoDTO.getId().isBlank()) {
            camposFaltantes.append("ID, ");
        }
        if (empleadoDTO.getNombre() == null || empleadoDTO.getNombre().isBlank()) {
            camposFaltantes.append("Nombre, ");
        }
        if (empleadoDTO.getApellidos() == null || empleadoDTO.getApellidos().isBlank()) {
            camposFaltantes.append("Apellidos, ");
        }
        if (empleadoDTO.getEmail() == null || empleadoDTO.getEmail().isBlank()) {
            camposFaltantes.append("Email, ");
        } else if (!empleadoDTO.getEmail().matches("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")) {
            camposFaltantes.append("Email (formato inválido), ");
        }
        if (empleadoDTO.getPassword() == null || empleadoDTO.getPassword().isBlank()) {
            camposFaltantes.append("Contraseña, ");
        }
        if (empleadoDTO.getTelefono() == null || empleadoDTO.getTelefono().isBlank()) {
            camposFaltantes.append("Teléfono, ");
        }
        if (empleadoDTO.getFechaContratacion() == null) {
            camposFaltantes.append("Fecha de Nacimiento, ");
        }
        if (camposFaltantes.length() > 0) {
            // Elimina la última coma y espacio
            camposFaltantes.setLength(camposFaltantes.length() - 2);
            throw new ValidacionException("Faltan los siguientes campos: " + camposFaltantes);
        }
    }

    /**
     * Válida que el empleado no esté registrado en la base de datos.
     *
     * @param empleadoDTO
     */
    private void verificarEmpleadoNoRegistrado(EmpleadoDTO empleadoDTO) {

        if (usuarioRepository.existsById(empleadoDTO.getId())) {
            throw new EmpleadoYaRegistradoException("El empleado ya está registrado");
        }

        if (usuarioRepository.existsByEmail(empleadoDTO.getEmail())) {
            throw new EmpleadoYaRegistradoException("El email ya está registrado");
        }

    }

    /**
     * Crea un nuevo empleado a partir de los datos del empleado y el usuario.
     *
     * @param empleadoDTO Datos del empleado.
     * @param usuario     Usuario asociado al empleado.
     * @return
     */
    private Empleado crearEmpleado(EmpleadoDTO empleadoDTO, Usuario usuario) {

        Empleado empleado = new Empleado();
        empleado.setId(empleadoDTO.getId());
        empleado.setTelefono(empleadoDTO.getTelefono());
        empleado.setUsuario(usuario);
        empleado.setFechaContratacion(LocalDate.now());
        return empleadoRepository.save(empleado);
    }

    /**
     * Crea un nuevo usuario a partir de los datos del empleado.
     *
     * @param empleadoDTO Datos del empleado.
     * @param codigoVerificacion Código de verificación.
     * @return Usuario creado.
     */
    private Usuario crearUsuario(EmpleadoDTO empleadoDTO, String codigoVerificacion) {
        Usuario usuario = new Usuario();
        usuario.setId(empleadoDTO.getId());
        usuario.setNombre(empleadoDTO.getNombre());
        usuario.setApellido(empleadoDTO.getApellidos());
        usuario.setEmail(empleadoDTO.getEmail());
        usuario.setPassword(passwordEncoder.encode(empleadoDTO.getPassword()));
        usuario.setRol(Rol.EMPLEADO);
        usuario.setCuentaVerificada(false);
        usuario.setCodigoVerificacion(codigoVerificacion);
        usuario.setFechaExpiracionCodigoVerificacion(LocalDateTime.now().plusMinutes(codigoVerificacionConfig.getExpiracionMinutos()));
        return usuarioRepository.save(usuario);
    }

    /**
     * Genera un código de verificación aleatorio de 6 dígitos.
     *
     * @return Código de verificación.
     */
    public String generarCodigo(){
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }


}
