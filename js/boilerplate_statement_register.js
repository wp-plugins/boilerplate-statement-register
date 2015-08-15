/* 
 * boilerplate statement register 用　JavaScript
 * Created on : 2015/05/03, 23:12:07
 * Author     : teru
 */

var boilerplate_statement_register_canvas;
var boilerplate_statement_register_figures = new Array();
var boilerplate_statement_register_del_flg = 0;

/* 
 * 初期化処理
 */
jQuery(function($){
    
    //定型分選択ダイアログ生成
    var str = '<div id="boilerplate_statement_register_dialog" title="定型文選択">';
    str = str + '<div id="boilerplate_statement_register_list"></div>';
    str = str + '<textarea rows="10" id="boilerplate_statement_register_reg"></textarea>';
    str = str + '<button type="button" id="boilerplate_statement_register_reg_button">定型文を登録する</button>'
    str = str + '</div>';

    $( "#poststuff" ).append(str);

    //定型分選択ダイアログ設定
    $( "#boilerplate_statement_register_dialog" ).dialog({
        autoOpen: false,
        modal: true,
        open: function( event, ui ) {
            //登録済み定型文取得
            boilerplate_statement_register_get_figures();
            
            boilerplate_statement_register_get_selectedstr();
        },
        buttons: {
            close: function(){
                jQuery( this ).dialog( "close" );
            }
        },
        close:function( event, ui ){
            if( boilerplate_statement_register_del_flg == 1){
                boilerplate_statement_register_update_figures(boilerplate_statement_register_get_update_figures());
                boilerplate_statement_register_del_flg = 0;
            }
        }
    });
    
    //定型文更新用処理登録
    jQuery("#boilerplate_statement_register_reg_button").click(function(){
        figure = boilerplate_statement_register_escapeHTML2(jQuery("#boilerplate_statement_register_reg").val());
        if( figure === ''){
            alert('登録する定型文がありません。');
        }
        else{
            var regstr = boilerplate_statement_register_get_update_figures();
            if( regstr === ''){
                boilerplate_statement_register_update_figures(figure);
            }
            else{
                boilerplate_statement_register_update_figures(figure + "," + regstr);
            }
        }
    });
    
    //定型文ダイアログクローズ時処理登録
/*    
    $( "#boilerplate_statement_register_dialog" ).on( "dialogclose", function( event, ui ) {
        if( boilerplate_statement_register_del_flg == 1){
            boilerplate_statement_register_update_figures(boilerplate_statement_register_get_update_figures());
            boilerplate_statement_register_del_flg = 0;
        }
    } );
*/
    
});


/* 
 * 「定型文ボタン」クリック時処理
 */
function boilerplate_statement_register_callback(button, element, c, ed)
{
    boilerplate_statement_register_canvas = c.canvas;
    //定型文編集ダイアログオープン
    jQuery("#boilerplate_statement_register_dialog").dialog("open");


}

/* 
 * サーバーからの定型文エスケープ処理
 */
function boilerplate_statement_register_get_update_figures(){
    var childs = jQuery("#boilerplate_statement_register_list").children(".boilerplate_statement_register_figure");
    var str="";
    for( var i=0; i<childs.length; i++ ){
        if( str != ""){
            str = str + ",";
        }
        str = str + childs[i].innerHTML;
    }
    
    return( str );
}


/* 
 * サーバーからの定型文取得処理
 */
function boilerplate_statement_register_get_figures(){
    
    var posturl ="admin-ajax.php";

    jQuery.ajax({ 
        async: false,
        data: {"action":"boilerplate_statement_register_get_option"},
        url: posturl,
        type:'POST',
        dataType: 'json',
        success: function(data) {
            boilerplate_statement_register_figures = data;
            //登録済み定型文表示
            boilerplate_statement_register_draw_list();

        },
        error:  function(XMLHttpRequest, textStatus, errorThrown) {
            alert(textStatus+":"+XMLHttpRequest.responseText);
        }
    });
}

/* 
 * 登録済み定型文リストの表示
 */
function boilerplate_statement_register_draw_list(){
    
    jQuery("#boilerplate_statement_register_list").empty();
    
    var str = "";
    
    if( boilerplate_statement_register_figures === null  ){
        str = '<p>まだ、選択可能な定型文がありません。</p>'
        jQuery("#boilerplate_statement_register_list").append(str);
    }
    else{
        var figures = boilerplate_statement_register_figures['figures'];
        for(var i=0; i<figures.length; i++ ){
            jQuery("#boilerplate_statement_register_list").append(boilerplate_statement_register_draw_one_figure(i,figures[i]));
        }
    }
    
    //クリック時の反映処理登録
    jQuery(".boilerplate_statement_register_figure").click(function(){
        boilerplate_statement_register_set_canvas(this.innerText);
    })
    
    //ゴミ箱クリック時の削除処理登録
    jQuery(".boilerplate_statement_register_figure_delete").click(function(){
        var id = this.attributes["value"].value;
        var del_ele="#boilerplate_statement_register_figure-"+id;
        jQuery(del_ele).remove();
        this.parentNode.removeChild(this);
        boilerplate_statement_register_del_flg = 1;
        if( jQuery("#boilerplate_statement_register_list")[0].childNodes.length == 0){
            var str = '<p>まだ、選択可能な定型文がありません。</p>'
            jQuery("#boilerplate_statement_register_list").append(str);
        }
    });
    
}

