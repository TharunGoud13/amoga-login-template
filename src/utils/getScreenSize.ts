export default function getScreenSize(){
    const width = window.screen.width;
    const height = window.screen.height;
    return {width, height};
}