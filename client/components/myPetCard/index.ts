import { state } from "../../state";
export function initMyPetCard() {
	class MyPetCardCompEl extends HTMLElement {
		petId;
		userId;
		petName;
		petImage;
		petDescription;
		petUbication;
		constructor() {
			super();
			this.petId = this.getAttribute("petId");
			this.userId = this.getAttribute("userId");
			this.petName = this.getAttribute("title");
			this.petDescription = this.getAttribute("description");
			this.petImage = this.getAttribute("imageUrl");
			this.petUbication = this.getAttribute("ubication");
		}
		connectedCallback() {
			this.render();
		}
		addListeners() {
			const cardCont = this.querySelector(".card-cont");
			const updateButton = this.querySelector(".update-button");
			const foundButton = this.querySelector(".found-button");
			const deleteButton = this.querySelector(".delete-button");
			const lostState = this.getAttribute("lost");
			if (lostState === "false") {
				(cardCont as any).style["border-color"] = "green";
				(foundButton as any).style["background-color"] = "green";
				(foundButton as any).style.border = "none";
				foundButton.textContent = "Ya fue encontrado!";
			}
			//BOTON BORRAR
			deleteButton.addEventListener("click", () => {
				this.dispatchEvent(
					new CustomEvent("delete", {
						detail: {
							petId: this.petId,
						},
						bubbles: true,
					})
				);
			});

			//BOTON MODIFICAR
			updateButton.addEventListener("click", () => {
				this.dispatchEvent(
					new CustomEvent("update", {
						detail: {
							petId: this.petId,
							userId: this.userId,
							petName: this.petName,
							petImage: this.petImage,
							petDescrption: this.petDescription,
							petUbication: this.petUbication,
						},
						bubbles: true,
						// esto hace que el evento pueda
						// ser escuchado desde un elemento
						// que está más "arriba" en el arbol
					})
				);
			});

			//BOTON MARCAR COMO ENCONTRADO
			foundButton.addEventListener("click", () => {
				this.dispatchEvent(
					new CustomEvent("found", {
						detail: {
							petId: this.petId,
							userId: this.userId,
						},
						bubbles: true,
						// esto hace que el evento pueda
						// ser escuchado desde un elemento
						// que está más "arriba" en el arbol
					})
				);
			});
		}
		render() {
			const title = this.getAttribute("title");
			const description = this.getAttribute("description");
			const imageUrl = this.getAttribute("imageUrl");
			const ubication = this.getAttribute("ubication");
			const petId = this.getAttribute("pet-id");
			var style = document.createElement("style");
			style.innerHTML = `
            .card-cont{
               display:flex;
               flex-direction:column;
               align-items:center;
               text-align: inherit;
               padding-bottom:5px;
               height: 440px;
               width:320px;
               border: solid 3px red;
               border-radius: 5%;
               background-color: #313131;
               color: white;
               box-shadow: 5px 5px 25px 3px #000, 5px 5px 10px 1px #000;
            }
            .image-cont{
               width:307px;
               height:200px
            }
            .image{
               border-radius: 7px 7px 0px 0px;
               width:307px;
               height:200px
            }
            .title-description-cont{
               padding-left:8px;
               padding-right:8px;
            }
            .title{               
               font-size: 20px;
               margin: 0px;
               padding-top:10px;
            }
            .ubication{
               margin: 0px;
               font-size: 14px;
               color: aquamarine;
            }
            .description{
               font-size: 13px;
               margin-bottom: 5px;
            }
            .vermas{
               font-size:20px;
               color: #607d8b;
            }
            .urls-cont{
               display: flex;
               gap:25px;
            }
            .buttons-cont{
               display: flex;
               gap: 30px;
               padding-bottom: 30px;
            }
            .update-button{
               text-align: center;
               height: 55px;
               width: 110px;
               background-color: #97fbda;
               border-radius: 20%;
               border: solid 3px;
               border-color: #30ab81;
               cursor:pointer;
            }
            .update-button:hover{
               background-color:#30ab81;
            }
            .found-button{
               text-align: center;
               height: 55px;
               background-color: burlywood;
               width: 110px;
               border-radius: 20%;
               border: solid 3px #a86307;
               cursor:pointer;
            }
            .found-button:hover{
               background-color:#a86307;
            }
            .delete-button{
               color: white;
               border-radius: 7px;
               background-color: #b90000;
               cursor:pointer;
            }
            .delete-button:hover{
               background-color:#540a0a;
            }

         `;
			this.innerHTML = `
         <div class="card-cont">
         <div class="image-cont">
            <img src="${imageUrl}" alt="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png" class="image"></img>
         </div>   
         <div class="title-description-cont">
            <h3 class="title">${title}</h3>
            <h2 class="ubication">${ubication}</h2>
            <p class="description">${description}</p>
         </div>
         <div class="buttons-cont">

         <div>
         <button class="update-button">Modificar información</button>
         </div>

         <div>
         <button class="found-button">Marcar como encontrado</button>
         </div>

         </div>

         <div>
         <button class="delete-button">Eliminar publicación</button>
         </div>


      </div>
         `;
			this.appendChild(style);
			this.addListeners();
		}
	}
	customElements.define("x-my-pet-card", MyPetCardCompEl);
}
