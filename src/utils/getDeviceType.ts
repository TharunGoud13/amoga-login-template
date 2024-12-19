export default function getDeviceType() {
    const userAgent = navigator.userAgent || navigator.vendor;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const screenWidth = window.innerWidth;
  
    // Check for mobile devices
    if (/android/i.test(userAgent)) {
      return "Mobile";
    }
    if (/iPhone|iPod/i.test(userAgent)) {
      return "Mobile";
    }
  
    // Check for tablets
    if (/iPad/i.test(userAgent) || (isTouchDevice && screenWidth >= 600 && screenWidth <= 1024)) {
      return "Tablet"; // Include iPads and devices in tablet size range
    }
  
    // Distinguish between touchscreen laptops and tablets
    if (isTouchDevice && screenWidth > 1024) {
      return "Desktop (Touchscreen)";
    }
  
    // Default to desktop
    return "Desktop";
  }
  
  