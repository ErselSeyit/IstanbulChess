    var socket = io.connect(),
    board,
    game = new Chess(),
    boardEl = $('#board'),
    squareToHighlight,
    squareToHighlightOld,	
  	squareToHighlightNew,
    sonoyuncular,
    moves,
    tas,
    masa,
    sayac,
    saattut,
    offsaattut,
    gecensure,
    offgecensure,
    siyahsure,
    offsiyahsure,
    beyazsure,
    offbeyazsure,
    zamantut,
    offzamantut,
    saat,
    offsaat,
    tempo,
    oyun,
    pgn,
    konum,
    kilit=false,
    offstrdk='',offstrsn='', offstrmsn='', offdk,offsn,offmsn,
    strdk='',strsn='', strmsn='', dk,sn,msn; 
    
    
/////////////// gelen ////////////////////////////////
    socket.on('oyuna_girildi', function(param){
      ersel_kapat();
      console.log('masa:'+masa+' ,taş:'+tas);
      oyun=param.id;
      
      beyazsure=param.beyazsure;
      siyahsure=param.siyahsure;
      tempo=param.tempo;
 
      if (param.taraf == 's'){
          board.orientation('black');
          
          //socket.emit('onayar');
          $('#rakip').text(param.beyaz+'('+param.beyazpuani+')');
          $('#rakipflag').attr('class','flag '+param.beyazbayrak);
          $('#rakipflag').attr('title',flagJS[param.beyazbayrak]);
          $('#rakipoyuncu').removeClass('ersel-yazi-beyaz')
          $('#rakipoyuncu').removeClass('ersel-arka-siyah');
          $('#rakipoyuncu').removeClass('ersel-yazi-siyah')
          $('#rakipoyuncu').removeClass('ersel-arka-beyaz');
          $('#rakipoyuncu').addClass('ersel-yazi-siyah')
          $('#rakipoyuncu').addClass('ersel-arka-beyaz');
           
          $('#rakipdetay').removeClass('ersel-yazi-beyaz')
          $('#rakipdetay').removeClass('ersel-arka-siyah');
          $('#rakipdetay').removeClass('ersel-yazi-siyah')
          $('#rakipdetay').removeClass('ersel-arka-beyaz');
          $('#rakipdetay').addClass('ersel-yazi-siyah')
          $('#rakipdetay').addClass('ersel-arka-beyaz');
          if (param.bos=='off'){
             $('#rakipdurum').children().css('fill', 'red');
          } else
          {  
             $('#rakipdurum').children().css('fill', 'green');
          };
          
          
          $('#yerel').text(param.siyah+'('+param.siyahpuani+')');
          $('#yerelflag').attr('class','flag '+param.siyahbayrak);
          $('#yerelflag').attr('title',flagJS[param.siyahbayrak]);
          $('#yereloyuncu').removeClass('ersel-yazi-beyaz')
          $('#yereloyuncu').removeClass('ersel-arka-siyah');
          $('#yereloyuncu').removeClass('ersel-yazi-siyah')
          $('#yereloyuncu').removeClass('ersel-arka-beyaz');
          $('#yereloyuncu').addClass('ersel-yazi-beyaz')
          $('#yereloyuncu').addClass('ersel-arka-siyah');
          
          $('#yereldetay').removeClass('ersel-yazi-beyaz')
          $('#yereldetay').removeClass('ersel-arka-siyah');
          $('#yereldetay').removeClass('ersel-yazi-siyah')
          $('#yereldetay').removeClass('ersel-arka-beyaz');
          $('#yereldetay').addClass('ersel-yazi-beyaz')
          $('#yereldetay').addClass('ersel-arka-siyah');
          $('#rakipsure').text(zamanicevir(param.beyazsure));
          $('#yerelsure').text(zamanicevir(param.siyahsure));
          $('#rakipoffsure').text(offzamanicevir(param.beyazoffsure));
          $('#yereloffsure').text(offzamanicevir(param.siyahoffsure));
          if (param.sos=='off'){
             $('#yereldurum').children().css('fill', 'red');
          } else
          {  
             $('#yereldurum').children().css('fill', 'green');
          };
	  } else
      if (param.taraf == 'b'){
          board.orientation('white');
          //socket.emit('onayar');
          $('#yerel').text(param.beyaz+'('+param.beyazpuani+')');
          $('#yerelflag').attr('class','flag '+param.beyazbayrak);
          $('#yerelflag').attr('title',flagJS[param.beyazbayrak]);
          $('#yereloyuncu').removeClass('ersel-yazi-beyaz')
          $('#yereloyuncu').removeClass('ersel-arka-siyah');
          $('#yereloyuncu').removeClass('ersel-yazi-siyah')
          $('#yereloyuncu').removeClass('ersel-arka-beyaz');
          $('#yereloyuncu').addClass('ersel-yazi-siyah')
          $('#yereloyuncu').addClass('ersel-arka-beyaz');
          
          $('#yereldetay').removeClass('ersel-yazi-beyaz')
          $('#yereldetay').removeClass('ersel-arka-siyah');
          $('#yereldetay').removeClass('ersel-yazi-siyah')
          $('#yereldetay').removeClass('ersel-arka-beyaz');
          $('#yereldetay').addClass('ersel-yazi-siyah')
          $('#yereldetay').addClass('ersel-arka-beyaz');
          if (param.sos=='off'){
             $('#yereldurum').children().css('fill', 'red');
          } else
          {  
             $('#yereldurum').children().css('fill', 'green');
          };
          
          $('#rakip').text(param.siyah+'('+param.siyahpuani+')');
          $('#rakipflag').attr('class','flag '+param.siyahbayrak);
          $('#rakipflag').attr('title',flagJS[param.siyahbayrak]);
          $('#rakipoyuncu').removeClass('ersel-yazi-beyaz')
          $('#rakipoyuncu').removeClass('ersel-arka-siyah');
          $('#rakipoyuncu').removeClass('ersel-yazi-siyah')
          $('#rakipoyuncu').removeClass('ersel-arka-beyaz');
          $('#rakipoyuncu').addClass('ersel-yazi-beyaz')
          $('#rakipoyuncu').addClass('ersel-arka-siyah');
          
          $('#rakipdetay').removeClass('ersel-yazi-beyaz')
          $('#rakipdetay').removeClass('ersel-arka-siyah');
          $('#rakipdetay').removeClass('ersel-yazi-siyah')
          $('#rakipdetay').removeClass('ersel-arka-beyaz');
          $('#rakipdetay').addClass('ersel-yazi-beyaz')
          $('#rakipdetay').addClass('ersel-arka-siyah');
          
          $('#rakipsure').text(zamanicevir(param.siyahsure));
          $('#yerelsure').text(zamanicevir(param.beyazsure));
          $('#rakipoffsure').text(zamanicevir(param.siyahoffsure));
          $('#yereloffsure').text(zamanicevir(param.beyazoffsure));
          if (param.bos=='off'){
             $('#rakipdurum').children().css('fill', 'red');
          } else
          {  
             $('#rakipdurum').children().css('fill', 'green');
          };
	    };
      
      masasec(masa);
      tassec(tas);      
      if (param.oynamasirasi=='white'){
          zamantut=param.beyazsure; 
      } else{
          zamantut=param.siyahsure;
      };
      $('#baslik').hide();
      $("#terfi").show();
      
      $("#oyunalani").show();
      
      saattut= Date.now();
      saat=setInterval(zaman,1);
      kilit=true;
    });
    
    socket.on('oyunlar', function(oyuncular){
      console.log(oyuncular);  
      var html = "";
      
      for (var key=0, size=oyuncular.length; key<size;key++) {
          
        html += '<tr><td>'
             + '<span class="flag '+oyuncular[key]['ulke']+'" title="'+flagJS[oyuncular[key]['ulke']]+'"></span>'
             + oyuncular[key]['kullanici']
             + '</td><td>'
             + oyuncular[key]['puani']
             + '</td><td>'
             + '<button class="ersel-button ersel-kucuk ersel-daire ersel-dalga ersel-sagda" onclick="oyun_oyna('+String.fromCharCode(39)+oyuncular[key]['kullanici']+String.fromCharCode(39)+')">'+langJS['oyna']+'</button>'
             + '</td></tr>';
      };
      
         
         if (html != sonoyuncular) $('#oyuncular').html(html);
         sonoyuncular=html;
         //console.log(html);
    });

    socket.on('konum',function(data){
        console.log('ok:'+data.ok+'r:'+data.r+' ,id:'+data.id+' ,bo:'+data.bo+' ,bp:'+data.bp+' ,bb:'+data.bb+' ,bs:'+data.bs+
                                                ' ,boff:'+data.boff+' ,bos:'+data.bos+
                                ' ,so:'+data.so+' ,sp:'+data.sp+' ,sb:'+data.sb+' ,ss:'+data.ss+
                                                ' ,soff:'+data.soff+' ,sos:'+data.sos+
                                                ' ,h:'+data.h+' ,k:'+data.k+' ,ot:'+data.ot+' ,mt:'+data.mt+
                                                ' ,tt:'+data.tt+' ,ber:'+data.ber+' ,d:'+data.d);
                        
        if (data.ok=='o'){
            //o'ya dön
            ersel_kapat();
            oyun=data.id;
            beyazsure=data.bs;
            siyahsure=data.ss;
            tempo=data.t;
            
            
            if (data.r == 'b'){
                board.orientation('black');
                //socket.emit('onayar');
                $('#rakip').text(data.bo+'('+data.bp+')');
                $('#rakipflag').attr('class','flag '+data.bb);
                $('#rakipflag').attr('title',flagJS[data.bb]);
                $('#rakipoyuncu').removeClass('ersel-yazi-beyaz')
                $('#rakipoyuncu').removeClass('ersel-arka-siyah');
                $('#rakipoyuncu').removeClass('ersel-yazi-siyah')
                $('#rakipoyuncu').removeClass('ersel-arka-beyaz');
                $('#rakipoyuncu').addClass('ersel-yazi-siyah')
                $('#rakipoyuncu').addClass('ersel-arka-beyaz');
          
                $('#rakipdetay').removeClass('ersel-yazi-beyaz')
                $('#rakipdetay').removeClass('ersel-arka-siyah');
                $('#rakipdetay').removeClass('ersel-yazi-siyah')
                $('#rakipdetay').removeClass('ersel-arka-beyaz');
                $('#rakipdetay').addClass('ersel-yazi-siyah')
                $('#rakipdetay').addClass('ersel-arka-beyaz');
                
                $('#yerel').text(data.so+'('+data.sp+')');
                $('#yerelflag').attr('class','flag '+data.sb);
                $('#yerelflag').attr('title',flagJS[data.sb]);
                $('#yereloyuncu').removeClass('ersel-yazi-beyaz')
                $('#yereloyuncu').removeClass('ersel-arka-siyah');
                $('#yereloyuncu').removeClass('ersel-yazi-siyah')
                $('#yereloyuncu').removeClass('ersel-arka-beyaz');
                $('#yereloyuncu').addClass('ersel-yazi-beyaz')
                $('#yereloyuncu').addClass('ersel-arka-siyah');
          
                $('#yereldetay').removeClass('ersel-yazi-beyaz')
                $('#yereldetay').removeClass('ersel-arka-siyah');
                $('#yereldetay').removeClass('ersel-yazi-siyah')
                $('#yereldetay').removeClass('ersel-arka-beyaz');
                $('#yereldetay').addClass('ersel-yazi-beyaz')
                $('#yereldetay').addClass('ersel-arka-siyah');
                $('#rakipsure').text(zamanicevir(data.bs));
                $('#yerelsure').text(zamanicevir(data.ss));
                $('#rakipoffsure').text(offzamanicevir(data.boff));
                $('#yereloffsure').text(offzamanicevir(data.soff));
                if (data.bos=='on'){
                    $('#rakipdurum').children().css('fill', 'green');
                } else {
                    $('#rakipdurum').children().css('fill', 'red');
                    
                };
                if (data.sos=='on'){
                    $('#yereldurum').children().css('fill', 'green');
                } else {
                    $('#yereldurum').children().css('fill', 'red');
                };
	        }
            if (data.r == 'w'){
                board.orientation('white');
                //socket.emit('onayar');
                $('#yerel').text(data.bo+'('+data.bp+')');
                $('#yerelflag').attr('class','flag '+data.bb);
                $('#yerelflag').attr('title',flagJS[data.bb]);
                $('#yereloyuncu').removeClass('ersel-yazi-beyaz')
                $('#yereloyuncu').removeClass('ersel-arka-siyah');
                $('#yereloyuncu').removeClass('ersel-yazi-siyah')
                $('#yereloyuncu').removeClass('ersel-arka-beyaz');
                $('#yereloyuncu').addClass('ersel-yazi-siyah')
                $('#yereloyuncu').addClass('ersel-arka-beyaz');
          
                $('#yereldetay').removeClass('ersel-yazi-beyaz')
                $('#yereldetay').removeClass('ersel-arka-siyah');
                $('#yereldetay').removeClass('ersel-yazi-siyah')
                $('#yereldetay').removeClass('ersel-arka-beyaz');
                $('#yereldetay').addClass('ersel-yazi-siyah')
                $('#yereldetay').addClass('ersel-arka-beyaz');
          
                $('#rakip').text(data.so+'('+data.sp+')');
                $('#rakipflag').attr('class','flag '+data.sb);
                $('#rakipflag').attr('title',flagJS[data.sb]);
                $('#rakipoyuncu').removeClass('ersel-yazi-beyaz')
                $('#rakipoyuncu').removeClass('ersel-arka-siyah');
                $('#rakipoyuncu').removeClass('ersel-yazi-siyah')
                $('#rakipoyuncu').removeClass('ersel-arka-beyaz');
                $('#rakipoyuncu').addClass('ersel-yazi-beyaz')
                $('#rakipoyuncu').addClass('ersel-arka-siyah');
          
                $('#rakipdetay').removeClass('ersel-yazi-beyaz')
                $('#rakipdetay').removeClass('ersel-arka-siyah');
                $('#rakipdetay').removeClass('ersel-yazi-siyah')
                $('#rakipdetay').removeClass('ersel-arka-beyaz');
                $('#rakipdetay').addClass('ersel-yazi-beyaz')
                $('#rakipdetay').addClass('ersel-arka-siyah');
                $('#rakipsure').text(zamanicevir(data.ss));
                $('#yerelsure').text(zamanicevir(data.bs));
                $('#rakipoffsure').text(offzamanicevir(data.soff));
                $('#yereloffsure').text(offzamanicevir(data.boff));
                if (data.sos=='on'){
                    $('#rakipdurum').children().css('fill', 'green');
                } else {
                    $('#rakipdurum').children().css('fill', 'red');
                };
                if (data.bos=='on'){
                    $('#yereldurum').children().css('fill', 'green');
                } else {
                    $('#yereldurum').children().css('fill', 'red');
                };
	       };
           pgn=data.h;
           game.load_pgn(data.h);
           konum=game.fen();
           board.position(game.fen());
           var m=game.history({verbose:true})[game.history().length-1];
            
           if (m){
              boardEl.find('.square-' + m.from).addClass('highlight-white');
              boardEl.find('.square-' + m.to).addClass('highlight-white');
		          squareToHighlightOld = m.from;	
		          squareToHighlightNew = m.to;	
              updateStatus(); 
           }
           
           if (data.ber !== ''){
              $('#berabere').removeClass('ersel-arka-gri');
              $('#berabere').addClass('ersel-amber'); 
           } else {
              $('#berabere').removeClass('ersel-amber');
              $('#berabere').addClass('ersel-arka-gri'); 
           }

           if (game.turn()=='w'){
               zamantut=data.bs; 
           } else{
               zamantut=data.ss;
           };
           console.log('konum mt:'+data.mt+' ,tt:'+data.tt);
           masasec(data.mt);
           masa=data.mt;
           tassec(data.tt);
           tas=data.tt;
           $('#oyunalani').show();
           $('#terfi').show();
           $('#baslik').hide();

           saattut= Date.now();
           saat=setInterval(zaman,1);
           kilit=true;
 
        } else {
            $('#terfi').hide();
            $('#baslik').show();
        };
           
     });
     
     socket.on('baglandi', function(data)
     {
         //console.log('r:'+data.r+' ,bo:'+board.orientation().substr(0,1), ' ,os:'+data.os+' ,s:'+data.s);
         if (data.r!==board.orientation().substr(0,1)){
             $('#rakipdurum').children().css('fill', 'green');
             $('#rakipoffsure').text(offzamanicevir(data.os));
             $('#rakipsure').text(zamanicevir(data.s));
         }
         else{
             $('#yereldurum').children().css('fill', 'green');
             $('#yereloffsure').text(offzamanicevir(data.os));
             $('#yerelsure').text(zamanicevir(data.s));
         };
     });
     
     socket.on('koptu', function(data)
     {   
         console.log('koptu--- r:'+data.r+' ,s:'+data.s+' ,os:'+data.os+' ,bo:'+board.orientation().substr(0,1));
         
         if (data.r!=board.orientation().substr(0,1)){
             $('#rakipdurum').children().css('fill', 'red');
             $('#rakipsure').text(zamanicevir(data.s));
             $('#rakipoffsure').text(offzamanicevir(data.os));
         } else
         {
             $('#yereldurum').children().css('fill', 'red');
             $('#yerelsure').text(zamanicevir(data.s));
             $('#yereloffsure').text(offzamanicevir(data.os));
         }
         
         offzamantut=data.s;
         offsaattut= Date.now();
         offsaat=setInterval(offzaman,1);    
     });
     
     socket.on('cikis', function(data)
     {
         form_modal_ac(langJS['Bilgi'],langJS['Başka yerden giriş yapıldı.'],'giris');
     });
     
     socket.on('baska_oturum_var', function(data)
     {
         form_modal_ac(langJS['Bilgi'],
         langJS['Başka yerden giriş yapıldı.']+String.fromCharCode(13)+langJS['Buradan devam etmek için, uyarı penceresini kapatmanız yeterlidir.'],'');
     });
     
     
     
     socket.on('onayar', function(data)
     {
       masasec(data.mt);
       masa=data.mt;
       tassec(data.tt);
       tas=data.tt;
	 });
     
     
     socket.on('hamleler', function(data)
     {
       //console.log('h:'+data.h+'f:'+data.f+',o:'+data.o+', s:'+data.s+', rs:'+data.rs);
       if (data.o!=board.orientation().substr(0,1)){
           var move=game.move(data.h);
           console.log('move.san:'+move.san+', move.from:'+move.from+'move.to:'+move.to);
           console.log('konumlar:'+data.f);
           board.position(game.fen());     
           
           removeHighlights('white');   
           boardEl.find('.square-' + move.from).addClass('highlight-white');
           boardEl.find('.square-' + move.to).addClass('highlight-white');
           squareToHighlightOld = move.from;	
	         squareToHighlightNew = move.to;	
           updateStatus();
           if (game.turn()=='b')
              siyahsure=data.rs;
           else
              beyazsure=data.rs;   
           $('#rakipsure').text(zamanicevir(data.s));
       };
       $('#berabere').removeClass('ersel-amber')
       $('#berabere').addClass('ersel-arka-gri'); 
       zamantut=data.rs;
       saattut= Date.now();
       saat=setInterval(zaman,1);    
     });
     
     socket.on('berabere', function(data){
         $('#berabere').removeClass('ersel-arka-gri')
         $('#berabere').addClass('ersel-amber');
     });
