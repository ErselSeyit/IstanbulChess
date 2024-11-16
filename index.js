var kayitli=0, bagli=0;
var express = require("express.io");
var app = express().http().io();
var mongoose = require('mongoose');
var path = require('path');
var Agenda = require('agenda');


mongoose.connect('mongodb://localhost/satranc', function(err){
    if (err) console.log(err);
    console.log('mongoose bağlandı')
});

var oturumlarSchema = mongoose.Schema({kullanici:String, oturum: String, soket: String,
    puani: {type:Number, default:1000}, enaz:{type:Number,default:-50}, encok:{type:Number,default:50},
    oyuntipi:{type:Number,default:1}, oyunrengi:{type:Number,default:1},tastipi:{type:Number,default:0},masatipi:{type:Number,default:0},ulke:{type:String,default:'xx'},
    konum:String,konumid:String});
var Oturumlar = mongoose.model('oturumlar', oturumlarSchema);

var captchaSchema = mongoose.Schema({baslangic:String});
var Captcha = mongoose.model('captcha', captchaSchema);

var kullanicilarSchema = mongoose.Schema({kullanici:String, eposta: String, sifre:String, ulke:{type:String,default:'xx'}, 
    tarih: {type:Date, default: Date.now}, kullanicitipi:String, onayli: {type:Number,default:0}});
var Kullanicilar = mongoose.model('kullanicilar', kullanicilarSchema);

var oyunlarSchema = mongoose.Schema({oyuncubeyaz:String, beyazpuani:Number, beyazbayrak:String, oyuncusiyah:String, siyahpuani:Number, siyahbayrak:String, 
    oyuntarihi:{type:Date, default: Date.now},oyuntipi: String, hamleler:{type:String, default:''}, konumlar:{type:String,default:''},hamlesayisi:{type:Number,default:0},
    beyazsure:Number, beyazofftarihi:{type:Date, default: Date.now}, beyazoffsure:Number, 
    siyahsure:Number, siyahofftarihi:{type:Date, default: Date.now}, siyahoffsure:Number, 
    bos:{type:String,default:'on'}, sos:{type:String,default:'on'}, o:String, berabere:{type:String,default:''},durum:String});
var Oyunlar = mongoose.model('oyunlar', oyunlarSchema);

var bitenoyunlarSchema = mongoose.Schema({oyuncubeyaz:String, beyazpuani:Number, oyuncusiyah:String, siyahpuani:Number, oyuntarihi:Date,
    oyuntipi:String, hamleler:String, hamlesayisi:Number, kazanan:String, neden:String});
var BitenOyunlar = mongoose.model('bitenoyunlar', bitenoyunlarSchema);

var adayoyunlarSchema = mongoose.Schema({kullanici:String, soket:String, puani:Number, ulke:String, 
    oyuntipi:String, oyunrengi:String, oyunmin: {type:Number, default:-50}, oyunmax: {type:Number, default:50}, 
    oyunTarihi:{type:Date, default: Date.now}});
var AdayOyunlar = mongoose.model('adayoyunlar', adayoyunlarSchema);


var gorev = new Agenda({db: {address: 'mongodb://localhost/satranc', collection: "gorevListesi"}});

