
function Data() {
	this.min = 0;
	this.max = 0;
	this.current = -1;
	this.change = 0;
	this.timerStart = 0;
}
window.addEventListener( 'load', function() {

	var bbcFeed = null;
	var updateDate = null;
	var feedMax = 12;
	var feedUpdate = 5; // Minutes
	var feedCount = 0;

	var debugging = true;

	var latestData = new Data();
	var previousData = new Data();
	var oldestData = new Data();

	var _size = '';
	var width = -1;

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
			none: 4 };
	var anim = anims.slide_left;  
    
	function formatTime(time) {
		return (time < 10) ? '0' + time : time;
	}
    
	function animationHide( animObj, animType ) {
		
		var animation = "";
		
		if( animType == anims.slide_right )
			animation = "slide_right_hide";
		else if( animType == anims.slide_left )
			animation = "slide_left_hide";
		else if( animType == anims.fade )
			animation = "fade_hide";
		else if( animType == anims.none )
			animation = "no_anim_hide";
			
		animObj.style.setProperty( "animation-name", animation );
	    	animObj.style.setProperty( "animation-fill-mode","forwards" );
	    	
		if( animType == anims.none )
			animObj.style.setProperty( "animation-duration","0.2s" );
		else if( animType == anims.fade )
			animObj.style.setProperty( "animation-duration","0.5s" );
		else
			animObj.style.setProperty( "animation-duration","1s" );
	  
		return animObj;
	}
    
	function animationShow( animObj, animType ) {
	
	    	var animation = "";
	    	
		if( animType == anims.slide_right )
			animation = "slide_right_show";
		else if( animType == anims.slide_left )
			animation = "slide_left_show";
		else if( animType == anims.fade )
			animation = "fade_show";
		else if( animType == anims.none )
			animation = "no_anim_show";
			
	    	animObj.style.setProperty( "animation-name", animation );
	    	animObj.style.setProperty( "animation-fill-mode","forwards" );
	    	
	    	if( animType == anims.none )
			animObj.style.setProperty( "animation-duration","0.2s" );
		else if( animType == anims.fade )
			animObj.style.setProperty( "animation-duration","0.5s" );
		else
			animObj.style.setProperty( "animation-duration","1s" );
        
		return animObj;
	}
    
	function change( obj, data ) {
		//var obj = document.querySelector( objId );
		//if( objId == '#oldest article' )
		//	debug( objId + "=" + obj );
		var animType = anim * 1;

		var animHideEnd = function() {
		
			var number = next( data );
			//if( objId == '#oldest article' )
			//	debug( objId + "=" + number );
			var feed = bbcFeed.getItemList()[number];

			var pubed = feed.getDate();

			var title = feed.getTitle();
			var time = formatTime( pubed.getHours() ) + ':' + formatTime( pubed.getMinutes() );
			var description = feed.getDesc();
			var photoLarge = feed.getLargePhoto();
			var photoSmall = feed.getSmallPhoto();
			
			var feedUrl = feed.getLink();

			var display = '';

			if( photoLarge ) {
				display += '<img class="img_lar" width="' + photoLarge.width + '" height="' + photoLarge.height + '" src="' + photoLarge.url + '"/>';
			}
			if( photoSmall ) {
				display += '<img class="img_sma" width="' + photoSmall.width + '" height="' + photoSmall.height + '" src="' + photoSmall.url + '"/>';
			}

			display += '<div class="title">' + getText( title ) + '</div>';
			display += '<div class="desc">' + getText( description ) + '</div>';
			
			if ( data.min === data.max ) {
				display += '<div class="time">' + time + '</div>';
			}
			else {
				display += '<div class="time">( ' + ((number+1)-data.min) + ' / ' + (data.max-data.min+1) + ' ) ' + time + '</div>';
			}

			if( _size === 'small' || _size === 'tiny' ) {
				updateSpeeddialLink( feedUrl );
			}
			
			obj.innerHTML = display;
			obj.removeEventListener( "animationend", animHideEnd );

			animationShow( obj, animType );
		};
		
		obj.removeEventListener( "animationend", animHideEnd );
		obj.addEventListener( "animationend", animHideEnd );
		
		animationHide( obj, animType ); 
	}
	
	var objLatest   = document.querySelector( '#latest article' );
	var objPrevious = document.querySelector( '#previous article' );
	var objOldest   = document.querySelector( '#oldest article' );
	
    function changeLatest() 	{ change( objLatest, 	latestData ); 	}
	function changePrevious() 	{ change( objPrevious, 	previousData ); }
	function changeOldest() 	{ change( objOldest, 	oldestData ); 	}
	
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
				title += widget.preferences.title;
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
			
			if( (oldSize !== "tiny" && _size !== "small") &&
				(oldSize !== "small" && _size !== "tiny" ) &&
				(oldSize !== "big" && _size !== "bigger" ) &&
				(oldSize !== "bigger" && _size !== "big" )    ) {
					
				_setSections();
				_updateSections();
			}
			
			if( _size === 'small' || _size === 'tiny' ) {
				var feed = bbcFeed.getItemList()[_getItemNumber(latestData)];
				updateSpeeddialLink( feed.getLink() );
			}
		}
	}
    
    function _setWidth() {
		
    	bodyElement = document.getElementsByTagName('body')[0];
	    	
		width = bodyElement.clientWidth;
		_setAnimationSize( width );
		
		if( width > 400) {
			_size = 'large';
		}
		else if( width > 310 ) {
			_size = 'bigger';
		}
		else if( width > 250) {
			_size = 'big';
		}
		else if( width > 170) {
			_size = 'small';
		}
		else {
			_size = 'tiny';
		}
			
		bodyElement.className = _size;
			
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
		
		if( _size === 'large' ) { 
			
			latestData.min = 0;
			latestData.max = 0;
			latestData.current = -1;
			latestData.change = 0;
			latestData.timerStart = 0;

			previousData.min = 1;
			previousData.max = 4;
			previousData.current = -1;
			previousData.change = 6000 * speed;
			previousData.timerStart = 0;
			
			oldestData.min = 5;
			oldestData.max = feedCount-1;
			oldestData.current = -1;
			oldestData.change = 4000 * speed;
			oldestData.timerStart = 0;
					
			//previousData = 	{ min: 1, max: 4, 			current: -1, change: 6000 * speed, 	timerStart: 0 };
			//oldestData   = 	{ min: 5, max: feedCount-1, current: -1, change: 4000 * speed, 	timerStart: 0 };
		}
		else if ( _size === 'big' || _size === 'bigger' ) {
			
			latestData.min = 0;
			latestData.max = 4;
			latestData.current = -1;
			latestData.change = 6000 * speed;
			latestData.timerStart = 0;

			previousData.min = 5;
			previousData.max = feedCount-1;
			previousData.current = -1;
			previousData.change = 4000 * speed;
			previousData.timerStart = 0;
			
			/*
			oldestData.min = 5;
			oldestData.max = feedCount-1;
			oldestData.current = -1;
			oldestData.change = 4000 * speed;
			oldestData.timerStart = 0;
			
			latestData   = 	{ min: 0, max: 4, 			current: -1, change: 6000 * speed, 	timerStart: 0 };
			previousData = 	{ min: 5, max: feedCount-1, current: -1, change: 4000 * speed, 	timerStart: 0 };

			oldestData   = 	{ min: 0, max: 0, 			current: -1, change: 0, 			timerStart : -1 };
			*/
		}
		else { // small or tiny
			latestData.min = 0;
			latestData.max = feedCount-1;
			latestData.current = -1;
			latestData.change = 4000 * speed;
			latestData.timerStart = 0;
			/*
			latestData   = 	{ min: 0, max: feedCount-1, current: -1, change: 4000 * speed, 	timerStart: 0 };

			previousData = 	{ min: 0, max: 0, 			current: -1, change: 0,				timerStart: -1 };
			oldestData   = 	{ min: 0, max: 0, 			current: -1, change: 0, 			timerStart: -1 };
			*/
		}
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
    
	// Get and display the current time every 500 milliseconds
	var monthsShort = ['Jan','Feb','March','April','May','June','July','August','Sept','Oct','Nov','Dec'];
	var monthsFull = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    
	var outputdate  = document.querySelector('output#date');
	var outputclock = document.querySelector('output#clock');
	
	function _updateClock( datetime ) {
	
		var month = datetime.getMonth(),
			date = datetime.getDate(),
			hours = datetime.getHours(),
			mins = datetime.getMinutes();
	   
		if( _size === 'small' || _size === 'tiny' )
		{
			outputdate.innerHTML = formatTime(date) + '.' + formatTime(month + 1);
			outputclock.innerHTML = formatTime(hours) + ':' + formatTime(mins);
		}
		else {
			
			var secs = datetime.getSeconds();
			
			if( _size === 'big' || _size === 'bigger' )
			{
				outputdate.innerHTML = formatTime(date) + ' ' + monthsShort[month];
				outputclock.innerHTML = formatTime(hours) + ':' + formatTime(mins) + ':' + formatTime(secs);
			}
			else // _size === 'large'
			{
				var year = datetime.getYear();
				outputdate.innerHTML = formatTime(date) + ' ' + monthsFull[month] + ' ' + (year+1900);
				outputclock.innerHTML = formatTime(hours) + ':' + formatTime(mins) + ':' + formatTime(secs);
			}
		}
	}
	
	var timer = window.setInterval( function() {
	
		var datetime = new Date();
		_updateClock(datetime);
		
		var now = Date.now();
		
		if( latestData.timerStart   == 0 ) 	latestData.timerStart   = now;
		if( previousData.timerStart == 0 ) 	previousData.timerStart = now;
		if( oldestData.timerStart   == 0 ) 	oldestData.timerStart   = now;

		if( latestData.change != 0 && latestData.timerStart + latestData.change < now ) {
			latestData.timerStart = now;
			changeLatest();
		}
		
		if( _size === 'large' || _size === 'big' || _size === 'bigger' ) { 
			
			if( previousData.timerStart + previousData.change < now ) {
				previousData.timerStart = now;
				changePrevious();
			}
			
			if( _size === 'large' ) {
				
				if( oldestData.timerStart + oldestData.change < now ) {
					oldestData.timerStart = now;
					changeOldest();
				}
			}
		}		

	}, 1000);

   
	function debug( mess ) {
		if( debugging ) {
			opera.postError( "TICKER-DEBUG: [" + mess + "]" );
		}
	}
   
   	function newPost(noChange, err) {
        
        if( !err ) {
			if( !noChange ) {
					
				feedCount = bbcFeed.getItemList().length;

				_setSections();
				_updateSections();
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
		
		bbcFeed = new Feed( rssFeed, 'BBC News', 'News from the BBC', newPost, feedUpdate, parsers['generic'], feedMax, sortItems );
		bbcFeed.update();
    }
    
	// 
	// Begin
	//
	// debug( "************************** BBBEEEGGGIIINNN *************************************" );
	
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
   
}, false);



