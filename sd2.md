5. usecase: xem thông tin doanh số của nhân viên (Manager, Employee):

```plantuml
@startuml ViewRevenue_Sequence_Diagram
!define BOUNDARY_COLOR #FFD700
!define CONTROL_COLOR #FFD700
!define ENTITY_COLOR #FFD700

title Sequence Diagram - View Revenue Information

actor "Staff\n(Manager/Employee)" as Staff
boundary "<<boundary>>\nRevenue Screen" as RevenueScreen BOUNDARY_COLOR
control "<<control>>\nTransaction Controller" as TransactionController CONTROL_COLOR
entity "<<entity>>\nTransaction" as Transaction ENTITY_COLOR

== View Revenue Process ==

Staff -> RevenueScreen: Access revenue report page
activate RevenueScreen

RevenueScreen -> TransactionController: GET /transaction
activate TransactionController

TransactionController -> Transaction: findAll()
activate Transaction
Transaction --> TransactionController: All transactions with table relations\n{transaction_id, amount_in, amount_out, accumulated, table_info, created_at}
deactivate Transaction

TransactionController --> RevenueScreen: 200 OK\n[Transaction list with revenue data]
deactivate TransactionController

RevenueScreen -> RevenueScreen: Calculate statistics\n(total revenue, daily/monthly reports)

RevenueScreen --> Staff: Display revenue dashboard\n- Total accumulated revenue\n- Transaction history\n- Revenue by table\n- Date-wise reports
note right: Revenue data displayed

deactivate RevenueScreen

@enduml
````

6. usecase: Xem các giao dịch thành công của nhân viên (Manager, Employee):

```plantuml
@startuml ViewSuccessfulTransactions_Sequence_Diagram
!define BOUNDARY_COLOR #FFD700
!define CONTROL_COLOR #FFD700
!define ENTITY_COLOR #FFD700

title Sequence Diagram - View Successful Transactions

actor "Staff\n(Manager/Employee)" as Staff
boundary "<<boundary>>\nTransaction Screen" as TransactionScreen BOUNDARY_COLOR
control "<<control>>\nTransaction Controller" as TransactionController CONTROL_COLOR
entity "<<entity>>\nTransaction" as Transaction ENTITY_COLOR

== View Successful Transactions Process ==

Staff -> TransactionScreen: Access transactions page
activate TransactionScreen

TransactionScreen -> TransactionController: GET /transaction
activate TransactionController

TransactionController -> Transaction: findAll()
activate Transaction
Transaction --> TransactionController: All successful transactions\n{transaction_id, id_zalopay, amount_in, amount_out, accumulated, table_id, transaction_date, created_at}
deactivate Transaction

TransactionController --> TransactionScreen: 200 OK\n[List of successful transactions]
deactivate TransactionController

TransactionScreen -> TransactionScreen: Filter and format data\n- Sort by date\n- Format currency\n- Group by date/table

TransactionScreen --> Staff: Display transaction history\n- Transaction ID\n- ZaloPay ID\n- Amount\n- Table\n- Date & Time\n- Status: Successful
note right: Transaction history displayed

deactivate TransactionScreen

@enduml
````

7. usecase: Xem danh sách đơn hàng của nhân viên (Manager, Employee):

```plantuml
@startuml ViewOrders_Sequence_Diagram
!define BOUNDARY_COLOR #FFD700
!define CONTROL_COLOR #FFD700
!define ENTITY_COLOR #FFD700

title Sequence Diagram - View Orders List

actor "Staff\n(Manager/Employee)" as Staff
boundary "<<boundary>>\nOrders Screen" as OrdersScreen BOUNDARY_COLOR
control "<<control>>\nOrder Controller" as OrderController CONTROL_COLOR
entity "<<entity>>\nOrder" as Order ENTITY_COLOR

== View Orders Process ==

Staff -> OrdersScreen: Access orders management page
activate OrdersScreen

OrdersScreen -> OrderController: GET /order?page=1&limit=6&status=Pending&sort=ASC
activate OrderController

OrderController -> Order: findAll(page, limit, status, sort)
activate Order
Order --> OrderController: Orders with relations\n{orders[], totalOrders, totalPage, currentPage, limit}\n- Guest info\n- Table info\n- Order handler info
deactivate Order

OrderController --> OrdersScreen: 200 OK\n{totalOrders, totalPage, currentPage, limit, orders[]}
deactivate OrderController

OrdersScreen -> OrdersScreen: Display orders table\n- Filter by status\n- Pagination\n- Sort options

OrdersScreen --> Staff: Show orders list\n- Order ID\n- Guest name\n- Table name\n- Total amount\n- Status (Pending/Completed)\n- Created date\n- Pagination controls
note right: Orders displayed with filters

deactivate OrdersScreen

@enduml
````