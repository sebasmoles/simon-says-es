const celeste = document.getElementById('celeste');
const violeta = document.getElementById('violeta');
const naranja = document.getElementById('naranja');
const verde = document.getElementById('verde');
const gameboard = document.getElementById('gameboard');
const btn = document.getElementById('btnEmpezar');
const ULTIMO_NIVEL = 10;


swal('Simon Dice', '¡Recorre los 10 niveles y conviertete en el nuevo rey!', 'info',
      {
        buttons:  "Vamos !"
      })
  .then(() => swal('Instrucciones', 'Repite la secuencia de colores dada por Simon dando click en el color correspondiente en el orden exacto.', 'warning',
      {
        buttons:  "Entendido"
      }));


class Juego {
    constructor() {
        this.inicializar = this.inicializar.bind(this);
        this.siguienteNivel = this.siguienteNivel.bind(this);  // < -- por que hay que hacer esto?
        this.elegirColor = this.elegirColor.bind(this);
        this.inicializar();
        this.siguienteNivel();
    }

    inicializar() {
        this.nivel = 1;
        this.toggle();  // <- explicame esta funcion toggle?
        this.colores = {
          celeste,
          violeta,
          naranja,
          verde
        }
    }


    toggle() {
        if (btn.classList.contains('hide')) {
          btn.classList.remove('hide');
        } else {
          btn.classList.add('hide');
        }
    }


    siguienteNivel() {
        this.subNivel = 0;
        this.color = [];
        this.generarSecuencia();
        this.iluminarSecuencia();
    }
    

  generarSecuencia() {
      this.secuencia = new Array(ULTIMO_NIVEL).fill(0).map(n => Math.floor(Math.random() * 4)); // explicame cual es el flujo de este array?
      for (var i = 0; i < this.secuencia.length; i++) {
        this.color.push(this.transformarNumeroAColor(this.secuencia[i]))
      }
  }


  iluminarSecuencia() {  // Se podria mejorar esta parte, haciendola mas modificable globalmente, ya que si deseo agregarle mas niveles al juego tendria que poner mas .then y eso es impractico en largo plazo.
                          // La pregunta aqui es como?
      this.promesasDeSecuencia(this.color[0], 1000, 0)
        .then(() => this.promesasDeSecuencia(this.color[1], 1000, 1))
        .then(() => this.promesasDeSecuencia(this.color[2], 1000, 2))
        .then(() => this.promesasDeSecuencia(this.color[3], 1000, 3))
        .then(() => this.promesasDeSecuencia(this.color[4], 1000, 4))
        .then(() => this.promesasDeSecuencia(this.color[5], 1000, 5))
        .then(() => this.promesasDeSecuencia(this.color[6], 1000, 6))
        .then(() => this.promesasDeSecuencia(this.color[7], 1000, 7))
        .then(() => this.promesasDeSecuencia(this.color[8], 1000, 8))
        .then(() => this.promesasDeSecuencia(this.color[9], 1000, 9))
        .then(() => this.promesasDeSecuencia('empiezaAJugar', 500 , 10))
  }


  promesasDeSecuencia(color, time, id) {
        if (this.nivel > id) {
          return new Promise((resolve) => {
              setTimeout(() => {
                  resolve(this.iluminarColor(color))
              }, time)
          })
        }

        if (id === 10) {
          this.agregarClick();
        }
  }





    transformarNumeroAColor(numero) {
        switch (numero) {
          case 0:
            return 'celeste';
          case 1:
            return 'violeta';
          case 2:
            return 'naranja';
          case 3:
            return 'verde';
        }
    }


    transformarColorANumero(color) {
        switch (color) {
          case 'celeste':
            return  0;
          case 'violeta':
            return  1;
          case 'naranja':
            return  2;
          case 'verde':
            return  3;
        }
    }


    iluminarColor(color) {
        this.colores[color].classList.add('light');
        setTimeout(() => this.apagarColor(color), 300);
    }

    apagarColor(color){
        this.colores[color].classList.remove('light');
    }

    iluminarColorClick(color) {
        this.colores[color].classList.add('light')
        setTimeout(() => this.apagarColor(color), 30);
    }

    agregarClick(){
        setTimeout(() =>
            {
                this.colores.celeste.addEventListener('click', this.elegirColor)   // <-- explicame bind (todo),  Quien es this y cuando es que?                    this.colores.violeta.addEventListener('click', this.elegirColor)
                this.colores.naranja.addEventListener('click', this.elegirColor)
                this.colores.violeta.addEventListener('click', this.elegirColor)
                this.colores.verde.addEventListener('click', this.elegirColor)
                gameboard.classList.add('cursor')
            }, 1500);
    }

    eliminarClick() {
        this.colores.celeste.removeEventListener('click', this.elegirColor);
        this.colores.violeta.removeEventListener('click', this.elegirColor);
        this.colores.naranja.removeEventListener('click', this.elegirColor);
        this.colores.verde.removeEventListener('click', this.elegirColor);
    }


    elegirColor(ev) {
        const nombreColor = ev.target.dataset.color;
        const numeroColor = this.transformarColorANumero(nombreColor);
        this.numeroColor = numeroColor;
        this.iluminarColorClick(nombreColor);
        setTimeout(() => this.finalizar(), 100);
    }


    finalizar() {
      if (this.numeroColor === this.secuencia[this.subNivel])
      {
        this.subNivel++;

        if (this.subNivel === this.nivel)
          this.nivel++;
        else if(this.subNivel < this.nivel)
          return;

            if (this.nivel === (ULTIMO_NIVEL + 1)) {
              this.reiniciarJuego();
              this.ganoElJuego();
            }
            else {
              swal('¡Has subido de nivel!', 'Estas en el nivel: ' + this.nivel, 'success')
                .then(() => {
                  this.reiniciarJuego();
                  this.siguienteNivel();
                })
            }
        } else
          {
            this.reiniciarJuego();
            this.perdioElJuego();
          }
      }

    reiniciarJuego() {
        this.eliminarClick();
        gameboard.classList.remove('cursor');
    }  

    ganoElJuego() {
        swal('Ganaste', '¡Felicitaciones has ganado nuevo rey Simon!', 'success')
          .then(this.inicializar());
    }

    perdioElJuego() {
        swal('Perdiste', 'Lo sentimos, intentalo de nuevo.', 'error')
          .then(() => {
              this.eliminarClick();
              this.inicializar();
          })
    }
}

function empezarJuego() {
    let juego = new Juego();
}