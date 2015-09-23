if (Meteor.isClient) {
  Session.get('customerId','randomTxt')

  /* ReadNFC START */

  Template.readNfc.helpers({
    wittyNfcListner: function () {
      // debugger;
      // nfc.addNdefListener (
      nfc.addTagDiscoveredListener (
        function (nfcEvent) {
            var tag = nfcEvent.tag,
            ndefMessage = tag.ndefMessage;

            // dump the raw json of the message
            // note: real code will need to decode
            // the payload from each record
            // assuming the first record in the message has 
            // a payload that can be converted to a string.
            // ASSUMING : that is the customer Id
            customerId = nfc.bytesToString(ndefMessage[0].payload).substring(3);
            if(!customerId){
              alert('Couldnt Load Customer Id. \n Please try again ');
              return false
            }

            // set Sesssion.set 'customerId'
            Session.set('customerId',customerId);
            $('#readNfc').fadeOut(600);
            $('#paymentPage').fadeIn(1200);

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
  });

 
  Template.readNfc.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.get('wittyNfcListener');
    }
  });
  /*ReadNFC End */

  /*PaymentPage Start */
  Template.paymentPage.helpers({
    customer:  function () {
      if(Session.get('customerId')){
        return Session.get('customerId');
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

      //get value of amount
      // TODO: Validate
      amount = $('#amount').val();
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

