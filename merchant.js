if (Meteor.isClient) {
  Session.get('consumerId','randomTxt')

  /* ReadNFC START */

  // Template.readNfc.helpers({
    wittyNfcListener= function () {
      console.log("Listener init");
      // debugger;
      nfc.addNdefListener (
      // nfc.addTagDiscoveredListener (
        function (nfcEvent) {
            var tag = nfcEvent.tag,
            ndefMessage = tag.ndefMessage;
            consumerId = nfc.bytesToString(ndefMessage[0].payload).substring(3);

            if(!consumerId){
              alert('Couldnt Load Customer Id. \n Please try again ');
              return false
            }else{
              consumerId = consumerId.split(':')[1];
              Session.set('consumerId',consumerId);
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
      return Session.get('counter');
    }
  // });

 
  Template.readNfc.events({
    'click button': function () {
      // increment the counter when button is clicked
      console.log("readNfc Called");
      // Session.get('wittyNfcListener');
      wittyNfcListener();
    }
  });
  /*ReadNFC End */

  /*PaymentPage Start */
  Template.paymentPage.helpers({
    customer:  function () {
      if(Session.get('consumerId')){
        return Session.get('consumerId');
      return ;
      }else{
        $('#paymentPage').fadeOut(600);
        $('#readNfc').fadeIn(1200);        
        return 0
      }
    }
  });

  Template.paymentPage.events({
    'click button': function () {
      // write code to execute the payment 

      data ={};
      data.amount = $('#amount').val();
      data.consumer_id = Session.get('consumerId');
      Meteor.call('pay',data,function(err,res){
        alert("Result Msg:",res.message);
      });

      // write function to call payment method with basic auth
    }
  });
  /*PaymentPage End */

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