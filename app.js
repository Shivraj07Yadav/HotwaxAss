const express = require('express');
const app = express();
const mysql = require("mysql2");

//*****data base connection***** */

// *****************************************************************************************************************
const db = mysql.createConnection({
    host:'127.0.0.1',
    user:'root',
    password:'rootroot',
    database:'hotwaxdb'
})


//const app = express();
app.use(express.json());
app.use((req, res, next) => {
    console.log('Incoming Request Body:', req.body);
    next();
  });

  

app.get('/',async(req,res)=>{
      res.send('Hey there')
})

db.query(`SELECT * FROM person` , (err , result ,field)=>{
    console.log(err)
    console.log(`database is connected${result}`)
    console.log(field)
})



//**************controllers */
//*******1. Create Person******* */
const postPerson = async (req, res) => {
    const person = req.body;

    // Extract column names and values
    const columns = Object.keys(person).join(', ');
    const values = Object.values(person).map(value => (typeof value === 'string' ? `'${value}'` : value)).join(', ');

    db.query(`INSERT INTO Person (${columns}) VALUES (${values})`, (error, results) => {
        if (error) throw error;
        res.json({ id: results.insertId });
    });
};


  //*********2. Create order******** */
  const postNewOrder =  (req, res) => {
    const newOrder = req.body;
    db.query('INSERT INTO Order_Header SET ?', newOrder, (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ orderId: result.insertId });
      }
    });
  };


  //************3. Add Order Items */

  const addOrderItem = async (req, res) => {
    try {
        const data= req.body;
 
        // Validate request parameters here if needed

        const insertQuery = `
            INSERT INTO order_item set ?;
        `;

        const values = [order_id, order_item_seq_id, product_id, item_description, quantity, unit_amount, item_type_enum_id];

        db.query(insertQuery, data, (error, results) => {
            if (error) {
                console.error('Error inserting order item:', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            // If successful, return the newly inserted order item's ID or any other relevant data
            return res.status(201).json({ orderItemId: results.insertId, message: 'Order item added successfully' });
        });
    } catch (error) {
        console.error('Exception while adding order item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


  //************4. Get all orders */

  const getOrder = async(req, res) => {
  
    db.query('SELECT * FROM Order_Header', (error, results) => {
        if (error) throw error;
        res.json(results);
      });
  };

//*************5. Get an Order */  
const getOneOrder = async (req, res) => {
    const { id } = req.params;
    
    // Ensure that id is a string
    const orderId = String(id);

    db.query(`SELECT * FROM Order_Header WHERE ORDER_ID = '${orderId}'`, (error, results) => {
      if (error) throw error;
      res.json(results[0]);
    });
};


  //*********6. Update order */
  const putUpdateOrder = async(req, res) => {
    const { id } = req.params;
    const updatedOrder = req.body;
    db.query('UPDATE order_header SET ? WHERE order_id = ?', [updatedOrder, id], (error) => {
      if (error) throw error;
      res.json({ message: 'Order updated successfully' });
    });
  };



  const getPerson = async(req, res) => {
  
    db.query('SELECT * FROM Person', (error, results) => {
        if (error) throw error;
        res.json(results);
      });
  };

  const getOrderItem = async(req, res) => {
  
    db.query('SELECT * FROM order_item', (error, results) => {
        if (error) throw error;
        res.json(results);
      });
  };





//***************routes */

app.post("/order" , postNewOrder)

app.post("/orderItem" , addOrderItem)

app.get("/orders", getOrder)

app.get("/order/:id" ,getOneOrder)

app.put("/order/:id" , putUpdateOrder)

app.post("/person" , postPerson)
app.get("/persons" ,getPerson)
app.get("/orderItem",getOrderItem)



//*************Start server******/
app.listen(3000,function(){
  
    console.log("app is listeinings")
})