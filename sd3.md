8. usecase: Nhận xử lý đơn hàng dành cho nhân viên (Manager, Employee):

```plantuml
@startuml AssignOrderHandler_Sequence_Diagram
!define BOUNDARY_COLOR #FFD700
!define CONTROL_COLOR #FFD700
!define ENTITY_COLOR #FFD700

actor "Staff\n(Manager/Employee)" as Staff
boundary "<<boundary>>\nOrder Management Screen" as OrderScreen BOUNDARY_COLOR
control "<<control>>\nOrder Controller" as OrderController CONTROL_COLOR
entity "<<entity>>\nOrder" as Order ENTITY_COLOR

== Assign Order Handler Process ==

Staff -> OrderScreen: Select order to handle
activate OrderScreen

OrderScreen -> OrderScreen: Display order details\n(Order ID, Guest, Table, Status)

OrderScreen -> Staff: Confirm to assign as handler?

Staff -> OrderScreen: Confirm assignment
OrderScreen -> OrderController: PATCH /order/:id\n{order_handler_id: staff_id}
activate OrderController

OrderController -> OrderController: Validate updateOrderDto\n(order_handler_id)

OrderController -> Order: update(id, {order_handler_id})
activate Order
Order --> OrderController: Update result\n{affected: 1, generatedMaps: [], raw: []}
deactivate Order

OrderController --> OrderScreen: 200 OK\n"Update order successfully"
deactivate OrderController

OrderScreen -> OrderScreen: Update UI to show\nassigned handler

OrderScreen --> Staff: Display success message\n"Order assigned successfully"
note right: Staff is now assigned as order handler

deactivate OrderScreen

@enduml
```

9. usecase: Xem chi tiết đơn hàng dành cho nhân viên (Manager, Employee):

```plantuml
@startuml ViewOrderDetails_Sequence_Diagram
!define BOUNDARY_COLOR #FFD700
!define CONTROL_COLOR #FFD700
!define ENTITY_COLOR #FFD700

actor "Staff\n(Manager/Employee)" as Staff
boundary "<<boundary>>\nOrder Details Screen" as OrderDetailsScreen BOUNDARY_COLOR
control "<<control>>\nOrder Controller" as OrderController CONTROL_COLOR
entity "<<entity>>\nOrder" as Order ENTITY_COLOR

== View Order Details Process ==

Staff -> OrderDetailsScreen: Click on order to view details
activate OrderDetailsScreen

OrderDetailsScreen -> OrderController: GET /order/:id
activate OrderController

OrderController -> Order: findOne(id)
activate Order
Order --> OrderController: Order with full relations\n{order_id, options, status, total_order, guest_info, table_info, order_handler_info, cart_items, dish_details, created_at, updated_at}
deactivate Order

OrderController --> OrderDetailsScreen: 200 OK\n[Complete order information]
deactivate OrderController

OrderDetailsScreen -> OrderDetailsScreen: Format and display data\n- Order information\n- Guest details\n- Table assignment\n- Handler information\n- Cart items & dishes\n- Pricing breakdown

OrderDetailsScreen --> Staff: Show detailed order view\n- Order ID & Status\n- Guest name & Table\n- Order handler\n- Items list with quantities\n- Total amount\n- Order timestamps
note right: Complete order details displayed

deactivate OrderDetailsScreen

@enduml
```

10. usecase: Thêm mới bàn ăn dành cho nhân viên (Manager, Employee):

```plantuml
@startuml CreateTable_Sequence_Diagram
!define BOUNDARY_COLOR #FFD700
!define CONTROL_COLOR #FFD700
!define ENTITY_COLOR #FFD700

actor "Staff\n(Manager/Employee)" as Staff
boundary "<<boundary>>\nTable Management Screen" as TableScreen BOUNDARY_COLOR
control "<<control>>\nTable Controller" as TableController CONTROL_COLOR
entity "<<entity>>\nTable" as Table ENTITY_COLOR

== Create New Table Process ==

Staff -> TableScreen: Access table management page
activate TableScreen

TableScreen -> Staff: Display "Add New Table" form

Staff -> TableScreen: Fill table details\n(table_name, capacity, payment_status, status)

TableScreen -> TableScreen: Validate form data\n- Required fields\n- Capacity > 0\n- Valid enum values

TableScreen -> Staff: Confirm table creation?

Staff -> TableScreen: Confirm create table

TableScreen -> TableController: POST /table\n{table_name, payment_status, capacity, status}
activate TableController

TableController -> TableController: Validate CreateTableDto\n- @IsNotEmpty validations\n- @IsEnum validations\n- @IsInt validation

TableController -> Table: create(createTableDto)
activate Table
Table --> TableController: New table created\n{table_id, table_name, payment_status, capacity, status, created_at, updated_at}
deactivate Table

TableController --> TableScreen: 201 Created\n"Create table successfully"
deactivate TableController

TableScreen -> TableScreen: Update table list\nAdd new table to display

TableScreen --> Staff: Show success message\n"Table created successfully"
note right: New table available for use

deactivate TableScreen

@enduml
```

