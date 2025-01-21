//creating a constructor function called Inventory
function Inventory(){
    this.products = {}; //array of products
    this.allSalesData = []; //stores random sales data, maximum sales data and average sales data 
    this.updatedStock = []; //stores any changes to the stocks of the products
    this.updatedPrice = []; //stores any changes to the prices of the products
}
//creating a method salesData to store random sales data, maximum sales data and average sales data in an object
Inventory.prototype.salesData = function(){
    for(let key in this.products){ //iterates all the products present in the array
        let [temp] = this.allSalesData.filter(el => el.productId===key); //used array destructuring as filter method returns an array
        if(temp === undefined){ //performs the following actions only if it is a newly added product
            let dailyData = new Array(365); //an array to store random sales data throughout the year
            let sum = 0; //sum of all the sales
            for(let i=0; i<365; i++){
                let r = Math.floor(Math.random() * (this.products[key].stock));
                dailyData[i] = Math.floor(Math.random()*(r/10)); //produces some random data
                sum += dailyData[i]; //summing all the random data
            }
            this.allSalesData.push({productId: key, dailySales: dailyData, maxSale: Math.max(...dailyData), avgSale: Math.floor(sum/365)}); // adding to the array of objects
        }
    }
};
//creating a method addPrice to store prices in an object after the product is created
Inventory.prototype.addPrice = function(){
    for(let key in this.products){ //iterates all the products present in the array
        let [temp] = this.updatedPrice.filter(el => el.productId===key); //array destucturing
        if(temp === undefined){ //only for newly created product
            this.updatedPrice.push({productId: key, newPrice: this.products[key].price}); //adding it to an array of objects
        }
    }
};
//creating a method addStock to store available stock in an object after the product is created
Inventory.prototype.addStock = function(){
    for(let key in this.products){ //iterates all the products present in the array
        let [temp] = this.updatedStock.filter(el => el.productId===key); //array destucturing
        if(temp === undefined){ //only for newly created product
            this.updatedStock.push({productId: key, allStock: this.products[key].stock}); //adding it to an array of objects
        }
    }
};
//creating a method search to search for a product
Inventory.prototype.search = function(product){
    for(let key in this.products){ // iterates all the products present in the array
        if(this.products[key] === product){
            return this.products[key].id; //returns product id
        }
    }
};
//creating a method allProducts to print all the products in the array
Inventory.prototype.allProducts = function(){
    let temp = ""; //temperory output string
    for(key in this.products){ // iterates all the products present in the array
        temp += this.products[key].display() + "\n";
    }
    return temp; //returns temperory output string
};


const inventory1 = new Inventory(); //instance of the Inventory - me
const inventory2 = new Inventory(); //instance of the Inventory - competitor


