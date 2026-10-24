(function(){
  var nav=document.getElementById('nav');
  if(nav){
    var onS=function(){nav.classList.toggle('scrolled',window.scrollY>12)};onS();
    window.addEventListener('scroll',onS,{passive:true});
    var b=nav.querySelector('.rx-menu-btn');
    if(b)b.addEventListener('click',function(){var o=nav.classList.toggle('open');b.setAttribute('aria-expanded',o)});
  }
  var p=document.querySelector('.rx-progress'),art=document.querySelector('.article-wrap');
  if(p&&art){window.addEventListener('scroll',function(){var r=art.getBoundingClientRect(),t=r.height-innerHeight;p.style.width=Math.max(0,Math.min(1,-r.top/(t>0?t:1)))*100+'%'},{passive:true})}
  var els=document.querySelectorAll('.rx-reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.08});
    els.forEach(function(e){io.observe(e)});
  }else els.forEach(function(e){e.classList.add('in')});
})();
