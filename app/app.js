//
// Copyright 2014, Evothings AB
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// LightBlue Bean - Basic
// version: 1.0 - 2014-10-28
//
// This implementation makes it possible to connect to a LightBlue Bean
// and control the LED. It also fetches the temperature from the board.
//
// The LightBlue Bean needs to run the arduino sketch example named
// LightBlue Bean - Basic

document.addEventListener(
	'deviceready',
	function() { evothings.scriptsLoaded(app.initialize); },
	false);

var app = {};

app.UUID_SCRATCHSERVICE = 'a495ff20-c5b1-4b44-b512-1370f02d74de';

app.getScratchCharacteristicUUID = function(scratchNumber)
{
	return ['a495ff21-c5b1-4b44-b512-1370f02d74de',
		'a495ff22-c5b1-4b44-b512-1370f02d74de',
		'a495ff23-c5b1-4b44-b512-1370f02d74de',
		'a495ff24-c5b1-4b44-b512-1370f02d74de',
		'a495ff25-c5b1-4b44-b512-1370f02d74de'][scratchNumber - 1];
};

app.initialize = function()
{
	app.connected = false;
	// 
//				FIXFIXFIFXIFIFXIFX
	//
};

app.deviceIsLightBlueBeanWithBleId = function(device, bleId)
{
	return ((device != null) && (device.name != null) && (device.name == bleId));
};

app.connect = function(user)
{
	
	////// FIFXIIFXIXFIFX
	var BLEId = document.getElementById('BLEId').value;

	app.showInfo('Trying to connect to "' + BLEId + '"');

	app.disconnect(user);

	function onScanSuccess(device)
	{
		function onConnectSuccess(device)
		{
			function onServiceSuccess(device)
			{
				// Update user interface
				app.showInfo('Connected to <i>' + BLEId + '</i>');
				document.getElementById('BLEButton').innerHTML = 'Disconnect';
				document.getElementById('BLEButton').onclick = new Function('app.disconnect()');
				document.getElementById('localDisplay').style.display = 'block';
				document.getElementById('remoteDisplay').style.display = 'block';

				// Application is now connected
				app.connected = true;
				app.device = device;

				// Fetch current LED values.
				// app.synchronizeLeds();


				// Create an interval timer to periocally read temperature.
				//app.interval = setInterval(function() { app.readTemperature(); }, 500);
			
				app.update();

			}

			function onServiceFailure(errorCode)
			{
				// Show an error message to the user
				app.showInfo('Error reading services: ' + errorCode);
			}

			// Connect to the appropriate BLE service
			device.readServices(
				[app.UUID_SCRATCHSERVICE],
				onServiceSuccess,
				onServiceFailure);
		}

		function onConnectFailure(errorCode)
		{
			// Show an error message to the user
			app.showInfo('Error ' + errorCode);
		}

		hyper.log('Found device: ' + device.name);

		// Connect if we have found a LightBlue Bean with the name from input (BLEId)
		var found= app.deviceIsLightBlueBeanWithBleId(
			device,
			document.getElementById('BLEId').value);
		if (found)
		{
			// Update user interface
			app.showInfo('Found "' + device.name + '"');

			// Stop scanning
			evothings.easyble.stopScan();

			// Connect to our device
			app.showInfo('Identifying service for communication');
			device.connect(onConnectSuccess, onConnectFailure);
		}
	}

	function onScanFailure(errorCode)
	{
		// Show an error message to the user
		app.showInfo('Error: ' + errorCode);
		evothings.easyble.stopScan();
	}

	// Update the user interface
	app.showInfo('Scanning...');

	// Start scanning for devices

	evothings.easyble.startScan(onScanSuccess, onScanFailure);
};