//creating a function updatePrice to update the price based on the demand and stock available
const updatePrice = function(inventory, percent){ //takes a percent to increase or decrease
    for(let key in inventory.products){ //iterates all the products in the array
        let [temp] = inventory.updatedStock.filter(el => el.productId===key); //array destructuring
        if(inventory.products[key].demand === "High"){ //if the demand is high, perform following operations
            if(temp.allStock<500){ //extremely low stock - increase price
                inventory.updatedPrice.filter(el => el.productId===key).forEach(el => {
                    el.newPrice = Math.floor(inventory.products[key].price * ( 1.1 + percent/100)); //increace price by 10 + percent
                });
            }
            else if(temp.allStock<1000){ //low stock - increase price
                inventory.updatedPrice.filter(el => el.productId===key).forEach(el => {
                    el.newPrice = Math.floor(inventory.products[key].price * ( 1 + percent/100));
                }); //increace price by percent
            }
            else if(temp.allStock<5000){ //average stock - increase price
                inventory.updatedPrice.filter(el => el.productId===key).forEach(el => {
                    el.newPrice = Math.floor(inventory.products[key].price * ( 0.95 + percent/100)); //increace price by percent - 5
                });
            }
            else{//good stock - maintain price
                inventory.updatedPrice.filter(el => el.productId===key).forEach(el => {
                    el.newPrice = Math.floor(inventory.products[key].price);
                });
            }
        }
        else if(inventory.products[key].demand === "Low"){ //if the demand is low, perform following operations
            if(temp.allStock>5000){ //extremely high stock - decrease price
                inventory.updatedPrice.filter(el => el.productId===key).forEach(el => {
                    el.newPrice = Math.floor(inventory.products[key].price * ( 0.9 - percent/100)); //decreace price by 10 + percent
                });
            }
            else if(temp.allStock>1000){ //high stock - decrease price
                inventory.updatedPrice.filter(el => el.productId===key).forEach(el => {
                    el.newPrice = Math.floor(inventory.products[key].price * ( 1 - percent/100));
                }); //decreace price by percent
            }
            else if(temp.allStock>500){ //arerage stock - decrease price
                inventory.updatedPrice.filter(el => el.productId===key).forEach(el => {
                    el.newPrice = Math.floor(inventory.products[key].price * ( 1.05 - percent/100));
                }); //decreace price by percent - 5
            }
            else{ //good stock - maintain price
                inventory.updatedPrice.filter(el => el.productId===key).forEach(el => {
                    el.newPrice = Math.floor(inventory.products[key].price);
                });
            }
        }
        else{ //average demand - maintain price
            inventory.updatedPrice.filter(el => el.productId===key).forEach(el => {
                el.newPrice = Math.floor(inventory.products[key].price);
            });
        }
    }
};
//creating a function updateStock to update the stock of the products
const updateStock = function(inventory, op, newStock){
    for(let key in inventory.products){ //iterates all the products in the array
        if(op === "add"){ //to add the stock
            inventory.updatedStock.filter(el => el.productId===key).forEach(el => {
                el.allStock += newStock;
            });
        }
        else if(op === "sub"){ //to subtract the stock
            inventory.updatedStock.filter(el => el.productId===key).forEach(el => {
                el.allStock -= newStock;
            });
        }
    }
};
//creating a function updatedValues to print all the updated values
const updatedValues = function(inventory){
    let temp = ""; //temporary output string
    for(key in inventory.products){ //iterates all the products in the array
        temp += inventory.products[key].name; //name of the product
        inventory.allSalesData.filter(el => el.productId===key).forEach(el => {
            temp += "\nAverage Sales Record: " + el.avgSale + "\nMaximum Sales Record: " + el.maxSale; //output average sales data and maximum sales data from allSalesData
        });
        inventory.updatedStock.filter(el => el.productId===key).forEach(el => {
            temp += "\nRemaining Stock: " + el.allStock; //output remaining stock from updatedStock
        });
        inventory.updatedPrice.filter(el => el.productId===key).forEach(el => {
            temp += "\nNew Price: " + el.newPrice; //output new price from updatedPrice
        });
        temp += "\n\n";
    }
    return temp; //return temporary output string
};
//creating a function compareValues to compare all the values of two inventories
const compareValues = function(inventory1, inventory2){
    let temp = ""; //temporary output string
    for(key in inventory1.products){ //iterates all the products in the array
        temp += "Inventory 1 - " + inventory1.products[key].name; //name of the inventory and the product
        inventory1.allSalesData.filter(el => el.productId===key).forEach(el => {
            temp += "\nAverage Sales Record: " + el.avgSale + "\nMaximum Sales Record: " + el.maxSale; //output average sales data and maximum sales data from allSalesData
        });
        inventory1.updatedStock.filter(el => el.productId===key).forEach(el => {
            temp += "\nRemaining Stock: " + el.allStock; //output remaining stock from updatedStock
        });
        inventory1.updatedPrice.filter(el => el.productId===key).forEach(el => {
            temp += "\nNew Price: " + el.newPrice; //output new price from updatedPrice
        });
        temp += "\nInventory 2 - " + inventory2.products[key].name; //name of the inventory and the product
        inventory2.allSalesData.filter(el => el.productId===key).forEach(el => {
            temp += "\nAverage Sales Record: " + el.avgSale + "\nMaximum Sales Record: " + el.maxSale; //output average sales data and maximum sales data from allSalesData
        });
        inventory2.updatedStock.filter(el => el.productId===key).forEach(el => {
            temp += "\nRemaining Stock: " + el.allStock; //output remaining stock from updatedStock
        });
        inventory2.updatedPrice.filter(el => el.productId===key).forEach(el => {
            temp += "\nNew Price: " + el.newPrice; //output new price from updatedPrice
        });
        temp += "\n\n";
    }
    return temp; //return temporary output string
};


//creating a constructor function called Product
function Product(name, price, stock, demand){
    this.productId = "id" + Math.random().toString(16).slice(2); //random id generated in hexadecimal
    this.name = name; //name of the product
    this.price = price; //price of the product
    this.stock = stock; //new stock of the product
    this.demand = demand; //demand of the product
    this.push(); //to add the product to both the inventories
}
//creating a method display to print all the data of a product
Product.prototype.display = function(){
    return `Product: ${this.name}\nPrice: ${this.price}\nStock: ${this.stock}\nDemand: ${this.demand} \n`; //return a output string
};
//creating a method push to add the product to both the inventories
Product.prototype.push = function(){
    inventory1.products[this.productId] = this; //adding the product to inventory 1
    inventory1.salesData(); //to create a random sales data to the product
    inventory1.addPrice(); //to add the price to another object which is used for operations
    inventory1.addStock(); //to add the available stock to another object which is used for operations
    inventory2.products[this.productId] = this; //adding the product to inventory 1
    inventory2.salesData(); //to create a random sales data to the product
    inventory2.addPrice(); //to add the price to another object which is used for operations
    inventory2.addStock(); //to add the available stock to another object which is used for operations
};


