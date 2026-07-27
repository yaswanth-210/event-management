package com.smartevent.dto;

public class AuthDTOs {

    public static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class RegisterRequest {
        private String name;
        private String email;
        private String password;
        private String phone;
        private String role = "visitor";

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }

    public static class AuthResponse {
        private String access_token;
        private UserDTO user;

        public AuthResponse(String access_token, UserDTO user) {
            this.access_token = access_token;
            this.user = user;
        }

        public String getAccess_token() { return access_token; }
        public void setAccess_token(String access_token) { this.access_token = access_token; }
        public UserDTO getUser() { return user; }
        public void setUser(UserDTO user) { this.user = user; }
    }

    public static class UserDTO {
        private Long id;
        private String name;
        private String email;
        private String phone;
        private String role;
        private String photo_url;
        private String created_at;

        public UserDTO(Long id, String name, String email, String phone, String role, String photo_url, String created_at) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.phone = phone;
            this.role = role;
            this.photo_url = photo_url;
            this.created_at = created_at;
        }

        public Long getId() { return id; }
        public String getName() { return name; }
        public String getEmail() { return email; }
        public String getPhone() { return phone; }
        public String getRole() { return role; }
        public String getPhoto_url() { return photo_url; }
        public String getCreated_at() { return created_at; }
    }
}