gorev.define('biten_oyun',function(job,done) {
  
  Oyunlar.find({bos:'off',sos:'off'}, function(err, offoyunlar){ 
     if (err) console.log(err);
     //console.log(offoyunlar.length);
     if (offoyunlar.length>0){
         //console.log('offline oyun bulundu');
         offoyunlar.forEach(function(oyun){
            //console.log('oyun.oyuntarihi:'+oyun.oyuntarihi+', new date:'+Date()+', siyahsure:'+oyun.siyahsure+',beyazsure:'+oyun.beyazsure);
            if ((oyun.o=='w' && oyun.oyuntarihi < new Date()-oyun.siyahsure) || (oyun.o=='b' && oyun.oyuntarihi < new Date()-oyun.beyazsure)){
                //console.log('...oyun siliniyor...');
                if (oyun.hamlesayisi>4){
                   var bitenoyun = new BitenOyunlar({oyuncubeyaz:oyun.oyuncubeyaz, beyazpuani:oyun.beyazpuani, oyuncusiyah:oyun.oyuncusiyah,
                                       siyahpuani:oyun.siyahpuani, oyuntarihi:oyun.oyuntarihi, oyuntipi:oyun.oyuntipi, hamleler:oyun.hamleler,
                                       hamlesayisi:oyun.hamlesayisi, kazanan:'y', neden:'off'});
                   bitenoyun.save(function(err){
                      if (err) console.log(err); 
                      Oturumlar.findOne({kullanici: bitenoyun.oyuncubeyaz},function(beyaz){
                             if (beyaz){
                                 beyaz.konum='';
                                 beyaz.konumid='';
                                 beyaz.save(function(err){
                                    if (err) console.log(err); 
                                 });
                             };
                      });
                      //console.log(bitenoyun.oyuncusiyah);
                      Oturumlar.findOne({kullanici:bitenoyun.oyuncusiyah},function(siyah){
                             if (siyah){
                                 siyah.konum='';
                                 siyah.konumid='';
                                 siyah.save(function(err){
                                    if (err) console.log(err); 
                                 });
                             };
                      });
                      oyun.remove({},function(err,numrem){
                         //console.log(bitenoyun.oyuncubeyaz);
                         
                      });
                   });                                  
                } else
                oyun.remove({},function(err,numrem){
                    Oturumlar.findOne({kullanici:oyun.oyuncubeyaz},function(oturum){
                        if (oturum){
                            oturum.konum='';
                            oturum.konumid='';
                            oturum.save(function(err){
                               if (err) console.log(err); 
                            });
                        };
                    });
                    Oturumlar.findOne({kullanici:oyun.oyuncusiyah},function(oturum){
                        if (oturum){
                            oturum.konum='i';
                            oturum.konumid='';
                            oturum.save(function(err){
                               if (err) console.log(err); 
                            });
                        };
                    });
                });
            }; 
         });
     };
  });
  
  AdayOyunlar.remove({oyunTarihi:{$lt:(new Date()-30000)}}, function(err, numRemoved){ // 30 saniye
     if (err) console.log(err);
     //console.log('eski adayoyunları sil:'+numRemoved);
  });
  done();
});

gorev.on('ready', function() {
  gorev.cancel({},function(err, numRemoved) {
      if (err) console.log(err);
      //console.log(numRemoved+' adet görev silindi');
  });
  AdayOyunlar.remove({},function(err){
     if (err) console.log(err);
  });
  
  gorev.every('3 seconds', 'biten_oyun');

  gorev.start();
});


app.configure(function() {
	app.use(express.static(__dirname + '/public'));
    app.set('views', __dirname + '/views');
	app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
    app.use( express.cookieParser());
    app.use(express.session({ 
        secret: 'erselanahtarseyit', 
        resave: false, 
        saveUninitialized: false
    }));
});


app.get('/', function(req, res){
    Oturumlar.findOne({oturum: req.session.id}, function(err, oturum){
       if (!oturum) {
          res.redirect('/giris');
       } else 
       {
          res.render('index');
       };
    });
});


app.get('/giris', function(req, res) { 
    Oturumlar.findOne({oturum: req.session.id}, function(err, oturum){
       if (!oturum) {
          res.render('giris');
       } else 
       {
         res.redirect('/');
       };
    });
})

app.post('/giris/:eposta/:sifre',function(req,res) {
    Kullanicilar.findOne({eposta: req.params.eposta,sifre:req.params.sifre}, function(err, hesap){
       if (hesap) {
          Oturumlar.findOne({kullanici: hesap.kullanici}, function(err, oturum){
                if (oturum) {        
                    //console.log('app.pos(giris) oturum güncellendi');
                    if (oturum.oturum != req.session.id)
                        app.io.sockets.socket(oturum.soket).emit('cikis');   
                    oturum.oturum = req.session.id;
                    oturum.tarih = Date.now();
                    oturum.save(function(err){
                        if (err) console.log(err);
                    });
                    res.render('index',{mt:oturum.masatipi, tt:oturum.tastipi});
                } else {
                    var yeniOturum = new Oturumlar({kullanici: hesap.kullanici, oturum: req.session.id, ulke:hesap.ulke, masatipi:0,tastipi:0});
                    yeniOturum.save(function(err){
                        if (err) console.log(err);
                    });
                    res.render('index');
                };
                 
            });
       }
       else 
          res.send(false);
    });
});



