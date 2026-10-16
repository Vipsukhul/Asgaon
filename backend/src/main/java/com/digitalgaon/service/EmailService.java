package com.digitalgaon.service;

import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    public void sendOtpEmail(String toEmail, String otpCode) {
        log.info("=================================================");
        log.info(">> Asgaon OTP: [ {} ] sent to email: {}", otpCode, toEmail);
        log.info("=================================================");

        if (mailSender == null || fromEmail == null || fromEmail.isBlank()) {
            log.warn(
                    "JavaMailSender or spring.mail.username not configured. Simulated email OTP sent for development.");
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "Asgaon Asgaon");
            helper.setTo(toEmail);
            helper.setSubject("Your Asgaon Verification Code: " + otpCode);

            String html = """
                        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e8e2d9; border-radius: 16px; background-color: #ffffff;">
                            <div style="text-align: center; margin-bottom: 20px;">
                                <h2 style="color: #003629; margin: 0;">Asgaon • Asgaon</h2>
                                <p style="color: #707974; font-size: 13px; margin: 4px 0 0 0;">Citizen & Merchant Verification</p>
                            </div>
                            <div style="background-color: #f9f3ea; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 20px;">
                                <span style="font-size: 12px; font-weight: bold; color: #a63b00; text-transform: uppercase; letter-spacing: 1px;">Your One-Time Password (OTP)</span>
                                <h1 style="font-size: 36px; letter-spacing: 6px; color: #003629; margin: 10px 0;">%s</h1>
                                <p style="font-size: 12px; color: #707974; margin: 0;">This code is valid for <strong>5 minutes</strong>. Do not share it with anyone.</p>
                            </div>
                            <p style="font-size: 13px; color: #404945; line-height: 1.5;">
                                You requested this verification code to access your Asgaon civic profile or sign in to village services.
                            </p>
                            <div style="border-top: 1px solid #f3ede4; margin-top: 24px; padding-top: 12px; text-align: center; font-size: 11px; color: #a0a8a3;">
                                Gram Panchayat Asgaon, Tal. Pauni, Dist. Bhandara - 441910
                            </div>
                        </div>
                    """
                    .formatted(otpCode);

            helper.setText(html, true);
            mailSender.send(message);
            log.info("Email OTP successfully delivered to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send real email to {}: {}. (Simulated OTP {} is active in logs).", toEmail,
                    e.getMessage(), otpCode);
        }
    }

    public int sendBroadcastEmail(String subject, String contentHtml, String bannerImageUrl, String actionUrl, java.util.List<String> targetEmails) {
        log.info(">> Broadcasting email: {} to {} recipients", subject, targetEmails != null ? targetEmails.size() : 0);
        if (targetEmails == null || targetEmails.isEmpty()) return 0;
        int sentCount = 0;
        for (String to : targetEmails) {
            if (to == null || to.isBlank() || !to.contains("@")) continue;
            try {
                if (mailSender == null || fromEmail == null || fromEmail.isBlank()) {
                    log.info("Simulated broadcast email to {}: {}", to, subject);
                    sentCount++;
                    continue;
                }
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                helper.setFrom(fromEmail, "आसगाव ग्रामपंचायत (Asgaon Panchayat)");
                helper.setTo(to.trim());
                helper.setSubject(subject);

                String bannerHtml = (bannerImageUrl != null && !bannerImageUrl.isBlank())
                    ? String.format("<div style=\"margin: 16px 0; text-align: center;\"><img src=\"%s\" alt=\"Notice Banner\" style=\"max-width: 100%%; max-height: 280px; object-fit: cover; border-radius: 12px;\" /></div>", bannerImageUrl)
                    : "";

                String ctaHtml = (actionUrl != null && !actionUrl.isBlank())
                    ? String.format("<div style=\"text-align: center; margin: 24px 0;\"><a href=\"%s\" style=\"background-color: #166534; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;\">सविस्तर पहा (View Details)</a></div>", actionUrl.startsWith("http") ? actionUrl : "https://asgaon.vercel.app" + actionUrl)
                    : "";

                String html = """
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e8e2d9; border-radius: 16px; background-color: #ffffff;">
                        <div style="text-align: center; border-bottom: 2px solid #166534; padding-bottom: 16px; margin-bottom: 20px;">
                            <h2 style="color: #166534; margin: 0; font-size: 22px;">🏛️ ग्रामपंचायत आसगाव</h2>
                            <p style="color: #707974; font-size: 13px; margin: 4px 0 0 0;">अधिकृत नागरिक सूचना व प्रसिद्धी पत्रक</p>
                        </div>
                        <h3 style="color: #1d1b16; font-size: 18px; margin-top: 0;">%s</h3>
                        %s
                        <div style="font-size: 14px; color: #374151; line-height: 1.6; white-space: pre-wrap; margin: 16px 0;">%s</div>
                        %s
                        <div style="border-top: 1px solid #f3ede4; margin-top: 30px; padding-top: 14px; text-align: center; font-size: 11px; color: #9ca3af;">
                            ग्रामपंचायत कार्यालय आसगाव, ता. पवनी, जि. भंडारा - ४४१९१०<br/>
                            हे स्वयंचलित ई-मेल पत्रक आहे.
                        </div>
                    </div>
                """.formatted(subject, bannerHtml, contentHtml, ctaHtml);

                helper.setText(html, true);
                mailSender.send(message);
                sentCount++;
            } catch (Exception e) {
                log.warn("Failed sending email to {}: {}", to, e.getMessage());
            }
        }
        return sentCount;
    }
}
