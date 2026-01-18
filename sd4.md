20. usecase: thêm món ăn vào giỏ hàng chỉ dành cho khách hàng (Guest):
```plantuml
@startuml AddDishToCart_Sequence_Diagram
!define BOUNDARY_COLOR #FFD700
!define CONTROL_COLOR #FFD700
!define ENTITY_COLOR #FFD700

title Sequence Diagram - Add Dish to Cart (Guest Only)

actor "Guest" as Guest
boundary "<<boundary>>\nMenu Screen" as MenuScreen BOUNDARY_COLOR
control "<<control>>\nCart Item Controller" as CartItemController CONTROL_COLOR
entity "<<entity>>\nCart Item" as CartItem ENTITY_COLOR

== Add Dish to Cart Process ==

Guest -> MenuScreen: Browse menu and select dish
activate MenuScreen

MenuScreen -> MenuScreen: Display dish details\n(dish_name, price, description, image, available status)

MenuScreen -> Guest: Show quantity selector\nand "Add to Cart" button

Guest -> MenuScreen: Select quantity and confirm\nadd to cart

MenuScreen -> MenuScreen: Validate selection\n- Dish available\n- Quantity > 0\n- Guest has active cart

MenuScreen -> CartItemController: POST /cart-item\n{cart_id: guest_cart_id, dish_id, quantity}
activate CartItemController

note over CartItemController: @Public() endpoint\n(No authentication required for guests)

CartItemController -> CartItemController: Validate CreateCartItemDto\n- @IsNotEmpty validations\n- @IsNumber validations\n- cart_id, dish_id, quantity

CartItemController -> CartItem: create(createCartItemDto)
activate CartItem
CartItem --> CartItemController: New cart item created\n{cart_id, dish_id, quantity}\n(Relations: cart, dish)
deactivate CartItem

CartItemController --> MenuScreen: 201 Created\n"Create cart item successfully"
deactivate CartItemController

MenuScreen -> MenuScreen: Update cart UI\n- Show item added animation\n- Update cart counter\n- Calculate total price

MenuScreen --> Guest: Display success feedback\n"Dish added to cart successfully"\n+ updated cart summary
note right: Dish added to guest's cart

deactivate MenuScreen

@enduml
```

21. usecase: xem thông tin giỏ hàng dành cho khách hàng (Guest):
```plantuml
@startuml ViewCartInfo_Sequence_Diagram
!define BOUNDARY_COLOR #FFD700
!define CONTROL_COLOR #FFD700
!define ENTITY_COLOR #FFD700

title Sequence Diagram - View Cart Information (Guest Only)

actor "Guest" as Guest
boundary "<<boundary>>\nCart Screen" as CartScreen BOUNDARY_COLOR
control "<<control>>\nCart Item Controller" as CartItemController CONTROL_COLOR
entity "<<entity>>\nCart Item" as CartItem ENTITY_COLOR

== View Cart Information Process ==

Guest -> CartScreen: Access cart page or click cart icon
activate CartScreen

note over CartScreen: @Public() access\n(No authentication required for guests)

CartScreen -> CartItemController: GET /cart-item?cart_id={guest_cart_id}
activate CartItemController

CartItemController -> CartItem: findAll({cart_id})
activate CartItem
CartItem --> CartItemController: Cart items with relations\n[{cart_id, dish_id, quantity, cart: {...}, dish: {dish_name, price, image_name, ...}}]
deactivate CartItem

CartItemController --> CartScreen: 200 OK\n"Get cart items"\n[Cart items list with dish details]
deactivate CartItemController

CartScreen -> CartScreen: Process cart data\n- Calculate item totals (quantity × price)\n- Calculate cart subtotal\n- Calculate tax/fees\n- Calculate grand total\n- Group items by category

CartScreen --> Guest: Display cart information\n- Cart items list with images\n- Item details (name, price, quantity)\n- Quantity controls (+/-)\n- Item subtotals\n- Cart summary (subtotal, tax, total)\n- Checkout button\n- Continue shopping button
note right: Complete cart information displayed

deactivate CartScreen

@enduml
```

