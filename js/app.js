const storage = (table) => {

    if (!localStorage.getItem(table)) {
        localStorage.setItem(table, JSON.stringify({}));
    }

    const get = (key = null) => {
        let data = JSON.parse(localStorage.getItem(table));
        return key ? data[key] : data;
    };
    const set = (key, value) => {
        let storage = get();
        storage[key] = value;
        localStorage.setItem(table, JSON.stringify(storage));
    };

    const unset = (key) => {
        let storage = get();
        delete storage[key];
        localStorage.setItem(table, JSON.stringify(storage));
    };

    const has = (key) => Object.keys(get()).includes(key);

    return {
        get,
        set,
        unset,
        has,
    };
};


const requestV2 = (method, path) => {

    let url = "https://invitation-api-2.onrender.com";
    let req = {
        method: method.toUpperCase(),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    if (url.slice(-1) == '/') {
        url = url.slice(0, -1);
    }

    return {
        async then(...params) {
            console.log("hola")
            return fetch(url + path, req)
                .then((res) => res.json())
                .then((res) => {
                    if (res.error) {
                        console.log(res.error)
                        throw res.error[0];
                    }

                    return res;
                })
                .then(...params);
        },
        body(body) {
            req.body = JSON.stringify(body);
            return this;
        },
    };
};

const util = (() => {

    const opacity = (nama) => {
        let nm = document.getElementById(nama);
        let op = parseInt(nm.style.opacity);
        let clear = null;

        clear = setInterval(() => {
            if (op >= 0) {
                nm.style.opacity = op.toString();
                op -= 0.025;
            } else {
                clearInterval(clear);
                clear = null;
                nm.remove();
                return;
            }
        }, 10);
    };

    const escapeHtml = (unsafe) => {
        return unsafe
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    };

    const salin = (btn, msg = 'Tersalin', timeout = 1500) => {
        navigator.clipboard.writeText(btn.getAttribute('data-nomer'));

        let tmp = btn.innerHTML;
        btn.innerHTML = msg;
        btn.disabled = true;

        let clear = null;
        clear = setTimeout(() => {
            btn.innerHTML = tmp;
            btn.disabled = false;
            btn.focus();

            clearTimeout(clear);
            clear = null;
            return;
        }, timeout);
    };

    const timer = () => {
        let countDownDate = (new Date(document.getElementById('tampilan-waktu').getAttribute('data-waktu').replace(' ', 'T'))).getTime();

        setInterval(() => {
            let distance = Math.abs(countDownDate - (new Date()).getTime());

            document.getElementById('hari').innerText = Math.floor(distance / (1000 * 60 * 60 * 24));
            document.getElementById('jam').innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            document.getElementById('menit').innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            document.getElementById('detik').innerText = Math.floor((distance % (1000 * 60)) / 1000);
        }, 1000);
    };

    const music = (btn) => {
        if (btn.getAttribute('data-status') !== 'true') {
            btn.setAttribute('data-status', 'true');
            audio.pause()
            btn.innerHTML = '<i class="fa-solid fa-circle-pause spin-button"></i>';
        } else {
            btn.setAttribute('data-status', 'false');
            audio.play();
            btn.innerHTML = '<i class="fa-solid fa-circle-play"></i>';
        }
    };

    const modal = (img) => {
        document.getElementById('show-modal-image').src = img?.src;
        (new bootstrap.Modal('#modal-image'))?.show();
    };

    const tamu = () => {
        let name = (new URLSearchParams(window.location.search)).get('to');

        if (!name) {
            document.getElementById('nama-tamu').remove();
            return;
        }

        let div = document.createElement('div');
        div.classList?.add('m-2');
        div.innerHTML = `<p class="mt-0 mb-1 mx-0 p-0 text-light">Kepada Yth Bapak/Ibu/Saudara/i</p><h2 class="text-light">${escapeHtml(name)}</h2>`;

        document.getElementById('form-nama').value = name;
        document.getElementById('nama-tamu').appendChild(div);
    };

    const animation = () => {
        const duration = 15 * 1000;
        const animationEnd = Date.now() + duration;
        const colors = ["#FFC0CB", "#FF1493", "#C71585"];

        const randomInRange = (min, max) => {
            return Math.random() * (max - min) + min;
        };

        const heart = confetti.shapeFromPath({
            path: 'M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z',
            matrix: [0.03333333333333333, 0, 0, 0.03333333333333333, -5.566666666666666, -5.533333333333333]
        });

        (function frame() {
            const timeLeft = animationEnd - Date.now();

            colors.forEach((color) => {
                confetti({
                    particleCount: 1,
                    startVelocity: 0,
                    ticks: Math.max(50, 100 * (timeLeft / duration)),
                    origin: {
                        x: Math.random(),
                        y: Math.abs(Math.random() - (timeLeft / duration)),
                    },
                    zIndex: 1057,
                    colors: [color],
                    shapes: [heart],
                    drift: randomInRange(-0.5, 0.5),
                    gravity: randomInRange(0.5, 1),
                    scalar: randomInRange(0.5, 1),
                });
            });

            if (timeLeft > 0) {
                requestAnimationFrame(frame);
            }
        })();
    };

    const buka = async (button) => {

        if(!isValidEmail()){
            alert("No es un email valido, revisa si es correcto")
        }else{
            button.disabled = true;
            document.querySelector('body').style.overflowY = 'scroll';
            AOS.init();
            audio.play();
    
            numberOfInvitations()
    
    
            opacity('welcome');
            document.getElementById('tombol-musik').style.display = 'block';
            timer();
    
            confetti({
                origin: { y: 0.9 },
                zIndex: 1057
            });
            await session.check();
            animation();
        

   
        }
    
        
      
    };

    const show = () => {
        tamu();
        opacity('loading');
        window.scrollTo(0, 0);
    };

    const invitados = [
        {"luislamt7@gmail.com":{"cantidad":4}},
        {"angelicaaristimuno@gmail.com":{"cantidad":4}},
        {"ana_17184@hotmail.com":{"cantidad":2}},
        {"yessika_aladejo522@hotmail.com":{"cantidad":2}},
        {"luferodriguezr@gmail.com":{"cantidad":1}},
        {"aristviloria93@gmail.com":{"cantidad":2}},
        {"nahuel.roldan9999@gmail.com":{"cantidad":1}},
        {"fatimarojasc.16@gmail.com":{"cantidad":1}},
        {"aristimunoi5@gmail.com":{"cantidad":1}},
        {"jesus.arao1@gmail.com":{"cantidad":1}},
        {"mora.rolls@gmail.com":{"cantidad":2}},
        {"maringta@yahoo.com":{"cantidad":3}},
        {"maringma96@gmail.com":{"cantidad":1}},
        {"vanesakgutierrezt@gmail.com":{"cantidad":2}},
        {"federicogordin@gmail.com":{"cantidad":1}},
        {"cristinacvargast@gmail.com":{"cantidad":1}},
        {"oreana.febres@gmail.com":{"cantidad":1}},
        {"arisvi1967@gmail.com":{"cantidad":4}},
        {"jsalazar1982@gmail.com":{"cantidad":1}},
        {"ezequielpangare@gmail.com":{"cantidad":1}},
        {"morandihueso@gmail.com":{"cantidad":1}},
        {"mayerling.anton@gmail.com":{"cantidad":2}},

    ]
 

    const animate = (svg, timeout, classes) => {
        let handler = null;

        handler = setTimeout(() => {
            svg.classList?.add(classes);
            handler = null;
        }, timeout);
    };
    const isValidEmail = (()=>{
        const email = document.getElementById("email").value;
        const formatEmail = email.toString().toLowerCase()
        if(formatEmail === "" || !formatEmail){
            return false
        }

        const user = invitados.find(usuario => usuario[formatEmail])

        if(!user){
            return false
        }

        if(user[formatEmail].cantidad > 1){
            const elementos = document.getElementsByClassName("only-user");
            for (var i = elementos.length - 1; i >= 0; i--) {
                elementos[i].parentNode.removeChild(elementos[i]);
            }
        }

        if(user[formatEmail].cantidad === 1){
            
            const elementos = document.getElementsByClassName("group-user");
            for (var i = elementos.length - 1; i >= 0; i--) {
                elementos[i].parentNode.removeChild(elementos[i]);
            }        }

            const formatUser= {
                "email": formatEmail,
                "cantidad": user[formatEmail]?.cantidad
            }

            localStorage.setItem("user", JSON.stringify(formatUser));

        return true
    })

    const numberOfInvitations = (()=>{
        const email = document.getElementById("email").value;
        const formatEmail = email.toString().toLowerCase()
        var selectElement = document.getElementById("form-kehadiran");
        
        invitados.forEach((persona) =>{
            if (persona[formatEmail]) {
                var cantidad = persona[formatEmail].cantidad;
                for (var i = 1; i <= cantidad; i++) {
                    var optionElement = document.createElement("option");
                    optionElement.value = i; // Utiliza el valor numérico consecutivo
                    optionElement.textContent =  i + " persona/s " ;
                    selectElement?.appendChild(optionElement);
                }
            }
        })

    })

    return {
        buka,
        modal,
        music,
        salin,
        escapeHtml,
        show,
        animate
    };
})();



const progress = (() => {

    const assets = document.querySelectorAll('img');
    const info = document.getElementById('progress-info');
    const bar = document.getElementById('bar');

    let total = assets.length;
    let loaded = 0;

    const progress = () => {
        loaded += 1;

        bar.style.width = Math.min((loaded / total) * 100, 100).toString() + "%";
        info.innerText = `Loading assets (${loaded}/${total}) [${parseInt(bar.style.width).toFixed(0)}%]`;

        if (loaded == total) {
            util.show();
        }
    };

    assets.forEach((asset) => {
        if (asset.complete && (asset.naturalWidth !== 0)) {
            progress();
        } else {
            asset.addEventListener('load', () => progress());
        }
    });
})();

const audio = (() => {
    let audio = null;

    const singleton = () => {
        if (!audio) {
            audio = new Audio();
            audio.src = document?.getElementById('tombol-musik').getAttribute('data-url');
            audio.load();
            audio.currentTime = 0;
            audio.autoplay = true;
            audio.muted = false;
            audio.loop = true;
            audio.volume = 1;
        }

        return audio;
    };

    return {
        play: () => singleton().play(),
        pause: () => singleton().pause(),
    };
})();

const comment = (() => {
    const sendAceptation = async () => {
        
     
        const user = JSON.parse(localStorage.getItem("user"));
        const asistConfirmation = document.getElementById("button-asist");
        asistConfirmation.parentNode.removeChild(asistConfirmation);
        const nuevoElemento = document.createElement("p");
        nuevoElemento.className = "spinner-border text-primary mb-0";
        nuevoElemento.setAttribute("role", "status");

        // Selecciona el div al que se agregará el elemento
        const divDestino = document.getElementById("kirim");

        // Agrega el nuevo elemento al div
        divDestino.appendChild(nuevoElemento);


        const selectElement = document.getElementById("form-kehadiran");
        
        let countOfGuestsCopy 

        if(selectElement?.value){
            countOfGuestsCopy= selectElement?.value
        }else{
            countOfGuestsCopy= 1
        }



        await requestV2('POST', '/')
        .body({
            email:user.email,
            countOfGuests: countOfGuestsCopy
        })
        .then((res) => {

            alert("Gracias! Te esperamos")
            window.location.reload();
            if (res.code == 200 || res.code == 201) {
                isSuccess = true;
                localStorage.clear();
            }
        })
        .catch((err) => {
            alert(`No se pudo enviar ${err}`);
        });
    }

    return {
  
        sendAceptation
    };
})();
