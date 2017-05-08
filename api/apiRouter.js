'use strict';
var express = require('express');
var User = require('./models/User');
var jwt = require('jsonwebtoken');
var config = require('../config');
var request = require('request');

/* Load mock JSON data */
var loanReasonsData = require('./models/useOfLoans'); 
var loanListData = require('./models/loanList');

var blockchain = require('./modules/blockchain.js')(loanListData);
var router = express.Router();
var app = express();
var BASE_URL = "http://NOIAMAL1839897:3001";

app.set('superSecret', config.secret);

// route to authenticate a user on login (POST http://localhost:8080/api/authenticate)
router.post('/authenticate', function(req, res) {
    var result = blockchain.authenticateUser(req.body);
    if (result && (result.success === false)) {
        res.json({success: false, message: 'Server error'});
    } else{  
        if (!result.isValid) {
            res.json({ success: false, message: 'Authentication failed. Invalid username, password.' });
        } else {
            // if user is found and password is right
            // create a token
            var tokenExpiry = 1440;
            var token = jwt.sign(result.authenticUser, app.get('superSecret'), {
                expiresIn: tokenExpiry // expires in 24 hours
            });

            // return the information including token as JSON
            res.json({
                success: true,
                message: 'Authenticated Successfully',
                token: token,
                tokenExpiry: tokenExpiry,
                userName: result.authenticUser.userName,
                firstName: result.authenticUser.firstName,
                lastName: result.authenticUser.lastName,
                emailId: result.authenticUser.emailId,
                roles: result.authenticUser.roles,
                id: result.authenticUser.id
            });
        }
    }
});

// route middleware to verify a token
router.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
});

router.post('/withdrawAmount', function(req, res){
  console.log(req.body);
    var withdrawData = {
       LoanId: req.body.loanId,
       Amount: req.body.amount
    };
    request.post({
        headers: {'content-type' : 'application/json'},
        url:"http://NOIAMAL1839897:3003/api/withdrawAmt",
        json: true,
        form:withdrawData
      },function(error, response, body) {
        var result;
        if(response && response.body){
          //var resp = JSON.parse(response.body? response.body:'{}');
          console.log("body::::::::::::::: " +body.Outstanding);
          result = {    
              success: true,
              loanId : body.LoanId,
              outstanding : body.Outstanding,
              message: 'Loan with loan ID '+ body.LoanId 
           }  
          }else{
            result = {
              success: false,
              message: 'Error while saving data' 
            }
          }
        
        res.send(result);
      });
     });


// define the API route
router.get('/', function(req, res) {
    res.send('API is at /api/* ');
});

// route to return all users (GET http://localhost:8080/api/users)
router.get('/users', function(req, res) {
    User.find({}, function(err, users) {
        res.json(users);
    });
});

router.post('/logout', function(req, res) {
    res.json({
        success: true,
        message: 'logged out successfully'
    });
});

/*router.post('/saveLoanData', function(req, res) {
    var result = blockchain.saveLoanData(req);
    res.json(result);
});*/


router.post('/saveLoanData', function(req, res) {
      var loanData = {
                        fName : req.body.borrower.firstName,
                        mName : req.body.borrower.middleName,
                        lName : req.body.borrower.lastName,
                        emailId : req.body.borrower.emailId,
                        phone : req.body.borrower.phone,
                        loanAmount : req.body.loanAmount,
                        collateralValue : req.body.collateralValue,
                        collateralAccountIds : req.body.collateralAccountIds,
                        brokerId : "5001",
                        brokerName : "Broker",
                        isExistingBorrower : req.body.borrower.isExistingBorrower
                      }
        console.log(loanData);
        request.post({
              headers: {'content-type' : 'application/json'},
              url:BASE_URL+"/api/createLoan",
              json: true,
              form:loanData
            },function(error, response, body) {
                var result;
                if(response && response.body){
                  
                  result = {    
                      success: true,
                      loanId : body.loanId,
                      message: 'Loan with loan ID '+ body.loanId +' saved successfully for borrower with ID as '+body.bid,
                      borrowerId:body.bid
                   }  
                  }else{
                    result = {
                      success: false,
                      message: 'Error while saving data' 
                    }
            }
        
          res.send(result);

        });
  });

router.get('/getUsesOfLoanProceeds', function(req, res) {
    res.send(loanReasonsData);
});
router.get('/getCurrentRate', function(req, res) {
    res.send(require("./models/currentRate"));
});

/*router.get('/getCollateralAccountList', function(req, res) {
    res.send(require("./models/collateralAccountList"));
});*/

router.get('/getCollateralAccountList/:borrowerPhNum', function(req, res) {
    var reqBorrowerPhNum = req.params.borrowerPhNum;
    request(BASE_URL+"/getPortfolioAccounts/"+reqBorrowerPhNum, function(error, response, body) {
        console.log("++++++++++++++" +body);
      res.send(body);
    });
});

/*router.post('/getAccountSecurities', function(req, res) {
    res.send(require("./models/collateralaccountsecuritydetails"));
});
*/
/*router.post('/getAccountSecurities', function(req, res) {
    console.log(req.body.collateralAccountIds[0]);
    request('http://10.203.60.154:7072/getSecuritiesForPid/202/4',function(){
    //request(BASE_URL+"/getSecuritiesforPid/"+req.body.collateralAccountIds[0], function(error, response, body) {
      res.send(body);
    });
});*/


