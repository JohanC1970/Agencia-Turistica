package co.uniquindio.edu.Agencia_Turistica.dto.response;

import co.uniquindio.edu.Agencia_Turistica.model.Rol;

public record UsuarioResponseDTO(
   String id,
   String nombre,
   String apellido,
   String email,
   Rol rol
) { }
