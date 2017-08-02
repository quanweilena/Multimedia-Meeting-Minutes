  document.addEventListener("deviceready",onDeviceReady,false);  
  
    function onDeviceReady() {  
        navigator.notification.confirm(  
            //    'Do u wanna search music in ur phone?',  
                'Do u wanna search record in ur phone?',  
                confirmSusscess,  
             //   'search music files',  
                'search record files',
                "yes, no"  
        );  
          
        document.addEventListener("menubutton", function(){  
            navigator.notification.confirm(  
                'what can i do for u?',  
                function(button){  
                    if(button == '1') {  
                        stopAudio();  
                        confirmSusscess('1');  
                    }  
                },  
                'choose service',  
                'refresh,nothing');  
        }, false);  
    }  
      
    var phmedia = null;  
    var mediaTimer = null;  
      
    var totalTime = 0;  
    var nowPlayId = -1;  
    var totalPlayId = 0;  
      
    var accOneEnd = true;  
    var lastAccelerometer = 0;  
      
    var confirmSusscess = function (button) {  
        if(button == '1') {  
            $('#sp').html('process...');  
            $('#playBtn').attr('style','');  
            $('#stopBtn').attr('style','');  
              
            // file  
            window.requestFileSystem(LocalFileSystem.PERSISTENT,0,  
                function(fileSystem){  
                    fileSystem.root.createReader().readEntries(  
                        function(entries){  
                                var i=0;  
                                var targetMusicFolder = '';  
                                var musicDirectory = null;  
                                // look up music folder  
                                for (;i<entries.length;i++) {  
                                // this music decide which fold to look at	
                                 //   if('music' == entries[i].name) {  
                                     if('record' == entries[i].name) { 
                                	//	 if('My Documents\My Recordings'==entries[i].name) { 
                                        targetMusicFolder = entries[i].fullPath;  //all music's path
                                        musicDirectory = entries[i];  
                                    }  
                                }  
                                  
                                if(!targetMusicFolder) {  
                                    $('#sp').html("*** no folder named record in your phone.");  
                                }
                                else {  
                          //         $('#sp').html("*** looking up music in folder:<br/>" + targetMusicFolder);  
                                	$('#sp').html("");
                                }  
                                  
                                if(musicDirectory && musicDirectory.isDirectory) {  
                                    musicDirectory.createReader().readEntries(  
                                       function(entries){  
                                        totalPlayId=entries.length;  
                                  //      $('#sp').html($('#sp').html()+"<br/>"+"*** found music list("+totalPlayId+"):<br/>");  
                                        $('#sp').html($('#sp').html()+"<br/>"+" found record list("+totalPlayId+"):<br/>"); 
                                            for (var i=0;i<totalPlayId;i++) {  
                                                $('#sp').html($('#sp').html() + "<br/>" +   
                                                    "<span id='m"+i+"' onclick=\"chooseMusic("+i+",'"+ entries[i].toURI() +"','"+entries[i].name+"')\">"   
                                                    + entries[i].name   
                                                    + "</span><hr style='border:1px dotted gray'/>");  
                                            }  
                                        },   
                                        function(error){  
                                           // alert('no music or not found in your phone.'+error.code);  
                                        	alert('no record or not found in your phone.'+error.code); 
                                        });  
                                }  
                        },   
                          
                        function(error){  
                            alert('can not read your file system:'+error.code);  
                        });  
                },  
                  
                function(evt){  
                    alert('get audio files failed!'+evt.target.error.code);           
                }  
            );  
          
       var watchId = navigator.accelerometer.watchAcceleration(  
                function(ac){  
                    if(totalPlayId > 0) {  
                        if(nowPlayId < 0 || !accOneEnd) {  
                            return;  
                        }  
                          
                        x = ac.x;  
                        if (x <= 1 && x >= -1) {  
                            lastAccelerometer = x;  
                            return;  
                        }  
                          
                        if(lastAccelerometer >= 1 || lastAccelerometer <= -1) {  
                            lastAccelerometer = x;  
                            return;  
                        }  
                          
                        lastAccelerometer = x;  
                        if(x > 1) {  
                            // pre  
                            var id = nowPlayId - 1;  
                            if (id < 0) {  
                                id=0;  
                            }  
                            chooseMusicById(id);  
                        } else if (x < -1) {  
                            // next  
                            var id = nowPlayId + 1;  
                            if(id >= totalPlayId) {  
                                id = totalPlayId - 1;  
                            }  
                            chooseMusicById(id);  
                        }  
                    }  
                },  
                function(){  
                    alert('accelerometer error.');  
                },  
                {frequency:600}  
            );  
        }  
    }  
      
    function chooseMusicById (id) {  
        accOneEnd = false;  
        chooseMusic(id, $('#m'+id).text(), $('#m'+id).text());  
        accOneEnd = true;  
    }  
      
    function chooseMusic(id, src, name) {  
        // media  
        $('span').each(function(index){  
            if(index == id) {  
                $('#m'+id).attr('style','color:blue;font-weight:bold;');  
                nowPlayId = id;  
            } else {  
                $('#m'+index).attr('style','');  
            }  
        });  
          
        $('#mediaNameDIV').html('choose:'+name).attr('style','color:red;padding-top:10px;');  
          
        stopAudio();  
        
     //   loadAudio('music/'+name);//'/android_asset/www/p1rj1s_-_rockGuitar.mp3 (no change with M and m)'  
     
        loadAudio('record/'+name); 
        //need load follow the route
      //  loadAudio('My Documents\My Recordings/'+name);
    }  
      
    var musicStatus = 0;// 0:ready;1:run;2:pause;3:stop  
    function loadAudio(src) {  
        if(!src) {  
            alert('play choose a audio.');  
            return;  
       }  
          
        if(null == phmedia) {  
            phmedia = new Media(src,   
                function(){  
                    if(musicStatus == 1) {  
                        afterPlay()();  
                    }  
                },   
                function(error) {  
                    phmedia = null;  
                    navigator.notification.alert(  
                       'So sorry, something wrong!code:'+error.code,  
                       alertSuccess,  
                        'failed',  
                        'I don\'t mind.'  
                   );  
                },  
                function(s){  
                    status = s;  
                }  
            );  
        }  
    }  
      
    var stopAudio = function() {  
        if(phmedia) {  
            phmedia.stop();  
            phmedia.release();  
           phmedia = null;  
           afterPlay();  
       }  
    }  
      
    var afterPlay = function() {  
        musicStatus = 3;  
          
        if(null != mediaTimer) {  
            clearInterval(mediaTimer);  
        }  
              
        $('#pauseBtn').attr('style','display:none;');  
        $('#playBtn').attr('style','');  
          
        $('#mediaInfoDIV').html('');  
        $('#mediaTimeDIV').html('');  
          
       $('#mp').css('width','0px');  
    }  
      
    var pauseAudio = function () {  
        if(phmedia) {  
            phmedia.pause();  
            musicStatus = 2;  
            if(null != mediaTimer) {  
                clearInterval(mediaTimer);  
            }  
              
            $('#pauseBtn').attr('style','display:none;');  
           $('#playBtn').attr('style','');  
        }  
    }  
      
    var playAudio = function() {  
        if(phmedia) {  
              
            var dtt = 0;  
            totalDurationTimerId = setInterval(function(){  
                dtt = dtt + 200;  
                if(dtt > 2000) {clearInterval(totalDurationTimerId);}  
                  
                var durSec = phmedia.getDuration();  
                if(durSec > 0) {  
                    clearInterval(totalDurationTimerId);  
                    $('#mediaInfoDIV').html("/"+Math.round(durSec)+" sec.");  
                    totalTime = durSec;  
                }  
            }, 200);  
              
           phmedia.play();  
            musicStatus = 1;  
              
            $('#pauseBtn').attr('style','');  
          $('#playBtn').attr('style','display:none;');  
              
            mediaTimer = setInterval(setPosition, 1000);  
        } else {  
            alert('choose a music please!');  
        }  
    }  
      
    function setPosition() {  
        if(null == phmedia) return;  
        phmedia.getCurrentPosition(  
            function(position){  
                if(0 > position) {  
                    clearInterval(mediaTimer);  
                    mediaTimer = null;  
               }  
                  
                $('#mediaTimeDIV').html(Math.round(position));  
                  
                var piTimeCount=0;  
                var pi = setInterval(function(){  
                    piTimeCount = piTimeCount + 200;  
                    if (piTimeCount > 2000) {  
                        clearInterval(pi);  
                    }  
                    if(totalTime > 0) {  
                        clearInterval(pi);  
                        var w = position / totalTime * 100;  
                        var width = w + '%';  
                          
                        $('#mp').css('width',width);  
                    }  
                }, 200);  
            },  
            function(e){  
                $('#mediaTimeDIV').html("Error:"+e);  
            }  
        );  
    }  
      
    function alertSuccess() {  
    }  