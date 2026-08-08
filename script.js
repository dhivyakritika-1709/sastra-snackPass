/* =========================================================
   CAMPUS SNACKPASS
   MAIN JAVASCRIPT
========================================================= */


/* =========================================================
   FOOD DATA
========================================================= */

const foodItems = [

    {
        id: 1,
        name: "Classic Burger",
        category: "Burger",
        price: 120,
        description: "Tasty veg Burger",
        image: "images/burger.jpg"
    },

    {
        id: 2,
        name: "Cheese Burger",
        category: "Burger",
        price: 100,
        description: "Juicy burger with melted cheese and fresh vegetables.",
        image: "images/cheese burger.jpg"
    },

    {
        id: 3,
        name: "Panner Pizza",
        category: "Pizza",
        price: 180,
        description: "Classic pizza with mozzarella, tomato and basil.",
        image: "images/panner pizza.jpg"
    },

    {
        id: 4,
        name: "Pepperoni Pizza",
        category: "Pizza",
        price: 220,
        description: "Loaded with pepperoni and delicious melted cheese.",
        image: "images/pepperoni pizza.jpg"
    },

    {
        id: 5,
        name: "French Fries",
        category: "Snacks",
        price: 70,
        description: "Golden crispy fries served with ketchup.",
        image: "images/french fries.jpg"
    },

    {
        id: 6,
        name: "Sandwich",
        category: "Snacks",
        price: 110,
        description: "Tasty sandwich.",
        image: "images/sandwich.jpg"
    },

    {
        id: 7,
        name: "Cold Coffee",
        category: "Drinks",
        price: 80,
        description: "Chilled creamy coffee topped with foam.",
        image: "images/cold coffee.jpg"
    },

    {
        id: 8,
        name: "Fresh Orange Juice",
        category: "Drinks",
        price: 75,
        description: "Refreshing freshly squeezed orange juice.",
        image: "images/fresh juice.jpg"
    },

    {
        id: 9,
        name: "Chocolate Milkshake",
        category: "Dessert",
        price: 100,
        description: "Rich chocolate milkshake with creamy chocolate frosting.",
        image: "images/chocolate milkshake.jpg"
    },

    {
        id: 10,
        name: "Chocolate brownie",
        category: "Dessert",
        price: 60,
        description: "Soft donut covered with delicious chocolate glaze.",
        image: "images/chocolateBrownie.jpg"
    }

];


/* =========================================================
   VARIABLES
========================================================= */

/*
    cart = items currently in the cart.

    When an order is confirmed, we DO NOT clear cart.

    Instead:
        orderPlaced = true

    The cart continues to contain the order.

    When status becomes "Delivered":
        cart = []
*/

let cart = [];

let orderPlaced = false;

let orderStatus = 0;

let orderToken = "";


/*
    Order statuses:

    0 = Confirmed
    1 = Preparing
    2 = Ready for Pickup
    3 = Delivered
*/


/* =========================================================
   STATUS INFORMATION
========================================================= */

const statusNames = [
    "Order Confirmed",
    "Preparing",
    "Ready for Pickup",
    "Delivered"
];

const statusMessages = [
    "Your order has been confirmed and sent to the canteen.",
    "The canteen is currently preparing your food.",
    "Your food is ready! Please collect it from the canteen.",
    "Your food has been delivered / collected successfully."
];


/* =========================================================
   LOCAL STORAGE
========================================================= */

function saveOrder() {

    const orderData = {
        cart: cart,
        orderPlaced: orderPlaced,
        orderStatus: orderStatus,
        orderToken: orderToken
    };

    localStorage.setItem(
        "snackPassOrder",
        JSON.stringify(orderData)
    );
}


function loadOrder() {

    const savedOrder =
        localStorage.getItem("snackPassOrder");


    if (!savedOrder) {
        return;
    }


    try {

        const orderData =
            JSON.parse(savedOrder);


        cart =
            orderData.cart || [];


        orderPlaced =
            orderData.orderPlaced || false;


        orderStatus =
            orderData.orderStatus || 0;


        orderToken =
            orderData.orderToken || "";


    } catch (error) {

        console.log(
            "Could not load saved order."
        );

    }

}


