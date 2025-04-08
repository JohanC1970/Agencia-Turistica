package co.uniquindio.edu.Agencia_Turistica.dto.response;

import java.time.LocalDate;

public record EmpleadoResponseDTO(
        String id,
        String nombre,
        String apellidos,
        String email,
        String telefono,
        LocalDate fechaContratacion
) { }
