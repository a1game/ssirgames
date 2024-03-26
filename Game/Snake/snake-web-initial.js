let webLatestVersion = 4; //Update this every time a new version is added. This should correspond to the version of the snake clone in v/current.

//Code in here runs before snake-mod-loader-web.js
//Useful to help set stuff up specific to the web version, that doesn't belong in the mod-loader script

window.webSnake = window.webSnake ?? {};
window.webSnake.logUrlChanges = false;

//Disable analytics
window.navigator.sendBeacon = function() {
  //Do nothing
  window.webSnake.logUrlChanges && console.log('beacon disabled');
}

//Disable google logging
window.google.log = function() {
  //Do nothing
  window.webSnake.logUrlChanges && console.log('google.log disabled');
}

window.google.logUrl = function() {
  //Do nothing
  window.webSnake.logUrlChanges && console.log('google.logUrl disabled');
}

//Update url redirects to be relative
//Commented out as this might not be needed
/*
window.webSnake.urlMap.forEach(rule => {
  const thisUrl = new URL(document.location);
  const urlStart = thisUrl.origin + thisUrl.pathname;
  rule.newUrl = thisUrl.origin + thisUrl.pathname + rule.newUrl;
});
*/

//Block urls in xhr
window.oldXhrOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function () {
  let url = makeUrlAbsolute(arguments[1]);
  
  if(window.webSnake.blockedUrls.includes(url)) {
    window.webSnake.logUrlChanges && console.log('Blocking url: ' + url);
    throw new Error('Blocking url ' + url); //Slightly sketchy to error here as it may have side effects. This seems ok in practise
  }

  return oldXhrOpen.apply(this, arguments);
};

window.oldFetch = window.fetch;

window.fetch = function(url) {
  if(typeof url === 'string') {
    let mapping = window.webSnake.urlMap.find(m=>m.oldUrl === url);

    if(mapping && mapping.newUrl) {
      window.webSnake.logUrlChanges && console.log('Redirecting url: ' + url);
      arguments[0] = mapping.newUrl;
    }
  }

  return window.oldFetch(...arguments);
}

function makeUrlAbsolute(url) {
  //If url starts with / then add https://www.google.com
  if (/^\/[^\/]/.test(url)) {
    url = "https://www.google.com" + url;
  }
  return url;
}

function switchToMobile() {
  //Add is-mobile data attribute
  let snakeContainer = document.getElementsByClassName('EjCLSb')[0];
  snakeContainer.dataset.isMobile = '';

  //Delete fullscreen button
  let fullscreenButtonOld = document.querySelector('img[src$="fullscreen_white_24dp.png"]')
  if(fullscreenButtonOld) {
    fullscreenButtonOld.remove();
  }

  let fullscreenButtonsNew = document.querySelectorAll('div.EFcTud[jsaction="zeJAAd"]');
  if(fullscreenButtonsNew.length > 0) {
    [...fullscreenButtonsNew].forEach(button => button.remove());
  }

  //Add styles needed for mobile
  let css = `
  
  /*Flexible size for snake container*/
  .EjCLSb {
    height: 100% !important;
    min-height: 0 !important;
    min-width: 0 !important;
    width: 100% !important;
  }

  /*Don't centre the snake container*/
  .yZz3de {
    position: static !important;
    left: 0 !important;
    top: 0 !important;
    transform: none !important;
  }

  /*Change keys image to swipe image*/
  .rNjvu {
    background-image: url(//www.google.com/logos/fnbx/snake_arcade/swipe.svg) !important
  }

  /*Menu modal panels don't overlap edge*/
  .T7SB3d {
    width: calc(100% - 64px) !important;
    max-width: 300px !important;
  }

  /*Buttons below menu modal dont overlap edge*/
  .wUt0xf {
    width: calc(100% - 64px) !important;
    max-width: 300px !important;
  }

  /*Current/highscore on menu modal taking up less space*/
  @media only screen and (max-width: 315px),only screen and (orientation:landscape) and (max-height:315px) {
    .bF4Gmf {
        margin-left:5% !important;
        margin-right: 5% !important;
    }
  }

  /*Current/highscore on menu modal taking up less space*/
  @media only screen and (max-width: 215px),only screen and (orientation:landscape) and (max-height:215px) {
      .bF4Gmf {
          margin-left:0% !important;
          margin-right: 0% !important;
      }
  }

  /*score on top bar less wide*/
  .HIonyd {
    width: 45px !important;
  }

  /*score on top bar less wide responsively*/
  @media only screen and (max-width: 285px), only screen and (orientation: landscape) and (max-height: 285px)
  .HIonyd {
      width: 35px !important;
      padding-left: 0 !important;
  }
  `;

  let styleElement = document.querySelector('style');
  styleElement.innerHTML = styleElement.innerHTML + css;
}