app.disconnect = function(user)
{

	// If timer configured, clear.
	if (app.interval)
	{
		clearInterval(app.interval);
	}
	
	app.connected = false;
	app.device = null;

	// Hide user inteface
	document.getElementById('localDisplay').style.display = 'none';
	document.getElementById('remoteDisplay').style.display = 'none';

	// Stop any ongoing scan and close devices.
	evothings.easyble.stopScan();
	evothings.easyble.closeConnectedDevices();

	// Update user interface
	app.showInfo('Not connected');
	document.getElementById('BLEButton').innerHTML = 'Connect';
	document.getElementById('BLEButton').onclick = new Function('app.connect()');
};




app.writeDataToScratch = function(scratchNumber, data, succesCallback ,x,y,failCallback)
{
	if (app.connected)
	{
		// hyper.log('Trying to write data to scratch ' + scratchNumber);
		app.device.writeCharacteristic(
			app.getScratchCharacteristicUUID(scratchNumber),
			data,
			succesCallback(x,y),
			failCallback);
	}
	else
	{
		hyper.log('Not connected to device, cant write data to scratch.');
	}
};

app.readDataFromScratch = function(scratchNumber, successCallback, failCallback)
{
	if (app.connected)
	{
		hyper.log('Trying to read data from scratch ' + scratchNumber);
		app.device.readCharacteristic(
			app.getScratchCharacteristicUUID(scratchNumber),
			successCallback,
			failCallback);
	}
	else
	{
		hyper.log('Not connected to device, cant read data from scratch.');
	}
};

app.showInfo = function(info)
{
	hyper.log(info);
	document.getElementById('BLEStatus').innerHTML = info;
};

//
//   BEGIN GPS CODE
//

app.readGPS = function()
{
	var onSuccess = function(position) {
    /*    showInfo('Latitude: '          + position.coords.latitude       + '\n' +
              'Longitude: '         + position.coords.longitude         + '\n' +
              'Altitude: '          + position.coords.altitude          + '\n' +
              'Accuracy: '          + position.coords.accuracy          + '\n' +
              'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
              'Heading: '           + position.coords.heading           + '\n' +
              'Speed: '             + position.coords.speed             + '\n' +
              'Timestamp: '         + position.timestamp                + '\n');
              */
        //var gpsData = new Uint8Array(data);
        

        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        

        var postdata = {
	       id: "A",
	       location: [lat,long]
        };


        var str = 'Local GPS coord: ['+lat+' , '+long+']'
        hyper.log(str)
        
        document.getElementById('local').innerHTML = str

		// Write to bean scratch
				
        // Failure Callback
		function onDataWriteFailure(errorCode)
		{
			hyper.log('Failed to write data with error: ' + errorCode);
			document.getElementById('temperature').innerHTML = "scratchfail";
			setTimeout(app.disconnect(),500);
		};


		

        // hyper.log("Writing Local Position to Scratch");



        app.writeDataToScratch(
            // Scratch ID
            1,
            
            // Data
            new Float64Array([lat]), 
                               
            // Sucess Callback - S1
            function(long,postdata){
            
                //hyper.log('Sucessful Write to Scratch 1');
                
                
                
                // TEMP
//                app.readDataFromScratch(1, function(data){
//                    
//                    hyper.log('Scratch Verify');
//                    
//                    var Buffer = new Float64Array(data);
//                    
//                    hyper.log(Buffer[0]);
//                },
//                function(error){hyper.log('scrtcredafail')});
                
                
            
                app.writeDataToScratch(
                    
                    // Scratch ID
                    2,
                    
                    // Data
                    new Float64Array([long]),
                                       
                    // Sucess Callback - S2
                    function(long,postdata){

                        hyper.log('Local Device Pos Written to Scratch');
                        hyper.log("   ---   ");
                        setTimeout(app.gpsPost(postdata),5000);

                    },
                    
                    long,
                    postdata,
                    
                    // Failure Callback
                    onDataWriteFailure );
            },
            
            long,
            postdata,
            
            // Failure Callback
            onDataWriteFailure );


    }
 
    // onError Callback receives a PositionError object 
    // 
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
        document.getElementById('temperature').innerHTML = "gpserror";
    }
 
    navigator.geolocation.getCurrentPosition(onSuccess, onError);


	//app.readDataFromScratch(2, onDataReadSuccess, onDataReadFailure);
};