/* =========================================================
   DISPLAY FOOD
========================================================= */

function displayFood(items) {

    const foodGrid =
        document.getElementById("foodGrid");


    if (!foodGrid) {
        return;
    }


    foodGrid.innerHTML = "";


    if (items.length === 0) {

        foodGrid.innerHTML = `

            <div style="
                grid-column:1/-1;
                text-align:center;
                padding:50px;
                color:#888;
            ">

                <div style="font-size:40px;">
                    🍽️
                </div>

                <h3>
                    No food items found
                </h3>

                <p>
                    Try another category.
                </p>

            </div>

        `;

        return;
    }


    items.forEach(item => {

        const card =
            document.createElement("div");


        card.className =
            "food-card";


        card.innerHTML = `

            <img
                class="food-image"
                src="${item.image}"
                alt="${item.name}"
                onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=85';"
            >

            <div class="food-info">

                <span class="food-category">
                    ${item.category}
                </span>

                <h3>
                    ${item.name}
                </h3>

                <p class="food-description">
                    ${item.description}
                </p>

                <div class="food-bottom">

                    <span class="price">
                        ₹${item.price}
                    </span>

                    <button
                        class="add-btn"
                        onclick="addToCart(${item.id})"
                        ${orderPlaced ? "disabled" : ""}
                    >
                        ${orderPlaced ? "Order Active" : "+ Add"}
                    </button>

                </div>

            </div>

        `;


        foodGrid.appendChild(card);

    });

}


/* =========================================================
   FILTER FOOD
========================================================= */

function filterFood(category, button) {

    /*
        Do not allow errors if button isn't provided.
    */

    document
        .querySelectorAll(".category")
        .forEach(btn => {

            btn.classList.remove("active");

        });


    if (button) {
        button.classList.add("active");
    }


    if (category === "All") {

        displayFood(foodItems);

    } else {

        const filtered =
            foodItems.filter(
                item => item.category === category
            );


        displayFood(filtered);

    }

}


/* =========================================================
   ADD TO CART
========================================================= */

function addToCart(id) {

    /*
        IMPORTANT:

        Once an order is confirmed, users cannot
        change the active order.

        The cart remains visible until delivery.
    */

    if (orderPlaced) {

        alert(
            "You already have an active order. Please wait until it is delivered."
        );

        return;
    }


    const food =
        foodItems.find(
            item => item.id === id
        );


    if (!food) {
        return;
    }


    const existing =
        cart.find(
            item => item.id === id
        );


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            ...food,
            quantity: 1
        });

    }


    updateCart();

    openCart();

}


/* =========================================================
   INCREASE QUANTITY
========================================================= */

function increaseQuantity(id) {

    /*
        Don't allow modification after confirmation.
    */

    if (orderPlaced) {

        alert(
            "Your order has already been confirmed and cannot be changed."
        );

        return;
    }


    const item =
        cart.find(
            item => item.id === id
        );


    if (item) {

        item.quantity++;

    }


    updateCart();

}


/* =========================================================
   DECREASE QUANTITY
========================================================= */

function decreaseQuantity(id) {

    if (orderPlaced) {

        alert(
            "Your order has already been confirmed and cannot be changed."
        );

        return;
    }


    const item =
        cart.find(
            item => item.id === id
        );


    if (!item) {
        return;
    }


    item.quantity--;


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                item => item.id !== id
            );

    }


    updateCart();

}


/* =========================================================
   CALCULATE TOTAL
========================================================= */

function calculateTotal() {

    let total = 0;


    cart.forEach(item => {

        total +=
            item.price * item.quantity;

    });


    return total;

}


/* =========================================================
   CALCULATE TOTAL ITEMS
========================================================= */

function calculateItemCount() {

    let count = 0;


    cart.forEach(item => {

        count += item.quantity;

    });


    return count;

}


