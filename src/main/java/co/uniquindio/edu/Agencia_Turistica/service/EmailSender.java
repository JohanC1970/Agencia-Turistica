package co.uniquindio.edu.Agencia_Turistica.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;

@Service
public class EmailSender {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String correoReminente;


    public void enviarCodigoVerificacion(String destino, String codigo) throws IOException, MessagingException {

        String ruta = "src/main/resources/templates/email-verificacion.html";
        String html = new String(Files.readAllBytes(Paths.get(ruta)), StandardCharsets.UTF_8);
        html = html.replace("{CODIGO_VERIFICACION}", codigo);

        MimeMessage mensaje = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");
        helper.setTo(destino);
        helper.setSubject("Código de verificación");
        helper.setText(html, true);
        helper.setFrom(correoReminente);
    }

    public void enviarCodigoRecuperacion(String destino, String codigo) throws IOException, MessagingException {

        String ruta = "src/main/resources/templates/email-recuperacion.html";
        String html = new String(Files.readAllBytes(Paths.get(ruta)), StandardCharsets.UTF_8);
        html = html.replace("{CODIGO_RECUPERACION}", codigo);

        MimeMessage mensaje = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");
        helper.setTo(destino);
        helper.setSubject("Código de verificación");
        helper.setText(html, true);
        helper.setFrom(correoReminente);
    }
}
