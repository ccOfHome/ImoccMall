var express = require('express')
var mongoose = require('mongoose')

var router = express.Router()

var goods = require('../models/goods')
// mongodb://root:root@localhost:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false
// mongoose.connect('mongodb://root:root@127.0.0.1:27017/malls')
mongoose.connect('mongodb://root:root@localhost:27017/malls?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false')
mongoose.connection.on('connection', function () {
  console.log('Mongodb connect success')
})

mongoose.connection.on('error', function () {
  console.log('Mongodb connect error')
})

mongoose.connection.on('disconnected', function () {
  console.log('Mongodb connect disconnected')
})

router.get('/list', function (req, res, next) {
  let page = parseInt(req.param('page'))
  let pageSize = parseInt(req.param('pageSize'))
  let priceLevel = req.param('priceLevel')
  let sort = req.param('sort')
  let skip = (page - 1) * pageSize
  var priceGt = ''
  var priceLte = ''
  let params = {}
  if (priceLevel !== 'all') {
    if (priceLevel === '0') {
      priceGt = 0
      priceLte = 100
    } else if (priceLevel === '1') {
      priceGt = 100
      priceLte = 500
    } else if (priceLevel === '2') {
      priceGt = 500
      priceLte = 1000
    } else if (priceLevel === '3') {
      priceGt = 1000
      priceLte = 5000
    }
    params = {
      salePrice: {
        $gt: priceGt,
        $lte: priceLte
      }
    }
  }
  let goodsModel = goods.find(params).skip(skip).limit(pageSize)
  goodsModel.sort({'salePrice': sort})

  goodsModel.exec(function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  })
})

// 加入购物车
router.post('/addCart', function (req, res, next) {
  var userId = '100000077'
  var productId = req.body.productId
  var User = require('../models/user')
  User.findOne({userId: userId}, function (err, userDoc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      if (userDoc) {
        let goodsItem = ''
        userDoc.cartList.forEach(function (item) {
          if (item.productId === productId) {
            goodsItem = item
            item.productNum++
          }
        })
        if (goodsItem) {
          userDoc.save(function (err2, doc2) {
            if (err2) {
              res.json({
                status: '1',
                msg: err2.message
              })
            } else {
              res.json({
                status: '0',
                msg: '',
                result: 'suc'
              })
            }
          })
        } else {
          goods.findOne({productId: productId}, function (err1, doc) {
            if (err1) {
              res.json({
                status: '1',
                msg: err1.message
              })
            } else {
              if (doc) {
                let newobj = {
                  productId: doc.productId,
                  producName: doc.producName,
                  salePrice: doc.salePrice,
                  productName: doc.productName,
                  productImage: doc.productImage,
                  productNum: '1',
                  checked: '1'
                }
                userDoc.cartList.push(newobj)
                userDoc.save(function (err2, doc2) {
                  if (err2) {
                    res.json({
                      status: '1',
                      msg: err2.message
                    })
                  } else {
                    res.json({
                      status: '0',
                      msg: '',
                      result: 'suc'
                    })
                  }
                })
              }
            }
          })
        }
      }
    }
  })
})

module.exports = router
