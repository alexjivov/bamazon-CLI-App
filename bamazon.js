var mysql = require("mysql");
var inquirer = require("inquirer");
var b = "\n=====================\n";
var query = "SELECT * FROM products";

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306, 
    user: "root",
    password: "y685d90c",
    database: "bamazonDB",

});

connection.connect(function(err) {
    if (err) throw (err)
})


function itemList() { 
    connection.query(query, function(err,res) {
        if (err) throw (err); 
        console.log("\nWelcome to Bamazon - The Online Store for Everything. What would you like to buy?\n")
        for (var i = 0; i < res.length; i++) {
            console.log("ID: " + res[i].id + "    " + res[i].product_name + "   $" + res[i].price + "   Qty: " + res[i].stock_quantity); 
        };
        chooseItem(); 
     
    })
}

function chooseItem() { 
    connection.query(query, function(err,results) {
        if (err) throw (err); 


    inquirer.prompt([
        {
            type: "input",
            name: "choice",
            message: "\nWhich item would you like to buy, by ID?",
            validate: function (input) {
                // Declare function as asynchronous, and save the done callback
                var done = this.async();
                // Do async stuff
                setTimeout(function() {
                if (isNaN(input)){
                    done("You neeed to enter a valid ID number")
                    return; 
                }
               else if (input > results.length){
                    done("You need to provide a proper ID number")
                    return;
                  }
                  // Pass the return value in the done callback
                  done(null, true);
                }, 200);
              }
            
        },
        {   type: "input",
            name: "howMany",
            message: "\n Quantity to buy?",
            validate: function (input) {
 
                var done = this.async();

                setTimeout(function() {
                if (isNaN(input)){
                    done("You neeed to enter a valid ID number")
                    return; 
                } done(null, true);
                }, 200);
              }
          
        }

    ]).then(function(resp) {
        phowMany = parseInt(resp.howMany);
        pchoice = parseInt(resp.choice); 

        console.log(b + " Purchasing: " + results[pchoice].product_name + b + " \n" + b + " Qty: " + phowMany + b); 
        
        if (pchoice > results.length) {
            console.log(b + "\nThat is not a valid ID Number\n" + b); 
            setTimeout(whichItem, 2000)
        }  else if (phowMany > results[pchoice].qty) {
            console.log("Insufficient quantity, check back soon")
            setTimeout(whichItem, 2000)
        } else {
            connection.query("UPDATE products SET ? WHERE ? ", 
            [
            {
                //is a string, need it to be 
                stock_quantity: (results[pchoice].qty - phowMany),
            
            },
            {
                id: pchoice
            } 
             
            ],
            function(err) {
                if (err) throw (err)
                console.log(b + "Total Cost: $" +  results[pchoice].price * phowMany + b);
                console.log("\nYour purchase has been made!\n");
                setTimeout(storeItems, 1000);
            });
        
        };
           
    });
}); 
}; 

itemList(); 