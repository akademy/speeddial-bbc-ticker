var feeds_subject = {
	names : [
/*				'Top Stories (UK)',
				'Top Stories (US & Canada)',
				'Top Stories (International)',*/
				'World',			
				'UK',				
				'Business',			
				'Politics',			
				'Health',		
				"Education & Family",
				"Science & Environment",
				"Technology",
				"Entertainment & Arts"
	],
	
	feeds : [
/*		"http://feeds.bbci.co.uk/news/rss.xml?edition=uk",
		"http://feeds.bbci.co.uk/news/rss.xml?edition=us",
		"http://feeds.bbci.co.uk/news/rss.xml?edition=int",*/
		"http://feeds.bbci.co.uk/news/world/rss.xml",
		"http://feeds.bbci.co.uk/news/uk/rss.xml",
		"http://feeds.bbci.co.uk/news/business/rss.xml",
		"http://feeds.bbci.co.uk/news/politics/rss.xml",
		"http://feeds.bbci.co.uk/news/health/rss.xml",
		"http://feeds.bbci.co.uk/news/education/rss.xml",
		"http://feeds.bbci.co.uk/news/science_and_environment/rss.xml",
		"http://feeds.bbci.co.uk/news/technology/rss.xml",
		"http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml"
	],
	
	urls : [
		/*missing
		missing
		missing */
		"http://www.bbc.co.uk/news/world/",
		"http://www.bbc.co.uk/news/uk/",
		"http://www.bbc.co.uk/news/business/",
		"http://www.bbc.co.uk/news/politics/",
		"http://www.bbc.co.uk/news/health/",
		"http://www.bbc.co.uk/news/education/",
		"http://www.bbc.co.uk/news/science_and_environment/",
		"http://www.bbc.co.uk/news/technology/",
		"http://www.bbc.co.uk/news/entertainment_and_arts/",
		""
	]
};


var feeds_region = {
	names : [
		'Africa', 		
		'Asia',				
		'Europe',			
		'Latin America',			
		'Middle East',		
		"US & Canada",
		"England",
		"Northern Ireland",
		"Scotland",
		"Wales"
	],
	
	feeds : [
		"http://feeds.bbci.co.uk/news/world/africa/rss.xml",
		"http://feeds.bbci.co.uk/news/world/asia/rss.xml",
		"http://feeds.bbci.co.uk/news/world/europe/rss.xml",
		"http://feeds.bbci.co.uk/news/world/latin_america/rss.xml",
		"http://feeds.bbci.co.uk/news/world/middle_east/rss.xml",
		"http://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml",
		"http://feeds.bbci.co.uk/news/england/rss.xml",
		"http://feeds.bbci.co.uk/news/northern_ireland/rss.xml",
		"http://feeds.bbci.co.uk/news/scotland/rss.xml",
		"http://feeds.bbci.co.uk/news/wales/rss.xml"
	],
	
	urls : [
		"http://feeds.bbci.co.uk/news/world/africa/",
		"http://www.bbc.co.uk/news/world/asia/",
		"http://www.bbc.co.uk/news/world/europe/",
		"http://www.bbc.co.uk/news/world/latin_america/",
		"http://www.bbc.co.uk/news/world/middle_east/",
		"http://www.bbc.co.uk/news/world/us_and_canada/",
		"http://www.bbc.co.uk/news/england/",
		"http://www.bbc.co.uk/news/northern_ireland/",
		"http://www.bbc.co.uk/news/scotland/",
		"http://www.bbc.co.uk/news/wales/"
	]
	
};

// http://www.bbc.co.uk/worldservice/languages/index.shtml
var feeds_language = {
	names : [
		"Arabic",
		"Azeri",
		"Bangla",
		"Burmese",
		"Chinese",
		"French",
		"Hausa",
		"Hindi",
		"Indonesia",
		/*"Kinyarwanda",
		"Kirundi",*/
		"Kyrgyz",
		"Nepali",
		"Pashto",
		"Persian",
		"Portuguese",
		"Russian",
		"Sinhala",
		"Somali",
		"Spanish",
		"Swahili",
		"Tamil",
		"Turkish",
		"Ukrainian",
		"Urdu",
		"Uzbek",
		"Vietnamese"
	],

	feeds : [
		"http://www.bbc.co.uk/arabic/index.xml",
		"http://www.bbc.co.uk/azeri/index.xml",
		"http://www.bbc.co.uk/bengali/index.xml",
		"http://www.bbc.co.uk/burmese/index.xml",
		"http://www.bbc.co.uk/zhongwen/simp/index.xml",
		"http://www.bbc.co.uk/afrique/index.xml",
		"http://www.bbc.co.uk/hausa/index.xml",
		"http://www.bbc.co.uk/hindi/index.xml",
		"http://www.bbc.co.uk/indonesia/index.xml",
		/*"http://www.bbc.co.uk/gahuza/index.xml",
		"http://www.bbc.co.uk/gahuza/index.xml",*/
		"http://www.bbc.co.uk/kyrgyz/index.xml",
		"http://www.bbc.co.uk/nepali/index.xml",
		"http://www.bbc.co.uk/pashto/index.xml",
		"http://www.bbc.co.uk/persian/index.xml",
		"http://www.bbc.co.uk/portuguese/index.xml",
		"http://wsrss.bbc.co.uk/russian/index.xml",
		"http://www.bbc.co.uk/sinhala/index.xml",
		"http://www.bbc.co.uk/somali/index.xml",
		"http://www.bbc.co.uk/mundo/index.xml",
		"http://www.bbc.co.uk/swahili/index.xml",
		"http://www.bbc.co.uk/tamil/index.xml",
		"http://www.bbc.co.uk/turkce/index.xml",
		"http://www.bbc.co.uk/ukrainian/index.xml",
		"http://www.bbc.co.uk/urdu/index.xml",
		"http://www.bbc.co.uk/uzbek/index.xml",
		"http://www.bbc.co.uk/vietnamese/index.xml"
	],
	
	urls : [
		"http://www.bbc.co.uk/arabic/",
		"http://www.bbc.co.uk/azeri/",
		"http://www.bbc.co.uk/bengali/",
		"http://www.bbc.co.uk/burmese/",
		"http://www.bbc.co.uk/zhongwen/simp/",
		"http://www.bbc.co.uk/afrique/",
		"http://www.bbc.co.uk/hausa/",
		"http://www.bbc.co.uk/hindi/",
		"http://www.bbc.co.uk/indonesia/",
		/*"http://www.bbc.co.uk/gahuza/",
		"http://www.bbc.co.uk/gahuza/",*/
		"http://www.bbc.co.uk/kyrgyz/",
		"http://www.bbc.co.uk/nepali/",
		"http://www.bbc.co.uk/pashto/",
		"http://www.bbc.co.uk/persian/",
		"http://www.bbc.co.uk/portuguese/",
		"http://www.bbc.co.uk/russian/",
		"http://www.bbc.co.uk/sinhala/",
		"http://www.bbc.co.uk/somali/",
		"http://www.bbc.co.uk/mundo/",
		"http://www.bbc.co.uk/swahili/",
		"http://www.bbc.co.uk/tamil/",
		"http://www.bbc.co.uk/turkce/",
		"http://www.bbc.co.uk/ukrainian/",
		"http://www.bbc.co.uk/urdu/",
		"http://www.bbc.co.uk/uzbek/",
		"http://www.bbc.co.uk/vietnamese/"
	]
	
};


