11. usecase: xem danh sach bàn ăn dành cho nhân viên (Manager, Employee):

```plantuml
@startuml ViewTablesList_Sequence_Diagram
!define BOUNDARY_COLOR #FFD700
!define CONTROL_COLOR #FFD700
!define ENTITY_COLOR #FFD700

title Sequence Diagram - View Tables List

actor "Staff\n(Manager/Employee)" as Staff
boundary "<<boundary>>\nTable Management Screen" as TableScreen BOUNDARY_COLOR
control "<<control>>\nTable Controller" as TableController CONTROL_COLOR
entity "<<entity>>\nTable" as Table ENTITY_COLOR

== View Tables List Process ==

Staff -> TableScreen: Access table management page
activate TableScreen

TableScreen -> TableController: GET /table?page=1&limit=6&payment_status=&status=&search=&sort=ASC
activate TableController

TableController -> Table: findAll(page, limit, payment_status, status, search, sort)
activate Table
Table --> TableController: Tables with pagination\n{totalTables, totalPage, currentPage, limit, tables[]}\n- table_id, table_name, payment_status, capacity, status, created_at, updated_at
deactivate Table

TableController --> TableScreen: 200 OK\n[Paginated tables list]
deactivate TableController

TableScreen -> TableScreen: Display tables grid\n- Apply filters (payment_status, status)\n- Search by table_name\n- Sort by capacity\n- Pagination controls

TableScreen --> Staff: Show tables management interface\n- Tables grid with details\n- Filter options (Paid/Unpaid, Available/Unavailable)\n- Search bar\n- Sort controls\n- Pagination (page, limit)\n- Add/Edit/Delete buttons
note right: Tables list displayed with management features

deactivate TableScreen

@enduml
```

12. usecase: Cập nhật thông tin bàn ăn dành cho nhân viên (Manager, Employee):

```plantuml
@startuml UpdateTable_Sequence_Diagram
!define BOUNDARY_COLOR #FFD700
!define CONTROL_COLOR #FFD700
!define ENTITY_COLOR #FFD700

title Sequence Diagram - Update Table Information

actor "Staff\n(Manager/Employee)" as Staff
boundary "<<boundary>>\nTable Management Screen" as TableScreen BOUNDARY_COLOR
control "<<control>>\nTable Controller" as TableController CONTROL_COLOR
entity "<<entity>>\nTable" as Table ENTITY_COLOR

== Update Table Information Process ==

Staff -> TableScreen: Select table to edit
activate TableScreen

TableScreen -> TableController: GET /table/:id
activate TableController

TableController -> Table: findOne(id)
activate Table
Table --> TableController: Current table data\n{table_id, table_name, payment_status, capacity, status, created_at, updated_at}
deactivate Table

TableController --> TableScreen: 200 OK\n[Current table information]
deactivate TableController

TableScreen -> TableScreen: Pre-fill edit form\nwith current data

TableScreen -> Staff: Display "Edit Table" form\n(table_name, capacity, payment_status, status)

Staff -> TableScreen: Modify table details\n(update fields as needed)

TableScreen -> TableScreen: Validate form data\n- Required fields\n- Capacity > 0\n- Valid enum values\n- Unique table_name

TableScreen -> Staff: Confirm table update?

Staff -> TableScreen: Confirm update table

TableScreen -> TableController: PATCH /table/:id\n{table_name?, payment_status?, capacity?, status?}
activate TableController

TableController -> TableController: Validate UpdateTableDto\n(partial validation)

TableController -> Table: update(id, updateTableDto)
activate Table
Table --> TableController: Update result\n{affected: 1, generatedMaps: [], raw: []}
deactivate Table

TableController --> TableScreen: 200 OK\n"Update table successfully"
deactivate TableController

TableScreen -> TableScreen: Refresh table list\nShow updated information

TableScreen --> Staff: Display success message\n"Table updated successfully"
note right: Table information updated

deactivate TableScreen

@enduml
```

