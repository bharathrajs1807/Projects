document.addEventListener("DOMContentLoaded", loadCart);

function loadCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let tbody = document.getElementById("tbody");
    let emptyMessage = document.getElementById("empty");
    let cartCheckout = document.getElementById("cartcheckout");
    let checkout = document.getElementById("checkout"); 

    tbody.innerHTML = ""; 

    if (cart.length === 0) {
        emptyMessage.classList.remove("hidden");
        cartCheckout.classList.add("hidden");
        checkout.innerHTML = ""; 
        return;
    } else {
        emptyMessage.classList.add("hidden");
        cartCheckout.classList.remove("hidden");
    }

    let totalPrice = 0;

    cart.forEach((item, index) => {
        let quantity = item.quantity || 1;
        let itemTotal = parseFloat(item.price) * quantity;
        totalPrice += itemTotal;

        let row = document.createElement("div");
        row.classList.add("cart-row");
        row.innerHTML = `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.title}" width="70">
                <p>${item.title}</p>
            </div>
            <div class="cart-price">£${item.price}</div>
            <div class="cart-size">
                <select>
                    <option value="">--</option>
                    <option value="2XS">2XS</option>
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="2XL">2XL</option>
                </select>
            </div>
            <div class="cart-qty">
                <select name="size" onchange="updateCart(${index}, this.value)">
                    <option value="1" ${quantity == 1 ? "selected" : ""}>1</option>
                    <option value="2" ${quantity == 2 ? "selected" : ""}>2</option>
                    <option value="3" ${quantity == 3 ? "selected" : ""}>3</option>
                    <option value="4" ${quantity == 4 ? "selected" : ""}>4</option>
                    <option value="5" ${quantity == 5 ? "selected" : ""}>5</option>
                    <option value="6" ${quantity == 6 ? "selected" : ""}>6</option>
                    <option value="7" ${quantity == 7 ? "selected" : ""}>7</option>
                    <option value="8" ${quantity == 8 ? "selected" : ""}>8</option>
                    <option value="9" ${quantity == 9 ? "selected" : ""}>9</option>
                    <option value="10" ${quantity == 10 ? "selected" : ""}>10</option>
                </select>
            </div>
            <div>
                <button class="remove-btn" onclick="removeFromCart(${index})">X</button>
            </div>
        `;

        tbody.append(row);
    });

   
    checkout.innerHTML = `
        <h3>Total Price: £${totalPrice.toFixed(2)}</h3>
        <button id="checkoutBtn">Proceed to Checkout</button>
    `;
}
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart)); 
        loadCart(); 
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const womenMenu = document.getElementById("women-menu");
    const womenDropdown = document.getElementById("women");
    //men
    const menMenu = document.getElementById("men-menu");
    const menDropdown = document.getElementById("men");
    //kids
    const kidsMenu = document.getElementById("kids-menu");
    const kidsDropdown = document.getElementById("kids");
    // classics
    const classicsMenu = document.getElementById("classics-menu");
    const classicsDropdown = document.getElementById("classics");
    // sport
    const sportMenu = document.getElementById("sport-menu");
    const sportDropdown = document.getElementById("sports");
    // navCart
    const navCartMenu = document.getElementById("navcart-menu");
    const navCartDropdown = document.getElementById("navcart");

    let timeout;

    womenMenu.addEventListener("mouseover", function () {
        clearTimeout(timeout);
        womenDropdown.style.display = "flex";
    });

    womenMenu.addEventListener("mouseleave", function () {
        timeout = setTimeout(() => {
            womenDropdown.style.display = "none";
        }, 50);
    });

    womenDropdown.addEventListener("mouseover", function () {
        clearTimeout(timeout);
        womenDropdown.style.display = "flex";
    });

    womenDropdown.addEventListener("mouseleave", function () {
        timeout = setTimeout(() => {
            womenDropdown.style.display = "none";
        }, 50);
    });

    // men
    menMenu.addEventListener("mouseover", function () {
        clearTimeout(timeout);
        menDropdown.style.display = "flex";
    });

    menMenu.addEventListener("mouseleave", function () {
        timeout = setTimeout(() => {
            menDropdown.style.display = "none";
        }, 50);
    });

    menDropdown.addEventListener("mouseover", function () {
        clearTimeout(timeout);
        menDropdown.style.display = "flex";
    });

    menDropdown.addEventListener("mouseleave", function () {
        timeout = setTimeout(() => {
            menDropdown.style.display = "none";
        }, 50);
    });

    // kids
    kidsMenu.addEventListener("mouseover", function () {
        clearTimeout(timeout);
        kidsDropdown.style.display = "flex";
    });

    kidsMenu.addEventListener("mouseleave", function () {
        timeout = setTimeout(() => {
            kidsDropdown.style.display = "none";
        }, 50);
    });

    kidsDropdown.addEventListener("mouseover", function () {
        clearTimeout(timeout);
        kidsDropdown.style.display = "flex";
    });

    kidsDropdown.addEventListener("mouseleave", function () {
        timeout = setTimeout(() => {
            kidsDropdown.style.display = "none";
        }, 50);
    });

    // classics
    classicsMenu.addEventListener("mouseover", function () {
        clearTimeout(timeout);
        classicsDropdown.style.display = "grid";
    });

    classicsMenu.addEventListener("mouseleave", function () {
        timeout = setTimeout(() => {
           classicsDropdown.style.display = "none";
        }, 50);
    });

    classicsDropdown.addEventListener("mouseover", function () {
        clearTimeout(timeout);
        classicsDropdown.style.display = "grid";
    });

    classicsDropdown.addEventListener("mouseleave", function () {
        timeout = setTimeout(() => {
            classicsDropdown.style.display = "none";
        }, 50);
    });

    // sport
    sportMenu.addEventListener("mouseover", function () {
        clearTimeout(timeout);
        sportDropdown.style.display = "flex";
    });

    sportMenu.addEventListener("mouseleave", function () {
        timeout = setTimeout(() => {
           sportDropdown.style.display = "none";
        }, 50);
    });

    sportDropdown.addEventListener("mouseover", function () {
        clearTimeout(timeout);
        sportDropdown.style.display = "flex";
    });

    sportDropdown.addEventListener("mouseleave", function () {
        timeout = setTimeout(() => {
            sportDropdown.style.display = "none";
        }, 50);
    });

    // navCart
navCartMenu.addEventListener("mouseover", function () {
    clearTimeout(timeout);
    navCartDropdown.style.display = "block";
});

navCartMenu.addEventListener("mouseleave", function () {
    timeout = setTimeout(() => {
        navCartDropdown.style.display = "none";
    }, 50);
});

navCartDropdown.addEventListener("mouseover", function () {
    clearTimeout(timeout);
});

navCartDropdown.addEventListener("mouseleave", function () {
    timeout = setTimeout(() => {
        navCartDropdown.style.display = "none";
    }, 50);
});
});

document.getElementById("logoClick").addEventListener("click", function () {
    window.location.href = "/index.html"
});

document.getElementById("shopBtn").addEventListener("click", function () {
    window.location.href = "/products.html";
});
document.getElementById("navUser").addEventListener("click", function () {
    window.location.href = "/signin.html"
});
document.getElementById("navWishlist").addEventListener("click", function () {
    window.location.href = "/wishlist.html";
});
document.getElementById("navcart-menu").addEventListener("click", function () {
    window.location.href = "/cart.html";
});
