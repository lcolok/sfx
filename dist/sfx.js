void (function () {

  var currentVer = '0.0.2';

  var fileName, scripts = document.getElementsByTagName("script");
  fileName = scripts[scripts.length - 1].getAttribute("src");//获取当前运行的js的文件名


  if (this.sfx) {
    if (this.sfx.ver >= currentVer) {
      console.log(this.sfx.fileName + '已初始化，无需再加载');
      return
    } else {
      console.log(fileName + '的版本更高，将覆盖加载');
      console.warn('请运行runMeToMinify，把min.js更新到最新');
    }
  }

  var loudlinks = (function (document) {
    // Avoid `console` errors in browsers lacking a console.
    var console = window.console || {};
    console.log = console.log || function () { };
    console.error = console.error || console.log;

    // 检查浏览器是否支持音频
    if (!document.createElement('audio').canPlayType) {
      console.error('Oh man 😩! \nYour browser doesn\'t support audio awesomeness.');
      return function () { }; // return an empty function if `loudLinks` is called again.
    } else {

    }

    // Create audio element and make it awesome
    var audioPlayer = document.createElement('audio'),
      audioSource = document.createElement('source'),
      eventsSet = false,
      typeReg = /{{type}}/gi, // regEx for replacing {{type}} in the URLs
      mp3Location = 'sounds/mp3/'// mp3 sounds location

    audioPlayer.setAttribute('preload', true); //音频元素预加载属性
    // audioSource.setAttribute('type', 'audio/mpeg');

    // appending the sources to the player element
    audioPlayer.appendChild(audioSource);

    // appending audioplayer to body
    document.body.appendChild(audioPlayer);

    // Play audio
    function playAudio() {
      // get the audio source and appending it to <audio>
      var audioSrc = this.getAttribute('data-sound') || this.getAttribute('data-src') || this.getAttribute('src'), // prefer `data-sound` attribute, but allow for backwards compatibility with `data-src`
        soundMp3Link; // getting the sound name from the data-sound Attribute

      // check if the data-sound Attribute is filled (there is a name of a sound file), or exit
      if (!audioSrc) { return; }


      /*     if (audioSrc.indexOf('{{type}}') > 0) {
            // Replace all instances of '{{type}}' in the data-sound attribute to 'mp3' and 'ogg' respectfully.
            // For example: http://loudlinks.rocks/sounds/{{type}}/magic.{{type}} becomes http://loudlinks.rocks/sounds/mp3/magic.mp3 and http://loudlinks.rocks/sounds/ogg/magic.ogg
            soundMp3Link = audioSrc.replace(typeReg, 'mp3');
          } else { // Allow for the original relative URLs
            soundMp3Link = mp3Location + audioSrc + '.mp3';
          }
      
          // Only set the `error` events once.
          if (!eventsSet) {
            eventsSet = true;
            audioSource.addEventListener('error', function () {
              console.error('😶 D\'oh! The mp3 file URL is wrong!');
            });
          }
      
          // Only reset `src` and reload if source is different
          if (audioSource.src !== soundMp3Link) {
            audioSource.setAttribute('src', soundMp3Link); // putting the mp3 sound link in the src Attribute of <source>
            audioPlayer.load();
          } */

      audioSource.setAttribute('src', audioSrc); // putting the mp3 sound link in the src Attribute of <source>
      audioPlayer.load();

      audioPlayer.play();
    }

    // Stop audio
    function stopAudio() {
      audioPlayer.pause();
      audioPlayer.currentTime = 0; // reset to beginning
    }

    // Add `hover` related event listeners
    function trackHover(element) {
      element.addEventListener('mouseenter', playAudio); // play audio on hover
      element.addEventListener('mouseleave', stopAudio); // stop audio on mouse out
      element.addEventListener('touchmove', stopAudio); // stop audio on touch and move
      element.addEventListener('click', stopAudio); // stop audio on click
    }

    // Add `click` event listeners
    function trackClick(element) {
      element.addEventListener('click', playAudio);
    }

    // Go crazy! Scan all the links and see if they have the 'data-sound' Attribute and attach the events
    function loudlinks() {
      var hoverLinks = document.querySelectorAll('.loud-link-hover,.sfx-hover'),
        clickLinks = document.querySelectorAll('.loud-link-click,.sfx-click'),
        hoverLength = hoverLinks.length,
        clickLength = clickLinks.length,
        i;

      for (i = 0; i < hoverLength; i++) { trackHover(hoverLinks[i]); } // Hover
      for (i = 0; i < clickLength; i++) { trackClick(clickLinks[i]); } // Click

      return loudlinks;
    }

    return loudlinks();

  })(document);


  this.sfx = {
    ver: currentVer,
    fileName: fileName,
    play: function (input) {
      var matchedURL = input.match(/(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/gm);
      if (matchedURL) {
        this.playByURL(matchedURL);
        return
      }


    },
    playByURL: function (url_data) {
      var con = new AudioContext();
      var req = new XMLHttpRequest();
      req.open('GET', url_data, true);
      req.responseType = 'arraybuffer';
      req.onload = function () {
        con.decodeAudioData(req.response, function (buffer) {
          var source = con.createBufferSource();
          source.buffer = buffer;
          source.connect(con.destination);
          source.start(0);
        }, function (e) {
          console.info('错误');
        });
      }
      req.send();
    },

  }

  var src = document.currentScript.src;
  console.log(src);//获取当前运行的js的路径

  var scriptVersion = src.match(/\@([0-9]+\.*)*/gm);

  console.log('已加载sfx,当前版本为' + scriptVersion);
})();