13. usecase: xóa bàn ăn dành cho nhân viên (Manager, Employee):

```plantuml
@startuml DeleteTable_Sequence_Diagram
!define BOUNDARY_COLOR #FFD700
!define CONTROL_COLOR #FFD700
!define ENTITY_COLOR #FFD700

title Sequence Diagram - Delete Table

actor "Staff\n(Manager/Employee)" as Staff
boundary "<<boundary>>\nTable Management Screen" as TableScreen BOUNDARY_COLOR
control "<<control>>\nTable Controller" as TableController CONTROL_COLOR
entity "<<entity>>\nTable" as Table ENTITY_COLOR

== Delete Table Process ==

Staff -> TableScreen: Select table to delete
activate TableScreen

TableScreen -> TableScreen: Display table information\n(table_id, table_name, capacity, status)

TableScreen -> Staff: Confirm table deletion?\n"Are you sure you want to delete this table?"

Staff -> TableScreen: Confirm delete table

TableScreen -> TableController: DELETE /table/:id
activate TableController

TableController -> Table: findOneBy({table_id: id})
activate Table
Table --> TableController: Check if table exists\n{table_id, table_name, payment_status, capacity, status}
deactivate Table

alt Table exists
    TableController -> Table: softDelete({table_id: id})
    activate Table
    Table --> TableController: Soft delete result\n{affected: 1, generatedMaps: [], raw: []}
    deactivate Table
    
    TableController --> TableScreen: 200 OK\n"Delete table successfully"
else Table not found
    TableController --> TableScreen: 404 Not Found\n"Table not found"
end

deactivate TableController

TableScreen -> TableScreen: Remove table from list\nRefresh table display

TableScreen --> Staff: Display result message\n"Table deleted successfully" or "Table not found"
note right: Table soft deleted (deleted_at set)

deactivate TableScreen

@enduml
```

14. usecase: Thêm mới món ăn dành cho nhân viên (Manager, Employee):

```plantuml
@startuml CreateDish_Sequence_Diagram
!define BOUNDARY_COLOR #FFD700
!define CONTROL_COLOR #FFD700
!define ENTITY_COLOR #FFD700

title Sequence Diagram - Create New Dish

actor "Staff\n(Manager/Employee)" as Staff
boundary "<<boundary>>\nDish Management Screen" as DishScreen BOUNDARY_COLOR
control "<<control>>\nDish Controller" as DishController CONTROL_COLOR
entity "<<entity>>\nDish" as Dish ENTITY_COLOR

== Create New Dish Process ==

Staff -> DishScreen: Access dish management page
activate DishScreen

DishScreen -> Staff: Display "Add New Dish" form

Staff -> DishScreen: Fill dish details\n(dish_name, price, description, image_name, status, category, options)

DishScreen -> DishScreen: Validate form data\n- Required fields\n- Price > 0\n- Valid enum values (status, category)\n- Image file validation

DishScreen -> Staff: Confirm dish creation?

Staff -> DishScreen: Confirm create dish

DishScreen -> DishController: POST /dish\n{dish_name, price, description, image_name, status, category, options}
activate DishController

DishController -> DishController: Validate CreateDishDto\n- @IsNotEmpty validations\n- @IsNumber validation\n- @IsEnum validations\n- @IsString validations

DishController -> Dish: create(createDishDto)
activate Dish
Dish --> DishController: New dish created\n{dish_id, dish_name, price, description, image_name, status, category, options, created_at, updated_at}
deactivate Dish

DishController --> DishScreen: 201 Created\n"Create dish successfully"
deactivate DishController

DishScreen -> DishScreen: Update dish list\nAdd new dish to display

DishScreen --> Staff: Show success message\n"Dish created successfully"
note right: New dish available in menu

deactivate DishScreen
```

15. usecase: Xem danh sách món ăn dành cho nhân viên (Manager, Employee):

