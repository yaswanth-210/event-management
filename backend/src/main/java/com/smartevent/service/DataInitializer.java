package com.smartevent.service;

import com.smartevent.dto.TicketDTO;

import com.smartevent.model.Event;
import com.smartevent.model.User;
import com.smartevent.repository.EventRepository;
import com.smartevent.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final PasswordEncoder passwordEncoder;
    private final TicketService ticketService;

    public DataInitializer(UserRepository userRepository,
                           EventRepository eventRepository,
                           PasswordEncoder passwordEncoder,
                           TicketService ticketService) {
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.passwordEncoder = passwordEncoder;
        this.ticketService = ticketService;
    }

    @Override
    public void run(String... args) throws Exception {
        // Seed Admin User
        User admin = userRepository.findByEmail("yaswanthreddygajjala9@gmail.com")
                .orElseGet(() -> userRepository.findByEmail("admin@smartjira.com").orElseGet(() -> new User("System Administrator", "yaswanthreddygajjala9@gmail.com", passwordEncoder.encode("Gani@2006"), "+1 800 555 0199", "admin")));
        
        admin.setEmail("yaswanthreddygajjala9@gmail.com");
        admin.setPasswordHash(passwordEncoder.encode("Gani@2006"));
        admin.setRole("admin");
        userRepository.save(admin);

        // Seed Visitor User
        User visitor = userRepository.findByEmail("visitor@example.com").orElseGet(() -> {
            User u = new User("Yaswanth Reddy", "visitor@example.com", passwordEncoder.encode("visitor123"), "+1 555 014 9922", "visitor");
            return userRepository.save(u);
        });

        // Seed Events if empty
        if (eventRepository.count() == 0) {
            Event e1 = new Event();
            e1.setName("Global Tech Summit 2026");
            e1.setDescription("The premier gathering for AI innovators, software architects, and tech leaders worldwide.");
            e1.setCategory("Technology");
            e1.setVenue("Metropolitan Convention Center, Hall A");
            e1.setDate("2026-08-15");
            e1.setStartTime("09:00 AM");
            e1.setEndTime("05:00 PM");
            e1.setMaxCapacity(600);
            e1.setRemainingSeats(420);
            e1.setTicketPrice(150.00);
            e1.setBannerImage("https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80");
            e1.setStatus("Active");
            Event savedE1 = eventRepository.save(e1);

            Event e2 = new Event();
            e2.setName("International Music & Cyber Fest");
            e2.setDescription("Experience live electronic synthesizer visualizers, immersive acoustics, and interactive digital art.");
            e2.setCategory("Entertainment");
            e2.setVenue("Cyber Arena & Open Air Park");
            e2.setDate("2026-09-01");
            e2.setStartTime("06:00 PM");
            e2.setEndTime("11:30 PM");
            e2.setMaxCapacity(1000);
            e2.setRemainingSeats(680);
            e2.setTicketPrice(75.00);
            e2.setBannerImage("https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80");
            e2.setStatus("Active");
            eventRepository.save(e2);

            Event e3 = new Event();
            e3.setName("Sustainable Future & Green Energy Expo");
            e3.setDescription("Showcasing next-generation renewable technology, electric mobility, and clean grid innovations.");
            e3.setCategory("CleanTech");
            e3.setVenue("Grand Pavilion Center");
            e3.setDate("2026-09-20");
            e3.setStartTime("10:00 AM");
            e3.setEndTime("04:00 PM");
            e3.setMaxCapacity(400);
            e3.setRemainingSeats(210);
            e3.setTicketPrice(0.00);
            e3.setBannerImage("https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80");
            e3.setStatus("Upcoming");
            eventRepository.save(e3);

            // Register demo ticket for visitor
            try {
                ticketService.registerTicket(visitor.getId(), savedE1.getId());
            } catch (Exception ex) {
                // Ignore seed error
            }
        }
    }
}