app.get('/pgn/:oyun', function(req, res) { 
    Oturumlar.findOne({oturum: req.session.id}, function(err, oturum){
       if (oturum) {
          //console.log('apt.get(pgn) oturum bulundu'); 
          Oyunlar.findOne(req.params.oyun, function(err, oyun){
              if (oyun){
                  //console.log('apt.get(pgn) oyun bulundu');
                  res.setHeader('Content-disposition', 'attachment; filename='+oyun.oyuncuBeyaz+'_'+oyun.oyuncuSiyah+'.pgn');
                  res.setHeader('Content-type', 'text/plain');
                  res.charset = 'UTF-8';
                  var notasyon="";
                  var j = 0;
                  for(var i=1;i<=oyun.san.length;i++){
                      if ((i % 2) != 0) {
                          j++;
                          notasyon = notasyon + j +'.'+oyun.san[i-1]+' ';
                      } else {
                          notasyon = notasyon +oyun.san[i-1]+' ';
                      }
                         
                  }
                  res.write(notasyon);
                  res.end();
              } else
                    res.end();              
          });
       } else
         res.redirect('/giris'); 
    });
})

app.post('/kayit/:kullanici/:eposta/:sifre/:ulke',function(req,res) {
    Kullanicilar.findOne({kullanici: req.params.kullanici}, function(err, hesap){
        if (!hesap) 
            Kullanicilar.findOne({eposta: req.params.eposta}, function(err, hesap){
                if (!hesap){
                    var yeniKullanici = new Kullanicilar({kullanici: req.params.kullanici, 
                                                          eposta: req.params.eposta, sifre:req.params.sifre, ulke:req.params.ulke});
                    yeniKullanici.save(function(err){
                        if (err) {
                            res.send('kayit_hatasi'); 
                        } else {
                            res.send('basarili');  
                        };
                    });
                } else res.send('eposta_kayitli');
            });
        else
            res.send('kullanici_kayitli');
    });    
});

app.get('/kayit', function(req, res) { 
    Oturumlar.findOne({oturum: req.session.id}, function(err, oturum){
       if (!oturum) {
          res.render('kayit');
       } else 
       {
         res.redirect('/');
       };
    });
})

app.get('*', function(req, res){
    res.redirect('/');
});


app.io.route('hesap_kontrol', function(hesap){
    Kullanicilar.findOne({kullanici: hesap.data}, function(err, kayit){
        if (kayit) hesap.io.emit('hesap_var');   
    });
});

app.io.route('eposta_kontrol', function(hesap){
    Kullanicilar.findOne({eposta: hesap.data}, function(err, kayit){
        if (kayit) hesap.io.emit('eposta_var');   
    });
});

app.io.route('oyunkur', function(kriterler){
    Oturumlar.findOne({oturum: kriterler.session.id, soket:kriterler.socket.id}, function(err, oturum){
        if (oturum){
            if (oturum.soket != kriterler.socket.id) { 
                kriterler.io.emit('baska_oturum_var');
                return;
            } else {
                AdayOyunlar.findOne({kullanici:oturum.kullanici}, function(err, adayoyun){
                   if (adayoyun) {
                       adayoyun.soket=kriterler.socket.id;
                       adayoyun.oyuntipi=kriterler.data.oyuntipi;
                       adayoyun.oyunrengi=kriterler.data.oyunrengi;
                       adayoyun.oyunmin=kriterler.data.oyunmin;
                       adayoyun.oyunmax=kriterler.data.oyunmax;
                       adayoyun.save(function(err){
                          if (err) console.log(err);
                       });      
                   } else
                   {
                       var adayOyun = new AdayOyunlar({kullanici:oturum.kullanici, soket: kriterler.socket.id, puani:oturum.puani,
                                                       ulke:oturum.ulke, oyuntipi:kriterler.data.oyuntipi,oyunrengi:kriterler.data.oyunrengi,
                                                       oyunmin:kriterler.data.oyunmin,oyunmax:kriterler.data.oyunmax});
                       adayOyun.save(function(err){
                          if (err) console.log(err);
                       });
                   };
                });
            };
        } else kriterler.io.emit('baska_oturum_var');
    });
});


