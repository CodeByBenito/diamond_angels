/**
 * Diamante 3D da cena "O acesso" (WebGL / Three.js).
 * Este arquivo só é baixado quando a pessoa chega perto da cena (import dinâmico em Acesso.tsx).
 *
 * Desempenho: o custo do WebGL é proporcional aos pixels que a pedra cobre, e ele dispara quando a câmera
 * mergulha e a pedra ocupa a tela inteira. Por isso:
 *  - resolução dinâmica: quanto mais a pedra cobre a tela, menos pixels por faceta (ali as facetas são áreas
 *    lisas e enormes e a diferença não aparece), em 3 degraus para não realocar o buffer a cada quadro;
 *  - qualidade adaptativa: se o aparelho não sustenta ~45 fps, a resolução base cai um degrau (nunca sobe);
 *  - sem MSAA em telas de alta densidade (os pixels já são pequenos) e sem verniz (clearcoat), que dobra o reflexo;
 *  - desenha no mesmo relógio do GSAP/Lenis (pedra e rolagem andam no mesmo quadro, sem tremer)
 *    e só enquanto a cena está na tela e a pedra ainda aparece.
 * O progresso da rolagem chega por definirProgresso() e é suavizado aqui dentro.
 */
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
  DoubleSide,
  EdgesGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  NeutralToneMapping,
  PerspectiveCamera,
  PMREMGenerator,
  PointLight,
  Points,
  PointsMaterial,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { gsap } from "@/lib/movimento";

export interface Diamante3D {
  /** 0 = diamante inteiro na frente do título · ~0.48 = a câmera atravessa a pedra */
  definirProgresso: (p: number) => void;
  /** liga/desliga o laço de renderização (fora da tela não gasta nada) */
  ativo: (ligado: boolean) => void;
  destruir: () => void;
}

const VOLTA = Math.PI * 2;

/* Lapidação brilhante estilizada: mesa octogonal, coroa com facetas estrela, cinta e pavilhão em duas camadas. */
function geometriaBrilhante(N = 8) {
  const v = (x: number, y: number, z: number) => new Vector3(x, y, z);
  const anel = (n: number, raio: number, y: number, giro = 0) =>
    Array.from({ length: n }, (_, i) => {
      const a = (i / n) * VOLTA + giro;
      return v(Math.cos(a) * raio, y, Math.sin(a) * raio);
    });
  const MESA = 0.44;
  const mesa = v(0, MESA, 0);
  const A = anel(N, 0.56, MESA); // borda da mesa
  const Gt = anel(N * 2, 1, 0.035); // cinta, em cima
  const Gb = anel(N * 2, 1, -0.035); // cinta, embaixo
  const H = anel(N, 0.46, -0.6); // meio do pavilhão
  const culaca = v(0, -1.05, 0); // a ponta

  const pos: number[] = [];
  const tri = (a: Vector3, b: Vector3, c: Vector3) => pos.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
  const g = (j: number) => (j + N * 2) % (N * 2);

  for (let i = 0; i < N; i++) {
    const n = (i + 1) % N;
    tri(mesa, A[i], A[n]); // mesa
    tri(A[i], Gt[g(2 * i)], Gt[g(2 * i + 1)]); // coroa
    tri(A[i], Gt[g(2 * i + 1)], A[n]); // estrela
    tri(A[n], Gt[g(2 * i + 1)], Gt[g(2 * i + 2)]);
    tri(Gb[g(2 * i - 1)], Gb[g(2 * i)], H[i]); // pavilhão, facetas da cinta
    tri(Gb[g(2 * i)], Gb[g(2 * i + 1)], H[i]);
    tri(H[i], Gb[g(2 * i + 1)], H[n]);
    tri(H[i], H[n], culaca); // pavilhão, facetas principais
  }
  for (let j = 0; j < N * 2; j++) {
    const k = g(j + 1);
    tri(Gt[j], Gb[j], Gb[k]); // cinta
    tri(Gt[j], Gb[k], Gt[k]);
  }

  const geo = new BufferGeometry();
  geo.setAttribute("position", new BufferAttribute(new Float32Array(pos), 3));
  geo.computeVertexNormals();
  return geo;
}

