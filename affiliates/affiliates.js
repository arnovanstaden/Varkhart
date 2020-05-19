// Get Affiliate Code
const url = window.location.href;
if (url.includes("?")) {
    const affiliateCode = url.substring(url.indexOf("?") + 1, url.length);

    // Check if Affiliate Active
    if (checkAffiliateActive(affiliateCode)) {
        var fortnightAway = new Date(Date.now() + 12096e5);
        console.log(fortnightAway);
        document.cookie = `afflCode=${affiliateCode};expires=${fortnightAway.toGMTString()};path=/`;

        window.location.replace("../index.html");
    } else {
        window.location.replace("../index.html");
    }

}
//  If No Code in url
else {
    window.location.replace("../index.html");
}