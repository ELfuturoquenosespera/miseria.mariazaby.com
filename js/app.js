const menu=document.querySelector('.menu'),nav=document.querySelector('.nav-links');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));const reader=document.getElementById('reader-dialog'),readingAudio=document.getElementById('reading-audio'),readingPlay=document.getElementById('reading-play'),readingProgress=document.getElementById('reading-progress'),readingFill=document.getElementById('reading-progress-fill'),readingTime=document.getElementById('reading-time');document.getElementById('open-reader').addEventListener('click',()=>reader.showModal());document.getElementById('close-reader').addEventListener('click',()=>reader.close());reader.addEventListener('click',event=>{if(event.target===reader)reader.close()});reader.addEventListener('close',()=>{readingAudio.pause();readingPlay.textContent='Oír lectura'});const formatTime=value=>`${Math.floor(value/60)}:${String(Math.floor(value%60)).padStart(2,'0')}`;readingPlay.addEventListener('click',()=>{if(readingAudio.paused){readingAudio.play();readingPlay.textContent='Pausar lectura'}else{readingAudio.pause();readingPlay.textContent='Oír lectura'}});readingAudio.addEventListener('timeupdate',()=>{const percent=readingAudio.duration?readingAudio.currentTime/readingAudio.duration*100:0;readingFill.style.width=`${percent}%`;readingProgress.setAttribute('aria-valuenow',String(Math.round(percent)));readingTime.textContent=formatTime(readingAudio.currentTime)});readingAudio.addEventListener('ended',()=>{readingPlay.textContent='Oír de nuevo'});readingProgress.addEventListener('click',event=>{if(!readingAudio.duration)return;const box=readingProgress.getBoundingClientRect();readingAudio.currentTime=Math.max(0,Math.min(1,(event.clientX-box.left)/box.width))*readingAudio.duration});document.getElementById('listen-first-page').addEventListener('click',()=>{if(!reader.open)reader.showModal();readingAudio.currentTime=0;readingAudio.play();readingPlay.textContent='Pausar lectura'});const purchaseDialog=document.getElementById('purchase-dialog');document.querySelectorAll('.purchase-trigger').forEach(button=>button.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');purchaseDialog.showModal()}));document.getElementById('purchase-close').addEventListener('click',()=>purchaseDialog.close());purchaseDialog.addEventListener('click',event=>{if(event.target===purchaseDialog)purchaseDialog.close()});const audioCopy={conversacion:{title:'Conversación',description:'Una mirada cercana a las apariencias, el poder y aquello que elegimos no ver.',available:false},debate:{title:'Debate',description:'Dos miradas frente a frente sobre la ambición, la herencia y los límites de la conciencia.',available:true,src:'assets/audio/debate.mp3'}};const featureAudio=document.getElementById('feature-audio'),featurePlay=document.getElementById('audio-play'),featureLine=document.getElementById('audio-line'),featureCurrent=document.getElementById('audio-current'),featureDuration=document.getElementById('audio-duration'),featureKicker=document.getElementById('audio-kicker'),featureStatus=document.getElementById('audio-status');const resetFeatureProgress=()=>{featureCurrent.textContent='0:00';featureDuration.textContent='0:00';featureLine.style.setProperty('--audio-progress','0%');featureLine.setAttribute('aria-valuenow','0')};const selectAudio=item=>{featureAudio.pause();featureAudio.removeAttribute('src');featureAudio.load();featurePlay.textContent='▶';resetFeatureProgress();if(item.available){featureAudio.src=item.src;featureAudio.load();featurePlay.disabled=false;featurePlay.style.cursor='pointer';featurePlay.setAttribute('aria-label',`Reproducir ${item.title.toLowerCase()}`);featureKicker.textContent='Disponible';featureStatus.textContent='Pulsa para escuchar';}else{featurePlay.disabled=true;featurePlay.style.cursor='not-allowed';featurePlay.setAttribute('aria-label','Audio disponible próximamente');featureKicker.textContent='Próximamente';featureStatus.textContent='Audio disponible próximamente';}};document.querySelectorAll('.audio-tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.audio-tab').forEach(item=>{item.classList.remove('active');item.setAttribute('aria-selected','false')});tab.classList.add('active');tab.setAttribute('aria-selected','true');const item=audioCopy[tab.dataset.audio];document.getElementById('audio-title').textContent=item.title;document.getElementById('audio-description').textContent=item.description;selectAudio(item)}));featurePlay.addEventListener('click',()=>{if(featurePlay.disabled)return;if(featureAudio.paused){featureAudio.play();featurePlay.textContent='Ⅱ';featureStatus.textContent='Reproduciendo';}else{featureAudio.pause();featurePlay.textContent='▶';featureStatus.textContent='En pausa';}});featureAudio.addEventListener('loadedmetadata',()=>{featureDuration.textContent=formatTime(featureAudio.duration)});featureAudio.addEventListener('timeupdate',()=>{const percent=featureAudio.duration?featureAudio.currentTime/featureAudio.duration*100:0;featureCurrent.textContent=formatTime(featureAudio.currentTime);featureLine.style.setProperty('--audio-progress',`${percent}%`);featureLine.setAttribute('aria-valuenow',String(Math.round(percent)))});featureAudio.addEventListener('ended',()=>{featurePlay.textContent='▶';featureStatus.textContent='Finalizado'});featureLine.addEventListener('click',event=>{if(!featureAudio.duration)return;const box=featureLine.getBoundingClientRect();featureAudio.currentTime=Math.max(0,Math.min(1,(event.clientX-box.left)/box.width))*featureAudio.duration});featureLine.addEventListener('keydown',event=>{if(!featureAudio.duration||!['ArrowLeft','ArrowRight'].includes(event.key))return;event.preventDefault();featureAudio.currentTime=Math.max(0,Math.min(featureAudio.duration,featureAudio.currentTime+(event.key==='ArrowRight'?5:-5)))});


// Google Analytics y consentimiento de cookies
(()=>{
  const MEASUREMENT_ID='G-8SFV2TFR2V';
  const CONSENT_KEY='mariazabay_cookie_consent';
  const banner=document.getElementById('cookie-banner');
  const accept=document.getElementById('cookie-accept');
  const reject=document.getElementById('cookie-reject');
  const info=document.getElementById('cookie-info');
  const manage=document.getElementById('manage-cookies');
  const policyOpen=document.getElementById('open-cookie-policy');
  const policy=document.getElementById('cookie-policy-dialog');
  const policyClose=document.getElementById('close-cookie-policy');
  let analyticsLoaded=false;

  const loadAnalytics=()=>{
    if(analyticsLoaded)return;
    analyticsLoaded=true;
    window.dataLayer=window.dataLayer||[];
    window.gtag=window.gtag||function(){window.dataLayer.push(arguments)};
    window.gtag('js',new Date());
    window.gtag('config',MEASUREMENT_ID,{anonymize_ip:true});
    const script=document.createElement('script');
    script.async=true;
    script.src=`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
    document.head.appendChild(script);
  };

  const setConsent=value=>{
    localStorage.setItem(CONSENT_KEY,value);
    banner.hidden=true;
    if(value==='accepted')loadAnalytics();
  };

  const showChoices=()=>{banner.hidden=false};
  const stored=localStorage.getItem(CONSENT_KEY);
  if(stored==='accepted')loadAnalytics();
  else if(stored!=='rejected')showChoices();

  accept?.addEventListener('click',()=>setConsent('accepted'));
  reject?.addEventListener('click',()=>setConsent('rejected'));
  manage?.addEventListener('click',showChoices);
  info?.addEventListener('click',()=>policy?.showModal());
  policyOpen?.addEventListener('click',()=>policy?.showModal());
  policyClose?.addEventListener('click',()=>policy?.close());
  policy?.addEventListener('click',event=>{if(event.target===policy)policy.close()});
})();