app.io.route('oyunoyna', function(kriterler){
    Oturumlar.findOne({oturum: kriterler.session.id, soket:kriterler.socket.id}, function(err, kayit){
        if (kayit){
            if (kayit.soket != kriterler.socket.id) { 
                kriterler.io.emit('baska_oturum_var');
                return;
            } else {
                AdayOyunlar.findOne({kullanici: kriterler.data.oyuncu,oyuntipi: kriterler.data.oyuntipi}, function(err, adayoyun){
                    if (adayoyun){
                        var oyunSuresi = adayoyun.oyuntipi.substr(0,adayoyun.oyuntipi.indexOf('|'));
                        oyunSuresi=oyunSuresi*60000;
                        var oyunOffSuresi = 180000;
                        if (oyunSuresi < 180000) oyunOffSuresi = 60000;  
                        var oyunTempo = adayoyun.oyuntipi.substr(adayoyun.oyuntipi.indexOf('|')+1);
                        var beyaz = '';
                        var siyah = '';
                        var beyazpuani = '';
                        var siyahpuani = '';
                        var beyazbayrak = '';
                        var siyahbayrak = '';
                        
                        if (kriterler.data.oyunrengi == 'b') {
                            beyaz=kayit.kullanici;
                            siyah=adayoyun.kullanici;
                            beyazpuani=kayit.puani;
                            siyahpuani=adayoyun.puani;
                            beyazbayrak=kayit.ulke;
                            siyahbayrak=adayoyun.ulke;
                        }
                        else if (kriterler.data.oyunrengi == 's') {
                            siyah=kayit.kullanici;
                            beyaz=adayoyun.kullanici;
                            siyahpuani=kayit.puani;
                            beyazpuani=adayoyun.puani;
                            siyahbayrak=kayit.ulke;
                            beyazbayrak=adayoyun.ulke;
                        } else if (kriterler.data.oyunrengi == 'r') {
                            if (adayoyun.oyunrengi=='b'){
                                beyaz=adayoyun.kullanici;
                                siyah=kayit.kullanici;
                                siyahpuani=kayit.puani;
                                beyazpuani=adayoyun.puani;
                                siyahbayrak=kayit.ulke;
                                beyazbayrak=adayoyun.ulke;
                            } else if (adayoyun.oyunrengi=='s'){
                                siyah=kayit.kullanici;
                                beyaz=adayoyun.kullanici;
                                siyahpuani=kayit.puani;
                                beyazpuani=adayoyun.puani;
                                beyazbayrak=adayoyun.ulke;
                                siyahbayrak=kayit.ulke;
                            } else {
                                var rand=Math.floor(Math.random()*2);
                                if (rand==0){
                                    beyaz=kayit.kullanici;
                                    siyah=adayoyun.kullanici;
                                    beyazpuani=kayit.puani;
                                    siyahpuani=adayoyun.puani;
                                    beyazbayrak=kayit.ulke;
                                    siyahbayrak=adayoyun.ulke;
                                } else {
                                    siyah=kayit.kullanici;
                                    beyaz=adayoyun.kullanici;
                                    siyahpuani=kayit.puani;
                                    beyazpuani=adayoyun.puani;
                                    siyahbayrak=kayit.ulke;
                                    beyazbayrak=adayoyun.ulke;
                                };
                            };
                        };
                        var yeniOyun = new Oyunlar({oyuncubeyaz:beyaz, beyazpuani: beyazpuani, beyazbayrak: beyazbayrak, 
                                                    oyuncusiyah:siyah, siyahpuani: siyahpuani, siyahbayrak: siyahbayrak,
                                                    beyazoffsure:oyunOffSuresi, siyahoffsure:oyunOffSuresi, 
                                                    oyuntipi: adayoyun.oyuntipi ,beyazsure:oyunSuresi, siyahsure:oyunSuresi, o:'b', durum:'s'});
                        yeniOyun.save(function(err){
                            if (err) console.log(err);
                        });
                        kayit.konum='o';
                        kayit.konumid=yeniOyun._id;
                        kayit.save(function(err){
                            if (err) console.log(err);
                        });
                        Oturumlar.findOne({kullanici:adayoyun.kullanici},function(err,rakip){
                            if (rakip){
                                rakip.konum='o';
                                rakip.konumid=yeniOyun._id;
                                rakip.save(function(err){
                                   if (err) console.log(err);
                                });
                            }
                        })
                        app.io.sockets.socket(adayoyun.soket).join(yeniOyun._id);
                        app.io.sockets.socket(kayit.soket).join(yeniOyun._id);

                        var param={};
                        param.id=yeniOyun._id;
                        param.beyaz=beyaz;
                        param.beyazpuani=beyazpuani;
                        param.beyazbayrak=beyazbayrak;
                        param.siyah=siyah;
                        param.siyahpuani=siyahpuani;
                        param.siyahbayrak=siyahbayrak;
                        param.beyazsure=yeniOyun.beyazsure;
                        param.siyahsure=yeniOyun.siyahsure;
                        param.beyazoffsure=yeniOyun.beyazoffsure;
                        param.siyahoffsure=yeniOyun.siyahoffsure;
                        param.tempo=oyunTempo;
                        param.oynamasirasi=yeniOyun.oynamasirasi;

                        if (beyaz==kayit.kullanici){
                            param.taraf='b';
                            param.bmt=0;
                            param.btt=0;
                            app.io.sockets.socket(kayit.soket).emit('oyuna_girildi', param);
                            param.taraf='s';
                            param.smt=0;
                            param.stt=0;
                            app.io.sockets.socket(adayoyun.soket).emit('oyuna_girildi', param);
                        }
                        else {
                            param.taraf='s';
                            param.smt=0;
                            param.stt=0;
                            app.io.sockets.socket(kayit.soket).emit('oyuna_girildi', param);
                            param.taraf='b';
                            param.bmt=0;
                            param.btt=0;
                            app.io.sockets.socket(adayoyun.soket).emit('oyuna_girildi', param);
                        };
                            
                        //app.io.room(yeniOyun._id).broadcast('root',param);
                        
                        AdayOyunlar.remove({kullanici: adayoyun.kullanici},function(err){
                           if (err) console.log(err);
                        });
                        AdayOyunlar.remove({kullanici: kayit.kullanici},function(err){
                           if (err) console.log(err);
                        });
                        
                    };
                }).sort({oyunTarihi:1});
            };    
        } else kriterler.io.emit('baska_oturum_var');
    });
});


