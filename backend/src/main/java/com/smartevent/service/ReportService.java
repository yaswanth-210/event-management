package com.smartevent.service;

import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.smartevent.model.Attendance;
import com.smartevent.model.Registration;

import com.smartevent.repository.AttendanceRepository;
import com.smartevent.repository.RegistrationRepository;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class ReportService {

    private final AttendanceRepository attendanceRepository;
    private final RegistrationRepository registrationRepository;

    public ReportService(AttendanceRepository attendanceRepository, RegistrationRepository registrationRepository) {
        this.attendanceRepository = attendanceRepository;
        this.registrationRepository = registrationRepository;
    }

    public byte[] generateAttendancePDF() {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            Font fontTitle = new Font(Font.HELVETICA, 18, Font.BOLD);
            Paragraph title = new Paragraph("Smart Event Management - Attendance Report", fontTitle);
            title.setSpacingAfter(20);
            document.add(title);

            PdfPTable table = new PdfPTable(4);
            table.addCell("Ticket Code");
            table.addCell("Attendee Name");
            table.addCell("Event");
            table.addCell("Check-in Time");

            List<Attendance> list = attendanceRepository.findAll();
            for (Attendance a : list) {
                table.addCell(a.getTicket() != null ? a.getTicket().getTicketCode() : "N/A");
                table.addCell(a.getUser() != null ? a.getUser().getName() : "Guest");
                table.addCell(a.getEvent() != null ? a.getEvent().getName() : "N/A");
                table.addCell(a.getEntryTime() != null ? a.getEntryTime().toString() : "N/A");
            }

            document.add(table);
            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            e.printStackTrace();
            return new byte[0];
        }
    }

    public byte[] generateAttendanceExcel() {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Attendance Logs");

            Row headerRow = sheet.createRow(0);
            String[] headers = {"ID", "Ticket Code", "Attendee Name", "Event Name", "Gate Number", "Entry Time"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }

            List<Attendance> list = attendanceRepository.findAll();
            int rowIdx = 1;
            for (Attendance a : list) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(a.getId());
                row.createCell(1).setCellValue(a.getTicket() != null ? a.getTicket().getTicketCode() : "");
                row.createCell(2).setCellValue(a.getUser() != null ? a.getUser().getName() : "");
                row.createCell(3).setCellValue(a.getEvent() != null ? a.getEvent().getName() : "");
                row.createCell(4).setCellValue(a.getGateNumber());
                row.createCell(5).setCellValue(a.getEntryTime() != null ? a.getEntryTime().toString() : "");
            }

            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            e.printStackTrace();
            return new byte[0];
        }
    }

    public byte[] generateRegistrationPDF() {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            Font fontTitle = new Font(Font.HELVETICA, 18, Font.BOLD);
            Paragraph title = new Paragraph("Event Registration Summary Report", fontTitle);
            title.setSpacingAfter(20);
            document.add(title);

            PdfPTable table = new PdfPTable(4);
            table.addCell("Reg ID");
            table.addCell("User Name");
            table.addCell("Event");
            table.addCell("Amount ($)");

            List<Registration> list = registrationRepository.findAll();
            for (Registration r : list) {
                table.addCell(String.valueOf(r.getId()));
                table.addCell(r.getUser() != null ? r.getUser().getName() : "N/A");
                table.addCell(r.getEvent() != null ? r.getEvent().getName() : "N/A");
                table.addCell(String.valueOf(r.getTotalAmount()));
            }

            document.add(table);
            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            e.printStackTrace();
            return new byte[0];
        }
    }

    public byte[] generateRegistrationExcel() {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Registrations");

            Row headerRow = sheet.createRow(0);
            String[] headers = {"Reg ID", "User Name", "User Email", "Event Name", "Amount Paid", "Registration Date"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }

            List<Registration> list = registrationRepository.findAll();
            int rowIdx = 1;
            for (Registration r : list) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(r.getId());
                row.createCell(1).setCellValue(r.getUser() != null ? r.getUser().getName() : "");
                row.createCell(2).setCellValue(r.getUser() != null ? r.getUser().getEmail() : "");
                row.createCell(3).setCellValue(r.getEvent() != null ? r.getEvent().getName() : "");
                row.createCell(4).setCellValue(r.getTotalAmount());
                row.createCell(5).setCellValue(r.getRegistrationDate() != null ? r.getRegistrationDate().toString() : "");
            }

            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            e.printStackTrace();
            return new byte[0];
        }
    }
}
