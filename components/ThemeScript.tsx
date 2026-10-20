// Runs before first paint so the saved theme applies without a flash.
// The value is stored in localStorage under "kmzee-theme" (per-browser preference only).
const code = `(function(){try{var t=localStorage.getItem('kmzee-theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
