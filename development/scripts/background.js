window.addEventListener( 'load', function() {
    var bbcFeed = null;
    var updateDate = null;
    var feedMax = 12;
    var feedCount = 0;
    
    var debugging = true;
    
    var latestData = {};
    var previousData = {};
    var oldestData = {};
    
    var size = '';
    var width = -1;
    var stopped = -1;
    var latestTimeout = stopped;
    var previousTimeout = stopped;
    var oldestTimeout = stopped;
    
    var rssFeed = '';
    var urlLink = '';
    
    var  speeds = {
			fast : 1,
			medium : 2,
			slow : 3 }
    var speed = speeds.medium;
    var 	anims = {
				slide_left : 1,
				slide_right : 2,
				fade : 3,
				none: 4 }
    var anim = anims.slide_left;
    
    function formatTime(time) {
		    return (time < 10) ? '0' + time : time;
		}
    
    function animationHide( animObj, move, animType ) {
	    
	    if( !animObj.checkRun ) {
	    	animObj = animObj.createAnimation();
	    }
	    else if( animObj.checkRun() ) {
	    	animObj.stop();
	    }
		
    	debug( "Hide:Anim=" + animType );
        if( animType === anims.slide_left ) {
            animObj.addAnimation( 'left', '0px', move+'px' ); // Slide left
			debug( "Hide: Slide left" + anims.slide_left );
        }
        if( animType === anims.slide_right) {
			animObj.addAnimation( 'left', '0px', -move+'px'  ); // Slide right
			debug( "Hide: Slide right" + anims.slide_right);
		}
        if( animType !== anims.none ) {
			animObj.addAnimation( 'opacity', '1.0', '0.0' );
			debug( "Hide: Fade" + anims.fade + " " + anims.none );
		}
        animObj.accelerationProfile = animObj.accelerate;
        animObj.speed = 12;
        
        return animObj;
    }
    
    function animationShow( animObj, move, animType ) {
	    
	    if( !animObj.checkRun ) {
	    	animObj = animObj.createAnimation();
	    }
	    else if( animObj.checkRun() ) {
	    	animObj.stop();
	    }
    	
    	debug( "Show:Anim = " + animType );
        if( animType === anims.slide_left) {		
			animObj.addAnimation( 'left', '-'+move+'px', '0px' );// Slide left
			debug( "Show:Slide left");
		}
		if( animType === anims.slide_right ) {
			animObj.addAnimation( 'left', move+'px','0px' );// Slide right
			debug( "Show:Slide right");
		}
		if( animType !== anims.none ) {
			animObj.addAnimation( 'opacity', '0.0', '1.0' );
			debug( "Show:Fade");
		}
	
		animObj.accelerationProfile = animObj.decelerate;
		animObj.speed = 6; 
        
        return animObj;
    }
    
    function change( objId, data, timerFunction )
    {
	    var obj = document.querySelector( objId );
	    var move = width;
	    var animType = anim;
		
	    var animObj = animationHide( obj, move, animType );
	    
	    animObj.onfinish = function() { 
	    
	    	var number = next( data );
	    	var feed = bbcFeed.getItemList()[number];
	    
	    	var pubed = feed.getDate();
	    	
	    	var title = feed.getTitle();
	    	var time = formatTime(pubed.getHours()) + ':' + formatTime(pubed.getMinutes());
	    	var description = feed.getDesc();
	    	var photoLarge = feed.getLargePhoto();
	    	var photoSmall = feed.getSmallPhoto();
	    	
		    var display = '';
		    
		    if( photoLarge ) {
			    display += '<img class="img_lar" width="' + photoLarge.width + '" height="' + photoLarge.height + '" src="' + photoLarge.url + '"/>';
			    //opera.postError( "L w:" + photoLarge.width + " h:" + photoLarge.height + " u:" + photoLarge.url );
			 }
		    if( photoSmall ) {
			    display += '<img class="img_sma" width="' + photoSmall.width + '" height="' + photoSmall.height + '" src="' + photoSmall.url + '"/>';
			    //opera.postError( "S w:" + photoSmall.width + " h:" + photoSmall.height + " u:" + photoSmall.url );
			 }
		    
		    display += '<div class="title">' + getText( title ) + '</div>';
		    display += '<div class="desc">' + getText( description ) + '</div>';
		    display += '<div class="time">' + time + '</div>';

	    	obj.innerHTML = display;
	    	
	    	animObj = animationShow( obj, move, animType );
	    	
	    	/*if( haveNext( data ) ) {
	    		animObj.onfinsh = function() {
	    			timerFunction();
	    			debug( "Starting timer" );
	    		}   
	    	}*/
	    	
	    	animObj.run();
	    	
	    	if( haveNext( data ) ) {
	    		timerFunction();
	    	}
	    	
		};       

	    animObj.run();
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
    	
    	if( newItem === -1 || newItem + 1 > data.max) {
    		newItem = data.min;
    	}
    	else {
    		newItem++;
    	}
    	
		data.current = newItem;
		    	
    	return newItem;
    }
    
    function haveNext( data ) {
    	return data.max !== data.min;
    }
    
    function changeLatest() {
	    stopLatestTimer();
        change( '#latest article', latestData,  function() { startLatestTimer(); } );
    }
    function startLatestTimer() {
        if( latestTimeout === stopped ) {
            latestTimeout = setTimeout( function () { changeLatest(); }, latestData.change );
        }
    }
    function stopLatestTimer() {
    	if( latestTimeout > 0 ) {
    		clearTimeout( latestTimeout );
    	}
    	latestTimeout = stopped;
    }
    
    function changePrevious() {
    	stopPreviousTimer();
        change( '#previous article', previousData, function() { startPreviousTimer(); } );
    }
    function startPreviousTimer() {
        if( previousTimeout === stopped ) {
            previousTimeout = setTimeout( function () { changePrevious(); }, previousData.change );
        }
    }
    function stopPreviousTimer() {
    	if( previousTimeout > 0 ) {
    		clearTimeout( previousTimeout );
    	}
    	previousTimeout = stopped;
    }
    
    function changeOldest() {
    	stopOldestTimer();
        change( '#oldest article', oldestData, function() { startOldestTimer(); } );
    }
    function startOldestTimer() {
        if( oldestTimeout === stopped ) {
            oldestTimeout = setTimeout( function () { changeOldest(); }, oldestData.change );
        }
    }
    function stopOldestTimer() {
    	if( oldestTimeout > 0 ) {
    		clearTimeout( oldestTimeout );
    	}
    	oldestTimeout = stopped;
    }
    
    function newPost(noChange, err) {
    	debug( "Update feeds!" );
        
        if( bbcFeed.getItemList().length > 0 )
        {
        	feedCount = bbcFeed.getItemList().length;
			updateDate = new Date();
			
			_setWidth();
			_setSections(size);
		    _startSections(size);
		
			addEventListener( 'resize', _resizeHandler, false );
        	
        }
        
        updateTitle();
    }
    
    function updateTitle()
    {
    	if (opera.contexts.speeddial) {
    	
			var title = 'BBC News';
			
			if (widget.preferences.title !== undefined && widget.preferences.title !== '' ) {
				title += " - " + widget.preferences.title;
			}
			
			if( bbcFeed && bbcFeed.getItemList().length > 0 )
			{
				if( updateDate ) {
					title += " (" + formatTime(updateDate.getHours()) + ':' + formatTime(updateDate.getMinutes()) + ")";
				}
			}
			else
			{
				title += " (no items)";
			}
    			    
			opera.contexts.speeddial.title = title;
		}
    }
    function updateUrl()
    {
    	if (opera.contexts.speeddial) {
    		if( widget.preferences.urlLink ) {
				opera.contexts.speeddial.url = widget.preferences.urlLink;
			}
		}
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
    
    window.addEventListener( 'storage', function(event) {
		debug( "Storage event: " + event.key + " " + event.oldValue + " " + event.newValue );
		
    	if( event.oldValue !== event.newValue )
    	{
			if (event.key === 'changeSpeed' && widget.preferences.changeSpeed !== undefined ) {
				speed = widget.preferences.changeSpeed;
		    	_setSections(size);
			}
			else if (event.key === 'animationType' && widget.preferences.animationType !== undefined ) {
				updateAnim( widget.preferences.animationType );
			}
			else if (event.key === 'rssFeed' && widget.preferences.rssFeed !== undefined ) {
				createFeed();
			}
			else if (event.key === 'title' && widget.preferences.title !== undefined ) {
				updateTitle();
			}
			else if (event.key === 'urlLink' && widget.preferences.urlLink !== undefined ) {
				updateUrl();
			}
			
		}
        
	}, false );
    
    function _resizeHandler() {
        var oldSize = size;
        _setWidth();
        
        if( oldSize !== size )
        {
        	_setSections( size );
			_updateTimers( size );
		}
    }
    
    function _setWidth() {
    		bodyElement = document.getElementsByTagName('body')[0];
	    	
        width = bodyElement.clientWidth;
         
        if(width > 400) {
        	size = 'large';
        }
        else if (width > 250) {
        	size = 'big';
        }
        else if (width > 170) {
        	size = 'small';
        }
        else {
        	size = 'tiny';
        }
			
			bodyElement.className = size;
			debug( "Size: " + size + " (" + width + ")" );
			
        return width;
    }
    
    function _setSections( size ) {
    	if( size === 'large' )
	    { 
			// large view
	      latestData = { min: 0, max: 0, current: -1, change: 0 };
			previousData = { min: 1, max: 5, current: -1, change: 6000 * speed };
			oldestData = { min: 6, max: feedCount-1, current: -1, change: 4000 * speed };
	    }
	    else if ( size === 'big' ){
	    	// big view		    	
	      latestData = { min: 0, max: 4, current: -1, change: 6000 * speed };
			previousData = { min: 5, max: feedCount-1, current: -1, change: 4000 * speed };
		
			//oldestData = { min: 0, max: 0, current:0, change: 0 };
	    }
	    else {
	    	// small view or tiny view
	      latestData = { min: 0, max: feedCount-1, current: -1, change: 4000 * speed };
		
			//previousData = { min: 0, max: 0, current: 0, change: 0 };
			//oldestData = { min: 0, max: 0, current:0, change: 0 };
		}
    }
      function _updateTimers( size ) {
		if( size === 'large' )
	    { 
			// large view
			startLatestTimer();
			startPreviousTimer();
			startOldestTimer();
	    }
	    else if ( size === 'big' ){
	    	// big view
			startLatestTimer();
			startPreviousTimer();
			stopOldestTimer();
	    }
	    else {
	    	// small view or tiny view
			startLatestTimer();
			stopPreviousTimer();
			stopOldestTimer();
		}
    }
    
    function _startSections( size ) {
		if( size === 'large' )
	    { 
			// large view
			changeLatest();
			changePrevious();
			stopOldestTimer();
	    }
	    else if ( size === 'big' ){
	    	// big view
			changeLatest();
			changePrevious();
			stopOldestTimer();
	    }
	    else {
	    	// small view or tiny view
			changeLatest();
			stopPreviousTimer();
			stopOldestTimer();
		}
    }
    
    // Get and display the current time every 500 milliseconds
    var timer = window.setInterval(function() {
      var outputdate = document.querySelector('output#date');
		var outputclock = document.querySelector('output#clock');
		var date, year, month, da, hours, mins, secs;
		
		monthsShort = ['Jan','Feb','March','April','May','June','July','August','Sept','Oct','Nov','Dec'];
		monthsFull = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        datetime = new Date();
		
        year = datetime.getYear();
        month = datetime.getMonth();
        date = datetime.getDate();
        hours = datetime.getHours();
        mins = datetime.getMinutes();
        secs = datetime.getSeconds();
   
   		if( size === 'small' || size === 'tiny' )
   		{
        	outputdate.innerHTML = formatTime(date) + '.' + formatTime(month);
        	outputclock.innerHTML = formatTime(hours) + ':' + formatTime(mins);
        }
        else if( size === 'big' )
        {
        	outputdate.innerHTML = formatTime(date) + ' ' + monthsShort[month-1];
	        outputclock.innerHTML = formatTime(hours) + ':' + formatTime(mins) + ':' + formatTime(secs);
	    }
        else
        {
        	outputdate.innerHTML = formatTime(date) + ' ' + monthsFull[month-1] + ' ' + (year+1900);
	        outputclock.innerHTML = formatTime(hours) + ':' + formatTime(mins) + ':' + formatTime(secs);
	    }
    }, 500); // Twice a second to allow for slight delays in JavaScript execution
   
   function debug( mess ) {
   		if( debugging ) {
   			opera.postError( mess );
        }
   }
   
   	function createFeed() {
		if( bbcFeed && bbcFeed.clearUpdateInterval ) {
			bbcFeed.clearUpdateInterval();
		}
			
		if (widget.preferences.rssFeed ) {
			rssFeed = widget.preferences.rssFeed;
		}
		
		bbcFeed = new Feed( rssFeed, 'BBC News', 'News from the BBC', newPost, 5, parsers['generic'], feedMax );
		bbcFeed.update();
    }
    
	// 
	// Begin
	//
	if (widget.preferences.changeSpeed ) {
		speed = widget.preferences.changeSpeed;
	}
	if (widget.preferences.animationType ) {
		updateAnim( widget.preferences.animationType );
	}
	updateTitle();
	updateUrl();

	createFeed();
   
}, false);
