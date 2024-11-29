import { LOG_DATA, NEXT_PUBLIC_API_KEY } from "@/constants/envConfig";
import getCurrentBrowser from "./getCurrentBrowser";
import getUserOS from "./getCurrentOs";
import getDeviceType from "./getDeviceType";
import getGeoLocation from "./getGeoLocation";
import getScreenSize from "./getScreenSize";
import IpAddress from "./getIpAddress";

export const trackPageView = async (data: any) => {
  
  const locationData:any = await getGeoLocation();

  const payload = {
    user_ip_address: await IpAddress(),
    browser: getCurrentBrowser(),
    operating_system: getUserOS(),
    device: getDeviceType(),
    custom_one: getScreenSize(),
    created_at_geo: locationData?.latitude + " " + locationData?.longitude,
    geo_location: locationData?.latitude + " " + locationData?.longitude,
    city: locationData?.address?.town,
    state: locationData?.address?.state,
    country: locationData?.address?.country,
    geo_codes: locationData?.address?.postcode,
    zip_code: locationData?.address?.postcode,
    
    ...data,
  };
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${NEXT_PUBLIC_API_KEY}`,
    },
    body: JSON.stringify(payload),
  };
  const response = await fetch(LOG_DATA, requestOptions);
  if (!response.ok) {
    throw new Error("Failed to track page view");
  }
};