/* 
 * 登録済み１定型文の表示
 */
function boilerplate_statement_register_draw_one_figure( id, figure ){
    var str;
    
    figure = figure.replace(/\\'/g,"\'");
    figure = figure.replace(/\\"/g,'\"');
    
    str = "<div class='boilerplate_statement_register_figure' id='boilerplate_statement_register_figure-"+id+"'>"+figure+"</div>";
    
    if( boilerplate_statement_register_getBrawser() === 'ie' ){
        str = str + "<image class='boilerplate_statement_register_figure_delete' value='"+id+"' href='#' />";
    }
    else{
        str = str + "<div class='boilerplate_statement_register_figure_delete' value='"+id+"' >　</div>";
    }
    
    return str;
}

/* 
 * 定型文を編集エディターへ反映
 */
function boilerplate_statement_register_set_canvas(figurestr){
    var canvas = boilerplate_statement_register_canvas;
    var t = this, startPos, endPos, cursorPos, scrollTop, v = canvas.value, l, r, i, sel, endTag = v ? t.tagEnd : '';
    
    if ( document.selection ) { // IE
        canvas.focus();
        sel = document.selection.createRange();
        if ( sel.text.length > 0 ) {
            sel.text = sel.text + figurestr;
        } else {
            sel.text = t.tagStart;
        }
        canvas.focus();
    } else if ( canvas.selectionStart || canvas.selectionStart === 0 ) { // FF, WebKit, Opera
        startPos = canvas.selectionStart;
        endPos = canvas.selectionEnd;
        cursorPos = endPos;
        scrollTop = canvas.scrollTop;
        l = v.substring(0, startPos); // left of the selection
        r = v.substring(endPos, v.length); // right of the selection
        i = v.substring(startPos, endPos); // inside the selection

        if ( startPos !== endPos ) {
                canvas.value = l + i + figurestr + r; // insert self closing tags after the selection
                cursorPos += figurestr.length;
        } else {
                canvas.value = l + figurestr + r;
                cursorPos = startPos + figurestr.length;
        }

        canvas.selectionStart = cursorPos;
        canvas.selectionEnd = cursorPos;
        canvas.scrollTop = scrollTop;
        canvas.focus();
    } else { // other browsers?
        canvas.value += figurestr;
        canvas.focus();
    }
    
}

/* 
 * 編集エディターの選択文字列を登録用テキストエリアへ反映
 */
function boilerplate_statement_register_get_selectedstr(){
    var canvas = boilerplate_statement_register_canvas;
    var t = this, startPos, endPos, v = canvas.value, l, r, i, sel;

    startPos = canvas.selectionStart;
    endPos = canvas.selectionEnd;
    if( startPos !== endPos ){
        cursorPos = endPos;
        i = v.substring(startPos, endPos); // inside the selection
        jQuery("#boilerplate_statement_register_reg").val(i);
    }
    else{
        jQuery("#boilerplate_statement_register_reg").val("");
    }
    
}

/* 
 * サーバーに対する定型文の新規登録処理
 */
function boilerplate_statement_register_update_figures(figure){
    
    var posturl ="admin-ajax.php";

    var figures = figure;

    jQuery.ajax({ 
        async: false,
        data: {"action":"boilerplate_statement_register_update_option","figure":figures},
        url: posturl,
        type:'POST',
        dataType: 'json',
        success: function(data) {
            boilerplate_statement_register_figures = data;
            boilerplate_statement_register_draw_list();
            jQuery("#boilerplate_statement_register_reg").val("");

        },
        error:  function(XMLHttpRequest, textStatus, errorThrown) {
            alert(textStatus+":"+XMLHttpRequest.responseText);
        }
    });
}

function boilerplate_statement_register_escapeHTML2(html) {
  return jQuery('<div>').text(html).html();
}

function boilerplate_statement_register_getBrawser(){
    var userAgent = window.navigator.userAgent.toLowerCase();

    if (userAgent.indexOf('opera') != -1) {
      return 'opera';
    } else if (userAgent.indexOf("msie") != -1) {
        return 'ie';
    } else if (userAgent.indexOf('trident') != -1){
        return 'ie' //for ie11
    } else if (userAgent.indexOf('chrome') != -1) {
        return 'chrome';
    } else if (userAgent.indexOf('safari') != -1) {
        return 'safari';
    } else if (userAgent.indexOf('gecko') != -1) {
        return 'gecko';
    } else {
        return false;
    }
}