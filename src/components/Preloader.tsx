// 3D HashX Labs intro. Pure markup + CSS keyframes (globals.css → PRELOADER), so
// it starts on first paint, before hydration, and removes itself on a timer
// even if JS never runs. Click or any key skips it; reduced motion disables it.

const X_POINTS = "0,0 28,0 50,32 72,0 100,0 64,50 100,100 72,100 50,68 28,100 0,100 36,50";
const DEPTH = 14; // extrusion layers

function Cube({ i }: { i: number }) {
  return (
    <div className={`pl-cube pl-cube-${i}`}>
      {["f", "b", "l", "r", "t", "d"].map((f) => (
        <i key={f} className={`pl-face pl-${f}`} />
      ))}
    </div>
  );
}

export default function Preloader() {
  return (
    <>
      <div id="hx-pl" className="pl-root" aria-hidden="true">
        <div className="pl-panel pl-top" />
        <div className="pl-panel pl-bot" />
        <div className="pl-seam" />

        <div className="pl-scene">
          <div className="pl-floor" />
          <div className="pl-glow" />

          <div className="pl-lockup">
            <span className="pl-word pl-hash">HASH</span>

            <span className="pl-xwrap">
              <svg className="pl-hex" viewBox="0 0 120 120">
                <polygon points="60,4 108,32 108,88 60,116 12,88 12,32" />
              </svg>
              <span className="pl-orbit">
                <Cube i={0} />
                <Cube i={1} />
                <Cube i={2} />
              </span>
              <span className="pl-x">
                {Array.from({ length: DEPTH }, (_, j) => DEPTH - 1 - j).map((i) => (
                  <svg
                    key={i}
                    viewBox="0 0 100 100"
                    className="pl-xl"
                    style={{ transform: `translateZ(${-i * 1.6}px)` }}
                  >
                    {i === 0 && (
                      <defs>
                        <linearGradient id="pl-xg" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0" stopColor="#9cebff" />
                          <stop offset=".45" stopColor="#1a8cff" />
                          <stop offset="1" stopColor="#0057d9" />
                        </linearGradient>
                      </defs>
                    )}
                    <polygon points={X_POINTS} fill={i === 0 ? "url(#pl-xg)" : `hsl(216 100% ${42 - i * 1.8}%)`} />
                  </svg>
                ))}
              </span>
            </span>

            <span className="pl-word pl-labs">LABS</span>
          </div>

          <div className="pl-tag">
            <span>Blockchain engineering</span>
            <i className="pl-bar" />
          </div>
        </div>

      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){var el=document.getElementById('hx-pl');if(!el)return;function skip(){document.documentElement.classList.add('pl-skip');cleanup()}function cleanup(){removeEventListener('keydown',skip);el.removeEventListener('pointerdown',skip)}el.addEventListener('pointerdown',skip);addEventListener('keydown',skip);setTimeout(cleanup,2800)})();`,
        }}
      />
    </>
  );
}
