import geoIp from "geoip-lite";

export const getGeolocationInfo = (req) => {
    try {
        const ip = req.ip;
        const geo = geoIp.lookup(req.ip);
        const userAgent = req.headers["user-agent"];
        const userLanguage = req.headers["accept-language"];
        const country = geo ? geo.country : "Unknown";
        const region = geo ? geo.region : "Unknown";
        const geoInfo = {
            country,
            region,
            ll: geo?.ll,
            userLanguage,
            ip,
            userAgent,
        };
        return JSON.stringify(geoInfo);
    } catch (err) {
        console.log(">> ERROR OCCURRED WHILE GETTING GEO INFO : ", err);
        return "";
    }
};