/* =========================================================
   UPDATE CART
========================================================= */

function updateCart() {

    const cartItems =
        document.getElementById("cartItems");

    const cartCount =
        document.getElementById("cartCount");

    const cartTotal =
        document.getElementById("cartTotal");


    if (!cartItems) {
        return;
    }


    const totalItems =
        calculateItemCount();


    const totalPrice =
        calculateTotal();


    if (cartCount) {

        cartCount.textContent =
            totalItems;

    }


    if (cartTotal) {

        cartTotal.textContent =
            `₹${totalPrice}`;

    }


    /*
        EMPTY CART

        Only possible when there is no active order.
    */

    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <div class="empty-cart-icon">
                    🛒
                </div>

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Add something delicious!
                </p>

            </div>

        `;

        return;
    }


    cartItems.innerHTML = "";


    /*
        ACTIVE ORDER MESSAGE
    */

    if (orderPlaced) {

        const statusText =
            statusNames[orderStatus];


        const statusBanner =
            document.createElement("div");


        statusBanner.style.cssText = `
            background:#fff1eb;
            color:#ff5a36;
            padding:12px;
            border-radius:9px;
            margin-bottom:15px;
            font-size:12px;
            font-weight:600;
        `;


        statusBanner.innerHTML = `

            📦 Active Order

            <br>

            <span style="
                font-size:10px;
                font-weight:500;
            ">
                Token: ${orderToken}
                • ${statusText}
            </span>

        `;


        cartItems.appendChild(
            statusBanner
        );

    }


    /*
        DISPLAY CART ITEMS
    */

    cart.forEach(item => {

        const cartItem =
            document.createElement("div");


        cartItem.className =
            "cart-item";


        cartItem.innerHTML = `

            <img
                class="cart-item-image"
                src="${item.image}"
                alt="${item.name}"
                onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=500&q=80';"
            >


            <div class="cart-item-info">

                <h4>
                    ${item.name}
                </h4>

                <p>
                    ₹${item.price * item.quantity}
                </p>


                <div class="quantity">

                    <button
                        onclick="decreaseQuantity(${item.id})"
                        ${orderPlaced ? "disabled" : ""}
                    >
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        onclick="increaseQuantity(${item.id})"
                        ${orderPlaced ? "disabled" : ""}
                    >
                        +
                    </button>

                </div>


                ${
                    orderPlaced
                    ?
                    `
                    <span class="cart-order-status">
                        ${statusTextForCart()}
                    </span>
                    `
                    :
                    ""
                }

            </div>

        `;


        cartItems.appendChild(
            cartItem
        );

    });


    saveOrder();

}


/* =========================================================
   CART STATUS TEXT
========================================================= */

function statusTextForCart() {

    if (!orderPlaced) {
        return "Not confirmed";
    }


    return statusNames[orderStatus];

}


/* =========================================================
   OPEN CART
========================================================= */

function openCart() {

    const sidebar =
        document.getElementById("cartSidebar");

    const overlay =
        document.getElementById("cartOverlay");


    if (sidebar) {
        sidebar.classList.add("open");
    }


    if (overlay) {
        overlay.classList.add("show");
    }

}


/* =========================================================
   CLOSE CART
========================================================= */

function closeCart() {

    const sidebar =
        document.getElementById("cartSidebar");

    const overlay =
        document.getElementById("cartOverlay");


    if (sidebar) {
        sidebar.classList.remove("open");
    }


    if (overlay) {
        overlay.classList.remove("show");
    }

}


/* =========================================================
   GENERATE ORDER TOKEN
========================================================= */

function generateOrderToken() {

    const randomNumber =
        Math.floor(
            100000 +
            Math.random() * 900000
        );


    return "SP-" + randomNumber;

}


/* =========================================================
   CONFIRM ORDER
========================================================= */

function confirmOrder() {

    /*
        Don't allow empty orders.
    */

    if (cart.length === 0) {

        alert(
            "Your cart is empty. Please add some food first."
        );

        return;
    }


    /*
        Don't create another order
        if one already exists.
    */

    if (orderPlaced) {

        alert(
            "You already have an active order."
        );

        return;
    }


    /*
        CREATE ORDER
    */

    orderPlaced = true;

    orderStatus = 0;

    orderToken =
        generateOrderToken();


    /*
        SAVE ORDER

        IMPORTANT:
        We DO NOT clear cart here.
    */

    saveOrder();


    /*
        SHOW TOKEN IN CONFIRMATION MODAL
    */

    const confirmationToken =
        document.getElementById(
            "confirmationToken"
        );


    if (confirmationToken) {

        confirmationToken.textContent =
            orderToken;

    }


    /*
        CLOSE CART
    */

    closeCart();


    /*
        SHOW CONFIRMATION
    */

    const modal =
        document.getElementById(
            "confirmationModal"
        );


    if (modal) {

        modal.classList.add("show");

    }


    /*
        UPDATE WEBSITE
    */

    updateCart();

    updateTracking();

    displayFood(foodItems);

}


/* =========================================================
   CLOSE CONFIRMATION
========================================================= */

function closeConfirmation() {

    const modal =
        document.getElementById(
            "confirmationModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }

}


/* =========================================================
   VIEW ORDER TRACKING
========================================================= */

function viewOrderTracking() {

    closeConfirmation();

    closeCart();


    /*
        Open tracking section
    */

    scrollToTracking();


    /*
        Also open detailed tracking modal
    */

    setTimeout(() => {

        openTrackingModal();

    }, 500);

}


/* =========================================================
   SCROLL TO TRACKING
========================================================= */

function scrollToTracking() {

    const tracking =
        document.getElementById(
            "tracking"
        );


    if (tracking) {

        tracking.scrollIntoView({
            behavior: "smooth"
        });

    }

}


/* =========================================================
   SCROLL TO MENU
========================================================= */

function scrollToMenu() {

    const menu =
        document.getElementById(
            "menu"
        );


    if (menu) {

        menu.scrollIntoView({
            behavior: "smooth"
        });

    }

}


/* =========================================================
   UPDATE TRACKING SECTION
========================================================= */

function updateTracking() {

    const container =
        document.getElementById(
            "trackingContainer"
        );


    if (!container) {
        return;
    }


    /*
        NO ACTIVE ORDER
    */

    if (
        !orderPlaced ||
        cart.length === 0
    ) {

        container.innerHTML = `

            <div class="no-order">

                <div class="no-order-icon">
                    📦
                </div>

                <h3>
                    No Active Order
                </h3>

                <p>
                    Your active orders will appear here.
                </p>

                <button
                    class="primary-btn"
                    onclick="scrollToMenu()"
                >
                    Browse Menu
                </button>

            </div>

        `;

        return;
    }


    /*
        ACTIVE ORDER
    */

    let itemsHTML = "";


    cart.forEach(item => {

        itemsHTML += `

            <div class="active-order-item">

                <img
                    src="${item.image}"
                    alt="${item.name}"
                    onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=500&q=80';"
                >

                <div class="active-order-item-info">

                    <h4>
                        ${item.name}
                    </h4>

                    <p>
                        Quantity: ${item.quantity}
                    </p>

                </div>

                <div class="active-order-item-price">

                    ₹${item.price * item.quantity}

                </div>

            </div>

        `;

    });


    /*
        STATUS ITEMS
    */

    const statusData = [

        {
            title: "Order Confirmed",
            description:
                "Your order has been received."
        },

        {
            title: "Preparing",
            description:
                "The canteen is preparing your food."
        },

        {
            title: "Ready for Pickup",
            description:
                "Your food is ready to collect."
        },

        {
            title: "Delivered",
            description:
                "Food collected successfully."
        }

    ];


    let statusHTML = "";


    statusData.forEach(
        (status, index) => {

            let className = "";


            if (
                index < orderStatus
            ) {

                className = "completed";

            } else if (
                index === orderStatus
            ) {

                className = "active";

            }


            const icon =
                index < orderStatus
                ?
                "✓"
                :
                index + 1;


            statusHTML += `

                <div
                    class="status-item ${className}"
                >

                    <div class="status-dot">
                        ${icon}
                    </div>

                    <div>

                        <h4>
                            ${status.title}
                        </h4>

                        <p>
                            ${status.description}
                        </p>

                    </div>

                </div>

            `;

        }
    );


    /*
        BUTTON TEXT
    */

    let buttonText =
        "Update Order Status";


    if (orderStatus === 0) {

        buttonText =
            "Start Preparing";

    } else if (orderStatus === 1) {

        buttonText =
            "Mark Ready for Pickup";

    } else if (orderStatus === 2) {

        buttonText =
            "Mark as Delivered";

    } else {

        buttonText =
            "Order Completed";

    }


    const buttonDisabled =
        orderStatus === 3
        ?
        "disabled"
        :
        "";


    /*
        CREATE ACTIVE ORDER
    */

    container.innerHTML = `

        <div class="active-order-card">


            <div class="active-order-header">

                <div>

                    <p>
                        ACTIVE ORDER
                    </p>

                    <h3>
                        Your Food is on the Way
                    </h3>

                </div>


                <div class="order-token">

                    <span>
                        ORDER TOKEN
                    </span>

                    <strong>
                        ${orderToken}
                    </strong>

                </div>

            </div>


            <div class="active-order-items">

                ${itemsHTML}

            </div>


            <div class="status-timeline">

                ${statusHTML}

            </div>


            <button
                class="track-order-button"
                onclick="openTrackingModal()"
                ${buttonDisabled}
            >

                ${buttonText}

            </button>

        </div>

    `;

}


/* =========================================================
   OPEN TRACKING MODAL
========================================================= */

function openTrackingModal() {

    if (!orderPlaced) {

        alert(
            "You don't have an active order yet."
        );

        return;
    }


    const modal =
        document.getElementById(
            "trackingModal"
        );


    if (!modal) {
        return;
    }


    /*
        Token
    */

    const modalToken =
        document.getElementById(
            "modalToken"
        );


    if (modalToken) {

        modalToken.textContent =
            orderToken;

    }


    /*
        Items
    */

    const modalOrderItems =
        document.getElementById(
            "modalOrderItems"
        );


    if (modalOrderItems) {

        modalOrderItems.innerHTML = "";


        cart.forEach(item => {

            const itemElement =
                document.createElement("div");


            itemElement.className =
                "modal-order-item";


            itemElement.innerHTML = `

                <img
                    src="${item.image}"
                    alt="${item.name}"
                    onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=500&q=80';"
                >

                <span>
                    ${item.name}
                    × ${item.quantity}
                </span>

            `;


            modalOrderItems.appendChild(
                itemElement
            );

        });

    }


    updateModalStatus();


    modal.classList.add("show");

}


/* =========================================================
   UPDATE MODAL STATUS
========================================================= */

function updateModalStatus() {

    const statusElements = [

        document.getElementById(
            "statusConfirmed"
        ),

        document.getElementById(
            "statusPreparing"
        ),

        document.getElementById(
            "statusReady"
        ),

        document.getElementById(
            "statusDelivered"
        )

    ];


    statusElements.forEach(
        (element, index) => {

            if (!element) {
                return;
            }


            element.classList.remove(
                "completed"
            );

            element.classList.remove(
                "active"
            );


            if (
                index < orderStatus
            ) {

                element.classList.add(
                    "completed"
                );

            } else if (
                index === orderStatus
            ) {

                element.classList.add(
                    "active"
                );

            }

        }
    );


    /*
        STATUS MESSAGE
    */

    const message =
        document.getElementById(
            "statusMessage"
        );


    if (message) {

        message.textContent =
            statusMessages[orderStatus];

    }


    /*
        UPDATE BUTTON
    */

    const deliveryButton =
        document.getElementById(
            "deliveryButton"
        );


    if (!deliveryButton) {
        return;
    }


    if (orderStatus === 0) {

        deliveryButton.textContent =
            "Start Preparing";

        deliveryButton.disabled =
            false;

    } else if (orderStatus === 1) {

        deliveryButton.textContent =
            "Mark Ready for Pickup";

        deliveryButton.disabled =
            false;

    } else if (orderStatus === 2) {

        deliveryButton.textContent =
            "Mark as Delivered";

        deliveryButton.disabled =
            false;

    } else {

        deliveryButton.textContent =
            "Order Completed";

        deliveryButton.disabled =
            true;

    }

}


/* =========================================================
   ADVANCE ORDER STATUS
========================================================= */

function advanceOrderStatus() {

    if (!orderPlaced) {
        return;
    }


    /*
        If already delivered,
        do nothing.
    */

    if (orderStatus >= 3) {

        return;

    }


    /*
        Move to next status
    */

    orderStatus++;


    /*
        SPECIAL CASE:
        DELIVERY COMPLETED
    */

    if (orderStatus === 3) {

        /*
            Update the modal first
        */

        updateModalStatus();


        /*
            Show success message
        */

        setTimeout(() => {

            completeDelivery();

        }, 1000);


        return;
    }


    /*
        Save updated status
    */

    saveOrder();


    /*
        Update everything
    */

    updateModalStatus();

    updateTracking();

    updateCart();

}


/* =========================================================
   COMPLETE DELIVERY
========================================================= */

function completeDelivery() {

    /*
        IMPORTANT:

        The cart is cleared ONLY HERE.

        This means:

        Confirm Order
             ↓
        Cart remains
             ↓
        Preparing
             ↓
        Ready
             ↓
        Delivered
             ↓
        Cart cleared
    */


    const completedToken =
        orderToken;


    /*
        Show completion message
    */

    const message =
        document.getElementById(
            "statusMessage"
        );


    if (message) {

        message.innerHTML = `
            <strong>
                ✅ Order Delivered Successfully!
            </strong>
            <br>
            Order ${completedToken}
            has been completed.
        `;

    }


    /*
        Wait a little before clearing
        so user can see the success state.
    */

    setTimeout(() => {

        /*
            Clear active order
        */

        cart = [];

        orderPlaced = false;

        orderStatus = 0;

        orderToken = "";


        /*
            Remove saved order
        */

        localStorage.removeItem(
            "snackPassOrder"
        );


        /*
            Update interface
        */

        updateCart();

        updateTracking();

        displayFood(foodItems);


        /*
            Close tracking modal
        */

        closeTrackingModal();


        /*
            Show final message
        */

        alert(
            "✅ Food delivered successfully! Your order has been completed."
        );

    }, 1200);

}


/* =========================================================
   CLOSE TRACKING MODAL
========================================================= */

function closeTrackingModal() {

    const modal =
        document.getElementById(
            "trackingModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }

}


/* =========================================================
   CLOSE MODALS WHEN CLICKING OUTSIDE
========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const confirmationModal =
            document.getElementById(
                "confirmationModal"
            );

        const trackingModal =
            document.getElementById(
                "trackingModal"
            );


        /*
            Close confirmation modal
            when clicking outside box.
        */

        if (
            event.target ===
            confirmationModal
        ) {

            closeConfirmation();

        }


        /*
            Close tracking modal
            when clicking outside box.
        */

        if (
            event.target ===
            trackingModal
        ) {

            closeTrackingModal();

        }

    }
);


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            closeCart();

            closeConfirmation();

            closeTrackingModal();

        }

    }
);


/* =========================================================
   INITIALIZE APPLICATION
========================================================= */

function initializeApp() {

    /*
        Load previously saved order
    */

    loadOrder();


    /*
        Display food menu
    */

    displayFood(foodItems);


    /*
        Update cart
    */

    updateCart();


    /*
        Update tracking
    */

    updateTracking();


    /*
        If there is an active order,
        refresh the UI.
    */

    if (orderPlaced) {

        displayFood(foodItems);

    }

}


/* =========================================================
   START APPLICATION
========================================================= */

initializeApp();