/////////////////// gelen ////////////////////////////////     

/////////////////// menu /////////////////////////////////
    function akordeon_bolum_kapat() {
		clearInterval(sayac);
        $('.akordeon .akordeon-bolum-baslik').removeClass('aktif');
		$('.akordeon .akordeon-bolum-icerik').slideUp(300).removeClass('acik');
	};

	$('.akordeon-bolum-baslik').click(function(e) {
		var currentAttrValue = $(this).attr('href');

		if($(e.target).is('.aktif')) 
        {
		    akordeon_bolum_kapat();
		} else 
        {
			akordeon_bolum_kapat();
            if (currentAttrValue=='#akordeon-oyun'){
               sayac=setInterval(oyunculari_getir,500);
            } 
            else {
              clearInterval(sayac);
            }
			$(this).addClass('aktif');
			$('.akordeon ' + currentAttrValue).slideDown(300).addClass('acik'); 
		};
        e.preventDefault();
	});
          
    function ersel_ac() {
        akordeon_bolum_kapat();
        document.getElementsByClassName("ersel-dikey-menu")[0].style.display = "block";
    };
    
    function ersel_kapat() {
        clearInterval(sayac);
        document.getElementsByClassName("ersel-dikey-menu")[0].style.display = "none";
    };
    
    function form_modal_kapat(hedef) {
        document.getElementById("form_modal").style.display="none";
        window.location.href = hedef;
    };
    
    function form_modal_ac(baslik,mesaj,hedef){
        document.getElementsByClassName("ersel-dikey-menu")[0].style.display = "none";
        document.getElementById("form_modal_baslik").innerText=baslik;  
        document.getElementById("form_modal_mesaj").innerText=mesaj;
        
        $('#form_modal_hedef').off('click');
        if (hedef){
            $('#form_modal_hedef').click(function(){
                form_modal_kapat("/"+hedef);
            });
        };    
        document.getElementById("form_modal").style.display="block";
    };
