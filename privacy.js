(() => {
  const STORAGE_KEY = "mz_cookie_consent";
  const banner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("cookie-accept");
  const rejectBtn = document.getElementById("cookie-reject");
  let analyticsLoaded = false;

  function loadAnalytics() {
    if (analyticsLoaded) return;
    const id = String(window.MZ_GA4_MEASUREMENT_ID || "").trim();
    if (!/^G-[A-Z0-9]+$/i.test(id)) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", id);
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    document.head.appendChild(script);
    analyticsLoaded = true;
  }

  function showBanner(){ if (banner) banner.classList.add("open"); }
  function hideBanner(){ if (banner) banner.classList.remove("open"); }
  function eraseAnalyticsCookies(){
    const names = document.cookie.split(";").map(v => v.trim().split("=")[0]).filter(n => n === "_ga" || n.startsWith("_ga_"));
    const host = location.hostname;
    const parts = host.split(".");
    const parent = parts.length > 2 ? "." + parts.slice(-2).join(".") : "." + host;
    names.forEach(name => {
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
      document.cookie = `${name}=; Max-Age=0; path=/; domain=${host}; SameSite=Lax`;
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.${host}; SameSite=Lax`;
      document.cookie = `${name}=; Max-Age=0; path=/; domain=${parent}; SameSite=Lax`;
    });
  }
  function setConsent(value){
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) {}
    hideBanner();
    if (value === "accepted") loadAnalytics();
    if (value === "rejected") eraseAnalyticsCookies();
  }
  window.openCookieSettings = function(){ showBanner(); return false; };
  if (acceptBtn) acceptBtn.addEventListener("click", () => setConsent("accepted"));
  if (rejectBtn) rejectBtn.addEventListener("click", () => {
    let wasAccepted = false;
    try { wasAccepted = localStorage.getItem(STORAGE_KEY) === "accepted"; } catch (e) {}
    setConsent("rejected");
    if (wasAccepted && analyticsLoaded) location.reload();
  });
  let saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
  if (saved === "accepted") loadAnalytics();
  else if (saved !== "rejected") showBanner();
})();