app.io.route('oyunlar', function(kriterler){
    Oturumlar.findOne({oturum: kriterler.session.id, soket:kriterler.socket.id}, function(err, kayit){
        if (kayit){
            if (kayit.soket != kriterler.socket.id) { 
                kriterler.io.emit('baska_oturum_var');
                return;
            } else {       
                if (kriterler.data.oyunrengi=='b' || kriterler.data.oyunrengi=='s'){
                    AdayOyunlar.find({oyuntipi: kriterler.data.oyuntipi, oyunrengi:{$ne:kriterler.data.oyunrengi} },'ulke kullanici puani', 
                        function(err, oyunlar){
                            kriterler.io.emit('oyunlar', oyunlar);
                        }).sort({oyunTarihi:1}).limit(5);
                }
                else { 
                    AdayOyunlar.find({oyuntipi: kriterler.data.oyuntipi,kullanici:{$ne:kayit.kullanici}},'ulke kullanici puani', 
                        function(err, oyunlar){
                            kriterler.io.emit('oyunlar', oyunlar);
                        }).sort({oyunTarihi:1}).limit(5);
                    };
            };
        } else kriterler.io.emit('baska_oturum_var');
    });
});

app.io.route('verabi',function(data){
   Captcha.count().exec(function(err, count){

      var random = Math.floor(Math.random() * count);

      Captcha.findOne().skip(random).exec(
         function (err, result) {
            data.io.emit('alabi',result.baslangic); 
      });
   }); 
});

