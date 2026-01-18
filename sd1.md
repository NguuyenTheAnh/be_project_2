tổng hợp các đoạn code plantuml để vẽ sơ đồ trình tự cho 24 usecases của hệ thống quản lý bán hàng

Mỗi đoạn code sẽ mô tả một usecase cụ thể:

1. usecase: đăng nhập hệ thống dành cho nhân viên và quản lý (Manager, Employee):

```plantuml
@startuml Login_Sequence_Diagram
!define BOUNDARY_COLOR #FFD700
!define CONTROL_COLOR #FFD700
!define ENTITY_COLOR #FFD700

title Sequence Diagram - Employee/Manager Login

actor "Staff\n(Manager/Employee)" as Staff
boundary "<<boundary>>\nLogin Screen" as LoginScreen BOUNDARY_COLOR
control "<<control>>\nAuth Controller" as AuthController CONTROL_COLOR
entity "<<entity>>\nAccount" as Account ENTITY_COLOR

== Authentication Process ==

Staff -> LoginScreen: Enter credentials\n{email, password}
activate LoginScreen

LoginScreen -> AuthController: POST /auth/login\n{email, password}
activate AuthController

AuthController -> Account: findByEmail(email)
activate Account
Account --> AuthController: User account data
deactivate Account

AuthController -> AuthController: Validate password\n(comparePassword)

alt Password is valid
    AuthController -> AuthController: Create JWT tokens\n(access_token, refresh_token)
    
    AuthController -> Account: updateUserToken(refresh_token)
    activate Account
    Account --> AuthController: Token saved
    deactivate Account
    
    AuthController -> AuthController: Set HTTP-only cookie\n(refresh_token)
    
    AuthController --> LoginScreen: 200 OK\n{access_token, user_info}
    deactivate AuthController
    
    LoginScreen --> Staff: Login successful\nRedirect to dashboard
    note right: Show user dashboard

else Password is invalid
    AuthController --> LoginScreen: 401 Unauthorized\n"Invalid credentials"
    deactivate AuthController
    
    LoginScreen --> Staff: Show error message\n"Invalid email or password"
end

deactivate LoginScreen

@enduml
```

2. usecase: đăng ký hệ thống dành cho nhân viên và quản lý (Manager, Employee):

```plantuml
@startuml Register_Sequence_Diagram
!define BOUNDARY_COLOR #FFD700
!define CONTROL_COLOR #FFD700
!define ENTITY_COLOR #FFD700

title Sequence Diagram - Employee/Manager Registration

actor "Admin" as Admin
boundary "<<boundary>>\nRegister Screen" as RegisterScreen BOUNDARY_COLOR
control "<<control>>\nAuth Controller" as AuthController CONTROL_COLOR
entity "<<entity>>\nAccount" as Account ENTITY_COLOR

== Registration Process ==

Admin -> RegisterScreen: Enter registration data\n{name, email, password, role, phone}
activate RegisterScreen

RegisterScreen -> AuthController: POST /auth/register\n{name, email, password, role, phone}
activate AuthController

AuthController -> Account: findByEmail(email)
activate Account
Account --> AuthController: Existing user check
deactivate Account

alt Email not exists
    AuthController -> AuthController: Hash password\n(hashPassword)
    
    AuthController -> Account: create(userData)
    activate Account
    Account --> AuthController: New account created\n{account_id, created_at}
    deactivate Account
    
    AuthController --> RegisterScreen: 201 Created\n{account_id, created_at}
    deactivate AuthController
    
    RegisterScreen --> Admin: Registration successful\nShow success message
    note right: Account created successfully

else Email already exists
    AuthController --> RegisterScreen: 401 Unauthorized\n"Email already exists"
    deactivate AuthController
    
    RegisterScreen --> Admin: Show error message\n"Email is already registered"
end

deactivate RegisterScreen

@enduml
```

3. usecase: đăng xuất hệ thống dành cho nhân viên và quản lý (Manager, Employee):

```plantuml
@startuml Logout_Sequence_Diagram
!define BOUNDARY_COLOR #FFD700
!define CONTROL_COLOR #FFD700
!define ENTITY_COLOR #FFD700

title Sequence Diagram - Employee/Manager Logout

actor "Staff\n(Manager/Employee)" as Staff
boundary "<<boundary>>\nDashboard Screen" as Dashboard BOUNDARY_COLOR
control "<<control>>\nAuth Controller" as AuthController CONTROL_COLOR
entity "<<entity>>\nAccount" as Account ENTITY_COLOR

== Logout Process ==

Staff -> Dashboard: Click logout button
activate Dashboard

Dashboard -> AuthController: POST /auth/logout\n{authorization: Bearer token}
activate AuthController

AuthController -> AuthController: Extract user from JWT\n(req.user)

AuthController -> Account: removeUserToken(account_id)
activate Account
Account --> AuthController: Refresh token cleared
deactivate Account

AuthController -> AuthController: Clear HTTP-only cookie\n(response.clearCookie)

AuthController --> Dashboard: 200 OK\n"Logout successful"
deactivate AuthController

Dashboard --> Staff: Logout successful\nRedirect to login page
note right: Session terminated

deactivate Dashboard

@enduml
```

4. usecase: Cập nhật thông tin cá nhân dành cho nhân viên và quản lý (Manager, Employee):

```plantuml
@startuml UpdateProfile_Sequence_Diagram
!define BOUNDARY_COLOR #FFD700
!define CONTROL_COLOR #FFD700
!define ENTITY_COLOR #FFD700

title Sequence Diagram - Update Personal Information

actor "Staff\n(Manager/Employee)" as Staff
boundary "<<boundary>>\nProfile Screen" as ProfileScreen BOUNDARY_COLOR
control "<<control>>\nAccount Controller" as AccountController CONTROL_COLOR
entity "<<entity>>\nAccount" as Account ENTITY_COLOR

== Update Profile Process ==

Staff -> ProfileScreen: Access profile page
activate ProfileScreen

ProfileScreen -> AccountController: GET /account/{id}
activate AccountController

AccountController -> Account: findOne(id)
activate Account
Account --> AccountController: Current account data
deactivate Account

AccountController --> ProfileScreen: 200 OK\n{current profile data}
deactivate AccountController

ProfileScreen --> Staff: Display current profile\nShow editable form

Staff -> ProfileScreen: Edit profile data\n{name, phone, password}
ProfileScreen -> AccountController: PATCH /account/{id}\n{name, phone, password}
activate AccountController

alt Password is provided
    AccountController -> AccountController: Hash password\n(hashPassword)
end

AccountController -> Account: update(id, updateData)
activate Account
Account --> AccountController: Update result
deactivate Account

AccountController --> ProfileScreen: 200 OK\n"Profile updated successfully"
deactivate AccountController

ProfileScreen --> Staff: Show success message\nDisplay updated profile
note right: Profile updated

deactivate ProfileScreen

@enduml
```

5. usecase: quản lý danh sách bàn (xem, thêm, sửa, xóa):