22. usecase: cập nhật số lượng món ăn trong giỏ hàng dành cho khách hàng (Guest):
```plantuml
@startuml UpdateCartItemQuantity_Sequence_Diagram
!define BOUNDARY_COLOR #FFD700
!define CONTROL_COLOR #FFD700
!define ENTITY_COLOR #FFD700

title Sequence Diagram - Update Cart Item Quantity (Guest Only)

actor "Guest" as Guest
boundary "<<boundary>>\nCart Screen" as CartScreen BOUNDARY_COLOR
control "<<control>>\nCart Item Controller" as CartItemController CONTROL_COLOR
entity "<<entity>>\nCart Item" as CartItem ENTITY_COLOR

== Update Cart Item Quantity Process ==

Guest -> CartScreen: Click +/- buttons to change quantity
activate CartScreen

note over CartScreen: @Public() access\n(No authentication required for guests)

CartScreen -> CartScreen: Validate new quantity\n- Quantity > 0\n- Maximum quantity limits\n- Dish still available

CartScreen -> Guest: Confirm quantity change?

Guest -> CartScreen: Confirm update quantity

CartScreen -> CartItemController: PATCH /cart-item\n{cart_id, dish_id, quantity: new_quantity}
activate CartItemController

CartItemController -> CartItemController: Validate UpdateCartItemDto\n- @IsNumber validations\n- cart_id, dish_id, quantity

CartItemController -> CartItem: update(updateCartItemDto)
activate CartItem
CartItem --> CartItemController: Updated cart item\n{cart_id, dish_id, quantity: new_quantity}\n(Relations: cart, dish)
deactivate CartItem

CartItemController --> CartScreen: 200 OK\n"Update cart item by id successfully"
deactivate CartItemController

CartScreen -> CartScreen: Update cart UI\n- Refresh quantity display\n- Recalculate item total\n- Recalculate cart subtotal\n- Update grand total\n- Show update animation

CartScreen --> Guest: Display updated cart\n- New quantity reflected\n- Updated pricing\n- Success feedback animation
note right: Cart item quantity updated

deactivate CartScreen

@enduml
```

23. usecase: xóa món ăn khỏi giỏ hàng dành cho khách hàng (Guest):
```plantuml
@startuml RemoveDishFromCart_Sequence_Diagram
!define BOUNDARY_COLOR #FFD700
!define CONTROL_COLOR #FFD700
!define ENTITY_COLOR #FFD700

title Sequence Diagram - Remove Dish from Cart (Guest Only)

actor "Guest" as Guest
boundary "<<boundary>>\nCart Screen" as CartScreen BOUNDARY_COLOR
control "<<control>>\nCart Item Controller" as CartItemController CONTROL_COLOR
entity "<<entity>>\nCart Item" as CartItem ENTITY_COLOR

== Remove Dish from Cart Process ==

Guest -> CartScreen: Click remove/delete button on cart item
activate CartScreen

note over CartScreen: @Public() access\n(No authentication required for guests)

CartScreen -> CartScreen: Display item information\n(dish_name, quantity, price, total)

CartScreen -> Guest: Confirm item removal?\n"Are you sure you want to remove this item?"

Guest -> CartScreen: Confirm remove item

CartScreen -> CartItemController: DELETE /cart-item?cart_id={guest_cart_id}&dish_id={dish_id}
activate CartItemController

CartItemController -> CartItem: remove(cart_id, dish_id)
activate CartItem
CartItem --> CartItemController: Item deletion result\n{affected: 1} or {affected: 0}\n(Composite key deletion)
deactivate CartItem

CartItemController --> CartScreen: 200 OK\n"Delete cart item by id successfully"
deactivate CartItemController

CartScreen -> CartScreen: Update cart UI\n- Remove item from display\n- Recalculate cart subtotal\n- Update item count\n- Update grand total\n- Show removal animation

CartScreen --> Guest: Display updated cart\n- Item removed from list\n- Updated cart summary\n- Success feedback\n- Empty cart message (if no items left)
note right: Dish removed from guest's cart

deactivate CartScreen

@enduml
```

