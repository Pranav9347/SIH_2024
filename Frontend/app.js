const sign_in=document.querySelector('#sign-in-button');
console.log(sign_in);
const sign_up=document.querySelector('#sign-up-button');
const container=document.querySelector('.container');
sign_up.addEventListener('click', ()=>{
    console.log("button clicked");
    container.classList.add('sign-up-mode');
});
sign_in.addEventListener('click', ()=>{
    console.log("button clicked");
    container.classList.remove('sign-up-mode');
});