//////////////// menu /////////////////////////////////
    
//////////////// zaman ///////////////////////
    function zamanicevir(zaman){
        dk=Math.floor((zaman)/60000);
        sn=Math.floor((zaman-dk*60000)/1000);
        msn=zaman-dk*60000-sn*1000;

        if (dk<10) strdk='0'+dk.toString(); 
        else strdk=dk; 
           
        if (sn<10) strsn='0'+sn.toString(); 
        else strsn=sn;

        if (msn<10) strmsn='00'+msn.toString();
        else if (msn<100) strmsn='0'+msn.toString();
        else strmsn=msn;
        
        if (zaman>0){
           if (zaman<20000) 
               return(strsn+':'+strmsn);
           else
               return(strdk+':'+strsn)
        }
        else
        { 
           clearInterval(saat);
           dk=0; sn=0; msn=0; 
           return('00:00');
        };
    };
    
    function offzamanicevir(offzaman){
        offdk=Math.floor((offzaman)/60000);
        offsn=Math.floor((offzaman-offdk*60000)/1000);
        offmsn=offzaman-offdk*60000-offsn*1000;

        console.log('offdk:'+offdk+' ,offsn:'+offsn+' ,offmsn:'+offmsn);
        if (offdk<10) offstrdk='0'+offdk.toString(); 
        else offstrdk=offdk; 
           
        if (offsn<10) offstrsn='0'+offsn.toString(); 
        else offstrsn=offsn;

        if (offmsn<10) offstrmsn='00'+offmsn.toString();
        else if (offmsn<100) offstrmsn='0'+offmsn.toString();
        else strmsn=msn;
        
        if (offzaman>0){
           if (offzaman<20000) 
               return(offstrsn+':'+offstrmsn);
           else
               return(offstrdk+':'+offstrsn)
        }
        else
        { 
           clearInterval(offsaat);
           offdk=0; offsn=0; offmsn=0; 
           return('00:00');
        };
    };
    
    function zaman(){
        
        gecensure=(Date.now()-saattut);
           
        dk=Math.floor((zamantut-gecensure)/60000);
        sn=Math.floor((zamantut-gecensure-dk*60000)/1000);
        msn=zamantut-gecensure-dk*60000-sn*1000;

        if (dk<10) strdk='0'+dk.toString(); 
        else strdk=dk; 
           
        if (sn<10) strsn='0'+sn.toString(); 
        else strsn=sn;

        if (msn<10) strmsn='00'+msn.toString();
        else if (msn<100) strmsn='0'+msn.toString();
        else strmsn=msn;
        //alert('gt:'+game.turn()+',bo:'+board.orientation())   
        
        if (gecensure<zamantut){
           if ((zamantut-gecensure)<20000) 
               if ((board.orientation()=='white' && game.turn()=='w') || (board.orientation()=='black' && game.turn()=='b'))
                  $('#yerelsure').text(strsn+':'+strmsn);
               else
                  $('#rakipsure').text(strsn+':'+strmsn);
           else
               if ((board.orientation()=='white' && game.turn()=='w') || (board.orientation()=='black' && game.turn()=='b'))
                  $('#yerelsure').text(strdk+':'+strsn);
               else
                  $('#rakipsure').text(strdk+':'+strsn);
        }
        else
        { 
           clearInterval(saat);
           dk=0; sn=0; msn=0; 
           var params = {};
           if ((board.orientation()=='white' && game.turn()=='w') || (board.orientation()=='black' && game.turn()=='b')){
              $('#yerelsure').text('00:00');
              params.id=oyun;
              params.n='s';
              params.g=board.orientation().substr(0,1);
              if (board.orientation()=='white')
                 params.k='b';
              else
                 params.k='w';  
              socket.emit('oyunbitti', params);
           }
           else
           {   
              $('#rakipsure').text('00:00');
              params.id=oyun;
              params.n='s';
              params.g=board.orientation().substr(0,1);
              if (board.orientation()=='white')
                 params.k='w';
              else
                 params.k='b';  
              socket.emit('oyunbitti', params);
           };
        };
    };
    
    function offzaman(){
        
        offgecensure=(Date.now()-offsaattut);
           
        offdk=Math.floor((offzamantut-offgecensure)/60000);
        offsn=Math.floor((offzamantut-offgecensure-dk*60000)/1000);
        offmsn=offzamantut-offgecensure-offdk*60000-sn*1000;

        if (offdk<10) offstrdk='0'+offdk.toString(); 
        else offstrdk=offdk; 
           
        if (offsn<10) offstrsn='0'+offsn.toString(); 
        else strsn=sn;

        if (offmsn<10) offstrmsn='00'+offmsn.toString();
        else if (offmsn<100) offstrmsn='0'+offmsn.toString();
        else offstrmsn=offmsn;
        //alert('gt:'+game.turn()+',bo:'+board.orientation())   
        
        if (offgecensure<offzamantut){
           if ((offzamantut-offgecensure)<20000) 
               if ((board.orientation()=='white' && game.turn()=='w') || (board.orientation()=='black' && game.turn()=='b'))
                  $('#yereloffsure').text(offstrsn+':'+offstrmsn);
               else
                  $('#rakipoffsure').text(offstrsn+':'+offstrmsn);
           else
               if ((board.orientation()=='white' && game.turn()=='w') || (board.orientation()=='black' && game.turn()=='b'))
                  $('#yereloffsure').text(offstrdk+':'+offstrsn);
               else
                  $('#rakipoffsure').text(offstrdk+':'+offstrsn);
        }
        else
        { 
           clearInterval(offsaat);
           offdk=0; offsn=0; offmsn=0; 
           var params = {};
           if ((board.orientation()=='white' && game.turn()=='w') || (board.orientation()=='black' && game.turn()=='b')){
              $('#yereloffsure').text('00:00');
              params.id=oyun;
              params.n='s';
              params.g=board.orientation().substr(0,1);
              if (board.orientation()=='white')
                 params.k='b';
              else
                 params.k='w';  
              socket.emit('oyunbitti', params);
           }
           else
           {   
              $('#rakipoffsure').text('00:00');
              params.id=oyun;
              params.n='s';
              params.g=board.orientation().substr(0,1);
              if (board.orientation()=='white')
                 params.k='w';
              else
                 params.k='b';  
              socket.emit('oyunbitti', params);
           };
        };
    };