app.io.route('tasyaz', function(ind){
    Oturumlar.findOne({oturum: ind.session.id}, function(err, oturum){
       if (oturum) 
       { 
          oturum.tastipi=ind.data;
          oturum.save(function(err){
             if (err) console.log(err);
          });
       };                
    }); 
});

app.io.route('masayaz', function(ind){
    Oturumlar.findOne({oturum: ind.session.id}, function(err, oturum){
       if (oturum) 
       { 
          oturum.masatipi=ind.data;
          oturum.save(function(err){
             if (err) console.log(err);
          });
       };                
    }); 
});

app.io.route('hamleler', function(hamle){
    //console.log('id:'+hamle.data.id+', hamle:'+hamle.data.h+', sure:'+hamle.data.s+', gönderen:'+hamle.data.o);
    Oturumlar.findOne({oturum: hamle.session.id, soket:hamle.socket.id}, function(err, kayit){
        if (kayit){
            if (kayit.soket != hamle.socket.id) { 
                hamle.io.emit('baska_oturum_var');
                return;
            } else{       
                Oyunlar.findById(hamle.data.id, function(err,oyun){
                   if (oyun){
                       if (hamle.data.o=='w'){
                          var hamleno = oyun.hamleler.split('.').length.toString();
                          if (hamle.data.s>0)
                              oyun.beyazsure=hamle.data.s;
                          else
                              oyun.beyazsure=0;
                          oyun.hamleler=oyun.hamleler+hamleno+'.'+hamle.data.h;
                          if (oyun.konumlar=='')
                             oyun.konumlar=oyun.konumlar+hamle.data.f;
                          else
                             oyun.konumlar=oyun.konumlar+','+hamle.data.f;
                       }else{
                          if (hamle.data.s>0)
                             oyun.siyahsure=hamle.data.s;
                          else
                             oyun.siyahsure=0;
                          oyun.hamleler=oyun.hamleler+' '+hamle.data.h+' ';
                          if (oyun.konumlar=='')
                             oyun.konumlar=oyun.konumlar+hamle.data.f;
                          else
                             oyun.konumlar=oyun.konumlar+','+hamle.data.f;
                       };
                       oyun.berabere='';
                       oyun.oyuntarihi=Date.now();
                       oyun.o=hamle.data.o;   
                       oyun.hamlesayisi=oyun.hamlesayisi+1;
                       oyun.save(function(err){
                          if (err) console.log(err);
                          if (hamle.data.o=='w')
                              app.io.room(hamle.data.id).broadcast('hamleler',
                              {'h': hamle.data.h,'f':hamle.data.f,'o':hamle.data.o,'s':hamle.data.s,'rs':oyun.siyahsure});
                          else    
                              app.io.room(hamle.data.id).broadcast('hamleler',
                              {'h': hamle.data.h,'f':hamle.data.f,'o':hamle.data.o,'s':hamle.data.s,'rs':oyun.beyazsure});
                       }); 
                   };    
                });
            };
        } else hamle.io.emit('baska_oturum_var');
    });
});