/* Pontinho dourado macio para a poeira (textura desenhada num canvas, sem arquivo) */
function texturaBrilho() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  const gr = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, "rgba(255,244,214,1)");
  gr.addColorStop(0.35, "rgba(242,219,160,0.55)");
  gr.addColorStop(1, "rgba(242,219,160,0)");
  ctx.fillStyle = gr;
  ctx.fillRect(0, 0, 64, 64);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

export function criarDiamante(canvas: HTMLCanvasElement, aoFalhar: () => void): Diamante3D | null {
  let renderer: WebGLRenderer;
  try {
    const densa = (devicePixelRatio || 1) >= 1.5;
    renderer = new WebGLRenderer({ canvas, antialias: !densa, alpha: true, powerPreference: "high-performance" });
  } catch {
    return null; // sem WebGL: Acesso.tsx usa o diamante em SVG
  }
  const celular = matchMedia("(max-width: 760px)").matches;
  const prBase = Math.min(devicePixelRatio || 1, celular ? 1.5 : 1.75);
  let qualidade = 1; // cai para 0.8 e depois 0.65 se o aparelho não acompanhar
  let prAtual = 0;
  const aplicarResolucao = (fator: number) => {
    const pr = Math.max(0.5, Math.round(prBase * qualidade * fator * 100) / 100);
    if (pr === prAtual) return;
    prAtual = pr;
    renderer.setPixelRatio(pr);
    renderer.setSize(canvas.clientWidth || 1, canvas.clientHeight || 1, false);
  };
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NeutralToneMapping; // mantém o vermelho saturado (o ACES desbota para rosa)
  renderer.toneMappingExposure = 1;
  renderer.setClearColor(0x000000, 0);

  const cena = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const ambiente = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  cena.environment = ambiente;

  const camera = new PerspectiveCamera(32, 1, 0.05, 50);

  /* A pedra: rubi facetado (flatShading = cada faceta reflete de um jeito) + arestas douradas */
  const geo = geometriaBrilhante();
  const rubi = new MeshPhysicalMaterial({
    color: new Color("#7a0c22"),
    emissive: new Color("#3a0612"),
    emissiveIntensity: 0.55,
    metalness: 0.35,
    roughness: 0.12,
    specularIntensity: 1, // compensa o verniz removido: mesmo brilho, um reflexo a menos por pixel
    specularColor: new Color("#ffd27a"), // reflexo dourado, como a luz do camarote na pedra
    envMapIntensity: 0.9,
    flatShading: true,
    side: DoubleSide, // por dentro também tem facetas: a câmera atravessa a pedra
  });
  const arestas = new LineSegments(
    new EdgesGeometry(geo, 1),
    new LineBasicMaterial({ color: new Color("#f6dfa4"), transparent: true, opacity: 1 }),
  );
  const pedra = new Group();
  pedra.add(new Mesh(geo, rubi), arestas);
  cena.add(pedra);

  /* Luz quente de camarote: uma chave dourada, um contraluz rubi e um brilho que passeia pelas facetas */
  const chave = new DirectionalLight("#ffd590", 3);
  chave.position.set(3, 4, 5);
  const contra = new DirectionalLight("#ff3b5c", 2.2);
  contra.position.set(-4, -1, -3);
  const passeio = new PointLight("#fff0c8", 26, 8, 2);
  cena.add(chave, contra, passeio);

  /* Poeira dourada em volta (60 pontos, um único draw call) */
  const QTD = 60;
  const pts = new Float32Array(QTD * 3);
  for (let i = 0; i < QTD; i++) {
    const r = 1.5 + Math.random() * 1.8;
    const a = Math.random() * VOLTA;
    pts.set([Math.cos(a) * r, (Math.random() - 0.5) * 2.6, Math.sin(a) * r], i * 3);
  }
  const poeiraGeo = new BufferGeometry();
  poeiraGeo.setAttribute("position", new BufferAttribute(pts, 3));
  const brilho = texturaBrilho();
  const poeiraMat = new PointsMaterial({
    map: brilho,
    size: 0.09,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    opacity: 0.8,
  });
  const poeira = new Points(poeiraGeo, poeiraMat);
  cena.add(poeira);

  let degrau = 0; // 0, 1, 2: quanto da tela a pedra já cobre (resolução dinâmica)

  /* Enquadramento: a pedra ocupa ~40% da altura (ou ~62% da largura no celular em pé) */
  let distancia = 6;
  const medir = () => {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    prAtual = 0; // força reaplicar a resolução no novo tamanho
    aplicarResolucao([1, 0.75, 0.5][degrau]);
    camera.aspect = w / h;
    const tg = Math.tan(MathUtils.degToRad(camera.fov / 2));
    distancia = camera.aspect < 1 ? 1 / (0.62 * tg * camera.aspect) : 1 / (0.4 * tg);
    camera.updateProjectionMatrix();
  };
  medir();
  const ro = new ResizeObserver(medir);
  ro.observe(canvas);

  let alvo = 0;
  let atual = 0;
  let ligado = false;
  let tempo = 0;
  let mediaDt = 1 / 60;
  let lentos = 0;
  const suave = (x: number) => x * x * (3 - 2 * x);

  const desenhar = (dt: number) => {
    tempo += dt;
    atual += (alvo - atual) * (1 - Math.exp(-dt * 9)); // segue a rolagem com uma desaceleração curta

    // 0 → 0.48: a pedra gira, se inclina para mostrar a mesa e a câmera mergulha nela
    const mergulho = MathUtils.clamp(atual / 0.48, 0, 1);
    const entrada = mergulho ** 2.2; // começa calmo, acelera ao atravessar
    pedra.rotation.y = tempo * 0.35 + atual * VOLTA * 1.1;
    pedra.rotation.x = MathUtils.lerp(0.42, 0.08, suave(mergulho));
    pedra.position.y = MathUtils.lerp(celular ? -0.55 : -0.42, 0, suave(Math.min(1, mergulho * 1.6)));
    camera.position.set(0, 0, MathUtils.lerp(distancia, 0.25, entrada));
    camera.lookAt(0, pedra.position.y * 0.5, 0);

    // resolução dinâmica, com folga entre os degraus (não fica trocando se a rolagem parar no limite)
    const novo = entrada > (degrau >= 2 ? 0.5 : 0.56) ? 2 : entrada > (degrau >= 1 ? 0.18 : 0.24) ? 1 : 0;
    if (novo !== degrau) {
      degrau = novo;
      aplicarResolucao([1, 0.75, 0.5][degrau]);
    }

    passeio.position.set(Math.cos(tempo * 0.8) * 2.2, 1.2 + Math.sin(tempo * 1.3) * 0.6, Math.sin(tempo * 0.8) * 2.2);
    poeira.rotation.y = -tempo * 0.05;
    poeiraMat.opacity = 0.55 + Math.sin(tempo * 2.1) * 0.25;
    renderer.render(cena, camera);
  };

  // no relógio do GSAP: o mesmo quadro em que o Lenis e o ScrollTrigger já atualizaram a rolagem
  const quadro = (_t: number, deltaMs: number) => {
    const dt = Math.min(0.05, deltaMs / 1000);
    desenhar(dt);
    // qualidade adaptativa: ~1 s seguido abaixo de ~45 fps derruba um degrau da resolução base
    mediaDt += (dt - mediaDt) * 0.1;
    lentos = mediaDt > 1 / 45 ? lentos + 1 : 0;
    if (lentos > 50 && qualidade > 0.65) {
      qualidade = qualidade > 0.8 ? 0.8 : 0.65;
      lentos = 0;
      prAtual = 0;
      aplicarResolucao([1, 0.75, 0.5][degrau]);
    }
  };

  const perdeu = (e: Event) => {
    e.preventDefault();
    gsap.ticker.remove(quadro);
    aoFalhar();
  };
  canvas.addEventListener("webglcontextlost", perdeu);

  renderer.compile(cena, camera); // compila os shaders agora, não no primeiro quadro da cena
  desenhar(0); // primeiro quadro já desenhado (sem piscar ao aparecer)

  return {
    definirProgresso: (p) => {
      alvo = p;
    },
    ativo: (sim) => {
      if (sim === ligado) return;
      ligado = sim;
      if (sim) {
        mediaDt = 1 / 60;
        lentos = 0;
        gsap.ticker.add(quadro);
      } else gsap.ticker.remove(quadro);
    },
    destruir: () => {
      ligado = false;
      gsap.ticker.remove(quadro);
      ro.disconnect();
      canvas.removeEventListener("webglcontextlost", perdeu);
      geo.dispose();
      arestas.geometry.dispose();
      (arestas.material as LineBasicMaterial).dispose();
      rubi.dispose();
      poeiraGeo.dispose();
      poeiraMat.dispose();
      brilho.dispose();
      ambiente.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