```plantuml
@startuml ViewDishesList_Sequence_Diagram
!define BOUNDARY_COLOR #FFD700
!define CONTROL_COLOR #FFD700
!define ENTITY_COLOR #FFD700

title Sequence Diagram - View Dishes List

actor "Staff\n(Manager/Employee)" as Staff
boundary "<<boundary>>\nDish Management Screen" as DishScreen BOUNDARY_COLOR
control "<<control>>\nDish Controller" as DishController CONTROL_COLOR
entity "<<entity>>\nDish" as Dish ENTITY_COLOR

== View Dishes List Process ==

Staff -> DishScreen: Access dish management page
activate DishScreen

DishScreen -> DishController: GET /dish?page=1&limit=6&category=Chicken&status=Available&search=&sort=ASC
activate DishController

DishController -> Dish: findAll(page, limit, category, status, search, sort)
activate Dish
Dish --> DishController: Dishes with pagination\n{totalDishes, totalPage, currentPage, limit, dishes[]}\n- dish_id, dish_name, price, description, image_name, status, category, options, created_at, updated_at
deactivate Dish

DishController --> DishScreen: 200 OK\n[Paginated dishes list]
deactivate DishController

DishScreen -> DishScreen: Display dishes grid\n- Apply filters (category, status)\n- Search by dish_name\n- Sort by price\n- Pagination controls\n- Show dish images

DishScreen --> Staff: Show dishes management interface\n- Dishes grid with images\n- Filter options (Chicken/Water, Available/Unavailable)\n- Search bar\n- Sort controls\n- Pagination (page, limit)\n- Add/Edit/Delete buttons\n- Price display
note right: Dishes list displayed with management features

deactivate DishScreen

@enduml
```

16. usecase: Cập nhật thông tin món ăn dành cho nhân viên (Manager, Employee):

```plantuml
@startuml UpdateDish_Sequence_Diagram
!define BOUNDARY_COLOR #FFD700
!define CONTROL_COLOR #FFD700
!define ENTITY_COLOR #FFD700

title Sequence Diagram - Update Dish Information

actor "Staff\n(Manager/Employee)" as Staff
boundary "<<boundary>>\nDish Management Screen" as DishScreen BOUNDARY_COLOR
control "<<control>>\nDish Controller" as DishController CONTROL_COLOR
entity "<<entity>>\nDish" as Dish ENTITY_COLOR

== Update Dish Information Process ==

Staff -> DishScreen: Select dish to edit
activate DishScreen

DishScreen -> DishController: GET /dish/:id
activate DishController

DishController -> Dish: findOne(id)
activate Dish
Dish --> DishController: Current dish data\n{dish_id, dish_name, price, description, image_name, status, category, options, created_at, updated_at}
deactivate Dish

DishController --> DishScreen: 200 OK\n[Current dish information]
deactivate DishController

DishScreen -> DishScreen: Pre-fill edit form\nwith current data

DishScreen -> Staff: Display "Edit Dish" form\n(dish_name, price, description, image_name, status, category, options)

Staff -> DishScreen: Modify dish details\n(update fields as needed)

DishScreen -> DishScreen: Validate form data\n- Required fields\n- Price > 0\n- Valid enum values (status, category)\n- Image file validation

DishScreen -> Staff: Confirm dish update?

Staff -> DishScreen: Confirm update dish

DishScreen -> DishController: PATCH /dish/:id\n{dish_name?, price?, description?, image_name?, status?, category?, options?}
activate DishController

DishController -> DishController: Validate UpdateDishDto\n(partial validation)

DishController -> Dish: update(id, updateDishDto)
activate Dish
Dish --> DishController: Update result\n{affected: 1, generatedMaps: [], raw: []}
deactivate Dish

DishController --> DishScreen: 200 OK\n"Update dish successfully"
deactivate DishController

DishScreen -> DishScreen: Refresh dish list\nShow updated information

DishScreen --> Staff: Display success message\n"Dish updated successfully"
note right: Dish information updated

deactivate DishScreen

@enduml
```

17. usecase: Xóa món ăn dành cho nhân viên (Manager, Employee):