app.io.route('berabere', function(veri){
    Oturumlar.findOne({oturum: veri.session.id, soket:veri.socket.id}, function(err, kayit){
        if (kayit){
            if (kayit.soket != veri.socket.id) { 
                veri.io.emit('baska_oturum_var');
                return;
            } else
            {       
                Oyunlar.findById(veri.data.id, function(err,oyun){
                   if (oyun){
                       console.log('beraberlik status:'+oyun.berabere);
                       console.log('gönderen:'+veri.data.o);
                       
                       // beraberlik onayı ise
                       if ((veri.data.o=='w') && (oyun.berabere=='b') || (veri.data.o=='b') && (oyun.berabere=='w')){
                          console.log('beraberlik onaylandı');
                       } else
                       // beraberlik teklifi ise
                       {
                           if (oyun.berabere !== veri.data.o){
                               oyun.berabere=veri.data.o;
                               oyun.save(function(err){
                                  if (err) console.log(err);
                                  app.io.room(veri.data.id).broadcast('berabere');
                                  console.log('beraberlik teklifi');
                               });
                           };
                       };
                   };
                });
            };
        };
    });
});

app.io.route('oyunbitti', function(veri){
    console.log('id:'+veri.data.id+', neden:'+veri.data.n+', gönderen:'+veri.data.g+'kazanan:'+veri.data.k);
    Oturumlar.findOne({oturum: veri.session.id, soket:veri.socket.id}, function(err, kayit){
        if (kayit){
            if (kayit.soket != veri.socket.id) { 
                veri.io.emit('baska_oturum_var');
                return;
            } else{       
                Oyunlar.findById(veri.data.id, function(err,oyun){
                   if (oyun){
                       // gönderen beyaz ise
                       if (veri.data.o=='w'){
                          
                       }
                       // gönderen siyah ise
                       else 
                       {
                          
                       };
                       oyun.oyuntarihi=Date.now();
                       //oyun.o=veri.data.o;
                       // biten oyunlara kopyala, sonra oyunu sil   
                       oyun.save(function(err){
                          if (err) console.log(err);
                          
                          app.io.room(veri.data.id).broadcast('oyunbitti',
                              {'n': veri.data.n});
                       }); 
                   };    
                });
            };
        } else veri.io.emit('baska_oturum_var');
    });
});
  
