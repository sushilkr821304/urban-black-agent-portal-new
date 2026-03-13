package com.urbanblack.service;

import com.urbanblack.entity.OtpVerification;
import com.urbanblack.repository.OtpVerificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class OtpService {

    @Autowired
    private OtpVerificationRepository otpRepository;

    @Value("${fast2sms.api.key:mock_key_for_dev}")
    private String fast2SmsApiKey;

    public void generateAndSendOtp(String phoneNumber) {
        String otp = String.format("%06d", new Random().nextInt(999999));

        Optional<OtpVerification> existingOpt = otpRepository.findByPhoneNumber(phoneNumber);
        OtpVerification otpVerification = existingOpt.orElse(new OtpVerification());

        otpVerification.setPhoneNumber(phoneNumber);
        otpVerification.setOtp(otp);
        otpVerification.setExpiryTime(LocalDateTime.now().plusMinutes(5));

        otpRepository.save(otpVerification);

        System.out.println("=================================================");
        System.out.println("FAST2SMS SIMULATOR => OTP FOR " + phoneNumber + " IS: " + otp);
        System.out.println("=================================================");

        if (!"mock_key_for_dev".equals(fast2SmsApiKey) && !fast2SmsApiKey.isEmpty()) {
            sendSmsViaFast2Sms(phoneNumber, otp);
        }
    }

    private void sendSmsViaFast2Sms(String phoneNumber, String otp) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            
            // Build the URL properly with encoded query parameters
            String url = org.springframework.web.util.UriComponentsBuilder.fromHttpUrl("https://www.fast2sms.com/dev/bulkV2")
                    .queryParam("authorization", fast2SmsApiKey)
                    .queryParam("route", "q")
                    .queryParam("message", "Your Verification OTP is " + otp)
                    .queryParam("language", "english")
                    .queryParam("flash", "0")
                    .queryParam("numbers", phoneNumber)
                    .build().toUriString();

            HttpHeaders headers = new HttpHeaders();
            headers.set("cache-control", "no-cache");
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            System.out.println("Fast2SMS Response: " + response.getBody());
        } catch (Exception e) {
            System.err.println("Failed to send SMS using Fast2SMS: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public boolean verifyOtp(String phoneNumber, String inputOtp) {
        Optional<OtpVerification> otpVerificationOpt = otpRepository.findByPhoneNumber(phoneNumber);
        if (otpVerificationOpt.isPresent()) {
            OtpVerification otpVerification = otpVerificationOpt.get();
            if (otpVerification.getOtp().equals(inputOtp)) {
                if (otpVerification.getExpiryTime().isAfter(LocalDateTime.now())) {
                    otpRepository.delete(otpVerification);
                    return true;
                }
            }
        }
        return false;
    }
}
