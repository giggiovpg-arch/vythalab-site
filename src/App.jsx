import { useState, useEffect, useRef, useCallback } from "react";

/* ─── CSS ─────────────────────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Syne:wght@500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  html{scroll-behavior:smooth;}
  body{
    background:#050510;
    color:#F0F0FF;
    font-family:'Manrope',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
    line-height:1.75;
    overflow-x:hidden;
    letter-spacing:-0.01em;
    -webkit-font-smoothing:antialiased;
    text-rendering:optimizeLegibility;
  }
  :root{
    --void:#050510;--surface:#0E0F23;
    --glass:rgba(14,15,35,0.65);
    --border:rgba(255,255,255,0.07);
    --border-bright:rgba(255,255,255,0.13);
    --violet:#7B5CFF;--violet-g:rgba(123,92,255,0.22);
    --cyan:#4FD1FF;--cyan-g:rgba(79,209,255,0.18);
    --magenta:#FF4FD8;--magenta-g:rgba(255,79,216,0.14);
    --ready:#4ADE80;--strain:#FF6B8A;--caution:#FBBF24;
    --text:#F0F0FF;--muted:rgba(240,240,255,0.52);--dim:rgba(240,240,255,0.3);
  }
  h1,h2,h3,h4{
    text-wrap:balance;
  }

  p{
    color:rgba(240,240,255,0.72);
  }
  .syne{
    font-family:'Syne',sans-serif;
    letter-spacing:-0.035em;
  }
  .mono{
    font-family:'JetBrains Mono',monospace;
  }
  .glass{background:var(--glass);backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px);border:1px solid var(--border);border-radius:16px;transition:border-color 0.25s;}
  .glass:hover{border-color:var(--border-bright);}
  .grad-vio{background:linear-gradient(120deg,#fff 0%,#A78BFF 45%,var(--cyan) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
  .grad-aurora{background:linear-gradient(120deg,var(--violet) 0%,var(--cyan) 50%,var(--magenta) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
  .pill{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:100px;font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;}
  .sep{height:1px;background:linear-gradient(90deg,transparent,var(--border-bright),transparent);}
  .fade-in{opacity:0;transform:translateY(28px);transition:opacity .75s ease,transform .75s ease;}
  .fade-in.vis{opacity:1;transform:translateY(0);}
  .btn-shine{position:relative;overflow:hidden;}
  .btn-shine::after{content:'';position:absolute;top:0;left:-100%;width:55%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.14),transparent);transform:skewX(-20deg);transition:left .42s ease;}
  .btn-shine:hover::after{left:160%;}
  .grid-bg{background-image:linear-gradient(rgba(255,255,255,0.024) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.024) 1px,transparent 1px);background-size:64px 64px;}
  .blob{position:absolute;border-radius:50%;filter:blur(90px);pointer-events:none;}
  ::-webkit-scrollbar{width:4px;}
  ::-webkit-scrollbar-thumb{background:rgba(123,92,255,0.45);border-radius:2px;}
  @keyframes aurora1{0%,100%{transform:translate(0,0) scale(1);}33%{transform:translate(6%,12%) scale(1.15);}66%{transform:translate(-4%,5%) scale(.92);}}
  @keyframes aurora2{0%,100%{transform:translate(0,0) scale(1);}33%{transform:translate(-9%,4%) scale(1.08);}66%{transform:translate(7%,-9%) scale(1.1);}}
  @keyframes aurora3{0%,100%{transform:translate(0,0) scale(1);}50%{transform:translate(5%,-7%) scale(1.06);}}
  @keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);}}
  @keyframes slideIn{from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);}}
  @keyframes pulseDot{0%,100%{box-shadow:0 0 0 0 rgba(74,222,128,.5);}70%{box-shadow:0 0 0 14px rgba(74,222,128,0);}}
  @keyframes shimmer{0%{background-position:-200% center;}100%{background-position:200% center;}}
  @media(max-width:768px){
    .hero-g{grid-template-columns:1fr!important;}
    .feat-g{grid-template-columns:1fr!important;}
    .price-g{grid-template-columns:1fr!important;}
    .phil-g{grid-template-columns:1fr!important;}
    .vis-g{grid-template-columns:1fr!important;}
    .nav-links{display:none!important;}
    .hide-sm{display:none!important;}
    .hero-h{font-size:40px!important;}
  }
`;

/* ─── Hook: Intersection Observer ──────────────────────────────────────────── */
function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.IntersectionObserver) { setVis(true); return; }
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis];
}

