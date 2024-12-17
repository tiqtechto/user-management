export function routeCheck(){
    var pathname = window.location.pathname
    return pathname.replace('/','');
}

export function publicURL(){
    return window.location.origin;
}

export function isObjEmpty (obj) {
    return Object.keys(obj).length === 0;
}

export function upperFirst(string){
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

const navigateBack = () => {
  window.history.back();
};

const navigateForward = () => {
  window.history.forward();
};

export {navigateBack, navigateForward};

