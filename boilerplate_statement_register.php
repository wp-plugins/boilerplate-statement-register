<?php
/*
Plugin Name: Boilerplate Statement Register
Plugin URI: 
Description: You have to register the frequently used words and sentences as boilerplate, it is available in the HTML editor on, easy-to-use plug-in very simple.
Author: Teruo Morimoto
Author URI: http://stepxstep.net/
Version: 1.0.0
*/

/*  Copyright 2015 Teruo Mormoto (email : terusun at gmail.com)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License, version 2, as
	published by the Free Software Foundation.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/


/* 
 * 編集用エディターへのボタン追加
 */
add_action('admin_print_footer_scripts',  'init_boilerplate_statement_register');
function init_boilerplate_statement_register() {
    
?>
    <script type="text/javascript">
        QTags.addButton( 'boilerplate_statement_register_id', '定型文', boilerplate_statement_register_callback );
    </script>
<?php
}

// 管理メニュー初期設定にフック
//add_action('admin_head', 'boilerplate_statement_register_myplugin_admin_menu');
add_action('admin_print_scripts', 'boilerplate_statement_register_myplugin_admin_menu');
function boilerplate_statement_register_myplugin_admin_menu() {
    wp_register_script( 'jquery_core_js', 'http://code.jquery.com/ui/1.10.3/jquery-ui.js', false );
    wp_register_script( 'boilerplate_statement_register_js', plugins_url('js/boilerplate_statement_register.js', __FILE__), false );
	wp_enqueue_script('jquery_core_js');
    wp_enqueue_script('boilerplate_statement_register_js');
}
                                
// 管理メニュー初期設定にフック
add_action('admin_print_styles', 'boilerplate_statement_register_myplugin_admin_menu_css');
function boilerplate_statement_register_myplugin_admin_menu_css() {
    wp_register_style( 'boilerplate_statement_register_css', plugins_url('css/boilerplate_statement_register.css', __FILE__) );
    wp_register_style( 'jquery_core_css', 'http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css' );
    wp_enqueue_style('boilerplate_statement_register_css');
    wp_enqueue_style('jquery_core_css');
}

/* 
 * JavaScriptからの登録済み定型文取得用ajax処理
 */
add_action('wp_ajax_boilerplate_statement_register_get_option', 'boilerplate_statement_register_get_option');
function boilerplate_statement_register_get_option(){
    $figurestr = get_option('boilerplate_statement_register_figures','');
    
   
    $figures = json_decode($figurestr);
    
    header('Content-Type: application/json charset=utf-8');
    echo json_encode($figures);
    die();
    
}

/* 
 * JavaScriptからの定型文更新用ajax処理
 */
add_action('wp_ajax_boilerplate_statement_register_update_option', 'boilerplate_statement_register_update_option');
function boilerplate_statement_register_update_option(){
    try{
//        $figures = [];
        $figures = array('figures'=>'');
        
        if( isset($_POST['figure']) ){
            $updatefigures = sanitize_text_field($_POST['figure']);

            //すべて削除されたとき
            if( $updatefigures === '' ){
                update_option('boilerplate_statement_register_figures',null);
            }
            else{
                $figurestrs = explode(',',$updatefigures);

                $figures['figures'] = $figurestrs;

                $figurestr = json_encode($figures);
                
                update_option('boilerplate_statement_register_figures',$figurestr);
            }
        }
    }
    catch( Exception $e ){
        header("HTTP/1.1 500 Internal Server Error");
        $msg = $e->getMessage();
        echo $msg;
        die();
    }
   
    header('Content-Type: application/json charset=utf-8');
    echo json_encode($figures);
    die();
    
}

?>