24. usecase: guest điền tên để đăng nhập vào hệ thống:
```plantuml
@startuml GuestLogin_Sequence_Diagram
!define BOUNDARY_COLOR #FFD700
!define CONTROL_COLOR #FFD700
!define ENTITY_COLOR #FFD700

title Sequence Diagram - Guest Login (Name & Table)

actor "Guest" as Guest
boundary "<<boundary>>\nLogin Screen" as LoginScreen BOUNDARY_COLOR
control "<<control>>\nGuest Auth Controller" as GuestAuthController CONTROL_COLOR
entity "<<entity>>\nGuest" as GuestEntity ENTITY_COLOR

== Guest Login Process ==

Guest -> LoginScreen: Access restaurant system
activate LoginScreen

note over LoginScreen: @Public() access\n(No authentication required)

LoginScreen -> Guest: Display login form\n(Guest name input, Table selection)

Guest -> LoginScreen: Enter guest name and select table\n{guest_name, table_id}

LoginScreen -> LoginScreen: Validate input\n- Guest name not empty\n- Table selected\n- Table available

LoginScreen -> GuestAuthController: POST /guest-auth/login\n{guest_name, table_id}
activate GuestAuthController

GuestAuthController -> GuestEntity: Update table status to "Unavailable"
activate GuestEntity
GuestEntity --> GuestAuthController: Table status updated
deactivate GuestEntity

GuestAuthController -> GuestEntity: Create new cart for guest
activate GuestEntity
GuestEntity --> GuestAuthController: New cart created\n{cart_id}
deactivate GuestEntity

GuestAuthController -> GuestEntity: Create guest record\n{guest_name, cart_id, table_id}
activate GuestEntity
GuestEntity --> GuestAuthController: Guest created\n{guest_id, guest_name, cart_id, table_id}
deactivate GuestEntity

GuestAuthController -> GuestAuthController: Send real-time notifications\n- Guest login notification\n- Table occupied notification\n- Table status update

GuestAuthController -> GuestAuthController: Generate JWT tokens\n- Access token\n- Refresh token\n- Set cookies

GuestAuthController --> LoginScreen: 200 OK\n"Guest login successfully"\n+ JWT tokens in cookies
deactivate GuestAuthController

LoginScreen -> LoginScreen: Store guest session\n- guest_id, guest_name\n- cart_id, table_id\n- Access token

LoginScreen --> Guest: Redirect to menu page\n+ Welcome message\n+ Table assignment confirmation
note right: Guest logged in with table assigned

deactivate LoginScreen

@enduml
```

