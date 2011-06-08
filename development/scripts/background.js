window.addEventListener('load', function() {
    var bbcFeed = null;
    var feedCount = 10;
    var debugging = false;
    
    var latestData = {
    	min: 0,
    	max: 0,
    	current: -1,
    	change: 0
    };
    var previousData = {
    	min: 1,
    	max: 3,
    	current: -1,
    	change: 5000
    };
    var oldestData = {
    	min: 4,
    	max: feedCount-1,
    	current: -1,
    	change: 3500
    };
    
    var size = '';
    var latestTimeout = -1;
    var previousTimeout = -1;
    var oldestTimeout = -1;
    
    function formatTime(time) {
		    return (time < 10) ? '0' + time : time;
		}
    
    function animationHide( obj ) {
    	var anim = obj.createAnimation();
    	
    	anim.addAnimation( 'left', '0px', '300px' );
        anim.addAnimation( 'opacity', '1.0', '0.0' );
        anim.accelerationProfile = anim.accelerate;
        anim.speed = 12;
        
        return anim;
    }
    
    function animationShow( obj ) {
    	var anim = obj.createAnimation();
    	
		anim.addAnimation( 'left', '-300px', '0px' );
		anim.addAnimation( 'opacity', '0.0', '1.0' );
	
		anim.accelerationProfile = anim.decelerate;
		anim.speed = 6; 
        
        return anim;
    }
    
    function change( objId, data, timerFunction )
    {
	    var obj = document.querySelector( objId );
	    var anim = animationHide( obj );
	    
	    anim.onfinish = function() { 
	    	var number = next( data );
	    	var feed = bbcFeed.getItemList()[number];
	    
	    	var pubed = feed.getDate();
	    	
	    	var title = feed.getTitle();
	    	var time = formatTime(pubed.getHours()) + ':' + formatTime(pubed.getMinutes());
	    	var description = feed.getDesc();
	    	

		    var display = '<div class="title">' + title + '</div>';
		    display += '<div class="time">' + time + '</div>';
		    display += '<div class="desc">' + description + '</div>';

	    	obj.innerHTML = display;
	    	
	    	anim = animationShow( obj );
	    	
	    	/*if( haveNext( data ) ) {
	    		anim.onfinsh = function() {
	    			timerFunction();
	    			debug( "Starting timer" );
	    		}   
	    	}*/
	    	
	    	anim.run();
	    	
	    	if( haveNext( data ) )
	    		timerFunction();
	    	
		}       

	    anim.run();
    }
    
    function next( data )  {
    	var newItem = data.current;
    	
    	if( newItem === -1 || newItem + 1 > data.max)
    		newItem = data.min;
    	else
    		newItem++;
    	
		data.current = newItem;
		    	
    	return newItem;
    }
    
    function haveNext( data ) {
    	return data.max !== data.min;
    }
    
    function changeLatest() {
	    stopLatestTimer();
        change( '#latest', latestData,  function() { startLatestTimer(); } );
    }
    function startLatestTimer() {
    	latestTimeout = setTimeout( function () { changeLatest(); }, latestData.change );
    }
    function stopLatestTimer() {
    	if( latestTimeout > 0 )
    		clearTimeout( latestTimeout );
    	latestTimeout = -1;
    }
    
    function changePrevious() {
    	stopPreviousTimer();
        change( '#previous', previousData, function() { startPreviousTimer(); } );
    }
    function startPreviousTimer() {
    	previousTimeout = setTimeout( function () { changePrevious(); }, previousData.change );
    }
    function stopPreviousTimer() {
    	if( previousTimeout > 0 )
    		clearTimeout( previousTimeout );
    	previousTimeout = -1;
    }
    
    function changeOldest() {
    	stopOldestTimer();
        change( '#oldest', oldestData, function() { startOldestTimer(); } );
    }
    function startOldestTimer() {
     	oldestTimeout = setTimeout( function () { changeOldest(); }, oldestData.change );
    }
    function stopOldestTimer() {
    	if( oldestTimeout > 0 )
    		clearTimeout( oldestTimeout );
    	oldestTimeout = -1;
    }
    
    function newPost(noChange, err) {
    	debug( "newPost!" );
        		
        if (opera.contexts.speeddial) {
		  	var now = new Date();
			opera.contexts.speeddial.title = "BBC News - World  (" + formatTime(now.getHours()) + ':' + formatTime(now.getMinutes()) + ")";
		}		
						
        changeLatest();
        changePrevious();
        changeOldest();
    }
    
    function _resizeHandler() {
        //var cont_h = document.getElementById('all').clientHeight;
        var cont_w = document.getElementById('all').clientWidth;
        var newSize = '';
        
        if (cont_w > 400)
        	newSize = 'large';
        else if (cont_w > 250)
        	newSize = 'big';
        else 
        	newSize = 'small';
        
        if( newSize != size )
        {
		    if( newSize == 'large' )
		    { 
				// large view
		        latestData = { min: 0, max: 0, current: -1, change: 500 };
				previousData = { min: 1, max: 3, current: -1, change: 5000 };
				oldestData = { min: 4, max: feedCount-1, current: -1, change: 3500 };
			
				changeLatest();
				changePrevious();
				changeOldest();
		    }
		    else if ( newSize == 'big' ){
		    	// big view		    	
		        latestData = { min: 0, max: 2, current: -1, change: 6000 };
				previousData = { min: 1, max: feedCount-1, current: -1, change: 3500 };
			
				changeLatest();
				changePrevious();
				stopOldestTimer();
		    }
		    else {
		    	// small view
		        latestData = { min: 0, max: feedCount-1, current: -1, change: 3500 };
			
				changeLatest();
				stopPreviousTimer();
				stopOldestTimer();
			}
			
		    document.getElementById('all').className = size = newSize;
			debug( "Size: " + newSize );
		}
    }
    
    bbcFeed = new Feed( 'http://feeds.bbci.co.uk/news/world/rss.xml', 'BBC News', 'News from the BBC', newPost, 5, parsers['rss'], feedCount );
    bbcFeed.forceUpdate();
    
    addEventListener( 'resize', _resizeHandler, false );
    _resizeHandler();
    
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
   
   		if( size == 'small' )
   		{
        	outputdate.innerHTML = formatTime(date) + '.' + formatTime(month);
        	outputclock.innerHTML = formatTime(hours) + ':' + formatTime(mins);
        }
        else if( size == 'big' )
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
   		if( debugging )
   			opera.postError( mess );
   }
   
}, false);
