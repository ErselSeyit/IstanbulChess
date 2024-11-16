      var socket = io.connect(),
      board,
      game = new Chess(),
      boardEl = $('#board'),
      squareToHighlight,
      squareToHighlightOld,	
  	  squareToHighlightNew,
      oyunrengi,
      moves,
      tas;
      
      socket.emit('verabi');
      
      function form_modal_kapat(hedef) {
        document.getElementById("form_modal").style.display="none";
        window.location.href = hedef;
      };
      
      function form_modal_ac(baslik,mesaj,hedef){
        document.getElementById("form_modal_baslik").innerText=baslik;  
        document.getElementById("form_modal_mesaj").innerText=mesaj;
        
        $('#form_modal_hedef').off('click');
        $('#form_modal_hedef').click(function(){
           form_modal_kapat(hedef);
        });
   
        document.getElementById("form_modal").style.display="block";
      };
      
      function form_gonder(){
        $('#hata_msg').text('');
        var gecerlieposta = new RegExp(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/);
        var k = $('#kullanici').val();
        $('#eposta').val($('#eposta').val().toLowerCase());
        var h = $('#eposta').val();
        var s = $('#sifre').val();
        var u = $("#ulkesec").find('option:selected').attr('id');
        
        if (!k) {
            $('#hata_msg').text(langJS['Lütfen, Hesap Adı giriniz.']);
            $('#kullanici').focus();
            return;
        } else
        if (k.lenght<6) {
           $('#hata_msg').text(langJS['Hesap Adı, en az 6 karakterden oluşmalı.']);
           $('#kullanici').focus();
           return;
        } 
        if (!h) {
            $('#hata_msg').text(langJS['Lütfen, E-posta giriniz.']);
            $('#eposta').focus();
            return;
        } else
        if (gecerlieposta.test(h) === false) {
           $('#hata_msg').text(langJS['Lütfen, geçerli bir E-posta giriniz.']);
           $('#eposta').focus();
           return;
        }      
        
        if (!s) {
            $('#hata_msg').text(langJS['Lütfen, Şifre giriniz.']);
            $('#sifre').focus();
            return;
        } else
        if (s.length<6) {
           $('#hata_msg').text(langJS['Şifre, en az 6 karakterden oluşmalı.']);
           $('#sifre').focus();
           return;
        }
        var st = $('#sifre_tekrar').val();
        if (!st) {
            $('#hata_msg').text(langJS['Lütfen, Şifre Tekrar giriniz.']);
            $('#sifre_tekrar').focus();
            return;
        } else
        if (s!=st) {
           $('#hata_msg').text(langJS['Şifre ve Şifre Tekrar, aynı olmalı.']);
           $('#sifre_tekrar').focus();
           return;
        }
        
        if (game.in_checkmate() === true)
           $.post('/kayit/'+k+'/'+h+'/'+s+'/'+u, function(basarili){
             
             if (basarili==='basarili'){
                form_modal_ac(langJS['Bilgi'],langJS['Kayıt işleminiz yapıldı.']+String.fromCharCode(13)+langJS['Lütfen, gönderilen e-postadan üyeliğinizi onaylayınız.'],'/giris');
             }
             else if (basarili==='kullanici_kayitli'){
                $('#hata_msg').text(langJS['Bu Hesap Adı kullanımda. Lütfen, değiştiriniz.']);
             }
             else if (basarili==='eposta_kayitli'){
                $('#hata_msg').text(langJS['E-posta kullanımda. Lütfen, değiştiriniz.']);
             }
             else $('#hata_msg').text('Kayıt İşlemi Başarısız.');
           });
        else
          $('#hata_msg').text(langJS['<Tek hamlede mat> problemini çözmelisiniz.']);  
                 
        //
      };
      
      $('#form_giris input').keyup(function(){
        $('#hata_msg').text('');
        var gecerlieposta = new RegExp(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/);
        var c = $('#kullanici').val();
        if (!c) {
            $('#hata_msg').text(langJS['Lütfen, Hesap Adı giriniz.']);
            $(this).change();
            return;
        } else
        if (c.length<6) {
           $('#hata_msg').text(langJS['Hesap Adı, en az 6 karakterden oluşmalı.']);
           $(this).change();
           return;
        } else {
           socket.emit('hesap_kontrol',c);
           $(this).change();
        }
        
        c = $('#eposta').val();
        if (!c) {
            $('#hata_msg').text(langJS['Lütfen, E-posta giriniz.']);
            $(this).change();
            return;
        } else
        if (gecerlieposta.test(c) === false) {
           $('#hata_msg').text(langJS['Lütfen, geçerli bir E-posta giriniz.']);
           $(this).change();
           return;
        } else {
           socket.emit('eposta_kontrol',c);
           $(this).change();
        }
             
        c = $('#sifre').val();
        if (!c) {
            $('#hata_msg').text(langJS['Lütfen, Şifre giriniz.']);
            $(this).change();
            return;
        } else
        if (c.length<6) {
           $('#hata_msg').text(langJS['Şifre, en az 6 karakterden oluşmalı.']);
           $(this).change();
           return;
        }
        var st = $('#sifre_tekrar').val();
        if (!st) {
            $('#hata_msg').text(langJS['Lütfen, Şifre Tekrar giriniz.']);
            $(this).change();
            return;
        } else
        if (c!=st) {
           $('#hata_msg').text(langJS['Şifre ve Şifre Tekrar, aynı olmalı.']);
           $(this).change();
           return;
        }
      });
      
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
      
      socket.on('hesap_var', function(data)
      {
         $('#hata_msg').text(langJS['Bu Hesap Adı kullanımda. Lütfen, değiştiriniz.']);
         $('#kullanici').setfocus();
      });
      
      socket.on('eposta_var', function(data)
      {
         $('#hata_msg').text(langJS['Bu E-posta kullanımda. Lütfen, değiştiriniz.']);
         $('#eposta').setfocus();
      });
      
      var removeHighlights = function(color) {
        boardEl.find('.square-55d63')
        .removeClass('highlight-' + color);
      };
      
      var onDragStart = function(source, piece, position, orientation) {
        if (game.game_over() === true ||
           (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
           (game.turn() === 'b' && piece.search(/^w/) !== -1) ||
           (game.turn() === 'w' && orientation == 'black') ||
           (game.turn() === 'b' && orientation == 'white')) {
             return false;
           }
      };
      
      var onDrop = function(source, target) {
      // hamle geçerli mi?
        
        var move = game.move({
            from: source,
            to: target,
            promotion: tas 
        });

        // hamle geçersiz ise
        if (move === null) return 'snapback';
        
        if (oyunrengi == null) oyunrengi='beyaz';
		
		moves = game.history();		
		
		
        
        //socket.emit('hamlesi', move.san);
        removeHighlights('white');
        
        boardEl.find('.square-' + source).addClass('highlight-white');
        boardEl.find('.square-' + target).addClass('highlight-white');
		squareToHighlightOld = source;	
		squareToHighlightNew = target;	
        updateStatus();
      };

      
      var updateStatus = function() 
      {
        // mat mı?
        if (game.in_checkmate() === true) {
           $('#hata_msg').text(langJS['Tebrikler. Mat Ettiniz.']);
        }
        else {
           $('#hata_msg').text(langJS['Yanlış Hamle. Tekrar Deneyiniz.']);
           socket.emit('verabi');
        }
                   

        
      };
      
      var onSnapEnd = function() {
        board.position(game.fen());
      };
   
	  
      var cfg = {
	    pieceTheme: 'img/chesspieces/merida/{piece}.svg',
	    draggable: true,
		showNotation: false,
	    position: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
	    onDragStart: onDragStart,
	    onDrop: onDrop,
	    onSnapEnd: onSnapEnd
     };
	    
     board = new ChessBoard('board', cfg);
     socket.on('alabi', function(data)
     {
         //alert(data);
         game.load(data);
         if (game.turn()=='b') board.orientation('black');
         else board.orientation('white');
         board.position(game.fen());
     });
	 
     $(window).resize(function(){
       board.resize();  
     });
