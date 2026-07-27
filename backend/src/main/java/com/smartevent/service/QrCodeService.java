package com.smartevent.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.file.FileSystems;
import java.nio.file.Path;

@Service
public class QrCodeService {

    public String generateQrCode(String ticketCode, Long userId, Long eventId) {
        try {
            String payload = String.format("TICKET:%s|USER:%d|EVENT:%d", ticketCode, userId, eventId);
            String fileName = "qr_" + ticketCode + ".png";
            File dir = new File("./uploads/qr_codes");
            if (!dir.exists()) {
                dir.mkdirs();
            }

            String relativePath = "/uploads/qr_codes/" + fileName;
            Path filePath = FileSystems.getDefault().getPath("./uploads/qr_codes/" + fileName);

            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(payload, BarcodeFormat.QR_CODE, 250, 250);

            MatrixToImageWriter.writeToPath(bitMatrix, "PNG", filePath);
            return relativePath;
        } catch (Exception e) {
            e.printStackTrace();
            return "/uploads/qr_codes/placeholder.png";
        }
    }
}
