import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

const splashStyles = `
  #rota-splash {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    z-index: 2147483647;
    transition: opacity 300ms ease;
  }
  #rota-splash img {
    display: block;
    width: min(60vw, 420px);
    height: auto;
  }
  #rota-splash.is-hidden {
    opacity: 0;
    pointer-events: none;
  }
`;

const hideSplash = `
  (function () {
    var splash = document.getElementById('rota-splash');
    if (!splash) return;
    function hide() {
      splash.classList.add('is-hidden');
      setTimeout(function () { splash.remove(); }, 350);
    }
    var root = document.getElementById('root');
    if (!root) { setTimeout(hide, 2500); return; }
    var observer = new MutationObserver(function () {
      if (root.childElementCount > 0) {
        observer.disconnect();
        hide();
      }
    });
    observer.observe(root, { childList: true });
    setTimeout(hide, 5000);
  })();
`;

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <title>Rota</title>
        <link rel="preload" as="image" href="/rota-logo.jpg" />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: splashStyles }} />
      </head>
      <body>
        <div id="rota-splash">
          <img src="/rota-logo.jpg" alt="" />
        </div>
        {children}
        <script dangerouslySetInnerHTML={{ __html: hideSplash }} />
      </body>
    </html>
  );
}