router.post('/getAccountSecuritiesOnCreate', function(req,res){
    console.log(req.body);
    request(BASE_URL+'/getSecuritiesForPaId/'+req.body.collateralAccountID+"/"+req.body.collateralAccountCount,function(error, response, body){
      res.send(body);
    });
});

router.get('/getExistingBorrowerDetails/:phone', function(req, res){
      request(BASE_URL+'/getBorrowerBasedOnMo/'+req.params.phone,function(error, response, body){
      var resp = JSON.parse(body);
        var result = {    
                    success: true,
                    data:resp
                 }
        res.send(resp);
    });
});

router.get('/getLoanList', function(req, res) {
    //res.send(loanListData);
    request(BASE_URL+"/getLoanList", function(error, response, body) {
      var loanListData = body;
      res.send(loanListData);
    });
});


router.get('/getLoanListBorrower/:borrowerID', function(req,res){
    var reqBorrowerId = req.params.borrowerID;
    request("http://NOIAMAL1839897:3003/getLoanListForBorrower/"+reqBorrowerId, function(error, response, body) {
      var loanListData = JSON.parse(response?response.body:'{}');
      res.send(loanListData);
    });
});


router.get('/getLoanDetails/:loanId', function(req, res) {
    //var loan = blockchain.getLoanDetailsById(req.params.loanId);
    //res.send(loan);
    var reqLoanId = req.params.loanId;
    request(BASE_URL+"/getLoan/"+reqLoanId, function(error, response, body) {
        var resp = JSON.parse(response.body);
      res.send(resp);
    });
    //res.send(require("./models/loanListMock"));
});

router.get('/readSecurities', function(req, res) {
    //res.send(loanListData);
    request(BASE_URL+"/readSecurities", function(error, response, body) {
      var securitiesData = body;
      res.send(securitiesData);
    });
});

router.post('/updateSecurityPrice', function(req, res){
  var updatedSecurityList = {
       securityId: [],
       securityNewPrice: []
    };

    if(req.body){
        req.body.forEach(function(item){
        updatedSecurityList.securityId.push(parseInt(item.id));
        updatedSecurityList.securityNewPrice.push(parseInt(item.newPrice ? item.newPrice : item.price));
      });  
    }
  });


router.get('/getLoanDetailsForBorrower/:loanId', function(req, res) {
    //var loan = blockchain.getLoanDetailsById(req.params.loanId);
    //res.send(loan);
    var reqLoanId = req.params.loanId;
    request(BASE_URL+"/getLoanForBorrower/"+reqLoanId, function(error, response, body) {
        var resp = JSON.parse(response.body);
      res.send(resp);
    });
    //res.send(require("./models/loanListMock"));
});

/*router.post('/approveLoanData', function(req, res) {
    var resp = blockchain.performUserAction(req.body.loanId, req.body.action);
    res.send({ success: resp });
});*/

router.post('/approveLoanData', function(req, res) {
    var status = blockchain.getLoanStatus(req.body.action);
    var url = BASE_URL+"/setStatusByBD/"+
              req.body.loanId+"/"+
              status
    request(url, function(error, response, body) {
      var result = JSON.parse(body);
      result.success = false;
      if(response.statusCode ===200){
        result.success = true;
      }
      res.send(result);
    });
});

/*router.post('/acknowledgeLoanData', function(req, res) {
    var resp =  blockchain.performUserAction(req.body.loanId, req.body.action);
    res.send({ success: resp });
});*/

router.post('/acknowledgeLoanData', function(req, res) {
    var status = blockchain.getLoanStatus(req.body.action);
    var url = BASE_URL+"/setStatusByBO/"+
               req.body.loanId+"/"+
               status
               console.log(url);
    request(url, function(error, response, body) {
     var result = JSON.parse(body);
      result.success = false;
      if(response.statusCode ===200){
        result.success = true;
      }
      res.send(result);
    });
});

/*router.post('/sendConsent', function(req, res) {
    var resp =  blockchain.performUserAction(req.body.loanId, req.body.action);
    res.send({ success: resp });
});*/

router.post('/sendConsent', function(req, res) {
    var action = req.body.action;
    var status = blockchain.getLoanStatus(action);
    var url = BASE_URL+"/setStatusByBD/"+
               req.body.loanId+"/"+
               status
    request(url, function(error, response, body) {
      var result = JSON.parse(body);
      result.success = false;
      if(response.statusCode ===200){
        result.success = true;
      }
      res.send(result);
    });
});
////************* Delete it after use
router.get('/setup', function(req, res) {
    // create a sample user
    var nick = new User({
        userName: 'sunil',
        password: 'Default123#',
        emailId: 'sunil@gmail.com',
        firstName: 'Sunil',
        lastName: 'Kumar',
        roles: ['admin', 'fa']
    });

    // save the sample user
    nick.save(function(err) {
        if (err) throw err;

        console.log('User saved successfully');
        res.json({ success: true });
    });
});

////*************

module.exports = router;