/* ─── Nav ─────────────────────────────────────────────────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);
  const navLinks = ['Produto', 'Funcionalidades', 'Roadmap', 'Preços'];
  return (
    <nav style={{
      position:'sticky',top:0,zIndex:100,padding:'0 24px',
      transition:'all .3s',
      background:scrolled?'rgba(5,5,16,.85)':'transparent',
      backdropFilter:scrolled?'blur(22px)':'none',
      borderBottom:scrolled?'1px solid rgba(255,255,255,.07)':'1px solid transparent',
    }}>
      <div style={{maxWidth:1200,margin:'0 auto',display:'flex',alignItems:'center',height:64,gap:40}}>
        <div className="syne" style={{display:'flex',alignItems:'center',gap:10,flex:'0 0 auto'}}>
          <div style={{width:32,height:32,borderRadius:8,background:'linear-gradient(135deg,#7B5CFF,#4FD1FF)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,color:'white',boxShadow:'0 0 20px rgba(123,92,255,.5)'}}>⬡</div>
          <span style={{fontSize:18,fontWeight:700,letterSpacing:'-.03em'}}>Vytha<span style={{color:'var(--violet)'}}>Lab</span></span>
        </div>
        <div className="nav-links" style={{display:'flex',gap:32,marginLeft:8}}>
          {navLinks.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{color:'var(--muted)',fontSize:14,fontWeight:500,textDecoration:'none',transition:'color .2s'}}
              onMouseEnter={e=>e.target.style.color='var(--text)'} onMouseLeave={e=>e.target.style.color='var(--muted)'}>{l}</a>
          ))}
        </div>
        <div style={{marginLeft:'auto',display:'flex',gap:12,alignItems:'center'}}>
          <span style={{fontSize:12,color:'var(--dim)',fontFamily:'Space Mono,monospace'}}>em breve</span>
          <button className="btn-shine" style={{background:'var(--violet)',color:'white',padding:'9px 22px',borderRadius:8,border:'none',fontSize:13,fontWeight:600,cursor:'pointer',boxShadow:'0 0 26px rgba(123,92,255,.4)',transition:'all .2s'}}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-1px)';e.currentTarget.style.boxShadow='0 4px 40px rgba(123,92,255,.6)';}}
            onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 0 26px rgba(123,92,255,.4)';}}>
            Acesso antecipado
          </button>
        </div>
      </div>
    </nav>
  );
}

/* ─── Hero ─────────────────────────────────────────────────────────────────── */
function Hero() {
  const [score, setScore] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      let c = 0;
      const id = setInterval(() => { c = Math.min(c+2,76); setScore(c); if(c>=76) clearInterval(id); }, 28);
    }, 700);
    return () => clearTimeout(t);
  }, []);

  const R = 72, C = 2*Math.PI*R;
  const off = C - C*score/100;
  const angle = (-90 + score*3.6)*Math.PI/180;
  const dotX = 100 + R*Math.cos(angle);
  const dotY = 100 + R*Math.sin(angle);

  return (
    <section style={{position:'relative',padding:'72px 24px 100px',overflow:'hidden'}}>
      <div className="blob" style={{width:640,height:640,top:-160,left:-120,background:'radial-gradient(circle,rgba(123,92,255,.2) 0%,transparent 70%)',animation:'aurora1 21s ease-in-out infinite'}}/>
      <div className="blob" style={{width:520,height:520,top:-40,right:-160,background:'radial-gradient(circle,rgba(79,209,255,.15) 0%,transparent 70%)',animation:'aurora2 26s ease-in-out infinite'}}/>
      <div className="blob" style={{width:380,height:380,bottom:-60,left:'45%',background:'radial-gradient(circle,rgba(255,79,216,.12) 0%,transparent 70%)',animation:'aurora3 19s ease-in-out infinite'}}/>

      <div style={{maxWidth:1200,margin:'0 auto',position:'relative',zIndex:2}}>
        <div className="hero-g" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:72,alignItems:'center'}}>

          {/* Left */}
          <div style={{animation:'slideIn .8s ease forwards'}}>
            <div style={{display:'flex',gap:8,marginBottom:28,flexWrap:'wrap'}}>
              <span className="pill" style={{background:'rgba(123,92,255,.14)',border:'1px solid rgba(123,92,255,.3)',color:'#A78BFF'}}>⬡ Performance OS</span>
              <span className="pill" style={{background:'rgba(79,209,255,.1)',border:'1px solid rgba(79,209,255,.25)',color:'var(--cyan)'}}>Claude AI Engine</span>
            </div>

            <h1
              className="syne hero-h"
              style={{
                fontSize:64,
                fontWeight:800,
                lineHeight:1.08,
                letterSpacing:'-.045em',
                marginBottom:26,
                maxWidth:640,
              }}>
              Seu corpo,<br/><span className="grad-vio">finalmente</span><br/>compreendido.
            </h1>

            <p
              style={{
                fontSize:18,
                color:'rgba(240,240,255,0.78)',
                lineHeight:1.9,
                maxWidth:560,
                marginBottom:40,
                fontWeight:500,
              }}>
              Biometria inteligente que interpreta, não apenas registra.
              Uma camada de inteligência fisiológica que vive entre seu corpo e suas decisões.
            </p>

            <div style={{display:'flex',gap:12,marginBottom:44,flexWrap:'wrap'}}>
              <button className="btn-shine" style={{background:'linear-gradient(135deg,#7B5CFF,#9B7AFF)',color:'white',padding:'14px 34px',borderRadius:10,border:'none',fontSize:15,fontWeight:600,cursor:'pointer',boxShadow:'0 0 44px rgba(123,92,255,.45)',transition:'all .25s'}}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 8px 60px rgba(123,92,255,.6)';}}
                onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 0 44px rgba(123,92,255,.45)';}}>
                Acesso antecipado →
              </button>
              <button style={{background:'transparent',color:'var(--muted)',padding:'14px 28px',borderRadius:10,border:'1px solid rgba(255,255,255,.1)',fontSize:15,fontWeight:500,cursor:'pointer',transition:'all .2s'}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,.2)';e.currentTarget.style.color='var(--text)';}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,.1)';e.currentTarget.style.color='var(--muted)';}}>
                Ver demo
              </button>
            </div>

            <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
              {['Expo SDK 54','React Native','TypeScript 5.9','Supabase','Claude AI','EAS Build'].map(t=>(
                <span key={t} className="mono" style={{padding:'4px 10px',borderRadius:6,background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.07)',fontSize:11,color:'var(--dim)'}}>{t}</span>
              ))}
            </div>
          </div>

          {/* Right: Biometric card */}
          <div style={{display:'flex',justifyContent:'center',animation:'slideIn .8s ease .2s both'}}>
            <div className="glass" style={{padding:28,width:'100%',maxWidth:380,boxShadow:'0 0 80px rgba(123,92,255,.18)',animation:'float 7s ease-in-out infinite'}}>
              {/* Header */}
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:22}}>
                <div>
                  <div style={{fontSize:10,color:'var(--dim)',textTransform:'uppercase',letterSpacing:'.09em',marginBottom:2}}>Prontidão hoje</div>
                  <div style={{fontSize:13,color:'var(--muted)'}}>Terça, 19 de maio</div>
                </div>
                <div style={{width:8,height:8,borderRadius:'50%',background:'var(--ready)',boxShadow:'0 0 8px var(--ready)',animation:'pulseDot 2s infinite'}}/>
              </div>

              {/* Score dial SVG */}
              <div style={{display:'flex',justifyContent:'center',marginBottom:22,position:'relative'}}>
                <svg width={200} height={200} viewBox="0 0 200 200">
                  <defs>
                    <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#7B5CFF"/>
                      <stop offset="100%" stopColor="#4ADE80"/>
                    </linearGradient>
                  </defs>
                  <circle cx={100} cy={100} r={82} fill="none" stroke="rgba(74,222,128,.04)" strokeWidth={22}/>
                  <circle cx={100} cy={100} r={R} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth={8}/>
                  <circle cx={100} cy={100} r={R} fill="none" stroke="url(#sg)" strokeWidth={8}
                    strokeLinecap="round" strokeDasharray={C} strokeDashoffset={off}
                    transform="rotate(-90 100 100)" style={{transition:'stroke-dashoffset .03s linear'}}/>
                  {score>2 && <circle cx={dotX} cy={dotY} r={5} fill="#4ADE80" style={{filter:'drop-shadow(0 0 6px #4ADE80)'}}/>}
                </svg>
                <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                  <span className="syne mono" style={{fontSize:52,fontWeight:800,lineHeight:1}}>{score}</span>
                  <span style={{fontSize:10,color:'var(--ready)',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',marginTop:3}}>Ótimo</span>
                </div>
              </div>

              {/* Vitals chips */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:16}}>
                {[{l:'VFC',v:'58',u:'ms',c:'var(--cyan)',d:'+3'},
                  {l:'FCR',v:'52',u:'bpm',c:'var(--violet)',d:'-1'},
                  {l:'Sono',v:'7.4',u:'h',c:'var(--magenta)',d:'+0.5'}].map(m=>(
                  <div key={m.l} style={{padding:'10px 6px',borderRadius:10,textAlign:'center',background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.06)'}}>
                    <div style={{fontSize:9,color:'var(--dim)',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:3}}>{m.l}</div>
                    <div className="mono" style={{fontSize:18,fontWeight:700,color:m.c,lineHeight:1}}>{m.v}</div>
                    <div style={{fontSize:9,color:'var(--dim)',marginTop:2}}>{m.u}</div>
                    <div style={{fontSize:9,color:'var(--ready)',marginTop:3}}>↑ {m.d}</div>
                  </div>
                ))}
              </div>

              {/* AI brief */}
              <div style={{padding:'12px 14px',borderRadius:10,background:'linear-gradient(135deg,rgba(123,92,255,.1),rgba(79,209,255,.06))',border:'1px solid rgba(123,92,255,.2)'}}>
                <div style={{fontSize:9,color:'var(--violet)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.09em',marginBottom:5}}>✦ Coach IA</div>
                <p style={{fontSize:12,color:'var(--muted)',lineHeight:1.6}}>VFC 11% acima do basal. Janela ideal para treino intenso entre 10h–13h.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Vision ─────────────────────────────────────────────────────────────────*/
function Vision() {
  const [ref,vis] = useInView(.15);
  const cards = [
    {icon:'◎',color:'var(--violet)',title:'Interpreta',desc:'Enquanto outros apps registram dados, o VythaLab interpreta e constrói contexto fisiológico real.'},
    {icon:'◈',color:'var(--cyan)',title:'Unifica',desc:'Cada sistema do corpo influencia todos os outros. O VythaLab modela essa interdependência completa.'},
    {icon:'◉',color:'var(--magenta)',title:'Antecipa',desc:'Enquanto outros respondem, o VythaLab antecipa — construindo seu digital twin fisiológico.'},
  ];
  return (
    <section ref={ref} style={{padding:'60px 24px 80px'}}>
      <div className="sep" style={{marginBottom:80}}/>
      <div style={{maxWidth:1200,margin:'0 auto'}}>
        <div className={`fade-in ${vis?'vis':''}`} style={{textAlign:'center',marginBottom:64}}>
          <div className="syne" style={{fontSize:80,fontWeight:800,letterSpacing:'-.04em',color:'rgba(255,255,255,.05)',lineHeight:1,marginBottom:-16,userSelect:'none'}}>VythaLab</div>
          <blockquote className="syne" style={{fontSize:28,fontWeight:700,color:'var(--text)',letterSpacing:'-.025em',lineHeight:1.4,maxWidth:660,margin:'0 auto 20px'}}>
            "Meu corpo está realmente sendo compreendido."
          </blockquote>
          <p style={{fontSize:16,color:'var(--muted)',maxWidth:520,margin:'0 auto',lineHeight:1.75}}>
            O VythaLab não é um aplicativo fitness. É uma camada de inteligência fisiológica
            que vive entre seu corpo e suas decisões.
          </p>
        </div>
        <div className="vis-g" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
          {cards.map((c,i)=>(
            <div key={i} className={`glass fade-in ${vis?'vis':''}`} style={{padding:28,transitionDelay:vis?`${i*.13}s`:'0s'}}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 8px 40px ${c.color}30`;e.currentTarget.style.transform='translateY(-3px)';}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow='none';e.currentTarget.style.transform='none';}}>
              <div style={{fontSize:26,marginBottom:14,color:c.color}}>{c.icon}</div>
              <h3 className="syne" style={{fontSize:20,fontWeight:700,marginBottom:10,letterSpacing:'-.02em'}}>{c.title}</h3>
              <p style={{fontSize:14,color:'var(--muted)',lineHeight:1.75}}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Philosophy ─────────────────────────────────────────────────────────────*/
function Philosophy() {
  const [ref,vis] = useInView(.08);
  const principles = [
    {num:'01',color:'var(--violet)',title:'Interpretação acima de métricas brutas',desc:'Um HRV de 58ms não diz nada. Um HRV 11% abaixo do basal pessoal, após três dias de treino intenso, com sono fragmentado e refeição tardia — isso é inteligência acionável.',badge:'HRV: contexto · não número'},
    {num:'02',color:'var(--cyan)',title:'Contexto acima de números isolados',desc:'Biometria sem contexto é ruído. O VythaLab constrói contexto continuamente: quem você é, como seu corpo responde, o que funciona para você especificamente.',badge:'Perfil · Padrões · Você'},
    {num:'03',color:'var(--magenta)',title:'Longitudinal acima de snapshot',desc:'Seu perfil fisiológico de 90 dias vale infinitamente mais do que sua leitura de ontem. O sistema aprende. Os baselines evoluem. O scoring melhora.',badge:'Baseline rolling 30/60/90d'},
    {num:'04',color:'#FBBF24',title:'Coach acima de dashboard',desc:'Dados precisam virar decisões. O coach IA não apenas analisa — ele orienta, lembra, prevê e cria responsabilidade longitudinal.',badge:'Orienta · Prevê · Lembra'},
  ];
  return (
    <section ref={ref} id="produto" style={{padding:'80px 24px 100px'}}>
      <div style={{maxWidth:1200,margin:'0 auto'}}>
        <div className={`fade-in ${vis?'vis':''}`} style={{marginBottom:56}}>
          <span className="pill" style={{background:'rgba(123,92,255,.12)',border:'1px solid rgba(123,92,255,.25)',color:'#A78BFF',marginBottom:16,display:'inline-flex'}}>Filosofia do Produto</span>
          <h2 className="syne" style={{fontSize:44,fontWeight:800,letterSpacing:'-.035em',lineHeight:1.1}}>
            Quatro princípios que<br/><span className="grad-aurora">mudam tudo.</span>
          </h2>
        </div>
        <div className="phil-g" style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:14}}>
          {principles.map((p,i)=>(
            <div key={i} className={`glass fade-in ${vis?'vis':''}`}
              style={{padding:'28px 32px',borderLeft:`2px solid ${p.color}`,borderRadius:16,transitionDelay:vis?`${i*.11}s`:'0s',transition:'all .75s ease'}}
              onMouseEnter={e=>e.currentTarget.style.boxShadow=`0 8px 40px ${p.color}25`}
              onMouseLeave={e=>e.currentTarget.style.boxShadow='none'}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                <span className="mono" style={{fontSize:11,color:p.color,fontWeight:700}}>{p.num}</span>
                <span style={{padding:'4px 12px',borderRadius:6,background:`${p.color}18`,border:`1px solid ${p.color}30`,fontSize:10,color:p.color,fontFamily:'Space Mono,monospace'}}>{p.badge}</span>
              </div>
              <h3 className="syne" style={{fontSize:17,fontWeight:700,marginBottom:12,letterSpacing:'-.02em',lineHeight:1.35}}>{p.title}</h3>
              <p style={{fontSize:14,color:'var(--muted)',lineHeight:1.75}}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Features Bento ─────────────────────────────────────────────────────────*/
function Features() {
  const [ref,vis] = useInView(.05);
  const items = [
    {title:'Dashboard Biométrico',desc:'Score de prontidão 0–100 com banda de recuperação. VFC, FCR e sono. Resumo diário gerado por IA com contexto fisiológico real.',accent:'var(--ready)',span:2,
      chips:[{l:'VFC',v:'58ms',c:'#4FD1FF'},{l:'FCR',v:'52bpm',c:'#7B5CFF'},{l:'Sono',v:'7.4h',c:'#FF4FD8'}]},
    {title:'Coach IA Persistente',desc:'Memória longitudinal entre sessões. Personalidade consistente. Recomendações adaptativas por objetivo e feedback.',accent:'var(--violet)',span:1},
    {title:'Strain Engine',desc:'Strain cardiovascular e muscular. Fadiga do SNC. Balanço strain × recuperação em tempo real.',accent:'var(--strain)',span:1},
    {title:'Rastreamento GPS',desc:'Corridas com métricas ao vivo, mapa SVG da rota, pace, distância, pause/resume e salvamento automático.',accent:'var(--cyan)',span:1},
    {title:'Wearable Agnóstico',desc:'Sem hardware proprietário. Sem lock-in. Integração aberta com todo ecossistema.',accent:'var(--magenta)',span:2,
      logos:['Health Connect','Apple Health','BLE Direct','Garmin','Fitbit','+ WHOOP · Oura em breve']},
    {title:'Prediction Engine',desc:'Previsão de prontidão (próximos 7 dias), risco de lesão, janelas ideais de treino e picos fisiológicos previstos.',accent:'#FBBF24',span:1},
    {title:'Correlation Engine',desc:'Auto-discovery de correlações. "Seu HRV cai ~12% após álcool." Insights que você nunca veria sozinho.',accent:'var(--violet)',span:1},
  ];
  return (
    <section ref={ref} id="funcionalidades" style={{padding:'80px 24px 100px',position:'relative'}}>
      <div className="blob" style={{width:420,height:420,bottom:0,right:-80,background:'radial-gradient(circle,rgba(79,209,255,.1) 0%,transparent 70%)',animation:'aurora2 22s ease-in-out infinite'}}/>
      <div style={{maxWidth:1200,margin:'0 auto',position:'relative',zIndex:1}}>
        <div className={`fade-in ${vis?'vis':''}`} style={{marginBottom:56}}>
          <span className="pill" style={{background:'rgba(79,209,255,.1)',border:'1px solid rgba(79,209,255,.2)',color:'var(--cyan)',marginBottom:16,display:'inline-flex'}}>Funcionalidades</span>
          <h2 className="syne" style={{fontSize:44,fontWeight:800,letterSpacing:'-.035em',lineHeight:1.1}}>
            Tudo que seu corpo<br/><span style={{color:'var(--cyan)'}}>precisa entender.</span>
          </h2>
        </div>
        <div className="feat-g" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
          {items.map((f,i)=>(
            <div key={i} className={`glass fade-in ${vis?'vis':''}`}
              style={{padding:'26px 28px 30px',gridColumn:`span ${f.span}`,transitionDelay:vis?`${i*.07}s`:'0s',transition:'all .4s ease,border-color .25s,transform .25s'}}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.borderColor=`${f.accent}55`;e.currentTarget.style.boxShadow=`0 12px 48px ${f.accent}20`;}}
              onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.boxShadow='none';}}>
              <h3 className="syne" style={{fontSize:17,fontWeight:700,marginBottom:10,letterSpacing:'-.015em',color:f.accent}}>{f.title}</h3>
              <p style={{fontSize:14.5,color:'rgba(240,240,255,0.76)',lineHeight:1.8,fontWeight:500,marginBottom:f.chips||f.logos?18:0}}>{f.desc}</p>
              {f.chips && (
                <div style={{display:'flex',gap:8}}>
                  {f.chips.map(m=>(
                    <div key={m.l} style={{flex:1,padding:'10px 8px',borderRadius:10,textAlign:'center',background:`${m.c}12`,border:`1px solid ${m.c}28`}}>
                      <div style={{fontSize:10,color:'var(--dim)',marginBottom:3,textTransform:'uppercase',letterSpacing:'.06em'}}>{m.l}</div>
                      <div className="mono" style={{fontSize:16,fontWeight:700,color:m.c}}>{m.v}</div>
                    </div>
                  ))}
                </div>
              )}
              {f.logos && (
                <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
                  {f.logos.map(l=>(
                    <span key={l} style={{padding:'4px 11px',borderRadius:6,background:l.includes('em breve')?'rgba(255,79,216,.08)':'rgba(255,255,255,.05)',border:l.includes('em breve')?'1px solid rgba(255,79,216,.25)':'1px solid rgba(255,255,255,.1)',fontSize:11,color:l.includes('em breve')?'var(--magenta)':'var(--muted)',fontFamily:'Space Mono,monospace'}}>{l}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Architecture ───────────────────────────────────────────────────────────*/
function Architecture() {
  const [ref,vis] = useInView(.08);
  const layers = [
    {label:'◎ Cliente Mobile',sub:'React Native · Expo Router · NativeWind · Moti',color:'#7B5CFF',
      items:['Início','Recuperação','Treinar','Insights','Perfil','Coach IA (overlay global)'],
      detail:'TanStack Query · Zustand · Offline-first · Optimistic UI'},
    {label:'◈ Supabase Platform',sub:'Auth RLS · Postgres · Realtime · Edge Functions',color:'#3ECF8E',
      split:[
        {title:'Unified Physiological Graph',tags:['biometric_readings','recovery_scores','workouts','sleep_sessions','runs','nutrition_logs','correlations','predictions']},
        {title:'AI Intelligence Layer',tags:['daily-brief','generate-insight','coach-chat','prediction-engine','correlation-detector','weekly-narrative']},
      ]},
    {label:'✦ Claude Sonnet',sub:'Engine Central de Raciocínio Fisiológico',color:'#D97757',
      items:['Context Builder','Prompt Caching','Memory Pipeline','Baselines Adaptativos','pt-BR Fisiologia','Longitudinal AI']},
    {label:'◌ Wearable Ecosystem',sub:'Agnóstico · Sem Hardware Proprietário · Sem Lock-in',color:'#4FD1FF',
      items:['Health Connect','Apple Health','BLE Direct','Garmin Connect','Fitbit','WHOOP (em breve)','Oura API (em breve)']},
  ];
  return (
    <section ref={ref} style={{padding:'80px 24px 100px'}}>
      <div className="sep" style={{marginBottom:80}}/>
      <div style={{maxWidth:1200,margin:'0 auto'}}>
        <div className={`fade-in ${vis?'vis':''}`} style={{textAlign:'center',marginBottom:64}}>
          <span className="pill" style={{background:'rgba(123,92,255,.12)',border:'1px solid rgba(123,92,255,.25)',color:'#A78BFF',marginBottom:16,display:'inline-flex'}}>Arquitetura</span>
          <h2 className="syne" style={{fontSize:44,fontWeight:800,letterSpacing:'-.035em'}}>Sistema de <span className="grad-vio">ponta a ponta.</span></h2>
        </div>
        <div className={`fade-in ${vis?'vis':''}`} style={{maxWidth:800,margin:'0 auto',transitionDelay:'0.2s'}}>
          {layers.map((l,i)=>(
            <div key={i}>
              <div className="glass" style={{padding:'20px 24px',borderColor:`${l.color}35`,boxShadow:`0 0 30px ${l.color}12`}}>
                <div style={{display:'flex',alignItems:'baseline',gap:12,marginBottom:12,flexWrap:'wrap'}}>
                  <span style={{fontSize:11,color:l.color,textTransform:'uppercase',letterSpacing:'.09em',fontWeight:700,fontFamily:'Space Mono,monospace'}}>{l.label}</span>
                  <span style={{fontSize:11,color:'var(--dim)'}}>{l.sub}</span>
                </div>
                {l.split ? (
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                    {l.split.map((s,j)=>(
                      <div key={j} style={{padding:'12px 14px',borderRadius:10,background:`${l.color}07`,border:`1px solid ${l.color}18`}}>
                        <div style={{fontSize:9,color:l.color,textTransform:'uppercase',letterSpacing:'.08em',fontWeight:700,marginBottom:8}}>{s.title}</div>
                        <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                          {s.tags.map(t=><span key={t} className="mono" style={{fontSize:10,color:'var(--dim)',padding:'2px 6px',background:'rgba(255,255,255,.04)',borderRadius:4}}>{t}</span>)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
                    {l.items.map(t=><span key={t} style={{padding:'5px 12px',borderRadius:6,background:`${l.color}12`,border:`1px solid ${l.color}28`,fontSize:11,color:l.color,fontFamily:'Space Mono,monospace'}}>{t}</span>)}
                  </div>
                )}
                {l.detail && <div style={{marginTop:10,fontSize:11,color:'var(--dim)',fontFamily:'Space Mono,monospace'}}>{l.detail}</div>}
              </div>
              {i<layers.length-1 && (
                <div style={{display:'flex',justifyContent:'center',padding:'6px 0'}}>
                  <div style={{width:2,height:28,background:`linear-gradient(to bottom,${layers[i].color},${layers[i+1].color})`,opacity:.6}}/>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── AI Architecture ────────────────────────────────────────────────────────*/
function AIArchitecture() {
  const [ref,vis] = useInView(.1);
  const pipeline = [
    {step:'Context Builder',desc:'Biometrics 7–30d · User memory · Recent events · Active protocols · Goals · Injury history',color:'var(--violet)'},
    {step:'Claude Sonnet 4.x',desc:'Prompt caching · Max 1k tokens · Fisiologia personalizada · pt-BR · Temperatura controlada',color:'#D97757'},
    {step:'Response + Memory Update',desc:'Save to ai_insights · Update user_patterns · Trigger proactive events if needed · Cache por (user, kind, date)',color:'var(--cyan)'},
  ];
  return (
    <section ref={ref} style={{padding:'0 24px 100px'}}>
      <div style={{maxWidth:1200,margin:'0 auto'}}>
        <div className={`fade-in ${vis?'vis':''}`} style={{textAlign:'center',marginBottom:48}}>
          <h3 className="syne" style={{fontSize:28,fontWeight:700,letterSpacing:'-.025em',marginBottom:8}}>Pipeline de IA</h3>
          <p style={{fontSize:14,color:'var(--muted)'}}>Claude como engine central de raciocínio fisiológico com memória longitudinal.</p>
        </div>
        <div className={`fade-in ${vis?'vis':''}`} style={{display:'flex',flexDirection:'column',gap:0,maxWidth:660,margin:'0 auto',transitionDelay:'0.15s'}}>
          <div style={{padding:'8px 14px',borderRadius:'10px 10px 0 0',background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',textAlign:'center',fontSize:12,color:'var(--dim)',fontFamily:'Space Mono,monospace'}}>
            Usuário faz pergunta / evento é detectado
          </div>
          {pipeline.map((p,i)=>(
            <div key={i}>
              <div style={{display:'flex',justifyContent:'center',padding:'4px 0'}}>
                <div style={{width:2,height:20,background:`${p.color}80`}}/>
              </div>
              <div style={{padding:'16px 20px',background:`${p.color}0e`,border:`1px solid ${p.color}30`,borderRadius:10}}>
                <div style={{fontSize:11,color:p.color,fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em',marginBottom:6,fontFamily:'Space Mono,monospace'}}>{p.step}</div>
                <div style={{fontSize:12,color:'var(--muted)',lineHeight:1.6}}>{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div className={`fade-in ${vis?'vis':''}`} style={{display:'flex',flexWrap:'wrap',gap:10,justifyContent:'center',marginTop:32,transitionDelay:'0.3s'}}>
          {['Prompt caching','Cache por (user, kind, date)','Contexto mínimo adaptativo','Geração assíncrona em background','Gating por tier de assinatura'].map(t=>(
            <span key={t} className="mono" style={{padding:'5px 12px',borderRadius:6,background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.07)',fontSize:11,color:'var(--dim)'}}>{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Competitive ────────────────────────────────────────────────────────────*/
function Competitive() {
  const [ref,vis] = useInView(.1);
  const rows = [
    {dim:'IA contextual',w:false,g:false,o:'Limitada',v:'Coach longitudinal'},
    {dim:'Fisiologia unificada',w:false,g:false,o:false,v:'Grafo fisiológico'},
    {dim:'Prediction engine',w:'Básico',g:'Básico',o:'Básico',v:'Multi-domínio'},
    {dim:'Biohacking lab',w:false,g:false,o:false,v:'Experimentos n=1'},
    {dim:'Correlation engine',w:false,g:false,o:false,v:'Auto-discovery'},
    {dim:'Narrative IA',w:false,g:false,o:false,v:'Storytelling fisiológico'},
    {dim:'Hardware obrigatório',w:true,g:true,o:true,v:false},
    {dim:'Freemium / entrada grátis',w:false,g:false,o:false,v:true},
  ];
  const C = ({val,vy}) => {
    if(val===true) return <span style={{color:vy?'var(--ready)':'var(--strain)',fontSize:15}}>✓</span>;
    if(val===false) return <span style={{color:'var(--dim)',fontSize:15}}>—</span>;
    if(vy) return <span style={{color:'var(--ready)',fontWeight:600,fontSize:13}}>{val}</span>;
    return <span style={{color:'var(--muted)',fontSize:13}}>{val}</span>;
  };
  return (
    <section ref={ref} style={{padding:'80px 24px 100px'}}>
      <div className="sep" style={{marginBottom:80}}/>
      <div style={{maxWidth:1200,margin:'0 auto'}}>
        <div className={`fade-in ${vis?'vis':''}`} style={{marginBottom:48}}>
          <span className="pill" style={{background:'rgba(74,222,128,.1)',border:'1px solid rgba(74,222,128,.2)',color:'var(--ready)',marginBottom:16,display:'inline-flex'}}>Posicionamento</span>
          <h2 className="syne" style={{fontSize:44,fontWeight:800,letterSpacing:'-.035em'}}>Por que <span style={{color:'var(--ready)'}}>VythaLab</span> vence.</h2>
        </div>
        <div className={`glass fade-in ${vis?'vis':''}`} style={{overflow:'hidden',transitionDelay:'0.2s'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{borderBottom:'1px solid rgba(255,255,255,.07)'}}>
                <th style={{padding:'16px 24px',textAlign:'left',fontSize:10,color:'var(--dim)',textTransform:'uppercase',letterSpacing:'.09em',fontWeight:600}}>Dimensão</th>
                {['WHOOP','Garmin','Oura'].map(b=>(
                  <th key={b} className="hide-sm" style={{padding:'16px 16px',textAlign:'center',fontSize:10,color:'var(--dim)',textTransform:'uppercase',letterSpacing:'.09em',fontWeight:600}}>{b}</th>
                ))}
                <th style={{padding:'16px 24px',textAlign:'center',fontSize:11,color:'var(--violet)',textTransform:'uppercase',letterSpacing:'.09em',fontWeight:700,background:'rgba(123,92,255,.07)',borderLeft:'1px solid rgba(123,92,255,.18)'}}>VythaLab ⬡</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r,i)=>(
                <tr key={i} style={{borderBottom:i<rows.length-1?'1px solid rgba(255,255,255,.04)':'none',transition:'background .15s'}}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,.02)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td style={{padding:'13px 24px',fontSize:13,color:'var(--muted)'}}>{r.dim}</td>
                  <td className="hide-sm" style={{padding:'13px 16px',textAlign:'center'}}><C val={r.w}/></td>
                  <td className="hide-sm" style={{padding:'13px 16px',textAlign:'center'}}><C val={r.g}/></td>
                  <td className="hide-sm" style={{padding:'13px 16px',textAlign:'center'}}><C val={r.o}/></td>
                  <td style={{padding:'13px 24px',textAlign:'center',background:'rgba(123,92,255,.05)',borderLeft:'1px solid rgba(123,92,255,.1)'}}><C val={r.v} vy/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ─── Roadmap ─────────────────────────────────────────────────────────────────*/
function Roadmap() {
  const [ref,vis] = useInView(.05);

  const phases = [
    {
      tag:'MVP',
      label:'Lançado',
      status:'done',
      color:'var(--ready)',
      title:'Base Fisiológica',
      items:[
        'Dashboard de prontidão com VFC, FCR e sono',
        'Sistema de treinos com fichas e histórico',
        'Rastreamento GPS de corridas',
        'Insights IA com Claude (5 análises)',
        'Integração Health Connect + Apple Health',
        '210+ exercícios em biblioteca acordeão',
        'Fichas de treino com sets pré-configurados',
        'Coluna Anterior nas séries'
      ]
    },
    {
      tag:'V2',
      label:'Em desenvolvimento',
      status:'active',
      color:'var(--violet)',
      title:'Intelligence Layer',
      items:[
        'Baselines dinâmicos rolling 30/60/90d',
        'Coach IA com memória longitudinal',
        'Interface conversacional + mensagens proativas',
        'Strain cardiovascular e muscular',
        'Overtraining detection e alertas preventivos',
        'Recovery Timeline animada',
        'Anomaly detection com explicabilidade',
        'Pesos biométricos adaptativos por feedback'
      ]
    },
    {
      tag:'V3',
      label:'Planejado',
      status:'planned',
      color:'var(--cyan)',
      title:'Prediction & Correlation',
      items:[
        'Previsão de prontidão (3–7 dias)',
        'Correlation Engine (auto-discovery)',
        'Nutrição com barcode scanner',
        'Biohacking Lab',
        'Heatmaps fisiológicos',
        'Forecasting probabilístico',
        'Correlação nutrição × HRV × recuperação',
        'Previsão de risco de lesão'
      ]
    },
    {
      tag:'V∞',
      label:'Visão futura',
      status:'future',
      color:'var(--magenta)',
      title:'Human Performance OS',
      items:[
        'Physiological Digital Twin',
        'Simulações fisiológicas completas',
        'BLE direto (wearables)',
        'Apple Watch + Wear OS',
        'WHOOP + Oura + Garmin APIs',
        'Biological Age',
        'Narrativas cinematográficas IA',
        'Proactive Insights 24/7'
      ]
    }
  ];

  return (
    <section
      ref={ref}
      id="roadmap"
      style={{padding:'100px 24px 120px',position:'relative'}}
    >
      <div
        className="blob"
        style={{
          width:500,
          height:500,
          top:0,
          left:-100,
          background:'radial-gradient(circle,rgba(255,79,216,.1) 0%,transparent 70%)',
          animation:'aurora3 21s ease-in-out infinite'
        }}
      />

      <div style={{maxWidth:1100,margin:'0 auto',position:'relative',zIndex:1}}>

        <div className={`fade-in ${vis?'vis':''}`} style={{marginBottom:72}}>
          <span
            className="pill"
            style={{
              background:'rgba(255,79,216,.1)',
              border:'1px solid rgba(255,79,216,.2)',
              color:'var(--magenta)',
              marginBottom:16,
              display:'inline-flex'
            }}
          >
            Roadmap
          </span>

          <h2
            className="syne"
            style={{
              fontSize:52,
              fontWeight:800,
              letterSpacing:'-.045em',
              lineHeight:1.05
            }}
          >
            Evolução do <br />
            <span className="grad-aurora">Performance OS.</span>
          </h2>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:26,position:'relative'}}>

          {phases.map((ph,index)=>(
            <div
              key={index}
              className={`glass fade-in ${vis?'vis':''}`}
              style={{
                padding:'34px 36px',
                borderColor:`${ph.color}40`,
                boxShadow:`0 0 60px ${ph.color}18`,
                transitionDelay:`${index * 0.12}s`,
                position:'relative',
                overflow:'hidden'
              }}
            >
              <div
                style={{
                  position:'absolute',
                  inset:0,
                  background:`linear-gradient(135deg, ${ph.color}08 0%, transparent 60%)`,
                  pointerEvents:'none'
                }}
              />

              <div style={{position:'relative',zIndex:2}}>

                <div
                  style={{
                    display:'flex',
                    alignItems:'center',
                    gap:16,
                    marginBottom:26,
                    flexWrap:'wrap'
                  }}
                >
                  <span
                    style={{
                      padding:'6px 16px',
                      borderRadius:8,
                      background:`${ph.color}22`,
                      border:`1px solid ${ph.color}44`,
                      fontSize:12,
                      fontWeight:700,
                      color:ph.color,
                      fontFamily:'JetBrains Mono, monospace'
                    }}
                  >
                    {ph.tag}
                  </span>

                  <h3
                    className="syne"
                    style={{
                      fontSize:28,
                      fontWeight:700,
                      letterSpacing:'-.03em'
                    }}
                  >
                    {ph.title}
                  </h3>

                  <span
                    style={{
                      marginLeft:'auto',
                      padding:'6px 14px',
                      borderRadius:999,
                      background:`${ph.color}15`,
                      border:`1px solid ${ph.color}35`,
                      fontSize:11,
                      fontWeight:700,
                      color:ph.color,
                      textTransform:'uppercase',
                      letterSpacing:'.08em'
                    }}
                  >
                    {ph.label}
                  </span>
                </div>

                <div
                  style={{
                    display:'grid',
                    gridTemplateColumns:'repeat(2,1fr)',
                    gap:12
                  }}
                >
                  {ph.items.map((item,j)=>(
                    <div
                      key={j}
                      style={{
                        display:'flex',
                        gap:12,
                        alignItems:'flex-start',
                        padding:'14px 16px',
                        borderRadius:12,
                        background:'rgba(255,255,255,.03)',
                        border:'1px solid rgba(255,255,255,.05)'
                      }}
                    >
                      <div
                        style={{
                          width:10,
                          height:10,
                          borderRadius:'50%',
                          background:ph.color,
                          marginTop:7,
                          boxShadow:`0 0 14px ${ph.color}`,
                          flexShrink:0
                        }}
                      />

                      <span
                        style={{
                          fontSize:14,
                          color:'rgba(240,240,255,0.76)',
                          lineHeight:1.7,
                          fontWeight:500
                        }}
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Pricing ─────────────────────────────────────────────────────────────────*/

function Pricing() {
  const [ref,vis] = useInView(.08);
  const tiers = [
    {name:'Gratuito',price:'R$ 0',period:'para sempre',sub:'Performance Básica',color:'var(--dim)',borderColor:'rgba(255,255,255,.07)',
      feats:['Dashboard de prontidão (score diário)','Vitais: VFC, FCR e sono','Treinos ilimitados (sem fichas)','Corridas GPS ilimitadas','1 insight IA por semana','Sync Health Connect / Apple Health'],
      cta:'Começar grátis',ctaBg:'rgba(255,255,255,.06)',ctaBorder:'1px solid rgba(255,255,255,.12)',ctaColor:'var(--text)',ctaShadow:'none'},
    {name:'Premium',price:'R$ 39,90',period:'/mês',sub:'Intelligence',color:'var(--violet)',borderColor:'rgba(123,92,255,.45)',featured:true,
      feats:['Coach IA com memória longitudinal','Análises ilimitadas (rec. · treino · sono)','Fichas de treino ilimitadas','Strain Engine completo','Overtraining detection','Recovery Timeline animada','Prediction Engine (7 dias)','Performance Heatmaps','Weekly Narrative IA'],
      cta:'Começar Premium',ctaBg:'linear-gradient(135deg,#7B5CFF,#9B7AFF)',ctaBorder:'none',ctaColor:'white',ctaShadow:'0 0 30px rgba(123,92,255,.45)'},
    {name:'Ultra',price:'R$ 79,90',period:'/mês',sub:'Elite Performance',color:'#FBBF24',borderColor:'rgba(251,191,36,.3)',
      feats:['Tudo do Premium','Biohacking Lab completo','Correlation Engine (auto-discovery)','Biological Age / Recovery Age','Realtime coaching durante treino','Experimentos fisiológicos n=1','Reports longitudinais 90d','API de exportação de dados','Prioridade de suporte'],
      cta:'Começar Ultra',ctaBg:'linear-gradient(135deg,#F59E0B,#FBBF24)',ctaBorder:'none',ctaColor:'#050510',ctaShadow:'0 0 24px rgba(251,191,36,.4)'},
  ];
  return (
    <section ref={ref} id="preços" style={{padding:'80px 24px 120px'}}>
      <div className="sep" style={{marginBottom:80}}/>
      <div style={{maxWidth:1200,margin:'0 auto'}}>
        <div className={`fade-in ${vis?'vis':''}`} style={{textAlign:'center',marginBottom:60}}>
          <span className="pill" style={{background:'rgba(251,191,36,.1)',border:'1px solid rgba(251,191,36,.2)',color:'var(--caution)',marginBottom:16,display:'inline-flex'}}>Planos</span>
          <h2 className="syne" style={{fontSize:44,fontWeight:800,letterSpacing:'-.035em'}}>Comece grátis.<br/><span style={{color:'var(--caution)'}}>Evolua sem limites.</span></h2>
        </div>
        <div className="price-g" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,alignItems:'start'}}>
          {tiers.map((t,i)=>(
            <div key={i} className={`glass fade-in ${vis?'vis':''}`}
              style={{padding:'30px 26px',borderColor:t.borderColor,boxShadow:t.featured?'0 0 60px rgba(123,92,255,.22)':'none',transform:t.featured?'scale(1.025)':'none',transitionDelay:vis?`${i*.1}s`:'0s'}}>
              {t.featured && <div style={{textAlign:'center',marginBottom:18}}><span style={{padding:'4px 16px',borderRadius:100,background:'rgba(123,92,255,.2)',border:'1px solid rgba(123,92,255,.35)',fontSize:10,color:'var(--violet)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em'}}>Mais popular</span></div>}
              <div style={{fontSize:10,color:t.color,fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em',marginBottom:6}}>{t.sub}</div>
              <div className="syne" style={{fontSize:20,fontWeight:700,marginBottom:4}}>{t.name}</div>
              <div style={{display:'flex',alignItems:'baseline',gap:4,marginBottom:20}}>
                <span className="syne" style={{fontSize:34,fontWeight:800,color:t.color}}>{t.price}</span>
                <span style={{fontSize:13,color:'var(--dim)'}}>{t.period}</span>
              </div>
              <div className="sep" style={{marginBottom:18}}/>
              <div style={{display:'flex',flexDirection:'column',gap:9,marginBottom:26}}>
                {t.feats.map((f,j)=>(
                  <div key={j} style={{display:'flex',gap:8,alignItems:'flex-start'}}>
                    <span style={{color:t.color,fontSize:13,lineHeight:1.5,flexShrink:0}}>✓</span>
                    <span style={{fontSize:13,color:'var(--muted)',lineHeight:1.5}}>{f}</span>
                  </div>
                ))}
              </div>
              <button className="btn-shine" style={{width:'100%',padding:'13px',borderRadius:10,fontSize:14,fontWeight:600,cursor:'pointer',transition:'all .25s',background:t.ctaBg,border:t.ctaBorder,color:t.ctaColor,boxShadow:t.ctaShadow}}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.opacity='.9';}}
                onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.opacity='1';}}>
                {t.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Tech Stack ─────────────────────────────────────────────────────────────*/
function TechStack() {
  const [ref,vis] = useInView(.1);
  const stack = [
    {name:'Expo SDK 54',cat:'Framework',c:'#7B5CFF'},
    {name:'React Native 0.81',cat:'UI',c:'#61DAFB'},
    {name:'TypeScript 5.9',cat:'Linguagem',c:'#3178C6'},
    {name:'NativeWind',cat:'Styling',c:'#4FD1FF'},
    {name:'Moti + Reanimated 4',cat:'Animações',c:'#FF4FD8'},
    {name:'Zustand 5',cat:'Estado',c:'#A78BFF'},
    {name:'TanStack Query 5',cat:'Server State',c:'#FF4154'},
    {name:'Supabase',cat:'Backend',c:'#3ECF8E'},
    {name:'Deno Edge Functions',cat:'Serverless',c:'#3ECF8E'},
    {name:'Claude (Anthropic)',cat:'IA Engine',c:'#D97757'},
    {name:'Health Connect',cat:'Android',c:'#4FD1FF'},
    {name:'Apple Health',cat:'iOS',c:'#FF6B8A'},
    {name:'EAS Build',cat:'CI/CD',c:'#FBBF24'},
    {name:'Postgres + RLS',cat:'Banco de dados',c:'#3ECF8E'},
  ];
  return (
    <section ref={ref} style={{padding:'40px 24px 80px'}}>
      <div style={{maxWidth:1200,margin:'0 auto'}}>
        <div className={`fade-in ${vis?'vis':''}`} style={{textAlign:'center',marginBottom:40}}>
          <h3 className="syne" style={{fontSize:22,fontWeight:700,letterSpacing:'-.02em',color:'var(--dim)'}}>Stack de ponta</h3>
        </div>
        <div className={`fade-in ${vis?'vis':''}`} style={{display:'flex',flexWrap:'wrap',gap:9,justifyContent:'center',transitionDelay:'.15s'}}>
          {stack.map((t,i)=>(
            <div key={i} style={{padding:'8px 16px',borderRadius:10,background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.07)',display:'flex',flexDirection:'column',gap:3,transition:'all .2s',cursor:'default'}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=`${t.c}50`;e.currentTarget.style.background=`${t.c}10`;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,.07)';e.currentTarget.style.background='rgba(255,255,255,.04)';}}>
              <span className="mono" style={{fontSize:12,fontWeight:700,color:'var(--text)'}}>{t.name}</span>
              <span style={{fontSize:10,color:t.c,textTransform:'uppercase',letterSpacing:'.06em',fontWeight:600}}>{t.cat}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Schema ─────────────────────────────────────────────────────────────────*/
function Schema() {
  const [ref,vis] = useInView(.08);
  const [tab,setTab] = useState(0);
  const tables = [
    {title:'Tabelas atuais',color:'var(--ready)',items:[
      {t:'profiles',d:'Perfil: nome, DOB, sexo, objetivo, unidades'},
      {t:'biometric_readings',d:'Séries temporais de VFC e FCR'},
      {t:'sleep_sessions',d:'Sono com fases (deep, REM, light, awake)'},
      {t:'recovery_scores',d:'Score de prontidão diário (0–100) + banda'},
      {t:'workouts',d:'Sessões de treino com volume e duração'},
      {t:'sets',d:'Séries individuais (peso, reps, RPE)'},
      {t:'workout_templates',d:'Fichas de treino reutilizáveis'},
      {t:'runs',d:'Corridas GPS com pace, distância e rota'},
      {t:'ai_insights',d:'Insights gerados (5 kinds)'},
      {t:'exercises',d:'Biblioteca com 210+ exercícios globais'},
    ]},
    {title:'Roadmap V2/V3',color:'var(--violet)',items:[
      {t:'user_patterns',d:'Padrões aprendidos pelo Adaptive Engine'},
      {t:'biometric_baselines',d:'Baselines rolling (30/60/90d) por métrica'},
      {t:'coach_memories',d:'Memória longitudinal do coach IA'},
      {t:'physiological_events',d:'Event log unificado (trigger de correlações)'},
      {t:'nutrition_logs',d:'Refeições, macros, micronutrientes'},
      {t:'biohack_protocols',d:'Protocolos rastreados (sauna, suplementos)'},
      {t:'correlations',d:'Correlações descobertas automaticamente'},
      {t:'strain_sessions',d:'Strain cardiovascular e muscular por sessão'},
      {t:'predictions',d:'Previsões geradas (readiness, fadiga, etc.)'},
      {t:'goals',d:'Metas adaptativas por domínio'},
    ]},
  ];
  const cur = tables[tab];
  return (
    <section ref={ref} style={{padding:'0 24px 80px'}}>
      <div style={{maxWidth:1200,margin:'0 auto'}}>
        <div className={`fade-in ${vis?'vis':''}`} style={{textAlign:'center',marginBottom:40}}>
          <h3 className="syne" style={{fontSize:28,fontWeight:700,letterSpacing:'-.025em',marginBottom:8}}>Schema do banco de dados</h3>
          <p style={{fontSize:14,color:'var(--muted)'}}>Postgres via Supabase com RLS por usuário.</p>
        </div>
        <div className={`fade-in ${vis?'vis':''}`} style={{maxWidth:720,margin:'0 auto',transitionDelay:'.15s'}}>
          <div style={{display:'flex',gap:8,marginBottom:16}}>
            {tables.map((t,i)=>(
              <button key={i} onClick={()=>setTab(i)} style={{padding:'7px 18px',borderRadius:7,border:'none',cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:'Space Mono,monospace',transition:'all .2s',background:tab===i?t.color:'rgba(255,255,255,.05)',color:tab===i?'#050510':'var(--muted)',boxShadow:tab===i?`0 0 18px ${t.color}50`:'none'}}>
                {t.title}
              </button>
            ))}
          </div>
          <div className="glass" style={{borderColor:`${cur.color}30`,overflow:'hidden'}}>
            {cur.items.map((row,i)=>(
              <div key={i} style={{display:'flex',gap:16,padding:'10px 20px',borderBottom:i<cur.items.length-1?'1px solid rgba(255,255,255,.04)':'none',alignItems:'baseline',transition:'background .15s'}}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,.02)'}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                <code style={{fontSize:12,color:cur.color,fontFamily:'Space Mono,monospace',flex:'0 0 auto',minWidth:180}}>{row.t}</code>
                <span style={{fontSize:13,color:'var(--muted)'}}>{row.d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─────────────────────────────────────────────────────────────────────*/
function CTA() {
  const [ref,vis] = useInView(.2);
  return (
    <section ref={ref} style={{padding:'80px 24px 120px',position:'relative',overflow:'hidden'}}>
      <div className="sep" style={{marginBottom:80}}/>
      <div className="blob" style={{width:700,height:450,top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'radial-gradient(ellipse,rgba(123,92,255,.22) 0%,rgba(79,209,255,.1) 50%,transparent 70%)',animation:'aurora1 23s ease-in-out infinite'}}/>
      <div style={{maxWidth:680,margin:'0 auto',textAlign:'center',position:'relative',zIndex:1}}>
        <div className={`fade-in ${vis?'vis':''}`}>
          <div className="syne" style={{fontSize:64,marginBottom:20,background:'linear-gradient(135deg,#7B5CFF,#4FD1FF)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>⬡</div>
          <h2 className="syne" style={{fontSize:50,fontWeight:800,letterSpacing:'-.04em',lineHeight:1.08,marginBottom:18}}>
            Seu corpo, finalmente<br/><span className="grad-aurora">compreendido.</span>
          </h2>
          <p style={{fontSize:17,color:'var(--muted)',marginBottom:40,lineHeight:1.75}}>
            Junte-se à lista de espera do VythaLab e seja o primeiro a experimentar
            a próxima geração de inteligência fisiológica.
          </p>
          <button className="btn-shine" style={{background:'linear-gradient(135deg,#7B5CFF,#9B7AFF)',color:'white',padding:'16px 44px',borderRadius:12,border:'none',fontSize:16,fontWeight:600,cursor:'pointer',boxShadow:'0 0 60px rgba(123,92,255,.5)',transition:'all .25s'}}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='0 10px 70px rgba(123,92,255,.65)';}}
            onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 0 60px rgba(123,92,255,.5)';}}>
            Quero acesso antecipado →
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─────────────────────────────────────────────────────────────────*/
function Footer() {
  const links = ['Produto','Funcionalidades','Roadmap','Preços'];
  return (
    <footer style={{padding:'32px 24px',borderTop:'1px solid rgba(255,255,255,.06)'}}>
      <div style={{maxWidth:1200,margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:16}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:26,height:26,borderRadius:6,background:'linear-gradient(135deg,#7B5CFF,#4FD1FF)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,color:'white'}}>⬡</div>
          <span className="syne" style={{fontWeight:700,letterSpacing:'-.02em'}}>VythaLab</span>
          <span style={{color:'var(--dim)',fontSize:12}}>· Privado © 2025–2026 · Todos os direitos reservados</span>
        </div>
        <div style={{display:'flex',gap:24}}>
          {links.map(l=>(
            <a key={l} href={`#${l.toLowerCase()}`} style={{fontSize:12,color:'var(--dim)',textDecoration:'none',transition:'color .2s'}}
              onMouseEnter={e=>e.target.style.color='var(--text)'} onMouseLeave={e=>e.target.style.color='var(--dim)'}>{l}</a>
          ))}
        </div>
        <div style={{fontSize:11,color:'var(--dim)',fontFamily:'Space Mono,monospace'}}>
          Powered by <span style={{color:'#D97757'}}>Claude AI</span> · <span style={{color:'#3ECF8E'}}>Supabase</span>
        </div>
      </div>
    </footer>
  );
}

/* ─── Root ────────────────────────────────────────────────────────────────────*/
export default function VythaLabLanding() {
  return (
    <div style={{background:'#050510',minHeight:'100vh',color:'#F0F0FF',fontFamily:"'DM Sans',-apple-system,sans-serif"}}>
      <style>{css}</style>
      <div className="grid-bg" style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0}}/>
      <div style={{position:'relative',zIndex:1}}>
        <Nav/>
        <Hero/>
        <Vision/>
        <Philosophy/>
        <Features/>
        <Architecture/>
        <AIArchitecture/>
        <Competitive/>
        <Roadmap/>
        <Pricing/>
        <TechStack/>
        <Schema/>
        <CTA/>
        <Footer/>
      </div>
    </div>
  );
}
