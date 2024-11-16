
var diller = ['tr', 'en', 'bg'];
var bayraklar = ['tr', 'en', 'bg'];
var dilKodu = '';
var langJS = null;
var flagJS = null;


var cevir = function (cevirilecek)
{	
	langJS=cevirilecek;
	$("[dilsoz]").each (function (index)
	{
		var strTr = cevirilecek [$(this).attr ('dilsoz')];
	    $(this).append(strTr);
	});
	$("#tastipi").html(cevirilecek[$("#tastipi").html()]);
}


dilKodu = window.navigator.language.substr (0, 2);


if ($.inArray(dilKodu,diller)>-1){
	$.getJSON('js/diller/'+dilKodu+'.json', cevir);
}
else{
	$.getJSON('js/diller/tr.json', cevir);
}

var ulkeler = function(getir){
    flagJS=getir;
    if ($('#rakipflag').length>0)
        $('#rakipflag').prop('title', getir[$("#rakipflag").attr('class').replace('flag ','')]);
    if ($('#yerelflag').length>0)    
        $('#yerelflag').prop('title', getir[$("#yerelflag").attr('class').replace('flag ','')]);
          
    if ($('#ulkesec').length>0){
        console.log(getir);
        $('#ulkesec').html('');
        $.each( getir, function( key, val ) {
            $('#ulkesec').append('<option id="'+key+'">'+val+'</option>');
        });
    }
}
if ($.inArray(dilKodu,bayraklar)>-1){
	$.getJSON('js/diller/ulke_'+dilKodu+'.json',ulkeler);
}
else{
	$.getJSON('js/diller/ulke_en.json',ulkeler);
}


