<?php

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://moe.fm/listen/playlist?perpage=5");
//curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HEADER, false);
curl_setopt($ch, CURLOPT_POST, true);
// yOU cOULD aLSO uSE tHE mOE123 aPI, bUT mY sERVER iS nOT vERY gOOD...
// 你也可以用萌导航的API，不过服务质量不咋地，拖垮了要你赔哟！
// www.moe123.com/api/moefm_music_list/
// www.moe123.com/api/moefm_music_rand_list/
curl_setopt($ch, CURLOPT_POSTFIELDS, array(
	'api_key' 	=> "PUT_YOUR_MOEFM_SE3RET_HERE",
	'api'		=> 'json'
));
$ce = curl_exec($ch);
curl_close($ch); 