//creating a fuction opertaions that has all the operations going to be performed
function operations() {
    const iPhone = new Product("iPhone", 50000, 1000, "High"); //Product instance
    const iPod = new Product("iPod", 20000, 5000, "Medium"); //Product instance
    const iMac = new Product("iMac", 100000, 5000, "Low"); //Product instance
    const shirt = new Product("Shirt", 750, 2000, "Low"); //Product instance
    const tshirt = new Product("T-Shirt", 500, 1000, "High"); //Product instance
    const jeansPant = new Product("Jeans Pant", 1000, 1000, "High"); //Product instance
    const cargoPant = new Product("Cargo Pant", 1200, 500, "Low"); //Product instance
    const harryPotter = new Product("Harry Potter", 1000, 2500, "High"); //Product instance
    const gameOfThrones = new Product("Game Of Thrones", 2000, 3000, "High"); //Product instance
    const theLordOfTheRings = new Product("The Lord Of The Rings", 1500, 1000, "Low"); //Product instance
    
    updatePrice(inventory2, 15); //competitor increases prices by 15% based on the demand and available stock

    //to take users choice
    let input = Number(prompt("Press 1: To View All The Products\nPress 2: To Compare All The Products\nPress 3: To Update The Prices\nPress 4: To Update The Stock\nPress 5: To Exit\n"));
    while(input!==5){ //runs while the user does not ends it by pressing 5
        switch(input){ //switch based on choice
            case 1: { //to view all the products
                let i = Number(prompt("Press 1: To Go Back\n\n" + inventory1.allProducts())); //prompts all products
                while(i!==1){ //while choice in not 1
                    i = Number(prompt("Incorrect Choice\nPress 1: To Go Back"));
                }
                console.log(inventory1.allProducts()); //logs on the console
                break;
            }
            case 2: { //to compare all the values of the two inventories
                let i = Number(prompt("Press 1: To Go Back\n\n" + compareValues(inventory1, inventory2))); //prompts all compared values
                while(i!==1){ //while choice in not 1
                    i = Number(prompt("Incorrect Choice\nPress 1: To Go Back"));
                }
                console.log(compareValues(inventory1, inventory2)); //logs on the console
                break;
            }
            case 3: { //to change the prices 
                let percent = Number(prompt("Enter The Percentage Of Change(1 to 99): "));
                while(percent<0 || percent>99){ //while the percent is not between 1 to 99
                    percent = Number(prompt("Enter The Correct Percentage Of Change(1 to 99): "));
                }
                updatePrice(inventory1, percent); //changes the price based on percent
                let i = Number(prompt("Press 1: To Go Back\n\n" + updatedValues(inventory1))); //prompts the updated values
                while(i!==1){ //while choice in not 1
                    i = Number(prompt("Incorrect Choice\nPress 1: To Go Back"));
                }
                console.log(updatedValues(inventory1)); //logs on the console
                break;
            }
            case 4: { //to add or subtract stock
                let op = prompt("Enter The Operation To Perform(add or sub): "); //to know the operation
                while(op!=="add" && op!=="sub"){ //while op is not add or sub
                    op = prompt("Enter The Correct Operation To Perform(add or sub): ");
                }
                let newStock = Number(prompt("Enter The Number Of Stocks: ")); //to know the new stock
                let negativeValue = false; //difference between available stock and new stock is not a negative number
                if(op==="sub"){ //checking only for sub operation
                    inventory1.updatedStock.forEach(el => { //iterates for all the available stock
                        if(el.allStock-newStock<0){ //if the difference is negative
                            negativeValue = true;
                        }
                    });
                }
                while(isNaN(newStock) || negativeValue){ //while new stock is not a number or the difference is negative
                    newStock = Number(prompt("Enter The Correct Number Of Stocks: "));
                    negativeValue = false; //reassigning to false
                    if(op==="sub"){ //checking only for sub operation
                        inventory1.updatedStock.forEach(el => { //iterates for all the available stock
                            if(el.allStock-newStock<0){ //if the difference is negative
                                negativeValue = true;
                            }
                        });
                    }
                }
                updateStock(inventory1, op, newStock); //updating the stock
                let i = Number(prompt("Press 1: To Go Back\n\n" + updatedValues(inventory1))); //prompts the updated values
                while(i!==1){ //while choice in not 1
                    i = Number(prompt("Incorrect Choice\nPress 1: To Go Back"));
                }
                console.log(updatedValues(inventory1)); //logs on the console
                break;
            }
            default: { //if there are any other choices
                window.alert("Incorrect Choice");
            }
        }
        //to take users choice again
        input = Number(prompt("Press 1: To View All The Products\nPress 2: To Compare All The Products\nPress 3: To Update The Prices\nPress 4: To Update The Stock\nPress 5: To Exit\n"));
    }
}


//invoking operations function
operations();


