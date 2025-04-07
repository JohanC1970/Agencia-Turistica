package co.uniquindio.edu.Agencia_Turistica.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NonNull;

import java.time.LocalDate;

@Data
public class UsuarioDTO {

    private String nombre;
    private String apellidos;
    private String id;

    @Email
    @NotBlank
    private String email;
    private String password;
    private String rol;
    private String telefono;
    private LocalDate fechaNacimiento;


}
