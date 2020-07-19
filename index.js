const express = require("express");
const bodyParser = require("body-parser")
const nodemailer = require('nodemailer')

const mongoose = require('mongoose')
const Product = require('./models/product')
const Order = require('./models/order')
const User = require('./models/user')
const Comment = require('./models/comment')
const Rating = require('./models/rating')
const Basket = require('./models/basket')


var cors = require('cors')
var app = express();



const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/shop'
//const PORT = process.env.PORT || 5000
app.set('port', (process.env.PORT || 5000))

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })

mongoose.connection.on('error', err => {
  console.error('MongoDB error', err)
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extend: false }))
app.use(cors())

const product_router = require('./routes/product.js')
const order_router = require('./routes/order.js')
const cate_router = require('./routes/category.js')

app.post("/mail", (req, res) => {
  console.log(req.body)
  nodemailer.createTestAccount((err, account) => {
    const htmlEmail = `
    <h3> Contact Detail </h3>
    <ul>
      <li>Name : ${req.body.name}</li>
      <li>Email : ${req.body.email}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>

    `
    // let transporter = nodemailer.createTransport({
    //   host : 'smtp.ethereal.email',
    //   port : 587,
    //   auth : {
    //     user : '5910110071@psu.ac.th',
    //     pass : 'non_0898734193'
    //   } 
    // })

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      // port : 587,
      auth: {
        user: '5910110071@psu.ac.th',
        pass: 'non_0898734193'
      }
    })

    let mailOptions = {
      from: '5910110071@psu.ac.th',
      to: req.body.email,
      subject: 'New Message',
      html: htmlEmail
    }

    transporter.sendMail(mailOptions, function (err, info) {
      if (err)
        console.log(err)
      else
        console.log(info);
    });
  })
})



app.use('/product', product_router)
app.use('/order', order_router)
app.use('/category', cate_router)


// mongodb
app.get('/orders', async (req, res) => {
  const orders = await Order.find({})
  res.json(orders)
})


app.get('/orders/:id', async (req, res) => {
  console.log("req.params + 1", req.params)
  const orders = await Order.find({ user_id: req.params.id })
  res.json(orders)
})

app.get('/user/:id', async (req, res) => {
  console.log("req.params.id.user", req.params)
  const user = await User.findOne({ id: req.params.id })
  res.json(user)
})

//get basket
app.get('/basket/:id', async (req, res) => {
  console.log(" here req.params.id.user", req.params)
  const basket = await Basket.findOne({ user_id: req.params.id })
  res.json(basket)
})

// get Rating
app.get('/rating/:id', async (req, res) => {
  console.log("req.params.id.user", req.params)
  const rating = await Rating.findOne({ product_id: req.params.id })
  res.json(rating)
})


app.get('/comments/:id', async (req, res) => {
  const comments = await Comment.find({ product_id: req.params.id })
  res.json(comments)
})

app.get('/order/:id', async (req, res) => {
  const { id } = req.params
  console.log("id", req.params.id)
  try {
    const orders = await Order.findById(id)
    res.json(orders)
  } catch (error) {
    res.status(400).json(error)
  }
})

app.get('/userbyid/:uid', async (req, res) => {
  const { uid } = req.params
  console.log("id", req.params.uid)
  try {
    const user = await User.findById(uid)
    res.json(user)
  } catch (error) {
    res.status(400).json(error)
  }
})

app.post('/rating', async (req, res) => {
  const payload = req.body
  try {
    const rating = new Rating(payload)
    await rating.save()
    res.json(rating)
    res.status(201).end()
  } catch (error) {
    res.status(400).json(error)
  }
})

app.post('/basket', async (req, res) => {
  const payload = req.body
  try {
    const basket = new Basket(payload)
    await basket.save()
    res.json(basket)
    res.status(201).end()
  } catch (error) {
    res.status(400).json(error)
  }
})


app.post('/orders', async (req, res) => {
  const payload = req.body
  try {
    const order = new Order(payload)
    await order.save()
    res.status(201).end()
  } catch (error) {
    res.status(400).json(error)
  }
})

app.post('/users', async (req, res) => {
  const payload = req.body
  try {
    const user = new User(payload)
    await user.save()
    res.json(user)
    res.status(201).end()
  } catch (error) {
    res.status(400).json(error)
  }
})

app.post('/comments', async (req, res) => {
  const payload = req.body
  try {
    const comment = new Comment(payload)
    await comment.save()
    res.json(comment)
    res.status(201).end()
  } catch (error) {
    res.status(400).json(error)
  }
})

app.put('/order/:id', async (req, res) => {
  const payload = req.body
  const { id } = req.params

  try {
    const order = await Order.findByIdAndUpdate(id, { $set: payload })
    res.json(order)
  } catch (error) {
    res.status(400).json(error)
  }
})


app.put('/rating/:id', async (req, res) => {
  const payload = req.body
  const { id } = req.params

  try {
    const rating = await Rating.findOneAndUpdate({ product_id: id }, { $set: payload })
    res.json(rating)
  } catch (error) {
    res.status(400).json(error)
  }
})

app.put('/basket/:id', async (req, res) => {
  const payload = req.body
  const { id } = req.params

  try {
    const basket = await Basket.findOneAndUpdate({ user_id: id }, { $set: payload })
    res.json(basket)
  } catch (error) {
    res.status(400).json(error)
  }
})


app.delete('/order/:id', async (req, res) => {
  const { id } = req.params

  try {
    await Order.findByIdAndDelete(id)
    res.status(204).end()
  } catch (error) {
    res.status(400).json(error)
  }
})

app.delete('/basket/:id', async (req, res) => {
  const { id } = req.params

  try {
    await Basket.findByIdAndDelete(id)
    res.status(204).end()
  } catch (error) {
    res.status(400).json(error)
  }
})



app.listen(app.get('port'), function () {
  console.log("Node is running at localhost:" + app.get('port'))
})
