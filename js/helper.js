function getTrainingModeFromLocal() {
    return localStorage.getItem("lastTrainingMode") || null;
}

function storeTrainingMode(mode){
    localStorage.setItem("lastTrainingMode", mode);
}