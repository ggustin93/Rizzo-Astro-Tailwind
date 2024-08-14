const a=document.getElementById("language-select");a?.addEventListener("change",t=>{const e=t.target.value,n=window.location.pathname.replace(/^\/[^\/]+/,`/${e}`);window.location.href=n});