25. usecase: thanh toán đơn hàng dành cho khách hàng (Guest):
```plantuml
@startuml GuestPayment_Sequence_Diagram
!define BOUNDARY_COLOR #FFD700
!define CONTROL_COLOR #FFD700
!define ENTITY_COLOR #FFD700

title Sequence Diagram - Guest Payment with ZaloPay Integration

actor "Guest" as Guest
boundary "<<boundary>>\nCheckout Screen" as CheckoutScreen BOUNDARY_COLOR
boundary "<<boundary>>\nZaloPay Payment Gateway" as ZaloPayGateway BOUNDARY_COLOR
control "<<control>>\nGuest Auth Controller" as GuestAuthController CONTROL_COLOR
participant "ZaloPay Server" as ZaloPayServer
entity "<<entity>>\nOrder" as OrderEntity ENTITY_COLOR
entity "<<entity>>\nTransaction" as TransactionEntity ENTITY_COLOR
entity "<<entity>>\nTable" as TableEntity ENTITY_COLOR

== Guest Payment Process ==

Guest -> CheckoutScreen: Click "Proceed to Checkout"
activate CheckoutScreen

CheckoutScreen -> CheckoutScreen: Validate cart\n- Cart not empty\n- All items available\n- Calculate total amount

CheckoutScreen -> GuestAuthController: POST /guest-auth/order\n{guest_id, cart_items, total_order}
activate GuestAuthController

GuestAuthController -> OrderEntity: Create order record\n{guest_id, table_id, total_order, status: 'Pending'}
activate OrderEntity
OrderEntity --> GuestAuthController: Order created\n{order_id, total_order, guest_info, cart_items}
deactivate OrderEntity

GuestAuthController -> GuestAuthController: Prepare ZaloPay payment data\n- app_trans_id, amount, items\n- Generate MAC signature\n- Set callback URL

GuestAuthController -> ZaloPayServer: POST /v2/create\n{app_id, app_trans_id, amount, items, mac, callback_url}
activate ZaloPayServer
ZaloPayServer --> GuestAuthController: Payment URL created\n{return_code: 1, order_url, zp_trans_token}
deactivate ZaloPayServer

GuestAuthController --> CheckoutScreen: 200 OK\n{order_url, order_id}
deactivate GuestAuthController

CheckoutScreen -> Guest: Redirect to ZaloPay payment page

Guest -> ZaloPayGateway: Access payment URL
activate ZaloPayGateway

ZaloPayGateway -> Guest: Display payment options\n- Bank cards (Visa/MasterCard)\n- ATM cards\n- QR code payment\n- Mobile banking

Guest -> ZaloPayGateway: Select payment method and enter details\n(Card number, CVV, OTP, etc.)

ZaloPayGateway -> ZaloPayGateway: Process payment\n- Validate payment details\n- Contact bank/payment provider\n- Authorize transaction

alt Payment Successful
    ZaloPayGateway -> ZaloPayServer: Payment completed successfully
    ZaloPayServer -> GuestAuthController: POST /guest-auth/order/callback/{order_id}\n{zp_trans_id, status: success}
    activate GuestAuthController
    
    GuestAuthController -> OrderEntity: Update order status to 'Completed'
    activate OrderEntity
    OrderEntity --> GuestAuthController: Order status updated
    deactivate OrderEntity
    
    GuestAuthController -> TransactionEntity: Create transaction record\n{id_zalopay, amount_in, order_id, status: 'success'}
    activate TransactionEntity
    TransactionEntity --> GuestAuthController: Transaction record created
    deactivate TransactionEntity
    
    GuestAuthController -> TableEntity: Update payment_status to 'Paid'
    activate TableEntity
    TableEntity --> GuestAuthController: Table payment status updated
    deactivate TableEntity
    
    GuestAuthController -> GuestAuthController: Send payment success notifications
    
    GuestAuthController --> ZaloPayServer: return_code: 0 (success)
    deactivate GuestAuthController
    
    ZaloPayGateway -> Guest: Payment successful\nRedirect to success page
    
else Payment Failed
    ZaloPayGateway -> Guest: Payment failed\nShow error message\nOption to retry
    
    ZaloPayServer -> GuestAuthController: POST /guest-auth/order/callback/{order_id}\n{status: failed}
    activate GuestAuthController
    
    GuestAuthController -> OrderEntity: Keep order status 'Pending'
    activate OrderEntity
    OrderEntity --> GuestAuthController: Order status unchanged
    deactivate OrderEntity
    
    GuestAuthController -> TransactionEntity: Create failed transaction record\n{status: 'failed', order_id}
    activate TransactionEntity
    TransactionEntity --> GuestAuthController: Failed transaction recorded
    deactivate TransactionEntity
    
    GuestAuthController --> ZaloPayServer: return_code: 0
    deactivate GuestAuthController
end

deactivate ZaloPayGateway

note right of Guest: Payment completed via ZaloPay\nOrder status updated\nTable marked as paid

@enduml
```