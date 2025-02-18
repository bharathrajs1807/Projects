document.getElementById("logoClick").addEventListener("click", function () {
    window.location.href = "/index.html";
});

document.getElementById("viewproducts").addEventListener("click", function () {
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

document.addEventListener("DOMContentLoaded", loadWishlist);

function loadWishlist() {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    let tbody = document.getElementById("tbody");
    let emptyMessage = document.getElementById("empty");
    let wishlistContainer = document.getElementById("wishlist");

    tbody.innerHTML = ""; // Clear previous content

    if (wishlist.length === 0) {
        emptyMessage.classList.remove("hidden");
        wishlistContainer.classList.add("hidden");
        return;
    } else {
        emptyMessage.classList.add("hidden");
        wishlistContainer.classList.remove("hidden");
    }

    wishlist.forEach((item, index) => {
        let row = document.createElement("div");
        row.classList.add("wishlist-row");
        row.innerHTML = `
            <div class="wishlist-item">
                <img src="${item.image}" alt="${item.title}" width="70">
                <p>${item.title}</p>
            </div>
            <div class="wishlist-price">£${item.price}</div>
            <div class="wishlist-size">
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
            <div>
                <button class="add-to-cart" onclick="moveToCart(${index})">Add to Cart</button>
            </div>
            <div>
                <button class="remove-btn" onclick="removeFromWishlist(${index})">X</button>
            </div>
        `;

        tbody.append(row);
    });
}

function removeFromWishlist(index) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    wishlist.splice(index, 1);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    loadWishlist();
}

function moveToCart(index) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let item = wishlist[index];

    let existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
        alert("Product is already in the cart!");
    } else {
        item.quantity = 1;
        cart.push(item);
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Item added to cart!");
    }

    wishlist.splice(index, 1);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    loadWishlist();
}

document.getElementById("viewproducts").addEventListener("click", function () {
    window.location.href = "/products.html";
});

loadWishlist();