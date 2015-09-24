if (Meteor.isClient) {
  Session.set('consumerId','rndmTxt');
  Session.set('amount',0.1);

  /* ReadNFC START */

  wittyNfcListener= function () {
    console.log("Listener init");
    nfc.addNdefListener (
      function (nfcEvent) {
          var tag = nfcEvent.tag,
          ndefMessage = tag.ndefMessage;
          consumerId = nfc.bytesToString(ndefMessage[0].payload).substring(3);

          if(!consumerId){
            alert('Couldnt Load Customer Id. \n Please try again ');
            return false
          }else{
            consumerId = parseInt(consumerId.split(':')[1],10);
            console.log("New ConsumerID", consumerId)
            Session.set('consumerId',consumerId);
            console.log("Session ConsumerID", Session.get('consumerId'));
            $('#readNfc').fadeOut(600);
            $('#paymentPage').fadeIn(1200);

          }


      },  
      function () { // success callback
          alert("Waiting for NDEF tag");
      },
      function (error) { // error callback
          alert("Error adding NDEF listener " + JSON.stringify(error));
      }
    );
    return true;
  }

 
  Template.readNfc.events({
    'click button': function () {
      // increment the counter when button is clicked
      console.log("readNfc Called");
      // Session.get('wittyNfcListener');
      amount = $('#amount').val();
      filter = /^[0-9]*$/;
      if(filter.test(amount)){
        alert('Please enter a valid no');
        return false;
      }
      Session.set('amount',amount);
      wittyNfcListener();
    }
  });
  /*ReadNFC End */

  /*PaymentPage Start */
  Template.paymentPage.helpers({
    amount:  function () {
      return Session.get('amount');
    }
  });

  Template.paymentPage.events({
    'click button': function () {
      // write code to execute the payment 
      // window.pay(Session.get(amount)
    }
  });
  /*PaymentPage End */

  window.pay= function(){
      console.log("Pay fn ");
      console.log("Ver 1");
      data ={};
      data.amount = Session.get('amount');
      data.consumer_id = Session.get('consumerId');
      // TODO later shift to server
      Meteor.call('pay',data,function(err,res){
        console.log(err);
        console.log("Result Msg:",res.message);
      });
      console.log("data loaded", Session.get('consumerId'),Session.get('amount'));
       // data= {
       //      'consumer_id': Session.get('consumerId'),
       //      'total_amount': Session.get('amount'),
       //      'email': "sri@witworks.com",
       //      'merchant_refID': "test13" + Math.floor((Math.random() * 1000) + 1)
       //  };
       //  console.log("Starting Payment");
       //  console.log("Payment Obj : ", data);
       //  results = Meteor.http.post('http://180.179.146.81/wallet/v1/debits/general', {
       //    data: {
       //      'consumer_id': consumer_id,
       //      'total_amount': amount,
       //      'email': "sri@witworks.com",
       //      'merchant_refID': "test13" + Math.floor((Math.random() * 1000) + 1)
       //    },
       //    headers: {
       //      'Authorization': 'Basic NDBhY2U3OWQwMDUxMzc1MDhkZDQyYWQzNjdjM2RjMDg6Y2MxZTcyNzBkN2JkNTUwYzNiNjQ0YzczYTk1NWZlMjk='
       //    }
       //  });
       //  console.log("Payment return called");
       //  console.log(results);
       //  respJSON = JSON.parse(results.content);
       //  console.log(respJSON);
       //  return respJSON;

      // $.ajax({
      //   url: "http://180.179.146.81/wallet/v1/debits/general",
      //   data:data,
      //   method:'POST',
      //   type:"application/json",
      //   beforeSend: function (xhr) {
      //       xhr.setRequestHeader ("Authorization", 'Basic NDBhY2U3OWQwMDUxMzc1MDhkZDQyYWQzNjdjM2RjMDg6Y2MxZTcyNzBkN2JkNTUwYzNiNjQ0YzczYTk1NWZlMjk=');
      //   },
      //   success:function(res) {
      //     console.log(res);
      //     alert(res);
      //   },
      //   error:function(err){
      //     console.error(err);
      //     alert("Payment Failed");
      //   }
      // });
      // console.log("Payment return called");
      // return true
      // write function to call payment method with basic auth
  }

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    // ToDo: fix for handling server calls to PAYMENT API

  });
}

if (Meteor.isCordova) {

  Meteor.startup(function () {
    // code to run on server at startup
      // console.log(Asset.getText('main_logo.png'));
    
      $('input').blur(function() {
        var $this = $(this);
        if ($this.val())
          $this.addClass('used');
        else
          $this.removeClass('used');
      });

      var $ripples = $('.ripples');

      $ripples.on('click.Ripples', function(e) {

        var $this = $(this);
        var $offset = $this.parent().offset();
        var $circle = $this.find('.ripplesCircle');

        var x = e.pageX - $offset.left;
        var y = e.pageY - $offset.top;

        $circle.css({
          top: y + 'px',
          left: x + 'px'
        });

        $this.addClass('is-active');

      });

      $ripples.on('animationend webkitAnimationEnd mozAnimationEnd oanimationend MSAnimationEnd', function(e) {
        $(this).removeClass('is-active');
      });

    Cordova.depends({
      'com.chariotsolutions.nfc.plugin':'https://github.com/jalbersol/phonegap-nfc/tarball/ebfcd23bc5bba01d9b9529f0fbe528894e6bca64'
    });
    

  })
}

if(Meteor.isServer){
    Meteor.methods({
      pay: function(data) {
        console.log("Pay Init");
        consumer_id= data.consumer_id || undefined;
        if (!consumer_id) {return false}
        amount= data.amount || 0.01;

        var respJSON, results;
        results = Meteor.http.post('http://180.179.146.81/wallet/v1/debits/general', {
          data: {
            'consumer_id': consumer_id,
            'total_amount': amount,
            'email': "sri@witworks.com",
            'merchant_refID': "test13" + Math.floor((Math.random() * 1000) + 1)
          },
          headers: {
            'Authorization': 'Basic NDBhY2U3OWQwMDUxMzc1MDhkZDQyYWQzNjdjM2RjMDg6Y2MxZTcyNzBkN2JkNTUwYzNiNjQ0YzczYTk1NWZlMjk='
          }
        });
        respJSON = JSON.parse(results.content);
        console.log(respJSON);
        return respJSON;
      }
  });


}