```plantuml
@startuml DeleteDish_Sequence_Diagram
!define BOUNDARY_COLOR #FFD700
!define CONTROL_COLOR #FFD700
!define ENTITY_COLOR #FFD700

title Sequence Diagram - Delete Dish

actor "Staff\n(Manager/Employee)" as Staff
boundary "<<boundary>>\nDish Management Screen" as DishScreen BOUNDARY_COLOR
control "<<control>>\nDish Controller" as DishController CONTROL_COLOR
entity "<<entity>>\nDish" as Dish ENTITY_COLOR

== Delete Dish Process ==

Staff -> DishScreen: Select dish to delete
activate DishScreen

DishScreen -> DishScreen: Display dish information\n(dish_id, dish_name, price, category, status)

DishScreen -> Staff: Confirm dish deletion?\n"Are you sure you want to delete this dish?"

Staff -> DishScreen: Confirm delete dish

DishScreen -> DishController: DELETE /dish/:id
activate DishController

DishController -> Dish: findOneBy({dish_id: id})
activate Dish
Dish --> DishController: Check if dish exists\n{dish_id, dish_name, price, description, image_name, status, category, options}
deactivate Dish

alt Dish exists
    DishController -> Dish: softDelete({dish_id: id})
    activate Dish
    Dish --> DishController: Soft delete result\n{affected: 1, generatedMaps: [], raw: []}
    deactivate Dish
    
    DishController --> DishScreen: 200 OK\n"Delete dish successfully"
else Dish not found
    DishController --> DishScreen: 404 Not Found\n"Dish not found"
end

deactivate DishController

DishScreen -> DishScreen: Remove dish from list\nRefresh dish display

DishScreen --> Staff: Display result message\n"Dish deleted successfully" or "Dish not found"
note right: Dish soft deleted (deleted_at set)

deactivate DishScreen

@enduml
```

18. usecase: xem danh sách nhân viên chỉ dành cho quản lý (Manager):

```plantuml
@startuml ViewEmployeesList_Sequence_Diagram
!define BOUNDARY_COLOR #FFD700
!define CONTROL_COLOR #FFD700
!define ENTITY_COLOR #FFD700

title Sequence Diagram - View Employees List (Manager Only)

actor "Manager" as Manager
boundary "<<boundary>>\nEmployee Management Screen" as EmployeeScreen BOUNDARY_COLOR
control "<<control>>\nAccount Controller" as AccountController CONTROL_COLOR
entity "<<entity>>\nAccount" as Account ENTITY_COLOR

== View Employees List Process ==

Manager -> EmployeeScreen: Access employee management page
activate EmployeeScreen

note over EmployeeScreen: Check user role = Manager\n(Authorization required)

EmployeeScreen -> AccountController: GET /account
activate AccountController

AccountController -> Account: findAll()
activate Account
Account --> AccountController: Employees list only\n{account_id, name, email, role='Employee', phone, is_active, created_at, updated_at}\n(Password excluded for security)
deactivate Account

AccountController --> EmployeeScreen: 200 OK\n"Get all accounts"\n[Employees list]
deactivate AccountController

EmployeeScreen -> EmployeeScreen: Display employees grid\n- Filter by is_active status\n- Sort by created_at DESC\n- Show employee details\n- Management actions

EmployeeScreen --> Manager: Show employee management interface\n- Employees grid with details\n- Employee status (Active/Inactive)\n- Contact information\n- Role: Employee only\n- Created/Updated dates\n- Add/Edit/Delete/Activate buttons
note right: Only Manager can view employee list

deactivate EmployeeScreen

@enduml
```

19. usecase: xóa nhân viên chỉ dành cho quản lý (Manager):

```plantuml
@startuml DeleteEmployee_Sequence_Diagram
!define BOUNDARY_COLOR #FFD700
!define CONTROL_COLOR #FFD700
!define ENTITY_COLOR #FFD700

title Sequence Diagram - Delete Employee (Manager Only)

actor "Manager" as Manager
boundary "<<boundary>>\nEmployee Management Screen" as EmployeeScreen BOUNDARY_COLOR
control "<<control>>\nAccount Controller" as AccountController CONTROL_COLOR
entity "<<entity>>\nAccount" as Account ENTITY_COLOR

== Delete Employee Process ==

Manager -> EmployeeScreen: Select employee to delete
activate EmployeeScreen

note over EmployeeScreen: Check user role = Manager\n(Authorization required)

EmployeeScreen -> EmployeeScreen: Display employee information\n(account_id, name, email, phone, role, is_active)

EmployeeScreen -> Manager: Confirm employee deletion?\n"Are you sure you want to delete this employee?"

Manager -> EmployeeScreen: Confirm delete employee

EmployeeScreen -> AccountController: DELETE /account/:id
activate AccountController

AccountController -> Account: remove(id)
activate Account
Account --> AccountController: Soft delete result\n{affected: 1, generatedMaps: [], raw: []}\n(Employee account soft deleted)
deactivate Account

AccountController --> EmployeeScreen: 200 OK\n"Delete account successfully"
deactivate AccountController

EmployeeScreen -> EmployeeScreen: Remove employee from list\nRefresh employee display

EmployeeScreen --> Manager: Display success message\n"Employee deleted successfully"
note right: Employee account soft deleted\n(deleted_at set, preserves data integrity)

deactivate EmployeeScreen

@enduml
```