app.gpsPost = function(postdata) 
{
 
//    var postdata = {
//	    id: "A",
//	    location: [1,0]
//	};
    
    //postdata = JSON.stringify(postdata);
    //hyper.log(postdata);
    
    
  	// hyper.log("Setting Headers");
    
    cordovaHTTP.setHeader(
        "Content-type", "application/x-www-form-urlencoded", 
        //application/json
        //"application/x-www-form-urlencoded"
        function() {//console.log('Headers Set');
        }, 
        function() {console.log('Error Setting Headers');}
    )
    


  	// cordovaHTTP.setHeader("Content-length", postdata.length);
	hyper.log("Posting Local Pos");
    
    
    var ADDR = 'http://'+document.getElementById('IpId').value+'/'+document.getElementById('DevId').value;
    
    hyper.log(ADDR);
    
    // TODO - Set global url variable input by user
	cordovaHTTP.post(
        ADDR, 
        
        postdata
        //JSON.stringify(postdata)
        
        
        , 
        {'Authorization': 'none'}, 

		// On Success Callback
		function(response) {
		    // prints 200
		    hyper.log("Post Success");
		    //hyper.log(response.status);
            
            hyper.log("   ---   ");
            
            hyper.log("Retrieving Remote Pos");
            setTimeout(app.gpsGet(),500);

		}, 

		// On Fail Callback
		function(response) {
		    // prints 403
		    hyper.log(response.status);
		    //prints Permission denied
		    hyper.log(response.error);
		}
    );



};


app.gpsGet = function()
{

var ADDR = 'http://'+document.getElementById('IpId').value+'/'+document.getElementById('TarId').value;
    
hyper.log(ADDR);
    
//$.getJSON(
cordovaHTTP.get(
    ADDR,
    function(response) {    // On Sucess
        // Print the response status code.
        //hyper.log(response.status);
        hyper.log('Retrieval Success')
        hyper.log('   ---   ')
        
        // Convert Data To Object
        
        response.data = JSON.parse(response.data);
        // hyper.log(response.data);

        // Print the returned data in the string response.data.
        

 
                // Write to bean scratch
				
				// Callbacks
		function onDataWriteSuccess()
		{
			// Cyle Finish
            hyper.log("Remote Device Pos Written to Scratch")
            hyper.log('---------------')
			setTimeout(app.update,500);
		}

		function onDataWriteFailure(errorCode)
		{
			hyper.log('Failed to write data with error: ' + errorCode);
			document.getElementById('temperature').innerHTML = "scratchfail";
			setTimeout(app.disconnect(),500);
		}

            var lat = response.data.loc[0];
			var long = response.data.loc[1];
        
            var str = 'Local GPS coord: ['+lat+' , '+long+']'
            hyper.log(str)
        
            document.getElementById('remote').innerHTML = str
        
            hyper.log('Remote GPS Coords: ['+lat+' , '+long+']');
                
                
            // hyper.log('Writing remote data to Scratch');
        
        
	
            app.writeDataToScratch(
            // Scratch ID
            3,
            
            // Data
            new Float64Array([lat]), 
                               
            // Sucess Callback - S1
            function(long,postdata){
            
                //hyper.log('Sucessful Write to Scratch 3');
            
                app.writeDataToScratch(
                    
                    // Scratch ID
                    4,
                    
                    // Data
                    new Float64Array([long]),
                                       
                    // Sucess Callback - S2
                    onDataWriteSuccess,
                    
                    null,
                    null,
                    
                    // Failure Callback
                    onDataWriteFailure );
            },
            
            long,
            null,
            
            // Failure Callback
            onDataWriteFailure );


    },
    
    function(response) {
        hyper.log(response.error)
        hyper.log(response.status)
        console.error(response.error);
        document.getElementById('temperature').innerHTML = response.error;
    });

};






app.update = function() 
{
    hyper.log('... Refresh ...')
    hyper.log('---------------')

  app.readGPS();
};



