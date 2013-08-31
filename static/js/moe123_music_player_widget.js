/*
	Moefm-widget v0.1
	http://aka-rin.com/
	
	Copyright 2011, Octopus(akatako@aka-tako.com, Google+: +Tomomi Sawko)
	Licensed under the WTFPL Version 2 licenses.
	http://aka-rin.com/license
	
	********************************************
	
	jQuery JavaScript Library v1.7.2
	http://jquery.com/

	Copyright 2011, John Resig
	Dual licensed under the MIT or GPL Version 2 licenses.
	http://jquery.org/license
	
	********************************************
	
	jPlayer Plugin for jQuery JavaScript Library
	http://www.jplayer.org
	
	Copyright (c) 2009 - 2013 Happyworm Ltd
	Licensed under the MIT license.
	http://opensource.org/licenses/MIT
*/

var Player = {
	data: [],
	api_host: '',
	api_random_list: '',
	api_music_list: '',
	// Controls
	init_player: function (api_host, api_random_list, api_music_list) {
		Player.api_host = api_host;
		Player.api_random_list = api_random_list;
		Player.api_music_list = api_music_list;
		$("#moe123_music_player").jPlayer({
			ready: Player.on_player_ready,
			ended: Player.on_play_ended,
			loadstart: function (e) { Player.set_msg("开始链接音乐..."); },
			loadeddata: function (e) { Player.set_msg("音乐链接完成~"); },
			volume: 0.6,
			timeupdate: Player.on_player_timeupdate,
			swfPath: "static/js/jplayer/",
			supplied: "mp3", wmode: "window", smoothPlayBar: true, keyEnabled: true,
			cssSelectorAncestor: "",
			cssSelector: {
				play: "#moe123_music_player_play",
				pause: "#moe123_music_player_pause",
				mute: "#moe123_music_player_mute",
				unmute: "#moe123_music_player_unmute",
				currentTime: "#moe123_music_player_current_time",
				duration: "#moe123_music_player_duration"
			}
		});
	},
	get_random_int: function (min, max) 
	{
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	progressbar: function (percent, $element) 
	{
		var progressBarWidth = percent * $element.width() / 100;
		$element.find('div').css({ 'width': progressBarWidth + 'px' }, 500).html(percent + "%&nbsp;");
	},
	play: function (id) 
	{
		if (Player.data.length < 1) return;
		if (typeof id == "number") 
		{
			$("#moe123_music_player_back img").stop(true, true).fadeOut(function () {
				$("#moe123_music_player_back img").attr("src", Player.data[id].cover.square);
				if (!$("#moe123_music_player_back img").complete)
					$("#moe123_music_player_back img").load(function() { 
						if ($("#moe123_music_player_widget").css("height") == "70px")
							$("#moe123_music_player_back img").css(
								"margin-top", - (($("#moe123_music_player_back img").height() - 70) / 3) + "px"
							);
						$("#moe123_music_player_back img").fadeIn();
					});
				else $("#moe123_music_player_back img").fadeIn();
			});
			
			$("#moe123_music_player_title").html(Player.data[id].title);
			$("#moe123_music_player_title").attr("href", Player.data[id].wiki_url)
			$("#moe123_music_player").jPlayer("setMedia", Player.parse_media(id));
			$("#moe123_music_player").jPlayer("play", 0);
			
			$("#moe123_music_player_back").css('height', ($("#moe123_music_player_wrapper").height() + 10) + "px");
		}
	},
	play_prev: function ()
	{
		if ($("#moe123_music_player_list a").length == 0) return;
		
		Player.clean();
		if ($("#moe123_music_player_list_repeat").is(":visible"))
		{
			$("#moe123_music_player").jPlayer("stop", 0);
			var $prev = $("#moe123_music_player_list .on").prev(), i;
			if( $prev.length == 0 ) {
				i = parseInt($("#moe123_music_player_list a").last().attr("data-music-id"));
				$("#moe123_music_player_list a").removeClass("on");
				$("#moe123_music_player_list a").last().addClass("on");
			}
			else
			{
				i = parseInt($prev.attr("data-music-id"));
				$("#moe123_music_player_list a").removeClass("on");
				$prev.addClass("on");
			}
			Player.play(i);
		}
		else 
		{ 
			Player.play(parseInt($("#moe123_music_player_list .on").attr("data-music-id")));
		}
	},
	play_next: function ()
	{
		if ($("#moe123_music_player_list a").length == 0) return;
		
		var i;
		Player.clean();
		if ($("#moe123_music_player_list_random").is(":visible"))
		{
			var k = Player.get_random_int(0, $("#moe123_music_player_list a").length - 1);
			i = parseInt($("#moe123_music_player_list a:eq(" + k + ")").attr("data-music-id"));
			$("#moe123_music_player_list a").removeClass("on");
			$("#moe123_music_player_list a:eq(" + k + ")").addClass("on");
		}
		else if ($("#moe123_music_player_repeat").is(":visible"))
		{
			if ($("#moe123_music_player_list .on").length == 0)
			{
				i = parseInt($("#moe123_music_player_list a").first().attr("data-music-id"));
			}
			else
			{
				i = parseInt($("#moe123_music_player_list .on").attr("data-music-id"));
			}
		}
		else ($("#moe123_music_player_list_repeat").is(":visible"))
		{
			var $next = $("#moe123_music_player_list .on").next();
			if( $next.length == 0 ) {
				i = parseInt($("#moe123_music_player_list a").first().attr("data-music-id"));
				$("#moe123_music_player_list a").removeClass("on");
				$("#moe123_music_player_list a").first().addClass("on");
			}
			else
			{
				i = parseInt($next.attr("data-music-id"));
				$("#moe123_music_player_list a").removeClass("on");
				$next.addClass("on");
			}
		}
		Player.play(i);
	},
	single_repeat: function ()
	{
		$("#moe123_music_player_seq_group a").hide();
		$("#moe123_music_player_repeat").show();
	},
	list_repeat: function ()
	{
		$("#moe123_music_player_seq_group a").hide();
		$("#moe123_music_player_list_repeat").show();
	},
	list_random: function ()
	{
		$("#moe123_music_player_seq_group a").hide();
		$("#moe123_music_player_list_random").show();
	},
	set_msg: function (str)
	{
		$("#moe123_music_player_message").html(str);
	},
	// Utils
	parse_media: function (id) 
	{
		return {mp3:Player.data[id].url};
	},
	clean: function ()
	{
		Player.progressbar(0, $('#moe123_music_player_progress'));
		$("#moe123_music_player_back img").attr("src", "http://static.moe123.com/static/img/spaceball.gif"); 
		$("#moe123_music_player_title").html("萌否电台");
		$("#moe123_music_player_title").attr("href", "http://moe.fm/")
		$("#moe123_music_player").jPlayer("stop", 0);
		$("#moe123_music_player").jPlayer("setMedia", {});
	},
	force_update: function ()
	{
		Player.clean();
		$("#moe123_music_player_list").empty();
		Player.set_msg("正在刷新...");
		$.getJSON(Player.api_host + Player.api_random_list, Player.on_data_ready); 
	},
	// Callbacks
	on_play_ended: function (e)
	{
		Player.play_next();
	},
	on_data_ready: function (d) 
	{
		var tree = d.playlist, i = 0, k = 0;
		for (i in tree)
		{
			k = Player.data.push(tree[i]);
			$("#moe123_music_player_list").append(
				"<a title='" + tree[i].title +
				"' data-music-id='" + (--k) +
				"' href='javascript:void(0)'>" +
				tree[i].title + "</a>"
			);
		}
		
		$("#moe123_music_player_list a").click(function () {
			Player.clean();
			Player.play(parseInt($(this).attr("data-music-id")));
			$("#moe123_music_player_list a").removeClass("on");
			$(this).addClass("on");
		})
		
		Player.set_msg("初始化完成");
	},
	on_player_ready: function (e) 
	{ 
		Player.progressbar(0, $('#moe123_music_player_progress'));
		$("#moe123_music_player_wrapper").fadeIn();
		$('#moe123_music_player_back').css('filter', 'alpha(opacity=25)');
		$('#moe123_music_player_back img').css('filter', 'alpha(opacity=25)');
		$('#moe123_music_player_progress').css('filter', 'alpha(opacity=60)');
		$("#moe123_music_player_widget").hover(function (e) {
			$("#mail-login-form").hide();
			$("#moe123_left_widgets").css("height", "600px");
			$("#moe123_music_player_back img").css("margin-top", "0px");
			$(this).css("height", "auto");
		}, function (e) {
			$("#mail-login-form").show();
			$("#moe123_left_widgets").css("height", "680px");
			$("#moe123_music_player_back img").hide();
			$("#moe123_music_player_back img").css("margin-top", - (($("#moe123_music_player_back img").height() - 70) / 3) + "px");
			$("#moe123_music_player_back img").stop(true, true).fadeIn();
			$(this).css("height", "70px");
		});
		$("#moe123_music_player_prev").click(function (e) {
			Player.play_prev();
		});
		$("#moe123_music_player_next").click(function (e) {
			Player.play_next();
		});
		$("#moe123_music_player_repeat").click(function (e){
			Player.list_repeat();
		});
		$("#moe123_music_player_list_repeat").click(function (e){
			Player.list_random();
		});
		$("#moe123_music_player_list_random").click(function (e){
			Player.single_repeat();
		});
		Player.list_repeat();
		$.getJSON(Player.api_host + Player.api_music_list, Player.on_data_ready); 
	},
	on_player_timeupdate: function (e) 
	{
		Player.progressbar((e.jPlayer.status.currentTime / e.jPlayer.status.duration) * 100, $('#moe123_music_player_progress'));
	}
}; 