
function Data() {
	this.min = 0;
	this.max = 0;
	this.current = -1;
	this.change = 0;
	this.timerEnd = 0;
	this.anim='none';
}

window.addEventListener( 'load', function() {

	var bbcFeed = null;
	var updateDate = null;
	var feedMax = 12;
	var feedCount = 0;

	var debugging = false;
	
	var debug = function() {};
	if( debugging ) {
		debug = function ( mess ) {
			opera.postError( "TICKER-DEBUG: [" + mess + "]" );
		};
	}
	
	var latestData = new Data();
	var previousData = new Data();
	var oldestData = new Data();

	var _size = '';

	var rssFeed = '';
	var urlLink = '';
	var sortItems = false;
    
	var speeds = {
			fast : 1,
			medium : 2,
			slow : 3 };
	var speed = speeds.medium;
    
	var anims = {
			slide_left : 1,
			slide_right : 2,
			fade : 3,
			none: 4,
			slide_up : 5,
			slide_down : 6

			 };
	var anim = anims.slide_left;  
    
	function formatTime(time) {
		return (time < 10) ? '0' + time : time;
	}

	function getAnim( animType, hide ) {
		var animation = "";
		
		if( animType == anims.slide_right )
			animation = "slide_right_";
		else if( animType == anims.slide_left )
			animation = "slide_left_";
		else if( animType == anims.fade )
			animation = "fade_";
		else if( animType == anims.none )
			animation = "no_anim_";
		else if( animType == anims.slide_up )
			animation = "slide_up_";
		else if( animType == anims.slide_down )
			animation = "slide_down_";

		if( hide ) {
			animation += "hide";
		}
		else {
			animation += "show";
		}

		return animation;
			
	}
    
	function animationHide( animObj, animType ) {
		
		var animation = getAnim( animType, true );
			
		animObj.style.setProperty( "animation-name", animation );
	    animObj.style.setProperty( "animation-fill-mode","forwards" );

		animObj.anim = "hiding";
	    	
		if( animType == anims.none )
			animObj.style.setProperty( "animation-duration","0.2s" );
		else
			animObj.style.setProperty( "animation-duration","0.35s" );
	  
		//animObj.style.setProperty( "animation-duration","0.1s" );
		//debug( "Hide:"+ animation );
		
		return animObj;
	}
    
	function animationShow( animObj, animType ) {
	
	    var animation = getAnim( animType, false );
			
	    animObj.style.setProperty( "animation-name", animation );
	    animObj.style.setProperty( "animation-fill-mode","forwards" );

		animObj.anim = "showing";
	    
	    if( animType == anims.none )
			animObj.style.setProperty( "animation-duration","0.2s" );
		else
			animObj.style.setProperty( "animation-duration","0.35s" );
	
		//animObj.style.setProperty( "animation-duration","0.1s" );
		//debug( "Show:" + animation );
		
		return animObj;
	}
    
	function change( obj, data ) {

		var animType = anim * 1;

		var animShow = function() {
			
			var number = next( data );
			var feed = bbcFeed.getItemList()[number];

			var pubed = feed.getDate();

			var title = feed.getTitle();
			var time = formatTime( pubed.getHours() ) + ':' + formatTime( pubed.getMinutes() );
			var description = feed.getDesc();
			var photoLarge = feed.getLargePhoto();
			var photoSmall = feed.getSmallPhoto();
			
			var feedUrl = feed.getLink();

			var display = '';
			
			if( photoLarge )
				display += '<div class="image" style="background-image:url(\'' + photoLarge.url + '\');"></div>';

			display += '<div class="text">';
				display += '<div class="title">' + getText( title ) + '</div>';
				display += '<div class="desc">'  + getText( description ) + '</div>';
			display += '</div>';

			if( _size === 'small' || _size === 'tiny' ) {
				updateSpeeddialLink( feedUrl ); // Link directly when only one visible. (i.e. at smaller sizes.)
			}
			
			obj.innerHTML = display;
			obj.removeEventListener( "animationend", animShow );

			var animEnd = function () {
				obj.removeEventListener( "animationend", animEnd );
				obj.anim = "none";
			}
			
			obj.removeEventListener( "animationend", animEnd );
			obj.addEventListener( "animationend", animEnd );
			
			animationShow( obj, animType );
		};


		obj.removeEventListener( "animationend", animShow );

		if( obj.anim != "none" ) {
			// It didn't finish the animation last time so just show it now...
			debug( "******************* Animation did not End " );
			animShow();
		}
		else {
			obj.addEventListener( "animationend", animShow );
			animationHide( obj, animType );
		}
	}
	
	var objLatest   = document.querySelector( '#latest article' );
	var objPrevious = document.querySelector( '#previous article' );
	var objOldest   = document.querySelector( '#oldest article' );
	
    function changeLatest() 	{ change(   objLatest, 	latestData   ); }
	function changePrevious() 	{ change( objPrevious, 	previousData ); }
	function changeOldest() 	{ change(   objOldest, 	oldestData   ); }


	function pauseAnimations() {
		objLatest.style.setProperty( "animation-play-state","paused" );
		objPrevious.style.setProperty( "animation-play-state","paused" );
		objOldest.style.setProperty( "animation-play-state","paused" );
	}
	
	function runAnimations() {
		objLatest.style.setProperty( "animation-play-state","running" );
		objPrevious.style.setProperty( "animation-play-state","running" );
		objOldest.style.setProperty( "animation-play-state","running" );
	}
	
	function getText( maybeText ) {
		if( maybeText && maybeText.nodeValue ) {
			return maybeText.nodeValue;
		}
			
		if( maybeText && maybeText.childNodes ) {
			return maybeText.childNodes.item(0).nodeValue;
		}
			
		return maybeText;
	}

	function next( data )  {
		var newItem = data.current;
    	
		if( newItem === -1 || newItem === data.max) {
			newItem = data.min;
		}
		else {
			newItem++;
		}
    	
		data.current = newItem;
		    	
		return newItem;
	}

	function _getItemNumber( data ) {
		if( data.current === -1 )
			return data.min;
			
		return data.current;
	}
    
	function updateTitle() {
		
		if (opera.contexts.speeddial) {
    	
			var title = '';
			
			if ( widget.preferences.title !== undefined && widget.preferences.title !== '' ) {
				var maintitle = widget.preferences.title;
				
				var outputtitle  = document.querySelector('#title');
				outputtitle.textContent = maintitle;
				
				title += maintitle;
			}
			
			if( title !== '' )
				title += " - ";
			title += 'BBC News';
			
			if( bbcFeed && bbcFeed.getItemList().length > 0 )
			{
				if( updateDate ) {
					title += " (" + formatTime( updateDate.getHours() ) + ':' + formatTime( updateDate.getMinutes() ) + ")";
				}
			}
			else
			{
				title += " (no items)";
			}
    			    
			opera.contexts.speeddial.title = title;
		}
	}
	function updateUrl() {
	    	if (opera.contexts.speeddial) {
	    		if( widget.preferences.urlLink ) {
					updateSpeeddialLink( widget.preferences.urlLink );
			}
		}
	}
	function updateSpeeddialLink( link ) {
		opera.contexts.speeddial.url = link;
	}
	function updateAnim( num ) {
		num = num * 1;
		if( num === 1 ) {
			anim = anims.slide_left;
		}
		else if( num === 2 ) {
			anim = anims.slide_right;
		}
		else if( num === 3 ) {
			anim = anims.fade;
		}
		else if( num === 5 ) {
			anim = anims.slide_up;
		}
		else if( num === 6 ) {
			anim = anims.slide_down;
		}
		else  {
			anim = anims.none;
		}
	}
	function updateItemsType() {
		if ( widget.preferences.itemsType ) {
			type = widget.preferences.itemsType * 1;
			if( type === 1 ) {
				sortItems = false;
			}
			else {
				sortItems = true;
			}
		}
	}
    
	window.addEventListener( 'storage', function(event) {
		
    	if( event.oldValue !== event.newValue )
    	{
			if( event.key === 'changeSpeed' && widget.preferences.changeSpeed !== undefined ) {
				speed = widget.preferences.changeSpeed;
				_setSections();
			}
			else if( event.key === 'animationType' && widget.preferences.animationType !== undefined ) {
				updateAnim( widget.preferences.animationType );
			}
			else if( event.key === 'itemsType' && widget.preferences.itemsType !== undefined ) {
				updateItemsType();
				createFeed();
			}
			else if( event.key === 'rssFeed' && widget.preferences.rssFeed !== undefined ) {
				createFeed();
			}
			else if( event.key === 'title' && widget.preferences.title !== undefined ) {
				updateTitle();
			}
			else if( event.key === 'urlLink' && widget.preferences.urlLink !== undefined ) {
				updateUrl();
			}
			
		}
        
	}, false );
    
	function _resizeHandler() {
		
		var oldSize = _size;
		_setWidth();
        
		if( oldSize !== _size ) {
			
			pauseAnimations();
		
			_setSections();
			_updateSections();
			
			runAnimations();
		
			if(  _size === 'small' || _size === "tiny" ) {
			
				var feed = bbcFeed.getItemList()[_getItemNumber(latestData)];
				updateSpeeddialLink( feed.getLink() );
			}
			else  {
				updateUrl();
			}
		}
		
	}

    function _getWidth( width ) {
		var size = '';
		
		if( width > 400) {
			size = 'large';
		}
		else if( width > 310 ) {
			size = 'bigger';
		}
		else if( width > 250) {
			size = 'big';
		}
		else if( width > 170) {
			size = 'small';
		}
		else {
			size = 'tiny';
		}

		return size;
	}
	
    function _setWidth() {
		
    	bodyElement = document.getElementsByTagName('body')[0];
		var width = bodyElement.clientWidth;

		var newsize = _getWidth( width );

		if( _size != newsize ) {
			bodyElement.className = _size = newsize;
		}
			
		_setAnimationSize( width );
			
		return width;
	}
    
	function _setAnimationSize( width ) {
		
    	var stylesheet = document.styleSheets[1];
		var rules = stylesheet.cssRules;
		
		var ruleName = "";
		for( var rule = 0; rule < rules.length; rule++ ) {
			
			var cssRule = rules[rule];
			var ruleName = cssRule.name;
			
			if( ruleName == "slide_right_hide" ) {
				_setPropertyWidth( cssRule.cssRules[1], 'left', width );
			}
			else if( ruleName == "slide_right_show" ) {
				_setPropertyWidth( cssRule.cssRules[0], 'left', -width );
			}
			else if( ruleName == "slide_left_hide" ) {
				_setPropertyWidth( cssRule.cssRules[1], 'right', width );
			}
			else if( ruleName == "slide_left_show" ) {
				_setPropertyWidth( cssRule.cssRules[0], 'right', -width );
			}
		}
	}
	function _setPropertyWidth( obj, property, width ) {
		obj.style.setProperty( property, (width/2) + "px" );
	}
    
	function _setSections() {
		
		var mintime = randomNumber( 4, 6 ) * 1000;
				
		if( _size === 'large' ) { 
			
			latestData.min 		= 0;
			latestData.max 		= 0;
			latestData.change 	= 0;

			previousData.min 	= 1;
			previousData.max 	= 4;
			previousData.change = (mintime + 2000) * speed;
			
			oldestData.min 		= 5;
			oldestData.max 		= feedCount-1;
			oldestData.change 	= mintime * speed;
		}
		else if ( _size === 'big' || _size === 'bigger' ) {
			
			latestData.min 		= 0;
			latestData.max 		= 4;
			latestData.change 	= (mintime + 2000) * speed;

			previousData.min 	= 5;
			previousData.max 	= feedCount-1;
			previousData.change = mintime * speed;
		}
		else /* ( _size === 'small' || _size === 'tiny' ) */ {
			
			latestData.min 		= 0;
			latestData.max 		= feedCount-1;
			latestData.change 	= mintime * speed;
		}
		
		latestData.current = previousData.current = oldestData.current = -1;
		latestData.timerEnd = oldestData.timerEnd = previousData.timerEnd = 0;
	}
    
	function randomNumber( low, high ) {
		return Math.floor(Math.random() * (high-low)) + low;
	}
    
	function _updateSections() {
		
		changeLatest();
		
		if( _size === 'large' || _size === 'big' || _size === 'bigger' ) {
			
			changePrevious();
			
			if( _size === 'large' ) {
				changeOldest();
			}
		}
    }
    
	var monthsShort = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var monthsFull = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    
	var outputdate  = document.querySelector('#date');
	
	function _updateClock( datetime ) {
	
		var month = datetime.getMonth(),
			date = datetime.getDate();
	   
		if( _size === 'small' || _size === 'tiny' ) {
			
			outputdate.innerHTML = date + '' + monthsShort[month];
		}
		else {
			
			if( _size === 'big' || _size === 'bigger' ) {
			
				outputdate.innerHTML = date + ' ' + monthsShort[month];
			}
			else /* _size === 'large' */ {

				outputdate.innerHTML = date + ' ' + monthsFull[month];
			}
		}
	}

	var checkDate = 0;
	var timer = window.setInterval( function() {

		if( checkDate <= 0 ) {
			_updateClock( new Date() );
			checkDate = 15 * 60;
		}
		else {
			checkDate -= 1;	
		}
		
		var now = Date.now();

		//debug( "Now:" + (now-prev) + " latest-timer-end:" + (latestData.timerEnd - now) + " previous-timer-end:" + (previousData.timerEnd - now) + " oldest-timer-end:" + (oldestData.timerEnd - now) );
		//prev = now;
		
		if(   latestData.timerEnd == 0 ) {   latestData.timerEnd = now + latestData.change;   }
		if( previousData.timerEnd == 0 ) { previousData.timerEnd = now + previousData.change; }
		if(   oldestData.timerEnd == 0 ) {   oldestData.timerEnd = now + oldestData.change;   }


		if( latestData.change != 0 && latestData.timerEnd < now && latestData.anim == "none" ) {
			
			latestData.timerEnd = now + latestData.change;
			changeLatest();
		}
		
		if( _size === 'large' || _size === 'big' || _size === 'bigger' ) {
			
			if( previousData.timerEnd < now && previousData.anim == "none" ) {
				
				previousData.timerEnd = now + previousData.change;
				changePrevious();
			}
			
			if( _size === 'large' ) {
				
				if( oldestData.timerEnd < now && oldestData.anim == "none" ) {
					
					oldestData.timerEnd = now + oldestData.change;
					changeOldest();
				}
			}
		}

	}, 1000);
   
   	function newPost(noChange, err) {
        
        if( !err ) {
			debug( "******** Updating *********" );
			if( !noChange ) {
				
				feedCount = bbcFeed.getItemList().length;

				pauseAnimations();
				
				_setSections();
				_updateSections();
				
				runAnimations();
			}
			
			updateDate = new Date();
			updateTitle();
		}
	}
   
   	function createFeed() {
		if( bbcFeed && bbcFeed.clearUpdateInterval ) {
			bbcFeed.clearUpdateInterval();
		}
			
		if (widget.preferences.rssFeed ) {
			rssFeed = widget.preferences.rssFeed;
		}
		
		var feedUpdate = randomNumber( 60*5, 60*8 ); // Seconds
		debug( "feedUpdate" + feedUpdate );
		bbcFeed = new Feed( rssFeed, 'BBC News', 'News from the BBC', newPost, feedUpdate, parsers['generic'], feedMax, sortItems );
		bbcFeed.update();
    }
    
	// 
	// Begin
	//
	debug( "************************** BBBEEEGGGIIINNN *************************************" );
	
	if (widget.preferences.changeSpeed ) {
		speed = widget.preferences.changeSpeed;
	}
	if (widget.preferences.animationType ) {
		updateAnim( widget.preferences.animationType );
	}

	updateItemsType();
	updateTitle();
	updateUrl();

    
	_setWidth();
	addEventListener( 'resize', _resizeHandler, false );
    
	createFeed();
   
}, false );



