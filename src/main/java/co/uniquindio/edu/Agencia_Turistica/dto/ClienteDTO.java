package co.uniquindio.edu.Agencia_Turistica.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NonNull;

import java.time.LocalDate;

@Data
public class ClienteDTO {

    @NotNull
    @NotBlank
    private String id;

    private String nombre;
    private String apellidos;

    @Email
    @NotBlank
    private String email;

    private String password;
    private String rol;
    private String telefono;
    private LocalDate fechaNacimiento;

}
