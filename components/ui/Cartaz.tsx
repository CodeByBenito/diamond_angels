/**
 * Cartaz gerado para eventos ainda sem foto: luzes desfocadas em ouro sobre vinho,
 * diferentes para cada evento (a semente é o id) e iguais no servidor e no navegador.
 */
function sementeDe(txt: string) {
  let h = 2166136261;
  for (let i = 0; i < txt.length; i++) h = Math.imul(h ^ txt.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

export default function Cartaz({ id }: { id: string }) {
  const rnd = sementeDe(id);
  const luzes = Array.from({ length: 16 }, () => ({
    x: rnd() * 400,
    y: rnd() * 500,
    r: 8 + rnd() * 46,
    o: 0.12 + rnd() * 0.45,
    ouro: rnd() > 0.25,
  }));
  const giro = Math.round(rnd() * 360);
  const g = `c-${id}`;

  return (
    <svg className="cartaz" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id={`${g}-fundo`} cx="50%" cy="30%" r="80%" gradientTransform={`rotate(${giro} .5 .5)`}>
          <stop offset="0" stopColor="#6d1224" />
          <stop offset=".55" stopColor="#2a070f" />
          <stop offset="1" stopColor="#0a0708" />
        </radialGradient>
        <filter id={`${g}-blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      <rect width="400" height="500" fill={`url(#${g}-fundo)`} />
      <g filter={`url(#${g}-blur)`}>
        {luzes.map((l, i) => (
          <circle
            key={i}
            cx={l.x.toFixed(1)}
            cy={l.y.toFixed(1)}
            r={l.r.toFixed(1)}
            fill={l.ouro ? "#f2dba0" : "#c43a55"}
            opacity={l.o.toFixed(2)}
          />
        ))}
      </g>
      <image href="/logo-mark.webp" x="150" y="190" width="100" height="100" opacity=".9" />
    </svg>
  );
}
