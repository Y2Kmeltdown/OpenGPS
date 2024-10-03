function convertGoogleMapsLink()
{
	toggleError(false);
	
	try
	{
		var text = $('#maplink').val();
		
		// Check if the link starts with a http or https
		if( text.substr(0, 7) !== "http://" && text.substr(0, 8) !== "https://" )
		{
			toggleError(true, "Link does not look to be a valid Google Maps directions link.");
			return;
		}
		
		if( text.indexOf("maps/place") != -1 )
		{
			toggleError(true, "This link is not valid as it only refers to a single place and not directions between two or more places.");
			return;
		}
				
		var g_idx= text.indexOf("/maps/dir/");
		if( g_idx == -1 )
		{
			// Ok so it is not a long link, maybe it is a shortened one (https://goo.gl/maps/bWmHpSmnWGE2)? or the new https://maps.app.goo.gl/sA9oL2awJYPbfs4x9 format
      g_idx = text.indexOf("goo.gl/maps");
      if( g_idx == -1 ) {
        g_idx = text.indexOf("maps.app.goo.gl/");
      }

			if( g_idx == -1 )
			{
				toggleError(true, "Link does not look to be a valid Google Maps directions link.");
				return;
			}
		}
		else
		{
			// Adjust the long link to point only to the data part
			g_idx = g_idx + 10;
			
			// Validate that the full link has no empty sections before we pass it along (this will also be caught by the core conversion logic for short urls)
			var link_sections = text.substring(g_idx).split("/");
			
			// Skip the first section as it can be a valid directions link if it is empty
			for (i=1; i<link_sections.length; ++i) 
			{
				var section = link_sections[i];
				console.log(section);
				if( section == null || section.replace('\'','').trim().length <= 1 )
				{
					toggleError(true, "This maps link has missing data. To maintain maximum accuracy, there must not be any empty sections between \'/\'.");
					return;
				}	
			}
		}
		
		// Check to see if the url contains the weird xxxxxxxxxxx section, I don´t know why this appears in 
		// the urls... 
		if( text.toLowerCase().indexOf("xxxxxxxxxxx") != -1 )
		{
			toggleError(true, "The map link is invalid, there is a crossed out section \'xxxxxxxxxxx\' present. Please attempt to copy link again.");
			return;
		}
		
		var g_data = text.substring(g_idx);
				
		var pointOutType = $('input#pointType2').is(':checked') ? "track": $('input#pointType3').is(':checked') ? "fixed" : "route";
		var isJson = $('input#outputType2').is(':checked');
		
		var isNextTurnOn = $('input#nextTurnOn').is(':checked');
		var isDirectionsOn = $('input#directionsOn').is(':checked');
		var useDirectionsAsWptNames = isDirectionsOn && $('input#directionsAsWptNamesOn').is(':checked');
		
		var isCreateWaypointsOn = $('input#createWaypoints').is(':checked');
		var isCustomRouteNameOn = $('input#customRouteName').is(':checked');
      
    var isIncludeElevationOn = $('input#retrieveElevationData').is(':checked');
		
		var customRouteName = $('#customRouteNameText').val();
		var isLanguageSelected = $('input#language').is(':checked');
		var language = $("#languageValue").children("option").filter(":selected").val()
				
		var customRouteQueryString = "";
		if( isCustomRouteNameOn && customRouteName != null && customRouteName.trim().length > 0 )
			customRouteQueryString = "&rn="+encodeURIComponent(customRouteName);
			
		var date_str = moment().format("YYYYMMDD_HHmmss");
				
		var qs_data = encodeURIComponent(g_data);
		var base_url = window.location.origin + "/";
		var url = base_url+"load.php?d=default&lang="+(isLanguageSelected ? language : "en")+"&elev="+(isIncludeElevationOn? "on":"off")+"&tmode=off&pttype="+pointOutType+"&o="+(isJson ? "json": "gpx")+"&cmt="+(isNextTurnOn ? "on": "off")+"&desc="+(isDirectionsOn ? "on": "off")+"&descasname="+(useDirectionsAsWptNames ? "on": "off")+"&w="+(isCreateWaypointsOn ? "on": "off")+customRouteQueryString+"&dtstr="+date_str+"&gdata="+qs_data;
		
		window.location = url;
	}
	catch( e )
	{
		toggleError(true, e);
	}
}