//////////////// zaman ///////////////////////    
    
//////////////// görünüm /////////////////
    function masasec(ind){
    if (ind==0)
		  {
	  		$(".black-3c85d").css({"background-image":"url('/img/yuzeyler/0S.bmp')"});
		  	$(".white-1e1d7").css({"background-image":"url('/img/yuzeyler/0B.bmp')"});
	  	}
		if (ind==1)
		{
		  	$(".black-3c85d").css({"background-image":"url('/img/yuzeyler/1S.bmp')"});
		  	$(".white-1e1d7").css({"background-image":"url('/img/yuzeyler/1B.bmp')"});
	  	}
		  if (ind==2)
	  	{
		  	$(".black-3c85d").css({"background-image":"url('/img/yuzeyler/2S.bmp')"});
		  	$(".white-1e1d7").css({"background-image":"url('/img/yuzeyler/2B.bmp')"});
	  	}
		if (ind==3)
		{
			$(".black-3c85d").css({"background-image":"url('/img/yuzeyler/3S.bmp')"});
			$(".white-1e1d7").css({"background-image":"url('/img/yuzeyler/3B.bmp')"});
		}
		if (ind==4)
		{
			$(".black-3c85d").css({"background-image":"url('/img/yuzeyler/4S.bmp')"});
		  	$(".white-1e1d7").css({"background-image":"url('/img/yuzeyler/4B.bmp')"});
	  	}
		if (ind==5)
		{
		  	$(".black-3c85d").css({"background-image":"url('/img/yuzeyler/5S.bmp')"});
		  	$(".white-1e1d7").css({"background-image":"url('/img/yuzeyler/5B.bmp')"});
	   	}
		if (ind==6)
		{
		  	$(".black-3c85d").css({"background-image":"url('/img/yuzeyler/6S.bmp')"});
		  	$(".white-1e1d7").css({"background-image":"url('/img/yuzeyler/6B.bmp')"});
		}
		if (ind==7)
		{
		  	$(".black-3c85d").css({"background-image":"url('/img/yuzeyler/7S.bmp')"});
		  	$(".white-1e1d7").css({"background-image":"url('/img/yuzeyler/7B.bmp')"});
		}
		if (ind==8)
		{
		  	$(".black-3c85d").css({"background-image":"url('/img/yuzeyler/8S.bmp')"});
		  	$(".white-1e1d7").css({"background-image":"url('/img/yuzeyler/8B.bmp')"});
		}
		if (ind==9)
		{
			$(".black-3c85d").css({"background-image":"url('/img/yuzeyler/9S.bmp')"});
			$(".white-1e1d7").css({"background-image":"url('/img/yuzeyler/9B.bmp')"});
		}
		if (ind==10)
		{
			$(".black-3c85d").css({"background-image":"url('/img/yuzeyler/10S.bmp')"});
			$(".white-1e1d7").css({"background-image":"url('/img/yuzeyler/10B.bmp')"});
    }
        $("#masa a").removeClass("ersel-arka-acik-gri");
        $("#m"+ind).addClass("ersel-arka-acik-gri");
        socket.emit('masayaz',ind);
      
        masa=ind;
    };   
    
    
    function tassec(ind){
		var str;
        if (ind!=tas) { 
          if (ind==0)	str='img/chesspieces/alpha/{piece}.png'; 
          if (ind==1)	str='img/chesspieces/merida/{piece}.svg';
          if (ind==2)	str='img/chesspieces/uscf/{piece}.png';
          if (ind==3)	str='img/chesspieces/wikipedia/{piece}.png';
           
          $("#tas a").removeClass("ersel-arka-acik-gri");
          $("#t"+ind).addClass("ersel-arka-acik-gri"); 
          socket.emit('tasyaz',ind);
          tas=ind;
          board.resize();
        
          $(".black-3c85d").css({"background-image":"url('/img/yuzeyler/"+masa+"S.bmp')"});
	        $(".white-1e1d7").css({"background-image":"url('/img/yuzeyler/"+masa+"B.bmp')"});
          boardEl.find('.square-' + squareToHighlightOld).addClass('highlight-white');
          boardEl.find('.square-' + squareToHighlightNew).addClass('highlight-white');
        };
	};