app.io.on('connection', function(socket){
    Oturumlar.findOne({oturum: socket.handshake.session.id}, function(err, oturum){
       if (oturum) 
       { 
          oturum.soket=socket.id;
          oturum.save(function(err){
             bagli=bagli+1;
 
             if (oturum.konum=='o'){ // oyuncu
                 Oyunlar.findById(oturum.konumid, function(err,oyun){
                    if (oyun){
                       var beyazoffsure, beyazsure, 
                           siyahoffsure, siyahsure, renk;
                       if (oyun.oyuncubeyaz==oturum.kullanici)
                       { 
                           oyun.bos='on';
                           renk='w';
                       }
                       if (oyun.oyuncusiyah==oturum.kullanici)
                            {
                                oyun.sos='on';
                                renk='b';
                            }
                            
                       if (oyun.o=='w'){
                                siyahoffsure=oyun.siyahoffsure-(Date.now()-oyun.siyahofftarihi);
                                if (siyahoffsure<0) siyahoffsure=0;
                                siyahsure=oyun.siyahsure-(Date.now()-oyun.oyuntarihi);
                                if (siyahsure<0) siyahsure=0;
                                oyun.siyahoffsure=siyahoffsure;
                                beyazsure=oyun.beyazsure;
                                beyazoffsure=oyun.beyazoffsure;
                            }
                       if (oyun.o=='b'){
                                beyazoffsure=oyun.beyazoffsure-(Date.now()-oyun.beyazofftarihi);
                                if (beyazoffsure<0) beyazoffsure=0;
                                beyazsure=oyun.beyazsure-(Date.now()-oyun.oyuntarihi);
                                if (beyazsure<0) beyazsure=0;
                                oyun.beyazoffsure=beyazoffsure;
                                siyahsure=oyun.siyahsure;
                                siyahoffsure=oyun.siyahoffsure;
                       }
                       oyun.save(function(err){
                            app.io.sockets.socket(socket.id).join(oturum.konumid);
                            console.log('konum oyun.o:'+oyun.o+' ,renk:'+renk);
                            if (oyun.o!=renk){ 
                                app.io.sockets.socket(oturum.soket).emit('konum',
                                          {'ok':oturum.konum,'r':renk,'id':oturum.konumid, 'bo':oyun.oyuncubeyaz,'bp':oyun.beyazpuani, 'bb':oyun.beyazbayrak, 'bs':beyazsure,
                                                                'boff':beyazoffsure, 'bos':oyun.bos,
                                                    'so':oyun.oyuncusiyah,'sp':oyun.siyahpuani, 'sb':oyun.siyahbayrak, 'ss':siyahsure,
                                                                'soff':siyahoffsure, 'sos':oyun.sos,
                                                    'h':oyun.hamleler, 'k':oyun.konumlar,'ot':oyun.oyuntipi,'mt':oturum.masatipi,
                                                    'tt':oturum.tastipi, 'ber':oyun.berabere, 'd':oyun.durum                      
                                   });
                                   app.io.room(oturum.konumid).broadcast('baglandi',
                                       {'r':renk, 'os':beyazoffsure, 's':beyazsure});
                               }  else {
                                  app.io.room(oturum.konumid).broadcast('baglandi',
                                       {'r':renk, 'os':beyazoffsure, 's':beyazsure});
                                  app.io.sockets.socket(oturum.soket).emit('konum',
                                          {'ok':oturum.konum,'r':renk,'id':oturum.konumid,'bo':oyun.oyuncubeyaz,'bp':oyun.beyazpuani, 'bb':oyun.beyazbayrak, 'bs':beyazsure,
                                                                'boff':beyazoffsure, 'bos':oyun.bos,
                                                    'so':oyun.oyuncusiyah,'sp':oyun.siyahpuani, 'sb':oyun.siyahbayrak, 'ss':siyahsure,
                                                                'soff':siyahoffsure, 'sos':oyun.sos,
                                                    'h':oyun.hamleler, 'k':oyun.konumlar,'ot':oyun.oyuntipi,'mt':oturum.masatipi,
                                                    'tt':oturum.tastipi, 'ber':oyun.berabere, 'd':oyun.durum                      
                                   });      
                               };
                            }); 
                            
                        } else
                        {
                            console.log('konum oyun, ama oyun yok');
                            app.io.sockets.socket(socket.id).emit('onayar',{'mt':oturum.masatipi,'tt':oturum.tastipi});           
                        };
                    });
             } else {
                 console.log('konum yok, sadece ayarları gönder');
                 app.io.sockets.socket(socket.id).emit('onayar',{'mt':oturum.masatipi,'tt':oturum.tastipi});
             }
          });
       };                
});
socket.on('disconnect',function(){
        Oturumlar.findOne({soket: socket.id}, function(err, oturum){
            if (oturum) 
            {
                oturum.soket='';
                oturum.save(function(err){
                   bagli=bagli-1;
 
                   if (oturum.konum=='o'){
                       Oyunlar.findById(oturum.konumid, function(err,oyun){
                          if (oyun){
                              var sure, offsure, renk;
                              if (oyun.oyuncubeyaz==oturum.kullanici) 
                              {
                                  oyun.bos='off';
                                  offsure=oyun.beyazoffsure;
                                  sure=oyun.beyazsure;
                                  oyun.beyazofftarihi=Date.now();
                                  renk='w';
                              }
                              if (oyun.oyuncusiyah==oturum.kullanici)
                              {
                                  oyun.sos='off';
                                  offsure=oyun.siyahoffsure;
                                  sure=oyun.siyahsure;
                                  oyun.siyahofftarihi=Date.now();
                                  renk='b';
                              }
                              oyun.save(function(err){
                                   app.io.room(oturum.konumid).broadcast('koptu',
                                       {'r':renk,'s':sure, 'os':offsure}); 
                              }); 
                          };
                       });
                   }; 
                });
            };
        });
    }); 
});

Oturumlar.count({},function(err,count){
   kayitli=count;
   console.log('kayıtlı:'+kayitli); 
});
Oturumlar.find({soket:{$ne:''}}).count(function(err,count){
   bagli=count;
   console.log('bağlı:'+bagli); 
});


app.listen(3000, function(){
  console.log('port:3000 dinlemede');
});