///////////////////////// görünüm ////////////////////////////////    

////////////////// masa olayları /////////////////////
    function tasayarla(a){
        if (a==='Vezir'){
            tas='q';
            $("#q").removeClass("ersel-arka-gri");
            $("#r").addClass("ersel-arka-gri");
            $("#b").addClass("ersel-arka-gri");
            $("#n").addClass("ersel-arka-gri");
        } else
        if (a==='Kale'){
            tas='r';
            $("#q").addClass("ersel-arka-gri");
            $("#r").removeClass("ersel-arka-gri");
            $("#b").addClass("ersel-arka-gri");
            $("#n").addClass("ersel-arka-gri");
        } else
	    if (a==='Fil'){
            tas='b';
            $("#q").addClass("ersel-arka-gri");
            $("#r").addClass("ersel-arka-gri");
            $("#b").removeClass("ersel-arka-gri");
            $("#n").addClass("ersel-arka-gri");
        } else
        if (a==='At'){ 
            tas='n';
            $("#q").addClass("ersel-arka-gri");
            $("#r").addClass("ersel-arka-gri");
            $("#b").addClass("ersel-arka-gri");
            $("#n").removeClass("ersel-arka-gri");
        } 
        document.getElementById("tastipi").textContent=langJS[a];
          
      };
        
      var removeHighlights = function(color) {
        boardEl.find('.square-55d63')
        .removeClass('highlight-' + color);
      };
      
      var onDragStart = function(source, piece, position, orientation) {
        if (game.game_over() === true || (kilit==false) ||
           (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
           (game.turn() === 'b' && piece.search(/^w/) !== -1) ||
           (game.turn() === 'w' && orientation == 'black') ||
           (game.turn() === 'b' && orientation == 'white')) {
             return false;
           }
      };
      
      var onDrop = function(source, target) {
      // hamle geçerli mi?
        
        //console.log(source+'-'+target);
        var move = game.move({
            from: source,
            to: target,
            promotion: tas 
        });

        // hamle geçersiz ise
        if (move === null) return 'snapback';
        
        clearInterval(saat);
        var tmpsure=zamantut-gecensure;
        if (tmpsure>0) 
            tmpsure=tmpsure+tempo*1000;
        else
            tmpsure=0;    
        dk=Math.floor((tmpsure)/60000);
        sn=Math.floor((tmpsure-dk*60000)/1000);
        msn=tmpsure-dk*60000-sn*1000;

        if (dk<10) strdk='0'+dk.toString(); 
        else strdk=dk; 
           
        if (sn<10) strsn='0'+sn.toString(); 
        else strsn=sn;

        if (msn<10) strmsn='00'+msn.toString();
        else if (msn<100) strmsn='0'+msn.toString();
        else strmsn=msn;
        
        if (tmpsure<20000 && tmpsure>0) 
           $('#yerelsure').text(strsn+':'+strmsn);
        else
           $('#yerelsure').text(strdk+':'+strsn);
        
        var rs;    
        //alert(tmpsure);
        if (game.turn()=='b')
        {
            siyahsure=tmpsure;
            rs=beyazsure;
        }
        else
        {
            beyazsure=tmpsure;
            rs=siyahsure;
        };     
        //console.log('gönderen:'+board.orientation().substr(0,1));
        socket.emit('hamleler', {'id':oyun,'h':move.san,'f':game.fen(),'s':tmpsure,'o':board.orientation().substr(0,1)});
        
        removeHighlights('white');
        
        boardEl.find('.square-' + source).addClass('highlight-white');
        boardEl.find('.square-' + target).addClass('highlight-white');
		    squareToHighlightOld = source;	
		    squareToHighlightNew = target;	
        updateStatus();
        
      };
      var updateStatus = function() 
      {
        var status = '';

        var moveColor = 'Beyaz';
        if (game.turn() === 'b') {
           moveColor = 'Siyah';
        }

        // mat mı?
        if (game.in_checkmate() === true) {
           status = 'mat';
        }

        // berabere mi?
        else if (game.in_draw() === true) {
          status = 'Berabere';
        }

        // oyun devam ediyor
        else {
          status = 'oynuyor';

          // şah mı?
          if (game.in_check() === true) {
             status = 'şah';
          }
        }  

        //durumEl.html(status);
        //siraEl.html(moveColor);
        //fenEl.html(game.fen());
        //pgnEl.html(game.pgn());
      };
      
      var onSnapEnd = function() {
        board.position(game.fen());
      };
   
	  
      var cfg = {
	    pieceTheme: pieceTheme,
	    draggable: true,
		showNotation: true,
	    position: 'start',
	    onDragStart: onDragStart,
	    onDrop: onDrop,
	    onSnapEnd: onSnapEnd
     };
      
     board = ChessBoard('board', cfg);
     
     function pieceTheme(piece) {
        if (tas==0)	return 'img/chesspieces/alpha/'+piece+'.png'; 
        if (tas==1)	return 'img/chesspieces/merida/'+piece+'.svg';
        if (tas==2)	return 'img/chesspieces/uscf/'+piece+'.png';
        if (tas==3)	return 'img/chesspieces/wikipedia/'+piece+'.png';
     };
     
     $(window).resize(function(){
       board.resize(); 
        
       $(".black-3c85d").css({"background-image":"url('/img/yuzeyler/"+masa+"S.bmp')"});
	   $(".white-1e1d7").css({"background-image":"url('/img/yuzeyler/"+masa+"B.bmp')"});
       boardEl.find('.square-' + squareToHighlightOld).addClass('highlight-white');
       boardEl.find('.square-' + squareToHighlightNew).addClass('highlight-white');
     });
     
////////////////// masa olayları /////////////////////

/////////////// oyun //////////////////////
    function oyun_oyna(data){
      var kriterler ={};
      kriterler.oyuntipi = $("#oyun_tipi").val();
      
      kriterler.oyunrengi = $("#oyun_rengi").val();
      
      kriterler.oyuncu = data;

      socket.emit('oyunoyna', kriterler); 
    };
    
    function oyunculari_getir(){
      var kriterler ={};
      kriterler.oyuntipi = $("#oyun_tipi").val();
      
      kriterler.oyunrengi = $("#oyun_rengi").val();

      if (!$("#oyun_min").val())
         kriterler.oyunmin=-50;
      else   
         kriterler.oyunmin = $("#oyun_min").val();
      if (!$("#oyun_max").val())
         kriterler.oyunmax=50;
      else      
         kriterler.oyunmax = $("#oyun_max").val();
      socket.emit('oyunlar', kriterler); 
    };
    
    function oyun_kur(){
      var kriterler ={};
      kriterler.oyuntipi = $("#oyun_tipi").val();
      kriterler.oyunrengi = $("#oyun_rengi").val();
      if (!$("#oyun_min").val())
         kriterler.oyunmin=-50;
      else   
         kriterler.oyunmin = $("#oyun_min").val();
      if (!$("#oyun_max").val())
         kriterler.oyunmax=50;
      else      
         kriterler.oyunmax = $("#oyun_max").val();
      socket.emit('oyunkur', kriterler); 
    };
    
    function berabere(){
      var kriterler ={};
      kriterler.o=board.orientation().substr(0,1);
      kriterler.id=oyun;
      socket.emit('berabere', kriterler);
    };
/////////////// oyun //////////////////////         